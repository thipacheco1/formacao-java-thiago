# 151 — M5.06 — Remoção segura em listas

## Objetivo da aula

Nesta aula você vai aprofundar um ponto que causa muito erro em Java:

```text
remover elementos de uma lista enquanto percorre essa lista.
```

Na aula anterior, você estudou:

```text
for tradicional;
foreach;
Iterator;
busca;
contagem;
atualização;
remoção com Iterator.
```

Agora vamos focar especificamente em remoção segura.

Ao final da aula, você deve conseguir:

```text
entender por que remover dentro de foreach é perigoso;
entender o que é modificação estrutural da lista;
entender por que ConcurrentModificationException acontece;
remover com Iterator corretamente;
remover percorrendo de trás para frente;
remover usando removeIf;
criar nova lista filtrada sem alterar a original;
entender quando usar cada estratégia;
remover objetos por status;
evitar pular elementos ao remover com índice;
aplicar remoção segura em cenários parecidos com backend.
```

Essa aula é muito prática.

Em backend, você vai precisar limpar listas, filtrar dados, remover inválidos e descartar itens que não devem seguir no fluxo.

---

## Ideia principal

Remover elementos de lista parece simples.

Mas se você fizer errado, pode causar erro ou comportamento inesperado.

Exemplo perigoso:

```java
for (String codigo : codigos) {
    if (codigo.startsWith("CANCELADA")) {
        codigos.remove(codigo);
    }
}
```

Isso pode gerar:

```text
ConcurrentModificationException
```

Ou pode fazer você pular elementos.

O jeito correto depende do cenário.

As principais estratégias são:

```text
usar Iterator;
percorrer de trás para frente;
usar removeIf;
criar uma nova lista filtrada.
```

---

## Por que remover é diferente de apenas ler

Percorrer uma lista para imprimir é simples:

```java
for (String codigo : codigos) {
    System.out.println(codigo);
}
```

Percorrer para contar também é simples:

```java
for (String codigo : codigos) {
    if (codigo.startsWith("OS-")) {
        total++;
    }
}
```

Mas remover muda a estrutura da lista.

Isso significa que a lista perde elementos e seus índices mudam.

Essa alteração estrutural durante a iteração precisa ser feita com cuidado.

---

## O que é modificação estrutural

Modificação estrutural é uma alteração que muda o tamanho ou a estrutura da coleção.

Exemplos:

```text
add;
remove;
clear;
removeIf.
```

Essas operações mudam a quantidade de elementos.

Alterar o estado de um objeto dentro da lista não é a mesma coisa.

Exemplo permitido:

```java
for (OrdemServico os : ordens) {
    os.reagendar();
}
```

Aqui você alterou o objeto.

