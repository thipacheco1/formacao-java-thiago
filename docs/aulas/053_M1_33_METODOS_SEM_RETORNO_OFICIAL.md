# 053 — M1.33 — Métodos sem Retorno

## Hoje a aula é sobre organizar responsabilidades

Um método é um bloco de código com nome.

Exemplo:

```java
public static void exibirCabecalho() {
    System.out.println("Sistema de Pedidos");
    System.out.println("==================");
}
```

Depois, no `main`, chamamos:

```java
exibirCabecalho();
```

O método executa o que está dentro dele.

Ele não devolve um valor para quem chamou.

Por isso dizemos que é um método sem retorno.

O objetivo da aula é entender:

```text
o que é método;
o que é assinatura;
o que significa void;
como chamar método;
onde declarar método;
como usar parâmetros;
como separar responsabilidades;
como evitar métodos bagunçados;
como aplicar isso em código corporativo.
```

---

## O que é método

Método é um bloco de código com nome, que pode ser chamado para executar uma responsabilidade.

Exemplo:

```java
public static void exibirLinha() {
    System.out.println("--------------------");
}
```

Esse método tem uma responsabilidade simples:

```text
exibir uma linha separadora.
```

Toda vez que quisermos exibir essa linha, chamamos:

```java
exibirLinha();
```

Em vez de repetir:

```java
System.out.println("--------------------");
```

várias vezes.

Método ajuda em:

```text
organização;
reutilização;
clareza;
separação de responsabilidade;
leitura;
manutenção;
teste;
evolução do código.
```

---

## Por que métodos existem

Sem métodos, o código cresce para baixo.

Exemplo ruim:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Sistema");
        System.out.println("=======");

        System.out.println("Cliente: Ana");
        System.out.println("Valor: 1000");
        System.out.println("Status: PENDENTE");

        System.out.println("----------------");

        System.out.println("Cliente: Bruno");
        System.out.println("Valor: 2500");
        System.out.println("Status: APROVADO");

        System.out.println("----------------");

        System.out.println("Fim");
    }
}
```

Funciona.

Mas mistura tudo.

Com métodos:

```java
public class Main {
    public static void main(String[] args) {
        exibirCabecalho();
        exibirPedido("Ana", 1000L, "PENDENTE");
        exibirPedido("Bruno", 2500L, "APROVADO");
        exibirRodape();
    }

    public static void exibirCabecalho() {
        System.out.println("Sistema");
        System.out.println("=======");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("----------------");
    }

    public static void exibirRodape() {
        System.out.println("Fim");
    }
}
```

Agora o `main` conta uma história.

```text
exibir cabeçalho;
exibir pedido;
exibir pedido;
exibir rodapé.
```

Essa é a virada.

---

## Vocabulário essencial

Termos desta aula:

```text
método;
assinatura;
void;
chamada;
parâmetro;
argumento;
corpo do método;
responsabilidade;
organização;
reutilização;
efeito colateral;
static;
main;
escopo;
método auxiliar;
nome de método;
camelCase;
bloco;
retorno;
sem retorno;
procedimento;
extração de método.
```

Termos mais importantes:

```text
método -> bloco de código com nome;
assinatura -> parte que define nome, retorno e parâmetros;
void -> indica que o método não devolve valor;
chamada -> uso do método em algum ponto do código;
parâmetro -> variável recebida pelo método;
argumento -> valor enviado na chamada;
responsabilidade -> aquilo que o método deve fazer;
corpo -> bloco entre chaves do método;
static -> permite chamar diretamente a partir do main static nesta fase.
```

---

## Anatomia de um método sem retorno

Exemplo:

```java
public static void exibirCabecalho() {
    System.out.println("Sistema de Pedidos");
}
```

Partes:

```text
public -> modificador de acesso;
static -> permite chamar no contexto estático do main;
void -> não retorna valor;
exibirCabecalho -> nome do método;
() -> lista de parâmetros, vazia neste exemplo;
{} -> corpo do método.
```

Assinatura simplificada:

```java
public static void exibirCabecalho()
```

Corpo:

```java
{
    System.out.println("Sistema de Pedidos");
}
```

Chamada:

```java
exibirCabecalho();
```

---

## O que significa void

`void` significa:

```text
este método executa uma ação, mas não devolve um valor.
```

Exemplo:

```java
public static void exibirMensagem() {
    System.out.println("Operação concluída");
}
```

Esse método só imprime.

Ele não entrega uma resposta para uma variável.

Chamada correta:

```java
exibirMensagem();
```

Chamada errada:

```java
String mensagem = exibirMensagem();
```

Por quê?

Porque `exibirMensagem()` é `void`.

Ele não retorna `String`.

---

## Void executa ação

Métodos `void` combinam com ações.

Exemplos de nomes bons:

```java
exibirCabecalho()
exibirMenu()
imprimirRelatorio()
registrarLog()
normalizarStatus()
preencherArray()
exibirPedido()
validarEExibirErro()
incrementarTentativa()
alterarStatus()
```

Repare que muitos começam com verbo.

Isso ajuda a mostrar que o método faz algo.

Como regra inicial:

```text
método void deve ter nome de ação.
```

---

## Método com retorno vem depois

Na próxima aula, estudaremos métodos com retorno.

Exemplo futuro:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Hoje ainda não é isso.

Hoje é:

```java
public static void exibirSoma(int a, int b) {
    System.out.println(a + b);
}
```

Diferença:

```text
método void executa uma ação;
método com retorno calcula e devolve um resultado.
```

Não misture.

Se precisa guardar o resultado em variável, provavelmente será assunto da próxima aula.

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
        exibirMensagem();
    }

    public static void exibirMensagem() {
        System.out.println("Olá, método sem retorno!");
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
Olá, método sem retorno!
```

