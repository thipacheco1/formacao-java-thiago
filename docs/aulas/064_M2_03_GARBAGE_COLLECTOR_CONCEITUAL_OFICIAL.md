# 064 — M2.03 — Garbage Collector Conceitual

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
061 — M1.41 — Mini projeto Calculadora Profissional Console;
062 — M2.01 — JVM, bytecode e execução por baixo;
063 — M2.02 — Stack, heap e referências;
064 — M2.03 — Garbage Collector conceitual.
```

Na aula anterior, aprendemos:

```text
variáveis locais e parâmetros vivem em frames da stack;
objetos e arrays vivem no heap;
referências apontam para objetos no heap;
duas referências podem apontar para o mesmo objeto;
null significa ausência de referência;
objeto sem referência alcançável fica inacessível.
```

Agora vamos estudar o que acontece com objetos que não são mais alcançáveis.

Exemplo:

```java
public static void criarCliente() {
    Cliente cliente = new Cliente();
    cliente.nome = "Ana";
}
```

Quando o método termina, a variável local `cliente` deixa de existir.

Se ninguém mais aponta para aquele objeto `Cliente`, ele fica inacessível.

A pergunta é:

```text
quem libera essa memória?
```

Em Java, quem cuida disso é o:

```text
Garbage Collector.
```

Em português:

```text
coletor de lixo.
```

---

## A pergunta central da aula

Quando criamos objetos:

```java
Cliente cliente = new Cliente();
Pedido pedido = new Pedido();
int[] valores = new int[1000];
StringBuilder texto = new StringBuilder();
```

eles ocupam memória no heap.

Mas, em algum momento, alguns objetos deixam de ser usados.

Exemplo:

```java
public static void processar() {
    Pedido pedido = new Pedido();

    pedido.cliente = "Ana";
    pedido.status = "PENDENTE";
}
```

Quando `processar` termina, a variável local `pedido` some.

Se nenhuma outra referência aponta para esse objeto, ele não pode mais ser usado pelo programa.

Então ele é considerado:

```text
elegível para coleta de lixo.
```

Isso não significa que será removido imediatamente.

Significa que o Garbage Collector pode liberar essa memória em algum momento.

Essa diferença é importante:

```text
elegível para coleta != removido imediatamente.
```

---

## O que é Garbage Collector

Garbage Collector, ou GC, é o mecanismo da JVM responsável por identificar objetos que não são mais alcançáveis e liberar a memória ocupada por eles.

Ele existe porque, em Java, o programador normalmente não libera memória manualmente.

Em algumas linguagens, o desenvolvedor precisa pedir explicitamente para liberar memória.

Em Java, a JVM gerencia isso automaticamente.

Mas automático não significa mágico.

O desenvolvedor ainda precisa escrever código que não mantenha referências desnecessárias.

Exemplo:

```java
static Pedido pedidoGlobal;
```

Se esse campo estático continua apontando para um objeto, o GC não pode coletar esse objeto.

Porque ele ainda é alcançável.

---

## Por que Garbage Collector existe

GC existe para reduzir erros comuns de gerenciamento manual de memória.

Sem GC, o desenvolvedor poderia cometer problemas como:

```text
esquecer de liberar memória;
liberar memória cedo demais;
usar objeto depois de liberar;
liberar duas vezes;
vazar memória continuamente;
corromper acesso à memória.
```

Em Java, o GC ajuda a evitar muitos desses problemas.

O programador cria objetos.

A JVM monitora objetos que ainda podem ser acessados.

Objetos que não podem mais ser acessados podem ter memória liberada.

Isso facilita muito o desenvolvimento de aplicações grandes.

Mas o programador ainda é responsável por:

```text
não manter referências sem necessidade;
não criar caches infinitos;
não guardar objetos em listas eternas;
fechar recursos externos quando necessário;
entender sintomas de pressão de memória.
```

GC cuida de memória de objetos no heap.

GC não é desculpa para descuidar do ciclo de vida dos dados.

---

## Vocabulário essencial

Termos desta aula:

```text
Garbage Collector;
GC;
heap;
objeto;
referência;
objeto alcançável;
objeto não alcançável;
objeto elegível para coleta;
memória liberada;
vazamento de memória;
memory leak;
pressão de memória;
referência ativa;
referência perdida;
campo estático;
cache;
lista crescente;
array;
null;
escopo;
stack frame;
System.gc;
coleta;
pausa;
sintoma;
diagnóstico;
profiling;
recurso externo.
```

Termos mais importantes:

```text
objeto alcançável -> objeto que ainda pode ser acessado a partir de alguma referência viva;
objeto elegível para coleta -> objeto que não é mais alcançável;
GC -> mecanismo que libera memória de objetos não alcançáveis;
vazamento de memória em Java -> objetos ainda alcançáveis sem necessidade, impedindo coleta;
pressão de memória -> situação em que a aplicação cria ou mantém muitos objetos e força maior trabalho de memória;
referência ativa -> referência que ainda aponta para um objeto;
referência perdida -> referência local que deixou de existir ou foi sobrescrita;
cache sem limite -> estrutura que guarda dados indefinidamente e pode causar crescimento de memória.
```

---

## Objeto alcançável

Um objeto é alcançável quando existe algum caminho de referências que permite chegar até ele.

Exemplo:

```java
public class Main {
    static Cliente clienteGlobal;

