# 250 — M11.06 — IDE, terminal, debugging e produtividade no Java Backend

## Objetivo da aula

Na aula anterior, você aprofundou Git profissional.

Você estudou:

```text
commits;
branches;
merge;
rebase;
pull request;
conflitos;
stash;
reset;
revert;
tags;
code review;
boas práticas;
Git em CI/CD.
```

Agora vamos aprofundar uma parte essencial da rotina profissional:

```text
IDE;
terminal;
debugging;
stack trace;
breakpoints;
execução local;
produtividade;
investigação de problemas;
rotina de desenvolvimento backend.
```

Esta aula é muito importante porque um desenvolvedor Java Backend profissional não trabalha apenas escrevendo código.

Ele precisa:

```text
abrir projeto;
entender estrutura;
rodar aplicação;
rodar testes;
debugar erro;
ler stack trace;
investigar comportamento;
usar terminal;
usar IDE com produtividade;
navegar no código;
encontrar classe;
refatorar com segurança;
validar build;
comparar alterações;
entender logs;
resolver problema local;
preparar evidência técnica.
```

Ao final desta aula, você deve conseguir:

```text
entender o papel da IDE;
entender por que terminal continua obrigatório;
organizar rotina profissional de desenvolvimento;
rodar projeto pela IDE e pelo terminal;
usar breakpoints;
usar debug step over, step into e step out;
inspecionar variáveis;
entender call stack;
ler stack trace;
investigar NullPointerException;
investigar IllegalArgumentException;
investigar erro de build;
usar logs simples;
usar atalhos de produtividade;
evitar dependência cega da IDE;
preparar base para debugging em Spring.
```

---

## Reforço do objetivo maior

Nosso objetivo é construir um curso completo de Java Backend, do básico ao nível engenheiro/arquiteto Java.

Por isso, IDE e debug não são assuntos pequenos.

Um profissional avançado precisa saber:

```text
usar ferramenta com profundidade;
não depender de tentativa e erro;
debugar com método;
entender stack trace;
entender fluxo de execução;
identificar causa raiz;
não tratar sintoma como solução;
validar comportamento com teste;
usar terminal para confirmar build;
usar logs com responsabilidade;
preparar diagnóstico técnico;
explicar problema para o time.
```

Ferramenta não substitui fundamento.

Mas ferramenta bem usada multiplica produtividade.

---

# Parte 1 — O que é uma IDE

IDE significa:

```text
Integrated Development Environment
```

Em português:

```text
Ambiente Integrado de Desenvolvimento
```

Uma IDE reúne várias funcionalidades em um lugar:

```text
editor de código;
autocomplete;
navegação entre classes;
execução de aplicação;
debug;
integração com Git;
integração com Maven/Gradle;
refatoração;
testes;
análise de código;
terminal embutido;
busca global;
inspeções;
formatação;
atalhos.
```

Exemplos de IDEs usadas com Java:

```text
IntelliJ IDEA;
Eclipse;
NetBeans;
VS Code com extensões.
```

No mercado Java, IntelliJ IDEA e Eclipse aparecem bastante.

---

## IDE em uma frase prática

```text
IDE é a ferramenta que ajuda você a escrever, navegar, executar, testar e investigar código com produtividade.
```

---

# Parte 2 — IDE não é mágica

A IDE facilita muito.

Mas por baixo ainda existe:

```text
JDK;
javac;
Maven;
Gradle;
classpath;
dependências;
Git;
JVM;
testes;
build.
```

Quando você clica em Run, a IDE monta uma execução.

Quando você clica em Test, a IDE chama o runner de teste.

Quando você clica em Build, a IDE usa seu compilador interno ou delega para Maven/Gradle.

Por isso, você precisa entender terminal e build.

---

## Regra profissional

```text
Se funciona só na IDE, ainda não está totalmente validado.
Se funciona no terminal, tem mais chance de funcionar no pipeline.
```

Pipeline não usa seu botão verde.

Pipeline roda comando.

---

# Parte 3 — Terminal continua obrigatório

Um backend profissional precisa saber usar terminal.

Comandos básicos que você precisa dominar:

```bash
java -version
javac -version
mvn -version
mvn clean test
mvn clean package
./mvnw clean package
gradle -version
./gradlew clean build
git status
git diff
git log --oneline
```

No Windows PowerShell:

```powershell
java -version
javac -version
mvn -version
mvn clean test
mvn clean package
.\mvnw.cmd clean package
gradle -version
.\gradlew build
git status
git diff
git log --oneline
```

---

## Por que terminal importa

O terminal ajuda a:

```text
confirmar ambiente;
rodar build limpo;
reproduzir erro do pipeline;
executar comandos rápidos;
validar Maven/Gradle;
diagnosticar Java usado;
rodar Git;
automatizar tarefas;
evitar dependência da IDE.
```

---

# Parte 4 — Rotina profissional ao abrir um projeto

Quando você recebe um projeto Java, não saia codando imediatamente.

Siga um diagnóstico inicial.

## Passo 1 — Leia arquivos principais

Procure:

```text
README.md;
pom.xml;
build.gradle;
settings.gradle;
Dockerfile;
docker-compose.yml;
.env.example;
application.properties;
application.yml;
docs;
scripts.
```

---

## Passo 2 — Verifique versão Java

```powershell
java -version
javac -version
```

Se for Maven:

```powershell
mvn -version
```

Se for Gradle:

```powershell
.\gradlew -version
```

---

## Passo 3 — Rode build

Maven:

```powershell
mvn clean test
```

ou:

```powershell
.\mvnw.cmd clean test
```

Gradle:

```powershell
.\gradlew clean test
```

---

## Passo 4 — Abra na IDE

Depois de validar a base, abra na IDE.

Confira:

```text
Project SDK;
Maven/Gradle importado;
JDK correto;
dependências baixadas;
testes reconhecidos;
configuração de run/debug.
```

---

## Passo 5 — Rode um teste simples

Antes de alterar:

```text
rode testes existentes;
confirme que ambiente está saudável.
```

Se o projeto já começa quebrado, você precisa registrar isso.

---

# Parte 5 — Estrutura profissional na IDE

Em um projeto Maven/Gradle, você verá:

```text
src/main/java
src/main/resources
src/test/java
src/test/resources
target ou build
pom.xml ou build.gradle
```

Na IDE, normalmente:

```text
src/main/java:
marcado como Sources Root.

src/test/java:
marcado como Test Sources Root.

resources:
marcado como Resources Root.
```

Se a IDE não reconhecer isso, o projeto pode ter sido importado errado.

---

## Sintomas de importação errada

```text
imports vermelhos;
testes não aparecem;
botão de run não aparece;
Maven/Gradle não baixa dependências;
package parece incorreto;
classes não compilam na IDE.
```

Soluções comuns:

```text
reimportar Maven/Gradle;
verificar JDK;
invalidar cache com cuidado;
abrir pasta correta do projeto;
verificar pom.xml/build.gradle.
```

---

# Parte 6 — Atalhos essenciais

Atalhos variam por IDE e sistema, mas os conceitos são os mesmos.

Você precisa dominar ações como:

```text
buscar arquivo;
buscar classe;
buscar texto global;
ir para declaração;
voltar navegação;
renomear com refactor;
extrair método;
formatar código;
otimizar imports;
rodar teste;
debugar teste;
abrir terminal;
mostrar usos;
gerar construtor/getters;
navegar para implementação;
navegar para interface.
```

---

## Produtividade real

Produtividade não é digitar rápido.

Produtividade é:

```text
encontrar rápido;
entender rápido;
alterar com segurança;
testar rápido;
debugar com método;
commitar limpo.
```

---

# Parte 7 — Refatoração pela IDE

A IDE ajuda em refatorações seguras.

Exemplos:

```text
Rename;
Extract Method;
Extract Variable;
Inline Variable;
Move Class;
Change Signature;
Safe Delete.
```

---

## Rename

Não renomeie classe/método manualmente usando buscar e substituir sem cuidado.

Use refactor rename.

A IDE atualiza referências.

Exemplo:

```text
PedidoService -> ReagendarPedidoUseCase
```

Se fizer manual, pode quebrar imports, testes e referências.

---

## Extract Method

Quando um método está grande, extraia parte dele.

Antes:

```java
public void processar() {
    validar();
    calcular();
    salvar();
    notificar();
}
```

Depois:

```java
public void processar() {
    validarEntrada();
    calcularResultado();
    salvarResultado();
    notificarInteressados();
}
```

Refatoração deve melhorar leitura.

---

# Parte 8 — Debugging

Debugging é investigação controlada do comportamento do código.

Não é ficar colocando print aleatório até funcionar.

