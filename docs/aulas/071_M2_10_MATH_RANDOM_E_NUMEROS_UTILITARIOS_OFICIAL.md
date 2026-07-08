# 071 — M2.10 — Math, Random e Números Utilitários

## A pergunta central da aula

Observe este código:

```java
double valor = 10.75;

System.out.println((int) valor);
System.out.println(Math.round(valor));
System.out.println(Math.floor(valor));
System.out.println(Math.ceil(valor));
```

A saída será:

```text
10
11
10.0
11.0
```

Na aula anterior vimos que cast não arredonda.

Agora vemos que `Math` oferece métodos específicos para regras numéricas.

Outro exemplo:

```java
Random random = new Random();

int numero = random.nextInt(10);
```

Esse código gera um número de `0` até `9`.

Parece simples, mas exige entender:

```text
limite inferior;
limite superior;
inclusivo;
exclusivo;
aleatório pseudoaleatório;
uso em teste;
uso proibido em segurança;
reprodutibilidade com seed.
```

---

## O que é Math

`Math` é uma classe utilitária do Java.

Ela tem métodos estáticos para operações matemáticas comuns.

Exemplos:

```java
Math.abs(-10)
Math.max(10, 20)
Math.min(10, 20)
Math.round(10.6)
Math.floor(10.6)
Math.ceil(10.1)
Math.pow(2, 3)
Math.sqrt(25)
Math.random()
```

Não criamos objeto `Math`.

Não fazemos:

```java
new Math()
```

Usamos direto:

```java
Math.max(10, 20)
```

Porque seus métodos são estáticos.

---

## O que é Random

`Random` é uma classe para gerar números pseudoaleatórios.

Uso:

```java
import java.util.Random;

Random random = new Random();

int numero = random.nextInt(10);
```

O resultado de:

```java
random.nextInt(10)
```

vai de:

```text
0 até 9.
```

O limite superior é exclusivo.

Isso é muito importante.

Se você quer números de 1 a 10:

```java
int numero = random.nextInt(10) + 1;
```

Porque:

```text
random.nextInt(10) -> 0 a 9
+ 1 -> 1 a 10
```

---

## Math.random versus Random

`Math.random()` retorna um `double` entre:

```text
0.0 inclusivo
e
1.0 exclusivo
```

Exemplo:

```java
double valor = Math.random();
```

Para gerar inteiro com `Math.random`, fazemos cálculo:

```java
int numero = (int) (Math.random() * 10);
```

Isso gera de:

```text
0 a 9.
```

Com `Random`, o código costuma ser mais claro:

```java
Random random = new Random();

int numero = random.nextInt(10);
```

Regra inicial:

```text
para aleatórios simples, prefira Random nesta fase;
Math.random é útil para entender a base.
```

---

## O que são números pseudoaleatórios

Os números gerados por `Random` são pseudoaleatórios.

Isso significa:

```text
parecem aleatórios para uso comum;
são gerados por algoritmo;
podem ser reproduzidos com a mesma seed;
não devem ser usados para segurança.
```

Para sorteios simples, massa de teste e simulações didáticas, `Random` serve.

Para senha, token, criptografia e segurança, não use `Random`.

Esse assunto será tratado no futuro com `SecureRandom`.

Nesta aula:

```text
Random é para testes simples, simulações e exemplos.
```

---

## Vocabulário essencial

Termos desta aula:

```text
Math;
Random;
número utilitário;
arredondamento;
round;
floor;
ceil;
abs;
max;
min;
pow;
sqrt;
random;
nextInt;
nextDouble;
seed;
pseudoaleatório;
limite inclusivo;
limite exclusivo;
range;
faixa;
mínimo;
máximo;
overflow;
Integer.MAX_VALUE;
Integer.MIN_VALUE;
Long.MAX_VALUE;
Long.MIN_VALUE;
Double.MAX_VALUE;
teste simples;
massa de teste;
simulação;
distribuição;
segurança;
SecureRandom.
```

Termos mais importantes:

```text
Math -> classe utilitária para operações matemáticas;
Random -> classe para números pseudoaleatórios;
round -> arredonda para o inteiro mais próximo;
floor -> arredonda para baixo;
ceil -> arredonda para cima;
abs -> valor absoluto;
max -> maior valor;
min -> menor valor;
pow -> potência;
sqrt -> raiz quadrada;
nextInt(bound) -> inteiro de 0 até bound - 1;
seed -> valor inicial que permite reproduzir sequência pseudoaleatória;
limite exclusivo -> valor final que não entra na geração.
```

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
        double valor = 10.75;

        System.out.println("Valor original: " + valor);
        System.out.println("Cast para int: " + (int) valor);
        System.out.println("Math.round: " + Math.round(valor));
        System.out.println("Math.floor: " + Math.floor(valor));
        System.out.println("Math.ceil: " + Math.ceil(valor));
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
Valor original: 10.75
Cast para int: 10
Math.round: 11
Math.floor: 10.0
Math.ceil: 11.0
```

Conclusão:

```text
cast trunca;
round arredonda;
floor desce;
ceil sobe.
```

---

## Math.round

`Math.round` arredonda para o inteiro mais próximo.

Exemplo:

```java
Math.round(10.4) -> 10
Math.round(10.5) -> 11
Math.round(10.9) -> 11
```

Arquivo:

```text
MathRoundExemplo.java
```

Código:

```java
public class MathRoundExemplo {
    public static void main(String[] args) {
        System.out.println(Math.round(10.4));
        System.out.println(Math.round(10.5));
        System.out.println(Math.round(10.9));
    }
}
```

Saída:

```text
10
11
11
```

Atenção:

```text
Math.round(double) retorna long;
Math.round(float) retorna int.
```

---

## Math.floor

`Math.floor` arredonda para baixo.

Exemplo:

```java
Math.floor(10.1) -> 10.0
Math.floor(10.9) -> 10.0
```

Arquivo:

```text
MathFloorExemplo.java
```

Código:

```java
public class MathFloorExemplo {
    public static void main(String[] args) {
        System.out.println(Math.floor(10.1));
        System.out.println(Math.floor(10.9));
    }
}
```

Saída:

```text
10.0
10.0
```

Uso comum:

```text
pegar parte inteira inferior;
calcular páginas com cuidado;
calcular faixas;
regras onde sempre desce.
```

---

## Math.ceil

`Math.ceil` arredonda para cima.

Exemplo:

```java
Math.ceil(10.1) -> 11.0
Math.ceil(10.9) -> 11.0
```

Arquivo:

```text
MathCeilExemplo.java
```

Código:

```java
public class MathCeilExemplo {
    public static void main(String[] args) {
        System.out.println(Math.ceil(10.1));
        System.out.println(Math.ceil(10.9));
    }
}
```

Saída:

```text
11.0
11.0
```

Uso comum em backend:

```text
calcular quantidade de páginas;
calcular lotes;
calcular grupos;
calcular pacotes necessários.
```

Exemplo:

```text
23 itens em páginas de 10 -> 3 páginas.
```

---

## Cálculo de páginas com ceil

Arquivo:

```text
CalculoPaginas.java
```

Código:

```java
public class CalculoPaginas {
    public static void main(String[] args) {
        int totalItens = 23;
        int tamanhoPagina = 10;

        int paginas = calcularPaginas(totalItens, tamanhoPagina);

        System.out.println("Páginas: " + paginas);
    }

    public static int calcularPaginas(int totalItens, int tamanhoPagina) {
        if (totalItens <= 0) {
            return 0;
        }

        if (tamanhoPagina <= 0) {
            throw new IllegalArgumentException("Tamanho da página deve ser maior que zero.");
        }

        return (int) Math.ceil((double) totalItens / tamanhoPagina);
    }
}
```

Saída:

```text
Páginas: 3
```

Ponto importante:

```java
(double) totalItens / tamanhoPagina
```

Sem isso, a divisão seria inteira.

---

## Alternativa sem double para páginas

Também dá para calcular páginas usando inteiros:

```java
return (totalItens + tamanhoPagina - 1) / tamanhoPagina;
```

Arquivo:

```text
CalculoPaginasInteiro.java
```

Código:

```java
public class CalculoPaginasInteiro {
    public static void main(String[] args) {
        int totalItens = 23;
        int tamanhoPagina = 10;

        int paginas = calcularPaginas(totalItens, tamanhoPagina);

        System.out.println("Páginas: " + paginas);
    }

