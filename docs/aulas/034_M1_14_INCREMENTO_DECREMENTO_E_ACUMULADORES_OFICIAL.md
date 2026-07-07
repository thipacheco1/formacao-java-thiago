# 034 — M1.14 — Incremento, decremento e acumuladores

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Antes de começar:

```powershell
java -version
javac -version
git --version
```

A prática desta aula será feita em:

```text
labs/m1/aula-034-incremento-decremento-acumuladores
```

---

## Onde estamos na formação

Antes desta aula, estudamos:

```text
operadores aritméticos;
operadores relacionais;
operadores lógicos.
```

Agora vamos aprender um padrão muito usado em programação:

```text
contar;
somar;
acumular;
incrementar;
decrementar.
```

Esses conceitos aparecem em:

```text
laços;
arrays;
contagem de itens;
cálculo de total;
quantidade de erros;
tentativas;
paginação;
processamento de listas;
relatórios;
métricas.
```

Mesmo antes de estudar profundamente `for` e `while`, precisamos entender o que significa aumentar, diminuir e acumular valores.

---

## A pergunta central da aula

Como representar estas ações em Java?

```text
somar mais 1;
subtrair 1;
contar quantos itens foram processados;
somar valores de vários pedidos;
contar quantos pagamentos foram aprovados;
contar quantas OS estão atrasadas;
acumular total financeiro;
controlar tentativas de login.
```

A resposta envolve:

```text
++;
--;
+=;
-=;
variáveis contadoras;
variáveis acumuladoras;
totalizadores.
```

---

## Contador

Contador é uma variável usada para contar ocorrências.

Exemplo:

```java
int quantidadePedidos = 0;

quantidadePedidos = quantidadePedidos + 1;
```

Ou de forma mais curta:

```java
quantidadePedidos++;
```

Um contador geralmente anda de 1 em 1.

Exemplos:

```text
quantidade de pedidos;
quantidade de erros;
quantidade de tentativas;
quantidade de itens válidos;
quantidade de mensagens enviadas.
```

---

## Acumulador

Acumulador é uma variável usada para acumular valores.

Exemplo:

```java
BigDecimal total = BigDecimal.ZERO;

total = total.add(new BigDecimal("100.00"));
total = total.add(new BigDecimal("50.00"));
```

Agora `total` representa:

```text
150.00
```

Acumulador não precisa andar de 1 em 1.

Ele soma valores variáveis.

Exemplos:

```text
total de vendas;
total de pagamentos;
soma de notas;
total de estoque;
valor total de pedidos.
```

---

## Totalizador

Totalizador é um tipo de acumulador usado para formar total.

Exemplo com inteiro:

```java
int totalItens = 0;

totalItens += 3;
totalItens += 2;
```

Resultado:

```text
5
```

Exemplo com `BigDecimal`:

```java
BigDecimal totalPedido = BigDecimal.ZERO;

totalPedido = totalPedido.add(new BigDecimal("10.00"));
totalPedido = totalPedido.add(new BigDecimal("20.00"));
```

Resultado:

```text
30.00
```

---

## `++` — incremento

`++` aumenta 1.

Exemplo:

```java
int contador = 0;

contador++;

System.out.println(contador);
```

Saída:

```text
1
```

Equivale a:

```java
contador = contador + 1;
```

Também equivale a:

```java
contador += 1;
```

Use `++` quando a intenção for aumentar uma unidade.

---

## `--` — decremento

`--` diminui 1.

Exemplo:

```java
int tentativasRestantes = 3;

tentativasRestantes--;

System.out.println(tentativasRestantes);
```

Saída:

```text
2
```

Equivale a:

```java
tentativasRestantes = tentativasRestantes - 1;
```

Também equivale a:

```java
tentativasRestantes -= 1;
```

Use `--` quando a intenção for diminuir uma unidade.

---

## `+=` — acumular

`+=` soma um valor na própria variável.

Exemplo:

```java
int total = 0;

total += 10;
total += 5;

System.out.println(total);
```

Saída:

```text
15
```

Equivale a:

```java
total = total + 10;
```

Use `+=` quando quer acumular ou somar um valor.

---

## `-=` — reduzir

`-=` subtrai um valor da própria variável.

Exemplo:

```java
int saldo = 100;

saldo -= 30;

System.out.println(saldo);
```

Saída:

```text
70
```

---

## Pré-incremento e pós-incremento

Java permite:

```java
++contador
contador++
```

Quando usado sozinho, o resultado final é o mesmo:

```java
contador++;
++contador;
```

Ambos aumentam 1.

A diferença aparece quando o incremento participa de outra expressão.

