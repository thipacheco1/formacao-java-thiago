# 205 — M8.05 — Modelagem de erros por camada: domínio, aplicação e infraestrutura

## Objetivo da aula

Na aula anterior, você estudou:

```text
try;
catch;
múltiplos catch;
multi-catch;
finally;
try-with-resources;
AutoCloseable;
fechamento automático de recursos;
suppressed exceptions;
exception própria de infraestrutura;
leitura de arquivo;
importação simples.
```

Agora vamos avançar para uma visão mais arquitetural:

```text
como modelar erros por camada.
```

Em backend profissional, erro não é apenas `throw new RuntimeException`.

Erro precisa ter intenção.

Erro precisa dizer:

```text
onde nasceu;
qual tipo de problema representa;
quem deve tratar;
como será comunicado para fora;
se é erro de domínio, aplicação ou infraestrutura;
se é erro esperado ou inesperado;
se deve virar 400, 404, 409, 422, 500, 502 ou 503 futuramente.
```

Ainda não estamos em Spring Boot, mas já vamos construir a mentalidade correta.

Ao final desta aula, você deve conseguir:

```text
diferenciar erro de domínio;
diferenciar erro de aplicação;
diferenciar erro de infraestrutura;
entender erro de validação de entrada;
entender erro de não encontrado;
entender erro de conflito de regra;
entender erro técnico;
criar uma hierarquia simples de exceptions;
decidir onde lançar cada tipo de erro;
evitar vazamento técnico entre camadas;
preservar causa original;
modelar mensagens claras;
preparar erros para futura tradução HTTP;
criar um fluxo completo com domínio, service e infra.
```

---

## Ideia principal

Nem todo erro é igual.

Compare:

```text
Nome do cliente é obrigatório.
```

com:

```text
Pedido não encontrado.
```

com:

```text
Pedido cancelado não pode ser faturado.
```

com:

```text
Falha ao ler arquivo.
```

com:

```text
Timeout ao chamar API externa.
```

Todos são erros.

Mas não são o mesmo tipo de erro.

Em backend profissional, precisamos separar.

---

## Classificação inicial

Vamos usar quatro categorias principais nesta aula:

```text
1. Erro de validação de entrada.
2. Erro de não encontrado.
3. Erro de regra/conflito de domínio.
4. Erro técnico/de infraestrutura.
```

Exemplos:

```text
Validação:
código obrigatório, email inválido, quantidade menor que zero.

Não encontrado:
pedido não encontrado, produto não encontrado, cliente não encontrado.

Regra/conflito:
pedido cancelado não pode faturar, cliente bloqueado não pode operar.

Infraestrutura:
falha de arquivo, falha de banco, falha de API externa, timeout.
```

---

## Relação com HTTP futuro

Quando chegarmos em Spring Boot REST APIs, esses erros normalmente serão traduzidos assim:

```text
Validação de entrada:
HTTP 400 Bad Request.

Não encontrado:
HTTP 404 Not Found.

Regra/conflito:
HTTP 409 Conflict ou 422 Unprocessable Entity.

Falha técnica:
HTTP 500 Internal Server Error.

Falha de integração externa:
HTTP 502 Bad Gateway ou 503 Service Unavailable.
```

Não vamos implementar HTTP agora.

Mas já vamos modelar os erros pensando nisso.

---

## Frase arquitetural do curso

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No tratamento de erro:

```text
Entidade:
lança erro de regra/invariante.

Use case/service:
lança erro de fluxo, não encontrado ou coordena exceções do domínio.

Repository/infra:
lança erro técnico ou converte erro técnico em exception própria.

Controller futuro:
traduz exception em resposta HTTP padronizada.
```

---

## Erro bem modelado melhora o sistema

Um erro bem modelado ajuda:

```text
desenvolvedor;
QA;
suporte;
logs;
testes automatizados;
documentação;
resposta de API;
observabilidade;
manutenção.
```

Erro ruim:

```text
Erro inesperado.
RuntimeException.
NullPointerException.
Falha.
```

Erro bom:

```text
Pedido não encontrado: PED-001.
Pedido cancelado não pode ser faturado: PED-002.
Falha ao carregar arquivo de importação: produtos.csv.
Cliente bloqueado não pode operar: cliente@empresa.com.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-205-modelagem-erros-por-camada-dominio-aplicacao-infra
cd labs\m8\aula-205-modelagem-erros-por-camada-dominio-aplicacao-infra
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula205
mkdir src\br\com\curso\aula205\app
mkdir src\br\com\curso\aula205\dominio
mkdir src\br\com\curso\aula205\dominio\cliente
mkdir src\br\com\curso\aula205\dominio\pedido
mkdir src\br\com\curso\aula205\dominio\produto
mkdir src\br\com\curso\aula205\exception
mkdir src\br\com\curso\aula205\exception\aplicacao
mkdir src\br\com\curso\aula205\exception\dominio
mkdir src\br\com\curso\aula205\exception\infra
mkdir src\br\com\curso\aula205\infra
mkdir src\br\com\curso\aula205\service
```

---

# Parte 1 — Hierarquia base de exceptions

## Por que criar bases

Em projetos pequenos, você pode criar exceptions diretas:

```text
PedidoNaoEncontradoException extends RuntimeException
ProdutoIndisponivelException extends RuntimeException
```

Em projetos maiores, bases ajudam a organizar:

```text
AplicacaoException;
DominioException;
InfraestruturaException.
```

Assim você consegue capturar categorias inteiras.

Exemplo:

```java
catch (DominioException erro) {
    ...
}
```

ou:

```java
catch (InfraestruturaException erro) {
    ...
}
```

---

## AplicacaoException

Crie:

```text
src\br\com\curso\aula205\exception\aplicacao\AplicacaoException.java
```

Código:

```java
package br.com.curso.aula205.exception.aplicacao;

public class AplicacaoException extends RuntimeException {
    public AplicacaoException(String mensagem) {
        super(mensagem);
    }

    public AplicacaoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## DominioException

Crie:

```text
src\br\com\curso\aula205\exception\dominio\DominioException.java
```

Código:

```java
package br.com.curso.aula205.exception.dominio;

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

## InfraestruturaException

Crie:

```text
src\br\com\curso\aula205\exception\infra\InfraestruturaException.java
```

Código:

```java
package br.com.curso.aula205.exception.infra;

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

## Como pensar essas bases

```text
AplicacaoException:
erro de fluxo da aplicação/use case.

DominioException:
erro de regra de negócio ou invariante.

InfraestruturaException:
erro técnico, arquivo, banco, API externa, recurso.
```

Essa separação será muito útil quando chegarmos em APIs.

---

# Parte 2 — Erros de aplicação

## O que é erro de aplicação

Erro de aplicação representa falha no fluxo do caso de uso.

Exemplos:

```text
pedido não encontrado;
produto não encontrado;
cliente não encontrado;
operação não permitida para o usuário;
dados necessários para o fluxo não existem.
```

Nem sempre é regra interna da entidade.

Muitas vezes é o service dizendo:

```text
para executar este caso de uso, eu precisava encontrar algo e não encontrei.
```

---

## RecursoNaoEncontradoException

Crie:

```text
src\br\com\curso\aula205\exception\aplicacao\RecursoNaoEncontradoException.java
```

Código:

```java
package br.com.curso.aula205.exception.aplicacao;

