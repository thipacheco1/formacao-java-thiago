# 028 — M1.08 — Char e String em Uso Inicial

## Onde estamos na formação

Estamos no Módulo 1, consolidando os tipos básicos usados no início da linguagem Java.

Até aqui, já passamos por:

```text
M1.01 — primeiro programa Java destrinchado;
M1.02 — blocos, chaves, indentação e leitura de código;
M1.03 — comentários úteis e documentação inicial;
M1.04 — variáveis e nomes profissionais;
M1.05 — tipos inteiros em Java;
M1.06 — tipos decimais e primeiras limitações;
M1.07 — boolean e regras verdadeiras/falsas.
```

Agora vamos estudar dois tipos muito usados no começo:

```text
char;
String.
```

Eles lidam com texto, mas não são a mesma coisa.

Essa diferença precisa ficar clara desde cedo.

Exemplos:

```java
char categoria = 'A';
String nomeCliente = "Cliente Exemplo";
```

Um usa aspas simples.

Outro usa aspas duplas.

Um guarda um único caractere.

Outro guarda uma sequência de caracteres.

---

## Hoje a aula é sobre texto com precisão

Todo sistema backend lida com texto.

Exemplos:

```text
nome de cliente;
e-mail;
CPF ou CNPJ como texto;
status;
descrição;
mensagem de erro;
código externo;
número de pedido;
número de ordem de serviço;
categoria;
sigla;
observação;
identificador de integração;
payload textual;
token;
header HTTP;
nome de produto.
```

Alguns textos têm um único caractere.

Outros têm várias letras, números e símbolos.

Em Java, a diferença básica é:

```text
char -> um único caractere;
String -> texto com zero, um ou muitos caracteres.
```

Essa aula vai construir essa base.

---

## O que é `char`

`char` é um tipo primitivo do Java usado para armazenar um único caractere.

Exemplo:

```java
char categoria = 'A';
```

Aqui:

```text
tipo: char;
nome: categoria;
valor: 'A'.
```

O valor de `char` fica entre aspas simples:

```java
'A'
```

Outros exemplos:

```java
char sexo = 'M';
char inicial = 'J';
char tipoPessoa = 'F';
char nivelPrioridade = 'A';
```

Regra inicial:

```text
char guarda um caractere.
```

---

## `char` usa aspas simples

Correto:

```java
char categoria = 'A';
```

Errado:

```java
char categoria = "A";
```

Por quê?

Porque `"A"` é `String`.

`'A'` é `char`.

A diferença visual parece pequena, mas para Java é grande.

Aspas simples:

```text
char
```

Aspas duplas:

```text
String
```

---

## `char` não guarda várias letras

Errado:

```java
char sigla = 'SP';
```

`char` guarda um único caractere.

`SP` tem dois caracteres.

Certo:

```java
String siglaEstado = "SP";
```

Outro erro:

```java
char status = 'OK';
```

Certo:

```java
String status = "OK";
```

Regra:

```text
um caractere -> char;
mais de um caractere -> String.
```

---

## O que é `String`

`String` representa texto.

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";
```

Aqui:

```text
tipo: String;
nome: nomeCliente;
valor: "Cliente Exemplo".
```

`String` usa aspas duplas:

```java
"Cliente Exemplo"
```

Outros exemplos:

```java
String email = "cliente@exemplo.com";
String statusPedido = "PENDENTE";
String codigoPedido = "PED-001";
String numeroOrdemServico = "OS-1001";
String mensagemErro = "Campo obrigatório não informado";
```

`String` é muito usada em Java.

---

## `String` não é tipo primitivo

Este detalhe é importante.

Tipos primitivos já vistos:

```text
byte;
short;
int;
long;
float;
double;
boolean;
char.
```

`String` não é primitivo.

`String` é uma classe.

Por isso começa com letra maiúscula:

```java
String
```

Não é:

```java
string
```

Errado:

```java
string nome = "Ana";
```

Certo:

```java
String nome = "Ana";
```

No começo, use `String` como tipo de texto.

Mais tarde, vamos estudar objetos e entender melhor o que significa `String` ser uma classe.

---

## String vazia

Uma `String` pode estar vazia:

```java
String observacao = "";
```

Isso significa:

```text
existe texto, mas ele não tem nenhum caractere.
```

Não é a mesma coisa que `null`, que será estudado depois.

Por enquanto, entenda:

```text
"" é texto vazio.
```

Exemplo:

```java
String complementoEndereco = "";