Exemplo:

```java
int numero = 5;
int resultado = numero++;

System.out.println(numero);
System.out.println(resultado);
```

Saída:

```text
6
5
```

Porque `numero++` usa o valor antigo e depois incrementa.

Agora:

```java
int numero = 5;
int resultado = ++numero;

System.out.println(numero);
System.out.println(resultado);
```

Saída:

```text
6
6
```

Porque `++numero` incrementa primeiro e depois usa o novo valor.

Regra da formação:

```text
evite misturar ++ dentro de expressões complexas.
```

Prefira clareza:

```java
contador++;
int resultado = contador;
```

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
IncrementoBasico.java
```

Código:

```java
public class IncrementoBasico {
    public static void main(String[] args) {
        int contador = 0;

        contador++;
        contador++;
        contador--;

        System.out.println("Contador final: " + contador);
    }
}
```

Compile:

```powershell
javac IncrementoBasico.java
```

Execute:

```powershell
java IncrementoBasico
```

Saída:

```text
Contador final: 1
```

---

## Exemplo de contador

Arquivo:

```text
ContadorPedidos.java
```

Código:

```java
public class ContadorPedidos {
    public static void main(String[] args) {
        int pedidosProcessados = 0;

        pedidosProcessados++;
        pedidosProcessados++;
        pedidosProcessados++;

        System.out.println("Pedidos processados: " + pedidosProcessados);
    }
}
```

Aqui, cada `++` representa um pedido processado.

---

## Exemplo de acumulador com int

Arquivo:

```text
AcumuladorItens.java
```

Código:

```java
public class AcumuladorItens {
    public static void main(String[] args) {
        int totalItens = 0;

        totalItens += 3;
        totalItens += 2;
        totalItens += 5;

        System.out.println("Total de itens: " + totalItens);
    }
}
```

Saída:

```text
Total de itens: 10
```

---

## Exemplo de acumulador com BigDecimal

Arquivo:

```text
AcumuladorPagamento.java
```

Código:

```java
import java.math.BigDecimal;

public class AcumuladorPagamento {
    public static void main(String[] args) {
        BigDecimal totalPago = BigDecimal.ZERO;

        totalPago = totalPago.add(new BigDecimal("100.00"));
        totalPago = totalPago.add(new BigDecimal("50.00"));
        totalPago = totalPago.add(new BigDecimal("25.50"));

        System.out.println("Total pago: " + totalPago);
    }
}
```

Importante:

```text
BigDecimal é imutável.
```

Por isso fazemos:

```java
totalPago = totalPago.add(valor);
```

Não basta chamar `add` sem atribuir.

---

## Exemplo aplicado: pedidos aprovados e recusados

Arquivo:

```text
ContagemPedidos.java
```

Código:

```java
public class ContagemPedidos {
    public static void main(String[] args) {
        boolean pedido1Aprovado = true;
        boolean pedido2Aprovado = false;
        boolean pedido3Aprovado = true;

        int aprovados = 0;
        int recusados = 0;

        if (pedido1Aprovado) {
            aprovados++;
        } else {
            recusados++;
        }

        if (pedido2Aprovado) {
            aprovados++;
        } else {
            recusados++;
        }

        if (pedido3Aprovado) {
            aprovados++;
        } else {
            recusados++;
        }

        System.out.println("Aprovados: " + aprovados);
        System.out.println("Recusados: " + recusados);
    }
}
```

Aqui usamos:

```text
if/else;
contador;
incremento.
```

---

## Exemplo aplicado: estoque

Arquivo:

```text
ControleEstoque.java
```

Código:

```java
public class ControleEstoque {
    public static void main(String[] args) {
        int estoque = 10;

        int entrada = 5;
        int saida = 3;

        estoque += entrada;
        estoque -= saida;

        System.out.println("Estoque final: " + estoque);
    }
}
```

---

## Exemplo aplicado: tentativas de login

Arquivo:

```text
TentativasLogin.java
```

Código:

```java
public class TentativasLogin {
    public static void main(String[] args) {
        int tentativasRestantes = 3;

        boolean primeiraTentativaFalhou = true;
        boolean segundaTentativaFalhou = true;

        if (primeiraTentativaFalhou) {
            tentativasRestantes--;
        }

        if (segundaTentativaFalhou) {
            tentativasRestantes--;
        }

        System.out.println("Tentativas restantes: " + tentativasRestantes);
    }
}
```

---

## Exemplo aplicado: OS atrasadas

Arquivo:

```text
ContagemOs.java
```

Código:

```java
import java.time.LocalDate;

public class ContagemOs {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.now();

