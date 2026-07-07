# 057 — M1.37 — Escopo de Variáveis

## Onde estamos na formação

Estamos no Módulo 1, aprofundando o funcionamento interno dos métodos e das variáveis.

A sequência recente foi:

```text
053 — M1.33 — Métodos sem retorno;
054 — M1.34 — Métodos com retorno;
055 — M1.35 — Métodos com parâmetros;
056 — M1.36 — Sobrecarga de métodos inicial;
057 — M1.37 — Escopo de variáveis.
```

Nas aulas anteriores, criamos métodos como:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Também usamos variáveis dentro de métodos:

```java
int resultado = somar(10, 20);
```

Agora precisamos entender uma pergunta fundamental:

```text
onde uma variável existe?
```

E também:

```text
onde ela pode ser usada?
quando ela nasce?
quando ela deixa de existir?
por que uma variável criada dentro de um if não existe fora dele?
por que uma variável do for não existe depois do for?
por que um parâmetro só existe dentro do método?
por que duas variáveis com o mesmo nome podem confundir?
```

Essas perguntas pertencem ao tema:

```text
escopo de variáveis.
```

Escopo é um assunto essencial para escrever código limpo, corrigir erros de compilação e entender métodos.

---

## Hoje a aula é sobre onde a variável existe

Uma variável não existe em qualquer lugar do programa.

Ela existe dentro de uma região.

Essa região é chamada de escopo.

Exemplo:

```java
public static void main(String[] args) {
    int quantidade = 10;

    System.out.println(quantidade);
}
```

A variável `quantidade` existe dentro do método `main`.

Agora veja:

```java
public static void exibir() {
    System.out.println(quantidade);
}
```

Esse método não enxerga `quantidade`, porque ela foi criada dentro do `main`.

Para outro método usar esse valor, precisamos passar como parâmetro:

```java
exibir(quantidade);
```

e declarar:

```java
public static void exibir(int quantidade) {
    System.out.println(quantidade);
}
```

Esse é o tipo de coisa que escopo explica.

---

## O que é escopo

Escopo é a região do código onde um nome pode ser usado.

Esse nome pode ser:

```text
uma variável local;
um parâmetro;
uma variável de bloco;
uma variável de loop;
um campo da classe.
```

Nesta aula, o foco principal é:

```text
variável local;
parâmetro;
bloco;
tempo de vida;
sombra.
```

Exemplo simples:

```java
public static void main(String[] args) {
    int valor = 10;

    if (valor > 0) {
        String mensagem = "Valor positivo";
        System.out.println(mensagem);
    }

    System.out.println(valor);
}
```

Aqui:

```text
valor existe dentro do main;
mensagem existe apenas dentro do bloco do if.
```

Se tentarmos usar `mensagem` fora do `if`, dá erro.

---

## Por que escopo existe

Escopo existe para organizar e proteger o código.

Sem escopo, qualquer variável poderia ser usada em qualquer lugar.

Isso causaria problemas como:

```text
nomes se misturando;
variáveis sendo alteradas sem controle;
métodos dependendo de variáveis escondidas;
erros difíceis de encontrar;
código impossível de manter;
conflitos de nomes;
regras de negócio vazando para lugares errados.
```

Com escopo, Java obriga você a deixar claro:

```text
onde a variável nasce;
onde ela pode ser usada;
quando ela deixa de existir;
quais dados entram em um método;
quais dados ficam apenas em um bloco.
```

Isso é muito importante em backend.

Em sistemas reais, uma variável de pedido não pode simplesmente “vazar” para uma rotina de produto.

Uma variável de auditoria não deveria ser usada fora do ponto correto.

Uma variável de validação não deveria sobreviver além do necessário.

Escopo ajuda a manter responsabilidade.

---

## Vocabulário essencial

Termos desta aula:

```text
escopo;
variável local;
parâmetro;
bloco;
tempo de vida;
visibilidade;
nascimento da variável;
fim da variável;
chaves;
if;
else;
for;
while;
método;
main;
sombra;
shadowing;
campo da classe;
variável local não inicializada;
inicialização;
conflito de nome;
variável de controle;
índice do loop;
variável temporária;
responsabilidade;
vazamento de escopo.
```

Termos mais importantes:

```text
escopo -> região onde uma variável pode ser usada;
variável local -> variável criada dentro de um método ou bloco;
parâmetro -> variável recebida por um método;
bloco -> região delimitada por chaves;
tempo de vida -> período em que a variável existe;
sombra -> quando uma variável local ou parâmetro esconde um campo com o mesmo nome;
visibilidade -> onde o nome pode ser enxergado pelo código.
```

---

## Blocos e chaves

Em Java, chaves delimitam blocos:

```java
{
    // bloco
}
```

Exemplos de blocos:

```java
public static void main(String[] args) {
    // bloco do método
}
```

```java
if (condicao) {
    // bloco do if
}
```

```java
for (int indice = 0; indice < 10; indice++) {
    // bloco do for
}
```

Variáveis criadas dentro de um bloco normalmente só existem dentro dele.

Exemplo:

```java
if (true) {
    int valor = 10;
    System.out.println(valor);
}

System.out.println(valor);
```

A última linha dá erro, porque `valor` só existe dentro do bloco do `if`.

---

## Variável local

Variável local é uma variável declarada dentro de um método ou bloco.

Exemplo:

```java
public static void main(String[] args) {
    int quantidade = 10;
}
```

