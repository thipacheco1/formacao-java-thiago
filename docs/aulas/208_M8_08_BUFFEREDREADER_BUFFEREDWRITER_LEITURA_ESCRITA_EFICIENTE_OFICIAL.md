# 208 — M8.08 — BufferedReader e BufferedWriter: leitura e escrita eficiente

## Objetivo da aula

Na aula anterior, você estudou:

```text
Path;
Files;
exists;
isRegularFile;
isDirectory;
createDirectories;
writeString;
readString;
readAllLines;
write;
StandardOpenOption.APPEND;
exception própria de infraestrutura;
ArquivoTextoGateway;
importação;
exportação;
log simples.
```

Agora vamos aprofundar I/O com leitura e escrita mais controlada usando:

```text
BufferedReader;
BufferedWriter;
Files.newBufferedReader;
Files.newBufferedWriter;
try-with-resources.
```

Nesta aula você vai entender por que nem sempre é ideal carregar um arquivo inteiro na memória com:

```java
Files.readAllLines(...)
```

ou:

```java
Files.readString(...)
```

Em arquivos pequenos, tudo bem.

Mas em arquivos maiores, o ideal é processar aos poucos.

Ao final desta aula, você deve conseguir:

```text
entender o que é buffer;
usar BufferedReader;
usar BufferedWriter;
ler arquivo linha a linha;
escrever arquivo linha a linha;
usar try-with-resources;
usar Files.newBufferedReader;
usar Files.newBufferedWriter;
usar StandardOpenOption;
processar arquivos sem carregar tudo em memória;
contar linhas;
filtrar linhas;
importar dados com número de linha;
exportar dados com writer;
converter IOException em exception própria;
separar I/O em infraestrutura;
manter domínio limpo;
usar service para coordenar importação/exportação.
```

---

## Ideia principal

Na aula anterior, você usou:

```java
Files.readAllLines(caminho)
```

Isso carrega todas as linhas em uma lista.

Para arquivos pequenos ou médios, funciona bem.

Mas para arquivos grandes, pode consumir muita memória.

Com `BufferedReader`, você lê uma linha por vez:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String linha;

    while ((linha = reader.readLine()) != null) {
        System.out.println(linha);
    }
}
```

Com `BufferedWriter`, você escreve aos poucos:

```java
try (BufferedWriter writer = Files.newBufferedWriter(path)) {
    writer.write("linha");
    writer.newLine();
}
```

Essa abordagem é mais controlada para processamento de arquivo.

---

## O que é buffer

Buffer é uma área temporária de memória usada para melhorar operações de entrada e saída.

Em vez de acessar o disco a cada caractere, o Java trabalha com blocos de dados.

Isso melhora eficiência.

Pense assim:

```text
sem buffer:
pega um copo de água por vez.

com buffer:
enche uma jarra e serve aos poucos.
```

No Java:

```text
BufferedReader:
lê texto com buffer.

BufferedWriter:
escreve texto com buffer.
```

---

## Por que isso importa em backend

Backends lidam com arquivos em cenários como:

```text
importação CSV grande;
exportação de relatório;
processamento de lote;
integração com legado;
arquivos de retorno;
arquivos de remessa;
logs;
conciliação;
massa de dados;
evidências.
```

Um arquivo de 20 linhas pode ser lido com `readAllLines`.

Um arquivo de 2 milhões de linhas precisa de outro cuidado.

Essa aula prepara você para esse tipo de cenário.

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
não conhece BufferedReader, BufferedWriter, Path ou Files.

Infraestrutura:
abre, lê, escreve e fecha arquivo.

Service/use case:
coordena conversão, validação, importação e exportação.

App/controller futuro:
aciona o fluxo e trata resposta/erro.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-208-bufferedreader-bufferedwriter-leitura-escrita-eficiente
cd labs\m8\aula-208-bufferedreader-bufferedwriter-leitura-escrita-eficiente
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula208
mkdir src\br\com\curso\aula208\app
mkdir src\br\com\curso\aula208\dominio
mkdir src\br\com\curso\aula208\dominio\cliente
mkdir src\br\com\curso\aula208\dominio\produto
mkdir src\br\com\curso\aula208\dominio\atividade
mkdir src\br\com\curso\aula208\exception
mkdir src\br\com\curso\aula208\exception\infra
mkdir src\br\com\curso\aula208\infra
mkdir src\br\com\curso\aula208\service
mkdir src\br\com\curso\aula208\validacao
```

