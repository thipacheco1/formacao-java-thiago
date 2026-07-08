# 049 — M1.29 — Maior, Menor, Soma e Média em Array

## Hoje a aula é sobre gerar resumo numérico

Imagine este array:

```java
int[] valores = {10, 20, 30, 40};
```

Perguntas possíveis:

```text
qual é a soma?
qual é a média?
qual é o maior valor?
qual é o menor valor?
```

Respostas:

```text
soma = 100;
média = 25.0;
maior = 40;
menor = 10.
```

Para chegar nisso, precisamos percorrer o array.

O padrão principal será:

```java
for (int indice = 0; indice < valores.length; indice++) {
    // processa valores[indice]
}
```

Dentro do loop, vamos acumular, comparar e atualizar variáveis.

---

## Por que isso é importante para backend

Backend quase sempre processa coleções de dados.

Mesmo antes de banco, listas e objetos, o raciocínio nasce aqui.

Exemplos reais:

```text
somar valores de pedidos antes de gerar uma cobrança;
calcular média de tempo de atendimento;
achar maior valor de pagamento;
achar menor estoque;
identificar maior volume diário de eventos;
calcular total de tentativas de mensagens;
gerar relatório simples para auditoria;
validar se algum valor ultrapassou limite;
exibir resumo após uma importação.
```

No futuro, esses dados virão de:

```text
banco de dados;
API externa;
arquivo;
mensageria;
requisição HTTP;
consulta paginada;
lista de objetos.
```

Mas o raciocínio é o mesmo:

```text
percorrer;
acumular;
comparar;
gerar resultado.
```

---

## Vocabulário essencial

Termos desta aula:

```text
array;
índice;
elemento;
iteração;
acumulador;
soma;
média;
maior valor;
menor valor;
comparação;
inicialização correta;
relatório final;
total;
quantidade;
divisão decimal;
valor de referência;
primeiro elemento;
array vazio;
resultado derivado;
percorrer;
atualizar.
```

Termos mais importantes:

```text
acumulador -> variável que soma valores ao longo do loop;
maior -> variável que guarda o maior valor encontrado até o momento;
menor -> variável que guarda o menor valor encontrado até o momento;
média -> soma dividida pela quantidade;
inicialização correta -> escolher valor inicial que não distorça o resultado;
relatório final -> exibir os resultados calculados depois do processamento.
```

---

## As quatro operações

Nesta aula, vamos praticar:

### Soma

```java
total += valores[indice];
```

### Média

```java
double media = (double) total / valores.length;
```

### Maior

```java
if (valores[indice] > maior) {
    maior = valores[indice];
}
```

### Menor

```java
if (valores[indice] < menor) {
    menor = valores[indice];
}
```

Essas quatro operações parecem simples, mas exigem atenção.

O maior risco está na inicialização.

---

## Inicialização correta

A grade desta aula cita:

```text
inicialização correta.
```

Isso é essencial.

Para soma, normalmente começamos com:

```java
int total = 0;
```

Porque somar zero não altera o resultado.

Para maior e menor, o melhor padrão inicial é usar o primeiro elemento do array:

```java
int maior = valores[0];
int menor = valores[0];
```

Depois percorremos a partir do índice 1:

```java
for (int indice = 1; indice < valores.length; indice++) {
    // compara
}
```

Por quê?

Porque o primeiro valor é um valor real do array.

Isso evita erros com valores negativos, zeros ou limites artificiais.

---

## Por que não inicializar maior com zero sempre

Imagine:

```java
int[] valores = {-10, -5, -30};
```

Se você fizer:

```java
int maior = 0;
```

e comparar:

```java
if (valores[indice] > maior)
```

nenhum valor será maior que 0.

O programa dirá que o maior é 0.

Mas 0 nem está no array.

O maior correto é:

```text
-5.
```

Por isso, para maior e menor, prefira começar com:

```java
int maior = valores[0];
int menor = valores[0];
```

Essa é a inicialização correta.

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
        int[] valores = {10, 20, 30, 40};

        int soma = 0;
        int maior = valores[0];
        int menor = valores[0];

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];

            if (valores[indice] > maior) {
                maior = valores[indice];
            }

            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        double media = (double) soma / valores.length;

        System.out.println("Soma: " + soma);
        System.out.println("Média: " + media);
        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);
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
Soma: 100
Média: 25.0
Maior: 40
Menor: 10
```

Esse é o exemplo central da aula.

---

## Entendendo o loop

Array:

```java
int[] valores = {10, 20, 30, 40};
```

Estado inicial:

```text
soma = 0
maior = 10
menor = 10
```

Iterações:

```text
índice 0 -> valor 10
soma = 10
maior continua 10
menor continua 10

índice 1 -> valor 20
soma = 30
maior vira 20
menor continua 10

