# 146 — M5.01 — Collections Framework inicial

## Objetivo da aula

Nesta aula você vai iniciar o Módulo 5 da formação.

O Módulo 4 fechou a base de Orientação a Objetos, domínio, entidades, objetos de valor, composição e agregados. Agora vamos avançar para um recurso essencial do Java Backend:

```text
Collections Framework.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é Collections Framework;
entender por que arrays não são suficientes para sistemas reais;
diferenciar List, Set, Queue e Map em visão inicial;
entender a diferença entre interface e implementação;
usar ArrayList de forma inicial;
usar HashSet de forma inicial;
usar HashMap de forma inicial;
entender onde coleções aparecem em backend;
relacionar coleções com os objetos de domínio estudados no Módulo 4;
criar pequenos exemplos com coleções.
```

Esta aula é introdutória.

A partir das próximas aulas, vamos aprofundar cada estrutura com calma.

---

## Por que estudar Collections agora

Até aqui, você já trabalhou com arrays e listas internas em objetos.

Exemplo do Módulo 4:

```java
private final List<AtividadeOs> atividades;
private final List<OcorrenciaOs> ocorrencias;
```

Você já viu a utilidade de uma lista dentro de um agregado.

Agora vamos estudar as coleções de forma mais ampla.

Em backend, praticamente tudo envolve coleções:

```text
lista de clientes;
lista de ordens de serviço;
lista de atividades;
conjunto de permissões;
mapa de usuários por id;
fila de mensagens;
agrupamento de dados;
relatórios;
buscas;
filtros;
ordenação.
```

Dominar coleções é obrigatório para evoluir em Java.

---

## O que é Collections Framework

Collections Framework é um conjunto de interfaces, classes e algoritmos do Java para trabalhar com grupos de objetos.

Em vez de você criar sua própria estrutura do zero para armazenar vários dados, o Java já fornece estruturas prontas.

Exemplos:

```text
List;
ArrayList;
LinkedList;
Set;
HashSet;
TreeSet;
Queue;
Deque;
Map;
HashMap;
TreeMap;
Collections.
```

Essas estruturas ficam principalmente no pacote:

```java
java.util
```

Exemplo:

```java
import java.util.ArrayList;
import java.util.List;
```

---

## Problema que Collections resolve

Imagine que você quer armazenar várias OS.

Com array:

```java
String[] codigos = new String[3];

codigos[0] = "OS-2026-0001";
codigos[1] = "OS-2026-0002";
codigos[2] = "OS-2026-0003";
```

Isso funciona, mas é limitado.

Perguntas:

```text
e se vier uma quarta OS?
como remover uma OS do meio?
como verificar duplicidade?
como ordenar?
como buscar por código?
como agrupar por status?
como trabalhar com objetos complexos?
```

Arrays são úteis, mas coleções são mais flexíveis para sistemas reais.

---

## Arrays ainda são importantes?

Sim.

Arrays ainda existem e são importantes.

Mas em backend, normalmente você usa mais:

```text
List;
Set;
Map;
Queue;
Stream;
Optional.
```

Arrays aparecem mais em:

```text
baixo nível;
performance específica;
bibliotecas;
varargs;
estruturas simples;
alguns algoritmos;
integrações.
```

No dia a dia de backend, coleções aparecem muito mais.

---

## Diferença inicial entre array e coleção

Array:

```text
tem tamanho fixo;
usa índice;
pode armazenar primitivos e objetos;
tem sintaxe própria;
é mais simples e mais baixo nível.
```

Coleção:

```text
cresce conforme necessário;
tem métodos prontos;
trabalha com objetos;
tem interfaces e implementações;
facilita busca, remoção, ordenação e agrupamento.
```

Exemplo com array:

```java
String[] nomes = new String[3];
nomes[0] = "Ana";
```

Exemplo com List:

```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
```

---

## Interface e implementação

Um ponto essencial:

```text
List é interface.
ArrayList é implementação.
```

Interface define o comportamento esperado.

Implementação define como aquilo funciona por dentro.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
```

Leia assim:

```text
quero trabalhar com uma lista de Strings;
a implementação escolhida é ArrayList.
```

Isso é muito comum em Java profissional.

Você programa contra a interface e escolhe a implementação adequada.

---

## Principais famílias de coleções

Em visão inicial, pense assim:

```text
List:
sequência de elementos, permite repetidos, tem ordem por posição.

