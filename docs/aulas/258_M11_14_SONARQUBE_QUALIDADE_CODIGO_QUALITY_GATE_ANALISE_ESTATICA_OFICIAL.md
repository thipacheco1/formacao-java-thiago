# 258 — M11.14 — SonarQube: qualidade de código, análise estática, quality gate e rotina profissional

## Objetivo da aula

Na aula anterior, você aprofundou JaCoCo.

Você estudou:

```text
cobertura de testes;
line coverage;
branch coverage;
method coverage;
jacoco-maven-plugin;
relatório HTML;
target/site/jacoco/index.html;
limites mínimos;
mvn clean test;
mvn clean verify;
coverage on new code;
qualidade além de número;
antipadrões de cobertura.
```

Agora vamos estudar uma ferramenta muito comum em ambientes Java profissionais:

```text
SonarQube
```

SonarQube é usado para análise estática de código, qualidade, segurança, cobertura, duplicação e controle de qualidade em pipelines.

Esta aula é importante porque um desenvolvedor Java Backend profissional não deve depender apenas de:

```text
compilar;
rodar teste;
subir aplicação;
funcionou na minha máquina.
```

Em projetos reais, o código também passa por verificações como:

```text
bugs potenciais;
vulnerabilidades;
security hotspots;
code smells;
duplicação;
complexidade;
cobertura;
linhas não testadas;
regras de qualidade;
quality gate;
análise por pull request;
análise de código novo.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é SonarQube;
entender análise estática;
entender quality gate;
entender bugs;
entender vulnerabilities;
entender security hotspots;
entender code smells;
entender duplicação;
entender maintainability;
entender reliability;
entender security;
entender coverage dentro do Sonar;
entender duplicated lines;
entender new code;
entender technical debt;
entender severity;
entender issue lifecycle;
configurar análise básica em projeto Maven;
enviar relatório JaCoCo para análise;
entender como Sonar entra no CI/CD;
ler problemas com maturidade;
evitar corrigir só para calar ferramenta;
usar Sonar como apoio de engenharia.
```

---

## Reforço do objetivo maior

Nosso objetivo é formar uma trilha completa de Java Backend, do nível básico ao nível engenheiro/arquiteto Java.

Por isso, SonarQube não será tratado apenas como uma tela bonita de porcentagem.

Um profissional avançado precisa entender:

```text
qualidade de código;
manutenibilidade;
risco técnico;
dívida técnica;
segurança;
confiabilidade;
code review automatizado;
métricas;
limites;
governança;
pipeline;
quality gate;
código novo;
legado;
evolução gradual;
decisão técnica.
```

Ferramentas como SonarQube não substituem conhecimento.

Elas ajudam a enxergar problemas.

Quem decide com maturidade é o engenheiro.

---

# Parte 1 — O que é SonarQube

SonarQube é uma plataforma de análise de qualidade de código.

Ele analisa código fonte e gera informações sobre:

```text
bugs;
vulnerabilidades;
security hotspots;
code smells;
duplicação;
complexidade;
cobertura de testes;
linhas não cobertas;
qualidade do código novo;
dívida técnica;
quality gate.
```

Em projetos Java, SonarQube normalmente é integrado com:

```text
Maven;
Gradle;
JaCoCo;
JUnit;
CI/CD;
GitHub;
GitLab;
Azure DevOps;
Jenkins.
```

---

## SonarQube em uma frase prática

```text
SonarQube analisa o código e ajuda o time a controlar qualidade, segurança, cobertura e manutenibilidade ao longo do tempo.
```

---

# Parte 2 — O que é análise estática

Análise estática é analisar o código sem executar a aplicação.

Ou seja, o Sonar olha o código fonte e procura padrões.

Exemplos:

```text
possível NullPointerException;
condição sempre verdadeira;
catch genérico demais;
variável não usada;
duplicação;
método complexo;
senha hardcoded;
código morto;
uso perigoso de API;
teste sem assert;
método grande demais;
classe com responsabilidade demais.
```

---

## Análise estática vs teste

Teste executa código.

Análise estática lê código.

Comparação:

```text
Teste:
valida comportamento em execução.

Análise estática:
detecta problemas estruturais, riscos e más práticas sem executar.
```

Os dois se complementam.

---

# Parte 3 — O que SonarQube não faz

SonarQube não garante que o sistema está correto.

Ele não sabe completamente a regra de negócio.

Exemplo:

```java
public BigDecimal desconto() {
    return new BigDecimal("50.00");
}
```

Sonar pode não saber se o desconto correto deveria ser `100.00`.

Quem valida regra é teste.

Sonar ajuda em qualidade técnica.

---

## Regra profissional

