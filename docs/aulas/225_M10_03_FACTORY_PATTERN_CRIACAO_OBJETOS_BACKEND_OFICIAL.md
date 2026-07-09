# 225 — M10.03 — Factory Pattern: criação de objetos no backend

## Objetivo da aula

Na aula anterior, você estudou:

```text
Strategy Pattern
```

Você viu que Strategy ajuda quando existem comportamentos variáveis, como:

```text
desconto;
prioridade;
validação;
taxa;
notificação;
aprovação.
```

Agora vamos estudar outro padrão muito importante:

```text
Factory Pattern
```

Em português:

```text
Padrão Fábrica
```

Factory é um padrão relacionado à criação de objetos.

No backend, ele aparece quando você precisa:

```text
centralizar criação;
evitar espalhar new pelo sistema;
criar objetos complexos;
escolher implementação correta;
montar entidades com regras;
montar services em Java puro;
montar strategies;
montar adapters;
criar objetos de teste;
proteger construção inválida;
reduzir duplicação de criação.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Factory resolve;
identificar criação espalhada;
criar factory simples;
criar factory de domínio;
criar factory de service;
criar factory de strategy;
criar factory de adapter;
saber quando usar e quando evitar;
entender relação com SRP, OCP e DIP;
preparar base para Builder Pattern;
entender como Spring futuramente substitui parte das factories manuais.
```

---

## Ideia principal

Factory centraliza a criação de objetos.

Em vez de espalhar isso:

```java
new Pedido(
        UUID.randomUUID(),
        codigo,
        cliente,
        valor,
        Instant.now()
)
```

em vários lugares, você pode criar:

```java
PedidoFactory.criarNovo(codigo, cliente, valor);
```

Assim, a regra de criação fica em um ponto.

---

## Factory em uma frase prática

```text
Quando criar um objeto começa a ter regra, repetição ou escolha de implementação, considere uma factory.
```

Factory não é para todo `new`.

Se o objeto é simples e criado uma vez, `new` pode estar perfeito.

Factory ajuda quando a criação começa a ter responsabilidade própria.

---

## Relação com SOLID

## SRP

Factory concentra responsabilidade de criação.

O service não precisa saber todos os detalhes de criação.

---

## OCP

Factory pode ajudar a escolher implementações sem espalhar if pelo sistema.

Mas cuidado: factory com if gigante também pode virar problema.

---

## LSP

Se a factory retorna uma interface, as implementações precisam cumprir o contrato.

---

## ISP

A factory deve criar objetos para contratos claros, não para interfaces gigantes.

---

## DIP

Factory pode ser usada no ponto de composição da aplicação para montar objetos concretos e entregar contratos ao use case.

Exemplo:

```text
App/Factory monta:
RepositoryMemoria
NotificadorConsole
AuditoriaConsole
UseCase

UseCase depende de:
Repository
Notificador
Auditoria
```

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Factory:

```text
Factory cria objetos.
Entidade decide regra.
Use case coordena fluxo.
Repository salva.
Client integra.
Controller recebe.
```

Factory não deve virar lugar de regra de negócio do fluxo.

Ela cria.

---

# Parte 1 — Problema: criação espalhada

Imagine que você precisa criar uma OS em vários pontos.

Código repetido:

```java
OrdemServico os = new OrdemServico(
        UUID.randomUUID(),
        "OS-" + LocalDate.now().getYear() + "-000001",
        cliente.trim(),
        telefone.trim(),
        descricao.trim(),
        TipoOrdemServico.valueOf(tipo.trim().toUpperCase()),
        Instant.now()
);
```

Problemas:

```text
duplicação;
risco de criar diferente em cada lugar;
geração de ID repetida;
normalização repetida;
data repetida;
conversão de tipo repetida;
código difícil de alterar.
```

Se a regra de criação mudar, você precisa alterar vários lugares.

Factory resolve isso centralizando criação.

---

## Quando o new está ok

Nem todo `new` é problema.

Exemplo aceitável:

```java
Pedido pedido = new Pedido(...);
```

em um app pequeno ou em um teste simples.

O problema começa quando:

```text
a criação é repetida;
a criação tem regra;
a criação escolhe implementação;
a criação precisa de default;
a criação precisa garantir consistência;
a criação tem muitos parâmetros;
vários lugares criam de formas diferentes.
```

---

# Parte 2 — Tipos de Factory que veremos

Nesta aula, vamos trabalhar com quatro usos práticos:

```text
1. Factory de domínio.
2. Factory de strategy.
3. Factory de service/use case.
4. Factory de adapter/infraestrutura.
```

Também vamos deixar preparado o próximo assunto:

```text
Builder Pattern.
```

---

## Factory de domínio

Cria entidade ou objeto de domínio com regras de criação.

Exemplo:

```text
OrdemServicoFactory
PedidoFactory
ClienteFactory
ContratoFactory
```

---

## Factory de strategy

Monta lista de estratégias.

Exemplo:

```text
PoliticasPrioridadeFactory
PoliticasDescontoFactory
ValidadoresPedidoFactory
```

---

## Factory de service/use case

Monta caso de uso com dependências.

Em Java puro, isso é útil antes de Spring.

Exemplo:

```text
AbrirOrdemServicoUseCaseFactory
ProcessarPagamentoUseCaseFactory
```

---

## Factory de adapter

Escolhe implementação concreta de integração.

Exemplo:

```text
NotificadorFactory
PagamentoGatewayFactory
RepositoryFactory
```

---

# Parte 3 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-225-factory-pattern-criacao-objetos-backend
cd labs\m10\aula-225-factory-pattern-criacao-objetos-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula225

mkdir src\br\com\curso\aula225\app

mkdir src\br\com\curso\aula225\dominio
mkdir src\br\com\curso\aula225\dominio\os
mkdir src\br\com\curso\aula225\dominio\pedido

mkdir src\br\com\curso\aula225\factory
mkdir src\br\com\curso\aula225\factory\dominio
mkdir src\br\com\curso\aula225\factory\strategy
mkdir src\br\com\curso\aula225\factory\usecase

mkdir src\br\com\curso\aula225\aplicacao
mkdir src\br\com\curso\aula225\aplicacao\dto
mkdir src\br\com\curso\aula225\aplicacao\port
mkdir src\br\com\curso\aula225\aplicacao\prioridade
mkdir src\br\com\curso\aula225\aplicacao\usecase

mkdir src\br\com\curso\aula225\infra
mkdir src\br\com\curso\aula225\infra\auditoria
mkdir src\br\com\curso\aula225\infra\codigo
mkdir src\br\com\curso\aula225\infra\notificacao
mkdir src\br\com\curso\aula225\infra\repository
```

---

# Parte 4 — Factory de domínio

## TipoOrdemServico

Crie:

```text
src\br\com\curso\aula225\dominio\os\TipoOrdemServico.java
```

Código:

```java
package br.com.curso.aula225.dominio.os;

public enum TipoOrdemServico {
    NORMAL,
    CRITICA,
    REAGENDAMENTO,
    SEM_CAPACITY
}
```

---

## StatusOrdemServico

Crie:

```text
src\br\com\curso\aula225\dominio\os\StatusOrdemServico.java
```

Código:

```java
package br.com.curso.aula225.dominio.os;

public enum StatusOrdemServico {
    ABERTA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula225\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula225.dominio.os;

import java.time.Instant;
import java.util.StringJoiner;
import java.util.UUID;

public class OrdemServico {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String descricao;
    private final TipoOrdemServico tipo;
    private final Instant criadaEm;
    private StatusOrdemServico status;
    private int prioridade;

