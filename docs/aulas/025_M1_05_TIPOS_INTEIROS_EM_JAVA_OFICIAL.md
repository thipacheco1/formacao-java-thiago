# 025 — M1.05 — Tipos Inteiros em Java

## Hoje a aula é sobre números inteiros com responsabilidade

Um iniciante costuma usar `int` para tudo.

E, no começo, `int` realmente resolve muita coisa.

Mas Java tem quatro tipos inteiros principais:

```text
byte;
short;
int;
long.
```

Eles não existem por enfeite.

Eles têm tamanhos e limites diferentes.

Cada tipo guarda uma faixa de valores.

Se você tenta guardar um valor fora da faixa, pode ter erro de compilação ou comportamento perigoso, como overflow.

Nesta aula, vamos entender:

```text
o que são tipos inteiros;
quais são os limites;
por que int é o padrão mais comum;
quando long é necessário;
por que byte e short aparecem menos no código comum;
o que é overflow;
para que serve o sufixo L;
como aplicar isso em backend.
```

---

## O que é um número inteiro

Número inteiro é número sem parte decimal.

Exemplos:

```text
10;
0;
-1;
500;
2026.
```

Não são inteiros:

```text
10.5;
99.90;
3.14;
0.25.
```

Em Java, tipos inteiros guardam valores numéricos sem casas decimais.

Exemplo:

```java
int quantidade = 10;
```

O valor `10` é inteiro.

---

## Os quatro tipos inteiros principais

Java possui estes tipos inteiros primitivos:

```text
byte;
short;
int;
long.
```

Eles diferem principalmente em tamanho e faixa.

Tabela:

| Tipo | Tamanho | Valor mínimo | Valor máximo |
|---|---:|---:|---:|
| `byte` | 8 bits | -128 | 127 |
| `short` | 16 bits | -32.768 | 32.767 |
| `int` | 32 bits | -2.147.483.648 | 2.147.483.647 |
| `long` | 64 bits | -9.223.372.036.854.775.808 | 9.223.372.036.854.775.807 |

Não precisa decorar todos os números grandes agora.

Mas precisa entender a ideia:

```text
cada tipo tem limite.
```

---

## Por que existem limites

Computadores armazenam números em memória usando uma quantidade finita de bits.

Se o tipo usa poucos bits, cabe menos valor.

Se usa mais bits, cabe mais valor.

Exemplo:

```text
byte usa 8 bits;
short usa 16 bits;
int usa 32 bits;
long usa 64 bits.
```

Quanto maior o tipo, maior a faixa de valores.

Mas isso não significa que devemos usar `long` para tudo sem pensar.

A escolha de tipo também comunica intenção.

---

## `int`: o tipo inteiro mais comum

Na prática, `int` é o tipo inteiro mais usado no começo.

Exemplos:

```java
int idade = 30;
int quantidadeItens = 5;
int tentativasLogin = 3;
int paginaAtual = 1;
int tamanhoPagina = 20;
```

Por quê?

Porque `int` tem uma faixa grande o suficiente para muitos usos comuns.

Ele guarda valores de aproximadamente:

```text
-2 bilhões até +2 bilhões.
```

Para contadores, quantidades pequenas, idade, páginas e tentativas, `int` costuma ser suficiente.

---

## `long`: quando o número pode ser grande

`long` é usado quando o valor pode ultrapassar o limite do `int`.

Exemplos:

```java
long idPedido = 10000000000L;
long totalRegistrosProcessados = 5000000000L;
long tempoEmMilissegundos = 1710000000000L;
```

Perceba o `L` no final.

Esse sufixo indica que o literal é `long`.

Sem ele, alguns números grandes podem ser tratados como `int` e gerar erro.

---

## O sufixo `L`

Em Java, literais inteiros são tratados como `int` por padrão, se couberem em `int`.

Quando você escreve um número que deve ser `long`, use `L` no final.

Exemplo:

```java
long idExterno = 3000000000L;
```

O `L` diz:

```text
este número é long.
```

Evite usar `l` minúsculo.

Errado visualmente:

```java
long idExterno = 3000000000l;
```

O `l` minúsculo parece número `1`.

Prefira sempre:

```java
L
```

Maiúsculo.

---

## Erro sem sufixo `L`

Exemplo:

```java
long numeroGrande = 3000000000;
```

Esse valor passa do limite de `int`.

Mesmo a variável sendo `long`, o literal sem `L` pode gerar erro porque o número literal é interpretado inicialmente como `int`.

Correção:

```java
long numeroGrande = 3000000000L;
```

Regra:

```text
literal inteiro grande para long deve usar L.
```

