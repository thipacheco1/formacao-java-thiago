# 079 — M2.18 — Varargs

## A pergunta central da aula

Compare estes métodos:

```java
public static int somarDois(int a, int b) {
    return a + b;
}

public static int somarTres(int a, int b, int c) {
    return a + b + c;
}
```

Se precisar somar quatro, cinco ou dez números, você criaria vários métodos?

Não.

Com varargs:

```java
public static int somar(int... numeros) {
    int total = 0;

    for (int numero : numeros) {
        total += numero;
    }

    return total;
}
```

Uso:

```java
somar(1, 2);
somar(1, 2, 3);
somar(1, 2, 3, 4);
```

Por dentro, o Java trata `numeros` como um array.

Esse é o ponto mais importante:

```text
varargs é açúcar sintático para array.
```

---

## O que é varargs

Varargs significa:

```text
variable arguments;
argumentos variáveis;
quantidade variável de parâmetros.
```

Em Java, usamos reticências:

```java
int... numeros
String... nomes
BigDecimal... valores
StatusPedido... status
```

Exemplo:

```java
public static void imprimir(String... textos) {
}
```

Esse método pode ser chamado assim:

```java
imprimir();
imprimir("Ana");
imprimir("Ana", "Bruno");
imprimir("Ana", "Bruno", "Carla");
```

Dentro do método, `textos` é tratado como:

```java
String[]
```

---

## Varargs por dentro é array

Este método:

```java
public static void imprimir(String... textos) {
    System.out.println(textos.length);
}
```

é muito parecido com:

```java
public static void imprimir(String[] textos) {
    System.out.println(textos.length);
}
```

A diferença principal é na chamada.

Com varargs:

```java
imprimir("A", "B", "C");
```

Com array:

```java
imprimir(new String[]{"A", "B", "C"});
```

Mas dentro do método, a lógica é a mesma:

```text
percorrer array;
validar tamanho;
acessar índice;
verificar null.
```

---

## Vocabulário essencial

Termos desta aula:

```text
varargs;
argumentos variáveis;
reticências;
array;
parâmetro variável;
método utilitário;
sobrecarga;
ambiguidade;
assinatura;
último parâmetro;
chamada;
zero argumentos;
null;
validação;
for-each;
conveniência;
legibilidade;
API;
método de fábrica;
String.format;
List.of;
Arrays.asList.
```

Termos mais importantes:

```text
varargs -> recurso para receber quantidade variável de argumentos;
reticências -> sintaxe `...`;
array interno -> varargs é tratado como array dentro do método;
último parâmetro -> varargs deve ser o último parâmetro da lista;
zero argumentos -> chamada sem argumentos é permitida;
sobrecarga -> vários métodos com mesmo nome e parâmetros diferentes;
ambiguidade -> situação em que o compilador não sabe qual método chamar;
conveniência -> varargs é útil para facilitar chamadas simples.
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
        imprimir("Ana");
        imprimir("Ana", "Bruno");
        imprimir("Ana", "Bruno", "Carla");
    }

    public static void imprimir(String... nomes) {
        for (String nome : nomes) {
            System.out.println(nome);
        }

        System.out.println("---");
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
Ana
---
Ana
Bruno
---
Ana
Bruno
Carla
---
```

O método recebeu quantidades diferentes de argumentos.

---

## Varargs com zero argumentos

Arquivo:

```text
VarargsZeroArgumentos.java
```

Código:

```java
public class VarargsZeroArgumentos {
    public static void main(String[] args) {
        imprimir();
        imprimir("Ana");
    }

    public static void imprimir(String... nomes) {
        System.out.println("Quantidade: " + nomes.length);

        for (String nome : nomes) {
            System.out.println(nome);
        }

        System.out.println("---");
    }
}
```

Saída:

```text
Quantidade: 0
---
Quantidade: 1
Ana
---
```

Quando você chama sem argumentos:

```java
imprimir();
```

o array existe, mas tem tamanho zero.

Isso é diferente de `null`.

---

## Varargs e array explícito

Arquivo:

```text
VarargsArrayExplicito.java
```

Código:

```java
public class VarargsArrayExplicito {
    public static void main(String[] args) {
        String[] nomes = {"Ana", "Bruno", "Carla"};

        imprimir(nomes);
    }

    public static void imprimir(String... nomes) {
        for (String nome : nomes) {
            System.out.println(nome);
        }
    }
}
```

O método com varargs aceita também um array.

Isso reforça:

```text
varargs por dentro é array.
```

---

## Somando números com varargs

Arquivo:

```text
SomarVarargs.java
```

Código:

```java
public class SomarVarargs {
    public static void main(String[] args) {
        System.out.println(somar(1, 2));
        System.out.println(somar(1, 2, 3));
        System.out.println(somar(1, 2, 3, 4));
    }

    public static int somar(int... numeros) {
        int total = 0;

        for (int numero : numeros) {
            total += numero;
        }

        return total;
    }
}
```

Saída:

```text
3
6
10
```

Esse é o exemplo clássico.

---

## Média com varargs

Arquivo:

```text
MediaVarargs.java
```

Código:

```java
public class MediaVarargs {
    public static void main(String[] args) {
        System.out.println(media(10, 8, 9));
    }

    public static double media(int... numeros) {
        if (numeros.length == 0) {
            throw new IllegalArgumentException("Informe pelo menos um número.");
        }

        int total = 0;

        for (int numero : numeros) {
            total += numero;
        }

        return (double) total / numeros.length;
    }
}
```

Ponto importante:

```text
métodos com varargs podem ser chamados com zero argumentos.
```

Se zero não faz sentido, valide.

---

## Varargs deve ser o último parâmetro

Isto é válido:

```java
public static void registrar(String titulo, String... detalhes) {
}
```

Isto não é válido:

```java
public static void registrar(String... detalhes, String titulo) {
}
```

O varargs precisa ser o último parâmetro.

Por quê?

Porque o compilador precisa saber onde termina a lista variável.

Exemplo válido:

Arquivo:

```text
VarargsUltimoParametro.java
```

Código:

```java
public class VarargsUltimoParametro {
    public static void main(String[] args) {
        registrar("Pedido criado", "cliente=Ana", "valor=100.00");
    }

    public static void registrar(String titulo, String... detalhes) {
        System.out.println("Título: " + titulo);

        for (String detalhe : detalhes) {
            System.out.println("Detalhe: " + detalhe);
        }
    }
}
```

---

## Erro: varargs fora do final

Arquivo de erro proposital:

```text
ErroVarargsNaoUltimo.java
```

Código:

```java
public class ErroVarargsNaoUltimo {
    public static void main(String[] args) {
        registrar("a", "b", "c");
    }

    public static void registrar(String... detalhes, String titulo) {
        System.out.println(titulo);
    }
}
```

Esse código não compila.

Motivo:

```text
varargs deve ser o último parâmetro.
```

---

## Apenas um varargs por método

Isto não é válido:

```java
public static void metodo(String... nomes, int... numeros) {
}
```

Um método só pode ter um parâmetro varargs.

Motivo:

```text
o compilador não saberia separar corretamente os argumentos.
```

Se precisar de dois conjuntos variáveis, use objetos, arrays explícitos ou uma estrutura melhor.

---

## Varargs com String

Arquivo:

```text
ConcatenarTextos.java
```

Código:

```java
public class ConcatenarTextos {
    public static void main(String[] args) {
        String resultado = juntarComEspaco("Java", "Backend", "Profissional");

        System.out.println(resultado);
    }

    public static String juntarComEspaco(String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(" ");
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }
}
```

Saída:

```text
Java Backend Profissional
```

Aqui varargs é útil para utilitário simples.

---

## Varargs com separador

Arquivo:

```text
JuntarComSeparador.java
```

Código:

```java
public class JuntarComSeparador {
    public static void main(String[] args) {
        String texto = juntar(", ", "Ana", "Bruno", "Carla");

        System.out.println(texto);
    }

    public static String juntar(String separador, String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(separador);
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }
}
```

Saída:

```text
Ana, Bruno, Carla
```

O parâmetro fixo vem antes.

O varargs fica no final.

---

## Varargs com BigDecimal

Arquivo:

```text
SomarBigDecimalVarargs.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class SomarBigDecimalVarargs {
    public static void main(String[] args) {
        BigDecimal total = somar(
                new BigDecimal("10.00"),
                new BigDecimal("5.50"),
                new BigDecimal("2.25")
        );

        System.out.println(total);
    }

    public static BigDecimal somar(BigDecimal... valores) {
        BigDecimal total = BigDecimal.ZERO;

        for (BigDecimal valor : valores) {
            if (valor == null) {
                throw new IllegalArgumentException("Valor não pode ser null.");
            }

            total = total.add(valor);
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }
}
```

Varargs com objetos exige cuidado com `null`.

---

## Null em varargs

Há duas situações diferentes:

### Situação 1 — chamada sem argumentos

```java
somar();
```

Dentro do método:

```text
valores não é null;
valores.length é 0.
```

### Situação 2 — argumento null

```java
somar(new BigDecimal("10.00"), null);
```

Dentro do método:

```text
valores tem tamanho 2;
um elemento é null.
```

### Situação 3 — array null explícito

```java
BigDecimal[] valores = null;
somar(valores);
```

Dentro do método:

```text
valores é null.
```

Por isso, em métodos robustos, valide:

```java
if (valores == null) {
}
```

e também cada elemento.

---

## Exemplo de null explícito

Arquivo:

```text
VarargsNullExplicito.java
```

Código:

```java
public class VarargsNullExplicito {
    public static void main(String[] args) {
        String[] nomes = null;

        imprimir(nomes);
    }

    public static void imprimir(String... nomes) {
        if (nomes == null) {
            System.out.println("Array de nomes veio null.");
            return;
        }

        System.out.println("Quantidade: " + nomes.length);
    }
}
```

Saída:

```text
Array de nomes veio null.
```

Isso mostra que varargs pode receber array null se você passar explicitamente.

---

## Varargs e sobrecarga

Sobrecarga é ter métodos com o mesmo nome e parâmetros diferentes.

Exemplo:

```java
imprimir(String texto)
imprimir(String... textos)
```

Pode funcionar, mas exige cuidado.

Arquivo:

```text
SobrecargaVarargs.java
```

Código:

```java
public class SobrecargaVarargs {
    public static void main(String[] args) {
        imprimir("Ana");
        imprimir("Ana", "Bruno");
    }

    public static void imprimir(String texto) {
        System.out.println("Um texto: " + texto);
    }

    public static void imprimir(String... textos) {
        System.out.println("Vários textos: " + textos.length);
    }
}
```

Saída:

```text
Um texto: Ana
Vários textos: 2
```

O Java escolhe o método mais específico.

Mas sobrecargas com varargs podem ficar confusas.

---

## Ambiguidade com varargs

Cuidado com métodos parecidos.

Exemplo problemático:

```java
public static void processar(String... valores) {
}

public static void processar(String primeiro, String... valores) {
}
```

Algumas chamadas podem confundir leitura humana, mesmo quando o compilador decide.

Regra profissional:

```text
evite sobrecargas complexas com varargs.
```

Prefira nomes diferentes ou parâmetros mais explícitos.

---

## Varargs com tipos diferentes

Evite:

```java
public static void registrar(Object... valores) {
}
```

Embora funcione, pode virar bagunça.

Exemplo:

```java
registrar("Ana", 10, true, new BigDecimal("10.00"));
```

Isso perde segurança e clareza.

Use `Object...` somente quando há motivo real, como APIs de formatação/log.

Em código de negócio, prefira tipos claros.

---

## Exemplo ruim com Object varargs

Arquivo:

```text
ErroObjectVarargs.java
```

Código:

```java
public class ErroObjectVarargs {
    public static void main(String[] args) {
        registrar("Ana", 10, true);
    }

    public static void registrar(Object... valores) {
        for (Object valor : valores) {
            System.out.println(valor);
        }
    }
}
```

Compila e executa.

Mas pode esconder erros de modelagem.

Pergunta crítica:

```text
esses valores têm realmente natureza genérica ou faltou criar um tipo adequado?
```

---

## Varargs e performance

Varargs cria um array para receber os argumentos.

Na maioria dos usos comuns, isso não é problema.