    public OrdemServico(
            UUID id,
            String codigo,
            String cliente,
            String telefone,
            String descricao,
            TipoOrdemServico tipo,
            Instant criadaEm
    ) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (criadaEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.descricao = descricao.trim();
        this.tipo = tipo;
        this.criadaEm = criadaEm;
        this.status = StatusOrdemServico.ABERTA;
        this.prioridade = 0;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String descricao() {
        return descricao;
    }

    public TipoOrdemServico tipo() {
        return tipo;
    }

    public Instant criadaEm() {
        return criadaEm;
    }

    public StatusOrdemServico status() {
        return status;
    }

    public int prioridade() {
        return prioridade;
    }

    public void definirPrioridade(int prioridade) {
        if (prioridade <= 0) {
            throw new IllegalArgumentException("Prioridade deve ser maior que zero.");
        }

        this.prioridade = prioridade;
    }

    public void iniciarAtendimento() {
        if (status != StatusOrdemServico.ABERTA) {
            throw new IllegalStateException("Somente OS aberta pode iniciar atendimento.");
        }

        status = StatusOrdemServico.EM_ATENDIMENTO;
    }

    public void concluir() {
        if (status != StatusOrdemServico.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída.");
        }

        status = StatusOrdemServico.CONCLUIDA;
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(codigo)
                .add("Cliente: " + cliente)
                .add("Telefone: " + telefone)
                .add("Tipo: " + tipo)
                .add("Status: " + status)
                .add("Prioridade: " + prioridade)
                .add("Criada em: " + criadaEm)
                .toString();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoFactory

Crie:

```text
src\br\com\curso\aula225\factory\dominio\OrdemServicoFactory.java
```

Código:

```java
package br.com.curso.aula225.factory.dominio;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.dominio.os.TipoOrdemServico;

import java.time.Instant;
import java.util.UUID;

public final class OrdemServicoFactory {
    private OrdemServicoFactory() {
    }

    public static OrdemServico criarNova(
            String codigo,
            String cliente,
            String telefone,
            String descricao,
            String tipo,
            Instant criadaEm
    ) {
        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        TipoOrdemServico tipoConvertido = converterTipo(tipo);

        return new OrdemServico(
                UUID.randomUUID(),
                codigo,
                cliente,
                telefone,
                descricao,
                tipoConvertido,
                criadaEm
        );
    }

    public static OrdemServico criarNova(
            String codigo,
            String cliente,
            String telefone,
            String descricao,
            TipoOrdemServico tipo,
            Instant criadaEm
    ) {
        return new OrdemServico(
                UUID.randomUUID(),
                codigo,
                cliente,
                telefone,
                descricao,
                tipo,
                criadaEm
        );
    }

    private static TipoOrdemServico converterTipo(String valor) {
        try {
            return TipoOrdemServico.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException erro) {
            throw new IllegalArgumentException("Tipo de OS inválido: " + valor, erro);
        }
    }
}
```

---

## OrdemServicoFactoryApp

Crie:

```text
src\br\com\curso\aula225\app\OrdemServicoFactoryApp.java
```

Código:

```java
package br.com.curso.aula225.app;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.factory.dominio.OrdemServicoFactory;

import java.time.Instant;

public class OrdemServicoFactoryApp {
    public static void main(String[] args) {
        OrdemServico os = OrdemServicoFactory.criarNova(
                "OS-2026-000001",
                "Ana Silva",
                "11999999999",
                "Produto entregue com avaria",
                "CRITICA",
                Instant.now()
        );

        System.out.println(os.resumo());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula225.app.OrdemServicoFactoryApp
```

---

## O que a factory resolveu

A factory concentrou:

```text
geração de UUID;
conversão de tipo;
criação padronizada da OS.
```

O restante do sistema não precisa repetir isso.

---

# Parte 5 — Factory de Strategy

Agora vamos montar políticas de prioridade com uma factory.

---

## PoliticaPrioridadeOs

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\PoliticaPrioridadeOs.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;

public interface PoliticaPrioridadeOs {
    boolean aplica(OrdemServico ordemServico);

    int calcular(OrdemServico ordemServico);

    String nome();
}
```

---

## PrioridadeNormal

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\PrioridadeNormal.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.dominio.os.TipoOrdemServico;

public class PrioridadeNormal implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.NORMAL;
    }

    @Override
    public int calcular(OrdemServico ordemServico) {
        return 10;
    }

    @Override
    public String nome() {
        return "Prioridade normal";
    }
}
```

---

## PrioridadeCritica

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\PrioridadeCritica.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.dominio.os.TipoOrdemServico;

public class PrioridadeCritica implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.CRITICA;
    }

    @Override
    public int calcular(OrdemServico ordemServico) {
        return 100;
    }

    @Override
    public String nome() {
        return "Prioridade crítica";
    }
}
```

---

## PrioridadeReagendamento

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\PrioridadeReagendamento.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.dominio.os.TipoOrdemServico;

public class PrioridadeReagendamento implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.REAGENDAMENTO;
    }

    @Override
    public int calcular(OrdemServico ordemServico) {
        return 50;
    }

    @Override
    public String nome() {
        return "Prioridade reagendamento";
    }
}
```

---

## PrioridadeSemCapacity

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\PrioridadeSemCapacity.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.dominio.os.TipoOrdemServico;

public class PrioridadeSemCapacity implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.SEM_CAPACITY;
    }

    @Override
    public int calcular(OrdemServico ordemServico) {
        return 70;
    }

    @Override
    public String nome() {
        return "Prioridade sem capacity";
    }
}
```

---

## CalculadoraPrioridadeOs

Crie:

```text
src\br\com\curso\aula225\aplicacao\prioridade\CalculadoraPrioridadeOs.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.prioridade;

import br.com.curso.aula225.dominio.os.OrdemServico;

import java.util.List;

public class CalculadoraPrioridadeOs {
    private final List<PoliticaPrioridadeOs> politicas;

    public CalculadoraPrioridadeOs(List<PoliticaPrioridadeOs> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public int calcular(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        PoliticaPrioridadeOs politica = politicas.stream()
                .filter(item -> item.aplica(ordemServico))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma política encontrada para: " + ordemServico.tipo()));

        int prioridade = politica.calcular(ordemServico);

        if (prioridade <= 0) {
            throw new IllegalStateException("Prioridade inválida retornada por: " + politica.nome());
        }

        return prioridade;
    }
}
```

---

## PoliticasPrioridadeOsFactory

Crie:

```text
src\br\com\curso\aula225\factory\strategy\PoliticasPrioridadeOsFactory.java
```

Código:

```java
package br.com.curso.aula225.factory.strategy;

import br.com.curso.aula225.aplicacao.prioridade.PoliticaPrioridadeOs;
import br.com.curso.aula225.aplicacao.prioridade.PrioridadeCritica;
import br.com.curso.aula225.aplicacao.prioridade.PrioridadeNormal;
import br.com.curso.aula225.aplicacao.prioridade.PrioridadeReagendamento;
import br.com.curso.aula225.aplicacao.prioridade.PrioridadeSemCapacity;

import java.util.List;

public final class PoliticasPrioridadeOsFactory {
    private PoliticasPrioridadeOsFactory() {
    }

