# 084 — M2.23 — Text blocks

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.23.01` — Text blocks — Conceito profundo e quando usar.
- `M2.23.02` — Text blocks — Implementação guiada com código realista.
- `M2.23.03` — Text blocks — Refatoração, melhoria e leitura crítica.
- `M2.23.04` — Text blocks — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar strings multilinha, JSON/SQL em testes, formatação, indentação, quebras de linha, `stripIndent`, `formatted`, armadilhas, leitura crítica, refatoração e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
080 — M2.19 — Annotations básicas;
081 — M2.20 — Reflection conceitual;
082 — M2.21 — Sealed classes e interfaces;
083 — M2.22 — Pattern matching;
084 — M2.23 — Text blocks.
```

Na aula anterior, estudamos pattern matching.

Agora vamos estudar um recurso moderno do Java para lidar melhor com textos longos:

```text
text blocks.
```

Text blocks ajudam quando precisamos escrever strings multilinha, como:

```text
JSON;
SQL;
HTML;
XML;
mensagens formatadas;
templates simples;
payloads de teste;
respostas simuladas;
logs esperados;
corpos de e-mail;
documentação curta.
```

Antes dos text blocks, escrever esses textos exigia muita concatenação e muitos caracteres de escape.

Com text blocks, o código fica mais legível.

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
084 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 84
Aulas oficiais restantes: 454
```

Contando o arquivo de abertura `000`, teremos:

```text
85 arquivos gerados no total.
```

Ainda estamos no Módulo 2, consolidando recursos modernos e fundamentos avançados de Java Core antes de entrar com mais profundidade em exceções, classes, encapsulamento, coleções, Maven, banco de dados, Spring Boot e arquitetura backend.

---

## A pergunta central da aula

Imagine que você precisa escrever este JSON em Java:

```json
{
  "nome": "Ana",
  "email": "ana@email.com",
  "ativo": true
}
```

Antes, seria comum fazer:

```java
String json = "{\n"
        + "  \"nome\": \"Ana\",\n"
        + "  \"email\": \"ana@email.com\",\n"
        + "  \"ativo\": true\n"
        + "}";
```

Funciona.

Mas é ruim de ler.

Com text block:

```java
String json = """
        {
          "nome": "Ana",
          "email": "ana@email.com",
          "ativo": true
        }
        """;
```

Fica muito mais parecido com o texto real.

Essa é a ideia:

```text
representar texto multilinha de forma legível dentro do código Java.
```

---

## O que é text block

Text block é uma string multilinha delimitada por três aspas duplas:

```java
"""
texto
"""
```

Exemplo:

```java
String mensagem = """
        Olá,
        seja bem-vindo ao sistema.
        """;
```

O resultado é uma `String`.

Text block não cria um tipo novo.

Ele apenas facilita a escrita de strings longas e multilinha.

---

## Requisito de versão

Text blocks são recurso moderno do Java.

Em projetos Java 17 LTS, você pode usar normalmente.

Verifique:

```powershell
java -version
javac -version
```

Se o ambiente estiver em Java antigo, o código pode não compilar.

---

## Vocabulário essencial

Termos desta aula:

```text
text block;
string multilinha;
três aspas;
indentação;
quebra de linha;
escape;
JSON;
SQL;
HTML;
XML;
payload;
template;
formatação;
formatted;
stripIndent;
translateEscapes;
legibilidade;
concatenação;
caractere especial;
aspas duplas;
barra invertida;
linha final;
espaços;
tabs.
```

Termos mais importantes:

```text
text block -> String multilinha delimitada por três aspas duplas;
indentação incidental -> indentação removida automaticamente pelo compilador;
quebra de linha final -> text block normalmente inclui uma quebra de linha no fim;
escape -> sequência especial como \n, \t ou \";
formatted -> método para substituir placeholders em String;
stripIndent -> ajusta indentação de texto;
payload -> corpo textual enviado ou recebido em API;
template -> texto-base com partes variáveis.
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
        String texto = """
                Java
                Backend
                Profissional
                """;

        System.out.println(texto);
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
Java
Backend
Profissional
```

Observe que a string tem três linhas.

---

## Text block é String

Arquivo:

```text
TextBlockEhString.java
```

Código:

```java
public class TextBlockEhString {
    public static void main(String[] args) {
        String texto = """
                Olá, mundo.
                """;

        System.out.println(texto.getClass().getSimpleName());
        System.out.println(texto.length());
    }
}
```

Saída aproximada:

```text
String
12
```

O text block vira uma `String`.

Você pode usar métodos de `String`:

```java
length()
toUpperCase()
contains()
replace()
formatted()
strip()
```

---

## Abertura do text block

A abertura precisa ser:

```java
String texto = """
        conteúdo
        """;
