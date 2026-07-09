# 241 — M10.19 — Iterator Pattern: percorrendo coleções e lotes

## Objetivo da aula

Na aula anterior, você estudou:

```text
Memento Pattern
```

Você viu que Memento ajuda quando precisamos salvar snapshots de estado para permitir:

```text
undo;
histórico;
restauração;
rollback lógico;
edição segura;
controle de versões;
comparação antes/depois.
```

Agora vamos estudar outro padrão comportamental clássico:

```text
Iterator Pattern
```

Em português:

```text
Padrão Iterador
```

Iterator aparece quando você precisa percorrer uma coleção, lote, árvore, lista customizada ou fonte de dados sem expor sua representação interna.

Exemplos comuns em backend:

```text
paginação;
processamento em lote;
leitura de arquivos;
consulta paginada no banco;
leitura sequencial de registros;
coleções customizadas;
árvores de categorias;
itens de pedido;
eventos pendentes;
mensagens em fila;
registros de importação;
resultados de API externa;
relatórios grandes;
streaming de dados.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Iterator resolve;
criar um iterador manual;
criar uma coleção customizada;
percorrer itens sem expor lista interna;
usar Iterable e Iterator do Java;
criar iterator para lote paginado;
criar iterator para árvore simples;
entender diferença entre Iterator e for comum;
entender diferença entre Iterator e Stream;
aplicar Iterator em processamento backend;
evitar carregar dados demais em memória;
entender quando Iterator ajuda e quando é exagero.
```

---

## Ideia principal

Iterator fornece uma forma padronizada de percorrer elementos sem expor como eles estão armazenados.

Quem consome só precisa saber:

```text
existe próximo?
pegar próximo.
```

Exemplo:

```java
while (iterator.temProximo()) {
    Item item = iterator.proximo();
}
```

Ou usando o padrão do Java:

```java
while (iterator.hasNext()) {
    Item item = iterator.next();
}
```

A coleção pode estar internamente em:

```text
List;
array;
Map;
arquivo;
página de banco;
API externa;
árvore;
fila;
stream.
```

O consumidor não precisa saber.

---

## Iterator em uma frase prática

```text
Use Iterator quando quiser percorrer uma sequência de elementos sem expor a estrutura interna da coleção.
```

Ou:

```text
Iterator separa a lógica de navegação da estrutura dos dados.
```

---

## Problema sem Iterator

Imagine uma coleção de pedidos.

Sem cuidado, você expõe a lista interna:

```java
public List<Pedido> pedidos() {
    return pedidos;
}
```

Agora qualquer parte do sistema pode:

```java
colecao.pedidos().clear();
colecao.pedidos().add(null);
colecao.pedidos().remove(0);
```

Isso quebra encapsulamento.

Outra situação: processamento paginado.

Sem Iterator, o service pode ficar cheio de lógica de paginação:

```java
int pagina = 0;
boolean continuar = true;

while (continuar) {
    List<Registro> registros = repository.buscarPagina(pagina, 100);

    for (Registro registro : registros) {
        processar(registro);
    }

    continuar = !registros.isEmpty();
    pagina++;
}
```

Se essa lógica se repetir em vários lugares, vira duplicação.

Iterator pode encapsular a navegação.

---

## Relação com SOLID

## SRP

A coleção cuida de guardar elementos.

O iterator cuida de percorrer elementos.

O processador cuida de processar elementos.

---

## OCP

Você pode mudar a estrutura interna sem alterar quem percorre.

Exemplo:

```text
de List para array;
de List para paginação;
de memória para banco;
de banco para API.
```

Se o contrato do iterator continuar igual, o consumidor muda pouco ou nada.

---

## LSP

Todo iterator deve cumprir o contrato:

```text
hasNext;
next.
```

Se diz que tem próximo, `next` deve retornar elemento válido.

---

## ISP

Iterator tem interface pequena.

```text
hasNext;
next.
```

Isso é bom.

---

## DIP

Quem processa pode depender de uma abstração de iterator ou de `Iterable`.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Iterator:

```text
Iterator percorre dados.
O use case coordena processamento.
O repository pode fornecer páginas.
A entidade continua protegendo regra.
O controller futuro apenas dispara a operação.
```

Iterator não substitui repository, use case ou regra de domínio.

---

# Parte 1 — Iterator vs for comum

## for comum

Serve muito bem para listas simples:

```java
for (Pedido pedido : pedidos) {
    processar(pedido);
}
```

