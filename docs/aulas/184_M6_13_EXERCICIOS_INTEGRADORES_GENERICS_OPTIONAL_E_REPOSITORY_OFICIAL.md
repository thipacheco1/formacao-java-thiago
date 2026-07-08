# 184 — M6.13 — Exercícios integradores: Generics, Optional e Repository

## Objetivo da aula

Nesta aula você vai praticar tomada de decisão técnica antes de codar.

O foco será integrar:

```text
Generics;
Optional<T>;
Resultado<T>;
Repository genérico;
bounded types;
wildcards;
PECS;
objetos de valor;
entidades;
services específicos;
boas práticas.
```

Esta aula é diferente de uma aula puramente expositiva.

Aqui você vai treinar o raciocínio que um backend Java precisa ter:

```text
qual estrutura usar;
qual tipo retornar;
qual abstração criar;
qual abstração evitar;
onde Optional faz sentido;
onde Resultado<T> faz sentido;
onde Generics ajudam;
onde Generics atrapalham;
onde a regra deve ficar.
```

Ao final, você deve conseguir:

```text
ler um requisito simples;
decidir entre Optional e Resultado;
decidir entre tipo concreto e tipo genérico;
decidir entre repository genérico e service específico;
criar contratos reutilizáveis com propósito;
evitar raw type;
evitar Object;
evitar cast;
evitar Optional.get direto;
usar map, flatMap e orElseThrow com critério;
explicar suas escolhas técnicas.
```

---

## Como trabalhar esta aula

Antes de codar qualquer exercício, responda:

```text
1. Qual é o problema?
2. Existe ausência esperada?
3. Existe sucesso/falha de operação?
4. O tipo varia?
5. Existe contrato comum?
6. Preciso preservar tipo?
7. Preciso ler uma lista flexível?
8. Preciso adicionar em uma lista flexível?
9. É regra de negócio específica?
10. O código ficou mais claro ou mais genérico apenas por estética?
```

Essa análise é mais importante do que decorar sintaxe.

---

## Regra de decisão principal

Use esta regra:

```text
Optional<T>:
quando a busca pode não encontrar.

Resultado<T>:
quando uma operação pode ter sucesso ou falha com mensagem.

Generics:
quando o comportamento é reutilizável e o tipo muda.

Tipo concreto:
quando a regra é específica de negócio.

Bounded type:
quando T precisa obedecer a um contrato.

Wildcard:
quando o parâmetro precisa aceitar variações de tipo.

Service específico:
quando há regra de domínio.

Repository genérico:
quando o comportamento técnico é comum.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-184-exercicios-integradores-generics-optional-e-repository
cd labs\m6\aula-184-exercicios-integradores-generics-optional-e-repository
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula184
mkdir src\br\com\curso\aula184\app
mkdir src\br\com\curso\aula184\contrato
mkdir src\br\com\curso\aula184\dominio
mkdir src\br\com\curso\aula184\dominio\valor
mkdir src\br\com\curso\aula184\dominio\produto
mkdir src\br\com\curso\aula184\dominio\cliente
mkdir src\br\com\curso\aula184\dominio\pedido
mkdir src\br\com\curso\aula184\infra
mkdir src\br\com\curso\aula184\util
```

---

# Parte 1 — Base comum dos exercícios

Nesta parte, você vai criar uma base técnica usada pelos exercícios.

---

## Contrato Identificavel<ID>

Crie:

```text
src\br\com\curso\aula184\contrato\Identificavel.java
```

Código:

```java
package br.com.curso.aula184.contrato;

public interface Identificavel<ID> {
    ID id();
}
```

---

## Contrato Resumivel

Crie:

```text
src\br\com\curso\aula184\contrato\Resumivel.java
```

Código:

```java
package br.com.curso.aula184.contrato;

public interface Resumivel {
    String resumo();
}
```

---

## Resultado<T>

Crie:

```text
src\br\com\curso\aula184\util\Resultado.java
```

Código:

```java
package br.com.curso.aula184.util;

public class Resultado<T> {
    private final boolean sucesso;
    private final String mensagem;
    private final T valor;

    private Resultado(boolean sucesso, String mensagem, T valor) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.sucesso = sucesso;
        this.mensagem = mensagem.trim();
        this.valor = valor;
    }

    public static <T> Resultado<T> sucesso(String mensagem, T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor de sucesso é obrigatório.");
        }

        return new Resultado<>(true, mensagem, valor);
    }

    public static <T> Resultado<T> falha(String mensagem) {
        return new Resultado<>(false, mensagem, null);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public boolean falha() {
        return !sucesso;
    }

    public String mensagem() {
        return mensagem;
    }

    public T valor() {
        if (falha()) {
            throw new IllegalStateException("Resultado de falha não possui valor.");
        }

        return valor;
    }

    public String resumo() {
        return (sucesso ? "SUCESSO" : "FALHA") + " | " + mensagem;
    }
}
```

