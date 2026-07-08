# 109 — M4.05 — Métodos de comportamento

## Objetivo da aula

Nesta aula você vai aprender a criar métodos que representam comportamento real do objeto.

Nas últimas aulas, vimos:

```text
classe;
objeto;
atributos;
estado;
construtor;
this;
atributos com significado.
```

Agora vamos dar o próximo passo: objetos não devem ser apenas pacotes de dados.

Um objeto bem modelado também deve responder perguntas e executar ações que fazem sentido para o domínio dele.

Ao final da aula, você deve conseguir:

```text
diferenciar método de acesso de método de comportamento;
identificar objeto anêmico;
colocar regras simples dentro do objeto certo;
criar métodos que usam o estado do objeto;
nomear comportamentos com clareza;
evitar classe que só carrega dados;
evitar classe que faz coisa demais;
explicar por que uma regra pertence ou não pertence a um objeto.
```

Essa aula é essencial para você começar a escrever código orientado a objetos de verdade, e não apenas código procedural com classes.

---

## A ideia central

Um objeto não deve apenas “ter dados”.

Ele também deve conseguir responder perguntas sobre esses dados.

Exemplo fraco:

```java
cliente.nome()
cliente.email()
cliente.telefone()
cliente.ativo()
```

Isso apenas expõe informações.

Exemplo melhor:

```java
cliente.contatoCompleto()
cliente.podeReceberMensagem()
```

Agora o objeto tem comportamento.

Ele usa seu próprio estado para responder perguntas importantes do domínio.

Essa é a diferença principal:

```text
atributo representa estado;
método de comportamento representa regra, ação ou pergunta do domínio.
```

---

## Método de acesso versus método de comportamento

Um método de acesso apenas devolve um atributo:

```java
String nome() {
    return nome;
}
```

Ele é útil, mas não expressa muita regra.

Um método de comportamento usa o estado do objeto para responder algo com significado:

```java
boolean podeReceberMensagem() {
    return ativo && textoInformado(telefone);
}
```

Esse método comunica uma regra:

```text
cliente ativo com telefone informado pode receber mensagem.
```

Esse tipo de método é o que começa a dar vida ao objeto.

---

## O que é objeto anêmico

Objeto anêmico é uma classe que só carrega dados e quase não possui comportamento.

Exemplo:

```java
class Pedido {
    private final String cliente;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() {
        return cliente;
    }

    BigDecimal precoUnitario() {
        return precoUnitario;
    }

    int quantidade() {
        return quantidade;
    }
}
```

A classe representa pedido, mas não sabe fazer nada relacionado a pedido.

Aí as regras acabam ficando fora:

```java
BigDecimal total = pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
```

Isso não é necessariamente proibido em todos os contextos, mas se o objeto tem dados e a regra depende desses dados, geralmente faz sentido aproximar a regra do objeto.

---

## Exemplo melhor: objeto com comportamento

```java
class Pedido {
    private final String cliente;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    BigDecimal totalBruto() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
```

Agora o pedido sabe calcular seu total bruto.

O código de fora fica mais expressivo:

```java
BigDecimal total = pedido.totalBruto();
```

Esse método pertence naturalmente ao pedido, porque o total bruto é calculado usando dados do próprio pedido.

---

## Como decidir se o comportamento pertence ao objeto

Pergunte:

```text
esse método usa principalmente dados desse objeto?
essa pergunta faz sentido ser feita para esse objeto?
essa regra descreve o próprio objeto?
colocar essa regra aqui deixa o código mais claro?
o método continua com responsabilidade pequena?
```

Exemplo:

```text
Pedido calcula total bruto?
```

Sim. O total depende de preço e quantidade do pedido.

```text
Pedido imprime relatório no console?
```

Não. Isso é exibição, não comportamento central do pedido.

```text
Cliente sabe se pode receber mensagem?
```

Sim. Isso depende de ativo e telefone.

```text
Cliente envia a mensagem pelo WhatsApp?
```

Não nesta fase. Enviar mensagem envolve infraestrutura externa.

```text
OrdemServico sabe se está atrasada?
```

