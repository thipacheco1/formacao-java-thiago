# 216 — M9.02 — SRP: Single Responsibility Principle

## Objetivo da aula

Na aula anterior, você iniciou o Módulo 9 e estudou:

```text
o que é SOLID;
por que SOLID existe;
problemas que ele resolve;
coesão;
acoplamento;
código que funciona vs código que evolui;
visão geral de SRP, OCP, LSP, ISP e DIP.
```

Agora vamos estudar o primeiro princípio do SOLID:

```text
SRP — Single Responsibility Principle
```

Em português:

```text
Princípio da Responsabilidade Única
```

A frase clássica é:

```text
uma classe deve ter um único motivo para mudar.
```

Essa frase parece simples, mas é uma das mais importantes da engenharia de software.

Ao final desta aula, você deve conseguir:

```text
entender o que é SRP;
entender o que significa motivo para mudar;
identificar classes com responsabilidades demais;
separar regra de negócio, persistência, notificação, auditoria e formatação;
entender diferença entre classe pequena e classe coesa;
refatorar um service grande;
aplicar SRP em domínio, service, parser, gateway, mapper e app;
evitar classe Deus;
evitar service que faz tudo;
preparar base para OCP.
```

---

## Ideia principal

SRP não diz:

```text
uma classe só pode ter um método.
```

SRP diz:

```text
uma classe deve ter uma responsabilidade bem definida.
```

Ou seja:

```text
uma classe deve mudar por um motivo principal.
```

Exemplo:

```text
Pedido:
muda quando muda a regra do pedido.

PedidoCsvParser:
muda quando muda o formato CSV do pedido.

PedidoRepository:
muda quando muda a forma de salvar/buscar pedido.

PedidoNotificador:
muda quando muda a forma de notificar pedido.

PedidoFinalizacaoService:
muda quando muda o fluxo de finalização.
```

Cada classe tem um motivo principal para mudar.

Isso é SRP.

---

## O erro mais comum

O erro mais comum é pensar assim:

```text
Está tudo relacionado a pedido, então pode ficar tudo em PedidoService.
```

Exemplo:

```java
public class PedidoService {
    // valida pedido
    // calcula desconto
    // salva no banco
    // envia e-mail
    // gera CSV
    // registra auditoria
    // chama API externa
}
```

Tudo parece ser sobre pedido.

Mas existem vários motivos para mudar:

```text
mudou regra de desconto;
mudou banco;
mudou e-mail;
mudou CSV;
mudou auditoria;
mudou API externa;
mudou fluxo.
```

Logo, há responsabilidades diferentes misturadas.

---

## SRP e a frase do curso

A frase central continua:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

SRP fortalece essa separação.

Se uma classe recebe, coordena, salva, integra, formata, valida e decide regra, ela está acumulando responsabilidades.

Em backend profissional, essa mistura gera manutenção cara.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-216-srp-single-responsibility-principle
cd labs\m9\aula-216-srp-single-responsibility-principle
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula216
mkdir src\br\com\curso\aula216\app
mkdir src\br\com\curso\aula216\dominio
mkdir src\br\com\curso\aula216\dominio\pedido
mkdir src\br\com\curso\aula216\dto
mkdir src\br\com\curso\aula216\ruim
mkdir src\br\com\curso\aula216\srp
mkdir src\br\com\curso\aula216\srp\auditoria
mkdir src\br\com\curso\aula216\srp\desconto
mkdir src\br\com\curso\aula216\srp\mapper
mkdir src\br\com\curso\aula216\srp\notificacao
mkdir src\br\com\curso\aula216\srp\repository
mkdir src\br\com\curso\aula216\srp\service
```

---

# Parte 1 — Entendendo responsabilidade

## O que é responsabilidade

Responsabilidade é o papel principal de uma classe.

Pergunte:

```text
por que essa classe existe?
```

Se a resposta tiver muitos “e”, há sinal de problema.

Exemplo ruim:

```text
Essa classe existe para validar pedido, calcular desconto, salvar no banco, enviar e-mail e gerar relatório.
```

Muitos “e”.

Exemplo melhor:

```text
Essa classe existe para calcular desconto do pedido.
```

Responsabilidade clara.

---

## O que é motivo para mudar

Motivo para mudar é uma razão externa que obrigaria você a alterar a classe.

Exemplo:

```text
mudou regra de desconto;
mudou layout do CSV;
mudou banco de dados;
mudou canal de notificação;
mudou formato do response;
mudou regra de faturamento.
```

Se uma classe muda por muitos motivos, ela provavelmente fere SRP.

---

## Classe pequena não significa SRP

Uma classe pode ser pequena e ainda assim misturar responsabilidades.

Exemplo:

```java
public class ClienteUtil {
    public boolean emailValido(String email) {
        return email != null && email.contains("@");
    }

