# 089 — M2.28 — Mini projeto biblioteca Java Core

## A pergunta central da aula

Depois de muitas aulas de conceitos, surge uma pergunta prática:

```text
como transformar pequenos conhecimentos de Java Core em código reutilizável, organizado e validado?
```

Exemplo:

```text
normalizar texto;
validar campo obrigatório;
extrair dígitos;
converter valor monetário;
arredondar BigDecimal;
validar valor positivo;
parsear data;
formatar data;
calcular diferença em dias;
representar resultado de validação;
testar manualmente.
```

Se tudo isso fica espalhado no `main`, vira bagunça.

Se organizamos em pacotes, classes pequenas, métodos claros e testes manuais, vira base de projeto.

Essa aula existe para fazer essa virada.

---

## O que é a biblioteca Java Core deste mini projeto

A biblioteca será uma coleção pequena de classes utilitárias, usando apenas Java puro.

Ela terá:

```text
TextoUtils;
DinheiroUtils;
DataUtils;
ResultadoValidacao;
TipoNormalizacao;
AssertManual;
TesteBibliotecaJavaCore;
Main.
```

O objetivo é praticar:

```text
String;
BigDecimal;
LocalDate;
DateTimeFormatter;
ChronoUnit;
enum;
record;
métodos estáticos;
classes utilitárias;
construtor privado;
packages;
imports;
exceptions;
testes manuais;
README;
commit.
```

Não usaremos:

```text
Maven;
JUnit;
Spring;
banco;
API;
biblioteca externa.
```

Isso vem depois.

Aqui é Java Core puro.

---

## Estrutura final do mini projeto

A estrutura será:

```text
labs/m2/aula-089-mini-projeto-biblioteca-java-core
├── README.md
└── src
    └── br
        └── com
            └── formacao
                ├── app
                │   └── Main.java
                ├── core
                │   ├── DataUtils.java
                │   ├── DinheiroUtils.java
                │   ├── ResultadoValidacao.java
                │   ├── TextoUtils.java
                │   └── TipoNormalizacao.java
                └── teste
                    ├── AssertManual.java
                    └── TesteBibliotecaJavaCore.java
```

Pacotes:

```text
br.com.formacao.app
br.com.formacao.core
br.com.formacao.teste
```

Decisão:

```text
core -> biblioteca Java Core;
app -> exemplo de uso;
teste -> testes manuais.
```

---

## Por que não usar default package

Como aprendemos na aula anterior, default package não é bom para projeto real.

Neste mini projeto, todas as classes terão package.

Exemplo:

```java
package br.com.formacao.core;
```

Isso força organização desde cedo.

---

## Por que usar classes utilitárias

Uma classe utilitária agrupa métodos de apoio.

Exemplo:

```java
TextoUtils.normalizarEspacos("  Ana   Silva  ")
```

Esse tipo de método não precisa guardar estado.

Por isso, pode ser estático.

Classe utilitária típica:

```java
public final class TextoUtils {
    private TextoUtils() {
    }

    public static String normalizarEspacos(String valor) {
        // ...
    }
}
```

Repare:

```text
final -> evita herança sem necessidade;
construtor privado -> evita instanciar;
métodos static -> uso direto pela classe.
```

---

## Cuidado com utilitários

Utilitário é útil, mas pode virar lixeira.

O objetivo não é criar uma classe `Utils` com tudo.

Ruim:

```text
Utils.java
Funcoes.java
Coisas.java
Geral.java
Ajuda.java
```

Melhor:

```text
TextoUtils;
DinheiroUtils;
DataUtils.
```

Cada uma tem um foco.

---

## Por que usar record

`record` será usado para representar retorno de validação.

Exemplo:

```java
public record ResultadoValidacao(boolean valido, String mensagem) {
}
```

Esse record é ideal porque:

```text
carrega dados;
é imutável;
tem toString, equals e hashCode gerados;
tem accessors automáticos;
é pequeno e expressivo.
```

Usaremos métodos estáticos para facilitar criação:

```java
ResultadoValidacao.sucesso()
ResultadoValidacao.erro("Mensagem")
```

---

## Por que usar enum

`enum` será usado para representar opções fixas de normalização de texto:

```text
MAIUSCULA;
MINUSCULA;
ORIGINAL.
```

Isso é melhor do que passar strings soltas como:

```text
"maiuscula";
"minuscula";
"original".
```

Com enum, o compilador ajuda.

---

## Por que usar testes manuais

Ainda não chegamos em JUnit.

Mas isso não significa que vamos testar no olho sem critério.

Testes manuais deste mini projeto serão métodos que fazem verificações com `if` e lançam erro se algo estiver errado.

Exemplo:

```java
AssertManual.iguais("Ana", resultado, "deve normalizar nome");
```

Se falhar, o programa lança exception.

Se passar, imprime mensagem de sucesso.

Isso ensina a mentalidade de teste antes de introduzir framework.

---

## Criando a estrutura

No terminal:

```powershell
mkdir labs\m2\aula-089-mini-projeto-biblioteca-java-core
cd labs\m2\aula-089-mini-projeto-biblioteca-java-core

mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\formacao
mkdir src\br\com\formacao\app
mkdir src\br\com\formacao\core
mkdir src\br\com\formacao\teste
```

Crie os arquivos:

```text
src/br/com/formacao/core/ResultadoValidacao.java
src/br/com/formacao/core/TipoNormalizacao.java
src/br/com/formacao/core/TextoUtils.java
src/br/com/formacao/core/DinheiroUtils.java
src/br/com/formacao/core/DataUtils.java
src/br/com/formacao/teste/AssertManual.java
src/br/com/formacao/teste/TesteBibliotecaJavaCore.java
src/br/com/formacao/app/Main.java
README.md
```

---

## Classe 1 — ResultadoValidacao

Arquivo:

```text
src/br/com/formacao/core/ResultadoValidacao.java
```

Código:

```java
package br.com.formacao.core;

public record ResultadoValidacao(boolean valido, String mensagem) {
    public static ResultadoValidacao sucesso() {
        return new ResultadoValidacao(true, "OK");
    }

    public static ResultadoValidacao erro(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            return new ResultadoValidacao(false, "Erro de validação.");
        }

        return new ResultadoValidacao(false, mensagem.trim());
    }
}
```

O que praticamos:

```text
record;
métodos estáticos;
String.isBlank;
trim;
validação defensiva;
retorno expressivo.
```

---

## Classe 2 — TipoNormalizacao

Arquivo:

```text
src/br/com/formacao/core/TipoNormalizacao.java
```

Código:

```java
package br.com.formacao.core;

public enum TipoNormalizacao {
    ORIGINAL,
    MAIUSCULA,
    MINUSCULA
}
```

O que praticamos:

```text
enum;
valores fixos;
remoção de strings mágicas.
```

---

## Classe 3 — TextoUtils

Arquivo:

```text
src/br/com/formacao/core/TextoUtils.java
```

Código:

```java
package br.com.formacao.core;

public final class TextoUtils {
    private TextoUtils() {
    }

    public static String normalizarEspacos(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().replaceAll("\\s+", " ");
    }

    public static String somenteDigitos(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.replaceAll("\\D", "");
    }

    public static String limitar(String valor, int tamanhoMaximo) {
        if (tamanhoMaximo < 0) {
            throw new IllegalArgumentException("Tamanho máximo não pode ser negativo.");
        }

        String normalizado = normalizarEspacos(valor);

        if (normalizado.length() <= tamanhoMaximo) {
            return normalizado;
        }

        return normalizado.substring(0, tamanhoMaximo);
    }

    public static ResultadoValidacao obrigatorio(String valor, String nomeCampo) {
        String campo = normalizarEspacos(nomeCampo);

        if (campo.isBlank()) {
            campo = "Campo";
        }

        if (valor == null || valor.isBlank()) {
            return ResultadoValidacao.erro(campo + " é obrigatório.");
        }

        return ResultadoValidacao.sucesso();
    }

    public static String aplicarCaixa(String valor, TipoNormalizacao tipo) {
        String normalizado = normalizarEspacos(valor);

        if (tipo == null || tipo == TipoNormalizacao.ORIGINAL) {
            return normalizado;
        }

        if (tipo == TipoNormalizacao.MAIUSCULA) {
            return normalizado.toUpperCase();
        }

        if (tipo == TipoNormalizacao.MINUSCULA) {
            return normalizado.toLowerCase();
        }

        return normalizado;
    }
}
```

O que praticamos:

```text
classe final;
construtor privado;
métodos static;
String.trim;
replaceAll;
regex simples;
substring;
IllegalArgumentException;
enum;
record;
retorno de validação.
```

