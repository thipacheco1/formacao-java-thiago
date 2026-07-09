# 224 — M10.02 — Strategy Pattern: políticas e regras variáveis no backend

## Objetivo da aula

Na aula anterior, você iniciou o Módulo 10:

```text
Design Patterns — Padrões de Projeto
```

Você viu que padrão de projeto não é decoração.

Padrão de projeto é uma solução conhecida para um problema recorrente de design.

Agora vamos aprofundar o primeiro padrão do módulo:

```text
Strategy Pattern
```

Em português:

```text
Padrão Estratégia
```

Este é um dos padrões mais importantes para backend, porque aparece em muitos cenários reais:

```text
desconto;
prioridade;
validação;
cálculo de taxa;
regras por tipo;
notificação;
pagamento;
frete;
roteamento;
autorização;
processamento de arquivos;
mensageria;
regras por cliente;
regras por contrato;
regras por status.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Strategy resolve;
identificar if/switch crescendo por tipo;
criar uma interface de estratégia;
criar estratégias concretas;
usar lista de estratégias;
selecionar estratégia aplicável;
aplicar Strategy com OCP;
respeitar LSP nas estratégias;
evitar Strategy desnecessário;
aplicar Strategy em desconto, prioridade, validação e taxa;
entender como Strategy será usado com Spring futuramente.
```

---

## Ideia principal

Strategy encapsula variações de comportamento.

Em vez de deixar várias regras dentro de um `if/else` gigante, você cria uma classe para cada regra.

Exemplo ruim:

```java
if ("VIP".equals(tipoCliente)) {
    return valor.multiply(new BigDecimal("0.10"));
}

if ("PREMIUM".equals(tipoCliente)) {
    return valor.multiply(new BigDecimal("0.20"));
}

if ("BLACK".equals(tipoCliente)) {
    return valor.multiply(new BigDecimal("0.30"));
}
```

Exemplo com Strategy:

```text
PoliticaDesconto
DescontoClienteVip
DescontoClientePremium
DescontoClienteBlack
CalculadoraDesconto
```

Cada regra fica em uma classe.

A calculadora apenas coordena.

---

## Strategy em uma frase prática

```text
Quando o comportamento varia por tipo, crie uma estratégia para cada variação.
```

Mas atenção:

```text
nem todo if precisa virar Strategy.
```

Use Strategy quando:

```text
as regras variam;
as variações crescem;
cada variação tem lógica própria;
o if está ficando grande;
você quer testar regras isoladamente;
você quer adicionar regra nova sem mexer no núcleo.
```

---

## Relação com SOLID

Strategy se conecta muito com SOLID.

## SRP

Cada estratégia tem uma responsabilidade.

```text
DescontoVip:
calcula desconto VIP.

DescontoPremium:
calcula desconto Premium.
```

---

## OCP

Nova regra entra por nova classe.

```text
novo desconto = nova estratégia.
```

A calculadora central não precisa mudar.

---

## LSP

Toda estratégia deve cumprir o contrato.

Se o contrato diz:

```text
calcular desconto e retornar valor não negativo
```

a estratégia não pode:

```text
retornar null;
lançar UnsupportedOperationException;
salvar pedido;
faturar pedido;
retornar desconto negativo.
```

---

## ISP

A interface da estratégia deve ser pequena e focada.

Exemplo bom:

```java
public interface PoliticaDesconto {
    boolean aplica(Pedido pedido);

    BigDecimal calcular(Pedido pedido);
}
```

Exemplo ruim:

```java
public interface PoliticaCompleta {
    BigDecimal calcularDesconto(Pedido pedido);

    void enviarEmail(Pedido pedido);

    void salvarBanco(Pedido pedido);

    void gerarRelatorio(Pedido pedido);
}
```

---

## DIP

O service pode depender da interface, não da implementação concreta.

```text
CalculadoraDesconto usa List<PoliticaDesconto>.
```

Futuramente, com Spring, o framework poderá injetar todas as implementações automaticamente.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Strategy:

```text
A entidade protege regra essencial.
O use case coordena.
A estratégia encapsula regra variável.
O repository salva.
O client integra.
O controller recebe.
```

---

# Parte 1 — Quando Strategy aparece no backend

## Desconto

```text
COMUM;
VIP;
PREMIUM;
BLACK;
PARCEIRO.
```

Cada tipo pode ter uma regra.

---

## Prioridade

```text
NORMAL;
CRITICA;
REAGENDAMENTO;
SEM_CAPACITY;
CASO_CRITICO_CLIENTE_VIP.
```