    public void salvarArquivo(String texto) {
        System.out.println("Salvando arquivo: " + texto);
    }
}
```

Poucos métodos.

Mas responsabilidades diferentes:

```text
validar e-mail;
salvar arquivo.
```

SRP não é sobre tamanho.

É sobre motivo para mudar.

---

## Classe grande nem sempre fere SRP

Uma classe pode ter vários métodos e ainda ser coesa.

Exemplo:

```text
Pedido:
faturar;
cancelar;
adicionarItem;
removerItem;
total;
pago;
cancelado.
```

Tudo relacionado ao comportamento do pedido.

Se todos os métodos giram em torno da mesma responsabilidade, pode estar ok.

---

# Parte 2 — Exemplo ruim

Vamos começar com uma classe propositalmente ruim.

## Pedido

Crie:

```text
src\br\com\curso\aula216\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula216.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private boolean pago;
    private boolean faturado;

    public Pedido(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm, boolean pago) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.criadoEm = criadoEm;
        this.pago = pago;
        this.faturado = false;
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

    public BigDecimal valor() {
        return valor;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public boolean pago() {
        return pago;
    }

    public boolean faturado() {
        return faturado;
    }

    public void faturar() {
        if (!pago) {
            throw new IllegalStateException("Pedido não pago não pode ser faturado: " + codigo);
        }

        if (faturado) {
            throw new IllegalStateException("Pedido já faturado: " + codigo);
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoProcessamentoRuimService

Crie:

```text
src\br\com\curso\aula216\ruim\PedidoProcessamentoRuimService.java
```

Código:

```java
package br.com.curso.aula216.ruim;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoProcessamentoRuimService {
    public void processar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.pago()) {
            throw new IllegalStateException("Pedido não está pago.");
        }

        BigDecimal desconto;
        if (pedido.valor().compareTo(new BigDecimal("1000.00")) >= 0) {
            desconto = pedido.valor().multiply(new BigDecimal("0.10"));
        } else {
            desconto = BigDecimal.ZERO;
        }

        BigDecimal valorFinal = pedido.valor().subtract(desconto);

        pedido.faturar();

        System.out.println("Salvando pedido no banco: " + pedido.codigo());
        System.out.println("Enviando e-mail para cliente: " + pedido.cliente());
        System.out.println("Registrando auditoria em: " + Instant.now());
        System.out.println("Montando response: " + pedido.codigo() + ";" + valorFinal + ";" + pedido.faturado());
        System.out.println("Processamento finalizado.");
    }
}
```

---

## PedidoProcessamentoRuimApp

Crie:

```text
src\br\com\curso\aula216\app\PedidoProcessamentoRuimApp.java
```

Código:

```java
package br.com.curso.aula216.app;

import br.com.curso.aula216.dominio.pedido.Pedido;
import br.com.curso.aula216.ruim.PedidoProcessamentoRuimService;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoProcessamentoRuimApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                Instant.now(),
                true
        );

        PedidoProcessamentoRuimService service = new PedidoProcessamentoRuimService();

        service.processar(pedido);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula216.app.PedidoProcessamentoRuimApp
```

---

## Diagnóstico da classe ruim

A classe faz:

```text
validação de entrada;
verificação de pagamento;
cálculo de desconto;
faturamento;
persistência simulada;
notificação simulada;
auditoria;
montagem de response;
impressão no console.
```

Ela muda se mudar:

```text
regra de desconto;
regra de faturamento;
banco;
notificação;
auditoria;
formato de response;
forma de saída.
```

Muitos motivos para mudar.

Isso fere SRP.

---

# Parte 3 — Refatorando com SRP

Agora vamos separar responsabilidades.

O objetivo não é criar abstrações avançadas ainda.

O objetivo é dar um motivo claro para cada classe existir.

---

## CalculadoraDescontoPedido

Crie:

```text
src\br\com\curso\aula216\srp\desconto\CalculadoraDescontoPedido.java
```

Código:

```java
package br.com.curso.aula216.srp.desconto;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class CalculadoraDescontoPedido {
    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.valor().compareTo(new BigDecimal("1000.00")) >= 0) {
            return pedido.valor().multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }
}
```

Responsabilidade:

```text
calcular desconto de pedido.
```

Motivo para mudar:

```text
mudou regra de desconto.
```

---

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula216\srp\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula216.srp.repository;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria {
    private final List<Pedido> pedidos = new ArrayList<>();

    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.id().equals(pedido.id()));
        pedidos.add(pedido);
    }

    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }

    public List<Pedido> listar() {
        return List.copyOf(pedidos);
    }
}
```

Responsabilidade:

```text
armazenar e buscar pedidos em memória.
```

Motivo para mudar:

```text
mudou forma de persistência em memória.
```

---

## PedidoNotificadorEmail

Crie:

```text
src\br\com\curso\aula216\srp\notificacao\PedidoNotificadorEmail.java
```

Código:

```java
package br.com.curso.aula216.srp.notificacao;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class PedidoNotificadorEmail {
    public void notificarFaturamento(Pedido pedido, BigDecimal valorFinal) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (valorFinal == null) {
            throw new IllegalArgumentException("Valor final é obrigatório.");
        }

        System.out.println("E-mail enviado para " + pedido.cliente()
                + ": pedido " + pedido.codigo()
                + " faturado no valor final " + valorFinal);
    }
}
```

Responsabilidade:

```text
notificar faturamento por e-mail.
```

Motivo para mudar:

```text
mudou conteúdo ou canal de e-mail.
```

---

## AuditoriaPedidoService

Crie:

```text
src\br\com\curso\aula216\srp\auditoria\AuditoriaPedidoService.java
```

Código:

```java
package br.com.curso.aula216.srp.auditoria;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

