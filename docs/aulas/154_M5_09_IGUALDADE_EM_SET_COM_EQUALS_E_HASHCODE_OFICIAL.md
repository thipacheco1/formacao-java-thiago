# 154 — M5.09 — Igualdade em Set com equals e hashCode

## Objetivo da aula

Nesta aula você vai entender um dos assuntos mais importantes para usar `Set`, `HashSet`, `Map` e vários recursos do Java corretamente:

```text
equals e hashCode
```

Na aula anterior, você viu que `Set` não aceita elementos duplicados.

Mas ficou uma pergunta importante:

```text
como o HashSet sabe que dois elementos são iguais?
```

Com `String` e `enum`, isso já funciona bem.

Mas com objetos criados por você, como `OrdemServico`, `Cliente`, `CodigoOs` ou `Permissao`, a coisa exige cuidado.

Ao final da aula, você deve conseguir:

```text
entender como HashSet decide duplicidade;
entender o papel do equals;
entender o papel do hashCode;
entender por que equals e hashCode devem andar juntos;
criar exemplo errado sem equals/hashCode;
corrigir com equals/hashCode;
usar Objects.equals e Objects.hash;
entender igualdade por valor;
entender igualdade por identidade;
entender cuidado com entidades;
entender cuidado com campos mutáveis;
usar Set com objetos próprios corretamente;
evitar duplicidade por código de negócio;
aplicar isso em cenários de backend.
```

Essa aula é fundamental.

Muitos bugs de Java aparecem porque `equals` e `hashCode` foram ignorados ou implementados de qualquer jeito.

---

## Ideia principal

`HashSet` precisa saber se um elemento já existe.

Para isso, ele usa principalmente:

```text
hashCode;
equals.
```

Em linguagem simples:

```text
hashCode ajuda a encontrar onde procurar;
equals confirma se os objetos são realmente iguais.
```

Se você cria uma classe própria e não sobrescreve `equals` e `hashCode`, o Java usa a comparação padrão de objeto.

A comparação padrão considera objetos diferentes quando são instâncias diferentes na memória.

Mesmo que visualmente tenham os mesmos dados.

---

## Exemplo mental

Imagine dois códigos de OS:

```java
new CodigoOs("OS-2026-0001")
new CodigoOs("OS-2026-0001")
```

Para o negócio, eles representam o mesmo código.

Mas para o Java, se você não implementar `equals` e `hashCode`, eles podem ser tratados como dois objetos diferentes.

O resultado:

```text
HashSet pode aceitar os dois.
```

Isso é errado se a regra de igualdade deveria ser pelo código.

---

## String já tem equals e hashCode

Com `String`, isso funciona:

```java
Set<String> codigos = new HashSet<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0001");
```

O `Set` mantém apenas um.

Por quê?

Porque `String` já implementa `equals` e `hashCode` corretamente.

O problema aparece quando a classe é sua.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-154-igualdade-em-set-com-equals-e-hashcode
cd labs\m5\aula-154-igualdade-em-set-com-equals-e-hashcode
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula154
mkdir src\br\com\curso\aula154\app
mkdir src\br\com\curso\aula154\dominio
mkdir src\br\com\curso\aula154\dominio\ruim
mkdir src\br\com\curso\aula154\dominio\valor
mkdir src\br\com\curso\aula154\dominio\ordemservico
mkdir src\br\com\curso\aula154\dominio\usuario
```

---

## Primeiro exemplo: objeto sem equals/hashCode

Crie:

```text
src\br\com\curso\aula154\dominio\ruim\CodigoOsSemEquals.java
```

Código:

```java
package br.com.curso.aula154.dominio.ruim;

public class CodigoOsSemEquals {
    private final String valor;

    public CodigoOsSemEquals(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = valor;
    }

    public String valor() {
        return valor;
    }

    public String resumo() {
        return valor;
    }
}
```

Agora crie:

```text
src\br\com\curso\aula154\app\SetObjetoSemEqualsApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.ruim.CodigoOsSemEquals;

import java.util.HashSet;
import java.util.Set;