Mas em código muito chamado, loops intensivos ou caminhos críticos, pode importar.

Regra:

```text
não otimize antes da hora;
mas saiba que varargs cria array.
```

Se performance for crítica, avalie alternativas.

---

## APIs conhecidas que usam varargs

Alguns exemplos do Java:

```java
String.format("Nome: %s, idade: %d", "Ana", 30)
```

O método recebe argumentos variáveis.

Também há APIs como:

```java
List.of("A", "B", "C")
```

e:

```java
Arrays.asList("A", "B", "C")
```

Esses métodos são convenientes justamente por causa do varargs.

---

## Aplicação em cliente

Arquivo:

```text
ClienteVarargs.java
```

Código:

```java
public class ClienteVarargs {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", "VIP", "ATIVO", "NEWSLETTER");

        System.out.println(cliente.nome);
        System.out.println("Tags: " + juntar(", ", cliente.tags));
    }

    public static Cliente criarCliente(String nome, String... tags) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        Cliente cliente = new Cliente();

        cliente.nome = nome.trim();
        cliente.tags = tags == null ? new String[0] : tags;

        return cliente;
    }

    public static String juntar(String separador, String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(separador);
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }

    static class Cliente {
        String nome;
        String[] tags;
    }
}
```

Uso:

```text
tags opcionais do cliente.
```

Cuidado:

```text
se tags forem parte importante do domínio, uma coleção será melhor no futuro.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoVarargs.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoVarargs {
    public static void main(String[] args) {
        BigDecimal total = somarPrecos(
                new BigDecimal("10.00"),
                new BigDecimal("20.50"),
                new BigDecimal("5.25")
        );

        System.out.println("Total: " + total);
    }

    public static BigDecimal somarPrecos(BigDecimal... precos) {
        if (precos == null) {
            throw new IllegalArgumentException("Preços são obrigatórios.");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (BigDecimal preco : precos) {
            if (preco == null) {
                throw new IllegalArgumentException("Preço não pode ser null.");
            }

            if (preco.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Preço não pode ser negativo.");
            }

            total = total.add(preco);
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }
}
```

Aqui varargs é útil para utilitário de soma.

---

## Aplicação em pedido

Arquivo:

```text
PedidoVarargs.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoVarargs {
    public static void main(String[] args) {
        ItemPedido item1 = new ItemPedido("Cadeira", new BigDecimal("100.00"));
        ItemPedido item2 = new ItemPedido("Mesa", new BigDecimal("250.00"));

        BigDecimal total = calcularTotal(item1, item2);

        System.out.println("Total: " + total);
    }

    public static BigDecimal calcularTotal(ItemPedido... itens) {
        if (itens == null || itens.length == 0) {
            throw new IllegalArgumentException("Informe pelo menos um item.");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedido item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item não pode ser null.");
            }

            total = total.add(item.valor());
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }
}

record ItemPedido(String nome, BigDecimal valor) {
}
```

Varargs deixa a chamada simples:

```java
calcularTotal(item1, item2)
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoVarargs.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PagamentoVarargs {
    public static void main(String[] args) {
        BigDecimal totalPago = somarPagamentos(
                new Pagamento("PIX", new BigDecimal("50.00")),
                new Pagamento("CARTAO", new BigDecimal("100.00"))
        );

        System.out.println("Total pago: " + totalPago);
    }

    public static BigDecimal somarPagamentos(Pagamento... pagamentos) {
        if (pagamentos == null || pagamentos.length == 0) {
            throw new IllegalArgumentException("Informe pelo menos um pagamento.");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (Pagamento pagamento : pagamentos) {
            if (pagamento == null) {
                throw new IllegalArgumentException("Pagamento não pode ser null.");
            }

            total = total.add(pagamento.valor());
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }
}

record Pagamento(String forma, BigDecimal valor) {
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoVarargs.java
```

Código:

```java
public class OrdemServicoVarargs {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "AGENDADA", "CONFIRMADA", "EM_ROTA");

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Ocorrências: " + juntar(" -> ", os.ocorrencias));
    }

    public static OrdemServico criarOs(String certificado, String... ocorrencias) {
        if (certificado == null || certificado.isBlank()) {
            throw new IllegalArgumentException("Certificado é obrigatório.");
        }

        OrdemServico os = new OrdemServico();

        os.certificado = certificado.trim().toUpperCase();
        os.ocorrencias = ocorrencias == null ? new String[0] : ocorrencias;

        return os;
    }

    public static String juntar(String separador, String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(separador);
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }

    static class OrdemServico {
        String certificado;
        String[] ocorrencias;
    }
}
```

Cenário didático:

```text
criar OS com ocorrências iniciais variáveis.
```

Em sistema real, ocorrências provavelmente seriam objetos e coleções.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaVarargs.java
```

Código:

```java
public class MensageriaVarargs {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem(
                "Ana",
                "Olá, Ana!",
                "OS-001",
                "ENTREGA",
                "WHATSAPP"
        );

        System.out.println(mensagem.cliente);
        System.out.println(mensagem.texto);
        System.out.println("Metadados: " + juntar(", ", mensagem.metadados));
    }

    public static Mensagem criarMensagem(String cliente, String texto, String... metadados) {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto é obrigatório.");
        }

        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente.trim();
        mensagem.texto = texto.trim();
        mensagem.metadados = metadados == null ? new String[0] : metadados;

        return mensagem;
    }

    public static String juntar(String separador, String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(separador);
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }

    static class Mensagem {
        String cliente;
        String texto;
        String[] metadados;
    }
}
```

Varargs é útil aqui porque metadados podem ser opcionais.

Mas se metadados tiverem chave e valor, uma estrutura mais rica será melhor no futuro.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaVarargs.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaVarargs {
    public static void main(String[] args) {
        RegistroAuditoria registro = registrar(
                "aline",
                "CRIACAO",
                "entidade=Produto",
                "id=10",
                "origem=API"
        );

        System.out.println(registro.usuario);
        System.out.println(registro.operacao);
        System.out.println(registro.criadoEm);
        System.out.println(juntar(" | ", registro.detalhes));
    }

    public static RegistroAuditoria registrar(String usuario, String operacao, String... detalhes) {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (operacao == null || operacao.isBlank()) {
            throw new IllegalArgumentException("Operação é obrigatória.");
        }

        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario.trim().toLowerCase();
        registro.operacao = operacao.trim().toUpperCase();
        registro.criadoEm = Instant.now();
        registro.detalhes = detalhes == null ? new String[0] : detalhes;

        return registro;
    }

    public static String juntar(String separador, String... textos) {
        StringBuilder builder = new StringBuilder();

        for (int indice = 0; indice < textos.length; indice++) {
            if (indice > 0) {
                builder.append(separador);
            }

            builder.append(textos[indice]);
        }

        return builder.toString();
    }

    static class RegistroAuditoria {
        String usuario;
        String operacao;
        Instant criadoEm;
        String[] detalhes;
    }
}
```

Cenário didático:

```text
registro de auditoria com detalhes variáveis.
```

---

## Refatoração: vários métodos para um varargs

Antes:

```java
public static int somarDois(int a, int b) {
    return a + b;
}

public static int somarTres(int a, int b, int c) {
    return a + b + c;
}
```

Depois:

```java
public static int somar(int... numeros) {
    int total = 0;

    for (int numero : numeros) {
        total += numero;
    }

    return total;
}
```

Ganho:

```text
menos duplicação;
mais flexível;
API mais simples.
```

Mas valide se zero argumentos faz sentido.

---

## Refatoração: Object varargs para tipo forte

Antes:

```java
registrar(Object... valores)
```

Depois:

```java
registrar(String usuario, OperacaoAuditoria operacao, String... detalhes)
```

Melhorias:

```text
parâmetros principais explícitos;
tipo forte;
menos bagunça;
menos risco de passar coisa errada.
```

Varargs deve complementar a assinatura, não substituir modelagem.

---

## Refatoração: varargs para objeto

Às vezes, varargs não é a melhor solução.

Antes:

```java
criarMensagem("Ana", "Olá", "OS-001", "ENTREGA", "WHATSAPP")
```

O que cada string significa?

Fica confuso.

Melhor pode ser:

```java
new MensagemRequest(cliente, texto, certificado, tipo, canal)
```

