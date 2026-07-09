# 229 — M10.07 — Template Method Pattern: fluxos fixos com etapas variáveis

## Objetivo da aula

Na aula anterior, você estudou:

```text
Facade Pattern
```

Você viu que Facade ajuda a simplificar fluxos complexos, oferecendo uma entrada simples para operações que envolvem vários componentes, como:

```text
checkout;
frete;
estoque;
pagamento;
pedido;
auditoria;
notificação;
repository;
gateway.
```

Agora vamos estudar outro padrão comportamental muito importante para backend:

```text
Template Method Pattern
```

Em português:

```text
Padrão Método Template
```

Esse padrão aparece quando você tem um fluxo com sequência fixa de passos, mas algumas etapas variam conforme o tipo de operação.

Exemplos comuns em backend:

```text
importação de arquivos;
processamento em lote;
geração de relatórios;
validação padronizada;
envio de notificações;
processamento de integrações;
conciliação financeira;
exportação de dados;
sincronização com legado;
rotinas agendadas.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Template Method resolve;
identificar fluxos duplicados com mesma estrutura;
criar classe abstrata com método template;
definir passos fixos;
definir passos variáveis;
usar hooks opcionais;
impedir alteração da ordem do fluxo com final;
aplicar Template Method em importação;
comparar Template Method com Strategy;
comparar Template Method com Facade;
evitar herança desnecessária;
usar o padrão com responsabilidade e clareza.
```

---

## Ideia principal

Template Method define o esqueleto de um algoritmo em uma classe base.

As subclasses implementam algumas etapas específicas.

Exemplo conceitual:

```java
public final Resultado processar() {
    validarEntrada();
    carregarDados();
    processarDados();
    salvarResultado();
    auditar();
}
```

Algumas etapas são fixas.

Outras são variáveis.

O método principal controla a ordem.

---

## Template Method em uma frase prática

```text
Use Template Method quando vários fluxos seguem a mesma sequência, mas alguns passos mudam.
```

Exemplo:

```text
Importar produtos:
validar arquivo;
ler linhas;
parsear produtos;
validar produtos;
salvar produtos;
gerar resultado.

Importar clientes:
validar arquivo;
ler linhas;
parsear clientes;
validar clientes;
salvar clientes;
gerar resultado.
```

A estrutura é igual.

O conteúdo de algumas etapas muda.

---

## Exemplo de problema

Sem Template Method, você pode acabar duplicando fluxo.

Exemplo:

```text
ImportadorProdutoCsv:
valida arquivo;
remove linhas vazias;
parseia;
valida;
salva;
audita.

ImportadorClienteCsv:
valida arquivo;
remove linhas vazias;
parseia;
valida;
salva;
audita.

ImportadorContratoCsv:
valida arquivo;
remove linhas vazias;
parseia;
valida;
salva;
audita.
```

A parte fixa se repete.

Template Method extrai a parte fixa para uma classe base.

---

## Relação com SOLID

## SRP

A classe template define o fluxo comum.

As subclasses cuidam apenas das etapas específicas.

---

## OCP

Para criar novo tipo de importação, você cria nova subclasse.

Não precisa reescrever o fluxo inteiro.

---

## LSP

Toda subclasse precisa respeitar o contrato do template.

Se uma etapa promete retornar lista de registros, não pode retornar `null`.

---

## ISP

Os métodos abstratos devem ser pequenos e focados.

Não crie uma classe base com dezenas de métodos obrigatórios desnecessários.

---

## DIP

O template pode depender de portas para salvar, auditar ou integrar.

Nesta aula, manteremos Java puro e console/memória, mas o raciocínio é o mesmo.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Template Method:

```text
O template controla a sequência fixa.
As subclasses implementam etapas variáveis.
A entidade continua protegendo regra.
O repository continua salvando.
O controller futuro apenas chama o fluxo.
```

---

# Parte 1 — Template Method vs Strategy

## Strategy

Strategy troca um comportamento específico.

Exemplo:

```text
calcular desconto;
calcular prioridade;
validar regra específica.
```

---

## Template Method

