# 087 — M2.26 — Organização de pacotes desde cedo

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.26.01` — Organização de pacotes desde cedo — Conceito profundo e quando usar.
- `M2.26.02` — Organização de pacotes desde cedo — Implementação guiada com código realista.
- `M2.26.03` — Organização de pacotes desde cedo — Refatoração, melhoria e leitura crítica.
- `M2.26.04` — Organização de pacotes desde cedo — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `package`, `import`, nomes, domínio, `app`, `util`, organização inicial, relação entre pacote e pasta, compilação manual com `-d`, execução com `-cp`, erros comuns, leitura crítica, refatoração e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Pré-requisito de ambiente

Esta aula não exige ferramenta nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar, valide:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK está configurado;
terminal integrado funciona;
Main.java executa.
```

A prática desta aula será feita em:

```text
labs/m2/aula-087-organizacao-pacotes-desde-cedo
```

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
083 — M2.22 — Pattern matching;
084 — M2.23 — Text blocks;
085 — M2.24 — Exceptions por baixo;
086 — M2.25 — Entrada/saída básica com console robusto;
087 — M2.26 — Organização de pacotes desde cedo.
```

Na aula anterior, trabalhamos console robusto.

Criamos muitos arquivos no mesmo contexto.

Agora vamos começar a resolver um problema que aparece naturalmente quando o código cresce:

```text
onde cada classe deve ficar?
```

Até agora, muitos exemplos podiam viver no mesmo arquivo ou na mesma pasta.

Isso foi aceitável para aprender linguagem.

Mas, a partir de agora, precisamos começar a pensar como projeto.

Projeto real não é uma pilha de classes soltas.

Projeto real tem organização.

E em Java, essa organização passa por:

```text
package;
import;
pastas;
nomes;
domínio;
app;
util;
separação de responsabilidades.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
087 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 87
Aulas oficiais restantes: 451
```

Contando o arquivo de abertura `000`, teremos:

```text
88 arquivos gerados no total.
```

Ainda estamos em Java Core, preparando base para classes, encapsulamento, organização, coleções, exceções estruturadas, Maven, testes e Spring Boot.

---

## A pergunta central da aula

Imagine que um projeto começa com:

```text
Main.java
Cliente.java
Produto.java
Pedido.java
Pagamento.java
Mensagem.java
Calculadora.java
Validador.java
Formatador.java
LeitorConsole.java
```

Tudo na mesma pasta.

No começo, parece simples.

Depois, vira confusão.

Perguntas começam a aparecer:

```text
quais classes são do domínio?
quais classes só ajudam na entrada do console?
onde fica o Main?
onde ficam utilitários?
onde ficam regras de negócio?
o que pode importar o quê?
por que a classe não compila?
por que o package não bate com a pasta?
```

A aula de hoje responde:

```text
como organizar pacotes desde cedo para não deixar o projeto virar bagunça.
```

---

## O que é package

`package` é uma declaração que informa a qual pacote uma classe pertence.

Exemplo:

```java
package br.com.formacao.dominio;

public record Cliente(String nome, String email) {
}
```

Esse código diz:

```text
a classe Cliente pertence ao pacote br.com.formacao.dominio.
```

Em Java, o pacote normalmente se reflete na estrutura de pastas.

Exemplo:

```text
src
└── br
    └── com
        └── formacao
            └── dominio
                └── Cliente.java
```

Pacote é organização lógica.

Pasta é organização física.

Em Java, as duas precisam conversar.

---

## O que é import

`import` permite usar classes de outro pacote sem escrever o nome completo toda hora.

Exemplo:

```java
import br.com.formacao.dominio.Cliente;
```

Depois disso, posso usar:

```java
Cliente cliente = new Cliente("Ana", "ana@email.com");
```

Sem import, teria que usar o nome completo:

```java
br.com.formacao.dominio.Cliente cliente =
        new br.com.formacao.dominio.Cliente("Ana", "ana@email.com");
```

Isso é válido, mas fica ruim.

`import` melhora legibilidade.

---

## Package não é import

Esses dois conceitos são diferentes.

`package` diz onde a classe está:

```java
package br.com.formacao.dominio;
```

`import` diz quais classes de outros pacotes esta classe quer usar:

```java
import br.com.formacao.dominio.Cliente;
```

Regra simples:

```text
package -> identidade da classe;
import -> dependências que a classe usa.
```

Uma classe tem no máximo uma declaração `package`.

Mas pode ter vários `import`.

---

## Ordem básica em um arquivo Java

A ordem é:

```text
package;
imports;
declaração da classe/record/enum/interface.
```

Exemplo:

```java
package br.com.formacao.app;

