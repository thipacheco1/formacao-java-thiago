# 201 — M8.01 — Exceptions: introdução ao tratamento profissional de erros

## Objetivo da aula

Nesta aula começa o Módulo 8.

Até aqui você construiu uma base forte de Java moderno:

```text
lógica;
classes;
métodos;
encapsulamento;
orientação a objetos;
domínio;
collections;
generics;
Optional;
functional interfaces;
lambdas;
streams;
collectors;
pipelines.
```

Agora vamos entrar em um assunto obrigatório para qualquer backend profissional:

```text
tratamento de erros com Exceptions.
```

Sistema real não vive só de caminho feliz.

Sistema real tem:

```text
entrada inválida;
registro inexistente;
estado inconsistente;
falha de integração;
falha de banco;
falha de rede;
timeout;
arquivo inexistente;
permissão negada;
dados quebrados;
regra de negócio violada;
erro técnico inesperado.
```

Se você não sabe tratar erro, o sistema fica frágil.

Se você trata erro mal, o sistema fica confuso.

Se você engole erro, o sistema fica perigoso.

O objetivo desta aula é construir a base correta.

Ao final, você deve conseguir:

```text
entender o que é uma exception;
entender por que exceptions existem;
entender diferença entre erro de programação, erro de regra e erro técnico;
lançar exception com throw;
entender RuntimeException;
usar IllegalArgumentException;
usar IllegalStateException;
usar try/catch;
entender propagação de exception;
entender stack trace;
evitar catch genérico sem necessidade;
evitar engolir erro;
aplicar exceptions em domínio e service;
começar a pensar como backend confiável.
```

---

## Ideia principal

Exception é um mecanismo do Java para sinalizar que algo deu errado.

Exemplo:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

Esse código diz:

```text
não é possível continuar porque o argumento informado é inválido.
```

Outro exemplo:

```java
throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
```

Esse código diz:

```text
não é possível executar esta operação porque o objeto está em um estado inválido para esse fluxo.
```

Exceptions ajudam a impedir que o sistema siga com dados inválidos.

---

## Por que aprender Exceptions agora

Nos módulos anteriores você já escreveu várias validações assim:

```java
if (nome == null || nome.isBlank()) {
    throw new IllegalArgumentException("Nome é obrigatório.");
}
```

Você usou esse padrão em entidades, value objects, services e DTOs.

Agora chegou a hora de entender profundamente:

```text
o que esse throw faz;
quando usar;
qual exception escolher;
quando capturar;
quando deixar propagar;
quando criar exception própria;
como não esconder erro;
como pensar erro por camada.
```

---

## Frase arquitetural do curso

Mesmo falando de erro, a linha continua:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de exceptions:

```text
Entidade:
lança erro quando uma regra/invariante é violada.

Use case/service:
coordena fluxo e decide se a ausência ou falha impede a operação.

Repository:
pode lançar erro técnico de persistência.

Client/Gateway:
pode lançar erro técnico de integração.

Controller:
traduz erro para resposta HTTP adequada.
```