Observação:

```text
toUpperCase e toLowerCase podem ter detalhes de Locale em sistemas reais.
```

Esse ponto será aprofundado quando necessário.

---

## Classe 4 — DinheiroUtils

Arquivo:

```text
src/br/com/formacao/core/DinheiroUtils.java
```

Código:

```java
package br.com.formacao.core;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class DinheiroUtils {
    private DinheiroUtils() {
    }

    public static BigDecimal parseValor(String texto) {
        String normalizado = TextoUtils.normalizarEspacos(texto).replace(",", ".");

        if (normalizado.isBlank()) {
            throw new IllegalArgumentException("Valor monetário é obrigatório.");
        }

        try {
            return new BigDecimal(normalizado);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Valor monetário inválido: " + texto, erro);
        }
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor monetário é obrigatório.");
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static ResultadoValidacao positivo(BigDecimal valor, String nomeCampo) {
        String campo = TextoUtils.normalizarEspacos(nomeCampo);

        if (campo.isBlank()) {
            campo = "Valor";
        }

        if (valor == null) {
            return ResultadoValidacao.erro(campo + " é obrigatório.");
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            return ResultadoValidacao.erro(campo + " deve ser maior que zero.");
        }

        return ResultadoValidacao.sucesso();
    }

    public static BigDecimal somar(BigDecimal... valores) {
        BigDecimal total = BigDecimal.ZERO;

        if (valores == null) {
            return total;
        }

        for (BigDecimal valor : valores) {
            if (valor != null) {
                total = total.add(valor);
            }
        }

        return total;
    }

    public static String formatarSimples(BigDecimal valor) {
        BigDecimal arredondado = arredondarMoeda(valor);

        return "R$ " + arredondado.toPlainString();
    }
}
```

O que praticamos:

```text
BigDecimal;
RoundingMode;
compareTo;
ZERO;
varargs;
try/catch;
cause ao relançar;
IllegalArgumentException;
toPlainString;
dependência entre utilitários.
```

---

## Classe 5 — DataUtils

Arquivo:

```text
src/br/com/formacao/core/DataUtils.java
```

Código:

```java
package br.com.formacao.core;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

public final class DataUtils {
    private static final DateTimeFormatter FORMATO_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private DataUtils() {
    }

    public static LocalDate parseIso(String texto) {
        String normalizado = TextoUtils.normalizarEspacos(texto);

        if (normalizado.isBlank()) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        try {
            return LocalDate.parse(normalizado);
        } catch (DateTimeParseException erro) {
            throw new IllegalArgumentException("Data inválida. Use o formato yyyy-MM-dd.", erro);
        }
    }

    public static String formatarBr(LocalDate data) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        return data.format(FORMATO_BR);
    }

    public static long diasEntre(LocalDate inicio, LocalDate fim) {
        if (inicio == null || fim == null) {
            throw new IllegalArgumentException("Data inicial e data final são obrigatórias.");
        }

        return ChronoUnit.DAYS.between(inicio, fim);
    }

    public static ResultadoValidacao hojeOuFuturo(LocalDate data, String nomeCampo) {
        String campo = TextoUtils.normalizarEspacos(nomeCampo);

        if (campo.isBlank()) {
            campo = "Data";
        }

        if (data == null) {
            return ResultadoValidacao.erro(campo + " é obrigatória.");
        }

        if (data.isBefore(LocalDate.now())) {
            return ResultadoValidacao.erro(campo + " não pode estar no passado.");
        }

        return ResultadoValidacao.sucesso();
    }
}
```

O que praticamos:

```text
LocalDate;
DateTimeFormatter;
DateTimeParseException;
ChronoUnit;
constante private static final;
validação;
exceptions com causa;
record de validação.
```

---

## Classe 6 — AssertManual

Arquivo:

```text
src/br/com/formacao/teste/AssertManual.java
```

Código:

```java
package br.com.formacao.teste;

import java.math.BigDecimal;
import java.util.Objects;

public final class AssertManual {
    private AssertManual() {
    }

    public static void iguais(Object esperado, Object atual, String mensagem) {
        if (!Objects.equals(esperado, atual)) {
            throw new IllegalStateException(
                    mensagem + " | esperado: " + esperado + " | atual: " + atual
            );
        }
    }

    public static void verdadeiro(boolean condicao, String mensagem) {
        if (!condicao) {
            throw new IllegalStateException(mensagem);
        }
    }

    public static void bigDecimalIgual(BigDecimal esperado, BigDecimal atual, String mensagem) {
        if (esperado == null && atual == null) {
            return;
        }

        if (esperado == null || atual == null || esperado.compareTo(atual) != 0) {
            throw new IllegalStateException(
                    mensagem + " | esperado: " + esperado + " | atual: " + atual
            );
        }
    }

    public static void erroEsperado(Runnable acao, String mensagem) {
        try {
            acao.run();
        } catch (RuntimeException erro) {
            return;
        }

        throw new IllegalStateException(mensagem);
    }
}
```

O que praticamos:

```text
Objects.equals;
BigDecimal.compareTo;
RuntimeException;
Runnable;
teste manual;
mensagem de erro útil.
```

Não é JUnit.

Mas já ensina a pensar como teste.

---

## Classe 7 — TesteBibliotecaJavaCore

Arquivo:

```text
src/br/com/formacao/teste/TesteBibliotecaJavaCore.java
```

Código:

```java
package br.com.formacao.teste;

import br.com.formacao.core.DataUtils;
import br.com.formacao.core.DinheiroUtils;
import br.com.formacao.core.ResultadoValidacao;
import br.com.formacao.core.TextoUtils;
import br.com.formacao.core.TipoNormalizacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TesteBibliotecaJavaCore {
    public static void main(String[] args) {
        testarTexto();
        testarDinheiro();
        testarDatas();
        testarValidacoes();

        System.out.println("Todos os testes manuais passaram.");
    }

    private static void testarTexto() {
        AssertManual.iguais("Ana Silva", TextoUtils.normalizarEspacos("  Ana   Silva  "), "deve normalizar espaços");
        AssertManual.iguais("12345678900", TextoUtils.somenteDigitos("123.456.789-00"), "deve manter somente dígitos");
        AssertManual.iguais("Java", TextoUtils.limitar("Java Backend", 4), "deve limitar texto");
        AssertManual.iguais("JAVA", TextoUtils.aplicarCaixa(" java ", TipoNormalizacao.MAIUSCULA), "deve aplicar maiúscula");
        AssertManual.iguais("java", TextoUtils.aplicarCaixa(" JAVA ", TipoNormalizacao.MINUSCULA), "deve aplicar minúscula");
    }

    private static void testarDinheiro() {
        BigDecimal valor = DinheiroUtils.parseValor("10,50");

        AssertManual.bigDecimalIgual(new BigDecimal("10.50"), valor, "deve converter vírgula para decimal");
        AssertManual.bigDecimalIgual(new BigDecimal("10.51"), DinheiroUtils.arredondarMoeda(new BigDecimal("10.505")), "deve arredondar moeda");
        AssertManual.bigDecimalIgual(new BigDecimal("30.00"), DinheiroUtils.somar(new BigDecimal("10.00"), new BigDecimal("20.00")), "deve somar valores");
        AssertManual.iguais("R$ 10.50", DinheiroUtils.formatarSimples(new BigDecimal("10.5")), "deve formatar simples");
    }

    private static void testarDatas() {
        LocalDate data = DataUtils.parseIso("2026-07-07");

        AssertManual.iguais(LocalDate.of(2026, 7, 7), data, "deve parsear data ISO");
        AssertManual.iguais("07/07/2026", DataUtils.formatarBr(data), "deve formatar data BR");
        AssertManual.iguais(2L, DataUtils.diasEntre(LocalDate.of(2026, 7, 7), LocalDate.of(2026, 7, 9)), "deve calcular dias entre datas");
    }

    private static void testarValidacoes() {
        ResultadoValidacao textoObrigatorio = TextoUtils.obrigatorio("Ana", "Nome");
        ResultadoValidacao textoVazio = TextoUtils.obrigatorio("   ", "Nome");
        ResultadoValidacao valorPositivo = DinheiroUtils.positivo(new BigDecimal("1.00"), "Valor");
        ResultadoValidacao valorZero = DinheiroUtils.positivo(BigDecimal.ZERO, "Valor");

        AssertManual.verdadeiro(textoObrigatorio.valido(), "texto obrigatório deveria ser válido");
        AssertManual.verdadeiro(!textoVazio.valido(), "texto vazio deveria ser inválido");
        AssertManual.verdadeiro(valorPositivo.valido(), "valor positivo deveria ser válido");
        AssertManual.verdadeiro(!valorZero.valido(), "valor zero deveria ser inválido");

        AssertManual.erroEsperado(() -> DinheiroUtils.parseValor("abc"), "valor monetário inválido deveria lançar erro");
        AssertManual.erroEsperado(() -> DataUtils.parseIso("07/07/2026"), "data fora do formato ISO deveria lançar erro");
    }
}
```

