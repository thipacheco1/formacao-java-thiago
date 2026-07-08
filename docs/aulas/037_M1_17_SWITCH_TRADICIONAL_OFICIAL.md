# 037 — M1.17 — Switch Tradicional

## Hoje a aula é sobre escolher caminhos por valor

O `if` é excelente para regras booleanas.

Exemplo:

```java
if (clienteAtivo && !possuiPendencia) {
    System.out.println("Cliente apto");
}
```

Mas há situações em que a regra não é exatamente uma combinação booleana.

Às vezes você tem um valor e quer escolher um caminho.

Exemplos:

```text
opção de menu 1, 2, 3 ou 4;
status PENDENTE, APROVADO, RECUSADO ou CANCELADO;
tipo de operação C, E ou A;
código de ocorrência 100, 200 ou 300;
prioridade A, B ou C;
perfil ADMIN, SUPERVISOR ou OPERADOR;
dia da semana 1 a 7;
tipo de mensagem BOAS_VINDAS, ENTREGA, NPS ou ERRO.
```

Nesses casos, uma cadeia de `else if` funciona.

Mas o `switch` pode deixar a intenção mais clara.

O `switch` diz:

```text
olhe para este valor;
se for este caso, faça isso;
se for aquele caso, faça aquilo;
se não for nenhum, faça o padrão.
```

---

## O que é switch tradicional

`switch` é uma estrutura de seleção.

Ela avalia uma expressão e compara o resultado com vários `case`.

Estrutura básica:

```java
switch (valor) {
    case opcao1:
        // código
        break;
    case opcao2:
        // código
        break;
    default:
        // código padrão
        break;
}
```

Partes principais:

```text
switch -> inicia a estrutura;
valor -> expressão avaliada;
case -> caso esperado;
break -> encerra o caso;
default -> caminho padrão quando nenhum case casa.
```

O `switch` tradicional é muito usado em exemplos com:

```text
menus;
status;
códigos;
opções;
tipos.
```

---

## Vocabulário essencial

Termos desta aula:

```text
switch;
case;
break;
default;
fall-through;
menu;
status;
opção;
valor de controle;
caminho padrão;
caso;
seleção por valor.
```

Os termos mais importantes são:

```text
case -> representa um valor esperado;
break -> impede cair no próximo case;
default -> trata valor desconhecido ou não mapeado;
fall-through -> quando o fluxo cai de um case para o próximo por falta de break.
```

O risco de `fall-through` é o ponto mais importante do `switch` tradicional.

---

## Primeiro exemplo visual

Código:

```java
int opcao = 2;

switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
        break;
    case 2:
        System.out.println("Consultar");
        break;
    case 3:
        System.out.println("Excluir");
        break;
    default:
        System.out.println("Opção inválida");
        break;
}
```

Saída:

```text
Consultar
```

Por quê?

Porque:

```java
opcao
```

vale:

```text
2.
```

Então o Java entra no:

```java
case 2:
```

Executa:

```java
System.out.println("Consultar");
```

E para no:

```java
break;
```

---

## `switch (opcao)`

A linha:

```java
switch (opcao) {
```

diz ao Java:

```text
vamos tomar uma decisão olhando para o valor da variável opcao.
```

O valor pode ser, por exemplo:

```java
int opcao = 1;
```

ou:

```java
String status = "APROVADO";
```

ou:

```java
char prioridade = 'A';
```

Nesta aula, vamos usar principalmente:

```text
int;
String;
char.
```

No futuro, `enum` será muito importante com `switch`.

---

## `case`

O `case` representa um valor esperado.

Exemplo:

```java
case 1:
    System.out.println("Cadastrar");
    break;
```

Leitura:

```text
caso o valor seja 1, execute este bloco.
```

Outro exemplo:

```java
case "PENDENTE":
    System.out.println("Pedido aguardando análise");
    break;
```

Leitura:

```text
caso o status seja PENDENTE, execute este bloco.
```

Cada `case` precisa representar um valor compatível com o tipo avaliado no `switch`.

Se o `switch` usa `int`, os cases devem ser valores inteiros.

Se usa `String`, os cases devem ser textos.

---

## `break`

`break` encerra a execução daquele `case`.

Exemplo:

```java
case 1:
    System.out.println("Cadastrar");
    break;
```

Sem `break`, o Java continua executando o próximo caso.

Esse comportamento é chamado de:

```text
fall-through.
```

No `switch` tradicional, o `break` é essencial para evitar execução acidental de mais de um caso.

Regra inicial:

```text
em switch tradicional, coloque break no final de cada case, a menos que você queira conscientemente fall-through.
```

Para quem está aprendendo, a regra prática é:

```text
sempre coloque break.
```

Depois estudaremos casos intencionais.

---

## `default`

`default` é o caminho padrão.

Ele executa quando nenhum `case` combina com o valor.

Exemplo:

```java
default:
    System.out.println("Opção inválida");
    break;
```

Se a opção for:

```java
int opcao = 99;
```

e não existir:

```java
case 99:
```

o `default` executa.

Use `default` para:

```text
opção inválida;
status desconhecido;
tipo não mapeado;
código inesperado;
fallback de segurança.
```

Em backend, `default` é muito importante para não ignorar valores inesperados.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int opcao = 2;

        switch (opcao) {
            case 1:
                System.out.println("Cadastrar");
                break;
            case 2:
                System.out.println("Consultar");
                break;
            case 3:
                System.out.println("Excluir");
                break;
            default:
                System.out.println("Opção inválida");
                break;
        }
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
Consultar
```

Depois altere:

```java
int opcao = 1;
```

Depois:

```java
int opcao = 3;
```

Depois:

```java
int opcao = 99;
```

Observe o comportamento.

---

## Switch com String

`switch` também pode trabalhar com `String`.

Exemplo:

```java
public class SwitchStatusPedido {
    public static void main(String[] args) {
        String statusPedido = "APROVADO";

        switch (statusPedido) {
            case "PENDENTE":
                System.out.println("Pedido aguardando análise");
                break;
            case "APROVADO":
                System.out.println("Pedido aprovado para processamento");
                break;
            case "RECUSADO":
                System.out.println("Pedido recusado");
                break;
            case "CANCELADO":
                System.out.println("Pedido cancelado");
                break;
            default:
                System.out.println("Status desconhecido");
                break;
        }
    }
}
```

Saída:

```text
Pedido aprovado para processamento
```

Esse é um caso muito comum.

Status textual combina bem com `switch`, desde que os valores sejam claros e finitos.

---

## Switch com char

Também é possível usar `char`.

Exemplo:

```java
public class SwitchPrioridade {
    public static void main(String[] args) {
        char prioridade = 'A';

        switch (prioridade) {
            case 'A':
                System.out.println("Prioridade alta");
                break;
            case 'B':
                System.out.println("Prioridade média");
                break;
            case 'C':
                System.out.println("Prioridade baixa");
                break;
            default:
                System.out.println("Prioridade desconhecida");
                break;
        }
    }
}
```

Observe:

```java
case 'A':
```

`char` usa aspas simples.

Para `String`, seria:

```java
case "A":
```

A diferença continua importante.

---

## Switch versus if/else if

Um `switch` como:

```java
switch (status) {
    case "PENDENTE":
        System.out.println("Pendente");
        break;
    case "APROVADO":
        System.out.println("Aprovado");
        break;
    default:
        System.out.println("Desconhecido");
        break;
}
```

poderia ser escrito com `if`:

```java
if ("PENDENTE".equals(status)) {
    System.out.println("Pendente");
} else if ("APROVADO".equals(status)) {
    System.out.println("Aprovado");
} else {
    System.out.println("Desconhecido");
}
```

Os dois podem resolver.

A escolha depende da clareza.

Use `switch` quando:

```text
você tem uma mesma variável;
existem vários valores possíveis;
cada valor leva a um caminho;
os casos são discretos e conhecidos.
```

Use `if` quando:

```text
a regra combina várias condições;
a regra usa intervalos;
a regra depende de operadores relacionais;
a regra exige lógica booleana mais rica.
```

---

## Quando switch é bom

`switch` costuma ser bom para:

```text
menus por número;
status por texto;
tipo de operação;
código de evento;
código de ocorrência;
prioridade;
categoria simples;
comando textual;
opção de usuário.
```

Exemplo de menu:

```text
1 - Cadastrar
2 - Consultar
3 - Atualizar
4 - Excluir
0 - Sair
```

Exemplo de status:

```text
PENDENTE
APROVADO
RECUSADO
CANCELADO
```

Exemplo de tipo:

```text
CRIACAO
EDICAO
EXCLUSAO
```

Em todos, há uma variável principal que determina o caminho.

---

## Quando switch não é a melhor escolha

`switch` não é bom para regras como:

```java
if (idade >= 18 && clienteAtivo) {
}
```

Ou:

```java
if (valorCompra > 0 && valorCompra <= limiteCredito) {
}
```

Ou:

```java
if (quantidadeEstoque >= quantidadeSolicitada && produtoAtivo) {
}
```

Essas regras dependem de relações e combinações.

`if` é mais natural.

Switch tradicional não foi feito para expressar intervalos complexos ou combinações booleanas.

---

## Menu com switch

Arquivo:

```text
MenuSimples.java
```

Código:

```java
public class MenuSimples {
    public static void main(String[] args) {
        int opcao = 1;

        switch (opcao) {
            case 1:
                System.out.println("Cadastrar cliente");
                break;
            case 2:
                System.out.println("Consultar cliente");
                break;
            case 3:
                System.out.println("Atualizar cliente");
                break;
            case 4:
                System.out.println("Excluir cliente");
                break;
            case 0:
                System.out.println("Sair");
                break;
            default:
                System.out.println("Opção inválida");
                break;
        }
    }
}
```

Esse exemplo representa um menu simples.

Na prática, menus ficarão mais interessantes quando estudarmos loops.

Por enquanto, estamos estudando a seleção por valor.

---

## Menu com Scanner

Arquivo:

```text
MenuConsole.java
```

Código:

```java
import java.util.Scanner;

