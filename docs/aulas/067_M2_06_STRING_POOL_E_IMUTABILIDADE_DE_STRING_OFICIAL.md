# 067 — M2.06 — String Pool e Imutabilidade de String

## A pergunta central da aula

Observe este código:

```java
String primeiro = "Ana";
String segundo = "Ana";

System.out.println(primeiro == segundo);
System.out.println(primeiro.equals(segundo));
```

A saída pode ser:

```text
true
true
```

Agora observe:

```java
String primeiro = "Ana";
String segundo = new String("Ana");

System.out.println(primeiro == segundo);
System.out.println(primeiro.equals(segundo));
```

A saída será:

```text
false
true
```

Por quê?

Porque:

```text
== compara referência;
equals compara conteúdo;
literais podem usar o mesmo objeto no String pool;
new String força criação de outro objeto.
```

Essa é a base da aula.

---

## String é objeto

Em Java, `String` é uma classe.

Quando escrevemos:

```java
String nome = "Ana";
```

`nome` é uma referência para um objeto `String`.

A diferença é que `String` é tão usada que a linguagem oferece suporte especial para literais:

```java
"Ana"
"APROVADO"
"PENDENTE"
"Olá"
```

Esses textos entre aspas são literais de String.

Eles podem ser armazenados em uma área especial chamada:

```text
String pool.
```

---

## O que é String pool

String pool é uma área usada pela JVM para reutilizar literais de `String`.

Exemplo:

```java
String a = "Java";
String b = "Java";
```

As duas variáveis podem apontar para o mesmo objeto literal no pool.

Mapa conceitual:

```text
a -> "Java" no pool
b -> "Java" no pool
```

Por isso:

```java
System.out.println(a == b);
```

pode imprimir:

```text
true
```

Mas isso não significa que `==` é a forma correta de comparar texto.

A forma correta de comparar conteúdo é:

```java
a.equals(b)
```

---

## O que new String faz

Quando escrevemos:

```java
String texto = new String("Java");
```

estamos pedindo explicitamente um novo objeto `String`.

Mesmo que o literal `"Java"` exista no pool, o `new String` cria outro objeto.

Exemplo:

```java
String a = "Java";
String b = new String("Java");

System.out.println(a == b);
System.out.println(a.equals(b));
```

Resultado:

```text
false
true
```

Porque:

```text
a e b apontam para objetos diferentes;
mas o conteúdo textual é igual.
```

---

## Regra profissional

Para comparar conteúdo de `String`, use:

```java
equals
```

ou, quando ignorar maiúsculas/minúsculas:

```java
equalsIgnoreCase
```

Não use `==` para comparar conteúdo textual.

Use `==` apenas quando a intenção for comparar se duas referências apontam para o mesmo objeto, o que é raro em regra de negócio.

Regra prática:

```text
texto se compara com equals, não com ==.
```

---

## O que é imutabilidade

String é imutável.

Isso significa:

```text
depois que um objeto String é criado, seu conteúdo não muda.
```

Exemplo:

```java
String status = " pendente ";

status.trim();
status.toUpperCase();

System.out.println(status);
```

Saída:

```text
 pendente 
```

Por quê?

Porque `trim()` e `toUpperCase()` não alteram a String original.

Eles retornam novas Strings.

Para guardar o resultado, precisamos atribuir:

```java
status = status.trim().toUpperCase();
```

---

## Por que String é imutável

A imutabilidade de `String` ajuda em vários pontos:

```text
segurança;
reutilização no String pool;
previsibilidade;
uso seguro em mapas e estruturas;
thread-safety conceitual;
evitar alteração inesperada de texto compartilhado;
otimizações internas da JVM.
```

Imagine se uma String literal pudesse ser alterada.

Código A usa:

```java
"APROVADO"
```

Código B também usa:

```java
"APROVADO"
```

Se um deles conseguisse alterar o conteúdo do objeto compartilhado, causaria caos.

Por isso, String é imutável.

---

## Vocabulário essencial

Termos desta aula:

```text
String;
literal;
String pool;
imutabilidade;
referência;
conteúdo;
equals;
equalsIgnoreCase;
==;
new String;
concatenação;
performance;
objeto temporário;
intern;
trim;
toUpperCase;
toLowerCase;
isBlank;
isEmpty;
contains;
startsWith;
endsWith;
replace;
substring;
normalização;
comparação segura;
case-sensitive;
case-insensitive.
```

