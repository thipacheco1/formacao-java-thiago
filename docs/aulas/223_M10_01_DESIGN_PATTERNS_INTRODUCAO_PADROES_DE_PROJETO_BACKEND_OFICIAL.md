# 223 — M10.01 — Design Patterns: introdução a padrões de projeto no backend

## Objetivo da aula

Na aula anterior, você fechou a revisão técnica de SOLID com refatoração guiada.

Você consolidou:

```text
SRP;
OCP;
LSP;
ISP;
DIP;
ports;
adapters;
use case;
DTO;
mapper;
repository;
notificação;
auditoria;
fakes;
contratos;
integração futura com front.
```

Agora começamos o Módulo 10:

```text
Design Patterns — Padrões de Projeto
```

Este módulo vai mostrar padrões recorrentes usados em sistemas backend.

A ideia não é decorar nomes.

A ideia é entender:

```text
qual problema o padrão resolve;
quando vale a pena usar;
quando não vale;
como aplicar em Java;
como isso aparece em backend real;
como isso conversa com SOLID;
como isso prepara Spring Boot, APIs, testes e arquitetura.
```

Ao final desta aula, você deve conseguir:

```text
entender o que são design patterns;
entender por que padrões existem;
diferenciar padrão de projeto, padrão arquitetural e convenção;
identificar padrões que você já usou sem perceber;
entender categorias de padrões;
entender relação entre padrões e SOLID;
evitar overengineering;
preparar-se para estudar Strategy, Factory, Builder, Adapter, Template Method e outros.
```

---

## Ideia principal

Design Pattern é uma solução conhecida para um problema recorrente de design.

Não é uma biblioteca.

Não é uma anotação.

Não é uma regra obrigatória.

É um modelo de solução.

Exemplo:

```text
Problema:
existem várias regras de prioridade e o if está crescendo.

Solução possível:
Strategy Pattern.
```

Exemplo:

```text
Problema:
preciso criar objetos complexos com muitos campos opcionais.

Solução possível:
Builder Pattern.
```

Exemplo:

```text
Problema:
minha aplicação precisa falar com uma API externa, mas não quero acoplar regra de negócio no formato dessa API.

Solução possível:
Adapter Pattern.
```

---

## Padrão não é decoração

Um erro comum é usar pattern para parecer avançado.

Isso é perigoso.

Padrão bom resolve problema real.

Padrão mal usado cria complexidade.

Regra prática:

```text
primeiro entenda o problema;
depois escolha a solução;
não comece pelo nome do padrão.
```

---

## Por que estudar padrões depois de SOLID

SOLID prepara o terreno.

Design Patterns aplicam essas ideias em problemas recorrentes.

Exemplo:

```text
OCP:
aberto para extensão.

Strategy:
forma prática de trocar regras sem if gigante.
```

Exemplo:

```text
DIP:
depender de abstração.

Adapter:
implementação concreta que adapta detalhe externo ao contrato da aplicação.
```

Exemplo:

```text
SRP:
responsabilidade única.

Factory:
responsabilidade de criação concentrada em um lugar.
```

Sem SOLID, patterns viram decoração.

Com SOLID, patterns viram ferramentas.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No Módulo 10, vamos enxergar padrões dentro dessa frase.

Exemplos:

```text
Strategy:
políticas de cálculo e validação.

Factory:
criação de objetos complexos.

Builder:
montagem controlada de objetos.

Adapter:
infraestrutura adaptando contrato externo.

Template Method:
fluxos com estrutura fixa e passos variáveis.

Repository:
padrão de acesso a dados.

Mapper:
conversão entre camadas.

Facade:
simplificação de vários serviços para um ponto de entrada.
```

---

# Parte 1 — O que é um padrão de projeto

## Definição prática

Um padrão de projeto é:

```text
uma solução reutilizável para um problema recorrente de design de software.
```

Ele normalmente descreve:

```text
o problema;
o contexto;
a solução;
as consequências;
os participantes;
os cuidados.
```

Não é copiar e colar código.

É entender o desenho.

---