---

## `byte`

`byte` guarda valores de:

```text
-128 até 127.
```

Exemplo:

```java
byte idade = 30;
byte quantidadeTentativas = 3;
```

Mas no código de negócio comum, `byte` é menos usado.

Ele aparece mais em contextos como:

```text
manipulação de arquivos;
dados binários;
buffers;
redes;
bytes de imagem;
protocolos;
criptografia;
baixo nível.
```

Para idade ou quantidade, normalmente usamos `int`, mesmo que caiba em `byte`.

Por quê?

Porque `int` é mais natural para operações comuns e evita conversões desnecessárias.

---

## `short`

`short` guarda valores de:

```text
-32.768 até 32.767.
```

Exemplo:

```java
short ano = 2026;
```

Mas, assim como `byte`, `short` aparece menos em código de negócio comum.

Pode aparecer em:

```text
integração com sistemas legados;
formatos binários;
otimizações específicas;
protocolos;
estruturas compactas.
```

No dia a dia backend, `int` e `long` são mais comuns.

---

## Escolha prática no começo

Regra prática inicial:

```text
use int para quantidades, contadores e números comuns;
use long para IDs grandes, timestamps, contagens muito grandes e valores que podem passar de 2 bilhões;
use byte e short apenas quando houver motivo claro.
```

Exemplos:

```java
int quantidadeItens = 4;
int tentativasLogin = 3;
int idadeCliente = 35;

long idPedido = 9876543210L;
long totalEventosProcessados = 5000000000L;
long timestampCriacao = 1710000000000L;
```

Isso cobre a maioria dos primeiros casos.

---

## Inteiro não é dinheiro por padrão

Cuidado importante.

Dinheiro tem casas decimais.

Exemplo:

```text
R$ 99,90
```

Não é um inteiro em reais.

Mas, em muitos sistemas, valores monetários podem ser armazenados como inteiro em centavos.

Exemplo:

```java
long valorEmCentavos = 9990L;
```

Isso representa:

```text
R$ 99,90
```

Essa técnica evita alguns problemas de números decimais.

Mas não vamos aprofundar dinheiro agora.

Na próxima aula, falaremos de decimais e limitações.

Mais tarde, veremos `BigDecimal`, que é muito importante para valores monetários.

Por enquanto, guarde:

```text
não trate dinheiro com descuido.
```

---

## Literal inteiro com underscore

Java permite usar `_` para melhorar leitura de números grandes.

Exemplo:

```java
long totalRegistros = 1_000_000L;
int limiteDiario = 10_000;
```

Isso é igual a:

```java
long totalRegistros = 1000000L;
int limiteDiario = 10000;
```

O underscore ajuda humanos a lerem.

Regras básicas:

```text
não pode começar com _;
não pode terminar com _;
não pode ficar junto ao L de forma inválida;
não muda o valor.
```

Exemplo bom:

```java
long numeroGrande = 3_000_000_000L;
```

Exemplo ruim:

```java
long numeroGrande = 3_000_000_000_L;
```

---

## Exemplo mínimo com `int`

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidadePedidos = 10;

        System.out.println("Quantidade de pedidos: " + quantidadePedidos);
    }
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
Quantidade de pedidos: 10
```

Esse é o uso mais comum.

---

## Exemplo mínimo com `long`

Código:

```java
public class Main {
    public static void main(String[] args) {
        long idPedido = 3000000000L;

        System.out.println("ID do pedido: " + idPedido);
    }
}
```

Saída:

```text
ID do pedido: 3000000000
```

Sem o `L`, esse literal pode gerar erro.

Com o `L`, fica claro que é `long`.

---

## Exemplo com todos os tipos inteiros

Código:

```java
public class Main {
    public static void main(String[] args) {
        byte quantidadeTentativas = 3;
        short anoFabricacao = 2026;
        int quantidadePedidos = 1500;
        long totalEventosProcessados = 5_000_000_000L;

        System.out.println("Tentativas: " + quantidadeTentativas);
        System.out.println("Ano de fabricação: " + anoFabricacao);
        System.out.println("Quantidade de pedidos: " + quantidadePedidos);
        System.out.println("Total de eventos processados: " + totalEventosProcessados);
    }
}
```

Saída esperada:

```text
Tentativas: 3
Ano de fabricação: 2026
Quantidade de pedidos: 1500
Total de eventos processados: 5000000000
```

Observe:

```text
byte para valor pequeno;
short para valor pequeno/médio;
int para quantidade comum;
long para valor muito grande.
```

---

## Limites dos tipos

Java disponibiliza constantes com os limites.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("byte min: " + Byte.MIN_VALUE);
        System.out.println("byte max: " + Byte.MAX_VALUE);

        System.out.println("short min: " + Short.MIN_VALUE);
        System.out.println("short max: " + Short.MAX_VALUE);

        System.out.println("int min: " + Integer.MIN_VALUE);
        System.out.println("int max: " + Integer.MAX_VALUE);

        System.out.println("long min: " + Long.MIN_VALUE);
        System.out.println("long max: " + Long.MAX_VALUE);
    }
}
```

