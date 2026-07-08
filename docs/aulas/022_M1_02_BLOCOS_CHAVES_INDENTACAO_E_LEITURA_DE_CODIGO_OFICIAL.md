# 022 — M1.02 — Blocos, Chaves, Indentação e Leitura de Código

## Hoje a aula é sobre enxergar a estrutura do código

Quando alguém começa em Java, é comum olhar para o código e ver apenas um monte de símbolos:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Mas um desenvolvedor precisa enxergar camadas:

```text
classe
└── método main
    └── instrução println
```

O código não é uma massa de texto.

Ele tem estrutura.

As chaves `{}` delimitam blocos.

A indentação mostra visualmente esses blocos.

A leitura correta permite entender o que pertence a quê.

Essa habilidade será usada em todas as próximas aulas.

---

## O que é um bloco

Bloco é uma região de código delimitada por chaves.

Exemplo:

```java
{
    System.out.println("Dentro de um bloco");
}
```

Em Java, blocos aparecem em muitos lugares:

```text
classe;
método;
if;
else;
for;
while;
switch;
try;
catch;
blocos isolados.
```

No primeiro programa, já existem dois blocos:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Bloco da classe:

```java
public class Main {
    ...
}
```

Bloco do método:

```java
public static void main(String[] args) {
    ...
}
```

O método está dentro da classe.

A instrução está dentro do método.

---

## O que são chaves

As chaves são:

```java
{
}
```

A chave de abertura:

```java
{
```

abre um bloco.

A chave de fechamento:

```java
}
```

fecha um bloco.

Tudo entre elas pertence ao bloco.

Exemplo:

```java
public class Main {
    // aqui dentro é o bloco da classe
}
```

Outro exemplo:

```java
public static void main(String[] args) {
    // aqui dentro é o bloco do método
}
```

Regra mental:

```text
abriu chave, começou um bloco;
fechou chave, terminou aquele bloco.
```

---

## Blocos aninhados

Blocos podem existir dentro de outros blocos.

Isso se chama aninhamento.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Aqui temos:

```text
bloco da classe Main
    bloco do método main
        instrução System.out.println
```

O método está aninhado dentro da classe.

A instrução está aninhada dentro do método.

Mais tarde, veremos:

```java
if (condicao) {
    if (outraCondicao) {
        System.out.println("Bloco dentro de bloco");
    }
}
```

Esse é outro bloco aninhado.

Se você não entende aninhamento, o código parece uma confusão.

Se entende, consegue ler de fora para dentro.

---

## Leitura de fora para dentro

Uma boa forma de ler código Java é de fora para dentro.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Primeiro:

```text
existe uma classe chamada Main.
```

Depois:

```text
dentro dela existe um método main.
```

Depois:

```text
dentro do método existe uma instrução que imprime texto.
```

Leitura:

```text
classe Main
-> método main
-> imprime "Olá, Java!"
```

Essa leitura organizada evita se perder.

---

## Leitura de dentro para fora

Às vezes, também lemos de dentro para fora.

Pegue a linha:

```java
System.out.println("Olá, Java!");
```

Pergunte:

```text
essa linha está dentro de qual método?
```

Resposta:

```text
main.
```

Depois:

```text
esse método está dentro de qual classe?
```

Resposta:

```text
Main.
```

Então:

```text
System.out.println pertence ao main,
e o main pertence à classe Main.
```

Essa leitura ajuda no diagnóstico.

Quando uma linha está no lugar errado, você percebe.

---

## Indentação

Indentação é o recuo visual do código.

Exemplo ruim:

```java
public class Main {
public static void main(String[] args) {
System.out.println("Olá");
}
}
```

Exemplo bom:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Os dois podem compilar.

Mas o segundo é legível.

A indentação mostra a hierarquia:

```text
classe
    método
        instrução
```

Indentação não é só estética.

É leitura.

É comunicação.

É manutenção.

---

## Java não depende da indentação para compilar

Em Java, a indentação não define o bloco.

Quem define o bloco são as chaves.

Este código pode compilar:

```java
public class Main {
public static void main(String[] args) {
System.out.println("Olá");
}
}
```

Mas isso não significa que ele é bom.

O compilador entende pelas chaves.

Humanos entendem melhor pela indentação.

Um desenvolvedor profissional escreve para o compilador e para pessoas.