public class AuditoriaPedidoService {
    private final List<String> eventos = new ArrayList<>();

    public void registrarFaturamento(Pedido pedido, BigDecimalResumo valorFinal, Instant agora) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (valorFinal == null) {
            throw new IllegalArgumentException("Valor final é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        String evento = new StringJoiner(" | ")
                .add(UUID.randomUUID().toString())
                .add("PEDIDO_FATURADO")
                .add(pedido.codigo())
                .add(valorFinal.valor())
                .add(agora.toString())
                .toString();

        eventos.add(evento);

        System.out.println("Auditoria registrada: " + evento);
    }

    public List<String> listar() {
        return List.copyOf(eventos);
    }

    public record BigDecimalResumo(String valor) {
        public BigDecimalResumo {
            if (valor == null || valor.isBlank()) {
                throw new IllegalArgumentException("Valor é obrigatório.");
            }
        }
    }
}
```

---

## Observação sobre BigDecimalResumo

Esse record foi usado apenas para simplificar o exemplo textual de auditoria.

Mas a versão acima ficou artificial.

Vamos melhorar.

Substitua `AuditoriaPedidoService` por esta versão mais direta:

```java
package br.com.curso.aula216.srp.auditoria;

import br.com.curso.aula216.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

public class AuditoriaPedidoService {
    private final List<String> eventos = new ArrayList<>();

    public void registrarFaturamento(Pedido pedido, BigDecimal valorFinal, Instant agora) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (valorFinal == null) {
            throw new IllegalArgumentException("Valor final é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        String evento = new StringJoiner(" | ")
                .add(UUID.randomUUID().toString())
                .add("PEDIDO_FATURADO")
                .add(pedido.codigo())
                .add(valorFinal.toString())
                .add(agora.toString())
                .toString();

        eventos.add(evento);

        System.out.println("Auditoria registrada: " + evento);
    }

    public List<String> listar() {
        return List.copyOf(eventos);
    }
}
```

Responsabilidade:

```text
registrar auditoria de pedido.
```

Motivo para mudar:

```text
mudou formato ou regra de auditoria.
```

---

# Parte 4 — DTO e Mapper

## PedidoFaturamentoResponse

Crie:

```text
src\br\com\curso\aula216\dto\PedidoFaturamentoResponse.java
```

Código:

```java
package br.com.curso.aula216.dto;

public record PedidoFaturamentoResponse(
        String codigo,
        String cliente,
        String valorOriginal,
        String valorFinal,
        boolean faturado
) {
}
```

---

## PedidoFaturamentoMapper

Crie:

```text
src\br\com\curso\aula216\srp\mapper\PedidoFaturamentoMapper.java
```

Código:

```java
package br.com.curso.aula216.srp.mapper;

import br.com.curso.aula216.dominio.pedido.Pedido;
import br.com.curso.aula216.dto.PedidoFaturamentoResponse;

import java.math.BigDecimal;

public class PedidoFaturamentoMapper {
    public PedidoFaturamentoResponse toResponse(Pedido pedido, BigDecimal valorFinal) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (valorFinal == null) {
            throw new IllegalArgumentException("Valor final é obrigatório.");
        }