import br.com.formacao.dominio.Cliente;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com");

        System.out.println(cliente);
    }
}
```

Não coloque `import` antes de `package`.

Não coloque `package` no meio do arquivo.

---

## Default package

Quando uma classe não declara package, ela fica no pacote padrão, também chamado de default package.

Exemplo:

```java
public class Main {
}
```

Isso serviu bem nos exemplos iniciais.

Mas em projeto real, evite default package.

Problemas:

```text
organização fraca;
dificuldade de import;
projeto não escala;
não representa domínio;
não combina com estrutura Maven/Spring;
dificulta evolução.
```

A partir desta aula, vamos começar a preferir pacotes nomeados.

---

## Relação entre pacote e pasta

Se a classe declara:

```java
package br.com.formacao.dominio;
```

o arquivo deve ficar em:

```text
br/com/formacao/dominio
```

No Windows:

```text
br\com\formacao\dominio
```

Exemplo:

```text
src/br/com/formacao/dominio/Cliente.java
```

Se a pasta não bater com o package, a IDE pode acusar erro ou o projeto pode ficar inconsistente.

Em Java profissional:

```text
package e pasta precisam estar coerentes.
```

---

## Nome base do pacote

Em projetos reais, o pacote costuma seguir domínio reverso.

Exemplo:

```text
br.com.empresa.projeto
```

Para a formação, usaremos:

```text
br.com.formacao
```

Exemplos:

```text
br.com.formacao.app
br.com.formacao.dominio
br.com.formacao.util
br.com.formacao.console
```

Em projeto corporativo, poderia ser:

```text
br.com.empresa.mms
br.com.empresa.kora
br.com.empresa.pedidos
```

O importante é ter padrão.

---

## Pacote `app`

O pacote `app` pode guardar a entrada da aplicação.

Exemplo:

```text
br.com.formacao.app.Main
```

Classe típica:

```java
package br.com.formacao.app;

public class Main {
    public static void main(String[] args) {
    }
}
```

O `Main` é o ponto de partida.

Ele deve coordenar o fluxo inicial, mas não deve virar depósito de todas as regras.

Regra:

```text
Main inicia;
Main não deve concentrar todo o sistema.
```

---

## Pacote `dominio`

O pacote `dominio` guarda conceitos principais do problema.

Exemplos:

```text
Cliente;
Produto;
Pedido;
Pagamento;
OrdemServico;
Mensagem;
RegistroAuditoria.
```

Essas classes representam coisas importantes do negócio.

Exemplo:

```java
package br.com.formacao.dominio;

public record Cliente(String nome, String email) {
}
```

O domínio deve ter nomes que fazem sentido no problema, não nomes técnicos genéricos.

---

## Pacote `util`

O pacote `util` guarda utilitários gerais.

Exemplos:

```text
LeitorConsole;
FormatadorMoeda;
ValidadorTexto;
ConversorData.
```

Cuidado:

```text
util pode virar lixeira.
```

Não jogue qualquer coisa em `util`.

Use `util` apenas quando a classe realmente for apoio genérico e não pertencer claramente ao domínio.

Se tudo vira `util`, o pacote perdeu significado.

---

## Pacote `console`

Como estamos usando console, pode fazer sentido criar:

```text
br.com.formacao.console
```

Para classes ligadas à entrada e saída no terminal.

Exemplos:

```text
ConsoleInput;
MenuConsole;
ConsoleOutput.
```

Essa separação evita colocar leitura de teclado dentro do domínio.

Domínio deve representar regra e dados.

Console é interface com o usuário.

---

## Primeira estrutura recomendada

Para esta aula:

```text
labs/m2/aula-087-organizacao-pacotes-desde-cedo
└── src
    └── br
        └── com
            └── formacao
                ├── app
                │   └── Main.java
                ├── dominio
                │   ├── Cliente.java
                │   ├── Produto.java
                │   └── Pedido.java
                ├── console
                │   └── ConsoleInput.java
                └── util
                    └── TextoUtils.java
