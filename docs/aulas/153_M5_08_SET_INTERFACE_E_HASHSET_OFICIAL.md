# 153 — M5.08 — Set interface e HashSet

## Objetivo da aula

Nesta aula você vai começar uma nova família importante do Collections Framework:

```text
Set
```

E a implementação mais comum para começar:

```text
HashSet
```

Nas aulas anteriores, você estudou `List`, `ArrayList`, `LinkedList`, iteração e remoção segura.

Agora vamos estudar uma coleção com uma característica diferente:

```text
Set não aceita elementos duplicados.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é Set;
explicar o que é HashSet;
entender a diferença entre List e Set;
entender que Set não trabalha com índice;
entender que HashSet não garante ordem;
usar add, remove, contains, size e isEmpty;
entender o retorno boolean do add;
usar Set para evitar duplicidade;
converter List para Set;
converter Set para List;
usar Set com String;
usar Set com enum;
usar Set em cenário de backend;
entender o cuidado inicial com objetos próprios e equals/hashCode.
```

Esta aula é essencial para quando você precisa garantir unicidade.

---

## Ideia principal

`Set` representa um conjunto.

Um conjunto não aceita elementos repetidos.

Exemplo:

```java
Set<String> codigos = new HashSet<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0001");
codigos.add("OS-2026-0002");
```

Mesmo tentando adicionar `"OS-2026-0001"` duas vezes, o conjunto terá apenas dois elementos:

```text
OS-2026-0001
OS-2026-0002
```

Essa é a ideia central.

---

## Quando pensar em Set

Pense em `Set` quando você precisa de:

```text
valores únicos;
não permitir duplicidade;
conjunto de permissões;
conjunto de códigos;
conjunto de categorias;
conjunto de tags;
ids sem repetição;
validação de duplicados;
remoção de repetidos.
```

Exemplos de backend:

```text
permissões de um usuário;
códigos de OS já importados;
ids selecionados em uma tela;
categorias de produto;
clientes afetados por um processamento;
tipos de serviço habilitados.
```

---

## List vs Set

### List

`List`:

```text
mantém ordem de inserção;
aceita repetidos;
tem índice;
permite get(0), get(1), get(2);
é boa para sequência.
```

Exemplo:

```java
List<String> nomes = new ArrayList<>();
```

### Set

`Set`:

```text
não aceita repetidos;
não trabalha com índice;
não tem get(0);
representa conjunto;
é bom para unicidade.
```

Exemplo:

```java
Set<String> codigos = new HashSet<>();
```

A escolha depende do problema.

---

## O que é HashSet

`HashSet` é uma implementação da interface `Set`.

Ele é muito usado porque oferece operações eficientes para:

```text
adicionar;
verificar se contém;
remover;
evitar duplicidade.
```

Exemplo:

```java
Set<String> codigos = new HashSet<>();
```

Leia assim:

```text
quero trabalhar com um conjunto de Strings;
a implementação escolhida é HashSet.
```

---

## HashSet não garante ordem

Este ponto é importante:

```text
HashSet não garante a ordem de exibição.
```

Você pode adicionar nesta ordem:

```text
A;
B;
C.
```

Mas a impressão pode não sair exatamente nessa ordem.

Se a ordem for importante, existem outras opções, como:

```text
LinkedHashSet;
TreeSet.
```

Vamos estudar isso depois.

Por enquanto, guarde:

```text
HashSet é sobre unicidade, não sobre ordem.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-153-set-interface-e-hashset
cd labs\m5\aula-153-set-interface-e-hashset
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula153
mkdir src\br\com\curso\aula153\app
mkdir src\br\com\curso\aula153\dominio
mkdir src\br\com\curso\aula153\dominio\ordemservico
mkdir src\br\com\curso\aula153\dominio\usuario
```

---

## Primeiro exemplo com HashSet

Crie:

```text
src\br\com\curso\aula153\app\PrimeiroHashSetApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class PrimeiroHashSetApp {
    public static void main(String[] args) {
        Set<String> codigosOs = new HashSet<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        System.out.println("Quantidade: " + codigosOs.size());

        System.out.println();
        System.out.println("Códigos:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.PrimeiroHashSetApp
```

---

## O que observar

A criação é parecida com `List`:

```java
Set<String> codigosOs = new HashSet<>();
```

Mas agora estamos usando `Set`.

A coleção ainda pode ser percorrida:

```java
for (String codigo : codigosOs)
```

Mas não existe acesso por índice:

```java
codigosOs.get(0)
```

Isso não existe em `Set`.

---

## HashSet não aceita duplicados

Crie:

```text
src\br\com\curso\aula153\app\HashSetNaoAceitaDuplicadosApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetNaoAceitaDuplicadosApp {
    public static void main(String[] args) {
        Set<String> codigosOs = new HashSet<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0003");
        codigosOs.add("OS-2026-0002");

        System.out.println("Quantidade final: " + codigosOs.size());

        System.out.println();
        System.out.println("Códigos únicos:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.HashSetNaoAceitaDuplicadosApp
```

---

## O que observar nos duplicados

Tentamos adicionar:

```text
OS-2026-0001 duas vezes;
OS-2026-0002 duas vezes.
```

Mas o `Set` manteve apenas um de cada.

Isso é útil quando você quer garantir que um valor apareça uma única vez.

---

## O add retorna boolean

No `Set`, o método `add` retorna `boolean`.

Crie:

```text
src\br\com\curso\aula153\app\HashSetAddRetornaBooleanApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetAddRetornaBooleanApp {
    public static void main(String[] args) {
        Set<String> codigosOs = new HashSet<>();

        boolean primeiro = codigosOs.add("OS-2026-0001");
        boolean segundo = codigosOs.add("OS-2026-0002");
        boolean repetido = codigosOs.add("OS-2026-0001");

        System.out.println("Primeiro foi adicionado? " + primeiro);
        System.out.println("Segundo foi adicionado? " + segundo);
        System.out.println("Repetido foi adicionado? " + repetido);

        System.out.println();
        System.out.println("Quantidade final: " + codigosOs.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.HashSetAddRetornaBooleanApp
```

---

## Como usar o retorno do add

Se `add` retorna `true`, o elemento entrou.

Se retorna `false`, o elemento já existia.

Exemplo:

```java
boolean adicionado = codigosOs.add(codigo);

if (!adicionado) {
    System.out.println("Código duplicado: " + codigo);
}
```

Isso é muito útil em importações e validações.

---

## Validando duplicidade com Set

Crie:

```text
src\br\com\curso\aula153\app\ValidarDuplicidadeComSetApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ValidarDuplicidadeComSetApp {
    public static void main(String[] args) {
        List<String> codigosImportados = List.of(
                "OS-2026-0001",
                "OS-2026-0002",
                "OS-2026-0003",
                "OS-2026-0002",
                "OS-2026-0004",
                "OS-2026-0001"
        );

        Set<String> codigosUnicos = new HashSet<>();
        Set<String> codigosDuplicados = new HashSet<>();

        for (String codigo : codigosImportados) {
            boolean adicionado = codigosUnicos.add(codigo);

            if (!adicionado) {
                codigosDuplicados.add(codigo);
            }
        }

        System.out.println("Códigos importados: " + codigosImportados.size());
        System.out.println("Códigos únicos: " + codigosUnicos.size());
        System.out.println("Duplicados encontrados: " + codigosDuplicados.size());

        System.out.println();
        System.out.println("Duplicados:");

        for (String codigo : codigosDuplicados) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.ValidarDuplicidadeComSetApp
```

---

## O que este exemplo mostra

Esse exemplo é muito próximo de cenário real.

Imagine uma importação de OS.

Você recebe vários códigos.

Precisa descobrir:

```text
quantos vieram;
quantos são únicos;
quais estão duplicados.
```

`Set` resolve isso de forma simples.

---

## contains em Set

`contains` verifica se o conjunto contém um valor.

Crie:

```text
src\br\com\curso\aula153\app\HashSetContainsApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetContainsApp {
    public static void main(String[] args) {
        Set<String> codigosBloqueados = new HashSet<>();

        codigosBloqueados.add("OS-2026-0002");
        codigosBloqueados.add("OS-2026-0005");

        verificar(codigosBloqueados, "OS-2026-0001");
        verificar(codigosBloqueados, "OS-2026-0002");
        verificar(codigosBloqueados, "OS-2026-0005");
    }

    private static void verificar(Set<String> codigosBloqueados, String codigo) {
        if (codigosBloqueados.contains(codigo)) {
            System.out.println(codigo + " está bloqueada.");
        } else {
            System.out.println(codigo + " está liberada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.HashSetContainsApp
```