```text
Sonar não substitui teste.
Teste não substitui análise estática.
Code review não substitui os dois.
Tudo se complementa.
```

---

# Parte 4 — Principais dimensões do Sonar

Sonar costuma organizar qualidade em dimensões como:

```text
Reliability;
Security;
Maintainability;
Coverage;
Duplications.
```

Vamos entender.

---

## Reliability

Relacionada a bugs e confiabilidade.

Pergunta:

```text
o código pode falhar em produção por um erro detectável?
```

Exemplos:

```text
possível NullPointerException;
condição incorreta;
uso errado de equals;
recurso não fechado;
erro lógico comum;
código inalcançável.
```

---

## Security

Relacionada a vulnerabilidades.

Pergunta:

```text
o código tem risco de segurança?
```

Exemplos:

```text
senha hardcoded;
uso inseguro de criptografia;
SQL injection;
exposição de dados sensíveis;
configuração insegura;
logs com informações sensíveis.
```

---

## Maintainability

Relacionada a code smells e manutenção.

Pergunta:

```text
o código é fácil de entender, alterar e manter?
```

Exemplos:

```text
método grande;
classe complexa;
duplicação;
muitos ifs;
nomes ruins;
código morto;
muita complexidade ciclomática;
comentário enganoso;
repetição desnecessária.
```

---

## Coverage

Relacionada à cobertura de testes.

Pergunta:

```text
quanto do código foi exercitado por testes?
```

Normalmente Sonar recebe dados do JaCoCo.

---

## Duplications

Relacionada a código duplicado.

Pergunta:

```text
há blocos repetidos que aumentam custo de manutenção?
```

Duplicação pode indicar necessidade de:

```text
extrair método;
extrair classe;
criar strategy;
reutilizar regra;
melhorar design.
```

Mas cuidado: nem toda duplicação pequena precisa virar abstração.

---

# Parte 5 — Bugs

No Sonar, bug é uma issue que pode representar comportamento incorreto.

Exemplos didáticos:

```java
if (nome == "") {
    return true;
}
```

Em Java, comparar String com `==` normalmente é erro.

Melhor:

```java
if ("".equals(nome)) {
    return true;
}
```

Ou:

```java
if (nome.isEmpty()) {
    return true;
}
```

---

## Outro exemplo

```java
Optional<String> nome = Optional.empty();

return nome.get();
```

Isso pode lançar exceção.

Melhor:

```java
return nome.orElse("N/A");
```

ou tratar adequadamente.

---

# Parte 6 — Vulnerabilities

Vulnerabilidade é um problema de segurança mais direto.

Exemplo didático:

```java
String senha = "admin123";
```

Problema:

```text
credencial hardcoded.
```

Outro exemplo conceitual:

```text
montar SQL concatenando entrada do usuário.
```

Risco:

```text
SQL injection.
```

Em backend profissional, segurança precisa ser tratada com muita seriedade.

---

# Parte 7 — Security Hotspots

Security hotspot não significa necessariamente vulnerabilidade confirmada.

Significa:

```text
ponto sensível que precisa de revisão humana.
```

Exemplo:

```text
uso de criptografia;
configuração de CORS;
desabilitar validação SSL;
manipulação de token;
uso de dados sensíveis;
headers de segurança.
```

O Sonar aponta:

```text
revise isso.
```

O desenvolvedor avalia se está seguro ou não.

---

## Diferença

```text
Vulnerability:
problema de segurança mais direto.

Security Hotspot:
ponto que exige revisão de segurança.
```

---

# Parte 8 — Code Smells

Code smell é um cheiro de problema.

Não é necessariamente bug.

Mas indica que o código pode ser difícil de manter.

Exemplos:

```text
método longo;
classe longa;
parâmetros demais;
duplicação;
complexidade alta;
comentário desnecessário;
nome ruim;
método que faz mais de uma coisa;
if aninhado demais.
```

---

## Code smell em uma frase prática

```text
Code smell é um sinal de que o código pode estar mais difícil de manter do que deveria.
```

---

# Parte 9 — Technical Debt

Dívida técnica é o custo futuro de manter ou corrigir algo que foi feito de forma menos ideal.

Sonar pode estimar tempo de dívida, por exemplo:

```text
15min;
30min;
2h;
1d.
```

Não trate esse número como verdade absoluta.

Ele é uma estimativa.

Mas ajuda a visualizar acúmulo de problemas.

---

## Dívida técnica saudável vs perigosa

Dívida pode ser consciente:

```text
precisamos entregar hotfix hoje;
vamos registrar débito e corrigir amanhã.
```

Perigosa:

```text
ninguém registra;
ninguém corrige;
vira padrão;
o sistema degrada.
```

---

# Parte 10 — Severity

