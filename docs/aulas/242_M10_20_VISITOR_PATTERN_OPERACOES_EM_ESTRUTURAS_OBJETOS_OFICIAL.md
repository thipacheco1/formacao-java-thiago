# 242 — M10.20 — Visitor Pattern: operações em estruturas de objetos

## Objetivo da aula

Na aula anterior, você estudou:

```text
Iterator Pattern
```

Você viu que Iterator ajuda a percorrer coleções, lotes, páginas, arquivos e árvores sem expor a estrutura interna da fonte de dados.

Agora vamos estudar outro padrão comportamental importante, especialmente quando você tem uma estrutura de objetos e precisa executar várias operações diferentes sobre ela:

```text
Visitor Pattern
```

Em português:

```text
Padrão Visitante
```

Visitor aparece quando você tem uma estrutura de objetos relativamente estável, mas precisa adicionar novas operações sobre esses objetos sem ficar alterando as classes da estrutura toda hora.

Exemplos comuns em backend:

```text
árvore de categorias;
checklists;
menus;
documentos compostos;
componentes de relatório;
validação de estruturas;
exportação de estruturas;
cálculo de totais;
geração de resumo;
auditoria de objetos;
serialização customizada;
processamento de regras;
análise de permissões;
estrutura de expressão;
workflow com etapas diferentes;
componentes de formulário;
objetos de domínio com tipos diferentes.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Visitor resolve;
criar interface de Visitor;
criar elementos visitáveis;
aplicar Visitor em estrutura de documentos;
aplicar Visitor em checklist;
adicionar operações sem alterar os elementos;
diferenciar Visitor de Iterator;
diferenciar Visitor de Strategy;
diferenciar Visitor de Composite;
diferenciar Visitor de Observer;
entender double dispatch;
entender vantagens e desvantagens do padrão;
saber quando Visitor ajuda e quando é exagero.
```

---

## Ideia principal

Visitor separa uma operação da estrutura de objetos sobre a qual essa operação atua.

Exemplo:

Você tem uma estrutura de documento:

```text
Titulo
Paragrafo
Tabela
Imagem
```

E precisa executar várias operações:

```text
exportar para texto;
contar palavras;
validar conteúdo;
gerar resumo;
calcular tamanho;
exportar para HTML.
```

Sem Visitor, cada classe pode começar a ganhar muitos métodos:

```java
exportarTexto();
exportarHtml();
contarPalavras();
validar();
gerarResumo();
```

Com Visitor, cada operação fica em uma classe própria:

```text
ExportadorTextoVisitor
ContadorPalavrasVisitor
ValidadorDocumentoVisitor
ResumoDocumentoVisitor
```

Cada elemento aceita o visitante:

```java
elemento.aceitar(visitor);
```

---

## Visitor em uma frase prática

```text
Use Visitor quando precisar adicionar várias operações sobre uma estrutura de objetos relativamente estável sem poluir as classes dessa estrutura.
```

Ou:

```text
Visitor move operações para fora dos objetos visitados.
```

---

## Problema sem Visitor

Imagine classes:

```text
TituloDocumento;
ParagrafoDocumento;
TabelaDocumento;
ImagemDocumento.
```

Primeira demanda:

```text
exportar para texto.
```

Você adiciona métodos em cada classe.

Segunda demanda:

```text
exportar para HTML.
```

Mais métodos.

Terceira demanda:

```text
validar documento.
```

Mais métodos.

Quarta demanda:

```text
contar palavras.
```

Mais métodos.

As classes começam a crescer com operações que talvez não façam parte da responsabilidade principal delas.

Visitor ajuda a manter:

```text
estrutura dos objetos;
operações sobre os objetos.
```

separadas.

---

## Relação com SOLID

## SRP

Os elementos representam estrutura.

Os visitors representam operações.

Exemplo:

```text
ParagrafoDocumento:
guarda texto do parágrafo.

ContadorPalavrasVisitor:
conta palavras.

ExportadorHtmlVisitor:
exporta HTML.
```

---

## OCP

Você pode adicionar uma nova operação criando novo visitor.

Não precisa alterar todos os elementos para adicionar o método da nova operação.

---

## LSP

Todo elemento visitável deve aceitar visitors corretamente.

Todo visitor deve saber visitar os tipos definidos no contrato.

---

## ISP

A interface Visitor pode ficar grande se houver muitos tipos de elementos.

Isso é uma desvantagem real do padrão.

---

## DIP

O código que executa operações pode depender da abstração:

```text
DocumentoVisitor
```

e não de visitors concretos.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Visitor:

```text
Visitor executa operações sobre uma estrutura.
A entidade continua protegendo regra.
O use case decide qual operação aplicar.
O repository continua salvando.
O controller futuro apenas dispara a operação.
```

Visitor não substitui entidade, service ou use case.

---

# Parte 1 — Visitor vs Iterator

## Iterator

Percorre elementos.

```text
próximo;
tem próximo.
```

## Visitor

Executa operação em cada tipo de elemento.

```text
visitarTitulo;
visitarParagrafo;
visitarTabela.
```

Eles podem trabalhar juntos.

Exemplo:

```text
Iterator percorre elementos do documento.
Visitor processa cada elemento.
```

Diferença prática:

```text
Iterator:
como percorrer?

Visitor:
o que fazer com cada tipo?
```

---

# Parte 2 — Visitor vs Composite

## Composite

Modela estrutura em árvore.

```text
Checklist
  Seção
    Pergunta
```

## Visitor

Executa operação sobre a estrutura.

```text
validar checklist;
contar perguntas;
exportar checklist;
gerar resumo.
```

Eles combinam muito.

Exemplo:

```text
Composite cria a árvore.
Visitor percorre/processa a árvore.
```

---

# Parte 3 — Visitor vs Strategy

## Strategy

Escolhe uma regra ou algoritmo intercambiável.

```text
CalculoFrete;
PoliticaDesconto.
```

## Visitor

Executa operação sobre diferentes tipos de elementos.

```text
visitarTitulo;
visitarParagrafo;
visitarTabela.
```

Diferença prática:

```text
Strategy:
uma regra escolhida para um contexto.

Visitor:
uma operação aplicada a uma estrutura de tipos diferentes.
```

---

# Parte 4 — Visitor vs Observer

## Observer

Reage a eventos.

```text
PedidoPagoEvent -> listeners.
```

## Visitor

Processa objetos visitáveis.

```text
Documento -> ExportadorHtmlVisitor.
```

Diferença prática:

```text
Observer:
algo aconteceu, interessados reagem.

Visitor:
aplico uma operação em uma estrutura de objetos.
```

---

# Parte 5 — Double Dispatch

Visitor usa uma ideia chamada:

```text
double dispatch
```

Na prática:

1. O código chama:

```java
elemento.aceitar(visitor);
```

2. O elemento chama o método específico do visitor:

```java
visitor.visitarParagrafo(this);
```

Isso permite escolher a operação correta com base em dois lados:

```text
tipo do visitor;
tipo do elemento.
```

Exemplo:

```text
ExportadorTextoVisitor + ParagrafoDocumento
ContadorPalavrasVisitor + ParagrafoDocumento
ValidadorDocumentoVisitor + ParagrafoDocumento
```

---

# Parte 6 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-242-visitor-pattern-operacoes-em-estruturas-objetos
cd labs\m10\aula-242-visitor-pattern-operacoes-em-estruturas-objetos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula242

mkdir src\br\com\curso\aula242\app

mkdir src\br\com\curso\aula242\documento
mkdir src\br\com\curso\aula242\documento\elemento
mkdir src\br\com\curso\aula242\documento\visitor

mkdir src\br\com\curso\aula242\checklist
mkdir src\br\com\curso\aula242\checklist\elemento
mkdir src\br\com\curso\aula242\checklist\visitor

mkdir src\br\com\curso\aula242\pedido
mkdir src\br\com\curso\aula242\pedido\elemento
mkdir src\br\com\curso\aula242\pedido\visitor
```

---

# Parte 7 — Exemplo 1: documento com elementos

Vamos criar uma estrutura de documento.

Elementos:

```text
Titulo;
Paragrafo;
Tabela;
Imagem.
```

Operações:

```text
exportar texto;
contar palavras;
validar documento.
```

---

## DocumentoVisitor

Crie:

```text
src\br\com\curso\aula242\documento\visitor\DocumentoVisitor.java
```

Código:

```java
package br.com.curso.aula242.documento.visitor;

import br.com.curso.aula242.documento.elemento.ImagemDocumento;
import br.com.curso.aula242.documento.elemento.ParagrafoDocumento;
import br.com.curso.aula242.documento.elemento.TabelaDocumento;
import br.com.curso.aula242.documento.elemento.TituloDocumento;

public interface DocumentoVisitor {
    void visitarTitulo(TituloDocumento titulo);

    void visitarParagrafo(ParagrafoDocumento paragrafo);

    void visitarTabela(TabelaDocumento tabela);

    void visitarImagem(ImagemDocumento imagem);
}
```

---

## ElementoDocumento

Crie:

```text
src\br\com\curso\aula242\documento\elemento\ElementoDocumento.java
```

Código:

```java
package br.com.curso.aula242.documento.elemento;

import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

public interface ElementoDocumento {
    void aceitar(DocumentoVisitor visitor);
}
```

---

## TituloDocumento

Crie:

```text
src\br\com\curso\aula242\documento\elemento\TituloDocumento.java
```

Código:

```java
package br.com.curso.aula242.documento.elemento;

import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

public class TituloDocumento implements ElementoDocumento {
    private final String texto;
    private final int nivel;

    public TituloDocumento(String texto, int nivel) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto do título é obrigatório.");
        }

        if (nivel <= 0 || nivel > 6) {
            throw new IllegalArgumentException("Nível do título deve estar entre 1 e 6.");
        }

        this.texto = texto.trim();
        this.nivel = nivel;
    }

    public String texto() {
        return texto;
    }

    public int nivel() {
        return nivel;
    }

    @Override
    public void aceitar(DocumentoVisitor visitor) {
        visitor.visitarTitulo(this);
    }
}
```

---

## ParagrafoDocumento

Crie:

```text
src\br\com\curso\aula242\documento\elemento\ParagrafoDocumento.java
```

Código:

```java
package br.com.curso.aula242.documento.elemento;

import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

public class ParagrafoDocumento implements ElementoDocumento {
    private final String texto;

    public ParagrafoDocumento(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto do parágrafo é obrigatório.");
        }

        this.texto = texto.trim();
    }

    public String texto() {
        return texto;
    }

    @Override
    public void aceitar(DocumentoVisitor visitor) {
        visitor.visitarParagrafo(this);
    }
}
```

---

## TabelaDocumento

Crie:

```text
src\br\com\curso\aula242\documento\elemento\TabelaDocumento.java
```

Código:

```java
package br.com.curso.aula242.documento.elemento;

import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

import java.util.ArrayList;
import java.util.List;

public class TabelaDocumento implements ElementoDocumento {
    private final String titulo;
    private final List<List<String>> linhas = new ArrayList<>();

    public TabelaDocumento(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título da tabela é obrigatório.");
        }

        this.titulo = titulo.trim();
    }

    public TabelaDocumento adicionarLinha(String... valores) {
        if (valores == null || valores.length == 0) {
            throw new IllegalArgumentException("Linha deve possuir valores.");
        }

        List<String> linha = new ArrayList<>();

        for (String valor : valores) {
            if (valor == null || valor.isBlank()) {
                throw new IllegalArgumentException("Valor da linha não pode ser vazio.");
            }

            linha.add(valor.trim());
        }

        linhas.add(linha);
        return this;
    }

    public String titulo() {
        return titulo;
    }

    public List<List<String>> linhas() {
        List<List<String>> copia = new ArrayList<>();

        for (List<String> linha : linhas) {
            copia.add(List.copyOf(linha));
        }

        return List.copyOf(copia);
    }

    @Override
    public void aceitar(DocumentoVisitor visitor) {
        visitor.visitarTabela(this);
    }
}
```

---

## ImagemDocumento

Crie:

```text
src\br\com\curso\aula242\documento\elemento\ImagemDocumento.java
```

Código:

```java
package br.com.curso.aula242.documento.elemento;

