# 144 — M4.40 — Mini-projeto Ordem de Serviço Console — Parte 3

## Objetivo da aula

Nesta aula você vai finalizar a terceira parte do mini-projeto de Ordem de Serviço no console.

Na aula anterior, você evoluiu o projeto com:

```text
ConsoleLeitura;
cancelamento de atividade;
busca de OS por código;
listagem curta;
fluxo automático de teste.
```

Agora vamos fechar o mini-projeto com uma rodada de refatoração final e melhoria de operações.

Ao final da aula, você deve conseguir:

```text
evoluir um projeto existente sem quebrar a estrutura;
implementar reabertura de atividade cancelada;
melhorar o menu de listagem;
separar listagem curta e detalhada;
criar relatório simples de quantidade;
corrigir pontos de usabilidade no console;
manter domínio protegido;
manter app sem regra de negócio central;
manter service coordenando fluxo;
manter infraestrutura fora do domínio;
entender critérios de fechamento de um mini-projeto OO.
```

Esta aula fecha o mini-projeto iniciado na aula 142.

O foco não é criar tudo de novo.

O foco é aprender a evoluir, revisar e finalizar.

---

## O que vamos adicionar

Vamos adicionar três melhorias principais:

```text
10. Reabrir atividade cancelada
11. Relatório simples
melhoria da opção 7 para escolher listagem curta ou detalhada
```

O menu ficará assim:

```text
1. Criar OS
2. Adicionar atividade
3. Concluir atividade
4. Reagendar OS
5. Concluir OS
6. Cancelar OS
7. Listar OS
8. Cancelar atividade
9. Buscar OS por código
10. Reabrir atividade
11. Relatório simples
0. Sair
```

---

## Regras novas

A nova regra de reabertura será:

```text
somente atividade CANCELADA pode ser reaberta;
atividade PENDENTE não precisa ser reaberta;
atividade CONCLUIDA não pode ser reaberta;
OS encerrada não pode reabrir atividade;
reabrir atividade muda status para PENDENTE;
reabrir atividade registra ocorrência;
service salva a OS;
infraestrutura notifica.
```

Essa regra reforça:

```text
alteração de filho passa pela raiz do agregado.
```

O app não vai acessar `AtividadeOs`.

O app vai chamar o service.

O service vai chamar a `OrdemServico`.

A `OrdemServico` vai chamar a `AtividadeOs`.

---

## Criando a pasta da Parte 3

Crie:

```powershell
mkdir labs\m4\aula-144-mini-projeto-ordem-servico-console-parte-3
cd labs\m4\aula-144-mini-projeto-ordem-servico-console-parte-3
```

Você pode copiar a estrutura da aula 143:

```powershell
Copy-Item ..\aula-143-mini-projeto-ordem-servico-console-parte-2\src . -Recurse
```

Depois troque os pacotes:

```text
br.com.curso.aula143
```

para:

```text
br.com.curso.aula144
```

Se preferir criar do zero, crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula144
mkdir src\br\com\curso\aula144\app
mkdir src\br\com\curso\aula144\aplicacao
mkdir src\br\com\curso\aula144\infra
mkdir src\br\com\curso\aula144\dominio
mkdir src\br\com\curso\aula144\dominio\cliente
mkdir src\br\com\curso\aula144\dominio\ordemservico
```

Nesta aula, vamos mostrar os arquivos completos principais da Parte 3.

---

## Cliente

Crie:

```text
src\br\com\curso\aula144\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula144.dominio.cliente;

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

## CodigoOs

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

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

## Enums

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\StatusAtividade.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

