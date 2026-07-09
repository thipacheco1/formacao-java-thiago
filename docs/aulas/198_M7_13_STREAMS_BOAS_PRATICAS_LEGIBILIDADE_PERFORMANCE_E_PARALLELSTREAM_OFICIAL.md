# 198 — M7.13 — Streams: boas práticas, legibilidade, performance e parallelStream

## Objetivo da aula

Na aula anterior, você estudou a integração entre:

```text
Streams;
Optional;
findFirst;
map;
filter;
orElse;
orElseGet;
orElseThrow;
Optional.stream;
flatMap(Optional::stream);
services de consulta seguros.
```

Agora vamos fechar a base profissional de Streams com um assunto essencial:

```text
boas práticas de uso.
```

Streams são poderosos, mas também podem deixar o código ruim quando usados sem critério.

Nesta aula você vai aprender:

```text
quando usar Stream;
quando usar for;
como manter pipelines legíveis;
como evitar lambdas gigantes;
como evitar efeitos colaterais;
como ordenar operações no pipeline;
como pensar em performance;
por que ter cuidado com parallelStream;
como quebrar pipelines complexos;
como usar métodos de domínio;
como criar services mais claros.
```

Ao final desta aula, você deve conseguir:

```text
decidir entre Stream e for;
identificar pipeline ilegível;
refatorar pipeline longo;
evitar forEach com efeito colateral perigoso;
usar nomes bons para predicates e mappers;
usar métodos de domínio dentro de streams;
entender custos de sorted, distinct, limit e skip;
entender lazy evaluation;
entender short-circuit;
entender por que parallelStream não é solução mágica;
saber quando stream em memória é inadequado;
criar services com streams claros e seguros.
```

---

## Ideia principal

Stream é uma ferramenta.

Não é obrigação.

Código profissional não é o que usa mais recursos avançados.

Código profissional é o que fica:

```text
correto;
legível;
testável;
simples de manter;
adequado ao volume de dados;
adequado à regra de negócio.
```

Um Stream bom parece uma frase:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .map(PedidoMapper::toResponse)
        .toList();
```

Leitura:

```text
pegue pedidos;
mantenha os que podem faturar;
converta para response;
retorne lista.
```

Isso é bom.

Mas um Stream ruim vira um enigma.

---

## Stream não é arquitetura

Esta frase é importante:

```text
Stream processa coleção.
Stream não define arquitetura.
```

A arquitetura continua sendo:

```text
Entidade: protege regra de negócio.
Service/Application/UseCase: coordena o fluxo.
Repository: salva e busca no banco.
Client/Gateway: chama API externa.
Controller: recebe.
```

Frase-chave do curso:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Streams ajudam a processar listas dentro dessas camadas.

Mas não substituem responsabilidade de camada.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-198-streams-boas-praticas-legibilidade-performance-e-parallelstream
cd labs\m7\aula-198-streams-boas-praticas-legibilidade-performance-e-parallelstream
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula198
mkdir src\br\com\curso\aula198\app
mkdir src\br\com\curso\aula198\dominio
mkdir src\br\com\curso\aula198\dominio\cliente
mkdir src\br\com\curso\aula198\dominio\pedido
mkdir src\br\com\curso\aula198\dominio\produto
mkdir src\br\com\curso\aula198\dominio\ordemservico
mkdir src\br\com\curso\aula198\dto
mkdir src\br\com\curso\aula198\service
```

---

# Parte 1 — Quando usar Stream

## Use Stream quando o fluxo é transformação de dados

Stream costuma ser bom quando a intenção é:

```text
filtrar;
mapear;
ordenar;
coletar;
agrupar;
contar;
buscar;
agregar;
achatar coleções.
```

Exemplo bom:

```java
List<String> nomes = clientes.stream()
        .filter(Cliente::podeOperar)
        .map(Cliente::nome)
        .sorted()
        .toList();
```

Esse pipeline é direto.

Ele não esconde muita coisa.

---

## App de Stream bom

Crie:

```text
src\br\com\curso\aula198\app\StreamBomApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.List;

public class StreamBomApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        List<String> nomesFormatados = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .map(String::toUpperCase)
                .sorted()
                .toList();

        System.out.println(nomesFormatados);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.StreamBomApp
```

---

## Por que esse Stream é bom

Ele tem uma sequência clara:

```text
filtrar;
transformar;
ordenar;
coletar.
```

As lambdas são pequenas.

O pipeline não tem regra complexa.

O resultado é uma nova lista.

Isso é uso adequado de Stream.

---

# Parte 2 — Quando usar for

## Use for quando o fluxo tem controle procedural

`for` pode ser melhor quando há:

```text
muitos ifs;
break;
continue;
try/catch por item;
múltiplas alterações de estado;
lógica passo a passo;
necessidade de logs detalhados;
erro parcial por item;
fluxo transacional;
efeitos colaterais importantes.
```

Exemplo:

```java
for (Pedido pedido : pedidos) {
    if (!pedido.podeFaturar()) {
        continue;
    }

    try {
        faturar(pedido);
    } catch (Exception erro) {
        registrarErro(pedido, erro);
    }
}
```

Esse tipo de fluxo pode ficar mais claro com `for`.

---

## App em que for é mais claro

Crie:

```text
src\br\com\curso\aula198\app\ForMelhorQueStreamApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.List;

public class ForMelhorQueStreamApp {
    public static void main(String[] args) {
        List<String> codigos = List.of("PED-001", "", "PED-002", "ERRO", "PED-003");

        for (String codigo : codigos) {
            if (codigo == null || codigo.isBlank()) {
                System.out.println("Ignorando código vazio.");
                continue;
            }

            try {
                processar(codigo);
            } catch (RuntimeException erro) {
                System.out.println("Erro ao processar " + codigo + ": " + erro.getMessage());
            }
        }
    }

    private static void processar(String codigo) {
        if ("ERRO".equals(codigo)) {
            throw new RuntimeException("Falha simulada.");
        }

        System.out.println("Processado: " + codigo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ForMelhorQueStreamApp
```

---

## Por que for ficou melhor aqui

Esse fluxo tem:

```text
continue;
try/catch;
tratamento por item;
efeito colateral;
mensagens específicas.
```

Daria para fazer com Stream.

Mas ficaria menos claro.

Regra profissional:

```text
se Stream piora a leitura, use for.
```

---

# Parte 3 — Efeitos colaterais

## O que é efeito colateral

Efeito colateral é quando uma operação altera algo fora dela.

Exemplos:

```text
adicionar item em lista externa;
salvar no banco;
enviar mensagem;
alterar estado de objeto;
chamar API externa;
escrever arquivo;
imprimir no console.
```

`forEach` costuma ter efeito colateral.

Nem todo efeito colateral é proibido.

Mas precisa ser claro.

---

## Exemplo ruim: montar lista com forEach

Evite:

```java
List<String> resultado = new ArrayList<>();

nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .forEach(nome -> resultado.add(nome.toUpperCase()));
```

Prefira:

```java
List<String> resultado = nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .map(String::toUpperCase)
        .toList();
```

---

## App comparando forEach ruim e map bom

Crie:

```text
src\br\com\curso\aula198\app\ForEachEfeitoColateralApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.ArrayList;
import java.util.List;

public class ForEachEfeitoColateralApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        List<String> resultadoComEfeitoColateral = new ArrayList<>();

        nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .forEach(nome -> resultadoComEfeitoColateral.add(nome.toUpperCase()));

        List<String> resultadoFuncional = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .map(String::toUpperCase)
                .toList();

        System.out.println("Com forEach e lista externa:");
        System.out.println(resultadoComEfeitoColateral);

        System.out.println();

        System.out.println("Com map e toList:");
        System.out.println(resultadoFuncional);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ForEachEfeitoColateralApp
```

---

## Regra prática

Para transformar dados:

```text
use map + toList.
```

Para executar ação final:

```text
use forEach com clareza.
```

Exemplo aceitável:

```java
resumos.forEach(System.out::println);
```

Exemplo que exige cuidado:

```java
pedidos.forEach(repository::salvar);
```

