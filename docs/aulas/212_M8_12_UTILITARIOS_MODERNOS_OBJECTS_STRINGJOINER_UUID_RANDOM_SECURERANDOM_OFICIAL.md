# 212 — M8.12 — Utilitários modernos: Objects, StringJoiner, UUID, Random e SecureRandom

## Objetivo da aula

Na aula anterior, você estudou:

```text
Instant;
UTC;
ZoneId;
ZonedDateTime;
OffsetDateTime;
ZoneOffset;
conversão entre zonas;
conversão para Instant;
DateTimeFormatter com zona;
auditoria;
agenda;
integração externa;
boas práticas de fuso horário.
```

Agora vamos fechar o bloco de utilitários modernos do Módulo 8 estudando classes pequenas, mas muito úteis no dia a dia de backend:

```text
Objects;
StringJoiner;
UUID;
Random;
SecureRandom.
```

Essas classes aparecem em cenários como:

```text
validação de nulos;
equals e hashCode;
mensagens formatadas;
montagem de textos;
geração de identificadores;
códigos de correlação;
tokens simples;
simulações;
sorteios;
geração segura de valores aleatórios.
```

Ao final desta aula, você deve conseguir:

```text
usar Objects.requireNonNull;
usar Objects.equals;
usar Objects.hash;
usar StringJoiner;
usar String.join;
usar UUID.randomUUID;
entender quando UUID ajuda;
entender quando UUID não substitui regra de negócio;
usar Random;
entender limite do Random;
usar SecureRandom;
entender quando segurança importa;
criar códigos técnicos;
criar correlationId;
evitar Math.random em cenários importantes;
aplicar utilitários em entidades, services e infraestrutura.
```

---

## Ideia principal

Nem todo recurso importante do Java é grande.

Algumas classes utilitárias resolvem problemas pequenos com clareza.

Exemplos:

```java
Objects.requireNonNull(nome, "Nome é obrigatório.");
```

```java
UUID id = UUID.randomUUID();
```

```java
String texto = String.join(";", "SKU", "NOME", "PRECO");
```

```java
SecureRandom secureRandom = new SecureRandom();
```

Esses recursos, usados corretamente, deixam o código mais limpo.

Usados sem critério, podem esconder regra de negócio.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de utilitários:

```text
Entidade:
pode usar Objects para proteger invariantes simples.

Service/use case:
pode gerar correlationId, token, código técnico ou montar saídas.

Infraestrutura:
pode gerar identificadores técnicos, logs e rastreabilidade.

Controller futuro:
pode receber correlationId, requestId e headers.

Domínio:
não deve trocar regra de negócio por aleatoriedade sem critério.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-212-utilitarios-modernos-objects-stringjoiner-uuid-random-securerandom
cd labs\m8\aula-212-utilitarios-modernos-objects-stringjoiner-uuid-random-securerandom
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula212
mkdir src\br\com\curso\aula212\app
mkdir src\br\com\curso\aula212\dominio
mkdir src\br\com\curso\aula212\dominio\cliente
mkdir src\br\com\curso\aula212\dominio\pedido
mkdir src\br\com\curso\aula212\dominio\produto
mkdir src\br\com\curso\aula212\dto
mkdir src\br\com\curso\aula212\service
mkdir src\br\com\curso\aula212\util
```

---

# Parte 1 — Objects.requireNonNull

## O que é Objects

`Objects` é uma classe utilitária do pacote:

```java
java.util
```

Ela possui métodos úteis para lidar com:

```text
null;
comparação;
hash;
toString seguro;
validações simples.
```

---

## requireNonNull

O método:

```java
Objects.requireNonNull(valor, "Mensagem")
```

lança `NullPointerException` se o valor for nulo.

Exemplo:

```java
this.nome = Objects.requireNonNull(nome, "Nome é obrigatório.");
```

---

## ObjectsRequireNonNullApp

Crie:

```text
src\br\com\curso\aula212\app\ObjectsRequireNonNullApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.Objects;

public class ObjectsRequireNonNullApp {
    public static void main(String[] args) {
        String nome = null;

        String valor = Objects.requireNonNull(nome, "Nome é obrigatório.");

        System.out.println(valor);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.ObjectsRequireNonNullApp
```

---

## Observação importante

`requireNonNull` valida apenas se é nulo.

Ele não valida:

```text
String em branco;
número negativo;
lista vazia;
formato inválido.
```

