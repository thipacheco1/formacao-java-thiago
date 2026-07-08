# 147 — M5.02 — Limitações de arrays e entrada em Collections

## Objetivo da aula

Nesta aula você vai entender por que arrays não são suficientes para muitos cenários de backend e por que o Java oferece o Collections Framework.

Na aula anterior, você teve a primeira visão de:

```text
List;
Set;
Map;
interfaces;
implementações;
generics;
coleções com objetos.
```

Agora vamos voltar um passo e comparar com arrays.

Ao final da aula, você deve conseguir:

```text
explicar as limitações dos arrays;
entender por que array tem tamanho fixo;
entender por que remover de array exige trabalho manual;
entender por que controlar quantidade em array é trabalhoso;
comparar array com ArrayList;
usar List e ArrayList para resolver problemas de tamanho dinâmico;
entender métodos básicos de List;
migrar um exemplo simples de array para coleção;
identificar quando array ainda pode fazer sentido;
entender por que backend usa muito Collections.
```

Essa aula é importante porque muita gente aprende array e tenta resolver tudo com array.

Em sistemas reais, isso rapidamente fica limitado.

---

## Ideia principal

Array é uma estrutura simples e útil.

Mas ele tem uma limitação central:

```text
o tamanho do array é fixo depois que ele é criado.
```

Exemplo:

```java
String[] codigos = new String[3];
```

Esse array tem 3 posições.

Ele não cresce sozinho.

Se você precisar armazenar uma quarta OS, terá que criar outro array maior e copiar os dados manualmente.

Com `ArrayList`, isso é diferente:

```java
List<String> codigos = new ArrayList<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0002");
codigos.add("OS-2026-0003");
codigos.add("OS-2026-0004");
```

A lista cresce conforme necessário.

---

## Array não é ruim

Antes de avançar, entenda:

```text
array não é ruim.
```

Array é uma estrutura importante.

Ele é útil em:

```text
algoritmos básicos;
estrutura de dados de baixo nível;
cenários de performance específica;
varargs;
bibliotecas internas;
exercícios de lógica;
dados com tamanho conhecido e fixo.
```

O problema é usar array para tudo.

Em backend, dados normalmente crescem, mudam, são filtrados, removidos, ordenados e agrupados.

Para isso, Collections é mais prático.

---

## Exemplo simples de array

Crie a pasta da aula:

```powershell
mkdir labs\m5\aula-147-limitacoes-de-arrays-e-entrada-em-collections
cd labs\m5\aula-147-limitacoes-de-arrays-e-entrada-em-collections
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula147
mkdir src\br\com\curso\aula147\app
mkdir src\br\com\curso\aula147\dominio
mkdir src\br\com\curso\aula147\dominio\ordemservico
```

Crie:

```text
src\br\com\curso\aula147\app\ArrayBasicoApp.java
```

Código:

```java
package br.com.curso.aula147.app;

public class ArrayBasicoApp {
    public static void main(String[] args) {
        String[] codigosOs = new String[3];

        codigosOs[0] = "OS-2026-0001";
        codigosOs[1] = "OS-2026-0002";
        codigosOs[2] = "OS-2026-0003";

        System.out.println("Primeira OS: " + codigosOs[0]);
        System.out.println("Segunda OS: " + codigosOs[1]);
        System.out.println("Terceira OS: " + codigosOs[2]);

        System.out.println();
        System.out.println("Todas as OS:");

        for (int i = 0; i < codigosOs.length; i++) {
            System.out.println("- posição " + i + ": " + codigosOs[i]);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayBasicoApp
```

---

## O que observar

O array funciona bem quando você sabe exatamente quantos elementos terá.

Aqui temos:

```java
String[] codigosOs = new String[3];
```

E usamos as posições:

```text
0;
1;
2.
```

A propriedade:

```java
codigosOs.length
```

mostra o tamanho do array.

Mas cuidado:

```text
length é capacidade total do array, não quantidade real preenchida.
```

