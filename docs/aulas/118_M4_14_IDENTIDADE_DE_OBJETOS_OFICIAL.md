# 118 — M4.14 — Identidade de objetos

## Objetivo da aula

Nesta aula você vai aprofundar um ponto essencial da Orientação a Objetos: identidade.

Na aula anterior, você estudou entidades. Vimos que uma entidade é um objeto com identidade e ciclo de vida. Agora vamos entender melhor o que isso significa em Java.

Ao final da aula, você deve conseguir:

```text
explicar identidade de objeto;
entender diferença entre referência e objeto;
entender quando duas variáveis apontam para o mesmo objeto;
entender quando dois objetos têm dados iguais, mas identidades diferentes;
diferenciar igualdade de referência, igualdade de valor e igualdade de entidade;
entender por que == pode confundir quando usado com objetos;
criar métodos simples de comparação por identidade;
entender por que objetos de valor e entidades são comparados de formas diferentes;
preparar a base para equals e hashCode.
```

Essa aula é muito importante porque muitos bugs em Java acontecem por confusão entre:

```text
mesmo objeto;
mesmos dados;
mesma identidade;
mesmo valor;
mesma referência.
```

Essas coisas parecem parecidas, mas não são iguais.

---

## A ideia central

Quando você cria um objeto em Java:

```java
Cliente cliente = new Cliente(...);
```

a variável `cliente` não guarda o objeto inteiro.

Ela guarda uma referência para o objeto.

Pense assim:

```text
objeto = algo criado na memória;
referência = caminho para chegar até esse objeto.
```

Duas variáveis podem apontar para o mesmo objeto:

```java
Cliente cliente1 = new Cliente(...);
Cliente cliente2 = cliente1;
```

Nesse caso:

```text
cliente1 e cliente2 apontam para o mesmo objeto.
```

Mas também podemos ter dois objetos diferentes com os mesmos dados:

```java
Cliente cliente1 = new Cliente(10, "Ana");
Cliente cliente2 = new Cliente(10, "Ana");
```

Nesse caso:

```text
os dados são iguais;
as referências são diferentes;
os objetos são diferentes na memória;
mas a identidade de entidade pode ser considerada a mesma se o id for o mesmo.
```

Essa diferença é o centro da aula.

---

## Referência não é o objeto

Em Java, variáveis de tipos de objeto guardam referências.

Exemplo:

```java
Cliente cliente = new Cliente(10, "Ana");
```

A variável `cliente` aponta para o objeto criado com `new`.

Quando você faz:

```java
Cliente outroCliente = cliente;
```

você não criou outro cliente.

Você criou outra variável apontando para o mesmo objeto.

Essa diferença precisa ficar muito clara.

---

## Exemplo 1 — Duas variáveis, mesmo objeto

Crie a pasta:

```powershell
mkdir labs\m4\aula-118-identidade-de-objetos
cd labs\m4\aula-118-identidade-de-objetos
```

Crie o arquivo:

```text
MesmaReferencia.java
```

Código:

```java
public class MesmaReferencia {
    public static void main(String[] args) {
        ClienteMesmaReferencia clienteOriginal = new ClienteMesmaReferencia(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        ClienteMesmaReferencia clienteApontandoParaOMesmoObjeto = clienteOriginal;

        System.out.println("Antes da alteração:");
        System.out.println("Original: " + clienteOriginal.resumo());
        System.out.println("Outra variável: " + clienteApontandoParaOMesmoObjeto.resumo());

        clienteApontandoParaOMesmoObjeto.alterarEmail("ana.novo@email.com");

        System.out.println();
        System.out.println("Depois da alteração:");
        System.out.println("Original: " + clienteOriginal.resumo());
        System.out.println("Outra variável: " + clienteApontandoParaOMesmoObjeto.resumo());

        System.out.println();
        System.out.println("clienteOriginal == clienteApontandoParaOMesmoObjeto: "
                + (clienteOriginal == clienteApontandoParaOMesmoObjeto));
    }
}

class ClienteMesmaReferencia {
    private final int id;
    private final String nome;
    private String email;

    ClienteMesmaReferencia(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email) || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    void alterarEmail(String novoEmail) {
        if (!textoInformado(novoEmail) || !novoEmail.contains("@")) {
            throw new IllegalArgumentException("Novo e-mail inválido.");
        }

        this.email = novoEmail;
    }

    String resumo() {
        return "Cliente " + id + " | Nome: " + nome + " | E-mail: " + email;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac MesmaReferencia.java
java MesmaReferencia
```