    public static void main(String[] args) {
        clienteGlobal = new Cliente();

        clienteGlobal.nome = "Ana";
    }
}

class Cliente {
    String nome;
}
```

O objeto `Cliente` é alcançável porque:

```text
Main.clienteGlobal -> objeto Cliente.
```

Enquanto esse campo estático apontar para o objeto, o GC não deve coletá-lo.

Ele ainda pode ser usado.

---

## Objeto não alcançável

Objeto não alcançável é aquele que não tem mais nenhuma referência viva apontando para ele.

Exemplo:

```java
public static void criarCliente() {
    Cliente cliente = new Cliente();

    cliente.nome = "Ana";
}
```

Quando o método termina:

```text
a variável local cliente deixa de existir;
se ninguém recebeu essa referência;
o objeto Cliente fica inacessível;
ele se torna elegível para coleta.
```

O objeto pode estar fisicamente no heap por algum tempo.

Mas o programa não consegue mais acessá-lo.

Por isso o GC pode liberar a memória.

---

## Elegível para coleta não é coleta imediata

Esta frase precisa ficar fixa:

```text
objeto elegível para coleta não significa objeto removido imediatamente.
```

O GC decide quando coletar.

A JVM considera fatores como:

```text
necessidade de memória;
tipo de coletor;
estado do heap;
atividade da aplicação;
estratégia do runtime.
```

Então, quando um objeto fica sem referência, você não deve assumir que a memória será liberada exatamente naquele instante.

Você deve assumir apenas:

```text
ele pode ser coletado quando o GC decidir.
```

Isso é suficiente para a maioria dos códigos de aplicação.

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
        criarCliente();

        System.out.println("Método finalizado.");
    }

    public static void criarCliente() {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";

        System.out.println("Cliente criado: " + cliente.nome);
    }
}

class Cliente {
    String nome;
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

Saída:

```text
Cliente criado: Ana
Método finalizado.
```

Mapa mental:

```text
criarCliente cria objeto Cliente no heap;
cliente é variável local no frame de criarCliente;
quando criarCliente termina, o frame sai da stack;
a variável local cliente some;
se ninguém mais aponta para o objeto, ele fica elegível para coleta.
```

---

## Exemplo com objeto retornado

Arquivo:

```text
ObjetoRetornadoNaoElegivel.java
```

Código:

```java
public class ObjetoRetornadoNaoElegivel {
    public static void main(String[] args) {
        Cliente cliente = criarCliente();

        System.out.println("Cliente no main: " + cliente.nome);
    }