## Exemplo simples

Problema:

```text
Tenho vários tipos de desconto.
Cada tipo tem uma regra diferente.
O método está ficando cheio de if.
```

Solução recorrente:

```text
criar uma interface PoliticaDesconto;
criar uma classe por regra;
usar uma lista de políticas;
selecionar a política aplicável.
```

Esse desenho é conhecido como:

```text
Strategy.
```

---

## Você já usou padrões sem saber

No Módulo 9, você já usou ideias de padrões.

Exemplo:

```text
PoliticaPrioridadeOs
PrioridadeNormal
PrioridadeCritica
CalculadoraPrioridadeOs
```

Isso se aproxima de:

```text
Strategy Pattern.
```

Exemplo:

```text
ClienteNotificador
WhatsAppClienteNotificador
EmailClienteNotificador
```

Isso se aproxima de:

```text
Adapter/Strategy dependendo do contexto.
```

Exemplo:

```text
OrdemServicoRepository
OrdemServicoRepositoryMemoria
```

Isso é próximo do padrão:

```text
Repository.
```

Exemplo:

```text
OrdemServicoResponseMapper
```

Isso segue a ideia de:

```text
Mapper.
```

O nome vem depois do problema.

---

# Parte 2 — Categorias de padrões

Os padrões clássicos são comumente agrupados em três categorias:

```text
criacionais;
estruturais;
comportamentais.
```

Além deles, em backend usamos também padrões arquiteturais e de camada.

---

## Padrões criacionais

Focam em criação de objetos.

Problemas comuns:

```text
criar objeto complexo;
evitar construtor gigante;
centralizar criação;
escolher implementação correta;
proteger invariantes de criação.
```

Exemplos:

```text
Factory Method;
Abstract Factory;
Builder;
Singleton;
Prototype.
```

No backend, vamos usar bastante:

```text
Factory;
Builder.
```

E vamos discutir com cuidado:

```text
Singleton.
```

---

## Padrões estruturais

Focam em composição entre classes e objetos.

Problemas comuns:

```text
adaptar uma interface externa;
simplificar acesso a subsistemas;
compor funcionalidades;
isolar detalhe técnico;
encapsular integração.
```

Exemplos:

```text
Adapter;
Facade;
Decorator;
Proxy;
Composite;
Bridge.
```

No backend, vamos usar bastante:

```text
Adapter;
Facade;
Decorator;
Proxy conceitualmente.
```

---

## Padrões comportamentais

Focam em comunicação e comportamento entre objetos.

Problemas comuns:

```text
trocar regra em tempo de execução;
organizar fluxo com passos;
encadear validações;
notificar eventos;
encapsular comandos;
evitar if/switch.
```

Exemplos:

```text
Strategy;
Template Method;
Command;
Observer;
Chain of Responsibility;
State;
Mediator.
```

No backend, vamos usar bastante:

```text
Strategy;
Template Method;
Chain of Responsibility;
State;
Command.
```

---

## Padrões arquiteturais e de camada

Nem todo padrão usado no backend é um padrão GoF clássico.

Em backend, também usamos padrões como:

```text
Repository;
DTO;
Mapper;
Service Layer;
Use Case;
Ports and Adapters;
CQRS;
Unit of Work;
Specification.
```

Esses padrões aparecem muito em aplicações reais.

Vamos tratar com clareza quando for padrão de projeto clássico e quando for padrão arquitetural.

---

# Parte 3 — Design Pattern não é framework

Framework é ferramenta.

Pattern é ideia de design.

Exemplo:

```text
Spring:
framework.

Strategy:
padrão.

Repository:
padrão de camada/acesso a dados.

DTO:
padrão de transporte de dados.

Controller:
conceito de camada em arquitetura web.
```

Spring pode facilitar o uso de alguns padrões.

Mas o padrão existe antes do Spring.

Exemplo:

```java
public class PedidoService {
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }
}
```

Isso é DIP e injeção por construtor em Java puro.

Com Spring, o framework monta a dependência.

Mas o desenho é o mesmo.

---

