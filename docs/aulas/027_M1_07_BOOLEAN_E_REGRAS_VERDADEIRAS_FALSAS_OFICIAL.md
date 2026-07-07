# 027 — M1.07 — Boolean e Regras Verdadeiras/Falsas

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.07.01` — Boolean e regras verdadeiras/falsas — Conceito, por que existe e vocabulário essencial.
- `M1.07.02` — Boolean e regras verdadeiras/falsas — Exemplo mínimo digitado do zero.
- `M1.07.03` — Boolean e regras verdadeiras/falsas — Exemplo aplicado ao domínio corporativo.
- `M1.07.04` — Boolean e regras verdadeiras/falsas — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `boolean`, `true`, `false`, nomes profissionais para variáveis booleanas, leitura de regras, estados verdadeiros/falsos, armadilhas comuns e aplicação em validações iniciais de backend.

---

## Onde estamos na formação

Estamos no Módulo 1, estudando os fundamentos da linguagem Java.

Até aqui, já passamos por:

```text
M1.01 — primeiro programa Java destrinchado;
M1.02 — blocos, chaves, indentação e leitura de código;
M1.03 — comentários úteis e documentação inicial;
M1.04 — variáveis e nomes profissionais;
M1.05 — tipos inteiros em Java;
M1.06 — tipos decimais e primeiras limitações.
```

Já vimos variáveis com:

```java
String nomeCliente = "Cliente Exemplo";
int quantidadePedidos = 10;
double valorTotal = 150.75;
long idPedido = 9000000001L;
```

Agora vamos estudar variáveis que representam verdadeiro ou falso.

Em Java, esse tipo é:

```java
boolean
```

Exemplos:

```java
boolean clienteAtivo = true;
boolean pedidoPago = false;
boolean usuarioBloqueado = true;
```

Esse tipo será essencial para decisões futuras com `if`, validações, regras de negócio, permissões e fluxos de backend.

---

## Hoje a aula é sobre transformar regras em verdadeiro ou falso

Muitas regras de sistemas começam com uma pergunta.

Exemplos:

```text
O cliente está ativo?
O pedido foi pago?
A ordem de serviço está aberta?
O usuário está autenticado?
O produto está disponível?
A senha é válida?
O prazo expirou?
A atividade permite reagendamento?
O pagamento foi aprovado?
A requisição possui token?
```

Cada pergunta dessas pode ter uma resposta:

```text
sim ou não;
verdadeiro ou falso;
true ou false.
```

Em Java, usamos `boolean` para isso.

Boolean é a base das decisões.

Antes de escrever:

```java
if (...)
```

é preciso entender bem o que é uma regra verdadeira ou falsa.

---

## O que é `boolean`

`boolean` é um tipo primitivo do Java que aceita apenas dois valores:

```java
true
false
```

Exemplo:

```java
boolean clienteAtivo = true;
```

Leitura:

```text
clienteAtivo recebe verdadeiro.
```

Outro exemplo:

```java
boolean pedidoPago = false;
```

Leitura:

```text
pedidoPago recebe falso.
```

Não existe meio termo em um `boolean`.

Ele é verdadeiro ou falso.

---

## `true` e `false`

Os valores booleanos em Java são escritos em minúsculas:

```java
true
false
```

Errado:

```java
True
False
TRUE
FALSE
```

Java diferencia maiúsculas e minúsculas.

Então:

```java
boolean ativo = true;
```

está certo.

Mas:

```java
boolean ativo = True;
```

está errado.

---

## Boolean não é texto

Erro comum:

```java
boolean clienteAtivo = "true";
```

Aqui `"true"` é texto, porque está entre aspas.

Certo:

```java
boolean clienteAtivo = true;
```

Outro erro:

```java
boolean pedidoPago = "false";
```

Certo:

```java
boolean pedidoPago = false;
```

Regra:

```text
boolean usa true/false sem aspas.
```

---

## Boolean não é número

Em algumas linguagens, `1` pode representar verdadeiro e `0` falso.

Em Java, não.

Errado:

```java
boolean ativo = 1;
boolean bloqueado = 0;
```

Certo:

```java
boolean ativo = true;
boolean bloqueado = false;
```

Java é fortemente tipado.

Boolean é boolean.

Número é número.

Texto é texto.

Essa separação evita confusão.

---

## Por que boolean existe

Boolean existe para representar condições.

Exemplos:

```java
boolean clienteAtivo = true;
boolean emailValidado = false;
boolean possuiPendencia = true;
boolean permiteReagendamento = false;
```

Essas variáveis ajudam o código a expressar regras.

Compare:

```java
boolean x = true;
```

com:

```java
boolean clienteAtivo = true;
```

O primeiro não diz nada.

O segundo comunica uma regra.

Nome é muito importante em boolean.

---

## Nome de boolean deve soar como pergunta

Um bom nome booleano geralmente pode ser lido como uma pergunta de sim ou não.

Exemplos bons:

```java
boolean clienteAtivo = true;
boolean pedidoPago = false;
boolean usuarioAutenticado = true;
boolean possuiPendencia = false;
boolean permiteReagendamento = true;
boolean produtoDisponivel = true;
boolean senhaValida = false;
```

Perguntas:

```text
cliente está ativo?
pedido foi pago?
usuário está autenticado?
possui pendência?
permite reagendamento?
produto está disponível?
senha é válida?
```

Isso torna o código legível.

---

## Evite nomes genéricos como `flag`

Nome ruim:

```java
boolean flag = true;
```

Flag de quê?

Melhor:

```java
boolean clienteAtivo = true;
```

Outro ruim:

```java
boolean retorno = false;
```

Retorno de quê?

Melhor:

```java
boolean pagamentoAprovado = false;
```

Outro ruim:

```java
boolean status = true;
```

Status geralmente não é boolean.

Melhor:

```java
boolean pedidoAtivo = true;
```

ou:

```java
String statusPedido = "ABERTO";
```

Use boolean quando a resposta for claramente verdadeiro/falso.

---

## Prefixos comuns em boolean

Alguns padrões comuns:

```text
is;
has;
can;
should;
possui;
permite;
deve;
esta;
tem.
```

Em Java com código em inglês, é comum:

```java
boolean isActive = true;
boolean hasPendingItems = false;
boolean canRetry = true;
boolean shouldNotify = false;
```

Em código em português, se o time permitir:

```java
boolean estaAtivo = true;
boolean possuiPendencias = false;
boolean permiteReagendamento = true;
boolean deveNotificar = false;
```

O mais importante é consistência.

Em projetos reais, siga o padrão do time.

Nesta formação, usaremos nomes em português quando isso ajudar no entendimento do domínio.

---

## `boolean` em português claro

Exemplos bons:

```java
boolean clienteAtivo = true;
boolean pedidoCancelado = false;
boolean possuiEstoque = true;
boolean permiteNovaTentativa = false;
boolean senhaValida = true;
boolean usuarioBloqueado = false;
```

Esses nomes comunicam intenção sem comentário.

Compare:

```java
// indica se pode tentar de novo
boolean x = true;
```

Melhor:

```java
boolean permiteNovaTentativa = true;
```

O nome substituiu o comentário ruim.

---

## Exemplo mínimo com boolean

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        boolean clienteAtivo = true;

        System.out.println("Cliente ativo: " + clienteAtivo);
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída:

```text
Cliente ativo: true
```

Esse é o uso mais simples.

---

## Exemplo com dois estados

Código:

```java
public class Main {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;

