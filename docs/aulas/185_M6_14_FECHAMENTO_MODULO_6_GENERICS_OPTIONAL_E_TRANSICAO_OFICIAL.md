# 185 — M6.14 — Fechamento do Módulo 6: Generics, Optional e transição

## Objetivo da aula

Nesta aula vamos fechar oficialmente o Módulo 6.

Este módulo foi dedicado a um dos assuntos mais importantes para quem quer sair do Java básico e começar a enxergar o ecossistema backend profissional com mais clareza:

```text
Generics
```

E também trabalhamos um recurso essencial do Java moderno:

```text
Optional<T>
```

Agora vamos consolidar tudo e fazer a transição para o próximo bloco do curso.

Ao final desta aula, você deve conseguir:

```text
revisar todos os conceitos centrais do Módulo 6;
entender por que Generics são fundamentais no backend Java;
entender por que Optional melhora retornos de busca;
diferenciar Optional<T> de Resultado<T>;
explicar bounded types;
explicar wildcards;
explicar PECS;
explicar type erasure;
reconhecer Generics em APIs reais;
entender como esse módulo prepara para lambdas, streams, testes, JPA, Spring e arquitetura;
saber quais pontos revisar antes de avançar.
```

---

## Onde este módulo se encaixa na formação

Até aqui, o curso construiu uma base em camadas.

Você já passou por:

```text
fundamentos da linguagem;
tipos;
condicionais;
loops;
métodos;
organização de código;
classes;
objetos;
encapsulamento;
construtores;
objetos de valor;
enum;
equals e hashCode;
collections;
maps;
sets;
queues;
comparators;
generics;
optional;
repository em memória;
resultado de operação.
```

Isso não é pouca coisa.

Essa base é o chão para todo o resto.

Quando chegarmos em Spring Boot, JPA, APIs REST, testes, segurança, mensageria, Docker, observabilidade e arquitetura, esses assuntos não serão isolados.

Eles vão reaparecer o tempo todo.

---

## O objetivo maior continua o mesmo

Nosso objetivo não é apenas aprender sintaxe Java.

O objetivo é construir uma formação sólida para atuar como:

```text
Java Backend Developer;
Engenheiro Backend;
Arquiteto Java em evolução;
profissional capaz de entender sistema real;
profissional capaz de tomar decisão técnica;
profissional capaz de não depender apenas de copiar código.
```

Por isso, o curso não pode ser superficial.

Cada módulo precisa criar base para o próximo.

O Módulo 6 foi uma dessas bases fortes.

---

# Parte 1 — Revisão executiva do Módulo 6

## O que é Generics

Generics permitem criar classes, interfaces e métodos parametrizados por tipo.

Exemplo:

```java
List<String>
Map<CodigoOs, OrdemServico>
Optional<Cliente>
Resultado<Pedido>
Repositorio<Email, Cliente>
```

O ganho principal é:

```text
segurança de tipo em tempo de compilação.
```

Sem Generics, você cairia facilmente em:

```java
Object
cast
ClassCastException
raw types
erros em runtime
```

Com Generics, o compilador ajuda você antes do programa rodar.

---

## O que é type safety

Type safety significa:

```text
usar tipos de forma segura, reduzindo erros antes da execução.
```

Exemplo:

```java
List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add(100);
```

A segunda adição não compila.

Isso é bom.

O erro aparece cedo.

Backend profissional valoriza erro cedo.

Erro cedo evita surpresa em produção.

---

## O que são raw types

Raw type é usar tipo genérico sem informar o parâmetro.

Exemplo ruim:

```java
List lista = new ArrayList();
Map mapa = new HashMap();
Optional optional = Optional.empty();
Repositorio repositorio = new RepositorioMemoria();
```

O problema é que você perde segurança.

A regra é:

```text
evite raw types.
```

Use:

```java
List<String>
Map<String, Integer>
Optional<Cliente>
Repositorio<Email, Cliente>
```

---

## Classes genéricas

Classe genérica declara tipo na classe.

