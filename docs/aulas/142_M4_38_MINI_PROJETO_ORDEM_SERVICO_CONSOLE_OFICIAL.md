# 142 — M4.38 — Mini-projeto Ordem de Serviço Console

## Objetivo da aula

Nesta aula você vai iniciar um mini-projeto maior de fechamento do módulo de Orientação a Objetos.

Na aula anterior, você revisou os principais conceitos de OO e domínio. Agora vamos aplicar tudo em um projeto de console mais completo.

Ao final da aula, você deve conseguir:

```text
montar um mini-sistema de Ordem de Serviço no console;
usar pacotes de domínio, aplicação, infraestrutura e app;
criar objetos de valor;
criar entidades com comportamento;
usar enums para status, turno e prioridade;
usar Builder para criação da OS;
usar coleção interna protegida;
usar composição com AtividadeOs e OcorrenciaOs;
usar OrdemServico como raiz de agregado;
usar service de aplicação para coordenar operações;
usar repositório em memória;
usar menu interativo com Scanner;
executar operações reais no console;
debugar o fluxo completo.
```

Este mini-projeto vai juntar muitos pontos estudados até agora.

A diferença é que agora teremos um programa mais próximo de um sistema real, mesmo ainda sendo console.

---

## Visão geral do mini-projeto

Vamos criar um sistema simples com menu:

```text
1. Criar OS
2. Adicionar atividade
3. Concluir atividade
4. Reagendar OS
5. Concluir OS
6. Cancelar OS
7. Listar OS
0. Sair
```

O sistema permitirá:

```text
criar uma Ordem de Serviço;
cadastrar atividades dentro dela;
concluir atividades;
reagendar a OS;
concluir a OS somente se todas as atividades estiverem concluídas;
cancelar a OS com motivo;
listar todas as ordens cadastradas.
```

---

## Mapa da arquitetura

A estrutura ficará assim:

```text
app
  OrdemServicoConsoleApp

aplicacao
  OrdemServicoService

infra
  OrdemServicoRepositorioMemoria
  NotificadorOsConsole

dominio
  cliente
    Cliente

  ordemservico
    CodigoOs
    TurnoAtendimento
    PrioridadeOs
    StatusOs
    StatusAtividade
    PeriodoAtendimento
    AtividadeOs
    OcorrenciaOs
    OrdemServico
    OrdemServicoBuilder
```

A ideia é manter responsabilidades separadas:

```text
dominio:
regras de negócio.

aplicacao:
coordena o fluxo.

infra:
simula banco e notificação.

app:
menu do console.
```

---

## Regras do domínio

A `OrdemServico` terá estas regras:

```text
OS nasce AGENDADA.
OS precisa de código, cliente, período, prioridade e origem.
Cliente precisa estar ativo.
OS encerrada não pode ser alterada.
OS pode receber atividades enquanto não estiver encerrada.
Atividade nasce PENDENTE.
Atividade pode ser concluída.
Atividade pode ser cancelada.
OS só pode ser concluída se tiver atividades.
OS só pode ser concluída se todas as atividades estiverem concluídas.
OS pode ser reagendada se não estiver concluída ou cancelada.
Reagendamento exige período diferente do atual.
Cancelamento exige motivo.
Toda ação relevante registra ocorrência.
Listas internas são protegidas.
```

---

## Conceitos revisados neste projeto

Este mini-projeto revisa:

```text
classe;
objeto;
construtor;
encapsulamento;
método de domínio;
enum;
LocalDate;
LocalDateTime;
objeto de valor;
entidade;
composição;
coleções protegidas;
agregado;
Builder;
service de aplicação;
infraestrutura simulada;
Scanner;
menu;
tratamento básico de erro.
```

---

## Criando a estrutura do projeto

Crie a pasta:

```powershell
mkdir labs\m4\aula-142-mini-projeto-ordem-servico-console
cd labs\m4\aula-142-mini-projeto-ordem-servico-console
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula142
mkdir src\br\com\curso\aula142\app
mkdir src\br\com\curso\aula142\aplicacao
mkdir src\br\com\curso\aula142\infra
mkdir src\br\com\curso\aula142\dominio
mkdir src\br\com\curso\aula142\dominio\cliente
mkdir src\br\com\curso\aula142\dominio\ordemservico
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula142\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula142.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final String telefone;
    private final boolean ativo;

    public Cliente(int id, String nome, String telefone) {
        this(id, nome, telefone, true);
    }

    public Cliente(int id, String nome, String telefone, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    public boolean ativo() {
        return ativo;
    }

    public String telefone() {
        return telefone;
    }

    public String resumo() {
        return "Cliente " + id
                + " - " + nome
                + " | Telefone: " + telefone
                + " | Ativo: " + ativo;
    }
}
```

---

