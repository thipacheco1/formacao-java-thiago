# 175 — M6.04 — Bounded Types: `extends` em Generics

## Objetivo da aula

Nesta aula você vai estudar um dos recursos mais importantes de Generics:

```text
bounded types
```

Ou, em português:

```text
tipos genéricos com limite
```

Nas aulas anteriores, você criou tipos genéricos livres:

```java
Caixa<T>
Repositorio<ID, T>
Resultado<T>
Conversor<E, S>
```

O problema é que um `T` livre não garante nenhum comportamento específico.

Exemplo:

```java
public static <T> void imprimirCodigo(T item) {
    System.out.println(item.codigo());
}
```

Esse código não compila, porque o Java não sabe se todo `T` tem método `codigo()`.

Com bounded types, conseguimos dizer:

```text
T pode ser genérico,
mas precisa obedecer a um contrato.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema de T livre;
usar <T extends AlgumaClasseOuInterface>;
criar métodos genéricos com limite;
criar classes genéricas com limite;
criar repositório genérico para entidades identificáveis;
usar Comparable como limite;
usar interfaces como contrato genérico;
entender múltiplos limites;
diferenciar extends em generics de herança comum;
aplicar bounded types em cenários de backend.
```

---

## Ideia principal

Generics livres são flexíveis, mas limitados.

Exemplo:

```java
public static <T> void imprimir(T valor) {
    System.out.println(valor);
}
```

Esse método aceita qualquer coisa.

Mas se você precisa chamar um método específico, o Java precisa ter garantia.

Exemplo:

```java
valor.resumo()
```

O compilador pergunta:

```text
Como eu sei que todo T tem resumo()?
```

A resposta é:

```text
criando um limite.
```

Exemplo:

```java
public static <T extends PossuiResumo> void imprimirResumo(T valor) {
    System.out.println(valor.resumo());
}
```

Agora o Java sabe que `T` possui `resumo()`.

---

## O que significa `extends` em generics

A sintaxe é:

```java
<T extends AlgumTipo>
```

Isso significa:

```text
T deve ser AlgumTipo ou um subtipo de AlgumTipo.
```

`AlgumTipo` pode ser:

```text
uma classe;
uma interface.
```

Mesmo quando o limite é interface, usamos a palavra:

```java
extends
```

Exemplo:

```java
<T extends Comparable<T>>
```

Mesmo `Comparable` sendo interface, a palavra é `extends`.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-175-bounded-types-extends-em-generics
cd labs\m6\aula-175-bounded-types-extends-em-generics
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula175
mkdir src\br\com\curso\aula175\app
mkdir src\br\com\curso\aula175\contrato
mkdir src\br\com\curso\aula175\dominio
mkdir src\br\com\curso\aula175\dominio\valor
mkdir src\br\com\curso\aula175\dominio\ordemservico
mkdir src\br\com\curso\aula175\dominio\cliente
mkdir src\br\com\curso\aula175\infra
mkdir src\br\com\curso\aula175\util
```

---

## Problema: T livre não garante métodos

Crie:

```text
src\br\com\curso\aula175\util\ImpressoraLivre.java
```

Código:

```java
package br.com.curso.aula175.util;

public final class ImpressoraLivre {
    private ImpressoraLivre() {
    }

    public static <T> void imprimir(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        System.out.println(valor);
    }
}
```

Crie:

```text
src\br\com\curso\aula175\app\GenericsLivreApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.util.ImpressoraLivre;

