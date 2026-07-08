# 183 — M6.12 — Revisão técnica: Generics, Optional e boas práticas

## Objetivo da aula

Nesta aula você vai fazer uma revisão técnica do Módulo 6 até aqui.

O objetivo não é apresentar assunto novo.

O objetivo é consolidar o raciocínio profissional sobre:

```text
Generics;
type safety;
raw types;
classes genéricas;
interfaces genéricas;
métodos genéricos;
bounded types;
wildcards;
PECS;
type erasure;
Optional<T>;
Resultado<T>;
Repository genérico;
boas práticas;
erros comuns;
decisão arquitetural.
```

Essa revisão é importante porque o conteúdo de Generics costuma separar quem apenas “usa Java” de quem entende a base do ecossistema Java.

Você vai encontrar Generics em:

```text
Collections;
Optional;
Streams;
Function;
Predicate;
Comparator;
ResponseEntity;
Page;
JpaRepository;
DTOs;
mappers;
repositories;
services;
testes;
frameworks;
arquitetura.
```

Ao final desta aula, você deve conseguir:

```text
explicar Generics com clareza;
justificar o uso de Optional;
identificar exageros de abstração;
escolher entre T, wildcard, extends e super;
explicar PECS;
explicar type erasure;
entender quando usar Class<T>;
entender quando usar Supplier<T>;
explicar repository genérico;
explicar por que service não deve ser genérico sem motivo;
preparar-se para exercícios integradores do módulo.
```

---

## O ponto central do módulo

A ideia mais importante do Módulo 6 é:

```text
Generics servem para criar código reutilizável com segurança de tipo.
```

Mas existe uma segunda ideia tão importante quanto a primeira:

```text
Generics devem aumentar clareza, não esconder regra de negócio.
```

Isso significa:

```text
Repositorio<ID, T> pode fazer sentido;
Resultado<T> pode fazer sentido;
Conversor<IN, OUT> pode fazer sentido;
List<T> faz sentido;
Optional<T> faz sentido em busca.
```

Mas isso não significa que tudo deve virar:

```text
ServiceGenerico<T>;
ProcessadorGenerico<A, B, C, D>;
EntidadeGenerica<T>;
RegraGenerica<X>.
```

Backend profissional exige critério.

---

## Revisão 1 — O problema antes de Generics

Antes de Generics, era comum depender de:

```java
Object
```

Exemplo ruim:

```java
List lista = new ArrayList();
lista.add("Ana");
lista.add(100);
```

O problema aparece tarde.

Você tenta ler como `String`:

```java
String nome = (String) item;
```

e pode receber:

```text
ClassCastException
```

Generics mudam isso.

Com:

```java
List<String> nomes = new ArrayList<>();
```

o compilador impede:

```java
nomes.add(100);
```

Isso é:

```text
segurança de tipo em tempo de compilação.
```

---

## Revisão 2 — Type safety

`Type safety` significa:

```text
o compilador ajuda a impedir que tipos errados sejam usados.
```

Exemplo:

```java
Map<CodigoOs, OrdemServico> ordensPorCodigo = new HashMap<>();
```

Esse mapa não aceita qualquer chave e qualquer valor.

Ele comunica:

```text
chave: CodigoOs;
valor: OrdemServico.
```

Isso melhora:

```text
legibilidade;
debug;
refatoração;
manutenção;
contratos;
segurança.
```

---

## Revisão 3 — Raw types

Raw type é usar tipo genérico sem informar o parâmetro.

Exemplos ruins:

```java
List lista = new ArrayList();
Map mapa = new HashMap();
Repositorio repositorio = new RepositorioMemoria();
```

Exemplos corretos:

```java
List<String> nomes = new ArrayList<>();
Map<String, Integer> contagem = new LinkedHashMap<>();
Repositorio<CodigoOs, OrdemServico> repositorio = new RepositorioMemoria<>();
```

Regra profissional:

```text
evite raw types.
```

Raw type remove a proteção que Generics oferece.