## O papel do Cliente

`Cliente` é uma entidade associada à OS.

A `OrdemServico` conhece o cliente, mas não é dona dele.

Isso significa:

```text
Cliente existe fora da OS.
OS não cria internamente o cliente.
OS não apaga o cliente.
OS apenas valida se o cliente está ativo para criar atendimento.
```

---

## CodigoOs

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

import java.util.Objects;

public final class CodigoOs {
    private static final String PREFIXO = "OS-";

    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código da OS deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    public static CodigoOs deNumero(int ano, int numero) {
        if (ano <= 0) {
            throw new IllegalArgumentException("Ano deve ser maior que zero.");
        }

        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        return new CodigoOs(PREFIXO + ano + "-" + String.format("%04d", numero));
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        CodigoOs codigoOs = (CodigoOs) outro;
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

## O papel do CodigoOs

`CodigoOs` é objeto de valor.

Ele protege o formato do código.

Em vez de espalhar `String` pelo sistema, usamos:

```java
CodigoOs.deNumero(2026, 1);
```

ou:

```java
new CodigoOs("OS-2026-0001");
```

Isso deixa o domínio mais forte.

---

## Enums do domínio

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\StatusAtividade.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

public enum StatusAtividade {
    PENDENTE,
    CONCLUIDA,
    CANCELADA
}
```

---

## O papel dos enums

Enums evitam valores soltos como:

```text
"agendada";
"AGEND";
"Concluido";
"CONCLUIDAAA".
```

Com enum, o Java limita os valores possíveis.

Isso reduz erro e melhora regra de domínio.

---

## PeriodoAtendimento

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

import java.time.LocalDate;
import java.util.Objects;

public final class PeriodoAtendimento {
    private final LocalDate data;
    private final TurnoAtendimento turno;

    public PeriodoAtendimento(LocalDate data, TurnoAtendimento turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    public boolean mesmaData(PeriodoAtendimento outro) {
        if (outro == null) {
            return false;
        }

        return Objects.equals(data, outro.data);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        PeriodoAtendimento periodo = (PeriodoAtendimento) outro;
        return Objects.equals(data, periodo.data)
                && turno == periodo.turno;
    }

    @Override
    public int hashCode() {
        return Objects.hash(data, turno);
    }

    @Override
    public String toString() {
        return data + " - " + turno;
    }
}
```

---

## O papel do PeriodoAtendimento

`PeriodoAtendimento` junta:

```text
data;
turno.
```

Ele evita dois campos soltos dentro da OS.

Isso cria um conceito do domínio.

A OS não fala apenas de uma data.

Ela fala de um período de atendimento.

---

## AtividadeOs

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

public class AtividadeOs {
    private final String codigo;
    private final String descricao;
    private StatusAtividade status;

    AtividadeOs(String codigo, String descricao) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código da atividade é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da atividade é obrigatória.");
        }

        this.codigo = codigo;
        this.descricao = descricao;
        this.status = StatusAtividade.PENDENTE;
    }

    boolean mesmoCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    boolean concluida() {
        return status == StatusAtividade.CONCLUIDA;
    }

    void concluir() {
        if (status == StatusAtividade.CANCELADA) {
            throw new IllegalStateException("Atividade cancelada não pode ser concluída.");
        }

        if (status == StatusAtividade.CONCLUIDA) {
            throw new IllegalStateException("Atividade já está concluída.");
        }

        status = StatusAtividade.CONCLUIDA;
    }

    void cancelar() {
        if (status == StatusAtividade.CONCLUIDA) {
            throw new IllegalStateException("Atividade concluída não pode ser cancelada.");
        }

        if (status == StatusAtividade.CANCELADA) {
            throw new IllegalStateException("Atividade já está cancelada.");
        }

        status = StatusAtividade.CANCELADA;
    }

    public String resumo() {
        return codigo + " - " + descricao + " | Status: " + status;
    }
}
```

---

## O papel da AtividadeOs

`AtividadeOs` é filha da `OrdemServico`.

Ela não tem construtor `public`.

Isso reforça que:

```text
quem cria atividade é a OS.
quem conclui atividade é a OS.
quem cancela atividade é a OS.
```

O app não deve alterar atividade diretamente.

A raiz do agregado controla os filhos.

---

## OcorrenciaOs

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

import java.time.LocalDateTime;

public class OcorrenciaOs {
    private final LocalDateTime dataHora;
    private final String descricao;

    OcorrenciaOs(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da ocorrência é obrigatória.");
        }

        this.dataHora = LocalDateTime.now();
        this.descricao = descricao;
    }

    public String resumo() {
        return dataHora + " | " + descricao;
    }
}
```

---

## O papel da OcorrenciaOs

`OcorrenciaOs` também é filha da OS.

O app não cria ocorrência.