Set:
conjunto de elementos, não aceita duplicados.

Queue:
fila, geralmente trabalha com ordem de entrada e saída.

Map:
estrutura de chave e valor.
```

Exemplos práticos:

```text
List:
lista de atividades de uma OS.

Set:
conjunto de permissões de um usuário.

Queue:
fila de mensagens para processamento.

Map:
buscar uma OS pelo código.
```

---

## List em visão inicial

`List` representa uma lista ordenada por posição.

Exemplo:

```text
posição 0;
posição 1;
posição 2.
```

Ela permite itens repetidos.

Exemplo:

```java
List<String> nomes = new ArrayList<>();

nomes.add("Ana");
nomes.add("Carlos");
nomes.add("Ana");
```

Essa lista tem três elementos.

Mesmo "Ana" aparecendo duas vezes, a lista aceita.

---

## Set em visão inicial

`Set` representa um conjunto.

Conjunto não aceita duplicados.

Exemplo:

```java
Set<String> codigos = new HashSet<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0001");
codigos.add("OS-2026-0002");
```

O conjunto terá apenas dois valores.

Isso é útil quando você quer garantir unicidade.

Exemplo de backend:

```text
permissões;
tags;
códigos únicos;
categorias selecionadas;
ids sem repetição.
```

---

## Queue em visão inicial

`Queue` representa uma fila.

A ideia básica é:

```text
entra no fim;
sai do começo.
```

Exemplo:

```text
mensagem 1 entra;
mensagem 2 entra;
mensagem 3 entra;

processa mensagem 1;
processa mensagem 2;
processa mensagem 3.
```

Isso é útil para pensar em:

```text
fila de processamento;
tarefas pendentes;
mensagens;
ordem de atendimento.
```

Vamos aprofundar `Queue` mais adiante.

---

## Map em visão inicial

`Map` trabalha com chave e valor.

Exemplo:

```text
chave: OS-2026-0001
valor: objeto da OS
```

Com `Map`, você busca rapidamente um valor pela chave.

Exemplo:

```java
Map<String, String> clientesPorCodigo = new HashMap<>();

clientesPorCodigo.put("CLI-001", "Ana Silva");
clientesPorCodigo.put("CLI-002", "Carlos Souza");

System.out.println(clientesPorCodigo.get("CLI-001"));
```

Saída:

```text
Ana Silva
```

Em backend, `Map` aparece muito em:

```text
cache simples;
agrupamentos;
buscas por id;
contadores;
índices em memória;
retornos agregados.
```

---

## Map é Collection?

Aqui existe um detalhe importante.

`List`, `Set` e `Queue` fazem parte da hierarquia de `Collection`.

`Map` faz parte do Collections Framework, mas não estende `Collection`.

Em linguagem simples:

```text
Map está no mundo das coleções do Java,
mas não é uma Collection no sentido técnico da interface Collection.
```

Por quê?

Porque `Map` não guarda apenas elementos.

Ele guarda pares:

```text
chave -> valor
```

Esse detalhe será aprofundado depois.

Por enquanto, lembre:

```text
List, Set e Queue guardam elementos.
Map guarda pares de chave e valor.
```

---

## Collection e Collections

Cuidado com os nomes:

```text
Collection:
interface raiz de várias coleções.

Collections:
classe utilitária com métodos prontos.
```

Exemplo futuro:

```java
Collections.sort(lista);
Collections.unmodifiableList(lista);
```

Nesta aula, apenas guarde a diferença.

```text
Collection sem s = interface.
Collections com s = utilitário.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-146-collections-framework-inicial
cd labs\m5\aula-146-collections-framework-inicial
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula146
mkdir src\br\com\curso\aula146\app
mkdir src\br\com\curso\aula146\dominio
mkdir src\br\com\curso\aula146\dominio\ordemservico
```

Nesta aula, vamos criar exemplos pequenos.

---

## Primeiro exemplo com List

Crie:

```text
src\br\com\curso\aula146\app\PrimeiraListApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import java.util.ArrayList;
import java.util.List;