Exemplo:

```java
public class Resultado<T> {
    private final T valor;
}
```

Uso:

```java
Resultado<Cliente>
Resultado<Produto>
Resultado<OrdemServico>
```

A estrutura é a mesma.

O tipo do valor muda.

Isso é uma boa aplicação de Generics.

---

## Interfaces genéricas

Interface genérica define contrato reutilizável.

Exemplo:

```java
public interface Repositorio<ID, T> {
    void salvar(T item);

    Optional<T> buscarPorId(ID id);
}
```

Esse contrato pode representar:

```text
Repositorio<Email, Cliente>;
Repositorio<CodigoOs, OrdemServico>;
Repositorio<Sku, Produto>.
```

O comportamento técnico é comum.

O tipo muda.

---

## Métodos genéricos

Método genérico declara tipo antes do retorno.

Exemplo:

```java
public static <T> T primeiro(List<T> itens) {
    return itens.get(0);
}
```

A parte importante é:

```java
<T>
```

antes do retorno.

Isso diz:

```text
este método declara um tipo genérico próprio.
```

---

## Bounded types

Bounded type limita o tipo genérico a um contrato.

Exemplo:

```java
public static <T extends Resumivel> void imprimir(T item) {
    System.out.println(item.resumo());
}
```

Sem o limite:

```java
<T>
```

o compilador não sabe que `T` possui `resumo()`.

Com:

```java
<T extends Resumivel>
```

o compilador sabe.

---

## Múltiplos limites

Também é possível exigir mais de um contrato:

```java
<T extends Identificavel<ID> & Resumivel>
```

Isso significa:

```text
T precisa possuir ID;
T precisa possuir resumo.
```

Use com cuidado.

Múltiplos limites são úteis, mas podem deixar a assinatura pesada.

---

## Wildcards

Wildcard é:

```java
?
```

Exemplos:

```java
List<?>
List<? extends Number>
List<? super Integer>
```

Ele representa:

```text
algum tipo desconhecido.
```

Wildcards são úteis principalmente em parâmetros de métodos.

---

## `? extends T`

Use quando você vai ler.

Exemplo:

```java
public static void imprimir(List<? extends Resumivel> itens)
```

A lista produz itens para leitura.

Você pode ler como `Resumivel`.

Regra:

```text
Producer Extends.
```

---

## `? super T`

Use quando você vai adicionar.

Exemplo:

```java
public static void adicionarCriticos(List<? super AtendimentoCritico> destino)
```

O destino consome `AtendimentoCritico`.

Regra:

```text
Consumer Super.
```

---

## PECS

PECS significa:

```text
Producer Extends, Consumer Super.
```

Ou:

```text
se produz para leitura, use extends;
se consome escrita, use super.
```

Exemplo clássico:

```java
public static <T> void copiar(
        List<? extends T> origem,
        List<? super T> destino
) {
    for (T item : origem) {
        destino.add(item);
    }
}
```

Origem produz.

Destino consome.

---

## Type erasure

Generics protegem principalmente em tempo de compilação.

Em runtime, parte da informação genérica é apagada.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
List<Integer> numeros = new ArrayList<>();
```

Em runtime, ambos são:

```text
java.util.ArrayList
```

Isso explica por que não dá para fazer:

```java
objeto instanceof List<String>
```

Você pode fazer:

```java
objeto instanceof List<?>
```

---

## Limitações por type erasure

Por causa de type erasure:

```text
não dá para usar instanceof List<String>;
não dá para criar new T();
não dá para criar T[] diretamente;
não dá para sobrecarregar métodos apenas por List<String> e List<Integer>;
raw types podem causar heap pollution;
às vezes você precisa de Class<T>;
às vezes frameworks usam TypeReference.
```

Esse conhecimento será muito útil quando chegarmos em Jackson, Spring, JPA e APIs.

---

## Class<T>

Use `Class<T>` quando precisa do tipo em runtime.

Exemplo:

```java
public static <T> T converter(Object valor, Class<T> tipo) {
    if (!tipo.isInstance(valor)) {
        throw new IllegalArgumentException("Tipo inválido.");
    }

    return tipo.cast(valor);
}
```

Uso:

```java
Cliente cliente = converter(objeto, Cliente.class);
```

Isso é útil em validação dinâmica, reflection, mappers e frameworks.

---

## Supplier<T>

Use `Supplier<T>` quando precisa criar objetos de forma flexível.

Exemplo:

```java
Supplier<Cliente> supplier = Cliente::new;
```

Ou:

```java
public class Fabrica<T> {
    private final Supplier<T> supplier;