Template Method controla um fluxo inteiro com etapas.

Exemplo:

```text
importar arquivo:
validar;
parsear;
validar registros;
salvar;
gerar resultado.
```

---

## Comparação prática

```text
Strategy:
qual regra usar?

Template Method:
qual sequência seguir e quais etapas variam?
```

Os dois são comportamentais.

Mas resolvem problemas diferentes.

---

# Parte 2 — Template Method vs Facade

## Facade

Simplifica acesso a um fluxo ou subsistema complexo.

Exemplo:

```java
checkoutFacade.finalizarCompra(request);
```

---

## Template Method

Define a estrutura fixa de um algoritmo.

Exemplo:

```java
importador.importar("produtos.csv", linhas, agora);
```

---

## Eles podem trabalhar juntos

Uma Facade pode chamar um Template Method internamente.

Exemplo:

```text
ImportacaoFacade
  chama ImportadorProdutoCsvTemplate
  chama AuditoriaGateway
  chama RelatorioGateway
```

---

# Parte 3 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-229-template-method-pattern-fluxos-fixos-etapas-variaveis
cd labs\m10\aula-229-template-method-pattern-fluxos-fixos-etapas-variaveis
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula229

mkdir src\br\com\curso\aula229\app

mkdir src\br\com\curso\aula229\ruim

mkdir src\br\com\curso\aula229\dominio
mkdir src\br\com\curso\aula229\dominio\importacao
mkdir src\br\com\curso\aula229\dominio\produto
mkdir src\br\com\curso\aula229\dominio\cliente

mkdir src\br\com\curso\aula229\template
mkdir src\br\com\curso\aula229\template\importacao

mkdir src\br\com\curso\aula229\infra
mkdir src\br\com\curso\aula229\infra\repository
```

---

# Parte 4 — Código ruim com duplicação

Antes de aplicar o padrão, vamos ver o problema.

## ImportadorProdutoCsvRuim

Crie:

```text
src\br\com\curso\aula229\ruim\ImportadorProdutoCsvRuim.java
```

Código:

```java
package br.com.curso.aula229.ruim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ImportadorProdutoCsvRuim {
    public void importar(String nomeArquivo, List<String> linhas) {
        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            throw new IllegalArgumentException("Nome do arquivo é obrigatório.");
        }

        if (!nomeArquivo.endsWith(".csv")) {
            throw new IllegalArgumentException("Arquivo precisa ser CSV.");
        }

        if (linhas == null || linhas.isEmpty()) {
            throw new IllegalArgumentException("Arquivo sem linhas.");
        }

        System.out.println("[INICIO] Importação de produtos: " + Instant.now());

        List<String> linhasValidas = new ArrayList<>();

        for (String linha : linhas) {
            if (linha != null && !linha.isBlank()) {
                linhasValidas.add(linha);
            }
        }

        List<String> produtos = new ArrayList<>();

        for (String linha : linhasValidas) {
            if (linha.toLowerCase().startsWith("codigo;")) {
                continue;
            }

            String[] partes = linha.split(";");

            if (partes.length != 3) {
                throw new IllegalArgumentException("Linha de produto inválida: " + linha);
            }

            String codigo = partes[0].trim();
            String nome = partes[1].trim();
            BigDecimal valor = new BigDecimal(partes[2].trim());

            if (codigo.isBlank() || nome.isBlank() || valor.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Produto inválido: " + linha);
            }

            produtos.add(codigo + " - " + nome + " - " + valor);
        }

        for (String produto : produtos) {
            System.out.println("[SALVANDO PRODUTO] " + produto);
        }

        System.out.println("[FIM] Produtos importados: " + produtos.size());
    }
}
```

---

## ImportadorClienteCsvRuim

Crie:

```text
src\br\com\curso\aula229\ruim\ImportadorClienteCsvRuim.java
```

Código:

```java
package br.com.curso.aula229.ruim;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ImportadorClienteCsvRuim {
    public void importar(String nomeArquivo, List<String> linhas) {
        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            throw new IllegalArgumentException("Nome do arquivo é obrigatório.");
        }

        if (!nomeArquivo.endsWith(".csv")) {
            throw new IllegalArgumentException("Arquivo precisa ser CSV.");
        }

        if (linhas == null || linhas.isEmpty()) {
            throw new IllegalArgumentException("Arquivo sem linhas.");
        }

        System.out.println("[INICIO] Importação de clientes: " + Instant.now());

        List<String> linhasValidas = new ArrayList<>();

        for (String linha : linhas) {
            if (linha != null && !linha.isBlank()) {
                linhasValidas.add(linha);
            }
        }

        List<String> clientes = new ArrayList<>();

        for (String linha : linhasValidas) {
            if (linha.toLowerCase().startsWith("documento;")) {
                continue;
            }

            String[] partes = linha.split(";");

            if (partes.length != 3) {
                throw new IllegalArgumentException("Linha de cliente inválida: " + linha);
            }

            String documento = partes[0].trim();
            String nome = partes[1].trim();
            String telefone = partes[2].trim();

            if (documento.isBlank() || nome.isBlank() || telefone.isBlank()) {
                throw new IllegalArgumentException("Cliente inválido: " + linha);
            }

            clientes.add(documento + " - " + nome + " - " + telefone);
        }

        for (String cliente : clientes) {
            System.out.println("[SALVANDO CLIENTE] " + cliente);
        }

        System.out.println("[FIM] Clientes importados: " + clientes.size());
    }
}
```

---

## ImportadorRuimApp

Crie:

```text
src\br\com\curso\aula229\app\ImportadorRuimApp.java
```

Código:

```java
package br.com.curso.aula229.app;

