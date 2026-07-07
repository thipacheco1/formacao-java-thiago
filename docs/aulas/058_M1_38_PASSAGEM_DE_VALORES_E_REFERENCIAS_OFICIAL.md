# 058 — M1.38 — Passagem de Valores e Referências

## Onde estamos na formação

Estamos no Módulo 1, logo depois de escopo de variáveis.

A sequência recente foi:

```text
054 — M1.34 — Métodos com retorno;
055 — M1.35 — Métodos com parâmetros;
056 — M1.36 — Sobrecarga de métodos inicial;
057 — M1.37 — Escopo de variáveis;
058 — M1.38 — Passagem de valores e referências.
```

Na aula anterior, aprendemos que variável tem escopo.

Vimos exemplos como:

```java
public static void main(String[] args) {
    int quantidade = 10;

    alterarQuantidade(quantidade);

    System.out.println(quantidade);
}

public static void alterarQuantidade(int quantidade) {
    quantidade = 99;
}
```

E vimos que, mesmo alterando `quantidade` dentro do método, a variável do `main` continuava com o valor original.

Também vimos que arrays se comportavam diferente:

```java
public static void main(String[] args) {
    int[] valores = {10, 20};

    alterarPrimeiro(valores);

    System.out.println(valores[0]);
}

public static void alterarPrimeiro(int[] valores) {
    valores[0] = 99;
}
```

Nesse caso, o array do `main` foi alterado.

A pergunta da aula de hoje é:

```text
por que isso acontece?
```

A resposta passa por um conceito central da linguagem Java:

```text
Java sempre passa argumentos por valor.
```

Mas esse valor pode ser:

```text
o valor de um primitivo;
ou uma cópia da referência para um objeto.
```

Essa frase é uma das mais importantes do curso até agora.

---

## Hoje a aula é sobre como dados entram nos métodos

Quando chamamos um método, enviamos argumentos.

Exemplo:

```java
int quantidade = 10;

alterarQuantidade(quantidade);
```

O valor de `quantidade` entra no método.

Mas ele entra como uma cópia.

O método recebe essa cópia no parâmetro:

```java
public static void alterarQuantidade(int quantidade) {
    quantidade = 99;
}
```

O parâmetro `quantidade` não é a mesma variável do `main`.

Ele é outra variável, em outro escopo, recebendo uma cópia do valor.

Por isso, alterar o parâmetro não altera a variável original.

Agora, com array:

```java
int[] valores = {10, 20};

alterarPrimeiro(valores);
```

A variável `valores` guarda uma referência para um array.

O método recebe uma cópia dessa referência.

Mesmo sendo cópia, as duas referências apontam para o mesmo array.

Então, se o método altera o conteúdo do array:

```java
valores[0] = 99;
```

o conteúdo do objeto array muda.

E o `main` enxerga essa mudança.

Essa diferença precisa ficar muito clara.

---

## Regra oficial em Java

A regra correta é:

```text
Java é sempre pass-by-value.
```

Em português:

```text
Java sempre passa por valor.
```

Mas atenção.

Isso não significa que arrays e objetos são copiados inteiros.

O que acontece é:

```text
para primitivos, copia o valor;
para objetos e arrays, copia a referência.
```

Então:

```text
int -> copia o número;
long -> copia o número;
double -> copia o número;
boolean -> copia true/false;
array -> copia a referência para o array;
String -> copia a referência para a String;
objeto -> copia a referência para o objeto.
```

Por isso, muita gente fala errado:

```text
Java passa objetos por referência.
```

A frase tecnicamente correta é:

```text
Java passa a referência por valor.
```

Ou seja:

```text
a referência é copiada.
```

---

## Por que isso importa para backend

Em backend, métodos recebem dados o tempo todo.

Exemplos:

```text
validar pedido;
calcular pagamento;
normalizar status;
alterar estoque;
montar resposta;
registrar auditoria;
incrementar tentativa de mensagem;
processar OS;
validar cliente;
atualizar lista de erros;
preencher relatório.
```

Se você não entende passagem de valores e referências, pode cometer erros como:

```text
achar que alterou um int fora do método;
alterar um array sem perceber;
reapontar uma referência achando que o chamador vai mudar;
modificar dados compartilhados sem intenção;
misturar cálculo com mutação;
não perceber efeito colateral;
criar métodos perigosos.
```

Em sistemas reais, esse tipo de erro pode virar:

```text
pedido com status alterado indevidamente;
estoque baixado duas vezes;
tentativa de mensageria incrementada fora de hora;
lista de erros contaminada;
auditoria inconsistente;
pagamento calculado com dados alterados;
OS processada com estado incorreto.
```

Por isso, essa aula é conceitual e prática ao mesmo tempo.

---

## Vocabulário essencial

Termos desta aula:

```text
pass-by-value;
passagem por valor;
referência;
objeto;
array;
primitivo;
cópia;
parâmetro;
argumento;
reatribuição;
mutação;
conteúdo;
efeito colateral;
String;
imutabilidade;
variável local;
escopo;
heap;
stack;
ponteiro conceitual;
identidade do objeto;
estado do objeto;
referência copiada;
objeto compartilhado.
```

Termos mais importantes:

```text
passagem por valor -> Java copia o valor do argumento para o parâmetro;
primitivo -> valor simples, como int, long, double e boolean;
referência -> valor que permite acessar um objeto;
array -> objeto que guarda vários valores;
objeto -> estrutura criada na memória e acessada por referência;
mutação -> alteração do conteúdo de um objeto;
reatribuição -> fazer uma variável apontar para outro valor ou objeto;
efeito colateral -> mudança observável fora do método;
String imutável -> uma String não muda internamente; operações criam nova String.
```