Cada tipo pode ter peso diferente.

---

## Validação

```text
validar cliente;
validar produto;
validar contrato;
validar estoque;
validar status;
validar período.
```

Você pode ter cadeia de validadores ou lista de estratégias de validação.

---

## Taxa

```text
entrega normal;
entrega expressa;
retirada em loja;
entrega agendada;
entrega VIP.
```

---

## Pagamento

```text
PIX;
CARTAO;
BOLETO;
TRANSFERENCIA;
CARTEIRA_DIGITAL.
```

---

## Notificação

```text
EMAIL;
SMS;
WHATSAPP;
PUSH;
TELEGRAM.
```

---

# Parte 2 — Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-224-strategy-pattern-politicas-regras-variaveis-backend
cd labs\m10\aula-224-strategy-pattern-politicas-regras-variaveis-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula224

mkdir src\br\com\curso\aula224\app

mkdir src\br\com\curso\aula224\dominio
mkdir src\br\com\curso\aula224\dominio\pedido
mkdir src\br\com\curso\aula224\dominio\os

mkdir src\br\com\curso\aula224\ruim

mkdir src\br\com\curso\aula224\strategy
mkdir src\br\com\curso\aula224\strategy\desconto
mkdir src\br\com\curso\aula224\strategy\prioridade
mkdir src\br\com\curso\aula224\strategy\validacao
mkdir src\br\com\curso\aula224\strategy\taxa
```

---

# Parte 3 — Exemplo 1: desconto sem Strategy

## Pedido

Crie:

```text
src\br\com\curso\aula224\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula224.dominio.pedido;

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

    public Pedido(UUID id, String codigo, String cliente, String tipoCliente, BigDecimal valor, Instant criadoEm) {
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

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Tipo: " + tipoCliente
                + " | Valor: " + valor;
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
src\br\com\curso\aula224\ruim\CalculadoraDescontoRuim.java
```

Código:

```java
package br.com.curso.aula224.ruim;

import br.com.curso.aula224.dominio.pedido.Pedido;

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
src\br\com\curso\aula224\app\CalculadoraDescontoRuimApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.dominio.pedido.Pedido;
import br.com.curso.aula224.ruim.CalculadoraDescontoRuim;

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
            System.out.println(pedido.resumo() + " | Desconto: " + calculadora.calcular(pedido));
        }
    }

    private static Pedido criarPedido(String codigo, String cliente, String tipoCliente, String valor) {
        return new Pedido(
                UUID.randomUUID(),
                codigo,
                cliente,
                tipoCliente,
                new BigDecimal(valor),
                Instant.now()
        );
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula224.app.CalculadoraDescontoRuimApp
```

---

## Diagnóstico

A versão funciona, mas tem problema.

Se entrar:

```text
PARCEIRO;
FUNCIONARIO;
CAMPANHA;
BLACK_FRIDAY;
```

você vai alterar a calculadora.

Isso viola OCP.

Também mistura todas as regras dentro de uma classe.

Strategy resolve essa variação.

---

# Parte 4 — Aplicando Strategy em desconto

## PoliticaDesconto

Crie:

```text
src\br\com\curso\aula224\strategy\desconto\PoliticaDesconto.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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
src\br\com\curso\aula224\strategy\desconto\DescontoClienteComum.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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
src\br\com\curso\aula224\strategy\desconto\DescontoClienteVip.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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
src\br\com\curso\aula224\strategy\desconto\DescontoClientePremium.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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
src\br\com\curso\aula224\strategy\desconto\DescontoClienteBlack.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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

## CalculadoraDescontoStrategy

Crie:

```text
src\br\com\curso\aula224\strategy\desconto\CalculadoraDescontoStrategy.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;

public class CalculadoraDescontoStrategy {
    private final List<PoliticaDesconto> politicas;

    public CalculadoraDescontoStrategy(List<PoliticaDesconto> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas de desconto são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        PoliticaDesconto politica = politicas.stream()
                .filter(item -> item.aplica(pedido))
                .findFirst()
                .orElse(null);

        if (politica == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal desconto = politica.calcular(pedido);

        if (desconto == null) {
            throw new IllegalStateException("Política retornou desconto nulo: " + politica.nome());
        }

        if (desconto.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Política retornou desconto negativo: " + politica.nome());
        }

        return desconto;
    }
}
```

---

## CalculadoraDescontoStrategyApp

Crie:

```text
src\br\com\curso\aula224\app\CalculadoraDescontoStrategyApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.dominio.pedido.Pedido;
import br.com.curso.aula224.strategy.desconto.CalculadoraDescontoStrategy;
import br.com.curso.aula224.strategy.desconto.DescontoClienteBlack;
import br.com.curso.aula224.strategy.desconto.DescontoClienteComum;
import br.com.curso.aula224.strategy.desconto.DescontoClientePremium;
import br.com.curso.aula224.strategy.desconto.DescontoClienteVip;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CalculadoraDescontoStrategyApp {
    public static void main(String[] args) {
        CalculadoraDescontoStrategy calculadora = new CalculadoraDescontoStrategy(List.of(
                new DescontoClienteComum(),
                new DescontoClienteVip(),
                new DescontoClientePremium(),
                new DescontoClienteBlack()
        ));

        List<Pedido> pedidos = List.of(
                criarPedido("PED-001", "Ana", "COMUM", "500.00"),
                criarPedido("PED-002", "Carlos", "VIP", "1500.00"),
                criarPedido("PED-003", "Maria", "PREMIUM", "2000.00"),
                criarPedido("PED-004", "Bruna", "BLACK", "3000.00")
        );

        pedidos.forEach(pedido -> {
            BigDecimal desconto = calculadora.calcular(pedido);
            System.out.println(pedido.resumo() + " | Desconto: " + desconto);
        });
    }

    private static Pedido criarPedido(String codigo, String cliente, String tipoCliente, String valor) {
        return new Pedido(
                UUID.randomUUID(),
                codigo,
                cliente,
                tipoCliente,
                new BigDecimal(valor),
                Instant.now()
        );
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula224.app.CalculadoraDescontoStrategyApp
```

---

## O que melhorou

Antes:

```text
regra nova = alterar calculadora.
```

Agora:

```text
regra nova = criar nova estratégia.
```

A calculadora não sabe os detalhes de cada desconto.

Ela só conhece o contrato.

---

# Parte 5 — Adicionando nova estratégia

## DescontoClienteParceiro

Crie:

```text
src\br\com\curso\aula224\strategy\desconto\DescontoClienteParceiro.java
```

Código:

```java
package br.com.curso.aula224.strategy.desconto;

import br.com.curso.aula224.dominio.pedido.Pedido;

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

## DescontoParceiroApp

Crie:

```text
src\br\com\curso\aula224\app\DescontoParceiroApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.dominio.pedido.Pedido;
import br.com.curso.aula224.strategy.desconto.CalculadoraDescontoStrategy;
import br.com.curso.aula224.strategy.desconto.DescontoClienteBlack;
import br.com.curso.aula224.strategy.desconto.DescontoClienteComum;
import br.com.curso.aula224.strategy.desconto.DescontoClienteParceiro;
import br.com.curso.aula224.strategy.desconto.DescontoClientePremium;
import br.com.curso.aula224.strategy.desconto.DescontoClienteVip;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class DescontoParceiroApp {
    public static void main(String[] args) {
        CalculadoraDescontoStrategy calculadora = new CalculadoraDescontoStrategy(List.of(
                new DescontoClienteComum(),
                new DescontoClienteVip(),
                new DescontoClientePremium(),
                new DescontoClienteBlack(),
                new DescontoClienteParceiro()
        ));

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-010",
                "Empresa Parceira",
                "PARCEIRO",
                new BigDecimal("1000.00"),
                Instant.now()
        );

        System.out.println("Desconto: " + calculadora.calcular(pedido));
    }
}
```

---

## O que foi alterado

Você criou:

```text
DescontoClienteParceiro
```

E adicionou na composição do App.

Você não alterou:

```text
CalculadoraDescontoStrategy.
```

Isso é Strategy aplicando OCP.

---

# Parte 6 — Exemplo 2: prioridade de OS

Agora vamos aplicar Strategy em um cenário muito comum no backend corporativo:

```text
prioridade de atendimento.
```

---

## TipoOrdemServico

Crie:

```text
src\br\com\curso\aula224\dominio\os\TipoOrdemServico.java
```

Código:

```java
package br.com.curso.aula224.dominio.os;

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
src\br\com\curso\aula224\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula224.dominio.os;

