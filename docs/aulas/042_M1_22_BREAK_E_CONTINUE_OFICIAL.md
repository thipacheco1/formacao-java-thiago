# 042 — M1.22 — Break e Continue

## Hoje a aula é sobre parar ou pular

Imagine um processamento de lote.

Você tem 10 registros.

Durante o processamento, podem acontecer duas situações diferentes:

```text
situação 1: encontrei um erro grave e preciso parar tudo;
situação 2: encontrei um item inválido, mas posso pular esse item e continuar com os próximos.
```

Essas duas situações não são iguais.

Para parar tudo, usamos:

```java
break;
```

Para pular apenas o item atual, usamos:

```java
continue;
```

Exemplo mental:

```text
break    -> encerra a repetição inteira;
continue -> encerra somente a volta atual.
```

Essa diferença aparece em:

```text
processamento de lote;
validação de registros;
busca de um item;
menus;
tentativas;
auditoria;
mensageria;
importações;
paginação;
integrações;
processamento de pedidos.
```

---

## O que é break

`break` interrompe o loop.

Quando o Java encontra:

```java
break;
```

dentro de um `while`, `do while` ou `for`, ele sai imediatamente da repetição.

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

Quando `numero` chega a 5, o `break` executa.

O loop termina.

O número 5 não é impresso.

Os números 6, 7, 8, 9 e 10 nem são avaliados no bloco.

---

## O que é continue

`continue` pula a iteração atual.

Quando o Java encontra:

```java
continue;
```

ele não termina o loop inteiro.

Ele apenas pula o restante do bloco atual e vai para a próxima iteração.

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

Quando `numero` é 3, o `continue` executa.

O `println` é pulado só naquela volta.

O loop continua com 4 e 5.

---

## Diferença prática

A diferença mais importante:

```text
break para o loop inteiro.
continue pula apenas a iteração atual.
```

Pense em uma fila de registros.

Com `break`:

```text
achei algo que impede continuar;
paro o processamento inteiro.
```

Com `continue`:

```text
este registro não serve;
pulo ele e sigo para o próximo.
```

Essa diferença é crítica em backend.

Parar quando deveria apenas pular pode deixar registros sem processar.

Continuar quando deveria parar pode causar inconsistência.

---

## Vocabulário essencial

Termos desta aula:

```text
break;
continue;
loop;
iteração;
interrupção;
salto;
pular item;
parar processamento;
fluxo;
condição de parada;
item inválido;
erro crítico;
processamento parcial;
registro ignorado;
controle de repetição.
```

Termos mais importantes:

```text
break -> encerra a repetição;
continue -> pula para a próxima iteração;
iteração -> uma volta do loop;
erro crítico -> motivo para parar tudo;
item inválido -> motivo para pular apenas aquele item.
```

---

## Exemplo mínimo com break

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 10; numero++) {
            if (numero == 5) {
                break;
            }

            System.out.println("Número: " + numero);
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
Número: 1
Número: 2
Número: 3
Número: 4
Fim do programa
```

O loop parou no 5.

O programa continuou depois do loop.

Isso é importante:

```text
break sai do loop, não necessariamente encerra o programa inteiro.
```

---

## Exemplo mínimo com continue

Arquivo:

```text
ContinueMinimo.java
```

Código:

```java
public class ContinueMinimo {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 5; numero++) {
            if (numero == 3) {
                continue;
            }

            System.out.println("Número: " + numero);
        }

        System.out.println("Fim do programa");
    }
}
```

Saída:

```text
Número: 1
Número: 2
Número: 4
Número: 5
Fim do programa
```

O número 3 foi pulado.

O loop não parou.

Essa é a diferença prática.

---

## Break em while

`break` também funciona com `while`.

Arquivo:

```text
BreakWhile.java
```

Código:

```java
public class BreakWhile {
    public static void main(String[] args) {
        int contador = 1;

        while (contador <= 10) {
            if (contador == 5) {
                break;
            }

            System.out.println("Contador: " + contador);
            contador++;
        }

        System.out.println("Fim");
    }
}
```

Saída:

```text
Contador: 1
Contador: 2
Contador: 3
Contador: 4
Fim
```

Aqui o loop termina quando `contador` chega a 5.

---

## Cuidado com break em while

No exemplo anterior, repare na ordem:

```java
if (contador == 5) {
    break;
}

