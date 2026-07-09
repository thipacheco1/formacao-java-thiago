# 243 — M10.21 — Interpreter Pattern: expressões, regras e DSL simples

## Objetivo da aula

Na aula anterior, você estudou:

```text
Visitor Pattern
```

Você viu que Visitor ajuda quando você tem uma estrutura de objetos e precisa aplicar várias operações sobre ela sem poluir as classes dos elementos, como:

```text
exportar;
validar;
contar;
calcular;
resumir;
analisar.
```

Agora vamos estudar um padrão comportamental clássico, muito útil para representar regras e expressões:

```text
Interpreter Pattern
```

Em português:

```text
Padrão Interpretador
```

Interpreter aparece quando você precisa representar uma linguagem simples, regra configurável, expressão de filtro ou DSL pequena dentro do sistema.

Exemplos comuns em backend:

```text
filtros dinâmicos;
regras configuráveis;
motor de regras simples;
políticas de elegibilidade;
validações compostas;
expressões booleanas;
regras de desconto;
regras de roteamento;
regras de fila;
regras de aprovação;
regras de mensageria;
segmentação de clientes;
condições de workflow;
linguagem simples de consulta;
DSL interna;
validação de critérios.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Interpreter resolve;
criar uma interface de expressão;
criar expressões terminais;
criar expressões compostas;
combinar expressões com E, OU e NÃO;
interpretar regras sobre um contexto;
criar uma DSL simples;
aplicar Interpreter em regras de pedido;
aplicar Interpreter em regras de atendimento;
diferenciar Interpreter de Strategy;
diferenciar Interpreter de Specification;
diferenciar Interpreter de Chain;
entender quando usar e quando evitar;
preparar a base para regras mais avançadas no backend.
```

---

## Ideia principal

Interpreter representa uma regra como uma árvore de expressões.

Exemplo de regra:

```text
Pedido elegível se:
valor maior que 1000
E status igual a PAGO
E cliente VIP
```

Em objetos:

```text
E(
  E(
    ValorMaiorQue(1000),
    StatusIgual(PAGO)
  ),
  ClienteVip()
)
```

Depois você interpreta essa regra contra um contexto:

```java
boolean elegivel = regra.interpretar(pedido);
```

---

## Interpreter em uma frase prática

```text
Use Interpreter quando você precisa representar e avaliar expressões ou regras de uma linguagem simples.
```

Ou:

```text
Interpreter transforma regras em objetos que podem ser combinados e avaliados.
```

---

## Problema sem Interpreter

Imagine regras espalhadas em `if`.

```java
if (pedido.valor().compareTo(new BigDecimal("1000")) > 0
        && "PAGO".equals(pedido.status())
        && pedido.clienteVip()) {
    return true;
}
```

Depois entra outra regra:

```text
pedido de SP ou RJ;
valor acima de 500;
não pode estar cancelado;
cliente deve ter telefone.
```

Você começa a criar muitos `ifs`.

Depois o negócio pede:

```text
regra configurável por cliente;
regra diferente por tipo de fila;
regra diferente por campanha;
regra diferente por operação;
```

O código começa a ficar difícil.

Interpreter ajuda a transformar regra em composição de objetos.

---

## Relação com SOLID

## SRP

Cada expressão tem uma responsabilidade.

```text
ValorMaiorQue:
verifica valor.

StatusIgual:
verifica status.

E:
combina duas expressões.

OU:
combina duas expressões.

NÃO:
inverte uma expressão.
```

---

## OCP

Você adiciona nova expressão criando uma nova classe.

Não precisa alterar todas as regras existentes.

---

## LSP

Toda expressão deve cumprir o contrato:

```text
interpretar contexto;
retornar verdadeiro ou falso;
explicar sua descrição.
```

---

## ISP

A interface deve ser pequena.

Exemplo:

```java
boolean interpretar(T contexto);
String descricao();
```

---

## DIP

Quem usa regra depende da abstração:

```text
Expressao<PedidoContexto>
```

e não das classes concretas.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Interpreter:

```text
Interpreter avalia regras e expressões.
A entidade continua protegendo regra essencial.
O use case decide quando aplicar a regra.
O repository continua salvando.
O controller futuro apenas recebe a requisição.
```

Interpreter não deve virar desculpa para tirar toda regra da entidade.

---

# Parte 1 — Interpreter vs Strategy

## Strategy

Escolhe uma regra/algoritmo intercambiável.

Exemplo:

```text
CalculoFreteSedex;
CalculoFretePac;
CalculoFreteRetirada.
```

---

## Interpreter

Monta uma regra a partir de expressões combináveis.

Exemplo:

```text
ValorMaiorQue(1000) E StatusIgual(PAGO) E ClienteVip
```

---

## Diferença prática

```text
Strategy:
troco uma política inteira.

Interpreter:
monto e interpreto uma expressão.
```

---

# Parte 2 — Interpreter vs Chain

## Chain

Executa uma sequência de handlers.

```text
ValidadorCliente -> ValidadorProduto -> ValidadorPagamento.
```

---

## Interpreter

Avalia uma expressão, muitas vezes em árvore.