```

Esse desenho já mostra uma evolução:

```text
app -> entrada;
dominio -> conceitos;
console -> leitura/escrita no console;
util -> apoio genérico.
```

---

## Primeiro exemplo mínimo com pacote

Crie estrutura:

```powershell
mkdir labs\m2\aula-087-organizacao-pacotes-desde-cedo
cd labs\m2\aula-087-organizacao-pacotes-desde-cedo
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\formacao
mkdir src\br\com\formacao\app
```

Crie:

```text
src/br/com/formacao/app/Main.java
```

Código:

```java
package br.com.formacao.app;

public class Main {
    public static void main(String[] args) {
        System.out.println("Projeto com package organizado.");
    }
}
```

Compile:

```powershell
javac -d out src\br\com\formacao\app\Main.java
```

Execute:

```powershell
java -cp out br.com.formacao.app.Main
```

Saída:

```text
Projeto com package organizado.
```

---

## Entendendo `javac -d out`

Quando usamos package, o compilador precisa gerar `.class` na estrutura correta.

Comando:

```powershell
javac -d out src\br\com\formacao\app\Main.java
```

Significa:

```text
compile Main.java;
gere a saída compilada dentro da pasta out;
crie subpastas conforme o package.
```

Resultado esperado:

```text
out
└── br
    └── com
        └── formacao
            └── app
                └── Main.class
```

Isso é mais organizado que gerar `.class` solto no meio do código-fonte.

---

## Entendendo `java -cp out`

Para executar classe com package:

```powershell
java -cp out br.com.formacao.app.Main
```

Partes:

```text
java -> executa a JVM;
-cp out -> classpath aponta para a pasta onde estão os .class;
br.com.formacao.app.Main -> nome completo da classe.
```

Não execute assim:

```powershell
java Main
```

porque a classe agora não se chama apenas `Main`.

O nome completo é:

```text
br.com.formacao.app.Main
```

---

## Exemplo com domínio e import

Crie:

```text
src/br/com/formacao/dominio/Cliente.java
```

Código:

```java
package br.com.formacao.dominio;

public record Cliente(String nome, String email) {
}
```

Crie:

```text
src/br/com/formacao/app/Main.java
```

Código:

```java
package br.com.formacao.app;

import br.com.formacao.dominio.Cliente;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com");

        System.out.println(cliente);
    }
}
```

Compile:

```powershell
javac -d out src\br\com\formacao\dominio\Cliente.java src\br\com\formacao\app\Main.java
```

Execute:

```powershell
java -cp out br.com.formacao.app.Main
```

Saída:

```text
Cliente[nome=Ana, email=ana@email.com]
```

---

## Compilando vários arquivos

Quando o projeto tem muitos arquivos, escrever todos no comando é chato.

No PowerShell, podemos usar:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Esse comando encontra todos os `.java` e compila.

Use dentro da raiz da aula.

Depois execute:

```powershell
java -cp out br.com.formacao.app.Main
```

Mais tarde, Maven vai cuidar disso.

Mas agora é importante entender o processo manual.

---

## Import de classes da JDK

Você já usou imports como:

```java
import java.util.Scanner;
import java.math.BigDecimal;
import java.time.LocalDate;
```

Esses são imports de classes da biblioteca Java.

Exemplo:

```java
package br.com.formacao.console;

import java.util.Scanner;

public class ConsoleInput {
}
```

Isso mostra que imports podem vir de:

```text
classes do próprio projeto;
classes da JDK;
classes de bibliotecas externas no futuro.
```

---

## Classes do mesmo pacote não precisam de import

Se duas classes estão no mesmo pacote, não precisam importar uma à outra.

Exemplo:

```text
br.com.formacao.dominio.Cliente
br.com.formacao.dominio.Pedido
```

Dentro de `Pedido`, posso usar `Cliente` diretamente se ambos estão no pacote `dominio`.

Exemplo:

```java
package br.com.formacao.dominio;

import java.math.BigDecimal;