import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

public class ImagemDocumento implements ElementoDocumento {
    private final String caminho;
    private final String descricao;

    public ImagemDocumento(String caminho, String descricao) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho da imagem é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da imagem é obrigatória.");
        }

        this.caminho = caminho.trim();
        this.descricao = descricao.trim();
    }

    public String caminho() {
        return caminho;
    }

    public String descricao() {
        return descricao;
    }

    @Override
    public void aceitar(DocumentoVisitor visitor) {
        visitor.visitarImagem(this);
    }
}
```

---

## Documento

Crie:

```text
src\br\com\curso\aula242\documento\Documento.java
```

Código:

```java
package br.com.curso.aula242.documento;

import br.com.curso.aula242.documento.elemento.ElementoDocumento;
import br.com.curso.aula242.documento.visitor.DocumentoVisitor;

import java.util.ArrayList;
import java.util.List;

public class Documento {
    private final List<ElementoDocumento> elementos = new ArrayList<>();

    public Documento adicionar(ElementoDocumento elemento) {
        if (elemento == null) {
            throw new IllegalArgumentException("Elemento é obrigatório.");
        }

        elementos.add(elemento);
        return this;
    }

    public void aceitar(DocumentoVisitor visitor) {
        if (visitor == null) {
            throw new IllegalArgumentException("Visitor é obrigatório.");
        }

        for (ElementoDocumento elemento : elementos) {
            elemento.aceitar(visitor);
        }
    }

    public int totalElementos() {
        return elementos.size();
    }
}
```

---

# Parte 8 — Visitor de exportação em texto

## ExportadorTextoDocumentoVisitor

Crie:

```text
src\br\com\curso\aula242\documento\visitor\ExportadorTextoDocumentoVisitor.java
```

Código:

```java
package br.com.curso.aula242.documento.visitor;

import br.com.curso.aula242.documento.elemento.ImagemDocumento;
import br.com.curso.aula242.documento.elemento.ParagrafoDocumento;
import br.com.curso.aula242.documento.elemento.TabelaDocumento;
import br.com.curso.aula242.documento.elemento.TituloDocumento;

import java.util.List;

public class ExportadorTextoDocumentoVisitor implements DocumentoVisitor {
    private final StringBuilder builder = new StringBuilder();

    @Override
    public void visitarTitulo(TituloDocumento titulo) {
        builder.append("#".repeat(titulo.nivel()))
                .append(" ")
                .append(titulo.texto())
                .append("\n\n");
    }

    @Override
    public void visitarParagrafo(ParagrafoDocumento paragrafo) {
        builder.append(paragrafo.texto()).append("\n\n");
    }

    @Override
    public void visitarTabela(TabelaDocumento tabela) {
        builder.append("Tabela: ").append(tabela.titulo()).append("\n");

        for (List<String> linha : tabela.linhas()) {
            builder.append(String.join(" | ", linha)).append("\n");
        }

        builder.append("\n");
    }

    @Override
    public void visitarImagem(ImagemDocumento imagem) {
        builder.append("[Imagem: ")
                .append(imagem.descricao())
                .append(" - ")
                .append(imagem.caminho())
                .append("]\n\n");
    }

    public String resultado() {
        return builder.toString();
    }
}
```

---

# Parte 9 — Visitor contador de palavras

## ContadorPalavrasDocumentoVisitor

Crie:

```text
src\br\com\curso\aula242\documento\visitor\ContadorPalavrasDocumentoVisitor.java
```

Código:

```java
package br.com.curso.aula242.documento.visitor;

import br.com.curso.aula242.documento.elemento.ImagemDocumento;
import br.com.curso.aula242.documento.elemento.ParagrafoDocumento;
import br.com.curso.aula242.documento.elemento.TabelaDocumento;
import br.com.curso.aula242.documento.elemento.TituloDocumento;

import java.util.List;

public class ContadorPalavrasDocumentoVisitor implements DocumentoVisitor {
    private int totalPalavras;

    @Override
    public void visitarTitulo(TituloDocumento titulo) {
        totalPalavras += contar(titulo.texto());
    }

    @Override
    public void visitarParagrafo(ParagrafoDocumento paragrafo) {
        totalPalavras += contar(paragrafo.texto());
    }

    @Override
    public void visitarTabela(TabelaDocumento tabela) {
        totalPalavras += contar(tabela.titulo());

        for (List<String> linha : tabela.linhas()) {
            for (String valor : linha) {
                totalPalavras += contar(valor);
            }
        }
    }

    @Override
    public void visitarImagem(ImagemDocumento imagem) {
        totalPalavras += contar(imagem.descricao());
    }

    public int totalPalavras() {
        return totalPalavras;
    }

    private int contar(String texto) {
        if (texto == null || texto.isBlank()) {
            return 0;
        }

        return texto.trim().split("\\s+").length;
    }
}
```

---

# Parte 10 — Visitor validador

## ValidadorDocumentoVisitor

Crie:

```text
src\br\com\curso\aula242\documento\visitor\ValidadorDocumentoVisitor.java
```

Código:

```java
package br.com.curso.aula242.documento.visitor;

import br.com.curso.aula242.documento.elemento.ImagemDocumento;
import br.com.curso.aula242.documento.elemento.ParagrafoDocumento;
import br.com.curso.aula242.documento.elemento.TabelaDocumento;
import br.com.curso.aula242.documento.elemento.TituloDocumento;

import java.util.ArrayList;
import java.util.List;

public class ValidadorDocumentoVisitor implements DocumentoVisitor {
    private final List<String> erros = new ArrayList<>();
    private boolean encontrouTituloNivel1;

    @Override
    public void visitarTitulo(TituloDocumento titulo) {
        if (titulo.nivel() == 1) {
            encontrouTituloNivel1 = true;
        }

        if (titulo.texto().length() > 120) {
            erros.add("Título muito longo: " + titulo.texto());
        }
    }