índice 2 -> valor 30
soma = 60
maior vira 30
menor continua 10

índice 3 -> valor 40
soma = 100
maior vira 40
menor continua 10
```

Depois:

```text
media = 100 / 4 = 25.0.
```

Esse acompanhamento mental é muito importante.

---

## Separando soma de maior e menor

Para aprender, podemos separar em exemplos menores.

### Soma

```java
int soma = 0;

for (int indice = 0; indice < valores.length; indice++) {
    soma += valores[indice];
}
```

### Maior

```java
int maior = valores[0];

for (int indice = 1; indice < valores.length; indice++) {
    if (valores[indice] > maior) {
        maior = valores[indice];
    }
}
```

### Menor

```java
int menor = valores[0];

for (int indice = 1; indice < valores.length; indice++) {
    if (valores[indice] < menor) {
        menor = valores[indice];
    }
}
```

Depois juntamos tudo em um único relatório.

---

## Soma em array

Arquivo:

```text
SomaValores.java
```

Código:

```java
public class SomaValores {
    public static void main(String[] args) {
        int[] valores = {5, 10, 15};

        int soma = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];
        }

        System.out.println("Soma: " + soma);
    }
}
```

Saída:

```text
Soma: 30
```

A variável:

```java
soma
```

é o acumulador.

Ela começa em 0 e recebe cada valor.

---

## Média em array

Arquivo:

```text
MediaValores.java
```

Código:

```java
public class MediaValores {
    public static void main(String[] args) {
        int[] valores = {5, 10, 15};

        int soma = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];
        }

        double media = (double) soma / valores.length;

        System.out.println("Média: " + media);
    }
}
```

Saída:

```text
Média: 10.0
```

A média depende de duas coisas:

```text
soma;
quantidade de elementos.
```

Quantidade de elementos:

```java
valores.length
```

---

## Cuidado com divisão inteira

Se fizer:

```java
int media = soma / valores.length;
```

a média será inteira.

Exemplo:

```java
int[] notas = {8, 7, 10, 9};
```

Soma:

```text
34.
```

Quantidade:

```text
4.
```

Média real:

```text
8.5.
```

Mas divisão inteira pode resultar em:

```text
8.
```

Para preservar decimal:

```java
double media = (double) soma / notas.length;
```

Esse cast precisa virar hábito em média decimal.

---

## Maior valor em array

Arquivo:

```text
MaiorValor.java
```

Código:

```java
public class MaiorValor {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int maior = valores[0];

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
            }
        }

        System.out.println("Maior valor: " + maior);
    }
}
```

Saída:

```text
Maior valor: 99
```

Começamos em:

```java
valores[0]
```

e comparamos os demais.

---

## Menor valor em array

Arquivo:

```text
MenorValor.java
```

Código:

```java
public class MenorValor {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int menor = valores[0];

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        System.out.println("Menor valor: " + menor);
    }
}
```

Saída:

```text
Menor valor: 7
```

A lógica é quase igual ao maior.

Só muda o operador:

```java
<
```

em vez de:

```java
>
```

---

## Por que o maior e menor podem começar no índice 1

Quando fazemos:

```java
int maior = valores[0];
int menor = valores[0];
```

o índice 0 já foi usado como referência inicial.

Então podemos começar o loop no índice 1:

```java
for (int indice = 1; indice < valores.length; indice++)
```

Isso evita comparar o primeiro elemento com ele mesmo.

Mas também é válido começar em 0.

Exemplo:

```java
for (int indice = 0; indice < valores.length; indice++)
```

Vai funcionar.

Só fará uma comparação a mais.

Para iniciante, os dois estilos aparecem.

O mais importante é entender a inicialização.

---

## Tudo junto em um relatório

Arquivo:

```text
RelatorioArray.java
```

Código:

```java
public class RelatorioArray {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int soma = 0;
        int maior = valores[0];
        int menor = valores[0];

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];

            if (valores[indice] > maior) {
                maior = valores[indice];
            }

            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        double media = (double) soma / valores.length;

        System.out.println("Relatório");
        System.out.println("Quantidade: " + valores.length);
        System.out.println("Soma: " + soma);
        System.out.println("Média: " + media);
        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);
    }
}
```

Saída:

```text
Relatório
Quantidade: 5
Soma: 184
Média: 36.8
Maior: 99
Menor: 7
```

Esse é um relatório final simples.

---

## Relatório final

A grade cita:

```text
relatório final.
```

Relatório final significa exibir o resultado do processamento de forma organizada.

Ruim:

```text
184
36.8
99
7
```

Melhor:

```text
Quantidade: 5
Soma: 184
Média: 36.8
Maior: 99
Menor: 7
```

Melhor ainda:

```text
Relatório de valores
Quantidade analisada: 5
Total acumulado: 184
Média calculada: 36.8
Maior valor encontrado: 99
Menor valor encontrado: 7
```

Relatório final deve deixar claro:

```text
o que foi calculado;
qual é o valor;
qual foi a base analisada.
```

---

## Array vazio e proteção

Se o array estiver vazio:

```java
int[] valores = {};
```

não podemos fazer:

```java
int maior = valores[0];
```

Isso dá erro.

Antes de calcular maior, menor e média, precisamos garantir que há elementos.

Exemplo:

```java
if (valores.length == 0) {
    System.out.println("Não há valores para analisar");
} else {
    // calcula
}
```

Nesta aula, muitos exemplos usam arrays preenchidos.

Mas em código seguro, array vazio precisa ser considerado.

---

## Relatório com proteção para array vazio

Arquivo:

```text
RelatorioComArrayVazio.java
```

Código:

```java
public class RelatorioComArrayVazio {
    public static void main(String[] args) {
        int[] valores = {};

        if (valores.length == 0) {
            System.out.println("Não há valores para analisar");
        } else {
            int soma = 0;
            int maior = valores[0];
            int menor = valores[0];

            for (int indice = 0; indice < valores.length; indice++) {
                soma += valores[indice];

                if (valores[indice] > maior) {
                    maior = valores[indice];
                }

                if (valores[indice] < menor) {
                    menor = valores[indice];
                }
            }

            double media = (double) soma / valores.length;

            System.out.println("Soma: " + soma);
            System.out.println("Média: " + media);
            System.out.println("Maior: " + maior);
            System.out.println("Menor: " + menor);
        }
    }
}
```

Saída:

```text
Não há valores para analisar
```

Esse é um padrão seguro.

---

## Exemplo com valores negativos

Arquivo:

```text
RelatorioComNegativos.java
```

Código:

```java
public class RelatorioComNegativos {
    public static void main(String[] args) {
        int[] valores = {-10, -5, -30};

        int soma = 0;
        int maior = valores[0];
        int menor = valores[0];

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];