System.out.println("Contador: " + contador);
contador++;
```

Quando `contador` é 5, o `break` acontece antes do incremento.

Isso não gera problema porque o loop termina.

Mas se fosse `continue`, seria diferente.

Com `continue`, esquecer atualização pode causar loop infinito.

Vamos ver isso com cuidado.

---

## Continue em while

Arquivo:

```text
ContinueWhile.java
```

Código:

```java
public class ContinueWhile {
    public static void main(String[] args) {
        int contador = 0;

        while (contador < 5) {
            contador++;

            if (contador == 3) {
                continue;
            }

            System.out.println("Contador: " + contador);
        }

        System.out.println("Fim");
    }
}
```

Saída:

```text
Contador: 1
Contador: 2
Contador: 4
Contador: 5
Fim
```

O incremento acontece antes do `continue`.

Isso é importante.

Se o incremento viesse depois, poderia haver loop infinito.

---

## Continue perigoso em while

Exemplo perigoso:

```java
int contador = 1;

while (contador <= 5) {
    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
    contador++;
}
```

Quando `contador` chega a 3:

```java
continue;
```

pula o restante do bloco.

Então esta linha não executa:

```java
contador++;
```

O contador fica 3 para sempre.

O loop fica infinito.

Correção:

```java
int contador = 1;

while (contador <= 5) {
    if (contador == 3) {
        contador++;
        continue;
    }

    System.out.println(contador);
    contador++;
}
```

Melhor ainda:

```java
int contador = 0;

while (contador < 5) {
    contador++;

    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
}
```

No `while`, tome muito cuidado com `continue`.

---

## Continue em for é mais seguro para contador

No `for`, a atualização acontece ao final da iteração automaticamente.

Exemplo:

```java
for (int numero = 1; numero <= 5; numero++) {
    if (numero == 3) {
        continue;
    }

    System.out.println(numero);
}
```

Quando `numero == 3`, o `continue` pula o `println`.

Mas depois o `for` executa:

```java
numero++
```

e segue para o 4.

Por isso `continue` costuma ser mais simples de usar em `for` do que em `while`.

Ainda assim, precisa de cuidado.

---

## Break em do while

Arquivo:

```text
BreakDoWhile.java
```

Código:

```java
public class BreakDoWhile {
    public static void main(String[] args) {
        int contador = 1;

        do {
            if (contador == 5) {
                break;
            }

            System.out.println("Contador: " + contador);
            contador++;
        } while (contador <= 10);

        System.out.println("Fim");
    }
}
```

Saída:

```text
Contador: 1
Contador: 2
Contador: 3
Contador: 4
Fim
```

O comportamento é o mesmo:

```text
break encerra o loop.
```

---

## Continue em do while

Arquivo:

```text
ContinueDoWhile.java
```

Código:

```java
public class ContinueDoWhile {
    public static void main(String[] args) {
        int contador = 0;

        do {
            contador++;

            if (contador == 3) {
                continue;
            }

            System.out.println("Contador: " + contador);
        } while (contador < 5);

        System.out.println("Fim");
    }
}
```

Saída:

```text
Contador: 1
Contador: 2
Contador: 4
Contador: 5
Fim
```

Assim como no `while`, colocamos a atualização antes do `continue`.

---

## Break em switch versus break em loop

Você já viu `break` no `switch` tradicional.

Exemplo:

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
        break;
}
```

Ali, o `break` sai do `switch`.

Dentro de loop, o `break` sai do loop.

Exemplo:

```java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
}
```

Aqui sai do `for`.

O significado geral é:

```text
interromper a estrutura atual.
```

Mas a estrutura atual pode ser:

```text
switch;
while;
do while;
for.
```

---

## Break dentro de switch dentro de loop

Este ponto é importante.

Exemplo:

```java
for (int opcao = 1; opcao <= 3; opcao++) {
    switch (opcao) {
        case 1:
            System.out.println("Cadastrar");
            break;
        case 2:
            System.out.println("Consultar");
            break;
        default:
            System.out.println("Outra opção");
            break;
    }

    System.out.println("Fim da iteração " + opcao);
}
```

O `break` dentro do `switch` sai apenas do `switch`.

Ele não sai do `for`.

Saída:

```text
Cadastrar
Fim da iteração 1
Consultar
Fim da iteração 2
Outra opção
Fim da iteração 3
```

Isso confunde muita gente.

Regra:

```text
break sai da estrutura mais próxima que ele pode interromper.
```

Se está dentro de um `switch`, sai do `switch`.

---

## Quando usar break

