# 119 — M4.15 — equals e hashCode

## Objetivo da aula

Nesta aula você vai aprender `equals` e `hashCode` em Java.

Na aula anterior, você estudou identidade de objetos. Vimos que `==` compara referência quando usado com objetos, e que duas instâncias diferentes podem representar a mesma entidade do domínio.

Agora vamos entender como o Java permite definir comparação de objetos de forma mais correta.

Ao final da aula, você deve conseguir:

```text
explicar o que é equals;
explicar o que é hashCode;
entender por que == não resolve comparação de objetos;
sobrescrever equals com segurança;
sobrescrever hashCode junto com equals;
entender o contrato entre equals e hashCode;
comparar objeto de valor por valor;
comparar entidade por identidade;
usar Objects.equals e Objects.hash;
entender por que coleções dependem de equals e hashCode;
evitar erros comuns em comparação de objetos.
```

Essa aula é essencial para Java backend.

Você vai usar `equals` e `hashCode` em:

```text
coleções;
Set;
Map;
DTOs;
entidades;
objetos de valor;
testes;
comparações de domínio;
código gerado por IDE;
JPA;
record;
validações;
regras de negócio.
```

Mesmo que frameworks gerem parte disso no futuro, você precisa entender o conceito.

---

## A ideia central

Em Java, todo objeto herda métodos da classe `Object`.

Dois desses métodos são:

```java
equals(...)
hashCode()
```

O método `equals` responde:

```text
este objeto é considerado igual a outro?
```

O método `hashCode` retorna um número usado por estruturas de dados para organizar objetos em coleções baseadas em hash.

Exemplos de coleções que dependem disso:

```text
HashSet;
HashMap;
LinkedHashSet;
LinkedHashMap;
ConcurrentHashMap.
```

O ponto mais importante da aula é:

```text
se você sobrescreve equals, também deve sobrescrever hashCode.
```

Os dois trabalham juntos.

---

## O problema de usar ==

Com objetos, `==` compara referência.

Ele pergunta:

```text
as duas variáveis apontam para o mesmo objeto na memória?
```

Não pergunta:

```text
os objetos têm o mesmo conteúdo?
representam a mesma entidade?
têm o mesmo valor?
```

Veja um exemplo simples.

Crie a pasta:

```powershell
mkdir labs\m4\aula-119-equals-hashcode
cd labs\m4\aula-119-equals-hashcode
```

Crie o arquivo:

```text
ComparacaoComIgualIgual.java
```

Código:

```java
public class ComparacaoComIgualIgual {
    public static void main(String[] args) {
        EmailSemEquals email1 = new EmailSemEquals("ana@email.com");
        EmailSemEquals email2 = new EmailSemEquals("ana@email.com");

        System.out.println("email1 == email2: " + (email1 == email2));
        System.out.println("email1.equals(email2): " + email1.equals(email2));
    }
}

class EmailSemEquals {
    private final String valor;

    EmailSemEquals(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac ComparacaoComIgualIgual.java
java ComparacaoComIgualIgual
```

---

## O que aconteceu

Foram criados dois objetos:

```java
EmailSemEquals email1 = new EmailSemEquals("ana@email.com");
EmailSemEquals email2 = new EmailSemEquals("ana@email.com");
```

Eles carregam o mesmo valor.

Mas são duas instâncias diferentes.

Por isso:

```java
email1 == email2
```

retorna:

```text
false
```

E, como não sobrescrevemos `equals`, o `equals` herdado de `Object` também compara referência.

Então:

```java
email1.equals(email2)
```

também retorna:

```text
false
```

Para objetos de valor, isso geralmente não é o que queremos.

---

## equals em objeto de valor

Objeto de valor deve ser comparado pelo valor que carrega.

Exemplo:

```text
Email("ana@email.com")
```

deve ser considerado igual a outro:

```text
Email("ana@email.com")
```

mesmo que sejam instâncias diferentes.

Vamos corrigir.

Crie:

```text
EmailComEquals.java
```

Código:

```java
import java.util.Objects;

public class EmailComEquals {
    public static void main(String[] args) {
        EmailValorEquals email1 = new EmailValorEquals("Ana@Email.com");
        EmailValorEquals email2 = new EmailValorEquals("ana@email.com");
        EmailValorEquals email3 = new EmailValorEquals("carlos@email.com");

        System.out.println("email1 == email2: " + (email1 == email2));
        System.out.println("email1.equals(email2): " + email1.equals(email2));
        System.out.println("email1.equals(email3): " + email1.equals(email3));

        System.out.println("hash email1: " + email1.hashCode());
        System.out.println("hash email2: " + email2.hashCode());
        System.out.println("hash email3: " + email3.hashCode());
    }
}

class EmailValorEquals {
    private final String valor;

    EmailValorEquals(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    String dominio() {
        return valor.substring(valor.indexOf("@") + 1);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailValorEquals email = (EmailValorEquals) outro;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac EmailComEquals.java
java EmailComEquals
```

---

## Análise do equals

Veja o método:

```java
@Override
public boolean equals(Object outro) {
    if (this == outro) {
        return true;
    }

    if (outro == null || getClass() != outro.getClass()) {
        return false;
    }

    EmailValorEquals email = (EmailValorEquals) outro;
    return Objects.equals(valor, email.valor);
}
```

Vamos por partes.

### 1. Mesmo objeto na memória

```java
if (this == outro) {
    return true;
}
```

Se os dois apontam para o mesmo objeto, são iguais.

Não precisa comparar mais nada.

### 2. Nulo ou classe diferente

```java
if (outro == null || getClass() != outro.getClass()) {
    return false;
}
```

Se o outro objeto é `null`, não é igual.

Se é de outra classe, também não é igual.

### 3. Cast

```java
EmailValorEquals email = (EmailValorEquals) outro;
```

Depois de verificar a classe, podemos converter `Object` para `EmailValorEquals`.

### 4. Comparação dos atributos

```java
return Objects.equals(valor, email.valor);
```

Aqui comparamos o valor real do e-mail.

Como o construtor normaliza para minúsculo, estes dois ficam iguais:

```text
Ana@Email.com
ana@email.com
```

---

## Por que o parâmetro de equals é Object

A assinatura correta do método é:

```java
public boolean equals(Object outro)
```

Não é:

```java
public boolean equals(EmailValorEquals outro)
```

Se você escrever com o tipo específico, não estará sobrescrevendo corretamente o método de `Object`.

Estará criando outro método sobrecarregado.

Por isso usamos `@Override`.

Se a assinatura estiver errada, o compilador avisa.

Esse é um ótimo motivo para sempre usar `@Override` ao sobrescrever métodos.

---

## hashCode

`hashCode` retorna um número inteiro.

Esse número é usado por estruturas baseadas em hash para localizar objetos com eficiência.

Exemplo:

```java
@Override
public int hashCode() {
    return Objects.hash(valor);
}
```

A regra principal é:

```text
se dois objetos são iguais pelo equals, eles precisam ter o mesmo hashCode.
```

No exemplo:

```java
email1.equals(email2)
```

retorna `true`.

Então:

```java
email1.hashCode() == email2.hashCode()
```

também deve ser `true`.

O contrário não é obrigatório.

Dois objetos diferentes podem ter o mesmo hashCode em raros casos. Isso é chamado colisão.

Mas objetos iguais precisam ter o mesmo hashCode.

---

## Contrato entre equals e hashCode

Regra essencial:

```text
se a.equals(b) é true, então a.hashCode() deve ser igual a b.hashCode().
```

Se você quebrar essa regra, coleções como `HashSet` e `HashMap` podem se comportar de forma estranha.

Outra regra importante:

```text
o valor usado no equals deve ser compatível com o valor usado no hashCode.
```

Se `equals` usa `valor`, `hashCode` também deve usar `valor`.

