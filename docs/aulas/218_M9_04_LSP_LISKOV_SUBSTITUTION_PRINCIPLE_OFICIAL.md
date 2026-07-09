# 218 — M9.04 — LSP: Liskov Substitution Principle

## Objetivo da aula

Na aula anterior, você estudou o segundo princípio do SOLID:

```text
OCP — Open/Closed Principle
```

Você viu que:

```text
o código deve estar aberto para extensão;
o código deve estar fechado para modificação;
ifs por tipo de comportamento podem indicar problema;
interfaces e implementações ajudam a adicionar novas variações;
políticas de desconto, canais de notificação e exportadores são exemplos práticos.
```

Agora vamos estudar o terceiro princípio:

```text
LSP — Liskov Substitution Principle
```

Em português:

```text
Princípio da Substituição de Liskov
```

A ideia central é:

```text
uma classe filha ou implementação deve poder substituir sua classe base ou interface sem quebrar o comportamento esperado.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é LSP;
entender substituição correta;
entender contrato de comportamento;
identificar herança perigosa;
identificar implementação que quebra expectativa;
evitar UnsupportedOperationException em subtipo;
entender pré-condições e pós-condições;
entender efeitos colaterais inesperados;
diferenciar herança de composição;
aplicar LSP em desconto, exportação e serviços;
entender relação entre LSP, OCP e ISP;
preparar base para ISP.
```

---

## Ideia principal

Se um código espera um tipo base, ele deve poder receber qualquer subtipo sem quebrar.

Exemplo conceitual:

```java
void enviar(CanalNotificacao canal, Mensagem mensagem) {
    canal.enviar(mensagem);
}
```

Se `EmailNotificacao`, `SmsNotificacao` e `WhatsAppNotificacao` implementam `CanalNotificacao`, todos devem respeitar o contrato de `enviar`.

O código não deveria precisar fazer:

```java
if (canal instanceof SmsNotificacao) {
    // cuidado, esse aqui não aceita título
}

if (canal instanceof EmailNotificacao) {
    // esse aceita tudo
}
```

Quando o chamador precisa conhecer exceções específicas de cada subtipo, o polimorfismo perdeu força.

---

## LSP em uma frase prática

```text
Se uma classe implementa um contrato, ela precisa cumprir esse contrato sem surpresa.
```

Surpresa é:

```text
lançar UnsupportedOperationException;
retornar null onde o contrato espera valor;
mudar estado onde deveria apenas calcular;
exigir condição mais forte do que a interface prometeu;
entregar resultado fora do padrão esperado;
quebrar invariantes do tipo base.
```

---

## Relação entre OCP e LSP

OCP incentiva extensão por novas implementações.

LSP garante que essas implementações sejam seguras.

Exemplo:

```text
OCP:
crie novas PoliticasDesconto.

LSP:
toda PoliticaDesconto precisa se comportar como uma PoliticaDesconto válida.
```

Sem LSP, OCP vira risco.

Você adiciona uma implementação nova e quebra o código que dependia do contrato.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com LSP:

```text
o use case pode depender de contratos;
as implementações desses contratos precisam cumprir o comportamento esperado;
o código de alto nível não deve ficar se defendendo de subtipo mal modelado.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-218-lsp-liskov-substitution-principle
cd labs\m9\aula-218-lsp-liskov-substitution-principle
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula218
mkdir src\br\com\curso\aula218\app
mkdir src\br\com\curso\aula218\dominio
mkdir src\br\com\curso\aula218\dominio\pedido
mkdir src\br\com\curso\aula218\dto
mkdir src\br\com\curso\aula218\ruim
mkdir src\br\com\curso\aula218\lsp
mkdir src\br\com\curso\aula218\lsp\desconto
mkdir src\br\com\curso\aula218\lsp\exportacao
mkdir src\br\com\curso\aula218\lsp\service
```

---

# Parte 1 — O que é substituição

## Exemplo simples

Imagine uma interface:

```java
public interface Exportador {
    String exportar();
}
```

Se uma classe implementa essa interface, o chamador espera conseguir chamar:

```java
exportador.exportar();
```

sem precisar saber o tipo concreto.

Isso é substituição.

---

## Quando a substituição quebra

A substituição quebra quando uma implementação faz algo inesperado.

Exemplo:

```java
public class ExportadorPdf implements Exportador {
    @Override
    public String exportar() {
        throw new UnsupportedOperationException("PDF não suportado");
    }
}
```

Se PDF não é suportado, essa classe não deveria prometer que é um exportador.

Ela está cumprindo a assinatura, mas quebrando o comportamento esperado.