public enum StatusAtividade {
    PENDENTE,
    CONCLUIDA,
    CANCELADA
}
```

---

## PeriodoAtendimento

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

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

## AtividadeOs com reabertura

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

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

    boolean pendente() {
        return status == StatusAtividade.PENDENTE;
    }

    boolean concluida() {
        return status == StatusAtividade.CONCLUIDA;
    }

    boolean cancelada() {
        return status == StatusAtividade.CANCELADA;
    }

    void concluir() {
        if (cancelada()) {
            throw new IllegalStateException("Atividade cancelada não pode ser concluída.");
        }

        if (concluida()) {
            throw new IllegalStateException("Atividade já está concluída.");
        }

        status = StatusAtividade.CONCLUIDA;
    }

    void cancelar() {
        if (concluida()) {
            throw new IllegalStateException("Atividade concluída não pode ser cancelada.");
        }

        if (cancelada()) {
            throw new IllegalStateException("Atividade já está cancelada.");
        }

        status = StatusAtividade.CANCELADA;
    }

    void reabrir() {
        if (pendente()) {
            throw new IllegalStateException("Atividade pendente não precisa ser reaberta.");
        }

        if (concluida()) {
            throw new IllegalStateException("Atividade concluída não pode ser reaberta por este fluxo.");
        }

        if (!cancelada()) {
            throw new IllegalStateException("Somente atividade cancelada pode ser reaberta.");
        }

        status = StatusAtividade.PENDENTE;
    }

    public String resumo() {
        return codigo + " - " + descricao + " | Status: " + status;
    }
}
```

---

## O que mudou na AtividadeOs

Adicionamos:

```java
pendente()
cancelada()
reabrir()
```

A regra de reabertura está no filho porque é regra do estado da própria atividade.

Mas quem chama essa regra é a raiz `OrdemServico`.

O app não chama `atividade.reabrir()`.

O service também não chama diretamente.

Quem coordena a mudança interna é a OS.

---

## OcorrenciaOs

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

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

## OrdemServico com reabertura de atividade

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

