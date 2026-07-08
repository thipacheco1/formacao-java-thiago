# 008 — M0.08 — Debug Inicial no IntelliJ

## Hoje a aula é sobre enxergar o programa por dentro

Muita gente aprende programação olhando apenas para o resultado final.

Escreve o código.

Clica em Run.

Olha o que apareceu no console.

Se apareceu o esperado, segue.

Se não apareceu, começa a chutar.

Esse é um jeito frágil de aprender.

Um desenvolvedor forte não pode depender de chute.

Ele precisa observar o programa em movimento.

É aí que entra o debug.

Debug é a prática de executar o código com pausa, linha por linha, olhando valores, caminhos, decisões e chamadas.

Debug transforma uma pergunta vaga:

```text
Por que não funcionou?
```

em perguntas melhores:

```text
Qual linha foi executada?
Qual valor essa variável tinha?
Essa condição entrou no if?
O laço repetiu quantas vezes?
Esse método foi chamado?
O valor mudou onde?
O erro aconteceu antes ou depois desta linha?
```

Debug é uma das habilidades que mais aceleram o aprendizado.

Não porque resolve tudo automaticamente.

Mas porque ensina a observar.

---

## Debug não é coisa de iniciante

Algumas pessoas pensam que debug é só para quem está aprendendo.

Isso é falso.

Profissionais experientes usam debug.

Às vezes menos, porque conseguem ler código melhor.

Mas usam quando precisam investigar comportamento com precisão.

Em backend real, debug pode ajudar em:

```text
regra de negócio;
validação;
cálculo;
fluxo de status;
mapeamento de DTO;
chamada de service;
persistência;
testes;
tratamento de erro;
integração;
concorrência local;
comportamento inesperado.
```

Em produção, muitas vezes não se debuga diretamente como no ambiente local.

Mas a mentalidade do debug continua:

```text
observar evidências;
seguir fluxo;
confirmar hipóteses;
reduzir chute.
```

Debug é uma escola de investigação.

---

## Run e Debug são coisas diferentes

No IntelliJ, o botão Run executa o programa normalmente.

O botão Debug executa com capacidade de pausa e inspeção.

Pense assim:

```text
Run:
executa do começo ao fim, se não houver erro.

Debug:
executa permitindo pausar, observar e avançar passo a passo.
```

Run responde:

```text
qual foi o resultado?
```

Debug responde:

```text
como o programa chegou nesse resultado?
```

Essa diferença é essencial.

Quando você está aprendendo Java, o “como” importa muito mais do que só o resultado.

---

## Breakpoint

Breakpoint é um ponto de parada.

Você marca uma linha do código e diz para a IDE:

```text
quando a execução chegar aqui, pare.
```

No IntelliJ, normalmente você marca um breakpoint clicando na margem esquerda da linha.

Aparece uma bolinha vermelha.

Exemplo:

```java
int total = preco * quantidade;
```

Se houver breakpoint nessa linha, ao executar em modo Debug o programa pausa ali.

A partir desse ponto, você pode observar:

```text
valores das variáveis;
linha atual;
próximas linhas;
pilha de chamadas;
fluxo de execução.
```

Breakpoint é a porta de entrada do debug.

---

## Linha atual

Quando o programa pausa no breakpoint, a IDE destaca a linha atual.

Essa linha é importante.

Ela indica:

```text
a execução está parada aqui
```

Mas há um detalhe:

em muitos debuggers, quando a linha está destacada, ela ainda pode não ter sido executada.

Ou seja, o programa está prestes a executar aquela linha.

Isso importa.

Exemplo:

```java
int total = preco * quantidade;
```

Se o debug parou nessa linha, talvez `total` ainda não tenha recebido o valor calculado.

Depois de avançar um passo, o valor aparece.

Esse detalhe evita confusão.

---

## Step Over

Step Over significa:

```text
execute esta linha e vá para a próxima,
sem entrar por dentro de métodos chamados.
```

Exemplo:

```java
int total = calcularTotal(preco, quantidade);
```

Se você usa Step Over, o debugger executa `calcularTotal(...)`, mas não entra dentro do método.

Ele pula para a próxima linha.

Use Step Over quando:

```text
você quer seguir o fluxo principal;
o método chamado não é o foco agora;
você confia naquela chamada;
quer avançar sem entrar em detalhes.
```

Step Over é o passo mais usado no começo.