Use `break` quando existe motivo para encerrar a repetição.

Exemplos:

```text
encontrei o item procurado;
ocorreu erro crítico;
usuário escolheu sair;
não faz mais sentido continuar;
atingi uma condição de parada antecipada;
uma validação bloqueante falhou;
a conexão foi encerrada;
a página não retornou dados.
```

Exemplo:

```java
for (int id = 1; id <= 10; id++) {
    if (id == 7) {
        System.out.println("Item encontrado");
        break;
    }

    System.out.println("Verificando id " + id);
}
```

Depois de encontrar o item, continuar não faz sentido.

---

## Quando usar continue

Use `continue` quando o item atual deve ser ignorado, mas os próximos ainda devem ser processados.

Exemplos:

```text
registro inválido;
linha vazia;
produto inativo;
cliente sem e-mail;
mensagem sem telefone;
pedido cancelado;
valor zerado;
item já processado;
ocorrência duplicada.
```

Exemplo:

```java
for (int produto = 1; produto <= 5; produto++) {
    boolean produtoInativo = produto == 3;

    if (produtoInativo) {
        continue;
    }

    System.out.println("Processando produto " + produto);
}
```

O produto 3 é pulado.

Os demais continuam.

---

## Continue como filtro

Uma forma boa de entender `continue`:

```text
continue funciona como um filtro.
```

Exemplo:

```java
for (int numero = 1; numero <= 10; numero++) {
    if (numero % 2 != 0) {
        continue;
    }

    System.out.println("Par: " + numero);
}
```

Saída:

```text
Par: 2
Par: 4
Par: 6
Par: 8
Par: 10
```

Se o número é ímpar, pula.

Só processa pares.

---

## O mesmo código sem continue

Sem `continue`:

```java
for (int numero = 1; numero <= 10; numero++) {
    if (numero % 2 == 0) {
        System.out.println("Par: " + numero);
    }
}
```

Esse código é até mais simples neste caso.

Então, importante:

```text
continue nem sempre melhora o código.
```

Use quando ele reduzir aninhamento ou deixar a intenção mais clara.

Não use apenas porque existe.

---

## Continue reduzindo aninhamento

Compare:

```java
for (int registro = 1; registro <= 5; registro++) {
    boolean registroValido = registro != 3;

    if (registroValido) {
        System.out.println("Processando registro " + registro);
    }
}
```

Com:

```java
for (int registro = 1; registro <= 5; registro++) {
    boolean registroInvalido = registro == 3;

    if (registroInvalido) {
        continue;
    }

    System.out.println("Processando registro " + registro);
}
```

A segunda versão diz:

```text
se registro é inválido, pula;
caso contrário, segue fluxo principal.
```

Em loops com muitas validações, isso pode deixar o fluxo principal menos aninhado.

---

## Exemplo aplicado: buscar item e parar

Arquivo:

```text
BuscaPedidoBreak.java
```

Código:

```java
public class BuscaPedidoBreak {
    public static void main(String[] args) {
        int pedidoProcurado = 7;
        boolean pedidoEncontrado = false;

        for (int pedido = 1; pedido <= 10; pedido++) {
            System.out.println("Verificando pedido " + pedido);

            if (pedido == pedidoProcurado) {
                pedidoEncontrado = true;
                System.out.println("Pedido encontrado: " + pedido);
                break;
            }
        }

        System.out.println("Encontrado: " + pedidoEncontrado);
    }
}
```

Aqui `break` faz sentido.

Depois que o pedido foi encontrado, não precisa continuar procurando.

---

## Exemplo aplicado: pular pedidos cancelados

Arquivo:

```text
PedidosCanceladosContinue.java
```

Código:

```java
public class PedidosCanceladosContinue {
    public static void main(String[] args) {
        int pedidosProcessados = 0;
        int pedidosIgnorados = 0;

        for (int pedido = 1; pedido <= 5; pedido++) {
            boolean pedidoCancelado = pedido == 3;

            if (pedidoCancelado) {
                pedidosIgnorados++;
                System.out.println("Pedido cancelado ignorado: " + pedido);
                continue;
            }

            System.out.println("Processando pedido " + pedido);
            pedidosProcessados++;
        }

        System.out.println("Pedidos processados: " + pedidosProcessados);
        System.out.println("Pedidos ignorados: " + pedidosIgnorados);
    }
}
```

Aqui `continue` faz sentido.

Pedido cancelado não deve ser processado, mas os próximos pedidos devem continuar.

