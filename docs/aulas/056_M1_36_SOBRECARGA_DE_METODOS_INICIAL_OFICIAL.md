# 056 — M1.36 — Sobrecarga de Métodos Inicial

## Hoje a aula é sobre mesmo nome com parâmetros diferentes

Sobrecarga de métodos é quando criamos métodos com o mesmo nome, mas com listas de parâmetros diferentes.

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}

public static int somar(int a, int b, int c) {
    return a + b + c;
}
```

Ambos se chamam:

```text
somar.
```

Mas um recebe:

```text
dois int.
```

O outro recebe:

```text
três int.
```

Na chamada, o Java decide qual método usar olhando os argumentos enviados.

Exemplo:

```java
somar(10, 20);
```

usa o método com dois parâmetros.

Exemplo:

```java
somar(10, 20, 30);
```

usa o método com três parâmetros.

Essa decisão acontece em tempo de compilação.

---

## O que é sobrecarga

Sobrecarga de métodos é a possibilidade de declarar vários métodos com o mesmo nome, desde que a lista de parâmetros seja diferente.

Lista de parâmetros pode ser diferente por:

```text
quantidade;
tipo;
ordem dos tipos.
```

Exemplo por quantidade:

```java
exibir("Ana");
exibir("Ana", "APROVADO");
```

Exemplo por tipo:

```java
exibir(10);
exibir("Ana");
```

Exemplo por ordem:

```java
exibir("Ana", 1000L);
exibir(1000L, "Ana");
```

Atenção:

```text
sobrecarga não é feita apenas mudando o tipo de retorno.
```

Esse é um erro muito comum.

---

## Por que sobrecarga existe

Sobrecarga existe para representar variações naturais de uma mesma ação.

Exemplo:

```java
exibirMensagem("Pedido criado");
exibirMensagem("Pedido criado", "INFO");
exibirMensagem("Pedido criado", "INFO", 1001);
```

Todos fazem algo parecido:

```text
exibir mensagem.
```

Mas cada versão recebe dados diferentes.

Outro exemplo:

```java
calcularTotal(int[] valores)
calcularTotal(long[] valores)
```

Os dois calculam total.

Mas um trabalha com `int[]`.

Outro trabalha com `long[]`.

Sobrecarga pode deixar o código mais expressivo quando as variações realmente pertencem à mesma ideia.

---

## Vocabulário essencial

Termos desta aula:

```text
sobrecarga;
overload;
método sobrecarregado;
mesmo nome;
parâmetros diferentes;
assinatura;
lista de parâmetros;
quantidade de parâmetros;
tipo de parâmetros;
ordem de parâmetros;
resolução de chamada;
ambiguidade;
tipo de retorno;
compilação;
legibilidade;
intenção;
variação;
confusão;
duplicidade;
responsabilidade.
```

Termos mais importantes:

```text
sobrecarga -> vários métodos com mesmo nome e parâmetros diferentes;
assinatura -> identificação do método pelo nome e lista de parâmetros;
lista de parâmetros -> tipos e ordem dos parâmetros;
resolução de chamada -> escolha de qual versão será executada;
ambiguidade -> quando uma chamada pode confundir ou não ficar clara;
legibilidade -> facilidade de entender qual versão está sendo usada.
```

---

## Assinatura e sobrecarga

Para entender sobrecarga, precisamos entender assinatura.

Nesta fase, pense na assinatura como:

```text
nome do método + tipos dos parâmetros.
```

Exemplo:

```java
public static void exibirValor(int valor)
```

Assinatura conceitual:

```text
exibirValor(int)
```

Outro método:

```java
public static void exibirValor(String valor)
```

Assinatura conceitual:

```text
exibirValor(String)
```

Como as assinaturas são diferentes, Java permite.

---

## O retorno não diferencia sobrecarga

Isto não é permitido:

```java
public static int obterValor() {
    return 10;
}