Salvar no banco é efeito colateral importante.

---

# Parte 4 — Pipeline longo demais

## Exemplo ruim

Um pipeline pode ficar difícil:

```java
pedidos.stream()
        .filter(p -> p.pago() && !p.cancelado() && p.valor().compareTo(BigDecimal.ZERO) > 0)
        .sorted((a, b) -> b.valor().compareTo(a.valor()))
        .map(p -> new PedidoResponse(p.codigo(), p.cliente(), p.valor(), p.valor().compareTo(new BigDecimal("1000")) > 0 ? "ALTO" : "NORMAL"))
        .filter(r -> r.prioridade().equals("ALTO"))
        .toList();
```

Problemas:

```text
regra de domínio escondida;
lambda grande;
BigDecimal repetido;
mapper inline grande;
comparador pouco legível;
filtro final poderia ter nome.
```

---

## Melhorando com métodos nomeados

A versão melhor é:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .sorted(Comparator.comparing(Pedido::valor).reversed())
        .map(PedidoMapper::toResponse)
        .filter(PedidoResponse::prioridadeAlta)
        .toList();
```

A leitura melhora muito.

---

# Parte 5 — Domínio Pedido para exemplos

## Pedido

Crie:

```text
src\br\com\curso\aula198\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula198.dominio.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final LocalDate data;
    private final boolean pago;
    private final boolean cancelado;

    public Pedido(String codigo, String cliente, BigDecimal valor, LocalDate data, boolean pago, boolean cancelado) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.data = data;
        this.pago = pago;
        this.cancelado = cancelado;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public LocalDate data() {
        return data;
    }

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado;
    }

    public boolean valorAlto() {
        return valor.compareTo(new BigDecimal("1000.00")) > 0;
    }

    public String prioridadeFinanceira() {
        if (valorAlto()) {
            return "ALTA";
        }

        return "NORMAL";
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Data: " + data
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoResponse

Crie:

```text
src\br\com\curso\aula198\dto\PedidoResponse.java
```

Código:

```java
package br.com.curso.aula198.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PedidoResponse {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final LocalDate data;
    private final String prioridade;

    public PedidoResponse(String codigo, String cliente, BigDecimal valor, LocalDate data, String prioridade) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (prioridade == null || prioridade.isBlank()) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.valor = valor;
        this.data = data;
        this.prioridade = prioridade;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public LocalDate data() {
        return data;
    }

    public String prioridade() {
        return prioridade;
    }

    public boolean prioridadeAlta() {
        return "ALTA".equals(prioridade);
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Data: " + data
                + " | Prioridade: " + prioridade;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoMapper

Crie:

```text
src\br\com\curso\aula198\dto\PedidoMapper.java
```

Código:

```java
package br.com.curso.aula198.dto;

import br.com.curso.aula198.dominio.pedido.Pedido;

public final class PedidoMapper {
    private PedidoMapper() {
    }

    public static PedidoResponse toResponse(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return new PedidoResponse(
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor(),
                pedido.data(),
                pedido.prioridadeFinanceira()
        );
    }
}
```

---

## App pipeline refatorado

Crie:

```text
src\br\com\curso\aula198\app\PipelineRefatoradoApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import br.com.curso.aula198.dominio.pedido.Pedido;
import br.com.curso.aula198.dto.PedidoMapper;
import br.com.curso.aula198.dto.PedidoResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public class PipelineRefatoradoApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true),
                new Pedido("PED-005", "Bruna", new BigDecimal("1800.00"), LocalDate.of(2026, 7, 5), true, false)
        );

        List<PedidoResponse> responses = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .sorted(Comparator.comparing(Pedido::valor).reversed())
                .map(PedidoMapper::toResponse)
                .filter(PedidoResponse::prioridadeAlta)
                .toList();

        responses.forEach(response -> System.out.println(response.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.PipelineRefatoradoApp
```

---

## O que melhorou

A regra principal está no domínio:

```java
Pedido::podeFaturar
Pedido::prioridadeFinanceira
```

A conversão está no mapper:

```java
PedidoMapper::toResponse
```

O Stream apenas coordena processamento da lista:

```text
filtrar;
ordenar;
mapear;
filtrar response;
coletar.
```

Isso é bem mais profissional.

---

# Parte 6 — Ordem do pipeline

## Ordem recomendada

Em muitos casos, uma boa ordem é:

```text
stream();
filter();
distinct();
sorted();
skip();
limit();
map();
toList();
```

Mas isso depende do objetivo.

---

## Filtre antes de ordenar

Geralmente é melhor:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .sorted(Comparator.comparing(Pedido::valor))
        .toList();
```

do que:

```java
pedidos.stream()
        .sorted(Comparator.comparing(Pedido::valor))
        .filter(Pedido::podeFaturar)
        .toList();
```

Porque ordenar custa mais do que filtrar.

Se você filtra antes, ordena menos itens.

---

## map antes ou depois?

Depende.

Se você precisa ordenar por campo da entidade, ordene antes do map:

```java
pedidos.stream()
        .sorted(Comparator.comparing(Pedido::valor))
        .map(PedidoMapper::toResponse)
        .toList();
```

Se o campo só existe no response, pode mapear antes.

Mas cuidado para não perder informação do domínio cedo demais.

---

## limit antes ou depois do sorted?

Para top N, o correto normalmente é:

```java
stream.sorted(...).limit(n)
```

Não:

```java
stream.limit(n).sorted(...)
```

Porque `limit` antes da ordenação pega um recorte arbitrário e só ordena esse recorte.

---

# Parte 7 — Custo das operações

## Operações baratas

Geralmente simples:

```text
filter;
map;
peek para debug temporário;
anyMatch;
findFirst;
count com filtro simples.
```

`anyMatch` e `findFirst` podem parar cedo.

---

## Operações potencialmente mais caras

Podem exigir mais trabalho:

```text
sorted;
distinct;
groupingBy;
toMap;
flatMap em estruturas grandes;
collect em listas grandes;
reduce pesado.
```

Não significa que são ruins.

Significa que você precisa entender o custo.

---

## sorted

`sorted` precisa ordenar os elementos.

Ordenação costuma ser mais cara do que filtro simples.

Por isso, filtre antes quando possível.

---

## distinct

`distinct` precisa controlar elementos já vistos.

Para objetos, depende de:

```text
equals;
hashCode.
```

Se a implementação for ruim, o resultado pode ser errado ou lento.

---

## groupingBy

`groupingBy` monta um `Map`.

Isso consome memória proporcional ao número de grupos e elementos.

Para grandes volumes persistidos, pense em SQL.

---

# Parte 8 — Lazy evaluation e short-circuit

## Lazy evaluation

Streams são preguiçosos.

Operações intermediárias só executam quando existe operação terminal.

Você já viu isso.

Exemplo:

```java
stream.filter(...).map(...);
```

Sem terminal:

```text
não executa.
```

---

## Short-circuit

Algumas operações podem parar cedo:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
limit.
```

Exemplo:

```java
boolean existe = pedidos.stream()
        .anyMatch(Pedido::podeFaturar);
```

Assim que encontra um pedido faturável, pode parar.

---

## App short-circuit

Crie:

```text
src\br\com\curso\aula198\app\ShortCircuitApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.List;

public class ShortCircuitApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        boolean existeNomeGrande = nomes.stream()
                .peek(nome -> System.out.println("Visitando: " + nome))
                .anyMatch(nome -> nome.length() >= 5);

        System.out.println("Existe nome grande? " + existeNomeGrande);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ShortCircuitApp
```

---

## O que observar

A execução pode parar em `"Carlos"`.

Não precisa visitar tudo.

Isso é short-circuit.

---

# Parte 9 — peek para debug

## O que é peek

`peek` permite observar os itens passando pelo pipeline.

Exemplo:

```java
stream.peek(item -> System.out.println(item))
```

Ele é útil para debug.

Mas não deve ser usado como regra principal de negócio.

---

## App com peek

Crie:

```text
src\br\com\curso\aula198\app\PeekDebugApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.List;

public class PeekDebugApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        List<String> resultado = nomes.stream()
                .peek(nome -> System.out.println("Original: " + nome))
                .filter(nome -> nome.length() >= 5)
                .peek(nome -> System.out.println("Depois do filter: " + nome))
                .map(String::toUpperCase)
                .peek(nome -> System.out.println("Depois do map: " + nome))
                .toList();

        System.out.println("Resultado final:");
        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.PeekDebugApp
```

---

## Cuidado com peek

Use `peek` para diagnóstico.

Evite usar `peek` para:

```text
salvar;
alterar estado;
enviar mensagem;
executar regra;
modificar objeto.
```

Se você precisa executar ação final, use `forEach`.

Se você precisa transformar, use `map`.

---

# Parte 10 — parallelStream

## O que é parallelStream

`parallelStream` tenta processar elementos em paralelo usando múltiplas threads.

Exemplo:

```java
lista.parallelStream()
        .map(...)
        .toList();
```

Parece uma forma fácil de acelerar código.

Mas não é simples assim.

---

## Por que parallelStream exige cuidado

`parallelStream` pode piorar o desempenho ou criar bugs quando:

```text
a lista é pequena;
a operação é leve;
há efeitos colaterais;
há acesso a recursos compartilhados;
há chamada de banco;
há chamada HTTP;
há transação;
há ordem importante;
há dependência entre itens;
há uso de lista externa mutável;
há logs difíceis de rastrear.
```

Regra profissional:

```text
não use parallelStream por impulso.
```

---

## App mostrando threads

Crie:

```text
src\br\com\curso\aula198\app\ParallelStreamThreadsApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.List;

public class ParallelStreamThreadsApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna", "Rafael", "Fernanda");

        nomes.parallelStream()
                .map(nome -> {
                    String thread = Thread.currentThread().getName();
                    return nome + " processado por " + thread;
                })
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ParallelStreamThreadsApp
```

---

## O que observar

A ordem de saída pode variar.

Os itens podem ser processados por threads diferentes.

Isso pode ser bom para cenários específicos.

Mas pode ser ruim se você depende de ordem ou estado compartilhado.

---

## App com risco de efeito colateral

Crie:

```text
src\br\com\curso\aula198\app\ParallelStreamEfeitoColateralPerigosoApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import java.util.ArrayList;
import java.util.List;

public class ParallelStreamEfeitoColateralPerigosoApp {
    public static void main(String[] args) {
        List<Integer> numeros = java.util.stream.IntStream.rangeClosed(1, 1000)
                .boxed()
                .toList();

        List<Integer> resultado = new ArrayList<>();

        numeros.parallelStream()
                .filter(numero -> numero % 2 == 0)
                .forEach(resultado::add);

        System.out.println("Tamanho esperado próximo de 500.");
        System.out.println("Tamanho obtido: " + resultado.size());
        System.out.println("Este exemplo mostra por que estado compartilhado com parallelStream é perigoso.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ParallelStreamEfeitoColateralPerigosoApp
```

---

## Forma correta

Em vez de adicionar em lista externa:

```java
List<Integer> resultado = numeros.parallelStream()
        .filter(numero -> numero % 2 == 0)
        .toList();
```

Mesmo assim, use `parallelStream` apenas se houver motivo real.

---

## Quando considerar parallelStream

Considere somente quando:

```text
há muitos elementos;
cada operação é pesada;
não há estado compartilhado;
não há transação por item;
não há chamada externa bloqueante sem controle;
a ordem não importa;
você mediu desempenho;
o ganho compensa a complexidade.
```

Palavra-chave:

```text
mediu.
```

Sem medição, é chute.

---

# Parte 11 — Domínio Produto e service profissional

## Produto

Crie:

```text
src\br\com\curso\aula198\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula198.dominio.produto;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final String categoria;
    private final BigDecimal preco;
    private final boolean ativo;
    private final int estoque;

    public Produto(String sku, String nome, String categoria, BigDecimal preco, boolean ativo, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.categoria = categoria.trim().toUpperCase();
        this.preco = preco;
        this.ativo = ativo;
        this.estoque = estoque;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public String categoria() {
        return categoria;
    }

    public BigDecimal preco() {
        return preco;
    }

    public boolean ativo() {
        return ativo;
    }

    public int estoque() {
        return estoque;
    }

    public boolean disponivel() {
        return ativo && estoque > 0;
    }

    public boolean pertenceCategoria(String categoriaDesejada) {
        if (categoriaDesejada == null || categoriaDesejada.isBlank()) {
            throw new IllegalArgumentException("Categoria desejada é obrigatória.");
        }

        return categoria.equals(categoriaDesejada.trim().toUpperCase());
    }

    public boolean precoMaiorOuIgual(BigDecimal valorMinimo) {
        if (valorMinimo == null) {
            throw new IllegalArgumentException("Valor mínimo é obrigatório.");
        }

        return preco.compareTo(valorMinimo) >= 0;
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Categoria: " + categoria
                + " | Preço: " + preco
                + " | Ativo: " + ativo
                + " | Estoque: " + estoque;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoResponse

Crie:

```text
src\br\com\curso\aula198\dto\ProdutoResponse.java
```

Código:

```java
package br.com.curso.aula198.dto;

import java.math.BigDecimal;

public class ProdutoResponse {
    private final String sku;
    private final String nome;
    private final String categoria;
    private final BigDecimal preco;

    public ProdutoResponse(String sku, String nome, String categoria, BigDecimal preco) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (preco == null) {
            throw new IllegalArgumentException("Preço é obrigatório.");
        }

        this.sku = sku;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public String categoria() {
        return categoria;
    }

    public BigDecimal preco() {
        return preco;
    }

    public String resumo() {
        return sku + " | " + nome + " | " + categoria + " | " + preco;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoMapper

Crie:

```text
src\br\com\curso\aula198\dto\ProdutoMapper.java
```

Código:

```java
package br.com.curso.aula198.dto;

import br.com.curso.aula198.dominio.produto.Produto;

public final class ProdutoMapper {
    private ProdutoMapper() {
    }

    public static ProdutoResponse toResponse(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        return new ProdutoResponse(
                produto.sku(),
                produto.nome(),
                produto.categoria(),
                produto.preco()
        );
    }
}
```

---

## ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula198\service\ProdutoConsultaService.java
```

Código:

```java
package br.com.curso.aula198.service;

import br.com.curso.aula198.dominio.produto.Produto;
import br.com.curso.aula198.dto.ProdutoMapper;
import br.com.curso.aula198.dto.ProdutoResponse;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class ProdutoConsultaService {
    private final List<Produto> produtos;

    public ProdutoConsultaService(List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        this.produtos = List.copyOf(produtos);
    }

    public List<ProdutoResponse> consultarDisponiveis(
            String categoria,
            BigDecimal precoMinimo,
            int pagina,
            int tamanho
    ) {
        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (precoMinimo == null) {
            throw new IllegalArgumentException("Preço mínimo é obrigatório.");
        }

        if (pagina < 0) {
            throw new IllegalArgumentException("Página não pode ser negativa.");
        }

        if (tamanho <= 0) {
            throw new IllegalArgumentException("Tamanho deve ser maior que zero.");
        }

        return produtos.stream()
                .filter(Produto::disponivel)
                .filter(produto -> produto.pertenceCategoria(categoria))
                .filter(produto -> produto.precoMaiorOuIgual(precoMinimo))
                .sorted(Comparator.comparing(Produto::preco).reversed())
                .skip((long) pagina * tamanho)
                .limit(tamanho)
                .map(ProdutoMapper::toResponse)
                .toList();
    }
}
```

---

## App ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula198\app\ProdutoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula198.app;

import br.com.curso.aula198.dominio.produto.Produto;
import br.com.curso.aula198.dto.ProdutoResponse;
import br.com.curso.aula198.service.ProdutoConsultaService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoConsultaServiceApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-005", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-006", "Teclado", "Informática", new BigDecimal("150.00"), true, 8)
        );

        ProdutoConsultaService service = new ProdutoConsultaService(produtos);

        List<ProdutoResponse> resultado = service.consultarDisponiveis(
                "Informática",
                new BigDecimal("100.00"),
                0,
                3
        );

        resultado.forEach(response -> System.out.println(response.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula198.app.ProdutoConsultaServiceApp
```

---

## Ponto profissional

Esse service ainda usa dados em memória.

Mas a estrutura é parecida com um service real:

```text
valida entrada;
filtra por regra;
ordena;
pagina;
mapeia para response;
retorna dados.
```

Em banco, futuramente, parte disso irá para query.

Mas o raciocínio permanece.

---

# Parte 12 — Checklist profissional para Streams

Antes de deixar um Stream no código, pergunte:

```text
1. O pipeline está fácil de ler?
2. As regras importantes estão no domínio?
3. O mapper está separado quando necessário?
4. Estou usando forEach só para ação final?
5. Estou evitando estado externo mutável?
6. Estou filtrando antes de ordenar quando possível?
7. Estou usando map para transformação?
8. Estou usando toList/collect para retorno?
9. Estou tratando Optional sem get?
10. O volume de dados permite processar em memória?
11. Isso deveria estar no banco?
12. O parallelStream é realmente necessário?
```

Se a resposta incomodar, refatore.

---

# Parte 13 — Erros comuns

## 1. Usar Stream só para parecer avançado

Ruim:

```java
lista.stream().forEach(item -> fazerAlgo(item));
```

Se é só percorrer com regra procedural, `for` pode ser melhor.

---

## 2. Lambda gigante

Ruim:

```java
.filter(item -> {
    // várias regras
    // vários ifs
    // cálculos
    // efeitos colaterais
})
```

Extraia método.

---

## 3. Regra de domínio dentro do pipeline

Ruim:

```java
.filter(p -> p.pago() && !p.cancelado())
```

Melhor:

```java
.filter(Pedido::podeFaturar)
```

---

## 4. forEach montando lista

Ruim:

```java
List<Response> responses = new ArrayList<>();
stream.forEach(item -> responses.add(mapper(item)));
```

Melhor:

```java
List<Response> responses = stream.map(this::mapper).toList();
```

---

## 5. parallelStream com estado compartilhado

Perigoso:

```java
List<String> resultado = new ArrayList<>();
lista.parallelStream().forEach(resultado::add);
```

Melhor:

```java
List<String> resultado = lista.parallelStream()
        .map(...)
        .toList();
```

Mesmo assim, use paralelo só com medição.

---

## 6. Paginação em memória para grandes volumes

Ruim:

```java
repository.buscarTodos()
        .stream()
        .skip(...)
        .limit(...)
```

se existem muitos registros.

Melhor futuramente:

```text
PageRequest;
SQL LIMIT/OFFSET;
consulta paginada.
```

---

# Parte 14 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula198.app.StreamBomApp
java -cp out br.com.curso.aula198.app.ForMelhorQueStreamApp
java -cp out br.com.curso.aula198.app.ForEachEfeitoColateralApp
java -cp out br.com.curso.aula198.app.PipelineRefatoradoApp
java -cp out br.com.curso.aula198.app.ShortCircuitApp
java -cp out br.com.curso.aula198.app.PeekDebugApp
java -cp out br.com.curso.aula198.app.ParallelStreamThreadsApp
java -cp out br.com.curso.aula198.app.ParallelStreamEfeitoColateralPerigosoApp
java -cp out br.com.curso.aula198.app.ProdutoConsultaServiceApp
```

Para cada execução, responda:

```text
Stream foi melhor que for?
Havia efeito colateral?
O pipeline estava legível?
As regras estavam nomeadas?
Houve short-circuit?
peek foi usado apenas para debug?
parallelStream trouxe algum risco?
Esse processamento deveria estar em memória ou no banco?
```

---

# Parte 15 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula198\dominio\atividade\Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
boolean obrigatoria;
boolean urgente;
int tentativas;
int minutosEstimados;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
tentativas não pode ser negativo;
minutosEstimados maior que zero;
pendente() retorna status igual "PENDENTE";
concluida() retorna status igual "CONCLUIDA";
excedeuTentativas() retorna tentativas > 3;
podeExecutar() retorna pendente && !excedeuTentativas;
critica() retorna urgente || obrigatoria;
prioridadeNumerica():
    1 se urgente e obrigatoria;
    2 se urgente;
    3 se obrigatoria;
    4 caso contrário;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula198\dto\AtividadeResponse.java
```

Campos:

```text
codigo;
descricao;
status;
prioridade;
minutosEstimados;
```

Crie mapper:

```text
src\br\com\curso\aula198\dto\AtividadeMapper.java
```

Crie service:

```text
src\br\com\curso\aula198\service\AtividadeConsultaService.java
```

Método:

```java
List<AtividadeResponse> consultarExecutaveis(
        boolean apenasCriticas,
        int pagina,
        int tamanho
)
```

Regras:

```text
validar pagina >= 0;
validar tamanho > 0;
filtrar podeExecutar;
se apenasCriticas for true, filtrar critica;
ordenar por prioridadeNumerica crescente;
depois por tentativas decrescente;
depois por codigo crescente;
paginar com skip e limit;
mapear para response;
retornar lista.
```

Critérios:

```text
pipeline legível;
regras principais na entidade;
mapper separado;
service não imprime;
sem estado externo mutável;
sem parallelStream.
```

Crie app:

```text
src\br\com\curso\aula198\app\AtividadeConsultaServiceApp.java
```

---

## Desafio extra

Crie duas versões no service:

```java
List<AtividadeResponse> consultarExecutaveisComStream(...)

List<AtividadeResponse> consultarExecutaveisComFor(...)
```

Compare no app:

```text
qual ficou mais legível?
qual ficou mais fácil de debugar?
qual expressa melhor o fluxo?
```

Critério principal:

```text
entender que Stream e for são ferramentas, não religião.
```

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
PipelineRefatoradoApp
ProdutoConsultaService.consultarDisponiveis
ShortCircuitApp
PeekDebugApp
ParallelStreamThreadsApp
ParallelStreamEfeitoColateralPerigosoApp
```

Pontos de atenção:

```java
.filter(...)
.sorted(...)
.skip(...)
.limit(...)
.map(...)
.toList()
.peek(...)
.parallelStream()
```

Observe:

```text
quando cada etapa executa;
como short-circuit para cedo;
como peek mostra o pipeline;
como parallelStream muda threads;
como efeito colateral externo fica perigoso;
como filtros antes de sorted reduzem trabalho;
como mapper separa responsabilidade.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando Stream é melhor que for?
2. Quando for é melhor que Stream?
3. Por que forEach com lista externa é ruim?
4. Por que parallelStream exige cuidado?
5. Qual checklist você usaria antes de aprovar um Stream em code review?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
decidir entre Stream e for;
identificar efeito colateral;
evitar forEach para montar lista;
usar map + toList corretamente;
refatorar pipeline longo;
colocar regra de domínio no domínio;
colocar conversão no mapper;
usar peek apenas para debug;
entender lazy evaluation;
entender short-circuit;
entender custo de sorted, distinct e groupingBy;
evitar parallelStream por impulso;
entender risco de estado compartilhado;
saber quando processamento deveria ir para o banco;
resolver AtividadeConsultaServiceApp;
comparar versão Stream e versão for;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-198-streams-boas-praticas-legibilidade-performance-e-parallelstream
git commit -m "Aula 198: streams boas praticas legibilidade performance e parallelstream"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Stream bom é Stream legível, sem efeito colateral perigoso e adequado ao volume de dados.
```

Você estudou:

```text
quando usar Stream;
quando usar for;
efeitos colaterais;
forEach;
pipeline longo;
ordem do pipeline;
custos de operações;
lazy evaluation;
short-circuit;
peek;
parallelStream;
services com streams profissionais.
```

Também reforçou a linha arquitetural do curso:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Na próxima aula, vamos fazer exercícios integradores de Streams.

Vamos juntar:

```text
filter;
map;
flatMap;
sorted;
distinct;
limit;
skip;
toList;
Collectors;
Optional;
min;
max;
reduce;
boas práticas.
```

O objetivo será consolidar o Módulo 7 antes do fechamento.