Isso mostra os limites reais.

Repare nos nomes:

```text
Byte;
Short;
Integer;
Long.
```

Esses são wrappers, não vamos aprofundar agora.

Use apenas para consultar limites.

---

## Overflow

Overflow acontece quando uma operação ultrapassa o limite do tipo.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        int maiorValorInt = Integer.MAX_VALUE;

        System.out.println("Antes: " + maiorValorInt);
        System.out.println("Depois: " + (maiorValorInt + 1));
    }
}
```

Saída:

```text
Antes: 2147483647
Depois: -2147483648
```

Isso parece absurdo.

Mas é overflow.

O valor passou do máximo e “deu a volta” para o mínimo.

Esse tipo de bug pode ser perigoso.

---

## Overflow não dá erro automaticamente

Um ponto importante:

```text
overflow em operações inteiras pode não gerar erro.
```

O programa compila.

O programa roda.

Mas o resultado fica errado.

Exemplo:

```java
int valor = 2_000_000_000;
int resultado = valor + valor;

System.out.println(resultado);
```

O resultado não será 4 bilhões corretamente em `int`.

Porque 4 bilhões passa do limite de `int`.

Correção:

```java
long valor = 2_000_000_000L;
long resultado = valor + valor;

System.out.println(resultado);
```

Agora cabe.

---

## Overflow aplicado a backend

Imagine um contador de eventos.

Errado:

```java
int totalEventos = 2_000_000_000;
totalEventos = totalEventos + 500_000_000;

System.out.println(totalEventos);
```

Esse total deveria passar de 2 bilhões.

Mas `int` não suporta.

Melhor:

```java
long totalEventos = 2_000_000_000L;
totalEventos = totalEventos + 500_000_000L;

System.out.println(totalEventos);
```

Em sistemas com muitos registros, eventos, logs ou integrações, `long` pode ser necessário.

---

## IDs e `long`

Muitos sistemas usam IDs que podem crescer muito.

Exemplo:

```java
long idCliente = 10000000001L;
long idPedido = 90000000002L;
long idEventoAuditoria = 80000000003L;
```

Se o ID vem de banco, fila, integração externa ou sistema legado, ele pode não caber em `int`.

Por isso, IDs frequentemente usam `Long` ou `long`.

Mais tarde, veremos diferença entre primitivo `long` e wrapper `Long`.

Agora, entenda:

```text
ID grande costuma ser long.
```

---

## Quantidade versus identificador

Escolha de tipo depende da intenção.

Exemplo:

```java
int quantidadeItens = 5;
long idPedido = 5000000000L;
```

`quantidadeItens` provavelmente não precisa de `long`.

`idPedido` pode precisar.

Não escolha só pelo valor do exemplo.

Escolha pensando no domínio.

Perguntas:

```text
esse número pode crescer muito?
vem de banco?
vem de integração?
representa ID global?
é contador massivo?
é quantidade pequena?
tem limite de negócio?
```

---

## `byte` e `short` em operações

Mesmo que você tenha `byte` e `short`, muitas operações aritméticas são promovidas para `int`.

Exemplo:

```java
byte a = 10;
byte b = 20;

// byte resultado = a + b; // pode dar erro
int resultado = a + b;

