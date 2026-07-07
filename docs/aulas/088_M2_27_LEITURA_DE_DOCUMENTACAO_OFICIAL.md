# 088 — M2.27 — Leitura de documentação oficial

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
terminal integrado funcionando;
atalho de documentação rápida funcionando ou acessível pelo menu.
```

A prática desta aula será feita em:

```text
labs/m2/aula-088-leitura-documentacao-oficial
```

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
084 — M2.23 — Text blocks;
085 — M2.24 — Exceptions por baixo;
086 — M2.25 — Entrada/saída básica com console robusto;
087 — M2.26 — Organização de pacotes desde cedo;
088 — M2.27 — Leitura de documentação oficial.
```

Na aula anterior, começamos a organizar código com pacotes.

Agora vamos estudar uma habilidade que separa quem apenas copia código de quem aprende de verdade:

```text
ler documentação oficial.
```

Essa aula é fundamental porque Java é grande.

Nenhuma pessoa memoriza tudo.

O que um bom desenvolvedor aprende é:

```text
saber procurar;
saber ler;
saber interpretar;
saber testar;
saber decidir.
```

Documentação oficial é uma fonte primária.

Ela não substitui prática.

Mas evita muito chute.

---

## A pergunta central da aula

Imagine que você encontra este método:

```java
String valor = " Java ";

String resultado = valor.trim();
```

Você sabe que `trim()` remove espaços.

Mas a documentação responde perguntas mais precisas:

```text
remove quais espaços?
remove do começo e do fim?
muda a String original?
retorna nova String?
o que acontece se não houver espaço?
qual diferença para strip?
desde quando existe?
há exceção?
```

Outro exemplo:

```java
BigDecimal valor = new BigDecimal("10.50");

valor.compareTo(BigDecimal.ZERO);
```

A documentação ajuda a entender:

```text
o que compareTo retorna?
quando retorna -1?
quando retorna 0?
quando retorna 1?
por que não usar ==?
qual diferença entre equals e compareTo?
```

A pergunta central é:

```text
como transformar documentação oficial em entendimento prático?
```

---

## O que é documentação oficial

Documentação oficial é a documentação publicada e mantida pelo responsável pela tecnologia.

No caso do Java, a documentação da API mostra:

```text
classes;
interfaces;
records;
enums;
métodos;
construtores;
parâmetros;
retornos;
exceções;
descrições;
observações;
versões;
relações de herança;
implementações;
contratos.
```

Para Java, esse tipo de documentação costuma ser chamado de:

```text
JavaDoc.
```

JavaDoc é documentação gerada a partir de comentários e estrutura do código Java.

---

## Por que ler documentação oficial

Ler documentação oficial ajuda a:

```text
evitar chute;
confirmar comportamento;
descobrir exceções;
entender retorno;
entender parâmetros;
diferenciar métodos parecidos;
usar API corretamente;
saber o que é garantido;
saber o que é detalhe de implementação;
entender limitações;
tomar decisão técnica.
```

Exemplo:

```text
"acho que esse método remove espaços"
```

é mais fraco que:

```text
"li a documentação e confirmei que esse método retorna uma string com espaços iniciais e finais removidos"
```

Profissional bom não depende só de memória.

Profissional bom consulta fonte confiável.

---

## Documentação não é tutorial

Tutorial geralmente ensina passo a passo.

Documentação oficial descreve contrato.

Ela pode ser mais seca.

Ela pode parecer difícil no início.

Mas tem uma vantagem:

```text
é mais próxima da verdade técnica da API.
```

Tutorial pode simplificar.

Post de blog pode estar desatualizado.

Resposta de fórum pode resolver um caso, mas não explicar o contrato.

Documentação oficial é onde você confirma.

Regra:

```text
tutorial ajuda a começar;
documentação ajuda a decidir corretamente.
```

---

## Vocabulário essencial

Termos desta aula:

```text
JavaDoc;
API;
classe;
interface;
record;
enum;
método;
construtor;
assinatura;
parâmetro;
retorno;
throws;
exceção;
contrato;
descrição;
Since;
Deprecated;
See Also;
method summary;
constructor summary;
field summary;
static method;
instance method;
overload;
nullable;
imutabilidade;
efeito colateral;
exemplo mínimo;
teste manual;
fonte primária.
```

Termos mais importantes:

```text
assinatura -> nome do método, parâmetros e tipo de retorno;
parâmetro -> valor recebido pelo método;
retorno -> valor devolvido pelo método;
throws -> exceções que o método pode lançar;
deprecated -> recurso desencorajado ou obsoleto;
since -> versão em que o recurso apareceu;
static -> método chamado pela classe;
instance -> método chamado por objeto;
contrato -> comportamento prometido pela API.
```