    @Override
    public void visitarParagrafo(ParagrafoDocumento paragrafo) {
        if (paragrafo.texto().length() < 10) {
            erros.add("Parágrafo muito curto: " + paragrafo.texto());
        }
    }

    @Override
    public void visitarTabela(TabelaDocumento tabela) {
        if (tabela.linhas().isEmpty()) {
            erros.add("Tabela sem linhas: " + tabela.titulo());
        }
    }

    @Override
    public void visitarImagem(ImagemDocumento imagem) {
        if (!imagem.caminho().contains(".")) {
            erros.add("Imagem sem extensão no caminho: " + imagem.caminho());
        }
    }

    public boolean valido() {
        return erros().isEmpty();
    }

    public List<String> erros() {
        List<String> todos = new ArrayList<>(erros);

        if (!encontrouTituloNivel1) {
            todos.add("Documento deve possuir ao menos um título de nível 1.");
        }

        return List.copyOf(todos);
    }
}
```

---

# Parte 11 — App de documento

## DocumentoVisitorApp

Crie:

```text
src\br\com\curso\aula242\app\DocumentoVisitorApp.java
```

Código:

```java
package br.com.curso.aula242.app;

import br.com.curso.aula242.documento.Documento;
import br.com.curso.aula242.documento.elemento.ImagemDocumento;
import br.com.curso.aula242.documento.elemento.ParagrafoDocumento;
import br.com.curso.aula242.documento.elemento.TabelaDocumento;
import br.com.curso.aula242.documento.elemento.TituloDocumento;
import br.com.curso.aula242.documento.visitor.ContadorPalavrasDocumentoVisitor;
import br.com.curso.aula242.documento.visitor.ExportadorTextoDocumentoVisitor;
import br.com.curso.aula242.documento.visitor.ValidadorDocumentoVisitor;

public class DocumentoVisitorApp {
    public static void main(String[] args) {
        Documento documento = new Documento()
                .adicionar(new TituloDocumento("Relatório de Atendimento", 1))
                .adicionar(new ParagrafoDocumento("Este relatório apresenta o resumo dos atendimentos realizados."))
                .adicionar(new TabelaDocumento("Resumo por status")
                        .adicionarLinha("Status", "Quantidade")
                        .adicionarLinha("Concluída", "10")
                        .adicionarLinha("Frustrada", "2"))
                .adicionar(new ImagemDocumento("grafico-atendimento.png", "Gráfico de atendimentos por status"));

        ExportadorTextoDocumentoVisitor exportador = new ExportadorTextoDocumentoVisitor();
        documento.aceitar(exportador);

        System.out.println(exportador.resultado());

        ContadorPalavrasDocumentoVisitor contador = new ContadorPalavrasDocumentoVisitor();
        documento.aceitar(contador);

        System.out.println("Total de palavras: " + contador.totalPalavras());

        ValidadorDocumentoVisitor validador = new ValidadorDocumentoVisitor();
        documento.aceitar(validador);

        System.out.println("Documento válido? " + validador.valido());
        System.out.println("Erros: " + validador.erros());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula242.app.DocumentoVisitorApp
```

---

## O que observar

Você aplicou três operações diferentes na mesma estrutura:

```text
exportação;
contagem;
validação.
```

Sem adicionar métodos novos nas classes:

```text
TituloDocumento;
ParagrafoDocumento;
TabelaDocumento;
ImagemDocumento.
```

Essa é a força do Visitor.

---

# Parte 12 — Exemplo 2: checklist

Agora vamos aplicar Visitor em um checklist.

Estrutura:

```text
SecaoChecklist;
PerguntaChecklist;
```

Operações:

```text
contar perguntas;
validar perguntas obrigatórias;
exportar checklist.
```

---

## ChecklistVisitor

Crie:

```text
src\br\com\curso\aula242\checklist\visitor\ChecklistVisitor.java
```

Código:

```java
package br.com.curso.aula242.checklist.visitor;

import br.com.curso.aula242.checklist.elemento.PerguntaChecklist;
import br.com.curso.aula242.checklist.elemento.SecaoChecklist;

public interface ChecklistVisitor {
    void visitarSecao(SecaoChecklist secao);

    void visitarPergunta(PerguntaChecklist pergunta);
}
```

---

## ElementoChecklist

Crie:

```text
src\br\com\curso\aula242\checklist\elemento\ElementoChecklist.java
```

Código:

```java
package br.com.curso.aula242.checklist.elemento;

import br.com.curso.aula242.checklist.visitor.ChecklistVisitor;

public interface ElementoChecklist {
    void aceitar(ChecklistVisitor visitor);
}
```

---

## PerguntaChecklist

Crie:

```text
src\br\com\curso\aula242\checklist\elemento\PerguntaChecklist.java
```

Código:

```java
package br.com.curso.aula242.checklist.elemento;

import br.com.curso.aula242.checklist.visitor.ChecklistVisitor;

public class PerguntaChecklist implements ElementoChecklist {
    private final String texto;
    private final boolean obrigatoria;
    private final String resposta;

    public PerguntaChecklist(String texto, boolean obrigatoria, String resposta) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto da pergunta é obrigatório.");
        }

        this.texto = texto.trim();
        this.obrigatoria = obrigatoria;
        this.resposta = resposta == null ? "" : resposta.trim();
    }

    public String texto() {
        return texto;
    }

    public boolean obrigatoria() {
        return obrigatoria;
    }

    public String resposta() {
        return resposta;
    }

    public boolean respondida() {
        return !resposta.isBlank();
    }

    @Override
    public void aceitar(ChecklistVisitor visitor) {
        visitor.visitarPergunta(this);
    }
}
```

---

## SecaoChecklist

Crie:

```text
src\br\com\curso\aula242\checklist\elemento\SecaoChecklist.java
```

Código:

```java
package br.com.curso.aula242.checklist.elemento;

import br.com.curso.aula242.checklist.visitor.ChecklistVisitor;

import java.util.ArrayList;
import java.util.List;

public class SecaoChecklist implements ElementoChecklist {
    private final String titulo;
    private final List<ElementoChecklist> elementos = new ArrayList<>();