    public static int calcularPaginas(int totalItens, int tamanhoPagina) {
        if (totalItens <= 0) {
            return 0;
        }

        if (tamanhoPagina <= 0) {
            throw new IllegalArgumentException("Tamanho da página deve ser maior que zero.");
        }

        return (totalItens + tamanhoPagina - 1) / tamanhoPagina;
    }
}
```

Esse cálculo evita ponto flutuante.

É muito usado em paginação.

---

## Math.abs

`Math.abs` retorna valor absoluto.

Exemplo:

```java
Math.abs(-10) -> 10
Math.abs(10) -> 10
```

Arquivo:

```text
MathAbsExemplo.java
```

Código:

```java
public class MathAbsExemplo {
    public static void main(String[] args) {
        int diferenca = -15;

        int absoluta = Math.abs(diferenca);

        System.out.println("Diferença absoluta: " + absoluta);
    }
}
```

Uso comum:

```text
diferença entre valores;
distância simples;
variação absoluta;
cálculo de erro;
comparação de tolerância.
```

---

## Math.max e Math.min

`Math.max` retorna o maior.

`Math.min` retorna o menor.

Arquivo:

```text
MathMaxMinExemplo.java
```

Código:

```java
public class MathMaxMinExemplo {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;

        System.out.println("Maior: " + Math.max(primeiro, segundo));
        System.out.println("Menor: " + Math.min(primeiro, segundo));
    }
}
```

Saída:

```text
Maior: 20
Menor: 10
```

Uso comum:

```text
limitar valor mínimo;
limitar valor máximo;
comparar métricas;
calcular faixa permitida.
```

---

## Limitando valor com min e max

Arquivo:

```text
LimitarValor.java
```

Código:

```java
public class LimitarValor {
    public static void main(String[] args) {
        int descontoSolicitado = 120;

        int descontoAplicado = limitar(descontoSolicitado, 0, 100);

        System.out.println("Desconto aplicado: " + descontoAplicado);
    }

    public static int limitar(int valor, int minimo, int maximo) {
        int acimaDoMinimo = Math.max(valor, minimo);

        return Math.min(acimaDoMinimo, maximo);
    }
}
```

Saída:

```text
Desconto aplicado: 100
```

Esse padrão é útil quando um valor precisa ficar dentro de uma faixa.

---

## Math.pow

`Math.pow` calcula potência.

Exemplo:

```java
Math.pow(2, 3) -> 8.0
```

Arquivo:

```text
MathPowExemplo.java
```

Código:

```java
public class MathPowExemplo {
    public static void main(String[] args) {
        double resultado = Math.pow(2, 3);

        System.out.println("2 elevado a 3: " + resultado);
    }
}
```

Saída:

```text
2 elevado a 3: 8.0
```

Atenção:

```text
Math.pow retorna double.
```

Se você precisa de inteiro, avalie conversão com cuidado.

---

## Math.sqrt

`Math.sqrt` calcula raiz quadrada.

Exemplo:

```java
Math.sqrt(25) -> 5.0
```

Arquivo:

```text
MathSqrtExemplo.java
```

Código:

```java
public class MathSqrtExemplo {
    public static void main(String[] args) {
        double raiz = Math.sqrt(25);

        System.out.println("Raiz: " + raiz);
    }
}
```

Saída:

```text
Raiz: 5.0
```

Uso comum:

```text
fórmulas matemáticas;
distância;
cálculos estatísticos;
algoritmos específicos.
```

Em backend corporativo comum, `sqrt` aparece menos que `round`, `ceil`, `min` e `max`.

---

## Math.random

Arquivo:

```text
MathRandomExemplo.java
```

Código:

```java
public class MathRandomExemplo {
    public static void main(String[] args) {
        double valor = Math.random();

        System.out.println("Aleatório: " + valor);
    }
}
```

Saída:

```text
um número de 0.0 até menor que 1.0.
```

Exemplo de saída:

```text
0.734829193
```

Cada execução pode variar.

---

## Inteiro com Math.random

Arquivo:

```text
InteiroComMathRandom.java
```

Código:

```java
public class InteiroComMathRandom {
    public static void main(String[] args) {
        int numero = (int) (Math.random() * 10);

        System.out.println("Número: " + numero);
    }
}
```

Gera de:

```text
0 a 9.
```

Para gerar de 1 a 10:

```java
int numero = (int) (Math.random() * 10) + 1;
```

Mas, para clareza, vamos preferir `Random`.

---

## Random básico

Arquivo:

```text
RandomBasico.java
```

Código:

```java
import java.util.Random;

public class RandomBasico {
    public static void main(String[] args) {
        Random random = new Random();

        int numero = random.nextInt(10);

        System.out.println("Número: " + numero);
    }
}
```

Gera de:

```text
0 a 9.
```

Importante:

```text
o limite 10 é exclusivo.
```

---

## Random de 1 a 10

Arquivo:

```text
RandomUmADez.java
```

Código:

```java
import java.util.Random;