---

## O que aconteceu

Estas duas variáveis apontam para o mesmo objeto:

```java
ClienteMesmaReferencia clienteOriginal = new ClienteMesmaReferencia(...);
ClienteMesmaReferencia clienteApontandoParaOMesmoObjeto = clienteOriginal;
```

Quando você altera por uma variável:

```java
clienteApontandoParaOMesmoObjeto.alterarEmail("ana.novo@email.com");
```

a outra variável enxerga a alteração:

```java
clienteOriginal.resumo()
```

Por quê?

Porque não existem dois clientes.

Existe um objeto e duas referências para ele.

Por isso o resultado de:

```java
clienteOriginal == clienteApontandoParaOMesmoObjeto
```

é:

```text
true
```

O operador `==`, quando usado com objetos, compara referência.

Ele pergunta:

```text
essas duas variáveis apontam para o mesmo objeto na memória?
```

---

## Exemplo 2 — Dois objetos diferentes com os mesmos dados

Agora crie:

```text
ObjetosDiferentesMesmoDados.java
```

Código:

```java
public class ObjetosDiferentesMesmoDados {
    public static void main(String[] args) {
        ClienteMesmoDados cliente1 = new ClienteMesmoDados(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        ClienteMesmoDados cliente2 = new ClienteMesmoDados(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println("Cliente 1: " + cliente1.resumo());
        System.out.println("Cliente 2: " + cliente2.resumo());

        System.out.println();
        System.out.println("cliente1 == cliente2: " + (cliente1 == cliente2));
        System.out.println("cliente1.mesmaIdentidade(cliente2): " + cliente1.mesmaIdentidade(cliente2));
    }
}

class ClienteMesmoDados {
    private final int id;
    private final String nome;
    private final String email;

    ClienteMesmoDados(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email) || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    boolean mesmaIdentidade(ClienteMesmoDados outro) {
        if (outro == null) {
            return false;
        }

        return id == outro.id;
    }

    String resumo() {
        return "Cliente " + id + " | Nome: " + nome + " | E-mail: " + email;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac ObjetosDiferentesMesmoDados.java
java ObjetosDiferentesMesmoDados
```

---

## O que observar

Aqui existem dois `new`:

```java
ClienteMesmoDados cliente1 = new ClienteMesmoDados(...);
ClienteMesmoDados cliente2 = new ClienteMesmoDados(...);
```

Cada `new` cria um objeto diferente.

Por isso:

```java
cliente1 == cliente2
```

retorna:

```text
false
```

Mas os dois clientes possuem o mesmo id:

```text
10
```

Então, pelo ponto de vista da entidade, podemos considerar que possuem a mesma identidade.

Por isso criamos:

```java
boolean mesmaIdentidade(ClienteMesmoDados outro) {
    return id == outro.id;
}
```

Esse método pergunta:

```text
essas duas entidades representam o mesmo cliente do domínio?
```

Isso é diferente de perguntar se são a mesma referência na memória.

---

## Três tipos de comparação

Você precisa separar três ideias.

### 1. Igualdade de referência

Pergunta:

```text
as duas variáveis apontam para o mesmo objeto?
```

Em Java:

```java
cliente1 == cliente2
```

### 2. Igualdade de entidade

Pergunta:

```text
as duas entidades representam a mesma coisa no domínio?
```

Exemplo:

```java
cliente1.mesmaIdentidade(cliente2)
```

A comparação normalmente usa um identificador:

```text
id;
código;
número;
uuid;
matrícula.
```

### 3. Igualdade de valor

Pergunta:

```text
os dois valores são equivalentes?
```

Exemplo:

```java
email1.mesmoValor(email2)
```

A comparação usa os dados do objeto de valor.

Essas três comparações podem dar resultados diferentes.

---

## Identidade em entidade

Entidade é definida por identidade.

Exemplo:

```text
Cliente id 10
```

Mesmo que o e-mail mude, continua sendo o Cliente id 10.

Exemplo:

```text
Pedido número 1001
```

Mesmo que o status mude, continua sendo o Pedido 1001.

Exemplo:

```text
OS OS-2026-0001
```

Mesmo que seja reagendada, continua sendo a mesma OS.

A identidade dá continuidade ao objeto.