---

## Revisão 4 — Classe genérica

Classe genérica declara tipo na própria classe.

Exemplo:

```java
public class Caixa<T> {
    private final T valor;

    public Caixa(T valor) {
        this.valor = valor;
    }

    public T valor() {
        return valor;
    }
}
```

Uso:

```java
Caixa<String> caixaNome = new Caixa<>("Ana");
Caixa<Integer> caixaNumero = new Caixa<>(10);
```

A mesma classe trabalha com tipos diferentes sem usar `Object` diretamente no contrato público.

---

## Revisão 5 — Interface genérica

Interface genérica define contrato reutilizável.

Exemplo:

```java
public interface Repositorio<ID, T> {
    void salvar(T item);

    Optional<T> buscarPorId(ID id);
}
```

Esse contrato pode ser usado como:

```java
Repositorio<Email, Cliente>
Repositorio<CodigoOs, OrdemServico>
Repositorio<Long, Usuario>
```

A interface é uma só.

Os tipos mudam conforme o contexto.

---

## Revisão 6 — Método genérico

Método genérico declara tipo antes do retorno.

Exemplo:

```java
public static <T> T primeiro(List<T> itens) {
    return itens.get(0);
}
```

O `<T>` antes do retorno é obrigatório.

Errado:

```java
public static T primeiro(List<T> itens)
```

Certo:

```java
public static <T> T primeiro(List<T> itens)
```

Métodos genéricos são úteis quando o comportamento é igual, mas o tipo muda.

---

## Revisão 7 — Dois ou mais tipos genéricos

Exemplo:

```java
public interface Conversor<IN, OUT> {
    OUT converter(IN entrada);
}
```

Uso:

```java
Conversor<String, Integer> textoParaNumero;
Conversor<Cliente, ClienteResponse> clienteParaResponse;
Conversor<Request, Command> requestParaCommand;
```

A escolha dos nomes importa.

Compare:

```java
Conversor<A, B>
```

com:

```java
Conversor<IN, OUT>
```

A segunda opção comunica melhor.

---

## Revisão 8 — Bounded types

Às vezes `T` livre não é suficiente.

Exemplo que não compila:

```java
public static <T> void imprimirResumo(T item) {
    System.out.println(item.resumo());
}
```

O Java não sabe se todo `T` tem `resumo()`.

A solução é criar um contrato:

```java
public interface Resumivel {
    String resumo();
}
```

E usar bounded type:

```java
public static <T extends Resumivel> void imprimirResumo(T item) {
    System.out.println(item.resumo());
}
```

Agora o compilador sabe que `T` possui `resumo()`.

---

## Revisão 9 — extends em Generics

Em Generics, `extends` significa:

```text
T deve ser aquele tipo ou algum subtipo.
```

Pode ser classe ou interface.

Mesmo com interface usamos `extends`:

```java
<T extends Resumivel>
<T extends Comparable<T>>
<T extends Identificavel<ID>>
```

Isso é normal em Java.

---

## Revisão 10 — Comparable como limite

Para ordenar naturalmente, usamos:

```java
<T extends Comparable<T>>
```

Exemplo:

```java
public static <T extends Comparable<T>> List<T> ordenar(List<T> itens) {
    List<T> copia = new ArrayList<>(itens);
    copia.sort(null);
    return List.copyOf(copia);
}
```

Esse limite permite chamar:

```java
compareTo
```

Sem esse limite, o compilador não sabe como comparar os itens.

---

## Revisão 11 — Múltiplos limites

É possível exigir mais de um contrato:

```java
<T extends Identificavel<ID> & Resumivel>
```

Isso significa:

```text
T precisa possuir ID;
T também precisa possuir resumo.
```

Exemplo:

```java
public static <ID, T extends Identificavel<ID> & Resumivel> void auditar(T item) {
    System.out.println(item.id());
    System.out.println(item.resumo());
}
```

Use com critério.

Múltiplos limites podem ser úteis, mas também podem deixar a assinatura pesada.

