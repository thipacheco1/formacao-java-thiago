# 237 — M10.15 — Flyweight Pattern: objetos compartilhados e performance

## Objetivo da aula

Na aula anterior, você estudou:

```text
Composite Pattern
```

Você viu que Composite ajuda a modelar estruturas hierárquicas, como:

```text
menus;
categorias;
permissões;
pacotes de serviço;
checklists;
árvores;
grupos e itens;
estruturas parte-todo.
```

Agora vamos estudar um padrão estrutural voltado para otimização:

```text
Flyweight Pattern
```

Em português:

```text
Padrão Peso-Mosca
```

Flyweight aparece quando você tem muitos objetos parecidos e quer reduzir consumo de memória reaproveitando partes iguais entre eles.

Exemplos comuns em backend:

```text
catálogos grandes;
produtos com atributos repetidos;
permissões repetidas por usuário;
configurações compartilhadas;
tipos de serviço;
status;
templates de mensagem;
dados de referência;
códigos de ocorrência;
categorias;
tabelas auxiliares;
objetos de domínio com parte imutável repetida;
renderização de relatórios com muitos itens;
processamento em lote com muitos registros parecidos.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Flyweight resolve;
diferenciar estado intrínseco e extrínseco;
identificar objetos repetidos;
criar objetos compartilhados;
criar factory/cache de flyweights;
reduzir criação desnecessária de objetos;
aplicar em catálogo de produtos;
aplicar em permissões;
aplicar em templates de mensagem;
entender riscos de mutabilidade;
diferenciar Flyweight de Singleton;
diferenciar Flyweight de Cache;
diferenciar Flyweight de Factory;
saber quando Flyweight é útil e quando é exagero.
```

---

## Ideia principal

Flyweight separa um objeto em duas partes:

```text
estado intrínseco:
parte compartilhada, repetida e geralmente imutável.

estado extrínseco:
parte específica de cada uso, passada de fora.
```

Exemplo:

```text
Produto tipo:
código;
nome;
categoria;
peso;
dimensões.

Item de pedido:
produto;
quantidade;
valor unitário aplicado;
desconto aplicado.
```

Se mil pedidos usam o mesmo produto, não faz sentido criar mil objetos iguais de definição do produto.

Você pode compartilhar a definição do produto e variar apenas o contexto de uso.

---

## Flyweight em uma frase prática

```text
Use Flyweight quando muitos objetos compartilham dados repetidos e imutáveis.
```

Ou:

```text
Flyweight reduz memória reaproveitando objetos compartilháveis.
```

---

## Problema sem Flyweight

Imagine processar 100.000 linhas de pedido.

Cada linha tem:

```text
codigoProduto;
nomeProduto;
categoria;
fabricante;
peso;
altura;
largura;
profundidade;
quantidade;
valorUnitario;
desconto.
```

Se você cria um objeto completo para cada linha, muitos dados se repetem.

Exemplo:

```text
Notebook aparece 10.000 vezes.
Mouse aparece 20.000 vezes.
Cadeira aparece 5.000 vezes.
```

Você repete os mesmos dados milhares de vezes.

Flyweight permite:

```text
ProdutoReferencia compartilhado:
código, nome, categoria, fabricante, dimensões.

ItemPedido:
referência do produto, quantidade, preço e desconto.
```

---

## Relação com SOLID

## SRP

O flyweight representa a parte compartilhada.

A factory/cache cuida de reutilizar instâncias.

O objeto de uso guarda contexto específico.

---

## OCP

Você pode criar novos tipos de flyweight sem alterar consumidores, desde que respeite o contrato.

---

## LSP

Objetos compartilhados devem se comportar de forma consistente.

Se um flyweight é imutável, não pode mudar de forma inesperada para um consumidor e afetar outros.

---

## ISP

A interface do flyweight deve ser pequena e adequada ao que todos os compartilhados fazem.

---

## DIP

Consumidores podem depender de contratos ou factories abstratas em cenários maiores.

Nesta aula, vamos usar Java puro.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Flyweight:

```text
Flyweight compartilha dados repetidos.
A entidade continua protegendo regra.
O use case continua coordenando.
O repository continua salvando.
O controller futuro continua recebendo.
```

Flyweight não deve virar regra de negócio central.

---

# Parte 1 — Estado intrínseco e extrínseco

## Estado intrínseco

É a parte interna e compartilhável.

Características:

