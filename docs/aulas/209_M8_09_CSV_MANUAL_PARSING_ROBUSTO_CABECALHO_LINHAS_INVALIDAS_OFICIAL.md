# 209 — M8.09 — CSV manual: parsing robusto, cabeçalho e linhas inválidas

## Objetivo da aula

Na aula anterior, você estudou:

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

Agora vamos entrar em um cenário muito comum em backend:

```text
importação de arquivos CSV.
```

CSV significa:

```text
Comma-Separated Values
```

Mas na prática, no Brasil e em sistemas corporativos, você verá muitos arquivos separados por:

```text
;
```

Exemplo:

```text
SKU;NOME;PRECO;ESTOQUE
PRD-001;Notebook;3500.00;5
PRD-002;Mouse;80.00;20
```

Nesta aula, vamos implementar parsing manual de CSV simples.

O objetivo não é criar uma biblioteca completa de CSV.

O objetivo é aprender como pensar em:

```text
cabeçalho;
separador;
campos obrigatórios;
quantidade de colunas;
linhas vazias;
número da linha;
erros por linha;
conversão de tipos;
relatório de importação;
domínio protegido;
service sem impressão;
infraestrutura separada;
exportação com cabeçalho.
```

Ao final desta aula, você deve conseguir:

```text
ler CSV linha a linha;
validar cabeçalho;
ignorar linhas vazias;
validar quantidade de colunas;
parsear campos;
converter BigDecimal;
converter int;
converter boolean;
acumular erros por linha;
não parar importação inteira por linha inválida;
gerar ResultadoImportacao;
exportar CSV com cabeçalho;
separar parser, service e domínio;
entender limitações de parsing manual;
saber quando usar biblioteca externa no futuro.
```

---

## Ideia principal

Importação profissional não deve quebrar no primeiro erro simples de linha.

Se o arquivo tem 500 linhas e 7 linhas inválidas, normalmente queremos:

```text
493 registros válidos;
7 registros com erro;
relatório claro com número da linha e motivo.
```

Exemplo de relatório:

```text
Válidos: 493 | Erros: 7

Linha 8: preço inválido.
Linha 15: quantidade de colunas inválida.
Linha 39: SKU é obrigatório.
```

Isso é muito melhor do que:

```text
Erro.
```

ou:

```text
NumberFormatException.
```

---

## CSV simples vs CSV completo

Nesta aula, vamos tratar CSV simples.

CSV simples:

```text
campos separados por ;
sem aspas;
sem ; dentro do campo;
sem quebra de linha dentro do campo;
cabeçalho fixo;
tipos conhecidos.
```

CSV completo pode ter casos como:

```text
"Notebook Gamer; 16GB";3500.00
"Texto com ""aspas""";true
"Campo com
quebra de linha";123
```

Para CSV completo, em projeto real, normalmente usamos biblioteca.

Exemplos futuros:

```text
Apache Commons CSV;
OpenCSV;
Jackson CSV.
```

Mas antes de usar biblioteca, você precisa entender o problema.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de CSV:

```text
Entidade:
valida regra do objeto.

Parser:
converte linha em dados.

Service:
coordena importação/exportação.

Infraestrutura:
lê e escreve arquivo.

Controller futuro:
recebe upload/download.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-209-csv-manual-parsing-robusto-cabecalho-linhas-invalidas
cd labs\m8\aula-209-csv-manual-parsing-robusto-cabecalho-linhas-invalidas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula209
mkdir src\br\com\curso\aula209\app
mkdir src\br\com\curso\aula209\csv
mkdir src\br\com\curso\aula209\dominio
mkdir src\br\com\curso\aula209\dominio\produto
mkdir src\br\com\curso\aula209\dominio\cliente
mkdir src\br\com\curso\aula209\exception
mkdir src\br\com\curso\aula209\exception\infra
mkdir src\br\com\curso\aula209\infra
mkdir src\br\com\curso\aula209\service
mkdir src\br\com\curso\aula209\validacao
```

---

# Parte 1 — Resultado de importação

## ErroLinha

Crie:

```text
src\br\com\curso\aula209\validacao\ErroLinha.java
```

Código:

```java
package br.com.curso.aula209.validacao;

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
src\br\com\curso\aula209\validacao\ResultadoImportacao.java
```

Código:

```java
package br.com.curso.aula209.validacao;

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

    public boolean sucessoTotal() {
        return erros.isEmpty();
    }

    public boolean possuiValidos() {
        return !itensValidos.isEmpty();
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

## Por que criar ResultadoImportacao

Porque importação não é só sucesso/falha.

Ela pode ter:

```text
sucesso total;
falha total;
sucesso parcial;
linhas válidas;
linhas inválidas.
```

Esse objeto representa esse cenário de forma clara.

---

# Parte 2 — Exception de infraestrutura

## FalhaArquivoException

Crie:

```text
src\br\com\curso\aula209\exception\infra\FalhaArquivoException.java
```

Código:

```java
package br.com.curso.aula209.exception.infra;

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

## Quando essa exception será usada

Use para falhas técnicas de arquivo:

```text
arquivo não encontrado;
permissão negada;
falha ao abrir;
falha ao ler;
falha ao escrever;
falha ao fechar.
```

Não use para linha inválida.

Linha inválida é erro controlado de importação.

---

# Parte 3 — Infraestrutura de leitura e escrita CSV

## CsvArquivoGateway

Crie:

```text
src\br\com\curso\aula209\infra\CsvArquivoGateway.java
```

Código:

```java
package br.com.curso.aula209.infra;

import br.com.curso.aula209.exception.infra.FalhaArquivoException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class CsvArquivoGateway {
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
            throw new FalhaArquivoException("Falha ao processar arquivo CSV: " + caminho, erro);
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
            throw new FalhaArquivoException("Falha ao escrever arquivo CSV: " + caminho, erro);
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

Esse gateway centraliza:

```text
BufferedReader;
BufferedWriter;
Path;
Files;
IOException.
```

Ele pertence à infraestrutura.

O domínio não conhece arquivo.

---

# Parte 4 — Utilitário de CSV simples

## Por que criar utilitário

Em vez de espalhar:

```java
linha.split(";")
```

em todos os services, vamos criar um utilitário pequeno.

Ele vai cuidar de:

```text
separador;
trim dos campos;
quantidade de colunas.
```

---

## CsvSimples

Crie:

```text
src\br\com\curso\aula209\csv\CsvSimples.java
```

Código:

```java
package br.com.curso.aula209.csv;

import java.util.Arrays;
import java.util.List;

public final class CsvSimples {
    public static final String SEPARADOR = ";";

    private CsvSimples() {
    }

    public static List<String> separar(String linha) {
        if (linha == null) {
            throw new IllegalArgumentException("Linha é obrigatória.");
        }

        return Arrays.stream(linha.split(SEPARADOR, -1))
                .map(String::trim)
                .toList();
    }

    public static void validarQuantidadeColunas(List<String> colunas, int esperado) {
        if (colunas == null) {
            throw new IllegalArgumentException("Colunas são obrigatórias.");
        }

        if (colunas.size() != esperado) {
            throw new IllegalArgumentException(
                    "Quantidade de colunas inválida. Esperado: "
                            + esperado
                            + ", recebido: "
                            + colunas.size()
            );
        }
    }

    public static boolean linhaVazia(String linha) {
        return linha == null || linha.isBlank();
    }
}
```

---

## Por que usar split com -1

Este trecho:

```java
linha.split(";", -1)
```

preserva campos vazios no final.

Exemplo:

```text
PRD-001;Notebook;3500.00;
```

Com `-1`, o último campo vazio é mantido.

Isso é importante para validar coluna faltante.

---

# Parte 5 — Validador de cabeçalho

## Por que cabeçalho importa

Cabeçalho ajuda a garantir que o arquivo está no formato esperado.

Exemplo esperado:

```text
SKU;NOME;PRECO;ESTOQUE
```

Se vier:

```text
CODIGO;DESCRICAO;VALOR;QTD
```

talvez até dê para parsear por posição.

Mas o arquivo não está no padrão esperado.

---

## CabecalhoCsv

Crie:

```text
src\br\com\curso\aula209\csv\CabecalhoCsv.java
```

Código:

```java
package br.com.curso.aula209.csv;

