# 032 — M1.12 — Operadores Relacionais

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.12.01` — Operadores relacionais — Conceito, por que existe e vocabulário essencial.
- `M1.12.02` — Operadores relacionais — Exemplo mínimo digitado do zero.
- `M1.12.03` — Operadores relacionais — Exemplo aplicado ao domínio corporativo.
- `M1.12.04` — Operadores relacionais — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `>`, `<`, `>=`, `<=`, `==`, `!=`, leitura de expressões booleanas, comparação de valores, diferença entre atribuição e comparação, armadilhas com `String`, clareza em regras e aplicação em cenários de backend.

---

## Onde estamos na formação

Estamos no Módulo 1, avançando dos cálculos para as perguntas lógicas.

Até aqui, já passamos por:

```text
M1.01 — primeiro programa Java destrinchado;
M1.02 — blocos, chaves, indentação e leitura de código;
M1.03 — comentários úteis e documentação inicial;
M1.04 — variáveis e nomes profissionais;
M1.05 — tipos inteiros em Java;
M1.06 — tipos decimais e primeiras limitações;
M1.07 — boolean e regras verdadeiras/falsas;
M1.08 — char e String em uso inicial;
M1.09 — String básica;
M1.10 — entrada de dados com Scanner;
M1.11 — operadores aritméticos.
```

Na aula anterior, calculamos valores:

```java
int quantidadeDisponivel = quantidadeEstoque - quantidadeReservada;
long totalCentavos = subtotalCentavos + freteCentavos;
double percentual = ((double) concluidas / total) * 100;
```

Agora vamos transformar valores em perguntas.

Exemplos:

```java
quantidadeDisponivel > 0
valorTotal <= limiteCredito
idade >= 18
statusCodigo != 0
quantidade == 10
```

Essas expressões não retornam número.

Elas retornam:

```java
true
```

ou:

```java
false
```

Ou seja: operadores relacionais produzem valores booleanos.

---

## Hoje a aula é sobre fazer perguntas para os dados

Um sistema backend raramente apenas calcula.

Ele calcula e pergunta.

Exemplos:

```text
A quantidade é maior que zero?
O valor total ultrapassou o limite?
O usuário tem idade mínima?
A página solicitada é menor que o total?
O estoque disponível é suficiente?
O prazo venceu?
A tentativa atual atingiu o limite?
O status numérico é diferente de erro?
O percentual chegou a 100?
A quantidade de atividades é igual a zero?
```

Essas perguntas são regras.

Em Java, perguntas desse tipo são escritas com operadores relacionais.

O resultado dessas perguntas é booleano.

Exemplo:

```java
int quantidadeEstoque = 10;

boolean possuiEstoque = quantidadeEstoque > 0;
```

Leitura:

```text
possuiEstoque recebe o resultado da pergunta:
quantidadeEstoque é maior que zero?
```

Se `quantidadeEstoque` é 10, então:

```text
true.
```

---

## Operadores relacionais principais

Java possui estes operadores relacionais:

| Operador | Nome | Exemplo | Leitura |
|---|---|---|---|
| `>` | maior que | `idade > 18` | idade é maior que 18? |
| `<` | menor que | `idade < 18` | idade é menor que 18? |
| `>=` | maior ou igual | `idade >= 18` | idade é maior ou igual a 18? |
| `<=` | menor ou igual | `idade <= 18` | idade é menor ou igual a 18? |
| `==` | igual a | `idade == 18` | idade é igual a 18? |
| `!=` | diferente de | `idade != 18` | idade é diferente de 18? |

Todos retornam:

```text
boolean.
```

Ou seja:

```text
true ou false.
```

---

## Relacional não é aritmético

Operador aritmético calcula número.

Exemplo:

```java
int total = 10 + 5;
```

Resultado:

```text
15.
```

Operador relacional responde uma pergunta.

Exemplo:

```java
boolean maiorQueZero = total > 0;
```

Resultado:

```text
true.
```

A diferença é:

```text
aritmético -> gera número;
relacional -> gera boolean.
```

Essa separação precisa ficar clara.

---

## Exemplo mínimo com `>`

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidadeEstoque = 10;

        boolean possuiEstoque = quantidadeEstoque > 0;

        System.out.println("Possui estoque: " + possuiEstoque);
    }
}
```

Saída:

```text
Possui estoque: true
```

Leitura:

```text
quantidadeEstoque é maior que 0?
sim.
```

---

## Operador `>`

O operador:

```java
>
```

significa maior que.

Exemplo:

```java
int idade = 20;

boolean maiorQueDezoito = idade > 18;
```

Resultado:

```text
true.
```

Outro exemplo:

```java
int idade = 18;

boolean maiorQueDezoito = idade > 18;
```

Resultado:

```text
false.
```

