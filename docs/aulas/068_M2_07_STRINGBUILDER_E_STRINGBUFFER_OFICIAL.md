# 068 — M2.07 — StringBuilder e StringBuffer

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.07.01` — StringBuilder e StringBuffer — Conceito profundo e quando usar.
- `M2.07.02` — StringBuilder e StringBuffer — Implementação guiada com código realista.
- `M2.07.03` — StringBuilder e StringBuffer — Refatoração, melhoria e leitura crítica.
- `M2.07.04` — StringBuilder e StringBuffer — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar concatenação em laços, mutabilidade, `StringBuilder`, `StringBuffer`, thread-safety, uso correto, trade-offs, armadilhas, refatoração de concatenação repetida, montagem de relatórios, logs, mensagens, payloads textuais e aplicações em cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
064 — M2.03 — Garbage Collector conceitual;
065 — M2.04 — Default values e inicialização;
066 — M2.05 — Null e NullPointerException;
067 — M2.06 — String pool e imutabilidade de String;
068 — M2.07 — StringBuilder e StringBuffer.
```

Na aula anterior, aprendemos que:

```text
String é objeto;
String é imutável;
== compara referência;
equals compara conteúdo;
literais podem ir para o String pool;
new String cria outro objeto;
trim e toUpperCase retornam nova String;
concatenação simples com + é aceitável;
concatenação repetida em loop pode criar muitos objetos temporários.
```

Agora vamos aprofundar a solução para montagem repetida de texto:

```text
StringBuilder.
```

Também vamos entender:

```text
StringBuffer.
```

A pergunta central é:

```text
quando devo usar String, StringBuilder ou StringBuffer?
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
068 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 68
Aulas oficiais restantes: 470
```

Contando o arquivo de abertura `000`, teremos:

```text
69 arquivos gerados no total.
```

Ainda estamos no começo do Módulo 2, consolidando Java Core antes de avançar para wrappers, autoboxing, datas, coleções, exceções, Maven, banco de dados, Spring Boot e arquitetura backend.

---

## A pergunta central da aula

Observe este código:

```java
String relatorio = "";

for (int indice = 1; indice <= 1000; indice++) {
    relatorio = relatorio + "Item " + indice + "\n";
}
```

Funciona.

Mas há um problema conceitual.

Como `String` é imutável, cada concatenação pode gerar novos objetos intermediários.

Em laços pequenos, isso não costuma importar.

Em laços grandes, relatórios grandes, logs grandes, montagem de mensagens e payloads textuais, isso pode piorar performance e memória.

A solução mais comum é:

```java
StringBuilder builder = new StringBuilder();

for (int indice = 1; indice <= 1000; indice++) {
    builder.append("Item ");
    builder.append(indice);
    builder.append("\n");
}

String relatorio = builder.toString();
```

`StringBuilder` é mutável.

Ele foi feito para montar texto aos poucos.

---

## String versus StringBuilder

`String`:

```text
imutável;
boa para textos finais;
boa para valores simples;
boa para chaves, status, nomes, mensagens pequenas;
operações retornam nova String.
```

`StringBuilder`:

```text
mutável;
boa para montar texto em etapas;
boa para concatenação em loop;
boa para relatórios;
boa para mensagens grandes;
boa para montagem programática.
```

Resumo prático:

```text
texto pronto ou simples -> String;
texto sendo montado muitas vezes -> StringBuilder.
```

---

## O que é mutabilidade

Mutável é algo que pode ser alterado internamente.

`StringBuilder` é mutável.

Exemplo:

```java
StringBuilder builder = new StringBuilder();

builder.append("Java");
builder.append(" Backend");

System.out.println(builder);
```

O mesmo objeto `builder` vai recebendo conteúdo.

Diferente de `String`, onde cada transformação costuma gerar outra String.

---

## O que é StringBuilder

`StringBuilder` é uma classe do Java usada para construir texto de forma eficiente.

Ela permite:

```text
append;
insert;
delete;
replace;
reverse;
setLength;
toString.
```

Uso básico:

```java
StringBuilder builder = new StringBuilder();

builder.append("Cliente: ");
builder.append("Ana");

String texto = builder.toString();
```

O método:

```java
toString()
```

gera uma `String` final com o conteúdo montado.

---

## O que é StringBuffer

`StringBuffer` é parecido com `StringBuilder`.

A principal diferença conceitual:

```text
StringBuffer é sincronizado;
StringBuilder não é sincronizado.
```

Em termos simples:

```text
StringBuffer tem proteção para uso concorrente por múltiplas threads;
StringBuilder é mais leve quando usado por uma thread só.
```

Na maioria dos códigos comuns de aplicação, dentro de um método, usamos:

```text
StringBuilder.
```

`StringBuffer` aparece mais em código legado ou cenários específicos com compartilhamento entre threads.

Nesta fase:

```text
padrão recomendado: StringBuilder.
```

---

## Thread-safety em explicação inicial