Ruim:

```java
equals compara email;
hashCode usa nome.
```

Bom:

```java
equals compara email;
hashCode usa email.
```

---

## O que Objects.equals faz

`Objects.equals(a, b)` compara dois valores com segurança contra `null`.

Exemplo:

```java
Objects.equals(valor, email.valor)
```

É equivalente à ideia:

```text
se os dois forem null, retorna true;
se um for null e o outro não, retorna false;
se nenhum for null, chama equals.
```

Mesmo que no nosso objeto `valor` nunca seja nulo por causa do construtor, `Objects.equals` é uma prática comum e segura.

---

## O que Objects.hash faz

`Objects.hash(valor)` gera um hash baseado nos atributos informados.

Exemplo com mais de um campo:

```java
Objects.hash(ddd, numero)
```

Isso é útil para objetos de valor com múltiplos atributos.

Vamos ver.

---

## Objeto de valor com mais de um atributo

Crie:

```text
TelefoneComEquals.java
```

Código:

```java
import java.util.Objects;

public class TelefoneComEquals {
    public static void main(String[] args) {
        TelefoneValorEquals telefone1 = new TelefoneValorEquals("11", "999999999");
        TelefoneValorEquals telefone2 = new TelefoneValorEquals("11", "999999999");
        TelefoneValorEquals telefone3 = new TelefoneValorEquals("21", "999999999");

        System.out.println("telefone1 == telefone2: " + (telefone1 == telefone2));
        System.out.println("telefone1.equals(telefone2): " + telefone1.equals(telefone2));
        System.out.println("telefone1.equals(telefone3): " + telefone1.equals(telefone3));

        System.out.println("hash telefone1: " + telefone1.hashCode());
        System.out.println("hash telefone2: " + telefone2.hashCode());
        System.out.println("hash telefone3: " + telefone3.hashCode());
    }
}

class TelefoneValorEquals {
    private final String ddd;
    private final String numero;

    TelefoneValorEquals(String ddd, String numero) {
        if (!textoInformado(ddd) || ddd.length() != 2 || !apenasDigitos(ddd)) {
            throw new IllegalArgumentException("DDD inválido.");
        }

        if (!textoInformado(numero) || numero.length() < 8 || numero.length() > 9 || !apenasDigitos(numero)) {
            throw new IllegalArgumentException("Número inválido.");
        }

        this.ddd = ddd;
        this.numero = numero;
    }

    String ddd() {
        return ddd;
    }

    String numero() {
        return numero;
    }

    String formatado() {
        return "(" + ddd + ") " + numero;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        TelefoneValorEquals telefone = (TelefoneValorEquals) outro;
        return Objects.equals(ddd, telefone.ddd)
                && Objects.equals(numero, telefone.numero);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ddd, numero);
    }

    @Override
    public String toString() {
        return formatado();
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    private boolean apenasDigitos(String valor) {
        for (int i = 0; i < valor.length(); i++) {
            if (!Character.isDigit(valor.charAt(i))) {
                return false;
            }
        }

        return true;
    }
}
```

Compile e execute:

```powershell
javac TelefoneComEquals.java
java TelefoneComEquals
```

---

## equals em entidade

Agora vem uma parte importante.

Objeto de valor costuma comparar todos os atributos relevantes.

Entidade costuma comparar identidade.

Exemplo:

```text
Cliente id 10
```

Se duas instâncias possuem o mesmo id, elas podem representar a mesma entidade.

Mesmo que outros dados estejam diferentes.

Exemplo:

```text
Cliente id 10 | nome Ana Silva | email antigo
Cliente id 10 | nome Ana Silva | email novo
```

Podem representar a mesma entidade em momentos diferentes.

Então, para entidade, `equals` normalmente se baseia na identidade.

---

## Exemplo: entidade Cliente com equals por id

Crie:

```text
ClienteEntidadeComEquals.java
```

Código:

```java
import java.util.Objects;

public class ClienteEntidadeComEquals {
    public static void main(String[] args) {
        ClienteEquals cliente1 = new ClienteEquals(
                10,
                "Ana Silva",
                new EmailClienteEquals("ana@email.com")
        );

        ClienteEquals cliente2 = new ClienteEquals(
                10,
                "Ana Silva",
                new EmailClienteEquals("ana.novo@email.com")
        );

        ClienteEquals cliente3 = new ClienteEquals(
                25,
                "Ana Silva",
                new EmailClienteEquals("ana@email.com")
        );

        System.out.println("cliente1 == cliente2: " + (cliente1 == cliente2));
        System.out.println("cliente1.equals(cliente2): " + cliente1.equals(cliente2));
        System.out.println("cliente1.equals(cliente3): " + cliente1.equals(cliente3));

        System.out.println("hash cliente1: " + cliente1.hashCode());
        System.out.println("hash cliente2: " + cliente2.hashCode());
        System.out.println("hash cliente3: " + cliente3.hashCode());
    }
}

class ClienteEquals {
    private final int id;
    private final String nome;
    private EmailClienteEquals email;

    ClienteEquals(int id, String nome, EmailClienteEquals email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    int id() {
        return id;
    }

    String nome() {
        return nome;
    }

    EmailClienteEquals email() {
        return email;
    }

    void alterarEmail(EmailClienteEquals novoEmail) {
        if (novoEmail == null) {
            throw new IllegalArgumentException("Novo e-mail é obrigatório.");
        }

        email = novoEmail;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        ClienteEquals cliente = (ClienteEquals) outro;
        return id == cliente.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

class EmailClienteEquals {
    private final String valor;

    EmailClienteEquals(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailClienteEquals email = (EmailClienteEquals) outro;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac ClienteEntidadeComEquals.java
java ClienteEntidadeComEquals
```

---

## O que observar

`cliente1` e `cliente2` têm o mesmo id:

```text
10
```

Mas e-mails diferentes:

```text
ana@email.com
ana.novo@email.com
```

Mesmo assim:

```java
cliente1.equals(cliente2)
```

retorna:

```text
true
```

Porque, neste modelo, a igualdade da entidade é definida pelo id.

`cliente3` tem id diferente:

```text
25
```

Então:

```java
cliente1.equals(cliente3)
```

retorna:

```text
false
```

Essa é a diferença entre comparação de entidade e comparação de objeto de valor.

---

## Cuidado com entidade sem id

Em sistemas com banco de dados, muitas vezes o id é gerado apenas depois de salvar.

Exemplo:

```text
Produto novo ainda não salvo: id null
Produto salvo: id 10
```

Comparar entidades sem id exige cuidado.

Se você usar id nulo em `equals`, pode considerar duas entidades novas como iguais por engano.

Nesta fase do curso, estamos usando id obrigatório para simplificar.

Mais adiante, quando entrarmos em banco, JPA e entidades persistidas, vamos revisar esse assunto com mais profundidade.

Por enquanto, guarde:

```text
equals de entidade por id é comum;
entidade sem id exige critério;
não copie regra cegamente sem entender o ciclo de vida.
```

---

## equals e HashSet

Agora vamos ver por que `hashCode` importa.

`HashSet` é uma coleção que não guarda elementos duplicados, considerando `equals` e `hashCode`.

Crie:

```text
HashSetComEquals.java
```

Código:

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class HashSetComEquals {
    public static void main(String[] args) {
        Set<EmailHashSet> emails = new HashSet<>();

        emails.add(new EmailHashSet("ana@email.com"));
        emails.add(new EmailHashSet("ana@email.com"));
        emails.add(new EmailHashSet("carlos@email.com"));

        System.out.println("Quantidade de e-mails no set: " + emails.size());

        for (EmailHashSet email : emails) {
            System.out.println(email.valor());
        }
    }
}

class EmailHashSet {
    private final String valor;

