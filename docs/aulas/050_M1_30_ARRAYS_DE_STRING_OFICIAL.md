# 050 — M1.30 — Arrays de String

## Hoje a aula é sobre listas de texto

Um array de `String` guarda vários textos.

Exemplo:

```java
String[] nomes = {"Ana", "Bruno", "Carla"};
```

Visual:

```text
índice:  0       1        2
valor:   Ana     Bruno    Carla
```

Acessos:

```java
nomes[0] -> "Ana"
nomes[1] -> "Bruno"
nomes[2] -> "Carla"
```

Assim como nos arrays numéricos:

```text
o primeiro índice é 0;
o último índice é length - 1;
o array tem tamanho fixo;
o conteúdo das posições pode ser alterado.
```

A diferença é que agora cada elemento é texto.

E texto exige cuidado com:

```text
vazio;
em branco;
maiúsculas e minúsculas;
espaços no começo e no fim;
comparação com equals;
valor padrão null quando criado com new String[n].
```

---

## O que é um array de String

É um array onde cada elemento é uma `String`.

Declaração:

```java
String[] nomes;
```

Inicialização com valores:

```java
String[] nomes = {"Ana", "Bruno", "Carla"};
```

Inicialização com tamanho:

```java
String[] nomes = new String[3];
```

Depois podemos preencher:

```java
nomes[0] = "Ana";
nomes[1] = "Bruno";
nomes[2] = "Carla";
```

O tipo do array é:

```text
String[]
```

Leitura:

```text
array de String.
```

---

## Por que arrays de String existem

Arrays de `String` existem porque muitos dados importantes são textuais.

Exemplos de backend:

```text
status de pedido;
nome de cliente;
nome de produto;
tipo de operação;
usuário solicitante;
usuário aprovador;
motivo de recusa;
tipo de mensagem;
nome da fila;
descrição de ocorrência;
código textual de integração;
categoria de produto;
responsável pela atividade.
```

Antes de termos objetos e banco de dados, arrays de `String` ajudam a entender como manipular listas de textos.

Exemplo:

```java
String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Com loop:

```java
for (int indice = 0; indice < statusPedidos.length; indice++) {
    System.out.println(statusPedidos[indice]);
}
```

Esse padrão será usado muitas vezes.

---

## Vocabulário essencial

Termos desta aula:

```text
String;
array de String;
texto;
lista de nomes;
índice;
elemento;
posição;
length;
null;
valor padrão;
isEmpty;
isBlank;
equals;
trim;
toUpperCase;
toLowerCase;
normalização;
comparação textual;
validação textual;
campo obrigatório;
texto vazio;
texto em branco;
busca textual;
status textual.
```

Termos mais importantes:

```text
String -> tipo usado para texto em Java;
String[] -> array de textos;
isEmpty -> verifica se o texto tem tamanho zero;
isBlank -> verifica se o texto está vazio ou só com espaços;
equals -> compara conteúdo textual;
trim -> remove espaços no começo e no fim;
normalização -> preparar o texto antes de comparar ou salvar;
null -> ausência de objeto, valor padrão de posições não preenchidas em array de String.
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
        String[] nomes = {"Ana", "Bruno", "Carla"};

        System.out.println(nomes[0]);
        System.out.println(nomes[1]);
        System.out.println(nomes[2]);
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
Ana
Bruno
Carla
```

Esse é o primeiro contato.

Cada posição guarda um texto.

---

## Percorrendo array de String

Arquivo:

```text
PercorrendoNomes.java
```

Código:

```java
public class PercorrendoNomes {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Nome " + (indice + 1) + ": " + nomes[indice]);
        }
    }
}
```

Saída:

```text
Nome 1: Ana
Nome 2: Bruno
Nome 3: Carla
```

Repare:

```java
(indice + 1)
```

é usado apenas para mostrar ao usuário uma posição mais natural.

Internamente, o índice continua começando em 0.

---

## Criando array de String com tamanho fixo

Arquivo:

```text
CriandoArrayString.java
```

Código:

```java
public class CriandoArrayString {
    public static void main(String[] args) {
        String[] nomes = new String[3];

        nomes[0] = "Ana";
        nomes[1] = "Bruno";
        nomes[2] = "Carla";

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println(nomes[indice]);
        }
    }
}
```

Saída:

```text
Ana
Bruno
Carla
```

Aqui criamos primeiro:

```java
new String[3]
```

Depois preenchemos cada posição.

---

## Valor padrão em array de String

Quando criamos:

```java
String[] nomes = new String[3];
```

as posições não começam como texto vazio.

Elas começam como:

```text
null.
```

Exemplo:

```java
String[] nomes = new String[3];