public class RandomUmADez {
    public static void main(String[] args) {
        Random random = new Random();

        int numero = random.nextInt(10) + 1;

        System.out.println("Número: " + numero);
    }
}
```

Gera de:

```text
1 a 10.
```

Regra:

```text
random.nextInt(quantidadeDePossibilidades) + valorInicial.
```

Para faixa de 5 a 15:

```java
int numero = random.nextInt(11) + 5;
```

Porque de 5 a 15 existem 11 possibilidades.

---

## Método para gerar inteiro em faixa

Arquivo:

```text
RandomFaixa.java
```

Código:

```java
import java.util.Random;

public class RandomFaixa {
    public static void main(String[] args) {
        Random random = new Random();

        int numero = gerarEntre(random, 5, 15);

        System.out.println("Número: " + numero);
    }

    public static int gerarEntre(Random random, int minimo, int maximo) {
        if (random == null) {
            throw new IllegalArgumentException("Random é obrigatório.");
        }

        if (minimo > maximo) {
            throw new IllegalArgumentException("Mínimo não pode ser maior que máximo.");
        }

        int quantidadePossibilidades = maximo - minimo + 1;

        return random.nextInt(quantidadePossibilidades) + minimo;
    }
}
```

Esse método gera de:

```text
mínimo até máximo, incluindo ambos.
```

---

## Seed

`Random` pode receber uma seed.

Exemplo:

```java
Random random = new Random(123);
```

Com a mesma seed, a sequência gerada é reproduzível.

Arquivo:

```text
RandomComSeed.java
```

Código:

```java
import java.util.Random;

public class RandomComSeed {
    public static void main(String[] args) {
        Random primeiro = new Random(123);
        Random segundo = new Random(123);

        System.out.println(primeiro.nextInt(100));
        System.out.println(primeiro.nextInt(100));
        System.out.println(primeiro.nextInt(100));

        System.out.println(segundo.nextInt(100));
        System.out.println(segundo.nextInt(100));
        System.out.println(segundo.nextInt(100));
    }
}
```

As duas sequências serão iguais.

Isso é útil em testes reprodutíveis.

---

## Random em testes simples

Em QA e desenvolvimento, podemos usar `Random` para gerar massa simples.

Exemplo:

```text
cliente 123;
pedido 456;
produto 789;
tentativa aleatória;
valor simulado;
status sorteado.
```

Atenção:

```text
massa aleatória ajuda a variar;
mas teste totalmente aleatório pode ser difícil de reproduzir;
para investigação, seed fixa ajuda.
```

Regra prática:

```text
para teste exploratório, aleatório solto pode ajudar;
para teste automatizado, prefira dados determinísticos ou seed controlada.
```

---

## Sorteio de status

Arquivo:

```text
SorteioStatus.java
```

Código:

```java
import java.util.Random;

public class SorteioStatus {
    public static void main(String[] args) {
        Random random = new Random();

        String status = sortearStatus(random);

        System.out.println("Status: " + status);
    }

    public static String sortearStatus(Random random) {
        int codigo = random.nextInt(3);

        if (codigo == 0) {
            return "PENDENTE";
        }

        if (codigo == 1) {
            return "APROVADO";
        }

        return "RECUSADO";
    }
}
```

`random.nextInt(3)` gera:

```text
0, 1 ou 2.
```

---

## Sorteio usando array

Arquivo:

```text
SorteioStatusArray.java
```

Código:

```java
import java.util.Random;

public class SorteioStatusArray {
    public static void main(String[] args) {
        Random random = new Random();

        String[] statusPossiveis = {"PENDENTE", "APROVADO", "RECUSADO"};

        String status = sortear(statusPossiveis, random);

        System.out.println("Status: " + status);
    }