---

## Exemplo 3 — Entidade mudando estado, mesma identidade

Crie:

```text
EntidadeMesmaIdentidade.java
```

Código:

```java
public class EntidadeMesmaIdentidade {
    public static void main(String[] args) {
        PedidoIdentidade pedido = new PedidoIdentidade(
                1001,
                "Ana Silva"
        );

        System.out.println("Pedido criado:");
        System.out.println(pedido.resumo());

        pedido.confirmarPagamento();
        System.out.println("Depois do pagamento:");
        System.out.println(pedido.resumo());

        pedido.enviar();
        System.out.println("Depois do envio:");
        System.out.println(pedido.resumo());

        System.out.println("Identidade do pedido: " + pedido.numero());
    }
}

enum StatusPedidoIdentidade {
    CRIADO,
    PAGO,
    ENVIADO,
    CANCELADO
}

class PedidoIdentidade {
    private final int numero;
    private final String cliente;
    private StatusPedidoIdentidade status;

    PedidoIdentidade(int numero, String cliente) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.status = StatusPedidoIdentidade.CRIADO;
    }

    int numero() {
        return numero;
    }

    boolean criado() {
        return status == StatusPedidoIdentidade.CRIADO;
    }

    boolean pago() {
        return status == StatusPedidoIdentidade.PAGO;
    }

    void confirmarPagamento() {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        status = StatusPedidoIdentidade.PAGO;
    }

    void enviar() {
        if (!pago()) {
            throw new IllegalStateException("Somente pedido pago pode ser enviado.");
        }

        status = StatusPedidoIdentidade.ENVIADO;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + cliente
                + " | Status: " + status;
    }
}
```

Compile e execute:

```powershell
javac EntidadeMesmaIdentidade.java
java EntidadeMesmaIdentidade
```

---

## O que esse exemplo mostra

O pedido mudou:

```text
CRIADO -> PAGO -> ENVIADO
```

Mas a identidade continuou:

```text
Pedido 1001
```

Isso é entidade.

O objeto possui ciclo de vida, mas mantém identidade.

Essa é uma diferença importante em relação a objetos de valor.

---

## Identidade em objeto de valor

Objeto de valor não é identificado por id.

Ele é definido pelos seus dados.

Exemplo:

```text
Email: ana@email.com
Telefone: (11) 999999999
Dinheiro: R$ 100,00
Periodo: 2026-01-01 até 2026-12-31
```

Se dois objetos `Email` possuem o mesmo valor normalizado, eles representam o mesmo valor.

Crie:

```text
ValorMesmosDados.java
```

Código:

```java
public class ValorMesmosDados {
    public static void main(String[] args) {
        EmailIdentidadeValor email1 = new EmailIdentidadeValor("Ana@Email.com");
        EmailIdentidadeValor email2 = new EmailIdentidadeValor("ana@email.com");

        System.out.println("E-mail 1: " + email1.valor());
        System.out.println("E-mail 2: " + email2.valor());

        System.out.println();
        System.out.println("email1 == email2: " + (email1 == email2));
        System.out.println("email1.mesmoValor(email2): " + email1.mesmoValor(email2));
    }
}

class EmailIdentidadeValor {
    private final String valor;

    EmailIdentidadeValor(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    boolean mesmoValor(EmailIdentidadeValor outro) {
        if (outro == null) {
            return false;
        }

        return valor.equals(outro.valor);
    }
}
```

Compile e execute:

```powershell
javac ValorMesmosDados.java
java ValorMesmosDados
```

---

## O que observar

Foram criados dois objetos:

```java
EmailIdentidadeValor email1 = new EmailIdentidadeValor("Ana@Email.com");
EmailIdentidadeValor email2 = new EmailIdentidadeValor("ana@email.com");
```

São referências diferentes:

```java
email1 == email2
```

retorna:

```text
false
```

Mas os valores normalizados são iguais:

```text
ana@email.com
ana@email.com
```

Então:

```java
email1.mesmoValor(email2)
```

retorna:

```text
true
```

Esse exemplo mostra a diferença entre:

```text
mesma referência;
mesmo valor.
```

---

## Não use == para comparar conteúdo de objetos

Com objetos, `==` compara referência.

Isso vale para classes criadas por você.

Também é uma fonte comum de erro com `String`.

Exemplo perigoso:

```java
String a = new String("java");
String b = new String("java");

System.out.println(a == b);
```

