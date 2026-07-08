# 156 — M5.11 — Map interface e HashMap

## Objetivo da aula

Nesta aula você vai iniciar uma das estruturas mais importantes do Java Backend:

```text
Map
```

E a implementação mais comum para começar:

```text
HashMap
```

Nas aulas anteriores, você estudou:

```text
List;
ArrayList;
LinkedList;
Set;
HashSet;
LinkedHashSet;
TreeSet.
```

Agora vamos estudar uma estrutura diferente.

`Map` não guarda apenas valores soltos.

`Map` guarda pares:

```text
chave -> valor
```

Ao final da aula, você deve conseguir:

```text
explicar o que é Map;
explicar o que é HashMap;
entender chave e valor;
criar Map<K, V>;
adicionar dados com put;
buscar dados com get;
verificar chave com containsKey;
verificar valor com containsValue;
remover por chave;
entender substituição de valor quando a chave já existe;
percorrer chaves;
percorrer valores;
percorrer entradas;
usar Map para buscar OS por código;
usar Map para contar ocorrências;
entender quando Map é melhor que List;
evitar erros comuns com null e chave inexistente.
```

Esta aula é um divisor de águas.

Muitos problemas que você resolveria com `List` e `for` ficam mais diretos com `Map`.

---

## Ideia principal

Uma `List` guarda uma sequência:

```text
OS-001
OS-002
OS-003
```

Um `Set` guarda elementos únicos:

```text
OS-001
OS-002
OS-003
```

Um `Map` guarda associação entre chave e valor:

```text
OS-001 -> Ana Silva
OS-002 -> Carlos Souza
OS-003 -> Mariana Lima
```

A chave é usada para encontrar o valor.

---

## Exemplo simples

```java
Map<String, String> clientesPorCodigoOs = new HashMap<>();

clientesPorCodigoOs.put("OS-2026-0001", "Ana Silva");
clientesPorCodigoOs.put("OS-2026-0002", "Carlos Souza");

String cliente = clientesPorCodigoOs.get("OS-2026-0001");
```

Leia assim:

```text
tenho um mapa onde a chave é String e o valor também é String.
a chave é o código da OS.
o valor é o nome do cliente.
```

---

## O que significa Map<K, V>

A interface `Map` usa dois tipos genéricos:

```java
Map<K, V>
```

Onde:

```text
K = key = chave
V = value = valor
```

Exemplos:

```java
Map<String, String>
```

chave `String`, valor `String`.

```java
Map<String, Integer>
```

chave `String`, valor `Integer`.

```java
Map<String, OrdemServico>
```

chave `String`, valor `OrdemServico`.

```java
Map<CodigoOs, OrdemServico>
```

chave `CodigoOs`, valor `OrdemServico`.

---

## Quando pensar em Map

Pense em `Map` quando você precisa buscar algo por uma chave.

Exemplos:

```text
buscar OS por código;
buscar cliente por CPF;
buscar produto por SKU;
buscar contrato por número;
buscar quantidade por status;
buscar permissão por nome;
buscar configuração por chave;
buscar usuário por e-mail.
```

Se sua pergunta principal é:

```text
qual valor está associado a esta chave?
```

provavelmente `Map` pode ajudar.

---

## List vs Map

Com `List`, para buscar por código, você percorre:

```java
for (OrdemServico os : ordens) {
    if (os.possuiCodigo("OS-2026-0001")) {
        return os;
    }
}
```

Com `Map`, você busca direto pela chave:

```java
ordensPorCodigo.get("OS-2026-0001");
```

Isso muda bastante a forma de pensar.

`List` é boa para sequência.

