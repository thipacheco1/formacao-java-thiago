# 081 — M2.20 — Reflection conceitual

## A pergunta central da aula

Normalmente, quando você usa um objeto, você já conhece seu tipo:

```java
Cliente cliente = new Cliente("Ana", "ana@email.com");

System.out.println(cliente.nome());
```

Mas imagine que uma ferramenta ou framework precise responder perguntas como:

```text
qual é o nome desta classe?
quais campos esta classe possui?
quais métodos esta classe possui?
quais annotations existem nesta classe?
existe um construtor sem argumentos?
qual método está marcado com determinada annotation?
qual campo está marcado como obrigatório?
```

Esse tipo de inspeção é feito com reflection.

Exemplo:

```java
Class<Cliente> classe = Cliente.class;

System.out.println(classe.getSimpleName());
```

Saída:

```text
Cliente
```

Reflection permite olhar para a estrutura do código em tempo de execução.

---

## O que é reflection

Reflection é um recurso do Java que permite inspecionar e, em alguns casos, manipular informações sobre classes, métodos, campos e construtores em tempo de execução.

Com reflection, é possível acessar:

```text
nome da classe;
pacote;
modificadores;
campos;
métodos;
construtores;
interfaces;
superclasse;
annotations;
tipos de parâmetros;
tipo de retorno.
```

Também é possível fazer coisas mais avançadas, como:

```text
criar objeto via construtor;
invocar método;
ler valor de campo;
alterar acessibilidade;
mapear dados dinamicamente.
```

Mas essas operações exigem cuidado.

Nesta aula, vamos começar com leitura e entendimento.

---

## Reflection não é para usar em tudo

Reflection é poderosa, mas tem custo e risco.

Ela pode:

```text
reduzir legibilidade;
quebrar encapsulamento;
gerar erro só em runtime;
dificultar refatoração;
ser mais lenta que chamada direta;
exigir tratamento de exceções;
criar comportamento “mágico” demais;
expor detalhes internos.
```

Por isso, em código de regra de negócio comum, normalmente não usamos reflection diretamente.

Mas precisamos entender porque frameworks usam muito.

Regra inicial:

```text
use chamada direta quando você conhece o tipo;
use reflection quando precisa escrever código genérico que trabalha com metadados.
```

---

## Onde reflection aparece no mundo real

Reflection aparece por trás de:

```text
Spring;
JPA/Hibernate;
Jackson;
JUnit;
Mockito;
Bean Validation;
frameworks de DI;
frameworks de serialização;
mapeadores;
documentadores de API;
ferramentas de teste;
ORMs;
containers;
scanners de annotations.
```

Exemplos conceituais:

```text
Spring lê @Service e cria beans;
JPA lê @Entity e mapeia tabela;
Jackson lê campos/getters e monta JSON;
JUnit encontra métodos @Test;
Bean Validation lê @NotBlank e valida campos.
```

Você talvez não escreva reflection todo dia.

Mas entender reflection ajuda a entender como frameworks funcionam.

---

## Vocabulário essencial

Termos desta aula:

```text
reflection;
runtime;
Class;
Field;
Method;
Constructor;
annotation;
metadata;
getDeclaredFields;
getFields;
getDeclaredMethods;
getMethods;
getDeclaredConstructors;
getConstructors;
getAnnotation;
isAnnotationPresent;
getName;
getSimpleName;
getPackageName;
invoke;
newInstance;
setAccessible;
modifiers;
private;
public;
framework;
scanner;
runtime exception;
checked exception;
encapsulation.
```

Termos mais importantes:

```text
Class -> objeto que representa a estrutura de uma classe em runtime;
Field -> representa um campo;
Method -> representa um método;
Constructor -> representa um construtor;
getDeclaredFields -> campos declarados na própria classe;
getFields -> campos públicos acessíveis;
getDeclaredMethods -> métodos declarados na própria classe;
getMethods -> métodos públicos acessíveis, incluindo herdados;
getAnnotation -> lê annotation específica;
invoke -> invoca método via reflection;
setAccessible -> tenta liberar acesso a membro não público;
runtime -> tempo de execução.
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
        Class<Cliente> classe = Cliente.class;

        System.out.println("Nome completo: " + classe.getName());
        System.out.println("Nome simples: " + classe.getSimpleName());
        System.out.println("Pacote: " + classe.getPackageName());
    }
}

class Cliente {
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

Saída aproximada:

```text
Nome completo: Cliente
Nome simples: Cliente
Pacote:
```

Como a classe está sem pacote neste exemplo, o pacote pode aparecer vazio.

Em projeto real, com pacote:

```java
package br.com.exemplo;
```

o nome completo teria o pacote.

---

## Três formas de obter Class

Existem formas diferentes de obter o objeto `Class`.

### 1. Usando `.class`

```java
Class<Cliente> classe = Cliente.class;
```

### 2. Usando objeto existente

```java
Cliente cliente = new Cliente();
Class<?> classe = cliente.getClass();
```

### 3. Usando nome da classe

```java
Class<?> classe = Class.forName("Cliente");
```

A terceira forma pode lançar exceção se a classe não for encontrada.

---

## Exemplo com getClass

Arquivo:

```text
ClassComObjeto.java
```

Código:

```java
public class ClassComObjeto {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana");