# Parte 4 — Quando usar design patterns

Use pattern quando houver um problema de design real.

Bons sinais:

```text
if/switch crescendo por variação;
criação de objeto ficando complexa;
muitos parâmetros no construtor;
integração externa poluindo use case;
classe fazendo adaptação de formato;
fluxo com passos fixos e partes variáveis;
validações encadeadas;
comportamento mudando por tipo;
necessidade de trocar implementação;
testes difíceis por acoplamento.
```

---

## Quando não usar

Evite pattern quando:

```text
o problema é simples;
não existe variação real;
a abstração ficará artificial;
o padrão vai criar mais classe do que benefício;
você não entendeu o domínio ainda;
a solução simples está clara e segura.
```

Exemplo ruim:

```text
criar interface, factory, builder, strategy e facade para uma regra fixa de duas linhas.
```

Isso é overengineering.

---

## Regra prática

```text
complexidade só se justifica quando reduz outra complexidade maior.
```

Se o padrão aumenta complexidade sem reduzir dor real, ele está atrapalhando.

---

# Parte 5 — Relação com front-end

Mesmo sendo curso backend, os padrões ajudam a organizar como o backend conversa com o front.

Exemplo:

```text
DTO:
define contrato de entrada e saída.

Mapper:
converte entidade para response.

Use Case:
executa fluxo que o endpoint chama.

Exception Handler futuro:
traduz erro para JSON.

Strategy:
permite regra variar sem quebrar contrato da API.

Adapter:
isola API externa sem expor detalhe para o front.
```

Fluxo futuro:

```text
Front
  -> envia JSON

Controller
  -> recebe request DTO

Use Case
  -> executa regra

Entity
  -> protege domínio

Repository/Gateway
  -> acessa infraestrutura

Mapper
  -> monta response DTO

Front
  -> exibe resultado
```

O front não precisa conhecer os patterns internos.

Mas ele se beneficia de um backend organizado e previsível.

---

# Parte 6 — Exemplo de problema sem pattern

Vamos começar com um código simples e ruim.

## Cenário

Um sistema precisa notificar o cliente quando uma OS é aberta.

Canais atuais:

```text
EMAIL;
WHATSAPP;
SMS.
```

Versão ruim:

```java
public class NotificadorRuim {
    public void notificar(String canal, String destino, String mensagem) {
        if ("EMAIL".equals(canal)) {
            System.out.println("[EMAIL] " + destino + " | " + mensagem);
        } else if ("WHATSAPP".equals(canal)) {
            System.out.println("[WHATSAPP] " + destino + " | " + mensagem);
        } else if ("SMS".equals(canal)) {
            System.out.println("[SMS] " + destino + " | " + mensagem);
        } else {
            throw new IllegalArgumentException("Canal inválido.");
        }
    }
}
```

Funciona.

Mas se entrar:

```text
PUSH;
TELEGRAM;
MENSAGERIA_INTERNA;
```

a classe muda toda hora.

Isso é problema de design.

---

# Parte 7 — Estrutura da aula prática

Crie a pasta:

```powershell
mkdir labs\m10\aula-223-design-patterns-introducao
cd labs\m10\aula-223-design-patterns-introducao
```

Estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula223

mkdir src\br\com\curso\aula223\app
mkdir src\br\com\curso\aula223\ruim
mkdir src\br\com\curso\aula223\dominio
mkdir src\br\com\curso\aula223\pattern
mkdir src\br\com\curso\aula223\pattern\notificacao
mkdir src\br\com\curso\aula223\pattern\factory
mkdir src\br\com\curso\aula223\pattern\adapter
```

---

# Parte 8 — Código ruim com if

## NotificadorRuim

Crie:

```text
src\br\com\curso\aula223\ruim\NotificadorRuim.java
```

Código:

```java
package br.com.curso.aula223.ruim;