Porque 18 não é maior que 18.

É igual.

Se a regra aceitar 18, use:

```java
>=
```

---

## Operador `<`

O operador:

```java
<
```

significa menor que.

Exemplo:

```java
int quantidadeEstoque = 3;

boolean estoqueBaixo = quantidadeEstoque < 5;
```

Resultado:

```text
true.
```

Outro exemplo:

```java
int quantidadeEstoque = 5;

boolean estoqueBaixo = quantidadeEstoque < 5;
```

Resultado:

```text
false.
```

Porque 5 não é menor que 5.

É igual.

Se a regra considera 5 como baixo, use:

```java
<=
```

---

## Operador `>=`

O operador:

```java
>=
```

significa maior ou igual.

Exemplo:

```java
int idade = 18;

boolean maiorDeIdade = idade >= 18;
```

Resultado:

```text
true.
```

Esse operador é muito comum em regras de limite mínimo.

Exemplos:

```java
boolean quantidadeMinimaAtingida = quantidade >= minimo;
boolean valorDentroDoMinimo = valorTotal >= valorMinimo;
boolean tentativasAtingiramLimite = tentativas >= limiteTentativas;
```

Use quando o valor limite também deve ser aceito.

---

## Operador `<=`

O operador:

```java
<=
```

significa menor ou igual.

Exemplo:

```java
int quantidadeItens = 10;
int limiteItens = 10;

boolean dentroDoLimite = quantidadeItens <= limiteItens;
```

Resultado:

```text
true.
```

Esse operador é comum em regras de limite máximo.

Exemplos:

```java
boolean valorDentroDoLimite = valorCompra <= limiteCredito;
boolean paginaValida = paginaSolicitada <= totalPaginas;
boolean descontoPermitido = percentualDesconto <= percentualMaximo;
```

Use quando o limite máximo também deve ser aceito.

---

## Operador `==`

O operador:

```java
==
```

compara igualdade.

Exemplo:

```java
int quantidade = 10;

boolean quantidadeIgualADez = quantidade == 10;
```

Resultado:

```text
true.
```

Importante:

```java
=
```

não compara.

`=` atribui.

```java
==
```

compara.

Exemplo:

```java
int quantidade = 10;
```

Leitura:

```text
quantidade recebe 10.
```

Exemplo:

```java
boolean resultado = quantidade == 10;
```

Leitura:

```text
quantidade é igual a 10?
```

---

## Operador `!=`

O operador:

```java
!=
```

significa diferente de.

Exemplo:

```java
int statusCodigo = 0;

boolean possuiErro = statusCodigo != 0;
```

Resultado:

```text
false.
```

Se `statusCodigo` fosse:

```java
1
```

então:

```java
statusCodigo != 0
```

seria:

```text
true.
```

`!=` é muito usado para verificar diferença, presença de erro, mudança de estado ou valor fora do esperado.

---

## Atribuição versus comparação

Esse ponto é tão importante que merece reforço.

Atribuição:

```java
int idade = 18;
```

Comparação:

```java
boolean maiorDeIdade = idade >= 18;
```

Igualdade:

```java
boolean exatamenteDezoito = idade == 18;
```

Erro comum de raciocínio:

```text
ler = como igualdade matemática.
```

Em Java:

```text
= recebe;
== compara igualdade;
>= compara maior ou igual;
<= compara menor ou igual;
!= compara diferença.
```

---

## Expressões relacionais produzem boolean

Exemplo:

```java
int quantidade = 5;

boolean resultado = quantidade > 0;
```

A expressão:

```java
quantidade > 0
```

produz:

```text
true.
```

Então a variável `resultado` recebe `true`.

Outro exemplo:

```java
int quantidade = 0;

boolean resultado = quantidade > 0;
```

Agora a expressão produz:

```text
false.
```

Operadores relacionais são uma das principais fontes de valores booleanos.

---

## Nomeando o resultado da comparação

Compare:

```java
boolean resultado = quantidade > 0;
```

com:

```java
boolean possuiEstoque = quantidade > 0;
```

O segundo é muito melhor.

Ele transforma uma comparação em uma regra nomeada.

Exemplos bons:

```java
boolean maiorDeIdade = idade >= 18;
boolean possuiEstoque = quantidadeEstoque > 0;
boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;
boolean valorDentroDoLimite = valorCompra <= limiteCredito;
boolean atingiuLimiteTentativas = tentativas >= limiteTentativas;
boolean paginaValida = paginaSolicitada >= 0;
```

Nome bom explica a intenção da comparação.

---

## Comparação com números inteiros

Exemplo:

```java
int quantidadeAtividades = 3;

boolean possuiAtividades = quantidadeAtividades > 0;
boolean nenhumaAtividade = quantidadeAtividades == 0;
boolean quantidadeNegativa = quantidadeAtividades < 0;

System.out.println("Possui atividades: " + possuiAtividades);
System.out.println("Nenhuma atividade: " + nenhumaAtividade);
System.out.println("Quantidade negativa: " + quantidadeNegativa);
```

Saída:

```text
Possui atividades: true
Nenhuma atividade: false
Quantidade negativa: false
```

Aqui, cada comparação responde uma pergunta.

---

## Comparação com `long`

Exemplo:

```java
long idPedido = 10_000_000_001L;

boolean idValido = idPedido > 0;

System.out.println("ID válido: " + idValido);
```

Saída:

```text
ID válido: true
```

Para IDs numéricos, uma regra inicial comum é:

```text
ID deve ser maior que zero.
```

Essa validação é simples, mas aparece muito.

---

## Comparação com `double`

Exemplo:

```java
double valorCompra = 150.75;
double limiteCredito = 200.00;

boolean dentroDoLimite = valorCompra <= limiteCredito;

System.out.println("Dentro do limite: " + dentroDoLimite);
```

Saída:

```text
Dentro do limite: true
```

Cuidado:

```text
double tem limitações de precisão.
```

Para dinheiro real, não use `double` sem critério.

Mas para exemplo didático de operadores relacionais, ele ajuda.

---

## Comparação com `char`

`char` também pode ser comparado.

Exemplo:

```java
char categoria = 'A';

boolean categoriaEspecial = categoria == 'A';

System.out.println("Categoria especial: " + categoriaEspecial);
```

Saída:

```text
Categoria especial: true
```

Outro exemplo:

```java
char prioridade = 'B';

boolean prioridadeAlta = prioridade == 'A';
```

Resultado:

```text
false.
```

Use aspas simples com `char`.

---

## Comparação com boolean

Boolean já é verdadeiro ou falso.

Exemplo:

```java
boolean clienteAtivo = true;

boolean resultado = clienteAtivo == true;
```

Funciona, mas é redundante.

Melhor:

```java
boolean resultado = clienteAtivo;
```

Outro exemplo:

```java
boolean possuiPendencia = false;

boolean semPendencia = possuiPendencia == false;
```

Melhor:

```java
boolean semPendencia = !possuiPendencia;
```

Regra profissional:

```text
evite comparar boolean com true ou false sem necessidade.
```

---

## Evite `== true`

Ruim:

```java
if (clienteAtivo == true) {
    // futuro
}
```

Melhor:

```java
if (clienteAtivo) {
    // futuro
}
```

Ainda vamos estudar `if`.

Mas desde já, entenda a leitura.

Para variável booleana:

```java
boolean clienteAtivo = true;
```

a própria variável já representa a condição.

Em variáveis nomeadas corretamente, o código fica natural.

---

## Comparação de String exige cuidado

Este é um alerta importante.

Para comparar conteúdo de `String`, use:

```java
equals()
```

ou:

```java
equalsIgnoreCase()
```

Não use `==` como regra geral.

Exemplo correto:

```java
String status = "ABERTA";

boolean ordemAberta = "ABERTA".equals(status);
```

Exemplo que deve ser evitado:

```java
boolean ordemAberta = status == "ABERTA";
```

`==` compara referência em objetos.

`String` é objeto.

A comparação de conteúdo deve ser feita com `equals`.

Esse ponto já apareceu na aula de `String básica`, e continuará aparecendo.

---

## `==` em primitivos versus objetos

Para tipos primitivos, `==` compara valor.

Exemplos:

```java
int idade = 18;
boolean resultado = idade == 18;
```

```java
char categoria = 'A';
boolean resultado = categoria == 'A';
```

```java
boolean ativo = true;
boolean resultado = ativo == true;
```

Para objetos, como `String`, a conversa muda.

Exemplo correto para texto:

```java
String status = "ABERTA";
boolean aberto = "ABERTA".equals(status);
```

Regra inicial:

```text
primitivos podem usar == para valor;
String usa equals para conteúdo.
```

---

## Leitura de expressões relacionais

Ao ler:

```java
boolean valorValido = valorTotal > 0;
```

leia:

```text
valorTotal é maior que zero?
```

Ao ler:

```java
boolean dentroDoLimite = quantidade <= limite;
```

leia:

```text
quantidade é menor ou igual ao limite?
```

Ao ler:

```java
boolean atingiuLimite = tentativas >= limiteTentativas;
```

leia:

```text
tentativas é maior ou igual ao limite de tentativas?
```

Essa leitura em voz natural ajuda muito.

Código bom deve parecer regra.

---

## Operadores relacionais e `Scanner`

Podemos ler dados e comparar.

