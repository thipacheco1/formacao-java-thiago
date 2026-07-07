# 030 — M1.10 — Entrada de Dados com Scanner

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.10.01` — Entrada de dados com Scanner — Conceito, por que existe e vocabulário essencial.
- `M1.10.02` — Entrada de dados com Scanner — Exemplo mínimo digitado do zero.
- `M1.10.03` — Entrada de dados com Scanner — Exemplo aplicado ao domínio corporativo.
- `M1.10.04` — Entrada de dados com Scanner — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar entrada de dados com `Scanner`, cobrindo `nextLine`, `nextInt`, `nextDouble`, limpeza de buffer, `Locale`, fechamento do scanner, erros comuns e aplicação em pequenos cenários de backend.

---

## Onde estamos na formação

Estamos no Módulo 1, estudando os fundamentos da linguagem Java.

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
M1.09 — String básica.
```

Até agora, os valores dos programas estavam fixos no código.

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";
int quantidadeItens = 3;
double valorProduto = 99.90;
```

Agora vamos permitir que a pessoa digite dados no console.

Para isso, usaremos:

```java
Scanner
```

Essa aula é uma transição importante.

O programa deixa de apenas imprimir valores fixos e começa a receber entrada externa.

Ainda não é API.

Ainda não é banco.

Ainda não é tela.

Mas é a primeira forma de entrada de dados no Java básico.

---

## Hoje a aula é sobre o programa perguntar e receber respostas

Até aqui, o programa fazia algo assim:

```text
programa executa;
programa imprime;
programa termina.
```

Agora queremos algo assim:

```text
programa pergunta;
usuário digita;
programa lê;
programa guarda em variável;
programa processa;
programa imprime resposta.
```

Exemplo:

```text
Digite seu nome:
Ana

Olá, Ana!
```

Isso muda a sensação do programa.

Ele passa a interagir.

A ferramenta inicial para isso será o `Scanner`.

---

## O que é Scanner

`Scanner` é uma classe do Java usada para ler dados de uma fonte.

Nesta aula, vamos usar o `Scanner` para ler dados digitados no teclado.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);
```

Leitura inicial:

```text
crie um scanner para ler dados da entrada padrão do sistema.
```

Entrada padrão normalmente significa:

```text
teclado no console.
```

O `Scanner` consegue ler:

```text
texto;
inteiro;
decimal;
linha inteira;
tokens;
valores separados por espaço ou quebra de linha.
```

Nesta aula, vamos focar em:

```text
nextLine;
nextInt;
nextDouble;
limpeza de buffer;
Locale;
close.
```

---

## Importando Scanner

Para usar `Scanner`, precisamos importar a classe.

No topo do arquivo:

```java
import java.util.Scanner;
```

Exemplo completo:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite seu nome:");
        String nome = scanner.nextLine();

        System.out.println("Olá, " + nome);

        scanner.close();
    }
}
```

Sem o import, o compilador não reconhece `Scanner`.

---

## `System.in`

Quando usamos:

```java
new Scanner(System.in)
```

estamos dizendo que o scanner vai ler da entrada padrão.

`System.in` representa essa entrada.

Na prática desta aula:

```text
System.in = teclado/console.
```

Então:

```java
Scanner scanner = new Scanner(System.in);
```

significa:

```text
vou ler o que a pessoa digitar no console.
```

---

## Criando o Scanner

A criação básica é:

```java
Scanner scanner = new Scanner(System.in);
```

Aqui temos:

```text
Scanner -> tipo da variável;
scanner -> nome da variável;
new Scanner(System.in) -> criação do objeto Scanner.
```

Ainda não estudamos objetos profundamente.

Então, por enquanto, entenda de forma prática:

```text
essa linha prepara a leitura do teclado.
```

Mais tarde, quando estudarmos orientação a objetos, `new`, construtores e instâncias serão explicados em profundidade.

Agora o objetivo é usar.

---

## Fechando o Scanner

Depois de usar, é comum fechar o scanner:

```java
scanner.close();
```

Isso libera o recurso associado.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);

// leituras

scanner.close();
```