```text
E(ValorMaiorQue, OU(ClienteVip, UfIgual)).
```

---

## Diferença prática

```text
Chain:
pipeline de processamento.

Interpreter:
avalia gramática/regra/expressão.
```

---

# Parte 3 — Interpreter vs Specification

Specification é um padrão muito usado para regras de negócio.

Ele também trabalha com regras combináveis.

Exemplo:

```text
PedidoElegivelSpecification
ValorMinimoSpecification
ClienteVipSpecification
```

Em muitos projetos, Specification e Interpreter podem ficar parecidos.

## Diferença prática

```text
Specification:
mais comum para regra de domínio e critérios de seleção.

Interpreter:
mais comum quando você quer representar uma linguagem, expressão ou gramática.
```

Nesta aula, vamos usar o termo Interpreter porque vamos montar expressões como uma pequena linguagem.

---

# Parte 4 — Quando pensar em DSL

DSL significa:

```text
Domain Specific Language
```

Em português:

```text
linguagem específica de domínio.
```

Exemplo simples:

```text
VALOR_MAIOR_QUE:1000
STATUS_IGUAL:PAGO
CLIENTE_VIP
UF_IGUAL:SP
```

Uma DSL pode ser:

```text
texto;
JSON;
objeto;
configuração no banco;
árvore de expressões;
interface gráfica que monta regras.
```

Nesta aula, faremos uma DSL textual simples para estudo.

---

# Parte 5 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-243-interpreter-pattern-expressoes-regras-dsl
cd labs\m10\aula-243-interpreter-pattern-expressoes-regras-dsl
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula243

mkdir src\br\com\curso\aula243\app

mkdir src\br\com\curso\aula243\regras
mkdir src\br\com\curso\aula243\regras\core
mkdir src\br\com\curso\aula243\regras\pedido
mkdir src\br\com\curso\aula243\regras\pedido\expressao
mkdir src\br\com\curso\aula243\regras\pedido\dsl

mkdir src\br\com\curso\aula243\regras\atendimento
mkdir src\br\com\curso\aula243\regras\atendimento\expressao
```

---

# Parte 6 — Núcleo de expressões

## Expressao

Crie:

```text
src\br\com\curso\aula243\regras\core\Expressao.java
```

Código:

```java
package br.com.curso.aula243.regras.core;

public interface Expressao<T> {
    boolean interpretar(T contexto);

    String descricao();
}
```

---

## EExpressao

Crie:

```text
src\br\com\curso\aula243\regras\core\EExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.core;

public class EExpressao<T> implements Expressao<T> {
    private final Expressao<T> esquerda;
    private final Expressao<T> direita;

    public EExpressao(Expressao<T> esquerda, Expressao<T> direita) {
        if (esquerda == null) {
            throw new IllegalArgumentException("Expressão esquerda é obrigatória.");
        }

        if (direita == null) {
            throw new IllegalArgumentException("Expressão direita é obrigatória.");
        }

        this.esquerda = esquerda;
        this.direita = direita;
    }

    @Override
    public boolean interpretar(T contexto) {
        return esquerda.interpretar(contexto) && direita.interpretar(contexto);
    }

    @Override
    public String descricao() {
        return "(" + esquerda.descricao() + " E " + direita.descricao() + ")";
    }
}
```

---

## OuExpressao

Crie:

```text
src\br\com\curso\aula243\regras\core\OuExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.core;

public class OuExpressao<T> implements Expressao<T> {
    private final Expressao<T> esquerda;
    private final Expressao<T> direita;

    public OuExpressao(Expressao<T> esquerda, Expressao<T> direita) {
        if (esquerda == null) {
            throw new IllegalArgumentException("Expressão esquerda é obrigatória.");
        }

        if (direita == null) {
            throw new IllegalArgumentException("Expressão direita é obrigatória.");
        }

        this.esquerda = esquerda;
        this.direita = direita;
    }

    @Override
    public boolean interpretar(T contexto) {
        return esquerda.interpretar(contexto) || direita.interpretar(contexto);
    }

    @Override
    public String descricao() {
        return "(" + esquerda.descricao() + " OU " + direita.descricao() + ")";
    }
}
```

---

## NaoExpressao

Crie:

```text
src\br\com\curso\aula243\regras\core\NaoExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.core;

public class NaoExpressao<T> implements Expressao<T> {
    private final Expressao<T> expressao;

    public NaoExpressao(Expressao<T> expressao) {
        if (expressao == null) {
            throw new IllegalArgumentException("Expressão é obrigatória.");
        }

        this.expressao = expressao;
    }

    @Override
    public boolean interpretar(T contexto) {
        return !expressao.interpretar(contexto);
    }

    @Override
    public String descricao() {
        return "(NÃO " + expressao.descricao() + ")";
    }
}
```

---

# Parte 7 — Contexto de pedido

## PedidoContexto

Crie:

```text
src\br\com\curso\aula243\regras\pedido\PedidoContexto.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido;

import java.math.BigDecimal;

public class PedidoContexto {
    private final String codigo;
    private final String status;
    private final BigDecimal valor;
    private final boolean clienteVip;
    private final String uf;
    private final boolean possuiTelefone;

