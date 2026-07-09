# 215 — M9.01 — SOLID: introdução, motivação e problemas que resolve

## Objetivo da aula

Na aula anterior, você fechou o Módulo 8.

Você consolidou:

```text
exceptions;
Resultado;
I/O;
CSV;
Date/Time;
Instant;
UUID;
correlationId;
validações;
modelagem por camada;
simulado técnico.
```

Agora começamos um dos módulos mais importantes da formação:

```text
Módulo 9 — SOLID.
```

SOLID é um conjunto de cinco princípios de design orientado a objetos que ajudam a criar código:

```text
mais organizado;
mais testável;
mais fácil de manter;
mais fácil de evoluir;
menos acoplado;
mais coeso;
menos frágil a mudanças.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é SOLID;
entender por que SOLID existe;
entender quais problemas SOLID resolve;
diferenciar código que funciona de código que evolui;
entender coesão;
entender acoplamento;
entender rigidez;
entender fragilidade;
entender imobilidade;
conhecer os 5 princípios;
identificar sinais de código ruim;
entender por que SOLID importa em backend;
preparar o terreno para estudar SRP, OCP, LSP, ISP e DIP.
```

---

## Ideia principal

Código ruim pode funcionar.

Esse é o ponto.

Um sistema pode:

```text
compilar;
rodar;
passar no teste manual;
entregar valor hoje;
```

e mesmo assim estar mal desenhado.

O problema aparece quando você precisa:

```text
alterar;
corrigir;
testar;
reaproveitar;
trocar implementação;
adicionar regra;
remover comportamento;
integrar com outro sistema;
dar manutenção depois de meses.
```

SOLID existe para reduzir o custo dessas mudanças.

---

## Código que funciona vs código que evolui

Código que funciona:

```text
resolve o problema agora.
```

Código que evolui:

```text
resolve o problema agora sem destruir o futuro.
```

Esse é o ponto central do Módulo 9.

Até aqui, você aprendeu muita construção:

```text
classes;
objetos;
coleções;
generics;
streams;
exceptions;
arquivos;
datas;
utilitários.
```

Agora vamos aprender a organizar essas peças com princípios de design.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

SOLID vai fortalecer essa frase.

Com SOLID, você começa a entender por que é ruim colocar tudo em uma única classe.

Exemplo ruim:

```text
Controller recebe;
Controller valida;
Controller calcula regra;
Controller lê arquivo;
Controller salva no banco;
Controller chama API externa;
Controller monta resposta;
Controller trata erro;
Controller gera relatório.
```

Isso pode funcionar.

Mas vira uma classe difícil de manter.

A separação correta protege o sistema.

---

## O que significa SOLID

SOLID é um acrônimo:

```text
S — Single Responsibility Principle
O — Open/Closed Principle
L — Liskov Substitution Principle
I — Interface Segregation Principle
D — Dependency Inversion Principle
```

Em português:

```text
S — Princípio da Responsabilidade Única
O — Princípio do Aberto/Fechado
L — Princípio da Substituição de Liskov
I — Princípio da Segregação de Interfaces
D — Princípio da Inversão de Dependência
```

Vamos estudar cada um em aulas separadas.

Nesta aula, o foco é entender o motivo.

---

## Por que SOLID importa para backend Java

Backend Java costuma crescer.

No começo, o código é pequeno:

```text
1 controller;
1 service;
1 repository;
1 entidade;
1 fluxo.
```

Depois entram:

```text
mais regras;
mais clientes;
mais integrações;
mais bancos;
mais validações;
mais exceções;
mais filas;
mais relatórios;
mais endpoints;
mais autenticação;
mais auditoria;
mais testes;
mais ambientes.
```

Sem princípios de design, o sistema começa a ficar:

```text
difícil de alterar;
difícil de testar;
difícil de entender;
difícil de reutilizar;
cheio de if;
cheio de dependência direta;
cheio de classes gigantes;
cheio de efeitos colaterais.
```

SOLID ajuda a controlar esse crescimento.

---

## SOLID não é enfeite

SOLID não existe para deixar código “bonito” apenas.

SOLID ajuda a reduzir problemas reais:

```text
alteração pequena quebrando várias partes;
classe gigante;
teste difícil;
duplicação de regra;
dependência direta em infraestrutura;
if crescendo sem controle;
reuso impossível;
interfaces grandes demais;
herança mal usada;
código impossível de trocar sem reescrever tudo.
```

Em backend profissional, isso custa tempo, dinheiro e confiança.

---

# Parte 1 — Os problemas que SOLID resolve

## Problema 1 — Classe com responsabilidades demais

Exemplo ruim:

```java
public class PedidoService {
    public void processarPedido() {
        // valida cliente
        // calcula desconto
        // calcula frete
        // salva no banco
        // chama API de pagamento
        // envia e-mail
        // registra auditoria
        // gera arquivo
    }
}
```

Essa classe tem responsabilidades demais.

Se mudar o cálculo de frete, altera `PedidoService`.

Se mudar envio de e-mail, altera `PedidoService`.

Se mudar banco, altera `PedidoService`.

Se mudar pagamento, altera `PedidoService`.

Isso é um sinal de baixa coesão.

---

## Problema 2 — Mudança pequena exige alterar código existente

Imagine:

```java
public BigDecimal calcularDesconto(String tipoCliente, BigDecimal valor) {
    if ("COMUM".equals(tipoCliente)) {
        return BigDecimal.ZERO;
    }

    if ("VIP".equals(tipoCliente)) {
        return valor.multiply(new BigDecimal("0.10"));
    }

    if ("PREMIUM".equals(tipoCliente)) {
        return valor.multiply(new BigDecimal("0.20"));
    }

    return BigDecimal.ZERO;
}
```

Quando entra novo tipo:

```text
BLACK;
PARCEIRO;
FUNCIONARIO;
CAMPANHA;
```

você altera o método.

E cada alteração pode quebrar o que já funcionava.

Esse é o tipo de problema que o OCP ajuda a resolver.

---

## Problema 3 — Herança quebrando comportamento

Imagine:

```java
class Ave {
    void voar() {
        System.out.println("Voando");
    }
}

class Pinguim extends Ave {
    @Override
    void voar() {
        throw new UnsupportedOperationException("Pinguim não voa");
    }
}
```

O problema:

```text
se Pinguim é uma Ave, o código que espera uma Ave pode chamar voar.
```

Mas Pinguim quebra essa expectativa.

Isso é um problema de substituição.

Esse é o tipo de problema que o LSP ajuda a resolver.

---

## Problema 4 — Interface grande demais

Imagine:

```java
public interface Funcionario {
    void programar();
    void testar();
    void vender();
    void emitirNotaFiscal();
    void dirigirCaminhao();
}
```

Agora todo funcionário precisa implementar métodos que talvez não façam sentido.

Isso gera código artificial:

```java
@Override
public void dirigirCaminhao() {
    throw new UnsupportedOperationException();
}
```

Esse é o tipo de problema que o ISP ajuda a resolver.

---

## Problema 5 — Classe depende diretamente de implementação concreta

Exemplo ruim:

```java
public class PedidoService {
    private final EmailSender emailSender = new EmailSender();

    public void finalizarPedido() {
        emailSender.enviar("Pedido finalizado");
    }
}
```

Problemas:

```text
difícil trocar e-mail por WhatsApp;
difícil testar sem enviar e-mail real;
difícil simular falha;
difícil usar outra implementação.
```

Esse é o tipo de problema que o DIP ajuda a resolver.

---

# Parte 2 — Conceitos base antes de SOLID

Antes de entrar nos princípios, você precisa entender três conceitos:

```text
coesão;
acoplamento;
mudança.
```

---

## Coesão

Coesão é o quanto uma classe tem um propósito claro.

Classe coesa:

```text
faz uma coisa bem definida;
tem métodos relacionados;
tem motivo claro para existir;
não mistura regra, arquivo, banco, API e impressão.
```

Classe pouco coesa:

```text
faz muitas coisas diferentes;
muda por muitos motivos;
tem métodos sem relação;
vira classe utilitária gigante;
fica difícil de nomear.
```

---

## Exemplo de baixa coesão