`quantidade` é variável local do método `main`.

Outro exemplo:

```java
public static void exibirPedido() {
    String cliente = "Ana";
    long valorCentavos = 1000L;
}
```

`cliente` e `valorCentavos` são variáveis locais do método `exibirPedido`.

Elas não existem fora desse método.

---

## Parâmetro também tem escopo

Parâmetro é uma variável que nasce na chamada do método e existe dentro daquele método.

Exemplo:

```java
public static void exibirCliente(String nome) {
    System.out.println(nome);
}
```

O parâmetro `nome` existe dentro de:

```java
exibirCliente
```

Ele não existe no `main`, a menos que exista outra variável com o mesmo nome lá.

Exemplo:

```java
public static void main(String[] args) {
    exibirCliente("Ana");
}

public static void exibirCliente(String nome) {
    System.out.println(nome);
}
```

Aqui, `"Ana"` entra no método e fica disponível pelo parâmetro `nome`.

Depois que o método termina, esse parâmetro deixa de existir.

---

## Tempo de vida

Tempo de vida é o período em que a variável existe.

Exemplo:

```java
public static void main(String[] args) {
    int valor = 10;

    System.out.println(valor);
}
```

`valor` nasce nesta linha:

```java
int valor = 10;
```

e vive até o fim do bloco do `main`.

Quando o `main` termina, `valor` deixa de existir.

Outro exemplo:

```java
if (true) {
    String mensagem = "OK";
    System.out.println(mensagem);
}
```

`mensagem` nasce dentro do `if` e morre no fim do bloco do `if`.

---

## Visibilidade

Visibilidade responde:

```text
de onde eu consigo acessar essa variável?
```

Exemplo:

```java
public static void main(String[] args) {
    int valor = 10;

    if (valor > 0) {
        System.out.println(valor);
    }
}
```

A variável `valor` foi declarada no bloco externo do `main`.

O bloco interno do `if` consegue enxergar `valor`.

Agora o contrário não funciona:

```java
if (true) {
    int valor = 10;
}

System.out.println(valor);
```

O bloco externo não enxerga variável criada dentro do bloco interno.

Regra inicial:

```text
bloco interno enxerga variável do bloco externo;
bloco externo não enxerga variável criada dentro do bloco interno.
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
        int valor = 10;

        System.out.println("Valor dentro do main: " + valor);
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
Valor dentro do main: 10
```

Esse exemplo é simples.

A variável `valor` existe no bloco do `main`.

---

## Exemplo mínimo com bloco if

Arquivo:

```text
EscopoIf.java
```

Código:

```java
public class EscopoIf {
    public static void main(String[] args) {
        int valor = 10;

        if (valor > 0) {
            String mensagem = "Valor positivo";

            System.out.println(mensagem);
            System.out.println(valor);
        }

        System.out.println("Valor fora do if: " + valor);
    }
}
```

Saída:

```text
Valor positivo
10
Valor fora do if: 10
```

Aqui:

```text
valor existe no main inteiro;
mensagem existe apenas dentro do if.
```

---

## Erro ao usar variável fora do bloco

Arquivo:

```text
ErroVariavelForaDoIf.java
```

Código propositalmente errado:

```java
public class ErroVariavelForaDoIf {
    public static void main(String[] args) {
        int valor = 10;

        if (valor > 0) {
            String mensagem = "Valor positivo";
        }

        System.out.println(mensagem);
    }
}
```

Esse código não compila.

Motivo:

```text
mensagem foi declarada dentro do if;
fora do if ela não existe.
```

Correção:

```java
public class ErroVariavelForaDoIf {
    public static void main(String[] args) {
        int valor = 10;
        String mensagem = "";

        if (valor > 0) {
            mensagem = "Valor positivo";
        }

        System.out.println(mensagem);
    }
}
```

Agora `mensagem` foi declarada no escopo externo e pode ser usada depois.

---

## Cuidado com inicialização

A correção anterior pode gerar outro cuidado.

Exemplo:

```java
String mensagem;

if (valor > 0) {
    mensagem = "Valor positivo";
}

System.out.println(mensagem);
```

Isso pode não compilar, porque se `valor` não for maior que 0, `mensagem` não recebe valor.

Variáveis locais em Java precisam ser inicializadas antes de uso.

Correção segura:

```java
String mensagem = "Valor não positivo";

if (valor > 0) {
    mensagem = "Valor positivo";
}

System.out.println(mensagem);
```

Agora sempre há valor.

---

## Variável local precisa ser inicializada

Diferente de arrays e campos, variável local não recebe valor padrão automaticamente para uso.

Exemplo errado:

```java
public class VariavelLocalNaoInicializada {
    public static void main(String[] args) {
        int quantidade;

        System.out.println(quantidade);
    }
}
```

Isso não compila.

Motivo:

```text
quantidade foi declarada, mas não inicializada.
```

Correção:

```java
int quantidade = 0;
```

ou:

```java
int quantidade = 10;
```

Regra:

```text
variável local precisa receber valor antes de ser usada.
```

---

## Escopo do for

Arquivo:

```text
EscopoFor.java
```

Código:

```java
public class EscopoFor {
    public static void main(String[] args) {
        for (int indice = 0; indice < 3; indice++) {
            System.out.println("Índice dentro do for: " + indice);
        }
    }
}
```

Saída:

```text
Índice dentro do for: 0
Índice dentro do for: 1
Índice dentro do for: 2
```

