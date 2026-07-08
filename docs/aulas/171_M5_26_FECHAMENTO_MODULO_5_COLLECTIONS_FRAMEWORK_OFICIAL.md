# 171 — M5.26 — Fechamento do Módulo 5: Collections Framework

## Objetivo da aula

Nesta aula você vai fechar tecnicamente o Módulo 5.

O objetivo não é apresentar uma estrutura nova.

O objetivo é consolidar:

```text
o que você aprendeu;
o que precisa dominar;
quais erros deve evitar;
como escolher coleções;
como explicar decisões técnicas;
como levar Collections para código backend real.
```

Este módulo foi grande porque `Collections Framework` é uma base muito usada em Java.

Você não estudou apenas `ArrayList`.

Você estudou como usar coleções para modelar:

```text
cadastro;
busca;
duplicidade;
ordenação;
fila;
prioridade;
histórico;
relatório;
importação;
processamento;
agrupamento;
contagem;
proteção de retornos.
```

Ao final desta aula, você deve conseguir:

```text
resumir o Módulo 5;
explicar List, Set, Map, Queue, Deque e PriorityQueue;
escolher uma coleção pelo requisito;
explicar equals e hashCode em coleções;
explicar Comparable e Comparator;
explicar quando usar HashMap, LinkedHashMap e TreeMap;
explicar quando usar HashSet, LinkedHashSet e TreeSet;
explicar quando usar Queue, Deque e PriorityQueue;
identificar erros comuns;
se preparar para o próximo módulo.
```

---

## Onde chegamos

Você começou o Módulo 5 entendendo o básico:

```text
por que arrays são limitados;
por que coleções existem;
o que é Collection;
o que é List;
o que é Set;
o que é Map.
```

Depois avançou para assuntos mais profissionais:

```text
equals e hashCode;
objetos como chave;
ordem em Set e Map;
remoção segura;
Comparator;
PriorityQueue;
mini-projetos;
fluxos integrados.
```

Isso é uma evolução importante.

---

## O que Collections Framework representa

Collections Framework não é apenas um conjunto de classes.

Ele é uma base para representar estruturas de dados em Java.

Com ele você modela:

```text
sequências;
conjuntos;
índices;
filas;
pilhas;
prioridades;
agrupamentos;
contagens;
relatórios;
processamentos temporários.
```

Em backend, isso aparece o tempo todo.

Mesmo quando você usa banco, API, Spring, JPA ou mensageria, em algum momento você manipula coleções em memória.

---

## Resumo das principais estruturas

### List

Use quando precisa de:

```text
ordem;
índice;
sequência;
repetição permitida;
percorrer todos os elementos.
```

Exemplo:

```java
List<String> etapas = new ArrayList<>();
```

### Set

Use quando precisa de:

```text
unicidade;
bloquear duplicidade;
verificar se algo já existe.
```

Exemplo:

```java
Set<String> codigos = new HashSet<>();
```

### Map

Use quando precisa de:

```text
chave -> valor;
busca por código;
índice em memória;
contagem;
agrupamento.
```

Exemplo:

```java
Map<String, Integer> contagemPorStatus = new HashMap<>();
```

### Queue

Use quando precisa de:

```text
fila FIFO;
processamento em ordem de chegada;
consumir itens um por um.
```

Exemplo:

```java
Queue<String> fila = new ArrayDeque<>();
```

### Deque

Use quando precisa de:

```text
fila de duas pontas;
pilha moderna;
desfazer ações;
LIFO.
```

Exemplo:

```java
Deque<String> pilha = new ArrayDeque<>();
```

### PriorityQueue

Use quando precisa de:

```text
processar por prioridade;
retirar o item mais prioritário;
usar Comparator para decidir quem sai primeiro.
```

Exemplo:

```java
Queue<Tarefa> fila = new PriorityQueue<>(comparador);
```

---

## Resumo das implementações de List

### ArrayList

Boa escolha padrão para a maioria dos casos com `List`.

Use quando:

```text
precisa de lista geral;
quer acesso por índice;
quer adicionar e percorrer;
não precisa inserir/remover muito no meio por regra específica.
```

### LinkedList

Você estudou a diferença, mas ela não deve virar escolha automática.

Use com critério.