public class RecursoNaoEncontradoException extends AplicacaoException {
    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## PedidoNaoEncontradoException

Crie:

```text
src\br\com\curso\aula205\exception\aplicacao\PedidoNaoEncontradoException.java
```

Código:

```java
package br.com.curso.aula205.exception.aplicacao;

public class PedidoNaoEncontradoException extends RecursoNaoEncontradoException {
    public PedidoNaoEncontradoException(String codigo) {
        super("Pedido não encontrado: " + codigo);
    }
}
```

---

## ProdutoNaoEncontradoException

Crie:

```text
src\br\com\curso\aula205\exception\aplicacao\ProdutoNaoEncontradoException.java
```

Código:

```java
package br.com.curso.aula205.exception.aplicacao;

public class ProdutoNaoEncontradoException extends RecursoNaoEncontradoException {
    public ProdutoNaoEncontradoException(String sku) {
        super("Produto não encontrado: " + sku);
    }
}
```

---

## Por que não encontrado ficou em aplicação

Porque normalmente quem descobre ausência é:

```text
service;
use case;
repository.
```

A entidade `Pedido` não sabe se ela foi encontrada ou não.

Ela só sabe proteger suas próprias regras.

Por isso, `PedidoNaoEncontradoException` costuma ser erro de aplicação ou de consulta.

---

# Parte 3 — Erros de domínio

## O que é erro de domínio

Erro de domínio representa regra de negócio violada.

Exemplos:

```text
pedido cancelado não pode faturar;
pedido já faturado não pode cancelar;
produto inativo não pode vender;
estoque insuficiente;
cliente bloqueado não pode operar;
OS concluída não pode reagendar.
```

Esse erro nasce geralmente dentro da entidade ou dentro de uma regra de domínio.

---

## PedidoNaoPodeSerFaturadoException

Crie:

```text
src\br\com\curso\aula205\exception\dominio\PedidoNaoPodeSerFaturadoException.java
```

Código:

```java
package br.com.curso.aula205.exception.dominio;

public class PedidoNaoPodeSerFaturadoException extends DominioException {
    public PedidoNaoPodeSerFaturadoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## EstoqueInsuficienteException

Crie:

```text
src\br\com\curso\aula205\exception\dominio\EstoqueInsuficienteException.java
```

Código:

```java
package br.com.curso.aula205.exception.dominio;

public class EstoqueInsuficienteException extends DominioException {
    public EstoqueInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
```

---

## ProdutoIndisponivelException

Crie:

```text
src\br\com\curso\aula205\exception\dominio\ProdutoIndisponivelException.java
```

Código:

```java
package br.com.curso.aula205.exception.dominio;

public class ProdutoIndisponivelException extends DominioException {
    public ProdutoIndisponivelException(String mensagem) {
        super(mensagem);
    }
}
```

---

## ClienteBloqueadoException

Crie:

```text
src\br\com\curso\aula205\exception\dominio\ClienteBloqueadoException.java
```

Código:

```java
package br.com.curso.aula205.exception.dominio;

public class ClienteBloqueadoException extends DominioException {
    public ClienteBloqueadoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Por que domínio deve lançar seus próprios erros

Porque a entidade protege invariantes.

Exemplo:

```text
Pedido sabe se pode faturar.
Produto sabe se tem estoque.
Cliente sabe se está bloqueado.
```

O service não deveria ficar repetindo regras internas se a entidade pode decidir.

---

# Parte 4 — Erros de infraestrutura

## O que é erro de infraestrutura

Erro de infraestrutura representa falha técnica.

Exemplos:

```text
arquivo inexistente;
falha de leitura;
banco fora;
timeout;
permissão negada;
falha de rede;
API externa indisponível;
erro de parsing de arquivo técnico.
```

Esses erros não são regras de negócio.

Eles vêm do ambiente técnico.

---

## FalhaLeituraArquivoException

Crie:

```text
src\br\com\curso\aula205\exception\infra\FalhaLeituraArquivoException.java
```

Código:

```java
package br.com.curso.aula205.exception.infra;

public class FalhaLeituraArquivoException extends InfraestruturaException {
    public FalhaLeituraArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## FalhaPersistenciaException

Crie:

```text
src\br\com\curso\aula205\exception\infra\FalhaPersistenciaException.java
```

Código:

```java
package br.com.curso.aula205.exception.infra;

public class FalhaPersistenciaException extends InfraestruturaException {
    public FalhaPersistenciaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## FalhaIntegracaoException

Crie:

```text
src\br\com\curso\aula205\exception\infra\FalhaIntegracaoException.java
```

Código:

```java
package br.com.curso.aula205.exception.infra;

public class FalhaIntegracaoException extends InfraestruturaException {
    public FalhaIntegracaoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Por que infraestrutura deve preservar causa

Erro técnico tem causa raiz.

Exemplo:

```text
NoSuchFileException;
IOException;
SQLException;
SocketTimeoutException.
```

Ao converter:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo: " + caminho, erro);
```

A mensagem nova dá contexto.

A causa original preserva o diagnóstico.

---

# Parte 5 — Domínio Cliente

## Cliente

Crie:

```text
src\br\com\curso\aula205\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula205.dominio.cliente;

import br.com.curso.aula205.exception.dominio.ClienteBloqueadoException;

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

# Parte 6 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula205\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula205.dominio.produto;

import br.com.curso.aula205.exception.dominio.EstoqueInsuficienteException;
import br.com.curso.aula205.exception.dominio.ProdutoIndisponivelException;

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

# Parte 7 — Domínio Pedido

## Pedido

Crie:

```text
src\br\com\curso\aula205\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula205.dominio.pedido;

import br.com.curso.aula205.dominio.cliente.Cliente;
import br.com.curso.aula205.dominio.produto.Produto;
import br.com.curso.aula205.exception.dominio.PedidoNaoPodeSerFaturadoException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private final String codigo;
    private final Cliente cliente;
    private final List<Produto> produtos;
    private boolean pago;
    private boolean cancelado;
    private boolean faturado;