public class MenuConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Escolha uma opção:");
        System.out.println("1 - Cadastrar cliente");
        System.out.println("2 - Consultar cliente");
        System.out.println("3 - Atualizar cliente");
        System.out.println("4 - Excluir cliente");
        System.out.println("0 - Sair");

        int opcao = scanner.nextInt();

        switch (opcao) {
            case 1:
                System.out.println("Cadastrar cliente");
                break;
            case 2:
                System.out.println("Consultar cliente");
                break;
            case 3:
                System.out.println("Atualizar cliente");
                break;
            case 4:
                System.out.println("Excluir cliente");
                break;
            case 0:
                System.out.println("Sair");
                break;
            default:
                System.out.println("Opção inválida");
                break;
        }

        scanner.close();
    }
}
```

Esse exemplo junta:

```text
Scanner;
menu;
switch;
case;
break;
default.
```

Ainda não repetimos o menu.

Isso virá com loops.

---

## Fall-through

`fall-through` acontece quando um `case` não tem `break`.

Exemplo:

```java
int opcao = 1;

switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
    case 2:
        System.out.println("Consultar");
    case 3:
        System.out.println("Excluir");
    default:
        System.out.println("Opção inválida");
}
```

Saída:

```text
Cadastrar
Consultar
Excluir
Opção inválida
```

Por quê?

Porque entrou no `case 1` e, sem `break`, continuou executando os próximos blocos.

Esse é o risco clássico do `switch` tradicional.

---

## Como evitar fall-through acidental

Coloque `break` no final de cada `case`.

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
        break;
    case 2:
        System.out.println("Consultar");
        break;
    case 3:
        System.out.println("Excluir");
        break;
    default:
        System.out.println("Opção inválida");
        break;
}
```

Regra prática para esta fase:

```text
case executou? break.
```

Se algum dia você quiser usar `fall-through` de propósito, deixe muito claro.

Mas por enquanto:

```text
fall-through acidental é erro.
```

---

## Fall-through intencional

Às vezes, `fall-through` é usado de propósito para agrupar casos.

Exemplo:

```java
String perfil = "ADMIN";

switch (perfil) {
    case "ADMIN":
    case "SUPERVISOR":
        System.out.println("Pode aprovar");
        break;
    case "OPERADOR":
        System.out.println("Pode consultar");
        break;
    default:
        System.out.println("Perfil desconhecido");
        break;
}
```

Aqui:

```java
case "ADMIN":
case "SUPERVISOR":
```

caem no mesmo bloco.

Isso é intencional.

Leitura:

```text
ADMIN ou SUPERVISOR podem aprovar.
```

Esse uso é válido.

Mas precisa ser simples e claro.

---

## Agrupando cases

Outro exemplo:

```java
int diaSemana = 6;

switch (diaSemana) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("Dia útil");
        break;
    case 6:
    case 7:
        System.out.println("Fim de semana");
        break;
    default:
        System.out.println("Dia inválido");
        break;
}
```