Para isso, você ainda precisa de regra explícita.

Exemplo:

```java
if (nome.isBlank()) {
    throw new IllegalArgumentException("Nome não pode ser vazio.");
}
```

---

## Quando usar requireNonNull

Use para obrigatoriedade simples de objetos:

```java
this.criadoEm = Objects.requireNonNull(criadoEm, "Data de criação é obrigatória.");
this.cliente = Objects.requireNonNull(cliente, "Cliente é obrigatório.");
this.itens = List.copyOf(Objects.requireNonNull(itens, "Itens são obrigatórios."));
```

Mas para String, normalmente você também precisa validar branco.

---

# Parte 2 — Objects.equals

## Problema com equals e null

Este código pode dar `NullPointerException`:

```java
valor.equals(outro)
```

se `valor` for nulo.

Com:

```java
Objects.equals(valor, outro)
```

a comparação é segura.

---

## ObjectsEqualsApp

Crie:

```text
src\br\com\curso\aula212\app\ObjectsEqualsApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.Objects;

public class ObjectsEqualsApp {
    public static void main(String[] args) {
        String a = null;
        String b = "teste";
        String c = null;

        System.out.println("a == b? " + Objects.equals(a, b));
        System.out.println("a == c? " + Objects.equals(a, c));
        System.out.println("b == teste? " + Objects.equals(b, "teste"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.ObjectsEqualsApp
```

---

## Uso comum

`Objects.equals` é muito usado em:

```text
equals de classes;
comparações seguras;
filtros;
testes;
mapeamentos.
```

Exemplo:

```java
return Objects.equals(this.codigo, outro.codigo);
```

---

# Parte 3 — Objects.hash

## Para que serve

`Objects.hash(...)` ajuda a implementar `hashCode`.

Exemplo:

```java
@Override
public int hashCode() {
    return Objects.hash(codigo);
}
```

Ou com múltiplos campos:

```java
return Objects.hash(codigo, tipo);
```

---

## Produto com equals e hashCode

Crie:

```text
src\br\com\curso\aula212\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula212.dominio.produto;

import java.math.BigDecimal;
import java.util.Objects;

public class Produto {
    private final String sku;
    private final String nome;
    private final BigDecimal preco;

    public Produto(String sku, String nome, BigDecimal preco) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.preco = preco;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal preco() {
        return preco;
    }

    public String resumo() {
        return sku + " | " + nome + " | Preço: " + preco;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Produto produto)) {
            return false;
        }

        return Objects.equals(sku, produto.sku);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sku);
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoEqualsHashApp

Crie:

```text
src\br\com\curso\aula212\app\ProdutoEqualsHashApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

