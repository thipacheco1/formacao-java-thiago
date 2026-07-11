# 358 - M14.03 - Main Application e auto configuration

## Apresentacao da aula

Na aula 357, você gerou o primeiro projeto Spring Boot oficial da formação.

A baseline criada foi:

```text
Maven;

Java 21;

Spring Boot 4.1.0;

packaging Jar;

Spring Web MVC;

Maven Wrapper;

teste de contexto;

build verde;

jar produzido.
```

O projeto contínuo está em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Até agora, você localizou a classe:

```text
FormacaoJavaBackendApiApplication
```

mas ainda não aprofundou seu funcionamento.

Nesta aula, você fará o primeiro startup consciente da aplicação.

A pergunta principal será:

```text
o que realmente acontece quando o metodo main
chama SpringApplication.run?
```

Você estudará:

- `@SpringBootApplication`;
- `@SpringBootConfiguration`;
- `@EnableAutoConfiguration`;
- `@ComponentScan`;
- classe principal no package raiz;
- `SpringApplication`;
- fontes primárias;
- argumentos;
- dedução do tipo de aplicação;
- `WebApplicationType.SERVLET`;
- criação do `ApplicationContext`;
- refresh do contexto;
- descoberta de componentes;
- auto-configuração;
- servidor embarcado;
- Tomcat;
- porta 8080;
- banner;
- logs de startup;
- relatório de condições;
- condições positivas;
- condições negativas;
- classes não condicionais;
- exclusões;
- back-off;
- encerramento do contexto.

A classe principal criada pelo Initializr possui estrutura semelhante a:

```java
package br.com.formacao.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FormacaoJavaBackendApiApplication {

    public static void main(
            String[] args
    ) {
        SpringApplication.run(
                FormacaoJavaBackendApiApplication.class,
                args
        );
    }
}
```

Apesar de pequena, essa classe concentra decisões importantes.

Ela define:

- a fonte primária do bootstrap;
- a base de component scan;
- a ativação da auto-configuração;
- o ponto de entrada da JVM;
- os argumentos de execução;
- o início do contexto Spring;
- o ciclo de vida da aplicação.

O objetivo desta aula não é decorar o fluxo interno inteiro do Boot.

O objetivo é construir um modelo mental verificável.

Você deverá conseguir responder:

```text
por que a aplicação é servlet?

qual contexto foi criado?

por que Tomcat iniciou?

por que a porta padrao foi 8080?

quais componentes foram escaneados?

quais auto-configuracoes combinaram?

quais nao combinaram?

como o Boot recua diante de uma decisao da aplicacao?

como encerrar o processo corretamente?
```

O projeto continuará sem:

- controller;
- endpoint;
- regra de negócio;
- banco;
- JPA;
- Flyway;
- Validation;
- Actuator;
- Security;
- profiles;
- YAML.

Ao acessar:

```text
http://localhost:8080
```

o servidor deverá responder, mas não existirá um endpoint da aplicação.

Uma resposta 404 nesse momento não significa que o servidor falhou.

Ela significa:

```text
servidor ativo;

nenhum handler de negocio registrado para a raiz.
```

A próxima aula será:

```text
359 - M14.04 - Application properties YAML e profiles
```

Por isso, esta aula utilizará defaults e argumentos de diagnóstico, sem aprofundar precedência, YAML ou profiles.

---

## Onde estamos na formacao

A sequência inicial do M14 é:

```text
356:
visão geral do Spring Boot.

357:
Spring Initializr e estrutura.

358:
Main Application e auto configuration.

359:
application.properties, YAML e profiles.

360:
beans, components, services, repositories e configurations.

361:
constructor injection.

362:
lifecycle de beans.
```

A aula 357 respondeu:

```text
como gerar uma baseline Boot?
```

A aula 358 responderá:

```text
como essa baseline inicia
e por que o Boot cria determinados componentes?
```

Nesta aula:

```text
classe main:
sim.

@SpringBootApplication:
sim.

annotations compostas:
sim.

component scan:
sim.

SpringApplication:
sim.

tipo servlet:
sim.

ApplicationContext:
sim.

Tomcat:
sim.

porta 8080:
sim.

logs:
sim.

condition report:
sim.

back-off:
sim.

encerramento:
sim.

application.properties detalhado:
não.

YAML:
não.

profiles:
não.

controller:
não.

endpoint:
não.
```

O laboratório será realizado no mesmo projeto.

Novos arquivos de apoio serão adicionados sem alterar o domínio ainda.

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
formacao-java-backend-api
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   ├── br
│   │   │   │   └── com
│   │   │   │       └── formacao
│   │   │   │           └── backend
│   │   │   │               ├── FormacaoJavaBackendApiApplication.java
│   │   │   │               └── bootstrap
│   │   │   │                   ├── ApplicationContextSnapshot.java
│   │   │   │                   ├── BootstrapDiagnostics.java
│   │   │   │                   └── RootPackageProbe.java
│   │   │   └── com
│   │   │       └── exemplo
│   │   │           └── externo
│   │   │               └── OutsidePackageProbe.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── br
│               └── com
│                   └── formacao
│                       └── backend
│                           ├── FormacaoJavaBackendApiApplicationTests.java
│                           ├── MainApplicationMetadataTest.java
│                           ├── ComponentScanBoundaryIT.java
│                           ├── ServletApplicationContextIT.java
│                           └── AutoConfigurationReportIT.java
└── target
```

Também serão adicionados à pasta externa da aula:

```text
docs
├── main-application.md
├── spring-boot-application-decomposta.md
├── fluxo-spring-application-run.md
├── component-scan-boundary.md
├── condition-evaluation-report.md
├── back-off.md
└── startup-baseline.md

