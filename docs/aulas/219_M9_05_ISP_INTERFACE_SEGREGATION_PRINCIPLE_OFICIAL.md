# 219 — M9.05 — ISP: Interface Segregation Principle

## Objetivo da aula

Na aula anterior, você estudou:

```text
LSP — Liskov Substitution Principle
```

Você viu que:

```text
um subtipo precisa cumprir o contrato que promete;
compilar não basta;
retornar null indevido pode quebrar contrato;
UnsupportedOperationException é sinal de alerta;
efeito colateral inesperado quebra substituição;
herança deve representar substituição real;
interfaces também precisam respeitar contrato.
```

Agora vamos estudar o quarto princípio do SOLID:

```text
ISP — Interface Segregation Principle
```

Em português:

```text
Princípio da Segregação de Interfaces
```

A ideia central é:

```text
clientes não devem ser forçados a depender de métodos que não usam.
```

Ou, de forma prática:

```text
prefira interfaces pequenas e específicas a interfaces grandes e genéricas.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é ISP;
identificar interfaces grandes demais;
identificar métodos que implementações não conseguem cumprir;
evitar UnsupportedOperationException por interface mal desenhada;
separar contratos por capacidade;
entender relação entre ISP e LSP;
entender relação entre ISP e OCP;
modelar interfaces menores;
aplicar ISP em exportação, notificação, pagamento, arquivos e repositories;
saber quando uma interface está grande demais;
saber quando não criar interface desnecessária;
preparar base para DIP.
```

---

## Ideia principal

Uma interface deve representar um contrato claro.

Se uma classe implementa uma interface, ela está dizendo:

```text
eu sei fazer tudo que esta interface exige.
```

Se a interface exige coisas demais, algumas classes serão forçadas a implementar métodos que não fazem sentido.

Exemplo ruim:

```java
public interface Relatorio {
    String exportarCsv();

    String exportarPdf();

    String exportarExcel();

    void enviarEmail();
}
```

Agora imagine um relatório que só exporta CSV.

Ele seria obrigado a implementar:

```java
exportarPdf()
exportarExcel()
enviarEmail()
```

E provavelmente faria:

```java
throw new UnsupportedOperationException();
```

Isso indica interface mal segregada.

---

## ISP em uma frase prática

```text
Não obrigue uma classe a prometer o que ela não consegue cumprir.
```

Se uma implementação precisa fazer isso:

```java
@Override
public void metodoQueNaoUso() {
    throw new UnsupportedOperationException();
}
```

pode existir violação de ISP.

---

## Relação entre ISP e LSP

Na aula de LSP, você viu que subtipo precisa cumprir o contrato.

Agora, com ISP, o foco é:

```text
criar contratos menores para que as implementações consigam cumpri-los corretamente.
```

Quando uma interface é grande demais, ela empurra as classes para violarem LSP.

Fluxo do problema:

```text
interface grande demais
-> implementação não consegue cumprir
-> método lança UnsupportedOperationException
-> subtipo quebra contrato
-> violação de LSP
```

ISP ajuda a evitar esse caminho.

---

## Relação entre ISP e OCP

OCP diz:

```text
aberto para extensão e fechado para modificação.
```

ISP ajuda porque interfaces menores tornam extensões mais seguras.

Exemplo:

```text
ExportadorCsv;
ExportadorPdf;
EnviadorEmail;
```

Cada implementação escolhe o contrato que realmente cumpre.

Assim você adiciona comportamentos novos sem forçar classes antigas a mudar.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com ISP:

```text
o use case depende apenas do contrato que precisa;
o repository expõe apenas operações coerentes;
o client implementa apenas a integração que realiza;
o controller não deve depender de interfaces gigantes;
cada contrato representa uma capacidade específica.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-219-isp-interface-segregation-principle
cd labs\m9\aula-219-isp-interface-segregation-principle
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula219
mkdir src\br\com\curso\aula219\app
mkdir src\br\com\curso\aula219\dto
mkdir src\br\com\curso\aula219\dominio
mkdir src\br\com\curso\aula219\dominio\pedido
mkdir src\br\com\curso\aula219\ruim
mkdir src\br\com\curso\aula219\isp
mkdir src\br\com\curso\aula219\isp\exportacao
mkdir src\br\com\curso\aula219\isp\notificacao
mkdir src\br\com\curso\aula219\isp\repository
mkdir src\br\com\curso\aula219\isp\service
```