    public SecaoChecklist(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título da seção é obrigatório.");
        }

        this.titulo = titulo.trim();
    }

    public SecaoChecklist adicionar(ElementoChecklist elemento) {
        if (elemento == null) {
            throw new IllegalArgumentException("Elemento é obrigatório.");
        }

        elementos.add(elemento);
        return this;
    }

    public String titulo() {
        return titulo;
    }

    public List<ElementoChecklist> elementos() {
        return List.copyOf(elementos);
    }

    @Override
    public void aceitar(ChecklistVisitor visitor) {
        visitor.visitarSecao(this);

        for (ElementoChecklist elemento : elementos) {
            elemento.aceitar(visitor);
        }
    }
}
```

---

## ContadorPerguntasVisitor

Crie:

```text
src\br\com\curso\aula242\checklist\visitor\ContadorPerguntasVisitor.java
```

Código:

```java
package br.com.curso.aula242.checklist.visitor;

import br.com.curso.aula242.checklist.elemento.PerguntaChecklist;
import br.com.curso.aula242.checklist.elemento.SecaoChecklist;

public class ContadorPerguntasVisitor implements ChecklistVisitor {
    private int totalPerguntas;
    private int totalObrigatorias;
    private int totalRespondidas;

    @Override
    public void visitarSecao(SecaoChecklist secao) {
        // Seção não altera contagem de perguntas.
    }

    @Override
    public void visitarPergunta(PerguntaChecklist pergunta) {
        totalPerguntas++;

        if (pergunta.obrigatoria()) {
            totalObrigatorias++;
        }

        if (pergunta.respondida()) {
            totalRespondidas++;
        }
    }

    public int totalPerguntas() {
        return totalPerguntas;
    }

    public int totalObrigatorias() {
        return totalObrigatorias;
    }

    public int totalRespondidas() {
        return totalRespondidas;
    }
}
```

---

## ValidadorChecklistVisitor

Crie:

```text
src\br\com\curso\aula242\checklist\visitor\ValidadorChecklistVisitor.java
```

Código:

```java
package br.com.curso.aula242.checklist.visitor;

import br.com.curso.aula242.checklist.elemento.PerguntaChecklist;
import br.com.curso.aula242.checklist.elemento.SecaoChecklist;

import java.util.ArrayList;
import java.util.List;

public class ValidadorChecklistVisitor implements ChecklistVisitor {
    private final List<String> erros = new ArrayList<>();

    @Override
    public void visitarSecao(SecaoChecklist secao) {
        if (secao.elementos().isEmpty()) {
            erros.add("Seção sem elementos: " + secao.titulo());
        }
    }

    @Override
    public void visitarPergunta(PerguntaChecklist pergunta) {
        if (pergunta.obrigatoria() && !pergunta.respondida()) {
            erros.add("Pergunta obrigatória sem resposta: " + pergunta.texto());
        }
    }

    public boolean valido() {
        return erros.isEmpty();
    }

    public List<String> erros() {
        return List.copyOf(erros);
    }
}
```

---

## ExportadorChecklistVisitor

Crie:

```text
src\br\com\curso\aula242\checklist\visitor\ExportadorChecklistVisitor.java
```

Código:

```java
package br.com.curso.aula242.checklist.visitor;

import br.com.curso.aula242.checklist.elemento.PerguntaChecklist;
import br.com.curso.aula242.checklist.elemento.SecaoChecklist;

public class ExportadorChecklistVisitor implements ChecklistVisitor {
    private final StringBuilder builder = new StringBuilder();

    @Override
    public void visitarSecao(SecaoChecklist secao) {
        builder.append("## ").append(secao.titulo()).append("\n");
    }

    @Override
    public void visitarPergunta(PerguntaChecklist pergunta) {
        builder.append("- ")
                .append(pergunta.texto())
                .append(" | Obrigatória: ")
                .append(pergunta.obrigatoria())
                .append(" | Resposta: ")
                .append(pergunta.resposta().isBlank() ? "(sem resposta)" : pergunta.resposta())
                .append("\n");
    }

    public String resultado() {
        return builder.toString();
    }
}
```

---

## ChecklistVisitorApp

Crie:

```text
src\br\com\curso\aula242\app\ChecklistVisitorApp.java
```

Código:

```java
package br.com.curso.aula242.app;

import br.com.curso.aula242.checklist.elemento.PerguntaChecklist;
import br.com.curso.aula242.checklist.elemento.SecaoChecklist;
import br.com.curso.aula242.checklist.visitor.ContadorPerguntasVisitor;
import br.com.curso.aula242.checklist.visitor.ExportadorChecklistVisitor;
import br.com.curso.aula242.checklist.visitor.ValidadorChecklistVisitor;

public class ChecklistVisitorApp {
    public static void main(String[] args) {
        SecaoChecklist checklist = new SecaoChecklist("Checklist de Entrega")
                .adicionar(new SecaoChecklist("Cliente")
                        .adicionar(new PerguntaChecklist("Nome confirmado?", true, "Sim"))
                        .adicionar(new PerguntaChecklist("Telefone confirmado?", true, "")))
                .adicionar(new SecaoChecklist("Produto")
                        .adicionar(new PerguntaChecklist("Produto entregue?", true, "Sim"))
                        .adicionar(new PerguntaChecklist("Embalagem íntegra?", false, "")));

        ExportadorChecklistVisitor exportador = new ExportadorChecklistVisitor();
        checklist.aceitar(exportador);
        System.out.println(exportador.resultado());

        ContadorPerguntasVisitor contador = new ContadorPerguntasVisitor();
        checklist.aceitar(contador);

        System.out.println("Total perguntas: " + contador.totalPerguntas());
        System.out.println("Total obrigatórias: " + contador.totalObrigatorias());
        System.out.println("Total respondidas: " + contador.totalRespondidas());

        ValidadorChecklistVisitor validador = new ValidadorChecklistVisitor();
        checklist.aceitar(validador);

        System.out.println("Checklist válido? " + validador.valido());
        System.out.println("Erros: " + validador.erros());
    }
}
```

---

## O que observar

Esse exemplo combina:

```text
Composite:
SecaoChecklist contém perguntas e outras seções.