```text
repetida;
imutável;
independente do contexto;
pode ser compartilhada com segurança.
```

Exemplo:

```text
ProdutoReferencia:
codigo;
nome;
categoria;
fabricante.
```

---

## Estado extrínseco

É a parte externa e específica do contexto.

Características:

```text
varia por uso;
não deve ficar dentro do flyweight;
é passada como parâmetro ou fica no objeto que usa o flyweight.
```

Exemplo:

```text
ItemPedido:
produtoReferencia;
quantidade;
valorUnitario;
desconto.
```

---

## Regra prática

```text
Se muda por contexto, não coloque no flyweight.
Se é igual para muitos objetos e não muda, pode ser flyweight.
```

---

# Parte 2 — Flyweight vs Singleton

## Singleton

Garante uma única instância de uma classe.

Exemplo:

```text
ConfigGlobal;
ClockFakeGlobal;
RegistryGlobal.
```

## Flyweight

Reaproveita várias instâncias compartilhadas, normalmente uma por chave.

Exemplo:

```text
ProdutoReferencia por codigoProduto;
Permissao por nome;
TemplateMensagem por codigo.
```

Diferença prática:

```text
Singleton:
uma instância global.

Flyweight:
múltiplas instâncias compartilhadas por chave.
```

---

# Parte 3 — Flyweight vs Cache

Flyweight costuma usar cache interno.

Mas não é a mesma coisa.

## Cache genérico

Guarda resultado para evitar recalcular ou recarregar.

```text
cache de consulta;
cache de response;
cache de relatório;
cache de API.
```

## Flyweight

Compartilha objetos pequenos ou médios que representam estado intrínseco repetido.

```text
ProdutoReferencia;
Permissao;
TemplateMensagem;
TipoServico.
```

Diferença prática:

```text
Cache:
otimização de acesso.

Flyweight:
modelo de compartilhamento de objetos repetidos.
```

---

# Parte 4 — Flyweight vs Factory

Flyweight geralmente usa Factory.

A factory decide:

```text
se já existe objeto compartilhado, retorna o existente;
se não existe, cria, guarda e retorna.
```

A factory é o mecanismo.

Flyweight é a ideia de compartilhamento.

---

# Parte 5 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-237-flyweight-pattern-objetos-compartilhados-performance
cd labs\m10\aula-237-flyweight-pattern-objetos-compartilhados-performance
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula237

mkdir src\br\com\curso\aula237\app

mkdir src\br\com\curso\aula237\ruim

mkdir src\br\com\curso\aula237\catalogo
mkdir src\br\com\curso\aula237\pedido
mkdir src\br\com\curso\aula237\permissao
mkdir src\br\com\curso\aula237\mensagem
mkdir src\br\com\curso\aula237\factory
```

---

# Parte 6 — Exemplo ruim: objeto repetido completo

## ItemPedidoRuim

Crie:

```text
src\br\com\curso\aula237\ruim\ItemPedidoRuim.java
```

Código:

```java
package br.com.curso.aula237.ruim;

import java.math.BigDecimal;

public class ItemPedidoRuim {
    private final String codigoProduto;
    private final String nomeProduto;
    private final String categoria;
    private final String fabricante;
    private final BigDecimal peso;
    private final int quantidade;
    private final BigDecimal valorUnitario;

    public ItemPedidoRuim(
            String codigoProduto,
            String nomeProduto,
            String categoria,
            String fabricante,
            BigDecimal peso,
            int quantidade,
            BigDecimal valorUnitario
    ) {
        this.codigoProduto = codigoProduto;
        this.nomeProduto = nomeProduto;
        this.categoria = categoria;
        this.fabricante = fabricante;
        this.peso = peso;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
    }