import java.util.List;

public class CabecalhoCsv {
    private final List<String> colunasEsperadas;

    public CabecalhoCsv(List<String> colunasEsperadas) {
        if (colunasEsperadas == null || colunasEsperadas.isEmpty()) {
            throw new IllegalArgumentException("Colunas esperadas são obrigatórias.");
        }

        this.colunasEsperadas = colunasEsperadas.stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .toList();
    }

    public void validar(String linhaCabecalho) {
        List<String> colunasRecebidas = CsvSimples.separar(linhaCabecalho)
                .stream()
                .map(String::toUpperCase)
                .toList();

        if (!colunasEsperadas.equals(colunasRecebidas)) {
            throw new IllegalArgumentException(
                    "Cabeçalho inválido. Esperado: "
                            + colunasEsperadas
                            + ", recebido: "
                            + colunasRecebidas
            );
        }
    }

    public List<String> colunasEsperadas() {
        return List.copyOf(colunasEsperadas);
    }
}
```

---

## Observação

A validação compara:

```text
colunas esperadas
```

com:

```text
colunas recebidas
```

em ordem.

Isso é bom para CSV posicional.

---

# Parte 6 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula209\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula209.dominio.produto;

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

# Parte 7 — Parser de produto

## ProdutoCsvParser

Crie:

```text
src\br\com\curso\aula209\csv\ProdutoCsvParser.java
```

Código:

```java
package br.com.curso.aula209.csv;

