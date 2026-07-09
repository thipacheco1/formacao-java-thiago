# 217 — M9.03 — OCP: Open/Closed Principle

## Objetivo da aula

Na aula anterior, você estudou o primeiro princípio do SOLID:

```text
SRP — Single Responsibility Principle
```

Você viu que:

```text
uma classe deve ter uma responsabilidade clara;
uma classe deve ter um motivo principal para mudar;
service coordena;
entidade decide;
repository salva;
mapper converte;
gateway integra;
app executa.
```

Agora vamos estudar o segundo princípio:

```text
OCP — Open/Closed Principle
```

Em português:

```text
Princípio do Aberto/Fechado
```

A frase clássica é:

```text
entidades de software devem estar abertas para extensão, mas fechadas para modificação.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é OCP;
entender aberto para extensão;
entender fechado para modificação;
identificar if/switch crescendo por tipo;
refatorar regra baseada em tipo usando polimorfismo;
criar interfaces de estratégia;
criar implementações específicas;
adicionar comportamento novo sem alterar código central;
entender relação entre OCP e SRP;
evitar abstração prematura;
aplicar OCP em desconto, notificação e exportação;
preparar base para LSP.
```

---

## Ideia principal

OCP não significa que você nunca vai alterar código.

Isso seria impossível.

OCP significa que partes estáveis do sistema devem ser projetadas para aceitar novos comportamentos por extensão, sem precisar alterar o núcleo toda vez.

Exemplo ruim:

```java
if ("VIP".equals(tipoCliente)) {
    // desconto VIP
} else if ("PREMIUM".equals(tipoCliente)) {
    // desconto Premium
} else if ("BLACK".equals(tipoCliente)) {
    // desconto Black
}
```

Toda vez que entra novo tipo, você altera o método.

Exemplo melhor:

```text
PoliticaDesconto
DescontoClienteVip
DescontoClientePremium
DescontoClienteBlack
CalculadoraDesconto
```

A calculadora usa uma lista de políticas.

Para criar uma nova regra, você cria uma nova classe.

O código central muda menos.

---

## OCP em uma frase prática

```text
Quando uma nova variação aparece, prefira adicionar uma nova implementação em vez de alterar uma classe cheia de if.
```

Mas atenção:

```text
não crie abstração antes de existir variação real ou provável.
```

OCP é poderoso, mas aplicado cedo demais vira complexidade desnecessária.

---

## Relação entre SRP e OCP

SRP ajuda a separar responsabilidades.

OCP ajuda a estender comportamentos sem alterar o núcleo.

Exemplo:

```text
SRP:
separe cálculo de desconto em uma classe própria.

OCP:
permita criar novas políticas de desconto sem alterar a calculadora principal.
```

Eles se complementam.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com OCP:

```text
A entidade decide o que é regra essencial dela.
O use case coordena usando contratos.
As variações entram por implementações.
O núcleo não precisa conhecer cada detalhe novo.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-217-ocp-open-closed-principle
cd labs\m9\aula-217-ocp-open-closed-principle
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula217
mkdir src\br\com\curso\aula217\app
mkdir src\br\com\curso\aula217\dominio
mkdir src\br\com\curso\aula217\dominio\pedido
mkdir src\br\com\curso\aula217\dto
mkdir src\br\com\curso\aula217\ruim
mkdir src\br\com\curso\aula217\ocp
mkdir src\br\com\curso\aula217\ocp\desconto
mkdir src\br\com\curso\aula217\ocp\notificacao
mkdir src\br\com\curso\aula217\ocp\exportacao
mkdir src\br\com\curso\aula217\ocp\service
```

---

# Parte 1 — Entendendo aberto e fechado

## Aberto para extensão

Aberto para extensão significa:

```text
consigo adicionar comportamento novo.
```

Exemplo:

```text
novo tipo de desconto;
novo canal de notificação;
novo formato de relatório;
nova regra de cálculo;
novo validador;
novo processador;
nova integração.
```

---

## Fechado para modificação

Fechado para modificação significa:

```text
não preciso ficar alterando o código central já testado para cada nova variação.
```

Exemplo:

```text
CalculadoraDesconto não precisa ganhar mais um if.
NotificadorService não precisa ganhar mais um else.
ExportadorService não precisa ganhar mais um switch.
```

---

## OCP não é proibição absoluta de alteração

Você ainda altera código quando:

```text
regra existente mudou;
bug precisa ser corrigido;
contrato precisa evoluir;
modelo estava errado;
abstração precisa ser melhorada;
dependências precisam ser configuradas.
```

O foco do OCP é reduzir alterações repetitivas causadas por novas variações.

---

# Parte 2 — Exemplo ruim com desconto

## Pedido

Crie:

```text
src\br\com\curso\aula217\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula217.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String tipoCliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private boolean pago;
    private boolean faturado;

    public Pedido(
            UUID id,
            String codigo,
            String cliente,
            String tipoCliente,
            BigDecimal valor,
            Instant criadoEm,
            boolean pago
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

        if (tipoCliente == null || tipoCliente.isBlank()) {
            throw new IllegalArgumentException("Tipo do cliente é obrigatório.");
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
        this.tipoCliente = tipoCliente.trim().toUpperCase();
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

    public String tipoCliente() {
        return tipoCliente;
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
                + " | Tipo: " + tipoCliente
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

## CalculadoraDescontoRuim

Crie:

```text
src\br\com\curso\aula217\ruim\CalculadoraDescontoRuim.java
```

Código:

```java
package br.com.curso.aula217.ruim;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class CalculadoraDescontoRuim {
    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if ("COMUM".equals(pedido.tipoCliente())) {
            return BigDecimal.ZERO;
        }

        if ("VIP".equals(pedido.tipoCliente())) {
            return pedido.valor().multiply(new BigDecimal("0.10"));
        }

        if ("PREMIUM".equals(pedido.tipoCliente())) {
            return pedido.valor().multiply(new BigDecimal("0.20"));
        }

        if ("BLACK".equals(pedido.tipoCliente())) {
            return pedido.valor().multiply(new BigDecimal("0.30"));
        }

        return BigDecimal.ZERO;
    }
}
```

---

## CalculadoraDescontoRuimApp

Crie:

```text
src\br\com\curso\aula217\app\CalculadoraDescontoRuimApp.java
```

Código:

```java
package br.com.curso.aula217.app;

import br.com.curso.aula217.dominio.pedido.Pedido;
import br.com.curso.aula217.ruim.CalculadoraDescontoRuim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CalculadoraDescontoRuimApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                criarPedido("PED-001", "Ana", "COMUM", "500.00"),
                criarPedido("PED-002", "Carlos", "VIP", "1500.00"),
                criarPedido("PED-003", "Maria", "PREMIUM", "2000.00"),
                criarPedido("PED-004", "Bruna", "BLACK", "3000.00")
        );

        CalculadoraDescontoRuim calculadora = new CalculadoraDescontoRuim();

        for (Pedido pedido : pedidos) {
            BigDecimal desconto = calculadora.calcular(pedido);

            System.out.println(pedido.codigo()
                    + " | Tipo: " + pedido.tipoCliente()
                    + " | Desconto: " + desconto);
        }
    }

    private static Pedido criarPedido(String codigo, String cliente, String tipo, String valor) {
        return new Pedido(
                UUID.randomUUID(),
                codigo,
                cliente,
                tipo,
                new BigDecimal(valor),
                Instant.now(),
                true
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula217.app.CalculadoraDescontoRuimApp
```

---

## O problema

Se entrar um novo tipo de cliente:

```text
PARCEIRO
```

você precisa alterar:

```java
CalculadoraDescontoRuim
```

Se entrar:

```text
FUNCIONARIO
CAMPANHA
B2B
BLACK_FRIDAY
```

o método vai crescer.

Isso fere OCP.

A calculadora não está fechada para modificação.

---

# Parte 3 — Refatorando desconto com OCP

## Estratégia

Vamos criar uma interface:

```text
PoliticaDesconto
```

Cada regra de desconto será uma implementação.

A calculadora principal usará uma lista de políticas.

Quando surgir nova regra, criamos nova classe.

---

## PoliticaDesconto

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\PoliticaDesconto.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public interface PoliticaDesconto {
    boolean aplica(Pedido pedido);

    BigDecimal calcular(Pedido pedido);

    String nome();
}
```

---

## DescontoClienteComum

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\DescontoClienteComum.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoClienteComum implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "COMUM".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return BigDecimal.ZERO;
    }

    @Override
    public String nome() {
        return "Desconto cliente comum";
    }
}
```

---

## DescontoClienteVip

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\DescontoClienteVip.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoClienteVip implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "VIP".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return pedido.valor().multiply(new BigDecimal("0.10"));
    }

    @Override
    public String nome() {
        return "Desconto cliente VIP";
    }
}
```