        System.out.println("Cliente ativo: " + clienteAtivo);
        System.out.println("Possui pendência: " + possuiPendencia);
    }
}
```

Saída:

```text
Cliente ativo: true
Possui pendência: false
```

Aqui já temos duas regras:

```text
cliente está ativo;
cliente não possui pendência.
```

---

## Boolean não executa decisão sozinho

Este código apenas imprime valores:

```java
boolean clienteAtivo = true;

System.out.println(clienteAtivo);
```

Ele não toma decisão.

Para tomar decisão, usaremos `if` em aulas próximas.

Exemplo futuro:

```java
if (clienteAtivo) {
    System.out.println("Cliente pode continuar");
}
```

Nesta aula, ainda não estamos estudando `if` profundamente.

Estamos preparando o conceito de verdadeiro/falso.

---

## Boolean e leitura de regra

Uma variável booleana deve deixar a regra clara.

Exemplo:

```java
boolean podeAprovarPedido = true;
```

Leitura:

```text
pode aprovar pedido? sim.
```

Outro exemplo:

```java
boolean podeCancelarPedido = false;
```

Leitura:

```text
pode cancelar pedido? não.
```

Isso é mais claro do que:

```java
boolean aprovado = true;
boolean cancelado = false;
```

Dependendo do contexto, `aprovado` e `cancelado` podem ser bons.

Mas quando a regra envolve permissão, prefira nomes como:

```text
pode;
permite;
deve;
possui;
esta.
```

---

## Estados versus permissões

Boolean pode representar estados:

```java
boolean clienteAtivo = true;
boolean pedidoPago = false;
boolean usuarioBloqueado = false;
```

Também pode representar permissões:

```java
boolean permiteReagendamento = true;
boolean podeCancelarPedido = false;
boolean podeEnviarNotificacao = true;
```

E pode representar validações:

```java
boolean emailValido = true;
boolean senhaValida = false;
boolean tokenPresente = true;
```

Cada tipo de regra pede um nome coerente.

---

## Cuidado com nomes negativos

Nomes negativos podem confundir.

Exemplo:

```java
boolean naoPossuiPendencia = true;
```

Leitura:

```text
não possui pendência é verdadeiro.
```

Isso exige esforço mental.

Muitas vezes é melhor:

```java
boolean possuiPendencia = false;
```

Outro exemplo ruim:

```java
boolean naoEstaBloqueado = true;
```

Melhor:

```java
boolean usuarioBloqueado = false;
```

Evite dupla negação.

Código com dupla negação fica difícil quando entrar `if`.

---

## Exemplo de dupla negação problemática

Imagine:

```java
boolean naoPossuiPendencia = true;
```

Futuro `if`:

```java
if (!naoPossuiPendencia) {
    System.out.println("Possui pendência");
}
```

Isso é ruim de ler.

Melhor:

```java
boolean possuiPendencia = false;
```

Futuro `if`:

```java
if (possuiPendencia) {
    System.out.println("Possui pendência");
}
```

Muito mais claro.

Regra:

```text
prefira nomes positivos.
```

---

## O operador `!` em nível inicial

O operador:

```java
!
```

significa negação lógica.

Exemplo:

```java
boolean clienteAtivo = true;