    public static String sortear(String[] valores, Random random) {
        if (valores == null || valores.length == 0) {
            throw new IllegalArgumentException("Valores para sorteio são obrigatórios.");
        }

        if (random == null) {
            throw new IllegalArgumentException("Random é obrigatório.");
        }

        int indice = random.nextInt(valores.length);

        return valores[indice];
    }
}
```

Esse modelo é mais flexível.

---

## Limites numéricos

Os wrappers oferecem limites úteis:

```java
Integer.MAX_VALUE
Integer.MIN_VALUE
Long.MAX_VALUE
Long.MIN_VALUE
Double.MAX_VALUE
Double.MIN_VALUE
```

Arquivo:

```text
LimitesNumericos.java
```

Código:

```java
public class LimitesNumericos {
    public static void main(String[] args) {
        System.out.println("Integer MIN: " + Integer.MIN_VALUE);
        System.out.println("Integer MAX: " + Integer.MAX_VALUE);
        System.out.println("Long MIN: " + Long.MIN_VALUE);
        System.out.println("Long MAX: " + Long.MAX_VALUE);
        System.out.println("Double MIN: " + Double.MIN_VALUE);
        System.out.println("Double MAX: " + Double.MAX_VALUE);
    }
}
```

Esses limites ajudam em validação e diagnóstico.

---

## Cuidado com overflow

Arquivo:

```text
OverflowInteiro.java
```

Código:

```java
public class OverflowInteiro {
    public static void main(String[] args) {
        int maximo = Integer.MAX_VALUE;

        System.out.println("Máximo: " + maximo);
        System.out.println("Máximo + 1: " + (maximo + 1));
    }
}
```

Saída:

```text
Máximo: 2147483647
Máximo + 1: -2147483648
```

Isso é overflow.

Java não lança exceção automaticamente nesse caso.

Por isso, limites importam.

---

## Math.addExact

Java tem métodos que lançam exceção em overflow para algumas operações.

Exemplo:

```java
Math.addExact(int x, int y)
```

Arquivo:

```text
MathAddExact.java
```

Código:

```java
public class MathAddExact {
    public static void main(String[] args) {
        int maximo = Integer.MAX_VALUE;

        try {
            int resultado = Math.addExact(maximo, 1);

            System.out.println(resultado);
        } catch (ArithmeticException erro) {
            System.out.println("Overflow detectado na soma.");
        }
    }
}
```

Saída:

```text
Overflow detectado na soma.
```

Esse método é útil quando overflow precisa ser detectado.

---

## Outros métodos exact

Alguns métodos úteis:

```java
Math.addExact
Math.subtractExact
Math.multiplyExact
Math.incrementExact
Math.decrementExact
Math.toIntExact
```

Exemplo:

```java
int valor = Math.toIntExact(100L);
```

Se o `long` não couber em `int`, lança exceção.

Isso é melhor que cast silencioso quando segurança importa.

---

## Math.toIntExact

Arquivo:

```text
MathToIntExact.java
```

Código:

```java
public class MathToIntExact {
    public static void main(String[] args) {
        long valor = 1000L;

        int convertido = Math.toIntExact(valor);

        System.out.println("Convertido: " + convertido);
    }
}
```

Agora teste com valor grande:

```java
long valor = 3_000_000_000L;
```

O método lança exceção em vez de gerar número errado.

---

## Aplicação em cliente

Arquivo:

```text
ClienteNumeroUtilitario.java
```

Código:

```java
public class ClienteNumeroUtilitario {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", -30);

        System.out.println("Cliente: " + cliente.nome);
        System.out.println("Idade absoluta registrada: " + cliente.idade);
    }

    public static Cliente criarCliente(String nome, int idadeInformada) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;
        cliente.idade = Math.abs(idadeInformada);

        return cliente;
    }
}

class Cliente {
    String nome;
    int idade;
}
```

Esse exemplo é didático para `Math.abs`.

Em regra real, idade negativa deveria ser recusada, não convertida.

Leitura crítica:

```text
Math.abs resolve tecnicamente, mas talvez esconda erro de entrada.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoLimiteDesconto.java
```

Código:

```java
public class ProdutoLimiteDesconto {
    public static void main(String[] args) {
        int descontoSolicitado = 150;

        int descontoAplicado = limitarPercentual(descontoSolicitado);

        System.out.println("Desconto aplicado: " + descontoAplicado);
    }

    public static int limitarPercentual(int percentual) {
        int noMinimoZero = Math.max(percentual, 0);

        return Math.min(noMinimoZero, 100);
    }
}
```

Uso:

```text
Math.max para garantir mínimo;
Math.min para garantir máximo.
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoNumeroAleatorio.java
```

Código:

```java
import java.util.Random;

public class PedidoNumeroAleatorio {
    public static void main(String[] args) {
        Random random = new Random();

        Pedido pedido = criarPedidoTeste(random);

        System.out.println("Pedido: " + pedido.codigo);
        System.out.println("Valor: " + pedido.valorCentavos);
    }

