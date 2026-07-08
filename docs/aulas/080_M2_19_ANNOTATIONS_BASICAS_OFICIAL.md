# 080 — M2.19 — Annotations básicas

## A pergunta central da aula

Observe:

```java
@Override
public String toString() {
    return "Cliente";
}
```

O que o `@Override` faz?

Ele não é um comentário.

Ele é uma annotation.

Ele informa ao compilador:

```text
este método deve sobrescrever um método da superclasse ou implementar um método de interface.
```

Se você escrever errado:

```java
@Override
public String tostring() {
    return "Cliente";
}
```

O compilador acusa erro.

Sem `@Override`, o erro poderia passar despercebido.

Então annotation é uma forma de adicionar metadados ao código.

Esses metadados podem ser usados por:

```text
compilador;
IDE;
ferramentas de análise;
frameworks;
bibliotecas;
runtime;
documentação;
testes.
```

---

## O que é annotation

Annotation é um metadado no código.

Ela adiciona informação extra sobre:

```text
classe;
método;
campo;
parâmetro;
construtor;
pacote;
tipo;
record;
enum;
interface.
```

Exemplos:

```java
@Override
@Deprecated
@SuppressWarnings("deprecation")
```

A annotation começa com:

```text
@
```

Por isso, visualmente é fácil reconhecer.

Ela não substitui regra de negócio.

Ela descreve ou configura algo sobre o código.

---

## Annotation não é comentário

Comentário:

```java
// Este método sobrescreve toString
```

Annotation:

```java
@Override
```

Diferença:

```text
comentário é texto para humanos;
annotation pode ser lida por compilador, ferramenta ou framework.
```

O comentário não impede erro.

A annotation pode impedir erro.

Exemplo:

```java
@Override
```

faz o compilador validar se o método realmente sobrescreve algo.

---

## Vocabulário essencial

Termos desta aula:

```text
annotation;
metadado;
@Override;
@Deprecated;
@SuppressWarnings;
compilador;
warning;
depreciação;
sobrescrita;
override;
runtime;
reflection;
leitura de metadados;
@Retention;
@Target;
RetentionPolicy;
ElementType;
@interface;
framework;
configuração declarativa;
marcação;
contrato;
ferramenta;
IDE;
análise estática.
```

Termos mais importantes:

```text
annotation -> metadado declarado no código;
@Override -> valida sobrescrita de método;
@Deprecated -> marca algo como obsoleto ou não recomendado;
@SuppressWarnings -> suprime avisos específicos do compilador;
warning -> aviso, não necessariamente erro;
metadata -> informação sobre o código;
@Retention -> define até onde a annotation fica disponível;
@Target -> define onde a annotation pode ser usada;
RUNTIME -> annotation disponível em execução;
SOURCE -> annotation existe só no código-fonte;
CLASS -> annotation vai para bytecode, mas não fica necessariamente disponível via reflection;
reflection -> mecanismo para inspecionar código em execução.
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
        Cliente cliente = new Cliente("Ana");

        System.out.println(cliente);
    }
}

class Cliente {
    private final String nome;

    Cliente(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Cliente{nome='" + nome + "'}";
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
Cliente{nome='Ana'}
```

O `@Override` garante que o método realmente sobrescreve `toString`.

---

## @Override

`@Override` indica que um método está sobrescrevendo ou implementando um método existente.

Exemplo com `toString`:

```java
@Override
public String toString() {
    return "Cliente";
}
```

Exemplo com interface:

```java
interface Notificador {
    void enviar(String texto);
}

class NotificadorEmail implements Notificador {
    @Override
    public void enviar(String texto) {
        System.out.println("Enviando e-mail: " + texto);
    }
}
```

Benefício:

```text
o compilador ajuda a detectar erros de assinatura.
```

Use `@Override` sempre que estiver sobrescrevendo ou implementando método.

---

## Erro que @Override detecta

Arquivo:

```text
ErroOverride.java
```

Código propositalmente problemático:

```java
public class ErroOverride {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        System.out.println(cliente);
    }
}

class Cliente {
    @Override
    public String tostring() {
        return "Cliente";
    }
}
```

Esse código não compila.

Motivo:

```text
tostring não sobrescreve toString;
Java diferencia maiúsculas e minúsculas.
```

O correto é:

```java
@Override
public String toString() {
    return "Cliente";
}
```

Sem `@Override`, o método `tostring` seria apenas um método novo e o erro poderia ficar escondido.

---

## @Override com interface

Arquivo:

```text
OverrideInterface.java
```

Código:

```java
public class OverrideInterface {
    public static void main(String[] args) {
        Notificador notificador = new NotificadorConsole();

        notificador.enviar("Pedido aprovado.");
    }
}

interface Notificador {
    void enviar(String mensagem);
}

class NotificadorConsole implements Notificador {
    @Override
    public void enviar(String mensagem) {
        System.out.println("Console: " + mensagem);
    }
}
```

Saída:

```text
Console: Pedido aprovado.
```

O `@Override` mostra claramente que o método vem do contrato `Notificador`.

---

## @Deprecated

`@Deprecated` marca algo como obsoleto, desencorajado ou substituído por alternativa melhor.

Exemplo:

```java
@Deprecated
public void metodoAntigo() {
}
```

Quando outro código chama esse método, a IDE e o compilador podem mostrar aviso.

Deprecar não significa remover imediatamente.

Significa:

```text
ainda existe;
mas não deve ser usado em código novo;
deve ser migrado em algum momento.
```

---

## Exemplo com @Deprecated

Arquivo:

```text
DeprecatedBasico.java
```

Código:

```java
public class DeprecatedBasico {
    public static void main(String[] args) {
        Calculadora calculadora = new Calculadora();

        System.out.println(calculadora.somarAntigo(10, 20));
        System.out.println(calculadora.somar(10, 20));
    }
}

class Calculadora {
    @Deprecated
    public int somarAntigo(int primeiro, int segundo) {
        return primeiro + segundo;
    }

    public int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }
}
```

O código compila.

Mas a IDE deve indicar que `somarAntigo` está deprecated.

---

## @Deprecated com since e forRemoval

Em versões modernas do Java, `@Deprecated` pode indicar:

```java
@Deprecated(since = "2.0", forRemoval = true)
```

Exemplo:

```java
@Deprecated(since = "2.0", forRemoval = false)
public void metodoAntigo() {
}
```

Significado:

```text
since -> desde quando está obsoleto;
forRemoval -> se há intenção de remover no futuro.
```

Arquivo:

```text
DeprecatedComDetalhe.java
```

Código:

```java
public class DeprecatedComDetalhe {
    public static void main(String[] args) {
        Servico servico = new Servico();

        servico.executarAntigo();
        servico.executarNovo();
    }
}

class Servico {
    @Deprecated(since = "2.0", forRemoval = false)
    public void executarAntigo() {
        System.out.println("Execução antiga.");
    }

    public void executarNovo() {
        System.out.println("Execução nova.");
    }
}
```

Boa prática:

```text
quando deprecar, explique a alternativa em documentação ou comentário.
```

---

## Deprecated com documentação curta

Arquivo:

```text
DeprecatedComAlternativa.java
```

Código:

```java
public class DeprecatedComAlternativa {
    public static void main(String[] args) {
        GeradorMensagem gerador = new GeradorMensagem();

        System.out.println(gerador.montarMensagemNova("Ana"));
    }
}

class GeradorMensagem {
    /**
     * @deprecated Use {@link #montarMensagemNova(String)}.
     */
    @Deprecated(since = "2.0", forRemoval = false)
    public String montarMensagemAntiga(String nome) {
        return "Olá " + nome;
    }

    public String montarMensagemNova(String nome) {
        return "Olá, " + nome + "!";
    }
}
```

Esse exemplo mostra uma migração mais responsável.

---

## @SuppressWarnings

`@SuppressWarnings` suprime avisos do compilador.

Exemplo:

```java
@SuppressWarnings("deprecation")
```

Pode ser aplicado em:

```text
classe;
método;
variável local;
construtor;
campo.
```

Use com cuidado.

Suprimir aviso não corrige o problema.

Apenas silencia o aviso.

Regra profissional:

```text
se usar @SuppressWarnings, saiba exatamente qual warning está suprimindo e por quê.
```

---

## Exemplo com @SuppressWarnings deprecation

Arquivo:

```text
SuppressWarningsDeprecation.java
```

Código:

```java
public class SuppressWarningsDeprecation {
    public static void main(String[] args) {
        executarCompatibilidade();
    }

    @SuppressWarnings("deprecation")
    public static void executarCompatibilidade() {
        ServicoLegado servico = new ServicoLegado();

        servico.executarAntigo();
    }
}

class ServicoLegado {
    @Deprecated(since = "2.0", forRemoval = false)
    public void executarAntigo() {
        System.out.println("Executando método legado.");
    }
}
```

Aqui a intenção é clara:

```text
este ponto ainda usa método legado por compatibilidade.
```

Mas o ideal é ter plano de migração.

---

## Exemplo ruim com @SuppressWarnings

Código ruim:

```java
@SuppressWarnings("all")
public void metodo() {
}
```

Problema:

```text
silencia tudo;
esconde alertas importantes;
dificulta manutenção;
pode mascarar problemas reais.
```

Evite `all`.

Prefira suprimir o aviso específico:

```java
@SuppressWarnings("deprecation")
```

ou:

```java
@SuppressWarnings("unchecked")
```

E aplique no menor escopo possível.

---

## Escopo menor é melhor

Ruim:

```java
@SuppressWarnings("deprecation")
public class SistemaInteiro {
}
```

Melhor:

```java
@SuppressWarnings("deprecation")
public void chamarMetodoLegado() {
}
```

Melhor ainda:

```text
refatorar para não precisar mais suprimir.
```

Regra:

```text
quando precisar suprimir, use o menor escopo possível.
```

---

## @SuppressWarnings unchecked

Às vezes você verá:

```java
@SuppressWarnings("unchecked")
```

Isso aparece com casts envolvendo generics.

Exemplo didático:

Arquivo:

```text
SuppressWarningsUnchecked.java
```

Código:

```java
import java.util.ArrayList;
import java.util.List;

public class SuppressWarningsUnchecked {
    public static void main(String[] args) {
        List<String> nomes = carregarNomesLegado();

        System.out.println(nomes);
    }

    @SuppressWarnings("unchecked")
    public static List<String> carregarNomesLegado() {
        List listaBruta = new ArrayList();

        listaBruta.add("Ana");
        listaBruta.add("Bruno");

        return (List<String>) listaBruta;
    }
}
```

Esse exemplo é propositalmente didático.

Em código real, o melhor é evitar lista bruta.

Mas em integração legada, às vezes aparece.

---

## Annotation como metadado

Annotation pode carregar informações.

Exemplo:

```java
@Tabela(nome = "clientes")
class Cliente {
}
```

Essa annotation não existe no Java padrão com esse nome.

Mas frameworks criam annotations assim.

Para entender o conceito, vamos criar uma annotation simples.

---

## Criando uma annotation simples

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

Isso cria uma annotation chamada `Tabela`.

Ela tem um atributo:

```text
nome.
```

O `RetentionPolicy.RUNTIME` significa:

```text
essa annotation pode ser lida em tempo de execução.
```

---

## Usando annotation customizada

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

Essa classe agora tem metadado:

```text
Tabela nome = clientes.
```

A classe por si só não muda comportamento.

Alguém precisa ler essa annotation.

Normalmente isso é feito por frameworks.

Nesta aula, faremos uma leitura simples.

---

## Lendo annotation em runtime

Arquivo:

```text
LeituraAnnotation.java
```

Código:

```java
public class LeituraAnnotation {
    public static void main(String[] args) {
        Class<ClienteTabela> classe = ClienteTabela.class;

        Tabela tabela = classe.getAnnotation(Tabela.class);

        if (tabela == null) {
            System.out.println("Classe sem annotation Tabela.");
        } else {
            System.out.println("Tabela: " + tabela.nome());
        }
    }
}
```

Para compilar junto:

```powershell
javac Tabela.java ClienteTabela.java LeituraAnnotation.java
```

Execute:

```powershell
java LeituraAnnotation
```

Saída:

```text
Tabela: clientes
```

Esse é o primeiro contato com leitura de metadados.

Na próxima aula, vamos aprofundar o conceito de reflection.

---

## @Retention

`@Retention` define até onde a annotation fica disponível.

Principais valores:

```java
RetentionPolicy.SOURCE
RetentionPolicy.CLASS
RetentionPolicy.RUNTIME
```

### SOURCE

A annotation fica no código-fonte e é descartada depois da compilação.

