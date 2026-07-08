# 174 — M6.03 — Métodos genéricos

## Objetivo da aula

Nesta aula você vai aprofundar um ponto central de Generics:

```text
métodos genéricos
```

Na aula anterior, você estudou classes e interfaces genéricas, como:

```java
Repositorio<ID, T>
Validador<T>
Conversor<E, S>
ResultadoConsulta<T>
```

Agora o foco será criar métodos que declaram seus próprios tipos genéricos.

Exemplo:

```java
public static <T> T primeiro(List<T> itens)
```

Esse `<T>` antes do retorno é o ponto principal da aula.

Ao final, você deve conseguir:

```text
entender o que é um método genérico;
saber onde declarar <T>;
diferenciar tipo genérico da classe e tipo genérico do método;
criar métodos genéricos estáticos;
criar métodos genéricos de instância;
criar métodos com mais de um tipo genérico;
usar inferência de tipo;
usar métodos genéricos com List, Set e Map;
criar utilitários genéricos;
evitar Object e cast;
aplicar métodos genéricos em cenários parecidos com backend real.
```

---

## Ideia principal

Um método genérico trabalha com um tipo que será definido no momento do uso.

Exemplo:

```java
public static <T> T primeiro(List<T> itens)
```

Esse método funciona com:

```text
List<String>;
List<Integer>;
List<CodigoOs>;
List<OrdemServico>.
```

A lógica é a mesma:

```text
retornar o primeiro item da lista.
```

O tipo muda conforme a chamada.

Generics permitem reaproveitar comportamento sem perder segurança de tipo.

---

## Onde fica o `<T>`

Em um método genérico, o tipo é declarado antes do tipo de retorno:

```java
public static <T> T primeiro(List<T> itens)
```

Dividindo:

```text
public:
modificador de acesso.

static:
método estático.

<T>:
declara o tipo genérico do método.

T:
tipo de retorno.

primeiro:
nome do método.

List<T> itens:
parâmetro usando o tipo T.
```

Sem esse `<T>` antes do retorno, o código não compila.

Errado:

```java
public static T primeiro(List<T> itens)
```

Certo:

```java
public static <T> T primeiro(List<T> itens)
```

---

## Método genérico não é a mesma coisa que classe genérica

Uma classe genérica declara o tipo na classe:

```java
public class Caixa<T> {
}
```

Um método genérico declara o tipo no próprio método:

```java
public static <T> T primeiro(List<T> itens) {
}
```

Uma classe comum pode ter método genérico.

Uma classe genérica também pode ter método genérico.

Essas duas coisas são independentes.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-174-metodos-genericos
cd labs\m6\aula-174-metodos-genericos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula174
mkdir src\br\com\curso\aula174\app
mkdir src\br\com\curso\aula174\dominio
mkdir src\br\com\curso\aula174\dominio\valor
mkdir src\br\com\curso\aula174\dominio\ordemservico
mkdir src\br\com\curso\aula174\util
```

---

## Primeiro método genérico

Crie:

```text
src\br\com\curso\aula174\util\ListasGenericas.java
```

Código:

```java
package br.com.curso.aula174.util;

import java.util.ArrayList;
import java.util.List;

public final class ListasGenericas {
    private ListasGenericas() {
    }

    public static <T> T primeiro(List<T> itens) {
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser nula ou vazia.");
        }

        return itens.get(0);
    }

    public static <T> T ultimo(List<T> itens) {
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser nula ou vazia.");
        }

        return itens.get(itens.size() - 1);
    }

    public static <T> List<T> copiaProtegida(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        return List.copyOf(itens);
    }

    public static <T> List<T> copiaMutavel(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        return new ArrayList<>(itens);
    }
}
```

---

## App usando ListasGenericas

Crie:

```text
src\br\com\curso\aula174\app\ListasGenericasApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.ListasGenericas;

import java.util.List;