---

## Mapa mental inicial

Pense assim:

```text
primitivo:
main tem valor 10
método recebe cópia 10
método muda a cópia para 99
main continua 10
```

Agora array:

```text
main tem referência para array A
método recebe cópia da referência para array A
método altera array A na posição 0
main continua apontando para array A
array A agora está alterado
```

Agora reatribuição de array:

```text
main tem referência para array A
método recebe cópia da referência para array A
método faz parâmetro apontar para array B
main continua apontando para array A
```

O método consegue alterar o conteúdo do array original.

Mas não consegue fazer a variável do `main` apontar para outro array, apenas reatribuindo o parâmetro.

Essa diferença é o coração da aula.

---

## Primitivos

Tipos primitivos principais que já usamos:

```text
int;
long;
double;
boolean;
char.
```

Exemplo:

```java
int quantidade = 10;
```

A variável guarda diretamente o valor inteiro.

Quando passamos para método:

```java
alterarQuantidade(quantidade);
```

o método recebe uma cópia do valor.

Alterar o parâmetro não altera a variável original.

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;

        alterarQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static void alterarQuantidade(int quantidade) {
        quantidade = 99;

        System.out.println("Quantidade no método: " + quantidade);
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
Quantidade no método: 99
Quantidade no main: 10
```

Esse é o exemplo base para primitivos.

O método alterou o parâmetro.

Mas não alterou a variável do `main`.

---

## Entendendo o exemplo com int

No `main`:

```java
int quantidade = 10;
```

Na chamada:

```java
alterarQuantidade(quantidade);
```

O valor `10` é copiado para o parâmetro.

No método:

```java
public static void alterarQuantidade(int quantidade) {
```

existe outra variável chamada `quantidade`.

Ela pertence ao método.

Quando fazemos:

```java
quantidade = 99;
```

alteramos apenas o parâmetro local.

A variável do `main` continua com 10.

---

## Exemplo com long

Arquivo:

```text
PassagemLong.java
```

Código:

```java
public class PassagemLong {
    public static void main(String[] args) {
        long valorCentavos = 1000L;

        alterarValor(valorCentavos);

        System.out.println("Valor no main: " + valorCentavos);
    }

    public static void alterarValor(long valorCentavos) {
        valorCentavos = 9999L;

        System.out.println("Valor no método: " + valorCentavos);
    }
}
```

Saída:

```text
Valor no método: 9999
Valor no main: 1000
```

Mesmo raciocínio do `int`.

`long` também é primitivo.

---

## Exemplo com boolean

Arquivo:

```text
PassagemBoolean.java
```

Código:

```java
public class PassagemBoolean {
    public static void main(String[] args) {
        boolean valido = true;

        alterarValido(valido);

        System.out.println("Válido no main: " + valido);
    }

    public static void alterarValido(boolean valido) {
        valido = false;

        System.out.println("Válido no método: " + valido);
    }
}
```

Saída:

```text
Válido no método: false
Válido no main: true
```

`boolean` também é passado por valor.

---

## Exemplo com double

Arquivo:

```text
PassagemDouble.java
```

Código:

```java
public class PassagemDouble {
    public static void main(String[] args) {
        double media = 8.5;

        alterarMedia(media);

        System.out.println("Média no main: " + media);
    }

    public static void alterarMedia(double media) {
        media = 10.0;

        System.out.println("Média no método: " + media);
    }
}
```

Saída:

```text
Média no método: 10.0
Média no main: 8.5
```

Mesma regra.

Primitivo alterado dentro do método não altera a variável original.

---

## Como alterar um valor primitivo corretamente

Se você quer obter um novo valor a partir de um primitivo, use retorno.

Errado como expectativa:

```java
alterarQuantidade(quantidade);
```

achando que `quantidade` vai mudar fora.

Melhor:

```java
quantidade = alterarQuantidade(quantidade);
```

Arquivo:

```text
AlterarPrimitivoComRetorno.java
```

Código:

```java
public class AlterarPrimitivoComRetorno {
    public static void main(String[] args) {
        int quantidade = 10;

        quantidade = alterarQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static int alterarQuantidade(int quantidade) {
        return 99;
    }
}
```

Saída:

```text
Quantidade no main: 99
```

Agora a variável do `main` mudou porque recebeu o retorno.

---

## Incrementar primitivo corretamente

Arquivo:

```text
IncrementarPrimitivoComRetorno.java
```

Código:

```java
public class IncrementarPrimitivoComRetorno {
    public static void main(String[] args) {
        int tentativas = 1;

        tentativas = incrementar(tentativas);

        System.out.println("Tentativas: " + tentativas);
    }

    public static int incrementar(int valor) {
        return valor + 1;
    }
}
```

Saída:

```text
Tentativas: 2
```

Para primitivos, quando quiser atualizar o valor externo, retorne o novo valor e atribua.

---

## Arrays

Array é objeto.

Exemplo:

```java
int[] valores = {10, 20, 30};
```

A variável `valores` guarda uma referência para o array.

Quando passamos para um método:

```java
alterarPrimeiro(valores);
```

o método recebe uma cópia da referência.

Essa cópia aponta para o mesmo array.

Então o método pode alterar o conteúdo do array.

---

## Exemplo mínimo com array

Arquivo:

```text
PassagemArray.java
```

Código:

```java
public class PassagemArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarPrimeiroValor(valores);

        System.out.println("Primeiro valor no main: " + valores[0]);
    }

    public static void alterarPrimeiroValor(int[] valores) {
        valores[0] = 99;

        System.out.println("Primeiro valor no método: " + valores[0]);
    }
}
```

Saída:

```text
Primeiro valor no método: 99
Primeiro valor no main: 99
```

O array foi alterado.

Não porque Java passou por referência no sentido técnico.

Mas porque Java passou por valor uma cópia da referência para o mesmo array.

---

## Mutação do conteúdo

Quando fazemos:

```java
valores[0] = 99;
```

estamos alterando o conteúdo do array.

Isso se chama mutação.

O parâmetro e a variável do `main` apontam para o mesmo array.

Então a mutação aparece nos dois lugares.

Pense assim:

```text
duas variáveis diferentes;
duas referências copiadas;
um mesmo array na memória.
```

---

## Reatribuir parâmetro de array não muda o main

Agora veja outro caso.

Arquivo:

```text
ReatribuirArray.java
```

Código:

```java
public class ReatribuirArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        trocarArray(valores);

        System.out.println("Primeiro valor no main: " + valores[0]);
    }

    public static void trocarArray(int[] valores) {
        valores = new int[]{99, 88, 77};

        System.out.println("Primeiro valor no método: " + valores[0]);
    }
}
```

Saída:

```text
Primeiro valor no método: 99
Primeiro valor no main: 10
```

Por quê?

Porque dentro do método fizemos o parâmetro apontar para outro array.

Mas o `main` continuou apontando para o array original.

Reatribuir o parâmetro não muda a variável original.

---

## Mutação versus reatribuição

Essa diferença é essencial.

### Mutação

```java
valores[0] = 99;
```

Altera o conteúdo do array.

O `main` vê.

### Reatribuição

```java
valores = new int[]{99, 88, 77};
```

Faz o parâmetro apontar para outro array.

O `main` não muda.

Resumo:

```text
alterar conteúdo do objeto compartilhado afeta quem aponta para ele;
reatribuir o parâmetro não altera a variável original do chamador.
```

---

## Exemplo comparativo completo

Arquivo:

```text
MutacaoVsReatribuicaoArray.java
```

Código:

```java
public class MutacaoVsReatribuicaoArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarConteudo(valores);
        System.out.println("Depois de alterar conteúdo: " + valores[0]);

        trocarReferencia(valores);
        System.out.println("Depois de trocar referência: " + valores[0]);
    }

    public static void alterarConteudo(int[] valores) {
        valores[0] = 99;
    }

    public static void trocarReferencia(int[] valores) {
        valores = new int[]{1, 2, 3};
    }
}
```

Saída:

```text
Depois de alterar conteúdo: 99
Depois de trocar referência: 99
```

A segunda chamada não mudou a referência do `main`.

---

## String

`String` é objeto.

Mas `String` é imutável.

Isso significa:

```text
o conteúdo interno de uma String não é alterado.
```

Quando fazemos:

```java
texto = texto.trim().toUpperCase();
```

não estamos mudando a String original.

Estamos criando/obtendo outra String e fazendo a variável apontar para ela.

Isso é reatribuição da variável.

Se essa variável é um parâmetro, a variável original do `main` não muda.

---

## Exemplo com String

Arquivo:

```text
PassagemString.java
```

Código:

```java
public class PassagemString {
    public static void main(String[] args) {
        String status = " aprovado ";

        normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: " + status);
    }
}
```

Saída:

```text
Status no método: APROVADO
Status no main:  aprovado 
```

O método normalizou o parâmetro.

Mas o `main` continuou com a String original.

---

## Como normalizar String corretamente

Use retorno.

Arquivo:

```text
NormalizarStringComRetorno.java
```

Código:

```java
public class NormalizarStringComRetorno {
    public static void main(String[] args) {
        String status = " aprovado ";

        status = normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static String normalizar(String status) {
        if (status == null) {
            return "";
        }

        return status.trim().toUpperCase();
    }
}
```

Saída:

```text
Status no main: APROVADO
```

Para `String`, quando quiser transformar e usar fora, retorne a nova String.

---

## Objeto e referência

Objetos serão estudados com profundidade mais à frente.

Mas precisamos de uma noção inicial.

Pense em objeto como uma estrutura criada na memória e acessada por uma referência.

Arrays são objetos.

`String` é objeto.

Outros objetos virão depois:

```text
Pedido;
Cliente;
Produto;
Pagamento;
OrdemServico.
```

Quando passamos um objeto para método, Java passa uma cópia da referência.

Então:

```text
o método pode alterar o estado do objeto, se ele for mutável;
o método não consegue trocar o objeto original do chamador apenas reatribuindo o parâmetro.
```

Com arrays, já vimos esse comportamento.

---

## Exemplo demonstrativo com objeto mutável simples

Nesta fase ainda não entramos em criação de classes próprias.

Mas podemos usar uma classe pronta do Java apenas para demonstrar mutação:

```text
StringBuilder.
```

`StringBuilder` é um objeto mutável usado para montar texto.

Não precisa dominar `StringBuilder` agora.

Use apenas para entender referência.

Arquivo:

```text
PassagemObjetoMutavel.java
```

Código:

```java
public class PassagemObjetoMutavel {
    public static void main(String[] args) {
        StringBuilder texto = new StringBuilder("Pedido");

        alterarTexto(texto);

        System.out.println("Texto no main: " + texto);
    }