A variável `indice` foi criada dentro do `for`.

Ela existe apenas no `for`.

---

## Erro usando índice fora do for

Arquivo:

```text
ErroIndiceForaDoFor.java
```

Código propositalmente errado:

```java
public class ErroIndiceForaDoFor {
    public static void main(String[] args) {
        for (int indice = 0; indice < 3; indice++) {
            System.out.println(indice);
        }

        System.out.println("Último índice: " + indice);
    }
}
```

Esse código não compila.

Motivo:

```text
indice só existe dentro do for.
```

Se precisar usar depois, declare antes:

```java
int indice;

for (indice = 0; indice < 3; indice++) {
    System.out.println(indice);
}

System.out.println("Índice depois do for: " + indice);
```

Mas use isso apenas quando realmente fizer sentido.

Na maioria dos casos, o índice deve ficar restrito ao `for`.

---

## Escopo do while

Arquivo:

```text
EscopoWhile.java
```

Código:

```java
public class EscopoWhile {
    public static void main(String[] args) {
        int contador = 0;

        while (contador < 3) {
            String mensagem = "Contador: " + contador;

            System.out.println(mensagem);

            contador++;
        }

        System.out.println("Contador final: " + contador);
    }
}
```

Aqui:

```text
contador existe no main;
mensagem existe dentro de cada execução do bloco do while.
```

Fora do `while`, `mensagem` não existe.

---

## Variável criada em if e else

Veja este exemplo:

```java
if (aprovado) {
    String mensagem = "Aprovado";
} else {
    String mensagem = "Recusado";
}
```

As duas variáveis `mensagem` existem em blocos diferentes.

Mas nenhuma existe fora.

Se precisa usar depois, faça:

```java
String mensagem;

if (aprovado) {
    mensagem = "Aprovado";
} else {
    mensagem = "Recusado";
}

System.out.println(mensagem);
```

Aqui funciona porque tanto `if` quanto `else` atribuem valor.

---

## Exemplo com if else

Arquivo:

```text
EscopoIfElse.java
```

Código:

```java
public class EscopoIfElse {
    public static void main(String[] args) {
        boolean aprovado = true;

        String mensagem;

        if (aprovado) {
            mensagem = "Pedido aprovado";
        } else {
            mensagem = "Pedido recusado";
        }

        System.out.println(mensagem);
    }
}
```

Esse exemplo mostra:

```text
variável declarada fora;
valor definido dentro dos blocos;
uso depois.
```

Como os dois caminhos atribuem valor, o código compila.

---

## Escopo em métodos

Cada método tem seu próprio escopo.

Arquivo:

```text
EscopoMetodos.java
```

Código:

```java
public class EscopoMetodos {
    public static void main(String[] args) {
        int valor = 10;

        exibirValor(valor);
    }

    public static void exibirValor(int valorRecebido) {
        System.out.println("Valor recebido: " + valorRecebido);
    }
}
```

Aqui:

```text
valor existe no main;
valorRecebido existe no método exibirValor.
```

O método não acessa diretamente a variável `valor` do `main`.

Ele recebe o valor por parâmetro.

---

## Erro usando variável de outro método

Arquivo:

```text
ErroVariavelDeOutroMetodo.java
```

Código propositalmente errado:

```java
public class ErroVariavelDeOutroMetodo {
    public static void main(String[] args) {
        int valor = 10;

        exibirValor();
    }

    public static void exibirValor() {
        System.out.println(valor);
    }
}
```

Esse código não compila.

Motivo:

```text
valor é variável local do main;
exibirValor não enxerga essa variável.
```

Correção:

```java
public class ErroVariavelDeOutroMetodo {
    public static void main(String[] args) {
        int valor = 10;

        exibirValor(valor);
    }

    public static void exibirValor(int valor) {
        System.out.println(valor);
    }
}
```

Agora o valor entra no método por parâmetro.

---

## Parâmetro como variável local do método