---

## Step Into

Step Into significa:

```text
entre dentro do método chamado.
```

Exemplo:

```java
int total = calcularTotal(preco, quantidade);
```

Se você usa Step Into, o debugger entra no método:

```java
public static int calcularTotal(int preco, int quantidade) {
    return preco * quantidade;
}
```

Use Step Into quando:

```text
você quer entender o que o método faz;
suspeita que o erro está dentro dele;
quer observar parâmetros;
quer ver o retorno sendo produzido.
```

Step Into é essencial para aprender chamada de método.

Mas cuidado: em projetos grandes, ele pode entrar em código de biblioteca e te perder.

No começo, use com intenção.

---

## Step Out

Step Out significa:

```text
termine o método atual e volte para quem chamou.
```

Se você entrou em um método com Step Into e percebeu que não era ali o foco, use Step Out.

Ele executa o restante daquele método e volta para a linha seguinte da chamada.

Isso ajuda a não ficar preso.

---

## Resume Program

Resume Program significa:

```text
continue a execução até o próximo breakpoint ou até o fim.
```

Use quando:

```text
já observou o que precisava;
quer ir para outro breakpoint;
não precisa avançar linha por linha.
```

Se houver outro breakpoint, o programa pausa lá.

Se não houver, segue até terminar.

---

## Variables

A área de variáveis mostra os valores atuais.

Exemplo:

```java
int preco = 100;
int quantidade = 3;
int total = preco * quantidade;
```

Durante o debug, você pode ver:

```text
preco = 100
quantidade = 3
total = 300
```

Isso é extremamente importante.

Muitos erros acontecem porque a pessoa acha que a variável tem um valor, mas ela tem outro.

Debug troca achismo por evidência.

---

## Watches

Watch é uma expressão que você pede para a IDE observar.

Exemplo:

```java
preco * quantidade
```

ou:

```java
nome.isBlank()
```

ou:

```java
idade >= 18
```

A IDE calcula aquela expressão durante o debug.

Use watches quando quer acompanhar algo que não aparece diretamente como variável pronta.

No começo, não precisa usar muito.

Mas é bom saber que existe.

---

## Call Stack

Call Stack é a pilha de chamadas.

Ela mostra o caminho de métodos que levou até a linha atual.

Exemplo:

```text
main
processarPedido
calcularTotal
```

Isso significa:

```text
main chamou processarPedido
processarPedido chamou calcularTotal
o debug está parado dentro de calcularTotal
```

Call stack é uma das ferramentas mais importantes para entender fluxo em backend.

Em projeto real, você pode ver algo como:

```text
Controller
Service
Domain
Repository
```

A call stack ajuda a responder:

```text
quem chamou isso?
por qual caminho cheguei aqui?
qual camada iniciou esse fluxo?
```

No começo, isso parece avançado.

Mas a ideia é simples:

```text
call stack mostra o caminho até aqui.
```

---

## Debug como leitura de fluxo

O maior ganho do debug não é só ver variável.

É aprender fluxo.

Exemplo:

```java
if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}
```

Com debug, você vê:

```text
idade vale 20
condição idade >= 18 é verdadeira
entrou no if
não entrou no else
```

Isso parece óbvio em exemplo pequeno.

Mas em regra real com muitas condições, não é.

Exemplo:

```java
if (statusPermitido && possuiDataValida && !bloqueado) {
    reagendar();
}
```

Com debug, você consegue verificar:

```text
statusPermitido = true
possuiDataValida = false
bloqueado = false
```

Então a condição geral falhou por causa da data.

Sem debug, a pessoa pode ficar chutando.

---

## Exemplo mínimo: debug em cálculo simples

Crie uma classe:

```text
DebugCalculo.java
```

Código:

```java
public class DebugCalculo {
    public static void main(String[] args) {
        int preco = 100;
        int quantidade = 3;

        int total = preco * quantidade;

        System.out.println("Total: " + total);
    }
}
```

Coloque um breakpoint na linha:

```java
int total = preco * quantidade;
```

Execute em modo Debug.

Observe:

```text
preco
quantidade
total
```

Antes da linha executar, talvez `total` ainda não apareça ou esteja sem valor definido.

Use Step Over.

Agora observe `total`.

Ele deve ser:

```text
300
```

Esse exemplo ensina:

```text
breakpoint;
linha atual;
variáveis;
step over;
execução de atribuição.
```

É pequeno, mas forma a base.

---

## Exemplo com if

Crie:

```text
DebugCondicao.java
```

Código:

```java
public class DebugCondicao {
    public static void main(String[] args) {
        int idade = 17;

        if (idade >= 18) {
            System.out.println("Acesso permitido.");
        } else {
            System.out.println("Acesso bloqueado.");
        }

        System.out.println("Fim do programa.");
    }
}
```

Coloque breakpoint na linha do `if`.

Execute em Debug.

Observe:

```text
idade = 17
```

Agora avance com Step Over.

Veja qual bloco executa.

Depois altere:

```java
int idade = 18;
```

Compile/execute novamente pelo Debug.

Observe que agora o fluxo muda.

Essa prática ensina que debug não serve só para ver número.

Serve para ver decisão.

---

## Exemplo com laço

Crie:

```text
DebugLaco.java
```

Código:

```java
public class DebugLaco {
    public static void main(String[] args) {
        int total = 0;

        for (int i = 1; i <= 5; i++) {
            total = total + i;
            System.out.println("i = " + i + ", total = " + total);
        }

        System.out.println("Total final: " + total);
    }
}
```

Coloque breakpoint dentro do `for`, na linha:

```java
total = total + i;
```

Execute em Debug.

A cada Step Over, observe:

```text
i
total
```

Você verá o total acumulando.

Essa é uma das melhores formas de entender laço.

Sem debug, laço parece algo que “gira”.

Com debug, você vê cada repetição.

---

## Exemplo com método

Crie:

```text
DebugMetodo.java
```

Código:

```java
public class DebugMetodo {
    public static void main(String[] args) {
        int preco = 80;
        int quantidade = 4;

        int total = calcularTotal(preco, quantidade);

        System.out.println("Total: " + total);
    }

    public static int calcularTotal(int preco, int quantidade) {
        int resultado = preco * quantidade;
        return resultado;
    }
}
```

Coloque breakpoint na linha:

```java
int total = calcularTotal(preco, quantidade);
```

Execute em Debug.

Use Step Into.

Você deve entrar em:

```java
public static int calcularTotal(int preco, int quantidade)
```

Observe os parâmetros:

```text
preco = 80
quantidade = 4
```

Depois avance e observe:

```text
resultado = 320
```

Use Step Out ou continue com Step Over até voltar ao `main`.

Esse exemplo conecta debug com métodos.

Mais tarde, em backend, isso será parecido com entrar de Controller para Service.

---

## Exemplo aplicado ao domínio corporativo

Agora imagine uma regra de atividade.

Crie:

```text
DebugAtividade.java
```

Código:

```java
public class DebugAtividade {
    public static void main(String[] args) {
        String status = "AGENDADO";
        boolean possuiDataValida = true;
        boolean clienteBloqueado = false;

        boolean podeReagendar = podeReagendar(status, possuiDataValida, clienteBloqueado);

        if (podeReagendar) {
            System.out.println("Atividade pode ser reagendada.");
        } else {
            System.out.println("Atividade não pode ser reagendada.");
        }
    }

    public static boolean podeReagendar(String status, boolean possuiDataValida, boolean clienteBloqueado) {
        boolean statusPermitido = status.equals("AGENDADO") || status.equals("REAGENDADO");

        return statusPermitido && possuiDataValida && !clienteBloqueado;
    }
}
```

Coloque breakpoint em:

```java
boolean podeReagendar = podeReagendar(status, possuiDataValida, clienteBloqueado);
```

Use Step Into.

Observe dentro do método:

```text
status
possuiDataValida
clienteBloqueado
statusPermitido
retorno final
```

Agora altere cenários:

```java
String status = "CONCLUIDO";
```

ou:

```java
boolean possuiDataValida = false;
```

ou:

```java
boolean clienteBloqueado = true;
```

Veja o fluxo mudar.

Isso é backend em miniatura.

A regra é pequena, mas a mentalidade é real:

```text
validar estado;
calcular permissão;
tomar decisão;
observar caminho.
```

---

## Debug e regra de negócio

Regra de negócio muitas vezes falha não porque o Java está errado.

Falha porque uma condição não representa o que o negócio queria.

Exemplo:

```java
return statusPermitido && possuiDataValida && !clienteBloqueado;
```

Essa linha parece simples.