    public BigDecimal total() {
        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public String resumo() {
        return codigoProduto
                + " | " + nomeProduto
                + " | " + categoria
                + " | " + fabricante
                + " | qtd=" + quantidade
                + " | total=" + total();
    }
}
```

---

## PedidoRuimApp

Crie:

```text
src\br\com\curso\aula237\app\PedidoRuimApp.java
```

Código:

```java
package br.com.curso.aula237.app;

import br.com.curso.aula237.ruim.ItemPedidoRuim;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PedidoRuimApp {
    public static void main(String[] args) {
        List<ItemPedidoRuim> itens = new ArrayList<>();

        for (int i = 1; i <= 5; i++) {
            itens.add(new ItemPedidoRuim(
                    "P001",
                    "Notebook",
                    "Informática",
                    "Fabricante A",
                    new BigDecimal("2.500"),
                    1,
                    new BigDecimal("3500.00")
            ));
        }

        itens.forEach(item -> System.out.println(item.resumo()));

        System.out.println();
        System.out.println("Total de itens criados: " + itens.size());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula237.app.PedidoRuimApp
```

---

## Diagnóstico

O exemplo pequeno cria apenas 5 itens.

Mas imagine:

```text
50.000;
100.000;
1.000.000.
```

Os mesmos dados do produto podem se repetir demais:

```text
nome;
categoria;
fabricante;
peso.
```

Vamos separar o que é compartilhado.

---

# Parte 7 — ProdutoReferencia como Flyweight

## ProdutoReferencia

Crie:

```text
src\br\com\curso\aula237\catalogo\ProdutoReferencia.java
```

Código:

```java
package br.com.curso.aula237.catalogo;

import java.math.BigDecimal;

public final class ProdutoReferencia {
    private final String codigo;
    private final String nome;
    private final String categoria;
    private final String fabricante;
    private final BigDecimal peso;

    public ProdutoReferencia(
            String codigo,
            String nome,
            String categoria,
            String fabricante,
            BigDecimal peso
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (fabricante == null || fabricante.isBlank()) {
            throw new IllegalArgumentException("Fabricante é obrigatório.");
        }

        if (peso == null || peso.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Peso não pode ser negativo.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.nome = nome.trim();
        this.categoria = categoria.trim();
        this.fabricante = fabricante.trim();
        this.peso = peso;
    }

    public String codigo() {
        return codigo;
    }

    public String nome() {
        return nome;
    }

    public String categoria() {
        return categoria;
    }

    public String fabricante() {
        return fabricante;
    }

    public BigDecimal peso() {
        return peso;
    }

    public String descricao() {
        return codigo + " | " + nome + " | " + categoria + " | " + fabricante;
    }
}
```

---

## ProdutoReferenciaFactory

Crie:

```text
src\br\com\curso\aula237\factory\ProdutoReferenciaFactory.java
```

Código:

```java
package br.com.curso.aula237.factory;

import br.com.curso.aula237.catalogo.ProdutoReferencia;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class ProdutoReferenciaFactory {
    private final Map<String, ProdutoReferencia> cache = new HashMap<>();

    public ProdutoReferencia obter(
            String codigo,
            String nome,
            String categoria,
            String fabricante,
            BigDecimal peso
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String chave = codigo.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            System.out.println("[FLYWEIGHT] Reutilizando produto referência: " + chave);
            return cache.get(chave);
        }

        System.out.println("[FLYWEIGHT] Criando produto referência: " + chave);

        ProdutoReferencia referencia = new ProdutoReferencia(
                codigo,
                nome,
                categoria,
                fabricante,
                peso
        );

        cache.put(chave, referencia);

        return referencia;
    }

    public int totalCompartilhados() {
        return cache.size();
    }
}
```

---

# Parte 8 — ItemPedido usando Flyweight

## ItemPedido

Crie:

```text
src\br\com\curso\aula237\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula237.pedido;

import br.com.curso.aula237.catalogo.ProdutoReferencia;

import java.math.BigDecimal;

public class ItemPedido {
    private final ProdutoReferencia produto;
    private final int quantidade;
    private final BigDecimal valorUnitario;

    public ItemPedido(ProdutoReferencia produto, int quantidade, BigDecimal valorUnitario) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valorUnitario == null || valorUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        this.produto = produto;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
    }

    public ProdutoReferencia produto() {
        return produto;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valorUnitario() {
        return valorUnitario;
    }

    public BigDecimal total() {
        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public String resumo() {
        return produto.descricao()
                + " | qtd=" + quantidade
                + " | total=" + total();
    }
}
```

---

## PedidoFlyweightApp

Crie:

```text
src\br\com\curso\aula237\app\PedidoFlyweightApp.java
```

Código:

```java
package br.com.curso.aula237.app;

import br.com.curso.aula237.catalogo.ProdutoReferencia;
import br.com.curso.aula237.factory.ProdutoReferenciaFactory;
import br.com.curso.aula237.pedido.ItemPedido;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PedidoFlyweightApp {
    public static void main(String[] args) {
        ProdutoReferenciaFactory factory = new ProdutoReferenciaFactory();

        List<ItemPedido> itens = new ArrayList<>();

        for (int i = 1; i <= 5; i++) {
            ProdutoReferencia produto = factory.obter(
                    "P001",
                    "Notebook",
                    "Informática",
                    "Fabricante A",
                    new BigDecimal("2.500")
            );

            itens.add(new ItemPedido(
                    produto,
                    1,
                    new BigDecimal("3500.00")
            ));
        }

        itens.forEach(item -> System.out.println(item.resumo()));

        System.out.println();
        System.out.println("Total de itens: " + itens.size());
        System.out.println("Total de produtos referência compartilhados: " + factory.totalCompartilhados());
    }
}
```

---

## O que observar

Foram criados 5 itens.

Mas apenas 1 produto referência compartilhado.

```text
ItemPedido:
tem estado extrínseco.

ProdutoReferencia:
tem estado intrínseco compartilhado.
```

---

# Parte 9 — Exemplo com vários produtos

## PedidoFlyweightVariosProdutosApp

Crie:

```text
src\br\com\curso\aula237\app\PedidoFlyweightVariosProdutosApp.java
```

Código:

```java
package br.com.curso.aula237.app;

import br.com.curso.aula237.catalogo.ProdutoReferencia;
import br.com.curso.aula237.factory.ProdutoReferenciaFactory;
import br.com.curso.aula237.pedido.ItemPedido;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PedidoFlyweightVariosProdutosApp {
    public static void main(String[] args) {
        ProdutoReferenciaFactory factory = new ProdutoReferenciaFactory();

        List<ItemPedido> itens = new ArrayList<>();

        for (int i = 1; i <= 3; i++) {
            itens.add(new ItemPedido(
                    factory.obter("P001", "Notebook", "Informática", "Fabricante A", new BigDecimal("2.500")),
                    1,
                    new BigDecimal("3500.00")
            ));

            itens.add(new ItemPedido(
                    factory.obter("P002", "Mouse", "Informática", "Fabricante B", new BigDecimal("0.200")),
                    2,
                    new BigDecimal("80.00")
            ));

            itens.add(new ItemPedido(
                    factory.obter("P003", "Cadeira", "Móveis", "Fabricante C", new BigDecimal("8.000")),
                    1,
                    new BigDecimal("450.00")
            ));
        }

        itens.forEach(item -> System.out.println(item.resumo()));

        System.out.println();
        System.out.println("Total de itens: " + itens.size());
        System.out.println("Total de produtos referência compartilhados: " + factory.totalCompartilhados());
    }
}
```

---

## Resultado esperado

Você terá:

```text
9 itens de pedido;
3 produtos referência compartilhados.
```

Isso mostra a ideia central.

---

# Parte 10 — Cuidado com mutabilidade

Flyweight deve ser imutável sempre que possível.

Por quê?

Porque o mesmo objeto é compartilhado.

Se alguém altera:

```text
ProdutoReferencia.nome
```

todos os itens que usam aquela referência são afetados.

Por isso usamos:

```java
public final class ProdutoReferencia
```

e campos:

```java
private final
```

Sem setters.

Regra importante:

```text
Flyweight mutável é perigoso.
```

---

# Parte 11 — Exemplo 2: permissões compartilhadas

Em sistemas com muitos usuários, permissões se repetem.

Exemplo:

```text
PRODUTOS_LISTAR;
PRODUTOS_CRIAR;
CONTRATOS_APROVAR;
OS_REAGENDAR;
RELATORIOS_EXPORTAR.
```

Em vez de criar milhares de objetos iguais, podemos compartilhar.

---

## Permissao

Crie:

```text
src\br\com\curso\aula237\permissao\Permissao.java
```

Código:

```java
package br.com.curso.aula237.permissao;

public final class Permissao {
    private final String nome;
    private final String descricao;

    public Permissao(String nome, String descricao) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome da permissão é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da permissão é obrigatória.");
        }

        this.nome = nome.trim().toUpperCase();
        this.descricao = descricao.trim();
    }

    public String nome() {
        return nome;
    }

    public String descricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return nome + " | " + descricao;
    }
}
```

---

## PermissaoFactory

Crie:

```text
src\br\com\curso\aula237\factory\PermissaoFactory.java
```

Código:

```java
package br.com.curso.aula237.factory;

import br.com.curso.aula237.permissao.Permissao;

import java.util.HashMap;
import java.util.Map;

public class PermissaoFactory {
    private final Map<String, Permissao> cache = new HashMap<>();