---

## Revisão 12 — Wildcards

Wildcard é a interrogação:

```java
?
```

Exemplos:

```java
List<?>
List<? extends Number>
List<? super Integer>
```

Wildcard significa:

```text
algum tipo desconhecido.
```

Ele aparece quando você quer flexibilidade em parâmetros.

---

## Revisão 13 — List<?>

```java
List<?>
```

Significa:

```text
lista de algum tipo desconhecido.
```

Você pode:

```text
percorrer;
ler como Object;
ver tamanho;
imprimir.
```

Mas não pode adicionar um item específico com segurança.

Porque a lista real pode ser:

```text
List<String>;
List<Integer>;
List<Cliente>;
List<LocalDate>.
```

---

## Revisão 14 — ? extends T

```java
List<? extends Atendimento>
```

Significa:

```text
lista de Atendimento ou de algum subtipo de Atendimento.
```

É bom para leitura.

Você pode ler como:

```java
Atendimento atendimento
```

Mas não deve adicionar novos atendimentos na lista.

Regra:

```text
extends é para produtor.
```

---

## Revisão 15 — ? super T

```java
List<? super AtendimentoCritico>
```

Significa:

```text
lista de AtendimentoCritico ou de algum supertipo de AtendimentoCritico.
```

Pode ser:

```text
List<AtendimentoCritico>;
List<Atendimento>;
List<Object>.
```

É bom para adicionar `AtendimentoCritico`.

Regra:

```text
super é para consumidor.
```

---

## Revisão 16 — PECS

PECS significa:

```text
Producer Extends, Consumer Super.
```

Ou:

```text
Produtor usa extends.
Consumidor usa super.
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

A origem produz itens.

O destino consome itens.

---

## Revisão 17 — Comparator<? super T>

Você verá muito:

```java
Comparator<? super T>
```

Por quê?

Porque um comparador de um supertipo consegue comparar subtipos.

Exemplo:

```java
Comparator<Atendimento> porCodigo
```

pode ordenar:

```java
List<AtendimentoCritico>
```

porque `AtendimentoCritico` é um `Atendimento`.

---

## Revisão 18 — Type erasure

Generics protegem principalmente em tempo de compilação.

Em runtime, muita informação genérica é apagada.

Exemplo:

```java
List<String> nomes = new ArrayList<>();
List<Integer> numeros = new ArrayList<>();
```

Em runtime, ambas são:

```text
java.util.ArrayList
```

A JVM não cria:

```text
ArrayListString;
ArrayListInteger.
```

Isso explica várias limitações.

---

## Revisão 19 — Limitações por type erasure

Por causa de type erasure:

```text
não dá para usar instanceof List<String>;
não dá para criar new T();
não dá para criar T[] diretamente;
não dá para sobrecarregar método só por List<String> e List<Integer>;
raw types podem causar heap pollution;
às vezes é necessário Class<T>;
às vezes é necessário TypeReference em frameworks.
```

Essas limitações não tornam Generics ruins.

Elas mostram como Java implementa Generics.

---

## Revisão 20 — Class<T>

Quando você precisa do tipo em runtime, pode passar:

```java
Class<T>
```

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
String nome = converter(objeto, String.class);
```

Isso ajuda quando a informação de tipo precisa existir em runtime.

---

## Revisão 21 — Supplier<T>

Quando você precisa criar objetos, pode receber:

```java
Supplier<T>
```

Exemplo:

```java
public class Fabrica<T> {
    private final Supplier<T> supplier;

    public Fabrica(Supplier<T> supplier) {
        this.supplier = supplier;
    }

    public T criar() {
        return supplier.get();
    }
}
```

Uso:

```java
Fabrica<Cliente> fabrica = new Fabrica<>(Cliente::new);
```

`Supplier<T>` evita depender de reflection em muitos casos.

---

## Revisão 22 — Optional<T>

`Optional<T>` representa:

```text
pode existir valor;
pode não existir valor.
```