public static String obterValor() {
    return "10";
}
```

Por quê?

Os dois têm a mesma lista de parâmetros:

```text
obterValor()
```

Mesmo que o retorno seja diferente, a chamada seria ambígua:

```java
obterValor();
```

Como o Java decidiria qual usar?

Por isso, o retorno sozinho não cria sobrecarga.

A diferença precisa estar nos parâmetros.

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
        exibirValor(10);
        exibirValor("Ana");
    }

    public static void exibirValor(int valor) {
        System.out.println("Valor inteiro: " + valor);
    }

    public static void exibirValor(String valor) {
        System.out.println("Valor textual: " + valor);
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

Saída:

```text
Valor inteiro: 10
Valor textual: Ana
```

O Java escolheu a versão correta com base no tipo do argumento:

```java
10
```

é `int`.

```java
"Ana"
```

é `String`.

---

## Sobrecarga por quantidade de parâmetros

Arquivo:

```text
SobrecargaPorQuantidade.java
```

Código:

```java
public class SobrecargaPorQuantidade {
    public static void main(String[] args) {
        exibirMensagem("Pedido criado");
        exibirMensagem("Pedido aprovado", "INFO");
    }

    public static void exibirMensagem(String mensagem) {
        System.out.println("[PADRÃO] " + mensagem);
    }

    public static void exibirMensagem(String mensagem, String nivel) {
        System.out.println("[" + nivel + "] " + mensagem);
    }
}
```

Saída:

```text
[PADRÃO] Pedido criado
[INFO] Pedido aprovado
```

Aqui a diferença é a quantidade:

```text
exibirMensagem(String)
exibirMensagem(String, String)
```

---

## Sobrecarga por tipo de parâmetro

Arquivo:

```text
SobrecargaPorTipo.java
```

Código:

```java
public class SobrecargaPorTipo {
    public static void main(String[] args) {
        exibirDado(10);
        exibirDado(1000L);
        exibirDado("APROVADO");
    }

    public static void exibirDado(int valor) {
        System.out.println("int: " + valor);
    }

    public static void exibirDado(long valor) {
        System.out.println("long: " + valor);
    }

    public static void exibirDado(String valor) {
        System.out.println("String: " + valor);
    }
}
```

Saída:

```text
int: 10
long: 1000
String: APROVADO
```

Aqui a diferença é o tipo:

```text
int;
long;
String.
```

---

## Sobrecarga por ordem de parâmetros

Arquivo:

```text
SobrecargaPorOrdem.java
```

Código:

```java
public class SobrecargaPorOrdem {
    public static void main(String[] args) {
        exibirResumo("Ana", 1000L);
        exibirResumo(2500L, "Bruno");
    }

    public static void exibirResumo(String cliente, long valorCentavos) {
        System.out.println("Cliente primeiro: " + cliente + " - " + valorCentavos);
    }

    public static void exibirResumo(long valorCentavos, String cliente) {
        System.out.println("Valor primeiro: " + valorCentavos + " - " + cliente);
    }
}
```

Saída:

```text
Cliente primeiro: Ana - 1000
Valor primeiro: 2500 - Bruno
```

Isso é tecnicamente permitido.

Mas cuidado.

Sobrecarga por ordem pode confundir, principalmente quando a intenção não é clara.

Use com moderação.

---

## Quando a sobrecarga ajuda

Sobrecarga ajuda quando os métodos representam a mesma operação com variações naturais.

Exemplos bons:

```java
exibirMensagem(String mensagem)
exibirMensagem(String mensagem, String nivel)
```

```java
somar(int a, int b)
somar(int a, int b, int c)
```

```java
calcularTotal(int[] valores)
calcularTotal(long[] valores)
```

```java
formatarValor(long valorCentavos)
formatarValor(long valorCentavos, String moeda)
```

A ideia central precisa ser a mesma.

Se a ideia muda, talvez o método precise de outro nome.

---

## Quando evitar sobrecarga

Evite sobrecarga quando ela gera dúvida.

Exemplo ruim:

```java
processar(String cliente)
processar(String status)
```

Isso nem compila se ambos têm apenas uma `String`, porque a assinatura seria igual.

Mas mesmo se fosse possível com outra ordem, seria confuso.

Outro exemplo ruim:

```java
exibir(String a, String b)
exibir(String b, String a)
```

Isso não é sobrecarga válida porque a lista de tipos é igual:

```text
String, String.
```

Nomes diferentes seriam melhores:

```java
exibirClienteDocumento(String nome, String documento)
exibirStatusMensagem(String status, String mensagem)
```

Sobrecarga não deve ser usada para esconder intenção.

---

## Sobrecarga não é duplicação sem propósito

Se dois métodos têm o mesmo nome, mas fazem coisas completamente diferentes, isso é ruim.

Exemplo ruim:

```java
calcular(int valor)
```

calcula desconto.

```java
calcular(String texto)
```

envia mensagem.

Mesmo que compile, a intenção fica confusa.

Melhor:

```java
calcularDesconto(int valor)
enviarMensagem(String texto)
```

Regra:

```text
mesmo nome deve indicar mesma ideia geral.
```

---

## Sobrecarga com retorno

Métodos sobrecarregados podem ter retorno.

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}

public static long somar(long a, long b) {
    return a + b;
}
```