O que praticamos:

```text
testes manuais;
imports;
métodos privados;
validação de comportamento;
casos normais;
casos inválidos;
mensagens de erro.
```

---

## Classe 8 — Main

Arquivo:

```text
src/br/com/formacao/app/Main.java
```

Código:

```java
package br.com.formacao.app;

import br.com.formacao.core.DataUtils;
import br.com.formacao.core.DinheiroUtils;
import br.com.formacao.core.ResultadoValidacao;
import br.com.formacao.core.TextoUtils;
import br.com.formacao.core.TipoNormalizacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        String nome = TextoUtils.aplicarCaixa("  ana   silva  ", TipoNormalizacao.MAIUSCULA);
        String cpf = TextoUtils.somenteDigitos("123.456.789-00");
        BigDecimal valor = DinheiroUtils.arredondarMoeda(DinheiroUtils.parseValor("199,995"));
        LocalDate data = DataUtils.parseIso("2026-07-07");

        ResultadoValidacao validacaoNome = TextoUtils.obrigatorio(nome, "Nome");
        ResultadoValidacao validacaoValor = DinheiroUtils.positivo(valor, "Valor");

        System.out.println("Nome: " + nome);
        System.out.println("CPF: " + cpf);
        System.out.println("Valor: " + DinheiroUtils.formatarSimples(valor));
        System.out.println("Data: " + DataUtils.formatarBr(data));
        System.out.println("Nome válido: " + validacaoNome.valido());
        System.out.println("Valor válido: " + validacaoValor.valido());
    }
}
```

Saída esperada aproximada:

```text
Nome: ANA SILVA
CPF: 12345678900
Valor: R$ 200.00
Data: 07/07/2026
Nome válido: true
Valor válido: true
```

---

## Compilando o mini projeto

Dentro da pasta da aula:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Esse comando:

```text
encontra todos os arquivos .java;
compila;
gera saída em out;
respeita packages.
```

Se der erro, leia:

```text
arquivo;
linha;
mensagem;
package;
import;
classe não encontrada;
método inexistente.
```

---

## Executando a aplicação

```powershell
java -cp out br.com.formacao.app.Main
```

Se tentar:

```powershell
java Main
```

não funciona, porque a classe tem package.

O nome completo é:

```text
br.com.formacao.app.Main
```

---

## Executando os testes manuais

```powershell
java -cp out br.com.formacao.teste.TesteBibliotecaJavaCore
```

Saída esperada:

```text
Todos os testes manuais passaram.
```

Se algum teste falhar, a saída será uma exception com mensagem.

Exemplo:

```text
java.lang.IllegalStateException: deve normalizar espaços | esperado: Ana Silva | atual: Ana   Silva
```

Isso ajuda a investigar.

---

## O que significa testar manualmente

Testar manualmente aqui não é apenas rodar e olhar.

Testar manualmente significa:

```text
definir resultado esperado;
executar método;
comparar esperado com atual;
falhar se o resultado estiver errado;
mostrar mensagem clara.
```

Isso é uma versão simples da mentalidade de testes automatizados.

JUnit fará isso melhor no futuro.

Mas a mentalidade começa agora.

---

## Refatoração 1 — Main pequeno

Um erro comum é colocar tudo no `Main`.

Ruim:

```text
Main lê entrada;
Main valida texto;
Main converte dinheiro;
Main formata data;
Main testa;
Main imprime;
Main calcula.
```

Melhor:

```text
Main demonstra uso;
TextoUtils cuida de texto;
DinheiroUtils cuida de dinheiro;
DataUtils cuida de data;
TesteBibliotecaJavaCore testa comportamento.
```

Main não deve virar depósito.

---

## Refatoração 2 — mensagens de erro úteis

Ruim:

```java
throw new IllegalArgumentException("Erro.");
```

