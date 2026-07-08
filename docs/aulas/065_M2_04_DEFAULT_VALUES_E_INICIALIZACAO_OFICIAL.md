# 065 — M2.04 — Default Values e Inicialização

## A pergunta central da aula

Observe este código:

```java
public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        System.out.println(cliente.nome);
        System.out.println(cliente.idade);
        System.out.println(cliente.ativo);
    }
}

class Cliente {
    String nome;
    int idade;
    boolean ativo;
}
```

Esse código compila e roda.

Saída:

```text
null
0
false
```

Agora observe:

```java
public class Main {
    public static void main(String[] args) {
        String nome;
        int idade;
        boolean ativo;

        System.out.println(nome);
        System.out.println(idade);
        System.out.println(ativo);
    }
}
```

Esse código não compila.

A pergunta é:

```text
por que campos recebem valor padrão, mas variáveis locais não?
```

Resposta:

```text
campos de objetos e campos estáticos são inicializados automaticamente pela JVM;
elementos de arrays também recebem valores padrão;
variáveis locais precisam ser inicializadas explicitamente antes de serem usadas.
```

Essa é a regra principal da aula.

---

## O que é valor padrão

Valor padrão é o valor inicial que Java coloca automaticamente em alguns lugares quando você não informou um valor.

Exemplos de valores padrão:

```text
int -> 0
long -> 0L
double -> 0.0
boolean -> false
char -> '\u0000'
referências -> null
```

Referências incluem:

```text
String;
arrays;
objetos próprios;
StringBuilder;
Scanner;
qualquer tipo de classe.
```

Mas atenção:

```text
valor padrão automático não existe para variável local antes de uso.
```

Variável local precisa receber valor.

---

## Tabela de default values

| Tipo | Valor padrão |
|---|---|
| `byte` | `0` |
| `short` | `0` |
| `int` | `0` |
| `long` | `0L` |
| `float` | `0.0f` |
| `double` | `0.0d` |
| `boolean` | `false` |
| `char` | `'\u0000'` |
| Referência | `null` |

Exemplos de referência:

```text
String -> null
Cliente -> null
Pedido -> null
int[] -> null quando campo não inicializado
Cliente[] -> null quando campo não inicializado
```

Exemplo de array criado:

```java
int[] numeros = new int[3];
```

Os elementos do array recebem default:

```text
numeros[0] = 0
numeros[1] = 0
numeros[2] = 0
```

---

## Onde Java aplica default values

Java aplica default values em:

```text
campos de instância;
campos estáticos;
elementos de arrays.
```

Java não aplica default values para uso de:

```text
variáveis locais não inicializadas.
```

Exemplo de campo:

```java
class Cliente {
    String nome;
    int idade;
}
```

Exemplo de campo estático:

```java
static int contador;
```

Exemplo de array:

```java
int[] valores = new int[10];
```

Exemplo de variável local que não pode ser usada sem inicializar:

```java
int quantidade;
System.out.println(quantidade);
```

---

## Por que variáveis locais não têm default para uso

Variável local não pode ser usada sem inicialização porque Java quer evitar erro lógico.

Exemplo:

```java
public static void processar(boolean aprovado) {
    String status;

    if (aprovado) {
        status = "APROVADO";
    }

    System.out.println(status);
}
```

Se `aprovado` for `false`, `status` nunca recebe valor.

Java impede isso na compilação.

Correção:

```java
public static void processar(boolean aprovado) {
    String status = "RECUSADO";

    if (aprovado) {
        status = "APROVADO";
    }

    System.out.println(status);
}
```

Ou:

```java
public static void processar(boolean aprovado) {
    String status;

    if (aprovado) {
        status = "APROVADO";
    } else {
        status = "RECUSADO";
    }

    System.out.println(status);
}
```

Essa regra evita muitos bugs.

---

## Por que campos têm default

Campos pertencem a objetos ou classes.

Quando um objeto é criado, Java precisa deixar esse objeto em um estado inicial válido em memória.

Exemplo:

```java
Cliente cliente = new Cliente();
```

A JVM aloca memória para o objeto `Cliente`.

Os campos recebem valores padrão.

Depois, você pode preencher:

```java
cliente.nome = "Ana";
cliente.idade = 30;
cliente.ativo = true;
```

Se você não preencher, os defaults continuam.

Isso não significa que os defaults são sempre regra de negócio correta.

Significa apenas que são valores iniciais técnicos.

---

## Default técnico versus valor de negócio

Esse ponto é essencial.

Valor padrão técnico não é necessariamente valor válido para o negócio.

Exemplo:

```java
int estoque;
```

Default:

```text
0.
```

Mas `0` pode significar:

```text
estoque zerado de verdade;
ou campo não preenchido;
ou dado esquecido;
ou produto recém-criado sem inicialização.
```

Exemplo:

```java
boolean ativo;
```

Default:

```text
false.
```

Mas `false` pode significar:

```text
produto inativo de verdade;
ou campo não preenchido;
ou cadastro incompleto;
ou erro de inicialização.
```

Por isso, em código profissional, muitas vezes inicializamos explicitamente.

---

## Inicialização explícita

Inicialização explícita é dar valor de propósito.

Exemplo:

```java
class Produto {
    String nome = "";
    int estoque = 0;
    boolean ativo = true;
}
```

Ou no código:

```java
Produto produto = new Produto();

produto.nome = "Cadeira";
produto.estoque = 10;
produto.ativo = true;
```

Inicializar explicitamente melhora leitura porque mostra intenção.

Compare:

```java
boolean ativo;
```

com:

```java
boolean ativo = true;
```

No segundo caso, fica claro que o estado inicial esperado é ativo.

---

## Vocabulário essencial

Termos desta aula:

```text
default value;
valor padrão;
inicialização;
inicialização explícita;
campo;
campo de instância;
campo estático;
variável local;
array;
elemento de array;
referência;
null;
zero;
false;
char nulo;
compilação;
erro de compilação;
estado inicial;
estado válido;
regra de negócio;
sentinela;
valor técnico;
valor de domínio;
construtor;
objeto incompleto;
NPE;
NullPointerException.
```

Termos mais importantes:

```text
campo -> variável pertencente a objeto ou classe;
variável local -> variável criada dentro de método ou bloco;
default value -> valor aplicado automaticamente a campos e elementos de arrays;
inicialização explícita -> valor definido pelo programador;
null -> ausência de referência;
objeto incompleto -> objeto criado, mas ainda sem dados obrigatórios;
valor técnico -> default da linguagem;
valor de negócio -> valor que faz sentido para a regra.
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        System.out.println("Nome: " + cliente.nome);
        System.out.println("Idade: " + cliente.idade);
        System.out.println("Ativo: " + cliente.ativo);
    }
}

class Cliente {
    String nome;
    int idade;
    boolean ativo;
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída esperada:

```text
Nome: null
Idade: 0
Ativo: false
```

Este é o exemplo base:

```text
campos recebem default values.
```

---

## Exemplo com todos os tipos principais

Arquivo:

```text
CamposDefaultValues.java
```

Código:

```java
public class CamposDefaultValues {
    public static void main(String[] args) {
        Defaults defaults = new Defaults();

        System.out.println("byte: " + defaults.valorByte);
        System.out.println("short: " + defaults.valorShort);
        System.out.println("int: " + defaults.valorInt);
        System.out.println("long: " + defaults.valorLong);
        System.out.println("float: " + defaults.valorFloat);
        System.out.println("double: " + defaults.valorDouble);
        System.out.println("boolean: " + defaults.valorBoolean);
        System.out.println("char como número: " + (int) defaults.valorChar);
        System.out.println("String: " + defaults.texto);
        System.out.println("Objeto: " + defaults.cliente);
    }
}

class Defaults {
    byte valorByte;
    short valorShort;
    int valorInt;
    long valorLong;
    float valorFloat;
    double valorDouble;
    boolean valorBoolean;
    char valorChar;
    String texto;
    Cliente cliente;
}

class Cliente {
    String nome;
}
```

Saída esperada:

```text
byte: 0
short: 0
int: 0
long: 0
float: 0.0
double: 0.0
boolean: false
char como número: 0
String: null
Objeto: null
```

O `char` default é `'\u0000'`.

Ele normalmente não aparece visualmente, por isso imprimimos como número.

---

## Campo estático com default

Arquivo:

```text
CampoEstaticoDefault.java
```

Código:

```java
public class CampoEstaticoDefault {
    static int contador;
    static boolean sistemaAtivo;
    static String usuarioAtual;