A ocorrência nasce quando a OS executa uma ação importante:

```text
OS criada;
atividade adicionada;
atividade concluída;
atividade cancelada;
OS reagendada;
OS concluída;
OS cancelada.
```

Isso mantém o histórico coerente.

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

import br.com.curso.aula142.dominio.cliente.Cliente;

import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private final CodigoOs codigo;
    private final Cliente cliente;
    private final PrioridadeOs prioridade;
    private final String origem;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;
    private final List<AtividadeOs> atividades;
    private final List<OcorrenciaOs> ocorrencias;

    OrdemServico(
            CodigoOs codigo,
            Cliente cliente,
            PeriodoAtendimento periodo,
            PrioridadeOs prioridade,
            String origem
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("OS não pode ser criada para cliente inativo.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        if (origem == null || origem.isBlank()) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.prioridade = prioridade;
        this.origem = origem;
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
        this.motivoCancelamento = "";
        this.atividades = new ArrayList<>();
        this.ocorrencias = new ArrayList<>();

        registrarOcorrencia("OS criada. Origem: " + origem + " | Período: " + periodo);
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public Cliente cliente() {
        return cliente;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void adicionarAtividade(String codigo, String descricao) {
        exigirAberta("OS encerrada não pode receber atividade.");

        if (existeAtividade(codigo)) {
            throw new IllegalArgumentException("Atividade já existe na OS: " + codigo);
        }

        atividades.add(new AtividadeOs(codigo, descricao));
        registrarOcorrencia("Atividade adicionada: " + codigo);
    }

    public void concluirAtividade(String codigo) {
        exigirAberta("OS encerrada não pode alterar atividade.");

        AtividadeOs atividade = buscarAtividadeObrigatoria(codigo);
        atividade.concluir();

        registrarOcorrencia("Atividade concluída: " + codigo);
    }

    public void cancelarAtividade(String codigo) {
        exigirAberta("OS encerrada não pode alterar atividade.");

        AtividadeOs atividade = buscarAtividadeObrigatoria(codigo);
        atividade.cancelar();

        registrarOcorrencia("Atividade cancelada: " + codigo);
    }

    public void reagendar(PeriodoAtendimento novoPeriodo) {
        exigirAberta("OS encerrada não pode ser reagendada.");

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        if (periodo.equals(novoPeriodo)) {
            throw new IllegalArgumentException("Novo período deve ser diferente do atual.");
        }

        PeriodoAtendimento periodoAnterior = periodo;

        periodo = novoPeriodo;
        status = StatusOs.REAGENDADA;
        quantidadeReagendamentos++;

        registrarOcorrencia("OS reagendada de " + periodoAnterior + " para " + novoPeriodo);
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        if (atividades.isEmpty()) {
            throw new IllegalStateException("OS sem atividades não pode ser concluída.");
        }

        if (!todasAtividadesConcluidas()) {
            throw new IllegalStateException("Todas as atividades precisam estar concluídas.");
        }

        status = StatusOs.CONCLUIDA;
        registrarOcorrencia("OS concluída");
    }

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS já está cancelada.");
        }

        status = StatusOs.CANCELADA;
        motivoCancelamento = motivo;
        registrarOcorrencia("OS cancelada. Motivo: " + motivo);
    }

    public boolean existeAtividade(String codigo) {
        for (AtividadeOs atividade : atividades) {
            if (atividade.mesmoCodigo(codigo)) {
                return true;
            }
        }

        return false;
    }

    public boolean todasAtividadesConcluidas() {
        if (atividades.isEmpty()) {
            return false;
        }

        for (AtividadeOs atividade : atividades) {
            if (!atividade.concluida()) {
                return false;
            }
        }

        return true;
    }

    public int quantidadeAtividades() {
        return atividades.size();
    }

    public List<AtividadeOs> atividades() {
        return List.copyOf(atividades);
    }

    public List<OcorrenciaOs> ocorrencias() {
        return List.copyOf(ocorrencias);
    }

    private AtividadeOs buscarAtividadeObrigatoria(String codigo) {
        for (AtividadeOs atividade : atividades) {
            if (atividade.mesmoCodigo(codigo)) {
                return atividade;
            }
        }

        throw new IllegalArgumentException("Atividade não encontrada: " + codigo);
    }

    private void exigirAberta(String mensagem) {
        if (encerrada()) {
            throw new IllegalStateException(mensagem);
        }
    }

    private void registrarOcorrencia(String descricao) {
        ocorrencias.add(new OcorrenciaOs(descricao));
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("OS ").append(codigo)
                .append(" | Cliente: ").append(cliente.resumo())
                .append(" | Período: ").append(periodo)
                .append(" | Prioridade: ").append(prioridade)
                .append(" | Origem: ").append(origem)
                .append(" | Status: ").append(status)
                .append(" | Reagendamentos: ").append(quantidadeReagendamentos)
                .append(" | Motivo cancelamento: ").append(motivoCancelamento)
                .append("\nAtividades:");

        if (atividades.isEmpty()) {
            texto.append("\n- Nenhuma atividade cadastrada.");
        } else {
            for (AtividadeOs atividade : atividades) {
                texto.append("\n- ").append(atividade.resumo());
            }
        }

        texto.append("\nOcorrências:");

        for (OcorrenciaOs ocorrencia : ocorrencias) {
            texto.append("\n- ").append(ocorrencia.resumo());
        }

        return texto.toString();
    }
}
```

---

## O papel da OrdemServico

`OrdemServico` é a raiz do agregado.

Ela controla:

```text
atividades;
ocorrências;
status;
reagendamentos;
conclusão;
cancelamento.
```

O app não altera os filhos diretamente.

O app pede para a OS executar uma ação:

```java
os.adicionarAtividade(...);
os.concluirAtividade(...);
os.reagendar(...);
os.concluir();
```

Isso aplica `Tell, Don't Ask`.