Aqui agrupamos:

```text
1 a 5 -> dia útil;
6 e 7 -> fim de semana.
```

Esse é um exemplo clássico de fall-through intencional.

Mas observe que os cases vazios deixam claro o agrupamento.

---

## Switch tradicional e enum futuro

Mais tarde, vamos estudar `enum`.

`enum` combina muito bem com `switch`.

Exemplo futuro:

```java
switch (statusPedido) {
    case PENDENTE:
        // ...
        break;
    case APROVADO:
        // ...
        break;
}
```

Por enquanto, usamos `String`.

Mas é importante saber:

```text
muitos switches com String de status no começo viram enum no código profissional.
```

Isso melhora segurança e evita erro de digitação.

---

## Exemplo aplicado: status de pedido

Arquivo:

```text
SwitchPedido.java
```

Código:

```java
public class SwitchPedido {
    public static void main(String[] args) {
        String statusPedido = "PENDENTE";

        switch (statusPedido) {
            case "PENDENTE":
                System.out.println("Pedido aguardando análise");
                break;
            case "APROVADO":
                System.out.println("Pedido aprovado para processamento");
                break;
            case "RECUSADO":
                System.out.println("Pedido recusado");
                break;
            case "CANCELADO":
                System.out.println("Pedido cancelado");
                break;
            default:
                System.out.println("Status do pedido desconhecido");
                break;
        }
    }
}
```

Esse exemplo é direto e útil.

Cada status leva a uma mensagem.

---

## Exemplo aplicado: status de OS

Arquivo:

```text
SwitchOrdemServico.java
```

Código:

```java
public class SwitchOrdemServico {
    public static void main(String[] args) {
        String statusOrdemServico = "ABERTA";

        switch (statusOrdemServico) {
            case "ABERTA":
                System.out.println("OS aberta para atendimento");
                break;
            case "AGENDADA":
                System.out.println("OS aguardando execução");
                break;
            case "CONCLUIDA":
                System.out.println("OS concluída");
                break;
            case "CANCELADA":
                System.out.println("OS cancelada");
                break;
            default:
                System.out.println("Status da OS desconhecido");
                break;
        }
    }
}
```

Esse tipo de decisão aparece muito em sistemas corporativos.

Mais tarde, status assim ficarão melhores com `enum`.

---

## Exemplo aplicado: tipo de operação

Arquivo:

```text
SwitchOperacao.java
```

Código:

```java
public class SwitchOperacao {
    public static void main(String[] args) {
        String tipoOperacao = "EDICAO";

        switch (tipoOperacao) {
            case "CRIACAO":
                System.out.println("Registrar criação");
                break;
            case "EDICAO":
                System.out.println("Registrar edição");
                break;
            case "EXCLUSAO":
                System.out.println("Registrar exclusão");
                break;
            default:
                System.out.println("Tipo de operação desconhecido");
                break;
        }
    }
}
```

Esse exemplo conversa com auditoria.

Operações típicas:

```text
criação;
edição;
exclusão.
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
SwitchMensageria.java
```

Código:

```java
public class SwitchMensageria {
    public static void main(String[] args) {
        String tipoMensagem = "ENTREGA";

        switch (tipoMensagem) {
            case "BOAS_VINDAS":
                System.out.println("Enviar mensagem de boas-vindas");
                break;
            case "ENTREGA":
                System.out.println("Enviar mensagem de confirmação de entrega");
                break;
            case "NPS":
                System.out.println("Enviar pesquisa NPS");
                break;
            case "ERRO":
                System.out.println("Registrar erro de mensageria");
                break;
            default:
                System.out.println("Tipo de mensagem desconhecido");
                break;
        }
    }
}
```

Esse exemplo usa domínio de integração e mensageria.

Cada tipo leva a uma ação textual.

---

## Exemplo aplicado: prioridade

Arquivo:

```text
SwitchPrioridadeAtendimento.java
```

Código:

```java
public class SwitchPrioridadeAtendimento {
    public static void main(String[] args) {
        char prioridade = 'A';

        switch (prioridade) {
            case 'A':
                System.out.println("Atendimento crítico");
                break;
            case 'B':
                System.out.println("Atendimento normal");
                break;
            case 'C':
                System.out.println("Atendimento baixo");
                break;
            default:
                System.out.println("Prioridade desconhecida");
                break;
        }
    }
}
```