Esse é o menor exemplo útil.

O `main` chama:

```java
exibirMensagem();
```

O método executa:

```java
System.out.println("Olá, método sem retorno!");
```

---

## Onde declarar o método

Nesta fase, vamos declarar os métodos dentro da classe, mas fora do `main`.

Correto:

```java
public class Main {
    public static void main(String[] args) {
        exibirMensagem();
    }

    public static void exibirMensagem() {
        System.out.println("Olá");
    }
}
```

Errado:

```java
public class Main {
    public static void main(String[] args) {
        public static void exibirMensagem() {
            System.out.println("Olá");
        }
    }
}
```

Em Java, você não declara método dentro de outro método.

O método fica dentro da classe.

---

## Chamada de método

Chamar um método significa pedir que ele execute.

Exemplo:

```java
exibirMensagem();
```

A chamada tem:

```text
nome do método;
parênteses;
ponto e vírgula.
```

Se o método tem parâmetros, os valores vão dentro dos parênteses.

Exemplo:

```java
exibirMensagem("Pedido aprovado");
```

Sem chamada, o método não executa.

Declarar método não é suficiente.

---

## Declarar não executa

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Início");
        System.out.println("Fim");
    }

    public static void exibirMensagem() {
        System.out.println("Mensagem do método");
    }
}
```

Saída:

```text
Início
Fim
```

O método `exibirMensagem()` existe, mas não foi chamado.

Para executar:

```java
public static void main(String[] args) {
    System.out.println("Início");
    exibirMensagem();
    System.out.println("Fim");
}
```

Saída:

```text
Início
Mensagem do método
Fim
```

---

## Ordem de execução

A execução começa no `main`.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("A");
        exibir();
        System.out.println("C");
    }

    public static void exibir() {
        System.out.println("B");
    }
}
```

Saída:

```text
A
B
C
```

O Java executa:

```text
entra no main;
imprime A;
chama exibir;
executa o corpo de exibir;
volta para o main;
imprime C.
```

Método não “puxa” execução sozinho.

Ele é chamado.

---

## Método sem parâmetro

Exemplo:

```java
public static void exibirCabecalho() {
    System.out.println("====================");
    System.out.println("SISTEMA DE PEDIDOS");
    System.out.println("====================");
}
```

Chamada:

```java
exibirCabecalho();
```

Esse método não precisa receber nada.

Ele sempre imprime o mesmo cabeçalho.

Use método sem parâmetro quando a ação não depende de valor externo.

---

## Exemplo com cabeçalho e rodapé

Arquivo:

```text
CabecalhoRodape.java
```

Código:

```java
public class CabecalhoRodape {
    public static void main(String[] args) {
        exibirCabecalho();

        System.out.println("Processando pedidos...");

        exibirRodape();
    }

    public static void exibirCabecalho() {
        System.out.println("====================");
        System.out.println("SISTEMA DE PEDIDOS");
        System.out.println("====================");
    }

    public static void exibirRodape() {
        System.out.println("====================");
        System.out.println("FIM DO PROCESSAMENTO");
        System.out.println("====================");
    }
}
```

