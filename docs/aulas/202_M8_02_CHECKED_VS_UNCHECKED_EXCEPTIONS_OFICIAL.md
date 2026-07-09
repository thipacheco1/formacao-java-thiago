# 202 — M8.02 — Checked vs Unchecked Exceptions

## Objetivo da aula

Na aula anterior, você iniciou o Módulo 8 estudando:

```text
Exception;
throw;
IllegalArgumentException;
IllegalStateException;
RuntimeException;
try/catch;
propagação;
stack trace;
erro engolido;
erro de argumento;
erro de estado;
erro de regra;
erro técnico.
```

Agora vamos aprofundar uma diferença central no Java:

```text
checked exceptions
```

e:

```text
unchecked exceptions
```

Esse tema é obrigatório para backend porque ele influencia:

```text
assinatura de métodos;
propagação de erro;
design de services;
camadas de infraestrutura;
integrações externas;
leitura de arquivos;
acesso a banco;
código com try/catch;
uso de throws;
criação de exceptions próprias.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é checked exception;
entender o que é unchecked exception;
entender a diferença entre Exception e RuntimeException;
entender por que algumas exceptions exigem try/catch ou throws;
entender o papel da palavra throws;
saber quando deixar propagar;
saber quando capturar;
saber quando converter checked para unchecked;
evitar throws genérico;
evitar catch genérico sem necessidade;
aplicar checked exception em cenário técnico;
aplicar unchecked exception em regra de domínio;
preparar terreno para exceptions próprias.
```

---

## Ideia principal

No Java, nem toda exception é tratada da mesma forma.

Existem dois grupos importantes:

```text
Checked exceptions:
o compilador obriga você a tratar ou declarar.

Unchecked exceptions:
o compilador não obriga tratamento.
```

Exemplo de checked exception:

```java
IOException
```

Exemplo de unchecked exception:

```java
IllegalArgumentException
IllegalStateException
NullPointerException
RuntimeException
```

A diferença principal é:

```text
checked exception herda de Exception, mas não herda de RuntimeException.

unchecked exception herda de RuntimeException.
```

---

## Hierarquia simplificada

Visualize assim:

```text
Throwable
 ├── Error
 └── Exception
      ├── IOException                 checked
      ├── SQLException                 checked
      └── RuntimeException             unchecked
           ├── IllegalArgumentException
           ├── IllegalStateException
           ├── NullPointerException
           ├── ArithmeticException
           └── IndexOutOfBoundsException
```

Para esta fase, foque nisso:

```text
Exception que não é RuntimeException:
checked.

RuntimeException e filhas:
unchecked.
```

---

## Por que isso importa

Porque checked exceptions afetam o contrato do método.

Exemplo:

```java
public String lerArquivo(String caminho) throws IOException
```

Esse método está dizendo:

```text
quem chamar este método precisa saber que pode ocorrer IOException.
```

Já um método com unchecked exception pode lançar erro sem declarar:

```java
public void validarNome(String nome) {
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório.");
    }
}
```

A assinatura não precisa de `throws`.

---

## Relação com backend

Em backend, normalmente usamos:

```text
unchecked exceptions:
para regra de domínio, validações e estados inválidos.

checked exceptions:
aparecem mais em APIs antigas, I/O, arquivos, rede, JDBC puro e bibliotecas.
```

Exemplos:

```text
Nome obrigatório:
IllegalArgumentException.

Pedido cancelado não pode faturar:
IllegalStateException.

Falha ao ler arquivo:
IOException.

Falha em banco via JDBC:
SQLException.

Falha em integração externa:
pode ser checked ou unchecked dependendo da biblioteca.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-202-checked-vs-unchecked-exceptions
cd labs\m8\aula-202-checked-vs-unchecked-exceptions
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula202
mkdir src\br\com\curso\aula202\app
mkdir src\br\com\curso\aula202\dominio
mkdir src\br\com\curso\aula202\dominio\cliente
mkdir src\br\com\curso\aula202\dominio\pedido
mkdir src\br\com\curso\aula202\infra
mkdir src\br\com\curso\aula202\service
```

