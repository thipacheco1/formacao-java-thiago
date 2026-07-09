# 200 — M7.15 — Fechamento técnico, simulado e transição

## Objetivo da aula

Esta aula fecha tecnicamente o Módulo 7.

Neste módulo, você estudou um dos blocos mais importantes do Java moderno:

```text
Functional Interfaces;
Lambdas;
Method Reference;
Constructor Reference;
Predicate;
Function;
Consumer;
Supplier;
Comparator;
Streams;
Optional integrado com Streams;
Collectors;
flatMap;
reduce;
boas práticas.
```

O objetivo desta aula é consolidar tudo isso em três frentes:

```text
1. Revisão técnica do que foi estudado.
2. Simulado prático e conceitual.
3. Transição para o próximo módulo.
```

Ao final desta aula, você deve conseguir:

```text
explicar o papel de functional interfaces;
diferenciar Predicate, Function, Consumer e Supplier;
usar lambdas com critério;
usar method reference quando melhora clareza;
usar Streams em pipelines legíveis;
usar Optional com segurança;
usar Collectors para relatórios;
usar flatMap em coleções aninhadas;
usar reduce para agregações;
decidir entre Stream e for;
evitar parallelStream sem medição;
identificar código funcional ruim;
refatorar pipelines;
conectar o Módulo 7 com backend real.
```

---

## Visão geral do Módulo 7

O Módulo 7 começou com a ideia de comportamento como valor.

Antes, você trabalhava principalmente com:

```text
valores;
objetos;
listas;
maps;
sets;
repositories genéricos;
Optional;
domínio.
```

Neste módulo, você passou a trabalhar também com:

```text
comportamentos passados como argumento;
funções;
predicados;
consumidores;
fornecedores;
pipelines declarativos;
transformações;
agregações;
consultas funcionais.
```

Esse é um divisor de águas no Java moderno.

Depois deste módulo, código como este deixa de ser estranho:

```java
List<ClienteResponse> responses = clientes.stream()
        .filter(Cliente::podeOperar)
        .sorted(Comparator.comparing(Cliente::nome))
        .map(ClienteMapper::toResponse)
        .toList();
```

E passa a ser lido como uma frase:

```text
pegue clientes;
filtre os que podem operar;
ordene por nome;
converta para response;
retorne lista.
```

---

## Frase arquitetural preservada

Mesmo usando recursos funcionais, a arquitetura continua a mesma:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Streams não mudam isso.

Functional Interfaces não mudam isso.

Lambdas não mudam isso.

Optional não muda isso.

O que muda é a forma de processar coleções e comportamentos com mais clareza.

---

# Parte 1 — Revisão: Functional Interfaces

## O que é uma Functional Interface

Functional Interface é uma interface com um único método abstrato.

Exemplo:

```java
@FunctionalInterface
public interface Validador<T> {
    boolean validar(T valor);
}
```

Ela pode ser implementada com lambda:

```java
Validador<String> naoVazio = valor -> valor != null && !valor.isBlank();
```

A regra é:

```text
uma interface funcional representa um comportamento.
```

---

## Principais interfaces funcionais do Java

Você estudou quatro interfaces fundamentais:

```text
Predicate<T>
Function<T, R>
Consumer<T>
Supplier<T>
```

Tabela:

```text
Predicate<T>
T -> boolean
Método: test

Function<T, R>
T -> R
Método: apply

Consumer<T>
T -> void
Método: accept

Supplier<T>
() -> T
Método: get
```

---

## Predicate

Use `Predicate<T>` quando precisa representar uma regra de validação ou filtro.

Exemplo:

```java
Predicate<Cliente> clienteApto = Cliente::podeOperar;
```

Uso típico:

```java
clientes.stream()
        .filter(clienteApto)
        .toList();
```

---

## Function

Use `Function<T, R>` quando precisa transformar um valor em outro.

Exemplo:

```java
Function<Cliente, ClienteResponse> mapper = ClienteMapper::toResponse;
```

Uso típico:

```java
clientes.stream()
        .map(mapper)
        .toList();
```

---

## Consumer

Use `Consumer<T>` quando precisa executar uma ação com um valor sem retornar resultado.