import br.com.curso.aula144.dominio.cliente.Cliente;

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

    public boolean concluida() {
        return status == StatusOs.CONCLUIDA;
    }

    public boolean cancelada() {
        return status == StatusOs.CANCELADA;
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

    public void reabrirAtividade(String codigo) {
        exigirAberta("OS encerrada não pode reabrir atividade.");

        AtividadeOs atividade = buscarAtividadeObrigatoria(codigo);
        atividade.reabrir();

        registrarOcorrencia("Atividade reaberta: " + codigo);
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
        if (cancelada()) {
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

        if (concluida()) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        if (cancelada()) {
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

    public int quantidadeOcorrencias() {
        return ocorrencias.size();
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

    public String resumoCurto() {
        return "OS " + codigo
                + " | Cliente: " + cliente.resumo()
                + " | Período: " + periodo
                + " | Prioridade: " + prioridade
                + " | Status: " + status
                + " | Atividades: " + atividades.size()
                + " | Ocorrências: " + ocorrencias.size();
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

## O que mudou na OrdemServico

Adicionamos:

```java
reabrirAtividade(String codigo)
quantidadeOcorrencias()
concluida()
cancelada()
```

E melhoramos a leitura interna:

```java
if (cancelada()) { ... }
if (concluida()) { ... }
```

Isso deixa a regra mais expressiva.

A reabertura continua passando pela raiz.

---

## OrdemServicoBuilder

Crie:

```text
src\br\com\curso\aula144\dominio\ordemservico\OrdemServicoBuilder.java
```

Código:

```java
package br.com.curso.aula144.dominio.ordemservico;

import br.com.curso.aula144.dominio.cliente.Cliente;

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

## Repositório em memória

Crie:

```text
src\br\com\curso\aula144\infra\OrdemServicoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula144.infra;

import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.OrdemServico;

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

## Notificador

Crie:

```text
src\br\com\curso\aula144\infra\NotificadorOsConsole.java
```

Código:

```java
package br.com.curso.aula144.infra;

import br.com.curso.aula144.dominio.ordemservico.OrdemServico;

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

    public void notificarAtividadeCancelada(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] Atividade cancelada na OS: " + os.codigo());
    }

    public void notificarAtividadeReaberta(OrdemServico os) {
        System.out.println("[NOTIFICAÇÃO] Atividade reaberta na OS: " + os.codigo());
    }
}
```

---

## OrdemServicoService

Crie:

```text
src\br\com\curso\aula144\aplicacao\OrdemServicoService.java
```

Código:

```java
package br.com.curso.aula144.aplicacao;

import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.OrdemServico;
import br.com.curso.aula144.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula144.infra.NotificadorOsConsole;
import br.com.curso.aula144.infra.OrdemServicoRepositorioMemoria;

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

    public void cancelarAtividade(CodigoOs codigoOs, String codigoAtividade) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.cancelarAtividade(codigoAtividade);

        repositorio.salvar(os);
        notificador.notificarAtividadeCancelada(os);
    }

    public void reabrirAtividade(CodigoOs codigoOs, String codigoAtividade) {
        OrdemServico os = buscarObrigatoria(codigoOs);

        os.reabrirAtividade(codigoAtividade);

        repositorio.salvar(os);
        notificador.notificarAtividadeReaberta(os);
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

    public OrdemServico buscar(CodigoOs codigoOs) {
        return buscarObrigatoria(codigoOs);
    }

    public List<OrdemServico> listar() {
        return repositorio.listar();
    }

    public int quantidadeTotal() {
        return repositorio.quantidade();
    }

    public int quantidadeEncerradas() {
        int total = 0;

        for (OrdemServico os : repositorio.listar()) {
            if (os.encerrada()) {
                total++;
            }
        }

        return total;
    }

    public int quantidadeAbertas() {
        return quantidadeTotal() - quantidadeEncerradas();
    }

    public int quantidadeAtividades() {
        int total = 0;

        for (OrdemServico os : repositorio.listar()) {
            total += os.quantidadeAtividades();
        }

        return total;
    }

    public int quantidadeOcorrencias() {
        int total = 0;

        for (OrdemServico os : repositorio.listar()) {
            total += os.quantidadeOcorrencias();
        }

        return total;
    }

    private OrdemServico buscarObrigatoria(CodigoOs codigoOs) {
        return repositorio.buscar(codigoOs)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + codigoOs));
    }
}
```

---

## O que mudou no service

Adicionamos:

```java
reabrirAtividade(...)
quantidadeTotal()
quantidadeEncerradas()
quantidadeAbertas()
quantidadeAtividades()
quantidadeOcorrencias()
```

Esses métodos ajudam no relatório simples.

Eles não quebram o domínio.

O relatório usa dados consultáveis.

A regra de estado continua nos objetos.

---

## ConsoleLeitura

Crie:

```text
src\br\com\curso\aula144\app\ConsoleLeitura.java
```

Código:

```java
package br.com.curso.aula144.app;

import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula144.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;
import java.util.Scanner;

public class ConsoleLeitura {
    private final Scanner scanner;

    public ConsoleLeitura(Scanner scanner) {
        if (scanner == null) {
            throw new IllegalArgumentException("Scanner é obrigatório.");
        }

        this.scanner = scanner;
    }

    public int lerInteiro(String mensagem) {
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

    public String lerTexto(String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Texto obrigatório.");
        }
    }

    public LocalDate lerData(String mensagem) {
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

    public CodigoOs lerCodigoOs() {
        String codigo = lerTexto("Código da OS (ex: OS-2026-0001): ");
        return new CodigoOs(codigo);
    }

    public TurnoAtendimento lerTurno() {
        while (true) {
            System.out.println("Turno:");
            System.out.println("1. Manhã");
            System.out.println("2. Tarde");

            int opcao = lerInteiro("Escolha o turno: ");

            if (opcao == 1) {
                return TurnoAtendimento.MANHA;
            }

            if (opcao == 2) {
                return TurnoAtendimento.TARDE;
            }

            System.out.println("Turno inválido.");
        }
    }

    public PrioridadeOs lerPrioridade() {
        while (true) {
            System.out.println("Prioridade:");
            System.out.println("1. Normal");
            System.out.println("2. Alta");
            System.out.println("3. Crítica");

            int opcao = lerInteiro("Escolha a prioridade: ");

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

## OrdemServicoConsoleApp final

Crie:

```text
src\br\com\curso\aula144\app\OrdemServicoConsoleApp.java
```

Código:

```java
package br.com.curso.aula144.app;

import br.com.curso.aula144.aplicacao.OrdemServicoService;
import br.com.curso.aula144.dominio.cliente.Cliente;
import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.OrdemServico;
import br.com.curso.aula144.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula144.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula144.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula144.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula144.infra.NotificadorOsConsole;
import br.com.curso.aula144.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class OrdemServicoConsoleApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ConsoleLeitura leitura = new ConsoleLeitura(scanner);

        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        OrdemServicoService service = new OrdemServicoService(
                repositorio,
                notificador
        );

        boolean executando = true;

        while (executando) {
            exibirMenu();

            int opcao = leitura.lerInteiro("Escolha uma opção: ");

            try {
                switch (opcao) {
                    case 1:
                        criarOs(leitura, service);
                        break;
                    case 2:
                        adicionarAtividade(leitura, service);
                        break;
                    case 3:
                        concluirAtividade(leitura, service);
                        break;
                    case 4:
                        reagendarOs(leitura, service);
                        break;
                    case 5:
                        concluirOs(leitura, service);
                        break;
                    case 6:
                        cancelarOs(leitura, service);
                        break;
                    case 7:
                        listarOs(leitura, service);
                        break;
                    case 8:
                        cancelarAtividade(leitura, service);
                        break;
                    case 9:
                        buscarOsPorCodigo(leitura, service);
                        break;
                    case 10:
                        reabrirAtividade(leitura, service);
                        break;
                    case 11:
                        exibirRelatorio(service);
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
        System.out.println("8. Cancelar atividade");
        System.out.println("9. Buscar OS por código");
        System.out.println("10. Reabrir atividade");
        System.out.println("11. Relatório simples");
        System.out.println("0. Sair");
        System.out.println("====================================");
    }

    private static void criarOs(ConsoleLeitura leitura, OrdemServicoService service) {
        System.out.println("Cadastro de OS");

        int ano = leitura.lerInteiro("Ano da OS: ");
        int numero = leitura.lerInteiro("Número da OS: ");

        int idCliente = leitura.lerInteiro("Id do cliente: ");
        String nomeCliente = leitura.lerTexto("Nome do cliente: ");
        String telefoneCliente = leitura.lerTexto("Telefone do cliente: ");

        LocalDate data = leitura.lerData("Data de atendimento (yyyy-MM-dd): ");
        TurnoAtendimento turno = leitura.lerTurno();
        PrioridadeOs prioridade = leitura.lerPrioridade();
        String origem = leitura.lerTexto("Origem da OS: ");

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

    private static void adicionarAtividade(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        String codigoAtividade = leitura.lerTexto("Código da atividade: ");
        String descricao = leitura.lerTexto("Descrição da atividade: ");

        service.adicionarAtividade(codigoOs, codigoAtividade, descricao);

        System.out.println("Atividade adicionada com sucesso.");
    }

    private static void concluirAtividade(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        String codigoAtividade = leitura.lerTexto("Código da atividade: ");

        service.concluirAtividade(codigoOs, codigoAtividade);

        System.out.println("Atividade concluída com sucesso.");
    }

    private static void cancelarAtividade(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        String codigoAtividade = leitura.lerTexto("Código da atividade: ");

        service.cancelarAtividade(codigoOs, codigoAtividade);

        System.out.println("Atividade cancelada com sucesso.");
    }

    private static void reabrirAtividade(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        String codigoAtividade = leitura.lerTexto("Código da atividade: ");

        service.reabrirAtividade(codigoOs, codigoAtividade);

        System.out.println("Atividade reaberta com sucesso.");
    }

    private static void reagendarOs(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        LocalDate data = leitura.lerData("Nova data de atendimento (yyyy-MM-dd): ");
        TurnoAtendimento turno = leitura.lerTurno();

        service.reagendar(
                codigoOs,
                new PeriodoAtendimento(data, turno)
        );

        System.out.println("OS reagendada com sucesso.");
    }

    private static void concluirOs(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();

        service.concluir(codigoOs);

        System.out.println("OS concluída com sucesso.");
    }

    private static void cancelarOs(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();
        String motivo = leitura.lerTexto("Motivo do cancelamento: ");

        service.cancelar(codigoOs, motivo);

        System.out.println("OS cancelada com sucesso.");
    }

    private static void listarOs(ConsoleLeitura leitura, OrdemServicoService service) {
        List<OrdemServico> ordens = service.listar();

        if (ordens.isEmpty()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        System.out.println("Tipo de listagem:");
        System.out.println("1. Curta");
        System.out.println("2. Detalhada");

        int tipo = leitura.lerInteiro("Escolha: ");

        for (OrdemServico os : ordens) {
            System.out.println("------------------------------------");

            if (tipo == 2) {
                System.out.println(os.resumo());
            } else {
                System.out.println(os.resumoCurto());
            }
        }

        System.out.println("------------------------------------");
        System.out.println("Total de OS cadastradas: " + ordens.size());
    }

    private static void buscarOsPorCodigo(ConsoleLeitura leitura, OrdemServicoService service) {
        CodigoOs codigoOs = leitura.lerCodigoOs();

        OrdemServico os = service.buscar(codigoOs);

        System.out.println("------------------------------------");
        System.out.println(os.resumo());
        System.out.println("------------------------------------");
    }

    private static void exibirRelatorio(OrdemServicoService service) {
        System.out.println("========== RELATÓRIO ==========");
        System.out.println("Total de OS: " + service.quantidadeTotal());
        System.out.println("OS abertas: " + service.quantidadeAbertas());
        System.out.println("OS encerradas: " + service.quantidadeEncerradas());
        System.out.println("Total de atividades: " + service.quantidadeAtividades());
        System.out.println("Total de ocorrências: " + service.quantidadeOcorrencias());
        System.out.println("===============================");
    }
}
```

---

## O que mudou no app

O menu ganhou:

```text
10. Reabrir atividade
11. Relatório simples
```

A opção 7 agora pergunta:

```text
1. Curta
2. Detalhada
```

Isso deixa o sistema mais usável.

Também mantém o app com responsabilidade clara:

```text
ler dados;
chamar service;
mostrar resultado.
```

---

## FluxoAutomaticoTesteApp final

Crie:

```text
src\br\com\curso\aula144\app\FluxoAutomaticoTesteApp.java
```

Código:

```java
package br.com.curso.aula144.app;

import br.com.curso.aula144.aplicacao.OrdemServicoService;
import br.com.curso.aula144.dominio.cliente.Cliente;
import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.OrdemServico;
import br.com.curso.aula144.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula144.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula144.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula144.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula144.infra.NotificadorOsConsole;
import br.com.curso.aula144.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;

public class FluxoAutomaticoTesteApp {
    public static void main(String[] args) {
        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        OrdemServicoService service = new OrdemServicoService(
                repositorio,
                notificador
        );

        CodigoOs codigoOs = CodigoOs.deNumero(2026, 1);

        OrdemServico os = new OrdemServicoBuilder()
                .codigo(codigoOs)
                .cliente(new Cliente(10, "Ana Silva", "11999990000"))
                .periodo(new PeriodoAtendimento(
                        LocalDate.of(2026, 12, 10),
                        TurnoAtendimento.MANHA
                ))
                .prioridade(PrioridadeOs.ALTA)
                .origem("TESTE_AUTOMATICO")
                .build();

        service.criar(os);

        service.adicionarAtividade(codigoOs, "ATV-001", "Instalar produto");
        service.adicionarAtividade(codigoOs, "ATV-002", "Validar funcionamento");

        service.cancelarAtividade(codigoOs, "ATV-002");
        service.reabrirAtividade(codigoOs, "ATV-002");

        service.concluirAtividade(codigoOs, "ATV-001");
        service.concluirAtividade(codigoOs, "ATV-002");

        service.concluir(codigoOs);

        System.out.println();
        System.out.println("Consulta detalhada:");
        System.out.println(service.buscar(codigoOs).resumo());

        System.out.println();
        System.out.println("Relatório:");
        System.out.println("Total de OS: " + service.quantidadeTotal());
        System.out.println("OS abertas: " + service.quantidadeAbertas());
        System.out.println("OS encerradas: " + service.quantidadeEncerradas());
        System.out.println("Total de atividades: " + service.quantidadeAtividades());
        System.out.println("Total de ocorrências: " + service.quantidadeOcorrencias());
    }
}
```

---

## FluxoErroTesteApp

Agora vamos criar um app só para testar erros esperados.

Crie:

```text
src\br\com\curso\aula144\app\FluxoErroTesteApp.java
```

Código:

```java
package br.com.curso.aula144.app;

import br.com.curso.aula144.aplicacao.OrdemServicoService;
import br.com.curso.aula144.dominio.cliente.Cliente;
import br.com.curso.aula144.dominio.ordemservico.CodigoOs;
import br.com.curso.aula144.dominio.ordemservico.OrdemServico;
import br.com.curso.aula144.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula144.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula144.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula144.infra.NotificadorOsConsole;
import br.com.curso.aula144.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;

public class FluxoErroTesteApp {
    public static void main(String[] args) {
        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        OrdemServicoService service = new OrdemServicoService(
                repositorio,
                notificador
        );

        CodigoOs codigoOs = CodigoOs.deNumero(2026, 2);

        OrdemServico os = new OrdemServicoBuilder()
                .codigo(codigoOs)
                .cliente(new Cliente(20, "Carlos Souza", "11888881111"))
                .periodo(new PeriodoAtendimento(
                        LocalDate.of(2026, 12, 15),
                        TurnoAtendimento.TARDE
                ))
                .build();

        service.criar(os);
        service.adicionarAtividade(codigoOs, "ATV-001", "Instalar produto");

        tentar("Reabrir atividade pendente", () -> service.reabrirAtividade(codigoOs, "ATV-001"));

        service.cancelarAtividade(codigoOs, "ATV-001");
        service.reabrirAtividade(codigoOs, "ATV-001");
        service.concluirAtividade(codigoOs, "ATV-001");

        tentar("Reabrir atividade concluída", () -> service.reabrirAtividade(codigoOs, "ATV-001"));
        tentar("Cancelar atividade concluída", () -> service.cancelarAtividade(codigoOs, "ATV-001"));

        service.concluir(codigoOs);

        tentar("Adicionar atividade em OS concluída", () -> service.adicionarAtividade(codigoOs, "ATV-002", "Nova atividade"));
        tentar("Reagendar OS concluída", () -> service.reagendar(
                codigoOs,
                new PeriodoAtendimento(
                        LocalDate.of(2026, 12, 20),
                        TurnoAtendimento.MANHA
                )
        ));

        System.out.println();
        System.out.println(os.resumo());
    }

    private static void tentar(String descricao, AcaoTeste acao) {
        try {
            acao.executar();
            System.out.println("[ERRO NO TESTE] Era esperado bloqueio: " + descricao);
        } catch (RuntimeException erro) {
            System.out.println("[BLOQUEADO] " + descricao + " -> " + erro.getMessage());
        }
    }
}

interface AcaoTeste {
    void executar();
}
```

---

## Por que criar FluxoErroTesteApp

Esse app ajuda a validar regras de bloqueio.

Ele mostra que o domínio está impedindo operações inválidas.

Exemplos:

```text
reabrir atividade pendente;
reabrir atividade concluída;
cancelar atividade concluída;
adicionar atividade em OS concluída;
reagendar OS concluída.
```

Isso é uma preparação para testes automatizados futuros.

---

## Compilando a Parte 3

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute o fluxo automático:

```powershell
java -cp out br.com.curso.aula144.app.FluxoAutomaticoTesteApp
```

Execute o fluxo de erro:

```powershell
java -cp out br.com.curso.aula144.app.FluxoErroTesteApp
```

Execute o menu:

```powershell
java -cp out br.com.curso.aula144.app.OrdemServicoConsoleApp
```

---

## Teste manual recomendado

No menu, faça este fluxo.

### 1. Criar OS

```text
1
Ano: 2026
Número: 1
Id cliente: 10
Nome: Ana Silva
Telefone: 11999990000
Data: 2026-12-10
Turno: 1
Prioridade: 2
Origem: PORTAL_CLIENTE
```

### 2. Adicionar atividades

```text
2
OS-2026-0001
ATV-001
Instalar produto
```

```text
2
OS-2026-0001
ATV-002
Validar funcionamento
```

### 3. Cancelar atividade

```text
8
OS-2026-0001
ATV-002
```

### 4. Reabrir atividade

```text
10
OS-2026-0001
ATV-002
```

### 5. Concluir atividades

```text
3
OS-2026-0001
ATV-001
```

```text
3
OS-2026-0001
ATV-002
```

### 6. Concluir OS

```text
5
OS-2026-0001
```

### 7. Buscar OS

```text
9
OS-2026-0001
```

### 8. Relatório

```text
11
```

---

## Resultado esperado

Ao final, você deve ver:

```text
OS concluída;
duas atividades concluídas;
ocorrências registrando criação, atividades, cancelamento, reabertura e conclusão;
relatório com 1 OS;
OS abertas 0;
OS encerradas 1.
```

Isso mostra que o fluxo principal está consistente.

---

## Revisão final de responsabilidade

### App

O app faz:

```text
menu;
entrada de dados;
exibição de resultado.
```

Não faz:

```text
regra de negócio central;
alteração direta de atividade;
alteração direta de status.
```

### ConsoleLeitura

Faz:

```text
ler número;
ler texto;
ler data;
ler turno;
ler prioridade;
ler código de OS.
```

Não faz:

```text
regra de domínio;
salvar;
notificar.
```

### Service

Faz:

```text
buscar OS;
chamar domínio;
salvar;
notificar;
montar relatórios simples.
```

Não faz:

```text
alterar lista diretamente;
setar status;
criar ocorrência manualmente.
```

### Domínio

Faz:

```text
validar regras;
proteger estado;
controlar filhos;
registrar ocorrências;
bloquear operações inválidas.
```

Não faz:

```text
Scanner;
banco;
notificação;
menu.
```

### Infra

Faz:

```text
armazenamento em memória;
notificação simulada.
```

Não faz:

```text
regra de negócio.
```

---

## O que este mini-projeto consolidou

Este projeto consolidou:

```text
classes com responsabilidade clara;
pacotes organizados;
objetos de valor;
entidades;
agregado;
composição;
coleções protegidas;
Builder;
service de aplicação;
infraestrutura simples;
console separado;
evolução incremental;
testes manuais e fluxos automáticos.
```

Isso é uma base forte para avançar para:

```text
testes automatizados;
Maven;
Spring Boot;
API REST;
banco de dados;
JPA;
DTOs;
controllers;
services reais;
repositories reais.
```

---

## Melhorias possíveis, mas fora desta aula

Poderíamos melhorar:

```text
criar interfaces para repositório e notificador;
criar exceções específicas de domínio;
criar camada de DTO;
criar testes com JUnit;
persistir em arquivo;
usar banco de dados;
separar relatório em outro service;
criar busca por status;
criar filtros por data;
criar paginação;
criar autenticação.
```

Essas melhorias virão em módulos futuros.

Por enquanto, o objetivo foi fechar OO e domínio com um projeto funcional.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar a Parte 3

Crie a pasta da aula 144.

Copie ou recrie os arquivos.

Garanta que todos os pacotes estejam como:

```text
br.com.curso.aula144
```

### Parte 2 — Compilar

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

### Parte 3 — Rodar fluxo automático

Execute:

```powershell
java -cp out br.com.curso.aula144.app.FluxoAutomaticoTesteApp
```

### Parte 4 — Rodar fluxo de erro

Execute:

```powershell
java -cp out br.com.curso.aula144.app.FluxoErroTesteApp
```

### Parte 5 — Rodar menu

Execute:

```powershell
java -cp out br.com.curso.aula144.app.OrdemServicoConsoleApp
```

Teste as opções:

```text
1, 2, 3, 5, 7, 8, 9, 10, 11
```

### Parte 6 — Explicar

Explique em voz alta:

```text
onde está a regra de reabrir atividade;
por que reabrir passa pela OS;
por que o service salva depois;
por que o app não manipula atividade diretamente;
por que resumoCurto e resumo existem.
```

---

## Desafio prático

Crie uma opção nova no menu:

```text
12. Buscar OS inexistente de teste
```

Essa opção deve tentar buscar:

```text
OS-9999-9999
```

e exibir uma mensagem amigável.

Objetivo:

```text
praticar tratamento de erro sem derrubar o programa.
```

Regras:

```text
não deve criar a OS;
deve chamar service.buscar(...);
deve capturar erro;
deve mostrar mensagem clara;
deve voltar para o menu.
```

Critério principal:

```text
erro esperado deve ser tratado com clareza.
```

---

## Desafio extra

Crie uma opção:

```text
13. Criar dados de exemplo
```

Essa opção deve criar automaticamente:

```text
duas OS;
algumas atividades;
uma OS aberta;
uma OS concluída;
uma OS com atividade cancelada.
```

Objetivo:

```text
facilitar testes manuais do menu.
```

Cuidado:

```text
se rodar duas vezes, pode tentar criar OS duplicada.
```

Você deve tratar isso de forma amigável.

---

## Erros comuns

### 1. Reabrir atividade direto no app

A operação deve passar pelo service e pela OS.

### 2. Colocar regra de reabertura no service

O service coordena. A regra de estado pertence ao domínio.

### 3. Esquecer ocorrência de reabertura

Mudança relevante precisa registrar histórico.

### 4. Esquecer notificação

Se o fluxo definiu notificação, o service chama a infra.

### 5. Reabrir atividade concluída

A regra deve bloquear.

### 6. Reabrir atividade pendente

A regra deve bloquear porque não faz sentido.

### 7. Listagem detalhada muito poluída

Por isso existe listagem curta.

### 8. Relatório acessando Map diretamente

O app não deve conhecer detalhes internos do repositório.

---

## Debug recomendado

Use debug em:

```text
OrdemServicoConsoleApp.java
ConsoleLeitura.java
OrdemServicoService.java
OrdemServico.java
AtividadeOs.java
FluxoAutomaticoTesteApp.java
FluxoErroTesteApp.java
```

Breakpoints recomendados:

```java
reabrirAtividade(...)
service.reabrirAtividade(...)
os.reabrirAtividade(...)
atividade.reabrir()
registrarOcorrencia(...)

exibirRelatorio(...)
quantidadeTotal()
quantidadeAbertas()
quantidadeEncerradas()

listarOs(...)
resumoCurto()
resumo()

FluxoErroTesteApp.tentar(...)
```

Observe:

```text
a chamada saindo do app;
passando pelo service;
chegando na raiz;
entrando no filho;
registrando ocorrência;
voltando para salvar e notificar.
```

Esse caminho é o mais importante da aula.

---

## Perguntas de revisão

Responda em poucas linhas:

```text
1. Por que reabrir atividade é regra de domínio?
2. Por que o app não deve chamar AtividadeOs diretamente?
3. Por que o service tem métodos de relatório?
4. Qual diferença entre OS aberta e OS encerrada?
5. Por que FluxoErroTesteApp ajuda na aprendizagem?
6. Qual é o papel do resumoCurto?
7. Qual é o papel do resumo completo?
8. Por que o repositório usa Map?
9. Por que o domínio não conhece Scanner?
10. O que este mini-projeto prepara para os próximos módulos?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar a Parte 3 do mini-projeto;
compilar sem erros;
rodar FluxoAutomaticoTesteApp;
rodar FluxoErroTesteApp;
rodar o menu;
reabrir atividade cancelada;
bloquear reabertura inválida;
listar OS em modo curto;
listar OS em modo detalhado;
exibir relatório simples;
explicar cada pacote;
explicar cada responsabilidade;
explicar por que o domínio continua protegido;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-144-mini-projeto-ordem-servico-console-parte-3
git commit -m "Aula 144: fechamento mini projeto ordem de servico console"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
um projeto orientado a objetos melhora quando evolui mantendo responsabilidades claras.
```

Você finalizou o mini-projeto de Ordem de Serviço no console com:

```text
domínio protegido;
agregado bem definido;
atividades controladas pela raiz;
ocorrências automáticas;
service de aplicação;
infraestrutura simples;
menu organizado;
fluxos automáticos;
testes de erro manuais.
```

Esse projeto fecha muito bem o Módulo 4.

Na próxima aula, vamos fazer o fechamento oficial do módulo de Orientação a Objetos e preparar a transição para o próximo módulo da formação.
