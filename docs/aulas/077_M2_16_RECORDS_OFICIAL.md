# 077 — M2.16 — Records

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
073 — M2.12 — Locale, NumberFormat e formatação;
074 — M2.13 — java.time básico;
075 — M2.14 — Timezone e Instant;
076 — M2.15 — Enum profissional;
077 — M2.16 — Records.
```

Na aula anterior, estudamos enum profissional para substituir strings mágicas e representar valores controlados.

Agora vamos estudar um recurso moderno e muito útil para criar objetos de dados:

```text
record.
```

Records aparecem muito em backend moderno para:

```text
DTO de request;
DTO de response;
projeções simples;
retorno de consulta;
resumo de entidade;
payload de evento;
dados imutáveis;
resultado de cálculo;
objeto de transporte entre camadas;
contratos simples de API.
```

A ideia da aula é entender quando record ajuda e quando não ajuda.

---

## A pergunta central da aula

Imagine que você precisa representar um resumo de pedido:

```text
cliente;
status;
valor total.
```

Com classe tradicional, você escreveria:

```java
class PedidoResumo {
    private final String cliente;
    private final String status;
    private final BigDecimal total;

    public PedidoResumo(String cliente, String status, BigDecimal total) {
        this.cliente = cliente;
        this.status = status;
        this.total = total;
    }

    public String getCliente() {
        return cliente;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotal() {
        return total;
    }
}
```

E se quiser comparar objetos corretamente, ainda precisaria escrever:

```text
equals;
hashCode;
toString.
```

Com record:

```java
record PedidoResumo(String cliente, String status, BigDecimal total) {
}
```

O Java gera automaticamente:

```text
campos privados finais;
construtor;
métodos de acesso;
equals;
hashCode;
toString.
```

Isso reduz muito boilerplate.

Mas record não é “classe mágica para tudo”.

Ele tem objetivo claro:

```text
representar dados de forma simples, transparente e geralmente imutável.
```

---

## O que é record

`record` é um tipo especial do Java para declarar classes de dados.

Exemplo:

```java
record ClienteResumo(String nome, String email) {
}
```

Isso cria um tipo chamado `ClienteResumo` com dois componentes:

```text
nome;
email.
```

Uso:

```java
ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");
```

Acesso:

```java
cliente.nome()
cliente.email()
```

Atenção:

```text
record não gera getNome();
record gera nome().
```

Esse é um ponto importante.

---

## O que o record gera

Este record:

```java
record ClienteResumo(String nome, String email) {
}
```

gera conceitualmente:

```text
campo privado final nome;
campo privado final email;
construtor ClienteResumo(String nome, String email);
método nome();
método email();
equals();
hashCode();
toString().
```

Saída de `toString` costuma ser parecida com:

```text
ClienteResumo[nome=Ana, email=ana@email.com]
```

Isso é excelente para debug, logs simples e testes.

---

## Vocabulário essencial

Termos desta aula:

```text
record;
componente;
DTO;
imutabilidade;
boilerplate;
equals;
hashCode;
toString;
construtor canônico;
construtor compacto;
validação;
acessor;
classe de dados;
request;
response;
payload;
projeção;
domínio;
entidade;
shallow immutable;
campo final;
private final;
normalização;
Objects.requireNonNull;
record component;
API.
```

Termos mais importantes:

```text
record -> tipo especial para representar dados;
componente -> cada item declarado no cabeçalho do record;
DTO -> objeto de transferência de dados;
imutável -> objeto que não deve ter seus dados alterados depois de criado;
boilerplate -> código repetitivo sem muita regra;
construtor canônico -> construtor com todos os componentes do record;
construtor compacto -> forma curta de validar/normalizar componentes;
equals/hashCode -> comparação estrutural gerada automaticamente;
shallow immutable -> imutabilidade superficial.
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
        ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");

        System.out.println(cliente.nome());
        System.out.println(cliente.email());
        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
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
ana@email.com
ClienteResumo[nome=Ana, email=ana@email.com]
```

Pontos importantes:

```text
acesso é cliente.nome(), não cliente.getNome();
toString já vem pronto;
o record é curto e legível.
```

---

## Record em arquivo separado

Em projeto real, o record costuma ficar em arquivo separado.

Arquivo:

```text
ClienteResumo.java
```

Código:

```java
public record ClienteResumo(String nome, String email) {
}
```

Arquivo:

```text
UsarClienteResumo.java
```

Código:

```java
public class UsarClienteResumo {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");