Em programas pequenos de console, fechar no final é aceitável.

Mas há um cuidado: se você fechar um `Scanner` que usa `System.in`, a entrada padrão também pode ser fechada para aquele programa.

Por isso, em exemplos simples, feche no fim do `main`, depois de todas as leituras.

Não feche no meio do programa se ainda pretende ler mais dados.

---

## `nextLine()`

`nextLine()` lê uma linha inteira digitada pelo usuário.

Exemplo:

```java
String nome = scanner.nextLine();
```

Se a pessoa digitar:

```text
Ana Silva
```

a variável recebe:

```text
Ana Silva
```

Incluindo o espaço entre as palavras.

`nextLine()` é muito útil para textos:

```text
nome completo;
observação;
descrição;
mensagem;
endereço;
status digitado;
e-mail;
código textual.
```

---

## Exemplo mínimo com `nextLine()`

Arquivo:

```text
Main.java
```

Código:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite seu nome:");
        String nome = scanner.nextLine();

        System.out.println("Nome informado: " + nome);

        scanner.close();
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

Digite um nome e observe a saída.

---

## `nextInt()`

`nextInt()` lê um número inteiro.

Exemplo:

```java
int idade = scanner.nextInt();
```

Se a pessoa digitar:

```text
30
```

a variável recebe:

```java
30
```

`nextInt()` é útil para:

```text
idade;
quantidade;
opção de menu;
número de página;
tentativas;
código numérico;
prazo em dias.
```

Mas ele exige que o valor digitado seja inteiro.

Se a pessoa digitar texto, o programa gera erro.

---

## Exemplo mínimo com `nextInt()`

Código:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite sua idade:");
        int idade = scanner.nextInt();

        System.out.println("Idade informada: " + idade);

        scanner.close();
    }
}
```

Entrada:

```text
30
```

Saída:

```text
Idade informada: 30
```

Se digitar:

```text
trinta
```

o programa dará erro.

Tratamento de erro será estudado depois.

---

## `nextDouble()`

`nextDouble()` lê um número decimal.

Exemplo:

```java
double valor = scanner.nextDouble();
```

O formato aceito pode depender do `Locale`.

Em alguns ambientes, pode aceitar vírgula.

Em outros, pode aceitar ponto.

Para evitar confusão nos exemplos, vamos configurar `Locale`.

---

## O problema do decimal com vírgula e ponto

Em português do Brasil, escrevemos:

```text
99,90
```

Em código Java, normalmente escrevemos literal decimal assim:

```java
99.90
```

Com `Scanner`, o separador decimal depende da configuração regional usada.

Para padronizar exemplos com ponto decimal, podemos usar:

```java
Locale.US
```

Assim, a entrada esperada fica:

```text
99.90
```

e não:

```text
99,90
```

Isso reduz confusão nos primeiros programas.

---

## Importando Locale

Para usar `Locale`, importe:

```java
import java.util.Locale;
```

Exemplo:

```java
import java.util.Locale;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o valor:");
        double valor = scanner.nextDouble();

        System.out.println("Valor informado: " + valor);

        scanner.close();
    }
}
```

Com `Locale.US`, digite:

```text
99.90
```

---

## Onde colocar `Locale.setDefault(Locale.US)`

Coloque antes de criar ou usar o scanner:

```java
Locale.setDefault(Locale.US);