Sim. Depende da data de abertura da OS.

```text
OrdemServico salva a si mesma no banco?
```

Não. Persistência será responsabilidade de outra camada no futuro.

---

## Projeto 1 — Pedido com comportamento

Crie a pasta:

```powershell
mkdir labs\m4\aula-109-metodos-de-comportamento
cd labs\m4\aula-109-metodos-de-comportamento
```

Crie o arquivo:

```text
PedidoComComportamento.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoComComportamento {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
        System.out.println("Pedido com desconto: " + pedido.temDesconto());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() {
        return cliente;
    }

    String produto() {
        return produto;
    }

    boolean valido() {
        return textoInformado(cliente)
                && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }

    BigDecimal totalBruto() {
        if (!valido()) {
            return BigDecimal.ZERO;
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    boolean temDesconto() {
        return totalBruto().compareTo(new BigDecimal("300.00")) >= 0;
    }

    BigDecimal desconto() {
        if (temDesconto()) {
            return totalBruto().multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac PedidoComComportamento.java
java PedidoComComportamento
```

---

## O que observar nesse exemplo

A classe `Pedido` possui estado:

```text
cliente;
produto;
precoUnitario;
quantidade.
```

E possui comportamento:

```text
valido;
totalBruto;
temDesconto;
desconto;
totalFinal.
```

Esses métodos não são apenas getters.

Eles representam perguntas e cálculos do domínio do pedido.

O código externo não precisa saber como o desconto é calculado:

```java
pedido.desconto()
pedido.totalFinal()
```

Isso deixa a chamada mais expressiva.

---

## Cuidado com comportamento que esconde erro

No exemplo, usamos:

```java
if (!valido()) {
    return BigDecimal.ZERO;
}
```

Isso é aceitável para a fase didática, mas em sistemas reais pode ser perigoso.

Por quê?

Porque um pedido inválido pode passar despercebido e gerar total zero.

Mais adiante, vamos aprender formas melhores de proteger o objeto, como:

```text
validar no construtor;
lançar exceção;
usar objetos de valor;
evitar criar objeto inválido.
```

Por enquanto, o objetivo é entender comportamento dentro do objeto.

---

## Projeto 2 — Ordem de Serviço com comportamento

Crie:

```text
OrdemServicoComComportamento.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoComComportamento {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana Silva",
                StatusOs.ABERTA,
                LocalDate.now().minusDays(6),
                1
        );

        LocalDate hoje = LocalDate.now();

        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Precisa reagendamento: " + os.precisaReagendamento());
        System.out.println("Precisa atenção: " + os.precisaAtencao(hoje));
        System.out.println("Fila sugerida: " + os.filaSugerida(hoje));
    }
}

enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum FilaAtendimento {
    ENTRADA,
    REAGENDAMENTO,
    CASOS_CRITICOS,
    SEM_FILA
}

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServico(
            String certificado,
            String cliente,
            StatusOs status,
            LocalDate dataAbertura,
            int quantidadeReagendamentos
    ) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String certificado() {
        return certificado;
    }

    String cliente() {
        return cliente;
    }

    StatusOs status() {
        return status;
    }

    long diasEmAberto(LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);

        if (dias < 0) {
            return 0;
        }

        return dias;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
    }

    boolean precisaReagendamento() {
        return quantidadeReagendamentos >= 2;
    }

    boolean precisaAtencao(LocalDate dataReferencia) {
        return atrasada(dataReferencia) || precisaReagendamento();
    }

    FilaAtendimento filaSugerida(LocalDate dataReferencia) {
        if (encerrada()) {
            return FilaAtendimento.SEM_FILA;
        }

        if (atrasada(dataReferencia)) {
            return FilaAtendimento.CASOS_CRITICOS;
        }

        if (precisaReagendamento()) {
            return FilaAtendimento.REAGENDAMENTO;
        }

        return FilaAtendimento.ENTRADA;
    }
}
```

Compile e execute:

```powershell
javac OrdemServicoComComportamento.java
java OrdemServicoComComportamento
```

