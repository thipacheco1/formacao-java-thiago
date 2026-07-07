# 041 — M1.21 — For Clássico

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.21.01` — For clássico — Conceito, por que existe e vocabulário essencial.
- `M1.21.02` — For clássico — Exemplo mínimo digitado do zero.
- `M1.21.03` — For clássico — Exemplo aplicado ao domínio corporativo.
- `M1.21.04` — For clássico — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar contador, início, condição, incremento, repetição controlada, leitura do fluxo do `for`, comparação com `while`, uso em contagens, processamento de lotes, acumuladores, menus simulados, erros comuns e diagnóstico.

---

## Onde estamos na formação

Estamos no Módulo 1, avançando no bloco de repetição.

A sequência recente foi:

```text
037 — M1.17 — Switch tradicional;
038 — M1.18 — Switch moderno e expressões;
039 — M1.19 — While;
040 — M1.20 — Do while;
041 — M1.21 — For clássico.
```

Nas aulas anteriores, aprendemos duas formas de repetição:

```java
while (condicao) {
    // repete enquanto a condição for verdadeira
}
```

e:

```java
do {
    // executa pelo menos uma vez
} while (condicao);
```

Agora vamos estudar o `for` clássico.

Exemplo:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println("Contador: " + contador);
}
```

Esse código imprime:

```text
Contador: 1
Contador: 2
Contador: 3
Contador: 4
Contador: 5
```

O `for` clássico é uma forma compacta e muito usada para repetição controlada por contador.

---

## Hoje a aula é sobre repetição controlada

O `while` é ótimo quando a repetição depende de uma condição que pode mudar de várias formas.

Exemplo:

```java
while (opcao != 0) {
    // menu
}
```

O `do while` é ótimo quando o bloco precisa executar pelo menos uma vez.

Exemplo:

```java
do {
    // mostra menu
} while (opcao != 0);
```

O `for` clássico é excelente quando sabemos controlar a repetição com:

```text
início;
condição;
incremento ou atualização.
```

Exemplo em português:

```text
comece em 1;
repita enquanto for menor ou igual a 5;
some 1 a cada volta.
```

Em Java:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}
```

O `for` coloca as três partes do controle em uma única linha.

---

## O que é o for clássico

O `for` é uma estrutura de repetição.

Ele repete um bloco enquanto uma condição for verdadeira.

Estrutura:

```java
for (inicializacao; condicao; atualizacao) {
    // bloco repetido
}
```

Exemplo:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

Partes:

```text
int i = 1   -> inicialização;
i <= 5      -> condição;
i++         -> atualização.
```

Leitura:

```text
comece i em 1;
enquanto i for menor ou igual a 5, execute o bloco;
ao final de cada volta, incremente i.
```

---

## Vocabulário essencial

Termos desta aula:

```text
for;
loop;
iteração;
contador;
índice;
inicialização;
condição;
atualização;
incremento;
decremento;
limite;
acumulador;
repetição controlada;
off-by-one;
zero-based;
escopo do contador.
```

Termos mais importantes:

```text
inicialização -> valor inicial do contador;
condição -> regra para continuar repetindo;
atualização -> mudança feita a cada iteração;
iteração -> cada volta do loop;
contador -> variável que controla a repetição;
off-by-one -> erro de uma posição ou uma repetição a mais/menos.
```

`off-by-one` é um erro clássico.

Ele aparece quando usamos `<` no lugar de `<=`, ou `<=` no lugar de `<`.

---

## Estrutura visual do for

Veja a linha:

```java
for (int contador = 1; contador <= 5; contador++) {
```

Ela tem três partes separadas por ponto e vírgula:

```java
for (
    int contador = 1;      // inicialização
    contador <= 5;         // condição
    contador++             // atualização
) {
    // bloco
}
```

Na prática, escrevemos em uma linha:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}
```

O `for` é compacto, mas precisa ser lido com calma.

---

## Ordem de execução do for

O fluxo do `for` é:

```text
1. executa a inicialização;
2. testa a condição;
3. se true, executa o bloco;
4. executa a atualização;
5. volta para a condição;
6. repete enquanto a condição for true;
7. quando a condição for false, sai do loop.
```

Exemplo:

```java
for (int contador = 1; contador <= 3; contador++) {
    System.out.println(contador);
}
```

Fluxo:

```text
contador = 1;
1 <= 3? true -> imprime 1 -> contador++ vira 2;
2 <= 3? true -> imprime 2 -> contador++ vira 3;
3 <= 3? true -> imprime 3 -> contador++ vira 4;
4 <= 3? false -> sai.
```

Esse desenho mental é obrigatório.

---

## Primeiro exemplo mínimo

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador <= 5; contador++) {
            System.out.println("Contador: " + contador);
        }

        System.out.println("Fim do programa");
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
Contador: 1
Contador: 2
Contador: 3
Contador: 4
Contador: 5
Fim do programa
```

Esse é o `for` clássico no formato mais básico.

---

## Comparando while e for

Este `while`:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Pode virar este `for`:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}
```