        System.out.println(cliente.nome());
        System.out.println(cliente.email());
    }
}
```

Compile:

```powershell
javac ClienteResumo.java UsarClienteResumo.java
```

Execute:

```powershell
java UsarClienteResumo
```

---

## Record é imutável?

Record é pensado para ser imutável.

Os componentes viram campos finais.

Então isto não existe:

```java
cliente.nome = "Bruno";
```

Também não existe:

```java
cliente.setNome("Bruno");
```

Se quiser outro valor, crie outro objeto:

```java
ClienteResumo novoCliente = new ClienteResumo("Bruno", cliente.email());
```

Regra:

```text
record não é feito para alteração interna depois de criado.
```

---

## Exemplo de alteração criando outro record

Arquivo:

```text
RecordNovoObjeto.java
```

Código:

```java
public class RecordNovoObjeto {
    public static void main(String[] args) {
        ClienteResumo original = new ClienteResumo("Ana", "ana@email.com");

        ClienteResumo atualizado = new ClienteResumo("Bruno", original.email());

        System.out.println("Original: " + original);
        System.out.println("Atualizado: " + atualizado);
    }
}

record ClienteResumo(String nome, String email) {
}
```

Saída:

```text
Original: ClienteResumo[nome=Ana, email=ana@email.com]
Atualizado: ClienteResumo[nome=Bruno, email=ana@email.com]
```

O objeto original não muda.

---

## equals e hashCode gerados

Records geram `equals` e `hashCode` com base nos componentes.

Arquivo:

```text
RecordEqualsHashCode.java
```

Código:

```java
public class RecordEqualsHashCode {
    public static void main(String[] args) {
        ClienteResumo primeiro = new ClienteResumo("Ana", "ana@email.com");
        ClienteResumo segundo = new ClienteResumo("Ana", "ana@email.com");
        ClienteResumo terceiro = new ClienteResumo("Bruno", "bruno@email.com");

        System.out.println(primeiro.equals(segundo));
        System.out.println(primeiro.equals(terceiro));
        System.out.println(primeiro.hashCode() == segundo.hashCode());
    }
}

record ClienteResumo(String nome, String email) {
}
```

Saída esperada:

```text
true
false
true
```

Isso é muito útil em testes, coleções e comparações.

---

## Record com BigDecimal

Arquivo:

```text
ProdutoResumoRecord.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoResumoRecord {
    public static void main(String[] args) {
        ProdutoResumo produto = new ProdutoResumo("Cadeira", new BigDecimal("199.90"));

        System.out.println(produto.nome());
        System.out.println(produto.preco());
        System.out.println(produto);
    }
}

record ProdutoResumo(String nome, BigDecimal preco) {
}
```

Record funciona bem para resumo de dados.

Atenção:

```text
BigDecimal é imutável;
isso combina bem com record.
```

---

## Record com enum

Arquivo:

```text
PedidoResumoRecord.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoResumoRecord {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo(
                "Ana",
                StatusPedido.APROVADO,
                new BigDecimal("250.00")
        );

        System.out.println(pedido);
        System.out.println(pedido.status().getDescricao());
    }
}

record PedidoResumo(String cliente, StatusPedido status, BigDecimal total) {
}