O código precisa funcionar e ser legível.

---

## Indentação padrão

Um padrão comum é usar 4 espaços por nível.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Nível 2");
    }
}
```

Níveis:

```text
nível 0: public class Main
nível 1: public static void main
nível 2: System.out.println
```

Não misture tabulação e espaços sem critério.

A IDE geralmente cuida disso.

Atalho útil no IntelliJ:

```text
Ctrl + Alt + L
```

Esse atalho reformata o código conforme o padrão configurado.

---

## Formatação automática não substitui entendimento

O IntelliJ pode formatar o código.

Mas a pessoa precisa entender o resultado.

Se você escreve código bagunçado e aperta:

```text
Ctrl + Alt + L
```

a IDE pode arrumar indentação.

Mas se as chaves estiverem erradas, ela não adivinha a intenção.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
}
    }
```

A formatação pode revelar que algo está estranho.

Mas você precisa ler e corrigir.

Ferramenta ajuda.

Entendimento decide.

---

## Escopo visual

Escopo visual é a área que você enxerga como pertencente a um bloco.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("A");
        System.out.println("B");
    }
}
```

Visualmente:

```text
as duas linhas println pertencem ao método main.
```

Porque estão indentadas dentro dele.

Mais tarde, quando estudarmos variáveis, escopo será também uma regra da linguagem:

```text
variável criada dentro de um bloco só existe ali dentro.
```

Nesta aula, ainda estamos focando no escopo visual.

Mas esse conceito prepara o escopo real.

---

## Mapa mental de blocos

Para qualquer código, desenhe mentalmente:

```text
Classe
└── Método
    └── Instruções
```

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Início");
        System.out.println("Fim");
    }
}
```

Mapa:

```text
Main
└── main
    ├── println("Início")
    └── println("Fim")
```

Esse tipo de leitura ajuda muito em código grande.

Mais tarde, em backend, você lerá classes com:

```text
atributos;
construtores;
métodos;
ifs;
loops;
chamadas de serviços;
tratamento de erro.
```

Sem mapa mental, tudo parece pesado.

Com mapa, fica navegável.

---

## O menor exemplo possível com blocos

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Blocos e chaves");
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
Blocos e chaves
```

Agora identifique:

```text
onde começa a classe?
onde termina a classe?
onde começa o método?
onde termina o método?
qual linha está dentro do método?
```

Essa é a prática mais importante.

---

## Marcando blocos com comentários didáticos

Para aprender, você pode escrever comentários temporários:

```java
public class Main { // início da classe

    public static void main(String[] args) { // início do método
        System.out.println("Blocos e chaves");
    } // fim do método

} // fim da classe
```

Isso ajuda no começo.

Mas não transforme esse tipo de comentário em hábito permanente.

Em código profissional, comentários assim geralmente são desnecessários.

Eles servem como treino.

Depois, a indentação deve ser suficiente.

---

## Blocos com múltiplas instruções

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Preparando ambiente...");
        System.out.println("Executando validação...");
        System.out.println("Finalizado.");
    }
}
```

As três instruções pertencem ao método `main`.

Mapa:

```text
Main
└── main
    ├── println("Preparando ambiente...")
    ├── println("Executando validação...")
    └── println("Finalizado.")
```

O Java executa de cima para baixo.

A indentação mostra que todas estão no mesmo nível.

---

## Bloco vazio

Um bloco pode estar vazio.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
    }
}
```

Esse programa compila e executa, mas não imprime nada.

Por quê?

Porque o método `main` existe, mas não há instrução dentro dele.

Isso ajuda a entender:

```text
bloco define espaço;
instruções dentro dele definem ação.
```

---

## Código fora do método

Erro comum:

```java
public class Main {
    public static void main(String[] args) {
    }

    System.out.println("Olá");
}
```

A linha:

```java
System.out.println("Olá");
```

está dentro da classe, mas fora de um método.

Isso não é permitido como instrução solta nesse contexto.

Correção:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Regra inicial:

```text
instruções executáveis precisam estar dentro de um método.
```

Mais tarde veremos exceções e inicializadores, mas agora fique com essa regra.

---

## Código fora da classe

Erro:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}

System.out.println("Fora da classe");
```

Essa última linha está fora da classe.

Java não aceita instrução solta fora da classe.

Regra inicial:

```text
em Java, o código fica dentro de classes;
instruções executáveis ficam dentro de métodos.
```

---

## Chaves desalinhadas

Observe:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
}
}
```

Pode compilar.

Mas a indentação mostra problema:

```text
a chave de fechamento do método deveria alinhar com a linha do método.
a chave de fechamento da classe deveria alinhar com a linha da classe.
```

Formato melhor:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Chave de fechamento deve alinhar com o início do bloco que ela fecha.

---

## Regra visual de fechamento

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

A chave:

```java
    }
```

fecha o método.

Ela está alinhada com:

```java
    public static void main(String[] args) {
```

A chave:

```java
}
```

fecha a classe.

Ela está alinhada com:

```java
public class Main {
```

Essa regra visual ajuda a achar erro rapidamente.

---

## Blocos e leitura com `if` conceitual

Ainda não vamos estudar `if` profundamente.

Mas um exemplo visual ajuda.

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            System.out.println("Dentro do if");
        }

        System.out.println("Depois do if");
    }
}
```

Mapa:

```text
Main
└── main
    ├── if
    │   └── println("Dentro do if")
    └── println("Depois do if")
```

Perceba:

```text
o println dentro do if está mais indentado;
o println depois do if voltou um nível.
```

Isso será essencial quando estudarmos controle de fluxo.

---

## Blocos aninhados com `if` conceitual

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            if (true) {
                System.out.println("Bloco interno");
            }
        }
    }
}
```

Mapa:

```text
Main
└── main
    └── if externo
        └── if interno
            └── println("Bloco interno")
```

Cada bloco interno aumenta um nível de indentação.

Se houver muitos níveis, o código pode ficar difícil de ler.

Mais tarde aprenderemos formas de reduzir aninhamento.

---

## Exemplo aplicado ao domínio corporativo

Imagine que estamos imprimindo uma validação de pedido.

Arquivo:

```text
ValidacaoPedido.java
```

Código:

```java
public class ValidacaoPedido {
    public static void main(String[] args) {
        System.out.println("Iniciando validação do pedido");

        if (true) {
            System.out.println("Pedido encontrado");

            if (true) {
                System.out.println("Cliente ativo");
            }
        }

        System.out.println("Validação finalizada");
    }
}
```

Ainda não estamos estudando `if` como regra lógica.

Nesta aula, use o exemplo para leitura de blocos.

Mapa:

```text
ValidacaoPedido
└── main
    ├── println("Iniciando validação do pedido")
    ├── if
    │   ├── println("Pedido encontrado")
    │   └── if
    │       └── println("Cliente ativo")
    └── println("Validação finalizada")