scripts
├── 06_iniciar_aplicacao.ps1
├── 07_testar_porta.ps1
├── 08_iniciar_com_debug.ps1
├── 09_executar_testes_bootstrap.ps1
└── 10_encerrar_aplicacao.ps1
```

Resultados esperados:

```text
SpringApplication:
executada.

WebApplicationType:
SERVLET.

ApplicationContext:
ServletWebServerApplicationContext.

Tomcat:
iniciado.

Porta:
8080.

RootPackageProbe:
presente.

OutsidePackageProbe:
ausente.

ConditionEvaluationReport:
disponível.

Positive matches:
presentes.

Negative matches:
presentes.

Unconditional classes:
presentes.

Controller:
zero.

Endpoint de negocio:
zero.

Resposta em /:
404 esperada.

Encerramento:
gracioso.
```

---

## Conceito essencial

### Metodo main

O método:

```java
public static void main(
        String[] args
)
```

é o ponto de entrada da JVM.

Spring Boot não substitui esse contrato.

O Java inicia a classe.

Depois, o código chama o Boot.

A ordem conceitual é:

```text
JVM;

main;

SpringApplication;

Environment;

ApplicationContext;

beans;

auto-configuracao;

servidor;

aplicacao pronta.
```

---

### Primary source

Na chamada:

```java
SpringApplication.run(
        FormacaoJavaBackendApiApplication.class,
        args
);
```

a classe principal é a fonte primária.

Ela informa ao Boot onde começar a carregar configuração e componentes.

Não é apenas um nome usado para log.

Ela participa da construção do contexto.

---

### Retorno de run

O método retorna:

```text
ConfigurableApplicationContext.
```

Portanto, você pode escrever:

```java
ConfigurableApplicationContext context =
        SpringApplication.run(
                FormacaoJavaBackendApiApplication.class,
                args
        );
```

Esse retorno representa o contexto em execução.

Ele permite:

- consultar beans;
- consultar Environment;
- obter ID;
- observar tipo;
- fechar o contexto.

Não use o contexto como service locator na aplicação de negócio.

Nesta aula, ele será usado somente para diagnóstico do bootstrap.

---

### @SpringBootApplication

`@SpringBootApplication` é uma annotation de conveniência.

Ela equivale à combinação de:

```text
@SpringBootConfiguration;

@EnableAutoConfiguration;

@ComponentScan.
```

Cada parte possui responsabilidade distinta.

---

### @SpringBootConfiguration

Marca a classe como configuração principal do Boot.

Ela é especializada sobre a configuração Spring.

A classe pode declarar beans, embora nesta aula não declare nenhum.

O projeto deve possuir uma fonte principal clara.

Múltiplas classes principais sem necessidade dificultam testes e bootstrap.

---

### @EnableAutoConfiguration

Ativa o mecanismo de auto-configuração.

A ativação não cria tudo indiscriminadamente.

Ela disponibiliza candidatos e avalia condições.

O resultado depende de:

- classpath;
- propriedades;
- beans existentes;
- tipo de aplicação;
- recursos;
- condições específicas.

---

### @ComponentScan

Procura componentes a partir do package da classe principal.

A classe principal está em:

```text
br.com.formacao.backend.
```

Logo, o scan padrão alcança subpackages como:

```text
br.com.formacao.backend.bootstrap;

br.com.formacao.backend.controller;

br.com.formacao.backend.service.
```

Ele não alcança automaticamente:

```text
com.exemplo.externo.
```

Essa fronteira será comprovada com duas classes de teste.

---

### Package raiz

A classe principal deve ficar em um package raiz acima dos componentes da aplicação.

Estrutura recomendada:

```text
br.com.formacao.backend
├── FormacaoJavaBackendApiApplication
├── config
├── controller
├── service
└── repository
```

Evite:

```text
package default;

classe principal em subpackage profundo;

componentes fora da raiz sem decisão explícita.
```

Mover a classe principal altera a base de scan.

---

### Scan nao e universal

O component scan não lê todos os jars e packages sem limite.

Ele parte de uma base.

Isso reduz:

- tempo;
- conflitos;
- registros acidentais;
- dependência de classes externas.

Quando precisar incluir package externo, faça conscientemente.

A aula atual não ampliará o scan.

---

### SpringApplication

`SpringApplication` coordena o bootstrap.

Responsabilidades conceituais:

1. registrar fontes;
2. preparar listeners;
3. preparar Environment;
4. deduzir tipo de aplicação;
5. criar contexto;
6. carregar configurações;
7. atualizar o contexto;
8. executar runners;
9. publicar eventos;
10. entregar contexto pronto.

Nem todas essas etapas serão customizadas agora.

O objetivo é reconhecer o fluxo.

---

### Deducao do tipo web

O projeto possui Spring Web MVC no classpath.

Também possui infraestrutura servlet e servidor compatível.

Por isso, o Boot deduz:

```text
WebApplicationType.SERVLET.
```

Tipos possíveis:

```text
NONE;