            if (valores[indice] > maior) {
                maior = valores[indice];
            }

            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        double media = (double) soma / valores.length;

        System.out.println("Soma: " + soma);
        System.out.println("Média: " + media);
        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);
    }
}
```

Saída:

```text
Soma: -45
Média: -15.0
Maior: -5
Menor: -30
```

Esse exemplo prova por que inicializar maior com 0 seria errado.

---

## Exemplo com valores em long

Para valores monetários em centavos, usamos `long`.

Arquivo:

```text
RelatorioPagamentosCentavos.java
```

Código:

```java
public class RelatorioPagamentosCentavos {
    public static void main(String[] args) {
        long[] pagamentosCentavos = {1000L, 2500L, 5000L, 7500L};

        long somaCentavos = 0L;
        long maiorPagamento = pagamentosCentavos[0];
        long menorPagamento = pagamentosCentavos[0];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            somaCentavos += pagamentosCentavos[indice];

            if (pagamentosCentavos[indice] > maiorPagamento) {
                maiorPagamento = pagamentosCentavos[indice];
            }

            if (pagamentosCentavos[indice] < menorPagamento) {
                menorPagamento = pagamentosCentavos[indice];
            }
        }

        double mediaCentavos = (double) somaCentavos / pagamentosCentavos.length;

        System.out.println("Total em centavos: " + somaCentavos);
        System.out.println("Média em centavos: " + mediaCentavos);
        System.out.println("Maior pagamento: " + maiorPagamento);
        System.out.println("Menor pagamento: " + menorPagamento);
    }
}
```

Esse padrão será comum para valores financeiros até estudarmos `BigDecimal`.

---

## Exemplo com double

Para notas ou tempos, podemos usar `double`.

Arquivo:

```text
RelatorioNotasDouble.java
```

Código:

```java
public class RelatorioNotasDouble {
    public static void main(String[] args) {
        double[] notas = {8.5, 7.0, 10.0, 9.5};

        double soma = 0.0;
        double maior = notas[0];
        double menor = notas[0];

        for (int indice = 0; indice < notas.length; indice++) {
            soma += notas[indice];

            if (notas[indice] > maior) {
                maior = notas[indice];
            }

            if (notas[indice] < menor) {
                menor = notas[indice];
            }
        }

        double media = soma / notas.length;

        System.out.println("Soma: " + soma);
        System.out.println("Média: " + media);
        System.out.println("Maior nota: " + maior);
        System.out.println("Menor nota: " + menor);
    }
}
```

Para dinheiro, não use `double`.

Para notas e horas didáticas, pode ser usado nesta fase.

---

## Exemplo aplicado: estoque de produtos

Arquivo:

```text
RelatorioEstoqueProdutos.java
```

Código:

```java
public class RelatorioEstoqueProdutos {
    public static void main(String[] args) {
        int[] estoques = {10, 0, 5, 2, 20};

        int totalEstoque = 0;
        int maiorEstoque = estoques[0];
        int menorEstoque = estoques[0];

        for (int indice = 0; indice < estoques.length; indice++) {
            totalEstoque += estoques[indice];

            if (estoques[indice] > maiorEstoque) {
                maiorEstoque = estoques[indice];
            }

            if (estoques[indice] < menorEstoque) {
                menorEstoque = estoques[indice];
            }
        }

        double mediaEstoque = (double) totalEstoque / estoques.length;

        System.out.println("Relatório de estoque");
        System.out.println("Produtos analisados: " + estoques.length);
        System.out.println("Total em estoque: " + totalEstoque);
        System.out.println("Média de estoque: " + mediaEstoque);
        System.out.println("Maior estoque: " + maiorEstoque);
        System.out.println("Menor estoque: " + menorEstoque);
    }
}
```

Esse exemplo mostra relatório de produto.

---

## Exemplo aplicado: pedidos

Arquivo:

```text
RelatorioPedidos.java
```

Código:

```java
public class RelatorioPedidos {
    public static void main(String[] args) {
        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L, 3000L};