```java
public class SistemaUtil {
    public void validarPedido() {
    }

    public void enviarEmail() {
    }

    public void salvarArquivo() {
    }

    public void calcularFrete() {
    }

    public void conectarBanco() {
    }
}
```

Nome genérico geralmente denuncia problema:

```text
SistemaUtil;
GeralService;
Processador;
Manager;
Helper;
TudoService;
Utils;
```

Nem sempre é errado, mas é sinal de alerta.

---

## Exemplo de alta coesão

```text
PedidoFaturamentoService:
coordena faturamento de pedido.

CalculadoraFrete:
calcula frete.

PedidoRepository:
salva e busca pedido.

EmailPedidoNotificador:
envia notificação de pedido.

Pedido:
protege regra do pedido.
```

Cada classe tem um motivo claro para existir.

---

## Acoplamento

Acoplamento é o quanto uma classe depende de outra.

Acoplamento alto:

```text
classe depende diretamente de detalhes;
trocar uma parte exige mexer em várias;
teste fica difícil;
infraestrutura invade regra de negócio.
```

Acoplamento baixo:

```text
classe depende de abstrações;
detalhes ficam isolados;
trocas são mais simples;
testes ficam mais fáceis.
```

---

## Exemplo de alto acoplamento

```java
public class PedidoService {
    private final PedidoArquivoRepository repository = new PedidoArquivoRepository();
    private final EmailSmtpClient emailClient = new EmailSmtpClient();
}
```

O service está preso em:

```text
arquivo;
SMTP;
implementações concretas.
```

---

## Exemplo de menor acoplamento

```java
public class PedidoService {
    private final PedidoRepository repository;
    private final PedidoNotificador notificador;

    public PedidoService(PedidoRepository repository, PedidoNotificador notificador) {
        this.repository = repository;
        this.notificador = notificador;
    }
}
```

Agora o service depende de contratos.

A implementação pode mudar.

---

## Mudança

Todo sistema muda.

Mudança é o centro da engenharia de software.

Tipos de mudança:

```text
nova regra;
novo cliente;
novo banco;
novo endpoint;
novo formato de arquivo;
nova integração;
novo tipo de desconto;
novo canal de notificação;
novo status;
novo relatório;
nova validação.
```

SOLID ajuda o código a absorver mudanças com menor impacto.

---

# Parte 3 — Os cinco princípios em visão geral

## S — Single Responsibility Principle

Princípio da Responsabilidade Única.

Ideia:

```text
uma classe deve ter um único motivo para mudar.
```

Não significa que a classe só pode ter um método.

Significa que seus métodos devem estar relacionados a uma responsabilidade.

Exemplo:

```text
PedidoCsvParser:
muda se mudar o formato CSV de pedido.

PedidoService:
muda se mudar o fluxo de pedido.

Pedido:
muda se mudar a regra interna de pedido.
```

---

## O — Open/Closed Principle

Princípio do Aberto/Fechado.

Ideia:

```text
o código deve estar aberto para extensão e fechado para modificação.
```

Ou seja:

```text
adicionar comportamento novo sem ficar alterando código antigo o tempo todo.
```

Exemplo:

```text
novo tipo de desconto;
nova forma de pagamento;
novo canal de notificação.
```

Em vez de aumentar um `if`, você cria nova implementação.

---

## L — Liskov Substitution Principle

Princípio da Substituição de Liskov.

Ideia:

```text
uma subclasse deve poder substituir a classe base sem quebrar o comportamento esperado.
```

Se uma classe filha precisa lançar:

```java
UnsupportedOperationException
```

para um método herdado, há sinal de problema.

LSP ajuda a evitar heranças falsas.

---

## I — Interface Segregation Principle

Princípio da Segregação de Interfaces.

Ideia:

```text
interfaces devem ser específicas, não gigantes.
```

Melhor ter várias interfaces pequenas do que uma interface grande obrigando classes a implementar métodos que não usam.

Exemplo:

```text
Imprimivel;
Exportavel;
Notificavel;
Persistivel.
```

em vez de:

```text
OperacaoCompletaComTudo.
```

---

## D — Dependency Inversion Principle

Princípio da Inversão de Dependência.

Ideia:

```text
módulos de alto nível não devem depender de detalhes;
ambos devem depender de abstrações.
```

Em backend:

```text
use case não deveria depender diretamente de banco, arquivo ou API externa concreta.
```

Ele deveria depender de contratos:

```text
PedidoRepository;
PagamentoGateway;
NotificadorPedido;
ArquivoStorage.
```

---

# Parte 4 — SOLID e camadas

## Entidade

Entidade deve ter regra de negócio.

Exemplo:

```java
pedido.faturar();
pedido.cancelar();
produto.vender(quantidade);
contrato.vigenteEm(hoje);
```

Entidade não deve:

```text
salvar no banco;
ler CSV;
chamar API;
imprimir no console;
montar HTTP response.
```

---

## Use case / service

Service coordena fluxo.

Exemplo:

```text
buscar pedido;
validar existência;
chamar regra da entidade;
salvar;
registrar auditoria;
notificar.
```

Ele não deve virar classe que faz tudo.

---

## Repository

Repository salva e busca.

Exemplo:

```java
Optional<Pedido> buscarPorCodigo(String codigo);
void salvar(Pedido pedido);
```

Ele não decide regra de negócio.

---

## Client / Gateway

Client integra.

Exemplo:

```text
API de pagamento;
API de mensageria;
sistema externo;
serviço de CEP;
gateway de arquivo.
```

Ele encapsula detalhe externo.

---

## Controller futuro

Controller recebe requisição.

Ele deve:

```text
receber dados;
chamar use case;
traduzir resposta;
traduzir erro.
```

Ele não deve concentrar regra.

---

# Parte 5 — Exemplo inicial sem SOLID

## PedidoService ruim

Crie mentalmente esta classe:

```java
public class PedidoService {
    public void finalizarPedido(String codigoPedido) {
        // busca pedido no banco
        // valida se existe
        // valida se está pago
        // calcula desconto
        // calcula frete
        // altera status
        // salva no banco
        // envia e-mail
        // gera arquivo de auditoria
        // imprime no console
    }
}
```

Essa classe tem muitos motivos para mudar.

Mudou banco?

```text
altera PedidoService.
```

Mudou regra de desconto?

```text
altera PedidoService.
```

Mudou e-mail?

```text
altera PedidoService.
```

Mudou auditoria?

```text
altera PedidoService.
```

Isso é o tipo de problema que SOLID combate.

---

## Separação melhor

Uma versão melhor teria:

```text
Pedido:
regras internas.

PedidoRepository:
buscar/salvar.

CalculadoraDesconto:
calcular desconto.

CalculadoraFrete:
calcular frete.

PedidoNotificador:
notificar.

AuditoriaService:
registrar auditoria.

PedidoFinalizacaoUseCase:
coordenar fluxo.
```

O use case coordena.

Ele não faz tudo sozinho.

---

# Parte 6 — Criando exemplo prático da aula

Vamos montar um exemplo pequeno para enxergar o problema.

## Estrutura

Use a pasta já criada da aula:

```text
labs\m9\aula-215-solid-introducao-motivacao-problemas
```

Se preferir manter exatamente o nome do arquivo da aula, crie:

```powershell
mkdir labs\m9\aula-215-solid-introducao-motivacao-problemas
cd labs\m9\aula-215-solid-introducao-motivacao-problemas
```

Estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula215
mkdir src\br\com\curso\aula215\app
mkdir src\br\com\curso\aula215\dominio
mkdir src\br\com\curso\aula215\dominio\pedido
mkdir src\br\com\curso\aula215\ruim
mkdir src\br\com\curso\aula215\melhor
```

---

# Parte 7 — Domínio Pedido

## Pedido

Crie:

```text
src\br\com\curso\aula215\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula215.dominio.pedido;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private boolean pago;
    private boolean faturado;

    public Pedido(String codigo, String cliente, BigDecimal valor, boolean pago) {
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
        this.pago = pago;
        this.faturado = false;
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

    public boolean pago() {
        return pago;
    }

    public boolean faturado() {
        return faturado;
    }

    public void faturar() {
        if (!pago) {
            throw new IllegalStateException("Pedido não pago não pode ser faturado: " + codigo);
        }

        if (faturado) {
            throw new IllegalStateException("Pedido já faturado: " + codigo);
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

# Parte 8 — Código ruim proposital

## PedidoServiceRuim

Crie:

```text
src\br\com\curso\aula215\ruim\PedidoServiceRuim.java
```

Código:

```java
package br.com.curso.aula215.ruim;

import br.com.curso.aula215.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoServiceRuim {
    public void finalizar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.pago()) {
            throw new IllegalStateException("Pedido não pago.");
        }

        BigDecimal desconto;

        if (pedido.valor().compareTo(new BigDecimal("1000")) >= 0) {
            desconto = pedido.valor().multiply(new BigDecimal("0.10"));
        } else {
            desconto = BigDecimal.ZERO;
        }

        BigDecimal valorFinal = pedido.valor().subtract(desconto);

        pedido.faturar();

        System.out.println("Salvando pedido no banco: " + pedido.codigo());
        System.out.println("Enviando e-mail para cliente: " + pedido.cliente());
        System.out.println("Gerando auditoria: " + Instant.now());
        System.out.println("Valor final: " + valorFinal);
    }
}
```

---

## PedidoServiceRuimApp

Crie:

```text
src\br\com\curso\aula215\app\PedidoServiceRuimApp.java
```

Código:

```java
package br.com.curso.aula215.app;

import br.com.curso.aula215.dominio.pedido.Pedido;
import br.com.curso.aula215.ruim.PedidoServiceRuim;

import java.math.BigDecimal;

public class PedidoServiceRuimApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                true
        );

        PedidoServiceRuim service = new PedidoServiceRuim();

        service.finalizar(pedido);

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula215.app.PedidoServiceRuimApp
```

---

## O que está ruim

A classe faz:

```text
validação;
regra de desconto;
faturamento;
persistência simulada;
e-mail simulado;
auditoria simulada;
impressão.
```

Ela tem muitos motivos para mudar.

Isso fere principalmente:

```text
SRP.
```

Também começa a ferir:

```text
OCP;
DIP.
```

Ainda não vamos corrigir tudo agora.

Vamos apenas enxergar o problema.

---

# Parte 9 — Separação melhor

Agora vamos separar responsabilidades.

## CalculadoraDesconto

Crie:

```text
src\br\com\curso\aula215\melhor\CalculadoraDesconto.java
```

Código:

```java
package br.com.curso.aula215.melhor;

import br.com.curso.aula215.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class CalculadoraDesconto {
    public BigDecimal calcular(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.valor().compareTo(new BigDecimal("1000")) >= 0) {
            return pedido.valor().multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }
}
```

---

## PedidoRepositorySimulado

Crie:

```text
src\br\com\curso\aula215\melhor\PedidoRepositorySimulado.java
```

Código:

```java
package br.com.curso.aula215.melhor;

import br.com.curso.aula215.dominio.pedido.Pedido;

public class PedidoRepositorySimulado {
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("Salvando pedido: " + pedido.codigo());
    }
}
```

---

## PedidoNotificadorSimulado

Crie:

```text
src\br\com\curso\aula215\melhor\PedidoNotificadorSimulado.java
```

Código:

```java
package br.com.curso.aula215.melhor;

import br.com.curso.aula215.dominio.pedido.Pedido;

public class PedidoNotificadorSimulado {
    public void notificarFaturamento(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("Notificando cliente: " + pedido.cliente());
    }
}
```

---

## AuditoriaSimulada

Crie:

```text
src\br\com\curso\aula215\melhor\AuditoriaSimulada.java
```

Código:

```java
package br.com.curso.aula215.melhor;

import java.time.Instant;

public class AuditoriaSimulada {
    public void registrar(String descricao, Instant agora) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        System.out.println("Auditoria: " + descricao + " | " + agora);
    }
}
```

---

## PedidoFinalizacaoService

Crie:

```text
src\br\com\curso\aula215\melhor\PedidoFinalizacaoService.java
```

Código:

```java
package br.com.curso.aula215.melhor;

import br.com.curso.aula215.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoFinalizacaoService {
    private final CalculadoraDesconto calculadoraDesconto;
    private final PedidoRepositorySimulado repository;
    private final PedidoNotificadorSimulado notificador;
    private final AuditoriaSimulada auditoria;

    public PedidoFinalizacaoService(
            CalculadoraDesconto calculadoraDesconto,
            PedidoRepositorySimulado repository,
            PedidoNotificadorSimulado notificador,
            AuditoriaSimulada auditoria
    ) {
        if (calculadoraDesconto == null) {
            throw new IllegalArgumentException("Calculadora de desconto é obrigatória.");
        }

        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.calculadoraDesconto = calculadoraDesconto;
        this.repository = repository;
        this.notificador = notificador;
        this.auditoria = auditoria;
    }

    public BigDecimal finalizar(Pedido pedido, Instant agora) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        BigDecimal desconto = calculadoraDesconto.calcular(pedido);
        BigDecimal valorFinal = pedido.valor().subtract(desconto);

        pedido.faturar();

        repository.salvar(pedido);
        notificador.notificarFaturamento(pedido);
        auditoria.registrar("Pedido faturado: " + pedido.codigo(), agora);

        return valorFinal;
    }
}
```

---

## PedidoFinalizacaoServiceApp

Crie:

```text
src\br\com\curso\aula215\app\PedidoFinalizacaoServiceApp.java
```

Código:

```java
package br.com.curso.aula215.app;

import br.com.curso.aula215.dominio.pedido.Pedido;
import br.com.curso.aula215.melhor.AuditoriaSimulada;
import br.com.curso.aula215.melhor.CalculadoraDesconto;
import br.com.curso.aula215.melhor.PedidoFinalizacaoService;
import br.com.curso.aula215.melhor.PedidoNotificadorSimulado;
import br.com.curso.aula215.melhor.PedidoRepositorySimulado;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoFinalizacaoServiceApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "PED-002",
                "Carlos",
                new BigDecimal("1500.00"),
                true
        );

        PedidoFinalizacaoService service = new PedidoFinalizacaoService(
                new CalculadoraDesconto(),
                new PedidoRepositorySimulado(),
                new PedidoNotificadorSimulado(),
                new AuditoriaSimulada()
        );

        BigDecimal valorFinal = service.finalizar(pedido, Instant.now());

        System.out.println("Valor final: " + valorFinal);
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula215.app.PedidoFinalizacaoServiceApp
```

---

## O que melhorou

Agora temos:

```text
CalculadoraDesconto:
calcula desconto.

PedidoRepositorySimulado:
salva pedido.

PedidoNotificadorSimulado:
notifica cliente.

AuditoriaSimulada:
registra auditoria.

PedidoFinalizacaoService:
coordena o fluxo.

Pedido:
decide faturamento.
```

Ainda não está perfeito.

Mas já está melhor.

Nas próximas aulas, vamos evoluir isso com cada princípio.

---

# Parte 10 — O que SOLID não é

## SOLID não é regra cega

Não aplique SOLID de forma mecânica.

Exemplo ruim:

```text
criar 15 interfaces para um sistema minúsculo;
separar cada linha em uma classe;
criar abstração antes de existir variação;
usar padrão só para parecer avançado.
```

SOLID precisa resolver problema real de design.

---

## SOLID não significa código gigante

O objetivo não é aumentar código.

O objetivo é reduzir acoplamento ruim e melhorar organização.

Às vezes uma classe simples está correta.

Às vezes separar demais piora.

O julgamento técnico importa.

---

## SOLID não substitui regra de negócio

SOLID organiza código.

Mas não cria regra correta sozinho.

Você ainda precisa entender:

```text
domínio;
fluxo;
dados;
validações;
erros;
integrações.
```

---

# Parte 11 — Sinais de que SOLID pode ajudar

Fique atento quando encontrar:

```text
classe com 500 linhas;
método com 200 linhas;
muito if por tipo;
switch gigante;
classe chamada Manager;
classe chamada Util com regra de negócio;
service salvando arquivo e chamando API e calculando regra;
teste difícil de escrever;
new espalhado para dependências concretas;
método que muda por vários motivos;
interface obrigando implementar método inútil;
herança com UnsupportedOperationException;
alteração pequena quebrando muitas coisas.
```

Esses são sinais de design ruim.

---

## Pergunta prática

Quando olhar uma classe, pergunte:

```text
qual é o motivo dela existir?
por quais motivos ela mudaria?
ela depende de detalhes concretos?
ela tem regra misturada com infraestrutura?
ela é fácil de testar?
adicionar comportamento novo exige alterar código antigo?
```

Essas perguntas são o começo do pensamento SOLID.

---

# Parte 12 — SOLID e testes

SOLID melhora testes.

Por quê?

Porque classes menores e menos acopladas são mais fáceis de testar.

Exemplo ruim:

```text
PedidoService cria EmailSender real dentro dele.
```

Teste pode enviar e-mail de verdade.

Exemplo melhor:

```text
PedidoService depende de PedidoNotificador.
```

No teste, você pode passar um notificador falso.

Isso ficará muito importante nos módulos de testes.

---

# Parte 13 — SOLID e arquitetura

SOLID também prepara para:

```text
Clean Architecture;
Hexagonal Architecture;
DDD;
Ports and Adapters;
testes unitários;
injeção de dependência;
Spring Boot;
mensageria;
microserviços.
```

Por isso este módulo vem antes de Spring.

Antes de usar framework, você precisa pensar bem em design.

Framework não salva código mal organizado.

---

# Parte 14 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula215.app.PedidoServiceRuimApp
java -cp out br.com.curso.aula215.app.PedidoFinalizacaoServiceApp
```

Depois responda:

```text
1. O que a classe ruim fazia demais?
2. Quantos motivos para mudar ela tinha?
3. O que foi separado na versão melhor?
4. Qual classe decide se o pedido pode faturar?
5. Qual classe coordena o fluxo?
6. Qual classe calcula desconto?
7. Qual classe simula persistência?
8. Qual classe simula notificação?
9. Qual classe simula auditoria?
10. A versão melhor ficou perfeita ou apenas melhor preparada?
```

---

# Parte 15 — Exercício prático

## Contexto

Você vai analisar um fluxo ruim de Ordem de Serviço.

Imagine esta classe:

```java
public class OrdemServicoService {
    public void reagendar(String codigoOs, String novaData) {
        // valida código
        // parseia data
        // busca OS
        // valida status
        // altera data
        // salva no banco
        // envia WhatsApp
        // registra auditoria
        // gera arquivo de histórico
        // imprime no console
    }
}
```

---

## Sua tarefa

Crie uma proposta de separação em classes.

Sugestão:

```text
OrdemServico:
regra de reagendamento.

OrdemServicoRepository:
buscar e salvar.

OrdemServicoReagendamentoService:
coordena fluxo.

DataAgendamentoParser:
converte texto para LocalDate.

OrdemServicoNotificador:
envia mensagem.

AuditoriaService:
registra auditoria.

HistoricoOsGateway:
gera histórico.

ReagendamentoRequest:
entrada do fluxo.

ReagendamentoResponse:
saída do fluxo.
```

---

## Critério

Para cada classe, responda:

```text
qual responsabilidade?
por qual motivo mudaria?
ela pertence ao domínio, service, infra ou DTO?
```

---

# Parte 16 — Desafio prático com código

## Entidade OrdemServico

Crie:

```text
src\br\com\curso\aula215\dominio\ordemservico\OrdemServico.java
```

Campos:

```text
String codigo;
String cliente;
String status;
LocalDate dataAgendada;
```

Regras:

```text
codigo obrigatório;
cliente obrigatório;
status obrigatório;
dataAgendada obrigatória.
```

Método:

```java
void reagendar(LocalDate novaData, LocalDate hoje)
```

Regras:

```text
novaData obrigatória;
hoje obrigatório;
novaData não pode estar no passado;
status CONCLUIDA não pode reagendar;
status CANCELADA não pode reagendar;
ao reagendar, status vira REAGENDADA.
```

---

## Versão ruim

Crie:

```text
OrdemServicoServiceRuim
```

Ela deve fazer tudo:

```text
parse da data;
validação;
regra;
simulação de salvar;
simulação de notificar;
simulação de auditoria;
print no console.
```

---

## Versão melhor

Separe em:

```text
DataAgendamentoParser;
OrdemServicoRepositorySimulado;
OrdemServicoNotificadorSimulado;
AuditoriaSimulada;
OrdemServicoReagendamentoService.
```

No final, execute dois apps:

```text
OrdemServicoServiceRuimApp;
OrdemServicoReagendamentoServiceApp.
```

Compare os dois.

---

## Perguntas finais do desafio

Responda:

```text
1. Qual versão é mais fácil de testar?
2. Qual versão é mais fácil de mudar se trocar notificação?
3. Qual versão é mais fácil de mudar se trocar parse de data?
4. Qual versão concentra menos responsabilidade?
5. Qual versão se aproxima mais da frase: entidade decide, service coordena?
```

---

# Parte 17 — Simulado rápido

## Questão 1

SOLID serve principalmente para:

```text
A) deixar o código mais difícil.
B) reduzir custo de mudança e melhorar design.
C) substituir banco de dados.
D) evitar orientação a objetos.
```

---

## Questão 2

Coesão alta significa:

```text
A) classe com propósito claro e responsabilidades relacionadas.
B) classe com tudo dentro.
C) classe com muitos ifs.
D) classe que depende diretamente de banco.
```

---

## Questão 3

Acoplamento alto significa:

```text
A) pouca dependência entre classes.
B) dependência forte de detalhes concretos.
C) código sem classes.
D) código sem métodos.
```

---

## Questão 4

Uma classe com muitos motivos para mudar provavelmente fere:

```text
A) SRP.
B) apenas DateTimeFormatter.
C) apenas UUID.
D) Java Compiler.
```

---

## Questão 5

Uma classe que depende diretamente de `new EmailSmtpClient()` é um sinal de problema relacionado principalmente a:

```text
A) DIP.
B) Period.
C) StringJoiner.
D) CSV.
```

---

## Gabarito

```text
1. B
2. A
3. B
4. A
5. A
```

---

# Parte 18 — Checklist da aula

Marque mentalmente:

```text
[ ] Entendi o que é SOLID.
[ ] Sei os nomes dos cinco princípios.
[ ] Entendi coesão.
[ ] Entendi acoplamento.
[ ] Entendi por que código que funciona pode ser ruim.
[ ] Sei identificar classe com responsabilidade demais.
[ ] Sei que SOLID reduz custo de mudança.
[ ] Sei que SOLID não deve ser aplicado cegamente.
[ ] Sei que service coordena, mas não deve fazer tudo.
[ ] Sei que entidade deve proteger regra.
[ ] Sei que dependência concreta dificulta teste.
[ ] Sei que a próxima aula será SRP.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é SOLID?
2. Por que SOLID importa?
3. O que é coesão?
4. O que é acoplamento?
5. Qual problema de uma classe que faz tudo?
6. Por que depender de implementação concreta pode ser ruim?
7. Qual é a diferença entre código que funciona e código que evolui?
8. Quais são os cinco princípios do SOLID?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar a motivação do SOLID;
identificar baixa coesão;
identificar alto acoplamento;
listar os cinco princípios;
explicar por que classe gigante é ruim;
explicar por que mudança pequena pode quebrar código mal desenhado;
comparar uma versão ruim e uma versão melhor separada;
entender que SOLID será aplicado gradualmente;
preparar-se para estudar SRP.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-215-solid-introducao-motivacao-problemas
git commit -m "Aula 215: introducao solid motivacao problemas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
SOLID existe para reduzir o custo de mudança em código orientado a objetos.
```

Você estudou:

```text
motivação do SOLID;
código que funciona vs código que evolui;
coesão;
acoplamento;
responsabilidade;
mudança;
sinais de design ruim;
visão geral de SRP, OCP, LSP, ISP e DIP.
```

Também viu que:

```text
separar responsabilidades não é frescura;
é proteção contra manutenção cara.
```

Na próxima aula, vamos estudar o primeiro princípio:

```text
SRP — Single Responsibility Principle.
```

A ideia será aprofundar:

```text
uma classe deve ter um único motivo para mudar.
```
