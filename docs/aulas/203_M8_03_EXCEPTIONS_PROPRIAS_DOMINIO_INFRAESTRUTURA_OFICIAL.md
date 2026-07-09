# 203 — M8.03 — Exceptions próprias: domínio, aplicação e infraestrutura

## Objetivo da aula

Na aula anterior, você estudou:

```text
checked exceptions;
unchecked exceptions;
Exception;
RuntimeException;
throws;
try/catch;
IOException;
IllegalArgumentException;
IllegalStateException;
conversão de checked para unchecked;
preservação da causa original;
separação entre domínio e infraestrutura.
```

Agora vamos evoluir para um ponto essencial em backend profissional:

```text
exceptions próprias.
```

Até agora usamos exceptions genéricas do Java:

```java
IllegalArgumentException
IllegalStateException
IllegalStateException("Pedido cancelado não pode ser faturado.")
```

Isso funciona.

Mas em sistemas maiores, muitas vezes é melhor ter exceptions com nomes do domínio ou da infraestrutura:

```text
PedidoNaoEncontradoException;
PedidoNaoPodeSerFaturadoException;
ProdutoIndisponivelException;
ClienteBloqueadoException;
FalhaLeituraArquivoException;
FalhaIntegracaoException.
```

Esses nomes deixam o sistema mais claro.

Ao final desta aula, você deve conseguir:

```text
criar uma exception própria;
estender RuntimeException;
criar construtor com mensagem;
criar construtor com mensagem e causa;
diferenciar exception de domínio e exception de infraestrutura;
usar exception própria para regra de negócio;
usar exception própria para recurso não encontrado;
converter IOException para exception própria de infraestrutura;
preservar causa original;
evitar RuntimeException genérica;
evitar criar exception demais sem necessidade;
aplicar exceptions próprias em entidades e services;
preparar terreno para tratamento global futuro em APIs REST.
```

---

## Ideia principal

Exception própria é uma classe que representa um erro específico do seu sistema.

Exemplo:

```java
public class PedidoNaoEncontradoException extends RuntimeException {
    public PedidoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
```

Uso:

```java
throw new PedidoNaoEncontradoException("Pedido não encontrado: PED-001");
```

Isso comunica muito mais do que:

```java
throw new RuntimeException("Erro.");
```

ou até:

```java
throw new IllegalArgumentException("Pedido não encontrado.");
```

O nome da classe já explica o problema.

---

## Por que criar exceptions próprias

Exceptions próprias ajudam em:

```text
clareza;
diagnóstico;
tratamento específico;
organização por camada;
testes;
mapeamento para HTTP futuramente;
logs mais precisos;
separação entre erro de domínio e erro técnico.
```

Exemplo futuro em API REST:

```text
PedidoNaoEncontradoException -> HTTP 404
PedidoNaoPodeSerFaturadoException -> HTTP 409 ou 422
ValidacaoException -> HTTP 400
FalhaIntegracaoException -> HTTP 502 ou 503
```

Ainda não estamos no Spring, mas já vamos construir a mentalidade.

---

## Quando não criar exception própria

Não crie exception própria para tudo.

Exemplo simples:

```java
if (nome == null || nome.isBlank()) {
    throw new IllegalArgumentException("Nome é obrigatório.");
}
```

Isso pode continuar sendo `IllegalArgumentException`.

Crie exception própria quando o erro tem significado importante para o domínio ou para a arquitetura.

Exemplos bons:

```text
PedidoNaoEncontradoException;
PedidoNaoPodeSerFaturadoException;
ProdutoSemEstoqueException;
ClienteBloqueadoException;
FalhaLeituraArquivoException.
```

Exemplos exagerados:

```text
NomeNuloException;
EmailSemArrobaException;
PrecoMenorQueZeroException;
CampoEmBrancoException.
```

Para validações simples de argumento, `IllegalArgumentException` ainda é suficiente.

---

## Frase arquitetural aplicada a erros

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de exceptions:

```text
Entidade:
lança exception quando a própria regra é violada.

Service/use case:
lança exception quando o fluxo não pode continuar.

Repository/infra:
lança ou converte exceptions técnicas.

Controller futuro:
traduz exceptions para resposta HTTP.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-203-exceptions-proprias-dominio-infraestrutura
cd labs\m8\aula-203-exceptions-proprias-dominio-infraestrutura
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula203
mkdir src\br\com\curso\aula203\app
mkdir src\br\com\curso\aula203\dominio
mkdir src\br\com\curso\aula203\dominio\cliente
mkdir src\br\com\curso\aula203\dominio\pedido
mkdir src\br\com\curso\aula203\dominio\produto
mkdir src\br\com\curso\aula203\exception
mkdir src\br\com\curso\aula203\exception\dominio
mkdir src\br\com\curso\aula203\exception\infra
mkdir src\br\com\curso\aula203\infra
mkdir src\br\com\curso\aula203\service
```

---

# Parte 1 — Primeira exception própria

## Criando uma exception simples

Crie:

```text
src\br\com\curso\aula203\exception\dominio\PedidoNaoEncontradoException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class PedidoNaoEncontradoException extends RuntimeException {
    public PedidoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Como usar

Crie:

```text
src\br\com\curso\aula203\app\PrimeiraExceptionPropriaApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.exception.dominio.PedidoNaoEncontradoException;

public class PrimeiraExceptionPropriaApp {
    public static void main(String[] args) {
        buscarPedido("PED-001");
    }