    public static Pedido criarPedidoTeste(Random random) {
        Pedido pedido = new Pedido();

        pedido.codigo = "PED-" + gerarEntre(random, 1000, 9999);
        pedido.valorCentavos = gerarEntre(random, 1000, 10000);

        return pedido;
    }

    public static int gerarEntre(Random random, int minimo, int maximo) {
        int possibilidades = maximo - minimo + 1;

        return random.nextInt(possibilidades) + minimo;
    }
}

class Pedido {
    String codigo;
    int valorCentavos;
}
```

Esse exemplo serve para massa de teste simples.

Não use para código sensível de segurança.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoArredondamento.java
```

Código:

```java
public class PagamentoArredondamento {
    public static void main(String[] args) {
        long valorCentavos = 1000L;
        int parcelas = 3;

        long parcelaArredondada = calcularParcelaArredondada(valorCentavos, parcelas);

        System.out.println("Parcela arredondada: " + parcelaArredondada);
    }

    public static long calcularParcelaArredondada(long valorCentavos, int parcelas) {
        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        double resultado = (double) valorCentavos / parcelas;

        return Math.round(resultado);
    }
}
```

Atenção:

```text
dinheiro real exige cuidado maior;
BigDecimal será estudado na próxima aula.
```

Este exemplo é didático para `Math.round`.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoPaginas.java
```

Código:

```java
public class OrdemServicoPaginas {
    public static void main(String[] args) {
        int totalOrdens = 47;
        int tamanhoPagina = 10;

        int paginas = calcularPaginas(totalOrdens, tamanhoPagina);

        System.out.println("Páginas de OS: " + paginas);
    }

    public static int calcularPaginas(int total, int tamanhoPagina) {
        if (total <= 0) {
            return 0;
        }

        if (tamanhoPagina <= 0) {
            throw new IllegalArgumentException("Tamanho da página deve ser maior que zero.");
        }

        return (int) Math.ceil((double) total / tamanhoPagina);
    }
}
```

Cenário backend comum:

```text
paginação.
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaTentativaAleatoria.java
```

Código:

```java
import java.util.Random;

public class MensageriaTentativaAleatoria {
    public static void main(String[] args) {
        Random random = new Random();

        Mensagem mensagem = criarMensagemTeste(random);

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tentativas: " + mensagem.tentativas);
    }

    public static Mensagem criarMensagemTeste(Random random) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = "Cliente " + gerarEntre(random, 1, 100);
        mensagem.tentativas = gerarEntre(random, 0, 3);

        return mensagem;
    }

    public static int gerarEntre(Random random, int minimo, int maximo) {
        if (minimo > maximo) {
            throw new IllegalArgumentException("Mínimo não pode ser maior que máximo.");
        }

        return random.nextInt(maximo - minimo + 1) + minimo;
    }
}

class Mensagem {
    String cliente;
    int tentativas;
}
```

Uso didático:

```text
gerar mensagens de teste com tentativas variáveis.
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaCodigoAleatorio.java
```

Código:

```java
import java.util.Random;

public class AuditoriaCodigoAleatorio {
    public static void main(String[] args) {
        Random random = new Random(123);

        RegistroAuditoria registro = criarRegistroTeste(random);

        System.out.println("Código: " + registro.codigo);
        System.out.println("Usuário: " + registro.usuario);
    }

    public static RegistroAuditoria criarRegistroTeste(Random random) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.codigo = "AUD-" + gerarEntre(random, 100000, 999999);
        registro.usuario = "usuario" + gerarEntre(random, 1, 10);

        return registro;
    }

    public static int gerarEntre(Random random, int minimo, int maximo) {
        return random.nextInt(maximo - minimo + 1) + minimo;
    }
}