---

# Parte 1 — Criando arquivo base para leitura

Antes de ler com `BufferedReader`, vamos criar um arquivo simples.

## CriarArquivoBaseApp

Crie:

```text
src\br\com\curso\aula208\app\CriarArquivoBaseApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class CriarArquivoBaseApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");
        Path arquivo = diretorio.resolve("clientes.txt");

        List<String> linhas = List.of(
                "Ana Silva;ana@empresa.com;true",
                "Carlos Souza;carlos@empresa.com;true",
                "Maria Oliveira;maria@empresa.com;false",
                "Bruna Alves;bruna@empresa.com;true"
        );

        try {
            Files.createDirectories(diretorio);
            Files.write(arquivo, linhas);

            System.out.println("Arquivo criado: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao criar arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.CriarArquivoBaseApp
```

---

## O que esse app faz

Ele cria:

```text
dados/clientes.txt
```

com linhas no formato:

```text
NOME;EMAIL;ATIVO
```

Esse arquivo será usado nos próximos exemplos.

---

# Parte 2 — Lendo com BufferedReader

## Files.newBufferedReader

Para criar um `BufferedReader` moderno:

```java
BufferedReader reader = Files.newBufferedReader(path);
```

Como `BufferedReader` precisa ser fechado, usamos try-with-resources:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    ...
}
```

---

## LerComBufferedReaderApp

Crie:

```text
src\br\com\curso\aula208\app\LerComBufferedReaderApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LerComBufferedReaderApp {
    public static void main(String[] args) {
        Path arquivo = Path.of("dados", "clientes.txt");

        try (BufferedReader reader = Files.newBufferedReader(arquivo)) {
            String linha;

            while ((linha = reader.readLine()) != null) {
                System.out.println(linha);
            }
        } catch (IOException erro) {
            System.out.println("Falha ao ler arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.LerComBufferedReaderApp
```

---

## Como ler o while

Este trecho:

```java
while ((linha = reader.readLine()) != null) {
    System.out.println(linha);
}
```

significa:

```text
leia uma linha;
se a linha não for null, processe;
repita até acabar o arquivo.
```

Quando `readLine()` retorna `null`, significa:

```text
fim do arquivo.
```

---

## Por que isso é eficiente

Com `readAllLines`, você carrega tudo:

```text
arquivo inteiro -> memória -> lista
```

Com `BufferedReader`, você processa aos poucos:

```text
linha -> processa
linha -> processa
linha -> processa
```

Isso é melhor para arquivos grandes.

---

# Parte 3 — Contando linhas

## ContarLinhasBufferedReaderApp

Crie:

```text
src\br\com\curso\aula208\app\ContarLinhasBufferedReaderApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ContarLinhasBufferedReaderApp {
    public static void main(String[] args) {
        Path arquivo = Path.of("dados", "clientes.txt");

        int quantidade = 0;

        try (BufferedReader reader = Files.newBufferedReader(arquivo)) {
            while (reader.readLine() != null) {
                quantidade++;
            }

            System.out.println("Quantidade de linhas: " + quantidade);
        } catch (IOException erro) {
            System.out.println("Falha ao contar linhas: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.ContarLinhasBufferedReaderApp
```

---

## O que observar

Você não precisa guardar as linhas.

Você apenas conta.

Isso é ótimo quando a regra não exige armazenar tudo.

---

# Parte 4 — Processando com número de linha

## Por que número de linha importa

Em importações, número de linha é essencial.

Exemplo:

```text
Linha 7: e-mail inválido.
Linha 12: quantidade inválida.
Linha 25: coluna obrigatória ausente.
```

Com `BufferedReader`, podemos controlar isso facilmente.

---

## LerComNumeroLinhaApp

Crie:

```text
src\br\com\curso\aula208\app\LerComNumeroLinhaApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LerComNumeroLinhaApp {
    public static void main(String[] args) {
        Path arquivo = Path.of("dados", "clientes.txt");

        try (BufferedReader reader = Files.newBufferedReader(arquivo)) {
            String linha;
            int numeroLinha = 0;

            while ((linha = reader.readLine()) != null) {
                numeroLinha++;

                System.out.println("Linha " + numeroLinha + ": " + linha);
            }
        } catch (IOException erro) {
            System.out.println("Falha ao ler arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.LerComNumeroLinhaApp
```

---

# Parte 5 — Escrevendo com BufferedWriter

## Files.newBufferedWriter

Para escrever usando buffer:

```java
BufferedWriter writer = Files.newBufferedWriter(path);
```

Use com try-with-resources:

```java
try (BufferedWriter writer = Files.newBufferedWriter(path)) {
    writer.write("texto");
    writer.newLine();
}
```

---

## EscreverComBufferedWriterApp

Crie:

```text
src\br\com\curso\aula208\app\EscreverComBufferedWriterApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class EscreverComBufferedWriterApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");
        Path arquivo = diretorio.resolve("produtos-writer.txt");

        try {
            Files.createDirectories(diretorio);

            try (BufferedWriter writer = Files.newBufferedWriter(arquivo)) {
                writer.write("PRD-001;Notebook;3500.00;5");
                writer.newLine();

                writer.write("PRD-002;Mouse;80.00;20");
                writer.newLine();

                writer.write("PRD-003;Monitor;1200.00;10");
                writer.newLine();
            }

            System.out.println("Arquivo escrito: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao escrever arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.EscreverComBufferedWriterApp
```

---

## writer.write e writer.newLine

Use:

```java
writer.write(...)
```

para escrever texto.

Use:

```java
writer.newLine()
```

para quebrar linha de forma portátil.

Evite:

```java
"\n"
```

quando quiser portabilidade total.

---

# Parte 6 — Append com BufferedWriter

## StandardOpenOption com writer

Você também pode usar `StandardOpenOption` com `Files.newBufferedWriter`.

Exemplo:

```java
Files.newBufferedWriter(
        path,
        StandardOpenOption.CREATE,
        StandardOpenOption.APPEND
)
```

---

## AppendBufferedWriterApp

Crie:

```text
src\br\com\curso\aula208\app\AppendBufferedWriterApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;

public class AppendBufferedWriterApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados", "logs");
        Path arquivo = diretorio.resolve("eventos-writer.log");

        try {
            Files.createDirectories(diretorio);

            try (BufferedWriter writer = Files.newBufferedWriter(
                    arquivo,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            )) {
                writer.write(LocalDateTime.now() + " | Aplicação executada.");
                writer.newLine();
            }

            System.out.println("Evento registrado: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao registrar evento: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.AppendBufferedWriterApp
```

---

## O que observar

Execute mais de uma vez.

O arquivo deve acumular linhas.

---

# Parte 7 — Exception própria de infraestrutura

## FalhaArquivoException

Crie:

```text
src\br\com\curso\aula208\exception\infra\FalhaArquivoException.java
```

Código:

```java
package br.com.curso.aula208.exception.infra;

public class FalhaArquivoException extends RuntimeException {
    public FalhaArquivoException(String mensagem) {
        super(mensagem);
    }

    public FalhaArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Por que usar

Em infraestrutura, não queremos espalhar `IOException` para todas as camadas.

Queremos converter para uma exception da aplicação preservando a causa:

```java
throw new FalhaArquivoException("Falha ao ler arquivo: " + caminho, erro);
```

---

# Parte 8 — Gateway com BufferedReader e BufferedWriter

## ArquivoBufferGateway

Crie:

```text
src\br\com\curso\aula208\infra\ArquivoBufferGateway.java
```

Código:

```java
package br.com.curso.aula208.infra;

import br.com.curso.aula208.exception.infra.FalhaArquivoException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class ArquivoBufferGateway {
    public void processarLinhas(String caminho, BiConsumer<Integer, String> consumidorLinha) {
        validarCaminho(caminho);

        if (consumidorLinha == null) {
            throw new IllegalArgumentException("Consumidor de linha é obrigatório.");
        }

        Path path = Path.of(caminho);

        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String linha;
            int numeroLinha = 0;

            while ((linha = reader.readLine()) != null) {
                numeroLinha++;
                consumidorLinha.accept(numeroLinha, linha);
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao processar arquivo: " + caminho, erro);
        }
    }

    public void escrever(String caminho, Consumer<BufferedWriter> escrita) {
        validarCaminho(caminho);

        if (escrita == null) {
            throw new IllegalArgumentException("Ação de escrita é obrigatória.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                escrita.accept(writer);
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao escrever arquivo: " + caminho, erro);
        }
    }

    public void adicionarLinha(String caminho, String linha) {
        validarCaminho(caminho);

        if (linha == null) {
            throw new IllegalArgumentException("Linha é obrigatória.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(
                    path,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            )) {
                writer.write(linha);
                writer.newLine();
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao adicionar linha no arquivo: " + caminho, erro);
        }
    }

    private void validarCaminho(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }
    }
}
```

---

## Observação importante

Esse gateway usa:

```java
BiConsumer<Integer, String>
```

para entregar:

```text
número da linha;
conteúdo da linha.
```

Isso permite processar arquivo sem carregar tudo em lista.

---

## Cuidado com IOException dentro do Consumer

No método:

```java
public void escrever(String caminho, Consumer<BufferedWriter> escrita)
```

o `Consumer` não permite lançar `IOException` diretamente.

Por isso, para escrita mais complexa, muitas vezes preferimos não expor o `BufferedWriter` em lambda.

Mais adiante vamos melhorar isso com interfaces próprias ou métodos específicos.

Por enquanto, use esse método para exemplos simples ou prefira métodos específicos no service.

---

# Parte 9 — Domínio Cliente

## Cliente

Crie:

```text
src\br\com\curso\aula208\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula208.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;

    public Cliente(String nome, String email, boolean ativo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail é inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return nome + " | " + email + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

# Parte 10 — Resultado de importação

## ErroLinha

Crie:

```text
src\br\com\curso\aula208\validacao\ErroLinha.java
```

Código:

```java
package br.com.curso.aula208.validacao;

public class ErroLinha {
    private final int numeroLinha;
    private final String mensagem;

    public ErroLinha(int numeroLinha, String mensagem) {
        if (numeroLinha <= 0) {
            throw new IllegalArgumentException("Número da linha deve ser maior que zero.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.numeroLinha = numeroLinha;
        this.mensagem = mensagem;
    }

    public int numeroLinha() {
        return numeroLinha;
    }

    public String mensagem() {
        return mensagem;
    }

    public String resumo() {
        return "Linha " + numeroLinha + ": " + mensagem;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ResultadoImportacao

Crie:

```text
src\br\com\curso\aula208\validacao\ResultadoImportacao.java
```

Código:

```java
package br.com.curso.aula208.validacao;

import java.util.ArrayList;
import java.util.List;

public class ResultadoImportacao<T> {
    private final List<T> itensValidos = new ArrayList<>();
    private final List<ErroLinha> erros = new ArrayList<>();

    public void adicionarItemValido(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item válido é obrigatório.");
        }

        itensValidos.add(item);
    }

    public void adicionarErro(int numeroLinha, String mensagem) {
        erros.add(new ErroLinha(numeroLinha, mensagem));
    }

    public int quantidadeValidos() {
        return itensValidos.size();
    }

    public int quantidadeErros() {
        return erros.size();
    }

    public boolean possuiErros() {
        return !erros.isEmpty();
    }

    public List<T> itensValidos() {
        return List.copyOf(itensValidos);
    }

    public List<ErroLinha> erros() {
        return List.copyOf(erros);
    }

    public String resumo() {
        return "Válidos: " + quantidadeValidos() + " | Erros: " + quantidadeErros();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

# Parte 11 — Importação de clientes com leitura linha a linha

## ClienteImportacaoBufferedService

Crie:

```text
src\br\com\curso\aula208\service\ClienteImportacaoBufferedService.java
```

Código:

```java
package br.com.curso.aula208.service;

import br.com.curso.aula208.dominio.cliente.Cliente;
import br.com.curso.aula208.infra.ArquivoBufferGateway;
import br.com.curso.aula208.validacao.ResultadoImportacao;

public class ClienteImportacaoBufferedService {
    private final ArquivoBufferGateway arquivoGateway;

    public ClienteImportacaoBufferedService(ArquivoBufferGateway arquivoGateway) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
    }

    public ResultadoImportacao<Cliente> importar(String caminho) {
        ResultadoImportacao<Cliente> resultado = new ResultadoImportacao<>();

        arquivoGateway.processarLinhas(caminho, (numeroLinha, linha) -> {
            if (linha == null || linha.isBlank()) {
                return;
            }

            try {
                Cliente cliente = converterLinha(linha);
                resultado.adicionarItemValido(cliente);
            } catch (IllegalArgumentException erro) {
                resultado.adicionarErro(numeroLinha, erro.getMessage());
            }
        });

        return resultado;
    }

    private Cliente converterLinha(String linha) {
        String[] partes = linha.split(";");

        if (partes.length != 3) {
            throw new IllegalArgumentException("Linha deve possuir 3 colunas: NOME;EMAIL;ATIVO");
        }

        String nome = partes[0];
        String email = partes[1];
        boolean ativo = Boolean.parseBoolean(partes[2]);

        return new Cliente(nome, email, ativo);
    }
}
```

---

## App importação buffered

Crie:

```text
src\br\com\curso\aula208\app\ClienteImportacaoBufferedApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import br.com.curso.aula208.dominio.cliente.Cliente;
import br.com.curso.aula208.infra.ArquivoBufferGateway;
import br.com.curso.aula208.service.ClienteImportacaoBufferedService;
import br.com.curso.aula208.validacao.ResultadoImportacao;

public class ClienteImportacaoBufferedApp {
    public static void main(String[] args) {
        ClienteImportacaoBufferedService service = new ClienteImportacaoBufferedService(
                new ArquivoBufferGateway()
        );

        ResultadoImportacao<Cliente> resultado = service.importar("dados/clientes.txt");

        System.out.println(resultado.resumo());

        System.out.println();
        System.out.println("Clientes válidos:");
        resultado.itensValidos()
                .forEach(cliente -> System.out.println(" - " + cliente.resumo()));

        System.out.println();
        System.out.println("Erros:");
        resultado.erros()
                .forEach(erro -> System.out.println(" - " + erro.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.ClienteImportacaoBufferedApp
```

---

## Fluxo esperado

Execute antes:

```text
CriarArquivoBaseApp
```

Depois execute:

```text
ClienteImportacaoBufferedApp
```

---

# Parte 12 — Exportação com BufferedWriter

## ClienteExportacaoBufferedService

Crie:

```text
src\br\com\curso\aula208\service\ClienteExportacaoBufferedService.java
```

Código:

```java
package br.com.curso.aula208.service;

import br.com.curso.aula208.dominio.cliente.Cliente;
import br.com.curso.aula208.exception.infra.FalhaArquivoException;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ClienteExportacaoBufferedService {
    public void exportar(String caminho, List<Cliente> clientes) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        if (clientes == null) {
            throw new IllegalArgumentException("Clientes são obrigatórios.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                for (Cliente cliente : clientes) {
                    writer.write(converterParaLinha(cliente));
                    writer.newLine();
                }
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao exportar clientes para: " + caminho, erro);
        }
    }

    private String converterParaLinha(Cliente cliente) {
        return cliente.nome()
                + ";"
                + cliente.email()
                + ";"
                + cliente.ativo();
    }
}
```

---

## App exportação buffered

Crie:

```text
src\br\com\curso\aula208\app\ClienteExportacaoBufferedApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import br.com.curso.aula208.dominio.cliente.Cliente;
import br.com.curso.aula208.service.ClienteExportacaoBufferedService;

import java.util.List;

public class ClienteExportacaoBufferedApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente("Ana Silva", "ana@empresa.com", true),
                new Cliente("Carlos Souza", "carlos@empresa.com", true),
                new Cliente("Maria Oliveira", "maria@empresa.com", false)
        );

        ClienteExportacaoBufferedService service = new ClienteExportacaoBufferedService();

        service.exportar("dados/export/clientes-buffered.txt", clientes);

        System.out.println("Clientes exportados.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.ClienteExportacaoBufferedApp
```

---

## Observação arquitetural

Neste exemplo, o service ficou conhecendo `Files` e `BufferedWriter`.

Isso é aceitável como exercício didático.

Mas em uma arquitetura mais limpa, essa escrita poderia ir para um gateway de infraestrutura.

O ponto profissional é saber decidir:

```text
se é simples e local, pode estar no service em aula;
se vai crescer, reaproveitar ou testar, mova para infraestrutura.
```

---

# Parte 13 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula208\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula208.dominio.produto;

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

# Parte 14 — Exportação eficiente de muitos produtos

## ProdutoExportacaoBufferedService

Crie:

```text
src\br\com\curso\aula208\service\ProdutoExportacaoBufferedService.java
```

Código:

```java
package br.com.curso.aula208.service;

import br.com.curso.aula208.dominio.produto.Produto;
import br.com.curso.aula208.exception.infra.FalhaArquivoException;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ProdutoExportacaoBufferedService {
    public void exportar(String caminho, List<Produto> produtos) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                for (Produto produto : produtos) {
                    writer.write(converterParaLinha(produto));
                    writer.newLine();
                }
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao exportar produtos para: " + caminho, erro);
        }
    }

    private String converterParaLinha(Produto produto) {
        return produto.sku()
                + ";"
                + produto.nome()
                + ";"
                + produto.preco()
                + ";"
                + produto.estoque();
    }
}
```

---

## App produtos buffered

Crie:

```text
src\br\com\curso\aula208\app\ProdutoExportacaoBufferedApp.java
```

Código:

```java
package br.com.curso.aula208.app;

import br.com.curso.aula208.dominio.produto.Produto;
import br.com.curso.aula208.service.ProdutoExportacaoBufferedService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProdutoExportacaoBufferedApp {
    public static void main(String[] args) {
        List<Produto> produtos = new ArrayList<>();

        for (int i = 1; i <= 1000; i++) {
            produtos.add(new Produto(
                    "PRD-" + i,
                    "Produto " + i,
                    new BigDecimal("10.00"),
                    i
            ));
        }

        ProdutoExportacaoBufferedService service = new ProdutoExportacaoBufferedService();

        service.exportar("dados/export/produtos-1000.txt", produtos);

        System.out.println("Produtos exportados: " + produtos.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula208.app.ProdutoExportacaoBufferedApp
```

---

## Por que for aqui faz sentido

Para escrever linha a linha com `BufferedWriter`, o `for` é simples, direto e eficiente.

Não há necessidade de transformar isso em Stream.

Regra do curso:

```text
Stream e for são ferramentas.
Use o que deixa o código mais claro.
```

---

# Parte 15 — Comparação: readAllLines vs BufferedReader

## readAllLines

Características:

```text
simples;
carrega tudo na memória;
bom para arquivos pequenos;
retorna List<String>;
fácil de usar com Stream.
```

Exemplo:

```java
List<String> linhas = Files.readAllLines(path);
```

---

## BufferedReader

Características:

```text
mais controlado;
processa linha a linha;
melhor para arquivos grandes;
não precisa guardar tudo;
exige loop;
combina bem com número de linha e processamento incremental.
```

Exemplo:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String linha;

    while ((linha = reader.readLine()) != null) {
        processar(linha);
    }
}
```

---

## Matriz de decisão

```text
Arquivo pequeno:
readString ou readAllLines.

Arquivo médio com processamento simples:
readAllLines pode ser suficiente.

Arquivo grande:
BufferedReader.

Precisa processar e descartar:
BufferedReader.

Precisa de número de linha:
BufferedReader ou for com readAllLines.

Precisa exportar muitas linhas:
BufferedWriter.

Precisa append simples:
Files.writeString com APPEND ou BufferedWriter com APPEND.
```

---

# Parte 16 — Boas práticas

## 1. Use try-with-resources

Sempre que abrir reader ou writer:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    ...
}
```

---

## 2. Não esqueça newLine

Ao escrever linhas:

```java
writer.write(linha);
writer.newLine();
```

---

## 3. Preserve causa

Ao converter `IOException`:

```java
throw new FalhaArquivoException("Falha ao processar arquivo: " + caminho, erro);
```

---

## 4. Não carregue arquivo grande inteiro

Evite `readAllLines` para arquivo muito grande.

---

## 5. Use for quando o fluxo exigir controle

Para número de linha, try/catch por item, contadores e escrita com writer, `for` ou `while` podem ser melhores.

---

## 6. Não coloque I/O no domínio

Domínio não deve conhecer arquivo.

---

## 7. Separe infraestrutura

Se leitura/escrita for reaproveitada, crie gateway.

---

## 8. Mensagem de erro deve conter caminho

Exemplo:

```text
Falha ao exportar produtos para: dados/export/produtos.txt
```

---

# Parte 17 — Erros comuns

## 1. Não fechar reader/writer

Use try-with-resources.

---

## 2. Usar readAllLines para arquivo gigante

Pode estourar memória.

---

## 3. Usar Stream para tudo

Nem sempre melhora.

Leitura linha a linha combina bem com `while`.

---

## 4. Capturar IOException e ignorar

Nunca faça catch vazio.

---

## 5. Não preservar causa

Não perca a exception original.

---

## 6. Misturar validação de domínio com leitura técnica

Leia arquivo em infraestrutura.

Valide regra no domínio/service.

---

# Parte 18 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula208.app.CriarArquivoBaseApp
java -cp out br.com.curso.aula208.app.LerComBufferedReaderApp
java -cp out br.com.curso.aula208.app.ContarLinhasBufferedReaderApp
java -cp out br.com.curso.aula208.app.LerComNumeroLinhaApp
java -cp out br.com.curso.aula208.app.EscreverComBufferedWriterApp
java -cp out br.com.curso.aula208.app.AppendBufferedWriterApp
java -cp out br.com.curso.aula208.app.ClienteImportacaoBufferedApp
java -cp out br.com.curso.aula208.app.ClienteExportacaoBufferedApp
java -cp out br.com.curso.aula208.app.ProdutoExportacaoBufferedApp
```

Para cada execução, responda:

```text
houve leitura ou escrita?
usou reader ou writer?
o recurso foi fechado automaticamente?
leu tudo em memória ou linha a linha?
houve número de linha?
houve append?
a exception técnica foi convertida?
o domínio ficou limpo?
```

---

# Parte 19 — Desafio prático

## Contexto

Você vai criar uma importação de atividades usando `BufferedReader` e uma exportação de relatório usando `BufferedWriter`.

O objetivo é praticar:

```text
leitura linha a linha;
número da linha;
resultado de importação;
escrita linha a linha;
try-with-resources;
exception de infraestrutura;
domínio protegido.
```

---

## Entidade Atividade

Crie:

```text
src\br\com\curso\aula208\dominio\atividade\Atividade.java
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
status permitido: PENDENTE ou CONCLUIDA;
minutosEstimados maior que zero.
```

Métodos:

```java
boolean pendente()
boolean concluida()
String resumo()
```

---

## AtividadeImportacaoBufferedService

Crie:

```text
src\br\com\curso\aula208\service\AtividadeImportacaoBufferedService.java
```

Método:

```java
ResultadoImportacao<Atividade> importar(String caminho)
```

Formato:

```text
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS
```

Regras:

```text
usar BufferedReader;
usar try-with-resources;
processar linha a linha;
ignorar linha vazia;
manter número da linha;
se linha inválida, adicionar erro;
se parsing inválido, adicionar erro;
não parar lote por erro de linha;
converter IOException para FalhaArquivoException;
preservar causa.
```

---

## AtividadeRelatorioExportacaoService

Crie:

```text
src\br\com\curso\aula208\service\AtividadeRelatorioExportacaoService.java
```

Método:

```java
void exportarResumo(String caminho, List<Atividade> atividades)
```

Regras:

```text
usar BufferedWriter;
usar try-with-resources;
criar diretório se necessário;
escrever cabeçalho:
CODIGO;STATUS;OBRIGATORIA;MINUTOS
escrever uma linha por atividade;
converter IOException para FalhaArquivoException;
preservar causa.
```

---

## App

Crie:

```text
AtividadeBufferedImportacaoExportacaoApp
```

Fluxo:

```text
criar manualmente arquivo dados/atividades/entrada.txt;
importar atividades;
imprimir quantidade de válidas e erros;
exportar resumo das válidas para dados/atividades/resumo.txt.
```

Conteúdo de entrada sugerido:

```text
ATV-001;Confirmar entrega;PENDENTE;true;30
ATV-002;Gerar checklist;CONCLUIDA;false;20
ATV-003;Validar contato;PENDENTE;true;15
ATV-004;Linha ruim
ATV-005;Atividade inválida;PENDENTE;true;abc
```

Critérios:

```text
não carregar tudo com readAllLines;
usar BufferedReader;
usar BufferedWriter;
não imprimir dentro do service;
não engolir IOException;
preservar causa;
entidade valida regra;
resultado acumula erros por linha.
```

---

# Parte 20 — Desafio extra

## Relatório com contadores

No `AtividadeRelatorioExportacaoService`, adicione no final do arquivo:

```text
TOTAL;quantidade
PENDENTES;quantidade
CONCLUIDAS;quantidade
MINUTOS_TOTAL;valor
```

Pode usar Stream para calcular os totais antes de escrever.

Exemplo:

```java
long pendentes = atividades.stream()
        .filter(Atividade::pendente)
        .count();
```

Objetivo:

```text
misturar I/O eficiente com Streams para agregação em memória.
```

---

# Parte 21 — Debug recomendado

Coloque breakpoints em:

```text
LerComBufferedReaderApp
ContarLinhasBufferedReaderApp
LerComNumeroLinhaApp
EscreverComBufferedWriterApp
AppendBufferedWriterApp
ArquivoBufferGateway.processarLinhas
ClienteImportacaoBufferedService.importar
ClienteImportacaoBufferedService.converterLinha
ClienteExportacaoBufferedService.exportar
ProdutoExportacaoBufferedService.exportar
```

Observe:

```text
quando o reader é aberto;
quando readLine retorna null;
quando o writer escreve;
quando newLine é chamado;
quando o recurso fecha;
quando IOException é convertida;
quando erro de linha vira ResultadoImportacao;
quando for/while é mais claro que Stream.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é BufferedReader?
2. O que é BufferedWriter?
3. Por que usar try-with-resources?
4. Qual diferença entre readAllLines e BufferedReader?
5. Quando BufferedReader é melhor?
6. Quando BufferedWriter é melhor?
7. Por que writer.newLine é melhor que "\n"?
8. Por que preservar causa ao converter IOException?
9. Por que domínio não deve conhecer reader/writer?
10. Quando for/while é melhor que Stream?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar BufferedReader;
usar BufferedWriter;
usar Files.newBufferedReader;
usar Files.newBufferedWriter;
usar try-with-resources;
ler arquivo linha a linha;
contar linhas;
processar número de linha;
escrever arquivo linha a linha;
fazer append com writer;
converter IOException em exception própria;
preservar causa;
processar importação sem carregar tudo em memória;
exportar relatório com writer;
manter domínio limpo;
resolver AtividadeBufferedImportacaoExportacaoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-208-bufferedreader-bufferedwriter-leitura-escrita-eficiente
git commit -m "Aula 208: bufferedreader bufferedwriter leitura escrita eficiente"
git status
```

Se aparecer arquivo `.class`, pasta `out` ou arquivos grandes gerados, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
BufferedReader lê aos poucos; BufferedWriter escreve aos poucos.
```

Você estudou:

```text
buffer;
BufferedReader;
BufferedWriter;
Files.newBufferedReader;
Files.newBufferedWriter;
readLine;
write;
newLine;
try-with-resources;
append;
processamento linha a linha;
número de linha;
ResultadoImportacao;
exception de infraestrutura;
exportação eficiente.
```

Também reforçou uma decisão profissional:

```text
para arquivo pequeno, readAllLines pode bastar;
para arquivo grande ou processamento incremental, BufferedReader é mais adequado.
```

Na próxima aula, vamos estudar:

```text
CSV manual, parsing robusto, separadores, cabeçalho, linhas inválidas e relatório de importação.
```

Esse assunto aproxima o módulo de cenários reais de importação em sistemas backend.