---

## OrdemServicoBuilder

Crie:

```text
src\br\com\curso\aula142\dominio\ordemservico\OrdemServicoBuilder.java
```

Código:

```java
package br.com.curso.aula142.dominio.ordemservico;

import br.com.curso.aula142.dominio.cliente.Cliente;

public class OrdemServicoBuilder {
    private CodigoOs codigo;
    private Cliente cliente;
    private PeriodoAtendimento periodo;
    private PrioridadeOs prioridade;
    private String origem;

    public OrdemServicoBuilder() {
        this.prioridade = PrioridadeOs.NORMAL;
        this.origem = "CONSOLE";
    }

    public OrdemServicoBuilder codigo(CodigoOs codigo) {
        this.codigo = codigo;
        return this;
    }

    public OrdemServicoBuilder cliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public OrdemServicoBuilder periodo(PeriodoAtendimento periodo) {
        this.periodo = periodo;
        return this;
    }

    public OrdemServicoBuilder prioridade(PrioridadeOs prioridade) {
        this.prioridade = prioridade;
        return this;
    }

    public OrdemServicoBuilder origem(String origem) {
        this.origem = origem;
        return this;
    }

    public OrdemServico build() {
        return new OrdemServico(
                codigo,
                cliente,
                periodo,
                prioridade,
                origem
        );
    }
}
```

---

## O papel do Builder

O Builder facilita a criação da OS.

Em vez de um construtor grande no app, usamos:

```java
new OrdemServicoBuilder()
        .codigo(...)
        .cliente(...)
        .periodo(...)
        .prioridade(...)
        .origem(...)
        .build();
```

O Builder monta.

A OS valida.

A OS protege as regras.

---

## Repositório em memória

Crie:

```text
src\br\com\curso\aula142\infra\OrdemServicoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula142.infra;

import br.com.curso.aula142.dominio.ordemservico.CodigoOs;
import br.com.curso.aula142.dominio.ordemservico.OrdemServico;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class OrdemServicoRepositorioMemoria {
    private final Map<CodigoOs, OrdemServico> ordens;

    public OrdemServicoRepositorioMemoria() {
        this.ordens = new LinkedHashMap<>();
    }

    public void salvar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        ordens.put(os.codigo(), os);
    }

    public boolean existe(CodigoOs codigo) {
        if (codigo == null) {
            return false;
        }

        return ordens.containsKey(codigo);
    }

    public Optional<OrdemServico> buscar(CodigoOs codigo) {
        if (codigo == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(ordens.get(codigo));
    }

    public List<OrdemServico> listar() {
        return new ArrayList<>(ordens.values());
    }

    public int quantidade() {
        return ordens.size();
    }
}
```

---

## O papel do repositório

O repositório simula armazenamento.

Nesta aula, ele usa memória:

```java
Map<CodigoOs, OrdemServico>
```

Em módulos futuros, essa ideia evolui para banco de dados.

Por enquanto, o importante é:

```text
a OS não sabe como será salva;
o repositório fica fora do domínio;
a aplicação usa o repositório para buscar e salvar.
```

---

## Notificador de console

Crie:

```text
src\br\com\curso\aula142\infra\NotificadorOsConsole.java
```

Código:

```java
package br.com.curso.aula142.infra;

import br.com.curso.aula142.dominio.ordemservico.OrdemServico;

public class NotificadorOsConsole {
    public void notificarCriacao(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] OS criada: " + os.codigo());
    }

    public void notificarReagendamento(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] OS reagendada: " + os.codigo());
    }

    public void notificarConclusao(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] OS concluída: " + os.codigo());
    }

    public void notificarCancelamento(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] OS cancelada: " + os.codigo());
    }
}
```