Se você já tem uma `List`, isso basta.

---

## Iterator

Ajuda quando:

```text
não quer expor a lista interna;
quer controlar navegação;
quer percorrer fonte customizada;
quer buscar dados sob demanda;
quer esconder paginação;
quer percorrer árvore;
quer padronizar leitura.
```

---

## Diferença prática

```text
for comum:
percorrer coleção já disponível.

Iterator:
controlar como os elementos são obtidos.
```

---

# Parte 2 — Iterator vs Stream

## Stream

Muito usado no Java moderno para operações funcionais:

```java
pedidos.stream()
       .filter(...)
       .map(...)
       .toList();
```

---

## Iterator

É mais baixo nível.

Controla navegação:

```java
while (iterator.hasNext()) {
    Pedido pedido = iterator.next();
}
```

---

## Diferença prática

```text
Stream:
pipeline funcional de transformação.

Iterator:
navegação sequencial.
```

Streams internamente usam ideias relacionadas a iteração, mas o padrão Iterator é mais fundamental.

---

# Parte 3 — Iterator vs Repository

Repository busca dados.

Iterator percorre dados.

Exemplo:

```text
PedidoRepository:
buscarPagina(pagina, tamanho)

PedidoPaginadoIterator:
usa repository para percorrer todos os pedidos página por página
```

O repository não deve virar iterator gigante.

O iterator pode usar o repository.

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-241-iterator-pattern-percorrendo-colecoes-e-lotes
cd labs\m10\aula-241-iterator-pattern-percorrendo-colecoes-e-lotes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula241

mkdir src\br\com\curso\aula241\app

mkdir src\br\com\curso\aula241\pedido
mkdir src\br\com\curso\aula241\pedido\manual
mkdir src\br\com\curso\aula241\pedido\java

mkdir src\br\com\curso\aula241\lote
mkdir src\br\com\curso\aula241\lote\repository
mkdir src\br\com\curso\aula241\lote\iterator
mkdir src\br\com\curso\aula241\lote\service

mkdir src\br\com\curso\aula241\categoria
```

---

# Parte 5 — Exemplo 1: iterator manual

Vamos começar criando nosso próprio iterator.

## Pedido

Crie:

```text
src\br\com\curso\aula241\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula241.pedido;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;

    public Pedido(String codigo, String cliente, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
    }

    public Pedido(String codigo, String cliente, String valor) {
        this(codigo, cliente, new BigDecimal(valor));
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

    public String resumo() {
        return codigo + " | " + cliente + " | R$ " + valor;
    }
}
```

---

## MeuIterator

Crie:

```text
src\br\com\curso\aula241\pedido\manual\MeuIterator.java
```

Código:

```java
package br.com.curso.aula241.pedido.manual;

public interface MeuIterator<T> {
    boolean temProximo();

    T proximo();
}
```

---

## ColecaoPedidos

Crie:

```text
src\br\com\curso\aula241\pedido\manual\ColecaoPedidos.java
```

Código:

```java
package br.com.curso.aula241.pedido.manual;

import br.com.curso.aula241.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;

public class ColecaoPedidos {
    private final List<Pedido> pedidos = new ArrayList<>();

    public void adicionar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.add(pedido);
    }

    public int tamanho() {
        return pedidos.size();
    }

    Pedido obterPorIndice(int indice) {
        return pedidos.get(indice);
    }

    public MeuIterator<Pedido> iterator() {
        return new PedidoIterator(this);
    }
}
```

---

## PedidoIterator

Crie:

```text
src\br\com\curso\aula241\pedido\manual\PedidoIterator.java
```

Código:

```java
package br.com.curso.aula241.pedido.manual;

import br.com.curso.aula241.pedido.Pedido;

import java.util.NoSuchElementException;

public class PedidoIterator implements MeuIterator<Pedido> {
    private final ColecaoPedidos colecao;
    private int indiceAtual = 0;

    public PedidoIterator(ColecaoPedidos colecao) {
        if (colecao == null) {
            throw new IllegalArgumentException("Coleção é obrigatória.");
        }

        this.colecao = colecao;
    }

    @Override
    public boolean temProximo() {
        return indiceAtual < colecao.tamanho();
    }