System.out.println("Complemento: " + complementoEndereco);
```

---

## String com espaço

Uma `String` pode conter espaço:

```java
String nomeCompleto = "Maria Silva";
```

O espaço entre as palavras faz parte do texto.

Outro exemplo:

```java
String mensagem = "Pedido aprovado com sucesso";
```

Tudo dentro das aspas duplas faz parte do valor.

---

## String com números

Muitos códigos parecem número, mas devem ser tratados como texto.

Exemplos:

```java
String cep = "06454000";
String cpf = "12345678900";
String codigoPedido = "000123";
String numeroOrdemServico = "OS-1001";
```

Por que não usar `int`?

Porque esses valores podem:

```text
ter zero à esquerda;
ter letras;
ter máscara;
não serem usados para cálculo;
representar identificação, não quantidade.
```

Exemplo perigoso:

```java
int cep = 06454000;
```

Além de poder causar confusão, CEP não é número para cálculo.

CEP é identificador textual.

Melhor:

```java
String cep = "06454000";
```

---

## Identificador não é necessariamente número

Regra importante de backend:

```text
nem tudo que contém dígitos deve ser número.
```

Exemplos que geralmente devem ser texto:

```text
CPF;
CNPJ;
CEP;
número de contrato;
código externo;
código de produto com zero à esquerda;
número de pedido formatado;
certificado;
protocolo;
placa;
telefone.
```

Use número quando houver intenção numérica:

```text
somar;
subtrair;
comparar maior/menor;
contar;
calcular;
ordenar numericamente.
```

Use `String` quando o valor for identificação textual.

---

## Exemplo mínimo com `char`

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        char categoria = 'A';

        System.out.println("Categoria: " + categoria);
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
Categoria: A
```

---

## Exemplo mínimo com `String`

Código:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente Exemplo";

        System.out.println("Nome do cliente: " + nomeCliente);
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
Nome do cliente: Cliente Exemplo
```

---

## `char` e `String` no mesmo programa

Código:

```java
public class Main {
    public static void main(String[] args) {
        char categoriaCliente = 'A';
        String nomeCliente = "Cliente Exemplo";

        System.out.println("Nome: " + nomeCliente);
        System.out.println("Categoria: " + categoriaCliente);
    }
}
```

Saída:

```text
Nome: Cliente Exemplo
Categoria: A
```

Aqui:

```text
nomeCliente -> texto completo;
categoriaCliente -> um caractere.
```

---

## Concatenação com `String`

Concatenação é juntar textos.

Em Java, usamos `+` para concatenar.

Exemplo:

```java
String nome = "Ana";
String sobrenome = "Silva";

String nomeCompleto = nome + " " + sobrenome;

System.out.println(nomeCompleto);
```

Saída:

```text
Ana Silva
```

O trecho:

```java
" "
```

é uma String com um espaço.

Sem ele, sairia:

```text
AnaSilva
```

---

## Concatenação com números

Quando uma `String` participa de uma soma com `+`, o Java faz concatenação textual.

Exemplo:

```java
String produto = "Mesa";
int quantidade = 2;

System.out.println("Produto: " + produto + ", quantidade: " + quantidade);
```

Saída:

```text
Produto: Mesa, quantidade: 2
```

O número foi convertido para texto na concatenação.

Isso é muito usado em mensagens no console.

---

## Cuidado com ordem na concatenação

Exemplo:

```java
int a = 10;
int b = 20;