Pode retornar `false`, porque são objetos diferentes.

Para conteúdo de `String`, usamos:

```java
a.equals(b)
```

Na próxima aula vamos estudar `equals` e `hashCode` com mais profundidade.

Por enquanto, guarde:

```text
== em objeto compara referência;
conteúdo precisa de outra forma de comparação.
```

---

## Exemplo 4 — String e referência

Crie:

```text
StringReferencia.java
```

Código:

```java
public class StringReferencia {
    public static void main(String[] args) {
        String texto1 = new String("java");
        String texto2 = new String("java");

        System.out.println("texto1: " + texto1);
        System.out.println("texto2: " + texto2);

        System.out.println();
        System.out.println("texto1 == texto2: " + (texto1 == texto2));
        System.out.println("texto1.equals(texto2): " + texto1.equals(texto2));

        String texto3 = "java";
        String texto4 = "java";

        System.out.println();
        System.out.println("texto3 == texto4: " + (texto3 == texto4));
        System.out.println("texto3.equals(texto4): " + texto3.equals(texto4));
    }
}
```

Compile e execute:

```powershell
javac StringReferencia.java
java StringReferencia
```

Esse exemplo mostra uma pegadinha.

Com `new String("java")`, você cria objetos diferentes.

Com literais `"java"`, o Java pode reutilizar a mesma instância no pool de strings.

Mas não dependa de `==` para comparar conteúdo de `String`.

Use:

```java
equals
```

Para domínio, vamos criar comparações mais claras.

---

## Identidade e objeto ainda não salvo

Em sistemas backend, muitas entidades recebem id do banco.

Exemplo:

```text
Cliente criado na memória ainda não tem id.
Depois de salvar, recebe id 10.
```

Isso cria uma pergunta importante:

```text
como comparar entidades sem id?
```

Essa pergunta será aprofundada mais adiante, especialmente quando estudarmos persistência, banco e JPA.

Por enquanto, uma regra simples:

```text
se a identidade ainda não existe, evite tratar como a mesma entidade;
se a identidade existe e é igual, provavelmente representa a mesma entidade.
```

Exemplo conceitual:

```java
Cliente clienteNovo = new Cliente(null, "Ana");
```

Ainda não tem identidade persistida.

Quando salvo:

```java
Cliente clienteSalvo = new Cliente(10, "Ana");
```

Agora existe identidade.

Nesta fase do curso, vamos continuar usando ids e códigos já definidos para facilitar a prática.

---

## Exemplo 5 — Identidade por código de OS

Agora vamos usar um exemplo de Ordem de Serviço.

Crie:

```text
IdentidadeOrdemServico.java
```

Código:

```java
import java.time.LocalDate;

public class IdentidadeOrdemServico {
    public static void main(String[] args) {
        CodigoOsIdentidade codigo = new CodigoOsIdentidade("OS-2026-0001");

        OrdemServicoIdentidade os1 = new OrdemServicoIdentidade(
                codigo,
                "Ana Silva",
                LocalDate.now().plusDays(1)
        );

        OrdemServicoIdentidade os2 = new OrdemServicoIdentidade(
                new CodigoOsIdentidade("OS-2026-0001"),
                "Ana Silva",
                LocalDate.now().plusDays(3)
        );

        System.out.println("OS 1:");
        System.out.println(os1.resumo());

        System.out.println();
        System.out.println("OS 2:");
        System.out.println(os2.resumo());

        System.out.println();
        System.out.println("os1 == os2: " + (os1 == os2));
        System.out.println("os1.mesmaIdentidade(os2): " + os1.mesmaIdentidade(os2));
    }
}

class OrdemServicoIdentidade {
    private final CodigoOsIdentidade codigo;
    private final String cliente;
    private final LocalDate dataAgendamento;

    OrdemServicoIdentidade(CodigoOsIdentidade codigo, String cliente, LocalDate dataAgendamento) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataAgendamento == null) {
            throw new IllegalArgumentException("Data de agendamento é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAgendamento = dataAgendamento;
    }

    boolean mesmaIdentidade(OrdemServicoIdentidade outra) {
        if (outra == null) {
            return false;
        }

        return codigo.mesmoValor(outra.codigo);
    }

    String resumo() {
        return "Código: " + codigo.valor()
                + " | Cliente: " + cliente
                + " | Data: " + dataAgendamento;
    }
}

class CodigoOsIdentidade {
    private final String valor;

    CodigoOsIdentidade(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = valor;
    }

    String valor() {
        return valor;
    }

    boolean mesmoValor(CodigoOsIdentidade outro) {
        if (outro == null) {
            return false;
        }

        return valor.equals(outro.valor);
    }
}
```