Aqui `char` faz sentido porque a prioridade é representada por um caractere.

Se o domínio usasse:

```text
ALTA
MEDIA
BAIXA
```

a escolha poderia ser `String` ou, futuramente, `enum`.

---

## Exemplo aplicado: código de ocorrência

Arquivo:

```text
SwitchOcorrencia.java
```

Código:

```java
public class SwitchOcorrencia {
    public static void main(String[] args) {
        int codigoOcorrencia = 100;

        switch (codigoOcorrencia) {
            case 100:
                System.out.println("Ocorrência de criação registrada");
                break;
            case 200:
                System.out.println("Ocorrência de atualização registrada");
                break;
            case 300:
                System.out.println("Ocorrência de cancelamento registrada");
                break;
            default:
                System.out.println("Código de ocorrência não mapeado");
                break;
        }
    }
}
```

Esse exemplo mostra `switch` com códigos numéricos.

Use com cuidado.

Códigos mágicos demais podem ficar difíceis de manter.

Mais tarde, constantes e enums ajudarão.

---

## Exemplo aplicado com Scanner: status

Arquivo:

```text
SwitchStatusConsole.java
```

Código:

```java
import java.util.Scanner;

public class SwitchStatusConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o status do pedido:");
        String statusPedido = scanner.nextLine().trim().toUpperCase();

        switch (statusPedido) {
            case "PENDENTE":
                System.out.println("Pedido aguardando análise");
                break;
            case "APROVADO":
                System.out.println("Pedido aprovado");
                break;
            case "RECUSADO":
                System.out.println("Pedido recusado");
                break;
            case "CANCELADO":
                System.out.println("Pedido cancelado");
                break;
            default:
                System.out.println("Status desconhecido");
                break;
        }

        scanner.close();
    }
}
```

Aqui usamos:

```java
trim().toUpperCase()
```

para padronizar a entrada.

Se o usuário digitar:

```text
 aprovado 
```

o programa transforma em:

```text
APROVADO.
```

---

## Exemplo aplicado com Scanner: menu

Arquivo:

```text
MenuOperacoesConsole.java
```

Código:

```java
import java.util.Scanner;

public class MenuOperacoesConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Menu de operações");
        System.out.println("1 - Criar pedido");
        System.out.println("2 - Consultar pedido");
        System.out.println("3 - Cancelar pedido");
        System.out.println("4 - Registrar auditoria");
        System.out.println("0 - Sair");

        int opcao = scanner.nextInt();

        switch (opcao) {
            case 1:
                System.out.println("Criar pedido");
                break;
            case 2:
                System.out.println("Consultar pedido");
                break;
            case 3:
                System.out.println("Cancelar pedido");
                break;
            case 4:
                System.out.println("Registrar auditoria");
                break;
            case 0:
                System.out.println("Sair");
                break;
            default:
                System.out.println("Opção inválida");
                break;
        }

        scanner.close();
    }
}
```

Esse exemplo prepara a mentalidade para menus com repetição.

Ainda não há loop.

O menu executa uma vez.

---

## Switch com null

Cuidado.

Se uma variável `String` for `null`, usar `switch` nela causa erro em execução.

Exemplo perigoso:

```java
String status = null;

switch (status) {
    case "PENDENTE":
        System.out.println("Pendente");
        break;
    default:
        System.out.println("Desconhecido");
        break;
}
```

Isso pode gerar `NullPointerException`.

`default` não protege contra `null` nesse caso.

Se existe chance de `null`, valide antes.

Exemplo:

```java
if (status == null) {
    System.out.println("Status não informado");
} else {
    switch (status) {
        case "PENDENTE":
            System.out.println("Pendente");
            break;
        default:
            System.out.println("Desconhecido");
            break;
    }
}
```

Ainda vamos aprofundar `null` depois.

Por enquanto, guarde o alerta.

---

## Default não é tratamento de null

Esse ponto merece reforço.

Muita gente pensa:

```text
se status for null, cai no default.
```

Não é assim no switch tradicional com `String`.

Antes de comparar os cases, o Java precisa avaliar a expressão do `switch`.

Se ela for `null`, o problema acontece antes de chegar no `default`.

Regra prática:

```text
se o valor pode ser null, trate antes do switch.
```

---

## Switch e valores mágicos

Exemplo:

```java
switch (codigo) {
    case 1:
        System.out.println("Criar");
        break;
    case 2:
        System.out.println("Editar");
        break;
}
```

Isso pode ser aceitável em menu pequeno.

Mas em regra corporativa, códigos soltos podem virar problema.

Se alguém perguntar:

```text
o que significa 1?
o que significa 2?
```

o código precisa responder claramente.

Melhor em alguns casos:

```java
String tipoOperacao = "CRIACAO";
```

ou futuramente:

```java
enum TipoOperacao
```

Não exagere em número mágico sem nome.

---

## Switch não substitui modelagem

`switch` ajuda a escolher caminhos.

Mas ele não resolve sozinho problemas de modelagem.

Se você tem muitos switches espalhados pelo sistema para o mesmo status, talvez exista uma modelagem melhor.

No futuro, estudaremos:

```text
enum;
polimorfismo;
estratégia;
regras em serviços;
organização de domínio.
```

Nesta aula, foque no uso correto do `switch` tradicional.

Mas já guarde:

```text
switch é ferramenta, não arquitetura.
```

---

## Erros comuns

### Erro 1 — Esquecer `break`

Erro clássico:

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
    case 2:
        System.out.println("Consultar");
    default:
        System.out.println("Inválido");
}
```

Se `opcao` for 1, executa tudo abaixo.

Certo:

```java
case 1:
    System.out.println("Cadastrar");
    break;
```

---

### Erro 2 — Achar que default evita fall-through

Se o `case` não tiver `break`, pode cair até o `default`.

`default` não impede queda.

O `break` impede.

---

### Erro 3 — Esquecer `default`

Sem `default`, valores inesperados podem passar sem resposta.

Exemplo:

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
        break;
}
```

Se `opcao` for 99, nada acontece.

Em muitos casos, isso é ruim.

Use `default`.

---

### Erro 4 — Usar switch para intervalo

Ruim:

```java
// tentativa inadequada de usar switch para idade >= 18
```

Para intervalos, use `if`.

Exemplo correto:

```java
if (idade >= 18) {
    System.out.println("Maior de idade");
}
```

---

### Erro 5 — Usar String sem padronizar entrada

Se o usuário digitar:

```text
aprovado
```

e o case espera:

```java
case "APROVADO":
```

não casa.

Padronize:

```java
String status = scanner.nextLine().trim().toUpperCase();
```

---

### Erro 6 — Usar switch com String possivelmente null

Perigoso:

```java
switch (status) {
}
```

se `status` pode ser `null`.

Valide antes.

---

### Erro 7 — Misturar responsabilidades dentro de case

Ruim:

```java
case "APROVADO":
    // valida entrada
    // calcula total
    // envia mensagem
    // atualiza status
    // imprime relatório
    break;
```

Um `case` muito grande pode indicar que a regra precisa ser organizada melhor.

Por enquanto, mantenha exemplos simples.

---

### Erro 8 — Duplicar lógica em vários cases

Se vários cases fazem quase a mesma coisa, talvez seja caso de agrupamento.

Exemplo:

```java
case "ADMIN":
case "SUPERVISOR":
    System.out.println("Pode aprovar");
    break;
```

---

### Erro 9 — Usar case com tipo incompatível

Se o switch usa `int`, não use case com texto.

Errado:

```java
int opcao = 1;

switch (opcao) {
    case "1":
        System.out.println("Um");
        break;
}
```

Certo:

```java
case 1:
```

---

### Erro 10 — Colocar condição booleana no case tradicional

Switch tradicional usa valores de caso, não condições como:

```java
case idade >= 18:
```

