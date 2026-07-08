# 168 — M5.23 — Exercícios integradores Collections: escolha de estruturas

## Objetivo da aula

Nesta aula você vai praticar uma habilidade essencial:

```text
ler um requisito e escolher a estrutura de coleção adequada antes de codar.
```

Nas últimas aulas, você aprendeu:

```text
List;
Set;
Map;
Queue;
Deque;
PriorityQueue;
Collections;
Comparator;
HashSet;
LinkedHashSet;
TreeSet;
HashMap;
LinkedHashMap;
TreeMap;
ArrayDeque.
```

Agora o foco é integração.

Você vai resolver exercícios onde a primeira decisão não é escrever código.

A primeira decisão é responder:

```text
qual estrutura representa melhor este problema?
```

Ao final da aula, você deve conseguir:

```text
analisar requisitos pequenos;
identificar intenção técnica;
escolher a coleção adequada;
justificar a escolha;
implementar usando a estrutura escolhida;
evitar usar List para tudo;
combinar várias coleções no mesmo fluxo;
usar objeto de valor como chave;
usar enum para status e prioridade;
usar LocalDateTime para datas;
usar Map para contagem;
usar Set para duplicidade;
usar Queue para processamento;
usar PriorityQueue para prioridade;
usar Comparator para ordenação;
usar List.copyOf para proteger retornos.
```

Esta aula é uma aula de prática e decisão.

---

## Regra da aula

Antes de cada exercício, responda mentalmente:

```text
1. Preciso de índice?
2. Preciso de unicidade?
3. Preciso de busca por chave?
4. Preciso de ordem de inserção?
5. Preciso de ordenação automática?
6. Preciso processar em ordem de chegada?
7. Preciso processar por prioridade?
8. Preciso proteger retorno?
```

Só depois escolha a coleção.

Um engenheiro Java não escolhe coleção por costume.

