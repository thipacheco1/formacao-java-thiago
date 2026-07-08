# 126 — M4.22 — Pacotes de domínio

## Objetivo da aula

Nesta aula você vai aprender a organizar classes Java usando pacotes.

Na aula anterior, você aprendeu a separar classes em arquivos diferentes. Agora vamos dar o próximo passo: organizar esses arquivos em pastas com significado usando `package`.

Ao final da aula, você deve conseguir:

```text
explicar o que é package;
entender a relação entre package e estrutura de pastas;
criar classes dentro de pacotes;
usar import corretamente;
compilar código com pacotes usando javac;
executar uma classe com nome qualificado;
diferenciar pacote de domínio e pacote de aplicação;
entender o problema do pacote default;
nomear pacotes em letras minúsculas;
organizar um pequeno domínio Java em pacotes;
preparar a base para arquitetura de projetos backend.
```

Essa aula é importante porque projetos Java reais não deixam todas as classes soltas na mesma pasta.

Em backend, você verá estruturas como:

```text
br.com.empresa.projeto.domain;
br.com.empresa.projeto.application;
br.com.empresa.projeto.infrastructure;
br.com.empresa.projeto.api;
```

Antes de chegar em arquitetura completa, você precisa entender o básico:

```text
package organiza classes em namespaces.
```

---

## A ideia central

Um pacote Java é um agrupamento lógico de classes.

Exemplo:

```java
package br.com.curso.aula126.dominio.pedido;
```

Essa linha diz que a classe pertence ao pacote:

```text
br.com.curso.aula126.dominio.pedido
```

O pacote ajuda a organizar e evitar conflito de nomes.

Você pode ter:

```text
br.com.loja.dominio.Cliente
br.com.banco.dominio.Cliente
```

As duas classes podem se chamar `Cliente`, mas pertencem a pacotes diferentes.

O nome completo da classe inclui o pacote.

---

## Package é namespace

Namespace é um espaço de nomes.

Sem pacote, todas as classes ficam no mesmo espaço.

Com pacote, você organiza os nomes.

Exemplo:

```text
dominio.cliente.Cliente
dominio.pedido.Pedido
dominio.produto.Produto
```

Isso ajuda a entender:

```text
onde a classe está;
qual responsabilidade ela parece ter;
que parte do sistema ela representa.
```

Em projetos grandes, pacote é indispensável.

---

## Package e pasta devem combinar

Em Java, a declaração de pacote deve combinar com a estrutura de pastas.

Se uma classe declara:

```java
package br.com.curso.aula126.dominio.cliente;
```

o arquivo deve ficar em uma pasta compatível:

```text
src/br/com/curso/aula126/dominio/cliente/Cliente.java
```

A relação é:

```text
ponto no package = separador de pasta
```

Então:

```text
br.com.curso.aula126.dominio.cliente
```

vira:

```text
br/com/curso/aula126/dominio/cliente
```

No Windows, visualmente aparece com barra invertida:

```text
br\com\curso\aula126\dominio\cliente
```

Mas o conceito é o mesmo.

---

## A linha package deve vir primeiro

Em um arquivo Java com pacote, a primeira instrução deve ser:

```java
package ...
```

Exemplo:

```java
package br.com.curso.aula126.dominio.cliente;

public class Cliente {
}
```

Apenas comentários podem vir antes.

Depois do `package`, vêm os `imports`.

Estrutura comum:

```java
package br.com.curso.aula126.dominio.pedido;

import br.com.curso.aula126.dominio.cliente.Cliente;

public class Pedido {
}
```

Ordem mental:

```text
package;
imports;
classe.
```

---

## O problema do pacote default

Quando você cria uma classe sem declarar `package`, ela fica no pacote default.

Exemplo:

```java
public class Cliente {
}
```

Sem linha de package.

Isso funciona para exemplos pequenos, mas não é recomendado em projeto real.

Problemas do pacote default:

```text
não organiza o projeto;
dificulta importação;
não escala;
não representa arquitetura;
pode gerar conflito de nomes;
não é padrão profissional.
```

Nas primeiras aulas, usamos pacote default para simplificar.

