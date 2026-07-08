# 125 — M4.21 — Organização de classes em arquivos

## Objetivo da aula

Nesta aula você vai aprender a organizar classes Java em arquivos.

Até aqui, para facilitar o aprendizado, muitos exemplos colocaram várias classes no mesmo arquivo. Isso é útil em aula, porque permite enxergar tudo junto. Mas em um projeto real, principalmente backend, essa organização precisa evoluir.

Ao final da aula, você deve conseguir:

```text
explicar a relação entre classe pública e nome do arquivo;
entender por que só pode haver uma classe public por arquivo;
diferenciar classe public de classe sem public;
entender quando várias classes no mesmo arquivo são aceitáveis;
entender quando separar cada classe em seu próprio arquivo;
organizar arquivos Java de forma mais profissional;
evitar conflito de nomes de classes;
compilar projetos com múltiplos arquivos;
entender erros comuns de arquivo e classe;
preparar o caminho para pacotes Java.
```

Essa aula é importante porque organização de arquivos afeta diretamente:

```text
leitura;
manutenção;
navegação no IntelliJ;
compilação;
reuso;
testes;
trabalho em equipe;
evolução do projeto;
clareza da arquitetura.
```

Em Java, nome de arquivo importa.

Isso não é detalhe. É regra da linguagem.

---

## A ideia central

Em Java, uma classe pública precisa estar em um arquivo com o mesmo nome da classe.

Exemplo:

```java
public class Cliente {
}
```

Esse código precisa estar no arquivo:

```text
Cliente.java
```

Se a classe pública se chama:

```java
public class Pedido {
}
```

o arquivo precisa se chamar:

```text
Pedido.java
```

A regra principal é:

```text
uma classe public deve ter o mesmo nome do arquivo.
```

E existe outra regra muito importante:

```text
um arquivo Java pode ter no máximo uma classe public de topo.
```

Isso significa que você não pode colocar duas classes públicas no mesmo arquivo.

---

## Exemplo correto: classe pública e arquivo com mesmo nome

Crie a pasta:

```powershell
mkdir labs\m4\aula-125-organizacao-classes-arquivos
cd labs\m4\aula-125-organizacao-classes-arquivos
```

Crie o arquivo:

```text
ClienteArquivo.java
```

Código:

```java
public class ClienteArquivo {
    public static void main(String[] args) {
        ClienteOrganizado cliente = new ClienteOrganizado(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println(cliente.resumo());
    }
}

class ClienteOrganizado {
    private final int id;
    private final String nome;
    private final String email;

    ClienteOrganizado(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email.trim().toLowerCase();
    }

    String resumo() {
        return "Cliente " + id + " | Nome: " + nome + " | E-mail: " + email;
    }
}
```

Compile e execute:

```powershell
javac ClienteArquivo.java
java ClienteArquivo
```

---

## O que esse exemplo mostra

O arquivo se chama:

```text
ClienteArquivo.java
```

E a classe pública também se chama:

```java
public class ClienteArquivo
```

Isso está correto.

Dentro do mesmo arquivo, também existe:

```java
class ClienteOrganizado
```

Essa classe não é `public`.

Por isso, ela pode ficar no mesmo arquivo.

Esse tipo de organização é aceitável para exemplos pequenos, exercícios e aulas.

Mas não é a organização ideal para projeto maior.

---

## Classe public versus classe sem public

Compare:

```java
public class ClienteArquivo {
}
```

com:

```java
class ClienteOrganizado {
}
```

A classe pública é visível como classe principal daquele arquivo.

A classe sem `public` tem visibilidade mais restrita dentro do pacote.

Ainda vamos estudar pacotes em mais detalhes na próxima aula. Por enquanto, entenda:

```text
classe public é a classe principal exposta pelo arquivo;
classe sem public pode existir no mesmo arquivo como auxiliar.
```

Mas cuidado: poder fazer não significa que sempre seja uma boa ideia.

---

## O que não pode: duas classes public no mesmo arquivo