    public static void alterarTexto(StringBuilder texto) {
        texto.append(" aprovado");

        System.out.println("Texto no método: " + texto);
    }
}
```

Saída:

```text
Texto no método: Pedido aprovado
Texto no main: Pedido aprovado
```

O método alterou o conteúdo do objeto.

O `main` viu a alteração.

---

## Reatribuir objeto mutável não muda o main

Arquivo:

```text
ReatribuirObjetoMutavel.java
```

Código:

```java
public class ReatribuirObjetoMutavel {
    public static void main(String[] args) {
        StringBuilder texto = new StringBuilder("Pedido");

        trocarTexto(texto);

        System.out.println("Texto no main: " + texto);
    }

    public static void trocarTexto(StringBuilder texto) {
        texto = new StringBuilder("Outro texto");

        System.out.println("Texto no método: " + texto);
    }
}
```

Saída:

```text
Texto no método: Outro texto
Texto no main: Pedido
```

De novo:

```text
reatribuir o parâmetro não troca a variável original do main.
```

---

## Null como valor de referência

Uma referência pode ser `null`.

Exemplo:

```java
String status = null;
```

Se passarmos para método:

```java
validarStatus(status);
```

o método recebe uma cópia do valor `null`.

Exemplo:

```java
public static boolean statusValido(String status) {
    if (status == null) {
        return false;
    }

    return !status.isBlank();
}
```

Se tentar chamar método em `null`:

```java
status.isBlank()
```

ocorre erro em tempo de execução.

Por isso, referências precisam de validação quando podem ser `null`.

---

## Exemplo aplicado: produto e estoque primitivo

Arquivo:

```text
ProdutoEstoquePrimitivo.java
```

Código:

```java
public class ProdutoEstoquePrimitivo {
    public static void main(String[] args) {
        int estoque = 10;

        baixarEstoque(estoque, 3);

        System.out.println("Estoque no main: " + estoque);
    }