---

## O papel do notificador

O notificador também fica fora do domínio.

A OS não faz:

```java
System.out.println("[NOTIFICAÇÃO]...");
```

A aplicação chama o notificador depois da regra de domínio.

Isso mantém o domínio mais limpo.

---

## Service de aplicação

Crie:

```text
src\br\com\curso\aula142\aplicacao\OrdemServicoService.java
```

Código:

```java
package br.com.curso.aula142.aplicacao;

import br.com.curso.aula142.dominio.ordemservico.CodigoOs;
import br.com.curso.aula142.dominio.ordemservico.OrdemServico;
import br.com.curso.aula142.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula142.infra.NotificadorOsConsole;
import br.com.curso.aula142.infra.OrdemServicoRepositorioMemoria;

import java.util.List;

public class OrdemServicoService {
    private final OrdemServicoRepositorioMemoria repositorio;
    private final NotificadorOsConsole notificador;

    public OrdemServicoService(
            OrdemServicoRepositorioMemoria repositorio,
            NotificadorOsConsole notificador
    ) {
        if (repositorio == null) {
            throw new IllegalArgumentException("Repositório é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        this.repositorio = repositorio;
        this.notificador = notificador;
    }

    public void criar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (repositorio.existe(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo());
        }

        repositorio.salvar(os);
        notificador.notificarCriacao(os);
    }

    public void adicionarAtividade(CodigoOs codigoOs, String codigoAtividade, String descricao) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.adicionarAtividade(codigoAtividade, descricao);

        repositorio.salvar(os);
    }

    public void concluirAtividade(CodigoOs codigoOs, String codigoAtividade) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.concluirAtividade(codigoAtividade);

        repositorio.salvar(os);
    }

    public void reagendar(CodigoOs codigoOs, PeriodoAtendimento novoPeriodo) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.reagendar(novoPeriodo);

        repositorio.salvar(os);
        notificador.notificarReagendamento(os);
    }

    public void concluir(CodigoOs codigoOs) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.concluir();

        repositorio.salvar(os);
        notificador.notificarConclusao(os);
    }

    public void cancelar(CodigoOs codigoOs, String motivo) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.cancelar(motivo);

        repositorio.salvar(os);
        notificador.notificarCancelamento(os);
    }

    public List<OrdemServico> listar() {
        return repositorio.listar();
    }

    private OrdemServico buscarObrigatoria(CodigoOs codigoOs) {
        return repositorio.buscar(codigoOs)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + codigoOs));
    }
}
```

---

## O papel do service de aplicação

`OrdemServicoService` coordena o fluxo.

Ele:

```text
busca OS;
chama método de domínio;
salva OS;
notifica quando necessário.
```

Ele não faz:

```text
setStatus;
setPeriodo;
alterar lista diretamente;
criar ocorrência diretamente;
validar se todas as atividades estão concluídas.
```

Essas regras continuam na `OrdemServico`.

---

## App de console

Agora vamos criar o menu principal.

Crie:

```text
src\br\com\curso\aula142\app\OrdemServicoConsoleApp.java
```

Código:

```java
package br.com.curso.aula142.app;

import br.com.curso.aula142.aplicacao.OrdemServicoService;
import br.com.curso.aula142.dominio.cliente.Cliente;
import br.com.curso.aula142.dominio.ordemservico.CodigoOs;
import br.com.curso.aula142.dominio.ordemservico.OrdemServico;
import br.com.curso.aula142.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula142.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula142.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula142.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula142.infra.NotificadorOsConsole;
import br.com.curso.aula142.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class OrdemServicoConsoleApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        OrdemServicoService service = new OrdemServicoService(
                repositorio,
                notificador
        );

        boolean executando = true;

        while (executando) {
            exibirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção: ");

            try {
                switch (opcao) {
                    case 1:
                        criarOs(scanner, service);
                        break;
                    case 2:
                        adicionarAtividade(scanner, service);
                        break;
                    case 3:
                        concluirAtividade(scanner, service);
                        break;
                    case 4:
                        reagendarOs(scanner, service);
                        break;
                    case 5:
                        concluirOs(scanner, service);
                        break;
                    case 6:
                        cancelarOs(scanner, service);
                        break;
                    case 7:
                        listarOs(service);
                        break;
                    case 0:
                        executando = false;
                        System.out.println("Encerrando sistema.");
                        break;
                    default:
                        System.out.println("Opção inválida.");
                        break;
                }
            } catch (RuntimeException erro) {
                System.out.println("Erro: " + erro.getMessage());
            }

            System.out.println();
        }

        scanner.close();
    }

    private static void exibirMenu() {
        System.out.println("====================================");
        System.out.println(" MINI SISTEMA DE ORDEM DE SERVIÇO");
        System.out.println("====================================");
        System.out.println("1. Criar OS");
        System.out.println("2. Adicionar atividade");
        System.out.println("3. Concluir atividade");
        System.out.println("4. Reagendar OS");
        System.out.println("5. Concluir OS");
        System.out.println("6. Cancelar OS");
        System.out.println("7. Listar OS");
        System.out.println("0. Sair");
        System.out.println("====================================");
    }

    private static void criarOs(Scanner scanner, OrdemServicoService service) {
        System.out.println("Cadastro de OS");

        int ano = lerInteiro(scanner, "Ano da OS: ");
        int numero = lerInteiro(scanner, "Número da OS: ");

        int idCliente = lerInteiro(scanner, "Id do cliente: ");
        String nomeCliente = lerTexto(scanner, "Nome do cliente: ");
        String telefoneCliente = lerTexto(scanner, "Telefone do cliente: ");

        LocalDate data = lerData(scanner, "Data de atendimento (yyyy-MM-dd): ");
        TurnoAtendimento turno = lerTurno(scanner);
        PrioridadeOs prioridade = lerPrioridade(scanner);
        String origem = lerTexto(scanner, "Origem da OS: ");

        Cliente cliente = new Cliente(
                idCliente,
                nomeCliente,
                telefoneCliente
        );

        OrdemServico os = new OrdemServicoBuilder()
                .codigo(CodigoOs.deNumero(ano, numero))
                .cliente(cliente)
                .periodo(new PeriodoAtendimento(data, turno))
                .prioridade(prioridade)
                .origem(origem)
                .build();

        service.criar(os);

        System.out.println("OS criada com sucesso.");
    }

    private static void adicionarAtividade(Scanner scanner, OrdemServicoService service) {
        CodigoOs codigoOs = lerCodigoOs(scanner);
        String codigoAtividade = lerTexto(scanner, "Código da atividade: ");
        String descricao = lerTexto(scanner, "Descrição da atividade: ");

        service.adicionarAtividade(codigoOs, codigoAtividade, descricao);

        System.out.println("Atividade adicionada com sucesso.");
    }

    private static void concluirAtividade(Scanner scanner, OrdemServicoService service) {
        CodigoOs codigoOs = lerCodigoOs(scanner);
        String codigoAtividade = lerTexto(scanner, "Código da atividade: ");

        service.concluirAtividade(codigoOs, codigoAtividade);

        System.out.println("Atividade concluída com sucesso.");
    }

    private static void reagendarOs(Scanner scanner, OrdemServicoService service) {
        CodigoOs codigoOs = lerCodigoOs(scanner);
        LocalDate data = lerData(scanner, "Nova data de atendimento (yyyy-MM-dd): ");
        TurnoAtendimento turno = lerTurno(scanner);

        service.reagendar(
                codigoOs,
                new PeriodoAtendimento(data, turno)
        );

        System.out.println("OS reagendada com sucesso.");
    }

    private static void concluirOs(Scanner scanner, OrdemServicoService service) {
        CodigoOs codigoOs = lerCodigoOs(scanner);

        service.concluir(codigoOs);

        System.out.println("OS concluída com sucesso.");
    }

    private static void cancelarOs(Scanner scanner, OrdemServicoService service) {
        CodigoOs codigoOs = lerCodigoOs(scanner);
        String motivo = lerTexto(scanner, "Motivo do cancelamento: ");

        service.cancelar(codigoOs, motivo);

        System.out.println("OS cancelada com sucesso.");
    }

    private static void listarOs(OrdemServicoService service) {
        List<OrdemServico> ordens = service.listar();

        if (ordens.isEmpty()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        for (OrdemServico os : ordens) {
            System.out.println("------------------------------------");
            System.out.println(os.resumo());
        }

        System.out.println("------------------------------------");
        System.out.println("Total de OS cadastradas: " + ordens.size());
    }

    private static CodigoOs lerCodigoOs(Scanner scanner) {
        String codigo = lerTexto(scanner, "Código da OS (ex: OS-2026-0001): ");
        return new CodigoOs(codigo);
    }

    private static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            try {
                return Integer.parseInt(texto);
            } catch (NumberFormatException erro) {
                System.out.println("Informe um número inteiro válido.");
            }
        }
    }

    private static String lerTexto(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Texto obrigatório.");
        }
    }

    private static LocalDate lerData(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            try {
                return LocalDate.parse(texto);
            } catch (RuntimeException erro) {
                System.out.println("Data inválida. Use o formato yyyy-MM-dd.");
            }
        }
    }

    private static TurnoAtendimento lerTurno(Scanner scanner) {
        while (true) {
            System.out.println("Turno:");
            System.out.println("1. Manhã");
            System.out.println("2. Tarde");

            int opcao = lerInteiro(scanner, "Escolha o turno: ");

            if (opcao == 1) {
                return TurnoAtendimento.MANHA;
            }

            if (opcao == 2) {
                return TurnoAtendimento.TARDE;
            }

            System.out.println("Turno inválido.");
        }
    }

    private static PrioridadeOs lerPrioridade(Scanner scanner) {
        while (true) {
            System.out.println("Prioridade:");
            System.out.println("1. Normal");
            System.out.println("2. Alta");
            System.out.println("3. Crítica");

            int opcao = lerInteiro(scanner, "Escolha a prioridade: ");

            if (opcao == 1) {
                return PrioridadeOs.NORMAL;
            }

            if (opcao == 2) {
                return PrioridadeOs.ALTA;
            }

            if (opcao == 3) {
                return PrioridadeOs.CRITICA;
            }

            System.out.println("Prioridade inválida.");
        }
    }
}
```