As três partes existem nos dois.

No `while`, elas ficam espalhadas:

```text
inicialização antes;
condição no while;
atualização dentro do bloco.
```

No `for`, elas ficam juntas:

```text
inicialização; condição; atualização.
```

Por isso o `for` é muito usado para repetição com contador.

---

## Quando usar for

Use `for` quando a repetição é controlada por contador ou sequência.

Exemplos:

```text
repetir 5 vezes;
percorrer páginas de 1 até total;
processar registros de 1 até total;
somar valores de 1 até 10;
gerar tentativas numeradas;
percorrer índices de uma lista futuramente;
executar uma validação para cada item futuramente;
processar cada linha de um arquivo futuramente.
```

Exemplo:

```java
for (int pagina = 1; pagina <= totalPaginas; pagina++) {
    System.out.println("Buscando página " + pagina);
}
```

Se a repetição tem começo, fim e passo claros, `for` costuma ser uma boa escolha.

---

## Quando while pode ser melhor

Use `while` quando a repetição depende de uma condição mais aberta.

Exemplos:

```text
enquanto usuário não escolher sair;
enquanto senha estiver incorreta;
enquanto houver mensagens pendentes;
enquanto resposta da API indicar próxima página;
enquanto entrada estiver inválida;
enquanto recurso estiver indisponível.
```

Exemplo:

```java
while (opcao != 0) {
    // menu
}
```

Também dá para fazer menu com `for`, mas não é a melhor intenção.

Código bom escolhe a estrutura que melhor comunica a regra.

---

## For crescente

Arquivo:

```text
ForCrescente.java
```

Código:

```java
public class ForCrescente {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 5; numero++) {
            System.out.println(numero);
        }
    }
}
```

Saída:

```text
1
2
3
4
5
```

Esse é um loop crescente.

O contador começa em 1 e aumenta até passar de 5.

---

## For decrescente

Arquivo:

```text
ForDecrescente.java
```

Código:

```java
public class ForDecrescente {
    public static void main(String[] args) {
        for (int numero = 5; numero >= 1; numero--) {
            System.out.println(numero);
        }
    }
}
```

Saída:

```text
5
4
3
2
1
```

Esse é um loop decrescente.

O contador começa em 5 e diminui até ficar menor que 1.

A atualização precisa combinar com a condição:

```text
se a condição depende de diminuir, use decremento;
se depende de aumentar, use incremento.
```

---

## For começando em zero

Em programação, é muito comum contar a partir de zero.

Exemplo:

```java
for (int indice = 0; indice < 5; indice++) {
    System.out.println("Índice: " + indice);
}
```

Saída:

```text
Índice: 0
Índice: 1
Índice: 2
Índice: 3
Índice: 4
```

Repare:

```java
indice < 5
```

Não usamos:

```java
indice <= 5
```

Porque queremos cinco iterações:

```text
0, 1, 2, 3, 4.
```

Isso será muito importante em arrays e listas.

---

## Zero-based

O termo:

```text
zero-based
```

significa:

```text
baseado em zero.
```

Muitas estruturas em programação começam no índice 0.

Exemplo futuro com lista de 5 itens:

```text
índices: 0, 1, 2, 3, 4.
```

Por isso este padrão é muito comum:

```java
for (int i = 0; i < tamanho; i++) {
    // usa i
}
```

Ainda não estamos em arrays.

Mas o padrão já precisa ser familiar.

---

## `i` como nome de contador

Em loops pequenos, é comum usar:

```java
i
```

Exemplo:

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

`i` normalmente significa:

```text
índice.
```

Mas em regra de negócio, nomes mais claros podem ser melhores.

Exemplo:

```java
for (int tentativa = 1; tentativa <= limiteTentativas; tentativa++) {
    System.out.println("Tentativa " + tentativa);
}
```

Compare:

```java
for (int i = 1; i <= limiteTentativas; i++) {
```

com:

```java
for (int tentativa = 1; tentativa <= limiteTentativas; tentativa++) {
```

A segunda versão explica o domínio.

---

## Escopo do contador

Quando você declara a variável dentro do `for`:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}
```

`contador` só existe dentro do `for`.

Este código dá erro:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}

System.out.println(contador); // erro
```

Se precisar usar o valor depois, declare antes.

Exemplo:

```java
int contador;

for (contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}

System.out.println("Valor final: " + contador);
```

Mas, na maioria dos casos, declarar dentro do `for` é melhor.

Evita vazamento de variável.

---

## Acumulador com for

Arquivo:

```text
AcumuladorFor.java
```

Código:

```java
public class AcumuladorFor {
    public static void main(String[] args) {
        int total = 0;

        for (int numero = 1; numero <= 5; numero++) {
            total += numero;
        }

        System.out.println("Total: " + total);
    }
}
```

Saída:

```text
Total: 15
```

Cálculo:

```text
1 + 2 + 3 + 4 + 5 = 15.
```

Aqui:

```text
numero -> contador;
total -> acumulador.
```

---

## Contando pares

Arquivo:

```text
ContadorParesFor.java
```

Código:

```java
public class ContadorParesFor {
    public static void main(String[] args) {
        int quantidadePares = 0;

        for (int numero = 1; numero <= 10; numero++) {
            if (numero % 2 == 0) {
                quantidadePares++;
            }
        }

        System.out.println("Quantidade de pares: " + quantidadePares);
    }
}
```

Saída:

```text
Quantidade de pares: 5
```

Aqui usamos:

```text
for;
if;
operador módulo;
contador.
```

Esse padrão será muito útil em desafios.

---

## For com passo maior que 1

O incremento não precisa ser sempre:

```java
i++
```

Pode ser:

```java
i += 2
```

Exemplo:

```java
for (int numero = 2; numero <= 10; numero += 2) {
    System.out.println(numero);
}
```

Saída:

```text
2
4
6
8
10
```

Esse loop já percorre apenas números pares.

A atualização é:

```java
numero += 2
```

Leitura:

```text
some 2 a cada volta.
```

---

## For com múltiplos de 5

Arquivo:

```text
MultiplosDeCincoFor.java
```

Código:

```java
public class MultiplosDeCincoFor {
    public static void main(String[] args) {
        for (int numero = 5; numero <= 50; numero += 5) {
            System.out.println(numero);
        }
    }
}
```

Saída:

```text
5
10
15
20
25
30
35
40
45
50
```

Esse exemplo mostra repetição com passo fixo maior que 1.

---

## For com Scanner: quantidade de repetições

Arquivo:

```text
RepeticaoInformadaConsole.java
```

Código:

```java
import java.util.Scanner;

public class RepeticaoInformadaConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas vezes deseja repetir?");
        int quantidade = scanner.nextInt();

        for (int contador = 1; contador <= quantidade; contador++) {
            System.out.println("Execução " + contador);
        }

        scanner.close();
    }
}
```

Se o usuário digitar:

```text
3
```

Saída:

```text
Execução 1
Execução 2
Execução 3
```

Aqui o limite vem da entrada.

---

## For com Scanner e acumulador

Arquivo:

```text
SomaValoresConsole.java
```

Código:

```java
import java.util.Scanner;

public class SomaValoresConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos valores deseja somar?");
        int quantidade = scanner.nextInt();

        int total = 0;

        for (int contador = 1; contador <= quantidade; contador++) {
            System.out.println("Digite o valor " + contador + ":");
            int valor = scanner.nextInt();

            total += valor;
        }

        System.out.println("Total: " + total);

        scanner.close();
    }
}
```

Esse exemplo é muito importante.

Ele junta:

```text
Scanner;
for;
contador;
entrada repetida;
acumulador.
```

O usuário define quantos valores serão lidos.

---

## For aplicado: processamento de lote

Arquivo:

```text
ProcessamentoLoteFor.java
```

Código:

```java
public class ProcessamentoLoteFor {
    public static void main(String[] args) {
        int totalRegistros = 5;

        for (int registro = 1; registro <= totalRegistros; registro++) {
            System.out.println("Processando registro " + registro);
        }

        System.out.println("Processamento finalizado");
    }
}
```

Saída:

```text
Processando registro 1
Processando registro 2
Processando registro 3
Processando registro 4
Processando registro 5
Processamento finalizado
```

Esse é um exemplo típico de repetição controlada.

Sabemos o total de registros.

Então `for` fica natural.

---

## For aplicado: lote com sucesso e erro

Arquivo:

```text
ProcessamentoLoteResultadoFor.java
```

Código:

```java
public class ProcessamentoLoteResultadoFor {
    public static void main(String[] args) {
        int totalRegistros = 5;
        int registrosComSucesso = 0;
        int registrosComErro = 0;

        for (int registro = 1; registro <= totalRegistros; registro++) {
            System.out.println("Processando registro " + registro);

            if (registro == 3) {
                System.out.println("Erro no registro " + registro);
                registrosComErro++;
            } else {
                registrosComSucesso++;
            }
        }

        System.out.println("Sucesso: " + registrosComSucesso);
        System.out.println("Erro: " + registrosComErro);
    }
}
```

