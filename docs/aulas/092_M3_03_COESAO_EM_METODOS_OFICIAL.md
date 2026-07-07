# 092 — M3.03 — Coesão em métodos

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
renomear e extrair método estão acessíveis pela IDE ou menu.
```

A prática desta aula será feita em:

```text
labs/m3/aula-092-coesao-em-metodos
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
088 — M2.27 — Leitura de documentação oficial;
089 — M2.28 — Mini projeto biblioteca Java Core;
090 — M3.01 — De main gigante para métodos pequenos;
091 — M3.02 — Assinatura de método profissional;
092 — M3.03 — Coesão em métodos.
```

Na aula 090, aprendemos a quebrar um `main` gigante em métodos menores.

Na aula 091, aprendemos a desenhar assinaturas melhores.

Agora vamos discutir a qualidade interna dos métodos:

```text
o método realmente faz uma coisa só?
```

Essa pergunta é essencial.

Um método pode ter nome bonito, assinatura bonita e ainda assim ser ruim por dentro.

---

## A pergunta central da aula

Qual método é mais coeso?

```java
public static void processarPedido() {
    // lê cliente
    // valida cliente
    // calcula total
    // calcula desconto
    // imprime resumo
    // registra auditoria
}
```

ou:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

O segundo é mais coeso.

A pergunta central da aula é:

```text
como saber se um método tem uma responsabilidade principal ou se está misturando assuntos demais?
```

Essa é a essência da coesão.

---

## O que é coesão

Coesão é o quanto as partes de uma unidade pertencem ao mesmo propósito.

Quando falamos de método, coesão responde:

```text
tudo dentro deste método trabalha para a mesma intenção?
```

Um método coeso faz uma coisa principal.

Isso não significa uma única linha.

Significa uma única intenção.

Exemplo coeso:

```java
public static boolean valorMonetarioPositivo(BigDecimal valor) {
    return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
}
```

Tudo trabalha para responder:

```text
este valor monetário é positivo?
```

Exemplo pouco coeso:

```java
public static void validarCalcularImprimir(BigDecimal preco, int quantidade) {
    // valida
    // calcula
    // imprime
}
```

Aqui há pelo menos três intenções misturadas.

---

## Coesão não é tamanho apenas

Método grande pode ser sinal de baixa coesão.

Mas tamanho sozinho não é prova.

Um método pode ter 25 linhas e ser coeso.

Um método pode ter 5 linhas e ser confuso.

Exemplo curto e ruim:

```java
public static void fazer(String a, String b) {
    salvar(a);
    enviarEmail(b);
}
```

É curto, mas mistura persistência e comunicação.

Exemplo um pouco maior e coeso:

```java
public static ResultadoValidacao validarCliente(String nome, String email) {
    if (nome == null || nome.isBlank()) {
        return ResultadoValidacao.erro("Nome é obrigatório.");
    }

    if (email == null || email.isBlank()) {
        return ResultadoValidacao.erro("E-mail é obrigatório.");
    }

    if (!email.contains("@")) {
        return ResultadoValidacao.erro("E-mail deve conter @.");
    }

    return ResultadoValidacao.sucesso();
}
```

Esse método tem mais linhas, mas uma intenção principal:

```text
validar cliente.
```

---

## A regra “uma coisa” com cuidado

Você vai ouvir:

```text
um método deve fazer uma coisa.
```

Isso é verdadeiro, mas precisa ser entendido com maturidade.

“Uma coisa” não significa:

```text
uma linha;
um if;
uma operação;
um comando.
```

“Uma coisa” significa:

```text
uma intenção principal em um nível de abstração coerente.
```

Exemplo:

```java
public static ResultadoValidacao validarPedido(String cliente, BigDecimal total, int quantidade) {
    // valida cliente
    // valida total
    // valida quantidade
}
```

Isso pode ser uma coisa:

```text
validar pedido.
```

Mas se o método também:

```text
calcula desconto;
imprime resumo;
salva no banco;
envia mensagem;
registra auditoria.
```

então já não é uma coisa.

---

## Nível de abstração

Um método coeso deve misturar pouco níveis de detalhe.

Exemplo ruim:

```java
public static void processarPedido() {
    String nome = " Ana ".trim().toUpperCase();
    BigDecimal total = new BigDecimal("100.00").multiply(BigDecimal.valueOf(2));
    System.out.println("Total: " + total);
}
```

Aqui o método mistura:

```text
normalização;
cálculo;
saída.
```

Exemplo melhor:

```java
public static void processarPedido() {
    String nome = normalizarNomeCliente(" Ana ");
    BigDecimal total = calcularTotalPedido(new BigDecimal("100.00"), 2);

    imprimirResumoPedido(nome, total);
}
```

Agora o método está em nível mais alto.

Os detalhes foram nomeados.

---

## Sintomas de baixa coesão

Um método provavelmente tem baixa coesão quando:

```text
o nome precisa ter “e”;
o método faz validação e cálculo e impressão;
o método tem muitos blocos separados por comentários;
o método usa variáveis que pertencem a assuntos diferentes;
o método é difícil de resumir em uma frase;
o método muda por muitos motivos diferentes;
o método tem muitos parâmetros de grupos diferentes;
o método tem muitos ifs para assuntos diferentes;
o método faz I/O e regra de negócio ao mesmo tempo;
o método imprime algo no meio de cálculo.
```

Nome com “e” é alerta:

```java
validarECalcular()
salvarEEnviarEmail()
lerEProcessarEImprimir()
```

Às vezes pode existir, mas quase sempre denuncia mistura.

---

## Responsabilidade principal

Cada método deve ter uma responsabilidade principal.

Exemplos:

```text
normalizar nome;
validar cliente;
calcular total;
aplicar desconto;
formatar valor;
montar mensagem;
imprimir resumo;
registrar auditoria simples.
```

Se você não consegue dizer a responsabilidade do método em uma frase curta, provavelmente ele está grande ou misturado.

Pergunta útil:

```text
se eu tivesse que renomear este método com precisão, o nome ficaria gigante?
```

Se sim, talvez ele faça coisa demais.

---

## Exemplo inicial ruim

Arquivo:

```text
MetodoPoucoCoeso.java
```

Código:

```java
import java.math.BigDecimal;