System.out.println(!clienteAtivo);
```

Saída:

```text
false
```

Se `clienteAtivo` é verdadeiro, `!clienteAtivo` é falso.

Outro exemplo:

```java
boolean possuiPendencia = false;

System.out.println(!possuiPendencia);
```

Saída:

```text
true
```

Nesta aula, apenas reconheça o operador.

Ele será mais usado em condicionais.

---

## Não exagere no `!`

Compare:

```java
boolean usuarioBloqueado = false;

System.out.println(!usuarioBloqueado);
```

Isso imprime se o usuário não está bloqueado.

Mas talvez um nome melhor seja:

```java
boolean usuarioLiberado = true;

System.out.println(usuarioLiberado);
```

Nem sempre a solução é negar.

Às vezes, a solução é nomear melhor.

---

## Operadores de comparação geram boolean

Comparações geram valores booleanos.

Exemplo:

```java
int idade = 20;

boolean maiorDeIdade = idade >= 18;
```

A expressão:

```java
idade >= 18
```

resulta em:

```text
true
```

Então:

```java
maiorDeIdade
```

recebe `true`.

Outro exemplo:

```java
int quantidadeEstoque = 0;

boolean produtoDisponivel = quantidadeEstoque > 0;
```

Se `quantidadeEstoque` é 0, então:

```java
produtoDisponivel
```

recebe `false`.

Operadores serão aprofundados depois.

Mas aqui já vemos boolean nascendo de uma regra.

---

## Comparações comuns

Exemplos:

```java
int quantidade = 10;