public record Pedido(String codigo, Cliente cliente, BigDecimal total) {
}
```

`Cliente` não precisou de import.

`BigDecimal` precisou porque está em outro pacote.

---

## Import wildcard

É possível usar:

```java
import java.util.*;
```

Isso importa várias classes de um pacote.

Mas prefira imports explícitos:

```java
import java.util.Scanner;
import java.util.List;
```

Por quê?

```text
fica mais claro o que a classe usa;
evita ambiguidade;
melhora leitura;
facilita revisão.
```

A IDE pode organizar imports automaticamente.

Mas entenda a diferença.

---

## Static import

Existe também `static import`.

Exemplo:

```java
import static java.math.BigDecimal.ZERO;
```

Depois:

```java
valor.compareTo(ZERO)
```

Nesta fase, use pouco.

Static import pode melhorar legibilidade em alguns casos, mas pode esconder origem dos métodos/constantes se usado demais.

Para esta aula, foque em import comum.

---

## Exemplo com util

Crie:

```text
src/br/com/formacao/util/TextoUtils.java
```

Código:

```java
package br.com.formacao.util;

public class TextoUtils {
    private TextoUtils() {
    }

    public static boolean emBranco(String valor) {
        return valor == null || valor.isBlank();
    }

    public static String normalizar(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim();
    }
}
```

Crie:

```text
src/br/com/formacao/app/Main.java
```

Código:

```java
package br.com.formacao.app;

import br.com.formacao.util.TextoUtils;

public class Main {
    public static void main(String[] args) {
        String nome = "   Ana   ";

        String normalizado = TextoUtils.normalizar(nome);

        System.out.println(normalizado);
        System.out.println(TextoUtils.emBranco(normalizado));
    }
}
```

Compile todos:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.formacao.app.Main
```

Saída:

```text
Ana
false
```

---

## Cuidado com utilitário demais

O pacote `util` pode ajudar.

Mas também pode virar bagunça.

Ruim:

```text
util
├── ClienteUtil.java
├── PedidoCoisas.java
├── Tudo.java
├── Geral.java
├── Funcoes.java
└── Auxiliar.java
```

Nomes ruins:

```text
Utils;
Helper;
Coisas;
Geral;
Auxiliar;
Funcoes.
```

Nomes melhores:

```text
TextoUtils;
MoedaUtils;
DataUtils;
ConsoleInput;
ValidadorCpf;
FormatadorResumo.
```

Mesmo em utilitários, nome importa.

---

## Exemplo com console separado

Crie:

```text
src/br/com/formacao/console/ConsoleInput.java
```

Código:

```java
package br.com.formacao.console;

import java.util.Scanner;

public class ConsoleInput {
    private final Scanner scanner;

    public ConsoleInput(Scanner scanner) {
        this.scanner = scanner;
    }

    public String lerTextoObrigatorio(String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public int lerInteiro(String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}
```

Agora `Main` fica mais limpo.

```java
package br.com.formacao.app;

import br.com.formacao.console.ConsoleInput;
import br.com.formacao.dominio.Cliente;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ConsoleInput input = new ConsoleInput(scanner);

        String nome = input.lerTextoObrigatorio("Nome: ");
        String email = input.lerTextoObrigatorio("E-mail: ");
        int idade = input.lerInteiro("Idade: ");

        Cliente cliente = new Cliente(nome, email, idade);

        System.out.println(cliente);
    }
}
```

Atualize `Cliente`:

```java
package br.com.formacao.dominio;

public record Cliente(String nome, String email, int idade) {
}
```

---

## Exemplo com produto

Crie:

```text
src/br/com/formacao/dominio/Produto.java
```

Código:

```java
package br.com.formacao.dominio;

import java.math.BigDecimal;

public record Produto(String nome, BigDecimal preco) {
}
```

Crie um exemplo em `Main` ou outra classe:

```java
package br.com.formacao.app;

import br.com.formacao.dominio.Produto;

import java.math.BigDecimal;

public class ProdutoApp {
    public static void main(String[] args) {
        Produto produto = new Produto("Cadeira", new BigDecimal("199.90"));

        System.out.println(produto);
    }
}
```

Execute:

```powershell
java -cp out br.com.formacao.app.ProdutoApp
```

Isso mostra que um pacote pode ter mais de uma classe executável.

Mas em projeto real, normalmente existe um ponto principal mais claro.

---

## Exemplo com pedido usando cliente e produto

Crie:

```text
src/br/com/formacao/dominio/Pedido.java
```

Código:

```java
package br.com.formacao.dominio;

import java.math.BigDecimal;

public record Pedido(String codigo, Cliente cliente, Produto produto, int quantidade) {
    public BigDecimal total() {
        return produto.preco().multiply(BigDecimal.valueOf(quantidade));
    }
}
```

Aqui `Cliente` e `Produto` estão no mesmo pacote.

Por isso, não precisam de import.

`BigDecimal` está em outro pacote.

