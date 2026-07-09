# 222 — M9.08 — SOLID: revisão técnica, refatoração guiada e simulado

## Objetivo da aula

Na aula anterior, você aplicou SOLID em um fluxo completo de backend:

```text
Abertura de Ordem de Serviço
```

Você trabalhou com:

```text
entidade;
DTO;
mapper;
use case;
ports;
adapters;
repository;
notificação;
auditoria;
gerador de código;
políticas de prioridade;
fake para teste;
injeção manual de dependências.
```

Agora vamos consolidar o Módulo 9 até aqui.

Esta aula tem três objetivos principais:

```text
1. Revisar tecnicamente os cinco princípios do SOLID.
2. Fazer uma refatoração guiada de código ruim para código melhor organizado.
3. Resolver um simulado técnico para validar entendimento.
```

Ao final desta aula, você deve conseguir:

```text
identificar violações de SRP;
identificar violações de OCP;
identificar violações de LSP;
identificar violações de ISP;
identificar violações de DIP;
refatorar uma classe grande;
separar domínio, aplicação e infraestrutura;
criar ports;
criar adapters;
criar políticas extensíveis;
criar fakes para teste;
explicar como o backend conversa com o front por DTOs;
preparar o terreno para padrões de projeto e arquitetura de aplicação.
```

---

## O ponto central desta revisão

SOLID não é uma lista para decorar.

SOLID é uma forma de pensar sobre mudança.

Um código ruim pode funcionar hoje.

Mas se ele não for bem desenhado, cada mudança futura custa caro.

SOLID ajuda a responder perguntas como:

```text
essa classe faz coisa demais?
esse if vai crescer para sempre?
essa implementação cumpre o contrato?
essa interface obriga métodos que não fazem sentido?
esse use case está preso em infraestrutura concreta?
```

Essas perguntas aparecem em backend real todos os dias.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Nesta revisão:

```text
Entidade:
protege regra.

Use case:
coordena o fluxo.

Repository:
salva e busca.

Gateway/Client:
integra com detalhe externo.

Mapper:
converte saída.

DTO:
representa entrada e saída.

Controller futuro:
recebe HTTP e chama use case.

Front:
consome o contrato exposto pelo backend.
```

---

# Parte 1 — Revisão rápida dos cinco princípios

## SRP — Single Responsibility Principle

Frase:

```text
uma classe deve ter um único motivo para mudar.
```

Sinais de violação:

```text
classe faz regra, banco, e-mail, arquivo, auditoria e response;
classe tem métodos sem relação;
nome genérico demais;
classe difícil de explicar em uma frase;
service com centenas de linhas;
entidade lendo arquivo ou chamando API.
```

Exemplo ruim:

```java
public class PedidoService {
    public void processar() {
        // valida
        // calcula desconto
        // salva banco
        // envia e-mail
        // gera CSV
        // monta response
    }
}
```

Exemplo melhor:

```text
Pedido:
regra.

CalculadoraDesconto:
desconto.

PedidoRepository:
persistência.

PedidoNotificador:
notificação.

PedidoMapper:
response.

PedidoProcessamentoUseCase:
coordenação.
```

---

## OCP — Open/Closed Principle

Frase:

```text
aberto para extensão, fechado para modificação.
```

Sinais de violação:

```text
if/switch crescendo por tipo de comportamento;
novo tipo exige alterar classe central;
método com vários blocos por tipo;
cada regra nova mexe no código já testado.
```

Exemplo ruim:

```java
if ("VIP".equals(tipo)) {
    return valor.multiply(new BigDecimal("0.10"));
}

if ("PREMIUM".equals(tipo)) {
    return valor.multiply(new BigDecimal("0.20"));
}
```

Exemplo melhor:

```text
PoliticaDesconto;
DescontoVip;
DescontoPremium;
CalculadoraDesconto com lista de políticas.
```

---

## LSP — Liskov Substitution Principle

Frase:

```text
subtipos devem poder substituir o tipo base sem quebrar o comportamento esperado.
```

Sinais de violação:

```text
UnsupportedOperationException em método obrigatório;
retorno null onde contrato espera Optional ou valor;
implementação altera estado inesperadamente;
subtipo exige condição mais forte que o contrato;
subtipo entrega resultado mais fraco;
herança falsa.
```

Exemplo ruim:

```java
public class RelatorioApenasCsv extends RelatorioCompleto {
    @Override
    public String exportarPdf() {
        throw new UnsupportedOperationException();
    }
}
```

Exemplo melhor:

```text
ExportadorCsv;
ExportadorPdf;
cada classe implementa apenas o que cumpre.
```

---

## ISP — Interface Segregation Principle

Frase:

```text
clientes não devem depender de métodos que não usam.
```

Sinais de violação:

```text
interface gigante;
implementação com método vazio;
implementação lançando UnsupportedOperationException;
classe obrigada a implementar capacidade que não possui;
service dependendo de contrato maior do que precisa.
```

Exemplo ruim:

```java
public interface ArquivoManagerCompleto {
    String ler(String caminho);

    void escrever(String caminho, String conteudo);

    void apagar(String caminho);

    void compactar(String caminho);

    void enviarParaStorage(String caminho);
}
```

Exemplo melhor:

```text
LeitorArquivo;
EscritorArquivo;
ApagadorArquivo;
CompactadorArquivo;
StorageArquivoUploader.
```

---

## DIP — Dependency Inversion Principle

Frase:

```text
módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações.
```

Sinais de violação:

```text
service criando repository com new;
use case dependendo de classe concreta de banco;
regra de negócio chamando SMTP diretamente;
difícil trocar implementação;
difícil testar sem infraestrutura real.
```

Exemplo ruim:

```java
public class PedidoService {
    private final PedidoRepositoryPostgres repository = new PedidoRepositoryPostgres();
}
```

Exemplo melhor:

```java
public class PedidoService {
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }
}
```

---

# Parte 2 — Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-222-solid-revisao-tecnica-refatoracao-guiada-simulado
cd labs\m9\aula-222-solid-revisao-tecnica-refatoracao-guiada-simulado
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula222

mkdir src\br\com\curso\aula222\app

mkdir src\br\com\curso\aula222\dominio
mkdir src\br\com\curso\aula222\dominio\chamado

mkdir src\br\com\curso\aula222\ruim

mkdir src\br\com\curso\aula222\aplicacao
mkdir src\br\com\curso\aula222\aplicacao\dto
mkdir src\br\com\curso\aula222\aplicacao\mapper
mkdir src\br\com\curso\aula222\aplicacao\port
mkdir src\br\com\curso\aula222\aplicacao\prioridade
mkdir src\br\com\curso\aula222\aplicacao\usecase

mkdir src\br\com\curso\aula222\infra
mkdir src\br\com\curso\aula222\infra\auditoria
mkdir src\br\com\curso\aula222\infra\codigo
mkdir src\br\com\curso\aula222\infra\notificacao
mkdir src\br\com\curso\aula222\infra\repository

mkdir src\br\com\curso\aula222\teste
```

---

# Parte 3 — Código ruim para refatoração

## Cenário

Vamos criar um fluxo de abertura de chamado.

A classe ruim vai fazer tudo:

```text
validar request;
gerar código;
calcular prioridade com if;
criar chamado;
salvar em lista interna;
enviar notificação;
registrar auditoria;
montar response;
imprimir no console.
```

Ela vai funcionar.

Mas vai violar SOLID.

---

## ChamadoServiceRuim

Crie:

```text
src\br\com\curso\aula222\ruim\ChamadoServiceRuim.java
```

Código:

```java
package br.com.curso.aula222.ruim;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

public class ChamadoServiceRuim {
    private final List<String> chamados = new ArrayList<>();
    private int sequencia = 0;

    public String abrir(String cliente, String telefone, String descricao, String tipo) {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        String tipoNormalizado = tipo.trim().toUpperCase();

        int prioridade;

        if ("NORMAL".equals(tipoNormalizado)) {
            prioridade = 10;
        } else if ("CRITICO".equals(tipoNormalizado)) {
            prioridade = 100;
        } else if ("FINANCEIRO".equals(tipoNormalizado)) {
            prioridade = 80;
        } else if ("TECNICO".equals(tipoNormalizado)) {
            prioridade = 60;
        } else {
            throw new IllegalArgumentException("Tipo inválido: " + tipo);
        }

        sequencia++;
        String codigo = "CH-" + LocalDate.now().getYear() + "-" + "%06d".formatted(sequencia);

        String chamado = new StringJoiner(" | ")
                .add(UUID.randomUUID().toString())
                .add(codigo)
                .add(cliente.trim())
                .add(telefone.trim())
                .add(descricao.trim())
                .add(tipoNormalizado)
                .add("ABERTO")
                .add("Prioridade: " + prioridade)
                .add("Criado em: " + Instant.now())
                .toString();

        chamados.add(chamado);

        System.out.println("[BANCO MEMORIA] Salvando chamado: " + codigo);
        System.out.println("[WHATSAPP] Enviando mensagem para " + telefone + ": chamado aberto " + codigo);
        System.out.println("[AUDITORIA] CHAMADO_ABERTO | " + codigo + " | " + Instant.now());

        return "{codigo:'" + codigo
                + "', cliente:'" + cliente
                + "', status:'ABERTO', prioridade:" + prioridade
                + ", mensagem:'Chamado aberto com sucesso.'}";
    }

    public List<String> listar() {
        return List.copyOf(chamados);
    }
}
```

---

## ChamadoServiceRuimApp

Crie:

```text
src\br\com\curso\aula222\app\ChamadoServiceRuimApp.java
```

Código:

```java
package br.com.curso.aula222.app;

import br.com.curso.aula222.ruim.ChamadoServiceRuim;