    public PedidoContexto(
            String codigo,
            String status,
            BigDecimal valor,
            boolean clienteVip,
            String uf,
            boolean possuiTelefone
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor não pode ser negativo.");
        }

        if (uf == null || uf.isBlank()) {
            throw new IllegalArgumentException("UF é obrigatória.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.status = status.trim().toUpperCase();
        this.valor = valor;
        this.clienteVip = clienteVip;
        this.uf = uf.trim().toUpperCase();
        this.possuiTelefone = possuiTelefone;
    }

    public PedidoContexto(
            String codigo,
            String status,
            String valor,
            boolean clienteVip,
            String uf,
            boolean possuiTelefone
    ) {
        this(codigo, status, new BigDecimal(valor), clienteVip, uf, possuiTelefone);
    }

    public String codigo() {
        return codigo;
    }

    public String status() {
        return status;
    }

    public BigDecimal valor() {
        return valor;
    }

    public boolean clienteVip() {
        return clienteVip;
    }

    public String uf() {
        return uf;
    }

    public boolean possuiTelefone() {
        return possuiTelefone;
    }

    public String resumo() {
        return codigo
                + " | status=" + status
                + " | valor=" + valor
                + " | vip=" + clienteVip
                + " | uf=" + uf
                + " | telefone=" + possuiTelefone;
    }
}
```

---

# Parte 8 — Expressões terminais de pedido

## ValorMaiorQueExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\ValorMaiorQueExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

import java.math.BigDecimal;

public class ValorMaiorQueExpressao implements Expressao<PedidoContexto> {
    private final BigDecimal valorMinimo;

    public ValorMaiorQueExpressao(BigDecimal valorMinimo) {
        if (valorMinimo == null || valorMinimo.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor mínimo não pode ser negativo.");
        }

        this.valorMinimo = valorMinimo;
    }

    public ValorMaiorQueExpressao(String valorMinimo) {
        this(new BigDecimal(valorMinimo));
    }

    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.valor().compareTo(valorMinimo) > 0;
    }

    @Override
    public String descricao() {
        return "VALOR > " + valorMinimo;
    }
}
```

---

## ValorMaiorOuIgualExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\ValorMaiorOuIgualExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

import java.math.BigDecimal;

public class ValorMaiorOuIgualExpressao implements Expressao<PedidoContexto> {
    private final BigDecimal valorMinimo;

    public ValorMaiorOuIgualExpressao(BigDecimal valorMinimo) {
        if (valorMinimo == null || valorMinimo.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor mínimo não pode ser negativo.");
        }

        this.valorMinimo = valorMinimo;
    }

    public ValorMaiorOuIgualExpressao(String valorMinimo) {
        this(new BigDecimal(valorMinimo));
    }

    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.valor().compareTo(valorMinimo) >= 0;
    }

    @Override
    public String descricao() {
        return "VALOR >= " + valorMinimo;
    }
}
```

---

## StatusIgualExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\StatusIgualExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

public class StatusIgualExpressao implements Expressao<PedidoContexto> {
    private final String statusEsperado;

    public StatusIgualExpressao(String statusEsperado) {
        if (statusEsperado == null || statusEsperado.isBlank()) {
            throw new IllegalArgumentException("Status esperado é obrigatório.");
        }

        this.statusEsperado = statusEsperado.trim().toUpperCase();
    }

    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.status().equals(statusEsperado);
    }

    @Override
    public String descricao() {
        return "STATUS = " + statusEsperado;
    }
}
```

---

## ClienteVipExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\ClienteVipExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

public class ClienteVipExpressao implements Expressao<PedidoContexto> {
    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.clienteVip();
    }

    @Override
    public String descricao() {
        return "CLIENTE VIP";
    }
}
```

---

## UfIgualExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\UfIgualExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

public class UfIgualExpressao implements Expressao<PedidoContexto> {
    private final String ufEsperada;

    public UfIgualExpressao(String ufEsperada) {
        if (ufEsperada == null || ufEsperada.isBlank()) {
            throw new IllegalArgumentException("UF esperada é obrigatória.");
        }

        this.ufEsperada = ufEsperada.trim().toUpperCase();
    }

    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.uf().equals(ufEsperada);
    }

    @Override
    public String descricao() {
        return "UF = " + ufEsperada;
    }
}
```

---

## PossuiTelefoneExpressao

Crie:

```text
src\br\com\curso\aula243\regras\pedido\expressao\PossuiTelefoneExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.expressao;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

public class PossuiTelefoneExpressao implements Expressao<PedidoContexto> {
    @Override
    public boolean interpretar(PedidoContexto contexto) {
        return contexto.possuiTelefone();
    }

    @Override
    public String descricao() {
        return "POSSUI TELEFONE";
    }
}
```

---

# Parte 9 — Compondo regras manualmente

## PedidoInterpreterApp

Crie:

```text
src\br\com\curso\aula243\app\PedidoInterpreterApp.java
```

Código:

```java
package br.com.curso.aula243.app;

import br.com.curso.aula243.regras.core.EExpressao;
import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.core.OuExpressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;
import br.com.curso.aula243.regras.pedido.expressao.ClienteVipExpressao;
import br.com.curso.aula243.regras.pedido.expressao.StatusIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.UfIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.ValorMaiorQueExpressao;

public class PedidoInterpreterApp {
    public static void main(String[] args) {
        PedidoContexto pedido = new PedidoContexto(
                "PED-001",
                "PAGO",
                "1500.00",
                true,
                "SP",
                true
        );

        Expressao<PedidoContexto> regra = new EExpressao<>(
                new EExpressao<>(
                        new ValorMaiorQueExpressao("1000.00"),
                        new StatusIgualExpressao("PAGO")
                ),
                new OuExpressao<>(
                        new ClienteVipExpressao(),
                        new UfIgualExpressao("SP")
                )
        );

        System.out.println("Pedido: " + pedido.resumo());
        System.out.println("Regra: " + regra.descricao());
        System.out.println("Resultado: " + regra.interpretar(pedido));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula243.app.PedidoInterpreterApp
```

---

## Leitura da regra

A regra significa:

```text
valor maior que 1000
E status igual a PAGO
E
(cliente VIP OU UF igual a SP)
```

Ou seja:

```text
(VALOR > 1000 E STATUS = PAGO) E (CLIENTE VIP OU UF = SP)
```

---

# Parte 10 — Usando NÃO

## PedidoInterpreterNaoApp

Crie:

```text
src\br\com\curso\aula243\app\PedidoInterpreterNaoApp.java
```

Código:

```java
package br.com.curso.aula243.app;

import br.com.curso.aula243.regras.core.EExpressao;
import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.core.NaoExpressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;
import br.com.curso.aula243.regras.pedido.expressao.PossuiTelefoneExpressao;
import br.com.curso.aula243.regras.pedido.expressao.StatusIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.ValorMaiorOuIgualExpressao;

public class PedidoInterpreterNaoApp {
    public static void main(String[] args) {
        PedidoContexto pedido = new PedidoContexto(
                "PED-002",
                "CANCELADO",
                "900.00",
                false,
                "RJ",
                true
        );

        Expressao<PedidoContexto> regra = new EExpressao<>(
                new EExpressao<>(
                        new ValorMaiorOuIgualExpressao("500.00"),
                        new PossuiTelefoneExpressao()
                ),
                new NaoExpressao<>(
                        new StatusIgualExpressao("CANCELADO")
                )
        );

        System.out.println("Pedido: " + pedido.resumo());
        System.out.println("Regra: " + regra.descricao());
        System.out.println("Resultado: " + regra.interpretar(pedido));
    }
}
```

---

## Leitura da regra

A regra significa:

```text
valor maior ou igual a 500
E possui telefone
E NÃO status cancelado.
```

Como o pedido está cancelado, o resultado será falso.

---

# Parte 11 — DSL simples

Agora vamos criar um interpretador textual simples.

Formatos aceitos:

```text
VALOR_MAIOR_QUE:1000
VALOR_MAIOR_OU_IGUAL:500
STATUS_IGUAL:PAGO
UF_IGUAL:SP
CLIENTE_VIP
POSSUI_TELEFONE
```

Essa DSL não terá parser avançado com parênteses.

Ela vai transformar uma linha simples em uma expressão terminal.

Depois vamos combinar expressões em Java.

---

## PedidoExpressaoParser

Crie:

```text
src\br\com\curso\aula243\regras\pedido\dsl\PedidoExpressaoParser.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.dsl;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;
import br.com.curso.aula243.regras.pedido.expressao.ClienteVipExpressao;
import br.com.curso.aula243.regras.pedido.expressao.PossuiTelefoneExpressao;
import br.com.curso.aula243.regras.pedido.expressao.StatusIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.UfIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.ValorMaiorOuIgualExpressao;
import br.com.curso.aula243.regras.pedido.expressao.ValorMaiorQueExpressao;

public class PedidoExpressaoParser {
    public Expressao<PedidoContexto> parse(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Expressão textual é obrigatória.");
        }

        String normalizada = texto.trim().toUpperCase();

        if ("CLIENTE_VIP".equals(normalizada)) {
            return new ClienteVipExpressao();
        }

        if ("POSSUI_TELEFONE".equals(normalizada)) {
            return new PossuiTelefoneExpressao();
        }

        String[] partes = normalizada.split(":", 2);

        if (partes.length != 2) {
            throw new IllegalArgumentException("Expressão inválida: " + texto);
        }

        String operador = partes[0];
        String valor = partes[1];

        return switch (operador) {
            case "VALOR_MAIOR_QUE" -> new ValorMaiorQueExpressao(valor);
            case "VALOR_MAIOR_OU_IGUAL" -> new ValorMaiorOuIgualExpressao(valor);
            case "STATUS_IGUAL" -> new StatusIgualExpressao(valor);
            case "UF_IGUAL" -> new UfIgualExpressao(valor);
            default -> throw new IllegalArgumentException("Operador não suportado: " + operador);
        };
    }
}
```

---

## PedidoDslInterpreterApp

Crie:

```text
src\br\com\curso\aula243\app\PedidoDslInterpreterApp.java
```

Código:

```java
package br.com.curso.aula243.app;

import br.com.curso.aula243.regras.core.EExpressao;
import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;
import br.com.curso.aula243.regras.pedido.dsl.PedidoExpressaoParser;

public class PedidoDslInterpreterApp {
    public static void main(String[] args) {
        PedidoContexto pedido = new PedidoContexto(
                "PED-003",
                "PAGO",
                "1200.00",
                false,
                "MG",
                true
        );

        PedidoExpressaoParser parser = new PedidoExpressaoParser();

        Expressao<PedidoContexto> regra = new EExpressao<>(
                new EExpressao<>(
                        parser.parse("VALOR_MAIOR_QUE:1000"),
                        parser.parse("STATUS_IGUAL:PAGO")
                ),
                parser.parse("POSSUI_TELEFONE")
        );

        System.out.println("Pedido: " + pedido.resumo());
        System.out.println("Regra: " + regra.descricao());
        System.out.println("Resultado: " + regra.interpretar(pedido));
    }
}
```

---

## Observação sobre switch

Esse código usa `switch` expression, disponível em versões modernas do Java.

Se estiver usando Java mais antigo, substitua por `if/else`.

Exemplo:

```java
if ("VALOR_MAIOR_QUE".equals(operador)) {
    return new ValorMaiorQueExpressao(valor);
}
```

---

# Parte 12 — DSL composta com E

Agora vamos interpretar uma regra textual com `E`.

Formato:

```text
VALOR_MAIOR_QUE:1000 E STATUS_IGUAL:PAGO E POSSUI_TELEFONE
```

Para manter o objetivo da aula, faremos um parser simples apenas com `E`.

---

## PedidoRegraEParser

Crie:

```text
src\br\com\curso\aula243\regras\pedido\dsl\PedidoRegraEParser.java
```

Código:

```java
package br.com.curso.aula243.regras.pedido.dsl;

import br.com.curso.aula243.regras.core.EExpressao;
import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;

public class PedidoRegraEParser {
    private final PedidoExpressaoParser expressaoParser = new PedidoExpressaoParser();

    public Expressao<PedidoContexto> parse(String regra) {
        if (regra == null || regra.isBlank()) {
            throw new IllegalArgumentException("Regra é obrigatória.");
        }

        String[] partes = regra.split("\\s+E\\s+");

        if (partes.length == 0) {
            throw new IllegalArgumentException("Regra inválida.");
        }

        Expressao<PedidoContexto> expressaoAtual = expressaoParser.parse(partes[0]);

        for (int i = 1; i < partes.length; i++) {
            expressaoAtual = new EExpressao<>(
                    expressaoAtual,
                    expressaoParser.parse(partes[i])
            );
        }

        return expressaoAtual;
    }
}
```

---

## PedidoDslEInterpreterApp

Crie:

```text
src\br\com\curso\aula243\app\PedidoDslEInterpreterApp.java
```

Código:

```java
package br.com.curso.aula243.app;

import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.pedido.PedidoContexto;
import br.com.curso.aula243.regras.pedido.dsl.PedidoRegraEParser;

public class PedidoDslEInterpreterApp {
    public static void main(String[] args) {
        PedidoContexto pedido = new PedidoContexto(
                "PED-004",
                "PAGO",
                "1800.00",
                false,
                "SP",
                true
        );

        String regraTexto = "VALOR_MAIOR_QUE:1000 E STATUS_IGUAL:PAGO E UF_IGUAL:SP E POSSUI_TELEFONE";

        PedidoRegraEParser parser = new PedidoRegraEParser();

        Expressao<PedidoContexto> regra = parser.parse(regraTexto);

        System.out.println("Pedido: " + pedido.resumo());
        System.out.println("Regra texto: " + regraTexto);
        System.out.println("Regra objeto: " + regra.descricao());
        System.out.println("Resultado: " + regra.interpretar(pedido));
    }
}
```

---

# Parte 13 — Exemplo 2: atendimento

Agora vamos aplicar Interpreter em regras de atendimento.

Contexto:

```text
idade do atendimento em horas;
prioridade;
cliente corporativo;
possui erro;
fila atual.
```

Regras possíveis:

```text
idade maior que X;
prioridade igual;
cliente corporativo;
possui erro;
fila igual.
```

---

## AtendimentoContexto

Crie:

```text
src\br\com\curso\aula243\regras\atendimento\AtendimentoContexto.java
```

Código:

```java
package br.com.curso.aula243.regras.atendimento;

public class AtendimentoContexto {
    private final String codigo;
    private final int idadeHoras;
    private final String prioridade;
    private final boolean clienteCorporativo;
    private final boolean possuiErro;
    private final String filaAtual;

    public AtendimentoContexto(
            String codigo,
            int idadeHoras,
            String prioridade,
            boolean clienteCorporativo,
            boolean possuiErro,
            String filaAtual
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (idadeHoras < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa.");
        }

        if (prioridade == null || prioridade.isBlank()) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        if (filaAtual == null || filaAtual.isBlank()) {
            throw new IllegalArgumentException("Fila atual é obrigatória.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.idadeHoras = idadeHoras;
        this.prioridade = prioridade.trim().toUpperCase();
        this.clienteCorporativo = clienteCorporativo;
        this.possuiErro = possuiErro;
        this.filaAtual = filaAtual.trim().toUpperCase();
    }

    public String codigo() {
        return codigo;
    }

    public int idadeHoras() {
        return idadeHoras;
    }

    public String prioridade() {
        return prioridade;
    }

    public boolean clienteCorporativo() {
        return clienteCorporativo;
    }

    public boolean possuiErro() {
        return possuiErro;
    }

    public String filaAtual() {
        return filaAtual;
    }

    public String resumo() {
        return codigo
                + " | idadeHoras=" + idadeHoras
                + " | prioridade=" + prioridade
                + " | corporativo=" + clienteCorporativo
                + " | erro=" + possuiErro
                + " | fila=" + filaAtual;
    }
}
```