Por isso, precisa de import.

---

## Exemplo com pagamento

Crie:

```text
src/br/com/formacao/dominio/FormaPagamento.java
```

Código:

```java
package br.com.formacao.dominio;

public enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}
```

Crie:

```text
src/br/com/formacao/dominio/Pagamento.java
```

Código:

```java
package br.com.formacao.dominio;

import java.math.BigDecimal;

public record Pagamento(String codigo, BigDecimal valor, FormaPagamento forma) {
}
```

Todos esses tipos fazem parte do domínio.

Então ficam juntos em:

```text
br.com.formacao.dominio
```

---

## Exemplo com OS

Crie:

```text
src/br/com/formacao/dominio/StatusOs.java
```

Código:

```java
package br.com.formacao.dominio;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src/br/com/formacao/dominio/OrdemServico.java
```

Código:

```java
package br.com.formacao.dominio;

import java.time.LocalDate;

public record OrdemServico(String certificado, LocalDate dataAgendamento, StatusOs status) {
}
```

`StatusOs` está no mesmo pacote.

`LocalDate` precisa de import.

---

## Exemplo com mensageria

Crie:

```text
src/br/com/formacao/dominio/TipoMensagem.java
```

Código:

```java
package br.com.formacao.dominio;

public enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}
```

Crie:

```text
src/br/com/formacao/dominio/Mensagem.java
```

Código:

```java
package br.com.formacao.dominio;

public record Mensagem(String cliente, String certificado, TipoMensagem tipo) {
}
```

Aqui fica claro:

```text
Mensagem é conceito do domínio;
TipoMensagem também.
```

---

## Exemplo com auditoria

Crie:

```text
src/br/com/formacao/dominio/RegistroAuditoria.java
```

Código:

```java
package br.com.formacao.dominio;

import java.time.Instant;

public record RegistroAuditoria(
        String usuario,
        String operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
}
```

Auditoria também pode estar no domínio nesta fase.

Em projeto maior, talvez ganhe pacote próprio.

Mas agora o objetivo é não complicar cedo demais.

---

## Aplicação final: Main organizado

Crie:

```text
src/br/com/formacao/app/Main.java
```

Código:

```java
package br.com.formacao.app;

import br.com.formacao.dominio.Cliente;
import br.com.formacao.dominio.FormaPagamento;
import br.com.formacao.dominio.Pagamento;
import br.com.formacao.dominio.Produto;

import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com", 30);
        Produto produto = new Produto("Cadeira", new BigDecimal("199.90"));
        Pagamento pagamento = new Pagamento("PAG-001", produto.preco(), FormaPagamento.PIX);

        System.out.println(cliente);
        System.out.println(produto);
        System.out.println(pagamento);
    }
}
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.formacao.app.Main
```

---

## Como o IntelliJ ajuda

No IntelliJ, quando você cria package corretamente, ele ajuda com:

```text
criação de pasta;
declaração package;
imports automáticos;
organização de imports;
movimentação de classes;
refatoração de nome;
detecção de package errado;
atalho para criar classe no pacote.
```

Mas não dependa cegamente.

Entenda:

```text
se o package é br.com.formacao.dominio,
a classe deve ficar nessa estrutura.
```

A IDE ajuda.

O conceito é seu.

---

## Refatoração: tudo no mesmo pacote para pacotes separados

Antes:

```text
src
├── Main.java
├── Cliente.java
├── Produto.java
├── Pagamento.java
├── TextoUtils.java
└── ConsoleInput.java
```

Depois:

```text
src/br/com/formacao
├── app/Main.java
├── dominio/Cliente.java
├── dominio/Produto.java
├── dominio/Pagamento.java
├── util/TextoUtils.java
└── console/ConsoleInput.java
```

Ganho:

```text
mais legibilidade;
mais intenção;
mais facilidade de encontrar classes;
menos bagunça;
preparação para Maven e Spring;
base para arquitetura.
```

---

## Refatoração: nomes genéricos

Antes:

```text
Coisas.java
Auxiliar.java
Funcoes.java
Classe1.java
Teste.java
```

Depois:

```text
ConsoleInput.java
TextoUtils.java
Cliente.java
Pedido.java
Pagamento.java
```

Nome bom reduz comentário desnecessário.

Se a classe tem nome claro, o projeto fica mais fácil de navegar.

---

## Quando criar pacote novo