Escolhe por intenção.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-168-exercicios-integradores-collections-escolha-de-estruturas
cd labs\m5\aula-168-exercicios-integradores-collections-escolha-de-estruturas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula168
mkdir src\br\com\curso\aula168\app
mkdir src\br\com\curso\aula168\dominio
mkdir src\br\com\curso\aula168\dominio\valor
mkdir src\br\com\curso\aula168\dominio\atendimento
mkdir src\br\com\curso\aula168\infra
```

---

## Base de domínio da aula

Vamos usar algumas classes em vários exercícios.

A ideia não é criar um sistema completo ainda.

É ter objetos suficientes para treinar escolhas de coleções.

---

## CodigoOs

Crie:

```text
src\br\com\curso\aula168\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula168.dominio.valor;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs> {
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

## StatusAtendimento

Crie:

```text
src\br\com\curso\aula168\dominio\atendimento\StatusAtendimento.java
```

Código:

```java
package br.com.curso.aula168.dominio.atendimento;

public enum StatusAtendimento {
    CADASTRADA,
    ENFILEIRADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## PrioridadeAtendimento

Crie:

```text
src\br\com\curso\aula168\dominio\atendimento\PrioridadeAtendimento.java
```

Código:

```java
package br.com.curso.aula168.dominio.atendimento;

public enum PrioridadeAtendimento {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

---

## ResumoOs

Crie:

```text
src\br\com\curso\aula168\dominio\atendimento\ResumoOs.java
```

Código:

```java
package br.com.curso.aula168.dominio.atendimento;

import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.time.LocalDateTime;

public class ResumoOs {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final PrioridadeAtendimento prioridade;
    private final StatusAtendimento status;

    public ResumoOs(
            CodigoOs codigo,
            String cliente,
            LocalDateTime dataEntrada,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status
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

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = status;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDateTime dataEntrada() {
        return dataEntrada;
    }

    public PrioridadeAtendimento prioridade() {
        return prioridade;
    }

    public StatusAtendimento status() {
        return status;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Prioridade: " + prioridade
                + " | Status: " + status;
    }
}
```

---

## Exercício 1 — Diagnóstico de escolha de estruturas

### Requisito

Você precisa imprimir uma lista de problemas e a estrutura recomendada para cada um.

Exemplos:

```text
Preciso buscar OS por código.
Escolha: Map<CodigoOs, OrdemServico>.

Preciso remover duplicados mantendo ordem.
Escolha: LinkedHashSet.
```

### Análise técnica

Este exercício não exige estrutura complexa.

Ele treina raciocínio técnico.

Como é uma sequência de diagnósticos, a estrutura natural é:

```text
List<String>
```

Por quê?

```text
a ordem dos diagnósticos importa;
pode haver várias frases;
não há busca por chave;
não há prioridade;
não há remoção por duplicidade.
```

---

## Implementação do Exercício 1

Crie:

```text
src\br\com\curso\aula168\app\DiagnosticoEscolhaCollectionsApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import java.util.ArrayList;
import java.util.List;

public class DiagnosticoEscolhaCollectionsApp {
    public static void main(String[] args) {
        List<String> diagnosticos = new ArrayList<>();

        diagnosticos.add("Problema: preciso manter uma sequência de etapas. Escolha: List. Motivo: ordem e índice podem importar.");
        diagnosticos.add("Problema: preciso impedir códigos duplicados. Escolha: Set. Motivo: unicidade.");
        diagnosticos.add("Problema: preciso impedir duplicados mantendo ordem de chegada. Escolha: LinkedHashSet. Motivo: unicidade + ordem de inserção.");
        diagnosticos.add("Problema: preciso manter códigos únicos ordenados. Escolha: TreeSet. Motivo: unicidade + ordenação.");
        diagnosticos.add("Problema: preciso buscar OS por código. Escolha: Map<CodigoOs, OS>. Motivo: busca por chave.");
        diagnosticos.add("Problema: preciso buscar por chave e preservar ordem de cadastro. Escolha: LinkedHashMap. Motivo: chave-valor + ordem de inserção.");
        diagnosticos.add("Problema: preciso buscar por chave e exibir ordenado pela chave. Escolha: TreeMap. Motivo: chave-valor + ordenação por chave.");
        diagnosticos.add("Problema: preciso processar em ordem de chegada. Escolha: Queue com ArrayDeque. Motivo: FIFO.");
        diagnosticos.add("Problema: preciso desfazer ações. Escolha: Deque com ArrayDeque. Motivo: pilha LIFO.");
        diagnosticos.add("Problema: preciso processar por prioridade. Escolha: PriorityQueue. Motivo: saída por prioridade.");

        System.out.println("Diagnóstico de escolhas:");

        for (String diagnostico : diagnosticos) {
            System.out.println("- " + diagnostico);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.DiagnosticoEscolhaCollectionsApp
```

---

## O que observar

Este exercício parece simples, mas é importante.

Ele obriga você a falar o motivo técnico.

No trabalho real, muitas discussões são assim:

```text
Por que você usou Map?
Por que não List?
Por que LinkedHashMap?
Por que TreeSet?
```

Você precisa responder tecnicamente.

---

## Exercício 2 — Análise de importação de OS

### Requisito

Você recebeu uma lista de códigos de OS importados.

Precisa gerar:

```text
lista original;
códigos únicos mantendo ordem;
códigos únicos ordenados;
códigos duplicados;
quantidade total;
quantidade única;
quantidade duplicada.
```

### Análise técnica

A escolha das estruturas:

```text
List:
guardar entrada original.

LinkedHashSet:
guardar únicos mantendo ordem de chegada.

TreeSet:
guardar únicos ordenados.

HashSet:
controlar itens já vistos.

LinkedHashSet:
guardar duplicados únicos mantendo a ordem em que foram detectados.
```

Este exercício é excelente porque combina várias coleções.

---

## ResultadoAnaliseImportacaoOs

Crie:

```text
src\br\com\curso\aula168\infra\ResultadoAnaliseImportacaoOs.java
```

Código:

```java
package br.com.curso.aula168.infra;

import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class ResultadoAnaliseImportacaoOs {
    private final List<CodigoOs> original;
    private final List<CodigoOs> unicosNaOrdem;
    private final Set<CodigoOs> unicosOrdenados;
    private final List<CodigoOs> duplicados;

    public ResultadoAnaliseImportacaoOs(
            List<CodigoOs> original,
            List<CodigoOs> unicosNaOrdem,
            Set<CodigoOs> unicosOrdenados,
            List<CodigoOs> duplicados
    ) {
        this.original = List.copyOf(original);
        this.unicosNaOrdem = List.copyOf(unicosNaOrdem);
        this.unicosOrdenados = new TreeSet<>(unicosOrdenados);
        this.duplicados = List.copyOf(duplicados);
    }

    public List<CodigoOs> original() {
        return original;
    }

    public List<CodigoOs> unicosNaOrdem() {
        return unicosNaOrdem;
    }

    public Set<CodigoOs> unicosOrdenados() {
        return new TreeSet<>(unicosOrdenados);
    }

    public List<CodigoOs> duplicados() {
        return duplicados;
    }

    public int quantidadeTotal() {
        return original.size();
    }

    public int quantidadeUnica() {
        return unicosNaOrdem.size();
    }

    public int quantidadeDuplicada() {
        return duplicados.size();
    }
}
```

---

## AnalisadorImportacaoOsMemoria

Crie:

```text
src\br\com\curso\aula168\infra\AnalisadorImportacaoOsMemoria.java
```

Código:

```java
package br.com.curso.aula168.infra;

import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class AnalisadorImportacaoOsMemoria {
    public ResultadoAnaliseImportacaoOs analisar(List<CodigoOs> codigos) {
        if (codigos == null) {
            throw new IllegalArgumentException("Lista de códigos é obrigatória.");
        }

        List<CodigoOs> original = new ArrayList<>();
        Set<CodigoOs> vistos = new HashSet<>();
        Set<CodigoOs> unicosNaOrdem = new LinkedHashSet<>();
        Set<CodigoOs> unicosOrdenados = new TreeSet<>();
        Set<CodigoOs> duplicados = new LinkedHashSet<>();

        for (CodigoOs codigo : codigos) {
            if (codigo == null) {
                throw new IllegalArgumentException("Código nulo não é permitido.");
            }

            original.add(codigo);
            unicosNaOrdem.add(codigo);
            unicosOrdenados.add(codigo);

            boolean novo = vistos.add(codigo);

            if (!novo) {
                duplicados.add(codigo);
            }
        }

        return new ResultadoAnaliseImportacaoOs(
                original,
                new ArrayList<>(unicosNaOrdem),
                unicosOrdenados,
                new ArrayList<>(duplicados)
        );
    }
}
```

---

## App do Exercício 2

Crie:

```text
src\br\com\curso\aula168\app\AnalisadorImportacaoOsApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.valor.CodigoOs;
import br.com.curso.aula168.infra.AnalisadorImportacaoOsMemoria;
import br.com.curso.aula168.infra.ResultadoAnaliseImportacaoOs;

import java.util.List;

public class AnalisadorImportacaoOsApp {
    public static void main(String[] args) {
        List<CodigoOs> entrada = List.of(
                new CodigoOs("OS-2026-0003"),
                new CodigoOs("OS-2026-0001"),
                new CodigoOs("OS-2026-0003"),
                new CodigoOs("OS-2026-0002"),
                new CodigoOs("os-2026-0001"),
                new CodigoOs("OS-2026-0004")
        );

        AnalisadorImportacaoOsMemoria analisador = new AnalisadorImportacaoOsMemoria();

        ResultadoAnaliseImportacaoOs resultado = analisador.analisar(entrada);

        imprimir("Original", resultado.original());
        imprimir("Únicos na ordem", resultado.unicosNaOrdem());
        imprimir("Duplicados", resultado.duplicados());

        System.out.println();
        System.out.println("Únicos ordenados:");
        resultado.unicosOrdenados()
                .forEach(codigo -> System.out.println("- " + codigo.resumo()));

        System.out.println();
        System.out.println("Quantidade total: " + resultado.quantidadeTotal());
        System.out.println("Quantidade única: " + resultado.quantidadeUnica());
        System.out.println("Quantidade duplicada: " + resultado.quantidadeDuplicada());
    }

    private static void imprimir(String titulo, List<CodigoOs> codigos) {
        System.out.println();
        System.out.println(titulo + ":");

        for (CodigoOs codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.AnalisadorImportacaoOsApp
```

---

## O que esse exercício ensina

Ele mostra que uma única necessidade pode pedir várias coleções:

```text
List para preservar entrada;
HashSet para detectar repetição;
LinkedHashSet para preservar ordem sem duplicar;
TreeSet para ordenar;
List.copyOf para proteger retorno.
```

Essa é uma habilidade de projeto.

---

## Exercício 3 — Relatório por status

### Requisito

Dada uma lista de OS, gerar uma contagem por status.

Exemplo:

```text
CADASTRADA -> 2
CONCLUIDA -> 3
CANCELADA -> 1
```

### Análise técnica

A estrutura ideal é:

```text
Map<StatusAtendimento, Integer>
```

Por quê?

```text
a chave é o status;
o valor é a quantidade;
precisamos acumular contagem.
```

Usaremos `LinkedHashMap` para manter a ordem do enum na exibição.

---

## Implementação do Exercício 3

Crie:

```text
src\br\com\curso\aula168\app\RelatorioStatusComMapApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula168.dominio.atendimento.ResumoOs;
import br.com.curso.aula168.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RelatorioStatusComMapApp {
    public static void main(String[] args) {
        List<ResumoOs> ordens = criarOrdens();

        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (StatusAtendimento status : StatusAtendimento.values()) {
            contagem.put(status, 0);
        }

        for (ResumoOs os : ordens) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        System.out.println("Relatório por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : contagem.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static List<ResumoOs> criarOrdens() {
        List<ResumoOs> ordens = new ArrayList<>();

        adicionar(ordens, "OS-2026-0001", "Ana", PrioridadeAtendimento.NORMAL, StatusAtendimento.CADASTRADA, 9, 0);
        adicionar(ordens, "OS-2026-0002", "Carlos", PrioridadeAtendimento.ALTA, StatusAtendimento.CONCLUIDA, 9, 5);
        adicionar(ordens, "OS-2026-0003", "Mariana", PrioridadeAtendimento.CRITICA, StatusAtendimento.CONCLUIDA, 9, 10);
        adicionar(ordens, "OS-2026-0004", "Bruno", PrioridadeAtendimento.BAIXA, StatusAtendimento.CANCELADA, 9, 15);

        return ordens;
    }

    private static void adicionar(
            List<ResumoOs> ordens,
            String codigo,
            String cliente,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status,
            int hora,
            int minuto
    ) {
        ordens.add(new ResumoOs(
                new CodigoOs(codigo),
                cliente,
                LocalDateTime.of(2026, 12, 10, hora, minuto),
                prioridade,
                status
        ));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.RelatorioStatusComMapApp
```

---

## O que observar

Usamos:

```java
contagem.merge(os.status(), 1, Integer::sum);
```

Esse padrão é muito comum para contagens.

A estrutura comunica a regra:

```text
status -> quantidade.
```

---

## Exercício 4 — Seleção de OS sem duplicidade

### Requisito

Usuário seleciona várias OS em uma tela.

A seleção deve:

```text
impedir duplicidade;
manter a ordem da seleção;
permitir exibir também os códigos ordenados.
```

### Análise técnica

Precisamos de duas visões:

```text
LinkedHashSet:
códigos únicos na ordem de seleção.

TreeSet:
códigos únicos ordenados.
```

---

## Implementação do Exercício 4

Crie:

```text
src\br\com\curso\aula168\app\SelecaoOsSemDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

public class SelecaoOsSemDuplicidadeApp {
    public static void main(String[] args) {
        Set<CodigoOs> selecionadas = new LinkedHashSet<>();

        selecionar(selecionadas, new CodigoOs("OS-2026-0003"));
        selecionar(selecionadas, new CodigoOs("OS-2026-0001"));
        selecionar(selecionadas, new CodigoOs("OS-2026-0003"));
        selecionar(selecionadas, new CodigoOs("OS-2026-0002"));

        System.out.println();
        System.out.println("Selecionadas na ordem:");

        for (CodigoOs codigo : selecionadas) {
            System.out.println("- " + codigo.resumo());
        }

        Set<CodigoOs> ordenadas = new TreeSet<>(selecionadas);

        System.out.println();
        System.out.println("Selecionadas ordenadas:");

        for (CodigoOs codigo : ordenadas) {
            System.out.println("- " + codigo.resumo());
        }
    }

    private static void selecionar(Set<CodigoOs> selecionadas, CodigoOs codigo) {
        boolean adicionou = selecionadas.add(codigo);

        if (adicionou) {
            System.out.println("Selecionada: " + codigo.resumo());
        } else {
            System.out.println("Ignorada duplicada: " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.SelecaoOsSemDuplicidadeApp
```

---

## O que esse exercício ensina

`LinkedHashSet` resolve:

```text
unicidade + ordem de seleção.
```

`TreeSet` resolve:

```text
visão ordenada.
```

Você não precisa forçar uma única estrutura a resolver todas as visões.

---

## Exercício 5 — Fila de reprocessamento

### Requisito

Você tem códigos de OS que precisam ser reprocessados na ordem em que entraram.

O sistema deve:

```text
adicionar itens na fila;
mostrar próximo item;
processar um por um;
mostrar quantidade restante.
```

### Análise técnica

A estrutura ideal é:

```text
Queue<CodigoOs> com ArrayDeque
```

Por quê?

```text
processamento FIFO;
não precisa de índice;
não precisa de busca por chave;
a fila será consumida.
```

---

## Implementação do Exercício 5

Crie:

```text
src\br\com\curso\aula168\app\FilaReprocessamentoOsApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.util.ArrayDeque;
import java.util.Queue;

public class FilaReprocessamentoOsApp {
    public static void main(String[] args) {
        Queue<CodigoOs> fila = new ArrayDeque<>();

        fila.offer(new CodigoOs("OS-2026-0001"));
        fila.offer(new CodigoOs("OS-2026-0002"));
        fila.offer(new CodigoOs("OS-2026-0003"));

        CodigoOs proxima = fila.peek();

        if (proxima != null) {
            System.out.println("Próxima sem remover: " + proxima.resumo());
        }

        System.out.println();
        System.out.println("Processando fila:");

        CodigoOs codigo;

        while ((codigo = fila.poll()) != null) {
            System.out.println("Processando: " + codigo.resumo());
            System.out.println("Restantes: " + fila.size());
        }

        System.out.println();
        System.out.println("Fila vazia? " + fila.isEmpty());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.FilaReprocessamentoOsApp
```

---

## O que esse exercício ensina

A fila deve ser consumida.

O método:

```java
poll()
```

remove o próximo item.

Isso combina com a ideia de reprocessamento:

```text
peguei;
processei;
saiu da fila.
```

---

## Exercício 6 — Fila de prioridade de atendimento

### Requisito

Dada uma lista de OS, processar primeiro:

```text
CRITICA;
depois ALTA;
depois NORMAL;
depois BAIXA.
```

Em empate:

```text
mais antiga primeiro;
depois menor código.
```

### Análise técnica

A estrutura ideal é:

```text
PriorityQueue<ResumoOs>
```

com:

```text
Comparator
```

Critério:

```text
peso da prioridade;
data de entrada;
código.
```

---

## Implementação do Exercício 6

Crie:

```text
src\br\com\curso\aula168\app\FilaPrioritariaOsApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula168.dominio.atendimento.ResumoOs;
import br.com.curso.aula168.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class FilaPrioritariaOsApp {
    public static void main(String[] args) {
        Queue<ResumoOs> fila = new PriorityQueue<>(
                Comparator.comparingInt((ResumoOs os) -> pesoPrioridade(os.prioridade()))
                        .thenComparing(ResumoOs::dataEntrada)
                        .thenComparing(ResumoOs::codigo)
        );

        adicionar(fila, "OS-2026-0001", "Ana", PrioridadeAtendimento.NORMAL, 9, 0);
        adicionar(fila, "OS-2026-0002", "Carlos", PrioridadeAtendimento.CRITICA, 9, 10);
        adicionar(fila, "OS-2026-0003", "Mariana", PrioridadeAtendimento.ALTA, 9, 5);
        adicionar(fila, "OS-2026-0004", "Bruno", PrioridadeAtendimento.CRITICA, 9, 2);

        System.out.println("Processando por prioridade:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll().resumo());
        }
    }

    private static void adicionar(
            Queue<ResumoOs> fila,
            String codigo,
            String cliente,
            PrioridadeAtendimento prioridade,
            int hora,
            int minuto
    ) {
        fila.offer(new ResumoOs(
                new CodigoOs(codigo),
                cliente,
                LocalDateTime.of(2026, 12, 10, hora, minuto),
                prioridade,
                StatusAtendimento.ENFILEIRADA
        ));
    }

    private static int pesoPrioridade(PrioridadeAtendimento prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.FilaPrioritariaOsApp
```

---

## O que esse exercício ensina

`PriorityQueue` não processa na ordem de chegada.

Ela processa pela prioridade definida.

O `Comparator` deixa o critério explícito.

Critério explícito é melhor que regra escondida.

---

## Exercício 7 — Painel integrado com várias coleções

### Requisito

Criar um painel em memória que permita:

```text
cadastrar OS;
buscar OS por código;
listar na ordem de cadastro;
listar ordenada por cliente;
selecionar OS sem duplicidade;
processar selecionadas em fila;
gerar relatório por status.
```

### Análise técnica

Vamos usar:

```text
LinkedHashMap<CodigoOs, ResumoOs>:
cadastro por código + ordem de cadastro.

LinkedHashSet<CodigoOs>:
seleção sem duplicidade + ordem de seleção.

ArrayDeque<CodigoOs>:
fila de processamento das selecionadas.

Map<StatusAtendimento, Integer>:
relatório por status.

ArrayList:
cópia ordenável para relatório por cliente.

Comparator:
ordenar por cliente e código.
```

---

## PainelCollectionsIntegradoMemoria

Crie:

```text
src\br\com\curso\aula168\infra\PainelCollectionsIntegradoMemoria.java
```

Código:

```java
package br.com.curso.aula168.infra;

import br.com.curso.aula168.dominio.atendimento.ResumoOs;
import br.com.curso.aula168.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula168.dominio.valor.CodigoOs;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class PainelCollectionsIntegradoMemoria {
    private final Map<CodigoOs, ResumoOs> ordensPorCodigo;
    private final Set<CodigoOs> selecionadas;
    private final Queue<CodigoOs> filaProcessamento;

    public PainelCollectionsIntegradoMemoria() {
        this.ordensPorCodigo = new LinkedHashMap<>();
        this.selecionadas = new LinkedHashSet<>();
        this.filaProcessamento = new ArrayDeque<>();
    }

    public void cadastrar(ResumoOs os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS duplicada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public ResumoOs buscar(CodigoOs codigo) {
        return ordensPorCodigo.get(codigo);
    }

    public void selecionar(CodigoOs codigo) {
        if (!ordensPorCodigo.containsKey(codigo)) {
            throw new IllegalArgumentException("OS não cadastrada: " + codigo.resumo());
        }

        boolean adicionou = selecionadas.add(codigo);

        if (adicionou) {
            filaProcessamento.offer(codigo);
        }
    }

    public ResumoOs processarProximaSelecionada() {
        CodigoOs codigo = filaProcessamento.poll();

        if (codigo == null) {
            return null;
        }

        return ordensPorCodigo.get(codigo);
    }

    public List<ResumoOs> listarNaOrdemDeCadastro() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public List<ResumoOs> listarOrdenadoPorCliente() {
        List<ResumoOs> lista = new ArrayList<>(ordensPorCodigo.values());

        lista.sort(Comparator.comparing(ResumoOs::cliente)
                .thenComparing(ResumoOs::codigo));

        return List.copyOf(lista);
    }

    public List<CodigoOs> listarSelecionadasNaOrdem() {
        return List.copyOf(selecionadas);
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (StatusAtendimento status : StatusAtendimento.values()) {
            contagem.put(status, 0);
        }

        for (ResumoOs os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public int quantidadeCadastrada() {
        return ordensPorCodigo.size();
    }

    public int quantidadeSelecionada() {
        return selecionadas.size();
    }

    public int quantidadeNaFila() {
        return filaProcessamento.size();
    }
}
```

---

## App do Exercício 7

Crie:

```text
src\br\com\curso\aula168\app\PainelCollectionsIntegradoApp.java
```

Código:

```java
package br.com.curso.aula168.app;

import br.com.curso.aula168.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula168.dominio.atendimento.ResumoOs;
import br.com.curso.aula168.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula168.dominio.valor.CodigoOs;
import br.com.curso.aula168.infra.PainelCollectionsIntegradoMemoria;

import java.time.LocalDateTime;
import java.util.Map;

public class PainelCollectionsIntegradoApp {
    public static void main(String[] args) {
        PainelCollectionsIntegradoMemoria painel = new PainelCollectionsIntegradoMemoria();

        cadastrar(painel, "OS-2026-0003", "Mariana", PrioridadeAtendimento.ALTA, StatusAtendimento.CADASTRADA, 9, 5);
        cadastrar(painel, "OS-2026-0001", "Ana", PrioridadeAtendimento.NORMAL, StatusAtendimento.CONCLUIDA, 9, 0);
        cadastrar(painel, "OS-2026-0004", "Bruno", PrioridadeAtendimento.BAIXA, StatusAtendimento.CANCELADA, 9, 20);
        cadastrar(painel, "OS-2026-0002", "Carlos", PrioridadeAtendimento.CRITICA, StatusAtendimento.ENFILEIRADA, 9, 10);

        painel.selecionar(new CodigoOs("OS-2026-0003"));
        painel.selecionar(new CodigoOs("OS-2026-0001"));
        painel.selecionar(new CodigoOs("OS-2026-0003"));
        painel.selecionar(new CodigoOs("OS-2026-0002"));

        System.out.println("Listagem na ordem de cadastro:");
        painel.listarNaOrdemDeCadastro()
                .forEach(os -> System.out.println("- " + os.resumo()));

        System.out.println();
        System.out.println("Listagem ordenada por cliente:");
        painel.listarOrdenadoPorCliente()
                .forEach(os -> System.out.println("- " + os.resumo()));

        System.out.println();
        System.out.println("Selecionadas na ordem:");
        painel.listarSelecionadasNaOrdem()
                .forEach(codigo -> System.out.println("- " + codigo.resumo()));

        System.out.println();
        System.out.println("Processando selecionadas:");

        ResumoOs processada;

        while ((processada = painel.processarProximaSelecionada()) != null) {
            System.out.println("- " + processada.resumo());
        }

        System.out.println();
        System.out.println("Relatório por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : painel.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }

        System.out.println();
        System.out.println("Quantidade cadastrada: " + painel.quantidadeCadastrada());
        System.out.println("Quantidade selecionada: " + painel.quantidadeSelecionada());
        System.out.println("Quantidade na fila: " + painel.quantidadeNaFila());
    }

    private static void cadastrar(
            PainelCollectionsIntegradoMemoria painel,
            String codigo,
            String cliente,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status,
            int hora,
            int minuto
    ) {
        painel.cadastrar(new ResumoOs(
                new CodigoOs(codigo),
                cliente,
                LocalDateTime.of(2026, 12, 10, hora, minuto),
                prioridade,
                status
        ));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula168.app.PainelCollectionsIntegradoApp
```

---

## O que o painel integrado ensina

Ele mostra que você pode combinar coleções:

```text
Map para cadastro;
Set para seleção;
Queue para processamento;
List para relatórios;
Comparator para ordenação;
Map para contagem.
```

A regra principal é:

```text
cada coleção deve ter um motivo.
```

---

## Exercício 8 — Requisito sem código pronto

Agora pratique sozinho.

### Requisito

Você recebeu uma lista de produtos importados.

Cada produto possui:

```text
SKU;
nome;
categoria;
ativo/inativo.
```

Você precisa gerar:

```text
produtos únicos por SKU;
duplicados por SKU;
produtos por categoria;
lista ordenada por nome;
fila de produtos para processamento na ordem importada.
```

### Pergunta

Quais estruturas você escolheria?

Uma resposta possível:

```text
Map<SkuProduto, Produto>:
produtos únicos por SKU.

Set<SkuProduto>:
controle de SKUs vistos.

List<SkuProduto> ou List<Produto>:
duplicados detectados.

Map<Categoria, List<Produto>>:
produtos por categoria.

ArrayList + Comparator:
lista ordenada por nome.

Queue<Produto> com ArrayDeque:
fila de processamento na ordem importada.
```

Não implemente ainda se quiser.

O objetivo aqui é treinar escolha.

---

## Exercício 9 — Requisito de atendimento crítico

### Requisito

Você precisa processar chamados com as regras:

```text
CRITICO primeiro;
em empate, chamado mais antigo primeiro;
em empate, menor código primeiro;
não pode processar o mesmo chamado duas vezes;
precisa buscar chamado por código;
precisa listar chamados processados na ordem em que foram processados.
```

### Escolha técnica esperada

```text
PriorityQueue<Chamado>:
processar por prioridade.

Comparator<Chamado>:
prioridade, data, código.

Set<CodigoChamado>:
evitar processar duplicado.

Map<CodigoChamado, Chamado>:
buscar por código.

List<Chamado>:
histórico processado na ordem.
```

Perceba:

```text
nenhuma estrutura resolve tudo sozinha.
```

Um bom desenho combina estruturas.

---

## Exercício 10 — Requisito de relatório

### Requisito

Você precisa gerar um relatório com:

```text
total por status;
total por prioridade;
códigos ordenados;
clientes sem duplicidade em ordem alfabética;
ordens na ordem original de cadastro.
```

### Escolha técnica esperada

```text
Map<Status, Integer>:
total por status.

Map<Prioridade, Integer>:
total por prioridade.

TreeSet<CodigoOs>:
códigos ordenados.

TreeSet<String>:
clientes sem duplicidade em ordem alfabética.

LinkedHashMap<CodigoOs, OrdemServico> ou List<OrdemServico>:
ordens na ordem original de cadastro.
```

Esse tipo de análise é extremamente comum em backend.

---

## Checklist para resolver exercícios de Collections

Use este roteiro:

```text
1. Leia o requisito inteiro.
2. Sublinhe palavras como único, ordenado, fila, prioridade, busca.
3. Identifique se há chave.
4. Identifique se há duplicidade.
5. Identifique se há ordem de chegada.
6. Identifique se há ordenação.
7. Identifique se há consumo/processamento.
8. Escolha uma estrutura para cada responsabilidade.
9. Evite misturar responsabilidades.
10. Só então implemente.
```

Esse roteiro evita muita confusão.

---

## Palavras-chave que indicam estrutura

```text
"lista", "sequência", "posição":
List.

"único", "sem repetir", "duplicidade":
Set.

"por código", "por id", "por chave":
Map.

"ordem de chegada", "processar um por um":
Queue.

"prioridade", "mais crítico primeiro":
PriorityQueue.

"desfazer", "último primeiro":
Deque.

"ordenado", "alfabético", "crescente":
TreeSet, TreeMap ou List + Comparator.

"manter ordem original":
ArrayList, LinkedHashSet ou LinkedHashMap.
```

Essas palavras ajudam a decidir.

---

## Erro intencional para evitar

Não pense assim:

```text
vou usar ArrayList e depois vejo.
```

Pense assim:

```text
qual comportamento eu preciso?
```

Se precisa buscar por código, comece com `Map`.

Se precisa evitar duplicidade, comece com `Set`.

Se precisa fila, comece com `Queue`.

Isso muda a qualidade do código.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Diagnóstico

Execute:

```powershell
java -cp out br.com.curso.aula168.app.DiagnosticoEscolhaCollectionsApp
```

Leia cada linha e explique o motivo técnico.

### Parte 2 — Importação

Execute:

```powershell
java -cp out br.com.curso.aula168.app.AnalisadorImportacaoOsApp
```

Observe:

```text
original;
únicos;
ordenados;
duplicados.
```

### Parte 3 — Relatórios e seleção

Execute:

```powershell
java -cp out br.com.curso.aula168.app.RelatorioStatusComMapApp
java -cp out br.com.curso.aula168.app.SelecaoOsSemDuplicidadeApp
```

### Parte 4 — Filas

Execute:

```powershell
java -cp out br.com.curso.aula168.app.FilaReprocessamentoOsApp
java -cp out br.com.curso.aula168.app.FilaPrioritariaOsApp
```

### Parte 5 — Integração

Execute:

```powershell
java -cp out br.com.curso.aula168.app.PainelCollectionsIntegradoApp
```

---

## Desafio prático

Implemente o exercício de produtos.

Crie:

```text
src\br\com\curso\aula168\dominio\valor\SkuProduto.java
src\br\com\curso\aula168\dominio\atendimento\ProdutoImportado.java
src\br\com\curso\aula168\infra\AnalisadorProdutoImportadoMemoria.java
src\br\com\curso\aula168\app\AnalisadorProdutoImportadoApp.java
```

Requisitos:

```text
SKU deve ser objeto de valor;
produto deve ter SKU, nome, categoria e ativo;
gerar produtos únicos por SKU;
gerar SKUs duplicados;
agrupar produtos por categoria;
gerar lista ordenada por nome;
gerar fila de processamento na ordem importada.
```

Critério principal:

```text
usar Map, Set, List, Queue e Comparator com intenção clara.
```

---

## Desafio extra

Implemente o requisito de atendimento crítico.

Crie:

```text
src\br\com\curso\aula168\dominio\atendimento\ChamadoCritico.java
src\br\com\curso\aula168\infra\FilaChamadosCriticosMemoria.java
src\br\com\curso\aula168\app\FilaChamadosCriticosApp.java
```

Requisitos:

```text
processar por prioridade;
em empate, data mais antiga;
em empate, menor código;
não processar duplicado;
buscar por código;
guardar processados na ordem processada.
```

Critério principal:

```text
usar PriorityQueue, Comparator, Set, Map e List.
```

---

## Erros comuns nesta aula

### 1. Escolher estrutura antes de entender a intenção

Leia o requisito primeiro.

### 2. Usar List para busca por código

Se existe chave, pense em `Map`.

### 3. Usar List para evitar duplicidade

Se duplicidade é regra, pense em `Set`.

### 4. Usar HashSet quando precisa manter ordem

Use `LinkedHashSet`.

### 5. Usar HashMap quando precisa ordem de cadastro

Use `LinkedHashMap`.

### 6. Usar PriorityQueue esperando ordem de chegada

Use `Queue` comum se a regra for FIFO.

### 7. Não criar critério de desempate

Em prioridade, desempate evita comportamento confuso.

### 8. Expor coleção interna

Use cópia.

### 9. Misturar muitas regras no app

Crie classes de apoio quando o fluxo crescer.

### 10. Esquecer validação em objeto de valor

Código, SKU, CPF e e-mail merecem tipo próprio quando têm regra.

---

## Debug recomendado

Use debug em:

```text
AnalisadorImportacaoOsMemoria.java
ResultadoAnaliseImportacaoOs.java
RelatorioStatusComMapApp.java
SelecaoOsSemDuplicidadeApp.java
FilaReprocessamentoOsApp.java
FilaPrioritariaOsApp.java
PainelCollectionsIntegradoMemoria.java
PainelCollectionsIntegradoApp.java
```

Breakpoints recomendados:

```java
vistos.add(codigo)

unicosNaOrdem.add(codigo)

duplicados.add(codigo)

contagem.merge(...)

selecionadas.add(codigo)

fila.offer(...)

fila.poll()

lista.sort(...)

ordensPorCodigo.put(...)

List.copyOf(...)
```

Observe:

```text
quando uma duplicidade é detectada;
quando a ordem é preservada;
quando a ordenação muda;
quando a fila consome item;
quando o Map encontra por chave;
quando o relatório é montado.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Em qual exercício usamos LinkedHashSet e por quê?
2. Em qual exercício usamos PriorityQueue e por quê?
3. Em qual exercício usamos Map para contagem?
4. Por que o painel integrado usa várias coleções?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
ler requisito e escolher estrutura;
justificar tecnicamente a escolha;
implementar diagnóstico de estruturas;
implementar análise de importação;
usar List para original;
usar HashSet para vistos;
usar LinkedHashSet para únicos na ordem;
usar TreeSet para ordenados;
usar Map para contagem;
usar Queue para reprocessamento;
usar PriorityQueue para prioridade;
usar Comparator para desempate;
usar LinkedHashMap para cadastro por código com ordem;
usar List.copyOf para proteger retorno;
resolver desafio de produtos;
resolver desafio de chamados críticos;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-168-exercicios-integradores-collections-escolha-de-estruturas
git commit -m "Aula 168: exercicios integradores collections escolha de estruturas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
a escolha da coleção é uma decisão de modelagem.
```

Você praticou a leitura de requisitos e escolheu estruturas conforme a intenção:

```text
List para sequência;
Set para unicidade;
Map para chave-valor;
Queue para FIFO;
PriorityQueue para prioridade;
Comparator para critério;
TreeSet para ordenação;
LinkedHashSet e LinkedHashMap para ordem de inserção.
```

Na próxima aula, vamos continuar os exercícios integradores, agora com implementação guiada de um fluxo maior envolvendo importação, validação, agrupamento, fila e relatório.