    public Permissao obter(String nome, String descricao) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        String chave = nome.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            return cache.get(chave);
        }

        Permissao permissao = new Permissao(nome, descricao);
        cache.put(chave, permissao);

        return permissao;
    }

    public int totalCompartilhado() {
        return cache.size();
    }
}
```

---

## UsuarioComPermissoes

Crie:

```text
src\br\com\curso\aula237\permissao\UsuarioComPermissoes.java
```

Código:

```java
package br.com.curso.aula237.permissao;

import java.util.ArrayList;
import java.util.List;

public class UsuarioComPermissoes {
    private final String nome;
    private final List<Permissao> permissoes = new ArrayList<>();

    public UsuarioComPermissoes(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do usuário é obrigatório.");
        }

        this.nome = nome.trim();
    }

    public UsuarioComPermissoes adicionar(Permissao permissao) {
        if (permissao == null) {
            throw new IllegalArgumentException("Permissão é obrigatória.");
        }

        permissoes.add(permissao);
        return this;
    }

    public boolean possui(String nomePermissao) {
        if (nomePermissao == null || nomePermissao.isBlank()) {
            return false;
        }

        String normalizada = nomePermissao.trim().toUpperCase();

        return permissoes.stream()
                .anyMatch(permissao -> permissao.nome().equals(normalizada));
    }

    public void imprimir() {
        System.out.println("Usuário: " + nome);

        for (Permissao permissao : permissoes) {
            System.out.println(" - " + permissao);
        }
    }
}
```

---

## PermissaoFlyweightApp

Crie:

```text
src\br\com\curso\aula237\app\PermissaoFlyweightApp.java
```

Código:

```java
package br.com.curso.aula237.app;

