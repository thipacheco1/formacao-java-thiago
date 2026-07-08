# 170 — M5.25 — Projeto final Collections: cadastro, relatório e processamento

## Objetivo da aula

Nesta aula você vai construir o projeto final do Módulo 5.

O objetivo é consolidar, em um único mini-sistema, o uso profissional das principais estruturas do Java Collections Framework estudadas até aqui:

```text
List;
Set;
Map;
Queue;
PriorityQueue;
TreeSet;
LinkedHashMap;
LinkedHashSet;
Comparator;
Collections;
List.copyOf.
```

Você vai montar um sistema em memória para:

```text
cadastrar Ordens de Serviço;
impedir duplicidade;
selecionar OS para atendimento;
enfileirar por prioridade;
processar atendimentos;
registrar histórico;
gerar relatórios;
listar dados em diferentes ordens.
```

Ao final da aula, você deve conseguir:

```text
modelar um domínio pequeno com regra de status;
usar objeto de valor como chave;
usar Map para cadastro por código;
usar Set para seleção sem duplicidade;
usar PriorityQueue para fila de atendimento;
usar List para histórico;
usar TreeSet para relatório ordenado;
usar Comparator para prioridade;
usar Map para contagens;
proteger retornos com cópia;
organizar classes por responsabilidade;
explicar por que cada coleção foi escolhida.
```

Esta aula fecha o ciclo principal de Collections.

---

## Visão geral do projeto

Vamos criar um mini-sistema chamado:

```text
Sistema de Atendimento Collections
```

Ele terá os seguintes fluxos:

```text
1. Cadastro de OS.
2. Seleção de OS.
3. Enfileiramento para atendimento.
4. Atendimento por prioridade.
5. Conclusão automática no processamento.
6. Histórico por OS.
7. Relatório por status.
8. Relatório por prioridade.
9. Códigos ordenados.
10. Listagem por cliente.
```

---

## Estruturas usadas no projeto

### Map

Usaremos:

```java
Map<CodigoOs, OrdemServico>
```

Para cadastrar e buscar OS por código.

### LinkedHashMap

A implementação será `LinkedHashMap` para preservar ordem de cadastro.

### LinkedHashSet

Usaremos `LinkedHashSet` para selecionar OS sem duplicidade mantendo ordem de seleção.

### PriorityQueue

Usaremos `PriorityQueue` para processar OS por prioridade de atendimento.

### List

Usaremos `List` para histórico e relatórios.

### TreeSet

Usaremos `TreeSet` para exibir códigos ordenados.

### Comparator

Usaremos `Comparator` para definir prioridade de atendimento.

---

## Regra de prioridade

A fila de atendimento seguirá esta ordem:

```text
1. CRITICA;
2. ALTA;
3. NORMAL;
4. BAIXA.
```

Em caso de empate:

```text
1. data de entrada mais antiga;
2. menor código da OS.
```

Esse critério será centralizado em uma classe própria.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-170-projeto-final-collections-cadastro-relatorio-e-processamento
cd labs\m5\aula-170-projeto-final-collections-cadastro-relatorio-e-processamento
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula170
mkdir src\br\com\curso\aula170\app
mkdir src\br\com\curso\aula170\dominio
mkdir src\br\com\curso\aula170\dominio\valor
mkdir src\br\com\curso\aula170\dominio\atendimento
mkdir src\br\com\curso\aula170\infra
```

---

## CodigoOs

Crie:

```text
src\br\com\curso\aula170\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula170.dominio.valor;

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

## Por que CodigoOs é forte

`CodigoOs` será usado como:

```text
chave de Map;
elemento de Set;
elemento de TreeSet;
critério de desempate na fila;
identificador do domínio.
```

Por isso, ele precisa ter:

```text
validação;
normalização;
equals;
hashCode;
compareTo.
```

Esse é um ponto central do Módulo 5.

Coleções boas dependem de objetos bem modelados.

---

## Enums do domínio

Crie:

```text
src\br\com\curso\aula170\dominio\atendimento\PrioridadeAtendimento.java
```

Código:

```java
package br.com.curso.aula170.dominio.atendimento;

public enum PrioridadeAtendimento {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula170\dominio\atendimento\StatusAtendimento.java
```

Código:

```java
package br.com.curso.aula170.dominio.atendimento;

public enum StatusAtendimento {
    CADASTRADA,
    SELECIONADA,
    ENFILEIRADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula170\dominio\atendimento\TipoEventoAtendimento.java
```

Código:

```java
package br.com.curso.aula170.dominio.atendimento;

public enum TipoEventoAtendimento {
    CADASTRADA,
    SELECIONADA,
    ENFILEIRADA,
    ATENDIMENTO_INICIADO,
    ATENDIMENTO_CONCLUIDO,
    CANCELADA
}
```

---

## Evento de atendimento

Crie:

```text
src\br\com\curso\aula170\dominio\atendimento\EventoAtendimento.java
```

Código:

```java
package br.com.curso.aula170.dominio.atendimento;

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
        this.descricao = descricao.trim();
    }

    public LocalDateTime dataHora() {
        return dataHora;
    }

    public TipoEventoAtendimento tipo() {
        return tipo;
    }

    public String descricao() {
        return descricao;
    }

    public String resumo() {
        return dataHora + " | " + tipo + " | " + descricao;
    }
}
```

---

## Entidade OrdemServico

Crie:

```text
src\br\com\curso\aula170\dominio\atendimento\OrdemServico.java
```

Código:

```java
package br.com.curso.aula170.dominio.atendimento;

import br.com.curso.aula170.dominio.valor.CodigoOs;

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
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = StatusAtendimento.CADASTRADA;
        this.historico = new ArrayList<>();

        registrarEvento(TipoEventoAtendimento.CADASTRADA, "OS cadastrada.");
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

    public boolean cadastrada() {
        return status == StatusAtendimento.CADASTRADA;
    }

    public boolean selecionada() {
        return status == StatusAtendimento.SELECIONADA;
    }

    public boolean enfileirada() {
        return status == StatusAtendimento.ENFILEIRADA;
    }

    public boolean emAtendimento() {
        return status == StatusAtendimento.EM_ATENDIMENTO;
    }

    public boolean encerrada() {
        return status == StatusAtendimento.CONCLUIDA
                || status == StatusAtendimento.CANCELADA;
    }

    public void selecionar() {
        if (!cadastrada()) {
            throw new IllegalStateException("Somente OS cadastrada pode ser selecionada. Status atual: " + status);
        }

        status = StatusAtendimento.SELECIONADA;
        registrarEvento(TipoEventoAtendimento.SELECIONADA, "OS selecionada para atendimento.");
    }

    public void enfileirar() {
        if (!selecionada()) {
            throw new IllegalStateException("Somente OS selecionada pode ser enfileirada. Status atual: " + status);
        }

        status = StatusAtendimento.ENFILEIRADA;
        registrarEvento(TipoEventoAtendimento.ENFILEIRADA, "OS enviada para fila de atendimento.");
    }

    public void iniciarAtendimento() {
        if (!enfileirada()) {
            throw new IllegalStateException("Somente OS enfileirada pode iniciar atendimento. Status atual: " + status);
        }

        status = StatusAtendimento.EM_ATENDIMENTO;
        registrarEvento(TipoEventoAtendimento.ATENDIMENTO_INICIADO, "Atendimento iniciado.");
    }

    public void concluir() {
        if (!emAtendimento()) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída. Status atual: " + status);
        }

        status = StatusAtendimento.CONCLUIDA;
        registrarEvento(TipoEventoAtendimento.ATENDIMENTO_CONCLUIDO, "Atendimento concluído.");
    }

    public void cancelar(String motivo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser cancelada novamente.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo de cancelamento é obrigatório.");
        }

        status = StatusAtendimento.CANCELADA;
        registrarEvento(TipoEventoAtendimento.CANCELADA, "OS cancelada. Motivo: " + motivo.trim());
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
        historico.add(new EventoAtendimento(LocalDateTime.now(), tipo, descricao));
    }
}
```

---

## O que a entidade protege

A entidade protege as transições:

```text
CADASTRADA -> SELECIONADA;
SELECIONADA -> ENFILEIRADA;
ENFILEIRADA -> EM_ATENDIMENTO;
EM_ATENDIMENTO -> CONCLUIDA.
```

Ela também permite cancelamento, desde que a OS não esteja encerrada.

Importante:

```text
a entidade não sabe sobre Map;
a entidade não sabe sobre Queue;
a entidade não sabe sobre banco;
a entidade não sabe sobre controller.
```

A entidade protege regra de negócio.

---

## Ordenação de atendimento

Crie:

```text
src\br\com\curso\aula170\infra\OrdenacaoAtendimento.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;

import java.util.Comparator;

public final class OrdenacaoAtendimento {
    private OrdenacaoAtendimento() {
    }

    public static Comparator<OrdemServico> porPrioridadeDataCodigo() {
        return Comparator.comparingInt((OrdemServico os) -> peso(os.prioridade()))
                .thenComparing(OrdemServico::dataEntrada)
                .thenComparing(OrdemServico::codigo);
    }

    private static int peso(PrioridadeAtendimento prioridade) {
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

## Cadastro de OS em memória

Crie:

```text
src\br\com\curso\aula170\infra\CadastroOsMemoria.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

public class CadastroOsMemoria {
    private final Map<CodigoOs, OrdemServico> ordensPorCodigo;

    public CadastroOsMemoria() {
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

    public List<OrdemServico> listarNaOrdemDeCadastro() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public List<OrdemServico> listarPorCliente() {
        List<OrdemServico> lista = new ArrayList<>(ordensPorCodigo.values());

        lista.sort(Comparator.comparing(OrdemServico::cliente)
                .thenComparing(OrdemServico::codigo));

        return List.copyOf(lista);
    }

    public TreeSet<CodigoOs> codigosOrdenados() {
        return new TreeSet<>(ordensPorCodigo.keySet());
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (StatusAtendimento status : StatusAtendimento.values()) {
            contagem.put(status, 0);
        }

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

## Por que CadastroOsMemoria usa LinkedHashMap

O cadastro precisa:

```text
buscar por código;
impedir duplicidade;
listar na ordem de cadastro.
```

Então usamos:

```java
LinkedHashMap<CodigoOs, OrdemServico>
```

Se não precisássemos da ordem de cadastro, `HashMap` seria suficiente.

---

## Seleção de OS

Crie:

```text
src\br\com\curso\aula170\infra\SelecaoOsMemoria.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.valor.CodigoOs;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class SelecaoOsMemoria {
    private final Set<CodigoOs> selecionadas;

    public SelecaoOsMemoria() {
        this.selecionadas = new LinkedHashSet<>();
    }

    public boolean selecionar(CodigoOs codigo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        return selecionadas.add(codigo);
    }

    public boolean contem(CodigoOs codigo) {
        return selecionadas.contains(codigo);
    }

    public void remover(CodigoOs codigo) {
        selecionadas.remove(codigo);
    }

    public List<CodigoOs> listarNaOrdemDeSelecao() {
        return List.copyOf(selecionadas);
    }

    public int quantidade() {
        return selecionadas.size();
    }

    public boolean vazia() {
        return selecionadas.isEmpty();
    }

    public void limpar() {
        selecionadas.clear();
    }
}
```

---

## Por que seleção usa LinkedHashSet

A seleção precisa:

```text
impedir duplicidade;
preservar ordem de seleção.
```

Então:

```java
LinkedHashSet
```

é a escolha correta.

`HashSet` impediria duplicidade, mas não manteria ordem.

`List` manteria ordem, mas não bloquearia duplicidade naturalmente.

---

## Fila prioritária de atendimento

Crie:

```text
src\br\com\curso\aula170\infra\FilaAtendimentoMemoria.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;

public class FilaAtendimentoMemoria {
    private final Queue<OrdemServico> fila;
    private final Set<CodigoOs> codigosNaFila;

    public FilaAtendimentoMemoria() {
        this.fila = new PriorityQueue<>(OrdenacaoAtendimento.porPrioridadeDataCodigo());
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

## Por que fila usa PriorityQueue e HashSet

A fila precisa:

```text
processar por prioridade;
evitar o mesmo código duas vezes na fila.
```

Então usamos duas estruturas:

```text
PriorityQueue:
ordem de atendimento.

HashSet:
controle rápido de duplicidade.
```

Uma estrutura não precisa resolver tudo sozinha.

---

## Relatórios

Crie:

```text
src\br\com\curso\aula170\infra\RelatorioOsMemoria.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.atendimento.StatusAtendimento;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RelatorioOsMemoria {
    public Map<PrioridadeAtendimento, Integer> contarPorPrioridade(List<OrdemServico> ordens) {
        Map<PrioridadeAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (PrioridadeAtendimento prioridade : PrioridadeAtendimento.values()) {
            contagem.put(prioridade, 0);
        }

        for (OrdemServico os : ordens) {
            contagem.merge(os.prioridade(), 1, Integer::sum);
        }

        return contagem;
    }

    public Map<StatusAtendimento, Integer> contarPorStatus(List<OrdemServico> ordens) {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (StatusAtendimento status : StatusAtendimento.values()) {
            contagem.put(status, 0);
        }

        for (OrdemServico os : ordens) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public Map<PrioridadeAtendimento, List<OrdemServico>> agruparPorPrioridade(List<OrdemServico> ordens) {
        Map<PrioridadeAtendimento, List<OrdemServico>> agrupamento = new LinkedHashMap<>();

        for (PrioridadeAtendimento prioridade : PrioridadeAtendimento.values()) {
            agrupamento.put(prioridade, new java.util.ArrayList<>());
        }

        for (OrdemServico os : ordens) {
            agrupamento.get(os.prioridade()).add(os);
        }

        Map<PrioridadeAtendimento, List<OrdemServico>> protegido = new LinkedHashMap<>();

        for (Map.Entry<PrioridadeAtendimento, List<OrdemServico>> entrada : agrupamento.entrySet()) {
            protegido.put(entrada.getKey(), List.copyOf(entrada.getValue()));
        }

        return protegido;
    }
}
```

---

## Sistema coordenador

Agora vamos juntar cadastro, seleção, fila e relatórios.

Crie:

```text
src\br\com\curso\aula170\infra\SistemaAtendimentoCollectionsMemoria.java
```

Código:

```java
package br.com.curso.aula170.infra;

import br.com.curso.aula170.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;

import java.util.List;
import java.util.Map;
import java.util.TreeSet;

public class SistemaAtendimentoCollectionsMemoria {
    private final CadastroOsMemoria cadastro;
    private final SelecaoOsMemoria selecao;
    private final FilaAtendimentoMemoria fila;
    private final RelatorioOsMemoria relatorio;

    public SistemaAtendimentoCollectionsMemoria() {
        this.cadastro = new CadastroOsMemoria();
        this.selecao = new SelecaoOsMemoria();
        this.fila = new FilaAtendimentoMemoria();
        this.relatorio = new RelatorioOsMemoria();
    }

    public void cadastrar(OrdemServico os) {
        cadastro.cadastrar(os);
    }

    public boolean selecionar(CodigoOs codigo) {
        OrdemServico os = cadastro.buscarObrigatoria(codigo);

        boolean selecionou = selecao.selecionar(codigo);

        if (selecionou) {
            os.selecionar();
        }

        return selecionou;
    }

    public void enviarSelecionadasParaFila() {
        for (CodigoOs codigo : selecao.listarNaOrdemDeSelecao()) {
            OrdemServico os = cadastro.buscarObrigatoria(codigo);
            fila.adicionar(os);
        }

        selecao.limpar();
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

        if (selecao.contem(codigo)) {
            selecao.remover(codigo);
        }
    }

    public List<OrdemServico> listarNaOrdemDeCadastro() {
        return cadastro.listarNaOrdemDeCadastro();
    }

    public List<OrdemServico> listarPorCliente() {
        return cadastro.listarPorCliente();
    }

    public TreeSet<CodigoOs> codigosOrdenados() {
        return cadastro.codigosOrdenados();
    }

    public List<CodigoOs> selecionadas() {
        return selecao.listarNaOrdemDeSelecao();
    }

    public List<EventoAtendimento> historico(CodigoOs codigo) {
        return cadastro.buscarObrigatoria(codigo).historico();
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        return relatorio.contarPorStatus(cadastro.listarNaOrdemDeCadastro());
    }

    public Map<PrioridadeAtendimento, Integer> contarPorPrioridade() {
        return relatorio.contarPorPrioridade(cadastro.listarNaOrdemDeCadastro());
    }

    public Map<PrioridadeAtendimento, List<OrdemServico>> agruparPorPrioridade() {
        return relatorio.agruparPorPrioridade(cadastro.listarNaOrdemDeCadastro());
    }

    public int quantidadeCadastrada() {
        return cadastro.quantidade();
    }

    public int quantidadeSelecionada() {
        return selecao.quantidade();
    }

    public int quantidadeNaFila() {
        return fila.quantidade();
    }
}
```

---

## Papel do sistema coordenador

Essa classe coordena o fluxo.

Ela usa:

```text
CadastroOsMemoria;
SelecaoOsMemoria;
FilaAtendimentoMemoria;
RelatorioOsMemoria.
```

Ela não é entidade.

Ela não é controller.

Ela não é repository de banco.

Ela é uma coordenação em memória para o projeto do módulo.

Mais adiante, esse tipo de classe lembra um `Application Service` ou `Use Case`.

---

## App principal

Crie:

```text
src\br\com\curso\aula170\app\ProjetoFinalCollectionsApp.java
```

Código:

```java
package br.com.curso.aula170.app;

import br.com.curso.aula170.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;
import br.com.curso.aula170.infra.SistemaAtendimentoCollectionsMemoria;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ProjetoFinalCollectionsApp {
    public static void main(String[] args) {
        SistemaAtendimentoCollectionsMemoria sistema = new SistemaAtendimentoCollectionsMemoria();

        cadastrarDados(sistema);

        sistema.selecionar(new CodigoOs("OS-2026-0003"));
        sistema.selecionar(new CodigoOs("OS-2026-0001"));
        sistema.selecionar(new CodigoOs("OS-2026-0002"));
        sistema.selecionar(new CodigoOs("OS-2026-0004"));

        System.out.println("Selecionadas:");
        for (CodigoOs codigo : sistema.selecionadas()) {
            System.out.println("- " + codigo.resumo());
        }

        sistema.enviarSelecionadasParaFila();

        System.out.println();
        System.out.println("Próxima da fila:");

        OrdemServico proxima = sistema.proximaDaFila();

        if (proxima != null) {
            System.out.println("- " + proxima.resumo());
        }

        System.out.println();
        System.out.println("Atendendo por prioridade:");

        OrdemServico atendida;

        while ((atendida = sistema.atenderProxima()) != null) {
            System.out.println("- " + atendida.resumo());
        }

        imprimirListagemCadastro(sistema);
        imprimirListagemPorCliente(sistema);
        imprimirCodigosOrdenados(sistema);
        imprimirContagemStatus(sistema);
        imprimirContagemPrioridade(sistema);
        imprimirAgrupamentoPrioridade(sistema);
        imprimirHistorico(sistema, new CodigoOs("OS-2026-0002"));

        System.out.println();
        System.out.println("Resumo:");
        System.out.println("- Cadastradas: " + sistema.quantidadeCadastrada());
        System.out.println("- Selecionadas: " + sistema.quantidadeSelecionada());
        System.out.println("- Na fila: " + sistema.quantidadeNaFila());
    }

    private static void cadastrarDados(SistemaAtendimentoCollectionsMemoria sistema) {
        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDateTime.of(2026, 12, 10, 9, 5),
                PrioridadeAtendimento.ALTA
        ));

        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 10),
                PrioridadeAtendimento.CRITICA
        ));

        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0004"),
                "Bruno Rocha",
                LocalDateTime.of(2026, 12, 10, 9, 20),
                PrioridadeAtendimento.BAIXA
        ));
    }

    private static void imprimirListagemCadastro(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Listagem na ordem de cadastro:");

        for (OrdemServico os : sistema.listarNaOrdemDeCadastro()) {
            System.out.println("- " + os.resumo());
        }
    }

    private static void imprimirListagemPorCliente(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Listagem por cliente:");

        for (OrdemServico os : sistema.listarPorCliente()) {
            System.out.println("- " + os.resumo());
        }
    }

    private static void imprimirCodigosOrdenados(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Códigos ordenados:");

        for (CodigoOs codigo : sistema.codigosOrdenados()) {
            System.out.println("- " + codigo.resumo());
        }
    }

    private static void imprimirContagemStatus(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Contagem por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : sistema.contarPorStatus().entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static void imprimirContagemPrioridade(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Contagem por prioridade:");

        for (Map.Entry<PrioridadeAtendimento, Integer> entrada : sistema.contarPorPrioridade().entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static void imprimirAgrupamentoPrioridade(SistemaAtendimentoCollectionsMemoria sistema) {
        System.out.println();
        System.out.println("Agrupamento por prioridade:");

        for (Map.Entry<PrioridadeAtendimento, List<OrdemServico>> entrada : sistema.agruparPorPrioridade().entrySet()) {
            System.out.println(entrada.getKey() + ":");

            if (entrada.getValue().isEmpty()) {
                System.out.println("  - Nenhuma OS.");
            }

            for (OrdemServico os : entrada.getValue()) {
                System.out.println("  - " + os.resumo());
            }
        }
    }

    private static void imprimirHistorico(
            SistemaAtendimentoCollectionsMemoria sistema,
            CodigoOs codigo
    ) {
        System.out.println();
        System.out.println("Histórico da " + codigo.resumo() + ":");

        for (EventoAtendimento evento : sistema.historico(codigo)) {
            System.out.println("- " + evento.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula170.app.ProjetoFinalCollectionsApp
```

---

## O que observar no app principal

Observe:

```text
a seleção preserva ordem;
a fila atende por prioridade;
a OS crítica sai antes;
os status mudam;
o histórico é registrado;
relatórios são gerados;
códigos ordenados vêm do TreeSet;
listagem por cliente usa Comparator;
contagens usam Map.
```

Esse é o projeto final do módulo em funcionamento.

---

## Cenário de erro: duplicidade no cadastro

Crie:

```text
src\br\com\curso\aula170\app\ProjetoFinalDuplicidadeCadastroApp.java
```

Código:

```java
package br.com.curso.aula170.app;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;
import br.com.curso.aula170.infra.SistemaAtendimentoCollectionsMemoria;

import java.time.LocalDateTime;

public class ProjetoFinalDuplicidadeCadastroApp {
    public static void main(String[] args) {
        SistemaAtendimentoCollectionsMemoria sistema = new SistemaAtendimentoCollectionsMemoria();

        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        try {
            sistema.cadastrar(new OrdemServico(
                    new CodigoOs(" os-2026-0001 "),
                    "Ana Silva Duplicada",
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
java -cp out br.com.curso.aula170.app.ProjetoFinalDuplicidadeCadastroApp
```

---

## Cenário de erro: seleção duplicada

Crie:

```text
src\br\com\curso\aula170\app\ProjetoFinalSelecaoDuplicadaApp.java
```

Código:

```java
package br.com.curso.aula170.app;

import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;
import br.com.curso.aula170.infra.SistemaAtendimentoCollectionsMemoria;

import java.time.LocalDateTime;

public class ProjetoFinalSelecaoDuplicadaApp {
    public static void main(String[] args) {
        SistemaAtendimentoCollectionsMemoria sistema = new SistemaAtendimentoCollectionsMemoria();

        sistema.cadastrar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        boolean primeiraSelecao = sistema.selecionar(new CodigoOs("OS-2026-0001"));
        boolean segundaSelecao = sistema.selecionar(new CodigoOs("OS-2026-0001"));

        System.out.println("Primeira seleção: " + primeiraSelecao);
        System.out.println("Segunda seleção: " + segundaSelecao);
        System.out.println("Selecionadas: " + sistema.quantidadeSelecionada());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula170.app.ProjetoFinalSelecaoDuplicadaApp
```

---

## Observação sobre seleção duplicada

A segunda seleção retorna:

```text
false
```

porque `LinkedHashSet` não adiciona duplicado.

Além disso, como o sistema só chama `os.selecionar()` quando a seleção foi adicionada, a entidade não recebe uma segunda transição inválida.

---

## Cenário de cancelamento

Crie:

```text
src\br\com\curso\aula170\app\ProjetoFinalCancelamentoApp.java
```

Código:

```java
package br.com.curso.aula170.app;

import br.com.curso.aula170.dominio.atendimento.EventoAtendimento;
import br.com.curso.aula170.dominio.atendimento.OrdemServico;
import br.com.curso.aula170.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula170.dominio.valor.CodigoOs;
import br.com.curso.aula170.infra.SistemaAtendimentoCollectionsMemoria;

import java.time.LocalDateTime;

public class ProjetoFinalCancelamentoApp {
    public static void main(String[] args) {
        SistemaAtendimentoCollectionsMemoria sistema = new SistemaAtendimentoCollectionsMemoria();

        CodigoOs codigo = new CodigoOs("OS-2026-0001");

        sistema.cadastrar(new OrdemServico(
                codigo,
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeAtendimento.NORMAL
        ));

        sistema.selecionar(codigo);
        sistema.cancelar(codigo, "Cliente desistiu do atendimento.");

        System.out.println("Histórico:");

        for (EventoAtendimento evento : sistema.historico(codigo)) {
            System.out.println("- " + evento.resumo());
        }

        System.out.println();
        System.out.println("Quantidade selecionada: " + sistema.quantidadeSelecionada());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula170.app.ProjetoFinalCancelamentoApp
```

---

## Observação sobre cancelamento

Quando a OS é cancelada, o sistema remove da seleção se ela estiver selecionada.

Isso evita que uma OS cancelada seja enviada para fila depois.

Esse é um exemplo de coordenação fora da entidade.

A entidade decide se pode cancelar.

O sistema coordena efeitos nas estruturas.

---

## Revisão técnica das responsabilidades

### CodigoOs

Responsável por:

```text
validar;
normalizar;
comparar;
servir como chave.
```

### OrdemServico

Responsável por:

```text
status;
transições;
histórico;
regras de atendimento.
```

### CadastroOsMemoria

Responsável por:

```text
cadastrar;
buscar;
listar;
contar por status;
ordenar códigos.
```

### SelecaoOsMemoria

Responsável por:

```text
seleção sem duplicidade;
ordem de seleção.
```

### FilaAtendimentoMemoria

Responsável por:

```text
fila prioritária;
controle de códigos na fila.
```

### RelatorioOsMemoria

Responsável por:

```text
contagens;
agrupamentos.
```

### SistemaAtendimentoCollectionsMemoria

Responsável por:

```text
coordenar o fluxo.
```

### App

Responsável por:

```text
executar cenários;
imprimir resultados.
```

---

## Onde cada coleção foi usada

```text
List:
histórico, listagens e relatórios.

LinkedHashMap:
cadastro por código com ordem de cadastro.

LinkedHashSet:
seleção sem duplicidade com ordem de seleção.

HashSet:
controle de códigos na fila.

PriorityQueue:
fila de atendimento por prioridade.

TreeSet:
códigos ordenados.

Map:
contagens e agrupamentos.

Comparator:
ordenação por cliente e prioridade de atendimento.

List.copyOf:
proteção de retornos.
```

---

## Análise arquitetural

Mesmo sem Spring Boot, banco ou API, este projeto já treina pensamento arquitetural.

Observe a separação:

```text
dominio:
regras e objetos.

infra:
coleções e fluxo em memória.

app:
execução de cenários.
```

Mais adiante, isso evolui para:

```text
Controller:
recebe requisição.

Use Case/Application Service:
coordena fluxo.

Domain:
protege regra.

Repository:
salva e busca no banco.

Gateway/Client:
integra com sistemas externos.
```

A frase continua valendo:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

---

## Limitações do projeto

Este projeto ainda é em memória.

Ele não tem:

```text
banco de dados;
transação;
Spring Boot;
API REST;
DTO;
validação Bean Validation;
logs estruturados;
testes automatizados;
concorrência;
mensageria real;
observabilidade.
```

Esses assuntos virão depois.

A intenção aqui é consolidar Collections e responsabilidade de objetos antes de colocar ferramentas.

---

## Por que isso prepara para Spring Boot

Quando chegarmos em Spring Boot, você verá muitos exemplos na internet colocando tudo em:

```text
Controller;
Service gigante;
Entity anêmica;
Repository chamado em qualquer canto.
```

Nosso caminho é outro.

Primeiro você aprende a pensar:

```text
qual objeto protege a regra?
qual classe coordena?
qual estrutura representa o problema?
qual retorno precisa ser protegido?
qual coleção evita duplicidade?
qual coleção resolve busca por chave?
```

Depois o framework entra.

Framework sem base vira cópia.

Framework com base vira engenharia.

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

Confirme:

```text
CodigoOs normaliza;
OrdemServico protege status;
histórico retorna List.copyOf.
```

### Parte 2 — Criar infraestrutura

Crie e revise:

```text
OrdenacaoAtendimento;
CadastroOsMemoria;
SelecaoOsMemoria;
FilaAtendimentoMemoria;
RelatorioOsMemoria;
SistemaAtendimentoCollectionsMemoria.
```

Confirme:

```text
cada classe tem uma responsabilidade;
cada coleção tem um motivo.
```

### Parte 3 — Executar projeto principal

Execute:

```powershell
java -cp out br.com.curso.aula170.app.ProjetoFinalCollectionsApp
```

Observe:

```text
seleção;
fila;
prioridade;
histórico;
relatórios.
```

### Parte 4 — Executar cenários de erro

Execute:

```powershell
java -cp out br.com.curso.aula170.app.ProjetoFinalDuplicidadeCadastroApp
java -cp out br.com.curso.aula170.app.ProjetoFinalSelecaoDuplicadaApp
java -cp out br.com.curso.aula170.app.ProjetoFinalCancelamentoApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula170\app\ProjetoFinalFluxoParcialApp.java
```

Ele deve:

```text
cadastrar 6 OS;
selecionar apenas 4;
cancelar 1 antes de enviar para fila;
enviar as selecionadas restantes para fila;
atender todas;
exibir contagem por status;
exibir histórico da cancelada;
exibir histórico de uma concluída.
```

Critério principal:

```text
OS cancelada não pode ser atendida.
```

---

## Desafio extra

Crie uma melhoria no sistema:

```text
listarPorPrioridadeDeAtendimento()
```

Esse método deve:

```text
ficar em SistemaAtendimentoCollectionsMemoria;
retornar List<OrdemServico>;
usar cópia da listagem do cadastro;
ordenar com OrdenacaoAtendimento.porPrioridadeDataCodigo();
retornar List.copyOf.
```

Depois crie:

```text
src\br\com\curso\aula170\app\ProjetoFinalRelatorioPrioridadeOrdenadoApp.java
```

Critério principal:

```text
não alterar a ordem interna de cadastro para gerar o relatório.
```

---

## Desafio de refatoração

Analise se `RelatorioOsMemoria` deveria receber:

```text
List<OrdemServico>
```

ou se deveria depender diretamente de:

```text
CadastroOsMemoria
```

Resposta esperada:

```text
Receber List<OrdemServico> deixa a classe menos acoplada.
Ela não precisa saber de onde vieram as OS.
```

Esse é um raciocínio importante de arquitetura.

---

## Erros comuns neste projeto

### 1. Colocar todas as coleções no app

O app deve executar cenários.

As estruturas devem ficar em classes com responsabilidade.

### 2. Colocar regra de status fora da entidade

A entidade deve proteger transições.

### 3. Usar List para cadastro por código

Use `Map`.

### 4. Usar List para seleção sem duplicidade

Use `Set`.

### 5. Usar Queue comum para prioridade

Use `PriorityQueue`.

### 6. Usar HashSet quando precisa ordem de seleção

Use `LinkedHashSet`.

### 7. Expor histórico mutável

Use `List.copyOf`.

### 8. Repetir comparador em vários lugares

Centralize a ordenação.

### 9. Confundir relatório com regra de domínio

Relatório organiza visão.

Domínio protege regra.

### 10. Achar que projeto em memória é sistema completo

Ainda falta persistência, API, testes e arquitetura de produção.

---

## Debug recomendado

Use debug em:

```text
CodigoOs.java
OrdemServico.java
CadastroOsMemoria.java
SelecaoOsMemoria.java
FilaAtendimentoMemoria.java
RelatorioOsMemoria.java
SistemaAtendimentoCollectionsMemoria.java
ProjetoFinalCollectionsApp.java
```

Breakpoints recomendados:

```java
new CodigoOs(...)

ordensPorCodigo.put(...)

selecionadas.add(...)

os.selecionar()

os.enfileirar()

fila.offer(os)

fila.poll()

os.iniciarAtendimento()

os.concluir()

historico.add(...)

contagem.merge(...)

new TreeSet<>(...)

lista.sort(...)
```

Observe:

```text
quando o código é normalizado;
quando duplicidade é bloqueada;
quando seleção ignora repetição;
quando OS muda de status;
quando entra na fila;
qual OS sai primeiro;
quando histórico recebe eventos;
como contagens são montadas;
como relatórios usam cópias.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que CadastroOsMemoria usa LinkedHashMap?
2. Por que SelecaoOsMemoria usa LinkedHashSet?
3. Por que FilaAtendimentoMemoria usa PriorityQueue?
4. Por que CodigoOs precisa de equals, hashCode e compareTo?
5. Qual classe coordena o fluxo completo?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o projeto final de Collections;
criar CodigoOs robusto;
criar OrdemServico com regra de status;
registrar histórico com List;
proteger histórico com List.copyOf;
cadastrar OS com LinkedHashMap;
bloquear duplicidade no cadastro;
selecionar OS com LinkedHashSet;
processar fila com PriorityQueue;
controlar duplicidade na fila com HashSet;
gerar códigos ordenados com TreeSet;
contar por status com Map;
contar por prioridade com Map;
agrupar por prioridade com Map e List;
ordenar por cliente com Comparator;
centralizar ordenação de atendimento;
executar o app principal;
executar cenários de erro;
resolver ProjetoFinalFluxoParcialApp;
resolver ProjetoFinalRelatorioPrioridadeOrdenadoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-170-projeto-final-collections-cadastro-relatorio-e-processamento
git commit -m "Aula 170: projeto final collections cadastro relatorio e processamento"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento do projeto

A principal ideia desta aula é:

```text
Collections são ferramentas de modelagem de fluxo, não apenas estruturas para guardar dados.
```

Você construiu um projeto com:

```text
cadastro;
seleção;
fila;
processamento;
histórico;
relatórios;
ordenação;
contagem;
agrupamento.
```

E usou cada coleção com intenção clara.

Na próxima aula, vamos fazer o fechamento técnico do Módulo 5.

Vamos revisar os aprendizados, consolidar critérios finais, mapear erros comuns e preparar a transição para o próximo módulo da formação.