---

# Parte 1 — Entendendo cliente da interface

## O que é cliente da interface

No ISP, “cliente” não significa cliente final do sistema.

Cliente da interface é qualquer classe que usa aquela interface.

Exemplo:

```java
public class RelatorioService {
    private final ExportadorCsv exportadorCsv;

    public RelatorioService(ExportadorCsv exportadorCsv) {
        this.exportadorCsv = exportadorCsv;
    }
}
```

Nesse caso, `RelatorioService` é cliente da interface `ExportadorCsv`.

ISP diz:

```text
RelatorioService deve depender apenas dos métodos que realmente usa.
```

Se ele só precisa exportar CSV, não deveria depender de uma interface que também obriga PDF, Excel, e-mail, upload e impressão.

---

## Interface grande cria dependência desnecessária

Exemplo ruim:

```java
public interface RelatorioCompleto {
    String exportarCsv();

    String exportarPdf();

    String exportarExcel();

    void enviarEmail();

    void imprimir();
}
```

Se uma classe só precisa de CSV, ela fica acoplada a um contrato com coisas que não usa.

Isso aumenta:

```text
acoplamento;
risco de mudança;
implementações falsas;
métodos vazios;
UnsupportedOperationException;
baixa clareza.
```

---

# Parte 2 — Exemplo ruim de interface grande

## PedidoResumo

Crie:

```text
src\br\com\curso\aula219\dto\PedidoResumo.java
```

Código:

```java
package br.com.curso.aula219.dto;

public record PedidoResumo(
        String codigo,
        String cliente,
        String valor
) {
}
```

---

## RelatorioPedidoCompleto

Crie:

```text
src\br\com\curso\aula219\ruim\RelatorioPedidoCompleto.java
```

Código:

```java
package br.com.curso.aula219.ruim;

import br.com.curso.aula219.dto.PedidoResumo;

public interface RelatorioPedidoCompleto {
    String exportarCsv(PedidoResumo pedido);

    String exportarPdf(PedidoResumo pedido);

    String exportarExcel(PedidoResumo pedido);

    void enviarEmail(PedidoResumo pedido, String destino);

    void imprimir(PedidoResumo pedido);
}
```

---

## RelatorioSomenteCsvRuim

Crie:

```text
src\br\com\curso\aula219\ruim\RelatorioSomenteCsvRuim.java
```

Código:

```java
package br.com.curso.aula219.ruim;

import br.com.curso.aula219.dto.PedidoResumo;

public class RelatorioSomenteCsvRuim implements RelatorioPedidoCompleto {
    @Override
    public String exportarCsv(PedidoResumo pedido) {
        return String.join(
                ";",
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor()
        );
    }

    @Override
    public String exportarPdf(PedidoResumo pedido) {
        throw new UnsupportedOperationException("PDF não suportado.");
    }

    @Override
    public String exportarExcel(PedidoResumo pedido) {
        throw new UnsupportedOperationException("Excel não suportado.");
    }

    @Override
    public void enviarEmail(PedidoResumo pedido, String destino) {
        throw new UnsupportedOperationException("Envio por e-mail não suportado.");
    }

    @Override
    public void imprimir(PedidoResumo pedido) {
        throw new UnsupportedOperationException("Impressão não suportada.");
    }
}
```

---

## RelatorioCompletoRuimApp

Crie:

```text
src\br\com\curso\aula219\app\RelatorioCompletoRuimApp.java
```

Código:

```java
package br.com.curso.aula219.app;

import br.com.curso.aula219.dto.PedidoResumo;
import br.com.curso.aula219.ruim.RelatorioPedidoCompleto;
import br.com.curso.aula219.ruim.RelatorioSomenteCsvRuim;

public class RelatorioCompletoRuimApp {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo(
                "PED-001",
                "Ana",
                "1500.00"
        );

        RelatorioPedidoCompleto relatorio = new RelatorioSomenteCsvRuim();

        System.out.println("CSV:");
        System.out.println(relatorio.exportarCsv(pedido));

        System.out.println();
        System.out.println("Tentando PDF:");

        try {
            System.out.println(relatorio.exportarPdf(pedido));
        } catch (UnsupportedOperationException erro) {
            System.out.println("Falha por interface grande: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula219.app.RelatorioCompletoRuimApp
```

---

## Diagnóstico

