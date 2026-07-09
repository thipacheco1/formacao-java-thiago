# 221 — M9.07 — SOLID aplicado em um fluxo completo de backend

## Objetivo da aula

Na aula anterior, você fechou os cinco princípios do SOLID individualmente:

```text
SRP — Single Responsibility Principle;
OCP — Open/Closed Principle;
LSP — Liskov Substitution Principle;
ISP — Interface Segregation Principle;
DIP — Dependency Inversion Principle.
```

Agora vamos juntar tudo em um fluxo completo de backend.

A ideia desta aula é sair da teoria isolada e montar um caso de uso realista usando:

```text
entidade;
DTO;
use case;
ports;
adapters;
repository;
gateway;
notificação;
auditoria;
validação;
política de prioridade;
response;
app;
injeção manual de dependências.
```

O objetivo não é usar Spring ainda.

O objetivo é entender a arquitetura por trás.

Quando o Spring chegar, você não vai apenas decorar anotação.

Você vai entender o motivo de cada camada existir.

Ao final desta aula, você deve conseguir:

```text
aplicar SRP em um fluxo completo;
aplicar OCP com políticas extensíveis;
aplicar LSP garantindo contratos confiáveis;
aplicar ISP com interfaces pequenas;
aplicar DIP com ports e adapters;
montar um use case que coordena sem fazer tudo;
separar domínio, aplicação e infraestrutura;
criar repository como porta;
criar notificador como porta;
criar auditoria como porta;
criar gateway como porta;
usar DTO de entrada e saída;
montar dependências manualmente;
entender como isso vai virar Spring depois;
visualizar como o front vai consumir esse fluxo futuramente.
```

---

## Cenário da aula

Vamos modelar um fluxo de backend chamado:

```text
Abertura de Ordem de Serviço
```

O sistema deve receber uma solicitação de abertura de OS e executar o fluxo:

```text
1. Receber dados da solicitação.
2. Validar entrada.
3. Criar entidade OrdemServico.
4. Definir prioridade usando políticas.
5. Salvar OS.
6. Registrar auditoria.
7. Notificar cliente.
8. Retornar response.
```

Esse fluxo parece simples, mas nele cabem todos os princípios SOLID.

---

## Visão futura com front-end

Mesmo sem criar front-end agora, pense no fluxo completo:

```text
Tela:
usuário preenche formulário de abertura de OS.

Front:
envia JSON para o backend.

Backend:
recebe request;
valida;
executa use case;
salva;
audita;
notifica;
retorna response.

Front:
mostra protocolo, status e mensagem.
```

Exemplo futuro de request:

```json
{
  "cliente": "Ana Silva",
  "telefone": "11999999999",
  "descricao": "Produto entregue com avaria",
  "tipo": "CRITICA"
}
```

Exemplo futuro de response:

```json
{
  "codigo": "OS-2026-000001",
  "cliente": "Ana Silva",
  "status": "ABERTA",
  "prioridade": 100,
  "mensagem": "Ordem de serviço aberta com sucesso."
}
```

Nesta aula, vamos fazer isso em Java puro.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Nesta aula:

```text
Entidade:
OrdemServico.

Use case:
AbrirOrdemServicoUseCase.

Repository:
OrdemServicoRepository.

Client/Gateway:
ClienteNotificador e AuditoriaGateway.

Controller:
ainda não existe; o App simula a entrada.
```

---

## Onde entra cada princípio SOLID

## SRP

Cada classe terá uma responsabilidade clara:

```text
OrdemServico:
regra da OS.

AbrirOrdemServicoUseCase:
coordenação do fluxo.

PoliticaPrioridade:
regra de prioridade.

OrdemServicoRepository:
contrato de persistência.

ClienteNotificador:
contrato de notificação.

AuditoriaGateway:
contrato de auditoria.

Mapper:
conversão para response.

App:
montagem e execução.
```

---

## OCP

A prioridade será calculada por políticas.

Se surgir novo tipo de OS, criaremos nova implementação.

O use case não precisa receber mais um `if`.

---

## LSP

Toda política de prioridade precisa respeitar o contrato:

```text
se aplica ou não;
retorna peso válido;
não altera a OS;
não retorna valor negativo.
```

Toda implementação de repository precisa retornar `Optional`, não `null`.

Toda implementação de notificação precisa cumprir o contrato de notificar.

---

## ISP

As interfaces serão pequenas:

```text
OrdemServicoRepository;
ClienteNotificador;
AuditoriaGateway;
GeradorCodigoOs;
PoliticaPrioridadeOs.
```

Não teremos uma interface gigante chamada:

```text
SistemaOsCompleto
```

---

## DIP

O use case vai depender de interfaces.

As implementações concretas ficarão na infraestrutura.

```text
AbrirOrdemServicoUseCase -> OrdemServicoRepository
AbrirOrdemServicoUseCase -> ClienteNotificador
AbrirOrdemServicoUseCase -> AuditoriaGateway
AbrirOrdemServicoUseCase -> GeradorCodigoOs
```