Esse exemplo mostra organização visual.

O `main` ficou mais limpo.

---

## Método com parâmetro

Parâmetro permite que o método receba valor.

Exemplo:

```java
public static void exibirMensagem(String mensagem) {
    System.out.println(mensagem);
}
```

Chamada:

```java
exibirMensagem("Pedido aprovado");
exibirMensagem("Pedido recusado");
```

Saída:

```text
Pedido aprovado
Pedido recusado
```

O método é o mesmo.

O texto muda porque enviamos argumentos diferentes.

---

## Parâmetro versus argumento

Na declaração:

```java
public static void exibirMensagem(String mensagem) {
```

`mensagem` é parâmetro.

Na chamada:

```java
exibirMensagem("Pedido aprovado");
```

`"Pedido aprovado"` é argumento.

Resumo:

```text
parâmetro -> variável declarada no método;
argumento -> valor enviado na chamada.
```

Essa diferença será importante durante todo o curso.

---

## Exemplo com parâmetro

Arquivo:

```text
MensagemComParametro.java
```

Código:

```java
public class MensagemComParametro {
    public static void main(String[] args) {
        exibirMensagem("Pedido criado com sucesso");
        exibirMensagem("Pedido aprovado");
        exibirMensagem("Pedido cancelado");
    }

    public static void exibirMensagem(String mensagem) {
        System.out.println("[INFO] " + mensagem);
    }
}
```

Saída:

```text
[INFO] Pedido criado com sucesso
[INFO] Pedido aprovado
[INFO] Pedido cancelado
```

Repare que padronizamos a mensagem em um único lugar.

---

## Método com mais de um parâmetro

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status) {
    System.out.println("Cliente: " + cliente);
    System.out.println("Valor: " + valorCentavos);
    System.out.println("Status: " + status);
}
```

Chamada:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

Ordem dos argumentos importa.

A chamada deve obedecer a ordem da assinatura:

```text
String cliente;
long valorCentavos;
String status.
```

---

## Exemplo aplicado: exibir pedido

Arquivo:

```text
ExibirPedido.java
```

Código:

```java
public class ExibirPedido {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
        exibirPedido("Bruno", 2500L, "APROVADO");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Saída:

```text
Cliente: Ana
Valor em centavos: 1000
Status: PENDENTE
--------------------
Cliente: Bruno
Valor em centavos: 2500
Status: APROVADO
--------------------
```

Esse método tem uma responsabilidade:

```text
exibir os dados de um pedido.
```

---

## Assinatura do método

A assinatura identifica como o método é chamado.

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status)
```

Partes importantes da assinatura:

```text
nome -> exibirPedido;
tipo de retorno -> void;
parâmetros -> String, long, String.
```

Quando chamamos:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

a chamada precisa combinar com a assinatura.

Se errar tipo, quantidade ou ordem, o código não compila.

---

## Responsabilidade do método

Um método deve ter uma responsabilidade clara.

Bom:

```java
exibirPedido(...)
```

Responsabilidade:

```text
exibir pedido.
```

Bom:

```java
exibirCabecalho()
```

Responsabilidade:

```text
exibir cabeçalho.
```

Ruim:

```java
processarTudo()
```

Responsabilidade vaga.

Ruim:

```java
fazerCoisas()
```

Não diz nada.

Ruim:

```java
validarCalcularSalvarExibir()
```

Mistura responsabilidades.

Método bom tem nome claro e faz uma coisa principal.

---

## Método deve contar uma história

Veja este `main`:

```java
public static void main(String[] args) {
    exibirCabecalho();
    exibirPedido("Ana", 1000L, "PENDENTE");
    exibirPedido("Bruno", 2500L, "APROVADO");
    exibirRodape();
}
```

Mesmo sem ler os métodos, entendemos a história.

```text
exibe cabeçalho;
exibe dois pedidos;
exibe rodapé.
```

Esse é o objetivo.

O `main` deve virar um roteiro.

Os métodos carregam os detalhes.

---

## Extração de método

Extrair método significa pegar um bloco que estava no `main` e transformar em método.

Antes:

```java
public static void main(String[] args) {
    System.out.println("====================");
    System.out.println("SISTEMA");
    System.out.println("====================");

    System.out.println("Processando...");
}
```

Depois:

```java
public static void main(String[] args) {
    exibirCabecalho();

    System.out.println("Processando...");
}