Visitor:
operações de exportar, contar e validar.
```

Essa combinação é muito comum.

---

# Parte 13 — Exemplo 3: itens de pedido

Agora vamos aplicar Visitor em itens de pedido de tipos diferentes.

Elementos:

```text
ProdutoFisicoItem;
ServicoItem;
DescontoItem.
```

Operações:

```text
calcular total;
gerar resumo;
validar item.
```

---

## PedidoItemVisitor

Crie:

```text
src\br\com\curso\aula242\pedido\visitor\PedidoItemVisitor.java
```

Código:

```java
package br.com.curso.aula242.pedido.visitor;

import br.com.curso.aula242.pedido.elemento.DescontoItem;
import br.com.curso.aula242.pedido.elemento.ProdutoFisicoItem;
import br.com.curso.aula242.pedido.elemento.ServicoItem;

public interface PedidoItemVisitor {
    void visitarProdutoFisico(ProdutoFisicoItem item);

    void visitarServico(ServicoItem item);

    void visitarDesconto(DescontoItem item);
}
```

---

## ItemPedido

Crie:

```text
src\br\com\curso\aula242\pedido\elemento\ItemPedido.java
```

Código:

```java
package br.com.curso.aula242.pedido.elemento;

import br.com.curso.aula242.pedido.visitor.PedidoItemVisitor;

public interface ItemPedido {
    void aceitar(PedidoItemVisitor visitor);
}
```

---

## ProdutoFisicoItem

Crie:

```text
src\br\com\curso\aula242\pedido\elemento\ProdutoFisicoItem.java
```

Código:

```java
package br.com.curso.aula242.pedido.elemento;

import br.com.curso.aula242.pedido.visitor.PedidoItemVisitor;

import java.math.BigDecimal;

public class ProdutoFisicoItem implements ItemPedido {
    private final String nome;
    private final int quantidade;
    private final BigDecimal valorUnitario;

    public ProdutoFisicoItem(String nome, int quantidade, BigDecimal valorUnitario) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valorUnitario == null || valorUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        this.nome = nome.trim();
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
    }

    public ProdutoFisicoItem(String nome, int quantidade, String valorUnitario) {
        this(nome, quantidade, new BigDecimal(valorUnitario));
    }

    public String nome() {
        return nome;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valorUnitario() {
        return valorUnitario;
    }

    @Override
    public void aceitar(PedidoItemVisitor visitor) {
        visitor.visitarProdutoFisico(this);
    }
}
```

---

## ServicoItem

Crie:

```text
src\br\com\curso\aula242\pedido\elemento\ServicoItem.java
```

Código:

```java
package br.com.curso.aula242.pedido.elemento;

import br.com.curso.aula242.pedido.visitor.PedidoItemVisitor;

import java.math.BigDecimal;

public class ServicoItem implements ItemPedido {
    private final String nome;
    private final BigDecimal valor;

    public ServicoItem(String nome, BigDecimal valor) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.nome = nome.trim();
        this.valor = valor;
    }

    public ServicoItem(String nome, String valor) {
        this(nome, new BigDecimal(valor));
    }

    public String nome() {
        return nome;
    }

    public BigDecimal valor() {
        return valor;
    }

    @Override
    public void aceitar(PedidoItemVisitor visitor) {
        visitor.visitarServico(this);
    }
}
```

---

## DescontoItem

Crie:

```text
src\br\com\curso\aula242\pedido\elemento\DescontoItem.java
```

Código:

```java
package br.com.curso.aula242.pedido.elemento;

import br.com.curso.aula242.pedido.visitor.PedidoItemVisitor;

import java.math.BigDecimal;

public class DescontoItem implements ItemPedido {
    private final String motivo;
    private final BigDecimal valor;

    public DescontoItem(String motivo, BigDecimal valor) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.motivo = motivo.trim();
        this.valor = valor;
    }

    public DescontoItem(String motivo, String valor) {
        this(motivo, new BigDecimal(valor));
    }

    public String motivo() {
        return motivo;
    }

    public BigDecimal valor() {
        return valor;
    }

    @Override
    public void aceitar(PedidoItemVisitor visitor) {
        visitor.visitarDesconto(this);
    }
}
```

---

## TotalPedidoVisitor

Crie:

```text
src\br\com\curso\aula242\pedido\visitor\TotalPedidoVisitor.java
```

Código:

```java
package br.com.curso.aula242.pedido.visitor;

import br.com.curso.aula242.pedido.elemento.DescontoItem;
import br.com.curso.aula242.pedido.elemento.ProdutoFisicoItem;
import br.com.curso.aula242.pedido.elemento.ServicoItem;

import java.math.BigDecimal;

public class TotalPedidoVisitor implements PedidoItemVisitor {
    private BigDecimal total = BigDecimal.ZERO;

    @Override
    public void visitarProdutoFisico(ProdutoFisicoItem item) {
        total = total.add(item.valorUnitario().multiply(BigDecimal.valueOf(item.quantidade())));
    }

    @Override
    public void visitarServico(ServicoItem item) {
        total = total.add(item.valor());
    }

    @Override
    public void visitarDesconto(DescontoItem item) {
        total = total.subtract(item.valor());
    }

    public BigDecimal total() {
        return total;
    }
}
```

---

## ResumoPedidoVisitor

Crie:

```text
src\br\com\curso\aula242\pedido\visitor\ResumoPedidoVisitor.java
```

Código:

```java
package br.com.curso.aula242.pedido.visitor;

import br.com.curso.aula242.pedido.elemento.DescontoItem;
import br.com.curso.aula242.pedido.elemento.ProdutoFisicoItem;
import br.com.curso.aula242.pedido.elemento.ServicoItem;

public class ResumoPedidoVisitor implements PedidoItemVisitor {
    private final StringBuilder builder = new StringBuilder();