Isso faz diferença no próximo exemplo.

---

## Problema 1 — Capacidade fixa

Crie:

```text
src\br\com\curso\aula147\app\ArrayCapacidadeFixaApp.java
```

Código:

```java
package br.com.curso.aula147.app;

public class ArrayCapacidadeFixaApp {
    public static void main(String[] args) {
        String[] codigosOs = new String[3];

        int quantidade = 0;

        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0001");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0002");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0003");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0004");

        System.out.println();
        System.out.println("Quantidade preenchida: " + quantidade);
        System.out.println("Capacidade do array: " + codigosOs.length);

        System.out.println();
        System.out.println("Conteúdo do array:");

        for (int i = 0; i < quantidade; i++) {
            System.out.println("- " + codigosOs[i]);
        }
    }

    private static int adicionar(String[] codigosOs, int quantidade, String codigo) {
        if (quantidade >= codigosOs.length) {
            System.out.println("Não foi possível adicionar " + codigo + ". Array está cheio.");
            return quantidade;
        }

        codigosOs[quantidade] = codigo;
        System.out.println("Adicionado: " + codigo);

        return quantidade + 1;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayCapacidadeFixaApp
```

---

## O que este exemplo mostra

Tentamos adicionar quatro códigos em um array de três posições.

O quarto não entra.

Para controlar isso, tivemos que criar uma variável manual:

```java
int quantidade = 0;
```

E tivemos que fazer verificação manual:

```java
if (quantidade >= codigosOs.length) {
    ...
}
```

Esse tipo de controle fica repetitivo.

Em sistemas reais, isso gera código cansativo e sujeito a erro.

---

## Problema 2 — Posições vazias

Crie:

```text
src\br\com\curso\aula147\app\ArrayComPosicoesVaziasApp.java
```

Código:

```java
package br.com.curso.aula147.app;

public class ArrayComPosicoesVaziasApp {
    public static void main(String[] args) {
        String[] codigosOs = new String[5];

        codigosOs[0] = "OS-2026-0001";
        codigosOs[1] = "OS-2026-0002";

        System.out.println("Tamanho do array: " + codigosOs.length);

        System.out.println();
        System.out.println("Percorrendo todas as posições:");

        for (int i = 0; i < codigosOs.length; i++) {
            System.out.println("posição " + i + ": " + codigosOs[i]);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayComPosicoesVaziasApp
```

---

## O que observar

O array tem tamanho 5.

Mas só duas posições foram preenchidas.

As outras aparecem como:

```text
null
```

Isso acontece porque array de objetos inicia com `null` nas posições vazias.

Então você precisa controlar:

```text
qual é a capacidade total;
qual é a quantidade realmente preenchida.
```

Em uma `List`, isso é mais simples.

O método `size()` retorna a quantidade real de elementos adicionados.

---

## Problema 3 — Remoção manual

Remover um item do meio de um array exige deslocar elementos.

Crie:

```text
src\br\com\curso\aula147\app\ArrayRemocaoManualApp.java
```

Código:

```java
package br.com.curso.aula147.app;

public class ArrayRemocaoManualApp {
    public static void main(String[] args) {
        String[] codigosOs = new String[5];

        int quantidade = 0;

        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0001");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0002");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0003");
        quantidade = adicionar(codigosOs, quantidade, "OS-2026-0004");

        System.out.println("Antes da remoção:");
        imprimir(codigosOs, quantidade);

        quantidade = remover(codigosOs, quantidade, "OS-2026-0002");

        System.out.println();
        System.out.println("Depois da remoção:");
        imprimir(codigosOs, quantidade);
    }

    private static int adicionar(String[] codigosOs, int quantidade, String codigo) {
        if (quantidade >= codigosOs.length) {
            throw new IllegalStateException("Array cheio.");
        }

        codigosOs[quantidade] = codigo;
        return quantidade + 1;
    }

    private static int remover(String[] codigosOs, int quantidade, String codigo) {
        int indiceEncontrado = -1;

        for (int i = 0; i < quantidade; i++) {
            if (codigosOs[i].equals(codigo)) {
                indiceEncontrado = i;
                break;
            }
        }

        if (indiceEncontrado == -1) {
            System.out.println("Código não encontrado: " + codigo);
            return quantidade;
        }

        for (int i = indiceEncontrado; i < quantidade - 1; i++) {
            codigosOs[i] = codigosOs[i + 1];
        }

        codigosOs[quantidade - 1] = null;

        System.out.println("Removido: " + codigo);
        return quantidade - 1;
    }

    private static void imprimir(String[] codigosOs, int quantidade) {
        for (int i = 0; i < quantidade; i++) {
            System.out.println("- " + codigosOs[i]);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayRemocaoManualApp
```

