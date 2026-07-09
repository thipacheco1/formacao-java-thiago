# 256 — M11.12 — TDD e estratégia de testes no Backend: pirâmide, qualidade e engenharia

## Objetivo da aula

Na aula anterior, você aprofundou AssertJ.

Você estudou:

```text
assertions fluentes;
assertThat;
assertThatThrownBy;
BigDecimal;
listas;
Optional;
extracting;
containsExactly;
containsExactlyInAnyOrder;
filteredOn;
satisfies;
recursive comparison;
AssertJ com Mockito;
testes mais legíveis.
```

Agora vamos aprofundar um tema que conecta tudo que estudamos sobre testes:

```text
TDD e estratégia profissional de testes no backend.
```

Esta aula não é apenas sobre escrever teste antes do código.

A ideia é entender testes como parte da engenharia de software.

Um backend Java profissional precisa ter uma estratégia de qualidade que responda:

```text
o que testar;
onde testar;
como testar;
quanto testar;
quando usar unitário;
quando usar integração;
quando usar contrato;
quando usar E2E;
quando usar TDD;
quando não usar TDD;
como equilibrar velocidade e confiança;
como evitar testes frágeis;
como organizar testes em pipeline;
como usar testes para proteger arquitetura.
```

Ao final desta aula, você deve conseguir:

```text
entender TDD;
entender Red, Green, Refactor;
entender quando TDD ajuda;
entender quando TDD atrapalha;
entender pirâmide de testes;
entender testes unitários;
entender testes de integração;
entender testes de contrato;
entender testes end-to-end;
entender testes de regressão;
entender testes de fumaça;
entender testes de aceitação;
montar estratégia de testes para backend Java;
organizar testes por camada;
decidir o que mockar e o que integrar;
relacionar testes com arquitetura;
relacionar testes com CI/CD;
preparar base para testes de Spring.
```

---

## Reforço do objetivo maior

Nosso curso está sendo construído para ir do básico até nível engenheiro/arquiteto Java.

Por isso, uma aula sobre TDD e estratégia de testes precisa ir além do conceito acadêmico.

Um profissional avançado precisa saber:

```text
não apenas escrever teste;
mas decidir o teste certo para o risco certo.
```

Um arquiteto ou engenheiro Java precisa pensar em:

```text
qualidade;
custo de manutenção;
tempo de pipeline;
confiança de deploy;
regressão;
contratos entre serviços;
testabilidade da arquitetura;
isolamento de domínio;
separação de responsabilidades;
feedback rápido;
observabilidade de falhas;
governança técnica.
```

Teste não é enfeite.

Teste é mecanismo de confiança.

---

# Parte 1 — O que é TDD

TDD significa:

```text
Test-Driven Development
```

Em português:

```text
Desenvolvimento Guiado por Testes
```

A ideia central é:

```text
escrever um teste antes de escrever a implementação.
```

O ciclo clássico é:

```text
Red;
Green;
Refactor.
```

---

## Red

Escreva um teste que falha.

Ele falha porque a funcionalidade ainda não existe ou ainda está incorreta.

Objetivo:

```text
provar que o teste realmente detecta a ausência da regra.
```

---

## Green

Escreva o mínimo de código necessário para o teste passar.

Objetivo:

```text
fazer a regra funcionar.
```

---

## Refactor

Melhore o código mantendo os testes passando.

Objetivo:

```text
melhorar design sem mudar comportamento.
```

---

## Ciclo TDD

```text
1. Escreva um teste que falha.
2. Faça o teste passar.
3. Refatore.
4. Repita.
```

Representação:

```text
Red -> Green -> Refactor -> Red -> Green -> Refactor
```

---

# Parte 2 — TDD não é só teste antes

Muita gente reduz TDD a:

```text
escrever teste antes do código.
```

Mas TDD é mais do que isso.

TDD ajuda a pensar em:

```text
contrato;
comportamento;
entrada;
saída;
regra;
design;
dependências;
nomes;
bordas;
testabilidade.
```

Quando você escreve o teste primeiro, você se força a perguntar:

```text
como eu gostaria de usar essa classe?
qual método deveria existir?
qual entrada faz sentido?
qual resultado espero?
qual exceção espero?
essa dependência deveria ser interface?
essa regra pertence à entidade ou ao use case?
```

TDD pode melhorar design.

---

# Parte 3 — Exemplo simples de TDD

Regra:

```text
cliente VIP recebe 10% de desconto para pedidos acima de R$ 500,00.
cliente comum recebe 5% de desconto para pedidos acima de R$ 500,00.
pedido até R$ 500,00 não recebe desconto.
```

Primeiro teste:

```java
@Test
void deveAplicarDezPorCentoParaClienteVipAcimaDeQuinhentos() {
    CalculadoraDesconto calculadora = new CalculadoraDesconto();

    BigDecimal desconto = calculadora.calcular(new BigDecimal("1000.00"), TipoCliente.VIP);

    assertThat(desconto).isEqualByComparingTo("100.00");
}
```

Esse teste falha porque `CalculadoraDesconto` ainda não existe.