Arquivo:

```text
SobrecargaComRetorno.java
```

Código:

```java
public class SobrecargaComRetorno {
    public static void main(String[] args) {
        int somaInt = somar(10, 20);
        long somaLong = somar(1000L, 2500L);

        System.out.println("Soma int: " + somaInt);
        System.out.println("Soma long: " + somaLong);
    }

    public static int somar(int a, int b) {
        return a + b;
    }

    public static long somar(long a, long b) {
        return a + b;
    }
}
```

Saída:

```text
Soma int: 30
Soma long: 3500
```

A escolha acontece pelos tipos dos argumentos.

---

## Sobrecarga e método void

Também pode haver sobrecarga com `void`.

Exemplo:

```java
public static void exibirPedido(String cliente) {
    System.out.println("Cliente: " + cliente);
}

public static void exibirPedido(String cliente, long valorCentavos) {
    System.out.println("Cliente: " + cliente);
    System.out.println("Valor: " + valorCentavos);
}
```

Arquivo:

```text
SobrecargaVoid.java
```

Código:

```java
public class SobrecargaVoid {
    public static void main(String[] args) {
        exibirPedido("Ana");
        exibirPedido("Bruno", 2500L);
    }

    public static void exibirPedido(String cliente) {
        System.out.println("Cliente: " + cliente);
        System.out.println("--------------------");
    }

    public static void exibirPedido(String cliente, long valorCentavos) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra variação de exibição.

---

## Exemplo aplicado: mensagens

Arquivo:

```text
MensagensSobrecarregadas.java
```

Código:

```java
public class MensagensSobrecarregadas {
    public static void main(String[] args) {
        registrarMensagem("Pedido criado");
        registrarMensagem("Pedido aprovado", "INFO");
        registrarMensagem("Erro ao processar pedido", "ERRO", 500);
    }

    public static void registrarMensagem(String mensagem) {
        System.out.println("[INFO] " + mensagem);
    }

    public static void registrarMensagem(String mensagem, String nivel) {
        System.out.println("[" + nivel + "] " + mensagem);
    }

    public static void registrarMensagem(String mensagem, String nivel, int codigo) {
        System.out.println("[" + nivel + "] " + codigo + " - " + mensagem);
    }
}
```

Esse é um uso bom de sobrecarga.

Todos os métodos registram mensagem.

A diferença é a quantidade de detalhes.

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoSobrecarga.java
```

Código:

```java
public class PedidoSobrecarga {
    public static void main(String[] args) {
        exibirPedido("Ana");
        exibirPedido("Bruno", 2500L);
        exibirPedido("Carla", 5000L, "APROVADO");
    }

    public static void exibirPedido(String cliente) {
        System.out.println("Cliente: " + cliente);
        System.out.println("--------------------");
    }

    public static void exibirPedido(String cliente, long valorCentavos) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("--------------------");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Esse exemplo representa exibição com níveis diferentes de detalhe.

É uma boa situação para entender sobrecarga.

---

## Evitando duplicação chamando a versão mais completa

No exemplo anterior, repetimos código.

Podemos melhorar fazendo uma versão chamar outra.

Arquivo:

```text
PedidoSobrecargaMelhorada.java
```

Código:

```java
public class PedidoSobrecargaMelhorada {
    public static void main(String[] args) {
        exibirPedido("Ana");
        exibirPedido("Bruno", 2500L);
        exibirPedido("Carla", 5000L, "APROVADO");
    }

    public static void exibirPedido(String cliente) {
        exibirPedido(cliente, 0L, "SEM_STATUS");
    }