System.out.println(nomes[0]);
System.out.println(nomes[1]);
System.out.println(nomes[2]);
```

Saída:

```text
null
null
null
```

`null` significa ausência de objeto.

Não é a mesma coisa que:

```java
""
```

texto vazio.

Esse ponto é muito importante.

---

## null não é String vazia

Compare:

```java
String texto1 = null;
String texto2 = "";
String texto3 = "   ";
String texto4 = "Ana";
```

Significados:

```text
texto1 -> não aponta para nenhuma String;
texto2 -> String existente, mas sem caracteres;
texto3 -> String existente, com espaços;
texto4 -> String existente, com texto.
```

Diferenças:

```java
texto2.isEmpty() -> true
texto3.isEmpty() -> false
texto3.isBlank() -> true
```

Mas:

```java
texto1.isEmpty()
```

gera erro, porque `texto1` é `null`.

Nesta fase, evite chamar métodos em uma String que pode ser `null` sem validar.

---

## Exemplo de null em array de String

Arquivo:

```text
ArrayStringComNull.java
```

Código:

```java
public class ArrayStringComNull {
    public static void main(String[] args) {
        String[] nomes = new String[3];

        nomes[0] = "Ana";

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Índice " + indice + ": " + nomes[indice]);
        }
    }
}
```

Saída:

```text
Índice 0: Ana
Índice 1: null
Índice 2: null
```

As posições 1 e 2 não foram preenchidas.

Por isso, continuam `null`.

---

## Cuidado ao chamar método em posição não preenchida

Erro comum:

```java
String[] nomes = new String[3];

if (nomes[0].isBlank()) {
    System.out.println("Nome vazio");
}
```

`nomes[0]` é `null`.

Então chamar:

```java
isBlank()
```

em cima de `null` causa erro.

Mais à frente vamos estudar exceções e `NullPointerException` com mais profundidade.

Por enquanto, guarde:

```text
se a posição de String pode não estar preenchida, valide null antes de chamar método.
```

Exemplo seguro:

```java
if (nomes[0] == null || nomes[0].isBlank()) {
    System.out.println("Nome inválido");
}
```

---

## isEmpty

`isEmpty()` verifica se a String tem tamanho zero.

Exemplo:

```java
String texto = "";

System.out.println(texto.isEmpty());
```

Saída:

```text
true
```

Outro exemplo:

```java
String texto = " ";

System.out.println(texto.isEmpty());
```

Saída:

```text
false
```

Por quê?

Porque `" "` tem um caractere: espaço.

Então `isEmpty()` só detecta texto sem nenhum caractere.

---

## isBlank

`isBlank()` verifica se a String está vazia ou contém apenas espaços.

Exemplo:

```java
String texto = " ";

System.out.println(texto.isBlank());
```

Saída:

```text
true
```

Outro exemplo:

```java
String texto = "";

System.out.println(texto.isBlank());
```

Saída:

```text
true
```

Outro:

```java
String texto = "Ana";

System.out.println(texto.isBlank());
```

Saída:

```text
false
```

Para validação de campo obrigatório, `isBlank()` geralmente é melhor que `isEmpty()`.

---

## isEmpty versus isBlank

Arquivo:

```text
IsEmptyVsIsBlank.java
```

Código:

```java
public class IsEmptyVsIsBlank {
    public static void main(String[] args) {
        String vazio = "";
        String espacos = "   ";
        String nome = "Ana";

        System.out.println("vazio.isEmpty(): " + vazio.isEmpty());
        System.out.println("vazio.isBlank(): " + vazio.isBlank());

        System.out.println("espacos.isEmpty(): " + espacos.isEmpty());
        System.out.println("espacos.isBlank(): " + espacos.isBlank());

        System.out.println("nome.isEmpty(): " + nome.isEmpty());
        System.out.println("nome.isBlank(): " + nome.isBlank());
    }
}
```

Resultado esperado:

```text
vazio.isEmpty(): true
vazio.isBlank(): true
espacos.isEmpty(): false
espacos.isBlank(): true
nome.isEmpty(): false
nome.isBlank(): false
```

Resumo:

```text
isEmpty -> vazio mesmo;
isBlank -> vazio ou só espaços.
```

---

## equals

Com `String`, compare conteúdo usando:

```java
equals()
```

Exemplo:

```java
String status = "APROVADO";

if (status.equals("APROVADO")) {
    System.out.println("Status aprovado");
}
```

Não use:

```java
status == "APROVADO"
```

para comparar conteúdo textual.

`==` compara referência.

`equals()` compara conteúdo.

Esse é um dos erros mais importantes em Java.

---

## Comparação segura com constante à esquerda

Se a variável puder ser `null`, esta forma pode quebrar:

```java
status.equals("APROVADO")
```

Se `status` for `null`, dá erro.

Forma mais segura:

```java
"APROVADO".equals(status)
```

Se `status` for `null`, o resultado será `false`.

Exemplo:

```java
String status = null;