    public static void main(String[] args) {
        System.out.println("Contador: " + contador);
        System.out.println("Sistema ativo: " + sistemaAtivo);
        System.out.println("Usuário atual: " + usuarioAtual);
    }
}
```

Saída:

```text
Contador: 0
Sistema ativo: false
Usuário atual: null
```

Campos estáticos também recebem default.

Mas cuidado:

```text
campo estático é compartilhado pela classe;
não use como estado global sem necessidade.
```

---

## Variável local sem inicializar

Arquivo:

```text
ErroVariavelLocalSemInicializar.java
```

Código propositalmente errado:

```java
public class ErroVariavelLocalSemInicializar {
    public static void main(String[] args) {
        int quantidade;

        System.out.println(quantidade);
    }
}
```

Compile:

```powershell
javac ErroVariavelLocalSemInicializar.java
```

Resultado:

```text
erro de compilação.
```

Motivo:

```text
variável local quantidade pode não ter sido inicializada.
```

Correção:

```java
int quantidade = 0;
```

ou:

```java
int quantidade = 10;
```

---

## Variável local com caminho incompleto

Arquivo:

```text
ErroCaminhoIncompleto.java
```

Código propositalmente errado:

```java
public class ErroCaminhoIncompleto {
    public static void main(String[] args) {
        boolean aprovado = false;
        String status;

        if (aprovado) {
            status = "APROVADO";
        }

        System.out.println(status);
    }
}
```

O Java entende:

```text
se aprovado for false, status não recebe valor.
```

Correção com `else`:

```java
public class ErroCaminhoIncompleto {
    public static void main(String[] args) {
        boolean aprovado = false;
        String status;

        if (aprovado) {
            status = "APROVADO";
        } else {
            status = "RECUSADO";
        }

        System.out.println(status);
    }
}
```

Agora todos os caminhos atribuem valor.

---

## Array de primitivos com default

Arquivo:

```text
ArrayPrimitivosDefault.java
```

Código:

```java
public class ArrayPrimitivosDefault {
    public static void main(String[] args) {
        int[] quantidades = new int[3];
        double[] medias = new double[3];
        boolean[] ativos = new boolean[3];

        for (int indice = 0; indice < quantidades.length; indice++) {
            System.out.println("quantidades[" + indice + "]: " + quantidades[indice]);
        }

        for (int indice = 0; indice < medias.length; indice++) {
            System.out.println("medias[" + indice + "]: " + medias[indice]);
        }

        for (int indice = 0; indice < ativos.length; indice++) {
            System.out.println("ativos[" + indice + "]: " + ativos[indice]);
        }
    }
}
```

Saída:

```text
quantidades[0]: 0
quantidades[1]: 0
quantidades[2]: 0
medias[0]: 0.0
medias[1]: 0.0
medias[2]: 0.0
ativos[0]: false
ativos[1]: false
ativos[2]: false
```

Elementos de arrays recebem default values.

---

## Array de referências com default

Arquivo:

```text
ArrayReferenciasDefault.java
```

Código:

```java
public class ArrayReferenciasDefault {
    public static void main(String[] args) {
        String[] nomes = new String[3];
        Cliente[] clientes = new Cliente[3];

        for (int indice = 0; indice < nomes.length; indice++) {
            System.out.println("nomes[" + indice + "]: " + nomes[indice]);
        }

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println("clientes[" + indice + "]: " + clientes[indice]);
        }
    }
}

class Cliente {
    String nome;
}
```

Saída:

```text
nomes[0]: null
nomes[1]: null
nomes[2]: null
clientes[0]: null
clientes[1]: null
clientes[2]: null
```

Atenção:

```text
Cliente[] clientes = new Cliente[3];
```

cria o array.

Mas não cria três objetos `Cliente`.

Cria três posições com valor `null`.

---

## Erro comum com array de objetos

Arquivo:

```text
ErroArrayObjetosNull.java
```

Código propositalmente errado:

```java
public class ErroArrayObjetosNull {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[3];

        clientes[0].nome = "Ana";

        System.out.println(clientes[0].nome);
    }
}

class Cliente {
    String nome;
}
```

Esse código compila, mas quebra em execução.

Motivo:

```text
clientes[0] é null;
não existe objeto Cliente na posição 0;
não é possível acessar .nome.
```

Correção:

```java
clientes[0] = new Cliente();
clientes[0].nome = "Ana";
```

---

## Array de objetos corrigido

Arquivo:

```text
ArrayObjetosInicializado.java
```

Código:

```java
public class ArrayObjetosInicializado {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[3];

        clientes[0] = new Cliente();
        clientes[0].nome = "Ana";

        clientes[1] = new Cliente();
        clientes[1].nome = "Bruno";

        clientes[2] = new Cliente();
        clientes[2].nome = "Carla";

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice].nome);
        }
    }
}

class Cliente {
    String nome;
}
```

Agora cada posição do array aponta para um objeto.

Mapa:

```text
clientes -> array no heap
clientes[0] -> Cliente Ana
clientes[1] -> Cliente Bruno
clientes[2] -> Cliente Carla
```

---

## Inicializando array de objetos em loop

Arquivo:

```text
ArrayObjetosLoopInicializacao.java
```

Código:

```java
public class ArrayObjetosLoopInicializacao {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[3];