    public static Cliente criarCliente() {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

Neste caso, o objeto não fica elegível ao final de `criarCliente`.

Por quê?

Porque a referência foi retornada e guardada no `main`:

```java
Cliente cliente = criarCliente();
```

Mapa:

```text
criarCliente cria objeto;
retorna referência;
main guarda referência;
objeto continua alcançável.
```

Enquanto o `main` usa `cliente`, o objeto está alcançável.

---

## Exemplo com referência sobrescrita

Arquivo:

```text
ReferenciaSobrescrita.java
```

Código:

```java
public class ReferenciaSobrescrita {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();
        cliente.nome = "Ana";

        cliente = new Cliente();
        cliente.nome = "Bruno";

        System.out.println("Cliente atual: " + cliente.nome);
    }
}

class Cliente {
    String nome;
}
```

O que aconteceu?

```text
primeiro objeto Cliente -> nome Ana;
variável cliente apontava para Ana;
depois cliente passou a apontar para novo objeto Bruno;
se nenhuma outra referência aponta para Ana, o objeto Ana ficou elegível para coleta.
```

Saída:

```text
Cliente atual: Bruno
```

O objeto de Ana não é mais acessível.

---

## Exemplo com null

Arquivo:

```text
ReferenciaNullGc.java
```

Código:

```java
public class ReferenciaNullGc {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";

        System.out.println("Antes de null: " + cliente.nome);

        cliente = null;

        System.out.println("Referência removida.");
    }
}

class Cliente {
    String nome;
}
```

Quando fazemos:

```java
cliente = null;
```

a variável deixa de apontar para o objeto.

Se nenhuma outra referência aponta para ele, o objeto fica elegível para coleta.

Atenção:

```text
usar null pode ajudar a remover uma referência;
mas não deve virar hábito de sair anulando tudo sem necessidade.
```

Na maioria dos casos, escopo bem definido já resolve.

---

## Escopo e elegibilidade

Escopo ajuda o GC indiretamente.

Exemplo:

```java
public static void processarPedido() {
    Pedido pedido = new Pedido();

    pedido.status = "PENDENTE";
}
```

Quando o método termina, a referência local deixa de existir.

Se o objeto não foi retornado nem guardado em outro lugar, ele fica elegível.

Por isso, variáveis locais com escopo pequeno ajudam naturalmente.

Código com escopo desnecessariamente grande pode manter objetos vivos por mais tempo.

Exemplo:

```java
public static void main(String[] args) {
    Pedido pedido = criarPedido();

    executarVariasEtapas();

    System.out.println("Fim");
}
```

Se `pedido` não é mais usado depois de certa etapa, mas continua referenciado, ele pode permanecer alcançável até o fim do escopo.

Na prática, a JVM pode ter otimizações, mas como regra de design:

```text
não mantenha referência sem necessidade.
```

---

## System.gc()

Existe um método:

```java
System.gc();
```

Ele sugere para a JVM executar o Garbage Collector.

Mas ele não garante coleta imediata.

Não use `System.gc()` como solução normal de aplicação.

Exemplo didático:

```java
public class ChamadaSystemGc {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente = null;

        System.gc();

        System.out.println("GC solicitado, mas não garantido imediatamente.");
    }
}

class Cliente {
    String nome;
}
```

Mensagem importante:

```text
System.gc() é uma solicitação, não uma ordem absoluta para liberar memória naquele instante.
```

Em código profissional comum, evite depender disso.

---

## Garbage Collector não fecha recurso externo automaticamente

GC cuida da memória de objetos no heap.

Mas recursos externos precisam de cuidado.

Exemplos de recursos externos:

```text
arquivo aberto;
conexão de banco;
socket;
stream;
conexão HTTP;
handle do sistema operacional.
```

Mesmo que um objeto fique elegível para coleta, você não deve depender do GC para fechar recursos externos.

No futuro, estudaremos:

```text
try-with-resources;
AutoCloseable;
fechamento de conexão;
pool de conexões;
transações.
```

Por enquanto, guarde:

```text
memória de objeto é uma coisa;
recurso externo é outra.
```

---

## Vazamento de memória em Java

Muita gente acha que, por ter GC, Java não tem vazamento de memória.

Tem sim.

Mas o vazamento costuma ser diferente de linguagens com liberação manual.

Em Java, vazamento de memória geralmente significa:

```text
objetos que não são mais úteis continuam alcançáveis por alguma referência.
```

Exemplo comum:

```text
lista que só cresce;
cache sem limite;
map estático acumulando dados;
listener não removido;
thread mantendo referência;
fila que nunca esvazia;
array guardando objetos antigos.
```

O GC olha e pensa:

```text
esse objeto ainda é alcançável, então não posso coletar.
```

Mesmo que, para a regra de negócio, ele já não seja necessário.

---

## Exemplo de lista crescendo sem limite

Ainda não aprofundamos Collections, mas podemos usar um array para simular.

Arquivo:

```text
HistoricoCrescendoConceitual.java
```

Código:

```java
public class HistoricoCrescendoConceitual {
    public static void main(String[] args) {
        Pedido[] historico = new Pedido[5];

        for (int indice = 0; indice < historico.length; indice++) {
            historico[indice] = criarPedido("Cliente " + indice);
        }

        System.out.println("Histórico preenchido com " + historico.length + " pedidos.");
    }

    public static Pedido criarPedido(String cliente) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.status = "CRIADO";

        return pedido;
    }
}

class Pedido {
    String cliente;
    String status;
}
```

Aqui o array mantém referências para os pedidos.

Enquanto o array `historico` estiver vivo, os pedidos estão alcançáveis.

Isso é correto se precisamos do histórico.

Mas, se não precisamos mais, manter as referências impede coleta.

---

## Exemplo removendo referência de array

Arquivo:

```text
LimparReferenciaArray.java
```

Código:

```java
public class LimparReferenciaArray {
    public static void main(String[] args) {
        Pedido[] historico = new Pedido[3];

        historico[0] = criarPedido("Ana");
        historico[1] = criarPedido("Bruno");
        historico[2] = criarPedido("Carla");

        historico[1] = null;

        System.out.println("Referência da posição 1 removida.");
    }

    public static Pedido criarPedido(String cliente) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.status = "CRIADO";

        return pedido;
    }
}

class Pedido {
    String cliente;
    String status;
}
```

Quando fazemos:

```java
historico[1] = null;
```

removemos a referência para o objeto naquela posição.

Se não houver outra referência para o pedido de Bruno, ele fica elegível para coleta.

Isso é importante em estruturas que reaproveitam arrays.

---

## Exemplo de cache sem limite

Arquivo:

```text
CacheSemLimiteConceitual.java
```

Código didático:

```java
public class CacheSemLimiteConceitual {
    static Pedido[] cache = new Pedido[1000];
    static int quantidade = 0;

    public static void main(String[] args) {
        adicionarNoCache(criarPedido("Ana"));
        adicionarNoCache(criarPedido("Bruno"));

        System.out.println("Itens no cache: " + quantidade);
    }

    public static void adicionarNoCache(Pedido pedido) {
        if (quantidade < cache.length) {
            cache[quantidade] = pedido;
            quantidade++;
        }
    }

    public static Pedido criarPedido(String cliente) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.status = "CRIADO";

        return pedido;
    }
}

class Pedido {
    String cliente;
    String status;
}
```

Esse cache é estático.

Enquanto a aplicação estiver rodando, o campo estático `cache` mantém referências.

Isso pode ser correto se for intencional e limitado.

Mas caches sem limite ou sem limpeza podem causar vazamento.

Regra:

```text
cache precisa de política de limite, remoção ou expiração.
```

---

## Sintomas de vazamento de memória

Sintomas possíveis:

```text
uso de memória cresce continuamente;
aplicação fica cada vez mais lenta;
GC roda com mais frequência;
pausas aumentam;
OutOfMemoryError aparece;
servidor precisa ser reiniciado para voltar ao normal;
operações antigas continuam ocupando memória;
filas não esvaziam;
caches crescem sem controle.
```

Esses sintomas não provam vazamento sozinhos.

Mas indicam investigação.

Em backend, isso pode aparecer como:

```text
API começa bem e degrada depois de horas;
container reinicia por falta de memória;
pod no Kubernetes é morto por limite de memória;
logs mostram OutOfMemoryError;
latência aumenta após muitas requisições.
```

---

## OutOfMemoryError conceitual

`OutOfMemoryError` acontece quando a JVM não consegue alocar memória necessária.

Não vamos forçar isso nesta aula como prática principal, porque pode travar o ambiente.

Mas conceitualmente:

```text
a aplicação precisa criar ou manter objetos;
heap não tem espaço suficiente;
GC não consegue liberar o bastante;
JVM lança OutOfMemoryError.
```

Causas possíveis:

```text
heap pequeno demais;
dados grandes demais;
vazamento de memória;
cache sem limite;
listas acumulando;
carga acima do esperado;
configuração errada;
bug criando objetos sem parar.
```

A solução depende da causa.

Não é sempre “aumentar memória”.

Às vezes precisa corrigir retenção indevida.

---

## Pressão de memória

Pressão de memória é quando a aplicação cria ou mantém muitos objetos, exigindo mais trabalho da JVM.

Exemplo:

```java
for (int indice = 0; indice < 1_000_000; indice++) {
    String texto = "Pedido " + indice;
}
```

Esse loop cria muitos objetos temporários.

Objetos temporários podem ser coletados.

Mas criar objetos demais sem necessidade pode gerar pressão.

Nesta fase, o objetivo não é micro-otimizar.

O objetivo é perceber:

```text
objetos custam memória;
objetos temporários podem ser coletados;
objetos mantidos por referência não podem ser coletados;
criar e reter são coisas diferentes.
```

---

## Exemplo de objetos temporários

Arquivo:

```text
ObjetosTemporarios.java
```

Código:

```java
public class ObjetosTemporarios {
    public static void main(String[] args) {
        for (int indice = 0; indice < 5; indice++) {
            String mensagem = montarMensagem(indice);

            System.out.println(mensagem);
        }

        System.out.println("Fim");
    }

    public static String montarMensagem(int indice) {
        return "Mensagem " + indice;
    }
}
```

As Strings criadas durante a execução podem deixar de ser necessárias depois.

Algumas podem ser otimizadas internamente pela JVM, mas o conceito didático é:

```text
objeto temporário não mantido por referência longa pode se tornar elegível.
```

---

## Runtime memory: observação didática

Podemos observar memória de forma simples com `Runtime`.

Atenção:

```text
isso não é benchmark profissional;
isso não prova exatamente quando GC rodou;
é apenas observação didática.
```

Arquivo:

```text
ObservacaoMemoria.java
```

Código:

```java
public class ObservacaoMemoria {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();

        exibirMemoria("Início", runtime);

        byte[] dados = new byte[10_000_000];

        exibirMemoria("Após criar array", runtime);

        dados = null;

        System.gc();

        exibirMemoria("Após remover referência e solicitar GC", runtime);
    }

    public static void exibirMemoria(String etapa, Runtime runtime) {
        long memoriaTotal = runtime.totalMemory();
        long memoriaLivre = runtime.freeMemory();
        long memoriaUsada = memoriaTotal - memoriaLivre;

        System.out.println(etapa);
        System.out.println("Memória total: " + memoriaTotal);
        System.out.println("Memória livre: " + memoriaLivre);
        System.out.println("Memória usada: " + memoriaUsada);
        System.out.println("--------------------");
    }
}
```

Interpretação correta:

```text
os números podem variar;
System.gc não garante comportamento imediato;
use apenas para perceber que objetos grandes afetam memória.
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoGcConceitual.java
```

Código:

```java
public class PedidoGcConceitual {
    public static void main(String[] args) {
        processarPedido();

        System.out.println("Pedido processado.");
    }

    public static void processarPedido() {
        Pedido pedido = new Pedido();

        pedido.cliente = "Ana";
        pedido.status = "APROVADO";

        System.out.println("Status: " + pedido.status);
    }
}

class Pedido {
    String cliente;
    String status;
}
```

Depois de `processarPedido`, se o pedido não foi retornado nem guardado, ele fica elegível para coleta.

Isso é correto para dados temporários de processamento.

---

## Aplicação em produto

Arquivo:

```text
ProdutoCacheConceitual.java
```

Código:

```java
public class ProdutoCacheConceitual {
    static Produto produtoEmCache;

    public static void main(String[] args) {
        produtoEmCache = carregarProduto();

        System.out.println("Produto em cache: " + produtoEmCache.nome);

        produtoEmCache = null;

        System.out.println("Cache limpo.");
    }

    public static Produto carregarProduto() {
        Produto produto = new Produto();

        produto.nome = "Cadeira";
        produto.status = "ATIVO";

        return produto;
    }
}

class Produto {
    String nome;
    String status;
}
```

Enquanto `produtoEmCache` aponta para o produto, ele está alcançável.

Quando `produtoEmCache = null`, se não houver outra referência, ele fica elegível.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoTemporarioGc.java
```

Código:

```java
public class PagamentoTemporarioGc {
    public static void main(String[] args) {
        long valorParcela = calcularParcela();

        System.out.println("Valor da parcela: " + valorParcela);
    }

    public static long calcularParcela() {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = 10000L;
        pagamento.parcelas = 4;

        return pagamento.valorCentavos / pagamento.parcelas;
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

O objeto `Pagamento` foi usado apenas como estrutura temporária.

Após o método retornar, se não foi retornado o objeto, ele fica elegível.

Neste exemplo, poderíamos nem criar objeto.

Refatoração mais simples:

```java
public static long calcularParcela(long valorCentavos, int parcelas) {
    return valorCentavos / parcelas;
}
```

Essa leitura crítica é importante:

```text
nem todo objeto precisa existir.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoGcConceitual.java
```

Código:

```java
public class OrdemServicoGcConceitual {
    static OrdemServico ultimaOsProcessada;

    public static void main(String[] args) {
        processarOs("OS-001");
        processarOs("OS-002");

        System.out.println("Última OS: " + ultimaOsProcessada.certificado);
    }

    public static void processarOs(String certificado) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.status = "PROCESSADA";

        ultimaOsProcessada = os;
    }
}

class OrdemServico {
    String certificado;
    String status;
}
```

Quando processamos `OS-001`, `ultimaOsProcessada` aponta para ela.

Depois processamos `OS-002`.

A referência estática passa a apontar para `OS-002`.

Se não houver outra referência para `OS-001`, ela fica elegível para coleta.

Esse exemplo mostra sobrescrita de referência global.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaFilaConceitual.java
```

Código:

```java
public class MensageriaFilaConceitual {
    static Mensagem[] fila = new Mensagem[3];

    public static void main(String[] args) {
        fila[0] = criarMensagem("Ana", "ENTREGA");
        fila[1] = criarMensagem("Bruno", "NPS");
        fila[2] = criarMensagem("Carla", "BOAS_VINDAS");

        processarMensagem(1);

        System.out.println("Mensagem da posição 1 processada e removida da fila.");
    }

    public static Mensagem criarMensagem(String cliente, String tipo) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.tipo = tipo;

        return mensagem;
    }

    public static void processarMensagem(int indice) {
        if (indice >= 0 && indice < fila.length && fila[indice] != null) {
            System.out.println("Processando: " + fila[indice].cliente);

            fila[indice] = null;
        }
    }
}

class Mensagem {
    String cliente;
    String tipo;
}
```

Ao fazer:

```java
fila[indice] = null;
```

removemos a referência daquela posição.

Se não houver outra referência, a mensagem processada fica elegível para coleta.

Isso representa limpeza de fila.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaRetencaoConceitual.java
```

Código:

```java
public class AuditoriaRetencaoConceitual {
    static RegistroAuditoria[] registros = new RegistroAuditoria[2];

    public static void main(String[] args) {
        registros[0] = criarRegistro("aline", "CRIACAO");
        registros[1] = criarRegistro("jackson", "EDICAO");

        exibirRegistros();

        registros[0] = null;

        System.out.println("Primeiro registro removido da retenção em memória.");
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.status = "SUCESSO";

        return registro;
    }

    public static void exibirRegistros() {
        for (int indice = 0; indice < registros.length; indice++) {
            if (registros[indice] != null) {
                System.out.println(registros[indice].usuario + " | " + registros[indice].operacao);
            }
        }
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
}
```

Auditoria real normalmente vai para banco, arquivo ou sistema de log.

Guardar tudo em memória indefinidamente pode ser ruim.

Esse exemplo mostra retenção e remoção.

---

## Refatoração: remover retenção desnecessária

Código problemático:

```java
static Pedido ultimoPedido;

public static void processarPedido() {
    Pedido pedido = new Pedido();

    pedido.status = "PROCESSADO";

    ultimoPedido = pedido;
}
```

Se `ultimoPedido` não é realmente necessário, ele mantém o objeto vivo sem motivo.

Refatoração:

```java
public static void processarPedido() {
    Pedido pedido = new Pedido();

    pedido.status = "PROCESSADO";

    System.out.println(pedido.status);
}
```

Agora, ao final do método, o pedido pode ficar elegível.

Regra:

```text
não transforme variável local em campo estático sem necessidade.
```

---

## Refatoração: limitar histórico

No mini projeto anterior, o histórico tinha limite 10.

Isso é saudável.

Histórico sem limite pode crescer indefinidamente.

Padrão bom:

```text
definir capacidade;
remover antigo;
guardar novo;
não deixar estrutura crescer sem controle.
```

Mesmo em aplicações reais, caches e históricos precisam de política:

```text
limite por tamanho;
limite por tempo;
expiração;
remoção manual;
persistência externa;
limpeza periódica.
```

Nesta fase, usamos array limitado.

O princípio é profissional.

---

## Leitura crítica: GC não resolve regra ruim

Se você escreve:

```java
static Pedido[] pedidos = new Pedido[1_000_000];
```

e mantém referências lá dentro, o GC não vai coletar esses pedidos.

Para o GC, eles ainda são alcançáveis.

Então a pergunta profissional não é só:

```text
o GC funciona?
```

A pergunta é:

```text
meu código ainda mantém referência para objetos que não precisa mais?
```

Se sim, o problema é no design da retenção.

---

## Erros comuns

### Erro 1 — Achar que GC coleta qualquer objeto sem uso de negócio

GC não entende regra de negócio.

Ele entende alcançabilidade.

Se ainda existe referência, o objeto é alcançável.

---

### Erro 2 — Achar que objeto elegível é coletado imediatamente

Elegível significa que pode ser coletado.

Não significa que já foi.

---

### Erro 3 — Usar System.gc como solução normal

`System.gc()` não deve ser base de lógica da aplicação.

---

### Erro 4 — Manter lista, array ou cache sem limite

Estruturas que só crescem podem gerar vazamento.

---

### Erro 5 — Guardar objeto em campo estático sem necessidade

Campo estático pode manter objeto vivo pelo tempo da aplicação.

---

### Erro 6 — Confundir memória de objeto com recurso externo

GC libera memória de objetos.

Recursos externos precisam ser fechados corretamente.

---

### Erro 7 — Criar objeto desnecessário

Nem toda regra precisa de objeto.

Às vezes método com parâmetros e retorno é suficiente.

---

### Erro 8 — Não limpar referência em estrutura reaproveitada

Arrays, filas e caches podem precisar remover referência antiga.

---

### Erro 9 — Ignorar sintomas de vazamento

Memória crescendo continuamente precisa ser investigada.

---

### Erro 10 — Tentar diagnosticar GC só no chute

Use logs, métricas, profiler e observação.

Nesta fase, use exemplos e debug.

No futuro, usaremos ferramentas melhores.

---

## Diagnóstico de GC conceitual

Quando suspeitar de problema de memória, pergunte:

### 1. Quais objetos estão sendo criados?

Pedidos?

Clientes?

Mensagens?

Arrays grandes?

Strings temporárias?

### 2. Esses objetos ainda são necessários?

Se sim, tudo bem.

Se não, por que continuam referenciados?

### 3. Quem aponta para eles?

Variável local?

Campo estático?

Array?

Lista?

Cache?

Fila?

### 4. O escopo termina?

Se é variável local, a referência some ao fim do método.

### 5. O objeto foi guardado em estrutura longa?

Caches, arrays e campos estáticos podem reter.

### 6. Existe limite?

Histórico tem tamanho máximo?

Cache expira?

Fila remove processados?

### 7. Objetos processados são removidos?

Exemplo:

```java
fila[indice] = null;
```

### 8. Há recurso externo?

Se sim, precisa fechamento apropriado.

### 9. Há sintoma real?

Memória cresce?

GC frequente?

OutOfMemoryError?

### 10. Debug ou ferramenta confirma?

Não conclua só por impressão.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugGcConceitual {
    public static void main(String[] args) {
        Pedido[] fila = new Pedido[2];

        fila[0] = criarPedido("Ana");
        fila[1] = criarPedido("Bruno");

        fila[0] = null;

        System.out.println("Fim");
    }

    public static Pedido criarPedido(String cliente) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;

        return pedido;
    }
}

class Pedido {
    String cliente;
}
```

Coloque breakpoint em:

```java
fila[0] = null;
```

Observe:

```text
antes, fila[0] aponta para Pedido Ana;
depois, fila[0] fica null;
se ninguém mais aponta para Pedido Ana, ele fica elegível.
```

O debug não mostra o GC coletando.

Ele mostra a referência sendo removida.

Essa é a parte que o desenvolvedor controla.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Campo estático retendo objeto

```java
public class Main {
    static Cliente clienteGlobal;

    public static void main(String[] args) {
        criarCliente();

        System.out.println(clienteGlobal.nome);
    }

    public static void criarCliente() {
        clienteGlobal = new Cliente();
        clienteGlobal.nome = "Ana";
    }
}

class Cliente {
    String nome;
}
```

Explique por que o objeto continua alcançável.

---

### Teste 2 — Objeto local perdido

```java
public class Main {
    public static void main(String[] args) {
        criarCliente();

        System.out.println("Não consigo acessar o cliente aqui.");
    }

    public static void criarCliente() {
        Cliente cliente = new Cliente();
        cliente.nome = "Ana";
    }
}

class Cliente {
    String nome;
}
```

Explique por que o objeto fica elegível após o método.

---

### Teste 3 — Array retendo referências

```java
public class Main {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[2];

        clientes[0] = new Cliente();
        clientes[0].nome = "Ana";

        clientes[1] = new Cliente();
        clientes[1].nome = "Bruno";

        clientes[0] = null;

        System.out.println("Referência removida da posição 0.");
    }
}

class Cliente {
    String nome;
}
```

Explique o que acontece com o objeto de Ana.

---

### Teste 4 — Cache sem limpeza

```java
public class Main {
    static Cliente[] cache = new Cliente[100];
    static int quantidade = 0;