Crie pacote novo quando:

```text
há um grupo claro de classes com responsabilidade parecida;
o pacote melhora navegação;
o nome do pacote comunica intenção;
as classes cresceram o suficiente;
há separação real de domínio, app, console ou util;
a organização evita mistura indevida.
```

Não crie pacote novo para cada classe sem necessidade.

Pacote demais também atrapalha.

---

## Quando não criar pacote novo

Evite pacote novo quando:

```text
só há uma classe isolada sem motivo;
o nome do pacote seria genérico demais;
você está antecipando arquitetura que ainda não existe;
o projeto é muito pequeno e didático;
a separação não melhora leitura;
o pacote vira lixeira.
```

Exemplo ruim:

```text
br.com.formacao.coisas
br.com.formacao.diversos
br.com.formacao.outros
br.com.formacao.testes1
```

Pacote deve comunicar.

---

## Pacotes iniciais recomendados para o curso

Nesta fase, bons pacotes são:

```text
br.com.formacao.app
br.com.formacao.dominio
br.com.formacao.console
br.com.formacao.util
```

Mais tarde, quando entrarmos em projetos maiores, veremos pacotes como:

```text
controller;
service;
repository;
dto;
mapper;
config;
exception;
validation;
client;
security;
```

Mas não antecipe agora.

Arquitetura deve crescer com necessidade.

---

## Erros comuns

### Erro 1 — Package não bate com pasta

Classe declara:

```java
package br.com.formacao.dominio;
```

mas está em:

```text
src/br/com/formacao/app
```

Isso gera confusão.

---

### Erro 2 — Esquecer package

Classe nova fica no default package sem querer.

---

### Erro 3 — Import errado

Importar classe de pacote errado ou classe antiga.

---

### Erro 4 — Tentar importar classe do default package

Classes em pacote nomeado não conseguem importar corretamente classes do default package.

Por isso, evite default package.

---

### Erro 5 — Criar pacote `util` para tudo

`util` vira lixeira.

---

### Erro 6 — Nome de pacote com maiúscula

Pacotes normalmente usam minúsculas.

Prefira:

```text
br.com.formacao.dominio
```

e não:

```text
br.com.Formacao.Dominio
```

---

### Erro 7 — Nome de pacote com acento

Evite.

---

### Erro 8 — Compilar sem `-d`

Pode gerar `.class` em local confuso.

---

### Erro 9 — Executar sem nome completo da classe

Errado:

```powershell
java Main
```

quando a classe tem package.

Correto:

```powershell
java -cp out br.com.formacao.app.Main
```

---

### Erro 10 — Organizar demais cedo demais

Criar arquitetura gigante antes da hora atrapalha aprendizado.

---

## Diagnóstico de pacotes

Quando algo não compilar, pergunte:

### 1. O package bate com a pasta?

Compare:

```java
package br.com.formacao.dominio;
```

com:

```text
src/br/com/formacao/dominio
```

### 2. O import está correto?

Verifique se a classe importada existe no pacote informado.

### 3. A classe está no default package?

Se estiver, mova para pacote nomeado.

### 4. O arquivo foi compilado junto?

Se `Main` usa `Cliente`, ambos precisam ser compilados.

### 5. O `javac -d out` foi usado?

Sem `-d`, a saída pode ficar ruim.

### 6. O `java -cp out` aponta para a pasta correta?

Classpath precisa apontar para a raiz dos `.class`.

### 7. O nome completo da classe foi usado?

Use:

```text
br.com.formacao.app.Main
```

### 8. A IDE marcou source root corretamente?

Se estiver no IntelliJ, confira a pasta `src`.

### 9. O nome do arquivo bate com a classe pública?

`Cliente.java` deve conter `public class Cliente` ou `public record Cliente`.

### 10. Há classe duplicada com mesmo nome?

Cuidado com cópias antigas.

---

## Debug recomendado

Use debug em:

```text
br.com.formacao.app.Main
```

Código:

```java
package br.com.formacao.app;

import br.com.formacao.dominio.Cliente;

public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com", 30);

        System.out.println(cliente);
    }
}
```

Coloque breakpoint em:

```java
Cliente cliente = new Cliente("Ana", "ana@email.com", 30);
```

Observe:

```text
classe Main está em app;
classe Cliente está em dominio;
import conecta os pacotes;
objeto é criado normalmente;
package não muda a lógica do objeto;
package muda organização e identidade da classe.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — package errado

Coloque:

```java
package br.com.formacao.dominio;
```

em arquivo dentro de:

```text
src/br/com/formacao/app
```

Observe erro da IDE.

---

### Teste 2 — remover import

Remova:

```java
import br.com.formacao.dominio.Cliente;
```

e tente usar `Cliente`.

Explique o erro.

---

### Teste 3 — executar errado

Compile com package e tente:

```powershell
java Main
```

Depois execute corretamente:

```powershell
java -cp out br.com.formacao.app.Main
```

Explique a diferença.

---

### Teste 4 — classe no default package

Crie uma classe sem package e tente usar a partir de pacote nomeado.

Explique por que é ruim.

---

### Teste 5 — util virando lixeira

Crie várias classes genéricas em `util`.

Depois renomeie e separe melhor.

Explique a melhoria.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-087-organizacao-pacotes-desde-cedo
cd labs\m2\aula-087-organizacao-pacotes-desde-cedo
```

Crie estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\formacao
mkdir src\br\com\formacao\app
mkdir src\br\com\formacao\dominio
mkdir src\br\com\formacao\console
mkdir src\br\com\formacao\util
```

Crie arquivos:

```text
src/br/com/formacao/app/Main.java
src/br/com/formacao/app/ProdutoApp.java
src/br/com/formacao/dominio/Cliente.java
src/br/com/formacao/dominio/Produto.java
src/br/com/formacao/dominio/Pedido.java
src/br/com/formacao/dominio/FormaPagamento.java
src/br/com/formacao/dominio/Pagamento.java
src/br/com/formacao/dominio/StatusOs.java
src/br/com/formacao/dominio/OrdemServico.java
src/br/com/formacao/dominio/TipoMensagem.java
src/br/com/formacao/dominio/Mensagem.java
src/br/com/formacao/dominio/RegistroAuditoria.java
src/br/com/formacao/console/ConsoleInput.java
src/br/com/formacao/util/TextoUtils.java
README.md
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.formacao.app.Main
java -cp out br.com.formacao.app.ProdutoApp
```

Arquivos de erro ou leitura crítica:

```text
ErroPackagePastaDiferente.java
ErroSemImport.java
ErroDefaultPackage.java
ErroExecutarSemNomeCompleto.java
ErroUtilGenericoDemais.java
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 087 — Organização de pacotes desde cedo

## Objetivo

Aprender a organizar classes Java usando `package`, `import`, nomes claros, pacotes de domínio, app, console e util.

## Conceitos

- `package` define a identidade da classe.
- `import` permite usar classes de outros pacotes.
- A pasta deve bater com o package.
- Evitar default package em projeto real.
- Pacotes usam nomes minúsculos.
- `app` guarda entrada da aplicação.
- `dominio` guarda conceitos do problema.
- `console` guarda leitura/escrita no terminal.
- `util` guarda apoio genérico, mas não deve virar lixeira.
- Compilar com package exige atenção à saída.
- Executar classe com package exige nome completo.

## Comandos

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.formacao.app.Main
```

## Estrutura

```text
src/br/com/formacao
├── app
├── dominio
├── console
└── util
```

## Observações

- Não deixar tudo no mesmo pacote.
- Não criar pacote demais sem necessidade.
- Não usar default package.
- Não usar nomes genéricos.
- Não deixar util virar depósito de qualquer coisa.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar por pacotes |
| Criar classe | menu New / Class | Criar no pacote certo |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Organizar imports | ação Optimize Imports | Remover imports não usados |
| Renomear | `Shift + F6` | Renomear classe/pacote com segurança |
| Mover classe | Refactor / Move | Mover pacote mantendo package |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Debug | `Shift + F9` | Validar fluxo entre pacotes |
| Compilar manual | `javac -d out ...` | Gerar `.class` organizado |
| Executar manual | `java -cp out pacote.Classe` | Rodar classe com package |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 087 — Organização de pacotes desde cedo

### O que aprendi
Aprendi que `package` define a identidade da classe e deve bater com a estrutura de pastas. Também aprendi que `import` permite usar classes de outros pacotes e que organizar cedo ajuda a evitar bagunça quando o projeto cresce.

### O que pratiquei
Criei pacotes `app`, `dominio`, `console` e `util`. Compilei com `javac -d out`, executei com `java -cp out br.com.formacao.app.Main`, usei imports entre pacotes e refatorei classes soltas para uma estrutura mais profissional.

### Conceitos principais
- package
- import
- default package
- estrutura de pastas
- domínio
- app
- util
- console
- classpath
- javac -d
- java -cp
- nome completo da classe
- source root
- imports explícitos
- organização de projeto
- nomes claros
- refatoração

### Arquivos criados
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/app/Main.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/app/ProdutoApp.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/Cliente.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/Produto.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/Pedido.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/FormaPagamento.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/Pagamento.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/StatusOs.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/OrdemServico.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/TipoMensagem.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/Mensagem.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/dominio/RegistroAuditoria.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/console/ConsoleInput.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/src/br/com/formacao/util/TextoUtils.java`
- `labs/m2/aula-087-organizacao-pacotes-desde-cedo/README.md`