Issues podem ter severidade.

Exemplos de níveis conceituais:

```text
Blocker;
Critical;
Major;
Minor;
Info.
```

A nomenclatura pode variar conforme versão/configuração, mas a ideia é:

```text
problemas mais graves exigem prioridade maior.
```

---

## Como priorizar

Priorize:

```text
segurança;
bugs reais;
falhas em código crítico;
issues em código novo;
duplicações que afetam manutenção;
complexidade em regras sensíveis.
```

Não gaste energia infinita em issue irrelevante enquanto bug crítico está aberto.

---

# Parte 11 — Quality Gate

Quality Gate é um conjunto de regras que decide se o projeto passou ou falhou na análise.

Exemplos de condições:

```text
cobertura no código novo >= 80%;
duplicação no código novo <= 3%;
nenhuma vulnerabilidade nova;
nenhum bug novo crítico;
maintainability rating aceitável;
security rating aceitável.
```

Se o projeto não atende, o Quality Gate falha.

Em pipeline, isso pode bloquear merge/deploy.

---

## Quality Gate em uma frase prática

```text
Quality Gate é a régua mínima de qualidade que o código precisa cumprir para ser aceito.
```

---

# Parte 12 — Código novo vs código legado

Um conceito muito importante:

```text
new code
```

Código novo é aquilo que foi alterado recentemente ou no PR.

Em projetos legados, exigir qualidade perfeita no projeto inteiro pode ser inviável.

Uma estratégia melhor:

```text
não piorar a base;
código novo deve nascer melhor;
legado melhora aos poucos.
```

---

## Exemplo

Projeto legado:

```text
cobertura total: 25%;
coverage on new code: 85%;
duplicação total: alta;
duplicação no código novo: baixa.
```

Quality Gate pode focar no código novo.

Isso é mais justo e eficiente.

---

# Parte 13 — Sonar e JaCoCo

Sonar não mede cobertura Java sozinho do mesmo jeito que JaCoCo mede.

Normalmente o fluxo é:

```text
JUnit executa testes;
JaCoCo coleta cobertura;
JaCoCo gera relatório XML;
Sonar lê o XML;
Sonar exibe cobertura.
```

Fluxo Maven:

```text
mvn clean verify
  -> testes rodam
  -> JaCoCo gera jacoco.xml
  -> sonar scanner envia análise
  -> Sonar exibe cobertura
```

---

## Arquivo importante

O relatório XML costuma ficar em:

```text
target/site/jacoco/jacoco.xml
```

Esse arquivo é usado por Sonar.

---

# Parte 14 — Configuração Maven com JaCoCo e Sonar

Em projeto Maven, você normalmente configura JaCoCo no `pom.xml`.

Exemplo:

```xml
<properties>
    <sonar.coverage.jacoco.xmlReportPaths>
        target/site/jacoco/jacoco.xml
    </sonar.coverage.jacoco.xmlReportPaths>
</properties>
```

Ou passa por linha de comando:

```powershell
mvn clean verify sonar:sonar -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

Em empresa, muitas configurações ficam no pipeline.

---

# Parte 15 — Rodando análise Sonar com Maven

Com Maven, o comando conceitual é:

```powershell
mvn clean verify sonar:sonar
```

Normalmente você precisa informar:

```text
sonar.projectKey;
sonar.host.url;
sonar.token.
```

Exemplo didático:

```powershell
mvn clean verify sonar:sonar ^
  -Dsonar.projectKey=aula-258-sonarqube ^
  -Dsonar.host.url=http://localhost:9000 ^
  -Dsonar.token=SEU_TOKEN
```

No PowerShell, o caractere de quebra pode variar. Você pode usar em uma linha:

```powershell
mvn clean verify sonar:sonar -Dsonar.projectKey=aula-258-sonarqube -Dsonar.host.url=http://localhost:9000 -Dsonar.token=SEU_TOKEN
```

---

## Segurança do token

Nunca commite token.

Não coloque token real no `pom.xml`.

Use:

```text
variável de ambiente;
secret do pipeline;
configuração segura da ferramenta de CI/CD.
```

---

# Parte 16 — Sonar local com Docker

Em laboratório, muitas pessoas usam SonarQube local via Docker.

Exemplo didático:

```powershell
docker run --name sonarqube-local -p 9000:9000 sonarqube:community
```

Depois acesse:

```text
http://localhost:9000
```

A imagem/tag pode variar conforme ambiente e política do time.

Em empresa, normalmente Sonar fica em servidor próprio ou serviço gerenciado.

---

## Observação

SonarQube pode precisar de recursos mínimos de memória e configuração do Docker.

Se falhar ao subir, o problema pode estar em:

```text
memória disponível;
porta ocupada;
permissões;
configuração do Docker;
versão da imagem;
restrições do sistema operacional.
```

---

# Parte 17 — Estrutura do laboratório

Crie:

```powershell
mkdir labs\m11\aula-258-sonarqube-qualidade-codigo
cd labs\m11\aula-258-sonarqube-qualidade-codigo

