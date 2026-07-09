# 206 — M8.06 — Exceptions, Resultado e validações controladas

## Objetivo da aula

Na aula anterior, você estudou:

```text
erro de validação;
erro de aplicação;
erro de não encontrado;
erro de domínio;
erro de infraestrutura;
AplicacaoException;
DominioException;
InfraestruturaException;
RecursoNaoEncontradoException;
tradução futura para HTTP;
preservação de causa;
separação de responsabilidade por camada.
```

Agora vamos tratar uma decisão importante em backend profissional:

```text
quando usar exception
```

e:

```text
quando retornar um resultado controlado.
```

Até aqui, usamos muito:

```java
throw new IllegalArgumentException(...)
throw new IllegalStateException(...)
throw new DominioException(...)
throw new AplicacaoException(...)
```

Isso é correto para muitos casos.

Mas exception não deve ser usada como martelo para tudo.

Existem cenários em que é melhor retornar um objeto representando sucesso ou falha.

Exemplo:

```java
Resultado<Pedido>
```

ou:

```java
ResultadoValidacao
```

ou:

```java
ValidacaoResultado
```

Ao final desta aula, você deve conseguir:

```text
diferenciar erro excepcional de falha esperada;
entender quando usar exception;
entender quando retornar Resultado;
entender quando acumular erros;
entender quando falhar rápido;
criar um Resultado<T>;
criar um ResultadoValidacao;
validar entrada com múltiplas mensagens;
evitar exception para fluxo comum de validação em massa;
usar exception para regra que impede o fluxo;
usar Resultado para operação controlada;
aplicar em domínio e service;
preparar pensamento para APIs, formulários e importações.
```

---

## Ideia principal

Exception interrompe o fluxo.

Resultado descreve o fluxo.

Compare:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

com:

```java
return Resultado.falha("Nome é obrigatório.");
```

No primeiro caso:

```text
o fluxo é interrompido.
```

No segundo caso:

```text
o fluxo continua de forma controlada e a falha é retornada como dado.
```

Nenhum dos dois é sempre melhor.

A decisão depende do contexto.

---

## Quando exception faz sentido

Use exception quando:

```text
a operação não pode continuar;
houve violação de regra importante;
houve estado inválido;
houve recurso obrigatório não encontrado;
houve falha técnica;
houve bug ou situação anormal;
a camada superior deve interromper e tratar.
```

Exemplos:

```text
Pedido não encontrado para faturamento.
Pedido cancelado não pode faturar.
Produto sem estoque não pode vender.
Falha ao ler arquivo.
Falha ao chamar API externa.
Cliente bloqueado não pode operar.
```

---

## Quando Resultado faz sentido

Use Resultado quando:

```text
a falha é esperada e faz parte do fluxo;
você quer retornar mensagem controlada;
você quer acumular erros;
você está validando formulário ou importação;
você está processando lote;
você quer evitar try/catch em fluxo comum;
o chamador precisa tomar decisão sem exception.
```

Exemplos:

```text
validar dados de cadastro antes de criar entidade;
importar 100 linhas e listar linhas inválidas;
simular uma operação;
validar se campos obrigatórios foram preenchidos;
verificar se comando está completo;
retornar sucesso/falha em uma operação controlada.
```

---

## Regra prática

```text
Exception:
falha que interrompe o fluxo.

Resultado:
falha esperada que pode ser comunicada e manipulada como dado.
```

Outra forma:

```text
Exception é para fluxo excepcional.
Resultado é para decisão controlada.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-206-exceptions-resultado-validacoes-controladas
cd labs\m8\aula-206-exceptions-resultado-validacoes-controladas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula206
mkdir src\br\com\curso\aula206\app
mkdir src\br\com\curso\aula206\dominio
mkdir src\br\com\curso\aula206\dominio\cliente
mkdir src\br\com\curso\aula206\dominio\pedido
mkdir src\br\com\curso\aula206\dominio\produto
mkdir src\br\com\curso\aula206\dto
mkdir src\br\com\curso\aula206\exception
mkdir src\br\com\curso\aula206\service
mkdir src\br\com\curso\aula206\validacao
```

---

# Parte 1 — Criando Resultado<T>

## Objetivo

Vamos criar um tipo genérico para representar:

```text
sucesso com valor;
falha com mensagem.
```

Esse padrão já apareceu no Módulo 6.

Agora vamos aplicá-lo junto com exceptions e validações.

---

## Resultado

Crie:

```text
src\br\com\curso\aula206\validacao\Resultado.java
```

Código:

```java
package br.com.curso.aula206.validacao;

public class Resultado<T> {
    private final boolean sucesso;
    private final T valor;
    private final String mensagem;

    private Resultado(boolean sucesso, T valor, String mensagem) {
        this.sucesso = sucesso;
        this.valor = valor;
        this.mensagem = mensagem;
    }

    public static <T> Resultado<T> sucesso(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor de sucesso é obrigatório.");
        }

        return new Resultado<>(true, valor, null);
    }

    public static <T> Resultado<T> falha(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem de falha é obrigatória.");
        }

        return new Resultado<>(false, null, mensagem);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public boolean falha() {
        return !sucesso;
    }

    public T valor() {
        if (falha()) {
            throw new IllegalStateException("Resultado de falha não possui valor.");
        }

        return valor;
    }

    public String mensagem() {
        if (sucesso()) {
            throw new IllegalStateException("Resultado de sucesso não possui mensagem de falha.");
        }

        return mensagem;
    }

    public String resumo() {
        if (sucesso) {
            return "SUCESSO: " + valor;
        }

        return "FALHA: " + mensagem;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Observação importante

Mesmo o `Resultado` usando falha controlada, ele ainda usa exception para uso incorreto.

Exemplo:

```java
resultado.valor()
```

quando o resultado é falha.

Isso é erro de programação no uso do objeto.

Então:

```text
falha de negócio controlada:
Resultado.falha(...)

uso incorreto do Resultado:
IllegalStateException
```

---

## App básico

Crie:

```text
src\br\com\curso\aula206\app\ResultadoBasicoApp.java
```

Código:

```java
package br.com.curso.aula206.app;

import br.com.curso.aula206.validacao.Resultado;