---

## IdadeMaiorQueExpressao

Crie:

```text
src\br\com\curso\aula243\regras\atendimento\expressao\IdadeMaiorQueExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.atendimento.expressao;

import br.com.curso.aula243.regras.atendimento.AtendimentoContexto;
import br.com.curso.aula243.regras.core.Expressao;

public class IdadeMaiorQueExpressao implements Expressao<AtendimentoContexto> {
    private final int horas;

    public IdadeMaiorQueExpressao(int horas) {
        if (horas < 0) {
            throw new IllegalArgumentException("Horas não pode ser negativo.");
        }

        this.horas = horas;
    }

    @Override
    public boolean interpretar(AtendimentoContexto contexto) {
        return contexto.idadeHoras() > horas;
    }

    @Override
    public String descricao() {
        return "IDADE_HORAS > " + horas;
    }
}
```

---

## PrioridadeIgualExpressao

Crie:

```text
src\br\com\curso\aula243\regras\atendimento\expressao\PrioridadeIgualExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.atendimento.expressao;

import br.com.curso.aula243.regras.atendimento.AtendimentoContexto;
import br.com.curso.aula243.regras.core.Expressao;

public class PrioridadeIgualExpressao implements Expressao<AtendimentoContexto> {
    private final String prioridade;

    public PrioridadeIgualExpressao(String prioridade) {
        if (prioridade == null || prioridade.isBlank()) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.prioridade = prioridade.trim().toUpperCase();
    }

    @Override
    public boolean interpretar(AtendimentoContexto contexto) {
        return contexto.prioridade().equals(prioridade);
    }

    @Override
    public String descricao() {
        return "PRIORIDADE = " + prioridade;
    }
}
```

---

## ClienteCorporativoExpressao

Crie:

```text
src\br\com\curso\aula243\regras\atendimento\expressao\ClienteCorporativoExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.atendimento.expressao;

import br.com.curso.aula243.regras.atendimento.AtendimentoContexto;
import br.com.curso.aula243.regras.core.Expressao;

public class ClienteCorporativoExpressao implements Expressao<AtendimentoContexto> {
    @Override
    public boolean interpretar(AtendimentoContexto contexto) {
        return contexto.clienteCorporativo();
    }

    @Override
    public String descricao() {
        return "CLIENTE CORPORATIVO";
    }
}
```

---

## PossuiErroExpressao

Crie:

```text
src\br\com\curso\aula243\regras\atendimento\expressao\PossuiErroExpressao.java
```

Código:

```java
package br.com.curso.aula243.regras.atendimento.expressao;

import br.com.curso.aula243.regras.atendimento.AtendimentoContexto;
import br.com.curso.aula243.regras.core.Expressao;

public class PossuiErroExpressao implements Expressao<AtendimentoContexto> {
    @Override
    public boolean interpretar(AtendimentoContexto contexto) {
        return contexto.possuiErro();
    }

    @Override
    public String descricao() {
        return "POSSUI ERRO";
    }
}
```

---

## AtendimentoInterpreterApp

Crie:

```text
src\br\com\curso\aula243\app\AtendimentoInterpreterApp.java
```

Código:

```java
package br.com.curso.aula243.app;

import br.com.curso.aula243.regras.atendimento.AtendimentoContexto;
import br.com.curso.aula243.regras.atendimento.expressao.ClienteCorporativoExpressao;
import br.com.curso.aula243.regras.atendimento.expressao.IdadeMaiorQueExpressao;
import br.com.curso.aula243.regras.atendimento.expressao.PossuiErroExpressao;
import br.com.curso.aula243.regras.atendimento.expressao.PrioridadeIgualExpressao;
import br.com.curso.aula243.regras.core.EExpressao;
import br.com.curso.aula243.regras.core.Expressao;
import br.com.curso.aula243.regras.core.OuExpressao;

public class AtendimentoInterpreterApp {
    public static void main(String[] args) {
        AtendimentoContexto atendimento = new AtendimentoContexto(
                "ATD-001",
                30,
                "ALTA",
                true,
                false,
                "REAGENDAMENTO"
        );

        Expressao<AtendimentoContexto> regraCritico = new EExpressao<>(
                new IdadeMaiorQueExpressao(24),
                new OuExpressao<>(
                        new PrioridadeIgualExpressao("ALTA"),
                        new ClienteCorporativoExpressao()
                )
        );

        Expressao<AtendimentoContexto> regraErro = new PossuiErroExpressao();

        System.out.println("Atendimento: " + atendimento.resumo());
        System.out.println("Regra crítico: " + regraCritico.descricao());
        System.out.println("É crítico? " + regraCritico.interpretar(atendimento));
        System.out.println("Possui erro? " + regraErro.interpretar(atendimento));
    }
}
```

