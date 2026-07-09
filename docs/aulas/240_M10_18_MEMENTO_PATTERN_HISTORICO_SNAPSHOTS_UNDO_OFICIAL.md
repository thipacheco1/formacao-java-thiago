# 240 — M10.18 — Memento Pattern: histórico, snapshots e undo

## Objetivo da aula

Na aula anterior, você estudou:

```text
Mediator Pattern
```

Você viu que Mediator ajuda quando vários objetos precisam se comunicar e o acoplamento direto começa a ficar difícil de manter, centralizando a coordenação em um mediador.

Agora vamos estudar um padrão comportamental muito útil quando você precisa guardar estados anteriores de um objeto:

```text
Memento Pattern
```

Em português:

```text
Padrão Lembrança
```

Memento aparece quando você precisa salvar um snapshot do estado de um objeto para restaurá-lo depois, sem expor detalhes internos desse objeto.

Exemplos comuns em backend:

```text
histórico de edição;
rascunho;
desfazer alteração;
snapshot de entidade;
controle de versão;
auditoria de mudanças;
restauração de configuração;
workflow com rollback manual;
edição de contrato;
edição de cadastro;
simulação antes de confirmar;
validação com retorno ao estado anterior;
importação com prévia;
estado anterior de pedido;
histórico de parâmetros;
configuração antes/depois.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Memento resolve;
diferenciar histórico, auditoria e snapshot;
criar um objeto originador;
criar um memento imutável;
criar um caretaker para guardar snapshots;
salvar estado antes de alterar;
restaurar estado anterior;
aplicar undo simples;
aplicar histórico em configuração;
aplicar snapshot em edição de cadastro;
diferenciar Memento de Command;
diferenciar Memento de Event Sourcing;
diferenciar Memento de auditoria;
saber quando Memento é útil e quando é exagero.
```

---

## Ideia principal

Memento permite capturar e restaurar o estado interno de um objeto sem expor sua estrutura interna para o mundo externo.

Você tem três papéis principais:

```text
Originator:
objeto cujo estado será salvo e restaurado.

Memento:
snapshot imutável do estado.

Caretaker:
objeto que guarda os snapshots.
```

Exemplo simples:

```text
EditorTexto:
estado atual do texto.

EditorTextoMemento:
snapshot do texto em determinado momento.

HistoricoEditor:
guarda snapshots e permite desfazer.
```

---

## Memento em uma frase prática

```text
Use Memento quando precisar salvar e restaurar estados anteriores de um objeto sem expor seus detalhes internos.
```

Ou:

```text
Memento cria snapshots seguros para permitir undo, histórico ou restauração.
```

---

## Problema sem Memento

Imagine uma configuração de sistema.

Campos:

```text
nome;
valor;
descrição;
ativo;
atualizadoEm;
atualizadoPor.
```

Você quer permitir:

```text
alterar configuração;
salvar estado anterior;
desfazer alteração;
consultar histórico de versões.
```

Sem Memento, você pode espalhar cópias manuais:

```java
String nomeAnterior = config.nome();
String valorAnterior = config.valor();
String descricaoAnterior = config.descricao();
boolean ativoAnterior = config.ativo();
```

Depois, se adicionar novo campo, você precisa lembrar de atualizar todas as cópias.

Memento organiza isso.

O próprio objeto sabe criar seu snapshot.

O caretaker só guarda snapshots.

---

## Relação com SOLID

## SRP

Cada classe tem uma responsabilidade:

```text
Originator:
controla estado e cria/restaura snapshot.

Memento:
representa estado salvo.

Caretaker:
guarda histórico de snapshots.
```

---

## OCP

Você pode trocar a forma de guardar histórico sem alterar o objeto principal.

Exemplo:

```text
histórico em memória;
histórico em banco;
histórico em arquivo;
histórico em fila.
```

---

## LSP

Mementos devem ser confiáveis e imutáveis.

Se um snapshot pode ser alterado por fora, ele deixa de representar o estado salvo.

---

## ISP

Não exponha métodos desnecessários no memento.

Ele deve conter apenas o necessário para restaurar ou consultar metadados.

---

## DIP

Em sistemas maiores, o use case pode depender de um repositório de snapshots ou histórico por abstração.

Nesta aula, vamos usar Java puro e memória.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Memento:

```text
A entidade/originator cria e restaura snapshots.
O caretaker guarda snapshots.
O use case decide quando salvar/restaurar.
O repository pode persistir o estado final ou histórico.
O controller futuro apenas dispara operações.
```

Memento não substitui auditoria, repository ou regra de negócio.

---

# Parte 1 — Memento vs Auditoria

Memento e auditoria parecem parecidos, mas não são iguais.

## Auditoria