Compile e execute:

```powershell
javac IdentidadeOrdemServico.java
java IdentidadeOrdemServico
```

---

## O que a OS mostra

Foram criadas duas instâncias diferentes:

```java
os1
os2
```

Por isso:

```java
os1 == os2
```

retorna:

```text
false
```

Mas as duas possuem o mesmo código:

```text
OS-2026-0001
```

Então, do ponto de vista da identidade de entidade:

```java
os1.mesmaIdentidade(os2)
```

retorna:

```text
true
```

Esse é um exemplo muito próximo de sistema real.

Duas instâncias diferentes em memória podem representar a mesma entidade do banco ou do domínio.

---

## Cuidado com identidade mutável

A identidade de uma entidade deve ser estável.

Evite permitir alteração livre de identidade.

Ruim:

```java
void setId(int id) {
    this.id = id;
}
```

Ruim:

```java
void setCodigo(String codigo) {
    this.codigo = codigo;
}
```

Se o código identifica a OS, não faz sentido trocar livremente depois que a entidade nasceu.

Por isso usamos:

```java
private final CodigoOsIdentidade codigo;
```

ou:

```java
private final int id;
```

Quando a identidade muda livremente, fica difícil confiar na entidade.

Regra prática:

```text
identidade deve ser estável.
```

---

## Identidade e mutação de estado

A entidade pode mudar estado sem mudar identidade.

Exemplo:

```text
OS-2026-0001
Status: AGENDADA
```

Depois:

```text
OS-2026-0001
Status: REAGENDADA
```

Depois:

```text
OS-2026-0001
Status: CONCLUIDA
```

O status mudou.

A identidade não.

Isso é normal.

O que não deveria acontecer facilmente:

```text
OS-2026-0001 virar OS-2026-9999.
```

Isso seria trocar identidade.

---

## Quando a identidade é um objeto de valor

Às vezes a identidade é representada por objeto de valor.

Exemplos:

```text
CodigoOs;
NumeroPedido;
CodigoProduto;
MatriculaUsuario;
NumeroContrato.
```

A entidade usa esse objeto como identidade.

Exemplo:

```java
class OrdemServico {
    private final CodigoOs codigo;
}
```

`CodigoOs` é objeto de valor.

`OrdemServico` é entidade.

Isso é muito comum e muito bom para o modelo.

O objeto de valor valida e representa o código.

A entidade usa esse código como identidade.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Mesma referência

Execute:

```text
MesmaReferencia.java
```

Explique:

```text
por que alterar uma variável alterou o resultado visto pela outra;
por que == retornou true.
```

### Parte 2 — Objetos diferentes com mesmos dados

Execute:

```text
ObjetosDiferentesMesmoDados.java
```

Explique:

```text
por que == retornou false;
por que mesmaIdentidade retornou true.
```

### Parte 3 — Entidade mudando estado

Execute:

```text
EntidadeMesmaIdentidade.java
```

Explique:

```text
qual dado representa identidade;
quais dados representam estado;
por que o pedido continua sendo o mesmo.
```

### Parte 4 — Objeto de valor

Execute:

```text
ValorMesmosDados.java
```

Explique:

```text
por que email1 == email2 retornou false;
por que mesmoValor retornou true.
```

### Parte 5 — String

Execute:

```text
StringReferencia.java
```

Explique:

```text
por que não devemos usar == para comparar conteúdo de String.
```

### Parte 6 — OS

Execute:

```text
IdentidadeOrdemServico.java
```

Explique:

```text
qual é a identidade da OS;
por que duas instâncias podem representar a mesma OS.
```

---

## Desafio prático

Crie o arquivo:

```text
IdentidadeProduto.java
```

Modele uma entidade `ProdutoIdentidade`.

Crie também um objeto de valor `CodigoProdutoIdentidade`.

Regras do código:

```text
código obrigatório;
código deve iniciar com PROD-.
```

Produto deve ter:

```text
codigo;
nome;
status;
estoque.
```

Use enum:

```java
enum StatusProdutoIdentidade {
    ATIVO,
    INATIVO
}
```