System.out.println(resultado);
```

Isso acontece porque Java promove operações menores para `int`.

Não precisa aprofundar agora.

Mas isso explica por que `byte` e `short` não são tão confortáveis para cálculos comuns.

Para cálculos simples, `int` costuma ser mais prático.

---

## Cast inicial

Se você tentar:

```java
byte valor = 128;
```

dá erro porque `byte` vai até 127.

Se tentar:

```java
byte a = 10;
byte b = 20;
byte resultado = a + b;
```

pode dar erro porque `a + b` vira `int`.

Você poderia forçar com cast:

```java
byte resultado = (byte) (a + b);
```

Mas isso pode ser perigoso se o valor sair da faixa.

Neste momento, não use cast para “calar erro” sem entender.

Regra inicial:

```text
se vai calcular, use int ou long.
```

---

## Exemplo aplicado: tentativa de login

Arquivo:

```text
TentativasLogin.java
```

Código:

```java
public class TentativasLogin {
    public static void main(String[] args) {
        int limiteTentativas = 3;
        int tentativasRealizadas = 2;
        int tentativasRestantes = limiteTentativas - tentativasRealizadas;

        System.out.println("Limite de tentativas: " + limiteTentativas);
        System.out.println("Tentativas realizadas: " + tentativasRealizadas);
        System.out.println("Tentativas restantes: " + tentativasRestantes);
    }
}
```

Aqui `int` é suficiente.

Não há necessidade de `long`.

---

## Exemplo aplicado: paginação

Em APIs, paginação costuma usar inteiros.

Exemplo:

```java
public class Paginacao {
    public static void main(String[] args) {
        int paginaAtual = 0;
        int tamanhoPagina = 20;
        int totalElementosNaPagina = 20;

        System.out.println("Página atual: " + paginaAtual);
        System.out.println("Tamanho da página: " + tamanhoPagina);
        System.out.println("Elementos retornados: " + totalElementosNaPagina);
    }
}
```

Em muitos frameworks, página e tamanho usam `int`.

Faz sentido porque são valores limitados.

---

## Exemplo aplicado: auditoria massiva

Arquivo:

```text
AuditoriaMassiva.java
```

Código:

```java
public class AuditoriaMassiva {
    public static void main(String[] args) {
        long totalEventosAuditoria = 5_000_000_000L;
        long eventosProcessadosHoje = 2_500_000L;

        System.out.println("Total de eventos de auditoria: " + totalEventosAuditoria);
        System.out.println("Eventos processados hoje: " + eventosProcessadosHoje);
    }
}
```

Aqui `long` faz sentido.

Eventos acumulados podem passar de 2 bilhões.

---

## Exemplo aplicado: ordem de serviço

Arquivo:

```text
OrdemServicoInteiros.java
```

Código:

```java
public class OrdemServicoInteiros {
    public static void main(String[] args) {
        long idOrdemServico = 10_000_000_001L;
        int quantidadeAtividades = 4;
        int quantidadeReagendamentos = 1;
        int prazoAtendimentoDias = 3;

        System.out.println("ID da OS: " + idOrdemServico);
        System.out.println("Quantidade de atividades: " + quantidadeAtividades);
        System.out.println("Quantidade de reagendamentos: " + quantidadeReagendamentos);
        System.out.println("Prazo de atendimento em dias: " + prazoAtendimentoDias);
    }
}
```

Escolha dos tipos:

```text
idOrdemServico -> long;
quantidadeAtividades -> int;
quantidadeReagendamentos -> int;
prazoAtendimentoDias -> int.
```

Essa escolha comunica domínio.

---

## Exemplo aplicado: produto e estoque

Arquivo:

```text
ProdutoEstoque.java
```

Código:

```java
public class ProdutoEstoque {
    public static void main(String[] args) {
        long idProduto = 9_000_000_001L;
        int quantidadeEstoque = 120;
        int quantidadeReservada = 15;
        int quantidadeDisponivel = quantidadeEstoque - quantidadeReservada;

        System.out.println("ID do produto: " + idProduto);
        System.out.println("Estoque total: " + quantidadeEstoque);
        System.out.println("Quantidade reservada: " + quantidadeReservada);
        System.out.println("Quantidade disponível: " + quantidadeDisponivel);
    }
}
```

Esse exemplo mostra cálculo inteiro simples.

---

## Exemplo aplicado: valor em centavos

Arquivo:

```text
PagamentoCentavos.java
```

Código:

```java
public class PagamentoCentavos {
    public static void main(String[] args) {
        long valorProdutoCentavos = 9990L;
        long valorFreteCentavos = 1500L;
        long valorTotalCentavos = valorProdutoCentavos + valorFreteCentavos;

        System.out.println("Produto em centavos: " + valorProdutoCentavos);
        System.out.println("Frete em centavos: " + valorFreteCentavos);
        System.out.println("Total em centavos: " + valorTotalCentavos);
    }
}
```

Esse exemplo não é formatação monetária.

É apenas uma introdução à ideia de armazenar centavos como inteiro.

Dinheiro será tratado com mais cuidado em aulas futuras.

---

## Erros comuns

### Erro 1 — Valor fora do limite de `byte`

Errado:

```java
byte valor = 128;
```

`byte` vai até 127.

Correção:

```java
short valor = 128;
```

ou:

```java
int valor = 128;
```

---

### Erro 2 — Valor fora do limite de `short`

Errado:

```java
short quantidade = 40000;
```

`short` vai até 32767.

Correção:

```java
int quantidade = 40000;
```

---

### Erro 3 — `long` sem sufixo `L`

Errado:

```java
long numeroGrande = 3000000000;
```

Correção:

```java
long numeroGrande = 3000000000L;
```

---

### Erro 4 — Usar `l` minúsculo

Evite:

```java
long numeroGrande = 3000000000l;
```

Prefira:

```java
long numeroGrande = 3000000000L;
```

O `l` minúsculo parece `1`.

---

### Erro 5 — Overflow silencioso

Perigoso:

```java
int resultado = 2_000_000_000 + 2_000_000_000;
```

Correção:

```java
long resultado = 2_000_000_000L + 2_000_000_000L;
```

---

### Erro 6 — Achar que `int` serve para todo ID

Se o ID pode crescer muito, use `long`.

Exemplo:

```java
long idEvento = 8_000_000_000L;
```

---

### Erro 7 — Usar `byte` e `short` para economizar sem necessidade

Em código de negócio comum, isso pode atrapalhar mais do que ajudar.

Use `int`, salvo motivo claro.

---

### Erro 8 — Usar vírgula em número

Errado:

```java
int valor = 1,000;
```

Isso não significa mil em Java.

Para melhorar leitura, use underscore:

```java
int valor = 1_000;
```

---

### Erro 9 — Confundir decimal com inteiro

Errado:

```java
int valor = 99.90;
```

`99.90` é decimal.

Correção depende do domínio:

```java
long valorCentavos = 9990L;
```

ou, em aulas futuras:

```java
BigDecimal
```

---

### Erro 10 — Usar tipo maior sem pensar no domínio

Nem todo número precisa ser `long`.

Exemplo:

```java
long idade = 30L;
```

Funciona, mas `int` é mais natural:

```java
int idade = 30;
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-025-tipos-inteiros
cd labs\m1\aula-025-tipos-inteiros
```

Crie arquivos:

```text
Main.java
LimitesInteiros.java
OverflowInteiro.java
TentativasLogin.java
Paginacao.java
AuditoriaMassiva.java
OrdemServicoInteiros.java
ProdutoEstoque.java
PagamentoCentavos.java
```

Compile:

```powershell
javac Main.java
javac LimitesInteiros.java
javac OverflowInteiro.java
javac TentativasLogin.java
javac Paginacao.java
javac AuditoriaMassiva.java
javac OrdemServicoInteiros.java
javac ProdutoEstoque.java
javac PagamentoCentavos.java
```

Execute:

```powershell
java Main
java LimitesInteiros
java OverflowInteiro
java TentativasLogin
java Paginacao
java AuditoriaMassiva
java OrdemServicoInteiros
java ProdutoEstoque
java PagamentoCentavos
```

Depois quebre os erros de propósito e registre no diário.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-025-tipos-inteiros docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 025: pratica tipos inteiros em Java"
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
explicar o que é número inteiro;
declarar byte;
declarar short;
declarar int;
declarar long;
explicar que cada tipo tem limite;
consultar Byte.MIN_VALUE e Byte.MAX_VALUE;
consultar Short.MIN_VALUE e Short.MAX_VALUE;
consultar Integer.MIN_VALUE e Integer.MAX_VALUE;
consultar Long.MIN_VALUE e Long.MAX_VALUE;
usar int para quantidades comuns;
usar long para valores grandes;
usar sufixo L;
evitar l minúsculo;
explicar overflow;
reproduzir overflow com int;
corrigir soma grande usando long;
usar underscore em números grandes;
aplicar inteiros em pedido, OS, auditoria e estoque;
entender valor em centavos em nível inicial;
diagnosticar valor fora do limite;
diagnosticar long sem L;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar tipos decimais.

Não precisa ainda dominar `BigDecimal`.

Não precisa ainda dominar conversões e casting profundamente.

Esses assuntos virão depois.

O objetivo é entender tipos inteiros e seus riscos iniciais.

---

## Fechamento da aula

Hoje estudamos os tipos inteiros de Java.

Eles parecem simples, mas carregam decisões importantes.

```text
byte e short existem, mas são menos comuns em regra de negócio;
int é o tipo inteiro mais comum;
long é essencial para valores grandes;
todo tipo tem limite;
overflow pode gerar bug silencioso;
o sufixo L evita erro em literais long;
nomes bons comunicam intenção.
```

Em backend, escolher tipo numérico não é detalhe.

Um contador, um ID, uma quantidade ou um valor em centavos mal representado pode gerar problema real.

Na próxima aula, vamos estudar tipos decimais e suas primeiras limitações.

Isso será essencial para entender por que números com casas decimais exigem cuidado especial em Java.