A implementação só sabe exportar CSV.

Mas a interface obrigou a implementar:

```text
PDF;
Excel;
e-mail;
impressão.
```

Resultado:

```text
UnsupportedOperationException.
```

Isso é violação clara de ISP.

Também ameaça LSP, porque a classe não substitui bem o contrato completo.

---

# Parte 3 — Segregando interfaces

Agora vamos separar a interface grande em contratos menores.

---

## ExportadorCsv

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\ExportadorCsv.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public interface ExportadorCsv {
    String exportarCsv(PedidoResumo pedido);
}
```

---

## ExportadorPdf

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\ExportadorPdf.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public interface ExportadorPdf {
    String exportarPdf(PedidoResumo pedido);
}
```

---

## ExportadorExcel

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\ExportadorExcel.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public interface ExportadorExcel {
    String exportarExcel(PedidoResumo pedido);
}
```

---

## EnviadorRelatorioEmail

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\EnviadorRelatorioEmail.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public interface EnviadorRelatorioEmail {
    void enviarEmail(PedidoResumo pedido, String destino);
}
```

---

## ImpressorRelatorio

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\ImpressorRelatorio.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public interface ImpressorRelatorio {
    void imprimir(PedidoResumo pedido);
}
```

---

## RelatorioPedidoCsv

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\RelatorioPedidoCsv.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public class RelatorioPedidoCsv implements ExportadorCsv {
    @Override
    public String exportarCsv(PedidoResumo pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return String.join(
                ";",
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor()
        );
    }
}
```

---

## RelatorioPedidoPdf

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\RelatorioPedidoPdf.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public class RelatorioPedidoPdf implements ExportadorPdf {
    @Override
    public String exportarPdf(PedidoResumo pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return "PDF SIMULADO | Pedido " + pedido.codigo()
                + " | Cliente " + pedido.cliente()
                + " | Valor " + pedido.valor();
    }
}
```

---

## RelatorioPedidoMultiformato

Crie:

```text
src\br\com\curso\aula219\isp\exportacao\RelatorioPedidoMultiformato.java
```

Código:

```java
package br.com.curso.aula219.isp.exportacao;

import br.com.curso.aula219.dto.PedidoResumo;

public class RelatorioPedidoMultiformato implements ExportadorCsv, ExportadorPdf, ExportadorExcel {
    @Override
    public String exportarCsv(PedidoResumo pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return String.join(
                ";",
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor()
        );
    }

    @Override
    public String exportarPdf(PedidoResumo pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return "PDF SIMULADO | " + pedido.codigo()
                + " | " + pedido.cliente()
                + " | " + pedido.valor();
    }

    @Override
    public String exportarExcel(PedidoResumo pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return "EXCEL SIMULADO | " + pedido.codigo()
                + " | " + pedido.cliente()
                + " | " + pedido.valor();
    }
}
```

---

## RelatorioPedidoIspApp

Crie:

```text
src\br\com\curso\aula219\app\RelatorioPedidoIspApp.java
```

Código:

```java
package br.com.curso.aula219.app;

import br.com.curso.aula219.dto.PedidoResumo;
import br.com.curso.aula219.isp.exportacao.ExportadorCsv;
import br.com.curso.aula219.isp.exportacao.ExportadorPdf;
import br.com.curso.aula219.isp.exportacao.RelatorioPedidoCsv;
import br.com.curso.aula219.isp.exportacao.RelatorioPedidoPdf;

public class RelatorioPedidoIspApp {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo(
                "PED-001",
                "Ana",
                "1500.00"
        );

        ExportadorCsv csv = new RelatorioPedidoCsv();
        ExportadorPdf pdf = new RelatorioPedidoPdf();

        System.out.println("CSV:");
        System.out.println(csv.exportarCsv(pedido));

        System.out.println();