Exemplo:

```java
Consumer<String> imprimir = System.out::println;
```

Uso típico:

```java
nomes.forEach(imprimir);
```

---

## Supplier

Use `Supplier<T>` quando precisa fornecer ou criar um valor sem receber argumento.

Exemplo:

```java
Supplier<List<String>> criarLista = ArrayList::new;
```

Uso típico:

```java
List<String> nomes = criarLista.get();
```

---

## Composição funcional

Você também estudou composição:

```java
Predicate<Cliente> regra = Cliente::ativo;
regra = regra.and(cliente -> !cliente.bloqueado());
```

E:

```java
Function<String, String> normalizar = String::trim;
Function<String, String> maiusculo = String::toUpperCase;

Function<String, String> pipeline = normalizar.andThen(maiusculo);
```

Composição é útil quando melhora legibilidade.

Mas não substitui regra de domínio.

---

# Parte 2 — Revisão: Lambdas e Method Reference

## Lambda

Lambda é uma forma curta de implementar uma Functional Interface.

Exemplo:

```java
nome -> nome.length() >= 5
```

Esse exemplo pode ser um:

```java
Predicate<String>
```

Porque recebe `String` e retorna `boolean`.

---

## Method Reference

Method Reference é uma forma ainda mais direta quando a lambda apenas chama um método existente.

Exemplo:

```java
Cliente::nome
Produto::disponivel
Pedido::podeFaturar
System.out::println
Email::new
```

---

## Quando usar Method Reference

Use quando melhora a leitura.

Bom:

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .map(ClienteMapper::toResponse)
        .toList();
```

---

## Quando lambda é melhor

Lambda é melhor quando você precisa de:

```text
parâmetro adicional;
expressão composta;
if;
validação no meio;
duas ou mais chamadas;
clareza contextual.
```

Exemplo:

```java
.filter(produto -> produto.precoMaiorOuIgual(valorMinimo))
```

Aqui a lambda é melhor porque existe parâmetro externo.

---

# Parte 3 — Revisão: Streams

## O que é Stream

`Stream<T>` é um fluxo de processamento de elementos.

Uma lista armazena.

Um stream processa.

Exemplo:

```java
List<Produto> produtos = List.of(...);

List<ProdutoResponse> responses = produtos.stream()
        .filter(Produto::disponivel)
        .map(ProdutoMapper::toResponse)
        .toList();
```

---

## Pipeline de Stream

Um pipeline normalmente tem:

```text
fonte;
operações intermediárias;
operação terminal.
```

Exemplo:

```java
produtos.stream()
        .filter(Produto::disponivel)
        .map(ProdutoMapper::toResponse)
        .toList();
```

Separando:

```text
Fonte:
produtos.stream()

Intermediária:
filter

Intermediária:
map

Terminal:
toList
```

---

## Operações intermediárias estudadas

Você estudou:

```text
filter;
map;
flatMap;
sorted;
distinct;
limit;
skip;
peek.
```

---

## Operações terminais estudadas

Você estudou:

```text
forEach;
toList;
collect;
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
count;
min;
max;
reduce.
```

---

## Lazy evaluation

Streams são preguiçosos.

Operações intermediárias não executam sem operação terminal.

Exemplo:

```java
nomes.stream()
        .filter(nome -> nome.length() > 5)
        .map(String::toUpperCase);
```

Sem terminal, não processa.

---

## Short-circuit

Algumas operações podem parar antes de percorrer tudo:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
limit.
```

Exemplo:

```java
boolean existe = pedidos.stream()
        .anyMatch(Pedido::podeFaturar);
```

Assim que encontra um pedido faturável, pode parar.

---

# Parte 4 — Revisão: Optional com Streams

## Por que findFirst retorna Optional

Este código:

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .findFirst();
```

retorna:

```java
Optional<Cliente>
```

Porque pode existir um cliente apto.

Mas também pode não existir.

---

## Optional.map

Transforma o valor se ele existir.

```java
Optional<ClienteResponse> response = buscarCliente(email)
        .map(ClienteMapper::toResponse);