Registra o que aconteceu.

Exemplo:

```text
Usuário Thiago alterou valor de X para Y em 2026-07-09.
```

Auditoria responde:

```text
quem fez?
quando fez?
o que fez?
qual origem?
qual motivo?
```

---

## Memento

Guarda um estado restaurável.

Exemplo:

```text
snapshot da configuração antes da alteração.
```

Memento responde:

```text
como voltar para um estado anterior?
```

---

## Diferença prática

```text
Auditoria:
rastreabilidade.

Memento:
restauração de estado.
```

Os dois podem trabalhar juntos.

---

# Parte 2 — Memento vs Command

## Command

Encapsula uma ação.

Exemplo:

```text
AlterarConfiguracaoCommand;
CancelarPedidoCommand;
EnviarMensagemCommand.
```

---

## Memento

Encapsula um estado salvo.

Exemplo:

```text
ConfiguracaoMemento;
EditorTextoMemento.
```

---

## Diferença prática

```text
Command:
o que executar?

Memento:
para qual estado voltar?
```

Eles podem trabalhar juntos.

Exemplo:

```text
antes de executar um Command, salvar um Memento.
se o usuário pedir undo, restaurar o Memento.
```

---

# Parte 3 — Memento vs Event Sourcing

## Event Sourcing

Guarda uma sequência de eventos que representam tudo que aconteceu.

Exemplo:

```text
PedidoCriado;
PedidoPago;
PedidoFaturado;
PedidoEnviado.
```

O estado atual é reconstruído aplicando eventos.

---

## Memento

Guarda snapshots de estado.

Exemplo:

```text
PedidoSnapshot(status=PAGO, valor=1500, ...)
```

---

## Diferença prática

```text
Event Sourcing:
histórico de fatos.

Memento:
fotografia do estado.
```

Em sistemas avançados, snapshots podem até complementar Event Sourcing, mas são conceitos diferentes.

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-240-memento-pattern-historico-snapshots-undo
cd labs\m10\aula-240-memento-pattern-historico-snapshots-undo
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula240

mkdir src\br\com\curso\aula240\app

mkdir src\br\com\curso\aula240\editor
mkdir src\br\com\curso\aula240\configuracao
mkdir src\br\com\curso\aula240\cadastro
mkdir src\br\com\curso\aula240\historico
```

---

# Parte 5 — Exemplo 1: editor de texto

Vamos começar com exemplo didático.

## EditorTextoMemento

Crie:

```text
src\br\com\curso\aula240\editor\EditorTextoMemento.java
```

Código:

```java
package br.com.curso.aula240.editor;

import java.time.Instant;

public final class EditorTextoMemento {
    private final String conteudo;
    private final Instant salvoEm;

    EditorTextoMemento(String conteudo, Instant salvoEm) {
        if (conteudo == null) {
            throw new IllegalArgumentException("Conteúdo não pode ser nulo.");
        }

        if (salvoEm == null) {
            throw new IllegalArgumentException("Data do snapshot é obrigatória.");
        }

        this.conteudo = conteudo;
        this.salvoEm = salvoEm;
    }

    String conteudo() {
        return conteudo;
    }

    public Instant salvoEm() {
        return salvoEm;
    }

    public String resumo() {
        return "Snapshot salvo em " + salvoEm + " | tamanho=" + conteudo.length();
    }
}
```

---

## Por que o construtor não é public?

O construtor foi deixado sem `public`.

Assim, apenas classes do mesmo pacote conseguem criar o memento.

Isso ajuda a evitar que qualquer parte externa monte snapshot inválido.

Em sistemas mais avançados, você pode usar outros desenhos.

---

## EditorTexto

Crie:

```text
src\br\com\curso\aula240\editor\EditorTexto.java
```

Código:

```java
package br.com.curso.aula240.editor;

import java.time.Instant;

public class EditorTexto {
    private String conteudo = "";

    public void escrever(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser nulo.");
        }

        conteudo += texto;
    }

    public void substituirTudo(String novoConteudo) {
        if (novoConteudo == null) {
            throw new IllegalArgumentException("Novo conteúdo não pode ser nulo.");
        }

        conteudo = novoConteudo;
    }

    public String conteudo() {
        return conteudo;
    }

    public EditorTextoMemento salvar() {
        return new EditorTextoMemento(conteudo, Instant.now());
    }

    public void restaurar(EditorTextoMemento memento) {
        if (memento == null) {
            throw new IllegalArgumentException("Memento é obrigatório.");
        }

        this.conteudo = memento.conteudo();
    }
}
```

---

## HistoricoEditorTexto

Crie:

```text
src\br\com\curso\aula240\editor\HistoricoEditorTexto.java
```

Código:

```java
package br.com.curso.aula240.editor;

