# 161 — M5.16 — Remoção segura em Map

## Objetivo da aula

Nesta aula você vai aprofundar um ponto importante do uso de `Map`:

```text
como remover entradas de um mapa com segurança.
```

Na aula anterior, você estudou as formas de percorrer um `Map`:

```text
keySet();
values();
entrySet();
```

Agora vamos estudar o que acontece quando você precisa remover itens enquanto analisa um mapa.

Ao final da aula, você deve conseguir:

```text
entender por que remover durante iteração pode dar problema;
entender o risco de ConcurrentModificationException em Map;
remover por chave fora da iteração;
remover usando Iterator sobre entrySet;
remover usando removeIf em entrySet;
entender quando usar keySet.removeIf;
entender quando usar values.removeIf;
evitar remoção direta dentro de foreach;
remover entradas por chave;
remover entradas por valor;
remover entradas por condição envolvendo chave e valor;
aplicar remoção segura em cenários de Ordem de Serviço;
preservar clareza de regra de negócio.
```

Esta aula é importante porque `Map` aparece muito em backend para cache, índice, agrupamento, validação e processamento temporário.

---

## Ideia principal

Um `Map` guarda pares:

```text
chave -> valor
```

Exemplo:

```text
OS-2026-0001 -> AGENDADA
OS-2026-0002 -> CANCELADA
OS-2026-0003 -> CONCLUIDA
```

Às vezes você precisa remover entradas:

```text
remover OS canceladas;
remover códigos inválidos;
remover clientes bloqueados;
remover parâmetros vazios;
remover itens já processados;
limpar dados temporários.
```

Mas remover enquanto percorre exige cuidado.

---

## O problema

Este código é perigoso:

```java
for (String codigo : mapa.keySet()) {
    if (codigo.startsWith("TMP-")) {
        mapa.remove(codigo);
    }
}
```

Você está percorrendo uma visão do mapa e alterando o mapa diretamente ao mesmo tempo.

Isso pode causar:

```text
ConcurrentModificationException
```

Ou comportamento inesperado.

---

## Relembrando modificação estrutural

Modificação estrutural é quando você muda a estrutura da coleção.

Em `Map`, exemplos:

```text
put;
remove;
clear;
putAll;
removeIf em views.
```

Atualizar valor de uma entrada existente nem sempre muda a estrutura.

Mas remover chave altera a estrutura.

Por isso precisa de estratégia correta.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-161-remocao-segura-em-map
cd labs\m5\aula-161-remocao-segura-em-map
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula161
mkdir src\br\com\curso\aula161\app
mkdir src\br\com\curso\aula161\dominio
mkdir src\br\com\curso\aula161\dominio\valor
mkdir src\br\com\curso\aula161\dominio\ordemservico
mkdir src\br\com\curso\aula161\infra
```

---

## Exemplo errado: remover dentro de foreach em keySet

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoErradaKeySetApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.HashMap;
import java.util.Map;

public class MapRemocaoErradaKeySetApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");

        try {
            for (String codigo : statusPorOs.keySet()) {
                if (codigo.equals("OS-2026-0002")) {
                    statusPorOs.remove(codigo);
                }
            }
        } catch (RuntimeException erro) {
            System.out.println("Erro capturado: " + erro.getClass().getSimpleName());
            System.out.println("Mensagem: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoErradaKeySetApp
```

---

## O que observar

O erro acontece porque você percorre:

```java
statusPorOs.keySet()
```

e remove diretamente do mapa:

```java
statusPorOs.remove(codigo);
```

A visão `keySet` está ligada ao mapa original.

Quando o mapa muda estruturalmente durante o foreach, a iteração pode falhar.

Regra inicial:

```text
não remova diretamente do Map dentro de foreach sobre keySet, values ou entrySet.
```

---

## Exemplo errado: remover dentro de foreach em entrySet

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoErradaEntrySetApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.HashMap;
import java.util.Map;

public class MapRemocaoErradaEntrySetApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");

        try {
            for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
                if (entrada.getValue().equals("CANCELADA")) {
                    statusPorOs.remove(entrada.getKey());
                }
            }
        } catch (RuntimeException erro) {
            System.out.println("Erro capturado: " + erro.getClass().getSimpleName());
        }

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoErradaEntrySetApp
```

---

## Por que entrySet também exige cuidado

Mesmo usando `entrySet`, o problema continua se você remove diretamente do mapa:

```java
statusPorOs.remove(entrada.getKey());
```

durante o foreach.

Para remover durante iteração, use estratégia segura.

As estratégias principais são:

```text
Iterator sobre entrySet;
removeIf sobre entrySet;
removeIf sobre keySet;
removeIf sobre values;
coletar chaves para remover depois.
```

---

## Estratégia 1 — Remover fora da iteração

Se você sabe a chave exata, não precisa iterar.

Crie:

```text
src\br\com\curso\aula161\app\MapRemoveDiretoPorChaveApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.HashMap;
import java.util.Map;

public class MapRemoveDiretoPorChaveApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");

        String removido = statusPorOs.remove("OS-2026-0002");

        System.out.println("Valor removido: " + removido);

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemoveDiretoPorChaveApp
```

---

## Quando remover direto por chave

Use quando você já tem a chave.

Exemplos:

```text
remover OS pelo código recebido na requisição;
remover item do cache por id;
remover parâmetro por nome;
remover usuário por e-mail;
remover produto por SKU.
```

Não precisa percorrer o mapa inteiro se a chave já é conhecida.

---

## Estratégia 2 — Iterator sobre entrySet

Quando você precisa analisar chave e valor para decidir remoção, uma forma segura é usar `Iterator`.

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoComIteratorEntrySetApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MapRemocaoComIteratorEntrySetApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");
        statusPorOs.put("OS-2026-0004", "CANCELADA");

        Iterator<Map.Entry<String, String>> iterator = statusPorOs.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry<String, String> entrada = iterator.next();

            if (entrada.getValue().equals("CANCELADA")) {
                iterator.remove();
            }
        }

        System.out.println("Mapa após remover canceladas:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoComIteratorEntrySetApp
```

---

## Por que Iterator funciona

O `Iterator` controla a iteração.

Quando você chama:

```java
iterator.remove();
```

a remoção acontece pelo próprio iterador.

Isso mantém o processo coerente.

Regra:

```text
se está iterando com Iterator, remova pelo Iterator.
```

---

## Estratégia 3 — entrySet().removeIf

Uma forma mais direta é usar:

```java
entrySet().removeIf(...)
```

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoComEntrySetRemoveIfApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.HashMap;
import java.util.Map;

public class MapRemocaoComEntrySetRemoveIfApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");
        statusPorOs.put("OS-2026-0004", "CANCELADA");

        boolean removeu = statusPorOs.entrySet()
                .removeIf(entrada -> entrada.getValue().equals("CANCELADA"));

        System.out.println("Removeu alguma entrada? " + removeu);

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoComEntrySetRemoveIfApp
```

---

## Como ler entrySet().removeIf

Este trecho:

```java
statusPorOs.entrySet()
        .removeIf(entrada -> entrada.getValue().equals("CANCELADA"));
```

pode ser lido assim:

```text
remova todas as entradas cujo valor seja CANCELADA.
```

Como estamos usando `entrySet`, temos acesso a:

```text
chave;
valor.
```

Então dá para remover por condição envolvendo qualquer um dos dois.

---

## Remover por condição envolvendo chave e valor

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoPorChaveEValorApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemocaoPorChaveEValorApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new LinkedHashMap<>();

        statusPorOs.put("TMP-001", "AGENDADA");
        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("TMP-002", "CANCELADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");

        statusPorOs.entrySet().removeIf(entrada ->
                entrada.getKey().startsWith("TMP-")
                        || entrada.getValue().equals("CANCELADA")
        );

        System.out.println("Mapa após limpeza:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoPorChaveEValorApp
```

---

## Por que entrySet é poderoso

Com `entrySet`, você pode avaliar:

```text
chave;
valor;
chave e valor juntos.
```

Exemplo:

```java
entrada.getKey().startsWith("TMP-")
entrada.getValue().equals("CANCELADA")
```

Isso é ideal para limpezas condicionais.

---

## Estratégia 4 — keySet().removeIf

Se a remoção depende apenas da chave, você pode usar:

```java
keySet().removeIf(...)
```

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoComKeySetRemoveIfApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemocaoComKeySetRemoveIfApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new LinkedHashMap<>();

        clientePorOs.put("TMP-001", "Cliente Temporário 1");
        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("TMP-002", "Cliente Temporário 2");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");

        boolean removeu = clientePorOs.keySet()
                .removeIf(codigo -> codigo.startsWith("TMP-"));

        System.out.println("Removeu temporários? " + removeu);

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoComKeySetRemoveIfApp
```

---

## Quando usar keySet().removeIf

Use quando a condição só depende da chave.

Exemplos:

```text
remover chaves temporárias;
remover ids inválidos;
remover parâmetros com prefixo específico;
remover códigos fora do padrão;
remover registros por faixa de chave.
```

Se precisa do valor também, prefira `entrySet().removeIf`.

---

## Estratégia 5 — values().removeIf

Se a remoção depende apenas do valor, você pode usar:

```java
values().removeIf(...)
```

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoComValuesRemoveIfApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemocaoComValuesRemoveIfApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new LinkedHashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");
        statusPorOs.put("OS-2026-0004", "CANCELADA");

        boolean removeu = statusPorOs.values()
                .removeIf(status -> status.equals("CANCELADA"));

        System.out.println("Removeu canceladas? " + removeu);

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoComValuesRemoveIfApp
```

---

## Quando usar values().removeIf

Use quando a condição depende apenas do valor.

Exemplos:

```text
remover valores nulos;
remover status cancelado;
remover objetos inativos;
remover configurações vazias;
remover itens inválidos pelo valor.
```

Mas cuidado:

```text
com values você não vê a chave diretamente.
```

Se precisa da chave para log, auditoria ou regra, use `entrySet`.

---

## Estratégia 6 — Coletar chaves e remover depois

Outra abordagem é fazer em duas fases:

```text
1. percorre e coleta chaves que devem sair;
2. remove depois.
```

Crie:

```text
src\br\com\curso\aula161\app\MapRemocaoEmDuasFasesApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class MapRemocaoEmDuasFasesApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new LinkedHashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");
        statusPorOs.put("OS-2026-0002", "CANCELADA");
        statusPorOs.put("OS-2026-0003", "CONCLUIDA");
        statusPorOs.put("OS-2026-0004", "CANCELADA");

        List<String> chavesParaRemover = new ArrayList<>();

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            if (entrada.getValue().equals("CANCELADA")) {
                chavesParaRemover.add(entrada.getKey());
            }
        }

        for (String chave : chavesParaRemover) {
            statusPorOs.remove(chave);
        }

        System.out.println("Chaves removidas:");

        for (String chave : chavesParaRemover) {
            System.out.println("- " + chave);
        }

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : statusPorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemocaoEmDuasFasesApp
```

---

## Quando usar duas fases

Use duas fases quando:

```text
você precisa registrar quais chaves serão removidas;
precisa validar tudo antes de remover;
precisa gerar log;
precisa enviar evento;
precisa montar resposta com removidos;
a regra de remoção é complexa.
```

Essa abordagem é mais verbosa, mas muito clara.

Em backend, clareza muitas vezes vale mais do que código curto.

---

## Domínio da aula

Agora vamos usar objetos.

Crie:

```text
src\br\com\curso\aula161\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula161.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula161\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula161.dominio.valor;

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
src\br\com\curso\aula161\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula161.dominio.ordemservico;

import br.com.curso.aula161.dominio.valor.CodigoOs;

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

    public boolean cancelada() {
        return status == StatusOs.CANCELADA;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
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

## Remover OS canceladas com entrySet().removeIf

Crie:

```text
src\br\com\curso\aula161\app\MapRemoverOrdensCanceladasApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import br.com.curso.aula161.dominio.ordemservico.OrdemServico;
import br.com.curso.aula161.dominio.ordemservico.StatusOs;
import br.com.curso.aula161.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemoverOrdensCanceladasApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordens = criarMapa();

        System.out.println("Antes:");
        imprimir(ordens);

        ordens.entrySet().removeIf(entrada -> entrada.getValue().cancelada());

        System.out.println();
        System.out.println("Depois de remover canceladas:");
        imprimir(ordens);
    }

    private static Map<CodigoOs, OrdemServico> criarMapa() {
        Map<CodigoOs, OrdemServico> mapa = new LinkedHashMap<>();

        adicionar(mapa, "OS-2026-0001", "Ana Silva", StatusOs.AGENDADA);
        adicionar(mapa, "OS-2026-0002", "Carlos Souza", StatusOs.CANCELADA);
        adicionar(mapa, "OS-2026-0003", "Mariana Lima", StatusOs.CONCLUIDA);
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

    private static void imprimir(Map<CodigoOs, OrdemServico> ordens) {
        for (Map.Entry<CodigoOs, OrdemServico> entrada : ordens.entrySet()) {
            System.out.println(entrada.getKey().resumo() + " -> " + entrada.getValue().resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemoverOrdensCanceladasApp
```

---

## Remover OS encerradas com values().removeIf

Se a condição só depende da OS, você pode usar `values`.

Crie:

```text
src\br\com\curso\aula161\app\MapRemoverOrdensEncerradasValuesApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import br.com.curso.aula161.dominio.ordemservico.OrdemServico;
import br.com.curso.aula161.dominio.ordemservico.StatusOs;
import br.com.curso.aula161.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemoverOrdensEncerradasValuesApp {
    public static void main(String[] args) {
        Map<CodigoOs, OrdemServico> ordens = criarMapa();

        System.out.println("Antes:");
        imprimir(ordens);

        ordens.values().removeIf(os -> os.encerrada());

        System.out.println();
        System.out.println("Depois de remover encerradas:");
        imprimir(ordens);
    }

    private static Map<CodigoOs, OrdemServico> criarMapa() {
        Map<CodigoOs, OrdemServico> mapa = new LinkedHashMap<>();

        adicionar(mapa, "OS-2026-0001", "Ana Silva", StatusOs.AGENDADA);
        adicionar(mapa, "OS-2026-0002", "Carlos Souza", StatusOs.CANCELADA);
        adicionar(mapa, "OS-2026-0003", "Mariana Lima", StatusOs.CONCLUIDA);
        adicionar(mapa, "OS-2026-0004", "Bruno Rocha", StatusOs.REAGENDADA);

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

    private static void imprimir(Map<CodigoOs, OrdemServico> ordens) {
        for (OrdemServico os : ordens.values()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.MapRemoverOrdensEncerradasValuesApp
```

---

## Quando entrySet é melhor que values

`values().removeIf` é curto.

Mas se você precisa registrar o código removido, use `entrySet`.

Exemplo:

```text
preciso logar:
Removida OS-2026-0002 por estar cancelada.
```

Aí você precisa da chave.

Use `entrySet`.

---

## Cadastro em memória com limpeza segura

Crie:

```text
src\br\com\curso\aula161\infra\CadastroOsLimpezaMapMemoria.java
```

Código:

```java
package br.com.curso.aula161.infra;

import br.com.curso.aula161.dominio.ordemservico.OrdemServico;
import br.com.curso.aula161.dominio.ordemservico.StatusOs;
import br.com.curso.aula161.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CadastroOsLimpezaMapMemoria {
    private final Map<CodigoOs, OrdemServico> ordensPorCodigo;

    public CadastroOsLimpezaMapMemoria() {
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

    public int removerCanceladas() {
        int antes = ordensPorCodigo.size();

        ordensPorCodigo.entrySet().removeIf(entrada -> entrada.getValue().cancelada());

        int depois = ordensPorCodigo.size();

        return antes - depois;
    }

    public List<CodigoOs> removerEncerradasRegistrandoCodigos() {
        List<CodigoOs> removidas = new ArrayList<>();

        ordensPorCodigo.entrySet().removeIf(entrada -> {
            boolean deveRemover = entrada.getValue().encerrada();

            if (deveRemover) {
                removidas.add(entrada.getKey());
            }

            return deveRemover;
        });

        return List.copyOf(removidas);
    }

    public Map<StatusOs, Integer> contarPorStatus() {
        Map<StatusOs, Integer> contagem = new LinkedHashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public List<OrdemServico> listar() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }
}
```

---

## App do cadastro com limpeza

Crie:

```text
src\br\com\curso\aula161\app\CadastroOsLimpezaMapApp.java
```

Código:

```java
package br.com.curso.aula161.app;

import br.com.curso.aula161.dominio.ordemservico.OrdemServico;
import br.com.curso.aula161.dominio.ordemservico.StatusOs;
import br.com.curso.aula161.dominio.valor.CodigoOs;
import br.com.curso.aula161.infra.CadastroOsLimpezaMapMemoria;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class CadastroOsLimpezaMapApp {
    public static void main(String[] args) {
        CadastroOsLimpezaMapMemoria cadastro = new CadastroOsLimpezaMapMemoria();

        cadastrar(cadastro, "OS-2026-0001", "Ana Silva", StatusOs.AGENDADA);
        cadastrar(cadastro, "OS-2026-0002", "Carlos Souza", StatusOs.CANCELADA);
        cadastrar(cadastro, "OS-2026-0003", "Mariana Lima", StatusOs.CONCLUIDA);
        cadastrar(cadastro, "OS-2026-0004", "Bruno Rocha", StatusOs.REAGENDADA);

        System.out.println("Antes:");
        imprimir(cadastro);

        List<CodigoOs> removidas = cadastro.removerEncerradasRegistrandoCodigos();

        System.out.println();
        System.out.println("Códigos removidos:");

        for (CodigoOs codigo : removidas) {
            System.out.println("- " + codigo.resumo());
        }

        System.out.println();
        System.out.println("Depois:");
        imprimir(cadastro);
    }

    private static void cadastrar(
            CadastroOsLimpezaMapMemoria cadastro,
            String codigo,
            String cliente,
            StatusOs status
    ) {
        cadastro.cadastrar(new OrdemServico(
                new CodigoOs(codigo),
                cliente,
                LocalDate.of(2026, 12, 10),
                status
        ));
    }

    private static void imprimir(CadastroOsLimpezaMapMemoria cadastro) {
        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println("Quantidade: " + cadastro.quantidade());

        System.out.println("Contagem:");

        for (Map.Entry<StatusOs, Integer> entrada : cadastro.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula161.app.CadastroOsLimpezaMapApp
```

---

## O que esse cadastro demonstra

Ele mostra uma operação madura:

```text
remover entradas do mapa com segurança;
registrar quais chaves foram removidas;
retornar uma cópia da lista de removidos;
preservar regras nos objetos;
não expor mapa interno.
```

Esse tipo de cuidado prepara para código backend real.

---

## Remoção e regra de negócio

Importante:

```text
Map é estrutura de dados.
Regra de negócio não deve virar bagunça dentro de lambda.
```

Uma condição simples pode ficar ali:

```java
entrada.getValue().cancelada()
```

Mas se a regra crescer muito, extraia método.

Exemplo:

```java
private boolean deveRemover(OrdemServico os) {
    return os.cancelada();
}
```

Código bom é legível.

---

## Comparando estratégias

### Remover direto por chave

Use quando já sabe a chave.

```java
mapa.remove(chave);
```

### Iterator sobre entrySet

Use quando quer controle manual durante iteração.

```java
Iterator<Map.Entry<K, V>> iterator = mapa.entrySet().iterator();
```

### entrySet().removeIf

Use quando a condição envolve chave e valor.

```java
mapa.entrySet().removeIf(entrada -> ...);
```

### keySet().removeIf

Use quando a condição depende só da chave.

```java
mapa.keySet().removeIf(chave -> ...);
```

### values().removeIf

Use quando a condição depende só do valor.

```java
mapa.values().removeIf(valor -> ...);
```

### Duas fases

Use quando precisa registrar, validar ou explicar antes de remover.

```text
coleta chaves;
remove depois.
```

---

## Ligação com backend

Remoção segura em `Map` aparece em:

```text
limpeza de cache;
remoção de dados inválidos;
processamento de importação;
remoção de itens temporários;
limpeza de parâmetros vazios;
retirada de OS canceladas de um painel;
limpeza de headers internos;
remoção de permissões expiradas;
remoção de sessões inativas.
```

Exemplo realista:

```text
Tenho um Map<CodigoOs, OrdemServico>.
Preciso remover OS encerradas antes de exibir um painel de atendimento.
```

Estratégia possível:

```java
ordens.values().removeIf(os -> os.encerrada());
```

Mas se precisar registrar os códigos removidos:

```java
ordens.entrySet().removeIf(...)
```

com coleta.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ver os erros

Execute:

```powershell
java -cp out br.com.curso.aula161.app.MapRemocaoErradaKeySetApp
java -cp out br.com.curso.aula161.app.MapRemocaoErradaEntrySetApp
```

Observe por que remover diretamente durante foreach é perigoso.

### Parte 2 — Remover corretamente

Execute:

```powershell
java -cp out br.com.curso.aula161.app.MapRemoveDiretoPorChaveApp
java -cp out br.com.curso.aula161.app.MapRemocaoComIteratorEntrySetApp
java -cp out br.com.curso.aula161.app.MapRemocaoComEntrySetRemoveIfApp
```

### Parte 3 — Remover por chave, valor e condição composta

Execute:

```powershell
java -cp out br.com.curso.aula161.app.MapRemocaoPorChaveEValorApp
java -cp out br.com.curso.aula161.app.MapRemocaoComKeySetRemoveIfApp
java -cp out br.com.curso.aula161.app.MapRemocaoComValuesRemoveIfApp
java -cp out br.com.curso.aula161.app.MapRemocaoEmDuasFasesApp
```

### Parte 4 — Usar objetos

Execute:

```powershell
java -cp out br.com.curso.aula161.app.MapRemoverOrdensCanceladasApp
java -cp out br.com.curso.aula161.app.MapRemoverOrdensEncerradasValuesApp
java -cp out br.com.curso.aula161.app.CadastroOsLimpezaMapApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula161\app\LimpezaParametrosMapApp.java
```

Ele deve:

```text
criar Map<String, String>;
adicionar parâmetros válidos;
adicionar parâmetros com chave iniciando por TMP_;
adicionar parâmetros com valor vazio;
remover entradas cuja chave inicia com TMP_;
remover entradas cujo valor é nulo ou branco;
exibir o mapa antes;
exibir o mapa depois.
```

Critério principal:

```text
usar entrySet().removeIf quando a regra envolver chave e valor.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula161\app\LimpezaOrdensComRelatorioApp.java
```

Ele deve:

```text
criar Map<CodigoOs, OrdemServico>;
adicionar pelo menos 8 OS com status variados;
remover OS encerradas;
registrar códigos removidos;
exibir quantidade antes;
exibir quantidade depois;
exibir códigos removidos;
exibir OS restantes.
```

Critério principal:

```text
usar entrySet().removeIf e registrar as chaves removidas.
```

---

## Erros comuns nesta aula

### 1. Remover diretamente do Map dentro de foreach

Evite:

```java
for (K chave : mapa.keySet()) {
    mapa.remove(chave);
}
```

### 2. Usar keySet quando precisa do valor

Se precisa do valor, use `entrySet`.

### 3. Usar values quando precisa registrar a chave

Se precisa da chave, use `entrySet`.

### 4. Colocar regra complexa demais dentro de lambda

Extraia método quando a regra crescer.

### 5. Esquecer que views são ligadas ao Map

`keySet`, `values` e `entrySet` refletem o mapa.

### 6. Usar String para status em regra real

Use enum.

### 7. Remover dados sem registrar quando precisa de auditoria

Em alguns cenários, colete chaves removidas.

### 8. Confundir remover do Map com deletar do banco

Remover do `Map` é só memória.

Banco de dados envolve repository, transação e regra de aplicação.

---

## Debug recomendado

Use debug em:

```text
MapRemocaoErradaKeySetApp.java
MapRemocaoErradaEntrySetApp.java
MapRemocaoComIteratorEntrySetApp.java
MapRemocaoComEntrySetRemoveIfApp.java
MapRemocaoComKeySetRemoveIfApp.java
MapRemocaoComValuesRemoveIfApp.java
MapRemocaoEmDuasFasesApp.java
CadastroOsLimpezaMapMemoria.java
CadastroOsLimpezaMapApp.java
```

Breakpoints recomendados:

```java
mapa.remove(...)

iterator.hasNext()

iterator.next()

iterator.remove()

entrySet().removeIf(...)

keySet().removeIf(...)

values().removeIf(...)

chavesParaRemover.add(...)

ordensPorCodigo.entrySet().removeIf(...)

removidas.add(...)
```

Observe:

```text
quando a exceção ocorre;
como Iterator remove corretamente;
como removeIf limpa entradas;
quando usar chave;
quando usar valor;
como registrar removidos;
como o tamanho do mapa muda.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que remover diretamente do Map durante foreach é perigoso?
2. Quando usar entrySet().removeIf?
3. Quando vale a pena remover em duas fases?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar remoção insegura em Map;
reconhecer risco de ConcurrentModificationException;
remover direto por chave;
remover com Iterator em entrySet;
remover com entrySet().removeIf;
remover com keySet().removeIf;
remover com values().removeIf;
remover em duas fases;
remover por condição de chave;
remover por condição de valor;
remover por condição envolvendo chave e valor;
aplicar remoção em Map<CodigoOs, OrdemServico>;
registrar chaves removidas;
resolver LimpezaParametrosMapApp;
resolver LimpezaOrdensComRelatorioApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-161-remocao-segura-em-map
git commit -m "Aula 161: remocao segura em map"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
remover entradas de um Map durante iteração exige estratégia correta.
```

Você aprendeu várias formas seguras:

```text
remove direto por chave;
Iterator sobre entrySet;
entrySet().removeIf;
keySet().removeIf;
values().removeIf;
duas fases.
```

Na próxima aula, vamos estudar `Collections` utility class.

Vamos conhecer métodos utilitários como `sort`, `reverse`, `shuffle`, `min`, `max`, `frequency` e entender quando usar utilitários prontos em vez de escrever tudo manualmente.
