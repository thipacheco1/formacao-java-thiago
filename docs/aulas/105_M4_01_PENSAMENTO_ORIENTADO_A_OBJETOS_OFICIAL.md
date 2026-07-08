# 105 — M4.01 — Pensamento orientado a objetos

## Objetivo da aula

Nesta aula você vai mudar a forma de pensar sobre código.

Até agora, organizamos programas principalmente como fluxo de funções:

```text
ler;
validar;
calcular;
processar;
exibir.
```

Isso foi essencial. Antes de aprender Orientação a Objetos, você precisava saber organizar lógica procedural com clareza.

Agora vamos começar a pensar de outra forma:

```text
quais coisas existem no problema?
quais dados essas coisas carregam?
quais ações essas coisas conseguem executar?
como essas coisas se relacionam?
```

Esse é o começo do pensamento orientado a objetos.

Ao final da aula, você deve conseguir explicar com suas palavras:

```text
o que é classe;
o que é objeto;
o que é estado;
o que é comportamento;
o que é identidade;
qual a diferença entre pensar de forma procedural e pensar de forma orientada a objetos.
```

---

## Por que isso importa para backend Java

Java é uma linguagem fortemente orientada a objetos.

Mesmo quando usamos Spring Boot, APIs REST, banco de dados, mensageria, testes e arquitetura, a base continua aparecendo em conceitos como:

```text
entidades;
DTOs;
services;
repositories;
controllers;
value objects;
records;
enums;
objetos de request;
objetos de response;
objetos de domínio.
```

Se o aluno não entende classe, objeto, estado, comportamento e identidade, ele até consegue copiar código, mas não entende o desenho do sistema.

Orientação a Objetos não é só sintaxe.

É uma forma de modelar problemas.

---

## O problema do pensamento apenas procedural

Vamos imaginar uma Ordem de Serviço.

Em uma abordagem procedural simples, poderíamos ter dados soltos:

```java
String certificado = "OS-001";
String cliente = "Ana";
String status = "ABERTA";
int diasEmAberto = 6;
int reagendamentos = 2;
```

E funções separadas:

```java
boolean atrasada = diasEmAberto > 3;
boolean precisaAtencao = atrasada || reagendamentos >= 2;
```

Isso funciona.

Mas conforme o sistema cresce, os dados começam a se espalhar:

```text
certificado em uma variável;
cliente em outra;
status em outra;
regras em métodos soltos;
validações em outro lugar;
exibição em outro lugar.
```

O risco é perder a ideia principal:

```text
esses dados pertencem a uma mesma coisa.
```

Essa “coisa” é a Ordem de Serviço.

Orientação a Objetos começa quando você percebe que certos dados e comportamentos pertencem ao mesmo conceito.

---

## A mudança de mentalidade

Pensamento procedural pergunta:

```text
quais passos meu programa executa?
```

Pensamento orientado a objetos pergunta:

```text
quais objetos existem neste problema?
```

Pensamento procedural tende a organizar assim:

```text
função ler OS;
função validar OS;
função calcular atraso;
função definir fila;
função imprimir OS.
```

Pensamento orientado a objetos começa a enxergar:

```text
existe uma OrdemServico;
ela possui certificado, cliente, status, data;
ela sabe dizer se está atrasada;
ela sabe dizer se precisa de atenção;
ela pode informar sua fila sugerida.
```

Isso não elimina funções.

Mas muda o centro do raciocínio.

Em vez de dados soltos passando por vários métodos, começamos a criar objetos que representam conceitos do problema.

---

## Classe

Classe é um molde.

Ela descreve quais dados e comportamentos um tipo de objeto terá.

Exemplo conceitual:

```text
Classe: OrdemServico

Dados:
- certificado
- cliente
- status
- dias em aberto
- quantidade de reagendamentos

Comportamentos:
- está atrasada?
- precisa de atenção?
- qual fila sugerida?
```

A classe não é uma OS específica.

Ela é o modelo para criar OS específicas.

Pense assim:

```text
Classe = molde
Objeto = coisa criada a partir do molde
```

---

## Objeto

Objeto é uma instância concreta de uma classe.