Termos mais importantes:

```text
String pool -> área de reutilização de literais de String;
imutável -> objeto cujo conteúdo não muda após criado;
== -> compara referência;
equals -> compara conteúdo;
new String -> cria novo objeto String explicitamente;
concatenação -> junção de textos;
objeto temporário -> objeto criado durante operações como concatenação ou normalização;
normalização -> transformação para formato padrão antes de comparar ou persistir.
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
        String primeiro = "Java";
        String segundo = "Java";

        System.out.println(primeiro == segundo);
        System.out.println(primeiro.equals(segundo));
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
true
true
```

Interpretação:

```text
os dois literais podem apontar para o mesmo objeto no String pool;
as referências são iguais;
o conteúdo também é igual.
```

Mas não conclua que `==` é correto para texto.

Vamos ver o próximo exemplo.

---

## Exemplo com new String

Arquivo:

```text
StringNew.java
```

Código:

```java
public class StringNew {
    public static void main(String[] args) {
        String primeiro = "Java";
        String segundo = new String("Java");

        System.out.println(primeiro == segundo);
        System.out.println(primeiro.equals(segundo));
    }
}
```

Saída:

```text
false
true
```

Interpretação:

```text
primeiro aponta para literal no pool;
segundo aponta para novo objeto;
== compara referência e dá false;
equals compara conteúdo e dá true.
```

Conclusão:

```text
para conteúdo textual, use equals.
```

---

## Exemplo com String criada em tempo de execução

Arquivo:

```text
StringRuntime.java
```

Código:

```java
public class StringRuntime {
    public static void main(String[] args) {
        String parte = "Ja";
        String primeiro = "Java";
        String segundo = parte + "va";

        System.out.println(primeiro);
        System.out.println(segundo);
        System.out.println(primeiro == segundo);
        System.out.println(primeiro.equals(segundo));
    }
}
```

Saída esperada:

```text
Java
Java
false
true
```

Mesmo conteúdo.

Referências diferentes.

Mais um motivo para não usar `==` em regra de negócio com texto.

---

## Comparando status corretamente

Arquivo:

```text
CompararStatus.java
```

Código:

```java
public class CompararStatus {
    public static void main(String[] args) {
        String status = new String("APROVADO");

        if ("APROVADO".equals(status)) {
            System.out.println("Pedido aprovado.");
        } else {
            System.out.println("Pedido não aprovado.");
        }
    }
}
```

Saída:

```text
Pedido aprovado.
```

Usamos:

```java
"APROVADO".equals(status)
```

Isso é bom por dois motivos:

```text
compara conteúdo;
evita NullPointerException se status for null.
```

---

## Erro com == em status

Arquivo:

```text
ErroCompararStatusComIgualIgual.java
```

Código propositalmente problemático:

```java
public class ErroCompararStatusComIgualIgual {
    public static void main(String[] args) {
        String status = new String("APROVADO");

        if (status == "APROVADO") {
            System.out.println("Pedido aprovado.");
        } else {
            System.out.println("Pedido não aprovado.");
        }
    }
}
```

Saída:

```text
Pedido não aprovado.
```

O conteúdo é o mesmo.

Mas as referências são diferentes.

Correção:

```java
if ("APROVADO".equals(status)) {
```

---

## equalsIgnoreCase

Quando não importa maiúscula/minúscula, use:

```java
equalsIgnoreCase
```

Arquivo:

```text
EqualsIgnoreCaseExemplo.java
```

Código:

```java
public class EqualsIgnoreCaseExemplo {
    public static void main(String[] args) {
        String entrada = "aprovado";

        if ("APROVADO".equalsIgnoreCase(entrada)) {
            System.out.println("Status reconhecido.");
        } else {
            System.out.println("Status inválido.");
        }
    }
}
```

Saída:

```text
Status reconhecido.
```

Isso é útil em entrada de usuário.

Mas em backend, muitas vezes preferimos normalizar:

```java
String statusNormalizado = entrada.trim().toUpperCase();
```

e depois comparar com `equals`.

---

## Normalização de String

Normalizar é transformar texto em formato padrão.

Exemplo:

```java
String status = " aprovado ";
String statusNormalizado = status.trim().toUpperCase();
```

Resultado:

```text
APROVADO.
```

Isso ajuda a evitar bugs por:

```text
espaços;
minúsculas;
maiúsculas;
entrada inconsistente.
```

