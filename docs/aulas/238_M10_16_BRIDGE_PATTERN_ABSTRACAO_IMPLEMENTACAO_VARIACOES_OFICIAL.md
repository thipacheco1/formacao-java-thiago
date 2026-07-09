# 238 — M10.16 — Bridge Pattern: abstração, implementação e variações

## Objetivo da aula

Na aula anterior, você estudou:

```text
Flyweight Pattern
```

Você viu que Flyweight ajuda quando muitos objetos compartilham dados repetidos e imutáveis, reduzindo consumo de memória em cenários como:

```text
produtos de referência;
permissões;
templates de mensagem;
tipos de serviço;
códigos de ocorrência;
dados de catálogo;
dados auxiliares.
```

Agora vamos estudar um padrão estrutural muito importante para evitar explosão de classes:

```text
Bridge Pattern
```

Em português:

```text
Padrão Ponte
```

Bridge aparece quando existem duas dimensões que variam de forma independente.

Exemplos comuns em backend:

```text
relatório por tipo e formato;
notificação por mensagem e canal;
pagamento por operação e provedor;
exportação por conteúdo e destino;
auditoria por evento e mecanismo de armazenamento;
envio por template e transportador;
documento por modelo e renderizador;
integração por caso de uso e client externo;
processamento por regra e mecanismo de execução;
arquivo por layout e storage.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Bridge resolve;
identificar duas dimensões de variação;
separar abstração de implementação;
criar uma abstração de alto nível;
criar uma implementação de baixo nível;
combinar variações sem explosão de classes;
aplicar Bridge em relatórios;
aplicar Bridge em notificações;
aplicar Bridge em pagamento;
diferenciar Bridge de Adapter;
diferenciar Bridge de Strategy;
diferenciar Bridge de Decorator;
entender quando Bridge ajuda e quando é exagero.
```

---

## Ideia principal

Bridge separa:

```text
abstração
```

de:

```text
implementação
```

para que as duas possam variar independentemente.

Exemplo:

```text
Tipos de relatório:
- vendas;
- financeiro;
- atendimento.

Formatos de saída:
- PDF;
- CSV;
- JSON.
```

Sem Bridge, você pode criar classes assim:

```text
RelatorioVendasPdf
RelatorioVendasCsv
RelatorioVendasJson
RelatorioFinanceiroPdf
RelatorioFinanceiroCsv
RelatorioFinanceiroJson
RelatorioAtendimentoPdf
RelatorioAtendimentoCsv
RelatorioAtendimentoJson
```

São 3 tipos x 3 formatos = 9 classes.

Se adicionar mais 2 tipos e 2 formatos, cresce muito.

Com Bridge:

```text
RelatorioVendas usa ExportadorRelatorio.
RelatorioFinanceiro usa ExportadorRelatorio.
RelatorioAtendimento usa ExportadorRelatorio.

ExportadorPdf.
ExportadorCsv.
ExportadorJson.
```

Agora você combina as partes.

---

## Bridge em uma frase prática

```text
Use Bridge quando duas dimensões variam de forma independente e combiná-las por herança geraria muitas classes.
```

Ou:

```text
Bridge troca explosão de herança por composição.
```

---

## Problema sem Bridge

Imagine uma plataforma de notificações.

Você tem tipos de notificação:

```text
boas-vindas;
pedido pago;
ordem de serviço criada;
entrega confirmada.
```

E canais:

```text
WhatsApp;
e-mail;
SMS;
push.
```

Sem Bridge, você pode acabar com:

```text
BoasVindasWhatsApp
BoasVindasEmail
BoasVindasSms
BoasVindasPush

PedidoPagoWhatsApp
PedidoPagoEmail
PedidoPagoSms
PedidoPagoPush

OsCriadaWhatsApp
OsCriadaEmail
OsCriadaSms
OsCriadaPush
```

Quanto mais tipos e canais, mais classes.

Bridge separa:

```text
Notificacao
```

de:

```text
CanalEnvio
```

Assim uma notificação usa um canal.

---

## Relação com SOLID

## SRP

A abstração cuida da regra de alto nível.

A implementação cuida do detalhe técnico.

Exemplo:

```text
RelatorioFinanceiro:
monta conteúdo financeiro.

ExportadorCsv:
exporta em CSV.
```

---

## OCP

Você pode adicionar novo formato sem alterar os relatórios.

Você pode adicionar novo relatório sem alterar os formatos.

---

## LSP

Toda implementação precisa cumprir o contrato.

Se `ExportadorRelatorio` promete exportar, `ExportadorCsv`, `ExportadorJson` e `ExportadorTexto` precisam devolver uma saída válida.

---

## ISP

Contratos devem ser pequenos.

Evite uma interface de implementação com métodos que nem todo implementador usa.

---

## DIP

A abstração depende de uma interface de implementação, não de uma classe concreta.

Exemplo:

```java
private final ExportadorRelatorio exportador;
```

E não:

```java
private final ExportadorCsv exportador;
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

Com Bridge:

```text
A abstração representa a regra de alto nível.
A implementação representa uma variação técnica.
O use case pode combinar abstração e implementação.
O repository continua salvando.
O client continua integrando.
O controller futuro continua recebendo.
```

Bridge não substitui entidade, use case ou adapter.

---

# Parte 1 — Bridge vs Adapter

## Adapter

Adapter adapta uma interface incompatível.

```text
ExternalPaymentClient -> PagamentoGateway
```

Ele normalmente aparece porque algo externo já existe com contrato diferente.

---

## Bridge

Bridge é desenhado para separar duas dimensões que variam.

```text
Relatorio -> ExportadorRelatorio
Notificacao -> CanalEnvio
Pagamento -> ProvedorPagamento
```

---

## Diferença prática

```text
Adapter:
tenho uma interface incompatível e preciso adaptar.