import br.com.curso.aula209.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoCsvParser {
    public Produto parse(String linha) {
        List<String> colunas = CsvSimples.separar(linha);
        CsvSimples.validarQuantidadeColunas(colunas, 4);

        String sku = colunas.get(0);
        String nome = colunas.get(1);
        BigDecimal preco = converterPreco(colunas.get(2));
        int estoque = converterEstoque(colunas.get(3));

        return new Produto(sku, nome, preco, estoque);
    }

    public String paraLinha(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        return produto.sku()
                + CsvSimples.SEPARADOR
                + produto.nome()
                + CsvSimples.SEPARADOR
                + produto.preco()
                + CsvSimples.SEPARADOR
                + produto.estoque();
    }

    private BigDecimal converterPreco(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Preço é obrigatório.");
        }

        try {
            return new BigDecimal(valor);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Preço inválido: " + valor, erro);
        }
    }

    private int converterEstoque(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Estoque é obrigatório.");
        }

        try {
            return Integer.parseInt(valor);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Estoque inválido: " + valor, erro);
        }
    }
}
```

---

## Responsabilidade do parser

O parser converte:

```text
linha CSV
```

em:

```text
Produto
```

e também:

```text
Produto
```

em:

```text
linha CSV
```

Ele não lê arquivo.

Ele não escreve arquivo.

Ele só converte.

---

# Parte 8 — Criando arquivo CSV de produtos

## CriarProdutosCsvApp

Crie:

```text
src\br\com\curso\aula209\app\CriarProdutosCsvApp.java
```

Código:

```java
package br.com.curso.aula209.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class CriarProdutosCsvApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados", "produtos");
        Path arquivo = diretorio.resolve("produtos.csv");

        List<String> linhas = List.of(
                "SKU;NOME;PRECO;ESTOQUE",
                "PRD-001;Notebook;3500.00;5",
                "PRD-002;Mouse;80.00;20",
                "PRD-003;Monitor;1200.00;10",
                "PRD-004;Cadeira;450.00;-1",
                "PRD-005;Mesa",
                "PRD-006;Teclado;abc;10",
                " ;Produto sem SKU;99.90;3"
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
java -cp out br.com.curso.aula209.app.CriarProdutosCsvApp
```

---

## O que esse arquivo contém

Ele contém:

```text
linhas válidas;
estoque negativo;
linha com colunas insuficientes;
preço inválido;
SKU vazio.
```

Isso permite testar importação robusta.

---

# Parte 9 — Importação CSV de produtos

## ProdutoCsvImportacaoService

Crie:

```text
src\br\com\curso\aula209\service\ProdutoCsvImportacaoService.java
```

Código:

```java
package br.com.curso.aula209.service;

import br.com.curso.aula209.csv.CabecalhoCsv;
import br.com.curso.aula209.csv.CsvSimples;
import br.com.curso.aula209.csv.ProdutoCsvParser;
import br.com.curso.aula209.dominio.produto.Produto;
import br.com.curso.aula209.infra.CsvArquivoGateway;
import br.com.curso.aula209.validacao.ResultadoImportacao;

import java.util.List;

public class ProdutoCsvImportacaoService {
    private final CsvArquivoGateway arquivoGateway;
    private final ProdutoCsvParser parser;
    private final CabecalhoCsv cabecalho;

    public ProdutoCsvImportacaoService(CsvArquivoGateway arquivoGateway, ProdutoCsvParser parser) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        if (parser == null) {
            throw new IllegalArgumentException("Parser é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
        this.parser = parser;
        this.cabecalho = new CabecalhoCsv(List.of("SKU", "NOME", "PRECO", "ESTOQUE"));
    }

    public ResultadoImportacao<Produto> importar(String caminho) {
        ResultadoImportacao<Produto> resultado = new ResultadoImportacao<>();
        EstadoImportacao estado = new EstadoImportacao();

        arquivoGateway.processarLinhas(caminho, (numeroLinha, linha) -> {
            if (CsvSimples.linhaVazia(linha)) {
                return;
            }

            if (!estado.cabecalhoProcessado()) {
                processarCabecalho(numeroLinha, linha, resultado, estado);
                return;
            }

            processarLinhaProduto(numeroLinha, linha, resultado);
        });

        if (!estado.cabecalhoProcessado()) {
            resultado.adicionarErro(1, "Arquivo não possui cabeçalho.");
        }

        return resultado;
    }

    private void processarCabecalho(
            int numeroLinha,
            String linha,
            ResultadoImportacao<Produto> resultado,
            EstadoImportacao estado
    ) {
        try {
            cabecalho.validar(linha);
            estado.marcarCabecalhoProcessado();
        } catch (IllegalArgumentException erro) {
            resultado.adicionarErro(numeroLinha, erro.getMessage());
            estado.marcarCabecalhoProcessado();
        }
    }

    private void processarLinhaProduto(
            int numeroLinha,
            String linha,
            ResultadoImportacao<Produto> resultado
    ) {
        try {
            Produto produto = parser.parse(linha);
            resultado.adicionarItemValido(produto);
        } catch (IllegalArgumentException erro) {
            resultado.adicionarErro(numeroLinha, erro.getMessage());
        }
    }

    private static class EstadoImportacao {
        private boolean cabecalhoProcessado;

        boolean cabecalhoProcessado() {
            return cabecalhoProcessado;
        }

        void marcarCabecalhoProcessado() {
            this.cabecalhoProcessado = true;
        }
    }
}
```

---

## Por que criar EstadoImportacao

Dentro da lambda, precisamos controlar se o cabeçalho já foi processado.

Variáveis locais usadas em lambda precisam ser efetivamente finais.

Por isso usamos um objeto interno simples.

Em projeto real, também poderíamos implementar essa leitura diretamente no service com `BufferedReader`, mas aqui mantivemos o gateway.

---

## App importação produto CSV

Crie:

```text
src\br\com\curso\aula209\app\ProdutoCsvImportacaoApp.java
```

Código:

```java
package br.com.curso.aula209.app;

import br.com.curso.aula209.csv.ProdutoCsvParser;
import br.com.curso.aula209.dominio.produto.Produto;
import br.com.curso.aula209.exception.infra.FalhaArquivoException;
import br.com.curso.aula209.infra.CsvArquivoGateway;
import br.com.curso.aula209.service.ProdutoCsvImportacaoService;
import br.com.curso.aula209.validacao.ResultadoImportacao;

public class ProdutoCsvImportacaoApp {
    public static void main(String[] args) {
        ProdutoCsvImportacaoService service = new ProdutoCsvImportacaoService(
                new CsvArquivoGateway(),
                new ProdutoCsvParser()
        );

        try {
            ResultadoImportacao<Produto> resultado = service.importar("dados/produtos/produtos.csv");

            System.out.println(resultado.resumo());

            System.out.println();
            System.out.println("Produtos válidos:");
            resultado.itensValidos()
                    .forEach(produto -> System.out.println(" - " + produto.resumo()));

            System.out.println();
            System.out.println("Erros:");
            resultado.erros()
                    .forEach(erro -> System.out.println(" - " + erro.resumo()));
        } catch (FalhaArquivoException erro) {
            System.out.println("Falha técnica: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula209.app.ProdutoCsvImportacaoApp
```

---

## Fluxo esperado

Execute primeiro:

```text
CriarProdutosCsvApp
```

Depois:

```text
ProdutoCsvImportacaoApp
```

---

# Parte 10 — Exportação CSV de produtos

## ProdutoCsvExportacaoService

Crie:

```text
src\br\com\curso\aula209\service\ProdutoCsvExportacaoService.java
```

Código:

```java
package br.com.curso.aula209.service;

import br.com.curso.aula209.csv.ProdutoCsvParser;
import br.com.curso.aula209.dominio.produto.Produto;
import br.com.curso.aula209.exception.infra.FalhaArquivoException;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ProdutoCsvExportacaoService {
    private final ProdutoCsvParser parser;

    public ProdutoCsvExportacaoService(ProdutoCsvParser parser) {
        if (parser == null) {
            throw new IllegalArgumentException("Parser é obrigatório.");
        }

        this.parser = parser;
    }

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
                writer.write("SKU;NOME;PRECO;ESTOQUE");
                writer.newLine();

                for (Produto produto : produtos) {
                    writer.write(parser.paraLinha(produto));
                    writer.newLine();
                }
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao exportar produtos para CSV: " + caminho, erro);
        }
    }
}
```

---

## App exportação produto CSV

Crie:

```text
src\br\com\curso\aula209\app\ProdutoCsvExportacaoApp.java
```

Código:

```java
package br.com.curso.aula209.app;

import br.com.curso.aula209.csv.ProdutoCsvParser;
import br.com.curso.aula209.dominio.produto.Produto;
import br.com.curso.aula209.service.ProdutoCsvExportacaoService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoCsvExportacaoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("PRD-010", "Impressora", new BigDecimal("900.00"), 4),
                new Produto("PRD-011", "Scanner", new BigDecimal("700.00"), 2),
                new Produto("PRD-012", "Webcam", new BigDecimal("250.00"), 15)
        );

        ProdutoCsvExportacaoService service = new ProdutoCsvExportacaoService(new ProdutoCsvParser());

        service.exportar("dados/produtos/produtos-exportados.csv", produtos);

        System.out.println("Produtos exportados.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula209.app.ProdutoCsvExportacaoApp
```

---

# Parte 11 — Cabeçalho inválido

## CriarProdutosCsvCabecalhoInvalidoApp

Crie:

```text
src\br\com\curso\aula209\app\CriarProdutosCsvCabecalhoInvalidoApp.java
```

Código:

```java
package br.com.curso.aula209.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class CriarProdutosCsvCabecalhoInvalidoApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados", "produtos");
        Path arquivo = diretorio.resolve("produtos-cabecalho-invalido.csv");

        List<String> linhas = List.of(
                "CODIGO;DESCRICAO;VALOR;QUANTIDADE",
                "PRD-001;Notebook;3500.00;5"
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

---

## App importando cabeçalho inválido

Crie:

```text
src\br\com\curso\aula209\app\ProdutoCsvCabecalhoInvalidoApp.java
```

Código:

```java
package br.com.curso.aula209.app;

import br.com.curso.aula209.csv.ProdutoCsvParser;
import br.com.curso.aula209.dominio.produto.Produto;
import br.com.curso.aula209.infra.CsvArquivoGateway;
import br.com.curso.aula209.service.ProdutoCsvImportacaoService;
import br.com.curso.aula209.validacao.ResultadoImportacao;

public class ProdutoCsvCabecalhoInvalidoApp {
    public static void main(String[] args) {
        ProdutoCsvImportacaoService service = new ProdutoCsvImportacaoService(
                new CsvArquivoGateway(),
                new ProdutoCsvParser()
        );

        ResultadoImportacao<Produto> resultado = service.importar(
                "dados/produtos/produtos-cabecalho-invalido.csv"
        );

        System.out.println(resultado.resumo());

        resultado.erros()
                .forEach(erro -> System.out.println(" - " + erro.resumo()));
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula209.app.CriarProdutosCsvCabecalhoInvalidoApp
java -cp out br.com.curso.aula209.app.ProdutoCsvCabecalhoInvalidoApp
```

---

## Observação

O cabeçalho inválido vira erro de importação.

Isso é melhor do que tentar processar arquivo no formato errado.

---

# Parte 12 — Domínio Cliente

## Cliente

Crie:

```text
src\br\com\curso\aula209\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula209.dominio.cliente;

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

## ClienteCsvParser

Crie:

```text
src\br\com\curso\aula209\csv\ClienteCsvParser.java
```

Código:

```java
package br.com.curso.aula209.csv;

import br.com.curso.aula209.dominio.cliente.Cliente;

import java.util.List;

public class ClienteCsvParser {
    public Cliente parse(String linha) {
        List<String> colunas = CsvSimples.separar(linha);
        CsvSimples.validarQuantidadeColunas(colunas, 3);

        String nome = colunas.get(0);
        String email = colunas.get(1);
        boolean ativo = converterAtivo(colunas.get(2));

        return new Cliente(nome, email, ativo);
    }

    public String paraLinha(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        return cliente.nome()
                + CsvSimples.SEPARADOR
                + cliente.email()
                + CsvSimples.SEPARADOR
                + cliente.ativo();
    }

    private boolean converterAtivo(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Ativo é obrigatório.");
        }

        String normalizado = valor.trim().toLowerCase();

        if ("true".equals(normalizado)) {
            return true;
        }

        if ("false".equals(normalizado)) {
            return false;
        }

        throw new IllegalArgumentException("Ativo deve ser true ou false: " + valor);
    }
}
```

---

# Parte 13 — Desafio guiado: service de cliente CSV

## ClienteCsvImportacaoService

Crie um service baseado no `ProdutoCsvImportacaoService`, mas para cliente.

Regras:

```text
cabeçalho esperado:
NOME;EMAIL;ATIVO

usar ClienteCsvParser;
usar CsvArquivoGateway;
retornar ResultadoImportacao<Cliente>;
validar cabeçalho;
ignorar linhas vazias;
acumular erros por linha.
```

Sugestão de classe:

```text
src\br\com\curso\aula209\service\ClienteCsvImportacaoService.java
```

Método:

```java
ResultadoImportacao<Cliente> importar(String caminho)
```

---

## ClienteCsvExportacaoService

Crie um service para exportar clientes.

Regras:

```text
escrever cabeçalho:
NOME;EMAIL;ATIVO

usar BufferedWriter;
usar ClienteCsvParser.paraLinha;
criar diretório se necessário;
converter IOException para FalhaArquivoException;
```

Sugestão:

```text
src\br\com\curso\aula209\service\ClienteCsvExportacaoService.java
```

Método:

```java
void exportar(String caminho, List<Cliente> clientes)
```

---

## ClienteCsvApp

Crie um app que:

```text
crie clientes em memória;
exporte para dados/clientes/clientes.csv;
importe o mesmo arquivo;
imprima válidos e erros.
```

Sugestão:

```text
src\br\com\curso\aula209\app\ClienteCsvApp.java
```

---

# Parte 14 — Boas práticas

## 1. Valide cabeçalho

Cabeçalho errado normalmente indica arquivo errado.

---

## 2. Preserve número da linha

Sem número da linha, suporte e usuário não conseguem corrigir rapidamente.

---

## 3. Não pare o lote por erro de uma linha

Quando a regra de negócio permitir, acumule erros.

---

## 4. Separe parser de arquivo

Arquivo lê linhas.

Parser converte linha.

Service coordena fluxo.

Domínio valida regra.

---

## 5. Não engula erro técnico

Falha de leitura deve virar exception de infraestrutura.

---

## 6. Não trate erro de linha como falha técnica

Linha inválida faz parte da importação.

Arquivo inacessível é falha técnica.

---

## 7. Cuidado com CSV completo

Parsing manual simples não resolve:

```text
campos com separador dentro de aspas;
aspas escapadas;
quebra de linha dentro do campo;
encoding diferente;
delimitadores variáveis.
```

Para isso, use biblioteca no futuro.

---

## 8. Faça mensagens claras

Bom:

```text
Linha 7: Preço inválido: abc
Linha 9: Quantidade de colunas inválida. Esperado: 4, recebido: 2
Linha 11: SKU é obrigatório.
```

---

## 9. Evite lógica gigante dentro da lambda

Se a importação crescer, extraia métodos.

---

## 10. Use types do domínio

Não deixe tudo como `String`.

Converta:

```text
preço -> BigDecimal
estoque -> int
ativo -> boolean
```

---

# Parte 15 — Erros comuns

## 1. Usar split sem preservar campos vazios

Evite:

```java
linha.split(";")
```

quando precisa detectar último campo vazio.

Prefira:

```java
linha.split(";", -1)
```

---

## 2. Não validar quantidade de colunas

Pode causar:

```text
ArrayIndexOutOfBoundsException
```

Mensagem ruim para usuário.

---

## 3. Deixar NumberFormatException vazar

Melhor converter para mensagem clara:

```text
Preço inválido: abc
```

---

## 4. Ignorar cabeçalho sem querer

Pode importar primeira linha como dado.

---

## 5. Tratar cabeçalho inválido como sucesso

Cabeçalho inválido precisa aparecer no resultado.

---

## 6. Misturar BufferedReader com domínio

Domínio não lê arquivo.

---

# Parte 16 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula209.app.CriarProdutosCsvApp
java -cp out br.com.curso.aula209.app.ProdutoCsvImportacaoApp
java -cp out br.com.curso.aula209.app.ProdutoCsvExportacaoApp
java -cp out br.com.curso.aula209.app.CriarProdutosCsvCabecalhoInvalidoApp
java -cp out br.com.curso.aula209.app.ProdutoCsvCabecalhoInvalidoApp
```

Para cada execução, responda:

```text
o arquivo tinha cabeçalho?
o cabeçalho era válido?
quantas linhas válidas foram importadas?
quantas linhas inválidas foram reportadas?
os erros tinham número da linha?
o erro era de linha ou técnico?
o parser ficou separado do service?
a entidade validou suas regras?
```

---

# Parte 17 — Desafio prático

## Contexto

Você vai criar importação e exportação CSV de atividades.

O objetivo é consolidar:

```text
CSV manual;
cabeçalho;
parser;
domínio;
service;
gateway;
resultado de importação;
linhas inválidas;
exportação com cabeçalho.
```

---

## Entidade Atividade

Crie:

```text
src\br\com\curso\aula209\dominio\atividade\Atividade.java
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

## AtividadeCsvParser

Crie:

```text
src\br\com\curso\aula209\csv\AtividadeCsvParser.java
```

Formato:

```text
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS
```

Métodos:

```java
Atividade parse(String linha)

String paraLinha(Atividade atividade)
```

Regras:

```text
validar 5 colunas;
converter boolean;
converter minutos;
lançar IllegalArgumentException com mensagem clara.
```

---

## AtividadeCsvImportacaoService

Crie:

```text
src\br\com\curso\aula209\service\AtividadeCsvImportacaoService.java
```

Método:

```java
ResultadoImportacao<Atividade> importar(String caminho)
```

Regras:

```text
cabeçalho esperado:
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS

usar CsvArquivoGateway;
usar AtividadeCsvParser;
validar cabeçalho;
ignorar linhas vazias;
acumular erros por linha;
não parar lote por linha inválida.
```

---

## AtividadeCsvExportacaoService

Crie:

```text
src\br\com\curso\aula209\service\AtividadeCsvExportacaoService.java
```

Método:

```java
void exportar(String caminho, List<Atividade> atividades)
```

Regras:

```text
escrever cabeçalho;
escrever uma linha por atividade;
criar diretório se necessário;
usar BufferedWriter;
converter IOException para FalhaArquivoException;
preservar causa.
```

---

## App

Crie:

```text
AtividadeCsvImportacaoExportacaoApp
```

Fluxo:

```text
criar arquivo dados/atividades/atividades.csv com linhas válidas e inválidas;
importar arquivo;
imprimir resumo;
imprimir atividades válidas;
imprimir erros;
exportar válidas para dados/atividades/atividades-validas.csv.
```

Arquivo sugerido:

```text
CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS
ATV-001;Confirmar entrega;PENDENTE;true;30
ATV-002;Gerar checklist;CONCLUIDA;false;20
ATV-003;Validar contato;PENDENTE;true;15
ATV-004;Linha ruim
ATV-005;Atividade inválida;PENDENTE;true;abc
ATV-006;Status errado;ABERTA;true;10
```

Critérios:

```text
não usar readAllLines;
usar processamento linha a linha;
validar cabeçalho;
acumular erros;
exportar apenas válidas;
service não imprime;
domínio não conhece CSV;
parser não lê arquivo;
gateway não conhece domínio.
```

---

# Parte 18 — Desafio extra

## Relatório de importação

Crie:

```text
AtividadeCsvRelatorioService
```

Método:

```java
void exportarRelatorio(String caminho, ResultadoImportacao<Atividade> resultado)
```

Conteúdo do arquivo:

```text
RESUMO
VALIDOS;3
ERROS;3

ERROS
LINHA;MENSAGEM
4;Quantidade de colunas inválida...
5;Minutos inválidos...
6;Status inválido...
```

Objetivo:

```text
gerar arquivo de retorno da importação.
```

Esse tipo de arquivo é comum em sistemas corporativos.

---

# Parte 19 — Debug recomendado

Coloque breakpoints em:

```text
CsvSimples.separar
CsvSimples.validarQuantidadeColunas
CabecalhoCsv.validar
ProdutoCsvParser.parse
ProdutoCsvImportacaoService.importar
ProdutoCsvImportacaoService.processarCabecalho
ProdutoCsvImportacaoService.processarLinhaProduto
ProdutoCsvExportacaoService.exportar
```

Observe:

```text
como campos vazios são preservados;
quando cabeçalho é validado;
quando linha inválida vira erro controlado;
quando NumberFormatException vira mensagem clara;
quando domínio valida regra;
quando exportação escreve cabeçalho;
quando erro técnico vira FalhaArquivoException.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que validar cabeçalho?
2. Por que preservar número da linha?
3. Por que usar split com -1?
4. Por que parser não deve ler arquivo?
5. Por que gateway não deve conhecer domínio?
6. Qual diferença entre erro técnico e erro de linha inválida?
7. Quando parsing manual de CSV é suficiente?
8. Quando usar biblioteca externa?
9. Por que domínio ainda valida regras?
10. Por que exportar cabeçalho?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar parser CSV simples;
validar cabeçalho;
validar quantidade de colunas;
preservar campos vazios;
converter tipos;
acumular erros por linha;
diferenciar falha técnica de linha inválida;
importar CSV com ResultadoImportacao;
exportar CSV com cabeçalho;
separar gateway, parser, service e domínio;
resolver AtividadeCsvImportacaoExportacaoApp;
gerar relatório de importação;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-209-csv-manual-parsing-robusto-cabecalho-linhas-invalidas
git commit -m "Aula 209: csv manual parsing robusto cabecalho linhas invalidas"
git status
```

Se aparecer arquivo `.class`, pasta `out` ou arquivos grandes de teste, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
importação CSV profissional precisa validar cabeçalho, linha, tipos e reportar erros com clareza.
```

Você estudou:

```text
CSV simples;
separador;
split com -1;
cabeçalho;
parser;
ResultadoImportacao;
erro por linha;
número de linha;
ProdutoCsvParser;
ClienteCsvParser;
importação;
exportação;
relatório de erros;
limitações do parsing manual.
```

Também reforçou a separação:

```text
gateway lê arquivo;
parser converte linha;
service coordena importação;
domínio valida regra.
```

Na próxima aula, vamos estudar:

```text
Date/Time API moderna com LocalDate, LocalDateTime, Duration, Period e DateTimeFormatter.
```

Esse bloco será essencial para backend, regras de prazo, agendamento, vencimento, auditoria e logs.