    public static List<PoliticaPrioridadeOs> criarPadrao() {
        return List.of(
                new PrioridadeNormal(),
                new PrioridadeCritica(),
                new PrioridadeReagendamento(),
                new PrioridadeSemCapacity()
        );
    }
}
```

---

## CalculadoraPrioridadeFactory

Crie:

```text
src\br\com\curso\aula225\factory\strategy\CalculadoraPrioridadeFactory.java
```

Código:

```java
package br.com.curso.aula225.factory.strategy;

import br.com.curso.aula225.aplicacao.prioridade.CalculadoraPrioridadeOs;

public final class CalculadoraPrioridadeFactory {
    private CalculadoraPrioridadeFactory() {
    }

    public static CalculadoraPrioridadeOs criarPadrao() {
        return new CalculadoraPrioridadeOs(
                PoliticasPrioridadeOsFactory.criarPadrao()
        );
    }
}
```

---

## PrioridadeFactoryApp

Crie:

```text
src\br\com\curso\aula225\app\PrioridadeFactoryApp.java
```

Código:

```java
package br.com.curso.aula225.app;

import br.com.curso.aula225.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.factory.dominio.OrdemServicoFactory;
import br.com.curso.aula225.factory.strategy.CalculadoraPrioridadeFactory;

import java.time.Instant;

public class PrioridadeFactoryApp {
    public static void main(String[] args) {
        OrdemServico os = OrdemServicoFactory.criarNova(
                "OS-2026-000002",
                "Carlos Souza",
                "11888888888",
                "Cliente solicitou reagendamento",
                "REAGENDAMENTO",
                Instant.now()
        );

        CalculadoraPrioridadeOs calculadora = CalculadoraPrioridadeFactory.criarPadrao();

        os.definirPrioridade(calculadora.calcular(os));

        System.out.println(os.resumo());
    }
}
```

---

## O que a factory resolveu aqui

Antes, todo app precisava saber quais políticas montar.

Agora:

```java
CalculadoraPrioridadeFactory.criarPadrao()
```

centraliza essa composição.

Isso é útil em Java puro.

Futuramente, com Spring, a lista pode ser injetada automaticamente.

---

# Parte 6 — Ports da aplicação

Vamos montar um use case completo usando factories.

## AbrirOrdemServicoRequest

Crie:

```text
src\br\com\curso\aula225\aplicacao\dto\AbrirOrdemServicoRequest.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.dto;

public record AbrirOrdemServicoRequest(
        String cliente,
        String telefone,
        String descricao,
        String tipo
) {
}
```

---

## AbrirOrdemServicoResponse

Crie:

```text
src\br\com\curso\aula225\aplicacao\dto\AbrirOrdemServicoResponse.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.dto;

public record AbrirOrdemServicoResponse(
        String codigo,
        String cliente,
        String status,
        String tipo,
        int prioridade,
        String mensagem
) {
}
```

---

## OrdemServicoRepository

Crie:

```text
src\br\com\curso\aula225\aplicacao\port\OrdemServicoRepository.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.port;

import br.com.curso.aula225.dominio.os.OrdemServico;

import java.util.List;
import java.util.Optional;

public interface OrdemServicoRepository {
    void salvar(OrdemServico ordemServico);

    Optional<OrdemServico> buscarPorCodigo(String codigo);

    List<OrdemServico> listarTodas();
}
```

---

## ClienteNotificador

Crie:

```text
src\br\com\curso\aula225\aplicacao\port\ClienteNotificador.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.port;

import br.com.curso.aula225.dominio.os.OrdemServico;

public interface ClienteNotificador {
    void notificarAbertura(OrdemServico ordemServico);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula225\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## GeradorCodigoOs

Crie:

```text
src\br\com\curso\aula225\aplicacao\port\GeradorCodigoOs.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.port;

public interface GeradorCodigoOs {
    String gerar();
}
```

---

# Parte 7 — Infraestrutura

## OrdemServicoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula225\infra\repository\OrdemServicoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula225.infra.repository;

import br.com.curso.aula225.aplicacao.port.OrdemServicoRepository;
import br.com.curso.aula225.dominio.os.OrdemServico;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class OrdemServicoRepositoryMemoria implements OrdemServicoRepository {
    private final List<OrdemServico> ordens = new ArrayList<>();

    @Override
    public void salvar(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        ordens.removeIf(item -> item.codigo().equals(ordemServico.codigo()));
        ordens.add(ordemServico);

        System.out.println("[REPOSITORY MEMORIA] OS salva: " + ordemServico.codigo());
    }

    @Override
    public Optional<OrdemServico> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return ordens.stream()
                .filter(os -> os.codigo().equals(normalizado))
                .findFirst();
    }