public class ChamadoServiceRuimApp {
    public static void main(String[] args) {
        ChamadoServiceRuim service = new ChamadoServiceRuim();

        String response = service.abrir(
                "Ana Silva",
                "11999999999",
                "Sistema fora do ar",
                "CRITICO"
        );

        System.out.println("Response:");
        System.out.println(response);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula222.app.ChamadoServiceRuimApp
```

---

## Diagnóstico SOLID da classe ruim

## Violação de SRP

A classe tem muitas responsabilidades:

```text
validação;
geração de código;
cálculo de prioridade;
persistência;
notificação;
auditoria;
response;
console.
```

---

## Violação de OCP

Para adicionar novo tipo de chamado, precisa alterar o `if/else`.

Exemplo:

```text
SEGURANCA;
JURIDICO;
VIP;
BACKOFFICE.
```

Tudo exigiria alteração no método.

---

## Risco de LSP

Ainda não há interfaces, mas quando existem contratos mal modelados, implementações podem quebrar comportamento.

A refatoração precisa garantir contratos honestos.

---

## Violação de ISP

Se criássemos uma interface única com tudo:

```text
salvar;
notificar;
auditar;
gerar código;
calcular prioridade.
```

seria uma interface gigante.

Vamos evitar.

---

## Violação de DIP

O service está preso em detalhes:

```text
lista interna como banco;
WhatsApp no console;
auditoria no console;
gerador de código interno.
```

Não há ports.

Não há adapters.

---

# Parte 4 — Refatoração guiada: domínio

## StatusChamado

Crie:

```text
src\br\com\curso\aula222\dominio\chamado\StatusChamado.java
```

Código:

```java
package br.com.curso.aula222.dominio.chamado;

public enum StatusChamado {
    ABERTO,
    EM_ATENDIMENTO,
    ENCERRADO,
    CANCELADO
}
```

---

## TipoChamado

Crie:

```text
src\br\com\curso\aula222\dominio\chamado\TipoChamado.java
```

Código:

```java
package br.com.curso.aula222.dominio.chamado;

public enum TipoChamado {
    NORMAL,
    CRITICO,
    FINANCEIRO,
    TECNICO
}
```

---

## Chamado

Crie:

```text
src\br\com\curso\aula222\dominio\chamado\Chamado.java
```

Código:

```java
package br.com.curso.aula222.dominio.chamado;

import java.time.Instant;
import java.util.StringJoiner;
import java.util.UUID;

public class Chamado {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String descricao;
    private final TipoChamado tipo;
    private final Instant criadoEm;
    private StatusChamado status;
    private int prioridade;

    public Chamado(
            UUID id,
            String codigo,
            String cliente,
            String telefone,
            String descricao,
            TipoChamado tipo,
            Instant criadoEm
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

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.descricao = descricao.trim();
        this.tipo = tipo;
        this.criadoEm = criadoEm;
        this.status = StatusChamado.ABERTO;
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

    public TipoChamado tipo() {
        return tipo;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public StatusChamado status() {
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
        if (status != StatusChamado.ABERTO) {
            throw new IllegalStateException("Somente chamado aberto pode iniciar atendimento.");
        }

        status = StatusChamado.EM_ATENDIMENTO;
    }

    public void encerrar() {
        if (status != StatusChamado.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente chamado em atendimento pode ser encerrado.");
        }

        status = StatusChamado.ENCERRADO;
    }

    public void cancelar() {
        if (status == StatusChamado.ENCERRADO) {
            throw new IllegalStateException("Chamado encerrado não pode ser cancelado.");
        }

        status = StatusChamado.CANCELADO;
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(codigo)
                .add("Cliente: " + cliente)
                .add("Telefone: " + telefone)
                .add("Tipo: " + tipo)
                .add("Status: " + status)
                .add("Prioridade: " + prioridade)
                .add("Criado em: " + criadoEm)
                .toString();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Análise

A entidade agora cuida de:

```text
estado;
invariantes;
transições;
dados essenciais.
```

Ela não cuida de:

```text
banco;
notificação;
auditoria;
JSON;
console.
```

SRP aplicado.

---

# Parte 5 — DTOs e Mapper

## AbrirChamadoRequest

Crie:

```text
src\br\com\curso\aula222\aplicacao\dto\AbrirChamadoRequest.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.dto;

public record AbrirChamadoRequest(
        String cliente,
        String telefone,
        String descricao,
        String tipo
) {
}
```

---

## AbrirChamadoResponse

Crie:

```text
src\br\com\curso\aula222\aplicacao\dto\AbrirChamadoResponse.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.dto;

public record AbrirChamadoResponse(
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

## ChamadoResponseMapper

Crie:

```text
src\br\com\curso\aula222\aplicacao\mapper\ChamadoResponseMapper.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.mapper;

import br.com.curso.aula222.aplicacao.dto.AbrirChamadoResponse;
import br.com.curso.aula222.dominio.chamado.Chamado;

public class ChamadoResponseMapper {
    public AbrirChamadoResponse toAberturaResponse(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        return new AbrirChamadoResponse(
                chamado.codigo(),
                chamado.cliente(),
                chamado.status().name(),
                chamado.tipo().name(),
                chamado.prioridade(),
                "Chamado aberto com sucesso."
        );
    }
}
```

---

# Parte 6 — Ports

## ChamadoRepository

Crie:

```text
src\br\com\curso\aula222\aplicacao\port\ChamadoRepository.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.port;

import br.com.curso.aula222.dominio.chamado.Chamado;

import java.util.List;
import java.util.Optional;

public interface ChamadoRepository {
    void salvar(Chamado chamado);

    Optional<Chamado> buscarPorCodigo(String codigo);

    List<Chamado> listarTodos();
}
```

---

## ClienteNotificador

Crie:

```text
src\br\com\curso\aula222\aplicacao\port\ClienteNotificador.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.port;

import br.com.curso.aula222.dominio.chamado.Chamado;

public interface ClienteNotificador {
    void notificarAbertura(Chamado chamado);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula222\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## GeradorCodigoChamado

Crie:

```text
src\br\com\curso\aula222\aplicacao\port\GeradorCodigoChamado.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.port;

public interface GeradorCodigoChamado {
    String gerar();
}
```

---

## Análise

Essas portas são pequenas e específicas.

Isso aplica:

```text
ISP;
DIP.
```

---

# Parte 7 — OCP com prioridade

## PoliticaPrioridadeChamado

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\PoliticaPrioridadeChamado.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;

public interface PoliticaPrioridadeChamado {
    boolean aplica(Chamado chamado);

    int calcular(Chamado chamado);

    String nome();
}
```

---

## PrioridadeChamadoNormal

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\PrioridadeChamadoNormal.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;
import br.com.curso.aula222.dominio.chamado.TipoChamado;

public class PrioridadeChamadoNormal implements PoliticaPrioridadeChamado {
    @Override
    public boolean aplica(Chamado chamado) {
        return chamado.tipo() == TipoChamado.NORMAL;
    }

    @Override
    public int calcular(Chamado chamado) {
        return 10;
    }

    @Override
    public String nome() {
        return "Prioridade chamado normal";
    }
}
```

---

## PrioridadeChamadoCritico

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\PrioridadeChamadoCritico.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;
import br.com.curso.aula222.dominio.chamado.TipoChamado;

public class PrioridadeChamadoCritico implements PoliticaPrioridadeChamado {
    @Override
    public boolean aplica(Chamado chamado) {
        return chamado.tipo() == TipoChamado.CRITICO;
    }

    @Override
    public int calcular(Chamado chamado) {
        return 100;
    }

    @Override
    public String nome() {
        return "Prioridade chamado crítico";
    }
}
```

---

## PrioridadeChamadoFinanceiro

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\PrioridadeChamadoFinanceiro.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;
import br.com.curso.aula222.dominio.chamado.TipoChamado;

public class PrioridadeChamadoFinanceiro implements PoliticaPrioridadeChamado {
    @Override
    public boolean aplica(Chamado chamado) {
        return chamado.tipo() == TipoChamado.FINANCEIRO;
    }

    @Override
    public int calcular(Chamado chamado) {
        return 80;
    }

    @Override
    public String nome() {
        return "Prioridade chamado financeiro";
    }
}
```

---

## PrioridadeChamadoTecnico

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\PrioridadeChamadoTecnico.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;
import br.com.curso.aula222.dominio.chamado.TipoChamado;

public class PrioridadeChamadoTecnico implements PoliticaPrioridadeChamado {
    @Override
    public boolean aplica(Chamado chamado) {
        return chamado.tipo() == TipoChamado.TECNICO;
    }

    @Override
    public int calcular(Chamado chamado) {
        return 60;
    }

    @Override
    public String nome() {
        return "Prioridade chamado técnico";
    }
}
```

---

## CalculadoraPrioridadeChamado

Crie:

```text
src\br\com\curso\aula222\aplicacao\prioridade\CalculadoraPrioridadeChamado.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.prioridade;

import br.com.curso.aula222.dominio.chamado.Chamado;

import java.util.List;

public class CalculadoraPrioridadeChamado {
    private final List<PoliticaPrioridadeChamado> politicas;

    public CalculadoraPrioridadeChamado(List<PoliticaPrioridadeChamado> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas de prioridade são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public int calcular(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        PoliticaPrioridadeChamado politica = politicas.stream()
                .filter(item -> item.aplica(chamado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma política encontrada para: " + chamado.tipo()));

        int prioridade = politica.calcular(chamado);

        if (prioridade <= 0) {
            throw new IllegalStateException("Prioridade inválida retornada por: " + politica.nome());
        }

        return prioridade;
    }
}
```

---

# Parte 8 — Use case refatorado

## AbrirChamadoUseCase

Crie:

```text
src\br\com\curso\aula222\aplicacao\usecase\AbrirChamadoUseCase.java
```

Código:

```java
package br.com.curso.aula222.aplicacao.usecase;

import br.com.curso.aula222.aplicacao.dto.AbrirChamadoRequest;
import br.com.curso.aula222.aplicacao.dto.AbrirChamadoResponse;
import br.com.curso.aula222.aplicacao.mapper.ChamadoResponseMapper;
import br.com.curso.aula222.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula222.aplicacao.port.ChamadoRepository;
import br.com.curso.aula222.aplicacao.port.ClienteNotificador;
import br.com.curso.aula222.aplicacao.port.GeradorCodigoChamado;
import br.com.curso.aula222.aplicacao.prioridade.CalculadoraPrioridadeChamado;
import br.com.curso.aula222.dominio.chamado.Chamado;
import br.com.curso.aula222.dominio.chamado.TipoChamado;

import java.time.Instant;
import java.util.UUID;

public class AbrirChamadoUseCase {
    private final ChamadoRepository repository;
    private final ClienteNotificador notificador;
    private final AuditoriaGateway auditoriaGateway;
    private final GeradorCodigoChamado geradorCodigo;
    private final CalculadoraPrioridadeChamado calculadoraPrioridade;
    private final ChamadoResponseMapper mapper;

    public AbrirChamadoUseCase(
            ChamadoRepository repository,
            ClienteNotificador notificador,
            AuditoriaGateway auditoriaGateway,
            GeradorCodigoChamado geradorCodigo,
            CalculadoraPrioridadeChamado calculadoraPrioridade,
            ChamadoResponseMapper mapper
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

        if (geradorCodigo == null) {
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
        this.geradorCodigo = geradorCodigo;
        this.calculadoraPrioridade = calculadoraPrioridade;
        this.mapper = mapper;
    }

    public AbrirChamadoResponse executar(AbrirChamadoRequest request, Instant agora) {
        validarRequest(request);

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        TipoChamado tipo = converterTipo(request.tipo());

        Chamado chamado = new Chamado(
                UUID.randomUUID(),
                geradorCodigo.gerar(),
                request.cliente(),
                request.telefone(),
                request.descricao(),
                tipo,
                agora
        );

        int prioridade = calculadoraPrioridade.calcular(chamado);
        chamado.definirPrioridade(prioridade);

        repository.salvar(chamado);

        auditoriaGateway.registrar(
                "CHAMADO_ABERTO",
                "Chamado aberto: " + chamado.codigo() + " | Prioridade: " + chamado.prioridade(),
                agora
        );

        notificador.notificarAbertura(chamado);

        return mapper.toAberturaResponse(chamado);
    }

    private void validarRequest(AbrirChamadoRequest request) {
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

    private TipoChamado converterTipo(String valor) {
        try {
            return TipoChamado.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException erro) {
            throw new IllegalArgumentException("Tipo de chamado inválido: " + valor, erro);
        }
    }
}
```

---

## Análise do use case

O use case coordena.

Ele não sabe como:

```text
salvar concretamente;
notificar concretamente;
auditar concretamente;
gerar código concretamente.
```

Ele depende de portas.

Isso aplica DIP.

---

# Parte 9 — Infraestrutura

## ChamadoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula222\infra\repository\ChamadoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula222.infra.repository;

import br.com.curso.aula222.aplicacao.port.ChamadoRepository;
import br.com.curso.aula222.dominio.chamado.Chamado;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ChamadoRepositoryMemoria implements ChamadoRepository {
    private final List<Chamado> chamados = new ArrayList<>();

    @Override
    public void salvar(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        chamados.removeIf(item -> item.codigo().equals(chamado.codigo()));
        chamados.add(chamado);

        System.out.println("[REPOSITORY MEMORIA] Chamado salvo: " + chamado.codigo());
    }

    @Override
    public Optional<Chamado> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return chamados.stream()
                .filter(chamado -> chamado.codigo().equals(normalizado))
                .findFirst();
    }

    @Override
    public List<Chamado> listarTodos() {
        return List.copyOf(chamados);
    }
}
```

---

## WhatsAppClienteNotificador

Crie:

```text
src\br\com\curso\aula222\infra\notificacao\WhatsAppClienteNotificador.java
```

Código:

```java
package br.com.curso.aula222.infra.notificacao;

import br.com.curso.aula222.aplicacao.port.ClienteNotificador;
import br.com.curso.aula222.dominio.chamado.Chamado;

public class WhatsAppClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        System.out.println("[WHATSAPP] " + chamado.telefone()
                + " | Chamado aberto: " + chamado.codigo()
                + " | Prioridade: " + chamado.prioridade());
    }
}
```

---

## EmailClienteNotificador

Crie:

```text
src\br\com\curso\aula222\infra\notificacao\EmailClienteNotificador.java
```

Código:

```java
package br.com.curso.aula222.infra.notificacao;

import br.com.curso.aula222.aplicacao.port.ClienteNotificador;
import br.com.curso.aula222.dominio.chamado.Chamado;

public class EmailClienteNotificador implements ClienteNotificador {
    @Override
    public void notificarAbertura(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        System.out.println("[EMAIL] Cliente: " + chamado.cliente()
                + " | Chamado aberto: " + chamado.codigo());
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula222\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula222.infra.auditoria;

import br.com.curso.aula222.aplicacao.port.AuditoriaGateway;

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

## GeradorCodigoChamadoSequencial

Crie:

```text
src\br\com\curso\aula222\infra\codigo\GeradorCodigoChamadoSequencial.java
```

Código:

```java
package br.com.curso.aula222.infra.codigo;

import br.com.curso.aula222.aplicacao.port.GeradorCodigoChamado;

import java.time.LocalDate;

public class GeradorCodigoChamadoSequencial implements GeradorCodigoChamado {
    private int sequencia = 0;

    @Override
    public String gerar() {
        sequencia++;

        return "CH-" + LocalDate.now().getYear() + "-" + "%06d".formatted(sequencia);
    }
}
```

---

# Parte 10 — App refatorado

## AbrirChamadoRefatoradoApp

Crie:

```text
src\br\com\curso\aula222\app\AbrirChamadoRefatoradoApp.java
```

Código:

```java
package br.com.curso.aula222.app;

import br.com.curso.aula222.aplicacao.dto.AbrirChamadoRequest;
import br.com.curso.aula222.aplicacao.dto.AbrirChamadoResponse;
import br.com.curso.aula222.aplicacao.mapper.ChamadoResponseMapper;
import br.com.curso.aula222.aplicacao.prioridade.CalculadoraPrioridadeChamado;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoCritico;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoFinanceiro;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoNormal;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoTecnico;
import br.com.curso.aula222.aplicacao.usecase.AbrirChamadoUseCase;
import br.com.curso.aula222.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula222.infra.codigo.GeradorCodigoChamadoSequencial;
import br.com.curso.aula222.infra.notificacao.WhatsAppClienteNotificador;
import br.com.curso.aula222.infra.repository.ChamadoRepositoryMemoria;

import java.time.Instant;
import java.util.List;

public class AbrirChamadoRefatoradoApp {
    public static void main(String[] args) {
        AbrirChamadoUseCase useCase = new AbrirChamadoUseCase(
                new ChamadoRepositoryMemoria(),
                new WhatsAppClienteNotificador(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoChamadoSequencial(),
                new CalculadoraPrioridadeChamado(List.of(
                        new PrioridadeChamadoNormal(),
                        new PrioridadeChamadoCritico(),
                        new PrioridadeChamadoFinanceiro(),
                        new PrioridadeChamadoTecnico()
                )),
                new ChamadoResponseMapper()
        );

        AbrirChamadoRequest request = new AbrirChamadoRequest(
                "Ana Silva",
                "11999999999",
                "Sistema fora do ar",
                "CRITICO"
        );

        AbrirChamadoResponse response = useCase.executar(request, Instant.now());

        System.out.println();
        System.out.println("Response:");
        System.out.println(response);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula222.app.AbrirChamadoRefatoradoApp
```

---

# Parte 11 — Fake para teste

## ClienteNotificadorFake

Crie:

```text
src\br\com\curso\aula222\teste\ClienteNotificadorFake.java
```

Código:

```java
package br.com.curso.aula222.teste;

import br.com.curso.aula222.aplicacao.port.ClienteNotificador;
import br.com.curso.aula222.dominio.chamado.Chamado;

import java.util.ArrayList;
import java.util.List;

public class ClienteNotificadorFake implements ClienteNotificador {
    private final List<String> codigos = new ArrayList<>();

    @Override
    public void notificarAbertura(Chamado chamado) {
        if (chamado == null) {
            throw new IllegalArgumentException("Chamado é obrigatório.");
        }

        codigos.add(chamado.codigo());
    }

    public boolean foiNotificado(String codigo) {
        return codigos.contains(codigo);
    }

    public List<String> codigos() {
        return List.copyOf(codigos);
    }
}
```

---

## AuditoriaFakeGateway

Crie:

```text
src\br\com\curso\aula222\teste\AuditoriaFakeGateway.java
```

Código:

```java
package br.com.curso.aula222.teste;

import br.com.curso.aula222.aplicacao.port.AuditoriaGateway;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AuditoriaFakeGateway implements AuditoriaGateway {
    private final List<String> eventos = new ArrayList<>();

    @Override
    public void registrar(String evento, String detalhes, Instant ocorridoEm) {
        eventos.add(evento + " | " + detalhes + " | " + ocorridoEm);
    }

    public List<String> eventos() {
        return List.copyOf(eventos);
    }
}
```

---

## GeradorCodigoChamadoFixo

Crie:

```text
src\br\com\curso\aula222\teste\GeradorCodigoChamadoFixo.java
```

Código:

```java
package br.com.curso.aula222.teste;

import br.com.curso.aula222.aplicacao.port.GeradorCodigoChamado;

public class GeradorCodigoChamadoFixo implements GeradorCodigoChamado {
    private final String codigo;

    public GeradorCodigoChamadoFixo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
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

## AbrirChamadoFakeTestApp

Crie:

```text
src\br\com\curso\aula222\app\AbrirChamadoFakeTestApp.java
```

Código:

```java
package br.com.curso.aula222.app;

import br.com.curso.aula222.aplicacao.dto.AbrirChamadoRequest;
import br.com.curso.aula222.aplicacao.dto.AbrirChamadoResponse;
import br.com.curso.aula222.aplicacao.mapper.ChamadoResponseMapper;
import br.com.curso.aula222.aplicacao.prioridade.CalculadoraPrioridadeChamado;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoCritico;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoFinanceiro;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoNormal;
import br.com.curso.aula222.aplicacao.prioridade.PrioridadeChamadoTecnico;
import br.com.curso.aula222.aplicacao.usecase.AbrirChamadoUseCase;
import br.com.curso.aula222.infra.repository.ChamadoRepositoryMemoria;
import br.com.curso.aula222.teste.AuditoriaFakeGateway;
import br.com.curso.aula222.teste.ClienteNotificadorFake;
import br.com.curso.aula222.teste.GeradorCodigoChamadoFixo;

import java.time.Instant;
import java.util.List;

public class AbrirChamadoFakeTestApp {
    public static void main(String[] args) {
        ClienteNotificadorFake notificadorFake = new ClienteNotificadorFake();
        AuditoriaFakeGateway auditoriaFake = new AuditoriaFakeGateway();

        AbrirChamadoUseCase useCase = new AbrirChamadoUseCase(
                new ChamadoRepositoryMemoria(),
                notificadorFake,
                auditoriaFake,
                new GeradorCodigoChamadoFixo("CH-TESTE-000001"),
                new CalculadoraPrioridadeChamado(List.of(
                        new PrioridadeChamadoNormal(),
                        new PrioridadeChamadoCritico(),
                        new PrioridadeChamadoFinanceiro(),
                        new PrioridadeChamadoTecnico()
                )),
                new ChamadoResponseMapper()
        );

        AbrirChamadoRequest request = new AbrirChamadoRequest(
                "Carlos Souza",
                "11888888888",
                "Dúvida financeira",
                "FINANCEIRO"
        );

        AbrirChamadoResponse response = useCase.executar(
                request,
                Instant.parse("2026-07-09T12:00:00Z")
        );

        System.out.println(response);
        System.out.println("Foi notificado? " + notificadorFake.foiNotificado("CH-TESTE-000001"));
        System.out.println("Eventos: " + auditoriaFake.eventos());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula222.app.AbrirChamadoFakeTestApp
```

---

# Parte 12 — Antes e depois

## Antes

```text
ChamadoServiceRuim:
valida;
gera código;
calcula prioridade;
cria chamado em String;
salva em lista;
notifica;
audita;
monta response;
imprime.
```

## Depois

```text
Chamado:
domínio.

AbrirChamadoRequest:
entrada.

AbrirChamadoResponse:
saída.

ChamadoResponseMapper:
conversão.

ChamadoRepository:
porta de persistência.

ClienteNotificador:
porta de notificação.

AuditoriaGateway:
porta de auditoria.

GeradorCodigoChamado:
porta de geração de código.

PoliticaPrioridadeChamado:
contrato de prioridade.

CalculadoraPrioridadeChamado:
coordena políticas.

AbrirChamadoUseCase:
coordena caso de uso.

Infra:
implementa detalhes.

Teste fake:
simula dependências.
```

---

# Parte 13 — Como isso conversa com o front

Futuramente, o controller receberia algo como:

```json
{
  "cliente": "Ana Silva",
  "telefone": "11999999999",
  "descricao": "Sistema fora do ar",
  "tipo": "CRITICO"
}
```

Chamaria:

```java
useCase.executar(request, Instant.now())
```

E devolveria:

```json
{
  "codigo": "CH-2026-000001",
  "cliente": "Ana Silva",
  "status": "ABERTO",
  "tipo": "CRITICO",
  "prioridade": 100,
  "mensagem": "Chamado aberto com sucesso."
}
```

O front não precisa saber:

```text
se salvou em memória;
se salvou em banco;
se notificou por WhatsApp;
se notificou por e-mail;
se auditoria foi console;
se auditoria foi arquivo;
como prioridade foi calculada.
```

Ele conversa com o contrato.

Isso é o backend bem separado.

---

# Parte 14 — Refatoração guiada: roteiro mental

Quando encontrar uma classe grande, siga este roteiro:

```text
1. Liste tudo que a classe faz.
2. Agrupe por responsabilidade.
3. Identifique regras de domínio.
4. Extraia entidade ou método de domínio.
5. Identifique entrada e saída.
6. Crie DTOs se necessário.
7. Identifique dependências externas.
8. Crie ports para dependências externas.
9. Crie adapters concretos.
10. Identifique variações por tipo.
11. Crie políticas/estratégias.
12. Faça use case coordenar.
13. Monte dependências no App ou configuração.
14. Crie fake para teste.
```

---

# Parte 15 — Simulado técnico

## Questão 1

Uma classe que valida, salva, notifica, audita e monta response provavelmente viola:

```text
A) SRP.
B) Apenas UUID.
C) Apenas DateTimeFormatter.
D) Nenhum princípio.
```

---

## Questão 2

Um método com vários `if` por tipo de chamado, crescendo a cada novo tipo, indica possível violação de:

```text
A) OCP.
B) Apenas ISP.
C) Apenas try-with-resources.
D) Nenhum princípio.
```

---

## Questão 3

Uma implementação de repository retornar `null` onde o contrato promete `Optional` viola principalmente:

```text
A) LSP.
B) Apenas SRP.
C) Apenas CSV.
D) Nenhum princípio.
```

---

## Questão 4

Uma interface que obriga SMS a enviar anexo viola principalmente:

```text
A) ISP.
B) Apenas OCP.
C) Apenas LocalDate.
D) Nenhum princípio.
```

---

## Questão 5

Um use case criar `new WhatsAppClienteNotificador()` internamente viola principalmente:

```text
A) DIP.
B) Apenas record.
C) Apenas enum.
D) Nenhum princípio.
```

---

## Questão 6

Qual classe deve decidir se um chamado pode ser encerrado?

```text
A) Entidade Chamado.
B) Mapper.
C) Notificador.
D) AuditoriaGateway.
```

---

## Questão 7

Qual classe deve converter entidade para response?

```text
A) Mapper.
B) Repository.
C) Entidade obrigatoriamente.
D) Notificador.
```

---

## Questão 8

Qual classe deve coordenar o fluxo de abertura?

```text
A) Use case.
B) Entity enum.
C) DTO.
D) Interface de notificação.
```

---

## Questão 9

Qual item é exemplo de adapter?

```text
A) WhatsAppClienteNotificador.
B) AbrirChamadoRequest.
C) TipoChamado.
D) StatusChamado.
```

---

## Questão 10

Qual item é exemplo de port?

```text
A) ClienteNotificador.
B) WhatsAppClienteNotificador.
C) ChamadoServiceRuim.
D) System.out.println.
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
7. A
8. A
9. A
10. A
```

---

# Parte 16 — Perguntas discursivas

Responda com suas palavras.

## 1. Por que a classe ruim funcionava, mas era perigosa?

Resposta esperada:

```text
Porque entregava o resultado, mas misturava muitas responsabilidades, dificultando manutenção, teste e evolução.
```

---

## 2. Por que criar políticas de prioridade?

Resposta esperada:

```text
Para evitar if crescente e permitir adicionar novas prioridades por extensão, sem alterar a calculadora central.
```

---

## 3. Por que o use case depende de interfaces?

Resposta esperada:

```text
Para não ficar preso a detalhes de infraestrutura e permitir troca de implementação e teste com fakes.
```

---

## 4. Por que o front conversa com DTO e não com entidade?

Resposta esperada:

```text
Porque DTO representa contrato de entrada/saída da API, enquanto entidade representa regra de negócio interna.
```

---

## 5. Por que fake ajuda nos testes?

Resposta esperada:

```text
Porque permite simular dependências externas sem chamar infraestrutura real, como e-mail, banco, WhatsApp ou auditoria externa.
```

---

# Parte 17 — Desafio principal

## Adicionar novo tipo de chamado

Adicione:

```text
SEGURANCA
```

Prioridade:

```text
120
```

Passos:

```text
1. Adicionar SEGURANCA no enum TipoChamado.
2. Criar PrioridadeChamadoSeguranca.
3. Adicionar a nova política na lista do App.
4. Criar request com tipo SEGURANCA.
```

Critério:

```text
não alterar CalculadoraPrioridadeChamado;
não alterar AbrirChamadoUseCase;
não alterar ChamadoRepository;
não alterar ClienteNotificador;
não alterar AuditoriaGateway.
```

Isso valida OCP.

---

# Parte 18 — Desafio extra

## Criar EncerrarChamadoUseCase

Fluxo:

```text
recebe código;
busca chamado;
inicia atendimento;
encerra;
salva;
audita;
notifica;
retorna response.
```

Crie:

```text
EncerrarChamadoRequest;
EncerrarChamadoResponse;
EncerrarChamadoMapper;
EncerrarChamadoUseCase.
```

Regras:

```text
entidade decide transição;
use case coordena;
repository salva;
notificador notifica;
auditoria registra;
mapper monta response.
```

Critérios:

```text
sem new de infra dentro do use case;
sem regra de status no mapper;
sem notificação na entidade;
sem response dentro do repository.
```

---

# Parte 19 — Checklist final da aula

Marque mentalmente:

```text
[ ] Sei diagnosticar classe com responsabilidades demais.
[ ] Sei separar domínio, aplicação e infraestrutura.
[ ] Sei criar DTOs de request e response.
[ ] Sei criar mapper.
[ ] Sei criar ports.
[ ] Sei criar adapters.
[ ] Sei usar políticas para evitar if crescente.
[ ] Sei usar fake para teste.
[ ] Sei explicar SOLID em um fluxo real.
[ ] Sei explicar como o front consumiria o response.
```

---

## Registro rápido da aula

Responda:

```text
1. Onde SRP foi aplicado?
2. Onde OCP foi aplicado?
3. Onde LSP precisa ser respeitado?
4. Onde ISP foi aplicado?
5. Onde DIP foi aplicado?
6. Por que a classe ruim era perigosa?
7. Por que DTO não deve substituir entidade?
8. Por que use case não deve conhecer WhatsApp concreto?
9. Por que política de prioridade não deve salvar chamado?
10. Como esse fluxo vai virar controller futuramente?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar classe ruim;
separar responsabilidades;
criar use case limpo;
criar ports e adapters;
aplicar políticas extensíveis;
criar fake de teste;
explicar o papel de cada classe;
responder o simulado;
resolver o desafio de novo tipo;
resolver o desafio de encerramento.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-222-solid-revisao-tecnica-refatoracao-guiada-simulado
git commit -m "Aula 222: solid revisao tecnica refatoracao guiada simulado"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
SOLID é uma ferramenta prática para transformar código que apenas funciona em código que pode evoluir.
```

Você revisou:

```text
SRP;
OCP;
LSP;
ISP;
DIP;
refatoração guiada;
ports;
adapters;
use case;
DTO;
mapper;
políticas;
fake;
simulado.
```

Também reforçou a visão de integração:

```text
Front envia request.
Controller futuro recebe.
Use case coordena.
Entidade decide.
Ports conectam com infraestrutura.
Adapters executam detalhes.
Mapper devolve response.
Front exibe resultado.
```

Na próxima aula, vamos avançar para:

```text
Introdução a padrões de projeto no backend.
```

A ideia será entender por que padrões existem, quando usar, quando evitar e como eles se conectam com SOLID.
