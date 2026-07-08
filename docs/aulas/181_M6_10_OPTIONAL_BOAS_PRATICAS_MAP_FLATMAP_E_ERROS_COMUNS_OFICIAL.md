# 181 — M6.10 — Optional: boas práticas, map, flatMap e erros comuns

## Objetivo da aula

Nesta aula você vai aprofundar o uso profissional de:

```text
Optional<T>
```

Na aula anterior, você entendeu a base:

```text
problema do null;
Optional.of;
Optional.ofNullable;
Optional.empty;
isPresent;
isEmpty;
ifPresent;
orElse;
orElseGet;
orElseThrow;
map;
filter;
repositório retornando Optional.
```

Agora vamos avançar para o uso com mais critério, principalmente em cenários de backend.

O foco será:

```text
map;
flatMap;
encadeamento;
boas práticas;
erros comuns;
Optional em repositories;
Optional em services;
quando usar;
quando evitar.
```

Ao final desta aula, você deve conseguir:

```text
usar Optional.map com segurança;
entender Optional.flatMap;
diferenciar map e flatMap;
evitar Optional<Optional<T>>;
encadear buscas;
modelar repositório retornando Optional;
converter Optional em erro de negócio;
evitar get direto;
evitar Optional em campo de entidade;
evitar Optional em parâmetro;
entender orElse vs orElseGet na prática;
aplicar Optional em fluxos próximos de backend real.
```

---

## Ideia principal

`Optional<T>` é bom quando a ausência de valor é uma possibilidade esperada.

Exemplo:

```java
Optional<Cliente> buscarPorEmail(Email email)
```

Esse método comunica:

```text
pode encontrar cliente;
pode não encontrar cliente.
```

O erro comum é transformar Optional em um novo jeito de escrever código confuso.

Exemplo ruim:

```java
if (optional.isPresent()) {
    return optional.get();
}
```

Esse uso muitas vezes apenas troca `null` por outro problema.

A ideia profissional é usar Optional para deixar o fluxo mais expressivo.

---

## Revisão rápida: Optional é retorno, não campo

Bom:

```java
Optional<OrdemServico> buscarPorCodigo(CodigoOs codigo)
```

Evite:

```java
private Optional<String> observacao;
```

Entidade deve modelar estado e regra.

Optional é mais útil em retorno de método.

---

## Revisão rápida: Optional é ausência esperada

Use Optional quando ausência é parte normal do fluxo:

```text
buscar por código;
buscar por e-mail;
buscar configuração opcional;
buscar último evento;
buscar registro por chave externa.
```

Não use Optional para esconder erro obrigatório:

```text
nome obrigatório;
código obrigatório;
cliente obrigatório;
status obrigatório.
```

Se é obrigatório, valide e lance erro.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-181-optional-boas-praticas-map-flatmap-e-erros-comuns
cd labs\m6\aula-181-optional-boas-praticas-map-flatmap-e-erros-comuns
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula181
mkdir src\br\com\curso\aula181\app
mkdir src\br\com\curso\aula181\dominio
mkdir src\br\com\curso\aula181\dominio\valor
mkdir src\br\com\curso\aula181\dominio\cliente
mkdir src\br\com\curso\aula181\dominio\ordemservico
mkdir src\br\com\curso\aula181\infra
mkdir src\br\com\curso\aula181\util
```

---

## Exemplo 1 — map básico

`map` transforma o valor de dentro do Optional, se ele existir.

Crie:

```text
src\br\com\curso\aula181\app\OptionalMapBasicoApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import java.util.Optional;

