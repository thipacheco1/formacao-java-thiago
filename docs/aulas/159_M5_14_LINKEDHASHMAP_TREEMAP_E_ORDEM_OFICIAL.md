# 159 — M5.14 — LinkedHashMap, TreeMap e ordem

## Objetivo da aula

Nesta aula você vai aprofundar implementações de `Map` que tratam ordem de formas diferentes:

```text
HashMap;
LinkedHashMap;
TreeMap.
```

Nas aulas anteriores, você estudou:

```text
Map;
HashMap;
operações essenciais;
objetos como chave;
equals e hashCode em chaves.
```

Agora vamos estudar um ponto muito importante:

```text
ordem de iteração em mapas.
```

Ao final da aula, você deve conseguir:

```text
explicar que HashMap não garante ordem;
explicar que LinkedHashMap preserva ordem de inserção;
explicar que TreeMap ordena pelas chaves;
comparar HashMap, LinkedHashMap e TreeMap;
entender que chave continua sendo única;
entender que put em chave existente atualiza valor;
entender que LinkedHashMap não ordena, apenas preserva inserção;
entender que TreeMap precisa comparar chaves;
usar TreeMap com String;
usar TreeMap com Integer;
usar TreeMap com enum;
usar TreeMap com objeto Comparable;
entender erro ao usar TreeMap com chave não comparável;
escolher implementação de Map conforme requisito.
```

Esta aula fecha a visão inicial de `Map` com ordem.

---

## Ideia principal

Todas estas estruturas são mapas:

```text
HashMap;
LinkedHashMap;
TreeMap.
```

Todas guardam pares:

```text
chave -> valor
```

Todas possuem chaves únicas.

Mas elas se comportam diferente na hora de percorrer.

Resumo inicial:

```text
HashMap:
não garante ordem.

LinkedHashMap:
preserva ordem de inserção.

TreeMap:
mantém as chaves ordenadas.
```

---

## Relembrando chave única

Em qualquer `Map`, a chave é única.

Exemplo:

```java
mapa.put("OS-2026-0001", "Ana Silva");
mapa.put("OS-2026-0001", "Ana Silva Atualizada");
```

Isso não cria duas entradas.

Cria uma entrada com valor atualizado.

Regra:

```text
chave não repete;
valor pode ser substituído;
valor pode repetir em chaves diferentes.
```

Essa regra vale para `HashMap`, `LinkedHashMap` e `TreeMap`.

---

## Por que ordem importa

Em alguns cenários, a ordem não importa.

Exemplo:

```text
verificar se uma chave existe;
buscar OS por código;
contar status;
validar duplicidade.
```

Mas em outros cenários, a ordem importa:

```text
exibir na mesma ordem em que foi importado;
gerar relatório ordenado por código;
mostrar parâmetros na ordem cadastrada;
processar itens na ordem de chegada;
exibir ranking ordenado por chave.
```

Quando a ordem importa, você precisa escolher a implementação certa.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-159-linkedhashmap-treemap-e-ordem
cd labs\m5\aula-159-linkedhashmap-treemap-e-ordem
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula159
mkdir src\br\com\curso\aula159\app
mkdir src\br\com\curso\aula159\dominio
mkdir src\br\com\curso\aula159\dominio\valor
mkdir src\br\com\curso\aula159\dominio\ordemservico
mkdir src\br\com\curso\aula159\dominio\ruim
```

---

## HashMap não garante ordem

Crie:

```text
src\br\com\curso\aula159\app\HashMapSemOrdemGarantidaApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapSemOrdemGarantidaApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0004", "Bruno Rocha");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("HashMap sem ordem garantida:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.HashMapSemOrdemGarantidaApp
```

---

## O que observar

Você inseriu nesta ordem:

```text
OS-2026-0003;
OS-2026-0001;
OS-2026-0004;
OS-2026-0002.
```

Mas o `HashMap` não promete devolver nessa ordem.

Mesmo que em uma execução pareça ordenado ou pareça manter ordem, não dependa disso.

Regra prática:

```text
se ordem importa, não use HashMap esperando ordem.
```

---

## LinkedHashMap preserva ordem de inserção

Crie:

```text
src\br\com\curso\aula159\app\LinkedHashMapOrdemInsercaoApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapOrdemInsercaoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new LinkedHashMap<>();

        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0004", "Bruno Rocha");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("LinkedHashMap preservando ordem de inserção:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.LinkedHashMapOrdemInsercaoApp