Regras:

```text
produto nasce ativo;
estoque inicial não pode ser negativo;
identidade do produto é o código;
produto pode vender se estiver ativo e tiver estoque;
vender reduz estoque;
inativar muda status;
reativar muda status;
duas instâncias com o mesmo código representam a mesma identidade.
```

Métodos esperados:

```text
mesmaIdentidade(ProdutoIdentidade outro);
vender(int quantidade);
inativar(String motivo);
reativar();
resumo();
```

No `main`, crie:

```text
produto1 com código PROD-001;
produto2 com código PROD-001;
produto3 com código PROD-002.
```

Mostre:

```text
produto1 == produto2;
produto1.mesmaIdentidade(produto2);
produto1.mesmaIdentidade(produto3).
```

---

## Erros comuns

### 1. Achar que == compara conteúdo

Com objetos, `==` compara referência.

### 2. Confundir mesmos dados com mesmo objeto

Dois objetos podem ter dados iguais e ainda serem instâncias diferentes.

### 3. Confundir entidade com objeto de valor

Entidade compara identidade. Objeto de valor compara valor.

### 4. Deixar identidade mutável

Evite setter livre para id, código ou número que identifica a entidade.

### 5. Usar String solta para identidade importante

Um código importante pode merecer objeto de valor.

### 6. Comparar String com ==

Use comparação de conteúdo, não referência.

### 7. Achar que duas instâncias diferentes nunca representam a mesma entidade

Em backend, duas instâncias diferentes podem representar o mesmo registro ou a mesma entidade do domínio.

### 8. Ignorar entidade sem id

Entidades ainda não salvas exigem cuidado especial na comparação.

---

## Debug recomendado

Use debug em:

```text
MesmaReferencia.java
ObjetosDiferentesMesmoDados.java
ValorMesmosDados.java
IdentidadeOrdemServico.java
```

Observe:

```text
quando existe um new;
quando existem dois new;
quando uma variável recebe outra;
quando duas referências apontam para o mesmo objeto;
quando dois objetos têm o mesmo id ou código;
quando objetos de valor têm mesmo conteúdo.
```

Breakpoints recomendados:

```java
ClienteMesmaReferencia clienteOriginal = new ClienteMesmaReferencia(...)
ClienteMesmaReferencia clienteApontandoParaOMesmoObjeto = clienteOriginal

ClienteMesmoDados cliente1 = new ClienteMesmoDados(...)
ClienteMesmoDados cliente2 = new ClienteMesmoDados(...)

EmailIdentidadeValor email1 = new EmailIdentidadeValor(...)
EmailIdentidadeValor email2 = new EmailIdentidadeValor(...)

OrdemServicoIdentidade os1 = new OrdemServicoIdentidade(...)
OrdemServicoIdentidade os2 = new OrdemServicoIdentidade(...)
```

No debug, compare mentalmente:

```text
mesma referência?
mesmo valor?
mesma identidade de domínio?
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que == compara quando usado com objetos?
2. Qual a diferença entre mesma referência e mesma identidade?
3. Como um objeto de valor deve ser comparado conceitualmente?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar identidade de objetos;
entender referência;
entender o efeito de atribuir uma variável de objeto a outra;
diferenciar mesma referência de mesmos dados;
diferenciar entidade de objeto de valor na comparação;
explicar por que == pode confundir;
criar método mesmaIdentidade;
criar método mesmoValor;
entender identidade estável;
evitar setter para identidade;
entender que duas instâncias podem representar a mesma entidade;
debugar referências e identidade;
resolver o desafio IdentidadeProduto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-118-identidade-de-objetos
git commit -m "Aula 118: pratica identidade de objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
identidade não é a mesma coisa que referência e também não é a mesma coisa que valor.
```

Você viu que:

```text
duas variáveis podem apontar para o mesmo objeto;
dois objetos diferentes podem ter os mesmos dados;
duas entidades diferentes podem ter nomes iguais;
duas instâncias diferentes podem representar a mesma entidade se possuem a mesma identidade;
objetos de valor são comparados pelo valor que carregam.
```

Essa base é essencial para a próxima aula.

Na próxima aula, vamos estudar `equals` e `hashCode`.

Vamos entender como o Java permite definir comparação de objetos de forma mais correta, por que isso afeta coleções e por que esse assunto é tão importante em backend.
