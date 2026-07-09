# 207 — M8.07 — I/O com Path e Files: leitura, escrita e manipulação de arquivos

## Objetivo da aula

Na aula anterior, você estudou:

```text
Resultado<T>;
ResultadoValidacao;
ResultadoImportacao;
falha rápida;
acúmulo de erros;
validação de request;
importação controlada;
exception em domínio;
Resultado em fluxo de tentativa;
exception em fluxo obrigatório.
```

Agora vamos entrar em um bloco extremamente prático para backend:

```text
I/O
```

I/O significa:

```text
Input/Output
Entrada/Saída
```

No contexto desta aula, vamos focar em arquivos.

Você vai estudar:

```text
Path;
Files;
criação de diretórios;
verificação de existência;
leitura de arquivo;
escrita de arquivo;
append em arquivo;
leitura linha a linha;
tratamento de IOException;
conversão de erro técnico;
separação entre infraestrutura e service;
importação e exportação simples.
```

Ao final desta aula, você deve conseguir:

```text
criar Path com Path.of;
verificar se arquivo existe;
verificar se caminho é arquivo;
verificar se caminho é diretório;
criar diretórios;
escrever texto em arquivo;
ler texto de arquivo;
ler linhas de arquivo;
adicionar conteúdo ao final de arquivo;
usar StandardOpenOption;
tratar IOException;
converter IOException em exception própria;
separar código de arquivo em infraestrutura;
usar service para coordenar importação/exportação;
aplicar boas práticas de I/O.
```

---

## Ideia principal

Java moderno usa principalmente:

```java
Path
```

e:

```java
Files
```

para lidar com arquivos.

Exemplo:

```java
Path caminho = Path.of("dados", "clientes.txt");

Files.writeString(caminho, "Ana;ana@empresa.com");
```

Para ler:

```java
String conteudo = Files.readString(caminho);
```

Para ler linhas:

```java
List<String> linhas = Files.readAllLines(caminho);
```

Essas operações podem lançar:

```java
IOException
```

Então você precisa tratar ou propagar.

---

## Por que isso importa no backend

Backends lidam com arquivos em vários cenários:

```text
importação CSV;
exportação de relatório;
upload de arquivo;
download de arquivo;
geração de log técnico;
leitura de configuração;
processamento de lote;
integração com sistemas legados;
arquivos temporários;
comprovantes;
evidências;
relatórios.
```

Mesmo quando você usar banco, API ou mensageria, arquivos ainda aparecem.

Por isso I/O é base importante.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de arquivos:

```text
Entidade:
não conhece Path, Files, CSV ou diretório.

Infraestrutura:
lê e escreve arquivos.

Service/use case:
coordena importação, exportação e validações.

Controller futuro:
recebe upload/download e chama o service.
```

Não coloque `Files.readAllLines` dentro da entidade.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-207-io-path-files-leitura-escrita-arquivos
cd labs\m8\aula-207-io-path-files-leitura-escrita-arquivos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula207
mkdir src\br\com\curso\aula207\app
mkdir src\br\com\curso\aula207\dominio
mkdir src\br\com\curso\aula207\dominio\cliente
mkdir src\br\com\curso\aula207\dominio\produto
mkdir src\br\com\curso\aula207\exception
mkdir src\br\com\curso\aula207\exception\infra
mkdir src\br\com\curso\aula207\infra
mkdir src\br\com\curso\aula207\service
```

---

# Parte 1 — Path

## O que é Path

`Path` representa um caminho no sistema de arquivos.

Exemplos:

```text
clientes.txt
dados/produtos.txt
C:\temp\arquivo.txt
/home/app/dados/importacao.csv
```

No Java moderno, usamos:

```java
Path.of(...)
```

---

## App Path básico

Crie:

```text
src\br\com\curso\aula207\app\PathBasicoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.nio.file.Path;