        Class<?> classe = cliente.getClass();

        System.out.println(classe.getSimpleName());
    }
}

class Cliente {
    private final String nome;

    Cliente(String nome) {
        this.nome = nome;
    }
}
```

Saída:

```text
Cliente
```

Aqui pegamos a classe a partir de um objeto real.

---

## Exemplo com Class.forName

Arquivo:

```text
ClassForNameExemplo.java
```

Código:

```java
public class ClassForNameExemplo {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> classe = Class.forName("ClienteForName");

        System.out.println(classe.getSimpleName());
    }
}

class ClienteForName {
}
```

Compile:

```powershell
javac ClassForNameExemplo.java
```

Execute:

```powershell
java ClassForNameExemplo
```

Saída:

```text
ClienteForName
```

Em projetos com pacote, o nome precisa ser completo:

```text
br.com.exemplo.Cliente
```

---

## Lendo campos

Para ler campos declarados na classe, usamos:

```java
getDeclaredFields()
```

Arquivo:

```text
LerCampos.java
```

Código:

```java
import java.lang.reflect.Field;

public class LerCampos {
    public static void main(String[] args) {
        Class<Cliente> classe = Cliente.class;

        Field[] campos = classe.getDeclaredFields();

        for (Field campo : campos) {
            System.out.println(campo.getName() + " | " + campo.getType().getSimpleName());
        }
    }
}

class Cliente {
    private String nome;
    private String email;
    private int idade;
}
```

Saída:

```text
nome | String
email | String
idade | int
```

Esse exemplo mostra inspeção estrutural.

Não estamos lendo valores de um objeto ainda.

---

## getDeclaredFields versus getFields

Diferença importante:

```java
getDeclaredFields()
```

retorna campos declarados na própria classe, incluindo privados.

```java
getFields()
```

retorna campos públicos acessíveis, incluindo herdados.

Na maioria dos exemplos de inspeção interna, você verá `getDeclaredFields`.

Mas isso não significa que você deve sair acessando tudo.

Leitura de metadados é diferente de quebrar encapsulamento.

---

## Lendo métodos

Arquivo:

```text
LerMetodos.java
```

Código:

```java
import java.lang.reflect.Method;

public class LerMetodos {
    public static void main(String[] args) {
        Class<Cliente> classe = Cliente.class;

        Method[] metodos = classe.getDeclaredMethods();

        for (Method metodo : metodos) {
            System.out.println(metodo.getName() + " -> " + metodo.getReturnType().getSimpleName());
        }
    }
}

class Cliente {
    private String nome;

    public String getNome() {
        return nome;
    }

    public void atualizarNome(String nome) {
        this.nome = nome;
    }

    private boolean nomeValido() {
        return nome != null && !nome.isBlank();
    }
}
```

Saída aproximada:

```text
getNome -> String
atualizarNome -> void
nomeValido -> boolean
```

A ordem pode variar.

Não dependa da ordem retornada por reflection.

---

## Lendo parâmetros dos métodos

Arquivo:

```text
LerParametrosMetodo.java
```

Código:

```java
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

public class LerParametrosMetodo {
    public static void main(String[] args) {
        Class<Cliente> classe = Cliente.class;

        for (Method metodo : classe.getDeclaredMethods()) {
            System.out.println("Método: " + metodo.getName());

            for (Parameter parametro : metodo.getParameters()) {
                System.out.println("  Parâmetro: " + parametro.getType().getSimpleName());
            }
        }
    }
}

class Cliente {
    public void atualizarNome(String nome) {
    }

    public void atualizarContato(String email, String telefone) {
    }
}
```

Saída aproximada:

```text
Método: atualizarNome
  Parâmetro: String