public class NotificadorRuim {
    public void notificar(String canal, String destino, String mensagem) {
        if (canal == null || canal.isBlank()) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        String canalNormalizado = canal.trim().toUpperCase();

        if ("EMAIL".equals(canalNormalizado)) {
            System.out.println("[EMAIL] " + destino + " | " + mensagem);
            return;
        }

        if ("WHATSAPP".equals(canalNormalizado)) {
            System.out.println("[WHATSAPP] " + destino + " | " + mensagem);
            return;
        }

        if ("SMS".equals(canalNormalizado)) {
            System.out.println("[SMS] " + destino + " | " + mensagem);
            return;
        }

        throw new IllegalArgumentException("Canal não suportado: " + canal);
    }
}
```

---

## NotificadorRuimApp

Crie:

```text
src\br\com\curso\aula223\app\NotificadorRuimApp.java
```

Código:

```java
package br.com.curso.aula223.app;

import br.com.curso.aula223.ruim.NotificadorRuim;

public class NotificadorRuimApp {
    public static void main(String[] args) {
        NotificadorRuim notificador = new NotificadorRuim();

        notificador.notificar("EMAIL", "cliente@empresa.com", "OS aberta com sucesso.");
        notificador.notificar("WHATSAPP", "11999999999", "OS aberta com sucesso.");
        notificador.notificar("SMS", "11999999999", "OS aberta com sucesso.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula223.app.NotificadorRuimApp
```

---

## Diagnóstico

Essa classe viola principalmente:

```text
OCP:
novo canal exige alterar a classe.

SRP:
ela valida, escolhe canal e executa envio.

DIP:
código depende dos detalhes internos de envio.

Testabilidade:
difícil testar canal isolado.
```

Não precisamos decorar padrão ainda.

Precisamos enxergar o problema.

---

# Parte 9 — Melhorando com contrato

## MensagemNotificacao

Crie:

```text
src\br\com\curso\aula223\dominio\MensagemNotificacao.java
```

Código:

```java
package br.com.curso.aula223.dominio;

public class MensagemNotificacao {
    private final String destino;
    private final String conteudo;

    public MensagemNotificacao(String destino, String conteudo) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Conteúdo é obrigatório.");
        }

        this.destino = destino.trim();
        this.conteudo = conteudo.trim();
    }

    public String destino() {
        return destino;
    }

    public String conteudo() {
        return conteudo;
    }
}
```

---

## CanalNotificacao

Crie:

```text
src\br\com\curso\aula223\pattern\notificacao\CanalNotificacao.java
```

Código:

```java
package br.com.curso.aula223.pattern.notificacao;

import br.com.curso.aula223.dominio.MensagemNotificacao;

public interface CanalNotificacao {
    String nome();

    void enviar(MensagemNotificacao mensagem);
}
```

---

## EmailCanalNotificacao

Crie:

```text
src\br\com\curso\aula223\pattern\notificacao\EmailCanalNotificacao.java
```

Código:

```java
package br.com.curso.aula223.pattern.notificacao;

import br.com.curso.aula223.dominio.MensagemNotificacao;

public class EmailCanalNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "EMAIL";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[EMAIL] " + mensagem.destino() + " | " + mensagem.conteudo());
    }
}
```

---

## WhatsAppCanalNotificacao

Crie:

```text
src\br\com\curso\aula223\pattern\notificacao\WhatsAppCanalNotificacao.java
```

Código:

```java
package br.com.curso.aula223.pattern.notificacao;

import br.com.curso.aula223.dominio.MensagemNotificacao;

public class WhatsAppCanalNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "WHATSAPP";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[WHATSAPP] " + mensagem.destino() + " | " + mensagem.conteudo());
    }
}
```

---

## SmsCanalNotificacao

Crie:

```text
src\br\com\curso\aula223\pattern\notificacao\SmsCanalNotificacao.java
```

Código:

```java
package br.com.curso.aula223.pattern.notificacao;

import br.com.curso.aula223.dominio.MensagemNotificacao;

public class SmsCanalNotificacao implements CanalNotificacao {
    @Override
    public String nome() {
        return "SMS";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        System.out.println("[SMS] " + mensagem.destino() + " | " + mensagem.conteudo());
    }
}
```

---

## NotificadorService

Crie:

```text
src\br\com\curso\aula223\pattern\notificacao\NotificadorService.java
```

Código:

```java
package br.com.curso.aula223.pattern.notificacao;