Bridge:
tenho duas hierarquias/variações e quero separá-las.
```

---

# Parte 2 — Bridge vs Strategy

Bridge e Strategy também se parecem, porque ambos usam composição.

## Strategy

Varia um algoritmo ou uma política.

```text
calcular desconto;
calcular frete;
calcular prioridade.
```

## Bridge

Separa abstração e implementação para que ambas variem.

```text
relatório varia por tipo;
exportação varia por formato.
```

---

## Diferença prática

```text
Strategy:
troco uma regra dentro de um contexto.

Bridge:
separo duas dimensões completas que evoluem independentemente.
```

---

# Parte 3 — Bridge vs Decorator

## Decorator

Adiciona comportamento mantendo o mesmo contrato.

```text
service com log;
service com cache;
service com métricas.
```

## Bridge

Separa abstração de implementação.

```text
NotificacaoPedidoPago usa CanalEnvio.
RelatorioFinanceiro usa ExportadorRelatorio.
```

Diferença prática:

```text
Decorator:
envolve para adicionar comportamento.

Bridge:
compõe para separar variações.
```

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-238-bridge-pattern-abstracao-implementacao-variacoes
cd labs\m10\aula-238-bridge-pattern-abstracao-implementacao-variacoes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula238

mkdir src\br\com\curso\aula238\app

mkdir src\br\com\curso\aula238\relatorio
mkdir src\br\com\curso\aula238\relatorio\abstracao
mkdir src\br\com\curso\aula238\relatorio\implementacao

mkdir src\br\com\curso\aula238\notificacao
mkdir src\br\com\curso\aula238\notificacao\abstracao
mkdir src\br\com\curso\aula238\notificacao\implementacao

mkdir src\br\com\curso\aula238\pagamento
mkdir src\br\com\curso\aula238\pagamento\abstracao
mkdir src\br\com\curso\aula238\pagamento\implementacao
```

---

# Parte 5 — Exemplo ruim: explosão de classes

Antes de aplicar Bridge, entenda o problema.

Imagine relatórios com tipos e formatos.

Sem Bridge:

```text
RelatorioVendasCsv
RelatorioVendasJson
RelatorioFinanceiroCsv
RelatorioFinanceiroJson
RelatorioAtendimentoCsv
RelatorioAtendimentoJson
```

Se adicionar PDF:

```text
RelatorioVendasPdf
RelatorioFinanceiroPdf
RelatorioAtendimentoPdf
```

Se adicionar Relatório de Contratos:

```text
RelatorioContratosCsv
RelatorioContratosJson
RelatorioContratosPdf
```

Esse crescimento é multiplicativo.

Bridge troca essa multiplicação por soma.

```text
Tipos de relatório: 4
Formatos: 3
Total com Bridge: 7 classes principais
Total por combinação: 12 classes se fizer tudo por herança
```

---

# Parte 6 — Exemplo 1: relatórios

Vamos separar duas dimensões:

## Dimensão 1 — Abstração

```text
Relatorio
RelatorioVendas
RelatorioFinanceiro
RelatorioAtendimento
```

## Dimensão 2 — Implementação

```text
ExportadorRelatorio
ExportadorCsv
ExportadorJson
ExportadorTexto
```

---

## ExportadorRelatorio

Crie:

```text
src\br\com\curso\aula238\relatorio\implementacao\ExportadorRelatorio.java
```

Código:

```java
package br.com.curso.aula238.relatorio.implementacao;

import java.util.List;
import java.util.Map;

public interface ExportadorRelatorio {
    String exportar(String titulo, List<Map<String, String>> linhas);
}
```

---

## ExportadorCsv

Crie:

```text
src\br\com\curso\aula238\relatorio\implementacao\ExportadorCsv.java
```

Código:

```java
package br.com.curso.aula238.relatorio.implementacao;

import java.util.List;
import java.util.Map;

public class ExportadorCsv implements ExportadorRelatorio {
    @Override
    public String exportar(String titulo, List<Map<String, String>> linhas) {
        if (linhas == null || linhas.isEmpty()) {
            return titulo + "\nsem dados";
        }

        StringBuilder builder = new StringBuilder();
        builder.append(titulo).append("\n");

        Map<String, String> primeiraLinha = linhas.get(0);

        builder.append(String.join(";", primeiraLinha.keySet())).append("\n");

        for (Map<String, String> linha : linhas) {
            builder.append(String.join(";", linha.values())).append("\n");
        }

        return builder.toString();
    }
}
```

---

## ExportadorJson

Crie:

```text
src\br\com\curso\aula238\relatorio\implementacao\ExportadorJson.java
```

Código:

```java
package br.com.curso.aula238.relatorio.implementacao;

import java.util.List;
import java.util.Map;

public class ExportadorJson implements ExportadorRelatorio {
    @Override
    public String exportar(String titulo, List<Map<String, String>> linhas) {
        StringBuilder builder = new StringBuilder();

        builder.append("{\n");
        builder.append("  \"titulo\": \"").append(titulo).append("\",\n");
        builder.append("  \"linhas\": [\n");

        for (int i = 0; i < linhas.size(); i++) {
            Map<String, String> linha = linhas.get(i);

            builder.append("    {");

            int contador = 0;
            for (Map.Entry<String, String> entrada : linha.entrySet()) {
                if (contador > 0) {
                    builder.append(", ");
                }

                builder.append("\"").append(entrada.getKey()).append("\": ");
                builder.append("\"").append(entrada.getValue()).append("\"");

                contador++;
            }

            builder.append("}");

            if (i < linhas.size() - 1) {
                builder.append(",");
            }

            builder.append("\n");
        }

        builder.append("  ]\n");
        builder.append("}");

        return builder.toString();
    }
}
```