public static void exibirCabecalho() {
    System.out.println("====================");
    System.out.println("SISTEMA");
    System.out.println("====================");
}
```

O comportamento é o mesmo.

A organização melhora.

---

## Exemplo aplicado: relatório de pedidos

Arquivo:

```text
RelatorioPedidosComMetodos.java
```

Código:

```java
public class RelatorioPedidosComMetodos {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        exibirCabecalhoRelatorio();

        for (int indice = 0; indice < clientes.length; indice++) {
            exibirPedido(clientes[indice], valoresCentavos[indice], statusPedidos[indice]);
        }

        exibirRodapeRelatorio();
    }

    public static void exibirCabecalhoRelatorio() {
        System.out.println("====================");
        System.out.println("RELATÓRIO DE PEDIDOS");
        System.out.println("====================");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }

    public static void exibirRodapeRelatorio() {
        System.out.println("====================");
        System.out.println("FIM DO RELATÓRIO");
        System.out.println("====================");
    }
}
```

Esse exemplo reaproveita arrays paralelos e métodos sem retorno.

O `main` ficou mais organizado.

---

## Método recebendo array

Método também pode receber array.

Exemplo:

```java
public static void exibirClientes(String[] clientes) {
    for (int indice = 0; indice < clientes.length; indice++) {
        System.out.println(clientes[indice]);
    }
}
```

Chamada:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};

exibirClientes(clientes);
```

O método recebe o array e exibe seus elementos.

Ele não retorna nada.

Ele apenas executa uma ação.

---

## Exemplo: exibir array de clientes

Arquivo:

```text
ExibirArrayClientes.java
```

Código:

```java
public class ExibirArrayClientes {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};

        exibirClientes(clientes);
    }

    public static void exibirClientes(String[] clientes) {
        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println("Cliente " + (indice + 1) + ": " + clientes[indice]);
        }
    }
}
```

Esse padrão será muito usado.

Métodos podem receber:

```text
int[];
long[];
double[];
String[];
int[][];
```

e assim por diante.

---

## Exemplo: exibir matriz

Arquivo:

```text
ExibirMatrizComMetodo.java
```

Código:

```java
public class ExibirMatrizComMetodo {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        exibirMatriz(matriz);
    }

    public static void exibirMatriz(int[][] matriz) {
        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Aqui o método recebe uma matriz e imprime.

Responsabilidade:

```text
exibir matriz.
```

Ele não calcula retorno.

Ele só executa a exibição.

---

## Métodos void com efeito colateral

Método `void` pode alterar algo recebido.

Exemplo:

```java
public static void normalizarStatus(String[] statusPedidos) {
    for (int indice = 0; indice < statusPedidos.length; indice++) {
        statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
    }
}
```

Chamada:

```java
String[] status = {" pendente ", "aprovado"};

normalizarStatus(status);
```

Depois da chamada, o array foi alterado.

Isso é um efeito colateral.

Efeito colateral significa que o método alterou algo fora dele.

Isso pode ser útil, mas exige cuidado.

---

## Exemplo: normalizar status

Arquivo:

```text
NormalizarStatusComMetodo.java
```

Código:

```java
public class NormalizarStatusComMetodo {
    public static void main(String[] args) {
        String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};

