# 177 — M6.06 — PECS: Producer Extends, Consumer Super

## Objetivo da aula

Nesta aula você vai aprofundar a regra mais importante para entender wildcards em Java:

```text
PECS
```

PECS significa:

```text
Producer Extends, Consumer Super
```

Em português:

```text
Produtor usa extends.
Consumidor usa super.
```

Na aula anterior, você viu:

```java
List<?>
List<? extends Number>
List<? super Integer>
```

Agora vamos consolidar isso com exemplos mais próximos de backend:

```text
listas de entidades;
listas de responses;
mappers;
copiadores;
validadores;
coletores;
relatórios;
filas de processamento.
```

Ao final desta aula, você deve conseguir:

```text
explicar PECS com clareza;
identificar quando uma estrutura é produtora;
identificar quando uma estrutura é consumidora;
usar ? extends T para leitura;
usar ? super T para escrita;
saber quando usar <T> em vez de wildcard;
criar método copiador flexível;
criar método mapper flexível;
criar coletor genérico;
evitar casts;
evitar assinaturas genéricas confusas;
entender como PECS aparece em Collections, Comparator e APIs Java.
```

---

## Ideia principal

Quando um método recebe uma coleção, pergunte:

```text
eu vou ler itens dela?
eu vou adicionar itens nela?
eu vou fazer os dois?
```

Se você vai apenas ler:

```text
a coleção é produtora.
```

Use:

```java
? extends T
```

Se você vai adicionar itens:

```text
a coleção é consumidora.
```

Use:

```java
? super T
```

Se você precisa ler e escrever exatamente o mesmo tipo, talvez use:

```java
<T>
```

---

## PECS em uma frase

A frase que você deve memorizar é:

```text
Producer Extends, Consumer Super.
```

Ou:

```text
quem produz para leitura usa extends;
quem consome/adiciona usa super.
```

Exemplo clássico:

```java
public static <T> void copiar(
        List<? extends T> origem,
        List<? super T> destino
)
```

A origem produz itens.

O destino consome itens.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-177-pecs-producer-extends-consumer-super
cd labs\m6\aula-177-pecs-producer-extends-consumer-super
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula177
mkdir src\br\com\curso\aula177\app
mkdir src\br\com\curso\aula177\dominio
mkdir src\br\com\curso\aula177\dominio\valor
mkdir src\br\com\curso\aula177\dominio\atendimento
mkdir src\br\com\curso\aula177\dominio\response
mkdir src\br\com\curso\aula177\util
```

---

## Revisão rápida: por que List<Integer> não é List<Number>

Isto funciona:

```java
Number numero = Integer.valueOf(10);
```

Mas isto não funciona:

```java
List<Number> numeros = new ArrayList<Integer>();
```

Motivo:

```text
se fosse permitido,
uma lista real de Integer poderia receber Double.
```

Exemplo perigoso:

```java
List<Integer> inteiros = new ArrayList<>();
List<Number> numeros = inteiros;
numeros.add(10.5);
```

O Java não permite isso.

Generics são invariantes.

Wildcards resolvem flexibilidade com segurança.

---

## Exemplo 1 — Producer Extends

Crie:

```text
src\br\com\curso\aula177\util\LeitorNumerico.java
```

Código:

```java
package br.com.curso.aula177.util;

import java.util.List;

public final class LeitorNumerico {
    private LeitorNumerico() {
    }