Se `OrdemServico` é o molde, estas podem ser instâncias:

```text
OS-001 da cliente Ana;
OS-002 do cliente Carlos;
OS-003 da cliente Maria.
```

Todas seguem o mesmo molde, mas cada uma tem seus próprios dados.

Exemplo:

```text
Objeto 1:
certificado = OS-001
cliente = Ana
status = ABERTA
dias em aberto = 6

Objeto 2:
certificado = OS-002
cliente = Carlos
status = CONCLUIDA
dias em aberto = 1
```

A classe é uma definição.

O objeto é uma ocorrência real em memória.

---

## Estado

Estado é o conjunto de dados atuais de um objeto.

Para uma Ordem de Serviço, o estado pode ser:

```text
certificado;
cliente;
status;
dias em aberto;
reagendamentos.
```

Exemplo:

```text
certificado = OS-001
cliente = Ana
status = REAGENDADA
dias em aberto = 7
reagendamentos = 2
```

Esse é o estado daquele objeto naquele momento.

Se o status mudar de `REAGENDADA` para `CONCLUIDA`, o estado mudou.

Objetos carregam estado.

---

## Comportamento

Comportamento é aquilo que o objeto consegue fazer ou responder.

Uma Ordem de Serviço pode responder:

```text
estou atrasada?
preciso de atenção?
qual minha fila sugerida?
posso ser concluída?
posso ser reagendada?
```

Em Java, comportamento aparece como método.

Exemplo conceitual:

```java
boolean atrasada() {
    return diasEmAberto > 3;
}
```

Esse método usa o estado do objeto para responder uma pergunta.

Esse é um ponto importante:

```text
objeto junta dados e comportamento relacionado a esses dados.
```

---

## Identidade

Identidade é o que diferencia um objeto de outro.

Duas OS podem ter dados parecidos, mas ainda serem OS diferentes.

Exemplo:

```text
OS-001
cliente Ana
status ABERTA
```

e

```text
OS-002
cliente Ana
status ABERTA
```

Mesmo cliente, mesmo status, mas certificados diferentes.

São objetos diferentes.

Em muitos sistemas, identidade aparece como:

```text
id;
código;
certificado;
protocolo;
número do pedido;
chave de negócio.
```

Em backend, entender identidade é essencial para atualização, exclusão, auditoria, histórico e rastreabilidade.

---

## Comparando procedural e orientado a objetos

### Procedural

No procedural, normalmente pensamos em dados passando por funções:

```text
dados da OS
  ↓
validar dados
  ↓
calcular atraso
  ↓
definir fila
  ↓
imprimir resumo
```

Isso é útil e ainda será usado.

### Orientado a objetos

No OO, pensamos em objetos que representam conceitos:

```text
OrdemServico
  - possui estado
  - possui comportamento
  - possui identidade
```

A OS não é apenas um conjunto de variáveis. Ela vira um conceito do código.

O objetivo não é abandonar o que aprendemos.

É evoluir.

A boa Orientação a Objetos usa fundamentos procedurais por dentro, mas organiza o sistema em torno de objetos.

---

## Exemplo antes: código procedural

Crie a pasta da aula:

```powershell
mkdir labs\m4\aula-105-pensamento-orientado-a-objetos
cd labs\m4\aula-105-pensamento-orientado-a-objetos
```

Crie o arquivo:

```text
OsProcedural.java
```

Código:

```java
public class OsProcedural {
    public static void main(String[] args) {
        String certificado = "OS-001";
        String cliente = "Ana";
        String status = "ABERTA";
        int diasEmAberto = 6;
        int reagendamentos = 2;

        boolean atrasada = diasEmAberto > 3;
        boolean precisaAtencao = atrasada || reagendamentos >= 2;
        String fila = definirFila(status, atrasada, precisaAtencao);

        System.out.println("Certificado: " + certificado);
        System.out.println("Cliente: " + cliente);
        System.out.println("Status: " + status);
        System.out.println("Atrasada: " + atrasada);
        System.out.println("Precisa atenção: " + precisaAtencao);
        System.out.println("Fila: " + fila);
    }

    public static String definirFila(String status, boolean atrasada, boolean precisaAtencao) {
        if (status.equals("CONCLUIDA") || status.equals("CANCELADA")) {
            return "Sem fila";
        }

        if (atrasada) {
            return "Casos Críticos";
        }

        if (precisaAtencao) {
            return "Reagendamento";
        }

        return "Entrada";
    }
}
```