public class OptionalMapBasicoApp {
    public static void main(String[] args) {
        Optional<String> nome = Optional.of("Ana Silva");
        Optional<String> vazio = Optional.empty();

        Optional<Integer> tamanhoNome = nome.map(String::length);
        Optional<Integer> tamanhoVazio = vazio.map(String::length);

        System.out.println("Tamanho nome: " + tamanhoNome.orElse(0));
        System.out.println("Tamanho vazio: " + tamanhoVazio.orElse(0));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalMapBasicoApp
```

---

## Como ler Optional.map

Neste trecho:

```java
Optional<Integer> tamanhoNome = nome.map(String::length);
```

Você tinha:

```java
Optional<String>
```

Depois do `map`, passou a ter:

```java
Optional<Integer>
```

O valor interno mudou de `String` para `Integer`.

Se o Optional estiver vazio, o `map` não executa a transformação.

---

## Exemplo 2 — map com objeto

Vamos criar um domínio pequeno.

Crie:

```text
src\br\com\curso\aula181\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula181.dominio.valor;

import java.util.Objects;

public final class Email {
    private final String valor;

    public Email(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        String normalizado = valor.trim().toLowerCase();

        if (!normalizado.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String dominio() {
        return valor.substring(valor.indexOf("@") + 1);
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Email email)) {
            return false;
        }

        return Objects.equals(valor, email.valor);
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
src\br\com\curso\aula181\dominio\cliente\ClienteOptional.java
```

Código:

```java
package br.com.curso.aula181.dominio.cliente;

import br.com.curso.aula181.dominio.valor.Email;

public class ClienteOptional {
    private final Email email;
    private final String nome;
    private final boolean ativo;

    public ClienteOptional(Email email, String nome, boolean ativo) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.email = email;
        this.nome = nome.trim();
        this.ativo = ativo;
    }

    public Email email() {
        return email;
    }

    public String nome() {
        return nome;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return nome + " | " + email.resumo() + " | Ativo: " + ativo;
    }
}
```

---

## Repositório de cliente com Optional

Crie:

```text
src\br\com\curso\aula181\infra\RepositorioClienteMemoria.java
```

Código:

```java
package br.com.curso.aula181.infra;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.valor.Email;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class RepositorioClienteMemoria {
    private final Map<Email, ClienteOptional> clientesPorEmail;

    public RepositorioClienteMemoria() {
        this.clientesPorEmail = new LinkedHashMap<>();
    }

    public void salvar(ClienteOptional cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (clientesPorEmail.containsKey(cliente.email())) {
            throw new IllegalStateException("Cliente já cadastrado: " + cliente.email().resumo());
        }

        clientesPorEmail.put(cliente.email(), cliente);
    }

    public Optional<ClienteOptional> buscarPorEmail(Email email) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        return Optional.ofNullable(clientesPorEmail.get(email));
    }

    public ClienteOptional buscarObrigatorio(Email email) {
        return buscarPorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado: " + email.resumo()));
    }

    public List<ClienteOptional> listar() {
        return List.copyOf(clientesPorEmail.values());
    }
}
```

---

## App com map em objeto

Crie:

```text
src\br\com\curso\aula181\app\OptionalMapObjetoApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.valor.Email;
import br.com.curso.aula181.infra.RepositorioClienteMemoria;

import java.util.Optional;

public class OptionalMapObjetoApp {
    public static void main(String[] args) {
        RepositorioClienteMemoria repositorio = new RepositorioClienteMemoria();

        repositorio.salvar(new ClienteOptional(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true
        ));

        Optional<String> nome = repositorio.buscarPorEmail(new Email("ana@empresa.com"))
                .map(ClienteOptional::nome);

        Optional<String> dominio = repositorio.buscarPorEmail(new Email("ana@empresa.com"))
                .map(ClienteOptional::email)
                .map(Email::dominio);

        System.out.println("Nome: " + nome.orElse("Não encontrado"));
        System.out.println("Domínio: " + dominio.orElse("Não encontrado"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalMapObjetoApp
```

---

## O que esse exemplo ensina

Este trecho:

```java
repositorio.buscarPorEmail(...)
        .map(ClienteOptional::email)
        .map(Email::dominio);
```

faz uma cadeia:

```text
Optional<ClienteOptional>
Optional<Email>
Optional<String>
```

Se o cliente não existir, nada quebra.

O resultado final será:

```java
Optional.empty()
```

---

## Exemplo 3 — filter com Optional

Crie:

```text
src\br\com\curso\aula181\app\OptionalFilterClienteApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.valor.Email;
import br.com.curso.aula181.infra.RepositorioClienteMemoria;

public class OptionalFilterClienteApp {
    public static void main(String[] args) {
        RepositorioClienteMemoria repositorio = new RepositorioClienteMemoria();

        repositorio.salvar(new ClienteOptional(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true
        ));

        repositorio.salvar(new ClienteOptional(
                new Email("carlos@empresa.com"),
                "Carlos Souza",
                false
        ));

        String resumoAna = repositorio.buscarPorEmail(new Email("ana@empresa.com"))
                .filter(ClienteOptional::ativo)
                .map(ClienteOptional::resumo)
                .orElse("Cliente ativo não encontrado.");

        String resumoCarlos = repositorio.buscarPorEmail(new Email("carlos@empresa.com"))
                .filter(ClienteOptional::ativo)
                .map(ClienteOptional::resumo)
                .orElse("Cliente ativo não encontrado.");

        System.out.println(resumoAna);
        System.out.println(resumoCarlos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalFilterClienteApp
```

---

## Como ler filter

O método:

```java
filter(ClienteOptional::ativo)
```

mantém o cliente apenas se ele estiver ativo.

Se o cliente estiver inativo, o Optional vira vazio.

Fluxo:

```text
busca cliente;
se existir, verifica ativo;
se ativo, gera resumo;
se não, retorna mensagem padrão.
```

---

## Exemplo 4 — O problema do Optional<Optional<T>>

Agora vamos entender `flatMap`.

Imagine um método que já retorna Optional.

Se você usar `map`, pode acabar com:

```java
Optional<Optional<T>>
```

Isso é geralmente ruim.

Vamos criar um exemplo.

Crie:

```text
src\br\com\curso\aula181\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula181.dominio.valor;

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
src\br\com\curso\aula181\dominio\ordemservico\OrdemServicoOptional.java
```

Código:

```java
package br.com.curso.aula181.dominio.ordemservico;

import br.com.curso.aula181.dominio.valor.CodigoOs;
import br.com.curso.aula181.dominio.valor.Email;

public class OrdemServicoOptional {
    private final CodigoOs codigo;
    private final Email emailCliente;
    private final String descricao;

    public OrdemServicoOptional(CodigoOs codigo, Email emailCliente, String descricao) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (emailCliente == null) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        this.codigo = codigo;
        this.emailCliente = emailCliente;
        this.descricao = descricao.trim();
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public Email emailCliente() {
        return emailCliente;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + emailCliente.resumo()
                + " | Descrição: " + descricao;
    }
}
```

Crie:

```text
src\br\com\curso\aula181\infra\RepositorioOsMemoria.java
```

Código:

```java
package br.com.curso.aula181.infra;

import br.com.curso.aula181.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula181.dominio.valor.CodigoOs;

import java.util.LinkedHashMap;
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
}
```

---

## App mostrando Optional<Optional<T>>

Crie:

```text
src\br\com\curso\aula181\app\OptionalMapGerandoOptionalDeOptionalApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula181.dominio.valor.CodigoOs;
import br.com.curso.aula181.dominio.valor.Email;
import br.com.curso.aula181.infra.RepositorioClienteMemoria;
import br.com.curso.aula181.infra.RepositorioOsMemoria;

import java.util.Optional;

public class OptionalMapGerandoOptionalDeOptionalApp {
    public static void main(String[] args) {
        RepositorioClienteMemoria clientes = new RepositorioClienteMemoria();
        RepositorioOsMemoria ordens = new RepositorioOsMemoria();

        clientes.salvar(new ClienteOptional(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true
        ));

        ordens.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                new Email("ana@empresa.com"),
                "Instalação"
        ));

        Optional<Optional<ClienteOptional>> clienteDaOs = ordens
                .buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .map(os -> clientes.buscarPorEmail(os.emailCliente()));

        System.out.println("Optional externo presente? " + clienteDaOs.isPresent());

        if (clienteDaOs.isPresent()) {
            System.out.println("Optional interno presente? " + clienteDaOs.get().isPresent());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalMapGerandoOptionalDeOptionalApp
```

---

## Por que Optional<Optional<T>> é ruim

Este tipo:

```java
Optional<Optional<ClienteOptional>>
```

é confuso.

Ele significa:

```text
talvez exista um Optional;
e dentro dele talvez exista Cliente.
```

Na prática, queremos apenas:

```java
Optional<ClienteOptional>
```

Para isso usamos:

```text
flatMap
```

---

## Exemplo 5 — flatMap

`flatMap` serve quando a função de transformação já retorna Optional.

Crie:

```text
src\br\com\curso\aula181\app\OptionalFlatMapApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula181.dominio.valor.CodigoOs;
import br.com.curso.aula181.dominio.valor.Email;
import br.com.curso.aula181.infra.RepositorioClienteMemoria;
import br.com.curso.aula181.infra.RepositorioOsMemoria;

import java.util.Optional;

public class OptionalFlatMapApp {
    public static void main(String[] args) {
        RepositorioClienteMemoria clientes = new RepositorioClienteMemoria();
        RepositorioOsMemoria ordens = new RepositorioOsMemoria();

        clientes.salvar(new ClienteOptional(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true
        ));

        ordens.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                new Email("ana@empresa.com"),
                "Instalação"
        ));

        Optional<ClienteOptional> clienteDaOs = ordens
                .buscarPorCodigo(new CodigoOs("OS-2026-0001"))
                .flatMap(os -> clientes.buscarPorEmail(os.emailCliente()));

        System.out.println(clienteDaOs
                .map(ClienteOptional::resumo)
                .orElse("Cliente da OS não encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalFlatMapApp
```

---

## Como diferenciar map e flatMap

Use `map` quando a função retorna valor simples:

```java
Optional<Cliente> -> Optional<String>
```

Exemplo:

```java
optionalCliente.map(Cliente::nome)
```

Use `flatMap` quando a função já retorna Optional:

```java
Optional<OS> -> Optional<Cliente>
```

Exemplo:

```java
optionalOs.flatMap(os -> repositorioCliente.buscarPorEmail(os.emailCliente()))
```

---

## Regra prática

```text
função retorna T:
use map.

função retorna Optional<T>:
use flatMap.
```

Exemplo:

```java
cliente.nome()
```

retorna `String`, então:

```java
map
```

Exemplo:

```java
repositorio.buscarPorEmail(...)
```

retorna `Optional<Cliente>`, então:

```java
flatMap
```

---

## Serviço usando Optional com critério

Agora vamos criar um serviço que busca a OS, busca o cliente da OS, filtra cliente ativo e retorna resumo.

Crie:

```text
src\br\com\curso\aula181\infra\ServicoConsultaOsCliente.java
```

Código:

```java
package br.com.curso.aula181.infra;

import br.com.curso.aula181.dominio.valor.CodigoOs;

public class ServicoConsultaOsCliente {
    private final RepositorioOsMemoria ordens;
    private final RepositorioClienteMemoria clientes;

    public ServicoConsultaOsCliente(
            RepositorioOsMemoria ordens,
            RepositorioClienteMemoria clientes
    ) {
        if (ordens == null) {
            throw new IllegalArgumentException("Repositório de OS é obrigatório.");
        }

        if (clientes == null) {
            throw new IllegalArgumentException("Repositório de clientes é obrigatório.");
        }

        this.ordens = ordens;
        this.clientes = clientes;
    }

    public String resumoClienteAtivoDaOs(CodigoOs codigoOs) {
        if (codigoOs == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        return ordens.buscarPorCodigo(codigoOs)
                .flatMap(os -> clientes.buscarPorEmail(os.emailCliente()))
                .filter(cliente -> cliente.ativo())
                .map(cliente -> "Cliente ativo da OS: " + cliente.resumo())
                .orElse("Cliente ativo da OS não encontrado.");
    }
}
```

Crie:

```text
src\br\com\curso\aula181\app\ServicoConsultaOsClienteApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import br.com.curso.aula181.dominio.cliente.ClienteOptional;
import br.com.curso.aula181.dominio.ordemservico.OrdemServicoOptional;
import br.com.curso.aula181.dominio.valor.CodigoOs;
import br.com.curso.aula181.dominio.valor.Email;
import br.com.curso.aula181.infra.RepositorioClienteMemoria;
import br.com.curso.aula181.infra.RepositorioOsMemoria;
import br.com.curso.aula181.infra.ServicoConsultaOsCliente;

public class ServicoConsultaOsClienteApp {
    public static void main(String[] args) {
        RepositorioClienteMemoria clientes = new RepositorioClienteMemoria();
        RepositorioOsMemoria ordens = new RepositorioOsMemoria();

        clientes.salvar(new ClienteOptional(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true
        ));

        clientes.salvar(new ClienteOptional(
                new Email("carlos@empresa.com"),
                "Carlos Souza",
                false
        ));

        ordens.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0001"),
                new Email("ana@empresa.com"),
                "Instalação"
        ));

        ordens.salvar(new OrdemServicoOptional(
                new CodigoOs("OS-2026-0002"),
                new Email("carlos@empresa.com"),
                "Reparo"
        ));

        ServicoConsultaOsCliente servico = new ServicoConsultaOsCliente(ordens, clientes);

        System.out.println(servico.resumoClienteAtivoDaOs(new CodigoOs("OS-2026-0001")));
        System.out.println(servico.resumoClienteAtivoDaOs(new CodigoOs("OS-2026-0002")));
        System.out.println(servico.resumoClienteAtivoDaOs(new CodigoOs("OS-2026-9999")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.ServicoConsultaOsClienteApp
```

---

## O que esse serviço demonstra

Este fluxo:

```java
ordens.buscarPorCodigo(codigoOs)
        .flatMap(os -> clientes.buscarPorEmail(os.emailCliente()))
        .filter(cliente -> cliente.ativo())
        .map(cliente -> "Cliente ativo da OS: " + cliente.resumo())
        .orElse("Cliente ativo da OS não encontrado.");
```

representa:

```text
buscar OS;
se existir, buscar cliente;
se existir, verificar ativo;
se ativo, gerar texto;
se qualquer etapa falhar, retornar mensagem padrão.
```

Isso é um uso bom de Optional.

---

## Cuidado: encadeamento longo demais

Optional pode deixar o código elegante.

Mas também pode ficar exagerado.

Se o encadeamento ficar grande demais, considere quebrar em métodos privados.

Exemplo:

```java
return buscarOs(codigo)
        .flatMap(this::buscarCliente)
        .filter(this::clientePodeAcessar)
        .map(this::montarResposta)
        .orElseThrow(this::erro);
```

Isso é melhor que uma cadeia gigante com lambdas enormes.

Regra:

```text
Optional deve melhorar leitura.
Se piorou, refatore.
```

---

## orElse vs orElseGet na prática

Crie:

```text
src\br\com\curso\aula181\app\OptionalOrElseVsOrElseGetApp.java
```

Código:

```java
package br.com.curso.aula181.app;

import java.util.Optional;

public class OptionalOrElseVsOrElseGetApp {
    public static void main(String[] args) {
        Optional<String> presente = Optional.of("Ana");

        System.out.println("Usando orElse:");
        String nome1 = presente.orElse(valorPadraoCaro());

        System.out.println("Resultado: " + nome1);

        System.out.println();
        System.out.println("Usando orElseGet:");
        String nome2 = presente.orElseGet(() -> valorPadraoCaro());

        System.out.println("Resultado: " + nome2);
    }

    private static String valorPadraoCaro() {
        System.out.println("Calculando valor padrão caro...");
        return "Padrão";
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula181.app.OptionalOrElseVsOrElseGetApp
```

---

## O que observar

Mesmo com valor presente, `orElse` executa o método do valor padrão antes.

`orElseGet` só executa o supplier se o Optional estiver vazio.

Regra:

```text
valor padrão simples:
orElse

valor padrão calculado:
orElseGet
```

---

## Erro comum: Optional como parâmetro

Evite:

```java
public void cadastrar(Optional<String> observacao)
```

Quem chama fica obrigado a criar Optional para passar parâmetro.

Isso geralmente piora a API.

Prefira:

```java
public void cadastrar(String observacao)
```

ou use um objeto de comando:

```java
CadastrarClienteCommand
```

com regras claras.

Optional é melhor para retorno.

---

## Erro comum: Optional como campo

Evite:

```java
private Optional<String> telefone;
```

Motivos:

```text
complica serialização;
complica frameworks;
não combina bem com entidade;
pode virar Optional null, que é pior ainda;
não melhora regra de domínio.
```

Prefira modelar corretamente:

```text
campo opcional simples;
objeto de valor;
coleção vazia;
estado explícito;
método que retorna Optional se fizer sentido.
```

---

## Erro comum: Optional null

Nunca faça:

```java
Optional<String> nome = null;
```

Isso destrói o propósito do Optional.

Um Optional deve ser:

```text
Optional.of(...)
Optional.ofNullable(...)
Optional.empty()
```

Mas não:

```text
null
```

---

## Erro comum: retornar null em método Optional

Errado:

```java
public Optional<Cliente> buscar() {
    return null;
}
```

Certo:

```java
public Optional<Cliente> buscar() {
    return Optional.empty();
}
```

Método que retorna Optional nunca deve retornar null.

---

## Erro comum: Optional em coleção

Evite, na maioria dos casos:

```java
List<Optional<Cliente>>
```

Geralmente prefira:

```java
List<Cliente>
```

com ausentes filtrados, ou um resultado próprio:

```java
ResultadoImportacao
```

que mostre:

```text
encontrados;
não encontrados;
erros.
```

Optional não deve substituir modelagem de resultado.

---

## Optional em repository vs service

### Repository

Bom:

```java
Optional<Cliente> buscarPorEmail(Email email)
```

Porque busca pode não encontrar.

### Service

Depende.

Se a ausência faz parte do fluxo, pode retornar Optional.

Se a ausência é erro de negócio, converta para exceção ou resultado claro:

```java
Cliente cliente = repository.buscarPorEmail(email)
        .orElseThrow(() -> new ClienteNaoEncontradoException(email));
```

A camada de serviço decide a semântica do fluxo.

---

## Optional e exceções de domínio

Nesta fase do curso, ainda estamos usando:

```java
IllegalArgumentException
IllegalStateException
```

Mais adiante, em exceptions avançadas, vamos criar exceções específicas:

```text
ClienteNaoEncontradoException;
OrdemServicoNaoEncontradaException;
RegraDeNegocioException;
ConflitoDeCadastroException.
```

O padrão será:

```java
repository.buscar(...)
        .orElseThrow(() -> new ClienteNaoEncontradoException(...));
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — map e filter

Execute:

```powershell
java -cp out br.com.curso.aula181.app.OptionalMapBasicoApp
java -cp out br.com.curso.aula181.app.OptionalMapObjetoApp
java -cp out br.com.curso.aula181.app.OptionalFilterClienteApp
```

### Parte 2 — flatMap

Execute:

```powershell
java -cp out br.com.curso.aula181.app.OptionalMapGerandoOptionalDeOptionalApp
java -cp out br.com.curso.aula181.app.OptionalFlatMapApp
```

### Parte 3 — serviço

Execute:

```powershell
java -cp out br.com.curso.aula181.app.ServicoConsultaOsClienteApp
```

### Parte 4 — orElse vs orElseGet

Execute:

```powershell
java -cp out br.com.curso.aula181.app.OptionalOrElseVsOrElseGetApp
```

---

## Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula181\dominio\ordemservico\TecnicoOptional.java
```

Campos:

```text
String documento;
String nome;
boolean ativo;
```

Crie um repositório:

```text
src\br\com\curso\aula181\infra\RepositorioTecnicoMemoria.java
```

Métodos:

```text
salvar(TecnicoOptional tecnico);
Optional<TecnicoOptional> buscarPorDocumento(String documento);
```

Depois ajuste ou crie uma OS com documento do técnico responsável.

Crie serviço:

```text
src\br\com\curso\aula181\infra\ServicoConsultaTecnicoDaOs.java
```

Fluxo:

```text
buscar OS por código;
flatMap buscar técnico pelo documento;
filter técnico ativo;
map resumo;
orElse mensagem padrão.
```

Crie app:

```text
src\br\com\curso\aula181\app\ServicoConsultaTecnicoDaOsApp.java
```

Critério principal:

```text
usar flatMap quando a próxima busca retorna Optional.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula181\util\OptionalUtil.java
```

Métodos:

```java
public static <T> T obrigatorio(Optional<T> optional, String mensagemErro)

public static <T, R> R mapearOuPadrao(Optional<T> optional, java.util.function.Function<T, R> mapper, R padrao)
```

Regras:

```text
optional não pode ser null;
mensagemErro não pode ser blank;
mapper não pode ser null;
padrao não pode ser null;
obrigatorio usa orElseThrow;
mapearOuPadrao usa map e orElse.
```

Crie app:

```text
src\br\com\curso\aula181\app\OptionalUtilApp.java
```

Critério principal:

```text
criar utilitário genérico sem esconder a intenção.
```

---

## Erros comuns nesta aula

### 1. Usar map quando precisa de flatMap

Se a função retorna Optional, use flatMap.

### 2. Criar Optional<Optional<T>>

Geralmente indica uso errado de map.

### 3. Usar get direto

Evite.

### 4. Encadear Optional demais

Se a cadeia ficar difícil, quebre em métodos.

### 5. Usar Optional em campo

Geralmente evite.

### 6. Usar Optional em parâmetro

Geralmente evite.

### 7. Retornar null em método Optional

Nunca faça.

### 8. Usar Optional para validação obrigatória

Se é obrigatório, valide.

### 9. Usar orElse com valor caro

Prefira orElseGet.

### 10. Achar que Optional substitui resultado de negócio

Às vezes você precisa de uma classe de resultado, não de Optional.

---

## Debug recomendado

Use debug em:

```text
OptionalMapObjetoApp.java
OptionalFilterClienteApp.java
OptionalMapGerandoOptionalDeOptionalApp.java
OptionalFlatMapApp.java
ServicoConsultaOsCliente.java
OptionalOrElseVsOrElseGetApp.java
```

Breakpoints recomendados:

```java
map(ClienteOptional::nome)

map(ClienteOptional::email)

filter(ClienteOptional::ativo)

map(os -> clientes.buscarPorEmail(...))

flatMap(os -> clientes.buscarPorEmail(...))

orElse(...)

orElseGet(...)
```

Observe:

```text
como Optional muda de tipo no map;
como filter transforma presente em vazio;
como map pode criar Optional<Optional<T>>;
como flatMap achata o Optional;
quando orElse calcula valor padrão;
quando orElseGet calcula valor padrão.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar map em Optional?
2. Quando usar flatMap?
3. Por que Optional<Optional<T>> geralmente é ruim?
4. Por que evitar Optional em campo?
5. Qual a diferença prática entre orElse e orElseGet?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Optional.map;
usar Optional.filter;
usar Optional.flatMap;
diferenciar map e flatMap;
evitar Optional<Optional<T>>;
criar fluxo de busca encadeada;
usar orElse com critério;
usar orElseGet com critério;
evitar Optional.get direto;
evitar Optional como campo;
evitar Optional como parâmetro;
entender Optional em repository;
entender Optional em service;
resolver ServicoConsultaTecnicoDaOsApp;
resolver OptionalUtilApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-181-optional-boas-praticas-map-flatmap-e-erros-comuns
git commit -m "Aula 181: optional boas praticas map flatmap e erros comuns"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Optional deve deixar fluxos de ausência mais claros, não mais confusos.
```

Você estudou:

```text
map;
filter;
flatMap;
Optional<Optional<T>>;
orElse;
orElseGet;
uso em repository;
uso em service;
erros comuns.
```

A regra mais importante:

```text
função retorna valor comum: use map.
função retorna Optional: use flatMap.
```

Na próxima aula, vamos fechar o bloco de Generics aplicado com um mini-projeto.

Vamos juntar Generics, Optional, Map, Repository em memória, Resultado<T>, Class<T> e boas práticas em um fluxo mais próximo de backend real.