SERVLET;

REACTIVE.
```

A decisão pode ser configurada, mas o projeto usa a dedução padrão.

---

### NONE

`NONE` representa aplicação sem servidor web.

Exemplos:

- CLI;
- job;
- batch;
- processador;
- worker sem HTTP.

Nesta aula, um teste separado poderá iniciar a fonte principal em modo `NONE` apenas para comparar o tipo de contexto.

Isso não altera a aplicação oficial.

---

### SERVLET

`SERVLET` representa aplicação baseada em Spring MVC e Servlet.

O contexto apropriado inclui suporte a servidor web servlet.

O projeto utiliza esse modo.

---

### REACTIVE

`REACTIVE` representa aplicação baseada em stack reativa.

Ela não será usada neste módulo inicial.

Não misture MVC e WebFlux sem decisão arquitetural.

---

### ApplicationContext

O Spring `ApplicationContext` administra:

- bean definitions;
- instâncias;
- lifecycle;
- eventos;
- recursos;
- Environment;
- conversão;
- integração com infraestrutura.

No projeto web servlet, o contexto será uma implementação apropriada para servidor embarcado.

O teste não deve depender de um nome interno instável quando um contrato público suficiente existir.

Ele pode validar:

```text
contexto web servlet;

servidor presente;

Environment disponível.
```

---

### Refresh do contexto

Durante o refresh:

- beans são registrados;
- post-processors atuam;
- componentes são instanciados;
- lifecycle é executado;
- contexto se torna utilizável;
- servidor é iniciado na aplicação web.

Uma falha durante refresh impede o startup completo.

O log precisa ser lido pela causa raiz.

---

### Servidor embarcado

O starter Web MVC disponibiliza suporte a Tomcat.

No startup:

```text
Boot detecta aplicacao servlet;

auto-configura factory do servidor;

cria Tomcat;

inicia conector HTTP;

escuta na porta.
```

O servidor faz parte do processo Java.

Não é necessário instalar Tomcat externamente.

---

### Porta 8080

Sem configuração específica, o servidor embarcado utiliza:

```text
8080.
```

Essa porta será observada nos logs.

A configuração de porta será estudada na aula 359.

Nesta aula, use o default.

Se 8080 estiver ocupada, o startup falhará.

Não troque a porta antes de diagnosticar quem a está usando.

---

### Banner

No startup, o Boot exibe banner.

O banner indica:

- framework;
- versão;
- início do processo.

Ele não comprova que a aplicação terminou de iniciar.

O startup só está completo quando os logs indicam servidor e aplicação prontos.

Customização de banner não é prioridade do módulo.

---

### Logs de startup

Observe linhas equivalentes a:

```text
Starting FormacaoJavaBackendApiApplication;

No active profile set;

Tomcat initialized with port 8080;

Starting service;

Initializing Spring embedded WebApplicationContext;

Tomcat started on port 8080;

Started FormacaoJavaBackendApiApplication.
```

A forma exata pode variar.

Não escreva teste comparando o texto completo do log.

Valide eventos e estado.

---

### Sem endpoint

O servidor pode iniciar sem controller.

Nesse cenário:

```text
processo:
ativo.

porta:
ativa.

servidor:
ativo.

rota de negocio:
inexistente.
```

A resposta 404 é coerente.

Não crie um controller apenas para evitar 404.

Controllers terão aula própria.

---

### Auto-configuracao condicional

Cada auto-configuração avalia condições.

Exemplos conceituais:

```text
classe web presente;

aplicacao servlet;

bean ausente;

propriedade habilitada;

recurso disponível.
```

O relatório registra por que uma configuração combinou ou não.

---

### Positive matches

Positive match significa:

```text
as condições avaliadas combinaram.
```

Isso não garante que toda classe interna foi instanciada da maneira imaginada.

Leia a fonte e os beans quando necessário.

---

### Negative matches

Negative match significa:

```text
ao menos uma condição não combinou.
```

Muitos negative matches são normais.

Uma aplicação não precisa ativar todas as capacidades do Boot.

Exemplo:

```text
JPA ausente;

Flyway ausente;

Security ausente.
```

O relatório não é uma lista de erros.

---

### Unconditional classes

Algumas configurações avaliadas podem não depender de condição.

O relatório também pode registrá-las.

Use essa categoria como parte do mapa, não como indicador de problema.

---

### Exclusions

Auto-configurações podem ser excluídas.

Formas incluem:

- atributo da annotation;
- propriedade;
- configuração programática.

Excluir é uma decisão avançada.

Não use exclusão para esconder uma configuração que não foi compreendida.

Nesta aula, apenas inspecione que o relatório possui essa categoria.

---

### ConditionEvaluationReport

O Boot mantém um relatório de avaliação.

Ele pode ser observado:

- com `--debug`;
- por logging;
- por API de diagnóstico;
- futuramente por Actuator.

Nesta aula, serão usados:

```text
--debug;