        for (int indice = 0; indice < clientes.length; indice++) {
            clientes[indice] = new Cliente();
            clientes[indice].nome = "Cliente " + (indice + 1);
        }

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice].nome);
        }
    }
}

class Cliente {
    String nome;
}
```

Esse padrão é útil quando todas as posições precisam ter objeto.

Mas nem sempre todo array de referências precisa estar totalmente preenchido.

Depende da regra.

---

## Default values em campos de objeto dentro de array

Arquivo:

```text
ArrayObjetosCamposDefault.java
```

Código:

```java
public class ArrayObjetosCamposDefault {
    public static void main(String[] args) {
        Produto[] produtos = new Produto[2];

        produtos[0] = new Produto();
        produtos[1] = new Produto();

        for (int indice = 0; indice < produtos.length; indice++) {
            System.out.println("Produto " + indice);
            System.out.println("Nome: " + produtos[indice].nome);
            System.out.println("Estoque: " + produtos[indice].estoque);
            System.out.println("Ativo: " + produtos[indice].ativo);
            System.out.println("--------------------");
        }
    }
}

class Produto {
    String nome;
    int estoque;
    boolean ativo;
}
```

Saída:

```text
Nome: null
Estoque: 0
Ativo: false
```

Mesmo quando o objeto existe, seus campos podem estar com default values.

Isso pode indicar objeto incompleto.

---

## Objeto incompleto

Objeto incompleto é um objeto criado, mas sem dados necessários para a regra.

Exemplo:

```java
Produto produto = new Produto();
```

Campos:

```text
nome = null;
estoque = 0;
ativo = false.
```

Isso pode ser tecnicamente válido para Java.

Mas pode ser inválido para o negócio.

Exemplo de regra:

```text
produto precisa ter nome;
produto novo deve iniciar ativo;
estoque não pode ser negativo;
estoque 0 pode ser válido, mas precisa ser decisão explícita.
```

Por isso, não confunda:

```text
objeto criado
```

com:

```text
objeto válido.
```

---

## Inicialização explícita em método fábrica simples

Ainda sem entrar profundamente em padrões, podemos criar método que monta objeto válido.

Arquivo:

```text
ProdutoInicializacaoExplicita.java
```

Código:

```java
public class ProdutoInicializacaoExplicita {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", 10);

        System.out.println("Nome: " + produto.nome);
        System.out.println("Estoque: " + produto.estoque);
        System.out.println("Ativo: " + produto.ativo);
    }

    public static Produto criarProduto(String nome, int estoque) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.estoque = estoque;
        produto.ativo = true;

        return produto;
    }
}

class Produto {
    String nome;
    int estoque;
    boolean ativo;
}
```

Agora fica claro:

```text
produto novo começa ativo.
```

Isso é regra de negócio explícita, não default acidental.

---

## Default value false pode ser perigoso

Exemplo:

```java
class Usuario {
    boolean administrador;
}
```

Default:

```text
false.
```

Nesse caso, default `false` pode ser seguro.

Mas outro exemplo:

```java
class Produto {
    boolean ativo;
}
```

Default:

```text
false.
```

Se todo produto novo deveria nascer ativo, o default pode causar bug.

Outro exemplo:

```java
class Mensagem {
    boolean enviada;
}
```

Default `false` pode fazer sentido.

Conclusão:

```text
o valor padrão precisa ser avaliado no contexto do domínio.
```

---

## Default value zero pode ser perigoso

Exemplo:

```java
class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

Defaults:

```text
valorCentavos = 0;
parcelas = 0.
```

Se você calcular:

```java
valorCentavos / parcelas
```

terá erro por divisão por zero.

Ou se gravar pagamento com valor 0 sem validação, terá inconsistência.

Default `0` não significa dado correto.

Significa apenas valor inicial técnico.

---

## Exemplo aplicado: pagamento incompleto

Arquivo:

```text
PagamentoDefaultPerigoso.java
```

Código:

```java
public class PagamentoDefaultPerigoso {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento();

        if (pagamento.parcelas == 0) {
            System.out.println("Pagamento inválido: parcelas não informadas.");
        } else {
            long parcela = pagamento.valorCentavos / pagamento.parcelas;
            System.out.println("Parcela: " + parcela);
        }
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

Esse exemplo mostra que default `0` precisa ser tratado.

---

## Exemplo aplicado: pagamento válido

Arquivo:

```text
PagamentoInicializado.java
```

Código:

```java
public class PagamentoInicializado {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento(10000L, 4);

        long parcela = calcularParcela(pagamento);