Um parâmetro se comporta como uma variável local do método.

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos) {
    System.out.println(cliente);
    System.out.println(valorCentavos);
}
```

Dentro do método, podemos usar:

```text
cliente;
valorCentavos.
```

Fora do método, esses nomes não existem.

O parâmetro nasce quando o método é chamado.

Ele morre quando o método termina.

---

## Alterar parâmetro primitivo não altera fora

Arquivo:

```text
EscopoParametroPrimitivo.java
```

Código:

```java
public class EscopoParametroPrimitivo {
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

Saída:

```text
Quantidade no método: 99
Quantidade no main: 10
```

Aqui existe:

```text
quantidade no main;
quantidade no método.
```

O parâmetro recebe uma cópia do valor.

Alterar o parâmetro não altera a variável local do `main`.

Esse assunto será aprofundado na próxima aula sobre passagem de valores e referências.

---

## Escopo com array

Arquivo:

```text
EscopoArray.java
```

Código:

```java
public class EscopoArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarPrimeiroValor(valores);

        System.out.println("Primeiro valor no main: " + valores[0]);
    }

    public static void alterarPrimeiroValor(int[] valoresRecebidos) {
        valoresRecebidos[0] = 99;

        System.out.println("Primeiro valor no método: " + valoresRecebidos[0]);
    }
}
```

Saída:

```text
Primeiro valor no método: 99
Primeiro valor no main: 99
```

O parâmetro `valoresRecebidos` tem escopo dentro do método.

Mas ele aponta para o mesmo array.

Por isso, alterar uma posição altera o conteúdo do array visto pelo `main`.

Esse tema será detalhado na próxima aula.

---

## Sombra de variável

A grade cita:

```text
sombra.
```

Sombra, ou `shadowing`, acontece quando uma variável de escopo mais interno tem o mesmo nome de uma variável de escopo mais externo, escondendo a externa naquele ponto.

Nesta fase, o exemplo mais seguro é com campo da classe.

Exemplo:

```java
public class SombraVariavel {
    static String status = "GLOBAL";

    public static void main(String[] args) {
        String status = "LOCAL";

        System.out.println(status);
        System.out.println(SombraVariavel.status);
    }
}
```

Saída:

```text
LOCAL
GLOBAL
```

Dentro do `main`, a variável local `status` faz sombra no campo `status`.

Para acessar o campo, usamos:

```java
SombraVariavel.status
```

---

## Cuidado com sombra

Sombra pode confundir.

Exemplo:

```java
static String status = "PENDENTE";

public static void main(String[] args) {
    String status = "APROVADO";

    System.out.println(status);
}
```

Qual status será impresso?

```text
APROVADO.
```

Porque a variável local tem prioridade dentro do escopo do `main`.

Esse tipo de situação pode atrapalhar leitura.

Em código profissional, evite nomes iguais sem necessidade.

---

## Sombra com parâmetro e campo

Arquivo:

```text
SombraParametroCampo.java
```

Código:

```java
public class SombraParametroCampo {
    static String status = "GLOBAL";

    public static void main(String[] args) {
        exibirStatus("LOCAL");
    }

    public static void exibirStatus(String status) {
        System.out.println("Parâmetro: " + status);
        System.out.println("Campo da classe: " + SombraParametroCampo.status);
    }
}
```

Saída:

```text
Parâmetro: LOCAL
Campo da classe: GLOBAL
```

O parâmetro `status` faz sombra no campo `status`.

Para acessar o campo estático, usamos:

```java
SombraParametroCampo.status
```

Esse exemplo ajuda a entender sombra sem entrar ainda em objetos.

---

## Local não pode ser redeclarada no mesmo escopo

Java não permite declarar duas variáveis locais com o mesmo nome no mesmo escopo.

Errado:

```java
public static void main(String[] args) {
    int valor = 10;
    int valor = 20;
}
```

Também evite tentar redeclarar variável local em bloco interno quando ela já existe em escopo externo do mesmo método.

Exemplo problemático:

```java
public static void main(String[] args) {
    int valor = 10;

    if (valor > 0) {
        int valor = 20;
    }
}
```

Em Java, isso não é permitido para variáveis locais sobrepostas.

A sombra que estamos mostrando nesta aula é principalmente entre campo da classe e variável local/parâmetro.

---

## Exemplo aplicado: pedido com escopo correto

Arquivo:

```text
PedidoEscopoCorreto.java
```

Código:

```java
public class PedidoEscopoCorreto {
    public static void main(String[] args) {
        String cliente = "Ana";
        long valorCentavos = 1000L;
        String status = "PENDENTE";

        exibirPedido(cliente, valorCentavos, status);
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Pedido");
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
    }
}
```

Aqui:

```text
cliente, valorCentavos e status existem no main;
outros parâmetros com os mesmos nomes existem dentro de exibirPedido.
```

São escopos diferentes.

Isso é permitido e comum.

---

## Exemplo aplicado: produto com bloco de alerta

Arquivo:

```text
ProdutoEscopoBloco.java
```

Código:

```java
public class ProdutoEscopoBloco {
    public static void main(String[] args) {
        String produto = "Cadeira";
        int estoque = 0;
        String status = "ATIVO";

        exibirProduto(produto, estoque, status);
    }

    public static void exibirProduto(String produto, int estoque, String status) {
        System.out.println("Produto: " + produto);
        System.out.println("Estoque: " + estoque);
        System.out.println("Status: " + status);

        if (estoque == 0 && "ATIVO".equals(status)) {
            String alerta = "Produto ativo sem estoque";

            System.out.println("Alerta: " + alerta);
        }

        System.out.println("Fim da exibição do produto");
    }
}
```

A variável `alerta` existe apenas dentro do `if`.

Isso é bom, porque ela só é necessária ali.

Não precisa viver fora.

---

## Exemplo aplicado: pagamento com escopo de cálculo

Arquivo:

```text
PagamentoEscopo.java
```

Código:

```java
public class PagamentoEscopo {
    public static void main(String[] args) {
        exibirPagamento(10000L, 4);
        exibirPagamento(2500L, 0);
    }

    public static void exibirPagamento(long valorCentavos, int parcelas) {
        if (parcelas <= 0) {
            String mensagemErro = "Parcelas inválidas";

            System.out.println(mensagemErro);
            return;
        }

        long valorParcela = valorCentavos / parcelas;

        System.out.println("Valor total: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);
        System.out.println("Valor da parcela: " + valorParcela);
    }
}
```

Aqui:

```text
mensagemErro existe apenas no if;
valorParcela existe depois da validação.
```

Isso é bom, porque cada variável vive onde precisa.

---

## Exemplo aplicado: OS com variável de decisão

Arquivo:

```text
OsEscopoDecisao.java
```

Código:

```java
public class OsEscopoDecisao {
    public static void main(String[] args) {
        exibirSituacaoOs("ABERTA", 0);
        exibirSituacaoOs("ABERTA", 2);
    }

    public static void exibirSituacaoOs(String statusOs, int atividadesPendentes) {
        boolean podeConcluir = "ABERTA".equals(statusOs)
                && atividadesPendentes == 0;

        if (podeConcluir) {
            String mensagem = "OS pode ser concluída";

            System.out.println(mensagem);
        } else {
            String mensagem = "OS ainda não pode ser concluída";

            System.out.println(mensagem);
        }
    }
}
```

Aqui existem duas variáveis chamadas `mensagem`, cada uma em um bloco diferente.

Como os blocos são separados, isso é permitido.

Fora do `if/else`, nenhuma das duas existe.

Se precisar usar depois, declare antes do `if`.

---

## Exemplo aplicado: auditoria com escopo local

Arquivo:

```text
AuditoriaEscopo.java
```

Código:

```java
public class AuditoriaEscopo {
    public static void main(String[] args) {
        registrarAuditoria("aline", "CRIACAO", "SUCESSO");
    }

    public static void registrarAuditoria(String usuario, String operacao, String status) {
        String linha = usuario + " | " + operacao + " | " + status;

        System.out.println("AUDITORIA");
        System.out.println(linha);
    }
}
```

A variável `linha` existe apenas dentro do método `registrarAuditoria`.

Isso é adequado.

Ela é uma variável temporária para montar uma saída.

---

## Exemplo aplicado: mensageria com escopo de alerta

Arquivo:

```text
MensageriaEscopo.java
```

Código:

```java
public class MensageriaEscopo {
    public static void main(String[] args) {
        exibirEnvio("Ana", "ENTREGA", 1);
        exibirEnvio("Bruno", "NPS", 4);
    }

    public static void exibirEnvio(String cliente, String tipoMensagem, int tentativas) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Tipo: " + tipoMensagem);
        System.out.println("Tentativas: " + tentativas);

        if (tentativas > 3) {
            String alerta = "Mensagem com muitas tentativas";

            System.out.println("Alerta: " + alerta);
        }
    }
}
```

A variável `alerta` só existe se o bloco do `if` executar.

Fora dele, não existe.

Isso é correto porque o alerta só faz sentido naquele bloco.

---

## Exemplo aplicado: loop de pedidos

Arquivo:

```text
PedidosLoopEscopo.java
```

Código:

```java
public class PedidosLoopEscopo {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};

        for (int indice = 0; indice < clientes.length; indice++) {
            String clienteAtual = clientes[indice];
            long valorAtual = valoresCentavos[indice];

            System.out.println(clienteAtual + " - " + valorAtual);
        }
    }
}
```

Aqui:

```text
indice existe no for;
clienteAtual existe dentro do bloco do for;
valorAtual existe dentro do bloco do for.
```

A cada iteração, essas variáveis são recriadas dentro do bloco.

---

## Exemplo aplicado: total fora do loop

Arquivo:

```text
TotalForaDoLoop.java
```

Código:

```java
public class TotalForaDoLoop {
    public static void main(String[] args) {
        long[] valoresCentavos = {1000L, 2500L, 5000L};

        long total = 0L;

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            total += valoresCentavos[indice];
        }

        System.out.println("Total: " + total);
    }
}
```

A variável `total` precisa ser declarada fora do loop.

Por quê?

Porque queremos usar o valor acumulado depois do loop.

Se `total` fosse declarada dentro do loop, ela reiniciaria a cada iteração e não existiria depois.

---

## Erro declarando acumulador dentro do loop

Arquivo:

```text
ErroAcumuladorDentroDoLoop.java
```

Código propositalmente errado:

```java
public class ErroAcumuladorDentroDoLoop {
    public static void main(String[] args) {
        long[] valoresCentavos = {1000L, 2500L, 5000L};

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            long total = 0L;

            total += valoresCentavos[indice];
        }

        System.out.println(total);
    }
}
```

Esse código não compila porque `total` foi criado dentro do `for`.

Fora do `for`, ele não existe.

Mesmo se imprimisse dentro, o total seria reiniciado em cada volta.

Correção:

```java
long total = 0L;

for (int indice = 0; indice < valoresCentavos.length; indice++) {
    total += valoresCentavos[indice];
}

System.out.println(total);
```

---

## Escopo bom reduz risco

Regra prática:

```text
declare a variável no menor escopo possível, mas grande o suficiente para onde ela precisa ser usada.
```

Exemplo:

```java
if (estoque == 0) {
    String alerta = "Sem estoque";
    System.out.println(alerta);
}
```

`alerta` só é usado no `if`.

Então declare dentro do `if`.

Agora:

```java
long total = 0L;

for (...) {
    total += valor;
}

System.out.println(total);
```

`total` precisa ser usado depois do loop.

Então declare fora do loop.

A decisão depende do uso.

---

## Variável temporária

Variável temporária é uma variável criada para melhorar leitura ou guardar cálculo intermediário.

Exemplo:

```java
String statusNormalizado = status.trim().toUpperCase();
```

Ela ajuda a evitar repetição:

```java
if ("APROVADO".equals(statusNormalizado)) {
}
```

Escopo ideal:

```text
apenas onde a variável é necessária.
```

Se só precisa dentro do método, não deve virar campo global.

Se só precisa dentro do `if`, não precisa existir fora.

---

## Evite variável global sem necessidade

Nesta fase, usamos principalmente variáveis locais.

Campo da classe apareceu apenas para explicar sombra.

Exemplo de campo:

```java
static String status = "GLOBAL";
```

Não use campos estáticos para fugir de parâmetros.

Ruim:

```java
static long valorPedido;

public static void main(String[] args) {
    valorPedido = 1000L;
    exibirPedido();
}

public static void exibirPedido() {
    System.out.println(valorPedido);
}
```

Melhor nesta fase:

```java
public static void main(String[] args) {
    long valorPedido = 1000L;
    exibirPedido(valorPedido);
}

public static void exibirPedido(long valorPedido) {
    System.out.println(valorPedido);
}
```

Parâmetros deixam dependências explícitas.

Isso é mais saudável.

---

## Erros comuns

### Erro 1 — Usar variável fora do bloco

Exemplo:

```java
if (true) {
    String mensagem = "OK";
}

System.out.println(mensagem);
```

`mensagem` não existe fora do `if`.

---

### Erro 2 — Usar índice fora do for

Exemplo:

```java
for (int indice = 0; indice < 3; indice++) {
}

System.out.println(indice);
```

`indice` só existe no `for`.

---

### Erro 3 — Usar variável de outro método

Variável local de um método não existe em outro.

Passe por parâmetro.

---

### Erro 4 — Declarar variável mas não inicializar

Exemplo:

```java
int total;
System.out.println(total);
```

Variável local precisa ser inicializada.

---

### Erro 5 — Inicializar variável apenas dentro de um if

Se o `if` não executar, a variável fica sem valor.

Use `else` ou valor padrão.

---

### Erro 6 — Declarar acumulador dentro do loop

Se o acumulador precisa sobreviver ao loop, declare fora.

---

### Erro 7 — Criar variável com escopo grande demais

Evite variável vivendo no método inteiro se só precisa em duas linhas dentro de um `if`.

---

### Erro 8 — Usar campo estático para evitar parâmetro

Isso esconde dependência e reduz clareza.

Use parâmetros nesta fase.

---

### Erro 9 — Sombra confundindo leitura

Evite ter campo e variável local com mesmo nome sem necessidade.

---

### Erro 10 — Confundir escopo com valor

Escopo é onde a variável existe.

Valor é o conteúdo da variável.

São coisas diferentes.

---

## Diagnóstico de escopo

Quando aparecer erro de variável não encontrada ou não inicializada, siga o roteiro.

### 1. Onde a variável foi declarada?

Procure a linha:

```java
int valor = ...
String mensagem = ...
```

### 2. Em qual bloco ela foi declarada?

Veja as chaves:

```java
{
}
```

### 3. Você está tentando usar fora desse bloco?

Se sim, não funciona.

### 4. A variável precisa ser usada depois do bloco?

Declare antes do bloco.

### 5. A variável precisa existir apenas dentro do bloco?

Declare dentro do bloco.

### 6. Ela foi inicializada antes do uso?

Variável local precisa receber valor.

### 7. Todos os caminhos atribuem valor?

Verifique `if`, `else`, `return` e loops.

### 8. Ela pertence a outro método?

Passe como parâmetro.

### 9. Existe sombra de nome?

Verifique se há campo, parâmetro ou variável local com o mesmo nome.

### 10. Use debug e leitura de chaves

Identifique onde cada bloco começa e termina.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Variável fora do if

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            String mensagem = "OK";
        }

        System.out.println(mensagem);
    }
}
```

Depois corrija declarando antes do `if`.

---

### Teste 2 — Índice fora do for

```java
public class Main {
    public static void main(String[] args) {
        for (int indice = 0; indice < 3; indice++) {
            System.out.println(indice);
        }

        System.out.println(indice);
    }
}
```

Depois explique por que normalmente não precisa usar `indice` fora do `for`.

---

### Teste 3 — Variável de outro método

```java
public class Main {
    public static void main(String[] args) {
        String cliente = "Ana";

        exibirCliente();
    }