boolean maiorQueZero = quantidade > 0;
boolean menorQueCem = quantidade < 100;
boolean igualADez = quantidade == 10;
boolean diferenteDeZero = quantidade != 0;
boolean maiorOuIgualADez = quantidade >= 10;
boolean menorOuIgualADez = quantidade <= 10;
```

Operadores:

```text
> maior que;
< menor que;
== igual a;
!= diferente de;
>= maior ou igual;
<= menor ou igual.
```

Não confunda:

```java
=
```

com:

```java
==
```

`=` atribui.

`==` compara.

---

## `=` versus `==`

Atribuição:

```java
int quantidade = 10;
```

Leitura:

```text
quantidade recebe 10.
```

Comparação:

```java
boolean quantidadeIgualADez = quantidade == 10;
```

Leitura:

```text
quantidade é igual a 10?
```

Esse ponto é fundamental.

Erro comum:

```java
boolean resultado = quantidade = 10;
```

Isso não faz sentido para `int` em boolean e gera erro.

Use:

```java
boolean resultado = quantidade == 10;
```

---

## Exemplo com comparação

Arquivo:

```text
ComparacaoBoolean.java
```

Código:

```java
public class ComparacaoBoolean {
    public static void main(String[] args) {
        int quantidadeEstoque = 15;

        boolean possuiEstoque = quantidadeEstoque > 0;
        boolean estoqueBaixo = quantidadeEstoque < 5;

        System.out.println("Possui estoque: " + possuiEstoque);
        System.out.println("Estoque baixo: " + estoqueBaixo);
    }
}
```

Saída:

```text
Possui estoque: true
Estoque baixo: false
```

A regra ficou explícita.

---

## Boolean aplicado antes do `if`

Mesmo sem `if`, podemos calcular regras.

Exemplo:

```java
int idadeCliente = 17;

boolean maiorDeIdade = idadeCliente >= 18;

System.out.println("Maior de idade: " + maiorDeIdade);
```

Saída:

```text
Maior de idade: false
```

Isso prepara a próxima etapa.

Futuramente:

```java
if (maiorDeIdade) {
    System.out.println("Pode continuar");
}
```

Por enquanto, apenas calcule e imprima.

---

## Operadores lógicos em nível inicial

Boolean pode ser combinado com outros booleanos.

Operadores principais:

```text
&& -> E lógico;
|| -> OU lógico;
!  -> NÃO lógico.
```

Exemplo com `&&`:

```java
boolean clienteAtivo = true;
boolean possuiPendencia = false;

boolean podeComprar = clienteAtivo && !possuiPendencia;
```

Leitura:

```text
pode comprar se cliente está ativo E não possui pendência.
```

Exemplo com `||`:

```java
boolean usuarioAdmin = false;
boolean usuarioSupervisor = true;

boolean podeAprovar = usuarioAdmin || usuarioSupervisor;
```

Leitura:

```text
pode aprovar se for admin OU supervisor.
```

Esses operadores serão aprofundados em aula própria.

Aqui a intenção é mostrar como boolean começa a virar regra.

---

## Tabela simples do `&&`

Para `&&`, tudo precisa ser verdadeiro.

```text
true  && true  -> true
true  && false -> false
false && true  -> false
false && false -> false
```

Exemplo:

```java
boolean clienteAtivo = true;
boolean possuiLimite = true;