Método: atualizarContato
  Parâmetro: String
  Parâmetro: String
```

Os nomes reais dos parâmetros podem depender de configuração de compilação.

Os tipos são confiáveis.

---

## Lendo construtores

Arquivo:

```text
LerConstrutores.java
```

Código:

```java
import java.lang.reflect.Constructor;

public class LerConstrutores {
    public static void main(String[] args) {
        Class<Cliente> classe = Cliente.class;

        Constructor<?>[] construtores = classe.getDeclaredConstructors();

        for (Constructor<?> construtor : construtores) {
            System.out.println("Construtor com " + construtor.getParameterCount() + " parâmetros.");
        }
    }
}

class Cliente {
    Cliente() {
    }

    Cliente(String nome) {
    }

    Cliente(String nome, String email) {
    }
}
```

Saída esperada:

```text
Construtor com 0 parâmetros.
Construtor com 1 parâmetros.
Construtor com 2 parâmetros.
```

A ordem pode variar.

---

## Lendo annotations da classe

Arquivo:

```text
Tabela.java
```

Código:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Tabela {
    String nome();
}
```

Arquivo:

```text
ClienteTabela.java
```

Código:

```java
@Tabela(nome = "clientes")
public class ClienteTabela {
}
```

Arquivo:

```text
LerAnnotationClasse.java
```

Código:

```java
public class LerAnnotationClasse {
    public static void main(String[] args) {
        Class<ClienteTabela> classe = ClienteTabela.class;

        Tabela tabela = classe.getAnnotation(Tabela.class);

        if (tabela == null) {
            System.out.println("Sem annotation Tabela.");
        } else {
            System.out.println("Tabela: " + tabela.nome());
        }
    }
}
```

Compile:

```powershell
javac Tabela.java ClienteTabela.java LerAnnotationClasse.java
```

Execute:

```powershell
java LerAnnotationClasse
```

Saída:

```text
Tabela: clientes
```

---

## isAnnotationPresent

Outra forma de verificar annotation:

```java
classe.isAnnotationPresent(Tabela.class)
```

Arquivo:

```text
IsAnnotationPresentExemplo.java
```

Código:

```java
public class IsAnnotationPresentExemplo {
    public static void main(String[] args) {
        Class<ClienteTabela> classe = ClienteTabela.class;

        if (classe.isAnnotationPresent(Tabela.class)) {
            System.out.println("Classe possui @Tabela.");
        } else {
            System.out.println("Classe não possui @Tabela.");
        }
    }
}
```

Compile:

```powershell
javac Tabela.java ClienteTabela.java IsAnnotationPresentExemplo.java
```

Execute:

```powershell
java IsAnnotationPresentExemplo
```

Saída:

```text
Classe possui @Tabela.
```

---

## Lendo annotations em campos

Arquivo:

```text
CampoObrigatorio.java
```

Código:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface CampoObrigatorio {
    String mensagem() default "Campo obrigatório.";
}
```

Arquivo:

```text
ClienteCamposObrigatorios.java
```

Código:

```java
public class ClienteCamposObrigatorios {
    @CampoObrigatorio(mensagem = "Nome é obrigatório.")
    private String nome;

    @CampoObrigatorio(mensagem = "E-mail é obrigatório.")
    private String email;

    private String telefone;
}
```

Arquivo:

```text
LerAnnotationCampo.java
```

Código:

```java
import java.lang.reflect.Field;

public class LerAnnotationCampo {
    public static void main(String[] args) {
        Class<ClienteCamposObrigatorios> classe = ClienteCamposObrigatorios.class;

        for (Field campo : classe.getDeclaredFields()) {
            CampoObrigatorio obrigatorio = campo.getAnnotation(CampoObrigatorio.class);

            if (obrigatorio != null) {
                System.out.println(campo.getName() + " -> " + obrigatorio.mensagem());
            }
        }
    }
}
```

Compile:

```powershell
javac CampoObrigatorio.java ClienteCamposObrigatorios.java LerAnnotationCampo.java
```

Execute:

```powershell
java LerAnnotationCampo
```

Saída:

```text
nome -> Nome é obrigatório.
email -> E-mail é obrigatório.
```

---

## Validador simples com reflection

Agora vamos criar um validador didático.

Ele vai:

```text
receber um objeto;
percorrer campos;
verificar campos anotados com @CampoObrigatorio;
ler valor do campo;
validar null e String em branco.
```

Atenção:

```text
isso é didático;
frameworks reais fazem isso com muito mais cuidado.
```

Arquivo:

```text
ValidadorObrigatorio.java
```

Código:

```java
import java.lang.reflect.Field;