```

Se não existir cliente, o resultado continua vazio.

---

## Optional.filter

Mantém o valor apenas se passar na regra.

```java
Optional<Pedido> pedido = buscarPedido(codigo)
        .filter(Pedido::podeFaturar);
```

---

## Optional.orElse

Fornece valor padrão simples.

```java
String nome = optional.orElse("Não encontrado");
```

---

## Optional.orElseGet

Fornece valor padrão de forma preguiçosa.

```java
String nome = optional.orElseGet(() -> gerarNomePadrao());
```

---

## Optional.orElseThrow

Lança exceção quando ausência é erro.

```java
Pedido pedido = buscarPedido(codigo)
        .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
```

---

## Optional.stream

Converte `Optional<T>` em `Stream<T>`.

É útil para achatar:

```java
List<ClienteResponse> encontrados = emails.stream()
        .map(service::buscarResponsePorEmail)
        .flatMap(Optional::stream)
        .toList();
```

---

## Regra profissional

```text
Busca de um item:
Optional<T>

Consulta de muitos itens:
List<T>, possivelmente vazia

Fluxo obrigatório:
T ou exceção clara
```

---

# Parte 5 — Revisão: Collectors

## Collectors básicos

Você estudou:

```java
Collectors.toList()
Collectors.toSet()
Collectors.toMap()
```

---

## Collectors avançados

Você também estudou:

```text
joining;
groupingBy;
partitioningBy;
mapping;
counting;
summingInt;
reducing.
```

---

## groupingBy

Use para agrupar por chave com várias possibilidades.

Exemplo:

```java
Map<String, List<Produto>> porCategoria = produtos.stream()
        .collect(Collectors.groupingBy(Produto::categoria));
```

---

## partitioningBy

Use para separar em dois grupos booleanos.

Exemplo:

```java
Map<Boolean, List<Pedido>> separados = pedidos.stream()
        .collect(Collectors.partitioningBy(Pedido::podeFaturar));
```

---

## counting

Use para contar dentro do grupo.

```java
Map<String, Long> quantidadePorStatus = ordens.stream()
        .collect(Collectors.groupingBy(
                OrdemServico::status,
                Collectors.counting()
        ));
```

---

## summingInt

Use para somar inteiros por grupo.

```java
Map<String, Integer> minutosPorStatus = atividades.stream()
        .collect(Collectors.groupingBy(
                Atividade::status,
                Collectors.summingInt(Atividade::minutosEstimados)
        ));
```

---

## reducing

Use para reduções customizadas dentro de collectors.

Exemplo com BigDecimal:

```java
Map<String, BigDecimal> totalPorCategoria = produtos.stream()
        .collect(Collectors.groupingBy(
                Produto::categoria,
                Collectors.reducing(
                        BigDecimal.ZERO,
                        Produto::preco,
                        BigDecimal::add
                )
        ));
```

---

# Parte 6 — Revisão: flatMap

## Problema resolvido por flatMap

`flatMap` resolve coleções aninhadas.

Exemplo:

```text
Pedido -> List<ItemPedido>
```

Com `map`:

```java
Stream<List<ItemPedido>>
```

Com `flatMap`:

```java
Stream<ItemPedido>
```

---

## Exemplo clássico

```java
List<ItemPedido> itens = pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
        .toList();
```

Leitura:

```text
pegue pedidos;
abra os itens de cada pedido;
una todos os itens em um fluxo único;
retorne lista.
```

---

## Quando usar flatMap

Use quando precisa processar filhos de vários pais como uma sequência única.

Exemplos:

```text
pedidos -> itens;
clientes -> contratos;
OS -> atividades;
usuários -> permissões;
módulos -> aulas;
categorias -> produtos.
```

---

# Parte 7 — Revisão: reduce, min, max e agregações

## min

Busca o menor item conforme um Comparator.

```java
Optional<Produto> maisBarato = produtos.stream()
        .min(Comparator.comparing(Produto::preco));
```

---

## max

Busca o maior item conforme um Comparator.

```java
Optional<Produto> maisCaro = produtos.stream()
        .max(Comparator.comparing(Produto::preco));