Esse código funciona.

Mas os dados da OS estão soltos no `main`.

A regra usa variáveis separadas.

Se quisermos processar várias OS, o código começa a crescer rápido.

---

## Exemplo depois: primeiro olhar orientado a objetos

Agora crie:

```text
OsOrientadaAObjetos.java
```

Código:

```java
public class OsOrientadaAObjetos {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana",
                StatusOs.ABERTA,
                6,
                2
        );

        imprimirResumo(os);
    }

    public static void imprimirResumo(OrdemServico os) {
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Atrasada: " + os.atrasada());
        System.out.println("Precisa atenção: " + os.precisaAtencao());
        System.out.println("Fila: " + os.filaSugerida());
    }
}

enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final int diasEmAberto;
    private final int reagendamentos;

    OrdemServico(
            String certificado,
            String cliente,
            StatusOs status,
            int diasEmAberto,
            int reagendamentos
    ) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.diasEmAberto = diasEmAberto;
        this.reagendamentos = reagendamentos;
    }

    String certificado() {
        return certificado;
    }

    String cliente() {
        return cliente;
    }

    StatusOs status() {
        return status;
    }

    boolean atrasada() {
        return diasEmAberto > 3;
    }

    boolean precisaAtencao() {
        return atrasada() || reagendamentos >= 2;
    }

    String filaSugerida() {
        if (status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA) {
            return "Sem fila";
        }

        if (atrasada()) {
            return "Casos Críticos";
        }

        if (precisaAtencao()) {
            return "Reagendamento";
        }

        return "Entrada";
    }
}
```

Neste momento, não se preocupe em dominar todos os detalhes da sintaxe.

A próxima aula vai aprofundar modelagem e as próximas entrarão em classe, objeto, atributos, métodos e `this`.

Agora, foque na ideia:

```text
OrdemServico virou uma coisa do código;
ela possui dados;
ela possui comportamentos;
o main ficou mais expressivo;
as regras ficaram próximas do conceito que elas representam.
```

---

## O que mudou no exemplo

Antes:

```java
String certificado = "OS-001";
String cliente = "Ana";
String status = "ABERTA";
int diasEmAberto = 6;
int reagendamentos = 2;
```

Depois:

```java
OrdemServico os = new OrdemServico(
        "OS-001",
        "Ana",
        StatusOs.ABERTA,
        6,
        2
);
```

Antes, os dados estavam soltos.

Depois, os dados pertencem a um objeto.

Antes:

```java
boolean atrasada = diasEmAberto > 3;
boolean precisaAtencao = atrasada || reagendamentos >= 2;
```

Depois:

```java
os.atrasada()
os.precisaAtencao()
os.filaSugerida()
```

Agora o código conversa com o objeto.

Isso é uma mudança forte de mentalidade.

---

## Nem toda função deve virar método do objeto

Um erro comum é achar que tudo precisa entrar dentro da classe.

Não é verdade.

A classe `OrdemServico` deve conter comportamentos que fazem sentido para uma OS.

Faz sentido:

```text
atrasada;
precisaAtencao;
filaSugerida.
```

Não faz tanto sentido colocar dentro de `OrdemServico`:

```text
ler do console;
imprimir com System.out;
salvar no banco;
enviar WhatsApp;
abrir conexão HTTP.
```

Essas ações dependem de entrada, saída, infraestrutura ou apresentação.

Mais tarde, elas ficarão em outras classes.

Por enquanto, guarde esta regra:

```text
coloque no objeto o comportamento que pertence ao conceito do objeto.
```

---

## Como identificar objetos em um problema

Leia uma descrição e procure substantivos importantes.

Exemplo:

```text
O sistema recebe uma ordem de serviço de um cliente, calcula sua fila e gera um resumo de atendimento.
```

Possíveis objetos:

```text
OrdemServico;
Cliente;
FilaAtendimento;
ResumoAtendimento.
```

Agora procure comportamentos.

```text
OrdemServico pode estar atrasada;
OrdemServico pode precisar de atenção;
FilaAtendimento pode representar destino operacional;
ResumoAtendimento pode consolidar dados.
```

Nem todo substantivo vira classe.

Mas esse exercício ajuda a encontrar candidatos.

---

## Como identificar comportamentos

Procure verbos e perguntas.

Exemplo:

```text
calcular atraso;
definir fila;
validar status;
verificar prioridade;
gerar resumo.
```

Alguns comportamentos podem pertencer ao objeto.

Exemplo:

```text
OrdemServico está atrasada?
OrdemServico precisa de atenção?
OrdemServico está encerrada?
```

Outros podem pertencer a outro lugar.

Exemplo:

```text
ler OrdemServico do console;
imprimir OrdemServico;
salvar OrdemServico.
```

Esses dependem mais de entrada, saída ou infraestrutura.

Essa separação vai ficar mais clara nos próximos módulos.

---

## Objeto não é só dado

Um erro comum é criar classe apenas como pacote de dados.

Exemplo fraco:

```java
class OrdemServico {
    String certificado;
    String cliente;
    String status;
    int diasEmAberto;
}
```

Isso agrupa dados, mas ainda não traz comportamento.

Um objeto mais rico começa a responder perguntas:

```java
boolean atrasada() {
    return diasEmAberto > 3;
}
```

A ideia não é colocar regra demais dentro da classe logo no começo.

A ideia é entender que objeto pode ter comportamento, não apenas atributos.

---

## Objeto também não deve fazer tudo

Outro erro é ir para o extremo oposto.

Classe ruim:

```text
OrdemServico
- lê dados do console
- valida
- calcula
- imprime
- salva no banco
- manda mensagem
- gera relatório
```

Isso vira um “deus objeto”.

Objeto bom tem responsabilidade clara.

Para a nossa OS, neste momento, faz sentido ela saber coisas sobre ela mesma:

```text
estou atrasada?
preciso de atenção?
qual fila faz sentido para mim?
```

Mas não faz sentido ela controlar o sistema inteiro.

---

## Pensamento OO aplicado a pedido

Vamos comparar com pedido.

Descrição:

```text
Um pedido possui cliente, produto, preço unitário e quantidade. Ele calcula total bruto, desconto e total final.
```

Possível objeto:

```text
Pedido
```

Estado:

```text
cliente;
produto;
precoUnitario;
quantidade.
```

Comportamento:

```text
calcular total bruto;
calcular desconto;
calcular total final.
```

Exemplo simples:

```java
import java.math.BigDecimal;

public class PedidoOoExemplo {
    public static void main(String[] args) {
        Pedido pedido = new Pedido("Ana", "Cadeira", new BigDecimal("199.90"), 2);

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() {
        return cliente;
    }

    String produto() {
        return produto;
    }

    BigDecimal totalBruto() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal totalBruto = totalBruto();

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }
}
```

De novo: não precisa decorar a sintaxe agora.

Foque na ideia:

```text
Pedido conhece seus dados;
Pedido sabe calcular informações derivadas dos seus dados.
```

---

## Como executar os exemplos

Compile:

```powershell
javac OsProcedural.java
javac OsOrientadaAObjetos.java
javac PedidoOoExemplo.java
```

Execute:

```powershell
java OsProcedural
java OsOrientadaAObjetos
java PedidoOoExemplo
```

Compare as saídas.

A saída não é o ponto principal.

O ponto principal é comparar a organização do raciocínio.

---

## Leitura crítica dos exemplos

No exemplo procedural, pergunte:

```text
onde estão os dados da OS?
onde está a regra de atraso?
onde está a regra de fila?
o que acontece se eu tiver 10 OS?
o que acontece se eu quiser reaproveitar a regra em outro lugar?
```

No exemplo orientado a objetos, pergunte:

```text
qual é o objeto principal?
qual é o estado dele?
quais comportamentos pertencem a ele?
o main ficou mais simples?
a regra ficou mais perto do conceito?
```