Mas não removeu nem adicionou elemento na lista.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-151-remocao-segura-em-listas
cd labs\m5\aula-151-remocao-segura-em-listas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula151
mkdir src\br\com\curso\aula151\app
mkdir src\br\com\curso\aula151\dominio
mkdir src\br\com\curso\aula151\dominio\ordemservico
```

---

## Exemplo errado com foreach

Crie:

```text
src\br\com\curso\aula151\app\RemocaoErradaForeachApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoErradaForeachApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0003");

        try {
            for (String codigo : codigos) {
                if (codigo.equals("REMOVER")) {
                    codigos.remove(codigo);
                }
            }
        } catch (RuntimeException erro) {
            System.out.println("Erro capturado: " + erro.getClass().getSimpleName());
            System.out.println("Mensagem: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("Lista após tentativa:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.RemocaoErradaForeachApp
```

---

## O que observar

O `foreach` não foi feito para você remover diretamente da lista enquanto percorre.

Quando você chama:

```java
codigos.remove(codigo);
```

dentro do `foreach`, a lista muda enquanto está sendo percorrida.

Isso pode causar:

```text
ConcurrentModificationException
```

Essa exceção significa, em linguagem prática:

```text
a coleção foi modificada de forma insegura enquanto estava sendo iterada.
```

---

## Exemplo perigoso com for para frente

Algumas pessoas tentam resolver usando `for` tradicional.

Mas também pode dar problema se fizer de qualquer jeito.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoForFrentePulandoElementoApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoForFrentePulandoElementoApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("REMOVER");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");

        System.out.println("Antes:");
        imprimir(codigos);

        for (int i = 0; i < codigos.size(); i++) {
            if (codigos.get(i).equals("REMOVER")) {
                codigos.remove(i);
            }
        }

        System.out.println();
        System.out.println("Depois:");
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
java -cp out br.com.curso.aula151.app.RemocaoForFrentePulandoElementoApp
```

---

## Por que o for para frente pode pular elemento

Imagine a lista:

```text
0 REMOVER
1 REMOVER
2 OS-2026-0001
```

Quando remove a posição 0, a antiga posição 1 vai para a posição 0.

Mas o `i` avança para 1.

Resultado:

```text
um elemento pode ser pulado.
```

Por isso, remover com índice indo para frente precisa de muito cuidado.

---

## Estratégia 1 — Iterator

A forma clássica e segura é usar `Iterator`.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoComIteratorApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RemocaoComIteratorApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0003");

        System.out.println("Antes:");
        imprimir(codigos);

        Iterator<String> iterator = codigos.iterator();

        while (iterator.hasNext()) {
            String codigo = iterator.next();

            if (codigo.equals("REMOVER")) {
                iterator.remove();
            }
        }

        System.out.println();
        System.out.println("Depois:");
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
java -cp out br.com.curso.aula151.app.RemocaoComIteratorApp
```

---

## Por que Iterator é seguro

O `Iterator` controla o processo de iteração.

Quando você usa:

```java
iterator.remove();
```

ele remove o último elemento retornado por:

```java
iterator.next();
```

Ou seja, quem está percorrendo é também quem está removendo.

Isso mantém o processo coerente.

Regra prática:

```text
se está usando Iterator para percorrer, use o próprio Iterator para remover.
```

---

## Cuidado com Iterator.remove

Você só pode chamar:

```java
iterator.remove();
```

depois de chamar:

```java
iterator.next();
```

Exemplo errado:

```java
Iterator<String> iterator = codigos.iterator();
iterator.remove();
```

Crie:

```text
src\br\com\curso\aula151\app\IteratorRemoveSemNextApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorRemoveSemNextApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");

        Iterator<String> iterator = codigos.iterator();

        try {
            iterator.remove();
        } catch (IllegalStateException erro) {
            System.out.println("Erro: remove foi chamado antes de next.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.IteratorRemoveSemNextApp
```

---

## Estratégia 2 — Percorrer de trás para frente

Outra estratégia segura é percorrer com índice de trás para frente.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoDeTrasParaFrenteApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoDeTrasParaFrenteApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("REMOVER");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");

        System.out.println("Antes:");
        imprimir(codigos);

        for (int i = codigos.size() - 1; i >= 0; i--) {
            if (codigos.get(i).equals("REMOVER")) {
                codigos.remove(i);
            }
        }

        System.out.println();
        System.out.println("Depois:");
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
java -cp out br.com.curso.aula151.app.RemocaoDeTrasParaFrenteApp
```

---

## Por que remover de trás para frente funciona

Quando você remove do fim para o começo, os índices dos elementos que ainda serão analisados não são deslocados para trás de forma problemática.

Exemplo:

```text
0 A
1 REMOVER
2 B
3 REMOVER
4 C
```

Você começa no índice 4.

Depois vai para 3.

Remove 3.

Depois vai para 2, 1, 0.

Isso evita pular elementos.

---

## Quando usar remoção de trás para frente

Use essa estratégia quando:

```text
você precisa do índice;
a lista é uma List;
a regra depende da posição;
você quer remover com remove(i);
o código fica claro com índice.
```

Exemplo:

```java
for (int i = lista.size() - 1; i >= 0; i--) {
    if (deveRemover(lista.get(i))) {
        lista.remove(i);
    }
}
```

É uma técnica clássica.

---

## Estratégia 3 — removeIf

Java possui um método muito prático:

```java
removeIf
```

Ele remove elementos que satisfazem uma condição.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoComRemoveIfApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoComRemoveIfApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0003");

        System.out.println("Antes:");
        imprimir(codigos);

        boolean removeu = codigos.removeIf(codigo -> codigo.equals("REMOVER"));

        System.out.println();
        System.out.println("Removeu algum item? " + removeu);

        System.out.println();
        System.out.println("Depois:");
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
java -cp out br.com.curso.aula151.app.RemocaoComRemoveIfApp
```

---

## Entendendo removeIf sem aprofundar lambda

Este trecho:

```java
codigos.removeIf(codigo -> codigo.equals("REMOVER"));
```

pode ser lido assim:

```text
remova todo código cujo valor seja igual a REMOVER.
```

O trecho:

```java
codigo -> codigo.equals("REMOVER")
```

é uma expressão lambda.

Ainda vamos aprofundar lambdas e Streams mais adiante.

Por enquanto, leia como:

```text
para cada código, teste esta condição.
Se a condição for verdadeira, remova.
```

---

## Retorno do removeIf

`removeIf` retorna `boolean`.

```java
boolean removeu = codigos.removeIf(...);
```

Se removeu pelo menos um elemento, retorna:

```text
true
```

Se não removeu nenhum, retorna:

```text
false
```

Isso é útil para mensagens.

---

## Estratégia 4 — Criar nova lista filtrada

Às vezes você não quer alterar a lista original.

Você quer criar outra lista apenas com os itens válidos.

Crie:

```text
src\br\com\curso\aula151\app\NovaListaFiltradaApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class NovaListaFiltradaApp {
    public static void main(String[] args) {
        List<String> codigosOriginais = new ArrayList<>();

        codigosOriginais.add("OS-2026-0001");
        codigosOriginais.add("REMOVER");
        codigosOriginais.add("OS-2026-0002");
        codigosOriginais.add("REMOVER");
        codigosOriginais.add("OS-2026-0003");

        List<String> codigosValidos = new ArrayList<>();

        for (String codigo : codigosOriginais) {
            if (!codigo.equals("REMOVER")) {
                codigosValidos.add(codigo);
            }
        }

        System.out.println("Lista original:");
        imprimir(codigosOriginais);

        System.out.println();
        System.out.println("Lista filtrada:");
        imprimir(codigosValidos);
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
java -cp out br.com.curso.aula151.app.NovaListaFiltradaApp
```

---

## Quando criar nova lista

Crie uma nova lista quando:

```text
você quer preservar a lista original;
você está montando uma resposta;
você quer separar válidos e inválidos;
você está preparando um relatório;
você quer deixar a operação mais explícita;
você não quer modificar a coleção recebida por parâmetro.
```

Essa abordagem é muito usada em backend.

Exemplo:

```text
recebo uma lista de OS;
monto outra lista apenas com OS abertas;
retorno a lista filtrada.
```

---

## Domínio para exemplos com objetos

Agora vamos trabalhar com objetos.

Crie:

```text
src\br\com\curso\aula151\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula151.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula151\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula151.dominio.ordemservico;

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

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public boolean cancelada() {
        return status == StatusOs.CANCELADA;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
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

## Remover objetos cancelados com Iterator

Crie:

```text
src\br\com\curso\aula151\app\IteratorRemoverCanceladasApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import br.com.curso.aula151.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula151.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorRemoverCanceladasApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        System.out.println("Antes:");
        imprimir(ordens);

        Iterator<ResumoOrdemServico> iterator = ordens.iterator();

        while (iterator.hasNext()) {
            ResumoOrdemServico os = iterator.next();

            if (os.cancelada()) {
                iterator.remove();
            }
        }

        System.out.println();
        System.out.println("Depois de remover canceladas:");
        imprimir(ordens);
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
                StatusOs.CONCLUIDA
        ));

        return ordens;
    }

    private static void imprimir(List<ResumoOrdemServico> ordens) {
        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.IteratorRemoverCanceladasApp
```

---

## Remover objetos cancelados com removeIf

Crie:

```text
src\br\com\curso\aula151\app\RemoveIfRemoverCanceladasApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import br.com.curso.aula151.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula151.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RemoveIfRemoverCanceladasApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        System.out.println("Antes:");
        imprimir(ordens);

        boolean removeu = ordens.removeIf(os -> os.cancelada());

        System.out.println();
        System.out.println("Removeu canceladas? " + removeu);

        System.out.println();
        System.out.println("Depois:");
        imprimir(ordens);
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

        return ordens;
    }

    private static void imprimir(List<ResumoOrdemServico> ordens) {
        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.RemoveIfRemoverCanceladasApp
```

---

## Criar nova lista apenas com OS abertas

Crie:

```text
src\br\com\curso\aula151\app\NovaListaApenasAbertasApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import br.com.curso.aula151.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula151.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class NovaListaApenasAbertasApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        List<ResumoOrdemServico> abertas = new ArrayList<>();

        for (ResumoOrdemServico os : ordens) {
            if (!os.encerrada()) {
                abertas.add(os);
            }
        }

        System.out.println("Lista original:");
        imprimir(ordens);

        System.out.println();
        System.out.println("Somente abertas:");
        imprimir(abertas);
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

    private static void imprimir(List<ResumoOrdemServico> ordens) {
        if (ordens.isEmpty()) {
            System.out.println("- Nenhuma OS.");
            return;
        }

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.NovaListaApenasAbertasApp
```

---

## Remover ou filtrar?

Existe uma diferença importante:

```text
remover altera a lista original;
filtrar para nova lista preserva a original.
```

Use remoção quando a regra é realmente limpar a lista original.

Use nova lista quando você quer apenas uma visão filtrada.

Exemplo de remoção:

```text
remover itens inválidos antes de processar.
```

Exemplo de nova lista:

```text
exibir apenas OS abertas em uma tela, mantendo a lista original.
```

---

## Quatro estratégias comparadas

### foreach com remove direto

Evite.

```java
for (String item : lista) {
    lista.remove(item);
}
```

### Iterator

Bom para remoção durante iteração.

```java
Iterator<String> iterator = lista.iterator();

while (iterator.hasNext()) {
    String item = iterator.next();

    if (deveRemover(item)) {
        iterator.remove();
    }
}
```

### for de trás para frente

Bom quando precisa de índice.

```java
for (int i = lista.size() - 1; i >= 0; i--) {
    if (deveRemover(lista.get(i))) {
        lista.remove(i);
    }
}
```

### removeIf

Simples e expressivo.

```java
lista.removeIf(item -> deveRemover(item));
```

### nova lista

Boa para preservar original.

```java
List<String> filtrados = new ArrayList<>();

for (String item : lista) {
    if (!deveRemover(item)) {
        filtrados.add(item);
    }
}
```

---

## Método auxiliar para regra de remoção

Em vez de deixar a condição espalhada, você pode criar método auxiliar.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoComMetodoAuxiliarApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoComMetodoAuxiliarApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("");
        codigos.add("   ");
        codigos.add("OS-2026-0002");
        codigos.add(null);
        codigos.add("OS-2026-0003");

        codigos.removeIf(codigo -> invalido(codigo));

        System.out.println("Códigos válidos:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }

    private static boolean invalido(String codigo) {
        return codigo == null || codigo.isBlank();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.RemocaoComMetodoAuxiliarApp
```

---

## Por que método auxiliar ajuda

Compare:

```java
codigos.removeIf(codigo -> codigo == null || codigo.isBlank());
```

com:

```java
codigos.removeIf(codigo -> invalido(codigo));
```

O segundo comunica melhor a intenção.

Código profissional não é só funcionar.

Ele precisa ser lido com facilidade.

---

## Mini-cadastro com limpeza de canceladas

Crie:

```text
src\br\com\curso\aula151\app\CadastroLimpezaCanceladasApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import br.com.curso.aula151.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula151.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CadastroLimpezaCanceladasApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        System.out.println("Antes da limpeza:");
        imprimir(ordens);

        int quantidadeRemovida = removerCanceladas(ordens);

        System.out.println();
        System.out.println("Quantidade removida: " + quantidadeRemovida);

        System.out.println();
        System.out.println("Depois da limpeza:");
        imprimir(ordens);
    }

    private static int removerCanceladas(List<ResumoOrdemServico> ordens) {
        int antes = ordens.size();

        ordens.removeIf(os -> os.cancelada());

        int depois = ordens.size();

        return antes - depois;
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
                StatusOs.REAGENDADA
        ));

        return ordens;
    }

    private static void imprimir(List<ResumoOrdemServico> ordens) {
        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.CadastroLimpezaCanceladasApp
```

---

## O que este mini-cadastro demonstra

Ele mostra uma operação muito comum:

```text
remover de uma lista os elementos que não devem continuar no fluxo.
```

Também mostra como calcular a quantidade removida:

```java
int antes = ordens.size();
ordens.removeIf(...);
int depois = ordens.size();

return antes - depois;
```

Isso é útil em relatórios e logs.

---

## Cuidado com listas imutáveis

Se a lista foi criada com:

```java
List.of(...)
```

ela não aceita remoção.

Crie:

```text
src\br\com\curso\aula151\app\RemocaoEmListaImutavelApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.List;

public class RemocaoEmListaImutavelApp {
    public static void main(String[] args) {
        List<String> codigos = List.of(
                "OS-2026-0001",
                "REMOVER",
                "OS-2026-0002"
        );

        try {
            codigos.removeIf(codigo -> codigo.equals("REMOVER"));
        } catch (UnsupportedOperationException erro) {
            System.out.println("Lista criada com List.of não permite remoção.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula151.app.RemocaoEmListaImutavelApp
```

---

## Como resolver lista imutável

Se você precisa modificar, crie uma `ArrayList` a partir dela:

```java
List<String> codigos = new ArrayList<>(List.of(
        "OS-2026-0001",
        "REMOVER",
        "OS-2026-0002"
));
```

Crie:

```text
src\br\com\curso\aula151\app\RemocaoEmArrayListMutavelApp.java
```

Código:

```java
package br.com.curso.aula151.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoEmArrayListMutavelApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>(List.of(
                "OS-2026-0001",
                "REMOVER",
                "OS-2026-0002"
        ));

        codigos.removeIf(codigo -> codigo.equals("REMOVER"));

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
java -cp out br.com.curso.aula151.app.RemocaoEmArrayListMutavelApp
```

---

## Guia de decisão

Use este guia:

```text
Preciso remover enquanto percorro e quero controle explícito?
Iterator.

Preciso remover por índice ou a posição importa?
for de trás para frente.

Quero remover por uma condição simples?
removeIf.

Quero preservar a lista original?
criar nova lista filtrada.

A lista veio de List.of?
não tente remover; crie uma ArrayList mutável ou filtre para outra lista.
```

---

## Ligação com backend

Remoção segura aparece em muitos cenários:

```text
remover itens inválidos antes de processar;
remover OS canceladas de um painel;
remover permissões desativadas;
remover produtos sem estoque;
remover notificações expiradas;
remover dados duplicados após validação;
montar uma nova lista apenas com itens elegíveis.
```

Mas lembre:

```text
remover da lista não é o mesmo que deletar do banco.
```

Uma lista em memória é só uma estrutura temporária.

Deletar no banco envolve repository, transação e regra de negócio.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ver o problema

Execute:

```powershell
java -cp out br.com.curso.aula151.app.RemocaoErradaForeachApp
java -cp out br.com.curso.aula151.app.RemocaoForFrentePulandoElementoApp
```

Observe o erro e o comportamento estranho.

### Parte 2 — Remover corretamente

Execute:

```powershell
java -cp out br.com.curso.aula151.app.RemocaoComIteratorApp
java -cp out br.com.curso.aula151.app.RemocaoDeTrasParaFrenteApp
java -cp out br.com.curso.aula151.app.RemocaoComRemoveIfApp
```

Compare as estratégias.

### Parte 3 — Filtrar sem alterar original

Execute:

```powershell
java -cp out br.com.curso.aula151.app.NovaListaFiltradaApp
```

Observe que a lista original continua igual.

### Parte 4 — Remover objetos

Execute:

```powershell
java -cp out br.com.curso.aula151.app.IteratorRemoverCanceladasApp
java -cp out br.com.curso.aula151.app.RemoveIfRemoverCanceladasApp
java -cp out br.com.curso.aula151.app.NovaListaApenasAbertasApp
```

### Parte 5 — Listas imutáveis

Execute:

```powershell
java -cp out br.com.curso.aula151.app.RemocaoEmListaImutavelApp
java -cp out br.com.curso.aula151.app.RemocaoEmArrayListMutavelApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula151\app\LimpezaCodigosInvalidosApp.java
```

Ele deve:

```text
criar uma List<String>;
adicionar códigos válidos, strings vazias, strings em branco e null;
remover os inválidos com removeIf;
exibir a quantidade antes;
exibir a quantidade depois;
exibir a quantidade removida;
exibir os códigos finais.
```

Regra de inválido:

```text
null;
texto em branco;
texto que não começa com OS-.
```

Critério principal:

```text
usar método auxiliar codigoInvalido(String codigo).
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula151\app\SepararOrdensAbertasEEncerradasApp.java
```

Ele deve:

```text
criar uma List<ResumoOrdemServico>;
adicionar pelo menos 6 OS;
criar uma nova lista para abertas;
criar uma nova lista para encerradas;
não alterar a lista original;
exibir as três listas.
```

Critério principal:

```text
usar nova lista filtrada, não removeIf.
```

---

## Erros comuns nesta aula

### 1. Remover dentro de foreach

Evite:

```java
for (String item : lista) {
    lista.remove(item);
}
```

### 2. Usar for para frente removendo por índice

Pode pular elementos.

### 3. Chamar iterator.remove antes de iterator.next

Isso gera `IllegalStateException`.

### 4. Usar removeIf em lista imutável

`List.of` não aceita remoção.

### 5. Remover quando deveria filtrar

Se precisa preservar original, crie outra lista.

### 6. Não tratar null na condição

Se a lista pode ter `null`, a condição precisa verificar.

Errado:

```java
codigo.isBlank()
```

se `codigo` pode ser `null`.

Correto:

```java
codigo == null || codigo.isBlank()
```

### 7. Misturar regra de banco com lista em memória

Remover da lista não significa deletar do banco.

### 8. Criar condição complexa demais dentro do removeIf

Use método auxiliar para clareza.

---

## Debug recomendado

Use debug em:

```text
RemocaoErradaForeachApp.java
RemocaoForFrentePulandoElementoApp.java
RemocaoComIteratorApp.java
RemocaoDeTrasParaFrenteApp.java
RemocaoComRemoveIfApp.java
NovaListaFiltradaApp.java
CadastroLimpezaCanceladasApp.java
```

Breakpoints recomendados:

```java
codigos.remove(codigo)

for (int i = 0; i < codigos.size(); i++)

Iterator<String> iterator = codigos.iterator()

iterator.hasNext()

iterator.next()

iterator.remove()

codigos.removeIf(...)

codigosValidos.add(codigo)
```

Observe:

```text
como a lista muda de tamanho;
como índices mudam após remoção;
como o Iterator remove sem quebrar;
como removeIf simplifica;
como a nova lista preserva a original;
como calcular quantidade removida.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que remover dentro de foreach é perigoso?
2. Quando usar Iterator?
3. Quando criar uma nova lista filtrada em vez de remover da original?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar modificação estrutural;
explicar ConcurrentModificationException em termos práticos;
remover com Iterator;
remover de trás para frente;
remover com removeIf;
criar nova lista filtrada;
remover objetos por status;
tratar listas imutáveis;
evitar null em condição;
escolher estratégia de remoção;
resolver LimpezaCodigosInvalidosApp;
resolver SepararOrdensAbertasEEncerradasApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-151-remocao-segura-em-listas
git commit -m "Aula 151: remocao segura em listas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
remover elementos de uma lista exige escolher a estratégia correta para não quebrar a iteração nem pular dados.
```

Você aprendeu quatro caminhos importantes:

```text
Iterator;
for de trás para frente;
removeIf;
nova lista filtrada.
```

Na próxima aula, vamos estudar `LinkedList` e comparar com `ArrayList`.

Vamos entender quando faz sentido conhecer outra implementação de `List` e quais diferenças existem entre elas.