```

---

## reduce

Reduz vários valores para um resultado.

```java
BigDecimal total = pedidos.stream()
        .map(Pedido::valor)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
```

---

## mapToInt().sum()

Bom para somar inteiros.

```java
int totalMinutos = atividades.stream()
        .mapToInt(Atividade::minutosEstimados)
        .sum();
```

---

## count

Bom para quantidade.

```java
long quantidade = pedidos.stream()
        .filter(Pedido::podeFaturar)
        .count();
```

---

# Parte 8 — Boas práticas finais do Módulo 7

## 1. Stream deve melhorar leitura

Se piorou a leitura, use `for`.

---

## 2. Regra importante deve ter nome

Prefira:

```java
Pedido::podeFaturar
Produto::disponivel
Atividade::podeExecutar
```

a lambdas gigantes.

---

## 3. Mapper converte

Mapper não deve decidir regra de negócio principal.

Ele converte:

```text
Entidade -> Response
```

---

## 4. Service coordena

Service pode:

```text
filtrar;
ordenar;
paginar;
agrupar;
chamar mapper;
tratar Optional;
lançar exceção quando necessário.
```

Mas deve evitar imprimir.

---

## 5. forEach não deve montar lista

Evite:

```java
List<Response> responses = new ArrayList<>();
stream.forEach(item -> responses.add(mapper(item)));
```

Prefira:

```java
List<Response> responses = stream
        .map(mapper)
        .toList();