System.out.println("Resultado: " + a + b);
```

Saída:

```text
Resultado: 1020
```

Por quê?

Porque começou com `String`.

Então o `+` virou concatenação.

Correção:

```java
System.out.println("Resultado: " + (a + b));
```

Saída:

```text
Resultado: 30
```

Parênteses forçam a soma antes da concatenação.

Esse erro é comum.

---

## Exemplo de concatenação correta

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidadeProdutos = 10;
        int quantidadeReservada = 3;

        System.out.println("Disponível: " + (quantidadeProdutos - quantidadeReservada));
    }
}
```

Saída:

```text
Disponível: 7
```

Sem parênteses, dependendo da expressão, a leitura pode mudar.

Use parênteses quando quiser deixar claro.

---

## Caracteres especiais em String

Alguns caracteres precisam ser escapados.

Exemplo de aspas dentro do texto:

```java
String mensagem = "Cliente informou: \"pedido urgente\"";
```

Saída:

```text
Cliente informou: "pedido urgente"
```

A barra invertida:

```java
\
```

serve para escapar.

Outro exemplo:

```java
String caminho = "C:\\dev\\projects";
```

Saída:

```text
C:\dev\projects
```

No começo, use apenas quando necessário.

---

## Quebra de linha com `\n`

Você pode usar:

```java
\n
```

para quebra de linha dentro da String.

Exemplo:

```java
String mensagem = "Linha 1\nLinha 2";

System.out.println(mensagem);
```

Saída:

```text
Linha 1
Linha 2
```

Mais tarde, veremos alternativas melhores para textos grandes.

Por enquanto, reconheça o recurso.

---

## Tabulação com `\t`

`\t` representa tabulação.

Exemplo:

```java
System.out.println("Produto\tQuantidade");
System.out.println("Mesa\t2");
```

Saída aproximada:

```text
Produto Quantidade
Mesa    2
```

Isso pode ajudar em saídas simples no console.

Não é formatação profissional de relatório.

É apenas recurso inicial.

---

## `String` com `null`

Mais tarde, vamos estudar `null`.

Mas é importante ver que uma variável `String` pode receber `null`:

```java
String observacao = null;
```

Isso significa:

```text
a variável não aponta para nenhum texto.
```

Não é igual a:

```java
""
```

String vazia é texto vazio.

`null` é ausência de referência.

Não vamos aprofundar agora.

Mas cuidado: chamar operações em `null` pode causar erro.

Isso será estudado depois com mais calma.

---

## Primeiros métodos de String

Como `String` é uma classe, ela possui métodos.

Alguns exemplos iniciais:

```java
String nome = "Cliente Exemplo";

System.out.println(nome.length());
System.out.println(nome.toUpperCase());
System.out.println(nome.toLowerCase());
```

Resultados:

```text
15
CLIENTE EXEMPLO
cliente exemplo
```

Não vamos aprofundar todos os métodos agora.

Mas é importante saber:

```text
String tem comportamentos próprios.
```

---

## `length()`

`length()` retorna o tamanho do texto.

Exemplo:

```java
String codigo = "OS-1001";

System.out.println(codigo.length());
```

Saída:

```text
7
```

Contagem:

```text
O S - 1 0 0 1
1 2 3 4 5 6 7
```

`length()` será útil para validações.

Exemplo futuro:

```text
CPF deve ter 11 dígitos;
CEP deve ter 8 dígitos;
senha deve ter tamanho mínimo.
```

---

## `toUpperCase()` e `toLowerCase()`

Exemplo:

```java
String status = "aberta";

System.out.println(status.toUpperCase());
System.out.println(status.toLowerCase());
```

Saída:

```text
ABERTA
aberta
```

Esses métodos ajudam a padronizar textos.

Mas cuidado:

```text
padronizar exibição é diferente de alterar regra de negócio.
```

Neste momento, use apenas como primeiro contato.

---

## String é imutável em nível inicial

Quando você faz:

```java
String nome = "ana";
nome.toUpperCase();

System.out.println(nome);
```

A saída continua:

```text
ana
```