import br.com.curso.aula237.factory.PermissaoFactory;
import br.com.curso.aula237.permissao.UsuarioComPermissoes;

public class PermissaoFlyweightApp {
    public static void main(String[] args) {
        PermissaoFactory factory = new PermissaoFactory();

        UsuarioComPermissoes ana = new UsuarioComPermissoes("Ana")
                .adicionar(factory.obter("PRODUTOS_LISTAR", "Listar produtos"))
                .adicionar(factory.obter("PRODUTOS_CRIAR", "Criar produtos"))
                .adicionar(factory.obter("CONTRATOS_LISTAR", "Listar contratos"));

        UsuarioComPermissoes carlos = new UsuarioComPermissoes("Carlos")
                .adicionar(factory.obter("PRODUTOS_LISTAR", "Listar produtos"))
                .adicionar(factory.obter("CONTRATOS_LISTAR", "Listar contratos"))
                .adicionar(factory.obter("CONTRATOS_APROVAR", "Aprovar contratos"));

        ana.imprimir();
        System.out.println();
        carlos.imprimir();

        System.out.println();
        System.out.println("Total de permissões compartilhadas: " + factory.totalCompartilhado());
        System.out.println("Ana possui PRODUTOS_CRIAR? " + ana.possui("PRODUTOS_CRIAR"));
        System.out.println("Carlos possui PRODUTOS_CRIAR? " + carlos.possui("PRODUTOS_CRIAR"));
    }
}
```

---

# Parte 12 — Exemplo 3: templates de mensagem

Templates são ótimos candidatos a flyweight.

O template é compartilhado.

Os dados variáveis são passados na hora de renderizar.

---

## TemplateMensagem

Crie:

```text
src\br\com\curso\aula237\mensagem\TemplateMensagem.java
```

Código:

```java
package br.com.curso.aula237.mensagem;

import java.util.Map;

public final class TemplateMensagem {
    private final String codigo;
    private final String texto;

    public TemplateMensagem(String codigo, String texto) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do template é obrigatório.");
        }

        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto do template é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.texto = texto;
    }

    public String codigo() {
        return codigo;
    }

    public String renderizar(Map<String, String> variaveis) {
        if (variaveis == null) {
            throw new IllegalArgumentException("Variáveis são obrigatórias.");
        }

        String resultado = texto;

        for (Map.Entry<String, String> entrada : variaveis.entrySet()) {
            String marcador = "{{" + entrada.getKey() + "}}";
            resultado = resultado.replace(marcador, entrada.getValue());
        }

        return resultado;
    }
}
```

---

## TemplateMensagemFactory

Crie:

```text
src\br\com\curso\aula237\factory\TemplateMensagemFactory.java
```

Código:

```java
package br.com.curso.aula237.factory;

