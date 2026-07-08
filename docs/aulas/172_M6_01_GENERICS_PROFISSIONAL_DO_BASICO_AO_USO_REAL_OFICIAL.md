# 172 — M6.01 — Generics profissional: do básico ao uso real

## Objetivo da aula

Nesta aula você vai iniciar o Módulo 6.

O tema será:

```text
Generics
```

Você já usou generics muitas vezes sem aprofundar o assunto.

Exemplos:

```java
List<String>
Set<CodigoOs>
Map<CodigoOs, OrdemServico>
Queue<RegistroImportacaoOs>
Comparator<OrdemServico>
```

Até agora, usamos generics como ferramenta.

A partir deste módulo, vamos entender o mecanismo de verdade.

Ao final desta aula, você deve conseguir:

```text
entender por que generics existem;
explicar o problema de usar Object;
explicar type safety;
entender o que significa List<String>;
entender o que significa Map<K, V>;
criar uma classe genérica simples;
criar um método genérico simples;
entender type parameter;
evitar raw types;
entender por que generics funcionam em tempo de compilação;
usar generics em resultados, repositórios em memória e respostas;
perceber como generics aparecem em backend real.
```

Esta aula abre um módulo muito importante para Java profissional.

---

## Ideia principal

Generics permitem escrever código reutilizável com segurança de tipo.

Sem generics, você acaba usando `Object`.

Com `Object`, você perde clareza e segurança.

Exemplo sem generics:

```java
Object valor = "Thiago";
```

O problema é:

```text
Object aceita qualquer coisa.
```

Exemplo:

```text
String;
Integer;
BigDecimal;
LocalDate;
OrdemServico;
Cliente;
Produto.
```

Isso pode parecer flexível, mas também pode esconder erro.

Generics resolvem esse problema.

---

## O problema antes de Generics

Imagine uma lista que deveria guardar apenas nomes.

Sem generics, ela poderia guardar qualquer objeto.

Exemplo conceitual:

```text
lista.add("Ana");
lista.add("Carlos");
lista.add(100);
```

O número `100` não deveria estar ali.

Mas sem generics, esse erro poderia aparecer só em tempo de execução.

Com generics, esse erro aparece em tempo de compilação.

Isso é muito melhor.

---

## Type safety

`Type safety` significa segurança de tipo.

Em português simples:

```text
o compilador ajuda a impedir que você coloque o tipo errado no lugar errado.
```

Exemplo:

```java
List<String> nomes = new ArrayList<>();
```

Essa lista aceita `String`.

Não aceita `Integer`.

Isso evita erro cedo.

Erro cedo é melhor que erro tarde.

---

## Generics aparecem entre sinais de menor e maior

A sintaxe mais comum é:

```java
List<String>
```

O tipo dentro de `< >` informa o tipo dos elementos.

Exemplos:

```java
List<String>
List<Integer>
Set<CodigoOs>
Map<String, Integer>
Map<CodigoOs, OrdemServico>
Queue<OrdemServico>
RepositorioMemoria<Cliente>
ResultadoOperacao<OrdemServico>
```

Isso é generics.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-172-generics-profissional-do-basico-ao-uso-real
cd labs\m6\aula-172-generics-profissional-do-basico-ao-uso-real
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula172
mkdir src\br\com\curso\aula172\app
mkdir src\br\com\curso\aula172\dominio
mkdir src\br\com\curso\aula172\dominio\valor
mkdir src\br\com\curso\aula172\dominio\ordemservico
mkdir src\br\com\curso\aula172\infra
mkdir src\br\com\curso\aula172\util
```

---

## Exemplo 1 — O problema com Object

Crie:

```text
src\br\com\curso\aula172\app\SemGenericsObjectApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import java.util.ArrayList;
import java.util.List;