    public T criar() {
        return supplier.get();
    }
}
```

`Supplier<T>` será muito importante no próximo bloco, quando estudarmos interfaces funcionais e lambdas.

---

# Parte 2 — Optional<T>

## O problema do null

`null` é perigoso porque não comunica intenção.

Exemplo:

```java
Cliente cliente = buscarPorEmail(email);
System.out.println(cliente.nome());
```

Se `buscarPorEmail` retornar `null`, o código quebra.

Com Optional:

```java
Optional<Cliente> cliente = buscarPorEmail(email);
```

A assinatura já comunica:

```text
pode existir;
pode não existir.
```

---

## O que Optional<T> representa

`Optional<T>` representa ausência ou presença de valor.

Exemplos:

```java
Optional<Cliente>
Optional<Produto>
Optional<OrdemServico>
Optional<String>
```

Uso principal em backend:

```text
retorno de busca.
```

Exemplo bom:

```java
Optional<Cliente> buscarPorEmail(Email email)
```

---

## Criando Optional

Formas principais:

```java
Optional.of(valorNaoNulo)
Optional.ofNullable(valorPossivelmenteNulo)
Optional.empty()
```

Regra prática:

```text
of:
quando tem certeza que não é null.

ofNullable:
quando pode ser null.

empty:
quando quer ausência.
```

---

## Evite Optional.get direto

Evite:

```java
optional.get()
```

Prefira:

```java
orElse
orElseGet
orElseThrow
ifPresent
map
flatMap
filter
```

`get()` sem checagem pode trocar `NullPointerException` por `NoSuchElementException`.

Não resolve o problema.

---

## map em Optional

Use `map` quando transforma o valor interno em outro valor comum.

Exemplo:

```java
Optional<String> nome = cliente.map(Cliente::nome);
```

Fluxo:

```text
Optional<Cliente> -> Optional<String>
```

---

## flatMap em Optional

Use `flatMap` quando a função já retorna Optional.

Exemplo:

```java
Optional<Cliente> clienteDaOs = osRepository.buscarPorId(codigo)
        .flatMap(os -> clienteRepository.buscarPorId(os.emailCliente()));
```

Isso evita:

```java
Optional<Optional<Cliente>>
```

Regra:

```text
função retorna valor:
map.

função retorna Optional:
flatMap.
```

---

## filter em Optional

Use `filter` para manter o valor apenas se uma condição for verdadeira.

Exemplo:

```java
Optional<Cliente> clienteAtivo = clienteRepository.buscarPorId(email)
        .filter(Cliente::ativo);
```

Se o cliente estiver inativo, o Optional vira vazio.

---

## orElse vs orElseGet

```java
orElse(valor)
```

O valor é avaliado antes.

```java
orElseGet(() -> gerarValor())
```

O valor só é gerado se o Optional estiver vazio.

Regra:

```text
valor simples:
orElse.

valor calculado:
orElseGet.
```

---

## orElseThrow

Use quando ausência é erro para aquele fluxo.

Exemplo:

```java
Cliente cliente = repository.buscarPorId(email)
        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
