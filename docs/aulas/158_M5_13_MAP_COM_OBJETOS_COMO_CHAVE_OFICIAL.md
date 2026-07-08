# 158 — M5.13 — Map com objetos como chave

## Objetivo da aula

Nesta aula você vai aprofundar um assunto muito importante:

```text
usar objetos como chave em Map
```

Na aula anterior, você estudou operações essenciais de `HashMap`:

```text
put;
putIfAbsent;
replace;
remove;
getOrDefault;
merge;
keySet;
values;
entrySet.
```

Agora vamos juntar `Map` com um tema que você já viu em `Set`:

```text
equals e hashCode.
```

Isso é essencial porque `HashMap` usa `equals` e `hashCode` para encontrar chaves.

Ao final da aula, você deve conseguir:

```text
entender por que Map com String como chave funciona naturalmente;
entender por que objeto próprio como chave exige equals e hashCode;
criar exemplo errado com objeto sem equals/hashCode;
corrigir usando objeto de valor imutável;
usar CodigoOs como chave de Map;
buscar valor usando outro objeto equivalente;
entender por que chave mutável é perigosa;
entender por que chave deve ser estável;
usar Map<CodigoOs, OrdemServico>;
criar cadastro em memória com chave de objeto de valor;
explicar quando usar String como chave e quando usar objeto de valor;
evitar bugs de get retornando null mesmo com valor cadastrado.
```

Esta aula conecta Collections, Orientação a Objetos e modelagem de domínio.

---

## Ideia principal

Um `HashMap` organiza os dados pela chave.

Exemplo com `String`:

```java
Map<String, String> clientePorCodigo = new HashMap<>();

clientePorCodigo.put("OS-2026-0001", "Ana Silva");

String cliente = clientePorCodigo.get("OS-2026-0001");
```

Funciona bem porque `String` já tem:

```text
equals;
hashCode.
```

Mas quando a chave é uma classe sua, você precisa garantir que ela saiba comparar corretamente.

---

## Problema clássico

Imagine:

```java
Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");

String cliente = clientePorCodigo.get(new CodigoOs("OS-2026-0001"));
```

Você espera encontrar:

```text
Ana Silva
```

Mas isso só funciona se `CodigoOs` tiver `equals` e `hashCode` corretos.

Sem isso, o `HashMap` pode não encontrar o valor.

Mesmo que o texto do código seja igual.

---

## Como HashMap pensa

De forma simplificada, o `HashMap` faz algo parecido com isto:

```text
1. calcula o hashCode da chave;
2. vai até uma região interna do mapa;
3. usa equals para confirmar se a chave é a mesma;
4. retorna o valor associado.
```

Então, para objeto próprio funcionar como chave, ele precisa ter:

```text
hashCode coerente;
equals coerente;
campos de igualdade estáveis.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-158-map-com-objetos-como-chave
cd labs\m5\aula-158-map-com-objetos-como-chave
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula158
mkdir src\br\com\curso\aula158\app
mkdir src\br\com\curso\aula158\dominio
mkdir src\br\com\curso\aula158\dominio\ruim
mkdir src\br\com\curso\aula158\dominio\valor
mkdir src\br\com\curso\aula158\dominio\ordemservico
mkdir src\br\com\curso\aula158\infra
```

---

## Exemplo 1 — String como chave

Crie:

```text
src\br\com\curso\aula158\app\MapStringComoChaveApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import java.util.HashMap;
import java.util.Map;

public class MapStringComoChaveApp {
    public static void main(String[] args) {
        Map<String, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new String("OS-2026-0001"), "Ana Silva");

        String cliente = clientePorCodigo.get(new String("OS-2026-0001"));

        System.out.println("Cliente encontrado: " + cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapStringComoChaveApp
```

---

## O que observar

Mesmo usando dois objetos `String` diferentes:

```java
new String("OS-2026-0001")
new String("OS-2026-0001")
```

o `Map` encontra o valor.

Isso acontece porque `String` compara pelo conteúdo.