        normalizarStatus(statusPedidos);
        exibirStatus(statusPedidos);
    }

    public static void normalizarStatus(String[] statusPedidos) {
        for (int indice = 0; indice < statusPedidos.length; indice++) {
            statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
        }
    }

    public static void exibirStatus(String[] statusPedidos) {
        for (int indice = 0; indice < statusPedidos.length; indice++) {
            System.out.println(statusPedidos[indice]);
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

O método `normalizarStatus` alterou o array.

---

## Cuidado com efeito colateral

Métodos que alteram arrays precisam ter nomes claros.

Bom:

```java
normalizarStatus(statusPedidos);
```

Esse nome indica alteração.

Bom:

```java
incrementarTentativa(tentativas, indice);
```

Esse nome indica alteração.

Ruim:

```java
exibirStatus(statusPedidos);
```

mas dentro dele alterar os status.

Se o método se chama `exibir`, ele deveria apenas exibir.

Nome e comportamento precisam combinar.

---

## Exemplo aplicado: incrementar tentativas de mensageria

Arquivo:

```text
IncrementarTentativaComMetodo.java
```

Código:

```java
public class IncrementarTentativaComMetodo {
    public static void main(String[] args) {
        int[] tentativas = {1, 2, 0};

        incrementarTentativa(tentativas, 2);
        exibirTentativas(tentativas);
    }

    public static void incrementarTentativa(int[] tentativas, int indice) {
        if (indice >= 0 && indice < tentativas.length) {
            tentativas[indice]++;
        } else {
            System.out.println("Índice inválido para tentativa.");
        }
    }

    public static void exibirTentativas(int[] tentativas) {
        for (int indice = 0; indice < tentativas.length; indice++) {
            System.out.println("Mensagem " + (indice + 1)
                    + " - tentativas: " + tentativas[indice]);
        }
    }
}
```

Esse exemplo mostra:

```text
método que altera array;
validação de índice;
método que exibe array.
```

---

## Exemplo aplicado: auditoria simulada

Arquivo:

```text
AuditoriaComMetodos.java
```

Código:

```java
public class AuditoriaComMetodos {
    public static void main(String[] args) {
        registrarAuditoria("aline", "CRIACAO", "SUCESSO");
        registrarAuditoria("jackson", "EDICAO", "SUCESSO");
        registrarAuditoria("guilherme", "EXCLUSAO", "RECUSADO");
    }

    public static void registrarAuditoria(String usuario, String operacao, String status) {
        System.out.println("AUDITORIA");
        System.out.println("Usuário: " + usuario);
        System.out.println("Operação: " + operacao);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Aqui o método apenas exibe um registro de auditoria simulado.

No futuro, auditoria real envolveria objeto, data, banco, usuário autenticado e outras camadas.

Nesta fase, o foco é organização.

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoComMetodos.java
```

Código:

```java
public class OrdemServicoComMetodos {
    public static void main(String[] args) {
        exibirOrdemServico("OS-001", "ABERTA", 3);
        exibirOrdemServico("OS-002", "CONCLUIDA", 5);
    }

    public static void exibirOrdemServico(String certificado, String status, int quantidadeAtividades) {
        System.out.println("Ordem de Serviço");
        System.out.println("Certificado: " + certificado);
        System.out.println("Status: " + status);
        System.out.println("Atividades: " + quantidadeAtividades);
        System.out.println("--------------------");
    }
}
```

Responsabilidade:

```text
exibir dados resumidos de uma OS.
```

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoComMetodos.java
```

Código:

```java
public class ProdutoComMetodos {
    public static void main(String[] args) {
        exibirProduto("Mesa", 10, "ATIVO");
        exibirProduto("Cadeira", 0, "ATIVO");
    }

    public static void exibirProduto(String nome, int estoque, String status) {
        System.out.println("Produto: " + nome);
        System.out.println("Estoque: " + estoque);
        System.out.println("Status: " + status);

        if (estoque == 0 && "ATIVO".equals(status)) {
            System.out.println("Atenção: produto ativo sem estoque.");
        }

        System.out.println("--------------------");
    }
}
```

Esse método tem uma responsabilidade principal:

```text
exibir produto com alerta simples.
```

Ainda é aceitável neste nível.

Se crescer demais, seria dividido.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoComMetodos.java
```

Código:

```java
public class PagamentoComMetodos {
    public static void main(String[] args) {
        exibirPagamento(10000L, 4);
        exibirPagamento(2500L, 1);
    }

    public static void exibirPagamento(long valorCentavos, int parcelas) {
        System.out.println("Pagamento");
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);

        if (parcelas <= 0) {
            System.out.println("Parcelas inválidas.");
        } else {
            long valorParcela = valorCentavos / parcelas;
            System.out.println("Valor aproximado da parcela: " + valorParcela);
        }

        System.out.println("--------------------");
    }
}
```

Esse método não retorna o valor da parcela.

Ele apenas exibe.

Na próxima aula, um cálculo como esse poderá virar método com retorno.

---

## Void com return vazio

Em método `void`, é permitido usar:

```java
return;
```

sem valor.

Isso encerra o método antecipadamente.

Exemplo:

```java
public static void exibirPagamento(long valorCentavos) {
    if (valorCentavos <= 0) {
        System.out.println("Valor inválido.");
        return;
    }

    System.out.println("Valor: " + valorCentavos);
}
```

Atenção:

```text
return; em void não devolve valor;
ele apenas sai do método.
```

Não confunda com:

```java
return valor;
```

Isso não pode em método `void`.

---

## Exemplo com return vazio

Arquivo:

```text
ReturnVazioEmVoid.java
```

Código:

```java
public class ReturnVazioEmVoid {
    public static void main(String[] args) {
        exibirPagamento(-100L);
        exibirPagamento(2500L);
    }

    public static void exibirPagamento(long valorCentavos) {
        if (valorCentavos <= 0) {
            System.out.println("Valor inválido.");
            return;
        }

        System.out.println("Valor válido: " + valorCentavos);
    }
}
```

Saída:

```text
Valor inválido.
Valor válido: 2500
```

O primeiro caso para no `return;`.

O segundo segue até o final.

Use com moderação.

---

## Métodos podem chamar outros métodos

Exemplo:

```java
public static void exibirRelatorio() {
    exibirCabecalho();
    exibirConteudo();
    exibirRodape();
}
```

Métodos podem organizar outros métodos.

Arquivo:

```text
MetodoChamandoMetodo.java
```

Código:

```java
public class MetodoChamandoMetodo {
    public static void main(String[] args) {
        exibirRelatorio();
    }

    public static void exibirRelatorio() {
        exibirCabecalho();
        System.out.println("Conteúdo do relatório");
        exibirRodape();
    }

    public static void exibirCabecalho() {
        System.out.println("==== RELATÓRIO ====");
    }

    public static void exibirRodape() {
        System.out.println("==== FIM ====");
    }
}
```

O `main` fica ainda mais limpo:

```java
exibirRelatorio();
```

---

## Organização do arquivo

Nesta fase, uma organização simples é:

```java
public class Main {
    public static void main(String[] args) {
        // roteiro principal
    }

    public static void metodo1() {
        // detalhe
    }

    public static void metodo2() {
        // detalhe
    }

    public static void metodo3() {
        // detalhe
    }
}
```

Regra inicial:

```text
main primeiro;
métodos auxiliares depois.
```

Isso não é a única forma possível.

Mas é boa para aprender.

---

## Nome de método

Use camelCase.

Bom:

```java
exibirCabecalho()
exibirPedido()
validarStatus()
normalizarStatus()
registrarAuditoria()
incrementarTentativa()
```

Ruim:

```java
ExibirCabecalho()
exibir_cabecalho()
EXIBIRCABECALHO()
faz()
coisa()
teste1()
```

Nome de método deve comunicar ação.

---

## Método muito grande

Se um método tem muitas responsabilidades, ele começa a virar um novo `main` bagunçado.

Sinais de método grande demais:

```text
faz entrada, validação, cálculo, exibição, alteração e relatório tudo junto;
tem muitos ifs de domínios diferentes;
tem muitos loops sem separação;
nome do método é genérico;
difícil explicar em uma frase o que ele faz.
```

Melhor dividir.

Exemplo:

```java
exibirCabecalho();
exibirPedidos();
exibirResumo();
```

Não precisa exagerar.

Mas também não deixe tudo em um bloco gigante.

---

## Método sem retorno não significa método inútil

Algumas ações não precisam retornar valor.

Exemplos:

```text
exibir menu;
imprimir relatório;
normalizar array;
registrar log;
incrementar contador;
alterar status;
preencher matriz;
mostrar mensagem de erro.
```

Essas ações podem ser úteis como `void`.

Mas, se a intenção é calcular e usar resultado, método com retorno será melhor.

Exemplo:

```text
calcular total;
calcular média;
buscar índice;
validar e devolver boolean.
```

Esses casos entram melhor na próxima aula.

---

## Quando usar método void nesta fase

Use `void` quando a intenção for:

```text
exibir algo;
alterar algo recebido;
preencher estrutura;
normalizar dados;
registrar mensagem;
organizar blocos de execução.
```

Exemplos:

```java
exibirMenu();
exibirRelatorioPedidos(...);
preencherValores(...);
normalizarStatus(...);
incrementarTentativa(...);
registrarAuditoria(...);
```

Evite `void` quando a intenção for produzir valor para outra parte usar.

Exemplo:

```text
calcular soma
calcular média
buscar posição
validar status
```

Esses combinam melhor com retorno, que vem na próxima aula.

---

## Erros comuns

### Erro 1 — Declarar método dentro do main

Errado:

```java
public static void main(String[] args) {
    public static void exibir() {
        System.out.println("Oi");
    }
}
```

Método deve ficar dentro da classe, fora de outro método.

---

### Erro 2 — Esquecer de chamar o método

Declarar:

```java
public static void exibir() {
    System.out.println("Oi");
}
```

não executa sozinho.

Precisa chamar:

```java
exibir();
```

---

### Erro 3 — Tentar guardar resultado de void

Errado:

```java
String texto = exibirMensagem();
```

Se `exibirMensagem()` é `void`, não retorna valor.

---

### Erro 4 — Retornar valor em método void

Errado:

```java
public static void calcular() {
    return 10;
}
```

`void` não retorna valor.

Pode usar apenas:

```java
return;
```

sem valor, quando quiser sair antecipadamente.

---

### Erro 5 — Esquecer static nesta fase

Se o `main` é static, métodos chamados diretamente por ele também precisam ser static nesta fase.

Exemplo correto:

```java
public static void exibir() {
}
```

Se esquecer `static`, pode aparecer erro sobre referência a método não estático.

Mais tarde, com objetos, isso será aprofundado.

---

### Erro 6 — Passar argumentos na ordem errada

Assinatura:

```java
exibirPedido(String cliente, long valor, String status)
```

Chamada errada:

```java
exibirPedido(1000L, "Ana", "PENDENTE");
```

A ordem precisa bater.

---

### Erro 7 — Nome genérico demais

Ruim:

```java
processar()
fazer()
rodar()
coisa()
```

Bom:

```java
exibirPedido()
normalizarStatus()
registrarAuditoria()
```

---

### Erro 8 — Método com responsabilidade demais

Ruim:

```java
lerValidarCalcularExibirSalvarTudo()
```

Melhor dividir.

---

### Erro 9 — Método diz uma coisa e faz outra

Ruim:

```java
exibirStatus()
```

mas dentro dele altera o status.

Nome e comportamento precisam combinar.

---

### Erro 10 — Chamada recursiva sem querer

Exemplo perigoso:

```java
public static void exibir() {
    exibir();
}
```

Isso chama o próprio método sem parar.

Ainda não estamos estudando recursão.

Evite.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-053-metodos-sem-retorno
cd labs\m1\aula-053-metodos-sem-retorno
```

Crie arquivos:

```text
Main.java
CabecalhoRodape.java
MensagemComParametro.java
ExibirPedido.java
RelatorioPedidosComMetodos.java
ExibirArrayClientes.java
ExibirMatrizComMetodo.java
NormalizarStatusComMetodo.java
IncrementarTentativaComMetodo.java
AuditoriaComMetodos.java
OrdemServicoComMetodos.java
ProdutoComMetodos.java
PagamentoComMetodos.java
ReturnVazioEmVoid.java
MetodoChamandoMetodo.java
ErroMetodoDentroMain.java
ErroMetodoNaoChamado.java
ErroGuardarRetornoVoid.java
ErroReturnValorEmVoid.java
ErroSemStatic.java
ErroChamadaRecursiva.java
```

Compile:

```powershell
javac Main.java
javac CabecalhoRodape.java
javac MensagemComParametro.java
javac ExibirPedido.java
javac RelatorioPedidosComMetodos.java
javac ExibirArrayClientes.java
javac ExibirMatrizComMetodo.java
javac NormalizarStatusComMetodo.java
javac IncrementarTentativaComMetodo.java
javac AuditoriaComMetodos.java
javac OrdemServicoComMetodos.java
javac ProdutoComMetodos.java
javac PagamentoComMetodos.java
javac ReturnVazioEmVoid.java
javac MetodoChamandoMetodo.java
javac ErroMetodoDentroMain.java
javac ErroMetodoNaoChamado.java
javac ErroGuardarRetornoVoid.java
javac ErroReturnValorEmVoid.java
javac ErroSemStatic.java
javac ErroChamadaRecursiva.java
```

Execute:

```powershell
java Main
java CabecalhoRodape
java MensagemComParametro
java ExibirPedido
java RelatorioPedidosComMetodos
java ExibirArrayClientes
java ExibirMatrizComMetodo
java NormalizarStatusComMetodo
java IncrementarTentativaComMetodo
java AuditoriaComMetodos
java OrdemServicoComMetodos
java ProdutoComMetodos
java PagamentoComMetodos
java ReturnVazioEmVoid
java MetodoChamandoMetodo
java ErroMetodoDentroMain
java ErroMetodoNaoChamado
java ErroGuardarRetornoVoid
java ErroReturnValorEmVoid
java ErroSemStatic
java ErroChamadaRecursiva
```

Alguns arquivos de erro proposital não devem compilar ou podem executar de forma incorreta.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroGuardarRetornoVoid.java`

```java
public class ErroGuardarRetornoVoid {
    public static void main(String[] args) {
        String texto = exibirMensagem();

        System.out.println(texto);
    }

    public static void exibirMensagem() {
        System.out.println("Mensagem");
    }
}
```

Objetivo:

```text
entender que método void não devolve valor.
```

---

## Arquivo sugerido: `ErroReturnValorEmVoid.java`

```java
public class ErroReturnValorEmVoid {
    public static void main(String[] args) {
        calcular();
    }

    public static void calcular() {
        return 10;
    }
}
```

Objetivo:

```text
entender que método void não pode retornar valor.
```

---

## Arquivo sugerido: `ErroChamadaRecursiva.java`

```java
public class ErroChamadaRecursiva {
    public static void main(String[] args) {
        exibir();
    }

    public static void exibir() {
        System.out.println("Executando...");
        exibir();
    }
}
```

Objetivo:

```text
perceber o risco de um método chamar a si mesmo sem critério.
```

Não use esse padrão agora.

Recursão será assunto futuro, com controle e intenção.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("A");
        exibir();
        System.out.println("C");
    }

    public static void exibir() {
        System.out.println("B");
    }
}
```

Coloque breakpoint em:

```java
exibir();
```

Use Step Into.

Observe:

```text
main começa;
chega na chamada;
entra no método;
executa o corpo;
volta para o main.
```

Esse debug fixa o conceito de chamada de método.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-053-metodos-sem-retorno docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 053: pratica metodos sem retorno em Java"
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
explicar o que é método;
explicar o que é assinatura;
explicar o que significa void;
criar método sem retorno;
chamar método sem retorno;
declarar método fora do main;
usar método sem parâmetro;
usar método com parâmetro;
usar método com vários parâmetros;
diferenciar parâmetro e argumento;
explicar ordem de execução;
usar método para exibir cabeçalho;
usar método para exibir pedido;
usar método para exibir array;
usar método para exibir matriz;
usar método para normalizar status;
usar método para incrementar tentativa;
entender efeito colateral;
usar return vazio com moderação;
criar método chamando outro método;
organizar o arquivo com main e auxiliares;
nomear métodos com verbos claros;
evitar método grande demais;
identificar método com responsabilidade ruim;
aplicar método em pedido;
aplicar método em produto;
aplicar método em pagamento;
aplicar método em OS;
aplicar método em auditoria;
aplicar método em mensageria;
diagnosticar erros comuns;
debugar chamada de método;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar métodos com retorno.

Não precisa ainda dominar sobrecarga.

Não precisa ainda dominar recursão.

Não precisa ainda dominar classes e objetos.

Não precisa ainda dominar injeção de dependência.

Esses assuntos virão depois.

O objetivo é dominar métodos `void` como ferramenta de organização e execução de ações.

---

## Fechamento da aula

Hoje aprendemos métodos sem retorno.

A ideia central foi:

```text
um método é um bloco de código com nome e responsabilidade.
```

O método sem retorno usa:

```java
void
```

Exemplo:

```java
public static void exibirMensagem() {
    System.out.println("Mensagem");
}
```

E a chamada é:

```java
exibirMensagem();
```

Vimos que métodos ajudam a transformar um `main` grande e bagunçado em um roteiro legível.

Também aprendemos:

```text
assinatura;
parâmetros;
argumentos;
chamada;
static;
responsabilidade;
efeito colateral;
return vazio;
método chamando método;
erros comuns.
```

O ponto mais importante é:

```text
método bom tem nome claro e responsabilidade clara.
```

Na próxima aula, vamos estudar métodos com retorno.

Aí vamos aprender a criar métodos que calculam alguma coisa e devolvem um resultado para o código que chamou.