---

## Como ler uma página JavaDoc

Uma página de JavaDoc geralmente tem blocos como:

```text
nome da classe;
pacote;
hierarquia;
descrição geral;
interfaces implementadas;
construtores;
métodos;
campos;
detalhes dos métodos;
parâmetros;
retorno;
exceções;
since;
see also.
```

A leitura recomendada:

```text
1. Leia o nome completo da classe.
2. Leia o pacote.
3. Leia a descrição geral.
4. Veja se é classe, interface, enum ou record.
5. Veja construtores.
6. Veja method summary.
7. Abra o detalhe do método.
8. Leia assinatura.
9. Leia parâmetros.
10. Leia retorno.
11. Leia exceções.
12. Teste em código mínimo.
```

Não leia documentação como romance.

Leia como mapa técnico.

---

## Assinatura de método

Assinatura mostra como chamar o método.

Exemplo:

```java
public String substring(int beginIndex, int endIndex)
```

Interpretação:

```text
public -> acessível publicamente;
String -> retorna uma String;
substring -> nome do método;
int beginIndex -> primeiro parâmetro;
int endIndex -> segundo parâmetro.
```

Perguntas que você deve fazer:

```text
esse método é estático ou de instância?
qual tipo ele retorna?
quais parâmetros recebe?
parâmetro começa em zero?
inclui ou exclui o índice final?
pode lançar exceção?
altera o objeto original?
```

---

## Parâmetros

Parâmetros são entradas do método.

Exemplo:

```java
String substring(int beginIndex, int endIndex)
```

Parâmetros:

```text
beginIndex;
endIndex.
```

A documentação explica o que cada um significa.

Não basta saber que ambos são `int`.

Você precisa saber:

```text
beginIndex é inclusivo?
endIndex é exclusivo?
qual faixa válida?
o que acontece se passar índice negativo?
o que acontece se endIndex for menor que beginIndex?
```

Essa leitura evita erro.

---

## Retorno

Retorno é o valor devolvido pelo método.

Exemplo:

```java
boolean isBlank()
```

Retorna:

```text
boolean
```

Mas a documentação responde:

```text
quando retorna true?
quando retorna false?
considera espaços?
considera string vazia?
considera caracteres Unicode de espaço?
```

Tipo de retorno sozinho não basta.

Contrato de retorno importa.

---

## Exceções

Na documentação, métodos podem informar exceções.

Exemplo conceitual:

```text
Throws:
IndexOutOfBoundsException
```

Isso significa que o método pode lançar essa exceção em determinada condição.

Você precisa ler:

```text
qual exceção?
quando acontece?
é checked ou unchecked?
preciso tratar?
devo validar antes?
```

Exemplo prático:

```java
"Java".substring(10);
```

Isso lança erro porque o índice é inválido.

A documentação ajuda a prever isso.

---

## Deprecated

Quando algo aparece como:

```text
Deprecated
```

significa que o recurso está desencorajado, obsoleto ou não recomendado para novo uso.

Não significa necessariamente que foi removido.

Mas significa:

```text
evite usar em código novo;
procure alternativa indicada;
entenda motivo.
```

Em projeto profissional, usar API deprecated sem justificativa é sinal de alerta.

---

## Since

`Since` indica a versão em que algo foi introduzido.

Isso ajuda quando você trabalha com versões diferentes de Java.

Exemplo:

```text
se um método existe desde Java 11, não funciona em Java 8.
```

Como a formação usa Java moderno, você verá recursos recentes.

Mas em empresa, pode encontrar projetos em versões antigas.

Ler `Since` ajuda a evitar incompatibilidade.

---

## Static versus instance

Método estático é chamado pela classe.

Exemplo:

```java
Integer.parseInt("10");
```

Método de instância é chamado por um objeto.

Exemplo:

```java
"Java".toUpperCase();
```

Na documentação, observe se o método é `static`.

Se for:

```text
chame pela classe.
```

Se não for:

```text
chame pelo objeto.
```

Erro comum:

```text
tentar chamar método de instância como se fosse estático.
```

---

## Overload

Overload significa métodos com mesmo nome e parâmetros diferentes.

Exemplo:

```java
String.valueOf(int i)
String.valueOf(boolean b)
String.valueOf(Object obj)
```

Mesmo nome:

```text
valueOf
```

Parâmetros diferentes.

Ao ler documentação, escolha a sobrecarga correta.

Não basta procurar pelo nome.

Precisa conferir os parâmetros.

---

## Exemplo 1 — lendo documentação de String.isBlank

Arquivo:

```text
StringIsBlankDoc.java
```

Código:

```java
public class StringIsBlankDoc {
    public static void main(String[] args) {
        String vazio = "";
        String espacos = "   ";
        String texto = "Java";

        System.out.println(vazio.isBlank());
        System.out.println(espacos.isBlank());
        System.out.println(texto.isBlank());
    }
}
```

Saída:

```text
true
true
false
```

O que observar na documentação:

```text
isBlank não recebe parâmetros;
retorna boolean;
retorna true se a String está vazia ou contém apenas espaços em branco;
não altera a String original.
```

Registro no diário:

```markdown
## String.isBlank

- Classe: `String`
- Método: `isBlank`
- Parâmetros: nenhum
- Retorno: `boolean`
- Quando retorna true: string vazia ou apenas espaços em branco
- Exemplo testado: "", "   ", "Java"
```

---

## Exemplo 2 — lendo documentação de String.substring

Arquivo:

```text
StringSubstringDoc.java
```

Código:

```java
public class StringSubstringDoc {
    public static void main(String[] args) {
        String texto = "Java Backend";

        String parte = texto.substring(0, 4);

        System.out.println(parte);
    }
}
```

Saída:

```text
Java
```

O que observar:

```text
beginIndex é inclusivo;
endIndex é exclusivo;
retorna nova String;
pode lançar IndexOutOfBoundsException;
não muda a String original.
```

Teste inválido:

```java
texto.substring(10, 2);
```

Explique por que falha.

---

## Exemplo 3 — lendo documentação de BigDecimal.compareTo

Arquivo:

```text
BigDecimalCompareToDoc.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalCompareToDoc {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("10.00");

        System.out.println(valor.compareTo(BigDecimal.ZERO));
        System.out.println(valor.compareTo(new BigDecimal("10.0")));
        System.out.println(valor.compareTo(new BigDecimal("20.00")));
    }
}
```

Saída:

```text
1
0
-1
```

Interpretação:

```text
1 -> valor maior;
0 -> valores numericamente iguais;
-1 -> valor menor.
```

O que observar na documentação:

```text
compareTo compara numericamente;
retorna inteiro negativo, zero ou inteiro positivo;
não é a mesma coisa que equals;
é muito usado para comparar BigDecimal.
```

---

## Exemplo 4 — compareTo versus equals

Arquivo:

```text
BigDecimalEqualsCompareTo.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalEqualsCompareTo {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("10.0");
        BigDecimal b = new BigDecimal("10.00");

        System.out.println(a.equals(b));
        System.out.println(a.compareTo(b) == 0);
    }
}
```

Saída:

```text
false
true
```

Leitura crítica:

```text
equals considera escala;
compareTo compara valor numérico;
para regra de valor monetário, compareTo costuma ser mais apropriado.
```

Esse tipo de detalhe vem da documentação.

Não é chute.

---

## Exemplo 5 — lendo documentação de LocalDate.parse

Arquivo:

```text
LocalDateParseDoc.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class LocalDateParseDoc {
    public static void main(String[] args) {
        try {
            LocalDate data = LocalDate.parse("2026-07-07");

            System.out.println(data);
        } catch (DateTimeParseException erro) {
            System.out.println("Data inválida: " + erro.getMessage());
        }
    }
}
```

O que observar:

```text
parse é método estático;
recebe texto;
retorna LocalDate;
espera formato ISO por padrão;
pode lançar DateTimeParseException.
```

Assinatura conceitual:

```java
public static LocalDate parse(CharSequence text)
```

Leitura:

```text
static -> chama LocalDate.parse;
CharSequence -> String é aceita;
retorno -> LocalDate;
exceção -> DateTimeParseException.
```

---

## Exemplo 6 — lendo documentação de Scanner.nextLine

Arquivo:

```text
ScannerNextLineDoc.java
```

Código:

```java
import java.util.Scanner;

public class ScannerNextLineDoc {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite uma linha: ");
        String linha = scanner.nextLine();

        System.out.println("Linha lida: " + linha);
    }
}
```

O que observar:

```text
nextLine lê até o fim da linha;
retorna String;
pode se comportar diferente quando misturada com nextInt;
depende da entrada disponível.
```

A aula anterior usou esse conhecimento para criar console robusto.

---

## Exemplo 7 — lendo documentação de Integer.parseInt

Arquivo:

```text
IntegerParseIntDoc.java
```

Código:

```java
public class IntegerParseIntDoc {
    public static void main(String[] args) {
        String texto = "123";

        int numero = Integer.parseInt(texto);

        System.out.println(numero);
    }
}
```

O que observar:

```text
parseInt é static;
recebe String;
retorna int;
lança NumberFormatException quando o texto não representa inteiro válido.
```

Teste inválido:

```java
Integer.parseInt("abc");
```

Isso conecta documentação com exceptions.

---