boolean podeComprar = clienteAtivo && possuiLimite;
```

Resultado:

```text
true
```

Se qualquer parte for falsa, o resultado é falso.

---

## Tabela simples do `||`

Para `||`, basta um ser verdadeiro.

```text
true  || true  -> true
true  || false -> true
false || true  -> true
false || false -> false
```

Exemplo:

```java
boolean usuarioAdmin = false;
boolean usuarioSupervisor = true;

boolean podeAprovar = usuarioAdmin || usuarioSupervisor;
```

Resultado:

```text
true
```

Porque uma das condições é verdadeira.

---

## Exemplo mínimo com regra composta

Arquivo:

```text
RegraComposta.java
```

Código:

```java
public class RegraComposta {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;

        boolean podeComprar = clienteAtivo && !possuiPendencia;

        System.out.println("Cliente ativo: " + clienteAtivo);
        System.out.println("Possui pendência: " + possuiPendencia);
        System.out.println("Pode comprar: " + podeComprar);
    }
}
```

Saída:

```text
Cliente ativo: true
Possui pendência: false
Pode comprar: true
```

Aqui já temos uma regra real.

---

## Exemplo aplicado ao domínio corporativo: cliente

Arquivo:

```text
ClienteBoolean.java
```

Código:

```java
public class ClienteBoolean {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendenciaFinanceira = false;
        boolean emailValidado = true;

        boolean clientePodeComprar = clienteAtivo && !possuiPendenciaFinanceira && emailValidado;

        System.out.println("Cliente ativo: " + clienteAtivo);
        System.out.println("Possui pendência financeira: " + possuiPendenciaFinanceira);
        System.out.println("Email validado: " + emailValidado);
        System.out.println("Cliente pode comprar: " + clientePodeComprar);
    }
}
```

Regra:

```text
cliente pode comprar se está ativo,
não possui pendência financeira,
e tem e-mail validado.
```

O código comunica a regra.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
PedidoBoolean.java
```

Código:

```java
public class PedidoBoolean {
    public static void main(String[] args) {
        boolean pedidoPago = true;
        boolean pedidoCancelado = false;
        boolean produtoDisponivel = true;

        boolean pedidoPodeSerEnviado = pedidoPago && !pedidoCancelado && produtoDisponivel;

        System.out.println("Pedido pago: " + pedidoPago);
        System.out.println("Pedido cancelado: " + pedidoCancelado);
        System.out.println("Produto disponível: " + produtoDisponivel);
        System.out.println("Pedido pode ser enviado: " + pedidoPodeSerEnviado);
    }
}
```

Regra:

```text
pedido pode ser enviado se está pago,
não está cancelado,
e o produto está disponível.
```

Isso é backend na forma mais básica.

Ainda não há `if`, banco ou API.