    public static void main(String[] args) {
        cache[quantidade] = new Cliente();
        cache[quantidade].nome = "Ana";
        quantidade++;

        System.out.println("Cliente guardado no cache.");
    }
}

class Cliente {
    String nome;
}
```

Explique por que esse objeto continua alcançável.

---

### Teste 5 — System.gc

```java
public class Main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente = null;

        System.gc();

        System.out.println("GC solicitado.");
    }
}

class Cliente {
    String nome;
}
```

Explique por que não podemos depender de coleta imediata.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-064-garbage-collector-conceitual
cd labs\m2\aula-064-garbage-collector-conceitual
```

Crie arquivos:

```text
Main.java
ObjetoRetornadoNaoElegivel.java
ReferenciaSobrescrita.java
ReferenciaNullGc.java
ChamadaSystemGc.java
HistoricoCrescendoConceitual.java
LimparReferenciaArray.java
CacheSemLimiteConceitual.java
ObjetosTemporarios.java
ObservacaoMemoria.java
PedidoGcConceitual.java
ProdutoCacheConceitual.java
PagamentoTemporarioGc.java
OrdemServicoGcConceitual.java
MensageriaFilaConceitual.java
AuditoriaRetencaoConceitual.java
DebugGcConceitual.java
ErroCampoEstaticoRetendoObjeto.java
ErroCacheSemLimite.java
ErroObjetoDesnecessario.java
README.md
```