mkdir src\main\java\br\com\curso\aula258
mkdir src\main\java\br\com\curso\aula258\domain
mkdir src\main\java\br\com\curso\aula258\application
mkdir src\main\java\br\com\curso\aula258\application\service

mkdir src\test\java\br\com\curso\aula258
mkdir src\test\java\br\com\curso\aula258\domain
mkdir src\test\java\br\com\curso\aula258\application
mkdir src\test\java\br\com\curso\aula258\application\service
```

Crie:

```text
pom.xml
```

Conteúdo:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-258-sonarqube-qualidade-codigo</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <jacoco.version>0.8.12</jacoco.version>

        <sonar.projectKey>aula-258-sonarqube-qualidade-codigo</sonar.projectKey>
        <sonar.projectName>Aula 258 - SonarQube Qualidade Codigo</sonar.projectName>
        <sonar.coverage.jacoco.xmlReportPaths>target/site/jacoco/jacoco.xml</sonar.coverage.jacoco.xmlReportPaths>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>${assertj.version}</version>
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

            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>${jacoco.version}</version>
                <executions>
                    <execution>
                        <id>prepare-agent</id>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>

                    <execution>
                        <id>report</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# Parte 18 — Código com qualidade intencional

Crie:

```text
src/main/java/br/com/curso/aula258/domain/TipoCliente.java
```

Código:

```java
package br.com.curso.aula258.domain;

public enum TipoCliente {
    COMUM,
    VIP,
    CORPORATIVO
}
```

Crie:

```text
src/main/java/br/com/curso/aula258/domain/Pedido.java
```

Código:

```java
package br.com.curso.aula258.domain;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final BigDecimal valor;
    private final TipoCliente tipoCliente;

    public Pedido(String codigo, BigDecimal valor, TipoCliente tipoCliente) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (tipoCliente == null) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.valor = valor;
        this.tipoCliente = tipoCliente;
    }

    public Pedido(String codigo, String valor, TipoCliente tipoCliente) {
        this(codigo, new BigDecimal(valor), tipoCliente);
    }

    public String codigo() {
        return codigo;
    }

    public BigDecimal valor() {
        return valor;
    }

    public TipoCliente tipoCliente() {
        return tipoCliente;
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula258/application/service/ClassificadorRiscoPedidoService.java
```

Código:

```java
package br.com.curso.aula258.application.service;

import br.com.curso.aula258.domain.Pedido;
import br.com.curso.aula258.domain.TipoCliente;

import java.math.BigDecimal;

public class ClassificadorRiscoPedidoService {
    public String classificar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.tipoCliente() == TipoCliente.CORPORATIVO && pedido.valor().compareTo(new BigDecimal("5000.00")) >= 0) {
            return "RISCO_ALTO_CORPORATIVO";
        }

        if (pedido.tipoCliente() == TipoCliente.VIP && pedido.valor().compareTo(new BigDecimal("3000.00")) >= 0) {
            return "RISCO_ALTO_VIP";
        }

        if (pedido.valor().compareTo(new BigDecimal("1000.00")) >= 0) {
            return "RISCO_MEDIO";
        }

        return "RISCO_BAIXO";
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula258/application/service/GeradorMensagemPedidoService.java
```

Código:

```java
package br.com.curso.aula258.application.service;

import br.com.curso.aula258.domain.Pedido;

public class GeradorMensagemPedidoService {
    public String gerarMensagemAprovacao(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return "Pedido " + pedido.codigo() + " aprovado com valor " + pedido.valor() + ".";
    }

    public String gerarMensagemRecusa(Pedido pedido, String motivo) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        return "Pedido " + pedido.codigo() + " recusado. Motivo: " + motivo.trim();
    }
}
```

---

# Parte 19 — Testes para gerar cobertura

Crie:

```text
src/test/java/br/com/curso/aula258/domain/PedidoTest.java
```

Código:

```java
package br.com.curso.aula258.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Pedido")
class PedidoTest {
    @Test
    @DisplayName("deve criar pedido válido")
    void deveCriarPedidoValido() {
        Pedido pedido = new Pedido(" ped-001 ", "100.00", TipoCliente.VIP);

        assertThat(pedido.codigo()).isEqualTo("PED-001");
        assertThat(pedido.valor()).isEqualByComparingTo("100.00");
        assertThat(pedido.tipoCliente()).isEqualTo(TipoCliente.VIP);
    }

