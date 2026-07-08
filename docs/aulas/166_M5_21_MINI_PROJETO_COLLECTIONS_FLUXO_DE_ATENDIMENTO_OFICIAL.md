# 166 — M5.21 — Mini-projeto Collections: fluxo de atendimento

## Objetivo da aula

Nesta aula você vai integrar várias estruturas estudadas no Módulo 5 em um mini-projeto prático.

Até aqui, você estudou:

```text
List;
ArrayList;
LinkedList;
Set;
HashSet;
LinkedHashSet;
TreeSet;
Map;
HashMap;
LinkedHashMap;
TreeMap;
Queue;
Deque;
PriorityQueue;
Collections;
Comparator;
equals;
hashCode;
Comparable;
remoção segura;
iteração;
ordenação.
```

Agora vamos juntar esses conhecimentos em um fluxo mais próximo de sistema real:

```text
fluxo de atendimento de Ordens de Serviço.
```

Ao final da aula, você deve conseguir:

```text
modelar um pequeno domínio;
usar List para histórico;
usar Set para evitar duplicidade;
usar Map para indexar por código;
usar PriorityQueue para fila prioritária;
usar Comparator para prioridade de atendimento;
usar Collections/List.copyOf para proteger retornos;
usar enum para status e prioridade;
usar LocalDateTime para datas;
usar objeto de valor como chave;
encapsular coleções em classes próprias;
separar domínio, serviço de memória e app;
montar um fluxo completo de cadastro, fila, atendimento e relatório.
```

Esta aula é um marco importante.

Você vai sair de exemplos isolados e montar um mini-fluxo.

---

## Ideia do mini-projeto

Vamos criar um sistema simples de atendimento.

Ele terá:

```text
ordens de serviço;
código único;
prioridade;
status;
fila de atendimento;
histórico de eventos;
cadastro em memória;
relatórios.
```

O fluxo será:

```text
1. cadastrar OS;
2. impedir código duplicado;
3. colocar OS em fila prioritária;
4. atender próxima OS;
5. registrar histórico;
6. concluir atendimento;
7. gerar relatórios por status;
8. listar códigos cadastrados;
9. listar histórico.
```

---

## O que cada coleção vai fazer

### Map

Usaremos `Map<CodigoOs, OrdemServico>` para buscar OS por código.

```text
Código -> OS
```

### Set

Usaremos `Set<CodigoOs>` para registrar códigos já enfileirados e evitar duplicidade na fila.

### PriorityQueue

Usaremos `PriorityQueue<OrdemServico>` para atender por prioridade.

### List

Usaremos `List<EventoAtendimento>` para histórico.

### Comparator

Usaremos `Comparator` para definir quem deve ser atendido primeiro.

### List.copyOf

Usaremos `List.copyOf` para retornar dados protegidos.

---

## Regra do atendimento

A prioridade do atendimento será:

```text
1. OS CRITICA primeiro;
2. depois ALTA;
3. depois NORMAL;
4. depois BAIXA;
5. em caso de empate, OS mais antiga primeiro;
6. em caso de novo empate, menor código primeiro.
```

Isso será implementado com `Comparator`.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-166-mini-projeto-collections-fluxo-de-atendimento
cd labs\m5\aula-166-mini-projeto-collections-fluxo-de-atendimento
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula166
mkdir src\br\com\curso\aula166\app
mkdir src\br\com\curso\aula166\dominio
mkdir src\br\com\curso\aula166\dominio\valor
mkdir src\br\com\curso\aula166\dominio\atendimento
mkdir src\br\com\curso\aula166\infra
```

---

## Código de OS como objeto de valor

Crie:

```text
src\br\com\curso\aula166\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula166.dominio.valor;

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

## Por que começar por CodigoOs

O código da OS será usado em:

```text
Map;
Set;
relatórios;
busca;
fila;
histórico.
```

Por isso ele precisa ser forte.

Ele tem:

```text
validação;
normalização;
equals;
hashCode;
Comparable.
```

Esse é um objeto de valor bem útil.

---

## Enum de prioridade

Crie:

```text
src\br\com\curso\aula166\dominio\atendimento\PrioridadeAtendimento.java
```

Código:

```java
package br.com.curso.aula166.dominio.atendimento;

public enum PrioridadeAtendimento {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

---

## Enum de status

Crie:

```text
src\br\com\curso\aula166\dominio\atendimento\StatusAtendimento.java
```

Código:

```java
package br.com.curso.aula166.dominio.atendimento;

public enum StatusAtendimento {
    CADASTRADA,
    ENFILEIRADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## Evento de atendimento

O histórico será feito com eventos.

Crie:

```text
src\br\com\curso\aula166\dominio\atendimento\TipoEventoAtendimento.java
```

Código:

```java
package br.com.curso.aula166.dominio.atendimento;

public enum TipoEventoAtendimento {
    CADASTRO_REALIZADO,
    ENTRADA_NA_FILA,
    ATENDIMENTO_INICIADO,
    ATENDIMENTO_CONCLUIDO,
    CANCELAMENTO_REALIZADO
}
```

Agora crie:

```text
src\br\com\curso\aula166\dominio\atendimento\EventoAtendimento.java
```

Código:

```java
package br.com.curso.aula166.dominio.atendimento;

import java.time.LocalDateTime;

public class EventoAtendimento {
    private final LocalDateTime dataHora;
    private final TipoEventoAtendimento tipo;
    private final String descricao;

    public EventoAtendimento(
            LocalDateTime dataHora,
            TipoEventoAtendimento tipo,
            String descricao
    ) {
        if (dataHora == null) {
            throw new IllegalArgumentException("Data/hora do evento é obrigatória.");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo do evento é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição do evento é obrigatória.");
        }

        this.dataHora = dataHora;
        this.tipo = tipo;
        this.descricao = descricao;
    }

    public LocalDateTime dataHora() {
        return dataHora;
    }

    public TipoEventoAtendimento tipo() {
        return tipo;
    }

    public String resumo() {
        return dataHora + " | " + tipo + " | " + descricao;
    }
}
```

---

## Por que criar EventoAtendimento

Em vez de guardar histórico como `String` solta, criamos um objeto.

Isso é melhor porque o evento tem estrutura:

```text
data/hora;
tipo;
descrição.
```

Esse pensamento é muito usado em sistemas profissionais.

Mesmo em um mini-projeto simples, modelar bem ajuda.

---

## Entidade OrdemServico

Crie:

```text
src\br\com\curso\aula166\dominio\atendimento\OrdemServico.java
```

Código:

```java
package br.com.curso.aula166.dominio.atendimento;

import br.com.curso.aula166.dominio.valor.CodigoOs;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final PrioridadeAtendimento prioridade;
    private final List<EventoAtendimento> historico;
    private StatusAtendimento status;

    public OrdemServico(
            CodigoOs codigo,
            String cliente,
            LocalDateTime dataEntrada,
            PrioridadeAtendimento prioridade
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

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = StatusAtendimento.CADASTRADA;
        this.historico = new ArrayList<>();

        registrarEvento(
                TipoEventoAtendimento.CADASTRO_REALIZADO,
                "OS cadastrada para o cliente " + cliente
        );
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

    public boolean podeEntrarNaFila() {
        return status == StatusAtendimento.CADASTRADA;
    }

    public boolean podeIniciarAtendimento() {
        return status == StatusAtendimento.ENFILEIRADA;
    }

    public boolean podeConcluir() {
        return status == StatusAtendimento.EM_ATENDIMENTO;
    }

    public boolean encerrada() {
        return status == StatusAtendimento.CONCLUIDA
                || status == StatusAtendimento.CANCELADA;
    }

    public void enfileirar() {
        if (!podeEntrarNaFila()) {
            throw new IllegalStateException("OS não pode entrar na fila no status: " + status);
        }

        status = StatusAtendimento.ENFILEIRADA;

        registrarEvento(
                TipoEventoAtendimento.ENTRADA_NA_FILA,
                "OS entrou na fila de atendimento"
        );
    }

    public void iniciarAtendimento() {
        if (!podeIniciarAtendimento()) {
            throw new IllegalStateException("OS não pode iniciar atendimento no status: " + status);
        }

        status = StatusAtendimento.EM_ATENDIMENTO;

        registrarEvento(
                TipoEventoAtendimento.ATENDIMENTO_INICIADO,
                "Atendimento iniciado"
        );
    }

    public void concluir() {
        if (!podeConcluir()) {
            throw new IllegalStateException("OS não pode ser concluída no status: " + status);
        }

        status = StatusAtendimento.CONCLUIDA;

        registrarEvento(
                TipoEventoAtendimento.ATENDIMENTO_CONCLUIDO,
                "Atendimento concluído"
        );
    }

    public void cancelar(String motivo) {
        if (encerrada()) {
            throw new IllegalStateException("OS já está encerrada.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo de cancelamento é obrigatório.");
        }

        status = StatusAtendimento.CANCELADA;

        registrarEvento(
                TipoEventoAtendimento.CANCELAMENTO_REALIZADO,
                "OS cancelada. Motivo: " + motivo
        );
    }

    public List<EventoAtendimento> historico() {
        return List.copyOf(historico);
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Prioridade: " + prioridade
                + " | Status: " + status;
    }

    private void registrarEvento(TipoEventoAtendimento tipo, String descricao) {
        historico.add(new EventoAtendimento(
                LocalDateTime.now(),
                tipo,
                descricao
        ));
    }
}
```

---

## O que essa entidade protege

A entidade `OrdemServico` protege regras importantes:

```text
OS começa como CADASTRADA;
só CADASTRADA pode entrar na fila;
só ENFILEIRADA pode iniciar atendimento;
só EM_ATENDIMENTO pode concluir;
OS encerrada não pode ser cancelada novamente;
histórico não é exposto como lista mutável.
```

A entidade não salva no banco.

A entidade não chama API.

A entidade protege regra de negócio.

---

## Comparador de prioridade

Vamos centralizar a regra de ordenação.

Crie:

```text
src\br\com\curso\aula166\infra\OrdenacaoAtendimento.java
```

Código:

```java
package br.com.curso.aula166.infra;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;

import java.util.Comparator;

public final class OrdenacaoAtendimento {
    private OrdenacaoAtendimento() {
    }

    public static Comparator<OrdemServico> prioridadeDataCodigo() {
        return Comparator.comparingInt((OrdemServico os) -> pesoPrioridade(os.prioridade()))
                .thenComparing(OrdemServico::dataEntrada)
                .thenComparing(OrdemServico::codigo);
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

---

## Por que separar OrdenacaoAtendimento

Essa classe centraliza o critério:

```text
prioridade;
data;
código.
```

Isso evita repetir comparador em vários lugares.

Também dá nome para a regra:

```java
prioridadeDataCodigo()
```

Esse nome comunica o comportamento.

---

## Cadastro de OS em memória

Agora vamos criar um cadastro que usa `Map`.

Crie:

```text
src\br\com\curso\aula166\infra\CadastroOrdemServicoMemoria.java
```

Código:

```java
package br.com.curso.aula166.infra;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CadastroOrdemServicoMemoria {
    private final Map<CodigoOs, OrdemServico> ordensPorCodigo;

    public CadastroOrdemServicoMemoria() {
        this.ordensPorCodigo = new LinkedHashMap<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public OrdemServico buscarObrigatoria(CodigoOs codigo) {
        OrdemServico os = ordensPorCodigo.get(codigo);

        if (os == null) {
            throw new IllegalArgumentException("OS não encontrada: " + codigo.resumo());
        }

        return os;
    }

    public boolean existe(CodigoOs codigo) {
        return ordensPorCodigo.containsKey(codigo);
    }

    public List<OrdemServico> listar() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public List<CodigoOs> listarCodigos() {
        return List.copyOf(ordensPorCodigo.keySet());
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (OrdemServico os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }
}
```

---

## O que CadastroOrdemServicoMemoria usa

Ele usa:

```text
Map<CodigoOs, OrdemServico>
```

para buscar por código.

Ele usa `LinkedHashMap` para preservar a ordem de cadastro na listagem.

Ele retorna cópias:

```java
List.copyOf(...)
```

para proteger a estrutura interna.

---

## Fila prioritária de atendimento

Agora vamos criar uma fila que usa:

```text
PriorityQueue;
Set;
Comparator.
```

Crie:

```text
src\br\com\curso\aula166\infra\FilaAtendimentoPrioritariaMemoria.java
```

Código:

```java
package br.com.curso.aula166.infra;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;

public class FilaAtendimentoPrioritariaMemoria {
    private final Queue<OrdemServico> fila;
    private final Set<CodigoOs> codigosNaFila;

    public FilaAtendimentoPrioritariaMemoria() {
        this.fila = new PriorityQueue<>(OrdenacaoAtendimento.prioridadeDataCodigo());
        this.codigosNaFila = new HashSet<>();
    }

    public void adicionar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (codigosNaFila.contains(os.codigo())) {
            throw new IllegalStateException("OS já está na fila: " + os.codigo().resumo());
        }

        os.enfileirar();

        fila.offer(os);
        codigosNaFila.add(os.codigo());
    }

    public OrdemServico proxima() {
        return fila.peek();
    }

    public OrdemServico retirarProxima() {
        OrdemServico os = fila.poll();

        if (os != null) {
            codigosNaFila.remove(os.codigo());
        }

        return os;
    }

    public boolean contem(CodigoOs codigo) {
        return codigosNaFila.contains(codigo);
    }

    public int quantidade() {
        return fila.size();
    }

    public boolean vazia() {
        return fila.isEmpty();
    }
}
```

---

## Por que usar Set junto com PriorityQueue

`PriorityQueue` não é boa para verificar duplicidade de forma expressiva.

Por isso usamos:

```java
Set<CodigoOs> codigosNaFila
```

Assim, antes de colocar na fila, verificamos:

```java
codigosNaFila.contains(os.codigo())
```

Cada coleção faz seu papel:

```text
PriorityQueue:
ordem de atendimento.

Set:
controle de duplicidade.
```

Esse é um exemplo importante de composição de estruturas.

---

## Serviço de atendimento

Agora vamos criar uma classe que coordena cadastro e fila.

Crie:

```text
src\br\com\curso\aula166\infra\FluxoAtendimentoMemoria.java
```

Código:

```java
package br.com.curso.aula166.infra;

import br.com.curso.aula166.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;

import java.util.List;
import java.util.Map;

public class FluxoAtendimentoMemoria {
    private final CadastroOrdemServicoMemoria cadastro;
    private final FilaAtendimentoPrioritariaMemoria fila;

    public FluxoAtendimentoMemoria() {
        this.cadastro = new CadastroOrdemServicoMemoria();
        this.fila = new FilaAtendimentoPrioritariaMemoria();
    }

    public void cadastrar(OrdemServico os) {
        cadastro.cadastrar(os);
    }

    public void colocarNaFila(CodigoOs codigo) {
        OrdemServico os = cadastro.buscarObrigatoria(codigo);
        fila.adicionar(os);
    }

    public OrdemServico proximaDaFila() {
        return fila.proxima();
    }

    public OrdemServico atenderProxima() {
        OrdemServico os = fila.retirarProxima();

        if (os == null) {
            return null;
        }

        os.iniciarAtendimento();
        os.concluir();

        return os;
    }

    public void cancelar(CodigoOs codigo, String motivo) {
        OrdemServico os = cadastro.buscarObrigatoria(codigo);
        os.cancelar(motivo);
    }

    public List<OrdemServico> listarOrdens() {
        return cadastro.listar();
    }

    public List<CodigoOs> listarCodigos() {
        return cadastro.listarCodigos();
    }

    public List<EventoAtendimento> historico(CodigoOs codigo) {
        OrdemServico os = cadastro.buscarObrigatoria(codigo);
        return os.historico();
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        return cadastro.contarPorStatus();
    }

    public int quantidadeCadastrada() {
        return cadastro.quantidade();
    }

    public int quantidadeNaFila() {
        return fila.quantidade();
    }
}
```

---

## O papel do FluxoAtendimentoMemoria

Essa classe coordena o caso de uso em memória.

Ela não é entidade.

Ela não é controller.

Ela não é banco.

Ela coordena:

```text
cadastro;
fila;
busca;
atendimento;
relatórios.
```

Essa separação será muito importante quando chegarmos em arquitetura, Spring Boot, APIs, services, repositories e persistência.

---

## App principal do mini-projeto

Crie:

```text
src\br\com\curso\aula166\app\MiniProjetoFluxoAtendimentoApp.java
```

Código:

```java
package br.com.curso.aula166.app;

import br.com.curso.aula166.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula166.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;
import br.com.curso.aula166.infra.FluxoAtendimentoMemoria;

import java.time.LocalDateTime;
import java.util.Map;

public class MiniProjetoFluxoAtendimentoApp {
    public static void main(String[] args) {
        FluxoAtendimentoMemoria fluxo = new FluxoAtendimentoMemoria();

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 10),
                PrioridadeAtendimento.CRITICA
        ));

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDateTime.of(2026, 12, 10, 9, 5),
                PrioridadeAtendimento.ALTA
        ));

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0004"),
                "Bruno Rocha",
                LocalDateTime.of(2026, 12, 10, 9, 20),
                PrioridadeAtendimento.BAIXA
        ));

        fluxo.colocarNaFila(new CodigoOs("OS-2026-0001"));
        fluxo.colocarNaFila(new CodigoOs("OS-2026-0002"));
        fluxo.colocarNaFila(new CodigoOs("OS-2026-0003"));
        fluxo.colocarNaFila(new CodigoOs("OS-2026-0004"));

        System.out.println("Quantidade cadastrada: " + fluxo.quantidadeCadastrada());
        System.out.println("Quantidade na fila: " + fluxo.quantidadeNaFila());

        System.out.println();
        System.out.println("Próxima da fila:");

        OrdemServico proxima = fluxo.proximaDaFila();

        if (proxima != null) {
            System.out.println(proxima.resumo());
        }

        System.out.println();
        System.out.println("Atendendo fila:");

        OrdemServico atendida;

        while ((atendida = fluxo.atenderProxima()) != null) {
            System.out.println("- " + atendida.resumo());
        }

        System.out.println();
        System.out.println("Relatório por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : fluxo.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }

        System.out.println();
        System.out.println("Histórico da OS-2026-0002:");

        for (EventoAtendimento evento : fluxo.historico(new CodigoOs("OS-2026-0002"))) {
            System.out.println("- " + evento.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula166.app.MiniProjetoFluxoAtendimentoApp
```

---

## O que observar no app principal

O app demonstra:

```text
cadastro;
fila prioritária;
controle de duplicidade;
atendimento por prioridade;
mudança de status;
histórico;
relatório por status.
```

A OS crítica deve ser atendida antes da normal, mesmo tendo sido cadastrada depois.

Isso mostra o uso correto de `PriorityQueue`.

---

## Teste de duplicidade no cadastro

Crie:

```text
src\br\com\curso\aula166\app\MiniProjetoDuplicidadeCadastroApp.java
```

Código:

```java
package br.com.curso.aula166.app;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;
import br.com.curso.aula166.infra.FluxoAtendimentoMemoria;

import java.time.LocalDateTime;

public class MiniProjetoDuplicidadeCadastroApp {
    public static void main(String[] args) {
        FluxoAtendimentoMemoria fluxo = new FluxoAtendimentoMemoria();

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        try {
            fluxo.cadastrar(new OrdemServico(
                    new CodigoOs("os-2026-0001"),
                    "Carlos Souza",
                    LocalDateTime.of(2026, 12, 10, 9, 10),
                    PrioridadeAtendimento.ALTA
            ));
        } catch (IllegalStateException erro) {
            System.out.println("Duplicidade bloqueada: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula166.app.MiniProjetoDuplicidadeCadastroApp
```

---

## O que esse teste prova

A duplicidade é bloqueada porque:

```text
CodigoOs normaliza o texto;
equals/hashCode funcionam;
Map usa CodigoOs como chave.
```

Mesmo usando:

```text
OS-2026-0001
os-2026-0001
```

o sistema entende que é o mesmo código.

---

## Teste de duplicidade na fila

Crie:

```text
src\br\com\curso\aula166\app\MiniProjetoDuplicidadeFilaApp.java
```

Código:

```java
package br.com.curso.aula166.app;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;
import br.com.curso.aula166.infra.FluxoAtendimentoMemoria;

import java.time.LocalDateTime;

public class MiniProjetoDuplicidadeFilaApp {
    public static void main(String[] args) {
        FluxoAtendimentoMemoria fluxo = new FluxoAtendimentoMemoria();

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        fluxo.colocarNaFila(new CodigoOs("OS-2026-0001"));

        try {
            fluxo.colocarNaFila(new CodigoOs("OS-2026-0001"));
        } catch (RuntimeException erro) {
            System.out.println("Entrada duplicada na fila bloqueada: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula166.app.MiniProjetoDuplicidadeFilaApp
```

---

## Observação importante

Neste caso, a própria entidade também ajuda.

Depois que a OS entra na fila, o status muda para:

```text
ENFILEIRADA
```

Então ela não poderia entrar novamente.

Além disso, a fila tem um `Set<CodigoOs>`.

Esse é um exemplo de defesa em camadas:

```text
entidade protege status;
fila protege duplicidade de enfileiramento.
```

---

## Teste de cancelamento

Crie:

```text
src\br\com\curso\aula166\app\MiniProjetoCancelamentoApp.java
```

Código:

```java
package br.com.curso.aula166.app;

import br.com.curso.aula166.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;
import br.com.curso.aula166.infra.FluxoAtendimentoMemoria;

import java.time.LocalDateTime;

public class MiniProjetoCancelamentoApp {
    public static void main(String[] args) {
        FluxoAtendimentoMemoria fluxo = new FluxoAtendimentoMemoria();

        CodigoOs codigo = new CodigoOs("OS-2026-0001");

        fluxo.cadastrar(new OrdemServico(
                codigo,
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        fluxo.cancelar(codigo, "Cliente solicitou cancelamento.");

        System.out.println("Histórico:");

        for (EventoAtendimento evento : fluxo.historico(codigo)) {
            System.out.println("- " + evento.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula166.app.MiniProjetoCancelamentoApp
```

---

## Relatório de códigos ordenados

Agora vamos usar `TreeSet` para gerar uma visão ordenada dos códigos.

Crie:

```text
src\br\com\curso\aula166\app\MiniProjetoCodigosOrdenadosApp.java
```

Código:

```java
package br.com.curso.aula166.app;

import br.com.curso.aula166.dominio.atendimento.OrdemServico;
import br.com.curso.aula166.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula166.dominio.valor.CodigoOs;
import br.com.curso.aula166.infra.FluxoAtendimentoMemoria;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.TreeSet;

public class MiniProjetoCodigosOrdenadosApp {
    public static void main(String[] args) {
        FluxoAtendimentoMemoria fluxo = new FluxoAtendimentoMemoria();

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDateTime.of(2026, 12, 10, 9, 5),
                PrioridadeAtendimento.ALTA
        ));

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        fluxo.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 10),
                PrioridadeAtendimento.CRITICA
        ));

        Set<CodigoOs> codigosOrdenados = new TreeSet<>(fluxo.listarCodigos());

        System.out.println("Códigos ordenados:");

        for (CodigoOs codigo : codigosOrdenados) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula166.app.MiniProjetoCodigosOrdenadosApp
```

---

## O que esse relatório mostra

O cadastro usa `LinkedHashMap`, preservando ordem de cadastro.

Mas para relatório ordenado, criamos:

```java
new TreeSet<>(fluxo.listarCodigos())
```

Isso mostra uma ideia importante:

```text
a estrutura interna pode ser uma;
a visão de relatório pode usar outra.
```

Você não precisa misturar tudo em uma estrutura só.

---

## Onde cada estrutura aparece no mini-projeto

```text
CodigoOs:
objeto de valor com equals, hashCode e Comparable.

OrdemServico:
entidade com regra de status e histórico.

EventoAtendimento:
objeto de histórico.

CadastroOrdemServicoMemoria:
usa Map para indexar por código.

FilaAtendimentoPrioritariaMemoria:
usa PriorityQueue para prioridade.

FilaAtendimentoPrioritariaMemoria:
usa Set para evitar duplicidade na fila.

FluxoAtendimentoMemoria:
coordena cadastro e fila.

MiniProjetoFluxoAtendimentoApp:
executa cenário completo.

TreeSet:
gera relatório de códigos ordenados.
```

---

## Análise arquitetural do mini-projeto

Mesmo sendo um projeto de console, ele já tem separação importante:

```text
dominio:
objetos e regras.

infra:
estruturas em memória e coordenação técnica simples.

app:
execução do cenário.
```

Mais adiante, em uma aplicação real:

```text
app poderia virar controller;
infra poderia virar repository;
fluxo poderia virar use case/application service;
domínio continuaria protegendo regra.
```

Esse é o caminho para chegar em arquitetura.

---

## Limitações deste mini-projeto

Este mini-projeto é em memória.

Então ele não possui:

```text
banco de dados;
transação;
API REST;
Spring Boot;
concorrência;
segurança;
mensageria real;
logs estruturados;
testes automatizados;
persistência de histórico.
```

Esses assuntos virão depois.

Mas a base mental já está sendo construída.

Você está aprendendo a separar responsabilidades antes de colocar framework.

---

## Por que isso importa antes de Spring Boot

Quando chegar em Spring Boot, muita gente faz tudo assim:

```text
Controller gigante;
regra dentro do endpoint;
entity anêmica;
repository usado em qualquer lugar;
DTO virando domínio;
service sem coesão.
```

Nosso caminho é diferente.

Primeiro você aprende:

```text
domínio;
coleções;
regras;
objetos;
responsabilidades;
fluxo;
coordenação.
```

Depois o framework entra para expor, persistir, validar, integrar e operar.

Esse é o caminho para formar engenheiro, não apenas copiador de código.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar domínio

Crie e revise:

```text
CodigoOs;
PrioridadeAtendimento;
StatusAtendimento;
TipoEventoAtendimento;
EventoAtendimento;
OrdemServico.
```

Confirme que:

```text
CodigoOs valida e normaliza;
OrdemServico protege transições de status;
histórico retorna List.copyOf.
```

### Parte 2 — Criar infraestrutura em memória

Crie e revise:

```text
OrdenacaoAtendimento;
CadastroOrdemServicoMemoria;
FilaAtendimentoPrioritariaMemoria;
FluxoAtendimentoMemoria.
```

Confirme que:

```text
Cadastro usa Map;
Fila usa PriorityQueue;
Fila usa Set;
Fluxo coordena.
```

### Parte 3 — Executar fluxo principal

Execute:

```powershell
java -cp out br.com.curso.aula166.app.MiniProjetoFluxoAtendimentoApp
```

Observe:

```text
ordem de atendimento;
status final;
histórico;
relatório.
```

### Parte 4 — Executar validações

Execute:

```powershell
java -cp out br.com.curso.aula166.app.MiniProjetoDuplicidadeCadastroApp
java -cp out br.com.curso.aula166.app.MiniProjetoDuplicidadeFilaApp
java -cp out br.com.curso.aula166.app.MiniProjetoCancelamentoApp
java -cp out br.com.curso.aula166.app.MiniProjetoCodigosOrdenadosApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula166\app\MiniProjetoFluxoComCancelamentoApp.java
```

Ele deve:

```text
cadastrar 5 OS;
cancelar uma OS antes de entrar na fila;
colocar as demais na fila;
atender todas;
gerar relatório por status;
exibir histórico da OS cancelada;
exibir histórico de uma OS atendida.
```

Critério principal:

```text
OS cancelada não deve entrar na fila.
```

Para isso, pode ser necessário tratar a exceção ou validar o status antes.

---

## Desafio extra

Crie uma melhoria no fluxo:

```text
método listarOrdensPorPrioridade()
```

Esse método deve:

```text
retornar uma List<OrdemServico>;
não alterar a ordem interna do cadastro;
ordenar por prioridade, data e código;
retornar lista protegida.
```

Sugestão:

```text
adicionar método em FluxoAtendimentoMemoria;
usar nova ArrayList com cadastro.listar();
usar OrdenacaoAtendimento.prioridadeDataCodigo();
usar List.copyOf.
```

Depois crie:

```text
src\br\com\curso\aula166\app\MiniProjetoRelatorioOrdenadoApp.java
```

Critério principal:

```text
a ordenação do relatório não pode alterar a estrutura interna original.
```

---

## Erros comuns nesta aula

### 1. Tentar fazer tudo no app

O app deve executar cenário.

A regra deve ficar no domínio ou nas classes de fluxo.

### 2. Usar String para status

Use enum.

### 3. Usar String solta para código

Use `CodigoOs`.

### 4. Usar List para buscar por código

Para busca por código, `Map` é mais adequado.

### 5. Usar PriorityQueue para duplicidade

Use `Set` para duplicidade.

### 6. Retornar lista interna mutável

Use `List.copyOf`.

### 7. Deixar a fila alterar regra de status manualmente

A própria OS deve mudar seu status por métodos de comportamento.

### 8. Confundir estrutura em memória com persistência real

Map, Set, Queue e List aqui estão em memória.

Banco de dados virá depois.

---

## Debug recomendado

Use debug em:

```text
OrdemServico.java
CadastroOrdemServicoMemoria.java
FilaAtendimentoPrioritariaMemoria.java
FluxoAtendimentoMemoria.java
MiniProjetoFluxoAtendimentoApp.java
MiniProjetoDuplicidadeCadastroApp.java
MiniProjetoDuplicidadeFilaApp.java
MiniProjetoCodigosOrdenadosApp.java
```

Breakpoints recomendados:

```java
new CodigoOs(...)

registrarEvento(...)

os.enfileirar()

fila.offer(os)

codigosNaFila.add(...)

fila.poll()

codigosNaFila.remove(...)

os.iniciarAtendimento()

os.concluir()

contagem.merge(...)

new TreeSet<>(...)
```

Observe:

```text
quando a OS muda de status;
quando o histórico recebe evento;
como o Map encontra por código;
como o Set bloqueia duplicidade;
como a PriorityQueue escolhe a próxima;
como o relatório por status é montado;
como TreeSet ordena os códigos.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual coleção foi usada para buscar OS por código?
2. Qual coleção foi usada para evitar duplicidade na fila?
3. Qual coleção foi usada para atender por prioridade?
4. Por que List.copyOf aparece no projeto?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o mini-projeto;
criar CodigoOs;
criar enums de status e prioridade;
criar EventoAtendimento;
criar OrdemServico com histórico;
usar List para histórico;
usar Map para cadastro por código;
usar Set para duplicidade na fila;
usar PriorityQueue para atendimento prioritário;
usar Comparator para regra de prioridade;
usar TreeSet para relatório ordenado;
usar List.copyOf para proteger retornos;
criar FluxoAtendimentoMemoria;
executar MiniProjetoFluxoAtendimentoApp;
executar cenários de duplicidade;
executar cenário de cancelamento;
resolver MiniProjetoFluxoComCancelamentoApp;
resolver MiniProjetoRelatorioOrdenadoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-166-mini-projeto-collections-fluxo-de-atendimento
git commit -m "Aula 166: mini projeto collections fluxo de atendimento"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
coleções não são apenas estruturas isoladas; elas trabalham juntas para resolver fluxos reais.
```

Você usou:

```text
List para histórico;
Map para índice;
Set para duplicidade;
PriorityQueue para prioridade;
TreeSet para relatório ordenado;
Comparator para regra de ordenação;
List.copyOf para proteção.
```

Esse mini-projeto conecta fundamentos com pensamento de backend.

Na próxima aula, vamos fazer uma revisão técnica do Módulo 5 até aqui, consolidando escolhas de estrutura, erros comuns e critérios de decisão para usar List, Set, Map, Queue, Deque e PriorityQueue com segurança.