    public static void exibirPedido(String cliente, long valorCentavos) {
        exibirPedido(cliente, valorCentavos, "SEM_STATUS");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Agora as versões menores reaproveitam a versão completa.

Isso reduz repetição.

Mas atenção:

```text
valor 0 e SEM_STATUS precisam fazer sentido no contexto.
```

Nunca use valor padrão que gere interpretação errada.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoSobrecarga.java
```

Código:

```java
public class PagamentoSobrecarga {
    public static void main(String[] args) {
        calcularValorParcela(10000L);
        calcularValorParcela(10000L, 4);
    }

    public static long calcularValorParcela(long valorCentavos) {
        return valorCentavos;
    }

    public static long calcularValorParcela(long valorCentavos, int parcelas) {
        if (parcelas <= 0) {
            return 0L;
        }

        return valorCentavos / parcelas;
    }
}
```

Interpretação:

```text
se informar apenas valor, considera uma parcela;
se informar valor e quantidade de parcelas, divide.
```

Esse uso pode ser bom se a regra estiver clara.

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoSobrecarga.java
```

Código:

```java
public class ProdutoSobrecarga {
    public static void main(String[] args) {
        exibirProduto("Mesa");
        exibirProduto("Cadeira", 10);
        exibirProduto("Sofá", 0, "ATIVO");
    }

    public static void exibirProduto(String nome) {
        exibirProduto(nome, 0, "SEM_STATUS");
    }

    public static void exibirProduto(String nome, int estoque) {
        exibirProduto(nome, estoque, "SEM_STATUS");
    }

    public static void exibirProduto(String nome, int estoque, String status) {
        System.out.println("Produto: " + nome);
        System.out.println("Estoque: " + estoque);
        System.out.println("Status: " + status);

        if (estoque == 0 && "ATIVO".equals(status)) {
            System.out.println("Atenção: produto ativo sem estoque.");
        }

        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra sobrecarga com dados opcionais didáticos.

No futuro, objetos e construtores deixarão isso mais natural.

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoSobrecarga.java
```

Código:

```java
public class OrdemServicoSobrecarga {
    public static void main(String[] args) {
        exibirOs("OS-001");
        exibirOs("OS-002", "ABERTA");
        exibirOs("OS-003", "CONCLUIDA", 4);
    }

    public static void exibirOs(String certificado) {
        exibirOs(certificado, "SEM_STATUS", 0);
    }

    public static void exibirOs(String certificado, String status) {
        exibirOs(certificado, status, 0);
    }

    public static void exibirOs(String certificado, String status, int quantidadeAtividades) {
        System.out.println("OS: " + certificado);
        System.out.println("Status: " + status);
        System.out.println("Atividades: " + quantidadeAtividades);
        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra o mesmo nome para diferentes níveis de informação da OS.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaSobrecarga.java
```

Código:

```java
public class AuditoriaSobrecarga {
    public static void main(String[] args) {
        registrarAuditoria("CRIACAO");
        registrarAuditoria("EDICAO", "aline");
        registrarAuditoria("EXCLUSAO", "jackson", "RECUSADO");
    }

    public static void registrarAuditoria(String operacao) {
        registrarAuditoria(operacao, "USUARIO_NAO_INFORMADO", "SEM_STATUS");
    }

    public static void registrarAuditoria(String operacao, String usuario) {
        registrarAuditoria(operacao, usuario, "SEM_STATUS");
    }

    public static void registrarAuditoria(String operacao, String usuario, String status) {
        System.out.println("AUDITORIA");
        System.out.println("Operação: " + operacao);
        System.out.println("Usuário: " + usuario);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Esse uso é bom para entender variações de detalhe em logs e auditoria.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaSobrecarga.java
```

Código:

```java
public class MensageriaSobrecarga {
    public static void main(String[] args) {
        exibirEnvio("Ana");
        exibirEnvio("Bruno", "ENTREGA");
        exibirEnvio("Carla", "NPS", 3);
    }

    public static void exibirEnvio(String cliente) {
        exibirEnvio(cliente, "SEM_TIPO", 0);
    }

    public static void exibirEnvio(String cliente, String tipoMensagem) {
        exibirEnvio(cliente, tipoMensagem, 0);
    }

    public static void exibirEnvio(String cliente, String tipoMensagem, int tentativas) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Tipo: " + tipoMensagem);
        System.out.println("Tentativas: " + tentativas);

        if (tentativas > 2) {
            System.out.println("Atenção: muitas tentativas.");
        }

        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra sobrecarga em um cenário de mensagens.

---

## Sobrecarga com arrays

Também podemos sobrecarregar métodos por tipo de array.

Arquivo:

```text
SobrecargaArrays.java
```

Código:

```java
public class SobrecargaArrays {
    public static void main(String[] args) {
        int[] quantidades = {10, 20, 30};
        long[] valoresCentavos = {1000L, 2500L, 5000L};

        System.out.println("Total quantidades: " + calcularTotal(quantidades));
        System.out.println("Total valores: " + calcularTotal(valoresCentavos));
    }

    public static int calcularTotal(int[] valores) {
        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        return total;
    }

    public static long calcularTotal(long[] valores) {
        long total = 0L;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        return total;
    }
}
```

Os dois métodos se chamam:

```text
calcularTotal.
```

Mas um recebe:

```text
int[].
```

Outro recebe:

```text
long[].
```

---

## Sobrecarga com String e normalização

Arquivo:

```text
StatusSobrecarga.java
```

Código:

```java
public class StatusSobrecarga {
    public static void main(String[] args) {
        System.out.println(statusValido("APROVADO"));
        System.out.println(statusValido(" aprovado ", true));
    }

    public static boolean statusValido(String status) {
        return statusValido(status, false);
    }

    public static boolean statusValido(String status, boolean normalizar) {
        if (status == null || status.isBlank()) {
            return false;
        }

        String statusComparacao = status;

        if (normalizar) {
            statusComparacao = status.trim().toUpperCase();
        }

        return "PENDENTE".equals(statusComparacao)
                || "APROVADO".equals(statusComparacao)
                || "RECUSADO".equals(statusComparacao)
                || "CANCELADO".equals(statusComparacao);
    }
}
```

Aqui a segunda versão recebe uma opção adicional:

```text
normalizar ou não.
```

Cuidado: parâmetros booleanos podem reduzir legibilidade se usados em excesso.

A chamada:

```java
statusValido(" aprovado ", true)
```

pode não deixar claro o que `true` significa.

Mais tarde, estudaremos alternativas melhores.

---

## Cuidado com boolean em sobrecarga

Exemplo:

```java
processarPedido("Ana", true);
```

Pergunta:

```text
true significa aprovado?
true significa urgente?
true significa validar?
true significa enviar mensagem?
```

Fica pouco claro.

Melhor nome ou método mais específico pode ajudar:

```java
processarPedidoComValidacao("Ana");
```

ou, no futuro, objeto de configuração.

Por enquanto, aprenda o alerta:

```text
sobrecarga com boolean pode ficar confusa se o significado não for óbvio.
```

---

## Sobrecarga e null

`null` pode gerar dúvidas em sobrecarga.

Exemplo:

```java
public static void exibir(String texto) {
    System.out.println("String");
}

public static void exibir(Integer numero) {
    System.out.println("Integer");
}
```

Chamada:

```java
exibir(null);
```

Pode ficar ambígua em alguns cenários, dependendo dos tipos disponíveis.

Nesta fase, evite chamadas com `null` quando há sobrecargas com tipos de referência diferentes.

Prefira ser explícito.

Exemplo:

```java
exibir((String) null);
```

Mas isso é assunto mais avançado.

O alerta inicial é suficiente:

```text
sobrecarga com null pode confundir.
```

---

## Sobrecarga e conversão de tipos

Java pode escolher uma versão considerando conversões possíveis.

Exemplo:

```java
public static void exibir(long valor) {
    System.out.println("long");
}
```

Chamada:

```java
exibir(10);
```

Mesmo `10` sendo `int`, ele pode ser convertido para `long`.

Se existir também:

```java
public static void exibir(int valor)
```

Java escolherá a versão mais específica para `int`.

Nesta aula inicial, use tipos claros nos argumentos.

Exemplo:

```java
1000L
```

para `long`.

Isso evita dúvida.

---

## Sobrecarga não substitui bom nome

Às vezes, nomes diferentes são melhores.

Compare:

```java
exibir(String valor)
exibir(int valor)
exibir(long valor)
```

Pode ser bom para exemplo didático.

Mas em código de negócio, talvez seja melhor:

```java
exibirCliente(String cliente)
exibirQuantidade(int quantidade)
exibirValorCentavos(long valorCentavos)
```

Sobrecarga é uma ferramenta.

Não é obrigação.

Use quando melhora o código.

Evite quando esconde significado.

---

## Erros comuns

### Erro 1 — Achar que mudar só o retorno é sobrecarga

Errado:

```java
public static int obterValor() {
    return 10;
}

public static String obterValor() {
    return "10";
}
```

Não compila.

A lista de parâmetros é igual.

---

### Erro 2 — Criar métodos com mesmo nome e mesmos parâmetros

Errado:

```java
public static void exibir(String texto) {
}

public static void exibir(String mensagem) {
}
```

Mesmo que o nome do parâmetro mude, a assinatura é a mesma:

```text
exibir(String).
```

Não compila.

---

### Erro 3 — Sobrecarga confusa com muitos String

Exemplo ruim:

```java
processar(String cliente, String status)
processar(String status, String cliente)
```

Isso nem é válido porque os tipos são iguais na mesma ordem conceitual.

Mesmo quando há variações válidas, muitos `String` podem confundir.

---

### Erro 4 — Usar sobrecarga para métodos com responsabilidades diferentes

Se a ação é diferente, use nome diferente.

---

### Erro 5 — Valores padrão sem sentido

Exemplo:

```java
exibirPedido(cliente) {
    exibirPedido(cliente, 0L, "SEM_STATUS");
}
```

Se valor 0 puder ser interpretado como valor real, cuidado.

---

### Erro 6 — Não saber qual versão está sendo chamada

Use o IntelliJ para navegar até a declaração.

Use debug.

Confira tipos dos argumentos.

---

### Erro 7 — Usar null de forma ambígua

Evite:

```java
exibir(null);
```

quando existem várias sobrecargas com tipos de referência.

---

### Erro 8 — Criar sobrecarga só para evitar pensar em nome

Sobrecarga deve deixar o código melhor, não mais preguiçoso.

---

### Erro 9 — Misturar sobrecarga com método gigante

Várias versões sobrecarregadas podem chamar uma versão completa.

Mas se a versão completa vira gigante, divida responsabilidades.

---

### Erro 10 — Não testar cada versão

Cada assinatura precisa ser chamada e validada.

Não teste só uma versão.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-056-sobrecarga-metodos-inicial
cd labs\m1\aula-056-sobrecarga-metodos-inicial
```

Crie arquivos:

```text
Main.java
SobrecargaPorQuantidade.java
SobrecargaPorTipo.java
SobrecargaPorOrdem.java
SobrecargaComRetorno.java
SobrecargaVoid.java
MensagensSobrecarregadas.java
PedidoSobrecarga.java
PedidoSobrecargaMelhorada.java
PagamentoSobrecarga.java
ProdutoSobrecarga.java
OrdemServicoSobrecarga.java
AuditoriaSobrecarga.java
MensageriaSobrecarga.java
SobrecargaArrays.java
StatusSobrecarga.java
ErroRetornoNaoDiferencia.java
ErroMesmoParametroNomeDiferente.java
ErroChamadaTiposInesperados.java
ErroSobrecargaConfusa.java
ErroNullAmbiguo.java
```

Compile:

```powershell
javac Main.java
javac SobrecargaPorQuantidade.java
javac SobrecargaPorTipo.java
javac SobrecargaPorOrdem.java
javac SobrecargaComRetorno.java
javac SobrecargaVoid.java
javac MensagensSobrecarregadas.java
javac PedidoSobrecarga.java
javac PedidoSobrecargaMelhorada.java
javac PagamentoSobrecarga.java
javac ProdutoSobrecarga.java
javac OrdemServicoSobrecarga.java
javac AuditoriaSobrecarga.java
javac MensageriaSobrecarga.java
javac SobrecargaArrays.java
javac StatusSobrecarga.java
javac ErroRetornoNaoDiferencia.java
javac ErroMesmoParametroNomeDiferente.java
javac ErroChamadaTiposInesperados.java
javac ErroSobrecargaConfusa.java
javac ErroNullAmbiguo.java
```

Execute:

```powershell
java Main
java SobrecargaPorQuantidade
java SobrecargaPorTipo
java SobrecargaPorOrdem
java SobrecargaComRetorno
java SobrecargaVoid
java MensagensSobrecarregadas
java PedidoSobrecarga
java PedidoSobrecargaMelhorada
java PagamentoSobrecarga
java ProdutoSobrecarga
java OrdemServicoSobrecarga
java AuditoriaSobrecarga
java MensageriaSobrecarga
java SobrecargaArrays
java StatusSobrecarga
java ErroRetornoNaoDiferencia
java ErroMesmoParametroNomeDiferente
java ErroChamadaTiposInesperados
java ErroSobrecargaConfusa
java ErroNullAmbiguo
```

Alguns arquivos de erro proposital não devem compilar.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroRetornoNaoDiferencia.java`

```java
public class ErroRetornoNaoDiferencia {
    public static void main(String[] args) {
    }

    public static int obterValor() {
        return 10;
    }

    public static String obterValor() {
        return "10";
    }
}
```

Objetivo:

```text
entender que tipo de retorno sozinho não cria sobrecarga.
```

---

## Arquivo sugerido: `ErroMesmoParametroNomeDiferente.java`

```java
public class ErroMesmoParametroNomeDiferente {
    public static void main(String[] args) {
    }

    public static void exibir(String texto) {
        System.out.println(texto);
    }

    public static void exibir(String mensagem) {
        System.out.println(mensagem);
    }
}
```

Objetivo:

```text
entender que mudar o nome do parâmetro não muda a assinatura.
```

---

## Arquivo sugerido: `ErroNullAmbiguo.java`

```java
public class ErroNullAmbiguo {
    public static void main(String[] args) {
        exibir(null);
    }

    public static void exibir(String texto) {
        System.out.println("String");
    }

    public static void exibir(Integer numero) {
        System.out.println("Integer");
    }
}
```

Objetivo:

```text
entender que null pode tornar uma chamada ambígua em sobrecargas.
```

---

## Debug recomendado

Use debug neste exemplo:

```java
public class Main {
    public static void main(String[] args) {
        exibirValor(10);
        exibirValor("Ana");
    }

    public static void exibirValor(int valor) {
        System.out.println("Valor inteiro: " + valor);
    }

    public static void exibirValor(String valor) {
        System.out.println("Valor textual: " + valor);
    }
}
```

Coloque breakpoint nas chamadas:

```java
exibirValor(10);
exibirValor("Ana");
```

Use Step Into.

Observe:

```text
com 10, entra em exibirValor(int);
com "Ana", entra em exibirValor(String).
```

Esse debug fixa a resolução de chamada.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-056-sobrecarga-metodos-inicial docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 056: pratica sobrecarga de metodos em Java"
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
explicar sobrecarga de métodos;
criar métodos com mesmo nome e quantidade diferente de parâmetros;
criar métodos com mesmo nome e tipos diferentes;
criar métodos com mesmo nome e ordem de tipos diferente;
explicar assinatura;
explicar lista de parâmetros;
explicar resolução de chamada;
explicar que retorno sozinho não diferencia sobrecarga;
explicar que nome do parâmetro não diferencia assinatura;
usar sobrecarga com void;
usar sobrecarga com retorno;
usar sobrecarga com int;
usar sobrecarga com long;
usar sobrecarga com String;
usar sobrecarga com arrays;
aplicar em mensagens;
aplicar em pedido;
aplicar em pagamento;
aplicar em produto;
aplicar em OS;
aplicar em auditoria;
aplicar em mensageria;
evitar sobrecarga confusa;
identificar responsabilidades diferentes;
explicar risco de null ambíguo;
testar cada versão sobrecarregada;
diagnosticar erros comuns;
debugar versão chamada;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar conversões avançadas.

Não precisa ainda dominar boxing e unboxing profundamente.

Não precisa ainda dominar generics.

Não precisa ainda dominar varargs.

Não precisa ainda dominar construtores sobrecarregados.

Esses assuntos virão depois.

O objetivo é dominar a ideia inicial de métodos com mesmo nome e parâmetros diferentes, sabendo quando usar e quando evitar.

---

## Fechamento da aula

Hoje aprendemos sobrecarga de métodos.

A ideia central foi:

```text
Java permite métodos com o mesmo nome quando os parâmetros são diferentes.
```

Exemplo:

```java
public static void exibirValor(int valor) {
    System.out.println(valor);
}

public static void exibirValor(String valor) {
    System.out.println(valor);
}
```

Vimos que a diferença pode estar em:

```text
quantidade de parâmetros;
tipo dos parâmetros;
ordem dos tipos.
```

Também vimos dois limites essenciais:

```text
tipo de retorno sozinho não diferencia sobrecarga;
nome do parâmetro não diferencia assinatura.
```

O ponto mais importante é:

```text
sobrecarga deve melhorar a legibilidade, não criar confusão.
```

Na próxima aula, vamos estudar escopo de variáveis.

Esse assunto vai explicar onde uma variável existe, onde ela pode ser usada, quanto tempo ela vive e por que algumas variáveis “somem” fora de certos blocos.