---

# Parte 1 — Unchecked exception

## O que é unchecked exception

Unchecked exception é uma exception que o compilador não obriga você a capturar ou declarar.

Ela herda de:

```java
RuntimeException
```

Exemplos:

```text
IllegalArgumentException;
IllegalStateException;
NullPointerException;
ArithmeticException;
IndexOutOfBoundsException.
```

---

## App com unchecked exception

Crie:

```text
src\br\com\curso\aula202\app\UncheckedExceptionBasicoApp.java
```

Código:

```java
package br.com.curso.aula202.app;

public class UncheckedExceptionBasicoApp {
    public static void main(String[] args) {
        cadastrarCliente("");
    }

    private static void cadastrarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        System.out.println("Cliente cadastrado: " + nome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.UncheckedExceptionBasicoApp
```

---

## O que observar

O método:

```java
private static void cadastrarCliente(String nome)
```

não declara:

```java
throws IllegalArgumentException
```

Mesmo assim, pode lançar `IllegalArgumentException`.

Isso é unchecked.

O compilador permite.

---

## Por que unchecked é comum no domínio

Em regra de negócio, validações e estado inválido, usamos muito unchecked porque:

```text
não polui assinatura de todos os métodos;
representa falha de uso ou violação de regra;
pode ser tratada em uma camada superior;
facilita manter domínio limpo;
evita try/catch em cada chamada.
```

Exemplo:

```java
pedido.faturar();
```

Se o pedido estiver cancelado, ele lança exceção.

Quem coordena o fluxo decide onde tratar.

---

# Parte 2 — Checked exception

## O que é checked exception

Checked exception é uma exception que o compilador obriga você a:

```text
capturar com try/catch
```

ou:

```text
declarar com throws.
```

Exemplo clássico:

```java
IOException
```

Ela aparece ao trabalhar com arquivos, streams de I/O e APIs antigas.

---

## App com checked exception usando throws

Crie:

```text
src\br\com\curso\aula202\app\CheckedExceptionComThrowsApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedExceptionComThrowsApp {
    public static void main(String[] args) throws IOException {
        String conteudo = Files.readString(Path.of("arquivo-inexistente.txt"));

        System.out.println(conteudo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.CheckedExceptionComThrowsApp
```

---

## O que observar

O método `main` declarou:

```java
throws IOException
```

Sem isso, o código não compila.

Isso acontece porque `Files.readString(...)` pode lançar `IOException`, que é checked.

---

## O que significa throws

A palavra `throws` na assinatura do método significa:

```text
este método pode lançar essa exception;
quem chamar precisa lidar com isso.
```

Exemplo:

```java
public static void main(String[] args) throws IOException
```

Leitura:

```text
o main pode lançar IOException.
```

---

## Checked com try/catch

Agora vamos tratar a mesma exception com `try/catch`.

Crie:

```text
src\br\com\curso\aula202\app\CheckedExceptionComTryCatchApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedExceptionComTryCatchApp {
    public static void main(String[] args) {
        try {
            String conteudo = Files.readString(Path.of("arquivo-inexistente.txt"));
            System.out.println(conteudo);
        } catch (IOException erro) {
            System.out.println("Não foi possível ler o arquivo: " + erro.getMessage());
        }

        System.out.println("Programa finalizado com tratamento.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.CheckedExceptionComTryCatchApp
```

---

## Diferença entre throws e try/catch

Com `throws`:

```text
eu não trato aqui;
deixo o erro subir para quem chamou.
```

Com `try/catch`:

```text
eu trato aqui;
decido o que fazer neste ponto.
```

---

# Parte 3 — O compilador força checked exception

## Exemplo que não compila

Crie:

```text
src\br\com\curso\aula202\app\CheckedExceptionNaoCompilaApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedExceptionNaoCompilaApp {
    public static void main(String[] args) {
        String conteudo = Files.readString(Path.of("arquivo-inexistente.txt"));

        System.out.println(conteudo);
    }
}
```