Scanner scanner = new Scanner(System.in);
```

Exemplo:

```java
import java.util.Locale;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        double valor = scanner.nextDouble();

        scanner.close();
    }
}
```

Isso deixa o exemplo previsível.

No mundo real, locale é assunto importante para internacionalização, formatação, entrada de dados e moeda.

Aqui estamos usando apenas para simplificar a leitura decimal.

---

## Exemplo mínimo com `nextDouble()`

Código:

```java
import java.util.Locale;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o valor do produto:");
        double valorProduto = scanner.nextDouble();

        System.out.println("Valor informado: " + valorProduto);

        scanner.close();
    }
}
```

Entrada:

```text
99.90
```

Saída:

```text
Valor informado: 99.9
```

A impressão padrão pode mostrar `99.9`.

Isso é exibição, não entrada.

Formatação monetária será estudada depois.

---

## Diferença entre `next()` e `nextLine()`

Existe também:

```java
scanner.next()
```

`next()` lê apenas até o próximo espaço.

Exemplo:

```java
String nome = scanner.next();
```

Se a pessoa digitar:

```text
Ana Silva
```

`next()` lê apenas:

```text
Ana
```

Já:

```java
scanner.nextLine()
```

lê:

```text
Ana Silva
```

Nesta formação, para textos, prefira `nextLine()`.

Ele é mais previsível para nomes completos e descrições.

---

## O problema do buffer

Um erro clássico acontece quando misturamos:

```text
nextInt ou nextDouble
```

com:

```text
nextLine
```

Exemplo problemático:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite sua idade:");
        int idade = scanner.nextInt();

        System.out.println("Digite seu nome:");
        String nome = scanner.nextLine();

        System.out.println("Idade: " + idade);
        System.out.println("Nome: " + nome);

        scanner.close();
    }
}
```

O programa pode “pular” a leitura do nome.

Por quê?

Porque `nextInt()` lê o número, mas deixa a quebra de linha pendente no buffer.

O `nextLine()` seguinte consome essa quebra de linha.

---

## Limpando o buffer

Depois de `nextInt()` ou `nextDouble()`, se você for usar `nextLine()`, consuma a quebra de linha pendente:

```java
scanner.nextLine();
```

Exemplo corrigido:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite sua idade:");
        int idade = scanner.nextInt();
        scanner.nextLine();

        System.out.println("Digite seu nome:");
        String nome = scanner.nextLine();

        System.out.println("Idade: " + idade);
        System.out.println("Nome: " + nome);

        scanner.close();
    }
}
```

A linha:

```java
scanner.nextLine();
```

após o `nextInt()` limpa o restante da linha.

---

## Por que isso acontece

Quando a pessoa digita:

```text
30
```

e aperta Enter, a entrada contém algo como:

```text
30\n
```

`nextInt()` pega:

```text
30
```

mas deixa:

```text
\n
```

Aí `nextLine()` lê esse `\n` restante e entende como uma linha vazia.

Por isso parece que pulou a pergunta.

A limpeza de buffer resolve:

```java
scanner.nextLine();
```

Essa é uma das pegadinhas mais importantes com `Scanner`.

---

## Estratégia simples para iniciantes

Regra prática:

```text
se usar nextInt ou nextDouble e depois nextLine,
adicione scanner.nextLine() para limpar o buffer.
```

Exemplo:

```java
int quantidade = scanner.nextInt();
scanner.nextLine();

String observacao = scanner.nextLine();
```

E:

```java
double valor = scanner.nextDouble();
scanner.nextLine();

String descricao = scanner.nextLine();
```

Esse padrão evita muitos erros.

---

## Alternativa: ler tudo com `nextLine()`

Outra estratégia é ler tudo como texto e converter depois.

Exemplo futuro:

```java
String idadeTexto = scanner.nextLine();
int idade = Integer.parseInt(idadeTexto);
```

E:

```java
String valorTexto = scanner.nextLine();
double valor = Double.parseDouble(valorTexto);
```

Essa abordagem dá mais controle, principalmente em validações.

Mas conversões e tratamento de erro serão estudados depois.

Nesta aula, vamos usar `nextInt`, `nextDouble` e limpeza de buffer.

---

## Exemplo completo: nome, idade e valor

Arquivo:

```text
CadastroSimples.java
```

Código:

```java
import java.util.Locale;
import java.util.Scanner;

public class CadastroSimples {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome:");
        String nome = scanner.nextLine();

        System.out.println("Digite a idade:");
        int idade = scanner.nextInt();

        System.out.println("Digite o valor da compra:");
        double valorCompra = scanner.nextDouble();

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Valor da compra: " + valorCompra);