public class ValidadorObrigatorio {
    public static void validar(Object objeto) {
        if (objeto == null) {
            throw new IllegalArgumentException("Objeto é obrigatório.");
        }

        Class<?> classe = objeto.getClass();

        for (Field campo : classe.getDeclaredFields()) {
            CampoObrigatorio annotation = campo.getAnnotation(CampoObrigatorio.class);

            if (annotation != null) {
                validarCampo(objeto, campo, annotation);
            }
        }
    }

    private static void validarCampo(Object objeto, Field campo, CampoObrigatorio annotation) {
        try {
            campo.setAccessible(true);

            Object valor = campo.get(objeto);

            if (valor == null) {
                throw new IllegalArgumentException(annotation.mensagem());
            }

            if (valor instanceof String texto && texto.isBlank()) {
                throw new IllegalArgumentException(annotation.mensagem());
            }
        } catch (IllegalAccessException erro) {
            throw new IllegalStateException("Não foi possível acessar o campo: " + campo.getName(), erro);
        }
    }
}
```

Esse exemplo usa:

```java
setAccessible(true)
```

com objetivo didático.

Em código real, isso exige cuidado.

---

## Usando o validador simples

Arquivo:

```text
ClienteValidavel.java
```

Código:

```java
public class ClienteValidavel {
    @CampoObrigatorio(mensagem = "Nome é obrigatório.")
    private final String nome;

    @CampoObrigatorio(mensagem = "E-mail é obrigatório.")
    private final String email;

    public ClienteValidavel(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}
```

Arquivo:

```text
ExecutarValidador.java
```

Código:

```java
public class ExecutarValidador {
    public static void main(String[] args) {
        ClienteValidavel cliente = new ClienteValidavel("Ana", "ana@email.com");

        ValidadorObrigatorio.validar(cliente);

        System.out.println("Cliente válido.");
    }
}
```

Compile:

```powershell
javac CampoObrigatorio.java ValidadorObrigatorio.java ClienteValidavel.java ExecutarValidador.java
```

Execute:

```powershell
java ExecutarValidador
```

Saída:

```text
Cliente válido.
```

Agora teste:

```java
ClienteValidavel cliente = new ClienteValidavel("", "ana@email.com");
```

Deve lançar erro:

```text
Nome é obrigatório.
```

---

## Criando objeto via reflection

Também é possível criar objeto usando construtor via reflection.

Arquivo:

```text
CriarObjetoReflection.java
```

Código:

```java
import java.lang.reflect.Constructor;

public class CriarObjetoReflection {
    public static void main(String[] args) throws Exception {
        Class<Cliente> classe = Cliente.class;

        Constructor<Cliente> construtor = classe.getDeclaredConstructor(String.class, String.class);

        Cliente cliente = construtor.newInstance("Ana", "ana@email.com");

        System.out.println(cliente);
    }
}

class Cliente {
    private final String nome;
    private final String email;

    Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    @Override
    public String toString() {
        return "Cliente{nome='" + nome + "', email='" + email + "'}";
    }
}
```

Saída:

```text
Cliente{nome='Ana', email='ana@email.com'}
```

Frameworks usam ideias parecidas para criar objetos dinamicamente.

---

## Invocando método via reflection

Arquivo:

```text
InvocarMetodoReflection.java
```

Código:

```java
import java.lang.reflect.Method;

public class InvocarMetodoReflection {
    public static void main(String[] args) throws Exception {
        Cliente cliente = new Cliente("Ana");

        Method metodo = Cliente.class.getDeclaredMethod("saudacao");

        Object resultado = metodo.invoke(cliente);

        System.out.println(resultado);
    }
}

class Cliente {
    private final String nome;

    Cliente(String nome) {
        this.nome = nome;
    }