Melhor:

```java
throw new IllegalArgumentException("Valor monetário inválido: " + texto, erro);
```

Ganho:

```text
mostra contexto;
preserva causa;
ajuda diagnóstico.
```

Isso aplica a aula de exceptions.

---

## Refatoração 3 — nomes melhores

Ruim:

```java
public static String tratar(String v) {
}
```

Melhor:

```java
public static String normalizarEspacos(String valor) {
}
```

Nome bom responde:

```text
o que faz?
com quem faz?
qual intenção?
```

---

## Refatoração 4 — retorno expressivo

Ruim:

```java
public static boolean validar(String valor) {
}
```

Se retornar `false`, o usuário não sabe o motivo.

Melhor:

```java
public static ResultadoValidacao obrigatorio(String valor, String nomeCampo) {
}
```

Agora há:

```text
valido;
mensagem.
```

Isso prepara para modelagens mais ricas.

---

## Refatoração 5 — testes como proteção

Quando mudar `TextoUtils.normalizarEspacos`, rode:

```powershell
java -cp out br.com.formacao.teste.TesteBibliotecaJavaCore
```

Se os testes passarem, há mais segurança.

Se falharem, a mudança quebrou contrato.

Mesmo sem JUnit, já estamos criando proteção.

---

## Leitura crítica do projeto

Revise o mini projeto com estas perguntas:

### 1. Cada classe tem uma responsabilidade clara?

```text
TextoUtils -> texto;
DinheiroUtils -> dinheiro;
DataUtils -> datas;
ResultadoValidacao -> retorno de validação;
TesteBibliotecaJavaCore -> testes manuais;
Main -> demonstração.
```

### 2. Os nomes são claros?

Evite:

```text
UtilsGeral;
Coisas;
Teste1;
Main2.
```

### 3. Exceptions preservam causa?

Veja:

```java
throw new IllegalArgumentException("Valor monetário inválido: " + texto, erro);
```

### 4. BigDecimal é comparado corretamente?

Use:

```java
compareTo
```

### 5. Datas usam java.time?

Use:

```java
LocalDate;
DateTimeFormatter;
ChronoUnit.
```

### 6. Testes cobrem casos inválidos?

Não teste só caminho feliz.

### 7. Pacotes fazem sentido?

```text
core;
app;
teste.
```

### 8. Código gerado está fora do Git?

`out/` e `.class` não devem ser commitados.

---

## Atualizando .gitignore

Se ainda não existir, garanta que `.gitignore` tenha:

```gitignore
*.class
out/
target/
.idea/
*.iml
```

Na prática desta aula, a pasta:

```text
out/
```

será gerada pela compilação manual.

Ela não deve ir para Git.

---

## Erros comuns

### Erro 1 — Criar uma classe Utils gigante

Divida por assunto.

---

### Erro 2 — Colocar teste dentro do Main

Teste manual deve ficar separado.

---

### Erro 3 — Não preservar causa da exception

Ao converter exceção, passe a causa original.

---

### Erro 4 — Usar double para dinheiro

Use BigDecimal.

---

### Erro 5 — Comparar BigDecimal com equals sem entender escala

Use compareTo quando a regra for valor numérico.

---

### Erro 6 — Não testar caso inválido

Teste também entrada errada.

---

### Erro 7 — Ignorar package

Todos os arquivos devem ter package.

---

### Erro 8 — Commitar out ou .class

Arquivos gerados não devem ir para Git.

---

### Erro 9 — Criar métodos genéricos demais

Métodos devem ter intenção clara.

---

### Erro 10 — Não registrar decisões no README

Mini projeto precisa ser explicável.

---

## Debug recomendado

Use debug em:

```text
br.com.formacao.teste.TesteBibliotecaJavaCore
```

Coloque breakpoint em:

```java
AssertManual.iguais("Ana Silva", TextoUtils.normalizarEspacos("  Ana   Silva  "), "deve normalizar espaços");
```

Entre no método:

```java
TextoUtils.normalizarEspacos
```

Observe:

```text
valor original;
resultado de trim;
resultado de replaceAll;
valor retornado;
comparação no AssertManual.
```

Depois faça o mesmo em:

```java
DinheiroUtils.parseValor
DataUtils.parseIso
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-089-mini-projeto-biblioteca-java-core
cd labs\m2\aula-089-mini-projeto-biblioteca-java-core
```