```

---

## 6. Optional.get deve ser evitado

Prefira:

```text
map;
flatMap;
filter;
orElse;
orElseGet;
orElseThrow.
```

---

## 7. parallelStream não é solução mágica

Use apenas com:

```text
motivo claro;
sem estado compartilhado;
sem transação;
sem chamada externa descontrolada;
sem dependência de ordem;
com medição.
```

---

## 8. Grandes volumes devem ir para o banco

Para dados persistidos em grande volume, prefira:

```text
SQL;
WHERE;
ORDER BY;
GROUP BY;
COUNT;
SUM;
LIMIT;
OFFSET;
Pageable.
```

Streams são ótimos para dados em memória.

Banco é melhor para filtrar, ordenar, paginar e agregar grandes volumes persistidos.

---

# Parte 9 — Simulado conceitual

Responda antes de ver o gabarito.

## Questão 1

O que representa uma Functional Interface?

```text
A) Uma interface com qualquer quantidade de métodos.
B) Uma interface com exatamente um método abstrato.
C) Uma classe abstrata com método funcional.
D) Uma interface que só pode ser usada com Stream.
```

---

## Questão 2

Qual interface representa uma regra que recebe `T` e retorna `boolean`?

```text
A) Function<T, R>
B) Consumer<T>
C) Predicate<T>
D) Supplier<T>
```

---

## Questão 3

Qual interface representa uma transformação de `T` para `R`?

```text
A) Function<T, R>
B) Consumer<T>
C) Supplier<T>
D) Predicate<T>
```

---

## Questão 4

Qual interface não recebe argumento e retorna um valor?

```text
A) Predicate<T>
B) Supplier<T>
C) Consumer<T>
D) Function<T, R>
```

---

## Questão 5

Qual operação de Stream é intermediária?

```text
A) toList
B) count
C) filter
D) forEach
```

---

## Questão 6

Qual operação de Stream é terminal?

```text
A) map
B) flatMap
C) sorted
D) findFirst
```

---

## Questão 7

O que `findFirst` retorna?

```text
A) T
B) List<T>
C) Optional<T>
D) boolean
```

---

## Questão 8

Quando usar `anyMatch`?

```text
A) Quando quero transformar todos os itens.
B) Quando quero saber se existe pelo menos um item que atende a uma regra.
C) Quando quero agrupar por chave.
D) Quando quero juntar textos.
```

---

## Questão 9

O que acontece com `allMatch` em lista vazia?

```text
A) Retorna false.
B) Retorna true.
C) Lança exceção.
D) Retorna Optional.empty.
```

---

## Questão 10

Qual operação remove duplicados?

```text
A) skip
B) limit
C) distinct
D) sorted
```

---

## Questão 11

`distinct` depende principalmente de:

```text
A) toString.
B) equals e hashCode.
C) Comparator.
D) Supplier.
```

---

## Questão 12

Qual operação é usada para achatar `Stream<List<T>>` em `Stream<T>`?

```text
A) map
B) flatMap
C) reduce
D) collect
```

---

## Questão 13

Qual collector agrupa por várias chaves possíveis?

```text
A) partitioningBy
B) groupingBy
C) joining
D) toSet
```

---

## Questão 14

Qual collector separa em `true` e `false`?

```text
A) groupingBy
B) mapping
C) partitioningBy
D) reducing
```

---

## Questão 15

Como somar valores `BigDecimal` em Stream?

```text
A) sum()
B) reduce(BigDecimal.ZERO, BigDecimal::add)
C) counting()
D) joining()
```

---

## Questão 16

Quando um service busca um único item que pode não existir, o retorno recomendado é:

```text
A) null
B) Optional<T>
C) List<T>
D) boolean
```

---

## Questão 17

Quando uma consulta retorna muitos itens e não encontra nada, o recomendado é:

```text
A) null
B) Optional<List<T>>
C) lista vazia
D) exceção sempre
```

---

## Questão 18

Quando ausência impede o fluxo, o recomendado é:

```text
A) retornar null.
B) esconder o erro.
C) usar orElseThrow com mensagem clara.
D) usar Optional.get.
```

---

## Questão 19

Qual é um uso ruim de `forEach`?

```text
A) Imprimir valores no console em app de demonstração.
B) Executar ação final clara.
C) Montar lista externa que poderia ser feita com map + toList.
D) Consumir uma lista já pronta.
```

---

## Questão 20

Quando considerar `parallelStream`?

```text
A) Sempre que quiser performance.
B) Quando a lista for pequena.
C) Quando houver estado compartilhado.
D) Apenas com motivo claro, sem estado compartilhado e com medição.
```

---

# Parte 10 — Gabarito do simulado conceitual

```text
1. B
2. C
3. A
4. B
5. C
6. D
7. C
8. B
9. B
10. C
11. B
12. B
13. B
14. C
15. B
16. B
17. C
18. C
19. C
20. D
```

---

# Parte 11 — Simulado prático

Agora faça sem copiar das aulas.

## Requisito

Crie um mini sistema de atividades operacionais.

Estrutura:

```text
dominio/atividade
dto
service
app
```

---

## Entidade Atividade

Campos:

```text
codigo;
descricao;
status;
responsavel;
obrigatoria;
urgente;
tentativas;
minutosEstimados.
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
responsavel obrigatório;
tentativas >= 0;
minutosEstimados > 0;
pendente();
concluida();
excedeuTentativas();
podeExecutar();
critica();
prioridadeNumerica();
resumo().
```

---

## DTO AtividadeResponse

Campos:

```text
codigo;
descricao;
status;
responsavel;
prioridade;
minutosEstimados.
```

---

## DTO ResumoResponsavelResponse

Campos:

```text
responsavel;
quantidade;
minutosEstimados.
```

---

## Mapper

Métodos:

```java
AtividadeResponse toResponse(Atividade atividade)

ResumoResponsavelResponse toResumoResponsavel(
        String responsavel,
        long quantidade,
        int minutosEstimados
)
```

---

## Service

Crie métodos:

```java
Optional<AtividadeResponse> buscarPorCodigo(String codigo)

AtividadeResponse buscarObrigatoriaParaExecucao(String codigo)

List<AtividadeResponse> listarExecutaveisOrdenadas()

List<AtividadeResponse> listarPaginaExecutaveis(int pagina, int tamanho)

Map<String, Long> contarPorStatus()

Map<Boolean, List<AtividadeResponse>> separarCriticas()

List<ResumoResponsavelResponse> resumirPorResponsavel()

long contarExecutaveis()

boolean existeCriticaExecutavel()