Uso bom:

```java
Optional<Cliente> buscarPorEmail(Email email)
```

Isso comunica que a busca pode não encontrar.

Uso ruim na maioria dos casos:

```java
private Optional<String> nome;
public void cadastrar(Optional<String> nome);
```

Optional é mais indicado para retorno de método.

---

## Revisão 23 — Criando Optional

Formas principais:

```java
Optional.of(valorNaoNulo)
Optional.ofNullable(valorPossivelmenteNulo)
Optional.empty()
```

Regra:

```text
of:
quando tem certeza que não é null.

ofNullable:
quando pode ser null.

empty:
quando quer representar ausência.
```

Nunca retorne `null` em método que retorna Optional.

---

## Revisão 24 — Evite get direto

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

`get()` só é aceitável em fluxo muito controlado, geralmente após checagem explícita.

---

## Revisão 25 — map em Optional

Use `map` quando a função retorna um valor comum.

Exemplo:

```java
Optional<Cliente> cliente = buscarCliente(email);

Optional<String> nome = cliente.map(Cliente::nome);
```

Transformação:

```text
Optional<Cliente> -> Optional<String>
```

Se o Optional estiver vazio, o `map` não executa.

---

## Revisão 26 — flatMap em Optional

Use `flatMap` quando a função já retorna Optional.

Exemplo:

```java
Optional<OrdemServico> os = buscarOs(codigo);

Optional<Cliente> cliente = os.flatMap(ordem ->
        clienteRepository.buscarPorEmail(ordem.emailCliente())
);
```

Sem `flatMap`, você teria:

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

## Revisão 27 — filter em Optional

Use `filter` para manter o valor apenas se uma condição for verdadeira.

Exemplo:

```java
Optional<Cliente> clienteAtivo = buscarCliente(email)
        .filter(Cliente::ativo);
```

Se o cliente existir, mas estiver inativo, o resultado vira:

```java
Optional.empty()
```

---

## Revisão 28 — orElse vs orElseGet

```java
orElse(valorPadrao)
```

O valor padrão é avaliado antes.

```java
orElseGet(() -> gerarValorPadrao())
```

O valor padrão só é gerado se o Optional estiver vazio.

Regra:

```text
valor simples:
orElse.

valor calculado:
orElseGet.
```

---

## Revisão 29 — orElseThrow

Muito usado em backend:

```java
Cliente cliente = repository.buscarPorEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
```

Use quando ausência é erro para aquele fluxo.

Repository pode retornar Optional.

Service decide se ausência é erro, falha controlada ou resultado vazio.

---

## Revisão 30 — Resultado<T>

`Resultado<T>` é útil quando você quer representar:

```text
sucesso;
falha;
mensagem;
valor de sucesso.
```

Exemplo:

```java
Resultado<Cliente> resultado = servico.cadastrar(email, nome);
```

Ele é diferente de Optional.

`Optional<T>` representa:

```text
presença ou ausência.
```

`Resultado<T>` representa:

```text
resultado de uma operação.
```

Pode ter falha com mensagem.

---

## Optional vs Resultado<T>

### Use Optional<T> quando:

```text
a ausência é esperada;
a pergunta é: existe ou não existe?
```

Exemplo:

```java
buscarPorEmail
buscarPorCodigo
buscarConfiguracao
```

### Use Resultado<T> quando:

```text
houve uma operação;
ela pode ter sucesso ou falha;
você quer uma mensagem;
talvez queira retornar valor.
```

Exemplo:

```java
cadastrarCliente
abrirOs
cancelarOs
inativarCliente
```

---

## Revisão 31 — Repository genérico

Repository genérico faz sentido quando o comportamento é técnico e comum.

Exemplo:

```java
Repositorio<ID, T extends Identificavel<ID>>
```

Métodos:

```text
salvar;
buscarPorId;
buscarObrigatorio;
existe;
listar;
quantidade.
```

Esse padrão é útil porque o comportamento de armazenamento em memória é igual para várias entidades.