```

No futuro, usaremos exceções específicas:

```text
ClienteNaoEncontradoException;
OrdemServicoNaoEncontradaException;
RegraDeNegocioException.
```

---

## Onde Optional fica bem

Optional fica bem em:

```text
repository;
buscas;
consultas;
retornos onde ausência é normal;
integrações onde dado pode não existir;
configurações opcionais.
```

Exemplo:

```java
Optional<Produto> buscarPorSku(Sku sku)
```

---

## Onde Optional costuma ficar ruim

Evite Optional em:

```text
campos de entidade;
parâmetros de método;
coleções como List<Optional<T>>;
validação de campos obrigatórios;
operações que precisam mensagem de falha.
```

Exemplo ruim:

```java
private Optional<String> nome;
```

Exemplo ruim:

```java
public void cadastrar(Optional<String> nome)
```

---

# Parte 3 — Optional<T> vs Resultado<T>

## Optional<T>

Use quando a pergunta é:

```text
existe ou não existe?
```

Exemplo:

```java
Optional<Cliente> buscarPorEmail(Email email)
```

Não tem mensagem de erro.

Não tem status de operação.

Apenas presença ou ausência.

---

## Resultado<T>

Use quando a pergunta é:

```text
a operação deu certo ou falhou?
qual mensagem deve ser retornada?
há valor de sucesso?
```

Exemplo:

```java
Resultado<Pedido> cancelarPedido(CodigoPedido codigo, String motivo)
```

Pode falhar por:

```text
pedido inexistente;
pedido já cancelado;
motivo inválido;
regra de negócio.
```

Por isso `Resultado<T>` é mais adequado que `Optional<T>`.

---

## Comparação direta

```text
Buscar produto por SKU:
Optional<Produto>

Cadastrar produto:
Resultado<Produto>

Abrir pedido:
Resultado<Pedido>

Buscar cliente por e-mail:
Optional<Cliente>

Inativar cliente:
Resultado<Cliente>

Buscar configuração opcional:
Optional<Configuracao>

Processar importação:
Resultado<ResumoImportacao>
```

A decisão vem da semântica.

Não é escolha estética.

---

# Parte 4 — Arquitetura e responsabilidade

## Repository

Repository salva e busca.

Em memória, ele pode ser genérico:

```java
Repositorio<ID, T extends Identificavel<ID>>
```

Isso faz sentido porque:

```text
salvar;
buscar;
listar;
verificar existência;
contar;
```

são comportamentos técnicos comuns.

---

## Service

Service coordena fluxo.

Service normalmente é específico:

```java
ServicoCliente
ServicoProduto
ServicoPedido
ServicoOrdemServico
```

Porque cada um tem regras próprias.

Evite criar:

```java
ServicoGenerico<T>
```

sem uma necessidade real.

---

## Entidade

Entidade protege regra de negócio.

Exemplo:

```java
pedido.cancelar(motivo)
produto.inativar()
ordemServico.concluir()
cliente.inativar()
```

A entidade não sabe:

```text
banco;
SQL;
endpoint;
HTTP;
JSON;
token;
fila;
controller.
```

Essa separação é fundamental.

---

## Frase arquitetural do curso

A frase continua sendo:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No nosso estágio atual, ainda usamos `Service` como coordenador.

Mais adiante vamos separar melhor:

```text
Controller;
UseCase;
Service;
Repository;
Gateway;
Client;
DTO;
Mapper.
```

Mas a base já está sendo formada.

---

# Parte 5 — Reconhecendo Generics no Java real

## Collections

Você já usa Generics em:

```java
List<T>
Set<T>
Map<K, V>
Queue<T>
Deque<T>
Optional<T>
Comparator<T>
```

Exemplos:

```java
List<Cliente>
Set<Sku>
Map<CodigoOs, OrdemServico>
Optional<Produto>
Comparator<Pedido>
```

---

## Functional interfaces

No próximo bloco, você verá:

```java
Function<T, R>
Predicate<T>
Consumer<T>
Supplier<T>
UnaryOperator<T>
BinaryOperator<T>
```

Tudo isso usa Generics.

Exemplo:

```java
Function<Cliente, String> extrairNome = Cliente::nome;
Predicate<Cliente> ativo = Cliente::ativo;
Consumer<Cliente> imprimir = System.out::println;
Supplier<Cliente> criar = Cliente::new;
```

Generics são pré-requisito para entender isso bem.

---

## Streams

Streams usam Generics o tempo todo:

```java
Stream<T>
List<T>
Optional<T>
Function<T, R>
Predicate<T>
Collector<T, A, R>
```

Exemplo futuro:

```java
List<String> nomes = clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::nome)
        .toList();