Em muitos cenários modernos, `ArrayList` ou `ArrayDeque` são escolhas melhores.

---

## Resumo das implementações de Set

### HashSet

Use quando precisa de:

```text
unicidade;
não precisa de ordem.
```

### LinkedHashSet

Use quando precisa de:

```text
unicidade;
ordem de inserção.
```

### TreeSet

Use quando precisa de:

```text
unicidade;
ordenação automática.
```

Cuidado:

```text
TreeSet precisa comparar elementos.
```

Ou seja:

```text
Comparable;
ou Comparator.
```

---

## Resumo das implementações de Map

### HashMap

Use quando precisa de:

```text
chave -> valor;
não precisa de ordem.
```

### LinkedHashMap

Use quando precisa de:

```text
chave -> valor;
ordem de inserção.
```

### TreeMap

Use quando precisa de:

```text
chave -> valor;
chaves ordenadas.
```

Cuidado:

```text
TreeMap precisa comparar chaves.
```

---

## Resumo de Queue e Deque

### ArrayDeque como Queue

Use para:

```text
fila FIFO em memória;
processamento local;
fluxos temporários.
```

### ArrayDeque como Deque

Use para:

```text
pilha;
desfazer;
remover/inserir nas duas pontas.
```

### PriorityQueue

Use para:

```text
fila por prioridade;
ordenação de saída;
processamento por critério.
```

Cuidado:

```text
PriorityQueue garante prioridade no poll, não no foreach.
```

---

## Comparable e Comparator

### Comparable

Use quando a classe possui uma ordem natural clara.

Exemplo:

```java
public final class CodigoOs implements Comparable<CodigoOs>
```

Serve para:

```text
TreeSet;
TreeMap;
Collections.sort;
Comparator.comparing usando o próprio objeto.
```

### Comparator

Use quando a ordenação é externa, contextual ou variável.

Exemplo:

```java
Comparator.comparing(OrdemServico::dataEntrada)
        .thenComparing(OrdemServico::codigo)
```

Serve para:

```text
ordenar por data;
ordenar por cliente;
ordenar por prioridade;
ordenar por múltiplos critérios.
```

---

## equals e hashCode

Este foi um dos pontos mais importantes do módulo.

Estruturas como:

```text
HashSet;
HashMap;
LinkedHashSet;
LinkedHashMap;
```

dependem de:

```text
equals;
hashCode.
```

Se você usa objeto próprio como chave de `Map` ou elemento de `Set`, precisa modelar igualdade corretamente.

Exemplo profissional:

```text
CodigoOs("OS-2026-0001")
```

deve ser igual a:

```text
CodigoOs(" os-2026-0001 ")
```

se sua regra normaliza o texto.

Por isso criamos `CodigoOs` com:

```text
validação;
normalização;
equals;
hashCode;
compareTo.
```

---

## O maior erro com coleções

O maior erro é usar:

```text
ArrayList para tudo.
```

Dá para fazer muita coisa com `ArrayList`.

Mas nem sempre é a melhor escolha.

Exemplos ruins:

```text
buscar por código varrendo List;
evitar duplicidade manualmente com List;
simular fila com remove(0);
ordenar toda hora para pegar prioridade;
guardar chave e valor em listas paralelas.
```

Um código mais maduro escolhe a estrutura certa.

---

## Como escolher uma coleção

Use este roteiro.

### Precisa de sequência?

Use:

```text
List.
```

### Precisa de unicidade?

Use:

```text
Set.
```

### Precisa de chave e valor?

Use:

```text
Map.
```

### Precisa de ordem de chegada para processamento?

Use:

```text
Queue.
```

### Precisa de pilha?

Use:

```text
Deque.
```

### Precisa de prioridade?

Use:

```text
PriorityQueue.
```

### Precisa de ordenação automática?

Use:

```text
TreeSet;
TreeMap.
```

### Precisa manter ordem de inserção?

Use:

```text
ArrayList;
LinkedHashSet;
LinkedHashMap.
```

### Precisa ordenar de várias formas?

Use:

```text
Comparator.
```

---

## Matriz de decisão rápida

```text
Problema:
guardar etapas de um fluxo.

Escolha:
List.

Motivo:
ordem e sequência importam.
```