public class ResultadoBasicoApp {
    public static void main(String[] args) {
        Resultado<String> sucesso = Resultado.sucesso("Pedido criado.");
        Resultado<String> falha = Resultado.falha("Cliente não informado.");

        System.out.println(sucesso.resumo());
        System.out.println(falha.resumo());

        if (sucesso.sucesso()) {
            System.out.println("Valor: " + sucesso.valor());
        }

        if (falha.falha()) {
            System.out.println("Mensagem: " + falha.mensagem());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula206.app.ResultadoBasicoApp
```

---

# Parte 2 — Resultado para operação controlada

## Cenário

Imagine um cadastro simples.

O usuário informa:

```text
nome;
email.
```

Se estiver inválido, podemos retornar falha controlada.

Não precisamos lançar exception imediatamente.

---

## Cliente

Crie:

```text
src\br\com\curso\aula206\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula206.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;

    public Cliente(String nome, String email, boolean ativo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente é inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
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

    public String resumo() {
        return nome + " | " + email + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## CriarClienteRequest

Crie:

```text
src\br\com\curso\aula206\dto\CriarClienteRequest.java
```

Código:

```java
package br.com.curso.aula206.dto;

public class CriarClienteRequest {
    private final String nome;
    private final String email;

    public CriarClienteRequest(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }
}
```

---

## ClienteCadastroService

Crie:

```text
src\br\com\curso\aula206\service\ClienteCadastroService.java
```

Código:

```java
package br.com.curso.aula206.service;

import br.com.curso.aula206.dominio.cliente.Cliente;
import br.com.curso.aula206.dto.CriarClienteRequest;
import br.com.curso.aula206.validacao.Resultado;

public class ClienteCadastroService {
    public Resultado<Cliente> cadastrar(CriarClienteRequest request) {
        if (request == null) {
            return Resultado.falha("Dados do cliente são obrigatórios.");
        }

        if (request.nome() == null || request.nome().isBlank()) {
            return Resultado.falha("Nome do cliente é obrigatório.");
        }

        if (request.email() == null || request.email().isBlank() || !request.email().contains("@")) {
            return Resultado.falha("E-mail do cliente é inválido.");
        }

        Cliente cliente = new Cliente(request.nome(), request.email(), true);

        return Resultado.sucesso(cliente);
    }
}
```

---

## App de cadastro

Crie:

```text
src\br\com\curso\aula206\app\ClienteCadastroResultadoApp.java
```

Código:

```java
package br.com.curso.aula206.app;

import br.com.curso.aula206.dominio.cliente.Cliente;
import br.com.curso.aula206.dto.CriarClienteRequest;
import br.com.curso.aula206.service.ClienteCadastroService;
import br.com.curso.aula206.validacao.Resultado;

public class ClienteCadastroResultadoApp {
    public static void main(String[] args) {
        ClienteCadastroService service = new ClienteCadastroService();

        executar("Cliente válido", new CriarClienteRequest("Ana Silva", "ana@empresa.com"), service);
        executar("Nome vazio", new CriarClienteRequest("", "ana@empresa.com"), service);
        executar("E-mail inválido", new CriarClienteRequest("Carlos", "email-invalido"), service);
    }

    private static void executar(String descricao, CriarClienteRequest request, ClienteCadastroService service) {
        System.out.println();
        System.out.println("Cenário: " + descricao);

        Resultado<Cliente> resultado = service.cadastrar(request);

        if (resultado.sucesso()) {
            System.out.println("Sucesso: " + resultado.valor().resumo());
        } else {
            System.out.println("Falha: " + resultado.mensagem());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula206.app.ClienteCadastroResultadoApp
```

---

## Por que Resultado ficou bom aqui

A validação de cadastro é um fluxo esperado.

Usuário pode mandar dados inválidos.

Isso não precisa virar uma exception em todo cenário.

O service retorna:

```text
sucesso com Cliente;
falha com mensagem.
```

Isso é controlado e fácil de apresentar.

---

# Parte 3 — Limitação do Resultado simples

## Problema

O `Resultado<T>` simples só retorna uma mensagem.

Mas formulários e importações geralmente têm vários erros.

Exemplo:

```text
Nome é obrigatório.
E-mail é inválido.
Documento é obrigatório.
Data de nascimento é inválida.
```

Se usarmos falha rápida, retornamos só o primeiro erro.

Às vezes isso é bom.

Mas em validação de entrada, pode ser melhor acumular.

---

## Falhar rápido vs acumular erros

## Falhar rápido

Falhar rápido significa parar no primeiro erro.

Exemplo:

```java
if (nome == null || nome.isBlank()) {
    return Resultado.falha("Nome é obrigatório.");
}
```

Vantagens:

```text
simples;
direto;
bom para regra que impede análise posterior.
```

Desvantagem:

```text
usuário corrige um erro por vez.
```

---

## Acumular erros

Acumular erros significa validar tudo e retornar uma lista.

Exemplo:

```text
Nome é obrigatório.
E-mail é inválido.
```

Vantagens:

```text
melhor para formulários;
melhor para importações;
melhor experiência;
melhor diagnóstico.
```

Desvantagem:

```text
exige estrutura de validação.
```

---

# Parte 4 — ResultadoValidacao

## Criando ResultadoValidacao

Crie:

```text
src\br\com\curso\aula206\validacao\ResultadoValidacao.java
```

Código:

```java
package br.com.curso.aula206.validacao;

import java.util.ArrayList;
import java.util.List;

public class ResultadoValidacao {
    private final List<String> erros = new ArrayList<>();

    public void adicionarErro(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem de erro é obrigatória.");
        }

        erros.add(mensagem);
    }

    public boolean valido() {
        return erros.isEmpty();
    }

    public boolean invalido() {
        return !valido();
    }

    public List<String> erros() {
        return List.copyOf(erros);
    }

    public String resumo() {
        if (valido()) {
            return "VALIDO";
        }

        return "INVALIDO: " + erros;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ValidadorClienteRequest

Crie:

```text
src\br\com\curso\aula206\service\ValidadorClienteRequest.java
```

Código:

```java
package br.com.curso.aula206.service;

import br.com.curso.aula206.dto.CriarClienteRequest;
import br.com.curso.aula206.validacao.ResultadoValidacao;

public class ValidadorClienteRequest {
    public ResultadoValidacao validar(CriarClienteRequest request) {
        ResultadoValidacao resultado = new ResultadoValidacao();

        if (request == null) {
            resultado.adicionarErro("Dados do cliente são obrigatórios.");
            return resultado;
        }

        if (request.nome() == null || request.nome().isBlank()) {
            resultado.adicionarErro("Nome do cliente é obrigatório.");
        }

        if (request.email() == null || request.email().isBlank()) {
            resultado.adicionarErro("E-mail do cliente é obrigatório.");
        } else if (!request.email().contains("@")) {
            resultado.adicionarErro("E-mail do cliente é inválido.");
        }

        return resultado;
    }
}
```

---

## Service usando validação acumulada

Atualize `ClienteCadastroService` para:

```java
package br.com.curso.aula206.service;

import br.com.curso.aula206.dominio.cliente.Cliente;
import br.com.curso.aula206.dto.CriarClienteRequest;
import br.com.curso.aula206.validacao.Resultado;
import br.com.curso.aula206.validacao.ResultadoValidacao;

public class ClienteCadastroService {
    private final ValidadorClienteRequest validador = new ValidadorClienteRequest();

    public Resultado<Cliente> cadastrar(CriarClienteRequest request) {
        ResultadoValidacao validacao = validador.validar(request);

        if (validacao.invalido()) {
            return Resultado.falha(String.join("; ", validacao.erros()));
        }

        Cliente cliente = new Cliente(request.nome(), request.email(), true);

        return Resultado.sucesso(cliente);
    }

    public ResultadoValidacao validar(CriarClienteRequest request) {
        return validador.validar(request);
    }
}
```

---

## App validação acumulada

Crie:

```text
src\br\com\curso\aula206\app\ClienteValidacaoAcumuladaApp.java
```

Código:

```java
package br.com.curso.aula206.app;

import br.com.curso.aula206.dto.CriarClienteRequest;
import br.com.curso.aula206.service.ClienteCadastroService;
import br.com.curso.aula206.validacao.ResultadoValidacao;

public class ClienteValidacaoAcumuladaApp {
    public static void main(String[] args) {
        ClienteCadastroService service = new ClienteCadastroService();

        CriarClienteRequest request = new CriarClienteRequest("", "email-invalido");

        ResultadoValidacao validacao = service.validar(request);

        if (validacao.invalido()) {
            System.out.println("Erros encontrados:");

            validacao.erros()
                    .forEach(erro -> System.out.println(" - " + erro));
        } else {
            System.out.println("Dados válidos.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula206.app.ClienteValidacaoAcumuladaApp
```

---

# Parte 5 — Exception ainda é necessária no domínio

## Resultado não substitui proteção da entidade

Mesmo validando request antes, a entidade continua protegendo suas invariantes.

Isto deve continuar:

```java
public Cliente(String nome, String email, boolean ativo) {
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome do cliente é obrigatório.");
    }
}
```

Por quê?

Porque a entidade não pode confiar que sempre será criada pelo service certo.

Ela pode ser criada por:

```text
outro service;
teste;
mapper;
factory;
importador;
futuro controller;
código legado.
```

A entidade deve proteger a si mesma.

---

## Regra importante

```text
Validação de request melhora experiência.
Exception na entidade protege o domínio.
```

As duas coisas podem coexistir.

---

# Parte 6 — Pedido com exception de domínio

## Exception

Crie:

```text
src\br\com\curso\aula206\exception\PedidoNaoPodeSerFaturadoException.java
```

Código:

```java
package br.com.curso.aula206.exception;

public class PedidoNaoPodeSerFaturadoException extends RuntimeException {
    public PedidoNaoPodeSerFaturadoException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula206\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula206.dominio.pedido;

import br.com.curso.aula206.exception.PedidoNaoPodeSerFaturadoException;

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
        if (!pago) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido não pago não pode ser faturado: " + codigo);
        }

        if (cancelado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido cancelado não pode ser faturado: " + codigo);
        }

        if (faturado) {
            throw new PedidoNaoPodeSerFaturadoException("Pedido já foi faturado: " + codigo);
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
src\br\com\curso\aula206\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula206.service;

import br.com.curso.aula206.dominio.pedido.Pedido;
import br.com.curso.aula206.exception.PedidoNaoPodeSerFaturadoException;
import br.com.curso.aula206.validacao.Resultado;

import java.util.List;

public class PedidoFaturamentoService {
    private final List<Pedido> pedidos;

    public PedidoFaturamentoService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = pedidos;
    }

    public Resultado<Pedido> tentarFaturar(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return Resultado.falha("Código do pedido é obrigatório.");
        }

        Pedido pedido = pedidos.stream()
                .filter(item -> item.codigo().equals(codigo.trim().toUpperCase()))
                .findFirst()
                .orElse(null);

        if (pedido == null) {
            return Resultado.falha("Pedido não encontrado: " + codigo);
        }

        try {
            pedido.faturar();
            return Resultado.sucesso(pedido);
        } catch (PedidoNaoPodeSerFaturadoException erro) {
            return Resultado.falha(erro.getMessage());
        }
    }

    public Pedido faturarObrigatorio(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        Pedido pedido = pedidos.stream()
                .filter(item -> item.codigo().equals(codigo.trim().toUpperCase()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigo));

        pedido.faturar();

        return pedido;
    }
}
```

---

## App comparando Resultado e Exception

Crie:

```text
src\br\com\curso\aula206\app\PedidoResultadoVsExceptionApp.java
```

Código:

```java
package br.com.curso.aula206.app;

import br.com.curso.aula206.dominio.pedido.Pedido;
import br.com.curso.aula206.service.PedidoFaturamentoService;
import br.com.curso.aula206.validacao.Resultado;

import java.math.BigDecimal;
import java.util.List;

public class PedidoResultadoVsExceptionApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), false, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), true, true)
        );

        PedidoFaturamentoService service = new PedidoFaturamentoService(pedidos);

        System.out.println("Fluxo controlado com Resultado:");
        Resultado<Pedido> resultado = service.tentarFaturar("PED-002");

        if (resultado.sucesso()) {
            System.out.println("Sucesso: " + resultado.valor().resumo());
        } else {
            System.out.println("Falha: " + resultado.mensagem());
        }

        System.out.println();

        System.out.println("Fluxo obrigatório com exception:");
        try {
            Pedido pedido = service.faturarObrigatorio("PED-003");
            System.out.println("Sucesso: " + pedido.resumo());
        } catch (RuntimeException erro) {
            System.out.println("Exception: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula206.app.PedidoResultadoVsExceptionApp
```

---

## O que este exemplo mostra

O mesmo domínio pode ser usado em dois estilos de service:

```text
tentarFaturar:
retorna Resultado.

faturarObrigatorio:
lança exception se não conseguir.
```

A diferença é intenção do caso de uso.

---

# Parte 7 — Validação de lote

## Por que Resultado é melhor em lote

Imagine importar 100 produtos.

Se a primeira linha falhar e você usar exception, o processo para.

Às vezes isso é desejado.

Mas em importações, muitas vezes queremos:

```text
processar todas as linhas;
identificar todas as inválidas;
retornar relatório de erros.
```

Resultado controlado é melhor.

---

## ErroLinha

Crie:

```text
src\br\com\curso\aula206\validacao\ErroLinha.java
```

Código:

```java
package br.com.curso.aula206.validacao;

public class ErroLinha {
    private final int numeroLinha;
    private final String mensagem;

    public ErroLinha(int numeroLinha, String mensagem) {
        if (numeroLinha <= 0) {
            throw new IllegalArgumentException("Número da linha deve ser maior que zero.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.numeroLinha = numeroLinha;
        this.mensagem = mensagem;
    }

    public int numeroLinha() {
        return numeroLinha;
    }

    public String mensagem() {
        return mensagem;
    }

    public String resumo() {
        return "Linha " + numeroLinha + ": " + mensagem;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ResultadoImportacao

Crie:

```text
src\br\com\curso\aula206\validacao\ResultadoImportacao.java
```

Código:

```java
package br.com.curso.aula206.validacao;

import java.util.ArrayList;
import java.util.List;

public class ResultadoImportacao<T> {
    private final List<T> itensValidos = new ArrayList<>();
    private final List<ErroLinha> erros = new ArrayList<>();

    public void adicionarItemValido(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item válido é obrigatório.");
        }

        itensValidos.add(item);
    }

    public void adicionarErro(int numeroLinha, String mensagem) {
        erros.add(new ErroLinha(numeroLinha, mensagem));
    }

    public boolean possuiErros() {
        return !erros.isEmpty();
    }

    public boolean sucessoTotal() {
        return erros.isEmpty();
    }

    public int quantidadeValidos() {
        return itensValidos.size();
    }

    public int quantidadeErros() {
        return erros.size();
    }

    public List<T> itensValidos() {
        return List.copyOf(itensValidos);
    }

    public List<ErroLinha> erros() {
        return List.copyOf(erros);
    }

    public String resumo() {
        return "Válidos: " + quantidadeValidos() + " | Erros: " + quantidadeErros();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

# Parte 8 — Produto e importação controlada

## Produto

Crie:

```text
src\br\com\curso\aula206\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula206.dominio.produto;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final BigDecimal preco;
    private final int estoque;

    public Produto(String sku, String nome, BigDecimal preco, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.preco = preco;
        this.estoque = estoque;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal preco() {
        return preco;
    }

    public int estoque() {
        return estoque;
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Preço: " + preco
                + " | Estoque: " + estoque;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoImportacaoControladaService

Crie:

```text
src\br\com\curso\aula206\service\ProdutoImportacaoControladaService.java
```

Código:

```java
package br.com.curso.aula206.service;

import br.com.curso.aula206.dominio.produto.Produto;
import br.com.curso.aula206.validacao.ResultadoImportacao;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoImportacaoControladaService {
    public ResultadoImportacao<Produto> importarLinhas(List<String> linhas) {
        if (linhas == null) {
            throw new IllegalArgumentException("Linhas são obrigatórias.");
        }

        ResultadoImportacao<Produto> resultado = new ResultadoImportacao<>();

        for (int indice = 0; indice < linhas.size(); indice++) {
            int numeroLinha = indice + 1;
            String linha = linhas.get(indice);

            if (linha == null || linha.isBlank()) {
                continue;
            }

            try {
                Produto produto = converterLinha(linha);
                resultado.adicionarItemValido(produto);
            } catch (IllegalArgumentException erro) {
                resultado.adicionarErro(numeroLinha, erro.getMessage());
            }
        }

        return resultado;
    }

    private Produto converterLinha(String linha) {
        String[] partes = linha.split(";");

        if (partes.length != 4) {
            throw new IllegalArgumentException("Linha deve possuir 4 colunas: SKU;NOME;PRECO;ESTOQUE");
        }

        try {
            String sku = partes[0];
            String nome = partes[1];
            BigDecimal preco = new BigDecimal(partes[2]);
            int estoque = Integer.parseInt(partes[3]);

            return new Produto(sku, nome, preco, estoque);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Preço ou estoque inválido.", erro);
        }
    }
}
```

---

## Por que aqui usamos for

Neste caso, `for` é melhor que Stream porque precisamos:

```text
número da linha;
try/catch por item;
continuar após erro;
acumular válidos;
acumular erros.
```

Isso reforça a aula anterior:

```text
Stream e for são ferramentas.
```

Aqui, `for` é mais claro.

---

## App importação controlada

Crie:

```text
src\br\com\curso\aula206\app\ProdutoImportacaoControladaApp.java
```

Código:

```java
package br.com.curso.aula206.app;

import br.com.curso.aula206.dominio.produto.Produto;
import br.com.curso.aula206.service.ProdutoImportacaoControladaService;
import br.com.curso.aula206.validacao.ResultadoImportacao;

import java.util.List;

public class ProdutoImportacaoControladaApp {
    public static void main(String[] args) {
        List<String> linhas = List.of(
                "PRD-001;Notebook;3500.00;5",
                "PRD-002;Mouse;80.00;20",
                "PRD-003;Monitor;abc;10",
                "PRD-004;Cadeira;450.00;-1",
                "PRD-005;Mesa"
        );

        ProdutoImportacaoControladaService service = new ProdutoImportacaoControladaService();

        ResultadoImportacao<Produto> resultado = service.importarLinhas(linhas);

        System.out.println(resultado.resumo());

        System.out.println();
        System.out.println("Produtos válidos:");
        resultado.itensValidos()
                .forEach(produto -> System.out.println(" - " + produto.resumo()));

        System.out.println();
        System.out.println("Erros:");
        resultado.erros()
                .forEach(erro -> System.out.println(" - " + erro.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula206.app.ProdutoImportacaoControladaApp
```

---

# Parte 9 — Exception para falha técnica, Resultado para linhas inválidas

## Diferença importante

Em uma importação real, podem existir dois tipos de erro:

```text
arquivo não abriu;
linha inválida.
```

Arquivo não abrir é falha técnica.

Linha inválida é falha controlada de negócio/validação da importação.

Então:

```text
falha ao ler arquivo:
exception de infraestrutura.

linha inválida:
ResultadoImportacao com erro de linha.
```

Não misture tudo.

---

## Exemplo de decisão

```text
Arquivo inexistente:
FalhaLeituraArquivoException.

Linha 5 com preço inválido:
ErroLinha dentro de ResultadoImportacao.

Produto com estoque negativo:
ErroLinha dentro de ResultadoImportacao.

Caminho do arquivo nulo:
IllegalArgumentException.
```

Esse raciocínio evita confusão.

---

# Parte 10 — Matrix de decisão

## Use exception quando

```text
não há como continuar o fluxo;
falha é técnica;
recurso obrigatório não existe;
estado do domínio impede operação;
uso do método está incorreto;
erro deve subir para borda do sistema.
```

Exemplos:

```text
pedido obrigatório não encontrado para faturamento;
cliente bloqueado tentando operar;
falha de banco;
falha de arquivo;
falha de API externa;
parâmetro obrigatório nulo em método interno.
```

---

## Use Resultado quando

```text
falha é parte esperada do fluxo;
usuário precisa receber mensagens de validação;
operação pode falhar sem ser excepcional;
quer acumular erros;
quer processar lote parcialmente;
quer apresentar relatório de falhas.
```

Exemplos:

```text
validar formulário;
validar request;
simular cadastro;
processar linhas de importação;
validar múltiplos campos;
retornar sucesso/falha para tela.
```

---

## Use Optional quando

```text
busca de um único item pode não encontrar;
ausência é normal para quem chama;
não precisa de mensagem de erro no próprio retorno.
```

Exemplo:

```java
Optional<Cliente> buscarPorEmail(String email)
```

---

## Use lista vazia quando

```text
consulta de vários itens pode não retornar nada.
```

Exemplo:

```java
List<Pedido> listarPorCliente(String cliente)
```

---

## Use exception com orElseThrow quando

```text
busca não encontrar impede o caso de uso.
```

Exemplo:

```java
Pedido pedido = buscarPorCodigo(codigo)
        .orElseThrow(() -> new PedidoNaoEncontradoException(codigo));
```

---

# Parte 11 — Boas práticas

## 1. Não use exception para validação comum de formulário quando precisa acumular erros

ResultadoValidacao é melhor.

---

## 2. Não use Resultado para esconder erro técnico

Falha de banco não deve virar simplesmente:

```text
Resultado.falha("Erro.")
```

sem log, causa ou contexto.

---

## 3. Entidade continua lançando exception

A entidade protege invariantes.

Mesmo que request tenha sido validado.

---

## 4. Use Resultado em services de tentativa

Nomes bons:

```java
tentarFaturar
validarCadastro
simularVenda
importarLinhas
validarRequest
```

---

## 5. Use exception em services obrigatórios

Nomes bons:

```java
faturarObrigatorio
buscarObrigatorio
cancelar
reagendar
executar
```

---

## 6. Evite retorno ambíguo

Ruim:

```java
return null;
return false;
```

sem dizer o motivo.

Melhor:

```java
Resultado.falha("Motivo claro.")
```

---

## 7. Não exagere no padrão Resultado

Nem tudo precisa retornar Resultado.

Se o método é interno e não pode receber dado inválido, exception é mais direta.

---

# Parte 12 — Erros comuns

## 1. Usar exception como fluxo normal em lote

Ruim se para tudo na primeira linha inválida.

Melhor:

```text
ResultadoImportacao
```

quando a intenção é relatório.

---

## 2. Usar Resultado para tudo

Isso pode deixar código burocrático.

Regra de domínio crítica pode lançar exception.

---

## 3. Esvaziar erro técnico

Ruim:

```java
return Resultado.falha("Falha técnica.");
```

perdendo causa original.

---

## 4. Não proteger entidade

Ruim:

```java
public Produto(String sku, String nome, BigDecimal preco, int estoque) {
    this.sku = sku;
}
```

confiando que alguém validou antes.

---

## 5. Resultado sem mensagem clara

Ruim:

```text
Inválido.
```

Bom:

```text
E-mail do cliente é inválido.
```

---

## 6. Misturar erro de campo e erro técnico

Campo inválido e banco fora são problemas diferentes.

---

# Parte 13 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula206.app.ResultadoBasicoApp
java -cp out br.com.curso.aula206.app.ClienteCadastroResultadoApp
java -cp out br.com.curso.aula206.app.ClienteValidacaoAcumuladaApp
java -cp out br.com.curso.aula206.app.PedidoResultadoVsExceptionApp
java -cp out br.com.curso.aula206.app.ProdutoImportacaoControladaApp
```

Para cada execução, responda:

```text
o fluxo usou exception ou Resultado?
a falha era esperada?
a operação precisava acumular erros?
a entidade continuou protegida?
o service imprimiu alguma coisa?
o for foi mais adequado que Stream?
a mensagem de erro estava clara?
```

---

# Parte 14 — Desafio prático

## Contexto

Você vai criar um fluxo de validação e importação controlada de atividades.

O objetivo é praticar:

```text
Resultado<T>;
ResultadoValidacao;
ResultadoImportacao;
exceptions no domínio;
falha rápida;
acúmulo de erros;
lote com erros por linha;
decisão entre exception e resultado.
```

---

## Entidade Atividade

Crie:

```text
src\br\com\curso\aula206\dominio\atividade\Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
boolean obrigatoria;
int minutosEstimados;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
minutosEstimados maior que zero.
```

Métodos:

```java
boolean pendente()
boolean concluida()
boolean podeExecutar()
String resumo()
```

Regras:

```text
pendente:
status igual PENDENTE.

concluida:
status igual CONCLUIDA.

podeExecutar:
pendente.
```

---

## CriarAtividadeRequest

Crie:

```text
src\br\com\curso\aula206\dto\CriarAtividadeRequest.java
```

Campos:

```text
codigo;
descricao;
status;
obrigatoria;
minutosEstimados;
```

---

## ValidadorAtividadeRequest

Crie:

```text
src\br\com\curso\aula206\service\ValidadorAtividadeRequest.java
```

Método:

```java
ResultadoValidacao validar(CriarAtividadeRequest request)
```

Regras:

```text
request obrigatório;
codigo obrigatório;
descricao obrigatória;
status obrigatório;
status permitido: PENDENTE ou CONCLUIDA;
minutosEstimados maior que zero.
```

Deve acumular todos os erros possíveis.

---

## AtividadeCadastroService

Crie:

```text
src\br\com\curso\aula206\service\AtividadeCadastroService.java
```

Métodos:

```java
Resultado<Atividade> cadastrar(CriarAtividadeRequest request)

ResultadoValidacao validar(CriarAtividadeRequest request)
```

Regras:

```text
usar ValidadorAtividadeRequest;
se inválido, retornar Resultado.falha com erros unidos por "; ";
se válido, criar Atividade e retornar sucesso.
```

---

## AtividadeImportacaoControladaService

Crie:

```text
src\br\com\curso\aula206\service\AtividadeImportacaoControladaService.java
```

Método:

```java
ResultadoImportacao<Atividade> importarLinhas(List<String> linhas)
```

Formato:

```text
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS
```

Regras:

```text
linhas obrigatório;
ignorar linha vazia;
usar for para manter número da linha;
validar quantidade de colunas;
converter boolean;
converter minutos;
criar request;
usar AtividadeCadastroService;
se sucesso, adicionar item válido;
se falha, adicionar erro da linha;
se parsing falhar, adicionar erro da linha;
não interromper lote por linha inválida.
```

---

## App

Crie:

```text
AtividadeResultadoValidacaoApp
```

Deve demonstrar:

```text
cadastro válido;
cadastro com múltiplos erros;
importação com linhas válidas e inválidas;
relatório de válidos;
relatório de erros por linha.
```

Critérios:

```text
não usar exception para linha inválida esperada;
não retornar null;
não imprimir dentro do service;
entidade continua validando;
usar ResultadoValidacao;
usar ResultadoImportacao;
mensagens claras.
```

---

# Parte 15 — Desafio extra

## Fluxo obrigatório

No mesmo domínio de Atividade, crie exception:

```text
AtividadeNaoPodeSerExecutadaException
```

Na entidade, crie método:

```java
void executar()
```

Regras:

```text
se não estiver pendente, lançar AtividadeNaoPodeSerExecutadaException;
se estiver pendente, mudar status para CONCLUIDA.
```

No service, crie dois métodos:

```java
Resultado<Atividade> tentarExecutar(String codigo)

Atividade executarObrigatoria(String codigo)
```

Diferença:

```text
tentarExecutar:
retorna Resultado.falha se não puder executar.

executarObrigatoria:
lança exception se não puder executar.
```

Objetivo:

```text
comparar fluxo controlado e fluxo obrigatório.
```

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
Resultado.valor
Resultado.mensagem
ClienteCadastroService.cadastrar
ValidadorClienteRequest.validar
PedidoFaturamentoService.tentarFaturar
PedidoFaturamentoService.faturarObrigatorio
ProdutoImportacaoControladaService.importarLinhas
ProdutoImportacaoControladaService.converterLinha
```

Observe:

```text
quando falha vira Resultado;
quando falha vira exception;
quando erros são acumulados;
quando lote continua após erro;
quando entidade ainda lança exception;
quando for é mais claro que Stream.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar exception?
2. Quando usar Resultado?
3. Quando usar ResultadoValidacao?
4. Quando usar ResultadoImportacao?
5. Por que entidade ainda deve lançar exception?
6. Por que importação em lote geralmente não deve parar na primeira linha inválida?
7. Qual a diferença entre tentarFaturar e faturarObrigatorio?
8. Quando Optional é melhor que Resultado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar Resultado<T>;
criar ResultadoValidacao;
criar ResultadoImportacao;
decidir entre exception e Resultado;
decidir entre falhar rápido e acumular erros;
validar request com múltiplas mensagens;
processar lote com erros por linha;
manter entidade protegida por exceptions;
usar exception em fluxo obrigatório;
usar Resultado em fluxo controlado;
usar Optional em busca simples;
evitar null;
evitar catch para fluxo comum;
resolver AtividadeResultadoValidacaoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-206-exceptions-resultado-validacoes-controladas
git commit -m "Aula 206: exceptions resultado validacoes controladas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
exception interrompe; Resultado comunica.
```

Você estudou:

```text
Resultado<T>;
ResultadoValidacao;
ResultadoImportacao;
falha rápida;
acúmulo de erros;
validação de request;
importação controlada;
exception em domínio;
Resultado em fluxo de tentativa;
exception em fluxo obrigatório.
```

Também reforçou uma decisão profissional:

```text
não existe uma única forma certa para todo erro.
Existe a forma certa para o contexto.
```

Na próxima aula, vamos entrar no bloco de arquivos e I/O com mais profundidade:

```text
Path;
Files;
leitura de arquivos;
escrita de arquivos;
criação de diretórios;
existência de arquivo;
tratamento de erro;
boas práticas de I/O.
```

Esse bloco conecta exceptions com operações reais de backend.