        scanner.close();
    }
}
```

Aqui não há `nextLine()` depois do `nextInt()` porque não lemos texto depois do `nextDouble()`.

Mas se depois do valor houvesse observação em texto, precisaríamos limpar o buffer.

---

## Exemplo completo com limpeza de buffer

Arquivo:

```text
CadastroComObservacao.java
```

Código:

```java
import java.util.Locale;
import java.util.Scanner;

public class CadastroComObservacao {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome:");
        String nome = scanner.nextLine();

        System.out.println("Digite a idade:");
        int idade = scanner.nextInt();

        System.out.println("Digite o valor da compra:");
        double valorCompra = scanner.nextDouble();
        scanner.nextLine();

        System.out.println("Digite uma observação:");
        String observacao = scanner.nextLine();

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Valor da compra: " + valorCompra);
        System.out.println("Observação: " + observacao);

        scanner.close();
    }
}
```

A limpeza está aqui:

```java
scanner.nextLine();
```

Depois de `nextDouble()` e antes da próxima leitura textual.

---

## Exemplo aplicado ao domínio corporativo: cliente

Arquivo:

```text
CadastroClienteConsole.java
```

Código:

```java
import java.util.Scanner;

public class CadastroClienteConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do cliente:");
        String nomeCliente = scanner.nextLine();

        System.out.println("Digite o e-mail do cliente:");
        String emailCliente = scanner.nextLine();

        System.out.println("Digite o CPF do cliente:");
        String cpfCliente = scanner.nextLine();

        boolean nomeInformado = !nomeCliente.isBlank();
        boolean emailPossuiArroba = emailCliente.contains("@");
        boolean cpfTamanhoValido = cpfCliente.length() == 11;

        System.out.println("Nome informado: " + nomeInformado);
        System.out.println("E-mail possui arroba: " + emailPossuiArroba);
        System.out.println("CPF tem tamanho válido: " + cpfTamanhoValido);

        scanner.close();
    }
}
```

Esse exemplo combina:

```text
Scanner;
nextLine;
String;
isBlank;
contains;
length;
boolean.
```

Já começa a parecer validação de entrada.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
CadastroPedidoConsole.java
```

Código:

```java
import java.util.Locale;
import java.util.Scanner;

public class CadastroPedidoConsole {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o código do pedido:");
        String codigoPedido = scanner.nextLine();

        System.out.println("Digite a quantidade de itens:");
        int quantidadeItens = scanner.nextInt();

        System.out.println("Digite o valor total:");
        double valorTotal = scanner.nextDouble();

        boolean codigoInformado = !codigoPedido.isBlank();
        boolean quantidadeValida = quantidadeItens > 0;
        boolean valorValido = valorTotal > 0;

        System.out.println("Código informado: " + codigoInformado);
        System.out.println("Quantidade válida: " + quantidadeValida);
        System.out.println("Valor válido: " + valorValido);

        scanner.close();
    }
}
```

Entrada sugerida:

```text
PED-001
3
150.75
```

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
CadastroOrdemServicoConsole.java
```

Código:

```java
import java.util.Scanner;

public class CadastroOrdemServicoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o número da OS:");
        String numeroOrdemServico = scanner.nextLine();

        System.out.println("Digite o status da OS:");
        String statusOrdemServico = scanner.nextLine();

        System.out.println("Digite a quantidade de atividades:");
        int quantidadeAtividades = scanner.nextInt();
        scanner.nextLine();

        System.out.println("Digite uma observação:");
        String observacao = scanner.nextLine();

        boolean numeroInformado = !numeroOrdemServico.isBlank();
        boolean statusAberto = statusOrdemServico.equalsIgnoreCase("ABERTA");
        boolean possuiAtividades = quantidadeAtividades > 0;
        boolean observacaoInformada = !observacao.isBlank();

        System.out.println("Número informado: " + numeroInformado);
        System.out.println("Status aberto: " + statusAberto);
        System.out.println("Possui atividades: " + possuiAtividades);
        System.out.println("Observação informada: " + observacaoInformada);

        scanner.close();
    }
}
```

Aqui a limpeza de buffer é necessária:

```java
scanner.nextLine();
```

Depois de:

```java
scanner.nextInt();
```

porque depois vem:

```java
scanner.nextLine();
```

---

## Exemplo aplicado ao domínio corporativo: produto

Arquivo:

```text
CadastroProdutoConsole.java
```

Código:

```java
import java.util.Locale;
import java.util.Scanner;