        System.out.println("PDF:");
        System.out.println(pdf.exportarPdf(pedido));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula219.app.RelatorioPedidoIspApp
```

---

## O que melhorou

Agora:

```text
quem só exporta CSV implementa ExportadorCsv;
quem só exporta PDF implementa ExportadorPdf;
quem exporta vários formatos implementa várias interfaces.
```

Não há método obrigatório sem sentido.

Isso respeita ISP.

---

# Parte 4 — Interface pequena demais também pode ser problema

ISP não significa criar interface para cada método automaticamente.

Exemplo exagerado:

```text
InterfaceComMetodoCodigo;
InterfaceComMetodoCliente;
InterfaceComMetodoValor;
```

Isso não ajuda.

ISP busca contratos específicos e úteis.

Pergunta boa:

```text
essa interface representa uma capacidade real?
```

Exemplos bons:

```text
ExportadorCsv;
ExportadorPdf;
EnviadorEmail;
PedidoRepositoryLeitura;
PedidoRepositoryEscrita.
```

Exemplos ruins:

```text
TemCodigo;
TemNome;
Executa;
FazAlgo;
Processa;
InterfaceDeUmMetodoSemSentido.
```

Nem toda interface de um método é ruim.

Mas ela precisa representar uma capacidade clara.

---

# Parte 5 — ISP em repositories

## Problema

Imagine uma interface genérica demais:

```java
public interface PedidoRepositoryCompleto {
    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);

    void deletar(String codigo);

    List<Pedido> listarTodos();

    void exportarCsv();

    void sincronizarComApiExterna();
}
```

Um repository em memória talvez consiga salvar, buscar e listar.

Mas não exporta CSV.

Não sincroniza API externa.

A interface mistura responsabilidades.

---

## Pedido

Crie:

```text
src\br\com\curso\aula219\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula219.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;

    public Pedido(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm) {
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

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Criado em: " + criadoEm;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoRepositoryLeitura

Crie:

```text
src\br\com\curso\aula219\isp\repository\PedidoRepositoryLeitura.java
```

Código:

```java
package br.com.curso.aula219.isp.repository;

import br.com.curso.aula219.dominio.pedido.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoRepositoryLeitura {
    Optional<Pedido> buscarPorCodigo(String codigo);

    List<Pedido> listarTodos();
}
```

---

## PedidoRepositoryEscrita

Crie:

```text
src\br\com\curso\aula219\isp\repository\PedidoRepositoryEscrita.java
```

Código:

```java
package br.com.curso.aula219.isp.repository;

import br.com.curso.aula219.dominio.pedido.Pedido;

public interface PedidoRepositoryEscrita {
    void salvar(Pedido pedido);
}
```

---

## PedidoRepositoryRemocao

Crie:

```text
src\br\com\curso\aula219\isp\repository\PedidoRepositoryRemocao.java
```

Código:

```java
package br.com.curso.aula219.isp.repository;

public interface PedidoRepositoryRemocao {
    void removerPorCodigo(String codigo);
}
```

---

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula219\isp\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula219.isp.repository;

import br.com.curso.aula219.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepositoryLeitura, PedidoRepositoryEscrita, PedidoRepositoryRemocao {
    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }

    @Override
    public List<Pedido> listarTodos() {
        return List.copyOf(pedidos);
    }

    @Override
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);
    }

    @Override
    public void removerPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        pedidos.removeIf(pedido -> pedido.codigo().equals(normalizado));
    }
}
```

---

## PedidoConsultaService

Crie:

```text
src\br\com\curso\aula219\isp\service\PedidoConsultaService.java
```

Código:

```java
package br.com.curso.aula219.isp.service;

import br.com.curso.aula219.dominio.pedido.Pedido;
import br.com.curso.aula219.isp.repository.PedidoRepositoryLeitura;

import java.util.List;

public class PedidoConsultaService {
    private final PedidoRepositoryLeitura repository;

    public PedidoConsultaService(PedidoRepositoryLeitura repository) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository de leitura é obrigatório.");
        }

        this.repository = repository;
    }

    public Pedido buscarObrigatorio(String codigo) {
        return repository.buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigo));
    }

    public List<Pedido> listarTodos() {
        return repository.listarTodos();
    }
}
```

---

## PedidoCadastroService

Crie:

```text
src\br\com\curso\aula219\isp\service\PedidoCadastroService.java
```

Código:

```java
package br.com.curso.aula219.isp.service;

import br.com.curso.aula219.dominio.pedido.Pedido;
import br.com.curso.aula219.isp.repository.PedidoRepositoryEscrita;

public class PedidoCadastroService {
    private final PedidoRepositoryEscrita repository;

    public PedidoCadastroService(PedidoRepositoryEscrita repository) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository de escrita é obrigatório.");
        }

        this.repository = repository;
    }

    public void cadastrar(Pedido pedido) {
        repository.salvar(pedido);
    }
}
```

---

## PedidoRepositoryIspApp

Crie:

```text
src\br\com\curso\aula219\app\PedidoRepositoryIspApp.java
```

Código:

```java
package br.com.curso.aula219.app;