Para isso, use `if`.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-037-switch-tradicional
cd labs\m1\aula-037-switch-tradicional
```

Crie arquivos:

```text
Main.java
MenuSimples.java
MenuConsole.java
SwitchStatusPedido.java
SwitchPrioridade.java
SwitchPedido.java
SwitchOrdemServico.java
SwitchOperacao.java
SwitchMensageria.java
SwitchPrioridadeAtendimento.java
SwitchOcorrencia.java
SwitchStatusConsole.java
MenuOperacoesConsole.java
FallThroughAcidental.java
FallThroughIntencional.java
SwitchNull.java
```

Compile:

```powershell
javac Main.java
javac MenuSimples.java
javac MenuConsole.java
javac SwitchStatusPedido.java
javac SwitchPrioridade.java
javac SwitchPedido.java
javac SwitchOrdemServico.java
javac SwitchOperacao.java
javac SwitchMensageria.java
javac SwitchPrioridadeAtendimento.java
javac SwitchOcorrencia.java
javac SwitchStatusConsole.java
javac MenuOperacoesConsole.java
javac FallThroughAcidental.java
javac FallThroughIntencional.java
javac SwitchNull.java
```

Execute:

```powershell
java Main
java MenuSimples
java MenuConsole
java SwitchStatusPedido
java SwitchPrioridade
java SwitchPedido
java SwitchOrdemServico
java SwitchOperacao
java SwitchMensageria
java SwitchPrioridadeAtendimento
java SwitchOcorrencia
java SwitchStatusConsole
java MenuOperacoesConsole
java FallThroughAcidental
java FallThroughIntencional
java SwitchNull
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `FallThroughAcidental.java`

```java
public class FallThroughAcidental {
    public static void main(String[] args) {
        int opcao = 1;

        switch (opcao) {
            case 1:
                System.out.println("Cadastrar");
            case 2:
                System.out.println("Consultar");
            case 3:
                System.out.println("Excluir");
            default:
                System.out.println("Inválido");
        }
    }
}
```

Objetivo:

```text
ver o problema de esquecer break.
```

Depois corrija adicionando `break`.

---

## Arquivo sugerido: `FallThroughIntencional.java`

```java
public class FallThroughIntencional {
    public static void main(String[] args) {
        String perfil = "SUPERVISOR";

        switch (perfil) {
            case "ADMIN":
            case "SUPERVISOR":
                System.out.println("Pode aprovar");
                break;
            case "OPERADOR":
                System.out.println("Pode consultar");
                break;
            default:
                System.out.println("Perfil desconhecido");
                break;
        }
    }
}
```

Objetivo:

```text
ver agrupamento intencional de cases.
```

---

## Debug para switch

Use debug para enxergar o caminho.

Exemplo:

```java
String statusPedido = "APROVADO";

switch (statusPedido) {
    case "PENDENTE":
        System.out.println("Pendente");
        break;
    case "APROVADO":
        System.out.println("Aprovado");
        break;
    default:
        System.out.println("Desconhecido");
        break;
}
```

Coloque breakpoint na linha do `switch`.

Observe:

```text
statusPedido = APROVADO.
```

Avance com Step Over.

Veja em qual `case` o fluxo entra.

Depois remova um `break` de propósito e veja o fluxo cair no próximo caso.

Esse exercício fixa `fall-through`.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-037-switch-tradicional docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 037: pratica switch tradicional em Java"
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
criar switch tradicional;
usar case;
usar break;
usar default;
explicar fall-through;
corrigir fall-through acidental;
usar agrupamento intencional de cases;
criar menu com switch;
usar switch com int;
usar switch com String;
usar switch com char;
aplicar switch em status de pedido;
aplicar switch em status de OS;
aplicar switch em tipo de operação;
aplicar switch em mensageria;
aplicar switch em prioridade;
aplicar switch em código de ocorrência;
usar Scanner com switch;
padronizar String antes do switch;
tratar possibilidade de null antes do switch;
diferenciar switch de if/else if;
identificar quando switch não é adequado;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar switch moderno.

Não precisa ainda dominar `yield`.

Não precisa ainda dominar `enum`.

Não precisa ainda dominar pattern matching.

Esses assuntos virão depois.

O objetivo é dominar o `switch` tradicional e entender o risco de `fall-through`.

---

## Fechamento da aula

Hoje aprendemos o `switch` tradicional.

Ele é útil quando temos uma variável principal e queremos escolher um caminho com base em valores conhecidos.

Vimos:

```text
case;
break;
default;
menus;
status;
fall-through;
agrupamento de cases;
String;
char;
int;
Scanner;
risco de null;
diferença entre switch e if.
```

O ponto mais importante foi:

```text
no switch tradicional, esquecer break pode fazer o fluxo cair no próximo case.
```

Isso é o famoso `fall-through`.

Também vimos que `switch` é bom para seleção por valor, mas não substitui `if` em regras com intervalos, combinações booleanas ou validações complexas.

Na próxima aula, vamos estudar `switch` moderno e expressões.

Ele reduz alguns problemas do switch tradicional e permite escrever seleções mais expressivas e seguras em versões modernas do Java.