import java.time.Instant;
import java.util.UUID;

public class OrdemServico {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final TipoOrdemServico tipo;
    private final Instant criadaEm;
    private int prioridade;

    public OrdemServico(UUID id, String codigo, String cliente, TipoOrdemServico tipo, Instant criadaEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
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
        this.tipo = tipo;
        this.criadaEm = criadaEm;
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

    public TipoOrdemServico tipo() {
        return tipo;
    }

    public Instant criadaEm() {
        return criadaEm;
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

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Tipo: " + tipo
                + " | Prioridade: " + prioridade;
    }
}
```

---

## PoliticaPrioridadeOs

Crie:

```text
src\br\com\curso\aula224\strategy\prioridade\PoliticaPrioridadeOs.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;

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
src\br\com\curso\aula224\strategy\prioridade\PrioridadeNormal.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;
import br.com.curso.aula224.dominio.os.TipoOrdemServico;

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
src\br\com\curso\aula224\strategy\prioridade\PrioridadeCritica.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;
import br.com.curso.aula224.dominio.os.TipoOrdemServico;

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
src\br\com\curso\aula224\strategy\prioridade\PrioridadeReagendamento.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;
import br.com.curso.aula224.dominio.os.TipoOrdemServico;

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
src\br\com\curso\aula224\strategy\prioridade\PrioridadeSemCapacity.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;
import br.com.curso.aula224.dominio.os.TipoOrdemServico;

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

## CalculadoraPrioridadeOsStrategy

Crie:

```text
src\br\com\curso\aula224\strategy\prioridade\CalculadoraPrioridadeOsStrategy.java
```

Código:

```java
package br.com.curso.aula224.strategy.prioridade;

import br.com.curso.aula224.dominio.os.OrdemServico;

import java.util.List;

public class CalculadoraPrioridadeOsStrategy {
    private final List<PoliticaPrioridadeOs> politicas;

    public CalculadoraPrioridadeOsStrategy(List<PoliticaPrioridadeOs> politicas) {
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
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma política para: " + ordemServico.tipo()));

        int prioridade = politica.calcular(ordemServico);

        if (prioridade <= 0) {
            throw new IllegalStateException("Prioridade inválida retornada por: " + politica.nome());
        }

        return prioridade;
    }
}
```

---

## PrioridadeOsStrategyApp

Crie:

```text
src\br\com\curso\aula224\app\PrioridadeOsStrategyApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.dominio.os.OrdemServico;
import br.com.curso.aula224.dominio.os.TipoOrdemServico;
import br.com.curso.aula224.strategy.prioridade.CalculadoraPrioridadeOsStrategy;
import br.com.curso.aula224.strategy.prioridade.PrioridadeCritica;
import br.com.curso.aula224.strategy.prioridade.PrioridadeNormal;
import br.com.curso.aula224.strategy.prioridade.PrioridadeReagendamento;
import br.com.curso.aula224.strategy.prioridade.PrioridadeSemCapacity;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class PrioridadeOsStrategyApp {
    public static void main(String[] args) {
        CalculadoraPrioridadeOsStrategy calculadora = new CalculadoraPrioridadeOsStrategy(List.of(
                new PrioridadeNormal(),
                new PrioridadeCritica(),
                new PrioridadeReagendamento(),
                new PrioridadeSemCapacity()
        ));

        OrdemServico os = new OrdemServico(
                UUID.randomUUID(),
                "OS-001",
                "Ana",
                TipoOrdemServico.CRITICA,
                Instant.now()
        );

        os.definirPrioridade(calculadora.calcular(os));

        System.out.println(os.resumo());
    }
}
```

---

# Parte 7 — Exemplo 3: Strategy para validação

Strategy também pode ser usado para validações independentes.

## ResultadoValidacao

Crie:

```text
src\br\com\curso\aula224\strategy\validacao\ResultadoValidacao.java
```

Código:

```java
package br.com.curso.aula224.strategy.validacao;

import java.util.ArrayList;
import java.util.List;

public class ResultadoValidacao {
    private final List<String> erros = new ArrayList<>();

    public void adicionarErro(String erro) {
        if (erro == null || erro.isBlank()) {
            throw new IllegalArgumentException("Erro é obrigatório.");
        }

        erros.add(erro);
    }

    public boolean valido() {
        return erros.isEmpty();
    }

    public boolean invalido() {
        return !valido();
    }

    public List<String> erros() {
        return List.copyOf(erros);
    }
}
```

---

## ValidadorPedido

Crie:

```text
src\br\com\curso\aula224\strategy\validacao\ValidadorPedido.java
```

Código:

```java
package br.com.curso.aula224.strategy.validacao;

import br.com.curso.aula224.dominio.pedido.Pedido;

public interface ValidadorPedido {
    void validar(Pedido pedido, ResultadoValidacao resultado);

    String nome();
}
```

---

## ValidadorPedidoValorMinimo

Crie:

```text
src\br\com\curso\aula224\strategy\validacao\ValidadorPedidoValorMinimo.java
```

Código:

```java
package br.com.curso.aula224.strategy.validacao;

import br.com.curso.aula224.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class ValidadorPedidoValorMinimo implements ValidadorPedido {
    @Override
    public void validar(Pedido pedido, ResultadoValidacao resultado) {
        if (pedido.valor().compareTo(new BigDecimal("100.00")) < 0) {
            resultado.adicionarErro("Pedido deve ter valor mínimo de 100.00.");
        }
    }

    @Override
    public String nome() {
        return "Validador valor mínimo";
    }
}
```

---

## ValidadorPedidoClienteVip

Crie:

```text
src\br\com\curso\aula224\strategy\validacao\ValidadorPedidoClienteVip.java
```

Código:

```java
package br.com.curso.aula224.strategy.validacao;

import br.com.curso.aula224.dominio.pedido.Pedido;

public class ValidadorPedidoClienteVip implements ValidadorPedido {
    @Override
    public void validar(Pedido pedido, ResultadoValidacao resultado) {
        if ("VIP".equals(pedido.tipoCliente()) && pedido.cliente().length() < 3) {
            resultado.adicionarErro("Cliente VIP deve possuir nome com pelo menos 3 caracteres.");
        }
    }

    @Override
    public String nome() {
        return "Validador cliente VIP";
    }
}
```

---

## ValidadorPedidoComposto

Crie:

```text
src\br\com\curso\aula224\strategy\validacao\ValidadorPedidoComposto.java
```

Código:

```java
package br.com.curso.aula224.strategy.validacao;

import br.com.curso.aula224.dominio.pedido.Pedido;

import java.util.List;

public class ValidadorPedidoComposto {
    private final List<ValidadorPedido> validadores;

    public ValidadorPedidoComposto(List<ValidadorPedido> validadores) {
        if (validadores == null || validadores.isEmpty()) {
            throw new IllegalArgumentException("Validadores são obrigatórios.");
        }

        this.validadores = List.copyOf(validadores);
    }

    public ResultadoValidacao validar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        ResultadoValidacao resultado = new ResultadoValidacao();

        validadores.forEach(validador -> validador.validar(pedido, resultado));

        return resultado;
    }
}
```

---

## ValidadorPedidoStrategyApp

Crie:

```text
src\br\com\curso\aula224\app\ValidadorPedidoStrategyApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.dominio.pedido.Pedido;
import br.com.curso.aula224.strategy.validacao.ResultadoValidacao;
import br.com.curso.aula224.strategy.validacao.ValidadorPedidoClienteVip;
import br.com.curso.aula224.strategy.validacao.ValidadorPedidoComposto;
import br.com.curso.aula224.strategy.validacao.ValidadorPedidoValorMinimo;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ValidadorPedidoStrategyApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                "VIP",
                new BigDecimal("90.00"),
                Instant.now()
        );

        ValidadorPedidoComposto validador = new ValidadorPedidoComposto(List.of(
                new ValidadorPedidoValorMinimo(),
                new ValidadorPedidoClienteVip()
        ));

        ResultadoValidacao resultado = validador.validar(pedido);

        if (resultado.valido()) {
            System.out.println("Pedido válido.");
        } else {
            System.out.println("Pedido inválido:");
            resultado.erros().forEach(erro -> System.out.println(" - " + erro));
        }
    }
}
```

---

## Observação importante

Aqui a seleção não é por `aplica`.

Todos os validadores rodam.

Mesmo assim, é uma variação do uso de Strategy:

```text
cada validador encapsula uma regra.
```

Quando quisermos encadear validações com interrupção, estudaremos:

```text
Chain of Responsibility.
```

---

# Parte 8 — Exemplo 4: taxa de entrega

## PoliticaTaxaEntrega

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\PoliticaTaxaEntrega.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;

public interface PoliticaTaxaEntrega {
    boolean aplica(String tipoEntrega);