    private static void buscarPedido(String codigo) {
        throw new PedidoNaoEncontradoException("Pedido não encontrado: " + codigo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.PrimeiraExceptionPropriaApp
```

---

## O que observar

O stack trace mostra:

```text
PedidoNaoEncontradoException
```

Isso é muito mais expressivo do que:

```text
RuntimeException
```

A classe da exception comunica o tipo do erro.

A mensagem comunica o detalhe.

---

## Estrutura mínima de uma exception própria

Uma exception própria unchecked geralmente fica assim:

```java
public class MinhaException extends RuntimeException {
    public MinhaException(String mensagem) {
        super(mensagem);
    }
}
```

Quando precisa preservar causa:

```java
public class MinhaException extends RuntimeException {
    public MinhaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

# Parte 2 — Exception com causa

## Por que causa importa

Quando você converte uma exception técnica, precisa preservar a original.

Exemplo:

```java
catch (IOException erro) {
    throw new FalhaLeituraArquivoException("Falha ao ler arquivo.", erro);
}
```

A mensagem nova dá contexto da aplicação.

A causa original preserva o detalhe técnico.

---

## Criando exception de infraestrutura

Crie:

```text
src\br\com\curso\aula203\exception\infra\FalhaLeituraArquivoException.java
```

Código:

```java
package br.com.curso.aula203.exception.infra;

public class FalhaLeituraArquivoException extends RuntimeException {
    public FalhaLeituraArquivoException(String mensagem) {
        super(mensagem);
    }

    public FalhaLeituraArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## LeitorArquivo

Crie:

```text
src\br\com\curso\aula203\infra\LeitorArquivo.java
```

Código:

```java
package br.com.curso.aula203.infra;

import br.com.curso.aula203.exception.infra.FalhaLeituraArquivoException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class LeitorArquivo {
    public List<String> lerLinhas(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho do arquivo é obrigatório.");
        }

        try {
            return Files.readAllLines(Path.of(caminho));
        } catch (IOException erro) {
            throw new FalhaLeituraArquivoException("Falha ao ler arquivo: " + caminho, erro);
        }
    }
}
```

---

## App com causa preservada

Crie:

```text
src\br\com\curso\aula203\app\FalhaLeituraArquivoApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.infra.LeitorArquivo;

public class FalhaLeituraArquivoApp {
    public static void main(String[] args) {
        LeitorArquivo leitor = new LeitorArquivo();

        leitor.lerLinhas("arquivo-inexistente.txt");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.FalhaLeituraArquivoApp
```

---

## O que observar no stack trace

Você deve ver:

```text
FalhaLeituraArquivoException
```

e abaixo algo como:

```text
Caused by: java.nio.file.NoSuchFileException
```

Isso é bom.

A exception da aplicação explica o contexto.

A causa original explica o problema técnico.

Regra profissional:

```text
ao converter exception, preserve a causa.
```

---

# Parte 3 — Exceptions de domínio

## O que é exception de domínio

Exception de domínio representa violação de regra de negócio.

Exemplos:

```text
PedidoNaoPodeSerFaturadoException;
ProdutoIndisponivelException;
ClienteBloqueadoException;
EstoqueInsuficienteException;
OrdemServicoNaoPodeSerReagendadaException.
```

Essas exceptions não são sobre arquivo, rede ou banco.

Elas são sobre regra do negócio.

---

## Criando PedidoNaoPodeSerFaturadoException

Crie:

```text
src\br\com\curso\aula203\exception\dominio\PedidoNaoPodeSerFaturadoException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class PedidoNaoPodeSerFaturadoException extends RuntimeException {
    public PedidoNaoPodeSerFaturadoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula203\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula203.dominio.pedido;

import br.com.curso.aula203.exception.dominio.PedidoNaoPodeSerFaturadoException;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final boolean pago;
    private boolean cancelado;
    private boolean faturado;

    public Pedido(String codigo, String cliente, BigDecimal valor, boolean pago) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do pedido é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do pedido deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.pago = pago;
        this.cancelado = false;
        this.faturado = false;
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

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public boolean faturado() {
        return faturado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado && !faturado;
    }

    public void cancelar() {
        if (faturado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido faturado não pode ser cancelado: " + codigo);
        }

        if (cancelado) {
            throw new IllegalStateException("Pedido já está cancelado: " + codigo);
        }

        cancelado = true;
    }

    public void faturar() {
        if (!pago) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido não pago não pode ser faturado: " + codigo);
        }

        if (cancelado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido cancelado não pode ser faturado: " + codigo);
        }

        if (faturado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido já foi faturado: " + codigo);
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Pedido

Crie:

```text
src\br\com\curso\aula203\app\PedidoExceptionDominioApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.dominio.pedido.Pedido;
import br.com.curso.aula203.exception.dominio.PedidoNaoPodeSerFaturadoException;

import java.math.BigDecimal;

public class PedidoExceptionDominioApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "PED-001",
                "Ana",
                new BigDecimal("500.00"),
                false
        );

        try {
            pedido.faturar();
            System.out.println("Pedido faturado: " + pedido.resumo());
        } catch (PedidoNaoPodeSerFaturadoException erro) {
            System.out.println("Falha de negócio: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.PedidoExceptionDominioApp
```

---

## O que melhorou

Antes:

```text
IllegalStateException
```

Agora:

```text
PedidoNaoPodeSerFaturadoException
```

O tipo do erro comunica a regra violada.

Isso facilita:

```text
leitura;
tratamento;
testes;
mapeamento HTTP futuro;
logs.
```

---

# Parte 4 — Exception de recurso não encontrado

## Erro de não encontrado

Em backend, erro de "não encontrado" é muito comum.

Exemplos:

```text
cliente não encontrado;
pedido não encontrado;
produto não encontrado;
OS não encontrada.
```

Em API REST, isso normalmente vira:

```text
HTTP 404
```

Ainda não estamos no Spring, mas já podemos modelar bem.

---

## PedidoNaoEncontradoException

Já criamos:

```java
PedidoNaoEncontradoException
```

Agora vamos usar em um service.

---

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula203\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula203.service;

import br.com.curso.aula203.dominio.pedido.Pedido;
import br.com.curso.aula203.exception.dominio.PedidoNaoEncontradoException;

import java.util.List;

public class PedidoFaturamentoService {
    private final List<Pedido> pedidos;

    public PedidoFaturamentoService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = pedidos;
    }

    public Pedido buscarObrigatorio(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado: " + codigo));
    }

    public Pedido faturar(String codigo) {
        Pedido pedido = buscarObrigatorio(codigo);

        pedido.faturar();

        return pedido;
    }
}
```

---

## App Service

Crie:

```text
src\br\com\curso\aula203\app\PedidoServiceExceptionApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.dominio.pedido.Pedido;
import br.com.curso.aula203.exception.dominio.PedidoNaoEncontradoException;
import br.com.curso.aula203.exception.dominio.PedidoNaoPodeSerFaturadoException;
import br.com.curso.aula203.service.PedidoFaturamentoService;

import java.math.BigDecimal;
import java.util.List;

public class PedidoServiceExceptionApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), false)
        );

        PedidoFaturamentoService service = new PedidoFaturamentoService(pedidos);

        executar("Pedido existente e pago", () -> {
            Pedido pedido = service.faturar("PED-001");
            System.out.println(pedido.resumo());
        });

        executar("Pedido inexistente", () -> {
            Pedido pedido = service.faturar("PED-999");
            System.out.println(pedido.resumo());
        });

        executar("Pedido não pago", () -> {
            Pedido pedido = service.faturar("PED-002");
            System.out.println(pedido.resumo());
        });
    }

    private static void executar(String descricao, Runnable acao) {
        System.out.println();
        System.out.println("Cenário: " + descricao);

        try {
            acao.run();
        } catch (PedidoNaoEncontradoException erro) {
            System.out.println("Não encontrado: " + erro.getMessage());
        } catch (PedidoNaoPodeSerFaturadoException erro) {
            System.out.println("Regra de negócio: " + erro.getMessage());
        } catch (RuntimeException erro) {
            System.out.println("Erro inesperado: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.PedidoServiceExceptionApp
```

---

## O que observar

Agora o app consegue diferenciar:

```text
pedido não encontrado;
pedido não pode ser faturado;
erro inesperado.
```

Essa diferenciação será muito importante quando chegarmos em APIs REST.

---

# Parte 5 — Produto com exceptions específicas

## Exceptions do produto

Crie:

```text
src\br\com\curso\aula203\exception\dominio\ProdutoIndisponivelException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class ProdutoIndisponivelException extends RuntimeException {
    public ProdutoIndisponivelException(String mensagem) {
        super(mensagem);
    }
}
```

Crie:

```text
src\br\com\curso\aula203\exception\dominio\EstoqueInsuficienteException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class EstoqueInsuficienteException extends RuntimeException {
    public EstoqueInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
```

Crie:

```text
src\br\com\curso\aula203\exception\dominio\ProdutoNaoEncontradoException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class ProdutoNaoEncontradoException extends RuntimeException {
    public ProdutoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Produto

Crie:

```text
src\br\com\curso\aula203\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula203.dominio.produto;

import br.com.curso.aula203.exception.dominio.EstoqueInsuficienteException;
import br.com.curso.aula203.exception.dominio.ProdutoIndisponivelException;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final BigDecimal preco;
    private boolean ativo;
    private int estoque;

    public Produto(String sku, String nome, BigDecimal preco, boolean ativo, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.preco = preco;
        this.ativo = ativo;
        this.estoque = estoque;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal preco() {
        return preco;
    }

    public boolean ativo() {
        return ativo;
    }

    public int estoque() {
        return estoque;
    }

    public boolean disponivel() {
        return ativo && estoque > 0;
    }

    public void vender(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (!ativo) {
            throw new ProdutoIndisponivelException("Produto inativo não pode ser vendido: " + sku);
        }

        if (estoque < quantidade) {
            throw new EstoqueInsuficienteException(
                    "Estoque insuficiente para o produto " + sku
                            + ". Solicitado: " + quantidade
                            + ", disponível: " + estoque
            );
        }

        estoque -= quantidade;
    }

    public void inativar() {
        if (!ativo) {
            throw new ProdutoIndisponivelException("Produto já está inativo: " + sku);
        }

        ativo = false;
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Preço: " + preco
                + " | Ativo: " + ativo
                + " | Estoque: " + estoque;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoVendaService

Crie:

```text
src\br\com\curso\aula203\service\ProdutoVendaService.java
```

Código:

```java
package br.com.curso.aula203.service;

import br.com.curso.aula203.dominio.produto.Produto;
import br.com.curso.aula203.exception.dominio.ProdutoNaoEncontradoException;

import java.util.List;

public class ProdutoVendaService {
    private final List<Produto> produtos;

    public ProdutoVendaService(List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        this.produtos = produtos;
    }

    public Produto buscarObrigatorio(String sku) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        String normalizado = sku.trim().toUpperCase();

        return produtos.stream()
                .filter(produto -> produto.sku().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado: " + sku));
    }

    public Produto vender(String sku, int quantidade) {
        Produto produto = buscarObrigatorio(sku);

        produto.vender(quantidade);

        return produto;
    }

    public Produto inativar(String sku) {
        Produto produto = buscarObrigatorio(sku);

        produto.inativar();

        return produto;
    }
}
```

---

## App Produto

Crie:

```text
src\br\com\curso\aula203\app\ProdutoExceptionPropriaApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.dominio.produto.Produto;
import br.com.curso.aula203.exception.dominio.EstoqueInsuficienteException;
import br.com.curso.aula203.exception.dominio.ProdutoIndisponivelException;
import br.com.curso.aula203.exception.dominio.ProdutoNaoEncontradoException;
import br.com.curso.aula203.service.ProdutoVendaService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoExceptionPropriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("PRD-001", "Notebook", new BigDecimal("3500.00"), true, 5),
                new Produto("PRD-002", "Mouse", new BigDecimal("80.00"), true, 2),
                new Produto("PRD-003", "Monitor", new BigDecimal("1200.00"), false, 0)
        );

        ProdutoVendaService service = new ProdutoVendaService(produtos);

        executar("Venda com sucesso", () -> {
            Produto produto = service.vender("PRD-001", 2);
            System.out.println(produto.resumo());
        });

        executar("Estoque insuficiente", () -> {
            Produto produto = service.vender("PRD-002", 10);
            System.out.println(produto.resumo());
        });

        executar("Produto inativo", () -> {
            Produto produto = service.vender("PRD-003", 1);
            System.out.println(produto.resumo());
        });

        executar("Produto inexistente", () -> {
            Produto produto = service.vender("PRD-999", 1);
            System.out.println(produto.resumo());
        });
    }

    private static void executar(String descricao, Runnable acao) {
        System.out.println();
        System.out.println("Cenário: " + descricao);

        try {
            acao.run();
        } catch (ProdutoNaoEncontradoException erro) {
            System.out.println("Não encontrado: " + erro.getMessage());
        } catch (ProdutoIndisponivelException erro) {
            System.out.println("Produto indisponível: " + erro.getMessage());
        } catch (EstoqueInsuficienteException erro) {
            System.out.println("Estoque: " + erro.getMessage());
        } catch (RuntimeException erro) {
            System.out.println("Erro: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.ProdutoExceptionPropriaApp
```

---

# Parte 6 — Base de exception de domínio

## Problema de muitas exceptions

Quando o sistema cresce, você pode ter várias exceptions de domínio:

```text
PedidoNaoEncontradoException;
PedidoNaoPodeSerFaturadoException;
ProdutoNaoEncontradoException;
ProdutoIndisponivelException;
EstoqueInsuficienteException;
ClienteBloqueadoException.
```

Às vezes é útil criar uma base:

```text
DominioException
```

Isso permite capturar todos os erros de domínio em um ponto comum.

---

## Criando DominioException

Crie:

```text
src\br\com\curso\aula203\exception\dominio\DominioException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class DominioException extends RuntimeException {
    public DominioException(String mensagem) {
        super(mensagem);
    }

    public DominioException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Como ficaria uma exception herdando dela

Exemplo conceitual:

```java
public class ClienteBloqueadoException extends DominioException {
    public ClienteBloqueadoException(String mensagem) {
        super(mensagem);
    }
}
```

Nesta aula, não vamos alterar todas as exceptions anteriores para não gerar retrabalho.

Mas em projeto profissional, faz sentido criar uma hierarquia:

```text
DominioException
 ├── PedidoNaoEncontradoException
 ├── PedidoNaoPodeSerFaturadoException
 ├── ProdutoNaoEncontradoException
 ├── ProdutoIndisponivelException
 └── EstoqueInsuficienteException
```

---

## Vantagem

Você pode capturar tudo que é domínio:

```java
catch (DominioException erro) {
    ...
}
```

E separar de erro técnico:

```java
catch (InfraestruturaException erro) {
    ...
}
```

---

# Parte 7 — Base de exception de infraestrutura

## Criando InfraestruturaException

Crie:

```text
src\br\com\curso\aula203\exception\infra\InfraestruturaException.java
```

Código:

```java
package br.com.curso.aula203.exception.infra;

public class InfraestruturaException extends RuntimeException {
    public InfraestruturaException(String mensagem) {
        super(mensagem);
    }

    public InfraestruturaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Como ficaria FalhaLeituraArquivoException

Em projeto profissional, você poderia escrever:

```java
public class FalhaLeituraArquivoException extends InfraestruturaException {
    public FalhaLeituraArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Assim, todas as falhas técnicas poderiam ter base comum.

---

## Organização por tipo

Uma organização possível:

```text
exception
 ├── dominio
 │    ├── DominioException
 │    ├── PedidoNaoEncontradoException
 │    ├── ProdutoIndisponivelException
 │    └── EstoqueInsuficienteException
 └── infra
      ├── InfraestruturaException
      ├── FalhaLeituraArquivoException
      └── FalhaIntegracaoException
```

Isso ajuda no tratamento futuro.

---

# Parte 8 — Cliente com exception própria

## ClienteBloqueadoException

Crie:

```text
src\br\com\curso\aula203\exception\dominio\ClienteBloqueadoException.java
```

Código:

```java
package br.com.curso.aula203.exception.dominio;

public class ClienteBloqueadoException extends RuntimeException {
    public ClienteBloqueadoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula203\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula203.dominio.cliente;

import br.com.curso.aula203.exception.dominio.ClienteBloqueadoException;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;
    private final boolean bloqueado;

    public Cliente(String nome, String email, boolean ativo, boolean bloqueado) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente é inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
        this.bloqueado = bloqueado;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean bloqueado() {
        return bloqueado;
    }

    public boolean podeOperar() {
        return ativo && !bloqueado;
    }

    public void validarPodeOperar() {
        if (!ativo) {
            throw new IllegalStateException("Cliente inativo não pode operar: " + email);
        }

        if (bloqueado) {
            throw new ClienteBloqueadoException("Cliente bloqueado não pode operar: " + email);
        }
    }

    public String resumo() {
        return nome
                + " | " + email
                + " | Ativo: " + ativo
                + " | Bloqueado: " + bloqueado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Cliente

Crie:

```text
src\br\com\curso\aula203\app\ClienteExceptionPropriaApp.java
```

Código:

```java
package br.com.curso.aula203.app;

import br.com.curso.aula203.dominio.cliente.Cliente;
import br.com.curso.aula203.exception.dominio.ClienteBloqueadoException;

public class ClienteExceptionPropriaApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Carlos Souza",
                "carlos@empresa.com",
                true,
                true
        );

        try {
            cliente.validarPodeOperar();
            System.out.println(cliente.resumo());
        } catch (ClienteBloqueadoException erro) {
            System.out.println("Cliente bloqueado: " + erro.getMessage());
        } catch (IllegalStateException erro) {
            System.out.println("Estado inválido: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula203.app.ClienteExceptionPropriaApp
```

---

# Parte 9 — Boas práticas

## 1. Nome da exception deve explicar o erro

Bom:

```text
PedidoNaoEncontradoException
ProdutoIndisponivelException
EstoqueInsuficienteException
FalhaLeituraArquivoException
```

Ruim:

```text
ErroException
SistemaException
MinhaException
ExceptionGenerica
```

---

## 2. Mensagem deve trazer contexto

Bom:

```text
Pedido não encontrado: PED-001
Estoque insuficiente para o produto PRD-001. Solicitado: 10, disponível: 2
Falha ao ler arquivo: produtos.txt
```

Ruim:

```text
Não encontrado.
Erro.
Falha.
```

---

## 3. Preserve causa em erros técnicos

Bom:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo: " + caminho, erro);
```

Ruim:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo.");
```

quando havia exception original disponível.

---

## 4. Não crie exception para toda validação simples

Para argumento inválido comum:

```java
IllegalArgumentException
```

continua sendo bom.

---

## 5. Use hierarquia quando o sistema crescer

Exemplo:

```text
DominioException;
InfraestruturaException;
AplicacaoException.
```

Mas não complique cedo demais.

---

## 6. Service deve diferenciar ausência e regra violada

Exemplo:

```text
PedidoNaoEncontradoException:
o pedido não existe.

PedidoNaoPodeSerFaturadoException:
o pedido existe, mas a regra impede faturamento.
```

Esses erros são diferentes.

---

# Parte 10 — Erros comuns

## 1. Exception própria sem significado

Ruim:

```java
public class SistemaException extends RuntimeException
```

se ela vira balaio para qualquer coisa.

---

## 2. Perder a causa original

Ruim:

```java
catch (IOException erro) {
    throw new RuntimeException("Erro ao ler.");
}
```

Melhor:

```java
catch (IOException erro) {
    throw new FalhaLeituraArquivoException("Erro ao ler arquivo.", erro);
}
```

---

## 3. Capturar exception específica e tratar como genérica

Ruim:

```java
catch (PedidoNaoEncontradoException erro) {
    System.out.println("Erro.");
}
```

Melhor:

```java
catch (PedidoNaoEncontradoException erro) {
    System.out.println("Pedido não encontrado: " + erro.getMessage());
}
```

---

## 4. Usar exception própria para esconder design ruim

Se todo método lança uma exception diferente para qualquer detalhe, o sistema vira ruído.

Exception própria deve representar algo relevante.

---

## 5. Colocar regra de negócio no nome errado

Exemplo ruim:

```text
ValidacaoException
```

para tudo.

Melhor quando for importante:

```text
PedidoNaoPodeSerFaturadoException
ClienteBloqueadoException
ProdutoIndisponivelException
```

---

# Parte 11 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula203.app.PrimeiraExceptionPropriaApp
java -cp out br.com.curso.aula203.app.FalhaLeituraArquivoApp
java -cp out br.com.curso.aula203.app.PedidoExceptionDominioApp
java -cp out br.com.curso.aula203.app.PedidoServiceExceptionApp
java -cp out br.com.curso.aula203.app.ProdutoExceptionPropriaApp
java -cp out br.com.curso.aula203.app.ClienteExceptionPropriaApp
```

Para cada execução, responda:

```text
qual exception própria apareceu?
ela é de domínio ou infraestrutura?
a mensagem trouxe contexto?
havia causa original?
o catch foi específico?
o erro era ausência, regra violada ou falha técnica?
```

---

# Parte 12 — Desafio prático

## Contexto

Você vai criar um mini fluxo de Ordem de Serviço.

O objetivo é praticar:

```text
exceptions próprias de domínio;
exceptions próprias de não encontrado;
exceptions próprias de regra violada;
service coordenando fluxo;
entidade protegendo regra;
app tratando cenários.
```

---

## Exceptions

Crie:

```text
OrdemServicoNaoEncontradaException
```

Mensagem esperada:

```text
Ordem de Serviço não encontrada: OS-001
```

Crie:

```text
OrdemServicoNaoPodeSerReagendadaException
```

Mensagens possíveis:

```text
OS concluída não pode ser reagendada: OS-001
OS cancelada não pode ser reagendada: OS-001
OS já está reagendada para a data informada: OS-001
```

Crie:

```text
DataAgendamentoInvalidaException
```

Mensagens possíveis:

```text
Data de agendamento é obrigatória.
Data de agendamento não pode ser anterior à data atual.
```

---

## Entidade OrdemServico

Crie:

```text
src\br\com\curso\aula203\dominio\ordemservico\OrdemServico.java
```

Campos:

```text
String codigo;
String cliente;
String status;
LocalDate dataAgendada;
```

Regras:

```text
codigo obrigatório;
cliente obrigatório;
status obrigatório;
dataAgendada obrigatória.
```

Métodos:

```java
boolean concluida()
boolean cancelada()
boolean reagendada()
void reagendar(LocalDate novaData, LocalDate hoje)
String resumo()
```

Regras do reagendar:

```text
novaData obrigatória;
hoje obrigatório;
novaData não pode ser anterior a hoje;
OS concluída não pode reagendar;
OS cancelada não pode reagendar;
se novaData for igual dataAgendada e status já for REAGENDADA, lançar exception;
ao reagendar:
    atualizar dataAgendada;
    atualizar status para REAGENDADA.
```

---

## Service

Crie:

```text
OrdemServicoReagendamentoService
```

Campos:

```text
List<OrdemServico> ordens
```

Métodos:

```java
OrdemServico buscarObrigatoria(String codigo)

OrdemServico reagendar(String codigo, LocalDate novaData, LocalDate hoje)
```

Regras:

```text
buscarObrigatoria:
validar código;
procurar na lista;
se não encontrar, lançar OrdemServicoNaoEncontradaException.

reagendar:
buscar obrigatória;
chamar os.reagendar(novaData, hoje);
retornar OS.
```

---

## App

Crie:

```text
OrdemServicoReagendamentoExceptionApp
```

Cenários obrigatórios:

```text
reagendamento com sucesso;
OS inexistente;
OS concluída;
OS cancelada;
data anterior a hoje;
reagendamento duplicado.
```

Critérios:

```text
catch específico por tipo de exception;
mensagem clara;
service não imprime;
entidade decide regra;
app apenas demonstra.
```

---

## Desafio extra

Crie uma exception base:

```text
OrdemServicoException extends RuntimeException
```

Faça as exceptions de OS herdarem dela.

No app, teste capturar:

```java
catch (OrdemServicoException erro)
```

Depois teste capturar exceptions específicas.

Objetivo:

```text
entender diferença entre capturar categoria e capturar caso específico.
```

---

# Parte 13 — Debug recomendado

Coloque breakpoints em:

```text
Pedido.faturar
PedidoFaturamentoService.buscarObrigatorio
Produto.vender
ProdutoVendaService.buscarObrigatorio
LeitorArquivo.lerLinhas
Cliente.validarPodeOperar
```

Observe:

```text
onde a exception nasce;
qual classe representa o erro;
qual mensagem foi montada;
se a causa original foi preservada;
qual catch capturou;
se o erro era domínio ou infraestrutura.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve uma exception própria?
2. Quando não vale a pena criar exception própria?
3. Por que preservar a causa original?
4. Qual a diferença entre exception de domínio e de infraestrutura?
5. Por que PedidoNaoEncontradoException é diferente de PedidoNaoPodeSerFaturadoException?
6. Quando usar uma exception base como DominioException?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar exception própria;
estender RuntimeException;
criar construtor com mensagem;
criar construtor com mensagem e causa;
preservar causa original;
criar exception de domínio;
criar exception de infraestrutura;
diferenciar não encontrado de regra violada;
usar exception própria em entidade;
usar exception própria em service;
capturar exception específica;
capturar base de exception quando fizer sentido;
evitar RuntimeException genérica;
evitar exception própria sem significado;
resolver OrdemServicoReagendamentoExceptionApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-203-exceptions-proprias-dominio-infraestrutura
git commit -m "Aula 203: exceptions proprias dominio infraestrutura"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Exception própria dá nome e significado ao erro do seu sistema.
```

Você estudou:

```text
exceptions próprias;
exceptions de domínio;
exceptions de infraestrutura;
exception com mensagem;
exception com causa;
preservação da causa original;
não encontrado;
regra violada;
falha técnica;
hierarquia de exceptions;
DominioException;
InfraestruturaException.
```

Também reforçou a visão profissional:

```text
erro bem modelado facilita leitura, teste, log, suporte e resposta HTTP futura.
```

Na próxima aula, vamos aprofundar o bloco de controle de erro:

```text
try;
catch;
finally;
try-with-resources.
```

Vamos estudar:

```text
quando capturar;
quando executar limpeza;
como finally funciona;
por que try-with-resources é essencial para arquivos e recursos;
como evitar vazamento de recurso;
como isso se conecta com I/O no backend.
```