ConditionEvaluationReport em teste.
```

Não versione o log completo.

---

### Flag --debug

Executar:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.arguments=--debug"
```

habilita logs adicionais selecionados e imprime o relatório de condições.

Não significa colocar todos os loggers da aplicação em DEBUG.

Procure seções:

```text
Positive matches;

Negative matches;

Exclusions;

Unconditional classes.
```

---

### Back-off

Auto-configuração recua quando a aplicação fornece um bean que satisfaz a mesma responsabilidade e a condição exige ausência.

A lógica comum é:

```text
@ConditionalOnMissingBean.
```

Exemplo conceitual:

```text
Boot pode fornecer componente padrao;

aplicacao declara componente proprio;

configuracao padrao nao e criada.
```

Nesta aula, o back-off será demonstrado em teste isolado com um bean de infraestrutura simples e um `ApplicationContextRunner`, sem alterar a aplicação oficial.

O objetivo é observar o padrão, não decorar uma auto-configuração específica.

---

### ApplicationContextRunner

`ApplicationContextRunner` é uma ferramenta de teste para criar contextos pequenos e inspecionar auto-configurações.

Ele permite:

- adicionar configuração;
- adicionar propriedades;
- adicionar beans;
- executar assertions;
- fechar o contexto.

Ele não será usado para substituir testes completos da aplicação.

Nesta aula, servirá somente para demonstrar uma condição e um back-off de forma rápida.

---

### Args

Os argumentos recebidos pelo método main são repassados ao Boot.

Exemplo:

```powershell
--debug
```

Eles podem virar argumentos de aplicação e propriedades de linha de comando.

A precedência entre fontes será estudada na aula 359.

Agora, apenas observe que os argumentos chegam ao bootstrap.

---

### Encerramento

A aplicação precisa encerrar corretamente.

Formas:

- `Ctrl+C`;
- stop da IDE;
- término do processo;
- fechamento do contexto em teste.

O Boot registra shutdown hook por padrão.

Ao encerrar:

- contexto fecha;
- servidor para;
- beans recebem callbacks;
- recursos são liberados.

Não finalize processos Java indiscriminadamente.

Identifique o PID correto.

---

### Teste @SpringBootTest

O teste gerado utiliza:

```java
@SpringBootTest
```

Por padrão, ele carrega um contexto web mock e não inicia o servidor embarcado real.

Isso explica por que:

```text
contextLoads passa;

porta 8080 nao abre.
```

Para testar servidor real, seria necessário outro `webEnvironment`.

Essa estratégia será aprofundada em testes web futuros.

---

### Diagnostico por camadas

Quando o startup falhar, revise:

```text
1. Java;

2. Maven e dependencias;

3. classe principal;

4. package;

5. classpath;

6. properties;

7. bean duplicado;

8. porta;

9. condition report;

10. causa raiz.
```

Não remova annotations aleatoriamente.

---

### Eventos do bootstrap

Durante o startup, o Boot publica eventos em diferentes momentos.

Exemplos conceituais:

```text
aplicacao iniciando;

Environment preparado;

contexto preparado;

contexto atualizado;

aplicacao iniciada;

aplicacao pronta;

falha.
```

Esses eventos permitem observar o ciclo sem inserir lógica de negócio no método main.

Nesta aula, você não criará listeners customizados.

O objetivo é apenas entender que o startup não é uma operação única e indivisível.

Existe uma sequência.

Essa sequência explica por que determinadas falhas aparecem antes de outras.

Exemplos:

```text
erro de dependencia:
antes do contexto.

erro de bean:
durante o refresh.

porta ocupada:
durante o startup do servidor.

erro em runner:
depois do refresh, antes da aplicacao pronta.
```

Ao diagnosticar, localize em qual etapa o processo parou.

Não trate toda falha como “Tomcat não subiu”.

A causa pode ter ocorrido muito antes da criação do conector HTTP.

Também não coloque consultas de banco, chamadas HTTP ou processamento pesado no método main.

O método main deve permanecer um ponto de bootstrap pequeno.

Inicializações de negócio precisam de componentes próprios, lifecycle controlado e testes.

A aula atual manterá o diagnóstico depois de `run` apenas para tornar o contexto observável.

Quando o aprendizado estiver consolidado, a aplicação deverá evitar acoplamento desnecessário entre o main e detalhes internos do contexto.


## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

O resultado precisa permanecer verde antes das alterações.

---

### 2. Revisar a classe principal

Abra:

```text
src/main/java/br/com/formacao/backend/FormacaoJavaBackendApiApplication.java
```

Identifique:

- package;
- imports;
- annotation;
- classe;
- método main;
- primary source;
- args.

Não mova a classe.

---

### 3. Capturar o contexto

Altere o método main para:

```java
public static void main(
        String[] args
) {
    ConfigurableApplicationContext context =
            SpringApplication.run(
                    FormacaoJavaBackendApiApplication.class,
                    args
            );

    BootstrapDiagnostics.print(
            context
    );
}
```

Importe:

```java
org.springframework.context.ConfigurableApplicationContext;
```

O contexto será usado somente para diagnóstico.

---

### 4. Criar ApplicationContextSnapshot.java

Crie um record:

```java
public record ApplicationContextSnapshot(
        String contextClass,
        String contextId,
        boolean webContext,
        String applicationName,
        int beanDefinitionCount,
        boolean rootProbePresent,
        boolean outsideProbePresent
) {
}
```

Não armazene o contexto dentro do record.

---

### 5. Criar RootPackageProbe.java

Package:

```text
br.com.formacao.backend.bootstrap.
```

Código:

```java
@Component
public class RootPackageProbe {
}
```

Ele prova que subpackages da raiz são escaneados.

Não adicione comportamento de negócio.

---

### 6. Criar OutsidePackageProbe.java

Package:

```text
com.exemplo.externo.
```

Código:

```java
@Component
public class OutsidePackageProbe {
}
```

A classe compila, mas não deve ser registrada pelo scan padrão.

Não amplie `scanBasePackages`.

---

### 7. Criar BootstrapDiagnostics.java

Responsabilidades:

- obter classe do contexto;
- obter ID;
- verificar se é contexto web;
- ler nome da aplicação quando disponível;
- contar bean definitions;
- verificar probes;
- imprimir relatório.

Não imprima todos os beans.

Isso gera ruído e acoplamento.

---

### 8. Detectar contexto web

Use contrato apropriado, por exemplo:

```text
WebApplicationContext.
```

Não compare somente o nome da classe como string.

O snapshot pode guardar o nome para relatório, mas a decisão deve usar tipo.

---

### 9. Executar pela IDE

Execute a classe principal.

Confirme nos logs:

```text
banner;

Spring Boot 4.1.0;

Tomcat;

porta 8080;

Started.
```

Confirme no relatório:

```text
root probe:
true.

outside probe:
false.
```

---

### 10. Testar a porta

Em outro terminal:

```powershell
Test-NetConnection `
  -ComputerName localhost `
  -Port 8080
```

Resultado esperado:

```text
TcpTestSucceeded:
True.
```

---

### 11. Testar a raiz HTTP

Use:

```powershell
curl.exe `
  -i `
  http://localhost:8080/
```

Resultado esperado:

```text
HTTP 404.
```

O formato do body pode variar.

Valide o status, não o corpo inteiro.

---

### 12. Encerrar com Ctrl+C

No terminal da aplicação:

```text
Ctrl+C.
```

Confirme que a porta foi liberada:

```powershell
Test-NetConnection `
  -ComputerName localhost `
  -Port 8080
```

Resultado esperado:

```text
TcpTestSucceeded:
False.
```

---

### 13. Executar com Maven Plugin

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme comportamento equivalente ao run da IDE.

Não execute duas instâncias na mesma porta.

---

### 14. Executar com jar

Empacote:

```powershell
.\mvnw.cmd clean package
```

Depois:

```powershell
java -jar `
  "target\formacao-java-backend-api-0.0.1-SNAPSHOT.jar"
```

Ajuste o nome pela versão do projeto.

Confirme Tomcat e porta.

Encerre com `Ctrl+C`.

---

### 15. Executar com --debug

```powershell
java -jar `
  "target\formacao-java-backend-api-0.0.1-SNAPSHOT.jar" `
  --debug
```

Procure o relatório de condições.

Não copie o log inteiro para documentação.

Registre exemplos selecionados.

---

### 16. Criar MainApplicationMetadataTest

Valide por reflection:

- classe possui `@SpringBootApplication`;
- annotation possui as meta-annotations esperadas;
- método main é público e estático;
- parâmetro é `String[]`;
- package é `br.com.formacao.backend`.

Não execute servidor nesse teste.

---

### 17. Criar ComponentScanBoundaryIT

Use `@SpringBootTest`.

Injete o `ApplicationContext`.

Confirme:

```text
RootPackageProbe:
presente.

OutsidePackageProbe:
ausente.
```

O teste usa contexto mock padrão e não abre porta real.

---

### 18. Criar ServletApplicationContextIT

Use:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Valide:

- contexto servlet;
- servidor iniciado;
- porta maior que zero;
- porta não precisa ser 8080 no teste;
- bean de servidor presente.

Use random port para evitar conflito entre testes.

---

### 19. Criar AutoConfigurationReportIT

Obtenha:

```text
ConditionEvaluationReport.
```

Valide:

- mapa não vazio;
- existem outcomes positivos;
- existem outcomes negativos;
- lista de exclusões acessível;
- classes não condicionais acessíveis.

Não faça assert em centenas de nomes internos.

Escolha apenas uma ou duas capacidades públicas e estáveis.

---

### 20. Criar teste de tipo NONE

Em teste isolado:

```java
SpringApplication application =
        new SpringApplication(
                FormacaoJavaBackendApiApplication.class
        );

application.setWebApplicationType(
        WebApplicationType.NONE
);
```

Execute o contexto e feche com try-with-resources.

Confirme:

- contexto não é web;
- nenhum servidor inicia;
- fonte principal continua válida.

Não altere a aplicação oficial.

---

### 21. Demonstrar back-off

Use um `ApplicationContextRunner`.

Adicione uma configuração de teste com bean customizado relacionado a uma auto-configuração escolhida.

Execute dois cenários:

```text
sem bean customizado:
configuracao padrao presente.