public class CadastroProdutoConsole {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o código do produto:");
        String codigoProduto = scanner.nextLine();

        System.out.println("Digite a descrição do produto:");
        String descricaoProduto = scanner.nextLine();

        System.out.println("Digite a quantidade em estoque:");
        int quantidadeEstoque = scanner.nextInt();

        System.out.println("Digite o peso em kg:");
        double pesoKg = scanner.nextDouble();

        boolean codigoInformado = !codigoProduto.isBlank();
        boolean descricaoInformada = !descricaoProduto.isBlank();
        boolean estoqueValido = quantidadeEstoque >= 0;
        boolean pesoValido = pesoKg > 0;

        System.out.println("Código informado: " + codigoInformado);
        System.out.println("Descrição informada: " + descricaoInformada);
        System.out.println("Estoque válido: " + estoqueValido);
        System.out.println("Peso válido: " + pesoValido);

        scanner.close();
    }
}
```

Esse exemplo reúne:

```text
texto;
inteiro;
decimal;
boolean;
validação simples.
```

---

## Exemplo aplicado ao domínio corporativo: auditoria

Arquivo:

```text
RegistroAuditoriaConsole.java
```

Código:

```java
import java.util.Scanner;

public class RegistroAuditoriaConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o usuário responsável:");
        String usuarioResponsavel = scanner.nextLine();

        System.out.println("Digite o evento:");
        String evento = scanner.nextLine();

        System.out.println("Digite a origem:");
        String origem = scanner.nextLine();

        boolean usuarioInformado = !usuarioResponsavel.isBlank();
        boolean eventoAlteracaoStatus = evento.equalsIgnoreCase("ALTERACAO_STATUS");
        boolean origemSistema = origem.equalsIgnoreCase("SISTEMA");

        System.out.println("Usuário informado: " + usuarioInformado);
        System.out.println("Evento alteração status: " + eventoAlteracaoStatus);
        System.out.println("Origem sistema: " + origemSistema);

        scanner.close();
    }
}
```

Esse exemplo mostra entrada textual e validações de domínio.

---

## Scanner e validação ainda não são tratamento robusto

Nesta aula, ainda não estamos tratando exceções.

Se o programa espera:

```java
int quantidade = scanner.nextInt();
```

e a pessoa digita:

```text
abc
```

o programa quebra.

Isso será resolvido no futuro com:

```text
tratamento de exceções;
validação antes de converter;
loops;
mensagens de erro;
repetição até entrada válida;
parsers;
DTOs;
Bean Validation;
testes.
```

Agora estamos aprendendo a leitura básica.

Não tente resolver tudo de uma vez.

---

## Scanner em backend real

Em backend web profissional, você raramente usa `Scanner` para ler dados do usuário.

APIs recebem dados por:

```text
JSON;
query parameters;
path variables;
headers;
body HTTP;
mensagens de fila;
eventos;
arquivos;
banco.
```

Então por que aprender `Scanner`?

Porque ele ensina a lógica de entrada:

```text
receber dado externo;
guardar em variável;
validar;
processar;
responder.
```

Esse mesmo ciclo aparece em APIs.

Exemplo com console:

```text
usuário digita nome;
programa lê;
programa valida;
programa imprime resultado.
```

Exemplo com API futura:

```text
cliente envia JSON;
controller recebe;
serviço valida;
API responde.
```

A ideia é a mesma, só muda o canal de entrada.

---

## Vocabulário essencial

Termos importantes desta aula:

```text
entrada de dados;
entrada padrão;
System.in;
Scanner;
nextLine;
nextInt;
nextDouble;
Locale;
Locale.US;
buffer;
limpeza de buffer;
close;
validação inicial;
interação via console.
```

Guarde principalmente:

```text
nextLine lê linha inteira;
nextInt lê inteiro;
nextDouble lê decimal;
nextInt/nextDouble podem deixar quebra de linha pendente;
scanner.nextLine() pode limpar o buffer;
Locale ajuda a padronizar decimal.
```

---

## Erros comuns

### Erro 1 — Esquecer o import

Errado:

```java
Scanner scanner = new Scanner(System.in);
```

sem:

```java
import java.util.Scanner;
```

Erro:

```text
cannot find symbol
```

Correção:

```java
import java.util.Scanner;
```

---

### Erro 2 — Esquecer `new Scanner(System.in)`

Errado:

```java
Scanner scanner;
String nome = scanner.nextLine();
```

A variável foi declarada, mas não inicializada.

Correção:

```java
Scanner scanner = new Scanner(System.in);
```

---

### Erro 3 — Digitar texto quando o programa espera inteiro

Código:

```java
int idade = scanner.nextInt();
```

Entrada errada:

```text
trinta
```

O programa gera erro.

Tratamento virá depois.

---

### Erro 4 — Digitar decimal com vírgula quando o programa espera ponto

Com:

```java
Locale.setDefault(Locale.US);
```

entrada esperada:

```text
99.90
```

Se digitar:

```text
99,90
```

pode dar erro.

---

### Erro 5 — Misturar `nextInt()` com `nextLine()` sem limpar buffer

Problema clássico:

```java
int idade = scanner.nextInt();
String nome = scanner.nextLine();
```

Correção:

```java
int idade = scanner.nextInt();
scanner.nextLine();
String nome = scanner.nextLine();
```

---

### Erro 6 — Fechar scanner cedo demais

Errado:

```java
scanner.close();