---

## Compilando o projeto

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Se não aparecer erro, execute:

```powershell
java -cp out br.com.curso.aula142.app.OrdemServicoConsoleApp
```

---

## Fluxo de teste recomendado

Ao abrir o menu, teste esta sequência.

### 1. Criar OS

Escolha:

```text
1
```

Informe, por exemplo:

```text
Ano da OS: 2026
Número da OS: 1
Id do cliente: 10
Nome do cliente: Ana Silva
Telefone do cliente: 11999990000
Data de atendimento: 2026-12-10
Turno: 1
Prioridade: 2
Origem: PORTAL_CLIENTE
```

A OS gerada será:

```text
OS-2026-0001
```

### 2. Adicionar atividades

Escolha:

```text
2
```

Informe:

```text
Código da OS: OS-2026-0001
Código da atividade: ATV-001
Descrição: Instalar produto
```

Depois repita:

```text
Código da atividade: ATV-002
Descrição: Validar funcionamento
```

### 3. Listar OS

Escolha:

```text
7
```

Veja:

```text
dados da OS;
atividades;
ocorrências.
```

### 4. Tentar concluir OS antes de concluir atividades

Escolha:

```text
5
```

Informe:

```text
OS-2026-0001
```

O sistema deve bloquear:

```text
Todas as atividades precisam estar concluídas.
```

### 5. Concluir atividades

Escolha:

```text
3
```

Conclua:

```text
ATV-001
```

Depois conclua:

```text
ATV-002
```

### 6. Concluir OS

Escolha:

```text
5
```

Agora a conclusão deve funcionar.

### 7. Tentar alterar OS concluída

Tente adicionar atividade ou reagendar depois da conclusão.

O domínio deve bloquear.

---

## O que este projeto demonstra

Este projeto mostra:

```text
o menu não altera status diretamente;
o menu não altera listas diretamente;
o service de aplicação coordena;
o domínio protege as regras;
o repositório guarda em memória;
o notificador simula efeito externo;
a OS registra histórico;
a OS controla suas atividades.
```

Esse é um salto importante em relação a programas com `main` gigante.

---

## Onde está cada responsabilidade

### App

```text
exibe menu;
lê dados;
chama service;
mostra mensagens.
```

### Aplicação

```text
coordena operações;
busca OS;
salva OS;
notifica.
```

### Domínio

```text
valida regras;
muda status;
controla atividades;
registra ocorrências;
bloqueia operações inválidas.
```

### Infraestrutura

```text
guarda dados em memória;
simula notificação.
```

---

## Por que não colocamos tudo no main

Um `main` gigante faria:

```text
ler dados;
validar regra;
alterar status;
manipular lista;
salvar;
notificar;
imprimir.
```

Isso seria procedural demais.

Aqui separamos:

```text
menu;
aplicação;
domínio;
infra.
```

Mesmo sendo console, o pensamento já é de backend.

---

## Limitações do projeto atual

Este projeto ainda é simples.

Limitações:

```text
não salva em arquivo;
não usa banco de dados;
não tem login;
não tem testes automatizados;
não tem interface gráfica;
não tem Spring;
não tem DTO;
não tem validação avançada de data futura;
não edita atividade;
não busca individual com tela detalhada.
```

Tudo bem.

O objetivo agora é dominar OO e domínio.

---

## Melhorias futuras possíveis

Depois, este projeto pode evoluir para:

```text
salvar em arquivo;
usar PostgreSQL;
criar API REST;
usar Spring Boot;
criar testes unitários;
criar DTOs;
criar repository por interface;
criar camada web;
adicionar autenticação;
adicionar regras de cliente;
adicionar prioridade automática;
adicionar relatório.
```

Esses passos virão em módulos futuros.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar arquivos

Crie todos os arquivos da aula.

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

### Parte 2 — Executar menu

Execute:

```powershell
java -cp out br.com.curso.aula142.app.OrdemServicoConsoleApp
```

