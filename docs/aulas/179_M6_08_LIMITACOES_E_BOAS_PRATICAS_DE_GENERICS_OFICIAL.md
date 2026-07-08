# 179 — M6.08 — Limitações e boas práticas de Generics

## Objetivo da aula

Nesta aula você vai consolidar as limitações e boas práticas de Generics em Java.

Nas aulas anteriores, você estudou:

```text
classes genéricas;
interfaces genéricas;
métodos genéricos;
bounded types;
wildcards;
PECS;
type erasure.
```

Agora o objetivo é transformar esse conhecimento em critério profissional.

Generics são poderosos, mas também podem deixar o código confuso quando usados sem necessidade.

Ao final desta aula, você deve conseguir:

```text
identificar quando usar generics;
identificar quando evitar generics;
entender limitações práticas;
evitar raw types;
evitar casts inseguros;
evitar abstração genérica exagerada;
nomear parâmetros genéricos com clareza;
usar generics em APIs de forma expressiva;
saber quando preferir tipo concreto;
saber quando usar Class<T>;
saber quando usar Supplier<T>;
saber quando usar wildcard;
saber quando usar bounded type;
aplicar boas práticas em código backend.
```

---

## Ideia principal

Generics não existem para deixar o código “mais avançado”.

Generics existem para resolver problemas reais:

```text
reutilização com segurança de tipo;
contratos genéricos;
coleções tipadas;
respostas padronizadas;
mappers;
repositories;
validações;
pipelines;
utilitários.
```

Mas quando usados sem critério, podem criar código difícil de ler.

Exemplo ruim:

```java
Processador<A, B, C, D, E>
```

Se ninguém entende a assinatura, o código perdeu clareza.

A regra é:

```text
Generics devem aumentar clareza, não esconder intenção.
```

---

## Revisão: o que Generics resolvem

Generics resolvem muito bem:

```text
evitar Object;
evitar cast manual;
evitar raw type;
garantir tipo em compilação;
reutilizar estruturas;
padronizar respostas;
criar contratos flexíveis;
tipar collections;
tipar repositories;
tipar mappers;
tipar validators.
```

Exemplo bom:

```java
List<OrdemServico>
```

é melhor que:

```java
List
```

ou:

```java
List<Object>
```

Porque comunica intenção e protege o código.

---

## Revisão: o que Generics não resolvem

Generics não resolvem:

```text
regra de negócio;
validação de domínio;
persistência;
transação;
concorrência;
segurança;
arquitetura;
baixo acoplamento sozinho;
modelagem ruim;
nomes ruins;
responsabilidade mal separada.
```

Exemplo:

```java
RepositorioGenerico<T>
```

não transforma automaticamente o sistema em bem arquitetado.

Generics ajudam no tipo.

A modelagem ainda depende de você.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-179-limitacoes-e-boas-praticas-de-generics
cd labs\m6\aula-179-limitacoes-e-boas-praticas-de-generics
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula179
mkdir src\br\com\curso\aula179\app
mkdir src\br\com\curso\aula179\contrato
mkdir src\br\com\curso\aula179\dominio
mkdir src\br\com\curso\aula179\dominio\valor
mkdir src\br\com\curso\aula179\dominio\ordemservico
mkdir src\br\com\curso\aula179\dominio\cliente
mkdir src\br\com\curso\aula179\infra
mkdir src\br\com\curso\aula179\util
```

---

## Boa prática 1 — Evite raw types

Raw type é usar uma classe genérica sem informar o tipo.

Errado:

```java
List lista = new ArrayList();
Map mapa = new HashMap();
Repositorio repositorio = new RepositorioMemoria();
```

Certo:

```java
List<String> nomes = new ArrayList<>();
Map<String, Integer> contagem = new HashMap<>();
Repositorio<CodigoOs, OrdemServico> repositorio = new RepositorioMemoria<>();
```

Raw type tira segurança do compilador.

---

## Exemplo ruim com raw type

Crie:

```text
src\br\com\curso\aula179\app\RawTypeRuimApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import java.util.ArrayList;
import java.util.List;