    BigDecimal calcular();

    String nome();
}
```

---

## TaxaEntregaNormal

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\TaxaEntregaNormal.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;

public class TaxaEntregaNormal implements PoliticaTaxaEntrega {
    @Override
    public boolean aplica(String tipoEntrega) {
        return "NORMAL".equals(tipoEntrega);
    }

    @Override
    public BigDecimal calcular() {
        return new BigDecimal("20.00");
    }

    @Override
    public String nome() {
        return "Taxa entrega normal";
    }
}
```

---

## TaxaEntregaExpressa

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\TaxaEntregaExpressa.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;

public class TaxaEntregaExpressa implements PoliticaTaxaEntrega {
    @Override
    public boolean aplica(String tipoEntrega) {
        return "EXPRESSA".equals(tipoEntrega);
    }

    @Override
    public BigDecimal calcular() {
        return new BigDecimal("45.00");
    }

    @Override
    public String nome() {
        return "Taxa entrega expressa";
    }
}
```

---

## TaxaEntregaAgendada

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\TaxaEntregaAgendada.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;

public class TaxaEntregaAgendada implements PoliticaTaxaEntrega {
    @Override
    public boolean aplica(String tipoEntrega) {
        return "AGENDADA".equals(tipoEntrega);
    }

    @Override
    public BigDecimal calcular() {
        return new BigDecimal("30.00");
    }

    @Override
    public String nome() {
        return "Taxa entrega agendada";
    }
}
```

---

## TaxaEntregaRetiradaLoja

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\TaxaEntregaRetiradaLoja.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;

public class TaxaEntregaRetiradaLoja implements PoliticaTaxaEntrega {
    @Override
    public boolean aplica(String tipoEntrega) {
        return "RETIRADA_LOJA".equals(tipoEntrega);
    }