Este exemplo não deve ser colocado como arquivo real agora, porque ele não compila:

```java
public class Cliente {
}

public class Pedido {
}
```

Um único arquivo `.java` não pode ter duas classes públicas de topo.

Se você tentar, o compilador reclamará.

O correto seria separar:

```text
Cliente.java
Pedido.java
```

Com:

```java
public class Cliente {
}
```

em `Cliente.java`.

E:

```java
public class Pedido {
}
```

em `Pedido.java`.

---

## O que não pode: nome do arquivo diferente da classe public

Outro erro comum:

Arquivo:

```text
Cliente.java
```

Conteúdo:

```java
public class Pedido {
}
```

Isso não compila.

Se a classe pública é `Pedido`, o arquivo precisa ser:

```text
Pedido.java
```

O Java exige essa correspondência.

Regra prática:

```text
nome do arquivo = nome da classe public + .java
```

---

## Por que o Java faz isso

Essa regra ajuda o compilador, a IDE e os desenvolvedores a localizarem classes.

Quando você procura a classe:

```text
Pedido
```

é natural esperar o arquivo:

```text
Pedido.java
```

Quando você procura:

```text
OrdemServico
```

é natural esperar:

```text
OrdemServico.java
```

Essa previsibilidade ajuda muito em projetos grandes.

Em backend real, você pode ter centenas ou milhares de classes.

Sem organização, navegar no projeto vira sofrimento.

---

## Quando várias classes no mesmo arquivo são aceitáveis

Durante o curso, usamos muitas vezes várias classes no mesmo arquivo para facilitar:

```text
um arquivo;
um exemplo completo;
compilação simples;
leitura linear;
menos troca de arquivos.
```

Isso é aceitável para:

```text
aulas;
provas de conceito;
exemplos pequenos;
rascunhos;
demonstrações didáticas;
classes auxiliares muito pequenas.
```

Exemplo:

```java
public class ExemploPedido {
    public static void main(String[] args) {
    }
}

class Pedido {
}

class Cliente {
}

class Produto {
}
```

Para estudar, isso ajuda.

Para projeto real, começa a atrapalhar quando cresce.

---

## Quando separar classes em arquivos próprios

Separe classes quando elas:

```text
representam conceitos importantes do domínio;
serão reutilizadas;
possuem regras próprias;
possuem muitos métodos;
serão testadas isoladamente;
serão usadas por várias partes do sistema;
ficam grandes demais;
têm nomes importantes para navegação.
```

Bons candidatos a arquivos próprios:

```text
Cliente.java;
Pedido.java;
Produto.java;
Pagamento.java;
OrdemServico.java;
Atividade.java;
Dinheiro.java;
Email.java;
PeriodoAtendimento.java;
StatusPedido.java.
```

Em sistema backend, praticamente toda classe relevante fica em arquivo próprio.

---

## Exemplo em um único arquivo

Primeiro, vamos ver um exemplo funcional com várias classes no mesmo arquivo.

Crie:

```text
PedidoEmUmArquivo.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoEmUmArquivo {
    public static void main(String[] args) {
        ClienteUmArquivo cliente = new ClienteUmArquivo(
                10,
                "Ana Silva"
        );

        DinheiroUmArquivo total = DinheiroUmArquivo.de("399.80");

        PedidoUmArquivo pedido = new PedidoUmArquivo(
                1001,
                cliente,
                total
        );

        System.out.println(pedido.resumo());
    }
}

class PedidoUmArquivo {
    private final int numero;
    private final ClienteUmArquivo cliente;
    private final DinheiroUmArquivo total;
    private StatusPedidoUmArquivo status;

    PedidoUmArquivo(int numero, ClienteUmArquivo cliente, DinheiroUmArquivo total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = StatusPedidoUmArquivo.CRIADO;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + cliente.resumo()
                + " | Total: " + total
                + " | Status: " + status;
    }
}

class ClienteUmArquivo {
    private final int id;
    private final String nome;

    ClienteUmArquivo(int id, String nome) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
    }

    String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}

final class DinheiroUmArquivo {
    private final BigDecimal valor;

    private DinheiroUmArquivo(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroUmArquivo de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroUmArquivo(new BigDecimal(valor));
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}

enum StatusPedidoUmArquivo {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Compile e execute:

```powershell
javac PedidoEmUmArquivo.java
java PedidoEmUmArquivo
```

---

## Esse modelo funciona, mas não escala bem

O arquivo compila.

A saída funciona.

Mas imagine esse arquivo crescendo.

Com o tempo, cada classe ganharia mais métodos:

```text
Pedido confirma pagamento;
Pedido cancela;
Pedido calcula desconto;
Cliente altera nome;
Cliente valida status;
Dinheiro soma e subtrai;
Produto entra no pedido;
Pagamento entra no fluxo;
Auditoria entra no cancelamento.
```

O arquivo ficaria grande demais.

Você teria que rolar muito para encontrar cada classe.

Além disso, se outro exemplo também criar uma classe chamada `PedidoUmArquivo`, pode haver conflito no mesmo diretório.

Para evoluir, vamos separar.

---

## Separando em vários arquivos

Agora vamos criar uma versão organizada.

Crie uma subpasta:

```powershell
mkdir pedido-separado
cd pedido-separado
```

Dentro dela, criaremos estes arquivos:

```text
PedidoSeparadoApp.java
PedidoSeparado.java
ClienteSeparado.java
DinheiroSeparado.java
StatusPedidoSeparado.java
```

A ideia será:

```text
um conceito importante por arquivo.
```

---

## Arquivo PedidoSeparadoApp.java

Crie:

```text
PedidoSeparadoApp.java
```

Código:

```java
public class PedidoSeparadoApp {
    public static void main(String[] args) {
        ClienteSeparado cliente = new ClienteSeparado(
                10,
                "Ana Silva"
        );

        DinheiroSeparado total = DinheiroSeparado.de("399.80");

        PedidoSeparado pedido = new PedidoSeparado(
                1001,
                cliente,
                total
        );

        System.out.println(pedido.resumo());
    }
}
```

Essa classe tem o `main`.

Ela serve para executar o exemplo.

---

## Arquivo PedidoSeparado.java

Crie:

```text
PedidoSeparado.java
```

Código:

```java
public class PedidoSeparado {
    private final int numero;
    private final ClienteSeparado cliente;
    private final DinheiroSeparado total;
    private StatusPedidoSeparado status;

    public PedidoSeparado(int numero, ClienteSeparado cliente, DinheiroSeparado total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = StatusPedidoSeparado.CRIADO;
    }

    public boolean criado() {
        return status == StatusPedidoSeparado.CRIADO;
    }

    public void confirmarPagamento() {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        status = StatusPedidoSeparado.PAGO;
    }

    public String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + cliente.resumo()
                + " | Total: " + total
                + " | Status: " + status;
    }
}
```

---

## Arquivo ClienteSeparado.java

Crie:

```text
ClienteSeparado.java
```

Código:

```java
public class ClienteSeparado {
    private final int id;
    private final String nome;

    public ClienteSeparado(int id, String nome) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}
