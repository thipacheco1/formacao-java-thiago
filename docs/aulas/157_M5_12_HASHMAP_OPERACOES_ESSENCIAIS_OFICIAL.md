# 157 — M5.12 — HashMap operações essenciais

## Objetivo da aula

Nesta aula você vai aprofundar as operações mais importantes de `HashMap`.

Na aula anterior, você aprendeu que `Map` trabalha com pares:

```text
chave -> valor
```

E viu operações básicas como:

```text
put;
get;
containsKey;
containsValue;
remove;
keySet;
values;
entrySet;
getOrDefault;
putIfAbsent.
```

Agora vamos organizar essas operações em cenários mais próximos do dia a dia.

Ao final da aula, você deve conseguir:

```text
cadastrar no HashMap sem sobrescrever por acidente;
atualizar valor somente quando a chave existir;
usar putIfAbsent;
usar replace;
usar remove simples;
usar remove com chave e valor;
usar getOrDefault em contagens;
usar merge em contagens iniciais;
percorrer Map com entrySet;
criar índice por código;
criar cadastro em memória com Map;
entender quando usar containsKey antes de put;
entender diferença entre put, putIfAbsent e replace;
evitar erros comuns com null;
aplicar Map em cenário de Ordem de Serviço.
```

Essa aula deixa o uso de `HashMap` mais profissional.

---

## Ideia principal

`HashMap` é simples de começar, mas tem detalhes importantes.

A operação:

```java
mapa.put(chave, valor);
```

pode:

```text
cadastrar uma chave nova;
ou substituir um valor existente.
```

Isso pode ser correto ou perigoso, dependendo da regra.

Por isso você precisa saber escolher entre:

```text
put;
putIfAbsent;
replace;
containsKey + put;
remove;
remove(chave, valor);
getOrDefault;
merge.
```

Cada um comunica uma intenção diferente.

---

## Relembrando Map

Um `Map` guarda pares:

```text
OS-2026-0001 -> Ana Silva
OS-2026-0002 -> Carlos Souza
```

A chave é única.

O valor pode repetir.

Exemplo:

```text
OS-2026-0001 -> Ana Silva
OS-2026-0003 -> Ana Silva
```

Isso é permitido porque as chaves são diferentes.

Regra:

```text
chave não repete;
valor pode repetir.
```

---

## O problema do put

`put` é direto, mas pode sobrescrever.

Exemplo:

```java
mapa.put("OS-2026-0001", "Ana Silva");
mapa.put("OS-2026-0001", "Carlos Souza");
```

O valor final da chave será:

```text
Carlos Souza
```

A primeira informação foi substituída.

Isso pode ser desejado em atualização.