Mas ela embute uma regra:

```text
só pode reagendar se o status for permitido,
a data for válida
e o cliente não estiver bloqueado.
```

Com debug, você valida cada parte.

Isso ajuda a responder:

```text
qual condição impediu?
qual variável veio diferente?
a regra está escrita corretamente?
o problema é entrada, cálculo ou decisão?
```

Esse raciocínio será usado em services, validators, use cases e domínio.

---

## Debug e leitura de erro

Quando um erro acontece, o debug ajuda a chegar antes do erro.

Exemplo:

```java
String nome = null;
System.out.println(nome.length());
```

Isso gera erro em execução.

Com debug, você para antes da linha e vê:

```text
nome = null
```

Aí entende por que `nome.length()` falha.

Mais tarde, quando aparecer um `NullPointerException` em projeto real, a lógica será parecida:

```text
qual variável estava null?
quem deveria ter preenchido?
essa ausência é permitida?
deveria validar antes?
deveria usar Optional?
deveria lançar exceção de domínio?
```

Debug não é só consertar.

Debug ensina a fazer perguntas melhores.

---

## Debug e teste

Quando estudarmos testes, debug também será útil.

Você poderá debugar um teste para entender:

```text
arrange;
act;
assert;
dados preparados;
método chamado;
resultado retornado;
comparação esperada.
```

Muita gente escreve teste e não entende por que falha.

Debug em teste mostra o fluxo.

Isso é especialmente útil em:

```text
Mockito;
builders;
testes de service;
testes de repository;
testes de controller;
Testcontainers.
```

Mas a base começa agora.

---

## Debug e backend Spring

Mais tarde, em Spring Boot, debug será usado para observar:

```text
controller recebendo requisição;
DTO preenchido;
validação;
service executando;
repository sendo chamado;
entidade sendo montada;
exceção sendo tratada;
retorno HTTP sendo construído.
```

O fluxo conceitual será:

```text
requisição
↓
controller
↓
service
↓
domínio
↓
repository
↓
banco
```

Com debug, você pode seguir parte desse caminho.

Mas atenção: em framework, há muito código interno.

Por isso, precisamos aprender desde cedo a usar Step Over e Step Into com intenção.

Nem toda chamada merece ser aberta.

---

## Quando não usar debug

Debug é poderoso, mas não é a única ferramenta.

Às vezes é melhor usar:

```text
leitura de código;
teste automatizado;
log;
mensagem de erro;
documentação;
análise de banco;
reprodução mínima;
revisão com outra pessoa.
```

Debug pode ser ruim quando:

```text
você fica entrando em tudo sem objetivo;
usa debug para compensar código ilegível;
não escreve teste;
não lê erro;
não entende o fluxo geral;
depende dele para qualquer coisa simples.
```

O objetivo é usar debug como investigação.

Não como bengala eterna.

---

## Erros comuns

### Erro 1 — Clicar em Run achando que está debugando

Run executa normal.

Debug executa com pausa.

Se o breakpoint não parou, verifique se usou Debug, não Run.

---

### Erro 2 — Colocar breakpoint em linha que não executa

Se uma linha está dentro de um `if` que não entra, o breakpoint não será atingido.

Exemplo:

```java
if (idade >= 18) {
    System.out.println("Permitido");
}
```

Se `idade = 17`, um breakpoint dentro do bloco não para.

Coloque breakpoint antes do `if` para observar a condição.

---

### Erro 3 — Não perceber que a linha atual ainda não executou

Se parou na linha:

```java
int total = preco * quantidade;
```

talvez `total` ainda não tenha sido atualizado.

Use Step Over para executar a linha.

---

### Erro 4 — Usar Step Into sem critério

Step Into pode entrar em métodos internos ou bibliotecas.

No começo, entre apenas em métodos seus.

Se entrar onde não queria, use Step Out.

---

### Erro 5 — Ignorar Variables

A área de variáveis é uma das partes mais importantes.

Não avance linha por linha sem olhar valores.

Debug sem observar variável vira teatro.

---

### Erro 6 — Não olhar Call Stack

Quando estiver perdido, olhe a call stack.

Ela mostra quem chamou quem.

Isso ajuda muito em métodos.

---

### Erro 7 — Manter muitos breakpoints

Muitos breakpoints podem deixar a execução confusa.

Use poucos, com objetivo claro.

Remova os que não precisa.