## Exemplo 8 — lendo documentação de Math.max

Arquivo:

```text
MathMaxDoc.java
```

Código:

```java
public class MathMaxDoc {
    public static void main(String[] args) {
        int maior = Math.max(10, 20);

        System.out.println(maior);
    }
}
```

O que observar:

```text
Math.max é static;
existem sobrecargas para int, long, float e double;
retorna o maior dos dois valores;
não precisa criar objeto Math.
```

Esse exemplo ajuda a treinar overload.

---

## Exemplo 9 — lendo documentação de StringBuilder.append

Arquivo:

```text
StringBuilderAppendDoc.java
```

Código:

```java
public class StringBuilderAppendDoc {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Java");
        builder.append(" ");
        builder.append("Backend");

        System.out.println(builder.toString());
    }
}
```

O que observar:

```text
append é método de instância;
altera o próprio StringBuilder;
retorna o próprio StringBuilder;
existem várias sobrecargas;
é diferente de String imutável.
```

Aqui a documentação ajuda a perceber efeito colateral.

---

## Exemplo 10 — documentação e construtores

Arquivo:

```text
ConstrutorBigDecimalDoc.java
```

Código:

```java
import java.math.BigDecimal;

public class ConstrutorBigDecimalDoc {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("10.50");
        BigDecimal b = BigDecimal.valueOf(10.50);

        System.out.println(a);
        System.out.println(b);
    }
}
```

O que observar:

```text
classes têm construtores;
métodos estáticos podem criar instâncias;
BigDecimal tem cuidados com double;
documentação explica alternativas e riscos.
```

Regra prática já usada no curso:

```text
para valor decimal exato, prefira String ou valueOf com critério.
```

---

## Como transformar documentação em teste mínimo

Sempre que ler um método, crie um teste manual pequeno.

Modelo:

```text
1. Escolha um método.
2. Leia assinatura.
3. Anote parâmetros.
4. Anote retorno.
5. Anote exceções.
6. Crie arquivo pequeno.
7. Teste caso normal.
8. Teste caso limite.
9. Teste caso inválido.
10. Registre conclusão.
```

Exemplo com `substring`:

```text
normal -> substring(0, 4)
limite -> substring(0, texto.length())
inválido -> substring(10, 2)
```

Isso transforma leitura em prática.

---

## Mapa de leitura de método

Use este modelo no diário:

```markdown
## Método estudado

- Classe:
- Pacote:
- Método:
- É static?
- É de instância?
- Assinatura:
- Parâmetros:
- Retorno:
- Exceções:
- Altera o objeto?
- Retorna novo objeto?
- Possui overload?
- Desde qual versão, se relevante?
- Está deprecated?
- Exemplo normal:
- Exemplo inválido:
- Conclusão:
```

Esse mapa obriga a leitura completa.

---

## Aplicação em cliente

Arquivo:

```text
ClienteDocAplicado.java
```

Código:

```java
public class ClienteDocAplicado {
    public static void main(String[] args) {
        String nomeDigitado = "   Ana Silva   ";
        String emailDigitado = "ANA@EMAIL.COM";

        String nome = nomeDigitado.trim();
        String email = emailDigitado.toLowerCase();

        Cliente cliente = new Cliente(nome, email);

        System.out.println(cliente);
    }
}

record Cliente(String nome, String email) {
}
```

Métodos para consultar na documentação:

```text
String.trim;
String.toLowerCase;
record gerado automaticamente;
String.isBlank.
```

Perguntas:

```text
trim altera a String original?
toLowerCase depende de Locale?
quando isBlank retorna true?
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoDocAplicado.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoDocAplicado {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("199.995");

        BigDecimal precoFinal = preco.setScale(2, RoundingMode.HALF_UP);

        Produto produto = new Produto("Cadeira", precoFinal);

        System.out.println(produto);
    }
}

record Produto(String nome, BigDecimal preco) {
}
```

Métodos/classes para consultar:

```text
BigDecimal.setScale;
RoundingMode;
BigDecimal constructor;
BigDecimal.compareTo.
```

Perguntas:

```text
setScale altera o objeto original?
qual retorno?
quando precisa de RoundingMode?
qual exceção pode ocorrer se arredondamento for necessário e não for informado?
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoDocAplicado.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoDocAplicado {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("50.00");
        int quantidade = 3;

        BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

        Pedido pedido = new Pedido("PED-001", total);

        System.out.println(pedido);
    }
}

record Pedido(String codigo, BigDecimal total) {
}
```

Métodos para consultar:

```text
BigDecimal.multiply;
BigDecimal.valueOf;
BigDecimal.toString.
```

Perguntas:

```text
multiply retorna novo BigDecimal?
valueOf é static?
qual tipo valueOf recebe?
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoDocAplicado.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoDocAplicado {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("100.00");

        if (valor.compareTo(BigDecimal.ZERO) > 0) {
            Pagamento pagamento = new Pagamento("PAG-001", valor);

            System.out.println(pagamento);
        }
    }
}

record Pagamento(String codigo, BigDecimal valor) {
}
```

Documentação aplicada:

```text
BigDecimal.ZERO;
BigDecimal.compareTo;
record;
String.
```

Pergunta principal:

```text
por que compareTo é melhor que > para BigDecimal?
```

Resposta:

```text
BigDecimal é objeto, não primitivo;
operadores como > não se aplicam diretamente;
compareTo define comparação numérica.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoDocAplicado.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoDocAplicado {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.now();
        LocalDate agendamento = hoje.plusDays(2);

        OrdemServico os = new OrdemServico("OS-001", agendamento);

        System.out.println(os);
    }
}

record OrdemServico(String certificado, LocalDate dataAgendamento) {
}
```

Métodos para consultar:

```text
LocalDate.now;
LocalDate.plusDays;
LocalDate.toString.
```

Perguntas:

```text
now é static?
plusDays altera a data original?
qual retorno de plusDays?
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaDocAplicado.java
```

Código:

```java
public class MensageriaDocAplicado {
    public static void main(String[] args) {
        String template = """
                Olá, %s.
                Sua OS %s está em acompanhamento.
                """;

        String mensagem = template.formatted("Ana", "OS-001");

        System.out.println(mensagem);
    }
}
```

Métodos para consultar:

```text
String.formatted;
text blocks;
String.format conceitualmente.
```

Perguntas:

```text
formatted recebe quais argumentos?
retorna nova String?
qual exceção pode ocorrer se o formato for inválido?
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaDocAplicado.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaDocAplicado {
    public static void main(String[] args) {
        Instant criadoEm = Instant.now();

        RegistroAuditoria registro = new RegistroAuditoria(
                "aline",
                "CRIACAO",
                "Produto",
                10L,
                criadoEm
        );

        System.out.println(registro);
    }
}

record RegistroAuditoria(String usuario, String operacao, String entidade, Long entidadeId, Instant criadoEm) {
}
```

Métodos/classes para consultar:

```text
Instant.now;
record;
Long;
String.
```

Perguntas:

```text
Instant.now é static?
Instant representa data local ou instante na linha do tempo?
record gera toString?
record gera equals?
record gera accessors?
```

---

## Refatoração: de chute para documentação

Antes:

```java
// Acho que isso remove espaços.
String nome = entrada.trim();
```

Depois:

```java
// Lido na documentação: trim retorna uma String com espaços iniciais e finais removidos.
String nome = entrada.trim();
```

Mais profissional ainda:

```java
String nome = entrada.trim();
```

e no diário:

```markdown
`String.trim()` retorna uma nova String sem espaços iniciais e finais. A String original permanece imutável.
```

O código não precisa comentar o óbvio.

Mas o estudo precisa registrar entendimento.

---

## Refatoração: exceção desconhecida para contrato conhecido

Antes:

```java
try {
    Integer.parseInt(valor);
} catch (Exception erro) {
    System.out.println("Erro.");
}
```

Depois de ler documentação:

```java
try {
    Integer.parseInt(valor);
} catch (NumberFormatException erro) {
    System.out.println("Digite um número inteiro válido.");
}
```

Ganho:

```text
exceção específica;
mensagem clara;
leitura baseada no contrato do método.
```

---

## Refatoração: uso errado de equals em BigDecimal

Antes:

```java
if (valor.equals(BigDecimal.ZERO)) {
}
```

Depois de leitura crítica:

```java
if (valor.compareTo(BigDecimal.ZERO) == 0) {
}
```

Depende da regra.

Se a regra é valor numérico, `compareTo`.

Se a regra realmente precisa considerar escala, `equals`.

A documentação ajuda a decidir.

---

## Como usar documentação dentro do IntelliJ

O IntelliJ pode mostrar documentação rápida.

Dependendo do sistema e keymap, a ação pode se chamar:

```text
Quick Documentation
```

Você pode acessar pelo menu ou procurar com:

```text
Find Action
```

Procure por:

```text
Quick Documentation
```

Também é possível navegar até a declaração da classe/método.

O objetivo não é decorar atalho.

O objetivo é saber que a IDE consegue ajudar a consultar a documentação sem sair do código.

---

## Quando sair da IDE e abrir documentação externa

Use documentação externa quando:

```text
quer ver a classe completa;
quer comparar versões;
quer ler detalhes de todos os overloads;
quer confirmar since/deprecated;
quer ler descrição longa;
quer investigar comportamento de API.
```