public class ProdutoEqualsHashApp {
    public static void main(String[] args) {
        Produto produto1 = new Produto("PRD-001", "Notebook", new BigDecimal("3500.00"));
        Produto produto2 = new Produto("prd-001", "Notebook Gamer", new BigDecimal("4500.00"));
        Produto produto3 = new Produto("PRD-002", "Mouse", new BigDecimal("80.00"));

        Set<Produto> produtos = new HashSet<>();
        produtos.add(produto1);
        produtos.add(produto2);
        produtos.add(produto3);

        produtos.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.ProdutoEqualsHashApp
```

---

## O que observar

Como `equals` e `hashCode` usam SKU, produtos com mesmo SKU são considerados iguais.

Isso reforça o que você estudou em Collections.

---

# Parte 4 — Objects.toString

## toString seguro

`Objects.toString(valor, padrao)` permite converter para texto com fallback quando nulo.

Exemplo:

```java
Objects.toString(valor, "N/A")
```

---

## ObjectsToStringApp

Crie:

```text
src\br\com\curso\aula212\app\ObjectsToStringApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.Objects;

public class ObjectsToStringApp {
    public static void main(String[] args) {
        String nome = null;
        Integer idade = 35;

        System.out.println(Objects.toString(nome, "Nome não informado"));
        System.out.println(Objects.toString(idade, "Idade não informada"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.ObjectsToStringApp
```

---

## Quando usar

Use em saída, log, resumo e debug.

Não use para esconder dado obrigatório ausente no domínio.

Se o campo é obrigatório, valide.

---

# Parte 5 — String.join

## Montagem simples de texto

Para juntar valores com separador:

```java
String.join(";", "SKU", "NOME", "PRECO")
```

Isso retorna:

```text
SKU;NOME;PRECO
```

---

## StringJoinApp

Crie:

```text
src\br\com\curso\aula212\app\StringJoinApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.List;

public class StringJoinApp {
    public static void main(String[] args) {
        String cabecalho = String.join(";", "SKU", "NOME", "PRECO", "ESTOQUE");

        List<String> erros = List.of(
                "Nome é obrigatório",
                "E-mail é inválido",
                "Documento é obrigatório"
        );

        String mensagem = String.join("; ", erros);

        System.out.println(cabecalho);
        System.out.println(mensagem);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.StringJoinApp
```

---

## Uso comum

Use `String.join` para:

```text
CSV simples;
mensagens de validação;
listas de campos;
resumos;
cabeçalhos;
logs simples.
```

---

# Parte 6 — StringJoiner

## O que é StringJoiner

`StringJoiner` permite montar texto com:

```text
separador;
prefixo;
sufixo.
```

Exemplo:

```java
StringJoiner joiner = new StringJoiner(", ", "[", "]");
joiner.add("A");
joiner.add("B");
joiner.add("C");
```

Resultado:

```text
[A, B, C]
```

---

## StringJoinerBasicoApp

Crie:

```text
src\br\com\curso\aula212\app\StringJoinerBasicoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.StringJoiner;

public class StringJoinerBasicoApp {
    public static void main(String[] args) {
        StringJoiner joiner = new StringJoiner(", ", "[", "]");

        joiner.add("Ana");
        joiner.add("Carlos");
        joiner.add("Maria");

        System.out.println(joiner);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.StringJoinerBasicoApp
```

---

## StringJoiner em resumo

Crie:

```text
src\br\com\curso\aula212\app\StringJoinerResumoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.StringJoiner;

public class StringJoinerResumoApp {
    public static void main(String[] args) {
        StringJoiner joiner = new StringJoiner(" | ");

        joiner.add("PED-001");
        joiner.add("Cliente: Ana");
        joiner.add("Status: PAGO");
        joiner.add("Total: 500.00");

        System.out.println(joiner);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.StringJoinerResumoApp
```

---

# Parte 7 — UUID

## O que é UUID

UUID significa:

```text
Universally Unique Identifier
```

É um identificador com formato:

```text
550e8400-e29b-41d4-a716-446655440000
```

Em Java:

```java
UUID.randomUUID()
```

---

## UUIDBasicoApp

Crie:

```text
src\br\com\curso\aula212\app\UUIDBasicoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.UUID;

public class UUIDBasicoApp {
    public static void main(String[] args) {
        UUID id = UUID.randomUUID();

        System.out.println("UUID: " + id);
        System.out.println("String: " + id.toString());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.UUIDBasicoApp
```

---

## Quando usar UUID

Use UUID para:

```text
ID técnico;
correlationId;
requestId;
identificador externo;
rastreabilidade;
identificador público não sequencial;
eventos;
mensagens.
```

Exemplo:

```java
String correlationId = UUID.randomUUID().toString();
```

---

## Quando não usar UUID

UUID não substitui:

```text
regra de negócio;
código humano legível;
sequência fiscal;
número de pedido com regra específica;
protocolo com formato exigido;
ID de banco quando a arquitetura usa sequence.
```

Exemplo:

```text
PED-000123
OS-2026-000001
NF-123456
```

Esses códigos têm regra própria.

UUID é técnico.

---

# Parte 8 — CorrelationId

## O que é correlationId

`correlationId` é um identificador usado para rastrear uma operação entre camadas e sistemas.

Exemplo:

```text
request entrou na API;
service processou;
client chamou API externa;
mensagem foi publicada;
log registrou tudo com o mesmo correlationId.
```

Isso ajuda a investigar problemas.

---

## CorrelationIdService

Crie:

```text
src\br\com\curso\aula212\service\CorrelationIdService.java
```

Código:

```java
package br.com.curso.aula212.service;

import java.util.UUID;

public class CorrelationIdService {
    public String gerar() {
        return UUID.randomUUID().toString();
    }
}
```

---

## CorrelationIdApp

Crie:

```text
src\br\com\curso\aula212\app\CorrelationIdApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.service.CorrelationIdService;

public class CorrelationIdApp {
    public static void main(String[] args) {
        CorrelationIdService service = new CorrelationIdService();

        String correlationId = service.gerar();

        System.out.println("Iniciando processamento. correlationId=" + correlationId);
        System.out.println("Chamando serviço de pedidos. correlationId=" + correlationId);
        System.out.println("Finalizando processamento. correlationId=" + correlationId);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.CorrelationIdApp
```

---

## Visão profissional

Em aplicações reais, o correlationId pode vir de:

```text
header HTTP;
mensagem;
evento;
gateway;
API externa.
```

Se não vier, o sistema pode gerar.

---

# Parte 9 — UUID em entidade técnica

## PedidoTecnico

Crie:

```text
src\br\com\curso\aula212\dominio\pedido\PedidoTecnico.java
```

Código:

```java
package br.com.curso.aula212.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoTecnico {
    private final UUID id;
    private final String codigoNegocio;
    private final BigDecimal valor;
    private final Instant criadoEm;

    public PedidoTecnico(UUID id, String codigoNegocio, BigDecimal valor, Instant criadoEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID técnico é obrigatório.");
        }

        if (codigoNegocio == null || codigoNegocio.isBlank()) {
            throw new IllegalArgumentException("Código de negócio é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigoNegocio = codigoNegocio.trim().toUpperCase();
        this.valor = valor;
        this.criadoEm = criadoEm;
    }

    public UUID id() {
        return id;
    }

    public String codigoNegocio() {
        return codigoNegocio;
    }

    public BigDecimal valor() {
        return valor;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public String resumo() {
        return id
                + " | Código: " + codigoNegocio
                + " | Valor: " + valor
                + " | Criado em: " + criadoEm;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoTecnicoFactory

Crie:

```text
src\br\com\curso\aula212\service\PedidoTecnicoFactory.java
```

Código:

```java
package br.com.curso.aula212.service;

import br.com.curso.aula212.dominio.pedido.PedidoTecnico;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoTecnicoFactory {
    public PedidoTecnico criar(String codigoNegocio, BigDecimal valor, Instant agora) {
        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        return new PedidoTecnico(
                UUID.randomUUID(),
                codigoNegocio,
                valor,
                agora
        );
    }
}
```

---

## PedidoTecnicoApp

Crie:

```text
src\br\com\curso\aula212\app\PedidoTecnicoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.dominio.pedido.PedidoTecnico;
import br.com.curso.aula212.service.PedidoTecnicoFactory;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoTecnicoApp {
    public static void main(String[] args) {
        PedidoTecnicoFactory factory = new PedidoTecnicoFactory();

        PedidoTecnico pedido = factory.criar(
                "PED-001",
                new BigDecimal("500.00"),
                Instant.now()
        );

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.PedidoTecnicoApp
```

---

## Observação

Esse exemplo separa:

```text
UUID:
identificador técnico.

codigoNegocio:
identificador legível do negócio.
```

Essa distinção é importante em arquitetura.

---

# Parte 10 — Random

## O que é Random

`Random` gera números pseudoaleatórios.

Exemplo:

```java
Random random = new Random();
int numero = random.nextInt(10);
```

Isso gera número entre:

```text
0 e 9
```

---

## RandomBasicoApp

Crie:

```text
src\br\com\curso\aula212\app\RandomBasicoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.Random;

public class RandomBasicoApp {
    public static void main(String[] args) {
        Random random = new Random();

        int numero0a9 = random.nextInt(10);
        int numero1a100 = random.nextInt(100) + 1;
        boolean verdadeiroOuFalso = random.nextBoolean();

        System.out.println("0 a 9: " + numero0a9);
        System.out.println("1 a 100: " + numero1a100);
        System.out.println("Boolean: " + verdadeiroOuFalso);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.RandomBasicoApp
```

---

## Quando usar Random

Use `Random` para:

```text
simulação;
dados de teste simples;
sorteio sem segurança;
exemplo didático;
seleção aleatória sem risco.
```

Não use para:

```text
senha;
token;
código de autenticação;
reset de senha;
segurança;
criptografia.
```

---

# Parte 11 — Random com seed

## O que é seed

Seed é a semente que inicia a sequência pseudoaleatória.

Com a mesma seed, a sequência se repete.

Isso é útil para testes reprodutíveis.

---

## RandomSeedApp

Crie:

```text
src\br\com\curso\aula212\app\RandomSeedApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.util.Random;

public class RandomSeedApp {
    public static void main(String[] args) {
        Random primeiro = new Random(123);
        Random segundo = new Random(123);

        System.out.println("Primeiro:");
        for (int i = 0; i < 5; i++) {
            System.out.println(primeiro.nextInt(100));
        }

        System.out.println();

        System.out.println("Segundo:");
        for (int i = 0; i < 5; i++) {
            System.out.println(segundo.nextInt(100));
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.RandomSeedApp
```

---

## O que observar

As duas sequências serão iguais.

Isso mostra que `Random` é pseudoaleatório.

---

# Parte 12 — SecureRandom

## O que é SecureRandom

`SecureRandom` é usado quando a aleatoriedade tem impacto de segurança.

Exemplos:

```text
token;
código de verificação;
chave temporária;
senha provisória;
nonce;
segredo.
```

Import:

```java
java.security.SecureRandom
```

---

## SecureRandomBasicoApp

Crie:

```text
src\br\com\curso\aula212\app\SecureRandomBasicoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import java.security.SecureRandom;

public class SecureRandomBasicoApp {
    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();

        int codigo = random.nextInt(1_000_000);

        System.out.printf("Código de 6 dígitos: %06d%n", codigo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.SecureRandomBasicoApp
```

---

## Por que formatar com %06d

Se o número for:

```text
123
```

o formato:

```java
%06d
```

transforma em:

```text
000123
```

Isso é comum para códigos numéricos de 6 dígitos.

---

# Parte 13 — Gerador de código seguro

## CodigoVerificacaoService

Crie:

```text
src\br\com\curso\aula212\service\CodigoVerificacaoService.java
```

Código:

```java
package br.com.curso.aula212.service;

import java.security.SecureRandom;

public class CodigoVerificacaoService {
    private final SecureRandom random = new SecureRandom();

    public String gerarCodigoNumerico(int quantidadeDigitos) {
        if (quantidadeDigitos <= 0 || quantidadeDigitos > 9) {
            throw new IllegalArgumentException("Quantidade de dígitos deve estar entre 1 e 9.");
        }

        int limite = (int) Math.pow(10, quantidadeDigitos);
        int numero = random.nextInt(limite);

        return "%0" + quantidadeDigitos + "d".formatted(numero);
    }
}
```

---

## Observação: problema proposital

O código acima tem um erro sutil de precedência/formatação.

Esta linha:

```java
return "%0" + quantidadeDigitos + "d".formatted(numero);
```

não faz o que queremos.

Vamos corrigir com clareza:

```java
String formato = "%0" + quantidadeDigitos + "d";
return formato.formatted(numero);
```

Atualize a classe para a versão correta abaixo.

---

## CodigoVerificacaoService corrigido

Substitua por:

```java
package br.com.curso.aula212.service;

import java.security.SecureRandom;

public class CodigoVerificacaoService {
    private final SecureRandom random = new SecureRandom();

    public String gerarCodigoNumerico(int quantidadeDigitos) {
        if (quantidadeDigitos <= 0 || quantidadeDigitos > 9) {
            throw new IllegalArgumentException("Quantidade de dígitos deve estar entre 1 e 9.");
        }

        int limite = (int) Math.pow(10, quantidadeDigitos);
        int numero = random.nextInt(limite);

        String formato = "%0" + quantidadeDigitos + "d";

        return formato.formatted(numero);
    }
}
```

---

## CodigoVerificacaoApp

Crie:

```text
src\br\com\curso\aula212\app\CodigoVerificacaoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.service.CodigoVerificacaoService;

public class CodigoVerificacaoApp {
    public static void main(String[] args) {
        CodigoVerificacaoService service = new CodigoVerificacaoService();

        System.out.println("Código 4 dígitos: " + service.gerarCodigoNumerico(4));
        System.out.println("Código 6 dígitos: " + service.gerarCodigoNumerico(6));
        System.out.println("Código 8 dígitos: " + service.gerarCodigoNumerico(8));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.CodigoVerificacaoApp
```

---

## Boa prática

Para código de verificação real, além de gerar com `SecureRandom`, você precisa pensar em:

```text
expiração;
tentativas máximas;
bloqueio;
armazenamento seguro;
não logar código sensível;
rate limit;
auditoria.
```

A geração é só uma parte.

---

# Parte 14 — Gerador de token alfanumérico

## TokenSeguroService

Crie:

```text
src\br\com\curso\aula212\service\TokenSeguroService.java
```

Código:

```java
package br.com.curso.aula212.service;

import java.security.SecureRandom;

public class TokenSeguroService {
    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private final SecureRandom random = new SecureRandom();

    public String gerar(int tamanho) {
        if (tamanho <= 0) {
            throw new IllegalArgumentException("Tamanho deve ser maior que zero.");
        }

        StringBuilder builder = new StringBuilder();

        for (int i = 0; i < tamanho; i++) {
            int indice = random.nextInt(CARACTERES.length());
            builder.append(CARACTERES.charAt(indice));
        }

        return builder.toString();
    }
}
```

---

## TokenSeguroApp

Crie:

```text
src\br\com\curso\aula212\app\TokenSeguroApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.service.TokenSeguroService;

public class TokenSeguroApp {
    public static void main(String[] args) {
        TokenSeguroService service = new TokenSeguroService();

        System.out.println("Token 16: " + service.gerar(16));
        System.out.println("Token 32: " + service.gerar(32));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.TokenSeguroApp
```

---

## Observação

Este é um exemplo didático.

Em segurança profissional, geração de token envolve outros cuidados.

Mas a base é:

```text
não usar Random para segredo;
usar SecureRandom.
```

---

# Parte 15 — Util de texto com StringJoiner

## ResumoUtil

Crie:

```text
src\br\com\curso\aula212\util\ResumoUtil.java
```

Código:

```java
package br.com.curso.aula212.util;

import java.util.StringJoiner;

public final class ResumoUtil {
    private ResumoUtil() {
    }

    public static String juntarComBarra(String... partes) {
        if (partes == null) {
            throw new IllegalArgumentException("Partes são obrigatórias.");
        }

        StringJoiner joiner = new StringJoiner(" | ");

        for (String parte : partes) {
            if (parte != null && !parte.isBlank()) {
                joiner.add(parte.trim());
            }
        }

        return joiner.toString();
    }
}
```

---

## ResumoUtilApp

Crie:

```text
src\br\com\curso\aula212\app\ResumoUtilApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.util.ResumoUtil;

public class ResumoUtilApp {
    public static void main(String[] args) {
        String resumo = ResumoUtil.juntarComBarra(
                "PED-001",
                "Cliente: Ana",
                "",
                null,
                "Status: PAGO"
        );

        System.out.println(resumo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.ResumoUtilApp
```

---

## Cuidado com utilitários

Classes utilitárias são úteis.

Mas não transforme regra de negócio em método genérico sem sentido.

Exemplo ruim:

```text
RegraUtil.validarTudo(...)
```

Exemplo bom:

```text
ResumoUtil.juntarComBarra(...)
```

Regra de negócio deve continuar em domínio ou service.

---

# Parte 16 — Record de apoio

## O que é record

`record` é um recurso do Java para representar dados imutáveis simples.

Exemplo:

```java
public record ClienteResponse(String nome, String email) {
}
```

Ele gera automaticamente:

```text
construtor;
getters no estilo nome();
equals;
hashCode;
toString.
```

---

## Observação de foco

Neste curso, vamos estudar `record` com mais profundidade em outro momento.

Aqui ele aparece apenas como utilitário moderno para DTO simples.

---

## ClienteResponse

Crie:

```text
src\br\com\curso\aula212\dto\ClienteResponse.java
```

Código:

```java
package br.com.curso.aula212.dto;

public record ClienteResponse(
        String nome,
        String email,
        boolean ativo
) {
}
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula212\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula212.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;

    public Cliente(String nome, String email, boolean ativo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail é inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }
}
```

---

## ClienteMapper

Crie:

```text
src\br\com\curso\aula212\dto\ClienteMapper.java
```

Código:

```java
package br.com.curso.aula212.dto;

import br.com.curso.aula212.dominio.cliente.Cliente;

public final class ClienteMapper {
    private ClienteMapper() {
    }

    public static ClienteResponse toResponse(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        return new ClienteResponse(
                cliente.nome(),
                cliente.email(),
                cliente.ativo()
        );
    }
}
```

---

## RecordDtoApp

Crie:

```text
src\br\com\curso\aula212\app\RecordDtoApp.java
```

Código:

```java
package br.com.curso.aula212.app;

import br.com.curso.aula212.dominio.cliente.Cliente;
import br.com.curso.aula212.dto.ClienteMapper;
import br.com.curso.aula212.dto.ClienteResponse;

public class RecordDtoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana Silva", "ana@empresa.com", true);

        ClienteResponse response = ClienteMapper.toResponse(cliente);

        System.out.println(response);
        System.out.println(response.nome());
        System.out.println(response.email());
        System.out.println(response.ativo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula212.app.RecordDtoApp
```

---

## Regra profissional sobre record

`record` é bom para:

```text
DTO;
response;
request simples;
value object simples;
resultado imutável;
dados sem comportamento complexo.
```

Cuidado ao usar `record` para entidade rica com muitas regras mutáveis.

---

# Parte 17 — Boas práticas

## 1. Use Objects com critério

Bom:

```java
Objects.requireNonNull(cliente, "Cliente é obrigatório.");
```

Mas para String, valide branco também.

---

## 2. Use Objects.equals em equals

Ajuda a evitar `NullPointerException`.

---

## 3. Use Objects.hash em hashCode simples

Facilita implementação correta.

---

## 4. Use String.join para montagem simples

Bom para CSV, mensagens e cabeçalhos.

---

## 5. Use StringJoiner quando precisar de prefixo/sufixo

Exemplo:

```text
[A, B, C]
```

---

## 6. Use UUID para ID técnico

Não confunda com código de negócio.

---

## 7. Use correlationId para rastreabilidade

Essencial em sistemas distribuídos.

---

## 8. Use Random apenas para sorteio sem segurança

Nunca para token ou senha.

---

## 9. Use SecureRandom para segurança

Código de verificação, token e segredo exigem fonte mais adequada.

---

## 10. Cuidado com utilitários genéricos demais

Não esconda domínio em classe utilitária.

---

# Parte 18 — Erros comuns

## 1. Usar requireNonNull achando que valida tudo

Ele só valida nulo.

---

## 2. Usar UUID como regra de negócio

UUID é identificador técnico.

---

## 3. Usar Random para senha

Use `SecureRandom`.

---

## 4. Logar token sensível

Não exponha segredos em log.

---

## 5. Criar utilitário para regra específica de domínio

Regra do pedido deve ficar no pedido ou service adequado.

---

## 6. Montar CSV com concatenação espalhada

Centralize parser/formatter quando crescer.

---

## 7. Usar Math.random em backend profissional

Prefira `Random` ou `SecureRandom`, conforme o caso.

---

# Parte 19 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula212.app.ObjectsRequireNonNullApp
java -cp out br.com.curso.aula212.app.ObjectsEqualsApp
java -cp out br.com.curso.aula212.app.ProdutoEqualsHashApp
java -cp out br.com.curso.aula212.app.ObjectsToStringApp
java -cp out br.com.curso.aula212.app.StringJoinApp
java -cp out br.com.curso.aula212.app.StringJoinerBasicoApp
java -cp out br.com.curso.aula212.app.StringJoinerResumoApp
java -cp out br.com.curso.aula212.app.UUIDBasicoApp
java -cp out br.com.curso.aula212.app.CorrelationIdApp
java -cp out br.com.curso.aula212.app.PedidoTecnicoApp
java -cp out br.com.curso.aula212.app.RandomBasicoApp
java -cp out br.com.curso.aula212.app.RandomSeedApp
java -cp out br.com.curso.aula212.app.SecureRandomBasicoApp
java -cp out br.com.curso.aula212.app.CodigoVerificacaoApp
java -cp out br.com.curso.aula212.app.TokenSeguroApp
java -cp out br.com.curso.aula212.app.ResumoUtilApp
java -cp out br.com.curso.aula212.app.RecordDtoApp
```

Para cada execução, responda:

```text
qual utilitário foi usado?
ele resolveu qual problema?
era regra de domínio ou apoio técnico?
havia risco de segurança?
UUID era técnico ou de negócio?
Random ou SecureRandom era mais adequado?
```

---

# Parte 20 — Desafio prático

## Contexto

Você vai criar um fluxo de solicitação com rastreabilidade.

O objetivo é praticar:

```text
UUID;
correlationId;
Instant;
Objects;
StringJoiner;
record;
SecureRandom;
separação entre ID técnico e código de negócio.
```

---

## Entidade Solicitacao

Crie:

```text
src\br\com\curso\aula212\dominio\solicitacao\Solicitacao.java
```

Campos:

```text
UUID id;
String protocolo;
String cliente;
String descricao;
Instant criadaEm;
String correlationId;
```

Regras:

```text
id obrigatório;
protocolo obrigatório;
cliente obrigatório;
descricao obrigatória;
criadaEm obrigatório;
correlationId obrigatório.
```

Métodos:

```java
String resumo()
```

Use `StringJoiner` no resumo.

---

## SolicitacaoFactory

Crie:

```text
src\br\com\curso\aula212\service\SolicitacaoFactory.java
```

Método:

```java
Solicitacao criar(String cliente, String descricao, Instant agora)
```

Regras:

```text
gerar UUID;
gerar correlationId com UUID;
gerar protocolo no formato SOL- + código numérico de 6 dígitos;
usar SecureRandom para o número;
criar Solicitação.
```

---

## SolicitacaoResponse record

Crie:

```text
src\br\com\curso\aula212\dto\SolicitacaoResponse.java
```

Campos:

```text
String id;
String protocolo;
String cliente;
String descricao;
String criadaEm;
String correlationId;
```

---

## Mapper

Crie:

```text
SolicitacaoMapper
```

Converta:

```text
UUID para String;
Instant para String;
demais campos diretos.
```

---

## App

Crie:

```text
SolicitacaoUtilitariosApp
```

Fluxo:

```text
criar 3 solicitações;
mapear para response;
imprimir resumo da entidade;
imprimir response;
mostrar correlationId.
```

Critérios:

```text
id técnico usa UUID;
protocolo é código de negócio;
correlationId é rastreabilidade;
SecureRandom gera número;
StringJoiner monta resumo;
record representa DTO;
Objects pode ser usado para obrigatoriedade simples.
```

---

# Parte 21 — Desafio extra

## Validação de duplicidade

Crie uma lista de solicitações.

Implemente service:

```text
SolicitacaoConsultaService
```

Métodos:

```java
boolean existeProtocolo(String protocolo)

Optional<Solicitacao> buscarPorId(UUID id)

Optional<Solicitacao> buscarPorCorrelationId(String correlationId)
```

Regras:

```text
usar Objects.equals quando fizer sentido;
não retornar null;
usar Optional;
validar parâmetros obrigatórios.
```

Objetivo:

```text
integrar utilitários modernos com Optional e Streams.
```

---

# Parte 22 — Debug recomendado

Coloque breakpoints em:

```text
ObjectsRequireNonNullApp
Produto.equals
Produto.hashCode
StringJoinerResumoApp
UUIDBasicoApp
CorrelationIdService.gerar
PedidoTecnicoFactory.criar
RandomSeedApp
CodigoVerificacaoService.gerarCodigoNumerico
TokenSeguroService.gerar
ResumoUtil.juntarComBarra
ClienteMapper.toResponse
```

Observe:

```text
como requireNonNull falha;
como Objects.equals lida com null;
como hashCode é calculado;
como UUID muda a cada execução;
como seed repete Random;
como SecureRandom gera códigos;
como StringJoiner monta texto;
como record gera métodos automaticamente.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve Objects.requireNonNull?
2. Qual limite do requireNonNull?
3. Para que serve Objects.equals?
4. Para que serve Objects.hash?
5. Quando usar String.join?
6. Quando usar StringJoiner?
7. Quando usar UUID?
8. Qual diferença entre UUID técnico e código de negócio?
9. Quando usar Random?
10. Quando usar SecureRandom?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Objects.requireNonNull;
usar Objects.equals;
usar Objects.hash;
usar Objects.toString;
usar String.join;
usar StringJoiner;
usar UUID.randomUUID;
criar correlationId;
usar Random;
usar Random com seed;
usar SecureRandom;
gerar código numérico seguro;
gerar token alfanumérico;
usar record como DTO simples;
evitar utilitário para regra de domínio;
resolver SolicitacaoUtilitariosApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-212-utilitarios-modernos-objects-stringjoiner-uuid-random-securerandom
git commit -m "Aula 212: utilitarios modernos objects stringjoiner uuid random securerandom"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
utilitários modernos reduzem ruído, mas não substituem regra de negócio.
```

Você estudou:

```text
Objects;
requireNonNull;
equals;
hash;
toString seguro;
String.join;
StringJoiner;
UUID;
correlationId;
Random;
seed;
SecureRandom;
código seguro;
token;
record como DTO simples.
```

Também reforçou uma decisão profissional:

```text
UUID identifica tecnicamente;
código de negócio comunica regra;
correlationId rastreia fluxo;
SecureRandom protege cenários sensíveis.
```

Na próxima aula, vamos fazer uma revisão técnica do Módulo 8 até aqui com exercícios integradores envolvendo:

```text
exceptions;
Resultado;
I/O;
CSV;
Date/Time;
UUID;
correlationId;
validações;
modelagem por camada.
```