com bean customizado:
padrao recua.
```

Escolha um caso estável e pequeno.

Documente a condição observada.

Não altere o runtime oficial.

---

### 22. Criar scripts externos

Na pasta `scripts` da aula:

`06_iniciar_aplicacao.ps1`:

```powershell
Set-Location formacao-java-backend-api
.\mvnw.cmd spring-boot:run
```

`07_testar_porta.ps1`:

```powershell
Test-NetConnection localhost -Port 8080
curl.exe -i http://localhost:8080/
```

`08_iniciar_com_debug.ps1` inicia com `--debug`.

`09_executar_testes_bootstrap.ps1` executa os testes da aula.

`10_encerrar_aplicacao.ps1` apenas documenta encerramento seguro e valida a porta.

Não mate todos os processos Java.

---

### 23. Criar main-application.md

Explique:

- método main;
- primary source;
- args;
- retorno do run;
- contexto;
- encerramento.

---

### 24. Criar spring-boot-application-decomposta.md

Documente:

```text
@SpringBootConfiguration;

@EnableAutoConfiguration;

@ComponentScan.
```

Inclua responsabilidade de cada uma.

---

### 25. Criar fluxo-spring-application-run.md

Desenhe:

```text
main
-> SpringApplication
-> Environment
-> WebApplicationType
-> ApplicationContext
-> bean definitions
-> auto-configurations
-> refresh
-> Tomcat
-> ready
```

---

### 26. Criar component-scan-boundary.md

Registre:

- package raiz;
- probe interno;
- probe externo;
- resultado;
- risco de mover a classe main;
- quando ampliar scan.

---

### 27. Criar condition-evaluation-report.md

Registre:

- positive matches;
- negative matches;
- exclusions;
- unconditional classes;
- uso de `--debug`;
- cuidado com logs extensos.

---

### 28. Criar back-off.md

Explique:

- bean padrão;
- bean customizado;
- condição missing bean;
- resultado;
- teste isolado;
- responsabilidade assumida.

---

### 29. Criar startup-baseline.md

Registre:

```text
modo:
SERVLET.

servidor:
Tomcat.

porta:
8080.

rota raiz:
404.

root probe:
presente.

outside probe:
ausente.

debug report:
validado.

shutdown:
validado.
```

---

### 30. Executar todos os testes

```powershell
.\mvnw.cmd clean test
```

Resultado esperado:

```text
BUILD SUCCESS.
```

Confirme que os testes encerraram todos os contextos e portas.

---

### 31. Validar o jar novamente

```powershell
.\mvnw.cmd clean package
```

Confirme que o diagnóstico não impede o empacotamento.

---

### 32. Revisar o escopo

Confirme que não foi criado:

- controller;
- endpoint;
- DTO;
- service de negócio;
- repository;
- properties customizadas;
- YAML;
- profile;
- banco;
- security.

A aula é de bootstrap e auto-configuração.

---

## Entendendo o que foi feito

### A classe principal deixou de ser uma caixa preta

Você identificou fonte primária, scan e ativação da auto-configuração.

### O tipo servlet foi comprovado

O classpath web levou à criação de contexto e servidor servlet.

### O component scan ganhou fronteira observavel

Uma classe interna foi registrada; uma externa não foi.

### O condition report explicou decisoes

Positive e negative matches mostraram que ausência também é comportamento esperado.

### O startup foi testado em modos diferentes

Aplicação real, teste mock, random port e modo NONE receberam funções distintas.

---

## Erros comuns importantes

### Mover a classe main para package inferior

Componentes irmãos podem deixar de ser escaneados.

### Considerar todo negative match um erro

Muitos representam capacidades não utilizadas.

### Criar controller para testar o servidor

A porta e o 404 já comprovam o servidor sem antecipar a camada web.

### Executar duas instancias na porta 8080

A segunda falhará por conflito.

### Usar o ApplicationContext como service locator

O acesso direto é apenas diagnóstico nesta aula.

---

## Comandos uteis

### Testes

```powershell
.\mvnw.cmd clean test
```

### Executar

```powershell
.\mvnw.cmd spring-boot:run
```

### Empacotar

```powershell
.\mvnw.cmd clean package
```

### Jar

```powershell
java -jar target\*.jar
```

### Debug

```powershell
java -jar target\*.jar --debug
```

### Porta

```powershell
Test-NetConnection localhost -Port 8080
```

### HTTP

```powershell
curl.exe -i http://localhost:8080/
```

---

## Exercicio guiado

### Parte 1 — Annotation composta

Escreva as três annotations equivalentes a `@SpringBootApplication`.

Explique cada uma.

### Parte 2 — Package raiz

Mova temporariamente `RootPackageProbe` para fora da raiz.

Execute o teste.

Restaure a estrutura.

### Parte 3 — Tipo NONE

Execute o contexto em modo `NONE`.

Compare classe do contexto e ausência de servidor.

### Parte 4 — Random port

Execute o teste com random port.

Explique por que ele é melhor para integração automatizada.

### Parte 5 — Debug report

Escolha:

- um positive match;
- um negative match;
- uma classe não condicional.

Explique sem copiar todo o log.

### Parte 6 — Back-off

Crie um segundo cenário de bean customizado em teste.

Mostre que o padrão recua.

### Parte 7 — Porta ocupada

Inicie uma instância e tente iniciar outra.

Leia a causa raiz.

Encerre ambas corretamente.

### Parte 8 — ADR

Registre:

```text
main no package raiz;