import br.com.curso.aula229.ruim.ImportadorClienteCsvRuim;
import br.com.curso.aula229.ruim.ImportadorProdutoCsvRuim;

import java.util.List;

public class ImportadorRuimApp {
    public static void main(String[] args) {
        List<String> linhasProdutos = List.of(
                "codigo;nome;valor",
                "P001;Notebook;3500.00",
                "P002;Mouse;80.00"
        );

        List<String> linhasClientes = List.of(
                "documento;nome;telefone",
                "12345678900;Ana Silva;11999999999",
                "98765432100;Carlos Souza;11888888888"
        );

        new ImportadorProdutoCsvRuim().importar("produtos.csv", linhasProdutos);
        System.out.println();
        new ImportadorClienteCsvRuim().importar("clientes.csv", linhasClientes);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula229.app.ImportadorRuimApp
```

---

## Diagnóstico

Os dois importadores repetem:

```text
validar nome do arquivo;
validar extensão;
validar linhas;
registrar início;
remover linhas vazias;
processar linhas;
salvar registros;
registrar fim.
```

A diferença está em:

```text
como parsear produto;
como parsear cliente;
como validar produto;
como validar cliente;
como salvar produto;
como salvar cliente.
```

Esse é o cenário ideal para Template Method.

---

# Parte 5 — Domínio da importação

## ResultadoImportacao

Crie:

```text
src\br\com\curso\aula229\dominio\importacao\ResultadoImportacao.java
```

Código:

```java
package br.com.curso.aula229.dominio.importacao;

import java.time.Instant;

public class ResultadoImportacao {
    private final String tipo;
    private final String arquivo;
    private final int totalProcessado;
    private final String mensagem;
    private final Instant iniciadoEm;
    private final Instant finalizadoEm;

    public ResultadoImportacao(
            String tipo,
            String arquivo,
            int totalProcessado,
            String mensagem,
            Instant iniciadoEm,
            Instant finalizadoEm
    ) {
        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (arquivo == null || arquivo.isBlank()) {
            throw new IllegalArgumentException("Arquivo é obrigatório.");
        }

        if (totalProcessado < 0) {
            throw new IllegalArgumentException("Total processado não pode ser negativo.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        if (iniciadoEm == null) {
            throw new IllegalArgumentException("Data de início é obrigatória.");
        }

        if (finalizadoEm == null) {
            throw new IllegalArgumentException("Data de fim é obrigatória.");
        }

        this.tipo = tipo;
        this.arquivo = arquivo;
        this.totalProcessado = totalProcessado;
        this.mensagem = mensagem;
        this.iniciadoEm = iniciadoEm;
        this.finalizadoEm = finalizadoEm;
    }

    public String tipo() {
        return tipo;
    }

    public String arquivo() {
        return arquivo;
    }

    public int totalProcessado() {
        return totalProcessado;
    }

    public String mensagem() {
        return mensagem;
    }

    public Instant iniciadoEm() {
        return iniciadoEm;
    }

    public Instant finalizadoEm() {
        return finalizadoEm;
    }

    @Override
    public String toString() {
        return "ResultadoImportacao{"
                + "tipo='" + tipo + '\''
                + ", arquivo='" + arquivo + '\''
                + ", totalProcessado=" + totalProcessado
                + ", mensagem='" + mensagem + '\''
                + ", iniciadoEm=" + iniciadoEm
                + ", finalizadoEm=" + finalizadoEm
                + '}';
    }
}
```

---

## ProdutoImportado

Crie:

```text
src\br\com\curso\aula229\dominio\produto\ProdutoImportado.java
```

Código:

```java
package br.com.curso.aula229.dominio.produto;

import java.math.BigDecimal;

public class ProdutoImportado {
    private final String codigo;
    private final String nome;
    private final BigDecimal valor;

    public ProdutoImportado(String codigo, String nome, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do produto é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do produto deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.nome = nome.trim();
        this.valor = valor;
    }

    public String codigo() {
        return codigo;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal valor() {
        return valor;
    }

    @Override
    public String toString() {
        return codigo + " | " + nome + " | " + valor;
    }
}
```

---

## ClienteImportado

Crie:

```text
src\br\com\curso\aula229\dominio\cliente\ClienteImportado.java
```

Código:

```java
package br.com.curso.aula229.dominio.cliente;

public class ClienteImportado {
    private final String documento;
    private final String nome;
    private final String telefone;

    public ClienteImportado(String documento, String nome, String telefone) {
        if (documento == null || documento.isBlank()) {
            throw new IllegalArgumentException("Documento é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        this.documento = documento.trim();
        this.nome = nome.trim();
        this.telefone = telefone.trim();
    }

    public String documento() {
        return documento;
    }

    public String nome() {
        return nome;
    }

    public String telefone() {
        return telefone;
    }

    @Override
    public String toString() {
        return documento + " | " + nome + " | " + telefone;
    }
}
```

---

# Parte 6 — Criando o Template Method

## ImportadorArquivoTemplate

Crie:

```text
src\br\com\curso\aula229\template\importacao\ImportadorArquivoTemplate.java
```

Código:

```java
package br.com.curso.aula229.template.importacao;

import br.com.curso.aula229.dominio.importacao.ResultadoImportacao;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public abstract class ImportadorArquivoTemplate<T> {
    public final ResultadoImportacao importar(String nomeArquivo, List<String> linhas, Instant agora) {
        validarEntrada(nomeArquivo, linhas, agora);

        Instant iniciadoEm = agora;

        registrarInicio(nomeArquivo, iniciadoEm);

        List<String> linhasValidas = removerLinhasVazias(linhas);

        antesDeProcessar(nomeArquivo, linhasValidas);

        List<T> registros = parsear(linhasValidas);

        validarRegistros(registros);

        salvar(registros);

        depoisDeSalvar(registros);

        Instant finalizadoEm = Instant.now();

        ResultadoImportacao resultado = new ResultadoImportacao(
                tipoImportacao(),
                nomeArquivo,
                registros.size(),
                "Importação finalizada com sucesso.",
                iniciadoEm,
                finalizadoEm
        );

        registrarFim(resultado);

        return resultado;
    }

    protected abstract String tipoImportacao();

    protected abstract List<T> parsear(List<String> linhas);

    protected abstract void validarRegistros(List<T> registros);

    protected abstract void salvar(List<T> registros);

    protected void antesDeProcessar(String nomeArquivo, List<String> linhas) {
    }

    protected void depoisDeSalvar(List<T> registros) {
    }

    private void validarEntrada(String nomeArquivo, List<String> linhas, Instant agora) {
        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            throw new IllegalArgumentException("Nome do arquivo é obrigatório.");
        }

        if (!nomeArquivo.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("Arquivo precisa ter extensão .csv.");
        }

        if (linhas == null || linhas.isEmpty()) {
            throw new IllegalArgumentException("Arquivo não possui linhas.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }
    }

    private List<String> removerLinhasVazias(List<String> linhas) {
        List<String> resultado = new ArrayList<>();

        for (String linha : linhas) {
            if (linha != null && !linha.isBlank()) {
                resultado.add(linha);
            }
        }

        if (resultado.isEmpty()) {
            throw new IllegalArgumentException("Arquivo possui apenas linhas vazias.");
        }

        return resultado;
    }

    private void registrarInicio(String nomeArquivo, Instant iniciadoEm) {
        System.out.println("[INICIO] " + tipoImportacao()
                + " | Arquivo: " + nomeArquivo
                + " | Início: " + iniciadoEm);
    }

    private void registrarFim(ResultadoImportacao resultado) {
        System.out.println("[FIM] " + resultado);
    }
}
```

---

## Pontos importantes

O método principal é:

```java
public final ResultadoImportacao importar(...)
```

Ele é `final` para proteger a ordem do fluxo.

As subclasses não mudam a sequência.

Elas só implementam as etapas variáveis:

```text
tipoImportacao;
parsear;
validarRegistros;
salvar.
```

Hooks opcionais:

```text
antesDeProcessar;
depoisDeSalvar.
```

Hooks permitem customizar pontos sem obrigar todas as subclasses a implementar.

---

# Parte 7 — Importador de produtos com Template Method

## ProdutoCsvImportador

Crie:

```text
src\br\com\curso\aula229\template\importacao\ProdutoCsvImportador.java
```

Código:

```java
package br.com.curso.aula229.template.importacao;

import br.com.curso.aula229.dominio.produto.ProdutoImportado;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProdutoCsvImportador extends ImportadorArquivoTemplate<ProdutoImportado> {
    @Override
    protected String tipoImportacao() {
        return "IMPORTACAO_PRODUTO";
    }

    @Override
    protected List<ProdutoImportado> parsear(List<String> linhas) {
        List<ProdutoImportado> produtos = new ArrayList<>();

        for (String linha : linhas) {
            if (linha.toLowerCase().startsWith("codigo;")) {
                continue;
            }

            String[] partes = linha.split(";");

            if (partes.length != 3) {
                throw new IllegalArgumentException("Linha de produto inválida: " + linha);
            }

            produtos.add(new ProdutoImportado(
                    partes[0],
                    partes[1],
                    new BigDecimal(partes[2].trim())
            ));
        }

        return produtos;
    }

    @Override
    protected void validarRegistros(List<ProdutoImportado> registros) {
        if (registros == null || registros.isEmpty()) {
            throw new IllegalArgumentException("Nenhum produto válido encontrado.");
        }
    }

    @Override
    protected void salvar(List<ProdutoImportado> registros) {
        registros.forEach(produto -> System.out.println("[SALVANDO PRODUTO] " + produto));
    }

    @Override
    protected void depoisDeSalvar(List<ProdutoImportado> registros) {
        System.out.println("[PRODUTO] Total de produtos salvos: " + registros.size());
    }
}
```

---

## ProdutoTemplateApp

Crie:

```text
src\br\com\curso\aula229\app\ProdutoTemplateApp.java
```

Código:

```java
package br.com.curso.aula229.app;

import br.com.curso.aula229.dominio.importacao.ResultadoImportacao;
import br.com.curso.aula229.template.importacao.ProdutoCsvImportador;

import java.time.Instant;
import java.util.List;

public class ProdutoTemplateApp {
    public static void main(String[] args) {
        List<String> linhas = List.of(
                "codigo;nome;valor",
                "P001;Notebook;3500.00",
                "P002;Mouse;80.00",
                "",
                "P003;Teclado;150.00"
        );

        ProdutoCsvImportador importador = new ProdutoCsvImportador();

        ResultadoImportacao resultado = importador.importar(
                "produtos.csv",
                linhas,
                Instant.now()
        );

        System.out.println();
        System.out.println("Resultado final:");
        System.out.println(resultado);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula229.app.ProdutoTemplateApp
```

---

# Parte 8 — Importador de clientes com Template Method

## ClienteCsvImportador

Crie:

```text
src\br\com\curso\aula229\template\importacao\ClienteCsvImportador.java
```

Código:

```java
package br.com.curso.aula229.template.importacao;

import br.com.curso.aula229.dominio.cliente.ClienteImportado;

import java.util.ArrayList;
import java.util.List;

public class ClienteCsvImportador extends ImportadorArquivoTemplate<ClienteImportado> {
    @Override
    protected String tipoImportacao() {
        return "IMPORTACAO_CLIENTE";
    }

    @Override
    protected void antesDeProcessar(String nomeArquivo, List<String> linhas) {
        System.out.println("[CLIENTE] Preparando importação de clientes. Linhas recebidas: " + linhas.size());
    }

    @Override
    protected List<ClienteImportado> parsear(List<String> linhas) {
        List<ClienteImportado> clientes = new ArrayList<>();

        for (String linha : linhas) {
            if (linha.toLowerCase().startsWith("documento;")) {
                continue;
            }

            String[] partes = linha.split(";");

            if (partes.length != 3) {
                throw new IllegalArgumentException("Linha de cliente inválida: " + linha);
            }

            clientes.add(new ClienteImportado(
                    partes[0],
                    partes[1],
                    partes[2]
            ));
        }

        return clientes;
    }

    @Override
    protected void validarRegistros(List<ClienteImportado> registros) {
        if (registros == null || registros.isEmpty()) {
            throw new IllegalArgumentException("Nenhum cliente válido encontrado.");
        }
    }

    @Override
    protected void salvar(List<ClienteImportado> registros) {
        registros.forEach(cliente -> System.out.println("[SALVANDO CLIENTE] " + cliente));
    }
}
```

---

## ClienteTemplateApp

Crie:

```text
src\br\com\curso\aula229\app\ClienteTemplateApp.java
```

Código:

```java
package br.com.curso.aula229.app;

import br.com.curso.aula229.dominio.importacao.ResultadoImportacao;
import br.com.curso.aula229.template.importacao.ClienteCsvImportador;

import java.time.Instant;
import java.util.List;

public class ClienteTemplateApp {
    public static void main(String[] args) {
        List<String> linhas = List.of(
                "documento;nome;telefone",
                "12345678900;Ana Silva;11999999999",
                "98765432100;Carlos Souza;11888888888"
        );

        ClienteCsvImportador importador = new ClienteCsvImportador();

        ResultadoImportacao resultado = importador.importar(
                "clientes.csv",
                linhas,
                Instant.now()
        );

        System.out.println(resultado);
    }
}
```

---

# Parte 9 — Criando novo fluxo com pouco código

Agora imagine que você precisa importar fornecedores.

Com Template Method, você não precisa reescrever:

```text
validar arquivo;
remover linhas vazias;
registrar início;
registrar fim;
montar resultado.
```

Você só cria nova subclasse com:

```text
parsear fornecedor;
validar fornecedor;
salvar fornecedor.
```

Isso é OCP na prática.

---

# Parte 10 — Hooks no Template Method

Hooks são métodos opcionais que a classe base chama, mas a subclasse pode ou não sobrescrever.

No nosso template:

```java
protected void antesDeProcessar(String nomeArquivo, List<String> linhas) {
}
```

e:

```java
protected void depoisDeSalvar(List<T> registros) {
}
```

Esses métodos não obrigam a subclasse a implementar.

Mas permitem customizar o comportamento.

Exemplo:

```text
ClienteCsvImportador usa antesDeProcessar.
ProdutoCsvImportador usa depoisDeSalvar.
```

Hooks são úteis quando uma etapa é opcional.

---

# Parte 11 — Por que o método template é final

No nosso código:

```java
public final ResultadoImportacao importar(...)
```

Isso impede a subclasse de alterar a ordem do algoritmo.

A ideia é:

```text
a classe base controla o fluxo;
a subclasse controla detalhes específicos.
```

Se a subclasse pudesse sobrescrever o método `importar`, ela poderia quebrar o padrão.

---

# Parte 12 — Cuidado com herança

Template Method usa herança.

Isso exige cuidado.

Herança mal usada pode gerar acoplamento forte.

Use Template Method quando realmente houver:

```text
um fluxo fixo comum;
etapas variáveis claras;
subclasses que representam variações do mesmo processo.
```

Se você precisa trocar uma regra isolada, talvez Strategy seja melhor.

---

## Regra prática

```text
Se a variação é uma etapa dentro de um fluxo fixo, Template Method pode servir.
Se a variação é apenas uma regra intercambiável, Strategy pode ser melhor.
```

---

# Parte 13 — Template Method em backend real

## Importação CSV

```text
validar arquivo;
ler linhas;
parsear;
validar registros;
salvar;
gerar relatório.
```

---

## Processamento em lote

```text
buscar pendências;
validar item;
processar item;
salvar resultado;
registrar auditoria.
```

---

## Geração de relatório

```text
validar filtros;
buscar dados;
montar conteúdo;
exportar formato;
registrar geração.
```

---

## Integração com legado

```text
buscar dados externos;
traduzir;
validar;
salvar;
auditar.
```

---

# Parte 14 — Erros comuns com Template Method

## 1. Usar herança sem fluxo comum

Se não existe sequência comum, Template Method pode ser artificial.

---

## 2. Classe base grande demais

Se a classe abstrata tem dezenas de métodos abstratos, provavelmente virou problema.

---

## 3. Subclasse quebrando contrato

Subclasse não deve retornar `null` quando o template espera lista.

---

## 4. Regra de negócio escondida demais na classe base

A classe base deve controlar o fluxo comum.

Não deve virar uma classe Deus.

---

## 5. Usar Template Method quando Strategy seria melhor

Se só uma regra varia, Strategy costuma ser mais flexível.

---

# Parte 15 — Checklist para usar Template Method

Pergunte:

```text
1. Existe um fluxo com sequência fixa?
2. Existem etapas variáveis?
3. Há duplicação entre fluxos parecidos?
4. A ordem das etapas precisa ser protegida?
5. As subclasses representam variações reais?
6. Os métodos abstratos são poucos e claros?
7. Existem hooks opcionais úteis?
8. A classe base não virou classe Deus?
9. Strategy não resolveria melhor?
10. O padrão deixou o código mais claro?
```

---

# Parte 16 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula229.app.ImportadorRuimApp
java -cp out br.com.curso.aula229.app.ProdutoTemplateApp
java -cp out br.com.curso.aula229.app.ClienteTemplateApp
```

Depois responda:

```text
1. O que se repetia nos importadores ruins?
2. Qual classe virou o template?
3. Qual método controla a sequência fixa?
4. Por que o método importar é final?
5. Quais etapas são abstratas?
6. O que é hook?
7. Onde ProdutoCsvImportador customizou o fluxo?
8. Onde ClienteCsvImportador customizou o fluxo?
9. Qual relação com OCP?
10. Quando Strategy seria melhor?
```

---

# Parte 17 — Exercício prático principal

## Contexto

Crie um Template Method para exportação de relatórios.

O fluxo fixo deve ser:

```text
validar filtros;
buscar dados;
montar conteúdo;
exportar;
registrar auditoria;
retornar resultado.
```

---

## Classe base

Crie:

```text
RelatorioTemplate<T>
```

Método final:

```java
ResultadoRelatorio gerar(FiltroRelatorio filtro, Instant agora)
```

Etapas abstratas:

```text
String tipoRelatorio();
List<T> buscarDados(FiltroRelatorio filtro);
String montarConteudo(List<T> dados);
String exportar(String conteudo);
```

Hooks opcionais:

```text
antesDeBuscar(FiltroRelatorio filtro);
depoisDeExportar(String caminhoArquivo);
```

---

## Implementações

Crie:

```text
RelatorioPedidosCsv
RelatorioClientesTxt
```

---

## ResultadoRelatorio

Campos:

```text
String tipo;
String caminhoArquivo;
int totalRegistros;
String mensagem;
```

---

## Critérios

```text
método gerar deve ser final;
não retornar null;
validar filtro;
classe base não deve conhecer detalhes de pedidos/clientes;
subclasses não devem repetir fluxo fixo;
auditoria pode ser simulada com console.
```

---

# Parte 18 — Desafio extra

## Template Method para processamento em lote

Crie:

```text
ProcessadorLoteTemplate<T>
```

Fluxo:

```text
buscarItensPendentes;
validarItens;
processarCadaItem;
salvarResultado;
registrarResumo.
```

Subclasses:

```text
ProcessadorLotePagamentos;
ProcessadorLoteMensageria;
```

Critério:

```text
fluxo fixo na classe base;
processamento específico na subclasse;
sem duplicar sequência;
hooks para antes/depois.
```

---

# Parte 19 — Simulado rápido

## Questão 1

Template Method é útil quando:

```text
A) existe um fluxo fixo com etapas variáveis.
B) existe apenas uma regra simples.
C) quero adaptar API externa.
D) quero montar objeto com muitos campos.
```

---

## Questão 2

No Template Method, o método principal geralmente:

```text
A) define a sequência do algoritmo.
B) salva no banco sempre.
C) substitui todas as entidades.
D) é sempre private.
```

---

## Questão 3

Por que usar `final` no método template?

```text
A) Para impedir que subclasses alterem a ordem do fluxo.
B) Para impedir compilação.
C) Para obrigar retorno null.
D) Para remover herança.
```

---

## Questão 4

Hooks são:

```text
A) pontos opcionais de customização.
B) exceptions obrigatórias.
C) DTOs externos.
D) repositories.
```

---

## Questão 5

Template Method usa principalmente:

```text
A) herança controlada.
B) apenas record.
C) apenas static.
D) apenas switch.
```

---

## Questão 6

Se apenas uma regra isolada varia, pode ser mais adequado usar:

```text
A) Strategy.
B) Builder obrigatoriamente.
C) Facade sempre.
D) Nenhum padrão.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 20 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Template Method.
[ ] Sei identificar fluxo fixo com etapas variáveis.
[ ] Sei criar classe abstrata template.
[ ] Sei criar método template final.
[ ] Sei criar métodos abstratos para etapas variáveis.
[ ] Sei criar hooks opcionais.
[ ] Sei evitar duplicação de fluxo.
[ ] Sei comparar Template Method com Strategy.
[ ] Sei comparar Template Method com Facade.
[ ] Sei evitar herança desnecessária.
[ ] Sei aplicar em importação CSV.
[ ] Sei projetar exercício de relatório.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Template Method?
2. Qual problema ele resolve?
3. O que é método template?
4. Por que o método template pode ser final?
5. O que são hooks?
6. Qual diferença entre Template Method e Strategy?
7. Qual diferença entre Template Method e Facade?
8. Quando usar Template Method?
9. Quando evitar Template Method?
10. Como isso aparece em importações reais?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar fluxos duplicados usando Template Method;
criar template de importação;
criar importador de produto;
criar importador de cliente;
usar hooks;
proteger a ordem do fluxo;
explicar riscos de herança;
resolver exercício de relatório;
resolver desafio de processamento em lote.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-229-template-method-pattern-fluxos-fixos-etapas-variaveis
git commit -m "Aula 229: template method fluxos fixos etapas variaveis"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Template Method organiza fluxos com sequência fixa e etapas variáveis, evitando duplicação e protegendo a ordem do algoritmo.
```

Você estudou:

```text
Template Method Pattern;
método template;
classe abstrata;
hooks;
importação CSV;
produtos;
clientes;
diferença para Strategy;
diferença para Facade;
cuidados com herança;
uso em backend real.
```

Na próxima aula, vamos estudar:

```text
Chain of Responsibility Pattern.
```

A ideia será organizar cadeias de validações, aprovações, filtros e handlers, muito comuns em backend corporativo.