---

## O que a remoção manual mostra

Para remover uma OS, tivemos que:

```text
procurar o índice;
deslocar os elementos seguintes;
limpar a última posição;
diminuir a quantidade;
tomar cuidado com null.
```

Isso tudo para uma simples remoção.

Com `List`, seria:

```java
codigosOs.remove("OS-2026-0002");
```

A coleção já faz o trabalho interno.

---

## Problema 4 — Busca manual

Buscar em array também exige percorrer manualmente.

Crie:

```text
src\br\com\curso\aula147\app\ArrayBuscaManualApp.java
```

Código:

```java
package br.com.curso.aula147.app;

public class ArrayBuscaManualApp {
    public static void main(String[] args) {
        String[] codigosOs = {
                "OS-2026-0001",
                "OS-2026-0002",
                "OS-2026-0003"
        };

        buscar(codigosOs, "OS-2026-0002");
        buscar(codigosOs, "OS-2026-9999");
    }

    private static void buscar(String[] codigosOs, String codigoBuscado) {
        boolean encontrado = false;

        for (String codigo : codigosOs) {
            if (codigo.equals(codigoBuscado)) {
                encontrado = true;
                break;
            }
        }

        if (encontrado) {
            System.out.println("Encontrado: " + codigoBuscado);
        } else {
            System.out.println("Não encontrado: " + codigoBuscado);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayBuscaManualApp
```

---

## Busca em coleção

Em uma coleção, podemos usar:

```java
contains(...)
```

Exemplo:

```java
codigos.contains("OS-2026-0002");
```

Isso deixa o código mais claro.

Ainda existe busca por baixo.

Mas o código de uso fica mais simples e expressivo.

---

## Entrando em List com ArrayList

Agora vamos refazer alguns problemas usando `List`.

Crie:

```text
src\br\com\curso\aula147\app\ListCrescimentoDinamicoApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.ArrayList;
import java.util.List;

public class ListCrescimentoDinamicoApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");
        codigosOs.add("OS-2026-0004");
        codigosOs.add("OS-2026-0005");

        System.out.println("Quantidade real: " + codigosOs.size());

        System.out.println();
        System.out.println("Conteúdo:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ListCrescimentoDinamicoApp
```

---

## O que melhorou com List

Não precisamos definir tamanho inicial obrigatório.

Não precisamos controlar `quantidade` manualmente.

Usamos:

```java
codigosOs.add(...)
```

E consultamos:

```java
codigosOs.size()
```

Isso simplifica muito.

A lista cresce conforme adicionamos elementos.

---

## Remoção com List

Crie:

```text
src\br\com\curso\aula147\app\ListRemocaoSimplesApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.ArrayList;
import java.util.List;

public class ListRemocaoSimplesApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");
        codigosOs.add("OS-2026-0004");

        System.out.println("Antes da remoção:");
        imprimir(codigosOs);

        boolean removido = codigosOs.remove("OS-2026-0002");

        System.out.println();
        System.out.println("Removeu? " + removido);

        System.out.println();
        System.out.println("Depois da remoção:");
        imprimir(codigosOs);
    }

    private static void imprimir(List<String> codigosOs) {
        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ListRemocaoSimplesApp
```