ou, no futuro:

```java
record MensagemRequest(...)
```

Regra:

```text
se os argumentos têm significados diferentes, varargs pode piorar a leitura.
```

Varargs é melhor quando os argumentos são do mesmo tipo e mesma natureza.

---

## Quando usar varargs

Use varargs quando:

```text
os argumentos têm mesma natureza;
a quantidade realmente pode variar;
a chamada fica mais simples;
o método é utilitário;
zero ou vários argumentos fazem sentido;
você quer conveniência;
a alternativa seria criar várias sobrecargas repetitivas;
o método valida bem os dados recebidos.
```

Exemplos bons:

```java
somar(1, 2, 3)
juntar(", ", "A", "B", "C")
calcularTotal(item1, item2, item3)
registrarDetalhes("a", "b", "c")
```

---

## Quando evitar varargs

Evite varargs quando:

```text
os argumentos têm significados diferentes;
a ordem dos argumentos fica confusa;
o método exige exatamente um conjunto fixo de campos;
há muitos tipos misturados;
Object... está escondendo modelagem ruim;
sobrecargas ficam ambíguas;
performance em caminho crítico importa;
o método fica difícil de validar;
a API fica menos clara que um objeto de request.
```

Exemplo ruim:

```java
criarCliente("Ana", "ana@email.com", "11999999999", "VIP", "ATIVO")
```

Melhor:

```java
new CriarClienteRequest(...)
```

---

## Erros comuns

### Erro 1 — Achar que varargs não é array

Dentro do método, é array.

---

### Erro 2 — Esquecer que zero argumentos é permitido

Valide se precisa de pelo menos um.

---

### Erro 3 — Não validar null

Pode vir array null ou elemento null.

---

### Erro 4 — Colocar varargs antes de outro parâmetro

Não compila.

---

### Erro 5 — Tentar ter dois varargs no mesmo método

Não compila.

---

### Erro 6 — Usar Object... sem necessidade

Perde clareza e segurança.

---

### Erro 7 — Criar sobrecargas ambíguas

Pode confundir compilador ou leitor.

---

### Erro 8 — Usar varargs para argumentos de naturezas diferentes

Piora a legibilidade.

---

### Erro 9 — Ignorar custo de array em caminho crítico

Normalmente não é problema, mas existe.

---

### Erro 10 — Usar varargs onde um record/request seria melhor