---

## Repositorio<ID, T>

Crie:

```text
src\br\com\curso\aula184\contrato\Repositorio.java
```

Código:

```java
package br.com.curso.aula184.contrato;

import java.util.List;
import java.util.Optional;

public interface Repositorio<ID, T extends Identificavel<ID>> {
    void salvar(T item);

    Optional<T> buscarPorId(ID id);

    T buscarObrigatorio(ID id);

    boolean existe(ID id);

    List<T> listar();

    int quantidade();
}
```

---

## RepositorioMemoria<ID, T>

Crie:

```text
src\br\com\curso\aula184\infra\RepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula184.infra;

import br.com.curso.aula184.contrato.Identificavel;
import br.com.curso.aula184.contrato.Repositorio;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class RepositorioMemoria<ID, T extends Identificavel<ID>> implements Repositorio<ID, T> {
    private final Map<ID, T> itensPorId;

    public RepositorioMemoria() {
        this.itensPorId = new LinkedHashMap<>();
    }

    @Override
    public void salvar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        ID id = item.id();

        if (id == null) {
            throw new IllegalArgumentException("ID do item é obrigatório.");
        }

        if (itensPorId.containsKey(id)) {
            throw new IllegalStateException("Item já cadastrado com ID: " + id);
        }

        itensPorId.put(id, item);
    }

    @Override
    public Optional<T> buscarPorId(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        return Optional.ofNullable(itensPorId.get(id));
    }

    @Override
    public T buscarObrigatorio(ID id) {
        return buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado para ID: " + id));
    }

    @Override
    public boolean existe(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        return itensPorId.containsKey(id);
    }

    @Override
    public List<T> listar() {
        return List.copyOf(itensPorId.values());
    }

    @Override
    public int quantidade() {
        return itensPorId.size();
    }
}
```

---

## RelatorioResumivel

Crie:

```text
src\br\com\curso\aula184\util\RelatorioResumivel.java
```

Código:

```java
package br.com.curso.aula184.util;

import br.com.curso.aula184.contrato.Resumivel;

import java.util.List;

public final class RelatorioResumivel {
    private RelatorioResumivel() {
    }

    public static void imprimir(String titulo, List<? extends Resumivel> itens) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        System.out.println(titulo + ":");
        System.out.println("Quantidade: " + itens.size());

        for (Resumivel item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            System.out.println("- " + item.resumo());
        }
    }
}
```

---

## Por que essa base foi criada

Essa base concentra as abstrações reutilizáveis:

```text
Identificavel<ID>;
Resumivel;
Resultado<T>;
Repositorio<ID,T>;
RepositorioMemoria<ID,T>;
RelatorioResumivel.
```

Todas têm propósito claro.

Nenhuma delas representa uma regra específica de cliente, produto ou pedido.

Isso é um bom sinal.

---

# Parte 2 — Exercício 1: Produto

## Requisito

Crie um cadastro de produtos em memória.

Regras:

```text
Produto possui SKU;
Produto possui nome;
Produto possui preço;
Produto nasce ativo;
Produto pode ser inativado;
Produto pode ser reativado;
não pode cadastrar SKU duplicado;
buscar por SKU pode não encontrar;
inativar produto retorna Resultado<Produto>;
reativar produto retorna Resultado<Produto>.
```

---

## Decisão técnica antes de codar

Responda:

```text
SKU é um objeto de valor?
Sim.

Produto é entidade?
Sim.

Produto deve implementar Identificavel<Sku>?
Sim.

Repository pode ser genérico?
Sim.

Buscar por SKU deve retornar Optional<Produto>?
Sim.

Inativar deve retornar Optional ou Resultado?
Resultado<Produto>, porque é uma operação com sucesso/falha.

Service deve ser genérico?
Não. A regra é de Produto.
```

---

## Sku

Crie:

```text
src\br\com\curso\aula184\dominio\valor\Sku.java
```

Código:

```java
package br.com.curso.aula184.dominio.valor;

import java.util.Objects;

public final class Sku implements Comparable<Sku> {
    private final String valor;

    public Sku(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (normalizado.length() < 4) {
            throw new IllegalArgumentException("SKU deve ter pelo menos 4 caracteres.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(Sku outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Sku sku)) {
            return false;
        }

        return Objects.equals(valor, sku.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## Produto

Crie:

```text
src\br\com\curso\aula184\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula184.dominio.produto;

import br.com.curso.aula184.contrato.Identificavel;
import br.com.curso.aula184.contrato.Resumivel;
import br.com.curso.aula184.dominio.valor.Sku;

import java.math.BigDecimal;

public class Produto implements Identificavel<Sku>, Resumivel {
    private final Sku sku;
    private final String nome;
    private final BigDecimal preco;
    private boolean ativo;

    public Produto(Sku sku, String nome, BigDecimal preco) {
        if (sku == null) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        this.sku = sku;
        this.nome = nome.trim();
        this.preco = preco;
        this.ativo = true;
    }

    @Override
    public Sku id() {
        return sku;
    }

    public Sku sku() {
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

    public void inativar() {
        if (!ativo) {
            throw new IllegalStateException("Produto já está inativo.");
        }

        ativo = false;
    }

    public void reativar() {
        if (ativo) {
            throw new IllegalStateException("Produto já está ativo.");
        }

        ativo = true;
    }

    @Override
    public String resumo() {
        return sku.resumo()
                + " | Produto: " + nome
                + " | Preço: " + preco
                + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ServicoProduto

Crie:

```text
src\br\com\curso\aula184\infra\ServicoProduto.java
```

Código:

```java
package br.com.curso.aula184.infra;

import br.com.curso.aula184.contrato.Repositorio;
import br.com.curso.aula184.dominio.produto.Produto;
import br.com.curso.aula184.dominio.valor.Sku;
import br.com.curso.aula184.util.Resultado;

import java.math.BigDecimal;
import java.util.Optional;

public class ServicoProduto {
    private final Repositorio<Sku, Produto> produtos;

    public ServicoProduto(Repositorio<Sku, Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Repositório de produtos é obrigatório.");
        }

        this.produtos = produtos;
    }

    public Resultado<Produto> cadastrar(Sku sku, String nome, BigDecimal preco) {
        if (produtos.existe(sku)) {
            return Resultado.falha("Produto já cadastrado: " + sku.resumo());
        }

        Produto produto = new Produto(sku, nome, preco);
        produtos.salvar(produto);

        return Resultado.sucesso("Produto cadastrado com sucesso.", produto);
    }

    public Optional<Produto> buscarPorSku(Sku sku) {
        return produtos.buscarPorId(sku);
    }

    public Resultado<Produto> inativar(Sku sku) {
        return produtos.buscarPorId(sku)
                .map(produto -> executar("Produto inativado com sucesso.", produto, Produto::inativar))
                .orElseGet(() -> Resultado.falha("Produto não encontrado: " + sku.resumo()));
    }

    public Resultado<Produto> reativar(Sku sku) {
        return produtos.buscarPorId(sku)
                .map(produto -> executar("Produto reativado com sucesso.", produto, Produto::reativar))
                .orElseGet(() -> Resultado.falha("Produto não encontrado: " + sku.resumo()));
    }

    private Resultado<Produto> executar(String mensagemSucesso, Produto produto, AcaoProduto acao) {
        try {
            acao.executar(produto);
            return Resultado.sucesso(mensagemSucesso, produto);
        } catch (IllegalStateException erro) {
            return Resultado.falha(erro.getMessage());
        }
    }

    private interface AcaoProduto {
        void executar(Produto produto);
    }
}
```

---

## App do exercício Produto

Crie:

```text
src\br\com\curso\aula184\app\ExercicioProdutoApp.java
```

Código:

```java
package br.com.curso.aula184.app;

import br.com.curso.aula184.contrato.Repositorio;
import br.com.curso.aula184.dominio.produto.Produto;
import br.com.curso.aula184.dominio.valor.Sku;
import br.com.curso.aula184.infra.RepositorioMemoria;
import br.com.curso.aula184.infra.ServicoProduto;
import br.com.curso.aula184.util.RelatorioResumivel;
import br.com.curso.aula184.util.Resultado;

import java.math.BigDecimal;

public class ExercicioProdutoApp {
    public static void main(String[] args) {
        Repositorio<Sku, Produto> repositorio = new RepositorioMemoria<>();
        ServicoProduto servico = new ServicoProduto(repositorio);

        imprimir(servico.cadastrar(
                new Sku("prd-001"),
                "Notebook",
                new BigDecimal("3500.00")
        ));

        imprimir(servico.cadastrar(
                new Sku("prd-002"),
                "Monitor",
                new BigDecimal("1200.00")
        ));

        imprimir(servico.cadastrar(
                new Sku("prd-001"),
                "Notebook duplicado",
                new BigDecimal("3600.00")
        ));

        imprimir(servico.inativar(new Sku("PRD-002")));
        imprimir(servico.inativar(new Sku("PRD-002")));
        imprimir(servico.reativar(new Sku("PRD-002")));

        System.out.println();

        RelatorioResumivel.imprimir("Produtos", repositorio.listar());
    }

    private static <T> void imprimir(Resultado<T> resultado) {
        System.out.println(resultado.resumo());

        if (resultado.sucesso()) {
            System.out.println(resultado.valor());
        }

        System.out.println();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula184.app.ExercicioProdutoApp
```

---

# Parte 3 — Exercício 2: Cliente e Pedido

## Requisito

Agora vamos praticar `flatMap`.

Crie um fluxo onde:

```text
Cliente possui Email;
Pedido possui CodigoPedido;
Pedido aponta para Email do Cliente;
abrir pedido exige cliente ativo;
buscar resumo do cliente de um pedido usa Optional.flatMap;
cancelar pedido retorna Resultado<Pedido>;
relatório imprime clientes e pedidos.
```

---

## Decisão técnica antes de codar

Responda:

```text
Cliente e Pedido são entidades?
Sim.

Cliente usa Email como ID?
Sim.

Pedido usa CodigoPedido como ID?
Sim.

Abrir pedido é operação?
Sim, retorna Resultado<Pedido>.

Buscar pedido por código pode não encontrar?
Sim, retorna Optional<Pedido> no repository.

Buscar cliente do pedido exige flatMap?
Sim, porque buscar pedido retorna Optional e buscar cliente também retorna Optional.
```

---

## Email

Crie:

```text
src\br\com\curso\aula184\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula184.dominio.valor;

import java.util.Objects;

public final class Email implements Comparable<Email> {
    private final String valor;

    public Email(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        String normalizado = valor.trim().toLowerCase();

        if (!normalizado.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = normalizado;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(Email outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Email email)) {
            return false;
        }

        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## CodigoPedido

Crie:

```text
src\br\com\curso\aula184\dominio\valor\CodigoPedido.java
```

Código:

```java
package br.com.curso.aula184.dominio.valor;

import java.util.Objects;

public final class CodigoPedido implements Comparable<CodigoPedido> {
    private final String valor;

    public CodigoPedido(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("PED-")) {
            throw new IllegalArgumentException("Código do pedido deve iniciar com PED-.");
        }

        this.valor = normalizado;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(CodigoPedido outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoPedido codigoPedido)) {
            return false;
        }

        return Objects.equals(valor, codigoPedido.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula184\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula184.dominio.cliente;

import br.com.curso.aula184.contrato.Identificavel;
import br.com.curso.aula184.contrato.Resumivel;
import br.com.curso.aula184.dominio.valor.Email;

public class Cliente implements Identificavel<Email>, Resumivel {
    private final Email email;
    private final String nome;
    private boolean ativo;

    public Cliente(Email email, String nome) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.email = email;
        this.nome = nome.trim();
        this.ativo = true;
    }

    @Override
    public Email id() {
        return email;
    }

    public Email email() {
        return email;
    }

    public String nome() {
        return nome;
    }

    public boolean ativo() {
        return ativo;
    }

    public void inativar() {
        if (!ativo) {
            throw new IllegalStateException("Cliente já está inativo.");
        }

        ativo = false;
    }

    @Override
    public String resumo() {
        return nome + " | " + email.resumo() + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula184\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula184.dominio.pedido;

public enum StatusPedido {
    ABERTO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula184\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula184.dominio.pedido;

import br.com.curso.aula184.contrato.Identificavel;
import br.com.curso.aula184.contrato.Resumivel;
import br.com.curso.aula184.dominio.valor.CodigoPedido;
import br.com.curso.aula184.dominio.valor.Email;

public class Pedido implements Identificavel<CodigoPedido>, Resumivel {
    private final CodigoPedido codigo;
    private final Email emailCliente;
    private final String descricao;
    private StatusPedido status;

    public Pedido(CodigoPedido codigo, Email emailCliente, String descricao) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (emailCliente == null) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        this.codigo = codigo;
        this.emailCliente = emailCliente;
        this.descricao = descricao.trim();
        this.status = StatusPedido.ABERTO;
    }

    @Override
    public CodigoPedido id() {
        return codigo;
    }

    public CodigoPedido codigo() {
        return codigo;
    }

    public Email emailCliente() {
        return emailCliente;
    }

    public StatusPedido status() {
        return status;
    }

    public void cancelar(String motivo) {
        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        status = StatusPedido.CANCELADO;
    }

    @Override
    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + emailCliente.resumo()
                + " | Descrição: " + descricao
                + " | Status: " + status;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ServicoCliente

Crie:

```text
src\br\com\curso\aula184\infra\ServicoCliente.java
```

Código:

```java
package br.com.curso.aula184.infra;

import br.com.curso.aula184.contrato.Repositorio;
import br.com.curso.aula184.dominio.cliente.Cliente;
import br.com.curso.aula184.dominio.valor.Email;
import br.com.curso.aula184.util.Resultado;

import java.util.Optional;

public class ServicoCliente {
    private final Repositorio<Email, Cliente> clientes;

    public ServicoCliente(Repositorio<Email, Cliente> clientes) {
        if (clientes == null) {
            throw new IllegalArgumentException("Repositório de clientes é obrigatório.");
        }

        this.clientes = clientes;
    }

    public Resultado<Cliente> cadastrar(Email email, String nome) {
        if (clientes.existe(email)) {
            return Resultado.falha("Cliente já cadastrado: " + email.resumo());
        }

        Cliente cliente = new Cliente(email, nome);
        clientes.salvar(cliente);

        return Resultado.sucesso("Cliente cadastrado com sucesso.", cliente);
    }

    public Optional<Cliente> buscarPorEmail(Email email) {
        return clientes.buscarPorId(email);
    }

    public Resultado<Cliente> inativar(Email email) {
        return clientes.buscarPorId(email)
                .map(cliente -> {
                    try {
                        cliente.inativar();
                        return Resultado.sucesso("Cliente inativado com sucesso.", cliente);
                    } catch (IllegalStateException erro) {
                        return Resultado.<Cliente>falha(erro.getMessage());
                    }
                })
                .orElseGet(() -> Resultado.falha("Cliente não encontrado: " + email.resumo()));
    }
}
```

---

## ServicoPedido

Crie:

```text
src\br\com\curso\aula184\infra\ServicoPedido.java
```

Código:

```java
package br.com.curso.aula184.infra;

import br.com.curso.aula184.contrato.Repositorio;
import br.com.curso.aula184.dominio.cliente.Cliente;
import br.com.curso.aula184.dominio.pedido.Pedido;
import br.com.curso.aula184.dominio.valor.CodigoPedido;
import br.com.curso.aula184.dominio.valor.Email;
import br.com.curso.aula184.util.Resultado;

public class ServicoPedido {
    private final Repositorio<CodigoPedido, Pedido> pedidos;
    private final Repositorio<Email, Cliente> clientes;

    public ServicoPedido(
            Repositorio<CodigoPedido, Pedido> pedidos,
            Repositorio<Email, Cliente> clientes
    ) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Repositório de pedidos é obrigatório.");
        }

        if (clientes == null) {
            throw new IllegalArgumentException("Repositório de clientes é obrigatório.");
        }

        this.pedidos = pedidos;
        this.clientes = clientes;
    }

    public Resultado<Pedido> abrir(CodigoPedido codigo, Email emailCliente, String descricao) {
        if (pedidos.existe(codigo)) {
            return Resultado.falha("Pedido já cadastrado: " + codigo.resumo());
        }

        Cliente cliente = clientes.buscarPorId(emailCliente)
                .filter(Cliente::ativo)
                .orElse(null);

        if (cliente == null) {
            return Resultado.falha("Cliente ativo não encontrado: " + emailCliente.resumo());
        }

        Pedido pedido = new Pedido(codigo, cliente.email(), descricao);
        pedidos.salvar(pedido);

        return Resultado.sucesso("Pedido aberto com sucesso.", pedido);
    }

    public Resultado<Pedido> cancelar(CodigoPedido codigo, String motivo) {
        return pedidos.buscarPorId(codigo)
                .map(pedido -> {
                    try {
                        pedido.cancelar(motivo);
                        return Resultado.sucesso("Pedido cancelado com sucesso.", pedido);
                    } catch (IllegalArgumentException | IllegalStateException erro) {
                        return Resultado.<Pedido>falha(erro.getMessage());
                    }
                })
                .orElseGet(() -> Resultado.falha("Pedido não encontrado: " + codigo.resumo()));
    }

    public Resultado<String> resumoClienteDoPedido(CodigoPedido codigo) {
        return pedidos.buscarPorId(codigo)
                .flatMap(pedido -> clientes.buscarPorId(pedido.emailCliente()))
                .filter(Cliente::ativo)
                .map(cliente -> Resultado.sucesso("Cliente ativo do pedido encontrado.", cliente.resumo()))
                .orElseGet(() -> Resultado.falha("Cliente ativo do pedido não encontrado."));
    }
}
```

---

## App do exercício Cliente e Pedido

Crie:

```text
src\br\com\curso\aula184\app\ExercicioClientePedidoApp.java
```

Código:

```java
package br.com.curso.aula184.app;

import br.com.curso.aula184.contrato.Repositorio;
import br.com.curso.aula184.dominio.cliente.Cliente;
import br.com.curso.aula184.dominio.pedido.Pedido;
import br.com.curso.aula184.dominio.valor.CodigoPedido;
import br.com.curso.aula184.dominio.valor.Email;
import br.com.curso.aula184.infra.RepositorioMemoria;
import br.com.curso.aula184.infra.ServicoCliente;
import br.com.curso.aula184.infra.ServicoPedido;
import br.com.curso.aula184.util.RelatorioResumivel;
import br.com.curso.aula184.util.Resultado;

public class ExercicioClientePedidoApp {
    public static void main(String[] args) {
        Repositorio<Email, Cliente> clientes = new RepositorioMemoria<>();
        Repositorio<CodigoPedido, Pedido> pedidos = new RepositorioMemoria<>();

        ServicoCliente servicoCliente = new ServicoCliente(clientes);
        ServicoPedido servicoPedido = new ServicoPedido(pedidos, clientes);

        imprimir(servicoCliente.cadastrar(new Email("ana@empresa.com"), "Ana Silva"));
        imprimir(servicoCliente.cadastrar(new Email("carlos@empresa.com"), "Carlos Souza"));

        imprimir(servicoPedido.abrir(
                new CodigoPedido("PED-001"),
                new Email("ana@empresa.com"),
                "Compra de notebook"
        ));

        imprimir(servicoPedido.abrir(
                new CodigoPedido("PED-002"),
                new Email("cliente-inexistente@empresa.com"),
                "Compra de monitor"
        ));

        imprimir(servicoPedido.resumoClienteDoPedido(new CodigoPedido("PED-001")));

        imprimir(servicoPedido.cancelar(new CodigoPedido("PED-001"), "Solicitação do cliente"));
        imprimir(servicoPedido.cancelar(new CodigoPedido("PED-001"), "Nova tentativa"));

        System.out.println();

        RelatorioResumivel.imprimir("Clientes", clientes.listar());

        System.out.println();

        RelatorioResumivel.imprimir("Pedidos", pedidos.listar());
    }

    private static <T> void imprimir(Resultado<T> resultado) {
        System.out.println(resultado.resumo());

        if (resultado.sucesso()) {
            System.out.println(resultado.valor());
        }

        System.out.println();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula184.app.ExercicioClientePedidoApp
```

---

# Parte 4 — Exercícios de decisão técnica

Agora, antes de codar, responda o tipo correto.

---

## Exercício de decisão 1

Requisito:

```text
Buscar produto por SKU.
Pode não encontrar.
```

Resposta:

```java
Optional<Produto> buscarPorSku(Sku sku)
```

Motivo:

```text
ausência esperada.
```

---

## Exercício de decisão 2

Requisito:

```text
Cadastrar produto.
Pode dar certo ou falhar por SKU duplicado.
Precisa mensagem.
```

Resposta:

```java
Resultado<Produto> cadastrar(...)
```

Motivo:

```text
operação com sucesso/falha e mensagem.
```

---

## Exercício de decisão 3

Requisito:

```text
Salvar entidades diferentes em memória por ID.
```

Resposta:

```java
Repositorio<ID, T extends Identificavel<ID>>
```

Motivo:

```text
comportamento técnico comum e tipo variável.
```

---

## Exercício de decisão 4

Requisito:

```text
Concluir uma ordem de serviço.
```

Resposta:

```text
método específico em OrdemServico ou ServicoOrdemServico.
```

Motivo:

```text
regra de negócio específica.
```

Não criar:

```java
ConcluidorGenerico<T>
```

sem necessidade.

---

## Exercício de decisão 5

Requisito:

```text
Imprimir relatório de qualquer lista de objetos que possuem resumo.
```

Resposta:

```java
void imprimir(List<? extends Resumivel> itens)
```

Motivo:

```text
a lista é produtora;
o método só lê;
PECS: Producer Extends.
```

---

## Exercício de decisão 6

Requisito:

```text
Adicionar pedidos especiais em uma lista que pode ser de PedidoEspecial, Pedido ou Object.
```

Resposta:

```java
List<? super PedidoEspecial>
```

Motivo:

```text
a lista é consumidora;
PECS: Consumer Super.
```

---

## Exercício de decisão 7

Requisito:

```text
Transformar List<Pedido> em List<String> com resumos.
```

Resposta:

```java
<E, S> List<S> mapear(List<? extends E> entradas, Mapper<? super E, ? extends S> mapper)
```

Ou, se o uso for simples:

```java
List<String> resumos = pedidos.stream...
```

Como ainda não estudamos Streams profundamente, manteremos a ideia conceitual.

Motivo:

```text
entrada produz E;
mapper consome E e produz S.
```

---

## Exercício de decisão 8

Requisito:

```text
Buscar pedido, depois buscar cliente do pedido.
As duas buscas retornam Optional.
```

Resposta:

```java
pedidoRepository.buscarPorId(codigo)
        .flatMap(pedido -> clienteRepository.buscarPorId(pedido.emailCliente()))
```

Motivo:

```text
a segunda função retorna Optional;
usar flatMap evita Optional<Optional<Cliente>>.
```

---

## Exercício de decisão 9

Requisito:

```text
Converter Object para Cliente em runtime com segurança.
```

Resposta:

```java
Cliente cliente = ConversorSeguro.converter(objeto, Cliente.class);
```

Motivo:

```text
type erasure exige Class<T> quando precisa validar tipo em runtime.
```

---

## Exercício de decisão 10

Requisito:

```text
Criar objetos de forma flexível sem reflection.
```

Resposta:

```java
Supplier<T>
```

Motivo:

```text
Supplier<T> cria objetos sem depender diretamente de Class<T> e reflection.
```

---

# Parte 5 — Debug e análise

## Pontos de debug obrigatórios

Coloque breakpoints em:

```text
RepositorioMemoria.salvar
RepositorioMemoria.buscarPorId
ServicoProduto.cadastrar
ServicoProduto.inativar
ServicoPedido.abrir
ServicoPedido.resumoClienteDoPedido
Resultado.sucesso
Resultado.falha
RelatorioResumivel.imprimir
```

Observe:

```text
quando o ID é extraído com item.id();
quando Optional vem vazio;
quando Resultado vira sucesso;
quando Resultado vira falha;
quando flatMap busca cliente do pedido;
quando regra fica no service;
quando regra fica na entidade;
quando relatório aceita listas diferentes.
```

---

## Perguntas de análise

Responda no diário:

```text
1. Por que Produto implementa Identificavel<Sku>?
2. Por que Pedido implementa Identificavel<CodigoPedido>?
3. Por que RepositorioMemoria não precisa saber se está salvando Produto ou Pedido?
4. Por que ServicoPedido precisa conhecer Cliente?
5. Por que abrir pedido retorna Resultado<Pedido>?
6. Por que buscar cliente do pedido usa flatMap?
7. Por que RelatorioResumivel usa List<? extends Resumivel>?
8. Onde Optional foi usado corretamente?
9. Onde Resultado<T> foi usado corretamente?
10. O que não deveria virar genérico neste exercício?
```

---

## Erros comuns desta aula

### 1. Criar ProdutoRepository e PedidoRepository duplicados sem necessidade

Neste exercício, o comportamento de memória é comum.

Use `RepositorioMemoria<ID,T>`.

---

### 2. Criar ServicoGenerico para Produto e Pedido

Produto e Pedido têm regras diferentes.

Service deve ser específico.

---

### 3. Usar Optional para retorno de cadastro

Cadastro não é ausência.

Cadastro é operação.

Use `Resultado<T>`.

---

### 4. Usar Resultado<T> para busca simples

Busca simples que pode não encontrar combina melhor com `Optional<T>`.

---

### 5. Usar get direto no Optional

Evite.

Use `map`, `flatMap`, `orElseGet`, `orElseThrow`.

---

### 6. Usar map quando a função retorna Optional

Use `flatMap`.

---

### 7. Retornar lista mutável interna

Use `List.copyOf`.

---

### 8. Usar Object no repository

Generics evitam isso.

---

### 9. Criar abstração sem ganho

Se a abstração não melhora clareza, ela não ajuda.

---

### 10. Colocar regra de negócio no app

App executa cenário.

Regra deve ficar na entidade ou no serviço.

---

# Parte 6 — Desafio final da aula

## Desafio prático

Crie um fluxo de `Categoria`.

Requisitos:

```text
Categoria possui CodigoCategoria;
Categoria possui nome;
Categoria nasce ativa;
Categoria pode ser inativada;
Produto deve apontar para CodigoCategoria;
Cadastrar produto exige categoria ativa;
Buscar categoria do produto usa Optional.flatMap;
Relatório imprime categorias e produtos.
```

Classes sugeridas:

```text
CodigoCategoria;
Categoria;
ServicoCategoria;
ajuste em Produto para ter CodigoCategoria;
ajuste em ServicoProduto para validar categoria ativa;
ExercicioCategoriaProdutoApp.
```

Critérios obrigatórios:

```text
Categoria implementa Identificavel<CodigoCategoria>;
Categoria implementa Resumivel;
ServicoCategoria retorna Resultado<Categoria>;
buscar categoria retorna Optional<Categoria>;
Produto continua entidade específica;
Repository continua genérico;
não usar raw type;
não usar Object;
não usar cast.
```

---

## Desafio extra

Crie um utilitário genérico:

```text
src\br\com\curso\aula184\util\ColetorResumivel.java
```

Método:

```java
public static <T extends Resumivel> void coletarResumos(
        List<? extends T> origem,
        List<? super String> destino
)
```

Regras:

```text
origem não pode ser null;
destino não pode ser null;
item nulo não é permitido;
adicionar item.resumo() no destino.
```

Crie app:

```text
src\br\com\curso\aula184\app\ColetorResumivelApp.java
```

Use com:

```text
List<Produto>;
List<Pedido>;
List<String> destino.
```

Critério principal:

```text
origem produz Resumivel;
destino consome String;
aplicar PECS.
```

---

## Checklist de conclusão

Você concluiu a aula se consegue responder:

```text
[ ] Quando usar Optional?
[ ] Quando usar Resultado?
[ ] Quando usar Repository genérico?
[ ] Quando usar Service específico?
[ ] Quando usar bounded type?
[ ] Quando usar wildcard?
[ ] Quando usar flatMap?
[ ] Quando evitar Generics?
[ ] Onde a entidade protege regra?
[ ] Onde o service coordena?
[ ] Onde o repository salva e busca?
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual exercício deixou mais claro o uso de Optional?
2. Qual exercício deixou mais claro o uso de Resultado<T>?
3. Qual abstração genérica foi realmente útil?
4. Qual parte não deveria ser genérica?
5. O que você faria diferente se esse projeto fosse uma API Spring Boot?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
implementar Produto com Sku;
implementar ServicoProduto;
implementar Cliente;
implementar Pedido;
implementar ServicoPedido;
usar RepositorioMemoria para tipos diferentes;
usar Optional em busca;
usar Resultado em operação;
usar flatMap em busca encadeada;
usar RelatorioResumivel com wildcard;
responder exercícios de decisão técnica;
resolver desafio CategoriaProduto;
resolver desafio ColetorResumivel;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-184-exercicios-integradores-generics-optional-e-repository
git commit -m "Aula 184: exercicios integradores generics optional e repository"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
a escolha técnica vem antes da sintaxe.
```

Você praticou:

```text
Optional para ausência;
Resultado<T> para operação;
Repository genérico para comportamento técnico comum;
Service específico para regra de negócio;
bounded type para contrato;
wildcard para flexibilidade;
flatMap para busca encadeada.
```

Esse tipo de raciocínio é o que prepara você para:

```text
JpaRepository<T, ID>;
ResponseEntity<T>;
DTOs;
mappers;
services;
use cases;
controllers;
testes;
arquitetura.
```

Na próxima aula, vamos fechar o Módulo 6 com uma revisão final e um mapa de transição.

Depois disso, vamos avançar para o próximo bloco do curso, onde Generics aparecerão naturalmente em APIs funcionais, lambdas, streams e recursos modernos do Java.