---

# Parte 14 — Cuidados com regras configuráveis

Interpreter é poderoso, mas regras configuráveis exigem cuidado.

Pense em:

```text
quem pode criar regra?
como validar regra antes de salvar?
como versionar regra?
como auditar alteração?
como testar regra?
como evitar regra ambígua?
como explicar resultado ao usuário?
como evitar regra muito lenta?
como proteger contra entrada maliciosa?
```

Se as regras vêm do usuário ou do banco, você precisa validar muito bem.

---

# Parte 15 — Interpreter e segurança

Nunca interprete código livre vindo do usuário.

Esta aula usa uma DSL controlada.

Exemplo seguro:

```text
STATUS_IGUAL:PAGO
VALOR_MAIOR_QUE:1000
```

Exemplo perigoso:

```text
executar qualquer script recebido do usuário
```

Para backend profissional:

```text
limite operadores permitidos;
valide valores;
registre auditoria;
teste regras;
tenha fallback;
não execute código arbitrário.
```

---

# Parte 16 — Interpreter e Spring futuramente

Quando chegarmos em Spring e ferramentas importantes, essa base vai ajudar a entender assuntos como:

```text
validações configuráveis;
filtros dinâmicos;
Specification com Spring Data;
Criteria API;
query builders;
Spring Expression Language em cenários controlados;
motores de regras;
OpenAPI para expor filtros;
testes automatizados de regras;
observabilidade de regras aplicadas.
```

A ideia agora é dominar a base em Java puro.

Depois vamos conectar isso com ferramentas reais de backend.

---

# Parte 17 — Erros comuns com Interpreter

## 1. Criar linguagem grande demais

Interpreter funciona bem para linguagens pequenas.

Se a linguagem crescer muito, talvez você precise de parser real, motor de regras ou outra solução.

---

## 2. Colocar regra essencial fora da entidade

Regra de integridade da entidade ainda pertence à entidade.

Interpreter é bom para regras configuráveis, filtros e políticas.

---

## 3. Não validar DSL

Uma expressão textual inválida deve falhar claramente.

---

## 4. Não explicar o resultado

Para regra de negócio, muitas vezes não basta retornar true/false.

Pode ser necessário explicar:

```text
por que passou?
por que falhou?
qual condição falhou?
```

---

## 5. Exagerar em abstração

Se um simples `if` resolve e a regra não muda, use o `if`.

---

# Parte 18 — Quando usar Interpreter

Use Interpreter quando:

```text
há regras combináveis;
há expressões;
há filtros dinâmicos;
há DSL pequena;
há condições configuráveis;
as regras podem ser montadas em árvore;
você precisa combinar E, OU, NÃO;
você precisa reaproveitar expressões;
você quer separar regra configurável do fluxo principal.
```

---

## Quando evitar

Evite Interpreter quando:

```text
a regra é simples e fixa;
não há linguagem ou expressão;
a equipe não precisa dessa flexibilidade;
a DSL ficaria grande demais;
um Strategy resolve melhor;
um Specification resolve melhor;
um motor de regras seria mais adequado.
```

---

# Parte 19 — Checklist para aplicar Interpreter

Pergunte:

```text
1. Existe uma linguagem ou expressão?
2. A regra pode ser quebrada em expressões menores?
3. Preciso combinar E, OU e NÃO?
4. As regras mudam por configuração?
5. O contexto está claro?
6. A DSL é pequena?
7. Os operadores são controlados?
8. O resultado precisa ser explicável?
9. Um if simples resolveria?
10. Specification ou Strategy seriam melhores?
```

---