    EmailHashSet(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailHashSet email = (EmailHashSet) outro;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
}
```

Compile e execute:

```powershell
javac HashSetComEquals.java
java HashSetComEquals
```

Mesmo adicionando `ana@email.com` duas vezes, o `HashSet` mantém apenas uma ocorrência.

Porque `equals` e `hashCode` indicam que os dois objetos são equivalentes.

---

## HashSet sem equals e hashCode

Agora veja o problema quando não implementamos.

Crie:

```text
HashSetSemEquals.java
```

Código:

```java
import java.util.HashSet;
import java.util.Set;

public class HashSetSemEquals {
    public static void main(String[] args) {
        Set<EmailSemEqualsHash> emails = new HashSet<>();

        emails.add(new EmailSemEqualsHash("ana@email.com"));
        emails.add(new EmailSemEqualsHash("ana@email.com"));
        emails.add(new EmailSemEqualsHash("carlos@email.com"));

        System.out.println("Quantidade de e-mails no set: " + emails.size());

        for (EmailSemEqualsHash email : emails) {
            System.out.println(email.valor());
        }
    }
}

class EmailSemEqualsHash {
    private final String valor;

    EmailSemEqualsHash(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac HashSetSemEquals.java
java HashSetSemEquals
```

Você provavelmente verá três itens.

Por quê?

Porque, sem `equals` e `hashCode`, o Java trata cada instância como diferente.

Mesmo que o valor interno seja igual.

---

## HashMap e chaves

`HashMap` também depende de `equals` e `hashCode` para chaves.

Exemplo:

```text
Map<Email, Cliente>
```

Se `Email` não implementa `equals` e `hashCode`, buscar com outro objeto `Email` de mesmo valor pode falhar.

Crie:

```text
HashMapComEquals.java
```

Código:

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class HashMapComEquals {
    public static void main(String[] args) {
        Map<EmailMapa, String> clientesPorEmail = new HashMap<>();

        clientesPorEmail.put(new EmailMapa("ana@email.com"), "Ana Silva");

        String clienteEncontrado = clientesPorEmail.get(new EmailMapa("ana@email.com"));

        System.out.println("Cliente encontrado: " + clienteEncontrado);
    }
}

class EmailMapa {
    private final String valor;

    EmailMapa(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailMapa email = (EmailMapa) outro;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
}
```

Compile e execute:

```powershell
javac HashMapComEquals.java
java HashMapComEquals
```

Esse exemplo é muito importante.

Você salvou usando um objeto:

```java
new EmailMapa("ana@email.com")
```

E buscou usando outro objeto:

```java
new EmailMapa("ana@email.com")
```

Mesmo assim funcionou, porque `equals` e `hashCode` foram implementados corretamente.

---

## Record e equals/hashCode

Você já viu `record`.

Uma vantagem do `record` é que ele gera automaticamente:

```text
equals;
hashCode;
toString;
accessors;
construtor.
```

Crie:

```text
RecordEqualsHashCode.java
```

Código:

```java
public class RecordEqualsHashCode {
    public static void main(String[] args) {
        CodigoPedidoRecord codigo1 = new CodigoPedidoRecord("PED-1001");
        CodigoPedidoRecord codigo2 = new CodigoPedidoRecord("PED-1001");
        CodigoPedidoRecord codigo3 = new CodigoPedidoRecord("PED-2002");

        System.out.println("codigo1 == codigo2: " + (codigo1 == codigo2));
        System.out.println("codigo1.equals(codigo2): " + codigo1.equals(codigo2));
        System.out.println("codigo1.equals(codigo3): " + codigo1.equals(codigo3));
        System.out.println("hash codigo1: " + codigo1.hashCode());
        System.out.println("hash codigo2: " + codigo2.hashCode());
        System.out.println("toString: " + codigo1);
    }
}

record CodigoPedidoRecord(String valor) {
    CodigoPedidoRecord {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("PED-")) {
            throw new IllegalArgumentException("Código deve iniciar com PED-.");
        }
    }
}
```

Compile e execute:

```powershell
javac RecordEqualsHashCode.java
java RecordEqualsHashCode
```

Para objetos de valor simples, `record` pode ser muito útil.

Mas lembre:

```text
record compara todos os componentes.
```

Para entidades, nem sempre isso é o que você quer.

Uma entidade geralmente compara identidade, não todos os campos.

---

## getClass versus instanceof

Nos exemplos, usamos:

```java
getClass() != outro.getClass()
```

Você também verá implementações usando `instanceof`.

Exemplo:

```java
if (!(outro instanceof EmailValorEquals email)) {
    return false;
}
```

Os dois estilos existem.

Nesta fase, usamos `getClass()` para deixar a comparação mais direta:

```text
só é igual se for exatamente da mesma classe.
```

Em cenários com herança, esse assunto exige mais cuidado.

Como ainda vamos estudar herança depois, manteremos `getClass()` nos exemplos desta aula.

---

## Regras práticas

Para objeto de valor:

```text
equals usa os atributos que definem o valor;
hashCode usa os mesmos atributos;
objeto tende a ser imutável;
record pode ajudar.
```

Para entidade:

```text
equals costuma usar identidade;
hashCode usa a mesma identidade;
cuidado com entidade sem id;
não compare todos os campos se eles mudam durante o ciclo de vida.
```

Para qualquer classe:

```text
se sobrescrever equals, sobrescreva hashCode;
use @Override;
use Objects.equals;
use Objects.hash;
evite campos mutáveis dentro de hashCode quando possível.
```

---

## Campo mutável no hashCode

Cuidado.

Se você usa um campo mutável em `hashCode`, e esse campo muda depois que o objeto entra em um `HashSet`, pode causar comportamento estranho.

Exemplo conceitual:

```java
Set<Cliente> clientes = new HashSet<>();
clientes.add(cliente);

cliente.alterarEmail(...);
```

Se `hashCode` usa email, o hash muda.

O `HashSet` pode não encontrar mais o objeto corretamente.

Por isso, para entidades, é comum basear `equals` e `hashCode` em identidade estável.

Esse ponto será aprofundado quando estudarmos coleções, JPA e persistência.

Por enquanto, guarde:

```text
hashCode deve usar dados estáveis sempre que possível.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparação sem equals

Execute:

```text
ComparacaoComIgualIgual.java
```

Explique:

```text
por que == retornou false;
por que equals também retornou false.
```

### Parte 2 — Email com equals

Execute:

```text
EmailComEquals.java
```

Teste:

```text
mesmo e-mail com maiúsculas;
e-mails diferentes;
hashCode dos objetos iguais.
```

### Parte 3 — Telefone

Execute:

```text
TelefoneComEquals.java
```

Explique:

```text
quais campos definem a igualdade;
por que ddd e número entram no hashCode.
```

### Parte 4 — Entidade Cliente

Execute:

```text
ClienteEntidadeComEquals.java
```

Explique:

```text
por que cliente1 e cliente2 são iguais;
por que cliente1 e cliente3 são diferentes;
por que o e-mail não foi usado no equals da entidade.
```

### Parte 5 — HashSet

Execute:

```text
HashSetComEquals.java
HashSetSemEquals.java
```

Compare a quantidade de itens.

### Parte 6 — HashMap

Execute:

```text
HashMapComEquals.java
```

Explique por que a busca funcionou mesmo usando outro objeto como chave.

### Parte 7 — Record

Execute:

```text
RecordEqualsHashCode.java
```

Observe o `equals`, `hashCode` e `toString` automáticos.

---

## Desafio prático

Crie o arquivo:

```text
EqualsHashCodeProduto.java
```

Modele:

```text
CodigoProdutoEquals;
ProdutoEquals;
```

`CodigoProdutoEquals` deve ser um objeto de valor.

Regras:

```text
código obrigatório;
código deve iniciar com PROD-;
equals compara o valor do código;
hashCode usa o valor do código.
```

`ProdutoEquals` deve ser uma entidade.

Atributos:

```text
codigo;
nome;
preco;
status.
```

Use:

```java
BigDecimal;
enum StatusProdutoEquals;
```

Regras:

```text
Produto é identificado pelo código.
Dois produtos com o mesmo código representam a mesma entidade.
equals de Produto deve usar somente o código.
hashCode de Produto deve usar somente o código.
```

No `main`, crie:

```text
produto1 com código PROD-001 e nome Cadeira;
produto2 com código PROD-001 e nome Cadeira Escritório;
produto3 com código PROD-002 e nome Mesa.
```

Mostre:

```text
produto1 == produto2;
produto1.equals(produto2);
produto1.equals(produto3);
hashCode de cada um.
```

Depois crie um `HashSet<ProdutoEquals>` e adicione os três.

Mostre a quantidade final.

Resultado esperado:

```text
produto1 e produto2 devem ser considerados iguais pela identidade.
HashSet deve manter apenas dois produtos.
```

---

## Erros comuns

### 1. Sobrescrever equals e esquecer hashCode

Isso quebra coleções baseadas em hash.

### 2. Usar == para comparar objetos

`==` compara referência.

### 3. Comparar entidade por todos os campos

Entidade geralmente deve ser comparada por identidade.

### 4. Comparar objeto de valor por referência

Objeto de valor geralmente deve ser comparado pelos valores internos.

### 5. Usar campo mutável no hashCode

Pode causar problemas em `HashSet` e `HashMap`.

### 6. Esquecer @Override

Sem `@Override`, você pode errar a assinatura e não perceber.

### 7. Criar equals com tipo específico

A assinatura correta é:

```java
public boolean equals(Object outro)
```

### 8. Usar record para entidade sem pensar

`record` compara todos os componentes. Entidade normalmente compara identidade.

---

## Debug recomendado

Use debug em:

```text
EmailComEquals.java
ClienteEntidadeComEquals.java
HashSetComEquals.java
HashMapComEquals.java
```

Breakpoints recomendados:

```java
email1.equals(email2)
cliente1.equals(cliente2)
emails.add(...)
clientesPorEmail.get(...)
```

Entre nos métodos:

```text
equals;
hashCode.
```

Observe:

```text
quando this == outro;
quando a classe é comparada;
quando o cast acontece;
quais atributos são usados na comparação;
quando hashCode é chamado pelas coleções.
```

No `HashSet`, observe que `add` pode chamar `hashCode` e `equals` para decidir se o elemento já existe.

No `HashMap`, observe que `get` precisa localizar a chave usando hash e igualdade.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que equals e hashCode devem ser implementados juntos?
2. Qual diferença entre equals de objeto de valor e equals de entidade?
3. Por que usar campo mutável no hashCode pode ser perigoso?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar equals;
explicar hashCode;
entender o contrato entre eles;
usar @Override;
usar Objects.equals;
usar Objects.hash;
comparar objeto de valor por valor;
comparar entidade por identidade;
entender por que == não compara conteúdo;
entender impacto em HashSet;
entender impacto em HashMap;
usar record sabendo que ele gera equals e hashCode;
evitar campo mutável em hashCode;
resolver o desafio EqualsHashCodeProduto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-119-equals-hashcode
git commit -m "Aula 119: pratica equals e hashCode"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
equals define igualdade lógica; hashCode permite que essa igualdade funcione corretamente em estruturas baseadas em hash.
```

Você viu que:

```text
== compara referência;
equals pode comparar valor ou identidade;
hashCode deve acompanhar equals;
objetos de valor geralmente comparam atributos;
entidades geralmente comparam identidade;
HashSet e HashMap dependem disso.
```

Esse assunto é uma das bases de Java profissional.

Na próxima aula, vamos estudar `toString` com critério.

Vamos entender como representar objetos em texto para debug, logs e leitura sem vazar informação sensível e sem transformar `toString` em regra de negócio.