if ("APROVADO".equals(status)) {
    System.out.println("Aprovado");
} else {
    System.out.println("Não aprovado");
}
```

Saída:

```text
Não aprovado
```

Essa forma é muito usada em código profissional.

---

## Exemplo de busca textual com equals

Arquivo:

```text
BuscaNomeEquals.java
```

Código:

```java
public class BuscaNomeEquals {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        String nomeProcurado = "Bruno";
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < nomes.length; indice++) {
            if (nomes[indice].equals(nomeProcurado)) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Nome encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Nome não encontrado");
        }
    }
}
```

Saída:

```text
Nome encontrado na posição 2
```

Esse exemplo é a busca em array aplicada a texto.

---

## Busca textual com constante à esquerda

Se o array puder ter `null`, faça assim:

```java
if (nomeProcurado.equals(nomes[indice])) {
```

Mas isso só é seguro se `nomeProcurado` não for `null`.

Também podemos usar:

```java
if ("Bruno".equals(nomes[indice])) {
```

Exemplo:

```java
String[] nomes = new String[3];
nomes[0] = "Ana";
nomes[1] = null;
nomes[2] = "Carla";

String procurado = "Carla";

for (int indice = 0; indice < nomes.length; indice++) {
    if (procurado.equals(nomes[indice])) {
        System.out.println("Encontrou");
    }
}
```

Como `procurado` não é `null`, essa comparação é segura mesmo se `nomes[indice]` for `null`.

---

## trim

`trim()` remove espaços no começo e no fim da String.

Exemplo:

```java
String nome = "  Ana  ";

String nomeTratado = nome.trim();

System.out.println(nomeTratado);
```

Saída:

```text
Ana
```

Em entrada de usuário, isso é muito útil.

Usuário pode digitar:

```text
" Ana "
```

e o sistema deve tratar como:

```text
"Ana".
```

---

## Normalização textual

Normalizar texto é preparar o texto para comparação ou armazenamento.

Exemplo:

```java
String status = " aprovado ";

status = status.trim().toUpperCase();
```

Resultado:

```text
APROVADO.
```

Normalização comum:

```text
trim -> remove espaços externos;
toUpperCase -> padroniza maiúsculas;
toLowerCase -> padroniza minúsculas.
```

Exemplo de comparação:

```java
String entrada = " aprovado ";
String statusNormalizado = entrada.trim().toUpperCase();

if ("APROVADO".equals(statusNormalizado)) {
    System.out.println("Status válido");
}
```

---

## Preenchendo array de String com Scanner

Arquivo:

```text
PreencherNomesConsole.java
```

Código:

```java
import java.util.Scanner;

public class PreencherNomesConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] nomes = new String[3];

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Digite o nome " + (indice + 1) + ":");
            nomes[indice] = scanner.nextLine();
        }

        System.out.println("Nomes informados:");

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println(nomes[indice]);
        }

        scanner.close();
    }
}
```

Esse exemplo lê três textos.

Por enquanto, ainda não valida.

A próxima etapa é validar se o nome não está em branco.

---

## Validando nomes em array

Arquivo:

```text
ValidarNomesArray.java
```

Código:

```java
import java.util.Scanner;

public class ValidarNomesArray {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] nomes = new String[3];

        for (int indice = 0; indice < nomes.length; indice++) {
            do {
                System.out.println("Digite o nome " + (indice + 1) + ":");
                nomes[indice] = scanner.nextLine().trim();

                if (nomes[indice].isBlank()) {
                    System.out.println("Nome obrigatório.");
                }
            } while (nomes[indice].isBlank());
        }

        System.out.println("Nomes válidos:");

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println(nomes[indice]);
        }

        scanner.close();
    }
}
```

Aqui usamos:

```text
array de String;
Scanner;
trim;
isBlank;
do while;
validação textual.
```

---

## Por que validar depois do trim

Se o usuário digitar:

```text
"   "
```

e fizermos:

```java
nomes[indice] = scanner.nextLine();
```

sem `trim`, `isBlank()` ainda detecta como em branco.

Mas `trim()` é importante para salvar o texto limpo.

Exemplo:

```text
entrada: "  Ana  "
salvo: "Ana"
```

Com:

```java
nomes[indice] = scanner.nextLine().trim();
```

o array guarda o texto já normalizado.

---

## Cuidado com nextInt e nextLine

Se antes de ler `String` você usou:

```java
nextInt()
```

precisa limpar a quebra de linha.

Exemplo:

```java
int quantidade = scanner.nextInt();
scanner.nextLine();