Exemplo:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade em estoque:");
        int quantidadeEstoque = scanner.nextInt();

        boolean possuiEstoque = quantidadeEstoque > 0;

        System.out.println("Possui estoque: " + possuiEstoque);

        scanner.close();
    }
}
```

Agora a regra depende da entrada do usuário.

Isso prepara condicionais.

---

## Exemplo mínimo com todos os operadores

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int valorA = 10;
        int valorB = 5;

        System.out.println("A > B: " + (valorA > valorB));
        System.out.println("A < B: " + (valorA < valorB));
        System.out.println("A >= B: " + (valorA >= valorB));
        System.out.println("A <= B: " + (valorA <= valorB));
        System.out.println("A == B: " + (valorA == valorB));
        System.out.println("A != B: " + (valorA != valorB));
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

Saída esperada:

```text
A > B: true
A < B: false
A >= B: true
A <= B: false
A == B: false
A != B: true
```

Os parênteses nas expressões ajudam a leitura dentro da concatenação.

---

## Por que usar parênteses na impressão

Compare:

```java
System.out.println("A > B: " + valorA > valorB);
```

Isso pode gerar erro ou leitura incorreta, porque a concatenação acontece antes da comparação.

Use:

```java
System.out.println("A > B: " + (valorA > valorB));
```

Os parênteses deixam claro:

```text
primeiro compare;
depois concatene o resultado.
```

Esse cuidado evita confusão entre `String` e boolean.

---

## Exemplo com estoque

Arquivo:

```text
ValidacaoEstoque.java
```

Código:

```java
public class ValidacaoEstoque {
    public static void main(String[] args) {
        int quantidadeEstoque = 15;
        int quantidadeMinima = 5;

        boolean possuiEstoque = quantidadeEstoque > 0;
        boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;
        boolean estoqueNoMinimo = quantidadeEstoque == quantidadeMinima;
        boolean estoqueAcimaDoMinimo = quantidadeEstoque > quantidadeMinima;

        System.out.println("Possui estoque: " + possuiEstoque);
        System.out.println("Estoque baixo: " + estoqueBaixo);
        System.out.println("Estoque no mínimo: " + estoqueNoMinimo);
        System.out.println("Estoque acima do mínimo: " + estoqueAcimaDoMinimo);
    }
}
```

Esse exemplo mostra várias leituras sobre o mesmo dado.

---

## Exemplo com limite

Arquivo:

```text
ValidacaoLimite.java
```

Código:

```java
public class ValidacaoLimite {
    public static void main(String[] args) {
        double valorCompra = 150.75;
        double limiteCredito = 200.00;

        boolean compraDentroDoLimite = valorCompra <= limiteCredito;
        boolean compraAcimaDoLimite = valorCompra > limiteCredito;
        boolean compraExatamenteNoLimite = valorCompra == limiteCredito;

        System.out.println("Compra dentro do limite: " + compraDentroDoLimite);
        System.out.println("Compra acima do limite: " + compraAcimaDoLimite);
        System.out.println("Compra exatamente no limite: " + compraExatamenteNoLimite);
    }
}
```

Esse exemplo é didático.

Para dinheiro real, futuramente usaremos representação mais adequada.

---

## Exemplo com idade

Arquivo:

```text
ValidacaoIdade.java
```

Código:

```java
public class ValidacaoIdade {
    public static void main(String[] args) {
        int idade = 18;

        boolean maiorDeIdade = idade >= 18;
        boolean menorDeIdade = idade < 18;
        boolean idadeExatamenteDezoito = idade == 18;

        System.out.println("Maior de idade: " + maiorDeIdade);
        System.out.println("Menor de idade: " + menorDeIdade);
        System.out.println("Idade exatamente 18: " + idadeExatamenteDezoito);
    }
}
```

Esse exemplo mostra o impacto do operador escolhido.

Se usar:

```java
idade > 18
```

uma pessoa com 18 anos ficaria fora.

Se a regra diz “18 ou mais”, o operador correto é:

```java
>=
```

---

## Exemplo com tentativas

Arquivo:

```text
ValidacaoTentativas.java
```

Código:

```java
public class ValidacaoTentativas {
    public static void main(String[] args) {
        int tentativasRealizadas = 3;
        int limiteTentativas = 3;

        boolean atingiuLimite = tentativasRealizadas >= limiteTentativas;
        boolean aindaPodeTentar = tentativasRealizadas < limiteTentativas;

        System.out.println("Atingiu limite: " + atingiuLimite);
        System.out.println("Ainda pode tentar: " + aindaPodeTentar);
    }
}
```

Resultado:

```text
Atingiu limite: true
Ainda pode tentar: false
```

Esse tipo de regra aparece em login, integrações, retentativas e bloqueios.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
ValidacaoPedido.java
```

Código:

```java
public class ValidacaoPedido {
    public static void main(String[] args) {
        int quantidadeItens = 3;
        long valorTotalCentavos = 15000L;
        long valorMinimoCentavos = 1000L;

        boolean possuiItens = quantidadeItens > 0;
        boolean valorMaiorQueZero = valorTotalCentavos > 0;
        boolean valorAtingeMinimo = valorTotalCentavos >= valorMinimoCentavos;

        System.out.println("Possui itens: " + possuiItens);
        System.out.println("Valor maior que zero: " + valorMaiorQueZero);
        System.out.println("Valor atinge mínimo: " + valorAtingeMinimo);
    }
}
```

Regra:

```text
pedido deve ter itens;
pedido deve ter valor maior que zero;
pedido deve atingir valor mínimo.
```

Ainda não combinamos com `&&`.

Isso será aprofundado na próxima aula de operadores lógicos.

---

## Exemplo aplicado ao domínio corporativo: produto

Arquivo:

```text
ValidacaoProduto.java
```

Código:

```java
public class ValidacaoProduto {
    public static void main(String[] args) {
        int quantidadeEstoque = 0;
        int quantidadeMinima = 5;
        int quantidadeMaxima = 100;

        boolean semEstoque = quantidadeEstoque == 0;
        boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;
        boolean estoqueDentroDoMaximo = quantidadeEstoque <= quantidadeMaxima;

        System.out.println("Sem estoque: " + semEstoque);
        System.out.println("Estoque baixo: " + estoqueBaixo);
        System.out.println("Estoque dentro do máximo: " + estoqueDentroDoMaximo);
    }
}
```

Aqui vemos:

```text
igualdade;
menor que;
menor ou igual.
```

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
ValidacaoOrdemServico.java
```

Código:

```java
public class ValidacaoOrdemServico {
    public static void main(String[] args) {
        int quantidadeAtividades = 2;
        int quantidadeReagendamentos = 1;
        int limiteReagendamentos = 3;

        boolean possuiAtividades = quantidadeAtividades > 0;
        boolean semAtividades = quantidadeAtividades == 0;
        boolean podeReagendarMaisVezes = quantidadeReagendamentos < limiteReagendamentos;
        boolean atingiuLimiteReagendamentos = quantidadeReagendamentos >= limiteReagendamentos;

        System.out.println("Possui atividades: " + possuiAtividades);
        System.out.println("Sem atividades: " + semAtividades);
        System.out.println("Pode reagendar mais vezes: " + podeReagendarMaisVezes);
        System.out.println("Atingiu limite de reagendamentos: " + atingiuLimiteReagendamentos);
    }
}
```

Essa regra começa a parecer um backend de OS.

Ainda simples, mas com lógica real.

---

## Exemplo aplicado ao domínio corporativo: auditoria

Arquivo:

```text
ValidacaoAuditoria.java
```

Código:

```java
public class ValidacaoAuditoria {
    public static void main(String[] args) {
        long idUsuario = 1001L;
        int quantidadeAlteracoes = 5;
        int limiteAlteracoesCriticas = 3;

        boolean usuarioValido = idUsuario > 0;
        boolean possuiAlteracoes = quantidadeAlteracoes > 0;
        boolean alteracoesAcimaDoLimite = quantidadeAlteracoes > limiteAlteracoesCriticas;

        System.out.println("Usuário válido: " + usuarioValido);
        System.out.println("Possui alterações: " + possuiAlteracoes);
        System.out.println("Alterações acima do limite: " + alteracoesAcimaDoLimite);
    }
}
```

Esse exemplo mostra regras numéricas aplicadas à auditoria.

---

## Exemplo aplicado com Scanner: pedido

Arquivo:

```text
ValidacaoPedidoConsole.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoPedidoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade de itens:");
        int quantidadeItens = scanner.nextInt();

        System.out.println("Digite o valor total em centavos:");
        long valorTotalCentavos = scanner.nextLong();

        boolean possuiItens = quantidadeItens > 0;
        boolean valorValido = valorTotalCentavos > 0;

        System.out.println("Possui itens: " + possuiItens);
        System.out.println("Valor válido: " + valorValido);

        scanner.close();
    }
}
```

Entrada exemplo:

```text
3
15000
```

Saída:

```text
Possui itens: true
Valor válido: true
```

---

## Exemplo aplicado com Scanner: estoque

Arquivo:

```text
ValidacaoEstoqueConsole.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoEstoqueConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade em estoque:");
        int quantidadeEstoque = scanner.nextInt();

        System.out.println("Digite a quantidade mínima:");
        int quantidadeMinima = scanner.nextInt();

        boolean possuiEstoque = quantidadeEstoque > 0;
        boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;
        boolean estoqueNoMinimo = quantidadeEstoque == quantidadeMinima;

        System.out.println("Possui estoque: " + possuiEstoque);
        System.out.println("Estoque baixo: " + estoqueBaixo);
        System.out.println("Estoque no mínimo: " + estoqueNoMinimo);

        scanner.close();
    }
}
```

Esse exemplo permite testar vários cenários.

---

## Exemplo com String e equals

Arquivo:

```text
ValidacaoStatusTexto.java
```

Código:

```java
public class ValidacaoStatusTexto {
    public static void main(String[] args) {
        String statusPedido = "PENDENTE";

        boolean pedidoPendente = "PENDENTE".equals(statusPedido);
        boolean pedidoAprovado = "APROVADO".equals(statusPedido);
        boolean pedidoNaoCancelado = !"CANCELADO".equals(statusPedido);

        System.out.println("Pedido pendente: " + pedidoPendente);
        System.out.println("Pedido aprovado: " + pedidoAprovado);
        System.out.println("Pedido não cancelado: " + pedidoNaoCancelado);
    }
}
```

Aqui usamos `equals` para conteúdo textual.

E usamos:

```java
!
```

para negar o resultado de uma comparação.

O operador `!` será aprofundado na próxima aula.

---

## Cuidado com igualdade em decimal

Comparar `double` com `==` pode ser perigoso quando o valor vem de cálculo.

Exemplo:

```java
double resultado = 0.1 + 0.2;