Optional<AtividadeResponse> buscarPrimeiraCriticaExecutavel()
```

---

## Regras dos métodos

### buscarPorCodigo

Deve usar:

```text
stream;
filter;
findFirst;
map.
```

---

### buscarObrigatoriaParaExecucao

Deve usar:

```text
buscar entidade;
filter podeExecutar;
map;
orElseThrow.
```

---

### listarExecutaveisOrdenadas

Deve usar:

```text
filter podeExecutar;
sorted por prioridadeNumerica;
thenComparing por tentativas desc;
thenComparing por codigo;
map;
toList.
```

---

### listarPaginaExecutaveis

Deve usar:

```text
validação de pagina e tamanho;
mesmo critério de ordenação;
skip;
limit;
map;
toList.
```

---

### contarPorStatus

Deve usar:

```text
groupingBy;
counting.
```

---

### separarCriticas

Deve usar:

```text
partitioningBy;
mapping;
toList.
```

---

### resumirPorResponsavel

Deve usar:

```text
groupingBy responsavel + counting;
groupingBy responsavel + summingInt;
montar DTO;
sorted por responsavel;
toList.
```

---

### contarExecutaveis

Deve usar:

```text
filter;
count.
```

---

### existeCriticaExecutavel

Deve usar:

```text
filter podeExecutar;
anyMatch critica.
```

---

### buscarPrimeiraCriticaExecutavel

Deve usar:

```text
filter podeExecutar;
filter critica;
findFirst;
map.
```

---

## Critérios de aprovação do simulado prático

Seu código será considerado bom se:

```text
não usa Optional.get;
não retorna null;
não imprime dentro do service;
não usa parallelStream;
não usa forEach para montar lista;
não coloca regra gigante em lambda;
usa método de domínio;
usa mapper;
usa DTO;
usa Optional para busca de um item;
usa lista vazia para muitos itens;
usa exceção clara para fluxo obrigatório;
usa groupingBy corretamente;
usa partitioningBy corretamente;
usa sorted com Comparator legível;
usa skip/limit corretamente;
mantém service como coordenador.
```

---

# Parte 12 — Diagnóstico do Módulo 7

Use esta lista para medir seu domínio.

Marque mentalmente:

```text
[ ] Sei explicar o que é Functional Interface.
[ ] Sei criar uma Functional Interface própria.
[ ] Sei usar Predicate.
[ ] Sei usar Function.
[ ] Sei usar Consumer.
[ ] Sei usar Supplier.
[ ] Sei usar lambda simples.
[ ] Sei usar lambda com bloco.
[ ] Sei usar method reference.
[ ] Sei usar constructor reference.
[ ] Sei diferenciar lambda de method reference.
[ ] Sei usar stream().
[ ] Sei usar filter.
[ ] Sei usar map.
[ ] Sei usar flatMap.
[ ] Sei usar sorted.
[ ] Sei usar Comparator.comparing.
[ ] Sei usar reversed.
[ ] Sei usar thenComparing.
[ ] Sei usar distinct.
[ ] Sei usar limit.
[ ] Sei usar skip.
[ ] Sei usar toList.
[ ] Sei usar collect.
[ ] Sei usar groupingBy.
[ ] Sei usar partitioningBy.
[ ] Sei usar mapping.
[ ] Sei usar counting.
[ ] Sei usar summingInt.
[ ] Sei usar reducing.
[ ] Sei usar joining.
[ ] Sei usar findFirst.
[ ] Sei usar anyMatch.
[ ] Sei usar allMatch.
[ ] Sei usar noneMatch.
[ ] Sei usar count.
[ ] Sei usar min.
[ ] Sei usar max.
[ ] Sei usar reduce.
[ ] Sei somar BigDecimal.
[ ] Sei usar Optional.map.
[ ] Sei usar Optional.filter.
[ ] Sei usar Optional.orElse.
[ ] Sei usar Optional.orElseGet.
[ ] Sei usar Optional.orElseThrow.
[ ] Sei usar Optional.stream.
[ ] Sei evitar Optional.get.
[ ] Sei decidir entre Optional, lista vazia e exceção.
[ ] Sei decidir entre Stream e for.
[ ] Sei evitar efeito colateral perigoso.
[ ] Sei explicar por que parallelStream exige cuidado.
[ ] Sei identificar pipeline ruim.
[ ] Sei refatorar pipeline para domínio, mapper e service.
```

Se você marcou muitos itens como dúvida, revise as aulas específicas antes de avançar.

---

# Parte 13 — Mapa de uso em backend real

## Em controllers

Futuramente, controllers vão chamar services.

Eles não devem carregar regra de Stream complexa.

Exemplo desejado:

```java
@GetMapping
public List<ProdutoResponse> listar(...) {
    return service.consultar(...);
}
```

---

## Em services

Services podem usar Streams para coordenar dados em memória.

Exemplo:

```java
return produtos.stream()
        .filter(Produto::disponivel)
        .map(ProdutoMapper::toResponse)
        .toList();