```

Não pode ser assim:

```java
String texto = """conteúdo""";
```

O conteúdo começa depois da quebra de linha após as três aspas.

Arquivo de erro proposital:

```text
ErroAberturaTextBlock.java
```

Código:

```java
public class ErroAberturaTextBlock {
    public static void main(String[] args) {
        String texto = """Olá""";

        System.out.println(texto);
    }
}
```

Esse código não compila.

Regra:

```text
text block começa com três aspas seguidas de quebra de linha.
```

---

## Quebra de linha final

Text block normalmente inclui uma quebra de linha final.

Exemplo:

```java
String texto = """
        Ana
        """;
```

Isso equivale aproximadamente a:

```text
"Ana\n"
```

Arquivo:

```text
QuebraLinhaFinal.java
```

Código:

```java
public class QuebraLinhaFinal {
    public static void main(String[] args) {
        String texto = """
                Ana
                """;

        System.out.println("[" + texto + "]");
        System.out.println("Tamanho: " + texto.length());
    }
}
```

Saída visual:

```text
[Ana
]
Tamanho: 4
```

Três letras mais a quebra de linha.

Se isso importar, use:

```java
strip()
```

ou ajuste a posição das aspas finais, dependendo do caso.

---

## Removendo espaços com strip

Arquivo:

```text
TextBlockStrip.java
```

Código:

```java
public class TextBlockStrip {
    public static void main(String[] args) {
        String texto = """
                Ana
                """;

        System.out.println("Original: [" + texto + "]");
        System.out.println("Com strip: [" + texto.strip() + "]");
    }
}
```

`strip()` remove espaços e quebras no começo e no fim.

Use quando você quer comparar ou exibir sem sobra.

---

## Indentação incidental

Um dos pontos mais importantes dos text blocks é a indentação.

Observe:

```java
String json = """
        {
          "nome": "Ana"
        }
        """;