public class PathBasicoApp {
    public static void main(String[] args) {
        Path caminhoArquivo = Path.of("dados", "clientes.txt");

        System.out.println("Caminho: " + caminhoArquivo);
        System.out.println("Arquivo: " + caminhoArquivo.getFileName());
        System.out.println("Pai: " + caminhoArquivo.getParent());
        System.out.println("Absoluto: " + caminhoArquivo.toAbsolutePath());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.PathBasicoApp
```

---

## O que observar

`Path.of("dados", "clientes.txt")` monta um caminho portátil.

Evite montar caminho assim:

```java
"dados/clientes.txt"
```

ou:

```java
"dados\\clientes.txt"
```

Prefira:

```java
Path.of("dados", "clientes.txt")
```

O Java ajusta separadores conforme sistema operacional.

---

# Parte 2 — Files.exists, isRegularFile e isDirectory

## Verificando existência

A classe `Files` possui métodos úteis:

```java
Files.exists(path)
Files.isRegularFile(path)
Files.isDirectory(path)
```

---

## App verificando caminho

Crie:

```text
src\br\com\curso\aula207\app\FilesVerificacaoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.nio.file.Files;
import java.nio.file.Path;

public class FilesVerificacaoApp {
    public static void main(String[] args) {
        Path caminho = Path.of("dados", "clientes.txt");

        System.out.println("Caminho: " + caminho.toAbsolutePath());
        System.out.println("Existe? " + Files.exists(caminho));
        System.out.println("É arquivo? " + Files.isRegularFile(caminho));
        System.out.println("É diretório? " + Files.isDirectory(caminho));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.FilesVerificacaoApp
```

---

## Observação

Se o arquivo ainda não existe, o resultado será:

```text
Existe? false
É arquivo? false
É diretório? false
```

Isso não é exception.

É apenas verificação.

---

# Parte 3 — Criando diretórios

## createDirectories

Antes de escrever em:

```text
dados/clientes.txt
```

a pasta:

```text
dados
```

precisa existir.

Use:

```java
Files.createDirectories(Path.of("dados"));
```

Esse método cria a pasta se não existir.

Se já existir, não falha.

---

## App criando diretório

Crie:

```text
src\br\com\curso\aula207\app\CriarDiretorioApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CriarDiretorioApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");

        try {
            Files.createDirectories(diretorio);
            System.out.println("Diretório pronto: " + diretorio.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao criar diretório: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.CriarDiretorioApp
```

---

## Por que createDirectories e não createDirectory

Existe:

```java
Files.createDirectory(...)
```

e:

```java
Files.createDirectories(...)
```

Diferença:

```text
createDirectory:
cria apenas um diretório e falha se o pai não existir.

createDirectories:
cria diretórios intermediários se necessário.
```

Em backend, `createDirectories` costuma ser mais prático para preparar estrutura.

---

# Parte 4 — Escrevendo arquivo com writeString

## Files.writeString

Para escrever texto simples:

```java
Files.writeString(caminho, conteudo);
```

Se o arquivo não existir, ele é criado.

Se existir, por padrão, pode sobrescrever o conteúdo.

---

## App escrevendo arquivo

Crie:

```text
src\br\com\curso\aula207\app\EscreverArquivoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class EscreverArquivoApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");
        Path arquivo = diretorio.resolve("clientes.txt");

        try {
            Files.createDirectories(diretorio);

            String conteudo = """
                    Ana Silva;ana@empresa.com
                    Carlos Souza;carlos@empresa.com
                    Maria Oliveira;maria@empresa.com
                    """;

            Files.writeString(arquivo, conteudo);

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
java -cp out br.com.curso.aula207.app.EscreverArquivoApp
```

---

## O que observar

Depois de executar, verifique se existe:

```text
dados/clientes.txt
```

No IntelliJ, atualize a árvore do projeto se necessário.

---

# Parte 5 — Lendo arquivo com readString

## Files.readString

Para ler o arquivo inteiro como texto:

```java
String conteudo = Files.readString(caminho);
```

---

## App lendo arquivo

Crie:

```text
src\br\com\curso\aula207\app\LerArquivoStringApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LerArquivoStringApp {
    public static void main(String[] args) {
        Path arquivo = Path.of("dados", "clientes.txt");

        try {
            String conteudo = Files.readString(arquivo);

            System.out.println("Conteúdo:");
            System.out.println(conteudo);
        } catch (IOException erro) {
            System.out.println("Falha ao ler arquivo: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.LerArquivoStringApp
```

---

## Quando usar readString

Use quando:

```text
arquivo é pequeno;
você precisa do conteúdo inteiro;
configuração simples;
template pequeno;
texto controlado.
```

Evite para arquivos gigantes.

Para arquivos grandes, prefira leitura linha a linha.

---

# Parte 6 — Lendo linhas com readAllLines

## Files.readAllLines

Para ler arquivo como lista de linhas:

```java
List<String> linhas = Files.readAllLines(caminho);
```

---

## App lendo linhas

Crie:

```text
src\br\com\curso\aula207\app\LerArquivoLinhasApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class LerArquivoLinhasApp {
    public static void main(String[] args) {
        Path arquivo = Path.of("dados", "clientes.txt");

        try {
            List<String> linhas = Files.readAllLines(arquivo);

            for (int indice = 0; indice < linhas.size(); indice++) {
                int numeroLinha = indice + 1;
                String linha = linhas.get(indice);

                System.out.println(numeroLinha + ": " + linha);
            }
        } catch (IOException erro) {
            System.out.println("Falha ao ler linhas: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.LerArquivoLinhasApp
```

---

## Quando usar readAllLines

Use quando:

```text
arquivo é pequeno ou médio;
você precisa processar linha a linha;
importação simples;
validação com número de linha.
```

Para arquivos muito grandes, vamos estudar leitura com stream/reader com mais cuidado.

---

# Parte 7 — Escrevendo lista de linhas

## Files.write

Para escrever lista de linhas:

```java
Files.write(caminho, linhas);
```

---

## App escrevendo linhas

Crie:

```text
src\br\com\curso\aula207\app\EscreverLinhasApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class EscreverLinhasApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");
        Path arquivo = diretorio.resolve("produtos.txt");

        List<String> linhas = List.of(
                "PRD-001;Notebook;3500.00;5",
                "PRD-002;Mouse;80.00;20",
                "PRD-003;Monitor;1200.00;10"
        );

        try {
            Files.createDirectories(diretorio);
            Files.write(arquivo, linhas);

            System.out.println("Arquivo de produtos escrito: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao escrever produtos: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.EscreverLinhasApp
```

---

# Parte 8 — Append em arquivo

## StandardOpenOption.APPEND

Para adicionar conteúdo ao final do arquivo:

```java
Files.writeString(
        arquivo,
        "nova linha",
        StandardOpenOption.CREATE,
        StandardOpenOption.APPEND
);
```

Opções:

```text
CREATE:
cria o arquivo se não existir.

APPEND:
adiciona no final.

TRUNCATE_EXISTING:
sobrescreve limpando o conteúdo anterior.

WRITE:
abre para escrita.
```

---

## App com append

Crie:

```text
src\br\com\curso\aula207\app\AppendArquivoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class AppendArquivoApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados");
        Path arquivo = diretorio.resolve("eventos.log");

        try {
            Files.createDirectories(diretorio);

            Files.writeString(
                    arquivo,
                    "Sistema iniciado%n".formatted(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            );

            Files.writeString(
                    arquivo,
                    "Processamento executado%n".formatted(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            );

            System.out.println("Eventos registrados em: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao registrar evento: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.AppendArquivoApp
```

---

## Observação

Execute mais de uma vez.

O arquivo:

```text
eventos.log
```

deve acumular novas linhas.

Isso é append.

---

# Parte 9 — Exception própria de infraestrutura

## Criando FalhaArquivoException

Crie:

```text
src\br\com\curso\aula207\exception\infra\FalhaArquivoException.java
```

Código:

```java
package br.com.curso.aula207.exception.infra;

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

## Por que criar

Em vez de espalhar `IOException` por toda aplicação, podemos encapsular falhas técnicas de arquivo.

Exemplo:

```java
catch (IOException erro) {
    throw new FalhaArquivoException("Falha ao ler arquivo: " + caminho, erro);
}
```

Isso mantém a causa original e dá contexto da aplicação.

---

# Parte 10 — Infraestrutura: ArquivoTextoGateway

## Objetivo

Vamos criar uma classe de infraestrutura para centralizar operações de arquivo.

Ela será responsável por:

```text
criar diretório;
escrever linhas;
ler linhas;
adicionar linha;
verificar existência.
```

---

## ArquivoTextoGateway

Crie:

```text
src\br\com\curso\aula207\infra\ArquivoTextoGateway.java
```

Código:

```java
package br.com.curso.aula207.infra;

import br.com.curso.aula207.exception.infra.FalhaArquivoException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class ArquivoTextoGateway {
    public boolean existe(String caminho) {
        validarCaminho(caminho);

        return Files.exists(Path.of(caminho));
    }

    public List<String> lerLinhas(String caminho) {
        validarCaminho(caminho);

        Path path = Path.of(caminho);

        try {
            return Files.readAllLines(path);
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao ler arquivo: " + caminho, erro);
        }
    }

    public void escreverLinhas(String caminho, List<String> linhas) {
        validarCaminho(caminho);

        if (linhas == null) {
            throw new IllegalArgumentException("Linhas são obrigatórias.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            Files.write(path, linhas);
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

            Files.writeString(
                    path,
                    linha + System.lineSeparator(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            );
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

## Observação arquitetural

Essa classe pertence à infraestrutura.

Ela conhece:

```text
Path;
Files;
IOException;
StandardOpenOption.
```

O domínio não conhece nada disso.

---

## App ArquivoTextoGateway

Crie:

```text
src\br\com\curso\aula207\app\ArquivoTextoGatewayApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import br.com.curso.aula207.infra.ArquivoTextoGateway;

import java.util.List;

public class ArquivoTextoGatewayApp {
    public static void main(String[] args) {
        ArquivoTextoGateway gateway = new ArquivoTextoGateway();

        String caminho = "dados/gateway/clientes.txt";

        gateway.escreverLinhas(caminho, List.of(
                "Ana Silva;ana@empresa.com",
                "Carlos Souza;carlos@empresa.com"
        ));

        gateway.adicionarLinha(caminho, "Maria Oliveira;maria@empresa.com");

        List<String> linhas = gateway.lerLinhas(caminho);

        linhas.forEach(System.out::println);

        System.out.println("Existe? " + gateway.existe(caminho));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.ArquivoTextoGatewayApp
```

---

# Parte 11 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula207\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula207.dominio.produto;

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

# Parte 12 — Service de exportação de produtos

## ProdutoExportacaoService

Crie:

```text
src\br\com\curso\aula207\service\ProdutoExportacaoService.java
```

Código:

```java
package br.com.curso.aula207.service;

import br.com.curso.aula207.dominio.produto.Produto;
import br.com.curso.aula207.infra.ArquivoTextoGateway;

import java.util.List;

public class ProdutoExportacaoService {
    private final ArquivoTextoGateway arquivoGateway;

    public ProdutoExportacaoService(ArquivoTextoGateway arquivoGateway) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
    }

    public void exportar(String caminho, List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        List<String> linhas = produtos.stream()
                .map(this::converterParaLinha)
                .toList();

        arquivoGateway.escreverLinhas(caminho, linhas);
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

## App exportação

Crie:

```text
src\br\com\curso\aula207\app\ProdutoExportacaoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import br.com.curso.aula207.dominio.produto.Produto;
import br.com.curso.aula207.infra.ArquivoTextoGateway;
import br.com.curso.aula207.service.ProdutoExportacaoService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoExportacaoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("PRD-001", "Notebook", new BigDecimal("3500.00"), 5),
                new Produto("PRD-002", "Mouse", new BigDecimal("80.00"), 20),
                new Produto("PRD-003", "Monitor", new BigDecimal("1200.00"), 10)
        );

        ProdutoExportacaoService service = new ProdutoExportacaoService(new ArquivoTextoGateway());

        service.exportar("dados/export/produtos.txt", produtos);

        System.out.println("Produtos exportados.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.ProdutoExportacaoApp
```

---

## O que observar

O service não usa `Files`.

Ele usa:

```java
ArquivoTextoGateway
```

Essa separação melhora:

```text
testabilidade;
organização;
responsabilidade;
evolução futura.
```

---

# Parte 13 — Service de importação de produtos

## ProdutoImportacaoService

Crie:

```text
src\br\com\curso\aula207\service\ProdutoImportacaoService.java
```

Código:

```java
package br.com.curso.aula207.service;

import br.com.curso.aula207.dominio.produto.Produto;
import br.com.curso.aula207.infra.ArquivoTextoGateway;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoImportacaoService {
    private final ArquivoTextoGateway arquivoGateway;

    public ProdutoImportacaoService(ArquivoTextoGateway arquivoGateway) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
    }

    public List<Produto> importar(String caminho) {
        List<String> linhas = arquivoGateway.lerLinhas(caminho);

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
}
```

---

## App importação

Crie:

```text
src\br\com\curso\aula207\app\ProdutoImportacaoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import br.com.curso.aula207.dominio.produto.Produto;
import br.com.curso.aula207.exception.infra.FalhaArquivoException;
import br.com.curso.aula207.infra.ArquivoTextoGateway;
import br.com.curso.aula207.service.ProdutoImportacaoService;

import java.util.List;

public class ProdutoImportacaoApp {
    public static void main(String[] args) {
        ProdutoImportacaoService service = new ProdutoImportacaoService(new ArquivoTextoGateway());

        try {
            List<Produto> produtos = service.importar("dados/export/produtos.txt");

            produtos.forEach(produto -> System.out.println(produto.resumo()));
        } catch (FalhaArquivoException erro) {
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
java -cp out br.com.curso.aula207.app.ProdutoImportacaoApp
```

---

## Fluxo esperado

Execute primeiro:

```text
ProdutoExportacaoApp
```

Depois execute:

```text
ProdutoImportacaoApp
```

Assim o arquivo já existirá.

---

# Parte 14 — Log técnico simples

## LogEventoService

Crie:

```text
src\br\com\curso\aula207\service\LogEventoService.java
```

Código:

```java
package br.com.curso.aula207.service;

import br.com.curso.aula207.infra.ArquivoTextoGateway;

import java.time.LocalDateTime;

public class LogEventoService {
    private final ArquivoTextoGateway arquivoGateway;
    private final String caminho;

    public LogEventoService(ArquivoTextoGateway arquivoGateway, String caminho) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
        this.caminho = caminho;
    }

    public void registrar(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        String linha = LocalDateTime.now() + " | " + mensagem;

        arquivoGateway.adicionarLinha(caminho, linha);
    }
}
```

---

## App LogEvento

Crie:

```text
src\br\com\curso\aula207\app\LogEventoApp.java
```

Código:

```java
package br.com.curso.aula207.app;

import br.com.curso.aula207.infra.ArquivoTextoGateway;
import br.com.curso.aula207.service.LogEventoService;

public class LogEventoApp {
    public static void main(String[] args) {
        LogEventoService log = new LogEventoService(
                new ArquivoTextoGateway(),
                "dados/logs/eventos.log"
        );

        log.registrar("Aplicação iniciada.");
        log.registrar("Processamento executado.");
        log.registrar("Aplicação finalizada.");

        System.out.println("Eventos registrados.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula207.app.LogEventoApp
```

---

## Observação

Esse log é didático.

Em backend real, você usará frameworks de logging.

Mas este exemplo ajuda a entender append e separação de responsabilidades.

---

# Parte 15 — Boas práticas

## 1. Use Path.of

Prefira:

```java
Path.of("dados", "clientes.txt")
```

a concatenação manual de string.

---

## 2. Crie diretório antes de escrever

Use:

```java
Files.createDirectories(parent)
```

quando necessário.

---

## 3. Preserve causa ao converter IOException

Bom:

```java
throw new FalhaArquivoException("Falha ao ler arquivo: " + caminho, erro);
```

---

## 4. Não coloque Files dentro da entidade

Entidade não conhece infraestrutura.

---

## 5. Separe gateway de arquivo

Uma classe como:

```java
ArquivoTextoGateway
```

centraliza I/O.

---

## 6. Use readString para arquivo pequeno

Bom para configuração simples.

---

## 7. Use readAllLines para importação pequena/média

Bom para arquivos controlados.

---

## 8. Cuidado com arquivos grandes

Para arquivos grandes, leitura completa em memória pode ser ruim.

Vamos aprofundar leitura com stream/reader nas próximas aulas.

---

## 9. Não engula IOException

Nunca faça:

```java
catch (IOException erro) {
}
```

---

## 10. Mensagens precisam ter caminho

Bom:

```text
Falha ao ler arquivo: dados/produtos.txt
```

---

# Parte 16 — Erros comuns

## 1. Esquecer de criar diretório

Se o diretório não existe, escrita pode falhar.

---

## 2. Sobrescrever arquivo sem perceber

`Files.write` pode substituir conteúdo.

Use `APPEND` quando quiser adicionar.

---

## 3. Ler arquivo grande inteiro

`readString` e `readAllLines` carregam tudo em memória.

---

## 4. Misturar importação com infraestrutura

Evite service cheio de detalhes de `Path`, `Files` e `IOException`.

---

## 5. Perder causa original

Não converta erro técnico sem passar a causa.

---

## 6. Usar caminho absoluto fixo sem necessidade

Caminho absoluto pode quebrar em outro ambiente.

Prefira caminho configurável ou relativo em exemplos.

---

# Parte 17 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula207.app.PathBasicoApp
java -cp out br.com.curso.aula207.app.FilesVerificacaoApp
java -cp out br.com.curso.aula207.app.CriarDiretorioApp
java -cp out br.com.curso.aula207.app.EscreverArquivoApp
java -cp out br.com.curso.aula207.app.LerArquivoStringApp
java -cp out br.com.curso.aula207.app.LerArquivoLinhasApp
java -cp out br.com.curso.aula207.app.EscreverLinhasApp
java -cp out br.com.curso.aula207.app.AppendArquivoApp
java -cp out br.com.curso.aula207.app.ArquivoTextoGatewayApp
java -cp out br.com.curso.aula207.app.ProdutoExportacaoApp
java -cp out br.com.curso.aula207.app.ProdutoImportacaoApp
java -cp out br.com.curso.aula207.app.LogEventoApp
```

Para cada execução, responda:

```text
qual arquivo foi criado?
qual diretório foi criado?
houve leitura ou escrita?
houve append?
houve IOException?
a exception foi convertida?
a causa foi preservada?
a responsabilidade ficou em app, service ou infra?
```

---

# Parte 18 — Desafio prático

## Contexto

Você vai criar um fluxo de importação e exportação de clientes.

O objetivo é praticar:

```text
Path;
Files;
gateway de arquivo;
domínio limpo;
service de importação;
service de exportação;
exception de infraestrutura;
tratamento no app.
```

---

## Entidade Cliente

Crie:

```text
src\br\com\curso\aula207\dominio\cliente\Cliente.java
```

Campos:

```text
String nome;
String email;
boolean ativo;
```

Regras:

```text
nome obrigatório;
email obrigatório e contendo @.
```

Métodos:

```java
String resumo()
```

---

## ClienteExportacaoService

Crie:

```text
src\br\com\curso\aula207\service\ClienteExportacaoService.java
```

Método:

```java
void exportar(String caminho, List<Cliente> clientes)
```

Formato:

```text
NOME;EMAIL;ATIVO
```

Regras:

```text
clientes obrigatório;
converter clientes para linhas;
usar ArquivoTextoGateway.escreverLinhas.
```

---

## ClienteImportacaoService

Crie:

```text
src\br\com\curso\aula207\service\ClienteImportacaoService.java
```

Método:

```java
List<Cliente> importar(String caminho)
```

Formato:

```text
NOME;EMAIL;ATIVO
```

Regras:

```text
ler linhas com ArquivoTextoGateway;
ignorar linhas vazias;
validar 3 colunas;
converter boolean com Boolean.parseBoolean;
criar Cliente;
se linha inválida, lançar IllegalArgumentException com a linha.
```

---

## App

Crie:

```text
ClienteImportacaoExportacaoApp
```

Fluxo:

```text
criar lista de clientes;
exportar para dados/clientes/clientes.txt;
importar do mesmo arquivo;
imprimir clientes importados.
```

Critérios:

```text
domínio não conhece arquivo;
service não conhece IOException;
infra conhece Files;
exception técnica preserva causa;
app trata FalhaArquivoException e IllegalArgumentException.
```

---

## Desafio extra

Crie:

```text
ClienteAuditoriaService
```

Método:

```java
void registrarClienteImportado(Cliente cliente)
```

Regra:

```text
adicionar linha em dados/auditoria/clientes.log
formato:
DATA_HORA | CLIENTE_IMPORTADO | email
```

Depois, no app, após importar, registre auditoria para cada cliente.

---

# Parte 19 — Debug recomendado

Coloque breakpoints em:

```text
PathBasicoApp
CriarDiretorioApp
EscreverArquivoApp
LerArquivoLinhasApp
AppendArquivoApp
ArquivoTextoGateway.lerLinhas
ArquivoTextoGateway.escreverLinhas
ArquivoTextoGateway.adicionarLinha
ProdutoExportacaoService.exportar
ProdutoImportacaoService.importar
ProdutoImportacaoService.converterLinha
```

Observe:

```text
como Path é montado;
quando diretório é criado;
quando arquivo é sobrescrito;
quando arquivo recebe append;
onde IOException nasce;
onde IOException é convertida;
como service fica livre de Files;
como domínio fica livre de infraestrutura.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve Path?
2. Para que serve Files?
3. Qual diferença entre readString e readAllLines?
4. Para que serve createDirectories?
5. Para que serve StandardOpenOption.APPEND?
6. Por que converter IOException para exception própria?
7. Por que entidade não deve usar Files?
8. Por que criar um ArquivoTextoGateway?
9. Quando readAllLines pode ser ruim?
10. Qual camada deve conhecer Path e Files?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Path.of;
usar Files.exists;
usar Files.isRegularFile;
usar Files.isDirectory;
criar diretórios;
escrever string em arquivo;
ler string de arquivo;
ler linhas de arquivo;
escrever lista de linhas;
fazer append em arquivo;
usar StandardOpenOption;
criar exception de infraestrutura;
converter IOException preservando causa;
criar gateway de arquivo;
criar service de exportação;
criar service de importação;
manter domínio sem dependência de arquivo;
resolver ClienteImportacaoExportacaoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-207-io-path-files-leitura-escrita-arquivos
git commit -m "Aula 207: io path files leitura escrita arquivos"
git status
```

Se aparecer arquivo `.class`, pasta `out` ou arquivos de dados que você não queira versionar, ajuste o `.gitignore`.

Para esta aula, você pode versionar os arquivos de exemplo se quiser guardar evidência didática.

---

## Fechamento

A principal ideia desta aula é:

```text
Path representa caminhos; Files executa operações de arquivo.
```

Você estudou:

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

Também reforçou a arquitetura:

```text
infraestrutura trabalha com arquivos;
service coordena importação e exportação;
domínio protege regra e não conhece I/O.
```

Na próxima aula, vamos aprofundar leitura e escrita com streams e buffers:

```text
BufferedReader;
BufferedWriter;
Files.newBufferedReader;
Files.newBufferedWriter;
leitura linha a linha;
processamento de arquivos maiores;
try-with-resources aplicado de forma profissional.
```