```text
Problema:
impedir códigos duplicados.

Escolha:
Set.

Motivo:
unicidade.
```

```text
Problema:
buscar OS por código.

Escolha:
Map<CodigoOs, OrdemServico>.

Motivo:
busca por chave.
```

```text
Problema:
listar códigos únicos na ordem de importação.

Escolha:
LinkedHashSet.

Motivo:
unicidade + ordem de inserção.
```

```text
Problema:
listar códigos únicos ordenados.

Escolha:
TreeSet.

Motivo:
unicidade + ordenação.
```

```text
Problema:
processar OS na ordem recebida.

Escolha:
Queue com ArrayDeque.

Motivo:
FIFO.
```

```text
Problema:
processar OS crítica primeiro.

Escolha:
PriorityQueue com Comparator.

Motivo:
prioridade.
```

```text
Problema:
histórico de eventos.

Escolha:
List.

Motivo:
ordem cronológica e repetição possível.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-171-fechamento-modulo-5-collections-framework
cd labs\m5\aula-171-fechamento-modulo-5-collections-framework
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula171
mkdir src\br\com\curso\aula171\app
```

---

## App de diagnóstico final

Crie:

```text
src\br\com\curso\aula171\app\DiagnosticoFinalCollectionsApp.java
```

Código:

```java
package br.com.curso.aula171.app;

import java.util.ArrayList;
import java.util.List;

public class DiagnosticoFinalCollectionsApp {
    public static void main(String[] args) {
        List<String> diagnosticos = new ArrayList<>();

        diagnosticos.add("Sequência com índice -> List / ArrayList");
        diagnosticos.add("Unicidade sem ordem -> Set / HashSet");
        diagnosticos.add("Unicidade com ordem de inserção -> LinkedHashSet");
        diagnosticos.add("Unicidade ordenada -> TreeSet");
        diagnosticos.add("Busca por chave -> Map / HashMap");
        diagnosticos.add("Busca por chave com ordem de cadastro -> LinkedHashMap");
        diagnosticos.add("Busca por chave ordenada pela chave -> TreeMap");
        diagnosticos.add("Fila FIFO -> Queue / ArrayDeque");
        diagnosticos.add("Pilha LIFO -> Deque / ArrayDeque");
        diagnosticos.add("Fila por prioridade -> PriorityQueue");
        diagnosticos.add("Ordenação contextual -> Comparator");
        diagnosticos.add("Ferramentas prontas -> Collections");

        System.out.println("Diagnóstico final do Módulo 5:");

        for (String diagnostico : diagnosticos) {
            System.out.println("- " + diagnostico);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula171.app.DiagnosticoFinalCollectionsApp
```

---

## App de simulado técnico

Agora crie um pequeno simulado.

Crie:

```text
src\br\com\curso\aula171\app\SimuladoTecnicoCollectionsApp.java
```

Código:

```java
package br.com.curso.aula171.app;

import java.util.ArrayList;
import java.util.List;

public class SimuladoTecnicoCollectionsApp {
    public static void main(String[] args) {
        List<String> perguntas = new ArrayList<>();

        perguntas.add("1. Qual coleção usar para buscar Cliente por CPF?");
        perguntas.add("2. Qual coleção usar para impedir permissões duplicadas?");
        perguntas.add("3. Qual coleção usar para manter itens únicos na ordem do arquivo?");
        perguntas.add("4. Qual coleção usar para processar mensagens na ordem de chegada?");
        perguntas.add("5. Qual coleção usar para processar chamados críticos primeiro?");
        perguntas.add("6. Qual estrutura usar para desfazer ações?");
        perguntas.add("7. O que acontece se usar objeto sem equals/hashCode em HashSet?");
        perguntas.add("8. Por que PriorityQueue não deve ser exibida com foreach esperando prioridade?");
        perguntas.add("9. Quando usar Comparator em vez de Comparable?");
        perguntas.add("10. Por que retornar List.copyOf em vez da lista interna?");

        System.out.println("Simulado técnico Collections:");

        for (String pergunta : perguntas) {
            System.out.println(pergunta);
        }

        System.out.println();
        System.out.println("Responda no seu caderno antes de olhar o gabarito da aula.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula171.app.SimuladoTecnicoCollectionsApp
```

---

## Gabarito conceitual do simulado