    public Pedido(String codigo, Cliente cliente, List<Produto> produtos, boolean pago) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente do pedido é obrigatório.");
        }

        if (produtos == null || produtos.isEmpty()) {
            throw new IllegalArgumentException("Pedido deve possuir produtos.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente;
        this.produtos = new ArrayList<>(produtos);
        this.pago = pago;
        this.cancelado = false;
        this.faturado = false;
    }

    public String codigo() {
        return codigo;
    }

    public Cliente cliente() {
        return cliente;
    }

    public List<Produto> produtos() {
        return List.copyOf(produtos);
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

    public BigDecimal total() {
        return produtos.stream()
                .map(Produto::preco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean podeFaturar() {
        return pago && !cancelado && !faturado;
    }

    public void cancelar() {
        if (faturado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido faturado não pode ser cancelado: " + codigo);
        }

        if (cancelado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido já está cancelado: " + codigo);
        }

        cancelado = true;
    }

    public void faturar() {
        cliente.validarPodeOperar();

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
                + " | Cliente: " + cliente.email()
                + " | Total: " + total()
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

## Observação importante

`Pedido.faturar()` chama:

```java
cliente.validarPodeOperar();
```

Isso mostra uma regra de domínio composta.

O pedido só fatura se:

```text
o cliente pode operar;
o pedido está pago;
o pedido não está cancelado;
o pedido não está faturado.
```

A entidade continua protegendo regra.

---

# Parte 8 — Service de pedido

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula205\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula205.service;

import br.com.curso.aula205.dominio.pedido.Pedido;
import br.com.curso.aula205.exception.aplicacao.PedidoNaoEncontradoException;

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
                .orElseThrow(() -> new PedidoNaoEncontradoException(codigo));
    }

    public Pedido faturar(String codigo) {
        Pedido pedido = buscarObrigatorio(codigo);

        pedido.faturar();

        return pedido;
    }
}
```

---

## Por que não encontrado está no service

O método:

```java
buscarObrigatorio
```

procura em uma lista.

Se não acha, isso é erro do fluxo da aplicação:

```text
não encontrei o recurso necessário para executar o caso de uso.
```

A entidade `Pedido` não participa desse erro.

Ela nem existe nesse caso.

---

# Parte 9 — Infraestrutura simulada

## RepositorioPedidoArquivo

Vamos simular uma infraestrutura que lê pedidos de um arquivo.

Não vamos montar parsing completo de pedido com cliente/produto agora.

O objetivo é mostrar erro técnico de leitura.

Crie:

```text
src\br\com\curso\aula205\infra\RepositorioPedidoArquivo.java
```

Código:

```java
package br.com.curso.aula205.infra;

import br.com.curso.aula205.exception.infra.FalhaLeituraArquivoException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class RepositorioPedidoArquivo {
    public List<String> lerLinhas(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho do arquivo é obrigatório.");
        }

        try {
            return Files.readAllLines(Path.of(caminho));
        } catch (IOException erro) {
            throw new FalhaLeituraArquivoException("Falha ao ler arquivo de pedidos: " + caminho, erro);
        }
    }
}
```

---

## App de infraestrutura

Crie:

```text
src\br\com\curso\aula205\app\InfraestruturaErroApp.java
```

Código:

```java
package br.com.curso.aula205.app;

import br.com.curso.aula205.exception.infra.FalhaLeituraArquivoException;
import br.com.curso.aula205.infra.RepositorioPedidoArquivo;

public class InfraestruturaErroApp {
    public static void main(String[] args) {
        RepositorioPedidoArquivo repositorio = new RepositorioPedidoArquivo();

        try {
            repositorio.lerLinhas("pedidos-inexistente.txt");
        } catch (FalhaLeituraArquivoException erro) {
            System.out.println("Erro técnico: " + erro.getMessage());
            System.out.println("Causa original: " + erro.getCause().getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula205.app.InfraestruturaErroApp
```

---

## O que observar

O erro de infraestrutura:

```text
FalhaLeituraArquivoException
```

preserva a causa:

```text
NoSuchFileException
```

Isso é essencial para diagnóstico.

---

# Parte 10 — App completo com tratamento por categoria

## PedidoFluxoApp

Crie:

```text
src\br\com\curso\aula205\app\PedidoFluxoErroPorCamadaApp.java
```

Código:

```java
package br.com.curso.aula205.app;

import br.com.curso.aula205.dominio.cliente.Cliente;
import br.com.curso.aula205.dominio.pedido.Pedido;
import br.com.curso.aula205.dominio.produto.Produto;
import br.com.curso.aula205.exception.aplicacao.AplicacaoException;
import br.com.curso.aula205.exception.dominio.DominioException;
import br.com.curso.aula205.exception.infra.InfraestruturaException;
import br.com.curso.aula205.service.PedidoFaturamentoService;

import java.math.BigDecimal;
import java.util.List;

public class PedidoFluxoErroPorCamadaApp {
    public static void main(String[] args) {
        Cliente clienteApto = new Cliente(
                "Ana Silva",
                "ana@empresa.com",
                true,
                false
        );

        Cliente clienteBloqueado = new Cliente(
                "Carlos Souza",
                "carlos@empresa.com",
                true,
                true
        );

        Produto notebook = new Produto(
                "PRD-001",
                "Notebook",
                new BigDecimal("3500.00"),
                true,
                5
        );

        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", clienteApto, List.of(notebook), true),
                new Pedido("PED-002", clienteBloqueado, List.of(notebook), true),
                new Pedido("PED-003", clienteApto, List.of(notebook), false)
        );

        PedidoFaturamentoService service = new PedidoFaturamentoService(pedidos);

        executar("Pedido apto", () -> {
            Pedido pedido = service.faturar("PED-001");
            System.out.println("Faturado: " + pedido.resumo());
        });

        executar("Pedido inexistente", () -> {
            Pedido pedido = service.faturar("PED-999");
            System.out.println("Faturado: " + pedido.resumo());
        });

        executar("Cliente bloqueado", () -> {
            Pedido pedido = service.faturar("PED-002");
            System.out.println("Faturado: " + pedido.resumo());
        });

        executar("Pedido não pago", () -> {
            Pedido pedido = service.faturar("PED-003");
            System.out.println("Faturado: " + pedido.resumo());
        });
    }

    private static void executar(String descricao, Runnable acao) {
        System.out.println();
        System.out.println("Cenário: " + descricao);

        try {
            acao.run();
        } catch (AplicacaoException erro) {
            System.out.println("Erro de aplicação: " + erro.getMessage());
        } catch (DominioException erro) {
            System.out.println("Erro de domínio: " + erro.getMessage());
        } catch (InfraestruturaException erro) {
            System.out.println("Erro de infraestrutura: " + erro.getMessage());
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro de validação: " + erro.getMessage());
        } catch (RuntimeException erro) {
            System.out.println("Erro inesperado: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula205.app.PedidoFluxoErroPorCamadaApp
```

---

## O que este app demonstra

Ele separa:

```text
AplicacaoException:
pedido não encontrado.

DominioException:
cliente bloqueado, pedido não pago, regra violada.

InfraestruturaException:
falha técnica.

IllegalArgumentException:
entrada inválida.

RuntimeException:
fallback para erro inesperado.
```

Essa estrutura é parecida com o que faremos futuramente com tratamento global em APIs.

---

# Parte 11 — Simulando tradução para HTTP futuro

## Classe ErroApiSimulado

Crie:

```text
src\br\com\curso\aula205\app\ErroApiSimulado.java
```

Código:

```java
package br.com.curso.aula205.app;

public class ErroApiSimulado {
    private final int status;
    private final String tipo;
    private final String mensagem;

    public ErroApiSimulado(int status, String tipo, String mensagem) {
        this.status = status;
        this.tipo = tipo;
        this.mensagem = mensagem;
    }

    public int status() {
        return status;
    }

    public String tipo() {
        return tipo;
    }

    public String mensagem() {
        return mensagem;
    }

    @Override
    public String toString() {
        return "HTTP " + status + " | " + tipo + " | " + mensagem;
    }
}
```

---

## TradutorErroSimulado

Crie:

```text
src\br\com\curso\aula205\app\TradutorErroSimulado.java
```

Código:

```java
package br.com.curso.aula205.app;

import br.com.curso.aula205.exception.aplicacao.RecursoNaoEncontradoException;
import br.com.curso.aula205.exception.dominio.DominioException;
import br.com.curso.aula205.exception.infra.InfraestruturaException;

public final class TradutorErroSimulado {
    private TradutorErroSimulado() {
    }

    public static ErroApiSimulado traduzir(RuntimeException erro) {
        if (erro instanceof IllegalArgumentException) {
            return new ErroApiSimulado(400, "VALIDACAO", erro.getMessage());
        }

        if (erro instanceof RecursoNaoEncontradoException) {
            return new ErroApiSimulado(404, "NAO_ENCONTRADO", erro.getMessage());
        }

        if (erro instanceof DominioException) {
            return new ErroApiSimulado(409, "REGRA_NEGOCIO", erro.getMessage());
        }

        if (erro instanceof InfraestruturaException) {
            return new ErroApiSimulado(500, "FALHA_TECNICA", "Falha técnica ao processar solicitação.");
        }

        return new ErroApiSimulado(500, "ERRO_INTERNO", "Erro interno inesperado.");
    }
}
```

---

## App Tradutor

Crie:

```text
src\br\com\curso\aula205\app\TradutorErroSimuladoApp.java
```

Código:

```java
package br.com.curso.aula205.app;

import br.com.curso.aula205.exception.aplicacao.PedidoNaoEncontradoException;
import br.com.curso.aula205.exception.dominio.PedidoNaoPodeSerFaturadoException;
import br.com.curso.aula205.exception.infra.FalhaLeituraArquivoException;

import java.io.IOException;

public class TradutorErroSimuladoApp {
    public static void main(String[] args) {
        simular(new IllegalArgumentException("Código é obrigatório."));
        simular(new PedidoNaoEncontradoException("PED-999"));
        simular(new PedidoNaoPodeSerFaturadoException("Pedido cancelado não pode ser faturado: PED-001"));
        simular(new FalhaLeituraArquivoException("Falha ao ler arquivo.", new IOException("Arquivo inexistente.")));
        simular(new RuntimeException("Erro desconhecido."));
    }

    private static void simular(RuntimeException erro) {
        ErroApiSimulado resposta = TradutorErroSimulado.traduzir(erro);

        System.out.println(resposta);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula205.app.TradutorErroSimuladoApp
```

---

## Observação importante

Esse tradutor é apenas uma simulação.

No Spring Boot, isso será feito com:

```text
@ControllerAdvice;
@ExceptionHandler;
ResponseEntity;
DTO de erro;
status HTTP.
```

Mas o raciocínio será o mesmo.

---

# Parte 12 — Cuidado com ordem no tradutor

## Ordem importa

No tradutor, repare:

```java
if (erro instanceof IllegalArgumentException) {
    ...
}

if (erro instanceof RecursoNaoEncontradoException) {
    ...
}
```

Aqui não há conflito de herança direta entre esses dois.

Mas quando há hierarquia, a ordem importa.

Exemplo:

```java
if (erro instanceof AplicacaoException) {
    ...
}

if (erro instanceof RecursoNaoEncontradoException) {
    ...
}
```

Se `AplicacaoException` vier antes, `RecursoNaoEncontradoException` nunca terá tratamento específico.

Regra:

```text
trate o mais específico antes do mais genérico.
```

---

# Parte 13 — Boas práticas

## 1. Classifique o erro antes de criar exception

Pergunte:

```text
é validação?
é não encontrado?
é regra de domínio?
é infraestrutura?
é inesperado?
```

---

## 2. Não encontrado não é a mesma coisa que regra violada

```text
Pedido não encontrado:
não achei o recurso.

Pedido cancelado:
achei o recurso, mas ele não pode executar a operação.
```

São erros diferentes.

---

## 3. Infraestrutura não deve vazar detalhes para usuário final

Mensagem interna:

```text
NoSuchFileException: /var/app/import/produtos.csv
```

Mensagem externa futura:

```text
Falha técnica ao processar solicitação.
```

Log interno terá detalhes.

Resposta externa deve ser controlada.

---

## 4. Preserve causa para diagnóstico

Sempre que converter falha técnica:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo: " + caminho, erro);
```

---

## 5. Use mensagens com contexto

Bom:

```text
Pedido não encontrado: PED-001.
Produto inativo não pode ser vendido: PRD-001.
Estoque insuficiente para o produto PRD-001. Solicitado: 10, disponível: 2.
```

---

## 6. Não crie hierarquia complexa cedo demais

Bases como:

```text
DominioException;
AplicacaoException;
InfraestruturaException.
```

são úteis.

Mas não precisa criar 30 classes sem necessidade.

---

## 7. Controller futuro traduz, não decide regra

Quando chegarmos em REST:

```text
controller não deve decidir se pedido pode faturar.
```

Ele apenas chama o use case/service e traduz o resultado ou erro.

---

# Parte 14 — Erros comuns

## 1. Usar RuntimeException para tudo

Ruim:

```java
throw new RuntimeException("Pedido não encontrado.");
throw new RuntimeException("Pedido cancelado.");
throw new RuntimeException("Falha no arquivo.");
```

Melhor:

```java
PedidoNaoEncontradoException;
PedidoNaoPodeSerFaturadoException;
FalhaLeituraArquivoException.
```

---

## 2. Misturar erro técnico com regra de negócio

Erro de arquivo não deve virar:

```text
PedidoNaoPodeSerFaturadoException
```

Cada coisa no seu lugar.

---

## 3. Expor causa técnica para usuário

Cuidado com mensagens externas.

Detalhe técnico deve ir para log.

Mensagem externa deve ser segura.

---

## 4. Tratar erro de domínio como erro interno

Se pedido cancelado não pode faturar, isso não é erro 500.

É regra violada.

---

## 5. Tratar não encontrado como validação genérica

Não encontrado tem significado próprio.

Futuramente, normalmente vira HTTP 404.

---

## 6. Criar exception sem contexto

Ruim:

```text
PedidoException
ProdutoException
ErroNegocio
```

Melhor:

```text
PedidoNaoEncontradoException
ProdutoIndisponivelException
EstoqueInsuficienteException
```

---

# Parte 15 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula205.app.InfraestruturaErroApp
java -cp out br.com.curso.aula205.app.PedidoFluxoErroPorCamadaApp
java -cp out br.com.curso.aula205.app.TradutorErroSimuladoApp
```

Para cada execução, responda:

```text
o erro foi de aplicação, domínio, infraestrutura ou validação?
qual exception foi lançada?
a mensagem tinha contexto?
a causa original foi preservada?
como esse erro seria traduzido para HTTP futuramente?
o erro nasceu na camada certa?
```

---

# Parte 16 — Desafio prático

## Contexto

Você vai criar um fluxo completo de reagendamento de Ordem de Serviço.

O objetivo é praticar:

```text
erro de validação;
erro de não encontrado;
erro de domínio;
erro de infraestrutura;
hierarquia de exceptions;
tradutor de erro simulado;
service coordenando fluxo;
entidade decidindo regra.
```

---

## Exceptions de aplicação

Crie:

```text
OrdemServicoNaoEncontradaException extends RecursoNaoEncontradoException
```

Mensagem:

```text
Ordem de Serviço não encontrada: OS-001
```

---

## Exceptions de domínio

Crie:

```text
OrdemServicoNaoPodeSerReagendadaException extends DominioException
```

Mensagens possíveis:

```text
OS concluída não pode ser reagendada: OS-001
OS cancelada não pode ser reagendada: OS-001
OS já está reagendada para a data informada: OS-001
```

Crie:

```text
DataAgendamentoInvalidaException extends DominioException
```

Mensagens possíveis:

```text
Data de agendamento é obrigatória.
Data de agendamento não pode ser anterior à data atual.
```

---

## Exception de infraestrutura

Crie:

```text
FalhaRegistroHistoricoException extends InfraestruturaException
```

Construtor:

```java
FalhaRegistroHistoricoException(String mensagem, Throwable causa)
```

---

## Entidade OrdemServico

Pacote:

```text
dominio/ordemservico
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

## Infra HistoricoOsGateway

Crie:

```text
infra/HistoricoOsGateway.java
```

Método:

```java
void registrar(String codigoOs, String descricao)
```

Simule erro quando:

```text
codigoOs igual "OS-ERRO"
```

Nesse caso, lance:

```text
FalhaRegistroHistoricoException
```

com causa:

```java
new RuntimeException("Simulação de falha técnica no histórico.")
```

---

## Service OrdemServicoReagendamentoService

Campos:

```text
List<OrdemServico> ordens;
HistoricoOsGateway historicoGateway;
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
registrar histórico:
    "OS reagendada para " + novaData
retornar OS.
```

---

## TradutorErroSimulado

Crie tradutor para:

```text
IllegalArgumentException -> 400 VALIDACAO
RecursoNaoEncontradoException -> 404 NAO_ENCONTRADO
DominioException -> 409 REGRA_NEGOCIO
InfraestruturaException -> 500 FALHA_TECNICA
RuntimeException -> 500 ERRO_INTERNO
```

---

## App

Crie:

```text
OrdemServicoReagendamentoApp
```

Cenários obrigatórios:

```text
reagendamento com sucesso;
OS inexistente;
OS concluída;
OS cancelada;
data anterior a hoje;
reagendamento duplicado;
falha técnica no histórico.
```

Critérios:

```text
entidade decide regra;
service coordena fluxo;
infra simula falha técnica;
tradutor converte erro para resposta simulada;
mensagens claras;
causa preservada em erro técnico;
sem RuntimeException genérica para regra conhecida.
```

---

# Parte 17 — Desafio extra

## ErroApiSimulado com detalhes

Evolua:

```text
ErroApiSimulado
```

para ter:

```text
int status;
String tipo;
String mensagem;
String detalheTecnico;
```

Regra:

```text
detalheTecnico deve existir apenas para uso interno no app;
em API real, não seria exposto diretamente ao usuário final.
```

No tradutor:

```text
InfraestruturaException:
mensagem externa genérica;
detalheTecnico com erro.getCause().getMessage().
```

Objetivo:

```text
entender diferença entre mensagem para usuário e detalhe técnico para log.
```

---

# Parte 18 — Debug recomendado

Coloque breakpoints em:

```text
PedidoFaturamentoService.buscarObrigatorio
Pedido.faturar
Cliente.validarPodeOperar
RepositorioPedidoArquivo.lerLinhas
TradutorErroSimulado.traduzir
PedidoFluxoErroPorCamadaApp.executar
```

Observe:

```text
onde cada erro nasce;
qual camada lança;
qual catch captura;
como o tradutor classifica;
se a ordem dos instanceof está correta;
se a causa técnica foi preservada;
se mensagem externa e interna estão adequadas.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre erro de aplicação e erro de domínio?
2. Por que não encontrado não deve ser tratado igual a regra violada?
3. O que caracteriza erro de infraestrutura?
4. Por que preservar causa original em erro técnico?
5. Como esses erros seriam traduzidos para HTTP futuramente?
6. Onde a entidade deve lançar erro?
7. Onde o service deve lançar erro?
8. Onde a infraestrutura deve lançar erro?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
classificar erros por camada;
criar AplicacaoException;
criar DominioException;
criar InfraestruturaException;
criar RecursoNaoEncontradoException;
criar exceptions específicas;
diferenciar validação, não encontrado, regra e falha técnica;
lançar erro na camada correta;
preservar causa técnica;
simular tradução HTTP;
evitar RuntimeException genérica;
evitar vazar detalhe técnico;
resolver OrdemServicoReagendamentoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-205-modelagem-erros-por-camada-dominio-aplicacao-infra
git commit -m "Aula 205: modelagem erros por camada dominio aplicacao infra"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
erro bem modelado tem camada, intenção, mensagem e tratamento adequado.
```

Você estudou:

```text
erro de validação;
erro de aplicação;
erro de não encontrado;
erro de domínio;
erro de infraestrutura;
AplicacaoException;
DominioException;
InfraestruturaException;
RecursoNaoEncontradoException;
tradução futura para HTTP;
preservação de causa;
separação de responsabilidade.
```

Também reforçou a visão profissional:

```text
não basta lançar erro;
é preciso lançar o erro certo, no lugar certo, com mensagem certa.
```

Na próxima aula, vamos aprofundar a relação entre exceptions e validações controladas:

```text
quando usar exception;
quando retornar Resultado;
quando acumular erros;
quando falhar rápido;
quando validar entrada;
como modelar mensagens de validação.
```

Esse assunto é importante para não transformar exception em martelo para todo tipo de problema.
