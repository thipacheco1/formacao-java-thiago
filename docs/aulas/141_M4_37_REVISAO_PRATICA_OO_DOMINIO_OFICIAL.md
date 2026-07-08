# 141 — M4.37 — Revisão prática OO + domínio

## Objetivo da aula

Nesta aula você vai fazer uma revisão prática do que estudou no módulo de Orientação a Objetos até aqui.

Nas últimas aulas, você estudou:

```text
objetos de valor;
entidades;
encapsulamento;
Tell, Don't Ask;
objetos anêmicos;
invariantes;
serviços de domínio;
factories;
builder;
coleções dentro de objetos;
composição com coleções;
agregados;
limites de responsabilidade do domínio.
```

Agora vamos juntar essas ideias em um exercício maior.

Ao final da aula, você deve conseguir:

```text
identificar objetos de valor;
criar entidades com comportamento;
proteger invariantes;
usar enum para estados;
usar coleção interna protegida;
aplicar composição;
definir uma raiz de agregado;
usar Builder quando a criação tem muitos dados;
separar domínio, aplicação e infraestrutura;
criar um fluxo completo de OrdemServico;
explicar por que cada classe existe.
```

A ideia não é aprender um conceito novo.

A ideia é consolidar.

Você vai montar um pequeno domínio de `OrdemServico` com atividades, ocorrências, builder, use case, repositório em memória e notificador simples.

---

## Visão do exercício

Vamos modelar este cenário:

```text
Uma Ordem de Serviço é criada para um cliente.
Ela possui um período de atendimento.
Ela pode ter várias atividades.
Ela registra ocorrências automaticamente.
Ela pode ser reagendada.
Ela só pode ser concluída quando todas as atividades estiverem concluídas.
Ela não pode ser alterada depois de encerrada.
A aplicação coordena o fluxo.
A infraestrutura salva e notifica de forma simulada.
```

Esse exercício revisa:

```text
classe;
objeto;
atributo;
método;
construtor;
enum;
BigDecimal por meio de Dinheiro;
LocalDate;
LocalDateTime;
encapsulamento;
composição;
agregado;
Builder;
use case;
infraestrutura simples.
```

---

## Mapa mental da modelagem

A estrutura principal será:

```text
OrdemServico
  - AtividadeOs
  - OcorrenciaOs
  - PeriodoAtendimento
  - CodigoOs
  -> Cliente
```

Onde:

```text
OrdemServico é a raiz do agregado.
AtividadeOs é filha da OS.
OcorrenciaOs é filha da OS.
PeriodoAtendimento é objeto de valor.
CodigoOs é objeto de valor.
Cliente é associação.
```

A OS controla as atividades e ocorrências.

O app não deve alterar atividade diretamente.

O app não deve criar ocorrência diretamente.

---

## O que queremos evitar

Queremos evitar este tipo de domínio:

```text
OS com getStatus e setStatus;
lista de atividades pública;
status como String;
atividade sendo concluída por fora;
ocorrência sendo adicionada pelo app;
OS salvando no banco dentro dela;
OS enviando WhatsApp dentro dela;
regra de conclusão espalhada no app.
```

Esse seria um modelo fraco.

Vamos construir um modelo mais profissional.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-141-revisao-pratica-oo-dominio
cd labs\m4\aula-141-revisao-pratica-oo-dominio
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula141
mkdir src\br\com\curso\aula141\app
mkdir src\br\com\curso\aula141\dominio
mkdir src\br\com\curso\aula141\dominio\cliente
mkdir src\br\com\curso\aula141\dominio\ordemservico
mkdir src\br\com\curso\aula141\dominio\valor
mkdir src\br\com\curso\aula141\aplicacao
mkdir src\br\com\curso\aula141\infra
```

A divisão será:

```text
dominio:
regras de negócio.

aplicacao:
coordena casos de uso.

infra:
simula banco e notificação.