        LocalDate os1 = hoje.minusDays(1);
        LocalDate os2 = hoje.plusDays(1);
        LocalDate os3 = hoje.minusDays(3);

        int atrasadas = 0;
        int dentroDoPrazo = 0;

        if (os1.isBefore(hoje)) {
            atrasadas++;
        } else {
            dentroDoPrazo++;
        }

        if (os2.isBefore(hoje)) {
            atrasadas++;
        } else {
            dentroDoPrazo++;
        }

        if (os3.isBefore(hoje)) {
            atrasadas++;
        } else {
            dentroDoPrazo++;
        }

        System.out.println("OS atrasadas: " + atrasadas);
        System.out.println("OS dentro do prazo: " + dentroDoPrazo);
    }
}
```

---

## Exemplo aplicado: auditoria de operações

Arquivo:

```text
ContagemAuditoria.java
```

Código:

```java
public class ContagemAuditoria {
    public static void main(String[] args) {
        String operacao1 = "CRIACAO";
        String operacao2 = "EDICAO";
        String operacao3 = "CRIACAO";

        int criacoes = 0;
        int edicoes = 0;
        int exclusoes = 0;

        if ("CRIACAO".equals(operacao1)) {
            criacoes++;
        } else if ("EDICAO".equals(operacao1)) {
            edicoes++;
        } else if ("EXCLUSAO".equals(operacao1)) {
            exclusoes++;
        }

        if ("CRIACAO".equals(operacao2)) {
            criacoes++;
        } else if ("EDICAO".equals(operacao2)) {
            edicoes++;
        } else if ("EXCLUSAO".equals(operacao2)) {
            exclusoes++;
        }

        if ("CRIACAO".equals(operacao3)) {
            criacoes++;
        } else if ("EDICAO".equals(operacao3)) {
            edicoes++;
        } else if ("EXCLUSAO".equals(operacao3)) {
            exclusoes++;
        }

        System.out.println("Criações: " + criacoes);
        System.out.println("Edições: " + edicoes);
        System.out.println("Exclusões: " + exclusoes);
    }
}
```

Esse exemplo tem repetição proposital.

Mais tarde, com laços, isso ficará melhor.

---

## Incremento em laços

Ainda vamos estudar `while`, `do while` e `for`.

Mas incremento aparece muito em laços.

Exemplo conceitual:

```java
int contador = 0;

while (contador < 3) {
    System.out.println(contador);
    contador++;
}
```

Sem o `contador++`, o laço poderia nunca terminar.

Esse é um dos motivos pelos quais incremento é importante.

---

## Erros comuns

### Erro 1 — Esquecer de inicializar contador

Errado:

```java
int total;
total++;
```

Variável local precisa ser inicializada.

Correto:

```java
int total = 0;
total++;
```

### Erro 2 — Confundir contador com acumulador

Contador:

```java
quantidade++;
```

Acumulador:

```java
total += valor;
```

### Erro 3 — Usar `++` em BigDecimal

Errado:

```java
BigDecimal total = BigDecimal.ZERO;
total++;
```

BigDecimal é objeto e não aceita `++`.

Use:

```java
total = total.add(valor);
```

### Erro 4 — Chamar `add` em BigDecimal sem atribuir

Errado:

```java
total.add(new BigDecimal("10.00"));
```

Correto:

```java
total = total.add(new BigDecimal("10.00"));
```

### Erro 5 — Misturar pós-incremento em expressão complexa

Evite:

```java
int resultado = contador++ + ++contador;
```

Prefira clareza.

### Erro 6 — Decrementar sem limite

Pode gerar número negativo quando isso não faz sentido.

---

## Diagnóstico

Quando contador ou acumulador der errado:

```text
1. Verifique valor inicial.
2. Verifique onde incrementa.
3. Verifique se incrementa mais de uma vez.
4. Verifique se esqueceu de incrementar.
5. Verifique se precisava acumular valor, não apenas contar.
6. Verifique se BigDecimal recebeu atribuição após add.
7. Imprima valor antes e depois.
```

Exemplo:

```java
System.out.println("Antes: " + total);
total += 10;
System.out.println("Depois: " + total);
```

---

## Debug recomendado

Use debug em:

```text
ContagemPedidos.java
```

Coloque breakpoint em cada `if`.

Observe:

```text
aprovados antes;
recusados antes;
qual bloco executa;
aprovados depois;
recusados depois.
```

Use debug em:

```text
AcumuladorPagamento.java
```

Observe:

```text
totalPago antes do add;
valor adicionado;
totalPago depois da atribuição.
```

---

## Quebrando de propósito

Faça estes testes:

```text
remova a inicialização de um contador;
troque `aprovados++` por `aprovados--`;
chame `BigDecimal.add` sem atribuir;
misture `contador++` em expressão complexa;
deixe tentativasRestantes ficar negativo.
```

Explique cada erro.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-034-incremento-decremento-acumuladores
cd labs\m1\aula-034-incremento-decremento-acumuladores
```