Esse exemplo combina:

```text
for;
if;
contador de sucesso;
contador de erro;
processamento de lote.
```

---

## For aplicado: tentativas

Arquivo:

```text
TentativasFor.java
```

Código:

```java
public class TentativasFor {
    public static void main(String[] args) {
        int limiteTentativas = 3;

        for (int tentativa = 1; tentativa <= limiteTentativas; tentativa++) {
            System.out.println("Tentativa " + tentativa);
        }

        System.out.println("Fim das tentativas");
    }
}
```

Saída:

```text
Tentativa 1
Tentativa 2
Tentativa 3
Fim das tentativas
```

Quando a quantidade de tentativas é fixa, `for` fica muito claro.

---

## For aplicado: paginação

Arquivo:

```text
PaginacaoFor.java
```

Código:

```java
public class PaginacaoFor {
    public static void main(String[] args) {
        int totalPaginas = 4;

        for (int pagina = 1; pagina <= totalPaginas; pagina++) {
            System.out.println("Buscando página " + pagina);
        }

        System.out.println("Todas as páginas foram buscadas");
    }
}
```

Esse padrão aparece em:

```text
integração com API;
busca paginada;
relatórios;
sincronização de dados;
processamento de páginas.
```

Se o total de páginas é conhecido, `for` fica ótimo.

Se o total só aparece depois de cada resposta, talvez `while` seja melhor.

---

## For aplicado: mensageria

Arquivo:

```text
MensageriaFor.java
```

Código:

```java
public class MensageriaFor {
    public static void main(String[] args) {
        int totalMensagens = 4;
        int mensagensEnviadas = 0;

        for (int mensagem = 1; mensagem <= totalMensagens; mensagem++) {
            System.out.println("Enviando mensagem " + mensagem);
            mensagensEnviadas++;
        }

        System.out.println("Mensagens enviadas: " + mensagensEnviadas);
    }
}
```

Aqui sabemos a quantidade de mensagens.

Então usamos `for`.

Se fosse uma fila que muda dinamicamente, `while` poderia representar melhor.

---

## For aplicado: auditoria

Arquivo:

```text
AuditoriaFor.java
```

Código:

```java
public class AuditoriaFor {
    public static void main(String[] args) {
        int totalEventos = 3;

        for (int evento = 1; evento <= totalEventos; evento++) {
            System.out.println("Registrando evento de auditoria " + evento);
        }

        System.out.println("Auditoria finalizada");
    }
}
```

Esse exemplo mostra repetição controlada em auditoria.

---

## For aplicado: produtos

Arquivo:

```text
ProdutosFor.java
```

Código:

```java
public class ProdutosFor {
    public static void main(String[] args) {
        int totalProdutos = 5;
        int produtosAtivos = 0;
        int produtosInativos = 0;

        for (int produto = 1; produto <= totalProdutos; produto++) {
            boolean ativo = produto % 2 != 0;

            if (ativo) {
                produtosAtivos++;
            } else {
                produtosInativos++;
            }
        }

        System.out.println("Produtos ativos: " + produtosAtivos);
        System.out.println("Produtos inativos: " + produtosInativos);
    }
}
```

Esse exemplo simula classificação de produtos.

Ainda não temos arrays.

Então usamos o número do produto para simular o comportamento.

---

## For aplicado: total de pedido

Arquivo:

```text
TotalPedidoFor.java
```

Código:

```java
public class TotalPedidoFor {
    public static void main(String[] args) {
        int quantidadeItens = 3;
        long valorUnitarioCentavos = 2500L;
        long totalPedidoCentavos = 0L;

        for (int item = 1; item <= quantidadeItens; item++) {
            totalPedidoCentavos += valorUnitarioCentavos;
        }

        System.out.println("Total do pedido em centavos: " + totalPedidoCentavos);
    }
}
```

Esse exemplo soma o mesmo valor por item.

Mais tarde, com arrays e listas, cada item poderá ter valor diferente.

Por enquanto, o objetivo é praticar acumulador dentro do `for`.

---

## For aplicado: parcelas

Arquivo:

```text
ParcelasFor.java
```

Código:

```java
public class ParcelasFor {
    public static void main(String[] args) {
        long valorParcelaCentavos = 5000L;
        int quantidadeParcelas = 6;
        long totalCentavos = 0L;

        for (int parcela = 1; parcela <= quantidadeParcelas; parcela++) {
            System.out.println("Parcela " + parcela + ": " + valorParcelaCentavos);
            totalCentavos += valorParcelaCentavos;
        }

        System.out.println("Total em centavos: " + totalCentavos);
    }
}
```