Thread-safety significa segurança em acesso concorrente.

Imagine duas threads alterando o mesmo objeto ao mesmo tempo.

Se o objeto não for preparado para isso, o resultado pode ficar inconsistente.

`StringBuffer` sincroniza seus métodos para reduzir esse risco.

`StringBuilder` não sincroniza.

Mas, se o `StringBuilder` é criado dentro de um método e usado apenas ali, não há compartilhamento entre threads.

Exemplo comum e seguro:

```java
public static String montarRelatorio() {
    StringBuilder builder = new StringBuilder();

    builder.append("Relatório");

    return builder.toString();
}
```

Esse `builder` é local.

Cada chamada tem seu próprio objeto.

Nesse cenário, `StringBuilder` é a escolha correta.

---

## Vocabulário essencial

Termos desta aula:

```text
String;
StringBuilder;
StringBuffer;
imutável;
mutável;
append;
insert;
delete;
replace;
reverse;
toString;
capacidade;
concatenação;
laço;
objeto temporário;
relatório;
mensagem;
payload;
thread-safety;
sincronização;
concorrência;
performance;
legibilidade;
refatoração;
responsabilidade;
buffer de texto.
```

Termos mais importantes:

```text
StringBuilder -> classe mutável para montar texto;
StringBuffer -> classe mutável sincronizada para texto;
append -> adiciona conteúdo no final;
toString -> converte o builder para String final;
thread-safe -> seguro para acesso concorrente;
sincronização -> controle para evitar acesso simultâneo problemático;
concatenação em loop -> cenário típico para StringBuilder;
objeto temporário -> objeto criado durante concatenações e descartado depois.
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
        StringBuilder builder = new StringBuilder();

        builder.append("Java");
        builder.append(" ");
        builder.append("Backend");

        String resultado = builder.toString();

        System.out.println(resultado);
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
Java Backend
```

Esse é o uso mais básico:

```text
cria StringBuilder;
adiciona partes com append;
converte para String com toString.
```

---

## Comparação com String

Arquivo:

```text
ComparacaoStringBuilder.java
```

Código:

```java
public class ComparacaoStringBuilder {
    public static void main(String[] args) {
        String texto = "";

        texto = texto + "Java";
        texto = texto + " ";
        texto = texto + "Backend";

        System.out.println(texto);

        StringBuilder builder = new StringBuilder();

        builder.append("Java");
        builder.append(" ");
        builder.append("Backend");

        System.out.println(builder.toString());
    }
}
```

As duas formas funcionam.

Mas a intenção é diferente:

```text
String com + é simples;
StringBuilder é melhor quando a montagem cresce, repete ou fica em loop.
```

---

## append

`append` adiciona conteúdo ao final.

Exemplo:

```java
StringBuilder builder = new StringBuilder();

builder.append("Cliente");
builder.append(": ");
builder.append("Ana");
```

Resultado:

```text
Cliente: Ana
```

`append` aceita vários tipos:

```java
builder.append("Texto");
builder.append(10);
builder.append(10L);
builder.append(10.5);
builder.append(true);
builder.append('A');
```

Ele converte para representação textual.

---

## Exemplo com vários tipos

Arquivo:

```text
AppendVariosTipos.java
```

Código:

```java
public class AppendVariosTipos {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Cliente: ");
        builder.append("Ana");
        builder.append("\n");

        builder.append("Valor: ");
        builder.append(1000L);
        builder.append("\n");

        builder.append("Ativo: ");
        builder.append(true);
        builder.append("\n");

        builder.append("Nota: ");
        builder.append(9.5);

        System.out.println(builder.toString());
    }
}
```

Saída:

```text
Cliente: Ana
Valor: 1000
Ativo: true
Nota: 9.5
```

---

## append encadeado

`append` retorna o próprio builder.

Por isso, podemos encadear:

```java
builder.append("Cliente: ")
       .append("Ana")
       .append("\n");
```

Exemplo:

```java
public class AppendEncadeado {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Cliente: ")
                .append("Ana")
                .append("\n")
                .append("Status: ")
                .append("ATIVO");

        System.out.println(builder.toString());
    }
}
```

Esse estilo pode ficar legível quando usado com moderação.

Se a linha ficar grande demais, quebre em várias linhas.

---

## StringBuilder em loop

Arquivo:

```text
RelatorioComStringBuilder.java
```

Código:

```java
public class RelatorioComStringBuilder {
    public static void main(String[] args) {
        StringBuilder relatorio = new StringBuilder();

        for (int indice = 1; indice <= 5; indice++) {
            relatorio.append("Item ");
            relatorio.append(indice);
            relatorio.append("\n");
        }

        System.out.println(relatorio.toString());
    }
}
```

Saída:

```text
Item 1
Item 2
Item 3
Item 4
Item 5
```

Esse é o cenário clássico de uso:

```text
montagem repetida de texto dentro de laço.
```

---

## Refatorando concatenação em loop

Código inicial:

```java
String relatorio = "";

for (int indice = 1; indice <= 5; indice++) {
    relatorio = relatorio + "Item " + indice + "\n";
}
```

Refatoração:

```java
StringBuilder relatorio = new StringBuilder();

for (int indice = 1; indice <= 5; indice++) {
    relatorio.append("Item ")
            .append(indice)
            .append("\n");
}

String texto = relatorio.toString();
```

Benefícios:

```text
menos objetos temporários;
intenção mais clara para montagem repetida;
melhor para relatórios grandes;
melhor para loops.
```

---

## insert

`insert` insere conteúdo em uma posição.

Arquivo:

```text
InsertStringBuilder.java
```

Código:

```java
public class InsertStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("Backend");

        builder.insert(0, "Java ");

        System.out.println(builder.toString());
    }
}
```

Saída:

```text
Java Backend
```

Uso comum:

```text
inserir prefixo;
adicionar cabeçalho;
ajustar texto em posição específica.
```

Mas use com cuidado.

Muitas inserções no meio podem deixar o código difícil de ler.

---

## delete

`delete` remove um trecho.

Arquivo:

```text
DeleteStringBuilder.java
```

Código:

```java
public class DeleteStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("Java Backend!!!");

        builder.delete(12, 15);

        System.out.println(builder.toString());
    }
}
```

Saída:

```text
Java Backend
```

Atenção aos índices.

Como em arrays e String:

```text
índice começa em 0;
posição final do delete é exclusiva.
```

---

## replace

`replace` substitui trecho.

Arquivo:

```text
ReplaceStringBuilder.java
```

Código:

```java
public class ReplaceStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("Status: PENDENTE");

        builder.replace(8, 16, "APROVADO");

        System.out.println(builder.toString());
    }
}
```

Saída:

```text
Status: APROVADO
```

Também exige cuidado com índices.

Para regras de negócio simples, muitas vezes é melhor montar novamente do que substituir por posição.

---

## reverse

`reverse` inverte o conteúdo.

Arquivo:

```text
ReverseStringBuilder.java
```

Código:

```java
public class ReverseStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("Java");

        builder.reverse();

        System.out.println(builder.toString());
    }
}
```

Saída:

```text
avaJ
```

Não é muito comum em backend corporativo.

Mas é útil para entender mutabilidade.

O próprio builder foi alterado.

---

## setLength

`setLength` altera o tamanho do builder.

Pode cortar conteúdo ou preencher com caracteres nulos.

Uso comum didático: limpar builder.

Arquivo:

```text
SetLengthStringBuilder.java
```

Código:

```java
public class SetLengthStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Texto temporário");
        System.out.println(builder.toString());

        builder.setLength(0);

        builder.append("Novo texto");
        System.out.println(builder.toString());
    }
}
```

Saída:

```text
Texto temporário
Novo texto
```

Em código comum, muitas vezes é mais simples criar um novo builder.

Use `setLength(0)` quando fizer sentido reaproveitar.

---

## capacity e length

`length()` mostra a quantidade de caracteres usados.

`capacity()` mostra a capacidade interna atual.

Arquivo:

```text
CapacityLength.java
```

Código:

```java
public class CapacityLength {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        System.out.println("Length inicial: " + builder.length());
        System.out.println("Capacity inicial: " + builder.capacity());

        builder.append("Java Backend");

        System.out.println("Length depois: " + builder.length());
        System.out.println("Capacity depois: " + builder.capacity());
    }
}
```

A capacidade pode ser maior que o tamanho usado.

Não precisa decorar detalhes.

Guarde:

```text
StringBuilder mantém uma estrutura interna para crescer;
se souber tamanho aproximado, pode criar com capacidade inicial.
```

---

## Capacidade inicial

Se você sabe que vai montar um texto grande, pode iniciar com capacidade:

```java
StringBuilder builder = new StringBuilder(1000);
```

Isso pode reduzir realocações internas.

Exemplo:

```java
StringBuilder relatorio = new StringBuilder(5000);
```

Não precisa usar sempre.

Use quando houver uma estimativa clara.

Regra prática:

```text
para uso comum, new StringBuilder() basta;
para relatórios grandes previsíveis, capacidade inicial pode ajudar.
```

---

## StringBuffer básico

Arquivo:

```text
StringBufferBasico.java
```

Código:

```java
public class StringBufferBasico {
    public static void main(String[] args) {
        StringBuffer buffer = new StringBuffer();

        buffer.append("Java");
        buffer.append(" ");
        buffer.append("Backend");

        System.out.println(buffer.toString());
    }
}
```

Saída:

```text
Java Backend
```

Uso é parecido com StringBuilder.

Diferença conceitual:

```text
StringBuffer é sincronizado;
StringBuilder não é sincronizado.
```

---

## StringBuilder versus StringBuffer

Tabela prática:

| Característica | StringBuilder | StringBuffer |
|---|---|---|
| Mutável | Sim | Sim |
| Sincronizado | Não | Sim |
| Thread-safe | Não por si só | Sim nos métodos sincronizados |
| Performance em uso local | Geralmente melhor | Pode ter custo maior |
| Uso comum moderno | Mais comum | Mais legado/específico |
| Recomendação inicial | Preferir | Usar se precisar sincronização |

Regra para esta fase:

```text
dentro de método, sem compartilhamento entre threads: StringBuilder;
se houver necessidade real de sincronização no buffer compartilhado: avaliar StringBuffer.
```

---

## Não compartilhar StringBuilder global

Evite isto:

```java
static StringBuilder builderGlobal = new StringBuilder();
```

Por quê?

```text
estado global;
pode misturar dados de execuções diferentes;
não é thread-safe;
pode acumular memória;
dificulta debug;
pode gerar bugs em backend.
```

Prefira criar o builder dentro do método:

```java
public static String montarMensagem() {
    StringBuilder builder = new StringBuilder();

    builder.append("Mensagem");

    return builder.toString();
}
```

Builder local é simples e seguro.

---

## Aplicação em pedido

Arquivo:

```text
RelatorioPedidos.java
```

Código:

```java
public class RelatorioPedidos {
    public static void main(String[] args) {
        Pedido[] pedidos = new Pedido[3];

        pedidos[0] = criarPedido("Ana", 1000L, "PENDENTE");
        pedidos[1] = criarPedido("Bruno", 2500L, "APROVADO");
        pedidos[2] = criarPedido("Carla", 500L, "RECUSADO");

        String relatorio = montarRelatorioPedidos(pedidos);

        System.out.println(relatorio);
    }

    public static Pedido criarPedido(String cliente, long valorCentavos, String status) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.valorCentavos = valorCentavos;
        pedido.status = status;

        return pedido;
    }

    public static String montarRelatorioPedidos(Pedido[] pedidos) {
        StringBuilder builder = new StringBuilder();

        builder.append("RELATÓRIO DE PEDIDOS\n");
        builder.append("====================\n");

        for (int indice = 0; indice < pedidos.length; indice++) {
            Pedido pedido = pedidos[indice];

            if (pedido != null) {
                builder.append("Cliente: ").append(pedido.cliente).append("\n");
                builder.append("Valor: ").append(pedido.valorCentavos).append("\n");
                builder.append("Status: ").append(pedido.status).append("\n");
                builder.append("--------------------\n");
            }
        }

        return builder.toString();
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Esse é um exemplo realista de relatório.

StringBuilder faz sentido porque há montagem em loop.

---

## Aplicação em produto

Arquivo:

```text
RelatorioProdutos.java
```

Código:

```java
public class RelatorioProdutos {
    public static void main(String[] args) {
        Produto[] produtos = new Produto[2];

        produtos[0] = criarProduto("Cadeira", 10, true);
        produtos[1] = criarProduto("Mesa", 0, false);

        System.out.println(montarRelatorioProdutos(produtos));
    }

    public static Produto criarProduto(String nome, int estoque, boolean ativo) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.estoque = estoque;
        produto.ativo = ativo;

        return produto;
    }

    public static String montarRelatorioProdutos(Produto[] produtos) {
        StringBuilder builder = new StringBuilder();

        builder.append("RELATÓRIO DE PRODUTOS\n");
        builder.append("=====================\n");

        for (int indice = 0; indice < produtos.length; indice++) {
            Produto produto = produtos[indice];

            if (produto != null) {
                builder.append("Produto: ").append(produto.nome).append("\n");
                builder.append("Estoque: ").append(produto.estoque).append("\n");
                builder.append("Ativo: ").append(produto.ativo).append("\n");
                builder.append("--------------------\n");
            }
        }

        return builder.toString();
    }
}

class Produto {
    String nome;
    int estoque;
    boolean ativo;
}
```

Esse exemplo reforça:

```text
montagem de várias linhas -> StringBuilder.
```

---

## Aplicação em pagamento

Arquivo:

```text
ResumoPagamentoBuilder.java
```

Código:

```java
public class ResumoPagamentoBuilder {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento(10000L, 4);

        String resumo = montarResumoPagamento(pagamento);