    public static void exibirCliente() {
        System.out.println(cliente);
    }
}
```

Depois corrija com parâmetro.

---

### Teste 4 — Variável local sem inicializar

```java
public class Main {
    public static void main(String[] args) {
        int quantidade;

        System.out.println(quantidade);
    }
}
```

Depois inicialize antes de usar.

---

### Teste 5 — Acumulador dentro do loop

```java
public class Main {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            int total = 0;
            total += valores[indice];
        }

        System.out.println(total);
    }
}
```

Depois corrija declarando `total` fora do loop.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-057-escopo-de-variaveis
cd labs\m1\aula-057-escopo-de-variaveis
```

Crie arquivos:

```text
Main.java
EscopoIf.java
ErroVariavelForaDoIf.java
VariavelLocalNaoInicializada.java
EscopoFor.java
ErroIndiceForaDoFor.java
EscopoWhile.java
EscopoIfElse.java
EscopoMetodos.java
ErroVariavelDeOutroMetodo.java
EscopoParametroPrimitivo.java
EscopoArray.java
SombraVariavel.java
SombraParametroCampo.java
PedidoEscopoCorreto.java
ProdutoEscopoBloco.java
PagamentoEscopo.java
OsEscopoDecisao.java
AuditoriaEscopo.java
MensageriaEscopo.java
PedidosLoopEscopo.java
TotalForaDoLoop.java
ErroAcumuladorDentroDoLoop.java
ErroVariavelForaBloco.java
ErroVariavelSemInicializar.java
ErroCampoEstaticoDesnecessario.java
```