Esse exemplo aplica `for` em domínio de pagamento.

---

## For e condição de fronteira

Um dos erros mais comuns é errar o limite.

Exemplo:

```java
for (int contador = 1; contador < 5; contador++) {
    System.out.println(contador);
}
```

Saída:

```text
1
2
3
4
```

Se a intenção era imprimir 1 a 5, faltou o 5.

Correto:

```java
contador <= 5
```

Outro exemplo:

```java
for (int indice = 0; indice <= 5; indice++) {
    System.out.println(indice);
}
```

Saída:

```text
0
1
2
3
4
5
```

São 6 iterações.

Se a intenção era 5 posições zero-based, o correto é:

```java
indice < 5
```

Esse é o famoso erro de uma posição.

---

## Off-by-one

`off-by-one` significa erro por uma unidade.

Exemplos:

```text
executar 4 vezes quando queria 5;
executar 6 vezes quando queria 5;
pular o primeiro item;
pular o último item;
acessar uma posição inexistente futuramente.
```

Causas comuns:

```text
usar < quando deveria usar <=;
usar <= quando deveria usar <;
começar em 0 quando queria começar em 1;
começar em 1 quando queria índice zero-based;
incrementar antes/depois em local errado.
```

No `for`, sempre teste:

```text
primeiro valor;
último valor;
quantidade total de iterações.
```

---

## Como contar iterações

Exemplo:

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

Valores de `i`:

```text
0
1
2
3
4
```

Quantidade de iterações:

```text
5.
```

Exemplo:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

Valores de `i`:

```text
1
2
3
4
5
```

Quantidade de iterações:

```text
5.
```

Os dois têm 5 iterações, mas começam em valores diferentes.

---

## For com duas variáveis

É possível ter mais de uma variável no `for`, mas use com cuidado.

Exemplo:

```java
for (int inicio = 1, fim = 5; inicio <= fim; inicio++, fim--) {
    System.out.println("Início: " + inicio + ", fim: " + fim);
}
```

Saída:

```text
Início: 1, fim: 5
Início: 2, fim: 4
Início: 3, fim: 3
```

Esse recurso existe.

Mas no começo da formação, prefira `for` simples.

Código claro vale mais do que código esperto.

---

## For sem corpo complexo

Evite colocar lógica demais dentro do `for`.

Ruim:

```java
for (int i = 0; i < 10; i++) {
    // valida
    // calcula
    // consulta
    // envia
    // registra
    // formata
    // decide
}
```

Quando o bloco do loop fica enorme, depois aprenderemos a extrair métodos.

Por enquanto, mantenha cada exemplo com uma intenção clara.

---

## For e break

Também podemos usar `break` dentro do `for`.

Exemplo:

```java
for (int numero = 1; numero <= 10; numero++) {
    if (numero == 5) {
        break;
    }

    System.out.println(numero);
}
```

Saída:

```text
1
2
3
4
```

Quando `numero` chega a 5, o loop é interrompido.

A próxima aula vai aprofundar `break` e `continue`.

Nesta aula, apenas reconheça.

---

## For e continue

Também podemos usar `continue`.

Exemplo:

```java
for (int numero = 1; numero <= 5; numero++) {
    if (numero == 3) {
        continue;
    }

    System.out.println(numero);
}
```

Saída:

```text
1
2
4
5
```

Quando `numero` é 3, o `continue` pula o restante da iteração.

Na próxima aula, isso será aprofundado.

---

## For e loop infinito

Também dá para criar loop infinito com `for`.

Exemplo perigoso:

```java
for (int contador = 1; contador <= 5; contador--) {
    System.out.println(contador);
}
```

O contador começa em 1.

A condição é:

```java
contador <= 5
```

Mas a atualização é:

```java
contador--
```

Ele vai para 0, -1, -2...

A condição continua verdadeira.

Outro exemplo:

```java
for (;;) {
    System.out.println("Loop infinito");
}
```

Isso é um loop infinito explícito.

Use apenas quando souber exatamente o motivo e a saída.

---

## Erros comuns

### Erro 1 — Esquecer uma das três partes

Um `for` controlado por contador precisa de:

```text
inicialização;
condição;
atualização.
```

Exemplo problemático:

```java
for (int contador = 1; contador <= 5;) {
    System.out.println(contador);
}
```

Sem atualização, pode virar loop infinito.

---

### Erro 2 — Atualizar na direção errada

Errado:

```java
for (int contador = 1; contador <= 5; contador--) {
    System.out.println(contador);
}
```