    @Override
    public List<OrdemServico> listarTodas() {
        return List.copyOf(ordens);
    }
}
```

---

## WhatsAppClienteNotificador

Crie:

```text
src\br\com\curso\aula225\infra\notificacao\WhatsAppClienteNotificador.java
```

Código:

```java
package br.com.curso.aula225.infra.notificacao;

import br.com.curso.aula225.aplicacao.port.ClienteNotificador;
import br.com.curso.aula225.dominio.os.OrdemServico;

public class WhatsAppClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[WHATSAPP] " + ordemServico.telefone()
                + " | OS aberta: " + ordemServico.codigo()
                + " | Prioridade: " + ordemServico.prioridade());
    }
}
```

---

## EmailClienteNotificador

Crie:

```text
src\br\com\curso\aula225\infra\notificacao\EmailClienteNotificador.java
```

Código:

```java
package br.com.curso.aula225.infra.notificacao;

import br.com.curso.aula225.aplicacao.port.ClienteNotificador;
import br.com.curso.aula225.dominio.os.OrdemServico;

public class EmailClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[EMAIL] Cliente: " + ordemServico.cliente()
                + " | OS aberta: " + ordemServico.codigo());
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula225\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula225.infra.auditoria;

import br.com.curso.aula225.aplicacao.port.AuditoriaGateway;

import java.time.Instant;

public class AuditoriaConsoleGateway implements AuditoriaGateway {
    @Override
    public void registrar(String evento, String detalhes, Instant ocorridoEm) {
        if (evento == null || evento.isBlank()) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        if (detalhes == null || detalhes.isBlank()) {
            throw new IllegalArgumentException("Detalhes são obrigatórios.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data/hora é obrigatória.");
        }

        System.out.println("[AUDITORIA] " + evento + " | " + detalhes + " | " + ocorridoEm);
    }
}
```

---

## GeradorCodigoOsSequencial

Crie:

```text
src\br\com\curso\aula225\infra\codigo\GeradorCodigoOsSequencial.java
```

Código:

```java
package br.com.curso.aula225.infra.codigo;

import br.com.curso.aula225.aplicacao.port.GeradorCodigoOs;

import java.time.LocalDate;

public class GeradorCodigoOsSequencial implements GeradorCodigoOs {
    private int sequencia = 0;

    @Override
    public String gerar() {
        sequencia++;

        return "OS-" + LocalDate.now().getYear() + "-" + "%06d".formatted(sequencia);
    }
}
```

---

# Parte 8 — Use case

## AbrirOrdemServicoUseCase

Crie:

```text
src\br\com\curso\aula225\aplicacao\usecase\AbrirOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula225.aplicacao.usecase;

import br.com.curso.aula225.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula225.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula225.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula225.aplicacao.port.ClienteNotificador;
import br.com.curso.aula225.aplicacao.port.GeradorCodigoOs;
import br.com.curso.aula225.aplicacao.port.OrdemServicoRepository;
import br.com.curso.aula225.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula225.dominio.os.OrdemServico;
import br.com.curso.aula225.factory.dominio.OrdemServicoFactory;

import java.time.Instant;

public class AbrirOrdemServicoUseCase {
    private final OrdemServicoRepository repository;
    private final ClienteNotificador notificador;
    private final AuditoriaGateway auditoriaGateway;
    private final GeradorCodigoOs geradorCodigoOs;
    private final CalculadoraPrioridadeOs calculadoraPrioridade;

    public AbrirOrdemServicoUseCase(
            OrdemServicoRepository repository,
            ClienteNotificador notificador,
            AuditoriaGateway auditoriaGateway,
            GeradorCodigoOs geradorCodigoOs,
            CalculadoraPrioridadeOs calculadoraPrioridade
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoriaGateway == null) {
            throw new IllegalArgumentException("AuditoriaGateway é obrigatório.");
        }

        if (geradorCodigoOs == null) {
            throw new IllegalArgumentException("Gerador de código é obrigatório.");
        }

        if (calculadoraPrioridade == null) {
            throw new IllegalArgumentException("Calculadora de prioridade é obrigatória.");
        }