Use a documentação correspondente à versão do JDK do projeto.

Se o projeto usa Java 21, leia documentação da API dessa versão.

Se usa Java 17, leia documentação da API dessa versão.

Não misture versão sem perceber.

---

## Erros comuns

### Erro 1 — Ler só exemplo e ignorar assinatura

Exemplo ajuda, mas assinatura é contrato.

---

### Erro 2 — Ignorar retorno

Muita gente chama método e não usa retorno.

Exemplo:

```java
nome.trim();
```

Se não atribuir:

```java
nome = nome.trim();
```

a variável continua igual.

---

### Erro 3 — Ignorar exceções

Se o método informa que pode lançar exceção, leia quando.

---

### Erro 4 — Confundir método static com método de instância

```java
LocalDate.parse("2026-07-07")
```

é static.

```java
data.plusDays(1)
```

é de instância.

---

### Erro 5 — Escolher overload errado

Mesmo nome pode ter vários métodos.

Confira parâmetros.

---

### Erro 6 — Ignorar Deprecated

Não use recurso deprecated sem motivo.

---

### Erro 7 — Ignorar versão

Método pode não existir na versão do Java do projeto.

---

### Erro 8 — Ler documentação como tradução literal sem testar

Leia e teste.

---

### Erro 9 — Copiar código sem entender contrato

Copiar não é aprender.

---

### Erro 10 — Não registrar conclusão

Sem registro, você esquece o que aprendeu.

---

## Diagnóstico de leitura de documentação

Quando for ler um método, pergunte:

### 1. Em que classe ele está?

Exemplo:

```text
String;
BigDecimal;
LocalDate;
Scanner.
```

### 2. Qual é o pacote?

Exemplo:

```text
java.lang;
java.math;
java.time;
java.util.
```

### 3. É static?

Se for, chama pela classe.

### 4. É de instância?

Se for, chama pelo objeto.

### 5. Quais parâmetros recebe?

Leia tipo e significado.

### 6. O que retorna?

Leia tipo e contrato.

### 7. Pode lançar exceção?

Leia `throws`.

### 8. Altera o objeto?

Importante para classes mutáveis e imutáveis.

### 9. Tem overload?

Escolha a versão correta.

### 10. Está deprecated?

Evite em código novo.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.math.BigDecimal;
import java.time.LocalDate;

public class DebugDocumentacao {
    public static void main(String[] args) {
        String texto = "   Java   ";
        String limpo = texto.trim();

        BigDecimal valor = new BigDecimal("10.00");
        int comparacao = valor.compareTo(BigDecimal.ZERO);

        LocalDate data = LocalDate.parse("2026-07-07");
        LocalDate proxima = data.plusDays(1);

        System.out.println(limpo);
        System.out.println(comparacao);
        System.out.println(proxima);
    }
}
```

Coloque breakpoints nas linhas:

```java
String limpo = texto.trim();
int comparacao = valor.compareTo(BigDecimal.ZERO);
LocalDate proxima = data.plusDays(1);
```

Observe:

```text
texto original;
retorno de trim;
retorno de compareTo;
data original;
data retornada por plusDays.
```

Isso conecta documentação, código e runtime.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — ignorar retorno de trim

```java
String nome = "   Ana   ";
nome.trim();

System.out.println("[" + nome + "]");
```

Explique por que ainda há espaços.

---

### Teste 2 — substring inválido

```java
"Java".substring(10);
```

Leia a documentação e explique a exceção.

---

### Teste 3 — parse inválido

```java
Integer.parseInt("abc");
```

Leia a documentação e explique `NumberFormatException`.

---

### Teste 4 — compareTo e equals

Compare:

```java
new BigDecimal("10.0")
new BigDecimal("10.00")
```

com `equals` e `compareTo`.

Explique a diferença.

---

### Teste 5 — plusDays sem atribuir

```java
LocalDate data = LocalDate.parse("2026-07-07");
data.plusDays(1);

System.out.println(data);
```

Explique por que a data original não mudou.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-088-leitura-documentacao-oficial
cd labs\m2\aula-088-leitura-documentacao-oficial
```

Crie arquivos:

```text
StringIsBlankDoc.java
StringSubstringDoc.java
BigDecimalCompareToDoc.java
BigDecimalEqualsCompareTo.java
LocalDateParseDoc.java
ScannerNextLineDoc.java
IntegerParseIntDoc.java
MathMaxDoc.java
StringBuilderAppendDoc.java
ConstrutorBigDecimalDoc.java
ClienteDocAplicado.java
ProdutoDocAplicado.java
PedidoDocAplicado.java
PagamentoDocAplicado.java
OrdemServicoDocAplicado.java
MensageriaDocAplicado.java
AuditoriaDocAplicado.java
DebugDocumentacao.java
ErroIgnorarRetorno.java
ErroSubstringInvalido.java
ErroParseInvalido.java
ErroBigDecimalEquals.java
ErroPlusDaysSemAtribuir.java
README.md
```