String nome = scanner.nextLine();
```

Depois de fechar, não use mais o scanner.

Feche no final.

---

### Erro 7 — Usar `next()` achando que lê nome completo

Código:

```java
String nome = scanner.next();
```

Entrada:

```text
Ana Silva
```

Lê apenas:

```text
Ana
```

Use:

```java
scanner.nextLine();
```

para linha inteira.

---

### Erro 8 — Criar vários Scanners para `System.in`

Evite criar vários scanners lendo `System.in` no mesmo programa simples.

Prefira um scanner:

```java
Scanner scanner = new Scanner(System.in);
```

Use ele até o final.

---

### Erro 9 — Não orientar o usuário

Ruim:

```java
String nome = scanner.nextLine();
```

Sem mensagem, a pessoa não sabe o que digitar.

Melhor:

```java
System.out.println("Digite o nome:");
String nome = scanner.nextLine();
```

---

### Erro 10 — Não validar entrada textual

Se o usuário digitar só espaços:

```text

```

`nextLine()` lê.

Por isso use:

```java
nome.isBlank()
```

para validação inicial.

---

## Diagnóstico de erro com Scanner

Quando algo der errado, siga este roteiro.

### 1. O import existe?

```java
import java.util.Scanner;
```

### 2. O scanner foi criado?

```java
Scanner scanner = new Scanner(System.in);
```

### 3. Está usando o método correto?

```text
nextLine para texto;
nextInt para inteiro;
nextDouble para decimal.
```

### 4. O usuário digitou o formato esperado?

Inteiro para `nextInt`.

Decimal compatível com locale para `nextDouble`.

### 5. Misturou número com texto?

Se sim, verifique limpeza de buffer:

```java
scanner.nextLine();
```

### 6. Fechou o scanner antes da hora?

Se fechou, não tente ler depois.

### 7. Está usando `next()` quando deveria usar `nextLine()`?

Nomes completos precisam de `nextLine()`.

### 8. Configurou Locale quando usa decimal?

Use:

```java
Locale.setDefault(Locale.US);
```

para padronizar ponto decimal.

### 9. O erro acontece em execução, não compilação?

Leia a exceção e a linha indicada.

### 10. O programa parece pular pergunta?

Provável buffer pendente.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esquecer import

Remova:

```java
import java.util.Scanner;
```

Compile e leia o erro.

### Teste 2 — Digitar texto em `nextInt()`

Código:

```java
int idade = scanner.nextInt();
```

Digite:

```text
abc
```

Observe o erro.

### Teste 3 — Problema do buffer

Código:

```java
System.out.println("Digite a idade:");
int idade = scanner.nextInt();