---

### Erro 8 — Debugar sem hipótese

Antes de debugar, diga mentalmente:

```text
quero descobrir por que esta condição falhou
quero ver o valor desta variável
quero saber se este método foi chamado
quero entender onde o total muda
```

Debug com hipótese é investigação.

Debug sem hipótese vira passeio.

---

## Roteiro de diagnóstico com debug

Quando um comportamento estiver errado:

### 1. Descreva o esperado

```text
Eu esperava que entrasse no if.
```

### 2. Descreva o observado

```text
Entrou no else.
```

### 3. Coloque breakpoint antes da decisão

```java
if (condicao) {
```

### 4. Execute em Debug

Não use Run.

### 5. Observe as variáveis envolvidas

```text
status
data
bloqueado
valor
quantidade
```

### 6. Avance com Step Over

Veja o caminho.

### 7. Use Step Into se o problema estiver dentro de método

Entre apenas onde faz sentido.

### 8. Corrija a causa, não o sintoma

Se a variável veio errada, descubra de onde veio.

Não apenas force valor.

---

## Atividade guiada

Esta prática vale a pena fazer no IntelliJ.

Crie uma classe:

```text
DebugAtividade.java
```

Código:

```java
public class DebugAtividade {
    public static void main(String[] args) {
        String status = "AGENDADO";
        boolean possuiDataValida = true;
        boolean clienteBloqueado = false;

        boolean podeReagendar = podeReagendar(status, possuiDataValida, clienteBloqueado);

        if (podeReagendar) {
            System.out.println("Atividade pode ser reagendada.");
        } else {
            System.out.println("Atividade não pode ser reagendada.");
        }
    }

    public static boolean podeReagendar(String status, boolean possuiDataValida, boolean clienteBloqueado) {
        boolean statusPermitido = status.equals("AGENDADO") || status.equals("REAGENDADO");

        return statusPermitido && possuiDataValida && !clienteBloqueado;
    }
}
```

Faça:

```text
1. coloque breakpoint na chamada de podeReagendar;
2. execute em Debug;
3. use Step Into;
4. observe status, possuiDataValida e clienteBloqueado;
5. observe statusPermitido;
6. altere o status para CONCLUIDO;
7. rode de novo;
8. observe por que o resultado mudou.
```

Essa prática é pequena, mas muito importante.

Ela treina o olhar para regra de negócio.

---

## O que aprendi
Aprendi que debug permite observar o programa em execução, acompanhar variáveis, decisões, laços e chamadas de método.

## Conceitos principais
- Breakpoint
- Linha atual
- Step Over
- Step Into
- Step Out
- Resume Program
- Variables
- Watches
- Call Stack

## Exemplo praticado
DebugAtividade.java

## O que observei
- valor de status:
- valor de possuiDataValida:
- valor de clienteBloqueado:
- valor de statusPermitido:
- resultado final de podeReagendar:

## Erros que quero evitar
- clicar em Run em vez de Debug;
- colocar breakpoint em linha que não executa;
- avançar sem olhar variáveis;
- usar Step Into sem intenção;
- debugar sem hipótese.

## Frase principal
Debug troca chute por evidência.
```

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar a diferença entre Run e Debug;
criar um breakpoint;
executar em modo Debug;
entender a linha atual;
usar Step Over;
usar Step Into;
usar Step Out;
usar Resume Program;
observar variáveis;
entender o uso básico de Watches;
entender Call Stack;
debugar um if;
debugar um laço;
debugar uma chamada de método;
usar debug para entender uma regra de negócio simples;
evitar debug sem hipótese;
relacionar debug com backend, testes e investigação de erro.
```

Não precisa dominar debug avançado.

Precisa começar a observar o programa por dentro.

---

## Fechamento da aula

Debug é uma mudança de postura.

Sem debug, o aprendizado fica muito baseado em tentativa e erro.

Com debug, você começa a ver o fluxo.

Você para de perguntar apenas:

```text
funcionou ou não funcionou?
```

E começa a perguntar:

```text
por que foi por esse caminho?
qual valor decidiu isso?
quem chamou esse método?
onde o dado mudou?
```

Essas perguntas formam raciocínio de desenvolvedor.

Na próxima aula, vamos instalar e configurar o Git de forma correta.

Git será a base da rastreabilidade da formação e, mais tarde, da colaboração profissional.