```

---

## O que observar

A saída segue a ordem de inserção:

```text
OS-2026-0003;
OS-2026-0001;
OS-2026-0004;
OS-2026-0002.
```

Isso é útil quando você precisa manter a ordem em que os dados chegaram.

Exemplo:

```text
arquivo importado;
payload recebido;
ordem de cadastro;
ordem de exibição definida pelo usuário.
```

---

## TreeMap ordena pelas chaves

Crie:

```text
src\br\com\curso\aula159\app\TreeMapOrdenadoPorChaveApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapOrdenadoPorChaveApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new TreeMap<>();

        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0004", "Bruno Rocha");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("TreeMap ordenado por chave:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapOrdenadoPorChaveApp
```

---

## O que observar

A saída fica ordenada pela chave:

```text
OS-2026-0001;
OS-2026-0002;
OS-2026-0003;
OS-2026-0004.
```

O `TreeMap` não preserva ordem de chegada.

Ele ordena.

Regra:

```text
TreeMap organiza pelas chaves.
```

---

## Comparando os três mapas

Crie:

```text
src\br\com\curso\aula159\app\ComparacaoMapOrdemApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class ComparacaoMapOrdemApp {
    public static void main(String[] args) {
        Map<String, String> hashMap = new HashMap<>();
        Map<String, String> linkedHashMap = new LinkedHashMap<>();
        Map<String, String> treeMap = new TreeMap<>();

        preencher(hashMap);
        preencher(linkedHashMap);
        preencher(treeMap);

        imprimir("HashMap - sem ordem garantida", hashMap);
        imprimir("LinkedHashMap - ordem de inserção", linkedHashMap);
        imprimir("TreeMap - ordenado pela chave", treeMap);
    }

    private static void preencher(Map<String, String> mapa) {
        mapa.put("OS-2026-0003", "Mariana Lima");
        mapa.put("OS-2026-0001", "Ana Silva");
        mapa.put("OS-2026-0004", "Bruno Rocha");
        mapa.put("OS-2026-0002", "Carlos Souza");
    }

    private static void imprimir(String titulo, Map<String, String> mapa) {
        System.out.println();
        System.out.println(titulo);

        for (Map.Entry<String, String> entrada : mapa.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.ComparacaoMapOrdemApp
```

---

## O que a comparação mostra

A mesma entrada de dados gera comportamentos diferentes:

```text
HashMap:
não garanta ordem.

LinkedHashMap:
mantém ordem em que os pares foram inseridos.

TreeMap:
ordena pelas chaves.
```

A escolha depende do requisito.

Não escolha por costume.

Escolha pelo comportamento necessário.

---

## Atualizar chave existente no LinkedHashMap

Um detalhe importante:

```text
atualizar uma chave existente em LinkedHashMap não muda a posição dela.
```

Crie:

```text
src\br\com\curso\aula159\app\LinkedHashMapAtualizacaoNaoMoveApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapAtualizacaoNaoMoveApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new LinkedHashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        clientesPorOs.put("OS-2026-0001", "Ana Silva Atualizada");

        System.out.println("LinkedHashMap após atualizar a primeira chave:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.LinkedHashMapAtualizacaoNaoMoveApp
```

---

## O que observar

A chave:

```text
OS-2026-0001
```

continua na primeira posição.

O valor muda.

A posição não muda.

Por padrão, `LinkedHashMap` preserva a ordem de inserção da chave.

Isso é diferente de dizer:

```text
ordem de última atualização.
```

Essa diferença importa em algumas regras.

---

## LinkedHashMap em importação

Um uso comum:

```text
remover duplicidade de códigos mantendo a primeira ordem de chegada.
```

Crie:

```text
src\br\com\curso\aula159\app\ImportacaoLinkedHashMapApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ImportacaoLinkedHashMapApp {
    public static void main(String[] args) {
        List<String> linhasImportadas = List.of(
                "OS-2026-0003;Mariana Lima",
                "OS-2026-0001;Ana Silva",
                "OS-2026-0003;Mariana Lima Atualizada",
                "OS-2026-0002;Carlos Souza"
        );

        Map<String, String> clientesPorOs = new LinkedHashMap<>();

        for (String linha : linhasImportadas) {
            String[] partes = linha.split(";");
            String codigo = partes[0];
            String cliente = partes[1];

            clientesPorOs.putIfAbsent(codigo, cliente);
        }

        System.out.println("Importação mantendo primeira aparição:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.ImportacaoLinkedHashMapApp
```

---

## O que esse exemplo mostra

A linha duplicada:

```text
OS-2026-0003;Mariana Lima Atualizada
```

não substitui a primeira porque usamos:

```java
putIfAbsent
```

E o `LinkedHashMap` mantém a ordem da primeira aparição.

Esse padrão é útil quando o requisito é:

```text
considerar o primeiro registro recebido e ignorar repetidos.
```

---

## TreeMap com números

Crie:

```text
src\br\com\curso\aula159\app\TreeMapNumerosApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapNumerosApp {
    public static void main(String[] args) {
        Map<Integer, String> nomesPorPrioridade = new TreeMap<>();

        nomesPorPrioridade.put(3, "Baixa");
        nomesPorPrioridade.put(1, "Crítica");
        nomesPorPrioridade.put(2, "Alta");

        System.out.println("Prioridades ordenadas pela chave numérica:");

        for (Map.Entry<Integer, String> entrada : nomesPorPrioridade.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapNumerosApp
```

---

## TreeMap ordena pela chave, não pelo valor

No exemplo:

```java
Map<Integer, String> nomesPorPrioridade
```

o `TreeMap` ordena pelo `Integer`.

Não ordena pelo nome:

```text
Baixa;
Crítica;
Alta.
```

Ele ordena pelas chaves:

```text
1;
2;
3.
```

Regra:

```text
TreeMap ordena por chave.
```

---

## TreeMap com enum

Crie:

```text
src\br\com\curso\aula159\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula159.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula159\app\TreeMapEnumApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import br.com.curso.aula159.dominio.ordemservico.StatusOs;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapEnumApp {
    public static void main(String[] args) {
        Map<StatusOs, Integer> quantidadePorStatus = new TreeMap<>();

        quantidadePorStatus.put(StatusOs.CONCLUIDA, 3);
        quantidadePorStatus.put(StatusOs.AGENDADA, 5);
        quantidadePorStatus.put(StatusOs.CANCELADA, 1);
        quantidadePorStatus.put(StatusOs.REAGENDADA, 2);

        System.out.println("TreeMap com enum:");

        for (Map.Entry<StatusOs, Integer> entrada : quantidadePorStatus.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapEnumApp
```

---

## Ordem natural de enum

Enum tem ordem natural pela ordem de declaração.

No nosso enum:

```java
AGENDADA,
REAGENDADA,
CONCLUIDA,
CANCELADA
```

A saída segue essa ordem.

Isso pode ser útil.

Mas cuidado:

```text
se a ordem de negócio for diferente da ordem declarada, você precisa ajustar o critério.
```

Isso será melhor tratado quando estudarmos `Comparator`.

---

## TreeMap com objeto sem Comparable

Agora vamos ver um erro comum.

Crie:

```text
src\br\com\curso\aula159\dominio\ruim\CodigoOsSemComparable.java
```

Código:

```java
package br.com.curso.aula159.dominio.ruim;

import java.util.Objects;

public final class CodigoOsSemComparable {
    private final String valor;

    public CodigoOsSemComparable(String valor) {
        this.valor = valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOsSemComparable codigoOs)) {
            return false;
        }

        return Objects.equals(valor, codigoOs.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
}
```

Crie:

```text
src\br\com\curso\aula159\app\TreeMapObjetoSemComparableApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import br.com.curso.aula159.dominio.ruim.CodigoOsSemComparable;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapObjetoSemComparableApp {
    public static void main(String[] args) {
        Map<CodigoOsSemComparable, String> clientesPorOs = new TreeMap<>();

        try {
            clientesPorOs.put(new CodigoOsSemComparable("OS-2026-0002"), "Carlos Souza");
            clientesPorOs.put(new CodigoOsSemComparable("OS-2026-0001"), "Ana Silva");
        } catch (RuntimeException erro) {
            System.out.println("Erro ao usar TreeMap com chave sem comparação.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
            System.out.println("Mensagem: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapObjetoSemComparableApp
```

---

## Por que esse erro acontece

`TreeMap` precisa ordenar as chaves.

Para ordenar, ele pergunta:

```text
qual chave vem antes?
qual chave vem depois?
```

Se a chave é uma classe sua, o Java não sabe responder automaticamente.

Você precisa:

```text
implementar Comparable;
ou fornecer Comparator.
```

Nesta aula vamos usar `Comparable`.

`Comparator` será aprofundado depois.

---

## Criando CodigoOs Comparable

Crie:

```text
src\br\com\curso\aula159\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula159.dominio.valor;

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

## TreeMap com CodigoOs

Crie:

```text
src\br\com\curso\aula159\app\TreeMapCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import br.com.curso.aula159.dominio.valor.CodigoOs;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapCodigoOsApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientesPorOs = new TreeMap<>();

        clientesPorOs.put(new CodigoOs("OS-2026-0003"), "Mariana Lima");
        clientesPorOs.put(new CodigoOs("OS-2026-0001"), "Ana Silva");
        clientesPorOs.put(new CodigoOs("OS-2026-0002"), "Carlos Souza");
        clientesPorOs.put(new CodigoOs("os-2026-0001"), "Ana Silva Atualizada");

        System.out.println("TreeMap com CodigoOs ordenado:");

        for (Map.Entry<CodigoOs, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapCodigoOsApp
```

---

## O que observar

A saída fica ordenada pelo valor do código.

Além disso, a chave repetida:

```text
OS-2026-0001
os-2026-0001
```

é considerada equivalente porque o objeto normaliza o valor.

O valor final fica atualizado.

---

## Coerência entre compareTo e equals

Em `TreeMap`, a comparação da chave é essencial.

Se `compareTo` diz que duas chaves são equivalentes, o `TreeMap` trata como a mesma chave.

Por isso, para objetos usados como chave em `TreeMap`, mantenha coerência entre:

```text
compareTo;
equals;
hashCode.
```

No nosso `CodigoOs`, todos usam o mesmo campo:

```text
valor.
```

Isso é bom.

---

## TreeMap com métodos de navegação

Quando você declara como `TreeMap`, pode acessar métodos específicos.

Crie:

```text
src\br\com\curso\aula159\app\TreeMapNavegacaoApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.TreeMap;

public class TreeMapNavegacaoApp {
    public static void main(String[] args) {
        TreeMap<String, String> clientesPorOs = new TreeMap<>();

        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0004", "Bruno Rocha");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("Primeira chave: " + clientesPorOs.firstKey());
        System.out.println("Última chave: " + clientesPorOs.lastKey());

        System.out.println();
        System.out.println("Chave menor que OS-2026-0003: " + clientesPorOs.lowerKey("OS-2026-0003"));
        System.out.println("Chave maior que OS-2026-0003: " + clientesPorOs.higherKey("OS-2026-0003"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapNavegacaoApp
```

---

## O que são métodos de navegação

`TreeMap` mantém as chaves ordenadas.

Por isso, ele consegue responder perguntas como:

```text
qual é a primeira chave?
qual é a última chave?
qual chave vem antes desta?
qual chave vem depois desta?
```

Esses métodos são úteis em cenários de ordenação e intervalos.

Não precisa decorar todos agora.

Entenda a ideia.

---

## TreeMap com intervalo simples

Crie:

```text
src\br\com\curso\aula159\app\TreeMapIntervaloApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapIntervaloApp {
    public static void main(String[] args) {
        TreeMap<String, String> clientesPorOs = new TreeMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0004", "Bruno Rocha");
        clientesPorOs.put("OS-2026-0005", "Juliana Mendes");

        Map<String, String> intervalo = clientesPorOs.subMap(
                "OS-2026-0002",
                true,
                "OS-2026-0004",
                true
        );

        System.out.println("Intervalo de OS-2026-0002 até OS-2026-0004:");

        for (Map.Entry<String, String> entrada : intervalo.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapIntervaloApp
```

---

## O que esse intervalo mostra

Como o `TreeMap` está ordenado, ele consegue retornar partes do mapa por intervalo de chave.

Esse tipo de recurso não existe da mesma forma em `HashMap`.

`HashMap` não tem ordenação.

`TreeMap` tem.

---

## Quando usar cada implementação

### HashMap

Use quando:

```text
precisa de chave -> valor;
ordem não importa;
quer uma implementação geral;
quer busca por chave;
não precisa navegar por intervalos.
```

Exemplo:

```java
Map<String, OrdemServico> ordensPorCodigo = new HashMap<>();
```

### LinkedHashMap

Use quando:

```text
precisa de chave -> valor;
quer preservar ordem de inserção;
vai exibir na ordem recebida;
quer previsibilidade na iteração.
```

Exemplo:

```java
Map<String, String> dadosNaOrdemRecebida = new LinkedHashMap<>();
```

### TreeMap

Use quando:

```text
precisa de chave -> valor;
quer chaves ordenadas;
quer primeira/última chave;
quer intervalo por chave;
a chave é Comparable ou existe Comparator.
```

Exemplo:

```java
Map<String, OrdemServico> ordensOrdenadasPorCodigo = new TreeMap<>();
```

---

## Cuidado com null

`HashMap` aceita `null` como chave em alguns cenários.

`LinkedHashMap` também.

`TreeMap` pode ter problema com `null`, porque precisa comparar as chaves.

Crie:

```text
src\br\com\curso\aula159\app\TreeMapNullApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.Map;
import java.util.TreeMap;

public class TreeMapNullApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new TreeMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");

        try {
            clientesPorOs.put(null, "Cliente sem código");
        } catch (RuntimeException erro) {
            System.out.println("Não foi possível usar null como chave no TreeMap.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.TreeMapNullApp
```

---

## Regra profissional sobre null em Map

Mesmo que alguma implementação aceite `null`, evite.

Chave `null` quase sempre deixa o código mais frágil.

Prefira validar:

```java
if (codigo == null) {
    throw new IllegalArgumentException("Código é obrigatório.");
}
```

No nosso padrão de curso:

```text
chave obrigatória não deve ser null.
```

---

## Mini-cenário de relatório

Crie:

```text
src\br\com\curso\aula159\app\RelatorioMapOrdemApp.java
```

Código:

```java
package br.com.curso.aula159.app;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class RelatorioMapOrdemApp {
    public static void main(String[] args) {
        Map<String, Integer> quantidadeHashMap = new HashMap<>();
        Map<String, Integer> quantidadeLinkedHashMap = new LinkedHashMap<>();
        Map<String, Integer> quantidadeTreeMap = new TreeMap<>();

        preencher(quantidadeHashMap);
        preencher(quantidadeLinkedHashMap);
        preencher(quantidadeTreeMap);

        imprimir("HashMap", quantidadeHashMap);
        imprimir("LinkedHashMap", quantidadeLinkedHashMap);
        imprimir("TreeMap", quantidadeTreeMap);
    }

    private static void preencher(Map<String, Integer> mapa) {
        mapa.put("Reagendamento", 12);
        mapa.put("Entrada", 30);
        mapa.put("Sem Capacity", 5);
        mapa.put("Frustrados", 8);
    }

    private static void imprimir(String titulo, Map<String, Integer> mapa) {
        System.out.println();
        System.out.println(titulo);

        for (Map.Entry<String, Integer> entrada : mapa.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula159.app.RelatorioMapOrdemApp
```

---

## O que esse relatório mostra

Dependendo do requisito:

```text
se a ordem não importa:
HashMap.

se quer manter a ordem cadastrada:
LinkedHashMap.

se quer exibir alfabeticamente pela chave:
TreeMap.
```

A estrutura muda o comportamento da saída.

---

## Ligação com backend

Esses mapas aparecem em backend em cenários como:

```text
relatórios;
parâmetros;
caches;
retornos ordenados;
agrupamentos;
índices por código;
processamento de importação;
respostas de API;
montagem de payload.
```

Exemplo:

```text
Uma importação de OS precisa manter a ordem do arquivo.
Use LinkedHashMap.

Um relatório precisa sair ordenado pelo código.
Use TreeMap.

Uma busca por código sem necessidade de ordem.
Use HashMap.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar ordem

Execute:

```powershell
java -cp out br.com.curso.aula159.app.HashMapSemOrdemGarantidaApp
java -cp out br.com.curso.aula159.app.LinkedHashMapOrdemInsercaoApp
java -cp out br.com.curso.aula159.app.TreeMapOrdenadoPorChaveApp
java -cp out br.com.curso.aula159.app.ComparacaoMapOrdemApp
```

### Parte 2 — LinkedHashMap na prática

Execute:

```powershell
java -cp out br.com.curso.aula159.app.LinkedHashMapAtualizacaoNaoMoveApp
java -cp out br.com.curso.aula159.app.ImportacaoLinkedHashMapApp
```

### Parte 3 — TreeMap com tipos simples

Execute:

```powershell
java -cp out br.com.curso.aula159.app.TreeMapNumerosApp
java -cp out br.com.curso.aula159.app.TreeMapEnumApp
```

### Parte 4 — TreeMap com objeto próprio

Execute:

```powershell
java -cp out br.com.curso.aula159.app.TreeMapObjetoSemComparableApp
java -cp out br.com.curso.aula159.app.TreeMapCodigoOsApp
```

### Parte 5 — Navegação e intervalo

Execute:

```powershell
java -cp out br.com.curso.aula159.app.TreeMapNavegacaoApp
java -cp out br.com.curso.aula159.app.TreeMapIntervaloApp
java -cp out br.com.curso.aula159.app.TreeMapNullApp
java -cp out br.com.curso.aula159.app.RelatorioMapOrdemApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula159\app\ComparacaoClientesMapApp.java
```

Ele deve:

```text
criar os mesmos dados em HashMap;
criar os mesmos dados em LinkedHashMap;
criar os mesmos dados em TreeMap;
usar código do cliente como chave;
usar nome do cliente como valor;
inserir códigos fora de ordem;
exibir os três mapas.
```

Códigos sugeridos:

```text
CLI-003 -> Mariana;
CLI-001 -> Ana;
CLI-004 -> Bruno;
CLI-002 -> Carlos.
```

Critério principal:

```text
a saída deve demonstrar claramente a diferença de ordem entre os três mapas.
```

---

## Desafio extra

Crie um objeto de valor:

```text
src\br\com\curso\aula159\dominio\valor\CodigoCliente.java
```

Regras:

```text
classe final;
campo final;
não aceita nulo;
não aceita branco;
deve iniciar com CLI-;
normaliza com trim e toUpperCase;
implements Comparable<CodigoCliente>;
compareTo pelo valor;
equals pelo valor;
hashCode pelo valor.
```

Depois crie:

```text
src\br\com\curso\aula159\app\TreeMapCodigoClienteApp.java
```

Ele deve:

```text
criar TreeMap<CodigoCliente, String>;
adicionar CLI-003 -> Mariana;
adicionar CLI-001 -> Ana;
adicionar CLI-002 -> Carlos;
adicionar cli-001 -> Ana Atualizada;
exibir quantidade final;
exibir clientes ordenados pelo código.
```

Critério principal:

```text
CLI-001 deve aparecer uma vez e o mapa deve sair ordenado pela chave.
```

---

## Erros comuns nesta aula

### 1. Esperar ordem em HashMap

Não dependa da ordem de iteração do `HashMap`.

### 2. Achar que LinkedHashMap ordena

Ele não ordena.

Ele preserva a ordem de inserção.

### 3. Achar que TreeMap preserva ordem de chegada

Ele não preserva chegada.

Ele ordena pelas chaves.

### 4. Usar TreeMap com objeto sem Comparable ou Comparator

Vai dar erro.

### 5. Esquecer que TreeMap ordena pela chave, não pelo valor

Se quer ordenar por valor, o problema é outro.

### 6. Usar null como chave

Evite.

Em `TreeMap`, pode dar erro.

### 7. Implementar compareTo incoerente com equals

Mantenha o mesmo critério quando possível.

### 8. Usar TreeMap quando só precisa buscar por chave

Se ordem não importa, `HashMap` costuma ser mais simples.

---

## Debug recomendado

Use debug em:

```text
ComparacaoMapOrdemApp.java
LinkedHashMapAtualizacaoNaoMoveApp.java
ImportacaoLinkedHashMapApp.java
TreeMapCodigoOsApp.java
TreeMapNavegacaoApp.java
TreeMapIntervaloApp.java
RelatorioMapOrdemApp.java
```

Breakpoints recomendados:

```java
mapa.put(...)

clientesPorOs.putIfAbsent(...)

compareTo(...)

clientesPorOs.firstKey()

clientesPorOs.lastKey()

clientesPorOs.lowerKey(...)

clientesPorOs.higherKey(...)

clientesPorOs.subMap(...)

for (Map.Entry<..., ...> entrada : mapa.entrySet())
```

Observe:

```text
como a ordem muda;
como LinkedHashMap mantém inserção;
como atualizar valor não move chave;
como TreeMap chama compareTo;
como TreeMap entrega primeira e última chave;
como subMap retorna intervalo;
como cada implementação serve a um requisito diferente.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre HashMap, LinkedHashMap e TreeMap?
2. Quando LinkedHashMap é melhor que HashMap?
3. Por que TreeMap precisa comparar as chaves?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar HashMap;
criar LinkedHashMap;
criar TreeMap;
explicar ordem de cada implementação;
preservar ordem de inserção;
ordenar por chave;
entender atualização em LinkedHashMap;
usar TreeMap com String;
usar TreeMap com Integer;
usar TreeMap com enum;
entender erro de chave sem Comparable;
criar CodigoOs Comparable;
usar TreeMap com objeto de valor;
usar firstKey;
usar lastKey;
usar lowerKey;
usar higherKey;
usar subMap;
evitar null em TreeMap;
resolver ComparacaoClientesMapApp;
resolver TreeMapCodigoClienteApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-159-linkedhashmap-treemap-e-ordem
git commit -m "Aula 159: linkedhashmap treemap e ordem"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
HashMap, LinkedHashMap e TreeMap guardam chave e valor, mas diferem na ordem de iteração.
```

Você aprendeu:

```text
HashMap:
sem ordem garantida.

LinkedHashMap:
ordem de inserção.

TreeMap:
ordem pela chave.
```

Na próxima aula, vamos aprofundar as formas de percorrer `Map`.

Vamos estudar `keySet`, `values`, `entrySet`, quando usar cada um e como evitar código ineficiente ou confuso.