```

Sem entender Generics, Streams parecem mágica.

Com Generics, Streams ficam lógicos.

---

## Spring Boot

Você verá Generics em:

```java
ResponseEntity<T>
Page<T>
List<T>
Optional<T>
JpaRepository<T, ID>
CrudRepository<T, ID>
Specification<T>
```

Exemplo futuro:

```java
public interface ClienteRepository extends JpaRepository<ClienteEntity, Long> {
    Optional<ClienteEntity> findByEmail(String email);
}
```

Isso conecta diretamente com o que você acabou de aprender.

---

## Testes

Em testes, Generics aparecem em:

```text
listas de cenários;
builders;
mocks;
assertions;
responses tipadas;
fixtures;
helpers genéricos.
```

Exemplo futuro:

```java
Resultado<Cliente> resultado = servico.cadastrar(command);
assertTrue(resultado.sucesso());
```

---

## Arquitetura

Generics aparecem em estruturas arquiteturais:

```text
UseCase<IN, OUT>;
CommandHandler<C, R>;
QueryHandler<Q, R>;
Mapper<IN, OUT>;
Repository<ID, T>;
Gateway<REQ, RES>;
ApiResponse<T>;
PageResponse<T>.
```

Mas sempre com critério.

Arquitetura boa não é transformar tudo em Generics.

É usar Generics onde eles deixam contratos mais claros.

---

# Parte 6 — Mapa de revisão por aula

## Aulas do Módulo 6 até aqui

Este módulo passou por:

```text
172 — Generics profissional do básico ao uso real
173 — Classes e interfaces genéricas
174 — Métodos genéricos
175 — Bounded types com extends
176 — Wildcards ?, extends e super
177 — PECS
178 — Type erasure
179 — Limitações e boas práticas
180 — Optional<T>
181 — Optional map, flatMap e erros comuns
182 — Mini-projeto Generics + Optional + Repository + Resultado
183 — Revisão técnica
184 — Exercícios integradores
185 — Fechamento e transição
```

---

## O que você deve dominar antes de avançar

Antes de seguir para o próximo módulo, você deve conseguir explicar:

```text
por que List<String> é melhor que List;
por que raw type é perigoso;
onde declarar <T> em método genérico;
quando usar <T extends X>;
quando usar List<?>;
quando usar ? extends;
quando usar ? super;
o que é PECS;
o que é type erasure;
por que instanceof List<String> não funciona;
quando usar Class<T>;
quando usar Supplier<T>;
quando usar Optional<T>;
quando usar map;
quando usar flatMap;
quando usar Resultado<T>;
por que Repository pode ser genérico;
por que Service deve ser específico.
```

Se algum ponto ainda estiver confuso, volte à aula correspondente.

---

# Parte 7 — Exercício final de fechamento

## Exercício teórico

Responda no seu diário:

```text
1. Explique Generics para alguém que só conhece Object.
2. Explique Optional para alguém que usa null em tudo.
3. Explique PECS com um exemplo.
4. Explique type erasure com List<String> e List<Integer>.
5. Explique por que Resultado<T> não é a mesma coisa que Optional<T>.
6. Explique por que Repository pode ser genérico.
7. Explique por que Service de negócio não deve ser genérico por padrão.
8. Explique onde a entidade deve proteger regra.
9. Explique como Generics aparecem em Spring Data.
10. Explique como Optional aparece em repositories reais.
```

---

## Exercício prático de fechamento

Crie, sem consultar as aulas anteriores, um mini-fluxo com:

```text
Sku;
Produto;
Repositorio<Sku, Produto>;
Resultado<Produto>;
ServicoProduto;
RelatorioResumivel;
Optional<Produto>;
```

Regras:

```text
Produto nasce ativo;
Produto pode ser inativado;
não pode cadastrar SKU duplicado;
buscarPorSku retorna Optional;
inativar retorna Resultado;
relatório imprime produtos.
```

Critério:

```text
sem raw type;
sem Object;
sem cast;
sem Optional.get direto;
sem Service genérico;
com regra dentro da entidade.
```

Esse exercício serve como prova prática do módulo.

---

## Exercício extra de arquitetura

Desenhe como esse mini-fluxo ficaria futuramente em Spring Boot.

Use apenas nomes, sem implementar:

```text
ProdutoController
CadastrarProdutoRequest
ProdutoResponse
ProdutoUseCase
ProdutoService
ProdutoRepository
ProdutoEntity
ProdutoMapper
ApiResponse<T>
Resultado<T>
```

Responda:

```text
quem recebe HTTP?
quem valida request?
quem coordena caso de uso?
quem protege regra?
quem salva no banco?
quem converte entity para response?
quem padroniza retorno?
```

Esse desenho prepara a transição para backend real.

---

# Parte 8 — Checklist final do Módulo 6

Marque mentalmente:

```text
[ ] Sei usar Generics sem raw type.
[ ] Sei criar classe genérica.
[ ] Sei criar interface genérica.
[ ] Sei criar método genérico.
[ ] Sei usar bounded type.
[ ] Sei usar wildcard.
[ ] Sei explicar PECS.
[ ] Sei explicar type erasure.
[ ] Sei usar Class<T> quando precisa de runtime type.
[ ] Sei usar Supplier<T> para criação flexível.
[ ] Sei usar Optional<T>.
[ ] Sei usar map.
[ ] Sei usar flatMap.
[ ] Sei usar filter.
[ ] Sei diferenciar orElse de orElseGet.
[ ] Sei usar orElseThrow.
[ ] Sei diferenciar Optional<T> de Resultado<T>.
[ ] Sei criar Repository genérico.
[ ] Sei manter Service específico.
[ ] Sei manter regra dentro da entidade.
[ ] Sei reconhecer Generics em APIs Java.
[ ] Sei como isso prepara Spring, JPA e Streams.
```

---

## Se ainda estiver difícil

Se algum ponto ainda estiver difícil, isso é normal.

Generics é um conteúdo que amadurece com repetição.

O importante é não avançar carregando dúvidas graves em:

```text
Optional;
PECS;
type erasure;
Repository genérico;
Resultado<T>.
```

Esses cinco pontos vão reaparecer muito.

Sugestão de revisão:

```text
Se Optional está confuso:
revisar aulas 180 e 181.