System.out.println("Digite o nome:");
String nome = scanner.nextLine();
```

Execute e observe que o nome pode ser pulado.

Depois corrija:

```java
scanner.nextLine();
```

### Teste 4 — Decimal com Locale.US

Use:

```java
Locale.setDefault(Locale.US);
double valor = scanner.nextDouble();
```

Digite:

```text
99,90
```

Depois digite:

```text
99.90
```

Observe a diferença.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-030-scanner
cd labs\m1\aula-030-scanner
```

Crie arquivos:

```text
Main.java
LeituraNome.java
LeituraIdade.java
LeituraValor.java
CadastroSimples.java
CadastroComObservacao.java
CadastroClienteConsole.java
CadastroPedidoConsole.java
CadastroOrdemServicoConsole.java
CadastroProdutoConsole.java
RegistroAuditoriaConsole.java
```

Compile:

```powershell
javac Main.java
javac LeituraNome.java
javac LeituraIdade.java
javac LeituraValor.java
javac CadastroSimples.java
javac CadastroComObservacao.java
javac CadastroClienteConsole.java
javac CadastroPedidoConsole.java
javac CadastroOrdemServicoConsole.java
javac CadastroProdutoConsole.java
javac RegistroAuditoriaConsole.java
```

Execute:

```powershell
java Main
java LeituraNome
java LeituraIdade
java LeituraValor
java CadastroSimples
java CadastroComObservacao
java CadastroClienteConsole
java CadastroPedidoConsole
java CadastroOrdemServicoConsole
java CadastroProdutoConsole
java RegistroAuditoriaConsole
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `LeituraNome.java`

```java
import java.util.Scanner;

public class LeituraNome {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite seu nome:");
        String nome = scanner.nextLine();

        System.out.println("Nome informado: " + nome);

        scanner.close();
    }
}
```

---

## Arquivo sugerido: `LeituraIdade.java`

```java
import java.util.Scanner;

public class LeituraIdade {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite sua idade:");
        int idade = scanner.nextInt();

        System.out.println("Idade informada: " + idade);

        scanner.close();
    }
}
```

---

## Arquivo sugerido: `LeituraValor.java`

```java
import java.util.Locale;
import java.util.Scanner;

public class LeituraValor {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);

        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite um valor decimal usando ponto:");
        double valor = scanner.nextDouble();

        System.out.println("Valor informado: " + valor);

        scanner.close();
    }
}
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Gerar import automático | `Alt + Enter` | Importar `Scanner` ou `Locale` |
| Reformatar código | `Ctrl + Alt + L` | Organizar código |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Debugar leitura |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Search Everywhere | `Shift Shift` | Buscar classes |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 030 — Entrada de dados com Scanner

### O que aprendi
Aprendi a usar `Scanner` para ler dados digitados no console, usando `nextLine`, `nextInt` e `nextDouble`.

### O que pratiquei
Criei programas interativos para ler nome, idade, valor decimal, cliente, pedido, ordem de serviço, produto e auditoria.

### Conceitos principais
- `Scanner`
- `System.in`
- `nextLine()`
- `nextInt()`
- `nextDouble()`
- `Locale`
- `Locale.US`
- buffer
- limpeza de buffer
- `scanner.nextLine()` após leitura numérica
- `scanner.close()`
- entrada de dados
- validação inicial