        System.out.println(resumo);
    }

    public static Pagamento criarPagamento(long valorCentavos, int parcelas) {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = valorCentavos;
        pagamento.parcelas = parcelas;
        pagamento.valorParcelaCentavos = valorCentavos / parcelas;

        return pagamento;
    }

    public static String montarResumoPagamento(Pagamento pagamento) {
        if (pagamento == null) {
            return "Pagamento não informado.";
        }

        StringBuilder builder = new StringBuilder();

        builder.append("PAGAMENTO\n");
        builder.append("Valor total: ").append(pagamento.valorCentavos).append("\n");
        builder.append("Parcelas: ").append(pagamento.parcelas).append("\n");
        builder.append("Valor da parcela: ").append(pagamento.valorParcelaCentavos).append("\n");

        return builder.toString();
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
    long valorParcelaCentavos;
}
```

Para poucas linhas, `+` também funcionaria.

Mas `StringBuilder` já deixa bom para crescer.

---

## Aplicação em OS

Arquivo:

```text
ResumoOsBuilder.java
```

Código:

```java
public class ResumoOsBuilder {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "ABERTA", 3);

        System.out.println(montarResumoOs(os));
    }

    public static OrdemServico criarOs(String certificado, String status, int atividades) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.status = status;
        os.quantidadeAtividades = atividades;

        return os;
    }

    public static String montarResumoOs(OrdemServico os) {
        if (os == null) {
            return "OS não informada.";
        }

        StringBuilder builder = new StringBuilder();

        builder.append("ORDEM DE SERVIÇO\n");
        builder.append("Certificado: ").append(os.certificado).append("\n");
        builder.append("Status: ").append(os.status).append("\n");
        builder.append("Atividades: ").append(os.quantidadeAtividades).append("\n");

        return builder.toString();
    }
}

class OrdemServico {
    String certificado;
    String status;
    int quantidadeAtividades;
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensagemBuilder.java
```

Código:

```java
public class MensagemBuilder {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "ENTREGA", "OS-001");

        System.out.println(montarMensagem(mensagem));
    }

    public static Mensagem criarMensagem(String cliente, String tipo, String certificado) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.tipo = tipo;
        mensagem.certificado = certificado;

        return mensagem;
    }

    public static String montarMensagem(Mensagem mensagem) {
        if (mensagem == null) {
            return "Mensagem não informada.";
        }

        StringBuilder builder = new StringBuilder();

        builder.append("Olá, ").append(mensagem.cliente).append("!\n");
        builder.append("Tipo da mensagem: ").append(mensagem.tipo).append("\n");
        builder.append("Certificado: ").append(mensagem.certificado).append("\n");
        builder.append("Acompanhe o andamento pelo portal.");

        return builder.toString();
    }
}

class Mensagem {
    String cliente;
    String tipo;
    String certificado;
}
```

Esse exemplo parece uma mensagem de jornada.

StringBuilder ajuda a montar o texto com clareza.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaBuilder.java
```

Código:

```java
public class AuditoriaBuilder {
    public static void main(String[] args) {
        RegistroAuditoria[] registros = new RegistroAuditoria[2];

        registros[0] = criarRegistro("aline", "CRIACAO", "SUCESSO");
        registros[1] = criarRegistro("jackson", "EDICAO", "ERRO");

        System.out.println(montarRelatorioAuditoria(registros));
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao, String status) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.status = status;

        return registro;
    }

    public static String montarRelatorioAuditoria(RegistroAuditoria[] registros) {
        StringBuilder builder = new StringBuilder();

        builder.append("AUDITORIA\n");
        builder.append("=========\n");

        for (int indice = 0; indice < registros.length; indice++) {
            RegistroAuditoria registro = registros[indice];

            if (registro != null) {
                builder.append(registro.usuario)
                        .append(" | ")
                        .append(registro.operacao)
                        .append(" | ")
                        .append(registro.status)
                        .append("\n");
            }
        }

        return builder.toString();
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
}
```

Esse exemplo mostra montagem de linhas de log/auditoria.

---

## Refatoração: relatório com método auxiliar

Quando a montagem cresce, podemos separar responsabilidades.

Código direto:

```java
builder.append("Cliente: ").append(pedido.cliente).append("\n");
builder.append("Valor: ").append(pedido.valorCentavos).append("\n");
builder.append("Status: ").append(pedido.status).append("\n");
```

Refatoração:

```java
adicionarPedido(builder, pedido);
```

Exemplo:

```java
public static void adicionarPedido(StringBuilder builder, Pedido pedido) {
    builder.append("Cliente: ").append(pedido.cliente).append("\n");
    builder.append("Valor: ").append(pedido.valorCentavos).append("\n");
    builder.append("Status: ").append(pedido.status).append("\n");
    builder.append("--------------------\n");
}
```

Isso melhora leitura quando o relatório tem várias partes.

---

## Exemplo refatorado

Arquivo:

```text
RelatorioPedidosRefatorado.java
```

Código:

```java
public class RelatorioPedidosRefatorado {
    public static void main(String[] args) {
        Pedido[] pedidos = new Pedido[2];

        pedidos[0] = criarPedido("Ana", 1000L, "PENDENTE");
        pedidos[1] = criarPedido("Bruno", 2500L, "APROVADO");

        System.out.println(montarRelatorioPedidos(pedidos));
    }

    public static Pedido criarPedido(String cliente, long valorCentavos, String status) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.valorCentavos = valorCentavos;
        pedido.status = status;

        return pedido;
    }

    public static String montarRelatorioPedidos(Pedido[] pedidos) {
        StringBuilder builder = new StringBuilder();

        adicionarCabecalho(builder, "RELATÓRIO DE PEDIDOS");

        for (int indice = 0; indice < pedidos.length; indice++) {
            if (pedidos[indice] != null) {
                adicionarPedido(builder, pedidos[indice]);
            }
        }

        return builder.toString();
    }

    public static void adicionarCabecalho(StringBuilder builder, String titulo) {
        builder.append(titulo).append("\n");
        builder.append("====================").append("\n");
    }

    public static void adicionarPedido(StringBuilder builder, Pedido pedido) {
        builder.append("Cliente: ").append(pedido.cliente).append("\n");
        builder.append("Valor: ").append(pedido.valorCentavos).append("\n");
        builder.append("Status: ").append(pedido.status).append("\n");
        builder.append("--------------------").append("\n");
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Atenção:

```text
passar StringBuilder para método auxiliar é mutação intencional.
```

O método altera o builder recebido.

O nome `adicionarPedido` deixa isso claro.

---

## Quando não usar StringBuilder

Não precisa usar StringBuilder em tudo.

Exemplo simples:

```java
String mensagem = "Cliente: " + cliente;
```

Está bom.

Outro exemplo:

```java
return "Status: " + status;
```

Está bom.

Evite transformar código simples em algo mais longo sem necessidade.

StringBuilder é melhor quando:

```text
há loop;
há muitas partes;
há montagem condicional;
há relatório;
há payload textual;
há crescimento progressivo;
há necessidade de mutabilidade.
```

---

## Erros comuns

### Erro 1 — Usar StringBuilder para texto simples demais

Código fica mais longo sem ganho real.

---

### Erro 2 — Usar String com + em loop grande

Pode criar muitos objetos temporários.

---

### Erro 3 — Esquecer toString

Algumas APIs esperam `String`.

Use:

```java
builder.toString()
```

---

### Erro 4 — Compartilhar StringBuilder global

Pode misturar dados, gerar bug e não é thread-safe.

---

### Erro 5 — Achar que StringBuffer é sempre melhor

StringBuffer é sincronizado, mas isso tem custo.

Se não precisa sincronização, prefira StringBuilder.

---

### Erro 6 — Usar insert/delete/replace com índice errado

Lembre que índices começam em 0 e fim costuma ser exclusivo.

---

### Erro 7 — Montar relatório sem quebra de linha

Pode gerar texto ilegível.

---

### Erro 8 — Não validar objeto antes de montar texto

Se `pedido` ou campo interno estiver null, pode dar NPE.

---

### Erro 9 — Método auxiliar alterar builder sem nome claro

Use nomes como:

```text
adicionarCabecalho;
adicionarPedido;
adicionarLinha;
montarResumo.
```

---

### Erro 10 — Fazer micro-otimização cedo demais

Não troque tudo por StringBuilder sem motivo.

Use onde faz sentido.

---

## Diagnóstico de uso de StringBuilder

Quando olhar um código com texto, pergunte:

### 1. É uma mensagem simples?

Use `String` com `+`.

### 2. Está dentro de loop?

Considere `StringBuilder`.

### 3. O texto tem muitas linhas?

StringBuilder pode melhorar legibilidade.

### 4. Há montagem condicional?

StringBuilder pode ajudar.

### 5. O builder é local?

Ótimo.

### 6. O builder é estático/global?

Cuidado.

### 7. Precisa ser thread-safe?

Se realmente for compartilhado entre threads, avalie StringBuffer ou outra estratégia.

### 8. Precisa converter para String final?

Use `toString()`.

### 9. O método comunica mutação?

Se passa builder para método auxiliar, nomeie bem.

### 10. Está complicando código simples?

Volte para String simples.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Java");
        builder.append(" ");
        builder.append("Backend");

        String resultado = builder.toString();

        System.out.println(resultado);
    }
}
```

Coloque breakpoint em:

```java
builder.append("Java");
```

Avance linha por linha.

Observe:

```text
o mesmo builder cresce;
append altera o conteúdo interno;
toString gera a String final.
```

Depois debugue:

```java
String texto = "";
texto = texto + "Java";
texto = texto + " Backend";
```

Observe que a variável recebe novos valores.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esquecer toString

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();

        builder.append("Java");

        imprimir(builder);
    }

    public static void imprimir(String texto) {
        System.out.println(texto);
    }
}
```

Esse código não compila porque `imprimir` espera `String`.

Corrija:

```java
imprimir(builder.toString());
```

---

### Teste 2 — Builder global

```java
public class Main {
    static StringBuilder builder = new StringBuilder();

    public static void main(String[] args) {
        montar("Ana");
        montar("Bruno");

        System.out.println(builder.toString());
    }

    public static void montar(String cliente) {
        builder.append("Cliente: ").append(cliente).append("\n");
    }
}
```

Explique por que isso acumula estado global.

---

### Teste 3 — delete com índice errado

```java
public class Main {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("Java");

        builder.delete(0, 10);

