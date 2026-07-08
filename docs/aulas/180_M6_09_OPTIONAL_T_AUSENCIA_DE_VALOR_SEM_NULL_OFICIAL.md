# 180 — M6.09 — Optional<T>: ausência de valor sem null

## Objetivo da aula

Nesta aula você vai estudar uma das estruturas mais importantes do Java moderno:

```text
Optional<T>
```

O `Optional<T>` representa uma ideia simples:

```text
pode existir um valor;
ou pode não existir valor.
```

Ele é muito usado para modelar retornos de busca, consultas e operações onde a ausência é esperada.

Exemplo:

```java
Optional<OrdemServico> resultado = repositorio.buscarPorCodigo(codigo);
```

Isso comunica melhor do que retornar `null`.

Ao final desta aula, você deve conseguir:

```text
entender o problema do null;
entender o que é Optional<T>;
criar Optional com of, ofNullable e empty;
usar isPresent e isEmpty;
usar orElse, orElseGet e orElseThrow;
usar Optional em retornos de busca;
evitar Optional de forma exagerada;
não usar Optional como campo de entidade;
não usar Optional como parâmetro sem necessidade;
criar repositório em memória retornando Optional;
aplicar Optional em cenários de backend;
entender como Optional se conecta com Generics.
```

---

## Ideia principal

O problema que `Optional<T>` tenta reduzir é o uso perigoso de `null`.

Exemplo clássico:

```java
OrdemServico os = repositorio.buscarPorCodigo(codigo);
System.out.println(os.resumo());
```

Se `buscarPorCodigo` retornar `null`, a linha seguinte quebra com:

```text
NullPointerException
```

Com `Optional<T>`, o método deixa explícito que talvez não exista resultado:

```java
Optional<OrdemServico> os = repositorio.buscarPorCodigo(codigo);
```

Agora quem chama é obrigado a lidar com a possibilidade de ausência.

---

## Optional não é mágica

`Optional<T>` não elimina todos os problemas de null.

Ele também não deve ser usado em qualquer lugar.

A função principal dele é:

```text
representar ausência de retorno de forma explícita.
```

Uso bom:

```java
Optional<Cliente> buscarPorCpf(Cpf cpf)
```

Uso ruim na maioria dos casos:

```java
private Optional<String> nome;
```

ou:

```java
public void cadastrar(Optional<String> nome)
```

Vamos entender isso com calma.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-180-optional-t-ausencia-de-valor-sem-null
cd labs\m6\aula-180-optional-t-ausencia-de-valor-sem-null
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula180
mkdir src\br\com\curso\aula180\app
mkdir src\br\com\curso\aula180\dominio
mkdir src\br\com\curso\aula180\dominio\valor
mkdir src\br\com\curso\aula180\dominio\ordemservico
mkdir src\br\com\curso\aula180\infra
mkdir src\br\com\curso\aula180\util
```

---

## Exemplo 1 — O problema do null

Crie:

```text
src\br\com\curso\aula180\app\ProblemaNullApp.java
```

Código:

```java
package br.com.curso.aula180.app;

public class ProblemaNullApp {
    public static void main(String[] args) {
        String nome = buscarNome(false);

        System.out.println("Nome em maiúsculo: " + nome.toUpperCase());
    }