Compile:

```powershell
javac Main.java
javac ObjetoRetornadoNaoElegivel.java
javac ReferenciaSobrescrita.java
javac ReferenciaNullGc.java
javac ChamadaSystemGc.java
javac HistoricoCrescendoConceitual.java
javac LimparReferenciaArray.java
javac CacheSemLimiteConceitual.java
javac ObjetosTemporarios.java
javac ObservacaoMemoria.java
javac PedidoGcConceitual.java
javac ProdutoCacheConceitual.java
javac PagamentoTemporarioGc.java
javac OrdemServicoGcConceitual.java
javac MensageriaFilaConceitual.java
javac AuditoriaRetencaoConceitual.java
javac DebugGcConceitual.java
javac ErroCampoEstaticoRetendoObjeto.java
javac ErroCacheSemLimite.java
javac ErroObjetoDesnecessario.java
```

Execute:

```powershell
java Main
java ObjetoRetornadoNaoElegivel
java ReferenciaSobrescrita
java ReferenciaNullGc
java ChamadaSystemGc
java HistoricoCrescendoConceitual
java LimparReferenciaArray
java CacheSemLimiteConceitual
java ObjetosTemporarios
java ObservacaoMemoria
java PedidoGcConceitual
java ProdutoCacheConceitual
java PagamentoTemporarioGc
java OrdemServicoGcConceitual
java MensageriaFilaConceitual
java AuditoriaRetencaoConceitual
java DebugGcConceitual
java ErroCampoEstaticoRetendoObjeto
java ErroCacheSemLimite
java ErroObjetoDesnecessario
```