import java.util.ArrayDeque;
import java.util.Deque;

public class HistoricoEditorTexto {
    private final Deque<EditorTextoMemento> snapshots = new ArrayDeque<>();

    public void salvar(EditorTexto editor) {
        if (editor == null) {
            throw new IllegalArgumentException("Editor é obrigatório.");
        }

        EditorTextoMemento snapshot = editor.salvar();

        snapshots.push(snapshot);

        System.out.println("[HISTORICO] " + snapshot.resumo());
    }

    public void desfazer(EditorTexto editor) {
        if (editor == null) {
            throw new IllegalArgumentException("Editor é obrigatório.");
        }

        if (snapshots.isEmpty()) {
            throw new IllegalStateException("Não há snapshots para restaurar.");
        }

        EditorTextoMemento snapshot = snapshots.pop();

        editor.restaurar(snapshot);

        System.out.println("[HISTORICO] Restaurado: " + snapshot.resumo());
    }

    public int totalSnapshots() {
        return snapshots.size();
    }
}
```

---

## EditorTextoMementoApp

Crie:

```text
src\br\com\curso\aula240\app\EditorTextoMementoApp.java
```

Código:

```java
package br.com.curso.aula240.app;

import br.com.curso.aula240.editor.EditorTexto;
import br.com.curso.aula240.editor.HistoricoEditorTexto;