Debug profissional envolve:

```text
hipótese;
ponto de parada;
execução controlada;
inspeção de variáveis;
call stack;
reprodução do erro;
entendimento da causa;
correção;
teste;
validação.
```

---

## Debug em uma frase prática

```text
Debug é executar o código passo a passo para entender o estado e o fluxo da aplicação.
```

---

# Parte 9 — Breakpoint

Breakpoint é um ponto onde o debugger pausa a execução.

Você coloca breakpoint em uma linha.

Quando o código chega ali, a execução para.

A partir disso, você pode:

```text
ver variáveis;
avaliar expressões;
andar linha a linha;
entrar em métodos;
sair de métodos;
ver call stack;
continuar execução.
```

---

## Quando usar breakpoint

Use em pontos estratégicos:

```text
entrada do método;
antes de uma validação;
antes de salvar;
antes de chamar integração;
antes de lançar exceção;
ponto onde valor parece errado.
```

Não coloque breakpoint em tudo.

Tenha hipótese.

---

# Parte 10 — Controles do debugger

## Resume

Continua execução até o próximo breakpoint ou fim.

---

## Step Over

Executa a linha atual sem entrar dentro dos métodos chamados.

Use quando:

```text
não quero entrar nesse método agora.
```

---

## Step Into

Entra dentro do método chamado.

Use quando:

```text
quero entender o que esse método faz.
```

---

## Step Out

Sai do método atual e volta para quem chamou.

Use quando:

```text
entrei demais e quero voltar.
```

---

## Evaluate Expression

Permite avaliar uma expressão no contexto atual.

Exemplo:

```java
pedido.status().equals("PAGO")
```

ou:

```java
cliente.getNome()
```

Use com cuidado, principalmente se expressão tem efeito colateral.

---

# Parte 11 — Call stack

Call stack mostra a cadeia de chamadas até o ponto atual.

Exemplo:

```text
PedidoController.reagendar
ReagendarPedidoUseCase.executar
ValidarStatusHandler.validar
Pedido.podeReagendar
```

Isso responde:

```text
como cheguei aqui?
quem chamou quem?
qual fluxo trouxe esse erro?
```

Call stack é fundamental para investigar backend.

---

# Parte 12 — Stack trace

Stack trace é o rastro da exceção.

Exemplo:

```text
Exception in thread "main" java.lang.IllegalArgumentException: Divisor não pode ser zero.
    at br.com.curso.Calculadora.dividir(Calculadora.java:15)
    at br.com.curso.App.main(App.java:8)
```

Leia assim:

```text
tipo da exceção;
mensagem;
linha onde estourou;
cadeia de chamadas.
```

---

## Como ler stack trace

Comece pelo topo útil.

```text
java.lang.IllegalArgumentException: Divisor não pode ser zero.
```

Tipo:

```text
IllegalArgumentException
```

Mensagem:

```text
Divisor não pode ser zero.
```

Linha:

```text
Calculadora.java:15
```

Quem chamou:

```text
App.java:8
```

---

## Não leia stack trace de baixo para cima sem critério

A parte mais útil normalmente está perto do topo, mas em frameworks grandes pode haver muitas linhas internas.

Em Spring, por exemplo, stack traces são longos.

Você precisará procurar:

```text
Caused by;
classe do seu projeto;
linha do seu código;
mensagem raiz.
```

Vamos aprofundar isso em Spring.

---

# Parte 13 — Erros comuns que debug ajuda

## NullPointerException

Ocorre quando você tenta acessar algo em uma referência nula.

Exemplo:

```java
String nome = cliente.nome();
```

Se `cliente` for `null`, estoura NullPointerException.

---

## IllegalArgumentException

Normalmente indica argumento inválido.

Exemplo:

```java
if (valor < 0) {
    throw new IllegalArgumentException("Valor não pode ser negativo.");
}
```

---

## IllegalStateException

Normalmente indica estado inválido do objeto.

Exemplo:

```java
if (!pedido.podeCancelar()) {
    throw new IllegalStateException("Pedido não pode ser cancelado neste status.");
}
```

---

## IndexOutOfBoundsException

Acesso inválido em lista.

Exemplo:

```java
lista.get(10)
```

quando a lista tem só 3 itens.

---

## ClassNotFoundException / NoClassDefFoundError

Problemas de classpath/dependência.

Debug nem sempre resolve diretamente, mas ajuda a entender contexto.