Tente compilar:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

---

## O que acontece

Esse arquivo não compila porque `Files.readString` pode lançar `IOException`.

O Java exige uma das duas opções:

```text
try/catch;
throws IOException.
```

Corrija de uma das formas:

```java
public static void main(String[] args) throws IOException
```

ou:

```java
try {
    ...
} catch (IOException erro) {
    ...
}
```

---

## Para continuar a aula

Depois de observar o erro de compilação, você pode:

```text
comentar esse arquivo;
corrigir com throws;
ou corrigir com try/catch.
```

Caso contrário, os próximos exemplos não vão compilar junto com ele.

---

# Parte 4 — Comparação direta

## Checked

Exemplo:

```java
private static String lerArquivo(String caminho) throws IOException {
    return Files.readString(Path.of(caminho));
}
```

Característica:

```text
obriga declarar ou tratar.
```

---

## Unchecked

Exemplo:

```java
private static void validarNome(String nome) {
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório.");
    }
}
```

Característica:

```text
não obriga declarar ou tratar.
```

---

## App comparativo

Crie:

```text
src\br\com\curso\aula202\app\CheckedVsUncheckedComparacaoApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedVsUncheckedComparacaoApp {
    public static void main(String[] args) {
        try {
            validarNome("Ana");
            String conteudo = lerArquivo("arquivo-inexistente.txt");
            System.out.println(conteudo);
        } catch (IOException erro) {
            System.out.println("Erro técnico ao ler arquivo: " + erro.getMessage());
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro de validação: " + erro.getMessage());
        }
    }

    private static void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }

    private static String lerArquivo(String caminho) throws IOException {
        return Files.readString(Path.of(caminho));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.CheckedVsUncheckedComparacaoApp
```

---

## O que observar

`validarNome` pode lançar unchecked.

Não precisa declarar.

`lerArquivo` pode lançar checked.

Precisa declarar:

```java
throws IOException
```

ou tratar internamente.

---

# Parte 5 — throws na assinatura

## throws faz parte do contrato

Quando você escreve:

```java
public String carregar(String caminho) throws IOException
```

você está dizendo:

```text
este método pode falhar por problema de I/O;
quem chamar deve saber disso.
```

Isso afeta todos os chamadores.

---

## App com propagação via throws

Crie:

```text
src\br\com\curso\aula202\app\PropagacaoComThrowsApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class PropagacaoComThrowsApp {
    public static void main(String[] args) {
        try {
            executarFluxo();
        } catch (IOException erro) {
            System.out.println("Erro tratado no main: " + erro.getMessage());
        }
    }

    private static void executarFluxo() throws IOException {
        String conteudo = carregarArquivo("arquivo-inexistente.txt");
        System.out.println(conteudo);
    }

    private static String carregarArquivo(String caminho) throws IOException {
        return Files.readString(Path.of(caminho));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.PropagacaoComThrowsApp
```

---

## Como ler

```text
carregarArquivo pode lançar IOException;
executarFluxo não trata, então declara throws IOException;
main chama executarFluxo e trata com try/catch.
```

Esse é o efeito cascata de checked exception.

---

## Cuidado com throws em excesso

Se você coloca `throws IOException` em muitos métodos, a exception técnica começa a vazar por várias camadas.

Em backend profissional, muitas vezes preferimos converter erro técnico em uma exception da aplicação ou infraestrutura.

Vamos estudar isso com exceptions próprias mais adiante.

---

# Parte 6 — throws Exception é ruim

## Evite assinatura genérica

Evite:

```java
public void executar() throws Exception
```

Isso é genérico demais.

O chamador não sabe o que pode acontecer.

Melhor:

```java
public void carregarArquivo() throws IOException
```

ou tratar e converter.

---

## App com throws genérico

Crie:

```text
src\br\com\curso\aula202\app\ThrowsGenericoRuimApp.java
```

Código:

```java
package br.com.curso.aula202.app;

public class ThrowsGenericoRuimApp {
    public static void main(String[] args) {
        try {
            executar();
        } catch (Exception erro) {
            System.out.println("Erro genérico capturado: " + erro.getMessage());
        }
    }

    private static void executar() throws Exception {
        throw new Exception("Erro genérico demais.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.ThrowsGenericoRuimApp
```

---

## Por que é ruim

`Exception` é amplo demais.

Pode representar muita coisa.

Prefira tipos mais específicos:

```text
IOException;
SQLException;
IllegalArgumentException;
IllegalStateException;
exceptions próprias.
```

Regra profissional:

```text
quanto mais específico o erro, melhor o diagnóstico.
```

---

# Parte 7 — Converter checked para unchecked

## Por que converter

Às vezes uma API técnica lança checked exception, mas você não quer espalhar `throws IOException` por toda a aplicação.

Então você captura e converte para unchecked.

Exemplo:

```java
try {
    return Files.readString(path);
} catch (IOException erro) {
    throw new IllegalStateException("Falha ao ler arquivo.", erro);
}
```

Observe:

```java
erro
```

é passado como causa.

Isso preserva a causa original.

---

## App convertendo exception

Crie:

```text
src\br\com\curso\aula202\app\ConverterCheckedParaUncheckedApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ConverterCheckedParaUncheckedApp {
    public static void main(String[] args) {
        String conteudo = carregarConfiguracao("config-inexistente.txt");

        System.out.println(conteudo);
    }

    private static String carregarConfiguracao(String caminho) {
        try {
            return Files.readString(Path.of(caminho));
        } catch (IOException erro) {
            throw new IllegalStateException("Falha ao carregar configuração: " + caminho, erro);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.ConverterCheckedParaUncheckedApp
```

---

## Por que passar a causa

Este trecho:

```java
throw new IllegalStateException("Falha ao carregar configuração: " + caminho, erro);
```

preserva a exception original.

Isso é importante para stack trace.

Mensagem de alto nível:

```text
Falha ao carregar configuração.
```

Causa original:

```text
IOException.
```

Regra profissional:

```text
ao converter exception, preserve a causa.
```

---

# Parte 8 — Camadas: domínio vs infraestrutura

## Domínio

No domínio, normalmente usamos unchecked para regra violada.

Exemplo:

```java
throw new IllegalArgumentException("Preço deve ser maior que zero.");
throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
```

---

## Infraestrutura

Na infraestrutura, podem aparecer checked exceptions.

Exemplos:

```text
ler arquivo;
conectar banco;
chamar API;
abrir socket;
processar stream de dados.
```

A camada de infraestrutura pode:

```text
tratar;
converter;
propagar uma exception específica.
```

---

## Service

O service coordena.

Ele não deveria ficar cheio de detalhes técnicos desnecessários.

Exemplo ruim:

```java
public void executar() throws IOException, SQLException
```

em todo service.

Exemplo melhor em muitos casos:

```text
infra captura IOException;
converte para exception de infraestrutura;
service decide se falha impede o fluxo.
```

Vamos aprofundar isso quando criarmos exceptions próprias.

---

# Parte 9 — Domínio Pedido com unchecked

## Pedido

Crie:

```text
src\br\com\curso\aula202\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula202.dominio.pedido;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final boolean pago;
    private boolean cancelado;
    private boolean faturado;

    public Pedido(String codigo, String cliente, BigDecimal valor, boolean pago) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do pedido é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do pedido deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.pago = pago;
        this.cancelado = false;
        this.faturado = false;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public boolean faturado() {
        return faturado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado && !faturado;
    }

    public void cancelar() {
        if (faturado) {
            throw new IllegalStateException("Pedido faturado não pode ser cancelado.");
        }

        if (cancelado) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        cancelado = true;
    }

    public void faturar() {
        if (!pago) {
            throw new IllegalStateException("Pedido não pago não pode ser faturado.");
        }

        if (cancelado) {
            throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
        }

        if (faturado) {
            throw new IllegalStateException("Pedido já está faturado.");
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Pedido unchecked

Crie:

```text
src\br\com\curso\aula202\app\PedidoUncheckedApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import br.com.curso.aula202.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class PedidoUncheckedApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "PED-001",
                "Ana",
                new BigDecimal("500.00"),
                false
        );

        pedido.faturar();

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.PedidoUncheckedApp
```

---

## O que observar

O método:

```java
pedido.faturar();
```

pode lançar `IllegalStateException`.

Mas a assinatura não obriga `try/catch`.

Isso é adequado para regra de domínio em muitos designs.

---

# Parte 10 — Infraestrutura simulada com checked

## LeitorArquivo

Crie:

```text
src\br\com\curso\aula202\infra\LeitorArquivo.java
```

Código:

```java
package br.com.curso.aula202.infra;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LeitorArquivo {
    public String ler(String caminho) throws IOException {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        return Files.readString(Path.of(caminho));
    }
}
```

---

## App usando LeitorArquivo

Crie:

```text
src\br\com\curso\aula202\app\LeitorArquivoCheckedApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import br.com.curso.aula202.infra.LeitorArquivo;

import java.io.IOException;