public class PrimeiraListApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        System.out.println("Quantidade de OS: " + codigosOs.size());
        System.out.println("Primeira OS: " + codigosOs.get(0));

        System.out.println();
        System.out.println("Lista completa:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }

        codigosOs.remove("OS-2026-0002");

        System.out.println();
        System.out.println("Depois da remoção:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.PrimeiraListApp
```

---

## O que observar no primeiro exemplo

Observe estes métodos:

```java
add(...)
size()
get(...)
remove(...)
```

Eles são operações comuns em lista.

Leia assim:

```text
add:
adiciona elemento.

size:
retorna quantidade.

get:
busca por posição.

remove:
remove elemento.
```

A lista começa vazia e cresce conforme adicionamos itens.

Isso já é uma diferença importante em relação ao array.

---

## Posição começa em zero

Assim como array, `List` também usa índice começando em zero.

Exemplo:

```java
codigosOs.get(0);
```

Retorna o primeiro elemento.

Se tentar acessar uma posição inválida:

```java
codigosOs.get(99);
```

vai ocorrer erro.

Esse erro será aprofundado em aulas futuras.

Por enquanto, lembre:

```text
se a lista tem 3 elementos, as posições são 0, 1 e 2.
```

---

## Exemplo com Set

Crie:

```text
src\br\com\curso\aula146\app\PrimeiroSetApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import java.util.HashSet;
import java.util.Set;

public class PrimeiroSetApp {
    public static void main(String[] args) {
        Set<String> codigosUnicos = new HashSet<>();

        codigosUnicos.add("OS-2026-0001");
        codigosUnicos.add("OS-2026-0002");
        codigosUnicos.add("OS-2026-0001");
        codigosUnicos.add("OS-2026-0003");
        codigosUnicos.add("OS-2026-0002");

        System.out.println("Quantidade de códigos únicos: " + codigosUnicos.size());

        System.out.println();
        System.out.println("Códigos:");

        for (String codigo : codigosUnicos) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Contém OS-2026-0002? " + codigosUnicos.contains("OS-2026-0002"));
        System.out.println("Contém OS-2026-9999? " + codigosUnicos.contains("OS-2026-9999"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.PrimeiroSetApp
```

---

## O que observar no Set

Mesmo adicionando códigos repetidos, o `Set` mantém apenas valores únicos.

Observe:

```java
codigosUnicos.add("OS-2026-0001");
codigosUnicos.add("OS-2026-0001");
```

O valor repetido não entra novamente.

Também observe:

```java
contains(...)
```

Esse método verifica se um elemento existe na coleção.

Ponto importante:

```text
HashSet não garante ordem de exibição.
```

Então a saída pode aparecer em ordem diferente da inserção.

Mais adiante veremos `LinkedHashSet` e `TreeSet`.

---

## Exemplo com Map

Crie:

```text
src\br\com\curso\aula146\app\PrimeiroMapApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import java.util.HashMap;
import java.util.Map;

public class PrimeiroMapApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");
        clientePorOs.put("OS-2026-0003", "Mariana Lima");

        System.out.println("Cliente da OS-2026-0001: " + clientePorOs.get("OS-2026-0001"));
        System.out.println("Cliente da OS-2026-9999: " + clientePorOs.get("OS-2026-9999"));

        System.out.println();
        System.out.println("Todas as entradas:");

        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }

        clientePorOs.put("OS-2026-0001", "Ana Silva Atualizada");

        System.out.println();
        System.out.println("Depois de sobrescrever a chave OS-2026-0001:");
        System.out.println(clientePorOs.get("OS-2026-0001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.PrimeiroMapApp
```

---

## O que observar no Map

Observe estes métodos:

```java
put(...)
get(...)
entrySet()
```

Leia assim:

```text
put:
coloca chave e valor no mapa.

get:
busca valor pela chave.

entrySet:
permite percorrer pares de chave e valor.
```

Ponto importante:

```text
se você usar put com uma chave que já existe, o valor anterior é substituído.
```

Exemplo:

```java
clientePorOs.put("OS-2026-0001", "Ana Silva");
clientePorOs.put("OS-2026-0001", "Ana Silva Atualizada");
```

A chave continua uma só.

O valor muda.

---

## Criando domínio simples para os próximos exemplos

Agora vamos criar uma classe simples de domínio para usar com coleções.

Crie:

```text
src\br\com\curso\aula146\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula146.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula146\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula146.dominio.ordemservico;

import java.time.LocalDate;

public class ResumoOrdemServico {
    private final String codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private final StatusOs status;

    public ResumoOrdemServico(
            String codigo,
            String cliente,
            LocalDate dataAtendimento,
            StatusOs status
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataAtendimento == null) {
            throw new IllegalArgumentException("Data de atendimento é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = status;
    }

    public String codigo() {
        return codigo;
    }

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }
}
```

---

## Exemplo de List com objetos

Crie:

```text
src\br\com\curso\aula146\app\ListComObjetosApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import br.com.curso.aula146.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula146.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ListComObjetosApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = new ArrayList<>();

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.CANCELADA
        ));

        System.out.println("Ordens cadastradas:");

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Somente concluídas:");

        for (ResumoOrdemServico os : ordens) {
            if (os.possuiStatus(StatusOs.CONCLUIDA)) {
                System.out.println("- " + os.resumo());
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.ListComObjetosApp
```

---

## O que observar na List com objetos

Agora a lista não guarda apenas `String`.

Ela guarda objetos:

```java
List<ResumoOrdemServico>
```

Isso é muito mais próximo de backend real.

Em sistemas profissionais, você raramente trabalha apenas com listas de texto.

Você trabalha com listas de objetos:

```text
List<Pedido>;
List<Cliente>;
List<OrdemServico>;
List<Contrato>;
List<Pagamento>;
List<Usuario>;
```

---

## Exemplo de Set com objetos simples

Nesta aula, vamos usar `Set<String>` para códigos.

Mais adiante, veremos `Set` com objetos e a importância de `equals` e `hashCode`.

Crie:

```text
src\br\com\curso\aula146\app\SetParaValidarDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import java.util.HashSet;
import java.util.Set;

public class SetParaValidarDuplicidadeApp {
    public static void main(String[] args) {
        Set<String> codigosCadastrados = new HashSet<>();

        cadastrar(codigosCadastrados, "OS-2026-0001");
        cadastrar(codigosCadastrados, "OS-2026-0002");
        cadastrar(codigosCadastrados, "OS-2026-0001");
        cadastrar(codigosCadastrados, "OS-2026-0003");

        System.out.println();
        System.out.println("Códigos cadastrados:");

        for (String codigo : codigosCadastrados) {
            System.out.println("- " + codigo);
        }
    }

    private static void cadastrar(Set<String> codigosCadastrados, String codigo) {
        boolean adicionado = codigosCadastrados.add(codigo);

        if (adicionado) {
            System.out.println("Código cadastrado: " + codigo);
        } else {
            System.out.println("Código duplicado ignorado: " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.SetParaValidarDuplicidadeApp
```

---

## O retorno do add no Set

No `Set`, o método `add` retorna boolean.

Exemplo:

```java
boolean adicionado = codigosCadastrados.add(codigo);
```

Se retornou `true`, o elemento foi adicionado.

Se retornou `false`, o elemento já existia.

Isso é muito útil para validar duplicidade.

---

## Exemplo de Map com objetos

Crie:

```text
src\br\com\curso\aula146\app\MapComObjetosApp.java
```

Código:

```java
package br.com.curso.aula146.app;

import br.com.curso.aula146.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula146.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MapComObjetosApp {
    public static void main(String[] args) {
        Map<String, ResumoOrdemServico> ordensPorCodigo = new HashMap<>();

        ResumoOrdemServico os1 = new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        );

        ResumoOrdemServico os2 = new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        );

        ordensPorCodigo.put(os1.codigo(), os1);
        ordensPorCodigo.put(os2.codigo(), os2);

        String codigoBusca = "OS-2026-0002";

        ResumoOrdemServico encontrada = ordensPorCodigo.get(codigoBusca);

        if (encontrada != null) {
            System.out.println("OS encontrada:");
            System.out.println(encontrada.resumo());
        } else {
            System.out.println("OS não encontrada: " + codigoBusca);
        }

        System.out.println();
        System.out.println("Todas as OS do Map:");

        for (Map.Entry<String, ResumoOrdemServico> entrada : ordensPorCodigo.entrySet()) {
            System.out.println("Chave: " + entrada.getKey());
            System.out.println("Valor: " + entrada.getValue().resumo());
            System.out.println();
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula146.app.MapComObjetosApp
```

---

## O que esse Map demonstra

Esse exemplo é muito próximo do repositório em memória do mini-projeto de OS.

Na aula 144, usamos algo parecido:

```java
Map<CodigoOs, OrdemServico> ordens;
```

Aqui usamos:

```java
Map<String, ResumoOrdemServico> ordensPorCodigo;
```

A ideia é:

```text
tenho uma chave;
quero encontrar rapidamente o objeto correspondente.
```

Essa é uma das utilidades mais fortes de `Map`.

---

## Generics em visão inicial

Quando você escreve:

```java
List<String>
```

está dizendo:

```text
esta lista guarda String.
```

Quando escreve:

```java
List<ResumoOrdemServico>
```

está dizendo:

```text
esta lista guarda ResumoOrdemServico.
```

Isso é Generics.

Generics ajuda o Java a evitar erro de tipo.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
```

Você não pode adicionar uma OS nessa lista.

A lista foi criada para `String`.

Generics será estudado com mais profundidade neste módulo.

---

## Erro comum: raw type

Evite:

```java
List lista = new ArrayList();
```

Isso é chamado de raw type.

O Java aceita, mas é perigoso porque perde segurança de tipo.

Prefira:

```java
List<String> lista = new ArrayList<>();
```

ou:

```java
List<ResumoOrdemServico> ordens = new ArrayList<>();
```

Sempre que possível, informe o tipo dos elementos.

---

## Erro comum: usar implementação como tipo

Evite declarar assim sem necessidade:

```java
ArrayList<String> nomes = new ArrayList<>();
```

Prefira:

```java
List<String> nomes = new ArrayList<>();
```

Por quê?

Porque você trabalha com a interface `List`.

A implementação pode mudar depois.

Exemplo:

```java
List<String> nomes = new LinkedList<>();
```

O código que usa `List` continua parecido.

Essa é uma prática comum em Java.

---

## Erro comum: confundir ordem em Set e Map

`HashSet` e `HashMap` não garantem ordem de iteração.

Exemplo:

```java
Set<String> codigos = new HashSet<>();
```

Ao imprimir, a ordem pode não ser a ordem de inserção.

O mesmo vale para:

```java
Map<String, String> mapa = new HashMap<>();
```

Se você precisa manter ordem de inserção, existem outras estruturas.

Exemplo:

```text
LinkedHashSet;
LinkedHashMap.
```

Se precisa ordenar naturalmente, existem:

```text
TreeSet;
TreeMap.
```

Veremos isso em aulas futuras.

---

## Erro comum: esperar que get de Map lance erro

Quando você usa:

```java
mapa.get("CHAVE_INEXISTENTE");
```

o retorno normalmente será:

```text
null
```

Isso pode gerar `NullPointerException` depois se você não tratar.

Por isso, no exemplo fizemos:

```java
if (encontrada != null) {
    ...
} else {
    ...
}
```

Mais adiante vamos usar `Optional` para deixar isso mais expressivo.

---

## Coleções e o mini-projeto de OS

Agora conecte com o mini-projeto anterior.

Na aula 144, você viu:

```java
private final List<AtividadeOs> atividades;
private final List<OcorrenciaOs> ocorrencias;
```

Isso é `List` dentro do agregado.

Também viu:

```java
private final Map<CodigoOs, OrdemServico> ordens;
```

Isso é `Map` no repositório em memória.

Você já estava usando Collections Framework.

Agora vamos estudar formalmente cada parte.

---

## Coleções e backend real

Em uma API Java com Spring, você verá muito:

```java
List<OrdemServicoResponse>
List<Cliente>
Page<Pedido>
Set<Permissao>
Map<String, Object>
Map<Long, Usuario>
Optional<Cliente>
```

Em repositórios:

```java
List<Pedido> findAll();
Optional<Pedido> findById(Long id);
Set<Permissao> permissoes;
Map<String, String> parametros;
```

Em serviços:

```java
List<Pedido> pedidosAbertos;
Map<StatusPedido, List<Pedido>> pedidosPorStatus;
Set<Long> idsUnicos;
```

Por isso, dominar coleções é pré-requisito para Spring Boot.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar estrutura

Crie a pasta da aula 146.

Crie os pacotes:

```text
app
dominio.ordemservico
```

### Parte 2 — Rodar exemplos básicos

Execute:

```powershell
java -cp out br.com.curso.aula146.app.PrimeiraListApp
java -cp out br.com.curso.aula146.app.PrimeiroSetApp
java -cp out br.com.curso.aula146.app.PrimeiroMapApp
```

### Parte 3 — Rodar exemplos com domínio

Execute:

```powershell
java -cp out br.com.curso.aula146.app.ListComObjetosApp
java -cp out br.com.curso.aula146.app.SetParaValidarDuplicidadeApp
java -cp out br.com.curso.aula146.app.MapComObjetosApp
```

### Parte 4 — Comparar mentalmente

Responda:

```text
quando usei List?
quando usei Set?
quando usei Map?
qual problema cada um resolveu?
```

### Parte 5 — Alterar

Altere os exemplos para incluir mais dados.

Exemplo:

```text
adicione uma OS reagendada;
adicione uma OS cancelada;
adicione um código duplicado no Set;
busque uma chave inexistente no Map.
```

Observe os resultados.

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula146\app\PainelResumoOsApp.java
```

Ele deve:

```text
criar uma List<ResumoOrdemServico>;
adicionar pelo menos 5 OS;
ter OS com status AGENDADA, CONCLUIDA, CANCELADA e REAGENDADA;
percorrer a lista;
contar quantas estão AGENDADAS;
contar quantas estão CONCLUIDAS;
contar quantas estão CANCELADAS;
contar quantas estão REAGENDADAS;
exibir o resultado no final.
```

Exemplo de saída:

```text
Resumo do painel:
Agendadas: 2
Reagendadas: 1
Concluídas: 1
Canceladas: 1
Total: 5
```

Critério principal:

```text
usar List<ResumoOrdemServico> e enum StatusOs.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula146\app\IndiceOsPorCodigoApp.java
```

Ele deve:

```text
criar uma List<ResumoOrdemServico>;
criar um Map<String, ResumoOrdemServico>;
popular o Map usando o código de cada OS;
buscar uma OS pelo código;
exibir o resumo se encontrar;
exibir mensagem amigável se não encontrar.
```

Critério principal:

```text
entender que List é boa para percorrer,
mas Map é bom para buscar por chave.
```

---

## Erros comuns nesta aula

### 1. Esquecer imports

Coleções precisam de imports:

```java
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;
```

### 2. Usar List sem tipo

Evite:

```java
List lista = new ArrayList();
```

Prefira:

```java
List<String> lista = new ArrayList<>();
```

### 3. Acessar posição inexistente

Cuidado:

```java
lista.get(99);
```

Se a lista não tiver essa posição, dará erro.

### 4. Esperar ordem em HashSet

`HashSet` não garante ordem.

### 5. Esperar ordem em HashMap

`HashMap` também não garante ordem.

### 6. Esquecer que Map sobrescreve chave

Se usar a mesma chave duas vezes, o valor anterior é substituído.

### 7. Não tratar null no Map

`map.get(chave)` pode retornar `null`.

### 8. Confundir Collection com Collections

Uma é interface.

A outra é classe utilitária.

---

## Debug recomendado

Use debug em:

```text
PrimeiraListApp.java
PrimeiroSetApp.java
PrimeiroMapApp.java
ListComObjetosApp.java
SetParaValidarDuplicidadeApp.java
MapComObjetosApp.java
```

Breakpoints recomendados:

```java
codigosOs.add(...)
codigosOs.remove(...)

codigosUnicos.add(...)
codigosUnicos.contains(...)

clientePorOs.put(...)
clientePorOs.get(...)

ordens.add(...)
os.possuiStatus(...)

ordensPorCodigo.put(...)
ordensPorCodigo.get(...)
```

Observe:

```text
como o tamanho muda;
quando elemento repetido entra ou não entra;
como a chave do Map aponta para um valor;
como a lista guarda objetos;
como o for percorre os elementos.
```

O objetivo é enxergar o comportamento das estruturas.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é Collections Framework?
2. Qual a diferença inicial entre List, Set e Map?
3. Por que usamos List<String> em vez de List sem tipo?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o que é Collections Framework;
criar uma List com ArrayList;
adicionar, remover e percorrer elementos;
criar um Set com HashSet;
entender que Set não aceita duplicados;
criar um Map com HashMap;
entender chave e valor;
usar coleções com objetos de domínio;
entender generics em visão inicial;
explicar diferença entre interface e implementação;
resolver o desafio PainelResumoOsApp;
resolver o desafio extra IndiceOsPorCodigoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-146-collections-framework-inicial
git commit -m "Aula 146: introducao ao Collections Framework"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Collections Framework é a base do Java para trabalhar com grupos de objetos de forma flexível e profissional.
```

Você viu a visão inicial de:

```text
List;
Set;
Map;
interface;
implementação;
generics;
coleções com objetos de domínio.
```

Na próxima aula, vamos aprofundar a comparação entre arrays e coleções.

Vamos entender melhor as limitações dos arrays e por que Collections Framework é tão usado em sistemas backend.
