# 143 — M4.39 — Mini-projeto Ordem de Serviço Console — Parte 2

## Objetivo da aula

Nesta aula você vai continuar o mini-projeto de Ordem de Serviço no console.

Na aula anterior, você montou a primeira versão do sistema com:

```text
menu;
criação de OS;
adição de atividade;
conclusão de atividade;
reagendamento;
conclusão de OS;
cancelamento de OS;
listagem;
domínio protegido;
service de aplicação;
repositório em memória;
notificador em console.
```

Agora vamos evoluir o projeto com mais organização e mais operações.

Ao final da aula, você deve conseguir:

```text
evoluir um projeto Java sem recomeçar do zero;
refatorar leitura de console para uma classe auxiliar;
reduzir repetição no app principal;
adicionar busca de OS por código;
adicionar cancelamento de atividade;
melhorar a listagem;
manter regras no domínio;
manter coordenação na aplicação;
manter infraestrutura fora do domínio;
testar fluxos de sucesso e erro;
entender melhor a evolução incremental de um sistema.
```

Essa aula é importante porque em projeto real quase nunca você cria tudo perfeito na primeira versão.

Você cria uma versão funcional.

Depois melhora.

Essa melhoria precisa ser feita sem quebrar o que já funciona.

---

## Visão da evolução

Vamos partir do projeto da aula anterior.

Na Parte 2, vamos adicionar:

```text
8. Cancelar atividade
9. Buscar OS por código
```

Também vamos refatorar o console.

Antes, o app principal tinha muitos métodos de leitura:

```text
lerInteiro;
lerTexto;
lerData;
lerTurno;
lerPrioridade;
lerCodigoOs.
```

Agora vamos mover parte disso para uma classe auxiliar:

```text
ConsoleLeitura
```

O objetivo é deixar o app principal mais limpo.

---

## O que não vamos mudar

Não vamos mudar a ideia central do domínio.

A `OrdemServico` continua sendo a raiz do agregado.

A `AtividadeOs` continua sendo filha.

A `OcorrenciaOs` continua sendo filha.

O app continua sem alterar lista diretamente.

O service continua coordenando.

O repositório continua em memória.

A infraestrutura continua fora do domínio.

Ou seja:

```text
vamos evoluir sem destruir a arquitetura mental que já montamos.
```

---

## Estrutura final esperada

A estrutura ficará assim:

```text
app
  OrdemServicoConsoleApp
  ConsoleLeitura
  FluxoAutomaticoTesteApp

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

A novidade principal é:

```text
ConsoleLeitura;
FluxoAutomaticoTesteApp;
novos métodos no service;
menu com opções 8 e 9.
```

---

## Criando a pasta da Parte 2

Crie a nova pasta:

```powershell
mkdir labs\m4\aula-143-mini-projeto-ordem-servico-console-parte-2
cd labs\m4\aula-143-mini-projeto-ordem-servico-console-parte-2
```

Você tem duas opções.

### Opção A — Copiar da aula anterior

Se você já fez a aula 142, copie a pasta `src` dela para esta aula e depois aplique as alterações.

Exemplo conceitual:

```powershell
Copy-Item ..\aula-142-mini-projeto-ordem-servico-console\src . -Recurse
```

Depois ajuste os pacotes de:

```text
br.com.curso.aula142
```

para:

```text
br.com.curso.aula143
```

### Opção B — Criar do zero

Se preferir criar do zero, crie a estrutura abaixo e cole os códigos desta aula.

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula143
mkdir src\br\com\curso\aula143\app
mkdir src\br\com\curso\aula143\aplicacao
mkdir src\br\com\curso\aula143\infra
mkdir src\br\com\curso\aula143\dominio
mkdir src\br\com\curso\aula143\dominio\cliente
mkdir src\br\com\curso\aula143\dominio\ordemservico
```

Nesta aula, vou deixar o código completo dos arquivos principais para a Parte 2.

---

## Cliente

Crie:

```text
src\br\com\curso\aula143\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula143.dominio.cliente;

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
src\br\com\curso\aula143\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

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
src\br\com\curso\aula143\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\StatusAtividade.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

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
src\br\com\curso\aula143\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

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

## AtividadeOs

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

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

## OcorrenciaOs

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

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

## OrdemServico

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

import br.com.curso.aula143.dominio.cliente.Cliente;

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

    public String resumoCurto() {
        return "OS " + codigo
                + " | Cliente: " + cliente.resumo()
                + " | Período: " + periodo
                + " | Prioridade: " + prioridade
                + " | Status: " + status
                + " | Atividades: " + atividades.size();
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

A principal melhoria aqui foi adicionar:

```java
public String resumoCurto()
```

Esse método ajuda na listagem.

A listagem não precisa exibir todas as ocorrências e atividades detalhadas.

Para o detalhe completo, usamos:

```java
resumo()
```

Isso treina uma ideia importante:

```text
nem toda tela precisa do mesmo nível de detalhe.
```

---

## OrdemServicoBuilder

Crie:

```text
src\br\com\curso\aula143\dominio\ordemservico\OrdemServicoBuilder.java
```

Código:

```java
package br.com.curso.aula143.dominio.ordemservico;

import br.com.curso.aula143.dominio.cliente.Cliente;

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
src\br\com\curso\aula143\infra\OrdemServicoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula143.infra;

import br.com.curso.aula143.dominio.ordemservico.CodigoOs;
import br.com.curso.aula143.dominio.ordemservico.OrdemServico;

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
src\br\com\curso\aula143\infra\NotificadorOsConsole.java
```

Código:

```java
package br.com.curso.aula143.infra;

import br.com.curso.aula143.dominio.ordemservico.OrdemServico;

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
}
```

---

## O que mudou no notificador

Adicionamos:

```java
notificarAtividadeCancelada(...)
```

Isso acompanha a nova operação do menu.

Mas repare:

```text
quem cancela a atividade é a OS;
quem coordena o fluxo é o service;
quem notifica é a infraestrutura.
```

A regra continua no domínio.

---

## OrdemServicoService

Crie:

```text
src\br\com\curso\aula143\aplicacao\OrdemServicoService.java
```

Código:

```java
package br.com.curso.aula143.aplicacao;

import br.com.curso.aula143.dominio.ordemservico.CodigoOs;
import br.com.curso.aula143.dominio.ordemservico.OrdemServico;
import br.com.curso.aula143.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula143.infra.NotificadorOsConsole;
import br.com.curso.aula143.infra.OrdemServicoRepositorioMemoria;

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
cancelarAtividade(...)
buscar(...)
```

Agora o menu poderá:

```text
cancelar uma atividade;
buscar uma OS específica por código.
```

O service continua sem alterar lista diretamente.

Ele chama:

```java
os.cancelarAtividade(codigoAtividade);
```

A regra continua dentro da raiz `OrdemServico`.

---

## ConsoleLeitura

Agora vamos refatorar a leitura do console.

Crie:

```text
src\br\com\curso\aula143\app\ConsoleLeitura.java
```

Código:

```java
package br.com.curso.aula143.app;

import br.com.curso.aula143.dominio.ordemservico.CodigoOs;
import br.com.curso.aula143.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula143.dominio.ordemservico.TurnoAtendimento;

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

## Por que criamos ConsoleLeitura

Antes, o `OrdemServicoConsoleApp` tinha muitos métodos apenas para leitura.

Isso deixava o app grande.

Agora a responsabilidade de leitura ficou em uma classe específica:

```text
ConsoleLeitura
```

Ela não é domínio.

Ela pertence ao app.

O domínio não conhece `Scanner`.

Isso reforça o limite:

```text
entrada de dados é responsabilidade da camada de interface.
```

---

## OrdemServicoConsoleApp refatorado

Agora crie:

```text
src\br\com\curso\aula143\app\OrdemServicoConsoleApp.java
```

Código:

```java
package br.com.curso.aula143.app;

import br.com.curso.aula143.aplicacao.OrdemServicoService;
import br.com.curso.aula143.dominio.cliente.Cliente;
import br.com.curso.aula143.dominio.ordemservico.CodigoOs;
import br.com.curso.aula143.dominio.ordemservico.OrdemServico;
import br.com.curso.aula143.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula143.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula143.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula143.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula143.infra.NotificadorOsConsole;
import br.com.curso.aula143.infra.OrdemServicoRepositorioMemoria;

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
                        listarOs(service);
                        break;
                    case 8:
                        cancelarAtividade(leitura, service);
                        break;
                    case 9:
                        buscarOsPorCodigo(leitura, service);
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

    private static void listarOs(OrdemServicoService service) {
        List<OrdemServico> ordens = service.listar();

        if (ordens.isEmpty()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        for (OrdemServico os : ordens) {
            System.out.println("------------------------------------");
            System.out.println(os.resumoCurto());
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
}
```

---

## O que melhorou no app principal

O app principal agora não tem mais todos os métodos de leitura.

Ele usa:

```java
ConsoleLeitura leitura = new ConsoleLeitura(scanner);
```

E chama:

```java
leitura.lerInteiro(...)
leitura.lerTexto(...)
leitura.lerData(...)
leitura.lerCodigoOs()
leitura.lerTurno()
leitura.lerPrioridade()
```

Isso deixou `OrdemServicoConsoleApp` mais focado no menu.

---

## FluxoAutomaticoTesteApp

Menus são bons para uso manual.

Mas às vezes é útil ter um app que roda um fluxo automático para testar rapidamente.

Crie:

```text
src\br\com\curso\aula143\app\FluxoAutomaticoTesteApp.java
```

Código:

```java
package br.com.curso.aula143.app;

import br.com.curso.aula143.aplicacao.OrdemServicoService;
import br.com.curso.aula143.dominio.cliente.Cliente;
import br.com.curso.aula143.dominio.ordemservico.CodigoOs;
import br.com.curso.aula143.dominio.ordemservico.OrdemServico;
import br.com.curso.aula143.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula143.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula143.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula143.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula143.infra.NotificadorOsConsole;
import br.com.curso.aula143.infra.OrdemServicoRepositorioMemoria;

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

        System.out.println();
        System.out.println("Consulta detalhada:");
        System.out.println(service.buscar(codigoOs).resumo());

        System.out.println();
        System.out.println("Listagem curta:");
        for (OrdemServico ordem : service.listar()) {
            System.out.println(ordem.resumoCurto());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula143.app.FluxoAutomaticoTesteApp
```

---

## Por que criar um fluxo automático

O menu exige digitar dados.

Isso é bom para testar interação.

Mas o fluxo automático é útil para:

```text
validar rapidamente se o projeto compila;
testar regra sem digitação;
debugar service e domínio;
ter cenário fixo de exemplo.
```

Isso é uma prática comum.

Mais adiante, essa ideia evolui para testes automatizados.

---

## Compilando o projeto

Compile tudo:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute o fluxo automático:

```powershell
java -cp out br.com.curso.aula143.app.FluxoAutomaticoTesteApp
```

Execute o menu:

```powershell
java -cp out br.com.curso.aula143.app.OrdemServicoConsoleApp
```

---

## Teste manual recomendado no menu

### 1. Criar OS

Escolha:

```text
1
```

Dados sugeridos:

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

### 2. Adicionar atividades

Escolha:

```text
2
```

Adicione:

```text
ATV-001 - Instalar produto
ATV-002 - Validar funcionamento
```

### 3. Cancelar atividade

Escolha:

```text
8
```

Informe:

```text
Código da OS: OS-2026-0001
Código da atividade: ATV-002
```

### 4. Buscar OS por código

Escolha:

```text
9
```

Informe:

```text
OS-2026-0001
```

Veja se aparece:

```text
atividade cancelada;
ocorrência de cancelamento da atividade.
```

### 5. Tentar concluir OS

Escolha:

```text
5
```

A OS deve bloquear, porque nem todas as atividades estão concluídas.

### 6. Listar OS

Escolha:

```text
7
```

A listagem agora deve aparecer curta.

---

## O que você deve observar

Observe que cancelar atividade passa por esta sequência:

```text
Console:
lê código da OS e atividade.

Service:
busca OS no repositório.

Domínio:
executa os.cancelarAtividade(...).

Infra:
salva OS e notifica.
```

O app não acessa lista de atividades.

O service não altera status da atividade diretamente.

A OS protege a regra.

---

## Reforço sobre responsabilidade

A operação `cancelarAtividade` poderia ter sido feita errado assim:

```java
os.atividades().get(0).cancelar();
```

Mas isso seria errado por vários motivos:

```text
atividades() retorna cópia;
cancelar() não é public;
a OS precisa registrar ocorrência;
a OS precisa validar se está encerrada;
a raiz do agregado precisa coordenar a mudança.
```

O jeito correto é:

```java
os.cancelarAtividade("ATV-002");
```

---

## Por que buscar OS por código pertence ao service

O domínio `OrdemServico` não busca a si mesmo.

Buscar dados é responsabilidade externa.

No nosso projeto:

```text
repositório armazena;
service coordena a busca;
app pede a busca.
```

Por isso criamos:

```java
public OrdemServico buscar(CodigoOs codigoOs)
```

em `OrdemServicoService`.

Isso evita o app conhecer detalhes do repositório.

---

## Por que listar curto e buscar detalhado

No menu, a opção 7 lista todas as OS.

Se cada OS mostrar todas as ocorrências, a tela pode ficar poluída.

Então usamos:

```java
resumoCurto()
```

Na busca específica, usamos:

```java
resumo()
```

Isso treina uma ideia de backend:

```text
operações diferentes podem retornar visões diferentes do mesmo objeto.
```

Mais adiante, isso vira DTOs diferentes.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar a Parte 2

Crie a pasta da aula 143.

Copie ou recrie os arquivos.

Garanta que todos os pacotes estejam como:

```text
br.com.curso.aula143
```

### Parte 2 — Compilar

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

### Parte 3 — Rodar fluxo automático

Execute:

```powershell
java -cp out br.com.curso.aula143.app.FluxoAutomaticoTesteApp
```

Confirme que aparece:

```text
OS criada;
atividade cancelada;
consulta detalhada;
listagem curta.
```

### Parte 4 — Rodar menu

Execute:

```powershell
java -cp out br.com.curso.aula143.app.OrdemServicoConsoleApp
```

Teste:

```text
criar OS;
adicionar atividade;
cancelar atividade;
buscar OS;
listar OS.
```

### Parte 5 — Testar erro

Tente cancelar uma atividade inexistente.

O sistema deve mostrar erro.

Tente buscar uma OS inexistente.

O sistema deve mostrar erro.

---

## Desafio prático

Adicione uma nova opção ao menu:

```text
10. Reabrir atividade cancelada
```

Regras:

```text
somente atividade CANCELADA pode ser reaberta;
atividade CONCLUIDA não pode ser reaberta;
OS encerrada não pode reabrir atividade;
reabrir atividade muda status para PENDENTE;
deve registrar ocorrência;
deve salvar no repositório;
deve notificar no console.
```

Você precisará alterar:

```text
StatusAtividade não precisa mudar.
AtividadeOs precisa de método reabrir().
OrdemServico precisa de método reabrirAtividade(String codigo).
OrdemServicoService precisa de método reabrirAtividade(...).
NotificadorOsConsole pode ganhar notificarAtividadeReaberta(...).
OrdemServicoConsoleApp precisa de opção 10.
```

Critério principal:

```text
a reabertura precisa passar pela raiz OrdemServico.
```

---

## Desafio extra

Melhore a opção de listar OS.

Crie um menu de listagem:

```text
1. Listagem curta
2. Listagem detalhada
```

Regras:

```text
listagem curta usa resumoCurto();
listagem detalhada usa resumo();
se não houver OS, exibe mensagem única;
o app não deve acessar dados internos da OS.
```

Esse desafio treina:

```text
visões diferentes;
menu dentro de menu;
uso de métodos de consulta;
organização do console.
```

---

## Erros comuns

### 1. Esquecer de mudar pacote aula142 para aula143

Se copiou arquivos, verifique o package no topo de cada classe.

### 2. Cancelar atividade direto no app

Não faça isso. A operação deve passar pelo service e pela OS.

### 3. Esquecer de salvar depois de cancelar atividade

O service deve salvar após alteração.

### 4. Esquecer de registrar ocorrência

A ocorrência deve ser registrada dentro da OS.

### 5. Colocar Scanner dentro do domínio

Entrada de console não pertence ao domínio.

### 6. Usar resumo completo na listagem geral

Funciona, mas deixa o console poluído.

### 7. Deixar buscar retornar null

Use erro claro ou `Optional` no repositório.

### 8. Criar setStatus na atividade

Use métodos de domínio, não setter genérico.

---

## Debug recomendado

Use debug em:

```text
OrdemServicoConsoleApp.java
ConsoleLeitura.java
OrdemServicoService.java
OrdemServico.java
AtividadeOs.java
OrdemServicoRepositorioMemoria.java
FluxoAutomaticoTesteApp.java
```

Breakpoints recomendados:

```java
ConsoleLeitura.lerCodigoOs()
ConsoleLeitura.lerInteiro(...)
ConsoleLeitura.lerData(...)

service.cancelarAtividade(...)
buscarObrigatoria(...)
repositorio.buscar(...)

os.cancelarAtividade(...)
buscarAtividadeObrigatoria(...)
atividade.cancelar()
registrarOcorrencia(...)

service.buscar(...)
listarOs(...)
buscarOsPorCodigo(...)
```

Observe:

```text
como a entrada chega pelo console;
como o service busca a OS;
como o domínio executa regra;
como a ocorrência é gerada;
como o repositório mantém a OS em memória;
como a busca detalhada usa resumo completo;
como a listagem usa resumo curto.
```

---

## Perguntas de revisão

Responda em poucas linhas:

```text
1. Por que criamos ConsoleLeitura?
2. Por que cancelar atividade precisa passar pela OS?
3. Por que buscar OS por código ficou no service?
4. Qual diferença entre resumoCurto e resumo?
5. Por que FluxoAutomaticoTesteApp é útil?
6. O que acontece se tentar cancelar atividade inexistente?
7. O que acontece se tentar buscar OS inexistente?
8. Por que Scanner não deve ficar no domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar a Parte 2 do mini-projeto;
compilar sem erros;
rodar o fluxo automático;
rodar o menu;
criar OS;
adicionar atividade;
cancelar atividade;
buscar OS por código;
listar OS com resumo curto;
explicar ConsoleLeitura;
explicar o papel do service;
explicar por que a regra continua no domínio;
resolver o desafio de reabrir atividade;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-143-mini-projeto-ordem-servico-console-parte-2
git commit -m "Aula 143: evolucao mini projeto ordem de servico console"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
evoluir um projeto é adicionar comportamento novo mantendo as responsabilidades bem separadas.
```

Você adicionou cancelamento de atividade, busca por código, listagem curta e uma classe auxiliar de leitura, sem enfraquecer o domínio.

A `OrdemServico` continuou sendo a raiz do agregado.

O service continuou coordenando.

A infraestrutura continuou fora do domínio.

Na próxima aula, vamos continuar o mini-projeto com foco em refatoração final, organização de métodos, revisão de bugs comuns e preparação para o fechamento do Módulo 4.