---

## DescontoClientePremium

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\DescontoClientePremium.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoClientePremium implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "PREMIUM".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return pedido.valor().multiply(new BigDecimal("0.20"));
    }

    @Override
    public String nome() {
        return "Desconto cliente Premium";
    }
}
```

---

## DescontoClienteBlack

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\DescontoClienteBlack.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoClienteBlack implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "BLACK".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return pedido.valor().multiply(new BigDecimal("0.30"));
    }

    @Override
    public String nome() {
        return "Desconto cliente Black";
    }
}
```

---

## CalculadoraDescontoOcp

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\CalculadoraDescontoOcp.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;

public class CalculadoraDescontoOcp {
    private final List<PoliticaDesconto> politicas;

    public CalculadoraDescontoOcp(List<PoliticaDesconto> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas de desconto são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return politicas.stream()
                .filter(politica -> politica.aplica(pedido))
                .findFirst()
                .map(politica -> politica.calcular(pedido))
                .orElse(BigDecimal.ZERO);
    }
}
```

---

## CalculadoraDescontoOcpApp

Crie:

```text
src\br\com\curso\aula217\app\CalculadoraDescontoOcpApp.java
```

Código:

```java
package br.com.curso.aula217.app;

import br.com.curso.aula217.dominio.pedido.Pedido;
import br.com.curso.aula217.ocp.desconto.CalculadoraDescontoOcp;
import br.com.curso.aula217.ocp.desconto.DescontoClienteBlack;
import br.com.curso.aula217.ocp.desconto.DescontoClienteComum;
import br.com.curso.aula217.ocp.desconto.DescontoClientePremium;
import br.com.curso.aula217.ocp.desconto.DescontoClienteVip;
import br.com.curso.aula217.ocp.desconto.PoliticaDesconto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CalculadoraDescontoOcpApp {
    public static void main(String[] args) {
        List<PoliticaDesconto> politicas = List.of(
                new DescontoClienteComum(),
                new DescontoClienteVip(),
                new DescontoClientePremium(),
                new DescontoClienteBlack()
        );

        CalculadoraDescontoOcp calculadora = new CalculadoraDescontoOcp(politicas);

        List<Pedido> pedidos = List.of(
                criarPedido("PED-001", "Ana", "COMUM", "500.00"),
                criarPedido("PED-002", "Carlos", "VIP", "1500.00"),
                criarPedido("PED-003", "Maria", "PREMIUM", "2000.00"),
                criarPedido("PED-004", "Bruna", "BLACK", "3000.00")
        );

        for (Pedido pedido : pedidos) {
            BigDecimal desconto = calculadora.calcular(pedido);

            System.out.println(pedido.codigo()
                    + " | Tipo: " + pedido.tipoCliente()
                    + " | Desconto: " + desconto);
        }
    }

    private static Pedido criarPedido(String codigo, String cliente, String tipo, String valor) {
        return new Pedido(
                UUID.randomUUID(),
                codigo,
                cliente,
                tipo,
                new BigDecimal(valor),
                Instant.now(),
                true
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula217.app.CalculadoraDescontoOcpApp
```

---

## O que melhorou

Antes:

```text
novo desconto = alterar CalculadoraDescontoRuim.
```

Agora:

```text
novo desconto = criar nova classe que implementa PoliticaDesconto.
```

A classe central:

```text
CalculadoraDescontoOcp
```

não precisa conhecer cada tipo específico.

Ela conhece o contrato:

```text
PoliticaDesconto
```

---

# Parte 4 — Adicionando uma nova política sem alterar a calculadora

## Novo cenário

Agora entrou cliente:

```text
PARCEIRO
```

Regra:

```text
15% de desconto.
```

Vamos adicionar sem alterar a `CalculadoraDescontoOcp`.

---

## DescontoClienteParceiro

Crie:

```text
src\br\com\curso\aula217\ocp\desconto\DescontoClienteParceiro.java
```

Código:

```java
package br.com.curso.aula217.ocp.desconto;

import br.com.curso.aula217.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoClienteParceiro implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "PARCEIRO".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return pedido.valor().multiply(new BigDecimal("0.15"));
    }

    @Override
    public String nome() {
        return "Desconto cliente parceiro";
    }
}
```

---

## CalculadoraDescontoParceiroApp

Crie:

```text
src\br\com\curso\aula217\app\CalculadoraDescontoParceiroApp.java
```

Código:

```java
package br.com.curso.aula217.app;

import br.com.curso.aula217.dominio.pedido.Pedido;
import br.com.curso.aula217.ocp.desconto.CalculadoraDescontoOcp;
import br.com.curso.aula217.ocp.desconto.DescontoClienteBlack;
import br.com.curso.aula217.ocp.desconto.DescontoClienteComum;
import br.com.curso.aula217.ocp.desconto.DescontoClienteParceiro;
import br.com.curso.aula217.ocp.desconto.DescontoClientePremium;
import br.com.curso.aula217.ocp.desconto.DescontoClienteVip;
import br.com.curso.aula217.ocp.desconto.PoliticaDesconto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CalculadoraDescontoParceiroApp {
    public static void main(String[] args) {
        List<PoliticaDesconto> politicas = List.of(
                new DescontoClienteComum(),
                new DescontoClienteVip(),
                new DescontoClientePremium(),
                new DescontoClienteBlack(),
                new DescontoClienteParceiro()
        );

        CalculadoraDescontoOcp calculadora = new CalculadoraDescontoOcp(politicas);

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-010",
                "Empresa Parceira",
                "PARCEIRO",
                new BigDecimal("1000.00"),
                Instant.now(),
                true
        );

        System.out.println("Desconto: " + calculadora.calcular(pedido));
    }
}
```

---

## Observação importante

Você alterou a composição no app:

```java
new DescontoClienteParceiro()
```

Isso é normal.

Em aplicações com Spring, essa composição pode ser feita automaticamente por injeção de dependência.

O ponto do OCP é:

```text
a regra central de cálculo não precisou ser alterada.
```

---

# Parte 5 — OCP com notificação

## Problema ruim

Imagine:

```java
if ("EMAIL".equals(canal)) {
    enviarEmail();
} else if ("SMS".equals(canal)) {
    enviarSms();
} else if ("WHATSAPP".equals(canal)) {
    enviarWhatsapp();
}
```

Todo novo canal altera a classe.

Vamos refatorar.

---

## MensagemNotificacao

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\MensagemNotificacao.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

public class MensagemNotificacao {
    private final String destino;
    private final String titulo;
    private final String conteudo;

    public MensagemNotificacao(String destino, String titulo, String conteudo) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Conteúdo é obrigatório.");
        }

        this.destino = destino.trim();
        this.titulo = titulo.trim();
        this.conteudo = conteudo.trim();
    }

    public String destino() {
        return destino;
    }

    public String titulo() {
        return titulo;
    }

    public String conteudo() {
        return conteudo;
    }
}
```