app:
executa o cenário.
```

---

## Objeto de valor: Dinheiro

Mesmo que o foco seja OS, vamos manter `Dinheiro` no projeto para revisar objeto de valor monetário.

Crie:

```text
src\br\com\curso\aula141\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula141.dominio.valor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Dinheiro {
    private final BigDecimal valor;

    private Dinheiro(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static Dinheiro de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new Dinheiro(new BigDecimal(valor));
    }

    public static Dinheiro zero() {
        return new Dinheiro(BigDecimal.ZERO);
    }

    public boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public Dinheiro somar(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new Dinheiro(valor.add(outro.valor));
    }

    public Dinheiro multiplicar(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        return new Dinheiro(valor.multiply(BigDecimal.valueOf(quantidade)));
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        Dinheiro dinheiro = (Dinheiro) outro;
        return Objects.equals(valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

---

## Revisão do Dinheiro

`Dinheiro` revisa:

```text
BigDecimal;
construtor privado;
static factory method;
imutabilidade;
equals;
hashCode;
toString;
regra de valor nulo;
escala monetária.
```

Ele é objeto de valor porque sua identidade está no valor.

Dois objetos `Dinheiro.de("10.00")` representam o mesmo valor.

---

## Entidade associada: Cliente

Crie:

```text
src\br\com\curso\aula141\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula141.dominio.cliente;

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

## Revisão do Cliente

`Cliente` é entidade associada.

A OS conhece o cliente.

Mas a OS não é dona do cliente.

Isso revisa a diferença:

```text
associação:
o objeto existe fora do agregado.

composição:
o objeto pertence ao agregado.
```

Neste exercício:

```text
Cliente é associação.
AtividadeOs e OcorrenciaOs são composição.
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

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

## Revisão do CodigoOs

`CodigoOs` revisa:

```text
objeto de valor;
validação no construtor;
static factory;
prefixo obrigatório;
equals e hashCode;
toString com critério.
```

Ele evita espalhar `String` de código de OS pelo sistema.

Em vez de:

```java
String codigo = "OS-2026-0001";
```

usamos:

```java
CodigoOs codigo = CodigoOs.deNumero(2026, 1);
```

---

## Enums da OS

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\StatusAtividade.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

public enum StatusAtividade {
    PENDENTE,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

---

## Revisão dos enums

Enums evitam status como `String`.

Ruim:

```java
status = "CONCLUIDAAA";
```

Melhor:

```java
status = StatusOs.CONCLUIDA;
```

Enums revisam:

```text
valores controlados;
legibilidade;
menos erro de digitação;
regras com comparação segura.
```

---

## Período de atendimento

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

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

## Revisão do PeriodoAtendimento

`PeriodoAtendimento` revisa:

```text
LocalDate;
enum dentro de objeto de valor;
imutabilidade;
equals;
hashCode;
método de consulta com intenção;
validação de nulo.
```

Ele evita dois atributos soltos na OS:

```text
LocalDate data;
String turno;
```

Em vez disso, a OS trabalha com um conceito do domínio:

```text
PeriodoAtendimento.
```

---

## Atividade da OS

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

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

## Revisão da AtividadeOs

`AtividadeOs` é filha da OS.

Observe:

```java
AtividadeOs(...)
```

O construtor não é `public`.

Os métodos de alteração também não são públicos:

```java
void concluir()
void cancelar()
```

Isso revisa:

```text
composição;
package-private;
filho controlado pela raiz;
encapsulamento de transição;
regra de status.
```

O app não deve chamar:

```java
atividade.concluir();
```

O app deve chamar:

```java
os.concluirAtividade("ATV-001");
```

---

## Ocorrência da OS

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

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

## Revisão da OcorrenciaOs

`OcorrenciaOs` é filha da OS.

O app não cria ocorrência.

A OS cria ocorrência como consequência de uma ação:

```text
criação;
atividade adicionada;
atividade concluída;
reagendamento;
conclusão;
cancelamento.
```

Isso revisa:

```text
histórico interno;
evento de domínio simples;
composição;
coleção protegida.
```

---

## OrdemServico como raiz do agregado

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

import br.com.curso.aula141.dominio.cliente.Cliente;

import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private final CodigoOs codigo;
    private final Cliente cliente;
    private final String origem;
    private final PrioridadeOs prioridade;
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

        for (AtividadeOs atividade : atividades) {
            texto.append("\n- ").append(atividade.resumo());
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

## Revisão da OrdemServico

Essa classe junta muitos conceitos:

```text
entidade;
raiz de agregado;
composição;
coleções protegidas;
invariantes;
enum;
objeto de valor;
associação com Cliente;
Tell, Don't Ask;
histórico interno;
métodos de domínio;
ausência de setters perigosos.
```

A OS não tem:

```text
setStatus;
setPeriodo;
setQuantidadeReagendamentos;
getAtividades mutável;
getOcorrencias mutável.
```

Ela tem métodos de negócio:

```text
adicionarAtividade;
concluirAtividade;
cancelarAtividade;
reagendar;
concluir;
cancelar.
```

---

## Builder da OrdemServico

Crie:

```text
src\br\com\curso\aula141\dominio\ordemservico\OrdemServicoBuilder.java
```

Código:

```java
package br.com.curso.aula141.dominio.ordemservico;

import br.com.curso.aula141.dominio.cliente.Cliente;

public class OrdemServicoBuilder {
    private CodigoOs codigo;
    private Cliente cliente;
    private PeriodoAtendimento periodo;
    private PrioridadeOs prioridade;
    private String origem;

    public OrdemServicoBuilder() {
        this.prioridade = PrioridadeOs.NORMAL;
        this.origem = "SISTEMA";
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

## Revisão do Builder

O Builder revisa:

```text
criação com muitos dados;
valores padrão;
métodos encadeados;
return this;
build;
construtor da entidade sem public;
objeto final protegendo invariantes.
```

A factory simples poderia funcionar também.

Mas aqui o Builder é interessante porque a OS tem:

```text
código;
cliente;
período;
prioridade;
origem.
```

---

## Infraestrutura: repositório em memória

Crie:

```text
src\br\com\curso\aula141\infra\OrdemServicoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula141.infra;

import br.com.curso.aula141.dominio.ordemservico.CodigoOs;
import br.com.curso.aula141.dominio.ordemservico.OrdemServico;

import java.util.ArrayList;
import java.util.List;

public class OrdemServicoRepositorioMemoria {
    private final List<OrdemServico> ordens;

    public OrdemServicoRepositorioMemoria() {
        this.ordens = new ArrayList<>();
    }

    public void salvar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        ordens.add(os);
        System.out.println("[INFRA] OS salva em memória: " + os.codigo());
    }

    public boolean existe(CodigoOs codigo) {
        for (OrdemServico os : ordens) {
            if (os.codigo().equals(codigo)) {
                return true;
            }
        }

        return false;
    }

    public int quantidade() {
        return ordens.size();
    }
}
```

---

## Infraestrutura: notificador

Crie:

```text
src\br\com\curso\aula141\infra\NotificadorOsConsole.java
```

Código:

```java
package br.com.curso.aula141.infra;

import br.com.curso.aula141.dominio.ordemservico.OrdemServico;

public class NotificadorOsConsole {
    public void enviarCriacao(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[INFRA] Notificação de criação enviada para " + os.cliente().telefone());
        System.out.println("[INFRA] OS criada: " + os.codigo());
    }

    public void enviarReagendamento(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[INFRA] Notificação de reagendamento enviada para " + os.cliente().telefone());
        System.out.println("[INFRA] OS reagendada: " + os.codigo());
    }

    public void enviarConclusao(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[INFRA] Notificação de conclusão enviada para " + os.cliente().telefone());
        System.out.println("[INFRA] OS concluída: " + os.codigo());
    }
}
```

---

## Revisão da infraestrutura

Essas classes ficam fora do domínio.

Elas simulam:

```text
salvar;
notificar.
```

A OS não sabe que elas existem.

Isso revisa:

```text
limites de responsabilidade do domínio;
infraestrutura separada;
baixo acoplamento;
domínio mais puro.
```

---

## Use case de criação

Crie:

```text
src\br\com\curso\aula141\aplicacao\CriarOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula141.aplicacao;

import br.com.curso.aula141.dominio.ordemservico.OrdemServico;
import br.com.curso.aula141.infra.NotificadorOsConsole;
import br.com.curso.aula141.infra.OrdemServicoRepositorioMemoria;

public class CriarOrdemServicoUseCase {
    private final OrdemServicoRepositorioMemoria repositorio;
    private final NotificadorOsConsole notificador;

    public CriarOrdemServicoUseCase(
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

    public void executar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (repositorio.existe(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo());
        }

        repositorio.salvar(os);
        notificador.enviarCriacao(os);
    }
}
```

---

## Use case de reagendamento

Crie:

```text
src\br\com\curso\aula141\aplicacao\ReagendarOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula141.aplicacao;

import br.com.curso.aula141.dominio.ordemservico.OrdemServico;
import br.com.curso.aula141.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula141.infra.NotificadorOsConsole;
import br.com.curso.aula141.infra.OrdemServicoRepositorioMemoria;

public class ReagendarOrdemServicoUseCase {
    private final OrdemServicoRepositorioMemoria repositorio;
    private final NotificadorOsConsole notificador;

    public ReagendarOrdemServicoUseCase(
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

    public void executar(OrdemServico os, PeriodoAtendimento novoPeriodo) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        os.reagendar(novoPeriodo);

        repositorio.salvar(os);
        notificador.enviarReagendamento(os);
    }
}
```

---

## Use case de conclusão

Crie:

```text
src\br\com\curso\aula141\aplicacao\ConcluirOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula141.aplicacao;

import br.com.curso.aula141.dominio.ordemservico.OrdemServico;
import br.com.curso.aula141.infra.NotificadorOsConsole;
import br.com.curso.aula141.infra.OrdemServicoRepositorioMemoria;

public class ConcluirOrdemServicoUseCase {
    private final OrdemServicoRepositorioMemoria repositorio;
    private final NotificadorOsConsole notificador;

    public ConcluirOrdemServicoUseCase(
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

    public void executar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        os.concluir();

        repositorio.salvar(os);
        notificador.enviarConclusao(os);
    }
}
```

---

## Revisão dos use cases

Os use cases revisam:

```text
camada de aplicação;
coordenação de fluxo;
chamada do domínio;
chamada da infraestrutura;
não roubar regra da entidade;
não acessar detalhes internos da OS.
```

Eles não fazem:

```text
setStatus;
alterar lista de atividades diretamente;
criar ocorrência diretamente;
calcular se pode concluir por fora.
```

A regra continua na OS.

---

## App principal da revisão

Crie:

```text
src\br\com\curso\aula141\app\RevisaoOoDominioApp.java
```

Código:

```java
package br.com.curso.aula141.app;

import br.com.curso.aula141.aplicacao.ConcluirOrdemServicoUseCase;
import br.com.curso.aula141.aplicacao.CriarOrdemServicoUseCase;
import br.com.curso.aula141.aplicacao.ReagendarOrdemServicoUseCase;
import br.com.curso.aula141.dominio.cliente.Cliente;
import br.com.curso.aula141.dominio.ordemservico.CodigoOs;
import br.com.curso.aula141.dominio.ordemservico.OrdemServico;
import br.com.curso.aula141.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula141.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula141.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula141.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula141.infra.NotificadorOsConsole;
import br.com.curso.aula141.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;

public class RevisaoOoDominioApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva",
                "(11) 99999-0000"
        );

        OrdemServico os = new OrdemServicoBuilder()
                .codigo(CodigoOs.deNumero(2026, 1))
                .cliente(cliente)
                .periodo(new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                ))
                .prioridade(PrioridadeOs.ALTA)
                .origem("PORTAL_CLIENTE")
                .build();

        os.adicionarAtividade("ATV-001", "Instalar produto");
        os.adicionarAtividade("ATV-002", "Validar funcionamento");

        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        CriarOrdemServicoUseCase criarUseCase = new CriarOrdemServicoUseCase(
                repositorio,
                notificador
        );

        ReagendarOrdemServicoUseCase reagendarUseCase = new ReagendarOrdemServicoUseCase(
                repositorio,
                notificador
        );

        ConcluirOrdemServicoUseCase concluirUseCase = new ConcluirOrdemServicoUseCase(
                repositorio,
                notificador
        );

        criarUseCase.executar(os);

        reagendarUseCase.executar(
                os,
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(3),
                        TurnoAtendimento.TARDE
                )
        );

        os.concluirAtividade("ATV-001");
        os.concluirAtividade("ATV-002");

        concluirUseCase.executar(os);

        System.out.println();
        System.out.println(os.resumo());
        System.out.println();
        System.out.println("Quantidade de registros salvos em memória: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula141.app.RevisaoOoDominioApp
```

---

## O que esse app demonstra

O app demonstra um fluxo completo:

```text
cria Cliente;
monta OrdemServico com Builder;
adiciona atividades pela raiz;
cria infraestrutura;
cria use cases;
salva e notifica criação;
reagenda pela aplicação;
conclui atividades pela raiz;
conclui OS pela aplicação;
exibe resumo.
```

Ele mostra a separação:

```text
app monta cenário;
use case coordena;
domínio protege regra;
infra simula efeitos externos.
```

---

## Teste de bloqueio

Agora crie um app para ver a regra bloqueando uma conclusão inválida.

Crie:

```text
src\br\com\curso\aula141\app\RevisaoOoDominioBloqueioApp.java
```

Código:

```java
package br.com.curso.aula141.app;

import br.com.curso.aula141.dominio.cliente.Cliente;
import br.com.curso.aula141.dominio.ordemservico.CodigoOs;
import br.com.curso.aula141.dominio.ordemservico.OrdemServico;
import br.com.curso.aula141.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula141.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula141.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class RevisaoOoDominioBloqueioApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServicoBuilder()
                .codigo(CodigoOs.deNumero(2026, 2))
                .cliente(new Cliente(20, "Carlos Souza", "(11) 98888-1111"))
                .periodo(new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                ))
                .build();

        os.adicionarAtividade("ATV-001", "Instalar produto");
        os.adicionarAtividade("ATV-002", "Validar funcionamento");

        os.concluirAtividade("ATV-001");

        try {
            os.concluir();
        } catch (IllegalStateException erro) {
            System.out.println("Conclusão bloqueada: " + erro.getMessage());
        }

        System.out.println();
        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula141.app.RevisaoOoDominioBloqueioApp
```

---

## O que esse teste demonstra

A OS bloqueia a conclusão porque nem todas as atividades estão concluídas.

A regra está aqui:

```java
if (!todasAtividadesConcluidas()) {
    throw new IllegalStateException("Todas as atividades precisam estar concluídas.");
}
```

Essa regra pertence à OS.

Não deveria ficar espalhada no app.

Isso revisa:

```text
invariante;
agregado;
regra envolvendo coleção;
raiz protegendo consistência.
```

---

## Revisão conceitual por classe

### Dinheiro

Conceitos revisados:

```text
objeto de valor;
BigDecimal;
imutabilidade;
static factory;
equals/hashCode.
```

### Cliente

Conceitos revisados:

```text
entidade associada;
validação de dados;
objeto com identidade.
```

### CodigoOs

Conceitos revisados:

```text
objeto de valor;
validação de formato;
factory method;
toString.
```

### PeriodoAtendimento

Conceitos revisados:

```text
objeto de valor;
LocalDate;
enum;
equals/hashCode.
```

### AtividadeOs

Conceitos revisados:

```text
filho de composição;
status interno;
construtor package-private;
alteração controlada pela raiz.
```

### OcorrenciaOs

Conceitos revisados:

```text
histórico interno;
LocalDateTime;
criação controlada pela raiz.
```

### OrdemServico

Conceitos revisados:

```text
entidade;
raiz de agregado;
coleções protegidas;
Tell, Don't Ask;
invariantes;
composição;
associação;
transições de estado;
métodos de domínio.
```

### OrdemServicoBuilder

Conceitos revisados:

```text
Builder;
valores padrão;
construção fluente;
build.
```

### Use cases

Conceitos revisados:

```text
aplicação;
coordenação;
não roubar regra do domínio.
```

### Infraestrutura

Conceitos revisados:

```text
responsabilidade externa;
simulação de persistência;
simulação de notificação;
domínio não depende da infra.
```

---

## Como avaliar se o modelo está bom

Pergunte:

```text
a OS nasce válida?
a OS protege status?
atividade é alterada pela raiz?
ocorrência é criada pela raiz?
listas são protegidas?
status é enum?
período é objeto de valor?
código é objeto de valor?
cliente é associação?
infraestrutura está fora do domínio?
use case coordena sem roubar regra?
```

Se a resposta for sim, o modelo está no caminho certo.

---

## Melhorias possíveis

Esse exercício ainda pode evoluir.

Exemplos:

```text
criar exceções específicas de domínio;
criar repository por interface;
evitar salvar duplicado no repositório de memória;
criar busca por código;
criar update em vez de add no repositório;
criar testes automatizados;
criar DTOs;
criar camada web;
persistir em banco;
usar Spring.
```

Mas essas melhorias pertencem a módulos futuros.

Por enquanto, o objetivo é dominar a base de OO e domínio.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar tudo

Crie todos os arquivos da aula.

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

### Parte 2 — Executar fluxo completo

Execute:

```powershell
java -cp out br.com.curso.aula141.app.RevisaoOoDominioApp
```

Confirme que aparecem:

```text
notificação de criação;
notificação de reagendamento;
notificação de conclusão;
resumo da OS;
atividades;
ocorrências.
```

### Parte 3 — Executar bloqueio

Execute:

```powershell
java -cp out br.com.curso.aula141.app.RevisaoOoDominioBloqueioApp
```

Confirme que aparece:

```text
Conclusão bloqueada: Todas as atividades precisam estar concluídas.
```

### Parte 4 — Explicar o modelo

Explique em voz alta:

```text
por que OrdemServico é a raiz;
por que AtividadeOs é filha;
por que OcorrenciaOs é filha;
por que Cliente é associação;
por que repositório fica fora do domínio;
por que use case não altera status diretamente.
```

### Parte 5 — Alterar e observar

Tente alterar o app para:

```text
concluir OS sem atividade;
concluir OS com uma atividade pendente;
adicionar atividade depois de concluir OS;
reagendar OS concluída;
criar OS com cliente inativo.
```

Observe quais regras bloqueiam.

---

## Desafio prático

Crie uma revisão equivalente usando `Contrato`.

Estrutura sugerida:

```text
src\br\com\curso\aula141\appcontrato
src\br\com\curso\aula141\dominio\contrato
```

Arquivos sugeridos:

```text
appcontrato\RevisaoContratoApp.java
appcontrato\RevisaoContratoBloqueioApp.java

dominio\contrato\Contrato.java
dominio\contrato\ContratoBuilder.java
dominio\contrato\ServicoContrato.java
dominio\contrato\EventoContrato.java
dominio\contrato\StatusContrato.java

aplicacao\AtivarContratoUseCase.java
aplicacao\CancelarContratoUseCase.java

infra\ContratoRepositorioMemoria.java
infra\NotificadorContratoConsole.java
```

Regras:

```text
Contrato é raiz do agregado.
ServicoContrato é filho.
EventoContrato é filho.
Cliente é associação.
Contrato nasce RASCUNHO.
Contrato pode adicionar serviço em RASCUNHO.
Contrato não pode adicionar serviço ATIVO.
Contrato não pode ativar sem serviço.
Contrato registra evento ao criar.
Contrato registra evento ao adicionar serviço.
Contrato registra evento ao ativar.
Contrato registra evento ao cancelar.
Contrato cancelado não pode ativar.
Contrato ativo pode ser cancelado com motivo.
```

Critério principal:

```text
use case coordena, mas Contrato protege as regras.
```

---

## Erros comuns nesta revisão

### 1. Colocar regra no app

O app deve montar cenário, não decidir regra central.

### 2. Use case roubando regra

Use case coordena. A entidade protege.

### 3. Deixar filho público demais

Filhos do agregado devem ser controlados pela raiz.

### 4. Retornar lista mutável

Use `List.copyOf`.

### 5. Usar String para status

Use enum.

### 6. Deixar domínio salvar em repositório

Persistência fica fora.

### 7. Deixar domínio enviar notificação

Notificação fica fora.

### 8. Builder criando objeto inválido

`build()` não pode entregar objeto inválido.

---

## Debug recomendado

Use debug em:

```text
RevisaoOoDominioApp.java
RevisaoOoDominioBloqueioApp.java
```

Breakpoints recomendados:

```java
new OrdemServicoBuilder()
.codigo(...)
.cliente(...)
.periodo(...)
.build()

new OrdemServico(...)

os.adicionarAtividade(...)
new AtividadeOs(...)

os.reagendar(...)
registrarOcorrencia(...)

os.concluirAtividade(...)
atividade.concluir()

os.concluir()
todasAtividadesConcluidas()

CriarOrdemServicoUseCase.executar(...)
ReagendarOrdemServicoUseCase.executar(...)
ConcluirOrdemServicoUseCase.executar(...)

repositorio.salvar(...)
notificador.enviarCriacao(...)
notificador.enviarReagendamento(...)
notificador.enviarConclusao(...)
```

Observe:

```text
quem cria o objeto;
quem valida;
quem muda status;
quem registra ocorrência;
quem salva;
quem notifica;
onde cada responsabilidade ficou.
```

O objetivo é enxergar a arquitetura mental do código.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual classe é a raiz do agregado neste exercício?
2. Quais classes são objetos de valor?
3. Quais responsabilidades ficaram fora do domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar o projeto completo da revisão;
compilar todos os arquivos;
executar o fluxo principal;
executar o fluxo de bloqueio;
explicar cada pacote;
explicar cada classe principal;
identificar entidade, valor, agregado, filho e associação;
explicar por que listas são protegidas;
explicar por que use case não rouba regra;
explicar por que infra fica fora do domínio;
resolver o desafio de Contrato;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-141-revisao-pratica-oo-dominio
git commit -m "Aula 141: revisao pratica OO e dominio"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
um domínio bem modelado junta objetos com responsabilidade clara, protege regras dentro das entidades certas e mantém infraestrutura fora do núcleo de negócio.
```

Você revisou praticamente todo o caminho de OO até aqui:

```text
objeto de valor;
entidade;
encapsulamento;
enum;
composição;
coleções;
agregado;
builder;
aplicação;
infraestrutura.
```

Na próxima aula, vamos iniciar um mini-projeto maior de fechamento do módulo.

Vamos construir um domínio mais completo de Ordem de Serviço no console, com menu simples, operações guiadas e aplicação prática dos conceitos do Módulo 4.
