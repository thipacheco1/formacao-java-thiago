# 182 — M6.11 — Mini-projeto: Generics, Optional, Repository e Resultado<T>

## Objetivo da aula

Nesta aula você vai construir um mini-projeto integrador do Módulo 6.

Vamos juntar os principais assuntos estudados até agora:

```text
Generics;
classes genéricas;
interfaces genéricas;
bounded types;
Optional<T>;
Repository em memória;
Resultado<T>;
Map;
List.copyOf;
objetos de valor;
regras de domínio;
separação de responsabilidades.
```

O objetivo é sair de exemplos isolados e montar um fluxo mais próximo de backend real.

Ao final desta aula, você deve conseguir:

```text
criar contratos genéricos com propósito;
criar entidade identificável;
criar repository genérico em memória;
usar Optional em busca;
usar Resultado<T> para retorno de operação;
usar bounded type para obter ID da entidade;
evitar raw types;
evitar Object;
evitar cast;
separar domínio, infraestrutura e aplicação;
entender onde Generics ajudam;
entender onde tipo concreto é melhor;
montar um fluxo de cadastro, busca, ativação, cancelamento e relatório.
```

---

## Visão geral do mini-projeto

Vamos criar um pequeno sistema em memória para gerenciar:

```text
Clientes;
Ordens de Serviço;
consultas por identificador;
operações com resultado padronizado;
buscas opcionais;
regras de status.
```

O projeto terá:

```text
objetos de valor;
entidades;
contratos genéricos;
repositório genérico em memória;
serviços específicos;
apps de execução;
cenários de sucesso e erro.
```

A ideia é usar Generics com critério.

Nem tudo será genérico.

Algumas partes serão específicas porque representam regra de negócio.

---

## Arquitetura da aula

A estrutura será:

```text
contrato:
interfaces genéricas e contratos pequenos.

dominio:
objetos de valor e entidades.

infra:
repositório em memória e serviços.

util:
Resultado<T> e utilitários.

app:
cenários executáveis.
```

Separação importante:

```text
Entidade protege regra.
Service coordena fluxo.
Repository salva e busca.
App executa cenário.
Resultado<T> padroniza retorno.
Optional<T> representa busca que pode não encontrar.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-182-mini-projeto-generics-optional-repository-resultado
cd labs\m6\aula-182-mini-projeto-generics-optional-repository-resultado
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula182
mkdir src\br\com\curso\aula182\app
mkdir src\br\com\curso\aula182\contrato
mkdir src\br\com\curso\aula182\dominio
mkdir src\br\com\curso\aula182\dominio\valor
mkdir src\br\com\curso\aula182\dominio\cliente
mkdir src\br\com\curso\aula182\dominio\ordemservico
mkdir src\br\com\curso\aula182\infra
mkdir src\br\com\curso\aula182\util
```

---

## Contrato Identificavel<ID>

Crie:

```text
src\br\com\curso\aula182\contrato\Identificavel.java
```

Código:

```java
package br.com.curso.aula182.contrato;

public interface Identificavel<ID> {
    ID id();
}
```

---

## Por que Identificavel<ID> existe

Esse contrato diz:

```text
qualquer entidade que implemente Identificavel<ID> possui um identificador.
```

Exemplos:

```text
Cliente -> Email;
OrdemServico -> CodigoOs;
Produto -> Sku;
Usuario -> Long.
```

Com isso, o repositório genérico poderá chamar:

```java
item.id()
```

sem usar `Object`, sem cast e sem reflexão.

---

## Contrato Resumivel

Crie:

```text
src\br\com\curso\aula182\contrato\Resumivel.java
```

Código:

```java
package br.com.curso.aula182.contrato;

public interface Resumivel {
    String resumo();
}
```

---

## Por que Resumivel existe

Esse contrato será usado para relatórios simples.

Ele representa a ideia:

```text
este objeto sabe gerar um resumo textual dele mesmo.
```

Não é uma regra universal para todo sistema.

É um contrato didático e útil para este mini-projeto.

---

## Resultado<T>

Crie:

```text
src\br\com\curso\aula182\util\Resultado.java
```

Código:

```java
package br.com.curso.aula182.util;

public class Resultado<T> {
    private final boolean sucesso;
    private final String mensagem;
    private final T valor;

    private Resultado(boolean sucesso, String mensagem, T valor) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.sucesso = sucesso;
        this.mensagem = mensagem.trim();
        this.valor = valor;
    }

    public static <T> Resultado<T> sucesso(String mensagem, T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor de sucesso é obrigatório.");
        }

        return new Resultado<>(true, mensagem, valor);
    }

    public static <T> Resultado<T> falha(String mensagem) {
        return new Resultado<>(false, mensagem, null);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public boolean falha() {
        return !sucesso;
    }

    public String mensagem() {
        return mensagem;
    }

    public T valor() {
        if (falha()) {
            throw new IllegalStateException("Resultado de falha não possui valor.");
        }

        return valor;
    }

    public String resumo() {
        return (sucesso ? "SUCESSO" : "FALHA") + " | " + mensagem;
    }
}
```

---

## Por que Resultado<T> é genérico

A estrutura do resultado é sempre parecida:

```text
sucesso;
mensagem;
valor.
```

Mas o tipo do valor muda:

```text
Cliente;
OrdemServico;
String;
Integer;
Relatorio.
```

Então `Resultado<T>` é uma boa abstração.

Ela é pequena, clara e reutilizável.

---

## Objeto de valor Email

Crie:

```text
src\br\com\curso\aula182\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula182.dominio.valor;

import java.util.Objects;

public final class Email implements Comparable<Email> {
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
    public int compareTo(Email outro) {
        return this.valor.compareTo(outro.valor);
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

---

## Objeto de valor CodigoOs

Crie:

```text
src\br\com\curso\aula182\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula182.dominio.valor;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs> {
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
    public int compareTo(CodigoOs outro) {
        return this.valor.compareTo(outro.valor);
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

## Entidade Cliente

Crie:

```text
src\br\com\curso\aula182\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula182.dominio.cliente;

import br.com.curso.aula182.contrato.Identificavel;
import br.com.curso.aula182.contrato.Resumivel;
import br.com.curso.aula182.dominio.valor.Email;

public class Cliente implements Identificavel<Email>, Resumivel {
    private final Email email;
    private final String nome;
    private boolean ativo;

    public Cliente(Email email, String nome) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.email = email;
        this.nome = nome.trim();
        this.ativo = true;
    }

    @Override
    public Email id() {
        return email;
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

    public void ativar() {
        if (ativo) {
            throw new IllegalStateException("Cliente já está ativo.");
        }

        ativo = true;
    }

    public void inativar() {
        if (!ativo) {
            throw new IllegalStateException("Cliente já está inativo.");
        }

        ativo = false;
    }

    @Override
    public String resumo() {
        return nome + " | " + email.resumo() + " | Ativo: " + ativo;
    }
}
```

---

## Entidade OrdemServico

Crie:

```text
src\br\com\curso\aula182\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula182.dominio.ordemservico;

public enum StatusOs {
    ABERTA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula182\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula182.dominio.ordemservico;

import br.com.curso.aula182.contrato.Identificavel;
import br.com.curso.aula182.contrato.Resumivel;
import br.com.curso.aula182.dominio.valor.CodigoOs;
import br.com.curso.aula182.dominio.valor.Email;

public class OrdemServico implements Identificavel<CodigoOs>, Resumivel {
    private final CodigoOs codigo;
    private final Email emailCliente;
    private final String descricao;
    private StatusOs status;

    public OrdemServico(CodigoOs codigo, Email emailCliente, String descricao) {
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
        this.status = StatusOs.ABERTA;
    }

    @Override
    public CodigoOs id() {
        return codigo;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public Email emailCliente() {
        return emailCliente;
    }

    public String descricao() {
        return descricao;
    }

    public StatusOs status() {
        return status;
    }

    public boolean aberta() {
        return status == StatusOs.ABERTA;
    }

    public boolean emAtendimento() {
        return status == StatusOs.EM_ATENDIMENTO;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    public void iniciarAtendimento() {
        if (!aberta()) {
            throw new IllegalStateException("Somente OS aberta pode iniciar atendimento.");
        }

        status = StatusOs.EM_ATENDIMENTO;
    }

    public void concluir() {
        if (!emAtendimento()) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public void cancelar(String motivo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser cancelada.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo de cancelamento é obrigatório.");
        }

        status = StatusOs.CANCELADA;
    }

    @Override
    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + emailCliente.resumo()
                + " | Descrição: " + descricao
                + " | Status: " + status;
    }
}
```

---

## Repositório genérico

Crie:

```text
src\br\com\curso\aula182\contrato\Repositorio.java
```

Código:

```java
package br.com.curso.aula182.contrato;

import java.util.List;
import java.util.Optional;

public interface Repositorio<ID, T extends Identificavel<ID>> {
    void salvar(T item);

    Optional<T> buscarPorId(ID id);

    T buscarObrigatorio(ID id);

    boolean existe(ID id);

    List<T> listar();

    int quantidade();
}
```

---

## Como ler Repositorio<ID, T extends Identificavel<ID>>

```java
Repositorio<ID, T extends Identificavel<ID>>
```

Significa:

```text
ID é o tipo do identificador;
T é o tipo da entidade;
T precisa possuir um ID do tipo ID.
```

Isso permite:

```java
salvar(T item)
```

sem receber o ID manualmente, porque o item sabe informar:

```java
item.id()
```

---

## Implementação em memória

Crie:

```text
src\br\com\curso\aula182\infra\RepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula182.infra;

import br.com.curso.aula182.contrato.Identificavel;
import br.com.curso.aula182.contrato.Repositorio;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class RepositorioMemoria<ID, T extends Identificavel<ID>> implements Repositorio<ID, T> {
    private final Map<ID, T> itensPorId;

    public RepositorioMemoria() {
        this.itensPorId = new LinkedHashMap<>();
    }

    @Override
    public void salvar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        ID id = item.id();

        if (id == null) {
            throw new IllegalArgumentException("ID do item é obrigatório.");
        }

        if (itensPorId.containsKey(id)) {
            throw new IllegalStateException("Item já cadastrado com ID: " + id);
        }

        itensPorId.put(id, item);
    }

    @Override
    public Optional<T> buscarPorId(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        return Optional.ofNullable(itensPorId.get(id));
    }

    @Override
    public T buscarObrigatorio(ID id) {
        return buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado para ID: " + id));
    }

    @Override
    public boolean existe(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        return itensPorId.containsKey(id);
    }

    @Override
    public List<T> listar() {
        return List.copyOf(itensPorId.values());
    }

    @Override
    public int quantidade() {
        return itensPorId.size();
    }
}
```

---

## O que esse repositório usa

Esse repositório usa:

```text
Generics:
ID e T.

Bounded type:
T extends Identificavel<ID>.

Optional:
buscarPorId.

Map:
armazenamento por ID.

List.copyOf:
retorno protegido.
```

Esse é um bom exemplo de Generics com propósito real.

---

## Serviço de Cliente

Crie:

```text
src\br\com\curso\aula182\infra\ServicoCliente.java
```

Código:

```java
package br.com.curso.aula182.infra;

import br.com.curso.aula182.contrato.Repositorio;
import br.com.curso.aula182.dominio.cliente.Cliente;
import br.com.curso.aula182.dominio.valor.Email;
import br.com.curso.aula182.util.Resultado;

import java.util.Optional;

public class ServicoCliente {
    private final Repositorio<Email, Cliente> clientes;

    public ServicoCliente(Repositorio<Email, Cliente> clientes) {
        if (clientes == null) {
            throw new IllegalArgumentException("Repositório de clientes é obrigatório.");
        }

        this.clientes = clientes;
    }

    public Resultado<Cliente> cadastrar(Email email, String nome) {
        if (clientes.existe(email)) {
            return Resultado.falha("Cliente já cadastrado: " + email.resumo());
        }

        Cliente cliente = new Cliente(email, nome);
        clientes.salvar(cliente);

        return Resultado.sucesso("Cliente cadastrado com sucesso.", cliente);
    }

    public Optional<Cliente> buscarPorEmail(Email email) {
        return clientes.buscarPorId(email);
    }

    public Resultado<Cliente> inativar(Email email) {
        Optional<Cliente> clienteEncontrado = clientes.buscarPorId(email);

        if (clienteEncontrado.isEmpty()) {
            return Resultado.falha("Cliente não encontrado: " + email.resumo());
        }

        Cliente cliente = clienteEncontrado.get();

        try {
            cliente.inativar();
            return Resultado.sucesso("Cliente inativado com sucesso.", cliente);
        } catch (IllegalStateException erro) {
            return Resultado.falha(erro.getMessage());
        }
    }

    public Resultado<String> resumoAtivo(Email email) {
        return clientes.buscarPorId(email)
                .filter(Cliente::ativo)
                .map(cliente -> Resultado.sucesso("Cliente ativo encontrado.", cliente.resumo()))
                .orElseGet(() -> Resultado.falha("Cliente ativo não encontrado: " + email.resumo()));
    }
}
```

---

## Observação sobre get neste serviço

Usamos:

```java
Cliente cliente = clienteEncontrado.get();
```

após verificar:

```java
if (clienteEncontrado.isEmpty()) {
    return Resultado.falha(...);
}
```

Isso é aceitável, porque houve checagem explícita.

Mesmo assim, em muitos cenários podemos preferir `map`, `orElseThrow` ou refatorar o fluxo.

O importante é:

```text
não usar get direto sem checar.
```

---

## Serviço de Ordem de Serviço

Crie:

```text
src\br\com\curso\aula182\infra\ServicoOrdemServico.java
```

Código:

```java
package br.com.curso.aula182.infra;

import br.com.curso.aula182.contrato.Repositorio;
import br.com.curso.aula182.dominio.cliente.Cliente;
import br.com.curso.aula182.dominio.ordemservico.OrdemServico;
import br.com.curso.aula182.dominio.valor.CodigoOs;
import br.com.curso.aula182.dominio.valor.Email;
import br.com.curso.aula182.util.Resultado;

public class ServicoOrdemServico {
    private final Repositorio<CodigoOs, OrdemServico> ordens;
    private final Repositorio<Email, Cliente> clientes;

    public ServicoOrdemServico(
            Repositorio<CodigoOs, OrdemServico> ordens,
            Repositorio<Email, Cliente> clientes
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

    public Resultado<OrdemServico> abrir(CodigoOs codigo, Email emailCliente, String descricao) {
        if (ordens.existe(codigo)) {
            return Resultado.falha("OS já cadastrada: " + codigo.resumo());
        }

        Cliente cliente = clientes.buscarPorId(emailCliente)
                .filter(Cliente::ativo)
                .orElse(null);

        if (cliente == null) {
            return Resultado.falha("Cliente ativo não encontrado: " + emailCliente.resumo());
        }

        OrdemServico os = new OrdemServico(codigo, cliente.email(), descricao);
        ordens.salvar(os);

        return Resultado.sucesso("OS aberta com sucesso.", os);
    }

    public Resultado<OrdemServico> iniciarAtendimento(CodigoOs codigo) {
        return ordens.buscarPorId(codigo)
                .map(os -> executarComResultado("Atendimento iniciado com sucesso.", os, OrdemServico::iniciarAtendimento))
                .orElseGet(() -> Resultado.falha("OS não encontrada: " + codigo.resumo()));
    }

    public Resultado<OrdemServico> concluir(CodigoOs codigo) {
        return ordens.buscarPorId(codigo)
                .map(os -> executarComResultado("OS concluída com sucesso.", os, OrdemServico::concluir))
                .orElseGet(() -> Resultado.falha("OS não encontrada: " + codigo.resumo()));
    }

    public Resultado<OrdemServico> cancelar(CodigoOs codigo, String motivo) {
        return ordens.buscarPorId(codigo)
                .map(os -> {
                    try {
                        os.cancelar(motivo);
                        return Resultado.sucesso("OS cancelada com sucesso.", os);
                    } catch (IllegalArgumentException | IllegalStateException erro) {
                        return Resultado.<OrdemServico>falha(erro.getMessage());
                    }
                })
                .orElseGet(() -> Resultado.falha("OS não encontrada: " + codigo.resumo()));
    }

    public Resultado<String> resumoClienteDaOs(CodigoOs codigo) {
        return ordens.buscarPorId(codigo)
                .flatMap(os -> clientes.buscarPorId(os.emailCliente()))
                .filter(Cliente::ativo)
                .map(cliente -> Resultado.sucesso("Cliente ativo da OS encontrado.", cliente.resumo()))
                .orElseGet(() -> Resultado.falha("Cliente ativo da OS não encontrado."));
    }

    private Resultado<OrdemServico> executarComResultado(
            String mensagemSucesso,
            OrdemServico os,
            AcaoOrdemServico acao
    ) {
        try {
            acao.executar(os);
            return Resultado.sucesso(mensagemSucesso, os);
        } catch (IllegalArgumentException | IllegalStateException erro) {
            return Resultado.falha(erro.getMessage());
        }
    }

    private interface AcaoOrdemServico {
        void executar(OrdemServico os);
    }
}
```

---

## Análise do ServiçoOrdemServico

Este serviço é específico.

Ele não é genérico porque possui regra de OS:

```text
abrir;
iniciar atendimento;
concluir;
cancelar;
buscar cliente da OS.
```

Essa é uma decisão importante.

O repositório é genérico porque o comportamento é técnico e comum.

O serviço é específico porque a regra é de negócio.

Isso é boa arquitetura.

---

## App principal do mini-projeto

Crie:

```text
src\br\com\curso\aula182\app\MiniProjetoGenericsOptionalApp.java
```

Código:

```java
package br.com.curso.aula182.app;

import br.com.curso.aula182.contrato.Repositorio;
import br.com.curso.aula182.dominio.cliente.Cliente;
import br.com.curso.aula182.dominio.ordemservico.OrdemServico;
import br.com.curso.aula182.dominio.valor.CodigoOs;
import br.com.curso.aula182.dominio.valor.Email;
import br.com.curso.aula182.infra.RepositorioMemoria;
import br.com.curso.aula182.infra.ServicoCliente;
import br.com.curso.aula182.infra.ServicoOrdemServico;
import br.com.curso.aula182.util.Resultado;

public class MiniProjetoGenericsOptionalApp {
    public static void main(String[] args) {
        Repositorio<Email, Cliente> repositorioClientes = new RepositorioMemoria<>();
        Repositorio<CodigoOs, OrdemServico> repositorioOrdens = new RepositorioMemoria<>();

        ServicoCliente servicoCliente = new ServicoCliente(repositorioClientes);
        ServicoOrdemServico servicoOs = new ServicoOrdemServico(repositorioOrdens, repositorioClientes);

        Resultado<Cliente> cliente = servicoCliente.cadastrar(
                new Email("ana@empresa.com"),
                "Ana Silva"
        );

        imprimir(cliente);

        Resultado<OrdemServico> abertura = servicoOs.abrir(
                new CodigoOs("OS-2026-0001"),
                new Email("ana@empresa.com"),
                "Instalação de equipamento"
        );

        imprimir(abertura);

        Resultado<OrdemServico> atendimento = servicoOs.iniciarAtendimento(
                new CodigoOs("OS-2026-0001")
        );

        imprimir(atendimento);

        Resultado<String> resumoCliente = servicoOs.resumoClienteDaOs(
                new CodigoOs("OS-2026-0001")
        );

        imprimir(resumoCliente);

        Resultado<OrdemServico> conclusao = servicoOs.concluir(
                new CodigoOs("OS-2026-0001")
        );

        imprimir(conclusao);
    }

    private static <T> void imprimir(Resultado<T> resultado) {
        System.out.println(resultado.resumo());

        if (resultado.sucesso()) {
            System.out.println("Valor: " + resultado.valor());
        }

        System.out.println();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula182.app.MiniProjetoGenericsOptionalApp
```

---

## Observação sobre impressão do valor

Neste app, imprimimos:

```java
resultado.valor()
```

Para objetos que não sobrescrevem `toString`, a saída pode mostrar algo como:

```text
br.com.curso...
```

Se quiser melhorar, você pode sobrescrever `toString` nas entidades chamando `resumo()`.

Mas o foco da aula é o fluxo com Generics e Optional.

---

## App com cenários de erro

Crie:

```text
src\br\com\curso\aula182\app\MiniProjetoCenariosErroApp.java
```

Código:

```java
package br.com.curso.aula182.app;

import br.com.curso.aula182.contrato.Repositorio;
import br.com.curso.aula182.dominio.cliente.Cliente;
import br.com.curso.aula182.dominio.ordemservico.OrdemServico;
import br.com.curso.aula182.dominio.valor.CodigoOs;
import br.com.curso.aula182.dominio.valor.Email;
import br.com.curso.aula182.infra.RepositorioMemoria;
import br.com.curso.aula182.infra.ServicoCliente;
import br.com.curso.aula182.infra.ServicoOrdemServico;
import br.com.curso.aula182.util.Resultado;

public class MiniProjetoCenariosErroApp {
    public static void main(String[] args) {
        Repositorio<Email, Cliente> repositorioClientes = new RepositorioMemoria<>();
        Repositorio<CodigoOs, OrdemServico> repositorioOrdens = new RepositorioMemoria<>();

        ServicoCliente servicoCliente = new ServicoCliente(repositorioClientes);
        ServicoOrdemServico servicoOs = new ServicoOrdemServico(repositorioOrdens, repositorioClientes);

        imprimir(servicoOs.abrir(
                new CodigoOs("OS-2026-0001"),
                new Email("cliente-inexistente@empresa.com"),
                "Instalação"
        ));

        imprimir(servicoCliente.cadastrar(
                new Email("ana@empresa.com"),
                "Ana Silva"
        ));

        imprimir(servicoCliente.cadastrar(
                new Email("ana@empresa.com"),
                "Ana Silva Duplicada"
        ));

        imprimir(servicoCliente.inativar(new Email("ana@empresa.com")));

        imprimir(servicoOs.abrir(
                new CodigoOs("OS-2026-0002"),
                new Email("ana@empresa.com"),
                "Reparo"
        ));

        imprimir(servicoOs.iniciarAtendimento(new CodigoOs("OS-2026-9999")));
    }

    private static <T> void imprimir(Resultado<T> resultado) {
        System.out.println(resultado.resumo());

        if (resultado.sucesso()) {
            System.out.println("Valor: " + resultado.valor());
        }

        System.out.println();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula182.app.MiniProjetoCenariosErroApp
```

---

## O que esse app valida

Ele valida:

```text
não abre OS para cliente inexistente;
não cadastra cliente duplicado;
inativa cliente;
não abre OS para cliente inativo;
não inicia atendimento de OS inexistente.
```

Esses fluxos usam:

```text
Resultado<T>;
Optional<T>;
Repository genérico;
serviço específico.
```

---

## Relatório genérico de Resumivel

Crie:

```text
src\br\com\curso\aula182\util\RelatorioResumivel.java
```

Código:

```java
package br.com.curso.aula182.util;

import br.com.curso.aula182.contrato.Resumivel;

import java.util.List;

public final class RelatorioResumivel {
    private RelatorioResumivel() {
    }

    public static void imprimir(String titulo, List<? extends Resumivel> itens) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        System.out.println(titulo + ":");
        System.out.println("Quantidade: " + itens.size());

        for (Resumivel item : itens) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            System.out.println("- " + item.resumo());
        }
    }
}
```

Crie:

```text
src\br\com\curso\aula182\app\MiniProjetoRelatorioApp.java
```

Código:

```java
package br.com.curso.aula182.app;

import br.com.curso.aula182.contrato.Repositorio;
import br.com.curso.aula182.dominio.cliente.Cliente;
import br.com.curso.aula182.dominio.ordemservico.OrdemServico;
import br.com.curso.aula182.dominio.valor.CodigoOs;
import br.com.curso.aula182.dominio.valor.Email;
import br.com.curso.aula182.infra.RepositorioMemoria;
import br.com.curso.aula182.util.RelatorioResumivel;

public class MiniProjetoRelatorioApp {
    public static void main(String[] args) {
        Repositorio<Email, Cliente> clientes = new RepositorioMemoria<>();
        Repositorio<CodigoOs, OrdemServico> ordens = new RepositorioMemoria<>();

        clientes.salvar(new Cliente(new Email("ana@empresa.com"), "Ana Silva"));
        clientes.salvar(new Cliente(new Email("carlos@empresa.com"), "Carlos Souza"));

        ordens.salvar(new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                new Email("ana@empresa.com"),
                "Instalação"
        ));

        ordens.salvar(new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                new Email("carlos@empresa.com"),
                "Reparo"
        ));

        RelatorioResumivel.imprimir("Clientes", clientes.listar());

        System.out.println();

        RelatorioResumivel.imprimir("Ordens de Serviço", ordens.listar());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula182.app.MiniProjetoRelatorioApp
```

---

## Por que RelatorioResumivel usa wildcard

O método recebe:

```java
List<? extends Resumivel>
```

Porque ele só lê os itens.

A lista é produtora.

Pela regra PECS:

```text
Producer Extends
```

Isso permite receber:

```text
List<Cliente>;
List<OrdemServico>;
List<qualquer subtipo de Resumivel>.
```

---

## Revisão técnica do mini-projeto

### Onde usamos Generics

```text
Identificavel<ID>;
Repositorio<ID, T>;
RepositorioMemoria<ID, T>;
Resultado<T>;
método imprimir(Resultado<T>);
RelatorioResumivel com wildcard.
```

### Onde usamos Optional

```text
Repositorio.buscarPorId;
ServicoCliente.buscarPorEmail;
ServicoOrdemServico com flatMap;
buscarObrigatorio com orElseThrow.
```

### Onde usamos tipo concreto

```text
ServicoCliente;
ServicoOrdemServico;
Cliente;
OrdemServico.
```

### Por que nem tudo é genérico

Porque regra de negócio específica deve continuar explícita.

Exemplo:

```text
concluir OS;
cancelar OS;
inativar cliente;
abrir OS apenas para cliente ativo.
```

Essas regras não deveriam sumir dentro de um `ServicoGenerico<T>`.

---

## O ponto arquitetural mais importante

Neste mini-projeto, a separação é intencional:

```text
Entidade:
protege regra.

Repository:
salva e busca.

Service:
coordena fluxo.

Resultado<T>:
padroniza retorno.

Optional<T>:
representa ausência de busca.

App:
executa cenário.
```

A frase continua:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Aqui ainda não temos controller, banco ou client externo.

Mas a base está sendo construída.

---

## Melhorias possíveis

Este mini-projeto ainda pode evoluir.

Melhorias futuras:

```text
exceções específicas;
testes unitários;
interface de use case;
DTOs;
mappers;
validações de entrada;
persistência real;
JPA;
API REST;
transações;
logs;
observabilidade.
```

Mas não antecipe tudo agora.

Cada etapa tem seu momento.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Contratos e utilitários

Crie:

```text
Identificavel;
Resumivel;
Resultado.
```

Confirme:

```text
Resultado<T> não usa Object;
Resultado<T> não exige cast.
```

### Parte 2 — Domínio

Crie:

```text
Email;
CodigoOs;
Cliente;
StatusOs;
OrdemServico.
```

Confirme:

```text
Cliente implementa Identificavel<Email>;
OrdemServico implementa Identificavel<CodigoOs>;
ambos implementam Resumivel.
```

### Parte 3 — Repositório

Crie:

```text
Repositorio;
RepositorioMemoria.
```

Confirme:

```text
buscarPorId retorna Optional<T>;
buscarObrigatorio usa orElseThrow;
listar retorna List.copyOf.
```

### Parte 4 — Serviços

Crie:

```text
ServicoCliente;
ServicoOrdemServico.
```

Confirme:

```text
serviços são específicos;
não viraram ServiceGenerico;
regras de negócio estão explícitas.
```

### Parte 5 — Apps

Execute:

```powershell
java -cp out br.com.curso.aula182.app.MiniProjetoGenericsOptionalApp
java -cp out br.com.curso.aula182.app.MiniProjetoCenariosErroApp
java -cp out br.com.curso.aula182.app.MiniProjetoRelatorioApp
```

---

## Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula182\dominio\tecnico\Tecnico.java
```

Campos:

```text
String documento;
String nome;
boolean ativo;
```

Ela deve implementar:

```java
Identificavel<String>
Resumivel
```

Crie:

```text
Repositorio<String, Tecnico>
```

Depois crie:

```text
src\br\com\curso\aula182\infra\ServicoTecnico.java
```

Métodos:

```text
cadastrar(String documento, String nome);
inativar(String documento);
buscarAtivo(String documento);
```

Retornos:

```text
Resultado<Tecnico>;
Optional<Tecnico>;
```

Crie app:

```text
src\br\com\curso\aula182\app\MiniProjetoTecnicoApp.java
```

Critério principal:

```text
usar o mesmo RepositorioMemoria<ID, T> sem duplicar repositório.
```

---

## Desafio extra

Evolua `OrdemServico` para ter:

```text
documentoTecnicoResponsavel;
```

Depois crie no `ServicoOrdemServico` um método:

```text
Resultado<String> resumoTecnicoDaOs(CodigoOs codigo)
```

Fluxo:

```text
buscar OS;
flatMap buscar técnico;
filter técnico ativo;
map resumo;
orElse falha.
```

Critério principal:

```text
usar Optional.flatMap para encadear busca de OS e técnico.
```

---

## Erros comuns nesta aula

### 1. Fazer tudo genérico

Nem tudo deve ser genérico.

Serviço de OS deve ter regra de OS.

### 2. Fazer tudo específico

O repositório em memória pode ser genérico porque o comportamento técnico é comum.

### 3. Retornar null em busca

Use Optional.

### 4. Usar Optional.get sem critério

Use map, flatMap, orElseThrow, orElseGet ou cheque antes.

### 5. Usar Resultado<T> para esconder exceção de programação

Resultado é para retorno de operação esperada.

Erro de argumento inválido ainda pode lançar exceção.

### 6. Deixar entidade anêmica

Entidade deve proteger regra de status.

### 7. Colocar regra de abrir OS no repositório

Repository salva e busca.

Regra fica no serviço ou no domínio.

### 8. Usar Object ou cast

Não precisa.

Generics resolvem o tipo.

### 9. Retornar lista mutável interna

Use List.copyOf.

### 10. Ignorar duplicidade

Repository deve bloquear ID duplicado.

---

## Debug recomendado

Use debug em:

```text
Resultado.java
Email.java
CodigoOs.java
Cliente.java
OrdemServico.java
RepositorioMemoria.java
ServicoCliente.java
ServicoOrdemServico.java
RelatorioResumivel.java
```

Breakpoints recomendados:

```java
Resultado.sucesso(...)

Resultado.falha(...)

item.id()

itensPorId.put(...)

Optional.ofNullable(...)

buscarPorId(...)

orElseThrow(...)

filter(Cliente::ativo)

flatMap(...)

ordemServico.iniciarAtendimento()

ordemServico.concluir()

ordemServico.cancelar(...)
```

Observe:

```text
como o ID é obtido da entidade;
como o Optional representa busca ausente;
como Resultado<T> padroniza sucesso e falha;
como o service coordena;
como a entidade protege regra;
como flatMap encadeia busca entre repositories.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que RepositorioMemoria é genérico?
2. Por que ServicoOrdemServico não deve ser genérico?
3. Onde Optional foi usado corretamente?
4. Onde Resultado<T> ajuda?
5. Qual regra ficou protegida dentro da entidade?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar Identificavel<ID>;
criar Resumivel;
criar Resultado<T>;
criar objeto de valor Email;
criar objeto de valor CodigoOs;
criar Cliente identificável;
criar OrdemServico identificável;
criar Repositorio<ID,T>;
criar RepositorioMemoria<ID,T>;
usar Optional<T> em buscarPorId;
usar orElseThrow em buscarObrigatorio;
criar ServicoCliente;
criar ServicoOrdemServico;
usar Resultado<T> em operações;
usar flatMap para buscar cliente da OS;
criar relatório com List<? extends Resumivel>;
executar cenários de sucesso;
executar cenários de erro;
resolver MiniProjetoTecnicoApp;
resolver resumoTecnicoDaOs;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-182-mini-projeto-generics-optional-repository-resultado
git commit -m "Aula 182: mini projeto generics optional repository resultado"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Generics são mais úteis quando expressam uma estrutura técnica reutilizável sem apagar as regras do domínio.
```

Neste mini-projeto, você viu:

```text
Repository genérico;
Resultado genérico;
Optional em buscas;
entidades específicas;
serviços específicos;
regras explícitas;
relatórios flexíveis.
```

Essa combinação é muito próxima do raciocínio que será usado depois com:

```text
JPA repositories;
services;
use cases;
DTOs;
mappers;
responses;
controllers;
testes;
arquitetura.
```

Na próxima aula, vamos fazer a revisão técnica do Módulo 6 até aqui.

Vamos consolidar Generics, Optional, bounded types, wildcards, PECS, type erasure e boas práticas antes de avançar para o próximo bloco da formação.