A condição nunca fica falsa.

---

### Erro 3 — Usar `<` quando queria incluir o limite

```java
for (int contador = 1; contador < 5; contador++) {
    System.out.println(contador);
}
```

Não imprime 5.

Se queria 1 até 5:

```java
contador <= 5
```

---

### Erro 4 — Usar `<=` em índice zero-based

```java
for (int indice = 0; indice <= 5; indice++) {
    System.out.println(indice);
}
```

Executa 6 vezes.

Se queria 5 posições:

```java
indice < 5
```

---

### Erro 5 — Modificar o contador dentro do bloco sem necessidade

Confuso:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
    contador++;
}
```

O contador aumenta duas vezes por iteração.

Isso pode pular valores.

Só altere o contador no bloco se houver motivo muito claro.

---

### Erro 6 — Usar nome genérico em regra de negócio

Ruim:

```java
for (int i = 1; i <= limiteTentativas; i++) {
    System.out.println("Tentativa " + i);
}
```

Melhor:

```java
for (int tentativa = 1; tentativa <= limiteTentativas; tentativa++) {
    System.out.println("Tentativa " + tentativa);
}
```

`i` é aceitável em loop técnico curto.

Em domínio, nome claro ajuda.

---

### Erro 7 — Confundir contador com acumulador

Errado:

```java
for (int total = 1; total <= 5; total++) {
}
```

se `total` deveria acumular valores.

Melhor:

```java
int total = 0;

for (int numero = 1; numero <= 5; numero++) {
    total += numero;
}
```

---

### Erro 8 — Declarar contador dentro do for e tentar usar fora

Errado:

```java
for (int contador = 1; contador <= 5; contador++) {
}

System.out.println(contador);
```

`contador` só existe dentro do `for`.

---

### Erro 9 — Criar for quando while comunica melhor

Exemplo:

```java
for (; opcao != 0;) {
    // menu
}
```

Funciona, mas é estranho.

Use `while` ou `do while` para menus.

---

### Erro 10 — Não testar primeiro e último valor

Sempre teste:

```text
qual é o primeiro valor?
qual é o último valor?
quantas vezes executa?
```

Isso evita off-by-one.

---

## Diagnóstico de erro com for

Quando um `for` não funcionar, siga o roteiro.

### 1. Qual é o valor inicial?

Veja a inicialização:

```java
int contador = ?
```

### 2. Qual é a condição de continuidade?

Leia:

```text
repete enquanto...
```

### 3. A atualização caminha para encerrar o loop?

Se precisa aumentar, use incremento.

Se precisa diminuir, use decremento.

### 4. Quantas iterações deveriam acontecer?

Calcule manualmente.

### 5. O primeiro valor está correto?

Verifique se deve começar em 0 ou 1.

### 6. O último valor está correto?

Verifique `<` ou `<=`.

### 7. O contador está sendo alterado dentro do bloco?

Se sim, confira se isso é intencional.

### 8. O acumulador foi inicializado antes?

Se acumula, precisa começar com valor correto.

### 9. A variável foi declarada no escopo certo?

Se precisa usar depois, declare fora.

### 10. Use debug ou prints

Imprima:

```java
System.out.println("contador = " + contador);
```

ou use debug.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Atualização ausente

```java
public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador <= 5;) {
            System.out.println(contador);
        }
    }
}
```

Execute com cuidado.

Depois corrija:

```java
contador++
```

na terceira parte do `for`.

### Teste 2 — Direção errada

```java
public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador <= 5; contador--) {
            System.out.println(contador);
        }
    }
}
```

Explique por que não termina.

### Teste 3 — Off-by-one com `<`

```java
public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador < 5; contador++) {
            System.out.println(contador);
        }
    }
}
```

Depois troque para:

```java
contador <= 5
```

### Teste 4 — Off-by-one com zero-based

```java
public class Main {
    public static void main(String[] args) {
        for (int indice = 0; indice <= 5; indice++) {
            System.out.println(indice);
        }
    }
}
```

Conte quantas vezes executa.

Depois troque para:

```java
indice < 5
```

### Teste 5 — Contador alterado duas vezes

```java
public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador <= 5; contador++) {
            System.out.println(contador);
            contador++;
        }
    }
}
```

Observe os valores pulados.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-041-for-classico
cd labs\m1\aula-041-for-classico
```

Crie arquivos:

```text
Main.java
ForCrescente.java
ForDecrescente.java
ForZeroBased.java
AcumuladorFor.java
ContadorParesFor.java
MultiplosDeCincoFor.java
RepeticaoInformadaConsole.java
SomaValoresConsole.java
ProcessamentoLoteFor.java
ProcessamentoLoteResultadoFor.java
TentativasFor.java
PaginacaoFor.java
MensageriaFor.java
AuditoriaFor.java
ProdutosFor.java
TotalPedidoFor.java
ParcelasFor.java
ForBreak.java
ForContinue.java
ForOffByOne.java
```

Compile:

```powershell
javac Main.java
javac ForCrescente.java
javac ForDecrescente.java
javac ForZeroBased.java
javac AcumuladorFor.java
javac ContadorParesFor.java
javac MultiplosDeCincoFor.java
javac RepeticaoInformadaConsole.java
javac SomaValoresConsole.java
javac ProcessamentoLoteFor.java
javac ProcessamentoLoteResultadoFor.java
javac TentativasFor.java
javac PaginacaoFor.java
javac MensageriaFor.java
javac AuditoriaFor.java
javac ProdutosFor.java
javac TotalPedidoFor.java
javac ParcelasFor.java
javac ForBreak.java
javac ForContinue.java
javac ForOffByOne.java
```

Execute:

```powershell
java Main
java ForCrescente
java ForDecrescente
java ForZeroBased
java AcumuladorFor
java ContadorParesFor
java MultiplosDeCincoFor
java RepeticaoInformadaConsole
java SomaValoresConsole
java ProcessamentoLoteFor
java ProcessamentoLoteResultadoFor
java TentativasFor
java PaginacaoFor
java MensageriaFor
java AuditoriaFor
java ProdutosFor
java TotalPedidoFor
java ParcelasFor
java ForBreak
java ForContinue
java ForOffByOne
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `ForZeroBased.java`

```java
public class ForZeroBased {
    public static void main(String[] args) {
        for (int indice = 0; indice < 5; indice++) {
            System.out.println("Índice: " + indice);
        }
    }
}
```

Objetivo:

```text
entender padrão de índice começando em zero.
```

---

## Arquivo sugerido: `ForBreak.java`

```java
public class ForBreak {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 10; numero++) {
            if (numero == 5) {
                break;
            }

            System.out.println(numero);
        }
    }
}
```

Objetivo:

```text
ver break interrompendo um for.
```

---

## Arquivo sugerido: `ForContinue.java`

```java
public class ForContinue {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 5; numero++) {
            if (numero == 3) {
                continue;
            }

            System.out.println(numero);
        }
    }
}
```

Objetivo:

```text
ver continue pulando uma iteração.
```

---

## Arquivo sugerido: `ForOffByOne.java`

```java
public class ForOffByOne {
    public static void main(String[] args) {
        System.out.println("Usando <");
        for (int contador = 1; contador < 5; contador++) {
            System.out.println(contador);
        }

        System.out.println("Usando <=");
        for (int contador = 1; contador <= 5; contador++) {
            System.out.println(contador);
        }
    }
}
```

Objetivo:

```text
comparar < e <= no limite.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar blocos do for |
| Renomear variável | `Shift + F6` | Melhorar nome do contador |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Parar execução | botão Stop ou `Ctrl + F2` em muitos keymaps | Interromper loop infinito |
| Debug | `Shift + F9` | Ver iterações |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Recent Files | `Ctrl + E` | Alternar arquivos |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug para for

Use debug neste exemplo:

```java
for (int contador = 1; contador <= 3; contador++) {
    System.out.println(contador);
}
```

Coloque breakpoint na linha do `for`.

Observe:

```text
contador = 1;
contador = 2;
contador = 3;
contador = 4.
```

Quando `contador` vira 4, a condição:

```java
contador <= 3
```

fica falsa.

O loop termina.

Também observe a ordem:

```text
condição;
bloco;
atualização;
condição novamente.
```

Debug é excelente para entender o `for`.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 041 — For clássico

### O que aprendi
Aprendi que o `for` clássico é uma estrutura de repetição controlada por inicialização, condição e atualização.

### O que pratiquei
Criei exemplos com contador crescente, contador decrescente, índice zero-based, acumulador, contagem de pares, múltiplos, entrada com Scanner, processamento de lote, tentativas, paginação, mensageria, auditoria, produto, pedido e parcelas.

### Conceitos principais
- `for`
- loop
- iteração
- inicialização
- condição
- atualização
- contador
- índice
- incremento
- decremento
- acumulador
- repetição controlada
- zero-based
- off-by-one
- escopo do contador
- `<` versus `<=`
- `break`
- `continue`