---

## ExportadorTexto

Crie:

```text
src\br\com\curso\aula238\relatorio\implementacao\ExportadorTexto.java
```

Código:

```java
package br.com.curso.aula238.relatorio.implementacao;

import java.util.List;
import java.util.Map;

public class ExportadorTexto implements ExportadorRelatorio {
    @Override
    public String exportar(String titulo, List<Map<String, String>> linhas) {
        StringBuilder builder = new StringBuilder();

        builder.append("==== ").append(titulo).append(" ====\n");

        for (Map<String, String> linha : linhas) {
            for (Map.Entry<String, String> entrada : linha.entrySet()) {
                builder.append(entrada.getKey())
                        .append(": ")
                        .append(entrada.getValue())
                        .append("\n");
            }

            builder.append("---\n");
        }

        return builder.toString();
    }
}
```

---

# Parte 7 — Abstração de relatório

## Relatorio

Crie:

```text
src\br\com\curso\aula238\relatorio\abstracao\Relatorio.java
```

Código:

```java
package br.com.curso.aula238.relatorio.abstracao;

import br.com.curso.aula238.relatorio.implementacao.ExportadorRelatorio;

import java.util.List;
import java.util.Map;

public abstract class Relatorio {
    protected final ExportadorRelatorio exportador;

    protected Relatorio(ExportadorRelatorio exportador) {
        if (exportador == null) {
            throw new IllegalArgumentException("Exportador é obrigatório.");
        }

        this.exportador = exportador;
    }

    public final String gerar() {
        return exportador.exportar(titulo(), dados());
    }

    protected abstract String titulo();

    protected abstract List<Map<String, String>> dados();
}
```

---

## RelatorioVendas

Crie:

```text
src\br\com\curso\aula238\relatorio\abstracao\RelatorioVendas.java
```

Código:

```java
package br.com.curso.aula238.relatorio.abstracao;

import br.com.curso.aula238.relatorio.implementacao.ExportadorRelatorio;

import java.util.List;
import java.util.Map;

public class RelatorioVendas extends Relatorio {
    public RelatorioVendas(ExportadorRelatorio exportador) {
        super(exportador);
    }

    @Override
    protected String titulo() {
        return "Relatório de Vendas";
    }

    @Override
    protected List<Map<String, String>> dados() {
        return List.of(
                Map.of("pedido", "PED-001", "cliente", "Ana", "valor", "1500.00"),
                Map.of("pedido", "PED-002", "cliente", "Carlos", "valor", "800.00")
        );
    }
}
```

---

## RelatorioFinanceiro

Crie:

```text
src\br\com\curso\aula238\relatorio\abstracao\RelatorioFinanceiro.java
```

Código:

```java
package br.com.curso.aula238.relatorio.abstracao;

import br.com.curso.aula238.relatorio.implementacao.ExportadorRelatorio;

import java.util.List;
import java.util.Map;

public class RelatorioFinanceiro extends Relatorio {
    public RelatorioFinanceiro(ExportadorRelatorio exportador) {
        super(exportador);
    }

    @Override
    protected String titulo() {
        return "Relatório Financeiro";
    }

    @Override
    protected List<Map<String, String>> dados() {
        return List.of(
                Map.of("conta", "Receita", "valor", "2300.00"),
                Map.of("conta", "Custo", "valor", "900.00")
        );
    }
}
```

---

## RelatorioAtendimento

Crie:

```text
src\br\com\curso\aula238\relatorio\abstracao\RelatorioAtendimento.java
```

Código:

```java
package br.com.curso.aula238.relatorio.abstracao;

import br.com.curso.aula238.relatorio.implementacao.ExportadorRelatorio;

import java.util.List;
import java.util.Map;

public class RelatorioAtendimento extends Relatorio {
    public RelatorioAtendimento(ExportadorRelatorio exportador) {
        super(exportador);
    }

    @Override
    protected String titulo() {
        return "Relatório de Atendimento";
    }

    @Override
    protected List<Map<String, String>> dados() {
        return List.of(
                Map.of("os", "OS-001", "status", "CONCLUIDA", "tempo", "02:30"),
                Map.of("os", "OS-002", "status", "FRUSTRADA", "tempo", "01:10")
        );
    }
}
```

---

# Parte 8 — Apps de relatório

## RelatorioBridgeApp

Crie:

```text
src\br\com\curso\aula238\app\RelatorioBridgeApp.java
```

Código:

```java
package br.com.curso.aula238.app;

import br.com.curso.aula238.relatorio.abstracao.Relatorio;
import br.com.curso.aula238.relatorio.abstracao.RelatorioAtendimento;
import br.com.curso.aula238.relatorio.abstracao.RelatorioFinanceiro;
import br.com.curso.aula238.relatorio.abstracao.RelatorioVendas;
import br.com.curso.aula238.relatorio.implementacao.ExportadorCsv;
import br.com.curso.aula238.relatorio.implementacao.ExportadorJson;
import br.com.curso.aula238.relatorio.implementacao.ExportadorTexto;

public class RelatorioBridgeApp {
    public static void main(String[] args) {
        Relatorio vendasCsv = new RelatorioVendas(new ExportadorCsv());
        Relatorio vendasJson = new RelatorioVendas(new ExportadorJson());
        Relatorio financeiroTexto = new RelatorioFinanceiro(new ExportadorTexto());
        Relatorio atendimentoCsv = new RelatorioAtendimento(new ExportadorCsv());

        System.out.println(vendasCsv.gerar());
        System.out.println(vendasJson.gerar());
        System.out.println(financeiroTexto.gerar());
        System.out.println(atendimentoCsv.gerar());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula238.app.RelatorioBridgeApp
```