public class ListasGenericasApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Mariana");
        List<Integer> numeros = List.of(10, 20, 30);

        String primeiroNome = ListasGenericas.primeiro(nomes);
        Integer primeiroNumero = ListasGenericas.primeiro(numeros);

        System.out.println("Primeiro nome: " + primeiroNome);
        System.out.println("Primeiro número: " + primeiroNumero);

        System.out.println();
        System.out.println("Último nome: " + ListasGenericas.ultimo(nomes));
        System.out.println("Último número: " + ListasGenericas.ultimo(numeros));

        List<String> copiaMutavel = ListasGenericas.copiaMutavel(nomes);
        copiaMutavel.add("Bruno");

        System.out.println();
        System.out.println("Original: " + nomes);
        System.out.println("Cópia mutável: " + copiaMutavel);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.ListasGenericasApp
```

---

## Inferência de tipo

Quando você chama:

```java
String primeiroNome = ListasGenericas.primeiro(nomes);
```

o compilador entende:

```text
T = String
```

Quando chama:

```java
Integer primeiroNumero = ListasGenericas.primeiro(numeros);
```

o compilador entende:

```text
T = Integer
```

Você não precisou informar manualmente.

Isso se chama:

```text
inferência de tipo
```

O compilador deduz o tipo pelo contexto.

---

## Método genérico com Set

Agora vamos criar métodos para conjuntos.

Crie:

```text
src\br\com\curso\aula174\util\ConjuntosGenericos.java
```

Código:

```java
package br.com.curso.aula174.util;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

public final class ConjuntosGenericos {
    private ConjuntosGenericos() {
    }

    public static <T> Set<T> unicosNaOrdem(Iterable<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        Set<T> resultado = new LinkedHashSet<>();

        for (T item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            resultado.add(item);
        }

        return new LinkedHashSet<>(resultado);
    }

    public static <T extends Comparable<T>> Set<T> unicosOrdenados(Iterable<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        Set<T> resultado = new TreeSet<>();

        for (T item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            resultado.add(item);
        }

        return new TreeSet<>(resultado);
    }
}
```

---

## Primeiro contato com `<T extends Comparable<T>>`

Neste método apareceu algo novo:

```java
<T extends Comparable<T>>
```

Isso significa:

```text
T pode ser genérico,
mas precisa ser comparável.
```

Por quê?

Porque `TreeSet` precisa ordenar.

Para ordenar, o Java precisa saber comparar os itens.

Vamos aprofundar bounded types na próxima aula.

Por enquanto, guarde:

```text
quando o método precisa ordenar T, T precisa ter algum contrato de comparação.
```

---

## App com ConjuntosGenericos

Crie:

```text
src\br\com\curso\aula174\app\ConjuntosGenericosApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.ConjuntosGenericos;

import java.util.List;
import java.util.Set;

public class ConjuntosGenericosApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Carlos", "Ana", "Carlos", "Mariana", "Ana");

        Set<String> unicosNaOrdem = ConjuntosGenericos.unicosNaOrdem(nomes);
        Set<String> unicosOrdenados = ConjuntosGenericos.unicosOrdenados(nomes);

        System.out.println("Únicos na ordem:");
        for (String nome : unicosNaOrdem) {
            System.out.println("- " + nome);
        }

        System.out.println();
        System.out.println("Únicos ordenados:");
        for (String nome : unicosOrdenados) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.ConjuntosGenericosApp
```

---

## Detalhe profissional sobre cópia e ordem

Neste método:

```java
unicosNaOrdem
```

usamos:

```java
return new LinkedHashSet<>(resultado);
```

Por quê?

Porque a intenção é preservar ordem.

Se usássemos:

```java
Set.copyOf(resultado)
```

teríamos uma cópia não modificável, mas não deveríamos assumir preservação de ordem como intenção principal.

Regra importante:

```text
proteção de retorno e preservação de ordem são preocupações diferentes.
```

---

## Método genérico com Map

Crie:

```text
src\br\com\curso\aula174\util\MapasGenericos.java
```

Código:

```java
package br.com.curso.aula174.util;

import java.util.LinkedHashMap;
import java.util.Map;

public final class MapasGenericos {
    private MapasGenericos() {
    }

    public static <K, V> V buscarObrigatorio(Map<K, V> mapa, K chave) {
        if (mapa == null) {
            throw new IllegalArgumentException("Mapa é obrigatório.");
        }

        if (chave == null) {
            throw new IllegalArgumentException("Chave é obrigatória.");
        }

        V valor = mapa.get(chave);

        if (valor == null) {
            throw new IllegalArgumentException("Valor não encontrado para chave: " + chave);
        }

        return valor;
    }