---

## O que observar nesse exemplo

A OS responde perguntas importantes sobre ela mesma:

```text
encerrada?
atrasada?
precisa reagendamento?
precisa atenção?
qual fila sugerida?
```

Essas perguntas fazem sentido para uma Ordem de Serviço.

O comportamento não está espalhado pelo `main`.

O `main` apenas usa o objeto:

```java
os.filaSugerida(hoje)
```

Esse é um sinal de melhor modelagem.

---

## Comportamento deve ter nome de domínio

Prefira nomes que o negócio entenderia.

Bons nomes:

```text
atrasada;
encerrada;
precisaAtencao;
filaSugerida;
totalFinal;
temDesconto;
podeReceberMensagem;
podeConfirmar.
```

Nomes fracos:

```text
calcular;
processar;
validar;
executar;
verificar;
fazer;
metodo1.
```

Às vezes `calcular` e `validar` fazem sentido, mas sozinhos são genéricos demais.

Compare:

```java
boolean validar()
```

com:

```java
boolean valido()
```

ou:

```java
boolean podeConfirmar()
```

O segundo comunica melhor a pergunta.

Compare:

```java
BigDecimal calcular()
```

com:

```java
BigDecimal totalFinal()
```

O segundo diz o que está sendo calculado.

---

## Objeto que faz, não objeto que só informa

Compare as duas chamadas:

```java
BigDecimal total = pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
```

e:

```java
BigDecimal total = pedido.totalBruto();
```

Na primeira, quem usa o pedido precisa conhecer a regra.

Na segunda, o próprio pedido oferece o comportamento.

Isso é mais orientado a objetos.

Outro exemplo:

```java
if (os.status() == StatusOs.CONCLUIDA || os.status() == StatusOs.CANCELADA) {
}
```

Melhor:

```java
if (os.encerrada()) {
}
```

Agora o código fala a linguagem do domínio.

---

## Quando a regra não deve ficar no objeto

Nem toda regra pertence à entidade.

Exemplo:

```text
enviar mensagem por WhatsApp;
salvar no banco de dados;
ler dados do console;
exibir relatório;
chamar API externa;
publicar evento em fila.
```

Essas ações envolvem infraestrutura, interface, integração ou orquestração.

Não coloque tudo dentro do objeto só porque “é OO”.

Exemplo ruim:

```java
class OrdemServico {
    void salvarNoBanco() {
    }

    void enviarWhatsapp() {
    }

    void imprimirRelatorio() {
    }
}
```

Isso mistura domínio, persistência, mensageria e exibição.

A classe fica poderosa demais e confusa.

A regra prática é:

```text
comportamento que depende do estado do próprio objeto pode ficar no objeto;
comportamento que depende de infraestrutura geralmente fica fora.
```

---

## Projeto 3 — Pagamento com comportamento

Crie:

```text
PagamentoComComportamento.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoComComportamento {
    public static void main(String[] args) {
        Pagamento pagamentoAprovado = new Pagamento(
                "PAG-001",
                new BigDecimal("150.00"),
                FormaPagamento.PIX,
                true
        );

        Pagamento pagamentoPendente = new Pagamento(
                "PAG-002",
                new BigDecimal("80.00"),
                FormaPagamento.BOLETO,
                false
        );

        imprimirPagamento(pagamentoAprovado);
        imprimirPagamento(pagamentoPendente);
    }

    public static void imprimirPagamento(Pagamento pagamento) {
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor válido: " + pagamento.valorValido());
        System.out.println("Aprovado: " + pagamento.aprovado());
        System.out.println("Pode confirmar: " + pagamento.podeConfirmar());
        System.out.println("Descrição: " + pagamento.descricao());
        System.out.println("------------------------------------");
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;

    Pagamento(
            String codigo,
            BigDecimal valor,
            FormaPagamento formaPagamento,
            boolean aprovado
    ) {
        this.codigo = codigo;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.aprovado = aprovado;
    }

    String codigo() {
        return codigo;
    }

    boolean aprovado() {
        return aprovado;
    }

    boolean valorValido() {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean formaInformada() {
        return formaPagamento != null;
    }

    boolean podeConfirmar() {
        return textoInformado(codigo)
                && valorValido()
                && formaInformada()
                && aprovado;
    }

    String descricao() {
        return "Pagamento " + codigo
                + " | Forma: " + formaPagamento
                + " | Valor: " + valor;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo mostra métodos de comportamento simples:

```text
valorValido;
formaInformada;
podeConfirmar;
descricao.
```

Eles deixam o código externo mais limpo.

---

## Métodos de comportamento podem chamar outros métodos

No pedido:

```java
BigDecimal totalFinal() {
    return totalBruto().subtract(desconto());
}
```

O método `totalFinal` chama:

```text
totalBruto;
desconto.
```

Na OS:

```java
boolean precisaAtencao(LocalDate dataReferencia) {
    return atrasada(dataReferencia) || precisaReagendamento();
}
```

O método `precisaAtencao` chama:

```text
atrasada;
precisaReagendamento.
```

Isso é normal.

Métodos menores podem se combinar para formar comportamentos maiores.

Atenção apenas para não criar uma cadeia confusa demais.

Se para entender um método você precisa abrir dez outros métodos, talvez a classe esteja ficando difícil.

---

## Comportamento e consistência

Métodos de comportamento ajudam a manter regra centralizada.

Se a regra de desconto está dentro de `Pedido`, quem quiser saber o desconto chama:

```java
pedido.desconto()
```

Não precisa repetir:

```java
if (total.compareTo(new BigDecimal("300.00")) >= 0) {
    desconto = total.multiply(new BigDecimal("0.10"));
}
```

em vários lugares.

Isso evita inconsistência.

Se amanhã a regra mudar para 15%, você muda em um ponto.

---

## Método de comportamento deve ser pequeno

Um método de comportamento bom costuma ser pequeno e claro.

Exemplo bom:

```java
boolean encerrada() {
    return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
}
```

Exemplo suspeito:

```java
void processarTudo() {
    // valida
    // calcula
    // imprime
    // salva
    // envia mensagem
    // atualiza histórico
}
```

Se o método tem “tudo” no nome ou no corpo, provavelmente está misturando responsabilidades.

---

## Comportamento com retorno boolean

Muitos comportamentos são perguntas.

Exemplos:

```text
valido?
encerrada?
atrasada?
temDesconto?
podeConfirmar?
podeReceberMensagem?
precisaAtencao?
```

Em Java, esses métodos geralmente retornam `boolean`.

Bons nomes para boolean costumam começar com ideia de pergunta:

```text
tem;
pode;
deve;
esta;
possui;
permite;
precisa.
```

Exemplos:

```java
boolean temDesconto()
boolean podeConfirmar()
boolean precisaAtencao(LocalDate dataReferencia)
```

O nome deve permitir leitura natural.

---

## Comportamento com retorno de valor

Outros comportamentos calculam e retornam valores.

Exemplos:

```text
totalBruto;
desconto;
totalFinal;
diasEmAberto;
filaSugerida;
descricao.
```

Esses métodos não perguntam verdadeiro ou falso.

Eles devolvem uma informação derivada do estado do objeto.

Exemplo:

```java
BigDecimal totalFinal() {
    return totalBruto().subtract(desconto());
}
```

Exemplo:

```java
FilaAtendimento filaSugerida(LocalDate dataReferencia) {
    if (encerrada()) {
        return FilaAtendimento.SEM_FILA;
    }

    if (atrasada(dataReferencia)) {
        return FilaAtendimento.CASOS_CRITICOS;
    }

    if (precisaReagendamento()) {
        return FilaAtendimento.REAGENDAMENTO;
    }

    return FilaAtendimento.ENTRADA;
}
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido

Digite e execute:

```text
PedidoComComportamento.java
```

Altere:

```text
precoUnitario;
quantidade.
```

Observe quando:

```text
temDesconto muda;
desconto muda;
totalFinal muda.
```

### Parte 2 — OS

Digite e execute:

```text
OrdemServicoComComportamento.java
```