---

## Revisão 32 — Service específico

Service geralmente não deve ser genérico sem motivo.

Exemplo bom:

```java
ServicoOrdemServico
```

com métodos:

```text
abrir;
iniciarAtendimento;
concluir;
cancelar;
resumoClienteDaOs.
```

Essas são regras específicas de OS.

Se tudo vira:

```java
ServicoGenerico<T>
```

a regra de negócio some.

Regra:

```text
genérico para infraestrutura técnica;
específico para regra de negócio.
```

---

## Revisão 33 — Entidade decide

No mini-projeto, a entidade `OrdemServico` protege regras como:

```text
somente OS aberta pode iniciar atendimento;
somente OS em atendimento pode ser concluída;
OS encerrada não pode ser cancelada.
```

Essas regras não devem ficar soltas no app.

A entidade protege o próprio estado.

A frase continua:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

---

## Criando a estrutura da revisão prática

Crie a pasta:

```powershell
mkdir labs\m6\aula-183-revisao-tecnica-generics-optional-e-boas-praticas
cd labs\m6\aula-183-revisao-tecnica-generics-optional-e-boas-praticas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula183
mkdir src\br\com\curso\aula183\app
```

---

## App de diagnóstico técnico

Crie:

```text
src\br\com\curso\aula183\app\DiagnosticoModulo6App.java
```

Código:

```java
package br.com.curso.aula183.app;

import java.util.ArrayList;
import java.util.List;

public class DiagnosticoModulo6App {
    public static void main(String[] args) {
        List<String> diagnosticos = new ArrayList<>();

        diagnosticos.add("Generics evitam Object e casts desnecessários.");
        diagnosticos.add("Raw type remove segurança de tipo.");
        diagnosticos.add("Classe genérica declara tipo na classe.");
        diagnosticos.add("Método genérico declara tipo antes do retorno.");
        diagnosticos.add("Bounded type limita T a um contrato.");
        diagnosticos.add("Wildcard ? representa tipo desconhecido.");
        diagnosticos.add("? extends T é bom para leitura.");
        diagnosticos.add("? super T é bom para escrita.");
        diagnosticos.add("PECS significa Producer Extends, Consumer Super.");
        diagnosticos.add("Type erasure apaga parte da informação genérica em runtime.");
        diagnosticos.add("Optional representa presença ou ausência.");
        diagnosticos.add("map transforma valor interno do Optional.");
        diagnosticos.add("flatMap evita Optional<Optional<T>>.");
        diagnosticos.add("Resultado<T> representa sucesso ou falha de operação.");
        diagnosticos.add("Repository pode ser genérico quando o comportamento técnico é comum.");
        diagnosticos.add("Service deve continuar específico quando a regra é de negócio.");

        System.out.println("Diagnóstico técnico do Módulo 6:");

        for (String diagnostico : diagnosticos) {
            System.out.println("- " + diagnostico);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula183.app.DiagnosticoModulo6App
```

---

## Simulado técnico

Crie:

```text
src\br\com\curso\aula183\app\SimuladoModulo6App.java
```

Código:

```java
package br.com.curso.aula183.app;

import java.util.List;

public class SimuladoModulo6App {
    public static void main(String[] args) {
        List<String> perguntas = List.of(
                "1. Por que List<String> é melhor que List?",
                "2. O que é raw type?",
                "3. Onde fica o <T> em um método genérico?",
                "4. O que significa <T extends Resumivel>?",
                "5. Quando usar ? extends T?",
                "6. Quando usar ? super T?",
                "7. O que significa PECS?",
                "8. O que é type erasure?",
                "9. Por que não dá para usar instanceof List<String>?",
                "10. Quando usar Optional<T>?",
                "11. Quando usar map em Optional?",
                "12. Quando usar flatMap em Optional?",
                "13. Qual a diferença entre Optional<T> e Resultado<T>?",
                "14. Por que Repository pode ser genérico?",
                "15. Por que Service de negócio geralmente não deve ser genérico?"
        );

        System.out.println("Simulado técnico do Módulo 6:");

        for (String pergunta : perguntas) {
            System.out.println(pergunta);
        }

        System.out.println();
        System.out.println("Responda antes de consultar o gabarito da aula.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula183.app.SimuladoModulo6App
```

