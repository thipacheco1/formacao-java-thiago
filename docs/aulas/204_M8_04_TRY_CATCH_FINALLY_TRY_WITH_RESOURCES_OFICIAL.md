# 204 — M8.04 — try, catch, finally e try-with-resources

## Objetivo da aula

Na aula anterior, você estudou:

```text
exceptions próprias;
exceptions de domínio;
exceptions de infraestrutura;
exception com mensagem;
exception com causa;
preservação da causa original;
não encontrado;
regra violada;
falha técnica;
hierarquia de exceptions;
DominioException;
InfraestruturaException.
```

Agora vamos aprofundar o controle de erro no Java com quatro estruturas essenciais:

```text
try;
catch;
finally;
try-with-resources.
```

Essas estruturas aparecem muito em backend, principalmente quando lidamos com:

```text
arquivos;
conexões;
streams de dados;
recursos externos;
operações que podem falhar;
limpeza de recurso;
logs;
tratamento técnico;
conversão de exceptions;
integrações;
processamento em lote.
```

Ao final desta aula, você deve conseguir:

```text
usar try/catch corretamente;
capturar exceptions específicas;
entender ordem de múltiplos catch;
usar finally;
entender quando finally executa;
entender por que finally não deve ter regra principal;
usar try-with-resources;
entender AutoCloseable;
entender fechamento automático de recurso;
evitar vazamento de recurso;
converter exception técnica preservando causa;
evitar catch vazio;
evitar catch genérico sem necessidade;
aplicar leitura de arquivo com segurança;
separar domínio, service e infraestrutura.
```

---

## Ideia principal

`try/catch` permite tratar erros.

`finally` permite executar uma ação de encerramento.

`try-with-resources` permite fechar recursos automaticamente.

Exemplo simples:

```java
try {
    executarAlgoQuePodeFalhar();
} catch (RuntimeException erro) {
    tratarErro(erro);
} finally {
    executarLimpeza();
}
```

Exemplo moderno com recurso:

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("arquivo.txt"))) {
    String linha = reader.readLine();
    System.out.println(linha);
} catch (IOException erro) {
    System.out.println("Falha ao ler arquivo: " + erro.getMessage());
}
```

A ideia profissional é:

```text
capture quando consegue tratar;
feche recurso sempre;
não esconda erro;
preserve causa original quando converter exception.
```

---

## Por que isso importa no backend

Backends lidam com recursos.

Exemplos:

```text
conexão com banco;
arquivo recebido;
arquivo gerado;
stream de upload;
stream de download;
chamada HTTP;
mensageria;
processamento de planilha;
leitura de CSV;
integração com sistema legado.
```

Recurso aberto precisa ser fechado.

Erro técnico precisa ser tratado ou propagado com clareza.

Código que não fecha recurso pode causar:

```text
vazamento de memória;
arquivo travado;
conexão presa;
pool de conexão esgotado;
lentidão;
falhas intermitentes;
problemas difíceis de diagnosticar.
```

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto desta aula:

```text
Entidade:
não deve saber sobre arquivo, reader, conexão ou try-with-resources técnico.

Infraestrutura:
abre, lê, escreve, fecha e converte falhas técnicas.

Service:
coordena o fluxo e decide se a falha impede a operação.