public class SetObjetoSemEqualsApp {
    public static void main(String[] args) {
        Set<CodigoOsSemEquals> codigos = new HashSet<>();

        codigos.add(new CodigoOsSemEquals("OS-2026-0001"));
        codigos.add(new CodigoOsSemEquals("OS-2026-0001"));

        System.out.println("Quantidade no Set: " + codigos.size());

        for (CodigoOsSemEquals codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetObjetoSemEqualsApp
```

---

## O que observar

Mesmo com o mesmo valor:

```text
OS-2026-0001
OS-2026-0001
```

o `HashSet` pode manter dois objetos.

Isso acontece porque são duas instâncias diferentes.

Sem `equals` e `hashCode`, o Java não sabe que esses dois objetos deveriam ser considerados iguais pelo valor.

---

## Comparando com String

Crie:

```text
src\br\com\curso\aula154\app\SetStringComEqualsApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import java.util.HashSet;
import java.util.Set;

public class SetStringComEqualsApp {
    public static void main(String[] args) {
        Set<String> codigos = new HashSet<>();

        codigos.add(new String("OS-2026-0001"));
        codigos.add(new String("OS-2026-0001"));

        System.out.println("Quantidade no Set: " + codigos.size());

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetStringComEqualsApp
```

---

## O que a String demonstra

Mesmo usando:

```java
new String("OS-2026-0001")
new String("OS-2026-0001")
```

o `Set` mantém apenas um.

Por quê?

Porque `String` compara o conteúdo.

A classe `String` já tem `equals` e `hashCode` implementados.

Você precisa fazer algo parecido nas suas classes quando a igualdade deve ser por valor.

---

## Criando CodigoOs correto

Agora vamos criar um objeto de valor correto.

Crie:

```text
src\br\com\curso\aula154\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula154.dominio.valor;

import java.util.Objects;

public final class CodigoOs {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = valor;
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

---

## Explicando equals

O método:

```java
@Override
public boolean equals(Object outro)
```

responde:

```text
este objeto é igual ao outro?
```

Primeiro:

```java
if (this == outro) {
    return true;
}
```

Se é exatamente o mesmo objeto na memória, é igual.

Depois:

```java
if (!(outro instanceof CodigoOs codigoOs)) {
    return false;
}
```

Se o outro não é um `CodigoOs`, não é igual.

Depois:

```java
return Objects.equals(valor, codigoOs.valor);
```

Compara o valor interno.

---

## Explicando hashCode

O método:

```java
@Override
public int hashCode() {
    return Objects.hash(valor);
}
```

gera um número baseado no valor.

Esse número é usado por estruturas como `HashSet` e `HashMap`.

Regra fundamental:

```text
se dois objetos são iguais pelo equals,
eles precisam ter o mesmo hashCode.
```

Se você sobrescreve `equals`, normalmente também sobrescreve `hashCode`.

---

## Testando CodigoOs no HashSet

Crie:

```text
src\br\com\curso\aula154\app\SetCodigoOsComEqualsApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.Set;

public class SetCodigoOsComEqualsApp {
    public static void main(String[] args) {
        Set<CodigoOs> codigos = new HashSet<>();

        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0002"));

        System.out.println("Quantidade no Set: " + codigos.size());

        for (CodigoOs codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetCodigoOsComEqualsApp
```

---

## Resultado esperado

Agora o `Set` deve manter apenas dois códigos:

```text
OS-2026-0001
OS-2026-0002
```

Mesmo criando dois objetos com o mesmo valor, o `Set` entende que são iguais.

Isso acontece porque `CodigoOs` agora tem:

```text
equals;
hashCode.
```

---

## equals sem hashCode é erro clássico

Crie uma classe propositalmente errada.

Crie:

```text
src\br\com\curso\aula154\dominio\ruim\CodigoOsSoComEquals.java
```

Código:

```java
package br.com.curso.aula154.dominio.ruim;

public class CodigoOsSoComEquals {
    private final String valor;

    public CodigoOsSoComEquals(String valor) {
        this.valor = valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOsSoComEquals codigoOs)) {
            return false;
        }

        return valor.equals(codigoOs.valor);
    }
}
```

Agora crie:

```text
src\br\com\curso\aula154\app\SetSoComEqualsSemHashCodeApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.ruim.CodigoOsSoComEquals;

import java.util.HashSet;
import java.util.Set;

public class SetSoComEqualsSemHashCodeApp {
    public static void main(String[] args) {
        Set<CodigoOsSoComEquals> codigos = new HashSet<>();

        codigos.add(new CodigoOsSoComEquals("OS-2026-0001"));
        codigos.add(new CodigoOsSoComEquals("OS-2026-0001"));

        System.out.println("Quantidade no Set: " + codigos.size());

        for (CodigoOsSoComEquals codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetSoComEqualsSemHashCodeApp
```

---

## O que esse erro mostra

Mesmo com `equals`, sem `hashCode` correto o `HashSet` pode não funcionar como esperado.

Isso reforça a regra:

```text
se sobrescrever equals, sobrescreva hashCode também.
```

Esses dois métodos formam um par.

Nunca trate como coisas isoladas.

---

## Contrato básico de equals e hashCode

Você não precisa decorar formalmente tudo agora.

Mas precisa saber estas regras práticas:

```text
1. Se a.equals(b) é true, a.hashCode() deve ser igual a b.hashCode().
2. Se a.equals(b) é false, os hashCodes podem ser iguais ou diferentes.
3. hashCode igual não garante equals true.
4. equals true exige hashCode igual.
5. Campos usados em equals devem ser coerentes com campos usados em hashCode.
```

Em linguagem simples:

```text
equals decide igualdade.
hashCode ajuda estruturas hash a organizar a busca.
```

---

## Criando PermissaoUsuario como objeto de valor

Agora vamos criar um exemplo de permissão como objeto, não enum.

Crie:

```text
src\br\com\curso\aula154\dominio\usuario\Permissao.java
```

Código:

```java
package br.com.curso.aula154.dominio.usuario;

import java.util.Objects;

public final class Permissao {
    private final String nome;

    public Permissao(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome da permissão é obrigatório.");
        }

        this.nome = nome.trim().toUpperCase();
    }

    public String nome() {
        return nome;
    }

    public String resumo() {
        return nome;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Permissao permissao)) {
            return false;
        }

        return Objects.equals(nome, permissao.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome);
    }

    @Override
    public String toString() {
        return nome;
    }
}
```

---

## Testando Set de permissões

Crie:

```text
src\br\com\curso\aula154\app\SetPermissaoComEqualsApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.usuario.Permissao;

import java.util.HashSet;
import java.util.Set;

public class SetPermissaoComEqualsApp {
    public static void main(String[] args) {
        Set<Permissao> permissoes = new HashSet<>();

        permissoes.add(new Permissao("OS_CONSULTAR"));
        permissoes.add(new Permissao("os_consultar"));
        permissoes.add(new Permissao("OS_CRIAR"));

        System.out.println("Quantidade de permissões: " + permissoes.size());

        for (Permissao permissao : permissoes) {
            System.out.println("- " + permissao.resumo());
        }

        System.out.println();
        System.out.println("Contém OS_CONSULTAR? " + permissoes.contains(new Permissao("OS_CONSULTAR")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetPermissaoComEqualsApp
```

---

## O que observar

A classe `Permissao` normaliza o nome:

```java
this.nome = nome.trim().toUpperCase();
```

Então:

```text
OS_CONSULTAR
os_consultar
```

viram o mesmo valor.

Como `equals` e `hashCode` usam `nome`, o `Set` evita duplicidade.

Isso é uma boa aplicação de objeto de valor.

---

## Cuidado com campos mutáveis no hashCode

Agora um erro perigoso.

Se você usa um campo mutável no `equals` e `hashCode`, e muda esse campo depois que o objeto entrou no `HashSet`, pode quebrar a busca.

Crie:

```text
src\br\com\curso\aula154\dominio\ruim\PermissaoMutavel.java
```

Código:

```java
package br.com.curso.aula154.dominio.ruim;

import java.util.Objects;

public class PermissaoMutavel {
    private String nome;

    public PermissaoMutavel(String nome) {
        this.nome = nome;
    }

    public void alterarNome(String novoNome) {
        this.nome = novoNome;
    }

    public String resumo() {
        return nome;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof PermissaoMutavel permissao)) {
            return false;
        }

        return Objects.equals(nome, permissao.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome);
    }
}
```

Crie:

```text
src\br\com\curso\aula154\app\HashSetComCampoMutavelApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.ruim.PermissaoMutavel;

import java.util.HashSet;
import java.util.Set;

public class HashSetComCampoMutavelApp {
    public static void main(String[] args) {
        Set<PermissaoMutavel> permissoes = new HashSet<>();

        PermissaoMutavel permissao = new PermissaoMutavel("OS_CONSULTAR");

        permissoes.add(permissao);

        System.out.println("Antes de alterar:");
        System.out.println("Contém OS_CONSULTAR? " + permissoes.contains(new PermissaoMutavel("OS_CONSULTAR")));

        permissao.alterarNome("OS_CRIAR");

        System.out.println();
        System.out.println("Depois de alterar objeto dentro do HashSet:");
        System.out.println("Contém OS_CONSULTAR? " + permissoes.contains(new PermissaoMutavel("OS_CONSULTAR")));
        System.out.println("Contém OS_CRIAR? " + permissoes.contains(new PermissaoMutavel("OS_CRIAR")));

        System.out.println();
        System.out.println("Itens no Set:");

        for (PermissaoMutavel item : permissoes) {
            System.out.println("- " + item.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.HashSetComCampoMutavelApp
```

---

## O que esse erro mostra

O objeto entrou no `HashSet` com um hash baseado em:

```text
OS_CONSULTAR
```

Depois você mudou o campo para:

```text
OS_CRIAR
```

Agora o objeto pode ficar em um lugar interno incompatível com seu novo `hashCode`.

Isso pode causar buscas estranhas.

Regra prática:

```text
evite usar campos mutáveis em equals e hashCode.
```

Em objetos de valor, prefira campos `final`.

---

## Entidade: cuidado maior

No Módulo 4, você estudou:

```text
objeto de valor;
entidade.
```

Em objeto de valor, igualdade normalmente é pelos valores.

Exemplo:

```text
CodigoOs;
Dinheiro;
PeriodoAtendimento;
Permissao.
```

Em entidade, igualdade pode ser por identidade.

Exemplo:

```text
Cliente;
Pedido;
OrdemServico;
Contrato.
```

Mas com entidade é preciso mais cuidado, especialmente quando ainda não existe ID de banco.

Neste módulo, vamos usar exemplos simples.

Mais adiante, quando chegarmos em JPA, esse assunto volta com força.

---

## Entidade OrdemServico com igualdade por código

Para estudo, vamos criar uma OS cuja igualdade será pelo código.

Crie:

```text
src\br\com\curso\aula154\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula154.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula154\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula154.dominio.ordemservico;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.Objects;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private StatusOs status;

    public OrdemServico(
            CodigoOs codigo,
            String cliente,
            LocalDate dataAtendimento
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataAtendimento == null) {
            throw new IllegalArgumentException("Data de atendimento é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = StatusOs.AGENDADA;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof OrdemServico ordemServico)) {
            return false;
        }

        return Objects.equals(codigo, ordemServico.codigo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo);
    }
}
```

---

## Testando Set de OrdemServico

Crie:

```text
src\br\com\curso\aula154\app\SetOrdemServicoPorCodigoApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.ordemservico.OrdemServico;
import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class SetOrdemServicoPorCodigoApp {
    public static void main(String[] args) {
        Set<OrdemServico> ordens = new HashSet<>();

        boolean primeira = ordens.add(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        boolean duplicada = ordens.add(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        boolean segunda = ordens.add(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12)
        ));

        System.out.println("Primeira entrou? " + primeira);
        System.out.println("Duplicada entrou? " + duplicada);
        System.out.println("Segunda entrou? " + segunda);

        System.out.println();
        System.out.println("Quantidade no Set: " + ordens.size());

        for (OrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.SetOrdemServicoPorCodigoApp
```

---

## O que observar

A segunda OS com o mesmo código não entrou.

Mesmo com cliente e data diferentes, a regra de igualdade da entidade foi:

```text
código da OS.
```

Isso é uma decisão de modelagem.

No nosso exemplo, faz sentido porque o código identifica a OS.

---

## Cuidado: igualdade deve refletir o domínio

Não implemente `equals` e `hashCode` sem pensar.

Pergunte:

```text
o que torna dois objetos iguais no meu domínio?
```

Exemplos:

```text
CodigoOs:
igual pelo valor do código.

Permissao:
igual pelo nome da permissão.

OrdemServico:
pode ser igual pelo código.

Cliente:
pode ser igual pelo id, documento ou outro identificador.

Dinheiro:
igual por valor e moeda, se existir moeda.

PeriodoAtendimento:
igual por data e turno.
```

A regra depende do conceito.

---

## Usando Set de CodigoOs como alternativa

Mesmo tendo `OrdemServico` com `equals`, às vezes é mais simples validar duplicidade com a chave.

Crie:

```text
src\br\com\curso\aula154\app\ValidacaoDuplicidadePorCodigoApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ValidacaoDuplicidadePorCodigoApp {
    public static void main(String[] args) {
        List<CodigoOs> codigosRecebidos = List.of(
                new CodigoOs("OS-2026-0001"),
                new CodigoOs("OS-2026-0002"),
                new CodigoOs("OS-2026-0001"),
                new CodigoOs("OS-2026-0003"),
                new CodigoOs("OS-2026-0002")
        );

        Set<CodigoOs> unicos = new HashSet<>();
        Set<CodigoOs> duplicados = new HashSet<>();

        for (CodigoOs codigo : codigosRecebidos) {
            boolean entrou = unicos.add(codigo);

            if (!entrou) {
                duplicados.add(codigo);
            }
        }

        System.out.println("Recebidos: " + codigosRecebidos.size());
        System.out.println("Únicos: " + unicos.size());
        System.out.println("Duplicados: " + duplicados.size());

        System.out.println();
        System.out.println("Duplicados:");

        for (CodigoOs codigo : duplicados) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.ValidacaoDuplicidadePorCodigoApp
```

---

## Usar objeto de valor como chave é bom

Esse exemplo é uma boa prática.

Em vez de trabalhar com `String` solta, usamos:

```java
CodigoOs
```

Assim o código já nasce validado.

E como `CodigoOs` tem `equals` e `hashCode`, funciona bem no `Set`.

Isso conecta Collections com Orientação a Objetos.

---

## contains com objeto próprio

Crie:

```text
src\br\com\curso\aula154\app\ContainsComObjetoProprioApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.Set;

public class ContainsComObjetoProprioApp {
    public static void main(String[] args) {
        Set<CodigoOs> codigosProcessados = new HashSet<>();

        codigosProcessados.add(new CodigoOs("OS-2026-0001"));
        codigosProcessados.add(new CodigoOs("OS-2026-0002"));

        System.out.println("Contém OS-2026-0001? "
                + codigosProcessados.contains(new CodigoOs("OS-2026-0001")));

        System.out.println("Contém OS-2026-9999? "
                + codigosProcessados.contains(new CodigoOs("OS-2026-9999")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.ContainsComObjetoProprioApp
```

---

## O que contains usa

Este trecho:

```java
codigosProcessados.contains(new CodigoOs("OS-2026-0001"))
```

funciona porque `CodigoOs` compara pelo valor.

Mesmo sendo um objeto novo, o `Set` encontra um código equivalente.

Isso depende diretamente de:

```text
equals;
hashCode.
```

---

## remove com objeto próprio

Crie:

```text
src\br\com\curso\aula154\app\RemoveComObjetoProprioApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.Set;

public class RemoveComObjetoProprioApp {
    public static void main(String[] args) {
        Set<CodigoOs> codigos = new HashSet<>();

        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0002"));

        boolean removeu = codigos.remove(new CodigoOs("OS-2026-0001"));

        System.out.println("Removeu? " + removeu);
        System.out.println("Quantidade final: " + codigos.size());

        for (CodigoOs codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.RemoveComObjetoProprioApp
```

---

## O que remove usa

Assim como `contains`, o `remove` também depende da igualdade.

Quando você faz:

```java
codigos.remove(new CodigoOs("OS-2026-0001"))
```

o `Set` procura um elemento equivalente.

Não precisa ser o mesmo objeto exato da memória.

Precisa ser igual segundo `equals` e `hashCode`.

---

## equals e hashCode no IntelliJ

Na prática, você pode gerar `equals` e `hashCode` no IntelliJ.

Mas não faça no automático sem pensar.

Antes, decida:

```text
quais campos definem igualdade?
```

Depois gere usando esses campos.

Para objeto de valor, normalmente todos os campos relevantes entram.

Para entidade, normalmente a identidade entra.

Mas com entidade persistida em banco, esse assunto exige mais cuidado.

---

## Exemplo de decisão errada

Imagine que você coloca `status` no `equals` de `OrdemServico`.

```text
Código: OS-2026-0001
Status: AGENDADA
```

Depois a OS muda para:

```text
Código: OS-2026-0001
Status: CONCLUIDA
```

Se `status` entra no `hashCode`, o objeto pode mudar sua posição lógica em um `HashSet`.

Isso é perigoso.

Por isso, evite usar campos mutáveis em `equals` e `hashCode`.

Para OS, o código é mais estável.

---

## Regra prática para este curso

Durante este curso, use esta regra:

```text
Objetos de valor:
equals/hashCode pelos valores finais.

Entidades:
equals/hashCode pela identidade estável, quando existir.

Campos mutáveis:
evite usar em hashCode.

Na dúvida:
prefira validar duplicidade usando um Set da chave de negócio.
```

Exemplo:

```java
Set<CodigoOs> codigos = new HashSet<>();
```

em vez de tentar comparar a entidade inteira.

---

## Mini-cadastro com Set de CodigoOs

Crie:

```text
src\br\com\curso\aula154\app\CadastroCodigosProcessadosApp.java
```

Código:

```java
package br.com.curso.aula154.app;

import br.com.curso.aula154.dominio.valor.CodigoOs;

import java.util.HashSet;
import java.util.Set;

public class CadastroCodigosProcessadosApp {
    public static void main(String[] args) {
        Set<CodigoOs> processados = new HashSet<>();

        registrar(processados, new CodigoOs("OS-2026-0001"));
        registrar(processados, new CodigoOs("OS-2026-0002"));
        registrar(processados, new CodigoOs("OS-2026-0001"));
        registrar(processados, new CodigoOs("OS-2026-0003"));

        System.out.println();
        System.out.println("Códigos processados:");

        for (CodigoOs codigo : processados) {
            System.out.println("- " + codigo.resumo());
        }
    }

    private static void registrar(Set<CodigoOs> processados, CodigoOs codigo) {
        boolean adicionado = processados.add(codigo);

        if (adicionado) {
            System.out.println("Processado: " + codigo.resumo());
        } else {
            System.out.println("Ignorado por duplicidade: " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula154.app.CadastroCodigosProcessadosApp
```

---

## Ligação com backend

`equals` e `hashCode` aparecem em muitos lugares:

```text
HashSet;
HashMap;
contains;
remove;
distinct;
agrupamentos;
validação de duplicidade;
comparação de objetos;
testes unitários;
coleções em entidades;
chaves de domínio;
JPA e entidades persistidas.
```

Se você não entende esse assunto, alguns bugs parecem inexplicáveis.

Exemplo:

```text
o objeto está na lista, mas contains retorna false;
o Set aceita duplicado;
o remove não remove;
o Map não encontra a chave;
o distinct não remove repetidos.
```

Na maioria desses casos, investigue `equals` e `hashCode`.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ver o problema

Execute:

```powershell
java -cp out br.com.curso.aula154.app.SetObjetoSemEqualsApp
java -cp out br.com.curso.aula154.app.SetStringComEqualsApp
```

Compare o comportamento.

### Parte 2 — Corrigir com equals/hashCode

Execute:

```powershell
java -cp out br.com.curso.aula154.app.SetCodigoOsComEqualsApp
```

Observe a duplicidade sendo evitada.

### Parte 3 — Ver erro de só equals

Execute:

```powershell
java -cp out br.com.curso.aula154.app.SetSoComEqualsSemHashCodeApp
```

Entenda por que equals sem hashCode é problema.

### Parte 4 — Usar objetos de valor

Execute:

```powershell
java -cp out br.com.curso.aula154.app.SetPermissaoComEqualsApp
java -cp out br.com.curso.aula154.app.ValidacaoDuplicidadePorCodigoApp
java -cp out br.com.curso.aula154.app.ContainsComObjetoProprioApp
java -cp out br.com.curso.aula154.app.RemoveComObjetoProprioApp
```

### Parte 5 — Ver perigo de campo mutável

Execute:

```powershell
java -cp out br.com.curso.aula154.app.HashSetComCampoMutavelApp
```

Observe o comportamento estranho após alterar o campo usado no hash.

### Parte 6 — Testar entidade por código

Execute:

```powershell
java -cp out br.com.curso.aula154.app.SetOrdemServicoPorCodigoApp
java -cp out br.com.curso.aula154.app.CadastroCodigosProcessadosApp
```

---

## Desafio prático

Crie um objeto de valor chamado:

```text
src\br\com\curso\aula154\dominio\valor\CodigoCliente.java
```

Regras:

```text
não pode ser nulo;
não pode ser branco;
deve iniciar com CLI-;
deve ser final;
campo valor deve ser final;
deve implementar equals;
deve implementar hashCode;
deve implementar toString.
```

Depois crie um app:

```text
src\br\com\curso\aula154\app\SetCodigoClienteApp.java
```

Ele deve:

```text
criar um Set<CodigoCliente>;
adicionar CLI-001;
adicionar CLI-002;
adicionar CLI-001 novamente;
exibir quantidade final;
exibir os códigos.
```

Critério principal:

```text
CLI-001 deve aparecer apenas uma vez.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula154\dominio\usuario\PerfilUsuario.java
```

Campos:

```text
String codigo;
String nome;
```

Regra de igualdade:

```text
dois perfis são iguais pelo codigo.
```

Depois crie:

```text
src\br\com\curso\aula154\app\SetPerfilUsuarioApp.java
```

Ele deve:

```text
criar Set<PerfilUsuario>;
adicionar ADMIN - Administrador;
adicionar OPERADOR - Operador;
adicionar ADMIN - Admin Atualizado;
mostrar que ADMIN entrou uma única vez;
exibir a quantidade final.
```

Critério principal:

```text
equals e hashCode devem usar somente codigo.
```

---

## Erros comuns nesta aula

### 1. Implementar equals sem hashCode

Evite sempre.

### 2. Implementar hashCode sem equals

Também não faz sentido na maioria dos casos.

### 3. Usar campo mutável em hashCode

Pode quebrar comportamento em `HashSet` e `HashMap`.

### 4. Comparar String com == dentro do equals

Use:

```java
Objects.equals(valor, outro.valor)
```

ou:

```java
valor.equals(outro.valor)
```

com cuidado contra `null`.

### 5. Gerar equals/hashCode sem pensar

Antes de gerar, defina a regra de igualdade do domínio.

### 6. Colocar status no equals de entidade

Status muda.

Se entrar no hashCode, pode causar problema.

### 7. Achar que HashSet remove duplicado de qualquer objeto automaticamente

Ele remove duplicado conforme `equals` e `hashCode`.

### 8. Confundir igualdade de referência com igualdade de valor

Mesmo valor pode estar em objetos diferentes.

---

## Debug recomendado

Use debug em:

```text
SetObjetoSemEqualsApp.java
SetCodigoOsComEqualsApp.java
SetSoComEqualsSemHashCodeApp.java
HashSetComCampoMutavelApp.java
SetOrdemServicoPorCodigoApp.java
ContainsComObjetoProprioApp.java
```

Breakpoints recomendados:

```java
codigos.add(...)

equals(...)

hashCode()

permissoes.contains(...)

codigos.remove(...)

permissao.alterarNome(...)
```

Observe:

```text
quando equals é chamado;
quando hashCode é chamado;
como HashSet evita duplicidade;
como objeto sem equals entra repetido;
como campo mutável causa comportamento estranho;
como contains funciona com objeto novo equivalente.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve equals?
2. Para que serve hashCode?
3. Por que objetos usados em HashSet precisam de equals e hashCode coerentes?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar igualdade por referência;
explicar igualdade por valor;
criar objeto sem equals e observar duplicidade;
implementar equals;
implementar hashCode;
usar Objects.equals;
usar Objects.hash;
explicar a regra equals/hashCode;
usar HashSet com objeto de valor;
usar contains com objeto próprio;
usar remove com objeto próprio;
explicar perigo de campo mutável;
explicar cuidado com entidades;
validar duplicidade com Set de chave;
resolver SetCodigoClienteApp;
resolver SetPerfilUsuarioApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-154-igualdade-em-set-com-equals-e-hashcode
git commit -m "Aula 154: igualdade em set com equals e hashcode"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
HashSet só consegue evitar duplicidade corretamente em objetos próprios quando equals e hashCode representam a igualdade do domínio.
```

Você viu que `String` e `enum` já funcionam bem, mas objetos criados por você precisam de cuidado.

Também viu uma regra fundamental:

```text
se dois objetos são iguais pelo equals, eles precisam ter o mesmo hashCode.
```

Na próxima aula, vamos estudar outras implementações de `Set`:

```text
LinkedHashSet;
TreeSet.
```

Vamos entender como preservar ordem de inserção ou manter ordenação natural em conjuntos.