        System.out.println("Parcela: " + parcela);
    }

    public static Pagamento criarPagamento(long valorCentavos, int parcelas) {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = valorCentavos;
        pagamento.parcelas = parcelas;

        return pagamento;
    }

    public static long calcularParcela(Pagamento pagamento) {
        if (pagamento.parcelas <= 0) {
            return 0L;
        }

        return pagamento.valorCentavos / pagamento.parcelas;
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

A diferença é:

```text
objeto foi criado e preenchido antes de uso.
```

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoDefaultValues.java
```

Código:

```java
public class PedidoDefaultValues {
    public static void main(String[] args) {
        Pedido pedido = new Pedido();

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Valor: " + pedido.valorCentavos);
        System.out.println("Status: " + pedido.status);
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Saída:

```text
Cliente: null
Valor: 0
Status: null
```

Um pedido assim está tecnicamente criado.

Mas não está pronto para regra de negócio.

---

## Pedido com inicialização explícita

Arquivo:

```text
PedidoInicializado.java
```

Código:

```java
public class PedidoInicializado {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", 1000L);

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Valor: " + pedido.valorCentavos);
        System.out.println("Status: " + pedido.status);
    }

    public static Pedido criarPedido(String cliente, long valorCentavos) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.valorCentavos = valorCentavos;
        pedido.status = "PENDENTE";

        return pedido;
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Agora fica clara a regra:

```text
todo pedido novo começa PENDENTE.
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoDefaultValues.java
```

Código:

```java
public class OrdemServicoDefaultValues {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico();

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Status: " + os.status);
        System.out.println("Atividades: " + os.quantidadeAtividades);
        System.out.println("Urgente: " + os.urgente);
    }
}

class OrdemServico {
    String certificado;
    String status;
    int quantidadeAtividades;
    boolean urgente;
}
```

Saída:

```text
Certificado: null
Status: null
Atividades: 0
Urgente: false
```

Isso pode ser um estado inicial técnico, mas não necessariamente válido.

---

## OS inicializada

Arquivo:

```text
OrdemServicoInicializada.java
```

Código:

```java
public class OrdemServicoInicializada {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", 3);

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Status: " + os.status);
        System.out.println("Atividades: " + os.quantidadeAtividades);
        System.out.println("Urgente: " + os.urgente);
    }

    public static OrdemServico criarOs(String certificado, int quantidadeAtividades) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.status = "ABERTA";
        os.quantidadeAtividades = quantidadeAtividades;
        os.urgente = false;

        return os;
    }
}

class OrdemServico {
    String certificado;
    String status;
    int quantidadeAtividades;
    boolean urgente;
}
```

A inicialização deixa a regra explícita:

```text
OS nova começa ABERTA;
urgente começa false por decisão;
quantidade vem de entrada.
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensagemDefaultValues.java
```

Código:

```java
public class MensagemDefaultValues {
    public static void main(String[] args) {
        Mensagem mensagem = new Mensagem();

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tipo: " + mensagem.tipo);
        System.out.println("Tentativas: " + mensagem.tentativas);
        System.out.println("Enviada: " + mensagem.enviada);
    }
}

class Mensagem {
    String cliente;
    String tipo;
    int tentativas;
    boolean enviada;
}
```

Saída:

```text
Cliente: null
Tipo: null
Tentativas: 0
Enviada: false
```

Alguns defaults podem fazer sentido:

```text
tentativas = 0;
enviada = false.
```

Outros não:

```text
cliente = null;
tipo = null.
```

Por isso, cada campo precisa ser analisado.

---

## Mensagem inicializada

Arquivo:

```text
MensagemInicializada.java
```

Código:

```java
public class MensagemInicializada {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "ENTREGA");

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tipo: " + mensagem.tipo);
        System.out.println("Tentativas: " + mensagem.tentativas);
        System.out.println("Enviada: " + mensagem.enviada);
    }

    public static Mensagem criarMensagem(String cliente, String tipo) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.tipo = tipo;
        mensagem.tentativas = 0;
        mensagem.enviada = false;

        return mensagem;
    }
}

class Mensagem {
    String cliente;
    String tipo;
    int tentativas;
    boolean enviada;
}
```

Aqui alguns defaults foram repetidos explicitamente.

Isso pode ser bom para documentação da intenção:

```text
mensagem nova começa com zero tentativas e ainda não enviada.
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaDefaultValues.java
```

Código:

```java
public class AuditoriaDefaultValues {
    public static void main(String[] args) {
        RegistroAuditoria registro = new RegistroAuditoria();

        System.out.println("Usuário: " + registro.usuario);
        System.out.println("Operação: " + registro.operacao);
        System.out.println("Status: " + registro.status);
        System.out.println("Tentativa: " + registro.tentativa);
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
    int tentativa;
}
```

Saída:

```text
Usuário: null
Operação: null
Status: null
Tentativa: 0
```

Um registro de auditoria sem usuário, operação e status é inválido para quase qualquer sistema.

---

## Auditoria inicializada

Arquivo:

```text
AuditoriaInicializada.java
```

Código:

```java
public class AuditoriaInicializada {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "CRIACAO");