```

---

## Arquivo DinheiroSeparado.java

Crie:

```text
DinheiroSeparado.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class DinheiroSeparado {
    private final BigDecimal valor;

    private DinheiroSeparado(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static DinheiroSeparado de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroSeparado(new BigDecimal(valor));
    }

    public boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public DinheiroSeparado somar(DinheiroSeparado outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroSeparado(valor.add(outro.valor));
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        DinheiroSeparado dinheiro = (DinheiroSeparado) outro;
        return Objects.equals(valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

---

## Arquivo StatusPedidoSeparado.java

Crie:

```text
StatusPedidoSeparado.java
```

Código:

```java
public enum StatusPedidoSeparado {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## Compilando múltiplos arquivos

Dentro da pasta `pedido-separado`, execute:

```powershell
javac *.java
java PedidoSeparadoApp
```

O comando:

```powershell
javac *.java
```

compila todos os arquivos `.java` da pasta.

O comando:

```powershell
java PedidoSeparadoApp
```

executa a classe que tem o método `main`.

---

## O que melhorou ao separar arquivos

Agora cada classe está em seu próprio arquivo:

```text
PedidoSeparado.java;
ClienteSeparado.java;
DinheiroSeparado.java;
StatusPedidoSeparado.java.
```

Isso melhora:

```text
navegação;
leitura;
reuso;
manutenção;
organização;
evolução;
testes futuros.
```

Se você quiser alterar a regra de dinheiro, abre:

```text
DinheiroSeparado.java
```

Se quiser alterar regra de pedido, abre:

```text
PedidoSeparado.java
```

Se quiser alterar status do pedido, abre:

```text
StatusPedidoSeparado.java
```

Essa separação começa a parecer mais com projeto real.

---

## Por que os métodos ficaram public nessa versão

Quando todas as classes estavam no mesmo arquivo e no mesmo exemplo, usamos muitos métodos sem `public`.

Agora separamos as classes e começamos a pensar em uso entre arquivos.

Ainda estamos sem pacotes, mas já faz sentido declarar como `public` aquilo que representa API da classe.

Exemplo:

```java
public PedidoSeparado(...)
public boolean criado()
public void confirmarPagamento()
public String resumo()
```

Isso comunica:

```text
esses membros podem ser usados por outras classes.
```

Na próxima aula, com pacotes, essa conversa ficará mais importante.

Por enquanto, entenda:

```text
organização de arquivos começa a puxar organização de visibilidade.
```

---

## Arquivo com enum

Enum também pode ficar em arquivo próprio.

Exemplo:

```text
StatusPedidoSeparado.java
```

Conteúdo:

```java
public enum StatusPedidoSeparado {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Isso é comum quando o enum é usado por mais de uma classe.

Se o enum é apenas detalhe interno de um exemplo pequeno, poderia ficar no mesmo arquivo.

Mas em projeto real, enum importante geralmente fica separado.

---

## Arquivo com objeto de valor

Objetos de valor importantes também ficam em arquivos próprios.

Exemplo:

```text
DinheiroSeparado.java
```

Isso permite usar `DinheiroSeparado` em:

```text
Pedido;
Pagamento;
Produto;
Contrato;
Remuneração;
Cotação.
```

Se `Dinheiro` estivesse escondido dentro de um arquivo enorme de pedido, ficaria ruim de reutilizar.

Um objeto de valor bem feito merece arquivo próprio.

---

## Arquivo com entidade

Entidades quase sempre merecem arquivo próprio.

Exemplos:

```text
Cliente.java;
Pedido.java;
Produto.java;
Contrato.java;
OrdemServico.java;
Atividade.java;
Pagamento.java.
```

Por quê?

Porque entidade costuma ter:

```text
identidade;
estado;
comportamento;
ciclo de vida;
regras de negócio;
relacionamentos;
testes.
```

Colocar várias entidades importantes no mesmo arquivo vira confusão rapidamente.

---

## Nome de arquivo deve ser claro

Evite nomes genéricos:

```text
Classe1.java;
Teste.java;
Main.java;
Sistema.java;
Dados.java;
Objeto.java;
Utils.java.
```

Prefira nomes que representem o domínio:

```text
Pedido.java;
Cliente.java;
Dinheiro.java;
CodigoOs.java;
PeriodoAtendimento.java;
OrdemServico.java;
Mensagem.java;
Contrato.java.
```

O nome do arquivo deve ajudar você a encontrar a classe rapidamente.

---

## Nome da classe deve representar o conceito

Se a classe representa um cliente, chame:

```java
Cliente
```

Se representa pedido:

```java
Pedido
```

Se representa dinheiro:

```java
Dinheiro
```

Evite nomes como:

```java
Gerenciador;
Processador;
Manipulador;
ObjetoDados;
ClassePedido;
InfoCliente.
```

Alguns desses nomes podem fazer sentido em contextos específicos, mas muitos indicam falta de clareza.

No domínio, prefira nomes fortes.

---

## Cuidado com classes duplicadas no mesmo diretório

Se você tiver dois arquivos no mesmo diretório definindo a mesma classe, haverá problema.

Exemplo:

```text
Pedido.java
PedidoAntigo.java
```

E dentro dos dois:

```java
class Pedido {
}
```

Isso causa conflito.

O Java não permite duas classes com o mesmo nome no mesmo pacote.

Mesmo sem estudar pacotes ainda, pense no diretório atual como um espaço onde nomes precisam ser únicos.

Esse problema aconteceu algumas vezes nos exemplos do curso porque colocamos muitas classes auxiliares com nomes parecidos.

Por isso, nos exemplos oficiais, usamos nomes específicos por aula, como:

```text
PedidoSeparado;
PedidoUmArquivo;
PedidoConstrutor;
PedidoThis.
```

Em projeto real, os pacotes ajudam a organizar melhor.

---

## Compilando arquivo único versus múltiplos arquivos

Quando tudo está em um arquivo:

```powershell
javac PedidoEmUmArquivo.java
java PedidoEmUmArquivo
```

Quando há vários arquivos:

```powershell
javac *.java
java PedidoSeparadoApp
```

Se você compilar apenas:

```powershell
javac PedidoSeparadoApp.java
```

o `javac` pode tentar compilar dependências automaticamente se encontrar os arquivos no mesmo diretório.

Mas, para exercícios, é simples usar:

```powershell
javac *.java
```

Isso garante que todos os arquivos sejam compilados.

---

## IntelliJ e organização de arquivos

No IntelliJ, a regra continua a mesma.

Quando você cria uma classe pública chamada:

```text
PedidoSeparado
```

o IntelliJ cria o arquivo:

```text
PedidoSeparado.java
```

Se você renomear a classe, o IntelliJ geralmente sugere renomear o arquivo também.

Use os recursos da IDE:

```text
New Java Class;
Rename;
Move;
Refactor;
Find Usages;
Navigate to Class.
```

Organização boa deixa a IDE muito mais poderosa.

---

## Estrutura sugerida para esta aula

A pasta da aula pode ficar assim:

```text
labs/
└── m4/
    └── aula-125-organizacao-classes-arquivos/
        ├── PedidoEmUmArquivo.java
        └── pedido-separado/
            ├── PedidoSeparadoApp.java
            ├── PedidoSeparado.java
            ├── ClienteSeparado.java
            ├── DinheiroSeparado.java
            └── StatusPedidoSeparado.java
```

Ainda não estamos usando `package`.

A próxima aula vai tratar disso.

Por enquanto, o objetivo é entender a relação entre:

```text
classe;
arquivo;
nome;
compilação;
organização.
```

---

## Exemplo com Ordem de Serviço separada

Agora vamos praticar outro domínio.

Crie uma subpasta:

```powershell
cd ..
mkdir os-separada
cd os-separada
```

Dentro dela, crie:

```text
OrdemServicoApp.java
OrdemServicoSeparada.java
CodigoOsSeparado.java
PeriodoAtendimentoSeparado.java
StatusOsSeparado.java
TurnoAtendimentoSeparado.java
```

---

## Arquivo OrdemServicoApp.java

```java
import java.time.LocalDate;

public class OrdemServicoApp {
    public static void main(String[] args) {
        CodigoOsSeparado codigo = new CodigoOsSeparado("OS-2026-0001");

        PeriodoAtendimentoSeparado periodo = new PeriodoAtendimentoSeparado(
                LocalDate.now().plusDays(1),
                TurnoAtendimentoSeparado.MANHA
        );

        OrdemServicoSeparada os = new OrdemServicoSeparada(
                codigo,
                "Ana Silva",
                periodo
        );

        System.out.println(os.resumo());

        os.reagendar(new PeriodoAtendimentoSeparado(
                LocalDate.now().plusDays(3),
                TurnoAtendimentoSeparado.TARDE
        ));

        System.out.println(os.resumo());
    }
}
```

---

## Arquivo OrdemServicoSeparada.java

```java
public class OrdemServicoSeparada {
    private final CodigoOsSeparado codigo;
    private final String cliente;
    private PeriodoAtendimentoSeparado periodo;
    private StatusOsSeparado status;
    private int quantidadeReagendamentos;

    public OrdemServicoSeparada(
            CodigoOsSeparado codigo,
            String cliente,
            PeriodoAtendimentoSeparado periodo
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.status = StatusOsSeparado.AGENDADA;
        this.quantidadeReagendamentos = 0;
    }

    public boolean encerrada() {
        return status == StatusOsSeparado.CONCLUIDA
                || status == StatusOsSeparado.CANCELADA;
    }

    public void reagendar(PeriodoAtendimentoSeparado novoPeriodo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        periodo = novoPeriodo;
        status = StatusOsSeparado.REAGENDADA;
        quantidadeReagendamentos++;
    }

    public String resumo() {
        return "OS: " + codigo
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos;
    }
}
```

---

## Arquivo CodigoOsSeparado.java

```java
public final class CodigoOsSeparado {
    private static final String PREFIXO = "OS-";

    private final String valor;

    public CodigoOsSeparado(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    public String valor() {
        return valor;
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## Arquivo PeriodoAtendimentoSeparado.java

```java
import java.time.LocalDate;

public final class PeriodoAtendimentoSeparado {
    private final LocalDate data;
    private final TurnoAtendimentoSeparado turno;

    public PeriodoAtendimentoSeparado(LocalDate data, TurnoAtendimentoSeparado turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    public LocalDate data() {
        return data;
    }

    public TurnoAtendimentoSeparado turno() {
        return turno;
    }

    @Override
    public String toString() {
        return data + " - " + turno;
    }
}
```

---

## Arquivo StatusOsSeparado.java

```java
public enum StatusOsSeparado {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

---

## Arquivo TurnoAtendimentoSeparado.java

```java
public enum TurnoAtendimentoSeparado {
    MANHA,
    TARDE
}
```

---

## Compilando a OS separada

Dentro da pasta `os-separada`, execute:

```powershell
javac *.java
java OrdemServicoApp
```

Esse exercício reforça a organização.

Agora cada conceito tem seu arquivo.

---

## Vantagens da separação no exemplo de OS

A OS ficou distribuída assim:

```text
OrdemServicoSeparada.java
```

cuida da entidade OS.

```text
CodigoOsSeparado.java
```

cuida do código da OS.

```text
PeriodoAtendimentoSeparado.java
```

cuida de data e turno.

```text
StatusOsSeparado.java
```

cuida dos estados possíveis.

```text
TurnoAtendimentoSeparado.java
```

cuida dos turnos possíveis.

Essa organização facilita manutenção.

Se amanhã a regra de código mudar, você abre:

```text
CodigoOsSeparado.java
```

Se a regra de período mudar, você abre:

```text
PeriodoAtendimentoSeparado.java
```

Se os status mudarem, você abre:

```text
StatusOsSeparado.java
```

---

## Não confunda arquivo separado com boa arquitetura completa

Separar arquivos é necessário, mas não suficiente.

Você pode ter arquivos separados e ainda assim ter código ruim.

Exemplo:

```text
Pedido.java;
Cliente.java;
Pagamento.java;
Produto.java;
```

Mas se `Pedido` fizer tudo, se `Cliente` não tiver regra, se `Pagamento` for só dados soltos, a arquitetura ainda não está boa.

Organização de arquivos ajuda, mas precisa andar junto com:

```text
bons nomes;
responsabilidade clara;
encapsulamento;
composição;
objetos de valor;
entidades bem modeladas;
métodos de domínio.
```

Arquivo é organização física.

Modelo é organização conceitual.

Os dois importam.

---

## Como decidir o que vai para arquivo próprio

Pergunte:

```text
essa classe representa um conceito importante?
ela será usada por mais de uma classe?
ela tem regra própria?
ela tem mais que poucas linhas?
ela precisa ser testada?
ela tem nome forte no domínio?
ela pode evoluir separadamente?
```

Se sim, arquivo próprio é uma boa decisão.

Se é apenas uma classe auxiliar muito pequena de um exemplo, pode ficar no mesmo arquivo temporariamente.

---

## Classes auxiliares pequenas

Às vezes, em exemplos didáticos, faz sentido manter classes auxiliares no mesmo arquivo.

Exemplo:

```java
public class ExemploCalculo {
    public static void main(String[] args) {
    }
}

class CalculadoraSimples {
}
```

Mas em código profissional, mesmo classes auxiliares podem merecer arquivo próprio se crescerem.

A regra é:

```text
quanto mais importante a classe, mais ela merece arquivo próprio.
```

---

## Main não é domínio

Um cuidado importante:

```java
PedidoSeparadoApp
```

é apenas a classe de execução do exemplo.

Ela contém:

```java
public static void main(String[] args)
```

Ela não é o domínio.

O domínio está em:

```text
PedidoSeparado;
ClienteSeparado;
DinheiroSeparado;
StatusPedidoSeparado.
```

Em projetos reais, classes com `main` costumam ficar separadas da regra de negócio.

No futuro, em Spring Boot, a aplicação terá uma classe principal, mas o domínio ficará organizado em outras classes.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Classe public e arquivo

Execute:

```text
ClienteArquivo.java
```

Explique:

```text
qual classe é public;
qual classe não é public;
por que o arquivo precisa chamar ClienteArquivo.java.
```

### Parte 2 — Um arquivo

Execute:

```text
PedidoEmUmArquivo.java
```

Explique:

```text
por que funciona;
por que pode ficar ruim se crescer.
```

### Parte 3 — Pedido separado

Entre em:

```text
pedido-separado
```

Compile:

```powershell
javac *.java
java PedidoSeparadoApp
```

Explique:

```text
qual arquivo tem o main;
qual arquivo representa entidade;
qual arquivo representa objeto de valor;
qual arquivo representa enum.
```

### Parte 4 — OS separada

Entre em:

```text
os-separada
```

Compile:

```powershell
javac *.java
java OrdemServicoApp
```

Explique:

```text
por que CodigoOsSeparado ficou em arquivo próprio;
por que PeriodoAtendimentoSeparado ficou em arquivo próprio;
por que StatusOsSeparado e TurnoAtendimentoSeparado ficaram separados.
```

### Parte 5 — Erros controlados

Faça testes controlados:

```text
renomeie temporariamente PedidoSeparado.java para PedidoErrado.java;
tente compilar;
volte o nome correto.

crie temporariamente duas classes public no mesmo arquivo;
tente compilar;
remova a classe extra.
```

Observe os erros do compilador.

---

## Desafio prático

Crie uma pasta:

```text
labs/m4/aula-125-organizacao-classes-arquivos/contrato-separado
```

Dentro dela, modele um pequeno domínio de contrato com arquivos separados.

Arquivos obrigatórios:

```text
ContratoApp.java
ContratoSeparado.java
ClienteCorporativoSeparado.java
ServicoContratadoSeparado.java
DinheiroContratoSeparado.java
PeriodoContratoSeparado.java
StatusContratoSeparado.java
```

Regras:

```text
ContratoApp deve ter o main.
ContratoSeparado deve ser entidade.
ClienteCorporativoSeparado deve ter id, razão social e ativo.
ServicoContratadoSeparado deve ter nome e valor mensal.
DinheiroContratoSeparado deve ser objeto de valor com BigDecimal.
PeriodoContratoSeparado deve ter LocalDate inicio e fim.
StatusContratoSeparado deve ser enum com RASCUNHO, ATIVO e CANCELADO.
Contrato nasce RASCUNHO.
Contrato pode ativar se cliente estiver ativo e período for válido.
Contrato pode cancelar se não estiver cancelado.
Contrato deve calcular valor total usando valor mensal e quantidade de meses.
```

Compile com:

```powershell
javac *.java
java ContratoApp
```

Critério:

```text
cada classe importante em seu próprio arquivo;
somente uma classe public por arquivo;
nome do arquivo igual ao nome da classe public;
sem colocar tudo no ContratoApp.
```

---

## Erros comuns

### 1. Nome do arquivo diferente da classe public

Se a classe pública chama `Pedido`, o arquivo deve ser `Pedido.java`.

### 2. Duas classes public no mesmo arquivo

Java não permite duas classes públicas de topo no mesmo arquivo.

### 3. Colocar todas as classes em um arquivo gigante

Funciona no começo, mas atrapalha manutenção.

### 4. Separar arquivos, mas manter nomes ruins

Arquivo separado com nome ruim continua ruim.

### 5. Criar classe duplicada no mesmo diretório

Duas classes com o mesmo nome no mesmo espaço geram conflito.

### 6. Colocar regra de domínio na classe App

A classe com `main` deve montar e executar o exemplo, não concentrar regra de domínio.

### 7. Separar cedo demais classes irrelevantes

Em exemplos pequenos, classe auxiliar mínima pode ficar junto. Use critério.

### 8. Achar que arquivo separado resolve arquitetura

Organização física ajuda, mas responsabilidade de domínio continua sendo essencial.

---

## Debug recomendado

Use debug na versão separada:

```text
pedido-separado/PedidoSeparadoApp.java
os-separada/OrdemServicoApp.java
```

Coloque breakpoints em:

```java
new ClienteSeparado(...)
new DinheiroSeparado(...)
new PedidoSeparado(...)

new CodigoOsSeparado(...)
new PeriodoAtendimentoSeparado(...)
new OrdemServicoSeparada(...)
os.reagendar(...)
```

Durante o debug, use os atalhos da IDE para navegar:

```text
Ctrl + clique na classe;
Navigate to Declaration;
Find Usages;
Search Everywhere.
```

Observe como fica mais fácil navegar quando cada classe está no arquivo correto.

O objetivo do debug nesta aula não é apenas ver valor de variável.

É perceber organização.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual é a regra entre classe public e nome do arquivo?
2. Quando vale separar uma classe em arquivo próprio?
3. Por que a classe App com main não deve concentrar regra de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar a regra de classe public e arquivo;
criar uma classe public no arquivo correto;
entender que só pode haver uma classe public por arquivo;
usar classes sem public em exemplos pequenos;
separar entidade em arquivo próprio;
separar objeto de valor em arquivo próprio;
separar enum em arquivo próprio;
compilar múltiplos arquivos com javac *.java;
executar a classe com main correta;
evitar duplicidade de nomes;
organizar um mini domínio em arquivos;
entender a diferença entre organização física e modelagem;
resolver o desafio contrato-separado;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-125-organizacao-classes-arquivos
git commit -m "Aula 125: organiza classes Java em arquivos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
em Java, organização de classes e arquivos faz parte da qualidade do código.
```

Você aprendeu que:

```text
classe public deve ter o mesmo nome do arquivo;
um arquivo pode ter no máximo uma classe public de topo;
classes auxiliares sem public podem existir no mesmo arquivo;
em projetos reais, classes importantes devem ficar em arquivos próprios;
entidades, objetos de valor e enums relevantes merecem separação;
classe App com main não deve concentrar regra de domínio.
```

Essa aula prepara o próximo passo.

Na próxima aula, vamos estudar pacotes de domínio.

Vamos entender como usar `package`, como organizar classes em pastas com significado e como começar a estruturar um projeto Java de forma mais próxima de um backend real.