Compile exemplos válidos:

```powershell
javac StringIsBlankDoc.java
javac StringSubstringDoc.java
javac BigDecimalCompareToDoc.java
javac BigDecimalEqualsCompareTo.java
javac LocalDateParseDoc.java
javac ScannerNextLineDoc.java
javac IntegerParseIntDoc.java
javac MathMaxDoc.java
javac StringBuilderAppendDoc.java
javac ConstrutorBigDecimalDoc.java
javac ClienteDocAplicado.java
javac ProdutoDocAplicado.java
javac PedidoDocAplicado.java
javac PagamentoDocAplicado.java
javac OrdemServicoDocAplicado.java
javac MensageriaDocAplicado.java
javac AuditoriaDocAplicado.java
javac DebugDocumentacao.java
```

Execute exemplos:

```powershell
java StringIsBlankDoc
java StringSubstringDoc
java BigDecimalCompareToDoc
java BigDecimalEqualsCompareTo
java LocalDateParseDoc
java IntegerParseIntDoc
java MathMaxDoc
java StringBuilderAppendDoc
java ConstrutorBigDecimalDoc
java ClienteDocAplicado
java ProdutoDocAplicado
java PedidoDocAplicado
java PagamentoDocAplicado
java OrdemServicoDocAplicado
java MensageriaDocAplicado
java AuditoriaDocAplicado
java DebugDocumentacao
```

Arquivos de erro ou leitura crítica:

```text
ErroIgnorarRetorno.java
ErroSubstringInvalido.java
ErroParseInvalido.java
ErroBigDecimalEquals.java
ErroPlusDaysSemAtribuir.java
```

Use a documentação oficial para explicar cada um.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 088 — Leitura de documentação oficial

## Objetivo

Aprender a ler documentação oficial Java, especialmente JavaDoc, assinatura de métodos, parâmetros, retorno, exceções, overloads, métodos static, métodos de instância, deprecated e exemplos mínimos.

## Conceitos

- JavaDoc é documentação da API Java.
- Documentação oficial é fonte primária.
- Assinatura mostra tipo de retorno, nome e parâmetros.
- Parâmetros precisam ser lidos pelo tipo e pelo significado.
- Retorno precisa ser usado quando o método devolve novo valor.
- `throws` mostra exceções possíveis.
- `static` indica chamada pela classe.
- Método de instância exige objeto.
- Overload exige escolher a versão correta.
- Deprecated deve ser evitado em código novo.
- Since ajuda a entender compatibilidade de versão.
- Documentação deve ser testada em código mínimo.

## Métodos estudados

- `String.isBlank`
- `String.substring`
- `String.trim`
- `BigDecimal.compareTo`
- `BigDecimal.equals`
- `BigDecimal.setScale`
- `LocalDate.parse`
- `LocalDate.plusDays`
- `Integer.parseInt`
- `Math.max`
- `StringBuilder.append`
- `String.formatted`

## Comandos

```powershell
javac StringIsBlankDoc.java
java StringIsBlankDoc
javac BigDecimalCompareToDoc.java
java BigDecimalCompareToDoc
javac DebugDocumentacao.java
java DebugDocumentacao
```

## Observações

- Não copiar método sem entender contrato.
- Não ignorar retorno.
- Não ignorar exceções.
- Não confundir static com instância.
- Não escolher overload só pelo nome.
- Registrar conclusões no diário.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Quick Documentation | ação da IDE | Ver JavaDoc do símbolo |
| Find Action | `Ctrl + Shift + A` | Procurar documentação rápida |
| Go to Declaration | ação da IDE | Navegar para classe/método |
| Project | `Alt + 1` | Navegar arquivos |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Observar retornos |
| Step Over | `F8` em muitos keymaps | Avançar métodos |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar chamadas |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 088 — Leitura de documentação oficial

### O que aprendi
Aprendi que documentação oficial é fonte primária para entender contrato de classes e métodos. Aprendi a ler assinatura, parâmetros, retorno, exceções, métodos static, métodos de instância, overloads, deprecated e since.

### O que pratiquei
Consultei documentação de `String`, `BigDecimal`, `LocalDate`, `Scanner`, `Integer`, `Math` e `StringBuilder`. Criei exemplos mínimos para validar comportamento normal, limite e inválido.

### Conceitos principais
- JavaDoc
- API
- assinatura
- parâmetro
- retorno
- throws
- exception
- static
- instance method
- overload
- deprecated
- since
- contrato
- imutabilidade
- efeito colateral
- documentação oficial
- teste mínimo