    public static double somar(List<? extends Number> numeros) {
        if (numeros == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        double total = 0.0;

        for (Number numero : numeros) {
            if (numero == null) {
                throw new IllegalArgumentException("Número nulo não é permitido.");
            }

            total += numero.doubleValue();
        }

        return total;
    }

    public static void imprimir(List<? extends Number> numeros) {
        if (numeros == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        for (Number numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

---

## App Producer Extends

Crie:

```text
src\br\com\curso\aula177\app\ProducerExtendsNumericoApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.util.LeitorNumerico;

import java.math.BigDecimal;
import java.util.List;

public class ProducerExtendsNumericoApp {
    public static void main(String[] args) {
        List<Integer> inteiros = List.of(10, 20, 30);
        List<Double> decimais = List.of(10.5, 20.5, 30.5);
        List<BigDecimal> valores = List.of(
                new BigDecimal("15.25"),
                new BigDecimal("30.75")
        );

        System.out.println("Soma inteiros: " + LeitorNumerico.somar(inteiros));
        System.out.println("Soma decimais: " + LeitorNumerico.somar(decimais));
        System.out.println("Soma BigDecimal: " + LeitorNumerico.somar(valores));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.ProducerExtendsNumericoApp
```

---

## Por que esse método usa extends

O método lê números da lista.

A lista produz valores para o método.

Então usamos:

```java
List<? extends Number>
```

Isso permite receber:

```text
List<Integer>;
List<Double>;
List<Long>;
List<BigDecimal>;
List<Number>.
```

Mas o método não adiciona elementos.

Ele só lê.

---

## Exemplo 2 — Consumer Super

Crie:

```text
src\br\com\curso\aula177\util\EscritorNumerico.java
```

Código:

```java
package br.com.curso.aula177.util;

import java.util.List;

public final class EscritorNumerico {
    private EscritorNumerico() {
    }

    public static void adicionarInteirosPadrao(List<? super Integer> destino) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        destino.add(10);
        destino.add(20);
        destino.add(30);
    }
}
```

---

## App Consumer Super

Crie:

```text
src\br\com\curso\aula177\app\ConsumerSuperNumericoApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.util.EscritorNumerico;

import java.util.ArrayList;
import java.util.List;

public class ConsumerSuperNumericoApp {
    public static void main(String[] args) {
        List<Integer> inteiros = new ArrayList<>();
        List<Number> numeros = new ArrayList<>();
        List<Object> objetos = new ArrayList<>();

        EscritorNumerico.adicionarInteirosPadrao(inteiros);
        EscritorNumerico.adicionarInteirosPadrao(numeros);
        EscritorNumerico.adicionarInteirosPadrao(objetos);

        System.out.println("Inteiros: " + inteiros);
        System.out.println("Números: " + numeros);
        System.out.println("Objetos: " + objetos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.ConsumerSuperNumericoApp
```

---

## Por que esse método usa super

O método adiciona `Integer`.

O destino consome valores `Integer`.

Então usamos:

```java
List<? super Integer>
```

Isso permite:

```text
List<Integer>;
List<Number>;
List<Object>.
```

Todos conseguem receber um `Integer`.

---

## Exemplo 3 — Copiador com PECS

Crie:

```text
src\br\com\curso\aula177\util\CopiadorPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

import java.util.List;

public final class CopiadorPecs {
    private CopiadorPecs() {
    }

    public static <T> void copiar(
            List<? extends T> origem,
            List<? super T> destino
    ) {
        if (origem == null) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        for (T item : origem) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            destino.add(item);
        }
    }
}
```

---

## App Copiador PECS

Crie:

```text
src\br\com\curso\aula177\app\CopiadorPecsApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.util.CopiadorPecs;

import java.util.ArrayList;
import java.util.List;

public class CopiadorPecsApp {
    public static void main(String[] args) {
        List<Integer> origemInteiros = List.of(1, 2, 3);

        List<Integer> destinoInteiros = new ArrayList<>();
        List<Number> destinoNumeros = new ArrayList<>();
        List<Object> destinoObjetos = new ArrayList<>();

        CopiadorPecs.copiar(origemInteiros, destinoInteiros);
        CopiadorPecs.copiar(origemInteiros, destinoNumeros);
        CopiadorPecs.copiar(origemInteiros, destinoObjetos);

        System.out.println("Destino Integer: " + destinoInteiros);
        System.out.println("Destino Number: " + destinoNumeros);
        System.out.println("Destino Object: " + destinoObjetos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.CopiadorPecsApp
```

---

## Domínio para exemplos de backend

Crie:

```text
src\br\com\curso\aula177\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula177.dominio.valor;

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
src\br\com\curso\aula177\dominio\atendimento\Atendimento.java
```

Código:

```java
package br.com.curso.aula177.dominio.atendimento;

import br.com.curso.aula177.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class Atendimento {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;

    public Atendimento(CodigoOs codigo, String cliente, LocalDate dataEntrada) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
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

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

Crie:

```text
src\br\com\curso\aula177\dominio\atendimento\AtendimentoCritico.java
```

Código:

```java
package br.com.curso.aula177.dominio.atendimento;

import br.com.curso.aula177.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class AtendimentoCritico extends Atendimento {
    private final String motivoCriticidade;

    public AtendimentoCritico(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            String motivoCriticidade
    ) {
        super(codigo, cliente, dataEntrada);

        if (motivoCriticidade == null || motivoCriticidade.isBlank()) {
            throw new IllegalArgumentException("Motivo de criticidade é obrigatório.");
        }

        this.motivoCriticidade = motivoCriticidade.trim();
    }

    public String motivoCriticidade() {
        return motivoCriticidade;
    }

    @Override
    public String resumo() {
        return super.resumo() + " | Crítico: " + motivoCriticidade;
    }
}
```

Crie:

```text
src\br\com\curso\aula177\dominio\atendimento\AtendimentoVip.java
```

Código:

```java
package br.com.curso.aula177.dominio.atendimento;

import br.com.curso.aula177.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class AtendimentoVip extends Atendimento {
    private final String consultorResponsavel;

    public AtendimentoVip(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            String consultorResponsavel
    ) {
        super(codigo, cliente, dataEntrada);

        if (consultorResponsavel == null || consultorResponsavel.isBlank()) {
            throw new IllegalArgumentException("Consultor responsável é obrigatório.");
        }

        this.consultorResponsavel = consultorResponsavel.trim();
    }

    @Override
    public String resumo() {
        return super.resumo() + " | Consultor: " + consultorResponsavel;
    }
}
```

---

## Relatório usando Producer Extends

Crie:

```text
src\br\com\curso\aula177\util\RelatorioAtendimentoPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

import br.com.curso.aula177.dominio.atendimento.Atendimento;

import java.util.List;

public final class RelatorioAtendimentoPecs {
    private RelatorioAtendimentoPecs() {
    }

    public static void imprimir(String titulo, List<? extends Atendimento> atendimentos) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (atendimentos == null) {
            throw new IllegalArgumentException("Atendimentos são obrigatórios.");
        }

        System.out.println(titulo + ":");
        System.out.println("Quantidade: " + atendimentos.size());

        for (Atendimento atendimento : atendimentos) {
            System.out.println("- " + atendimento.resumo());
        }
    }
}
```

---

## App Relatório PECS

Crie:

```text
src\br\com\curso\aula177\app\RelatorioAtendimentoPecsApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.dominio.atendimento.Atendimento;
import br.com.curso.aula177.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula177.dominio.atendimento.AtendimentoVip;
import br.com.curso.aula177.dominio.valor.CodigoOs;
import br.com.curso.aula177.util.RelatorioAtendimentoPecs;

import java.time.LocalDate;
import java.util.List;

public class RelatorioAtendimentoPecsApp {
    public static void main(String[] args) {
        List<Atendimento> comuns = List.of(
                new Atendimento(
                        new CodigoOs("OS-2026-0001"),
                        "Ana Silva",
                        LocalDate.of(2026, 12, 10)
                )
        );

        List<AtendimentoCritico> criticos = List.of(
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0002"),
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        "Cliente sem retorno há 48h"
                )
        );

        List<AtendimentoVip> vips = List.of(
                new AtendimentoVip(
                        new CodigoOs("OS-2026-0003"),
                        "Empresa VIP",
                        LocalDate.of(2026, 12, 12),
                        "Juliana"
                )
        );

        RelatorioAtendimentoPecs.imprimir("Comuns", comuns);

        System.out.println();

        RelatorioAtendimentoPecs.imprimir("Críticos", criticos);

        System.out.println();

        RelatorioAtendimentoPecs.imprimir("VIPs", vips);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.RelatorioAtendimentoPecsApp
```

---

## Por que o relatório usa extends

O relatório só lê os atendimentos.

Ele não adiciona nada na lista.

Então a lista é produtora:

```java
List<? extends Atendimento>
```

Isso deixa o método flexível para receber listas de subtipos.

---

## Fila usando Consumer Super

Crie:

```text
src\br\com\curso\aula177\util\FilaAtendimentoPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

import br.com.curso.aula177.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula177.dominio.atendimento.AtendimentoVip;
import br.com.curso.aula177.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.List;

public final class FilaAtendimentoPecs {
    private FilaAtendimentoPecs() {
    }

    public static void adicionarCriticos(List<? super AtendimentoCritico> destino) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        destino.add(new AtendimentoCritico(
                new CodigoOs("OS-2026-9001"),
                "Cliente Crítico A",
                LocalDate.of(2026, 12, 10),
                "Sem atendimento há mais de 48h"
        ));

        destino.add(new AtendimentoCritico(
                new CodigoOs("OS-2026-9002"),
                "Cliente Crítico B",
                LocalDate.of(2026, 12, 11),
                "Reincidência de falha"
        ));
    }

    public static void adicionarVips(List<? super AtendimentoVip> destino) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        destino.add(new AtendimentoVip(
                new CodigoOs("OS-2026-8001"),
                "Cliente VIP A",
                LocalDate.of(2026, 12, 12),
                "Mariana"
        ));
    }
}
```

---

## App Fila PECS

Crie:

```text
src\br\com\curso\aula177\app\FilaAtendimentoPecsApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.dominio.atendimento.Atendimento;
import br.com.curso.aula177.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula177.dominio.atendimento.AtendimentoVip;
import br.com.curso.aula177.util.FilaAtendimentoPecs;

import java.util.ArrayList;
import java.util.List;

public class FilaAtendimentoPecsApp {
    public static void main(String[] args) {
        List<AtendimentoCritico> filaCriticos = new ArrayList<>();
        List<AtendimentoVip> filaVips = new ArrayList<>();
        List<Atendimento> filaAtendimentos = new ArrayList<>();
        List<Object> filaObjetos = new ArrayList<>();

        FilaAtendimentoPecs.adicionarCriticos(filaCriticos);
        FilaAtendimentoPecs.adicionarCriticos(filaAtendimentos);
        FilaAtendimentoPecs.adicionarCriticos(filaObjetos);

        FilaAtendimentoPecs.adicionarVips(filaVips);
        FilaAtendimentoPecs.adicionarVips(filaAtendimentos);
        FilaAtendimentoPecs.adicionarVips(filaObjetos);

        System.out.println("Fila críticos: " + filaCriticos.size());
        System.out.println("Fila VIPs: " + filaVips.size());
        System.out.println("Fila atendimentos: " + filaAtendimentos.size());
        System.out.println("Fila objetos: " + filaObjetos.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.FilaAtendimentoPecsApp
```

---

## Mapper com PECS

Crie:

```text
src\br\com\curso\aula177\dominio\response\AtendimentoResumoResponse.java
```

Código:

```java
package br.com.curso.aula177.dominio.response;

public class AtendimentoResumoResponse {
    private final String codigo;
    private final String cliente;
    private final String descricao;

    public AtendimentoResumoResponse(String codigo, String cliente, String descricao) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        this.codigo = codigo.trim();
        this.cliente = cliente.trim();
        this.descricao = descricao.trim();
    }

    public String resumo() {
        return codigo + " | Cliente: " + cliente + " | " + descricao;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

Crie:

```text
src\br\com\curso\aula177\util\MapperPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

public interface MapperPecs<E, S> {
    S converter(E entrada);
}
```

Crie:

```text
src\br\com\curso\aula177\util\MapperListaPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

import java.util.ArrayList;
import java.util.List;

public final class MapperListaPecs {
    private MapperListaPecs() {
    }

    public static <E, S> List<S> converter(
            List<? extends E> entradas,
            MapperPecs<? super E, ? extends S> mapper
    ) {
        if (entradas == null) {
            throw new IllegalArgumentException("Entradas são obrigatórias.");
        }

        if (mapper == null) {
            throw new IllegalArgumentException("Mapper é obrigatório.");
        }

        List<S> saidas = new ArrayList<>();

        for (E entrada : entradas) {
            if (entrada == null) {
                throw new IllegalArgumentException("Entrada nula não é permitida.");
            }

            S saida = mapper.converter(entrada);

            if (saida == null) {
                throw new IllegalArgumentException("Saída nula não é permitida.");
            }

            saidas.add(saida);
        }

        return List.copyOf(saidas);
    }
}
```

---

## App Mapper PECS

Crie:

```text
src\br\com\curso\aula177\app\MapperListaPecsApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.dominio.atendimento.Atendimento;
import br.com.curso.aula177.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula177.dominio.response.AtendimentoResumoResponse;
import br.com.curso.aula177.dominio.valor.CodigoOs;
import br.com.curso.aula177.util.MapperListaPecs;

import java.time.LocalDate;
import java.util.List;

public class MapperListaPecsApp {
    public static void main(String[] args) {
        List<AtendimentoCritico> criticos = List.of(
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0001"),
                        "Ana Silva",
                        LocalDate.of(2026, 12, 10),
                        "Sem retorno"
                ),
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0002"),
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        "Reincidência"
                )
        );

        List<AtendimentoResumoResponse> responses = MapperListaPecs.converter(
                criticos,
                MapperListaPecsApp::paraResponse
        );

        System.out.println("Responses:");

        for (AtendimentoResumoResponse response : responses) {
            System.out.println("- " + response.resumo());
        }
    }

    private static AtendimentoResumoResponse paraResponse(Atendimento atendimento) {
        return new AtendimentoResumoResponse(
                atendimento.codigo().resumo(),
                atendimento.cliente(),
                atendimento.resumo()
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.MapperListaPecsApp
```

---

## Comparator e super

Você verá muito em Java:

```java
Comparator<? super T>
```

Por quê?

Porque um comparador de um supertipo também consegue comparar subtipos.

Exemplo:

```text
Comparator<Atendimento>
```

pode comparar:

```text
AtendimentoCritico;
AtendimentoVip.
```

Crie:

```text
src\br\com\curso\aula177\util\OrdenadorPecs.java
```

Código:

```java
package br.com.curso.aula177.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public final class OrdenadorPecs {
    private OrdenadorPecs() {
    }

    public static <T> List<T> ordenar(
            List<T> itens,
            Comparator<? super T> comparator
    ) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (comparator == null) {
            throw new IllegalArgumentException("Comparator é obrigatório.");
        }

        List<T> copia = new ArrayList<>(itens);
        copia.sort(comparator);

        return List.copyOf(copia);
    }
}
```

Crie:

```text
src\br\com\curso\aula177\app\OrdenadorPecsApp.java
```

Código:

```java
package br.com.curso.aula177.app;

import br.com.curso.aula177.dominio.atendimento.Atendimento;
import br.com.curso.aula177.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula177.dominio.valor.CodigoOs;
import br.com.curso.aula177.util.OrdenadorPecs;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public class OrdenadorPecsApp {
    public static void main(String[] args) {
        List<AtendimentoCritico> criticos = List.of(
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0003"),
                        "Mariana",
                        LocalDate.of(2026, 12, 12),
                        "Reincidência"
                ),
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0001"),
                        "Ana",
                        LocalDate.of(2026, 12, 10),
                        "Sem retorno"
                )
        );

        Comparator<Atendimento> porCodigo = Comparator.comparing(Atendimento::codigo);

        List<AtendimentoCritico> ordenados = OrdenadorPecs.ordenar(criticos, porCodigo);

        System.out.println("Ordenados:");

        for (AtendimentoCritico atendimento : ordenados) {
            System.out.println("- " + atendimento.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula177.app.OrdenadorPecsApp
```

---

## Decisão prática: T ou wildcard?

Use `<T>` quando:

```text
precisa retornar o mesmo tipo;
precisa relacionar tipos entre parâmetros;
precisa preservar o tipo exato;
a assinatura simples resolve.
```

Use `? extends T` quando:

```text
vai ler de uma fonte;
quer aceitar subtipos;
não vai adicionar na fonte.
```

Use `? super T` quando:

```text
vai adicionar em um destino;
quer aceitar supertipos;
a estrutura consome itens.
```

---

## Tabela mental PECS

```text
Quero imprimir uma lista de qualquer coisa:
List<?>

Quero somar uma lista de números:
List<? extends Number>

Quero adicionar Integer em uma lista:
List<? super Integer>

Quero copiar origem para destino:
origem: List<? extends T>
destino: List<? super T>

Quero ordenar usando Comparator:
Comparator<? super T>

Quero retornar primeiro item mantendo tipo:
<T> T primeiro(List<T> itens)

Quero transformar lista de entrada em saída:
<E, S> List<S> converter(List<? extends E>, Mapper<? super E, ? extends S>)
```

---

## Quando PECS fica exagerado

PECS é importante, mas não transforme todo método simples em uma assinatura difícil.

Exemplo simples:

```java
public static <T> T primeiro(List<T> itens)
```

Não precisa virar:

```java
public static <T> T primeiro(List<? extends T> itens)
```

A versão simples já resolve melhor.

Use PECS quando precisa da flexibilidade.

Não use por enfeite.

---

## Ligação com arquitetura backend

PECS aparece menos no domínio direto e mais em utilitários, bibliotecas e APIs.

Você tende a usar PECS em:

```text
mappers genéricos;
coletores;
copiadores;
ordenadores;
validadores;
handlers;
event publishers;
listas de DTOs;
helpers de teste;
bibliotecas internas.
```

No domínio, muitas vezes é melhor ser específico.

Exemplo:

```java
ordemServico.concluir()
```

não precisa de PECS.

Mas um utilitário de conversão de listas pode se beneficiar.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Números

Execute:

```powershell
java -cp out br.com.curso.aula177.app.ProducerExtendsNumericoApp
java -cp out br.com.curso.aula177.app.ConsumerSuperNumericoApp
java -cp out br.com.curso.aula177.app.CopiadorPecsApp
```

### Parte 2 — Atendimento

Execute:

```powershell
java -cp out br.com.curso.aula177.app.RelatorioAtendimentoPecsApp
java -cp out br.com.curso.aula177.app.FilaAtendimentoPecsApp
```

### Parte 3 — Mapper e Comparator

Execute:

```powershell
java -cp out br.com.curso.aula177.app.MapperListaPecsApp
java -cp out br.com.curso.aula177.app.OrdenadorPecsApp
```

---

## Desafio prático

Crie uma classe:

```text
src\br\com\curso\aula177\util\ColetorPecs.java
```

Método:

```java
public static <T> void coletarValidos(
        List<? extends T> origem,
        List<? super T> destino,
        ValidadorPecs<? super T> validador
)
```

Crie a interface:

```text
src\br\com\curso\aula177\util\ValidadorPecs.java
```

Método:

```java
boolean valido(T item);
```

Regras:

```text
origem não pode ser null;
destino não pode ser null;
validador não pode ser null;
item nulo não é permitido;
adicionar no destino apenas itens válidos.
```

Crie o app:

```text
src\br\com\curso\aula177\app\ColetorPecsApp.java
```

Use com:

```text
List<AtendimentoCritico> origem;
List<Atendimento> destino;
validador por dataEntrada.
```

Critério principal:

```text
origem produz;
destino consome;
validador aceita o tipo ou supertipo.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula177\util\PipelinePecs.java
```

Método:

```java
public static <E, S> void processar(
        List<? extends E> entradas,
        List<? super S> saidas,
        MapperPecs<? super E, ? extends S> mapper
)
```

Regras:

```text
entradas não pode ser null;
saidas não pode ser null;
mapper não pode ser null;
converter cada entrada;
adicionar cada saída no destino;
não permitir entrada nula;
não permitir saída nula.
```

Crie app:

```text
src\br\com\curso\aula177\app\PipelinePecsApp.java
```

Use:

```text
List<AtendimentoCritico>;
List<AtendimentoResumoResponse>;
mapper para response.
```

Critério principal:

```text
aplicar PECS nos dois lados do pipeline.
```

---

## Erros comuns nesta aula

### 1. Usar extends para adicionar

Errado:

```java
List<? extends Atendimento> lista
lista.add(new Atendimento(...))
```

`extends` é para leitura.

### 2. Usar super esperando leitura específica

Com `? super AtendimentoCritico`, leitura segura é `Object`.

### 3. Usar PECS em tudo

Nem todo método precisa disso.

### 4. Fazer cast para resolver erro de generics

Se precisou de cast, revise a assinatura.

### 5. Retornar wildcard sem necessidade

Wildcards são mais comuns em parâmetros.

### 6. Esquecer que Comparator usa super

Muitos métodos de ordenação usam:

```java
Comparator<? super T>
```

### 7. Criar assinatura ilegível

Flexibilidade demais pode piorar manutenção.

---

## Debug recomendado

Use debug em:

```text
LeitorNumerico.java
EscritorNumerico.java
CopiadorPecs.java
RelatorioAtendimentoPecs.java
FilaAtendimentoPecs.java
MapperListaPecs.java
OrdenadorPecs.java
```

Breakpoints recomendados:

```java
for (Number numero : numeros)

destino.add(...)

for (T item : origem)

atendimento.resumo()

mapper.converter(...)

copia.sort(comparator)
```

Observe:

```text
quem está produzindo;
quem está consumindo;
onde extends aparece;
onde super aparece;
como o mapper recebe entrada e produz saída;
por que Comparator<Atendimento> ordena List<AtendimentoCritico>.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa Producer Extends?
2. O que significa Consumer Super?
3. Por que origem do copiador usa ? extends T?
4. Por que destino do copiador usa ? super T?
5. Por que Comparator costuma usar ? super T?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar PECS;
identificar produtor;
identificar consumidor;
usar ? extends T para leitura;
usar ? super T para escrita;
criar copiador com PECS;
criar relatório com List<? extends Atendimento>;
criar fila com List<? super AtendimentoCritico>;
entender Comparator<? super T>;
criar mapper com PECS;
saber quando não usar PECS;
resolver ColetorPecsApp;
resolver PipelinePecsApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-177-pecs-producer-extends-consumer-super
git commit -m "Aula 177: pecs producer extends consumer super"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
PECS ajuda a decidir entre extends e super olhando o papel da coleção.
```

Se ela produz dados para leitura:

```text
extends.
```

Se ela consome dados adicionados:

```text
super.
```

Você praticou isso com:

```text
números;
copiadores;
atendimentos;
filas;
mappers;
comparators.
```

Na próxima aula, vamos estudar `type erasure`.

Vamos entender por que generics protegem em tempo de compilação, o que acontece em tempo de execução e quais limitações isso traz para Java profissional.