Exemplo:

```text
usada por compilador ou ferramenta de análise.
```

### CLASS

A annotation fica no `.class`, mas não necessariamente disponível para leitura em runtime via reflection.

### RUNTIME

A annotation fica disponível em execução.

Necessária quando queremos ler com:

```java
getAnnotation
```

---

## @Target

`@Target` define onde a annotation pode ser usada.

Exemplo:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
public @interface Tabela {
}
```

`ElementType.TYPE` permite usar em:

```text
classe;
interface;
enum;
record.
```

Outros exemplos:

```text
METHOD;
FIELD;
PARAMETER;
CONSTRUCTOR;
LOCAL_VARIABLE;
TYPE_USE.
```

---

## Annotation customizada com Retention e Target

Arquivo:

```text
CampoObrigatorio.java
```

Código:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface CampoObrigatorio {
    String mensagem() default "Campo obrigatório.";
}
```

Essa annotation pode ser usada em campo.

Exemplo:

Arquivo:

```text
ClienteComCampoObrigatorio.java
```

Código:

```java
public class ClienteComCampoObrigatorio {
    @CampoObrigatorio(mensagem = "Nome é obrigatório.")
    String nome;
}
```

Isso ainda não valida nada sozinho.

É apenas metadado.

Alguém precisa ler e aplicar regra.

---

## Annotation não faz milagre sozinha

Este ponto é fundamental.

Se você escreve:

```java
@CampoObrigatorio
String nome;
```

isso não valida automaticamente.

A annotation só marca.

Para validar, precisa existir código que leia essa marcação.

Frameworks como Bean Validation fazem isso com annotations como:

```java
@NotNull
@NotBlank
@Size
```

Mas a annotation sozinha não executa regra.

Regra:

```text
annotation descreve;
algum mecanismo precisa interpretar.
```

---

## Leitura simples de campos anotados

Arquivo:

```text
LeituraCampoObrigatorio.java
```

Código:

```java
import java.lang.reflect.Field;

public class LeituraCampoObrigatorio {
    public static void main(String[] args) {
        Class<ClienteComCampoObrigatorio> classe = ClienteComCampoObrigatorio.class;

        for (Field campo : classe.getDeclaredFields()) {
            CampoObrigatorio annotation = campo.getAnnotation(CampoObrigatorio.class);

            if (annotation != null) {
                System.out.println("Campo obrigatório: " + campo.getName());
                System.out.println("Mensagem: " + annotation.mensagem());
            }
        }
    }
}
```

Compile:

```powershell
javac CampoObrigatorio.java ClienteComCampoObrigatorio.java LeituraCampoObrigatorio.java
```

Execute:

```powershell
java LeituraCampoObrigatorio
```

Saída:

```text
Campo obrigatório: nome
Mensagem: Nome é obrigatório.
```

Não vamos aprofundar reflection ainda.

A próxima aula será exatamente sobre reflection conceitual.

---

## Aplicação em cliente

Arquivo:

```text
ClienteAnnotations.java
```

Código:

```java
public class ClienteAnnotations {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com");

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

Uso de `@Override`:

```text
deixa claro que toString foi sobrescrito;
compilador protege contra erro de assinatura.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoAnnotations.java
```

Código:

```java
public class ProdutoAnnotations {
    public static void main(String[] args) {
        Produto produto = new Produto("Cadeira");

        System.out.println(produto.descricaoNova());
    }
}

class Produto {
    private final String nome;

    Produto(String nome) {
        this.nome = nome;
    }

    /**
     * @deprecated Use {@link #descricaoNova()}.
     */
    @Deprecated(since = "2.0", forRemoval = false)
    public String descricaoAntiga() {
        return nome;
    }

    public String descricaoNova() {
        return "Produto: " + nome;
    }
}
```

Uso de `@Deprecated`:

```text
mantém compatibilidade;
orienta migração.
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoAnnotations.java
```

Código:

```java
public class PedidoAnnotations {
    public static void main(String[] args) {
        Pedido pedido = new Pedido("Ana", StatusPedido.PENDENTE);

        System.out.println(pedido);
    }
}

class Pedido {
    private final String cliente;
    private final StatusPedido status;

    Pedido(String cliente, StatusPedido status) {
        this.cliente = cliente;
        this.status = status;
    }