### Comandos usados
```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.formacao.app.Main
java -cp out br.com.formacao.app.ProdutoApp
```

### Erros que quero evitar
- package diferente da pasta;
- classe sem package;
- default package em projeto real;
- import errado;
- import wildcard sem necessidade;
- pacote com maiúscula;
- pacote com acento;
- util virando lixeira;
- compilar sem `-d`;
- executar sem nome completo da classe.

### Próximo passo
Estudar leitura de documentação oficial.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m2/aula-087-organizacao-pacotes-desde-cedo docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 087: pratica organizacao de pacotes em Java"
```

Valide:

```bash
git status
```

Se `.class` ou `out/` aparecerem, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é package?
2. O que é import?
3. Qual a diferença entre package e import?
4. Qual deve ser a ordem básica de um arquivo Java?
5. O que é default package?
6. Por que evitar default package?
7. Como package se relaciona com pasta?
8. Qual pacote base usamos na formação?
9. Para que serve o pacote app?
10. Para que serve o pacote dominio?
11. Para que serve o pacote util?
12. Por que util pode virar problema?
13. Para que serve o pacote console?
14. Quando uma classe precisa de import?
15. Quando uma classe não precisa de import?
16. O que é import wildcard?
17. Por que preferir import explícito?
18. Para que serve javac -d out?
19. Para que serve java -cp out?
20. Por que executar com nome completo da classe?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar package;
explicar import;
diferenciar package e import;
criar estrutura de pastas coerente;
usar pacote br.com.formacao;
criar pacote app;
criar pacote dominio;
criar pacote console;
criar pacote util;
evitar default package;
criar Cliente em dominio;
criar Produto em dominio;
criar Pedido em dominio;
criar Pagamento em dominio;
criar OrdemServico em dominio;
criar Mensagem em dominio;
criar RegistroAuditoria em dominio;
criar ConsoleInput em console;
criar TextoUtils em util;
importar classes entre pacotes;
compilar com javac -d out;
executar com java -cp out nome.completo.Classe;
diagnosticar package diferente da pasta;
diagnosticar import errado;
diagnosticar execução sem nome completo;
refatorar classes soltas para pacotes;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar Maven profundamente.

Não precisa ainda criar arquitetura em camadas.

Não precisa ainda usar Spring Boot.

Não precisa ainda criar `controller`, `service` e `repository`.

Não precisa ainda entender módulos Java.

Não precisa ainda dominar visibilidade entre pacotes profundamente.

Esses assuntos virão depois.

O objetivo é parar de deixar tudo solto e começar a pensar em organização Java de forma profissional.

---

## Fechamento da aula

Hoje estudamos organização de pacotes desde cedo.

A ideia central foi:

```text
pacotes ajudam o projeto a crescer sem virar bagunça.
```

Vimos que:

```text
package define a identidade da classe;
import permite usar classes de outros pacotes;
package deve bater com a estrutura de pastas;
default package deve ser evitado;
app pode guardar a entrada da aplicação;
dominio guarda conceitos do problema;
console guarda leitura e saída do terminal;
util guarda apoio genérico com cuidado;
javac -d organiza saída compilada;
java -cp executa usando classpath;
classe com package deve ser executada pelo nome completo.
```

O ponto mais importante é:

```text
organização não é enfeite; organização reduz erro e melhora leitura.
```

Na próxima aula, vamos estudar:

```text
Leitura de documentação oficial.
```

A próxima aula vai explicar como ler JavaDoc, assinatura de método, parâmetros, retorno, exceções, exemplos e como transformar documentação oficial em prática real.