import br.com.curso.aula223.dominio.MensagemNotificacao;

import java.util.List;

public class NotificadorService {
    private final List<CanalNotificacao> canais;

    public NotificadorService(List<CanalNotificacao> canais) {
        if (canais == null || canais.isEmpty()) {
            throw new IllegalArgumentException("Canais são obrigatórios.");
        }

        this.canais = List.copyOf(canais);
    }

    public void notificar(String canal, MensagemNotificacao mensagem) {
        if (canal == null || canal.isBlank()) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        String canalNormalizado = canal.trim().toUpperCase();

        CanalNotificacao canalEncontrado = canais.stream()
                .filter(item -> item.nome().equals(canalNormalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Canal não suportado: " + canal));

        canalEncontrado.enviar(mensagem);
    }
}
```

---

## NotificadorMelhorApp

Crie:

```text
src\br\com\curso\aula223\app\NotificadorMelhorApp.java
```

Código:

```java
package br.com.curso.aula223.app;

import br.com.curso.aula223.dominio.MensagemNotificacao;
import br.com.curso.aula223.pattern.notificacao.EmailCanalNotificacao;
import br.com.curso.aula223.pattern.notificacao.NotificadorService;
import br.com.curso.aula223.pattern.notificacao.SmsCanalNotificacao;
import br.com.curso.aula223.pattern.notificacao.WhatsAppCanalNotificacao;

import java.util.List;

public class NotificadorMelhorApp {
    public static void main(String[] args) {
        NotificadorService notificador = new NotificadorService(List.of(
                new EmailCanalNotificacao(),
                new WhatsAppCanalNotificacao(),
                new SmsCanalNotificacao()
        ));

        MensagemNotificacao mensagem = new MensagemNotificacao(
                "11999999999",
                "OS aberta com sucesso."
        );

        notificador.notificar("WHATSAPP", mensagem);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula223.app.NotificadorMelhorApp
```

---

## Qual pattern apareceu aqui

Esse desenho se aproxima de:

```text
Strategy.
```

Porque cada canal encapsula uma forma de envio.

Também se aproxima de OCP:

```text
novo canal = nova classe.
```

A aula específica de Strategy virá na sequência.

---

# Parte 10 — Um toque de Factory

## Problema

O App ainda monta a lista manualmente.

Isso é aceitável.

Mas em alguns cenários, queremos centralizar criação.

Podemos criar uma factory simples.

---

## NotificadorFactory

Crie:

```text
src\br\com\curso\aula223\pattern\factory\NotificadorFactory.java
```

Código:

```java
package br.com.curso.aula223.pattern.factory;

import br.com.curso.aula223.pattern.notificacao.EmailCanalNotificacao;
import br.com.curso.aula223.pattern.notificacao.NotificadorService;
import br.com.curso.aula223.pattern.notificacao.SmsCanalNotificacao;
import br.com.curso.aula223.pattern.notificacao.WhatsAppCanalNotificacao;

import java.util.List;

public final class NotificadorFactory {
    private NotificadorFactory() {
    }

    public static NotificadorService criarPadrao() {
        return new NotificadorService(List.of(
                new EmailCanalNotificacao(),
                new WhatsAppCanalNotificacao(),
                new SmsCanalNotificacao()
        ));
    }
}
```

---

## NotificadorFactoryApp

Crie:

```text
src\br\com\curso\aula223\app\NotificadorFactoryApp.java
```

Código:

```java
package br.com.curso.aula223.app;

import br.com.curso.aula223.dominio.MensagemNotificacao;
import br.com.curso.aula223.pattern.factory.NotificadorFactory;
import br.com.curso.aula223.pattern.notificacao.NotificadorService;

public class NotificadorFactoryApp {
    public static void main(String[] args) {
        NotificadorService notificador = NotificadorFactory.criarPadrao();

        notificador.notificar(
                "EMAIL",
                new MensagemNotificacao("cliente@empresa.com", "OS aberta com sucesso.")
        );
    }
}
```

---

## Qual pattern apareceu aqui

A ideia se aproxima de:

```text
Factory.
```

A factory centraliza criação de um objeto pronto para uso.

Ainda veremos Factory com mais profundidade.

---

# Parte 11 — Um toque de Adapter

## Problema

Imagine que uma biblioteca externa de SMS tenha outro formato:

```java
enviarSms(String numero, String texto)
```

Mas nossa aplicação trabalha com:

```java
CanalNotificacao.enviar(MensagemNotificacao mensagem)
```

Precisamos adaptar.

---

## SmsExternoClient

Crie:

```text
src\br\com\curso\aula223\pattern\adapter\SmsExternoClient.java
```

Código:

```java
package br.com.curso.aula223.pattern.adapter;

public class SmsExternoClient {
    public void enviarSms(String numero, String texto) {
        System.out.println("[SMS EXTERNO] " + numero + " | " + texto);
    }
}
```

---

## SmsExternoAdapter

Crie:

```text
src\br\com\curso\aula223\pattern\adapter\SmsExternoAdapter.java
```

Código:

```java
package br.com.curso.aula223.pattern.adapter;

import br.com.curso.aula223.dominio.MensagemNotificacao;
import br.com.curso.aula223.pattern.notificacao.CanalNotificacao;

public class SmsExternoAdapter implements CanalNotificacao {
    private final SmsExternoClient client;

    public SmsExternoAdapter(SmsExternoClient client) {
        if (client == null) {
            throw new IllegalArgumentException("Client externo é obrigatório.");
        }

        this.client = client;
    }

    @Override
    public String nome() {
        return "SMS_EXTERNO";
    }

    @Override
    public void enviar(MensagemNotificacao mensagem) {
        client.enviarSms(mensagem.destino(), mensagem.conteudo());
    }
}
```

---

## AdapterApp

Crie:

```text
src\br\com\curso\aula223\app\AdapterApp.java
```

Código:

```java
package br.com.curso.aula223.app;

import br.com.curso.aula223.dominio.MensagemNotificacao;
import br.com.curso.aula223.pattern.adapter.SmsExternoAdapter;
import br.com.curso.aula223.pattern.adapter.SmsExternoClient;
import br.com.curso.aula223.pattern.notificacao.EmailCanalNotificacao;
import br.com.curso.aula223.pattern.notificacao.NotificadorService;

import java.util.List;

public class AdapterApp {
    public static void main(String[] args) {
        NotificadorService notificador = new NotificadorService(List.of(
                new EmailCanalNotificacao(),
                new SmsExternoAdapter(new SmsExternoClient())
        ));

        notificador.notificar(
                "SMS_EXTERNO",
                new MensagemNotificacao("11999999999", "Mensagem enviada por client externo.")
        );
    }
}
```

---

## Qual pattern apareceu aqui

Esse desenho é:

```text
Adapter.
```

Porque uma classe adapta a interface externa para o contrato interno da aplicação.

Isso é extremamente comum em backend.

Exemplos reais:

```text
Gateway de pagamento;
API de CEP;
client de mensageria;
serviço antifraude;
integração com ERP;
integração com SAP;
integração com legado.
```

---

# Parte 12 — Patterns que vamos estudar no módulo

## Strategy

Usado para:

```text
regras variáveis;
políticas;
cálculos;
validações;
prioridades;
descontos;
notificações.
```

---

## Factory

Usado para:

```text
centralizar criação;
escolher implementação;
criar objeto de domínio com regras;
montar serviços em Java puro.
```

---

## Builder

Usado para:

```text
objetos com muitos campos;
requests complexas;
responses complexos;
test data builder;
evitar construtores gigantes.
```

---

## Adapter

Usado para:

```text
integrar APIs externas;
adaptar formato legado;
isolar client externo;
proteger use case de detalhes.
```

---

## Facade

Usado para:

```text
simplificar acesso a vários serviços;
criar uma entrada mais simples para subsistemas;
organizar fluxo de integração.
```

---

## Template Method

Usado para:

```text
fluxo fixo com etapas variáveis;
importação de arquivos;
processamento em lote;
validação padronizada.
```

---

## Chain of Responsibility

Usado para:

```text
cadeia de validações;
pipeline de regras;
tentativas de resolução;
handlers de aprovação.
```

---

## State

Usado para:

```text
comportamento por status;
máquina de estados;
pedido;
ordem de serviço;
workflow.
```

---

## Command

Usado para:

```text
encapsular ações;
fila de execução;
auditoria de comandos;
operações reversíveis;
mensageria.
```

---

## Repository, DTO e Mapper

Também vamos aprofundar padrões comuns de backend:

```text
Repository;
DTO;
Mapper;
Service Layer;
Use Case;
Ports and Adapters.
```

---

# Parte 13 — Patterns e nomes bons

Nome ruim:

```text
Processador;
Manager;
Handler;
Executor;
Strategy;
FactoryGeral;
Util.
```

Nome melhor:

```text
PoliticaDesconto;
CanalNotificacao;
PedidoRepository;
PagamentoGateway;
OrdemServicoMapper;
ProdutoFactory;
ImportacaoTemplate;
ValidadorCliente.
```

O nome deve falar do domínio e da responsabilidade.

Não use nomes genéricos só porque viu em pattern.

---

# Parte 14 — Patterns e overengineering

Overengineering é criar uma solução mais complexa que o problema.

Exemplo:

```text
problema:
uma regra fixa de desconto de 10%.

solução exagerada:
interface;
abstract factory;
strategy;
builder;
facade;
service;
manager;
provider;
resolver.
```

Isso é ruim.

Padrões devem reduzir dor.

Não aumentar cerimônia.

---

## Pergunta prática

Antes de aplicar pattern, pergunte:

```text
qual problema recorrente estou resolvendo?
existe variação real?
o código atual está difícil de manter?
o pattern melhora teste?
o pattern reduz acoplamento?
o pattern melhora clareza?
ou estou só querendo usar pattern?
```

---

# Parte 15 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula223.app.NotificadorRuimApp
java -cp out br.com.curso.aula223.app.NotificadorMelhorApp
java -cp out br.com.curso.aula223.app.NotificadorFactoryApp
java -cp out br.com.curso.aula223.app.AdapterApp
```

Depois responda:

```text
1. Qual era o problema do NotificadorRuim?
2. Qual contrato foi criado?
3. Como Email, WhatsApp e SMS foram separados?
4. Qual pattern apareceu na solução dos canais?
5. Qual o papel da factory?
6. Qual problema o adapter resolveu?
7. Como isso se conecta com OCP?
8. Como isso se conecta com DIP?
9. Como isso se conecta com backend real?
10. Quando essa solução seria exagerada?
```

---

# Parte 16 — Exercício prático

## Contexto

Crie um fluxo simples de cálculo de taxa de entrega.

Tipos:

```text
NORMAL;
EXPRESSA;
AGENDADA;
RETIRADA_LOJA.
```

Regras:

```text
NORMAL:
R$ 20,00.

EXPRESSA:
R$ 45,00.

AGENDADA:
R$ 30,00.

RETIRADA_LOJA:
R$ 0,00.
```

---

## Versão ruim

Crie:

```text
CalculadoraTaxaEntregaRuim
```

com:

```java
BigDecimal calcular(String tipoEntrega)
```

usando `if`.

---

## Versão melhor

Crie:

```text
PoliticaTaxaEntrega
```

Métodos:

```java
boolean aplica(String tipoEntrega);

BigDecimal calcular();

String nome();
```

Implementações:

```text
TaxaEntregaNormal;
TaxaEntregaExpressa;
TaxaEntregaAgendada;
TaxaEntregaRetiradaLoja.
```

Crie:

```text
CalculadoraTaxaEntrega
```

que recebe:

```java
List<PoliticaTaxaEntrega>
```

---

## Desafio

Adicione:

```text
ENTREGA_VIP
```

Taxa:

```text
R$ 10,00.
```

Sem alterar a calculadora.

---

## Perguntas

```text
1. Qual problema havia na versão ruim?
2. Qual pattern aparece na versão melhor?
3. Qual princípio SOLID foi beneficiado?
4. Como adicionar nova regra?
5. Quando essa estrutura seria exagerada?
```

---

# Parte 17 — Simulado rápido

## Questão 1

Design Pattern é:

```text
A) Uma solução reutilizável para um problema recorrente de design.
B) Uma biblioteca obrigatória do Java.
C) Uma anotação do Spring.
D) Um tipo de banco de dados.
```

---

## Questão 2

Qual categoria foca em criação de objetos?

```text
A) Criacional.
B) Estrutural.
C) Comportamental.
D) HTTP.
```

---

## Questão 3

Qual categoria foca em comunicação e comportamento entre objetos?

```text
A) Comportamental.
B) Criacional.
C) Estrutural.
D) SQL.
```

---

## Questão 4

Adapter é útil quando:

```text
A) Preciso adaptar uma interface externa para o contrato interno.
B) Preciso somar dois números.
C) Preciso declarar variável local.
D) Preciso criar enum obrigatoriamente.
```

---

## Questão 5

Strategy é útil quando:

```text
A) Tenho várias regras intercambiáveis.
B) Tenho uma constante final.
C) Tenho um único if de null.
D) Tenho apenas um construtor vazio.
```

---

## Questão 6

Factory é útil quando:

```text
A) Quero centralizar criação de objetos.
B) Quero imprimir no console.
C) Quero substituir LocalDate.
D) Quero evitar todos os métodos.
```

---

## Questão 7

Overengineering é:

```text
A) Usar complexidade maior do que o problema justifica.
B) Escrever código limpo.
C) Nomear variáveis.
D) Usar Java.
```

---

## Questão 8

Padrões se relacionam com SOLID porque:

```text
A) muitos padrões aplicam princípios SOLID em problemas recorrentes.
B) patterns substituem completamente SOLID.
C) SOLID só serve para frontend.
D) patterns impedem testes.
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

# Parte 18 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é Design Pattern.
[ ] Sei que pattern não é biblioteca.
[ ] Sei que pattern não é decoração.
[ ] Sei diferenciar criacional, estrutural e comportamental.
[ ] Sei que Strategy resolve variações de comportamento.
[ ] Sei que Factory centraliza criação.
[ ] Sei que Adapter adapta contrato externo.
[ ] Sei identificar overengineering.
[ ] Sei relacionar patterns com SOLID.
[ ] Sei explicar como patterns aparecem no backend.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é um design pattern?
2. Por que estudar patterns depois de SOLID?
3. Qual risco de aplicar pattern sem problema real?
4. O que é pattern criacional?
5. O que é pattern estrutural?
6. O que é pattern comportamental?
7. Onde Strategy apareceu na aula?
8. Onde Factory apareceu?
9. Onde Adapter apareceu?
10. Como isso vai ajudar quando chegarmos em Spring?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o conceito de Design Patterns;
entender categorias de padrões;
identificar patterns já usados;
refatorar if por canal de notificação;
criar contrato de canal;
criar factory simples;
criar adapter simples;
explicar relação com SOLID;
evitar overengineering;
resolver o exercício de taxa de entrega.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-223-design-patterns-introducao
git commit -m "Aula 223: introducao design patterns backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Design Patterns são ferramentas para resolver problemas recorrentes de design, não enfeites para deixar o código sofisticado.
```

Você estudou:

```text
o que são padrões;
por que eles existem;
categorias;
relação com SOLID;
Strategy de forma introdutória;
Factory de forma introdutória;
Adapter de forma introdutória;
overengineering;
uso no backend;
conversa futura com front.
```

Na próxima aula, vamos aprofundar o primeiro padrão comportamental do módulo:

```text
Strategy Pattern.
```

Vamos aplicar Strategy em:

```text
políticas de desconto;
prioridade;
validação;
taxa;
notificação;
regras de backend.
```