String[] nomes = new String[quantidade];
```

Sem:

```java
scanner.nextLine();
```

o primeiro `nextLine()` pode ler uma linha vazia.

Esse erro já apareceu em aulas anteriores e volta aqui com força porque arrays de `String` usam muito `nextLine()`.

---

## Array de String com tamanho informado

Arquivo:

```text
NomesComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class NomesComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos nomes deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        scanner.nextLine();

        String[] nomes = new String[quantidade];

        for (int indice = 0; indice < nomes.length; indice++) {
            do {
                System.out.println("Digite o nome " + (indice + 1) + ":");
                nomes[indice] = scanner.nextLine().trim();

                if (nomes[indice].isBlank()) {
                    System.out.println("Nome obrigatório.");
                }
            } while (nomes[indice].isBlank());
        }

        System.out.println("Nomes cadastrados:");

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Nome " + (indice + 1) + ": " + nomes[indice]);
        }

        scanner.close();
    }
}
```

Esse exemplo junta:

```text
tamanho definido pelo usuário;
Scanner;
nextInt;
nextLine;
array de String;
validação textual;
isBlank.
```

---

## Exemplo aplicado: clientes

Arquivo:

```text
ClientesArray.java
```

Código:

```java
public class ClientesArray {
    public static void main(String[] args) {
        String[] clientes = {"Maria", "João", "Ana"};

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println("Cliente " + (indice + 1) + ": " + clientes[indice]);
        }
    }
}
```

Saída:

```text
Cliente 1: Maria
Cliente 2: João
Cliente 3: Ana
```

Esse é o uso mais simples: lista de nomes.

---

## Exemplo aplicado: produtos

Arquivo:

```text
ProdutosArray.java
```

Código:

```java
public class ProdutosArray {
    public static void main(String[] args) {
        String[] produtos = {"Mesa", "Cadeira", "Sofá"};

        for (int indice = 0; indice < produtos.length; indice++) {
            System.out.println("Produto " + (indice + 1) + ": " + produtos[indice]);
        }
    }
}
```

Arrays de `String` são úteis para nomes de produtos, categorias e descrições.

---

## Exemplo aplicado: status de pedidos

Arquivo:

```text
StatusPedidosArray.java
```

Código:

```java
public class StatusPedidosArray {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            System.out.println("Pedido " + (indice + 1) + ": " + statusPedidos[indice]);
        }
    }
}
```

Esse exemplo prepara para contagem e validação de status.

---

## Contando status com equals

Arquivo:

```text
ContarStatusAprovado.java
```

Código:

```java
public class ContarStatusAprovado {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};

        int aprovados = 0;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            if ("APROVADO".equals(statusPedidos[indice])) {
                aprovados++;
            }
        }

        System.out.println("Pedidos aprovados: " + aprovados);
    }
}
```

Saída:

```text
Pedidos aprovados: 2
```

Aqui usamos:

```java
"APROVADO".equals(statusPedidos[indice])
```

Forma segura e profissional.

---

## Contando vários status

Arquivo:

```text
RelatorioStatusPedidos.java
```

Código:

```java
public class RelatorioStatusPedidos {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO", "PENDENTE"};