public class MetodoPoucoCoeso {
    public static void main(String[] args) {
        processar();
    }

    public static void processar() {
        String cliente = "  ana silva ";
        String produto = " cadeira ";
        BigDecimal preco = new BigDecimal("199.90");
        int quantidade = 2;

        cliente = cliente.trim().toUpperCase();
        produto = produto.trim().toUpperCase();

        if (cliente.isBlank()) {
            System.out.println("Cliente obrigatório.");
            return;
        }

        if (produto.isBlank()) {
            System.out.println("Produto obrigatório.");
            return;
        }

        if (preco.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Preço inválido.");
            return;
        }

        if (quantidade <= 0) {
            System.out.println("Quantidade inválida.");
            return;
        }

        BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

        if (total.compareTo(new BigDecimal("300.00")) >= 0) {
            total = total.subtract(total.multiply(new BigDecimal("0.10")));
        }

        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Total final: " + total);

        System.out.println("AUDITORIA: pedido processado para " + cliente);
    }
}
```

Esse método `processar` mistura:

```text
dados de entrada;
normalização;
validação;
cálculo;
desconto;
impressão;
auditoria.
```

É pouco coeso.

---

## Primeiro passo: identificar intenções

Antes de refatorar, marque os blocos:

```text
1. preparar dados;
2. normalizar dados;
3. validar dados;
4. calcular total;
5. aplicar desconto;
6. imprimir resumo;
7. registrar auditoria.
```

Cada item pode virar método ou parte de método.

A refatoração não começa digitando.

Começa lendo.

---

## Segundo passo: extrair normalização

Métodos:

```java
public static String normalizarNome(String valor) {
    if (valor == null) {
        return "";
    }

    return valor.trim().toUpperCase();
}
```

Uso:

```java
cliente = normalizarNome(cliente);
produto = normalizarNome(produto);
```

Responsabilidade:

```text
normalizar texto de nome.
```

Este método é coeso.

---

## Terceiro passo: extrair validação

Método:

```java
public static boolean pedidoValido(String cliente, String produto, BigDecimal preco, int quantidade) {
    if (cliente.isBlank()) {
        System.out.println("Cliente obrigatório.");
        return false;
    }

    if (produto.isBlank()) {
        System.out.println("Produto obrigatório.");
        return false;
    }

    if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
        System.out.println("Preço inválido.");
        return false;
    }

    if (quantidade <= 0) {
        System.out.println("Quantidade inválida.");
        return false;
    }

    return true;
}
```

Esse método tem mais de um `if`, mas ainda é coeso se a intenção é:

```text
validar pedido.
```

O que não deveria estar aqui:

```text
calcular total;
imprimir resumo;
registrar auditoria;
montar mensagem.
```

---

## Quarto passo: extrair cálculo

Métodos:

```java
public static BigDecimal calcularTotalBruto(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}
```

```java
public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
    if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
        return totalBruto.multiply(new BigDecimal("0.10"));
    }

    return BigDecimal.ZERO;
}
```

```java
public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
    return totalBruto.subtract(desconto);
}
```

Cada método tem uma intenção.

---

## Quinto passo: extrair saída

Método:

```java
public static void imprimirResumo(String cliente, String produto, BigDecimal totalFinal) {
    System.out.println("Cliente: " + cliente);
    System.out.println("Produto: " + produto);
    System.out.println("Total final: " + totalFinal);
}
```

Este método só imprime resumo.

Não calcula.

Não valida.

Não altera dados.

---

## Sexto passo: extrair auditoria

Método:

```java
public static void registrarAuditoriaProcessamento(String cliente) {
    System.out.println("AUDITORIA: pedido processado para " + cliente);
}
```

Ele ainda imprime no console, porque estamos em exemplo simples.

Mas a intenção é clara:

```text
registrar auditoria do processamento.
```

Mais tarde, auditoria poderá ir para log, banco ou mensageria.

Agora ela já tem um ponto separado.

---

## Versão refatorada e mais coesa

Arquivo:

```text
MetodoCoeso.java
```

Código:

```java
import java.math.BigDecimal;