        System.out.println("Usuário: " + registro.usuario);
        System.out.println("Operação: " + registro.operacao);
        System.out.println("Status: " + registro.status);
        System.out.println("Tentativa: " + registro.tentativa);
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.status = "PENDENTE";
        registro.tentativa = 1;

        return registro;
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
    int tentativa;
}
```

Agora o registro nasce com intenção clara:

```text
status inicial PENDENTE;
tentativa inicial 1.
```

---

## Refatoração: de default acidental para inicialização explícita

Código fraco:

```java
Pedido pedido = new Pedido();

pedido.cliente = "Ana";
```

Depois o sistema usa:

```java
pedido.status
```

mas ninguém preencheu `status`.

Resultado:

```text
null.
```

Refatoração:

```java
Pedido pedido = criarPedido("Ana", 1000L);
```

com:

```java
public static Pedido criarPedido(String cliente, long valorCentavos) {
    Pedido pedido = new Pedido();

    pedido.cliente = cliente;
    pedido.valorCentavos = valorCentavos;
    pedido.status = "PENDENTE";

    return pedido;
}
```

Vantagem:

```text
o objeto nasce mais completo;
a regra fica centralizada;
reduz chance de esquecer campo;
facilita debug;
facilita teste.
```

---

## Refatoração: validar antes de criar

Às vezes, é melhor validar entradas antes de preencher objeto.

Exemplo:

```java
public static Pedido criarPedido(String cliente, long valorCentavos) {
    if (cliente == null || cliente.isBlank()) {
        return null;
    }

    if (valorCentavos <= 0) {
        return null;
    }

    Pedido pedido = new Pedido();

    pedido.cliente = cliente.trim();
    pedido.valorCentavos = valorCentavos;
    pedido.status = "PENDENTE";

    return pedido;
}
```

Nesta fase, retornar `null` ainda é simples, mas exige cuidado.

Quem chama precisa validar:

```java
Pedido pedido = criarPedido("Ana", 1000L);

if (pedido != null) {
    System.out.println(pedido.status);
}
```

Na próxima aula, estudaremos `null` e `NullPointerException` com mais profundidade.

---

## Refatoração: evitar null quando possível

Em alguns casos, podemos retornar objeto com status de erro?

Ainda não temos classes robustas para isso.

Mas já podemos evitar `null` em textos:

```java
public static String normalizarStatus(String status) {
    if (status == null || status.isBlank()) {
        return "NAO_INFORMADO";
    }

    return status.trim().toUpperCase();
}
```

Isso é uma decisão de regra.

Nem sempre é correto.

Mas mostra que inicialização precisa ser pensada.

Pergunta profissional:

```text
é melhor deixar null, usar valor padrão ou bloquear criação?
```

A resposta depende da regra de negócio.

---

## Inicialização em construtor

Ainda vamos estudar construtores com profundidade em aula própria.

Mas é importante ver que eles existem para inicialização de objetos.

Exemplo inicial:

```java
class Cliente {
    String nome;
    boolean ativo;

    Cliente(String nome) {
        this.nome = nome;
        this.ativo = true;
    }
}
```

Uso:

```java
Cliente cliente = new Cliente("Ana");
```

Agora o objeto já nasce inicializado.

Nesta aula, não vamos aprofundar `this`.

Guarde apenas:

```text
construtor é um caminho profissional para inicializar objeto.
```

Por enquanto, continuaremos usando métodos fábrica simples e preenchimento manual para fixar os conceitos.

---

## Inicialização de campos no próprio campo

Exemplo:

```java
class Configuracao {
    int limiteTentativas = 3;
    boolean ativo = true;
    String ambiente = "LOCAL";
}
```

Isso é permitido.

Quando o objeto nasce, esses valores são aplicados.

Arquivo:

```text
InicializacaoNoCampo.java
```

Código:

```java
public class InicializacaoNoCampo {
    public static void main(String[] args) {
        Configuracao configuracao = new Configuracao();

        System.out.println("Limite: " + configuracao.limiteTentativas);
        System.out.println("Ativo: " + configuracao.ativo);
        System.out.println("Ambiente: " + configuracao.ambiente);
    }
}