        long totalCentavos = 0L;
        long maiorPedido = valoresPedidosCentavos[0];
        long menorPedido = valoresPedidosCentavos[0];

        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            totalCentavos += valoresPedidosCentavos[indice];

            if (valoresPedidosCentavos[indice] > maiorPedido) {
                maiorPedido = valoresPedidosCentavos[indice];
            }

            if (valoresPedidosCentavos[indice] < menorPedido) {
                menorPedido = valoresPedidosCentavos[indice];
            }
        }

        double mediaCentavos = (double) totalCentavos / valoresPedidosCentavos.length;

        System.out.println("Relatório de pedidos");
        System.out.println("Quantidade de pedidos: " + valoresPedidosCentavos.length);
        System.out.println("Total em centavos: " + totalCentavos);
        System.out.println("Média em centavos: " + mediaCentavos);
        System.out.println("Maior pedido: " + maiorPedido);
        System.out.println("Menor pedido: " + menorPedido);
    }
}
```

Esse exemplo aplica soma, média, maior e menor em pedidos.

---

## Exemplo aplicado: pagamentos

Arquivo:

```text
RelatorioPagamentos.java
```

Código:

```java
public class RelatorioPagamentos {
    public static void main(String[] args) {
        long[] pagamentosCentavos = {3000L, 1000L, 7000L, 2500L};

        long totalPago = 0L;
        long maiorPagamento = pagamentosCentavos[0];
        long menorPagamento = pagamentosCentavos[0];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            totalPago += pagamentosCentavos[indice];

            if (pagamentosCentavos[indice] > maiorPagamento) {
                maiorPagamento = pagamentosCentavos[indice];
            }

            if (pagamentosCentavos[indice] < menorPagamento) {
                menorPagamento = pagamentosCentavos[indice];
            }
        }

        double mediaPagamento = (double) totalPago / pagamentosCentavos.length;

        System.out.println("Relatório de pagamentos");
        System.out.println("Total pago: " + totalPago);
        System.out.println("Média de pagamento: " + mediaPagamento);
        System.out.println("Maior pagamento: " + maiorPagamento);
        System.out.println("Menor pagamento: " + menorPagamento);
    }
}
```

Esse é um cenário financeiro simplificado.

---

## Exemplo aplicado: atividades por OS

Arquivo:

```text
RelatorioAtividadesOs.java
```

Código:

```java
public class RelatorioAtividadesOs {
    public static void main(String[] args) {
        int[] atividadesPorOs = {2, 4, 1, 3, 6};

        int totalAtividades = 0;
        int maiorQuantidade = atividadesPorOs[0];
        int menorQuantidade = atividadesPorOs[0];

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            totalAtividades += atividadesPorOs[indice];

            if (atividadesPorOs[indice] > maiorQuantidade) {
                maiorQuantidade = atividadesPorOs[indice];
            }

            if (atividadesPorOs[indice] < menorQuantidade) {
                menorQuantidade = atividadesPorOs[indice];
            }
        }

        double mediaAtividades = (double) totalAtividades / atividadesPorOs.length;

        System.out.println("Relatório de atividades por OS");
        System.out.println("OS analisadas: " + atividadesPorOs.length);
        System.out.println("Total de atividades: " + totalAtividades);
        System.out.println("Média de atividades por OS: " + mediaAtividades);
        System.out.println("Maior quantidade em uma OS: " + maiorQuantidade);
        System.out.println("Menor quantidade em uma OS: " + menorQuantidade);
    }
}
```

Esse exemplo se aproxima de relatórios operacionais.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
RelatorioMensageria.java
```

Código:

```java
public class RelatorioMensageria {
    public static void main(String[] args) {
        int[] tentativasPorMensagem = {1, 3, 2, 1, 4};

        int totalTentativas = 0;
        int maiorTentativa = tentativasPorMensagem[0];
        int menorTentativa = tentativasPorMensagem[0];

        for (int indice = 0; indice < tentativasPorMensagem.length; indice++) {
            totalTentativas += tentativasPorMensagem[indice];

            if (tentativasPorMensagem[indice] > maiorTentativa) {
                maiorTentativa = tentativasPorMensagem[indice];
            }

            if (tentativasPorMensagem[indice] < menorTentativa) {
                menorTentativa = tentativasPorMensagem[indice];
            }
        }

        double mediaTentativas = (double) totalTentativas / tentativasPorMensagem.length;

        System.out.println("Relatório de mensageria");
        System.out.println("Mensagens analisadas: " + tentativasPorMensagem.length);
        System.out.println("Total de tentativas: " + totalTentativas);
        System.out.println("Média de tentativas: " + mediaTentativas);
        System.out.println("Maior número de tentativas: " + maiorTentativa);
        System.out.println("Menor número de tentativas: " + menorTentativa);
    }
}
```

Esse exemplo mostra análise de tentativas de envio.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
RelatorioAuditoria.java
```

Código:

```java
public class RelatorioAuditoria {
    public static void main(String[] args) {
        int[] eventosPorDia = {5, 8, 3, 10, 4};

        int totalEventos = 0;
        int maiorVolume = eventosPorDia[0];
        int menorVolume = eventosPorDia[0];

        for (int indice = 0; indice < eventosPorDia.length; indice++) {
            totalEventos += eventosPorDia[indice];

            if (eventosPorDia[indice] > maiorVolume) {
                maiorVolume = eventosPorDia[indice];
            }

            if (eventosPorDia[indice] < menorVolume) {
                menorVolume = eventosPorDia[indice];
            }
        }

        double mediaEventos = (double) totalEventos / eventosPorDia.length;

        System.out.println("Relatório de auditoria");
        System.out.println("Dias analisados: " + eventosPorDia.length);
        System.out.println("Total de eventos: " + totalEventos);
        System.out.println("Média diária: " + mediaEventos);
        System.out.println("Maior volume diário: " + maiorVolume);
        System.out.println("Menor volume diário: " + menorVolume);
    }
}
```

Esse exemplo aplica o padrão em volume de eventos.

---

## Exemplo aplicado: SLA

Arquivo:

```text
RelatorioSla.java
```

Código:

```java
public class RelatorioSla {
    public static void main(String[] args) {
        double[] temposHoras = {2.0, 3.5, 6.0, 1.5};

        double totalHoras = 0.0;
        double maiorTempo = temposHoras[0];
        double menorTempo = temposHoras[0];

        for (int indice = 0; indice < temposHoras.length; indice++) {
            totalHoras += temposHoras[indice];

            if (temposHoras[indice] > maiorTempo) {
                maiorTempo = temposHoras[indice];
            }

            if (temposHoras[indice] < menorTempo) {
                menorTempo = temposHoras[indice];
            }
        }

        double mediaHoras = totalHoras / temposHoras.length;

        System.out.println("Relatório de SLA");
        System.out.println("Atendimentos analisados: " + temposHoras.length);
        System.out.println("Total de horas: " + totalHoras);
        System.out.println("Média de horas: " + mediaHoras);
        System.out.println("Maior tempo: " + maiorTempo);
        System.out.println("Menor tempo: " + menorTempo);
    }
}
```

Esse exemplo usa `double[]` para tempos.

---

## Lendo array do usuário e gerando relatório

Arquivo:

```text
RelatorioValoresUsuario.java
```

Código:

```java
import java.util.Scanner;

public class RelatorioValoresUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos valores deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        int[] valores = new int[quantidade];

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println("Digite o valor " + (indice + 1) + ":");
            valores[indice] = scanner.nextInt();
        }

        int soma = 0;
        int maior = valores[0];
        int menor = valores[0];

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];

            if (valores[indice] > maior) {
                maior = valores[indice];
            }

            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        double media = (double) soma / valores.length;

        System.out.println("Relatório final");
        System.out.println("Quantidade: " + valores.length);
        System.out.println("Soma: " + soma);
        System.out.println("Média: " + media);
        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);

        scanner.close();
    }
}
```

Esse exemplo junta:

```text
tamanho definido pelo usuário;
preenchimento;
soma;
média;
maior;
menor;
relatório final.
```

---

## Lendo pagamentos do usuário

Arquivo:

```text
RelatorioPagamentosUsuario.java
```

Código:

```java
import java.util.Scanner;