---

# Parte 14 — Laboratório de debug

Crie:

```text
labs/m11/aula-250-debugging-produtividade
```

Estrutura Maven:

```text
pom.xml
src/main/java/br/com/curso/aula250
src/test/java/br/com/curso/aula250
```

Crie `pom.xml`:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-250-debugging-produtividade</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# Parte 15 — Código do laboratório

Crie:

```text
src/main/java/br/com/curso/aula250/Pedido.java
```

Código:

```java
package br.com.curso.aula250;

import java.math.BigDecimal;
import java.util.Objects;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final String status;

    public Pedido(String codigo, String cliente, BigDecimal valor, String status) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.status = status.trim().toUpperCase();
    }

    public Pedido(String codigo, String cliente, String valor, String status) {
        this(codigo, cliente, new BigDecimal(valor), status);
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

    public String status() {
        return status;
    }

    public boolean pago() {
        return Objects.equals(status, "PAGO");
    }

    public String resumo() {
        return codigo + " | " + cliente + " | " + valor + " | " + status;
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula250/CalculadoraDesconto.java
```

Código com bug intencional:

```java
package br.com.curso.aula250;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculadoraDesconto {
    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.pago()) {
            return BigDecimal.ZERO;
        }

        if (pedido.valor().compareTo(new BigDecimal("1000.00")) >= 0) {
            return pedido.valor()
                    .multiply(new BigDecimal("0.15"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return pedido.valor()
                .multiply(new BigDecimal("0.05"))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula250/ProcessadorPedido.java
```

Código:

```java
package br.com.curso.aula250;

import java.math.BigDecimal;

public class ProcessadorPedido {
    private final CalculadoraDesconto calculadoraDesconto;

    public ProcessadorPedido(CalculadoraDesconto calculadoraDesconto) {
        if (calculadoraDesconto == null) {
            throw new IllegalArgumentException("Calculadora de desconto é obrigatória.");
        }

        this.calculadoraDesconto = calculadoraDesconto;
    }

    public BigDecimal calcularTotalFinal(Pedido pedido) {
        BigDecimal desconto = calculadoraDesconto.calcular(pedido);

        return pedido.valor().subtract(desconto);
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula250/App.java
```

Código:

```java
package br.com.curso.aula250;

public class App {
    public static void main(String[] args) {
        Pedido pedido = new Pedido("PED-001", "Ana", "1000.00", "PAGO");

        ProcessadorPedido processador = new ProcessadorPedido(new CalculadoraDesconto());

        System.out.println("Pedido: " + pedido.resumo());
        System.out.println("Total final: " + processador.calcularTotalFinal(pedido));
    }
}
```

---

# Parte 16 — Teste com expectativa de regra

Crie:

```text
src/test/java/br/com/curso/aula250/CalculadoraDescontoTest.java
```

Código:

```java
package br.com.curso.aula250;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculadoraDescontoTest {
    @Test
    void deveDarCincoPorCentoParaPedidoPagoAbaixoDeMil() {
        CalculadoraDesconto calculadora = new CalculadoraDesconto();
        Pedido pedido = new Pedido("PED-001", "Ana", "500.00", "PAGO");

        BigDecimal desconto = calculadora.calcular(pedido);

        assertEquals(new BigDecimal("25.00"), desconto);
    }

    @Test
    void deveDarDezPorCentoParaPedidoPagoAcimaOuIgualMil() {
        CalculadoraDesconto calculadora = new CalculadoraDesconto();
        Pedido pedido = new Pedido("PED-002", "Carlos", "1000.00", "PAGO");

        BigDecimal desconto = calculadora.calcular(pedido);

        assertEquals(new BigDecimal("100.00"), desconto);
    }

    @Test
    void naoDeveDarDescontoParaPedidoNaoPago() {
        CalculadoraDesconto calculadora = new CalculadoraDesconto();
        Pedido pedido = new Pedido("PED-003", "Maria", "1000.00", "PENDENTE");

        BigDecimal desconto = calculadora.calcular(pedido);

        assertEquals(BigDecimal.ZERO, desconto);
    }

    @Test
    void deveFalharQuandoPedidoForNulo() {
        CalculadoraDesconto calculadora = new CalculadoraDesconto();

        assertThrows(IllegalArgumentException.class, () -> calculadora.calcular(null));
    }
}
```

---

## Bug intencional

A regra esperada no teste é:

```text
pedido pago abaixo de 1000:
5%

pedido pago acima ou igual a 1000:
10%
```

Mas o código está usando:

```text
15%
```

para pedidos acima ou igual a 1000.

O teste deve falhar.

Esse é o cenário para debug.

---

# Parte 17 — Rodando pelo terminal

Execute:

```powershell
mvn clean test
```

Você deve ver falha no teste:

```text
deveDarDezPorCentoParaPedidoPagoAcimaOuIgualMil
```

O erro deve indicar algo como:

```text
expected: 100.00
but was: 150.00
```

---

## Como investigar

1. Abra o teste na IDE.
2. Coloque breakpoint na linha:

```java
BigDecimal desconto = calculadora.calcular(pedido);
```

3. Rode o teste em modo debug.
4. Use Step Into para entrar em `calcular`.
5. Observe `pedido.valor()`.
6. Observe a condição `compareTo`.
7. Observe o multiplicador.
8. Identifique que está `0.15`.
9. Corrija para `0.10`.
10. Rode teste de novo.

Correção:

```java
return pedido.valor()
        .multiply(new BigDecimal("0.10"))
        .setScale(2, RoundingMode.HALF_UP);
```

---

# Parte 18 — Debug com teste é mais forte

Debugando teste, você tem:

```text
cenário controlado;
entrada conhecida;
resultado esperado;
falha reproduzível;
feedback rápido.
```

Isso é melhor do que debug aleatório pela aplicação inteira.

Regra profissional:

```text
Quando possível, reproduza bug com teste.
```

Depois corrija.

Depois mantenha o teste.

---

# Parte 19 — Logs simples

Antes de usar frameworks de log, podemos entender a ideia com `System.out.println`.

Exemplo:

```java
System.out.println("Valor do pedido: " + pedido.valor());
System.out.println("Status do pedido: " + pedido.status());
```

Mas em backend profissional, não devemos espalhar prints aleatórios.

Futuramente vamos usar:

```text
SLF4J;
Logback;
níveis de log;
correlation id;
logs estruturados;
observabilidade.
```

Agora, entenda a diferença:

```text
debug:
investigação local passo a passo.

log:
registro da execução para acompanhar comportamento.
```

---

# Parte 20 — Níveis de log

Mesmo antes de implementar, você precisa conhecer os níveis:

```text
TRACE;
DEBUG;
INFO;
WARN;
ERROR.
```

Uso típico:

```text
TRACE:
detalhe extremo.

DEBUG:
diagnóstico técnico.

INFO:
eventos importantes normais.

WARN:
algo inesperado, mas aplicação continua.

ERROR:
falha que precisa atenção.
```

Em produção, normalmente não se deixa tudo em DEBUG sem motivo.

---

# Parte 21 — Stack trace na prática

Crie teste:

```text
src/test/java/br/com/curso/aula250/ProcessadorPedidoTest.java
```

Código:

```java
package br.com.curso.aula250;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class ProcessadorPedidoTest {
    @Test
    void deveFalharQuandoPedidoForNulo() {
        ProcessadorPedido processador = new ProcessadorPedido(new CalculadoraDesconto());

        assertThrows(IllegalArgumentException.class, () -> processador.calcularTotalFinal(null));
    }
}
```

Esse teste deve passar porque a calculadora valida pedido nulo.

Agora altere temporariamente `CalculadoraDesconto` removendo a validação de nulo.

O erro pode virar `NullPointerException`.

Você verá stack trace.

Objetivo:

```text
entender a linha exata;
entender quem chamou;
corrigir a validação.
```

Depois restaure a validação.

---

# Parte 22 — Debug de NullPointerException

Quando aparecer:

```text
NullPointerException
```

Pergunte:

```text
qual variável está null?
por que ela chegou null?
deveria ser permitida?
devo validar antes?
devo corrigir origem?
devo ajustar contrato?
```

Não resolva automaticamente com:

```java
if (x != null)
```

sem entender.

Às vezes, `null` é sintoma de erro anterior.

---

# Parte 23 — Debug de regra de negócio

Nem todo bug é exceção.

Muitos bugs são resultado errado.

Exemplo:

```text
desconto errado;
status errado;
fila errada;
data errada;
total errado;
mensagem disparada indevidamente;
validação deixando passar;
validação bloqueando indevidamente.
```

Para investigar:

```text
reproduza cenário;
identifique entrada;
identifique resultado esperado;
identifique resultado atual;
debugue ponto de decisão;
compare regra com implementação;
corrija;
crie teste.
```

---

# Parte 24 — Debug de build

Nem todo problema está no código Java.

Pode estar no build.

Exemplos:

```text
Maven usando JDK errado;
Gradle usando JDK errado;
dependência faltando;
teste falhando;
plugin incompatível;
classe duplicada;
target/build sujo;
cache quebrado.
```

Método:

```text
leia erro;
identifique ferramenta;
rode comando limpo;
verifique versão Java;
verifique dependências;
verifique alteração recente;
compare com pipeline.
```

---

# Parte 25 — Rotina profissional de investigação

Use este roteiro:

```text
1. Qual é o problema?
2. Como reproduzir?
3. Qual era o esperado?
4. Qual foi o obtido?
5. O erro é de compilação, teste, execução ou regra?
6. Existe stack trace?
7. Qual primeira linha do meu código envolvida?
8. Existe teste cobrindo?
9. O problema é entrada inválida, regra errada ou estado inconsistente?
10. Qual correção mínima e segura?
11. Qual teste comprova?
12. O build passa?
13. O commit está limpo?
```

---

# Parte 26 — Debug remoto

Em backend real, existe debug remoto.

Exemplo conceitual:

```text
aplicação roda em uma porta de debug;
IDE conecta nessa porta;
você debuga processo externo.
```

Comando conceitual:

```bash
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar app.jar
```

Não vamos praticar agora.

Mas isso será importante em aplicações maiores, containers e Spring.

Cuidado:

```text
debug remoto em produção é sensível;
pode impactar segurança e performance;
deve seguir política da empresa.
```

---

# Parte 27 — Produtividade com busca

Em projeto grande, você precisa encontrar coisas rápido.

Tipos de busca:

```text
buscar classe;
buscar arquivo;
buscar símbolo;
buscar texto global;
buscar uso de método;
buscar implementação;
buscar por endpoint;
buscar por mensagem de erro;
buscar por nome de tabela;
buscar por código de status.
```

---

## Estratégias

Se você tem uma mensagem de erro:

```text
"Data de agendamento inválida"
```

Busque texto global.

Se você tem endpoint:

```text
/reagendar
```

Busque o path.

Se você tem classe:

```text
ReagendarOrdemServicoUseCase
```

Busque classe.

Se você tem método:

```text
calcularTotalFinal
```

Busque usos.

---

# Parte 28 — Produtividade com navegação

Ações essenciais:

```text
ir para declaração;
ir para implementação;
ver hierarquia;
ver usos;
voltar para local anterior;
abrir arquivo recente;
ir para teste;
ir para classe relacionada.
```

Isso é essencial quando entrarmos em Spring, porque o fluxo terá:

```text
Controller;
DTO;
UseCase;
Service;
Repository;
Entity;
Mapper;
Client;
Configuration;
Test.
```

Sem navegação boa, você se perde.

---

# Parte 29 — Produtividade com testes

IDE permite rodar:

```text
um teste;
uma classe de teste;
todos os testes de um pacote;
todos os testes do projeto;
debug de um teste.
```

Rotina boa:

```text
rode o teste específico enquanto desenvolve;
rode suíte maior antes do commit;
rode build pelo terminal antes do push.
```

---

# Parte 30 — Produtividade com Git na IDE

IDE ajuda a:

```text
ver arquivos alterados;
ver diff;
fazer commit;
resolver conflito visualmente;
ver histórico de arquivo;
comparar branches;
fazer annotate/blame;
criar changelist.
```

Mas você também deve saber comandos Git.

A IDE ajuda.

O terminal confirma.

---

# Parte 31 — Debug e arquitetura

Boa arquitetura facilita debug.

Código ruim:

```text
service gigante;
método enorme;
muitos efeitos colaterais;
dependências escondidas;
estado global;
nomes ruins;
regra espalhada;
acoplamento forte.
```

Código bom:

```text
métodos pequenos;
responsabilidades claras;
use case coordenando;
entidade protegendo regra;
repositories isolados;
clients isolados;
testes claros;
exceções com mensagem útil.
```

Arquitetura boa reduz tempo de investigação.

---

# Parte 32 — Exceções com mensagem útil

Ruim:

```java
throw new RuntimeException("Erro");
```

Melhor:

```java
throw new IllegalArgumentException("Data de agendamento não pode ser anterior à data atual.");
```

Mensagem boa ajuda:

```text
usuário;
QA;
desenvolvedor;
log;
suporte;
debug.
```

---

# Parte 33 — Não engolir exceção

Ruim:

```java
try {
    processar();
} catch (Exception e) {
}
```

Isso esconde erro.

Também ruim:

```java
try {
    processar();
} catch (Exception e) {
    System.out.println("deu erro");
}
```

Melhor:

```java
try {
    processar();
} catch (RuntimeException e) {
    throw e;
}
```

Ou tratar de verdade.

Em backend real, vamos estudar:

```text
tratamento global de exceções;
status HTTP;
logs;
erros de domínio;
erros de validação;
respostas padronizadas.
```

---

# Parte 34 — Debug com dados sensíveis

Cuidado ao inspecionar ou logar:

```text
senha;
token;
CPF;
cartão;
dados pessoais;
chave de API;
segredo;
cookie;
authorization header.
```

Em empresa, logar dado sensível pode gerar incidente.

Regra:

```text
debug local com responsabilidade;
log de produção com mais responsabilidade ainda.
```

---

# Parte 35 — Checklist antes de pedir ajuda

Antes de chamar alguém, tenha informações.

```text
qual comando rodei?
qual erro apareceu?
qual stack trace?
qual linha do meu código?
qual versão Java?
qual branch?
qual commit?
o erro acontece sempre?
como reproduzir?
o que eu já tentei?
tem teste falhando?
tem print/log?
```

Isso mostra maturidade profissional.

---

# Parte 36 — Como pedir ajuda bem

Ruim:

```text
não funciona
```

Melhor:

```text
Ao rodar `mvn clean test` na branch `feature/desconto`, o teste `CalculadoraDescontoTest.deveDarDezPorCento...` falha. 
Esperado era 100.00, retornou 150.00. 
Debuguei e vi que o multiplicador está 0.15 em `CalculadoraDesconto.java:18`. 
A regra do card diz 10%. Posso ajustar para 0.10 e manter o teste?
```

Isso é profissional.

---

# Parte 37 — Laboratório: diário de debug

Crie:

```text
DIARIO_DEBUG.md
```

Preencha:

```md
# Diário de Debug — Aula 250

## Problema 1

### Sintoma

### Como reproduzir

### Resultado esperado

### Resultado obtido

### Breakpoint usado

### Variáveis analisadas

### Causa raiz

### Correção

### Teste que comprova

### Comando final executado
```

Isso treina investigação.

---

# Parte 38 — Comandos úteis da aula

Maven:

```powershell
mvn clean test
mvn test -Dtest=CalculadoraDescontoTest
mvn clean package
```

Git:

```powershell
git status
git diff
git add .
git commit -m "Aula 250: debugging e produtividade Java backend"
```

Java:

```powershell
java -version
javac -version
```

---

# Parte 39 — Como isso prepara Spring

Em Spring, você vai precisar debugar:

```text
controller recebendo request;
DTO sendo desserializado;
Bean Validation;
service/use case;
repository;
transação;
JPA;
queries;
exceptions;
mappers;
clients HTTP;
configurações;
profiles;
security;
filtros;
interceptors;
eventos.
```

Você vai ver stack traces maiores.

Vai precisar entender:

```text
onde começa seu código;
onde termina framework;
qual bean foi chamado;
qual dependência foi injetada;
qual proxy interceptou;
qual transação abriu;
qual query executou.
```

A base desta aula será usada intensamente.

---

# Parte 40 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o papel da IDE.
[ ] Sei explicar por que terminal é obrigatório.
[ ] Sei abrir projeto Maven/Gradle com critério.
[ ] Sei validar JDK na IDE.
[ ] Sei validar build pelo terminal.
[ ] Sei usar breakpoint.
[ ] Sei usar Step Over.
[ ] Sei usar Step Into.
[ ] Sei usar Step Out.
[ ] Sei usar Evaluate Expression.
[ ] Sei ler call stack.
[ ] Sei ler stack trace.
[ ] Sei investigar NullPointerException.
[ ] Sei investigar erro de regra de negócio.
[ ] Sei rodar teste em debug.
[ ] Sei usar logs simples com cuidado.
[ ] Sei pedir ajuda de forma profissional.
[ ] Sei preparar diário de debug.
[ ] Sei conectar debugging com Spring futuro.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é uma IDE?
2. Por que terminal continua importante?
3. O que é breakpoint?
4. Qual diferença entre Step Over e Step Into?
5. Para que serve Step Out?
6. O que é call stack?
7. O que é stack trace?
8. Como investigar NullPointerException?
9. Como investigar regra de negócio errada?
10. Por que debug com teste é melhor?
11. Qual diferença entre debug e log?
12. Quais níveis de log existem?
13. Por que não engolir exceção?
14. O que verificar antes de pedir ajuda?
15. Como isso prepara Spring?
```

---

# Parte 41 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-250-debugging-produtividade
```