---

## O retorno do remove

Quando você remove por objeto:

```java
boolean removido = codigosOs.remove("OS-2026-0002");
```

O retorno diz se removeu ou não.

Se o elemento existia, retorna `true`.

Se não existia, retorna `false`.

Isso é útil para montar mensagens.

---

## Busca com List

Crie:

```text
src\br\com\curso\aula147\app\ListBuscaSimplesApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.ArrayList;
import java.util.List;

public class ListBuscaSimplesApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        buscar(codigosOs, "OS-2026-0002");
        buscar(codigosOs, "OS-2026-9999");
    }

    private static void buscar(List<String> codigosOs, String codigoBuscado) {
        if (codigosOs.contains(codigoBuscado)) {
            System.out.println("Encontrado: " + codigoBuscado);
        } else {
            System.out.println("Não encontrado: " + codigoBuscado);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ListBuscaSimplesApp
```

---

## Métodos básicos de List nesta aula

Até aqui, usamos:

```text
add;
remove;
contains;
size;
isEmpty;
get;
```

Exemplo:

```java
codigos.add("OS-2026-0001");
codigos.remove("OS-2026-0001");
codigos.contains("OS-2026-0001");
codigos.size();
codigos.isEmpty();
codigos.get(0);
```

Esses métodos serão aprofundados nas próximas aulas.

Por enquanto, entenda o uso básico.

---

## Criando domínio simples para comparação

Agora vamos usar objetos, não só `String`.

Crie:

```text
src\br\com\curso\aula147\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula147.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula147\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula147.dominio.ordemservico;

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

## Relatório com array

Crie:

```text
src\br\com\curso\aula147\app\ArrayRelatorioOsApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import br.com.curso.aula147.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula147.dominio.ordemservico.StatusOs;

import java.time.LocalDate;

public class ArrayRelatorioOsApp {
    public static void main(String[] args) {
        ResumoOrdemServico[] ordens = new ResumoOrdemServico[5];

        int quantidade = 0;

        ordens[quantidade++] = new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        );

        ordens[quantidade++] = new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        );

        ordens[quantidade++] = new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.CANCELADA
        );

        int agendadas = 0;
        int concluidas = 0;
        int canceladas = 0;

        for (int i = 0; i < quantidade; i++) {
            ResumoOrdemServico os = ordens[i];

            if (os.possuiStatus(StatusOs.AGENDADA)) {
                agendadas++;
            }

            if (os.possuiStatus(StatusOs.CONCLUIDA)) {
                concluidas++;
            }

            if (os.possuiStatus(StatusOs.CANCELADA)) {
                canceladas++;
            }
        }

        System.out.println("Resumo com array:");
        System.out.println("Agendadas: " + agendadas);
        System.out.println("Concluídas: " + concluidas);
        System.out.println("Canceladas: " + canceladas);
        System.out.println("Total preenchido: " + quantidade);
        System.out.println("Capacidade do array: " + ordens.length);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayRelatorioOsApp
```

---

## O que observar no relatório com array

Mesmo usando objetos, ainda tivemos que controlar:

```java
int quantidade = 0;
```

E percorrer apenas até:

```java
i < quantidade
```

Não até `ordens.length`, porque o array tem posições vazias.

Esse é um ponto clássico:

```text
array tem capacidade;
coleção tem quantidade real.
```

---

## Relatório com List

Crie:

```text
src\br\com\curso\aula147\app\ListRelatorioOsApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import br.com.curso.aula147.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula147.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ListRelatorioOsApp {
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
                StatusOs.CANCELADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0004",
                "Bruno Rocha",
                LocalDate.of(2026, 12, 13),
                StatusOs.REAGENDADA
        ));

        int agendadas = 0;
        int concluidas = 0;
        int canceladas = 0;
        int reagendadas = 0;

        for (ResumoOrdemServico os : ordens) {
            if (os.possuiStatus(StatusOs.AGENDADA)) {
                agendadas++;
            }

            if (os.possuiStatus(StatusOs.CONCLUIDA)) {
                concluidas++;
            }

            if (os.possuiStatus(StatusOs.CANCELADA)) {
                canceladas++;
            }

            if (os.possuiStatus(StatusOs.REAGENDADA)) {
                reagendadas++;
            }
        }

        System.out.println("Resumo com List:");
        System.out.println("Agendadas: " + agendadas);
        System.out.println("Reagendadas: " + reagendadas);
        System.out.println("Concluídas: " + concluidas);
        System.out.println("Canceladas: " + canceladas);
        System.out.println("Total: " + ordens.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ListRelatorioOsApp
```

---

## O que melhorou no relatório com List

Com `List`, não precisamos de capacidade fixa.

Não precisamos controlar quantidade manualmente.

Usamos:

```java
ordens.add(...)
ordens.size()
```

E percorremos diretamente:

```java
for (ResumoOrdemServico os : ordens)
```

O código fica mais limpo.

---

## Convertendo array para List

Às vezes você recebe um array e quer criar uma lista.

Existe:

```java
Arrays.asList(...)
```

Crie:

```text
src\br\com\curso\aula147\app\ArrayParaListApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.Arrays;
import java.util.List;

public class ArrayParaListApp {
    public static void main(String[] args) {
        String[] codigosArray = {
                "OS-2026-0001",
                "OS-2026-0002",
                "OS-2026-0003"
        };

        List<String> codigosList = Arrays.asList(codigosArray);

        System.out.println("Lista criada a partir do array:");

        for (String codigo : codigosList) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Quantidade: " + codigosList.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayParaListApp
```

---

## Cuidado com Arrays.asList

`Arrays.asList` é útil, mas tem uma armadilha.

A lista criada por ele tem tamanho fixo.

Ou seja, você consegue alterar um elemento existente, mas não consegue adicionar ou remover.

Crie:

```text
src\br\com\curso\aula147\app\ArrayParaListArmadilhaApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.Arrays;
import java.util.List;

public class ArrayParaListArmadilhaApp {
    public static void main(String[] args) {
        String[] codigosArray = {
                "OS-2026-0001",
                "OS-2026-0002"
        };

        List<String> codigosList = Arrays.asList(codigosArray);

        System.out.println("Antes:");
        imprimir(codigosList);

        codigosList.set(0, "OS-2026-9999");

        System.out.println();
        System.out.println("Depois do set:");
        imprimir(codigosList);

        try {
            codigosList.add("OS-2026-0003");
        } catch (UnsupportedOperationException erro) {
            System.out.println();
            System.out.println("Erro ao adicionar: lista criada com Arrays.asList tem tamanho fixo.");
        }
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
java -cp out br.com.curso.aula147.app.ArrayParaListArmadilhaApp
```

---

## Como criar uma ArrayList a partir de array

Se você quer uma lista realmente mutável, faça:

```java
List<String> codigos = new ArrayList<>(Arrays.asList(codigosArray));
```

Crie:

```text
src\br\com\curso\aula147\app\ArrayParaArrayListMutavelApp.java
```

Código:

```java
package br.com.curso.aula147.app;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArrayParaArrayListMutavelApp {
    public static void main(String[] args) {
        String[] codigosArray = {
                "OS-2026-0001",
                "OS-2026-0002"
        };

        List<String> codigos = new ArrayList<>(Arrays.asList(codigosArray));

        codigos.add("OS-2026-0003");
        codigos.remove("OS-2026-0001");

        System.out.println("Lista mutável:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula147.app.ArrayParaArrayListMutavelApp
```

---

## Quando usar array

Use array quando:

```text
o tamanho é fixo e conhecido;
você está estudando algoritmo;
precisa de estrutura simples;
está lidando com API que retorna array;
está trabalhando com varargs;
tem motivo técnico específico.
```

Exemplo:

```java
String[] argumentos;
int[] notas;
double[] medidas;
```

Mesmo assim, em backend, muitas vezes você converterá para coleção para trabalhar melhor.

---

## Quando usar List

Use `List` quando:

```text
a quantidade pode variar;
a ordem importa;
pode haver repetidos;
você precisa adicionar e remover facilmente;
você precisa percorrer uma sequência;
você quer trabalhar com objetos de domínio.
```

Exemplos:

```text
atividades de uma OS;
itens de um pedido;
serviços de um contrato;
respostas de uma API;
resultados de uma consulta;
linhas de um relatório.
```

---

## Comparação direta

Array:

```java
String[] codigos = new String[3];
codigos[0] = "OS-2026-0001";
```

List:

```java
List<String> codigos = new ArrayList<>();
codigos.add("OS-2026-0001");
```

Array:

```java
codigos.length
```

List:

```java
codigos.size()
```

Array:

```text
remoção manual.
```

List:

```java
codigos.remove("OS-2026-0001");
```

Array:

```text
capacidade fixa.
```

List:

```text
crescimento dinâmico.
```

---

## Cuidado com null

Array pode ter posições vazias com `null`.

List também pode aceitar `null` se você adicionar manualmente:

```java
codigos.add(null);
```

Mas em código profissional, normalmente você evita adicionar `null` em coleções.

Prefira validar antes.

Exemplo:

```java
if (codigo == null || codigo.isBlank()) {
    throw new IllegalArgumentException("Código é obrigatório.");
}
```

Coleção com `null` costuma gerar bugs.

---

## Ligação com domínio

No Módulo 4, protegemos listas internas:

```java
public List<AtividadeOs> atividades() {
    return List.copyOf(atividades);
}
```

Isso continua importante.

Nesta aula, estamos estudando listas no app.

Mas dentro do domínio, continue protegendo coleções.

Não volte a fazer:

```java
return atividades;
```

Se a lista é interna de um agregado, proteja.

Se a lista é local de um app ou service, você pode manipulá-la diretamente conforme o caso.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar exemplos de array

Execute:

```powershell
java -cp out br.com.curso.aula147.app.ArrayBasicoApp
java -cp out br.com.curso.aula147.app.ArrayCapacidadeFixaApp
java -cp out br.com.curso.aula147.app.ArrayComPosicoesVaziasApp
java -cp out br.com.curso.aula147.app.ArrayRemocaoManualApp
java -cp out br.com.curso.aula147.app.ArrayBuscaManualApp
```

### Parte 2 — Rodar exemplos de List

Execute:

```powershell
java -cp out br.com.curso.aula147.app.ListCrescimentoDinamicoApp
java -cp out br.com.curso.aula147.app.ListRemocaoSimplesApp
java -cp out br.com.curso.aula147.app.ListBuscaSimplesApp
```

### Parte 3 — Rodar exemplos com objetos

Execute:

```powershell
java -cp out br.com.curso.aula147.app.ArrayRelatorioOsApp
java -cp out br.com.curso.aula147.app.ListRelatorioOsApp
```

### Parte 4 — Rodar conversões

Execute:

```powershell
java -cp out br.com.curso.aula147.app.ArrayParaListApp
java -cp out br.com.curso.aula147.app.ArrayParaListArmadilhaApp
java -cp out br.com.curso.aula147.app.ArrayParaArrayListMutavelApp
```

### Parte 5 — Comparar

Responda:

```text
qual exemplo deu mais trabalho?
qual exemplo ficou mais fácil com List?
onde apareceu capacidade?
onde apareceu quantidade real?
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula147\app\MigracaoArrayParaListApp.java
```

Ele deve ter duas partes.

### Parte 1 — Versão com array

Crie um array de `String` com capacidade 3.

Tente cadastrar 4 códigos de OS.

Controle manualmente:

```text
quantidade;
capacidade cheia;
impressão dos cadastrados.
```

### Parte 2 — Versão com List

Crie uma `List<String>`.

Cadastre os mesmos 4 códigos.

Exiba:

```text
quantidade;
todos os códigos;
resultado de contains para um código existente;
resultado de remove para um código existente.
```

Critério principal:

```text
comparar claramente array e List no mesmo app.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula147\app\PainelOsArrayVsListApp.java
```

Ele deve:

```text
criar 4 objetos ResumoOrdemServico;
armazenar primeiro em array;
gerar relatório por status usando array;
armazenar depois em List;
gerar relatório por status usando List;
comparar o código necessário em cada abordagem.
```

Não precisa usar Stream ainda.

Use `for` tradicional e `foreach`.

Critério principal:

```text
perceber que List simplifica controle de quantidade.
```

---

## Erros comuns nesta aula

### 1. Confundir length com size

Array usa:

```java
array.length
```

List usa:

```java
lista.size()
```

### 2. Percorrer array inteiro com posições vazias

Se o array tem capacidade 10 e só 3 elementos preenchidos, cuidado com `null`.

### 3. Tentar adicionar acima da capacidade do array

Array não cresce.

### 4. Esquecer import de List

Use:

```java
import java.util.List;
import java.util.ArrayList;
```

### 5. Usar Arrays.asList achando que é ArrayList

`Arrays.asList` cria lista de tamanho fixo.

### 6. Não tratar retorno do remove

`remove` retorna boolean quando remove por objeto.

### 7. Usar List sem generics

Evite:

```java
List lista = new ArrayList();
```

### 8. Retornar lista interna do domínio sem proteção

No domínio, continue usando cópia defensiva quando necessário.

---

## Debug recomendado

Use debug em:

```text
ArrayCapacidadeFixaApp.java
ArrayRemocaoManualApp.java
ListCrescimentoDinamicoApp.java
ListRemocaoSimplesApp.java
ArrayParaListArmadilhaApp.java
ArrayRelatorioOsApp.java
ListRelatorioOsApp.java
```

Breakpoints recomendados:

```java
quantidade = adicionar(...)
if (quantidade >= codigosOs.length)

quantidade = remover(...)
for (int i = indiceEncontrado; i < quantidade - 1; i++)

codigosOs.add(...)
codigosOs.remove(...)
codigosOs.contains(...)

Arrays.asList(...)
codigosList.add(...)

ordens.add(...)
ordens.size()
```

Observe:

```text
como array exige quantidade manual;
como List controla tamanho real;
como remoção manual desloca elementos;
como remove da List simplifica;
como Arrays.asList bloqueia add;
como objetos ficam em array e em List.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual é a maior limitação de array?
2. Qual é a principal vantagem de List?
3. Qual cuidado você precisa ter com Arrays.asList?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar tamanho fixo de array;
explicar diferença entre capacidade e quantidade preenchida;
remover item de array manualmente;
comparar remoção manual com List.remove;
usar List com ArrayList;
usar add, remove, contains, size e isEmpty;
usar List com objetos de domínio;
converter array para List;
entender a armadilha de Arrays.asList;
criar ArrayList mutável a partir de array;
resolver o desafio MigracaoArrayParaListApp;
resolver o desafio PainelOsArrayVsListApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-147-limitacoes-de-arrays-e-entrada-em-collections
git commit -m "Aula 147: limitacoes de arrays e entrada em collections"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
arrays são úteis, mas Collections oferecem estruturas mais flexíveis para trabalhar com dados variáveis em sistemas reais.
```

Você viu que array exige controle manual de capacidade, quantidade, remoção e posições vazias.

Também viu que `List` simplifica muitos desses problemas.

Na próxima aula, vamos aprofundar a interface `List` e a implementação `ArrayList`.

Vamos estudar operações CRUD com lista, posições, inserções, atualizações e cuidados de uso.