```

Embora o código esteja indentado dentro do método, o Java remove a indentação incidental.

Ou seja, a string final começa com:

```json
{
  "nome": "Ana"
}
```

e não com oito espaços antes do `{`.

Isso permite manter o código Java bonito sem estragar o texto.

---

## Exemplo de indentação

Arquivo:

```text
IndentacaoTextBlock.java
```

Código:

```java
public class IndentacaoTextBlock {
    public static void main(String[] args) {
        String json = """
                {
                  "nome": "Ana",
                  "email": "ana@email.com"
                }
                """;

        System.out.println(json);
    }
}
```

Saída:

```json
{
  "nome": "Ana",
  "email": "ana@email.com"
}
```

A indentação do Java não vazou para o JSON.

---

## Aspas duplas dentro do text block

Com text block, você normalmente não precisa escapar aspas duplas comuns.

Antes:

```java
String json = "{\"nome\":\"Ana\"}";
```

Com text block:

```java
String json = """
        {
          "nome": "Ana"
        }
        """;
```

Isso é uma das maiores vantagens para JSON.

Arquivo:

```text
AspasNoTextBlock.java
```

Código:

```java
public class AspasNoTextBlock {
    public static void main(String[] args) {
        String json = """
                {
                  "mensagem": "Olá, Ana!"
                }
                """;

        System.out.println(json);
    }
}
```

---

## Escape ainda existe

Mesmo em text blocks, escapes continuam existindo.

Exemplo:

```java
String texto = """
        Linha 1\nLinha 2
        """;
```

O `\n` ainda representa quebra de linha.

Mas muitas vezes você não precisa usar `\n`, porque o text block já é multilinha.

Também é possível usar:

```text
\t
\"
\\
```

Use apenas quando necessário.

---

## JSON em text block

Arquivo:

```text
JsonTextBlock.java
```

Código:

```java
public class JsonTextBlock {
    public static void main(String[] args) {
        String json = """
                {
                  "nome": "Ana",
                  "email": "ana@email.com",
                  "ativo": true
                }
                """;

        System.out.println(json);
    }
}
```

Esse tipo de uso é comum em:

```text
testes de API;
payloads simulados;
documentação;
mock de integração;
exemplos.
```

No futuro, quando usarmos bibliotecas JSON, você não vai montar tudo na mão em produção.

Mas em teste e exemplos, text block é muito útil.

---

## JSON com valores dinâmicos usando formatted

Text block combina bem com:

```java
formatted()
```

Arquivo:

```text
JsonTextBlockFormatted.java
```

Código:

```java
public class JsonTextBlockFormatted {
    public static void main(String[] args) {
        String nome = "Ana";
        String email = "ana@email.com";

        String json = """
                {
                  "nome": "%s",
                  "email": "%s",
                  "ativo": true
                }
                """.formatted(nome, email);

        System.out.println(json);
    }
}
```

Saída:

```json
{
  "nome": "Ana",
  "email": "ana@email.com",
  "ativo": true
}
```

Cuidado:

```text
formatted não escapa JSON automaticamente.
```

Se o valor tiver aspas ou caracteres especiais, você precisa de biblioteca JSON em código real.

---

## Cuidado com JSON manual

Este exemplo é perigoso:

```java
String nome = "Ana \"Teste\"";

String json = """
        {
          "nome": "%s"
        }
        """.formatted(nome);
```

Pode gerar JSON inválido.

Regra profissional:

```text
text block é ótimo para payload fixo ou teste;
para JSON dinâmico real, prefira biblioteca de serialização.
```

No futuro, veremos Jackson e DTOs.

---

## SQL em text block

Text blocks são excelentes para SQL legível.

Arquivo:

```text
SqlTextBlock.java
```

Código:

```java
public class SqlTextBlock {
    public static void main(String[] args) {
        String sql = """
                select
                    p.id,
                    p.nome,
                    p.preco
                from produto p
                where p.status = ?
                order by p.nome
                """;

        System.out.println(sql);
    }
}
```

Muito melhor que:

```java
String sql = "select p.id, p.nome, p.preco "
        + "from produto p "
        + "where p.status = ? "
        + "order by p.nome";
```

---

## Cuidado com SQL dinâmico

Não use text block para concatenar SQL inseguro com entrada do usuário.

Ruim:

```java
String sql = """
        select * from cliente
        where email = '%s'
        """.formatted(emailDigitado);
```

Isso pode abrir risco de SQL injection em sistemas reais.

Regra:

```text
text block melhora legibilidade do SQL;
não substitui parâmetros preparados.
```

Quando chegarmos em banco, usaremos parâmetros.

---

## HTML em text block

Arquivo:

```text
HtmlTextBlock.java
```

Código:

```java
public class HtmlTextBlock {
    public static void main(String[] args) {
        String html = """
                <html>
                  <body>
                    <h1>Olá, Ana</h1>
                    <p>Bem-vinda ao sistema.</p>
                  </body>
                </html>
                """;

        System.out.println(html);
    }
}
```

Útil para:

```text
template simples;
teste;
mock;
exemplo didático.
```

Em sistema real, e-mail/HTML costuma usar template engine.

---

## Mensagem multilinha

Arquivo:

```text
MensagemMultilinha.java
```

Código:

```java
public class MensagemMultilinha {
    public static void main(String[] args) {
        String mensagem = """
                Olá, Ana.

                Seu pedido foi aprovado com sucesso.

                Obrigado.
                """;

        System.out.println(mensagem);
    }
}
```

Text block preserva linhas em branco.

Isso ajuda em mensagens longas.

---

## Text block com formatted para mensagem

Arquivo:

```text
MensagemFormatted.java
```

Código:

```java
public class MensagemFormatted {
    public static void main(String[] args) {
        String cliente = "Ana";
        String pedido = "PED-001";

        String mensagem = """
                Olá, %s.

                Seu pedido %s foi aprovado com sucesso.

                Obrigado.
                """.formatted(cliente, pedido);

        System.out.println(mensagem);
    }
}
```

Boa prática:

```text
nomes das variáveis devem deixar clara a ordem dos placeholders.
```

Se houver muitos placeholders, talvez seja melhor outro mecanismo.

---

## Text block e alinhamento de fechamento

A posição das aspas finais influencia a indentação removida.

Compare mentalmente:

```java
String texto = """
        linha 1
        linha 2
        """;
```

com:

```java
String texto = """
linha 1
linha 2
""";
```

O primeiro mantém o código mais bonito dentro do método.

O segundo encosta o texto na margem.

Em código profissional, geralmente mantemos o text block indentado com o código.

---

## Usando stripIndent

`stripIndent()` pode ajustar indentação de uma string multilinha.

Arquivo:

```text
StripIndentExemplo.java
```

Código:

```java
public class StripIndentExemplo {
    public static void main(String[] args) {
        String texto = """
                    linha 1
                    linha 2
                    linha 3
                """;

        System.out.println(texto.stripIndent());
    }
}
```

Na prática, text blocks já fazem remoção de indentação incidental.

`stripIndent` é mais útil quando você recebe ou manipula strings multilinha.

---

## Usando indent

Também existe:

```java
indent(int n)
```

Arquivo:

```text
IndentExemplo.java
```

Código:

```java
public class IndentExemplo {
    public static void main(String[] args) {
        String texto = """
                linha 1
                linha 2
                """;

        System.out.println(texto.indent(4));
    }
}
```

Isso adiciona indentação.

Pode ser útil ao montar relatórios simples.

---

## Aplicação em cliente

Arquivo:

```text
ClienteTextBlock.java
```

Código:

```java
public class ClienteTextBlock {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com", true);

        String json = montarJsonCliente(cliente);

        System.out.println(json);
    }

    public static String montarJsonCliente(ClienteResumo cliente) {
        return """
                {
                  "nome": "%s",
                  "email": "%s",
                  "ativo": %s
                }
                """.formatted(cliente.nome(), cliente.email(), cliente.ativo());
    }
}