    private static String buscarNome(boolean encontrado) {
        if (encontrado) {
            return "Ana";
        }

        return null;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.ProblemaNullApp
```

---

## O que observar

O método:

```java
buscarNome(false)
```

retorna:

```java
null
```

Depois o código tenta:

```java
nome.toUpperCase()
```

Resultado provável:

```text
NullPointerException
```

O problema não é apenas o erro.

O problema é que a assinatura do método não comunica claramente que pode não existir nome.

```java
private static String buscarNome(boolean encontrado)
```

Essa assinatura parece retornar uma `String`.

Mas, na prática, pode retornar ausência.

---

## Exemplo 2 — Primeiro Optional

Crie:

```text
src\br\com\curso\aula180\app\PrimeiroOptionalApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class PrimeiroOptionalApp {
    public static void main(String[] args) {
        Optional<String> nomeEncontrado = buscarNome(true);
        Optional<String> nomeNaoEncontrado = buscarNome(false);

        System.out.println("Encontrado está presente? " + nomeEncontrado.isPresent());
        System.out.println("Não encontrado está presente? " + nomeNaoEncontrado.isPresent());

        if (nomeEncontrado.isPresent()) {
            System.out.println("Nome: " + nomeEncontrado.get());
        }

        if (nomeNaoEncontrado.isEmpty()) {
            System.out.println("Nome não encontrado.");
        }
    }

    private static Optional<String> buscarNome(boolean encontrado) {
        if (encontrado) {
            return Optional.of("Ana");
        }

        return Optional.empty();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.PrimeiroOptionalApp
```

---

## Como ler Optional<String>

```java
Optional<String>
```

Significa:

```text
pode haver uma String;
ou pode não haver valor.
```

Ele não é uma `String`.

Ele é uma embalagem que representa presença ou ausência.

Você deve tratar essa embalagem com cuidado.

---

## Criando Optional

Existem três formas principais.

### Optional.of

Use quando o valor não pode ser nulo:

```java
Optional<String> nome = Optional.of("Ana");
```

Se passar `null`, lança erro.

### Optional.ofNullable

Use quando o valor pode ser nulo:

```java
Optional<String> nome = Optional.ofNullable(valorPossivelmenteNulo);
```

Se for nulo, vira `Optional.empty()`.

### Optional.empty

Use para ausência:

```java
Optional<String> vazio = Optional.empty();
```

---

## Exemplo 3 — of, ofNullable e empty

Crie:

```text
src\br\com\curso\aula180\app\CriacaoOptionalApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class CriacaoOptionalApp {
    public static void main(String[] args) {
        Optional<String> comOf = Optional.of("Ana");
        Optional<String> comNullablePresente = Optional.ofNullable("Carlos");
        Optional<String> comNullableVazio = Optional.ofNullable(null);
        Optional<String> vazio = Optional.empty();

        imprimir("of", comOf);
        imprimir("ofNullable presente", comNullablePresente);
        imprimir("ofNullable vazio", comNullableVazio);
        imprimir("empty", vazio);
    }

    private static void imprimir(String titulo, Optional<String> valor) {
        System.out.println(titulo + " -> presente? " + valor.isPresent());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.CriacaoOptionalApp
```

---

## Cuidado com Optional.of(null)

Isto quebra:

```java
Optional.of(null)
```

Use `ofNullable` quando existe chance de null.

Regra prática:

```text
tenho certeza de que não é null:
Optional.of

pode ser null:
Optional.ofNullable

quero representar ausência:
Optional.empty
```

---

## Exemplo 4 — Evitando get direto

O método `get()` existe, mas deve ser usado com muito critério.

Exemplo perigoso:

```java
Optional<String> nome = Optional.empty();
System.out.println(nome.get());
```

Isso lança:

```text
NoSuchElementException
```

Ou seja:

```text
trocar null por Optional e usar get direto não resolve o problema.
```

Crie:

```text
src\br\com\curso\aula180\app\GetDiretoRuimApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class GetDiretoRuimApp {
    public static void main(String[] args) {
        Optional<String> nome = Optional.empty();

        if (nome.isPresent()) {
            System.out.println(nome.get());
        } else {
            System.out.println("Nome ausente. Não use get direto sem verificar.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.GetDiretoRuimApp
```

---

## Regra sobre get

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
filter
```

O `get()` só deve aparecer quando você já validou presença ou em cenários muito controlados.

---

## Exemplo 5 — orElse

`orElse` retorna um valor padrão quando o Optional está vazio.

Crie:

```text
src\br\com\curso\aula180\app\OptionalOrElseApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class OptionalOrElseApp {
    public static void main(String[] args) {
        Optional<String> presente = Optional.of("Ana");
        Optional<String> vazio = Optional.empty();

        String nome1 = presente.orElse("Nome padrão");
        String nome2 = vazio.orElse("Nome padrão");

        System.out.println("Presente: " + nome1);
        System.out.println("Vazio: " + nome2);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.OptionalOrElseApp
```

---

## Exemplo 6 — orElseGet

`orElseGet` recebe uma função para gerar o valor padrão apenas se precisar.

Crie:

```text
src\br\com\curso\aula180\app\OptionalOrElseGetApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class OptionalOrElseGetApp {
    public static void main(String[] args) {
        Optional<String> presente = Optional.of("Ana");
        Optional<String> vazio = Optional.empty();

        String nome1 = presente.orElseGet(() -> gerarNomePadrao());
        String nome2 = vazio.orElseGet(() -> gerarNomePadrao());

        System.out.println("Presente: " + nome1);
        System.out.println("Vazio: " + nome2);
    }

    private static String gerarNomePadrao() {
        System.out.println("Gerando nome padrão...");
        return "Nome padrão";
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.OptionalOrElseGetApp
```

---

## orElse vs orElseGet

Diferença importante:

```text
orElse:
o valor padrão é calculado antes, mesmo se o Optional tiver valor.

orElseGet:
o valor padrão só é calculado se o Optional estiver vazio.
```

Regra prática:

```text
valor padrão simples:
orElse

valor padrão caro, calculado ou vindo de método:
orElseGet
```

---

## Exemplo 7 — orElseThrow

`orElseThrow` é muito usado em backend.

Exemplo:

```java
OrdemServico os = repositorio.buscar(codigo)
        .orElseThrow(() -> new IllegalArgumentException("OS não encontrada"));
```

Crie:

```text
src\br\com\curso\aula180\app\OptionalOrElseThrowApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import java.util.Optional;

public class OptionalOrElseThrowApp {
    public static void main(String[] args) {
        Optional<String> nome = buscarNome(false);

        String valor = nome.orElseThrow(() ->
                new IllegalArgumentException("Nome não encontrado.")
        );

        System.out.println(valor);
    }

    private static Optional<String> buscarNome(boolean encontrado) {
        if (encontrado) {
            return Optional.of("Ana");
        }

        return Optional.empty();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.OptionalOrElseThrowApp
```

---

## O que observar

Esse app deve lançar exceção.

Isso é esperado.

`orElseThrow` é útil quando a ausência não pode seguir no fluxo.

Exemplo:

```text
buscar OS obrigatória;
buscar cliente obrigatório;
buscar contrato obrigatório;
buscar usuário autenticado;
buscar configuração essencial.
```

---

## Domínio da aula

Agora vamos criar um exemplo parecido com backend.

Crie:

```text
src\br\com\curso\aula180\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula180.dominio.valor;

import java.util.Objects;

public final class CodigoOs {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
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
src\br\com\curso\aula180\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula180.dominio.ordemservico;

public enum StatusOs {
    ABERTA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula180\dominio\ordemservico\OrdemServicoOptional.java
```

Código:

```java
package br.com.curso.aula180.dominio.ordemservico;

import br.com.curso.aula180.dominio.valor.CodigoOs;

public class OrdemServicoOptional {
    private final CodigoOs codigo;
    private final String cliente;
    private StatusOs status;

    public OrdemServicoOptional(CodigoOs codigo, String cliente) {
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

    public void iniciarAtendimento() {
        if (status != StatusOs.ABERTA) {
            throw new IllegalStateException("Somente OS aberta pode iniciar atendimento.");
        }

        status = StatusOs.EM_ATENDIMENTO;
    }

    public void concluir() {
        if (status != StatusOs.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public String resumo() {
        return codigo.resumo() + " | Cliente: " + cliente + " | Status: " + status;
    }
}
```

---

## Repositório retornando Optional

Crie:

```text
src\br\com\curso\aula180\infra\RepositorioOsMemoria.java
```

Código:

```java
package br.com.curso.aula180.infra;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class RepositorioOsMemoria {
    private final Map<CodigoOs, OrdemServicoOptional> ordensPorCodigo;

    public RepositorioOsMemoria() {
        this.ordensPorCodigo = new LinkedHashMap<>();
    }

    public void salvar(OrdemServicoOptional os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public Optional<OrdemServicoOptional> buscarPorCodigo(CodigoOs codigo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        return Optional.ofNullable(ordensPorCodigo.get(codigo));
    }

    public OrdemServicoOptional buscarObrigatoria(CodigoOs codigo) {
        return buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + codigo.resumo()));
    }

    public List<OrdemServicoOptional> listar() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public int quantidade() {
        return ordensPorCodigo.size();
    }
}
```

---

## Por que buscarPorCodigo retorna Optional

O método:

```java
buscarPorCodigo
```

pode encontrar ou não encontrar.

Então:

```java
Optional<OrdemServicoOptional>
```

é uma boa escolha.

Já o método:

```java
buscarObrigatoria
```

tem outra semântica:

```text
ou encontra;
ou lança erro.
```

Por isso retorna diretamente:

```java
OrdemServicoOptional
```

Essa diferença é muito importante.

---

## App de busca com Optional

Crie:

```text
src\br\com\curso\aula180\app\RepositorioOptionalBuscaApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;
import br.com.curso.aula180.infra.RepositorioOsMemoria;

import java.util.Optional;

public class RepositorioOptionalBuscaApp {
    public static void main(String[] args) {
        RepositorioOsMemoria repositorio = new RepositorioOsMemoria();

        repositorio.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        ));

        Optional<OrdemServicoOptional> encontrada =
                repositorio.buscarPorCodigo(new CodigoOs("OS-2026-0001"));

        Optional<OrdemServicoOptional> naoEncontrada =
                repositorio.buscarPorCodigo(new CodigoOs("OS-2026-9999"));

        if (encontrada.isPresent()) {
            System.out.println("Encontrada: " + encontrada.get().resumo());
        }

        if (naoEncontrada.isEmpty()) {
            System.out.println("OS não encontrada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.RepositorioOptionalBuscaApp
```

---

## Melhorando com ifPresent

`ifPresent` executa uma ação quando o valor existe.

Crie:

```text
src\br\com\curso\aula180\app\RepositorioOptionalIfPresentApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;
import br.com.curso.aula180.infra.RepositorioOsMemoria;

public class RepositorioOptionalIfPresentApp {
    public static void main(String[] args) {
        RepositorioOsMemoria repositorio = new RepositorioOsMemoria();

        repositorio.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        ));

        repositorio.buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .ifPresent(os -> System.out.println("Encontrada: " + os.resumo()));

        repositorio.buscarPorCodigo(new CodigoOs("OS-2026-9999"))
                .ifPresent(os -> System.out.println("Esta linha não será executada."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.RepositorioOptionalIfPresentApp
```

---

## Optional com map

`map` transforma o valor se ele existir.

Exemplo:

```java
Optional<OrdemServico> -> Optional<String>
```

Crie:

```text
src\br\com\curso\aula180\app\OptionalMapApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;
import br.com.curso.aula180.infra.RepositorioOsMemoria;

import java.util.Optional;

public class OptionalMapApp {
    public static void main(String[] args) {
        RepositorioOsMemoria repositorio = new RepositorioOsMemoria();

        repositorio.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        ));

        Optional<String> resumo = repositorio.buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .map(OrdemServicoOptional::resumo);

        System.out.println(resumo.orElse("Resumo não encontrado."));

        Optional<String> resumoAusente = repositorio.buscarPorCodigo(new CodigoOs("OS-2026-9999"))
                .map(OrdemServicoOptional::resumo);

        System.out.println(resumoAusente.orElse("Resumo não encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.OptionalMapApp
```

---

## Optional com filter

`filter` mantém o valor apenas se uma condição for verdadeira.

Crie:

```text
src\br\com\curso\aula180\app\OptionalFilterApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.ordemservico.StatusOs;
import br.com.curso.aula180.dominio.valor.CodigoOs;
import br.com.curso.aula180.infra.RepositorioOsMemoria;

public class OptionalFilterApp {
    public static void main(String[] args) {
        RepositorioOsMemoria repositorio = new RepositorioOsMemoria();

        OrdemServicoOptional os = new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        );

        repositorio.salvar(os);

        repositorio.buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .filter(ordem -> ordem.status() == StatusOs.ABERTA)
                .ifPresent(ordem -> System.out.println("OS aberta: " + ordem.resumo()));

        repositorio.buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .filter(ordem -> ordem.status() == StatusOs.CONCLUIDA)
                .ifPresent(ordem -> System.out.println("Esta linha não será executada."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.OptionalFilterApp
```

---

## Fluxo realista com orElseThrow

Agora vamos criar um serviço simples que busca uma OS obrigatória e inicia atendimento.

Crie:

```text
src\br\com\curso\aula180\infra\ServicoAtendimentoOs.java
```

Código:

```java
package br.com.curso.aula180.infra;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;

public class ServicoAtendimentoOs {
    private final RepositorioOsMemoria repositorio;

    public ServicoAtendimentoOs(RepositorioOsMemoria repositorio) {
        if (repositorio == null) {
            throw new IllegalArgumentException("Repositório é obrigatório.");
        }

        this.repositorio = repositorio;
    }

    public OrdemServicoOptional iniciarAtendimento(CodigoOs codigo) {
        OrdemServicoOptional os = repositorio.buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + codigo.resumo()));

        os.iniciarAtendimento();

        return os;
    }
}
```

Crie:

```text
src\br\com\curso\aula180\app\ServicoOptionalOrElseThrowApp.java
```

Código:

```java
package br.com.curso.aula180.app;

import br.com.curso.aula180.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula180.dominio.valor.CodigoOs;
import br.com.curso.aula180.infra.RepositorioOsMemoria;
import br.com.curso.aula180.infra.ServicoAtendimentoOs;

public class ServicoOptionalOrElseThrowApp {
    public static void main(String[] args) {
        RepositorioOsMemoria repositorio = new RepositorioOsMemoria();

        repositorio.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva"
        ));

        ServicoAtendimentoOs servico = new ServicoAtendimentoOs(repositorio);

        OrdemServicoOptional os = servico.iniciarAtendimento(new CodigoOs("OS-2026-0001"));

        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula180.app.ServicoOptionalOrElseThrowApp
```

---

## Onde Optional fica bem em backend

Optional fica bem em métodos de consulta:

```java
Optional<OrdemServico> buscarPorCodigo(CodigoOs codigo)
Optional<Cliente> buscarPorCpf(Cpf cpf)
Optional<Usuario> buscarPorEmail(Email email)
Optional<Configuracao> buscarConfiguracao(String chave)
```

A ideia é:

```text
a busca pode não encontrar resultado.
```

Isso é ausência esperada.

---

## Onde Optional costuma ficar ruim

Evite usar Optional como campo:

```java
private Optional<String> observacao;
```

Prefira:

```java
private String observacao;
```

com regra clara no domínio, ou modele melhor o conceito.

Evite Optional como parâmetro:

```java
public void cadastrar(Optional<String> observacao)
```

Prefira sobrecarga, objeto de comando ou parâmetro simples com validação clara.

Também evite:

```java
List<Optional<T>>
```

na maioria dos casos.

Geralmente é melhor filtrar ausentes antes.

---

## Optional não substitui validação

Isto é ruim:

```java
public void cadastrar(Optional<String> nome)
```

Nome obrigatório não deveria virar Optional.

Se é obrigatório, valide:

```java
if (nome == null || nome.isBlank()) {
    throw new IllegalArgumentException("Nome é obrigatório.");
}
```

Optional é melhor para ausência de resultado, não para esconder validação.

---

## Optional e Generics

`Optional<T>` é uma classe genérica.

Exemplos:

```java
Optional<String>
Optional<Integer>
Optional<OrdemServicoOptional>
Optional<CodigoOs>
```

O `T` representa o tipo do valor que pode estar presente.

Isso se conecta diretamente ao que você estudou em Generics.

---

## Optional e type erasure

Como `Optional<T>` usa Generics, também sofre type erasure.

Em runtime, `Optional<String>` e `Optional<Integer>` são a mesma classe:

```text
java.util.Optional
```

A segurança está principalmente em compilação.

Mesmo assim, ele melhora muito a clareza da API.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Null e Optional básico

Execute:

```powershell
java -cp out br.com.curso.aula180.app.ProblemaNullApp
java -cp out br.com.curso.aula180.app.PrimeiroOptionalApp
java -cp out br.com.curso.aula180.app.CriacaoOptionalApp
```

### Parte 2 — Formas de obter valor

Execute:

```powershell
java -cp out br.com.curso.aula180.app.GetDiretoRuimApp
java -cp out br.com.curso.aula180.app.OptionalOrElseApp
java -cp out br.com.curso.aula180.app.OptionalOrElseGetApp
java -cp out br.com.curso.aula180.app.OptionalOrElseThrowApp
```

### Parte 3 — Repositório

Execute:

```powershell
java -cp out br.com.curso.aula180.app.RepositorioOptionalBuscaApp
java -cp out br.com.curso.aula180.app.RepositorioOptionalIfPresentApp
java -cp out br.com.curso.aula180.app.OptionalMapApp
java -cp out br.com.curso.aula180.app.OptionalFilterApp
```

### Parte 4 — Serviço

Execute:

```powershell
java -cp out br.com.curso.aula180.app.ServicoOptionalOrElseThrowApp
```

---

## Desafio prático

Crie um objeto de valor:

```text
src\br\com\curso\aula180\dominio\valor\Email.java
```

Regras:

```text
não pode ser null;
não pode ser branco;
deve conter @;
normalizar para minúsculo.
```

Crie uma entidade:

```text
src\br\com\curso\aula180\dominio\cliente\ClienteOptional.java
```

Campos:

```text
Email email;
String nome;
boolean ativo;
```

Crie um repositório:

```text
src\br\com\curso\aula180\infra\RepositorioClienteMemoria.java
```

Métodos:

```text
salvar(ClienteOptional cliente);
Optional<ClienteOptional> buscarPorEmail(Email email);
ClienteOptional buscarObrigatorio(Email email);
List<ClienteOptional> listar();
```

Crie app:

```text
src\br\com\curso\aula180\app\ClienteOptionalBuscaApp.java
```

Critério principal:

```text
buscarPorEmail deve retornar Optional.
buscarObrigatorio deve usar orElseThrow.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula180\infra\ServicoClienteOptional.java
```

Método:

```text
String resumoClienteAtivo(Email email)
```

Regras:

```text
buscar cliente por email;
filtrar apenas ativo;
mapear para resumo;
se não encontrar ou não estiver ativo, retornar "Cliente ativo não encontrado."
```

Use:

```text
Optional.filter
Optional.map
Optional.orElse
```

Crie app:

```text
src\br\com\curso\aula180\app\ServicoClienteOptionalApp.java
```

Critério principal:

```text
usar Optional sem get direto.
```

---

## Erros comuns nesta aula

### 1. Usar Optional.get direto

Evite.

Prefira `orElse`, `orElseGet`, `orElseThrow`, `map`, `filter`.

### 2. Retornar null dentro de Optional

Não faça:

```java
return null;
```

em método que retorna Optional.

Retorne:

```java
Optional.empty()
```

### 3. Usar Optional.of com valor possivelmente nulo

Use `ofNullable`.

### 4. Usar Optional como campo de entidade

Geralmente evite.

### 5. Usar Optional como parâmetro

Geralmente evite.

### 6. Usar Optional para esconder validação obrigatória

Se é obrigatório, valide.

### 7. Transformar tudo em Optional

Nem tudo precisa de Optional.

### 8. Usar Optional em coleção sem necessidade

Evite `List<Optional<T>>` na maioria dos casos.

---

## Debug recomendado

Use debug em:

```text
PrimeiroOptionalApp.java
CriacaoOptionalApp.java
OptionalOrElseGetApp.java
RepositorioOsMemoria.java
OptionalMapApp.java
OptionalFilterApp.java
ServicoAtendimentoOs.java
```

Breakpoints recomendados:

```java
Optional.of(...)

Optional.ofNullable(...)

Optional.empty()

isPresent()

isEmpty()

orElse(...)

orElseGet(...)

orElseThrow(...)

map(...)

filter(...)
```

Observe:

```text
quando Optional está presente;
quando está vazio;
quando orElseGet executa o supplier;
quando orElseThrow lança exceção;
como map transforma Optional<OS> em Optional<String>;
como filter pode transformar presente em vazio.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual problema o Optional tenta reduzir?
2. Quando usar Optional.ofNullable?
3. Por que evitar get direto?
4. Quando usar orElseThrow?
5. Onde Optional fica bem em backend?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar Optional<T>;
explicar ausência de valor;
criar Optional.of;
criar Optional.ofNullable;
criar Optional.empty;
usar isPresent;
usar isEmpty;
usar ifPresent;
usar orElse;
usar orElseGet;
usar orElseThrow;
usar map;
usar filter;
criar repositório retornando Optional;
criar busca obrigatória usando orElseThrow;
evitar Optional em campo;
evitar Optional em parâmetro;
resolver ClienteOptionalBuscaApp;
resolver ServicoClienteOptionalApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-180-optional-t-ausencia-de-valor-sem-null
git commit -m "Aula 180: optional ausencia de valor sem null"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Optional<T> torna explícita a possibilidade de ausência de valor.
```

Ele é útil principalmente em retornos de busca:

```text
pode encontrar;
pode não encontrar.
```

Você viu que Optional ajuda a evitar null, mas deve ser usado com critério.

Na próxima aula, vamos aprofundar boas práticas de Optional.

Vamos estudar `map`, `flatMap`, encadeamento, erros comuns, Optional em services, Optional em repositories e como evitar código confuso.