Crie arquivos:

```text
IncrementoBasico.java
PrePosIncremento.java
ContadorPedidos.java
AcumuladorItens.java
AcumuladorPagamento.java
ContagemPedidos.java
ControleEstoque.java
TentativasLogin.java
ContagemOs.java
ContagemAuditoria.java
ErroContadorSemInicializar.java
ErroBigDecimalSemAtribuir.java
ErroIncrementoComplexo.java
ErroDecrementoSemLimite.java
README.md
```

Compile:

```powershell
javac IncrementoBasico.java
javac PrePosIncremento.java
javac ContadorPedidos.java
javac AcumuladorItens.java
javac AcumuladorPagamento.java
javac ContagemPedidos.java
javac ControleEstoque.java
javac TentativasLogin.java
javac ContagemOs.java
javac ContagemAuditoria.java
```

Execute:

```powershell
java IncrementoBasico
java PrePosIncremento
java ContadorPedidos
java AcumuladorItens
java AcumuladorPagamento
java ContagemPedidos
java ControleEstoque
java TentativasLogin
java ContagemOs
java ContagemAuditoria
```

---

## README recomendado da aula

```markdown
# Aula 034 — Incremento, decremento e acumuladores

## Objetivo

Aprender a contar, incrementar, decrementar e acumular valores em Java.

## Conceitos

- `++` incrementa 1.
- `--` decrementa 1.
- `+=` acumula valor.
- `-=` reduz valor.
- Contador conta ocorrências.
- Acumulador soma valores.
- Totalizador guarda total.
- BigDecimal exige `add` com atribuição.
- Pré e pós-incremento devem ser usados com cuidado.

## Comandos

```powershell
javac IncrementoBasico.java
java IncrementoBasico
javac AcumuladorPagamento.java
java AcumuladorPagamento
```
```

---

## Registro no diário de bordo

```markdown
## Aula 034 — Incremento, decremento e acumuladores

### O que aprendi

Aprendi a usar `++`, `--`, `+=`, `-=` e a diferença entre contador, acumulador e totalizador.

### O que pratiquei

Criei exemplos de pedidos, estoque, tentativas de login, OS atrasadas, auditoria e pagamentos acumulados.

### Conceitos principais

- incremento
- decremento
- contador
- acumulador
- totalizador
- pré-incremento
- pós-incremento
- BigDecimal.add
- valor inicial
- debug de contadores

### Erros que quero evitar

- contador sem inicializar;
- confundir contador com acumulador;
- usar `++` em BigDecimal;
- chamar `add` sem atribuir;
- usar incremento em expressão complexa;
- deixar decremento passar do limite.
```

---

## Commit recomendado

```bash
git status
git add labs/m1/aula-034-incremento-decremento-acumuladores docs/diario-de-bordo.md
git commit -m "Aula 034: pratica incremento decremento e acumuladores"
git status
```

---

## Perguntas de fixação

```text
1. Para que serve `++`?
2. Para que serve `--`?
3. Para que serve `+=`?
4. Para que serve `-=`?
5. O que é contador?
6. O que é acumulador?
7. O que é totalizador?
8. Qual diferença entre contador e acumulador?
9. Qual diferença entre `contador++` e `++contador` em uma expressão?
10. Por que evitar incremento em expressão complexa?
11. Como acumular BigDecimal?
12. Por que BigDecimal.add precisa de atribuição?
13. Como contar pedidos aprovados?
14. Como contar OS atrasadas?
15. Como controlar tentativas restantes?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar incremento;
explicar decremento;
usar `++`;
usar `--`;
usar `+=`;
usar `-=`;
criar contador;
criar acumulador;
criar totalizador;
diferenciar contador de acumulador;
explicar pré e pós-incremento;
evitar incremento confuso;
acumular BigDecimal corretamente;
aplicar em pedidos;
aplicar em estoque;
aplicar em login;
aplicar em OS;
aplicar em auditoria;
debugar contador;
registrar aula no diário;
fazer commit limpo.
```

---

## Fechamento

Incremento, decremento e acumuladores aparecem o tempo todo em programação.

A ideia central é:

```text
programas precisam contar eventos e acumular resultados.
```

Na próxima aula, estudaremos:

```text
If, else if e else.
```