---

## CanalNotificacao

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\CanalNotificacao.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

public interface CanalNotificacao {
    String nome();

    void enviar(MensagemNotificacao mensagem);
}
```

---

## EmailNotificacao

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\EmailNotificacao.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

public class EmailNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "EMAIL";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[EMAIL] Para: " + mensagem.destino()
                + " | " + mensagem.titulo()
                + " | " + mensagem.conteudo());
    }
}
```

---

## WhatsAppNotificacao

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\WhatsAppNotificacao.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

public class WhatsAppNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "WHATSAPP";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[WHATSAPP] Para: " + mensagem.destino()
                + " | " + mensagem.conteudo());
    }
}
```

---

## SmsNotificacao

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\SmsNotificacao.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

public class SmsNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "SMS";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[SMS] Para: " + mensagem.destino()
                + " | " + mensagem.conteudo());
    }
}
```

---

## NotificadorPedidoService

Crie:

```text
src\br\com\curso\aula217\ocp\notificacao\NotificadorPedidoService.java
```

Código:

```java
package br.com.curso.aula217.ocp.notificacao;

import java.util.List;

public class NotificadorPedidoService {
    private final List<CanalNotificacao> canais;

    public NotificadorPedidoService(List<CanalNotificacao> canais) {
        if (canais == null || canais.isEmpty()) {
            throw new IllegalArgumentException("Canais são obrigatórios.");
        }

        this.canais = List.copyOf(canais);
    }

    public void notificarTodos(MensagemNotificacao mensagem) {
        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        canais.forEach(canal -> canal.enviar(mensagem));
    }
}
```