---

## O que observar

Você combinou:

```text
RelatorioVendas + ExportadorCsv
RelatorioVendas + ExportadorJson
RelatorioFinanceiro + ExportadorTexto
RelatorioAtendimento + ExportadorCsv
```

Sem criar classes específicas para cada combinação.

Isso é Bridge.

---

# Parte 9 — Adicionando novo formato sem mexer nos relatórios

Agora adicione um novo exportador.

## ExportadorMarkdown

Crie:

```text
src\br\com\curso\aula238\relatorio\implementacao\ExportadorMarkdown.java
```

Código:

```java
package br.com.curso.aula238.relatorio.implementacao;

import java.util.List;
import java.util.Map;

public class ExportadorMarkdown implements ExportadorRelatorio {
    @Override
    public String exportar(String titulo, List<Map<String, String>> linhas) {
        if (linhas == null || linhas.isEmpty()) {
            return "# " + titulo + "\n\nSem dados.";
        }

        StringBuilder builder = new StringBuilder();

        builder.append("# ").append(titulo).append("\n\n");

        Map<String, String> primeiraLinha = linhas.get(0);

        builder.append("| ");
        for (String coluna : primeiraLinha.keySet()) {
            builder.append(coluna).append(" | ");
        }

        builder.append("\n| ");
        for (int i = 0; i < primeiraLinha.size(); i++) {
            builder.append("--- | ");
        }

        builder.append("\n");

        for (Map<String, String> linha : linhas) {
            builder.append("| ");
            for (String valor : linha.values()) {
                builder.append(valor).append(" | ");
            }
            builder.append("\n");
        }

        return builder.toString();
    }
}
```

---

## RelatorioMarkdownBridgeApp

Crie:

```text
src\br\com\curso\aula238\app\RelatorioMarkdownBridgeApp.java
```

Código:

```java
package br.com.curso.aula238.app;

import br.com.curso.aula238.relatorio.abstracao.Relatorio;
import br.com.curso.aula238.relatorio.abstracao.RelatorioFinanceiro;
import br.com.curso.aula238.relatorio.abstracao.RelatorioVendas;
import br.com.curso.aula238.relatorio.implementacao.ExportadorMarkdown;

public class RelatorioMarkdownBridgeApp {
    public static void main(String[] args) {
        Relatorio vendas = new RelatorioVendas(new ExportadorMarkdown());
        Relatorio financeiro = new RelatorioFinanceiro(new ExportadorMarkdown());

        System.out.println(vendas.gerar());
        System.out.println(financeiro.gerar());
    }
}
```

---

## Análise OCP

Você adicionou:

```text
ExportadorMarkdown
```

Sem alterar:

```text
RelatorioVendas;
RelatorioFinanceiro;
RelatorioAtendimento.
```

Essa é uma grande vantagem do Bridge.

---

# Parte 10 — Exemplo 2: notificações por canal

Agora vamos aplicar Bridge em notificações.

Duas dimensões:

## Abstração

```text
Notificacao;
NotificacaoBoasVindas;
NotificacaoPedidoPago;
NotificacaoOrdemServicoCriada.
```

## Implementação

```text
CanalEnvio;
CanalWhatsApp;
CanalEmail;
CanalSms.
```

---

## CanalEnvio

Crie:

```text
src\br\com\curso\aula238\notificacao\implementacao\CanalEnvio.java
```

Código:

```java
package br.com.curso.aula238.notificacao.implementacao;

public interface CanalEnvio {
    void enviar(String destino, String conteudo);
}
```

---

## CanalWhatsApp

Crie:

```text
src\br\com\curso\aula238\notificacao\implementacao\CanalWhatsApp.java
```

Código:

```java
package br.com.curso.aula238.notificacao.implementacao;

public class CanalWhatsApp implements CanalEnvio {
    @Override
    public void enviar(String destino, String conteudo) {
        System.out.println("[WHATSAPP] Para: " + destino + " | " + conteudo);
    }
}
```

---

## CanalEmail

Crie:

```text
src\br\com\curso\aula238\notificacao\implementacao\CanalEmail.java
```

Código:

```java
package br.com.curso.aula238.notificacao.implementacao;

public class CanalEmail implements CanalEnvio {
    @Override
    public void enviar(String destino, String conteudo) {
        System.out.println("[EMAIL] Para: " + destino + " | " + conteudo);
    }
}
```

---

## CanalSms

Crie:

```text
src\br\com\curso\aula238\notificacao\implementacao\CanalSms.java
```

Código:

```java
package br.com.curso.aula238.notificacao.implementacao;

public class CanalSms implements CanalEnvio {
    @Override
    public void enviar(String destino, String conteudo) {
        System.out.println("[SMS] Para: " + destino + " | " + conteudo);
    }
}
```

---

# Parte 11 — Abstração de notificação

## Notificacao

Crie:

```text
src\br\com\curso\aula238\notificacao\abstracao\Notificacao.java
```

Código:

```java
package br.com.curso.aula238.notificacao.abstracao;

import br.com.curso.aula238.notificacao.implementacao.CanalEnvio;

public abstract class Notificacao {
    protected final CanalEnvio canal;

    protected Notificacao(CanalEnvio canal) {
        if (canal == null) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        this.canal = canal;
    }

    public final void enviar(String destino) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        canal.enviar(destino, conteudo());
    }

    protected abstract String conteudo();
}
```

---

## NotificacaoBoasVindas

Crie:

```text
src\br\com\curso\aula238\notificacao\abstracao\NotificacaoBoasVindas.java
```

Código:

```java
package br.com.curso.aula238.notificacao.abstracao;

import br.com.curso.aula238.notificacao.implementacao.CanalEnvio;

public class NotificacaoBoasVindas extends Notificacao {
    private final String cliente;

    public NotificacaoBoasVindas(CanalEnvio canal, String cliente) {
        super(canal);

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.cliente = cliente.trim();
    }

    @Override
    protected String conteudo() {
        return "Olá, " + cliente + ". Seja bem-vindo ao nosso atendimento.";
    }
}
```

---

## NotificacaoPedidoPago

Crie:

```text
src\br\com\curso\aula238\notificacao\abstracao\NotificacaoPedidoPago.java
```

Código:

```java
package br.com.curso.aula238.notificacao.abstracao;

import br.com.curso.aula238.notificacao.implementacao.CanalEnvio;

public class NotificacaoPedidoPago extends Notificacao {
    private final String codigoPedido;

    public NotificacaoPedidoPago(CanalEnvio canal, String codigoPedido) {
        super(canal);

        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        this.codigoPedido = codigoPedido.trim().toUpperCase();
    }

    @Override
    protected String conteudo() {
        return "Seu pedido " + codigoPedido + " foi pago com sucesso.";
    }
}
```

---

## NotificacaoOrdemServicoCriada

Crie:

```text
src\br\com\curso\aula238\notificacao\abstracao\NotificacaoOrdemServicoCriada.java
```

Código:

```java
package br.com.curso.aula238.notificacao.abstracao;

import br.com.curso.aula238.notificacao.implementacao.CanalEnvio;

public class NotificacaoOrdemServicoCriada extends Notificacao {
    private final String codigoOs;

    public NotificacaoOrdemServicoCriada(CanalEnvio canal, String codigoOs) {
        super(canal);

        if (codigoOs == null || codigoOs.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        this.codigoOs = codigoOs.trim().toUpperCase();
    }

    @Override
    protected String conteudo() {
        return "Sua ordem de serviço " + codigoOs + " foi criada.";
    }
}
```

---

## NotificacaoBridgeApp

Crie:

```text
src\br\com\curso\aula238\app\NotificacaoBridgeApp.java
```

Código:

```java
package br.com.curso.aula238.app;

import br.com.curso.aula238.notificacao.abstracao.Notificacao;
import br.com.curso.aula238.notificacao.abstracao.NotificacaoBoasVindas;
import br.com.curso.aula238.notificacao.abstracao.NotificacaoOrdemServicoCriada;
import br.com.curso.aula238.notificacao.abstracao.NotificacaoPedidoPago;
import br.com.curso.aula238.notificacao.implementacao.CanalEmail;
import br.com.curso.aula238.notificacao.implementacao.CanalSms;
import br.com.curso.aula238.notificacao.implementacao.CanalWhatsApp;

public class NotificacaoBridgeApp {
    public static void main(String[] args) {
        Notificacao boasVindasWhatsApp = new NotificacaoBoasVindas(
                new CanalWhatsApp(),
                "Ana"
        );

        Notificacao pedidoPagoEmail = new NotificacaoPedidoPago(
                new CanalEmail(),
                "PED-001"
        );

        Notificacao osCriadaSms = new NotificacaoOrdemServicoCriada(
                new CanalSms(),
                "OS-001"
        );

        boasVindasWhatsApp.enviar("11999999999");
        pedidoPagoEmail.enviar("ana@email.com");
        osCriadaSms.enviar("11999999999");
    }
}
```

---

## O que melhorou

Você não criou:

```text
NotificacaoBoasVindasWhatsApp
NotificacaoBoasVindasEmail
NotificacaoBoasVindasSms
NotificacaoPedidoPagoWhatsApp
NotificacaoPedidoPagoEmail
...
```

Você separou:

```text
tipo de notificação
```

de:

```text
canal de envio
```

---

# Parte 12 — Exemplo 3: pagamento por provedor

Agora vamos aplicar Bridge em pagamento.

Duas dimensões:

## Abstração

```text
OperacaoPagamento;
PagamentoPix;
PagamentoCartao;
PagamentoBoleto.
```

## Implementação

```text
ProvedorPagamento;
ProvedorBancoA;
ProvedorBancoB;
ProvedorMock.
```

---

## ResultadoPagamento

Crie:

```text
src\br\com\curso\aula238\pagamento\ResultadoPagamento.java
```

Código:

```java
package br.com.curso.aula238.pagamento;

public record ResultadoPagamento(
        boolean aprovado,
        String codigoAutorizacao,
        String mensagem
) {
}
```

---

## ProvedorPagamento

Crie:

```text
src\br\com\curso\aula238\pagamento\implementacao\ProvedorPagamento.java
```

Código:

```java
package br.com.curso.aula238.pagamento.implementacao;

import br.com.curso.aula238.pagamento.ResultadoPagamento;

import java.math.BigDecimal;

public interface ProvedorPagamento {
    ResultadoPagamento processar(String tipo, String referencia, BigDecimal valor);
}
```

---

## ProvedorBancoA

Crie:

```text
src\br\com\curso\aula238\pagamento\implementacao\ProvedorBancoA.java
```