Isso é Red.

Depois você cria o mínimo:

```java
public class CalculadoraDesconto {
    public BigDecimal calcular(BigDecimal valor, TipoCliente tipoCliente) {
        return new BigDecimal("100.00");
    }
}
```

O teste passa.

Isso é Green, mas ainda não é uma implementação real.

Depois adiciona novos testes e refatora até a regra ficar correta.

---

# Parte 4 — TDD força evolução incremental

Você não precisa implementar tudo de uma vez.

Você pode evoluir:

```text
teste 1:
VIP acima de 500 recebe 10%.

teste 2:
COMUM acima de 500 recebe 5%.

teste 3:
VIP abaixo ou igual a 500 recebe zero.

teste 4:
valor nulo lança erro.

teste 5:
tipoCliente nulo lança erro.
```

Cada teste força uma pequena evolução.

---

## Exemplo de sequência

```text
Red:
teste VIP falha.

Green:
implementação mínima passa.

Red:
teste COMUM falha.

Green:
adiciona regra COMUM.

Red:
teste abaixo de 500 falha.

Green:
adiciona regra sem desconto.

Refactor:
extrai constantes e melhora nomes.
```

---

# Parte 5 — Quando TDD ajuda muito

TDD costuma ajudar quando você está implementando:

```text
regra de negócio;
cálculo;
validador;
parser;
normalizador;
entidade;
value object;
strategy;
policy;
use case;
algoritmo;
transição de status;
regra de autorização;
mapeamento complexo.
```

Exemplos backend:

```text
calcular desconto;
validar reagendamento;
validar status de atividade;
calcular provisão;
validar criação de OS;
calcular remuneração;
aplicar regra de fila;
definir mensageria;
gerar payload;
validar documento;
normalizar produto;
classificar pedido.
```

TDD é muito bom quando a regra tem entrada e saída clara.

---

# Parte 6 — Quando TDD pode atrapalhar

TDD pode ser difícil ou pouco produtivo quando você está:

```text
explorando API desconhecida;
fazendo spike técnico;
descobrindo biblioteca;
fazendo protótipo descartável;
configurando infraestrutura;
mexendo com UI visual;
criando código muito dependente de framework;
fazendo integração ainda incerta;
trabalhando sem regra clara.
```

Nesses casos, pode ser melhor:

```text
explorar primeiro;
entender comportamento;
estabilizar decisão;
depois criar testes.
```

---

## Regra profissional

```text
TDD é uma ferramenta, não religião.
```

Use quando aumenta clareza e qualidade.

Não force quando só cria fricção sem benefício.

---

# Parte 7 — TDD e arquitetura

Código testável geralmente tem arquitetura melhor.

Se é difícil testar, pode ser sinal de:

```text
classe faz coisas demais;
controller tem regra demais;
repository tem regra de negócio;
método gigante;
dependência concreta demais;
new espalhado;
static demais;
acoplamento com infraestrutura;
regra escondida em framework.
```

TDD pressiona o código a ficar mais modular.

---

## Frase arquitetural aplicada

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com TDD:

```text
teste entidade para regras internas;
teste use case para orquestração;
teste repository com integração;
teste client com contrato/fake;
teste controller com web test;
não coloque regra de negócio no controller.
```

---

# Parte 8 — Pirâmide de testes

A pirâmide de testes é um modelo visual para equilibrar tipos de teste.

Base larga:

```text
muitos testes unitários.
```

Meio:

```text
alguns testes de integração.
```

Topo:

```text
poucos testes end-to-end.
```

Representação:

```text
          E2E
        Contrato
     Integração
   Unitários
```

---

## Por que pirâmide

Porque testes unitários são:

```text
rápidos;
baratos;
isolados;
fáceis de rodar;
bons para feedback rápido.
```

Testes E2E são:

```text
mais lentos;
mais caros;
mais frágeis;
dependem de ambiente;
mais difíceis de diagnosticar.
```

Então, normalmente, queremos:

```text
muitos testes rápidos;
menos testes lentos;
testes lentos cobrindo fluxos críticos.
```

---

# Parte 9 — Testes unitários

Testam uma unidade isolada.

Exemplos:

```text
PedidoTest;
CalculadoraDescontoTest;
ValidarReagendamentoUseCaseTest;
CriarPedidoUseCaseTest com mocks;
ParserEnderecoTest;
GeradorPayloadMensagemTest.
```

Ferramentas:

```text
JUnit;
AssertJ;
Mockito.
```

Devem ser:

```text
rápidos;
determinísticos;
sem banco;
sem rede;
sem Spring quando possível;
isolados;
focados em regra.
```

---

## O que testar unitariamente

Teste unitário deve cobrir:

```text
regras de domínio;
validações;
transições de estado;
cálculos;
mapeamentos;
orquestração de use case;
tratamento de erro;
decisões condicionais;
policies;
strategies.
```

---

# Parte 10 — Testes de integração

Testes de integração validam se partes reais funcionam juntas.

Exemplos:

```text
repository com banco;
consulta SQL real;
JPA/Hibernate;
Flyway migrations;
client HTTP com servidor fake;
mensageria com broker de teste;
serialização JSON real;
Spring context.
```

Ferramentas futuras:

```text
Spring Boot Test;
DataJpaTest;
Testcontainers;
MockWebServer;
WireMock;
Docker Compose;
banco em container.
```

---

## Quando usar integração

Use quando quer validar:

```text
query real;
mapeamento entidade-tabela;
migration;
transação;
serialização;
configuração Spring;
wiring de beans;
conexão com infraestrutura;
contrato com componente externo simulado.
```

---

# Parte 11 — Testes de contrato

Testes de contrato validam que duas partes concordam sobre uma interface.

Exemplos:

```text
serviço A chama serviço B;
producer envia evento;
consumer espera evento;
API expõe JSON;
client espera campos.
```

Contrato pode envolver:

```text
HTTP;
JSON;
mensageria;
schema;
eventos;
OpenAPI;
AsyncAPI.
```

---

## Por que contrato importa

Em microsserviços, um serviço pode quebrar outro sem perceber.

Exemplo:

```text
API remove campo "codigo";
client dependia dele;
client quebra.
```

Teste de contrato ajuda a detectar isso.

---

# Parte 12 — Testes end-to-end

Teste E2E valida fluxo completo.

Exemplo:

```text
criar pedido pela API;
pagar pedido;
consultar pedido;
validar status final;
validar banco;
validar mensagem.
```

Ou:

```text
front -> API -> banco -> mensageria.
```

E2E é poderoso, mas caro.

Use para:

```text
jornadas críticas;
fluxos de alto risco;
validação de ambiente;
smoke em produção/homologação;
regressão de ponta a ponta.
```

---

## Cuidado com E2E demais

Se tudo é E2E:

```text
pipeline fica lento;
falhas são difíceis de diagnosticar;
ambiente instável quebra teste;
manutenção aumenta;
feedback demora.
```

Use com inteligência.

---

# Parte 13 — Teste de fumaça

Smoke test, ou teste de fumaça, verifica se o sistema está minimamente de pé.

Exemplos:

```text
aplicação sobe;
health check responde;
endpoint principal responde;
banco conecta;
mensageria conecta;
login básico funciona.
```

Em backend:

```text
GET /actuator/health;
GET /api/status;
validação de startup;
teste de rota crítica.
```

Smoke test não valida tudo.

Ele responde:

```text
o sistema está minimamente funcional?
```

---

# Parte 14 — Teste de regressão

Teste de regressão protege contra bugs voltando.

Quando um bug aparece:

```text
reproduza com teste;
corrija;
mantenha teste.
```

Assim, se o bug voltar, o teste falha.

Fluxo profissional:

```text
bug encontrado;
criar teste que falha;
corrigir;
teste passa;
commit.
```

Isso é muito forte.

---

# Parte 15 — Teste de aceitação

Teste de aceitação valida regra do ponto de vista de negócio.

Pode ser manual ou automatizado.

Exemplo:

```text
Dado um pedido pago
Quando solicito reembolso
Então o pedido deve ficar REEMBOLSADO
E uma auditoria deve ser registrada
E uma notificação deve ser enviada
```

Ferramentas podem variar.

Mas o importante é:

```text
testar comportamento esperado pelo negócio.
```

---

# Parte 16 — Estratégia por camada Backend

Em arquitetura backend, podemos pensar assim:

## Domain

```text
entidades;
value objects;
policies;
strategies;
regras puras.
```

Testes:

```text
unitários puros.
```

Ferramentas:

```text
JUnit;
AssertJ.
```

---

## Application

```text
use cases;
services de aplicação;
handlers;
orquestração.
```

Testes:

```text
unitários com Mockito;
fakes quando fizer sentido.
```

Ferramentas:

```text
JUnit;
AssertJ;
Mockito.
```

---

## Infra

```text
repository real;
client HTTP;
mensageria;
file system;
banco.
```

Testes:

```text
integração;
contrato;
container;
fake server.
```

---

## API

```text
controllers;
DTOs;
validação;
status HTTP;
serialização.
```

Testes:

```text
web slice;
MockMvc;
teste de contrato;
teste de integração.
```

---

# Parte 17 — O que mockar e o que não mockar

## Mockar

```text
repository em teste unitário de use case;
gateway externo;
client HTTP;
publisher;
notificador;
auditoria externa;
clock em regra temporal;
gerador de ID em alguns cenários.
```

## Não mockar sem necessidade

```text
entidade;
value object;
record simples;
String;
BigDecimal;
List;
Optional;
classe de regra pura simples.
```

---

## Regra prática

```text
Mocke bordas.
Use domínio real.
```

---

# Parte 18 — Fakes na estratégia

Fake é implementação simples para teste.

Exemplo:

```text
PedidoRepositoryInMemory
```

Pode ser útil em testes de use case para evitar muitos stubs.

Exemplo:

```java
class PedidoRepositoryFake implements PedidoRepository {
    private final Map<String, Pedido> banco = new HashMap<>();

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        return Optional.ofNullable(banco.get(codigo));
    }

    @Override
    public void salvar(Pedido pedido) {
        banco.put(pedido.codigo(), pedido);
    }
}
```

Fake pode deixar teste mais próximo do comportamento real sem banco.

---

## Mock vs Fake

```text
Mock:
bom para verificar interação.

Fake:
bom para simular comportamento simples.
```

Use conforme objetivo do teste.

---

# Parte 19 — Testabilidade

Testabilidade é a facilidade de testar um código.

Código testável tem:

```text
responsabilidade clara;
dependências explícitas;
baixo acoplamento;
pouco static;
pouco new de infraestrutura;
interfaces nas bordas;
regra separada do framework;
métodos pequenos;
estado controlado;
mensagens de erro claras.
```

Código pouco testável tem:

```text
método gigante;
controller com tudo;
repository com regra;
new HttpClient dentro do use case;
DataSource direto na regra;
System.currentTimeMillis espalhado;
static global;
singleton manual;
dependência oculta.
```

---

# Parte 20 — Clock e tempo em testes

Regras com data/hora são comuns.

Exemplo:

```text
reagendamento para D0/D+1 exige autenticação;
D+2 não exige.
```

Se você usa:

```java
LocalDate.now()
```

direto na regra, o teste pode ficar instável.

Melhor usar:

```java
Clock
```

Exemplo:

```java
LocalDate hoje = LocalDate.now(clock);
```

No teste, você passa um clock fixo.

Isso será aprofundado em aula própria, mas a ideia é importante.

---

# Parte 21 — Testes e CI/CD

Pipeline normalmente roda testes.

Exemplo:

```text
push;
pull request;
pipeline inicia;
mvn clean test;
mvn verify;
publica relatório;
bloqueia merge se falhar.
```

Estratégia comum:

```text
unitários:
todo commit.

integração:
pull request ou branch principal.

E2E:
ambiente dedicado ou antes de release.

smoke:
pós-deploy.
```

---

## Pipeline precisa ser rápido

Se pipeline demora demais:

```text
devs ignoram;
feedback atrasa;
merge acumula;
conflitos aumentam;
qualidade cai.
```

Por isso a pirâmide importa.

---

# Parte 22 — Cobertura de testes

Cobertura mede quanto código foi executado pelos testes.

Ferramentas futuras:

```text
JaCoCo;
SonarQube;
relatórios de coverage.
```

Cobertura é útil, mas não é tudo.

100% de cobertura não garante qualidade.

Exemplo ruim:

```java
@Test
void teste() {
    service.executar();
}
```

Sem assert, pode cobrir código e não validar nada.

---

## Regra profissional

```text
Cobertura ajuda.
Assert bom protege.
Teste com cenário relevante dá confiança.
```

---

# Parte 23 — Mutação de testes

Mutation testing verifica se seus testes realmente detectam mudanças ruins.

Ferramentas como PIT podem alterar pequenas partes do código e ver se testes falham.

Exemplo:

```text
troca > por >=;
troca true por false;
remove chamada;
troca retorno.
```

Se o teste não falha, talvez não esteja forte.

Não vamos aprofundar agora, mas é um tema de nível avançado.

---

# Parte 24 — Estratégia mínima profissional para um backend Java

Uma estratégia inicial boa:

```text
1. Testes unitários para domínio.
2. Testes unitários com Mockito para use cases.
3. Testes de integração para repositories.
4. Testes web para controllers.
5. Testes de contrato para integrações críticas.
6. Poucos E2E para jornadas principais.
7. Smoke test no deploy.
8. Pipeline bloqueando merge com testes quebrados.
```

---

# Parte 25 — Exemplo de matriz de testes

| Camada | O que testar | Tipo | Ferramentas |
|---|---|---|---|
| Domain | Regras, status, cálculo | Unitário | JUnit, AssertJ |
| Application | Use cases, orquestração | Unitário | JUnit, Mockito, AssertJ |
| Infra Repository | Query, JPA, SQL | Integração | Spring, Testcontainers |
| Infra Client | Contrato HTTP | Contrato/Integração | WireMock, MockWebServer |
| API Controller | HTTP, DTO, validação | Web test | MockMvc/WebTestClient |
| Sistema | Jornada crítica | E2E | Ferramenta externa/API |
| Deploy | Aplicação de pé | Smoke | Health check |

---

# Parte 26 — Laboratório da aula

Vamos criar um laboratório com TDD simples e estratégia documentada.

Crie:

```powershell
mkdir labs\m11\aula-256-tdd-estrategia-testes
cd labs\m11\aula-256-tdd-estrategia-testes

mkdir src\main\java\br\com\curso\aula256
mkdir src\main\java\br\com\curso\aula256\domain
mkdir src\main\java\br\com\curso\aula256\application
mkdir src\main\java\br\com\curso\aula256\application\port
mkdir src\main\java\br\com\curso\aula256\application\usecase

mkdir src\test\java\br\com\curso\aula256
mkdir src\test\java\br\com\curso\aula256\domain
mkdir src\test\java\br\com\curso\aula256\application
mkdir src\test\java\br\com\curso\aula256\application\usecase
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
    <artifactId>aula-256-tdd-estrategia-testes</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <mockito.version>5.12.0</mockito.version>
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

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <version>${mockito.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <version>${mockito.version}</version>
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

# Parte 27 — Domínio para TDD

Vamos implementar uma regra de aprovação de transação.

Regra:

```text
Uma transação começa como PENDENTE.
Pode ser aprovada se estiver PENDENTE.
Pode ser recusada se estiver PENDENTE.
Não pode aprovar transação já aprovada.
Não pode aprovar transação recusada.
Não pode recusar transação aprovada.
Não pode recusar transação já recusada.
Valor deve ser maior que zero.
Código deve ser obrigatório.
```

Primeiro, imagine que escreveríamos o teste antes.

Crie:

```text
src/main/java/br/com/curso/aula256/domain/StatusTransacao.java
```

Código:

```java
package br.com.curso.aula256.domain;

public enum StatusTransacao {
    PENDENTE,
    APROVADA,
    RECUSADA
}
```

Crie:

```text
src/main/java/br/com/curso/aula256/domain/Transacao.java
```

Código:

```java
package br.com.curso.aula256.domain;

import java.math.BigDecimal;

public class Transacao {
    private final String codigo;
    private final BigDecimal valor;
    private StatusTransacao status;

    public Transacao(String codigo, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.valor = valor;
        this.status = StatusTransacao.PENDENTE;
    }

    public Transacao(String codigo, String valor) {
        this(codigo, new BigDecimal(valor));
    }

    public void aprovar() {
        if (status == StatusTransacao.APROVADA) {
            throw new IllegalStateException("Transação já está aprovada.");
        }

        if (status == StatusTransacao.RECUSADA) {
            throw new IllegalStateException("Transação recusada não pode ser aprovada.");
        }

        status = StatusTransacao.APROVADA;
    }

    public void recusar() {
        if (status == StatusTransacao.APROVADA) {
            throw new IllegalStateException("Transação aprovada não pode ser recusada.");
        }

        if (status == StatusTransacao.RECUSADA) {
            throw new IllegalStateException("Transação já está recusada.");
        }

        status = StatusTransacao.RECUSADA;
    }

    public String codigo() {
        return codigo;
    }

    public BigDecimal valor() {
        return valor;
    }

    public StatusTransacao status() {
        return status;
    }
}
```

---

# Parte 28 — Teste de domínio

Crie:

```text
src/test/java/br/com/curso/aula256/domain/TransacaoTest.java
```

Código:

```java
package br.com.curso.aula256.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Transacao")
class TransacaoTest {
    @Nested
    @DisplayName("Criação")
    class Criacao {
        @Test
        @DisplayName("deve criar transação pendente")
        void deveCriarTransacaoPendente() {
            Transacao transacao = new Transacao(" trx-001 ", "100.00");

            assertThat(transacao.codigo()).isEqualTo("TRX-001");
            assertThat(transacao.valor()).isEqualByComparingTo("100.00");
            assertThat(transacao.status()).isEqualTo(StatusTransacao.PENDENTE);
        }