public class EditorTextoMementoApp {
    public static void main(String[] args) {
        EditorTexto editor = new EditorTexto();
        HistoricoEditorTexto historico = new HistoricoEditorTexto();

        editor.escrever("Versão inicial.");
        historico.salvar(editor);

        editor.escrever(" Mais conteúdo.");
        historico.salvar(editor);

        editor.escrever(" Conteúdo errado.");
        System.out.println("Atual: " + editor.conteudo());

        historico.desfazer(editor);
        System.out.println("Após undo 1: " + editor.conteudo());

        historico.desfazer(editor);
        System.out.println("Após undo 2: " + editor.conteudo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula240.app.EditorTextoMementoApp
```

---

## O que observar

O histórico não mexe diretamente no campo `conteudo`.

Ele apenas pede:

```java
editor.salvar()
```

e depois:

```java
editor.restaurar(snapshot)
```

O estado interno continua controlado pelo próprio editor.

---

# Parte 6 — Exemplo 2: configuração de sistema

Agora vamos para um exemplo mais próximo de backend.

Uma configuração pode ser alterada, mas queremos guardar snapshots para restauração.

---

## ConfiguracaoSistemaMemento

Crie:

```text
src\br\com\curso\aula240\configuracao\ConfiguracaoSistemaMemento.java
```

Código:

```java
package br.com.curso.aula240.configuracao;

import java.time.Instant;

public final class ConfiguracaoSistemaMemento {
    private final String chave;
    private final String valor;
    private final String descricao;
    private final boolean ativa;
    private final String usuarioResponsavel;
    private final Instant snapshotEm;

    ConfiguracaoSistemaMemento(
            String chave,
            String valor,
            String descricao,
            boolean ativa,
            String usuarioResponsavel,
            Instant snapshotEm
    ) {
        this.chave = chave;
        this.valor = valor;
        this.descricao = descricao;
        this.ativa = ativa;
        this.usuarioResponsavel = usuarioResponsavel;
        this.snapshotEm = snapshotEm;
    }

    String chave() {
        return chave;
    }

    String valor() {
        return valor;
    }

    String descricao() {
        return descricao;
    }

    boolean ativa() {
        return ativa;
    }

    String usuarioResponsavel() {
        return usuarioResponsavel;
    }

    public Instant snapshotEm() {
        return snapshotEm;
    }

    public String resumoPublico() {
        return "Snapshot da configuração " + chave + " em " + snapshotEm + " por " + usuarioResponsavel;
    }
}
```

---

## ConfiguracaoSistema

Crie:

```text
src\br\com\curso\aula240\configuracao\ConfiguracaoSistema.java
```

Código:

```java
package br.com.curso.aula240.configuracao;

import java.time.Instant;

public class ConfiguracaoSistema {
    private final String chave;
    private String valor;
    private String descricao;
    private boolean ativa;
    private String usuarioResponsavel;

    public ConfiguracaoSistema(
            String chave,
            String valor,
            String descricao,
            boolean ativa,
            String usuarioResponsavel
    ) {
        if (chave == null || chave.isBlank()) {
            throw new IllegalArgumentException("Chave é obrigatória.");
        }

        validarValor(valor);
        validarDescricao(descricao);
        validarUsuario(usuarioResponsavel);

        this.chave = chave.trim().toUpperCase();
        this.valor = valor.trim();
        this.descricao = descricao.trim();
        this.ativa = ativa;
        this.usuarioResponsavel = usuarioResponsavel.trim();
    }

    public void alterarValor(String novoValor, String usuario) {
        validarValor(novoValor);
        validarUsuario(usuario);

        this.valor = novoValor.trim();
        this.usuarioResponsavel = usuario.trim();
    }

    public void alterarDescricao(String novaDescricao, String usuario) {
        validarDescricao(novaDescricao);
        validarUsuario(usuario);

        this.descricao = novaDescricao.trim();
        this.usuarioResponsavel = usuario.trim();
    }

    public void ativar(String usuario) {
        validarUsuario(usuario);

        this.ativa = true;
        this.usuarioResponsavel = usuario.trim();
    }

    public void inativar(String usuario) {
        validarUsuario(usuario);

        this.ativa = false;
        this.usuarioResponsavel = usuario.trim();
    }

    public ConfiguracaoSistemaMemento criarSnapshot() {
        return new ConfiguracaoSistemaMemento(
                chave,
                valor,
                descricao,
                ativa,
                usuarioResponsavel,
                Instant.now()
        );
    }

    public void restaurar(ConfiguracaoSistemaMemento snapshot, String usuarioRestauracao) {
        if (snapshot == null) {
            throw new IllegalArgumentException("Snapshot é obrigatório.");
        }

        validarUsuario(usuarioRestauracao);

        if (!this.chave.equals(snapshot.chave())) {
            throw new IllegalArgumentException("Snapshot pertence a outra configuração.");
        }

        this.valor = snapshot.valor();
        this.descricao = snapshot.descricao();
        this.ativa = snapshot.ativa();
        this.usuarioResponsavel = usuarioRestauracao.trim();
    }

    public String chave() {
        return chave;
    }

    public String valor() {
        return valor;
    }

    public String descricao() {
        return descricao;
    }

    public boolean ativa() {
        return ativa;
    }

    public String usuarioResponsavel() {
        return usuarioResponsavel;
    }

    public String resumo() {
        return chave
                + " | valor=" + valor
                + " | ativa=" + ativa
                + " | responsável=" + usuarioResponsavel
                + " | descrição=" + descricao;
    }

    private void validarValor(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }
    }

    private void validarDescricao(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }
    }

    private void validarUsuario(String usuario) {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }
    }
}
```

---

## HistoricoConfiguracao

Crie:

```text
src\br\com\curso\aula240\configuracao\HistoricoConfiguracao.java
```

Código:

```java
package br.com.curso.aula240.configuracao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class HistoricoConfiguracao {
    private final List<ConfiguracaoSistemaMemento> snapshots = new ArrayList<>();

    public void salvarSnapshot(ConfiguracaoSistema configuracao) {
        if (configuracao == null) {
            throw new IllegalArgumentException("Configuração é obrigatória.");
        }

        ConfiguracaoSistemaMemento snapshot = configuracao.criarSnapshot();

        snapshots.add(snapshot);

        System.out.println("[SNAPSHOT] " + snapshot.resumoPublico());
    }

    public Optional<ConfiguracaoSistemaMemento> ultimoSnapshotDaChave(String chave) {
        if (chave == null || chave.isBlank()) {
            throw new IllegalArgumentException("Chave é obrigatória.");
        }

        String normalizada = chave.trim().toUpperCase();

        for (int i = snapshots.size() - 1; i >= 0; i--) {
            ConfiguracaoSistemaMemento snapshot = snapshots.get(i);

            if (snapshot.chave().equals(normalizada)) {
                return Optional.of(snapshot);
            }
        }

        return Optional.empty();
    }

    public int total() {
        return snapshots.size();
    }

    public void imprimir() {
        System.out.println("Histórico de snapshots:");

        for (ConfiguracaoSistemaMemento snapshot : snapshots) {
            System.out.println(" - " + snapshot.resumoPublico());
        }
    }
}
```

---

## ConfiguracaoMementoApp

Crie:

```text
src\br\com\curso\aula240\app\ConfiguracaoMementoApp.java
```

Código:

```java
package br.com.curso.aula240.app;

import br.com.curso.aula240.configuracao.ConfiguracaoSistema;
import br.com.curso.aula240.configuracao.ConfiguracaoSistemaMemento;
import br.com.curso.aula240.configuracao.HistoricoConfiguracao;