### Arquivos criados
- `labs/m1/aula-041-for-classico/Main.java`
- `labs/m1/aula-041-for-classico/ForCrescente.java`
- `labs/m1/aula-041-for-classico/ForDecrescente.java`
- `labs/m1/aula-041-for-classico/ForZeroBased.java`
- `labs/m1/aula-041-for-classico/AcumuladorFor.java`
- `labs/m1/aula-041-for-classico/ContadorParesFor.java`
- `labs/m1/aula-041-for-classico/MultiplosDeCincoFor.java`
- `labs/m1/aula-041-for-classico/RepeticaoInformadaConsole.java`
- `labs/m1/aula-041-for-classico/SomaValoresConsole.java`
- `labs/m1/aula-041-for-classico/ProcessamentoLoteFor.java`
- `labs/m1/aula-041-for-classico/ProcessamentoLoteResultadoFor.java`
- `labs/m1/aula-041-for-classico/TentativasFor.java`
- `labs/m1/aula-041-for-classico/PaginacaoFor.java`
- `labs/m1/aula-041-for-classico/MensageriaFor.java`
- `labs/m1/aula-041-for-classico/AuditoriaFor.java`
- `labs/m1/aula-041-for-classico/ProdutosFor.java`
- `labs/m1/aula-041-for-classico/TotalPedidoFor.java`
- `labs/m1/aula-041-for-classico/ParcelasFor.java`
- `labs/m1/aula-041-for-classico/ForBreak.java`
- `labs/m1/aula-041-for-classico/ForContinue.java`
- `labs/m1/aula-041-for-classico/ForOffByOne.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ForCrescente.java
java ForCrescente
javac ForZeroBased.java
java ForZeroBased
javac AcumuladorFor.java
java AcumuladorFor
javac ProcessamentoLoteFor.java
java ProcessamentoLoteFor
```

### Erros que quero evitar
- esquecer uma das três partes do `for`;
- atualizar na direção errada;
- usar `<` quando queria incluir o limite;
- usar `<=` em índice zero-based;
- modificar o contador dentro do bloco sem necessidade;
- usar nome genérico em regra de negócio;
- confundir contador com acumulador;
- declarar contador dentro do `for` e tentar usar fora;
- criar `for` quando `while` comunica melhor;
- não testar primeiro e último valor.

### Próximo passo
Estudar `break` e `continue`.
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
git add labs/m1/aula-041-for-classico docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 041: pratica for classico em Java"
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
1. Para que serve o `for` clássico?
2. Quais são as três partes principais do `for`?
3. Qual é a ordem de execução do `for`?
4. Quando `for` é mais adequado que `while`?
5. O que significa zero-based?
6. Qual a diferença entre `i < 5` e `i <= 5` quando i começa em 0?
7. O que é erro off-by-one?
8. Por que o contador geralmente é declarado dentro do `for`?
9. Qual a diferença entre contador e acumulador no `for`?
10. Por que modificar o contador dentro do bloco pode ser perigoso?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar for clássico;
identificar inicialização;
identificar condição;
identificar atualização;
criar for crescente;
criar for decrescente;
usar contador;
usar incremento;
usar decremento;
usar acumulador dentro do for;
explicar iteração;
comparar for com while;
saber quando usar for;
saber quando while comunica melhor;
usar padrão zero-based;
explicar off-by-one;
diferenciar < e <=;
usar nome claro para contador;
aplicar for em processamento de lote;
aplicar for em tentativas;
aplicar for em paginação;
aplicar for em mensageria;
aplicar for em auditoria;
aplicar for em produto;
aplicar for em pedido;
aplicar for em parcelas;
usar Scanner com for;
reconhecer break em nível inicial;
reconhecer continue em nível inicial;
diagnosticar erros comuns;
debugar iterações;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar arrays.

Não precisa ainda dominar listas.

Não precisa ainda dominar enhanced for.

Não precisa ainda dominar streams.

Não precisa ainda dominar otimização de loops.

Esses assuntos virão depois.

O objetivo é dominar a repetição controlada por contador.

---

## Fechamento da aula

Hoje estudamos o `for` clássico.

Ele organiza em uma única linha as três partes de uma repetição controlada:

```text
inicialização;
condição;
atualização.
```

Exemplo:

```java
for (int contador = 1; contador <= 5; contador++) {
    System.out.println(contador);
}
```

Também vimos que o `for` é muito bom para:

```text
contagens;
processamento de lotes;
tentativas;
paginação;
mensageria;
auditoria;
acumuladores;
repetições com quantidade conhecida.
```

O maior cuidado é evitar erros de limite.

Por isso, sempre pergunte:

```text
qual é o primeiro valor?
qual é o último valor?
quantas vezes executa?
```

Na próxima aula, vamos aprofundar `break` e `continue`.

Eles permitem alterar o fluxo de uma repetição, interrompendo o loop ou pulando uma iteração.