---

## NotificadorPedidoOcpApp

Crie:

```text
src\br\com\curso\aula217\app\NotificadorPedidoOcpApp.java
```

Código:

```java
package br.com.curso.aula217.app;

import br.com.curso.aula217.ocp.notificacao.EmailNotificacao;
import br.com.curso.aula217.ocp.notificacao.MensagemNotificacao;
import br.com.curso.aula217.ocp.notificacao.NotificadorPedidoService;
import br.com.curso.aula217.ocp.notificacao.SmsNotificacao;
import br.com.curso.aula217.ocp.notificacao.WhatsAppNotificacao;

import java.util.List;

public class NotificadorPedidoOcpApp {
    public static void main(String[] args) {
        NotificadorPedidoService service = new NotificadorPedidoService(List.of(
                new EmailNotificacao(),
                new WhatsAppNotificacao(),
                new SmsNotificacao()
        ));

        MensagemNotificacao mensagem = new MensagemNotificacao(
                "cliente@empresa.com",
                "Pedido faturado",
                "Seu pedido foi faturado com sucesso."
        );

        service.notificarTodos(mensagem);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula217.app.NotificadorPedidoOcpApp
```

---

## Novo canal

Se amanhã entrar:

```text
TelegramNotificacao
```

você cria nova classe que implementa:

```text
CanalNotificacao
```

O service não precisa de novo if.

---

# Parte 6 — OCP com exportação

## Cenário

Você precisa exportar um resumo de pedido em formatos diferentes:

```text
TXT;
CSV;
console.
```

Versão ruim seria:

```java
if ("CSV".equals(formato)) {
    ...
} else if ("TXT".equals(formato)) {
    ...
} else if ("CONSOLE".equals(formato)) {
    ...
}
```

Vamos aplicar OCP.

---

## PedidoResumo

Crie:

```text
src\br\com\curso\aula217\dto\PedidoResumo.java
```

Código:

```java
package br.com.curso.aula217.dto;

public record PedidoResumo(
        String codigo,
        String cliente,
        String tipoCliente,
        String valor
) {
}
```

---

## ExportadorPedido

Crie:

```text
src\br\com\curso\aula217\ocp\exportacao\ExportadorPedido.java
```

Código:

```java
package br.com.curso.aula217.ocp.exportacao;

import br.com.curso.aula217.dto.PedidoResumo;

public interface ExportadorPedido {
    String formato();

    String exportar(PedidoResumo resumo);
}
```

---

## ExportadorPedidoCsv

Crie:

```text
src\br\com\curso\aula217\ocp\exportacao\ExportadorPedidoCsv.java
```

Código:

```java
package br.com.curso.aula217.ocp.exportacao;

import br.com.curso.aula217.dto.PedidoResumo;

public class ExportadorPedidoCsv implements ExportadorPedido {
    @Override
    public String formato() {
        return "CSV";
    }

    @Override
    public String exportar(PedidoResumo resumo) {
        return String.join(
                ";",
                resumo.codigo(),
                resumo.cliente(),
                resumo.tipoCliente(),
                resumo.valor()
        );
    }
}
```

---

## ExportadorPedidoTxt

Crie:

```text
src\br\com\curso\aula217\ocp\exportacao\ExportadorPedidoTxt.java
```

Código:

```java
package br.com.curso.aula217.ocp.exportacao;

import br.com.curso.aula217.dto.PedidoResumo;

public class ExportadorPedidoTxt implements ExportadorPedido {
    @Override
    public String formato() {
        return "TXT";
    }

    @Override
    public String exportar(PedidoResumo resumo) {
        return "Pedido " + resumo.codigo()
                + " do cliente " + resumo.cliente()
                + " no valor " + resumo.valor();
    }
}
```

---

## PedidoExportacaoService

Crie:

```text
src\br\com\curso\aula217\ocp\exportacao\PedidoExportacaoService.java
```

Código:

```java
package br.com.curso.aula217.ocp.exportacao;

import br.com.curso.aula217.dto.PedidoResumo;

import java.util.List;

public class PedidoExportacaoService {
    private final List<ExportadorPedido> exportadores;

    public PedidoExportacaoService(List<ExportadorPedido> exportadores) {
        if (exportadores == null || exportadores.isEmpty()) {
            throw new IllegalArgumentException("Exportadores são obrigatórios.");
        }

        this.exportadores = List.copyOf(exportadores);
    }

    public String exportar(PedidoResumo resumo, String formato) {
        if (resumo == null) {
            throw new IllegalArgumentException("Resumo é obrigatório.");
        }

        if (formato == null || formato.isBlank()) {
            throw new IllegalArgumentException("Formato é obrigatório.");
        }

        String normalizado = formato.trim().toUpperCase();

        return exportadores.stream()
                .filter(exportador -> exportador.formato().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Formato não suportado: " + formato))
                .exportar(resumo);
    }
}
```

---

## PedidoExportacaoOcpApp

Crie:

```text
src\br\com\curso\aula217\app\PedidoExportacaoOcpApp.java
```

Código:

```java
package br.com.curso.aula217.app;

import br.com.curso.aula217.dto.PedidoResumo;
import br.com.curso.aula217.ocp.exportacao.ExportadorPedidoCsv;
import br.com.curso.aula217.ocp.exportacao.ExportadorPedidoTxt;
import br.com.curso.aula217.ocp.exportacao.PedidoExportacaoService;

import java.util.List;

public class PedidoExportacaoOcpApp {
    public static void main(String[] args) {
        PedidoResumo resumo = new PedidoResumo(
                "PED-001",
                "Ana",
                "VIP",
                "1500.00"
        );

        PedidoExportacaoService service = new PedidoExportacaoService(List.of(
                new ExportadorPedidoCsv(),
                new ExportadorPedidoTxt()
        ));

        System.out.println("CSV:");
        System.out.println(service.exportar(resumo, "CSV"));

        System.out.println();

        System.out.println("TXT:");
        System.out.println(service.exportar(resumo, "TXT"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula217.app.PedidoExportacaoOcpApp
```

---

## Novo formato

Se amanhã entrar:

```text
JSON
```

você pode criar:

```text
ExportadorPedidoJson
```

sem alterar `PedidoExportacaoService`.

---

# Parte 7 — OCP não significa remover todos os ifs

Nem todo `if` é problema.

If bom:

```java
if (pedido == null) {
    throw new IllegalArgumentException("Pedido é obrigatório.");
}
```

If bom:

```java
if (valor.compareTo(BigDecimal.ZERO) <= 0) {
    throw new IllegalArgumentException("Valor deve ser maior que zero.");
}
```

If que merece atenção:

```java
if ("TIPO_A".equals(tipo)) {
    comportamentoA();
} else if ("TIPO_B".equals(tipo)) {
    comportamentoB();
} else if ("TIPO_C".equals(tipo)) {
    comportamentoC();
}
```

Quando o `if` varia por tipo de comportamento e cresce com novas opções, OCP pode ajudar.

---

## Sinal clássico

Cuidado com métodos que vivem recebendo novos blocos:

```text
mais um tipo;
mais um canal;
mais um formato;
mais uma regra;
mais um status;
mais uma integração.
```

Esse é o cheiro de OCP sendo violado.

---

# Parte 8 — Quando aplicar OCP

Aplique OCP quando:

```text
há variações reais de comportamento;
as variações crescem com frequência;
o código central está ficando cheio de if/switch;
cada variação tem regra própria;
você quer testar cada regra isoladamente;
você quer reduzir risco ao adicionar nova regra.
```

---

## Quando não aplicar ainda

Evite abstrair cedo demais quando:

```text
só existe uma implementação;
não há previsão real de variação;
a abstração ficaria artificial;
o código simples atende bem;
você ainda não entendeu o domínio.
```

Exemplo:

```text
criar interface para tudo sem necessidade.
```

Isso não é arquitetura.

É excesso.

---

# Parte 9 — OCP e composição

OCP aparece muito com composição.

Em vez de:

```text
uma classe gigante com ifs.
```

Você tem:

```text
uma interface;
várias implementações;
uma classe coordenadora que usa a interface.
```

Exemplo:

```text
PoliticaDesconto;
DescontoClienteVip;
DescontoClientePremium;
CalculadoraDescontoOcp.
```

A classe coordenadora não precisa saber todos os detalhes.

---

## OCP e injeção de dependência

Neste curso ainda estamos em Java puro.

Por isso você monta listas no App:

```java
List.of(new DescontoClienteVip(), new DescontoClientePremium())
```

Com Spring, isso pode virar injeção automática de lista.

Mas a ideia é a mesma:

```text
depender de contratos;
receber implementações;
evitar new espalhado no núcleo.
```

Isso prepara o caminho para DIP.

---

# Parte 10 — Aplicando OCP em backend

## Desconto

Variação:

```text
tipo de cliente;
campanha;
cupom;
produto;
canal de venda.
```

OCP pode usar:

```text
PoliticaDesconto
```

---

## Notificação

Variação:

```text
e-mail;
SMS;
WhatsApp;
push;
mensageria interna.
```

OCP pode usar:

```text
CanalNotificacao
```

---

## Exportação

Variação:

```text
CSV;
TXT;
JSON;
XLSX;
PDF.
```

OCP pode usar:

```text
ExportadorRelatorio
```

---

## Validação

Variação:

```text
validador de documento;
validador de cliente;
validador de produto;
validador de contrato.
```

OCP pode usar:

```text
Validador<T>
```

---

## Integração

Variação:

```text
pagamento por cartão;
pagamento por boleto;
pagamento por PIX;
pagamento via parceiro.
```

OCP pode usar:

```text
GatewayPagamento
```

---

# Parte 11 — Erros comuns ao aplicar OCP

## 1. Criar interface sem necessidade

Ruim:

```text
Uma classe, uma interface, sem variação e sem teste que justifique.
```

OCP não exige interface para tudo.

---

## 2. Abstração com nome genérico

Ruim:

```text
Processador;
Executor;
Handler;
Manager;
Strategy.
```

Melhor:

```text
PoliticaDesconto;
CanalNotificacao;
ExportadorPedido;
GatewayPagamento.
```

Nome deve expressar domínio.

---

## 3. Manter if dentro da implementação errada

Você cria interface, mas deixa uma classe com todos os ifs dentro.

Isso não resolve.

---

## 4. Transformar regra simples em estrutura complexa

Se só existe um desconto fixo, talvez uma classe simples baste.

---

## 5. Quebrar SRP para tentar aplicar OCP

OCP não corrige classe que faz tudo.

Primeiro separe responsabilidade.

Depois abra para extensão.

---

# Parte 12 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula217.app.CalculadoraDescontoRuimApp
java -cp out br.com.curso.aula217.app.CalculadoraDescontoOcpApp
java -cp out br.com.curso.aula217.app.CalculadoraDescontoParceiroApp
java -cp out br.com.curso.aula217.app.NotificadorPedidoOcpApp
java -cp out br.com.curso.aula217.app.PedidoExportacaoOcpApp
```

Depois responda:

```text
1. Onde havia if crescendo?
2. Qual interface foi criada para desconto?
3. Como foi adicionado cliente PARCEIRO?
4. A CalculadoraDescontoOcp precisou mudar?
5. Qual interface representa canal de notificação?
6. Como adicionar Telegram?
7. Qual interface representa exportador?
8. Como adicionar JSON?
9. Onde ainda existe configuração manual?
10. Isso viola OCP ou é composição da aplicação?
```

---

# Parte 13 — Exercício prático

## Contexto

Você vai aplicar OCP em um fluxo de Ordem de Serviço.

O sistema precisa calcular prioridade de atendimento.

Tipos atuais:

```text
NORMAL;
CRITICA;
REAGENDAMENTO;
SEM_CAPACITY.
```

Regras:

```text
NORMAL:
peso 10.

CRITICA:
peso 100.

REAGENDAMENTO:
peso 50.

SEM_CAPACITY:
peso 70.
```

---

## Versão ruim

Crie:

```text
PrioridadeOsCalculatorRuim
```

Com método:

```java
int calcularPeso(String tipoFila)
```

Usando if/else.

Depois crie app demonstrando.

---

## Versão OCP

Crie interface:

```java
public interface PoliticaPrioridadeOs {
    boolean aplica(String tipoFila);

    int peso();