public class ConfiguracaoMementoApp {
    public static void main(String[] args) {
        ConfiguracaoSistema config = new ConfiguracaoSistema(
                "LINK_ACOMPANHAMENTO",
                "https://app.exemplo.com/acompanhar",
                "Link de acompanhamento da jornada",
                true,
                "thiago"
        );

        HistoricoConfiguracao historico = new HistoricoConfiguracao();

        historico.salvarSnapshot(config);

        config.alterarValor("https://url-errada.com", "usuario-teste");
        config.inativar("usuario-teste");

        System.out.println();
        System.out.println("Após alteração incorreta:");
        System.out.println(config.resumo());

        ConfiguracaoSistemaMemento snapshot = historico
                .ultimoSnapshotDaChave("LINK_ACOMPANHAMENTO")
                .orElseThrow();

        config.restaurar(snapshot, "thiago");

        System.out.println();
        System.out.println("Após restauração:");
        System.out.println(config.resumo());
    }
}
```

---

## O que observar

O histórico não sabe como restaurar campo por campo.

Ele guarda o snapshot.

A configuração sabe restaurar seu próprio estado.

Isso protege encapsulamento.

---

# Parte 7 — Exemplo 3: cadastro de cliente com histórico de edição

Agora vamos simular edição de cadastro.

Cenário:

```text
cliente tem nome, telefone e e-mail;
antes de alterar, salvamos snapshot;
se alteração for rejeitada, restauramos.
```

---

## ClienteCadastroMemento

Crie:

```text
src\br\com\curso\aula240\cadastro\ClienteCadastroMemento.java
```

Código:

```java
package br.com.curso.aula240.cadastro;

import java.time.Instant;

public final class ClienteCadastroMemento {
    private final String documento;
    private final String nome;
    private final String telefone;
    private final String email;
    private final Instant snapshotEm;

    ClienteCadastroMemento(
            String documento,
            String nome,
            String telefone,
            String email,
            Instant snapshotEm
    ) {
        this.documento = documento;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.snapshotEm = snapshotEm;
    }

    String documento() {
        return documento;
    }

    String nome() {
        return nome;
    }

    String telefone() {
        return telefone;
    }

    String email() {
        return email;
    }

    public Instant snapshotEm() {
        return snapshotEm;
    }

    public String resumoPublico() {
        return "Snapshot cliente " + documento + " em " + snapshotEm;
    }
}
```

---

## ClienteCadastro

Crie:

```text
src\br\com\curso\aula240\cadastro\ClienteCadastro.java
```

Código:

```java
package br.com.curso.aula240.cadastro;

import java.time.Instant;

public class ClienteCadastro {
    private final String documento;
    private String nome;
    private String telefone;
    private String email;

    public ClienteCadastro(String documento, String nome, String telefone, String email) {
        validarDocumento(documento);
        validarNome(nome);
        validarTelefone(telefone);
        validarEmail(email);

        this.documento = documento.trim();
        this.nome = nome.trim();
        this.telefone = telefone.trim();
        this.email = email.trim();
    }

    public void alterarContato(String novoTelefone, String novoEmail) {
        validarTelefone(novoTelefone);
        validarEmail(novoEmail);

        this.telefone = novoTelefone.trim();
        this.email = novoEmail.trim();
    }

    public void alterarNome(String novoNome) {
        validarNome(novoNome);

        this.nome = novoNome.trim();
    }

    public ClienteCadastroMemento criarSnapshot() {
        return new ClienteCadastroMemento(
                documento,
                nome,
                telefone,
                email,
                Instant.now()
        );
    }

    public void restaurar(ClienteCadastroMemento snapshot) {
        if (snapshot == null) {
            throw new IllegalArgumentException("Snapshot é obrigatório.");
        }

        if (!this.documento.equals(snapshot.documento())) {
            throw new IllegalArgumentException("Snapshot pertence a outro cliente.");
        }

        this.nome = snapshot.nome();
        this.telefone = snapshot.telefone();
        this.email = snapshot.email();
    }

    public String documento() {
        return documento;
    }

    public String resumo() {
        return documento + " | " + nome + " | " + telefone + " | " + email;
    }

    private void validarDocumento(String documento) {
        if (documento == null || documento.isBlank()) {
            throw new IllegalArgumentException("Documento é obrigatório.");
        }
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }

    private void validarTelefone(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }
    }

    private void validarEmail(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
    }
}
```

---

## HistoricoClienteCadastro

Crie:

```text
src\br\com\curso\aula240\cadastro\HistoricoClienteCadastro.java
```

Código:

```java
package br.com.curso.aula240.cadastro;

import java.util.ArrayDeque;
import java.util.Deque;

public class HistoricoClienteCadastro {
    private final Deque<ClienteCadastroMemento> historico = new ArrayDeque<>();

    public void salvar(ClienteCadastro cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        ClienteCadastroMemento snapshot = cliente.criarSnapshot();

        historico.push(snapshot);

        System.out.println("[CLIENTE SNAPSHOT] " + snapshot.resumoPublico());
    }