E não diretamente de:

```text
OrdemServicoRepositoryMemoria;
WhatsAppClienteNotificador;
AuditoriaConsoleGateway;
GeradorCodigoOsSequencialMemoria.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-221-solid-aplicado-fluxo-completo-backend
cd labs\m9\aula-221-solid-aplicado-fluxo-completo-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula221

mkdir src\br\com\curso\aula221\app

mkdir src\br\com\curso\aula221\dominio
mkdir src\br\com\curso\aula221\dominio\os

mkdir src\br\com\curso\aula221\aplicacao
mkdir src\br\com\curso\aula221\aplicacao\dto
mkdir src\br\com\curso\aula221\aplicacao\mapper
mkdir src\br\com\curso\aula221\aplicacao\port
mkdir src\br\com\curso\aula221\aplicacao\prioridade
mkdir src\br\com\curso\aula221\aplicacao\usecase

mkdir src\br\com\curso\aula221\infra
mkdir src\br\com\curso\aula221\infra\auditoria
mkdir src\br\com\curso\aula221\infra\codigo
mkdir src\br\com\curso\aula221\infra\notificacao
mkdir src\br\com\curso\aula221\infra\repository

mkdir src\br\com\curso\aula221\teste
```

---

# Parte 1 — Domínio

## StatusOrdemServico

Crie:

```text
src\br\com\curso\aula221\dominio\os\StatusOrdemServico.java
```

Código:

```java
package br.com.curso.aula221.dominio.os;

public enum StatusOrdemServico {
    ABERTA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## TipoOrdemServico

Crie:

```text
src\br\com\curso\aula221\dominio\os\TipoOrdemServico.java
```

Código:

```java
package br.com.curso.aula221.dominio.os;

public enum TipoOrdemServico {
    NORMAL,
    CRITICA,
    REAGENDAMENTO,
    SEM_CAPACITY
}
```

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula221\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula221.dominio.os;

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
            throw new IllegalArgumentException("Tipo da OS é obrigatório.");
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

    public void cancelar() {
        if (status == StatusOrdemServico.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        status = StatusOrdemServico.CANCELADA;
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

## Análise SRP da entidade

A entidade `OrdemServico` cuida de:

```text
estado da OS;
transições de status;
prioridade;
invariantes principais.
```

Ela não cuida de:

```text
salvar no banco;
enviar WhatsApp;
registrar auditoria;
gerar código sequencial;
montar response JSON;
receber request HTTP.
```

Isso respeita SRP.

---

# Parte 2 — DTOs da aplicação

## AbrirOrdemServicoRequest

Crie:

```text
src\br\com\curso\aula221\aplicacao\dto\AbrirOrdemServicoRequest.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.dto;

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
src\br\com\curso\aula221\aplicacao\dto\AbrirOrdemServicoResponse.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.dto;

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

## Por que DTO separado

O request representa entrada.

O response representa saída.

A entidade representa domínio.

Não misture os três.

```text
Request:
dados recebidos.

Entidade:
regra de negócio.

Response:
dados devolvidos.
```

Isso prepara o caminho para controller e front futuramente.

---

# Parte 3 — Ports da aplicação

## OrdemServicoRepository

Crie:

```text
src\br\com\curso\aula221\aplicacao\port\OrdemServicoRepository.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.port;

import br.com.curso.aula221.dominio.os.OrdemServico;

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
src\br\com\curso\aula221\aplicacao\port\ClienteNotificador.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.port;

import br.com.curso.aula221.dominio.os.OrdemServico;

public interface ClienteNotificador {
    void notificarAbertura(OrdemServico ordemServico);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula221\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## GeradorCodigoOs

Crie:

```text
src\br\com\curso\aula221\aplicacao\port\GeradorCodigoOs.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.port;

public interface GeradorCodigoOs {
    String gerar();
}
```

---

## Análise DIP

Essas interfaces são portas.

O use case vai depender delas.

A infraestrutura vai implementar.

Isso evita que o use case dependa diretamente de:

```text
memória;
console;
WhatsApp;
arquivo;
sequenciador concreto.
```

---

# Parte 4 — OCP com políticas de prioridade

## PoliticaPrioridadeOs

Crie:

```text
src\br\com\curso\aula221\aplicacao\prioridade\PoliticaPrioridadeOs.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;

public interface PoliticaPrioridadeOs {
    boolean aplica(OrdemServico ordemServico);

    int calcularPrioridade(OrdemServico ordemServico);

    String nome();
}
```

---

## PrioridadeNormal

Crie:

```text
src\br\com\curso\aula221\aplicacao\prioridade\PrioridadeNormal.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;
import br.com.curso.aula221.dominio.os.TipoOrdemServico;