        int pendentes = 0;
        int aprovados = 0;
        int recusados = 0;
        int desconhecidos = 0;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            if ("PENDENTE".equals(statusPedidos[indice])) {
                pendentes++;
            } else if ("APROVADO".equals(statusPedidos[indice])) {
                aprovados++;
            } else if ("RECUSADO".equals(statusPedidos[indice])) {
                recusados++;
            } else {
                desconhecidos++;
            }
        }

        System.out.println("Pendentes: " + pendentes);
        System.out.println("Aprovados: " + aprovados);
        System.out.println("Recusados: " + recusados);
        System.out.println("Desconhecidos: " + desconhecidos);
    }
}
```

Esse padrão será muito comum em relatórios textuais.

---

## Validando status em array

Arquivo:

```text
ValidarStatusPedidos.java
```

Código:

```java
public class ValidarStatusPedidos {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "XYZ", "RECUSADO"};

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            boolean statusValido = "PENDENTE".equals(statusPedidos[indice])
                    || "APROVADO".equals(statusPedidos[indice])
                    || "RECUSADO".equals(statusPedidos[indice])
                    || "CANCELADO".equals(statusPedidos[indice]);

            if (!statusValido) {
                System.out.println("Status inválido na posição " + (indice + 1) + ": " + statusPedidos[indice]);
            }
        }
    }
}
```

Saída:

```text
Status inválido na posição 3: XYZ
```

Esse exemplo aplica validação textual em lote.

---

## Normalizando status em array

Arquivo:

```text
NormalizarStatusArray.java
```

Código:

```java
public class NormalizarStatusArray {
    public static void main(String[] args) {
        String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
        }

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

Esse exemplo altera as posições do array para padronizar os textos.

---

## Buscar status em array

Arquivo:

```text
BuscarStatusArray.java
```

Código:

```java
public class BuscarStatusArray {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        String statusProcurado = "APROVADO";
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            if (statusProcurado.equals(statusPedidos[indice])) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Status encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Status não encontrado");
        }
    }
}
```

Esse exemplo reaproveita a aula de busca em array, agora com `String`.

---

## Buscar nome ignorando diferenças de caixa

Existem algumas formas.

Uma forma simples é normalizar os dois lados.

Arquivo:

```text
BuscarNomeNormalizado.java
```

Código:

```java
public class BuscarNomeNormalizado {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        String nomeProcurado = " bruno ";
        String nomeNormalizado = nomeProcurado.trim().toUpperCase();

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < nomes.length; indice++) {
            String nomeAtualNormalizado = nomes[indice].trim().toUpperCase();

            if (nomeNormalizado.equals(nomeAtualNormalizado)) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Nome encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Nome não encontrado");
        }
    }
}
```

Entrada procurada:

```text
" bruno "
```

encontra:

```text
"Bruno".
```

Isso é normalização textual.

---

## equalsIgnoreCase

Java também tem:

```java
equalsIgnoreCase()
```

Exemplo:

```java
"bruno".equalsIgnoreCase("Bruno")
```

Resultado:

```text
true.
```

Arquivo:

```text
BuscarNomeEqualsIgnoreCase.java
```

Código:

```java
public class BuscarNomeEqualsIgnoreCase {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        String nomeProcurado = "bruno";
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < nomes.length; indice++) {
            if (nomeProcurado.equalsIgnoreCase(nomes[indice])) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Nome encontrado");
        } else {
            System.out.println("Nome não encontrado");
        }
    }
}
```

Mas `equalsIgnoreCase()` não remove espaços.

Se houver espaços, use `trim()`.

---

## Primeiro texto em branco

Arquivo:

```text
PrimeiroTextoEmBranco.java
```

Código:

```java
public class PrimeiroTextoEmBranco {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "   ", "Carla"};

        int posicaoEmBranco = -1;

        for (int indice = 0; indice < nomes.length; indice++) {
            if (nomes[indice] == null || nomes[indice].isBlank()) {
                posicaoEmBranco = indice;
                break;
            }
        }

        if (posicaoEmBranco != -1) {
            System.out.println("Texto em branco na posição " + (posicaoEmBranco + 1));
        } else {
            System.out.println("Todos os textos estão preenchidos");
        }
    }
}
```

Esse exemplo mostra validação em lote.

Repare na ordem:

```java
nomes[indice] == null || nomes[indice].isBlank()
```

Se for `null`, o Java nem precisa avaliar `isBlank()` por causa do `||`.

Isso evita erro.

---

## Validando todos os nomes

Arquivo:

```text
ValidarTodosOsNomes.java
```

Código:

```java
public class ValidarTodosOsNomes {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "", "Carla", "   "};

        int invalidos = 0;

        for (int indice = 0; indice < nomes.length; indice++) {
            if (nomes[indice] == null || nomes[indice].isBlank()) {
                System.out.println("Nome inválido na posição " + (indice + 1));
                invalidos++;
            }
        }

        System.out.println("Total de nomes inválidos: " + invalidos);
    }
}
```

Aqui não usamos `break`, porque queremos listar todos os inválidos.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaUsuariosArray.java
```

Código:

```java
public class AuditoriaUsuariosArray {
    public static void main(String[] args) {
        String[] usuarios = {"thiago", "aline", "jackson", "guilherme"};

        for (int indice = 0; indice < usuarios.length; indice++) {
            usuarios[indice] = usuarios[indice].trim().toLowerCase();
        }

        for (int indice = 0; indice < usuarios.length; indice++) {
            System.out.println("Usuário auditado: " + usuarios[indice]);
        }
    }
}
```

Esse exemplo normaliza usuários para minúsculo.

Em sistemas reais, padronização de usuário ajuda em busca, log e auditoria.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaTiposArray.java
```

Código:

```java
public class MensageriaTiposArray {
    public static void main(String[] args) {
        String[] tiposMensagem = {"BOAS_VINDAS", "ENTREGA", "NPS", "ENTREGA"};

        int entregas = 0;

        for (int indice = 0; indice < tiposMensagem.length; indice++) {
            if ("ENTREGA".equals(tiposMensagem[indice])) {
                entregas++;
            }
        }

        System.out.println("Mensagens de entrega: " + entregas);
    }
}
```

Esse exemplo conta tipos de mensagem.

---

## Exemplo aplicado: filas de atendimento

Arquivo:

```text
FilasAtendimentoArray.java
```

Código:

```java
public class FilasAtendimentoArray {
    public static void main(String[] args) {
        String[] filas = {"Entrada", "Reagendamento", "Sem Capacity", "Casos Críticos"};

        for (int indice = 0; indice < filas.length; indice++) {
            System.out.println("Fila " + (indice + 1) + ": " + filas[indice]);
        }
    }
}
```

Esse exemplo mostra lista textual de filas.

---

## Exemplo aplicado: validar filas

Arquivo:

```text
ValidarFilaAtendimento.java
```

Código:

```java
public class ValidarFilaAtendimento {
    public static void main(String[] args) {
        String[] filas = {"Entrada", "Reagendamento", "XYZ"};

        for (int indice = 0; indice < filas.length; indice++) {
            String filaNormalizada = filas[indice].trim().toUpperCase();

            boolean filaValida = "ENTRADA".equals(filaNormalizada)
                    || "REAGENDAMENTO".equals(filaNormalizada)
                    || "SEM CAPACITY".equals(filaNormalizada)
                    || "CASOS CRÍTICOS".equals(filaNormalizada);

            if (!filaValida) {
                System.out.println("Fila inválida na posição " + (indice + 1) + ": " + filas[indice]);
            }
        }
    }
}
```

Esse exemplo aplica validação textual com normalização.

---

## Exemplo aplicado: pedidos com status inválido

Arquivo:

```text
RelatorioStatusInvalidos.java
```

Código:

```java
public class RelatorioStatusInvalidos {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "ERRO", "CANCELADO", ""};

        int validos = 0;
        int invalidos = 0;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            String status = statusPedidos[indice];

            boolean statusValido = status != null
                    && !status.isBlank()
                    && ("PENDENTE".equals(status.trim().toUpperCase())
                    || "APROVADO".equals(status.trim().toUpperCase())
                    || "RECUSADO".equals(status.trim().toUpperCase())
                    || "CANCELADO".equals(status.trim().toUpperCase()));

            if (statusValido) {
                validos++;
            } else {
                invalidos++;
                System.out.println("Status inválido na posição " + (indice + 1) + ": " + status);
            }
        }

        System.out.println("Válidos: " + validos);
        System.out.println("Inválidos: " + invalidos);
    }
}
```

Esse código funciona, mas tem repetição de:

```java
status.trim().toUpperCase()
```

Podemos melhorar.

---

## Melhorando a normalização para evitar repetição

Arquivo:

```text
RelatorioStatusInvalidosMelhorado.java
```

Código:

```java
public class RelatorioStatusInvalidosMelhorado {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "APROVADO", "ERRO", "CANCELADO", ""};

        int validos = 0;
        int invalidos = 0;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            String status = statusPedidos[indice];

            if (status == null || status.isBlank()) {
                invalidos++;
                System.out.println("Status vazio na posição " + (indice + 1));
                continue;
            }

            String statusNormalizado = status.trim().toUpperCase();

            boolean statusValido = "PENDENTE".equals(statusNormalizado)
                    || "APROVADO".equals(statusNormalizado)
                    || "RECUSADO".equals(statusNormalizado)
                    || "CANCELADO".equals(statusNormalizado);

            if (statusValido) {
                validos++;
            } else {
                invalidos++;
                System.out.println("Status inválido na posição " + (indice + 1) + ": " + status);
            }
        }

        System.out.println("Válidos: " + validos);
        System.out.println("Inválidos: " + invalidos);
    }
}
```

Essa versão é melhor porque:

```text
trata null e branco primeiro;
usa continue para pular inválidos;
normaliza uma vez;
dá nome para a regra.
```

---

## Alterando texto em uma posição

Arquivo:

```text
AlterarNomeArray.java
```

Código:

```java
public class AlterarNomeArray {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        int indice = 1;
        String nomeAntigo = nomes[indice];

        nomes[indice] = "Breno";

        System.out.println("Nome antigo: " + nomeAntigo);
        System.out.println("Nome novo: " + nomes[indice]);
    }
}
```

Saída:

```text
Nome antigo: Bruno
Nome novo: Breno
```

Isso reaproveita a aula de alteração de posições, agora com `String`.

---

## Buscar e alterar status

Arquivo:

```text
BuscarEAlterarStatus.java
```

Código:

```java
public class BuscarEAlterarStatus {
    public static void main(String[] args) {
        String[] statusPedidos = {"PENDENTE", "PENDENTE", "APROVADO"};

        String statusProcurado = "PENDENTE";
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < statusPedidos.length; indice++) {
            if (statusProcurado.equals(statusPedidos[indice])) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            String statusAntigo = statusPedidos[posicaoEncontrada];
            statusPedidos[posicaoEncontrada] = "APROVADO";

            System.out.println("Status alterado na posição " + (posicaoEncontrada + 1));
            System.out.println("Antigo: " + statusAntigo);
            System.out.println("Novo: " + statusPedidos[posicaoEncontrada]);
        } else {
            System.out.println("Status não encontrado");
        }
    }
}
```

Esse exemplo combina:

```text
busca textual;
posição encontrada;
alteração de String;
valor antigo;
valor novo.
```

---

## Erros comuns

### Erro 1 — Comparar String com `==`

Errado:

```java
if (status == "APROVADO") {
}
```

Certo:

```java
if ("APROVADO".equals(status)) {
}
```

---

### Erro 2 — Chamar isBlank em null

Errado:

```java
if (nomes[indice].isBlank()) {
}
```

se a posição pode ser `null`.

Certo:

```java
if (nomes[indice] == null || nomes[indice].isBlank()) {
}
```

---

### Erro 3 — Confundir isEmpty com isBlank

`isEmpty()` não considera espaços como vazio.

```java
"   ".isEmpty()
```

retorna:

```text
false.
```

Para campo obrigatório, geralmente use:

```java
isBlank()
```

---

### Erro 4 — Não usar trim em entrada do usuário

Se o usuário digitar:

```text
" Ana "
```

sem `trim()`, o texto fica com espaços.

Use:

```java
scanner.nextLine().trim()
```

quando fizer sentido.

---

### Erro 5 — Não normalizar antes de comparar status

Entrada:

```text
"aprovado"
```

não é igual a:

```text
"APROVADO"
```

Normalizar ajuda:

```java
trim().toUpperCase()
```

---

### Erro 6 — Esquecer scanner.nextLine depois de nextInt

Depois de:

```java
scanner.nextInt()
```

antes de ler texto com `nextLine()`, use:

```java
scanner.nextLine();
```

---

### Erro 7 — Achar que new String[n] cria Strings vazias

Não cria.

Cria posições com:

```text
null.
```

---

### Erro 8 — Usar equals do lado que pode ser null

Perigoso:

```java
status.equals("APROVADO")
```

se `status` pode ser `null`.

Mais seguro:

```java
"APROVADO".equals(status)
```

---

### Erro 9 — Não validar textos antes de salvar no array

Evite salvar:

```text
""
"   "
null
```

quando o campo é obrigatório.

---

### Erro 10 — Misturar índice técnico e posição do usuário

Para exibir ao usuário:

```java
indice + 1
```

Para acessar array:

```java
indice
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-050-arrays-string
cd labs\m1\aula-050-arrays-string
```

Crie arquivos:

```text
Main.java
PercorrendoNomes.java
CriandoArrayString.java
ArrayStringComNull.java
IsEmptyVsIsBlank.java
BuscaNomeEquals.java
PreencherNomesConsole.java
ValidarNomesArray.java
NomesComTamanhoUsuario.java
ClientesArray.java
ProdutosArray.java
StatusPedidosArray.java
ContarStatusAprovado.java
RelatorioStatusPedidos.java
ValidarStatusPedidos.java
NormalizarStatusArray.java
BuscarStatusArray.java
BuscarNomeNormalizado.java
BuscarNomeEqualsIgnoreCase.java
PrimeiroTextoEmBranco.java
ValidarTodosOsNomes.java
AuditoriaUsuariosArray.java
MensageriaTiposArray.java
FilasAtendimentoArray.java
ValidarFilaAtendimento.java
RelatorioStatusInvalidos.java
RelatorioStatusInvalidosMelhorado.java
AlterarNomeArray.java
BuscarEAlterarStatus.java
ErroStringComIgualIgual.java
ErroIsBlankEmNull.java
ErroIsEmptyComEspacos.java
ErroSemTrim.java
ErroNextIntNextLine.java
```

Compile:

```powershell
javac Main.java
javac PercorrendoNomes.java
javac CriandoArrayString.java
javac ArrayStringComNull.java
javac IsEmptyVsIsBlank.java
javac BuscaNomeEquals.java
javac PreencherNomesConsole.java
javac ValidarNomesArray.java
javac NomesComTamanhoUsuario.java
javac ClientesArray.java
javac ProdutosArray.java
javac StatusPedidosArray.java
javac ContarStatusAprovado.java
javac RelatorioStatusPedidos.java
javac ValidarStatusPedidos.java
javac NormalizarStatusArray.java
javac BuscarStatusArray.java
javac BuscarNomeNormalizado.java
javac BuscarNomeEqualsIgnoreCase.java
javac PrimeiroTextoEmBranco.java
javac ValidarTodosOsNomes.java
javac AuditoriaUsuariosArray.java
javac MensageriaTiposArray.java
javac FilasAtendimentoArray.java
javac ValidarFilaAtendimento.java
javac RelatorioStatusInvalidos.java
javac RelatorioStatusInvalidosMelhorado.java
javac AlterarNomeArray.java
javac BuscarEAlterarStatus.java
javac ErroStringComIgualIgual.java
javac ErroIsBlankEmNull.java
javac ErroIsEmptyComEspacos.java
javac ErroSemTrim.java
javac ErroNextIntNextLine.java
```

Execute:

```powershell
java Main
java PercorrendoNomes
java CriandoArrayString
java ArrayStringComNull
java IsEmptyVsIsBlank
java BuscaNomeEquals
java PreencherNomesConsole
java ValidarNomesArray
java NomesComTamanhoUsuario
java ClientesArray
java ProdutosArray
java StatusPedidosArray
java ContarStatusAprovado
java RelatorioStatusPedidos
java ValidarStatusPedidos
java NormalizarStatusArray
java BuscarStatusArray
java BuscarNomeNormalizado
java BuscarNomeEqualsIgnoreCase
java PrimeiroTextoEmBranco
java ValidarTodosOsNomes
java AuditoriaUsuariosArray
java MensageriaTiposArray
java FilasAtendimentoArray
java ValidarFilaAtendimento
java RelatorioStatusInvalidos
java RelatorioStatusInvalidosMelhorado
java AlterarNomeArray
java BuscarEAlterarStatus
java ErroStringComIgualIgual
java ErroIsBlankEmNull
java ErroIsEmptyComEspacos
java ErroSemTrim
java ErroNextIntNextLine
```

Alguns arquivos de erro proposital podem exibir resultado errado ou quebrar.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroStringComIgualIgual.java`

```java
public class ErroStringComIgualIgual {
    public static void main(String[] args) {
        String status = new String("APROVADO");

        if (status == "APROVADO") {
            System.out.println("Aprovado");
        } else {
            System.out.println("Não aprovado");
        }
    }
}
```

Depois corrija:

```java
if ("APROVADO".equals(status)) {
}
```

Objetivo:

```text
entender por que String deve ser comparada com equals.
```

---

## Arquivo sugerido: `ErroIsBlankEmNull.java`

```java
public class ErroIsBlankEmNull {
    public static void main(String[] args) {
        String[] nomes = new String[1];

        if (nomes[0].isBlank()) {
            System.out.println("Nome em branco");
        }
    }
}
```

Depois corrija:

```java
if (nomes[0] == null || nomes[0].isBlank()) {
    System.out.println("Nome inválido");
}
```

Objetivo:

```text
entender que new String[n] cria posições null.
```

---

## Arquivo sugerido: `ErroNextIntNextLine.java`

```java
import java.util.Scanner;

public class ErroNextIntNextLine {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantidade:");
        int quantidade = scanner.nextInt();