    public static <K, V> Map<K, V> copiaNaOrdem(Map<K, V> mapa) {
        if (mapa == null) {
            throw new IllegalArgumentException("Mapa é obrigatório.");
        }

        return new LinkedHashMap<>(mapa);
    }
}
```

---

## Como ler `<K, V>`

```java
public static <K, V> V buscarObrigatorio(Map<K, V> mapa, K chave)
```

Significa:

```text
K é o tipo da chave;
V é o tipo do valor;
o método recebe Map<K, V>;
recebe uma chave K;
retorna um valor V.
```

Esse método funciona com:

```text
Map<String, Integer>;
Map<CodigoOs, OrdemServico>;
Map<Long, Cliente>.
```

---

## App com MapasGenericos

Crie:

```text
src\br\com\curso\aula174\app\MapasGenericosApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.MapasGenericos;

import java.util.LinkedHashMap;
import java.util.Map;

public class MapasGenericosApp {
    public static void main(String[] args) {
        Map<String, Integer> contagemPorStatus = new LinkedHashMap<>();

        contagemPorStatus.put("CADASTRADA", 2);
        contagemPorStatus.put("CONCLUIDA", 5);
        contagemPorStatus.put("CANCELADA", 1);

        Integer concluidas = MapasGenericos.buscarObrigatorio(contagemPorStatus, "CONCLUIDA");

        System.out.println("Concluídas: " + concluidas);

        Map<String, Integer> copia = MapasGenericos.copiaNaOrdem(contagemPorStatus);

        System.out.println();
        System.out.println("Cópia:");

        for (Map.Entry<String, Integer> entrada : copia.entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.MapasGenericosApp
```

---

## Interface funcional genérica simples

Agora vamos criar uma interface que transforma um tipo em outro.

Crie:

```text
src\br\com\curso\aula174\util\ConversorFuncional.java
```

Código:

```java
package br.com.curso.aula174.util;

public interface ConversorFuncional<E, S> {
    S converter(E entrada);
}
```

Como ler:

```text
E = entrada;
S = saída.
```

Exemplos:

```text
String -> Integer;
OrdemServico -> String;
Entidade -> DTO;
Request -> Command.
```

---

## Transformador genérico

Crie:

```text
src\br\com\curso\aula174\util\TransformadorGenerico.java
```

Código:

```java
package br.com.curso.aula174.util;

import java.util.ArrayList;
import java.util.List;

public final class TransformadorGenerico {
    private TransformadorGenerico() {
    }

    public static <E, S> List<S> transformar(
            List<E> entradas,
            ConversorFuncional<E, S> conversor
    ) {
        if (entradas == null) {
            throw new IllegalArgumentException("Entradas são obrigatórias.");
        }

        if (conversor == null) {
            throw new IllegalArgumentException("Conversor é obrigatório.");
        }

        List<S> saidas = new ArrayList<>();

        for (E entrada : entradas) {
            saidas.add(conversor.converter(entrada));
        }

        return List.copyOf(saidas);
    }
}
```

---

## Como ler transformar

```java
public static <E, S> List<S> transformar(...)
```

Significa:

```text
recebe uma lista de E;
usa um conversor de E para S;
retorna uma lista de S.
```

Esse padrão prepara para:

```text
mapper;
DTO;
response;
request;
command;
conversão entre camadas.
```

---

## App transformando String em Integer

Crie:

```text
src\br\com\curso\aula174\app\TransformadorStringIntegerApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.TransformadorGenerico;

import java.util.List;

public class TransformadorStringIntegerApp {
    public static void main(String[] args) {
        List<String> textos = List.of("10", "20", "30");

        List<Integer> numeros = TransformadorGenerico.transformar(
                textos,
                texto -> Integer.valueOf(texto.trim())
        );

        System.out.println("Números convertidos:");

        for (Integer numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.TransformadorStringIntegerApp
```

---

## Domínio para exemplo de transformação

Crie:

```text
src\br\com\curso\aula174\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula174.dominio.valor;

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
src\br\com\curso\aula174\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula174.dominio.ordemservico;

public enum StatusOs {
    CADASTRADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula174\dominio\ordemservico\OrdemServicoMetodoGenerico.java
```

Código:

```java
package br.com.curso.aula174.dominio.ordemservico;

import br.com.curso.aula174.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoMetodoGenerico {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;
    private final StatusOs status;

    public OrdemServicoMetodoGenerico(
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

    public String cliente() {
        return cliente;
    }

    public LocalDate dataEntrada() {
        return dataEntrada;
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

## Transformando OS em resumo

Crie:

```text
src\br\com\curso\aula174\app\TransformadorOsResumoApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.dominio.ordemservico.OrdemServicoMetodoGenerico;
import br.com.curso.aula174.dominio.ordemservico.StatusOs;
import br.com.curso.aula174.dominio.valor.CodigoOs;
import br.com.curso.aula174.util.TransformadorGenerico;

import java.time.LocalDate;
import java.util.List;

public class TransformadorOsResumoApp {
    public static void main(String[] args) {
        List<OrdemServicoMetodoGenerico> ordens = List.of(
                new OrdemServicoMetodoGenerico(
                        new CodigoOs("OS-2026-0001"),
                        "Ana Silva",
                        LocalDate.of(2026, 12, 10),
                        StatusOs.CADASTRADA
                ),
                new OrdemServicoMetodoGenerico(
                        new CodigoOs("OS-2026-0002"),
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        StatusOs.CONCLUIDA
                )
        );

        List<String> resumos = TransformadorGenerico.transformar(
                ordens,
                OrdemServicoMetodoGenerico::resumo
        );

        System.out.println("Resumos:");

        for (String resumo : resumos) {
            System.out.println("- " + resumo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.TransformadorOsResumoApp
```

---

## Método genérico de instância

Métodos genéricos também podem ser métodos de instância.

Crie:

```text
src\br\com\curso\aula174\util\ImpressoraGenerica.java
```

Código:

```java
package br.com.curso.aula174.util;

import java.util.List;

public class ImpressoraGenerica {
    public <T> void imprimirLista(String titulo, List<T> itens) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        System.out.println(titulo + ":");

        for (T item : itens) {
            System.out.println("- " + item);
        }
    }

    public <T> void imprimirValor(String rotulo, T valor) {
        if (rotulo == null || rotulo.isBlank()) {
            throw new IllegalArgumentException("Rótulo é obrigatório.");
        }

        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        System.out.println(rotulo + ": " + valor);
    }
}
```

Crie:

```text
src\br\com\curso\aula174\app\MetodoGenericoInstanciaApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.ImpressoraGenerica;

import java.util.List;

public class MetodoGenericoInstanciaApp {
    public static void main(String[] args) {
        ImpressoraGenerica impressora = new ImpressoraGenerica();

        impressora.imprimirLista("Nomes", List.of("Ana", "Carlos", "Mariana"));

        System.out.println();

        impressora.imprimirLista("Números", List.of(10, 20, 30));

        System.out.println();

        impressora.imprimirValor("Status", "CONCLUIDA");
        impressora.imprimirValor("Quantidade", 5);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.MetodoGenericoInstanciaApp
```

---

## Classe genérica com método genérico diferente

Crie:

```text
src\br\com\curso\aula174\util\CaixaComConversao.java
```

Código:

```java
package br.com.curso.aula174.util;

public class CaixaComConversao<T> {
    private final T valor;

    public CaixaComConversao(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor;
    }

    public T valor() {
        return valor;
    }

    public <R> R converter(ConversorFuncional<T, R> conversor) {
        if (conversor == null) {
            throw new IllegalArgumentException("Conversor é obrigatório.");
        }

        return conversor.converter(valor);
    }
}
```

Crie:

```text
src\br\com\curso\aula174\app\CaixaComConversaoApp.java
```

Código:

```java
package br.com.curso.aula174.app;

import br.com.curso.aula174.util.CaixaComConversao;

public class CaixaComConversaoApp {
    public static void main(String[] args) {
        CaixaComConversao<String> caixa = new CaixaComConversao<>("123");

        Integer numero = caixa.converter(texto -> Integer.valueOf(texto.trim()));
        String textoFormatado = caixa.converter(texto -> "Valor recebido: " + texto);

        System.out.println("Número: " + numero);
        System.out.println("Número dobrado: " + (numero * 2));
        System.out.println(textoFormatado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula174.app.CaixaComConversaoApp
```

---

## Diferença entre T e R

Neste exemplo:

```java
CaixaComConversao<String>
```

Então:

```text
T = String
```

No método:

```java
Integer numero = caixa.converter(...)
```

Então:

```text
R = Integer
```

No outro método:

```java
String textoFormatado = caixa.converter(...)
```

Então:

```text
R = String
```

A classe guarda um tipo.

O método pode retornar outro.

---

## Quando criar método genérico

Crie método genérico quando:

```text
o comportamento é igual para vários tipos;
o tipo de entrada ou saída muda;
você quer evitar Object;
você quer evitar cast;
você quer preservar o tipo recebido;
você quer criar utilitário seguro.
```

Exemplos bons:

```text
primeiro item de uma lista;
último item de uma lista;
cópia protegida;
busca obrigatória em Map;
transformação de lista;
criação de resultado;
agrupamento genérico.
```

---

## Quando não criar método genérico

Evite quando:

```text
o método depende de comportamento específico do tipo;
o tipo genérico deixa o código mais confuso;
você precisa acessar métodos que T não garante;
você está escondendo regra de negócio;
o método só serve para uma classe.
```

Exemplo ruim:

```java
public static <T> void concluir(T objeto)
```

Se apenas `OrdemServico` pode ser concluída, isso não deveria ser genérico.

Generics não substituem modelagem.

---

## O problema de tentar chamar método específico em T

Imagine:

```java
public static <T> void imprimirCodigo(T item) {
    System.out.println(item.codigo());
}
```

Isso não compila.

Por quê?

Porque o compilador não sabe se todo `T` tem método `codigo()`.

Para resolver isso, no futuro usaremos:

```text
bounded types;
interfaces;
extends.
```

Exemplo futuro:

```java
public static <T extends PossuiCodigo> void imprimirCodigo(T item)
```

Esse é o próximo passo natural.

---

## Ligação com backend

Métodos genéricos aparecem em backend em vários pontos:

```text
mapper genérico;
conversor de lista;
resposta padronizada;
busca obrigatória;
validação reutilizável;
paginação;
tratamento de erro;
factory de response;
helpers de teste;
asserts genéricos.
```

Exemplo conceitual:

```java
public static <T> ApiResponse<T> sucesso(T dados)
```

Outro exemplo:

```java
public static <E, S> List<S> converterLista(List<E> entrada, Mapper<E, S> mapper)
```

Quando chegarmos em APIs, DTOs e services, isso será aprofundado.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Listas

Execute:

```powershell
java -cp out br.com.curso.aula174.app.ListasGenericasApp
```

### Parte 2 — Set e Map

Execute:

```powershell
java -cp out br.com.curso.aula174.app.ConjuntosGenericosApp
java -cp out br.com.curso.aula174.app.MapasGenericosApp
```

### Parte 3 — Transformação

Execute:

```powershell
java -cp out br.com.curso.aula174.app.TransformadorStringIntegerApp
java -cp out br.com.curso.aula174.app.TransformadorOsResumoApp
```

### Parte 4 — Instância e conversão

Execute:

```powershell
java -cp out br.com.curso.aula174.app.MetodoGenericoInstanciaApp
java -cp out br.com.curso.aula174.app.CaixaComConversaoApp
```

---

## Desafio prático

Crie uma classe:

```text
src\br\com\curso\aula174\util\ResultadosGenericos.java
```

Ela deve ter métodos estáticos genéricos:

```text
sucesso(T valor);
falha(String mensagem);
```

Crie também uma classe interna ou separada:

```text
Resultado<T>
```

Campos:

```text
boolean sucesso;
String mensagem;
T valor;
```

Regras:

```text
sucesso exige valor não nulo;
falha exige mensagem;
falha não tem valor;
valor() em falha deve lançar IllegalStateException.
```

Depois crie:

```text
src\br\com\curso\aula174\app\ResultadosGenericosApp.java
```

Use com:

```text
Resultado<String>;
Resultado<Integer>;
Resultado<OrdemServicoMetodoGenerico>.
```

Critério principal:

```text
não usar Object;
não fazer cast.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula174\util\AgrupadorGenerico.java
```

Ela deve ter um método:

```java
public static <K, V> Map<K, List<V>> agrupar(
        List<V> itens,
        ConversorFuncional<V, K> extratorChave
)
```

Regras:

```text
itens não pode ser null;
extratorChave não pode ser null;
se chave extraída for null, lançar erro;
usar LinkedHashMap para preservar ordem das chaves;
proteger listas internas com List.copyOf.
```

Depois crie:

```text
src\br\com\curso\aula174\app\AgrupadorGenericoApp.java
```

Use para agrupar:

```text
List<OrdemServicoMetodoGenerico> por StatusOs.
```

Critério principal:

```text
usar método genérico com K e V de forma clara.
```

---

## Erros comuns nesta aula

### 1. Esquecer `<T>` antes do retorno

Errado:

```java
public static T primeiro(List<T> itens)
```

Certo:

```java
public static <T> T primeiro(List<T> itens)
```

### 2. Usar Object dentro de método genérico

Se o método é genérico, use o tipo genérico.

### 3. Criar método genérico sem necessidade

Se o método só serve para `OrdemServico`, ele provavelmente não precisa ser genérico.

### 4. Tentar chamar método específico em T sem limite

`T` puro não garante métodos como `codigo()`.

### 5. Confundir tipo da classe com tipo do método

Uma classe pode ter `T` e um método pode ter `R`.

### 6. Não validar null

Generics não impedem `null`.

### 7. Retornar coleção interna mutável

Mesmo em utilitários genéricos, proteja retornos quando necessário.

---

## Debug recomendado

Use debug em:

```text
ListasGenericas.java
ConjuntosGenericos.java
MapasGenericos.java
TransformadorGenerico.java
ImpressoraGenerica.java
CaixaComConversao.java
TransformadorOsResumoApp.java
```

Breakpoints recomendados:

```java
primeiro(...)

ultimo(...)

copiaProtegida(...)

resultado.add(item)

new TreeSet<>()

buscarObrigatorio(...)

conversor.converter(...)

saidas.add(...)

imprimirLista(...)

converter(...)
```

Observe:

```text
como T muda conforme a chamada;
como K e V mudam no Map;
como E vira S no transformador;
como uma classe com T pode ter método com R;
como a inferência de tipo reduz código repetido;
como a validação ainda é necessária.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Onde fica o <T> em um método genérico?
2. Qual a diferença entre <T> da classe e <R> do método?
3. Por que buscarObrigatorio usa <K, V>?
4. Por que transformar usa <E, S>?
5. Quando um método genérico pode atrapalhar?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar método genérico estático;
criar método genérico de instância;
usar <T> antes do retorno;
usar <K, V>;
usar <E, S>;
usar <R>;
usar inferência de tipo;
criar utilitário genérico de List;
criar utilitário genérico de Set;
criar utilitário genérico de Map;
criar transformador genérico;
usar interface funcional genérica simples;
diferenciar tipo da classe e tipo do método;
entender limite inicial com Comparable;
evitar Object e cast;
resolver ResultadosGenericosApp;
resolver AgrupadorGenericoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-174-metodos-genericos
git commit -m "Aula 174: metodos genericos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
métodos genéricos permitem reutilizar comportamento preservando o tipo recebido e retornado.
```

Você estudou:

```text
<T>;
<K, V>;
<E, S>;
<R>;
métodos estáticos;
métodos de instância;
transformação de listas;
busca em Map;
cópias genéricas;
classe genérica com método genérico.
```

Também viu um ponto importante:

```text
T puro não garante comportamento específico.
```

Na próxima aula, vamos estudar `bounded types`.

Vamos aprender como dizer ao Java:

```text
este T pode ser genérico,
mas precisa implementar uma interface,
ou precisa estender uma classe,
ou precisa ser comparável.
```

Isso permitirá escrever métodos genéricos mais poderosos e seguros.