Arquivo:

```text
NormalizacaoStatus.java
```

Código:

```java
public class NormalizacaoStatus {
    public static void main(String[] args) {
        String status = " aprovado ";

        String statusNormalizado = normalizarStatus(status);

        if ("APROVADO".equals(statusNormalizado)) {
            System.out.println("Aprovado.");
        } else {
            System.out.println("Não aprovado.");
        }
    }

    public static String normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return "NAO_INFORMADO";
        }

        return status.trim().toUpperCase();
    }
}
```

Saída:

```text
Aprovado.
```

---

## Imutabilidade na prática

Arquivo:

```text
StringImutavel.java
```

Código:

```java
public class StringImutavel {
    public static void main(String[] args) {
        String texto = " Java ";

        texto.trim();
        texto.toUpperCase();

        System.out.println("Texto original: [" + texto + "]");

        String textoTratado = texto.trim().toUpperCase();

        System.out.println("Texto tratado: [" + textoTratado + "]");
    }
}
```

Saída:

```text
Texto original: [ Java ]
Texto tratado: [JAVA]
```

`trim()` e `toUpperCase()` retornam novos valores.

A String original não muda.

---

## Erro comum: chamar método e ignorar retorno

Arquivo:

```text
ErroIgnorarRetornoString.java
```

Código propositalmente problemático:

```java
public class ErroIgnorarRetornoString {
    public static void main(String[] args) {
        String status = " aprovado ";

        status.trim();
        status.toUpperCase();

        if ("APROVADO".equals(status)) {
            System.out.println("Aprovado.");
        } else {
            System.out.println("Não aprovado.");
        }
    }
}
```

Saída:

```text
Não aprovado.
```

Correção:

```java
status = status.trim().toUpperCase();
```

---

## String em método

Arquivo:

```text
StringMetodoSemRetorno.java
```

Código:

```java
public class StringMetodoSemRetorno {
    public static void main(String[] args) {
        String status = " aprovado ";

        normalizar(status);

        System.out.println("Status no main: [" + status + "]");
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: [" + status + "]");
    }
}
```

Saída:

```text
Status no método: [APROVADO]
Status no main: [ aprovado ]
```

Motivo:

```text
String é imutável;
o parâmetro recebeu cópia da referência;
a reatribuição aconteceu só no parâmetro local.
```

Correção:

```java
status = normalizar(status);
```

---

## String em método com retorno

Arquivo:

```text
StringMetodoComRetorno.java
```

Código:

```java
public class StringMetodoComRetorno {
    public static void main(String[] args) {
        String status = " aprovado ";

        status = normalizar(status);

        System.out.println("Status no main: [" + status + "]");
    }

    public static String normalizar(String status) {
        if (status == null || status.isBlank()) {
            return "NAO_INFORMADO";
        }

        return status.trim().toUpperCase();
    }
}
```

Saída:

```text
Status no main: [APROVADO]
```

Regra:

```text
método que transforma String deve retornar String.
```

---

## Concatenação de String

Concatenação é juntar textos.

Exemplo:

```java
String mensagem = "Cliente: " + nome;
```

Isso é comum e correto em mensagens simples.

Exemplo:

```java
String cliente = "Ana";
long valor = 1000L;

String resumo = "Cliente: " + cliente + " | Valor: " + valor;

System.out.println(resumo);
```

Para pequenas concatenações, use `+` sem medo.

O problema aparece quando fazemos concatenação repetida em loops grandes.

---

## Concatenação dentro de loop

Arquivo:

```text
ConcatenacaoLoop.java
```

Código:

```java
public class ConcatenacaoLoop {
    public static void main(String[] args) {
        String resultado = "";

        for (int indice = 1; indice <= 5; indice++) {
            resultado = resultado + "Item " + indice + "\n";
        }

        System.out.println(resultado);
    }
}
```

Funciona.

Mas conceitualmente, como String é imutável, cada concatenação pode gerar novos objetos intermediários.

Para 5 itens, não importa.

Para milhares de itens, pode ser ruim.

A solução para montagem repetida é usar:

```text
StringBuilder.
```

A próxima aula vai aprofundar `StringBuilder` e `StringBuffer`.

Nesta aula, guarde:

```text
concatenação simples com + é ok;
concatenação repetida em loop grande merece StringBuilder.
```

---

## Exemplo com StringBuilder inicial

Arquivo:

```text
StringBuilderInicial.java
```