Controller futuro:
traduz exception para resposta HTTP.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-204-try-catch-finally-try-with-resources
cd labs\m8\aula-204-try-catch-finally-try-with-resources
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula204
mkdir src\br\com\curso\aula204\app
mkdir src\br\com\curso\aula204\dominio
mkdir src\br\com\curso\aula204\dominio\produto
mkdir src\br\com\curso\aula204\exception
mkdir src\br\com\curso\aula204\exception\infra
mkdir src\br\com\curso\aula204\infra
mkdir src\br\com\curso\aula204\service
```

---

# Parte 1 — try/catch básico

## O que é try

O bloco `try` envolve um trecho que pode falhar.

Exemplo:

```java
try {
    int resultado = 10 / 0;
}
```

Sozinho, o `try` não resolve.

Ele precisa de `catch` ou `finally`.

---

## O que é catch

O bloco `catch` captura uma exception.

Exemplo:

```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException erro) {
    System.out.println("Erro: " + erro.getMessage());
}
```

---

## App básico

Crie:

```text
src\br\com\curso\aula204\app\TryCatchBasicoApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class TryCatchBasicoApp {
    public static void main(String[] args) {
        try {
            int resultado = 10 / 0;
            System.out.println("Resultado: " + resultado);
        } catch (ArithmeticException erro) {
            System.out.println("Falha ao calcular: " + erro.getMessage());
        }

        System.out.println("Programa continuou.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.TryCatchBasicoApp
```

---

## O que observar

O erro aconteceu.

O `catch` capturou.

O programa continuou.

Isso é útil quando você consegue tratar o erro naquele ponto.

---

## Regra profissional

```text
use catch quando você tem uma ação útil a fazer.
```

Ação útil pode ser:

```text
retornar mensagem amigável;
registrar log;
converter exception;
tentar fallback;
marcar item como falho;
continuar processamento parcial;
encerrar fluxo de forma controlada.
```

---

# Parte 2 — Múltiplos catch

## Por que múltiplos catch

Um mesmo bloco pode falhar por motivos diferentes.

Exemplo:

```text
argumento inválido;
estado inválido;
erro de cálculo;
erro técnico.
```

Você pode capturar cada caso separadamente.

---

## App com múltiplos catch

Crie:

```text
src\br\com\curso\aula204\app\MultiplosCatchApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class MultiplosCatchApp {
    public static void main(String[] args) {
        try {
            executar(" ");
        } catch (IllegalArgumentException erro) {
            System.out.println("Erro de argumento: " + erro.getMessage());
        } catch (IllegalStateException erro) {
            System.out.println("Erro de estado: " + erro.getMessage());
        } catch (RuntimeException erro) {
            System.out.println("Erro runtime genérico: " + erro.getMessage());
        }
    }

    private static void executar(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        boolean bloqueado = true;

        if (bloqueado) {
            throw new IllegalStateException("Fluxo bloqueado.");
        }

        System.out.println("Executado com sucesso.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.MultiplosCatchApp
```

---

## Ordem importa

O catch mais específico deve vir antes do mais genérico.

Correto:

```java
catch (IllegalArgumentException erro) {
    ...
} catch (RuntimeException erro) {
    ...
}
```

Errado:

```java
catch (RuntimeException erro) {
    ...
} catch (IllegalArgumentException erro) {
    ...
}
```

O segundo catch fica inalcançável, porque `IllegalArgumentException` já é um `RuntimeException`.

---

## Multi-catch

Quando o tratamento é igual para tipos diferentes, você pode usar multi-catch.

Exemplo:

```java
catch (IllegalArgumentException | IllegalStateException erro) {
    System.out.println("Falha controlada: " + erro.getMessage());
}
```

---

## App com multi-catch

Crie:

```text
src\br\com\curso\aula204\app\MultiCatchApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class MultiCatchApp {
    public static void main(String[] args) {
        try {
            validarFluxo(false, true);
        } catch (IllegalArgumentException | IllegalStateException erro) {
            System.out.println("Falha controlada: " + erro.getMessage());
        }
    }

    private static void validarFluxo(boolean argumentoValido, boolean estadoBloqueado) {
        if (!argumentoValido) {
            throw new IllegalArgumentException("Argumento inválido.");
        }

        if (estadoBloqueado) {
            throw new IllegalStateException("Estado bloqueado.");
        }

        System.out.println("Fluxo válido.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.MultiCatchApp
```

---

# Parte 3 — finally

## O que é finally

`finally` é um bloco que executa depois do `try/catch`.

Ele executa mesmo se:

```text
não houver erro;
houver erro tratado;
houver erro não tratado.
```

Ele é usado para limpeza.

Exemplos:

```text
fechar recurso;
liberar trava;
encerrar conexão;
limpar estado temporário;
registrar finalização técnica.
```

---

## App finally sem erro

Crie:

```text
src\br\com\curso\aula204\app\FinallySemErroApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class FinallySemErroApp {
    public static void main(String[] args) {
        try {
            System.out.println("Executando fluxo sem erro.");
        } catch (RuntimeException erro) {
            System.out.println("Erro: " + erro.getMessage());
        } finally {
            System.out.println("Finally executado.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.FinallySemErroApp
```

---

## App finally com erro tratado

Crie:

```text
src\br\com\curso\aula204\app\FinallyComErroTratadoApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class FinallyComErroTratadoApp {
    public static void main(String[] args) {
        try {
            System.out.println("Executando fluxo com erro.");
            int resultado = 10 / 0;
            System.out.println(resultado);
        } catch (ArithmeticException erro) {
            System.out.println("Erro tratado: " + erro.getMessage());
        } finally {
            System.out.println("Finally executado mesmo com erro.");
        }

        System.out.println("Programa continuou.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.FinallyComErroTratadoApp
```

---

## App finally com erro não tratado

Crie:

```text
src\br\com\curso\aula204\app\FinallyComErroNaoTratadoApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class FinallyComErroNaoTratadoApp {
    public static void main(String[] args) {
        try {
            System.out.println("Executando fluxo com erro não tratado.");
            String valor = null;
            System.out.println(valor.length());
        } finally {
            System.out.println("Finally executado antes da exception propagar.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.FinallyComErroNaoTratadoApp
```

---

## O que observar

Mesmo sem `catch`, o `finally` executa antes da exception encerrar o programa.

Isso mostra que `finally` é voltado para limpeza.

---

## Cuidado com finally

Evite colocar regra principal no `finally`.

Não use `finally` para:

```text
decidir regra de negócio;
retornar resposta principal;
salvar dados importantes sem controle;
esconder erro;
lançar outro erro sem necessidade.
```

Use para finalização.

---

# Parte 4 — finally e return

## Cuidado com return no finally

`return` dentro de `finally` pode esconder erros e confundir o fluxo.

Exemplo ruim:

```java
try {
    throw new RuntimeException("Erro original.");
} finally {
    return "valor";
}
```

Esse `return` pode esconder a exception original.

---

## App demonstrando risco

Crie:

```text
src\br\com\curso\aula204\app\FinallyComReturnRuimApp.java
```

Código:

```java
package br.com.curso.aula204.app;

public class FinallyComReturnRuimApp {
    public static void main(String[] args) {
        String resultado = executar();

        System.out.println("Resultado: " + resultado);
    }

    private static String executar() {
        try {
            throw new RuntimeException("Erro original.");
        } finally {
            return "Valor retornado pelo finally.";
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.FinallyComReturnRuimApp
```

---

## O que observar

O erro original não aparece como você esperaria.

O `return` no `finally` escondeu o problema.

Regra profissional:

```text
não use return dentro de finally.
```

---

# Parte 5 — Fechamento manual de recurso

## Problema

Antes do try-with-resources, era comum fechar recurso no `finally`.

Exemplo conceitual:

```java
BufferedReader reader = null;

try {
    reader = ...
} finally {
    if (reader != null) {
        reader.close();
    }
}
```

Funciona, mas é verboso e propenso a erro.

---

## App com fechamento manual

Crie:

```text
src\br\com\curso\aula204\app\FechamentoManualApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FechamentoManualApp {
    public static void main(String[] args) {
        BufferedReader reader = null;

        try {
            reader = Files.newBufferedReader(Path.of("arquivo-inexistente.txt"));
            String linha = reader.readLine();
            System.out.println(linha);
        } catch (IOException erro) {
            System.out.println("Falha ao ler arquivo: " + erro.getMessage());
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                    System.out.println("Reader fechado manualmente.");
                } catch (IOException erro) {
                    System.out.println("Falha ao fechar reader: " + erro.getMessage());
                }
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.FechamentoManualApp
```

---

## Problemas do fechamento manual

O código fica:

```text
mais verboso;
mais fácil de errar;
com try/catch dentro do finally;
mais difícil de ler;
mais sujeito a esquecer close.
```

Por isso existe:

```text
try-with-resources.
```

---

# Parte 6 — try-with-resources

## O que é try-with-resources

`try-with-resources` fecha automaticamente recursos que implementam:

```java
AutoCloseable
```

ou:

```java
Closeable
```

Exemplo:

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("arquivo.txt"))) {
    String linha = reader.readLine();
    System.out.println(linha);
}
```

Quando o bloco termina, o Java chama:

```java
reader.close();
```

automaticamente.

---

## App com try-with-resources

Crie:

```text
src\br\com\curso\aula204\app\TryWithResourcesApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class TryWithResourcesApp {
    public static void main(String[] args) {
        try (BufferedReader reader = Files.newBufferedReader(Path.of("arquivo-inexistente.txt"))) {
            String linha = reader.readLine();
            System.out.println(linha);
        } catch (IOException erro) {
            System.out.println("Falha ao ler arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.TryWithResourcesApp
```

---

## O que melhorou

Não precisamos escrever:

```java
finally {
    reader.close();
}
```

O Java faz isso.

O código fica:

```text
menor;
mais claro;
mais seguro;
menos propenso a vazamento de recurso.
```

---

## Quando usar try-with-resources

Use com recursos que precisam ser fechados.

Exemplos:

```text
BufferedReader;
BufferedWriter;
InputStream;
OutputStream;
FileInputStream;
FileOutputStream;
Scanner;
Connection;
PreparedStatement;
ResultSet;
recursos próprios AutoCloseable.
```

---

# Parte 7 — AutoCloseable

## O que é AutoCloseable

`AutoCloseable` é uma interface do Java.

Ela tem o método:

```java
void close() throws Exception;
```

Qualquer classe que implementa `AutoCloseable` pode ser usada em try-with-resources.

---

## Criando recurso próprio

Crie:

```text
src\br\com\curso\aula204\infra\RecursoSimulado.java
```

Código:

```java
package br.com.curso.aula204.infra;

public class RecursoSimulado implements AutoCloseable {
    private final String nome;

    public RecursoSimulado(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do recurso é obrigatório.");
        }

        this.nome = nome;
        System.out.println("Recurso aberto: " + nome);
    }

    public void executar() {
        System.out.println("Executando recurso: " + nome);
    }

    @Override
    public void close() {
        System.out.println("Recurso fechado: " + nome);
    }
}
```

---

## App com recurso próprio

Crie:

```text
src\br\com\curso\aula204\app\AutoCloseableApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.infra.RecursoSimulado;

public class AutoCloseableApp {
    public static void main(String[] args) {
        try (RecursoSimulado recurso = new RecursoSimulado("processamento")) {
            recurso.executar();
        }

        System.out.println("Fim do programa.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.AutoCloseableApp
```

---

## O que observar

A saída deve mostrar:

```text
recurso aberto;
execução;
recurso fechado.
```

Mesmo sem chamar `close()` manualmente, ele foi chamado.

---

# Parte 8 — try-with-resources com erro

## Recurso fecha mesmo com erro

Crie:

```text
src\br\com\curso\aula204\app\AutoCloseableComErroApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.infra.RecursoSimulado;

public class AutoCloseableComErroApp {
    public static void main(String[] args) {
        try (RecursoSimulado recurso = new RecursoSimulado("processamento-com-erro")) {
            recurso.executar();
            throw new IllegalStateException("Erro durante processamento.");
        } catch (IllegalStateException erro) {
            System.out.println("Erro capturado: " + erro.getMessage());
        }

        System.out.println("Fim do programa.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.AutoCloseableComErroApp
```

---

## O que observar

Mesmo com erro dentro do `try`, o recurso é fechado.

Isso é o principal valor do try-with-resources.

---

# Parte 9 — Múltiplos recursos

## try-with-resources com mais de um recurso

Você pode abrir mais de um recurso:

```java
try (
        RecursoSimulado primeiro = new RecursoSimulado("primeiro");
        RecursoSimulado segundo = new RecursoSimulado("segundo")
) {
    ...
}
```

Os recursos são fechados na ordem inversa da abertura.

---

## App com múltiplos recursos

Crie:

```text
src\br\com\curso\aula204\app\MultiplosRecursosApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.infra.RecursoSimulado;

public class MultiplosRecursosApp {
    public static void main(String[] args) {
        try (
                RecursoSimulado primeiro = new RecursoSimulado("primeiro");
                RecursoSimulado segundo = new RecursoSimulado("segundo")
        ) {
            primeiro.executar();
            segundo.executar();
        }

        System.out.println("Fim.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.MultiplosRecursosApp
```

---

## O que observar

A ordem esperada:

```text
abre primeiro;
abre segundo;
executa;
fecha segundo;
fecha primeiro.
```

Isso é importante quando um recurso depende do outro.

---

# Parte 10 — Exception no close e suppressed exceptions

## O que acontece se o close falha

Às vezes o recurso pode falhar durante o fechamento.

Além disso, o bloco principal também pode falhar.

O Java preserva a exception principal e adiciona a exception do fechamento como:

```text
suppressed exception
```

---

## Recurso que falha ao fechar

Crie:

```text
src\br\com\curso\aula204\infra\RecursoComFalhaNoClose.java
```

Código:

```java
package br.com.curso.aula204.infra;

public class RecursoComFalhaNoClose implements AutoCloseable {
    private final String nome;

    public RecursoComFalhaNoClose(String nome) {
        this.nome = nome;
        System.out.println("Recurso aberto: " + nome);
    }

    public void executar() {
        System.out.println("Executando recurso: " + nome);
        throw new IllegalStateException("Erro durante execução do recurso: " + nome);
    }

    @Override
    public void close() {
        System.out.println("Fechando recurso: " + nome);
        throw new IllegalStateException("Erro ao fechar recurso: " + nome);
    }
}
```

---

## App suppressed

Crie:

```text
src\br\com\curso\aula204\app\SuppressedExceptionApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.infra.RecursoComFalhaNoClose;

public class SuppressedExceptionApp {
    public static void main(String[] args) {
        try (RecursoComFalhaNoClose recurso = new RecursoComFalhaNoClose("arquivo")) {
            recurso.executar();
        } catch (RuntimeException erro) {
            System.out.println("Erro principal: " + erro.getMessage());

            for (Throwable suprimida : erro.getSuppressed()) {
                System.out.println("Erro suprimido: " + suprimida.getMessage());
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.SuppressedExceptionApp
```

---

## O que observar

A exception principal vem da execução.

A exception do `close` fica como suprimida.

Isso evita perder informação.

---

# Parte 11 — Exception própria de infraestrutura

## Criando exception

Crie:

```text
src\br\com\curso\aula204\exception\infra\FalhaLeituraArquivoException.java
```

Código:

```java
package br.com.curso.aula204.exception.infra;

public class FalhaLeituraArquivoException extends RuntimeException {
    public FalhaLeituraArquivoException(String mensagem) {
        super(mensagem);
    }

    public FalhaLeituraArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## LeitorArquivoSeguro

Crie:

```text
src\br\com\curso\aula204\infra\LeitorArquivoSeguro.java
```

Código:

```java
package br.com.curso.aula204.infra;

import br.com.curso.aula204.exception.infra.FalhaLeituraArquivoException;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class LeitorArquivoSeguro {
    public List<String> lerLinhas(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho do arquivo é obrigatório.");
        }

        Path path = Path.of(caminho);
        List<String> linhas = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String linha;

            while ((linha = reader.readLine()) != null) {
                linhas.add(linha);
            }

            return linhas;
        } catch (IOException erro) {
            throw new FalhaLeituraArquivoException("Falha ao ler arquivo: " + caminho, erro);
        }
    }
}
```

---

## App LeitorArquivoSeguro

Crie:

```text
src\br\com\curso\aula204\app\LeitorArquivoSeguroApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.exception.infra.FalhaLeituraArquivoException;
import br.com.curso.aula204.infra.LeitorArquivoSeguro;

import java.util.List;

public class LeitorArquivoSeguroApp {
    public static void main(String[] args) {
        LeitorArquivoSeguro leitor = new LeitorArquivoSeguro();

        try {
            List<String> linhas = leitor.lerLinhas("arquivo-inexistente.txt");
            linhas.forEach(System.out::println);
        } catch (FalhaLeituraArquivoException erro) {
            System.out.println("Erro de infraestrutura: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.LeitorArquivoSeguroApp
```

---

## O que este exemplo mostra

A classe de infraestrutura:

```text
abre recurso;
lê arquivo;
fecha recurso automaticamente;
converte IOException;
preserva causa.
```

O app:

```text
chama;
trata erro em alto nível.
```

---

# Parte 12 — Domínio Produto e importação simples

## Produto

Crie:

```text
src\br\com\curso\aula204\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula204.dominio.produto;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final BigDecimal preco;
    private final int estoque;

    public Produto(String sku, String nome, BigDecimal preco, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.preco = preco;
        this.estoque = estoque;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal preco() {
        return preco;
    }

    public int estoque() {
        return estoque;
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Preço: " + preco
                + " | Estoque: " + estoque;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoImportacaoService

Crie:

```text
src\br\com\curso\aula204\service\ProdutoImportacaoService.java
```

Código:

```java
package br.com.curso.aula204.service;

import br.com.curso.aula204.dominio.produto.Produto;
import br.com.curso.aula204.infra.LeitorArquivoSeguro;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoImportacaoService {
    private final LeitorArquivoSeguro leitorArquivo;

    public ProdutoImportacaoService(LeitorArquivoSeguro leitorArquivo) {
        if (leitorArquivo == null) {
            throw new IllegalArgumentException("Leitor de arquivo é obrigatório.");
        }

        this.leitorArquivo = leitorArquivo;
    }

    public List<Produto> importar(String caminho) {
        List<String> linhas = leitorArquivo.lerLinhas(caminho);

        return linhas.stream()
                .filter(linha -> !linha.isBlank())
                .map(this::converterLinha)
                .toList();
    }

    private Produto converterLinha(String linha) {
        String[] partes = linha.split(";");

        if (partes.length != 4) {
            throw new IllegalArgumentException("Linha inválida para produto: " + linha);
        }

        String sku = partes[0];
        String nome = partes[1];
        BigDecimal preco = new BigDecimal(partes[2]);
        int estoque = Integer.parseInt(partes[3]);

        return new Produto(sku, nome, preco, estoque);
    }
}
```

---

## App Importação

Crie:

```text
src\br\com\curso\aula204\app\ProdutoImportacaoApp.java
```

Código:

```java
package br.com.curso.aula204.app;

import br.com.curso.aula204.dominio.produto.Produto;
import br.com.curso.aula204.exception.infra.FalhaLeituraArquivoException;
import br.com.curso.aula204.infra.LeitorArquivoSeguro;
import br.com.curso.aula204.service.ProdutoImportacaoService;

import java.util.List;

public class ProdutoImportacaoApp {
    public static void main(String[] args) {
        ProdutoImportacaoService service = new ProdutoImportacaoService(new LeitorArquivoSeguro());

        try {
            List<Produto> produtos = service.importar("produtos.txt");
            produtos.forEach(produto -> System.out.println(produto.resumo()));
        } catch (FalhaLeituraArquivoException erro) {
            System.out.println("Falha técnica: " + erro.getMessage());
        } catch (IllegalArgumentException erro) {
            System.out.println("Falha de validação: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula204.app.ProdutoImportacaoApp
```

---

## Para testar com sucesso

Crie um arquivo na raiz da aula:

```text
produtos.txt
```

Conteúdo:

```text
PRD-001;Notebook;3500.00;5
PRD-002;Mouse;80.00;20
PRD-003;Monitor;1200.00;10
```

Execute novamente.

---

## Para testar erro de validação

Altere o arquivo:

```text
PRD-001;Notebook;3500.00;5
PRD-002;Mouse
```

Execute novamente.

O service deve falhar com linha inválida.

---

# Parte 13 — Melhorando erro de parsing

## Problema

Este trecho pode lançar exceptions técnicas ou de formato:

```java
BigDecimal preco = new BigDecimal(partes[2]);
int estoque = Integer.parseInt(partes[3]);
```

Se vier:

```text
abc
```

em preço, falha.

Podemos melhorar a mensagem.

---

## ProdutoImportacaoService melhorado

Atualize o método `converterLinha` para:

```java
private Produto converterLinha(String linha) {
    String[] partes = linha.split(";");

    if (partes.length != 4) {
        throw new IllegalArgumentException("Linha inválida para produto: " + linha);
    }

    try {
        String sku = partes[0];
        String nome = partes[1];
        BigDecimal preco = new BigDecimal(partes[2]);
        int estoque = Integer.parseInt(partes[3]);

        return new Produto(sku, nome, preco, estoque);
    } catch (NumberFormatException erro) {
        throw new IllegalArgumentException("Linha possui número inválido: " + linha, erro);
    }
}
```

---

## O que melhorou

Agora a mensagem contextualiza:

```text
Linha possui número inválido: ...
```

E preserva a causa:

```text
NumberFormatException
```

Regra profissional:

```text
quando converter erro, preserve causa.
```

---

# Parte 14 — Boas práticas

## 1. Capture tipos específicos

Prefira:

```java
catch (FalhaLeituraArquivoException erro)
catch (IllegalArgumentException erro)
```

a:

```java
catch (Exception erro)
```

quando possível.

---

## 2. Não engula exception

Nunca faça:

```java
catch (Exception erro) {
}
```

---

## 3. Não use return no finally

Evite:

```java
finally {
    return valor;
}
```

Isso pode esconder exception.

---

## 4. Use try-with-resources para recurso

Prefira:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    ...
}
```

a fechamento manual.

---

## 5. Preserve causa ao converter

Bom:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo.", erro);
```

---

## 6. Não coloque regra principal no finally

`finally` é para limpeza, não para regra central.

---

## 7. Service não deve imprimir

Service retorna dados ou lança exception.

App, controller ou camada de apresentação decide como mostrar.

---

## 8. Infraestrutura cuida de detalhe técnico

Leitura de arquivo, conexão e recurso externo pertencem à infraestrutura.

Domínio não deve conhecer `BufferedReader`.

---

# Parte 15 — Erros comuns

## 1. Catch genérico cedo demais

Ruim:

```java
catch (Exception erro)
```

no meio da regra, sem necessidade.

---

## 2. Fechar recurso manualmente quando try-with-resources resolve

Evite código verboso e frágil.

---

## 3. Não preservar causa

Ruim:

```java
throw new RuntimeException("Falha.");
```

Melhor:

```java
throw new FalhaLeituraArquivoException("Falha ao ler arquivo.", erro);
```

---

## 4. Usar finally para retorno

Pode esconder erro.

---

## 5. Tratar erro técnico como regra de domínio

Erro de arquivo não é regra de pedido.

Separe camadas.

---

## 6. Misturar parsing, leitura e domínio sem organização

Melhor separar:

```text
infra lê arquivo;
service converte linhas;
domínio valida produto.
```

---

# Parte 16 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula204.app.TryCatchBasicoApp
java -cp out br.com.curso.aula204.app.MultiplosCatchApp
java -cp out br.com.curso.aula204.app.MultiCatchApp
java -cp out br.com.curso.aula204.app.FinallySemErroApp
java -cp out br.com.curso.aula204.app.FinallyComErroTratadoApp
java -cp out br.com.curso.aula204.app.FinallyComErroNaoTratadoApp
java -cp out br.com.curso.aula204.app.FinallyComReturnRuimApp
java -cp out br.com.curso.aula204.app.FechamentoManualApp
java -cp out br.com.curso.aula204.app.TryWithResourcesApp
java -cp out br.com.curso.aula204.app.AutoCloseableApp
java -cp out br.com.curso.aula204.app.AutoCloseableComErroApp
java -cp out br.com.curso.aula204.app.MultiplosRecursosApp
java -cp out br.com.curso.aula204.app.SuppressedExceptionApp
java -cp out br.com.curso.aula204.app.LeitorArquivoSeguroApp
java -cp out br.com.curso.aula204.app.ProdutoImportacaoApp
```

Para cada execução, responda:

```text
houve exception?
qual catch capturou?
finally executou?
havia recurso para fechar?
try-with-resources fechou o recurso?
houve exception suprimida?
a causa original foi preservada?
o erro era técnico ou de validação?
```

---

# Parte 17 — Desafio prático

## Contexto

Você vai criar um importador de atividades operacionais a partir de arquivo.

O objetivo é praticar:

```text
try-with-resources;
exception própria de infraestrutura;
parsing;
validação de domínio;
service sem impressão;
app com tratamento controlado.
```

---

## Exception

Crie:

```text
FalhaImportacaoArquivoException
```

Pacote:

```text
exception/infra
```

Construtores:

```java
FalhaImportacaoArquivoException(String mensagem)
FalhaImportacaoArquivoException(String mensagem, Throwable causa)
```

---

## Entidade Atividade

Crie:

```text
dominio/atividade/Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
boolean obrigatoria;
int minutosEstimados;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
minutosEstimados maior que zero.
```

Métodos:

```java
boolean pendente()
boolean concluida()
String resumo()
```

---

## LeitorArquivoAtividade

Crie:

```text
infra/LeitorArquivoAtividade.java
```

Método:

```java
List<String> lerLinhas(String caminho)
```

Regras:

```text
validar caminho obrigatório;
usar try-with-resources com BufferedReader;
ler linha a linha;
retornar lista de linhas;
converter IOException para FalhaImportacaoArquivoException;
preservar causa.
```

---

## AtividadeImportacaoService

Crie:

```text
service/AtividadeImportacaoService.java
```

Método:

```java
List<Atividade> importar(String caminho)
```

Formato do arquivo:

```text
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS
```

Exemplo:

```text
ATV-001;Confirmar entrega;PENDENTE;true;30
ATV-002;Gerar checklist;CONCLUIDA;false;20
```

Regras:

```text
ignorar linha vazia;
validar quantidade de colunas;
converter boolean;
converter minutos;
se linha inválida, lançar IllegalArgumentException com número da linha;
se número inválido, preservar causa;
service não imprime.
```

---

## App

Crie:

```text
AtividadeImportacaoApp
```

Cenários:

```text
arquivo inexistente;
arquivo válido;
arquivo com linha inválida;
arquivo com minuto inválido.
```

Critérios:

```text
catch específico para FalhaImportacaoArquivoException;
catch para IllegalArgumentException;
mensagens claras;
sem catch vazio;
sem return no finally;
sem fechamento manual desnecessário.
```

---

## Desafio extra

Crie um arquivo:

```text
atividades.txt
```

Conteúdo válido:

```text
ATV-001;Confirmar entrega;PENDENTE;true;30
ATV-002;Gerar checklist;CONCLUIDA;false;20
ATV-003;Validar contato;PENDENTE;true;15
```

Depois gere no app um resumo:

```text
quantidade total;
quantidade pendente;
quantidade concluída;
minutos totais.
```

Use Stream no app ou em um service de resumo separado.

---

# Parte 18 — Debug recomendado

Coloque breakpoints em:

```text
TryCatchBasicoApp
FinallyComErroTratadoApp
FinallyComErroNaoTratadoApp
FinallyComReturnRuimApp
TryWithResourcesApp
RecursoSimulado.close
RecursoComFalhaNoClose.close
LeitorArquivoSeguro.lerLinhas
ProdutoImportacaoService.converterLinha
```

Observe:

```text
ordem de execução do try;
entrada no catch;
execução do finally;
fechamento automático;
ordem de fechamento de múltiplos recursos;
suppressed exceptions;
conversão de IOException;
preservação da causa.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve try?
2. Para que serve catch?
3. Para que serve finally?
4. Por que evitar return no finally?
5. O que é try-with-resources?
6. O que é AutoCloseable?
7. Por que try-with-resources é melhor que fechamento manual?
8. O que é suppressed exception?
9. Por que preservar causa ao converter exception?
10. Qual camada deve conhecer BufferedReader?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar try/catch;
usar múltiplos catch;
usar multi-catch;
usar finally;
explicar quando finally executa;
evitar return no finally;
fechar recurso manualmente quando necessário;
preferir try-with-resources;
entender AutoCloseable;
criar recurso AutoCloseable;
usar múltiplos recursos;
entender suppressed exceptions;
converter IOException para exception própria;
preservar causa original;
separar infraestrutura, service e domínio;
resolver AtividadeImportacaoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-204-try-catch-finally-try-with-resources
git commit -m "Aula 204: try catch finally try with resources"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
try/catch trata falhas; finally finaliza; try-with-resources fecha recursos automaticamente.
```

Você estudou:

```text
try;
catch;
múltiplos catch;
multi-catch;
finally;
return no finally;
fechamento manual;
try-with-resources;
AutoCloseable;
múltiplos recursos;
suppressed exceptions;
exception própria de infraestrutura;
importação simples com leitura de arquivo.
```

Também reforçou a separação profissional:

```text
infraestrutura lida com recurso técnico;
service coordena conversão e fluxo;
domínio valida regra;
app/controller trata apresentação do erro.
```

Na próxima aula, vamos aprofundar boas práticas de modelagem de erros por camada:

```text
domínio;
aplicação;
infraestrutura;
entrada inválida;
não encontrado;
conflito de regra;
falha técnica;
tradução futura para HTTP.
```

Esse passo prepara o caminho para APIs REST com tratamento global de exceptions.