Por quê?

Porque `toUpperCase()` gera uma nova String, mas você não guardou o resultado.

Correto:

```java
String nome = "ana";
String nomeMaiusculo = nome.toUpperCase();

System.out.println(nomeMaiusculo);
```

Saída:

```text
ANA
```

String ser imutável será aprofundado depois.

Por enquanto, guarde:

```text
métodos de String frequentemente retornam uma nova String.
```

---

## Exemplo aplicado: cliente

Arquivo:

```text
ClienteTexto.java
```

Código:

```java
public class ClienteTexto {
    public static void main(String[] args) {
        String nomeCliente = "Cliente Exemplo";
        String emailCliente = "cliente@exemplo.com";
        char categoriaCliente = 'A';

        System.out.println("Nome: " + nomeCliente);
        System.out.println("Email: " + emailCliente);
        System.out.println("Categoria: " + categoriaCliente);
    }
}
```

Aqui:

```text
nome e email são String;
categoria é char.
```

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoTexto.java
```

Código:

```java
public class PedidoTexto {
    public static void main(String[] args) {
        String codigoPedido = "PED-2026-001";
        String statusPedido = "PENDENTE";
        String nomeCliente = "Cliente Exemplo";

        System.out.println("Pedido: " + codigoPedido);
        System.out.println("Status: " + statusPedido);
        System.out.println("Cliente: " + nomeCliente);
    }
}
```

`codigoPedido` é `String`, mesmo contendo números.

Por quê?

Porque:

```text
não será usado para cálculo;
possui prefixo textual;
representa identificação.
```

---

## Exemplo aplicado: ordem de serviço

Arquivo:

```text
OrdemServicoTexto.java
```

Código:

```java
public class OrdemServicoTexto {
    public static void main(String[] args) {
        String numeroOrdemServico = "OS-1001";
        String statusOrdemServico = "ABERTA";
        String responsavel = "Backoffice";
        char prioridade = 'A';

        System.out.println("Ordem de Serviço: " + numeroOrdemServico);
        System.out.println("Status: " + statusOrdemServico);
        System.out.println("Responsável: " + responsavel);
        System.out.println("Prioridade: " + prioridade);
    }
}
```

`prioridade` como `char` faz sentido se for uma letra única:

```text
A;
B;
C.
```

Se prioridade fosse:

```text
ALTA;
MEDIA;
BAIXA.
```

então seria `String`, ou futuramente `enum`.

---

## Exemplo aplicado: documento e CEP

Arquivo:

```text
DocumentoTexto.java
```

Código:

```java
public class DocumentoTexto {
    public static void main(String[] args) {
        String cpf = "12345678900";
        String cep = "06454000";
        String telefone = "11999999999";

        System.out.println("CPF: " + cpf);
        System.out.println("CEP: " + cep);
        System.out.println("Telefone: " + telefone);
    }
}
```

Esses valores são texto.

Mesmo com dígitos, não são números para cálculo.

Isso evita perder zeros à esquerda e facilita aplicar máscara depois.

---

## Exemplo aplicado: mensagem de erro

Arquivo:

```text
MensagemErroTexto.java
```

Código:

```java
public class MensagemErroTexto {
    public static void main(String[] args) {
        String campo = "email";
        String mensagemErro = "Campo obrigatório não informado";

        System.out.println("Campo: " + campo);
        System.out.println("Erro: " + mensagemErro);
    }
}
```

Mensagens de erro são `String`.

Mais tarde, veremos validação, exceções e respostas de API.

Mas a base começa aqui.

---

## Exemplo aplicado: padronização de status

Arquivo:

```text
StatusTexto.java
```

Código:

```java
public class StatusTexto {
    public static void main(String[] args) {
        String statusInformado = "aberta";
        String statusPadronizado = statusInformado.toUpperCase();

        System.out.println("Status informado: " + statusInformado);
        System.out.println("Status padronizado: " + statusPadronizado);
    }
}
```

Saída:

```text
Status informado: aberta
Status padronizado: ABERTA
```

Observe que guardamos o retorno de `toUpperCase()`.

---

## Exemplo aplicado: tamanho de documento

Arquivo:

```text
TamanhoDocumentoTexto.java
```

Código:

```java
public class TamanhoDocumentoTexto {
    public static void main(String[] args) {
        String cpf = "12345678900";

        int tamanhoCpf = cpf.length();

        System.out.println("CPF: " + cpf);
        System.out.println("Tamanho do CPF: " + tamanhoCpf);
    }
}
```

Saída:

```text
CPF: 12345678900
Tamanho do CPF: 11
```

Isso prepara validações futuras.

---

## `char` em códigos de domínio

`char` pode representar códigos simples de um caractere.

Exemplos:

```java
char tipoPessoa = 'F';
char categoriaCliente = 'A';
char nivelPrioridade = 'B';
char tipoOperacao = 'C';
```

Mas cuidado.

Se o domínio crescer, `char` pode ficar pobre.

Exemplo:

```text
A = Alta;
M = Média;
B = Baixa.
```

O código sozinho não explica muito.

Uma `String` ou `enum` pode ser melhor no futuro.

Nesta aula, apenas entenda o uso inicial.

---

## Quando preferir String em vez de char

Prefira `String` quando:

```text
o valor tem mais de um caractere;
o valor representa código textual;
pode crescer no futuro;
precisa de métodos como length;
pode ser vazio;
pode ter espaços;
pode ser comparado como texto;
representa documento, telefone, CEP, status ou mensagem.
```

Exemplos:

```java
String status = "ABERTA";
String siglaEstado = "SP";
String codigoProduto = "A001";
String mensagem = "Erro ao processar solicitação";
```

---

## Quando usar char

Use `char` quando:

```text
realmente é um único caractere;
o domínio exige caractere único;
há clareza na regra;
não precisa de comportamento textual amplo.
```

Exemplos:

```java
char categoria = 'A';
char tipoPessoa = 'F';
char inicialNome = 'M';
```

Mesmo assim, em muitos sistemas modernos, `String` ou `enum` aparecem mais.

---

## Comparação de String ainda exige cuidado

Nesta aula, ainda não vamos aprofundar comparação de `String`.

Mas já fica o alerta:

```text
não compare String com == como regra geral.
```

Exemplo que será explicado depois:

```java
String status = "ABERTA";