    public void desfazerUltimaAlteracao(ClienteCadastro cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (historico.isEmpty()) {
            throw new IllegalStateException("Não há snapshot para restaurar.");
        }

        ClienteCadastroMemento snapshot = historico.pop();

        cliente.restaurar(snapshot);

        System.out.println("[CLIENTE RESTAURADO] " + snapshot.resumoPublico());
    }

    public int totalSnapshots() {
        return historico.size();
    }
}
```

---

## ClienteCadastroMementoApp

Crie:

```text
src\br\com\curso\aula240\app\ClienteCadastroMementoApp.java
```

Código:

```java
package br.com.curso.aula240.app;

import br.com.curso.aula240.cadastro.ClienteCadastro;
import br.com.curso.aula240.cadastro.HistoricoClienteCadastro;

public class ClienteCadastroMementoApp {
    public static void main(String[] args) {
        ClienteCadastro cliente = new ClienteCadastro(
                "12345678900",
                "Ana Silva",
                "11999999999",
                "ana@email.com"
        );

        HistoricoClienteCadastro historico = new HistoricoClienteCadastro();

        System.out.println("Original:");
        System.out.println(cliente.resumo());

        historico.salvar(cliente);

        cliente.alterarContato("11888888888", "email-invalido-sem-arroba");

        System.out.println(cliente.resumo());
    }
}
```

---

## Atenção

Esse app vai falhar porque o e-mail é inválido.

Agora vamos criar uma versão com try/catch que restaura se algo der errado.

---

## ClienteCadastroRollbackMementoApp

Crie:

```text
src\br\com\curso\aula240\app\ClienteCadastroRollbackMementoApp.java
```

Código:

```java
package br.com.curso.aula240.app;

import br.com.curso.aula240.cadastro.ClienteCadastro;
import br.com.curso.aula240.cadastro.HistoricoClienteCadastro;