public class RawTypeRuimApp {
    public static void main(String[] args) {
        List nomes = new ArrayList();

        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add(100);

        for (Object item : nomes) {
            String nome = (String) item;
            System.out.println(nome.toUpperCase());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.RawTypeRuimApp
```

---

## O que observar

O código aceita:

```java
nomes.add(100);
```

Mas depois tenta converter tudo para `String`.

Resultado provável:

```text
ClassCastException
```

Esse erro poderia ser evitado em compilação.

---

## Versão correta com Generics

Crie:

```text
src\br\com\curso\aula179\app\RawTypeCorrigidoApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import java.util.ArrayList;
import java.util.List;

public class RawTypeCorrigidoApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Mariana");

        for (String nome : nomes) {
            System.out.println(nome.toUpperCase());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.RawTypeCorrigidoApp
```

---

## Boa prática 2 — Nomeie parâmetros genéricos com intenção

Convenções comuns:

```text
T:
tipo genérico.

E:
elemento.

K:
chave.

V:
valor.

R:
resultado.

ID:
identificador.

S:
saída.

IN:
entrada.

OUT:
saída.
```

Exemplos bons:

```java
Repositorio<ID, T>
Conversor<IN, OUT>
Resultado<T>
Map<K, V>
```

Evite nomes que confundem:

```java
Processador<A, B, C>
```

Se a assinatura precisa de muitos tipos, talvez a abstração esteja grande demais.

---

## Exemplo de nomes claros

Crie:

```text
src\br\com\curso\aula179\contrato\Conversor.java
```

Código:

```java
package br.com.curso.aula179.contrato;

public interface Conversor<IN, OUT> {
    OUT converter(IN entrada);
}
```

Crie:

```text
src\br\com\curso\aula179\app\NomeGenericoClaroApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.contrato.Conversor;

public class NomeGenericoClaroApp {
    public static void main(String[] args) {
        Conversor<String, Integer> textoParaNumero = texto -> Integer.valueOf(texto.trim());

        Integer numero = textoParaNumero.converter("123");

        System.out.println("Número: " + numero);
        System.out.println("Dobro: " + (numero * 2));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.NomeGenericoClaroApp
```

---

## Por que IN e OUT ajudam

Em:

```java
Conversor<IN, OUT>
```

fica claro:

```text
IN é entrada;
OUT é saída.
```

Em alguns casos, isso é mais expressivo do que:

```java
Conversor<T, R>
```

Não existe uma regra única.

A escolha deve melhorar leitura.

---

## Boa prática 3 — Prefira tipo concreto quando não há reutilização real

Nem tudo precisa ser genérico.

Exemplo ruim:

```java
public class ConclusorGenerico<T> {
    public void concluir(T item) {
    }
}
```

Se apenas `OrdemServico` pode ser concluída, prefira:

```java
public class ConclusorOrdemServico {
    public void concluir(OrdemServico os) {
    }
}
```

Generics não devem esconder regra de negócio.

---

## Domínio para exemplos

Crie:

```text
src\br\com\curso\aula179\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula179.dominio.valor;

import java.util.Objects;

public final class CodigoOs {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = normalizado;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOs codigoOs)) {
            return false;
        }

        return Objects.equals(valor, codigoOs.valor);
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

Crie:

```text
src\br\com\curso\aula179\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula179.dominio.ordemservico;

public enum StatusOs {
    ABERTA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula179\dominio\ordemservico\OrdemServicoBoasPraticas.java
```

Código:

```java
package br.com.curso.aula179.dominio.ordemservico;

import br.com.curso.aula179.dominio.valor.CodigoOs;

public class OrdemServicoBoasPraticas {
    private final CodigoOs codigo;
    private final String cliente;
    private StatusOs status;

    public OrdemServicoBoasPraticas(CodigoOs codigo, String cliente) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.status = StatusOs.ABERTA;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public StatusOs status() {
        return status;
    }

    public void concluir() {
        if (status != StatusOs.ABERTA) {
            throw new IllegalStateException("Somente OS aberta pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public String resumo() {
        return codigo.resumo() + " | Cliente: " + cliente + " | Status: " + status;
    }
}
```

---

## Exemplo: tipo concreto melhor que genérico

Crie:

```text
src\br\com\curso\aula179\infra\ConclusorOrdemServico.java
```

Código:

```java
package br.com.curso.aula179.infra;

import br.com.curso.aula179.dominio.ordemservico.OrdemServicoBoasPraticas;

public class ConclusorOrdemServico {
    public void concluir(OrdemServicoBoasPraticas os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        os.concluir();
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\TipoConcretoMelhorApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.dominio.ordemservico.OrdemServicoBoasPraticas;
import br.com.curso.aula179.dominio.valor.CodigoOs;
import br.com.curso.aula179.infra.ConclusorOrdemServico;

public class TipoConcretoMelhorApp {
    public static void main(String[] args) {
        OrdemServicoBoasPraticas os = new OrdemServicoBoasPraticas(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        );

        new ConclusorOrdemServico().concluir(os);

        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.TipoConcretoMelhorApp
```

---

## O que esse exemplo ensina

A regra de concluir pertence à OS.

Não precisamos criar uma abstração genérica para isso.

Código específico pode ser mais claro.

Boa arquitetura não é transformar tudo em genérico.

Boa arquitetura é representar a intenção correta.

---

## Boa prática 4 — Use bounded type quando precisa de contrato

Se você precisa chamar um método específico, use limite.

Crie:

```text
src\br\com\curso\aula179\contrato\PossuiResumo.java
```

Código:

```java
package br.com.curso.aula179.contrato;

public interface PossuiResumo {
    String resumo();
}
```

Crie:

```text
src\br\com\curso\aula179\util\ImpressoraResumoSegura.java
```

Código:

```java
package br.com.curso.aula179.util;

import br.com.curso.aula179.contrato.PossuiResumo;

import java.util.List;

public final class ImpressoraResumoSegura {
    private ImpressoraResumoSegura() {
    }

    public static <T extends PossuiResumo> void imprimirTodos(List<T> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        for (T item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            System.out.println("- " + item.resumo());
        }
    }
}
```

---

## Ajustando OS para implementar PossuiResumo

Substitua `OrdemServicoBoasPraticas.java` por:

```java
package br.com.curso.aula179.dominio.ordemservico;

import br.com.curso.aula179.contrato.PossuiResumo;
import br.com.curso.aula179.dominio.valor.CodigoOs;

public class OrdemServicoBoasPraticas implements PossuiResumo {
    private final CodigoOs codigo;
    private final String cliente;
    private StatusOs status;

    public OrdemServicoBoasPraticas(CodigoOs codigo, String cliente) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.status = StatusOs.ABERTA;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public StatusOs status() {
        return status;
    }

    public void concluir() {
        if (status != StatusOs.ABERTA) {
            throw new IllegalStateException("Somente OS aberta pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    @Override
    public String resumo() {
        return codigo.resumo() + " | Cliente: " + cliente + " | Status: " + status;
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\BoundedTypeBoaPraticaApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.dominio.ordemservico.OrdemServicoBoasPraticas;
import br.com.curso.aula179.dominio.valor.CodigoOs;
import br.com.curso.aula179.util.ImpressoraResumoSegura;

import java.util.List;

public class BoundedTypeBoaPraticaApp {
    public static void main(String[] args) {
        List<OrdemServicoBoasPraticas> ordens = List.of(
                new OrdemServicoBoasPraticas(new CodigoOs("OS-2026-0001"), "Ana"),
                new OrdemServicoBoasPraticas(new CodigoOs("OS-2026-0002"), "Carlos")
        );

        ImpressoraResumoSegura.imprimirTodos(ordens);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.BoundedTypeBoaPraticaApp
```

---

## Por que esse uso é bom

O método genérico precisa chamar:

```java
item.resumo()
```

Então ele exige:

```java
<T extends PossuiResumo>
```

Isso é uma boa prática.

O limite existe porque o método precisa dele.

---

## Boa prática 5 — Use wildcard em parâmetros, com critério

Wildcards são úteis principalmente em parâmetros.

Exemplo:

```java
public static void imprimir(List<? extends PossuiResumo> itens)
```

Esse método aceita lista de qualquer subtipo de `PossuiResumo`.

Mas se você precisa retornar o mesmo tipo, use `<T>`.

---

## Utilitário com wildcard

Crie:

```text
src\br\com\curso\aula179\util\RelatorioWildcardSeguro.java
```

Código:

```java
package br.com.curso.aula179.util;

import br.com.curso.aula179.contrato.PossuiResumo;

import java.util.List;

public final class RelatorioWildcardSeguro {
    private RelatorioWildcardSeguro() {
    }

    public static void imprimir(String titulo, List<? extends PossuiResumo> itens) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        System.out.println(titulo + ":");

        for (PossuiResumo item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            System.out.println("- " + item.resumo());
        }
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\WildcardBoaPraticaApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.dominio.ordemservico.OrdemServicoBoasPraticas;
import br.com.curso.aula179.dominio.valor.CodigoOs;
import br.com.curso.aula179.util.RelatorioWildcardSeguro;

import java.util.List;

public class WildcardBoaPraticaApp {
    public static void main(String[] args) {
        List<OrdemServicoBoasPraticas> ordens = List.of(
                new OrdemServicoBoasPraticas(new CodigoOs("OS-2026-0001"), "Ana"),
                new OrdemServicoBoasPraticas(new CodigoOs("OS-2026-0002"), "Carlos")
        );

        RelatorioWildcardSeguro.imprimir("Ordens", ordens);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.WildcardBoaPraticaApp
```

---

## Bounded type vs wildcard

Compare:

```java
public static <T extends PossuiResumo> void imprimirTodos(List<T> itens)
```

com:

```java
public static void imprimir(List<? extends PossuiResumo> itens)
```

Os dois podem funcionar.

Use `<T>` quando você precisa preservar ou relacionar o tipo `T`.

Use `? extends` quando você só precisa ler como `PossuiResumo`.

A versão com wildcard é mais simples quando o tipo exato não importa.

---

## Boa prática 6 — Evite retornar wildcard sem necessidade

Evite:

```java
public List<? extends PossuiResumo> listar()
```

Isso pode dificultar quem chama o método.

Prefira:

```java
public List<OrdemServicoBoasPraticas> listarOrdens()
```

ou:

```java
public List<PossuiResumo> listarResumos()
```

Wildcards são mais úteis em parâmetros do que em retornos públicos.

---

## Boa prática 7 — Use Class<T> quando precisa do tipo em runtime

Por causa de type erasure, às vezes você precisa passar o tipo explicitamente.

Crie:

```text
src\br\com\curso\aula179\util\ConversorSeguro.java
```

Código:

```java
package br.com.curso.aula179.util;

public final class ConversorSeguro {
    private ConversorSeguro() {
    }

    public static <T> T converter(Object valor, Class<T> tipo) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (!tipo.isInstance(valor)) {
            throw new IllegalArgumentException("Valor não é do tipo " + tipo.getSimpleName());
        }

        return tipo.cast(valor);
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\ClassTBoaPraticaApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.util.ConversorSeguro;

public class ClassTBoaPraticaApp {
    public static void main(String[] args) {
        Object valorTexto = "Ana";
        Object valorNumero = 100;

        String texto = ConversorSeguro.converter(valorTexto, String.class);
        Integer numero = ConversorSeguro.converter(valorNumero, Integer.class);

        System.out.println("Texto: " + texto.toUpperCase());
        System.out.println("Número dobrado: " + (numero * 2));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.ClassTBoaPraticaApp
```

---

## Quando Class<T> é útil

Use `Class<T>` quando:

```text
precisa validar tipo em runtime;
precisa criar objeto por reflection;
precisa integrar com framework;
precisa desserializar;
precisa fazer conversão segura;
precisa carregar metadados do tipo.
```

Mas não use sem necessidade.

Se o compilador já sabe o tipo, `Class<T>` pode ser excesso.

---

## Boa prática 8 — Use Supplier<T> para criação de objetos

Se você só precisa criar objetos, `Supplier<T>` pode ser melhor que reflection.

Crie:

```text
src\br\com\curso\aula179\util\CriadorComSupplier.java
```

Código:

```java
package br.com.curso.aula179.util;

import java.util.function.Supplier;

public class CriadorComSupplier<T> {
    private final Supplier<T> supplier;

    public CriadorComSupplier(Supplier<T> supplier) {
        if (supplier == null) {
            throw new IllegalArgumentException("Supplier é obrigatório.");
        }

        this.supplier = supplier;
    }

    public T criar() {
        T item = supplier.get();

        if (item == null) {
            throw new IllegalStateException("Supplier retornou null.");
        }

        return item;
    }
}
```

Crie:

```text
src\br\com\curso\aula179\dominio\cliente\ClienteTemporario.java
```

Código:

```java
package br.com.curso.aula179.dominio.cliente;

public class ClienteTemporario {
    private final String nome;

    public ClienteTemporario() {
        this.nome = "Cliente temporário";
    }

    public String nome() {
        return nome;
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\SupplierBoaPraticaApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.dominio.cliente.ClienteTemporario;
import br.com.curso.aula179.util.CriadorComSupplier;

public class SupplierBoaPraticaApp {
    public static void main(String[] args) {
        CriadorComSupplier<ClienteTemporario> criador =
                new CriadorComSupplier<>(ClienteTemporario::new);

        ClienteTemporario cliente = criador.criar();

        System.out.println(cliente.nome());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.SupplierBoaPraticaApp
```

---

## Boa prática 9 — Não use Generics para apagar diferenças de domínio

Imagine:

```java
ServicoGenerico<T>
```

para:

```text
Cliente;
Pedido;
OrdemServico;
Contrato;
Produto.
```

Pode parecer reutilização.

Mas cada domínio tem regras próprias.

Exemplo:

```text
OS pode ser concluída;
Contrato pode ser aprovado;
Produto pode ser inativado;
Cliente pode ser bloqueado.
```

Se tudo vira `T`, as diferenças somem.

Isso é perigoso.

Generics devem reduzir duplicação técnica.

Não devem apagar regra de negócio.

---

## Boa prática 10 — Prefira APIs simples quando possível

Compare:

```java
public static <E, S, R, C> R processar(E entrada, S servico, C contexto)
```

com:

```java
public ResultadoImportacao processar(ArquivoImportacao arquivo)
```

A segunda pode ser muito melhor.

Código profissional não é o mais genérico.

É o mais claro, correto e sustentável.

---

## Exemplo de API genérica boa

Crie:

```text
src\br\com\curso\aula179\util\ResultadoOperacao.java
```

Código:

```java
package br.com.curso.aula179.util;

public class ResultadoOperacao<T> {
    private final boolean sucesso;
    private final String mensagem;
    private final T valor;

    private ResultadoOperacao(boolean sucesso, String mensagem, T valor) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.sucesso = sucesso;
        this.mensagem = mensagem.trim();
        this.valor = valor;
    }

    public static <T> ResultadoOperacao<T> sucesso(String mensagem, T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        return new ResultadoOperacao<>(true, mensagem, valor);
    }

    public static <T> ResultadoOperacao<T> falha(String mensagem) {
        return new ResultadoOperacao<>(false, mensagem, null);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public boolean falha() {
        return !sucesso;
    }

    public T valor() {
        if (falha()) {
            throw new IllegalStateException("Resultado de falha não possui valor.");
        }

        return valor;
    }

    public String resumo() {
        return (sucesso ? "SUCESSO" : "FALHA") + " | " + mensagem;
    }
}
```

Crie:

```text
src\br\com\curso\aula179\app\ResultadoOperacaoBoaPraticaApp.java
```

Código:

```java
package br.com.curso.aula179.app;

import br.com.curso.aula179.dominio.ordemservico.OrdemServicoBoasPraticas;
import br.com.curso.aula179.dominio.valor.CodigoOs;
import br.com.curso.aula179.util.ResultadoOperacao;

public class ResultadoOperacaoBoaPraticaApp {
    public static void main(String[] args) {
        OrdemServicoBoasPraticas os = new OrdemServicoBoasPraticas(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        );

        ResultadoOperacao<OrdemServicoBoasPraticas> resultado =
                ResultadoOperacao.sucesso("OS localizada.", os);

        System.out.println(resultado.resumo());
        System.out.println(resultado.valor().resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula179.app.ResultadoOperacaoBoaPraticaApp
```

---

## Por que ResultadoOperacao<T> é uma boa abstração

A estrutura é comum:

```text
sucesso;
mensagem;
valor.
```

O tipo do valor muda:

```text
OrdemServico;
Cliente;
Produto;
Contrato;
String;
Integer.
```

Então generics fazem sentido.

A abstração é pequena, clara e reutilizável.

---

## Checklist de boas práticas

Antes de criar algo genérico, pergunte:

```text
1. Existe reutilização real?
2. O tipo muda, mas o comportamento permanece?
3. Generics aumentam segurança?
4. Generics reduzem cast?
5. A assinatura continua legível?
6. Existe um contrato claro?
7. Bounded type melhoraria a intenção?
8. Wildcard é necessário ou <T> basta?
9. Estou escondendo regra de negócio?
10. Um tipo concreto seria mais claro?
```

Se a maioria das respostas for negativa, não use generics.

---

## Boas práticas resumidas

```text
Use List<T>, Set<T>, Map<K,V> sempre que possível.
Evite raw type.
Evite Object sem necessidade.
Use T para tipo genérico simples.
Use ID quando for identificador.
Use K e V para chave e valor.
Use IN e OUT para conversores.
Use bounded type quando precisar de contrato.
Use wildcard em parâmetros flexíveis.
Use Class<T> quando precisar do tipo em runtime.
Use Supplier<T> para criação flexível.
Evite retornar wildcard sem necessidade.
Evite abstração genérica exagerada.
Não esconda regra de negócio atrás de T.
```

---

## Generics no caminho do curso

Este módulo prepara você para várias partes do curso:

```text
Optional<T>;
Stream<T>;
Function<T, R>;
Predicate<T>;
Consumer<T>;
Supplier<T>;
Comparator<? super T>;
ResponseEntity<T>;
Page<T>;
JpaRepository<T, ID>;
ApiResponse<T>;
mappers;
repositories;
services;
testes;
arquitetura.
```

Então este conteúdo é base para Java Backend profissional.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Raw type

Execute:

```powershell
java -cp out br.com.curso.aula179.app.RawTypeRuimApp
java -cp out br.com.curso.aula179.app.RawTypeCorrigidoApp
```

### Parte 2 — Nome e tipo concreto

Execute:

```powershell
java -cp out br.com.curso.aula179.app.NomeGenericoClaroApp
java -cp out br.com.curso.aula179.app.TipoConcretoMelhorApp
```

### Parte 3 — Bounded type e wildcard

Execute:

```powershell
java -cp out br.com.curso.aula179.app.BoundedTypeBoaPraticaApp
java -cp out br.com.curso.aula179.app.WildcardBoaPraticaApp
```

### Parte 4 — Runtime e criação

Execute:

```powershell
java -cp out br.com.curso.aula179.app.ClassTBoaPraticaApp
java -cp out br.com.curso.aula179.app.SupplierBoaPraticaApp
```

### Parte 5 — Resultado genérico

Execute:

```powershell
java -cp out br.com.curso.aula179.app.ResultadoOperacaoBoaPraticaApp
```

---

## Desafio prático

Crie uma interface:

```text
src\br\com\curso\aula179\contrato\Identificavel.java
```

Ela deve ser:

```java
Identificavel<ID>
```

Método:

```text
ID id();
```

Depois crie uma classe:

```text
src\br\com\curso\aula179\infra\CatalogoSeguroMemoria.java
```

Ela deve ser:

```java
CatalogoSeguroMemoria<ID, T extends Identificavel<ID>>
```

Métodos:

```text
salvar(T item);
buscarObrigatorio(ID id);
existe(ID id);
listar();
quantidade();
```

Regras:

```text
item não pode ser null;
id não pode ser null;
id duplicado deve ser bloqueado;
listar deve retornar List.copyOf.
```

Depois crie app:

```text
src\br\com\curso\aula179\app\CatalogoSeguroMemoriaApp.java
```

Critério principal:

```text
usar bounded type com propósito real.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula179\util\MapperSeguro.java
```

Interface:

```java
MapperSeguro<IN, OUT>
```

Método:

```text
OUT mapear(IN entrada);
```

Crie utilitário:

```text
src\br\com\curso\aula179\util\MapperListasSeguro.java
```

Método:

```java
public static <IN, OUT> List<OUT> mapearTodos(
        List<? extends IN> entradas,
        MapperSeguro<? super IN, ? extends OUT> mapper
)
```

Regras:

```text
entradas não pode ser null;
mapper não pode ser null;
entrada nula não é permitida;
saída nula não é permitida;
retornar List.copyOf.
```

Crie app:

```text
src\br\com\curso\aula179\app\MapperSeguroApp.java
```

Use para transformar:

```text
List<OrdemServicoBoasPraticas>
```

em:

```text
List<String>
```

Critério principal:

```text
usar PECS quando houver ganho real de flexibilidade.
```

---

## Erros comuns nesta aula

### 1. Criar genérico para parecer avançado

Generics devem resolver problema real.

### 2. Usar raw type

Evite sempre que possível.

### 3. Usar Object sem necessidade

Prefira tipos explícitos ou generics.

### 4. Criar bounded type sem usar o limite

Se você não chama métodos do limite, talvez ele não seja necessário.

### 5. Retornar wildcard

Geralmente dificulta o uso.

### 6. Abstrair regra de negócio específica

Nem tudo deve ser `T`.

### 7. Ignorar type erasure

Se precisa do tipo em runtime, talvez precise de `Class<T>` ou outra estratégia.

### 8. Usar Supplier quando precisa de metadados do tipo

Supplier cria objeto, mas não carrega informações de classe como `Class<T>`.

### 9. Usar Class<T> quando Supplier seria mais simples

Se só precisa criar, Supplier pode ser mais limpo.

### 10. Nomes genéricos ilegíveis

Se `A`, `B`, `C`, `D` confundem, renomeie.

---

## Debug recomendado

Use debug em:

```text
RawTypeRuimApp.java
ConversorSeguro.java
CriadorComSupplier.java
ImpressoraResumoSegura.java
RelatorioWildcardSeguro.java
ResultadoOperacao.java
```

Breakpoints recomendados:

```java
nomes.add(100)

String nome = (String) item

tipo.isInstance(valor)

tipo.cast(valor)

supplier.get()

item.resumo()

ResultadoOperacao.sucesso(...)

ResultadoOperacao.falha(...)
```

Observe:

```text
onde raw type quebra;
como Class<T> protege em runtime;
como Supplier cria objetos;
como bounded type permite chamar resumo();
como wildcard simplifica parâmetro de leitura;
como ResultadoOperacao<T> mantém tipo com clareza.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando Generics ajudam?
2. Quando Generics atrapalham?
3. Por que raw type é perigoso?
4. Quando usar bounded type?
5. Quando preferir tipo concreto?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
evitar raw types;
explicar por que Object deve ser evitado;
nomear parâmetros genéricos com clareza;
saber quando usar tipo concreto;
saber quando usar bounded type;
saber quando usar wildcard;
saber quando usar Class<T>;
saber quando usar Supplier<T>;
criar ResultadoOperacao<T>;
explicar riscos de abstração exagerada;
explicar por que Generics não substituem domínio;
resolver CatalogoSeguroMemoriaApp;
resolver MapperSeguroApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-179-limitacoes-e-boas-praticas-de-generics
git commit -m "Aula 179: limitacoes e boas praticas de generics"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Generics são uma ferramenta de clareza e segurança, não uma obrigação estética.
```

Use Generics para:

```text
proteger tipos;
evitar casts;
criar contratos reutilizáveis;
padronizar respostas;
criar utilitários seguros;
melhorar APIs.
```

Evite Generics quando:

```text
o tipo concreto é mais claro;
a regra é específica;
a assinatura fica confusa;
a abstração esconde o domínio.
```

Na próxima aula, vamos aplicar Generics em uma estrutura muito usada no Java moderno:

```text
Optional<T>
```

Vamos estudar ausência de valor, evitar null, modelar retorno de busca e entender por que Optional deve ser usado com critério em backend.