### Arquivos criados
- `labs/m2/aula-088-leitura-documentacao-oficial/StringIsBlankDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/StringSubstringDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/BigDecimalCompareToDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/BigDecimalEqualsCompareTo.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/LocalDateParseDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ScannerNextLineDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/IntegerParseIntDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/MathMaxDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/StringBuilderAppendDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ConstrutorBigDecimalDoc.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ClienteDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ProdutoDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/PedidoDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/PagamentoDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/OrdemServicoDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/MensageriaDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/AuditoriaDocAplicado.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/DebugDocumentacao.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ErroIgnorarRetorno.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ErroSubstringInvalido.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ErroParseInvalido.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ErroBigDecimalEquals.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/ErroPlusDaysSemAtribuir.java`
- `labs/m2/aula-088-leitura-documentacao-oficial/README.md`

### Comandos usados
```powershell
javac StringIsBlankDoc.java
java StringIsBlankDoc
javac BigDecimalCompareToDoc.java
java BigDecimalCompareToDoc
javac LocalDateParseDoc.java
java LocalDateParseDoc
javac DebugDocumentacao.java
java DebugDocumentacao
```

### Erros que quero evitar
- ler só exemplo e ignorar assinatura;
- ignorar retorno;
- ignorar exceções;
- confundir método static com método de instância;
- escolher overload errado;
- ignorar deprecated;
- ignorar versão;
- não testar o que leu;
- copiar código sem entender contrato;
- não registrar conclusão.

### Próximo passo
Fazer o mini projeto biblioteca Java Core.
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
git add labs/m2/aula-088-leitura-documentacao-oficial docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 088: pratica leitura de documentacao oficial Java"
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
1. O que é documentação oficial?
2. O que é JavaDoc?
3. Por que documentação oficial é fonte primária?
4. Qual a diferença entre documentação e tutorial?
5. O que é assinatura de método?
6. O que são parâmetros?
7. O que é retorno?
8. O que significa throws?
9. O que significa Deprecated?
10. O que significa Since?
11. Qual a diferença entre método static e método de instância?
12. O que é overload?
13. Por que não basta olhar o nome do método?
14. Por que não devemos ignorar retorno?
15. Como saber se um método pode lançar exceção?
16. Como testar comportamento lido na documentação?
17. Qual diferença entre BigDecimal.equals e compareTo?
18. Por que LocalDate.plusDays não altera a data original?
19. Como registrar leitura de documentação no diário?
20. Como a documentação ajuda a tomar decisão técnica?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar documentação oficial;
explicar JavaDoc;
diferenciar documentação e tutorial;
ler assinatura de método;
identificar parâmetros;
identificar retorno;
identificar exceções;
identificar método static;
identificar método de instância;
identificar overload;
explicar deprecated;
explicar since;
consultar documentação de String;
consultar documentação de BigDecimal;
consultar documentação de LocalDate;
consultar documentação de Scanner;
consultar documentação de Integer;
consultar documentação de Math;
consultar documentação de StringBuilder;
criar teste mínimo a partir da documentação;
explicar comportamento normal;
explicar comportamento inválido;
refatorar código com base no contrato lido;
registrar leitura no diário;
fazer commit limpo.
```

Não precisa ainda dominar toda a documentação Java.

Não precisa ainda decorar todos os métodos.

Não precisa ainda ler documentação de frameworks grandes.

Não precisa ainda dominar Java Language Specification.

Não precisa ainda dominar documentação de Spring.

Esses assuntos virão depois.

O objetivo é criar o hábito profissional:

```text
quando tiver dúvida séria, consultar a fonte primária, interpretar e testar.
```

---

## Fechamento da aula

Hoje estudamos leitura de documentação oficial.

A ideia central foi:

```text
desenvolvedor forte não memoriza tudo; ele sabe consultar, interpretar e validar.
```

Vimos que:

```text
JavaDoc mostra classes, métodos, parâmetros, retorno e exceções;
assinatura de método precisa ser lida com atenção;
retorno não pode ser ignorado;
exceções fazem parte do contrato;
métodos static e de instância são chamados de formas diferentes;
overload exige escolher a versão correta;
deprecated deve acender alerta;
since ajuda com compatibilidade;
documentação precisa virar teste mínimo;
diário registra conclusões.
```

O ponto mais importante é:

```text
documentação oficial não é enfeite; é ferramenta de decisão técnica.
```

Na próxima aula, vamos estudar:

```text
Mini projeto biblioteca Java Core.
```

A próxima aula vai consolidar String, datas, BigDecimal, enum, records, pacotes, console e testes manuais em uma pequena biblioteca utilitária.