public class ClienteCadastroRollbackMementoApp {
    public static void main(String[] args) {
        ClienteCadastro cliente = new ClienteCadastro(
                "12345678900",
                "Ana Silva",
                "11999999999",
                "ana@email.com"
        );

        HistoricoClienteCadastro historico = new HistoricoClienteCadastro();

        System.out.println("Original:");
        System.out.println(cliente.resumo());

        historico.salvar(cliente);

        try {
            cliente.alterarNome("Ana Souza");
            cliente.alterarContato("11888888888", "email-invalido-sem-arroba");
        } catch (RuntimeException erro) {
            System.out.println("Erro na alteração: " + erro.getMessage());
            historico.desfazerUltimaAlteracao(cliente);
        }

        System.out.println();
        System.out.println("Estado final:");
        System.out.println(cliente.resumo());
    }
}
```

---

## Análise

Esse exemplo simula uma tentativa de edição com rollback.

Fluxo:

```text
salva snapshot;
tenta alterar;
se falhar, restaura snapshot.
```

Em backend real, muitas vezes isso seria tratado por transação de banco.

Mas Memento continua útil para:

```text
undo lógico;
edições em memória;
rascunhos;
snapshots de configuração;
histórico de versões;
comparação antes/depois.
```

---

# Parte 8 — Snapshot não é sempre rollback transacional

Memento pode ajudar a restaurar objeto em memória.

Mas em sistemas com banco de dados, rollback transacional é outra coisa.

Exemplo:

```text
BEGIN;
UPDATE tabela;
erro;
ROLLBACK;
```

Isso é responsabilidade do banco/transação.

Memento é útil quando você precisa de:

```text
estado anterior do objeto;
histórico de versões;
undo manual;
comparação;
snapshot de configuração;
restauração controlada.
```

Não confunda Memento com transação de banco.

---

# Parte 9 — Memento e encapsulamento

O objetivo do Memento é evitar que o caretaker precise conhecer os detalhes internos.

Ruim:

```java
historico.salvar(
    cliente.nome(),
    cliente.telefone(),
    cliente.email()
);
```

Melhor:

```java
historico.salvar(cliente.criarSnapshot());
```

Ou:

```java
historico.salvar(cliente);
```

Assim, se o cliente ganhar novo campo, o snapshot pode ser ajustado dentro do próprio pacote/classe.

---

# Parte 10 — Memento e imutabilidade

Memento deve ser imutável.

Evite:

```java
setValor(...)
setStatus(...)
setNome(...)
```

Use:

```text
campos final;
sem setters;
construtor controlado;
record quando adequado;
cópias defensivas para listas.
```

Se o snapshot muda depois de salvo, ele deixa de ser confiável.

---

# Parte 11 — Cuidado com objetos grandes

Salvar snapshots pode custar memória.

Se o objeto tem muitos dados:

```text
listas grandes;
documentos grandes;
anexos;
payloads;
imagens;
históricos extensos.
```

Você precisa pensar em:

```text
limite de snapshots;
persistência em banco;
compactação;
armazenar somente diferenças;
limpar histórico antigo;
armazenar apenas campos necessários.
```

Memento é poderoso, mas pode custar caro.

---

# Parte 12 — Como isso conversa com front-end

O front pode ter funcionalidades como:

```text
desfazer edição;
salvar rascunho;
voltar versão anterior;
comparar antes/depois;
restaurar configuração;
pré-visualizar alteração.
```

O backend pode usar Memento internamente para:

```text
salvar snapshot antes da alteração;
persistir versão anterior;
restaurar se usuário pedir;
gerar diff;
permitir auditoria visual.
```

Exemplo de endpoint futuro:

```text
POST /configuracoes/LINK_ACOMPANHAMENTO/snapshots
POST /configuracoes/LINK_ACOMPANHAMENTO/restaurar/123
GET /configuracoes/LINK_ACOMPANHAMENTO/historico
```

O front não precisa saber que o padrão usado internamente é Memento.

---

# Parte 13 — Erros comuns com Memento

## 1. Snapshot mutável

Se o snapshot pode mudar, ele não é snapshot confiável.

---

## 2. Caretaker conhecendo campos internos demais

O histórico não deve montar estado manualmente campo por campo.

---

## 3. Guardar snapshot demais sem limite

Pode consumir muita memória ou banco.

---

## 4. Confundir Memento com auditoria

Auditoria rastreia.

Memento restaura.

---

## 5. Usar Memento no lugar de transação

Rollback de banco é outra responsabilidade.

---

## 6. Restaurar snapshot de outro objeto

Sempre valide identidade.

Exemplo:

```text
snapshot da configuração A não pode restaurar configuração B.
```

---

# Parte 14 — Quando usar Memento

Use Memento quando:

```text
precisa salvar estado anterior;
precisa desfazer alteração;
precisa restaurar versão;
precisa snapshot de configuração;
precisa histórico de edição;
precisa comparar antes/depois;
precisa preservar encapsulamento;
precisa controlar rascunhos.
```

---

## Quando evitar

Evite Memento quando:

```text
não há necessidade de restauração;
auditoria simples resolve;
transação de banco resolve;
o objeto é enorme e snapshots seriam caros;
o histórico nunca será usado;
uma simples cópia pontual resolve melhor.
```

---

# Parte 15 — Checklist para aplicar Memento

Pergunte:

```text
1. Preciso restaurar estado anterior?
2. O estado deve ficar encapsulado?
3. Quem cria snapshot é o próprio objeto?
4. O snapshot é imutável?
5. O caretaker só guarda snapshots?
6. Existe risco de snapshot de outro objeto?
7. Quantos snapshots serão guardados?
8. Onde snapshots serão armazenados?
9. Auditoria ou transação resolveriam melhor?
10. O ganho justifica a complexidade?
```

---

# Parte 16 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula240.app.EditorTextoMementoApp
java -cp out br.com.curso.aula240.app.ConfiguracaoMementoApp
java -cp out br.com.curso.aula240.app.ClienteCadastroRollbackMementoApp
```

O app abaixo falha propositalmente por e-mail inválido:

```powershell
java -cp out br.com.curso.aula240.app.ClienteCadastroMementoApp
```

Depois responda:

```text
1. Qual classe foi o Originator no exemplo do editor?
2. Qual classe foi o Memento no exemplo do editor?
3. Qual classe foi o Caretaker no exemplo do editor?
4. Por que o memento deve ser imutável?
5. Como a configuração foi restaurada?
6. Por que validar a chave no restore?
7. Qual diferença entre Memento e auditoria?
8. Qual diferença entre Memento e Command?
9. Quando transação de banco resolve melhor?
10. Quando Memento seria exagerado?
```

---

# Parte 17 — Exercício prático principal

## Contexto

Crie Memento para edição de Ordem de Serviço.

Campos:

```text
codigoOs;
cliente;
telefone;
descricao;
status;
dataAgendada;
periodo;
```

---

## Originator

Crie:

```text
OrdemServicoEdicao
```

Métodos:

```text
alterarContato(String telefone);
alterarAgendamento(LocalDate data, String periodo);
alterarDescricao(String descricao);
alterarStatus(String status);
criarSnapshot();
restaurar(snapshot);
resumo();
```

---

## Memento

Crie:

```text
OrdemServicoMemento
```

Deve guardar:

```text
codigoOs;
cliente;
telefone;
descricao;
status;
dataAgendada;
periodo;
snapshotEm;
usuarioSnapshot.
```