Código:

```java
package br.com.curso.aula238.pagamento.implementacao;

import br.com.curso.aula238.pagamento.ResultadoPagamento;

import java.math.BigDecimal;
import java.util.UUID;

public class ProvedorBancoA implements ProvedorPagamento {
    @Override
    public ResultadoPagamento processar(String tipo, String referencia, BigDecimal valor) {
        return new ResultadoPagamento(
                true,
                "BANCO-A-" + UUID.randomUUID(),
                "Pagamento " + tipo + " aprovado pelo Banco A para " + referencia + "."
        );
    }
}
```

---

## ProvedorBancoB

Crie:

```text
src\br\com\curso\aula238\pagamento\implementacao\ProvedorBancoB.java
```

Código:

```java
package br.com.curso.aula238.pagamento.implementacao;

import br.com.curso.aula238.pagamento.ResultadoPagamento;

import java.math.BigDecimal;
import java.util.UUID;

public class ProvedorBancoB implements ProvedorPagamento {
    @Override
    public ResultadoPagamento processar(String tipo, String referencia, BigDecimal valor) {
        if (valor.compareTo(new BigDecimal("10000.00")) > 0) {
            return new ResultadoPagamento(
                    false,
                    "",
                    "Banco B recusou pagamento acima de 10000.00."
            );
        }

        return new ResultadoPagamento(
                true,
                "BANCO-B-" + UUID.randomUUID(),
                "Pagamento " + tipo + " aprovado pelo Banco B para " + referencia + "."
        );
    }
}
```

---

# Parte 13 — Abstração de pagamento

## OperacaoPagamento

Crie:

```text
src\br\com\curso\aula238\pagamento\abstracao\OperacaoPagamento.java
```

Código:

```java
package br.com.curso.aula238.pagamento.abstracao;

import br.com.curso.aula238.pagamento.ResultadoPagamento;
import br.com.curso.aula238.pagamento.implementacao.ProvedorPagamento;

import java.math.BigDecimal;

public abstract class OperacaoPagamento {
    protected final ProvedorPagamento provedor;

    protected OperacaoPagamento(ProvedorPagamento provedor) {
        if (provedor == null) {
            throw new IllegalArgumentException("Provedor é obrigatório.");
        }

        this.provedor = provedor;
    }

    public final ResultadoPagamento pagar(String referencia, BigDecimal valor) {
        if (referencia == null || referencia.isBlank()) {
            throw new IllegalArgumentException("Referência é obrigatória.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        return provedor.processar(tipo(), referencia.trim().toUpperCase(), valor);
    }

    protected abstract String tipo();
}
```

---

## PagamentoPix

Crie:

```text
src\br\com\curso\aula238\pagamento\abstracao\PagamentoPix.java
```

Código:

```java
package br.com.curso.aula238.pagamento.abstracao;

import br.com.curso.aula238.pagamento.implementacao.ProvedorPagamento;

public class PagamentoPix extends OperacaoPagamento {
    public PagamentoPix(ProvedorPagamento provedor) {
        super(provedor);
    }

    @Override
    protected String tipo() {
        return "PIX";
    }
}
```

---

## PagamentoCartao

Crie:

```text
src\br\com\curso\aula238\pagamento\abstracao\PagamentoCartao.java
```

Código:

```java
package br.com.curso.aula238.pagamento.abstracao;

import br.com.curso.aula238.pagamento.implementacao.ProvedorPagamento;

public class PagamentoCartao extends OperacaoPagamento {
    public PagamentoCartao(ProvedorPagamento provedor) {
        super(provedor);
    }

    @Override
    protected String tipo() {
        return "CARTAO";
    }
}
```

---

## PagamentoBoleto

Crie:

```text
src\br\com\curso\aula238\pagamento\abstracao\PagamentoBoleto.java
```

Código:

```java
package br.com.curso.aula238.pagamento.abstracao;

import br.com.curso.aula238.pagamento.implementacao.ProvedorPagamento;

public class PagamentoBoleto extends OperacaoPagamento {
    public PagamentoBoleto(ProvedorPagamento provedor) {
        super(provedor);
    }

    @Override
    protected String tipo() {
        return "BOLETO";
    }
}
```

---

## PagamentoBridgeApp

Crie:

```text
src\br\com\curso\aula238\app\PagamentoBridgeApp.java
```

Código:

```java
package br.com.curso.aula238.app;

import br.com.curso.aula238.pagamento.abstracao.OperacaoPagamento;
import br.com.curso.aula238.pagamento.abstracao.PagamentoBoleto;
import br.com.curso.aula238.pagamento.abstracao.PagamentoCartao;
import br.com.curso.aula238.pagamento.abstracao.PagamentoPix;
import br.com.curso.aula238.pagamento.implementacao.ProvedorBancoA;
import br.com.curso.aula238.pagamento.implementacao.ProvedorBancoB;

import java.math.BigDecimal;

public class PagamentoBridgeApp {
    public static void main(String[] args) {
        OperacaoPagamento pixBancoA = new PagamentoPix(new ProvedorBancoA());
        OperacaoPagamento cartaoBancoB = new PagamentoCartao(new ProvedorBancoB());
        OperacaoPagamento boletoBancoA = new PagamentoBoleto(new ProvedorBancoA());

        System.out.println(pixBancoA.pagar("PED-001", new BigDecimal("1500.00")));
        System.out.println(cartaoBancoB.pagar("PED-002", new BigDecimal("800.00")));
        System.out.println(boletoBancoA.pagar("PED-003", new BigDecimal("350.00")));
    }
}
```