Compile:

```powershell
javac Main.java
javac EscopoIf.java
javac ErroVariavelForaDoIf.java
javac VariavelLocalNaoInicializada.java
javac EscopoFor.java
javac ErroIndiceForaDoFor.java
javac EscopoWhile.java
javac EscopoIfElse.java
javac EscopoMetodos.java
javac ErroVariavelDeOutroMetodo.java
javac EscopoParametroPrimitivo.java
javac EscopoArray.java
javac SombraVariavel.java
javac SombraParametroCampo.java
javac PedidoEscopoCorreto.java
javac ProdutoEscopoBloco.java
javac PagamentoEscopo.java
javac OsEscopoDecisao.java
javac AuditoriaEscopo.java
javac MensageriaEscopo.java
javac PedidosLoopEscopo.java
javac TotalForaDoLoop.java
javac ErroAcumuladorDentroDoLoop.java
javac ErroVariavelForaBloco.java
javac ErroVariavelSemInicializar.java
javac ErroCampoEstaticoDesnecessario.java
```

Execute:

```powershell
java Main
java EscopoIf
java ErroVariavelForaDoIf
java VariavelLocalNaoInicializada
java EscopoFor
java ErroIndiceForaDoFor
java EscopoWhile
java EscopoIfElse
java EscopoMetodos
java ErroVariavelDeOutroMetodo
java EscopoParametroPrimitivo
java EscopoArray
java SombraVariavel
java SombraParametroCampo
java PedidoEscopoCorreto
java ProdutoEscopoBloco
java PagamentoEscopo
java OsEscopoDecisao
java AuditoriaEscopo
java MensageriaEscopo
java PedidosLoopEscopo
java TotalForaDoLoop
java ErroAcumuladorDentroDoLoop
java ErroVariavelForaBloco
java ErroVariavelSemInicializar
java ErroCampoEstaticoDesnecessario
```