`Map` é bom para associação por chave.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-156-map-interface-e-hashmap
cd labs\m5\aula-156-map-interface-e-hashmap
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula156
mkdir src\br\com\curso\aula156\app
mkdir src\br\com\curso\aula156\dominio
mkdir src\br\com\curso\aula156\dominio\valor
mkdir src\br\com\curso\aula156\dominio\ordemservico
mkdir src\br\com\curso\aula156\infra
```

---

## Primeiro HashMap

Crie:

```text
src\br\com\curso\aula156\app\PrimeiroHashMapApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class PrimeiroHashMapApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Quantidade de registros: " + clientesPorOs.size());

        String cliente = clientesPorOs.get("OS-2026-0002");

        System.out.println("Cliente da OS-2026-0002: " + cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.PrimeiroHashMapApp
```

---

## O que observar

Criamos:

```java
Map<String, String> clientesPorOs = new HashMap<>();
```

Depois adicionamos pares:

```java
clientesPorOs.put("OS-2026-0001", "Ana Silva");
```

A chave é:

```text
OS-2026-0001
```

O valor é:

```text
Ana Silva
```

Depois buscamos pelo código:

```java
clientesPorOs.get("OS-2026-0002")
```

---

## put adiciona ou substitui

Um ponto muito importante:

```java
put
```

serve para adicionar, mas também pode substituir.

Se a chave ainda não existe, adiciona.

Se a chave já existe, substitui o valor antigo.

Crie:

```text
src\br\com\curso\aula156\app\HashMapPutSubstituiApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapPutSubstituiApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0001", "Ana Silva Atualizada");

        System.out.println("Quantidade: " + clientesPorOs.size());
        System.out.println("Valor atual: " + clientesPorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapPutSubstituiApp
```

---

## O que observar no put

Mesmo chamando `put` duas vezes com a mesma chave:

```java
clientesPorOs.put("OS-2026-0001", "Ana Silva");
clientesPorOs.put("OS-2026-0001", "Ana Silva Atualizada");
```

a quantidade final é:

```text
1
```

Porque a chave é a mesma.

O valor antigo foi substituído.

Regra prática:

```text
em Map, chave não se repete.
```

---

## put retorna o valor anterior

O método `put` retorna o valor antigo associado à chave.

Se não existia valor anterior, retorna `null`.

Crie:

```text
src\br\com\curso\aula156\app\HashMapPutRetornoApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapPutRetornoApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        String anterior1 = clientesPorOs.put("OS-2026-0001", "Ana Silva");
        String anterior2 = clientesPorOs.put("OS-2026-0001", "Ana Silva Atualizada");

        System.out.println("Valor anterior na primeira inclusão: " + anterior1);
        System.out.println("Valor anterior na segunda inclusão: " + anterior2);
        System.out.println("Valor atual: " + clientesPorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapPutRetornoApp
```

---

## Quando usar o retorno do put

Você pode usar o retorno para detectar substituição.

Exemplo:

```java
String anterior = mapa.put(chave, valor);

if (anterior != null) {
    System.out.println("Valor anterior foi substituído.");
}
```

Mas cuidado:

```text
se o Map permitir valor null, retorno null pode significar que não existia ou que o valor anterior era null.
```

No curso, vamos evitar valor `null` dentro do mapa sempre que possível.

---

## get em chave inexistente

Se a chave não existe, `get` retorna `null`.

Crie:

```text
src\br\com\curso\aula156\app\HashMapGetInexistenteApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapGetInexistenteApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");

        String cliente = clientesPorOs.get("OS-2026-9999");

        if (cliente == null) {
            System.out.println("OS não encontrada.");
        } else {
            System.out.println("Cliente: " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapGetInexistenteApp
```

---

## Cuidado com null no get

Este erro é comum:

```java
String cliente = clientesPorOs.get("OS-2026-9999");
System.out.println(cliente.toUpperCase());
```

Se a chave não existir, `cliente` será `null`.

Aí pode ocorrer:

```text
NullPointerException
```

Trate antes.

Ou use `containsKey`.

---

## containsKey

`containsKey` verifica se uma chave existe no mapa.

Crie:

```text
src\br\com\curso\aula156\app\HashMapContainsKeyApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapContainsKeyApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        verificar(clientesPorOs, "OS-2026-0001");
        verificar(clientesPorOs, "OS-2026-9999");
    }

    private static void verificar(Map<String, String> clientesPorOs, String codigo) {
        if (clientesPorOs.containsKey(codigo)) {
            System.out.println(codigo + " encontrada. Cliente: " + clientesPorOs.get(codigo));
        } else {
            System.out.println(codigo + " não encontrada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapContainsKeyApp
```

---

## containsValue

`containsValue` verifica se existe algum valor no mapa.

Crie:

```text
src\br\com\curso\aula156\app\HashMapContainsValueApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapContainsValueApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("Existe cliente Ana Silva? " + clientesPorOs.containsValue("Ana Silva"));
        System.out.println("Existe cliente Mariana Lima? " + clientesPorOs.containsValue("Mariana Lima"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapContainsValueApp
```

---

## containsKey é mais comum que containsValue

Em backend, normalmente você busca pela chave.

Exemplo:

```text
existe OS com este código?
existe usuário com este e-mail?
existe produto com este SKU?
```

Por isso, `containsKey` costuma ser mais importante.

`containsValue` existe, mas é menos usado.

---

## remove por chave

Crie:

```text
src\br\com\curso\aula156\app\HashMapRemoveApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapRemoveApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Antes: " + clientesPorOs.size());

        String removido = clientesPorOs.remove("OS-2026-0002");
        String inexistente = clientesPorOs.remove("OS-2026-9999");

        System.out.println("Removido: " + removido);
        System.out.println("Inexistente: " + inexistente);
        System.out.println("Depois: " + clientesPorOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapRemoveApp
```

---

## O que remove retorna

`remove(chave)` retorna o valor removido.

Se a chave não existe, retorna `null`.

Exemplo:

```java
String removido = mapa.remove("OS-2026-0002");
```

Isso permite saber qual valor saiu.

---

## size e isEmpty

Crie:

```text
src\br\com\curso\aula156\app\HashMapSizeIsEmptyApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapSizeIsEmptyApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        System.out.println("Vazio? " + clientesPorOs.isEmpty());
        System.out.println("Quantidade: " + clientesPorOs.size());

        clientesPorOs.put("OS-2026-0001", "Ana Silva");

        System.out.println();
        System.out.println("Vazio? " + clientesPorOs.isEmpty());
        System.out.println("Quantidade: " + clientesPorOs.size());

        clientesPorOs.clear();

        System.out.println();
        System.out.println("Depois do clear:");
        System.out.println("Vazio? " + clientesPorOs.isEmpty());
        System.out.println("Quantidade: " + clientesPorOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapSizeIsEmptyApp
```

---

## clear em Map

`clear` remove todos os pares do mapa.

Use com cuidado.

Em backend, isso pode fazer sentido para:

```text
limpar cache em memória;
reiniciar processamento temporário;
limpar dados de teste;
descartar agrupamento temporário.
```

Mas não use sem intenção clara.

---

## Percorrendo chaves com keySet

Um `Map` pode ser percorrido pelas chaves.

Crie:

```text
src\br\com\curso\aula156\app\HashMapKeySetApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class HashMapKeySetApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        Set<String> chaves = clientesPorOs.keySet();

        System.out.println("Chaves:");

        for (String codigo : chaves) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapKeySetApp
```

---

## Percorrendo valores com values

Crie:

```text
src\br\com\curso\aula156\app\HashMapValuesApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class HashMapValuesApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Ana Silva");

        Collection<String> clientes = clientesPorOs.values();

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
java -cp out br.com.curso.aula156.app.HashMapValuesApp
```

---

## values pode ter repetidos

As chaves de um `Map` são únicas.

Mas os valores podem se repetir.

Exemplo:

```text
OS-2026-0001 -> Ana Silva
OS-2026-0003 -> Ana Silva
```

Duas chaves diferentes podem apontar para o mesmo valor.

Regra:

```text
chave não repete;
valor pode repetir.
```

---

## Percorrendo entradas com entrySet

A forma mais comum de percorrer chave e valor juntos é:

```java
entrySet()
```

Crie:

```text
src\br\com\curso\aula156\app\HashMapEntrySetApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapEntrySetApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");
        clientesPorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Entradas:");

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
java -cp out br.com.curso.aula156.app.HashMapEntrySetApp
```

---

## Quando usar entrySet

Use `entrySet` quando você precisa da chave e do valor.

Exemplo:

```text
imprimir código da OS e cliente;
gerar relatório de status e quantidade;
montar resposta com chave e valor;
validar pares de dados.
```

Evite percorrer `keySet` e chamar `get` dentro se você já precisa dos dois.

Prefira:

```java
for (Map.Entry<K, V> entrada : mapa.entrySet()) {
    ...
}
```

---

## HashMap não garante ordem

Assim como `HashSet`, `HashMap` não garante ordem de iteração.

Crie:

```text
src\br\com\curso\aula156\app\HashMapNaoGaranteOrdemApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapNaoGaranteOrdemApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.put("OS-2026-0003", "Mariana Lima");
        clientesPorOs.put("OS-2026-0001", "Ana Silva");
        clientesPorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("HashMap não garante ordem:");

        for (Map.Entry<String, String> entrada : clientesPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapNaoGaranteOrdemApp
```

---

## Se ordem importar

Se você precisar de ordem de inserção, existe:

```text
LinkedHashMap
```

Se você precisar de chave ordenada, existe:

```text
TreeMap
```

Vamos estudar esses mapas depois.

Por enquanto, guarde:

```text
HashMap é para associação por chave, não para ordem.
```

---

## Contagem com Map

Um uso muito comum de `Map` é contar ocorrências.

Exemplo:

```text
AGENDADA -> 3
CONCLUIDA -> 2
CANCELADA -> 1
```

Crie:

```text
src\br\com\curso\aula156\app\HashMapContagemStringApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashMapContagemStringApp {
    public static void main(String[] args) {
        List<String> statusRecebidos = List.of(
                "AGENDADA",
                "CONCLUIDA",
                "AGENDADA",
                "CANCELADA",
                "AGENDADA",
                "CONCLUIDA"
        );

        Map<String, Integer> contagemPorStatus = new HashMap<>();

        for (String status : statusRecebidos) {
            Integer atual = contagemPorStatus.get(status);

            if (atual == null) {
                contagemPorStatus.put(status, 1);
            } else {
                contagemPorStatus.put(status, atual + 1);
            }
        }

        System.out.println("Contagem por status:");

        for (Map.Entry<String, Integer> entrada : contagemPorStatus.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapContagemStringApp
```

---

## Entendendo a contagem

Para cada status:

```java
Integer atual = contagemPorStatus.get(status);
```

Se ainda não existe:

```java
contagemPorStatus.put(status, 1);
```

Se já existe:

```java
contagemPorStatus.put(status, atual + 1);
```

Isso é um padrão comum com `Map`.

Mais adiante veremos métodos como:

```text
getOrDefault;
merge.
```

Por enquanto, é importante entender o fluxo manual.

---

## Domínio para exemplos com OS

Crie:

```text
src\br\com\curso\aula156\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula156.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula156\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula156.dominio.ordemservico;

import java.time.LocalDate;

public class OrdemServico {
    private final String codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private StatusOs status;

    public OrdemServico(
            String codigo,
            String cliente,
            LocalDate dataAtendimento,
            StatusOs status
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
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

    public StatusOs status() {
        return status;
    }

    public boolean possuiCodigo(String codigo) {
        return this.codigo.equals(codigo);
    }

    public void reagendar(LocalDate novaData) {
        if (novaData == null) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        if (status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        status = StatusOs.REAGENDADA;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
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

## Map de OS por código

Crie:

```text
src\br\com\curso\aula156\app\HashMapOsPorCodigoApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.ordemservico.OrdemServico;
import br.com.curso.aula156.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class HashMapOsPorCodigoApp {
    public static void main(String[] args) {
        Map<String, OrdemServico> ordensPorCodigo = new HashMap<>();

        OrdemServico os1 = new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        );

        OrdemServico os2 = new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        );

        ordensPorCodigo.put(os1.codigo(), os1);
        ordensPorCodigo.put(os2.codigo(), os2);

        OrdemServico encontrada = ordensPorCodigo.get("OS-2026-0001");

        if (encontrada != null) {
            System.out.println("Encontrada: " + encontrada.resumo());
        } else {
            System.out.println("OS não encontrada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapOsPorCodigoApp
```

---

## Por que Map é bom aqui

A chave é o código:

```java
String
```

O valor é a OS:

```java
OrdemServico
```

Então o mapa fica assim:

```text
OS-2026-0001 -> objeto OrdemServico
OS-2026-0002 -> objeto OrdemServico
```

Quando você precisa buscar por código, o `Map` comunica muito bem a intenção.

---

## Cadastro em memória usando Map

Agora vamos criar um cadastro parecido com o de `ArrayList`, mas usando `Map`.

Crie:

```text
src\br\com\curso\aula156\infra\CadastroOrdemServicoMapMemoria.java
```

Código:

```java
package br.com.curso.aula156.infra;

import br.com.curso.aula156.dominio.ordemservico.OrdemServico;
import br.com.curso.aula156.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class CadastroOrdemServicoMapMemoria {
    private final Map<String, OrdemServico> ordensPorCodigo;

    public CadastroOrdemServicoMapMemoria() {
        this.ordensPorCodigo = new HashMap<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("Já existe OS com o código: " + os.codigo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public OrdemServico buscarPorCodigo(String codigo) {
        return ordensPorCodigo.get(codigo);
    }

    public void reagendar(String codigo, LocalDate novaData) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.reagendar(novaData);
    }

    public void concluir(String codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.concluir();
    }

    public boolean remover(String codigo) {
        OrdemServico removida = ordensPorCodigo.remove(codigo);
        return removida != null;
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }

    public boolean vazio() {
        return ordensPorCodigo.isEmpty();
    }

    public Collection<OrdemServico> listar() {
        return ordensPorCodigo.values();
    }

    public int contarPorStatus(StatusOs status) {
        int total = 0;

        for (OrdemServico os : ordensPorCodigo.values()) {
            if (os.status() == status) {
                total++;
            }
        }

        return total;
    }

    private OrdemServico buscarObrigatoria(String codigo) {
        OrdemServico os = buscarPorCodigo(codigo);

        if (os == null) {
            throw new IllegalArgumentException("OS não encontrada: " + codigo);
        }

        return os;
    }
}
```

---

## O que mudou em relação ao cadastro com List

Antes, com `List`, para buscar por código, percorríamos:

```java
for (OrdemServico os : ordens) {
    if (os.possuiCodigo(codigo)) {
        return os;
    }
}
```

Agora, com `Map`, buscamos direto:

```java
return ordensPorCodigo.get(codigo);
```

Isso deixa o código mais direto quando existe uma chave clara.

---

## App usando cadastro com Map

Crie:

```text
src\br\com\curso\aula156\app\CadastroMapApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.ordemservico.OrdemServico;
import br.com.curso.aula156.dominio.ordemservico.StatusOs;
import br.com.curso.aula156.infra.CadastroOrdemServicoMapMemoria;

import java.time.LocalDate;

public class CadastroMapApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMapMemoria cadastro = new CadastroOrdemServicoMapMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.AGENDADA
        ));

        cadastro.reagendar(
                "OS-2026-0001",
                LocalDate.of(2026, 12, 20)
        );

        cadastro.concluir("OS-2026-0002");

        System.out.println("OS cadastradas:");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Quantidade: " + cadastro.quantidade());
        System.out.println("Agendadas: " + cadastro.contarPorStatus(StatusOs.AGENDADA));
        System.out.println("Reagendadas: " + cadastro.contarPorStatus(StatusOs.REAGENDADA));
        System.out.println("Concluídas: " + cadastro.contarPorStatus(StatusOs.CONCLUIDA));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.CadastroMapApp
```

---

## Validando duplicidade com Map

Crie:

```text
src\br\com\curso\aula156\app\CadastroMapDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.ordemservico.OrdemServico;
import br.com.curso.aula156.dominio.ordemservico.StatusOs;
import br.com.curso.aula156.infra.CadastroOrdemServicoMapMemoria;

import java.time.LocalDate;

public class CadastroMapDuplicidadeApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMapMemoria cadastro = new CadastroOrdemServicoMapMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        try {
            cadastro.cadastrar(new OrdemServico(
                    "OS-2026-0001",
                    "Carlos Souza",
                    LocalDate.of(2026, 12, 11),
                    StatusOs.REAGENDADA
            ));
        } catch (IllegalStateException erro) {
            System.out.println("Duplicidade bloqueada: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.CadastroMapDuplicidadeApp
```

---

## Por que usar containsKey antes de put

Se usarmos apenas:

```java
ordensPorCodigo.put(os.codigo(), os);
```

uma OS com código repetido substituiria a anterior.

Mas no nosso domínio, isso não deve acontecer sem regra explícita.

Por isso:

```java
if (ordensPorCodigo.containsKey(os.codigo())) {
    throw new IllegalStateException(...);
}
```

Aqui bloqueamos duplicidade.

Regra importante:

```text
Map não repete chave, mas put substitui valor.
Se substituição não é permitida, valide antes.
```

---

## Contagem por enum com Map

Agora vamos contar por `StatusOs`.

Crie:

```text
src\br\com\curso\aula156\app\HashMapContagemEnumApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.ordemservico.StatusOs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashMapContagemEnumApp {
    public static void main(String[] args) {
        List<StatusOs> statusRecebidos = List.of(
                StatusOs.AGENDADA,
                StatusOs.CONCLUIDA,
                StatusOs.AGENDADA,
                StatusOs.CANCELADA,
                StatusOs.AGENDADA,
                StatusOs.CONCLUIDA,
                StatusOs.REAGENDADA
        );

        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (StatusOs status : statusRecebidos) {
            Integer atual = contagem.get(status);

            if (atual == null) {
                contagem.put(status, 1);
            } else {
                contagem.put(status, atual + 1);
            }
        }

        System.out.println("Contagem por status:");

        for (Map.Entry<StatusOs, Integer> entrada : contagem.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapContagemEnumApp
```

---

## Map com enum como chave

`enum` funciona muito bem como chave.

Exemplo:

```java
Map<StatusOs, Integer>
```

Isso é melhor do que:

```java
Map<String, Integer>
```

quando os valores possíveis são fixos.

Com enum, você evita erros como:

```text
CONCLUIDA;
Concluida;
CONCLUÍDA;
CONCLUIDO.
```

---

## Chave própria com equals/hashCode

Agora vamos usar objeto de valor como chave.

Crie:

```text
src\br\com\curso\aula156\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula156.dominio.valor;

import java.util.Objects;

public final class CodigoOs {
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
src\br\com\curso\aula156\app\HashMapChaveObjetoValorApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class HashMapChaveObjetoValorApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientesPorCodigo = new HashMap<>();

        clientesPorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");
        clientesPorCodigo.put(new CodigoOs("OS-2026-0002"), "Carlos Souza");

        String cliente = clientesPorCodigo.get(new CodigoOs("OS-2026-0001"));

        System.out.println("Cliente encontrado: " + cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapChaveObjetoValorApp
```

---

## Por que isso funciona

Você adicionou com:

```java
new CodigoOs("OS-2026-0001")
```

E buscou com outro objeto novo:

```java
new CodigoOs("OS-2026-0001")
```

Mesmo sendo objetos diferentes na memória, a busca funciona porque `CodigoOs` tem:

```text
equals;
hashCode.
```

Esse assunto veio da aula anterior.

`HashMap`, assim como `HashSet`, depende desses métodos quando a chave é objeto próprio.

---

## Cuidado com chave mutável

Nunca use uma chave mutável de qualquer jeito em `HashMap`.

Se a chave muda depois de ser colocada no mapa, a busca pode quebrar.

Regra prática:

```text
chaves de Map devem ser estáveis.
```

Por isso, objetos de valor imutáveis são excelentes chaves.

Exemplo bom:

```text
CodigoOs;
CodigoCliente;
Email;
Cpf;
SkuProduto.
```

---

## Usando putIfAbsent

Existe um método útil:

```java
putIfAbsent
```

Ele adiciona somente se a chave ainda não existir.

Crie:

```text
src\br\com\curso\aula156\app\HashMapPutIfAbsentApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapPutIfAbsentApp {
    public static void main(String[] args) {
        Map<String, String> clientesPorOs = new HashMap<>();

        clientesPorOs.putIfAbsent("OS-2026-0001", "Ana Silva");
        clientesPorOs.putIfAbsent("OS-2026-0001", "Carlos Souza");

        System.out.println("Quantidade: " + clientesPorOs.size());
        System.out.println("Cliente: " + clientesPorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapPutIfAbsentApp
```

---

## Quando usar putIfAbsent

Use quando você quer:

```text
adicionar só se não existir;
não substituir valor existente;
manter o primeiro valor;
evitar if simples.
```

Mas se você precisa lançar erro em duplicidade, ainda é melhor validar claramente:

```java
if (mapa.containsKey(chave)) {
    throw new IllegalStateException("Duplicado.");
}
```

A intenção do código deve ficar clara.

---

## getOrDefault

Outro método útil:

```java
getOrDefault
```

Ele retorna um valor padrão quando a chave não existe.

Crie:

```text
src\br\com\curso\aula156\app\HashMapGetOrDefaultApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapGetOrDefaultApp {
    public static void main(String[] args) {
        Map<String, Integer> contagemPorStatus = new HashMap<>();

        contagemPorStatus.put("AGENDADA", 3);
        contagemPorStatus.put("CONCLUIDA", 2);

        int agendadas = contagemPorStatus.getOrDefault("AGENDADA", 0);
        int canceladas = contagemPorStatus.getOrDefault("CANCELADA", 0);

        System.out.println("Agendadas: " + agendadas);
        System.out.println("Canceladas: " + canceladas);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapGetOrDefaultApp
```

---

## Contagem com getOrDefault

Crie:

```text
src\br\com\curso\aula156\app\HashMapContagemGetOrDefaultApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import br.com.curso.aula156.dominio.ordemservico.StatusOs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashMapContagemGetOrDefaultApp {
    public static void main(String[] args) {
        List<StatusOs> statusRecebidos = List.of(
                StatusOs.AGENDADA,
                StatusOs.CONCLUIDA,
                StatusOs.AGENDADA,
                StatusOs.CANCELADA,
                StatusOs.AGENDADA
        );

        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (StatusOs status : statusRecebidos) {
            int atual = contagem.getOrDefault(status, 0);
            contagem.put(status, atual + 1);
        }

        System.out.println("Contagem:");

        for (Map.Entry<StatusOs, Integer> entrada : contagem.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapContagemGetOrDefaultApp
```

---

## Por que getOrDefault ajuda

Antes:

```java
Integer atual = contagem.get(status);

if (atual == null) {
    contagem.put(status, 1);
} else {
    contagem.put(status, atual + 1);
}
```

Agora:

```java
int atual = contagem.getOrDefault(status, 0);
contagem.put(status, atual + 1);
```

Fica mais direto.

Mas é importante você ter visto o jeito manual antes.

---

## Map.of

Assim como `List.of`, existe `Map.of`.

Crie:

```text
src\br\com\curso\aula156\app\MapOfApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.Map;

public class MapOfApp {
    public static void main(String[] args) {
        Map<String, String> parametros = Map.of(
                "ambiente", "hml",
                "sistema", "kora",
                "modulo", "ordem-servico"
        );

        System.out.println("Ambiente: " + parametros.get("ambiente"));
        System.out.println("Sistema: " + parametros.get("sistema"));
        System.out.println("Módulo: " + parametros.get("modulo"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.MapOfApp
```

---

## Cuidado com Map.of

`Map.of` cria um mapa imutável.

Você não consegue:

```java
parametros.put("nova", "chave");
```

Crie:

```text
src\br\com\curso\aula156\app\MapOfImutavelApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.Map;

public class MapOfImutavelApp {
    public static void main(String[] args) {
        Map<String, String> parametros = Map.of(
                "ambiente", "hml",
                "sistema", "kora"
        );

        try {
            parametros.put("modulo", "ordem-servico");
        } catch (UnsupportedOperationException erro) {
            System.out.println("Map.of cria mapa imutável.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.MapOfImutavelApp
```

---

## Criando HashMap mutável a partir de Map.of

Crie:

```text
src\br\com\curso\aula156\app\HashMapAPartirDeMapOfApp.java
```

Código:

```java
package br.com.curso.aula156.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapAPartirDeMapOfApp {
    public static void main(String[] args) {
        Map<String, String> parametros = new HashMap<>(Map.of(
                "ambiente", "hml",
                "sistema", "kora"
        ));

        parametros.put("modulo", "ordem-servico");

        for (Map.Entry<String, String> entrada : parametros.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula156.app.HashMapAPartirDeMapOfApp
```

---

## Guia rápido de escolha

Use `List` quando:

```text
precisa de sequência;
precisa de ordem;
precisa de índice;
permite repetição.
```

Use `Set` quando:

```text
precisa de valores únicos;
não precisa de índice;
quer evitar duplicidade.
```

Use `Map` quando:

```text
precisa buscar valor por chave;
quer associar chave a valor;
quer contar por categoria;
quer indexar dados.
```

Exemplo:

```text
List<OrdemServico>:
lista de OS para exibir.

Set<String>:
códigos únicos de OS.

Map<String, OrdemServico>:
OS por código.
```

---

## Ligação com backend

`Map` aparece muito em backend:

```text
cache em memória;
indexação temporária;
agrupamento;
contagem;
conversão de lista para busca rápida;
validação de duplicidade;
parâmetros de configuração;
headers HTTP;
payloads dinâmicos;
resultado de processamento.
```

Exemplos:

```text
Map<String, String> headers;
Map<String, Object> payload;
Map<StatusOs, Integer> contagem;
Map<CodigoOs, OrdemServico> ordensPorCodigo;
Map<String, List<OrdemServico>> ordensPorCliente.
```

Vamos chegar nos mapas mais complexos aos poucos.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Operações básicas

Execute:

```powershell
java -cp out br.com.curso.aula156.app.PrimeiroHashMapApp
java -cp out br.com.curso.aula156.app.HashMapPutSubstituiApp
java -cp out br.com.curso.aula156.app.HashMapPutRetornoApp
java -cp out br.com.curso.aula156.app.HashMapGetInexistenteApp
```

### Parte 2 — Verificações e remoção

Execute:

```powershell
java -cp out br.com.curso.aula156.app.HashMapContainsKeyApp
java -cp out br.com.curso.aula156.app.HashMapContainsValueApp
java -cp out br.com.curso.aula156.app.HashMapRemoveApp
java -cp out br.com.curso.aula156.app.HashMapSizeIsEmptyApp
```

### Parte 3 — Percorrer Map

Execute:

```powershell
java -cp out br.com.curso.aula156.app.HashMapKeySetApp
java -cp out br.com.curso.aula156.app.HashMapValuesApp
java -cp out br.com.curso.aula156.app.HashMapEntrySetApp
java -cp out br.com.curso.aula156.app.HashMapNaoGaranteOrdemApp
```

### Parte 4 — Contagem e domínio

Execute:

```powershell
java -cp out br.com.curso.aula156.app.HashMapContagemStringApp
java -cp out br.com.curso.aula156.app.HashMapOsPorCodigoApp
java -cp out br.com.curso.aula156.app.CadastroMapApp
java -cp out br.com.curso.aula156.app.CadastroMapDuplicidadeApp
java -cp out br.com.curso.aula156.app.HashMapContagemEnumApp
```

### Parte 5 — Chave própria e métodos úteis

Execute:

```powershell
java -cp out br.com.curso.aula156.app.HashMapChaveObjetoValorApp
java -cp out br.com.curso.aula156.app.HashMapPutIfAbsentApp
java -cp out br.com.curso.aula156.app.HashMapGetOrDefaultApp
java -cp out br.com.curso.aula156.app.HashMapContagemGetOrDefaultApp
```

### Parte 6 — Map.of

Execute:

```powershell
java -cp out br.com.curso.aula156.app.MapOfApp
java -cp out br.com.curso.aula156.app.MapOfImutavelApp
java -cp out br.com.curso.aula156.app.HashMapAPartirDeMapOfApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula156\app\IndiceClientesPorCodigoApp.java
```

Ele deve:

```text
criar um Map<String, String>;
a chave será código do cliente;
o valor será nome do cliente;
cadastrar pelo menos 5 clientes;
bloquear cadastro se a chave já existir;
buscar um cliente existente;
buscar um cliente inexistente;
remover um cliente;
listar todos usando entrySet.
```

Critério principal:

```text
usar containsKey antes de cadastrar para evitar substituição acidental.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula156\app\ContagemOrdensPorStatusApp.java
```

Ele deve:

```text
criar uma List<OrdemServico>;
adicionar pelo menos 8 OS com status variados;
criar Map<StatusOs, Integer>;
contar quantas OS existem por status usando getOrDefault;
exibir o relatório final usando entrySet.
```

Critério principal:

```text
usar enum como chave do Map.
```

---

## Erros comuns nesta aula

### 1. Achar que Map é List

`Map` não tem índice.

Não existe:

```java
mapa.get(0)
```

a menos que a chave seja realmente `0`.

### 2. Esquecer que put substitui

Se a chave já existe, `put` troca o valor.

### 3. Usar get sem tratar null

Chave inexistente retorna `null`.

### 4. Usar HashMap esperando ordem

`HashMap` não garante ordem.

### 5. Confundir keySet, values e entrySet

```text
keySet:
chaves.

values:
valores.

entrySet:
chave e valor juntos.
```

### 6. Usar objeto próprio como chave sem equals/hashCode

Se a chave é objeto próprio, implemente corretamente.

### 7. Usar chave mutável

Chave de `HashMap` deve ser estável.

### 8. Tentar alterar Map.of

`Map.of` cria mapa imutável.

---

## Debug recomendado

Use debug em:

```text
PrimeiroHashMapApp.java
HashMapPutSubstituiApp.java
HashMapGetInexistenteApp.java
HashMapContainsKeyApp.java
HashMapEntrySetApp.java
HashMapContagemStringApp.java
CadastroOrdemServicoMapMemoria.java
HashMapChaveObjetoValorApp.java
HashMapContagemGetOrDefaultApp.java
```

Breakpoints recomendados:

```java
mapa.put(...)

mapa.get(...)

mapa.containsKey(...)

mapa.remove(...)

for (Map.Entry<..., ...> entrada : mapa.entrySet())

contagem.getOrDefault(...)

ordensPorCodigo.put(...)

ordensPorCodigo.values()
```

Observe:

```text
quando a chave entra;
quando o valor é substituído;
quando get retorna null;
como entrySet entrega chave e valor;
como contagem acumula;
como Map evita percorrer lista para buscar por código;
como equals/hashCode ajudam chave própria.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma chave em Map?
2. O que acontece quando usamos put com uma chave que já existe?
3. Quando Map é melhor que List?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar Map com HashMap;
explicar chave e valor;
usar put;
entender substituição por chave;
usar get;
tratar chave inexistente;
usar containsKey;
usar containsValue;
usar remove;
usar size;
usar isEmpty;
usar clear;
percorrer keySet;
percorrer values;
percorrer entrySet;
explicar que HashMap não garante ordem;
fazer contagem com Map;
usar enum como chave;
usar objeto de valor como chave;
usar putIfAbsent;
usar getOrDefault;
usar Map.of;
criar HashMap mutável a partir de Map.of;
resolver IndiceClientesPorCodigoApp;
resolver ContagemOrdensPorStatusApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-156-map-interface-e-hashmap
git commit -m "Aula 156: map interface e hashmap"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Map associa uma chave a um valor, permitindo buscar dados diretamente pela chave.
```

Você viu que `HashMap` é muito útil para indexar dados, contar ocorrências, montar cadastros em memória e substituir buscas lineares em listas quando existe uma chave clara.

Na próxima aula, vamos aprofundar operações essenciais de `HashMap`.

Vamos estudar atualização, substituição controlada, remoção, verificação e formas mais profissionais de manipular valores associados a chaves.