---

## Por que contains em Set é importante

`Set` é muito usado quando você precisa perguntar rapidamente:

```text
este valor existe no conjunto?
este usuário tem esta permissão?
esta OS está na lista de bloqueio?
este id já foi processado?
```

Exemplo de leitura:

```java
if (permissoes.contains("ADMIN")) {
    ...
}
```

---

## remove em Set

Crie:

```text
src\br\com\curso\aula153\app\HashSetRemoveApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetRemoveApp {
    public static void main(String[] args) {
        Set<String> permissoes = new HashSet<>();

        permissoes.add("OS_CONSULTAR");
        permissoes.add("OS_CRIAR");
        permissoes.add("OS_CANCELAR");

        System.out.println("Antes:");
        imprimir(permissoes);

        boolean removeu = permissoes.remove("OS_CANCELAR");
        boolean removeuInexistente = permissoes.remove("OS_EXCLUIR");

        System.out.println();
        System.out.println("Removeu OS_CANCELAR? " + removeu);
        System.out.println("Removeu OS_EXCLUIR? " + removeuInexistente);

        System.out.println();
        System.out.println("Depois:");
        imprimir(permissoes);
    }

    private static void imprimir(Set<String> permissoes) {
        for (String permissao : permissoes) {
            System.out.println("- " + permissao);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.HashSetRemoveApp
```

---

## Retorno do remove

Assim como em outras coleções, `remove` pode retornar `boolean`.

```java
boolean removeu = permissoes.remove("OS_CANCELAR");
```

Se removeu, retorna `true`.

Se não existia, retorna `false`.

Isso permite mensagens claras.

---

## Set não tem índice

Crie:

```text
src\br\com\curso\aula153\app\SetNaoTemIndiceApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class SetNaoTemIndiceApp {
    public static void main(String[] args) {
        Set<String> codigos = new HashSet<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");

        System.out.println("Set não possui get(0).");
        System.out.println("Para percorrer, use foreach:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.SetNaoTemIndiceApp
```

---

## Por que Set não tem get

`Set` representa conjunto.

Em conjunto, a ideia principal não é posição.

A ideia principal é:

```text
pertence ou não pertence ao conjunto?
```

Por isso, operações importantes são:

```text
add;
contains;
remove.
```

Se você precisa de posição, provavelmente precisa de `List`.

---

## Comparando List e Set

Crie:

```text
src\br\com\curso\aula153\app\ComparacaoListSetApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ComparacaoListSetApp {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        Set<String> conjunto = new HashSet<>();

        adicionar(lista, conjunto, "OS-2026-0001");
        adicionar(lista, conjunto, "OS-2026-0002");
        adicionar(lista, conjunto, "OS-2026-0001");
        adicionar(lista, conjunto, "OS-2026-0003");
        adicionar(lista, conjunto, "OS-2026-0002");

        System.out.println("List aceita repetidos:");
        for (String codigo : lista) {
            System.out.println("- " + codigo);
        }

        System.out.println("Quantidade List: " + lista.size());

        System.out.println();
        System.out.println("Set remove duplicidade:");
        for (String codigo : conjunto) {
            System.out.println("- " + codigo);
        }

        System.out.println("Quantidade Set: " + conjunto.size());
    }

    private static void adicionar(List<String> lista, Set<String> conjunto, String codigo) {
        lista.add(codigo);
        conjunto.add(codigo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.ComparacaoListSetApp
```

---

## O que observar na comparação

A `List` guardou todos os elementos.

O `Set` guardou apenas valores únicos.

Isso reforça:

```text
List é sequência.
Set é conjunto.
```

Nenhum é melhor sempre.

Cada um resolve um problema diferente.

---

## Convertendo List para Set

Às vezes você recebe uma lista com duplicados e quer remover duplicidades.

Crie:

```text
src\br\com\curso\aula153\app\ConverterListParaSetApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ConverterListParaSetApp {
    public static void main(String[] args) {
        List<String> codigosComDuplicidade = List.of(
                "OS-2026-0001",
                "OS-2026-0002",
                "OS-2026-0001",
                "OS-2026-0003",
                "OS-2026-0002"
        );

        Set<String> codigosUnicos = new HashSet<>(codigosComDuplicidade);

        System.out.println("Quantidade na List: " + codigosComDuplicidade.size());
        System.out.println("Quantidade no Set: " + codigosUnicos.size());

        System.out.println();
        System.out.println("Códigos únicos:");

        for (String codigo : codigosUnicos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.ConverterListParaSetApp
```

---

## Cuidado com ordem ao converter

Quando você faz:

```java
new HashSet<>(lista)
```

as duplicidades são removidas.

Mas a ordem não é garantida.

Se você precisa remover duplicidade mantendo ordem de inserção, `LinkedHashSet` pode ser melhor.

Vamos estudar isso em aula futura.

Por enquanto:

```text
HashSet remove duplicidade, mas não preserva ordem.
```

---

## Convertendo Set para List

Às vezes você tem um `Set`, mas precisa devolver uma `List`.

Crie:

```text
src\br\com\curso\aula153\app\ConverterSetParaListApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ConverterSetParaListApp {
    public static void main(String[] args) {
        Set<String> codigosUnicos = new HashSet<>();

        codigosUnicos.add("OS-2026-0001");
        codigosUnicos.add("OS-2026-0002");
        codigosUnicos.add("OS-2026-0003");

        List<String> listaDeCodigos = new ArrayList<>(codigosUnicos);

        System.out.println("Lista criada a partir do Set:");

        for (String codigo : listaDeCodigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.ConverterSetParaListApp
```

---

## Set com enum

`Set` combina muito bem com enum.

Exemplo:

```text
permissões;
papéis;
status habilitados;
tipos selecionados.
```

Crie:

```text
src\br\com\curso\aula153\dominio\usuario\PermissaoUsuario.java
```

Código:

```java
package br.com.curso.aula153.dominio.usuario;

public enum PermissaoUsuario {
    OS_CONSULTAR,
    OS_CRIAR,
    OS_REAGENDAR,
    OS_CANCELAR,
    RELATORIO_VISUALIZAR
}
```

Crie:

```text
src\br\com\curso\aula153\app\SetComEnumApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import br.com.curso.aula153.dominio.usuario.PermissaoUsuario;

import java.util.HashSet;
import java.util.Set;

public class SetComEnumApp {
    public static void main(String[] args) {
        Set<PermissaoUsuario> permissoes = new HashSet<>();

        permissoes.add(PermissaoUsuario.OS_CONSULTAR);
        permissoes.add(PermissaoUsuario.OS_CRIAR);
        permissoes.add(PermissaoUsuario.OS_CONSULTAR);
        permissoes.add(PermissaoUsuario.RELATORIO_VISUALIZAR);

        System.out.println("Permissões do usuário:");

        for (PermissaoUsuario permissao : permissoes) {
            System.out.println("- " + permissao);
        }

        System.out.println();
        System.out.println("Pode consultar OS? " + permissoes.contains(PermissaoUsuario.OS_CONSULTAR));
        System.out.println("Pode cancelar OS? " + permissoes.contains(PermissaoUsuario.OS_CANCELAR));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.SetComEnumApp
```

---

## Por que Set com enum é bom

Permissão não deveria ficar duplicada.

Um usuário ou tem a permissão, ou não tem.

Não faz sentido ter:

```text
OS_CONSULTAR;
OS_CONSULTAR;
OS_CONSULTAR.
```

Por isso `Set<PermissaoUsuario>` faz muito sentido.

---

## Domínio simples de OS

Crie:

```text
src\br\com\curso\aula153\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula153.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula153\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula153.dominio.ordemservico;

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

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }
}
```

---

## Set para validar códigos de OS

Crie:

```text
src\br\com\curso\aula153\app\SetValidarCodigosOsApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import br.com.curso.aula153.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula153.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SetValidarCodigosOsApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = List.of(
                new ResumoOrdemServico(
                        "OS-2026-0001",
                        "Ana Silva",
                        LocalDate.of(2026, 12, 10),
                        StatusOs.AGENDADA
                ),
                new ResumoOrdemServico(
                        "OS-2026-0002",
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        StatusOs.CONCLUIDA
                ),
                new ResumoOrdemServico(
                        "OS-2026-0001",
                        "Mariana Lima",
                        LocalDate.of(2026, 12, 12),
                        StatusOs.REAGENDADA
                )
        );

        Set<String> codigosUnicos = new HashSet<>();
        Set<String> duplicados = new HashSet<>();

        for (ResumoOrdemServico os : ordens) {
            boolean adicionado = codigosUnicos.add(os.codigo());

            if (!adicionado) {
                duplicados.add(os.codigo());
            }
        }

        if (duplicados.isEmpty()) {
            System.out.println("Nenhum código duplicado encontrado.");
        } else {
            System.out.println("Códigos duplicados:");

            for (String codigo : duplicados) {
                System.out.println("- " + codigo);
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.SetValidarCodigosOsApp
```

---

## O que esse exemplo mostra

Mesmo com objetos de OS, usamos `Set<String>` para validar os códigos.

Isso é muito comum.

Às vezes você não precisa colocar o objeto inteiro no `Set`.

Você pode usar apenas a chave de unicidade.

Exemplo:

```text
código da OS;
id do cliente;
CPF;
SKU;
número do contrato.
```

---

## Cuidado com Set de objetos próprios

Agora vem um ponto importante.

`HashSet` usa igualdade para saber se algo é duplicado.

Com `String`, isso funciona naturalmente.

Com `enum`, também.

Mas com objetos próprios, você precisa tomar cuidado.

Crie:

```text
src\br\com\curso\aula153\app\SetComObjetosSemEqualsApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import br.com.curso.aula153.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula153.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class SetComObjetosSemEqualsApp {
    public static void main(String[] args) {
        Set<ResumoOrdemServico> ordens = new HashSet<>();

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        System.out.println("Quantidade no Set: " + ordens.size());

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.SetComObjetosSemEqualsApp
```

---

## O que observar

Você criou duas OS visualmente iguais.

Mas o `HashSet` pode aceitar as duas porque são dois objetos diferentes na memória.

Por quê?

Porque a classe `ResumoOrdemServico` ainda não definiu `equals` e `hashCode`.

Esse assunto é tão importante que será a próxima aula.

Por enquanto, guarde:

```text
Set evita duplicados conforme a regra de igualdade do objeto.
```

Para `String`, a regra já existe.

Para objetos próprios, você precisa definir corretamente.

---

## Estratégia segura por enquanto

Enquanto você ainda não implementou `equals` e `hashCode`, uma estratégia simples é usar `Set` com a chave.

Exemplo:

```java
Set<String> codigosUnicos = new HashSet<>();
```

Em vez de:

```java
Set<ResumoOrdemServico> ordens = new HashSet<>();
```

Se o que define duplicidade é o código, use o código.

Depois aprenderemos a fazer o próprio objeto se comparar corretamente.

---

## Mini-cadastro de permissões

Crie:

```text
src\br\com\curso\aula153\app\CadastroPermissoesUsuarioApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import br.com.curso.aula153.dominio.usuario.PermissaoUsuario;

import java.util.HashSet;
import java.util.Set;

public class CadastroPermissoesUsuarioApp {
    public static void main(String[] args) {
        Set<PermissaoUsuario> permissoes = new HashSet<>();

        adicionarPermissao(permissoes, PermissaoUsuario.OS_CONSULTAR);
        adicionarPermissao(permissoes, PermissaoUsuario.OS_CRIAR);
        adicionarPermissao(permissoes, PermissaoUsuario.OS_CONSULTAR);
        adicionarPermissao(permissoes, PermissaoUsuario.RELATORIO_VISUALIZAR);

        System.out.println();
        System.out.println("Permissões finais:");
        imprimir(permissoes);

        System.out.println();
        verificar(permissoes, PermissaoUsuario.OS_CANCELAR);
        verificar(permissoes, PermissaoUsuario.OS_CONSULTAR);

        System.out.println();
        removerPermissao(permissoes, PermissaoUsuario.OS_CRIAR);

        System.out.println();
        System.out.println("Depois da remoção:");
        imprimir(permissoes);
    }

    private static void adicionarPermissao(Set<PermissaoUsuario> permissoes, PermissaoUsuario permissao) {
        boolean adicionada = permissoes.add(permissao);

        if (adicionada) {
            System.out.println("Permissão adicionada: " + permissao);
        } else {
            System.out.println("Permissão já existia: " + permissao);
        }
    }

    private static void removerPermissao(Set<PermissaoUsuario> permissoes, PermissaoUsuario permissao) {
        boolean removida = permissoes.remove(permissao);

        if (removida) {
            System.out.println("Permissão removida: " + permissao);
        } else {
            System.out.println("Permissão não encontrada: " + permissao);
        }
    }

    private static void verificar(Set<PermissaoUsuario> permissoes, PermissaoUsuario permissao) {
        if (permissoes.contains(permissao)) {
            System.out.println("Usuário possui permissão: " + permissao);
        } else {
            System.out.println("Usuário NÃO possui permissão: " + permissao);
        }
    }

    private static void imprimir(Set<PermissaoUsuario> permissoes) {
        for (PermissaoUsuario permissao : permissoes) {
            System.out.println("- " + permissao);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.CadastroPermissoesUsuarioApp
```

---

## O que esse mini-cadastro demonstra

Ele demonstra operações comuns de `Set`:

```text
adicionar permissão;
evitar duplicidade;
verificar permissão;
remover permissão;
listar permissões.
```

Esse tipo de lógica aparece muito em sistemas com usuários e perfis.

---

## clear

O método `clear` remove todos os elementos.

Crie:

```text
src\br\com\curso\aula153\app\HashSetClearApp.java
```

Código:

```java
package br.com.curso.aula153.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetClearApp {
    public static void main(String[] args) {
        Set<String> codigosProcessados = new HashSet<>();

        codigosProcessados.add("OS-2026-0001");
        codigosProcessados.add("OS-2026-0002");

        System.out.println("Antes do clear: " + codigosProcessados.size());

        codigosProcessados.clear();

        System.out.println("Depois do clear: " + codigosProcessados.size());
        System.out.println("Está vazio? " + codigosProcessados.isEmpty());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula153.app.HashSetClearApp
```

---

## Cuidado com clear

`clear` limpa o conjunto inteiro.

Use com cuidado.

Em sistemas reais, apagar tudo de uma coleção pode ser correto em:

```text
limpar cache temporário;
reiniciar lote;
descartar seleção;
zerar estrutura em memória.
```

Mas sempre tenha certeza.

---

## Guia rápido de uso de Set

Use `Set` quando:

```text
não pode ter duplicado;
não precisa acessar por índice;
a pergunta principal é "existe ou não existe?";
precisa validar repetidos;
precisa guardar permissões;
precisa guardar ids únicos;
precisa representar conjunto.
```

Use `List` quando:

```text
ordem importa;
duplicados são permitidos;
precisa de índice;
precisa representar sequência;
precisa exibir itens em ordem.
```

Use `Map` quando:

```text
precisa buscar valor por chave.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar primeiros exemplos

Execute:

```powershell
java -cp out br.com.curso.aula153.app.PrimeiroHashSetApp
java -cp out br.com.curso.aula153.app.HashSetNaoAceitaDuplicadosApp
java -cp out br.com.curso.aula153.app.HashSetAddRetornaBooleanApp
```

Observe o comportamento com duplicados.

### Parte 2 — Rodar validação e busca

Execute:

```powershell
java -cp out br.com.curso.aula153.app.ValidarDuplicidadeComSetApp
java -cp out br.com.curso.aula153.app.HashSetContainsApp
java -cp out br.com.curso.aula153.app.HashSetRemoveApp
```

### Parte 3 — Comparar com List

Execute:

```powershell
java -cp out br.com.curso.aula153.app.SetNaoTemIndiceApp
java -cp out br.com.curso.aula153.app.ComparacaoListSetApp
```

### Parte 4 — Converter

Execute:

```powershell
java -cp out br.com.curso.aula153.app.ConverterListParaSetApp
java -cp out br.com.curso.aula153.app.ConverterSetParaListApp
```

### Parte 5 — Usar com enum e domínio

Execute:

```powershell
java -cp out br.com.curso.aula153.app.SetComEnumApp
java -cp out br.com.curso.aula153.app.SetValidarCodigosOsApp
java -cp out br.com.curso.aula153.app.SetComObjetosSemEqualsApp
java -cp out br.com.curso.aula153.app.CadastroPermissoesUsuarioApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula153\app\ImportacaoCodigosOsComSetApp.java
```

Ele deve:

```text
criar uma List<String> com pelo menos 10 códigos;
incluir alguns códigos repetidos;
usar Set<String> para separar únicos;
usar outro Set<String> para separar duplicados;
exibir:
total recebido;
total único;
total duplicado;
lista de duplicados.
```

Regra extra:

```text
ignorar códigos nulos ou em branco.
```

Critério principal:

```text
usar add retornando boolean para detectar duplicidade.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula153\app\ControlePermissoesComSetApp.java
```

Ele deve:

```text
usar Set<PermissaoUsuario>;
adicionar permissões;
tentar adicionar permissão repetida;
verificar se usuário pode consultar OS;
verificar se usuário pode cancelar OS;
remover uma permissão;
exibir permissões finais.
```

Critério principal:

```text
usar enum e Set juntos.
```

---

## Erros comuns nesta aula

### 1. Esperar ordem em HashSet

`HashSet` não garante ordem.

### 2. Tentar usar get(0)

`Set` não tem índice.

### 3. Achar que Set sempre remove duplicado de objeto próprio

Com objetos próprios, depende de `equals` e `hashCode`.

### 4. Ignorar retorno do add quando quer detectar duplicidade

Use:

```java
boolean adicionado = set.add(valor);
```

### 5. Usar Set quando ordem e repetição importam

Se ordem e repetição importam, use `List`.

### 6. Usar List quando precisa garantir unicidade

Se não pode repetir, considere `Set`.

### 7. Converter List para HashSet esperando preservar ordem

`HashSet` não garante ordem.

### 8. Usar clear sem necessidade

`clear` apaga todos os elementos do conjunto.

---

## Debug recomendado

Use debug em:

```text
HashSetNaoAceitaDuplicadosApp.java
HashSetAddRetornaBooleanApp.java
ValidarDuplicidadeComSetApp.java
ComparacaoListSetApp.java
SetValidarCodigosOsApp.java
SetComObjetosSemEqualsApp.java
CadastroPermissoesUsuarioApp.java
```

Breakpoints recomendados:

```java
codigosOs.add(...)

boolean adicionado = codigosUnicos.add(codigo)

if (!adicionado)

codigosDuplicados.add(codigo)

permissoes.contains(...)

permissoes.remove(...)

new HashSet<>(codigosComDuplicidade)
```

Observe:

```text
quando add retorna true;
quando add retorna false;
como duplicados são detectados;
como List e Set ficam com quantidades diferentes;
como HashSet não garante ordem;
como Set com objeto próprio sem equals pode aceitar objetos visualmente iguais.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual é a principal diferença entre List e Set?
2. Por que HashSet não deve ser usado quando a ordem é essencial?
3. Por que Set com objetos próprios exige cuidado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar um Set com HashSet;
explicar que Set não aceita duplicados;
usar add;
usar retorno boolean do add;
usar contains;
usar remove;
usar size;
usar isEmpty;
usar clear;
explicar que Set não tem índice;
explicar que HashSet não garante ordem;
comparar List e Set;
converter List para Set;
converter Set para List;
usar Set com enum;
usar Set para validar códigos de OS;
entender cuidado inicial com objetos próprios;
resolver ImportacaoCodigosOsComSetApp;
resolver ControlePermissoesComSetApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-153-set-interface-e-hashset
git commit -m "Aula 153: set interface e hashset"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Set representa um conjunto de elementos únicos, e HashSet é uma implementação comum para evitar duplicidades.
```

Você viu que `Set` é excelente para permissões, códigos únicos, validação de duplicados e verificações de existência.

Mas também viu um ponto importante:

```text
Set com objetos próprios depende de equals e hashCode.
```

Na próxima aula, vamos aprofundar exatamente isso.

Vamos entender como `HashSet` decide se dois objetos são iguais e por que `equals` e `hashCode` são tão importantes.