```

Observe que a última linha está fora dos `ifs`, mas dentro do `main`.

Essa distinção é muito importante.

---

## Exemplo aplicado à ordem de serviço

Arquivo:

```text
LeituraOrdemServico.java
```

Código:

```java
public class LeituraOrdemServico {
    public static void main(String[] args) {
        System.out.println("Ordem de Serviço");

        if (true) {
            System.out.println("Status: ABERTA");

            if (true) {
                System.out.println("Atividade: AGENDADA");
            }

            System.out.println("Checklist: PENDENTE");
        }

        System.out.println("Fim da leitura");
    }
}
```

Perguntas de leitura:

```text
Qual println está dentro do if externo?
Qual println está dentro do if interno?
Qual println está fora do if interno, mas dentro do if externo?
Qual println está fora dos ifs, mas dentro do main?
```

Respostas:

```text
Status, Atividade e Checklist estão dentro do if externo.
Atividade está dentro do if interno.
Checklist está fora do if interno, mas dentro do if externo.
Fim da leitura está fora dos ifs, mas dentro do main.
```

Essa leitura será usada o tempo todo em backend.

---

## Por que isso importa em backend real

Em backend, é comum encontrar código com estruturas assim:

```java
public class PedidoService {
    public void aprovarPedido() {
        if (...) {
            if (...) {
                if (...) {
                    ...
                }
            }
        }
    }
}
```

Se a pessoa não sabe ler blocos, ela se perde.

Mais tarde, vamos aprender que aninhamento excessivo pode indicar código ruim.

Mas antes de melhorar, é preciso enxergar.

Blocos mostram:

```text
onde uma regra começa;
onde uma regra termina;
o que está dentro de uma condição;
o que executa sempre;
o que executa só em um cenário;
onde uma variável existe;
onde um método termina.
```

Essa aula é base para leitura profissional.

---

## Leitura ativa de código

Não leia código passivamente.

Faça perguntas:

```text
qual é a classe?
quais métodos existem?
onde o método começa?
onde termina?
quantos blocos existem?
quais blocos estão aninhados?
qual linha está dentro de qual bloco?
o que executa sempre?
o que executa só dentro de uma condição?
a indentação combina com as chaves?
```

Esse tipo de leitura transforma código em estrutura mental.

---

## Usando o IntelliJ para enxergar blocos

O IntelliJ ajuda com recursos visuais:

```text
realce de chaves correspondentes;
linhas de indentação;
colapso de blocos;
formatação automática;
atalho para navegar no código;
avisos de erro;
estrutura do arquivo.
```

Atalhos úteis:

```text
Ctrl + Alt + L -> reformatar;
Ctrl + Shift + A -> buscar ação;
Alt + 1 -> Project;
Shift Shift -> buscar arquivos;
Ctrl + E -> arquivos recentes.
```

Também é possível clicar próximo a uma chave e ver qual chave corresponde.

Use a IDE para aprender a enxergar.

---

## Formatando código bagunçado

Pegue este código:

```java
public class Main {
public static void main(String[] args) {
if (true) {
System.out.println("A");
if (true) {
System.out.println("B");
}
System.out.println("C");
}
System.out.println("D");
}
}
```

No IntelliJ, use:

```text
Ctrl + Alt + L
```

Resultado esperado:

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            System.out.println("A");
            if (true) {
                System.out.println("B");
            }
            System.out.println("C");
        }
        System.out.println("D");
    }
}
```

Agora fica muito mais fácil ler.

Mapa:

```text
Main
└── main
    ├── if externo
    │   ├── println("A")
    │   ├── if interno
    │   │   └── println("B")
    │   └── println("C")
    └── println("D")
```

---

## Quando a formatação revela erro

Código:

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            System.out.println("A");
        }
            System.out.println("B");
    }
}
```

Visualmente, parece que `B` pode estar ligado ao `if`, mas não está.

Ele está fora do `if`.

Formato correto deixa claro:

```java
public class Main {
    public static void main(String[] args) {
        if (true) {
            System.out.println("A");
        }
        System.out.println("B");
    }
}
```

`B` executa depois do `if`.

Isso é leitura de bloco.

---

## Erros comuns

### Erro 1 — Faltar chave de fechamento

Sintoma:

```text
reached end of file while parsing
```

ou erro parecido.

Causa provável:

```text
algum bloco foi aberto e não foi fechado.
```

Correção:

```text
verificar chaves;
usar formatação;
conferir pares de abertura e fechamento.
```

---

### Erro 2 — Chave sobrando

Sintoma:

```text
class, interface, enum, or record expected
```

ou erro parecido.

Causa provável:

```text
uma chave fechou a classe antes da hora;
existe código fora da classe;
existe chave a mais.
```

---

### Erro 3 — Código executável fora do método

Errado:

```java
public class Main {
    System.out.println("Olá");
}
```

Correto:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

---

### Erro 4 — Indentação enganosa

Código visualmente alinhado errado pode fazer parecer que uma linha pertence a um bloco, mas as chaves dizem outra coisa.

Correção:

```text
formatar com Ctrl + Alt + L;
ler pelas chaves;
não confiar só no olho quando a indentação está ruim.
```

---

### Erro 5 — Chaves na ordem errada

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("A");
}
        System.out.println("B");
}
```

A linha `B` ficou fora do método.

Correção:

```text
alinhar fechamento do método depois de todas as instruções que pertencem a ele.
```

---

### Erro 6 — Colar código sem reformatar

Copiar código de internet, PDF ou chat pode trazer indentação ruim.

Correção:

```text
colar;
formatar;
ler;
só depois executar.
```

---

### Erro 7 — Confundir fechamento de método com fechamento de classe

Em:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

A primeira chave final fecha o método.

A segunda fecha a classe.

Saber isso é obrigatório.

---

### Erro 8 — Muitos blocos aninhados sem necessidade

Ainda não vamos refatorar profundamente, mas código com muitos níveis fica difícil.

Sinal de alerta:

```text
if dentro de if dentro de if dentro de if.
```

Mais tarde, vamos aprender técnicas para simplificar.

---

### Erro 9 — Não usar a IDE para ajudar

A IDE realça chaves, formata, mostra erro e ajuda a navegar.

Use.

Mas não dependa cegamente.

---

### Erro 10 — Não ler erro do compilador

O compilador geralmente aponta linha e tipo de erro.

Leia antes de mexer aleatoriamente.

---

## Exemplo de leitura guiada

Código:

```java
public class Analise {
    public static void main(String[] args) {
        System.out.println("Início");

        if (true) {
            System.out.println("Dentro do primeiro bloco");

            if (true) {
                System.out.println("Dentro do segundo bloco");
            }

            System.out.println("Voltando ao primeiro bloco");
        }

        System.out.println("Fim");
    }
}
```

Leia assim:

```text
Classe: Analise
Método: main
Linha 1 do main: imprime Início
Abre if externo
Dentro do if externo: imprime Dentro do primeiro bloco
Abre if interno
Dentro do if interno: imprime Dentro do segundo bloco
Fecha if interno
Ainda dentro do if externo: imprime Voltando ao primeiro bloco
Fecha if externo
Fora dos ifs, dentro do main: imprime Fim
Fecha main
Fecha classe
```

Essa leitura parece lenta no começo.

Depois fica natural.

---

## Atividade guiada

Crie pasta:

```powershell
mkdir labs\m1\aula-022-blocos-chaves-indentacao
cd labs\m1\aula-022-blocos-chaves-indentacao
```

Crie três arquivos:

```text
Main.java
ValidacaoPedido.java
LeituraOrdemServico.java
```

### `Main.java`

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Blocos e chaves");
    }
}
```

### `ValidacaoPedido.java`

```java
public class ValidacaoPedido {
    public static void main(String[] args) {
        System.out.println("Iniciando validação do pedido");

        if (true) {
            System.out.println("Pedido encontrado");

            if (true) {
                System.out.println("Cliente ativo");
            }
        }

        System.out.println("Validação finalizada");
    }
}
```

### `LeituraOrdemServico.java`

```java
public class LeituraOrdemServico {
    public static void main(String[] args) {
        System.out.println("Ordem de Serviço");

        if (true) {
            System.out.println("Status: ABERTA");

            if (true) {
                System.out.println("Atividade: AGENDADA");
            }

            System.out.println("Checklist: PENDENTE");
        }

        System.out.println("Fim da leitura");
    }
}
```

Compile:

```powershell
javac Main.java
javac ValidacaoPedido.java
javac LeituraOrdemServico.java
```

Execute:

```powershell
java Main
java ValidacaoPedido
java LeituraOrdemServico
```

Depois quebre uma chave de propósito, compile, leia o erro e corrija.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-022-blocos-chaves-indentacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 022: pratica blocos chaves e indentacao"
```

Valide:

```bash
git status
```

Se aparecer `.class`, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é um bloco;
explicar o papel das chaves;
identificar bloco de classe;
identificar bloco de método;
identificar blocos aninhados;
ler código de fora para dentro;
ler código de dentro para fora;
explicar indentação;
explicar que Java compila pelas chaves, não pela indentação;
usar Ctrl + Alt + L para formatar;
perceber indentação enganosa;
corrigir chave faltando;
corrigir chave sobrando;
identificar código fora do método;
identificar código fora da classe;
compilar exemplos com javac;
executar exemplos com java;
quebrar código de propósito e interpretar erro;
registrar a aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `if`.

Não precisa ainda dominar escopo de variável.

Não precisa ainda saber refatorar aninhamento.

O objetivo é enxergar estrutura.

---

## Fechamento da aula

Hoje aprendemos a ler a arquitetura visual do código Java.

Antes de variáveis, antes de operadores, antes de `if`, antes de loops, vem uma habilidade simples e poderosa:

```text
saber onde cada bloco começa e termina.
```

Chaves definem estrutura.

Indentação revela estrutura.

Leitura correta evita erro.

Formatação automática ajuda.

Diagnóstico de chaves evita perda de tempo.

Na próxima aula, vamos estudar comentários úteis e documentação inicial.

Isso vai reforçar outra habilidade importante:

```text
escrever código que outras pessoas conseguem entender.
```