---

## Gabarito técnico

### 1. Por que List<String> é melhor que List?

Porque `List<String>` informa o tipo dos elementos e permite que o compilador impeça valores incorretos.

`List` é raw type e perde segurança.

---

### 2. O que é raw type?

É usar uma classe genérica sem informar o tipo.

Exemplo:

```java
List lista = new ArrayList();
```

---

### 3. Onde fica o `<T>` em um método genérico?

Antes do tipo de retorno.

Exemplo:

```java
public static <T> T primeiro(List<T> itens)
```

---

### 4. O que significa `<T extends Resumivel>`?

Significa que `T` pode ser qualquer tipo, desde que implemente ou estenda `Resumivel`.

---

### 5. Quando usar `? extends T`?

Quando a estrutura é produtora e você vai apenas ler valores.

---

### 6. Quando usar `? super T`?

Quando a estrutura é consumidora e você vai adicionar valores.

---

### 7. O que significa PECS?

```text
Producer Extends, Consumer Super.
```

---

### 8. O que é type erasure?

É o apagamento de parte das informações genéricas em runtime.

Generics protegem principalmente em tempo de compilação.

---

### 9. Por que não dá para usar `instanceof List<String>`?

Porque `List<String>` não está disponível como tipo verificável em runtime devido ao type erasure.

Use `List<?>` e valide elementos se necessário.

---

### 10. Quando usar Optional<T>?

Quando a ausência de valor é uma possibilidade esperada, principalmente em retornos de busca.

---

### 11. Quando usar map em Optional?

Quando a função transforma o valor interno em outro valor comum.

Exemplo:

```java
Optional<Cliente> -> Optional<String>
```

---

### 12. Quando usar flatMap em Optional?

Quando a função de transformação já retorna Optional.

Exemplo:

```java
Optional<OS> -> Optional<Cliente>
```

---

### 13. Qual a diferença entre Optional<T> e Resultado<T>?

`Optional<T>` representa presença ou ausência.

`Resultado<T>` representa sucesso ou falha de uma operação, normalmente com mensagem.

---

### 14. Por que Repository pode ser genérico?

Porque operações como salvar, buscar por ID, listar e verificar existência podem ser tecnicamente iguais para várias entidades identificáveis.

---

### 15. Por que Service de negócio geralmente não deve ser genérico?

Porque regras de negócio são específicas.

`ServicoOrdemServico` possui regras de OS.

`ServicoCliente` possui regras de cliente.

Generalizar isso sem critério apaga o domínio.

---

## Tabela de decisão rápida

```text
Preciso de lista tipada:
List<T>

Preciso de chave e valor:
Map<K, V>

Preciso de retorno que pode não existir:
Optional<T>

Preciso de sucesso/falha com mensagem:
Resultado<T>

Preciso de contrato com ID:
Identificavel<ID>

Preciso de repositório em memória reutilizável:
Repositorio<ID, T extends Identificavel<ID>>

Preciso ler lista de subtipos:
List<? extends T>

Preciso adicionar em lista de supertipos:
List<? super T>

Preciso ordenar por critério externo:
Comparator<? super T>

Preciso criar objeto:
Supplier<T>

Preciso validar tipo em runtime:
Class<T>

Preciso regra específica de OS:
ServicoOrdemServico ou método na entidade
```

---

## Erros comuns consolidados

### 1. Usar Generics para tudo

Nem tudo deve ser genérico.

Generics não substituem modelagem.

---

### 2. Criar ServiceGenerico sem regra clara

Se as regras são diferentes, o service deve ser específico.

---

### 3. Retornar null em método Optional

Errado:

```java
return null;
```