public class MetodoCoeso {
    public static void main(String[] args) {
        processarPedidoExemplo();
    }

    public static void processarPedidoExemplo() {
        String cliente = normalizarNome("  ana silva ");
        String produto = normalizarNome(" cadeira ");
        BigDecimal preco = new BigDecimal("199.90");
        int quantidade = 2;

        if (!pedidoValido(cliente, produto, preco, quantidade)) {
            return;
        }

        BigDecimal totalBruto = calcularTotalBruto(preco, quantidade);
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        imprimirResumo(cliente, produto, totalFinal);
        registrarAuditoriaProcessamento(cliente);
    }

    public static String normalizarNome(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().toUpperCase();
    }

    public static boolean pedidoValido(String cliente, String produto, BigDecimal preco, int quantidade) {
        if (cliente.isBlank()) {
            System.out.println("Cliente obrigatório.");
            return false;
        }

        if (produto.isBlank()) {
            System.out.println("Produto obrigatório.");
            return false;
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Preço inválido.");
            return false;
        }

        if (quantidade <= 0) {
            System.out.println("Quantidade inválida.");
            return false;
        }

        return true;
    }

    public static BigDecimal calcularTotalBruto(BigDecimal preco, int quantidade) {
        return preco.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
        return totalBruto.subtract(desconto);
    }

    public static void imprimirResumo(String cliente, String produto, BigDecimal totalFinal) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Total final: " + totalFinal);
    }

    public static void registrarAuditoriaProcessamento(String cliente) {
        System.out.println("AUDITORIA: pedido processado para " + cliente);
    }
}
```

Melhorias:

```text
cada método tem intenção;
main coordena;
validação não calcula;
cálculo não imprime;
impressão não valida;
auditoria está separada.
```

---

## Método de coordenação pode chamar vários métodos

O método:

```java
processarPedidoExemplo
```

chama vários métodos.

Isso não significa que ele é automaticamente pouco coeso.

Ele tem uma intenção:

```text
coordenar o processamento de um pedido de exemplo.
```

Método de coordenação é aceitável quando ele orquestra passos de alto nível.

O problema seria se ele contivesse todos os detalhes internos desses passos.

Regra:

```text
coordenar passos é diferente de misturar detalhes.
```

---

## Coesão e nome

Nome ajuda a avaliar coesão.

Se o nome é:

```java
validarCliente
```

o corpo deve validar cliente.

Se o corpo também calcula desconto, há incoerência.

Se o nome é:

```java
processarPedido
```

ele pode coordenar várias etapas do pedido, mas deve evitar misturar detalhes demais.

Se o nome é:

```java
calcularTotal
```

não deve imprimir.

Se o nome é:

```java
imprimirResumo
```

não deve calcular desconto.

Nome é promessa.

Corpo precisa cumprir.

---

## Coesão e retorno

Retorno também revela coesão.

Exemplo:

```java
public static BigDecimal calcularTotal(...)
```

deve retornar um valor calculado.

Se o método:

```text
calcula;
imprime;
registra auditoria;
retorna boolean.
```

provavelmente está estranho.

Pergunte:

```text
qual é o resultado principal deste método?
```

Se houver vários resultados, talvez haja várias responsabilidades.

---

## Coesão e efeitos colaterais

Efeito colateral é quando o método altera algo fora do seu retorno principal.

Exemplos:

```text
imprimir no console;
alterar variável externa;
salvar em arquivo;
enviar mensagem;
registrar log;
alterar banco;
modificar lista recebida.
```

Efeito colateral não é sempre errado.

Mas precisa ser claro.

Exemplo:

```java
public static BigDecimal calcularTotal(...) {
    System.out.println("calculando...");
    return total;
}
```

Esse print é efeito colateral estranho dentro de cálculo.

Melhor:

```java
BigDecimal total = calcularTotal(...);
imprimirTotal(total);
```

---

## Coesão e comentários

Comentários como separadores internos indicam baixa coesão:

```java
public static void processar() {
    // validação

    // cálculo

    // impressão

    // auditoria
}
```

Se cada comentário marca um assunto diferente, talvez cada assunto mereça um método.

Comentário bom explica motivo.

Comentário ruim compensa falta de nome.

---

## Coesão e tamanho

Não existe número mágico.

Mas como guia inicial:

```text
método com mais de 30 ou 40 linhas merece revisão;
método com muitos ifs de assuntos diferentes merece revisão;
método com muitas variáveis locais merece revisão;
método com muitos comentários de seção merece revisão.
```

Não aplique regra cega.

Use julgamento.

O objetivo é legibilidade e responsabilidade.

---

## Coesão e duplicação

Duplicação pode indicar falta de método coeso.

Exemplo:

```java
nome.trim().toUpperCase()
produto.trim().toUpperCase()
certificado.trim().toUpperCase()
```

Talvez exista:

```java
normalizarTextoMaiusculo
```

Mas cuidado:

```text
normalizar nome de cliente;
normalizar certificado de OS;
normalizar código de produto.
```

podem ter regras parecidas hoje, mas diferentes amanhã.

Nem toda duplicação textual significa mesma regra de negócio.

---

## Exemplo aplicado em cliente

Arquivo:

```text
ClienteCoesao.java
```

Código:

```java
public class ClienteCoesao {
    public static void main(String[] args) {
        String nome = normalizarNomeCliente("  Ana   Silva ");
        String email = normalizarEmailCliente(" ANA@EMAIL.COM ");

        if (!clienteValido(nome, email)) {
            System.out.println("Cliente inválido.");
            return;
        }

        imprimirCliente(nome, email);
    }