Se os campos têm significado próprio, use objeto.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugVarargs {
    public static void main(String[] args) {
        imprimir("Ana", "Bruno", "Carla");
    }

    public static void imprimir(String... nomes) {
        System.out.println("Quantidade: " + nomes.length);

        for (String nome : nomes) {
            System.out.println(nome);
        }
    }
}
```

Coloque breakpoint em:

```java
System.out.println("Quantidade: " + nomes.length);
```

Observe:

```text
nomes é String[];
length = 3;
índice 0 = Ana;
índice 1 = Bruno;
índice 2 = Carla.
```

Depois teste:

```java
imprimir();
```

Observe:

```text
nomes é String[];
length = 0.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-079-varargs
cd labs\m2\aula-079-varargs
```

Crie arquivos:

```text
Main.java
VarargsZeroArgumentos.java
VarargsArrayExplicito.java
SomarVarargs.java
MediaVarargs.java
VarargsUltimoParametro.java
ErroVarargsNaoUltimo.java
ErroDoisVarargs.java
ConcatenarTextos.java
JuntarComSeparador.java
SomarBigDecimalVarargs.java
VarargsNullExplicito.java
SobrecargaVarargs.java
ErroObjectVarargs.java
ClienteVarargs.java
ProdutoVarargs.java
PedidoVarargs.java
PagamentoVarargs.java
OrdemServicoVarargs.java
MensageriaVarargs.java
AuditoriaVarargs.java
DebugVarargs.java
ErroMediaSemArgumentos.java
ErroElementoNull.java
ErroVarargsNaturezasDiferentes.java
README.md
```

Compile:

```powershell
javac Main.java
javac VarargsZeroArgumentos.java
javac VarargsArrayExplicito.java
javac SomarVarargs.java
javac MediaVarargs.java
javac VarargsUltimoParametro.java
javac ErroVarargsNaoUltimo.java
javac ErroDoisVarargs.java
javac ConcatenarTextos.java
javac JuntarComSeparador.java
javac SomarBigDecimalVarargs.java
javac VarargsNullExplicito.java
javac SobrecargaVarargs.java
javac ErroObjectVarargs.java
javac ClienteVarargs.java
javac ProdutoVarargs.java
javac PedidoVarargs.java
javac PagamentoVarargs.java
javac OrdemServicoVarargs.java
javac MensageriaVarargs.java
javac AuditoriaVarargs.java
javac DebugVarargs.java
javac ErroMediaSemArgumentos.java
javac ErroElementoNull.java
javac ErroVarargsNaturezasDiferentes.java
```

Execute os exemplos válidos:

```powershell
java Main
java VarargsZeroArgumentos
java VarargsArrayExplicito
java SomarVarargs
java MediaVarargs
java VarargsUltimoParametro
java ConcatenarTextos
java JuntarComSeparador
java SomarBigDecimalVarargs
java VarargsNullExplicito
java SobrecargaVarargs
java ErroObjectVarargs
java ClienteVarargs
java ProdutoVarargs
java PedidoVarargs
java PagamentoVarargs
java OrdemServicoVarargs
java MensageriaVarargs
java AuditoriaVarargs
java DebugVarargs
```

Os arquivos abaixo devem falhar na compilação:

```text
ErroVarargsNaoUltimo.java
ErroDoisVarargs.java
```

Os arquivos abaixo devem demonstrar erro ou comportamento perigoso:

```text
ErroMediaSemArgumentos.java
ErroElementoNull.java
ErroVarargsNaturezasDiferentes.java
```

Use os resultados para registrar os erros comuns no diário.

---

## Observações

- Não usar varargs para esconder modelagem.
- Não esquecer que zero argumentos é permitido.
- Não usar dois varargs no mesmo método.
- Não colocar varargs antes de outro parâmetro.
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
git add labs/m2/aula-079-varargs docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 079: pratica varargs em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar varargs;
criar método com String...;
criar método com int...;
explicar que varargs é array;
chamar método com zero argumentos;
chamar método com um argumento;
chamar método com vários argumentos;
passar array explícito;
validar zero argumentos;
validar null;
validar elementos null;
explicar que varargs deve ser último parâmetro;
provocar erro de varargs fora do final;
provocar erro de dois varargs;
usar varargs com StringBuilder;
usar varargs com BigDecimal;
explicar sobrecarga com varargs;
explicar ambiguidade;
explicar risco de Object...;
decidir quando usar varargs;
decidir quando evitar varargs;
refatorar métodos repetidos para varargs;
refatorar varargs ruim para record/request;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar array interno;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar generics com varargs profundamente.

Não precisa ainda dominar `@SafeVarargs`.

Não precisa ainda dominar heap pollution.

Não precisa ainda dominar APIs avançadas de collections.

Não precisa ainda dominar overload resolution em profundidade.

Esses assuntos virão depois.

O objetivo é dominar varargs básico e profissional: sintaxe, array interno, validação, ambiguidade e uso com critério.

---

## Fechamento da aula

Hoje estudamos varargs.

A ideia central foi:

```text
varargs permite métodos com quantidade variável de argumentos, mas dentro do método isso é tratado como array.
```

Vimos que:

```text
a sintaxe usa reticências;
varargs deve ser o último parâmetro;
só pode haver um varargs por método;
zero argumentos é permitido;
array explícito também pode ser passado;
null precisa de cuidado;
sobrecarga com varargs pode confundir;
Object... deve ser usado com critério;
varargs é ótimo para utilitários;
varargs é ruim para argumentos de naturezas diferentes.
```

O ponto mais importante é:

```text
varargs melhora APIs quando os argumentos são da mesma natureza; quando cada argumento tem significado diferente, um objeto de request costuma ser melhor.
```

Na próxima aula, vamos estudar:

```text
Annotations básicas.
```

A próxima aula vai explicar `@Override`, `@Deprecated`, `@SuppressWarnings`, leitura de metadados e por que annotations são tão importantes em frameworks Java.