Mas pode ser erro em cadastro.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-157-hashmap-operacoes-essenciais
cd labs\m5\aula-157-hashmap-operacoes-essenciais
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula157
mkdir src\br\com\curso\aula157\app
mkdir src\br\com\curso\aula157\dominio
mkdir src\br\com\curso\aula157\dominio\ordemservico
mkdir src\br\com\curso\aula157\infra
```

---

## Exemplo 1 — put sobrescreve

Crie:

```text
src\br\com\curso\aula157\app\HashMapPutSobrescreveApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapPutSobrescreveApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0001", "Carlos Souza");

        System.out.println("Quantidade: " + clientePorOs.size());
        System.out.println("Cliente atual: " + clientePorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapPutSobrescreveApp
```

---

## O que observar

A quantidade final é:

```text
1
```

Porque existe apenas uma chave:

```text
OS-2026-0001
```

Mas o valor foi substituído.

Isso mostra que `put` sozinho não é uma operação segura para cadastro quando duplicidade deve ser bloqueada.

---

## Exemplo 2 — cadastrar com containsKey

Crie:

```text
src\br\com\curso\aula157\app\CadastroComContainsKeyApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class CadastroComContainsKeyApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        cadastrar(clientePorOs, "OS-2026-0001", "Ana Silva");
        cadastrar(clientePorOs, "OS-2026-0002", "Carlos Souza");

        try {
            cadastrar(clientePorOs, "OS-2026-0001", "Mariana Lima");
        } catch (IllegalStateException erro) {
            System.out.println("Erro: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("Mapa final:");

        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static void cadastrar(Map<String, String> mapa, String codigo, String cliente) {
        if (mapa.containsKey(codigo)) {
            throw new IllegalStateException("Já existe cadastro para a chave: " + codigo);
        }

        mapa.put(codigo, cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.CadastroComContainsKeyApp
```

---

## Quando usar containsKey antes de put

Use quando a regra é:

```text
se já existe, deve bloquear.
```

Exemplo:

```text
cadastrar OS;
cadastrar cliente por documento;
cadastrar produto por SKU;
cadastrar configuração obrigatoriamente única.
```

Esse código comunica intenção:

```java
if (mapa.containsKey(codigo)) {
    throw new IllegalStateException(...);
}

mapa.put(codigo, cliente);
```

Você está dizendo:

```text
não aceito sobrescrever.
```

---

## Exemplo 3 — putIfAbsent

`putIfAbsent` adiciona somente se a chave ainda não existir.

Crie:

```text
src\br\com\curso\aula157\app\HashMapPutIfAbsentEssencialApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapPutIfAbsentEssencialApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        String anterior1 = clientePorOs.putIfAbsent("OS-2026-0001", "Ana Silva");
        String anterior2 = clientePorOs.putIfAbsent("OS-2026-0001", "Carlos Souza");

        System.out.println("Retorno primeira tentativa: " + anterior1);
        System.out.println("Retorno segunda tentativa: " + anterior2);

        System.out.println();
        System.out.println("Valor final: " + clientePorOs.get("OS-2026-0001"));
        System.out.println("Quantidade: " + clientePorOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapPutIfAbsentEssencialApp
```

---

## O que putIfAbsent retorna

Se a chave não existia, ele adiciona e retorna `null`.

Se a chave já existia, ele não altera e retorna o valor antigo.

No exemplo:

```text
primeira tentativa:
adiciona Ana Silva.

segunda tentativa:
não troca por Carlos Souza.
```

O valor final continua:

```text
Ana Silva
```

---

## containsKey vs putIfAbsent

Os dois podem impedir sobrescrita.

Mas a intenção muda.

### containsKey + put

Bom quando você quer controlar erro:

```java
if (mapa.containsKey(chave)) {
    throw new IllegalStateException("Duplicado.");
}

mapa.put(chave, valor);
```

### putIfAbsent

Bom quando você quer manter o primeiro valor sem lançar erro necessariamente:

```java
mapa.putIfAbsent(chave, valor);
```

Regra prática:

```text
se duplicidade é erro de negócio, use validação clara.
se apenas quer manter o primeiro valor, putIfAbsent pode ser suficiente.
```

---

## Exemplo 4 — atualizar com containsKey

Crie:

```text
src\br\com\curso\aula157\app\AtualizarComContainsKeyApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class AtualizarComContainsKeyApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");

        atualizar(clientePorOs, "OS-2026-0001", "Ana Silva Atualizada");

        try {
            atualizar(clientePorOs, "OS-2026-9999", "Cliente Inexistente");
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("Valor final: " + clientePorOs.get("OS-2026-0001"));
    }

    private static void atualizar(Map<String, String> mapa, String codigo, String novoCliente) {
        if (!mapa.containsKey(codigo)) {
            throw new IllegalArgumentException("Não existe cadastro para a chave: " + codigo);
        }

        mapa.put(codigo, novoCliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.AtualizarComContainsKeyApp
```

---

## O que esse exemplo comunica

Aqui `put` é usado para atualizar.

Mas antes validamos:

```java
if (!mapa.containsKey(codigo)) {
    throw new IllegalArgumentException(...);
}
```

Ou seja:

```text
só atualizo se já existir.
```

Esse padrão é muito comum.

---

## Exemplo 5 — replace

`replace` substitui o valor somente se a chave existir.

Crie:

```text
src\br\com\curso\aula157\app\HashMapReplaceApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapReplaceApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");

        String antigo = clientePorOs.replace("OS-2026-0001", "Ana Silva Atualizada");
        String inexistente = clientePorOs.replace("OS-2026-9999", "Cliente Inexistente");

        System.out.println("Antigo valor substituído: " + antigo);
        System.out.println("Retorno chave inexistente: " + inexistente);
        System.out.println("Valor atual: " + clientePorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapReplaceApp
```

---

## replace retornando valor antigo

Esta versão:

```java
mapa.replace(chave, novoValor)
```

retorna o valor anterior.

Se a chave não existir, retorna `null` e não adiciona nada.

Diferença importante:

```text
put adiciona se não existir.
replace não adiciona se não existir.
```

---

## Exemplo 6 — replace com valor esperado

Existe outra versão de `replace`:

```java
replace(chave, valorAntigoEsperado, novoValor)
```

Ela só troca se a chave estiver associada ao valor esperado.

Crie:

```text
src\br\com\curso\aula157\app\HashMapReplaceCondicionalApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapReplaceCondicionalApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");

        boolean primeiraTroca = statusPorOs.replace(
                "OS-2026-0001",
                "AGENDADA",
                "REAGENDADA"
        );

        boolean segundaTroca = statusPorOs.replace(
                "OS-2026-0001",
                "AGENDADA",
                "CONCLUIDA"
        );

        System.out.println("Primeira troca aconteceu? " + primeiraTroca);
        System.out.println("Segunda troca aconteceu? " + segundaTroca);
        System.out.println("Status final: " + statusPorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapReplaceCondicionalApp
```

---

## Quando replace condicional é útil

Use quando você quer trocar apenas se o valor atual ainda for o esperado.

Exemplo:

```text
trocar AGENDADA para REAGENDADA;
trocar PENDENTE para PROCESSANDO;
trocar EM_ABERTO para FECHADO.
```

Mas lembre:

```text
regra de domínio não deve ficar solta em String.
```

Este exemplo é didático.

Em código real, preferimos enum ou objeto de domínio.

---

## Exemplo 7 — remove simples

Crie:

```text
src\br\com\curso\aula157\app\HashMapRemoveEssencialApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapRemoveEssencialApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");

        String removido = clientePorOs.remove("OS-2026-0002");
        String inexistente = clientePorOs.remove("OS-2026-9999");

        System.out.println("Removido: " + removido);
        System.out.println("Inexistente: " + inexistente);
        System.out.println("Quantidade final: " + clientePorOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapRemoveEssencialApp
```

---

## remove simples retorna valor

`remove(chave)` retorna o valor removido.

Se não existia, retorna `null`.

Isso permite verificar:

```java
String removido = mapa.remove(chave);

if (removido == null) {
    System.out.println("Nada foi removido.");
}
```

Mas de novo, cuidado com mapa que permite valor `null`.

No nosso padrão, vamos evitar valor `null`.

---

## Exemplo 8 — remove com chave e valor

Existe uma versão condicional:

```java
remove(chave, valor)
```

Ela só remove se a chave estiver associada exatamente àquele valor.

Crie:

```text
src\br\com\curso\aula157\app\HashMapRemoveCondicionalApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapRemoveCondicionalApp {
    public static void main(String[] args) {
        Map<String, String> statusPorOs = new HashMap<>();

        statusPorOs.put("OS-2026-0001", "AGENDADA");

        boolean primeiraRemocao = statusPorOs.remove("OS-2026-0001", "CONCLUIDA");
        boolean segundaRemocao = statusPorOs.remove("OS-2026-0001", "AGENDADA");

        System.out.println("Removeu com status errado? " + primeiraRemocao);
        System.out.println("Removeu com status correto? " + segundaRemocao);
        System.out.println("Quantidade final: " + statusPorOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapRemoveCondicionalApp
```

---

## Quando remove condicional é útil

Use quando a remoção depende do valor atual.

Exemplo:

```text
remover da fila somente se ainda estiver PENDENTE;
remover bloqueio somente se o motivo for o esperado;
remover marcação somente se ainda pertence ao usuário informado.
```

Mesmo assim, em domínio real, a regra normalmente deve estar em classe de domínio ou service de aplicação.

O `Map` é estrutura.

A regra de negócio precisa continuar bem localizada.

---

## Exemplo 9 — getOrDefault

`getOrDefault` evita tratamento manual de `null` quando existe um valor padrão.

Crie:

```text
src\br\com\curso\aula157\app\HashMapGetOrDefaultEssencialApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class HashMapGetOrDefaultEssencialApp {
    public static void main(String[] args) {
        Map<String, Integer> quantidadePorFila = new HashMap<>();

        quantidadePorFila.put("Entrada", 15);
        quantidadePorFila.put("Reagendamento", 7);

        int entrada = quantidadePorFila.getOrDefault("Entrada", 0);
        int semCapacity = quantidadePorFila.getOrDefault("Sem Capacity", 0);

        System.out.println("Entrada: " + entrada);
        System.out.println("Sem Capacity: " + semCapacity);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.HashMapGetOrDefaultEssencialApp
```

---

## Quando usar getOrDefault

Use quando:

```text
chave ausente tem um valor padrão claro;
contagem ausente deve ser zero;
configuração ausente tem valor padrão;
fila ausente significa quantidade zero.
```

Exemplo:

```java
int total = mapa.getOrDefault(chave, 0);
```

Isso evita:

```java
Integer total = mapa.get(chave);

if (total == null) {
    total = 0;
}
```

---

## Exemplo 10 — contagem com getOrDefault

Crie:

```text
src\br\com\curso\aula157\app\ContagemComGetOrDefaultApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ContagemComGetOrDefaultApp {
    public static void main(String[] args) {
        List<String> filas = List.of(
                "Entrada",
                "Reagendamento",
                "Entrada",
                "Sem Capacity",
                "Entrada",
                "Reagendamento"
        );

        Map<String, Integer> quantidadePorFila = new HashMap<>();

        for (String fila : filas) {
            int atual = quantidadePorFila.getOrDefault(fila, 0);
            quantidadePorFila.put(fila, atual + 1);
        }

        System.out.println("Quantidade por fila:");

        for (Map.Entry<String, Integer> entrada : quantidadePorFila.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.ContagemComGetOrDefaultApp
```

---

## Exemplo 11 — merge em contagem

Agora vamos conhecer um método mais compacto:

```java
merge
```

Ele pode ser usado para contagem.

Crie:

```text
src\br\com\curso\aula157\app\ContagemComMergeApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ContagemComMergeApp {
    public static void main(String[] args) {
        List<String> filas = List.of(
                "Entrada",
                "Reagendamento",
                "Entrada",
                "Sem Capacity",
                "Entrada",
                "Reagendamento"
        );

        Map<String, Integer> quantidadePorFila = new HashMap<>();

        for (String fila : filas) {
            quantidadePorFila.merge(fila, 1, Integer::sum);
        }

        System.out.println("Quantidade por fila:");

        for (Map.Entry<String, Integer> entrada : quantidadePorFila.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.ContagemComMergeApp
```

---

## Entendendo merge sem complicar

Este trecho:

```java
quantidadePorFila.merge(fila, 1, Integer::sum);
```

pode ser lido assim:

```text
se a fila ainda não existe, coloque 1.
se já existe, some o valor atual com 1.
```

`Integer::sum` é uma referência de método.

Ainda vamos aprofundar isso depois.

Por enquanto, entenda o comportamento.

O jeito com `getOrDefault` é mais didático.

O jeito com `merge` é mais compacto.

---

## Qual usar na prática

Para aprendizado inicial:

```text
getOrDefault é mais claro.
```

Para código mais maduro:

```text
merge pode ser muito bom para contagens.
```

Mas não use `merge` só para parecer avançado.

Use quando a equipe entender bem.

Código bom precisa ser compreensível.

---

## Domínio da aula

Agora vamos montar um domínio simples de OS.

Crie:

```text
src\br\com\curso\aula157\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula157.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula157\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula157.dominio.ordemservico;

import java.time.LocalDate;

public class OrdemServico {
    private final String codigo;
    private final String cliente;
    private LocalDate dataAtendimento;
    private StatusOs status;

    public OrdemServico(
            String codigo,
            String cliente,
            LocalDate dataAtendimento
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

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = StatusOs.AGENDADA;
    }

    public String codigo() {
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
        return codigo
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }
}
```

---

## Cadastro em memória com operações essenciais

Crie:

```text
src\br\com\curso\aula157\infra\CadastroOsHashMapMemoria.java
```

Código:

```java
package br.com.curso.aula157.infra;

import br.com.curso.aula157.dominio.ordemservico.OrdemServico;
import br.com.curso.aula157.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class CadastroOsHashMapMemoria {
    private final Map<String, OrdemServico> ordensPorCodigo;

    public CadastroOsHashMapMemoria() {
        this.ordensPorCodigo = new HashMap<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public OrdemServico buscarPorCodigo(String codigo) {
        return ordensPorCodigo.get(codigo);
    }

    public boolean existe(String codigo) {
        return ordensPorCodigo.containsKey(codigo);
    }

    public void reagendar(String codigo, LocalDate novaData) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.reagendar(novaData);
    }

    public void concluir(String codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.concluir();
    }

    public void cancelar(String codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.cancelar();
    }

    public boolean remover(String codigo) {
        return ordensPorCodigo.remove(codigo) != null;
    }

    public Collection<OrdemServico> listar() {
        return ordensPorCodigo.values();
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }

    public boolean vazio() {
        return ordensPorCodigo.isEmpty();
    }

    public Map<StatusOs, Integer> contarPorStatus() {
        Map<StatusOs, Integer> contagem = new HashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
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

## Observando a responsabilidade do cadastro

Esse cadastro usa `HashMap` para armazenar e buscar.

Ele faz:

```text
cadastrar;
buscar;
verificar existência;
reagendar;
concluir;
cancelar;
remover;
listar;
contar por status.
```

Mas as regras de status continuam na entidade:

```text
OrdemServico.
```

O cadastro coordena armazenamento em memória.

A entidade protege regra de negócio.

---

## App completo com cadastro HashMap

Crie:

```text
src\br\com\curso\aula157\app\CadastroOsHashMapApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import br.com.curso.aula157.dominio.ordemservico.OrdemServico;
import br.com.curso.aula157.dominio.ordemservico.StatusOs;
import br.com.curso.aula157.infra.CadastroOsHashMapMemoria;

import java.time.LocalDate;
import java.util.Map;

public class CadastroOsHashMapApp {
    public static void main(String[] args) {
        CadastroOsHashMapMemoria cadastro = new CadastroOsHashMapMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12)
        ));

        cadastro.reagendar("OS-2026-0001", LocalDate.of(2026, 12, 20));
        cadastro.concluir("OS-2026-0002");
        cadastro.cancelar("OS-2026-0003");

        System.out.println("Listagem:");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Relatório por status:");

        for (Map.Entry<StatusOs, Integer> entrada : cadastro.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.CadastroOsHashMapApp
```

---

## Validando operação inexistente

Crie:

```text
src\br\com\curso\aula157\app\CadastroOsHashMapErroApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import br.com.curso.aula157.dominio.ordemservico.OrdemServico;
import br.com.curso.aula157.infra.CadastroOsHashMapMemoria;

import java.time.LocalDate;

public class CadastroOsHashMapErroApp {
    public static void main(String[] args) {
        CadastroOsHashMapMemoria cadastro = new CadastroOsHashMapMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        try {
            cadastro.concluir("OS-2026-9999");
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro tratado: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.CadastroOsHashMapErroApp
```

---

## Listando values com cuidado

O método:

```java
ordensPorCodigo.values()
```

retorna uma coleção de valores.

No nosso cadastro, usamos:

```java
public Collection<OrdemServico> listar() {
    return ordensPorCodigo.values();
}
```

Para estudo, isso funciona.

Mas em código mais protegido, você poderia retornar cópia:

```java
return List.copyOf(ordensPorCodigo.values());
```

Isso evita que alguém tente mexer na visão interna.

Essa proteção será reforçada nas próximas aulas.

---

## keySet, values e entrySet na prática

Use:

```java
keySet()
```

quando precisa apenas das chaves.

Use:

```java
values()
```

quando precisa apenas dos valores.

Use:

```java
entrySet()
```

quando precisa da chave e do valor juntos.

Exemplo:

```text
listar códigos:
keySet.

listar OS:
values.

relatório código -> resumo:
entrySet.
```

---

## App com keySet, values e entrySet

Crie:

```text
src\br\com\curso\aula157\app\KeyValuesEntrySetPraticaApp.java
```

Código:

```java
package br.com.curso.aula157.app;

import java.util.HashMap;
import java.util.Map;

public class KeyValuesEntrySetPraticaApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");
        clientePorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Somente chaves:");
        for (String codigo : clientePorOs.keySet()) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Somente valores:");
        for (String cliente : clientePorOs.values()) {
            System.out.println("- " + cliente);
        }

        System.out.println();
        System.out.println("Chave e valor:");
        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula157.app.KeyValuesEntrySetPraticaApp
```

---

## Erro comum: atualizar enquanto percorre

Com `Map`, também existe risco ao alterar estruturalmente enquanto percorre.

Exemplo perigoso:

```java
for (String chave : mapa.keySet()) {
    mapa.remove(chave);
}
```

Isso pode causar erro.

Vamos estudar remoção segura em `Map` em aula própria.

Por enquanto, guarde:

```text
não altere estruturalmente o Map enquanto percorre suas views sem estratégia correta.
```

---

## Guia de intenção das operações

Use este guia:

### Quero cadastrar e bloquear duplicado

```java
if (mapa.containsKey(chave)) {
    throw new IllegalStateException("Duplicado.");
}

mapa.put(chave, valor);
```

### Quero cadastrar somente se não existir

```java
mapa.putIfAbsent(chave, valor);
```

### Quero atualizar mesmo se não existir

```java
mapa.put(chave, valor);
```

### Quero atualizar somente se existir

```java
mapa.replace(chave, novoValor);
```

ou com validação:

```java
if (!mapa.containsKey(chave)) {
    throw new IllegalArgumentException("Não encontrado.");
}

mapa.put(chave, valor);
```

### Quero remover por chave

```java
mapa.remove(chave);
```

### Quero remover somente se valor atual for específico

```java
mapa.remove(chave, valorEsperado);
```

### Quero contar

```java
int atual = mapa.getOrDefault(chave, 0);
mapa.put(chave, atual + 1);
```

ou:

```java
mapa.merge(chave, 1, Integer::sum);
```

---

## Ligação com backend

Essas operações aparecem em situações como:

```text
indexar uma lista por id;
bloquear duplicidade em importação;
atualizar cache;
contar registros por status;
montar relatório por categoria;
validar se código já foi processado;
remover item temporário;
aplicar regra somente se estado atual for esperado.
```

Exemplo de pensamento:

```text
Tenho uma lista de OS.
Preciso buscar por código várias vezes.
Melhor montar um Map<String, OrdemServico>.
```

Outro exemplo:

```text
Tenho vários status.
Preciso contar quantidade por status.
Map<StatusOs, Integer>.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — put, putIfAbsent e replace

Execute:

```powershell
java -cp out br.com.curso.aula157.app.HashMapPutSobrescreveApp
java -cp out br.com.curso.aula157.app.CadastroComContainsKeyApp
java -cp out br.com.curso.aula157.app.HashMapPutIfAbsentEssencialApp
java -cp out br.com.curso.aula157.app.AtualizarComContainsKeyApp
java -cp out br.com.curso.aula157.app.HashMapReplaceApp
java -cp out br.com.curso.aula157.app.HashMapReplaceCondicionalApp
```

### Parte 2 — remove e getOrDefault

Execute:

```powershell
java -cp out br.com.curso.aula157.app.HashMapRemoveEssencialApp
java -cp out br.com.curso.aula157.app.HashMapRemoveCondicionalApp
java -cp out br.com.curso.aula157.app.HashMapGetOrDefaultEssencialApp
```

### Parte 3 — contagem

Execute:

```powershell
java -cp out br.com.curso.aula157.app.ContagemComGetOrDefaultApp
java -cp out br.com.curso.aula157.app.ContagemComMergeApp
```

### Parte 4 — cadastro com domínio

Execute:

```powershell
java -cp out br.com.curso.aula157.app.CadastroOsHashMapApp
java -cp out br.com.curso.aula157.app.CadastroOsHashMapErroApp
```

### Parte 5 — views do Map

Execute:

```powershell
java -cp out br.com.curso.aula157.app.KeyValuesEntrySetPraticaApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula157\app\CadastroProdutosPorSkuApp.java
```

Ele deve usar:

```java
Map<String, String>
```

Onde:

```text
chave = SKU do produto;
valor = nome do produto.
```

Regras:

```text
cadastrar 5 produtos;
bloquear SKU duplicado com containsKey;
atualizar nome somente se SKU existir;
remover produto por SKU;
listar produtos com entrySet;
buscar SKU inexistente e tratar corretamente.
```

Critério principal:

```text
não deixar put sobrescrever cadastro sem validação.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula157\app\RelatorioFilasComMapApp.java
```

Ele deve:

```text
criar uma List<String> com nomes de filas;
incluir valores repetidos;
contar quantidade por fila usando getOrDefault;
contar quantidade por fila usando merge em outro Map;
exibir os dois relatórios;
comparar se as quantidades ficaram iguais.
```

Filas sugeridas:

```text
Entrada;
Reagendamento;
Sem Capacity;
Frustrados;
Entrada;
Reagendamento;
Entrada.
```

Critério principal:

```text
entender as duas formas de contagem.
```

---

## Erros comuns nesta aula

### 1. Usar put para cadastro sem validar duplicidade

Pode sobrescrever sem perceber.

### 2. Achar que putIfAbsent lança erro

Ele não lança erro por duplicidade.

Ele apenas mantém o valor antigo.

### 3. Usar replace achando que adiciona

`replace` não adiciona chave inexistente.

### 4. Usar get e não tratar null

Chave inexistente retorna `null`.

### 5. Usar remove simples sem verificar retorno

Se precisa saber se removeu, capture o retorno.

### 6. Usar String para status em regra real

Use enum.

String aqui aparece em exemplos pequenos.

### 7. Usar merge sem entender

Se o time não entende, `getOrDefault` pode ser mais claro.

### 8. Alterar Map enquanto percorre sem estratégia

Pode causar erro.

---

## Debug recomendado

Use debug em:

```text
CadastroComContainsKeyApp.java
HashMapPutIfAbsentEssencialApp.java
AtualizarComContainsKeyApp.java
HashMapReplaceApp.java
HashMapReplaceCondicionalApp.java
HashMapRemoveCondicionalApp.java
ContagemComGetOrDefaultApp.java
ContagemComMergeApp.java
CadastroOsHashMapMemoria.java
CadastroOsHashMapApp.java
```

Breakpoints recomendados:

```java
mapa.containsKey(...)

mapa.put(...)

mapa.putIfAbsent(...)

mapa.replace(...)

mapa.remove(...)

mapa.getOrDefault(...)

mapa.merge(...)

ordensPorCodigo.put(...)

ordensPorCodigo.values()

contagem.merge(...)
```

Observe:

```text
quando put substitui;
quando duplicidade é bloqueada;
quando putIfAbsent mantém o valor antigo;
quando replace não faz nada;
quando remove condicional falha;
como getOrDefault evita null;
como merge acumula;
como Map facilita busca por código.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre put, putIfAbsent e replace?
2. Quando usar remove(chave, valor)?
3. Por que getOrDefault ajuda em contagens?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar put com consciência;
bloquear duplicidade com containsKey;
usar putIfAbsent;
usar replace;
usar replace condicional;
usar remove simples;
usar remove condicional;
usar getOrDefault;
usar merge em contagem;
percorrer keySet;
percorrer values;
percorrer entrySet;
criar cadastro em memória com HashMap;
contar por status com Map;
explicar quando Map substitui busca em List;
resolver CadastroProdutosPorSkuApp;
resolver RelatorioFilasComMapApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-157-hashmap-operacoes-essenciais
git commit -m "Aula 157: hashmap operacoes essenciais"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
HashMap não é só put e get; cada operação comunica uma intenção diferente.
```

Você viu que `put` pode sobrescrever, `putIfAbsent` mantém o primeiro valor, `replace` atualiza apenas chave existente, `remove` pode ser simples ou condicional, e `getOrDefault`/`merge` ajudam muito em contagens.

Na próxima aula, vamos aprofundar `Map` com objetos como chave.

Vamos reforçar o uso de objetos de valor, `equals`, `hashCode` e chaves estáveis em mapas.