Deve ser imutável.

---

## Caretaker

Crie:

```text
HistoricoOrdemServico
```

Métodos:

```text
salvar(OrdemServicoEdicao os, String usuario);
desfazer(OrdemServicoEdicao os);
totalSnapshots();
imprimir();
```

---

## Apps

Crie:

```text
OrdemServicoMementoApp;
OrdemServicoRollbackApp;
```

---

## Critérios

```text
histórico não deve acessar campos internos manualmente;
snapshot deve ser criado pela própria OS;
snapshot deve validar codigoOs ao restaurar;
snapshot deve ser imutável;
deve existir exemplo de desfazer;
deve existir exemplo de rollback após erro.
```

---

# Parte 18 — Desafio extra

## Memento para parâmetros do sistema

Crie:

```text
ParametroSistema
ParametroSistemaMemento
HistoricoParametroSistema
```

Campos do parâmetro:

```text
chave;
valor;
tipo;
descricao;
ativo;
```

Funcionalidades:

```text
alterar valor;
alterar descrição;
ativar;
inativar;
snapshot;
restore;
listar histórico.
```

Critérios:

```text
memento imutável;
restauração valida chave;
histórico guarda snapshots;
app mostra alteração errada e restauração.
```

---

# Parte 19 — Simulado rápido

## Questão 1

Memento Pattern é usado principalmente para:

```text
A) salvar e restaurar estados anteriores de um objeto.
B) controlar acesso a objeto real.
C) adaptar API externa.
D) criar árvore de componentes.
```

---

## Questão 2

No Memento, Originator é:

```text
A) objeto cujo estado é salvo/restaurado.
B) objeto que apenas renderiza JSON.
C) objeto que adapta API externa.
D) objeto que representa canal de envio.
```

---

## Questão 3

No Memento, Caretaker é:

```text
A) objeto que guarda snapshots.
B) objeto que calcula frete.
C) objeto que controla cache HTTP.
D) objeto que sempre salva no banco.
```

---

## Questão 4

Um memento deve ser preferencialmente:

```text
A) imutável.
B) cheio de setters.
C) alterado por qualquer service.
D) independente de identidade.
```

---

## Questão 5

Memento se diferencia de auditoria porque:

```text
A) Memento restaura estado; auditoria registra rastreabilidade.
B) Auditoria sempre restaura objeto.
C) Memento sempre envia e-mail.
D) Não existe diferença.
```

---

## Questão 6

Um cuidado importante é:

```text
A) não restaurar snapshot de outro objeto.
B) sempre remover validação.
C) sempre expor todos os campos publicamente.
D) nunca usar data/hora.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 20 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Memento Pattern.
[ ] Sei identificar Originator.
[ ] Sei identificar Memento.
[ ] Sei identificar Caretaker.
[ ] Sei criar snapshot imutável.
[ ] Sei salvar snapshot antes de alterar.
[ ] Sei restaurar estado anterior.
[ ] Sei aplicar undo simples.
[ ] Sei aplicar em configuração.
[ ] Sei aplicar em cadastro.
[ ] Sei diferenciar Memento de auditoria.
[ ] Sei diferenciar Memento de Command.
[ ] Sei diferenciar Memento de Event Sourcing.
[ ] Sei explicar riscos de memória.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Memento Pattern?
2. Qual problema ele resolve?
3. O que é Originator?
4. O que é Memento?
5. O que é Caretaker?
6. Por que memento deve ser imutável?
7. Qual diferença entre Memento e auditoria?
8. Qual diferença entre Memento e Event Sourcing?
9. Por que validar identidade no restore?
10. Quando Memento seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar memento;
criar histórico;
salvar snapshots;
restaurar snapshots;
aplicar undo;
aplicar rollback lógico em memória;
proteger encapsulamento;
resolver exercício de OS;
resolver desafio de parâmetro.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-240-memento-pattern-historico-snapshots-undo
git commit -m "Aula 240: memento pattern historico snapshots undo"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Memento Pattern salva snapshots imutáveis para permitir restauração de estados anteriores sem expor os detalhes internos do objeto.
```

Você estudou:

```text
Memento Pattern;
Originator;
Memento;
Caretaker;
editor de texto;
configuração de sistema;
cadastro de cliente;
undo;
rollback lógico;
histórico;
imutabilidade;
diferença para auditoria;
diferença para Command;
diferença para Event Sourcing.
```

Na próxima aula, vamos estudar:

```text
Iterator Pattern.
```

A ideia será percorrer coleções e estruturas sem expor sua representação interna, útil para paginação, listas customizadas, árvores, lotes de processamento e leitura sequencial de dados.