    @Override
    public Pedido proximo() {
        if (!temProximo()) {
            throw new NoSuchElementException("Não há próximo pedido.");
        }

        Pedido pedido = colecao.obterPorIndice(indiceAtual);
        indiceAtual++;

        return pedido;
    }
}
```

---

## PedidoIteratorManualApp

Crie:

```text
src\br\com\curso\aula241\app\PedidoIteratorManualApp.java
```

Código:

```java
package br.com.curso.aula241.app;

import br.com.curso.aula241.pedido.Pedido;
import br.com.curso.aula241.pedido.manual.ColecaoPedidos;
import br.com.curso.aula241.pedido.manual.MeuIterator;

public class PedidoIteratorManualApp {
    public static void main(String[] args) {
        ColecaoPedidos colecao = new ColecaoPedidos();

        colecao.adicionar(new Pedido("PED-001", "Ana", "1500.00"));
        colecao.adicionar(new Pedido("PED-002", "Carlos", "800.00"));
        colecao.adicionar(new Pedido("PED-003", "Maria", "2200.00"));

        MeuIterator<Pedido> iterator = colecao.iterator();

        while (iterator.temProximo()) {
            Pedido pedido = iterator.proximo();
            System.out.println(pedido.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula241.app.PedidoIteratorManualApp
```

---

## O que observar

O app não acessa a lista interna.

Ele só usa:

```text
temProximo;
proximo.
```

A coleção protege sua estrutura.

---

# Parte 6 — Exemplo 2: Iterable do Java

Java já tem interfaces prontas:

```text
java.util.Iterator;
java.lang.Iterable.
```

Quando uma classe implementa `Iterable<T>`, você pode usar:

```java
for (T item : colecao) {
}
```

---

## ColecaoPedidosJava

Crie:

```text
src\br\com\curso\aula241\pedido\java\ColecaoPedidosJava.java
```

Código:

```java
package br.com.curso.aula241.pedido.java;

import br.com.curso.aula241.pedido.Pedido;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ColecaoPedidosJava implements Iterable<Pedido> {
    private final List<Pedido> pedidos = new ArrayList<>();

    public void adicionar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.add(pedido);
    }

    public int tamanho() {
        return pedidos.size();
    }

    @Override
    public Iterator<Pedido> iterator() {
        return pedidos.iterator();
    }
}
```

---

## PedidoIteratorJavaApp

Crie:

```text
src\br\com\curso\aula241\app\PedidoIteratorJavaApp.java
```

Código:

```java
package br.com.curso.aula241.app;

import br.com.curso.aula241.pedido.Pedido;
import br.com.curso.aula241.pedido.java.ColecaoPedidosJava;

public class PedidoIteratorJavaApp {
    public static void main(String[] args) {
        ColecaoPedidosJava colecao = new ColecaoPedidosJava();

        colecao.adicionar(new Pedido("PED-010", "Bruna", "700.00"));
        colecao.adicionar(new Pedido("PED-011", "Diego", "1300.00"));
        colecao.adicionar(new Pedido("PED-012", "Fernanda", "500.00"));

        for (Pedido pedido : colecao) {
            System.out.println(pedido.resumo());
        }
    }
}
```

---

## Análise

Ao implementar `Iterable`, a coleção participa naturalmente do ecossistema Java.

Você pode usar:

```text
for-each;
Iterator;
spliterator;
algumas integrações com APIs de coleção.
```

---

# Parte 7 — Iterator com filtro

Agora vamos criar um iterator que percorre apenas pedidos acima de determinado valor.

## PedidoValorMinimoIterator

Crie:

```text
src\br\com\curso\aula241\pedido\java\PedidoValorMinimoIterator.java
```

Código:

```java
package br.com.curso.aula241.pedido.java;

import br.com.curso.aula241.pedido.Pedido;

import java.math.BigDecimal;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class PedidoValorMinimoIterator implements Iterator<Pedido> {
    private final Iterator<Pedido> origem;
    private final BigDecimal valorMinimo;
    private Pedido proximoValido;
    private boolean proximoCarregado;

    public PedidoValorMinimoIterator(Iterator<Pedido> origem, BigDecimal valorMinimo) {
        if (origem == null) {
            throw new IllegalArgumentException("Iterator de origem é obrigatório.");
        }

        if (valorMinimo == null || valorMinimo.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor mínimo não pode ser negativo.");
        }

        this.origem = origem;
        this.valorMinimo = valorMinimo;
    }

    @Override
    public boolean hasNext() {
        if (proximoCarregado) {
            return true;
        }

        while (origem.hasNext()) {
            Pedido candidato = origem.next();

            if (candidato.valor().compareTo(valorMinimo) >= 0) {
                proximoValido = candidato;
                proximoCarregado = true;
                return true;
            }
        }

        return false;
    }

    @Override
    public Pedido next() {
        if (!hasNext()) {
            throw new NoSuchElementException("Não há próximo pedido válido.");
        }

        Pedido resultado = proximoValido;
        proximoValido = null;
        proximoCarregado = false;

        return resultado;
    }
}
```

---

## PedidoIteratorFiltroApp

Crie:

```text
src\br\com\curso\aula241\app\PedidoIteratorFiltroApp.java
```

Código:

```java
package br.com.curso.aula241.app;

import br.com.curso.aula241.pedido.Pedido;
import br.com.curso.aula241.pedido.java.ColecaoPedidosJava;
import br.com.curso.aula241.pedido.java.PedidoValorMinimoIterator;

import java.math.BigDecimal;
import java.util.Iterator;

public class PedidoIteratorFiltroApp {
    public static void main(String[] args) {
        ColecaoPedidosJava colecao = new ColecaoPedidosJava();

        colecao.adicionar(new Pedido("PED-020", "Ana", "300.00"));
        colecao.adicionar(new Pedido("PED-021", "Carlos", "1200.00"));
        colecao.adicionar(new Pedido("PED-022", "Maria", "2500.00"));
        colecao.adicionar(new Pedido("PED-023", "João", "450.00"));

        Iterator<Pedido> iterator = new PedidoValorMinimoIterator(
                colecao.iterator(),
                new BigDecimal("1000.00")
        );

        while (iterator.hasNext()) {
            System.out.println(iterator.next().resumo());
        }
    }
}
```

---

## Observação

Hoje, isso também poderia ser feito com Stream:

```java
colecao.stream().filter(...)
```

Mas o objetivo aqui é entender como a navegação pode ser encapsulada.

Iterator é útil quando a fonte de dados não é uma lista simples.

---

# Parte 8 — Exemplo 3: processamento paginado em lote

Agora vamos para um cenário de backend muito importante.

Imagine que você tem muitos registros para processar.

Você não quer carregar tudo em memória.

Você busca por páginas.

---

## RegistroImportacao

Crie:

```text
src\br\com\curso\aula241\lote\RegistroImportacao.java
```

Código:

```java
package br.com.curso.aula241.lote;

public class RegistroImportacao {
    private final String codigo;
    private final String cliente;
    private final String status;

    public RegistroImportacao(String codigo, String cliente, String status) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.status = status.trim().toUpperCase();
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String status() {
        return status;
    }

    public String resumo() {
        return codigo + " | " + cliente + " | " + status;
    }
}
```

---

## RegistroImportacaoRepository

Crie:

```text
src\br\com\curso\aula241\lote\repository\RegistroImportacaoRepository.java
```

Código:

```java
package br.com.curso.aula241.lote.repository;

import br.com.curso.aula241.lote.RegistroImportacao;

import java.util.List;

public interface RegistroImportacaoRepository {
    List<RegistroImportacao> buscarPagina(int pagina, int tamanho);
}
```

---

## RegistroImportacaoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula241\lote\repository\RegistroImportacaoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula241.lote.repository;

import br.com.curso.aula241.lote.RegistroImportacao;

import java.util.ArrayList;
import java.util.List;

public class RegistroImportacaoRepositoryMemoria implements RegistroImportacaoRepository {
    private final List<RegistroImportacao> registros = new ArrayList<>();

    public RegistroImportacaoRepositoryMemoria() {
        for (int i = 1; i <= 25; i++) {
            String codigo = "REG-" + String.format("%03d", i);
            String cliente = "Cliente " + i;
            String status = i % 5 == 0 ? "ERRO" : "PENDENTE";

            registros.add(new RegistroImportacao(codigo, cliente, status));
        }
    }

    @Override
    public List<RegistroImportacao> buscarPagina(int pagina, int tamanho) {
        if (pagina < 0) {
            throw new IllegalArgumentException("Página não pode ser negativa.");
        }

        if (tamanho <= 0) {
            throw new IllegalArgumentException("Tamanho deve ser maior que zero.");
        }

        int inicio = pagina * tamanho;

        if (inicio >= registros.size()) {
            return List.of();
        }

        int fim = Math.min(inicio + tamanho, registros.size());

        System.out.println("[REPOSITORY] Buscando página " + pagina + " | tamanho " + tamanho);

        return new ArrayList<>(registros.subList(inicio, fim));
    }
}
```

---

# Parte 9 — Iterator paginado

## RegistroImportacaoPaginadoIterator

Crie:

```text
src\br\com\curso\aula241\lote\iterator\RegistroImportacaoPaginadoIterator.java
```

Código:

```java
package br.com.curso.aula241.lote.iterator;

import br.com.curso.aula241.lote.RegistroImportacao;
import br.com.curso.aula241.lote.repository.RegistroImportacaoRepository;

import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class RegistroImportacaoPaginadoIterator implements Iterator<RegistroImportacao> {
    private final RegistroImportacaoRepository repository;
    private final int tamanhoPagina;

    private int paginaAtual = 0;
    private List<RegistroImportacao> paginaCarregada = List.of();
    private int indiceNaPagina = 0;
    private boolean fim = false;

    public RegistroImportacaoPaginadoIterator(
            RegistroImportacaoRepository repository,
            int tamanhoPagina
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (tamanhoPagina <= 0) {
            throw new IllegalArgumentException("Tamanho da página deve ser maior que zero.");
        }

        this.repository = repository;
        this.tamanhoPagina = tamanhoPagina;
    }

    @Override
    public boolean hasNext() {
        if (fim) {
            return false;
        }

        if (indiceNaPagina < paginaCarregada.size()) {
            return true;
        }

        carregarProximaPagina();

        return !fim;
    }

    @Override
    public RegistroImportacao next() {
        if (!hasNext()) {
            throw new NoSuchElementException("Não há próximo registro.");
        }

        RegistroImportacao registro = paginaCarregada.get(indiceNaPagina);
        indiceNaPagina++;

        return registro;
    }

    private void carregarProximaPagina() {
        paginaCarregada = repository.buscarPagina(paginaAtual, tamanhoPagina);
        paginaAtual++;
        indiceNaPagina = 0;

        if (paginaCarregada.isEmpty()) {
            fim = true;
        }
    }
}
```

---

## ProcessadorRegistrosImportacao

Crie:

```text
src\br\com\curso\aula241\lote\service\ProcessadorRegistrosImportacao.java
```

Código:

```java
package br.com.curso.aula241.lote.service;

import br.com.curso.aula241.lote.RegistroImportacao;

import java.util.Iterator;

public class ProcessadorRegistrosImportacao {
    public void processar(Iterator<RegistroImportacao> iterator) {
        if (iterator == null) {
            throw new IllegalArgumentException("Iterator é obrigatório.");
        }

        int total = 0;
        int erros = 0;

        while (iterator.hasNext()) {
            RegistroImportacao registro = iterator.next();

            System.out.println("[PROCESSANDO] " + registro.resumo());

            total++;

            if ("ERRO".equals(registro.status())) {
                erros++;
            }
        }

        System.out.println();
        System.out.println("Total processado: " + total);
        System.out.println("Total com erro: " + erros);
    }
}
```

---

## RegistroImportacaoPaginadoIteratorApp

Crie:

```text
src\br\com\curso\aula241\app\RegistroImportacaoPaginadoIteratorApp.java
```

Código:

```java
package br.com.curso.aula241.app;

import br.com.curso.aula241.lote.iterator.RegistroImportacaoPaginadoIterator;
import br.com.curso.aula241.lote.repository.RegistroImportacaoRepository;
import br.com.curso.aula241.lote.repository.RegistroImportacaoRepositoryMemoria;
import br.com.curso.aula241.lote.service.ProcessadorRegistrosImportacao;

public class RegistroImportacaoPaginadoIteratorApp {
    public static void main(String[] args) {
        RegistroImportacaoRepository repository = new RegistroImportacaoRepositoryMemoria();

        RegistroImportacaoPaginadoIterator iterator = new RegistroImportacaoPaginadoIterator(
                repository,
                7
        );

        new ProcessadorRegistrosImportacao().processar(iterator);
    }
}
```

---

## O que observar

O processador não sabe que os dados vêm por páginas.

Ele só sabe:

```text
hasNext;
next.
```

A paginação ficou escondida dentro do iterator.

Isso é muito útil em backend.

---

# Parte 10 — Por que isso importa em lotes

Em sistemas reais, carregar tudo pode ser ruim:

```text
List<TodosOsRegistros> registros = repository.buscarTudo();
```

Se forem milhões de registros:

```text
alto consumo de memória;
lentidão;
risco de OutOfMemoryError;
transação longa;
conexão presa;
processamento difícil de retomar.
```

Iterator paginado ajuda a processar gradualmente:

```text
busca página;
processa;
busca próxima;
processa;
continua até acabar.
```

---

# Parte 11 — Exemplo 4: iterator de árvore

Agora vamos percorrer uma árvore de categorias.

## Categoria

Crie:

```text
src\br\com\curso\aula241\categoria\Categoria.java
```

Código:

```java
package br.com.curso.aula241.categoria;

import java.util.ArrayList;
import java.util.List;

public class Categoria {
    private final String nome;
    private final List<Categoria> filhas = new ArrayList<>();

    public Categoria(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.nome = nome.trim();
    }

    public String nome() {
        return nome;
    }

    public Categoria adicionar(Categoria categoria) {
        if (categoria == null) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        filhas.add(categoria);
        return this;
    }

    public List<Categoria> filhas() {
        return List.copyOf(filhas);
    }

    @Override
    public String toString() {
        return nome;
    }
}
```

---

## CategoriaProfundidadeIterator

Crie:

```text
src\br\com\curso\aula241\categoria\CategoriaProfundidadeIterator.java
```

Código:

```java
package br.com.curso.aula241.categoria;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class CategoriaProfundidadeIterator implements Iterator<Categoria> {
    private final Deque<Categoria> pilha = new ArrayDeque<>();

    public CategoriaProfundidadeIterator(Categoria raiz) {
        if (raiz == null) {
            throw new IllegalArgumentException("Raiz é obrigatória.");
        }

        pilha.push(raiz);
    }

    @Override
    public boolean hasNext() {
        return !pilha.isEmpty();
    }

    @Override
    public Categoria next() {
        if (!hasNext()) {
            throw new NoSuchElementException("Não há próxima categoria.");
        }

        Categoria atual = pilha.pop();

        var filhas = atual.filhas();

        for (int i = filhas.size() - 1; i >= 0; i--) {
            pilha.push(filhas.get(i));
        }

        return atual;
    }
}
```

---

## CategoriaIteratorApp

Crie:

```text
src\br\com\curso\aula241\app\CategoriaIteratorApp.java
```

Código:

```java
package br.com.curso.aula241.app;

import br.com.curso.aula241.categoria.Categoria;
import br.com.curso.aula241.categoria.CategoriaProfundidadeIterator;

import java.util.Iterator;

public class CategoriaIteratorApp {
    public static void main(String[] args) {
        Categoria raiz = new Categoria("Produtos")
                .adicionar(new Categoria("Móveis")
                        .adicionar(new Categoria("Sofás"))
                        .adicionar(new Categoria("Mesas")))
                .adicionar(new Categoria("Eletrodomésticos")
                        .adicionar(new Categoria("Geladeiras"))
                        .adicionar(new Categoria("Fogões")));

        Iterator<Categoria> iterator = new CategoriaProfundidadeIterator(raiz);

        while (iterator.hasNext()) {
            System.out.println(iterator.next().nome());
        }
    }
}
```

---

## O que observar

O app percorre a árvore sem saber como a navegação acontece.

O iterator usa uma pilha internamente.

Se depois você quiser percurso em largura, pode criar outro iterator.

---

# Parte 12 — Iterator e remoção

A interface `Iterator` do Java possui método opcional:

```java
remove()
```

Mas cuidado.

Nem todo iterator deve permitir remoção.

Se não fizer sentido, não implemente ou deixe o comportamento padrão.

Em muitos cenários backend, o iterator deve ser apenas leitura.

Especialmente quando a fonte é:

```text
banco;
API;
arquivo;
fila;
página de consulta;
árvore imutável.
```

---

# Parte 13 — Iterator e concorrência

Cuidado ao modificar uma coleção enquanto itera.

Exemplo:

```java
for (Pedido pedido : pedidos) {
    pedidos.add(outroPedido);
}
```

Isso pode gerar:

```text
ConcurrentModificationException
```

Em processamento real, prefira:

```text
não alterar a coleção enquanto percorre;
usar cópias;
usar estruturas concorrentes quando necessário;
separar leitura de escrita;
processar em lote com controle claro.
```

---

# Parte 14 — Iterator e paginação de API externa

A mesma ideia serve para API externa.

Exemplo conceitual:

```text
GET /items?page=0
GET /items?page=1
GET /items?page=2
```

Você pode criar:

```text
ApiPaginadaIterator
```

Ele esconde:

```text
número da página;
token de próxima página;
limite;
fim da paginação;
retry;
tratamento de erro.
```

O processador só recebe elementos.

---

# Parte 15 — Iterator e arquivos

Iterator também é útil para leitura de arquivos grandes.

Exemplo conceitual:

```text
CsvRegistroIterator
```

Ele poderia:

```text
abrir arquivo;
ler linha por linha;
converter para objeto;
não carregar tudo em memória.
```

Isso será útil quando estudarmos importação e processamento de arquivos.

---

# Parte 16 — Como isso conversa com front-end

O front geralmente trabalha com paginação:

```text
GET /pedidos?page=0&size=20
GET /pedidos?page=1&size=20
```

No backend, internamente, Iterator pode ajudar em:

```text
exportar todos os dados;
processar todos os registros;
gerar relatório completo;
varrer páginas sem carregar tudo;
enviar dados em lotes.
```

Para o front, o contrato continua sendo paginado.

Para processos internos, Iterator ajuda a percorrer tudo com controle.

---

# Parte 17 — Erros comuns com Iterator

## 1. Expor lista interna

Evite retornar lista mutável interna se isso quebra encapsulamento.

---

## 2. Iterator buscando tudo de uma vez

Se a ideia é paginação, não carregue tudo no construtor do iterator.

---

## 3. next sem validar hasNext

`next` deve lançar erro claro se não houver próximo.

---

## 4. Misturar processamento com navegação

Iterator deve navegar.

Processador deve processar.

---

## 5. Esconder custo demais

Se o iterator busca banco/API a cada página, isso precisa ser entendido e monitorado.

---

## 6. Criar iterator customizado sem necessidade

Para uma lista simples, `for-each` basta.

---

# Parte 18 — Quando usar Iterator

Use Iterator quando:

```text
precisa encapsular navegação;
não quer expor estrutura interna;
vai percorrer fonte customizada;
vai processar páginas;
vai ler arquivo grande;
vai percorrer árvore;
quer padronizar processamento sequencial;
quer evitar carregar tudo em memória.
```

---

## Quando evitar

Evite Iterator customizado quando:

```text
uma List simples resolve;
for-each é suficiente;
Stream deixa mais claro;
a navegação não tem regra especial;
o padrão aumenta complexidade sem ganho.
```

---

# Parte 19 — Checklist para aplicar Iterator

Pergunte:

```text
1. Preciso percorrer elementos?
2. A estrutura interna deve ficar escondida?
3. Existe paginação?
4. Existe leitura sob demanda?
5. Existe árvore?
6. Existe arquivo grande?
7. O processador deve ignorar origem dos dados?
8. O iterator está separado do processamento?
9. for-each simples resolveria?
10. Stream seria mais claro?
```

---

# Parte 20 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula241.app.PedidoIteratorManualApp
java -cp out br.com.curso.aula241.app.PedidoIteratorJavaApp
java -cp out br.com.curso.aula241.app.PedidoIteratorFiltroApp
java -cp out br.com.curso.aula241.app.RegistroImportacaoPaginadoIteratorApp
java -cp out br.com.curso.aula241.app.CategoriaIteratorApp
```

Depois responda:

```text
1. Qual foi o iterator manual criado?
2. Qual classe protege a lista interna de pedidos?
3. Qual interface do Java permite for-each?
4. Como o iterator de valor mínimo filtra pedidos?
5. Como o iterator paginado evita carregar tudo?
6. Quem processa registros de importação?
7. O processador sabe que existe paginação?
8. Como o iterator de categoria percorre a árvore?
9. Qual diferença entre Iterator e Stream?
10. Quando Iterator customizado seria exagerado?
```

---

# Parte 21 — Exercício prático principal

## Contexto

Crie um iterator para processar atividades de uma ordem de serviço em páginas.

Entidade:

```text
Atividade
```

Campos:

```text
codigo;
descricao;
status;
responsavel;
```

Repository:

```java
public interface AtividadeRepository {
    List<Atividade> buscarPagina(int pagina, int tamanho);
}
```

Implementação em memória:

```text
AtividadeRepositoryMemoria
```

Deve criar 30 atividades.

Iterator:

```text
AtividadePaginadaIterator
```

Service:

```text
ProcessadorAtividadesService
```

Deve contar:

```text
total;
total AGENDADA;
total CONCLUIDA;
total FRUSTRADA.
```

App:

```text
AtividadePaginadaIteratorApp
```

---

## Critérios

```text
não carregar tudo no processador;
iterator deve buscar página sob demanda;
service deve depender de Iterator<Atividade>;
repository deve simular páginas;
tamanho da página deve ser parametrizado;
next deve lançar erro se não houver próximo.
```

---

# Parte 22 — Desafio extra

## Iterator de arquivo CSV simulado

Crie uma classe:

```text
LinhaCsvIterator
```

Ela deve receber:

```text
List<String> linhas
```

Cada linha:

```text
codigo;cliente;status
```

Deve retornar:

```text
RegistroCsv
```

Campos:

```text
codigo;
cliente;
status;
```

Regras:

```text
ignorar linha vazia;
ignorar cabeçalho;
lançar erro para linha inválida;
percorrer sem expor lista interna.
```

App:

```text
CsvIteratorApp
```

Objetivo:

```text
preparar a cabeça para importação de arquivos.
```

---

# Parte 23 — Simulado rápido

## Questão 1

Iterator Pattern é usado principalmente para:

```text
A) percorrer elementos sem expor a estrutura interna.
B) controlar acesso a objeto real.
C) adaptar API externa.
D) salvar snapshot de estado.
```

---

## Questão 2

No Java, a interface que permite uso em `for-each` é:

```text
A) Iterable.
B) Serializable.
C) Runnable.
D) Comparable.
```

---

## Questão 3

Um iterator normalmente possui:

```text
A) hasNext e next.
B) save e restore.
C) adapt e convert.
D) build e reset.
```

---

## Questão 4

Iterator paginado ajuda a:

```text
A) evitar carregar todos os registros em memória.
B) criar classe por combinação.
C) salvar snapshot.
D) enviar mensagem.
```

---

## Questão 5

Um erro comum é:

```text
A) misturar lógica de processamento dentro do iterator.
B) separar navegação e processamento.
C) esconder lista interna.
D) usar hasNext.
```

---

## Questão 6

Se uma simples lista e for-each resolvem claramente:

```text
A) iterator customizado pode ser exagerado.
B) iterator customizado é sempre obrigatório.
C) proxy é obrigatório.
D) memento é obrigatório.
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
[ ] Sei explicar Iterator Pattern.
[ ] Sei criar iterator manual.
[ ] Sei usar Iterable do Java.
[ ] Sei proteger lista interna.
[ ] Sei criar iterator com filtro.
[ ] Sei criar iterator paginado.
[ ] Sei processar lote sem carregar tudo.
[ ] Sei criar iterator de árvore.
[ ] Sei diferenciar Iterator de for comum.
[ ] Sei diferenciar Iterator de Stream.
[ ] Sei separar navegação de processamento.
[ ] Sei saber quando iterator customizado é exagerado.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Iterator Pattern?
2. Qual problema ele resolve?
3. Qual diferença entre Iterator e for comum?
4. Qual diferença entre Iterator e Stream?
5. Por que não expor lista interna mutável?
6. Como funciona um iterator paginado?
7. Como o processador usa iterator sem saber a origem?
8. Qual cuidado com coleção modificada durante iteração?
9. Quando Iterator ajuda em arquivos?
10. Quando Iterator seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar coleção iterável;
criar iterator manual;
usar Iterable;
criar iterator filtrado;
criar iterator paginado;
criar iterator de árvore;
processar lotes com Iterator;
resolver exercício de atividades;
resolver desafio de CSV.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-241-iterator-pattern-percorrendo-colecoes-e-lotes
git commit -m "Aula 241: iterator pattern percorrendo colecoes e lotes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Iterator Pattern permite percorrer elementos de forma sequencial sem expor a estrutura interna da coleção ou fonte de dados.
```

Você estudou:

```text
Iterator Pattern;
iterator manual;
Iterable;
for-each;
iterator com filtro;
iterator paginado;
processamento em lote;
iterator de árvore;
diferença para Stream;
cuidados com memória;
cuidados com concorrência;
uso em backend real.
```

Na próxima aula, vamos estudar:

```text
Visitor Pattern.
```

A ideia será adicionar operações a estruturas de objetos sem alterar suas classes, útil em árvores, validações, exportações, cálculos, relatórios e processamento de estruturas compostas.