import br.com.curso.aula237.mensagem.TemplateMensagem;

import java.util.HashMap;
import java.util.Map;

public class TemplateMensagemFactory {
    private final Map<String, TemplateMensagem> cache = new HashMap<>();

    public TemplateMensagem obter(String codigo, String texto) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String chave = codigo.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            System.out.println("[TEMPLATE] Reutilizando: " + chave);
            return cache.get(chave);
        }

        System.out.println("[TEMPLATE] Criando: " + chave);

        TemplateMensagem template = new TemplateMensagem(codigo, texto);
        cache.put(chave, template);

        return template;
    }

    public int totalCompartilhado() {
        return cache.size();
    }
}
```

---

## TemplateMensagemFlyweightApp

Crie:

```text
src\br\com\curso\aula237\app\TemplateMensagemFlyweightApp.java
```

Código:

```java
package br.com.curso.aula237.app;

import br.com.curso.aula237.factory.TemplateMensagemFactory;
import br.com.curso.aula237.mensagem.TemplateMensagem;

import java.util.Map;

public class TemplateMensagemFlyweightApp {
    public static void main(String[] args) {
        TemplateMensagemFactory factory = new TemplateMensagemFactory();

        TemplateMensagem boasVindas = factory.obter(
                "BOAS_VINDAS",
                "Olá, {{cliente}}. Sua ordem {{os}} foi criada com sucesso."
        );

        System.out.println(boasVindas.renderizar(Map.of(
                "cliente", "Ana",
                "os", "OS-001"
        )));

        TemplateMensagem boasVindasNovamente = factory.obter(
                "BOAS_VINDAS",
                "Olá, {{cliente}}. Sua ordem {{os}} foi criada com sucesso."
        );

        System.out.println(boasVindasNovamente.renderizar(Map.of(
                "cliente", "Carlos",
                "os", "OS-002"
        )));

        System.out.println();
        System.out.println("Total de templates compartilhados: " + factory.totalCompartilhado());
    }
}
```

---

## Análise

O template é compartilhado.

As variáveis são extrínsecas:

```text
cliente;
os.
```

Cada renderização usa um contexto diferente.

---

# Parte 13 — Flyweight e performance

Flyweight ajuda principalmente quando há:

```text
muitos objetos;
alta repetição;
dados compartilháveis;
dados imutáveis;
pressão de memória;
custo de criação alto.
```

Mas nem sempre é necessário.

Se você tem:

```text
100 objetos pequenos
```

provavelmente não precisa.

Se você tem:

```text
1.000.000 objetos com muitos dados repetidos
```

pode fazer diferença.

---

## Custo do Flyweight

Flyweight também tem custo:

```text
mapa/cache;
lookup por chave;
complexidade;
risco de cache crescer demais;
risco de mutabilidade;
concorrência em ambiente multi-thread.
```

Não use apenas por moda.

---

# Parte 14 — Flyweight e concorrência

Em aplicações web, várias threads podem acessar a factory.

Nesta aula usamos:

```java
HashMap
```

Para estudo.

Em cenário real, pode ser melhor usar:

```java
ConcurrentHashMap
```

Exemplo conceitual:

```java
cache.computeIfAbsent(chave, key -> criarObjeto(...));
```

Também é importante pensar em:

```text
limite de tamanho;
evicção;
TTL;
carregamento sob demanda;
sincronização.
```

---

# Parte 15 — Flyweight e banco de dados

Muitos dados compartilhados vêm do banco:

```text
status;
tipo de serviço;
categoria;
permissão;
template;
grupo de serviço;
parâmetro;
código de ocorrência.
```

Você pode carregar esses dados como objetos compartilhados em memória.

Mas cuidado:

```text
se o banco mudar, cache precisa atualizar;
se existir multi-instância, cada instância pode ter cache próprio;
se for dado sensível, controle acesso;
se for dado grande, não carregue tudo sem necessidade.
```

---

# Parte 16 — Como isso conversa com front-end

O front não precisa saber se o backend usa Flyweight.

Exemplo:

```text
GET /pedidos/PED-001
```

Internamente, o backend pode compartilhar:

```text
ProdutoReferencia;
StatusReferencia;
TemplateMensagem;
Permissao.
```

Mas o response continua normal:

```json
{
  "codigo": "PED-001",
  "produto": {
    "codigo": "P001",
    "nome": "Notebook"
  },
  "quantidade": 1,
  "valor": 3500.00
}
```

Flyweight é uma otimização interna do backend.

---

# Parte 17 — Erros comuns com Flyweight

## 1. Flyweight mutável

Se o objeto compartilhado muda, todos os consumidores são afetados.

Prefira imutabilidade.

---

## 2. Colocar estado extrínseco dentro do flyweight

Exemplo errado:

```text
ProdutoReferencia.quantidade
```

Quantidade varia por item.

Deve ficar fora.

---

## 3. Cache infinito

Se a factory guarda tudo para sempre, pode virar vazamento de memória.

---

## 4. Usar Flyweight sem repetição

Se quase nenhum objeto se repete, não há ganho.

---

## 5. Usar Flyweight onde clareza importa mais que memória

O padrão aumenta complexidade.

Use quando houver benefício real.

---

# Parte 18 — Quando usar Flyweight

Use Flyweight quando:

```text
existem muitos objetos;
muitos dados se repetem;
dados compartilhados são imutáveis;
a criação é custosa;
a memória importa;
objetos podem ser identificados por chave;
o estado extrínseco pode ficar fora.
```

---

## Quando evitar

Evite Flyweight quando:

```text
não há repetição;
os objetos são pequenos e poucos;
os dados mudam o tempo todo;
o objeto compartilhado precisa ser mutável;
a complexidade não compensa;
um cache simples resolve melhor.
```

---

# Parte 19 — Checklist para aplicar Flyweight

Pergunte:

```text
1. Tenho muitos objetos parecidos?
2. Quais dados se repetem?
3. Quais dados variam por contexto?
4. A parte compartilhada é imutável?
5. Existe uma chave clara?
6. Uma factory pode controlar as instâncias?
7. O cache pode crescer sem limite?
8. Preciso de concorrência segura?
9. O ganho compensa a complexidade?
10. Isso é Flyweight ou apenas cache?
```

---

# Parte 20 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula237.app.PedidoRuimApp
java -cp out br.com.curso.aula237.app.PedidoFlyweightApp
java -cp out br.com.curso.aula237.app.PedidoFlyweightVariosProdutosApp
java -cp out br.com.curso.aula237.app.PermissaoFlyweightApp
java -cp out br.com.curso.aula237.app.TemplateMensagemFlyweightApp
```