    public String saudacao() {
        return "Olá, " + nome;
    }
}
```

Saída:

```text
Olá, Ana
```

Chamada direta seria mais simples:

```java
cliente.saudacao()
```

A reflexão só faz sentido quando o método a chamar é descoberto dinamicamente.

---

## Lendo valor de campo

Arquivo:

```text
LerValorCampo.java
```

Código:

```java
import java.lang.reflect.Field;

public class LerValorCampo {
    public static void main(String[] args) throws Exception {
        Cliente cliente = new Cliente("Ana", "ana@email.com");

        Field campoNome = Cliente.class.getDeclaredField("nome");

        campoNome.setAccessible(true);

        Object valor = campoNome.get(cliente);

        System.out.println(valor);
    }
}

class Cliente {
    private final String nome;
    private final String email;

    Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}
```

Saída:

```text
Ana
```

Atenção:

```text
isso quebra encapsulamento.
```

Use apenas quando houver motivo técnico real.

---

## setAccessible

`setAccessible(true)` tenta permitir acesso a membros não públicos.

Exemplo:

```java
campo.setAccessible(true);
```

Isso pode ser necessário para frameworks.

Mas tem riscos:

```text
quebra encapsulamento;
pode falhar por regras de módulo/segurança;
dificulta manutenção;
acessa detalhes internos;
pode ser bloqueado em ambientes específicos.
```

Regra profissional:

```text
evite setAccessible em regra de negócio comum.
```

Use apenas em ferramentas, frameworks ou integrações muito justificadas.

---

## Exceções comuns em reflection

Reflection pode lançar várias exceções.

Exemplos:

```text
ClassNotFoundException;
NoSuchMethodException;
NoSuchFieldException;
IllegalAccessException;
InvocationTargetException;
InstantiationException;
SecurityException.
```

Isso mostra que reflection é mais frágil que chamada direta.

Chamada direta:

```java
cliente.saudacao();
```

Se o método não existe, o código nem compila.

Reflection:

```java
getDeclaredMethod("saudacao")
```

Se escrever o nome errado, o erro aparece em runtime.

---

## Reflection e strings mágicas

Reflection muitas vezes usa nomes como String:

```java
getDeclaredField("nome")
getDeclaredMethod("saudacao")
Class.forName("Cliente")
```

Isso pode gerar problema parecido com strings mágicas.

Se renomear o campo `nome` para `nomeCompleto`, este código quebra em runtime:

```java
getDeclaredField("nome")
```

Por isso, reflection exige testes e cuidado.

---

## Aplicação em cliente

Arquivo:

```text
ClienteReflection.java
```

Código:

```java
import java.lang.reflect.Field;

public class ClienteReflection {
    public static void main(String[] args) {
        imprimirCampos(Cliente.class);
    }

    public static void imprimirCampos(Class<?> classe) {
        System.out.println("Classe: " + classe.getSimpleName());

        for (Field campo : classe.getDeclaredFields()) {
            System.out.println(campo.getName() + " -> " + campo.getType().getSimpleName());
        }
    }
}

class Cliente {
    private String nome;
    private String email;
    private String telefone;
}
```

Uso:

```text
inspecionar estrutura de cliente.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoReflection.java
```

Código:

```java
import java.lang.reflect.Field;
import java.math.BigDecimal;

public class ProdutoReflection {
    public static void main(String[] args) {
        imprimirCampos(Produto.class);
    }

    public static void imprimirCampos(Class<?> classe) {
        for (Field campo : classe.getDeclaredFields()) {
            System.out.println(campo.getName() + " | " + campo.getType().getSimpleName());
        }
    }
}

class Produto {
    private String nome;
    private BigDecimal preco;
    private StatusProduto status;
}

enum StatusProduto {
    ATIVO,
    INATIVO
}
```

Saída aproximada:

```text
nome | String
preco | BigDecimal
status | StatusProduto
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoReflection.java
```

Código:

```java
import java.lang.reflect.Method;
import java.math.BigDecimal;

public class PedidoReflection {
    public static void main(String[] args) {
        imprimirMetodos(PedidoResumo.class);
    }

    public static void imprimirMetodos(Class<?> classe) {
        for (Method metodo : classe.getDeclaredMethods()) {
            System.out.println(metodo.getName() + " -> " + metodo.getReturnType().getSimpleName());
        }
    }
}

record PedidoResumo(String cliente, BigDecimal total, StatusPedido status) {
    public boolean aprovado() {
        return status == StatusPedido.APROVADO;
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Record também gera métodos.

A saída pode incluir métodos gerados pelo record.

Isso ajuda a perceber que record também é uma classe em runtime.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoReflection.java
```

Código:

```java
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.Instant;

public class PagamentoReflection {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento("PAG-001", new BigDecimal("100.00"), Instant.parse("2026-07-07T13:00:00Z"));

        imprimirValores(pagamento);
    }

    public static void imprimirValores(Object objeto) {
        Class<?> classe = objeto.getClass();

        System.out.println("Classe: " + classe.getSimpleName());

        for (Field campo : classe.getDeclaredFields()) {
            try {
                campo.setAccessible(true);

                System.out.println(campo.getName() + " = " + campo.get(objeto));
            } catch (IllegalAccessException erro) {
                System.out.println("Não foi possível ler: " + campo.getName());
            }
        }
    }
}

class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private final Instant criadoEm;

