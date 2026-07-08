# 096 — M3.07 — Métodos de exibição

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.07.01` — Métodos de exibição — Conceito profundo e quando usar.
- `M3.07.02` — Métodos de exibição — Implementação guiada com código realista.
- `M3.07.03` — Métodos de exibição — Refatoração, melhoria e leitura crítica.
- `M3.07.04` — Métodos de exibição — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `imprimirResumo`, `imprimirMenu`, separação de UI console, clareza de saída, diferença entre calcular e exibir, métodos `void` com responsabilidade clara, organização de mensagens, duplicação em `System.out.println`, leitura crítica, refatoração incremental e aplicação em cliente, produto, pedido, pagamento, OS, mensageria, auditoria e relatórios.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
terminal integrado funciona;
debug funciona;
renomear método/parâmetro está acessível;
extrair método está acessível;
introduzir variável está acessível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-096-metodos-de-exibicao
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
092 — M3.03 — Coesão em métodos;
093 — M3.04 — Parâmetros demais e alternativas;
094 — M3.05 — Retorno boolean para validação;
095 — M3.06 — Métodos de cálculo;
096 — M3.07 — Métodos de exibição.
```

Na aula anterior, estudamos métodos de cálculo.

A regra principal foi:

```text
quem calcula deve retornar o resultado.
```

Agora vamos estudar o outro lado:

```text
quem exibe deve cuidar da saída para o usuário.
```

Em programas console, isso aparece em:

```text
menus;
resumos;
mensagens de erro;
listas;
cabeçalhos;
rodapés;
relatórios simples;
comprovantes;
auditorias simuladas;
mensagens de status.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
096 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 96
Aulas oficiais restantes: 442
```

Contando o arquivo de abertura `000`, teremos:

```text
97 arquivos gerados no total.
```

---

## A pergunta central da aula

Qual código é mais organizado?

```java
System.out.println("Cliente: " + cliente);
System.out.println("Produto: " + produto);
System.out.println("Total: " + total);
System.out.println("Desconto: " + desconto);
System.out.println("Total final: " + totalFinal);
```

espalhado em vários lugares?

Ou:

```java
imprimirResumoPedido(resumo);
```

A segunda versão é melhor quando a exibição tem uma intenção clara.

A pergunta central da aula é:

```text
como organizar a saída do programa em métodos de exibição sem misturar cálculo, validação e leitura de entrada?
```

---

## O que é método de exibição

Método de exibição é um método cujo objetivo principal é mostrar informação.

Exemplos:

```java
public static void imprimirMenu()
```

```java
public static void imprimirResumoPedido(ResumoPedido resumo)
```

```java
public static void imprimirErro(String mensagem)
```

```java
public static void imprimirLinhaSeparadora()
```

```java
public static void imprimirRelatorioMensageria(RelatorioMensageria relatorio)
```

Normalmente, métodos de exibição são `void`.

Por quê?

Porque o objetivo principal é executar uma ação:

```text
mostrar algo no console.
```

---

## Exibição não deve calcular regra principal

Ruim:

```java
public static void imprimirResumoPedido(BigDecimal preco, int quantidade) {
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    System.out.println("Total: " + total);
}
```

Esse método mistura:

```text
cálculo;
exibição.
```

Melhor:

```java
BigDecimal total = calcularTotalPedido(preco, quantidade);
imprimirTotalPedido(total);
```

Com métodos:

```java
public static BigDecimal calcularTotalPedido(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}

public static void imprimirTotalPedido(BigDecimal total) {
    System.out.println("Total: " + total);
}
```

Essa separação permite reutilizar o cálculo em outros lugares.

---

## Exibição não deve ler entrada

Ruim:

```java
public static void imprimirResumo() {
    Scanner scanner = new Scanner(System.in);

    System.out.print("Nome: ");
    String nome = scanner.nextLine();

    System.out.println("Cliente: " + nome);
}
```

Esse método mistura:

```text
leitura;
exibição.
```

Melhor:

```java
String nome = lerNome(scanner);
imprimirCliente(nome);
```

Nesta aula, ainda não aprofundaremos métodos de leitura.

Isso vem na próxima aula.

Mas já vamos separar:

```text
ler é uma responsabilidade;
exibir é outra.
```

---

## Exibição pode formatar?

Depende.

Exibir normalmente inclui algum nível de formatação visual.

Exemplo aceitável:

```java
public static void imprimirCabecalho(String titulo) {
    System.out.println("====================================");
    System.out.println(titulo);
    System.out.println("====================================");
}
```

Isso é formatação de saída.

Mas cuidado para não colocar cálculo de regra dentro da exibição.

Aceitável:

```text
alinhar texto;
imprimir separador;
mostrar moeda já calculada;
mostrar data já calculada;
montar layout simples.
```

Evite:

```text
calcular desconto;
validar pagamento;
buscar dados;
ler entrada;
alterar status;
salvar arquivo;
enviar mensagem real.
```

---

## `void` com responsabilidade clara

Método de exibição geralmente é `void`.

Isso não é problema.

Exemplo bom:

```java
public static void imprimirErro(String mensagem) {
    System.out.println("ERRO: " + mensagem);
}
```

Esse método tem responsabilidade clara:

```text
exibir mensagem de erro.
```

O problema não é `void`.

O problema é `void` escondendo cálculo ou regra de negócio.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
ExibicaoBasica.java
```

Código:

```java
public class ExibicaoBasica {
    public static void main(String[] args) {
        imprimirCabecalho("Sistema de Pedidos");
        imprimirMensagem("Bem-vindo ao sistema.");
        imprimirLinhaSeparadora();
        imprimirMensagem("Fim da execução.");
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirMensagem(String mensagem) {
        System.out.println(mensagem);
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("------------------------------------");
    }
}
```

Compile:

```powershell
javac ExibicaoBasica.java
```

Execute:

```powershell
java ExibicaoBasica
```

Saída esperada:

```text
====================================
Sistema de Pedidos
====================================
Bem-vindo ao sistema.
------------------------------------
Fim da execução.
```

---

## Método para imprimir menu

Menus são ótimos candidatos para métodos de exibição.

Arquivo:

```text
MenuConsole.java
```

Código:

```java
public class MenuConsole {
    public static void main(String[] args) {
        imprimirMenuPrincipal();
    }

    public static void imprimirMenuPrincipal() {
        System.out.println("====================================");
        System.out.println("MENU PRINCIPAL");
        System.out.println("====================================");
        System.out.println("1 - Cadastrar cliente");
        System.out.println("2 - Cadastrar produto");
        System.out.println("3 - Criar pedido");
        System.out.println("4 - Listar pedidos");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
        System.out.print("Escolha uma opção: ");
    }
}
```

O método não lê a opção.

Ele apenas exibe o menu.

A leitura ficará para outro método.

---

## Separando menu de leitura

Ruim:

```java
public static int imprimirMenuELerOpcao() {
    Scanner scanner = new Scanner(System.in);

    System.out.println("1 - Cadastrar");
    System.out.println("0 - Sair");

    return Integer.parseInt(scanner.nextLine());
}
```

Esse método mistura duas responsabilidades.

Melhor:

```java
imprimirMenuPrincipal();
int opcao = lerOpcao(scanner);
```

Ainda que pareça mais código, a separação melhora manutenção.

---

## Método para imprimir erro

Arquivo:

```text
MensagensConsole.java
```

Código:

```java
public class MensagensConsole {
    public static void main(String[] args) {
        imprimirSucesso("Pedido criado com sucesso.");
        imprimirErro("Cliente obrigatório.");
        imprimirAviso("Estoque baixo.");
    }

    public static void imprimirSucesso(String mensagem) {
        System.out.println("[SUCESSO] " + mensagem);
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirAviso(String mensagem) {
        System.out.println("[AVISO] " + mensagem);
    }
}
```

Isso padroniza mensagens.

No futuro, sistemas reais terão logs, responses HTTP, exceptions e tratamento mais robusto.

Aqui, console.

---

## Método para imprimir resumo de pedido

Arquivo:

```text
ResumoPedidoConsole.java
```

Código:

```java
import java.math.BigDecimal;

public class ResumoPedidoConsole {
    public static void main(String[] args) {
        ResumoPedido resumo = new ResumoPedido(
                "Ana",
                "Cadeira",
                new BigDecimal("399.80"),
                new BigDecimal("39.98"),
                new BigDecimal("359.82")
        );

        imprimirResumoPedido(resumo);
    }