### 1. Qual coleção usar para buscar Cliente por CPF?

Resposta esperada:

```text
Map<Cpf, Cliente>
```

Motivo:

```text
busca por chave.
```

### 2. Qual coleção usar para impedir permissões duplicadas?

Resposta esperada:

```text
Set<Permissao>
```

Motivo:

```text
unicidade.
```

### 3. Qual coleção usar para manter itens únicos na ordem do arquivo?

Resposta esperada:

```text
LinkedHashSet
```

Motivo:

```text
unicidade + ordem de inserção.
```

### 4. Qual coleção usar para processar mensagens na ordem de chegada?

Resposta esperada:

```text
Queue com ArrayDeque
```

Motivo:

```text
FIFO.
```

### 5. Qual coleção usar para processar chamados críticos primeiro?

Resposta esperada:

```text
PriorityQueue com Comparator
```

Motivo:

```text
fila por prioridade.
```

### 6. Qual estrutura usar para desfazer ações?

Resposta esperada:

```text
Deque com ArrayDeque
```

Motivo:

```text
comportamento de pilha LIFO.
```

### 7. O que acontece se usar objeto sem equals/hashCode em HashSet?

Resposta esperada:

```text
O Set pode considerar objetos visualmente iguais como diferentes,
porque a igualdade padrão será por referência.
```

### 8. Por que PriorityQueue não deve ser exibida com foreach esperando prioridade?

Resposta esperada:

```text
Porque PriorityQueue garante prioridade na remoção com poll,
não na iteração com foreach.
```

### 9. Quando usar Comparator em vez de Comparable?

Resposta esperada:

```text
Quando a ordenação é externa, contextual, variável
ou quando a classe pode ser ordenada por vários critérios.
```

### 10. Por que retornar List.copyOf em vez da lista interna?

Resposta esperada:

```text
Para proteger o estado interno da classe
e impedir alteração externa não controlada.
```

---

## App de comparação de escolhas

Crie:

```text
src\br\com\curso\aula171\app\ComparacaoEscolhasCollectionsApp.java
```

Código:

```java
package br.com.curso.aula171.app;

import java.util.ArrayList;
import java.util.List;

public class ComparacaoEscolhasCollectionsApp {
    public static void main(String[] args) {
        List<String> comparacoes = new ArrayList<>();

        comparacoes.add("HashSet vs LinkedHashSet: ambos evitam duplicidade, mas LinkedHashSet preserva ordem.");
        comparacoes.add("HashMap vs LinkedHashMap: ambos buscam por chave, mas LinkedHashMap preserva ordem de inserção.");
        comparacoes.add("LinkedHashMap vs TreeMap: LinkedHashMap ordena por chegada; TreeMap ordena pela chave.");
        comparacoes.add("ArrayDeque vs PriorityQueue: ArrayDeque respeita chegada; PriorityQueue respeita prioridade.");
        comparacoes.add("Comparable vs Comparator: Comparable é natural da classe; Comparator é critério externo.");
        comparacoes.add("List vs Set: List permite repetição; Set bloqueia duplicidade.");
        comparacoes.add("Map vs List: Map busca por chave; List exige percorrer para procurar.");
        comparacoes.add("Queue vs Deque: Queue representa fila; Deque pode ser fila de duas pontas ou pilha.");

        System.out.println("Comparações essenciais:");

        for (String comparacao : comparacoes) {
            System.out.println("- " + comparacao);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula171.app.ComparacaoEscolhasCollectionsApp
```

---

## Erros comuns consolidados

### 1. Usar List para tudo

Sintoma:

```text
código cheio de for procurando itens.
```

Correção:

```text
use Map para busca por chave;
use Set para duplicidade;
use Queue para fila.
```

### 2. Usar HashMap esperando ordem

Sintoma:

```text
funciona hoje, quebra amanhã.
```

Correção:

```text
use LinkedHashMap ou TreeMap quando ordem importa.
```

### 3. Usar HashSet esperando ordem

Correção:

```text
use LinkedHashSet para ordem de inserção;
use TreeSet para ordenação.
```

### 4. Usar objeto como chave sem equals/hashCode

Correção:

```text
implemente igualdade por valor quando fizer sentido.
```

### 5. Mudar campo usado em hash dentro de Set/Map