// Evite como regra geral:
boolean aberta = status == "ABERTA";
```

Mais tarde, vamos aprender:

```java
boolean aberta = status.equals("ABERTA");
```

Por enquanto, apenas guarde o alerta.

Comparação de texto em Java tem detalhe importante.

---

## Erros comuns

### Erro 1 — Usar aspas duplas em `char`

Errado:

```java
char categoria = "A";
```

Certo:

```java
char categoria = 'A';
```

---

### Erro 2 — Usar aspas simples em `String`

Errado:

```java
String nome = 'Ana';
```

Certo:

```java
String nome = "Ana";
```

---

### Erro 3 — Colocar mais de um caractere em `char`

Errado:

```java
char sigla = 'SP';
```

Certo:

```java
String sigla = "SP";
```

---

### Erro 4 — Escrever `string` minúsculo

Errado:

```java
string nome = "Ana";
```

Certo:

```java
String nome = "Ana";
```

---

### Erro 5 — Tratar documento como número

Ruim:

```java
long cpf = 12345678900L;
```

Melhor:

```java
String cpf = "12345678900";
```

CPF não é usado para cálculo.

---

### Erro 6 — Perder zero à esquerda

Errado:

```java
int codigo = 00123;
```

Melhor:

```java
String codigo = "00123";
```

Identificadores com zeros à esquerda devem ser texto.

---

### Erro 7 — Concatenar sem espaço

Código:

```java
String nome = "Ana";
String sobrenome = "Silva";

System.out.println(nome + sobrenome);
```

Saída:

```text
AnaSilva
```

Correção:

```java
System.out.println(nome + " " + sobrenome);
```

---

### Erro 8 — Soma virar concatenação sem querer

Código:

```java
int a = 10;
int b = 20;