    String nome();
}
```

Crie implementações:

```text
PrioridadeNormal;
PrioridadeCritica;
PrioridadeReagendamento;
PrioridadeSemCapacity.
```

Crie:

```text
CalculadoraPrioridadeOs
```

Que recebe:

```java
List<PoliticaPrioridadeOs>
```

e calcula o peso.

---

## Nova regra

Depois adicione:

```text
CASO_CRITICO_CLIENTE_VIP
```

Peso:

```text
150
```

Sem alterar `CalculadoraPrioridadeOs`.

Crie nova implementação.

---

## Critérios

```text
não usar if gigante na calculadora OCP;
cada política deve ter uma responsabilidade;
calculadora deve depender da interface;
app pode montar a lista manualmente;
mensagem de erro clara para tipo não suportado.
```

---

# Parte 14 — Desafio extra

## OCP com validações

Crie uma interface:

```java
public interface ValidadorPedido {
    void validar(Pedido pedido);
}
```

Crie validadores:

```text
PedidoPagoValidador;
PedidoValorMinimoValidador;
PedidoClienteObrigatorioValidador.
```

Crie:

```text
ValidadorPedidoComposto
```

Que recebe lista de validadores e executa todos.

Depois adicione novo validador:

```text
PedidoNaoFaturadoValidador
```

sem alterar o validador composto.

---

## Objetivo

Perceber que OCP também aparece em validação.

Mas cuidado:

```text
se a validação for simples e fixa, não precisa abstrair demais.
```

---

# Parte 15 — Simulado rápido

## Questão 1

OCP significa:

```text
A) Uma classe deve ter um único método.
B) Aberto para extensão e fechado para modificação.
C) Toda classe deve ser final.
D) Toda regra deve ficar no controller.
```

---

## Questão 2

Qual é um sinal comum de violação de OCP?

```text
A) if/switch crescendo por tipo de comportamento.
B) método validando null.
C) uso de BigDecimal.
D) uso de LocalDate.
```

---

## Questão 3

No exemplo de desconto, quem representa a extensão?

```text
A) As implementações de PoliticaDesconto.
B) O System.out.println.
C) O UUID.
D) O pacote app.
```

---

## Questão 4

Adicionar `DescontoClienteParceiro` sem alterar `CalculadoraDescontoOcp` é exemplo de:

```text
A) OCP.
B) Falha de compilação.
C) Herança obrigatória.
D) Violação de SRP.
```

---

## Questão 5

OCP deve ser aplicado:

```text
A) Sempre, mesmo sem variação.
B) Quando há variações reais ou prováveis que fariam o código central crescer em if/switch.
C) Para substituir todo if de validação de null.
D) Apenas em frontend.
```

---

## Gabarito

```text
1. B
2. A
3. A
4. A
5. B
```

---

# Parte 16 — Checklist OCP

Marque mentalmente:

```text
[ ] Sei explicar OCP.
[ ] Sei o que significa aberto para extensão.
[ ] Sei o que significa fechado para modificação.
[ ] Sei identificar if/switch por tipo.
[ ] Sei criar interface de estratégia.
[ ] Sei criar implementações específicas.
[ ] Sei usar lista de estratégias.
[ ] Sei adicionar nova regra sem alterar calculadora central.
[ ] Sei que composição no app é normal.
[ ] Sei que OCP não remove todos os ifs.
[ ] Sei que OCP não é abstração prematura.
[ ] Sei que SRP vem antes de OCP.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é OCP?
2. O que significa aberto para extensão?
3. O que significa fechado para modificação?
4. Qual problema de if/switch por tipo?
5. Como PoliticaDesconto ajuda no OCP?
6. Como adicionar novo desconto sem alterar a calculadora?
7. Por que nem todo if viola OCP?
8. Quando não aplicar OCP?
9. Qual relação entre OCP e SRP?
10. Como OCP prepara o DIP?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar OCP;
identificar if/switch crescendo;
refatorar cálculo por tipo usando interface;
criar políticas de desconto;
criar canais de notificação;
criar exportadores;
adicionar nova implementação sem alterar código central;
diferenciar if de validação de if de variação;
evitar abstração prematura;
resolver o desafio de prioridade de OS;
preparar-se para LSP.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-217-ocp-open-closed-principle
git commit -m "Aula 217: ocp open closed principle"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
quando novas variações aparecem com frequência, prefira extensão por novas implementações em vez de alterar o núcleo com mais ifs.
```

Você estudou:

```text
OCP;
aberto para extensão;
fechado para modificação;
políticas de desconto;
canais de notificação;
exportadores;
interfaces de estratégia;
composição;
evitar abstração prematura;
if bom vs if problemático.
```

Também reforçou que:

```text
SRP separa responsabilidades;
OCP permite evoluir comportamentos separados.
```

Na próxima aula, vamos estudar:

```text
LSP — Liskov Substitution Principle.
```

A ideia será entender como usar herança e polimorfismo sem quebrar expectativas do código.