    @Override
    public BigDecimal calcular() {
        return BigDecimal.ZERO;
    }

    @Override
    public String nome() {
        return "Taxa retirada em loja";
    }
}
```

---

## CalculadoraTaxaEntrega

Crie:

```text
src\br\com\curso\aula224\strategy\taxa\CalculadoraTaxaEntrega.java
```

Código:

```java
package br.com.curso.aula224.strategy.taxa;

import java.math.BigDecimal;
import java.util.List;

public class CalculadoraTaxaEntrega {
    private final List<PoliticaTaxaEntrega> politicas;

    public CalculadoraTaxaEntrega(List<PoliticaTaxaEntrega> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas são obrigatórias.");
        }

        this.politicas = List.copyOf(politicas);
    }

    public BigDecimal calcular(String tipoEntrega) {
        if (tipoEntrega == null || tipoEntrega.isBlank()) {
            throw new IllegalArgumentException("Tipo de entrega é obrigatório.");
        }

        String normalizado = tipoEntrega.trim().toUpperCase();

        PoliticaTaxaEntrega politica = politicas.stream()
                .filter(item -> item.aplica(normalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de entrega não suportado: " + tipoEntrega));

        BigDecimal taxa = politica.calcular();

        if (taxa == null) {
            throw new IllegalStateException("Política retornou taxa nula: " + politica.nome());
        }

        if (taxa.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Política retornou taxa negativa: " + politica.nome());
        }

        return taxa;
    }
}
```

---

## TaxaEntregaStrategyApp

Crie:

```text
src\br\com\curso\aula224\app\TaxaEntregaStrategyApp.java
```

Código:

```java
package br.com.curso.aula224.app;

import br.com.curso.aula224.strategy.taxa.CalculadoraTaxaEntrega;
import br.com.curso.aula224.strategy.taxa.TaxaEntregaAgendada;
import br.com.curso.aula224.strategy.taxa.TaxaEntregaExpressa;
import br.com.curso.aula224.strategy.taxa.TaxaEntregaNormal;
import br.com.curso.aula224.strategy.taxa.TaxaEntregaRetiradaLoja;

import java.util.List;

public class TaxaEntregaStrategyApp {
    public static void main(String[] args) {
        CalculadoraTaxaEntrega calculadora = new CalculadoraTaxaEntrega(List.of(
                new TaxaEntregaNormal(),
                new TaxaEntregaExpressa(),
                new TaxaEntregaAgendada(),
                new TaxaEntregaRetiradaLoja()
        ));

        System.out.println("NORMAL: " + calculadora.calcular("NORMAL"));
        System.out.println("EXPRESSA: " + calculadora.calcular("EXPRESSA"));
        System.out.println("AGENDADA: " + calculadora.calcular("AGENDADA"));
        System.out.println("RETIRADA_LOJA: " + calculadora.calcular("RETIRADA_LOJA"));
    }
}
```

---

# Parte 9 — Strategy com prioridade e ordem de execução

Às vezes, mais de uma estratégia pode se aplicar.

Exemplo:

```text
cliente VIP;
campanha ativa;
cupom aplicado;
produto em promoção.
```

Você precisa decidir:

```text
usa a primeira que aplicar?
soma todas?
pega a maior?
pega a menor?
aplica por ordem?
```

Strategy não decide isso sozinho.

Quem decide é a classe coordenadora.

Exemplos:

```text
CalculadoraDescontoMaior:
pega o maior desconto.

CalculadoraDescontoPrimeiraPolitica:
pega a primeira que aplica.

CalculadoraDescontoAcumulado:
soma descontos permitidos.
```

Regra importante:

```text
a estratégia encapsula uma regra;
o coordenador define como combinar estratégias.
```

---

# Parte 10 — Strategy com Spring futuramente

Em Java puro, você monta manualmente:

```java
new CalculadoraDescontoStrategy(List.of(
        new DescontoClienteVip(),
        new DescontoClientePremium()
))
```

Com Spring futuramente, pode ficar conceitualmente assim:

```java
@Service
public class CalculadoraDesconto {
    private final List<PoliticaDesconto> politicas;

    public CalculadoraDesconto(List<PoliticaDesconto> politicas) {
        this.politicas = politicas;
    }
}
```

E cada estratégia:

```java
@Component
public class DescontoClienteVip implements PoliticaDesconto {
}
```

O Spring injeta a lista.

Mas o padrão é o mesmo.

Você está aprendendo o fundamento antes do framework.

---

# Parte 11 — Erros comuns com Strategy

## 1. Usar Strategy sem variação real

Se só existe uma regra e não há previsão de variação, talvez uma classe simples baste.

---

## 2. Criar interface genérica demais

Ruim:

```java
public interface Strategy {
    void execute();
}
```

Melhor:

```java
public interface PoliticaDesconto {
    BigDecimal calcular(Pedido pedido);
}
```

Nome deve falar do domínio.

---

## 3. Estratégia com efeito colateral escondido

Ruim:

```text
calcular desconto e salvar pedido.
```

A estratégia deve fazer o que promete.

---

## 4. Retornar null

Estratégias devem cumprir contrato.

Prefira:

```text
BigDecimal.ZERO;
Optional;
exception clara;
Resultado.
```

Dependendo do caso.

---

## 5. Coordenador cheio de regra de estratégia

Se o coordenador sabe demais sobre cada estratégia, você voltou ao problema original.

---

# Parte 12 — Checklist para aplicar Strategy

Antes de aplicar, pergunte:

```text
1. Existe variação de comportamento?
2. O if/switch cresce por tipo?
3. Cada variação tem lógica própria?
4. Quero adicionar novas regras sem alterar o núcleo?
5. Quero testar cada regra isoladamente?
6. A interface da estratégia é pequena?
7. As estratégias cumprem o contrato?
8. Existe uma forma clara de selecionar estratégia?
9. A ordem das estratégias importa?
10. A solução não está exagerada para o problema?
```

---

# Parte 13 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula224.app.CalculadoraDescontoRuimApp
java -cp out br.com.curso.aula224.app.CalculadoraDescontoStrategyApp
java -cp out br.com.curso.aula224.app.DescontoParceiroApp
java -cp out br.com.curso.aula224.app.PrioridadeOsStrategyApp
java -cp out br.com.curso.aula224.app.ValidadorPedidoStrategyApp
java -cp out br.com.curso.aula224.app.TaxaEntregaStrategyApp
```

Depois responda:

```text
1. Qual problema havia na calculadora ruim?
2. Qual interface representa a estratégia de desconto?
3. Como adicionar cliente PARCEIRO?
4. Qual contrato toda política de desconto deve cumprir?
5. Onde Strategy apareceu na prioridade de OS?
6. Onde Strategy apareceu na validação?
7. Onde Strategy apareceu na taxa de entrega?
8. Qual relação com OCP?
9. Qual relação com LSP?
10. Quando Strategy seria exagerado?
```

---

# Parte 14 — Exercício prático principal

## Contexto

Crie um sistema de política de aprovação de transação.

Tipos:

```text
BAIXO_VALOR;
MEDIO_VALOR;
ALTO_VALOR;
RISCO_MANUAL.
```

Regras:

```text
BAIXO_VALOR:
aprova automaticamente se valor <= 1000.

MEDIO_VALOR:
aprova automaticamente se valor <= 5000.

ALTO_VALOR:
envia para aprovação manual.

RISCO_MANUAL:
sempre envia para aprovação manual.
```

---

## Domínio

Crie:

```text
Transacao
```

Campos:

```text
String codigo;
BigDecimal valor;
String tipo;
```

Crie:

```text
ResultadoAprovacao
```

Campos:

```text
boolean aprovada;
boolean pendenteManual;
String mensagem;
```

---

## Strategy

Crie:

```java
public interface PoliticaAprovacaoTransacao {
    boolean aplica(Transacao transacao);

    ResultadoAprovacao avaliar(Transacao transacao);

    String nome();
}
```

Implementações:

```text
AprovacaoBaixoValor;
AprovacaoMedioValor;
AprovacaoAltoValor;
AprovacaoRiscoManual.
```

Crie:

```text
AvaliadorAprovacaoTransacao
```

que recebe:

```java
List<PoliticaAprovacaoTransacao>
```

---

## Critérios

```text
sem if gigante no avaliador;
cada política tem regra própria;
não retornar null;
não alterar transação dentro da política;
mensagem clara;
tipo não suportado deve lançar erro claro.
```

---

## Desafio extra

Adicione:

```text
CLIENTE_VIP
```

Regra:

```text
aprova automaticamente até 10000.
```

Sem alterar o avaliador.

---

# Parte 15 — Simulado rápido

## Questão 1

Strategy é mais útil quando:

```text
A) Há variações de comportamento que podem ser encapsuladas.
B) Existe apenas uma regra fixa e simples.
C) Quero transformar todo if em classe.
D) Quero remover domínio.
```

---

## Questão 2

No Strategy, a interface representa:

```text
A) O contrato comum das estratégias.
B) O banco de dados.
C) O controller HTTP.
D) O arquivo físico.
```

---

## Questão 3

Adicionar `DescontoClienteParceiro` sem alterar a calculadora central reforça:

```text
A) OCP.
B) Violação de SRP.
C) Retorno null.
D) Uso obrigatório de herança.
```

---

## Questão 4

Uma estratégia que retorna `null` quando o contrato espera `BigDecimal` viola principalmente:

```text
A) LSP.
B) Apenas OCP.
C) Apenas CSV.
D) Nenhum princípio.
```

---

## Questão 5

Uma boa interface de Strategy deve ser:

```text
A) pequena, clara e ligada ao domínio.
B) genérica como Strategy.execute para tudo.
C) gigante e com métodos não usados.
D) sempre sem parâmetros.
```

---

## Questão 6

Quem decide como combinar várias estratégias?

```text
A) A classe coordenadora.
B) O compilador.
C) O package.
D) O enum obrigatoriamente.
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

# Parte 16 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Strategy.
[ ] Sei identificar if/switch que pode virar Strategy.
[ ] Sei criar interface de estratégia.
[ ] Sei criar estratégias concretas.
[ ] Sei usar lista de estratégias.
[ ] Sei selecionar estratégia aplicável.
[ ] Sei validar retorno da estratégia.
[ ] Sei evitar Strategy desnecessário.
[ ] Sei aplicar Strategy em desconto.
[ ] Sei aplicar Strategy em prioridade.
[ ] Sei aplicar Strategy em validação.
[ ] Sei aplicar Strategy em taxa.
[ ] Sei explicar relação com SOLID.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é Strategy Pattern?
2. Qual problema ele resolve?
3. Qual relação com OCP?
4. Qual relação com LSP?
5. Por que nome da interface deve ser específico?
6. Como adicionar nova regra sem alterar o núcleo?
7. Quando Strategy é exagerado?
8. Qual diferença entre estratégia e coordenador?
9. Como Strategy aparece em validação?
10. Como Spring vai facilitar isso futuramente?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar if por tipo usando Strategy;
criar políticas de desconto;
criar políticas de prioridade;
criar validadores como estratégias;
criar políticas de taxa;
adicionar nova regra por nova classe;
explicar o papel do coordenador;
explicar como Strategy aplica SOLID;
resolver o desafio de aprovação de transação.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-224-strategy-pattern-politicas-regras-variaveis-backend
git commit -m "Aula 224: strategy pattern politicas regras variaveis backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Strategy encapsula comportamentos variáveis em classes separadas e evita que o núcleo cresça com ifs por tipo.
```

Você estudou:

```text
Strategy Pattern;
políticas de desconto;
prioridade de OS;
validadores;
taxa de entrega;
lista de estratégias;
seleção de estratégia;
contrato;
relação com SOLID;
uso futuro com Spring.
```

Na próxima aula, vamos estudar:

```text
Factory Pattern.
```

A ideia será entender como centralizar criação de objetos, escolher implementações e evitar espalhar `new` em lugares errados.