---

## Exemplo aplicado: lote com erro crítico

Arquivo:

```text
LoteErroCriticoBreak.java
```

Código:

```java
public class LoteErroCriticoBreak {
    public static void main(String[] args) {
        int registrosProcessados = 0;
        boolean erroCritico = false;

        for (int registro = 1; registro <= 10; registro++) {
            System.out.println("Processando registro " + registro);

            if (registro == 6) {
                erroCritico = true;
                System.out.println("Erro crítico no registro " + registro);
                break;
            }

            registrosProcessados++;
        }

        System.out.println("Registros processados: " + registrosProcessados);
        System.out.println("Erro crítico: " + erroCritico);
    }
}
```

Aqui o erro crítico para tudo.

Não é apenas um item inválido.

É uma condição que impede seguir.

---

## Exemplo aplicado: lote com item inválido

Arquivo:

```text
LoteItemInvalidoContinue.java
```

Código:

```java
public class LoteItemInvalidoContinue {
    public static void main(String[] args) {
        int registrosProcessados = 0;
        int registrosIgnorados = 0;

        for (int registro = 1; registro <= 10; registro++) {
            boolean registroInvalido = registro == 4 || registro == 7;

            if (registroInvalido) {
                registrosIgnorados++;
                System.out.println("Registro inválido ignorado: " + registro);
                continue;
            }

            System.out.println("Processando registro " + registro);
            registrosProcessados++;
        }

        System.out.println("Registros processados: " + registrosProcessados);
        System.out.println("Registros ignorados: " + registrosIgnorados);
    }
}
```

Aqui o item inválido não para o lote.

Apenas é ignorado.

Isso é a essência do `continue`.

---

## Exemplo aplicado: mensageria sem telefone

Arquivo:

```text
MensageriaContinue.java
```

Código:

```java
public class MensageriaContinue {
    public static void main(String[] args) {
        int mensagensEnviadas = 0;
        int mensagensIgnoradas = 0;

        for (int cliente = 1; cliente <= 5; cliente++) {
            boolean clienteSemTelefone = cliente == 2 || cliente == 5;

            if (clienteSemTelefone) {
                mensagensIgnoradas++;
                System.out.println("Cliente sem telefone ignorado: " + cliente);
                continue;
            }

            System.out.println("Enviando mensagem para cliente " + cliente);
            mensagensEnviadas++;
        }

        System.out.println("Mensagens enviadas: " + mensagensEnviadas);
        System.out.println("Mensagens ignoradas: " + mensagensIgnoradas);
    }
}
```

Em uma mensageria real, cliente sem telefone não deveria derrubar o lote inteiro.

Ele deve ser ignorado ou marcado com erro, e o processamento deve continuar.

---

## Exemplo aplicado: mensageria com falha crítica

Arquivo:

```text
MensageriaBreak.java
```

Código:

```java
public class MensageriaBreak {
    public static void main(String[] args) {
        int mensagensEnviadas = 0;
        boolean servicoIndisponivel = false;

        for (int mensagem = 1; mensagem <= 10; mensagem++) {
            if (mensagem == 6) {
                servicoIndisponivel = true;
                System.out.println("Serviço de mensageria indisponível");
                break;
            }

            System.out.println("Enviando mensagem " + mensagem);
            mensagensEnviadas++;
        }

        System.out.println("Mensagens enviadas: " + mensagensEnviadas);
        System.out.println("Serviço indisponível: " + servicoIndisponivel);
    }
}
```

Aqui a falha é crítica.

Não faz sentido tentar enviar o restante se o serviço ficou indisponível.

---

## Exemplo aplicado: auditoria com item duplicado

Arquivo:

```text
AuditoriaContinue.java
```

Código:

```java
public class AuditoriaContinue {
    public static void main(String[] args) {
        int eventosRegistrados = 0;
        int eventosIgnorados = 0;

        for (int evento = 1; evento <= 6; evento++) {
            boolean eventoDuplicado = evento == 3 || evento == 4;

            if (eventoDuplicado) {
                eventosIgnorados++;
                System.out.println("Evento duplicado ignorado: " + evento);
                continue;
            }

            System.out.println("Registrando evento " + evento);
            eventosRegistrados++;
        }

        System.out.println("Eventos registrados: " + eventosRegistrados);
        System.out.println("Eventos ignorados: " + eventosIgnorados);
    }
}
```

Evento duplicado é um bom candidato para `continue`.