Correção:

```text
chaves devem ser estáveis.
```

### 6. Mudar prioridade de objeto dentro de PriorityQueue

Correção:

```text
remova, altere e reinsira;
ou modele de outra forma.
```

### 7. Retornar coleção interna

Correção:

```text
List.copyOf;
Set.copyOf;
Map.copyOf;
ou cópia defensiva adequada.
```

### 8. Não criar critério de desempate

Correção:

```text
use thenComparing.
```

### 9. Misturar regra de negócio com estrutura

Correção:

```text
estrutura organiza dados;
domínio protege regras.
```

### 10. Confundir fila em memória com mensageria

Correção:

```text
Queue em memória não substitui RabbitMQ, Kafka, SQS ou broker real.
```

---

## O que você deve dominar antes de seguir

Você não precisa decorar todos os métodos.

Mas precisa dominar os conceitos abaixo.

```text
List:
add, get, set, remove, contains, size, isEmpty.

Set:
add, contains, remove, unicidade, equals/hashCode.

Map:
put, get, containsKey, remove, keySet, values, entrySet, merge.

Queue:
offer, poll, peek.

Deque:
push, pop, offerFirst, offerLast, pollFirst, pollLast.

PriorityQueue:
Comparator, poll, peek, cuidado com foreach.

Collections:
sort, reverse, min, max, frequency, disjoint.

Comparator:
comparing, comparingInt, thenComparing, reversed.

Proteção:
List.copyOf e cópias defensivas.
```

---

## Como este módulo ajuda no backend

Em backend, Collections aparece em:

```text
DTOs;
validações;
serviços;
use cases;
mappers;
repositories em memória;
testes;
relatórios;
agrupar dados;
contar status;
deduplicar importação;
montar resposta de API;
controlar permissões;
processar filas locais;
ordenar resultados;
criar índices temporários.
```

Exemplo:

```text
Endpoint recebe uma lista de itens.
Você precisa validar duplicados antes de salvar.
```

Provável solução:

```text
Set para detectar duplicados;
Map para indexar;
List para erros.
```

Outro exemplo:

```text
Endpoint retorna OS agrupadas por status.
```

Provável solução:

```text
Map<Status, List<OrdemServico>>
```

---

## Importante: Collections não substitui banco

Um `Map` em memória não é banco de dados.

Uma `Queue` em memória não é broker.

Um `List` em memória não é persistência.

Coleções são fundamentais, mas têm limites:

```text
somem ao reiniciar aplicação;
não resolvem concorrência distribuída;
não garantem transação;
não são persistentes;
não substituem arquitetura.
```

Mais adiante, você aprenderá a ligar essa base com:

```text
PostgreSQL;
JPA;
repositories;
transações;
Spring Boot;
mensageria;
cache;
observabilidade.
```

---

## Relação com arquitetura

A forma como você usou Collections já preparou o terreno para arquitetura.

Você viu que:

```text
entidade protege regra;
classe de fluxo coordena;
classe de memória guarda temporariamente;
classe de relatório monta visão;
app executa cenário.
```

Essa separação evolui naturalmente para:

```text
Controller;
Use Case;
Service;
Repository;
Domain;
Gateway;
DTO;
Mapper.
```

A frase que deve ficar:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

---

## Revisão dos projetos do módulo

Durante o Módulo 5, você construiu progressivamente:

```text
cadastros em memória;
mapas por código;
sets de duplicidade;
filas de atendimento;
filas prioritárias;
relatórios;
processadores de importação;
mini-projeto final de atendimento.
```

Esses projetos treinaram:

```text
modelagem;
responsabilidade;
estrutura de dados;
raciocínio de backend;
proteção de estado;
critérios de escolha.
```

---

## Avaliação técnica pessoal

Antes de encerrar, responda com sinceridade.

```text
1. Eu sei explicar quando usar List?
2. Eu sei explicar quando usar Set?
3. Eu sei explicar quando usar Map?
4. Eu sei explicar quando usar Queue?
5. Eu sei explicar quando usar PriorityQueue?
6. Eu sei explicar equals/hashCode?
7. Eu sei criar objeto de valor como chave?
8. Eu sei explicar Comparator?
9. Eu sei proteger retorno de coleção?
10. Eu sei justificar minha escolha técnica?
```