Depois responda:

```text
1. Qual era o problema do ItemPedidoRuim?
2. O que virou estado intrínseco no produto?
3. O que ficou como estado extrínseco no item?
4. Qual classe controla o compartilhamento?
5. Por que ProdutoReferencia é imutável?
6. Como permissões foram compartilhadas?
7. Como templates foram compartilhados?
8. Qual diferença entre Flyweight e Singleton?
9. Qual diferença entre Flyweight e Cache?
10. Quando Flyweight seria exagerado?
```

---

# Parte 21 — Exercício prático principal

## Contexto

Crie Flyweight para tipos de serviço.

Exemplos:

```text
MONTAGEM;
INSTALACAO;
VISITA_TECNICA;
REPARO;
TROCA.
```

---

## Flyweight

Crie:

```text
TipoServicoReferencia
```

Campos:

```text
String codigo;
String nome;
String descricao;
boolean exigeAgendamento;
```

Deve ser imutável.

---

## Factory

Crie:

```text
TipoServicoFactory
```

Método:

```java
TipoServicoReferencia obter(String codigo, String nome, String descricao, boolean exigeAgendamento)
```

Deve compartilhar por código.

---

## Uso

Crie:

```text
AtividadeServico
```

Campos:

```text
TipoServicoReferencia tipoServico;
String codigoAtividade;
String cliente;
LocalDate dataAgendada;
```

---

## App

Crie:

```text
TipoServicoFlyweightApp
```

Monte várias atividades com os mesmos tipos de serviço.

Imprima:

```text
total de atividades;
total de tipos de serviço compartilhados.
```

---

## Critérios

```text
TipoServicoReferencia deve ser imutável;
AtividadeServico guarda o contexto específico;
factory deve reutilizar por código;
não colocar cliente/data dentro do flyweight;
mostrar pelo menos 10 atividades e 3 tipos compartilhados.
```