Se wildcards estão confusos:
revisar aulas 176 e 177.

Se type erasure está confuso:
revisar aula 178.

Se boas práticas estão confusas:
revisar aula 179.

Se arquitetura com Generics está confusa:
revisar aulas 182, 183 e 184.
```

---

# Parte 9 — Transição para o próximo módulo

## O que vem agora

Agora que você entende Generics, o próximo passo natural é estudar recursos modernos do Java que dependem fortemente dessa base.

O próximo bloco será sobre:

```text
Functional Interfaces;
Lambdas;
Method Reference;
Predicate<T>;
Function<T, R>;
Consumer<T>;
Supplier<T>;
Comparator com lambda;
Streams API;
Optional em pipelines;
operações map/filter/reduce;
processamento de listas;
boas práticas em código funcional.
```

Esse bloco será essencial para backend moderno.

Você verá isso em:

```text
tratamento de listas;
mappers;
validações;
filtros;
relatórios;
transformações;
testes;
serviços;
controllers;
streams de dados;
processamento de responses.
```

---

## Por que estudar lambdas e functional interfaces agora

Porque você já tem base para entender:

```java
Function<T, R>
Predicate<T>
Consumer<T>
Supplier<T>
Comparator<? super T>
Optional.map
Optional.flatMap
List.forEach
Stream<T>
```

Sem Generics, esses assuntos parecem decorados.

Com Generics, eles fazem sentido.

---

## Ligação com o certificado e objetivo maior

O caminho do curso continua alinhado com o objetivo maior da formação.

Este módulo reforça partes como:

```text
Java Core;
Collections avançadas;
Generics;
boas práticas;
base para APIs;
base para testes;
base para JPA;
base para Spring;
base para arquitetura.
```

Ainda vamos avançar para:

```text
SOLID;
Design Patterns;
Testes;
TDD;
SQL profundo;
JPA/Hibernate;
Spring Boot REST APIs;
Segurança;
DevOps;
Docker;
Kubernetes;
Observabilidade;
Mensageria;
DDD;
Arquitetura de Sistemas.
```

Mas cada coisa precisa vir no momento certo.

O Módulo 6 preparou terreno.

---

# Parte 10 — Compromisso técnico daqui para frente

A partir daqui, vamos manter uma linha de aprendizado com três compromissos.

## 1. Não decorar sem entender

Sempre que aparecer algo como:

```java
Function<T, R>
Predicate<T>
JpaRepository<T, ID>
ResponseEntity<T>
Optional<T>
```

vamos entender o motivo.

---

## 2. Não abstrair sem necessidade

Nem tudo será genérico.

Nem tudo será design pattern.

Nem tudo será arquitetura complexa.

A regra será:

```text
clareza primeiro;
correção sempre;
abstração quando houver ganho real.
```

---

## 3. Pensar como backend profissional

A pergunta não será apenas:

```text
como escreve esse código?
```

Também será:

```text
onde esse código deve ficar?
qual responsabilidade ele tem?
qual erro ele evita?
qual contrato ele comunica?
isso escala para um projeto real?
isso prepara para Spring/JPA/API/teste?
```

Essa é a diferença entre curso básico e formação séria.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual conceito do Módulo 6 foi mais importante?
2. Qual conceito ainda precisa de revisão?
3. Onde Generics aparecem em backend real?
4. Onde Optional deve ser usado com cuidado?
5. Qual decisão arquitetural você mais quer fixar?
```