import br.com.curso.aula219.dominio.pedido.Pedido;
import br.com.curso.aula219.isp.repository.PedidoRepositoryMemoria;
import br.com.curso.aula219.isp.service.PedidoCadastroService;
import br.com.curso.aula219.isp.service.PedidoConsultaService;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoRepositoryIspApp {
    public static void main(String[] args) {
        PedidoRepositoryMemoria repository = new PedidoRepositoryMemoria();

        PedidoCadastroService cadastroService = new PedidoCadastroService(repository);
        PedidoConsultaService consultaService = new PedidoConsultaService(repository);

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                Instant.now()
        );

        cadastroService.cadastrar(pedido);

        System.out.println(consultaService.buscarObrigatorio("PED-001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula219.app.PedidoRepositoryIspApp
```

---

## O que este exemplo mostra

O cadastro depende apenas de:

```text
PedidoRepositoryEscrita
```

A consulta depende apenas de:

```text
PedidoRepositoryLeitura
```

O service não é forçado a depender de métodos que não usa.

Isso é ISP.

---

# Parte 6 — ISP em notificação

## Problema

Nem todo canal de notificação tem as mesmas capacidades.

Exemplo:

```text
E-mail:
tem destinatário, assunto, corpo, anexos.

SMS:
tem número e texto curto.

Push:
tem usuário, título e mensagem.

WhatsApp:
tem número e mensagem.
```

Uma interface única com tudo pode ficar ruim.

---

## Interface ruim

Exemplo ruim:

```java
public interface CanalNotificacaoCompleto {
    void enviarTexto(String destino, String texto);

    void enviarComTitulo(String destino, String titulo, String texto);

    void enviarComAnexo(String destino, String titulo, String texto, byte[] anexo);
}
```

SMS não envia anexo.

WhatsApp talvez não use título.

Push talvez use token de dispositivo.

A interface força capacidades indevidas.

---

## Interfaces segregadas

Crie:

```text
src\br\com\curso\aula219\isp\notificacao\EnviadorTexto.java
```

Código:

```java
package br.com.curso.aula219.isp.notificacao;

public interface EnviadorTexto {
    void enviarTexto(String destino, String texto);
}
```

---

Crie:

```text
src\br\com\curso\aula219\isp\notificacao\EnviadorComTitulo.java
```

Código:

```java
package br.com.curso.aula219.isp.notificacao;

public interface EnviadorComTitulo {
    void enviarComTitulo(String destino, String titulo, String texto);
}
```

---

Crie:

```text
src\br\com\curso\aula219\isp\notificacao\EnviadorComAnexo.java
```

Código:

```java
package br.com.curso.aula219.isp.notificacao;

public interface EnviadorComAnexo {
    void enviarComAnexo(String destino, String titulo, String texto, String nomeAnexo);
}
```

---

## SmsNotificador

Crie:

```text
src\br\com\curso\aula219\isp\notificacao\SmsNotificador.java
```

Código:

```java
package br.com.curso.aula219.isp.notificacao;

public class SmsNotificador implements EnviadorTexto {
    @Override
    public void enviarTexto(String destino, String texto) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto é obrigatório.");
        }

        System.out.println("[SMS] " + destino + " | " + texto);
    }
}
```

---

## EmailNotificador

Crie:

```text
src\br\com\curso\aula219\isp\notificacao\EmailNotificador.java
```

Código:

```java
package br.com.curso.aula219.isp.notificacao;

public class EmailNotificador implements EnviadorTexto, EnviadorComTitulo, EnviadorComAnexo {
    @Override
    public void enviarTexto(String destino, String texto) {
        enviarComTitulo(destino, "Mensagem", texto);
    }

    @Override
    public void enviarComTitulo(String destino, String titulo, String texto) {
        validar(destino, texto);

        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        System.out.println("[EMAIL] " + destino + " | " + titulo + " | " + texto);
    }

    @Override
    public void enviarComAnexo(String destino, String titulo, String texto, String nomeAnexo) {
        validar(destino, texto);

        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (nomeAnexo == null || nomeAnexo.isBlank()) {
            throw new IllegalArgumentException("Nome do anexo é obrigatório.");
        }

        System.out.println("[EMAIL COM ANEXO] " + destino
                + " | " + titulo
                + " | " + texto
                + " | Anexo: " + nomeAnexo);
    }

    private void validar(String destino, String texto) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto é obrigatório.");
        }
    }
}
```

---

## NotificacaoIspApp

Crie:

```text
src\br\com\curso\aula219\app\NotificacaoIspApp.java
```

Código:

```java
package br.com.curso.aula219.app;