System.out.println("Resultado: " + a + b);
```

Saída:

```text
Resultado: 1020
```

Correção:

```java
System.out.println("Resultado: " + (a + b));
```

---

### Erro 9 — Não guardar retorno de método de String

Código:

```java
String status = "aberta";
status.toUpperCase();

System.out.println(status);
```

Saída:

```text
aberta
```

Correção:

```java
String statusPadronizado = status.toUpperCase();
```

---

### Erro 10 — Comparar String com `==`

Evite como regra geral:

```java
status == "ABERTA"
```

Será estudado depois.

Use o alerta:

```text
String se compara com cuidado.
```

---

## Diagnóstico de erro com char e String

Quando der erro, siga o roteiro.

### 1. O tipo é `char` ou `String`?

Veja a declaração.

### 2. Está usando aspas corretas?

```java
char -> 'A'
String -> "A"
```

### 3. O `char` tem apenas um caractere?

Se tiver mais de um, use `String`.

### 4. Escreveu `String` com S maiúsculo?

Tem que ser:

```java
String
```

### 5. O valor é documento, CEP ou código?

Provavelmente deve ser `String`.

### 6. Perdeu zero à esquerda?

Use `String`.

### 7. A concatenação ficou estranha?

Verifique espaços e parênteses.

### 8. O método de String retornou novo valor?

Guarde o retorno.

### 9. Está usando `==` com String?

Registre alerta e aguarde a aula de comparação.

### 10. O erro aponta linha?

Leia a mensagem do compilador.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — `char` com aspas duplas

```java
public class Main {
    public static void main(String[] args) {
        char categoria = "A";

        System.out.println(categoria);
    }
}
```

Compile e leia o erro.

### Teste 2 — `String` com aspas simples

```java
public class Main {
    public static void main(String[] args) {
        String nome = 'Ana';

        System.out.println(nome);
    }
}
```

Compile e leia o erro.

### Teste 3 — `char` com dois caracteres

```java
public class Main {
    public static void main(String[] args) {
        char sigla = 'SP';

        System.out.println(sigla);
    }
}
```

Compile e leia o erro.

### Teste 4 — concatenação sem parênteses

```java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println("Resultado: " + a + b);
        System.out.println("Resultado: " + (a + b));
    }
}
```

Execute e compare.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-028-char-string
cd labs\m1\aula-028-char-string
```

Crie arquivos:

```text
Main.java
ClienteTexto.java
PedidoTexto.java
OrdemServicoTexto.java
DocumentoTexto.java
MensagemErroTexto.java
StatusTexto.java
TamanhoDocumentoTexto.java
ConcatenacaoTexto.java
```

Compile:

```powershell
javac Main.java
javac ClienteTexto.java
javac PedidoTexto.java
javac OrdemServicoTexto.java
javac DocumentoTexto.java
javac MensagemErroTexto.java
javac StatusTexto.java
javac TamanhoDocumentoTexto.java
javac ConcatenacaoTexto.java
```

Execute:

```powershell
java Main
java ClienteTexto
java PedidoTexto
java OrdemServicoTexto
java DocumentoTexto
java MensagemErroTexto
java StatusTexto
java TamanhoDocumentoTexto
java ConcatenacaoTexto
```

Depois quebre os erros de propósito e registre no diário.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Renomear variável | `Shift + F6` | Melhorar nomes de textos |
| Reformatar código | `Ctrl + Alt + L` | Organizar código |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Search Everywhere | `Shift Shift` | Buscar classes |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Duplicar linha | `Ctrl + D` em muitos keymaps | Criar variações |
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
## Aula 028 — Char e String em uso inicial

### O que aprendi
Aprendi que `char` guarda um único caractere com aspas simples e `String` guarda texto com aspas duplas. Também aprendi que muitos valores com dígitos, como CPF, CEP e códigos, devem ser tratados como texto.