Mas já há regra.

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
OrdemServicoBoolean.java
```

Código:

```java
public class OrdemServicoBoolean {
    public static void main(String[] args) {
        boolean ordemServicoAberta = true;
        boolean possuiAtividadePendente = true;
        boolean tecnicoDisponivel = false;

        boolean permiteAgendamento = ordemServicoAberta && possuiAtividadePendente && tecnicoDisponivel;

        System.out.println("OS aberta: " + ordemServicoAberta);
        System.out.println("Possui atividade pendente: " + possuiAtividadePendente);
        System.out.println("Técnico disponível: " + tecnicoDisponivel);
        System.out.println("Permite agendamento: " + permiteAgendamento);
    }
}
```

Resultado esperado:

```text
Permite agendamento: false
```

Porque `tecnicoDisponivel` é falso.

Esse exemplo mostra como uma única condição falsa pode bloquear uma regra com `&&`.

---

## Exemplo aplicado ao domínio corporativo: autorização

Arquivo:

```text
AutorizacaoBoolean.java
```

Código:

```java
public class AutorizacaoBoolean {
    public static void main(String[] args) {
        boolean usuarioAdmin = false;
        boolean usuarioSupervisor = true;
        boolean usuarioAtivo = true;

        boolean podeAprovarTransacao = usuarioAtivo && (usuarioAdmin || usuarioSupervisor);

        System.out.println("Usuário ativo: " + usuarioAtivo);
        System.out.println("Usuário admin: " + usuarioAdmin);
        System.out.println("Usuário supervisor: " + usuarioSupervisor);
        System.out.println("Pode aprovar transação: " + podeAprovarTransacao);
    }
}
```

Regra:

```text
usuário pode aprovar se estiver ativo
e for admin ou supervisor.
```

Os parênteses ajudam a leitura.

Mais tarde, vamos aprofundar precedência de operadores.

---

## Parênteses ajudam a leitura

Compare:

```java
boolean podeAprovar = usuarioAtivo && usuarioAdmin || usuarioSupervisor;
```

com:

```java
boolean podeAprovar = usuarioAtivo && (usuarioAdmin || usuarioSupervisor);
```

O segundo comunica melhor.

Ele deixa claro:

```text
usuário precisa estar ativo
e precisa ser admin ou supervisor.
```

Sem parênteses, pode haver leitura errada.

Em regra de negócio, clareza vale muito.

---

## Boolean e status textual

Cuidado para não transformar tudo em boolean.

Exemplo:

```java
boolean pedidoAberto = true;
boolean pedidoCancelado = false;
boolean pedidoConcluido = false;
```

Isso pode ficar ruim quando há muitos status.

Talvez seja melhor:

```java
String statusPedido = "ABERTO";
```

Mais tarde, veremos `enum`, que é melhor ainda para status controlado.

Regra inicial:

```text
boolean é bom para sim/não;
status com muitas possibilidades não deve virar vários booleanos sem critério.
```

---

## Boolean demais pode indicar modelagem ruim

Exemplo:

```java
boolean aberto = true;
boolean pago = false;
boolean cancelado = false;
boolean faturado = false;
boolean enviado = false;
boolean entregue = false;
boolean devolvido = false;
```

Pode ser que existam regras diferentes.

Mas também pode indicar que o domínio precisa de uma modelagem melhor.

Mais tarde, vamos estudar:

```text
enum;
estado;
transição;
regra de negócio;
modelagem de domínio.
```

Por enquanto, saiba:

```text
boolean é poderoso, mas não resolve todo tipo de estado.
```

---

## Erros comuns

### Erro 1 — Usar aspas em `true` ou `false`

Errado:

```java
boolean ativo = "true";
```

Certo:

```java
boolean ativo = true;
```

---

### Erro 2 — Usar `True` ou `False`

Errado:

```java
boolean ativo = True;
```

Certo:

```java
boolean ativo = true;
```

---

### Erro 3 — Usar 1 ou 0 como boolean

Errado:

```java
boolean ativo = 1;
```

Certo:

```java
boolean ativo = true;
```

---

### Erro 4 — Nome genérico

Ruim:

```java
boolean flag = true;
```

Melhor:

```java
boolean clienteAtivo = true;
```

---

### Erro 5 — Nome negativo confuso

Ruim:

```java
boolean naoPossuiPendencia = true;
```

Melhor:

```java
boolean possuiPendencia = false;
```

---

### Erro 6 — Confundir `=` com `==`

Atribuição:

```java
boolean ativo = true;
```

Comparação:

```java
boolean quantidadeValida = quantidade > 0;
```

ou:

```java
boolean statusIgual = status == 1;
```

Com objetos e `String`, comparação terá regras próprias depois.

---

### Erro 7 — Regra composta sem parênteses

Ruim para leitura:

```java
boolean podeAprovar = usuarioAtivo && usuarioAdmin || usuarioSupervisor;
```

Melhor:

```java
boolean podeAprovar = usuarioAtivo && (usuarioAdmin || usuarioSupervisor);
```

---

### Erro 8 — Boolean para status com muitas opções

Ruim:

```java
boolean pedidoAberto = true;
boolean pedidoCancelado = false;
boolean pedidoConcluido = false;
```

Talvez melhor no futuro:

```java
String statusPedido = "ABERTO";
```

E depois:

```java
enum StatusPedido
```

---

### Erro 9 — Não perceber que comparação gera boolean

Exemplo correto:

```java
boolean maiorDeIdade = idade >= 18;
```

Isso é uma forma excelente de nomear uma regra.

---

### Erro 10 — Boolean com nome que não responde pergunta

Ruim:

```java
boolean status = true;
boolean retorno = false;
boolean resultado = true;
```

Melhor:

```java
boolean pedidoAtivo = true;
boolean pagamentoAprovado = false;
boolean validacaoConcluida = true;
```

---

## Diagnóstico de erro com boolean

Quando der erro, siga o roteiro.

### 1. O valor está escrito como `true` ou `false`?

Tem que ser minúsculo.

### 2. Está sem aspas?

Correto:

```java
true
```

Errado:

```java
"true"
```

### 3. Está tentando usar número?

Java não aceita `1` ou `0` como boolean.

### 4. O nome comunica uma pergunta?

Se não comunica, renomeie.

### 5. A regra está negativa demais?

Evite dupla negação.

### 6. Está usando `=` ou `==` corretamente?

`=` atribui.

`==` compara.

### 7. A regra composta precisa de parênteses?

Use parênteses para clareza.

### 8. O boolean representa status com muitas opções?

Talvez o tipo não seja adequado.

### 9. A expressão gera boolean?

Comparações como `idade >= 18` geram boolean.

### 10. O erro aponta linha?

Leia a mensagem do compilador.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — `True` maiúsculo

```java
public class Main {
    public static void main(String[] args) {
        boolean ativo = True;

        System.out.println(ativo);
    }
}
```

Compile e leia o erro.

Corrija:

```java
boolean ativo = true;
```

### Teste 2 — `"true"` como texto

```java
public class Main {
    public static void main(String[] args) {
        boolean ativo = "true";

        System.out.println(ativo);
    }
}
```

Compile e leia o erro.

### Teste 3 — número como boolean

```java
public class Main {
    public static void main(String[] args) {
        boolean ativo = 1;

        System.out.println(ativo);
    }
}
```

Compile e leia o erro.

### Teste 4 — comparação gerando boolean

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;

        boolean quantidadeValida = quantidade > 0;

        System.out.println(quantidadeValida);
    }
}
```