Código:

```java
public class StringBuilderInicial {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 1; indice <= 5; indice++) {
            builder.append("Item ");
            builder.append(indice);
            builder.append("\n");
        }

        String resultado = builder.toString();

        System.out.println(resultado);
    }
}
```

Aqui o `StringBuilder` é mutável.

Ele permite montar texto aos poucos.

Na próxima aula, vamos estudar isso em profundidade.

---

## intern

Existe um método chamado:

```java
intern()
```

Ele tenta retornar a representação canônica da String no pool.

Exemplo:

```java
String primeiro = "Java";
String segundo = new String("Java").intern();

System.out.println(primeiro == segundo);
```

Pode imprimir:

```text
true
```

Mas atenção:

```text
não use intern como solução comum de regra de negócio.
```

Ele é um recurso avançado e específico.

Para comparar texto, continue usando:

```java
equals.
```

---

## Exemplo didático com intern

Arquivo:

```text
InternDidatico.java
```

Código:

```java
public class InternDidatico {
    public static void main(String[] args) {
        String primeiro = "Java";
        String segundo = new String("Java");
        String terceiro = segundo.intern();

        System.out.println(primeiro == segundo);
        System.out.println(primeiro == terceiro);
        System.out.println(primeiro.equals(segundo));
    }
}
```

Saída esperada:

```text
false
true
true
```

Interpretação:

```text
segundo é outro objeto;
terceiro referencia a versão do pool;
conteúdo é igual.
```

Não precisa usar `intern` em código comum agora.

Precisa entender que existe e que se relaciona ao pool.

---

## Métodos úteis de String

Alguns métodos importantes:

```java
trim()
toUpperCase()
toLowerCase()
isBlank()
isEmpty()
contains()
startsWith()
endsWith()
replace()
substring()
equals()
equalsIgnoreCase()
```

Exemplo:

```java
String texto = " Pedido aprovado ";

System.out.println(texto.trim());
System.out.println(texto.toUpperCase());
System.out.println(texto.toLowerCase());
System.out.println(texto.contains("aprovado"));
System.out.println(texto.trim().startsWith("Pedido"));
System.out.println(texto.trim().endsWith("aprovado"));
```

Lembre:

```text
muitos métodos retornam nova String ou boolean;
eles não alteram a String original.
```

---

## isBlank versus isEmpty

`isEmpty()` verifica tamanho zero.

```java
"".isEmpty()      -> true
"   ".isEmpty()   -> false
```

`isBlank()` verifica vazio ou apenas espaços.

```java
"".isBlank()      -> true
"   ".isBlank()   -> true
```

Arquivo:

```text
BlankVsEmpty.java
```

Código:

```java
public class BlankVsEmpty {
    public static void main(String[] args) {
        String vazio = "";
        String espacos = "   ";

        System.out.println("vazio isEmpty: " + vazio.isEmpty());
        System.out.println("vazio isBlank: " + vazio.isBlank());

        System.out.println("espacos isEmpty: " + espacos.isEmpty());
        System.out.println("espacos isBlank: " + espacos.isBlank());
    }
}
```

Para validação de entrada textual, `isBlank()` costuma ser mais útil.

---

## Aplicação em pedido

Arquivo:

```text
PedidoStringSeguro.java
```

Código:

```java
public class PedidoStringSeguro {
    public static void main(String[] args) {
        Pedido pedido = criarPedido(" Ana ", " aprovado ");

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Status: " + pedido.status);

        if ("APROVADO".equals(pedido.status)) {
            System.out.println("Pedido aprovado.");
        }
    }

    public static Pedido criarPedido(String cliente, String status) {
        Pedido pedido = new Pedido();

        pedido.cliente = normalizarNome(cliente);
        pedido.status = normalizarStatus(status);

        return pedido;
    }

    public static String normalizarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            return "NAO_INFORMADO";
        }

        return nome.trim();
    }

    public static String normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return "NAO_INFORMADO";
        }

        return status.trim().toUpperCase();
    }
}

class Pedido {
    String cliente;
    String status;
}
```

Esse exemplo usa:

```text
trim;
toUpperCase;
equals seguro;
retorno de String;
normalização.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoStringSeguro.java
```

Código:

```java
public class ProdutoStringSeguro {
    public static void main(String[] args) {
        Produto produto = criarProduto(" cadeira gamer ", " ativo ");

        System.out.println("Nome: " + produto.nome);
        System.out.println("Status: " + produto.status);

        if ("ATIVO".equals(produto.status)) {
            System.out.println("Produto disponível.");
        }
    }

    public static Produto criarProduto(String nome, String status) {
        Produto produto = new Produto();

        produto.nome = normalizarNomeProduto(nome);
        produto.status = normalizarStatus(status);

        return produto;
    }

    public static String normalizarNomeProduto(String nome) {
        if (nome == null || nome.isBlank()) {
            return "PRODUTO_SEM_NOME";
        }

        return nome.trim();
    }

    public static String normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return "INATIVO";
        }

        return status.trim().toUpperCase();
    }
}

class Produto {
    String nome;
    String status;
}
```

O ponto é:

```text
texto de entrada não deve ser usado cru quando a regra exige padrão.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoStringSeguro.java
```

Código:

```java
public class OrdemServicoStringSeguro {
    public static void main(String[] args) {
        OrdemServico os = criarOs(" os-001 ", " aberta ");

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Status: " + os.status);

        if ("ABERTA".equals(os.status)) {
            System.out.println("OS pode seguir fluxo.");
        }
    }

    public static OrdemServico criarOs(String certificado, String status) {
        OrdemServico os = new OrdemServico();

        os.certificado = normalizarCertificado(certificado);
        os.status = normalizarStatus(status);

        return os;
    }

    public static String normalizarCertificado(String certificado) {
        if (certificado == null || certificado.isBlank()) {
            return "SEM_CERTIFICADO";
        }

        return certificado.trim().toUpperCase();
    }

    public static String normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return "NAO_INFORMADO";
        }

        return status.trim().toUpperCase();
    }
}

class OrdemServico {
    String certificado;
    String status;
}
```

Esse exemplo mostra normalização de identificador textual.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaStringSeguro.java
```

Código:

```java
public class MensageriaStringSeguro {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem(" Ana ", " entrega ");

        String texto = montarMensagem(mensagem);

        System.out.println(texto);
    }

    public static Mensagem criarMensagem(String cliente, String tipo) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = normalizarTexto(cliente, "CLIENTE_NAO_INFORMADO");
        mensagem.tipo = normalizarTexto(tipo, "TIPO_NAO_INFORMADO");

        return mensagem;
    }

    public static String normalizarTexto(String texto, String valorPadrao) {
        if (texto == null || texto.isBlank()) {
            return valorPadrao;
        }

        return texto.trim().toUpperCase();
    }

    public static String montarMensagem(Mensagem mensagem) {
        return "Cliente: " + mensagem.cliente + " | Tipo: " + mensagem.tipo;
    }
}

class Mensagem {
    String cliente;
    String tipo;
}
```

Aqui usamos concatenação simples.

Isso é adequado para uma mensagem pequena.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaStringSeguro.java
```

Código:

```java
public class AuditoriaStringSeguro {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro(" aline ", " edicao ", " sucesso ");

        System.out.println(montarLinha(registro));
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao, String status) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = normalizarUsuario(usuario);
        registro.operacao = normalizarCodigo(operacao);
        registro.status = normalizarCodigo(status);

        return registro;
    }

    public static String normalizarUsuario(String usuario) {
        if (usuario == null || usuario.isBlank()) {
            return "USUARIO_NAO_INFORMADO";
        }

        return usuario.trim().toLowerCase();
    }

    public static String normalizarCodigo(String texto) {
        if (texto == null || texto.isBlank()) {
            return "NAO_INFORMADO";
        }

        return texto.trim().toUpperCase();
    }

    public static String montarLinha(RegistroAuditoria registro) {
        return registro.usuario + " | " + registro.operacao + " | " + registro.status;
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
}
```

Aqui usamos normalização diferente:

```text
usuário em minúsculo;
operação e status em maiúsculo.
```

Isso é decisão de padronização.

---

## Refatoração: remover comparação com ==

Código ruim:

```java
if (status == "APROVADO") {
    aprovar();
}
```

Refatoração:

```java
if ("APROVADO".equals(status)) {
    aprovar();
}
```

Motivo:

```text
== compara referência;
equals compara conteúdo;
literal no lado esquerdo evita NPE.
```

---

## Refatoração: capturar retorno de String

Código ruim:

```java
status.trim();
status.toUpperCase();
```

Refatoração:

```java
status = status.trim().toUpperCase();
```

Ou melhor:

```java
status = normalizarStatus(status);
```

Motivo:

```text
String é imutável;
métodos retornam nova String;
normalização em método melhora reuso.
```

---

## Refatoração: evitar concatenação grande em loop

Código problemático em loop grande:

```java
String relatorio = "";

for (int indice = 0; indice < itens.length; indice++) {
    relatorio = relatorio + itens[indice] + "\n";
}
```

Refatoração inicial:

```java
StringBuilder relatorio = new StringBuilder();

for (int indice = 0; indice < itens.length; indice++) {
    relatorio.append(itens[indice]).append("\n");
}

String texto = relatorio.toString();
```

A próxima aula vai aprofundar `StringBuilder`.

Nesta aula, basta entender a motivação.

---

## Erros comuns

### Erro 1 — Comparar String com ==

```java
status == "APROVADO"
```

Use:

```java
"APROVADO".equals(status)
```

---

### Erro 2 — Achar que String muda

```java
status.trim();
```

Não muda `status`.

Retorna nova String.

---

### Erro 3 — Ignorar retorno de toUpperCase

```java
status.toUpperCase();
```

Precisa:

```java
status = status.toUpperCase();
```

---

### Erro 4 — Usar new String sem necessidade

```java
new String("Java")
```

Normalmente não precisa.

Use:

```java
"Java"
```

---

### Erro 5 — Confiar no String pool para regra de negócio

Mesmo que `==` dê true em alguns literais, use `equals`.

---

### Erro 6 — Fazer concatenação grande em loop

Para loops grandes, prefira `StringBuilder`.

---

### Erro 7 — Não tratar null antes de método de String

```java
status.trim()
```

quebra se `status == null`.

---

### Erro 8 — Usar isEmpty quando deveria usar isBlank

`"   "` não é empty, mas é blank.

---

### Erro 9 — Normalizar sem documentar regra

Transformar tudo em maiúsculo ou minúsculo deve ter motivo.

---

### Erro 10 — Usar equalsIgnoreCase quando deveria normalizar

`equalsIgnoreCase` é útil, mas em dados persistidos costuma ser melhor normalizar antes.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugStringPool {
    public static void main(String[] args) {
        String primeiro = "Java";
        String segundo = new String("Java");

        boolean mesmaReferencia = primeiro == segundo;
        boolean mesmoConteudo = primeiro.equals(segundo);

        System.out.println(mesmaReferencia);
        System.out.println(mesmoConteudo);
    }
}
```

Coloque breakpoint em:

```java
boolean mesmaReferencia = primeiro == segundo;
```

Observe:

```text
primeiro = "Java";
segundo = "Java";
conteúdo parece igual;
== retorna false;
equals retorna true.
```

Depois debugue:

```java
String status = " aprovado ";
status.trim();
status.toUpperCase();
```

Observe que `status` não muda.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-067-string-pool-imutabilidade
cd labs\m2\aula-067-string-pool-imutabilidade
```

Crie arquivos:

```text
Main.java
StringNew.java
StringRuntime.java
CompararStatus.java
ErroCompararStatusComIgualIgual.java
EqualsIgnoreCaseExemplo.java
NormalizacaoStatus.java
StringImutavel.java
ErroIgnorarRetornoString.java
StringMetodoSemRetorno.java
StringMetodoComRetorno.java
ConcatenacaoLoop.java
StringBuilderInicial.java
InternDidatico.java
MetodosString.java
BlankVsEmpty.java
PedidoStringSeguro.java
ProdutoStringSeguro.java
OrdemServicoStringSeguro.java
MensageriaStringSeguro.java
AuditoriaStringSeguro.java
DebugStringPool.java
ErroStringIgualIgual.java
ErroStringImutavel.java
ErroConcatenacaoLoop.java
README.md
```

Compile:

```powershell
javac Main.java
javac StringNew.java
javac StringRuntime.java
javac CompararStatus.java
javac ErroCompararStatusComIgualIgual.java
javac EqualsIgnoreCaseExemplo.java
javac NormalizacaoStatus.java
javac StringImutavel.java
javac ErroIgnorarRetornoString.java
javac StringMetodoSemRetorno.java
javac StringMetodoComRetorno.java
javac ConcatenacaoLoop.java
javac StringBuilderInicial.java
javac InternDidatico.java
javac MetodosString.java
javac BlankVsEmpty.java
javac PedidoStringSeguro.java
javac ProdutoStringSeguro.java
javac OrdemServicoStringSeguro.java
javac MensageriaStringSeguro.java
javac AuditoriaStringSeguro.java
javac DebugStringPool.java
javac ErroStringIgualIgual.java
javac ErroStringImutavel.java
javac ErroConcatenacaoLoop.java
```

