# 178 — M6.07 — Type Erasure: Generics em tempo de compilação

## Objetivo da aula

Nesta aula você vai entender um dos pontos mais importantes, e menos óbvios, de Generics em Java:

```text
Type Erasure
```

Em português:

```text
apagamento de tipo
```

Nas aulas anteriores, você aprendeu a usar:

```java
List<String>
Map<CodigoOs, OrdemServico>
Resultado<T>
Repositorio<ID, T>
List<? extends Atendimento>
List<? super AtendimentoCritico>
```

Agora vamos entender uma pergunta fundamental:

```text
o que acontece com esses tipos genéricos quando o programa roda?
```

A resposta curta é:

```text
Generics protegem principalmente em tempo de compilação.
Em tempo de execução, boa parte da informação genérica é apagada.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é type erasure;
explicar por que generics protegem em compilação;
entender por que List<String> e List<Integer> viram basicamente List em runtime;
entender por que não dá para usar instanceof List<String>;
entender por que não dá para criar new T();
entender por que não dá para criar array de T diretamente;
entender por que casts podem aparecer no bytecode;
entender heap pollution;
entender raw type com mais profundidade;
entender limitações práticas de generics;
criar alternativas seguras usando Class<T>;
aplicar isso em cenários de backend.
```

---

## Ideia principal

Generics foram adicionados ao Java mantendo compatibilidade com código antigo.

Antes de Generics, já existiam classes como:

```java
List
ArrayList
Map
HashMap
```

Quando Generics chegaram, o Java precisava continuar compatível com códigos antigos.

Por isso, os tipos genéricos são usados pelo compilador para validar segurança, mas em runtime a JVM não guarda tudo exatamente como você escreveu.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
List<Integer> numeros = new ArrayList<>();
```

Em runtime, ambas são basicamente:

```text
ArrayList
```

A informação `String` e `Integer` foi usada na compilação, mas não fica disponível da forma que muita gente imagina.

Isso é type erasure.

---

## O que significa Type Erasure

Type erasure significa:

```text
o compilador apaga, substitui ou limita informações genéricas ao gerar bytecode.
```

Exemplo conceitual:

Código fonte:

```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
String nome = nomes.get(0);
```

Depois da compilação, a ideia fica mais próxima de:

```java
List nomes = new ArrayList();
nomes.add("Ana");
String nome = (String) nomes.get(0);
```

O compilador adiciona verificações e casts quando necessário.

Você escreve código seguro.

O compilador transforma isso para algo compatível com a JVM.

---

## Generics ajudam antes do programa rodar

Generics evitam erros como este:

```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add(100);
```

Esse código não compila.

Isso é excelente.

Mas, depois que o código compila, a JVM não fica tratando `List<String>` e `List<Integer>` como classes diferentes.

A segurança principal aconteceu antes:

```text
na compilação.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-178-type-erasure-generics-em-tempo-de-compilacao
cd labs\m6\aula-178-type-erasure-generics-em-tempo-de-compilacao
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula178
mkdir src\br\com\curso\aula178\app
mkdir src\br\com\curso\aula178\dominio
mkdir src\br\com\curso\aula178\dominio\valor
mkdir src\br\com\curso\aula178\dominio\ordemservico
mkdir src\br\com\curso\aula178\util
mkdir src\br\com\curso\aula178\infra
```

---

## Exemplo 1 — Segurança em compilação

Crie:

```text
src\br\com\curso\aula178\app\SegurancaCompilacaoApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import java.util.ArrayList;
import java.util.List;

public class SegurancaCompilacaoApp {
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
java -cp out br.com.curso.aula178.app.SegurancaCompilacaoApp
```

---

## O que esse exemplo mostra

A lista é:

```java
List<String>
```

Então o compilador sabe que:

```text
essa lista deve conter String.
```

Se você tentar:

```java
nomes.add(100);
```

não compila.

Esse é o principal ganho de Generics:

```text
erro cedo.
```

Erro cedo é melhor que erro em produção.

---

## Exemplo 2 — Classes em runtime

Crie:

```text
src\br\com\curso\aula178\app\ClasseRuntimeGenericsApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import java.util.ArrayList;
import java.util.List;

public class ClasseRuntimeGenericsApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        List<Integer> numeros = new ArrayList<>();