LSP não é só compilar.

LSP é respeitar contrato.

---

## Contrato não é apenas interface

Contrato inclui:

```text
assinatura do método;
tipo de retorno;
exceções esperadas;
pré-condições;
pós-condições;
efeitos colaterais;
invariantes;
significado do método.
```

Exemplo:

```java
BigDecimal calcular(Pedido pedido);
```

Contrato esperado pode ser:

```text
pedido obrigatório;
retornar BigDecimal não nulo;
retornar valor maior ou igual a zero;
não alterar o pedido;
não faturar o pedido;
não salvar no banco;
não enviar notificação.
```

Mesmo que a interface não diga tudo isso no código, o design espera esse comportamento.

---

# Parte 2 — Domínio base da aula

## Pedido

Crie:

```text
src\br\com\curso\aula218\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula218.dominio.pedido;

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

## PedidoFactoryAppSupport

Crie uma classe utilitária para os apps:

```text
src\br\com\curso\aula218\app\PedidoFactoryAppSupport.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class PedidoFactoryAppSupport {
    private PedidoFactoryAppSupport() {
    }

    public static Pedido criarPedido(String codigo, String cliente, String tipo, String valor) {
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

---

# Parte 3 — Exemplo ruim: subtipo que não cumpre contrato

## Contrato de desconto

Vamos imaginar um contrato:

```text
uma política de desconto deve:
1. informar se se aplica ao pedido;
2. calcular desconto;
3. retornar BigDecimal não nulo;
4. nunca retornar valor negativo;
5. não alterar o pedido;
6. não faturar o pedido.
```

Se uma implementação quebra isso, fere LSP.

---

## PoliticaDesconto

Crie:

```text
src\br\com\curso\aula218\lsp\desconto\PoliticaDesconto.java
```

Código:

```java
package br.com.curso.aula218.lsp.desconto;

import br.com.curso.aula218.dominio.pedido.Pedido;

import java.math.BigDecimal;

public interface PoliticaDesconto {
    boolean aplica(Pedido pedido);

    BigDecimal calcular(Pedido pedido);

    String nome();
}
```

---

## DescontoVipCorreto

Crie:

```text
src\br\com\curso\aula218\lsp\desconto\DescontoVipCorreto.java
```

Código:

```java
package br.com.curso.aula218.lsp.desconto;

import br.com.curso.aula218.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoVipCorreto implements PoliticaDesconto {
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
        return "Desconto VIP correto";
    }
}
```

---

## DescontoComumCorreto

Crie:

```text
src\br\com\curso\aula218\lsp\desconto\DescontoComumCorreto.java
```

Código:

```java
package br.com.curso.aula218.lsp.desconto;

import br.com.curso.aula218.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class DescontoComumCorreto implements PoliticaDesconto {
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
        return "Desconto comum correto";
    }
}
```

---

## DescontoQueRetornaNull

Crie:

```text
src\br\com\curso\aula218\ruim\DescontoQueRetornaNull.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.PoliticaDesconto;

import java.math.BigDecimal;

public class DescontoQueRetornaNull implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "VIP".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        return null;
    }

    @Override
    public String nome() {
        return "Desconto que retorna null";
    }
}
```

---

## DescontoQueFaturaPedido

Crie:

```text
src\br\com\curso\aula218\ruim\DescontoQueFaturaPedido.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.PoliticaDesconto;

import java.math.BigDecimal;

public class DescontoQueFaturaPedido implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "VIP".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        pedido.faturar();

        return pedido.valor().multiply(new BigDecimal("0.10"));
    }

    @Override
    public String nome() {
        return "Desconto com efeito colateral";
    }
}
```

---

## DescontoQueLancaUnsupported

Crie:

```text
src\br\com\curso\aula218\ruim\DescontoQueLancaUnsupported.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.PoliticaDesconto;

import java.math.BigDecimal;

public class DescontoQueLancaUnsupported implements PoliticaDesconto {
    @Override
    public boolean aplica(Pedido pedido) {
        return "VIP".equals(pedido.tipoCliente());
    }

    @Override
    public BigDecimal calcular(Pedido pedido) {
        throw new UnsupportedOperationException("Cálculo de desconto não suportado.");
    }

    @Override
    public String nome() {
        return "Desconto inválido";
    }
}
```

---

## CalculadoraDescontoSegura

Crie:

```text
src\br\com\curso\aula218\lsp\desconto\CalculadoraDescontoSegura.java
```

Código:

```java
package br.com.curso.aula218.lsp.desconto;

import br.com.curso.aula218.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;

public class CalculadoraDescontoSegura {
    private final List<PoliticaDesconto> politicas;

    public CalculadoraDescontoSegura(List<PoliticaDesconto> politicas) {
        if (politicas == null || politicas.isEmpty()) {
            throw new IllegalArgumentException("Políticas são obrigatórias.");
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

## Observação importante

A calculadora acima se protege contra algumas violações.

Mas o ideal é que as implementações respeitem o contrato.

LSP não significa que o chamador nunca valida nada.

Significa que o chamador não deveria precisar conhecer comportamentos estranhos de cada subtipo.

---

# Parte 4 — Demonstrando violação de LSP

## LspViolacaoNullApp

Crie:

```text
src\br\com\curso\aula218\app\LspViolacaoNullApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.CalculadoraDescontoSegura;
import br.com.curso.aula218.ruim.DescontoQueRetornaNull;

import java.util.List;

public class LspViolacaoNullApp {
    public static void main(String[] args) {
        Pedido pedido = PedidoFactoryAppSupport.criarPedido(
                "PED-001",
                "Ana",
                "VIP",
                "1500.00"
        );

        CalculadoraDescontoSegura calculadora = new CalculadoraDescontoSegura(List.of(
                new DescontoQueRetornaNull()
        ));

        try {
            System.out.println("Desconto: " + calculadora.calcular(pedido));
        } catch (RuntimeException erro) {
            System.out.println("Falha LSP: " + erro.getMessage());
        }
    }
}
```

---

## LspViolacaoEfeitoColateralApp

Crie:

```text
src\br\com\curso\aula218\app\LspViolacaoEfeitoColateralApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.CalculadoraDescontoSegura;
import br.com.curso.aula218.ruim.DescontoQueFaturaPedido;

import java.util.List;

public class LspViolacaoEfeitoColateralApp {
    public static void main(String[] args) {
        Pedido pedido = PedidoFactoryAppSupport.criarPedido(
                "PED-002",
                "Carlos",
                "VIP",
                "1500.00"
        );

        CalculadoraDescontoSegura calculadora = new CalculadoraDescontoSegura(List.of(
                new DescontoQueFaturaPedido()
        ));

        System.out.println("Antes: " + pedido.resumo());
        System.out.println("Desconto: " + calculadora.calcular(pedido));
        System.out.println("Depois: " + pedido.resumo());
    }
}
```

---

## LspViolacaoUnsupportedApp

Crie:

```text
src\br\com\curso\aula218\app\LspViolacaoUnsupportedApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.CalculadoraDescontoSegura;
import br.com.curso.aula218.ruim.DescontoQueLancaUnsupported;

import java.util.List;

public class LspViolacaoUnsupportedApp {
    public static void main(String[] args) {
        Pedido pedido = PedidoFactoryAppSupport.criarPedido(
                "PED-003",
                "Maria",
                "VIP",
                "1500.00"
        );

        CalculadoraDescontoSegura calculadora = new CalculadoraDescontoSegura(List.of(
                new DescontoQueLancaUnsupported()
        ));

        try {
            System.out.println("Desconto: " + calculadora.calcular(pedido));
        } catch (RuntimeException erro) {
            System.out.println("Falha LSP: " + erro.getClass().getSimpleName() + " - " + erro.getMessage());
        }
    }
}
```

---

## O que esses exemplos mostram

Todas as classes implementam:

```text
PoliticaDesconto
```

Mas nem todas respeitam o contrato.

Violações:

```text
retornar null;
faturar pedido dentro do cálculo;
lançar UnsupportedOperationException.
```

O código compila.

Mas o design quebra.

---

# Parte 5 — Implementação correta

## LspDescontoCorretoApp

Crie:

```text
src\br\com\curso\aula218\app\LspDescontoCorretoApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dominio.pedido.Pedido;
import br.com.curso.aula218.lsp.desconto.CalculadoraDescontoSegura;
import br.com.curso.aula218.lsp.desconto.DescontoComumCorreto;
import br.com.curso.aula218.lsp.desconto.DescontoVipCorreto;

import java.util.List;

public class LspDescontoCorretoApp {
    public static void main(String[] args) {
        Pedido pedidoVip = PedidoFactoryAppSupport.criarPedido(
                "PED-004",
                "Bruna",
                "VIP",
                "1500.00"
        );

        Pedido pedidoComum = PedidoFactoryAppSupport.criarPedido(
                "PED-005",
                "João",
                "COMUM",
                "500.00"
        );

        CalculadoraDescontoSegura calculadora = new CalculadoraDescontoSegura(List.of(
                new DescontoVipCorreto(),
                new DescontoComumCorreto()
        ));

        System.out.println(pedidoVip.codigo() + " | Desconto: " + calculadora.calcular(pedidoVip));
        System.out.println(pedidoComum.codigo() + " | Desconto: " + calculadora.calcular(pedidoComum));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula218.app.LspDescontoCorretoApp
```

---

## O que está correto

As implementações:

```text
aceitam pedido válido;
retornam BigDecimal não nulo;
não retornam negativo;
não alteram o pedido;
não lançam UnsupportedOperationException.
```

Elas podem substituir `PoliticaDesconto` com segurança.

Isso respeita LSP.

---

# Parte 6 — Exemplo clássico: herança mal modelada

## Problema

Herança deve representar relação real de substituição.

Exemplo ruim:

```text
Pinguim é Ave.
Ave voa.
Pinguim não voa.
```

Se `Ave` tem método `voar`, `Pinguim` não deveria herdar esse contrato.

O problema não é o pinguim.

O problema é o modelo.

---

## AveVoadora

Uma modelagem melhor seria:

```text
Ave:
comportamentos gerais de ave.

AveVoadora:
contrato para aves que voam.

Pinguim:
é Ave, mas não é AveVoadora.

Aguia:
é Ave e é AveVoadora.
```

O ponto:

```text
não force herança onde o subtipo não cumpre o contrato.
```

---

## Tradução para backend

Exemplo ruim:

```java
abstract class Relatorio {
    abstract String exportarPdf();
    abstract String exportarCsv();
}
```

Se existe relatório que só exporta CSV, ele vai implementar PDF jogando:

```java
UnsupportedOperationException
```

Isso quebra LSP.

Melhor separar contratos.

---

# Parte 7 — Exemplo ruim de exportação

## RelatorioPedido

Crie:

```text
src\br\com\curso\aula218\dto\RelatorioPedido.java
```

Código:

```java
package br.com.curso.aula218.dto;

public record RelatorioPedido(
        String codigo,
        String cliente,
        String valor
) {
}
```

---

## RelatorioExportadorRuim

Crie:

```text
src\br\com\curso\aula218\ruim\RelatorioExportadorRuim.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dto.RelatorioPedido;

public abstract class RelatorioExportadorRuim {
    public abstract String exportarCsv(RelatorioPedido relatorio);

    public abstract String exportarPdf(RelatorioPedido relatorio);
}
```

---

## RelatorioApenasCsv

Crie:

```text
src\br\com\curso\aula218\ruim\RelatorioApenasCsv.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dto.RelatorioPedido;

public class RelatorioApenasCsv extends RelatorioExportadorRuim {
    @Override
    public String exportarCsv(RelatorioPedido relatorio) {
        return String.join(
                ";",
                relatorio.codigo(),
                relatorio.cliente(),
                relatorio.valor()
        );
    }

    @Override
    public String exportarPdf(RelatorioPedido relatorio) {
        throw new UnsupportedOperationException("Exportação PDF não suportada.");
    }
}
```

---

## RelatorioApenasPdf

Crie:

```text
src\br\com\curso\aula218\ruim\RelatorioApenasPdf.java
```

Código:

```java
package br.com.curso.aula218.ruim;

import br.com.curso.aula218.dto.RelatorioPedido;

public class RelatorioApenasPdf extends RelatorioExportadorRuim {
    @Override
    public String exportarCsv(RelatorioPedido relatorio) {
        throw new UnsupportedOperationException("Exportação CSV não suportada.");
    }

    @Override
    public String exportarPdf(RelatorioPedido relatorio) {
        return "PDF SIMULADO | " + relatorio.codigo()
                + " | " + relatorio.cliente()
                + " | " + relatorio.valor();
    }
}
```

---

## RelatorioExportadorRuimApp

Crie:

```text
src\br\com\curso\aula218\app\RelatorioExportadorRuimApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dto.RelatorioPedido;
import br.com.curso.aula218.ruim.RelatorioApenasCsv;
import br.com.curso.aula218.ruim.RelatorioExportadorRuim;

public class RelatorioExportadorRuimApp {
    public static void main(String[] args) {
        RelatorioPedido relatorio = new RelatorioPedido(
                "PED-001",
                "Ana",
                "1500.00"
        );

        RelatorioExportadorRuim exportador = new RelatorioApenasCsv();

        System.out.println("CSV:");
        System.out.println(exportador.exportarCsv(relatorio));

        System.out.println();
        System.out.println("PDF:");

        try {
            System.out.println(exportador.exportarPdf(relatorio));
        } catch (UnsupportedOperationException erro) {
            System.out.println("Falha LSP: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula218.app.RelatorioExportadorRuimApp
```

---

## Diagnóstico

`RelatorioApenasCsv` herda um contrato que não consegue cumprir.

Isso quebra LSP.

Também aponta para o próximo princípio:

```text
ISP — Interface Segregation Principle.
```

Quando uma abstração obriga implementações a ter métodos que não fazem sentido, o design está errado.

---

# Parte 8 — Exportação respeitando LSP

## ExportadorRelatorio

Crie:

```text
src\br\com\curso\aula218\lsp\exportacao\ExportadorRelatorio.java
```

Código:

```java
package br.com.curso.aula218.lsp.exportacao;

import br.com.curso.aula218.dto.RelatorioPedido;

public interface ExportadorRelatorio {
    String formato();

    String exportar(RelatorioPedido relatorio);
}
```

---

## ExportadorRelatorioCsv

Crie:

```text
src\br\com\curso\aula218\lsp\exportacao\ExportadorRelatorioCsv.java
```

Código:

```java
package br.com.curso.aula218.lsp.exportacao;

import br.com.curso.aula218.dto.RelatorioPedido;

public class ExportadorRelatorioCsv implements ExportadorRelatorio {
    @Override
    public String formato() {
        return "CSV";
    }

    @Override
    public String exportar(RelatorioPedido relatorio) {
        return String.join(
                ";",
                relatorio.codigo(),
                relatorio.cliente(),
                relatorio.valor()
        );
    }
}
```

---

## ExportadorRelatorioPdfSimulado

Crie:

```text
src\br\com\curso\aula218\lsp\exportacao\ExportadorRelatorioPdfSimulado.java
```

Código:

```java
package br.com.curso.aula218.lsp.exportacao;

import br.com.curso.aula218.dto.RelatorioPedido;

public class ExportadorRelatorioPdfSimulado implements ExportadorRelatorio {
    @Override
    public String formato() {
        return "PDF";
    }

    @Override
    public String exportar(RelatorioPedido relatorio) {
        return "PDF SIMULADO | " + relatorio.codigo()
                + " | " + relatorio.cliente()
                + " | " + relatorio.valor();
    }
}
```

---

## RelatorioExportacaoService

Crie:

```text
src\br\com\curso\aula218\lsp\service\RelatorioExportacaoService.java
```

Código:

```java
package br.com.curso.aula218.lsp.service;

import br.com.curso.aula218.dto.RelatorioPedido;
import br.com.curso.aula218.lsp.exportacao.ExportadorRelatorio;

import java.util.List;

public class RelatorioExportacaoService {
    private final List<ExportadorRelatorio> exportadores;

    public RelatorioExportacaoService(List<ExportadorRelatorio> exportadores) {
        if (exportadores == null || exportadores.isEmpty()) {
            throw new IllegalArgumentException("Exportadores são obrigatórios.");
        }

        this.exportadores = List.copyOf(exportadores);
    }

    public String exportar(RelatorioPedido relatorio, String formato) {
        if (relatorio == null) {
            throw new IllegalArgumentException("Relatório é obrigatório.");
        }

        if (formato == null || formato.isBlank()) {
            throw new IllegalArgumentException("Formato é obrigatório.");
        }

        String normalizado = formato.trim().toUpperCase();

        return exportadores.stream()
                .filter(exportador -> exportador.formato().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Formato não suportado: " + formato))
                .exportar(relatorio);
    }
}
```

---

## RelatorioExportadorLspApp

Crie:

```text
src\br\com\curso\aula218\app\RelatorioExportadorLspApp.java
```

Código:

```java
package br.com.curso.aula218.app;

import br.com.curso.aula218.dto.RelatorioPedido;
import br.com.curso.aula218.lsp.exportacao.ExportadorRelatorioCsv;
import br.com.curso.aula218.lsp.exportacao.ExportadorRelatorioPdfSimulado;
import br.com.curso.aula218.lsp.service.RelatorioExportacaoService;

import java.util.List;

public class RelatorioExportadorLspApp {
    public static void main(String[] args) {
        RelatorioPedido relatorio = new RelatorioPedido(
                "PED-001",
                "Ana",
                "1500.00"
        );

        RelatorioExportacaoService service = new RelatorioExportacaoService(List.of(
                new ExportadorRelatorioCsv(),
                new ExportadorRelatorioPdfSimulado()
        ));

        System.out.println("CSV:");
        System.out.println(service.exportar(relatorio, "CSV"));

        System.out.println();
        System.out.println("PDF:");
        System.out.println(service.exportar(relatorio, "PDF"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula218.app.RelatorioExportadorLspApp
```

---

## O que melhorou

Agora cada exportador promete apenas:

```java
String exportar(RelatorioPedido relatorio)
```

E cumpre.

Não existe método obrigatório sem sentido.

Isso respeita LSP e prepara ISP.

---

# Parte 9 — Pré-condições e pós-condições

## Pré-condição

Pré-condição é o que precisa ser verdadeiro antes do método executar.

Exemplo:

```text
pedido não pode ser null;
valor deve ser positivo;
data deve estar preenchida.
```

Uma implementação não deve exigir pré-condições mais fortes do que o contrato prometeu.

---

## Exemplo de violação

Contrato:

```text
CanalNotificacao.enviar aceita qualquer MensagemNotificacao válida.
```

Implementação ruim:

```text
EmailCorporativoNotificacao só aceita destino com @empresa.com.
```

Se isso não está no contrato, ela exige condição mais forte.

Isso pode quebrar substituição.

---

## Pós-condição

Pós-condição é o que deve ser verdadeiro depois do método executar.

Exemplo:

```text
calcular desconto retorna valor não nulo;
desconto não é negativo;
exportar retorna texto não vazio;
buscar retorna Optional, nunca null.
```

Uma implementação não deve enfraquecer a pós-condição.

---

## Exemplo de violação

Contrato:

```text
Repository.buscarPorCodigo retorna Optional<Pedido>.
```

Implementação ruim retorna:

```java
null
```

Isso quebra a expectativa.

Mesmo compilando, fere LSP.

---

# Parte 10 — Efeitos colaterais inesperados

Um método chamado:

```java
calcular(...)
```

normalmente não deveria:

```text
salvar no banco;
faturar pedido;
enviar e-mail;
alterar status;
registrar auditoria.
```

Se uma implementação faz isso, ela surpreende o chamador.

Isso fere LSP e SRP.

Exemplo que vimos:

```java
DescontoQueFaturaPedido
```

Ele deveria calcular desconto, mas faturou o pedido.

---

## Regra prática

Nome do contrato e comportamento real precisam combinar.

Se o contrato diz:

```text
calcular
```

calcule.

Se diz:

```text
salvar
```

salve.

Se diz:

```text
notificar
```

notifique.

Não esconda efeitos colaterais em contratos aparentemente puros.

---

# Parte 11 — LSP e herança

## Herança deve ser usada com cuidado

Pergunte:

```text
subtipo realmente é substituível pelo tipo base?
```

Não basta:

```text
parece parecido.
```

Precisa cumprir o mesmo comportamento esperado.

---

## Relação "é um"

Mesmo quando parece existir relação "é um", ainda pode ser perigoso.

Exemplo:

```text
Quadrado é um retângulo na matemática.
```

Mas em programação, se `Retangulo` permite alterar largura e altura separadamente, `Quadrado` não substitui bem `Retangulo`.

O modelo quebra.

---

## Prefira composição quando herança complicar

Em muitos casos, composição é mais segura:

```text
Pedido tem PoliticaDesconto.
Relatorio usa Exportador.
Service recebe Gateway.
Canal usa Mensagem.
```

Herança é útil, mas não deve ser automática.

---

# Parte 12 — LSP e interfaces

LSP também vale para interfaces.

Se uma classe implementa uma interface, ela deve cumprir o contrato.

Exemplo:

```java
public interface PedidoRepository {
    Optional<Pedido> buscarPorCodigo(String codigo);

    void salvar(Pedido pedido);
}
```

Implementação correta:

```text
retorna Optional.empty quando não encontra;
não retorna null;
salva pedido válido;
não altera pedido indevidamente.
```

Implementação ruim:

```text
retorna null;
lança UnsupportedOperationException;
salva só se for cliente VIP sem avisar no contrato;
apaga outros pedidos ao salvar.
```

---

# Parte 13 — LSP na prática do backend

## Repository

Contrato:

```text
buscar retorna Optional;
salvar persiste o objeto;
não deve retornar null.
```

Violação:

```text
implementação em memória retorna null;
implementação arquivo lança UnsupportedOperationException no salvar.
```

---

## Client/Gateway

Contrato:

```text
enviar mensagem para sistema externo;
retornar resposta padronizada;
lançar exception técnica em falha técnica.
```

Violação:

```text
retornar null em erro;
engolir falha;
lançar IllegalArgumentException para timeout;
alterar request de forma inesperada.
```

---

## Parser

Contrato:

```text
parsear linha válida;
lançar erro claro para linha inválida.
```

Violação:

```text
retornar objeto incompleto;
retornar null;
ignorar campos obrigatórios;
salvar no banco durante parse.
```

---

## PoliticaDesconto

Contrato:

```text
calcular desconto;
não alterar pedido;
retornar valor não negativo.
```

Violação:

```text
faturar pedido;
retornar null;
retornar negativo;
enviar notificação.
```

---

# Parte 14 — Como detectar violação de LSP

Pergunte:

```text
1. Posso trocar a implementação sem mudar o código chamador?
2. O subtipo lança UnsupportedOperationException?
3. O subtipo retorna null onde o contrato espera Optional ou valor?
4. O subtipo exige condição extra não prevista?
5. O subtipo entrega resultado mais fraco?
6. O subtipo muda estado inesperadamente?
7. O chamador precisa usar instanceof?
8. O chamador precisa conhecer detalhes do subtipo?
9. O nome do método bate com o comportamento real?
10. Existe herança apenas por conveniência?
```

Se várias respostas forem sim, há risco de LSP.

---

# Parte 15 — LSP e testes

Um bom teste de LSP é testar implementações pelo contrato.

Exemplo conceitual:

```java
List<PoliticaDesconto> politicas = List.of(
        new DescontoVipCorreto(),
        new DescontoComumCorreto()
);

for (PoliticaDesconto politica : politicas) {
    BigDecimal desconto = politica.calcular(pedido);
    assert desconto != null;
    assert desconto.compareTo(BigDecimal.ZERO) >= 0;
}
```

Ainda não estamos no módulo de testes automatizados.

Mas a ideia é:

```text
contratos devem ter comportamentos verificáveis.
```

---

# Parte 16 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula218.app.LspViolacaoNullApp
java -cp out br.com.curso.aula218.app.LspViolacaoEfeitoColateralApp
java -cp out br.com.curso.aula218.app.LspViolacaoUnsupportedApp
java -cp out br.com.curso.aula218.app.LspDescontoCorretoApp
java -cp out br.com.curso.aula218.app.RelatorioExportadorRuimApp
java -cp out br.com.curso.aula218.app.RelatorioExportadorLspApp
```

Depois responda:

```text
1. Qual implementação retornou null?
2. Qual implementação alterou o pedido?
3. Qual implementação lançou UnsupportedOperationException?
4. Por que isso quebra LSP?
5. Qual versão de exportação era ruim?
6. Por que RelatorioApenasCsv não substitui bem RelatorioExportadorRuim?
7. Qual versão respeita melhor LSP?
8. Como LSP se relaciona com ISP no exemplo de exportação?
```

---

# Parte 17 — Exercício prático

## Contexto

Você vai modelar formas de pagamento respeitando LSP.

---

## Domínio Pagamento

Crie:

```text
PagamentoRequest
```

Campos:

```text
String codigoPedido;
BigDecimal valor;
String cliente;
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

## Contrato

Crie interface:

```java
public interface ProcessadorPagamento {
    String tipo();

    PagamentoResultado processar(PagamentoRequest request);
}
```

Contrato esperado:

```text
request obrigatório;
valor positivo;
retornar PagamentoResultado não nulo;
não retornar mensagem nula;
não lançar UnsupportedOperationException para request válido;
falha de negócio deve virar PagamentoResultado reprovado;
falha técnica pode lançar exception técnica.
```

---

## Implementações corretas

Crie:

```text
ProcessadorPix;
ProcessadorCartaoCredito;
ProcessadorBoleto.
```

Regras simuladas:

```text
PIX:
aprova se valor <= 5000.

CARTAO:
aprova se valor <= 3000.

BOLETO:
sempre retorna aprovado com mensagem "Boleto gerado".
```

---

## Implementações ruins

Crie exemplos:

```text
ProcessadorBoletoRuimQueRetornaNull;
ProcessadorCartaoRuimQueLancaUnsupported;
ProcessadorPixRuimQueAlteraRequest.
```

Se o request for imutável, o último não conseguirá alterar, e isso é bom.

---

## Service

Crie:

```text
PagamentoService
```

Que recebe:

```java
List<ProcessadorPagamento>
```

Método:

```java
PagamentoResultado pagar(String tipo, PagamentoRequest request)
```

---

## App

Crie:

```text
PagamentoLspApp
```

Execute:

```text
PIX;
CARTAO;
BOLETO;
tipo não suportado;
implementação ruim retornando null.
```

---

## Critérios

```text
service depende da interface;
implementações corretas respeitam contrato;
não usar UnsupportedOperationException em implementação válida;
não retornar null;
resultado de negócio deve ser objeto;
falha técnica pode ser exception.
```

---

# Parte 18 — Desafio extra

## Repository LSP

Crie interface:

```java
public interface PedidoRepository {
    Optional<Pedido> buscarPorCodigo(String codigo);

    void salvar(Pedido pedido);
}
```

Crie implementações:

```text
PedidoRepositoryMemoriaCorreto;
PedidoRepositoryRuimRetornaNull;
PedidoRepositoryRuimNaoSalva.
```

Crie um app mostrando:

```text
service funciona com implementação correta;
service quebra com implementação que retorna null;
service tem comportamento falso com implementação que não salva.
```

Objetivo:

```text
entender que LSP também vale para repository.
```

---

# Parte 19 — Simulado rápido

## Questão 1

LSP significa:

```text
A) Subtipos devem poder substituir tipos base sem quebrar comportamento esperado.
B) Toda classe deve ter um método.
C) Toda classe deve ser final.
D) Todo if deve virar interface.
```

---

## Questão 2

Qual é um sinal forte de violação de LSP?

```text
A) UnsupportedOperationException em método que o contrato promete.
B) Validação de null.
C) Uso de BigDecimal.
D) Uso de package.
```

---

## Questão 3

Uma implementação de `PoliticaDesconto.calcular` retornar `null` é:

```text
A) Aceitável se compilar.
B) Violação do contrato se o esperado é BigDecimal não nulo.
C) Obrigatório em Java.
D) Exemplo de encapsulamento.
```

---

## Questão 4

Uma implementação de cálculo de desconto faturar o pedido durante o cálculo é:

```text
A) Efeito colateral inesperado.
B) Boa prática obrigatória.
C) Necessário para OCP.
D) Exemplo de DTO.
```

---

## Questão 5

Se uma classe filha precisa lançar `UnsupportedOperationException` para método herdado, pode indicar:

```text
A) Herança ou contrato mal modelado.
B) Que o código está perfeito.
C) Que SRP sempre foi cumprido.
D) Que a classe deveria ser record.
```

---

## Gabarito

```text
1. A
2. A
3. B
4. A
5. A
```

---

# Parte 20 — Checklist LSP

Marque mentalmente:

```text
[ ] Sei explicar LSP.
[ ] Sei que compilar não basta.
[ ] Sei que subtipo precisa cumprir contrato.
[ ] Sei identificar UnsupportedOperationException suspeito.
[ ] Sei identificar retorno null indevido.
[ ] Sei identificar efeito colateral inesperado.
[ ] Sei explicar pré-condição.
[ ] Sei explicar pós-condição.
[ ] Sei que LSP vale para classes e interfaces.
[ ] Sei que herança deve representar substituição real.
[ ] Sei que composição pode ser melhor que herança.
[ ] Sei como LSP protege OCP.
[ ] Sei que o próximo princípio, ISP, aprofunda contratos menores.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é LSP?
2. Por que compilar não garante LSP?
3. O que é contrato de comportamento?
4. Por que UnsupportedOperationException pode indicar violação?
5. Por que retornar null pode violar LSP?
6. O que é pré-condição?
7. O que é pós-condição?
8. Por que efeito colateral inesperado é perigoso?
9. Qual relação entre LSP e OCP?
10. Quando preferir composição em vez de herança?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar LSP;
identificar subtipo que quebra contrato;
identificar implementação que retorna null indevido;
identificar UnsupportedOperationException suspeito;
identificar efeito colateral inesperado;
entender pré-condições e pós-condições;
corrigir contrato de exportação;
modelar implementações de desconto seguras;
resolver o desafio de pagamento;
entender por que ISP vem depois de LSP.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-218-lsp-liskov-substitution-principle
git commit -m "Aula 218: lsp liskov substitution principle"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
um subtipo precisa cumprir o contrato que promete.
```

Você estudou:

```text
LSP;
substituição;
contrato de comportamento;
pré-condições;
pós-condições;
efeitos colaterais;
UnsupportedOperationException;
retorno null indevido;
herança mal modelada;
interfaces respeitadas;
desconto;
exportação;
repository;
pagamento.
```

Também reforçou:

```text
OCP permite adicionar implementações;
LSP garante que essas implementações sejam confiáveis.
```

Na próxima aula, vamos estudar:

```text
ISP — Interface Segregation Principle.
```

A ideia será entender por que interfaces grandes demais forçam implementações ruins e acabam levando a violações de LSP.