    @Override
    public String toString() {
        return "Pedido{cliente='" + cliente + "', status=" + status + "}";
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Annotation usada:

```text
@Override em toString.
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoAnnotations.java
```

Código:

```java
public class PagamentoAnnotations {
    public static void main(String[] args) {
        executarIntegracaoLegada();
    }

    @SuppressWarnings("deprecation")
    public static void executarIntegracaoLegada() {
        GatewayPagamento gateway = new GatewayPagamento();

        gateway.pagarLegado();
    }
}

class GatewayPagamento {
    @Deprecated(since = "3.0", forRemoval = false)
    public void pagarLegado() {
        System.out.println("Pagamento legado executado.");
    }

    public void pagarNovo() {
        System.out.println("Pagamento novo executado.");
    }
}
```

Aqui o `@SuppressWarnings` está limitado ao método de compatibilidade.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoAnnotations.java
```

Código:

```java
public class OrdemServicoAnnotations {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico("OS-001", StatusOs.AGENDADA);

        System.out.println(os);
    }
}

class OrdemServico {
    private final String certificado;
    private final StatusOs status;

    OrdemServico(String certificado, StatusOs status) {
        this.certificado = certificado;
        this.status = status;
    }

    @Override
    public String toString() {
        return "OrdemServico{certificado='" + certificado + "', status=" + status + "}";
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Uso profissional:

```text
toString útil para debug;
@Override garante sobrescrita correta.
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaAnnotations.java
```

Código:

```java
public class MensageriaAnnotations {
    public static void main(String[] args) {
        Mensagem mensagem = new Mensagem("Ana", TipoMensagem.ENTREGA);

        System.out.println(mensagem);
    }
}

@CanalMensagem(nome = "whatsapp")
class Mensagem {
    private final String cliente;
    private final TipoMensagem tipo;

    Mensagem(String cliente, TipoMensagem tipo) {
        this.cliente = cliente;
        this.tipo = tipo;
    }

    @Override
    public String toString() {
        return "Mensagem{cliente='" + cliente + "', tipo=" + tipo + "}";
    }
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}
```

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

A annotation `@CanalMensagem` marca a classe com metadado.

---

## Leitura da annotation de mensageria

Arquivo:

```text
LeituraCanalMensagem.java
```

Código:

```java
public class LeituraCanalMensagem {
    public static void main(String[] args) {
        CanalMensagem canal = Mensagem.class.getAnnotation(CanalMensagem.class);

        if (canal == null) {
            System.out.println("Canal não configurado.");
        } else {
            System.out.println("Canal: " + canal.nome());
        }
    }
}
```

Compile:

```powershell
javac CanalMensagem.java MensageriaAnnotations.java LeituraCanalMensagem.java
```

Execute:

```powershell
java LeituraCanalMensagem
```

Saída:

```text
Canal: whatsapp
```

Essa é uma leitura simples de metadado em runtime.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaAnnotations.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaAnnotations {
    public static void main(String[] args) {
        RegistroAuditoria registro = new RegistroAuditoria("aline", OperacaoAuditoria.CRIACAO, Instant.now());

        System.out.println(registro);
    }
}

class RegistroAuditoria {
    private final String usuario;
    private final OperacaoAuditoria operacao;
    private final Instant criadoEm;

    RegistroAuditoria(String usuario, OperacaoAuditoria operacao, Instant criadoEm) {
        this.usuario = usuario;
        this.operacao = operacao;
        this.criadoEm = criadoEm;
    }

    @Override
    public String toString() {
        return "RegistroAuditoria{usuario='" + usuario + "', operacao=" + operacao + ", criadoEm=" + criadoEm + "}";
    }
}

enum OperacaoAuditoria {
    CRIACAO,
    EDICAO,
    EXCLUSAO,
    APROVACAO,
    RECUSA
}
```

Uso:

```text
@Override para toString de auditoria.
```

---

## Refatoração: comentário para annotation

Antes:

```java
// sobrescreve toString
public String toString() {
    return "Cliente";
}
```

Depois:

```java
@Override
public String toString() {
    return "Cliente";
}
```

Melhoria:

```text
compilador valida;
IDE entende;
leitor entende;
erro de assinatura é detectado cedo.
```

---

## Refatoração: método antigo sem aviso para @Deprecated

Antes:

```java
public String montarMensagemAntiga(String nome) {
    return "Olá " + nome;
}
```

Depois:

```java
/**
 * @deprecated Use {@link #montarMensagemNova(String)}.
 */
@Deprecated(since = "2.0", forRemoval = false)
public String montarMensagemAntiga(String nome) {
    return "Olá " + nome;
}
```

Melhoria:

```text
uso novo evita método antigo;
migração fica explícita;
compatibilidade é mantida temporariamente.
```

---

## Refatoração: suppress amplo para suppress específico

Antes:

```java
@SuppressWarnings("all")
public void executar() {
}
```

Depois:

```java
@SuppressWarnings("deprecation")
public void executarCompatibilidadeLegada() {
}
```

Melhoria:

```text
escopo menor;
motivo mais claro;
menos risco de esconder outros problemas.
```

---

## Quando usar annotation

Use annotation quando:

```text
quer passar metadado ao compilador;
quer marcar intenção de código;
quer configurar comportamento de ferramenta/framework;
quer reduzir configuração externa;
quer melhorar validação estática;
quer documentar algo de forma verificável;
quer permitir leitura de metadados.
```

Exemplos:

```text
@Override para sobrescrita;
@Deprecated para API antiga;
@SuppressWarnings para compatibilidade controlada;
annotations de framework para mapear rotas, entidades, testes e transações.
```

---

## Quando evitar annotation

Evite annotation quando:

```text
um método simples resolveria melhor;
a regra fica escondida demais;
ninguém lê ou interpreta a annotation;
a annotation vira decoração sem efeito;
o time não entende o comportamento;
a regra exige fluxo explícito e testável;
há excesso de mágica.
```

Annotation é poderosa, mas pode deixar sistemas difíceis de entender quando usada sem critério.

Regra:

```text
annotation deve tornar intenção e integração mais claras, não esconder comportamento essencial.
```

---

## Erros comuns

### Erro 1 — Não usar @Override

Sem `@Override`, erro de assinatura pode passar despercebido.

---

### Erro 2 — Achar que annotation é comentário

Annotation é metadado processável.

---

### Erro 3 — Usar @SuppressWarnings para esconder problema real

Suprimir warning não corrige o código.

---

### Erro 4 — Usar @SuppressWarnings("all")

Evite. É amplo demais.

---

### Erro 5 — Deprecar sem indicar alternativa

Quem lê precisa saber o que usar no lugar.

---

### Erro 6 — Ignorar warning de deprecated

Deprecated indica migração futura.

---

### Erro 7 — Criar annotation sem Retention correto

Se precisa ler em runtime, use `RetentionPolicy.RUNTIME`.

---

### Erro 8 — Criar annotation sem Target adequado

Defina onde ela pode ser usada.

---

### Erro 9 — Achar que annotation customizada executa regra sozinha

Annotation só marca.

Alguém precisa ler e agir.

---

### Erro 10 — Colocar regra demais em annotation

Cuidado com comportamento invisível.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugAnnotation {
    public static void main(String[] args) {
        Tabela tabela = ClienteTabela.class.getAnnotation(Tabela.class);

        if (tabela != null) {
            System.out.println(tabela.nome());
        }
    }
}

@Tabela(nome = "clientes")
class ClienteTabela {
}
```

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

Coloque breakpoint em:

```java
Tabela tabela = ClienteTabela.class.getAnnotation(Tabela.class);
```

Observe:

```text
classe = ClienteTabela;
annotation encontrada = Tabela;
nome = clientes.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-080-annotations-basicas
cd labs\m2\aula-080-annotations-basicas
```

Crie arquivos:

```text
Main.java
ErroOverride.java
OverrideInterface.java
DeprecatedBasico.java
DeprecatedComDetalhe.java
DeprecatedComAlternativa.java
SuppressWarningsDeprecation.java
SuppressWarningsUnchecked.java
Tabela.java
ClienteTabela.java
LeituraAnnotation.java
CampoObrigatorio.java
ClienteComCampoObrigatorio.java
LeituraCampoObrigatorio.java
ClienteAnnotations.java
ProdutoAnnotations.java
PedidoAnnotations.java
PagamentoAnnotations.java
OrdemServicoAnnotations.java
CanalMensagem.java
MensageriaAnnotations.java
LeituraCanalMensagem.java
AuditoriaAnnotations.java
DebugAnnotation.java
ErroAnnotationSemRuntime.java
ErroSuppressWarningsAll.java
ErroDeprecatedSemAlternativa.java
README.md
```

Compile exemplos válidos:

```powershell
javac Main.java
javac OverrideInterface.java
javac DeprecatedBasico.java
javac DeprecatedComDetalhe.java
javac DeprecatedComAlternativa.java
javac SuppressWarningsDeprecation.java
javac SuppressWarningsUnchecked.java
javac Tabela.java ClienteTabela.java LeituraAnnotation.java
javac CampoObrigatorio.java ClienteComCampoObrigatorio.java LeituraCampoObrigatorio.java
javac ClienteAnnotations.java
javac ProdutoAnnotations.java
javac PedidoAnnotations.java
javac PagamentoAnnotations.java
javac OrdemServicoAnnotations.java
javac CanalMensagem.java MensageriaAnnotations.java LeituraCanalMensagem.java
javac AuditoriaAnnotations.java
javac Tabela.java DebugAnnotation.java
```

Execute exemplos válidos:

```powershell
java Main
java OverrideInterface
java DeprecatedBasico
java DeprecatedComDetalhe
java DeprecatedComAlternativa
java SuppressWarningsDeprecation
java SuppressWarningsUnchecked
java LeituraAnnotation
java LeituraCampoObrigatorio
java ClienteAnnotations
java ProdutoAnnotations
java PedidoAnnotations
java PagamentoAnnotations
java OrdemServicoAnnotations
java LeituraCanalMensagem
java AuditoriaAnnotations
java DebugAnnotation
```

Exemplos de erro ou comportamento perigoso:

```text
ErroOverride.java
ErroAnnotationSemRuntime.java
ErroSuppressWarningsAll.java
ErroDeprecatedSemAlternativa.java
```

Use os resultados para registrar os erros comuns no diário.

---

## Observações

- Usar `@Override` sempre que possível.
- Não usar `@SuppressWarnings("all")` sem motivo fortíssimo.
- Deprecar informando alternativa.
- Não achar que annotation customizada tem efeito automático.
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
git add labs/m2/aula-080-annotations-basicas docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 080: pratica annotations basicas em Java"
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
explicar annotation;
diferenciar annotation de comentário;
usar @Override;
provocar erro detectado por @Override;
usar @Override com interface;
usar @Deprecated;
explicar depreciação;
usar @Deprecated com since e forRemoval;
documentar alternativa de método deprecated;
usar @SuppressWarnings específico;
explicar risco de @SuppressWarnings;
evitar @SuppressWarnings("all");
criar annotation com @interface;
usar @Retention;
usar @Target;
explicar RetentionPolicy.RUNTIME;
ler annotation com getAnnotation;
explicar que annotation não executa regra sozinha;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar leitura de annotation;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar reflection profundamente.

Não precisa ainda dominar annotation processors.

Não precisa ainda dominar Bean Validation.

Não precisa ainda dominar Spring annotations.

Não precisa ainda dominar JPA annotations.

Não precisa ainda dominar criação avançada de frameworks.

Esses assuntos virão depois.

O objetivo é dominar a base: metadados, annotations nativas, criação simples e leitura inicial.

---

## Fechamento da aula

Hoje estudamos annotations básicas.

A ideia central foi:

```text
annotation é metadado no código que pode ser usado por compilador, ferramentas, frameworks ou runtime.
```

Vimos que:

```text
@Override valida sobrescrita;
@Deprecated marca API antiga;
@SuppressWarnings suprime avisos específicos;
annotation não é comentário;
annotation customizada é criada com @interface;
@Retention define disponibilidade;
@Target define onde pode usar;
RUNTIME permite leitura em execução;
getAnnotation permite leitura simples;
annotation customizada não faz nada sozinha.
```

O ponto mais importante é:

```text
use annotations para tornar intenção, validação e metadados mais claros, mas não use para esconder regras que deveriam estar explícitas.
```

Na próxima aula, vamos estudar:

```text
Reflection conceitual.
```

A próxima aula vai explicar `Class`, métodos, campos, construtores, leitura de metadados, riscos, limites e por que frameworks Java dependem tanto de reflection.