---

# Parte 22 — Desafio extra

## Flyweight para códigos de ocorrência

Crie:

```text
OcorrenciaReferencia
```

Campos:

```text
int codigo;
String descricao;
String categoria;
```

Crie:

```text
OcorrenciaReferenciaFactory
```

Crie:

```text
OcorrenciaRegistrada
```

Campos:

```text
OcorrenciaReferencia referencia;
String codigoOs;
String usuario;
Instant registradaEm;
String observacao;
```

Objetivo:

```text
compartilhar a descrição/categoria do código de ocorrência;
manter dados específicos fora do flyweight.
```

Critérios:

```text
referência imutável;
registradaEm não fica no flyweight;
observação não fica no flyweight;
factory compartilha por código;
app registra várias ocorrências repetindo códigos.
```

---

# Parte 23 — Simulado rápido

## Questão 1

Flyweight Pattern é usado principalmente para:

```text
A) compartilhar objetos repetidos e reduzir consumo de memória.
B) controlar acesso a objeto real.
C) adaptar API externa.
D) representar árvore de objetos.
```

---

## Questão 2

Estado intrínseco é:

```text
A) parte compartilhável e geralmente imutável.
B) parte específica de cada contexto.
C) sempre um controller.
D) sempre um repository.
```

---

## Questão 3

Estado extrínseco é:

```text
A) parte específica de cada uso/contexto.
B) parte que todos compartilham.
C) sempre um singleton.
D) sempre um enum.
```

---

## Questão 4

Um flyweight deve preferencialmente ser:

```text
A) imutável.
B) mutável com muitos setters.
C) dependente do usuário atual.
D) criado sem chave.
```

---

## Questão 5

Flyweight se diferencia de Singleton porque:

```text
A) Flyweight compartilha múltiplas instâncias por chave; Singleton busca uma única instância.
B) Singleton sempre usa Map.
C) Flyweight é sempre controller.
D) Não existe diferença.
```

---

## Questão 6

Se não há repetição significativa de objetos:

```text
A) Flyweight pode ser exagerado.
B) Flyweight é sempre obrigatório.
C) Singleton resolve tudo.
D) Adapter resolve tudo.
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

# Parte 24 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Flyweight Pattern.
[ ] Sei identificar objetos repetidos.
[ ] Sei separar estado intrínseco.
[ ] Sei separar estado extrínseco.
[ ] Sei criar flyweight imutável.
[ ] Sei criar factory de flyweight.
[ ] Sei reutilizar instâncias por chave.
[ ] Sei aplicar em produtos.
[ ] Sei aplicar em permissões.
[ ] Sei aplicar em templates.
[ ] Sei diferenciar Flyweight de Singleton.
[ ] Sei diferenciar Flyweight de Cache.
[ ] Sei evitar flyweight mutável.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Flyweight Pattern?
2. Qual problema ele resolve?
3. O que é estado intrínseco?
4. O que é estado extrínseco?
5. Por que flyweight deve ser imutável?
6. Qual papel da factory?
7. Qual diferença entre Flyweight e Singleton?
8. Qual diferença entre Flyweight e Cache?
9. Quais riscos de cache crescer sem limite?
10. Quando Flyweight seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
identificar repetição de objetos;
extrair parte compartilhável;
criar flyweight imutável;
criar factory/cache por chave;
usar flyweight em itens de pedido;
usar flyweight em permissões;
usar flyweight em templates;
resolver exercício de tipos de serviço;
resolver desafio de ocorrências.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-237-flyweight-pattern-objetos-compartilhados-performance
git commit -m "Aula 237: flyweight pattern objetos compartilhados performance"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Flyweight Pattern reduz consumo de memória compartilhando objetos repetidos e imutáveis por chave.
```

Você estudou:

```text
Flyweight Pattern;
estado intrínseco;
estado extrínseco;
ProdutoReferencia;
ItemPedido;
factory de flyweight;
permissões compartilhadas;
templates de mensagem;
imutabilidade;
riscos de cache;
concorrência;
diferença para Singleton, Cache e Factory.
```

Na próxima aula, vamos estudar:

```text
Bridge Pattern.
```

A ideia será separar abstração de implementação para evitar explosão de classes quando duas dimensões variam ao mesmo tempo, como canais de envio, formatos de relatório, provedores externos e tipos de processamento.