public class RelatorioPagamentosUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos pagamentos deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        long[] pagamentosCentavos = new long[quantidade];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            System.out.println("Digite o pagamento " + (indice + 1) + " em centavos:");
            pagamentosCentavos[indice] = scanner.nextLong();

            while (pagamentosCentavos[indice] <= 0) {
                System.out.println("Valor inválido. Digite valor maior que zero:");
                pagamentosCentavos[indice] = scanner.nextLong();
            }
        }

        long total = 0L;
        long maior = pagamentosCentavos[0];
        long menor = pagamentosCentavos[0];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            total += pagamentosCentavos[indice];

            if (pagamentosCentavos[indice] > maior) {
                maior = pagamentosCentavos[indice];
            }

            if (pagamentosCentavos[indice] < menor) {
                menor = pagamentosCentavos[indice];
            }
        }

        double media = (double) total / pagamentosCentavos.length;

        System.out.println("Relatório de pagamentos");
        System.out.println("Total: " + total);
        System.out.println("Média: " + media);
        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);

        scanner.close();
    }
}
```

Aqui validamos cada pagamento.

Isso evita total e média com valores inválidos.

---

## Contando valores acima da média

Depois de calcular média, podemos fazer outro loop.

Arquivo:

```text
ValoresAcimaDaMedia.java
```

Código:

```java
public class ValoresAcimaDaMedia {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30, 40};

        int soma = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            soma += valores[indice];
        }

        double media = (double) soma / valores.length;

        int acimaDaMedia = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] > media) {
                acimaDaMedia++;
            }
        }

        System.out.println("Média: " + media);
        System.out.println("Valores acima da média: " + acimaDaMedia);
    }
}
```

Esse exemplo mostra um padrão importante:

```text
primeiro calcula a média;
depois usa a média para analisar os valores.
```

Nem tudo precisa estar no mesmo loop.

Às vezes precisamos de duas passagens.

---

## Relatório com contagem de maiores que limite

Arquivo:

```text
ValoresAcimaDoLimite.java
```

Código:

```java
public class ValoresAcimaDoLimite {
    public static void main(String[] args) {
        int[] valores = {10, 50, 30, 80, 20};

        int limite = 40;
        int quantidadeAcima = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] > limite) {
                quantidadeAcima++;
            }
        }

        System.out.println("Limite: " + limite);
        System.out.println("Quantidade acima do limite: " + quantidadeAcima);
    }
}
```

Esse padrão aparece em:

```text
SLA acima do limite;
pagamento acima de alçada;
estoque abaixo ou acima de limite;
mensagem com muitas tentativas;
evento acima de volume esperado.
```

---

## Maior e menor com posição

Às vezes queremos saber não só o maior ou menor valor, mas também onde ele está.

Arquivo:

```text
MaiorMenorComPosicao.java
```

Código:

```java
public class MaiorMenorComPosicao {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int maior = valores[0];
        int menor = valores[0];
        int indiceMaior = 0;
        int indiceMenor = 0;

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
                indiceMaior = indice;
            }

            if (valores[indice] < menor) {
                menor = valores[indice];
                indiceMenor = indice;
            }
        }

        System.out.println("Maior: " + maior + " na posição " + (indiceMaior + 1));
        System.out.println("Menor: " + menor + " na posição " + (indiceMenor + 1));
    }
}
```

Esse padrão é útil para relatório.

Além do valor, sabemos a posição.

---

## Empate no maior ou menor

Imagine:

```java
int[] valores = {10, 50, 20, 50};
```

O maior é 50.

Mas aparece duas vezes.

Com esta lógica:

```java
if (valores[indice] > maior)
```

guardamos a primeira ocorrência do maior.

Se quiser guardar a última ocorrência, usaria:

```java
if (valores[indice] >= maior)
```

Mas cuidado.

Use `>` quando quiser manter a primeira ocorrência.

Use `>=` quando quiser atualizar também em empate.

A escolha depende da regra.

---

## Exemplo de empate no maior

Arquivo:

```text
EmpateMaiorValor.java
```

Código:

```java
public class EmpateMaiorValor {
    public static void main(String[] args) {
        int[] valores = {10, 50, 20, 50};

        int maior = valores[0];
        int indiceMaior = 0;

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
                indiceMaior = indice;
            }
        }

        System.out.println("Maior: " + maior);
        System.out.println("Primeira posição do maior: " + (indiceMaior + 1));
    }
}
```

Saída:

```text
Maior: 50
Primeira posição do maior: 2
```

Se mudar para `>=`, a posição será 4.

---

## Relatório final profissional em console

Um relatório final deve ter organização.

Exemplo:

```text
====================================
RELATÓRIO DE PAGAMENTOS
====================================
Quantidade analisada: 4
Total em centavos: 16000
Média em centavos: 4000.0
Maior pagamento: 7500
Menor pagamento: 1000
====================================
```

Código simples:

```java
System.out.println("====================================");
System.out.println("RELATÓRIO DE PAGAMENTOS");
System.out.println("====================================");
System.out.println("Quantidade analisada: " + pagamentos.length);
System.out.println("Total em centavos: " + total);
System.out.println("Média em centavos: " + media);
System.out.println("Maior pagamento: " + maior);
System.out.println("Menor pagamento: " + menor);
System.out.println("====================================");
```

Organização também faz parte de qualidade.

---

## Erros comuns

### Erro 1 — Inicializar maior com zero

Pode dar erro com arrays negativos.

Errado:

```java
int maior = 0;
```

Melhor:

```java
int maior = valores[0];
```

---

### Erro 2 — Inicializar menor com zero

Pode dar erro quando todos os valores são positivos.

Exemplo:

```java
int[] valores = {10, 20, 30};
int menor = 0;
```

O programa diria que o menor é 0, mas 0 nem está no array.

Melhor:

```java
int menor = valores[0];
```

---

### Erro 3 — Acessar valores[0] em array vazio

Se o array pode estar vazio, proteja:

```java
if (valores.length == 0) {
    System.out.println("Sem valores");
} else {
    // calcula
}
```

---

### Erro 4 — Usar `<= valores.length`

Errado:

```java
for (int indice = 0; indice <= valores.length; indice++)
```

Certo:

```java
for (int indice = 0; indice < valores.length; indice++)
```

---

### Erro 5 — Calcular média dentro do loop sem necessidade

Ruim para iniciante:

```java
for (...) {
    soma += valores[indice];
    media = soma / valores.length;
}
```

Melhor:

```java
for (...) {
    soma += valores[indice];
}