    public static void baixarEstoque(int estoque, int quantidadeBaixa) {
        estoque = estoque - quantidadeBaixa;

        System.out.println("Estoque no método: " + estoque);
    }
}
```

Saída:

```text
Estoque no método: 7
Estoque no main: 10
```

O estoque do `main` não mudou.

Para alterar corretamente:

```text
use retorno.
```

---

## Produto e estoque com retorno

Arquivo:

```text
ProdutoEstoqueComRetorno.java
```

Código:

```java
public class ProdutoEstoqueComRetorno {
    public static void main(String[] args) {
        int estoque = 10;

        estoque = baixarEstoque(estoque, 3);

        System.out.println("Estoque no main: " + estoque);
    }

    public static int baixarEstoque(int estoque, int quantidadeBaixa) {
        if (quantidadeBaixa <= 0 || quantidadeBaixa > estoque) {
            return estoque;
        }

        return estoque - quantidadeBaixa;
    }
}
```

Saída:

```text
Estoque no main: 7
```

Agora o valor novo voltou pelo `return`.

---

## Exemplo aplicado: tentativas de mensageria em array

Arquivo:

```text
MensageriaTentativasArray.java
```

Código:

```java
public class MensageriaTentativasArray {
    public static void main(String[] args) {
        int[] tentativas = {1, 2, 0};

        incrementarTentativa(tentativas, 2);

        System.out.println("Tentativas da mensagem 3: " + tentativas[2]);
    }

    public static void incrementarTentativa(int[] tentativas, int indiceMensagem) {
        if (indiceMensagem >= 0 && indiceMensagem < tentativas.length) {
            tentativas[indiceMensagem]++;
        }
    }
}
```

Saída:

```text
Tentativas da mensagem 3: 1
```

Aqui faz sentido alterar o array.

O método deixa claro no nome:

```text
incrementarTentativa.
```

---

## Exemplo aplicado: normalizar status em array

Arquivo:

```text
NormalizarStatusArrayReferencia.java
```

Código:

```java
public class NormalizarStatusArrayReferencia {
    public static void main(String[] args) {
        String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};

        normalizarStatus(statusPedidos);

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            System.out.println(statusPedidos[indice]);
        }
    }

    public static void normalizarStatus(String[] statusPedidos) {
        for (int indice = 0; indice < statusPedidos.length; indice++) {
            if (statusPedidos[indice] != null) {
                statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
            }
        }
    }
}
```

Saída:

```text
PENDENTE
APROVADO
RECUSADO
```

Aqui o método altera o conteúdo do array.

Isso é efeito colateral intencional.

---

## Exemplo aplicado: pedido com arrays paralelos

Arquivo:

```text
PedidosParalelosReferencia.java
```

Código:

```java
public class PedidosParalelosReferencia {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno"};
        long[] valoresCentavos = {1000L, 2500L};
        String[] statusPedidos = {"PENDENTE", "PENDENTE"};

        aprovarPedido(statusPedidos, 1);

        exibirPedidos(clientes, valoresCentavos, statusPedidos);
    }

    public static void aprovarPedido(String[] statusPedidos, int indicePedido) {
        if (indicePedido >= 0 && indicePedido < statusPedidos.length) {
            statusPedidos[indicePedido] = "APROVADO";
        }
    }

    public static void exibirPedidos(String[] clientes, long[] valoresCentavos, String[] statusPedidos) {
        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice]
                    + " | "
                    + valoresCentavos[indice]
                    + " | "
                    + statusPedidos[indice]);
        }
    }
}
```

Saída:

```text
Ana | 1000 | PENDENTE
Bruno | 2500 | APROVADO
```

O método alterou o conteúdo do array de status.

---

## Exemplo aplicado: pagamento com retorno

Arquivo:

```text
PagamentoValorParcelaRetorno.java
```

Código:

```java
public class PagamentoValorParcelaRetorno {
    public static void main(String[] args) {
        long valorTotal = 10000L;
        int parcelas = 4;

        long valorParcela = calcularParcela(valorTotal, parcelas);

        System.out.println("Valor da parcela: " + valorParcela);
    }