    @Test
    @DisplayName("não deve criar pedido sem código")
    void naoDeveCriarPedidoSemCodigo() {
        assertThatThrownBy(() -> new Pedido(" ", "100.00", TipoCliente.COMUM))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Código é obrigatório.");
    }

    @Test
    @DisplayName("não deve criar pedido com valor inválido")
    void naoDeveCriarPedidoComValorInvalido() {
        assertThatThrownBy(() -> new Pedido("PED-001", BigDecimal.ZERO, TipoCliente.COMUM))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Valor deve ser maior que zero.");
    }

    @Test
    @DisplayName("não deve criar pedido sem tipo de cliente")
    void naoDeveCriarPedidoSemTipoCliente() {
        assertThatThrownBy(() -> new Pedido("PED-001", "100.00", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Tipo de cliente é obrigatório.");
    }
}
```

Crie:

```text
src/test/java/br/com/curso/aula258/application/service/ClassificadorRiscoPedidoServiceTest.java
```

Código:

```java
package br.com.curso.aula258.application.service;

import br.com.curso.aula258.domain.Pedido;
import br.com.curso.aula258.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("ClassificadorRiscoPedidoService")
class ClassificadorRiscoPedidoServiceTest {
    private final ClassificadorRiscoPedidoService service = new ClassificadorRiscoPedidoService();

    @Test
    @DisplayName("deve classificar risco alto corporativo")
    void deveClassificarRiscoAltoCorporativo() {
        Pedido pedido = new Pedido("PED-001", "5000.00", TipoCliente.CORPORATIVO);

        String risco = service.classificar(pedido);

        assertThat(risco).isEqualTo("RISCO_ALTO_CORPORATIVO");
    }

    @Test
    @DisplayName("deve classificar risco alto VIP")
    void deveClassificarRiscoAltoVip() {
        Pedido pedido = new Pedido("PED-001", "3000.00", TipoCliente.VIP);

        String risco = service.classificar(pedido);

        assertThat(risco).isEqualTo("RISCO_ALTO_VIP");
    }

    @Test
    @DisplayName("deve classificar risco médio")
    void deveClassificarRiscoMedio() {
        Pedido pedido = new Pedido("PED-001", "1000.00", TipoCliente.COMUM);

        String risco = service.classificar(pedido);

        assertThat(risco).isEqualTo("RISCO_MEDIO");
    }

    @Test
    @DisplayName("deve classificar risco baixo")
    void deveClassificarRiscoBaixo() {
        Pedido pedido = new Pedido("PED-001", "999.99", TipoCliente.COMUM);

        String risco = service.classificar(pedido);

        assertThat(risco).isEqualTo("RISCO_BAIXO");
    }

    @Test
    @DisplayName("não deve classificar pedido nulo")
    void naoDeveClassificarPedidoNulo() {
        assertThatThrownBy(() -> service.classificar(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Pedido é obrigatório.");
    }
}
```

Crie:

```text
src/test/java/br/com/curso/aula258/application/service/GeradorMensagemPedidoServiceTest.java
```

Código:

```java
package br.com.curso.aula258.application.service;

import br.com.curso.aula258.domain.Pedido;
import br.com.curso.aula258.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("GeradorMensagemPedidoService")
class GeradorMensagemPedidoServiceTest {
    private final GeradorMensagemPedidoService service = new GeradorMensagemPedidoService();

    @Test
    @DisplayName("deve gerar mensagem de aprovação")
    void deveGerarMensagemDeAprovacao() {
        Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

        String mensagem = service.gerarMensagemAprovacao(pedido);

        assertThat(mensagem).isEqualTo("Pedido PED-001 aprovado com valor 100.00.");
    }

    @Test
    @DisplayName("deve gerar mensagem de recusa")
    void deveGerarMensagemDeRecusa() {
        Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

        String mensagem = service.gerarMensagemRecusa(pedido, "limite excedido");

        assertThat(mensagem).isEqualTo("Pedido PED-001 recusado. Motivo: limite excedido");
    }

    @Test
    @DisplayName("não deve gerar mensagem de aprovação com pedido nulo")
    void naoDeveGerarMensagemDeAprovacaoComPedidoNulo() {
        assertThatThrownBy(() -> service.gerarMensagemAprovacao(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Pedido é obrigatório.");
    }

    @Test
    @DisplayName("não deve gerar mensagem de recusa com motivo vazio")
    void naoDeveGerarMensagemDeRecusaComMotivoVazio() {
        Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

        assertThatThrownBy(() -> service.gerarMensagemRecusa(pedido, " "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Motivo é obrigatório.");
    }
}
```

---

# Parte 20 — Executando testes e análise local

Primeiro rode:

```powershell
mvn clean verify
```

Isso deve:

```text
compilar;
rodar testes;
gerar relatório JaCoCo XML;
preparar dados para Sonar.
```

Depois, com Sonar rodando localmente:

```powershell
mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=SEU_TOKEN
```

Ou tudo junto:

```powershell
mvn clean verify sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=SEU_TOKEN
```

---

# Parte 21 — Lendo o dashboard do Sonar

Ao abrir o projeto no Sonar, observe:

```text
Quality Gate;
Bugs;
Vulnerabilities;
Security Hotspots;
Code Smells;
Coverage;
Duplications;
Lines of Code;
Maintainability;
Reliability;
Security.
```

Não olhe só coverage.

Olhe o conjunto.

---

## Ordem prática de análise

Uma ordem razoável:

```text
1. Quality Gate passou?
2. Há vulnerabilities?
3. Há bugs?
4. Há security hotspots pendentes?
5. Há code smells em código novo?
6. Cobertura do código novo está adequada?
7. Duplicação do código novo está aceitável?
8. Alguma issue é falso positivo?
9. Alguma issue precisa de refactor?
10. Alguma issue exige decisão do time?
```

---

# Parte 22 — Como lidar com issues

Ao encontrar uma issue:

```text
leia a regra;
entenda o motivo;
veja o trecho de código;
avalie impacto;
corrija se fizer sentido;
marque falso positivo somente com justificativa;
não ignore issue crítica;
não faça gambiarra para calar ferramenta.
```

---

## Correção ruim

```text
alterar código sem entender só para sumir issue.
```

## Correção boa

```text
entender a regra, corrigir o problema real e manter teste se a regra for importante.
```

---

# Parte 23 — Exemplo de code smell e refatoração

Código ruim:

```java
public String classificar(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido é obrigatório.");
    } else {
        if (pedido.tipoCliente() == TipoCliente.CORPORATIVO) {
            if (pedido.valor().compareTo(new BigDecimal("5000.00")) >= 0) {
                return "RISCO_ALTO_CORPORATIVO";
            }
        }
    }

    return "RISCO_BAIXO";
}
```

Problemas:

```text
else desnecessário;
if aninhado;
leitura pior.
```

Melhor:

```java
public String classificar(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido é obrigatório.");
    }

    if (pedido.tipoCliente() == TipoCliente.CORPORATIVO
            && pedido.valor().compareTo(new BigDecimal("5000.00")) >= 0) {
        return "RISCO_ALTO_CORPORATIVO";
    }

    return "RISCO_BAIXO";
}
```

---

# Parte 24 — Duplicação nem sempre é simples

Sonar pode apontar duplicação.

Exemplo:

```text
dois testes parecidos;
dois DTOs parecidos;
dois mapeamentos parecidos;
duas regras parecidas.
```

Antes de extrair abstração, pergunte:

```text
essa duplicação representa o mesmo conceito?
ou apenas coincidência estrutural?
as duas partes mudam juntas?
a abstração deixaria o código mais claro?
```

Duplicação ruim deve ser reduzida.

Mas abstração errada também cria problema.

---

# Parte 25 — Quality Gate no pipeline

Em CI/CD, o fluxo pode ser:

```text
dev abre PR;
pipeline roda testes;
JaCoCo gera coverage;
Sonar analisa;
Quality Gate avalia;
se falhar, PR fica bloqueado;
dev corrige;
pipeline passa;
review aprova;
merge.
```

Isso automatiza uma parte da governança técnica.

---

## Exemplo de comando em pipeline

Exemplo conceitual:

```bash
mvn clean verify sonar:sonar   -Dsonar.projectKey=meu-projeto   -Dsonar.host.url=$SONAR_HOST_URL   -Dsonar.token=$SONAR_TOKEN
```

Token deve vir de secret.

Nunca do código.

---

# Parte 26 — Arquivo sonar-project.properties

Projetos que não usam Maven ou querem configurar separadamente podem usar:

```text
sonar-project.properties
```

Exemplo conceitual:

```properties
sonar.projectKey=aula-258-sonarqube
sonar.projectName=Aula 258 SonarQube
sonar.sources=src/main/java
sonar.tests=src/test/java
sonar.java.binaries=target/classes
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

Em Maven, muitas informações já vêm do `pom.xml`.

---

# Parte 27 — Sonar e arquitetura

Sonar ajuda a detectar sinais de arquitetura ruim, mas não entende tudo.

Ele pode apontar:

```text
complexidade alta;
duplicação;
método grande;
classe grande;
acoplamento;
código morto;
muitos parâmetros.
```

Mas ele não sabe, sozinho:

```text
se sua entidade está protegendo a regra;
se seu use case está coordenando corretamente;
se seu repository está vazando regra;
se seu controller está com regra demais;
se seu client está bem isolado.
```

Isso exige conhecimento arquitetural.

---

## Frase arquitetural aplicada

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Sonar pode apontar sintomas.

Você precisa interpretar a causa.

---

# Parte 28 — Sonar e Java Backend profissional

Em uma rotina real, você pode ver comentários como:

```text
Quality Gate falhou.
Coverage on new code está abaixo.
Tem code smell novo.
Tem duplicação no PR.
Tem vulnerability.
Tem hotspot para revisar.
Sonar marcou bug.
A issue é falso positivo?
Precisamos ajustar o teste para cobrir branch.
```

Um profissional backend precisa saber responder tecnicamente.

---

# Parte 29 — Como responder a uma issue Sonar em PR

Resposta ruim:

```text
Sonar está chato.
```

Resposta boa:

```text
O Sonar apontou complexidade alta no método de classificação. Refatorei extraindo as regras para métodos privados com nomes claros e mantive os testes cobrindo os cenários.
```

Ou:

```text
O Sonar marcou este hotspot por uso de configuração de CORS. Revisei a regra e mantive restrição apenas para os domínios permitidos. Não é falso positivo.
```

Ou:

```text
A issue é falso positivo porque a entrada já foi sanitizada no validador X antes deste ponto. Registrei a justificativa no Sonar e adicionei teste cobrindo o fluxo.
```

---

# Parte 30 — Laboratório: relatório de análise

Crie:

```text
RELATORIO_SONARQUBE.md
```

Modelo:

```md
# Relatório SonarQube — Aula 258

## Comandos executados

`mvn clean verify`

`mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=***`

## Projeto

- Key:
- Name:

## Quality Gate

- Status:
- Condições avaliadas:

## Coverage

- Linha:
- Branch:
- Código novo:

## Issues

### Bugs

### Vulnerabilities

### Security Hotspots

### Code Smells

### Duplications

## Pontos corrigidos

## Pontos mantidos com justificativa

## Falsos positivos

## Aprendizados

## Decisões técnicas
```

---

# Parte 31 — Boas práticas com SonarQube

Use boas práticas:

```text
não commitar token;
não ignorar vulnerability;
não ignorar bug crítico;
não corrigir issue sem entender;
não perseguir métrica vazia;
não excluir pacote sem justificativa;
focar em código novo;
usar Quality Gate no pipeline;
usar JaCoCo XML para coverage;
corrigir code smells que atrapalham manutenção;
revisar security hotspots com seriedade;
discutir falso positivo com justificativa;
não substituir code review humano pelo Sonar;
não substituir testes pelo Sonar.
```

---

# Parte 32 — Antipadrões

## 1. Corrigir para calar ferramenta

Problema:

```text
muda código sem entender regra.
```

Risco:

```text
pode introduzir bug.
```

---

## 2. Marcar tudo como falso positivo

Problema:

```text
perde confiança na ferramenta.
```

---

## 3. Excluir código crítico da análise

Problema:

```text
esconde risco.
```

---

## 4. Brigar com cobertura sem olhar teste

Problema:

```text
gera teste artificial sem valor.
```

---

## 5. Quality Gate impossível

Problema:

```text
time começa a burlar.
```

Quality Gate precisa ser exigente, mas realista.

---

# Parte 33 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é SonarQube.
[ ] Sei explicar análise estática.
[ ] Sei explicar bug no Sonar.
[ ] Sei explicar vulnerability.
[ ] Sei explicar security hotspot.
[ ] Sei explicar code smell.
[ ] Sei explicar technical debt.
[ ] Sei explicar severity.
[ ] Sei explicar quality gate.
[ ] Sei explicar new code.
[ ] Sei explicar coverage no Sonar.
[ ] Sei relacionar Sonar com JaCoCo.
[ ] Sei configurar jacoco.xml para Sonar.
[ ] Sei rodar análise Maven conceitualmente.
[ ] Sei proteger token.
[ ] Sei ler dashboard.
[ ] Sei lidar com issue.
[ ] Sei explicar Sonar no pipeline.
[ ] Sei evitar antipadrões.
[ ] Sei usar Sonar como apoio de engenharia.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é SonarQube?
2. O que é análise estática?
3. Qual diferença entre análise estática e teste?
4. O que é bug no Sonar?
5. O que é vulnerability?
6. O que é security hotspot?
7. O que é code smell?
8. O que é technical debt?
9. O que é severity?
10. O que é Quality Gate?
11. O que é new code?
12. Como JaCoCo se conecta ao Sonar?
13. Qual arquivo XML de cobertura costuma ser usado?
14. Por que não commitar token?
15. Como Sonar entra no pipeline?
16. Quando marcar falso positivo?
17. Por que Sonar não substitui code review?
18. Por que Sonar não substitui testes?
```

---

# Parte 34 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-258-sonarqube-qualidade-codigo
```

Com:

```text
pom.xml;
TipoCliente.java;
Pedido.java;
ClassificadorRiscoPedidoService.java;
GeradorMensagemPedidoService.java;
PedidoTest.java;
ClassificadorRiscoPedidoServiceTest.java;
GeradorMensagemPedidoServiceTest.java;
RELATORIO_SONARQUBE.md.
```

---

## Requisitos

Você deve:

```text
configurar JaCoCo;
configurar propriedades básicas do Sonar no pom;
rodar mvn clean verify;
gerar jacoco.xml;
subir Sonar local ou usar ambiente disponível;
rodar análise sonar:sonar;
abrir dashboard;
analisar Quality Gate;
analisar coverage;
analisar bugs;
analisar vulnerabilities;
analisar hotspots;
analisar code smells;
preencher relatório.
```

---

## Critérios

```text
não commitar token;
não usar senha real em arquivo;
não ignorar issue sem analisar;
não excluir regra de negócio da análise;
relatório deve registrar decisões;
testes devem ter assertions reais;
coverage deve vir do JaCoCo XML;
mvn clean verify deve passar.
```

---

# Parte 35 — Desafio extra

## Criar código com code smell controlado e refatorar

Crie uma classe:

```text
AvaliadorPedidoComplexoService
```

Faça primeiro uma versão com:

```text
muitos ifs;
método longo;
duplicação.
```

Rode Sonar.

Depois refatore para:

```text
métodos privados com nomes claros;
menos aninhamento;
constantes;
testes mantidos.
```

Documente:

```text
issue antes;
refatoração aplicada;
resultado depois;
testes que garantiram segurança.
```

Critérios:

```text
não alterar regra;
manter testes passando;
melhorar legibilidade;
reduzir code smell;
registrar no relatório.
```

---

# Parte 36 — Simulado rápido

## Questão 1

SonarQube é usado principalmente para:

```text
A) análise de qualidade de código.
B) criar banco relacional.
C) substituir JVM.
D) versionar código.
```

---

## Questão 2

Análise estática significa:

```text
A) analisar código sem executar a aplicação.
B) rodar todos os testes E2E.
C) fazer deploy.
D) abrir pull request.
```

---

## Questão 3

Quality Gate é:

```text
A) conjunto de regras mínimas de qualidade.
B) banco de dados do projeto.
C) framework de API.
D) comando do Git.
```

---

## Questão 4

Security Hotspot é:

```text
A) ponto sensível que precisa de revisão humana.
B) sempre bug confirmado.
C) arquivo de teste.
D) pasta target.
```

---

## Questão 5

Code Smell indica:

```text
A) possível problema de manutenibilidade.
B) sempre falha em produção.
C) senha correta.
D) cobertura 100%.
```

---

## Questão 6

Sonar normalmente recebe cobertura Java de:

```text
A) relatório JaCoCo XML.
B) README.
C) .gitignore.
D) Dockerfile.
```

---

## Questão 7

Token do Sonar deve ficar:

```text
A) em variável/secret seguro.
B) commitado no pom.xml.
C) dentro da classe main.
D) em comentário no código.
```

---

## Questão 8

SonarQube:

```text
A) complementa testes e code review, mas não substitui ambos.
B) elimina necessidade de testes.
C) elimina necessidade de arquitetura.
D) garante que toda regra de negócio está correta.
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
git add labs/m11/aula-258-sonarqube-qualidade-codigo
git commit -m "Aula 258: sonarqube qualidade codigo quality gate analise estatica"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
SonarQube é uma ferramenta de apoio à engenharia que ajuda a controlar qualidade, segurança, cobertura, duplicação e manutenibilidade, mas exige interpretação técnica madura.
```

Você estudou:

```text
SonarQube;
análise estática;
bugs;
vulnerabilities;
security hotspots;
code smells;
technical debt;
severity;
quality gate;
new code;
coverage;
duplicação;
JaCoCo XML;
sonar:sonar;
token seguro;
dashboard;
pipeline;
quality gate em PR;
falsos positivos;
antipadrões;
relatório de análise;
refatoração orientada por issue.
```

Na próxima aula, vamos aprofundar:

```text
Docker para Java Backend.
```

A ideia será entender containers, imagens, Dockerfile, docker-compose, portas, variáveis de ambiente, redes, volumes, build de aplicação Java, execução de JAR, banco local para desenvolvimento e preparação para Spring Boot em ambiente profissional.