Alguns exemplos são conceituais.

Não conclua comportamento exato de GC apenas pela saída.

O foco é entender alcançabilidade.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 064 — Garbage Collector conceitual

## Objetivo

Entender o papel do Garbage Collector na JVM, o conceito de objeto elegível para coleta, objetos alcançáveis, referências ativas, referências removidas e sintomas de vazamento de memória.

## Conceitos

- Objetos ficam no heap.
- Referências permitem acessar objetos.
- Objeto alcançável não é coletado.
- Objeto não alcançável fica elegível para coleta.
- Elegível não significa coletado imediatamente.
- `System.gc()` é solicitação, não garantia.
- Vazamento de memória em Java ocorre quando objetos desnecessários continuam alcançáveis.
- Campos estáticos, caches, listas, arrays e filas podem reter objetos.
- GC não fecha recurso externo automaticamente.
- Escopo pequeno ajuda a não manter referências sem necessidade.

## Comandos

```powershell
javac Main.java
java Main
javac ObservacaoMemoria.java
java ObservacaoMemoria
```

## Observações

- Não usar `System.gc()` como regra de negócio.
- Não manter cache sem limite.
- Remover referências de estruturas reaproveitadas quando necessário.
- Diferenciar memória de objeto de recurso externo.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver referências antes/depois |
| Run | `Shift + F10` | Executar normal |
| Step Into | `F7` em muitos keymaps | Entrar em método |
| Step Over | `F8` em muitos keymaps | Avançar linha |
| Variables | janela do Debug | Ver arrays e objetos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 064 — Garbage Collector conceitual