### Arquivos criados
- `labs/m1/aula-030-scanner/Main.java`
- `labs/m1/aula-030-scanner/LeituraNome.java`
- `labs/m1/aula-030-scanner/LeituraIdade.java`
- `labs/m1/aula-030-scanner/LeituraValor.java`
- `labs/m1/aula-030-scanner/CadastroSimples.java`
- `labs/m1/aula-030-scanner/CadastroComObservacao.java`
- `labs/m1/aula-030-scanner/CadastroClienteConsole.java`
- `labs/m1/aula-030-scanner/CadastroPedidoConsole.java`
- `labs/m1/aula-030-scanner/CadastroOrdemServicoConsole.java`
- `labs/m1/aula-030-scanner/CadastroProdutoConsole.java`
- `labs/m1/aula-030-scanner/RegistroAuditoriaConsole.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac LeituraNome.java
java LeituraNome
javac LeituraIdade.java
java LeituraIdade
javac LeituraValor.java
java LeituraValor
```

### Erros que quero evitar
- esquecer `import java.util.Scanner`;
- esquecer `new Scanner(System.in)`;
- digitar texto quando o programa espera inteiro;
- digitar decimal com vírgula quando o exemplo usa `Locale.US`;
- misturar `nextInt` ou `nextDouble` com `nextLine` sem limpar buffer;
- fechar scanner antes da hora;
- usar `next()` esperando nome completo;
- criar vários scanners para `System.in`;
- não orientar o usuário antes da leitura;
- não validar textos em branco.

### Próximo passo
Estudar operadores aritméticos.
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
git add labs/m1/aula-030-scanner docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 030: pratica entrada de dados com Scanner"
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
1. Para que serve `Scanner`?
2. Para que serve `System.in`?
3. Qual import é necessário para usar `Scanner`?
4. Qual a diferença entre `nextLine()` e `next()`?
5. Para que serve `nextInt()`?
6. Para que serve `nextDouble()`?
7. Por que usamos `Locale.US` nos exemplos com decimal?
8. O que é o problema do buffer ao misturar `nextInt()` e `nextLine()`?
9. Como limpar o buffer?
10. Por que Scanner no console ajuda a entender entrada de dados antes de APIs?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
importar Scanner;
criar Scanner com System.in;
ler texto com nextLine;
ler inteiro com nextInt;
ler decimal com nextDouble;
usar Locale.US em exemplo decimal;
explicar entrada padrão;
explicar que nextLine lê linha inteira;
explicar que next lê apenas token;
explicar problema de buffer;
corrigir problema de buffer com scanner.nextLine();
fechar scanner no final;
não fechar scanner antes da hora;
orientar usuário com mensagem antes da leitura;
validar texto com isBlank;
validar número com comparação simples;
aplicar Scanner em cliente;
aplicar Scanner em pedido;
aplicar Scanner em OS;
aplicar Scanner em produto;
aplicar Scanner em auditoria;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda tratar exceções.

Não precisa ainda repetir leitura até entrada válida.

Não precisa ainda converter manualmente com `parseInt`.

Não precisa ainda criar menu.

Esses temas virão depois.

O objetivo é dominar entrada básica com `Scanner` e entender a armadilha do buffer.

---

## Fechamento da aula

Hoje os programas começaram a receber dados externos.

Isso é um marco.

Antes, os valores estavam fixos no código.

Agora, o usuário pode digitar.

Aprendemos:

```text
Scanner;
System.in;
nextLine;
nextInt;
nextDouble;
Locale;
limpeza de buffer;
scanner.close;
validações iniciais.
```

Também vimos que `Scanner` não é exatamente o que usamos em APIs profissionais, mas ensina um conceito fundamental:

```text
entrada externa precisa ser lida, guardada, validada e processada.
```

Essa lógica vai aparecer de novo em:

```text
controllers;
DTOs;
JSON;
forms;
requests;
mensagens;
arquivos;
integrações.
```

Na próxima aula, vamos estudar operadores aritméticos.

Com entrada de dados e operadores, os programas começam a calcular resultados em vez de apenas guardar e imprimir valores.