record ClienteResumo(String nome, String email, boolean ativo) {
}
```

Cenário didático:

```text
montar JSON simples de cliente.
```

Observação profissional:

```text
em produção, use biblioteca JSON.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoTextBlock.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoTextBlock {
    public static void main(String[] args) {
        ProdutoResumo produto = new ProdutoResumo("Cadeira", new BigDecimal("199.90"), "ATIVO");

        String sql = montarSqlConsultaProduto();

        System.out.println(sql);
        System.out.println(produto);
    }

    public static String montarSqlConsultaProduto() {
        return """
                select
                    p.id,
                    p.nome,
                    p.preco,
                    p.status
                from produto p
                where p.status = ?
                order by p.nome
                """;
    }
}

record ProdutoResumo(String nome, BigDecimal preco, String status) {
}
```

Aqui text block ajuda com SQL legível.

---

## Aplicação em pedido

Arquivo:

```text
PedidoTextBlock.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoTextBlock {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo("PED-001", "Ana", new BigDecimal("250.00"));

        String resumo = montarResumoPedido(pedido);

        System.out.println(resumo);
    }

    public static String montarResumoPedido(PedidoResumo pedido) {
        return """
                Pedido: %s
                Cliente: %s
                Total: %s
                """.formatted(pedido.codigo(), pedido.cliente(), pedido.total());
    }
}

record PedidoResumo(String codigo, String cliente, BigDecimal total) {
}
```

Text block funciona bem para resumo multilinha.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoTextBlock.java
```

Código:

```java
import java.math.BigDecimal;
import java.time.Instant;

public class PagamentoTextBlock {
    public static void main(String[] args) {
        PagamentoResumo pagamento = new PagamentoResumo(
                "PAG-001",
                "PIX",
                new BigDecimal("100.00"),
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(montarEventoPagamento(pagamento));
    }

    public static String montarEventoPagamento(PagamentoResumo pagamento) {
        return """
                {
                  "codigo": "%s",
                  "forma": "%s",
                  "valor": "%s",
                  "criadoEm": "%s"
                }
                """.formatted(
                pagamento.codigo(),
                pagamento.forma(),
                pagamento.valor(),
                pagamento.criadoEm()
        );
    }
}

record PagamentoResumo(String codigo, String forma, BigDecimal valor, Instant criadoEm) {
}
```

Uso didático:

```text
payload de evento de pagamento.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoTextBlock.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;

public class OrdemServicoTextBlock {
    public static void main(String[] args) {
        OrdemServicoResumo os = new OrdemServicoResumo(
                "OS-001",
                "AGENDADA",
                LocalDate.of(2026, 7, 10),
                LocalTime.of(14, 30)
        );

        System.out.println(montarResumo(os));
    }

    public static String montarResumo(OrdemServicoResumo os) {
        return """
                Ordem de Serviço
                ----------------
                Certificado: %s
                Status: %s
                Data: %s
                Hora: %s
                """.formatted(os.certificado(), os.status(), os.data(), os.hora());
    }
}

record OrdemServicoResumo(String certificado, String status, LocalDate data, LocalTime hora) {
}
```

Text block deixa o relatório simples mais claro.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaTextBlock.java
```

Código:

```java
public class MensageriaTextBlock {
    public static void main(String[] args) {
        MensagemResumo mensagem = new MensagemResumo("Ana", "OS-001", "Confirmação de entrega");

        System.out.println(montarMensagem(mensagem));
    }