Ainda não estamos em Spring, mas já vamos formar a mentalidade.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-201-exceptions-introducao-tratamento-erros
cd labs\m8\aula-201-exceptions-introducao-tratamento-erros
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula201
mkdir src\br\com\curso\aula201\app
mkdir src\br\com\curso\aula201\dominio
mkdir src\br\com\curso\aula201\dominio\cliente
mkdir src\br\com\curso\aula201\dominio\pedido
mkdir src\br\com\curso\aula201\dominio\produto
mkdir src\br\com\curso\aula201\service
```

---

# Parte 1 — O que é uma Exception

## Exception como sinal de falha

Uma exception representa uma situação anormal no fluxo.

Exemplo simples:

```java
int resultado = 10 / 0;
```

Isso gera erro:

```text
ArithmeticException
```

Porque divisão por zero não é permitida.

---

## App com erro automático

Crie:

```text
src\br\com\curso\aula201\app\PrimeiraExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class PrimeiraExceptionApp {
    public static void main(String[] args) {
        int resultado = 10 / 0;

        System.out.println("Resultado: " + resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.PrimeiraExceptionApp
```

---

## O que observar

O programa vai falhar.

Você verá uma mensagem parecida com:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
```

Esse erro mostra:

```text
qual exception aconteceu;
qual mensagem foi gerada;
em qual classe;
em qual linha;
qual caminho de chamadas levou ao erro.
```

Esse caminho é chamado de:

```text
stack trace.
```

---

## O que é stack trace

Stack trace é a trilha de execução até o erro.

Ele mostra a pilha de chamadas.

Exemplo conceitual:

```text
main chamou calcular
calcular chamou dividir
dividir deu erro
```

O stack trace é fundamental para diagnóstico.

Backend profissional vive de stack trace, logs e causa raiz.

---

# Parte 2 — Lançando exception com throw

## throw

Você pode lançar uma exception manualmente com:

```java
throw
```

Exemplo:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

Isso interrompe o fluxo normal.

---

## App com throw

Crie:

```text
src\br\com\curso\aula201\app\ThrowBasicoApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class ThrowBasicoApp {
    public static void main(String[] args) {
        cadastrarCliente("");
    }

    private static void cadastrarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        System.out.println("Cliente cadastrado: " + nome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.ThrowBasicoApp
```

---

## Como ler

```java
if (nome == null || nome.isBlank()) {
    throw new IllegalArgumentException("Nome é obrigatório.");
}
```

Leitura:

```text
se o nome for inválido;
interrompa o fluxo;
informe claramente o problema.
```

Isso é melhor do que deixar o sistema seguir com nome vazio.

---

## Por que não deixar passar

Imagine um sistema permitir:

```text
cliente sem nome;
pedido sem itens;
produto com preço negativo;
OS sem código;
atividade com status inválido.
```

O erro pode aparecer muito depois.

Quanto mais tarde o erro aparece, mais caro é entender.

Regra profissional:

```text
valide cedo;
falhe com mensagem clara.
```

---

# Parte 3 — IllegalArgumentException

## Quando usar IllegalArgumentException

Use `IllegalArgumentException` quando o problema está no argumento recebido pelo método ou construtor.

Exemplos:

```text
nome vazio;
email inválido;
preço negativo;
quantidade zero;
código nulo;
status em branco;
data nula.
```

---

## App com IllegalArgumentException

Crie:

```text
src\br\com\curso\aula201\app\IllegalArgumentExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

import java.math.BigDecimal;

public class IllegalArgumentExceptionApp {
    public static void main(String[] args) {
        criarProduto("PRD-001", "Notebook", new BigDecimal("-10.00"));
    }

    private static void criarProduto(String sku, String nome, BigDecimal preco) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        System.out.println("Produto criado: " + sku + " | " + nome + " | " + preco);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.IllegalArgumentExceptionApp
```

---

## Mensagem clara importa

Mensagem ruim:

```text
Erro.
```

Mensagem melhor:

```text
Preço deve ser maior que zero.
```

Mensagem ainda melhor em fluxos maiores:

```text
Preço do produto PRD-001 deve ser maior que zero.
```

Mensagem boa reduz tempo de debug.

---

# Parte 4 — IllegalStateException

## Quando usar IllegalStateException

Use `IllegalStateException` quando o problema não é o argumento em si, mas o estado atual do objeto ou do fluxo.

Exemplos:

```text
pedido cancelado não pode faturar;
OS concluída não pode reagendar;
produto inativo não pode vender;
cliente bloqueado não pode operar;
atividade concluída não pode executar novamente.
```

---

## App com IllegalStateException

Crie:

```text
src\br\com\curso\aula201\app\IllegalStateExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class IllegalStateExceptionApp {
    public static void main(String[] args) {
        faturarPedido(true);
    }

    private static void faturarPedido(boolean cancelado) {
        if (cancelado) {
            throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
        }

        System.out.println("Pedido faturado com sucesso.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.IllegalStateExceptionApp
```

---

## Diferença prática

Use:

```java
IllegalArgumentException
```

quando:

```text
o dado informado para o método é inválido.
```

Use:

```java
IllegalStateException
```

quando:

```text
o objeto ou fluxo está em um estado que não permite a operação.
```

---

## Exemplo comparativo

```java
public Pedido(String codigo) {
    if (codigo == null || codigo.isBlank()) {
        throw new IllegalArgumentException("Código é obrigatório.");
    }
}
```

Aqui é argumento inválido.

Agora:

```java
public void faturar() {
    if (cancelado) {
        throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
    }
}
```

Aqui é estado inválido.

---

# Parte 5 — Propagação de exception

## O que é propagação

Quando uma exception é lançada e ninguém captura, ela sobe pela pilha de chamadas.

Exemplo:

```text
main chama service
service chama validar
validar lança exception
service não captura
main não captura
programa encerra
```

---

## App mostrando propagação

Crie:

```text
src\br\com\curso\aula201\app\PropagacaoExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class PropagacaoExceptionApp {
    public static void main(String[] args) {
        executarFluxo();
    }

    private static void executarFluxo() {
        cadastrarCliente("");
    }

    private static void cadastrarCliente(String nome) {
        validarNome(nome);

        System.out.println("Cliente cadastrado: " + nome);
    }

    private static void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.PropagacaoExceptionApp
```

---

## O que observar no stack trace

Você verá a cadeia de chamadas:

```text
validarNome
cadastrarCliente
executarFluxo
main
```

Isso mostra onde o erro nasceu e por onde passou.

Não leia só a primeira linha.

Leia a stack trace.

---

# Parte 6 — try/catch

## O que é try/catch

`try/catch` permite capturar uma exception e tratar o erro.

Estrutura:

```java
try {
    // código que pode falhar
} catch (Exception erro) {
    // tratamento
}
```

---

## App com try/catch

Crie:

```text
src\br\com\curso\aula201\app\TryCatchBasicoApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class TryCatchBasicoApp {
    public static void main(String[] args) {
        try {
            cadastrarCliente("");
            System.out.println("Fluxo finalizado com sucesso.");
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro de validação: " + erro.getMessage());
        }

        System.out.println("Programa continuou após o tratamento.");
    }

    private static void cadastrarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        System.out.println("Cliente cadastrado: " + nome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.TryCatchBasicoApp
```

---

## O que aconteceu

O método lançou:

```java
IllegalArgumentException
```

O `catch` capturou:

```java
catch (IllegalArgumentException erro)
```

E o programa continuou.

---

## Quando capturar

Capture quando você consegue fazer algo útil.

Exemplos:

```text
mostrar mensagem amigável;
converter erro para resposta HTTP;
registrar log;
tentar alternativa;
compensar operação;
retornar resultado de falha;
encerrar fluxo com controle.
```

Não capture só para esconder.

---

# Parte 7 — Não engula erro

## O pior catch

Evite isto:

```java
try {
    processar();
} catch (Exception erro) {
}
```

Isso é perigoso.

O erro aconteceu, mas ninguém sabe.

O sistema pode seguir corrompido.

---

## App com erro engolido

Crie:

```text
src\br\com\curso\aula201\app\ErroEngolidoApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class ErroEngolidoApp {
    public static void main(String[] args) {
        try {
            cadastrarCliente("");
        } catch (IllegalArgumentException erro) {
            // Não faça isso em código real.
        }

        System.out.println("O sistema continuou, mas o erro foi ignorado.");
    }

    private static void cadastrarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        System.out.println("Cliente cadastrado: " + nome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.ErroEngolidoApp
```

---

## Por que isso é ruim

O sistema perdeu a informação do erro.

Em backend real, isso pode causar:

```text
dados inconsistentes;
suporte sem diagnóstico;
cliente sem resposta correta;
operação parcial;
falha silenciosa;
bugs difíceis de reproduzir.
```

Regra profissional:

```text
não engula exception.
```

Se capturar, faça algo útil.

---

# Parte 8 — catch genérico

## Cuidado com Exception genérica

Isto captura qualquer exception:

```java
catch (Exception erro)
```

Pode ser útil em bordas do sistema.

Mas dentro de regra de negócio, costuma ser amplo demais.

Prefira capturar o tipo específico quando possível.

---

## App com catches específicos

Crie:

```text
src\br\com\curso\aula201\app\CatchEspecificoApp.java
```

Código:

```java
package br.com.curso.aula201.app;

public class CatchEspecificoApp {
    public static void main(String[] args) {
        try {
            executar(" ");
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro de argumento: " + erro.getMessage());
        } catch (IllegalStateException erro) {
            System.out.println("Erro de estado: " + erro.getMessage());
        }
    }

    private static void executar(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        boolean fluxoBloqueado = true;

        if (fluxoBloqueado) {
            throw new IllegalStateException("Fluxo está bloqueado.");
        }

        System.out.println("Executado.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.CatchEspecificoApp
```

---

## Ordem dos catches

Em Java, captures mais específicos devem vir antes de capturas mais genéricas.

Exemplo:

```java
catch (IllegalArgumentException erro) {
    ...
} catch (RuntimeException erro) {
    ...
}
```

Se colocar o genérico antes, o específico pode ficar inacessível.

---

# Parte 9 — RuntimeException

## O que é RuntimeException

`RuntimeException` é a base de muitas exceptions não checadas.

Exemplos:

```text
IllegalArgumentException;
IllegalStateException;
NullPointerException;
ArithmeticException;
IndexOutOfBoundsException.
```

Essas exceptions não precisam ser declaradas no método.

Exemplo:

```java
public void executar() {
    throw new IllegalArgumentException("Erro.");
}
```

O método não precisa declarar `throws`.

---

## Por que usamos RuntimeException até aqui

Para regra de domínio e validações comuns, usamos exceptions não checadas.

Exemplos:

```text
nome obrigatório;
preço inválido;
pedido cancelado;
estado inválido.
```

Isso deixa o código de domínio mais direto.

Mais adiante vamos estudar:

```text
checked exceptions;
unchecked exceptions;
throws;
exceções próprias.
```

---

# Parte 10 — Domínio Cliente com validação

## Cliente

Crie:

```text
src\br\com\curso\aula201\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula201.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;
    private final boolean bloqueado;

    public Cliente(String nome, String email, boolean ativo, boolean bloqueado) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente é inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
        this.bloqueado = bloqueado;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean bloqueado() {
        return bloqueado;
    }

    public boolean podeOperar() {
        return ativo && !bloqueado;
    }

    public void validarPodeOperar() {
        if (!ativo) {
            throw new IllegalStateException("Cliente inativo não pode operar.");
        }

        if (bloqueado) {
            throw new IllegalStateException("Cliente bloqueado não pode operar.");
        }
    }

    public String resumo() {
        return nome
                + " | " + email
                + " | Ativo: " + ativo
                + " | Bloqueado: " + bloqueado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Cliente

Crie:

```text
src\br\com\curso\aula201\app\ClienteExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

import br.com.curso.aula201.dominio.cliente.Cliente;

public class ClienteExceptionApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Carlos Souza",
                "carlos@empresa.com",
                true,
                true
        );

        cliente.validarPodeOperar();

        System.out.println(cliente.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.ClienteExceptionApp
```

---

## Observação

O construtor protege argumentos inválidos.

O método `validarPodeOperar` protege regra de estado.

Isso separa bem:

```text
dado inválido;
estado inválido para operação.
```

---

# Parte 11 — Domínio Pedido com fluxo obrigatório

## Pedido

Crie:

```text
src\br\com\curso\aula201\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula201.dominio.pedido;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private boolean pago;
    private boolean cancelado;
    private boolean faturado;

    public Pedido(String codigo, String cliente, BigDecimal valor, boolean pago, boolean cancelado) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do pedido é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do pedido deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.pago = pago;
        this.cancelado = cancelado;
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

    public boolean cancelado() {
        return cancelado;
    }

    public boolean faturado() {
        return faturado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado && !faturado;
    }

    public void faturar() {
        if (cancelado) {
            throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
        }

        if (!pago) {
            throw new IllegalStateException("Pedido não pago não pode ser faturado.");
        }

        if (faturado) {
            throw new IllegalStateException("Pedido já foi faturado.");
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula201\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula201.service;

import br.com.curso.aula201.dominio.pedido.Pedido;

import java.util.List;

public class PedidoFaturamentoService {
    private final List<Pedido> pedidos;

    public PedidoFaturamentoService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = pedidos;
    }

    public Pedido buscarObrigatorio(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigo));
    }

    public Pedido faturar(String codigo) {
        Pedido pedido = buscarObrigatorio(codigo);

        pedido.faturar();

        return pedido;
    }
}
```

---

## App Pedido

Crie:

```text
src\br\com\curso\aula201\app\PedidoFaturamentoExceptionApp.java
```

Código:

```java
package br.com.curso.aula201.app;

import br.com.curso.aula201.dominio.pedido.Pedido;
import br.com.curso.aula201.service.PedidoFaturamentoService;

import java.math.BigDecimal;
import java.util.List;

public class PedidoFaturamentoExceptionApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), false, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), true, true)
        );

        PedidoFaturamentoService service = new PedidoFaturamentoService(pedidos);

        try {
            Pedido pedido = service.faturar("PED-002");
            System.out.println("Faturado: " + pedido.resumo());
        } catch (IllegalArgumentException | IllegalStateException erro) {
            System.out.println("Falha ao faturar: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula201.app.PedidoFaturamentoExceptionApp
```

---

## O que este exemplo mostra

A ausência do pedido é tratada como:

```java
IllegalArgumentException
```

porque o código informado não encontrou alvo válido para o fluxo.

Estado inválido para faturamento é tratado como:

```java
IllegalStateException
```

porque o pedido existe, mas não pode executar aquela operação.

---

# Parte 12 — Erro de programação, erro de regra e erro técnico

## Erro de programação

Exemplos:

```text
NullPointerException;
IndexOutOfBoundsException;
divisão por zero inesperada;
cast inválido;
bug lógico.
```

Normalmente indica falha no código.

---

## Erro de regra de negócio

Exemplos:

```text
pedido cancelado não pode faturar;
cliente bloqueado não pode operar;
produto inativo não pode vender;
atividade concluída não pode executar;
OS finalizada não pode reagendar.
```

Esse erro faz parte do domínio.

Deve ter mensagem clara.

---

## Erro técnico

Exemplos:

```text
banco indisponível;
timeout em API externa;
arquivo inexistente;
falha de permissão;
erro de conexão;
serviço remoto fora.
```

Esse erro vem da infraestrutura.

Mais adiante vamos criar uma separação melhor entre exceptions de domínio e técnicas.

---

## Por que classificar erro

Porque cada erro tem tratamento diferente.

```text
Erro de entrada:
responder validação.

Erro de regra:
informar operação inválida.

Erro técnico:
registrar log, talvez retornar erro temporário.

Erro de programação:
corrigir código.
```

---

# Parte 13 — Boas práticas iniciais

## 1. Mensagem clara

Ruim:

```text
Erro.
```

Bom:

```text
Pedido cancelado não pode ser faturado.
```

---

## 2. Não engolir exception

Nunca capture e ignore.

---

## 3. Capture apenas quando sabe tratar

Se não sabe tratar, deixe propagar.

---

## 4. Use exception adequada

```text
argumento inválido:
IllegalArgumentException.

estado inválido:
IllegalStateException.
```

---

## 5. Não use exception para fluxo normal simples

Evite usar exception como substituta de `if` comum.

Exemplo:

```java
if (cliente.podeOperar()) {
    ...
}
```

é melhor do que tentar operar e capturar erro se isso for fluxo esperado e frequente.

---

## 6. Use Optional para ausência esperada

Busca que pode não encontrar:

```java
Optional<Cliente>
```

Fluxo obrigatório:

```java
orElseThrow
```

---

# Parte 14 — Erros comuns

## 1. Capturar Exception genérica em todo lugar

Ruim:

```java
catch (Exception erro)
```

em qualquer método.

Prefira capturar tipos específicos.

---

## 2. Lançar RuntimeException genérica

Menos claro:

```java
throw new RuntimeException("Erro.");
```

Melhor:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

ou:

```java
throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
```

---

## 3. Mensagem sem contexto

Ruim:

```text
Inválido.
```

Melhor:

```text
Código do pedido é obrigatório.
```

---

## 4. Continuar depois de estado inválido

Se o objeto não pode operar, não continue.

Falhe cedo.

---

## 5. Capturar e retornar null

Ruim:

```java
try {
    return buscar();
} catch (Exception erro) {
    return null;
}
```

Isso mistura problemas e cria novos erros.

---

## 6. Transformar tudo em print

Em app de estudo, `System.out.println` ajuda.

Em backend real, controller e logs terão papéis específicos.

Service não deve imprimir como regra.

---

# Parte 15 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula201.app.PrimeiraExceptionApp
java -cp out br.com.curso.aula201.app.ThrowBasicoApp
java -cp out br.com.curso.aula201.app.IllegalArgumentExceptionApp
java -cp out br.com.curso.aula201.app.IllegalStateExceptionApp
java -cp out br.com.curso.aula201.app.PropagacaoExceptionApp
java -cp out br.com.curso.aula201.app.TryCatchBasicoApp
java -cp out br.com.curso.aula201.app.ErroEngolidoApp
java -cp out br.com.curso.aula201.app.CatchEspecificoApp
java -cp out br.com.curso.aula201.app.ClienteExceptionApp
java -cp out br.com.curso.aula201.app.PedidoFaturamentoExceptionApp
```

Para cada execução, responda:

```text
qual exception aconteceu?
foi argumento inválido ou estado inválido?
houve try/catch?
o erro foi tratado ou propagou?
a mensagem estava clara?
o catch fez algo útil?
```

---

# Parte 16 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula201\dominio\produto\Produto.java
```

Campos:

```text
String sku;
String nome;
BigDecimal preco;
boolean ativo;
int estoque;
```

Regras no construtor:

```text
sku obrigatório;
nome obrigatório;
preco obrigatório e maior que zero;
estoque não pode ser negativo.
```

Métodos:

```java
boolean disponivel()

void vender(int quantidade)

void inativar()

String resumo()
```

Regras:

```text
vender:
quantidade deve ser maior que zero;
produto inativo não pode vender;
estoque insuficiente não pode vender;
ao vender, reduzir estoque.

inativar:
produto já inativo não pode ser inativado novamente.
```

Exceptions esperadas:

```text
IllegalArgumentException para quantidade inválida;
IllegalStateException para produto inativo;
IllegalStateException para estoque insuficiente;
IllegalStateException para inativação duplicada.
```

Crie service:

```text
src\br\com\curso\aula201\service\ProdutoVendaService.java
```

Métodos:

```java
Produto buscarObrigatorio(String sku)

Produto vender(String sku, int quantidade)

Produto inativar(String sku)
```

Regras:

```text
buscarObrigatorio:
sku obrigatório;
buscar em lista;
se não encontrar, lançar IllegalArgumentException com mensagem clara.

vender:
buscar produto;
chamar produto.vender(quantidade);
retornar produto.

inativar:
buscar produto;
chamar produto.inativar();
retornar produto.
```

Crie app:

```text
src\br\com\curso\aula201\app\ProdutoVendaExceptionApp.java
```

O app deve demonstrar:

```text
venda com sucesso;
venda com quantidade inválida;
venda com estoque insuficiente;
inativação;
tentativa de vender produto inativo.
```

Critérios:

```text
não engolir exception;
usar try/catch no app para demonstrar falhas;
service não imprime;
entidade protege regra;
mensagens claras.
```

---

## Desafio extra

Crie um método no app:

```java
private static void executar(String descricao, Runnable acao)
```

Ele deve:

```text
imprimir a descrição;
executar a ação;
capturar IllegalArgumentException e IllegalStateException;
imprimir mensagem de erro;
separar os cenários visualmente.
```

Exemplo de uso:

```java
executar("Venda com sucesso", () -> service.vender("PRD-001", 2));
```

Objetivo:

```text
praticar Consumer/Runnable junto com exception.
```

---

# Parte 17 — Debug recomendado

Coloque breakpoints em:

```text
ThrowBasicoApp
PropagacaoExceptionApp
TryCatchBasicoApp
Cliente.validarPodeOperar
Pedido.faturar
PedidoFaturamentoService.buscarObrigatorio
PedidoFaturamentoServiceApp
```

Observe:

```text
onde a exception nasce;
por onde ela propaga;
onde ela é capturada;
qual mensagem chega no catch;
como o fluxo interrompe;
como o fluxo continua após tratamento.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma exception?
2. Para que serve throw?
3. Quando usar IllegalArgumentException?
4. Quando usar IllegalStateException?
5. O que é stack trace?
6. Quando usar try/catch?
7. Por que não engolir exception?
8. Qual a diferença entre erro de regra e erro técnico?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o que é exception;
lançar exception com throw;
usar IllegalArgumentException;
usar IllegalStateException;
ler stack trace básico;
entender propagação;
usar try/catch;
evitar catch vazio;
evitar RuntimeException genérica sem motivo;
validar argumentos no construtor;
validar estado antes de operação;
aplicar exceptions em entidade;
aplicar exceptions em service;
separar erro de argumento e erro de estado;
resolver ProdutoVendaExceptionApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-201-exceptions-introducao-tratamento-erros
git commit -m "Aula 201: exceptions introducao tratamento erros"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Exception é o mecanismo do Java para interromper um fluxo inválido e comunicar claramente o erro.
```

Você estudou:

```text
throw;
IllegalArgumentException;
IllegalStateException;
RuntimeException;
try/catch;
propagação;
stack trace;
erro engolido;
catch específico;
erro de programação;
erro de regra;
erro técnico.
```

Também reforçou a linha arquitetural:

```text
Entidade protege regra.
Service coordena fluxo.
Controller futuramente traduz erro.
```

Na próxima aula, vamos aprofundar um tema essencial:

```text
checked exceptions vs unchecked exceptions.
```

Vamos entender:

```text
Exception;
RuntimeException;
throws;
checked exceptions;
unchecked exceptions;
por que algumas exceptions obrigam tratamento;
por que outras não;
quando criar exceptions próprias;
como isso impacta design de backend.
```