# Parte 20 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula243.app.PedidoInterpreterApp
java -cp out br.com.curso.aula243.app.PedidoInterpreterNaoApp
java -cp out br.com.curso.aula243.app.PedidoDslInterpreterApp
java -cp out br.com.curso.aula243.app.PedidoDslEInterpreterApp
java -cp out br.com.curso.aula243.app.AtendimentoInterpreterApp
```

Depois responda:

```text
1. Qual interface representa uma expressão?
2. Quais expressões compostas foram criadas?
3. Quais expressões terminais de pedido foram criadas?
4. O que é contexto?
5. Como a regra de pedido foi composta?
6. Como o NÃO funciona?
7. O que o parser simples faz?
8. Qual regra foi aplicada no atendimento?
9. Qual diferença entre Interpreter e Strategy?
10. Quando Interpreter seria exagerado?
```

---

# Parte 21 — Exercício prático principal

## Contexto

Crie Interpreter para regras de elegibilidade de atividade.

Contexto:

```text
AtividadeContexto
```

Campos:

```text
codigo;
status;
responsavel;
diasAtraso;
clienteCorporativo;
possuiChecklistPendente;
```

---

## Expressões terminais

Crie:

```text
StatusIgualAtividadeExpressao;
ResponsavelIgualExpressao;
DiasAtrasoMaiorQueExpressao;
ClienteCorporativoAtividadeExpressao;
PossuiChecklistPendenteExpressao.
```

---

## Expressões compostas

Reutilize:

```text
EExpressao;
OuExpressao;
NaoExpressao.
```

---

## Regras

Crie no app:

## Regra 1

```text
atividade crítica =
diasAtraso maior que 2
E
(cliente corporativo OU checklist pendente)
```

## Regra 2

```text
atividade pode ser movida para fila =
status igual AGENDADA
E NÃO status igual CONCLUIDA
```

## Regra 3

```text
atividade exige atenção =
responsável igual BACKOFFICE
OU diasAtraso maior que 5
```

---

## Critérios

```text
cada expressão deve ter responsabilidade única;
contexto deve ser imutável;
regras devem ser compostas por objetos;
app deve imprimir descrição e resultado;
não colocar if gigante no app.
```

---

# Parte 22 — Desafio extra

## DSL simples para atividade

Crie um parser para expressões:

```text
STATUS_IGUAL:AGENDADA
RESPONSAVEL_IGUAL:BACKOFFICE
DIAS_ATRASO_MAIOR_QUE:2
CLIENTE_CORPORATIVO
CHECKLIST_PENDENTE
```

Depois crie parser com `E` igual fizemos em pedido:

```text
DIAS_ATRASO_MAIOR_QUE:2 E CHECKLIST_PENDENTE
```

Critérios:

```text
validar operador desconhecido;
validar valor numérico;
erro claro para expressão inválida;
app deve testar regra válida e regra inválida.
```

---

# Parte 23 — Simulado rápido

## Questão 1

Interpreter Pattern é usado principalmente para:

```text
A) representar e avaliar expressões ou linguagens simples.
B) salvar snapshot de estado.
C) controlar acesso a objeto real.
D) percorrer coleções.
```

---

## Questão 2

Uma expressão terminal é:

```text
A) uma regra simples que não depende de outras expressões.
B) uma árvore inteira sempre.
C) um controller.
D) um repository.
```

---

## Questão 3

Uma expressão composta é:

```text
A) uma expressão que combina outras expressões.
B) uma entidade JPA obrigatória.
C) uma API externa.
D) um arquivo estático.
```

---

## Questão 4

Interpreter é útil quando:

```text
A) regras podem ser combinadas como expressões.
B) existe apenas um if fixo e imutável.
C) não existe regra alguma.
D) só existe um DTO simples.
```

---

## Questão 5

Um risco de DSL é:

```text
A) aceitar entrada sem validação.
B) ter operadores controlados.
C) retornar erro claro.
D) limitar gramática.
```

---

## Questão 6

Interpreter se diferencia de Strategy porque:

```text
A) Interpreter monta expressões; Strategy troca uma política/algoritmo.
B) Strategy sempre usa DSL.
C) Interpreter sempre salva banco.
D) Não existe diferença.
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
[ ] Sei explicar Interpreter Pattern.
[ ] Sei criar interface de expressão.
[ ] Sei criar expressão terminal.
[ ] Sei criar expressão composta.
[ ] Sei combinar E, OU e NÃO.
[ ] Sei criar contexto.
[ ] Sei interpretar regra sobre contexto.
[ ] Sei criar parser simples de DSL.
[ ] Sei aplicar em pedido.
[ ] Sei aplicar em atendimento.
[ ] Sei diferenciar Interpreter de Strategy.
[ ] Sei diferenciar Interpreter de Chain.
[ ] Sei diferenciar Interpreter de Specification.
[ ] Sei entender cuidados de segurança.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Interpreter Pattern?
2. Qual problema ele resolve?
3. O que é expressão terminal?
4. O que é expressão composta?
5. O que é contexto?
6. O que é DSL?
7. Por que validar a DSL?
8. Qual diferença entre Interpreter e Strategy?
9. Qual diferença entre Interpreter e Specification?
10. Quando Interpreter seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
representar regras como objetos;
combinar regras com E, OU e NÃO;
avaliar regras contra contexto;
criar DSL simples;
criar parser básico;
aplicar em pedidos;
aplicar em atendimento;
resolver exercício de atividade;
resolver desafio de DSL de atividade.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-243-interpreter-pattern-expressoes-regras-dsl
git commit -m "Aula 243: interpreter pattern expressoes regras dsl"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Interpreter Pattern representa regras e expressões como objetos combináveis que podem ser avaliados contra um contexto.
```

Você estudou:

```text
Interpreter Pattern;
expressões terminais;
expressões compostas;
E;
OU;
NÃO;
contexto;
DSL simples;
parser básico;
regras de pedido;
regras de atendimento;
diferença para Strategy, Chain e Specification;
cuidados de segurança;
uso futuro com Spring e ferramentas reais.
```

Na próxima aula, vamos fazer:

```text
Revisão técnica dos Design Patterns aplicados ao backend.
```

A ideia será consolidar os padrões estudados, comparar quando usar cada um, evitar excesso de abstração e conectar os padrões com cenários reais de backend, ferramentas importantes e a entrada futura em Spring.