Com:

```text
pom.xml;
Pedido.java;
CalculadoraDesconto.java;
ProcessadorPedido.java;
App.java;
CalculadoraDescontoTest.java;
ProcessadorPedidoTest.java;
DIARIO_DEBUG.md.
```

---

## Requisitos

Você deve:

```text
rodar mvn clean test;
ver teste falhar;
debugar teste;
identificar multiplicador errado;
corrigir 0.15 para 0.10;
rodar teste novamente;
registrar no diário;
fazer commit.
```

---

## Critérios

```text
não corrigir sem entender;
usar breakpoint;
analisar variáveis;
ler stack trace quando existir;
registrar causa raiz;
manter teste;
build deve passar;
commit deve ser claro.
```

---

# Parte 42 — Desafio extra

## Criar novo bug controlado

Adicione uma regra:

```text
pedido com status CANCELADO deve lançar IllegalStateException no ProcessadorPedido.
```

Implemente primeiro o teste:

```text
ProcessadorPedidoCanceladoTest
```

Depois implemente a regra.

Critérios:

```text
teste falha antes;
teste passa depois;
mensagem da exceção deve ser clara;
debug deve confirmar fluxo;
diário deve registrar investigação.
```

---

# Parte 43 — Simulado rápido

## Questão 1

IDE serve principalmente para:

```text
A) aumentar produtividade na escrita, navegação, execução, teste e debug do código.
B) substituir completamente o conhecimento de Java.
C) eliminar necessidade de Git.
D) executar banco de dados automaticamente sempre.
```

---

## Questão 2

Terminal é importante porque:

```text
A) confirma ambiente, build e comandos reais usados em pipeline.
B) só serve para mudar cor da tela.
C) substitui todos os testes.
D) impede uso de IDE.
```

---

## Questão 3

Breakpoint é:

```text
A) ponto onde o debugger pausa a execução.
B) commit remoto.
C) dependência Maven.
D) arquivo de build.
```

---

## Questão 4

Step Into serve para:

```text
A) entrar dentro do método chamado.
B) criar branch.
C) apagar target.
D) gerar JAR.
```

---

## Questão 5

Call stack mostra:

```text
A) cadeia de chamadas até o ponto atual.
B) dependências Maven.
C) branches remotas.
D) variáveis de ambiente.
```

---

## Questão 6

Stack trace ajuda a identificar:

```text
A) tipo da exceção, mensagem e linha onde ocorreu.
B) senha do banco.
C) versão do GitHub.
D) nome do monitor.
```

---

## Questão 7

Debug com teste é bom porque:

```text
A) fornece cenário controlado e reproduzível.
B) elimina necessidade de entender a regra.
C) impede qualquer bug.
D) substitui commit.
```

---

## Questão 8

Não devemos engolir exceções porque:

```text
A) isso esconde falhas e dificulta diagnóstico.
B) deixa o código mais seguro automaticamente.
C) melhora logs sempre.
D) evita todos os testes.
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
7. A
8. A
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-250-debugging-produtividade
git commit -m "Aula 250: ide terminal debugging produtividade Java backend"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Produtividade profissional em Java Backend exige dominar IDE, terminal e debugging com método.
```

Você estudou:

```text
IDE;
terminal;
atalhos;
refatoração;
execução local;
debug;
breakpoint;
step over;
step into;
step out;
evaluate expression;
call stack;
stack trace;
NullPointerException;
IllegalArgumentException;
logs;
níveis de log;
diário de debug;
investigação profissional;
como pedir ajuda;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
JUnit 5 profissional.
```

A ideia será estudar testes unitários com profundidade: estrutura de testes, assertions, ciclo de vida, exceções, parametrização, organização, boas práticas, cobertura de regras e preparação para Mockito e testes de backend.
