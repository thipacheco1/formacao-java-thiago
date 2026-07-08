# 100 — M3.11 — Refatoração Extract Method no IntelliJ

## Revisão do cronograma antes de gerar

O cronograma oficial auditável foi revisado antes desta geração.

A sequência correta neste ponto é:

```text
098 — M3.09 — Reuso sem duplicação
099 — M3.10 — Debug entrando em métodos
100 — M3.11 — Refatoração Extract Method no IntelliJ
101 — M3.12 — Mini arquitetura procedural
102 — M3.13 — Projeto calculadora console revisitada
```

Portanto, o próximo documento oficial após a aula `099_M3_10_DEBUG_ENTRANDO_EM_METODOS_OFICIAL.md` é:

```text
100_M3_11_REFATORACAO_EXTRACT_METHOD_NO_INTELLIJ_OFICIAL.md
```

---

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.11.01` — Refatoração Extract Method no IntelliJ — Conceito profundo e quando usar.
- `M3.11.02` — Refatoração Extract Method no IntelliJ — Implementação guiada com código realista.
- `M3.11.03` — Refatoração Extract Method no IntelliJ — Refatoração, melhoria e leitura crítica.
- `M3.11.04` — Refatoração Extract Method no IntelliJ — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar seleção correta, nome, parâmetros gerados, revisão de assinatura, extração segura, uso profissional do IntelliJ, validação do comportamento antes e depois da refatoração, leitura crítica, debug pós-extração, riscos comuns e aplicação em validação, cálculo, exibição, leitura, reuso, cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
debug funcionando;
atalhos básicos da IDE conhecidos.
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
Run funciona;
Debug funciona;
atalho de Rename está acessível;
atalho de Extract Method está acessível;
atalho de Reformat Code está acessível;
Local History está disponível;
Git Diff está disponível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-100-refatoracao-extract-method-no-intellij
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

Nas últimas aulas, estudamos:

```text
métodos pequenos;
assinatura profissional;
coesão;
parâmetros demais;
retorno boolean;
métodos de cálculo;
métodos de exibição;
métodos de leitura;
reuso sem duplicação;
debug entrando em métodos.
```

Agora vamos usar a IDE como ferramenta de refatoração controlada.

Não vamos extrair método de qualquer jeito.

Vamos aprender a usar:

```text
Extract Method;
Rename;
Change Signature;
Reformat Code;
Debug;
Git Diff.
```

com critério técnico.

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
100 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 100
Aulas oficiais restantes: 438
```

Contando o arquivo de abertura `000`, teremos:

```text
101 arquivos gerados no total.
```

Este é um marco importante da formação.

Chegamos à aula oficial 100 com base sólida de Java, métodos, organização, debug e refatoração.

---

## A pergunta central da aula

Quando você tem este código:

```java
if (cliente == null || cliente.isBlank()) {
    System.out.println("Cliente obrigatório.");
    return;
}

if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
    System.out.println("Valor inválido.");
    return;
}

BigDecimal total = valor.multiply(BigDecimal.valueOf(quantidade));

if (total.compareTo(new BigDecimal("300.00")) >= 0) {
    BigDecimal desconto = total.multiply(new BigDecimal("0.10"));
    total = total.subtract(desconto);
}
```

como transformar partes dele em métodos sem quebrar o comportamento?

Você poderia extrair:

```text
textoInformado;
valorPositivo;
calcularTotalPedido;
calcularDesconto;
calcularTotalFinal;
imprimirErro.
```

Mas a pergunta profissional é:

```text
qual trecho selecionar, qual nome dar, quais parâmetros aceitar e como revisar a assinatura gerada pela IDE?
```

Essa é a aula.

---

## O que é refatoração

Refatoração é mudar a estrutura interna do código sem mudar o comportamento externo esperado.

Exemplo:

Antes:

```java
BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));
```

Depois:

```java
BigDecimal total = calcularTotalPedido(preco, quantidade);
```

Com método:

```java
public static BigDecimal calcularTotalPedido(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}
```

O comportamento deve continuar igual.

A estrutura melhorou.

Esse é o objetivo.

---

## O que é Extract Method

`Extract Method` é uma refatoração que transforma um trecho selecionado em um novo método.

Antes:

```java
boolean clienteInformado = cliente != null && !cliente.isBlank();
```

Depois:

```java
boolean clienteInformado = textoInformado(cliente);
```

Com método:

```java
public static boolean textoInformado(String valor) {
    return valor != null && !valor.isBlank();
}
```

A IDE pode ajudar a:

```text
identificar variáveis usadas;
criar parâmetros;
inferir retorno;
substituir o trecho selecionado pela chamada;
criar o método no local adequado.
```

Mas a IDE não sabe se o nome escolhido é bom.

A responsabilidade técnica continua sendo sua.

---

## O que Extract Method não faz sozinho

A IDE não garante:

```text
que a seleção foi a melhor;
que o nome ficou profissional;
que o método ficou coeso;
que a abstração faz sentido;
que a regra extraída tem intenção real;
que a assinatura está boa;
que o código ficou melhor;
que o comportamento foi validado.
```

A IDE executa a operação.

Você faz a decisão técnica.

---

## Quando usar Extract Method

Use Extract Method quando:

```text
um trecho tem intenção clara;
uma condição está grande;
um cálculo tem nome de negócio;
um bloco aparece repetido;
o main está ficando grande;
o método atual tem responsabilidades misturadas;
um trecho precisa ser testado mentalmente;
um trecho merece nome;
o debug ficaria melhor com método separado.
```

Exemplos:

```text
calcularTotalPedido;
textoInformado;
valorPositivo;
podeProcessarPedido;
imprimirResumoPedido;
lerTextoObrigatorio;
calcularDesconto;
registrarAuditoriaSimulada.
```

---

## Quando não usar Extract Method

Evite Extract Method quando:

```text
o trecho não tem intenção clara;
o método criado teria nome genérico;
a extração criaria parâmetros demais;
a extração esconderia regra importante;
o trecho é simples e aparece uma vez;
a abstração seria artificial;
a chamada ficaria menos clara que o código original.
```

Exemplo ruim:

```java
public static void fazerCoisa(String a, BigDecimal b, int c, boolean d) {
}
```

Esse nome não ajuda.

Outro exemplo ruim:

```java
executarParte1(...)
executarParte2(...)
```

Nomes assim mostram que a extração não encontrou uma intenção real.

---

## Regra de ouro

A regra de ouro da aula:

```text
extraia intenção, não apenas linhas.
```

Não pense:

```text
vou selecionar 5 linhas.
```

Pense:

```text
essas linhas representam qual regra?
```

Se a resposta for:

```text
validar cliente;
calcular total;
imprimir cabeçalho;
ler opção;
calcular desconto;
```

a extração tem chance de ser boa.

Se a resposta for:

```text
parte de cima;
miolo;
trecho aqui;
coisa;
processar;
```

não extraia ainda.

---

## Fluxo profissional de Extract Method

Use este fluxo:

```text
1. Rode o código antes.
2. Entenda o comportamento atual.
3. Selecione um trecho pequeno.
4. Use Extract Method.
5. Dê nome claro.
6. Revise parâmetros gerados.
7. Revise retorno gerado.
8. Reformat code.
9. Compile.
10. Execute.
11. Compare comportamento.
12. Veja Git Diff.
13. Faça commit apenas quando estiver limpo.
```

Não pule o antes e depois.

Refatoração sem validação é risco.

---

## Atalho do IntelliJ

O atalho pode variar conforme keymap.

Em muitos ambientes Windows/Linux:

```text
Ctrl + Alt + M
```

Mas se não funcionar, use:

```text
Refactor > Extract > Method
```

ou procure por:

```text
Extract Method
```

no menu de ações da IDE.

O importante é saber o nome da ação:

```text
Extract Method
```

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
ExtractMethodBasicoAntes.java
```

Código inicial:

```java
public class ExtractMethodBasicoAntes {
    public static void main(String[] args) {
        String nome = "Ana";

        if (nome != null && !nome.isBlank()) {
            System.out.println("Nome informado.");
        } else {
            System.out.println("Nome obrigatório.");
        }
    }
}
```

Trecho candidato:

```java
nome != null && !nome.isBlank()
```

Intenção:

```text
texto informado.
```

Depois da extração:

Arquivo:

```text
ExtractMethodBasicoDepois.java
```

Código:

```java
public class ExtractMethodBasicoDepois {
    public static void main(String[] args) {
        String nome = "Ana";

        if (textoInformado(nome)) {
            System.out.println("Nome informado.");
        } else {
            System.out.println("Nome obrigatório.");
        }
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

O método extraído:

```java
textoInformado
```

é melhor do que:

```java
validar
check
teste
metodo1
```

porque comunica intenção.

---

## Como selecionar corretamente

A seleção deve conter um trecho completo e coerente.

Boa seleção:

```java
nome != null && !nome.isBlank()
```

Má seleção:

```java
nome != null &&
```

ou:

```java
!nome
```

A seleção precisa formar uma expressão ou bloco válido.

A IDE ajuda, mas você precisa escolher bem.

---

## Extraindo condição grande

Arquivo:

```text
ExtractCondicaoPedido.java
```

Antes:

```java
import java.math.BigDecimal;

public class ExtractCondicaoPedido {
    public static void main(String[] args) {
        String cliente = "Ana";
        BigDecimal valor = new BigDecimal("100.00");
        int quantidade = 2;
        boolean bloqueado = false;

        if (cliente != null
                && !cliente.isBlank()
                && valor != null
                && valor.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0
                && !bloqueado) {
            System.out.println("Pedido pode ser processado.");
        } else {
            System.out.println("Pedido inválido.");
        }
    }
}
```

Extração desejada:

```java
podeProcessarPedido(cliente, valor, quantidade, bloqueado)
```

Depois:

```java
import java.math.BigDecimal;

public class ExtractCondicaoPedido {
    public static void main(String[] args) {
        String cliente = "Ana";
        BigDecimal valor = new BigDecimal("100.00");
        int quantidade = 2;
        boolean bloqueado = false;

        if (podeProcessarPedido(cliente, valor, quantidade, bloqueado)) {
            System.out.println("Pedido pode ser processado.");
        } else {
            System.out.println("Pedido inválido.");
        }
    }

    public static boolean podeProcessarPedido(
            String cliente,
            BigDecimal valor,
            int quantidade,
            boolean bloqueado
    ) {
        return cliente != null
                && !cliente.isBlank()
                && valor != null
                && valor.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0
                && !bloqueado;
    }
}
```

Revisão crítica:

```text
o método ficou útil;
mas tem quatro parâmetros;
talvez uma próxima refatoração use record PedidoEntrada.
```

Extract Method não é o fim.

É uma etapa.

---

## Extraindo cálculo

Arquivo:

```text
ExtractCalculoPedido.java
```

Antes:

```java
import java.math.BigDecimal;

public class ExtractCalculoPedido {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        System.out.println("Total: " + total);
    }
}
```

Selecione:

```java
precoUnitario.multiply(BigDecimal.valueOf(quantidade))
```

Extraia para:

```java
calcularTotalPedido
```

Depois:

```java
import java.math.BigDecimal;

public class ExtractCalculoPedido {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);

        System.out.println("Total: " + total);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
```

Revisão:

```text
nome claro;
parâmetros necessários;
retorno correto;
comportamento preservado.
```

---

## Extraindo exibição

Arquivo:

```text
ExtractExibicao.java
```

Antes:

```java
public class ExtractExibicao {
    public static void main(String[] args) {
        String cliente = "Ana";
        String produto = "Cadeira";

        System.out.println("====================================");
        System.out.println("RESUMO");
        System.out.println("====================================");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("------------------------------------");
    }
}
```

Selecione o bloco de prints.

Extraia para:

```java
imprimirResumo
```

Depois:

```java
public class ExtractExibicao {
    public static void main(String[] args) {
        String cliente = "Ana";
        String produto = "Cadeira";

        imprimirResumo(cliente, produto);
    }

    public static void imprimirResumo(String cliente, String produto) {
        System.out.println("====================================");
        System.out.println("RESUMO");
        System.out.println("====================================");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("------------------------------------");
    }
}
```

Revisão:

```text
método é void;
nome comunica exibição;
parâmetros foram gerados pela IDE;
pode melhorar com record no futuro.
```

---

## Extraindo leitura

Arquivo:

```text
ExtractLeitura.java
```

Antes:

```java
import java.util.Scanner;

public class ExtractLeitura {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Nome: ");
        String nome = scanner.nextLine().trim();

        while (nome.isBlank()) {
            System.out.println("Valor obrigatório.");
            System.out.print("Nome: ");
            nome = scanner.nextLine().trim();
        }

        System.out.println("Nome: " + nome);
    }
}
```

Selecione a leitura com loop.

Extraia para:

```java
lerTextoObrigatorio
```

Depois:

```java
import java.util.Scanner;

public class ExtractLeitura {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome: ");

        System.out.println("Nome: " + nome);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório.");
        }
    }
}
```

Revisão:

```text
método retorna String;
scanner e prompt são parâmetros;
loop está isolado;
main ficou mais legível.
```

---

## Extraindo auditoria simulada

Arquivo:

```text
ExtractAuditoria.java
```

Antes:

```java
import java.time.Instant;

public class ExtractAuditoria {
    public static void main(String[] args) {
        String usuario = "aline";
        String operacao = "CRIACAO";
        String entidade = "Produto";
        Long entidadeId = 10L;

        System.out.println("AUDITORIA");
        System.out.println("Usuário: " + usuario);
        System.out.println("Operação: " + operacao);
        System.out.println("Entidade: " + entidade);
        System.out.println("Entidade ID: " + entidadeId);
        System.out.println("Criado em: " + Instant.now());
    }
}
```

Extraia o bloco para:

```java
imprimirAuditoria
```

Depois:

```java
import java.time.Instant;

public class ExtractAuditoria {
    public static void main(String[] args) {
        String usuario = "aline";
        String operacao = "CRIACAO";
        String entidade = "Produto";
        Long entidadeId = 10L;

        imprimirAuditoria(usuario, operacao, entidade, entidadeId);
    }

    public static void imprimirAuditoria(
            String usuario,
            String operacao,
            String entidade,
            Long entidadeId
    ) {
        System.out.println("AUDITORIA");
        System.out.println("Usuário: " + usuario);
        System.out.println("Operação: " + operacao);
        System.out.println("Entidade: " + entidade);
        System.out.println("Entidade ID: " + entidadeId);
        System.out.println("Criado em: " + Instant.now());
    }
}
```

Revisão crítica:

```text
o método tem muitos parâmetros;
a extração melhorou o main;
mas talvez RegistroAuditoria seja melhor no futuro.
```

---

## Revisando parâmetros gerados

A IDE cria parâmetros com base nas variáveis usadas pelo trecho.

Exemplo:

```java
imprimirResumo(cliente, produto, total, desconto, totalFinal)
```

A IDE não sabe se isso deveria virar:

```java
imprimirResumo(ResumoPedido resumo)
```

Essa decisão é sua.

Checklist de parâmetros:

```text
a quantidade ficou aceitável?
os nomes ficaram claros?
há muitos parâmetros do mesmo tipo?
algum parâmetro é boolean misterioso?
há um record/conceito possível?
a ordem está segura?
```

Se a assinatura ficou ruim, não aceite cegamente.

Refatore novamente.

---

## Revisando retorno gerado

A IDE pode gerar retorno quando o trecho selecionado produz valor.

Exemplo:

```java
BigDecimal desconto = total.multiply(new BigDecimal("0.10"));
```

Se extrair cálculo, o método deve retornar:

```java
BigDecimal
```

Revise:

```text
o tipo de retorno faz sentido?
o método deveria retornar ou ser void?
o método está alterando variável externa?
o retorno tem nome claro?
```

Método de cálculo retorna valor.

Método de validação retorna boolean.

Método de exibição geralmente é void.

Método de leitura retorna o valor lido.

---

## Revisando nome

Nome é a parte mais importante.

Ruim:

```java
metodo1
extrair
processar
fazer
validar
calcular
imprimir
```

Melhor:

```java
textoInformado
podeProcessarPedido
calcularTotalPedido
calcularDesconto
imprimirResumoPedido
lerTextoObrigatorio
registrarAuditoriaSimulada
```

Nome bom responde:

```text
o que esse método faz?
```

Se o nome precisa ser explicado em comentário, talvez esteja ruim.

---

## Revisando local do método

Por enquanto, estamos em arquivos simples.

A IDE pode colocar o método abaixo do `main`.

Isso é aceitável nesta fase.

Ordem sugerida em programas console:

```text
main;
métodos de fluxo principal;
métodos de leitura;
métodos de validação;
métodos de cálculo;
métodos de exibição;
métodos auxiliares.
```

Não é lei.

Mas ajuda leitura.

---

## Debug após Extract Method

Depois de extrair método, rode debug.

Por quê?

Porque agora o fluxo tem chamada nova.

Verifique:

```text
o método é chamado;
os parâmetros chegam certos;
o retorno volta certo;
o comportamento é igual ao anterior;
a call stack faz sentido.
```

Use `Step Into` no método recém-extraído.

Se algo ficou errado, volte e revise.

---

## Git Diff após Extract Method

Depois de refatorar, veja:

```bash
git diff
```

ou o Diff do IntelliJ.

Procure:

```text
mudança estrutural sem mudança de comportamento;
remoção de duplicação;
novo método com nome claro;
chamadas corretas;
nenhuma alteração acidental;
nenhum arquivo .class no Git.
```

Refatoração boa deve ter diff compreensível.

Se o diff ficou enorme e confuso, talvez você tenha refatorado demais de uma vez.

---

## Exemplo aplicado completo: pedido antes

Arquivo:

```text
PedidoExtractAntes.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoExtractAntes {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Cliente: ");
        String cliente = scanner.nextLine().trim();

        while (cliente.isBlank()) {
            System.out.println("Cliente obrigatório.");
            System.out.print("Cliente: ");
            cliente = scanner.nextLine().trim();
        }

        System.out.print("Produto: ");
        String produto = scanner.nextLine().trim();

        while (produto.isBlank()) {
            System.out.println("Produto obrigatório.");
            System.out.print("Produto: ");
            produto = scanner.nextLine().trim();
        }

        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal totalBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        BigDecimal desconto = BigDecimal.ZERO;

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            desconto = totalBruto.multiply(new BigDecimal("0.10"));
        }

        BigDecimal totalFinal = totalBruto.subtract(desconto);

        System.out.println("====================================");
        System.out.println("RESUMO DO PEDIDO");
        System.out.println("====================================");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
        System.out.println("------------------------------------");
    }
}
```

Problemas:

```text
leitura duplicada;
cálculo no main;
exibição no main;
regra de desconto sem nome;
main grande.
```

---

## Exemplo aplicado completo: pedido depois

Arquivo:

```text
PedidoExtractDepois.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoExtractDepois {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String produto = lerTextoObrigatorio(scanner, "Produto: ");

        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal totalBruto = calcularTotalBruto(precoUnitario, quantidade);
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        imprimirResumoPedido(cliente, produto, totalBruto, desconto, totalFinal);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório.");
        }
    }

    public static BigDecimal calcularTotalBruto(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
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

    public static void imprimirResumoPedido(
            String cliente,
            String produto,
            BigDecimal totalBruto,
            BigDecimal desconto,
            BigDecimal totalFinal
    ) {
        System.out.println("====================================");
        System.out.println("RESUMO DO PEDIDO");
        System.out.println("====================================");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
        System.out.println("------------------------------------");
    }
}
```

Ganho:

```text
main ficou legível;
leitura virou método;
cálculo virou método;
exibição virou método;
regra de desconto ganhou nome.
```

Ponto de atenção:

```text
imprimirResumoPedido tem muitos parâmetros.
```

Esse é um próximo passo de refatoração.

Aula anterior sobre parâmetros demais ajuda aqui.

---

## Melhorando com record depois da extração

Arquivo:

```text
PedidoExtractComRecord.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoExtractComRecord {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        PedidoEntrada pedido = lerPedido(scanner);

        ResumoPedido resumo = gerarResumoPedido(pedido);

        imprimirResumoPedido(resumo);
    }

    public static PedidoEntrada lerPedido(Scanner scanner) {
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String produto = lerTextoObrigatorio(scanner, "Produto: ");
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        return new PedidoEntrada(cliente, produto, precoUnitario, quantidade);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório.");
        }
    }

    public static ResumoPedido gerarResumoPedido(PedidoEntrada pedido) {
        BigDecimal totalBruto = calcularTotalBruto(pedido.precoUnitario(), pedido.quantidade());
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        return new ResumoPedido(pedido.cliente(), pedido.produto(), totalBruto, desconto, totalFinal);
    }

    public static BigDecimal calcularTotalBruto(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
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

    public static void imprimirResumoPedido(ResumoPedido resumo) {
        System.out.println("====================================");
        System.out.println("RESUMO DO PEDIDO");
        System.out.println("====================================");
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Produto: " + resumo.produto());
        System.out.println("Total bruto: " + resumo.totalBruto());
        System.out.println("Desconto: " + resumo.desconto());
        System.out.println("Total final: " + resumo.totalFinal());
        System.out.println("------------------------------------");
    }
}

record PedidoEntrada(
        String cliente,
        String produto,
        BigDecimal precoUnitario,
        int quantidade
) {
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

Agora o fluxo principal está mais expressivo:

```java
PedidoEntrada pedido = lerPedido(scanner);
ResumoPedido resumo = gerarResumoPedido(pedido);
imprimirResumoPedido(resumo);
```

Isso prepara a próxima aula de mini arquitetura procedural.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoExtractMethod.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoExtractMethod {
    public static void main(String[] args) {
        PagamentoEntrada pagamento = new PagamentoEntrada("PAG-001", new BigDecimal("100.00"), FormaPagamento.PIX);

        if (!pagamentoValido(pagamento)) {
            imprimirErro("Pagamento inválido.");
            return;
        }

        imprimirPagamento(pagamento);
    }

    public static boolean pagamentoValido(PagamentoEntrada pagamento) {
        return pagamento != null
                && textoInformado(pagamento.codigo())
                && valorPositivo(pagamento.valor())
                && pagamento.forma() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static void imprimirPagamento(PagamentoEntrada pagamento) {
        imprimirCabecalho("PAGAMENTO");
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor: " + pagamento.valor());
        System.out.println("Forma: " + pagamento.forma());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record PagamentoEntrada(String codigo, BigDecimal valor, FormaPagamento forma) {
}
```

Pratique no IntelliJ:

```text
1. Comece com tudo dentro do main.
2. Extraia pagamentoValido.
3. Extraia textoInformado.
4. Extraia valorPositivo.
5. Extraia imprimirPagamento.
6. Extraia imprimirCabecalho.
7. Extraia imprimirSeparador.
8. Compile e execute após cada extração.
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OsExtractMethod.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OsExtractMethod {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico("OS-001", LocalDate.now().minusDays(5), StatusOs.AGENDADA);

        if (!osValida(os)) {
            imprimirErro("OS inválida.");
            return;
        }

        long diasEmAberto = calcularDiasEmAberto(os.dataAbertura(), LocalDate.now());

        imprimirOs(os, diasEmAberto);
    }

    public static boolean osValida(OrdemServico os) {
        return os != null
                && textoInformado(os.certificado())
                && os.dataAbertura() != null
                && os.status() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static long calcularDiasEmAberto(LocalDate dataAbertura, LocalDate dataReferencia) {
        return ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
    }

    public static void imprimirOs(OrdemServico os, long diasEmAberto) {
        imprimirCabecalho("ORDEM DE SERVIÇO");
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Status: " + os.status());
        System.out.println("Data abertura: " + os.dataAbertura());
        System.out.println("Dias em aberto: " + diasEmAberto);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

record OrdemServico(String certificado, LocalDate dataAbertura, StatusOs status) {
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaExtractMethod.java
```

Código:

```java
public class MensageriaExtractMethod {
    public static void main(String[] args) {
        DadosMensagem dados = new DadosMensagem("Ana", "11999999999", TipoMensagem.ENTREGA, true);

        if (!podeEnviarMensagem(dados)) {
            imprimirErro("Mensagem não pode ser enviada.");
            return;
        }

        String mensagem = montarMensagem(dados);

        imprimirMensagem(mensagem);
    }

    public static boolean podeEnviarMensagem(DadosMensagem dados) {
        return dados != null
                && textoInformado(dados.cliente())
                && textoInformado(dados.telefone())
                && dados.tipo() != null
                && dados.optIn();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static String montarMensagem(DadosMensagem dados) {
        return "Olá, %s. Acompanhamento da mensagem %s."
                .formatted(dados.cliente(), dados.tipo());
    }

    public static void imprimirMensagem(String mensagem) {
        imprimirCabecalho("MENSAGEM");
        System.out.println(mensagem);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}

record DadosMensagem(String cliente, String telefone, TipoMensagem tipo, boolean optIn) {
}
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaExtractMethod.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaExtractMethod {
    public static void main(String[] args) {
        RegistroAuditoria auditoria = new RegistroAuditoria(
                "aline",
                OperacaoAuditoria.CRIACAO,
                "Produto",
                10L,
                Instant.now()
        );

        if (!auditoriaValida(auditoria)) {
            imprimirErro("Auditoria inválida.");
            return;
        }

        imprimirAuditoria(auditoria);
    }

    public static boolean auditoriaValida(RegistroAuditoria auditoria) {
        return auditoria != null
                && textoInformado(auditoria.usuario())
                && auditoria.operacao() != null
                && textoInformado(auditoria.entidade())
                && idPositivo(auditoria.entidadeId())
                && auditoria.criadoEm() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean idPositivo(Long id) {
        return id != null && id > 0;
    }

    public static void imprimirAuditoria(RegistroAuditoria auditoria) {
        imprimirCabecalho("AUDITORIA");
        System.out.println("Usuário: " + auditoria.usuario());
        System.out.println("Operação: " + auditoria.operacao());
        System.out.println("Entidade: " + auditoria.entidade());
        System.out.println("Entidade ID: " + auditoria.entidadeId());
        System.out.println("Criado em: " + auditoria.criadoEm());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum OperacaoAuditoria {
    CRIACAO,
    EDICAO,
    EXCLUSAO
}

record RegistroAuditoria(
        String usuario,
        OperacaoAuditoria operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
}
```

---

## Erros comuns no Extract Method

### Erro 1 — Selecionar trecho incompleto

A seleção precisa formar expressão ou bloco válido.

### Erro 2 — Aceitar nome ruim

Não deixe:

```text
method;
extracted;
newMethod;
metodo1.
```

### Erro 3 — Não revisar parâmetros

A IDE pode gerar muitos parâmetros.

### Erro 4 — Criar método com parâmetros demais

Extração pode revelar necessidade de record.

### Erro 5 — Extrair código com responsabilidade misturada

Se o trecho valida, calcula e imprime, talvez precise de mais de uma extração.

### Erro 6 — Mudar comportamento sem perceber

Refatoração deve preservar comportamento.

### Erro 7 — Não executar depois

Sempre compile e execute.

### Erro 8 — Fazer extrações grandes demais

Prefira extrações pequenas e seguras.

### Erro 9 — Extrair sem intenção

Método precisa ter nome de regra real.

### Erro 10 — Esconder código ruim em método

Extrair não resolve tudo.

Às vezes só esconde o problema.

---

## Diagnóstico após extrair método

Depois de usar Extract Method, pergunte:

```text
1. O nome ficou claro?
2. O método tem uma responsabilidade?
3. A assinatura ficou boa?
4. Há parâmetros demais?
5. O retorno faz sentido?
6. O método está no lugar certo?
7. A chamada ficou mais legível?
8. O comportamento foi preservado?
9. Compilei?
10. Executei?
11. Verifiquei o diff?
12. O próximo passo seria record, outra extração ou parar?
```

Nem toda extração precisa de nova refatoração.

Mas toda extração precisa de revisão.

---

## Debug recomendado

Use debug em:

```text
PedidoExtractDepois.java
PedidoExtractComRecord.java
PagamentoExtractMethod.java
OsExtractMethod.java
MensageriaExtractMethod.java
AuditoriaExtractMethod.java
```

Para cada um:

```text
1. Coloque breakpoint no main.
2. Use Step Into no primeiro método extraído.
3. Observe parâmetros.
4. Use Step Out.
5. Entre no próximo método.
6. Confira retorno.
7. Observe call stack.
```

No `PedidoExtractComRecord`, observe:

```text
PedidoEntrada;
ResumoPedido;
gerarResumoPedido;
calcularTotalBruto;
calcularDesconto;
imprimirResumoPedido.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — nome ruim

Extraia um método chamado:

```text
metodo1
```

Explique por que ficou ruim.

### Teste 2 — seleção grande demais

Selecione leitura, cálculo e impressão juntos.

Veja o método gerado.

Explique por que a responsabilidade ficou misturada.

### Teste 3 — parâmetros demais

Extraia `imprimirResumoPedido` com muitos parâmetros.

Depois refatore para `ResumoPedido`.

### Teste 4 — retorno errado

Extraia cálculo de desconto, mas faça o método retornar total final.

Explique a confusão.

### Teste 5 — não rodar depois da extração

Faça uma extração e não compile.

Depois veja como um erro simples poderia passar despercebido.

### Teste 6 — diff gigante

Faça várias extrações sem commit intermediário.

Observe como o diff fica mais difícil de revisar.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-100-refatoracao-extract-method-no-intellij
cd labs\m3\aula-100-refatoracao-extract-method-no-intellij
```

Crie arquivos:

```text
ExtractMethodBasicoAntes.java
ExtractMethodBasicoDepois.java
ExtractCondicaoPedido.java
ExtractCalculoPedido.java
ExtractExibicao.java
ExtractLeitura.java
ExtractAuditoria.java
PedidoExtractAntes.java
PedidoExtractDepois.java
PedidoExtractComRecord.java
PagamentoExtractMethod.java
OsExtractMethod.java
MensageriaExtractMethod.java
AuditoriaExtractMethod.java
ErroSelecaoIncompleta.java
ErroNomeRuim.java
ErroParametrosDemais.java
ErroResponsabilidadeMisturada.java
ErroSemExecutarDepois.java
README.md
```

Compile exemplos principais:

```powershell
javac ExtractMethodBasicoAntes.java
javac ExtractMethodBasicoDepois.java
javac ExtractCondicaoPedido.java
javac ExtractCalculoPedido.java
javac ExtractExibicao.java
javac ExtractLeitura.java
javac ExtractAuditoria.java
```

Compile exemplos aplicados:

```powershell
javac PedidoExtractAntes.java
javac PedidoExtractDepois.java
javac PedidoExtractComRecord.java
javac PagamentoExtractMethod.java
javac OsExtractMethod.java
javac MensageriaExtractMethod.java
javac AuditoriaExtractMethod.java
```

Execute:

```powershell
java ExtractMethodBasicoDepois
java ExtractCondicaoPedido
java ExtractCalculoPedido
java ExtractExibicao
java ExtractAuditoria
java PedidoExtractDepois
java PedidoExtractComRecord
java PagamentoExtractMethod
java OsExtractMethod
java MensageriaExtractMethod
java AuditoriaExtractMethod
```

Os exemplos com leitura exigem interação:

```powershell
java ExtractLeitura
java PedidoExtractAntes
java PedidoExtractDepois
java PedidoExtractComRecord
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 100 — Refatoração Extract Method no IntelliJ

## Objetivo

Aprender a usar Extract Method no IntelliJ com critério: selecionar o trecho correto, nomear bem, revisar parâmetros, revisar retorno e validar comportamento antes e depois.

## Conceitos

- Refatoração muda estrutura sem mudar comportamento.
- Extract Method transforma trecho em método.
- A seleção precisa representar uma intenção.
- Nome do método é decisão técnica.
- A IDE gera parâmetros, mas o dev revisa.
- A IDE gera retorno, mas o dev valida.
- Método extraído precisa ser coeso.
- Extração pode revelar parâmetros demais.
- Depois de extrair, compile, execute, debugue e revise o diff.
- Extraia intenção, não apenas linhas.

## Comandos

```powershell
javac PedidoExtractDepois.java
java PedidoExtractDepois
javac PedidoExtractComRecord.java
java PedidoExtractComRecord
```

## Fluxo seguro

1. Rodar antes.
2. Selecionar trecho pequeno.
3. Extract Method.
4. Nomear bem.
5. Revisar assinatura.
6. Compilar.
7. Executar.
8. Debugar se necessário.
9. Revisar git diff.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Extract Method | `Ctrl + Alt + M` em muitos keymaps | Extrair método |
| Rename | `Shift + F6` | Melhorar nome |
| Reformat Code | `Ctrl + Alt + L` | Organizar |
| Find Usages | ação da IDE | Ver usos |
| Change Signature | ação da IDE | Ajustar parâmetros |
| Inline Method | ação da IDE | Desfazer extração ruim |
| Debug | `Shift + F9` em muitos keymaps | Validar fluxo |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Avançar |
| Step Out | `Shift + F8` em muitos keymaps | Sair do método |
| Git Diff | janela Commit/Diff | Revisar alteração |
| Terminal | `Alt + F12` | Compilar e executar |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 100 — Refatoração Extract Method no IntelliJ

### O que aprendi

Aprendi que Extract Method é uma ferramenta de refatoração para dar nome a uma intenção do código, mas que a IDE não substitui a decisão técnica sobre seleção, nome, parâmetros e retorno.

### O que pratiquei

Usei Extract Method em validações, cálculos, exibição, leitura, pedido, pagamento, OS, mensageria e auditoria. Revisei nomes, parâmetros, retornos e comportamento antes e depois.

### Conceitos principais

- refatoração
- Extract Method
- seleção correta
- nome do método
- parâmetros gerados
- retorno gerado
- assinatura
- coesão
- responsabilidade
- comportamento preservado
- debug pós-refatoração
- Git Diff
- Extract Method no IntelliJ
- Rename
- Change Signature
- Inline Method

### Arquivos criados

- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractMethodBasicoAntes.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractMethodBasicoDepois.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractCondicaoPedido.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractCalculoPedido.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractExibicao.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractLeitura.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/ExtractAuditoria.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/PedidoExtractAntes.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/PedidoExtractDepois.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/PedidoExtractComRecord.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/PagamentoExtractMethod.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/OsExtractMethod.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/MensageriaExtractMethod.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/AuditoriaExtractMethod.java`
- `labs/m3/aula-100-refatoracao-extract-method-no-intellij/README.md`

### Comandos usados

```powershell
javac PedidoExtractDepois.java
java PedidoExtractDepois
javac PedidoExtractComRecord.java
java PedidoExtractComRecord
javac PagamentoExtractMethod.java
java PagamentoExtractMethod
```

### Erros que quero evitar

- selecionar trecho incompleto;
- aceitar nome ruim;
- não revisar parâmetros;
- criar método com parâmetros demais sem perceber;
- extrair responsabilidade misturada;
- mudar comportamento sem querer;
- não compilar depois;
- não executar depois;
- refatorar grande demais de uma vez;
- esconder código ruim dentro de método.
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
git add labs/m3/aula-100-refatoracao-extract-method-no-intellij docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 100: pratica extract method no intellij"
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
1. O que é refatoração?
2. O que é Extract Method?
3. Refatoração deve mudar comportamento?
4. Quando usar Extract Method?
5. Quando não usar Extract Method?
6. O que significa extrair intenção?
7. Por que a seleção correta importa?
8. Por que nome do método é decisão técnica?
9. Por que revisar parâmetros gerados?
10. Por que revisar retorno gerado?
11. O que fazer se o método extraído tem parâmetros demais?
12. O que fazer se a extração criou método com responsabilidade misturada?
13. Por que compilar depois da extração?
14. Por que executar depois da extração?
15. Por que revisar Git Diff?
16. Como debug ajuda após Extract Method?
17. Como aplicar em cálculo?
18. Como aplicar em leitura?
19. Como aplicar em exibição?
20. Qual extração você fez nesta aula e por que ela melhorou o código?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar refatoração;
explicar Extract Method;
usar Extract Method no IntelliJ;
selecionar trecho coerente;
nomear método com intenção;
revisar parâmetros gerados;
revisar retorno gerado;
identificar método extraído ruim;
usar Rename após extração;
usar Reformat Code;
usar Debug após extração;
usar Git Diff para revisar;
extrair validação;
extrair cálculo;
extrair exibição;
extrair leitura;
extrair auditoria simulada;
identificar parâmetros demais;
corrigir extração ruim;
compilar depois;
executar depois;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar todas as refatorações da IDE.

Não precisa ainda usar arquitetura em camadas.

Não precisa ainda usar testes automatizados.

Não precisa ainda criar serviços Spring.

Não precisa ainda aplicar design patterns.

Esses assuntos virão depois.

O objetivo é:

```text
usar a IDE como ferramenta profissional de refatoração, sem abrir mão do julgamento técnico.
```

---

## Fechamento

Hoje estudamos Refatoração Extract Method no IntelliJ.

A ideia central foi:

```text
Extract Method serve para dar nome a uma intenção do código, não apenas para esconder linhas.
```

Vimos que:

```text
refatoração preserva comportamento;
seleção correta é essencial;
nome ruim destrói a extração;
parâmetros gerados precisam ser revisados;
retorno gerado precisa ser validado;
método extraído precisa ser coeso;
extração pode revelar parâmetros demais;
debug e git diff ajudam a validar;
compile e execute depois de cada refatoração relevante.
```

O ponto mais importante é:

```text
a IDE executa a refatoração, mas o engenheiro decide se a refatoração ficou boa.
```

Na próxima aula, vamos estudar:

```text
Mini arquitetura procedural.
```

A próxima aula vai organizar `main` chamando funções por responsabilidade antes de entrarmos mais fundo em orientação a objetos.