Ela já implementa `equals` e `hashCode`.

---

## Exemplo 2 — Objeto sem equals/hashCode

Agora vamos criar uma chave ruim.

Crie:

```text
src\br\com\curso\aula158\dominio\ruim\CodigoOsSemEquals.java
```

Código:

```java
package br.com.curso.aula158.dominio.ruim;

public class CodigoOsSemEquals {
    private final String valor;

    public CodigoOsSemEquals(String valor) {
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
}
```

Agora crie:

```text
src\br\com\curso\aula158\app\MapObjetoSemEqualsApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ruim.CodigoOsSemEquals;

import java.util.HashMap;
import java.util.Map;

public class MapObjetoSemEqualsApp {
    public static void main(String[] args) {
        Map<CodigoOsSemEquals, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOsSemEquals("OS-2026-0001"), "Ana Silva");

        String cliente = clientePorCodigo.get(new CodigoOsSemEquals("OS-2026-0001"));

        System.out.println("Cliente encontrado: " + cliente);
        System.out.println("Quantidade no Map: " + clientePorCodigo.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapObjetoSemEqualsApp
```

---

## O que observar

A saída pode mostrar:

```text
Cliente encontrado: null
```

Mesmo tendo cadastrado uma chave com o mesmo texto.

Por quê?

Porque o `Map` recebeu uma chave e buscou com outra instância.

Sem `equals` e `hashCode`, essas duas instâncias não são consideradas iguais.

---

## Erro ainda mais perigoso: duplicidade de chave visual

Crie:

```text
src\br\com\curso\aula158\app\MapObjetoSemEqualsDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ruim.CodigoOsSemEquals;

import java.util.HashMap;
import java.util.Map;

public class MapObjetoSemEqualsDuplicidadeApp {
    public static void main(String[] args) {
        Map<CodigoOsSemEquals, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOsSemEquals("OS-2026-0001"), "Ana Silva");
        clientePorCodigo.put(new CodigoOsSemEquals("OS-2026-0001"), "Carlos Souza");

        System.out.println("Quantidade no Map: " + clientePorCodigo.size());

        for (Map.Entry<CodigoOsSemEquals, String> entrada : clientePorCodigo.entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapObjetoSemEqualsDuplicidadeApp
```

---

## O que esse exemplo mostra

Visualmente, a chave é a mesma:

```text
OS-2026-0001
OS-2026-0001
```

Mas o `HashMap` pode manter duas entradas.

Isso é muito perigoso.

Você poderia achar que atualizou a mesma chave, mas na verdade criou outra entrada.

---

## Criando objeto de valor correto

Agora vamos criar uma chave correta.

Crie:

```text
src\br\com\curso\aula158\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula158.dominio.valor;

import java.util.Objects;

public final class CodigoOs {
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

## Por que essa classe é boa chave

`CodigoOs` é boa chave porque:

```text
é final;
o campo valor é final;
valida no construtor;
normaliza o texto;
implementa equals;
implementa hashCode;
não muda depois de criada.
```

Isso é exatamente o que uma chave de `HashMap` precisa:

```text
estabilidade.
```

---

## Exemplo 3 — Objeto de valor como chave

Crie:

```text
src\br\com\curso\aula158\app\MapCodigoOsComoChaveApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapCodigoOsComoChaveApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");

        String cliente = clientePorCodigo.get(new CodigoOs("OS-2026-0001"));

        System.out.println("Cliente encontrado: " + cliente);
        System.out.println("Quantidade no Map: " + clientePorCodigo.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapCodigoOsComoChaveApp
```

---

## O que observar

Agora o `Map` encontra o valor.

Mesmo usando:

```java
new CodigoOs("OS-2026-0001")
```

na inclusão e outro:

```java
new CodigoOs("OS-2026-0001")
```

na busca.

Isso funciona porque os objetos são equivalentes pelo valor.

---

## Exemplo 4 — Normalização da chave

Crie:

```text
src\br\com\curso\aula158\app\MapCodigoOsNormalizadoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapCodigoOsNormalizadoApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs(" os-2026-0001 "), "Ana Silva");

        String cliente = clientePorCodigo.get(new CodigoOs("OS-2026-0001"));

        System.out.println("Cliente encontrado: " + cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapCodigoOsNormalizadoApp
```

---

## Por que normalizar no objeto de valor

O construtor faz:

```java
String normalizado = valor.trim().toUpperCase();
```

Isso evita diferença entre:

```text
os-2026-0001
OS-2026-0001
" OS-2026-0001 "
```

Em vez de espalhar `trim` e `toUpperCase` pelo sistema, o objeto de valor centraliza isso.

Esse é um ganho de modelagem.

---

## Exemplo 5 — put substitui com chave equivalente

Crie:

```text
src\br\com\curso\aula158\app\MapCodigoOsSubstituicaoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapCodigoOsSubstituicaoApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");
        clientePorCodigo.put(new CodigoOs("os-2026-0001"), "Ana Silva Atualizada");

        System.out.println("Quantidade no Map: " + clientePorCodigo.size());
        System.out.println("Cliente atual: " + clientePorCodigo.get(new CodigoOs("OS-2026-0001")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapCodigoOsSubstituicaoApp
```

---

## O que observar

A quantidade final deve ser:

```text
1
```

Porque as duas chaves são equivalentes.

O valor foi substituído.

Isso mostra que `put` reconheceu a chave como a mesma.

---

## Exemplo 6 — containsKey com objeto de valor

Crie:

```text
src\br\com\curso\aula158\app\MapContainsKeyCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapContainsKeyCodigoOsApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");

        CodigoOs codigoBusca = new CodigoOs("os-2026-0001");

        if (clientePorCodigo.containsKey(codigoBusca)) {
            System.out.println("Chave encontrada: " + codigoBusca.resumo());
            System.out.println("Cliente: " + clientePorCodigo.get(codigoBusca));
        } else {
            System.out.println("Chave não encontrada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapContainsKeyCodigoOsApp
```

---

## containsKey depende da chave

`containsKey` também usa `equals` e `hashCode`.

Por isso, com objeto de valor correto, ele funciona mesmo com outro objeto equivalente.

Isso reforça:

```text
chave própria em HashMap precisa de igualdade correta.
```

---

## Exemplo 7 — remove com objeto de valor

Crie:

```text
src\br\com\curso\aula158\app\MapRemoveCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class MapRemoveCodigoOsApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        clientePorCodigo.put(new CodigoOs("OS-2026-0001"), "Ana Silva");
        clientePorCodigo.put(new CodigoOs("OS-2026-0002"), "Carlos Souza");

        String removido = clientePorCodigo.remove(new CodigoOs("os-2026-0001"));

        System.out.println("Removido: " + removido);
        System.out.println("Quantidade final: " + clientePorCodigo.size());

        for (Map.Entry<CodigoOs, String> entrada : clientePorCodigo.entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapRemoveCodigoOsApp
```

---

## O que remove usa

`remove` usa a chave.

Então este trecho funciona:

```java
clientePorCodigo.remove(new CodigoOs("os-2026-0001"));
```

porque `CodigoOs` normaliza e compara pelo valor.

---

## Chave mutável: o perigo

Agora vamos criar uma chave errada.

Crie:

```text
src\br\com\curso\aula158\dominio\ruim\CodigoOsMutavel.java
```

Código:

```java
package br.com.curso.aula158.dominio.ruim;

import java.util.Objects;

public class CodigoOsMutavel {
    private String valor;

    public CodigoOsMutavel(String valor) {
        this.valor = valor;
    }

    public void alterarValor(String novoValor) {
        this.valor = novoValor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOsMutavel codigoOs)) {
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

Agora crie:

```text
src\br\com\curso\aula158\app\MapChaveMutavelPerigoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ruim.CodigoOsMutavel;

import java.util.HashMap;
import java.util.Map;

public class MapChaveMutavelPerigoApp {
    public static void main(String[] args) {
        Map<CodigoOsMutavel, String> clientePorCodigo = new HashMap<>();

        CodigoOsMutavel chave = new CodigoOsMutavel("OS-2026-0001");

        clientePorCodigo.put(chave, "Ana Silva");

        System.out.println("Antes de alterar a chave:");
        System.out.println("Busca pela chave original: " + clientePorCodigo.get(new CodigoOsMutavel("OS-2026-0001")));

        chave.alterarValor("OS-2026-9999");

        System.out.println();
        System.out.println("Depois de alterar a chave usada no Map:");
        System.out.println("Busca pelo código antigo: " + clientePorCodigo.get(new CodigoOsMutavel("OS-2026-0001")));
        System.out.println("Busca pelo código novo: " + clientePorCodigo.get(new CodigoOsMutavel("OS-2026-9999")));

        System.out.println();
        System.out.println("Conteúdo ainda existe no Map:");

        for (Map.Entry<CodigoOsMutavel, String> entrada : clientePorCodigo.entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.MapChaveMutavelPerigoApp
```

---

## O que esse perigo mostra

O item ainda está dentro do mapa.

Mas a busca pode falhar.

Isso acontece porque a chave entrou no mapa com um `hashCode`.

Depois o campo usado no `hashCode` mudou.

O mapa não reorganiza automaticamente a chave.

Regra forte:

```text
não use objetos mutáveis como chave de HashMap.
```

Ou, no mínimo:

```text
não altere campos usados em equals/hashCode enquanto o objeto estiver no Map.
```

Na prática profissional, prefira chaves imutáveis.

---

## Criando domínio de OS

Agora vamos aplicar o conceito em um cenário de Ordem de Serviço.

Crie:

```text
src\br\com\curso\aula158\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula158.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula158\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula158.dominio.ordemservico;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private LocalDate dataAtendimento;
    private StatusOs status;

    public OrdemServico(
            CodigoOs codigo,
            String cliente,
            LocalDate dataAtendimento
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

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = StatusOs.AGENDADA;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public StatusOs status() {
        return status;
    }

    public void reagendar(LocalDate novaData) {
        if (novaData == null) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        if (status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (dataAtendimento.equals(novaData)) {
            throw new IllegalArgumentException("Nova data deve ser diferente da atual.");
        }

        dataAtendimento = novaData;
        status = StatusOs.REAGENDADA;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS já está concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public void cancelar() {
        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS já está cancelada.");
        }

        status = StatusOs.CANCELADA;
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

## Map<CodigoOs, OrdemServico>

Crie:

```text
src\br\com\curso\aula158\app\MapOrdemServicoPorCodigoObjetoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ordemservico.OrdemServico;
import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MapOrdemServicoPorCodigoObjetoApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordensPorCodigo = new HashMap<>();

        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        );

        ordensPorCodigo.put(os.codigo(), os);

        OrdemServico encontrada = ordensPorCodigo.get(new CodigoOs("os-2026-0001"));

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
java -cp out br.com.curso.aula158.app.MapOrdemServicoPorCodigoObjetoApp
```

---

## Por que isso é melhor que String solta

Com `String`, qualquer texto pode chegar:

```text
""
"abc"
"123"
" os-2026-0001 "
```

Com `CodigoOs`, a chave já nasce validada e normalizada.

Isso reduz erro.

Além disso, o tipo comunica melhor:

```java
Map<CodigoOs, OrdemServico>
```

é mais expressivo que:

```java
Map<String, OrdemServico>
```

Você entende que a chave não é qualquer texto.

É um código de OS.

---

## Cadastro em memória com objeto como chave

Crie:

```text
src\br\com\curso\aula158\infra\CadastroOsPorCodigoObjetoMemoria.java
```

Código:

```java
package br.com.curso.aula158.infra;

import br.com.curso.aula158.dominio.ordemservico.OrdemServico;
import br.com.curso.aula158.dominio.ordemservico.StatusOs;
import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CadastroOsPorCodigoObjetoMemoria {
    private final Map<CodigoOs, OrdemServico> ordensPorCodigo;

    public CadastroOsPorCodigoObjetoMemoria() {
        this.ordensPorCodigo = new HashMap<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public OrdemServico buscarPorCodigo(CodigoOs codigo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        return ordensPorCodigo.get(codigo);
    }

    public void reagendar(CodigoOs codigo, LocalDate novaData) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.reagendar(novaData);
    }

    public void concluir(CodigoOs codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.concluir();
    }

    public void cancelar(CodigoOs codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.cancelar();
    }

    public boolean remover(CodigoOs codigo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        return ordensPorCodigo.remove(codigo) != null;
    }

    public Collection<OrdemServico> listar() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }

    public Map<StatusOs, Integer> contarPorStatus() {
        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    private OrdemServico buscarObrigatoria(CodigoOs codigo) {
        OrdemServico os = buscarPorCodigo(codigo);

        if (os == null) {
            throw new IllegalArgumentException("OS não encontrada: " + codigo.resumo());
        }

        return os;
    }
}
```

---

## O que observar no cadastro

A chave do mapa é:

```java
CodigoOs
```

O valor é:

```java
OrdemServico
```

Então a estrutura fica:

```text
CodigoOs -> OrdemServico
```

Isso deixa o cadastro mais rico que `Map<String, OrdemServico>`.

A chave agora tem regra própria.

---

## App usando cadastro com chave objeto

Crie:

```text
src\br\com\curso\aula158\app\CadastroOsCodigoObjetoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ordemservico.OrdemServico;
import br.com.curso.aula158.dominio.ordemservico.StatusOs;
import br.com.curso.aula158.dominio.valor.CodigoOs;
import br.com.curso.aula158.infra.CadastroOsPorCodigoObjetoMemoria;

import java.time.LocalDate;
import java.util.Map;

public class CadastroOsCodigoObjetoApp {
    public static void main(String[] args) {
        CadastroOsPorCodigoObjetoMemoria cadastro = new CadastroOsPorCodigoObjetoMemoria();

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        cadastro.reagendar(
                new CodigoOs("os-2026-0001"),
                LocalDate.of(2026, 12, 20)
        );

        cadastro.concluir(new CodigoOs("OS-2026-0002"));

        System.out.println("Listagem:");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Relatório:");

        for (Map.Entry<StatusOs, Integer> entrada : cadastro.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.CadastroOsCodigoObjetoApp
```

---

## Testando duplicidade com chave objeto

Crie:

```text
src\br\com\curso\aula158\app\CadastroOsCodigoObjetoDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.ordemservico.OrdemServico;
import br.com.curso.aula158.dominio.valor.CodigoOs;
import br.com.curso.aula158.infra.CadastroOsPorCodigoObjetoMemoria;

import java.time.LocalDate;

public class CadastroOsCodigoObjetoDuplicidadeApp {
    public static void main(String[] args) {
        CadastroOsPorCodigoObjetoMemoria cadastro = new CadastroOsPorCodigoObjetoMemoria();

        cadastro.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        try {
            cadastro.cadastrar(new OrdemServico(
                    new CodigoOs("os-2026-0001"),
                    "Carlos Souza",
                    LocalDate.of(2026, 12, 11)
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
java -cp out br.com.curso.aula158.app.CadastroOsCodigoObjetoDuplicidadeApp
```

---

## O que esse teste mostra

Mesmo que uma entrada use:

```text
OS-2026-0001
```

e a outra use:

```text
os-2026-0001
```

a duplicidade é bloqueada.

Isso acontece porque `CodigoOs` normaliza para maiúsculo.

Esse é um exemplo claro de regra protegida no objeto de valor.

---

## Quando usar String como chave

`String` como chave pode fazer sentido quando:

```text
a chave é simples;
a regra de validação é pequena;
é um exemplo didático;
é um mapa temporário;
é configuração;
é header;
é parâmetro externo.
```

Exemplo:

```java
Map<String, String> headers;
Map<String, String> parametros;
```

Mas para conceitos fortes do domínio, objeto de valor pode ser melhor.

---

## Quando usar objeto de valor como chave

Use objeto de valor como chave quando:

```text
a chave tem regra;
precisa validar formato;
precisa normalizar;
representa conceito do domínio;
não deveria ser qualquer String;
será usada em várias partes do sistema.
```

Exemplos:

```text
CodigoOs;
CodigoCliente;
Cpf;
Email;
SkuProduto;
NumeroContrato;
ChaveIntegracao.
```

Isso deixa o modelo mais expressivo e seguro.

---

## Chaves boas e ruins

### Boa chave

```text
imutável;
validada;
normalizada;
equals/hashCode corretos;
representa identidade estável.
```

### Chave ruim

```text
mutável;
sem equals/hashCode;
usa campo que muda;
aceita valor inválido;
representa muitos conceitos misturados;
depende de status, data alterável ou nome mutável.
```

Regra prática:

```text
se o campo pode mudar, pense duas vezes antes de usá-lo como chave.
```

---

## Exemplo de chave ruim por status

Imagine uma chave baseada em:

```text
codigo + status
```

A OS começa:

```text
OS-2026-0001 + AGENDADA
```

Depois muda para:

```text
OS-2026-0001 + CONCLUIDA
```

Se isso estiver no `hashCode`, a chave muda.

Isso pode quebrar busca no `HashMap`.

Por isso, chave deve ser estável.

---

## Map com chave objeto e containsKey

Crie:

```text
src\br\com\curso\aula158\app\CadastroOsContainsKeyObjetoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

import java.util.HashMap;
import java.util.Map;

public class CadastroOsContainsKeyObjetoApp {
    public static void main(String[] args) {
        Map<CodigoOs, String> clientePorCodigo = new HashMap<>();

        cadastrar(clientePorCodigo, new CodigoOs("OS-2026-0001"), "Ana Silva");
        cadastrar(clientePorCodigo, new CodigoOs("OS-2026-0002"), "Carlos Souza");

        try {
            cadastrar(clientePorCodigo, new CodigoOs("os-2026-0001"), "Mariana Lima");
        } catch (IllegalStateException erro) {
            System.out.println("Erro: " + erro.getMessage());
        }
    }

    private static void cadastrar(Map<CodigoOs, String> mapa, CodigoOs codigo, String cliente) {
        if (mapa.containsKey(codigo)) {
            throw new IllegalStateException("Código duplicado: " + codigo.resumo());
        }

        mapa.put(codigo, cliente);

        System.out.println("Cadastrado: " + codigo.resumo() + " -> " + cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.CadastroOsContainsKeyObjetoApp
```

---

## Validação de entrada antes de criar chave

Em muitos casos, a criação do objeto de valor já valida.

Exemplo:

```java
new CodigoOs("")
```

deve falhar.

Crie:

```text
src\br\com\curso\aula158\app\CodigoOsValidacaoApp.java
```

Código:

```java
package br.com.curso.aula158.app;

import br.com.curso.aula158.dominio.valor.CodigoOs;

public class CodigoOsValidacaoApp {
    public static void main(String[] args) {
        testar("");
        testar("ABC-123");
        testar("OS-2026-0001");
    }

    private static void testar(String valor) {
        try {
            CodigoOs codigo = new CodigoOs(valor);
            System.out.println("Código válido: " + codigo.resumo());
        } catch (IllegalArgumentException erro) {
            System.out.println("Código inválido [" + valor + "]: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula158.app.CodigoOsValidacaoApp
```

---

## Por que validar na chave é bom

Se `CodigoOs` só permite código válido, todo `Map<CodigoOs, ...>` fica mais seguro.

Você evita:

```text
chave vazia;
chave com espaço;
chave em minúsculo não normalizada;
chave com prefixo errado;
regra repetida em vários lugares.
```

Esse é o poder de objeto de valor.

---

## Ligação com backend

Map com objeto como chave aparece em cenários como:

```text
indexar OS por CodigoOs;
indexar cliente por Cpf;
indexar produto por SkuProduto;
indexar contrato por NumeroContrato;
agrupar dados por PeriodoAtendimento;
contar eventos por TipoEvento;
guardar configurações por ChaveConfiguracao.
```

Exemplo maduro:

```java
Map<CodigoOs, OrdemServico> ordensPorCodigo;
```

é mais expressivo que:

```java
Map<String, OrdemServico> ordensPorCodigo;
```

Mas exige:

```text
CodigoOs bem modelado.
```

---

## Comparação final

### Usando String

```java
Map<String, OrdemServico> ordensPorCodigo;
```

Vantagens:

```text
simples;
rápido de escrever;
bom para exemplos e estruturas temporárias.
```

Riscos:

```text
aceita qualquer texto;
validação espalhada;
normalização esquecida;
menos expressivo.
```

### Usando objeto de valor

```java
Map<CodigoOs, OrdemServico> ordensPorCodigo;
```

Vantagens:

```text
validação centralizada;
normalização centralizada;
mais expressivo;
mais seguro;
melhor modelagem de domínio.
```

Cuidado:

```text
precisa equals/hashCode corretos;
precisa ser estável;
não deve ser mutável.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ver String e objeto ruim

Execute:

```powershell
java -cp out br.com.curso.aula158.app.MapStringComoChaveApp
java -cp out br.com.curso.aula158.app.MapObjetoSemEqualsApp
java -cp out br.com.curso.aula158.app.MapObjetoSemEqualsDuplicidadeApp
```

Observe a diferença.

### Parte 2 — Usar objeto de valor correto

Execute:

```powershell
java -cp out br.com.curso.aula158.app.MapCodigoOsComoChaveApp
java -cp out br.com.curso.aula158.app.MapCodigoOsNormalizadoApp
java -cp out br.com.curso.aula158.app.MapCodigoOsSubstituicaoApp
java -cp out br.com.curso.aula158.app.MapContainsKeyCodigoOsApp
java -cp out br.com.curso.aula158.app.MapRemoveCodigoOsApp
```

### Parte 3 — Ver perigo de chave mutável

Execute:

```powershell
java -cp out br.com.curso.aula158.app.MapChaveMutavelPerigoApp
```

### Parte 4 — Usar no domínio de OS

Execute:

```powershell
java -cp out br.com.curso.aula158.app.MapOrdemServicoPorCodigoObjetoApp
java -cp out br.com.curso.aula158.app.CadastroOsCodigoObjetoApp
java -cp out br.com.curso.aula158.app.CadastroOsCodigoObjetoDuplicidadeApp
java -cp out br.com.curso.aula158.app.CadastroOsContainsKeyObjetoApp
java -cp out br.com.curso.aula158.app.CodigoOsValidacaoApp
```

---

## Desafio prático

Crie um objeto de valor:

```text
src\br\com\curso\aula158\dominio\valor\CodigoCliente.java
```

Regras:

```text
classe final;
campo valor final;
não aceita nulo;
não aceita branco;
deve iniciar com CLI-;
normaliza com trim e toUpperCase;
implementa equals;
implementa hashCode;
implementa toString.
```

Depois crie:

```text
src\br\com\curso\aula158\app\MapClientePorCodigoObjetoApp.java
```

Ele deve:

```text
criar Map<CodigoCliente, String>;
cadastrar CLI-001 -> Ana Silva;
cadastrar CLI-002 -> Carlos Souza;
buscar usando new CodigoCliente(" cli-001 ");
mostrar que encontra Ana Silva;
tentar cadastrar CLI-001 novamente;
bloquear duplicidade usando containsKey.
```

Critério principal:

```text
a busca deve funcionar mesmo criando outro objeto CodigoCliente equivalente.
```

---

## Desafio extra

Crie uma entidade simples:

```text
src\br\com\curso\aula158\dominio\ordemservico\Tecnico.java
```

Campos:

```text
CodigoCliente codigo;
String nome;
```

Neste exercício, use `CodigoCliente` como código do técnico apenas para reaproveitar o objeto criado no desafio prático.

Depois crie:

```text
src\br\com\curso\aula158\app\MapTecnicoPorCodigoApp.java
```

Ele deve:

```text
criar Map<CodigoCliente, Tecnico>;
cadastrar 3 técnicos;
buscar técnico por código;
remover técnico por código;
listar técnicos restantes;
bloquear código duplicado.
```

Critério principal:

```text
usar objeto de valor como chave do Map.
```

---

## Erros comuns nesta aula

### 1. Usar objeto próprio como chave sem equals/hashCode

O `get` pode retornar `null` mesmo com valor cadastrado.

### 2. Usar chave mutável

Pode quebrar busca no `HashMap`.

### 3. Colocar status ou data mutável no hashCode da chave

Chave deve ser estável.

### 4. Achar que dois objetos com mesmos dados são iguais automaticamente

Não são, a menos que `equals` e `hashCode` definam isso.

### 5. Usar String para tudo

String é simples, mas nem sempre é a melhor modelagem.

### 6. Normalizar fora do objeto de valor

Isso espalha regra.

Prefira centralizar no construtor do objeto de valor.

### 7. Usar put sem validar duplicidade

Se duplicidade é erro, use `containsKey` antes.

### 8. Retornar coleção interna mutável

Quando expor dados, prefira cópia quando fizer sentido.

---

## Debug recomendado

Use debug em:

```text
MapObjetoSemEqualsApp.java
MapObjetoSemEqualsDuplicidadeApp.java
MapCodigoOsComoChaveApp.java
MapCodigoOsNormalizadoApp.java
MapChaveMutavelPerigoApp.java
CadastroOsPorCodigoObjetoMemoria.java
CadastroOsCodigoObjetoApp.java
CodigoOsValidacaoApp.java
```

Breakpoints recomendados:

```java
clientePorCodigo.put(...)

clientePorCodigo.get(...)

clientePorCodigo.containsKey(...)

clientePorCodigo.remove(...)

equals(...)

hashCode()

chave.alterarValor(...)

new CodigoOs(...)
```

Observe:

```text
quando hashCode é chamado;
quando equals é chamado;
por que objeto sem equals falha;
como chave normalizada funciona;
como chave mutável quebra busca;
como cadastro bloqueia duplicidade;
como Map com objeto de valor fica mais expressivo.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que objeto próprio como chave de HashMap precisa de equals e hashCode?
2. Por que chave mutável é perigosa?
3. Quando vale a pena usar objeto de valor como chave em vez de String?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar String como chave;
explicar por que String funciona;
criar objeto ruim sem equals/hashCode;
demonstrar get retornando null com objeto ruim;
criar objeto de valor correto;
usar objeto de valor como chave de Map;
usar containsKey com objeto de valor;
usar remove com objeto de valor;
entender substituição por chave equivalente;
explicar chave mutável;
evitar campos mutáveis em chave;
criar Map<CodigoOs, OrdemServico>;
criar cadastro em memória com objeto como chave;
resolver MapClientePorCodigoObjetoApp;
resolver MapTecnicoPorCodigoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-158-map-com-objetos-como-chave
git commit -m "Aula 158: map com objetos como chave"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
HashMap com objeto próprio como chave só funciona corretamente quando a chave é estável e possui equals/hashCode coerentes.
```

Você viu que `String` já funciona naturalmente, mas objetos do seu domínio precisam ser bem modelados.

Também viu que objetos de valor, como `CodigoOs`, tornam o mapa mais seguro e expressivo.

Na próxima aula, vamos estudar outras implementações de `Map`:

```text
LinkedHashMap;
TreeMap.
```

Vamos entender ordem de inserção e ordenação por chave em mapas.