Ele não deve impedir os próximos eventos.

---

## Exemplo aplicado: produto inativo

Arquivo:

```text
ProdutosInativosContinue.java
```

Código:

```java
public class ProdutosInativosContinue {
    public static void main(String[] args) {
        int produtosAtualizados = 0;
        int produtosIgnorados = 0;

        for (int produto = 1; produto <= 8; produto++) {
            boolean produtoInativo = produto == 2 || produto == 6;

            if (produtoInativo) {
                produtosIgnorados++;
                System.out.println("Produto inativo ignorado: " + produto);
                continue;
            }

            System.out.println("Atualizando produto " + produto);
            produtosAtualizados++;
        }

        System.out.println("Produtos atualizados: " + produtosAtualizados);
        System.out.println("Produtos ignorados: " + produtosIgnorados);
    }
}
```

Produto inativo pode ser ignorado sem parar todo o processamento.

---

## Exemplo aplicado: pagamento inválido

Arquivo:

```text
PagamentosContinue.java
```

Código:

```java
public class PagamentosContinue {
    public static void main(String[] args) {
        int pagamentosProcessados = 0;
        int pagamentosInvalidos = 0;

        for (int pagamento = 1; pagamento <= 5; pagamento++) {
            boolean valorInvalido = pagamento == 2;

            if (valorInvalido) {
                pagamentosInvalidos++;
                System.out.println("Pagamento inválido ignorado: " + pagamento);
                continue;
            }

            System.out.println("Processando pagamento " + pagamento);
            pagamentosProcessados++;
        }

        System.out.println("Pagamentos processados: " + pagamentosProcessados);
        System.out.println("Pagamentos inválidos: " + pagamentosInvalidos);
    }
}
```

Esse exemplo reforça:

```text
item inválido -> continue.
```

---

## Exemplo aplicado: pagamento com falha bloqueante

Arquivo:

```text
PagamentosBreak.java
```

Código:

```java
public class PagamentosBreak {
    public static void main(String[] args) {
        int pagamentosProcessados = 0;
        boolean contaContabilIndisponivel = false;

        for (int pagamento = 1; pagamento <= 5; pagamento++) {
            if (pagamento == 4) {
                contaContabilIndisponivel = true;
                System.out.println("Conta contábil indisponível. Parando processamento.");
                break;
            }

            System.out.println("Processando pagamento " + pagamento);
            pagamentosProcessados++;
        }

        System.out.println("Pagamentos processados: " + pagamentosProcessados);
        System.out.println("Conta contábil indisponível: " + contaContabilIndisponivel);
    }
}
```

Aqui a falha afeta o processamento como um todo.

Então `break` faz sentido.

---

## Exemplo com Scanner: buscar opção e sair

Arquivo:

```text
MenuBreak.java
```

Código:

```java
import java.util.Scanner;

public class MenuBreak {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("Menu");
            System.out.println("1 - Consultar");
            System.out.println("2 - Processar");
            System.out.println("0 - Sair");

            int opcao = scanner.nextInt();

            if (opcao == 0) {
                System.out.println("Saindo");
                break;
            }

            if (opcao == 1) {
                System.out.println("Consultando");
            } else if (opcao == 2) {
                System.out.println("Processando");
            } else {
                System.out.println("Opção inválida");
            }
        }

        scanner.close();
    }
}
```

Esse padrão existe:

```java
while (true)
```

com `break` para sair.

Mas use com cuidado.

A condição de parada fica dentro do loop, não no topo.

---

## Menu com condição no topo pode ser mais claro

O mesmo menu poderia ser escrito assim:

```java
int opcao = -1;

while (opcao != 0) {
    System.out.println("Menu");
    System.out.println("1 - Consultar");
    System.out.println("2 - Processar");
    System.out.println("0 - Sair");

    opcao = scanner.nextInt();

    if (opcao == 1) {
        System.out.println("Consultando");
    } else if (opcao == 2) {
        System.out.println("Processando");
    } else if (opcao == 0) {
        System.out.println("Saindo");
    } else {
        System.out.println("Opção inválida");
    }
}
```

Aqui a condição de parada está visível:

```java
while (opcao != 0)
```

No começo da formação, prefira condição explícita quando possível.

Use `while (true)` com `break` apenas quando a leitura ficar realmente melhor.

---

## Exemplo com Scanner: pular valores inválidos

Arquivo:

```text
SomaValoresValidosContinue.java
```