        return new PedidoFaturamentoResponse(
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor().toString(),
                valorFinal.toString(),
                pedido.faturado()
        );
    }
}
```

Responsabilidade:

```text
converter dados de faturamento em response.
```

Motivo para mudar:

```text
mudou formato de saída.
```

---

# Parte 5 — Service coordenador

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula216\srp\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula216.srp.service;

import br.com.curso.aula216.dominio.pedido.Pedido;
import br.com.curso.aula216.dto.PedidoFaturamentoResponse;
import br.com.curso.aula216.srp.auditoria.AuditoriaPedidoService;
import br.com.curso.aula216.srp.desconto.CalculadoraDescontoPedido;
import br.com.curso.aula216.srp.mapper.PedidoFaturamentoMapper;
import br.com.curso.aula216.srp.notificacao.PedidoNotificadorEmail;
import br.com.curso.aula216.srp.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoFaturamentoService {
    private final PedidoRepositoryMemoria repository;
    private final CalculadoraDescontoPedido calculadoraDesconto;
    private final PedidoNotificadorEmail notificador;
    private final AuditoriaPedidoService auditoria;
    private final PedidoFaturamentoMapper mapper;

    public PedidoFaturamentoService(
            PedidoRepositoryMemoria repository,
            CalculadoraDescontoPedido calculadoraDesconto,
            PedidoNotificadorEmail notificador,
            AuditoriaPedidoService auditoria,
            PedidoFaturamentoMapper mapper
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (calculadoraDesconto == null) {
            throw new IllegalArgumentException("Calculadora de desconto é obrigatória.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        if (mapper == null) {
            throw new IllegalArgumentException("Mapper é obrigatório.");
        }

        this.repository = repository;
        this.calculadoraDesconto = calculadoraDesconto;
        this.notificador = notificador;
        this.auditoria = auditoria;
        this.mapper = mapper;
    }

    public PedidoFaturamentoResponse faturar(String codigoPedido, Instant agora) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        BigDecimal desconto = calculadoraDesconto.calcular(pedido);
        BigDecimal valorFinal = pedido.valor().subtract(desconto);

        pedido.faturar();

        repository.salvar(pedido);
        notificador.notificarFaturamento(pedido, valorFinal);
        auditoria.registrarFaturamento(pedido, valorFinal, agora);

        return mapper.toResponse(pedido, valorFinal);
    }
}
```

Responsabilidade:

```text
coordenar o caso de uso de faturamento.
```

Motivo para mudar:

```text
mudou o fluxo de faturamento.
```

Note que ele coordena, mas não implementa tudo.

---

## PedidoFaturamentoServiceApp

Crie:

```text
src\br\com\curso\aula216\app\PedidoFaturamentoServiceApp.java
```

Código:

```java
package br.com.curso.aula216.app;

import br.com.curso.aula216.dominio.pedido.Pedido;
import br.com.curso.aula216.dto.PedidoFaturamentoResponse;
import br.com.curso.aula216.srp.auditoria.AuditoriaPedidoService;
import br.com.curso.aula216.srp.desconto.CalculadoraDescontoPedido;
import br.com.curso.aula216.srp.mapper.PedidoFaturamentoMapper;
import br.com.curso.aula216.srp.notificacao.PedidoNotificadorEmail;
import br.com.curso.aula216.srp.repository.PedidoRepositoryMemoria;
import br.com.curso.aula216.srp.service.PedidoFaturamentoService;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFaturamentoServiceApp {
    public static void main(String[] args) {
        PedidoRepositoryMemoria repository = new PedidoRepositoryMemoria();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                Instant.now(),
                true
        );

        repository.salvar(pedido);

        PedidoFaturamentoService service = new PedidoFaturamentoService(
                repository,
                new CalculadoraDescontoPedido(),
                new PedidoNotificadorEmail(),
                new AuditoriaPedidoService(),
                new PedidoFaturamentoMapper()
        );

        PedidoFaturamentoResponse response = service.faturar("PED-001", Instant.now());

        System.out.println(response);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula216.app.PedidoFaturamentoServiceApp
```

---

# Parte 6 — Comparando ruim vs SRP

## Classe ruim

```text
PedidoProcessamentoRuimService
```

Fazia:

```text
desconto;
faturamento;
persistência;
notificação;
auditoria;
response;
console.
```

Muitos motivos para mudar.

---

## Versão SRP

```text
Pedido:
regra de faturamento.

CalculadoraDescontoPedido:
regra de desconto.

PedidoRepositoryMemoria:
persistência em memória.

PedidoNotificadorEmail:
notificação.

AuditoriaPedidoService:
auditoria.

PedidoFaturamentoMapper:
response.

PedidoFaturamentoService:
coordenação do fluxo.
```

Cada classe tem uma responsabilidade mais clara.

---

## Importante

SRP não significa que o service não faz nada.

O service coordena.

Coordenação é responsabilidade.

O erro é o service coordenar e também implementar todos os detalhes.

---

# Parte 7 — O que melhora com SRP

## 1. Leitura

Fica mais fácil entender onde procurar.

Problema no desconto?

```text
CalculadoraDescontoPedido.
```

Problema no response?

```text
PedidoFaturamentoMapper.
```

Problema na regra de faturamento?

```text
Pedido.
```

---

## 2. Teste

Fica mais fácil testar partes isoladas:

```text
teste da entidade Pedido;
teste da calculadora de desconto;
teste do mapper;
teste do service coordenador.
```

---

## 3. Mudança

Se mudar e-mail, você mexe no notificador.

Se mudar auditoria, você mexe na auditoria.

Se mudar desconto, você mexe na calculadora.

Menor risco de quebrar tudo.

---

## 4. Reuso

A `CalculadoraDescontoPedido` pode ser usada em:

```text
prévia de pedido;
faturamento;
relatório;
simulação.
```

Sem depender do service inteiro.

---

## 5. Menor acoplamento conceitual

Mesmo sem interfaces ainda, já existe melhor separação mental.

Nas próximas aulas, OCP e DIP vão melhorar isso ainda mais.

---

# Parte 8 — SRP na prática do backend

## Controller

Responsabilidade:

```text
receber requisição;
validar entrada básica;
chamar use case;
traduzir resposta;
traduzir erro.
```

Controller não deve:

```text
calcular regra;
salvar diretamente;
chamar API externa diretamente;
parsear CSV complexo;
gerar relatório completo.
```

---

## Service / Use case

Responsabilidade:

```text
coordenar um caso de uso.
```

Exemplo:

```text
FaturarPedidoService;
ReagendarOrdemServicoService;
ImportarProdutosService;
CriarContratoService.
```

Service não deve virar:

```text
classe Deus.
```

---

## Entidade

Responsabilidade:

```text
proteger regra do negócio.
```

Exemplo:

```java
pedido.faturar();
ordemServico.reagendar(novaData, hoje);
contrato.vigenteEm(hoje);
produto.baixarEstoque(quantidade);
```

---

## Repository

Responsabilidade:

```text
salvar e buscar dados.
```

Não deve decidir regra de negócio.

---

## Client/Gateway

Responsabilidade:

```text
integrar com mundo externo.
```

Exemplo:

```text
PagamentoClient;
MensageriaClient;
ArquivoCsvGateway;
CepClient.
```

---

## Mapper

Responsabilidade:

```text
converter entre objetos.
```

Exemplo:

```text
entidade -> response;
request -> command;
entidade -> linha CSV;
linha CSV -> objeto intermediário.
```

---

# Parte 9 — Sinais de violação de SRP

Fique atento quando uma classe:

```text
tem nome genérico demais;
tem muitos métodos sem relação;
tem comentários separando blocos grandes;
tem muitos imports de coisas diferentes;
usa banco, arquivo, HTTP, regra e console juntos;
muda por vários motivos;
é difícil de testar;
é difícil de explicar em uma frase;
tem mais de uma responsabilidade de negócio;
usa muitos ifs de fluxos diferentes;
tem métodos privados demais tentando esconder bagunça.
```

Exemplos de nomes suspeitos:

```text
PedidoManager;
SistemaService;
GeralUtil;
ProcessadorTudo;
OperacaoService;
Helper;
MainService;
CadastroService gigante.
```

Nome suspeito não é prova de erro, mas é alerta.

---

# Parte 10 — Perguntas para aplicar SRP

Quando revisar uma classe, pergunte:

```text
1. Por que essa classe existe?
2. Consigo explicar em uma frase?
3. Ela muda por mais de um motivo?
4. Ela mistura regra com infraestrutura?
5. Ela imprime, salva, calcula e formata?
6. Algum método parece pertencer a outra classe?
7. Os imports indicam responsabilidades demais?
8. Eu consigo testar essa classe isoladamente?
9. Se mudar o formato de saída, preciso mexer na regra?
10. Se mudar a regra, preciso mexer na infraestrutura?
```

Essas perguntas ajudam muito no dia a dia.

---

# Parte 11 — Exemplo com CSV

No Módulo 8, você fez importações CSV.

Aplicando SRP:

```text
ArquivoCsvGateway:
lê arquivo.

CsvSimples:
separa colunas.

CabecalhoCsv:
valida cabeçalho.

ProdutoCsvParser:
converte linha para Produto.

Produto:
valida regra do produto.

ProdutoImportacaoService:
coordena importação.

ResultadoImportacao:
guarda válidos e erros.

RelatorioImportacaoService:
exporta relatório.

App:
imprime resultado.
```

Se tudo isso estivesse em uma classe só, o sistema funcionaria.

Mas seria ruim para evoluir.

---

# Parte 12 — Exemplo com datas

Aplicando SRP:

```text
Token:
decide se está expirado.

TokenMapper:
formata data para response.

TokenService:
coordena criação e validação.

AuditoriaService:
registra evento.

DateTimeFormatter:
fica no mapper/parser.
```

Não misture:

```text
entidade formatando tela;
mapper decidindo regra;
service parseando tudo e salvando arquivo;
repository calculando expiração.
```

---

# Parte 13 — SRP não exige perfeição imediata

Na prática, você nem sempre vai acertar de primeira.

Um bom caminho:

```text
1. Faça funcionar.
2. Identifique responsabilidades misturadas.
3. Extraia classes com nomes claros.
4. Verifique motivos para mudar.
5. Escreva testes.
6. Refatore de novo quando necessário.
```

SRP é um processo de melhoria contínua.

Não é decoração.

---

# Parte 14 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula216.app.PedidoProcessamentoRuimApp
java -cp out br.com.curso.aula216.app.PedidoFaturamentoServiceApp
```

Depois responda:

```text
1. Quais responsabilidades estavam misturadas na classe ruim?
2. Quais classes foram extraídas?
3. Qual classe decide faturamento?
4. Qual classe calcula desconto?
5. Qual classe salva?
6. Qual classe notifica?
7. Qual classe audita?
8. Qual classe monta response?
9. Qual classe coordena?
10. Qual delas mudaria se o layout do response mudasse?
```

---

# Parte 15 — Exercício prático

## Contexto

Você vai aplicar SRP em um fluxo de Ordem de Serviço.

---

## Classe ruim imaginada

```java
public class OrdemServicoServiceRuim {
    public void reagendar(String codigo, String novaData) {
        // valida código
        // parseia data
        // busca OS
        // valida status
        // altera data
        // salva
        // notifica cliente
        // registra auditoria
        // monta response
        // imprime
    }
}
```

---

## Sua tarefa

Crie a versão separada.

Estrutura sugerida:

```text
dominio/ordemservico/OrdemServico.java

srp/parser/DataAgendamentoParser.java
srp/repository/OrdemServicoRepositoryMemoria.java
srp/notificacao/OrdemServicoNotificador.java
srp/auditoria/AuditoriaOrdemServicoService.java
srp/mapper/ReagendamentoMapper.java
srp/service/OrdemServicoReagendamentoService.java
dto/ReagendamentoResponse.java
```

---

## Responsabilidades esperadas

```text
OrdemServico:
decide se pode reagendar.

DataAgendamentoParser:
converte String para LocalDate.

Repository:
busca e salva OS.

Notificador:
notifica cliente.

Auditoria:
registra evento.

Mapper:
monta response.

Service:
coordena o caso de uso.
```

---

## Regras da entidade OrdemServico

Campos:

```text
String codigo;
String cliente;
String status;
LocalDate dataAgendada;
```

Método:

```java
void reagendar(LocalDate novaData, LocalDate hoje)
```

Regras:

```text
novaData obrigatória;
hoje obrigatório;
novaData não pode estar no passado;
CONCLUIDA não pode reagendar;
CANCELADA não pode reagendar;
status vira REAGENDADA.
```

---

## Critérios

```text
service não deve parsear data diretamente;
service não deve imprimir;
entidade não deve notificar;
repository não deve validar regra de reagendamento;
mapper não deve salvar;
notificador não deve alterar OS;
auditoria não deve calcular regra;
cada classe deve ter motivo claro para mudar.
```

---

# Parte 16 — Desafio extra

## Refatoração do Módulo 8

Pegue qualquer exercício do Módulo 8 de importação CSV e analise:

```text
o parser faz só parsing?
o gateway faz só I/O?
o service faz só coordenação?
a entidade faz só regra?
o relatório está separado?
a auditoria está separada?
o app só executa e imprime?
```

Se encontrar uma classe com responsabilidades demais, refatore.

---

# Parte 17 — Simulado rápido

## Questão 1

SRP significa:

```text
A) Uma classe deve ter um único motivo para mudar.
B) Uma classe deve ter um único método.
C) Uma aplicação deve ter uma única classe.
D) Toda classe deve ser static.
```

---

## Questão 2

Classe coesa é aquela que:

```text
A) Tem responsabilidades relacionadas e propósito claro.
B) Faz tudo em um lugar só.
C) Tem muitos imports.
D) Usa apenas métodos privados.
```

---

## Questão 3

Qual classe deveria calcular desconto?

```text
A) CalculadoraDescontoPedido.
B) PedidoRepository.
C) Controller.
D) AuditoriaService.
```

---

## Questão 4

Qual classe deveria registrar evento de auditoria?

```text
A) AuditoriaPedidoService.
B) Pedido.
C) DateTimeFormatter.
D) Produto.
```

---

## Questão 5

Se mudar o formato do response, qual classe deveria mudar?

```text
A) Mapper/Response.
B) Entidade obrigatoriamente.
C) Repository obrigatoriamente.
D) Calculadora de desconto.
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