class RegistroAuditoria {
    String codigo;
    String usuario;
}
```

Usamos seed fixa:

```java
new Random(123)
```

para deixar a sequência reproduzível em teste.

---

## Refatoração: centralizar geração aleatória

Código repetido:

```java
int codigo = random.nextInt(9000) + 1000;
int tentativa = random.nextInt(4);
int usuario = random.nextInt(10) + 1;
```

Refatoração:

```java
public static int gerarEntre(Random random, int minimo, int maximo) {
    if (random == null) {
        throw new IllegalArgumentException("Random é obrigatório.");
    }

    if (minimo > maximo) {
        throw new IllegalArgumentException("Mínimo não pode ser maior que máximo.");
    }

    return random.nextInt(maximo - minimo + 1) + minimo;
}
```

Benefícios:

```text
menos repetição;
menos erro de faixa;
mais legível;
mais fácil testar.
```

---

## Refatoração: escolher arredondamento com regra

Código ruim:

```java
int valor = (int) media;
```

Refatoração conforme regra:

```java
long arredondado = Math.round(media);
double paraBaixo = Math.floor(media);
double paraCima = Math.ceil(media);
```

Pergunta correta:

```text
a regra manda arredondar para o mais próximo, para baixo ou para cima?
```

Não escolha o método sem entender a regra.

---

## Erros comuns

### Erro 1 — Usar cast achando que arredonda

Cast trunca.

Use `Math.round`, `floor` ou `ceil` conforme regra.

---

### Erro 2 — Confundir floor e ceil

`floor` desce.

`ceil` sobe.

---

### Erro 3 — Esquecer que nextInt(bound) exclui o bound

```java
random.nextInt(10)
```

gera `0` a `9`, não `0` a `10`.

---

### Erro 4 — Gerar faixa errada

Para 1 a 10:

```java
random.nextInt(10) + 1
```

---

### Erro 5 — Usar Random para segurança

Não use `Random` para senha, token ou criptografia.

---

### Erro 6 — Usar aleatório em teste automatizado sem controle

Sem seed, pode ficar difícil reproduzir falha.

---

### Erro 7 — Ignorar overflow

`Integer.MAX_VALUE + 1` vira negativo.

---

### Erro 8 — Usar Math.abs para corrigir dado inválido

Idade `-30` não deveria virar `30` sem regra.

---

### Erro 9 — Usar double para dinheiro real sem cuidado

`BigDecimal` será estudado na próxima aula.

---

### Erro 10 — Usar Math.pow para inteiro sem perceber retorno double

`Math.pow` retorna `double`.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugMathRandom {
    public static void main(String[] args) {
        double valor = 10.75;

        long round = Math.round(valor);
        double floor = Math.floor(valor);
        double ceil = Math.ceil(valor);

        System.out.println(round);
        System.out.println(floor);
        System.out.println(ceil);
    }
}
```

Coloque breakpoint em:

```java
long round = Math.round(valor);
```

Observe os valores.

Depois debugue:

```java
Random random = new Random(123);
int numero = random.nextInt(10) + 1;
```

Observe:

```text
bound 10;
resultado base 0 a 9;
resultado final 1 a 10.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-071-math-random-numeros-utilitarios
cd labs\m2\aula-071-math-random-numeros-utilitarios
```

Crie arquivos:

```text
Main.java
MathRoundExemplo.java
MathFloorExemplo.java
MathCeilExemplo.java
CalculoPaginas.java
CalculoPaginasInteiro.java
MathAbsExemplo.java
MathMaxMinExemplo.java
LimitarValor.java
MathPowExemplo.java
MathSqrtExemplo.java
MathRandomExemplo.java
InteiroComMathRandom.java
RandomBasico.java
RandomUmADez.java
RandomFaixa.java
RandomComSeed.java
SorteioStatus.java
SorteioStatusArray.java
LimitesNumericos.java
OverflowInteiro.java
MathAddExact.java
MathToIntExact.java
ClienteNumeroUtilitario.java
ProdutoLimiteDesconto.java
PedidoNumeroAleatorio.java
PagamentoArredondamento.java
OrdemServicoPaginas.java
MensageriaTentativaAleatoria.java
AuditoriaCodigoAleatorio.java
DebugMathRandom.java
ErroCastArredondamento.java
ErroNextIntLimite.java
ErroOverflowInteiro.java
ErroRandomSenha.java
ErroAbsEscondeProblema.java
README.md
```

Compile:

```powershell
javac Main.java
javac MathRoundExemplo.java
javac MathFloorExemplo.java
javac MathCeilExemplo.java
javac CalculoPaginas.java
javac CalculoPaginasInteiro.java
javac MathAbsExemplo.java
javac MathMaxMinExemplo.java
javac LimitarValor.java
javac MathPowExemplo.java
javac MathSqrtExemplo.java
javac MathRandomExemplo.java
javac InteiroComMathRandom.java
javac RandomBasico.java
javac RandomUmADez.java
javac RandomFaixa.java
javac RandomComSeed.java
javac SorteioStatus.java
javac SorteioStatusArray.java
javac LimitesNumericos.java
javac OverflowInteiro.java
javac MathAddExact.java
javac MathToIntExact.java
javac ClienteNumeroUtilitario.java
javac ProdutoLimiteDesconto.java
javac PedidoNumeroAleatorio.java
javac PagamentoArredondamento.java
javac OrdemServicoPaginas.java
javac MensageriaTentativaAleatoria.java
javac AuditoriaCodigoAleatorio.java
javac DebugMathRandom.java
javac ErroCastArredondamento.java
javac ErroNextIntLimite.java
javac ErroOverflowInteiro.java
javac ErroRandomSenha.java
javac ErroAbsEscondeProblema.java
```