class Configuracao {
    int limiteTentativas = 3;
    boolean ativo = true;
    String ambiente = "LOCAL";
}
```

Saída:

```text
Limite: 3
Ativo: true
Ambiente: LOCAL
```

Aqui não dependemos dos defaults técnicos.

Definimos defaults de negócio.

---

## Diferença entre default técnico e default de negócio

Default técnico é da linguagem:

```text
int -> 0;
boolean -> false;
referência -> null.
```

Default de negócio é uma decisão:

```text
pedido novo -> PENDENTE;
produto novo -> ATIVO;
limite de tentativas -> 3;
ambiente padrão -> LOCAL;
mensagem nova -> enviada false;
auditoria nova -> PENDENTE.
```

Default técnico acontece automaticamente.

Default de negócio deve ser escrito no código.

---

## Leitura crítica de campos booleanos

Boolean sem inicialização começa `false`.

Isso pode esconder erro.

Exemplo:

```java
class Contrato {
    boolean aprovado;
}
```

Quando `aprovado == false`, significa:

```text
contrato reprovado?
contrato ainda não analisado?
contrato criado sem preencher?
```

Às vezes, dois estados não são suficientes.

Pode ser melhor usar `String status` inicialmente:

```java
status = "PENDENTE";
```

No futuro, usaremos `enum`.

Por enquanto, entenda:

```text
boolean default false pode ser simples demais para alguns domínios.
```

---

## Leitura crítica de números zero

Número zero pode ser valor real ou ausência de preenchimento.

Exemplo:

```java
class OrdemServico {
    int quantidadeAtividades;
}
```

`0` pode significar:

```text
não tem atividades;
ainda não carregou atividades;
erro na importação;
objeto recém-criado.
```

Se a regra precisa diferenciar, use inicialização explícita ou outro campo auxiliar.

Exemplo didático:

```java
boolean atividadesCarregadas;
```

Mas cuidado para não complicar cedo demais.

A principal lição:

```text
não assuma que 0 sempre significa dado válido.
```

---

## Erros comuns

### Erro 1 — Achar que variável local recebe default

Não recebe para uso.

Variável local precisa ser inicializada.

---

### Erro 2 — Achar que array de objetos cria os objetos

```java
Cliente[] clientes = new Cliente[3];
```

cria array com três posições `null`.

Não cria três clientes.

---

### Erro 3 — Acessar campo de posição null

```java
clientes[0].nome = "Ana";
```

quebra se `clientes[0] == null`.

---

### Erro 4 — Confundir default técnico com regra de negócio

`false`, `0` e `null` podem não ser estados válidos para o domínio.

---

### Erro 5 — Usar campo boolean sem pensar nos estados

Às vezes, `PENDENTE`, `APROVADO`, `RECUSADO` é melhor que `boolean aprovado`.

---

### Erro 6 — Contar posições vazias de array como dados reais

Se array numérico começa com zeros, cuidado para não contar zeros não preenchidos.

Use contador de quantidade válida.

---

### Erro 7 — Não inicializar campos obrigatórios

Objeto nasce, mas fica incompleto.

---

### Erro 8 — Retornar null sem validar no chamador

Se método pode retornar `null`, quem chama precisa verificar.

---

### Erro 9 — Inicializar tudo com valores falsos só para compilar

Não coloque qualquer valor só para tirar erro.

Inicialize com intenção.

---

### Erro 10 — Esquecer que String default é null, não texto vazio

Campo `String` não inicializado começa `null`.

Não começa `""`.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugDefaultValues {
    public static void main(String[] args) {
        Pedido pedido = new Pedido();

        pedido.cliente = "Ana";

        System.out.println(pedido.cliente);
        System.out.println(pedido.valorCentavos);
        System.out.println(pedido.status);
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Coloque breakpoint após:

```java
Pedido pedido = new Pedido();
```

Observe:

```text
cliente = null;
valorCentavos = 0;
status = null.
```

Depois avance:

```java
pedido.cliente = "Ana";
```

Observe:

```text
cliente = Ana;
valorCentavos continua 0;
status continua null.
```

Esse debug mostra objeto incompleto.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-065-default-values-inicializacao
cd labs\m2\aula-065-default-values-inicializacao
```

Crie arquivos:

```text
Main.java
CamposDefaultValues.java
CampoEstaticoDefault.java
ErroVariavelLocalSemInicializar.java
ErroCaminhoIncompleto.java
ArrayPrimitivosDefault.java
ArrayReferenciasDefault.java
ErroArrayObjetosNull.java
ArrayObjetosInicializado.java
ArrayObjetosLoopInicializacao.java
ArrayObjetosCamposDefault.java
ProdutoInicializacaoExplicita.java
PagamentoDefaultPerigoso.java
PagamentoInicializado.java
PedidoDefaultValues.java
PedidoInicializado.java
OrdemServicoDefaultValues.java
OrdemServicoInicializada.java
MensagemDefaultValues.java
MensagemInicializada.java
AuditoriaDefaultValues.java
AuditoriaInicializada.java
InicializacaoNoCampo.java
DebugDefaultValues.java
ErroBooleanDefaultRegra.java
ErroZerosArrayVazios.java
ErroStringNullNaoVazia.java
README.md
```