        System.out.println(builder);
    }
}
```

Observe o comportamento e entenda os limites.

---

### Teste 4 — StringBuffer sem necessidade

Troque um builder local por StringBuffer.

Explique que funciona, mas não era necessário.

---

### Teste 5 — StringBuilder para texto simples

Compare:

```java
String mensagem = "Cliente: " + cliente;
```

com:

```java
StringBuilder builder = new StringBuilder();
builder.append("Cliente: ");
builder.append(cliente);
String mensagem = builder.toString();
```

Explique qual é mais simples nesse caso.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-068-stringbuilder-stringbuffer
cd labs\m2\aula-068-stringbuilder-stringbuffer
```

Crie arquivos:

```text
Main.java
ComparacaoStringBuilder.java
AppendVariosTipos.java
AppendEncadeado.java
RelatorioComStringBuilder.java
InsertStringBuilder.java
DeleteStringBuilder.java
ReplaceStringBuilder.java
ReverseStringBuilder.java
SetLengthStringBuilder.java
CapacityLength.java
StringBufferBasico.java
RelatorioPedidos.java
RelatorioProdutos.java
ResumoPagamentoBuilder.java
ResumoOsBuilder.java
MensagemBuilder.java
AuditoriaBuilder.java
RelatorioPedidosRefatorado.java
DebugStringBuilder.java
ErroEsquecerToString.java
ErroBuilderGlobal.java
ErroDeleteIndice.java
ErroStringBuilderDesnecessario.java
README.md
```

Compile:

```powershell
javac Main.java
javac ComparacaoStringBuilder.java
javac AppendVariosTipos.java
javac AppendEncadeado.java
javac RelatorioComStringBuilder.java
javac InsertStringBuilder.java
javac DeleteStringBuilder.java
javac ReplaceStringBuilder.java
javac ReverseStringBuilder.java
javac SetLengthStringBuilder.java
javac CapacityLength.java
javac StringBufferBasico.java
javac RelatorioPedidos.java
javac RelatorioProdutos.java
javac ResumoPagamentoBuilder.java
javac ResumoOsBuilder.java
javac MensagemBuilder.java
javac AuditoriaBuilder.java
javac RelatorioPedidosRefatorado.java
javac DebugStringBuilder.java
javac ErroBuilderGlobal.java
javac ErroDeleteIndice.java
javac ErroStringBuilderDesnecessario.java
```

O arquivo `ErroEsquecerToString.java` pode ser propositalmente usado para gerar erro de compilação.

Execute:

```powershell
java Main
java ComparacaoStringBuilder
java AppendVariosTipos
java AppendEncadeado
java RelatorioComStringBuilder
java InsertStringBuilder
java DeleteStringBuilder
java ReplaceStringBuilder
java ReverseStringBuilder
java SetLengthStringBuilder
java CapacityLength
java StringBufferBasico
java RelatorioPedidos
java RelatorioProdutos
java ResumoPagamentoBuilder
java ResumoOsBuilder
java MensagemBuilder
java AuditoriaBuilder
java RelatorioPedidosRefatorado
java DebugStringBuilder
java ErroBuilderGlobal
java ErroDeleteIndice
java ErroStringBuilderDesnecessario
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 068 — StringBuilder e StringBuffer

## Objetivo

Entender quando usar `StringBuilder` e `StringBuffer`, por que eles existem, como funcionam em comparação com `String`, e como aplicar em relatórios, mensagens e montagem de texto em loop.

## Conceitos

- `String` é imutável.
- `StringBuilder` é mutável.
- `StringBuffer` é mutável e sincronizado.
- `append` adiciona conteúdo ao final.
- `toString` gera a String final.
- Concatenação simples com `+` é aceitável.
- Concatenação repetida em loop pode ser melhor com `StringBuilder`.
- `StringBuilder` local é a escolha comum.
- `StringBuffer` só deve ser considerado quando há necessidade real de sincronização.
- Evitar `StringBuilder` global.
- Métodos auxiliares podem receber builder quando a mutação for intencional e bem nomeada.

## Comandos

```powershell
javac Main.java
java Main
javac RelatorioPedidos.java
java RelatorioPedidos
```

## Observações

- Não usar StringBuilder para tudo.
- Não esquecer `toString`.
- Não compartilhar builder global sem necessidade.
- Preferir clareza antes de micro-otimização.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver builder crescendo |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar append por append |
| Variables | janela Debug | Ver conteúdo do builder |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `builder.toString()` |
| Reformatar código | `Ctrl + Alt + L` | Organizar append encadeado |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Separar montagem de relatório |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 068 — StringBuilder e StringBuffer

### O que aprendi
Aprendi que `StringBuilder` é uma classe mutável usada para montar texto de forma eficiente, principalmente em laços, relatórios e mensagens com várias partes. Também aprendi que `StringBuffer` é parecido, mas sincronizado, e que normalmente uso `StringBuilder` em escopo local.

### O que pratiquei
Criei exemplos com `append`, append encadeado, `insert`, `delete`, `replace`, `reverse`, `setLength`, `capacity`, `StringBuffer`, relatórios de pedidos e produtos, resumo de pagamento, OS, mensageria e auditoria.

### Conceitos principais
- StringBuilder
- StringBuffer
- String imutável
- mutabilidade
- append
- insert
- delete
- replace
- reverse
- setLength
- length
- capacity
- toString
- concatenação em loop
- objeto temporário
- relatório textual
- mensagem
- thread-safety
- sincronização
- builder local
- builder global
- refatoração de relatório

### Arquivos criados
- `labs/m2/aula-068-stringbuilder-stringbuffer/Main.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ComparacaoStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/AppendVariosTipos.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/AppendEncadeado.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/RelatorioComStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/InsertStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/DeleteStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ReplaceStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ReverseStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/SetLengthStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/CapacityLength.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/StringBufferBasico.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/RelatorioPedidos.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/RelatorioProdutos.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ResumoPagamentoBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ResumoOsBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/MensagemBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/AuditoriaBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/RelatorioPedidosRefatorado.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/DebugStringBuilder.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ErroEsquecerToString.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ErroBuilderGlobal.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ErroDeleteIndice.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/ErroStringBuilderDesnecessario.java`
- `labs/m2/aula-068-stringbuilder-stringbuffer/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac RelatorioComStringBuilder.java
java RelatorioComStringBuilder
javac RelatorioPedidos.java
java RelatorioPedidos
javac StringBufferBasico.java
java StringBufferBasico
```

### Erros que quero evitar
- usar StringBuilder para texto simples demais;
- usar String com `+` em loop grande;
- esquecer `toString`;
- compartilhar StringBuilder global;
- achar que StringBuffer é sempre melhor;
- errar índices em insert/delete/replace;
- montar relatório sem quebra de linha;
- não validar objeto antes de montar texto;
- usar método auxiliar que altera builder sem nome claro;
- fazer micro-otimização cedo demais.

### Próximo passo
Estudar wrappers e autoboxing.
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
git add labs/m2/aula-068-stringbuilder-stringbuffer docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 068: pratica StringBuilder e StringBuffer em Java"
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
1. Por que StringBuilder existe?
2. Qual a diferença entre String e StringBuilder?
3. O que significa StringBuilder ser mutável?
4. Para que serve append?
5. Para que serve toString?
6. Quando concatenação com + é aceitável?
7. Quando StringBuilder é mais adequado?
8. Qual a diferença entre StringBuilder e StringBuffer?
9. O que significa StringBuffer ser sincronizado?
10. Por que StringBuilder local costuma ser seguro?
11. Por que evitar StringBuilder global?
12. Para que serve insert?
13. Para que serve delete?
14. Para que serve replace?
15. O que observar ao refatorar relatórios com StringBuilder?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar StringBuilder;
explicar StringBuffer;
explicar mutabilidade;
explicar append;
explicar toString;
montar texto com StringBuilder;
montar relatório em loop;
refatorar concatenação repetida;
usar append encadeado;
usar insert;
usar delete;
usar replace;
usar reverse;
usar setLength;
explicar length e capacity;
usar StringBuffer básico;
diferenciar StringBuilder e StringBuffer;
explicar thread-safety conceitualmente;
explicar sincronização conceitualmente;
evitar builder global;
saber quando não usar StringBuilder;
aplicar em pedido;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
separar relatório em métodos auxiliares;
debugar builder crescendo;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar concorrência em profundidade.

Não precisa ainda dominar locks.

Não precisa ainda dominar benchmark profissional.

Não precisa ainda dominar implementação interna do StringBuilder.

Não precisa ainda dominar logging frameworks.

Não precisa ainda dominar template engines.

Esses assuntos virão depois.

O objetivo é dominar montagem de texto com `StringBuilder`, conhecer `StringBuffer` e usar cada um com bom senso.

---

## Fechamento da aula

Hoje estudamos StringBuilder e StringBuffer.

A ideia central foi:

```text
String é imutável; StringBuilder e StringBuffer são mutáveis e servem para montar texto em etapas.
```

Vimos que:

```text
StringBuilder é a escolha comum para montagem local;
StringBuffer é sincronizado e aparece em cenários específicos;
append adiciona conteúdo;
toString gera a String final;
concatenação simples com + é normal;
concatenação repetida em loop pode ser melhor com StringBuilder;
builder global deve ser evitado;
métodos auxiliares podem montar partes do relatório com nomes claros.
```

O ponto mais importante é:

```text
use StringBuilder quando o texto cresce em etapas, principalmente em laços; não use por reflexo em qualquer String simples.
```

Na próxima aula, vamos estudar:

```text
Wrappers e autoboxing.
```

A próxima aula vai explicar `Integer`, `Long`, `Double`, `Boolean`, diferença entre primitivos e wrappers, `null` em wrappers, autoboxing, unboxing, comparação e armadilhas comuns.