---

## Análise

Você combinou:

```text
PagamentoPix + ProvedorBancoA
PagamentoCartao + ProvedorBancoB
PagamentoBoleto + ProvedorBancoA
```

Sem criar:

```text
PagamentoPixBancoA
PagamentoPixBancoB
PagamentoCartaoBancoA
PagamentoCartaoBancoB
PagamentoBoletoBancoA
PagamentoBoletoBancoB
```

---

# Parte 14 — Como escolher as duas dimensões

Bridge exige perceber as dimensões certas.

Pergunte:

```text
o que é regra de alto nível?
o que é detalhe de implementação?
o que varia independentemente?
se eu adicionar uma opção em uma dimensão, preciso mexer na outra?
estou criando classes por combinação?
```

Exemplos:

```text
Relatório e formato.
Notificação e canal.
Pagamento e provedor.
Documento e renderizador.
Exportação e destino.
Auditoria e storage.
```

Se as dimensões não variam independentemente, Bridge pode ser exagero.

---

# Parte 15 — Bridge e herança

Bridge geralmente reduz herança.

Sem Bridge:

```text
classe por combinação.
```

Com Bridge:

```text
uma hierarquia para abstração;
uma hierarquia para implementação;
composição entre elas.
```

É uma forma de preferir composição em vez de herança excessiva.

---

# Parte 16 — Bridge em backend real

## Relatórios

```text
RelatorioVendas + ExportadorPdf
RelatorioFinanceiro + ExportadorCsv
RelatorioAtendimento + ExportadorJson
```

## Mensageria

```text
MensagemBoasVindas + CanalWhatsApp
MensagemNps + CanalSms
MensagemEntregaConfirmada + CanalEmail
```

## Pagamentos

```text
PagamentoPix + ProvedorBancoA
PagamentoCartao + ProvedorAdquirenteB
PagamentoBoleto + ProvedorBancoC
```

## Storage

```text
ArquivoContrato + StorageS3
ArquivoContrato + StorageLocal
ArquivoContrato + StorageAzure
```

## Auditoria

```text
AuditoriaTransacao + AuditoriaPostgres
AuditoriaTransacao + AuditoriaKafka
AuditoriaTransacao + AuditoriaArquivo
```

---

# Parte 17 — Como isso conversa com front-end

O front não precisa saber se o backend usa Bridge.

Exemplo:

```text
GET /relatorios/vendas?formato=csv
GET /relatorios/vendas?formato=json
GET /relatorios/financeiro?formato=csv
```

O backend pode montar:

```text
RelatorioVendas + ExportadorCsv
RelatorioVendas + ExportadorJson
RelatorioFinanceiro + ExportadorCsv
```

O contrato externo fica simples.

Internamente, Bridge evita explosão de classes.

---

# Parte 18 — Erros comuns com Bridge

## 1. Usar Bridge sem duas dimensões reais

Se só uma coisa varia, Strategy pode ser suficiente.

---

## 2. Confundir implementação com infraestrutura concreta demais

A implementação no Bridge é uma variação técnica ou operacional.

Mas não precisa ser necessariamente infra externa.

---

## 3. Criar abstração genérica demais

Ruim:

```text
ProcessadorAbstrato
ImplementadorGeral
```

Melhor:

```text
Relatorio
ExportadorRelatorio
```

Nomes devem revelar o negócio.

---

## 4. Colocar regra da abstração na implementação

Exemplo ruim:

```text
ExportadorCsv decide regra de relatório financeiro.
```

A implementação deve exportar.

O relatório deve montar os dados.

---

## 5. Criar classes por combinação mesmo usando Bridge

Se você ainda cria `RelatorioVendasCsv`, talvez não esteja aproveitando o padrão.

---

# Parte 19 — Quando usar Bridge

Use Bridge quando:

```text
existem duas dimensões que variam;
as combinações estão gerando muitas classes;
as dimensões evoluem separadamente;
você quer trocar implementação em runtime;
você quer evitar herança por combinação;
você quer compor regra de alto nível com detalhe técnico.
```

---

## Quando evitar

Evite Bridge quando:

```text
só existe uma variação simples;
não há explosão de classes;
Strategy resolve melhor;
a complexidade vai aumentar sem benefício;
as dimensões não são independentes;
um if simples é suficiente.
```

---

# Parte 20 — Checklist para aplicar Bridge

Pergunte:

```text
1. Tenho duas dimensões de variação?
2. Elas evoluem separadamente?
3. Estou criando classes por combinação?
4. Existe uma abstração de alto nível clara?
5. Existe uma implementação de baixo nível clara?
6. A abstração depende de interface?
7. A implementação não conhece regra da abstração?
8. Posso adicionar novo implementador sem mexer nas abstrações?
9. Posso adicionar nova abstração sem mexer nos implementadores?
10. Bridge simplificou ou complicou?
```

---