Execute:

```powershell
java Main
java MathRoundExemplo
java MathFloorExemplo
java MathCeilExemplo
java CalculoPaginas
java CalculoPaginasInteiro
java MathAbsExemplo
java MathMaxMinExemplo
java LimitarValor
java MathPowExemplo
java MathSqrtExemplo
java MathRandomExemplo
java InteiroComMathRandom
java RandomBasico
java RandomUmADez
java RandomFaixa
java RandomComSeed
java SorteioStatus
java SorteioStatusArray
java LimitesNumericos
java OverflowInteiro
java MathAddExact
java MathToIntExact
java ClienteNumeroUtilitario
java ProdutoLimiteDesconto
java PedidoNumeroAleatorio
java PagamentoArredondamento
java OrdemServicoPaginas
java MensageriaTentativaAleatoria
java AuditoriaCodigoAleatorio
java DebugMathRandom
java ErroCastArredondamento
java ErroNextIntLimite
java ErroOverflowInteiro
java ErroRandomSenha
java ErroAbsEscondeProblema
```

Alguns exemplos devem demonstrar comportamento perigoso.

Use para diagnóstico e anotação no diário.

---

## Observações

- Escolher arredondamento conforme regra.
- Não usar cast como arredondamento.
- Não usar Random para senha ou token.
- Usar seed quando teste precisar ser reproduzível.
- BigDecimal será estudado para dinheiro.
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
git add labs/m2/aula-071-math-random-numeros-utilitarios docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 071: pratica Math Random e numeros utilitarios em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar Math;
usar Math.round;
usar Math.floor;
usar Math.ceil;
diferenciar truncamento de arredondamento;
calcular páginas com ceil;
calcular páginas com fórmula inteira;
usar Math.abs;
usar Math.max;
usar Math.min;
limitar valor em faixa;
usar Math.pow;
usar Math.sqrt;
usar Math.random;
usar Random;
usar random.nextInt;
gerar número em faixa inclusiva;
explicar limite exclusivo;
usar seed;
explicar pseudoaleatório;
sortear status;
sortear item de array;
usar Integer.MAX_VALUE;
usar Integer.MIN_VALUE;
provocar overflow;
detectar overflow com Math.addExact;
converter com Math.toIntExact;
explicar por que Random não é para segurança;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar cálculo numérico;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `BigDecimal`.

Não precisa ainda dominar `SecureRandom`.

Não precisa ainda dominar estatística.

Não precisa ainda dominar distribuição aleatória.

Não precisa ainda dominar benchmark.

Não precisa ainda dominar criptografia.

Esses assuntos virão depois.

O objetivo é usar `Math`, `Random` e números utilitários de forma correta, sabendo os limites e as armadilhas.

---

## Fechamento da aula

Hoje estudamos `Math`, `Random` e números utilitários.

A ideia central foi:

```text
Java oferece utilitários prontos para cálculos comuns, mas a escolha do método precisa seguir a regra de negócio.
```

Vimos que:

```text
Math.round arredonda;
Math.floor desce;
Math.ceil sobe;
cast trunca;
Math.abs retorna valor absoluto;
Math.max e Math.min ajudam em limites;
Math.pow calcula potência;
Math.sqrt calcula raiz;
Math.random gera double pseudoaleatório;
Random gera números pseudoaleatórios com métodos mais claros;
nextInt usa limite superior exclusivo;
seed permite reprodução;
limites numéricos ajudam a evitar erros;
overflow pode ser silencioso;
métodos Exact podem detectar overflow.
```

O ponto mais importante é:

```text
não escolha arredondamento, faixa aleatória ou limite numérico no chute; escolha pela regra e valide o comportamento.
```

Na próxima aula, vamos estudar:

```text
BigDecimal desde a base.
```

A próxima aula vai explicar por que `double` não é ideal para dinheiro, como criar `BigDecimal` corretamente, como operar, comparar, controlar escala e aplicar arredondamento seguro.