Execute:

```powershell
java Main
java StringNew
java StringRuntime
java CompararStatus
java ErroCompararStatusComIgualIgual
java EqualsIgnoreCaseExemplo
java NormalizacaoStatus
java StringImutavel
java ErroIgnorarRetornoString
java StringMetodoSemRetorno
java StringMetodoComRetorno
java ConcatenacaoLoop
java StringBuilderInicial
java InternDidatico
java MetodosString
java BlankVsEmpty
java PedidoStringSeguro
java ProdutoStringSeguro
java OrdemServicoStringSeguro
java MensageriaStringSeguro
java AuditoriaStringSeguro
java DebugStringPool
java ErroStringIgualIgual
java ErroStringImutavel
java ErroConcatenacaoLoop
```

---

## Arquivo complementar: MetodosString.java

Crie também este arquivo para testar métodos comuns:

```java
public class MetodosString {
    public static void main(String[] args) {
        String texto = " Pedido aprovado ";

        System.out.println("Original: [" + texto + "]");
        System.out.println("trim: [" + texto.trim() + "]");
        System.out.println("toUpperCase: [" + texto.toUpperCase() + "]");
        System.out.println("toLowerCase: [" + texto.toLowerCase() + "]");
        System.out.println("contains aprovado: " + texto.contains("aprovado"));
        System.out.println("startsWith Pedido: " + texto.trim().startsWith("Pedido"));
        System.out.println("endsWith aprovado: " + texto.trim().endsWith("aprovado"));
        System.out.println("replace: " + texto.replace("aprovado", "pendente"));
        System.out.println("substring: " + texto.trim().substring(0, 6));
    }
}
```

Objetivo:

```text
ver que métodos de String retornam valores;
não alteram a String original.
```

---

## Observações

- Não comparar texto com `==`.
- Não ignorar retorno de métodos de String.
- Validar null antes de chamar métodos de String.
- Normalizar dados textuais quando a regra exigir.
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
git add labs/m2/aula-067-string-pool-imutabilidade docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 067: pratica String pool e imutabilidade em Java"
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
explicar String como objeto;
explicar literal de String;
explicar String pool;
explicar new String;
diferenciar referência de conteúdo;
explicar ==;
explicar equals;
explicar equalsIgnoreCase;
corrigir comparação com ==;
explicar imutabilidade;
corrigir retorno ignorado de trim;
corrigir retorno ignorado de toUpperCase;
normalizar status;
validar null antes de método de String;
usar equals seguro;
diferenciar isBlank e isEmpty;
explicar concatenação simples;
explicar risco de concatenação em loop;
usar StringBuilder inicial;
explicar intern conceitualmente;
aplicar em pedido;
aplicar em produto;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar comparação de String;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar implementação interna completa do pool.

Não precisa ainda dominar compact strings.

Não precisa ainda dominar benchmark de String.

Não precisa ainda dominar todos os métodos de String.

Não precisa ainda dominar regex.

Não precisa ainda dominar StringBuilder profundamente.

Esses assuntos virão depois.

O objetivo é dominar comparação, imutabilidade, normalização e cuidados básicos de performance com `String`.

---

## Fechamento da aula

Hoje estudamos String pool e imutabilidade de String.

A ideia central foi:

```text
String é objeto, String é imutável e conteúdo textual deve ser comparado com equals.
```

Vimos que:

```text
literais podem usar String pool;
new String cria outro objeto;
== compara referência;
equals compara conteúdo;
equalsIgnoreCase ignora maiúsculas/minúsculas;
trim e toUpperCase retornam nova String;
concatenação simples é normal;
concatenação repetida em loop pode ser ruim;
StringBuilder resolve montagem repetida.
```

O ponto mais importante é:

```text
nunca dependa de == para comparar conteúdo de String em regra de negócio.
```

Na próxima aula, vamos estudar:

```text
StringBuilder e StringBuffer.
```

A próxima aula vai aprofundar montagem eficiente de texto, diferença entre mutabilidade e imutabilidade, métodos principais, cenários de relatório, logs, mensagens e performance inicial.