Se alguma resposta for fraca, volte nas aulas correspondentes.

---

## Mini-avaliação prática

Crie um app chamado:

```text
src\br\com\curso\aula171\app\AvaliacaoPraticaCollectionsApp.java
```

Código base:

```java
package br.com.curso.aula171.app;

import java.util.ArrayList;
import java.util.List;

public class AvaliacaoPraticaCollectionsApp {
    public static void main(String[] args) {
        List<String> respostas = new ArrayList<>();

        respostas.add("Buscar por código: Map");
        respostas.add("Evitar duplicidade: Set");
        respostas.add("Manter duplicidade e ordem: List");
        respostas.add("Processar por chegada: Queue");
        respostas.add("Processar por prioridade: PriorityQueue");
        respostas.add("Desfazer última ação: Deque");
        respostas.add("Ordenar por múltiplos critérios: Comparator");
        respostas.add("Códigos únicos ordenados: TreeSet");
        respostas.add("Chave-valor com ordem de cadastro: LinkedHashMap");
        respostas.add("Itens únicos na ordem de seleção: LinkedHashSet");

        System.out.println("Avaliação prática do Módulo 5:");

        for (String resposta : respostas) {
            System.out.println("- " + resposta);
        }
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula171.app.AvaliacaoPraticaCollectionsApp
```

---

## Desafio final do módulo

Sem olhar as aulas anteriores, tente desenhar no papel um mini-sistema que tenha:

```text
cadastro por código;
seleção sem duplicidade;
fila de processamento;
fila prioritária;
relatório por status;
histórico;
listagem ordenada.
```

Para cada item, escreva:

```text
estrutura escolhida;
motivo técnico;
risco se escolher errado.
```

Exemplo:

```text
Cadastro por código:
Map<CodigoOs, OrdemServico>.
Motivo: busca por chave.
Risco se usar List: busca manual, mais erro e menos clareza.
```

Esse exercício mede se você realmente entendeu o módulo.

---

## Checklist final do Módulo 5

Marque mentalmente:

```text
[ ] Sei usar List.
[ ] Sei usar ArrayList.
[ ] Sei explicar LinkedList.
[ ] Sei usar Set.
[ ] Sei usar HashSet.
[ ] Sei usar LinkedHashSet.
[ ] Sei usar TreeSet.
[ ] Sei usar Map.
[ ] Sei usar HashMap.
[ ] Sei usar LinkedHashMap.
[ ] Sei usar TreeMap.
[ ] Sei usar Queue.
[ ] Sei usar Deque.
[ ] Sei usar PriorityQueue.
[ ] Sei usar Collections.
[ ] Sei usar Comparator.
[ ] Sei explicar Comparable.
[ ] Sei explicar equals/hashCode.
[ ] Sei usar objeto como chave.
[ ] Sei proteger retornos.
[ ] Sei escolher estrutura por requisito.
```

Não precisa estar perfeito.

Mas precisa estar consciente.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-171-fechamento-modulo-5-collections-framework
git commit -m "Aula 171: fechamento modulo 5 collections framework"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento do Módulo 5

A principal ideia do Módulo 5 é:

```text
coleções são escolhas de modelagem, não apenas recipientes de dados.
```

Você aprendeu que cada coleção responde a uma intenção:

```text
List:
sequência.

Set:
unicidade.

Map:
chave e valor.

Queue:
fila.

Deque:
duas pontas ou pilha.

PriorityQueue:
prioridade.

TreeSet e TreeMap:
ordenação.

LinkedHashSet e LinkedHashMap:
ordem de inserção.

Comparator:
critério externo.

Collections:
ferramentas prontas.
```

Esse módulo construiu uma base muito forte para os próximos assuntos.

Na próxima aula, começaremos um novo módulo.

O próximo passo será aprofundar `Generics`.

Você já usou generics em `List<String>`, `Map<CodigoOs, OrdemServico>` e `Queue<RegistroImportacaoOs>`.

Agora vamos entender generics de verdade:

```text
por que existe;
como funciona;
como criar classes genéricas;
como criar métodos genéricos;
o que são bounded types;
o que são wildcards;
como isso aparece em APIs, repositories, responses e arquitetura Java.
```