# Parte 21 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula238.app.RelatorioBridgeApp
java -cp out br.com.curso.aula238.app.RelatorioMarkdownBridgeApp
java -cp out br.com.curso.aula238.app.NotificacaoBridgeApp
java -cp out br.com.curso.aula238.app.PagamentoBridgeApp
```

Depois responda:

```text
1. Qual foi a abstração no exemplo de relatório?
2. Qual foi a implementação no exemplo de relatório?
3. Como adicionar Markdown sem alterar os relatórios?
4. Qual foi a abstração no exemplo de notificação?
5. Qual foi a implementação no exemplo de notificação?
6. Como Bridge evitou classes por combinação?
7. Qual foi a abstração no exemplo de pagamento?
8. Qual foi a implementação no exemplo de pagamento?
9. Qual diferença entre Bridge e Strategy?
10. Quando Bridge seria exagerado?
```

---

# Parte 22 — Exercício prático principal

## Contexto

Crie Bridge para exportação de documentos.

Duas dimensões:

## Abstração

```text
Documento;
DocumentoContrato;
DocumentoOrdemServico;
DocumentoRecibo.
```

## Implementação

```text
RenderizadorDocumento;
RenderizadorHtml;
RenderizadorMarkdown;
RenderizadorTexto.
```

---

## Regras

Cada documento deve montar:

```text
titulo;
conteudo;
rodape.
```

Cada renderizador deve transformar esses dados em formato diferente.

---

## Classes

Crie:

```text
RenderizadorDocumento;
RenderizadorHtml;
RenderizadorMarkdown;
RenderizadorTexto;
Documento;
DocumentoContrato;
DocumentoOrdemServico;
DocumentoRecibo;
DocumentoBridgeApp.
```

---

## Critérios

```text
não criar DocumentoContratoHtml;
não criar DocumentoContratoMarkdown;
não criar DocumentoOsTexto;
Documento deve depender de RenderizadorDocumento;
Renderizador não deve conhecer regra específica do contrato;
adicionar novo renderizador não deve alterar documentos;
adicionar novo documento não deve alterar renderizadores.
```

---

# Parte 23 — Desafio extra

## Bridge para storage

Duas dimensões:

## Abstração

```text
ArquivoSistema;
ArquivoContrato;
ArquivoNotaFiscal;
ArquivoRelatorio.
```

## Implementação

```text
Storage;
StorageLocal;
StorageS3Simulado;
StorageAzureSimulado.
```

Operação:

```java
void salvar(String nomeArquivo, String conteudo);
```

Critérios:

```text
ArquivoContrato usa Storage;
ArquivoNotaFiscal usa Storage;
Storage define como salvar;
não criar ArquivoContratoS3;
não criar ArquivoNotaFiscalAzure;
app deve salvar documentos em storages diferentes.
```

---

# Parte 24 — Simulado rápido

## Questão 1

Bridge Pattern é usado principalmente para:

```text
A) separar abstração de implementação quando ambas variam independentemente.
B) controlar acesso a objeto real.
C) compartilhar objetos repetidos.
D) criar árvore de objetos.
```

---

## Questão 2

Bridge ajuda a evitar:

```text
A) explosão de classes por combinação.
B) uso de interface.
C) polimorfismo.
D) composição.
```

---

## Questão 3

No exemplo de relatório, `RelatorioVendas` representa:

```text
A) abstração.
B) implementação.
C) cache.
D) proxy.
```

---

## Questão 4

No exemplo de relatório, `ExportadorCsv` representa:

```text
A) implementação.
B) entidade principal.
C) controller.
D) observer.
```

---

## Questão 5

Bridge se diferencia de Adapter porque:

```text
A) Bridge separa dimensões de variação; Adapter adapta contrato incompatível.
B) Adapter sempre usa relatório.
C) Bridge sempre usa banco.
D) Não existe diferença.
```

---

## Questão 6

Se existe apenas uma variação simples, pode ser melhor usar:

```text
A) Strategy ou solução simples.
B) Bridge obrigatório.
C) Composite obrigatório.
D) Flyweight obrigatório.
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

# Parte 25 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Bridge Pattern.
[ ] Sei identificar duas dimensões de variação.
[ ] Sei separar abstração de implementação.
[ ] Sei criar interface de implementação.
[ ] Sei criar abstração que usa implementação.
[ ] Sei evitar explosão de classes.
[ ] Sei aplicar Bridge em relatório.
[ ] Sei aplicar Bridge em notificação.
[ ] Sei aplicar Bridge em pagamento.
[ ] Sei diferenciar Bridge de Adapter.
[ ] Sei diferenciar Bridge de Strategy.
[ ] Sei diferenciar Bridge de Decorator.
[ ] Sei saber quando Bridge é exagero.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Bridge Pattern?
2. Qual problema ele resolve?
3. O que é abstração no Bridge?
4. O que é implementação no Bridge?
5. Por que Bridge evita explosão de classes?
6. Qual diferença entre Bridge e Adapter?
7. Qual diferença entre Bridge e Strategy?
8. Qual diferença entre Bridge e Decorator?
9. Quais dimensões variaram no exemplo de relatório?
10. Quando Bridge seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
identificar duas variações independentes;
criar uma abstração;
criar uma implementação;
compor as duas;
adicionar nova abstração sem mexer nos implementadores;
adicionar novo implementador sem mexer nas abstrações;
evitar classes por combinação;
resolver exercício de documentos;
resolver desafio de storage.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-238-bridge-pattern-abstracao-implementacao-variacoes
git commit -m "Aula 238: bridge pattern abstracao implementacao variacoes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Bridge Pattern separa abstração de implementação para evitar explosão de classes quando duas dimensões variam independentemente.
```

Você estudou:

```text
Bridge Pattern;
abstração;
implementação;
relatórios e exportadores;
notificações e canais;
pagamentos e provedores;
diferença para Adapter;
diferença para Strategy;
diferença para Decorator;
uso em backend real;
conversa com front-end;
cuidados de modelagem.
```

Na próxima aula, vamos estudar:

```text
Mediator Pattern.
```

A ideia será reduzir acoplamento entre vários objetos que precisam se comunicar, centralizando a coordenação em um mediador, muito útil em fluxos de tela, módulos, componentes e orquestrações internas.