### O que aprendi
Aprendi que o Garbage Collector é o mecanismo da JVM que pode liberar memória de objetos no heap que não são mais alcançáveis. Também aprendi que objeto elegível para coleta não é necessariamente coletado imediatamente.

### O que pratiquei
Criei exemplos com objetos locais, objetos retornados, referência sobrescrita, referência null, array retendo objetos, cache conceitual, fila removendo referência, chamada didática de System.gc e observação simples de memória com Runtime.

### Conceitos principais
- Garbage Collector
- GC
- heap
- objeto alcançável
- objeto não alcançável
- objeto elegível para coleta
- referência ativa
- referência removida
- null
- System.gc
- memória liberada
- vazamento de memória
- cache sem limite
- campo estático
- fila
- array retendo referência
- pressão de memória
- OutOfMemoryError conceitual
- recurso externo
- escopo
- retenção desnecessária

### Arquivos criados
- `labs/m2/aula-064-garbage-collector-conceitual/Main.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ObjetoRetornadoNaoElegivel.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ReferenciaSobrescrita.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ReferenciaNullGc.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ChamadaSystemGc.java`
- `labs/m2/aula-064-garbage-collector-conceitual/HistoricoCrescendoConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/LimparReferenciaArray.java`
- `labs/m2/aula-064-garbage-collector-conceitual/CacheSemLimiteConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ObjetosTemporarios.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ObservacaoMemoria.java`
- `labs/m2/aula-064-garbage-collector-conceitual/PedidoGcConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ProdutoCacheConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/PagamentoTemporarioGc.java`
- `labs/m2/aula-064-garbage-collector-conceitual/OrdemServicoGcConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/MensageriaFilaConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/AuditoriaRetencaoConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/DebugGcConceitual.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ErroCampoEstaticoRetendoObjeto.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ErroCacheSemLimite.java`
- `labs/m2/aula-064-garbage-collector-conceitual/ErroObjetoDesnecessario.java`
- `labs/m2/aula-064-garbage-collector-conceitual/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac ReferenciaSobrescrita.java
java ReferenciaSobrescrita
javac LimparReferenciaArray.java
java LimparReferenciaArray
javac ObservacaoMemoria.java
java ObservacaoMemoria
```