    Pagamento(String codigo, BigDecimal valor, Instant criadoEm) {
        this.codigo = codigo;
        this.valor = valor;
        this.criadoEm = criadoEm;
    }
}
```

Esse é um exemplo didático de inspeção de valores.

Use com cuidado em produção.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoReflection.java
```

Código:

```java
import java.lang.reflect.Field;
import java.time.LocalDate;

public class OrdemServicoReflection {
    public static void main(String[] args) {
        imprimirCampos(OrdemServico.class);
    }

    public static void imprimirCampos(Class<?> classe) {
        for (Field campo : classe.getDeclaredFields()) {
            System.out.println(campo.getName() + " -> " + campo.getType().getSimpleName());
        }
    }
}

class OrdemServico {
    private String certificado;
    private StatusOs status;
    private LocalDate dataAgendada;
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

---

## Aplicação em mensageria

Arquivo:

```text
CanalMensagem.java
```

Código:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface CanalMensagem {
    String nome();
}
```

Arquivo:

```text
MensagemReflection.java
```

Código:

```java
@CanalMensagem(nome = "whatsapp")
public class MensagemReflection {
    private String cliente;
    private String texto;
}
```

Arquivo:

```text
LeitorCanalReflection.java
```

Código:

```java
public class LeitorCanalReflection {
    public static void main(String[] args) {
        Class<MensagemReflection> classe = MensagemReflection.class;

        CanalMensagem canal = classe.getAnnotation(CanalMensagem.class);

        if (canal == null) {
            System.out.println("Sem canal.");
        } else {
            System.out.println("Canal: " + canal.nome());
        }
    }
}
```

Compile:

```powershell
javac CanalMensagem.java MensagemReflection.java LeitorCanalReflection.java
```

Execute:

```powershell
java LeitorCanalReflection
```

Saída:

```text
Canal: whatsapp
```

---

## Aplicação em auditoria

Arquivo:

```text
Auditavel.java
```

Código:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Auditavel {
    String entidade();
}
```

Arquivo:

```text
ProdutoAuditavel.java
```

Código:

```java
@Auditavel(entidade = "Produto")
public class ProdutoAuditavel {
    private Long id;
    private String nome;
}
```

Arquivo:

```text
LeitorAuditavel.java
```

Código:

```java
public class LeitorAuditavel {
    public static void main(String[] args) {
        Class<ProdutoAuditavel> classe = ProdutoAuditavel.class;

        Auditavel auditavel = classe.getAnnotation(Auditavel.class);

        if (auditavel != null) {
            System.out.println("Entidade auditável: " + auditavel.entidade());
        }
    }
}
```

Compile:

```powershell
javac Auditavel.java ProdutoAuditavel.java LeitorAuditavel.java
```

Execute:

```powershell
java LeitorAuditavel
```

Saída:

```text
Entidade auditável: Produto
```

Esse tipo de ideia aparece em frameworks e ferramentas internas.

---

## Refatoração: reflection desnecessária para chamada direta

Código ruim:

```java
Method metodo = Cliente.class.getDeclaredMethod("getNome");
Object nome = metodo.invoke(cliente);
```

Se você conhece o tipo, prefira:

```java
String nome = cliente.getNome();
```

Reflection aqui é excesso.

Regra:

```text
não use reflection quando chamada direta resolve com clareza.
```

---

## Refatoração: strings mágicas para constantes

Se você precisa usar nomes de campos:

```java
getDeclaredField("nome")
```

considere pelo menos centralizar:

```java
private static final String CAMPO_NOME = "nome";
```

Isso não elimina o risco, mas reduz repetição.

Melhor ainda:

```text
evite depender de nome de campo quando houver API explícita.
```

---

## Refatoração: validador genérico com annotation

Antes:

```java
if (cliente.nome == null || cliente.nome.isBlank()) {
}
if (cliente.email == null || cliente.email.isBlank()) {
}
```

Depois, didaticamente:

```java
@CampoObrigatorio
private String nome;

@CampoObrigatorio
private String email;
```

e um validador que lê os campos.

Isso reduz duplicação, mas cria mecanismo genérico.

Trade-off:

```text
menos código repetido;
mais complexidade;
mais mágica;
mais necessidade de testes.
```

Frameworks assumem essa complexidade para oferecer produtividade.

---

## Quando usar reflection

Use reflection quando:

```text
precisa inspecionar classes genericamente;
precisa ler annotations em runtime;
está criando framework, biblioteca ou ferramenta;
precisa mapear objetos dinamicamente;
precisa integrar com código legado;
precisa criar mecanismo genérico;
não conhece o tipo em tempo de compilação;
há ganho claro que justifique complexidade.
```

Exemplos:

```text
validador genérico;
mapeador objeto/JSON;
scanner de annotations;
executor de testes;
container de injeção de dependência;
ORM.
```

---

## Quando evitar reflection

Evite reflection quando:

```text
chamada direta resolve;
o tipo é conhecido;
a regra fica escondida;
você só quer economizar algumas linhas;
a performance é crítica;
a refatoração pode quebrar nomes em runtime;
o código fica difícil de debugar;
o encapsulamento é quebrado sem necessidade;
a equipe não entende o mecanismo.
```

Regra prática:

```text
reflection é ferramenta de infraestrutura, não martelo para toda regra de negócio.
```

---

## Erros comuns

### Erro 1 — Usar reflection sem necessidade

Se conhece o tipo, chame diretamente.

---

### Erro 2 — Esquecer que erro pode aparecer só em runtime

Nome de método ou campo errado não é validado pelo compilador.

---

### Erro 3 — Depender de ordem de campos/métodos

A ordem retornada não deve ser usada como regra.

---

### Erro 4 — Quebrar encapsulamento com setAccessible

Use com muito cuidado.

---

### Erro 5 — Ignorar exceções

Reflection tem várias exceções possíveis.

---

### Erro 6 — Esquecer RetentionPolicy.RUNTIME em annotation

Sem runtime, `getAnnotation` pode não encontrar.

---

### Erro 7 — Usar String mágica para nome de campo

Refatoração pode quebrar em runtime.

---

### Erro 8 — Achar que reflection é sempre lenta demais

Ela tem custo, mas o problema maior geralmente é uso indevido.

---

### Erro 9 — Achar que reflection é sempre necessária para framework

Framework usa reflection, mas seu código de negócio normalmente não precisa.

---

### Erro 10 — Criar magia sem documentação

Mecanismos genéricos precisam de documentação e testes claros.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.lang.reflect.Field;

public class DebugReflection {
    public static void main(String[] args) {
        Class<Cliente> classe = Cliente.class;

        for (Field campo : classe.getDeclaredFields()) {
            System.out.println(campo.getName());
        }
    }
}

class Cliente {
    private String nome;
    private String email;
}
```

Coloque breakpoint em:

```java
for (Field campo : classe.getDeclaredFields()) {
```

Observe:

```text
classe representa Cliente;
getDeclaredFields retorna Field[];
cada Field possui nome e tipo;
campo.getName retorna nome do campo.
```

Depois debugue leitura de annotation com:

```java
campo.getAnnotation(CampoObrigatorio.class)
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-081-reflection-conceitual
cd labs\m2\aula-081-reflection-conceitual
```

Crie arquivos:

```text
Main.java
ClassComObjeto.java
ClassForNameExemplo.java
LerCampos.java
LerMetodos.java
LerParametrosMetodo.java
LerConstrutores.java
Tabela.java
ClienteTabela.java
LerAnnotationClasse.java
IsAnnotationPresentExemplo.java
CampoObrigatorio.java
ClienteCamposObrigatorios.java
LerAnnotationCampo.java
ValidadorObrigatorio.java
ClienteValidavel.java
ExecutarValidador.java
CriarObjetoReflection.java
InvocarMetodoReflection.java
LerValorCampo.java
ClienteReflection.java
ProdutoReflection.java
PedidoReflection.java
PagamentoReflection.java
OrdemServicoReflection.java
CanalMensagem.java
MensagemReflection.java
LeitorCanalReflection.java
Auditavel.java
ProdutoAuditavel.java
LeitorAuditavel.java
DebugReflection.java
ErroCampoInexistente.java
ErroMetodoInexistente.java
ErroAnnotationSemRuntime.java
ErroMetodoPrivadoSemAcesso.java
ErroReflectionDesnecessaria.java
README.md
```

Compile exemplos válidos:

```powershell
javac Main.java
javac ClassComObjeto.java
javac ClassForNameExemplo.java
javac LerCampos.java
javac LerMetodos.java
javac LerParametrosMetodo.java
javac LerConstrutores.java
javac Tabela.java ClienteTabela.java LerAnnotationClasse.java
javac Tabela.java ClienteTabela.java IsAnnotationPresentExemplo.java
javac CampoObrigatorio.java ClienteCamposObrigatorios.java LerAnnotationCampo.java
javac CampoObrigatorio.java ValidadorObrigatorio.java ClienteValidavel.java ExecutarValidador.java
javac CriarObjetoReflection.java
javac InvocarMetodoReflection.java
javac LerValorCampo.java
javac ClienteReflection.java
javac ProdutoReflection.java
javac PedidoReflection.java
javac PagamentoReflection.java
javac OrdemServicoReflection.java
javac CanalMensagem.java MensagemReflection.java LeitorCanalReflection.java
javac Auditavel.java ProdutoAuditavel.java LeitorAuditavel.java
javac DebugReflection.java
```

Execute exemplos válidos:

```powershell
java Main
java ClassComObjeto
java ClassForNameExemplo
java LerCampos
java LerMetodos
java LerParametrosMetodo
java LerConstrutores
java LerAnnotationClasse
java IsAnnotationPresentExemplo
java LerAnnotationCampo
java ExecutarValidador
java CriarObjetoReflection
java InvocarMetodoReflection
java LerValorCampo
java ClienteReflection
java ProdutoReflection
java PedidoReflection
java PagamentoReflection
java OrdemServicoReflection
java LeitorCanalReflection
java LeitorAuditavel
java DebugReflection
```

Exemplos de erro ou comportamento perigoso:

```text
ErroCampoInexistente.java
ErroMetodoInexistente.java
ErroAnnotationSemRuntime.java
ErroMetodoPrivadoSemAcesso.java
ErroReflectionDesnecessaria.java
```

Use os resultados para registrar os erros comuns no diário.

---

## Observações

- Reflection é poderosa, mas deve ser usada com critério.
- É mais comum em infraestrutura e frameworks do que em regra de negócio comum.
- Annotation customizada precisa de `RetentionPolicy.RUNTIME` para leitura em runtime.
- Prefira chamada direta quando o tipo é conhecido.
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
git add labs/m2/aula-081-reflection-conceitual docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 081: pratica reflection conceitual em Java"
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
explicar reflection;
explicar Class;
obter Class com .class;
obter Class com getClass;
obter Class com Class.forName;
ler nome simples da classe;
ler nome completo da classe;
listar campos;
listar métodos;
listar parâmetros de métodos;
listar construtores;
ler annotation de classe;
verificar annotation com isAnnotationPresent;
ler annotation de campo;
criar validador simples baseado em annotation;
criar objeto via construtor reflection;
invocar método via reflection;
ler valor de campo;
explicar setAccessible;
explicar riscos de quebrar encapsulamento;
explicar strings mágicas em reflection;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar reflection;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar reflection avançada.

Não precisa ainda dominar proxies dinâmicos.

Não precisa ainda dominar annotation processors.

Não precisa ainda dominar módulos Java profundamente.

Não precisa ainda dominar performance de reflection.

Não precisa ainda dominar Spring internals.

Esses assuntos virão depois.

O objetivo é entender o conceito, praticar leitura básica e reconhecer por que frameworks usam reflection.

---

## Fechamento da aula

Hoje estudamos reflection conceitual.

A ideia central foi:

```text
reflection permite inspecionar classes, campos, métodos, construtores e annotations em tempo de execução.
```

Vimos que:

```text
Class representa uma classe em runtime;
Field representa campo;
Method representa método;
Constructor representa construtor;
getDeclaredFields lista campos declarados;
getDeclaredMethods lista métodos declarados;
getAnnotation lê metadados;
frameworks usam reflection para criar comportamentos genéricos;
reflection pode quebrar encapsulamento;
erros podem aparecer só em runtime;
chamada direta é melhor quando o tipo é conhecido.
```

O ponto mais importante é:

```text
reflection é poderosa para infraestrutura e frameworks, mas deve ser usada com muito critério em regra de negócio.
```

Na próxima aula, vamos estudar:

```text
Sealed classes e interfaces.
```

A próxima aula vai explicar hierarquias controladas, `sealed`, `permits`, `final`, `non-sealed`, `sealed interface`, modelagem de domínio e leitura crítica.