    @Override
    public void visitarProdutoFisico(ProdutoFisicoItem item) {
        builder.append("- Produto: ")
                .append(item.nome())
                .append(" | qtd=")
                .append(item.quantidade())
                .append(" | unitário=")
                .append(item.valorUnitario())
                .append("\n");
    }

    @Override
    public void visitarServico(ServicoItem item) {
        builder.append("- Serviço: ")
                .append(item.nome())
                .append(" | valor=")
                .append(item.valor())
                .append("\n");
    }

    @Override
    public void visitarDesconto(DescontoItem item) {
        builder.append("- Desconto: ")
                .append(item.motivo())
                .append(" | valor=-")
                .append(item.valor())
                .append("\n");
    }

    public String resultado() {
        return builder.toString();
    }
}
```

---

## PedidoVisitorApp

Crie:

```text
src\br\com\curso\aula242\app\PedidoVisitorApp.java
```

Código:

```java
package br.com.curso.aula242.app;

import br.com.curso.aula242.pedido.elemento.DescontoItem;
import br.com.curso.aula242.pedido.elemento.ItemPedido;
import br.com.curso.aula242.pedido.elemento.ProdutoFisicoItem;
import br.com.curso.aula242.pedido.elemento.ServicoItem;
import br.com.curso.aula242.pedido.visitor.ResumoPedidoVisitor;
import br.com.curso.aula242.pedido.visitor.TotalPedidoVisitor;

import java.util.List;

public class PedidoVisitorApp {
    public static void main(String[] args) {
        List<ItemPedido> itens = List.of(
                new ProdutoFisicoItem("Notebook", 1, "3500.00"),
                new ProdutoFisicoItem("Mouse", 2, "80.00"),
                new ServicoItem("Instalação", "120.00"),
                new DescontoItem("Cupom promocional", "100.00")
        );

        ResumoPedidoVisitor resumo = new ResumoPedidoVisitor();
        TotalPedidoVisitor total = new TotalPedidoVisitor();

        for (ItemPedido item : itens) {
            item.aceitar(resumo);
            item.aceitar(total);
        }

        System.out.println(resumo.resultado());
        System.out.println("Total do pedido: R$ " + total.total());
    }
}
```

---

# Parte 14 — Vantagens do Visitor

Visitor é bom quando:

```text
você tem muitos tipos de elementos;
a estrutura de tipos é relativamente estável;
você precisa adicionar várias operações;
não quer poluir os elementos com métodos de exportação, validação, cálculo etc.;
as operações variam mais que os tipos de elementos.
```

Exemplo:

```text
Documento tem elementos fixos.
Operações novas aparecem com frequência.
```

---

# Parte 15 — Desvantagens do Visitor

Visitor fica ruim quando os tipos de elementos mudam muito.

Por quê?

Se você adicionar um novo elemento:

```text
VideoDocumento
```

precisa alterar a interface:

```java
void visitarVideo(VideoDocumento video);
```

E todos os visitors existentes precisam implementar esse método.

Então Visitor favorece:

```text
adicionar novas operações
```

mas dificulta:

```text
adicionar novos tipos de elemento.
```

Essa é a troca principal.

---

# Parte 16 — Quando usar Visitor

Use Visitor quando:

```text
estrutura de elementos é estável;
operações novas aparecem com frequência;
há vários tipos de elementos;
operações dependem do tipo concreto do elemento;
não quer colocar muitas operações nos elementos;
quer separar exportação, validação, cálculo, resumo etc.
```

---

## Quando evitar

Evite Visitor quando:

```text
existem poucos tipos simples;
os tipos de elementos mudam toda hora;
uma interface ficaria grande demais;
um método simples resolve;
Strategy resolveria melhor;
o padrão deixaria o código difícil para o time.
```

---

# Parte 17 — Checklist para aplicar Visitor

Pergunte:

```text
1. Tenho uma estrutura com tipos diferentes de elementos?
2. Preciso aplicar várias operações nessa estrutura?
3. Os elementos são relativamente estáveis?
4. As operações mudam com frequência?
5. Quero evitar poluir os elementos?
6. Cada visitor teria responsabilidade clara?
7. A interface visitor não ficaria enorme?
8. Adicionar novo elemento seria raro?
9. Composite ou Iterator também participam?
10. O ganho justifica a complexidade?
```

---

# Parte 18 — Como isso conversa com backend real

Visitor pode aparecer em:

```text
validação de árvore de regras;
exportação de checklist;
geração de relatório;
processamento de documento;
cálculo sobre itens heterogêneos;
serialização customizada;
análise de permissões;
interpretação de expressões;
geração de HTML/Markdown/JSON;
validação de configuração composta.
```

Exemplo realista:

```text
Checklist de atendimento:
- exportar para PDF;
- validar obrigatórias;
- gerar resumo;
- contar respostas;
- calcular percentual de conclusão.
```

Cada operação pode ser um visitor.

---

# Parte 19 — Como isso conversa com front-end

O front pode receber uma estrutura:

```json
{
  "tipo": "SECAO",
  "titulo": "Entrega",
  "itens": [
    {
      "tipo": "PERGUNTA",
      "texto": "Produto entregue?",
      "resposta": "Sim"
    }
  ]
}
```

O backend pode usar Visitor para:

```text
validar antes de salvar;
calcular progresso;
exportar para relatório;
gerar resumo;
montar resposta enriquecida.
```

O front não precisa saber que o backend usou Visitor.

---

# Parte 20 — Erros comuns com Visitor

## 1. Usar Visitor em estrutura pequena demais

Se há dois tipos simples e uma operação, pode ser exagero.

---

## 2. Interface Visitor gigante

Se existem muitos tipos de elementos, a interface pode ficar pesada.

---

## 3. Elementos mudando toda hora

Visitor sofre quando novos elementos são adicionados frequentemente.

---

## 4. Visitor com responsabilidades misturadas

Ruim:

```text
Visitor que valida, exporta, salva banco e envia e-mail.
```

Melhor:

```text
ValidadorVisitor;
ExportadorVisitor;
ResumoVisitor.
```

---

## 5. Visitor acessando infraestrutura demais

Visitor deve processar estrutura.

Se ele começa a chamar repository, API externa e banco diretamente, revise o desenho.

---

# Parte 21 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula242.app.DocumentoVisitorApp
java -cp out br.com.curso.aula242.app.ChecklistVisitorApp
java -cp out br.com.curso.aula242.app.PedidoVisitorApp
```