public class SemGenericsObjectApp {
    public static void main(String[] args) {
        List valores = new ArrayList();

        valores.add("Ana");
        valores.add("Carlos");
        valores.add(100);

        for (Object valor : valores) {
            String nome = (String) valor;
            System.out.println("Nome: " + nome.toUpperCase());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.SemGenericsObjectApp
```

---

## O que observar

Este exemplo usa lista sem generics:

```java
List valores = new ArrayList();
```

Isso é chamado de:

```text
raw type
```

A lista aceita qualquer coisa.

Então este código compila com aviso:

```java
valores.add(100);
```

Mas na hora de converter para `String`, quebra:

```java
String nome = (String) valor;
```

O erro provável será:

```text
ClassCastException
```

Esse é exatamente o tipo de problema que generics evita.

---

## Raw type

Raw type é usar uma classe genérica sem informar o tipo.

Exemplos ruins:

```java
List lista = new ArrayList();
Map mapa = new HashMap();
Set conjunto = new HashSet();
```

Prefira:

```java
List<String> lista = new ArrayList<>();
Map<String, Integer> mapa = new HashMap<>();
Set<CodigoOs> conjunto = new HashSet<>();
```

Regra profissional:

```text
evite raw types.
```

Raw type tira segurança do compilador.

---

## Exemplo 2 — Com generics

Crie:

```text
src\br\com\curso\aula172\app\ComGenericsSegurancaApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import java.util.ArrayList;
import java.util.List;

public class ComGenericsSegurancaApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Mariana");

        for (String nome : nomes) {
            System.out.println("Nome: " + nome.toUpperCase());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.ComGenericsSegurancaApp
```

---

## O que mudou

Agora a lista é:

```java
List<String>
```

Isso significa:

```text
esta lista guarda String.
```

Se você tentar adicionar número:

```java
nomes.add(100);
```

o código não compila.

Isso é bom.

O erro aparece antes de rodar o sistema.

---

## Generics eliminam casts desnecessários

Sem generics, você precisa converter:

```java
String nome = (String) valor;
```

Com generics, o Java já sabe:

```java
for (String nome : nomes)
```

Isso melhora:

```text
segurança;
legibilidade;
manutenção;
debug;
refatoração.
```

---

## Diamond operator

Você já viu isto:

```java
List<String> nomes = new ArrayList<>();
```

O `<>` do lado direito é chamado de:

```text
diamond operator
```

Antes, seria necessário repetir:

```java
List<String> nomes = new ArrayList<String>();
```

Hoje usamos:

```java
new ArrayList<>()
```

O Java infere o tipo pelo lado esquerdo.

---

## Generics não aceitam tipos primitivos

Você não usa:

```java
List<int>
```

Use wrappers:

```java
List<Integer>
List<Long>
List<Double>
List<Boolean>
```

Exemplo:

```java
List<Integer> numeros = new ArrayList<>();
```

Isso se conecta ao que você estudou sobre wrappers e autoboxing.

---

## Exemplo 3 — List<Integer>

Crie:

```text
src\br\com\curso\aula172\app\GenericsComIntegerApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import java.util.ArrayList;
import java.util.List;

public class GenericsComIntegerApp {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>();

        numeros.add(10);
        numeros.add(20);
        numeros.add(30);

        int soma = 0;

        for (Integer numero : numeros) {
            soma += numero;
        }

        System.out.println("Soma: " + soma);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.GenericsComIntegerApp
```

---

## Generics com Map

`Map` usa dois tipos genéricos:

```java
Map<K, V>
```

Onde:

```text
K = key, chave;
V = value, valor.
```

Exemplo:

```java
Map<String, Integer>
```

Significa:

```text
chave String;
valor Integer.
```

Exemplo:

```java
Map<CodigoOs, OrdemServico>
```

Significa:

```text
chave CodigoOs;
valor OrdemServico.
```

---

## Exemplo 4 — Map<String, Integer>

Crie:

```text
src\br\com\curso\aula172\app\GenericsComMapApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class GenericsComMapApp {
    public static void main(String[] args) {
        Map<String, Integer> contagemPorStatus = new LinkedHashMap<>();

        contagemPorStatus.put("CADASTRADA", 2);
        contagemPorStatus.put("CONCLUIDA", 5);
        contagemPorStatus.put("CANCELADA", 1);

        for (Map.Entry<String, Integer> entrada : contagemPorStatus.entrySet()) {
            String status = entrada.getKey();
            Integer quantidade = entrada.getValue();

            System.out.println(status + " -> " + quantidade);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.GenericsComMapApp
```

---

## O que Map.Entry<String, Integer> significa

Quando você percorre:

```java
contagemPorStatus.entrySet()
```

cada entrada possui:

```text
chave String;
valor Integer.
```

Por isso o tipo é:

```java
Map.Entry<String, Integer>
```

Generics permitem que o compilador saiba exatamente os tipos.

---

## Nomes comuns de parâmetros genéricos

Você verá letras como:

```text
T
E
K
V
R
ID
```

Elas são convenções.

### T

Tipo genérico.

```java
class Caixa<T>
```

### E

Elemento.

Usado em coleções.

```java
List<E>
```

### K

Chave.

```java
Map<K, V>
```

### V

Valor.

```java
Map<K, V>
```

### R

Resultado ou retorno.

```java
Resultado<R>
```

Não é obrigatório usar essas letras, mas é comum.

---

## Criando uma classe genérica

Agora vamos criar nossa primeira classe genérica.

Crie:

```text
src\br\com\curso\aula172\util\Caixa.java
```

Código:

```java
package br.com.curso.aula172.util;

public class Caixa<T> {
    private final T valor;

    public Caixa(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor da caixa é obrigatório.");
        }

        this.valor = valor;
    }

    public T valor() {
        return valor;
    }

    public String descreverTipo() {
        return valor.getClass().getSimpleName();
    }
}
```

---

## Como ler Caixa<T>

```java
public class Caixa<T>
```

Significa:

```text
Caixa é uma classe que trabalha com algum tipo T.
```

Esse tipo será decidido quando você usar a classe.

Exemplos:

```java
Caixa<String>
Caixa<Integer>
Caixa<CodigoOs>
Caixa<OrdemServico>
```

A classe é uma só.

O tipo muda conforme o uso.

---

## App usando Caixa

Crie:

```text
src\br\com\curso\aula172\app\CaixaGenericaApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import br.com.curso.aula172.util.Caixa;

public class CaixaGenericaApp {
    public static void main(String[] args) {
        Caixa<String> caixaNome = new Caixa<>("Ana");
        Caixa<Integer> caixaNumero = new Caixa<>(100);

        String nome = caixaNome.valor();
        Integer numero = caixaNumero.valor();

        System.out.println("Nome: " + nome);
        System.out.println("Tipo da caixa nome: " + caixaNome.descreverTipo());

        System.out.println();

        System.out.println("Número: " + numero);
        System.out.println("Tipo da caixa número: " + caixaNumero.descreverTipo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.CaixaGenericaApp
```

---

## O que esse exemplo ensina

A mesma classe `Caixa<T>` foi usada como:

```java
Caixa<String>
Caixa<Integer>
```

E o retorno de:

```java
valor()
```

respeita o tipo.

Na caixa de `String`, retorna `String`.

Na caixa de `Integer`, retorna `Integer`.

Sem cast.

Com segurança.

---

## Classe genérica com dois tipos

Agora vamos criar uma classe com dois parâmetros genéricos.

Crie:

```text
src\br\com\curso\aula172\util\ParValores.java
```

Código:

```java
package br.com.curso.aula172.util;

public class ParValores<K, V> {
    private final K chave;
    private final V valor;

    public ParValores(K chave, V valor) {
        if (chave == null) {
            throw new IllegalArgumentException("Chave é obrigatória.");
        }

        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.chave = chave;
        this.valor = valor;
    }

    public K chave() {
        return chave;
    }

    public V valor() {
        return valor;
    }

    public String resumo() {
        return chave + " -> " + valor;
    }
}
```

---

## App usando ParValores

Crie:

```text
src\br\com\curso\aula172\app\ParValoresGenericoApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import br.com.curso.aula172.util.ParValores;

public class ParValoresGenericoApp {
    public static void main(String[] args) {
        ParValores<String, Integer> contagem = new ParValores<>("CONCLUIDA", 10);
        ParValores<Integer, String> linhaErro = new ParValores<>(5, "Código inválido");

        System.out.println(contagem.resumo());
        System.out.println(linhaErro.resumo());

        String status = contagem.chave();
        Integer quantidade = contagem.valor();

        Integer linha = linhaErro.chave();
        String erro = linhaErro.valor();

        System.out.println();
        System.out.println("Status: " + status + ", quantidade: " + quantidade);
        System.out.println("Linha: " + linha + ", erro: " + erro);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.ParValoresGenericoApp
```

---

## Como ler ParValores<K, V>

```java
ParValores<K, V>
```

Significa:

```text
K é o tipo da chave;
V é o tipo do valor.
```

Isso parece muito com:

```java
Map<K, V>
```

A ideia é a mesma.

Generics permitem criar estruturas reutilizáveis sem perder tipo.

---

## Criando uma classe de resultado genérica

Em backend, é comum criar respostas genéricas.

Exemplo:

```text
Resultado de uma operação que pode retornar Cliente.
Resultado de uma operação que pode retornar OrdemServico.
Resultado de uma operação que pode retornar Produto.
```

Em vez de criar uma classe para cada tipo, podemos criar:

```java
ResultadoOperacao<T>
```

Crie:

```text
src\br\com\curso\aula172\util\ResultadoOperacao.java
```

Código:

```java
package br.com.curso.aula172.util;

public class ResultadoOperacao<T> {
    private final boolean sucesso;
    private final String mensagem;
    private final T valor;

    private ResultadoOperacao(boolean sucesso, String mensagem, T valor) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.valor = valor;
    }

    public static <T> ResultadoOperacao<T> sucesso(String mensagem, T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor de sucesso é obrigatório.");
        }

        return new ResultadoOperacao<>(true, mensagem, valor);
    }

    public static <T> ResultadoOperacao<T> falha(String mensagem) {
        return new ResultadoOperacao<>(false, mensagem, null);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public boolean falha() {
        return !sucesso;
    }

    public String mensagem() {
        return mensagem;
    }

    public T valor() {
        if (falha()) {
            throw new IllegalStateException("Resultado de falha não possui valor.");
        }

        return valor;
    }

    public String resumo() {
        return (sucesso ? "SUCESSO" : "FALHA") + " | " + mensagem;
    }
}
```

---

## O que aparece de novo aqui

Veja este método:

```java
public static <T> ResultadoOperacao<T> sucesso(String mensagem, T valor)
```

O `<T>` antes do retorno indica:

```text
este método declara seu próprio tipo genérico.
```

Esse é um método genérico.

Vamos estudar métodos genéricos com mais profundidade em aulas futuras.

Por enquanto, entenda que o método consegue criar `ResultadoOperacao<T>` para qualquer tipo.

---

## Domínio simples de OS

Crie:

```text
src\br\com\curso\aula172\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula172.dominio.valor;

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

Crie:

```text
src\br\com\curso\aula172\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula172.dominio.ordemservico;

public enum StatusOs {
    CADASTRADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula172\dominio\ordemservico\OrdemServicoGenerics.java
```

Código:

```java
package br.com.curso.aula172.dominio.ordemservico;

import br.com.curso.aula172.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoGenerics {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;
    private final StatusOs status;

    public OrdemServicoGenerics(
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

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Status: " + status;
    }
}
```

---

## App com ResultadoOperacao

Crie:

```text
src\br\com\curso\aula172\app\ResultadoOperacaoGenericoApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import br.com.curso.aula172.dominio.ordemservico.OrdemServicoGenerics;
import br.com.curso.aula172.dominio.ordemservico.StatusOs;
import br.com.curso.aula172.dominio.valor.CodigoOs;
import br.com.curso.aula172.util.ResultadoOperacao;

import java.time.LocalDate;

public class ResultadoOperacaoGenericoApp {
    public static void main(String[] args) {
        OrdemServicoGenerics os = new OrdemServicoGenerics(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        ResultadoOperacao<OrdemServicoGenerics> resultado =
                ResultadoOperacao.sucesso("OS criada com sucesso.", os);

        System.out.println(resultado.resumo());
        System.out.println(resultado.valor().resumo());

        ResultadoOperacao<OrdemServicoGenerics> falha =
                ResultadoOperacao.falha("OS não encontrada.");

        System.out.println();
        System.out.println(falha.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.ResultadoOperacaoGenericoApp
```

---

## Por que ResultadoOperacao<T> é útil

Sem generics, você talvez criaria:

```text
ResultadoOrdemServico;
ResultadoCliente;
ResultadoProduto;
ResultadoContrato.
```

Com generics, você cria:

```java
ResultadoOperacao<T>
```

E usa:

```java
ResultadoOperacao<OrdemServicoGenerics>
ResultadoOperacao<String>
ResultadoOperacao<Integer>
```

Isso reduz duplicação sem perder segurança.

---

## Repositório genérico em memória

Agora vamos criar uma classe genérica para guardar qualquer tipo em memória.

Crie:

```text
src\br\com\curso\aula172\infra\RepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula172.infra;

import java.util.ArrayList;
import java.util.List;

public class RepositorioMemoria<T> {
    private final List<T> itens;

    public RepositorioMemoria() {
        this.itens = new ArrayList<>();
    }

    public void salvar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        itens.add(item);
    }

    public List<T> listar() {
        return List.copyOf(itens);
    }

    public int quantidade() {
        return itens.size();
    }

    public boolean vazio() {
        return itens.isEmpty();
    }

    public void limpar() {
        itens.clear();
    }
}
```

---

## Como ler RepositorioMemoria<T>

```java
RepositorioMemoria<T>
```

Significa:

```text
este repositório guarda itens de algum tipo T.
```

Quando usar:

```java
RepositorioMemoria<OrdemServicoGenerics>
```

ele guardará OS.

Quando usar:

```java
RepositorioMemoria<String>
```

ele guardará String.

A classe é uma só.

O tipo muda no uso.

---

## App com RepositorioMemoria

Crie:

```text
src\br\com\curso\aula172\app\RepositorioMemoriaGenericoApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import br.com.curso.aula172.dominio.ordemservico.OrdemServicoGenerics;
import br.com.curso.aula172.dominio.ordemservico.StatusOs;
import br.com.curso.aula172.dominio.valor.CodigoOs;
import br.com.curso.aula172.infra.RepositorioMemoria;

import java.time.LocalDate;

public class RepositorioMemoriaGenericoApp {
    public static void main(String[] args) {
        RepositorioMemoria<OrdemServicoGenerics> repositorio = new RepositorioMemoria<>();

        repositorio.salvar(new OrdemServicoGenerics(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        ));

        repositorio.salvar(new OrdemServicoGenerics(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        ));

        System.out.println("Quantidade: " + repositorio.quantidade());

        for (OrdemServicoGenerics os : repositorio.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.RepositorioMemoriaGenericoApp
```

---

## Cuidado arquitetural sobre repositório genérico

Neste momento, `RepositorioMemoria<T>` é didático.

Em projetos reais, repositórios genéricos precisam de muito critério.

Por quê?

Porque cada entidade pode ter regras específicas:

```text
buscar por código;
buscar por status;
impedir duplicidade;
validar vínculo;
paginar;
ordenar;
filtrar.
```

Um repositório genérico pode ajudar em algumas bases, mas também pode esconder intenção.

Mais adiante, vamos discutir isso melhor em arquitetura.

Por agora, o objetivo é entender generics.

---

## Método genérico simples

Agora vamos criar uma classe com métodos genéricos.

Crie:

```text
src\br\com\curso\aula172\util\ListasUtil.java
```

Código:

```java
package br.com.curso.aula172.util;

import java.util.List;

public final class ListasUtil {
    private ListasUtil() {
    }

    public static <T> void imprimir(String titulo, List<T> itens) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        System.out.println(titulo + ":");

        for (T item : itens) {
            System.out.println("- " + item);
        }
    }

    public static <T> T primeiroOuNull(List<T> itens) {
        if (itens == null || itens.isEmpty()) {
            return null;
        }

        return itens.get(0);
    }
}
```

---

## Como ler método genérico

Veja:

```java
public static <T> void imprimir(String titulo, List<T> itens)
```

O `<T>` antes do `void` declara o tipo genérico do método.

A lista é:

```java
List<T>
```

Isso significa:

```text
este método imprime uma lista de qualquer tipo.
```

Também temos:

```java
public static <T> T primeiroOuNull(List<T> itens)
```

Esse método recebe uma lista de `T` e retorna um `T`.

---

## App com método genérico

Crie:

```text
src\br\com\curso\aula172\app\MetodoGenericoApp.java
```

Código:

```java
package br.com.curso.aula172.app;

import br.com.curso.aula172.util.ListasUtil;

import java.util.List;

public class MetodoGenericoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Mariana");
        List<Integer> numeros = List.of(10, 20, 30);

        ListasUtil.imprimir("Nomes", nomes);

        System.out.println();

        ListasUtil.imprimir("Números", numeros);

        String primeiroNome = ListasUtil.primeiroOuNull(nomes);
        Integer primeiroNumero = ListasUtil.primeiroOuNull(numeros);

        System.out.println();
        System.out.println("Primeiro nome: " + primeiroNome);
        System.out.println("Primeiro número: " + primeiroNumero);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula172.app.MetodoGenericoApp
```

---

## Generics em tempo de compilação

Um ponto importante:

```text
Generics são principalmente uma segurança de compilação.
```

O compilador usa generics para impedir erros.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
```

O compilador sabe que essa lista é de `String`.

Mas em tempo de execução existe um conceito chamado `type erasure`.

Não vamos aprofundar agora.

Por enquanto, guarde:

```text
Generics ajudam principalmente antes do programa rodar.
```

Isso é ótimo, porque evita erro cedo.

---

## Generics e clareza de API

Compare:

```java
Object buscar();
```

com:

```java
OrdemServico buscar();
```

ou:

```java
ResultadoOperacao<OrdemServico> buscar();
```

A segunda opção comunica muito mais.

Generics tornam APIs mais claras.

Exemplo:

```java
List<OrdemServico>
```

é melhor que:

```java
List
```

ou:

```java
List<Object>
```

Porque o tipo esperado está explícito.

---

## Ligação com backend

Generics aparecem o tempo todo em backend Java.

Exemplos:

```java
List<ClienteResponse>
Page<OrdemServico>
ResponseEntity<ContratoResponse>
Optional<Usuario>
Map<String, String>
Repository<Entidade, ID>
JpaRepository<Cliente, Long>
ResultadoOperacao<OrdemServico>
ApiResponse<ErroValidacao>
```

Quando chegarmos em Spring Boot, você verá generics em:

```text
ResponseEntity<T>;
JpaRepository<T, ID>;
Page<T>;
Optional<T>;
List<T>;
Map<K, V>;
DTOs;
services;
mappers;
clients;
responses padronizadas.
```

Por isso este módulo é fundamental.

---

## O que não vamos aprofundar ainda

Nesta primeira aula, o objetivo é entender a base.

Ainda vamos estudar em próximas aulas:

```text
bounded types;
extends;
super;
wildcards;
PECS;
generic methods avançados;
interfaces genéricas;
generics com herança;
type erasure;
limitações de generics;
generics em repositories;
generics em responses de API;
generics em arquitetura.
```

Não tente dominar tudo hoje.

Hoje o foco é:

```text
por que existe;
como declarar;
como usar;
como evitar raw type;
como criar classe e método genérico simples.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Problema sem generics

Execute:

```powershell
java -cp out br.com.curso.aula172.app.SemGenericsObjectApp
```

Observe o erro.

### Parte 2 — Segurança com generics

Execute:

```powershell
java -cp out br.com.curso.aula172.app.ComGenericsSegurancaApp
java -cp out br.com.curso.aula172.app.GenericsComIntegerApp
java -cp out br.com.curso.aula172.app.GenericsComMapApp
```

### Parte 3 — Classes genéricas

Execute:

```powershell
java -cp out br.com.curso.aula172.app.CaixaGenericaApp
java -cp out br.com.curso.aula172.app.ParValoresGenericoApp
```

### Parte 4 — Resultado e repositório genérico

Execute:

```powershell
java -cp out br.com.curso.aula172.app.ResultadoOperacaoGenericoApp
java -cp out br.com.curso.aula172.app.RepositorioMemoriaGenericoApp
```

### Parte 5 — Método genérico

Execute:

```powershell
java -cp out br.com.curso.aula172.app.MetodoGenericoApp
```

---

## Desafio prático

Crie uma classe genérica:

```text
src\br\com\curso\aula172\util\RespostaConsulta.java
```

Ela deve ser:

```java
RespostaConsulta<T>
```

Campos:

```text
boolean encontrado;
String mensagem;
T dado;
```

Regras:

```text
se encontrado for true, dado não pode ser null;
se encontrado for false, dado deve ser null;
mensagem é obrigatória.
```

Crie métodos estáticos:

```text
encontrado(String mensagem, T dado);
naoEncontrado(String mensagem);
```

Depois crie:

```text
src\br\com\curso\aula172\app\RespostaConsultaGenericaApp.java
```

Use com:

```text
RespostaConsulta<OrdemServicoGenerics>
RespostaConsulta<String>
```

Critério principal:

```text
não usar Object;
não fazer cast;
usar generics corretamente.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula172\infra\CatalogoMemoria.java
```

Ela deve ser genérica:

```java
CatalogoMemoria<ID, T>
```

Campos:

```text
Map<ID, T> itensPorId;
```

Métodos:

```text
cadastrar(ID id, T item);
buscar(ID id);
existe(ID id);
listar();
quantidade();
```

Regras:

```text
id não pode ser null;
item não pode ser null;
id duplicado deve ser bloqueado;
listar deve retornar cópia protegida.
```

Depois crie:

```text
src\br\com\curso\aula172\app\CatalogoMemoriaGenericoApp.java
```

Use com:

```text
CatalogoMemoria<CodigoOs, OrdemServicoGenerics>
CatalogoMemoria<String, String>
```

Critério principal:

```text
usar dois parâmetros genéricos com clareza: ID e T.
```

---

## Erros comuns nesta aula

### 1. Usar raw type

Evite:

```java
List lista = new ArrayList();
```

Prefira:

```java
List<String> lista = new ArrayList<>();
```

### 2. Usar Object sem necessidade

Evite:

```java
Object valor;
```

quando você conhece o tipo.

### 3. Fazer cast desnecessário

Generics evitam muitos casts.

### 4. Criar classe genérica sem motivo

Generics são úteis quando existe reutilização real.

Não use apenas para parecer avançado.

### 5. Usar letra genérica sem clareza

`T`, `K`, `V` são convenções.

Mas em alguns casos `ID` pode ser mais claro.

### 6. Achar que generics aceitam primitivo

Use:

```text
Integer, Long, Double, Boolean.
```

Não:

```text
int, long, double, boolean.
```

### 7. Achar que generics substituem modelagem

Generics ajudam com tipos.

Eles não substituem regras de domínio.

### 8. Criar repositório genérico para tudo sem critério

Reutilização demais pode esconder intenção.

---

## Debug recomendado

Use debug em:

```text
SemGenericsObjectApp.java
ComGenericsSegurancaApp.java
Caixa.java
CaixaGenericaApp.java
ParValores.java
ResultadoOperacao.java
RepositorioMemoria.java
ListasUtil.java
MetodoGenericoApp.java
```

Breakpoints recomendados:

```java
valores.add(...)

String nome = (String) valor

nomes.add(...)

return valor

ResultadoOperacao.sucesso(...)

ResultadoOperacao.falha(...)

repositorio.salvar(...)

List.copyOf(...)

primeiroOuNull(...)
```

Observe:

```text
onde o erro sem generics aparece;
como generics evitam cast;
como o tipo T muda conforme o uso;
como ResultadoOperacao<T> mantém tipo;
como RepositorioMemoria<T> reaproveita código;
como método genérico retorna o tipo correto.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que generics existem?
2. O que é raw type?
3. O que significa Caixa<T>?
4. O que significa Map<K, V>?
5. Por que generics ajudam em backend?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o problema de Object;
explicar raw type;
usar List<String>;
usar List<Integer>;
usar Map<String, Integer>;
criar classe Caixa<T>;
criar classe ParValores<K, V>;
criar ResultadoOperacao<T>;
criar RepositorioMemoria<T>;
criar método genérico;
entender type parameter;
usar diamond operator;
evitar casts desnecessários;
entender que generics ajudam na compilação;
resolver RespostaConsultaGenericaApp;
resolver CatalogoMemoriaGenericoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-172-generics-profissional-do-basico-ao-uso-real
git commit -m "Aula 172: generics profissional do basico ao uso real"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Generics permitem criar código reutilizável com segurança de tipo.
```

Você viu que generics evitam:

```text
raw types;
casts desnecessários;
erros tardios;
APIs vagas baseadas em Object.
```

Também viu como criar:

```text
classe genérica;
classe com dois tipos;
resultado genérico;
repositório em memória genérico;
método genérico.
```

Na próxima aula, vamos aprofundar classes e interfaces genéricas.

Vamos entender melhor como criar contratos genéricos, quando usar `T`, quando usar `ID`, e como isso prepara o caminho para repositories, services e APIs mais profissionais.