Essa leitura crítica é mais importante que decorar palavras.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar procedural e OO

Execute:

```text
OsProcedural
OsOrientadaAObjetos
```

Depois responda:

```text
qual código representa melhor a ideia de Ordem de Serviço?
qual código deixa a regra mais perto da OS?
qual código ficaria mais fácil de evoluir?
```

### Parte 2 — Alterar a regra de atraso

Mude a regra:

```text
OS atrasada agora é acima de 5 dias.
```

Faça isso nos dois exemplos.

Observe em qual deles a mudança parece mais natural.

### Parte 3 — Criar novo comportamento

Na classe `OrdemServico`, crie um método:

```java
boolean encerrada()
```

Regra:

```text
status CONCLUIDA ou CANCELADA significa encerrada.
```

Depois use esse método dentro de `filaSugerida`.

### Parte 4 — Criar segundo objeto

No `main`, crie duas OS:

```text
OS-001 aberta e atrasada;
OS-002 concluída.
```

Imprima o resumo das duas.

Observe que são dois objetos da mesma classe.

---

## Desafio prático

Crie um arquivo:

```text
ClienteOoExemplo.java
```

Modele um cliente com:

Estado:

```text
nome;
email;
telefone;
ativo.
```

Comportamentos:

```text
ativo();
contatoValido();
podeReceberMensagem();
```

Regras:

```text
cliente ativo pode receber mensagem;
cliente precisa ter telefone informado;
cliente precisa ter email informado para contato válido.
```

Depois crie dois clientes no `main`:

```text
um cliente ativo com contato completo;
um cliente inativo ou sem telefone.
```

Imprima o resultado dos comportamentos.

O objetivo é treinar:

```text
classe;
objeto;
estado;
comportamento;
identidade simples;
comparação entre objetos.
```

---

## Erros comuns

### 1. Achar que classe é só arquivo

Classe não é apenas um arquivo `.java`.

Classe é uma definição de conceito.

### 2. Achar que objeto é variável comum

Objeto é uma instância com estado e comportamento.

### 3. Criar classe sem comportamento

Agrupar dados já ajuda, mas OO começa a ficar mais forte quando existem comportamentos coerentes.

### 4. Colocar tudo dentro do objeto

Objeto não deve fazer tudo. Ele deve fazer o que pertence ao conceito dele.

### 5. Confundir classe e objeto

`OrdemServico` é a classe.

`os` é um objeto criado a partir dela.

### 6. Ignorar identidade

Dois objetos podem parecer iguais, mas ainda representar coisas diferentes.

---

## Debug recomendado

Use debug no arquivo:

```text
OsOrientadaAObjetos.java
```

Coloque breakpoint nesta linha:

```java
imprimirResumo(os);
```

Entre nos métodos:

```text
imprimirResumo;
atrasada;
precisaAtencao;
filaSugerida.
```

Observe:

```text
o objeto os;
os valores internos;
as chamadas entre métodos;
a regra de fila sendo aplicada.
```

Depois crie duas OS e veja no debug que cada objeto possui seu próprio estado.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre classe e objeto?
2. Qual estado uma OrdemServico possui?
3. Qual comportamento pertence naturalmente a uma OrdemServico?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar classe como molde;
explicar objeto como instância;
identificar estado;
identificar comportamento;
explicar identidade;
comparar procedural e orientado a objetos;
criar uma classe simples;
criar dois objetos da mesma classe;
chamar métodos do objeto;
entender por que nem tudo deve ficar dentro da classe;
debugar chamadas em métodos de um objeto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-105-pensamento-orientado-a-objetos
git commit -m "Aula 105: inicia pensamento orientado a objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Orientação a Objetos começa quando você passa a enxergar conceitos do problema como objetos com estado, comportamento e identidade.
```

Você não precisa dominar toda a sintaxe ainda.

Neste momento, o mais importante é mudar o olhar:

```text
de passos soltos
para objetos que representam o problema.
```

Na próxima aula, vamos praticar modelagem no papel.

Antes de sair codando classes, vamos aprender a ler um problema, encontrar substantivos, verbos, responsabilidades, entidades e regras.