Certo:

```java
return Optional.empty();
```

---

### 4. Usar Optional.get direto

Evite.

Use alternativas.

---

### 5. Criar Optional<Optional<T>>

Geralmente indica que você deveria usar `flatMap`.

---

### 6. Usar wildcard em retorno público sem necessidade

Prefira tipos claros no retorno.

---

### 7. Usar Class<T> sem precisar de runtime type

Se o compilador já sabe o tipo, talvez `Class<T>` seja excesso.

---

### 8. Usar Supplier<T> quando precisa de metadados do tipo

Supplier cria objeto.

Não substitui `Class<T>` quando você precisa da classe.

---

### 9. Ignorar warnings de generics

Warning de raw type ou unchecked cast pode virar erro em runtime.

---

### 10. Misturar infraestrutura com domínio

Repository salva e busca.

Entidade protege regra.

Service coordena.

---

## Exercício de leitura de código

Analise mentalmente:

```java
public class RepositorioMemoria<ID, T extends Identificavel<ID>> {
    private final Map<ID, T> itens = new LinkedHashMap<>();

    public Optional<T> buscarPorId(ID id) {
        return Optional.ofNullable(itens.get(id));
    }
}
```

Responda:

```text
1. Por que ID é genérico?
2. Por que T tem limite?
3. Por que buscarPorId retorna Optional<T>?
4. Por que Map<ID, T> faz sentido?
5. O que aconteceria se T não fosse Identificavel<ID>?
```

Resposta esperada:

```text
ID varia conforme entidade.
T precisa fornecer id().
Busca pode não encontrar.
Map permite buscar por chave.
Sem limite, o repositório não conseguiria chamar item.id() com segurança.
```

---

## Exercício de decisão arquitetural

Cenário:

```text
Você tem Cliente, OrdemServico e Produto.
Todos possuem ID.
Todos precisam ser salvos em memória.
Cada um tem regras de negócio próprias.
```

Pergunta:

```text
O que deve ser genérico?
O que deve ser específico?
```

Resposta esperada:

```text
O repository em memória pode ser genérico.
Resultado<T> pode ser genérico.
Relatório simples pode usar Resumivel.
Services devem ser específicos.
Entidades devem ser específicas.
Regras de negócio devem ficar explícitas.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Diagnóstico

Execute:

```powershell
java -cp out br.com.curso.aula183.app.DiagnosticoModulo6App
```

Leia cada linha e explique em voz alta.

### Parte 2 — Simulado

Execute:

```powershell
java -cp out br.com.curso.aula183.app.SimuladoModulo6App
```

Responda antes de olhar o gabarito.

### Parte 3 — Revisão escrita

Crie no seu diário de bordo uma seção:

```text
Revisão M6 — Generics e Optional
```

Responda:

```text
O que eu entendi bem?
O que ainda confunde?
Onde eu usaria Generics em backend?
Onde eu evitaria Generics?
Qual diferença entre Optional e Resultado?
```

---

## Desafio prático

Sem copiar o mini-projeto anterior, desenhe no papel um novo mini-sistema com:

```text
Produto;
Sku;
Repositorio<Sku, Produto>;
Resultado<Produto>;
Optional<Produto>;
ServicoProduto;
RelatorioResumivel.
```

Regras:

```text
Produto possui SKU;
Produto possui nome;
Produto pode ser ativado/inativado;
não pode cadastrar SKU duplicado;
buscarPorSku retorna Optional;
inativar retorna Resultado<Produto>;
relatório imprime produtos.
```

Critério principal:

```text
usar Generics no repository;
usar Optional na busca;
usar Resultado<T> na operação;
manter regra dentro da entidade Produto.
```

---

## Desafio extra

Implemente o mini-sistema de Produto em Java.

Pacotes sugeridos:

```text
br.com.curso.aula183.contrato
br.com.curso.aula183.dominio.valor
br.com.curso.aula183.dominio.produto
br.com.curso.aula183.infra
br.com.curso.aula183.util
br.com.curso.aula183.app
```

Classes sugeridas:

```text
Identificavel<ID>
Resumivel
Resultado<T>
Sku
Produto
Repositorio<ID,T>
RepositorioMemoria<ID,T extends Identificavel<ID>>
ServicoProduto
RelatorioResumivel
MiniSistemaProdutoApp
```

Critério principal:

```text
não usar raw type;
não usar Object;
não usar cast;
não retornar null em busca;
não deixar Produto anêmico.
```

---

## Checklist de domínio do Módulo 6

Marque mentalmente:

```text
[ ] Sei explicar Generics.
[ ] Sei explicar raw type.
[ ] Sei criar classe genérica.
[ ] Sei criar interface genérica.
[ ] Sei criar método genérico.
[ ] Sei usar bounded type.
[ ] Sei explicar wildcard.
[ ] Sei explicar ? extends.
[ ] Sei explicar ? super.
[ ] Sei explicar PECS.
[ ] Sei explicar type erasure.
[ ] Sei usar Class<T>.
[ ] Sei usar Supplier<T>.
[ ] Sei usar Optional<T>.
[ ] Sei usar map.
[ ] Sei usar flatMap.
[ ] Sei usar filter.
[ ] Sei evitar Optional.get direto.
[ ] Sei diferenciar Optional<T> de Resultado<T>.
[ ] Sei criar repository genérico.
[ ] Sei explicar por que service deve ser específico.
```

Se algum item ainda estiver fraco, volte na aula correspondente.

---

## Debug recomendado

Nesta revisão, o debug é mental e prático.

Revise os pontos:

```text
Como o compilador sabe o tipo?
Onde o tipo se perde em runtime?
Onde Optional pode estar vazio?
Onde map transforma?
Onde flatMap evita Optional aninhado?
Onde bounded type libera chamada de método?
Onde wildcard aumenta flexibilidade?
Onde Generics exagerado pioraria o código?
```

Se quiser praticar no IntelliJ, use o mini-projeto da aula 182 e coloque breakpoints em:

```text
RepositorioMemoria.salvar
RepositorioMemoria.buscarPorId
ServicoOrdemServico.abrir
ServicoOrdemServico.resumoClienteDaOs
Resultado.sucesso
Resultado.falha
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual foi o principal ganho de Generics no módulo?
2. Qual foi a principal limitação de Generics?
3. Qual foi a regra principal de wildcards?
4. Qual foi o uso correto de Optional?
5. Qual decisão arquitetural mais importante apareceu no mini-projeto?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
responder o simulado técnico;
explicar Generics sem decorar;
explicar Optional sem confundir com null;
explicar map e flatMap;
explicar PECS;
explicar type erasure;
diferenciar Optional e Resultado;
justificar repository genérico;
justificar service específico;
desenhar mini-sistema com Produto;
implementar desafio extra se quiser consolidar;
fazer um commit limpo da revisão.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-183-revisao-tecnica-generics-optional-e-boas-praticas
git commit -m "Aula 183: revisao tecnica generics optional e boas praticas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta revisão é:

```text
Generics e Optional são ferramentas de clareza, segurança e contrato.
```

Mas o uso profissional depende de critério:

```text
use Generics para estruturas reutilizáveis;
use Optional para ausência esperada;
use Resultado<T> para operação com sucesso/falha;
use bounded type quando precisa de contrato;
use wildcard quando precisa de flexibilidade;
use service específico para regra de negócio.
```

Esse módulo é base direta para os próximos assuntos do curso.

Na próxima aula, vamos fazer exercícios integradores de Generics e Optional.

A proposta será praticar tomada de decisão técnica antes de codar:

```text
quando usar Optional;
quando usar Resultado;
quando usar Repository genérico;
quando usar bounded type;
quando usar wildcard;
quando não usar Generics.
```

Essa etapa vai fortalecer seu raciocínio para Spring, JPA, APIs, arquitetura e projetos reais.