    public static void imprimirResumoPedido(ResumoPedido resumo) {
        if (resumo == null) {
            imprimirErro("Resumo do pedido é obrigatório.");
            return;
        }

        imprimirCabecalho("RESUMO DO PEDIDO");
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Produto: " + resumo.produto());
        System.out.println("Total bruto: " + resumo.totalBruto());
        System.out.println("Desconto: " + resumo.desconto());
        System.out.println("Total final: " + resumo.totalFinal());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("------------------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record ResumoPedido(
        String cliente,
        String produto,
        BigDecimal totalBruto,
        BigDecimal desconto,
        BigDecimal totalFinal
) {
}
```

O método `imprimirResumoPedido` exibe.

Ele não calcula total.

Ele não lê dados.

Ele não salva pedido.

---

## Exemplo aplicado: cliente

Arquivo:

```text
ClienteExibicao.java
```

Código:

```java
public class ClienteExibicao {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana Silva", "ana@email.com", true);

        imprimirCliente(cliente);
    }

    public static void imprimirCliente(Cliente cliente) {
        if (cliente == null) {
            imprimirErro("Cliente obrigatório.");
            return;
        }

        imprimirCabecalho("DADOS DO CLIENTE");
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Ativo: " + cliente.ativo());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Cliente(String nome, String email, boolean ativo) {
}
```

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoExibicao.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoExibicao {
    public static void main(String[] args) {
        Produto produto = new Produto("Cadeira", new BigDecimal("199.90"), 10);

        imprimirProduto(produto);
    }

    public static void imprimirProduto(Produto produto) {
        if (produto == null) {
            imprimirErro("Produto obrigatório.");
            return;
        }

        imprimirCabecalho("DADOS DO PRODUTO");
        System.out.println("Nome: " + produto.nome());
        System.out.println("Preço: " + produto.preco());
        System.out.println("Estoque: " + produto.estoque());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Produto(String nome, BigDecimal preco, int estoque) {
}
```

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoExibicao.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoExibicao {
    public static void main(String[] args) {
        ResultadoPagamento resultado = new ResultadoPagamento(
                true,
                "PAG-001",
                new BigDecimal("100.00"),
                "PIX"
        );

        imprimirResultadoPagamento(resultado);
    }

    public static void imprimirResultadoPagamento(ResultadoPagamento resultado) {
        if (resultado == null) {
            imprimirErro("Resultado do pagamento obrigatório.");
            return;
        }

        imprimirCabecalho("RESULTADO DO PAGAMENTO");
        System.out.println("Aprovado: " + resultado.aprovado());
        System.out.println("Código: " + resultado.codigo());
        System.out.println("Valor: " + resultado.valor());
        System.out.println("Forma: " + resultado.forma());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record ResultadoPagamento(boolean aprovado, String codigo, BigDecimal valor, String forma) {
}
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoExibicao.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoExibicao {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico("OS-001", "AGENDADA", LocalDate.now().plusDays(1), "MANHA");

        imprimirOrdemServico(os);
    }

    public static void imprimirOrdemServico(OrdemServico os) {
        if (os == null) {
            imprimirErro("OS obrigatória.");
            return;
        }

        imprimirCabecalho("ORDEM DE SERVIÇO");
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Status: " + os.status());
        System.out.println("Data: " + os.dataAgendamento());
        System.out.println("Período: " + os.periodo());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record OrdemServico(String certificado, String status, LocalDate dataAgendamento, String periodo) {
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaExibicao.java
```

Código:

```java
public class MensageriaExibicao {
    public static void main(String[] args) {
        ResultadoMensagem resultado = new ResultadoMensagem("Ana", "OS-001", true, "Mensagem enviada com sucesso.");

        imprimirResultadoMensagem(resultado);
    }

    public static void imprimirResultadoMensagem(ResultadoMensagem resultado) {
        if (resultado == null) {
            imprimirErro("Resultado da mensagem obrigatório.");
            return;
        }

        imprimirCabecalho("RESULTADO DA MENSAGERIA");
        System.out.println("Cliente: " + resultado.cliente());
        System.out.println("Certificado: " + resultado.certificado());
        System.out.println("Enviada: " + resultado.enviada());
        System.out.println("Mensagem: " + resultado.mensagem());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record ResultadoMensagem(String cliente, String certificado, boolean enviada, String mensagem) {
}
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaExibicao.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaExibicao {
    public static void main(String[] args) {
        RegistroAuditoria auditoria = new RegistroAuditoria(
                "aline",
                "CRIACAO",
                "Produto",
                10L,
                Instant.now()
        );

        imprimirRegistroAuditoria(auditoria);
    }

    public static void imprimirRegistroAuditoria(RegistroAuditoria auditoria) {
        if (auditoria == null) {
            imprimirErro("Auditoria obrigatória.");
            return;
        }

        imprimirCabecalho("REGISTRO DE AUDITORIA");
        System.out.println("Usuário: " + auditoria.usuario());
        System.out.println("Operação: " + auditoria.operacao());
        System.out.println("Entidade: " + auditoria.entidade());
        System.out.println("Entidade ID: " + auditoria.entidadeId());
        System.out.println("Criado em: " + auditoria.criadoEm());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record RegistroAuditoria(
        String usuario,
        String operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
}
```

---

## Exemplo aplicado: relatório simples

Arquivo:

```text
RelatorioExibicao.java
```

Código:

```java
public class RelatorioExibicao {
    public static void main(String[] args) {
        RelatorioOperacional relatorio = new RelatorioOperacional(
                10,
                7,
                2,
                1
        );

        imprimirRelatorioOperacional(relatorio);
    }

    public static void imprimirRelatorioOperacional(RelatorioOperacional relatorio) {
        if (relatorio == null) {
            imprimirErro("Relatório obrigatório.");
            return;
        }

        imprimirCabecalho("RELATÓRIO OPERACIONAL");
        System.out.println("Total: " + relatorio.total());
        System.out.println("Sucesso: " + relatorio.sucesso());
        System.out.println("Erro: " + relatorio.erro());
        System.out.println("Pendente: " + relatorio.pendente());
        imprimirLinhaSeparadora();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record RelatorioOperacional(int total, int sucesso, int erro, int pendente) {
}
```

---

## Duplicação em métodos de exibição

Nos exemplos acima, repetimos:

```java
imprimirCabecalho
imprimirLinhaSeparadora
imprimirErro
```

Em um projeto real, poderíamos criar um utilitário:

```java
ConsoleView
```

ou:

```java
ExibidorConsole
```

Nesta fase, podemos criar uma classe simples para centralizar padrões de saída.

---

## Classe de apoio para console

Arquivo:

```text
ConsoleView.java
```

Código:

```java
public final class ConsoleView {
    private ConsoleView() {
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("------------------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirSucesso(String mensagem) {
        System.out.println("[SUCESSO] " + mensagem);
    }

    public static void imprimirAviso(String mensagem) {
        System.out.println("[AVISO] " + mensagem);
    }
}
```

Agora outros arquivos podem usar a mesma padronização.

Ainda estamos sem pacotes nesta prática simples, mas o conceito já prepara para organização futura.

---

## Exibição com Text Blocks

Para blocos fixos, text blocks podem ajudar.

Arquivo:

```text
MenuComTextBlock.java
```

Código:

```java
public class MenuComTextBlock {
    public static void main(String[] args) {
        imprimirMenu();
    }

    public static void imprimirMenu() {
        String menu = """
                ====================================
                MENU PRINCIPAL
                ====================================
                1 - Cadastrar cliente
                2 - Cadastrar produto
                3 - Criar pedido
                0 - Sair
                ------------------------------------
                Escolha uma opção:
                """;

        System.out.println(menu);
    }
}
```

Text block é útil quando a saída tem múltiplas linhas.

Mas cuidado:

```text
não coloque regra complexa dentro do texto;
não esconda cálculo;
não misture leitura com exibição.
```

---

## Refatoração: println espalhado

Antes:

```java
System.out.println("==== PEDIDO ====");
System.out.println("Cliente: " + cliente);
System.out.println("Total: " + total);
System.out.println("----------------");
```

Depois:

```java
imprimirResumoPedido(resumo);
```

Método:

```java
public static void imprimirResumoPedido(ResumoPedido resumo) {
    imprimirCabecalho("PEDIDO");
    System.out.println("Cliente: " + resumo.cliente());
    System.out.println("Total: " + resumo.total());
    imprimirLinhaSeparadora();
}
```

Ganho:

```text
main fica limpo;
exibição tem nome;
layout fica centralizado;
mudança visual é mais fácil.
```

---

## Refatoração: exibição calculando

Antes:

```java
public static void imprimirTotal(BigDecimal preco, int quantidade) {
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    System.out.println("Total: " + total);
}
```

Depois:

```java
BigDecimal total = calcularTotal(preco, quantidade);
imprimirTotal(total);
```

Métodos:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}

public static void imprimirTotal(BigDecimal total) {
    System.out.println("Total: " + total);
}
```

Ganho:

```text
cálculo testável;
exibição simples;
responsabilidades separadas.
```

---

## Refatoração: método de exibição com retorno desnecessário

Ruim:

```java
public static String imprimirErro(String mensagem) {
    System.out.println("[ERRO] " + mensagem);

    return mensagem;
}
```

Se o método imprime, provavelmente não precisa retornar a mesma mensagem.

Melhor:

```java
public static void imprimirErro(String mensagem) {
    System.out.println("[ERRO] " + mensagem);
}
```

Retorno deve ter motivo.

---

## Métodos de exibição e backend real

No backend real, nem sempre haverá `System.out.println`.

Em APIs, a saída pode ser:

```text
response HTTP;
JSON;
log;
evento;
arquivo;
mensagem;
view;
template.
```

Mas o conceito permanece:

```text
separar apresentação/saída de regra, cálculo e validação.
```

No console, `System.out.println`.

No Spring Boot, talvez um DTO de resposta.

No log, talvez um logger.

Nesta fase, console é o laboratório.

---

## Erros comuns

### Erro 1 — Exibição calculando regra

`imprimirTotal` não deve calcular desconto.

### Erro 2 — Exibição lendo entrada

`imprimirMenu` não deve ler opção.

### Erro 3 — Exibição salvando dados

Método de exibição não deve persistir.

### Erro 4 — Print espalhado por todo o main

Centralize quando houver intenção clara.

### Erro 5 — Método de exibição com nome genérico

Ruim:

```java
mostrar()
printar()
tela()
```

Melhor:

```java
imprimirResumoPedido()
imprimirMenuPrincipal()
imprimirErro()
```

### Erro 6 — Layout duplicado

Cabeçalhos e separadores repetidos podem virar métodos.

### Erro 7 — Misturar mensagem de erro com validação complexa

Valide em um método; exiba em outro.

### Erro 8 — Retornar valor sem necessidade

Método que imprime geralmente é `void`.

### Erro 9 — Exibição alterando estado

Evite método de exibição que muda dados.

### Erro 10 — Formatar de forma inconsistente

Padronize mensagens.

---

## Diagnóstico

Ao revisar método de exibição, pergunte:

```text
1. Ele só exibe?
2. Ele calcula regra?
3. Ele lê entrada?
4. Ele altera estado?
5. Ele salva ou envia algo?
6. O nome comunica o que será exibido?
7. O método deve ser void?
8. Há println duplicado em vários lugares?
9. Existe padrão de erro/sucesso/aviso?
10. O main ficou mais legível?
```

Se o método exibe e faz outra coisa importante, revise.

---

## Debug recomendado

Use debug em:

```text
ResumoPedidoConsole.java
```

Coloque breakpoints em:

```java
imprimirResumoPedido(...)
imprimirCabecalho(...)
imprimirLinhaSeparadora(...)
imprimirErro(...)
```

Observe:

```text
objeto resumo recebido;
fluxo de exibição;
quando imprime erro;
quando imprime o resumo;
que dados são usados.
```

Depois use debug em:

```text
MenuConsole.java
```

Observe que o método apenas exibe e não lê.

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — colocar cálculo dentro da exibição

Coloque cálculo de desconto dentro de `imprimirResumoPedido`.

Explique por que piorou.

### Teste 2 — colocar leitura dentro do menu

Faça `imprimirMenuPrincipal` criar `Scanner` e ler opção.

Explique por que misturou responsabilidades.

### Teste 3 — duplicar cabeçalho em vários métodos

Copie o mesmo cabeçalho em três lugares.

Depois extraia `imprimirCabecalho`.

### Teste 4 — método de exibição retornando string sem motivo

Crie `imprimirErro` retornando mensagem.

Explique por que retorno é desnecessário.

### Teste 5 — exibição alterando dados

Crie método que imprime e muda status.

Explique por que é efeito colateral inesperado.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-096-metodos-de-exibicao
cd labs\m3\aula-096-metodos-de-exibicao
```

Crie arquivos:

```text
ExibicaoBasica.java
MenuConsole.java
MensagensConsole.java
ResumoPedidoConsole.java
ClienteExibicao.java
ProdutoExibicao.java
PagamentoExibicao.java
OrdemServicoExibicao.java
MensageriaExibicao.java
AuditoriaExibicao.java
RelatorioExibicao.java
ConsoleView.java
MenuComTextBlock.java
ErroExibicaoCalculando.java
ErroExibicaoLendoEntrada.java
ErroPrintlnEspalhado.java
ErroRetornoDesnecessario.java
ErroExibicaoAlterandoEstado.java
README.md
```

Compile:

```powershell
javac ExibicaoBasica.java
javac MenuConsole.java
javac MensagensConsole.java
javac ResumoPedidoConsole.java
javac ClienteExibicao.java
javac ProdutoExibicao.java
javac PagamentoExibicao.java
javac OrdemServicoExibicao.java
javac MensageriaExibicao.java
javac AuditoriaExibicao.java
javac RelatorioExibicao.java
javac ConsoleView.java
javac MenuComTextBlock.java
```

Execute:

```powershell
java ExibicaoBasica
java MenuConsole
java MensagensConsole
java ResumoPedidoConsole
java ClienteExibicao
java ProdutoExibicao
java PagamentoExibicao
java OrdemServicoExibicao
java MensageriaExibicao
java AuditoriaExibicao
java RelatorioExibicao
java MenuComTextBlock
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 096 — Métodos de exibição

## Objetivo

Aprender a organizar saídas de console em métodos de exibição, separando exibição de cálculo, validação, leitura de entrada e alteração de estado.

## Conceitos

- Método de exibição geralmente é `void`.
- Exibição deve mostrar dados.
- Cálculo deve ficar em método de cálculo.
- Leitura deve ficar em método de leitura.
- Menu deve exibir opções.
- Resumo deve imprimir dados já preparados.
- Mensagens de erro, sucesso e aviso podem ser padronizadas.
- Cabeçalhos e separadores podem virar métodos.
- Text blocks ajudam em menus grandes.
- `System.out.println` espalhado pode ser cheiro de código.

## Comandos

```powershell
javac ResumoPedidoConsole.java
java ResumoPedidoConsole
javac MenuComTextBlock.java
java MenuComTextBlock
```
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extract Method | ação da IDE | Extrair prints |
| Introduce Variable | ação da IDE | Nomear texto |
| Debug | `Shift + F9` | Observar fluxo |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Avançar |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar saída |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 096 — Métodos de exibição

### O que aprendi

Aprendi que métodos de exibição devem cuidar da saída para o usuário, normalmente com `void`, sem misturar cálculo, leitura, validação complexa ou alteração de estado.

### O que pratiquei

Criei métodos para imprimir cabeçalho, linha separadora, mensagens de erro, sucesso, aviso, menu, resumo de pedido, dados de cliente, produto, pagamento, OS, mensageria, auditoria e relatório.

### Conceitos principais

- método de exibição
- System.out.println
- void
- imprimirMenu
- imprimirResumo
- imprimirErro
- imprimirSucesso
- imprimirAviso
- UI console
- separação de responsabilidades
- cálculo separado
- leitura separada
- cabeçalho
- separador
- text block
- efeito colateral

### Arquivos criados

- `labs/m3/aula-096-metodos-de-exibicao/ExibicaoBasica.java`
- `labs/m3/aula-096-metodos-de-exibicao/MenuConsole.java`
- `labs/m3/aula-096-metodos-de-exibicao/MensagensConsole.java`
- `labs/m3/aula-096-metodos-de-exibicao/ResumoPedidoConsole.java`
- `labs/m3/aula-096-metodos-de-exibicao/ClienteExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/ProdutoExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/PagamentoExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/OrdemServicoExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/MensageriaExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/AuditoriaExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/RelatorioExibicao.java`
- `labs/m3/aula-096-metodos-de-exibicao/ConsoleView.java`
- `labs/m3/aula-096-metodos-de-exibicao/MenuComTextBlock.java`
- `labs/m3/aula-096-metodos-de-exibicao/README.md`

### Comandos usados

```powershell
javac ResumoPedidoConsole.java
java ResumoPedidoConsole
javac MenuConsole.java
java MenuConsole
javac MenuComTextBlock.java
java MenuComTextBlock
```

### Erros que quero evitar

- método de exibição calculando regra;
- método de exibição lendo entrada;
- método de exibição salvando dados;
- print espalhado por todo o main;
- nome genérico;
- layout duplicado;
- retorno desnecessário;
- exibição alterando estado;
- mistura de validação complexa com saída.
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
git add labs/m3/aula-096-metodos-de-exibicao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 096: organiza metodos de exibicao"
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
1. O que é método de exibição?
2. Por que método de exibição geralmente é void?
3. Qual diferença entre calcular e exibir?
4. Por que imprimir não deve calcular desconto?
5. Por que menu não deve ler opção?
6. O que é UI console?
7. Quando criar imprimirCabecalho?
8. Quando criar imprimirLinhaSeparadora?
9. Por que padronizar erro, sucesso e aviso?
10. O que é println espalhado?
11. Como text blocks ajudam em menus?
12. Quando exibição pode formatar?
13. Quando exibição está fazendo coisa demais?
14. Por que retorno em método de impressão pode ser desnecessário?
15. O que é efeito colateral em método de exibição?
16. Como aplicar em pedido?
17. Como aplicar em pagamento?
18. Como aplicar em OS?
19. Como aplicar em auditoria?
20. Qual método de exibição você criou nesta aula e por quê?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar método de exibição;
criar imprimirCabecalho;
criar imprimirLinhaSeparadora;
criar imprimirErro;
criar imprimirSucesso;
criar imprimirAviso;
criar imprimirMenu;
criar imprimirResumoPedido;
separar cálculo de exibição;
separar leitura de exibição;
evitar print espalhado;
usar void com responsabilidade clara;
usar text block em menu quando fizer sentido;
identificar exibição com efeito colateral;
refatorar println duplicado;
aplicar em cliente;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar camada de apresentação completa.

Não precisa ainda usar interface gráfica.

Não precisa ainda usar web.

Não precisa ainda usar logger.

Não precisa ainda usar Spring.

Não precisa ainda criar DTOs de resposta.

Esses assuntos virão depois.

O objetivo é:

```text
organizar a saída do console com métodos claros e separados das regras.
```

---

## Fechamento

Hoje estudamos métodos de exibição.

A ideia central foi:

```text
quem exibe deve exibir; quem calcula deve calcular; quem lê deve ler.
```

Vimos que:

```text
métodos de exibição geralmente são void;
imprimir menu não deve ler opção;
imprimir resumo não deve calcular regra;
mensagens podem ser padronizadas;
cabeçalhos e separadores evitam duplicação;
text blocks ajudam em menus maiores;
println espalhado pode ser cheiro de código;
exibição não deve alterar estado inesperadamente.
```

O ponto mais importante é:

```text
organizar a saída do programa melhora leitura, manutenção e prepara o código para separação de responsabilidades maior no futuro.
```

Na próxima aula, vamos estudar:

```text
Métodos de leitura.
```

A próxima aula vai aprofundar `lerInteiro`, `lerDouble`, `lerTexto`, `Scanner`, validação centralizada, repetição de entrada e tratamento de erro no console.