---

## Critério de conclusão

Você concluiu o Módulo 6 se consegue:

```text
explicar Generics com suas palavras;
usar Generics sem raw type;
criar classes e interfaces genéricas;
criar métodos genéricos;
usar bounded types;
usar wildcards;
aplicar PECS;
explicar type erasure;
usar Optional com critério;
diferenciar map e flatMap;
diferenciar Optional<T> e Resultado<T>;
criar Repository genérico;
manter Service específico;
manter regra na entidade;
reconhecer Generics no Java real;
entender por que isso prepara para lambdas, streams, Spring e JPA.
```

---

## Commit recomendado

Depois de concluir a revisão e os exercícios finais:

```bash
git status
git add labs/m6/aula-185-fechamento-modulo-6-generics-optional-e-transicao
git commit -m "Aula 185: fechamento modulo 6 generics optional e transicao"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento final do módulo

O Módulo 6 fecha uma etapa importante.

Você saiu de Collections e entrou em uma camada mais profissional do Java:

```text
tipos parametrizados;
contratos genéricos;
ausência de valor;
repositórios tipados;
resultado de operações;
boas práticas de abstração.
```

A partir de agora, você vai começar a ver Java com outros olhos.

Quando aparecer:

```java
Function<T, R>
Predicate<T>
Optional<T>
Stream<T>
JpaRepository<T, ID>
ResponseEntity<T>
```

você não vai mais enxergar símbolos aleatórios.

Você vai enxergar contratos.

Essa é a virada.

Na próxima aula, iniciaremos o próximo módulo com:

```text
Functional Interfaces e Lambdas
```

Vamos entender como o Java permite tratar comportamento como valor, como isso se conecta com Generics e por que isso é base para Streams, APIs modernas, validações e processamento de dados no backend.