    public static String montarMensagem(MensagemResumo mensagem) {
        return """
                Olá, %s.

                Estamos entrando em contato sobre a OS %s.
                Tipo da mensagem: %s.

                Obrigado.
                """.formatted(mensagem.cliente(), mensagem.certificado(), mensagem.tipo());
    }
}

record MensagemResumo(String cliente, String certificado, String tipo) {
}
```

Text block é útil para mensagens longas.

Cuidado:

```text
templates reais podem exigir ferramenta apropriada.
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaTextBlock.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaTextBlock {
    public static void main(String[] args) {
        AuditoriaResumo auditoria = new AuditoriaResumo(
                "aline",
                "CRIACAO",
                "Produto",
                10L,
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(montarLinhaDetalhada(auditoria));
    }

    public static String montarLinhaDetalhada(AuditoriaResumo auditoria) {
        return """
                Auditoria
                ---------
                Usuário: %s
                Operação: %s
                Entidade: %s
                ID: %s
                Criado em: %s
                """.formatted(
                auditoria.usuario(),
                auditoria.operacao(),
                auditoria.entidade(),
                auditoria.entidadeId(),
                auditoria.criadoEm()
        );
    }
}

record AuditoriaResumo(String usuario, String operacao, String entidade, Long entidadeId, Instant criadoEm) {
}
```

---

## Refatoração: concatenação para text block

Antes:

```java
String json = "{\n"
        + "  \"nome\": \"Ana\",\n"
        + "  \"email\": \"ana@email.com\"\n"
        + "}";
```

Depois:

```java
String json = """
        {
          "nome": "Ana",
          "email": "ana@email.com"
        }
        """;
```

Ganho:

```text
menos escape;
menos concatenação;
mais parecido com o texto real;
melhor revisão em pull request;
menor chance de esquecer quebra de linha.
```

---

## Refatoração: SQL quebrado para SQL legível

Antes:

```java
String sql = "select p.id, p.nome, p.preco "
        + "from produto p "
        + "where p.status = ? "
        + "order by p.nome";
```

Depois:

```java
String sql = """
        select
            p.id,
            p.nome,
            p.preco
        from produto p
        where p.status = ?
        order by p.nome
        """;
```

Ganho:

```text
SQL legível;
mais fácil de copiar para ferramenta de banco;
mais fácil revisar filtros;
mais fácil manter.
```

---

## Refatoração: muitos placeholders para objeto/template

Se o text block tiver muitos placeholders:

```java
"""
...
%s
%s
%s
%s
%s
%s
%s
...
""".formatted(a, b, c, d, e, f, g)
```

pode ficar perigoso.

Alternativas:

```text
usar DTO;
usar template engine;
usar biblioteca JSON;
dividir método;
dar nomes melhores;
usar record para agrupar dados.
```

Regra:

```text
text block melhora o texto, mas não resolve modelagem ruim.
```

---

## Quando usar text block

Use text block quando:

```text
o texto tem várias linhas;
o texto precisa preservar formato;
há muitas aspas internas;
é JSON fixo de teste;
é SQL legível;
é HTML/XML simples;
é mensagem multilinha;
é payload de exemplo;
é retorno esperado em teste;
a concatenação atrapalha leitura.
```

Bons cenários:

```text
testes;
mocks;
documentação;
queries SQL;
payloads fixos;
mensagens simples;
exemplos didáticos.
```

---

## Quando evitar text block

Evite text block quando:

```text
a string é curta;
o conteúdo é totalmente dinâmico;
há risco de JSON/SQL inseguro;
uma biblioteca apropriada resolve melhor;
muitos placeholders deixam confuso;
a indentação fica difícil de entender;
o texto deveria ficar em arquivo externo;
o template é grande demais;
precisa de internacionalização;
precisa de escape automático.
```

Exemplo:

```text
JSON dinâmico de produção -> use biblioteca JSON;
HTML complexo -> use template engine;
SQL com entrada do usuário -> use parâmetros;
mensagens traduzidas -> use mecanismo de i18n.
```

---

## Erros comuns

### Erro 1 — Tentar abrir e fechar text block na mesma linha

Não compila.

---

### Erro 2 — Esquecer quebra de linha final

Text block geralmente inclui `\n` no final.

---

### Erro 3 — Usar text block para JSON dinâmico sem escape

Pode gerar JSON inválido.

---

### Erro 4 — Usar text block para SQL inseguro

Text block não protege contra SQL injection.

---

### Erro 5 — Colocar placeholders demais

Fica difícil saber qual `%s` recebe qual valor.

---

### Erro 6 — Confundir indentação do código com indentação do texto

Entenda indentação incidental.

---

### Erro 7 — Usar text block para string curta

Pode ser exagero.

---

### Erro 8 — Guardar template gigante no código

Talvez arquivo externo seja melhor.

---

### Erro 9 — Misturar tabs e espaços

Pode gerar resultado visual confuso.

---

### Erro 10 — Achar que text block substitui biblioteca especializada

Não substitui JSON parser, SQL parametrizado, template engine ou i18n.

---

## Diagnóstico de text block

Quando revisar um text block, pergunte:

### 1. O texto realmente é multilinha?

Se não, talvez string comum baste.

### 2. O texto ficou mais legível?

Esse é o objetivo.

### 3. Há muitos placeholders?

Se sim, cuidado.

### 4. É JSON dinâmico?

Considere biblioteca JSON.

### 5. É SQL com entrada do usuário?

Use parâmetros.

### 6. A quebra de linha final importa?

Teste com colchetes ou `length`.

### 7. A indentação ficou correta?

Compare saída real.

### 8. Há dados sensíveis no texto?

Não fixe segredo no código.

### 9. O texto deveria estar externo?

Templates grandes podem ir para arquivo.

### 10. O teste cobre a saída?

Se a formatação importa, teste.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugTextBlock {
    public static void main(String[] args) {
        String json = """
                {
                  "nome": "Ana"
                }
                """;

        System.out.println("[" + json + "]");
        System.out.println(json.length());
    }
}
```

Coloque breakpoint em:

```java
System.out.println("[" + json + "]");
```

Observe:

```text
conteúdo da string;
quebras de linha;
indentação;
quebra final;
tamanho.
```

Depois teste:

```java
json.strip()
```

e compare.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — abertura inválida

```java
String texto = """Olá""";
```

Explique por que não compila.

---

### Teste 2 — quebra final inesperada

```java
String texto = """
        Ana
        """;

System.out.println("[" + texto + "]");
```

Explique por que o colchete fecha na linha de baixo.

---

### Teste 3 — JSON manual com aspas

Use nome:

```java
String nome = "Ana \"Teste\"";
```

Monte JSON com `formatted`.

Explique por que pode quebrar JSON.

---

### Teste 4 — SQL inseguro

Monte SQL com:

```java
formatted(emailDigitado)
```

Explique por que isso não é seguro.

---

### Teste 5 — placeholders fora de ordem

Crie text block com três `%s`.

Passe os argumentos em ordem errada.

Explique por que isso é perigoso.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-084-text-blocks
cd labs\m2\aula-084-text-blocks
```

Crie arquivos:

```text
Main.java
TextBlockEhString.java
ErroAberturaTextBlock.java
QuebraLinhaFinal.java
TextBlockStrip.java
IndentacaoTextBlock.java
AspasNoTextBlock.java
JsonTextBlock.java
JsonTextBlockFormatted.java
SqlTextBlock.java
HtmlTextBlock.java
MensagemMultilinha.java
MensagemFormatted.java
StripIndentExemplo.java
IndentExemplo.java
ClienteTextBlock.java
ProdutoTextBlock.java
PedidoTextBlock.java
PagamentoTextBlock.java
OrdemServicoTextBlock.java
MensageriaTextBlock.java
AuditoriaTextBlock.java
DebugTextBlock.java
ErroJsonManual.java
ErroSqlInseguro.java
ErroPlaceholdersForaDeOrdem.java
README.md
```

Compile exemplos válidos:

```powershell
javac Main.java
javac TextBlockEhString.java
javac QuebraLinhaFinal.java
javac TextBlockStrip.java
javac IndentacaoTextBlock.java
javac AspasNoTextBlock.java
javac JsonTextBlock.java
javac JsonTextBlockFormatted.java
javac SqlTextBlock.java
javac HtmlTextBlock.java
javac MensagemMultilinha.java
javac MensagemFormatted.java
javac StripIndentExemplo.java
javac IndentExemplo.java
javac ClienteTextBlock.java
javac ProdutoTextBlock.java
javac PedidoTextBlock.java
javac PagamentoTextBlock.java
javac OrdemServicoTextBlock.java
javac MensageriaTextBlock.java
javac AuditoriaTextBlock.java
javac DebugTextBlock.java
```

Execute exemplos válidos:

```powershell
java Main
java TextBlockEhString
java QuebraLinhaFinal
java TextBlockStrip
java IndentacaoTextBlock
java AspasNoTextBlock
java JsonTextBlock
java JsonTextBlockFormatted
java SqlTextBlock
java HtmlTextBlock
java MensagemMultilinha
java MensagemFormatted
java StripIndentExemplo
java IndentExemplo
java ClienteTextBlock
java ProdutoTextBlock
java PedidoTextBlock
java PagamentoTextBlock
java OrdemServicoTextBlock
java MensageriaTextBlock
java AuditoriaTextBlock
java DebugTextBlock
```

Arquivos de erro ou leitura crítica:

```text
ErroAberturaTextBlock.java
ErroJsonManual.java
ErroSqlInseguro.java
ErroPlaceholdersForaDeOrdem.java
```

Use os resultados para registrar os erros comuns no diário.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 084 — Text blocks

## Objetivo

Entender text blocks em Java para escrever strings multilinha com legibilidade, especialmente JSON, SQL, HTML, mensagens, payloads de teste e textos formatados.

## Conceitos

- Text block é uma String multilinha.
- A sintaxe usa três aspas duplas.
- A abertura exige quebra de linha após as três aspas.
- Text block normalmente inclui quebra de linha final.
- Indentação incidental é removida pelo compilador.
- Aspas duplas comuns não precisam ser escapadas na maioria dos casos.
- Escapes ainda funcionam.
- `formatted` combina bem com text blocks.
- `strip` pode remover quebra final e espaços.
- Text block é ótimo para JSON fixo de teste.
- Text block é ótimo para SQL legível.
- Text block não escapa JSON automaticamente.
- Text block não protege SQL contra injection.
- Muitos placeholders podem prejudicar leitura.
- Bibliotecas especializadas ainda são necessárias em produção.

## Comandos

```powershell
javac Main.java
java Main
javac JsonTextBlock.java
java JsonTextBlock
javac SqlTextBlock.java
java SqlTextBlock
```

## Observações

- Não usar text block só por moda.
- Usar quando melhora legibilidade.
- Cuidar da quebra de linha final.
- Usar biblioteca JSON para dados dinâmicos reais.
- Usar SQL parametrizado para entrada de usuário.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver conteúdo real da String |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar criação da string |
| Variables | janela Debug | Ver quebras e tamanho |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `strip`, `formatted`, `length` |
| Reformatar código | `Ctrl + Alt + L` | Ajustar indentação |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Separar montagem de texto |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 084 — Text blocks

### O que aprendi
Aprendi que text blocks são strings multilinha em Java, úteis para JSON, SQL, HTML, mensagens e payloads de teste. Também aprendi que eles preservam quebras de linha, removem indentação incidental e normalmente incluem quebra de linha final.

### O que pratiquei
Criei exemplos com text block simples, String multilinha, JSON, JSON com `formatted`, SQL, HTML, mensagem multilinha, `strip`, `indent`, debug da quebra final e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- text block
- string multilinha
- três aspas
- quebra de linha final
- indentação incidental
- escape
- JSON
- SQL
- HTML
- mensagem
- payload
- formatted
- strip
- stripIndent
- indent
- placeholders
- legibilidade
- concatenação
- SQL injection
- serialização JSON

### Arquivos criados
- `labs/m2/aula-084-text-blocks/Main.java`
- `labs/m2/aula-084-text-blocks/TextBlockEhString.java`
- `labs/m2/aula-084-text-blocks/ErroAberturaTextBlock.java`
- `labs/m2/aula-084-text-blocks/QuebraLinhaFinal.java`
- `labs/m2/aula-084-text-blocks/TextBlockStrip.java`
- `labs/m2/aula-084-text-blocks/IndentacaoTextBlock.java`
- `labs/m2/aula-084-text-blocks/AspasNoTextBlock.java`
- `labs/m2/aula-084-text-blocks/JsonTextBlock.java`
- `labs/m2/aula-084-text-blocks/JsonTextBlockFormatted.java`
- `labs/m2/aula-084-text-blocks/SqlTextBlock.java`
- `labs/m2/aula-084-text-blocks/HtmlTextBlock.java`
- `labs/m2/aula-084-text-blocks/MensagemMultilinha.java`
- `labs/m2/aula-084-text-blocks/MensagemFormatted.java`
- `labs/m2/aula-084-text-blocks/StripIndentExemplo.java`
- `labs/m2/aula-084-text-blocks/IndentExemplo.java`
- `labs/m2/aula-084-text-blocks/ClienteTextBlock.java`
- `labs/m2/aula-084-text-blocks/ProdutoTextBlock.java`
- `labs/m2/aula-084-text-blocks/PedidoTextBlock.java`
- `labs/m2/aula-084-text-blocks/PagamentoTextBlock.java`
- `labs/m2/aula-084-text-blocks/OrdemServicoTextBlock.java`
- `labs/m2/aula-084-text-blocks/MensageriaTextBlock.java`
- `labs/m2/aula-084-text-blocks/AuditoriaTextBlock.java`
- `labs/m2/aula-084-text-blocks/DebugTextBlock.java`
- `labs/m2/aula-084-text-blocks/ErroJsonManual.java`
- `labs/m2/aula-084-text-blocks/ErroSqlInseguro.java`
- `labs/m2/aula-084-text-blocks/ErroPlaceholdersForaDeOrdem.java`
- `labs/m2/aula-084-text-blocks/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac JsonTextBlock.java
java JsonTextBlock
javac SqlTextBlock.java
java SqlTextBlock
javac AuditoriaTextBlock.java
java AuditoriaTextBlock
```

### Erros que quero evitar
- tentar abrir e fechar text block na mesma linha;
- esquecer quebra de linha final;
- usar text block para JSON dinâmico sem escape;
- usar text block para SQL inseguro;
- colocar placeholders demais;
- confundir indentação do código com indentação do texto;
- usar text block para string curta;
- guardar template gigante no código;
- misturar tabs e espaços;
- achar que text block substitui biblioteca especializada.

### Próximo passo
Estudar exceptions por baixo.
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
git add labs/m2/aula-084-text-blocks docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 084: pratica text blocks em Java"
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
1. O que é text block?
2. Text block é outro tipo ou continua sendo String?
3. Qual é a sintaxe de abertura?
4. Por que não pode escrever """texto""" na mesma linha?
5. Text block inclui quebra de linha final?
6. Como verificar a quebra final?
7. Para que serve strip?
8. O que é indentação incidental?
9. Por que text block é bom para JSON?
10. Por que text block é bom para SQL?
11. Text block escapa JSON automaticamente?
12. Text block protege contra SQL injection?
13. Para que serve formatted?
14. Qual risco de muitos placeholders?
15. Quando usar text block?
16. Quando evitar text block?
17. Quando usar biblioteca JSON em vez de montar String?
18. Quando usar SQL parametrizado?
19. Qual cuidado com templates grandes?
20. Como debuggar o conteúdo real de um text block?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar text block;
criar text block simples;
explicar que text block é String;
explicar a sintaxe de três aspas;
explicar quebra de linha final;
usar strip;
explicar indentação incidental;
usar aspas duplas dentro do texto;
usar text block com JSON;
usar text block com SQL;
usar text block com HTML;
usar text block com mensagem multilinha;
usar formatted;
explicar risco de JSON manual;
explicar risco de SQL inseguro;
explicar quando biblioteca JSON é melhor;
explicar quando SQL parametrizado é obrigatório;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar conteúdo real;
refatorar concatenação para text block;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar Jackson.

Não precisa ainda dominar template engine.

Não precisa ainda dominar JDBC.

Não precisa ainda dominar SQL parametrizado em código real.

Não precisa ainda dominar internacionalização.

Não precisa ainda dominar arquivos de recursos.

Esses assuntos virão depois.

O objetivo é dominar text blocks para strings multilinha legíveis, principalmente em JSON, SQL, testes e mensagens simples.

---

## Fechamento da aula

Hoje estudamos text blocks.

A ideia central foi:

```text
text block permite escrever strings multilinha de forma legível no Java.
```

Vimos que:

```text
text block usa três aspas duplas;
o conteúdo começa após quebra de linha;
text block continua sendo String;
normalmente existe quebra de linha final;
indentação incidental é removida;
aspas internas ficam mais simples;
JSON e SQL ficam muito mais legíveis;
formatted pode preencher placeholders;
text block não escapa JSON automaticamente;
text block não protege SQL;
bibliotecas especializadas continuam importantes.
```

O ponto mais importante é:

```text
use text blocks para melhorar legibilidade de textos multilinha, mas não para substituir validação, serialização, SQL parametrizado ou template engine quando eles forem necessários.
```

Na próxima aula, vamos estudar:

```text
Exceptions por baixo.
```

A próxima aula vai explicar stack trace, checked vs unchecked, causa raiz, mensagens de erro e como ler exceções como um desenvolvedor backend profissional.