    public static String normalizarNomeCliente(String nome) {
        if (nome == null) {
            return "";
        }

        return nome.trim().replaceAll("\\s+", " ");
    }

    public static String normalizarEmailCliente(String email) {
        if (email == null) {
            return "";
        }

        return email.trim().toLowerCase();
    }

    public static boolean clienteValido(String nome, String email) {
        return nome != null
                && !nome.isBlank()
                && email != null
                && !email.isBlank()
                && email.contains("@");
    }

    public static void imprimirCliente(String nome, String email) {
        System.out.println("Cliente: " + nome);
        System.out.println("E-mail: " + email);
    }
}
```

Cada método tem uma intenção.

---

## Exemplo aplicado em produto

Arquivo:

```text
ProdutoCoesao.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoCoesao {
    public static void main(String[] args) {
        String nome = normalizarNomeProduto("  cadeira gamer ");
        BigDecimal preco = new BigDecimal("799.90");
        int estoque = 3;

        if (!produtoValido(nome, preco, estoque)) {
            System.out.println("Produto inválido.");
            return;
        }

        BigDecimal valorEstoque = calcularValorEstoque(preco, estoque);

        imprimirResumoProduto(nome, preco, estoque, valorEstoque);
    }

    public static String normalizarNomeProduto(String nome) {
        if (nome == null) {
            return "";
        }

        return nome.trim().replaceAll("\\s+", " ");
    }

    public static boolean produtoValido(String nome, BigDecimal preco, int estoque) {
        return nome != null
                && !nome.isBlank()
                && preco != null
                && preco.compareTo(BigDecimal.ZERO) > 0
                && estoque >= 0;
    }

    public static BigDecimal calcularValorEstoque(BigDecimal preco, int estoque) {
        return preco.multiply(BigDecimal.valueOf(estoque));
    }

    public static void imprimirResumoProduto(String nome, BigDecimal preco, int estoque, BigDecimal valorEstoque) {
        System.out.println("Produto: " + nome);
        System.out.println("Preço: " + preco);
        System.out.println("Estoque: " + estoque);
        System.out.println("Valor em estoque: " + valorEstoque);
    }
}
```

O método de validação valida.

O método de cálculo calcula.

O método de impressão imprime.

Isso é coesão.

---

## Exemplo aplicado em pagamento

Arquivo:

```text
PagamentoCoesao.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PagamentoCoesao {
    public static void main(String[] args) {
        BigDecimal valorInformado = new BigDecimal("100.005");
        FormaPagamento forma = FormaPagamento.PIX;

        BigDecimal valorArredondado = arredondarValorMonetario(valorInformado);

        if (!pagamentoValido(valorArredondado, forma)) {
            System.out.println("Pagamento inválido.");
            return;
        }

        String comprovante = montarComprovantePagamento(valorArredondado, forma);

        imprimirComprovante(comprovante);
    }

    public static BigDecimal arredondarValorMonetario(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor obrigatório.");
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static boolean pagamentoValido(BigDecimal valor, FormaPagamento forma) {
        return valor != null
                && valor.compareTo(BigDecimal.ZERO) > 0
                && forma != null;
    }

    public static String montarComprovantePagamento(BigDecimal valor, FormaPagamento forma) {
        return "Pagamento aprovado | valor=%s | forma=%s".formatted(valor, forma);
    }

    public static void imprimirComprovante(String comprovante) {
        System.out.println(comprovante);
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}
```

O método `arredondarValorMonetario` não valida a forma de pagamento.

O método `pagamentoValido` não imprime.

O método `montarComprovantePagamento` não arredonda.

Boa separação.

---

## Exemplo aplicado em OS

Arquivo:

```text
OrdemServicoCoesao.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoCoesao {
    public static void main(String[] args) {
        String certificado = normalizarCertificado(" os-001 ");
        LocalDate dataAgendamento = LocalDate.now().plusDays(2);

        if (!agendamentoValido(certificado, dataAgendamento)) {
            System.out.println("Agendamento inválido.");
            return;
        }

        long diasAteAgendamento = calcularDiasAteAgendamento(dataAgendamento);
        String resumo = montarResumoAgendamento(certificado, dataAgendamento, diasAteAgendamento);

        imprimirResumo(resumo);
    }

    public static String normalizarCertificado(String certificado) {
        if (certificado == null) {
            return "";
        }

        return certificado.trim().toUpperCase();
    }

    public static boolean agendamentoValido(String certificado, LocalDate dataAgendamento) {
        return certificado != null
                && !certificado.isBlank()
                && dataAgendamento != null
                && !dataAgendamento.isBefore(LocalDate.now());
    }

    public static long calcularDiasAteAgendamento(LocalDate dataAgendamento) {
        return ChronoUnit.DAYS.between(LocalDate.now(), dataAgendamento);
    }

    public static String montarResumoAgendamento(
            String certificado,
            LocalDate dataAgendamento,
            long diasAteAgendamento
    ) {
        return "OS %s agendada para %s, em %d dias."
                .formatted(certificado, dataAgendamento, diasAteAgendamento);
    }

    public static void imprimirResumo(String resumo) {
        System.out.println(resumo);
    }
}
```

---

## Exemplo aplicado em mensageria

Arquivo:

```text
MensageriaCoesao.java
```

Código:

```java
public class MensageriaCoesao {
    public static void main(String[] args) {
        String cliente = normalizarNomeCliente(" Ana ");
        String certificado = normalizarCertificadoOs(" os-001 ");

        if (!dadosMensagemValidos(cliente, certificado)) {
            System.out.println("Dados da mensagem inválidos.");
            return;
        }

        String mensagem = montarMensagemAcompanhamento(cliente, certificado);

        imprimirMensagem(mensagem);
    }

    public static String normalizarNomeCliente(String cliente) {
        if (cliente == null) {
            return "";
        }

        return cliente.trim();
    }

    public static String normalizarCertificadoOs(String certificado) {
        if (certificado == null) {
            return "";
        }

        return certificado.trim().toUpperCase();
    }

    public static boolean dadosMensagemValidos(String cliente, String certificado) {
        return cliente != null
                && !cliente.isBlank()
                && certificado != null
                && !certificado.isBlank();
    }

    public static String montarMensagemAcompanhamento(String cliente, String certificado) {
        return """
                Olá, %s.
                Sua OS %s está em acompanhamento.
                """.formatted(cliente, certificado);
    }

    public static void imprimirMensagem(String mensagem) {
        System.out.println(mensagem);
    }
}
```

Cada método tem um assunto.

---

## Exemplo aplicado em auditoria

Arquivo:

```text
AuditoriaCoesao.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaCoesao {
    public static void main(String[] args) {
        String usuario = normalizarCampoObrigatorio(" aline ");
        String operacao = normalizarCampoObrigatorio(" criacao ");
        String entidade = normalizarCampoObrigatorio(" produto ");
        Long entidadeId = 10L;

        if (!dadosAuditoriaValidos(usuario, operacao, entidade, entidadeId)) {
            System.out.println("Dados de auditoria inválidos.");
            return;
        }

        String registro = montarRegistroAuditoria(usuario, operacao, entidade, entidadeId, Instant.now());

        imprimirRegistroAuditoria(registro);
    }

    public static String normalizarCampoObrigatorio(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().toUpperCase();
    }

    public static boolean dadosAuditoriaValidos(
            String usuario,
            String operacao,
            String entidade,
            Long entidadeId
    ) {
        return usuario != null
                && !usuario.isBlank()
                && operacao != null
                && !operacao.isBlank()
                && entidade != null
                && !entidade.isBlank()
                && entidadeId != null
                && entidadeId > 0;
    }

    public static String montarRegistroAuditoria(
            String usuario,
            String operacao,
            String entidade,
            Long entidadeId,
            Instant criadoEm
    ) {
        return "AUDITORIA | usuario=%s | operacao=%s | entidade=%s | entidadeId=%d | criadoEm=%s"
                .formatted(usuario, operacao, entidade, entidadeId, criadoEm);
    }

    public static void imprimirRegistroAuditoria(String registro) {
        System.out.println(registro);
    }
}
```

Leitura crítica:

```text
dadosAuditoriaValidos tem vários parâmetros;
ainda é coeso porque valida dados de auditoria;
futuramente, um record RegistroAuditoria pode melhorar isso.
```

---

## Exemplo de método curto, mas pouco coeso

Arquivo:

```text
MetodoCurtoPoucoCoeso.java
```

Código:

```java
public class MetodoCurtoPoucoCoeso {
    public static void main(String[] args) {
        salvarEEnviar("PED-001");
    }

    public static void salvarEEnviar(String codigoPedido) {
        System.out.println("Salvando pedido " + codigoPedido);
        System.out.println("Enviando e-mail do pedido " + codigoPedido);
    }
}
```

É curto.

Mas mistura:

```text
salvar;
enviar e-mail.
```

Melhor:

```java
salvarPedido(codigoPedido);
enviarEmailPedido(codigoPedido);
```

Tamanho não é tudo.

---

## Exemplo de método maior, mas coeso

Arquivo:

```text
MetodoMaiorCoeso.java
```

Código:

```java
public class MetodoMaiorCoeso {
    public static void main(String[] args) {
        ResultadoValidacao resultado = validarSenha("Abc12345");

        System.out.println(resultado);
    }

    public static ResultadoValidacao validarSenha(String senha) {
        if (senha == null || senha.isBlank()) {
            return ResultadoValidacao.erro("Senha é obrigatória.");
        }

        if (senha.length() < 8) {
            return ResultadoValidacao.erro("Senha deve ter pelo menos 8 caracteres.");
        }

        if (!temLetra(senha)) {
            return ResultadoValidacao.erro("Senha deve ter pelo menos uma letra.");
        }

        if (!temNumero(senha)) {
            return ResultadoValidacao.erro("Senha deve ter pelo menos um número.");
        }

        return ResultadoValidacao.sucesso();
    }

    public static boolean temLetra(String valor) {
        for (int i = 0; i < valor.length(); i++) {
            if (Character.isLetter(valor.charAt(i))) {
                return true;
            }
        }

        return false;
    }

    public static boolean temNumero(String valor) {
        for (int i = 0; i < valor.length(); i++) {
            if (Character.isDigit(valor.charAt(i))) {
                return true;
            }
        }

        return false;
    }
}

record ResultadoValidacao(boolean valido, String mensagem) {
    static ResultadoValidacao sucesso() {
        return new ResultadoValidacao(true, "OK");
    }

    static ResultadoValidacao erro(String mensagem) {
        return new ResultadoValidacao(false, mensagem);
    }
}
```

`validarSenha` tem vários `if`.

Mas a intenção é uma:

```text
validar senha.
```

Coesão é sobre intenção.

---

## Refatoração: separando cálculo e saída

Antes:

```java
public static void calcularTotal(BigDecimal preco, int quantidade) {
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    System.out.println(total);
}
```

Depois:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}

public static void imprimirTotal(BigDecimal total) {
    System.out.println(total);
}
```

Ganho:

```text
calcular pode ser testado;
imprimir pode mudar sem afetar cálculo;
cada método tem um motivo de mudança.
```

---

## Refatoração: separando validação e normalização

Antes:

```java
public static String validarENormalizarNome(String nome) {
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome obrigatório.");
    }

    return nome.trim().toUpperCase();
}
```

Isso pode ser aceitável em alguns contextos.

Mas se quisermos separar:

```java
public static String normalizarNome(String nome) {
    if (nome == null) {
        return "";
    }

    return nome.trim().toUpperCase();
}

public static boolean nomeValido(String nome) {
    return nome != null && !nome.isBlank();
}
```

Decisão depende do contrato.

Se o método é especificamente:

```text
normalizar nome obrigatório
```

pode validar e normalizar.

Se validação e normalização serão usadas separadamente, separe.

Coesão exige julgamento.

---

## Refatoração: método de coordenação

Um método de coordenação pode ficar assim:

```java
public static void processarPagamentoExemplo() {
    BigDecimal valor = arredondarValorMonetario(new BigDecimal("100.005"));

    if (!pagamentoValido(valor, FormaPagamento.PIX)) {
        return;
    }

    String comprovante = montarComprovantePagamento(valor, FormaPagamento.PIX);

    imprimirComprovante(comprovante);
}
```

Esse método coordena.

Ele não contém detalhes de arredondamento, validação, montagem e impressão.

Isso é aceitável.

---

## Coesão e futuro OO

Por que estudar coesão antes de orientação a objetos?

Porque classe nada mais é do que um lugar que reúne dados e comportamentos.

Se você ainda não sabe escrever método coeso, provavelmente escreverá classe pouco coesa.

Exemplo ruim futuro:

```text
ClienteService
```

fazendo:

```text
validar cliente;
salvar pedido;
enviar e-mail;
calcular frete;
gerar nota;
registrar log;
formatar CPF;
chamar API externa.
```

O problema começa no método.

Depois cresce para classe.

Depois vira arquitetura ruim.

---

## Erros comuns

### Erro 1 — Achar que coesão é só tamanho

Não é.

É intenção.

---

### Erro 2 — Método com “e” no nome

```java
validarEImprimir()
```

Sinal de mistura.

---

### Erro 3 — Misturar cálculo e impressão

Cálculo retorna.

Impressão imprime.

---

### Erro 4 — Misturar validação e persistência

Validação decide se está ok.

Persistência salva.

---

### Erro 5 — Misturar normalização e mensagem sem necessidade

Normalizar dado e montar mensagem são responsabilidades diferentes.

---

### Erro 6 — Extrair método demais

Criar métodos artificiais pode piorar leitura.

---

### Erro 7 — Método de coordenação com detalhes demais

Coordenação deve chamar passos, não conter todos os detalhes.

---

### Erro 8 — Ignorar efeito colateral

Método que parece cálculo, mas imprime ou altera estado, surpreende.

---

### Erro 9 — Duplicação mal interpretada

Nem toda duplicação visual é mesma regra de negócio.

---

### Erro 10 — Refatorar sem rodar

Sempre valide.

---

## Diagnóstico de coesão

Ao revisar um método, pergunte:

### 1. Consigo resumir o método em uma frase curta?

Se não, há mistura.

### 2. O método tem “e” no nome?

Pode ser sinal.

### 3. O método mistura entrada, regra e saída?

Talvez precise separar.

### 4. O método calcula e imprime?

Considere separar.

### 5. O método valida e salva?

Considere separar.

### 6. O método tem comentários de seção?

Talvez cada seção seja um método.

### 7. O método muda por muitos motivos?

Baixa coesão.

### 8. O método usa variáveis de assuntos diferentes?

Sinal de mistura.

### 9. O método tem efeito colateral inesperado?

Revise.

### 10. A extração melhora leitura?

Se não, talvez não extraia.

---

## Debug recomendado

Use debug no arquivo:

```text
MetodoCoeso.java
```

Coloque breakpoints em:

```java
processarPedidoExemplo()
pedidoValido(...)
calcularTotalBruto(...)
calcularDesconto(...)
calcularTotalFinal(...)
imprimirResumo(...)
registrarAuditoriaProcessamento(...)
```

Observe:

```text
cada método recebe dados específicos;
cada método retorna ou executa uma ação específica;
o fluxo de alto nível fica claro;
a investigação fica mais fácil.
```

Depois compare com:

```text
MetodoPoucoCoeso.java
```

Observe como é mais difícil isolar responsabilidades.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — colocar print dentro de cálculo

Adicione:

```java
System.out.println("Calculando total...");
```

dentro de `calcularTotalBruto`.

Explique por que isso é efeito colateral estranho.

---

### Teste 2 — colocar auditoria dentro de validação

Adicione auditoria dentro de `pedidoValido`.

Explique por que mistura responsabilidades.

---

### Teste 3 — juntar desconto e total final

Crie:

```java
calcularDescontoETotalFinal
```

Depois separe de novo.

Compare leitura.

---

### Teste 4 — criar método artificial demais

Crie método para imprimir uma linha vazia.

Explique se melhorou ou piorou.

---

### Teste 5 — método curto pouco coeso

Crie método de duas linhas que salva e envia mensagem.

Explique por que tamanho não garante coesão.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-092-coesao-em-metodos
cd labs\m3\aula-092-coesao-em-metodos
```

Crie arquivos:

```text
MetodoPoucoCoeso.java
MetodoCoeso.java
ClienteCoesao.java
ProdutoCoesao.java
PagamentoCoesao.java
OrdemServicoCoesao.java
MensageriaCoesao.java
AuditoriaCoesao.java
MetodoCurtoPoucoCoeso.java
MetodoMaiorCoeso.java
DebugCoesaoMetodos.java
ErroCalculaEImprime.java
ErroValidaESalva.java
ErroMetodoComE.java
ErroExtracaoArtificial.java
ErroEfeitoColateral.java
README.md
```

Compile:

```powershell
javac MetodoPoucoCoeso.java
javac MetodoCoeso.java
javac ClienteCoesao.java
javac ProdutoCoesao.java
javac PagamentoCoesao.java
javac OrdemServicoCoesao.java
javac MensageriaCoesao.java
javac AuditoriaCoesao.java
javac MetodoCurtoPoucoCoeso.java
javac MetodoMaiorCoeso.java
```

Execute:

```powershell
java MetodoPoucoCoeso
java MetodoCoeso
java ClienteCoesao
java ProdutoCoesao
java PagamentoCoesao
java OrdemServicoCoesao
java MensageriaCoesao
java AuditoriaCoesao
java MetodoCurtoPoucoCoeso
java MetodoMaiorCoeso
```

Arquivos de erro ou leitura crítica:

```text
ErroCalculaEImprime.java
ErroValidaESalva.java
ErroMetodoComE.java
ErroExtracaoArtificial.java
ErroEfeitoColateral.java
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 092 — Coesão em métodos

## Objetivo

Aprender a avaliar se um método faz uma coisa principal, evitando mistura de responsabilidades como validação, cálculo, impressão, auditoria e montagem de mensagem no mesmo bloco.

## Conceitos

- Coesão é foco de intenção.
- Método coeso faz uma coisa principal.
- Tamanho ajuda a diagnosticar, mas não define sozinho.
- Método curto também pode ser pouco coeso.
- Método maior pode ser coeso se tiver uma intenção clara.
- Comentários de seção podem denunciar métodos ausentes.
- Método de coordenação pode chamar vários passos.
- Cálculo e impressão devem ficar separados.
- Validação e persistência devem ficar separadas.
- Efeitos colaterais precisam ser claros.
- Refatoração deve preservar comportamento.

## Arquivos

- `MetodoPoucoCoeso.java`
- `MetodoCoeso.java`
- `ClienteCoesao.java`
- `ProdutoCoesao.java`
- `PagamentoCoesao.java`
- `OrdemServicoCoesao.java`
- `MensageriaCoesao.java`
- `AuditoriaCoesao.java`
- `MetodoCurtoPoucoCoeso.java`
- `MetodoMaiorCoeso.java`

## Comandos

```powershell
javac MetodoCoeso.java
java MetodoCoeso
javac ProdutoCoesao.java
java ProdutoCoesao
```

## Observações

- Não usar tamanho como única regra.
- Não criar método artificial.
- Não esconder efeito colateral.
- Não misturar cálculo e saída.
- Não misturar validação e auditoria sem motivo.
- Sempre rodar após refatorar.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | ação Extract Method | Separar responsabilidades |
| Inline Method | ação Inline | Reverter extração artificial |
| Buscar ação | `Ctrl + Shift + A` | Encontrar refatorações |
| Debug | `Shift + F9` | Observar fluxo |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Avançar |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar retorno |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar comportamento |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 092 — Coesão em métodos

### O que aprendi
Aprendi que coesão em método significa ter uma intenção principal. Um método coeso pode ter mais de uma linha e mais de um if, desde que tudo trabalhe para a mesma responsabilidade.

### O que pratiquei
Comparei métodos pouco coesos e métodos coesos. Separei normalização, validação, cálculo, impressão, auditoria e montagem de mensagem em métodos com responsabilidades mais claras.

### Conceitos principais
- coesão
- responsabilidade principal
- método pequeno
- método coeso
- método pouco coeso
- nível de abstração
- efeito colateral
- método de coordenação
- comentários de seção
- cálculo
- impressão
- validação
- auditoria
- refatoração
- legibilidade
- comportamento preservado

### Arquivos criados
- `labs/m3/aula-092-coesao-em-metodos/MetodoPoucoCoeso.java`
- `labs/m3/aula-092-coesao-em-metodos/MetodoCoeso.java`
- `labs/m3/aula-092-coesao-em-metodos/ClienteCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/ProdutoCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/PagamentoCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/OrdemServicoCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/MensageriaCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/AuditoriaCoesao.java`
- `labs/m3/aula-092-coesao-em-metodos/MetodoCurtoPoucoCoeso.java`
- `labs/m3/aula-092-coesao-em-metodos/MetodoMaiorCoeso.java`
- `labs/m3/aula-092-coesao-em-metodos/README.md`

### Comandos usados
```powershell
javac MetodoPoucoCoeso.java
java MetodoPoucoCoeso
javac MetodoCoeso.java
java MetodoCoeso
javac ClienteCoesao.java
java ClienteCoesao
```

### Erros que quero evitar
- achar que coesão é só tamanho;
- método com “e” no nome;
- misturar cálculo e impressão;
- misturar validação e auditoria;
- criar método artificial demais;
- deixar efeito colateral escondido;
- usar comentário para compensar falta de método;
- refatorar sem rodar;
- separar demais sem melhorar leitura;
- confundir coordenação com mistura de detalhes.

### Próximo passo
Estudar parâmetros demais e alternativas.
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
git add labs/m3/aula-092-coesao-em-metodos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 092: pratica coesao em metodos"
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
1. O que é coesão?
2. O que significa coesão em método?
3. Um método coeso precisa ter uma linha?
4. Um método maior pode ser coeso?
5. Um método curto pode ser pouco coeso?
6. O que significa “fazer uma coisa”?
7. O que é responsabilidade principal?
8. Como comentários de seção podem denunciar baixa coesão?
9. Por que nome com “e” pode ser alerta?
10. Por que cálculo e impressão devem ficar separados?
11. O que é efeito colateral?
12. Todo efeito colateral é errado?
13. O que é método de coordenação?
14. Qual diferença entre coordenar e misturar detalhes?
15. Por que validação e persistência não devem ser misturadas sem motivo?
16. Como duplicação se relaciona com coesão?
17. Por que nem toda duplicação visual é mesma regra?
18. Como debug ajuda a perceber coesão?
19. Como coesão prepara para orientação a objetos?
20. Qual método você refatorou nesta aula e por quê?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar coesão;
explicar coesão em métodos;
diferenciar tamanho de coesão;
identificar método pouco coeso;
identificar método coeso;
explicar responsabilidade principal;
identificar método com “e” no nome;
separar cálculo e impressão;
separar validação e auditoria;
identificar efeito colateral;
explicar método de coordenação;
refatorar método pouco coeso;
preservar comportamento após refatoração;
aplicar em cliente;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar fluxo entre métodos;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar classes de serviço.

Não precisa ainda dominar orientação a objetos avançada.

Não precisa ainda criar testes automatizados.

Não precisa ainda usar Maven.

Não precisa ainda aplicar SOLID formalmente.

Esses assuntos virão depois.

O objetivo é:

```text
enxergar se um método tem uma intenção principal ou se mistura responsabilidades demais.
```

---

## Fechamento da aula

Hoje estudamos coesão em métodos.

A ideia central foi:

```text
um método bom não é apenas pequeno; ele precisa ter foco.
```

Vimos que:

```text
coesão é intenção;
tamanho não decide tudo;
método curto pode ser ruim;
método maior pode ser coeso;
comentários de seção podem denunciar falta de métodos;
nome com “e” pode indicar mistura;
cálculo deve ficar separado de impressão;
validação deve ficar separada de auditoria quando possível;
efeitos colaterais precisam ser claros;
método de coordenação pode chamar vários passos;
refatoração deve preservar comportamento.
```

O ponto mais importante é:

```text
método coeso é mais fácil de ler, testar, debugar e evoluir.
```

Na próxima aula, vamos estudar:

```text
Parâmetros demais e alternativas.
```

A próxima aula vai aprofundar agrupamento, clareza, cheiro de código, objeto futuro, records, ordem de parâmetros e alternativas para assinaturas que começam a ficar difíceis de usar.