@SpringBootApplication como composição;

SpringApplication.run como bootstrap;

aplicação servlet;

Tomcat embarcado;

porta default 8080;

condition report como diagnóstico;

back-off respeitado;

sem endpoint nesta aula.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 357 foi preservada;
- o mesmo projeto foi continuado;
- classe principal permaneceu no package raiz;
- método main foi aprofundado;
- primary source foi explicada;
- args foram explicados;
- retorno do run foi utilizado;
- `ConfigurableApplicationContext` foi explicado;
- `@SpringBootApplication` foi decomposta;
- `@SpringBootConfiguration` foi explicada;
- `@EnableAutoConfiguration` foi explicada;
- `@ComponentScan` foi explicada;
- scan padrão foi explicado;
- package default foi evitado;
- fronteira de scan foi comprovada;
- probe interno foi registrado;
- probe externo não foi registrado;
- scan não foi ampliado artificialmente;
- `SpringApplication` foi explicado;
- fluxo de bootstrap foi documentado;
- tipo web foi deduzido;
- `NONE` foi explicado;
- `SERVLET` foi explicado;
- `REACTIVE` foi mencionado sem uso;
- aplicação oficial permaneceu servlet;
- contexto web servlet foi validado;
- Environment foi reconhecido;
- refresh foi explicado;
- Tomcat embarcado foi iniciado;
- Tomcat externo não foi exigido;
- porta 8080 foi observada;
- default de porta não foi alterado;
- banner foi observado;
- logs de startup foram analisados;
- estado Started foi diferenciado do banner;
- servidor sem endpoint foi explicado;
- rota raiz retornou 404;
- 404 não foi tratada como falha de servidor;
- auto-configuração condicional foi explicada;
- positive matches foram inspecionados;
- negative matches foram inspecionados;
- negative match não foi tratado como erro;
- exclusions foram reconhecidas;
- unconditional classes foram reconhecidas;
- `ConditionEvaluationReport` foi usado;
- `--debug` foi usado;
- debug não foi confundido com todos os loggers;
- log completo não foi versionado;
- back-off foi explicado;
- missing bean foi relacionado ao back-off;
- back-off foi demonstrado em teste isolado;
- runtime oficial não foi alterado para o experimento;
- `ApplicationContextRunner` foi usado com critério;
- contexto NONE foi fechado;
- contexto de teste random port foi fechado;
- contexto padrão de `@SpringBootTest` foi explicado;
- teste padrão não abriu servidor real;
- random port abriu servidor real;
- conflitos de porta foram evitados nos testes;
- aplicação foi executada pela IDE;
- aplicação foi executada pelo Maven plugin;
- aplicação foi executada por jar;
- jar permaneceu executável;
- porta foi testada;
- HTTP foi testado;
- encerramento por Ctrl+C foi testado;
- shutdown hook foi explicado;
- processos Java não foram mortos indiscriminadamente;
- snapshot de contexto foi criado;
- diagnóstico não listou todos os beans;
- teste de metadata foi criado;
- teste de scan foi criado;
- teste servlet foi criado;
- teste de relatório foi criado;
- teste NONE foi criado;
- scripts da aula foram criados;
- documentação da classe main foi criada;
- documentação da annotation composta foi criada;
- fluxo run foi documentado;
- fronteira de scan foi documentada;
- condition report foi documentado;
- back-off foi documentado;
- baseline de startup foi documentada;
- todos os testes passaram;
- package passou;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhuma property customizada foi adicionada;
- nenhum YAML foi criado;
- nenhum profile foi criado;
- nenhum banco foi adicionado;
- JPA não foi adicionado;
- Flyway não foi adicionado;
- Security não foi adicionado;
- aula 359 não foi antecipada;
- ponte para a aula 359 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m14): compreender bootstrap e auto configuration"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- logs de debug;
- PID;
- target;
- arquivos temporários;
- configurações locais.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você executou conscientemente a primeira aplicação Spring Boot do curso.

O fluxo consolidado foi:

```text
JVM
-> main
-> SpringApplication.run
-> tipo SERVLET
-> ApplicationContext
-> component scan
-> auto-configuration
-> refresh
-> Tomcat
-> porta 8080
-> aplicação pronta.
```

Você decompôs:

```text
@SpringBootApplication
=
@SpringBootConfiguration
+
@EnableAutoConfiguration
+
@ComponentScan.
```

Você comprovou:

```text
classe principal no package raiz;

probe interno registrado;

probe externo ausente;

Tomcat iniciado;

porta ativa;

rota raiz 404;

condition report disponível;

positive matches;

negative matches;

back-off;

encerramento correto.
```

A principal decisão técnica foi:

```text
auto-configuração não é magia;
é resultado de condições observáveis.
```

A próxima aula será:

```text
359 - M14.04 - Application properties YAML e profiles
```

Nela, você continuará no mesmo projeto e estudará:

- `application.properties`;
- `application.yaml`;
- sintaxe properties;
- sintaxe YAML;
- configuração externa;
- fontes de propriedades;
- precedência;
- variáveis de ambiente;
- argumentos;
- placeholders;
- valores padrão;
- profiles;
- `application-dev`;
- `application-test`;
- `application-prod`;
- ativação;
- grupos de profiles;
- dados sensíveis;
- configuração tipada;
- diagnóstico de propriedade;
- porta por ambiente;
- nome da aplicação;
- logging por ambiente.

A aula 358 respondeu:

```text
como o Boot inicia
e decide o que configurar?
```

A aula 359 responderá:

```text
como controlar o comportamento
sem fixar valores no codigo?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei decompor `@SpringBootApplication`.
- [ ] Sei explicar `SpringApplication.run`.
- [ ] Sei explicar por que a aplicação é servlet.
- [ ] Sei ler o relatório de condições.
- [ ] Sei iniciar e encerrar a aplicação conscientemente.

---

## Troubleshooting adicional

### Porta 8080 ocupada

Identifique o processo antes de mudar a configuração.

### Probe interno ausente

Revise package e component scan.

### Probe externo apareceu

Existe scan ampliado ou import explícito.

### Condition report enorme

Filtre por capacidades relacionadas ao experimento.

### Teste deixou porta aberta

Confirme fechamento do contexto e random port.

### Aplicacao inicia e encerra imediatamente

Revise tipo web e presença do servidor.

---

## Perguntas de revisao

1. Quem chama o Boot?
2. O que é primary source?
3. O que `run` retorna?
4. Quais annotations compõem `@SpringBootApplication`?
5. O que faz component scan?
6. Qual é a raiz do scan?
7. Por que a aplicação é servlet?
8. Qual servidor iniciou?
9. Qual porta padrão foi usada?
10. O que significa 404 na raiz?
11. O que é positive match?
12. O que é negative match?
13. Negative match é erro?
14. O que é back-off?
15. Como obter o condition report?
16. `@SpringBootTest` padrão abre servidor?
17. Quando usar random port?
18. Como encerrar a aplicação?
19. Properties foram aprofundadas?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. A JVM por meio do main.
2. Fonte inicial de configuração.
3. Um contexto configurável.
4. Configuration, AutoConfiguration e ComponentScan.
5. Descobre componentes.
6. Package da classe principal.
7. Classpath MVC e servlet.
8. Tomcat.
9. 8080.
10. Servidor ativo sem handler.
11. Condições satisfeitas.
12. Condição não satisfeita.
13. Não necessariamente.
14. Auto-configuração recua.
15. `--debug` ou API.
16. Não.
17. Teste real de servidor.
18. Ctrl+C ou fechamento do contexto.
19. Não.
20. Application properties YAML e profiles.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 358 - M14.03 - Main Application e auto configuration

- Continuei no projeto `formacao-java-backend-api`.
- Aprofundei o método `main`.
- Entendi a primary source.
- Usei o retorno de `SpringApplication.run`.
- Entendi o `ConfigurableApplicationContext`.
- Decompus `@SpringBootApplication`.
- Entendi `@SpringBootConfiguration`.
- Entendi `@EnableAutoConfiguration`.
- Entendi `@ComponentScan`.
- Mantive a classe principal no package raiz.
- Comprovei a fronteira de component scan.
- Registrei um probe interno.
- Mantive um probe externo fora do contexto.
- Entendi o fluxo de `SpringApplication`.
- Diferenciei `NONE`, `SERVLET` e `REACTIVE`.
- Confirmei a aplicação como `SERVLET`.
- Observei o contexto web.
- Iniciei o Tomcat embarcado.
- Observei a porta 8080.
- Diferenciei banner de startup concluído.
- Testei a porta.
- Recebi 404 sem criar endpoint.
- Entendi que 404 não significa servidor parado.
- Executei a aplicação pela IDE.
- Executei pelo Maven plugin.
- Executei pelo jar.
- Usei `--debug`.
- Inspecionei positive matches.
- Inspecionei negative matches.
- Reconheci exclusions e unconditional classes.
- Usei `ConditionEvaluationReport`.
- Entendi o mecanismo de back-off.
- Usei `ApplicationContextRunner` em teste isolado.
- Comparei contexto servlet com modo NONE.
- Usei random port em teste.
- Entendi que `@SpringBootTest` padrão não abre servidor real.
- Encerrei os contextos corretamente.
- Não criei controllers ou endpoints.
- Não antecipei properties, YAML ou profiles.
- Próxima aula: Application properties YAML e profiles.
```

---

## Referencia tecnica curta

```text
main:
entrada JVM.

Primary source:
configuração inicial.

SpringApplication:
bootstrap.

ApplicationContext:
container em execução.

SERVLET:
tipo web.

Tomcat:
servidor.

8080:
porta default.

Condition report:
decisões.

Back-off:
recuo.

Shutdown:
encerramento.
```

Regra final:

```text
a Main Application do Spring Boot deve permanecer no package raiz e atuar como fonte primaria do bootstrap; SpringApplication.run cria e atualiza o contexto adequado ao classpath, a annotation SpringBootApplication combina configuracao, auto-configuracao e component scan, e o servidor embarcado, os beans e as configuracoes resultam de condicoes observaveis que devem ser diagnosticadas por logs, testes, condition report e verificacao de back-off, nunca por suposicao.
```
