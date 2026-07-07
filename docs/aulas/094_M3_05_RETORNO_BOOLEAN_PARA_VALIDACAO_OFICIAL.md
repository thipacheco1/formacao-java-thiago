# 094 — M3.05 — Retorno boolean para validação

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
terminal integrado funciona;
debug funciona;
renomear método/parâmetro está acessível;
extrair método está acessível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-094-retorno-boolean-para-validacao
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
090 — M3.01 — De main gigante para métodos pequenos;
091 — M3.02 — Assinatura de método profissional;
092 — M3.03 — Coesão em métodos;
093 — M3.04 — Parâmetros demais e alternativas;
094 — M3.05 — Retorno boolean para validação.
```

Na aula anterior, aprendemos que muitos parâmetros podem indicar falta de agrupamento.

Agora vamos estudar um padrão muito comum:

```text
métodos de validação que retornam boolean.
```

Exemplo:

```java
public static boolean clienteValido(String nome, String email) {
    return nome != null
            && !nome.isBlank()
            && email != null
            && email.contains("@");
}
```

Esse padrão é simples, útil e aparece muito em código real.

Mas também tem limites.

---

## A pergunta central da aula

Qual é a melhor forma de representar uma validação simples?

Exemplo:

```text
cliente está válido?
produto pode ser vendido?
pedido pode ser processado?
pagamento pode ser aprovado?
OS pode ser reagendada?
mensagem pode ser enviada?
auditoria pode ser registrada?
```

Uma forma simples é retornar `boolean`:

```java
public static boolean podeProcessarPedido(PedidoEntrada pedido) {
    return pedido != null
            && pedido.cliente() != null
            && !pedido.cliente().isBlank()
            && pedido.total().compareTo(BigDecimal.ZERO) > 0;
}
```

A pergunta central é:

```text
quando o retorno boolean é suficiente para validação e quando ele começa a ficar limitado?
```

---

## O que é retorno boolean para validação

É um método que responde uma pergunta com:

```text
true
false
```

Exemplo:

```java
public static boolean textoInformado(String valor) {
    return valor != null && !valor.isBlank();
}
```

Esse método responde:

```text
o texto foi informado?
```

Se sim:

```text
true
```

Se não:

```text
false
```

Métodos assim são úteis porque deixam regras mais legíveis.

Em vez de escrever em todo lugar:

```java
nome != null && !nome.isBlank()
```

podemos escrever:

```java
textoInformado(nome)
```

---

## Por que usar boolean para validação

Porque muitas regras simples são naturalmente perguntas de sim ou não.

Exemplos:

```text
valor é positivo?
texto foi informado?
cliente está ativo?
produto tem estoque?
pagamento está aprovado?
usuário está autenticado?
OS pode ser reagendada?
status é permitido?
```

Essas perguntas têm resposta binária.

Logo, `boolean` combina bem.

---

## Nomes comuns para validação boolean

Em português, podemos usar nomes claros:

```text
textoInformado
valorPositivo
clienteValido
produtoDisponivel
pedidoProcessavel
podeProcessarPedido
podeEnviarMensagem
agendamentoValido
auditoriaValida
```

Em projetos que usam inglês, é comum:

```text
isValid
isActive
isBlank
hasStock
canProcess
canSend
shouldRetry
```

Nesta formação, vamos privilegiar nomes em português nos exemplos didáticos.

Mas o conceito é o mesmo.

---

## Cuidado com nomes genéricos

Ruim:

```java
public static boolean validar(String valor) {
}
```

Validar o quê?

Melhor:

```java
public static boolean textoInformado(String valor) {
}
```

Ruim:

```java
public static boolean check(BigDecimal valor) {
}
```

Melhor:

```java
public static boolean valorMonetarioPositivo(BigDecimal valor) {
}
```

Ruim:

```java
public static boolean ok(PedidoEntrada pedido) {
}
```

Melhor:

```java
public static boolean pedidoValido(PedidoEntrada pedido) {
}
```

Nome bom transforma boolean em código legível.

---

## Boolean deve responder pergunta

Um método boolean deve parecer uma pergunta.

Exemplos bons:

```java
textoInformado(nome)
valorPositivo(valor)
clienteAtivo(cliente)
pedidoValido(pedido)
podeProcessarPedido(pedido)
podeEnviarMensagem(dados)
```

Na leitura, fica natural:

```java
if (pedidoValido(pedido)) {
    System.out.println("Pedido válido.");
}
```

ou:

```java
if (!podeEnviarMensagem(dados)) {
    System.out.println("Mensagem bloqueada.");
}
```

---

## Quando boolean é suficiente

`boolean` é suficiente quando:

```text
a regra é simples;
só importa saber sim ou não;
a mensagem de erro não é necessária naquele ponto;
o método é usado dentro de outro fluxo;
o motivo da falha é óbvio ou tratado em outro lugar;
a validação tem uma única responsabilidade.
```

Exemplo:

```java
public static boolean valorPositivo(BigDecimal valor) {
    return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
}
```

Aqui, `true` ou `false` já resolve.

---

## Quando boolean começa a ficar limitado

`boolean` fica limitado quando precisamos saber:

```text
por que falhou;
qual campo falhou;
qual mensagem exibir;
qual código de erro retornar;
quais múltiplos erros ocorreram;
qual regra específica bloqueou;
qual ação tomar conforme o motivo.
```

Exemplo:

```java
public static boolean clienteValido(String nome, String email) {
    return nome != null
            && !nome.isBlank()
            && email != null
            && email.contains("@");
}
```

Se retornar `false`, não sabemos:

```text
nome está vazio?
email está vazio?
email não tem @?
ambos estão inválidos?
```

Nesses casos, futuramente podemos retornar algo mais rico, como:

```text
ResultadoValidacao;
lista de erros;
exception;
objeto de domínio;
código de erro.
```

Mas esta aula foca no boolean.

---

## Validação e mensagem

Um erro comum é misturar validação e mensagem demais.

Exemplo:

```java
public static boolean clienteValido(String nome, String email) {
    if (nome == null || nome.isBlank()) {
        System.out.println("Nome obrigatório.");
        return false;
    }

    if (email == null || !email.contains("@")) {
        System.out.println("E-mail inválido.");
        return false;
    }

    return true;
}
```

Isso funciona.

Mas mistura:

```text
validar;
imprimir mensagem.
```

Em programa console pequeno, pode ser aceitável.

Mas em backend real, método de validação geralmente não deveria imprimir no console.

Melhor separar:

```java
if (!clienteValido(nome, email)) {
    System.out.println("Cliente inválido.");
}
```

ou, quando precisar de mensagem específica, usar retorno mais rico em aula futura.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
ValidacaoBooleanBasica.java
```