        String[] nomes = new String[quantidade];

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Nome " + (indice + 1) + ":");
            nomes[indice] = scanner.nextLine();
        }

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("Nome lido: " + nomes[indice]);
        }

        scanner.close();
    }
}
```

Depois corrija:

```java
scanner.nextLine();
```

após o `nextInt()`.

Objetivo:

```text
entender a quebra de linha pendente ao misturar número e texto.
```

---

## Debug recomendado

Use debug neste trecho:

```java
String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};

for (int indice = 0; indice < statusPedidos.length; indice++) {
    statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
}
```

Observe:

```text
texto antes;
texto depois do trim;
texto depois do toUpperCase;
posição alterada.
```

Depois debugue:

```java
if ("APROVADO".equals(statusPedidos[indice])) {
    aprovados++;
}
```

Observe:

```text
valor da posição;
resultado do equals;
contador de aprovados.
```

Esse debug fixa comparação textual.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-050-arrays-string docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 050: pratica arrays de String em Java"
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
explicar String[];
criar array de String com valores;
criar array de String com tamanho fixo;
percorrer array de String;
preencher array de String com Scanner;
usar length corretamente;
explicar valor padrão null;
diferenciar null de texto vazio;
diferenciar texto vazio de texto em branco;
usar isEmpty;
usar isBlank;
usar trim;
usar toUpperCase;
usar toLowerCase;
comparar String com equals;
evitar comparação com ==;
usar constante à esquerda no equals;
buscar texto no array;
buscar texto ignorando caixa;
validar nomes obrigatórios;
validar status textuais;
normalizar status em array;
contar status em array;
aplicar array de String em clientes;
aplicar em produtos;
aplicar em pedidos;
aplicar em auditoria;
aplicar em mensageria;
aplicar em filas;
alterar texto em posição;
buscar e alterar status;
tratar null antes de chamar método;
diagnosticar erros comuns;
debugar texto bruto e normalizado;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar arrays paralelos.

Não precisa ainda dominar objetos.

Não precisa ainda dominar enum.

Não precisa ainda dominar validação profissional.

Não precisa ainda dominar coleções.

Esses assuntos virão depois.

O objetivo é dominar arrays de texto, comparação textual e validação básica de `String`.

---

## Fechamento da aula

Hoje aprendemos arrays de `String`.

A ideia central foi:

```text
guardar vários textos em uma estrutura indexada.
```

Vimos:

```java
String[] nomes = {"Ana", "Bruno", "Carla"};
```

Também aprendemos pontos fundamentais de texto em Java:

```text
String deve ser comparada com equals;
isEmpty não é a mesma coisa que isBlank;
trim remove espaços externos;
toUpperCase e toLowerCase ajudam na normalização;
new String[n] começa com null;
null precisa ser tratado antes de chamar métodos.
```

Essa aula é essencial para backend porque muitos dados de sistemas são textuais:

```text
status;
nomes;
usuários;
filas;
tipos;
categorias;
motivos;
descrições.
```

Na próxima aula, vamos estudar arrays paralelos.

Nela, vamos entender como relacionar arrays diferentes pelo mesmo índice, por que isso funciona em exemplos didáticos e por que essa abordagem prepara o caminho para objetos.