boolean igualAZeroTres = resultado == 0.3;

System.out.println(resultado);
System.out.println(igualAZeroTres);
```

Pode imprimir:

```text
0.30000000000000004
false
```

Isso acontece pela precisão aproximada de `double`.

Regra inicial:

```text
evite igualdade exata com double calculado quando precisão importa.
```

Mais tarde, veremos tolerância, BigDecimal e abordagens adequadas.

---

## Igualdade com valores inteiros é mais direta

Exemplo:

```java
int quantidade = 10;

boolean igualADez = quantidade == 10;
```

Isso é direto.

Com `int` e `long`, a igualdade de valor é previsível dentro dos limites.

Com `double`, existe a questão da representação aproximada.

---

## Parênteses para leitura

Expressões relacionais podem ser usadas dentro de concatenação.

Use parênteses:

```java
System.out.println("Valor válido: " + (valor > 0));
```

Sem parênteses, você pode confundir o Java ou a leitura humana.

Também use parênteses quando combinar com operadores aritméticos:

```java
boolean subtotalValido = (quantidade * valorUnitarioCentavos) > 0;
```

A expressão aritmética é calculada primeiro, depois comparada.

---

## Relacionais e aritméticos juntos

Exemplo:

```java
int quantidade = 4;
long valorUnitarioCentavos = 2500L;

boolean subtotalMaiorQueZero = (quantidade * valorUnitarioCentavos) > 0;