```

---

## Em repositories

Repositories vão buscar dados.

Quando houver banco, muita coisa será delegada para query.

Exemplo futuro:

```text
findByStatusOrderByDataDesc
Pageable
@Query
Specification
Criteria
SQL
```

---

## Em mappers

Mappers transformam dados.

Exemplo:

```java
ProdutoResponse toResponse(Produto produto)
```

---

## Em entidades

Entidades decidem regras.

Exemplo:

```java
pedido.podeFaturar()
produto.disponivel()
atividade.podeExecutar()
ordemServico.critica()
```

---

# Parte 14 — Transição para o próximo módulo

Você concluiu um bloco pesado de Java moderno.

Agora você sabe processar coleções com clareza.

O próximo passo será lidar com falhas.

Até agora, você já usou:

```java
throw new IllegalArgumentException(...)
throw new IllegalStateException(...)
orElseThrow(...)
```

Mas ainda não aprofundamos o mecanismo de exceções.

O próximo módulo vai tratar:

```text
Exceptions;
tratamento de erro;
checked exceptions;
unchecked exceptions;
try/catch;
finally;
try-with-resources;
criação de exceções próprias;
erros de domínio;
erros técnicos;
camadas de erro;
boas práticas;
I/O;
arquivos;
utilitários modernos.
```

Esse bloco é essencial para backend.

Backend real precisa lidar com:

```text
entrada inválida;
registro não encontrado;
regra de negócio violada;
falha de banco;
falha de API externa;
timeout;
arquivo inexistente;
erro de parsing;
erro de autenticação;
erro de autorização;
mensagem inválida;
processamento parcial.
```

Você vai sair do mundo de “caminho feliz” e entrar no mundo real:

```text
o que fazer quando algo dá errado.
```

---

## Fechamento oficial do Módulo 7

O Módulo 7 te deu a base para entender código Java moderno.

Agora, quando você vir:

```java
return repository.findAll()
        .stream()
        .filter(Pedido::podeFaturar)
        .sorted(Comparator.comparing(Pedido::data))
        .map(PedidoMapper::toResponse)
        .toList();
```

você deve enxergar:

```text
consulta;
filtro de domínio;
ordenação;
conversão;
retorno.
```

E também deve saber questionar:

```text
isso deveria estar no banco?
a regra está no domínio?
o mapper está separado?
o Optional foi tratado?
a lista vazia é aceitável?
a exceção tem mensagem clara?
o pipeline está legível?
```

Esse é o objetivo.

Não é decorar método.

É pensar como engenheiro backend.

---

## Commit recomendado

Depois de concluir o simulado e o desafio:

```bash
git status
git add labs/m7/aula-200-fechamento-tecnico-simulado-e-transicao
git commit -m "Aula 200: fechamento tecnico simulado e transicao modulo 7"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Próximo módulo

Na próxima aula começa o Módulo 8:

```text
Exceptions, tratamento de erros, arquivos, I/O e utilitários modernos.
```

A primeira aula será:

```text
Introdução a Exceptions e tratamento profissional de erros.
```

Vamos começar entendendo:

```text
o que é exceção;
por que exceções existem;
diferença entre erro de programação, erro de regra e erro técnico;
RuntimeException;
IllegalArgumentException;
IllegalStateException;
try/catch;
quando lançar;
quando capturar;
quando deixar propagar.
```

Esse será mais um passo para sair de “programador que escreve código” e chegar em “engenheiro backend que constrói sistemas confiáveis”.