public class LeitorArquivoCheckedApp {
    public static void main(String[] args) {
        LeitorArquivo leitor = new LeitorArquivo();

        try {
            String conteudo = leitor.ler("arquivo-inexistente.txt");
            System.out.println(conteudo);
        } catch (IOException erro) {
            System.out.println("Falha técnica ao ler arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.LeitorArquivoCheckedApp
```

---

## O que observar

`LeitorArquivo.ler` declara:

```java
throws IOException
```

Quem chama precisa tratar ou propagar.

Isso faz sentido porque leitura de arquivo é uma operação técnica que pode falhar por motivos externos.

---

# Parte 11 — Infraestrutura convertendo para unchecked

## LeitorConfiguracao

Crie:

```text
src\br\com\curso\aula202\infra\LeitorConfiguracao.java
```

Código:

```java
package br.com.curso.aula202.infra;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LeitorConfiguracao {
    public String carregar(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho da configuração é obrigatório.");
        }

        try {
            return Files.readString(Path.of(caminho));
        } catch (IOException erro) {
            throw new IllegalStateException("Não foi possível carregar a configuração: " + caminho, erro);
        }
    }
}
```

---

## App LeitorConfiguracao

Crie:

```text
src\br\com\curso\aula202\app\LeitorConfiguracaoUncheckedApp.java
```

Código:

```java
package br.com.curso.aula202.app;

import br.com.curso.aula202.infra.LeitorConfiguracao;

public class LeitorConfiguracaoUncheckedApp {
    public static void main(String[] args) {
        LeitorConfiguracao leitor = new LeitorConfiguracao();

        String conteudo = leitor.carregar("config-inexistente.txt");

        System.out.println(conteudo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula202.app.LeitorConfiguracaoUncheckedApp
```

---

## O que observar

O método `carregar` não declara:

```java
throws IOException
```

Ele captura `IOException` e converte para:

```java
IllegalStateException
```

com causa preservada.

Isso evita vazar `IOException` para todas as camadas.

---

# Parte 12 — Matriz de decisão

## Quando usar unchecked

Use unchecked para:

```text
argumento inválido;
estado inválido;
regra de negócio violada;
pré-condição quebrada;
bug de programação;
uso incorreto de método.
```

Exemplos:

```java
IllegalArgumentException
IllegalStateException
```

---

## Quando usar checked

Use checked quando:

```text
o erro é técnico;
a falha é esperada pela natureza da operação;
o chamador precisa ser obrigado a lidar com o erro;
a API Java ou biblioteca já trabalha assim.
```

Exemplos:

```java
IOException
SQLException
```

---

## Quando converter checked para unchecked

Considere converter quando:

```text
a checked exception é detalhe técnico;
você não quer poluir camadas superiores;
não há recuperação local útil;
quer preservar causa e subir erro contextualizado;
vai tratar em uma borda do sistema.
```

Exemplo:

```java
catch (IOException erro) {
    throw new IllegalStateException("Falha ao carregar configuração.", erro);
}
```

---

## Quando não converter

Não converta só por preguiça.

Se o chamador realmente precisa saber e agir sobre aquele erro específico, talvez checked faça sentido.

Exemplo:

```text
tentar outro arquivo;
pedir novo caminho;
reprocessar com fallback;
diferenciar arquivo ausente de permissão negada.
```

---

# Parte 13 — Erros comuns

## 1. Achar que checked é sempre melhor

Não é.

Checked exception pode poluir muitas assinaturas.

Use com critério.

---

## 2. Achar que unchecked é bagunça

Também não é.

Unchecked bem usada deixa domínio mais limpo e expressivo.

---

## 3. Declarar throws Exception

Evite:

```java
throws Exception
```

Prefira tipo específico.

---

## 4. Capturar Exception e ignorar

Nunca engula erro.

---

## 5. Converter exception sem causa

Ruim:

```java
throw new IllegalStateException("Falha ao ler arquivo.");
```

Melhor:

```java
throw new IllegalStateException("Falha ao ler arquivo.", erro);
```

---

## 6. Usar checked em regra de domínio simples

Exemplo ruim:

```java
public void faturar() throws Exception
```

Para regra de domínio, prefira exception específica ou unchecked.

---

## 7. Vazamento técnico para camada errada

Exemplo ruim:

```java
public PedidoResponse executar() throws IOException
```

em um service de regra de negócio, sem necessidade.

Melhor será usar exception própria ou conversão contextualizada.

---

# Parte 14 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula202.app.UncheckedExceptionBasicoApp
java -cp out br.com.curso.aula202.app.CheckedExceptionComThrowsApp
java -cp out br.com.curso.aula202.app.CheckedExceptionComTryCatchApp
java -cp out br.com.curso.aula202.app.CheckedVsUncheckedComparacaoApp
java -cp out br.com.curso.aula202.app.PropagacaoComThrowsApp
java -cp out br.com.curso.aula202.app.ThrowsGenericoRuimApp
java -cp out br.com.curso.aula202.app.ConverterCheckedParaUncheckedApp
java -cp out br.com.curso.aula202.app.PedidoUncheckedApp
java -cp out br.com.curso.aula202.app.LeitorArquivoCheckedApp
java -cp out br.com.curso.aula202.app.LeitorConfiguracaoUncheckedApp
```

Para cada execução, responda:

```text
a exception era checked ou unchecked?
o compilador obrigou tratamento?
houve throws?
houve try/catch?
houve conversão de exception?
a causa original foi preservada?
a exception faz sentido para a camada?
```

---

# Parte 15 — Desafio prático

## Contexto

Você vai criar um pequeno fluxo de importação de produtos a partir de arquivo.

O objetivo é praticar:

```text
checked exception em infraestrutura;
unchecked exception em domínio;
conversão de exception técnica;
mensagem clara;
preservação da causa;
service coordenando fluxo.
```

---

## Produto

Crie:

```text
src\br\com\curso\aula202\dominio\produto\Produto.java
```

Campos:

```text
String sku;
String nome;
BigDecimal preco;
int estoque;
```

Regras:

```text
sku obrigatório;
nome obrigatório;
preco obrigatório e maior que zero;
estoque não pode ser negativo.
```

Use:

```text
IllegalArgumentException
```

para dados inválidos.

---

## LeitorLinhasArquivo

Crie:

```text
src\br\com\curso\aula202\infra\LeitorLinhasArquivo.java
```

Método:

```java
List<String> lerLinhas(String caminho) throws IOException
```

Regras:

```text
caminho obrigatório;
usar Files.readAllLines(Path.of(caminho));
declarar throws IOException.
```

---

## ProdutoImportacaoService

Crie:

```text
src\br\com\curso\aula202\service\ProdutoImportacaoService.java
```

Método:

```java
List<Produto> importar(String caminho)
```

Regras:

```text
validar caminho;
chamar LeitorLinhasArquivo;
converter IOException para IllegalStateException;
preservar causa original;
parsear linhas no formato:
SKU;NOME;PRECO;ESTOQUE
ignorar linhas vazias;
se linha estiver inválida, lançar IllegalArgumentException com número da linha;
retornar lista de produtos.
```

Exemplo de linha válida:

```text
PRD-001;Notebook;3500.00;5
```

Exemplos inválidos:

```text
PRD-002;Mouse
PRD-003;Teclado;abc;10
PRD-004;Monitor;1200.00;-1
```

---

## App

Crie:

```text
src\br\com\curso\aula202\app\ProdutoImportacaoApp.java
```

O app deve demonstrar:

```text
tentativa de importar arquivo inexistente;
tratamento com try/catch;
mensagem clara;
causa original disponível no stack trace se não tratar.
```

Critérios:

```text
LeitorLinhasArquivo trabalha com checked IOException;
Produto usa unchecked para validação;
Service converte IOException para unchecked com causa;
Service não imprime;
App demonstra tratamento.
```

---

## Desafio extra

Crie um arquivo manualmente na pasta do projeto:

```text
produtos.txt
```

Conteúdo:

```text
PRD-001;Notebook;3500.00;5
PRD-002;Mouse;80.00;20
PRD-003;Monitor;1200.00;10
```

Altere o app para importar esse arquivo com sucesso.

Depois adicione uma linha inválida e confirme que a mensagem mostra o número da linha.

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
UncheckedExceptionBasicoApp
CheckedExceptionComThrowsApp
CheckedExceptionComTryCatchApp
PropagacaoComThrowsApp
ConverterCheckedParaUncheckedApp
LeitorArquivo.ler
LeitorConfiguracao.carregar
Pedido.faturar
```

Observe:

```text
quando o compilador exige tratamento;
quando throws propaga;
quando catch captura;
quando checked vira unchecked;
como a causa original fica preservada;
como stack trace muda;
como domínio lança unchecked;
como infraestrutura lida com checked.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é checked exception?
2. O que é unchecked exception?
3. Qual a relação entre RuntimeException e unchecked?
4. Para que serve throws?
5. Quando usar try/catch?
6. Por que evitar throws Exception?
7. Quando converter checked para unchecked?
8. Por que preservar a causa original?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
diferenciar checked e unchecked;
explicar RuntimeException;
explicar Exception;
usar throws;
usar try/catch com checked exception;
deixar unchecked propagar quando adequado;
evitar throws Exception;
converter IOException para unchecked;
preservar causa original;
aplicar unchecked em domínio;
aplicar checked em infraestrutura;
entender vazamento técnico entre camadas;
resolver ProdutoImportacaoService;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-202-checked-vs-unchecked-exceptions
git commit -m "Aula 202: checked vs unchecked exceptions"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
checked exception obriga tratamento ou declaração; unchecked exception não obriga.
```

Você estudou:

```text
Exception;
RuntimeException;
checked exception;
unchecked exception;
throws;
try/catch;
IOException;
IllegalArgumentException;
IllegalStateException;
conversão de checked para unchecked;
preservação da causa;
separação entre domínio e infraestrutura.
```

Também avançou na visão profissional:

```text
domínio usa erros claros de regra;
infraestrutura lida com falhas técnicas;
service não deve vazar detalhe técnico sem necessidade.
```

Na próxima aula, vamos criar exceptions próprias.

Vamos sair de:

```java
IllegalArgumentException
IllegalStateException
```

para nomes mais expressivos, como:

```text
PedidoNaoEncontradoException;
PedidoNaoPodeSerFaturadoException;
ProdutoIndisponivelException;
FalhaLeituraArquivoException.
```

Isso vai deixar os erros mais claros, mais testáveis e mais alinhados com backend profissional.