    public static long calcularParcela(long valorTotal, int parcelas) {
        if (parcelas <= 0) {
            return 0L;
        }

        return valorTotal / parcelas;
    }
}
```

Aqui usamos retorno porque queremos produzir um novo valor.

Não faria sentido tentar alterar `valorTotal` ou `parcelas` dentro do método.

---

## Exemplo aplicado: OS com status String

Arquivo:

```text
OsStatusStringReferencia.java
```

Código:

```java
public class OsStatusStringReferencia {
    public static void main(String[] args) {
        String statusOs = " aberta ";

        normalizarStatus(statusOs);

        System.out.println("Status no main: " + statusOs);
    }

    public static void normalizarStatus(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: " + status);
    }
}
```

Saída:

```text
Status no método: ABERTA
Status no main:  aberta 
```

String não foi alterada fora.

Correção:

```java
statusOs = normalizarStatus(statusOs);
```

com método que retorna `String`.

---

## OS com status String corrigido

Arquivo:

```text
OsStatusStringCorrigido.java
```

Código:

```java
public class OsStatusStringCorrigido {
    public static void main(String[] args) {
        String statusOs = " aberta ";

        statusOs = normalizarStatus(statusOs);

        System.out.println("Status no main: " + statusOs);
    }

    public static String normalizarStatus(String status) {
        if (status == null) {
            return "";
        }

        return status.trim().toUpperCase();
    }
}
```

Saída:

```text
Status no main: ABERTA
```

Para `String`, transformação deve retornar nova String.

---

## Exemplo aplicado: auditoria com mensagem

Arquivo:

```text
AuditoriaMensagemString.java
```

Código:

```java
public class AuditoriaMensagemString {
    public static void main(String[] args) {
        String mensagem = "criacao de pedido";

        mensagem = formatarMensagem(mensagem);

        System.out.println("Mensagem formatada: " + mensagem);
    }

    public static String formatarMensagem(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            return "MENSAGEM_NAO_INFORMADA";
        }

        return mensagem.trim().toUpperCase();
    }
}
```

Esse exemplo reforça:

```text
String transformada retorna nova String.
```

---

## Exemplo aplicado: matriz como referência

Arquivo:

```text
MatrizReferencia.java
```

Código:

```java
public class MatrizReferencia {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        zerarPrimeiraCelula(matriz);

        System.out.println("Primeira célula no main: " + matriz[0][0]);
    }

    public static void zerarPrimeiraCelula(int[][] matriz) {
        matriz[0][0] = 0;
    }
}
```

Saída:

```text
Primeira célula no main: 0
```

Matriz também é array de arrays.

Então o método consegue alterar seu conteúdo.

---

## Reatribuir matriz não muda o main

Arquivo:

```text
ReatribuirMatriz.java
```

Código:

```java
public class ReatribuirMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        trocarMatriz(matriz);

        System.out.println("Primeira célula no main: " + matriz[0][0]);
    }

    public static void trocarMatriz(int[][] matriz) {
        matriz = new int[][]{
                {99, 88},
                {77, 66}
        };

        System.out.println("Primeira célula no método: " + matriz[0][0]);
    }
}
```

Saída:

```text
Primeira célula no método: 99
Primeira célula no main: 10
```

Reatribuir parâmetro não altera a referência do chamador.

---

## Como decidir entre alterar e retornar

Pergunta principal:

```text
quero mudar o objeto recebido ou quero produzir um novo valor?
```

Se quer mudar objeto recebido:

```java
normalizarStatus(String[] statusPedidos)
incrementarTentativa(int[] tentativas, int indice)
zerarPrimeiraCelula(int[][] matriz)
```

Use `void` com nome claro de ação.

Se quer produzir valor:

```java
calcularTotal(int[] valores)
normalizarStatus(String status)
baixarEstoque(int estoque, int quantidade)
calcularParcela(long valor, int parcelas)
```

Use retorno.

Regra prática:

```text
primitivos e String transformada -> normalmente retorno;
arrays que devem ser alterados -> void com nome claro;
arrays que devem ser analisados -> retorno sem alterar.
```

---

## Efeito colateral

Efeito colateral é quando um método altera algo observável fora dele.

Exemplo:

```java
incrementarTentativa(tentativas, 2);
```

Depois da chamada, o array mudou.

Isso é efeito colateral.

Efeito colateral não é sempre ruim.

Mas precisa ser intencional e claro.

Nomes bons:

```java
incrementarTentativa
normalizarStatus
aprovarPedido
zerarPrimeiraCelula
aplicarBaixa
```

Nomes ruins para métodos que alteram:

```java
exibir
calcular
obter
buscar
```

Se o método se chama `calcular`, esperamos que ele retorne cálculo, não que altere dados escondido.

---

## Método de leitura não deveria alterar

Exemplo ruim:

```java
public static int calcularTotal(int[] valores) {
    valores[0] = 0;

    int total = 0;

    for (int indice = 0; indice < valores.length; indice++) {
        total += valores[indice];
    }

    return total;
}
```

Esse método se chama `calcularTotal`, mas altera o array.

Isso é perigoso.

Melhor:

```java
public static int calcularTotal(int[] valores) {
    int total = 0;

    for (int indice = 0; indice < valores.length; indice++) {
        total += valores[indice];
    }

    return total;
}
```

Método de cálculo deve evitar efeito colateral.

---

## Erros comuns

### Erro 1 — Dizer que Java passa objeto por referência

Frase correta:

```text
Java passa por valor.
```

Para objetos:

```text
Java passa por valor uma cópia da referência.
```

---

### Erro 2 — Achar que alterar int no método altera fora

Não altera.

Use retorno.

---

### Erro 3 — Achar que alterar array no método não altera fora

Altera o conteúdo do array, porque a referência copiada aponta para o mesmo array.

---

### Erro 4 — Achar que reatribuir array no método troca o array do main

Não troca.

Reatribuir o parâmetro muda apenas o parâmetro.

---

### Erro 5 — Tentar normalizar String sem retorno

Isso altera apenas o parâmetro local.

Use retorno.

---

### Erro 6 — Método com efeito colateral e nome enganoso

Se o método altera, o nome precisa indicar ação de alteração.

---

### Erro 7 — Alterar array dentro de método de cálculo

Método de cálculo deveria apenas calcular e retornar.

---

### Erro 8 — Não validar null

Referências podem ser `null`.

Antes de chamar método em referência, valide quando necessário.

---

### Erro 9 — Confundir referência com objeto

A variável guarda uma referência.

O objeto é a estrutura acessada por essa referência.

---

### Erro 10 — Esquecer que parâmetro é variável local

Parâmetro tem escopo no método.

Reatribuir parâmetro não muda variável original do chamador.

---

## Diagnóstico de passagem de valores e referências

Quando o resultado não for o esperado, siga o roteiro.

### 1. O argumento é primitivo?

Se for `int`, `long`, `double`, `boolean`, alterar parâmetro não altera fora.

### 2. O argumento é array?

O método pode alterar o conteúdo do array.

### 3. O método está alterando conteúdo ou reatribuindo parâmetro?

Conteúdo:

```java
valores[0] = 99;
```

Reatribuição:

```java
valores = new int[]{99};
```

São coisas diferentes.

### 4. O argumento é String?

String é objeto, mas imutável.

Transformações retornam nova String.

### 5. O método usa retorno?

Se quer mudar primitivo ou String fora, use retorno e atribua.

### 6. O método tem efeito colateral?

Verifique se ele altera array, matriz ou objeto mutável.

### 7. O nome do método deixa isso claro?

`normalizarStatus` pode alterar.

`calcularTotal` não deveria alterar.

### 8. Existe null?

Valide antes de chamar métodos.

### 9. A variável original foi reatribuída?

Para retorno funcionar:

```java
status = normalizar(status);
```

Não basta chamar:

```java
normalizar(status);
```

### 10. Use debug

Observe valor no `main`, valor no método e valor depois da chamada.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esperar int mudar fora

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;

        alterar(quantidade);

        System.out.println(quantidade);
    }

    public static void alterar(int quantidade) {
        quantidade = 99;
    }
}
```