### Parte 3 — Criar OS

Crie uma OS com código:

```text
OS-2026-0001
```

### Parte 4 — Adicionar atividades

Adicione:

```text
ATV-001 - Instalar produto
ATV-002 - Validar funcionamento
```

### Parte 5 — Testar bloqueio

Tente concluir a OS antes de concluir todas as atividades.

### Parte 6 — Concluir fluxo

Conclua as atividades e depois conclua a OS.

### Parte 7 — Testar alteração inválida

Tente reagendar ou adicionar atividade depois da OS concluída.

---

## Desafio prático

Evolua o mini-projeto com uma opção nova no menu:

```text
8. Cancelar atividade
```

Regras:

```text
deve pedir código da OS;
deve pedir código da atividade;
deve chamar service.cancelarAtividade(...);
deve salvar a OS no repositório;
deve impedir cancelamento se OS estiver encerrada;
deve registrar ocorrência;
deve aparecer no resumo.
```

Você precisará:

```text
adicionar método cancelarAtividade em OrdemServicoService;
adicionar opção 8 no menu;
criar método cancelarAtividade no app;
testar atividade cancelada.
```

Critério principal:

```text
o app não pode alterar a atividade diretamente.
```

---

## Desafio extra

Adicione uma opção:

```text
9. Buscar OS por código
```

Regras:

```text
deve pedir código da OS;
deve exibir apenas aquela OS;
se não encontrar, deve informar erro;
não deve expor o Map do repositório;
deve usar um método de aplicação.
```

Esse desafio treina:

```text
consulta;
encapsulamento de repositório;
uso de Optional;
mensagem de erro.
```

---

## Erros comuns

### 1. Criar setStatus na OS

Não faça isso. Use métodos de domínio.

### 2. Alterar lista de atividades no app

O app deve chamar métodos da OS via service.

### 3. Criar ocorrência no app

Ocorrência é consequência de ação da OS.

### 4. Colocar notificação dentro da OS

Notificação é infraestrutura.

### 5. Usar String para status

Use enum.

### 6. Esquecer de salvar depois de alterar

O service de aplicação deve salvar após mudanças.

### 7. Deixar Scanner quebrar por entrada inválida

Use leitura com `nextLine` e conversão controlada.

### 8. Criar OS duplicada

O service bloqueia se o código já existir.

---

## Debug recomendado

Use debug em:

```text
OrdemServicoConsoleApp.java
OrdemServicoService.java
OrdemServico.java
OrdemServicoRepositorioMemoria.java
```

Breakpoints recomendados:

```java
criarOs(...)
service.criar(...)
repositorio.salvar(...)

adicionarAtividade(...)
service.adicionarAtividade(...)
os.adicionarAtividade(...)
registrarOcorrencia(...)

concluirAtividade(...)
os.concluirAtividade(...)
atividade.concluir()

reagendarOs(...)
service.reagendar(...)
os.reagendar(...)

concluirOs(...)
service.concluir(...)
os.concluir()
todasAtividadesConcluidas()

listarOs(...)
service.listar()
```

Observe:

```text
o menu lê dados;
o service busca a OS;
o domínio valida a regra;
o repositório guarda;
a ocorrência é criada internamente;
a notificação fica fora do domínio.
```

---

## Perguntas de revisão

Responda em poucas linhas:

```text
1. Qual classe é a raiz do agregado?
2. Quais classes são filhas da OS?
3. Qual classe representa a camada de aplicação?
4. Qual classe simula persistência?
5. Por que o app não deve alterar atividade diretamente?
6. Por que a OS não deve enviar notificação?
7. Onde a regra "todas as atividades precisam estar concluídas" ficou?
8. Por que usamos enum para status?
9. Por que CodigoOs é melhor que String solta?
10. Por que o Builder foi útil?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar o mini-projeto completo;
compilar sem erros;
executar o menu;
criar uma OS;
adicionar atividades;
concluir atividades;
reagendar OS;
concluir OS;
cancelar OS;
listar OS;
explicar cada pacote;
explicar cada classe;
explicar onde fica a regra de negócio;
explicar onde fica a infraestrutura;
resolver o desafio de cancelar atividade;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-142-mini-projeto-ordem-servico-console
git commit -m "Aula 142: mini projeto ordem de servico console"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
mesmo em um sistema de console, já é possível pensar como backend profissional, separando domínio, aplicação, infraestrutura e interface de entrada.
```

Você criou um mini-sistema de Ordem de Serviço com menu, regras, repositório em memória e domínio protegido.

Na próxima aula, vamos continuar este mini-projeto.

Vamos refatorar o console, melhorar a busca por OS, criar novas operações e deixar o fluxo mais organizado para preparar o fechamento do Módulo 4.