public class PrioridadeNormal implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.NORMAL;
    }

    @Override
    public int calcularPrioridade(OrdemServico ordemServico) {
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
src\br\com\curso\aula221\aplicacao\prioridade\PrioridadeCritica.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;
import br.com.curso.aula221.dominio.os.TipoOrdemServico;

public class PrioridadeCritica implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.CRITICA;
    }

    @Override
    public int calcularPrioridade(OrdemServico ordemServico) {
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
src\br\com\curso\aula221\aplicacao\prioridade\PrioridadeReagendamento.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;
import br.com.curso.aula221.dominio.os.TipoOrdemServico;

public class PrioridadeReagendamento implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.REAGENDAMENTO;
    }

    @Override
    public int calcularPrioridade(OrdemServico ordemServico) {
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
src\br\com\curso\aula221\aplicacao\prioridade\PrioridadeSemCapacity.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;
import br.com.curso.aula221.dominio.os.TipoOrdemServico;

public class PrioridadeSemCapacity implements PoliticaPrioridadeOs {
    @Override
    public boolean aplica(OrdemServico ordemServico) {
        return ordemServico.tipo() == TipoOrdemServico.SEM_CAPACITY;
    }

    @Override
    public int calcularPrioridade(OrdemServico ordemServico) {
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
src\br\com\curso\aula221\aplicacao\prioridade\CalculadoraPrioridadeOs.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.prioridade;

import br.com.curso.aula221.dominio.os.OrdemServico;

import java.util.List;

public class CalculadoraPrioridadeOs {
    private final List<PoliticaPrioridadeOs> politicas;

    public CalculadoraPrioridadeOs(List<PoliticaPrioridadeOs> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas de prioridade são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public int calcular(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
        }

        PoliticaPrioridadeOs politica = politicas.stream()
                .filter(item -> item.aplica(ordemServico))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma política de prioridade encontrada para: " + ordemServico.tipo()));

        int prioridade = politica.calcularPrioridade(ordemServico);

        if (prioridade <= 0) {
            throw new IllegalStateException("Política retornou prioridade inválida: " + politica.nome());
        }

        return prioridade;
    }
}
```

---

## Análise SOLID da prioridade

```text
SRP:
cada política calcula um tipo.

OCP:
nova prioridade = nova implementação.

LSP:
toda política retorna prioridade válida.

ISP:
interface pequena, focada em prioridade.

DIP:
use case usa CalculadoraPrioridadeOs, que trabalha com contrato PoliticaPrioridadeOs.
```

---

# Parte 5 — Mapper

## OrdemServicoResponseMapper

Crie:

```text
src\br\com\curso\aula221\aplicacao\mapper\OrdemServicoResponseMapper.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.mapper;

import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula221.dominio.os.OrdemServico;

public class OrdemServicoResponseMapper {
    public AbrirOrdemServicoResponse toAberturaResponse(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
        }

        return new AbrirOrdemServicoResponse(
                ordemServico.codigo(),
                ordemServico.cliente(),
                ordemServico.status().name(),
                ordemServico.tipo().name(),
                ordemServico.prioridade(),
                "Ordem de serviço aberta com sucesso."
        );
    }
}
```

---

## Por que mapper separado

Se o formato do response mudar, mexemos no mapper.

Não mexemos na entidade.

Não mexemos no use case.

Isso respeita SRP.

---

# Parte 6 — Use case

## AbrirOrdemServicoUseCase

Crie:

```text
src\br\com\curso\aula221\aplicacao\usecase\AbrirOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula221.aplicacao.usecase;

import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula221.aplicacao.mapper.OrdemServicoResponseMapper;
import br.com.curso.aula221.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula221.aplicacao.port.ClienteNotificador;
import br.com.curso.aula221.aplicacao.port.GeradorCodigoOs;
import br.com.curso.aula221.aplicacao.port.OrdemServicoRepository;
import br.com.curso.aula221.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula221.dominio.os.OrdemServico;
import br.com.curso.aula221.dominio.os.TipoOrdemServico;

import java.time.Instant;
import java.util.UUID;

public class AbrirOrdemServicoUseCase {
    private final OrdemServicoRepository repository;
    private final ClienteNotificador notificador;
    private final AuditoriaGateway auditoriaGateway;
    private final GeradorCodigoOs geradorCodigoOs;
    private final CalculadoraPrioridadeOs calculadoraPrioridade;
    private final OrdemServicoResponseMapper mapper;

    public AbrirOrdemServicoUseCase(
            OrdemServicoRepository repository,
            ClienteNotificador notificador,
            AuditoriaGateway auditoriaGateway,
            GeradorCodigoOs geradorCodigoOs,
            CalculadoraPrioridadeOs calculadoraPrioridade,
            OrdemServicoResponseMapper mapper
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

        if (mapper == null) {
            throw new IllegalArgumentException("Mapper é obrigatório.");
        }

        this.repository = repository;
        this.notificador = notificador;
        this.auditoriaGateway = auditoriaGateway;
        this.geradorCodigoOs = geradorCodigoOs;
        this.calculadoraPrioridade = calculadoraPrioridade;
        this.mapper = mapper;
    }

    public AbrirOrdemServicoResponse executar(AbrirOrdemServicoRequest request, Instant agora) {
        validarRequest(request);

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        TipoOrdemServico tipo = converterTipo(request.tipo());

        OrdemServico ordemServico = new OrdemServico(
                UUID.randomUUID(),
                geradorCodigoOs.gerar(),
                request.cliente(),
                request.telefone(),
                request.descricao(),
                tipo,
                agora
        );

        int prioridade = calculadoraPrioridade.calcular(ordemServico);
        ordemServico.definirPrioridade(prioridade);

        repository.salvar(ordemServico);

        auditoriaGateway.registrar(
                "OS_ABERTA",
                "OS aberta: " + ordemServico.codigo() + " | Prioridade: " + prioridade,
                agora
        );

        notificador.notificarAbertura(ordemServico);

        return mapper.toAberturaResponse(ordemServico);
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

    private TipoOrdemServico converterTipo(String valor) {
        try {
            return TipoOrdemServico.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException erro) {
            throw new IllegalArgumentException("Tipo de OS inválido: " + valor, erro);
        }
    }
}
```

---

## Análise do use case

O use case coordena:

```text
valida entrada;
converte tipo;
cria entidade;
calcula prioridade;
salva;
audita;
notifica;
retorna response.
```

Ele não implementa:

```text
persistência concreta;
notificação concreta;
auditoria concreta;
geração concreta de código;
detalhe de console;
detalhe de memória;
detalhe de WhatsApp.
```

Isso respeita DIP.

---

# Parte 7 — Infraestrutura

## OrdemServicoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula221\infra\repository\OrdemServicoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula221.infra.repository;

import br.com.curso.aula221.aplicacao.port.OrdemServicoRepository;
import br.com.curso.aula221.dominio.os.OrdemServico;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class OrdemServicoRepositoryMemoria implements OrdemServicoRepository {
    private final List<OrdemServico> ordens = new ArrayList<>();

    @Override
    public void salvar(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
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
src\br\com\curso\aula221\infra\notificacao\WhatsAppClienteNotificador.java
```

Código:

```java
package br.com.curso.aula221.infra.notificacao;

import br.com.curso.aula221.aplicacao.port.ClienteNotificador;
import br.com.curso.aula221.dominio.os.OrdemServico;

public class WhatsAppClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
        }

        System.out.println("[WHATSAPP] " + ordemServico.telefone()
                + " | Olá " + ordemServico.cliente()
                + ", sua OS " + ordemServico.codigo()
                + " foi aberta com prioridade " + ordemServico.prioridade() + ".");
    }
}
```

---

## EmailClienteNotificador

Crie:

```text
src\br\com\curso\aula221\infra\notificacao\EmailClienteNotificador.java
```

Código:

```java
package br.com.curso.aula221.infra.notificacao;

import br.com.curso.aula221.aplicacao.port.ClienteNotificador;
import br.com.curso.aula221.dominio.os.OrdemServico;

public class EmailClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
        }

        System.out.println("[EMAIL] Cliente: " + ordemServico.cliente()
                + " | OS aberta: " + ordemServico.codigo()
                + " | Status: " + ordemServico.status());
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula221\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula221.infra.auditoria;

import br.com.curso.aula221.aplicacao.port.AuditoriaGateway;

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
            throw new IllegalArgumentException("Data/hora da auditoria é obrigatória.");
        }

        System.out.println("[AUDITORIA] " + evento + " | " + detalhes + " | " + ocorridoEm);
    }
}
```

---

## GeradorCodigoOsSequencialMemoria

Crie:

```text
src\br\com\curso\aula221\infra\codigo\GeradorCodigoOsSequencialMemoria.java
```

Código:

```java
package br.com.curso.aula221.infra.codigo;

import br.com.curso.aula221.aplicacao.port.GeradorCodigoOs;

import java.time.LocalDate;

public class GeradorCodigoOsSequencialMemoria implements GeradorCodigoOs {
    private int sequencia = 0;

    @Override
    public String gerar() {
        sequencia++;

        int ano = LocalDate.now().getYear();

        return "OS-" + ano + "-" + "%06d".formatted(sequencia);
    }
}
```

---

## Análise das implementações

Essas classes são detalhes.

Elas podem mudar sem alterar o use case.

Exemplo:

```text
Repository memória -> repository Postgres.
WhatsApp -> e-mail.
Auditoria console -> auditoria arquivo.
Gerador memória -> gerador banco.
```

Isso é DIP aplicado.

---

# Parte 8 — App principal

## AbrirOrdemServicoApp

Crie:

```text
src\br\com\curso\aula221\app\AbrirOrdemServicoApp.java
```

Código:

```java
package br.com.curso.aula221.app;

import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula221.aplicacao.mapper.OrdemServicoResponseMapper;
import br.com.curso.aula221.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula221.aplicacao.port.ClienteNotificador;
import br.com.curso.aula221.aplicacao.port.GeradorCodigoOs;
import br.com.curso.aula221.aplicacao.port.OrdemServicoRepository;
import br.com.curso.aula221.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeCritica;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeNormal;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeReagendamento;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeSemCapacity;
import br.com.curso.aula221.aplicacao.usecase.AbrirOrdemServicoUseCase;
import br.com.curso.aula221.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula221.infra.codigo.GeradorCodigoOsSequencialMemoria;
import br.com.curso.aula221.infra.notificacao.WhatsAppClienteNotificador;
import br.com.curso.aula221.infra.repository.OrdemServicoRepositoryMemoria;

import java.time.Instant;
import java.util.List;

public class AbrirOrdemServicoApp {
    public static void main(String[] args) {
        OrdemServicoRepository repository = new OrdemServicoRepositoryMemoria();
        ClienteNotificador notificador = new WhatsAppClienteNotificador();
        AuditoriaGateway auditoriaGateway = new AuditoriaConsoleGateway();
        GeradorCodigoOs geradorCodigoOs = new GeradorCodigoOsSequencialMemoria();

        CalculadoraPrioridadeOs calculadoraPrioridade = new CalculadoraPrioridadeOs(List.of(
                new PrioridadeNormal(),
                new PrioridadeCritica(),
                new PrioridadeReagendamento(),
                new PrioridadeSemCapacity()
        ));

        AbrirOrdemServicoUseCase useCase = new AbrirOrdemServicoUseCase(
                repository,
                notificador,
                auditoriaGateway,
                geradorCodigoOs,
                calculadoraPrioridade,
                new OrdemServicoResponseMapper()
        );

        AbrirOrdemServicoRequest request = new AbrirOrdemServicoRequest(
                "Ana Silva",
                "11999999999",
                "Produto entregue com avaria",
                "CRITICA"
        );

        AbrirOrdemServicoResponse response = useCase.executar(request, Instant.now());

        System.out.println();
        System.out.println("Response:");
        System.out.println(response);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoApp
```

---

## O que observar

A saída deve mostrar:

```text
repository salvando;
auditoria;
notificação;
response final.
```

O use case coordenou tudo, mas as implementações concretas foram montadas no App.

Futuramente, o Spring fará esse papel.

---

# Parte 9 — Trocando notificação sem alterar use case

## AbrirOrdemServicoEmailApp

Crie:

```text
src\br\com\curso\aula221\app\AbrirOrdemServicoEmailApp.java
```

Código:

```java
package br.com.curso.aula221.app;

import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula221.aplicacao.mapper.OrdemServicoResponseMapper;
import br.com.curso.aula221.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeCritica;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeNormal;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeReagendamento;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeSemCapacity;
import br.com.curso.aula221.aplicacao.usecase.AbrirOrdemServicoUseCase;
import br.com.curso.aula221.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula221.infra.codigo.GeradorCodigoOsSequencialMemoria;
import br.com.curso.aula221.infra.notificacao.EmailClienteNotificador;
import br.com.curso.aula221.infra.repository.OrdemServicoRepositoryMemoria;

import java.time.Instant;
import java.util.List;

public class AbrirOrdemServicoEmailApp {
    public static void main(String[] args) {
        AbrirOrdemServicoUseCase useCase = new AbrirOrdemServicoUseCase(
                new OrdemServicoRepositoryMemoria(),
                new EmailClienteNotificador(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoOsSequencialMemoria(),
                new CalculadoraPrioridadeOs(List.of(
                        new PrioridadeNormal(),
                        new PrioridadeCritica(),
                        new PrioridadeReagendamento(),
                        new PrioridadeSemCapacity()
                )),
                new OrdemServicoResponseMapper()
        );

        AbrirOrdemServicoRequest request = new AbrirOrdemServicoRequest(
                "Carlos Souza",
                "11888888888",
                "Cliente solicitou reagendamento",
                "REAGENDAMENTO"
        );

        AbrirOrdemServicoResponse response = useCase.executar(request, Instant.now());

        System.out.println(response);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoEmailApp
```

---

## O que mudou

Mudamos:

```text
WhatsAppClienteNotificador
```

para:

```text
EmailClienteNotificador
```

Sem alterar:

```text
AbrirOrdemServicoUseCase.
```

Isso mostra:

```text
DIP + OCP.
```

---

# Parte 10 — Fake para teste manual

## ClienteNotificadorFake

Crie:

```text
src\br\com\curso\aula221\teste\ClienteNotificadorFake.java
```

Código:

```java
package br.com.curso.aula221.teste;

import br.com.curso.aula221.aplicacao.port.ClienteNotificador;
import br.com.curso.aula221.dominio.os.OrdemServico;

import java.util.ArrayList;
import java.util.List;

public class ClienteNotificadorFake implements ClienteNotificador {
    private final List<String> notificacoes = new ArrayList<>();

    @Override
    public void notificarAbertura(OrdemServico ordemServico) {
        if (ordemServico == null) {
            throw new IllegalArgumentException("Ordem de serviço é obrigatória.");
        }

        notificacoes.add(ordemServico.codigo());
    }

    public boolean foiNotificada(String codigo) {
        return notificacoes.contains(codigo);
    }

    public List<String> notificacoes() {
        return List.copyOf(notificacoes);
    }
}
```

---

## AuditoriaFakeGateway

Crie:

```text
src\br\com\curso\aula221\teste\AuditoriaFakeGateway.java
```

Código:

```java
package br.com.curso.aula221.teste;

import br.com.curso.aula221.aplicacao.port.AuditoriaGateway;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AuditoriaFakeGateway implements AuditoriaGateway {
    private final List<String> eventos = new ArrayList<>();

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

        eventos.add(evento + " | " + detalhes);
    }

    public List<String> eventos() {
        return List.copyOf(eventos);
    }
}
```

---

## GeradorCodigoOsFixo

Crie:

```text
src\br\com\curso\aula221\teste\GeradorCodigoOsFixo.java
```

Código:

```java
package br.com.curso.aula221.teste;

import br.com.curso.aula221.aplicacao.port.GeradorCodigoOs;

public class GeradorCodigoOsFixo implements GeradorCodigoOs {
    private final String codigo;

    public GeradorCodigoOsFixo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código fixo é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
    }

    @Override
    public String gerar() {
        return codigo;
    }
}
```

---

## AbrirOrdemServicoFakeTestApp

Crie:

```text
src\br\com\curso\aula221\app\AbrirOrdemServicoFakeTestApp.java
```

Código:

```java
package br.com.curso.aula221.app;

import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoRequest;
import br.com.curso.aula221.aplicacao.dto.AbrirOrdemServicoResponse;
import br.com.curso.aula221.aplicacao.mapper.OrdemServicoResponseMapper;
import br.com.curso.aula221.aplicacao.prioridade.CalculadoraPrioridadeOs;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeCritica;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeNormal;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeReagendamento;
import br.com.curso.aula221.aplicacao.prioridade.PrioridadeSemCapacity;
import br.com.curso.aula221.aplicacao.usecase.AbrirOrdemServicoUseCase;
import br.com.curso.aula221.infra.repository.OrdemServicoRepositoryMemoria;
import br.com.curso.aula221.teste.AuditoriaFakeGateway;
import br.com.curso.aula221.teste.ClienteNotificadorFake;
import br.com.curso.aula221.teste.GeradorCodigoOsFixo;

import java.time.Instant;
import java.util.List;

public class AbrirOrdemServicoFakeTestApp {
    public static void main(String[] args) {
        ClienteNotificadorFake notificadorFake = new ClienteNotificadorFake();
        AuditoriaFakeGateway auditoriaFake = new AuditoriaFakeGateway();

        AbrirOrdemServicoUseCase useCase = new AbrirOrdemServicoUseCase(
                new OrdemServicoRepositoryMemoria(),
                notificadorFake,
                auditoriaFake,
                new GeradorCodigoOsFixo("OS-TESTE-000001"),
                new CalculadoraPrioridadeOs(List.of(
                        new PrioridadeNormal(),
                        new PrioridadeCritica(),
                        new PrioridadeReagendamento(),
                        new PrioridadeSemCapacity()
                )),
                new OrdemServicoResponseMapper()
        );

        AbrirOrdemServicoRequest request = new AbrirOrdemServicoRequest(
                "Maria Oliveira",
                "11777777777",
                "Sem capacity na data escolhida",
                "SEM_CAPACITY"
        );

        AbrirOrdemServicoResponse response = useCase.executar(
                request,
                Instant.parse("2026-07-09T10:00:00Z")
        );

        System.out.println("Response: " + response);
        System.out.println("Foi notificada? " + notificadorFake.foiNotificada("OS-TESTE-000001"));
        System.out.println("Eventos auditoria: " + auditoriaFake.eventos());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoFakeTestApp
```

---

## O que este app mostra

Sem Spring e sem JUnit ainda, você já consegue simular teste controlado:

```text
código fixo;
data fixa;
notificador fake;
auditoria fake;
repository memória;
use case real.
```

Isso só é possível porque aplicamos DIP.

---

# Parte 11 — Como o front conversaria com isso futuramente

Quando chegarmos em Spring, o controller poderia ficar conceitualmente assim:

```java
@PostMapping("/ordens-servico")
public ResponseEntity<AbrirOrdemServicoResponse> abrir(@RequestBody AbrirOrdemServicoRequest request) {
    AbrirOrdemServicoResponse response = useCase.executar(request, Instant.now());

    return ResponseEntity.status(201).body(response);
}
```

O front enviaria:

```json
{
  "cliente": "Ana Silva",
  "telefone": "11999999999",
  "descricao": "Produto entregue com avaria",
  "tipo": "CRITICA"
}
```

O backend responderia:

```json
{
  "codigo": "OS-2026-000001",
  "cliente": "Ana Silva",
  "status": "ABERTA",
  "tipo": "CRITICA",
  "prioridade": 100,
  "mensagem": "Ordem de serviço aberta com sucesso."
}
```

O front não precisa saber:

```text
qual repository foi usado;
qual notificador foi usado;
qual auditoria foi usada;
como a prioridade foi calculada internamente.
```

Ele só precisa do contrato da API.

---

# Parte 12 — Onde cada SOLID aparece no código

## SRP

```text
OrdemServico:
domínio.

AbrirOrdemServicoUseCase:
coordenação.

CalculadoraPrioridadeOs:
cálculo por políticas.

OrdemServicoRepositoryMemoria:
persistência memória.

WhatsAppClienteNotificador:
notificação WhatsApp.

AuditoriaConsoleGateway:
auditoria console.

Mapper:
response.
```

Cada classe tem um motivo principal para mudar.

---

## OCP

Nova política:

```text
PrioridadeClienteVip
```

poderia ser adicionada sem alterar a calculadora.

Novo notificador:

```text
SmsClienteNotificador
```

poderia ser adicionado sem alterar o use case.

Novo repository:

```text
OrdemServicoRepositoryArquivo
```

poderia ser criado sem alterar o use case.

---

## LSP

Toda implementação precisa cumprir contrato:

```text
repository retorna Optional;
notificador notifica sem retornar null;
auditoria registra sem engolir dados;
política retorna prioridade válida.
```

---

## ISP

Interfaces pequenas:

```text
OrdemServicoRepository;
ClienteNotificador;
AuditoriaGateway;
GeradorCodigoOs;
PoliticaPrioridadeOs.
```

Nenhuma implementação precisa lançar `UnsupportedOperationException`.

---

## DIP

Use case depende de abstrações:

```text
OrdemServicoRepository;
ClienteNotificador;
AuditoriaGateway;
GeradorCodigoOs.
```

Infraestrutura depende dos contratos e os implementa.

---

# Parte 13 — Erros comuns nesse tipo de fluxo

## 1. Colocar tudo no use case

Ruim:

```text
use case calcula prioridade com if;
salva em lista;
manda WhatsApp direto;
gera código direto;
imprime auditoria;
monta response manualmente.
```

O use case coordena.

Não deve fazer tudo.

---

## 2. Colocar infraestrutura na entidade

Ruim:

```java
ordemServico.salvarNoBanco();
ordemServico.enviarWhatsapp();
```

A entidade protege regra.

Não integra.

---

## 3. Criar interface gigante

Ruim:

```java
public interface OrdemServicoSistema {
    void salvar();
    void notificar();
    void auditar();
    void gerarCodigo();
    void calcularPrioridade();
}
```

Isso viola ISP.

---

## 4. Retornar null em repository

Ruim:

```java
return null;
```

Melhor:

```java
return Optional.empty();
```

---

## 5. Política com efeito colateral

Ruim:

```java
calcularPrioridade() salva OS;
```

Política calcula.

Não salva.

---

## 6. Service criando dependência concreta

Ruim:

```java
private final OrdemServicoRepositoryMemoria repository = new OrdemServicoRepositoryMemoria();
```

Melhor:

```java
private final OrdemServicoRepository repository;
```

---

# Parte 14 — Exercício prático

## Contexto

Você vai adicionar um novo tipo de OS:

```text
CASO_CRITICO_CLIENTE_VIP
```

Prioridade:

```text
150
```

---

## Passos

## 1. Atualizar enum

Em `TipoOrdemServico`, adicione:

```java
CASO_CRITICO_CLIENTE_VIP
```

---

## 2. Criar política

Crie:

```text
PrioridadeCasoCriticoClienteVip
```

Implementando:

```text
PoliticaPrioridadeOs
```

Regra:

```text
aplica quando tipo == CASO_CRITICO_CLIENTE_VIP;
prioridade 150.
```

---

## 3. Adicionar no App

Na composição do App, adicione:

```java
new PrioridadeCasoCriticoClienteVip()
```

---

## 4. Criar request

Use:

```text
tipo = "CASO_CRITICO_CLIENTE_VIP"
```

---

## Pergunta

Você precisou alterar:

```text
CalculadoraPrioridadeOs?
AbrirOrdemServicoUseCase?
OrdemServicoRepository?
ClienteNotificador?
AuditoriaGateway?
```

Resposta esperada:

```text
não.
```

Isso mostra OCP.

---

# Parte 15 — Desafio principal

## Criar fluxo de Encerramento de OS

Agora crie um novo use case:

```text
EncerrarOrdemServicoUseCase
```

Fluxo:

```text
recebe código da OS;
busca OS no repository;
inicia atendimento se estiver aberta;
conclui OS;
salva;
audita;
notifica cliente;
retorna response.
```

---

## DTOs

Crie:

```text
EncerrarOrdemServicoRequest
```

Campos:

```text
String codigo;
```

Crie:

```text
EncerrarOrdemServicoResponse
```

Campos:

```text
String codigo;
String status;
String mensagem;
```

---

## Mapper

Crie:

```text
EncerrarOrdemServicoMapper
```

---

## Regras

Use métodos da entidade:

```java
iniciarAtendimento()
concluir()
```

---

## Critérios SOLID

```text
use case coordena;
entidade decide transição;
repository é porta;
notificador é porta;
auditoria é porta;
mapper monta response;
sem new de infra dentro do use case;
sem lógica de status no app;
sem if gigante por status fora da entidade.
```

---

# Parte 16 — Desafio extra com front em mente

Imagine que o front precise mostrar erro de validação.

Crie uma classe conceitual:

```text
ErroCampo
```

Campos:

```text
String campo;
String mensagem;
```

Crie:

```text
ResultadoValidacaoRequest
```

Com:

```text
List<ErroCampo> erros;
boolean valido();
```

Depois crie:

```text
ValidadorAbrirOrdemServicoRequest
```

Responsabilidade:

```text
validar request e acumular erros.
```

O use case pode usar esse validador antes de criar a entidade.

Objetivo:

```text
preparar pensamento para respostas HTTP 400 e mensagens amigáveis para front.
```

Exemplo futuro de resposta:

```json
{
  "codigo": "VALIDACAO_ERRO",
  "mensagem": "Existem campos inválidos.",
  "campos": [
    {
      "campo": "cliente",
      "mensagem": "Cliente é obrigatório."
    }
  ]
}
```

---

# Parte 17 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoApp
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoEmailApp
java -cp out br.com.curso.aula221.app.AbrirOrdemServicoFakeTestApp
```

Depois responda:

```text
1. Qual classe é a entidade?
2. Qual classe é o use case?
3. Quais são as ports?
4. Quais são os adapters?
5. Onde a prioridade é calculada?
6. Como adicionar nova prioridade?
7. Como trocar WhatsApp por E-mail?
8. Como testar sem notificação real?
9. O use case depende de classes concretas?
10. Como isso vai virar controller futuramente?
```

---

# Parte 18 — Simulado rápido

## Questão 1

No fluxo desta aula, quem coordena a abertura da OS?

```text
A) AbrirOrdemServicoUseCase.
B) OrdemServicoRepositoryMemoria.
C) WhatsAppClienteNotificador.
D) TipoOrdemServico.
```

---

## Questão 2

Quem deve decidir transições de status da OS?

```text
A) Entidade OrdemServico.
B) App.
C) Notificador.
D) AuditoriaGateway.
```

---

## Questão 3

Qual princípio permite trocar WhatsApp por E-mail sem alterar o use case?

```text
A) DIP.
B) Apenas StringJoiner.
C) Apenas enum.
D) Nenhum.
```

---

## Questão 4

Qual princípio aparece nas políticas de prioridade?

```text
A) OCP.
B) Apenas IOException.
C) Apenas Random.
D) Nenhum.
```

---

## Questão 5

Por que as interfaces pequenas ajudam?

```text
A) Porque respeitam ISP e evitam contratos falsos.
B) Porque obrigam tudo a lançar UnsupportedOperationException.
C) Porque impedem teste.
D) Porque removem domínio.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
```

---

# Parte 19 — Checklist de conclusão

Marque mentalmente:

```text
[ ] Sei montar um fluxo backend com entidade, use case, ports e adapters.
[ ] Sei aplicar SRP em cada classe.
[ ] Sei aplicar OCP com políticas.
[ ] Sei aplicar LSP garantindo contratos confiáveis.
[ ] Sei aplicar ISP com interfaces pequenas.
[ ] Sei aplicar DIP com dependência por abstração.
[ ] Sei montar dependências manualmente no App.
[ ] Sei trocar implementação sem alterar use case.
[ ] Sei criar fake para teste.
[ ] Sei explicar como isso vira controller e API futuramente.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Onde SRP aparece no fluxo de OS?
2. Onde OCP aparece?
3. Onde LSP aparece?
4. Onde ISP aparece?
5. Onde DIP aparece?
6. Por que a entidade não salva?
7. Por que o use case não cria repository com new?
8. Por que o front não precisa saber da infraestrutura?
9. Como trocar notificador?
10. Como testar sem notificação real?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o fluxo completo de abertura de OS;
separar domínio, aplicação e infraestrutura;
criar ports;
criar adapters;
criar políticas extensíveis;
criar use case coordenador;
montar dependências manualmente;
trocar infraestrutura sem alterar regra;
entender como o front vai consumir response;
resolver o desafio de encerramento de OS.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-221-solid-aplicado-fluxo-completo-backend
git commit -m "Aula 221: solid aplicado fluxo completo backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
SOLID não é teoria isolada; SOLID organiza um fluxo real de backend para evoluir com segurança.
```

Você aplicou:

```text
SRP;
OCP;
LSP;
ISP;
DIP;
domínio;
DTO;
mapper;
use case;
ports;
adapters;
repository;
notificação;
auditoria;
prioridade;
teste fake;
composição manual.
```

Também reforçou a visão completa:

```text
Tela -> Request -> Controller futuro -> Use Case -> Entidade -> Ports -> Adapters -> Response -> Tela
```

Na próxima aula, vamos fazer uma revisão técnica do SOLID com refatoração guiada e simulado.

Depois disso, vamos avançar para padrões e arquitetura de aplicação com mais profundidade.