System.out.println("Subtotal maior que zero: " + subtotalMaiorQueZero);
```

Leitura:

```text
quantidade vezes valor unitário é maior que zero?
```

Esse padrão é comum:

```text
calcula;
compara;
gera boolean.
```

---

## Erros comuns

### Erro 1 — Usar `=` no lugar de `==`

Errado:

```java
boolean resultado = quantidade = 10;
```

Correto:

```java
boolean resultado = quantidade == 10;
```

`=` atribui.

`==` compara.

---

### Erro 2 — Usar operador errado no limite

Regra:

```text
idade mínima é 18.
```

Errado:

```java
boolean maiorDeIdade = idade > 18;
```

Isso exclui idade 18.

Correto:

```java
boolean maiorDeIdade = idade >= 18;
```

---

### Erro 3 — Confundir menor que com menor ou igual

Regra:

```text
valor deve ser até 100.
```

Correto:

```java
boolean valorValido = valor <= 100;
```

Se usar:

```java
valor < 100
```

o valor 100 fica inválido.

---

### Erro 4 — Comparar String com `==`

Evite:

```java
boolean aberto = status == "ABERTA";
```

Use:

```java
boolean aberto = "ABERTA".equals(status);
```

---

### Erro 5 — Comparar boolean com `true`

Redundante:

```java
boolean resultado = clienteAtivo == true;
```

Melhor:

```java
boolean resultado = clienteAtivo;
```

---

### Erro 6 — Comparar boolean com `false`

Redundante:

```java
boolean resultado = possuiPendencia == false;
```

Melhor:

```java
boolean resultado = !possuiPendencia;
```

---

### Erro 7 — Esquecer parênteses na concatenação

Problemático:

```java
System.out.println("Maior: " + valorA > valorB);
```

Melhor:

```java
System.out.println("Maior: " + (valorA > valorB));
```

---

### Erro 8 — Usar `==` com double calculado

Perigoso:

```java
boolean resultado = (0.1 + 0.2) == 0.3;
```

Pode ser falso.

---

### Erro 9 — Nome booleano genérico

Ruim:

```java
boolean resultado = quantidade > 0;
```

Melhor:

```java
boolean possuiQuantidade = quantidade > 0;
```

ou:

```java
boolean quantidadeValida = quantidade > 0;
```

---

### Erro 10 — Não testar valor de fronteira

Se a regra envolve limite, teste:

```text
valor abaixo;
valor exatamente no limite;
valor acima.
```

Exemplo para idade mínima 18:

```text
17;
18;
19.
```

Isso revela se o operador correto é `>` ou `>=`.

---

## Diagnóstico de erro com operadores relacionais

Quando uma regra der resultado inesperado, siga o roteiro.

### 1. Qual era a regra em português?

Escreva:

```text
valor deve ser maior que zero.
```

ou:

```text
idade deve ser maior ou igual a 18.
```

### 2. Qual operador representa essa regra?

```text
maior que -> >
maior ou igual -> >=
menor que -> <
menor ou igual -> <=
igual -> ==
diferente -> !=
```

### 3. O limite deve ser incluído?

Se sim, use `>=` ou `<=`.

### 4. Você usou `=` por engano?

Se queria comparar, use `==`.

### 5. A comparação é com String?

Use `equals`.

### 6. A comparação é com double calculado?

Cuidado com igualdade exata.

### 7. O nome booleano faz sentido?

Renomeie se estiver genérico.

### 8. A expressão está dentro de concatenação?

Use parênteses.

### 9. Testou valores de fronteira?

Teste abaixo, igual e acima.

### 10. O resultado foi impresso?

Imprima os valores e a regra para observar.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Limite de idade errado

```java
public class Main {
    public static void main(String[] args) {
        int idade = 18;

        boolean maiorDeIdadeErrado = idade > 18;
        boolean maiorDeIdadeCorreto = idade >= 18;

        System.out.println("Errado: " + maiorDeIdadeErrado);
        System.out.println("Correto: " + maiorDeIdadeCorreto);
    }
}
```

Observe a diferença.

### Teste 2 — Comparação de String com `==`

```java
public class Main {
    public static void main(String[] args) {
        String status = new String("ABERTA");

        System.out.println(status == "ABERTA");
        System.out.println("ABERTA".equals(status));
    }
}
```

Observe a diferença.

### Teste 3 — Igualdade com double

```java
public class Main {
    public static void main(String[] args) {
        double resultado = 0.1 + 0.2;

        System.out.println(resultado);
        System.out.println(resultado == 0.3);
    }
}
```

Observe o resultado.

### Teste 4 — Fronteira de estoque

```java
public class Main {
    public static void main(String[] args) {
        int quantidadeEstoque = 5;
        int quantidadeMinima = 5;

        System.out.println(quantidadeEstoque < quantidadeMinima);
        System.out.println(quantidadeEstoque <= quantidadeMinima);
    }
}
```

Veja como `<` e `<=` mudam a regra.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-032-operadores-relacionais
cd labs\m1\aula-032-operadores-relacionais
```

Crie arquivos:

```text
Main.java
ValidacaoEstoque.java
ValidacaoLimite.java
ValidacaoIdade.java
ValidacaoTentativas.java
ValidacaoPedido.java
ValidacaoProduto.java
ValidacaoOrdemServico.java
ValidacaoAuditoria.java
ValidacaoPedidoConsole.java
ValidacaoEstoqueConsole.java
ValidacaoStatusTexto.java
```

Compile:

```powershell
javac Main.java
javac ValidacaoEstoque.java
javac ValidacaoLimite.java
javac ValidacaoIdade.java
javac ValidacaoTentativas.java
javac ValidacaoPedido.java
javac ValidacaoProduto.java
javac ValidacaoOrdemServico.java
javac ValidacaoAuditoria.java
javac ValidacaoPedidoConsole.java
javac ValidacaoEstoqueConsole.java
javac ValidacaoStatusTexto.java
```

Execute:

```powershell
java Main
java ValidacaoEstoque
java ValidacaoLimite
java ValidacaoIdade
java ValidacaoTentativas
java ValidacaoPedido
java ValidacaoProduto
java ValidacaoOrdemServico
java ValidacaoAuditoria
java ValidacaoPedidoConsole
java ValidacaoEstoqueConsole
java ValidacaoStatusTexto
```

Depois quebre erros de propósito e registre no diário.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar expressões |
| Renomear variável | `Shift + F6` | Melhorar nomes booleanos |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver valores e comparações |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Commit | `Ctrl + K` | Revisar alterações |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug para operadores relacionais

Use debug para observar a comparação acontecendo.

Exemplo:

```java
int quantidadeEstoque = 15;
int quantidadeMinima = 5;

boolean possuiEstoque = quantidadeEstoque > 0;
boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;
```

Coloque breakpoint antes das variáveis booleanas.

Avance com Step Over.

Observe:

```text
quantidadeEstoque;
quantidadeMinima;
possuiEstoque;
estoqueBaixo.
```

Isso ajuda a enxergar que a comparação gera `true` ou `false`.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 032 — Operadores relacionais

### O que aprendi
Aprendi que operadores relacionais comparam valores e retornam `boolean`, usando `>`, `<`, `>=`, `<=`, `==` e `!=`.

### O que pratiquei
Criei validações simples para estoque, limite, idade, tentativas, pedido, produto, ordem de serviço, auditoria e status textual.

### Conceitos principais
- maior que `>`
- menor que `<`
- maior ou igual `>=`
- menor ou igual `<=`
- igual `==`
- diferente `!=`
- expressão booleana
- valor de fronteira
- atribuição versus comparação
- comparação de primitivos
- comparação de String com `equals`
- comparação com `double`
- nome booleano profissional

### Arquivos criados
- `labs/m1/aula-032-operadores-relacionais/Main.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoEstoque.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoLimite.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoIdade.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoTentativas.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoPedido.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoProduto.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoOrdemServico.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoAuditoria.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoPedidoConsole.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoEstoqueConsole.java`
- `labs/m1/aula-032-operadores-relacionais/ValidacaoStatusTexto.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ValidacaoEstoque.java
java ValidacaoEstoque
javac ValidacaoIdade.java
java ValidacaoIdade
javac ValidacaoPedido.java
java ValidacaoPedido
```

### Erros que quero evitar
- usar `=` no lugar de `==`;
- usar `>` quando a regra exige `>=`;
- usar `<` quando a regra exige `<=`;
- comparar String com `==`;
- comparar boolean com `true` sem necessidade;
- comparar boolean com `false` sem necessidade;
- esquecer parênteses na concatenação;
- usar igualdade exata com `double` calculado;
- criar boolean com nome genérico;
- não testar valor de fronteira.

### Próximo passo
Estudar operadores lógicos.
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
git add labs/m1/aula-032-operadores-relacionais docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 032: pratica operadores relacionais em Java"
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
1. Para que servem operadores relacionais?
2. Qual tipo de valor uma expressão relacional retorna?
3. Qual a diferença entre `>` e `>=`?
4. Qual a diferença entre `<` e `<=`?
5. Qual a diferença entre `=` e `==`?
6. Para que serve `!=`?
7. Por que idade mínima de 18 geralmente usa `>= 18`?
8. Por que não devemos comparar String com `==` como regra geral?
9. Por que comparar `double` calculado com `==` pode ser perigoso?
10. O que são valores de fronteira em uma regra?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
usar >;
usar <;
usar >=;
usar <=;
usar ==;
usar !=;
explicar que operadores relacionais retornam boolean;
diferenciar atribuição de comparação;
nomear resultado booleano com clareza;
usar operador correto para limite mínimo;
usar operador correto para limite máximo;
testar valores de fronteira;
comparar int;
comparar long;
comparar double com cuidado;
comparar char;
evitar comparação desnecessária com true;
evitar comparação desnecessária com false;
comparar String com equals;
usar equalsIgnoreCase quando a regra permitir;
usar parênteses em concatenação com comparação;
aplicar relacionais em pedido;
aplicar relacionais em produto;
aplicar relacionais em OS;
aplicar relacionais em auditoria;
usar Scanner em validação simples;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar operadores lógicos em profundidade.

Não precisa ainda dominar `if`.

Não precisa ainda dominar comparação de objetos em geral.

Não precisa ainda dominar `BigDecimal`.

Esses assuntos virão depois.

O objetivo é dominar perguntas simples feitas aos dados.

---

## Fechamento da aula

Hoje aprendemos a transformar valores em perguntas.

Antes, calculávamos:

```java
int quantidadeDisponivel = estoque - reservado;
```

Agora perguntamos:

```java
boolean possuiEstoque = quantidadeDisponivel > 0;
```

Esse é o início real das regras de negócio.

Operadores relacionais geram `boolean`.

E `boolean` será usado em decisões.

Vimos:

```text
>;
<;
>=;
<=;
==;
!=;
atribuição versus comparação;
fronteiras;
comparação de String;
cuidado com double;
nomes booleanos profissionais.
```

Na próxima aula, vamos estudar operadores lógicos.

Eles permitem combinar perguntas:

```text
cliente está ativo E não possui pendência;
usuário é admin OU supervisor;
pedido não está cancelado;
valor é válido E quantidade é válida.
```

Essa será a ponte direta para condicionais e regras mais completas.