        @Test
        @DisplayName("não deve criar transação sem código")
        void naoDeveCriarTransacaoSemCodigo() {
            assertThatThrownBy(() -> new Transacao(" ", "100.00"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Código é obrigatório.");
        }

        @Test
        @DisplayName("não deve criar transação com valor zero")
        void naoDeveCriarTransacaoComValorZero() {
            assertThatThrownBy(() -> new Transacao("TRX-001", "0"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Valor deve ser maior que zero.");
        }
    }

    @Nested
    @DisplayName("Aprovação")
    class Aprovacao {
        @Test
        @DisplayName("deve aprovar transação pendente")
        void deveAprovarTransacaoPendente() {
            Transacao transacao = new Transacao("TRX-001", "100.00");

            transacao.aprovar();

            assertThat(transacao.status()).isEqualTo(StatusTransacao.APROVADA);
        }

        @Test
        @DisplayName("não deve aprovar transação já aprovada")
        void naoDeveAprovarTransacaoJaAprovada() {
            Transacao transacao = new Transacao("TRX-001", "100.00");
            transacao.aprovar();

            assertThatThrownBy(transacao::aprovar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Transação já está aprovada.");
        }

        @Test
        @DisplayName("não deve aprovar transação recusada")
        void naoDeveAprovarTransacaoRecusada() {
            Transacao transacao = new Transacao("TRX-001", "100.00");
            transacao.recusar();

            assertThatThrownBy(transacao::aprovar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Transação recusada não pode ser aprovada.");
        }
    }

    @Nested
    @DisplayName("Recusa")
    class Recusa {
        @Test
        @DisplayName("deve recusar transação pendente")
        void deveRecusarTransacaoPendente() {
            Transacao transacao = new Transacao("TRX-001", "100.00");

            transacao.recusar();

            assertThat(transacao.status()).isEqualTo(StatusTransacao.RECUSADA);
        }

        @Test
        @DisplayName("não deve recusar transação aprovada")
        void naoDeveRecusarTransacaoAprovada() {
            Transacao transacao = new Transacao("TRX-001", "100.00");
            transacao.aprovar();

            assertThatThrownBy(transacao::recusar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Transação aprovada não pode ser recusada.");
        }

        @Test
        @DisplayName("não deve recusar transação já recusada")
        void naoDeveRecusarTransacaoJaRecusada() {
            Transacao transacao = new Transacao("TRX-001", "100.00");
            transacao.recusar();

            assertThatThrownBy(transacao::recusar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Transação já está recusada.");
        }
    }
}
```

---

# Parte 29 — Use case com Mockito

Crie portas:

```text
src/main/java/br/com/curso/aula256/application/port/TransacaoRepository.java
```

Código:

```java
package br.com.curso.aula256.application.port;

import br.com.curso.aula256.domain.Transacao;

import java.util.Optional;

public interface TransacaoRepository {
    Optional<Transacao> buscarPorCodigo(String codigo);

    void salvar(Transacao transacao);
}
```

Crie:

```text
src/main/java/br/com/curso/aula256/application/port/AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula256.application.port;

public interface AuditoriaGateway {
    void registrar(String acao, String detalhe);
}
```

Crie:

```text
src/main/java/br/com/curso/aula256/application/usecase/AprovarTransacaoUseCase.java
```

Código:

```java
package br.com.curso.aula256.application.usecase;

import br.com.curso.aula256.application.port.AuditoriaGateway;
import br.com.curso.aula256.application.port.TransacaoRepository;
import br.com.curso.aula256.domain.Transacao;

public class AprovarTransacaoUseCase {
    private final TransacaoRepository repository;
    private final AuditoriaGateway auditoria;

    public AprovarTransacaoUseCase(TransacaoRepository repository, AuditoriaGateway auditoria) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.repository = repository;
        this.auditoria = auditoria;
    }

    public void executar(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        Transacao transacao = repository.buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Transação não encontrada."));

        transacao.aprovar();

        repository.salvar(transacao);
        auditoria.registrar("TRANSACAO_APROVADA", transacao.codigo());
    }
}
```

---

# Parte 30 — Teste do use case

Crie:

```text
src/test/java/br/com/curso/aula256/application/usecase/AprovarTransacaoUseCaseTest.java
```

Código:

```java
package br.com.curso.aula256.application.usecase;

import br.com.curso.aula256.application.port.AuditoriaGateway;
import br.com.curso.aula256.application.port.TransacaoRepository;
import br.com.curso.aula256.domain.StatusTransacao;
import br.com.curso.aula256.domain.Transacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("AprovarTransacaoUseCase")
class AprovarTransacaoUseCaseTest {
    @Mock
    private TransacaoRepository repository;

    @Mock
    private AuditoriaGateway auditoria;

    @InjectMocks
    private AprovarTransacaoUseCase useCase;

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve aprovar transação pendente")
        void deveAprovarTransacaoPendente() {
            Transacao transacao = new Transacao("TRX-001", "100.00");

            when(repository.buscarPorCodigo("TRX-001")).thenReturn(Optional.of(transacao));

            useCase.executar("TRX-001");

            ArgumentCaptor<Transacao> captor = ArgumentCaptor.forClass(Transacao.class);

            verify(repository).salvar(captor.capture());

            assertThat(captor.getValue())
                    .satisfies(t -> {
                        assertThat(t.codigo()).isEqualTo("TRX-001");
                        assertThat(t.status()).isEqualTo(StatusTransacao.APROVADA);
                    });

            verify(auditoria).registrar("TRANSACAO_APROVADA", "TRX-001");
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve aprovar sem código")
        void naoDeveAprovarSemCodigo() {
            assertThatThrownBy(() -> useCase.executar(" "))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Código é obrigatório.");

            verify(repository, never()).buscarPorCodigo(any());
            verify(repository, never()).salvar(any());
            verify(auditoria, never()).registrar(any(), any());
        }

        @Test
        @DisplayName("não deve aprovar transação inexistente")
        void naoDeveAprovarTransacaoInexistente() {
            when(repository.buscarPorCodigo("TRX-404")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> useCase.executar("TRX-404"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Transação não encontrada.");

            verify(repository, never()).salvar(any());
            verify(auditoria, never()).registrar(any(), any());
        }

        @Test
        @DisplayName("não deve aprovar transação recusada")
        void naoDeveAprovarTransacaoRecusada() {
            Transacao transacao = new Transacao("TRX-001", "100.00");
            transacao.recusar();

            when(repository.buscarPorCodigo("TRX-001")).thenReturn(Optional.of(transacao));

            assertThatThrownBy(() -> useCase.executar("TRX-001"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Transação recusada não pode ser aprovada.");

            verify(repository, never()).salvar(any());
            verify(auditoria, never()).registrar(any(), any());
        }
    }
}
```

---

# Parte 31 — Rodando os testes

Execute:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar:

```text
leia o teste;
leia a mensagem;
veja se a regra está correta;
debugue se necessário;
corrija a menor parte possível.
```

---

# Parte 32 — Como praticar TDD nesse laboratório

Embora o arquivo já tenha código completo, a prática correta é refazer mentalmente ou em outro branch assim:

```text
1. Escreva teste deveCriarTransacaoPendente.
2. Rode e veja falhar.
3. Crie o mínimo de Transacao.
4. Rode e veja passar.
5. Escreva teste não deve criar sem código.
6. Rode e veja falhar.
7. Adicione validação.
8. Rode e veja passar.
9. Escreva teste deve aprovar pendente.
10. Evolua.
11. Refatore.
```

O importante é treinar o ciclo.

---

# Parte 33 — Documentando estratégia de testes

Crie:

```text
ESTRATEGIA_TESTES_BACKEND.md
```

Modelo:

```md
# Estratégia de Testes Backend — Aula 256

## Objetivo

Definir uma estratégia de testes para um backend Java profissional.

## Camadas

### Domain

Tipo de teste:
- Unitário

Ferramentas:
- JUnit
- AssertJ

O que testar:
- Regras
- Validações
- Transições de status
- Cálculos

### Application

Tipo de teste:
- Unitário com mocks/fakes

Ferramentas:
- JUnit
- AssertJ
- Mockito

O que testar:
- Use cases
- Orquestração
- Fluxos de erro
- Interações importantes

### Infra

Tipo de teste:
- Integração

Ferramentas futuras:
- Spring Boot Test
- Testcontainers

O que testar:
- Repository
- Banco
- Migrations
- Clients externos simulados

### API

Tipo de teste:
- Web/API test

Ferramentas futuras:
- MockMvc
- WebTestClient

O que testar:
- Status HTTP
- DTOs
- Validação
- Serialização

## Pirâmide de testes

## O que roda no commit

## O que roda no PR

## O que roda antes do deploy

## Riscos

## Decisões
```

---

# Parte 34 — Boas práticas de estratégia

Use boas práticas:

```text
mantenha testes unitários rápidos;
não suba Spring para testar regra pura;
não use banco real em teste unitário;
não use mock para tudo;
teste domínio com objeto real;
teste use case com mocks/fakes;
teste repository com integração;
teste controller com ferramenta web;
teste contrato quando há integração entre serviços;
tenha poucos E2E críticos;
rode unitários sempre;
rode integração em pipeline adequado;
não ignore teste falhando;
não persiga cobertura cega;
crie teste para bug corrigido;
mantenha testes legíveis.
```

---

# Parte 35 — Antipadrões

## 1. Tudo com SpringBootTest

Ruim:

```text
todo teste sobe o contexto inteiro do Spring.
```

Problemas:

```text
lento;
frágil;
difícil diagnosticar;
pipeline pesado.
```

Use SpringBootTest quando precisa do contexto completo.

Não para regra pura.

---

## 2. Tudo mockado

Ruim:

```text
mockar entidade;
mockar DTO;
mockar String;
mockar regra pura.
```

Problemas:

```text
teste artificial;
não valida comportamento real;
alto acoplamento.
```

---

## 3. Teste sem assert

Ruim:

```java
@Test
void teste() {
    service.executar();
}
```

Pode até cobrir código, mas valida pouco.

---

## 4. Teste que depende de ordem

Ruim:

```text
teste B só passa se teste A rodar antes.
```

Testes devem ser independentes.

---

## 5. Teste que depende do dia atual

Ruim:

```java
LocalDate.now()
```

sem controle.

Use clock fixo quando regra depende de data.

---

# Parte 36 — Testes e code review

Em revisão de código, avalie testes:

```text
existe teste para regra nova?
existe teste para erro?
teste é legível?
teste é rápido?
teste está na camada certa?
mock foi usado corretamente?
teste não depende de ambiente?
nome do teste documenta comportamento?
o bug corrigido ganhou teste?
```

Um PR com regra nova sem teste precisa de justificativa.

---

# Parte 37 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar TDD.
[ ] Sei explicar Red, Green, Refactor.
[ ] Sei quando TDD ajuda.
[ ] Sei quando TDD pode atrapalhar.
[ ] Sei explicar pirâmide de testes.
[ ] Sei diferenciar unitário, integração, contrato e E2E.
[ ] Sei explicar smoke test.
[ ] Sei explicar regressão.
[ ] Sei explicar aceitação.
[ ] Sei definir estratégia por camada.
[ ] Sei decidir o que mockar.
[ ] Sei decidir quando usar fake.
[ ] Sei explicar testabilidade.
[ ] Sei relacionar teste com arquitetura.
[ ] Sei relacionar teste com CI/CD.
[ ] Sei explicar cobertura sem idolatrar cobertura.
[ ] Sei documentar estratégia de testes.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é TDD?
2. O que é Red?
3. O que é Green?
4. O que é Refactor?
5. Quando TDD ajuda?
6. Quando TDD pode atrapalhar?
7. O que é pirâmide de testes?
8. O que é teste unitário?
9. O que é teste de integração?
10. O que é teste de contrato?
11. O que é teste E2E?
12. O que é smoke test?
13. O que é teste de regressão?
14. O que testar no domínio?
15. O que testar na aplicação?
16. O que testar na infraestrutura?
17. O que mockar?
18. O que não mockar?
19. Por que testabilidade importa?
20. Como testes entram no CI/CD?
```

---

# Parte 38 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-256-tdd-estrategia-testes
```

Com:

```text
pom.xml;
StatusTransacao.java;
Transacao.java;
TransacaoRepository.java;
AuditoriaGateway.java;
AprovarTransacaoUseCase.java;
TransacaoTest.java;
AprovarTransacaoUseCaseTest.java;
ESTRATEGIA_TESTES_BACKEND.md.
```

---

## Requisitos

Você deve testar:

```text
criação de transação pendente;
bloqueio sem código;
bloqueio valor zero;
aprovação de pendente;
bloqueio aprovação já aprovada;
bloqueio aprovação recusada;
recusa de pendente;
bloqueio recusa aprovada;
bloqueio recusa já recusada;
use case aprovar com sucesso;
use case sem código;
use case transação inexistente;
use case transação recusada.
```

---

## Critérios

```text
usar JUnit 5;
usar AssertJ;
usar Mockito no use case;
não usar Mockito no domínio;
usar nomes claros;
usar @Nested onde ajudar;
rodar mvn clean test;
documentar estratégia de testes;
não subir Spring;
não usar banco;
não criar teste sem assert.
```

---

# Parte 39 — Desafio extra

## Criar RecusarTransacaoUseCase

Crie:

```text
RecusarTransacaoUseCase
```

Regras:

```text
código obrigatório;
transação deve existir;
transação deve estar pendente;
recusar;
salvar;
auditar TRANSACAO_RECUSADA.
```

Testes:

```text
deve recusar transação pendente;
não deve recusar sem código;
não deve recusar transação inexistente;
não deve recusar transação aprovada;
não deve recusar transação já recusada;
não deve salvar quando falhar;
não deve auditar quando falhar.
```

Depois atualize:

```text
ESTRATEGIA_TESTES_BACKEND.md
```

incluindo o novo use case.

---

# Parte 40 — Simulado rápido

## Questão 1

TDD significa:

```text
A) Test-Driven Development.
B) Type-Driven Database.
C) Terminal Debug Deployment.
D) Test Docker Domain.
```

---

## Questão 2

O ciclo TDD clássico é:

```text
A) Red, Green, Refactor.
B) Build, Push, Deploy.
C) Merge, Rebase, Push.
D) Compile, Package, Install.
```

---

## Questão 3

Na pirâmide de testes, a base geralmente contém:

```text
A) muitos testes unitários.
B) muitos testes E2E lentos.
C) apenas teste manual.
D) somente smoke test.
```

---

## Questão 4

Teste de integração valida:

```text
A) se partes reais funcionam juntas.
B) apenas método privado.
C) somente nome de variável.
D) apenas commit Git.
```

---

## Questão 5

Teste de contrato ajuda a validar:

```text
A) acordo entre consumidor e provedor de uma interface/API/evento.
B) cor do editor.
C) branch local.
D) versão do teclado.
```

---

## Questão 6

Smoke test verifica:

```text
A) se o sistema está minimamente funcional/de pé.
B) todas as regras possíveis.
C) todos os bugs futuros.
D) apenas cobertura de código.
```

---

## Questão 7

Uma boa estratégia é:

```text
A) testar domínio unitariamente e infraestrutura com integração.
B) usar SpringBootTest para qualquer método simples.
C) mockar todas as entidades.
D) nunca rodar teste no pipeline.
```

---

## Questão 8

Cobertura de teste:

```text
A) ajuda, mas não garante qualidade sozinha.
B) garante ausência total de bugs.
C) substitui asserts.
D) elimina revisão de código.
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
git add labs/m11/aula-256-tdd-estrategia-testes
git commit -m "Aula 256: tdd estrategia testes backend piramide qualidade"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Testes não são apenas código de validação; eles fazem parte da estratégia de engenharia, qualidade, arquitetura e entrega contínua de um backend profissional.
```

Você estudou:

```text
TDD;
Red;
Green;
Refactor;
quando usar TDD;
quando evitar TDD;
pirâmide de testes;
testes unitários;
testes de integração;
testes de contrato;
testes E2E;
smoke test;
regressão;
aceitação;
estratégia por camada;
mock vs fake;
testabilidade;
Clock e tempo;
CI/CD;
cobertura;
mutation testing em alto nível;
antipadrões;
code review de testes;
laboratório com domínio e use case.
```

Na próxima aula, vamos aprofundar:

```text
JaCoCo, cobertura de testes, relatórios e qualidade no build.
```

A ideia será entender cobertura de linha, branch, métodos, limites mínimos, relatórios HTML, integração com Maven, interpretação correta dos números e como não cair na armadilha de perseguir cobertura vazia.