        this.repository = repository;
        this.notificador = notificador;
        this.auditoriaGateway = auditoriaGateway;
        this.geradorCodigoOs = geradorCodigoOs;
        this.calculadoraPrioridade = calculadoraPrioridade;
    }

    public AbrirOrdemServicoResponse executar(AbrirOrdemServicoRequest request, Instant agora) {
        validarRequest(request);

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        OrdemServico os = OrdemServicoFactory.criarNova(
                geradorCodigoOs.gerar(),
                request.cliente(),
                request.telefone(),
                request.descricao(),
                request.tipo(),
                agora
        );

        os.definirPrioridade(calculadoraPrioridade.calcular(os));

        repository.salvar(os);

        auditoriaGateway.registrar(
                "OS_ABERTA",
                "OS aberta: " + os.codigo() + " | Prioridade: " + os.prioridade(),
                agora
        );

        notificador.notificarAbertura(os);

        return new AbrirOrdemServicoResponse(
                os.codigo(),
                os.cliente(),
                os.status().name(),
                os.tipo().name(),
                os.prioridade(),
                "Ordem de serviço aberta com sucesso."
        );
    }

    private void validarRequest(AbrirOrdemServicoRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request é obrigatório.");
        }

        if (request.cliente() == null || request.cliente().isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (request.telefone() == null || request.telefone().isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (request.descricao() == null || request.descricao().isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (request.tipo() == null || request.tipo().isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }
    }
}
```

---

## Observação

O use case usou uma factory de domínio:

```java
OrdemServicoFactory.criarNova(...)
```

Isso deixa a criação da entidade padronizada.

Mas o use case ainda coordena o fluxo.

A factory não executa o caso de uso.

---

# Parte 9 — Factory de use case

Em Java puro, precisamos montar dependências manualmente.

Vamos centralizar isso.

---

## AbrirOrdemServicoUseCaseFactory

Crie:

```text
src\br\com\curso\aula225\factory\usecase\AbrirOrdemServicoUseCaseFactory.java
```

Código:

```java
package br.com.curso.aula225.factory.usecase;

import br.com.curso.aula225.aplicacao.usecase.AbrirOrdemServicoUseCase;
import br.com.curso.aula225.factory.strategy.CalculadoraPrioridadeFactory;
import br.com.curso.aula225.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula225.infra.codigo.GeradorCodigoOsSequencial;
import br.com.curso.aula225.infra.notificacao.EmailClienteNotificador;
import br.com.curso.aula225.infra.notificacao.WhatsAppClienteNotificador;
import br.com.curso.aula225.infra.repository.OrdemServicoRepositoryMemoria;

public final class AbrirOrdemServicoUseCaseFactory {
    private AbrirOrdemServicoUseCaseFactory() {
    }

    public static AbrirOrdemServicoUseCase criarComWhatsApp() {
        return new AbrirOrdemServicoUseCase(
                new OrdemServicoRepositoryMemoria(),
                new WhatsAppClienteNotificador(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoOsSequencial(),
                CalculadoraPrioridadeFactory.criarPadrao()
        );
    }

    public static AbrirOrdemServicoUseCase criarComEmail() {
        return new AbrirOrdemServicoUseCase(
                new OrdemServicoRepositoryMemoria(),
                new EmailClienteNotificador(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoOsSequencial(),
                CalculadoraPrioridadeFactory.criarPadrao()
        );
    }
}
```

---

## AbrirOrdemServicoFactoryApp

Crie:

```text
src\br\com\curso\aula225\app\AbrirOrdemServicoFactoryApp.java
```

Código:

```java
package br.com.curso.aula225.app;

import br.com.curso.aula225.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula225.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula225.aplicacao.usecase.AbrirOrdemServicoUseCase;
import br.com.curso.aula225.factory.usecase.AbrirOrdemServicoUseCaseFactory;

import java.time.Instant;

public class AbrirOrdemServicoFactoryApp {
    public static void main(String[] args) {
        AbrirOrdemServicoUseCase useCase = AbrirOrdemServicoUseCaseFactory.criarComWhatsApp();

        AbrirOrdemServicoRequest request = new AbrirOrdemServicoRequest(
                "Ana Silva",
                "11999999999",
                "Produto entregue com avaria",
                "CRITICA"
        );

        AbrirOrdemServicoResponse response = useCase.executar(request, Instant.now());

        System.out.println();
        System.out.println(response);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula225.app.AbrirOrdemServicoFactoryApp
```

---

## O que a factory de use case resolveu

Antes, o App precisava conhecer todas as dependências.

Agora:

```java
AbrirOrdemServicoUseCaseFactory.criarComWhatsApp()
```

centraliza a montagem.

Isso é útil em Java puro.

Quando estudarmos Spring, essa factory manual será substituída em grande parte por configuração e injeção de dependência.

---

# Parte 10 — Factory com escolha por parâmetro

Às vezes, a factory escolhe implementação por configuração.

Exemplo:

```text
canalNotificacao = WHATSAPP
canalNotificacao = EMAIL
```

---

## CanalNotificacaoFactory

Crie:

```text
src\br\com\curso\aula225\factory\usecase\CanalNotificacaoFactory.java
```

Código:

```java
package br.com.curso.aula225.factory.usecase;

import br.com.curso.aula225.aplicacao.port.ClienteNotificador;
import br.com.curso.aula225.infra.notificacao.EmailClienteNotificador;
import br.com.curso.aula225.infra.notificacao.WhatsAppClienteNotificador;

public final class CanalNotificacaoFactory {
    private CanalNotificacaoFactory() {
    }

    public static ClienteNotificador criar(String canal) {
        if (canal == null || canal.isBlank()) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        String normalizado = canal.trim().toUpperCase();

        return switch (normalizado) {
            case "WHATSAPP" -> new WhatsAppClienteNotificador();
            case "EMAIL" -> new EmailClienteNotificador();
            default -> throw new IllegalArgumentException("Canal não suportado: " + canal);
        };
    }
}
```

---

## Observação sobre switch em factory

Aqui o `switch` está centralizado no ponto de criação.

Isso pode ser aceitável.

Mas se os canais crescerem muito, podemos combinar com Strategy, configuração ou injeção automática no Spring.

Factory com switch pequeno pode ser melhor do que switch espalhado em vários services.

---

# Parte 11 — Factory vs Constructor

## Constructor

Use construtor quando:

```text
criação é simples;
não há regra de escolha;
não há repetição relevante;
os parâmetros são claros.
```

---

## Static Factory Method

Use método estático de fábrica quando:

```text
quer nomear intenção de criação;
quer aplicar default;
quer converter tipo;
quer esconder detalhes;
quer ter mais de uma forma de criar.
```

Exemplo:

```java
OrdemServicoFactory.criarNova(...)
```

---

## Factory class

Use classe factory quando:

```text
criação envolve várias classes;
montagem de dependências;
escolha de implementação;
composição de strategies;
ambientes diferentes;
teste vs produção.
```

Exemplo:

```java
AbrirOrdemServicoUseCaseFactory.criarComWhatsApp()
```

---

# Parte 12 — Factory vs Builder

Factory cria.

Builder monta passo a passo.

Factory é boa para:

```text
criação com decisão;
criação com default;
criação de implementação;
criação centralizada.
```

Builder é bom para:

```text
objeto com muitos campos;
muitos campos opcionais;
criação fluente;
testes;
requests complexas;
evitar construtor gigante.
```

Exemplo de alerta:

```java
new Pedido(a, b, c, d, e, f, g, h, i, j)
```

Pode pedir Builder.

A próxima aula vai aprofundar isso.

---

# Parte 13 — Factory e Spring

Em Java puro:

```java
AbrirOrdemServicoUseCaseFactory.criarComWhatsApp()
```

No Spring futuramente:

```java
@Service
public class AbrirOrdemServicoUseCase {
    public AbrirOrdemServicoUseCase(
            OrdemServicoRepository repository,
            ClienteNotificador notificador,
            AuditoriaGateway auditoriaGateway,
            GeradorCodigoOs geradorCodigoOs,
            CalculadoraPrioridadeOs calculadoraPrioridade
    ) {
    }
}
```

O Spring monta as dependências.

Mas a ideia continua:

```text
não espalhar new;
montar dependências em um ponto controlado;
use case depende de contratos.
```

---

## Spring não elimina toda factory

Mesmo com Spring, factories ainda podem ser úteis para:

```text
criação de objetos de domínio;
criação de comandos;
criação de value objects;
criação de objetos de teste;
escolha dinâmica de implementação;
montagem de objetos complexos.
```

---

# Parte 14 — Erros comuns com Factory

## 1. Factory fazendo regra de negócio do fluxo

Ruim:

```text
Factory abre OS, salva, audita e notifica.
```

Isso não é factory.

Isso é use case disfarçado.

---

## 2. Factory gigante

Ruim:

```text
SistemaFactory
```

com tudo dentro.

Isso viola SRP.

---

## 3. Factory para todo new

Não precisa criar factory para tudo.

---

## 4. Factory retornando tipo concreto quando poderia retornar contrato

Menos flexível:

```java
public static WhatsAppClienteNotificador criar()
```

Mais flexível:

```java
public static ClienteNotificador criar()
```

Depende do caso.

---

## 5. Factory escondendo erro

Ruim:

```java
return null;
```

Melhor:

```java
throw new IllegalArgumentException("Tipo não suportado");
```

---

# Parte 15 — Checklist para usar Factory

Pergunte:

```text
1. A criação está repetida?
2. A criação tem regra?
3. A criação escolhe implementação?
4. A criação exige defaults?
5. A criação precisa de nome mais expressivo?
6. O construtor está grande demais?
7. Estou escondendo complexidade útil?
8. A factory tem responsabilidade clara?
9. A factory está virando use case?
10. Isso será substituído por Spring depois?
```

---

# Parte 16 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula225.app.OrdemServicoFactoryApp
java -cp out br.com.curso.aula225.app.PrioridadeFactoryApp
java -cp out br.com.curso.aula225.app.AbrirOrdemServicoFactoryApp
```

Depois responda:

```text
1. O que OrdemServicoFactory centralizou?
2. O que PoliticasPrioridadeOsFactory centralizou?
3. O que CalculadoraPrioridadeFactory centralizou?
4. O que AbrirOrdemServicoUseCaseFactory centralizou?
5. Qual diferença entre factory de domínio e factory de use case?
6. Onde Factory ajudou DIP?
7. Onde Factory ajudou SRP?
8. Quando CanalNotificacaoFactory com switch é aceitável?
9. Quando uma factory pode virar problema?
10. Como Spring mudará parte dessa montagem?
```

---

# Parte 17 — Exercício prático principal

## Contexto

Crie uma factory para um fluxo de pagamento.

---

## Domínio

Crie:

```text
PagamentoRequest
```

Campos:

```text
String codigoPedido;
BigDecimal valor;
String tipoPagamento;
```

Crie:

```text
PagamentoResultado
```

Campos:

```text
boolean aprovado;
String mensagem;
String codigoAutorizacao;
```

---

## Gateway

Crie interface:

```java
public interface PagamentoGateway {
    PagamentoResultado pagar(PagamentoRequest request);
}
```

Implementações:

```text
PixPagamentoGateway;
CartaoPagamentoGateway;
BoletoPagamentoGateway.
```

---

## Factory

Crie:

```text
PagamentoGatewayFactory
```

Método:

```java
PagamentoGateway criar(String tipoPagamento)
```

Regras:

```text
PIX -> PixPagamentoGateway
CARTAO -> CartaoPagamentoGateway
BOLETO -> BoletoPagamentoGateway
```

Tipo inválido:

```text
lançar IllegalArgumentException.
```

---

## Use case

Crie:

```text
ProcessarPagamentoUseCase
```

Pode receber:

```text
PagamentoGatewayFactory
```

ou receber diretamente um gateway escolhido no App.

Faça as duas versões e compare.

---

## Perguntas

```text
1. A factory centralizou o quê?
2. O use case ficou mais simples?
3. O switch ficou espalhado ou centralizado?
4. Quando essa factory seria substituída por configuração/Spring?
5. Quando seria melhor usar Strategy em vez de Factory?
```

---

# Parte 18 — Desafio extra

## Factory para dados de teste

Crie:

```text
PedidoTesteFactory
```

Métodos:

```java
pedidoVip();
pedidoComum();
pedidoPremium();
pedidoComValor(String valor);
pedidoComTipo(String tipo);
```

Objetivo:

```text
facilitar criação de objetos nos apps de teste e futuramente nos testes unitários.
```

Isso prepara o conceito de:

```text
Test Data Builder.
```

que aparecerá mais para frente.

---

# Parte 19 — Simulado rápido

## Questão 1

Factory é usada principalmente para:

```text
A) centralizar criação de objetos.
B) substituir todo if de null.
C) salvar dados no banco obrigatoriamente.
D) formatar data sempre.
```

---

## Questão 2

Factory é útil quando:

```text
A) criação tem regra, repetição ou escolha de implementação.
B) todo objeto simples precisa de factory.
C) queremos colocar regra de negócio do fluxo dentro dela.
D) queremos evitar entidades.
```

---

## Questão 3

Uma factory que abre OS, salva, audita e notifica provavelmente virou:

```text
A) use case disfarçado.
B) enum.
C) DTO.
D) record.
```

---

## Questão 4

Factory de domínio pode ajudar a:

```text
A) padronizar criação de entidade.
B) receber HTTP diretamente.
C) executar query SQL diretamente.
D) substituir controller.
```

---

## Questão 5

Factory de use case em Java puro pode ajudar a:

```text
A) montar dependências manualmente em um ponto.
B) criar campos private automaticamente.
C) impedir uso de interfaces.
D) remover o domínio.
```

---

## Questão 6

Com Spring, parte das factories manuais de composição pode ser substituída por:

```text
A) injeção de dependência.
B) comentários.
C) System.out.println.
D) switch obrigatório.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 20 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Factory Pattern.
[ ] Sei identificar criação espalhada.
[ ] Sei criar factory de domínio.
[ ] Sei criar factory de strategies.
[ ] Sei criar factory de use case.
[ ] Sei criar factory com escolha de implementação.
[ ] Sei diferenciar Factory de Strategy.
[ ] Sei diferenciar Factory de Builder.
[ ] Sei evitar factory desnecessária.
[ ] Sei evitar factory virando use case.
[ ] Sei explicar relação com DIP.
[ ] Sei explicar relação com Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Factory Pattern?
2. Qual problema ele resolve?
3. Quando usar factory?
4. Quando não usar?
5. Qual diferença entre factory de domínio e factory de use case?
6. Como factory ajuda em Java puro?
7. Como Spring muda esse cenário?
8. Por que factory não deve salvar e notificar?
9. Como factory se relaciona com DIP?
10. Qual diferença entre Factory e Builder?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
centralizar criação de entidade;
centralizar composição de strategies;
centralizar montagem de use case;
criar factory com escolha por parâmetro;
evitar criação espalhada;
evitar factory gigante;
explicar relação com SOLID;
resolver exercício de pagamento;
preparar-se para Builder Pattern.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-225-factory-pattern-criacao-objetos-backend
git commit -m "Aula 225: factory pattern criacao objetos backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Factory centraliza criação quando a criação tem regra, repetição ou escolha de implementação.
```

Você estudou:

```text
Factory Pattern;
factory de domínio;
factory de strategy;
factory de use case;
factory de adapter;
criação centralizada;
composição manual;
relação com SOLID;
relação com Spring;
diferença entre Factory, Strategy e Builder.
```

Na próxima aula, vamos estudar:

```text
Builder Pattern.
```

A ideia será resolver o problema de objetos com muitos campos, muitos opcionais e construtores difíceis de ler.