Altere:

```text
status;
dataAbertura;
quantidadeReagendamentos.
```

Observe quando:

```text
encerrada muda;
atrasada muda;
precisaAtencao muda;
filaSugerida muda.
```

### Parte 3 — Pagamento

Digite e execute:

```text
PagamentoComComportamento.java
```

Altere:

```text
valor;
formaPagamento;
aprovado.
```

Observe quando `podeConfirmar` muda.

### Parte 4 — Leitura crítica

Para cada classe, responda:

```text
quais métodos são apenas acesso?
quais métodos são comportamento?
quais regras ficaram dentro do objeto?
alguma regra deveria ficar fora?
```

---

## Desafio prático

Crie o arquivo:

```text
ProdutoComComportamento.java
```

Modele uma classe `Produto` com:

Atributos:

```text
codigo;
nome;
preco;
estoque;
ativo.
```

Comportamentos:

```text
precoValido();
temEstoque();
disponivelParaVenda();
valorTotalEmEstoque();
descricao();
```

Regras:

```text
preço válido é maior que zero;
tem estoque quando estoque é maior que zero;
produto disponível precisa estar ativo, ter preço válido e ter estoque;
valor total em estoque é preço multiplicado pela quantidade;
descrição deve mostrar código e nome.
```

Crie dois produtos no `main`:

```text
um disponível;
um sem estoque ou inativo.
```

Imprima os comportamentos dos dois.

---

## Erros comuns

### 1. Classe só com getters

Se a classe só devolve dados, talvez esteja anêmica.

### 2. Regra espalhada fora do objeto

Se todo mundo calcula desconto do pedido fora da classe, a regra pode ficar inconsistente.

### 3. Colocar infraestrutura no domínio

Objeto de domínio não deve salvar banco, chamar API ou enviar mensagem diretamente nesta fase.

### 4. Nome genérico

Evite `processar`, `executar`, `validar` sem contexto.

### 5. Método grande demais

Comportamento bom deve ter responsabilidade clara.

### 6. Usar static para comportamento do objeto

Se usa estado do objeto, provavelmente deve ser método de instância.

### 7. Esconder regra ruim dentro da classe

Colocar regra dentro da classe não torna a regra automaticamente boa. Ela ainda precisa ser clara.

---

## Debug recomendado

Use debug em:

```text
PedidoComComportamento.java
OrdemServicoComComportamento.java
PagamentoComComportamento.java
```

Coloque breakpoint em chamadas como:

```java
pedido.totalFinal()
os.filaSugerida(hoje)
pagamento.podeConfirmar()
```

Entre nos métodos e observe:

```text
quais atributos são usados;
quais métodos chamam outros métodos;
qual decisão muda o retorno;
como o mesmo objeto usa seu próprio estado.
```

No exemplo da OS, acompanhe:

```text
filaSugerida;
encerrada;
atrasada;
precisaReagendamento.
```

Esse debug ajuda a entender comportamento de objeto funcionando por dentro.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre getter e método de comportamento?
2. Qual regra você colocou dentro de um objeto?
3. Qual regra você deixaria fora do objeto?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar método de comportamento;
identificar objeto anêmico;
criar método que usa estado do objeto;
nomear comportamento com linguagem do domínio;
diferenciar acesso de comportamento;
criar métodos booleanos com bons nomes;
criar métodos que retornam valores calculados;
centralizar regra simples dentro do objeto;
evitar colocar infraestrutura no objeto;
debugar comportamento chamando outros métodos;
refatorar uma regra procedural para método de objeto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-109-metodos-de-comportamento
git commit -m "Aula 109: cria metodos de comportamento"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
objeto bom não apenas guarda dados; ele responde perguntas e executa comportamentos que pertencem ao seu domínio.
```

Esse é um passo importante para sair de classes anêmicas e começar a escrever código realmente orientado a objetos.

Na próxima aula, vamos estudar construtores.

Vamos entender melhor o nascimento do objeto, dados obrigatórios, construtor padrão, construtor parametrizado, sobrecarga e legibilidade.