public class GenericsLivreApp {
    public static void main(String[] args) {
        ImpressoraLivre.imprimir("Ana");
        ImpressoraLivre.imprimir(100);
        ImpressoraLivre.imprimir(true);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.GenericsLivreApp
```

---

## O que esse exemplo mostra

O método aceita qualquer tipo:

```java
<T>
```

Mas ele só consegue fazer coisas que todo objeto permite, como:

```java
System.out.println(valor);
```

Ele não consegue chamar métodos específicos como:

```java
valor.codigo()
valor.resumo()
valor.status()
```

Porque `T` livre não garante esses métodos.

---

## Criando um contrato: PossuiResumo

Crie:

```text
src\br\com\curso\aula175\contrato\PossuiResumo.java
```

Código:

```java
package br.com.curso.aula175.contrato;

public interface PossuiResumo {
    String resumo();
}
```

Agora podemos criar métodos que aceitam qualquer tipo, desde que esse tipo tenha `resumo()`.

---

## Método genérico com limite

Crie:

```text
src\br\com\curso\aula175\util\ImpressoraResumo.java
```

Código:

```java
package br.com.curso.aula175.util;

import br.com.curso.aula175.contrato.PossuiResumo;

import java.util.List;

public final class ImpressoraResumo {
    private ImpressoraResumo() {
    }

    public static <T extends PossuiResumo> void imprimir(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        System.out.println(item.resumo());
    }

    public static <T extends PossuiResumo> void imprimirTodos(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        for (T item : itens) {
            imprimir(item);
        }
    }
}
```

---

## Como ler `<T extends PossuiResumo>`

```java
<T extends PossuiResumo>
```

Significa:

```text
T pode ser qualquer tipo,
desde que implemente PossuiResumo.
```

Por isso o método pode chamar:

```java
item.resumo()
```

O compilador sabe que esse método existe.

---

## Domínio: CodigoOs

Crie:

```text
src\br\com\curso\aula175\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula175.dominio.valor;

import br.com.curso.aula175.contrato.PossuiResumo;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs>, PossuiResumo {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    @Override
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

## Domínio: OrdemServicoBounded

Crie:

```text
src\br\com\curso\aula175\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula175.dominio.ordemservico;

public enum StatusOs {
    CADASTRADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula175\dominio\ordemservico\OrdemServicoBounded.java
```

Código:

```java
package br.com.curso.aula175.dominio.ordemservico;

import br.com.curso.aula175.contrato.PossuiResumo;
import br.com.curso.aula175.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoBounded implements PossuiResumo {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;
    private final StatusOs status;

    public OrdemServicoBounded(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            StatusOs status
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
        this.status = status;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public StatusOs status() {
        return status;
    }

    @Override
    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Status: " + status;
    }
}
```

---

## App usando ImpressoraResumo

Crie:

```text
src\br\com\curso\aula175\app\ImpressoraResumoBoundedApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.ordemservico.OrdemServicoBounded;
import br.com.curso.aula175.dominio.ordemservico.StatusOs;
import br.com.curso.aula175.dominio.valor.CodigoOs;
import br.com.curso.aula175.util.ImpressoraResumo;

import java.time.LocalDate;
import java.util.List;

public class ImpressoraResumoBoundedApp {
    public static void main(String[] args) {
        OrdemServicoBounded os = new OrdemServicoBounded(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        ImpressoraResumo.imprimir(os);

        System.out.println();

        List<OrdemServicoBounded> ordens = List.of(
                os,
                new OrdemServicoBounded(
                        new CodigoOs("OS-2026-0002"),
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        StatusOs.CONCLUIDA
                )
        );

        ImpressoraResumo.imprimirTodos(ordens);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.ImpressoraResumoBoundedApp
```

---

## O que esse exemplo prova

O método é genérico:

```java
<T extends PossuiResumo>
```

Mas não aceita qualquer coisa.

Aceita apenas tipos que implementam:

```java
PossuiResumo
```

Isso dá equilíbrio entre:

```text
flexibilidade;
segurança;
clareza.
```

---

## Bounded type com Comparable

Agora vamos criar utilitários para tipos ordenáveis.

Crie:

```text
src\br\com\curso\aula175\util\Ordenaveis.java
```

Código:

```java
package br.com.curso.aula175.util;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

public final class Ordenaveis {
    private Ordenaveis() {
    }

    public static <T extends Comparable<T>> T menor(List<T> itens) {
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser nula ou vazia.");
        }

        T menor = itens.get(0);

        for (T item : itens) {
            if (item.compareTo(menor) < 0) {
                menor = item;
            }
        }

        return menor;
    }

    public static <T extends Comparable<T>> T maior(List<T> itens) {
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser nula ou vazia.");
        }

        T maior = itens.get(0);

        for (T item : itens) {
            if (item.compareTo(maior) > 0) {
                maior = item;
            }
        }

        return maior;
    }

    public static <T extends Comparable<T>> List<T> ordenar(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        List<T> copia = new ArrayList<>(itens);
        copia.sort(null);

        return List.copyOf(copia);
    }

    public static <T extends Comparable<T>> TreeSet<T> comoTreeSet(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        return new TreeSet<>(itens);
    }
}
```

---

## Como ler `<T extends Comparable<T>>`

Esse limite diz:

```text
T precisa saber comparar com outro T.
```

Por isso podemos usar:

```java
item.compareTo(outro)
```

Sem esse limite, o método não compilaria.

---

## App com Ordenaveis

Crie:

```text
src\br\com\curso\aula175\app\OrdenaveisApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.valor.CodigoOs;
import br.com.curso.aula175.util.Ordenaveis;

import java.util.List;

public class OrdenaveisApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(30, 10, 20);
        List<String> nomes = List.of("Carlos", "Ana", "Mariana");
        List<CodigoOs> codigos = List.of(
                new CodigoOs("OS-2026-0003"),
                new CodigoOs("OS-2026-0001"),
                new CodigoOs("OS-2026-0002")
        );

        System.out.println("Menor número: " + Ordenaveis.menor(numeros));
        System.out.println("Maior número: " + Ordenaveis.maior(numeros));

        System.out.println();
        System.out.println("Nomes ordenados: " + Ordenaveis.ordenar(nomes));

        System.out.println();
        System.out.println("Códigos ordenados:");

        for (CodigoOs codigo : Ordenaveis.ordenar(codigos)) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.OrdenaveisApp
```

---

## Bounded type em classe genérica

Até agora, vimos métodos com limite.

Agora vamos criar uma classe genérica com limite.

Crie:

```text
src\br\com\curso\aula175\util\CaixaOrdenada.java
```

Código:

```java
package br.com.curso.aula175.util;

public class CaixaOrdenada<T extends Comparable<T>> {
    private final T valor;

    public CaixaOrdenada(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor;
    }

    public T valor() {
        return valor;
    }

    public boolean maiorQue(T outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return valor.compareTo(outro) > 0;
    }

    public boolean menorQue(T outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return valor.compareTo(outro) < 0;
    }
}
```

---

## App com CaixaOrdenada

Crie:

```text
src\br\com\curso\aula175\app\CaixaOrdenadaApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.valor.CodigoOs;
import br.com.curso.aula175.util.CaixaOrdenada;

public class CaixaOrdenadaApp {
    public static void main(String[] args) {
        CaixaOrdenada<Integer> caixaNumero = new CaixaOrdenada<>(10);

        System.out.println("10 maior que 5? " + caixaNumero.maiorQue(5));
        System.out.println("10 menor que 20? " + caixaNumero.menorQue(20));

        System.out.println();

        CaixaOrdenada<CodigoOs> caixaCodigo = new CaixaOrdenada<>(new CodigoOs("OS-2026-0002"));

        System.out.println("OS-0002 maior que OS-0001? "
                + caixaCodigo.maiorQue(new CodigoOs("OS-2026-0001")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.CaixaOrdenadaApp
```

---

## Contrato genérico: PossuiIdentificador

Agora vamos criar um contrato para entidades identificáveis.

Crie:

```text
src\br\com\curso\aula175\contrato\PossuiIdentificador.java
```

Código:

```java
package br.com.curso.aula175.contrato;

public interface PossuiIdentificador<ID> {
    ID id();
}
```

Esse contrato diz:

```text
quem implementar isso possui um ID de algum tipo.
```

Exemplos:

```text
OrdemServico com CodigoOs;
Cliente com CodigoCliente;
Produto com SkuProduto;
Usuario com Long.
```

---

## CodigoCliente

Crie:

```text
src\br\com\curso\aula175\dominio\valor\CodigoCliente.java
```

Código:

```java
package br.com.curso.aula175.dominio.valor;

import br.com.curso.aula175.contrato.PossuiResumo;

import java.util.Objects;

public final class CodigoCliente implements Comparable<CodigoCliente>, PossuiResumo {
    private final String valor;

    public CodigoCliente(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código do cliente é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("CLI-")) {
            throw new IllegalArgumentException("Código do cliente deve iniciar com CLI-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    @Override
    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(CodigoCliente outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoCliente codigoCliente)) {
            return false;
        }

        return Objects.equals(valor, codigoCliente.valor);
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

## ClienteBounded

Crie:

```text
src\br\com\curso\aula175\dominio\cliente\ClienteBounded.java
```

Código:

```java
package br.com.curso.aula175.dominio.cliente;

import br.com.curso.aula175.contrato.PossuiIdentificador;
import br.com.curso.aula175.contrato.PossuiResumo;
import br.com.curso.aula175.dominio.valor.CodigoCliente;

public class ClienteBounded implements PossuiIdentificador<CodigoCliente>, PossuiResumo {
    private final CodigoCliente codigo;
    private final String nome;

    public ClienteBounded(CodigoCliente codigo, String nome) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código do cliente é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        this.codigo = codigo;
        this.nome = nome.trim();
    }

    @Override
    public CodigoCliente id() {
        return codigo;
    }

    public String nome() {
        return nome;
    }

    @Override
    public String resumo() {
        return codigo.resumo() + " | Cliente: " + nome;
    }
}
```

---

## Ajustando OrdemServicoBounded para possuir ID

Substitua `OrdemServicoBounded.java` por esta versão:

```java
package br.com.curso.aula175.dominio.ordemservico;

import br.com.curso.aula175.contrato.PossuiIdentificador;
import br.com.curso.aula175.contrato.PossuiResumo;
import br.com.curso.aula175.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoBounded implements PossuiIdentificador<CodigoOs>, PossuiResumo {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;
    private final StatusOs status;

    public OrdemServicoBounded(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            StatusOs status
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
        this.status = status;
    }

    @Override
    public CodigoOs id() {
        return codigo;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public StatusOs status() {
        return status;
    }

    @Override
    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Status: " + status;
    }
}
```

---

## Repositório com bounded type

Agora vamos criar um repositório que só aceita itens com identificador.

Crie:

```text
src\br\com\curso\aula175\infra\RepositorioIdentificavelMemoria.java
```

Código:

```java
package br.com.curso.aula175.infra;

import br.com.curso.aula175.contrato.PossuiIdentificador;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RepositorioIdentificavelMemoria<ID, T extends PossuiIdentificador<ID>> {
    private final Map<ID, T> itensPorId;

    public RepositorioIdentificavelMemoria() {
        this.itensPorId = new LinkedHashMap<>();
    }

    public void salvar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        ID id = item.id();

        if (id == null) {
            throw new IllegalArgumentException("ID do item é obrigatório.");
        }

        if (itensPorId.containsKey(id)) {
            throw new IllegalStateException("Item já cadastrado com ID: " + id);
        }

        itensPorId.put(id, item);
    }

    public T buscarObrigatorio(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        T item = itensPorId.get(id);

        if (item == null) {
            throw new IllegalArgumentException("Item não encontrado para ID: " + id);
        }

        return item;
    }

    public boolean existe(ID id) {
        return itensPorId.containsKey(id);
    }

    public List<T> listar() {
        return List.copyOf(itensPorId.values());
    }

    public int quantidade() {
        return itensPorId.size();
    }
}
```

---

## Como ler `T extends PossuiIdentificador<ID>`

```java
public class RepositorioIdentificavelMemoria<ID, T extends PossuiIdentificador<ID>>
```

Significa:

```text
ID é o tipo do identificador;
T é o tipo da entidade;
T precisa implementar PossuiIdentificador<ID>.
```

Isso permite o repositório chamar:

```java
item.id()
```

sem cast e sem Object.

---

## App com repositório bounded para OS

Crie:

```text
src\br\com\curso\aula175\app\RepositorioBoundedOsApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.ordemservico.OrdemServicoBounded;
import br.com.curso.aula175.dominio.ordemservico.StatusOs;
import br.com.curso.aula175.dominio.valor.CodigoOs;
import br.com.curso.aula175.infra.RepositorioIdentificavelMemoria;

import java.time.LocalDate;

public class RepositorioBoundedOsApp {
    public static void main(String[] args) {
        RepositorioIdentificavelMemoria<CodigoOs, OrdemServicoBounded> repositorio =
                new RepositorioIdentificavelMemoria<>();

        OrdemServicoBounded os = new OrdemServicoBounded(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        repositorio.salvar(os);

        OrdemServicoBounded encontrada = repositorio.buscarObrigatorio(new CodigoOs("os-2026-0001"));

        System.out.println(encontrada.resumo());
        System.out.println("Quantidade: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.RepositorioBoundedOsApp
```

---

## App com repositório bounded para Cliente

Crie:

```text
src\br\com\curso\aula175\app\RepositorioBoundedClienteApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.cliente.ClienteBounded;
import br.com.curso.aula175.dominio.valor.CodigoCliente;
import br.com.curso.aula175.infra.RepositorioIdentificavelMemoria;

public class RepositorioBoundedClienteApp {
    public static void main(String[] args) {
        RepositorioIdentificavelMemoria<CodigoCliente, ClienteBounded> repositorio =
                new RepositorioIdentificavelMemoria<>();

        ClienteBounded cliente = new ClienteBounded(
                new CodigoCliente("CLI-001"),
                "Empresa Modelo"
        );

        repositorio.salvar(cliente);

        ClienteBounded encontrado = repositorio.buscarObrigatorio(new CodigoCliente("cli-001"));

        System.out.println(encontrado.resumo());
        System.out.println("Quantidade: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.RepositorioBoundedClienteApp
```

---

## Vantagem sobre o repositório genérico livre

Antes, em um repositório genérico livre, você poderia ter:

```java
salvar(ID id, T item)
```

Agora, com bounded type, o item carrega seu próprio ID:

```java
salvar(T item)
```

Porque o contrato garante:

```java
item.id()
```

Isso deixa a API mais expressiva.

Mas também aumenta a exigência:

```text
T precisa implementar PossuiIdentificador<ID>.
```

---

## Múltiplos limites

Um tipo genérico pode ter mais de um limite.

Exemplo:

```java
<T extends PossuiIdentificador<ID> & PossuiResumo>
```

Isso significa:

```text
T precisa possuir ID;
e também precisa possuir resumo.
```

Crie:

```text
src\br\com\curso\aula175\util\AuditoriaGenerica.java
```

Código:

```java
package br.com.curso.aula175.util;

import br.com.curso.aula175.contrato.PossuiIdentificador;
import br.com.curso.aula175.contrato.PossuiResumo;

public final class AuditoriaGenerica {
    private AuditoriaGenerica() {
    }

    public static <ID, T extends PossuiIdentificador<ID> & PossuiResumo> void auditarCadastro(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        System.out.println("Cadastro auditado");
        System.out.println("ID: " + item.id());
        System.out.println("Resumo: " + item.resumo());
    }
}
```

---

## App com múltiplos limites

Crie:

```text
src\br\com\curso\aula175\app\AuditoriaGenericaApp.java
```

Código:

```java
package br.com.curso.aula175.app;

import br.com.curso.aula175.dominio.cliente.ClienteBounded;
import br.com.curso.aula175.dominio.ordemservico.OrdemServicoBounded;
import br.com.curso.aula175.dominio.ordemservico.StatusOs;
import br.com.curso.aula175.dominio.valor.CodigoCliente;
import br.com.curso.aula175.dominio.valor.CodigoOs;
import br.com.curso.aula175.util.AuditoriaGenerica;

import java.time.LocalDate;

public class AuditoriaGenericaApp {
    public static void main(String[] args) {
        OrdemServicoBounded os = new OrdemServicoBounded(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        ClienteBounded cliente = new ClienteBounded(
                new CodigoCliente("CLI-001"),
                "Empresa Modelo"
        );

        AuditoriaGenerica.auditarCadastro(os);

        System.out.println();

        AuditoriaGenerica.auditarCadastro(cliente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula175.app.AuditoriaGenericaApp
```

---

## Regras de múltiplos limites

A sintaxe usa `&`:

```java
<T extends InterfaceA & InterfaceB>
```

Se houver uma classe e interfaces, a classe vem primeiro.

Exemplo conceitual:

```java
<T extends MinhaClasseBase & InterfaceA & InterfaceB>
```

Você não pode colocar a classe depois da interface.

---

## `extends` em generics não significa só herança de classe

Em generics, `extends` é usado para:

```text
classe;
interface;
múltiplos limites.
```

Exemplos:

```java
<T extends Number>
<T extends Comparable<T>>
<T extends PossuiResumo>
<T extends PossuiIdentificador<ID> & PossuiResumo>
```

Mesmo com interface, a palavra é `extends`.

---

## Quando usar bounded types

Use bounded types quando:

```text
o método ou classe genérica precisa chamar métodos específicos;
o tipo genérico precisa obedecer a um contrato;
você quer evitar Object e cast;
você quer preservar flexibilidade sem perder comportamento garantido.
```

Exemplos:

```text
ordenar itens comparáveis;
imprimir resumo;
salvar entidades com ID;
auditar itens identificáveis;
calcular sobre números;
converter objetos que seguem contrato.
```

---

## Quando evitar bounded types

Evite quando:

```text
um tipo específico resolveria melhor;
a abstração fica difícil de ler;
o contrato genérico não representa uma regra real;
você está criando complexidade sem ganho;
o método só será usado por uma classe.
```

Generics com limite são poderosos.

Mas poder demais sem critério deixa o código pesado.

---

## Ligação com backend

Bounded types aparecem em vários pontos profissionais.

Exemplos conceituais:

```java
Repositorio<ID, T extends Entidade<ID>>
Auditor<T extends PossuiIdentificador<ID> & PossuiResumo>
Ordenador<T extends Comparable<T>>
Validador<T extends Comando>
Mapper<E extends Entidade<ID>, S>
```

Mais adiante, isso conecta com:

```text
entities;
repositories;
use cases;
DTOs;
mappers;
services;
base classes;
interfaces de domínio.
```

Também ajuda a entender APIs de frameworks.

---

## Limite importante

Não use bounded types para forçar arquitetura genérica demais.

Exemplo perigoso:

```java
ServiceGenerico<T extends Entidade<ID>, ID>
```

Pode parecer bonito, mas pode esconder regras específicas de cada domínio.

Regra:

```text
use generics para expressar contratos reais,
não para apagar diferenças importantes.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Generics livre e resumo

Execute:

```powershell
java -cp out br.com.curso.aula175.app.GenericsLivreApp
java -cp out br.com.curso.aula175.app.ImpressoraResumoBoundedApp
```

### Parte 2 — Comparable

Execute:

```powershell
java -cp out br.com.curso.aula175.app.OrdenaveisApp
java -cp out br.com.curso.aula175.app.CaixaOrdenadaApp
```

### Parte 3 — Repositório com bounded type

Execute:

```powershell
java -cp out br.com.curso.aula175.app.RepositorioBoundedOsApp
java -cp out br.com.curso.aula175.app.RepositorioBoundedClienteApp
```

### Parte 4 — Múltiplos limites

Execute:

```powershell
java -cp out br.com.curso.aula175.app.AuditoriaGenericaApp
```

---

## Desafio prático

Crie uma interface:

```text
src\br\com\curso\aula175\contrato\PossuiStatus.java
```

Ela deve ser genérica:

```java
PossuiStatus<S>
```

Método:

```text
S status();
```

Depois ajuste `OrdemServicoBounded` para implementar:

```java
PossuiStatus<StatusOs>
```

Crie uma classe utilitária:

```text
src\br\com\curso\aula175\util\FiltroPorStatus.java
```

Método:

```java
public static <S, T extends PossuiStatus<S>> List<T> filtrarPorStatus(List<T> itens, S status)
```

Regras:

```text
itens não pode ser null;
status não pode ser null;
retornar List.copyOf do resultado;
filtrar itens cujo status seja igual ao informado.
```

Crie o app:

```text
src\br\com\curso\aula175\app\FiltroPorStatusBoundedApp.java
```

Critério principal:

```text
usar bounded type para garantir que T possui status().
```

---

## Desafio extra

Crie uma interface:

```text
src\br\com\curso\aula175\contrato\PossuiDataEntrada.java
```

Método:

```text
LocalDate dataEntrada();
```

Ajuste `OrdemServicoBounded` para implementar essa interface.

Crie uma utilidade:

```text
src\br\com\curso\aula175\util\OrdenadorPorDataEntrada.java
```

Método:

```java
public static <T extends PossuiDataEntrada> List<T> ordenarPorDataEntrada(List<T> itens)
```

Regras:

```text
não alterar lista original;
ordenar por dataEntrada;
retornar List.copyOf.
```

Crie o app:

```text
src\br\com\curso\aula175\app\OrdenadorPorDataEntradaBoundedApp.java
```

Critério principal:

```text
usar contrato específico em vez de Object.
```

---

## Erros comuns nesta aula

### 1. Tentar chamar método específico em T livre

Errado:

```java
public static <T> void imprimir(T item) {
    item.resumo();
}
```

Certo:

```java
public static <T extends PossuiResumo> void imprimir(T item) {
    item.resumo();
}
```

### 2. Achar que `extends` só serve para classes

Em generics, `extends` também é usado com interfaces.

### 3. Criar limite sem necessidade

Se você não usa métodos do limite, talvez não precise dele.

### 4. Exagerar em múltiplos limites

Muitos limites podem deixar o código difícil.

### 5. Usar bounded type para esconder regra específica

Se a regra pertence a uma entidade específica, talvez não deva ser genérica.

### 6. Esquecer que `Comparable<T>` precisa ser consistente

Se a comparação for ruim, `TreeSet`, ordenação e métodos de menor/maior podem se comportar mal.

### 7. Usar `T extends Comparable<T>` sem entender que está exigindo ordem natural

Se a ordenação for contextual, talvez `Comparator<T>` seja melhor.

---

## Debug recomendado

Use debug em:

```text
ImpressoraResumo.java
Ordenaveis.java
CaixaOrdenada.java
RepositorioIdentificavelMemoria.java
AuditoriaGenerica.java
RepositorioBoundedOsApp.java
RepositorioBoundedClienteApp.java
AuditoriaGenericaApp.java
```

Breakpoints recomendados:

```java
item.resumo()

item.compareTo(...)

copia.sort(null)

item.id()

itensPorId.put(...)

buscarObrigatorio(...)

AuditoriaGenerica.auditarCadastro(...)
```

Observe:

```text
como o limite permite chamar métodos;
como Comparable habilita comparação;
como o repositório consegue obter ID do item;
como múltiplos limites permitem usar id() e resumo();
como o compilador impede tipos que não obedecem ao contrato.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa <T extends PossuiResumo>?
2. Por que T livre não permite chamar item.resumo()?
3. Para que serve <T extends Comparable<T>>?
4. O que significa T extends PossuiIdentificador<ID>?
5. Quando bounded types podem atrapalhar?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar T livre;
explicar bounded type;
usar <T extends Interface>;
usar <T extends Comparable<T>>;
criar método genérico com limite;
criar classe genérica com limite;
criar PossuiResumo;
criar PossuiIdentificador<ID>;
criar RepositorioIdentificavelMemoria<ID, T extends PossuiIdentificador<ID>>;
usar múltiplos limites com &;
entender que extends também vale para interface em generics;
resolver FiltroPorStatusBoundedApp;
resolver OrdenadorPorDataEntradaBoundedApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-175-bounded-types-extends-em-generics
git commit -m "Aula 175: bounded types extends em generics"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
bounded types permitem limitar um tipo genérico a um contrato específico.
```

Você viu que isso permite escrever código genérico que ainda consegue chamar métodos como:

```text
resumo();
id();
compareTo();
status();
dataEntrada().
```

Sem `Object`.

Sem cast.

Com segurança de compilação.

Na próxima aula, vamos estudar `wildcards`.

Vamos entender o uso de:

```text
?
? extends T
? super T
```

Esse assunto é essencial para entender listas flexíveis, APIs genéricas e a famosa regra PECS.