Compile e execute.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-027-boolean-regras
cd labs\m1\aula-027-boolean-regras
```

Crie arquivos:

```text
Main.java
ComparacaoBoolean.java
RegraComposta.java
ClienteBoolean.java
PedidoBoolean.java
OrdemServicoBoolean.java
AutorizacaoBoolean.java
```

Compile:

```powershell
javac Main.java
javac ComparacaoBoolean.java
javac RegraComposta.java
javac ClienteBoolean.java
javac PedidoBoolean.java
javac OrdemServicoBoolean.java
javac AutorizacaoBoolean.java
```

Execute:

```powershell
java Main
java ComparacaoBoolean
java RegraComposta
java ClienteBoolean
java PedidoBoolean
java OrdemServicoBoolean
java AutorizacaoBoolean
```

Depois quebre os erros de propósito e registre no diário.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Renomear variável | `Shift + F6` | Melhorar nomes booleanos |
| Reformatar código | `Ctrl + Alt + L` | Organizar código |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Search Everywhere | `Shift Shift` | Buscar classes |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Duplicar linha | `Ctrl + D` em muitos keymaps | Criar variações |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 027 — Boolean e regras verdadeiras/falsas

### O que aprendi
Aprendi que `boolean` representa valores verdadeiros ou falsos usando `true` e `false`, sem aspas e sem números.

### O que pratiquei
Criei variáveis booleanas com nomes profissionais, calculei regras simples com comparações e combinei regras com `&&`, `||` e `!`.

### Conceitos principais
- `boolean`
- `true`
- `false`
- nome booleano
- regra verdadeira/falsa
- estado
- permissão
- validação
- `!`
- `&&`
- `||`
- comparação
- `=`
- `==`

### Arquivos criados
- `labs/m1/aula-027-boolean-regras/Main.java`
- `labs/m1/aula-027-boolean-regras/ComparacaoBoolean.java`
- `labs/m1/aula-027-boolean-regras/RegraComposta.java`
- `labs/m1/aula-027-boolean-regras/ClienteBoolean.java`
- `labs/m1/aula-027-boolean-regras/PedidoBoolean.java`
- `labs/m1/aula-027-boolean-regras/OrdemServicoBoolean.java`
- `labs/m1/aula-027-boolean-regras/AutorizacaoBoolean.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ClienteBoolean.java
java ClienteBoolean
javac PedidoBoolean.java
java PedidoBoolean
javac OrdemServicoBoolean.java
java OrdemServicoBoolean
javac AutorizacaoBoolean.java
java AutorizacaoBoolean
```

### Erros que quero evitar
- usar `"true"` como texto;
- usar `True` com maiúscula;
- usar `1` ou `0` como boolean;
- usar nome genérico como `flag`;
- criar nome negativo confuso;
- confundir `=` com `==`;
- montar regra composta sem clareza;
- usar boolean para status com muitas opções.

### Próximo passo
Estudar `char` e `String` em uso inicial.
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
git add labs/m1/aula-027-boolean-regras docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 027: pratica boolean e regras verdadeiro falso"
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
1. Quais valores um boolean pode receber?
2. Por que `"true"` não é boolean?
3. Por que `1` não é boolean em Java?
4. Por que `flag` geralmente é um nome ruim?
5. Dê três exemplos de bons nomes booleanos.
6. Por que nomes negativos podem atrapalhar?
7. O que o operador `!` faz?
8. Qual a diferença entre `&&` e `||`?
9. Qual a diferença entre `=` e `==`?
10. Quando boolean pode ser uma escolha ruim para representar status?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
declarar variável boolean;
atribuir true;
atribuir false;
explicar que true e false são minúsculos;
explicar que boolean não usa aspas;
explicar que boolean não aceita 1 e 0;
criar nomes booleanos claros;
evitar flag sem contexto;
evitar nomes negativos confusos;
usar ! em exemplo simples;
usar && em exemplo simples;
usar || em exemplo simples;
entender comparação gerando boolean;
diferenciar = de ==;
criar regra booleana com nome profissional;
aplicar boolean em cliente;
aplicar boolean em pedido;
aplicar boolean em ordem de serviço;
aplicar boolean em autorização;
usar parênteses para clareza em regra composta;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `if`.

Não precisa ainda dominar precedência de operadores em profundidade.

Não precisa ainda modelar status com `enum`.

Esses assuntos virão depois.

O objetivo é entender verdadeiro/falso e nomear regras com clareza.

---

## Fechamento da aula

Hoje aprendemos que `boolean` é pequeno na sintaxe, mas enorme na importância.

Com `boolean`, começamos a transformar regras em código:

```java
boolean clienteAtivo = true;
boolean possuiPendencia = false;
boolean podeComprar = clienteAtivo && !possuiPendencia;
```

Isso é a base para decisões.

Antes de uma API bloquear uma operação, antes de um serviço validar um pedido, antes de um sistema permitir uma aprovação, existe uma regra verdadeira ou falsa.

Também vimos que nomes booleanos precisam ser muito claros.

Um boolean mal nomeado gera confusão.

Um boolean bem nomeado faz o código parecer uma frase.

Na próxima aula, vamos estudar `char` e `String` em uso inicial.

Isso vai completar a primeira base de tipos simples usados no começo da linguagem.