Alguns arquivos de erro proposital não devem compilar.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroVariavelForaBloco.java`

```java
public class ErroVariavelForaBloco {
    public static void main(String[] args) {
        if (true) {
            String mensagem = "OK";
        }

        System.out.println(mensagem);
    }
}
```

Objetivo:

```text
entender que variável criada dentro de bloco não existe fora dele.
```

---

## Arquivo sugerido: `ErroVariavelSemInicializar.java`

```java
public class ErroVariavelSemInicializar {
    public static void main(String[] args) {
        int quantidade;

        System.out.println(quantidade);
    }
}
```

Objetivo:

```text
entender que variável local precisa ser inicializada antes do uso.
```

---

## Arquivo sugerido: `ErroCampoEstaticoDesnecessario.java`

```java
public class ErroCampoEstaticoDesnecessario {
    static String cliente;

    public static void main(String[] args) {
        cliente = "Ana";

        exibirCliente();
    }

    public static void exibirCliente() {
        System.out.println(cliente);
    }
}
```

Esse código compila.

Mas a prática recomendada nesta fase é melhor:

```java
public class ErroCampoEstaticoDesnecessario {
    public static void main(String[] args) {
        String cliente = "Ana";

        exibirCliente(cliente);
    }

    public static void exibirCliente(String cliente) {
        System.out.println(cliente);
    }
}
```

Objetivo:

```text
entender que parâmetro deixa dependência mais explícita que campo estático global.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Visualizar blocos e chaves |
| Renomear variável | `Shift + F6` | Corrigir nomes confusos |
| Ir para declaração | `Ctrl + B` em muitos keymaps | Ver onde a variável nasceu |
| Encontrar usos | `Alt + F7` em muitos keymaps | Ver onde a variável é usada |
| Terminal integrado | `Alt + F12` | Compilar e ver erro |
| Rodar programa | `Shift + F10` | Executar exemplos válidos |
| Debug | `Shift + F9` | Ver variáveis vivas no escopo |
| Step Into | `F7` em muitos keymaps | Entrar em método |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |

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
        int valor = 10;

        if (valor > 0) {
            String mensagem = "Valor positivo";

            System.out.println(mensagem);
        }

        System.out.println(valor);
    }
}
```

Observe:

```text
valor aparece no escopo do main;
mensagem aparece apenas dentro do bloco do if;
ao sair do if, mensagem não está mais disponível.
```

Depois debugue:

```java
public static void exibirValor(int valorRecebido) {
    System.out.println(valorRecebido);
}
```

Observe que `valorRecebido` existe apenas dentro do método.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 057 — Escopo de variáveis

### O que aprendi
Aprendi que escopo é a região onde uma variável pode ser usada, que variáveis locais existem apenas no bloco em que foram declaradas, que parâmetros existem apenas dentro do método e que o tempo de vida depende das chaves e do método.

### O que pratiquei
Criei exemplos de escopo no `main`, `if`, `else`, `for`, `while`, métodos, parâmetros, arrays e campos estáticos. Também provoquei erros de variável fora do bloco, índice fora do for, variável sem inicialização, variável de outro método e acumulador declarado no lugar errado.

### Conceitos principais
- escopo
- variável local
- parâmetro
- bloco
- chaves
- tempo de vida
- visibilidade
- variável de controle
- índice do for
- variável temporária
- inicialização obrigatória
- variável fora do bloco
- variável de outro método
- sombra
- shadowing
- campo estático
- parâmetro sombreando campo
- acumulador fora do loop
- menor escopo possível
- parâmetro em vez de campo global

### Arquivos criados
- `labs/m1/aula-057-escopo-de-variaveis/Main.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoIf.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroVariavelForaDoIf.java`
- `labs/m1/aula-057-escopo-de-variaveis/VariavelLocalNaoInicializada.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoFor.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroIndiceForaDoFor.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoWhile.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoIfElse.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoMetodos.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroVariavelDeOutroMetodo.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoParametroPrimitivo.java`
- `labs/m1/aula-057-escopo-de-variaveis/EscopoArray.java`
- `labs/m1/aula-057-escopo-de-variaveis/SombraVariavel.java`
- `labs/m1/aula-057-escopo-de-variaveis/SombraParametroCampo.java`
- `labs/m1/aula-057-escopo-de-variaveis/PedidoEscopoCorreto.java`
- `labs/m1/aula-057-escopo-de-variaveis/ProdutoEscopoBloco.java`
- `labs/m1/aula-057-escopo-de-variaveis/PagamentoEscopo.java`
- `labs/m1/aula-057-escopo-de-variaveis/OsEscopoDecisao.java`
- `labs/m1/aula-057-escopo-de-variaveis/AuditoriaEscopo.java`
- `labs/m1/aula-057-escopo-de-variaveis/MensageriaEscopo.java`
- `labs/m1/aula-057-escopo-de-variaveis/PedidosLoopEscopo.java`
- `labs/m1/aula-057-escopo-de-variaveis/TotalForaDoLoop.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroAcumuladorDentroDoLoop.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroVariavelForaBloco.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroVariavelSemInicializar.java`
- `labs/m1/aula-057-escopo-de-variaveis/ErroCampoEstaticoDesnecessario.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac EscopoIf.java
java EscopoIf
javac EscopoFor.java
java EscopoFor
javac EscopoMetodos.java
java EscopoMetodos
javac SombraParametroCampo.java
java SombraParametroCampo
```

### Erros que quero evitar
- usar variável fora do bloco;
- usar índice fora do `for`;
- usar variável de outro método;
- declarar variável local sem inicializar;
- inicializar variável apenas dentro de um `if`;
- declarar acumulador dentro do loop quando ele precisa existir depois;
- criar variável com escopo grande demais;
- usar campo estático para evitar parâmetro;
- criar sombra de nome sem necessidade;
- confundir escopo com valor.

### Próximo passo
Estudar passagem de valores e referências.
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
git add labs/m1/aula-057-escopo-de-variaveis docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 057: pratica escopo de variaveis em Java"
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
1. O que é escopo?
2. O que é variável local?
3. O que é parâmetro?
4. O que é tempo de vida de uma variável?
5. Por que uma variável criada dentro do if não existe fora dele?
6. Por que a variável do for normalmente não existe depois do for?
7. Por que uma variável local precisa ser inicializada antes do uso?
8. Como passar uma variável de um método para outro corretamente?
9. O que é sombra de variável?
10. Por que declarar variável no menor escopo possível melhora o código?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar escopo;
explicar variável local;
explicar parâmetro;
explicar bloco;
explicar tempo de vida;
explicar visibilidade;
identificar onde uma variável nasce;
identificar onde uma variável deixa de existir;
usar variável declarada no main;
usar variável dentro de if;
entender variável criada dentro do if;
entender variável criada dentro do else;
entender variável criada dentro do for;
entender variável criada dentro do while;
explicar por que índice do for não existe fora;
declarar acumulador fora do loop quando necessário;
usar variável temporária no escopo correto;
explicar variável local não inicializada;
passar valor para outro método por parâmetro;
explicar escopo de parâmetro;
entender alteração de parâmetro primitivo;
entender efeito em array recebido por parâmetro;
explicar sombra de campo por variável local;
explicar sombra de campo por parâmetro;
evitar campo estático desnecessário;
aplicar escopo em pedido;
aplicar escopo em produto;
aplicar escopo em pagamento;
aplicar escopo em OS;
aplicar escopo em auditoria;
aplicar escopo em mensageria;
diagnosticar erros comuns;
debugar variáveis por escopo;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar profundamente passagem por valor e referência.

Não precisa ainda dominar campos de instância.

Não precisa ainda dominar `this`.

Não precisa ainda dominar objetos.

Não precisa ainda dominar memória da JVM.

Esses assuntos virão depois.

O objetivo é dominar onde uma variável existe, onde pode ser usada e por quanto tempo ela vive.

---

## Fechamento da aula

Hoje estudamos escopo de variáveis.

A ideia central foi:

```text
uma variável só existe dentro da região onde foi declarada.
```

Vimos que essa região pode ser:

```text
método;
bloco de if;
bloco de else;
bloco de for;
bloco de while.
```

Também vimos que parâmetros têm escopo dentro do método e que variáveis locais precisam ser inicializadas antes do uso.

O padrão mental principal é:

```text
olhe as chaves;
descubra onde a variável nasceu;
descubra onde o bloco termina;
a variável só existe ali dentro.
```

O ponto mais importante é:

```text
declare a variável no menor escopo possível, mas grande o suficiente para onde ela precisa ser usada.
```

Na próxima aula, vamos estudar passagem de valores e referências.

Esse assunto vai aprofundar a diferença entre passar primitivos, objetos e arrays para métodos, explicando por que um `int` alterado dentro do método não muda fora, mas um array pode ter o conteúdo alterado.