Depois corrija usando retorno.

---

### Teste 2 — Alterar array sem perceber

```java
public class Main {
    public static void main(String[] args) {
        int[] valores = {10, 20};

        alterar(valores);

        System.out.println(valores[0]);
    }

    public static void alterar(int[] valores) {
        valores[0] = 99;
    }
}
```

Explique por que o `main` vê a mudança.

---

### Teste 3 — Reatribuir array esperando trocar fora

```java
public class Main {
    public static void main(String[] args) {
        int[] valores = {10, 20};

        trocar(valores);

        System.out.println(valores[0]);
    }

    public static void trocar(int[] valores) {
        valores = new int[]{99, 88};
    }
}
```

Explique por que o `main` continua com 10.

---

### Teste 4 — Normalizar String sem retorno

```java
public class Main {
    public static void main(String[] args) {
        String status = " aprovado ";

        normalizar(status);

        System.out.println(status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();
    }
}
```

Depois corrija retornando `String`.

---

### Teste 5 — Reatribuir objeto mutável

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder texto = new StringBuilder("A");

        trocar(texto);

        System.out.println(texto);
    }

    public static void trocar(StringBuilder texto) {
        texto = new StringBuilder("B");
    }
}
```

Explique por que imprime `A`.

Depois teste mutação:

```java
texto.append("B");
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-058-passagem-valores-referencias
cd labs\m1\aula-058-passagem-valores-referencias
```

Crie arquivos:

```text
Main.java
PassagemLong.java
PassagemBoolean.java
PassagemDouble.java
AlterarPrimitivoComRetorno.java
IncrementarPrimitivoComRetorno.java
PassagemArray.java
ReatribuirArray.java
MutacaoVsReatribuicaoArray.java
PassagemString.java
NormalizarStringComRetorno.java
PassagemObjetoMutavel.java
ReatribuirObjetoMutavel.java
ProdutoEstoquePrimitivo.java
ProdutoEstoqueComRetorno.java
MensageriaTentativasArray.java
NormalizarStatusArrayReferencia.java
PedidosParalelosReferencia.java
PagamentoValorParcelaRetorno.java
OsStatusStringReferencia.java
OsStatusStringCorrigido.java
AuditoriaMensagemString.java
MatrizReferencia.java
ReatribuirMatriz.java
ErroPrimitivoNaoMudaFora.java
ErroArrayAlteradoSemPerceber.java
ErroReatribuirArray.java
ErroStringSemRetorno.java
ErroMetodoCalculoAlterandoArray.java
```

Compile:

```powershell
javac Main.java
javac PassagemLong.java
javac PassagemBoolean.java
javac PassagemDouble.java
javac AlterarPrimitivoComRetorno.java
javac IncrementarPrimitivoComRetorno.java
javac PassagemArray.java
javac ReatribuirArray.java
javac MutacaoVsReatribuicaoArray.java
javac PassagemString.java
javac NormalizarStringComRetorno.java
javac PassagemObjetoMutavel.java
javac ReatribuirObjetoMutavel.java
javac ProdutoEstoquePrimitivo.java
javac ProdutoEstoqueComRetorno.java
javac MensageriaTentativasArray.java
javac NormalizarStatusArrayReferencia.java
javac PedidosParalelosReferencia.java
javac PagamentoValorParcelaRetorno.java
javac OsStatusStringReferencia.java
javac OsStatusStringCorrigido.java
javac AuditoriaMensagemString.java
javac MatrizReferencia.java
javac ReatribuirMatriz.java
javac ErroPrimitivoNaoMudaFora.java
javac ErroArrayAlteradoSemPerceber.java
javac ErroReatribuirArray.java
javac ErroStringSemRetorno.java
javac ErroMetodoCalculoAlterandoArray.java
```

Execute:

```powershell
java Main
java PassagemLong
java PassagemBoolean
java PassagemDouble
java AlterarPrimitivoComRetorno
java IncrementarPrimitivoComRetorno
java PassagemArray
java ReatribuirArray
java MutacaoVsReatribuicaoArray
java PassagemString
java NormalizarStringComRetorno
java PassagemObjetoMutavel
java ReatribuirObjetoMutavel
java ProdutoEstoquePrimitivo
java ProdutoEstoqueComRetorno
java MensageriaTentativasArray
java NormalizarStatusArrayReferencia
java PedidosParalelosReferencia
java PagamentoValorParcelaRetorno
java OsStatusStringReferencia
java OsStatusStringCorrigido
java AuditoriaMensagemString
java MatrizReferencia
java ReatribuirMatriz
java ErroPrimitivoNaoMudaFora
java ErroArrayAlteradoSemPerceber
java ErroReatribuirArray
java ErroStringSemRetorno
java ErroMetodoCalculoAlterandoArray
```

Alguns arquivos de erro proposital demonstram comportamento inesperado, não necessariamente erro de compilação.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroPrimitivoNaoMudaFora.java`

```java
public class ErroPrimitivoNaoMudaFora {
    public static void main(String[] args) {
        int estoque = 10;

        baixarEstoque(estoque, 3);

        System.out.println("Estoque final esperado pelo iniciante: 7");
        System.out.println("Estoque real: " + estoque);
    }

    public static void baixarEstoque(int estoque, int quantidade) {
        estoque = estoque - quantidade;
    }
}
```

Objetivo:

```text
entender que primitivo alterado no método não altera variável original.
```

---

## Arquivo sugerido: `ErroArrayAlteradoSemPerceber.java`

```java
public class ErroArrayAlteradoSemPerceber {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        calcularTotalComErro(valores);

        System.out.println("Primeiro valor depois do cálculo: " + valores[0]);
    }

    public static int calcularTotalComErro(int[] valores) {
        valores[0] = 0;

        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        return total;
    }
}
```

Objetivo:

```text
perceber que método de cálculo não deveria alterar array recebido.
```

---

## Arquivo sugerido: `ErroStringSemRetorno.java`

```java
public class ErroStringSemRetorno {
    public static void main(String[] args) {
        String status = " pendente ";

        normalizar(status);

        System.out.println("Status: " + status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();
    }
}
```

Depois corrija:

```java
status = normalizar(status);
```

com método retornando `String`.

Objetivo:

```text
entender que String transformada precisa ser retornada para alterar a variável do chamador.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar métodos comparativos |
| Renomear variável | `Shift + F6` | Diferenciar nomes de parâmetro e variável externa |
| Ir para declaração | `Ctrl + B` em muitos keymaps | Ver método chamado |
| Encontrar usos | `Alt + F7` em muitos keymaps | Ver onde array é alterado |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar exemplos |
| Debug | `Shift + F9` | Ver antes e depois da chamada |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Passar pela chamada |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Ver valores no debug |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;

        alterarQuantidade(quantidade);

        System.out.println(quantidade);
    }

    public static void alterarQuantidade(int quantidade) {
        quantidade = 99;
    }
}
```

Observe:

```text
quantidade no main = 10;
quantidade no método recebe 10;
quantidade no método vira 99;
ao voltar para main, quantidade continua 10.
```

Depois debugue:

```java
int[] valores = {10, 20};

alterarPrimeiro(valores);
```

Observe:

```text
variável do main aponta para array;
parâmetro aponta para o mesmo array;
conteúdo do array muda;
main enxerga o conteúdo alterado.
```

Esse debug fixa a aula.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 058 — Passagem de valores e referências

### O que aprendi
Aprendi que Java sempre passa argumentos por valor. Para primitivos, copia o valor. Para objetos e arrays, copia a referência. Por isso, alterar um primitivo dentro do método não muda fora, mas alterar o conteúdo de um array muda o array compartilhado.

### O que pratiquei
Criei exemplos com `int`, `long`, `double`, `boolean`, `String`, arrays, matriz e objeto mutável demonstrativo. Também comparei mutação e reatribuição, normalizei String com retorno, alterei array por referência e corrigi erros conceituais.

### Conceitos principais
- pass-by-value
- passagem por valor
- primitivos
- referência
- cópia da referência
- objeto
- array
- matriz
- String imutável
- mutação
- reatribuição
- parâmetro local
- argumento
- efeito colateral
- retorno para alterar primitivo
- retorno para transformar String
- alteração de conteúdo de array
- reatribuição de parâmetro
- null
- método de cálculo sem mutação