Código:

```java
public class ValidacaoBooleanBasica {
    public static void main(String[] args) {
        String nome = "Ana";

        if (textoInformado(nome)) {
            System.out.println("Nome informado.");
        } else {
            System.out.println("Nome obrigatório.");
        }
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile:

```powershell
javac ValidacaoBooleanBasica.java
```

Execute:

```powershell
java ValidacaoBooleanBasica
```

Saída esperada:

```text
Nome informado.
```

Agora altere:

```java
String nome = "   ";
```

Saída esperada:

```text
Nome obrigatório.
```

---

## Exemplo com valor positivo

Arquivo:

```text
ValorPositivo.java
```

Código:

```java
import java.math.BigDecimal;

public class ValorPositivo {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("100.00");

        if (valorMonetarioPositivo(valor)) {
            System.out.println("Valor válido.");
        } else {
            System.out.println("Valor inválido.");
        }
    }

    public static boolean valorMonetarioPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}
```

Observe:

```text
BigDecimal precisa de compareTo;
não usamos > diretamente;
validamos null antes.
```

---

## Exemplo aplicado: cliente

Arquivo:

```text
ClienteValidacaoBoolean.java
```

Código:

```java
public class ClienteValidacaoBoolean {
    public static void main(String[] args) {
        ClienteEntrada cliente = new ClienteEntrada("Ana Silva", "ana@email.com", true);

        if (clienteValido(cliente)) {
            System.out.println("Cliente válido.");
        } else {
            System.out.println("Cliente inválido.");
        }
    }