### Erros que quero evitar
- achar que GC coleta qualquer objeto sem uso de negócio;
- achar que objeto elegível é coletado imediatamente;
- usar `System.gc()` como solução normal;
- manter lista, array ou cache sem limite;
- guardar objeto em campo estático sem necessidade;
- confundir memória de objeto com recurso externo;
- criar objeto desnecessário;
- não limpar referência em estrutura reaproveitada;
- ignorar sintomas de vazamento;
- diagnosticar GC apenas no chute.

### Próximo passo
Estudar default values e inicialização.
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
git add labs/m2/aula-064-garbage-collector-conceitual docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 064: pratica Garbage Collector conceitual em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é Garbage Collector?
2. O que significa objeto alcançável?
3. O que significa objeto elegível para coleta?
4. Objeto elegível é coletado imediatamente?
5. O que acontece quando uma variável local deixa de existir?
6. O que acontece quando uma referência é sobrescrita?
7. O que acontece quando atribuímos null a uma referência?
8. Por que campo estático pode reter objeto por muito tempo?
9. Como um array pode impedir objetos de serem coletados?
10. O que é vazamento de memória em Java?
11. Por que GC não elimina a necessidade de bom design?
12. Por que System.gc não deve ser base da lógica?
13. Qual a diferença entre memória de objeto e recurso externo?
14. Quais sintomas podem indicar vazamento?
15. Por que cache precisa de limite ou política de limpeza?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar Garbage Collector;
explicar heap e objeto no contexto de GC;
explicar objeto alcançável;
explicar objeto elegível para coleta;
explicar que elegível não significa coletado imediatamente;
explicar referência ativa;
explicar referência removida;
usar null para remover referência em exemplo didático;
explicar sobrescrita de referência;
explicar escopo e elegibilidade;
explicar System.gc conceitualmente;
explicar por que não depender de System.gc;
explicar vazamento de memória em Java;
explicar cache sem limite;
explicar campo estático retendo objeto;
explicar array retendo objeto;
explicar fila removendo referência;
explicar pressão de memória;
explicar OutOfMemoryError conceitual;
diferenciar memória de objeto de recurso externo;
aplicar em pedido;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
usar debug para observar referência removida;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar algoritmos de GC.

Não precisa ainda dominar G1, ZGC, Shenandoah ou Parallel GC.

Não precisa ainda dominar tuning de heap.

Não precisa ainda dominar logs de GC.

Não precisa ainda dominar profiler.

Não precisa ainda dominar try-with-resources.

Esses assuntos virão depois.

O objetivo é dominar o conceito de alcançabilidade e entender como objetos se tornam elegíveis para coleta.

---

## Fechamento da aula

Hoje estudamos Garbage Collector conceitual.

A ideia central foi:

```text
o GC pode liberar memória de objetos no heap que não são mais alcançáveis.
```

Vimos que:

```text
objetos alcançáveis não são coletados;
objetos não alcançáveis ficam elegíveis;
elegível não significa coletado imediatamente;
referências em arrays, caches e campos estáticos mantêm objetos vivos;
vazamento em Java geralmente é retenção indevida de objetos alcançáveis;
System.gc não deve ser base de regra;
GC não substitui fechamento correto de recursos externos.
```

O ponto mais importante é:

```text
o GC não entende se o objeto ainda é útil para o negócio; ele entende se o objeto ainda é alcançável.
```

Na próxima aula, vamos estudar:

```text
Default values e inicialização.
```

A próxima aula vai explicar valores padrão de campos, arrays, objetos, primitivos, referências e por que variáveis locais são diferentes.