Compile os válidos:

```powershell
javac Main.java
javac CamposDefaultValues.java
javac CampoEstaticoDefault.java
javac ArrayPrimitivosDefault.java
javac ArrayReferenciasDefault.java
javac ArrayObjetosInicializado.java
javac ArrayObjetosLoopInicializacao.java
javac ArrayObjetosCamposDefault.java
javac ProdutoInicializacaoExplicita.java
javac PagamentoDefaultPerigoso.java
javac PagamentoInicializado.java
javac PedidoDefaultValues.java
javac PedidoInicializado.java
javac OrdemServicoDefaultValues.java
javac OrdemServicoInicializada.java
javac MensagemDefaultValues.java
javac MensagemInicializada.java
javac AuditoriaDefaultValues.java
javac AuditoriaInicializada.java
javac InicializacaoNoCampo.java
javac DebugDefaultValues.java
javac ErroBooleanDefaultRegra.java
javac ErroZerosArrayVazios.java
javac ErroStringNullNaoVazia.java
```

Compile os arquivos de erro proposital separadamente e observe:

```powershell
javac ErroVariavelLocalSemInicializar.java
javac ErroCaminhoIncompleto.java
javac ErroArrayObjetosNull.java
```

Execute os válidos:

```powershell
java Main
java CamposDefaultValues
java CampoEstaticoDefault
java ArrayPrimitivosDefault
java ArrayReferenciasDefault
java ArrayObjetosInicializado
java ArrayObjetosLoopInicializacao
java ArrayObjetosCamposDefault
java ProdutoInicializacaoExplicita
java PagamentoDefaultPerigoso
java PagamentoInicializado
java PedidoDefaultValues
java PedidoInicializado
java OrdemServicoDefaultValues
java OrdemServicoInicializada
java MensagemDefaultValues
java MensagemInicializada
java AuditoriaDefaultValues
java AuditoriaInicializada
java InicializacaoNoCampo
java DebugDefaultValues
java ErroBooleanDefaultRegra
java ErroZerosArrayVazios
java ErroStringNullNaoVazia
```

Alguns exemplos devem quebrar de propósito ou demonstrar comportamento perigoso.

Use para diagnóstico.

---

## Observações

- Não confundir objeto criado com objeto válido.
- Não usar valor só para compilar.
- Inicializar com intenção.
- Validar `null` antes de acessar métodos ou campos.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m2/aula-065-default-values-inicializacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 065: pratica default values e inicializacao em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar default value;
listar defaults dos principais tipos;
explicar campos de instância;
explicar campos estáticos;
explicar variáveis locais;
explicar arrays de primitivos;
explicar arrays de referências;
explicar array de objetos;
explicar que posição de array de objeto começa null;
provocar erro de variável local sem inicialização;
corrigir variável local sem inicialização;
provocar erro em array de objetos null;
corrigir array de objetos com new por posição;
explicar String default null;
explicar boolean default false;
explicar número default zero;
diferenciar default técnico de default de negócio;
identificar objeto incompleto;
inicializar produto;
inicializar pedido;
inicializar pagamento;
inicializar OS;
inicializar mensagem;
inicializar auditoria;
usar debug para observar defaults;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar construtores profundamente.

Não precisa ainda dominar `this` profundamente.

Não precisa ainda dominar encapsulamento.

Não precisa ainda dominar builders.

Não precisa ainda dominar `Optional`.

Não precisa ainda dominar Bean Validation.

Esses assuntos virão depois.

O objetivo é dominar valores padrão e saber quando inicializar explicitamente.

---

## Fechamento da aula

Hoje estudamos default values e inicialização.

A ideia central foi:

```text
campos e elementos de arrays recebem valores padrão; variáveis locais precisam ser inicializadas antes de uso.
```

Vimos que:

```text
int começa 0;
long começa 0L;
double começa 0.0;
boolean começa false;
char começa '\u0000';
referência começa null;
array de objetos começa com posições null;
objeto criado pode estar incompleto;
default técnico não é necessariamente regra de negócio.
```

O ponto mais importante é:

```text
não confunda valor padrão da linguagem com valor correto para o domínio.
```

Na próxima aula, vamos estudar:

```text
Null e NullPointerException.
```

A próxima aula vai aprofundar por que `null` existe, como `NullPointerException` acontece, como diagnosticar, como validar e como reduzir riscos em código Java.
