# 160 — M5.15 — Map: iteração com keySet, values e entrySet

## Objetivo da aula

Nesta aula você vai aprofundar as formas corretas de percorrer um `Map`.

Nas aulas anteriores, você estudou:

```text
HashMap;
LinkedHashMap;
TreeMap;
chave e valor;
put;
get;
remove;
containsKey;
objetos como chave;
ordem em mapas.
```

Agora vamos focar em uma pergunta prática:

```text
como percorrer um Map?
```

Um `Map` não é percorrido da mesma forma que uma `List`.

Ele possui três visões principais:

```text
keySet();
values();
entrySet();
```

Ao final da aula, você deve conseguir:

```text
entender por que Map não é uma sequência simples;
explicar keySet;
explicar values;
explicar entrySet;
saber quando usar cada um;
percorrer somente chaves;
percorrer somente valores;
percorrer chave e valor juntos;
evitar keySet + get quando entrySet é melhor;
entender que values pode ter valores repetidos;
entender que keySet não tem chaves repetidas;
usar entrySet para relatórios;
usar entrySet para atualizar valores com cuidado;
percorrer HashMap, LinkedHashMap e TreeMap;
aplicar iteração em cenários de Ordem de Serviço.
```

Essa aula é muito importante porque `Map` aparece o tempo todo em backend.

---

## Ideia principal

Um `Map` guarda pares:

```text
chave -> valor
```

Exemplo:

```text
OS-2026-0001 -> Ana Silva
OS-2026-0002 -> Carlos Souza
OS-2026-0003 -> Mariana Lima
```

Quando você percorre um `Map`, precisa decidir:

```text
quero só as chaves?
quero só os valores?
quero chave e valor juntos?
```

Para cada caso, existe uma forma melhor.

---

## As três formas principais

### keySet

Use quando precisa apenas das chaves.

```java
mapa.keySet()
```

Retorna um conjunto de chaves.

### values

Use quando precisa apenas dos valores.

```java
mapa.values()
```

Retorna uma coleção de valores.

### entrySet

Use quando precisa da chave e do valor juntos.

```java
mapa.entrySet()
```

Retorna um conjunto de entradas.

Cada entrada possui:

```text
getKey();
getValue();
```

---

## Por que Map não é igual List

Uma `List` é uma sequência:

```text
posição 0;
posição 1;
posição 2.
```

Um `Map` é uma associação:

```text
chave A -> valor X;
chave B -> valor Y;
chave C -> valor Z.
```

Por isso, não existe:

```java
mapa.get(0)
```

a menos que a chave do mapa seja realmente o número `0`.

Em `Map`, `get` recebe chave, não posição.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-160-map-iteracao-keyset-values-entryset
cd labs\m5\aula-160-map-iteracao-keyset-values-entryset
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula160
mkdir src\br\com\curso\aula160\app
mkdir src\br\com\curso\aula160\dominio
mkdir src\br\com\curso\aula160\dominio\ordemservico
mkdir src\br\com\curso\aula160\dominio\valor
mkdir src\br\com\curso\aula160\infra
```

---

## Primeiro mapa da aula

Todos os exemplos iniciais usam um mapa simples:

```text
String -> String
```

Onde:

```text
chave = código da OS;
valor = nome do cliente.
```

Isso facilita entender a iteração antes de voltar para objetos.

---

## keySet básico

Crie:

```text
src\br\com\curso\aula160\app\MapKeySetBasicoApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class MapKeySetBasicoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        Set<String> chaves = clientesPorOs.keySet();

        System.out.println("Chaves do mapa:");

        for (String codigo : chaves) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapKeySetBasicoApp
```

---

## O que keySet retorna

`keySet()` retorna:

```java
Set<String>
```

Por quê?

Porque chaves de um `Map` não se repetem.

Se o mapa tem:

```text
OS-2026-0001 -> Ana
OS-2026-0002 -> Carlos
```

as chaves são:

```text
OS-2026-0001
OS-2026-0002
```

Sem duplicidade.

---

## Quando usar keySet

Use `keySet` quando sua operação precisa apenas das chaves.

Exemplos:

```text
listar todos os códigos cadastrados;
verificar formato das chaves;
exportar lista de ids;
contar quantas chaves existem;
comparar chaves com outra estrutura;
remover chaves específicas com estratégia segura.
```

Se você também precisa do valor, geralmente `entrySet` é melhor.

---

## values básico

Crie:

```text
src\br\com\curso\aula160\app\MapValuesBasicoApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class MapValuesBasicoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        Collection<String> clientes = clientesPorOs.values();

        System.out.println("Valores do mapa:");

        for (String cliente : clientes) {
            System.out.println("- " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapValuesBasicoApp
```

---

## O que values retorna

`values()` retorna:

```java
Collection<String>
```

Não retorna `Set`.

Por quê?

Porque valores podem repetir.

Exemplo:

```text
OS-2026-0001 -> Ana Silva
OS-2026-0003 -> Ana Silva
```

A mesma cliente pode aparecer em mais de uma OS.

Então valores não são necessariamente únicos.

---

## values com valores repetidos

Crie:

```text
src\br\com\curso\aula160\app\MapValuesRepetidosApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class MapValuesRepetidosApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Ana Silva");

        Collection<String> clientes = clientesPorOs.values();

        System.out.println("Clientes nas OS:");

        for (String cliente : clientes) {
            System.out.println("- " + cliente);
        }

        System.out.println();
        System.out.println("Quantidade de OS: " + clientesPorOs.size());
        System.out.println("Quantidade de valores: " + clientes.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapValuesRepetidosApp
```

---

## Quando usar values

Use `values` quando você só precisa dos valores.

Exemplos:

```text
listar todas as OS cadastradas;
somar valores de pedidos;
contar objetos por status;
validar dados dos valores;
gerar relatório sem precisar da chave;
processar todos os objetos armazenados no mapa.
```

No cadastro em memória com `Map<CodigoOs, OrdemServico>`, normalmente `values()` é usado para listar as OS.

---

## entrySet básico

Crie:

```text
src\br\com\curso\aula160\app\MapEntrySetBasicoApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;

public class MapEntrySetBasicoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Entradas do mapa:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            String codigo = entrada.getKey();
            String cliente = entrada.getValue();

            System.out.println(codigo + " -> " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapEntrySetBasicoApp
```

---

## O que entrySet retorna

`entrySet()` retorna um conjunto de entradas.

Cada entrada representa:

```text
uma chave;
um valor.
```

Tipo:

```java
Set<Map.Entry<String, String>>
```

Na prática, você usa assim:

```java
for (Map.Entry<String, String> entrada : mapa.entrySet()) {
    entrada.getKey();
    entrada.getValue();
}
```

---

## Quando usar entrySet

Use `entrySet` quando precisa da chave e do valor juntos.

Exemplos:

```text
imprimir código da OS e cliente;
gerar relatório chave -> quantidade;
validar se chave combina com valor;
exportar dados;
montar DTO com chave e valor;
atualizar valores associados a certas chaves;
comparar pares.
```

Regra prática:

```text
precisa de chave e valor?
use entrySet.
```

---

## Evitando keySet + get quando precisa dos dois

Um erro comum é fazer:

```java
for (String codigo : mapa.keySet()) {
    String cliente = mapa.get(codigo);
}
```

Isso funciona.

Mas quando você precisa da chave e do valor, `entrySet` comunica melhor a intenção e evita busca extra.

Vamos comparar.

---

## keySet + get

Crie:

```text
src\br\com\curso\aula160\app\MapKeySetComGetApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;

public class MapKeySetComGetApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Usando keySet + get:");

        for (String codigo : clientesPorOs.keySet()) {
            String cliente = clientesPorOs.get(codigo);
            System.out.println(codigo + " -> " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapKeySetComGetApp
```

---

## entrySet preferível

Crie:

```text
src\br\com\curso\aula160\app\MapEntrySetPreferivelApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;

public class MapEntrySetPreferivelApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Usando entrySet:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapEntrySetPreferivelApp
```

---

## Por que entrySet é melhor nesse caso

Com `entrySet`, o par já vem pronto:

```text
chave e valor.
```

Você não precisa chamar:

```java
mapa.get(chave)
```

dentro do laço.

Além de mais direto, o código deixa clara a intenção:

```text
estou percorrendo as entradas do mapa.
```

---

## Map não é Iterable diretamente

Você não faz:

```java
for (Map<String, String> item : mapa) {
}
```

Isso não existe.

Crie:

```text
src\br\com\curso\aula160\app\MapNaoIteravelDiretoApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;

public class MapNaoIteravelDiretoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");

        System.out.println("Map não é percorrido diretamente com foreach.");
        System.out.println("Use keySet, values ou entrySet.");

        System.out.println();
        System.out.println("Exemplo correto:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapNaoIteravelDiretoApp
```

---

## Iterando HashMap, LinkedHashMap e TreeMap

A forma de iteração é igual.

O que muda é a ordem.

Crie:

```text
src\br\com\curso\aula160\app\MapIteracaoOrdemApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapIteracaoOrdemApp {
    public static void main(String[] args) {
        Map<String, String> hashMap = new HashMap<>();
        Map<String, String> linkedHashMap = new LinkedHashMap<>();
        Map<String, String> treeMap = new TreeMap<>();

        preencher(hashMap);
        preencher(linkedHashMap);
        preencher(treeMap);

        imprimir("HashMap", hashMap);
        imprimir("LinkedHashMap", linkedHashMap);
        imprimir("TreeMap", treeMap);
    }

    private static void preencher(Map<String, String> mapa) {
        mapa.put("OS-2026-0003", "Mariana Lima");
        mapa.put("OS-2026-0001", "Ana Silva");
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
java -cp out br.com.curso.aula160.app.MapIteracaoOrdemApp
```

---

## O que observar

O código de iteração é o mesmo:

```java
for (Map.Entry<String, String> entrada : mapa.entrySet())
```

Mas a ordem depende da implementação:

```text
HashMap:
sem ordem garantida.

LinkedHashMap:
ordem de inserção.

TreeMap:
ordem da chave.
```

---

## Atualizando valor com entrySet

`Map.Entry` permite alterar o valor com:

```java
setValue
```

Use com cuidado.

Crie:

```text
src\br\com\curso\aula160\app\MapEntrySetSetValueApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import java.util.HashMap;
import java.util.Map;

public class MapEntrySetSetValueApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "AGENDADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            if (entrada.getValue().equals("AGENDADA")) {
                entrada.setValue("REVISADA");
            }
        }

        System.out.println("Status após atualização:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapEntrySetSetValueApp
```

---

## Cuidado com setValue

`setValue` altera o valor associado à entrada.

Isso pode ser útil.

Mas, em código de domínio real, cuidado para não deixar regra de negócio espalhada em `String`.

Exemplo didático:

```text
AGENDADA -> REVISADA
```

Em domínio mais maduro, prefira:

```text
enum;
método de comportamento;
service de aplicação;
regra clara.
```

O `Map` é estrutura.

A regra precisa continuar organizada.

---

## Domínio da aula

Agora vamos usar objetos.

Crie:

```text
src\br\com\curso\aula160\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula160.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula160\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula160.dominio.valor;

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
src\br\com\curso\aula160\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula160.dominio.ordemservico;

import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private final StatusOs status;

    public OrdemServico(
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

## values com objetos de domínio

Crie:

```text
src\br\com\curso\aula160\app\MapValuesComObjetosApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import br.com.curso.aula160.dominio.ordemservico.OrdemServico;
import br.com.curso.aula160.dominio.ordemservico.StatusOs;
import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MapValuesComObjetosApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordensPorCodigo = criarMapa();

        System.out.println("Listando valores:");

        for (OrdemServico os : ordensPorCodigo.values()) {
            System.out.println("- " + os.resumo());
        }
    }

    private static Map<CodigoOs, OrdemServico> criarMapa() {
        Map<CodigoOs, OrdemServico> mapa = new HashMap<>();

        OrdemServico os1 = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        );

        OrdemServico os2 = new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        );

        mapa.put(os1.codigo(), os1);
        mapa.put(os2.codigo(), os2);

        return mapa;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapValuesComObjetosApp
```

---

## Quando values é perfeito

Neste exemplo, você quer listar as OS.

Não precisa da chave, porque a própria OS já possui código.

Então:

```java
ordensPorCodigo.values()
```

é suficiente.

Esse é um cenário comum em cadastros em memória.

---

## entrySet com objetos de domínio

Crie:

```text
src\br\com\curso\aula160\app\MapEntrySetComObjetosApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import br.com.curso.aula160.dominio.ordemservico.OrdemServico;
import br.com.curso.aula160.dominio.ordemservico.StatusOs;
import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

public class MapEntrySetComObjetosApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordensPorCodigo = criarMapa();

        System.out.println("Relatório chave -> valor:");

        for (Map.Entry<CodigoOs, OrdemServico> entrada : ordensPorCodigo.entrySet()) {
            CodigoOs codigo = entrada.getKey();
            OrdemServico os = entrada.getValue();

            System.out.println(codigo.resumo() + " -> " + os.resumo());
        }
    }

    private static Map<CodigoOs, OrdemServico> criarMapa() {
        Map<CodigoOs, OrdemServico> mapa = new LinkedHashMap<>();

        OrdemServico os1 = new OrdemServico(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA
        );

        OrdemServico os2 = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.REAGENDADA
        );

        mapa.put(os1.codigo(), os1);
        mapa.put(os2.codigo(), os2);

        return mapa;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapEntrySetComObjetosApp
```

---

## keySet com objetos de valor

Crie:

```text
src\br\com\curso\aula160\app\MapKeySetComObjetoValorApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapKeySetComObjetoValorApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");
        clientePorCodigo.put(new CodigoOs("OS-2026-0002"), "Carlos Souza");
        clientePorCodigo.put(new CodigoOs("OS-2026-0003"), "Mariana Lima");

        System.out.println("Códigos cadastrados:");

        for (CodigoOs codigo : clientePorCodigo.keySet()) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapKeySetComObjetoValorApp
```

---

## Contagem por status usando values

Crie:

```text
src\br\com\curso\aula160\app\MapValuesContagemPorStatusApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import br.com.curso.aula160.dominio.ordemservico.OrdemServico;
import br.com.curso.aula160.dominio.ordemservico.StatusOs;
import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MapValuesContagemPorStatusApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordensPorCodigo = criarMapa();

        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        System.out.println("Contagem por status:");

        for (Map.Entry<StatusOs, Integer> entrada : contagem.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static Map<CodigoOs, OrdemServico> criarMapa() {
        Map<CodigoOs, OrdemServico> mapa = new HashMap<>();

        adicionar(mapa, "OS-2026-0001", "Ana Silva", StatusOs.AGENDADA);
        adicionar(mapa, "OS-2026-0002", "Carlos Souza", StatusOs.CONCLUIDA);
        adicionar(mapa, "OS-2026-0003", "Mariana Lima", StatusOs.AGENDADA);
        adicionar(mapa, "OS-2026-0004", "Bruno Rocha", StatusOs.CANCELADA);

        return mapa;
    }

    private static void adicionar(
            Map<CodigoOs, OrdemServico> mapa,
            String codigo,
            String cliente,
            StatusOs status
    ) {
        OrdemServico os = new OrdemServico(
                new CodigoOs(codigo),
                cliente,
                LocalDate.of(2026, 12, 10),
                status
        );

        mapa.put(os.codigo(), os);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.MapValuesContagemPorStatusApp
```

---

## Por que values é ideal nessa contagem

A contagem precisa analisar cada OS.

A chave do mapa não importa.

Então usamos:

```java
for (OrdemServico os : ordensPorCodigo.values())
```

Depois acumulamos:

```java
contagem.merge(os.status(), 1, Integer::sum);
```

Isso é uma combinação comum:

```text
Map para indexar;
values para processar;
outro Map para contar.
```

---

## Cadastro em memória com métodos de iteração

Crie:

```text
src\br\com\curso\aula160\infra\CadastroOsMapIteracaoMemoria.java
```

Código:

```java
package br.com.curso.aula160.infra;

import br.com.curso.aula160.dominio.ordemservico.OrdemServico;
import br.com.curso.aula160.dominio.ordemservico.StatusOs;
import br.com.curso.aula160.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CadastroOsMapIteracaoMemoria {
    private final Map<CodigoOs, OrdemServico> ordensPorCodigo;

    public CadastroOsMapIteracaoMemoria() {
        this.ordensPorCodigo = new LinkedHashMap<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS duplicada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public List<CodigoOs> listarCodigos() {
        return List.copyOf(ordensPorCodigo.keySet());
    }

    public List<OrdemServico> listarOrdens() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public Map<CodigoOs, String> gerarResumoPorCodigo() {
        Map<CodigoOs, String> resumo = new LinkedHashMap<>();

        for (Map.Entry<CodigoOs, OrdemServico> entrada : ordensPorCodigo.entrySet()) {
            resumo.put(entrada.getKey(), entrada.getValue().resumo());
        }

        return resumo;
    }

    public Map<StatusOs, Integer> contarPorStatus() {
        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }
}
```

---

## O que esse cadastro demonstra

Ele usa cada visão do mapa com intenção clara.

```java
listarCodigos()
```

usa:

```java
keySet()
```

porque quer apenas chaves.

```java
listarOrdens()
```

usa:

```java
values()
```

porque quer apenas valores.

```java
gerarResumoPorCodigo()
```

usa:

```java
entrySet()
```

porque precisa de chave e valor.

```java
contarPorStatus()
```

usa:

```java
values()
```

porque precisa processar as OS.

---

## App do cadastro

Crie:

```text
src\br\com\curso\aula160\app\CadastroOsMapIteracaoApp.java
```

Código:

```java
package br.com.curso.aula160.app;

import br.com.curso.aula160.dominio.ordemservico.OrdemServico;
import br.com.curso.aula160.dominio.ordemservico.StatusOs;
import br.com.curso.aula160.dominio.valor.CodigoOs;
import br.com.curso.aula160.infra.CadastroOsMapIteracaoMemoria;

import java.time.LocalDate;
import java.util.Map;

public class CadastroOsMapIteracaoApp {
    public static void main(String[] args) {
        CadastroOsMapIteracaoMemoria cadastro = new CadastroOsMapIteracaoMemoria();

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA
        ));

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.REAGENDADA
        ));

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        ));

        System.out.println("Códigos:");
        for (CodigoOs codigo : cadastro.listarCodigos()) {
            System.out.println("- " + codigo.resumo());
        }

        System.out.println();
        System.out.println("Ordens:");
        for (OrdemServico os : cadastro.listarOrdens()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Resumo por código:");
        for (Map.Entry<CodigoOs, String> entrada : cadastro.gerarResumoPorCodigo().entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue());
        }

        System.out.println();
        System.out.println("Contagem por status:");
        for (Map.Entry<StatusOs, Integer> entrada : cadastro.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula160.app.CadastroOsMapIteracaoApp
```

---

## Views do Map refletem o mapa

As visões retornadas por:

```java
keySet();
values();
entrySet();
```

são ligadas ao mapa original.

Isso significa que, conceitualmente, elas representam o estado do mapa.

Por isso, em classes de cadastro, muitas vezes é melhor devolver cópia:

```java
List.copyOf(...)
```

ou montar outro `Map`.

No nosso cadastro, usamos cópia em:

```java
listarCodigos();
listarOrdens();
```

Isso protege melhor a estrutura interna.

---

## Cuidado com remoção durante iteração

Assim como em `List`, remover enquanto percorre pode causar problemas.

Exemplo perigoso:

```java
for (CodigoOs codigo : mapa.keySet()) {
    mapa.remove(codigo);
}
```

Isso pode causar comportamento errado ou exceção.

A remoção segura em `Map` merece atenção própria.

Vamos aprofundar esse tema depois.

Por enquanto, guarde:

```text
não remova diretamente do Map enquanto percorre keySet, values ou entrySet sem estratégia adequada.
```

---

## Guia de escolha

Use este guia rápido:

```text
Preciso só das chaves?
keySet.

Preciso só dos valores?
values.

Preciso da chave e do valor?
entrySet.

Preciso imprimir relatório chave -> valor?
entrySet.

Preciso contar status das OS?
values.

Preciso listar códigos cadastrados?
keySet.

Preciso transformar cada par em outro formato?
entrySet.
```

---

## Ligação com backend

Iteração em `Map` aparece muito em backend:

```text
montar resposta de API;
gerar relatório;
percorrer parâmetros;
percorrer headers;
montar logs estruturados;
contar itens por status;
validar configuração por chave;
converter mapa em DTO;
indexar e depois processar dados;
exportar dados chave -> valor.
```

Exemplos:

```text
Map<String, String> headers:
entrySet para imprimir chave e valor.

Map<StatusOs, Integer> contagem:
entrySet para gerar relatório.

Map<CodigoOs, OrdemServico> ordens:
values para processar OS.

Map<CodigoOs, OrdemServico> ordens:
keySet para listar códigos.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Entender as três visões

Execute:

```powershell
java -cp out br.com.curso.aula160.app.MapKeySetBasicoApp
java -cp out br.com.curso.aula160.app.MapValuesBasicoApp
java -cp out br.com.curso.aula160.app.MapValuesRepetidosApp
java -cp out br.com.curso.aula160.app.MapEntrySetBasicoApp
```

### Parte 2 — Comparar keySet + get com entrySet

Execute:

```powershell
java -cp out br.com.curso.aula160.app.MapKeySetComGetApp
java -cp out br.com.curso.aula160.app.MapEntrySetPreferivelApp
```

### Parte 3 — Ver iteração e ordem

Execute:

```powershell
java -cp out br.com.curso.aula160.app.MapNaoIteravelDiretoApp
java -cp out br.com.curso.aula160.app.MapIteracaoOrdemApp
```

### Parte 4 — Atualização com entrySet

Execute:

```powershell
java -cp out br.com.curso.aula160.app.MapEntrySetSetValueApp
```

### Parte 5 — Usar objetos

Execute:

```powershell
java -cp out br.com.curso.aula160.app.MapValuesComObjetosApp
java -cp out br.com.curso.aula160.app.MapEntrySetComObjetosApp
java -cp out br.com.curso.aula160.app.MapKeySetComObjetoValorApp
java -cp out br.com.curso.aula160.app.MapValuesContagemPorStatusApp
java -cp out br.com.curso.aula160.app.CadastroOsMapIteracaoApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula160\app\RelatorioClientesMapApp.java
```

Ele deve:

```text
criar Map<String, String>;
chave = código do cliente;
valor = nome do cliente;
cadastrar pelo menos 5 clientes;
usar keySet para listar apenas códigos;
usar values para listar apenas nomes;
usar entrySet para listar código -> nome.
```

Critério principal:

```text
usar a visão correta para cada tipo de relatório.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula160\app\RelatorioOrdensPorStatusMapApp.java
```

Ele deve:

```text
criar Map<CodigoOs, OrdemServico>;
cadastrar pelo menos 8 OS;
usar values para contar por status;
usar entrySet para montar relatório código -> resumo;
usar keySet para listar apenas os códigos;
usar LinkedHashMap para preservar ordem de cadastro.
```

Critério principal:

```text
não usar keySet + get quando entrySet for mais adequado.
```

---

## Erros comuns nesta aula

### 1. Tentar percorrer Map diretamente

Use:

```text
keySet;
values;
entrySet.
```

### 2. Usar keySet + get sempre

Quando precisa de chave e valor, prefira `entrySet`.

### 3. Achar que values não repete

Valores podem repetir.

### 4. Achar que keySet é List

`keySet` retorna um conjunto de chaves.

Não conte com índice.

### 5. Usar HashMap esperando ordem

A ordem depende da implementação do mapa.

### 6. Alterar regra de negócio dentro de setValue sem critério

Use com cuidado.

### 7. Retornar view interna sem pensar

Em classes de cadastro, prefira cópia quando quiser proteger estado interno.

### 8. Remover diretamente enquanto percorre

Tenha estratégia segura.

---

## Debug recomendado

Use debug em:

```text
MapKeySetBasicoApp.java
MapValuesBasicoApp.java
MapEntrySetBasicoApp.java
MapKeySetComGetApp.java
MapEntrySetPreferivelApp.java
MapEntrySetSetValueApp.java
MapValuesContagemPorStatusApp.java
CadastroOsMapIteracaoMemoria.java
CadastroOsMapIteracaoApp.java
```

Breakpoints recomendados:

```java
mapa.keySet()

mapa.values()

mapa.entrySet()

entrada.getKey()

entrada.getValue()

entrada.setValue(...)

contagem.merge(...)

List.copyOf(...)

resumo.put(...)
```

Observe:

```text
qual visão do mapa está sendo usada;
quando a chave é necessária;
quando só o valor basta;
como entrySet evita get extra;
como values pode repetir;
como LinkedHashMap mantém ordem;
como List.copyOf protege retorno.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar keySet?
2. Quando usar values?
3. Quando usar entrySet?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar keySet;
explicar values;
explicar entrySet;
usar keySet para chaves;
usar values para valores;
usar entrySet para chave e valor;
entender que Map não é Iterable diretamente;
evitar keySet + get quando entrySet é melhor;
entender que values pode repetir;
iterar HashMap;
iterar LinkedHashMap;
iterar TreeMap;
usar entrySet com objetos;
usar values para contar por status;
usar keySet com objeto de valor;
criar cadastro com métodos baseados em keySet, values e entrySet;
resolver RelatorioClientesMapApp;
resolver RelatorioOrdensPorStatusMapApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-160-map-iteracao-keyset-values-entryset
git commit -m "Aula 160: iteracao em map com keyset values e entryset"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Map deve ser percorrido pela visão correta: keySet para chaves, values para valores e entrySet para chave e valor juntos.
```

Você viu que a escolha da visão deixa o código mais claro e evita trabalho desnecessário.

Na próxima aula, vamos estudar remoção segura em `Map`.

Vamos entender como remover entradas de um mapa durante a iteração sem quebrar o processamento.