# Parte 18 — Checklist SRP

Marque mentalmente:

```text
[ ] Sei explicar SRP.
[ ] Sei que SRP não significa um método por classe.
[ ] Sei identificar motivos para mudar.
[ ] Sei identificar classe com responsabilidade demais.
[ ] Sei separar cálculo, persistência, notificação, auditoria e mapper.
[ ] Sei que service coordena.
[ ] Sei que entidade decide regra.
[ ] Sei que parser converte.
[ ] Sei que gateway faz I/O.
[ ] Sei que mapper monta saída.
[ ] Sei que app imprime.
[ ] Sei que SRP melhora testes.
[ ] Sei que SRP prepara o OCP.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é SRP?
2. O que significa motivo para mudar?
3. Por que classe pequena pode ferir SRP?
4. Por que service não deve fazer tudo?
5. O que o mapper deve fazer?
6. O que o repository deve fazer?
7. O que a entidade deve fazer?
8. O que o parser deve fazer?
9. O que o gateway deve fazer?
10. Como SRP melhora manutenção?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar SRP;
identificar responsabilidade misturada;
identificar motivos para mudar;
refatorar uma classe grande;
separar cálculo de desconto;
separar repository;
separar notificação;
separar auditoria;
separar mapper;
manter entidade com regra;
manter service coordenando;
resolver o desafio de Ordem de Serviço;
preparar-se para OCP.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-216-srp-single-responsibility-principle
git commit -m "Aula 216: srp single responsibility principle"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
uma classe deve ter uma responsabilidade clara e um motivo principal para mudar.
```

Você estudou:

```text
SRP;
motivo para mudar;
responsabilidade;
coesão;
classe Deus;
service que faz tudo;
separação de domínio, service, repository, notificador, auditoria e mapper;
refatoração de uma classe ruim;
aplicação prática no backend.
```

Também reforçou:

```text
a entidade decide;
o service coordena;
o repository salva;
o client integra;
o controller recebe.
```

Na próxima aula, vamos estudar o segundo princípio:

```text
OCP — Open/Closed Principle.
```

A ideia será entender como adicionar comportamento novo sem ficar alterando código antigo a cada mudança.