Código:

```java
import java.util.Scanner;

public class SomaValoresValidosContinue {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int total = 0;
        int valoresIgnorados = 0;

        for (int contador = 1; contador <= 5; contador++) {
            System.out.println("Digite o valor " + contador + ":");
            int valor = scanner.nextInt();

            if (valor <= 0) {
                valoresIgnorados++;
                System.out.println("Valor inválido ignorado");
                continue;
            }

            total += valor;
        }

        System.out.println("Total dos valores válidos: " + total);
        System.out.println("Valores ignorados: " + valoresIgnorados);

        scanner.close();
    }
}
```

Aqui `continue` permite ignorar valores inválidos sem encerrar a leitura.

---

## Break versus continue no mesmo problema

Problema:

```text
ler 5 valores;
se valor for negativo, ignorar;
se valor for 999, encerrar imediatamente.
```

Arquivo:

```text
BreakEContinueMesmoLoop.java
```

Código:

```java
import java.util.Scanner;

public class BreakEContinueMesmoLoop {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int total = 0;
        int ignorados = 0;

        for (int contador = 1; contador <= 5; contador++) {
            System.out.println("Digite o valor " + contador + ":");
            int valor = scanner.nextInt();

            if (valor == 999) {
                System.out.println("Valor de parada informado");
                break;
            }

            if (valor < 0) {
                ignorados++;
                System.out.println("Valor negativo ignorado");
                continue;
            }

            total += valor;
        }

        System.out.println("Total: " + total);
        System.out.println("Ignorados: " + ignorados);

        scanner.close();
    }
}
```

Aqui temos as duas ideias:

```text
999 -> para tudo;
valor negativo -> pula só aquele valor.
```

---

## Ordem entre break e continue

Quando existem os dois, a ordem importa.

No exemplo anterior:

```java
if (valor == 999) {
    break;
}

if (valor < 0) {
    continue;
}
```

Primeiro tratamos o valor de parada.

Depois tratamos o item inválido.

Por quê?

Porque `999` também é maior que zero, mas é um comando especial.

Em outros domínios, a ordem pode mudar.

Regra:

```text
condições mais críticas ou especiais devem ser avaliadas primeiro.
```

---

## Break e continue não substituem boa condição

Evite usar `break` e `continue` para consertar loop mal planejado.

Exemplo ruim:

```java
for (int i = 1; i <= 1000; i++) {
    if (i > 10) {
        break;
    }

    System.out.println(i);
}
```

Melhor:

```java
for (int i = 1; i <= 10; i++) {
    System.out.println(i);
}
```

Se o limite é conhecido, coloque o limite na condição do loop.

Use `break` para parada antecipada real, não para esconder condição ruim.

---

## Continue não deve esconder regra importante

Exemplo difícil:

```java
for (int item = 1; item <= 10; item++) {
    if (item == 2) continue;
    if (item == 4) continue;
    if (item == 7) continue;

    System.out.println(item);
}
```

Melhor:

```java
for (int item = 1; item <= 10; item++) {
    boolean itemIgnorado = item == 2 || item == 4 || item == 7;

    if (itemIgnorado) {
        continue;
    }

    System.out.println(item);
}
```

A regra ganhou nome:

```java
itemIgnorado
```

Nomear ajuda a leitura.

---

## Continue e variável de controle em while

Este alerta precisa ficar gravado.

Ruim:

```java
int contador = 1;

while (contador <= 5) {
    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
    contador++;
}
```

Loop infinito.

Melhor:

```java
int contador = 0;

while (contador < 5) {
    contador++;

    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
}
```

Regra:

```text
em while com continue, garanta que a variável de controle seja atualizada antes do continue.
```

---

## Break em loops aninhados

Na próxima aula estudaremos laços aninhados.

Mas aqui vale um aviso.

Exemplo:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        if (coluna == 2) {
            break;
        }

        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

O `break` sai apenas do loop interno.

Ele não sai dos dois loops.

Esse ponto será mais importante na próxima aula.

Por enquanto, guarde:

```text
break sai do loop mais próximo.
```

---

## Continue em loops aninhados

Também vale para `continue`.

Exemplo:

```java
for (int linha = 1; linha <= 2; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        if (coluna == 2) {
            continue;
        }

        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

O `continue` pula a iteração do loop interno.

Não pula automaticamente a linha inteira.

Isso também será aprofundado na próxima aula.

---

## Erros comuns

### Erro 1 — Usar break quando queria continue

Errado:

```java
for (int registro = 1; registro <= 10; registro++) {
    if (registro == 3) {
        break;
    }

    System.out.println(registro);
}
```

Se a intenção era pular só o registro 3, use:

```java
continue;
```

---

### Erro 2 — Usar continue quando deveria parar tudo

Errado se o erro é crítico:

```java
if (servicoIndisponivel) {
    continue;
}
```

Se o serviço está indisponível e nada mais pode ser processado, use:

```java
break;
```

ou trate o erro de forma adequada.

---

### Erro 3 — Continue antes de atualizar contador em while

Causa loop infinito.

Errado:

```java
while (contador <= 5) {
    if (contador == 3) {
        continue;
    }

    contador++;
}
```

Atualize antes do `continue`.

---

### Erro 4 — Break escondendo condição ruim

Ruim:

```java
for (int i = 1; i <= 100; i++) {
    if (i > 5) {
        break;
    }
}
```

Melhor:

```java
for (int i = 1; i <= 5; i++) {
}
```

---

### Erro 5 — Continue demais deixando o fluxo confuso

Muitos `continue` espalhados podem dificultar a leitura.

Prefira nomear regras e organizar as validações.

---

### Erro 6 — Break dentro de switch achando que saiu do loop

Dentro de um `switch`, o `break` sai do `switch`, não necessariamente do loop externo.

Esse erro é comum.

---

### Erro 7 — Não contar itens ignorados

Se você usa `continue` para ignorar item, muitas vezes precisa registrar:

```java
itensIgnorados++;
```

Senão perde informação importante.

---

### Erro 8 — Não registrar motivo da parada

Se você usa `break` por erro crítico, registre motivo.

Exemplo:

```java
System.out.println("Erro crítico no registro " + registro);
```

Em backend real, isso seria log.

---

### Erro 9 — Usar break e continue para todo controle

Nem todo fluxo precisa deles.

Às vezes `if`, `else`, condição do loop ou uma regra booleana é mais clara.

---

### Erro 10 — Não testar cenário pulado e cenário parado

Sempre teste:

```text
sem item inválido;
com item inválido;
com erro crítico;
erro crítico antes de item inválido;
item inválido antes de erro crítico;
todos válidos.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-042-break-continue
cd labs\m1\aula-042-break-continue
```

Crie arquivos:

```text
Main.java
ContinueMinimo.java
BreakWhile.java
ContinueWhile.java
BreakDoWhile.java
ContinueDoWhile.java
BuscaPedidoBreak.java
PedidosCanceladosContinue.java
LoteErroCriticoBreak.java
LoteItemInvalidoContinue.java
MensageriaContinue.java
MensageriaBreak.java
AuditoriaContinue.java
ProdutosInativosContinue.java
PagamentosContinue.java
PagamentosBreak.java
MenuBreak.java
SomaValoresValidosContinue.java
BreakEContinueMesmoLoop.java
BreakSwitchDentroFor.java
ContinueFiltroPares.java
ContinuePerigosoWhile.java
```

Compile:

```powershell
javac Main.java
javac ContinueMinimo.java
javac BreakWhile.java
javac ContinueWhile.java
javac BreakDoWhile.java
javac ContinueDoWhile.java
javac BuscaPedidoBreak.java
javac PedidosCanceladosContinue.java
javac LoteErroCriticoBreak.java
javac LoteItemInvalidoContinue.java
javac MensageriaContinue.java
javac MensageriaBreak.java
javac AuditoriaContinue.java
javac ProdutosInativosContinue.java
javac PagamentosContinue.java
javac PagamentosBreak.java
javac MenuBreak.java
javac SomaValoresValidosContinue.java
javac BreakEContinueMesmoLoop.java
javac BreakSwitchDentroFor.java
javac ContinueFiltroPares.java
javac ContinuePerigosoWhile.java
```

Execute:

```powershell
java Main
java ContinueMinimo
java BreakWhile
java ContinueWhile
java BreakDoWhile
java ContinueDoWhile
java BuscaPedidoBreak
java PedidosCanceladosContinue
java LoteErroCriticoBreak
java LoteItemInvalidoContinue
java MensageriaContinue
java MensageriaBreak
java AuditoriaContinue
java ProdutosInativosContinue
java PagamentosContinue
java PagamentosBreak
java MenuBreak
java SomaValoresValidosContinue
java BreakEContinueMesmoLoop
java BreakSwitchDentroFor
java ContinueFiltroPares
java ContinuePerigosoWhile
```

Alguns exemplos de erro proposital podem gerar comportamento perigoso, como loop infinito.

Execute com cuidado e saiba parar o programa.

---

## Arquivo sugerido: `BreakSwitchDentroFor.java`

```java
public class BreakSwitchDentroFor {
    public static void main(String[] args) {
        for (int opcao = 1; opcao <= 3; opcao++) {
            switch (opcao) {
                case 1:
                    System.out.println("Cadastrar");
                    break;
                case 2:
                    System.out.println("Consultar");
                    break;
                default:
                    System.out.println("Outra opção");
                    break;
            }

            System.out.println("Fim da iteração " + opcao);
        }
    }
}
```

Objetivo:

```text
ver que break dentro do switch não encerra o for.
```

---

## Arquivo sugerido: `ContinueFiltroPares.java`

```java
public class ContinueFiltroPares {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 10; numero++) {
            if (numero % 2 != 0) {
                continue;
            }