Agora vamos começar a usar pacotes.

---

## Criando a estrutura da aula

Crie a pasta principal:

```powershell
mkdir labs\m4\aula-126-pacotes-de-dominio
cd labs\m4\aula-126-pacotes-de-dominio
```

Agora crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula126
mkdir src\br\com\curso\aula126\app
mkdir src\br\com\curso\aula126\dominio
mkdir src\br\com\curso\aula126\dominio\cliente
mkdir src\br\com\curso\aula126\dominio\pedido
mkdir src\br\com\curso\aula126\dominio\valor
```

A estrutura ficará assim:

```text
aula-126-pacotes-de-dominio/
└── src/
    └── br/
        └── com/
            └── curso/
                └── aula126/
                    ├── app/
                    └── dominio/
                        ├── cliente/
                        ├── pedido/
                        └── valor/
```

---

## Primeiro exemplo com pacotes

Vamos criar um mini domínio de pedido.

Pacotes:

```text
br.com.curso.aula126.app
br.com.curso.aula126.dominio.cliente
br.com.curso.aula126.dominio.pedido
br.com.curso.aula126.dominio.valor
```

Significado:

```text
app: ponto de entrada do exemplo;
dominio.cliente: classes relacionadas a cliente;
dominio.pedido: classes relacionadas a pedido;
dominio.valor: objetos de valor compartilhados.
```

---

## Arquivo Cliente.java

Crie o arquivo:

```text
src\br\com\curso\aula126\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula126.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final boolean ativo;

    public Cliente(int id, String nome) {
        this(id, nome, true);
    }

    public Cliente(int id, String nome, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
    }

    public int id() {
        return id;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome + " | Ativo: " + ativo;
    }
}
```

Observe a primeira linha:

```java
package br.com.curso.aula126.dominio.cliente;
```

Ela precisa combinar com a pasta.

---

## Arquivo Dinheiro.java

Crie:

```text
src\br\com\curso\aula126\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula126.dominio.valor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Dinheiro {
    private final BigDecimal valor;

    private Dinheiro(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static Dinheiro de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new Dinheiro(new BigDecimal(valor));
    }

    public static Dinheiro zero() {
        return new Dinheiro(BigDecimal.ZERO);
    }

    public boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean maiorOuIgual(Dinheiro outro) {
        if (outro == null) {
            return false;
        }

        return valor.compareTo(outro.valor) >= 0;
    }

    public Dinheiro somar(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new Dinheiro(valor.add(outro.valor));
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        Dinheiro dinheiro = (Dinheiro) outro;
        return Objects.equals(valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Aqui temos imports do Java:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
```

Classes do pacote `java.lang`, como `String`, não precisam de import.

---

## Arquivo StatusPedido.java

Crie:

```text
src\br\com\curso\aula126\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula126.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Enum importante pode ficar em arquivo próprio e pacote próprio.

---

## Arquivo Pedido.java

Crie:

```text
src\br\com\curso\aula126\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula126.dominio.pedido;

import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.valor.Dinheiro;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final Dinheiro total;
    private StatusPedido status;

    public Pedido(int numero, Cliente cliente, Dinheiro total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Pedido não pode ser criado para cliente inativo.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = StatusPedido.CRIADO;
    }

    public boolean criado() {
        return status == StatusPedido.CRIADO;
    }

    public boolean pago() {
        return status == StatusPedido.PAGO;
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(total)) {
            throw new IllegalArgumentException("Valor pago não cobre o total do pedido.");
        }

        status = StatusPedido.PAGO;
    }

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (pago()) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado por este fluxo.");
        }

        status = StatusPedido.CANCELADO;
    }

    public String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + cliente.resumo()
                + " | Total: " + total
                + " | Status: " + status;
    }
}
```

Observe os imports:

```java
import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.valor.Dinheiro;
```

`Pedido` usa classes de outros pacotes.

Por isso precisa importá-las.

---

## Quando não precisa importar

No arquivo `Pedido.java`, usamos:

```java
StatusPedido
```

Mas não importamos `StatusPedido`.

Por quê?

Porque `StatusPedido` está no mesmo pacote de `Pedido`:

```java
package br.com.curso.aula126.dominio.pedido;
```

Classes do mesmo pacote não precisam de import.

Classes de outros pacotes precisam.

Regra prática:

```text
mesmo pacote: não precisa import;
outro pacote: precisa import;
java.lang: não precisa import.
```

Exemplos de `java.lang`:

```text
String;
System;
Integer;
RuntimeException;
IllegalArgumentException;
IllegalStateException.
```

---

## Arquivo PedidoApp.java

Crie:

```text
src\br\com\curso\aula126\app\PedidoApp.java
```

Código:

```java
package br.com.curso.aula126.app;

import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.pedido.Pedido;
import br.com.curso.aula126.dominio.valor.Dinheiro;

public class PedidoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        Dinheiro total = Dinheiro.de("399.80");

        Pedido pedido = new Pedido(
                1001,
                cliente,
                total
        );

        System.out.println(pedido.resumo());

        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        System.out.println(pedido.resumo());
    }
}
```

Esse arquivo pertence ao pacote:

```java
br.com.curso.aula126.app
```

Ele importa classes do domínio.

Essa separação já começa a mostrar uma ideia importante:

```text
app usa domínio;
domínio não depende de app.
```

---

## Compilando com pacotes

Agora, dentro da pasta da aula:

```text
labs\m4\aula-126-pacotes-de-dominio
```

execute:

```powershell
mkdir out
javac -d out src\br\com\curso\aula126\app\PedidoApp.java src\br\com\curso\aula126\dominio\cliente\Cliente.java src\br\com\curso\aula126\dominio\pedido\Pedido.java src\br\com\curso\aula126\dominio\pedido\StatusPedido.java src\br\com\curso\aula126\dominio\valor\Dinheiro.java
```

Depois execute:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

Vamos entender cada parte.

---

## O que significa javac -d out

O comando:

```powershell
javac -d out ...
```

significa:

```text
compile os arquivos Java e coloque os .class dentro da pasta out, respeitando os pacotes.
```

Depois da compilação, você terá algo parecido com:

```text
out/
└── br/
    └── com/
        └── curso/
            └── aula126/
                ├── app/
                │   └── PedidoApp.class
                └── dominio/
                    ├── cliente/
                    │   └── Cliente.class
                    ├── pedido/
                    │   ├── Pedido.class
                    │   └── StatusPedido.class
                    └── valor/
                        └── Dinheiro.class
```

O Java usa a estrutura de pacotes também nos arquivos compilados.

---

## O que significa java -cp out

O comando:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

tem duas partes importantes.

### -cp out

`-cp` significa classpath.

Você está dizendo:

```text
procure as classes compiladas dentro da pasta out.
```

### Nome completo da classe

Você não executa apenas:

```powershell
java PedidoApp
```

Porque a classe está em um pacote.

Você executa o nome completo:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

O nome completo inclui:

```text
pacote + nome da classe
```

---

## Nome qualificado da classe

A classe:

```java
package br.com.curso.aula126.app;

public class PedidoApp {
}
```

tem nome completo:

```text
br.com.curso.aula126.app.PedidoApp
```

Esse é o nome qualificado.

A classe:

```java
package br.com.curso.aula126.dominio.pedido;

public class Pedido {
}
```

tem nome completo:

```text
br.com.curso.aula126.dominio.pedido.Pedido
```

Quando duas classes têm o mesmo nome simples, o pacote diferencia.

---

## Compilação alternativa com todos os arquivos

Se estiver no PowerShell e quiser compilar todos os arquivos `.java` recursivamente, uma opção é:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Depois:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

Esse comando ajuda quando há muitos arquivos.

No IntelliJ, a IDE cuida dessa compilação para você.

Mas entender o `javac` ajuda a compreender o que está acontecendo por baixo.

---

## Imports explícitos

Na maioria dos casos, prefira imports explícitos:

```java
import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.pedido.Pedido;
import br.com.curso.aula126.dominio.valor.Dinheiro;
```

Evite usar import com estrela no começo da formação:

```java
import br.com.curso.aula126.dominio.pedido.*;
```

O import com `*` importa todos os tipos daquele pacote.

Ele pode ser prático, mas deixa menos explícito o que a classe usa.

Em projetos reais, a IDE geralmente organiza imports automaticamente.

Por enquanto, prefira clareza.

---

## Pacotes não importam subpacotes automaticamente

Este ponto é muito importante.

Se você importar:

```java
import br.com.curso.aula126.dominio.*;
```

isso não importa:

```text
br.com.curso.aula126.dominio.cliente.Cliente;
br.com.curso.aula126.dominio.pedido.Pedido;
br.com.curso.aula126.dominio.valor.Dinheiro.
```

Subpacotes são pacotes diferentes.

`dominio` não inclui automaticamente `dominio.cliente`.

Cada pacote precisa ser importado conforme necessário.

Regra:

```text
subpacote não é filho automático para import.
```

O nome parece hierárquico, mas para importação cada pacote é separado.

---

## Nome de pacote em letras minúsculas

Por convenção, pacotes Java usam letras minúsculas.

Bom:

```java
package br.com.curso.aula126.dominio.pedido;
```

Evite:

```java
package br.com.Curso.Aula126.Dominio.Pedido;
```

Classes usam PascalCase:

```java
Pedido
Cliente
Dinheiro
StatusPedido
```

Pacotes usam minúsculas:

```text
pedido;
cliente;
dominio;
valor;
app.
```

Isso facilita leitura e segue convenção Java.

---

## Pacote com domínio da empresa

Em projetos reais, é comum usar o domínio da empresa invertido.

Exemplo:

```text
br.com.empresa.projeto
```

Se o site da empresa fosse:

```text
empresa.com.br
```

o pacote começaria com:

```text
br.com.empresa
```

Exemplos:

```text
br.com.minhaloja.pedidos;
br.com.tempoassist.kora;
br.com.exemplo.financeiro;
```

Neste curso usamos:

```text
br.com.curso.aula126
```

porque é didático.

---

## Pacotes de domínio

Agora vamos falar da palavra "domínio".

Domínio é a área de negócio que o sistema representa.

Exemplos:

```text
pedido;
cliente;
produto;
pagamento;
ordem de serviço;
contrato;
cotação;
mensageria;
remuneração.
```

Pacotes de domínio agrupam classes que representam esses conceitos.

Exemplo:

```text
br.com.curso.aula126.dominio.pedido
```

pode conter:

```text
Pedido;
StatusPedido;
ItemPedido;
CodigoPedido.
```

Outro exemplo:

```text
br.com.curso.aula126.dominio.valor
```

pode conter objetos de valor compartilhados:

```text
Dinheiro;
Email;
Telefone;
Periodo.
```

Essa organização ajuda a separar o coração do sistema.

---

## App não deve conter regra de domínio

O pacote:

```text
br.com.curso.aula126.app
```

contém a classe que executa o exemplo.

Ele não deve concentrar regras como:

```text
validar cliente;
confirmar pedido;
calcular total;
decidir status.
```

Essas regras pertencem ao domínio.

A classe `PedidoApp` deve apenas montar o cenário e chamar métodos.

Exemplo bom:

```java
Pedido pedido = new Pedido(1001, cliente, total);
pedido.confirmarPagamento(Dinheiro.de("399.80"));
```

Exemplo ruim:

```java
if (valorPago.compareTo(total) >= 0) {
    status = "PAGO";
}
```

Regra de pedido pertence a `Pedido`.

---

## Exemplo 2 — Ordem de Serviço com pacotes

Agora vamos criar outro mini domínio para reforçar.

Crie novas pastas:

```powershell
mkdir src\br\com\curso\aula126\appos
mkdir src\br\com\curso\aula126\dominio\os
```

Vamos criar:

```text
appos.OrdemServicoApp;
dominio.os.OrdemServico;
dominio.os.CodigoOs;
dominio.os.PeriodoAtendimento;
dominio.os.StatusOs;
dominio.os.TurnoAtendimento.
```

Aqui deixaremos todas as classes de OS dentro de `dominio.os`.

---

## Arquivo CodigoOs.java

Crie:

```text
src\br\com\curso\aula126\dominio\os\CodigoOs.java
```

Código:

```java
package br.com.curso.aula126.dominio.os;

import java.util.Objects;

public final class CodigoOs {
    private static final String PREFIXO = "OS-";

    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código da OS deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    public String valor() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        CodigoOs codigoOs = (CodigoOs) outro;
        return Objects.equals(valor, codigoOs.valor);
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

## Arquivo TurnoAtendimento.java

Crie:

```text
src\br\com\curso\aula126\dominio\os\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula126.dominio.os;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

---

## Arquivo StatusOs.java

Crie:

```text
src\br\com\curso\aula126\dominio\os\StatusOs.java
```

Código:

```java
package br.com.curso.aula126.dominio.os;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

---

## Arquivo PeriodoAtendimento.java

Crie:

```text
src\br\com\curso\aula126\dominio\os\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula126.dominio.os;

import java.time.LocalDate;
import java.util.Objects;

public final class PeriodoAtendimento {
    private final LocalDate data;
    private final TurnoAtendimento turno;

    public PeriodoAtendimento(LocalDate data, TurnoAtendimento turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    public LocalDate data() {
        return data;
    }

    public TurnoAtendimento turno() {
        return turno;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        PeriodoAtendimento periodo = (PeriodoAtendimento) outro;
        return Objects.equals(data, periodo.data)
                && turno == periodo.turno;
    }

    @Override
    public int hashCode() {
        return Objects.hash(data, turno);
    }

    @Override
    public String toString() {
        return data + " - " + turno;
    }
}
```

---

## Arquivo OrdemServico.java

Crie:

```text
src\br\com\curso\aula126\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula126.dominio.os;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;

    public OrdemServico(CodigoOs codigo, String cliente, PeriodoAtendimento periodo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void reagendar(PeriodoAtendimento novoPeriodo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        periodo = novoPeriodo;
        status = StatusOs.REAGENDADA;
        quantidadeReagendamentos++;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public String resumo() {
        return "OS: " + codigo
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos;
    }
}
```

Classes do mesmo pacote `dominio.os` não precisam importar umas às outras.

`OrdemServico` usa:

```text
CodigoOs;
PeriodoAtendimento;
StatusOs.
```

Todos estão no mesmo pacote.

---

## Arquivo OrdemServicoApp.java

Crie:

```text
src\br\com\curso\aula126\appos\OrdemServicoApp.java
```

Código:

```java
package br.com.curso.aula126.appos;

import br.com.curso.aula126.dominio.os.CodigoOs;
import br.com.curso.aula126.dominio.os.OrdemServico;
import br.com.curso.aula126.dominio.os.PeriodoAtendimento;
import br.com.curso.aula126.dominio.os.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        System.out.println(os.resumo());

        os.reagendar(new PeriodoAtendimento(
                LocalDate.now().plusDays(3),
                TurnoAtendimento.TARDE
        ));

        System.out.println(os.resumo());
    }
}
```

---

## Compilando os dois exemplos

Para compilar tudo dentro de `src`, estando na pasta da aula:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute o exemplo de pedido:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

Execute o exemplo de OS:

```powershell
java -cp out br.com.curso.aula126.appos.OrdemServicoApp
```

Agora você tem dois pontos de entrada, cada um em seu pacote:

```text
br.com.curso.aula126.app.PedidoApp
br.com.curso.aula126.appos.OrdemServicoApp
```

---

## Cuidado com nomes iguais em pacotes diferentes

Você pode ter duas classes chamadas `Cliente` em pacotes diferentes:

```text
br.com.curso.aula126.dominio.cliente.Cliente
br.com.curso.aula126.integracao.Cliente
```

Mas, se uma classe precisar usar as duas ao mesmo tempo, pode ficar confuso.

Java permite importar uma e usar o nome completo da outra.

Exemplo conceitual:

```java
import br.com.curso.aula126.dominio.cliente.Cliente;

public class Exemplo {
    private Cliente clienteDominio;
    private br.com.curso.aula126.integracao.Cliente clienteIntegracao;
}
```

Isso funciona, mas pode indicar que os nomes precisam ser mais claros:

```text
ClienteDominio;
ClienteIntegracao;
ClienteResponse;
ClienteDto.
```

Mais tarde, vamos estudar DTOs e camadas.

Por enquanto, entenda que pacote evita conflito, mas bons nomes continuam importantes.

---

## Organização por tipo versus organização por domínio

Existem duas formas comuns de organizar pacotes.

### Por tipo técnico

Exemplo:

```text
model;
service;
repository;
controller;
dto;
```

### Por domínio

Exemplo:

```text
pedido;
cliente;
produto;
ordemservico;
contrato;
```

Nesta fase do curso, estamos começando por domínio porque queremos reforçar Orientação a Objetos.

Exemplo:

```text
dominio.pedido;
dominio.cliente;
dominio.os;
dominio.valor.
```

Mais adiante, quando entrarmos em backend com Spring, vamos combinar domínio, aplicação, infraestrutura e API.

Por enquanto, a mensagem principal é:

```text
pacote deve ter significado.
```

---

## Nome de pacote deve ser simples e sem acento

Evite:

```text
domínio;
ordem-serviço;
gestão;
ação;
```

Use:

```text
dominio;
ordemservico;
gestao;
acao.
```

Pacotes não devem ter acentos, espaços ou hífen.

Use nomes simples:

```text
pedido;
cliente;
produto;
contrato;
mensageria;
remuneracao;
ordemservico.
```

Em Java, hífen não é permitido em identificador de pacote.

---

## Package no IntelliJ

No IntelliJ, ao criar pacotes, você normalmente faz:

```text
src
New
Package
br.com.curso.aula126.dominio.pedido
```

A IDE cria a estrutura de pastas automaticamente.

Depois:

```text
New
Java Class
Pedido
```

A IDE coloca:

```java
package br.com.curso.aula126.dominio.pedido;
```

no topo do arquivo.

Use a IDE a seu favor.

Mas entenda o que ela faz por baixo:

```text
ela cria pastas;
ela escreve package;
ela organiza imports;
ela compila respeitando classpath.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Estrutura

Crie a estrutura de pastas da aula.

Confirme que existe:

```text
src\br\com\curso\aula126
```

Explique como essa pasta se relaciona com:

```java
package br.com.curso.aula126;
```

### Parte 2 — Pedido

Crie os arquivos:

```text
Cliente.java;
Dinheiro.java;
StatusPedido.java;
Pedido.java;
PedidoApp.java.
```

Compile:

```powershell
javac -d out src\br\com\curso\aula126\app\PedidoApp.java src\br\com\curso\aula126\dominio\cliente\Cliente.java src\br\com\curso\aula126\dominio\pedido\Pedido.java src\br\com\curso\aula126\dominio\pedido\StatusPedido.java src\br\com\curso\aula126\dominio\valor\Dinheiro.java
```

Execute:

```powershell
java -cp out br.com.curso.aula126.app.PedidoApp
```

### Parte 3 — Imports

Abra `Pedido.java`.

Explique:

```text
por que Cliente precisa de import;
por que Dinheiro precisa de import;
por que StatusPedido não precisa.
```

### Parte 4 — OS

Crie os arquivos de OS.

Compile tudo:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula126.appos.OrdemServicoApp
```

### Parte 5 — Erros controlados

Faça testes controlados:

```text
mude o package de Cliente para um pacote diferente sem mover a pasta;
tente compilar;
volte ao correto.

remova um import de Pedido;
tente compilar;
volte ao correto.

tente executar java PedidoApp;
observe que precisa do nome completo.
```

---

## Desafio prático

Crie uma nova estrutura dentro da aula:

```text
src\br\com\curso\aula126\appcontrato
src\br\com\curso\aula126\dominio\contrato
src\br\com\curso\aula126\dominio\servico
```

Modele um pequeno domínio de contrato.

Arquivos obrigatórios:

```text
appcontrato\ContratoApp.java

dominio\contrato\Contrato.java
dominio\contrato\PeriodoContrato.java
dominio\contrato\StatusContrato.java

dominio\servico\ServicoContratado.java

dominio\valor\Dinheiro.java
```

Você pode reutilizar o `Dinheiro` já criado em `dominio.valor`.

Regras:

```text
Contrato tem código.
Contrato tem serviço.
Contrato tem período.
Contrato tem status.
Contrato nasce RASCUNHO.
Contrato pode ativar.
Contrato pode cancelar.
Serviço tem nome e valor mensal.
Valor mensal precisa ser positivo.
Período tem início e fim.
Fim não pode ser anterior ao início.
StatusContrato tem RASCUNHO, ATIVO, CANCELADO.
```

Métodos esperados:

```text
contrato.ativar();
contrato.cancelar("motivo");
contrato.ativo();
contrato.resumo();
```

`ContratoApp` deve apenas montar o cenário e chamar os métodos.

Não coloque regra de domínio no `ContratoApp`.

Compile tudo com:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula126.appcontrato.ContratoApp
```

---

## Erros comuns

### 1. Declarar package diferente da pasta

Se o pacote diz uma coisa e a pasta mostra outra, você terá problemas de organização e compilação.

### 2. Esquecer package no topo

Se uma classe deveria estar em pacote, declare `package` na primeira linha útil.

### 3. Esquecer import

Classe de outro pacote precisa ser importada ou usada com nome completo.

### 4. Achar que import de pacote pai importa subpacote

Não importa. Subpacotes são independentes.

### 5. Executar sem nome qualificado

Com pacote, execute:

```powershell
java -cp out pacote.Classe
```

Não apenas:

```powershell
java Classe
```

### 6. Usar letras maiúsculas em pacote

Pacotes devem usar minúsculas.

### 7. Colocar regra de domínio em app

`app` monta o cenário. Domínio protege regra.

### 8. Criar pacote sem significado

Pacote deve ajudar a entender o sistema.

---

## Debug recomendado

Use debug no IntelliJ ou execute pelo terminal.

Pontos para observar:

```text
PedidoApp criando Cliente;
PedidoApp criando Dinheiro;
PedidoApp criando Pedido;
Pedido chamando métodos de Cliente e Dinheiro;
OrdemServicoApp criando CodigoOs;
OrdemServicoApp criando PeriodoAtendimento;
OrdemServico mudando status.
```

No IntelliJ, pratique navegação:

```text
Ctrl + clique em Cliente;
Ctrl + clique em Pedido;
Ctrl + clique em Dinheiro;
Ctrl + clique em StatusPedido;
Alt + Enter para corrigir import;
Optimize Imports.
```

O objetivo é perceber que pacotes tornam o projeto navegável.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é package em Java?
2. Qual relação entre package e pasta?
3. Por que app não deve concentrar regra de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma classe com package;
organizar pastas compatíveis com package;
usar import corretamente;
entender imports do mesmo pacote;
entender imports de pacotes diferentes;
compilar com javac -d out;
executar com java -cp out nome.qualificado.Classe;
explicar pacote default;
evitar pacote default em projeto real;
nomear pacotes em minúsculas;
organizar domínio em pacotes;
separar app de domínio;
entender que subpacotes não são importados automaticamente;
resolver o desafio de contrato com pacotes;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-126-pacotes-de-dominio
git commit -m "Aula 126: organiza dominio Java em pacotes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
package organiza classes em namespaces e conecta o código à estrutura de pastas.
```

Você aprendeu que:

```text
package deve combinar com a pasta;
a linha package vem antes dos imports;
classes de outros pacotes precisam de import;
classes do mesmo pacote não precisam;
subpacotes não são importados automaticamente;
com pacote, executamos usando nome qualificado;
app deve usar domínio, não concentrar regra de domínio.
```

Essa aula aproxima seu código de um projeto Java real.

Na próxima aula, vamos estudar modificadores de acesso.

Vamos entender melhor `public`, `private`, visibilidade de pacote e como os pacotes influenciam o que cada classe pode ou não acessar.