        System.out.println("Classe nomes: " + nomes.getClass().getName());
        System.out.println("Classe números: " + numeros.getClass().getName());

        System.out.println();
        System.out.println("Mesma classe em runtime? " + (nomes.getClass() == numeros.getClass()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.ClasseRuntimeGenericsApp
```

---

## O que observar

A saída deve mostrar que as duas listas são:

```text
java.util.ArrayList
```

Mesmo uma sendo:

```java
List<String>
```

e a outra:

```java
List<Integer>
```

Em runtime, a classe concreta é a mesma.

A JVM não cria uma classe diferente para cada tipo genérico.

Não existe:

```text
ArrayListString
ArrayListInteger
ArrayListCodigoOs
```

Existe:

```text
ArrayList
```

---

## Exemplo 3 — instanceof com Generics

Você talvez imagine que dá para fazer:

```java
if (objeto instanceof List<String>) {
}
```

Mas isso não compila.

Por quê?

Porque em runtime o Java não tem essa informação completa.

Crie:

```text
src\br\com\curso\aula178\app\InstanceofGenericsApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import java.util.List;

public class InstanceofGenericsApp {
    public static void main(String[] args) {
        Object objeto = List.of("Ana", "Carlos");

        if (objeto instanceof List<?>) {
            System.out.println("É uma lista.");
        }

        if (objeto instanceof List<?> lista) {
            System.out.println("Tamanho: " + lista.size());
            System.out.println("Primeiro item como Object: " + lista.get(0));
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.InstanceofGenericsApp
```

---

## O que esse exemplo ensina

Você pode testar:

```java
objeto instanceof List<?>
```

Mas não:

```java
objeto instanceof List<String>
```

Porque `List<String>` não está disponível como tipo verificável em runtime.

Quando precisar verificar conteúdo, você precisa validar os elementos manualmente.

---

## Exemplo 4 — Validando conteúdo manualmente

Crie:

```text
src\br\com\curso\aula178\util\ValidadorListaRuntime.java
```

Código:

```java
package br.com.curso.aula178.util;

import java.util.List;

public final class ValidadorListaRuntime {
    private ValidadorListaRuntime() {
    }

    public static boolean todosSaoString(List<?> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        for (Object item : itens) {
            if (!(item instanceof String)) {
                return false;
            }
        }

        return true;
    }

    public static boolean todosSaoInteger(List<?> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        for (Object item : itens) {
            if (!(item instanceof Integer)) {
                return false;
            }
        }

        return true;
    }
}
```

Crie:

```text
src\br\com\curso\aula178\app\ValidacaoConteudoRuntimeApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import br.com.curso.aula178.util.ValidadorListaRuntime;

import java.util.List;

public class ValidacaoConteudoRuntimeApp {
    public static void main(String[] args) {
        List<?> nomes = List.of("Ana", "Carlos", "Mariana");
        List<?> misturados = List.of("Ana", 10, true);

        System.out.println("Nomes são String? " + ValidadorListaRuntime.todosSaoString(nomes));
        System.out.println("Misturados são String? " + ValidadorListaRuntime.todosSaoString(misturados));

        System.out.println();
        System.out.println("Nomes são Integer? " + ValidadorListaRuntime.todosSaoInteger(nomes));
        System.out.println("Misturados são Integer? " + ValidadorListaRuntime.todosSaoInteger(misturados));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.ValidacaoConteudoRuntimeApp
```

---

## O que esse exemplo mostra

Como você não consegue testar:

```java
instanceof List<String>
```

você pode testar:

```text
é lista?
todos os elementos são String?
```

Isso aparece em cenários de integração, desserialização, dados externos e validação defensiva.

---

## Exemplo 5 — Não dá para criar `new T()`

Imagine uma classe genérica:

```java
public class Fabrica<T> {
    public T criar() {
        return new T();
    }
}
```

Isso não compila.

Por quê?

Porque em runtime o Java não sabe qual é o tipo real de `T`.

A solução comum é receber um `Class<T>` ou uma fábrica.

Vamos ver a opção com `Class<T>`.

---

## Criando fábrica com Class<T>

Crie:

```text
src\br\com\curso\aula178\util\FabricaComClass.java
```

Código:

```java
package br.com.curso.aula178.util;

public class FabricaComClass<T> {
    private final Class<T> tipo;

    public FabricaComClass(Class<T> tipo) {
        if (tipo == null) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        this.tipo = tipo;
    }

    public T criar() {
        try {
            return tipo.getDeclaredConstructor().newInstance();
        } catch (ReflectiveOperationException erro) {
            throw new IllegalStateException("Não foi possível criar instância de " + tipo.getSimpleName(), erro);
        }
    }

    public String nomeDoTipo() {
        return tipo.getSimpleName();
    }
}
```

---

## Classe simples para testar fábrica

Crie:

```text
src\br\com\curso\aula178\dominio\ordemservico\ComandoSimples.java
```

Código:

```java
package br.com.curso.aula178.dominio.ordemservico;

public class ComandoSimples {
    private String descricao;

    public ComandoSimples() {
        this.descricao = "Comando criado pelo construtor padrão.";
    }

    public String descricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
}
```

Crie:

```text
src\br\com\curso\aula178\app\FabricaComClassApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import br.com.curso.aula178.dominio.ordemservico.ComandoSimples;
import br.com.curso.aula178.util.FabricaComClass;

public class FabricaComClassApp {
    public static void main(String[] args) {
        FabricaComClass<ComandoSimples> fabrica = new FabricaComClass<>(ComandoSimples.class);

        ComandoSimples comando = fabrica.criar();

        System.out.println("Tipo: " + fabrica.nomeDoTipo());
        System.out.println("Comando: " + comando.descricao());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.FabricaComClassApp
```

---

## Cuidado com reflexão

Esse exemplo usa reflexão:

```java
tipo.getDeclaredConstructor().newInstance()
```

Reflexão é poderosa, mas deve ser usada com critério.

Em backend real, frameworks como Spring, Jackson e Hibernate usam reflexão por baixo.

Você não deve sair usando reflexão em todo lugar.

Aqui o objetivo é entender uma alternativa para a limitação de:

```java
new T()
```

---

## Exemplo 6 — Alternativa melhor: Supplier<T>

Muitas vezes, uma alternativa mais limpa que `Class<T>` é receber uma fábrica funcional.

Crie:

```text
src\br\com\curso\aula178\util\FabricaComSupplier.java
```

Código:

```java
package br.com.curso.aula178.util;

import java.util.function.Supplier;

public class FabricaComSupplier<T> {
    private final Supplier<T> supplier;

    public FabricaComSupplier(Supplier<T> supplier) {
        if (supplier == null) {
            throw new IllegalArgumentException("Supplier é obrigatório.");
        }

        this.supplier = supplier;
    }

    public T criar() {
        T valor = supplier.get();

        if (valor == null) {
            throw new IllegalStateException("Supplier retornou null.");
        }

        return valor;
    }
}
```

Crie:

```text
src\br\com\curso\aula178\app\FabricaComSupplierApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import br.com.curso.aula178.dominio.ordemservico.ComandoSimples;
import br.com.curso.aula178.util.FabricaComSupplier;

public class FabricaComSupplierApp {
    public static void main(String[] args) {
        FabricaComSupplier<ComandoSimples> fabrica =
                new FabricaComSupplier<>(ComandoSimples::new);

        ComandoSimples comando = fabrica.criar();

        System.out.println(comando.descricao());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.FabricaComSupplierApp
```

---

## Class<T> vs Supplier<T>

### Class<T>

Útil quando você precisa saber o tipo em runtime:

```text
nome da classe;
reflection;
criação por construtor padrão;
integração com frameworks.
```

### Supplier<T>

Útil quando você só precisa criar objetos:

```text
mais simples;
mais flexível;
não depende de reflection diretamente;
funciona com construtores customizados.
```

Em código de aplicação, `Supplier<T>` costuma ser mais limpo.

---

## Exemplo 7 — Não dá para criar array de T diretamente

Outro problema comum:

```java
T[] itens = new T[10];
```

Isso não compila.

Motivo:

```text
o Java não sabe o tipo real de T em runtime.
```

Arrays precisam conhecer o tipo do componente em runtime.

Generics sofrem type erasure.

Por isso há conflito.

---

## Alternativa: usar List<T>

Na maioria dos casos, prefira:

```java
List<T>
```

em vez de:

```java
T[]
```

Crie:

```text
src\br\com\curso\aula178\util\BufferGenerico.java
```

Código:

```java
package br.com.curso.aula178.util;

import java.util.ArrayList;
import java.util.List;

public class BufferGenerico<T> {
    private final List<T> itens;

    public BufferGenerico() {
        this.itens = new ArrayList<>();
    }

    public void adicionar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        itens.add(item);
    }

    public List<T> listar() {
        return List.copyOf(itens);
    }

    public int tamanho() {
        return itens.size();
    }
}
```

Crie:

```text
src\br\com\curso\aula178\app\BufferGenericoApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import br.com.curso.aula178.util.BufferGenerico;

public class BufferGenericoApp {
    public static void main(String[] args) {
        BufferGenerico<String> buffer = new BufferGenerico<>();

        buffer.adicionar("Ana");
        buffer.adicionar("Carlos");

        System.out.println("Tamanho: " + buffer.tamanho());
        System.out.println("Itens: " + buffer.listar());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.BufferGenericoApp
```

---

## Heap Pollution

Heap pollution acontece quando uma variável parametrizada aponta para um objeto que não respeita aquele tipo parametrizado.

Isso geralmente aparece com:

```text
raw types;
casts inseguros;
varargs com generics;
mistura de código antigo com código genérico.
```

Exemplo clássico:

```java
List<String> nomes = new ArrayList<>();
List raw = nomes;
raw.add(100);
String nome = nomes.get(0);
```

O compilador pode avisar.

Mas, se você ignora o aviso, o erro pode aparecer em runtime.

---

## Exemplo 8 — Heap pollution com raw type

Crie:

```text
src\br\com\curso\aula178\app\HeapPollutionRawTypeApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import java.util.ArrayList;
import java.util.List;

public class HeapPollutionRawTypeApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Ana");

        adicionarValorInseguro(nomes);

        for (String nome : nomes) {
            System.out.println(nome.toUpperCase());
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private static void adicionarValorInseguro(List lista) {
        lista.add(100);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.HeapPollutionRawTypeApp
```

---

## O que observar

Esse código pode compilar, mas quebra em runtime.

Motivo:

```text
a lista era List<String>;
um raw type permitiu adicionar Integer;
na leitura como String, ocorre ClassCastException.
```

Por isso a regra continua:

```text
evite raw types.
```

O aviso do compilador não é enfeite.

---

## Sobre @SuppressWarnings

Usamos:

```java
@SuppressWarnings({"rawtypes", "unchecked"})
```

apenas para deixar o exemplo mais claro.

Em código real, não use `SuppressWarnings` para esconder problema sem entender.

Se precisar usar, documente o motivo.

Regra:

```text
warning de generics deve ser tratado com seriedade.
```

---

## Type erasure e overload

Type erasure também afeta sobrecarga de métodos.

Você não pode ter dois métodos assim:

```java
public void processar(List<String> nomes) {
}

public void processar(List<Integer> numeros) {
}
```

Por quê?

Depois do apagamento, ambos ficam parecidos com:

```java
processar(List)
```

Isso causa conflito.

Crie:

```text
src\br\com\curso\aula178\app\OverloadGenericsApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import java.util.List;

public class OverloadGenericsApp {
    public static void main(String[] args) {
        processarTextos(List.of("Ana", "Carlos"));
        processarNumeros(List.of(10, 20));
    }

    private static void processarTextos(List<String> textos) {
        System.out.println("Textos: " + textos);
    }

    private static void processarNumeros(List<Integer> numeros) {
        System.out.println("Números: " + numeros);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.OverloadGenericsApp
```

---

## O que esse exemplo ensina

Em vez de sobrecarregar apenas mudando o tipo genérico da lista, use nomes diferentes:

```java
processarTextos
processarNumeros
```

Ou use outro critério real de assinatura.

Type erasure impede overload baseado apenas em:

```text
List<String> vs List<Integer>
```

---

## Domínio para exemplo backend

Crie:

```text
src\br\com\curso\aula178\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula178.dominio.valor;

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
src\br\com\curso\aula178\dominio\ordemservico\OrdemServicoErasure.java
```

Código:

```java
package br.com.curso.aula178.dominio.ordemservico;

import br.com.curso.aula178.dominio.valor.CodigoOs;

public class OrdemServicoErasure {
    private final CodigoOs codigo;
    private final String cliente;

    public OrdemServicoErasure(CodigoOs codigo, String cliente) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String resumo() {
        return codigo.resumo() + " | Cliente: " + cliente;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Response genérica com Class<T>

Em backend, às vezes você precisa carregar o tipo da resposta.

Crie:

```text
src\br\com\curso\aula178\util\RespostaTipada.java
```

Código:

```java
package br.com.curso.aula178.util;

public class RespostaTipada<T> {
    private final Class<T> tipo;
    private final T dados;
    private final String mensagem;

    private RespostaTipada(Class<T> tipo, T dados, String mensagem) {
        if (tipo == null) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.tipo = tipo;
        this.dados = dados;
        this.mensagem = mensagem.trim();
    }

    public static <T> RespostaTipada<T> comDados(Class<T> tipo, T dados, String mensagem) {
        if (dados == null) {
            throw new IllegalArgumentException("Dados são obrigatórios.");
        }

        if (!tipo.isInstance(dados)) {
            throw new IllegalArgumentException("Dados não são instância de " + tipo.getSimpleName());
        }

        return new RespostaTipada<>(tipo, dados, mensagem);
    }

    public Class<T> tipo() {
        return tipo;
    }

    public T dados() {
        return dados;
    }

    public String mensagem() {
        return mensagem;
    }

    public String resumo() {
        return "Tipo: " + tipo.getSimpleName() + " | Mensagem: " + mensagem + " | Dados: " + dados;
    }
}
```

Crie:

```text
src\br\com\curso\aula178\app\RespostaTipadaApp.java
```

Código:

```java
package br.com.curso.aula178.app;

import br.com.curso.aula178.dominio.ordemservico.OrdemServicoErasure;
import br.com.curso.aula178.dominio.valor.CodigoOs;
import br.com.curso.aula178.util.RespostaTipada;

public class RespostaTipadaApp {
    public static void main(String[] args) {
        OrdemServicoErasure os = new OrdemServicoErasure(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        );

        RespostaTipada<OrdemServicoErasure> resposta =
                RespostaTipada.comDados(
                        OrdemServicoErasure.class,
                        os,
                        "OS encontrada com sucesso."
                );

        System.out.println(resposta.resumo());
        System.out.println("Tipo carregado em runtime: " + resposta.tipo().getSimpleName());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula178.app.RespostaTipadaApp
```

---

## Por que Class<T> ajuda

Como type erasure apaga parte das informações genéricas, às vezes passamos:

```java
Class<T>
```

para manter uma referência ao tipo em runtime.

Exemplo:

```java
OrdemServicoErasure.class
String.class
Integer.class
```

Isso é comum em:

```text
serialização;
desserialização;
reflection;
frameworks;
mappers;
clientes HTTP;
validação dinâmica.
```

---

## O que Type Erasure limita

Type erasure traz limitações como:

```text
não usar instanceof List<String>;
não criar new T();
não criar T[] diretamente;
não sobrecarregar métodos só por List<String> e List<Integer>;
não obter facilmente T em runtime;
risco de heap pollution com raw types;
casts adicionados pelo compilador.
```

Essas limitações não tornam Generics ruins.

Elas apenas mostram como Java implementa Generics.

---

## O que Generics continuam resolvendo muito bem

Mesmo com type erasure, Generics são extremamente importantes.

Eles resolvem:

```text
segurança em compilação;
APIs expressivas;
remoção de casts manuais;
contratos reutilizáveis;
collections tipadas;
repositories tipados;
responses tipadas;
mappers tipados;
validação de tipo antes de runtime.
```

Generics não são runtime magic.

São compile-time safety.

---

## Ligação com backend

Em backend Java, type erasure explica muitas coisas que você verá.

Exemplos:

```text
por que frameworks pedem Class<T>;
por que Jackson usa TypeReference em listas genéricas;
por que ResponseEntity<T> é seguro no código, mas precisa de ajuda em runtime em alguns casos;
por que Optional<T> protege em compilação;
por que repositórios genéricos funcionam com tipo no código, mas frameworks precisam de metadados;
por que casts aparecem em integrações ruins;
por que raw types são perigosos.
```

Mais adiante, quando estudarmos Spring, Jackson, JPA e clientes HTTP, isso ficará muito prático.

---

## Sobre TypeReference

Você ainda vai ver algo como:

```java
new TypeReference<List<ClienteResponse>>() {}
```

Isso existe porque, com type erasure, capturar tipos genéricos complexos em runtime exige técnicas específicas.

Não vamos aprofundar agora.

Mas guarde:

```text
quando o tipo é simples, Class<T> pode ajudar;
quando o tipo é genérico composto, frameworks usam estratégias como TypeReference.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Segurança e runtime

Execute:

```powershell
java -cp out br.com.curso.aula178.app.SegurancaCompilacaoApp
java -cp out br.com.curso.aula178.app.ClasseRuntimeGenericsApp
java -cp out br.com.curso.aula178.app.InstanceofGenericsApp
```

### Parte 2 — Validação e criação

Execute:

```powershell
java -cp out br.com.curso.aula178.app.ValidacaoConteudoRuntimeApp
java -cp out br.com.curso.aula178.app.FabricaComClassApp
java -cp out br.com.curso.aula178.app.FabricaComSupplierApp
```

### Parte 3 — Limitações

Execute:

```powershell
java -cp out br.com.curso.aula178.app.BufferGenericoApp
java -cp out br.com.curso.aula178.app.HeapPollutionRawTypeApp
java -cp out br.com.curso.aula178.app.OverloadGenericsApp
```

### Parte 4 — Backend

Execute:

```powershell
java -cp out br.com.curso.aula178.app.RespostaTipadaApp
```

---

## Desafio prático

Crie uma classe:

```text
src\br\com\curso\aula178\util\ConversorSeguroRuntime.java
```

Método:

```java
public static <T> T converter(Object valor, Class<T> tipo)
```

Regras:

```text
valor não pode ser null;
tipo não pode ser null;
se valor não for instância do tipo, lançar IllegalArgumentException;
se for, retornar tipo.cast(valor).
```

Crie o app:

```text
src\br\com\curso\aula178\app\ConversorSeguroRuntimeApp.java
```

Teste com:

```text
Object contendo String;
Object contendo Integer;
Object contendo OrdemServicoErasure;
tentativa inválida de converter Integer para String.
```

Critério principal:

```text
usar Class<T> para validação segura em runtime.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula178\util\ValidadorListaTipada.java
```

Método:

```java
public static <T> boolean todosSaoDoTipo(List<?> itens, Class<T> tipo)
```

Regras:

```text
lista não pode ser null;
tipo não pode ser null;
retornar true se todos os itens forem instâncias do tipo;
lista vazia deve retornar true;
item null deve retornar false.
```

Crie outro método:

```java
public static <T> List<T> converterLista(List<?> itens, Class<T> tipo)
```

Regras:

```text
validar todos os itens;
se algum item for inválido, lançar erro;
retornar List<T> protegida.
```

Crie o app:

```text
src\br\com\curso\aula178\app\ValidadorListaTipadaApp.java
```

Use com:

```text
List<?> de String;
List<?> de Integer;
List<?> misturada;
List<?> de OrdemServicoErasure.
```

Critério principal:

```text
entender como compensar type erasure com validação explícita.
```

---

## Erros comuns nesta aula

### 1. Achar que List<String> existe como tipo completo em runtime

Em runtime, a classe concreta é basicamente `ArrayList`.

### 2. Tentar usar instanceof List<String>

Use `List<?>` e valide elementos se necessário.

### 3. Tentar criar new T()

Use `Class<T>`, `Supplier<T>` ou uma factory específica.

### 4. Tentar criar T[] diretamente

Prefira `List<T>`.

### 5. Ignorar warnings de raw type

Warnings de generics podem virar erro em runtime.

### 6. Usar @SuppressWarnings sem entender

Não esconda problema.

### 7. Sobrecarregar métodos só por tipo genérico

`List<String>` e `List<Integer>` apagam para algo equivalente a `List`.

### 8. Achar que type erasure torna generics inúteis

Generics continuam sendo essenciais para segurança em compilação.

---

## Debug recomendado

Use debug em:

```text
ClasseRuntimeGenericsApp.java
InstanceofGenericsApp.java
ValidadorListaRuntime.java
FabricaComClass.java
FabricaComSupplier.java
HeapPollutionRawTypeApp.java
RespostaTipada.java
```

Breakpoints recomendados:

```java
nomes.getClass()

objeto instanceof List<?>

item instanceof String

tipo.getDeclaredConstructor().newInstance()

supplier.get()

lista.add(100)

tipo.isInstance(dados)

tipo.cast(...)
```

Observe:

```text
como List<String> e List<Integer> têm a mesma classe em runtime;
como instanceof só consegue verificar List<?>;
como Class<T> mantém informação do tipo;
como raw type permite poluir lista;
como erro aparece tarde quando o warning é ignorado.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é type erasure?
2. Por que não dá para usar instanceof List<String>?
3. Por que não dá para criar new T()?
4. Como Class<T> ajuda em runtime?
5. O que é heap pollution?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar type erasure;
explicar generics em compilação;
mostrar que List<String> e List<Integer> têm mesma classe em runtime;
usar List<?> em instanceof;
validar conteúdo manualmente;
explicar por que new T() não compila;
usar Class<T>;
usar Supplier<T>;
evitar T[] direto;
explicar heap pollution;
explicar raw types com profundidade;
explicar overload limitado por erasure;
criar RespostaTipada<T>;
resolver ConversorSeguroRuntimeApp;
resolver ValidadorListaTipadaApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-178-type-erasure-generics-em-tempo-de-compilacao
git commit -m "Aula 178: type erasure generics em tempo de compilacao"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Generics oferecem segurança principalmente em tempo de compilação.
```

Com type erasure, você entendeu por que existem limitações como:

```text
não usar instanceof List<String>;
não criar new T();
não criar T[] diretamente;
não sobrecarregar apenas por tipo genérico;
tomar cuidado com raw types.
```

Também viu alternativas profissionais:

```text
Class<T>;
Supplier<T>;
List<T>;
validação explícita;
respostas tipadas.
```

Na próxima aula, vamos estudar limitações e boas práticas de Generics.

Vamos consolidar quando usar generics, quando evitar, como nomear tipos, como não exagerar na abstração e como preparar esse conhecimento para Optional, Streams, Repositories e APIs.