    public static boolean clienteValido(ClienteEntrada cliente) {
        return cliente != null
                && textoInformado(cliente.nome())
                && emailValido(cliente.email())
                && cliente.ativo();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean emailValido(String email) {
        return textoInformado(email) && email.contains("@");
    }
}

record ClienteEntrada(String nome, String email, boolean ativo) {
}
```

A leitura fica clara:

```java
clienteValido(cliente)
```

Dentro dele, existem regras menores:

```text
texto informado;
email válido;
cliente ativo.
```

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoValidacaoBoolean.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoValidacaoBoolean {
    public static void main(String[] args) {
        ProdutoEntrada produto = new ProdutoEntrada("Cadeira", new BigDecimal("199.90"), 10, true);

        if (produtoDisponivelParaVenda(produto)) {
            System.out.println("Produto disponível para venda.");
        } else {
            System.out.println("Produto indisponível.");
        }
    }

    public static boolean produtoDisponivelParaVenda(ProdutoEntrada produto) {
        return produto != null
                && textoInformado(produto.nome())
                && valorPositivo(produto.preco())
                && produto.estoque() > 0
                && produto.ativo();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}

record ProdutoEntrada(String nome, BigDecimal preco, int estoque, boolean ativo) {
}
```

Nome importante:

```java
produtoDisponivelParaVenda
```

Ele comunica mais do que:

```java
produtoValido
```

Porque a regra não é apenas validade de cadastro.

É disponibilidade para venda.

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoValidacaoBoolean.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoValidacaoBoolean {
    public static void main(String[] args) {
        PedidoEntrada pedido = new PedidoEntrada("Ana", new BigDecimal("150.00"), 2, false);

        if (podeProcessarPedido(pedido)) {
            System.out.println("Pedido pode ser processado.");
        } else {
            System.out.println("Pedido não pode ser processado.");
        }
    }

    public static boolean podeProcessarPedido(PedidoEntrada pedido) {
        return pedido != null
                && textoInformado(pedido.cliente())
                && valorPositivo(pedido.valor())
                && pedido.quantidade() > 0
                && !pedido.bloqueado();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}

record PedidoEntrada(String cliente, BigDecimal valor, int quantidade, boolean bloqueado) {
}
```

A palavra `pode` ajuda.

Ela indica uma regra de permissão de fluxo.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoValidacaoBoolean.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoValidacaoBoolean {
    public static void main(String[] args) {
        PagamentoEntrada pagamento = new PagamentoEntrada(new BigDecimal("100.00"), FormaPagamento.PIX, true);

        if (pagamentoAprovavel(pagamento)) {
            System.out.println("Pagamento pode ser aprovado.");
        } else {
            System.out.println("Pagamento não pode ser aprovado.");
        }
    }

    public static boolean pagamentoAprovavel(PagamentoEntrada pagamento) {
        return pagamento != null
                && valorPositivo(pagamento.valor())
                && pagamento.formaPagamento() != null
                && pagamento.antifraudeAprovado();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record PagamentoEntrada(BigDecimal valor, FormaPagamento formaPagamento, boolean antifraudeAprovado) {
}
```

Nome:

```java
pagamentoAprovavel
```

Significa:

```text
o pagamento tem condições de ser aprovado?
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OsValidacaoBoolean.java
```

Código:

```java
import java.time.LocalDate;

public class OsValidacaoBoolean {
    public static void main(String[] args) {
        AgendamentoOs agendamento = new AgendamentoOs("OS-001", LocalDate.now().plusDays(1), Periodo.MANHA, false);

        if (podeAgendarOs(agendamento)) {
            System.out.println("OS pode ser agendada.");
        } else {
            System.out.println("OS não pode ser agendada.");
        }
    }

    public static boolean podeAgendarOs(AgendamentoOs agendamento) {
        return agendamento != null
                && textoInformado(agendamento.certificado())
                && dataHojeOuFutura(agendamento.data())
                && agendamento.periodo() != null
                && !agendamento.cancelada();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean dataHojeOuFutura(LocalDate data) {
        return data != null && !data.isBefore(LocalDate.now());
    }
}

enum Periodo {
    MANHA,
    TARDE
}

record AgendamentoOs(String certificado, LocalDate data, Periodo periodo, boolean cancelada) {
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaValidacaoBoolean.java
```

Código:

```java
public class MensageriaValidacaoBoolean {
    public static void main(String[] args) {
        DadosMensagem dados = new DadosMensagem("Ana", "11999999999", true, false);

        if (podeEnviarMensagem(dados)) {
            System.out.println("Mensagem pode ser enviada.");
        } else {
            System.out.println("Mensagem não pode ser enviada.");
        }
    }

    public static boolean podeEnviarMensagem(DadosMensagem dados) {
        return dados != null
                && textoInformado(dados.cliente())
                && textoInformado(dados.telefone())
                && dados.optIn()
                && !dados.bloqueado();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

record DadosMensagem(String cliente, String telefone, boolean optIn, boolean bloqueado) {
}
```

A regra é clara:

```text
cliente informado;
telefone informado;
tem opt-in;
não está bloqueado.
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaValidacaoBoolean.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaValidacaoBoolean {
    public static void main(String[] args) {
        RegistroAuditoria auditoria = new RegistroAuditoria("aline", "CRIACAO", "Produto", 10L, Instant.now());

        if (auditoriaRegistravel(auditoria)) {
            System.out.println("Auditoria pode ser registrada.");
        } else {
            System.out.println("Auditoria inválida.");
        }
    }

    public static boolean auditoriaRegistravel(RegistroAuditoria auditoria) {
        return auditoria != null
                && textoInformado(auditoria.usuario())
                && operacaoValida(auditoria.operacao())
                && textoInformado(auditoria.entidade())
                && auditoria.entidadeId() != null
                && auditoria.entidadeId() > 0
                && auditoria.criadoEm() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean operacaoValida(String operacao) {
        return "CRIACAO".equals(operacao)
                || "EDICAO".equals(operacao)
                || "EXCLUSAO".equals(operacao);
    }
}

record RegistroAuditoria(String usuario, String operacao, String entidade, Long entidadeId, Instant criadoEm) {
}
```

---

## Refatoração: condição grande para métodos boolean

Antes:

```java
if (pedido != null
        && pedido.cliente() != null
        && !pedido.cliente().isBlank()
        && pedido.valor() != null
        && pedido.valor().compareTo(BigDecimal.ZERO) > 0
        && pedido.quantidade() > 0
        && !pedido.bloqueado()) {
    System.out.println("Pedido pode ser processado.");
}
```

Depois:

```java
if (podeProcessarPedido(pedido)) {
    System.out.println("Pedido pode ser processado.");
}
```

Ganho:

```text
a regra ganha nome;
o if fica legível;
a validação pode ser reutilizada;
o debug fica mais fácil;
a intenção fica explícita.
```

---

## Refatoração: boolean com nome ruim

Antes:

```java
public static boolean validar(PedidoEntrada pedido) {
}
```

Depois:

```java
public static boolean podeProcessarPedido(PedidoEntrada pedido) {
}
```

Por que melhor?

Porque `validar` é genérico.

`podeProcessarPedido` diz qual decisão será tomada.

---

## Refatoração: mensagem fora da validação

Antes:

```java
public static boolean pedidoValido(PedidoEntrada pedido) {
    if (pedido == null) {
        System.out.println("Pedido obrigatório.");
        return false;
    }

    return true;
}
```

Depois:

```java
if (!pedidoValido(pedido)) {
    System.out.println("Pedido inválido.");
    return;
}
```

Ou, se precisar de mensagem específica, em aula futura:

```java
ResultadoValidacao resultado = validarPedido(pedido);
```

Aqui aprendemos a separar o simples.

---

## Boolean positivo versus negativo

Prefira nomes positivos.

Ruim:

```java
public static boolean pedidoInvalido(PedidoEntrada pedido) {
}
```

Uso:

```java
if (!pedidoInvalido(pedido)) {
}
```

Isso gera leitura com dupla negação.

Melhor:

```java
public static boolean pedidoValido(PedidoEntrada pedido) {
}
```

Uso:

```java
if (pedidoValido(pedido)) {
}
```

Ou:

```java
if (!pedidoValido(pedido)) {
    return;
}
```

Nomes positivos reduzem confusão.

---

## Guard clause com boolean

Boolean é muito usado com guard clause.

Exemplo:

```java
if (!podeProcessarPedido(pedido)) {
    System.out.println("Pedido inválido.");
    return;
}

System.out.println("Processando pedido...");
```

Isso evita `else` grande.

Leitura:

```text
se não pode processar, pare;
se passou, continue o fluxo principal.
```

Essa técnica será aprofundada em outras aulas.

---

## Quando criar método boolean pequeno

Crie método boolean quando:

```text
a condição aparece repetida;
a condição é grande;
a condição tem nome de regra;
a condição combina vários detalhes;
a leitura do if está ruim;
a regra precisa ser testada isoladamente;
a regra representa decisão de negócio.
```

Exemplo:

```java
public static boolean statusPermiteReagendamento(String status) {
    return "AGENDADA".equals(status) || "REAGENDADA".equals(status);
}
```

Muito melhor do que repetir:

```java
"AGENDADA".equals(status) || "REAGENDADA".equals(status)
```

em vários lugares.

---

## Quando não criar método boolean

Evite criar método se ele não melhora nada.

Exemplo desnecessário:

```java
public static boolean eMaiorQueZero(int numero) {
    return numero > 0;
}
```

Se usado apenas uma vez e sem valor de domínio, talvez não precise.

Mas se for regra de domínio:

```java
quantidadeValida(quantidade)
```

pode fazer sentido.

A pergunta é:

```text
o método dá nome para uma intenção real?
```

---

## Testes manuais simples

Ainda não estamos em JUnit.

Mas podemos testar boolean com saídas simples.

Arquivo:

```text
TestesManuaisValidacaoBoolean.java
```

Código:

```java
import java.math.BigDecimal;

public class TestesManuaisValidacaoBoolean {
    public static void main(String[] args) {
        testarTextoInformado();
        testarValorPositivo();

        System.out.println("Testes manuais finalizados.");
    }

    public static void testarTextoInformado() {
        conferir(true, textoInformado("Ana"), "texto informado deveria ser true");
        conferir(false, textoInformado("   "), "texto em branco deveria ser false");
        conferir(false, textoInformado(null), "texto null deveria ser false");
    }

    public static void testarValorPositivo() {
        conferir(true, valorPositivo(new BigDecimal("1.00")), "valor positivo deveria ser true");
        conferir(false, valorPositivo(BigDecimal.ZERO), "zero deveria ser false");
        conferir(false, valorPositivo(null), "null deveria ser false");
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static void conferir(boolean esperado, boolean atual, String mensagem) {
        if (esperado != atual) {
            throw new IllegalStateException(mensagem + " | esperado=" + esperado + " | atual=" + atual);
        }
    }
}
```

Compile:

```powershell
javac TestesManuaisValidacaoBoolean.java
```

Execute:

```powershell
java TestesManuaisValidacaoBoolean
```

Saída esperada:

```text
Testes manuais finalizados.
```

---

## Leitura crítica dos testes manuais

Esses testes ainda são simples.

Mas já ensinam:

```text
definir entrada;
definir esperado;
executar regra;
comparar resultado;
falhar quando resultado estiver errado.
```

Isso prepara para testes automatizados no futuro.

---

## Erros comuns

### Erro 1 — Nome genérico

```java
validar()
check()
ok()
```

Use nome de regra.

### Erro 2 — Boolean negativo

```java
pedidoInvalido
naoPodeProcessar
```

Pode gerar dupla negação.

### Erro 3 — Retornar boolean sem nome claro

Se o método se chama `processar`, mas retorna boolean, há confusão.

### Erro 4 — Imprimir dentro de toda validação

Em console simples pode acontecer, mas não deve virar padrão.

### Erro 5 — Boolean quando precisa de mensagem específica

Se precisa saber o motivo da falha, boolean pode ser pouco.

### Erro 6 — Condição enorme sem método

Dê nome para a regra.

### Erro 7 — Método boolean fazendo alteração

Validação deve evitar efeitos colaterais.

Ruim:

```java
public static boolean pedidoValido(Pedido pedido) {
    pedido.setStatus("VALIDADO");
    return true;
}
```

### Erro 8 — NullPointerException por ordem errada

Valide `null` antes de acessar campos.

---

## Diagnóstico

Quando uma validação boolean der errado:

```text
1. Imprima cada parte da condição.
2. Separe a condição em booleanos menores.
3. Confira null antes de acessar campo.
4. Confira nomes positivos/negativos.
5. Confira se o método realmente só valida.
6. Confira se a mensagem está fora ou dentro por decisão consciente.
7. Confira se boolean é suficiente para o caso.
8. Crie testes manuais com true e false.
```

Exemplo:

```java
boolean clienteInformado = textoInformado(pedido.cliente());
boolean valorPositivo = valorPositivo(pedido.valor());
boolean quantidadeValida = pedido.quantidade() > 0;
boolean naoBloqueado = !pedido.bloqueado();

System.out.println("clienteInformado: " + clienteInformado);
System.out.println("valorPositivo: " + valorPositivo);
System.out.println("quantidadeValida: " + quantidadeValida);
System.out.println("naoBloqueado: " + naoBloqueado);
```

---

## Debug recomendado

Use debug em:

```text
PedidoValidacaoBoolean.java
```

Coloque breakpoints em:

```java
podeProcessarPedido(...)
textoInformado(...)
valorPositivo(...)
```

Observe:

```text
pedido recebido;
cada parte da regra;
retorno final;
como `if` usa o resultado boolean.
```

Depois use debug em:

```text
TestesManuaisValidacaoBoolean.java
```

Observe:

```text
valor esperado;
valor atual;
falha quando esperado e atual diferem.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — remover validação de null

Remova:

```java
pedido != null
```

e passe `null`.

Explique o erro.

### Teste 2 — inverter regra

Troque:

```java
valor.compareTo(BigDecimal.ZERO) > 0
```

por:

```java
valor.compareTo(BigDecimal.ZERO) < 0
```

Veja o teste falhar.

### Teste 3 — nome negativo

Crie:

```java
pedidoInvalido
```

e use:

```java
if (!pedidoInvalido(pedido))
```

Explique a confusão.

### Teste 4 — imprimir dentro da validação

Coloque `System.out.println` dentro de `valorPositivo`.

Explique por que cálculo/validação com efeito colateral pode ser ruim.

### Teste 5 — precisar de mensagem específica

Crie um cliente com nome vazio e email inválido.

Perceba que `false` não diz todos os motivos.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-094-retorno-boolean-para-validacao
cd labs\m3\aula-094-retorno-boolean-para-validacao
```

Crie arquivos:

```text
ValidacaoBooleanBasica.java
ValorPositivo.java
ClienteValidacaoBoolean.java
ProdutoValidacaoBoolean.java
PedidoValidacaoBoolean.java
PagamentoValidacaoBoolean.java
OsValidacaoBoolean.java
MensageriaValidacaoBoolean.java
AuditoriaValidacaoBoolean.java
TestesManuaisValidacaoBoolean.java
ErroNomeGenerico.java
ErroBooleanNegativo.java
ErroMensagemDentroValidacao.java
ErroBooleanInsuficiente.java
ErroEfeitoColateral.java
README.md
```

Compile:

```powershell
javac ValidacaoBooleanBasica.java
javac ValorPositivo.java
javac ClienteValidacaoBoolean.java
javac ProdutoValidacaoBoolean.java
javac PedidoValidacaoBoolean.java
javac PagamentoValidacaoBoolean.java
javac OsValidacaoBoolean.java
javac MensageriaValidacaoBoolean.java
javac AuditoriaValidacaoBoolean.java
javac TestesManuaisValidacaoBoolean.java
```

Execute:

```powershell
java ValidacaoBooleanBasica
java ValorPositivo
java ClienteValidacaoBoolean
java ProdutoValidacaoBoolean
java PedidoValidacaoBoolean
java PagamentoValidacaoBoolean
java OsValidacaoBoolean
java MensageriaValidacaoBoolean
java AuditoriaValidacaoBoolean
java TestesManuaisValidacaoBoolean
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 094 — Retorno boolean para validação

## Objetivo

Aprender a criar métodos de validação que retornam `boolean`, usando nomes claros como `textoInformado`, `valorPositivo`, `pedidoValido` e `podeProcessarPedido`.

## Conceitos

- Boolean responde sim ou não.
- Método boolean deve parecer pergunta.
- Nome positivo reduz confusão.
- `boolean` é bom para regra simples.
- `boolean` é limitado quando precisa explicar motivo da falha.
- Validação não deve ter efeito colateral inesperado.
- Condições grandes podem virar métodos boolean.
- Guard clause combina bem com boolean.
- Testes manuais ajudam a validar true e false.

## Comandos

```powershell
javac PedidoValidacaoBoolean.java
java PedidoValidacaoBoolean
javac TestesManuaisValidacaoBoolean.java
java TestesManuaisValidacaoBoolean
```
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes booleanos |
| Extract Method | ação da IDE | Extrair condição para método |
| Introduce Variable | ação da IDE | Separar condição em booleanos |
| Debug | `Shift + F9` | Observar retorno |
| Step Into | `F7` em muitos keymaps | Entrar na validação |
| Step Over | `F8` em muitos keymaps | Avançar |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar condição |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar comportamento |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 094 — Retorno boolean para validação

### O que aprendi

Aprendi que métodos de validação com retorno `boolean` são úteis para regras simples de sim ou não, desde que tenham nomes claros e não escondam efeitos colaterais.

### O que pratiquei

Criei validações booleanas para texto, valor monetário, cliente, produto, pedido, pagamento, OS, mensageria e auditoria. Também criei testes manuais simples para validar entradas true e false.

### Conceitos principais

- boolean
- retorno boolean
- validação
- textoInformado
- valorPositivo
- clienteValido
- pedidoValido
- podeProcessarPedido
- podeEnviarMensagem
- guard clause
- nome positivo
- efeito colateral
- mensagem de erro
- boolean insuficiente
- teste manual

### Arquivos criados

- `labs/m3/aula-094-retorno-boolean-para-validacao/ValidacaoBooleanBasica.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/ValorPositivo.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/ClienteValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/ProdutoValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/PedidoValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/PagamentoValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/OsValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/MensageriaValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/AuditoriaValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/TestesManuaisValidacaoBoolean.java`
- `labs/m3/aula-094-retorno-boolean-para-validacao/README.md`

### Comandos usados

```powershell
javac PedidoValidacaoBoolean.java
java PedidoValidacaoBoolean
javac TestesManuaisValidacaoBoolean.java
java TestesManuaisValidacaoBoolean
```

### Erros que quero evitar

- método boolean com nome genérico;
- método boolean com nome negativo confuso;
- imprimir dentro de validação sem necessidade;
- usar boolean quando preciso de mensagem específica;
- deixar condição enorme no if;
- validar sem testar null;
- criar validação com efeito colateral;
- não testar casos true e false.
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
git add labs/m3/aula-094-retorno-boolean-para-validacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 094: pratica retorno boolean para validacao"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é retorno boolean para validação?
2. Quando `boolean` é suficiente?
3. Quando `boolean` começa a ser limitado?
4. Por que método boolean deve parecer pergunta?
5. O que é nome positivo?
6. Por que evitar nome negativo?
7. Qual problema de `if (!pedidoInvalido())`?
8. Por que `textoInformado` melhora leitura?
9. Por que `valorPositivo` deve validar null?
10. Por que BigDecimal usa compareTo?
11. O que é guard clause?
12. Por que validação não deve ter efeito colateral inesperado?
13. Quando faz sentido extrair condição para método boolean?
14. Quando não faz sentido criar método boolean?
15. Por que mensagem específica pode exigir retorno mais rico?
16. Como testar método boolean manualmente?
17. Como aplicar em pedido?
18. Como aplicar em OS?
19. Como aplicar em mensageria?
20. Qual método boolean você criou nesta aula e por quê?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar retorno boolean para validação;
criar método boolean com nome claro;
diferenciar regra simples de regra que precisa mensagem;
usar nomes positivos;
evitar dupla negação;
criar textoInformado;
criar valorPositivo;
criar clienteValido;
criar produtoDisponivelParaVenda;
criar podeProcessarPedido;
criar pagamentoAprovavel;
criar podeAgendarOs;
criar podeEnviarMensagem;
criar auditoriaRegistravel;
usar guard clause;
evitar efeito colateral em validação;
separar condição grande em método;
criar testes manuais para true e false;
debugar retorno boolean;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar `ResultadoValidacao` completo.

Não precisa ainda acumular múltiplos erros.

Não precisa ainda usar exception como estratégia principal.

Não precisa ainda usar Bean Validation.

Não precisa ainda usar JUnit.

Esses assuntos virão depois.

O objetivo é:

```text
usar boolean com clareza para regras simples de validação e decisão.
```

---

## Fechamento

Hoje estudamos retorno boolean para validação.

A ideia central foi:

```text
métodos booleanos dão nome para perguntas de sim ou não.
```

Vimos que:

```text
boolean é ótimo para regra simples;
nome do método precisa parecer pergunta;
nome positivo reduz confusão;
condições grandes podem virar métodos;
guard clause combina com validação boolean;
validação não deve ter efeito colateral inesperado;
boolean não explica motivo da falha;
quando a mensagem importa, precisaremos de retorno mais rico.
```

O ponto mais importante é:

```text
boolean é simples e poderoso quando usado para perguntas claras.
```

Na próxima aula, vamos estudar:

```text
Métodos de cálculo.
```

A próxima aula vai aprofundar métodos que retornam números, totais, médias, maior, menor, arredondamento e regras de cálculo com retorno claro.
