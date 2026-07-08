# 149 — M5.04 — ArrayList operações CRUD

## Objetivo da aula

Nesta aula você vai aplicar `ArrayList` em um cenário muito comum de backend:

```text
CRUD em memória.
```

CRUD significa:

```text
Create  -> criar/cadastrar
Read    -> consultar/listar/buscar
Update  -> atualizar/alterar
Delete  -> remover/excluir
```

Na aula anterior, você estudou a interface `List` e a implementação `ArrayList`, usando métodos como:

```text
add;
get;
set;
remove;
contains;
size;
isEmpty.
```

Agora vamos juntar esses métodos em um pequeno cadastro de Ordem de Serviço em memória.

Ao final da aula, você deve conseguir:

```text
criar um cadastro em memória usando ArrayList;
cadastrar objetos em uma lista;
listar objetos cadastrados;
buscar objeto por código;
validar duplicidade antes de cadastrar;
atualizar dados de um objeto encontrado;
remover objeto da lista;
entender CRUD usando List;
organizar operações em uma classe própria;
evitar main gigante;
aplicar regras simples usando objetos e enum.
```

Essa aula é muito importante porque muitos repositórios em memória, testes e protótipos usam listas antes de entrar em banco de dados.

---

## Ideia principal

Uma `List` pode ser usada para armazenar objetos em memória.

Exemplo:

```java
List<OrdemServico> ordens = new ArrayList<>();
```

Com essa lista, podemos fazer:

```text
cadastrar OS;
listar OS;
buscar OS;
alterar OS;
remover OS.
```

Isso simula um pequeno banco em memória.

Não é banco real.

Mas ajuda a treinar lógica de cadastro e manipulação de objetos.

---

## CRUD em linguagem simples

CRUD representa as quatro operações básicas sobre dados.

### Create

Criar algo novo.

Exemplo:

```java
cadastro.cadastrar(os);
```

### Read

Consultar algo existente.

Exemplo:

```java
cadastro.listar();
cadastro.buscarPorCodigo("OS-2026-0001");
```

### Update

Alterar algo existente.

Exemplo:

```java
cadastro.reagendar("OS-2026-0001", novaData);
```

### Delete

Remover algo existente.

Exemplo:

```java
cadastro.remover("OS-2026-0001");
```

Em sistemas backend, você verá CRUD o tempo todo.

---

## Por que começar com ArrayList

Antes de usar banco de dados, é importante entender como os dados podem ser manipulados em memória.

Quando você usa banco, muita coisa parece mágica.

Mas, conceitualmente, várias operações continuam iguais:

```text
adicionar;
buscar;
alterar;
remover;
listar.
```

Com `ArrayList`, você enxerga a lógica por dentro.

Depois, quando usar PostgreSQL, JPA e Spring Data, tudo fará mais sentido.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-149-arraylist-operacoes-crud
cd labs\m5\aula-149-arraylist-operacoes-crud
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula149
mkdir src\br\com\curso\aula149\app
mkdir src\br\com\curso\aula149\dominio
mkdir src\br\com\curso\aula149\dominio\ordemservico
mkdir src\br\com\curso\aula149\infra
```

Nesta aula teremos:

```text
dominio.ordemservico:
classes de negócio simples.

infra:
cadastro em memória usando ArrayList.

app:
programas para testar CRUD.
```

---

## StatusOs

Crie:

```text
src\br\com\curso\aula149\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula149.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

---

## Por que enum

Não use status como `String`.

Evite:

```java
String status = "Concluida";
```

Prefira:

```java
StatusOs status = StatusOs.CONCLUIDA;
```

Com enum, o Java limita os valores possíveis.

Isso evita erro de digitação e deixa a regra mais clara.

---

## Classe OrdemServico

Crie:

```text
src\br\com\curso\aula149\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula149.dominio.ordemservico;

import java.time.LocalDate;

public class OrdemServico {
    private final String codigo;
    private String cliente;
    private LocalDate dataAtendimento;
    private StatusOs status;

    public OrdemServico(
            String codigo,
            String cliente,
            LocalDate dataAtendimento
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!codigo.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
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

    public String codigo() {
        return codigo;
    }

    public boolean possuiCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void alterarCliente(String novoCliente) {
        if (novoCliente == null || novoCliente.isBlank()) {
            throw new IllegalArgumentException("Novo cliente é obrigatório.");
        }

        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode alterar cliente.");
        }

        cliente = novoCliente;
    }

    public void reagendar(LocalDate novaData) {
        if (novaData == null) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (dataAtendimento.equals(novaData)) {
            throw new IllegalArgumentException("Nova data deve ser diferente da atual.");
        }

        dataAtendimento = novaData;
        status = StatusOs.REAGENDADA;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS já está concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public void cancelar() {
        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS já está cancelada.");
        }

        status = StatusOs.CANCELADA;
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

## O papel da OrdemServico

Nesta aula, `OrdemServico` é uma entidade simples.

Ela protege algumas regras:

```text
código obrigatório;
código começa com OS-;
cliente obrigatório;
data obrigatória;
OS encerrada não pode trocar cliente;
OS encerrada não pode ser reagendada;
OS cancelada não pode ser concluída;
OS concluída não pode ser cancelada.
```

Mesmo estudando `ArrayList`, não vamos abandonar a boa modelagem.

A lista guarda objetos.

Mas cada objeto ainda precisa proteger suas regras.

---

## Cadastro em memória com ArrayList

Agora vamos criar a classe que concentra o CRUD.

Crie:

```text
src\br\com\curso\aula149\infra\CadastroOrdemServicoMemoria.java
```

Código:

```java
package br.com.curso.aula149.infra;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CadastroOrdemServicoMemoria {
    private final List<OrdemServico> ordens;

    public CadastroOrdemServicoMemoria() {
        this.ordens = new ArrayList<>();
    }

    public void cadastrar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (existe(os.codigo())) {
            throw new IllegalStateException("Já existe OS cadastrada com o código: " + os.codigo());
        }

        ordens.add(os);
    }

    public List<OrdemServico> listar() {
        return List.copyOf(ordens);
    }

    public OrdemServico buscarPorCodigo(String codigo) {
        for (OrdemServico os : ordens) {
            if (os.possuiCodigo(codigo)) {
                return os;
            }
        }

        return null;
    }

    public void alterarCliente(String codigo, String novoCliente) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.alterarCliente(novoCliente);
    }

    public void reagendar(String codigo, LocalDate novaData) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.reagendar(novaData);
    }

    public void concluir(String codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.concluir();
    }

    public void cancelar(String codigo) {
        OrdemServico os = buscarObrigatoria(codigo);
        os.cancelar();
    }

    public boolean remover(String codigo) {
        OrdemServico encontrada = buscarPorCodigo(codigo);

        if (encontrada == null) {
            return false;
        }

        return ordens.remove(encontrada);
    }

    public int quantidade() {
        return ordens.size();
    }

    public boolean vazio() {
        return ordens.isEmpty();
    }

    public boolean existe(String codigo) {
        return buscarPorCodigo(codigo) != null;
    }

    public int contarPorStatus(StatusOs status) {
        int total = 0;

        for (OrdemServico os : ordens) {
            if (os.possuiStatus(status)) {
                total++;
            }
        }

        return total;
    }

    private OrdemServico buscarObrigatoria(String codigo) {
        OrdemServico os = buscarPorCodigo(codigo);

        if (os == null) {
            throw new IllegalArgumentException("OS não encontrada: " + codigo);
        }

        return os;
    }
}
```

---

## O que essa classe faz

`CadastroOrdemServicoMemoria` usa:

```java
private final List<OrdemServico> ordens;
```

Ela concentra as operações:

```text
cadastrar;
listar;
buscar;
alterar cliente;
reagendar;
concluir;
cancelar;
remover;
contar;
verificar existência.
```

Isso evita deixar tudo no `main`.

O `main` vai apenas executar cenários.

---

## Por que List.copyOf no listar

O método `listar` retorna:

```java
return List.copyOf(ordens);
```

Isso evita que quem chamou consiga alterar a lista interna diretamente.

Se retornássemos:

```java
return ordens;
```

um código externo poderia fazer:

```java
cadastro.listar().clear();
```

e apagar tudo por fora.

Mesmo sendo infraestrutura em memória, é bom manter proteção.

---

## Por que buscarPorCodigo retorna null nesta aula

Nesta aula, `buscarPorCodigo` retorna `null` quando não encontra.

```java
return null;
```

Isso é simples para este momento.

Mais adiante, neste mesmo módulo, vamos estudar:

```text
Optional
```

Com `Optional`, uma busca ausente fica mais expressiva.

Por enquanto, vamos tratar `null` com cuidado.

---

## CRUD completo em um app

Crie:

```text
src\br\com\curso\aula149\app\CrudArrayListApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudArrayListApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        System.out.println("CREATE - cadastrando OS");
        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12)
        ));

        System.out.println();
        System.out.println("READ - listando OS");
        imprimir(cadastro);

        System.out.println();
        System.out.println("READ - buscando OS-2026-0002");
        OrdemServico encontrada = cadastro.buscarPorCodigo("OS-2026-0002");

        if (encontrada != null) {
            System.out.println("Encontrada: " + encontrada.resumo());
        } else {
            System.out.println("OS não encontrada.");
        }

        System.out.println();
        System.out.println("UPDATE - reagendando OS-2026-0002");
        cadastro.reagendar(
                "OS-2026-0002",
                LocalDate.of(2026, 12, 20)
        );
        imprimir(cadastro);

        System.out.println();
        System.out.println("DELETE - removendo OS-2026-0001");
        boolean removida = cadastro.remover("OS-2026-0001");
        System.out.println("Removida? " + removida);
        imprimir(cadastro);
    }

    private static void imprimir(CadastroOrdemServicoMemoria cadastro) {
        if (cadastro.vazio()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println("Quantidade: " + cadastro.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudArrayListApp
```

---

## O que observar no CRUD

Observe o fluxo:

```text
CREATE:
cadastro.cadastrar(...)

READ:
cadastro.listar()
cadastro.buscarPorCodigo(...)

UPDATE:
cadastro.reagendar(...)

DELETE:
cadastro.remover(...)
```

Essa estrutura é a base de muitos sistemas.

Mais adiante, isso vira:

```text
POST;
GET;
PUT/PATCH;
DELETE.
```

Em API REST, CRUD continua sendo um conceito central.

---

## Validando duplicidade

Crie:

```text
src\br\com\curso\aula149\app\CrudDuplicidadeApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudDuplicidadeApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        try {
            cadastro.cadastrar(new OrdemServico(
                    "OS-2026-0001",
                    "Carlos Souza",
                    LocalDate.of(2026, 12, 11)
            ));
        } catch (IllegalStateException erro) {
            System.out.println("Duplicidade bloqueada: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("OS cadastradas:");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudDuplicidadeApp
```

---

## Como a duplicidade foi bloqueada

No método `cadastrar`, usamos:

```java
if (existe(os.codigo())) {
    throw new IllegalStateException("Já existe OS cadastrada com o código: " + os.codigo());
}
```

E o método `existe` usa a busca:

```java
return buscarPorCodigo(codigo) != null;
```

Isso mostra uma ideia importante:

```text
operações maiores podem reaproveitar operações menores.
```

---

## Busca inexistente

Crie:

```text
src\br\com\curso\aula149\app\CrudBuscaInexistenteApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudBuscaInexistenteApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        OrdemServico encontrada = cadastro.buscarPorCodigo("OS-2026-9999");

        if (encontrada == null) {
            System.out.println("OS não encontrada.");
        } else {
            System.out.println(encontrada.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudBuscaInexistenteApp
```

---

## Cuidado com null

Como `buscarPorCodigo` pode retornar `null`, você precisa tratar:

```java
if (encontrada == null) {
    ...
}
```

Se você fizer:

```java
System.out.println(encontrada.resumo());
```

sem verificar, pode causar:

```text
NullPointerException
```

Mais adiante vamos melhorar isso com `Optional`.

---

## Atualizando cliente

Crie:

```text
src\br\com\curso\aula149\app\CrudAtualizarClienteApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudAtualizarClienteApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        System.out.println("Antes:");
        imprimir(cadastro);

        cadastro.alterarCliente("OS-2026-0001", "Ana Silva Atualizada");

        System.out.println();
        System.out.println("Depois:");
        imprimir(cadastro);
    }

    private static void imprimir(CadastroOrdemServicoMemoria cadastro) {
        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudAtualizarClienteApp
```

---

## Atualizar não é substituir sempre

Neste exemplo, atualizar cliente chamou:

```java
os.alterarCliente(novoCliente);
```

Não substituímos o objeto inteiro na lista.

Apenas alteramos o objeto encontrado, usando um método da entidade.

Isso é importante.

A lista guarda a referência do objeto.

Quando alteramos o objeto encontrado, a alteração aparece na listagem.

---

## Reagendar OS

Crie:

```text
src\br\com\curso\aula149\app\CrudReagendarApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudReagendarApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.reagendar(
                "OS-2026-0001",
                LocalDate.of(2026, 12, 20)
        );

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudReagendarApp
```

---

## Regra dentro da entidade

O método do cadastro apenas encontra a OS:

```java
OrdemServico os = buscarObrigatoria(codigo);
```

Depois chama:

```java
os.reagendar(novaData);
```

A regra de reagendamento está na entidade.

Isso mantém o padrão que estudamos:

```text
entidade decide regra;
cadastro/repositório encontra e armazena;
app executa cenário.
```

---

## Concluir e cancelar

Crie:

```text
src\br\com\curso\aula149\app\CrudConcluirCancelarApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudConcluirCancelarApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        cadastro.concluir("OS-2026-0001");
        cadastro.cancelar("OS-2026-0002");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudConcluirCancelarApp
```

---

## Testando regra inválida

Crie:

```text
src\br\com\curso\aula149\app\CrudRegraInvalidaApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudRegraInvalidaApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cancelar("OS-2026-0001");

        try {
            cadastro.concluir("OS-2026-0001");
        } catch (IllegalStateException erro) {
            System.out.println("Regra bloqueada: " + erro.getMessage());
        }

        System.out.println();
        System.out.println("Estado final:");

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudRegraInvalidaApp
```

---

## O que esse teste mostra

A OS foi cancelada.

Depois tentamos concluir.

A entidade bloqueou:

```java
if (status == StatusOs.CANCELADA) {
    throw new IllegalStateException("OS cancelada não pode ser concluída.");
}
```

Isso reforça:

```text
a lista armazena;
a entidade protege regra.
```

Collections não substituem modelagem de domínio.

---

## Remoção inexistente

Crie:

```text
src\br\com\curso\aula149\app\CrudRemocaoInexistenteApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudRemocaoInexistenteApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        boolean removida = cadastro.remover("OS-2026-9999");

        System.out.println("Removeu? " + removida);
        System.out.println("Quantidade final: " + cadastro.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudRemocaoInexistenteApp
```

---

## Por que remover retorna boolean

O método:

```java
public boolean remover(String codigo)
```

retorna se conseguiu remover.

Isso permite o app decidir a mensagem:

```text
removido com sucesso;
não encontrado para remoção.
```

Métodos que retornam `boolean` são úteis quando a operação pode ou não acontecer sem ser necessariamente uma exceção.

---

## Relatório por status

Crie:

```text
src\br\com\curso\aula149\app\CrudRelatorioStatusApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.dominio.ordemservico.StatusOs;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;

public class CrudRelatorioStatusApp {
    public static void main(String[] args) {
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        cadastro.cadastrar(new OrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12)
        ));

        cadastro.concluir("OS-2026-0001");
        cadastro.cancelar("OS-2026-0002");

        System.out.println("Relatório:");
        System.out.println("Agendadas: " + cadastro.contarPorStatus(StatusOs.AGENDADA));
        System.out.println("Concluídas: " + cadastro.contarPorStatus(StatusOs.CONCLUIDA));
        System.out.println("Canceladas: " + cadastro.contarPorStatus(StatusOs.CANCELADA));
        System.out.println("Reagendadas: " + cadastro.contarPorStatus(StatusOs.REAGENDADA));
        System.out.println("Total: " + cadastro.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudRelatorioStatusApp
```

---

## Contagem usando List

O método de contagem percorre a lista:

```java
for (OrdemServico os : ordens) {
    if (os.possuiStatus(status)) {
        total++;
    }
}
```

Isso é muito comum antes de aprender `Stream`.

Mais adiante, você verá formas mais modernas.

Por enquanto, esse `for` é ótimo para entender a lógica.

---

## App com menu simples

Agora vamos criar um menu pequeno usando o cadastro.

Crie:

```text
src\br\com\curso\aula149\app\CrudMenuSimplesApp.java
```

Código:

```java
package br.com.curso.aula149.app;

import br.com.curso.aula149.dominio.ordemservico.OrdemServico;
import br.com.curso.aula149.dominio.ordemservico.StatusOs;
import br.com.curso.aula149.infra.CadastroOrdemServicoMemoria;

import java.time.LocalDate;
import java.util.Scanner;

public class CrudMenuSimplesApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        CadastroOrdemServicoMemoria cadastro = new CadastroOrdemServicoMemoria();

        boolean executando = true;

        while (executando) {
            exibirMenu();

            int opcao = lerInteiro(scanner, "Opção: ");

            try {
                switch (opcao) {
                    case 1:
                        cadastrar(scanner, cadastro);
                        break;
                    case 2:
                        listar(cadastro);
                        break;
                    case 3:
                        buscar(scanner, cadastro);
                        break;
                    case 4:
                        reagendar(scanner, cadastro);
                        break;
                    case 5:
                        remover(scanner, cadastro);
                        break;
                    case 6:
                        relatorio(cadastro);
                        break;
                    case 0:
                        executando = false;
                        System.out.println("Encerrando.");
                        break;
                    default:
                        System.out.println("Opção inválida.");
                        break;
                }
            } catch (RuntimeException erro) {
                System.out.println("Erro: " + erro.getMessage());
            }

            System.out.println();
        }

        scanner.close();
    }

    private static void exibirMenu() {
        System.out.println("==================================");
        System.out.println(" CRUD OS COM ARRAYLIST");
        System.out.println("==================================");
        System.out.println("1. Cadastrar OS");
        System.out.println("2. Listar OS");
        System.out.println("3. Buscar OS");
        System.out.println("4. Reagendar OS");
        System.out.println("5. Remover OS");
        System.out.println("6. Relatório");
        System.out.println("0. Sair");
        System.out.println("==================================");
    }

    private static void cadastrar(Scanner scanner, CadastroOrdemServicoMemoria cadastro) {
        String codigo = lerTexto(scanner, "Código: ");
        String cliente = lerTexto(scanner, "Cliente: ");
        LocalDate data = lerData(scanner, "Data atendimento (yyyy-MM-dd): ");

        cadastro.cadastrar(new OrdemServico(
                codigo,
                cliente,
                data
        ));

        System.out.println("OS cadastrada com sucesso.");
    }

    private static void listar(CadastroOrdemServicoMemoria cadastro) {
        if (cadastro.vazio()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        for (OrdemServico os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }
    }

    private static void buscar(Scanner scanner, CadastroOrdemServicoMemoria cadastro) {
        String codigo = lerTexto(scanner, "Código: ");
        OrdemServico os = cadastro.buscarPorCodigo(codigo);

        if (os == null) {
            System.out.println("OS não encontrada.");
            return;
        }

        System.out.println(os.resumo());
    }

    private static void reagendar(Scanner scanner, CadastroOrdemServicoMemoria cadastro) {
        String codigo = lerTexto(scanner, "Código: ");
        LocalDate novaData = lerData(scanner, "Nova data (yyyy-MM-dd): ");

        cadastro.reagendar(codigo, novaData);

        System.out.println("OS reagendada com sucesso.");
    }

    private static void remover(Scanner scanner, CadastroOrdemServicoMemoria cadastro) {
        String codigo = lerTexto(scanner, "Código: ");

        boolean removida = cadastro.remover(codigo);

        if (removida) {
            System.out.println("OS removida com sucesso.");
        } else {
            System.out.println("OS não encontrada para remoção.");
        }
    }

    private static void relatorio(CadastroOrdemServicoMemoria cadastro) {
        System.out.println("Agendadas: " + cadastro.contarPorStatus(StatusOs.AGENDADA));
        System.out.println("Reagendadas: " + cadastro.contarPorStatus(StatusOs.REAGENDADA));
        System.out.println("Concluídas: " + cadastro.contarPorStatus(StatusOs.CONCLUIDA));
        System.out.println("Canceladas: " + cadastro.contarPorStatus(StatusOs.CANCELADA));
        System.out.println("Total: " + cadastro.quantidade());
    }

    private static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            try {
                return Integer.parseInt(texto);
            } catch (NumberFormatException erro) {
                System.out.println("Informe um número inteiro válido.");
            }
        }
    }

    private static String lerTexto(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Texto obrigatório.");
        }
    }

    private static LocalDate lerData(Scanner scanner, String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();

            try {
                return LocalDate.parse(texto);
            } catch (RuntimeException erro) {
                System.out.println("Data inválida. Use yyyy-MM-dd.");
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula149.app.CrudMenuSimplesApp
```

---

## O que o menu demonstra

O menu mostra um CRUD básico em memória.

Ele usa:

```text
Cadastrar;
Listar;
Buscar;
Reagendar;
Remover;
Relatório.
```

Mesmo sendo simples, ele prepara para o pensamento de API.

Mais adiante:

```text
Cadastrar OS -> POST
Listar OS    -> GET
Buscar OS    -> GET por código/id
Reagendar OS -> PUT/PATCH
Remover OS   -> DELETE
```

---

## Cuidado: lista não é banco

`ArrayList` em memória perde os dados quando o programa encerra.

Se você rodar novamente, tudo começa vazio.

Isso é esperado.

Banco de dados resolve persistência permanente.

Aqui o objetivo é estudar manipulação em memória.

Use esta frase:

```text
ArrayList guarda enquanto o programa está rodando.
Banco guarda depois que o programa encerra.
```

---

## Cuidado: busca em ArrayList percorre item por item

Nos métodos de busca, usamos:

```java
for (OrdemServico os : ordens) {
    if (os.possuiCodigo(codigo)) {
        return os;
    }
}
```

Isso percorre a lista.

Para listas pequenas, tudo bem.

Para busca frequente por chave, `Map` pode ser melhor.

Mais adiante vamos estudar isso.

---

## Quando CRUD com ArrayList faz sentido

Faz sentido para:

```text
estudo;
prototipação;
testes;
repositório fake;
cenário pequeno;
simulação de banco;
exercícios de lógica.
```

Não é ideal para:

```text
grande volume de dados;
persistência real;
busca rápida por chave;
concorrência pesada;
sistema em produção.
```

Mas como base de aprendizado, é excelente.

---

## Ligação com arquitetura

Mesmo sendo simples, mantivemos separação:

```text
domínio:
OrdemServico e StatusOs.

infra:
CadastroOrdemServicoMemoria.

app:
classes com main.
```

A entidade não salva no banco.

A entidade não lê `Scanner`.

A entidade não conhece `ArrayList` do cadastro.

Ela só protege suas regras.

Isso mantém o padrão de excelência do curso.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar domínio e cadastro

Crie:

```text
StatusOs
OrdemServico
CadastroOrdemServicoMemoria
```

Compile.

### Parte 2 — Rodar CRUD completo

Execute:

```powershell
java -cp out br.com.curso.aula149.app.CrudArrayListApp
```

Observe:

```text
CREATE;
READ;
UPDATE;
DELETE.
```

### Parte 3 — Rodar validações

Execute:

```powershell
java -cp out br.com.curso.aula149.app.CrudDuplicidadeApp
java -cp out br.com.curso.aula149.app.CrudBuscaInexistenteApp
java -cp out br.com.curso.aula149.app.CrudRegraInvalidaApp
java -cp out br.com.curso.aula149.app.CrudRemocaoInexistenteApp
```

### Parte 4 — Rodar operações específicas

Execute:

```powershell
java -cp out br.com.curso.aula149.app.CrudAtualizarClienteApp
java -cp out br.com.curso.aula149.app.CrudReagendarApp
java -cp out br.com.curso.aula149.app.CrudConcluirCancelarApp
java -cp out br.com.curso.aula149.app.CrudRelatorioStatusApp
```

### Parte 5 — Rodar menu

Execute:

```powershell
java -cp out br.com.curso.aula149.app.CrudMenuSimplesApp
```

Teste:

```text
cadastrar;
listar;
buscar;
reagendar;
remover;
relatório.
```

---

## Desafio prático

Adicione ao menu simples as opções:

```text
7. Concluir OS
8. Cancelar OS
```

Regras:

```text
deve pedir o código;
deve chamar cadastro.concluir(codigo);
deve chamar cadastro.cancelar(codigo);
deve mostrar mensagem de sucesso;
deve tratar erro se a OS não existir;
deve tratar erro se a regra de domínio bloquear.
```

Critério principal:

```text
a regra de concluir/cancelar continua na entidade OrdemServico.
```

---

## Desafio extra

Crie uma nova operação no cadastro:

```java
public List<OrdemServico> listarPorStatus(StatusOs status)
```

Regras:

```text
deve criar uma nova List<OrdemServico>;
deve percorrer ordens;
deve adicionar na nova lista apenas as OS com o status informado;
deve retornar List.copyOf(resultado);
não deve retornar a lista interna original.
```

Depois crie um app:

```text
src\br\com\curso\aula149\app\CrudListarPorStatusApp.java
```

Ele deve:

```text
cadastrar várias OS;
concluir uma;
cancelar outra;
listar apenas AGENDADA;
listar apenas CONCLUIDA;
listar apenas CANCELADA.
```

Critério principal:

```text
filtrar com List sem usar Stream ainda.
```

---

## Erros comuns nesta aula

### 1. Deixar tudo no main

O cadastro deve ficar em uma classe própria.

### 2. Retornar a lista interna diretamente

Evite:

```java
return ordens;
```

Prefira:

```java
return List.copyOf(ordens);
```

### 3. Não validar duplicidade

Cadastro por código normalmente precisa ser único.

### 4. Não tratar busca inexistente

Se a busca retorna `null`, trate antes de usar.

### 5. Colocar regra no cadastro em vez da entidade

O cadastro encontra a OS.

A OS decide se pode reagendar, concluir ou cancelar.

### 6. Usar status como String

Use enum.

### 7. Esquecer que dados somem ao encerrar

ArrayList em memória não persiste dados.

### 8. Usar ArrayList onde Map seria melhor

Para esta aula, tudo bem.

Mas para busca por chave frequente, `Map` pode ser mais adequado.

---

## Debug recomendado

Use debug em:

```text
CadastroOrdemServicoMemoria.java
CrudArrayListApp.java
CrudDuplicidadeApp.java
CrudMenuSimplesApp.java
OrdemServico.java
```

Breakpoints recomendados:

```java
cadastrar(...)
existe(...)
buscarPorCodigo(...)
ordens.add(...)
listar(...)
alterarCliente(...)
reagendar(...)
concluir(...)
cancelar(...)
remover(...)
ordens.remove(...)
contarPorStatus(...)
```

Observe:

```text
quando a lista cresce;
quando a busca encontra;
quando a busca retorna null;
quando a duplicidade bloqueia;
quando a entidade muda status;
quando a remoção retorna true ou false;
quando o relatório percorre a lista.
```

O objetivo é enxergar CRUD acontecendo em memória.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa CRUD?
2. Qual método do cadastro representa cada operação CRUD?
3. Por que listar retorna List.copyOf?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar CRUD;
criar cadastro em memória com ArrayList;
cadastrar objeto;
listar objetos;
buscar por código;
alterar objeto encontrado;
remover objeto;
validar duplicidade;
tratar busca inexistente;
contar por status;
criar menu simples;
entender que ArrayList não persiste após encerrar;
explicar por que regra fica na entidade;
resolver o desafio de concluir/cancelar no menu;
resolver o desafio listarPorStatus;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-149-arraylist-operacoes-crud
git commit -m "Aula 149: operacoes CRUD com ArrayList"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
ArrayList permite montar um cadastro em memória com operações de criação, consulta, atualização e remoção.
```

Você viu que `List` é útil para guardar vários objetos, mas a lógica de busca, atualização e remoção precisa ser bem organizada.

Na próxima aula, vamos aprofundar iteração em listas.

Vamos estudar `for`, `foreach`, `Iterator` e entender quando cada forma faz sentido.