enum StatusPedido {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    RECUSADO("Recusado");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

Aqui combinamos:

```text
record para dados;
enum para status controlado;
BigDecimal para dinheiro.
```

---

## Record com Instant

Arquivo:

```text
AuditoriaResumoRecord.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaResumoRecord {
    public static void main(String[] args) {
        AuditoriaResumo auditoria = new AuditoriaResumo(
                "aline",
                "CRIACAO",
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(auditoria);
    }
}

record AuditoriaResumo(String usuario, String operacao, Instant criadoEm) {
}
```

Record combina bem com DTO de auditoria ou resposta de API.

---

## Construtor canônico

O construtor principal do record é chamado de construtor canônico.

Para:

```java
record ClienteResumo(String nome, String email) {
}
```

O construtor canônico é:

```java
public ClienteResumo(String nome, String email)
```

Você pode declará-lo explicitamente:

Arquivo:

```text
RecordConstrutorCanonico.java
```

Código:

```java
public class RecordConstrutorCanonico {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");

        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
    public ClienteResumo(String nome, String email) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
    }
}
```

Esse formato é completo.

Nele, você atribui manualmente:

```java
this.nome = ...
this.email = ...
```

---

## Construtor compacto

O construtor compacto é uma forma mais curta para validar e normalizar.

Arquivo:

```text
RecordConstrutorCompacto.java
```

Código:

```java
public class RecordConstrutorCompacto {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo(" Ana ", " ANA@EMAIL.COM ");

        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
    public ClienteResumo {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Saída:

```text
ClienteResumo[nome=Ana, email=ana@email.com]
```

No construtor compacto:

```text
não colocamos lista de parâmetros;
o Java atribui os componentes automaticamente no final;
podemos validar e ajustar variáveis dos componentes.
```

Atenção:

```text
no construtor compacto, não use this.nome = ...
```

Use:

```java
nome = nome.trim();
```

---

## Validação com Objects.requireNonNull

Arquivo:

```text
RecordRequireNonNull.java
```

Código:

```java
import java.util.Objects;

public class RecordRequireNonNull {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");

        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
    public ClienteResumo {
        Objects.requireNonNull(nome, "Nome é obrigatório.");
        Objects.requireNonNull(email, "E-mail é obrigatório.");

        if (nome.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio.");
        }

        if (email.isBlank()) {
            throw new IllegalArgumentException("E-mail não pode ser vazio.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Esse padrão é útil para null.

Depois você valida regras específicas.

---

## Record permite métodos

Record pode ter métodos.

Arquivo:

```text
RecordComMetodo.java
```

Código:

```java
import java.math.BigDecimal;

public class RecordComMetodo {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo("Ana", new BigDecimal("100.00"));

        System.out.println(pedido.resumo());
    }
}

record PedidoResumo(String cliente, BigDecimal total) {
    public String resumo() {
        return cliente + " - " + total;
    }
}
```

Métodos pequenos podem fazer sentido.

Mas cuidado:

```text
record não deve virar classe de regra complexa demais.
```

---

## Record pode ter métodos estáticos

Arquivo:

```text
RecordMetodoEstatico.java
```

Código:

```java
public class RecordMetodoEstatico {
    public static void main(String[] args) {
        ClienteResumo cliente = ClienteResumo.of(" Ana ", " ANA@EMAIL.COM ");

        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
    public static ClienteResumo of(String nome, String email) {
        return new ClienteResumo(nome, email);
    }

    public ClienteResumo {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Método estático pode criar fábrica simples.

Use com moderação.

---

## Record pode implementar interface

Arquivo:

```text
RecordImplementaInterface.java
```

Código:

```java
public class RecordImplementaInterface {
    public static void main(String[] args) {
        Identificavel cliente = new ClienteResumo(10L, "Ana");

        System.out.println(cliente.id());
    }
}

interface Identificavel {
    Long id();
}

record ClienteResumo(Long id, String nome) implements Identificavel {
}
```

Record pode implementar interface.

Mas record não pode estender outra classe diretamente.

---

## Limitações de record

Records têm limitações importantes:

```text
não são feitos para estado mutável;
não têm setters;
componentes são finais;
não podem estender classes;
não devem ser usados para qualquer entidade complexa;
não permitem campos de instância extras fora dos componentes;
não são ideais para JPA entities tradicionais;
imutabilidade é superficial quando componente é mutável;
não substituem modelagem de domínio rica.
```

A regra não é:

```text
use record em tudo.
```

A regra é:

```text
use record para dados simples e imutáveis.
```

---

## Imutabilidade superficial

Record é superficialmente imutável.

Se o componente for mutável, o conteúdo desse objeto ainda pode mudar.

Exemplo com array.

Arquivo:

```text
RecordShallowImmutable.java
```

Código:

```java
import java.util.Arrays;

public class RecordShallowImmutable {
    public static void main(String[] args) {
        String[] tags = {"novo", "vip"};

        ClienteTags cliente = new ClienteTags("Ana", tags);

        tags[0] = "alterado";

        System.out.println(Arrays.toString(cliente.tags()));
    }
}

record ClienteTags(String nome, String[] tags) {
}
```

Saída:

```text
[alterado, vip]
```

O record não protegeu o conteúdo do array.

Por isso dizemos:

```text
record tem imutabilidade superficial.
```

No futuro, com coleções, veremos formas melhores de proteger dados internos.

---

## Record e DTO

DTO significa:

```text
Data Transfer Object.
```

Em português:

```text
objeto de transferência de dados.
```

DTO é comum em APIs:

```text
request;
response;
eventos;
mensagens;
integração;
dados entre camadas.
```

Record combina bem com DTO porque:

```text
é curto;
é claro;
é imutável;
gera equals/hashCode;
gera toString;
expõe dados de forma direta.
```

Exemplo:

```java
record CriarClienteRequest(String nome, String email) {
}

record ClienteResponse(Long id, String nome, String email) {
}
```

---

## Record para request

Arquivo:

```text
CriarClienteRequestRecord.java
```

Código:

```java
public class CriarClienteRequestRecord {
    public static void main(String[] args) {
        CriarClienteRequest request = new CriarClienteRequest(" Ana ", " ANA@EMAIL.COM ");

        System.out.println(request);
    }
}

record CriarClienteRequest(String nome, String email) {
    public CriarClienteRequest {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Request simples combina bem com record.

---

## Record para response

Arquivo:

```text
ClienteResponseRecord.java
```

Código:

```java
public class ClienteResponseRecord {
    public static void main(String[] args) {
        ClienteResponse response = new ClienteResponse(1L, "Ana", "ana@email.com");

        System.out.println(response);
    }
}

record ClienteResponse(Long id, String nome, String email) {
}
```

Response simples também combina bem.

---

## Record não é entidade automaticamente

Entidade de domínio pode ter:

```text
identidade;
ciclo de vida;
alteração de estado;
regras internas;
métodos de negócio;
relacionamentos;
persistência;
histórico.
```

Record pode não ser ideal para isso.

Exemplo de entidade mutável:

```java
class Pedido {
    private StatusPedido status;

    public void aprovar() {
        if (status != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Somente pendente pode aprovar.");
        }

        status = StatusPedido.APROVADO;
    }
}
```

Isso é mais natural em classe tradicional.

Record é melhor para:

```text
PedidoResumo;
PedidoResponse;
PedidoCriadoEvent;
PedidoFiltro;
ResultadoCalculo.
```

---

## Aplicação em cliente

Arquivo:

```text
ClienteRecords.java
```

Código:

```java
public class ClienteRecords {
    public static void main(String[] args) {
        CriarClienteRequest request = new CriarClienteRequest(" Ana ", " ANA@EMAIL.COM ");

        ClienteResponse response = criarCliente(request);

        System.out.println(response);
    }

    public static ClienteResponse criarCliente(CriarClienteRequest request) {
        return new ClienteResponse(1L, request.nome(), request.email());
    }
}

record CriarClienteRequest(String nome, String email) {
    public CriarClienteRequest {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}

record ClienteResponse(Long id, String nome, String email) {
}
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoRecords.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoRecords {
    public static void main(String[] args) {
        ProdutoResumo produto = new ProdutoResumo("Cadeira", new BigDecimal("199.905"), StatusProduto.ATIVO);

        System.out.println(produto);
        System.out.println(produto.precoFormatadoSimples());
    }
}

record ProdutoResumo(String nome, BigDecimal preco, StatusProduto status) {
    public ProdutoResumo {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        nome = nome.trim();
        preco = preco.setScale(2, RoundingMode.HALF_UP);
    }

    public String precoFormatadoSimples() {
        return "R$ " + preco;
    }
}

enum StatusProduto {
    ATIVO,
    INATIVO,
    BLOQUEADO
}
```

Esse exemplo mostra validação e normalização.

A formatação real com `NumberFormat` já foi estudada antes.

---

## Aplicação em pedido

Arquivo:

```text
PedidoRecords.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoRecords {
    public static void main(String[] args) {
        PedidoResumo pedido = new PedidoResumo(
                "Ana",
                StatusPedido.PENDENTE,
                new BigDecimal("100.00"),
                new BigDecimal("10.00")
        );

        System.out.println(pedido);
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

record PedidoResumo(
        String cliente,
        StatusPedido status,
        BigDecimal subtotal,
        BigDecimal desconto
) {
    public PedidoResumo {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (subtotal == null || subtotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Subtotal inválido.");
        }

        if (desconto == null || desconto.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Desconto inválido.");
        }

        cliente = cliente.trim();
        subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        desconto = desconto.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal totalFinal() {
        return subtotal.subtract(desconto);
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Record pode ter método calculado simples.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoRecords.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

public class PagamentoRecords {
    public static void main(String[] args) {
        PagamentoResumo pagamento = new PagamentoResumo(
                "PAG-001",
                new BigDecimal("100.00"),
                3,
                StatusPagamento.PENDENTE,
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(pagamento);
        System.out.println("Parcela: " + pagamento.valorParcela());
    }
}

record PagamentoResumo(
        String codigo,
        BigDecimal valor,
        int parcelas,
        StatusPagamento status,
        Instant criadoEm
) {
    public PagamentoResumo {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Criado em é obrigatório.");
        }

        codigo = codigo.trim();
        valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal valorParcela() {
        return valor.divide(BigDecimal.valueOf(parcelas), 2, RoundingMode.HALF_UP);
    }
}

enum StatusPagamento {
    PENDENTE,
    CONFIRMADO,
    RECUSADO
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoRecords.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;

public class OrdemServicoRecords {
    public static void main(String[] args) {
        OrdemServicoResumo os = new OrdemServicoResumo(
                "OS-001",
                StatusOs.AGENDADA,
                LocalDate.of(2026, 7, 10),
                LocalTime.of(14, 30)
        );

        System.out.println(os);
        System.out.println("Permite reagendar? " + os.permiteReagendar());
    }
}

record OrdemServicoResumo(
        String certificado,
        StatusOs status,
        LocalDate dataAgendada,
        LocalTime horaAgendada
) {
    public OrdemServicoResumo {
        if (certificado == null || certificado.isBlank()) {
            throw new IllegalArgumentException("Certificado é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (dataAgendada == null) {
            throw new IllegalArgumentException("Data agendada é obrigatória.");
        }

        if (horaAgendada == null) {
            throw new IllegalArgumentException("Hora agendada é obrigatória.");
        }

        certificado = certificado.trim().toUpperCase();
    }

    public boolean permiteReagendar() {
        return status == StatusOs.AGENDADA || status == StatusOs.REAGENDADA;
    }
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
MensageriaRecords.java
```

Código:

```java
import java.time.Instant;

public class MensageriaRecords {
    public static void main(String[] args) {
        MensagemResumo mensagem = new MensagemResumo(
                "Ana",
                TipoMensagem.ENTREGA,
                "OS-001",
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(mensagem);
        System.out.println("Gera ocorrência? " + mensagem.geraOcorrencia());
    }
}

record MensagemResumo(
        String cliente,
        TipoMensagem tipo,
        String certificado,
        Instant criadoEm
) {
    public MensagemResumo {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (certificado == null || certificado.isBlank()) {
            throw new IllegalArgumentException("Certificado é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Criado em é obrigatório.");
        }

        cliente = cliente.trim();
        certificado = certificado.trim().toUpperCase();
    }

    public boolean geraOcorrencia() {
        return tipo.geraOcorrencia();
    }
}

enum TipoMensagem {
    BOAS_VINDAS(false),
    ENTREGA(true),
    NPS(true);

    private final boolean geraOcorrencia;

    TipoMensagem(boolean geraOcorrencia) {
        this.geraOcorrencia = geraOcorrencia;
    }

    public boolean geraOcorrencia() {
        return geraOcorrencia;
    }
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaRecords.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaRecords {
    public static void main(String[] args) {
        AuditoriaResumo auditoria = new AuditoriaResumo(
                "aline",
                OperacaoAuditoria.CRIACAO,
                "Produto",
                10L,
                Instant.parse("2026-07-07T13:00:00Z")
        );

        System.out.println(auditoria);
        System.out.println(auditoria.linhaSimples());
    }
}

record AuditoriaResumo(
        String usuario,
        OperacaoAuditoria operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
    public AuditoriaResumo {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (operacao == null) {
            throw new IllegalArgumentException("Operação é obrigatória.");
        }

        if (entidade == null || entidade.isBlank()) {
            throw new IllegalArgumentException("Entidade é obrigatória.");
        }

        if (entidadeId == null) {
            throw new IllegalArgumentException("ID da entidade é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Criado em é obrigatório.");
        }

        usuario = usuario.trim().toLowerCase();
        entidade = entidade.trim();
    }

    public String linhaSimples() {
        return usuario + " | " + operacao + " | " + entidade + " | " + entidadeId + " | " + criadoEm;
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

---

## Refatoração: classe DTO para record

Antes:

```java
class ClienteResponse {
    private final Long id;
    private final String nome;
    private final String email;

    public ClienteResponse(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }
}
```

Depois:

```java
record ClienteResponse(Long id, String nome, String email) {
}
```

Ganho:

```text
menos código;
menos risco de erro;
equals/hashCode/toString gerados;
intenção clara de DTO imutável.
```

---

## Refatoração: normalizar entrada no construtor compacto

Antes:

```java
record ClienteRequest(String nome, String email) {
}
```

Problema:

```text
aceita null;
aceita vazio;
aceita espaços;
aceita email maiúsculo sem padronizar.
```

Depois:

```java
record ClienteRequest(String nome, String email) {
    public ClienteRequest {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Record continua curto, mas agora tem regra mínima de validade.

---

## Quando não usar record

Não use record por reflexo.

Evite record quando o objeto precisa:

```text
mudar estado frequentemente;
ter ciclo de vida complexo;
representar entidade persistente tradicional;
ter muitos métodos de negócio;
encapsular invariantes complexas;
ter identidade mutável;
ser estendido;
ter campos internos fora dos componentes;
controlar alteração por métodos como aprovar(), cancelar(), reagendar().
```

Exemplo melhor como classe tradicional:

```java
class Pedido {
    private StatusPedido status;

    public void aprovar() {
        if (status != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Pedido não pode ser aprovado.");
        }

        status = StatusPedido.APROVADO;
    }
}
```

Esse tipo de regra de mudança de estado combina mais com classe.

---

## Erros comuns

### Erro 1 — Esperar getNome

Record gera:

```java
nome()
```

Não gera:

```java
getNome()
```

---

### Erro 2 — Achar que record tem setter

Record não gera setter.

---

### Erro 3 — Ignorar validação

Record aceita null se você não validar.

---

### Erro 4 — Usar record para entidade mutável complexa

Nem todo objeto deve ser record.

---

### Erro 5 — Achar que record é profundamente imutável

Se o componente é mutável, o conteúdo pode mudar.

---

### Erro 6 — Colocar regra enorme dentro de record

Record deve representar dados com regra simples.

---

### Erro 7 — Usar record só para “ficar moderno”

Use quando encaixa no problema.

---

### Erro 8 — Esquecer que equals usa todos os componentes

Se dois records têm um componente diferente, `equals` será false.

---

### Erro 9 — Usar array como componente sem cuidado

Array é mutável.

---

### Erro 10 — Confundir DTO com domínio rico

DTO transporta dados.

Domínio rico pode ter comportamento, ciclo de vida e invariantes mais complexas.

---

## Diagnóstico de records

Quando pensar em usar record, pergunte:

### 1. É principalmente dados?

Se sim, record pode servir.

### 2. O objeto deve ser imutável?

Se sim, record ajuda.

### 3. Precisa de setters?

Se sim, record provavelmente não é ideal.

### 4. É DTO de request ou response?

Record pode ser ótimo.

### 5. É entidade com ciclo de vida?

Talvez classe tradicional seja melhor.

### 6. Precisa validar no construtor?

Use construtor compacto.

### 7. Tem componente mutável?

Cuidado com imutabilidade superficial.

### 8. Precisa de equals/hashCode?

Record já gera.

### 9. Vai usar em API?

Record pode deixar contrato claro.

### 10. A regra está crescendo demais?

Avalie classe ou serviço.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugRecord {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo(" Ana ", " ANA@EMAIL.COM ");

        System.out.println(cliente.nome());
        System.out.println(cliente.email());
        System.out.println(cliente);
    }
}

record ClienteResumo(String nome, String email) {
    public ClienteResumo {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        nome = nome.trim();
        email = email.trim().toLowerCase();
    }
}
```

Coloque breakpoint em:

```java
public ClienteResumo {
```

Observe:

```text
nome chega com espaços;
email chega maiúsculo;
normalização acontece;
record final fica com nome e email ajustados.
```

Depois veja:

```java
cliente.nome()
cliente.email()
cliente.toString()
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — tentar usar getNome

```java
public class Main {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana");

        System.out.println(cliente.getNome());
    }
}

record ClienteResumo(String nome) {
}
```

Explique por que não compila.

---

### Teste 2 — tentar alterar componente

```java
public class Main {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo("Ana");

        cliente.nome = "Bruno";
    }
}

record ClienteResumo(String nome) {
}
```

Explique por que não compila.

---

### Teste 3 — null sem validação

```java
public class Main {
    public static void main(String[] args) {
        ClienteResumo cliente = new ClienteResumo(null);

        System.out.println(cliente.nome());
    }
}

record ClienteResumo(String nome) {
}
```

Explique que record aceita null se não validar.

---

### Teste 4 — array mutável

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String[] tags = {"vip"};

        ClienteTags cliente = new ClienteTags(tags);

        tags[0] = "alterado";

        System.out.println(Arrays.toString(cliente.tags()));
    }
}

record ClienteTags(String[] tags) {
}
```

Explique imutabilidade superficial.

---

### Teste 5 — equals com componente diferente

```java
public class Main {
    public static void main(String[] args) {
        ClienteResumo a = new ClienteResumo("Ana", "a@email.com");
        ClienteResumo b = new ClienteResumo("Ana", "b@email.com");

        System.out.println(a.equals(b));
    }
}

record ClienteResumo(String nome, String email) {
}
```

Explique por que é `false`.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-077-records
cd labs\m2\aula-077-records
```

Crie arquivos:

```text
Main.java
ClienteResumo.java
UsarClienteResumo.java
RecordNovoObjeto.java
RecordEqualsHashCode.java
ProdutoResumoRecord.java
PedidoResumoRecord.java
AuditoriaResumoRecord.java
RecordConstrutorCanonico.java
RecordConstrutorCompacto.java
RecordRequireNonNull.java
RecordComMetodo.java
RecordMetodoEstatico.java
RecordImplementaInterface.java
RecordShallowImmutable.java
CriarClienteRequestRecord.java
ClienteResponseRecord.java
ClienteRecords.java
ProdutoRecords.java
PedidoRecords.java
PagamentoRecords.java
OrdemServicoRecords.java
MensageriaRecords.java
AuditoriaRecords.java
DebugRecord.java
ErroGetNome.java
ErroAlterarComponente.java
ErroNullSemValidacao.java
ErroArrayMutavel.java
ErroEqualsComponente.java
README.md
```

Compile:

```powershell
javac Main.java
javac ClienteResumo.java UsarClienteResumo.java
javac RecordNovoObjeto.java
javac RecordEqualsHashCode.java
javac ProdutoResumoRecord.java
javac PedidoResumoRecord.java
javac AuditoriaResumoRecord.java
javac RecordConstrutorCanonico.java
javac RecordConstrutorCompacto.java
javac RecordRequireNonNull.java
javac RecordComMetodo.java
javac RecordMetodoEstatico.java
javac RecordImplementaInterface.java
javac RecordShallowImmutable.java
javac CriarClienteRequestRecord.java
javac ClienteResponseRecord.java
javac ClienteRecords.java
javac ProdutoRecords.java
javac PedidoRecords.java
javac PagamentoRecords.java
javac OrdemServicoRecords.java
javac MensageriaRecords.java
javac AuditoriaRecords.java
javac DebugRecord.java
javac ErroGetNome.java
javac ErroAlterarComponente.java
javac ErroNullSemValidacao.java
javac ErroArrayMutavel.java
javac ErroEqualsComponente.java
```

Execute os exemplos válidos:

```powershell
java Main
java UsarClienteResumo
java RecordNovoObjeto
java RecordEqualsHashCode
java ProdutoResumoRecord
java PedidoResumoRecord
java AuditoriaResumoRecord
java RecordConstrutorCanonico
java RecordConstrutorCompacto
java RecordRequireNonNull
java RecordComMetodo
java RecordMetodoEstatico
java RecordImplementaInterface
java RecordShallowImmutable
java CriarClienteRequestRecord
java ClienteResponseRecord
java ClienteRecords
java ProdutoRecords
java PedidoRecords
java PagamentoRecords
java OrdemServicoRecords
java MensageriaRecords
java AuditoriaRecords
java DebugRecord
java ErroNullSemValidacao
java ErroArrayMutavel
java ErroEqualsComponente
```

Os arquivos `ErroGetNome.java` e `ErroAlterarComponente.java` são exemplos que devem falhar na compilação.

Use para entender o erro.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 077 — Records

## Objetivo

Entender o uso de records em Java para representar dados simples, DTOs imutáveis, respostas de API, requests, payloads e resultados de cálculo, com validação e leitura crítica.

## Conceitos

- `record` representa uma classe de dados.
- Componentes do record viram campos privados e finais.
- Record gera construtor, acessores, `equals`, `hashCode` e `toString`.
- O acessor é `nome()`, não `getNome()`.
- Record não tem setter.
- Para alterar valor, crie outro record.
- Record é bom para DTOs.
- Record pode ter construtor compacto.
- Record pode validar e normalizar dados.
- Record pode ter métodos.
- Record pode implementar interface.
- Record não deve ser usado para tudo.
- Record tem imutabilidade superficial.
- Arrays e objetos mutáveis dentro de record exigem cuidado.
- Entidades com ciclo de vida podem ser melhores como classes tradicionais.

## Comandos

```powershell
javac Main.java
java Main
javac RecordConstrutorCompacto.java
java RecordConstrutorCompacto
javac PedidoRecords.java
java PedidoRecords
```

## Observações

- Não esperar getters no padrão JavaBean.
- Não usar record só por moda.
- Não esquecer validação.
- Não usar record para entidade mutável complexa.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver construtor compacto |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar validação |
| Variables | janela Debug | Ver componentes do record |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `equals`, `toString`, acessores |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Renomear componente |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Separar método simples |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 077 — Records

### O que aprendi
Aprendi que record é uma forma curta de criar classes de dados em Java, com construtor, acessores, `equals`, `hashCode` e `toString` gerados automaticamente. Também aprendi que record é útil para DTOs, mas não substitui toda classe de domínio.

### O que pratiquei
Criei records simples, records com BigDecimal, enum e Instant, construtor canônico, construtor compacto, validação, normalização, métodos, método estático, interface, exemplos de request/response e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- record
- componente
- DTO
- request
- response
- imutabilidade
- boilerplate
- equals
- hashCode
- toString
- construtor canônico
- construtor compacto
- validação
- normalização
- acessor
- shallow immutable
- Objects.requireNonNull
- interface
- entidade
- domínio

### Arquivos criados
- `labs/m2/aula-077-records/Main.java`
- `labs/m2/aula-077-records/ClienteResumo.java`
- `labs/m2/aula-077-records/UsarClienteResumo.java`
- `labs/m2/aula-077-records/RecordNovoObjeto.java`
- `labs/m2/aula-077-records/RecordEqualsHashCode.java`
- `labs/m2/aula-077-records/ProdutoResumoRecord.java`
- `labs/m2/aula-077-records/PedidoResumoRecord.java`
- `labs/m2/aula-077-records/AuditoriaResumoRecord.java`
- `labs/m2/aula-077-records/RecordConstrutorCanonico.java`
- `labs/m2/aula-077-records/RecordConstrutorCompacto.java`
- `labs/m2/aula-077-records/RecordRequireNonNull.java`
- `labs/m2/aula-077-records/RecordComMetodo.java`
- `labs/m2/aula-077-records/RecordMetodoEstatico.java`
- `labs/m2/aula-077-records/RecordImplementaInterface.java`
- `labs/m2/aula-077-records/RecordShallowImmutable.java`
- `labs/m2/aula-077-records/CriarClienteRequestRecord.java`
- `labs/m2/aula-077-records/ClienteResponseRecord.java`
- `labs/m2/aula-077-records/ClienteRecords.java`
- `labs/m2/aula-077-records/ProdutoRecords.java`
- `labs/m2/aula-077-records/PedidoRecords.java`
- `labs/m2/aula-077-records/PagamentoRecords.java`
- `labs/m2/aula-077-records/OrdemServicoRecords.java`
- `labs/m2/aula-077-records/MensageriaRecords.java`
- `labs/m2/aula-077-records/AuditoriaRecords.java`
- `labs/m2/aula-077-records/DebugRecord.java`
- `labs/m2/aula-077-records/ErroGetNome.java`
- `labs/m2/aula-077-records/ErroAlterarComponente.java`
- `labs/m2/aula-077-records/ErroNullSemValidacao.java`
- `labs/m2/aula-077-records/ErroArrayMutavel.java`
- `labs/m2/aula-077-records/ErroEqualsComponente.java`
- `labs/m2/aula-077-records/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac RecordConstrutorCompacto.java
java RecordConstrutorCompacto
javac PedidoRecords.java
java PedidoRecords
javac AuditoriaRecords.java
java AuditoriaRecords
```

### Erros que quero evitar
- esperar `getNome`;
- achar que record tem setter;
- ignorar validação;
- usar record para entidade mutável complexa;
- achar que record é profundamente imutável;
- colocar regra enorme dentro de record;
- usar record só para ficar moderno;
- esquecer que equals usa todos os componentes;
- usar array como componente sem cuidado;
- confundir DTO com domínio rico.

### Próximo passo
Estudar var com critério.
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
git add labs/m2/aula-077-records docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 077: pratica records em Java"
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
1. O que é record?
2. Para que record é útil?
3. O que é componente de record?
4. Qual acessor o record gera para nome?
5. Record gera getNome?
6. Record gera setter?
7. O que record gera automaticamente?
8. Para que serve equals gerado?
9. Para que serve hashCode gerado?
10. Para que serve toString gerado?
11. O que é construtor canônico?
12. O que é construtor compacto?
13. Como validar null em record?
14. Como normalizar String no construtor compacto?
15. Record pode ter método?
16. Record pode implementar interface?
17. O que significa imutabilidade superficial?
18. Por que array dentro de record exige cuidado?
19. Quando não usar record?
20. Qual diferença entre DTO e entidade de domínio?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar record;
criar record simples;
instanciar record;
usar acessores do record;
explicar que não existe getNome automático;
explicar que não existe setter;
explicar equals gerado;
explicar hashCode gerado;
explicar toString gerado;
usar record com BigDecimal;
usar record com enum;
usar record com Instant;
criar construtor canônico;
criar construtor compacto;
validar componentes;
normalizar componentes;
usar Objects.requireNonNull;
criar método em record;
criar método estático em record;
implementar interface;
explicar limitações de record;
explicar imutabilidade superficial;
usar record para request;
usar record para response;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar construtor compacto;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar serialização JSON com record.

Não precisa ainda dominar Spring MVC com record.

Não precisa ainda dominar Bean Validation.

Não precisa ainda dominar JPA com record.

Não precisa ainda dominar sealed classes.

Não precisa ainda dominar pattern matching.

Esses assuntos virão depois.

O objetivo é dominar records como DTOs imutáveis e objetos de dados simples, com validação e senso crítico.

---

## Fechamento da aula

Hoje estudamos records.

A ideia central foi:

```text
record é uma forma curta e segura de representar dados simples e geralmente imutáveis.
```

Vimos que:

```text
record gera construtor;
record gera acessores;
record gera equals;
record gera hashCode;
record gera toString;
record não gera setter;
record usa acessor nome(), não getNome();
record pode ter construtor compacto;
record pode validar e normalizar;
record pode ter métodos;
record pode implementar interface;
record combina bem com DTO;
record não substitui toda classe de domínio.
```

O ponto mais importante é:

```text
use record quando o objeto é principalmente um pacote de dados; use classe tradicional quando o objeto tem ciclo de vida e mudança de estado rica.
```

Na próxima aula, vamos estudar:

```text
Var com critério.
```

A próxima aula vai explicar inferência local de tipo, legibilidade, quando usar, quando evitar, impacto em leitura de código e padrões profissionais.