### O que pratiquei
Criei exemplos com `char`, `String`, concatenação, tamanho de texto, padronização com `toUpperCase()` e textos aplicados a cliente, pedido, OS, documentos e mensagens de erro.

### Conceitos principais
- `char`
- `String`
- aspas simples
- aspas duplas
- concatenação
- texto vazio
- identificador textual
- `length()`
- `toUpperCase()`
- `toLowerCase()`
- caracteres especiais
- `\n`
- `\t`

### Arquivos criados
- `labs/m1/aula-028-char-string/Main.java`
- `labs/m1/aula-028-char-string/ClienteTexto.java`
- `labs/m1/aula-028-char-string/PedidoTexto.java`
- `labs/m1/aula-028-char-string/OrdemServicoTexto.java`
- `labs/m1/aula-028-char-string/DocumentoTexto.java`
- `labs/m1/aula-028-char-string/MensagemErroTexto.java`
- `labs/m1/aula-028-char-string/StatusTexto.java`
- `labs/m1/aula-028-char-string/TamanhoDocumentoTexto.java`
- `labs/m1/aula-028-char-string/ConcatenacaoTexto.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ClienteTexto.java
java ClienteTexto
javac PedidoTexto.java
java PedidoTexto
javac OrdemServicoTexto.java
java OrdemServicoTexto
```

### Erros que quero evitar
- usar aspas duplas em `char`;
- usar aspas simples em `String`;
- colocar mais de um caractere em `char`;
- escrever `string` minúsculo;
- tratar CPF, CEP e código como número sem necessidade;
- perder zero à esquerda;
- concatenar sem espaço;
- soma virar concatenação;
- não guardar retorno de método de String;
- comparar String com `==` sem entender.

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
git add labs/m1/aula-028-char-string docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 028: pratica char e String em Java"
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
1. Qual a diferença entre `char` e `String`?
2. Qual tipo usa aspas simples?
3. Qual tipo usa aspas duplas?
4. Por que `char sigla = 'SP';` está errado?
5. Por que `String` começa com S maiúsculo?
6. Por que CPF e CEP geralmente devem ser `String`?
7. O que é concatenação?
8. Por que `"Resultado: " + a + b` pode gerar resultado inesperado?
9. Para que serve `length()`?
10. Por que precisamos guardar o retorno de `toUpperCase()`?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
declarar char;
declarar String;
explicar diferença entre char e String;
usar aspas simples para char;
usar aspas duplas para String;
corrigir char com aspas duplas;
corrigir String com aspas simples;
corrigir char com mais de um caractere;
usar String com texto vazio;
explicar que String não é primitivo;
explicar que CPF, CEP e códigos podem ser String;
concatenar textos;
concatenar texto com número;
usar parênteses para controlar soma em concatenação;
usar length() em exemplo simples;
usar toUpperCase() em exemplo simples;
guardar retorno de método de String;
usar caracteres especiais em nível inicial;
aplicar texto em cliente, pedido, OS e documentos;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar todos os métodos de `String`.

Não precisa ainda dominar comparação de `String`.

Não precisa ainda dominar `StringBuilder`.

Não precisa ainda dominar encoding, Unicode ou imutabilidade em profundidade.

Esses temas virão depois.

O objetivo é usar `char` e `String` corretamente no início.

---

## Fechamento da aula

Hoje estudamos texto em Java no primeiro nível.

Aprendemos que:

```text
char guarda um caractere;
String guarda texto;
char usa aspas simples;
String usa aspas duplas;
String começa com letra maiúscula porque é classe;
nem todo valor com dígitos é número;
concatenação exige atenção;
métodos de String retornam novos valores.
```

Isso fecha uma parte importante da base de tipos iniciais.

Agora conseguimos representar:

```text
números inteiros;
decimais;
verdadeiro/falso;
caracteres;
textos.
```

Na próxima aula, vamos estudar operadores aritméticos.

Com isso, começaremos a transformar variáveis em cálculos e regras mais elaboradas.