media = (double) soma / valores.length;
```

Calcule a média depois da soma completa.

---

### Erro 6 — Esquecer cast para double

Errado:

```java
double media = soma / valores.length;
```

Se `soma` e `length` são inteiros, pode ocorrer divisão inteira antes de virar double.

Melhor:

```java
double media = (double) soma / valores.length;
```

---

### Erro 7 — Somar índice em vez de valor

Errado:

```java
soma += indice;
```

Certo:

```java
soma += valores[indice];
```

---

### Erro 8 — Comparar índice em vez de valor

Errado:

```java
if (indice > maior)
```

Certo:

```java
if (valores[indice] > maior)
```

---

### Erro 9 — Não atualizar posição do maior ou menor

Se você quer mostrar posição, precisa atualizar junto:

```java
maior = valores[indice];
indiceMaior = indice;
```

---

### Erro 10 — Não organizar relatório final

Imprimir números soltos dificulta análise.

Mostre rótulos claros.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-049-maior-menor-soma-media-array
cd labs\m1\aula-049-maior-menor-soma-media-array
```

Crie arquivos:

```text
Main.java
SomaValores.java
MediaValores.java
MaiorValor.java
MenorValor.java
RelatorioArray.java
RelatorioComArrayVazio.java
RelatorioComNegativos.java
RelatorioPagamentosCentavos.java
RelatorioNotasDouble.java
RelatorioEstoqueProdutos.java
RelatorioPedidos.java
RelatorioPagamentos.java
RelatorioAtividadesOs.java
RelatorioMensageria.java
RelatorioAuditoria.java
RelatorioSla.java
RelatorioValoresUsuario.java
RelatorioPagamentosUsuario.java
ValoresAcimaDaMedia.java
ValoresAcimaDoLimite.java
MaiorMenorComPosicao.java
EmpateMaiorValor.java
ErroMaiorInicialZero.java
ErroMenorInicialZero.java
ErroMediaInteira.java
ErroSomarIndice.java
ErroArrayVazio.java
```

Compile:

```powershell
javac Main.java
javac SomaValores.java
javac MediaValores.java
javac MaiorValor.java
javac MenorValor.java
javac RelatorioArray.java
javac RelatorioComArrayVazio.java
javac RelatorioComNegativos.java
javac RelatorioPagamentosCentavos.java
javac RelatorioNotasDouble.java
javac RelatorioEstoqueProdutos.java
javac RelatorioPedidos.java
javac RelatorioPagamentos.java
javac RelatorioAtividadesOs.java
javac RelatorioMensageria.java
javac RelatorioAuditoria.java
javac RelatorioSla.java
javac RelatorioValoresUsuario.java
javac RelatorioPagamentosUsuario.java
javac ValoresAcimaDaMedia.java
javac ValoresAcimaDoLimite.java
javac MaiorMenorComPosicao.java
javac EmpateMaiorValor.java
javac ErroMaiorInicialZero.java
javac ErroMenorInicialZero.java
javac ErroMediaInteira.java
javac ErroSomarIndice.java
javac ErroArrayVazio.java
```

Execute:

```powershell
java Main
java SomaValores
java MediaValores
java MaiorValor
java MenorValor
java RelatorioArray
java RelatorioComArrayVazio
java RelatorioComNegativos
java RelatorioPagamentosCentavos
java RelatorioNotasDouble
java RelatorioEstoqueProdutos
java RelatorioPedidos
java RelatorioPagamentos
java RelatorioAtividadesOs
java RelatorioMensageria
java RelatorioAuditoria
java RelatorioSla
java RelatorioValoresUsuario
java RelatorioPagamentosUsuario
java ValoresAcimaDaMedia
java ValoresAcimaDoLimite
java MaiorMenorComPosicao
java EmpateMaiorValor
java ErroMaiorInicialZero
java ErroMenorInicialZero
java ErroMediaInteira
java ErroSomarIndice
java ErroArrayVazio
```

Alguns arquivos de erro proposital podem exibir resultado errado ou quebrar.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroMaiorInicialZero.java`

```java
public class ErroMaiorInicialZero {
    public static void main(String[] args) {
        int[] valores = {-10, -5, -30};

        int maior = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
            }
        }

        System.out.println("Maior calculado errado: " + maior);
    }
}
```

Depois corrija:

```java
int maior = valores[0];
```

Objetivo:

```text
entender inicialização correta do maior valor.
```

---

## Arquivo sugerido: `ErroMenorInicialZero.java`

```java
public class ErroMenorInicialZero {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int menor = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        System.out.println("Menor calculado errado: " + menor);
    }
}
```

Depois corrija:

```java
int menor = valores[0];
```

Objetivo:

```text
entender inicialização correta do menor valor.
```

---

## Arquivo sugerido: `ErroSomarIndice.java`

```java
public class ErroSomarIndice {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int soma = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            soma += indice;
        }

        System.out.println("Soma errada: " + soma);
    }
}
```

Depois corrija:

```java
soma += valores[indice];
```

Objetivo:

```text
diferenciar índice e valor armazenado.
```

---

## Debug recomendado

Use debug neste trecho:

```java
int[] valores = {15, 40, 7};

int soma = 0;
int maior = valores[0];
int menor = valores[0];

for (int indice = 0; indice < valores.length; indice++) {
    soma += valores[indice];

    if (valores[indice] > maior) {
        maior = valores[indice];
    }

    if (valores[indice] < menor) {
        menor = valores[indice];
    }
}
```

Observe em cada volta:

```text
indice;
valores[indice];
soma;
maior;
menor.
```

Acompanhe:

```text
índice 0 -> valor 15;
índice 1 -> valor 40;
índice 2 -> valor 7.
```

Veja quando maior muda.

Veja quando menor muda.

Esse debug fixa a aula.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-049-maior-menor-soma-media-array docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 049: pratica maior menor soma e media em array"
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
explicar soma em array;
explicar média em array;
explicar maior valor em array;
explicar menor valor em array;
usar acumulador;
inicializar soma com zero;
inicializar maior com valores[0];
inicializar menor com valores[0];
percorrer array com for;
usar valores[indice];
evitar somar índice;
comparar valores corretamente;
calcular média depois da soma;
usar cast para double;
proteger array vazio;
gerar relatório final;
aplicar em int[];
aplicar em long[];
aplicar em double[];
aplicar em estoque;
aplicar em pedidos;
aplicar em pagamentos;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
aplicar em SLA;
ler valores do usuário;
validar pagamentos positivos;
contar valores acima da média;
contar valores acima do limite;
guardar posição do maior;
guardar posição do menor;
entender empate;
diagnosticar erros comuns;
debugar acumulador e comparações;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar arrays de String.

Não precisa ainda dominar arrays paralelos.

Não precisa ainda dominar objetos.

Não precisa ainda dominar streams.

Não precisa ainda dominar banco de dados.

Esses assuntos virão depois.

O objetivo é consolidar relatório numérico em arrays: soma, média, maior e menor com inicialização correta.

---

## Fechamento da aula

Hoje consolidamos quatro operações essenciais em arrays:

```text
soma;
média;
maior;
menor.
```

O padrão principal foi:

```java
int soma = 0;
int maior = valores[0];
int menor = valores[0];

for (int indice = 0; indice < valores.length; indice++) {
    soma += valores[indice];

    if (valores[indice] > maior) {
        maior = valores[indice];
    }

    if (valores[indice] < menor) {
        menor = valores[indice];
    }
}

double media = (double) soma / valores.length;
```

O ponto mais importante é a inicialização correta.

Para soma, zero funciona bem.

Para maior e menor, use um valor real do array.

Também vimos que relatório final precisa ser claro e que arrays vazios precisam de proteção antes de acessar `valores[0]`.

Na próxima aula, vamos estudar arrays de String.

Com isso, vamos sair de arrays apenas numéricos e começar a trabalhar com listas de nomes, status, textos e validações textuais.