Crie estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\formacao
mkdir src\br\com\formacao\app
mkdir src\br\com\formacao\core
mkdir src\br\com\formacao\teste
```

Crie arquivos:

```text
src/br/com/formacao/app/Main.java
src/br/com/formacao/core/ResultadoValidacao.java
src/br/com/formacao/core/TipoNormalizacao.java
src/br/com/formacao/core/TextoUtils.java
src/br/com/formacao/core/DinheiroUtils.java
src/br/com/formacao/core/DataUtils.java
src/br/com/formacao/teste/AssertManual.java
src/br/com/formacao/teste/TesteBibliotecaJavaCore.java
README.md
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute aplicação:

```powershell
java -cp out br.com.formacao.app.Main
```

Execute testes:

```powershell
java -cp out br.com.formacao.teste.TesteBibliotecaJavaCore
```

Valide Git:

```bash
git status
```

Se `out/` aparecer, corrija `.gitignore`.

---

## Pacotes

```text
br.com.formacao.app
br.com.formacao.core
br.com.formacao.teste
```

## Classes

- `TextoUtils`
- `DinheiroUtils`
- `DataUtils`
- `ResultadoValidacao`
- `TipoNormalizacao`
- `AssertManual`
- `TesteBibliotecaJavaCore`
- `Main`

## Conceitos aplicados

- String
- regex simples
- BigDecimal
- RoundingMode
- LocalDate
- DateTimeFormatter
- ChronoUnit
- enum
- record
- static methods
- classe utilitária
- construtor privado
- exceptions
- causa raiz
- packages
- imports
- testes manuais

## Decisões

- Não usar Maven ainda.
- Não usar JUnit ainda.
- Não usar Spring ainda.
- Não usar bibliotecas externas.
- Manter Java Core puro.
- Usar testes manuais para iniciar mentalidade de validação.
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
git add labs/m2/aula-089-mini-projeto-biblioteca-java-core docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 089: mini projeto biblioteca Java Core"
```

Valide:

```bash
git status
```

Se `out/` ou `.class` aparecerem, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
criar estrutura do mini projeto;
criar package app;
criar package core;
criar package teste;
criar ResultadoValidacao como record;
criar TipoNormalizacao como enum;
criar TextoUtils;
criar DinheiroUtils;
criar DataUtils;
criar AssertManual;
criar TesteBibliotecaJavaCore;
criar Main de demonstração;
usar String e replaceAll;
usar BigDecimal corretamente;
usar RoundingMode;
usar compareTo;
usar LocalDate;
usar DateTimeFormatter;
usar ChronoUnit;
lançar IllegalArgumentException com causa;
compilar com javac -d out;
executar Main com java -cp out;
executar testes manuais;
interpretar falha de teste;
corrigir .gitignore se out aparecer;
registrar decisões no README;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda usar Maven.

Não precisa ainda usar JUnit.

Não precisa ainda usar Spring Boot.

Não precisa ainda criar arquitetura em camadas.

Não precisa ainda publicar biblioteca.

Não precisa ainda usar generics avançados.

Esses assuntos virão depois.

O objetivo é consolidar Java Core em código organizado, pequeno, legível e verificável.

---

## Fechamento da aula

Hoje construímos um mini projeto de biblioteca Java Core.

A ideia central foi:

```text
conceitos isolados ficam mais fortes quando viram código organizado e testável.
```

Vimos que:

```text
TextoUtils centraliza regras de texto;
DinheiroUtils centraliza regras monetárias;
DataUtils centraliza regras de datas;
ResultadoValidacao torna validação mais expressiva;
TipoNormalizacao evita strings mágicas;
AssertManual inicia mentalidade de teste;
TesteBibliotecaJavaCore valida comportamento;
Main demonstra uso;
packages organizam o projeto;
javac -d out compila com saída organizada;
java -cp out executa usando classpath.
```

O ponto mais importante é:

```text
Java Core bem aprendido já permite construir código útil, organizado e com validação real.
```

Na próxima aula, entramos no Módulo 3:

```text
De main gigante para métodos pequenos.
```

A próxima aula vai ensinar sinais de `main` inchado, extração manual de métodos, responsabilidade, nomes, parâmetros e como começar a organizar fluxos sem depender ainda de orientação a objetos avançada.