Depois responda:

```text
1. Qual interface representa o visitor de documento?
2. Quais elementos de documento foram criados?
3. Qual método todo elemento visitável implementa?
4. Qual visitor exporta texto?
5. Qual visitor conta palavras?
6. Qual visitor valida documento?
7. Como Composite apareceu no checklist?
8. Como Visitor apareceu no pedido?
9. Qual diferença entre Visitor e Iterator?
10. Quando Visitor seria exagerado?
```

---

# Parte 22 — Exercício prático principal

## Contexto

Crie Visitor para uma estrutura de relatório financeiro.

Elementos:

```text
ReceitaItem;
DespesaItem;
ImpostoItem;
SubtotalItem.
```

Visitors:

```text
TotalFinanceiroVisitor;
ResumoFinanceiroVisitor;
ValidadorFinanceiroVisitor.
```

---

## Regras

## ReceitaItem

Campos:

```text
descricao;
valor;
```

Soma no total.

## DespesaItem

Campos:

```text
descricao;
valor;
```

Subtrai no total.

## ImpostoItem

Campos:

```text
descricao;
valor;
```

Subtrai no total.

## SubtotalItem

Campos:

```text
descricao;
valor;
```

Apenas aparece no resumo, mas não altera total final.

---

## Critérios

```text
cada item deve implementar aceitar(visitor);
visitor deve ter método específico para cada tipo;
TotalFinanceiroVisitor calcula total;
ResumoFinanceiroVisitor monta texto;
ValidadorFinanceiroVisitor valida valores positivos;
não colocar cálculo total dentro dos itens.
```

---

# Parte 23 — Desafio extra

## Visitor para checklist completo

Evolua o exemplo de checklist criando:

```text
PercentualConclusaoChecklistVisitor
```

Regras:

```text
total de perguntas;
total respondidas;
percentual = respondidas / total * 100.
```

Também crie:

```text
PerguntasPendentesVisitor
```

Deve listar perguntas obrigatórias sem resposta.

Critérios:

```text
não alterar PerguntaChecklist;
não alterar SecaoChecklist;
criar apenas novos visitors;
app deve aplicar os novos visitors na mesma estrutura.
```

---

# Parte 24 — Simulado rápido

## Questão 1

Visitor Pattern é usado principalmente para:

```text
A) adicionar operações sobre uma estrutura de objetos sem poluir as classes dos elementos.
B) controlar acesso a objeto real.
C) salvar snapshot de estado.
D) percorrer página de banco.
```

---

## Questão 2

No Visitor, o método `aceitar` normalmente:

```text
A) chama o método específico do visitor para aquele tipo.
B) salva no banco.
C) cria proxy.
D) adapta API externa.
```

---

## Questão 3

Visitor combina bem com:

```text
A) Composite.
B) Singleton obrigatório.
C) apenas enums.
D) apenas SQL.
```

---

## Questão 4

Visitor é bom quando:

```text
A) a estrutura de elementos é estável e novas operações surgem com frequência.
B) novos tipos de elementos surgem o tempo todo.
C) não há operações sobre objetos.
D) existe apenas uma String.
```

---

## Questão 5

Uma desvantagem do Visitor é:

```text
A) adicionar novo tipo de elemento exige alterar a interface visitor e os visitors existentes.
B) não permitir polimorfismo.
C) não compilar em Java.
D) impedir uso de classes.
```

---

## Questão 6

Visitor se diferencia de Iterator porque:

```text
A) Iterator percorre; Visitor executa operações por tipo de elemento.
B) Iterator sempre exporta HTML.
C) Visitor sempre pagina banco.
D) Não existe diferença.
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

# Parte 25 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Visitor Pattern.
[ ] Sei criar interface Visitor.
[ ] Sei criar elemento visitável.
[ ] Sei implementar aceitar(visitor).
[ ] Sei criar visitor de exportação.
[ ] Sei criar visitor de validação.
[ ] Sei criar visitor de cálculo.
[ ] Sei aplicar Visitor em documento.
[ ] Sei aplicar Visitor em checklist.
[ ] Sei aplicar Visitor em pedido.
[ ] Sei diferenciar Visitor de Iterator.
[ ] Sei diferenciar Visitor de Composite.
[ ] Sei explicar double dispatch.
[ ] Sei saber quando Visitor é exagerado.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Visitor Pattern?
2. Qual problema ele resolve?
3. O que é um elemento visitável?
4. O que é um visitor?
5. O que o método aceitar faz?
6. O que é double dispatch?
7. Qual diferença entre Visitor e Iterator?
8. Qual diferença entre Visitor e Composite?
9. Qual maior vantagem do Visitor?
10. Qual maior desvantagem do Visitor?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma estrutura visitável;
criar visitors diferentes;
separar operações dos elementos;
aplicar visitor em documento;
aplicar visitor em checklist;
aplicar visitor em itens heterogêneos de pedido;
resolver exercício financeiro;
resolver desafio de checklist;
explicar vantagens e desvantagens.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-242-visitor-pattern-operacoes-em-estruturas-objetos
git commit -m "Aula 242: visitor pattern operacoes em estruturas objetos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Visitor Pattern permite adicionar operações a uma estrutura de objetos sem espalhar essas operações pelas classes dos elementos.
```

Você estudou:

```text
Visitor Pattern;
elementos visitáveis;
visitor;
double dispatch;
documento;
exportação;
contagem;
validação;
checklist;
Composite com Visitor;
pedido com itens heterogêneos;
vantagens;
desvantagens;
diferença para Iterator, Composite, Strategy e Observer.
```

Na próxima aula, vamos estudar:

```text
Interpreter Pattern.
```

A ideia será representar e avaliar pequenas linguagens, expressões e regras, útil para filtros, políticas, DSLs simples, validações configuráveis e motores de regras básicos.