### Arquivos criados
- `labs/m1/aula-058-passagem-valores-referencias/Main.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemLong.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemBoolean.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemDouble.java`
- `labs/m1/aula-058-passagem-valores-referencias/AlterarPrimitivoComRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/IncrementarPrimitivoComRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemArray.java`
- `labs/m1/aula-058-passagem-valores-referencias/ReatribuirArray.java`
- `labs/m1/aula-058-passagem-valores-referencias/MutacaoVsReatribuicaoArray.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemString.java`
- `labs/m1/aula-058-passagem-valores-referencias/NormalizarStringComRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/PassagemObjetoMutavel.java`
- `labs/m1/aula-058-passagem-valores-referencias/ReatribuirObjetoMutavel.java`
- `labs/m1/aula-058-passagem-valores-referencias/ProdutoEstoquePrimitivo.java`
- `labs/m1/aula-058-passagem-valores-referencias/ProdutoEstoqueComRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/MensageriaTentativasArray.java`
- `labs/m1/aula-058-passagem-valores-referencias/NormalizarStatusArrayReferencia.java`
- `labs/m1/aula-058-passagem-valores-referencias/PedidosParalelosReferencia.java`
- `labs/m1/aula-058-passagem-valores-referencias/PagamentoValorParcelaRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/OsStatusStringReferencia.java`
- `labs/m1/aula-058-passagem-valores-referencias/OsStatusStringCorrigido.java`
- `labs/m1/aula-058-passagem-valores-referencias/AuditoriaMensagemString.java`
- `labs/m1/aula-058-passagem-valores-referencias/MatrizReferencia.java`
- `labs/m1/aula-058-passagem-valores-referencias/ReatribuirMatriz.java`
- `labs/m1/aula-058-passagem-valores-referencias/ErroPrimitivoNaoMudaFora.java`
- `labs/m1/aula-058-passagem-valores-referencias/ErroArrayAlteradoSemPerceber.java`
- `labs/m1/aula-058-passagem-valores-referencias/ErroReatribuirArray.java`
- `labs/m1/aula-058-passagem-valores-referencias/ErroStringSemRetorno.java`
- `labs/m1/aula-058-passagem-valores-referencias/ErroMetodoCalculoAlterandoArray.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac PassagemArray.java
java PassagemArray
javac ReatribuirArray.java
java ReatribuirArray
javac PassagemString.java
java PassagemString
javac NormalizarStringComRetorno.java
java NormalizarStringComRetorno
```

### Erros que quero evitar
- dizer que Java passa objeto por referência;
- achar que alterar `int` no método altera fora;
- achar que alterar array no método não altera fora;
- achar que reatribuir array no método troca o array do `main`;
- tentar normalizar `String` sem retorno;
- criar método com efeito colateral e nome enganoso;
- alterar array dentro de método de cálculo;
- não validar `null`;
- confundir referência com objeto;
- esquecer que parâmetro é variável local.

### Próximo passo
Estudar tratamento inicial de erros de entrada.
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
git add labs/m1/aula-058-passagem-valores-referencias docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 058: pratica passagem de valores e referencias em Java"
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
1. Java passa argumentos por valor ou por referência?
2. O que significa passar um primitivo por valor?
3. O que significa passar uma referência por valor?
4. Por que alterar um int dentro do método não muda fora?
5. Por que alterar uma posição de array dentro do método muda fora?
6. Qual a diferença entre mutar conteúdo e reatribuir parâmetro?
7. Por que reatribuir um array dentro do método não troca o array do main?
8. Por que String normalizada dentro do método não muda fora sem retorno?
9. Quando devo usar retorno para atualizar valor?
10. O que é efeito colateral e por que o nome do método deve deixar isso claro?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar pass-by-value em Java;
explicar passagem por valor em primitivos;
explicar cópia da referência em objetos;
explicar que Java não passa objeto por referência no sentido técnico;
alterar primitivo dentro do método e prever resultado;
corrigir alteração de primitivo usando retorno;
alterar array dentro do método e prever resultado;
reatribuir array dentro do método e prever resultado;
diferenciar mutação de reatribuição;
explicar String imutável;
normalizar String usando retorno;
explicar objeto mutável de forma inicial;
usar array como referência compartilhada;
usar matriz como referência compartilhada;
aplicar em estoque;
aplicar em pagamento;
aplicar em status de OS;
aplicar em mensageria;
aplicar em auditoria;
identificar efeito colateral;
evitar método de cálculo com mutação;
validar null quando necessário;
diagnosticar erros comuns;
debugar antes e depois da chamada;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar profundamente heap e stack.

Não precisa ainda dominar classes próprias.

Não precisa ainda dominar imutabilidade avançada.

Não precisa ainda dominar coleções.

Não precisa ainda dominar objetos de domínio.

Esses assuntos virão depois.

O objetivo é dominar o comportamento prático de parâmetros com primitivos, arrays, String e referências.

---

## Fechamento da aula

Hoje aprendemos passagem de valores e referências em Java.

A regra principal foi:

```text
Java sempre passa argumentos por valor.
```

Para primitivos:

```text
o valor é copiado.
```

Para objetos e arrays:

```text
a referência é copiada.
```

Isso explica por que:

```text
alterar int dentro do método não muda fora;
alterar conteúdo de array dentro do método muda fora;
reatribuir parâmetro de array não troca o array do main;
normalizar String sem retorno não muda a String do main.
```

A frase técnica mais importante é:

```text
Java passa a referência por valor.
```

O ponto mais importante da aula é saber decidir:

```text
quando retornar um novo valor;
quando alterar um objeto recebido;
quando evitar efeito colateral.
```

Na próxima aula, vamos estudar tratamento inicial de erros de entrada.

Vamos começar a lidar com entradas inválidas no `Scanner`, `InputMismatchException`, `try/catch` básico e recuperação simples de erro.