import br.com.curso.aula219.isp.notificacao.EmailNotificador;
import br.com.curso.aula219.isp.notificacao.EnviadorComAnexo;
import br.com.curso.aula219.isp.notificacao.EnviadorTexto;
import br.com.curso.aula219.isp.notificacao.SmsNotificador;

public class NotificacaoIspApp {
    public static void main(String[] args) {
        EnviadorTexto sms = new SmsNotificador();
        sms.enviarTexto("11999999999", "Pedido faturado.");

        EnviadorTexto emailTexto = new EmailNotificador();
        emailTexto.enviarTexto("cliente@empresa.com", "Pedido faturado.");

        EnviadorComAnexo emailAnexo = new EmailNotificador();
        emailAnexo.enviarComAnexo(
                "cliente@empresa.com",
                "Relatório",
                "Segue relatório do pedido.",
                "pedido.pdf"
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula219.app.NotificacaoIspApp
```

---

## O que melhorou

SMS não precisa implementar anexo.

Email implementa as capacidades que possui.

O cliente depende apenas do contrato necessário.

Isso respeita ISP.

---

# Parte 7 — ISP e Clean Architecture

Em arquitetura limpa, interfaces são contratos de entrada e saída.

Exemplos:

```text
PedidoRepository;
PagamentoGateway;
EmailSender;
ArquivoStorage;
AuditoriaPort;
RelatorioExporter.
```

ISP ajuda a desenhar esses contratos sem excesso.

Exemplo ruim:

```java
public interface PedidoPort {
    void salvar(Pedido pedido);
    Optional<Pedido> buscar(String codigo);
    void enviarEmail(Pedido pedido);
    void gerarPdf(Pedido pedido);
    void chamarPagamento(Pedido pedido);
}
```

Isso mistura várias portas.

Melhor:

```text
PedidoRepository;
PedidoNotificador;
PedidoRelatorioExporter;
PagamentoGateway.
```

Cada contrato representa uma fronteira clara.

---

# Parte 8 — ISP e DTOs

ISP não se aplica diretamente a DTO como princípio principal.

Mas a ideia de não carregar coisa desnecessária também aparece.

Exemplo ruim:

```text
PedidoResponseGigante
```

com campos que nem toda tela usa.

No futuro, você pode ter:

```text
PedidoResumoResponse;
PedidoDetalheResponse;
PedidoFaturamentoResponse;
PedidoHistoricoResponse.
```

Isso reduz acoplamento entre consumidores e dados.

Mas cuidado:

```text
não crie DTO diferente sem necessidade real.
```

A ideia é equilíbrio.

---

# Parte 9 — Sinais de violação de ISP

Fique atento quando:

```text
interface tem muitos métodos;
implementações deixam métodos vazios;
implementações lançam UnsupportedOperationException;
classes implementam métodos que não fazem sentido;
serviço depende de contrato muito maior do que usa;
mudança em método não usado obriga recompilar/alterar cliente;
nome da interface é genérico demais;
interface mistura leitura, escrita, exportação, notificação e integração;
contrato parece um "tudo em um".
```

Nomes suspeitos:

```text
OperacaoCompleta;
ServicoGeral;
RepositorioTotal;
GerenciadorTudo;
ProcessadorCompleto;
InterfaceSistema.
```

---

# Parte 10 — Perguntas para aplicar ISP

Ao revisar uma interface, pergunte:

```text
1. Quem usa essa interface?
2. Quais métodos esse cliente realmente usa?
3. Alguma implementação lança UnsupportedOperationException?
4. Algum método não faz sentido para algumas implementações?
5. A interface mistura capacidades diferentes?
6. Posso separar leitura e escrita?
7. Posso separar exportação e envio?
8. Posso separar consulta e comando?
9. O nome da interface representa uma capacidade clara?
10. Estou criando interfaces demais sem necessidade?
```

---

# Parte 11 — Interface por capacidade

Uma boa forma de aplicar ISP é pensar em capacidades.

Exemplos:

```text
ExportadorCsv:
capacidade de exportar CSV.

ExportadorPdf:
capacidade de exportar PDF.

EnviadorTexto:
capacidade de enviar texto.

EnviadorComAnexo:
capacidade de enviar com anexo.

PedidoRepositoryLeitura:
capacidade de ler pedido.

PedidoRepositoryEscrita:
capacidade de salvar pedido.
```

Capacidade clara ajuda o design.

---

# Parte 12 — ISP e comandos/consultas

Em sistemas maiores, é comum separar:

```text
Command:
operações que mudam estado.

Query:
operações que consultam estado.
```

Exemplo:

```text
PedidoCommandRepository:
salvar;
remover;
atualizar.

PedidoQueryRepository:
buscar;
listar;
filtrar.
```

Isso pode ser útil quando:

```text
leitura e escrita têm performances diferentes;
leitura usa view/tabela/materialização;
escrita usa domínio rico;
consulta usa projeção;
sistema cresce bastante.
```

Mas para sistemas pequenos, uma interface simples pode ser suficiente.

---

# Parte 13 — Cuidado com excesso de ISP

Aplicar ISP demais pode gerar fragmentação.

Exemplo exagerado:

```text
PedidoCodigoProvider;
PedidoClienteProvider;
PedidoValorProvider;
PedidoCriadoEmProvider.
```

Isso geralmente não ajuda.

Regra prática:

```text
segregue por capacidade real, não por obsessão.
```

---

## Equilíbrio

Interface grande demais:

```text
força métodos inúteis.
```

Interface pequena demais:

```text
aumenta complexidade sem ganho.
```

A meta é:

```text
contratos coesos.
```

---

# Parte 14 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula219.app.RelatorioCompletoRuimApp
java -cp out br.com.curso.aula219.app.RelatorioPedidoIspApp
java -cp out br.com.curso.aula219.app.PedidoRepositoryIspApp
java -cp out br.com.curso.aula219.app.NotificacaoIspApp
```

Depois responda:

```text
1. Qual interface era grande demais?
2. Quais métodos não faziam sentido para CSV?
3. Por que UnsupportedOperationException apareceu?
4. Quais interfaces menores foram criadas?
5. Qual classe implementa apenas CSV?
6. Qual classe implementa PDF?
7. Como leitura e escrita foram separadas no repository?
8. Por que SMS não deve implementar envio com anexo?
9. Email pode implementar mais de uma interface?
10. ISP eliminou a necessidade de cumprir contrato falso?
```

---

# Parte 15 — Exercício prático

## Contexto

Você vai aplicar ISP em um sistema de arquivos.

Há diferentes capacidades:

```text
ler arquivo;
escrever arquivo;
apagar arquivo;
compactar arquivo;
enviar arquivo para storage externo.
```

Nem toda implementação tem todas essas capacidades.

---

## Interface ruim

Crie uma interface ruim:

```java
public interface ArquivoManagerCompleto {
    String ler(String caminho);

    void escrever(String caminho, String conteudo);

    void apagar(String caminho);

    void compactar(String caminho);

    void enviarParaStorage(String caminho);
}
```

Crie uma implementação:

```text
ArquivoSomenteLeituraRuim
```

que só consegue ler e lança `UnsupportedOperationException` nos demais métodos.

---

## Versão ISP

Separe em:

```text
LeitorArquivo;
EscritorArquivo;
ApagadorArquivo;
CompactadorArquivo;
StorageArquivoUploader.
```

Crie implementações:

```text
ArquivoLocalLeitorEscritor:
implementa LeitorArquivo e EscritorArquivo.

ArquivoLocalCompleto:
implementa LeitorArquivo, EscritorArquivo e ApagadorArquivo.

ArquivoStorageUploaderSimulado:
implementa StorageArquivoUploader.
```

---

## Services

Crie:

```text
ArquivoConsultaService
```

Depende apenas de:

```text
LeitorArquivo
```

Crie:

```text
ArquivoCadastroService
```

Depende apenas de:

```text
EscritorArquivo
```

Crie:

```text
ArquivoPublicacaoService
```

Depende apenas de:

```text
StorageArquivoUploader
```

---

## Critérios

```text
nenhuma implementação deve lançar UnsupportedOperationException;
cada service depende apenas do que usa;
interfaces devem representar capacidades reais;
não criar interface sem sentido;
nomes devem ser claros.
```

---

# Parte 16 — Desafio extra

## ISP em pagamento

Crie interfaces:

```text
AutorizadorPagamento;
CapturadorPagamento;
EstornadorPagamento;
GeradorBoleto;
GeradorQrCodePix.
```

Cenários:

```text
Cartão:
autoriza, captura, estorna.

PIX:
gera QR Code e pode consultar pagamento.

Boleto:
gera boleto e pode consultar pagamento.

Dinheiro:
registra pagamento manual.
```

Evite uma interface única:

```text
ProcessadorPagamentoCompleto
```

que obrigue todo mundo a implementar tudo.

Objetivo:

```text
modelar capacidades reais sem forçar métodos falsos.
```

---

# Parte 17 — Simulado rápido

## Questão 1

ISP significa:

```text
A) Clientes não devem ser forçados a depender de métodos que não usam.
B) Toda interface deve ter exatamente um método.
C) Toda classe deve implementar todas as interfaces.
D) Toda interface deve ser abstrata e final.
```

---

## Questão 2

Qual é um sinal comum de violação de ISP?

```text
A) UnsupportedOperationException em métodos de interface que a classe não suporta.
B) Uso de LocalDate.
C) Uso de BigDecimal.
D) Uso de package.
```

---

## Questão 3

Uma boa solução para interface grande demais é:

```text
A) Separar por capacidades coesas.
B) Colocar tudo em uma classe static.
C) Remover validações.
D) Retornar null.
```

---

## Questão 4

SMS ser obrigado a implementar método de anexo indica:

```text
A) Interface mal segregada.
B) Boa prática de backend.
C) Uso correto de UUID.
D) Necessidade de DateTimeFormatter.
```

---

## Questão 5

ISP se relaciona com LSP porque:

```text
A) interfaces menores ajudam implementações a cumprir melhor seus contratos.
B) ISP substitui completamente LSP.
C) LSP só funciona com CSV.
D) ISP obriga retorno null.
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

# Parte 18 — Checklist ISP

Marque mentalmente:

```text
[ ] Sei explicar ISP.
[ ] Sei que cliente da interface é quem usa a interface.
[ ] Sei identificar interface grande demais.
[ ] Sei identificar método que implementação não suporta.
[ ] Sei que UnsupportedOperationException pode indicar ISP ruim.
[ ] Sei separar interfaces por capacidade.
[ ] Sei separar leitura e escrita quando fizer sentido.
[ ] Sei separar exportação por formato quando fizer sentido.
[ ] Sei separar notificação por capacidade.
[ ] Sei evitar interface pequena demais sem sentido.
[ ] Sei que ISP ajuda LSP.
[ ] Sei que ISP prepara DIP.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é ISP?
2. Quem é o cliente da interface?
3. Por que interface grande demais é ruim?
4. Por que UnsupportedOperationException pode indicar ISP violado?
5. Como separar exportação CSV e PDF?
6. Como separar leitura e escrita de repository?
7. Por que SMS não deve implementar envio com anexo?
8. Quando uma classe pode implementar várias interfaces?
9. Qual relação entre ISP e LSP?
10. Quando evitar aplicar ISP em excesso?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar ISP;
identificar interfaces grandes;
separar interfaces por capacidades;
evitar contratos falsos;
corrigir interface de relatório;
corrigir interface de repository;
corrigir interface de notificação;
entender que interface pequena precisa ter sentido;
resolver exercício de arquivos;
preparar-se para DIP.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-219-isp-interface-segregation-principle
git commit -m "Aula 219: isp interface segregation principle"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
interfaces devem representar capacidades coesas, sem obrigar implementações a prometer o que não fazem.
```

Você estudou:

```text
ISP;
cliente da interface;
interfaces grandes demais;
contratos falsos;
UnsupportedOperationException;
segregação por capacidade;
exportação;
repository;
notificação;
leitura e escrita;
relação com LSP.
```

Também reforçou:

```text
OCP cria extensões;
LSP exige que extensões cumpram contratos;
ISP ajuda a criar contratos menores e mais honestos.
```

Na próxima aula, vamos estudar:

```text
DIP — Dependency Inversion Principle.
```

Esse princípio fecha o SOLID e conecta diretamente com arquitetura, testes, inversão de dependência, injeção de dependência e Spring.