            System.out.println("Par: " + numero);
        }
    }
}
```

Objetivo:

```text
entender continue como filtro.
```

---

## Arquivo sugerido: `ContinuePerigosoWhile.java`

```java
public class ContinuePerigosoWhile {
    public static void main(String[] args) {
        int contador = 1;

        while (contador <= 5) {
            if (contador == 3) {
                continue;
            }

            System.out.println(contador);
            contador++;
        }
    }
}
```

Objetivo:

```text
ver por que continue antes de atualizar contador pode causar loop infinito.
```

Execute com cuidado.

Depois corrija.

---

## Debug para break e continue

Use debug neste exemplo:

```java
for (int numero = 1; numero <= 5; numero++) {
    if (numero == 3) {
        continue;
    }

    System.out.println(numero);
}
```

Coloque breakpoint no `if`.

Observe:

```text
numero = 1 -> imprime;
numero = 2 -> imprime;
numero = 3 -> entra no continue e pula o println;
numero = 4 -> imprime;
numero = 5 -> imprime.
```

Depois debugue:

```java
for (int numero = 1; numero <= 5; numero++) {
    if (numero == 3) {
        break;
    }

    System.out.println(numero);
}
```

Observe:

```text
numero = 1 -> imprime;
numero = 2 -> imprime;
numero = 3 -> break;
loop termina.
```

Esse contraste fixa o assunto.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-042-break-continue docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 042: pratica break e continue em Java"
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
explicar break;
explicar continue;
diferenciar parar loop de pular iteração;
usar break em for;
usar continue em for;
usar break em while;
usar continue em while com cuidado;
usar break em do while;
usar continue em do while;
explicar risco de continue antes de atualizar contador;
usar break para item encontrado;
usar break para erro crítico;
usar continue para item inválido;
usar continue para item cancelado;
aplicar break em pedido;
aplicar continue em pedido;
aplicar break em lote;
aplicar continue em lote;
aplicar em mensageria;
aplicar em auditoria;
aplicar em produto;
aplicar em pagamento;
usar break em menu;
usar continue como filtro;
explicar break dentro de switch;
explicar break dentro de loop;
identificar quando break esconde condição ruim;
identificar excesso de continue;
diagnosticar erros comuns;
debugar break e continue;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar laços aninhados em profundidade.

Não precisa ainda dominar labels em loops.

Não precisa ainda dominar tratamento de exceções.

Não precisa ainda dominar streams.

Esses assuntos virão depois.

O objetivo é dominar a diferença prática entre parar processamento e pular item inválido.

---

## Fechamento da aula

Hoje aprendemos duas formas de alterar o fluxo de uma repetição.

Com:

```java
break;
```

paramos o loop.

Com:

```java
continue;
```

pulamos a iteração atual e seguimos para a próxima.

A diferença é simples, mas no backend ela muda completamente o comportamento.

Parar tudo quando deveria apenas pular um item pode deixar muito dado sem processar.

Pular item quando deveria parar tudo pode permitir inconsistência.

Por isso, sempre pergunte:

```text
isso é erro crítico ou só item inválido?
```

Se for erro crítico:

```java
break;
```

Se for item inválido que não impede os próximos:

```java
continue;
```

Na próxima aula, vamos estudar laços aninhados.

Aí veremos o que acontece quando existe um loop dentro de outro, e por que `break` e `continue` precisam ser entendidos com ainda mais cuidado nesse cenário.
