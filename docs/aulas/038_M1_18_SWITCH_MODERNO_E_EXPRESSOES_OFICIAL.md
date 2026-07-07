# 038 — M1.18 — Switch Moderno e Expressões

## Onde estamos na formação

Estamos no Módulo 1, continuando o bloco de decisões.

A sequência recente foi:

```text
034 — M1.14 — Incremento, decremento e acumuladores;
035 — M1.15 — If, else if e else;
036 — M1.16 — Ifs aninhados e simplificação;
037 — M1.17 — Switch tradicional;
038 — M1.18 — Switch moderno e expressões.
```

Na aula anterior, estudamos o `switch` tradicional:

```java
switch (statusPedido) {
    case "PENDENTE":
        System.out.println("Pedido aguardando análise");
        break;
    case "APROVADO":
        System.out.println("Pedido aprovado");
        break;
    default:
        System.out.println("Status desconhecido");
        break;
}
```

Vimos que ele funciona, mas exige cuidado com:

```text
break;
fall-through;
default;
cases grandes;
valores inesperados;
String null.
```

Agora vamos estudar uma forma moderna de escrever `switch`.

Ela permite uma sintaxe mais limpa e, principalmente, permite que o `switch` retorne valor.

Exemplo:

```java
String mensagem = switch (statusPedido) {
    case "PENDENTE" -> "Pedido aguardando análise";
    case "APROVADO" -> "Pedido aprovado";
    case "RECUSADO" -> "Pedido recusado";
    default -> "Status desconhecido";
};
```

Esse estilo é muito importante em Java moderno.

---

## Hoje a aula é sobre transformar seleção em expressão

No `switch` tradicional, normalmente fazemos uma ação.

Exemplo:

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
        break;
    case 2:
        System.out.println("Consultar");
        break;
    default:
        System.out.println("Opção inválida");
        break;
}
```

Esse `switch` executa comandos.

Já no `switch` moderno, muitas vezes queremos calcular um valor.

Exemplo:

```java
String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    case 2 -> "Consultar";
    case 3 -> "Atualizar";
    case 4 -> "Excluir";
    default -> "Opção inválida";
};

System.out.println(acao);
```

Aqui o `switch` produz um valor.

Esse valor é atribuído à variável:

```java
String acao
```

Essa é a grande mudança mental:

```text
switch tradicional geralmente executa blocos;
switch expression pode retornar valor.
```

---

## Switch statement versus switch expression

Existem dois usos importantes.

### Switch statement

É uma instrução.

Executa código.

Exemplo tradicional:

```java
switch (status) {
    case "PENDENTE":
        System.out.println("Pendente");
        break;
    default:
        System.out.println("Desconhecido");
        break;
}
```

### Switch expression

É uma expressão.

Produz um valor.

Exemplo moderno:

```java
String mensagem = switch (status) {
    case "PENDENTE" -> "Pendente";
    default -> "Desconhecido";
};
```

Repare no ponto e vírgula no final:

```java
};
```

Porque o `switch` está participando de uma atribuição.

---

## Vocabulário essencial

Termos desta aula:

```text
switch moderno;
switch expression;
switch statement;
arrow syntax;
seta `->`;
yield;
retorno de valor;
default;
case agrupado;
expressão;
bloco;
enum futuramente;
exhaustividade;
fall-through evitado.
```

Termos mais importantes:

```text
arrow syntax -> sintaxe com seta;
switch expression -> switch que retorna valor;
yield -> usado para devolver valor quando o case tem bloco;
default -> caminho padrão;
exhaustividade -> cobrir todos os casos possíveis.
```

A palavra “exhaustividade” será mais importante quando estudarmos `enum`.

Por enquanto, entenda como:

```text
o switch precisa saber o que fazer para todos os valores relevantes.
```

---

## Arrow syntax

A sintaxe moderna usa:

```java
->
```

Exemplo:

```java
case "PENDENTE" -> "Pedido aguardando análise";
```

Leitura:

```text
caso status seja PENDENTE, o resultado é "Pedido aguardando análise".
```

Outro exemplo:

```java
case 1 -> "Cadastrar";
case 2 -> "Consultar";
default -> "Opção inválida";
```

Essa sintaxe evita o `break` na maioria dos casos.

Ela também reduz o risco de `fall-through`.

---

## Exemplo mínimo com switch expression

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int opcao = 2;

        String acao = switch (opcao) {
            case 1 -> "Cadastrar";
            case 2 -> "Consultar";
            case 3 -> "Atualizar";
            case 4 -> "Excluir";
            default -> "Opção inválida";
        };

        System.out.println("Ação: " + acao);
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
Ação: Consultar
```

O `switch` retornou a String `"Consultar"`.

Essa String foi guardada em:

```java
String acao
```

---

## O ponto e vírgula final

Repare:

```java
String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    case 2 -> "Consultar";
    default -> "Opção inválida";
};
```

Existe ponto e vírgula depois da chave final:

```java
};
```

Por quê?

Porque isso é uma atribuição.

A instrução completa é:

```java
String acao = switch (...) { ... };
```

Se esquecer esse `;`, o código não compila.

No switch tradicional usado como comando, normalmente não existe ponto e vírgula depois do bloco.

No switch expression, existe.

---

## Switch moderno reduz o risco de fall-through

No switch tradicional, se esquecer `break`, pode acontecer fall-through.

Exemplo tradicional perigoso:

```java
switch (opcao) {
    case 1:
        System.out.println("Cadastrar");
    case 2:
        System.out.println("Consultar");
}
```

No switch moderno com seta:

```java
String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    case 2 -> "Consultar";
    default -> "Inválida";
};
```

Cada `case ->` representa um caminho próprio.

Não cai automaticamente no próximo.

Isso deixa o código mais seguro para a maioria dos cenários.

---

## Switch moderno como comando

A sintaxe com seta também pode ser usada para executar comandos.

Exemplo:

```java
int opcao = 1;

switch (opcao) {
    case 1 -> System.out.println("Cadastrar");
    case 2 -> System.out.println("Consultar");
    case 3 -> System.out.println("Atualizar");
    case 4 -> System.out.println("Excluir");
    default -> System.out.println("Opção inválida");
}
```

Aqui não estamos atribuindo resultado a uma variável.

O `switch` está apenas executando uma ação.

Mas usa a sintaxe moderna com seta.

Esse uso é mais parecido com statement.

---

## Switch moderno retornando valor

O uso mais importante desta aula é retornar valor.

Exemplo:

```java
String statusPedido = "APROVADO";

String mensagem = switch (statusPedido) {
    case "PENDENTE" -> "Pedido aguardando análise";
    case "APROVADO" -> "Pedido aprovado para processamento";
    case "RECUSADO" -> "Pedido recusado";
    case "CANCELADO" -> "Pedido cancelado";
    default -> "Status desconhecido";
};

System.out.println(mensagem);
```

Saída:

```text
Pedido aprovado para processamento
```

Esse estilo é muito bom quando cada caso gera um resultado.

---

## Switch moderno com múltiplos valores no mesmo case

Podemos agrupar valores em um mesmo case.

Exemplo:

```java
String perfil = "SUPERVISOR";

String permissao = switch (perfil) {
    case "ADMIN", "SUPERVISOR" -> "Pode aprovar";
    case "OPERADOR" -> "Pode consultar";
    default -> "Perfil desconhecido";
};

System.out.println(permissao);
```

Saída:

```text
Pode aprovar
```

Compare com switch tradicional:

```java
case "ADMIN":
case "SUPERVISOR":
    System.out.println("Pode aprovar");
    break;
```

No switch moderno, fica mais explícito:

```java
case "ADMIN", "SUPERVISOR" -> "Pode aprovar";
```

---

## Switch moderno com int

Exemplo:

```java
int opcao = 3;

String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    case 2 -> "Consultar";
    case 3 -> "Atualizar";
    case 4 -> "Excluir";
    case 0 -> "Sair";
    default -> "Opção inválida";
};

System.out.println(acao);
```

Saída:

```text
Atualizar
```

Esse é um bom uso para menus.

Quando entrarmos em loops, menus com switch ficarão mais completos.

---

## Switch moderno com String

Exemplo:

```java
String status = "PENDENTE";

String descricao = switch (status) {
    case "PENDENTE" -> "Aguardando análise";
    case "APROVADO" -> "Aprovado para processamento";
    case "RECUSADO" -> "Recusado pelo aprovador";
    case "CANCELADO" -> "Cancelado pelo usuário";
    default -> "Status não mapeado";
};

System.out.println(descricao);
```

Esse formato reduz bastante código quando comparado ao tradicional.

---

## Switch moderno com char

Exemplo:

```java
char prioridade = 'A';

String descricaoPrioridade = switch (prioridade) {
    case 'A' -> "Prioridade alta";
    case 'B' -> "Prioridade média";
    case 'C' -> "Prioridade baixa";
    default -> "Prioridade desconhecida";
};

System.out.println(descricaoPrioridade);
```

Aqui continua valendo:

```text
char usa aspas simples.
```

---

## Bloco em case moderno

Às vezes, um case precisa de mais de uma linha.

Exemplo:

```java
String status = "APROVADO";

String mensagem = switch (status) {
    case "APROVADO" -> {
        System.out.println("Registrando auditoria de aprovação");
        yield "Pedido aprovado";
    }
    case "RECUSADO" -> {
        System.out.println("Registrando auditoria de recusa");
        yield "Pedido recusado";
    }
    default -> "Status desconhecido";
};

System.out.println(mensagem);
```

Quando usamos bloco em um `case` de switch expression, precisamos usar:

```java
yield
```

para devolver o valor daquele bloco.

---

## O que é yield

`yield` devolve um valor de dentro de um bloco de `switch expression`.

Exemplo:

```java
String mensagem = switch (status) {
    case "APROVADO" -> {
        String texto = "Pedido aprovado";
        yield texto;
    }
    default -> "Status desconhecido";
};
```

Leitura:

```text
para o case APROVADO,
execute o bloco
e entregue o valor texto como resultado do switch.
```

`yield` não é a mesma coisa que `return`.

`return` sai de um método.

`yield` entrega valor para o switch expression.

---

## Quando usar yield

Use `yield` quando o case precisa de bloco.

Exemplo:

```java
case "APROVADO" -> {
    String mensagem = "Pedido aprovado";
    yield mensagem;
}
```

Se o case retorna direto um valor simples, não precisa de `yield`.

Exemplo:

```java
case "APROVADO" -> "Pedido aprovado";
```

Regra prática:

```text
case simples -> valor direto;
case com bloco -> yield.
```

---

## Switch expression precisa retornar valor em todos os caminhos

Exemplo correto:

```java
String mensagem = switch (status) {
    case "PENDENTE" -> "Pendente";
    case "APROVADO" -> "Aprovado";
    default -> "Desconhecido";
};
```

Todos os caminhos retornam uma String.

Exemplo problemático:

```java
String mensagem = switch (status) {
    case "PENDENTE" -> "Pendente";
    case "APROVADO" -> "Aprovado";
};
```

Se `status` for `"RECUSADO"`, o que retorna?

Sem `default` e sem cobrir todos os valores, o compilador pode rejeitar dependendo do contexto.

Para `String`, normalmente use `default`.

Quando estudarmos `enum`, haverá casos em que o Java consegue saber todos os valores possíveis.

---

## Default no switch moderno

`default` continua importante.

Exemplo:

```java
String mensagem = switch (status) {
    case "PENDENTE" -> "Pendente";
    case "APROVADO" -> "Aprovado";
    default -> "Status desconhecido";
};
```

Use `default` para:

```text
valor inesperado;
valor não mapeado;
opção inválida;
código desconhecido;
fallback.
```

Em backend, valor inesperado precisa ser tratado.

Ignorar valor inesperado gera comportamento silencioso ruim.

---

## Switch moderno e null

Cuidado.

Assim como no tradicional, se o valor do `switch` for `null`, pode ocorrer erro.

Exemplo perigoso:

```java
String status = null;

String mensagem = switch (status) {
    case "PENDENTE" -> "Pendente";
    default -> "Desconhecido";
};
```

`default` não deve ser tratado como proteção automática contra `null`.

Regra prática nesta fase:

```text
se pode ser null, valide antes do switch.
```

Exemplo:

```java
String status = null;

String mensagem;

if (status == null) {
    mensagem = "Status não informado";
} else {
    mensagem = switch (status) {
        case "PENDENTE" -> "Pendente";
        case "APROVADO" -> "Aprovado";
        default -> "Desconhecido";
    };
}

System.out.println(mensagem);
```

---

## Switch moderno versus if

Use switch moderno quando:

```text
há uma variável principal;
os valores são discretos;
cada valor gera um resultado;
a regra parece uma tabela de mapeamento;
a leitura fica melhor como seleção por valor.
```

Exemplo:

```java
String descricao = switch (status) {
    case "PENDENTE" -> "Aguardando análise";
    case "APROVADO" -> "Aprovado";
    default -> "Desconhecido";
};
```

Use `if` quando:

```text
a regra usa intervalo;
a regra combina várias condições;
a regra depende de maior/menor;
a regra precisa validar múltiplas coisas independentes;
a regra não é uma simples escolha por valor.
```

Exemplo:

```java
if (valorCompra > 0 && valorCompra <= limiteCredito) {
    System.out.println("Valor permitido");
}
```

---

## Exemplo aplicado: pedido

Arquivo:

```text
SwitchModernoPedido.java
```

Código:

```java
public class SwitchModernoPedido {
    public static void main(String[] args) {
        String statusPedido = "APROVADO";

        String mensagem = switch (statusPedido) {
            case "PENDENTE" -> "Pedido aguardando análise";
            case "APROVADO" -> "Pedido aprovado para processamento";
            case "RECUSADO" -> "Pedido recusado";
            case "CANCELADO" -> "Pedido cancelado";
            default -> "Status do pedido desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Esse é um uso limpo.

Cada status gera uma mensagem.

---

## Exemplo aplicado: OS

Arquivo:

```text
SwitchModernoOrdemServico.java
```

Código:

```java
public class SwitchModernoOrdemServico {
    public static void main(String[] args) {
        String statusOrdemServico = "ABERTA";

        String descricao = switch (statusOrdemServico) {
            case "ABERTA" -> "OS aberta para atendimento";
            case "AGENDADA" -> "OS aguardando execução";
            case "CONCLUIDA" -> "OS concluída";
            case "CANCELADA" -> "OS cancelada";
            default -> "Status da OS desconhecido";
        };

        System.out.println(descricao);
    }
}
```

Esse exemplo é semelhante ao da aula anterior, mas agora o switch retorna uma String.

---

## Exemplo aplicado: operação de auditoria

Arquivo:

```text
SwitchModernoOperacaoAuditoria.java
```

Código:

```java
public class SwitchModernoOperacaoAuditoria {
    public static void main(String[] args) {
        String tipoOperacao = "EDICAO";

        String descricaoAuditoria = switch (tipoOperacao) {
            case "CRIACAO" -> "Registrar criação";
            case "EDICAO" -> "Registrar edição";
            case "EXCLUSAO" -> "Registrar exclusão";
            default -> "Tipo de operação desconhecido";
        };

        System.out.println(descricaoAuditoria);
    }
}
```

Esse tipo de mapeamento aparece em logs e auditoria.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
SwitchModernoMensageria.java
```

Código:

```java
public class SwitchModernoMensageria {
    public static void main(String[] args) {
        String tipoMensagem = "ENTREGA";

        String acao = switch (tipoMensagem) {
            case "BOAS_VINDAS" -> "Enviar mensagem de boas-vindas";
            case "ENTREGA" -> "Enviar mensagem de confirmação de entrega";
            case "NPS" -> "Enviar pesquisa NPS";
            case "ERRO" -> "Registrar erro de mensageria";
            default -> "Tipo de mensagem desconhecido";
        };

        System.out.println(acao);
    }
}
```

Aqui o `switch` funciona como uma tabela de decisão.

---

## Exemplo aplicado: perfil de usuário

Arquivo:

```text
SwitchModernoPerfil.java
```

Código:

```java
public class SwitchModernoPerfil {
    public static void main(String[] args) {
        String perfil = "SUPERVISOR";

        String permissao = switch (perfil) {
            case "ADMIN", "SUPERVISOR" -> "Pode aprovar transações";
            case "OPERADOR" -> "Pode consultar dados";
            case "CLIENTE" -> "Pode acompanhar solicitações";
            default -> "Perfil desconhecido";
        };

        System.out.println(permissao);
    }
}
```

Esse exemplo mostra agrupamento com vírgula.

Muito melhor do que repetir blocos iguais.

---

## Exemplo aplicado: prioridade

Arquivo:

```text
SwitchModernoPrioridade.java
```

Código:

```java
public class SwitchModernoPrioridade {
    public static void main(String[] args) {
        char prioridade = 'A';

        String descricao = switch (prioridade) {
            case 'A' -> "Atendimento crítico";
            case 'B' -> "Atendimento normal";
            case 'C' -> "Atendimento baixo";
            default -> "Prioridade desconhecida";
        };

        System.out.println(descricao);
    }
}
```

Lembre:

```text
char usa aspas simples.
```

---

## Exemplo aplicado: cálculo de SLA simples

Arquivo:

```text
SwitchModernoSla.java
```

Código:

```java
public class SwitchModernoSla {
    public static void main(String[] args) {
        char prioridade = 'A';

        int prazoHoras = switch (prioridade) {
            case 'A' -> 4;
            case 'B' -> 24;
            case 'C' -> 72;
            default -> 168;
        };

        System.out.println("Prazo em horas: " + prazoHoras);
    }
}
```

Aqui o `switch` retorna um `int`.

Isso é muito útil.

O valor final pode ser usado em cálculo, validação ou resposta.

---

## Exemplo aplicado com bloco e yield

Arquivo:

```text
SwitchModernoYieldPedido.java
```

Código:

```java
public class SwitchModernoYieldPedido {
    public static void main(String[] args) {
        String statusPedido = "APROVADO";
        long valorTotalCentavos = 15000L;

        String mensagem = switch (statusPedido) {
            case "APROVADO" -> {
                boolean valorValido = valorTotalCentavos > 0;

                if (valorValido) {
                    yield "Pedido aprovado com valor válido";
                }

                yield "Pedido aprovado, mas valor inválido";
            }
            case "PENDENTE" -> "Pedido aguardando análise";
            case "RECUSADO" -> "Pedido recusado";
            default -> "Status desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Aqui usamos `yield` porque o case `"APROVADO"` tem mais de uma linha e precisa devolver um valor.

Esse exemplo é mais avançado, mas importante.

---

## Cuidado com case grande demais

Embora `yield` permita blocos maiores, não transforme cada `case` em um método inteiro.

Exemplo ruim:

```java
case "APROVADO" -> {
    // valida
    // calcula
    // atualiza banco
    // envia mensagem
    // registra auditoria
    // formata resposta
    yield "Aprovado";
}
```

Isso pode virar bagunça.

Nesta fase, mantenha cases simples.

No futuro, regras grandes serão extraídas para métodos e serviços.

Regra:

```text
switch escolhe caminho;
não deve carregar toda a arquitetura dentro de cada case.
```

---

## Exemplo com Scanner: status

Arquivo:

```text
SwitchModernoStatusConsole.java
```

Código:

```java
import java.util.Scanner;

public class SwitchModernoStatusConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o status do pedido:");
        String statusPedido = scanner.nextLine().trim().toUpperCase();

        String mensagem = switch (statusPedido) {
            case "PENDENTE" -> "Pedido aguardando análise";
            case "APROVADO" -> "Pedido aprovado";
            case "RECUSADO" -> "Pedido recusado";
            case "CANCELADO" -> "Pedido cancelado";
            default -> "Status desconhecido";
        };

        System.out.println(mensagem);

        scanner.close();
    }
}
```

Esse exemplo reforça a padronização:

```java
trim().toUpperCase()
```

---

## Exemplo com Scanner: menu

Arquivo:

```text
SwitchModernoMenuConsole.java
```

Código:

```java
import java.util.Scanner;

public class SwitchModernoMenuConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Menu");
        System.out.println("1 - Criar pedido");
        System.out.println("2 - Consultar pedido");
        System.out.println("3 - Cancelar pedido");
        System.out.println("4 - Registrar auditoria");
        System.out.println("0 - Sair");

        int opcao = scanner.nextInt();

        String acao = switch (opcao) {
            case 1 -> "Criar pedido";
            case 2 -> "Consultar pedido";
            case 3 -> "Cancelar pedido";
            case 4 -> "Registrar auditoria";
            case 0 -> "Sair";
            default -> "Opção inválida";
        };

        System.out.println("Ação escolhida: " + acao);

        scanner.close();
    }
}
```

Mais tarde, com `while`, esse menu poderá repetir até o usuário escolher sair.

---

## Switch moderno e enum futuramente

A grade cita uso com `enum` futuramente.

Ainda não estudamos `enum`.

Mas já vale entender a motivação.

Hoje usamos:

```java
String statusPedido = "APROVADO";
```

Isso é vulnerável a erro de digitação:

```java
"APROVODO"
"aprovado"
"APROVADO "
```

No futuro, com `enum`, poderemos ter valores controlados:

```java
StatusPedido.APROVADO
StatusPedido.PENDENTE
StatusPedido.RECUSADO
```

E o switch moderno fica ainda melhor.

Exemplo futuro:

```java
String mensagem = switch (statusPedido) {
    case PENDENTE -> "Aguardando análise";
    case APROVADO -> "Aprovado";
    case RECUSADO -> "Recusado";
    case CANCELADO -> "Cancelado";
};
```

Com enum, o compilador ajuda a garantir que todos os casos foram tratados.

Esse é um grande benefício.

---

## Preparação para exhaustividade

Quando o Java conhece todos os valores possíveis, como em um `enum`, ele pode exigir que o switch expression trate todos os casos.

Isso se chama, de forma simples:

```text
exhaustividade.
```

Nesta fase, com `String`, o conjunto de valores é aberto.

Qualquer texto pode chegar.

Por isso usamos:

```java
default
```

Com `enum`, o conjunto é fechado.

Isso será estudado depois.

Por enquanto, guarde:

```text
switch moderno fica ainda mais forte com enum.
```

---

## Erros comuns

### Erro 1 — Esquecer ponto e vírgula final

Errado:

```java
String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    default -> "Inválida";
}
```

Certo:

```java
String acao = switch (opcao) {
    case 1 -> "Cadastrar";
    default -> "Inválida";
};
```

Como é atribuição, precisa de `;`.

---

### Erro 2 — Usar bloco sem yield em switch expression

Errado:

```java
String mensagem = switch (status) {
    case "APROVADO" -> {
        String texto = "Aprovado";
    }
    default -> "Desconhecido";
};
```

O bloco não devolveu valor.

Certo:

```java
case "APROVADO" -> {
    String texto = "Aprovado";
    yield texto;
}
```

---

### Erro 3 — Usar break dentro de switch expression com seta

No switch moderno com seta retornando valor, normalmente não usamos `break`.

Exemplo correto:

```java
case "APROVADO" -> "Aprovado";
```

Não escreva como se fosse tradicional.

---

### Erro 4 — Achar que default trata null

Perigoso:

```java
String status = null;

String mensagem = switch (status) {
    default -> "Desconhecido";
};
```

Pode gerar erro antes de chegar no default.

Trate `null` antes.

---

### Erro 5 — Esquecer default com String

Com `String`, qualquer valor pode chegar.

Sem `default`, o switch expression pode não cobrir todos os caminhos.

Use `default`.

---

### Erro 6 — Tentar usar condição no case

Errado:

```java
case idade >= 18 -> "Maior de idade";
```

Para isso, use `if`.

Switch por valor não substitui regra relacional.

---

### Erro 7 — Misturar sintaxe tradicional e moderna sem clareza

Evite misturar estilos no começo.

Tradicional:

```java
case 1:
    System.out.println("Cadastrar");
    break;
```

Moderno:

```java
case 1 -> System.out.println("Cadastrar");
```

Expression:

```java
case 1 -> "Cadastrar";
```

Escolha o estilo adequado e mantenha consistência.

---

### Erro 8 — Case com tipo incompatível

Se o switch usa `int`, case deve ser inteiro.

Errado:

```java
int opcao = 1;

String acao = switch (opcao) {
    case "1" -> "Cadastrar";
    default -> "Inválida";
};
```

Certo:

```java
case 1 -> "Cadastrar";
```

---

### Erro 9 — Criar case grande demais

Se o case precisa fazer muita coisa, talvez a regra precise ir para um método.

Nesta fase, mantenha case simples e didático.

---

### Erro 10 — Usar switch quando if é mais claro

Se a regra é:

```java
valor > 0 && valor <= limite
```

use `if`.

Não force switch.

---

## Diagnóstico de erro com switch moderno

Quando algo não compilar ou não funcionar, siga o roteiro.

### 1. É switch statement ou switch expression?

Se atribui valor, é expression:

```java
String resultado = switch (...) { ... };
```

### 2. Tem ponto e vírgula final?

Switch expression precisa terminar com:

```java
};
```

### 3. Todos os cases retornam valor?

Cada case precisa produzir o tipo esperado.

### 4. Case com bloco usa yield?

Se tem `{ }` e precisa retornar valor, use `yield`.

### 5. Existe default?

Com `String`, normalmente use `default`.

### 6. O valor pode ser null?

Trate antes do switch.

### 7. O tipo do case combina com o tipo do switch?

`int` com número.

`String` com texto.

`char` com caractere.

### 8. A entrada textual foi padronizada?

Use `trim()` e `toUpperCase()` quando fizer sentido.

### 9. A regra deveria ser if?

Se envolve intervalo ou condição composta, use `if`.

### 10. O case ficou grande demais?

Extraia depois para métodos, quando estudarmos métodos.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esquecer ponto e vírgula

```java
public class Main {
    public static void main(String[] args) {
        int opcao = 1;

        String acao = switch (opcao) {
            case 1 -> "Cadastrar";
            default -> "Inválida";
        }

        System.out.println(acao);
    }
}
```

Compile e leia o erro.

Depois adicione:

```java
};
```

### Teste 2 — Bloco sem yield

```java
public class Main {
    public static void main(String[] args) {
        String status = "APROVADO";

        String mensagem = switch (status) {
            case "APROVADO" -> {
                String texto = "Aprovado";
            }
            default -> "Desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Depois corrija com:

```java
yield texto;
```

### Teste 3 — Null no switch

```java
public class Main {
    public static void main(String[] args) {
        String status = null;

        String mensagem = switch (status) {
            case "APROVADO" -> "Aprovado";
            default -> "Desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Execute e observe.

Depois trate `null` antes.

### Teste 4 — String sem padronizar

```java
public class Main {
    public static void main(String[] args) {
        String status = " aprovado ";

        String mensagem = switch (status) {
            case "APROVADO" -> "Aprovado";
            default -> "Desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Depois corrija:

```java
String status = " aprovado ".trim().toUpperCase();
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-038-switch-moderno
cd labs\m1\aula-038-switch-moderno
```

Crie arquivos:

```text
Main.java
SwitchModernoStatement.java
SwitchModernoPedido.java
SwitchModernoOrdemServico.java
SwitchModernoOperacaoAuditoria.java
SwitchModernoMensageria.java
SwitchModernoPerfil.java
SwitchModernoPrioridade.java
SwitchModernoSla.java
SwitchModernoYieldPedido.java
SwitchModernoStatusConsole.java
SwitchModernoMenuConsole.java
SwitchModernoNull.java
SwitchModernoSemYield.java
```

Compile:

```powershell
javac Main.java
javac SwitchModernoStatement.java
javac SwitchModernoPedido.java
javac SwitchModernoOrdemServico.java
javac SwitchModernoOperacaoAuditoria.java
javac SwitchModernoMensageria.java
javac SwitchModernoPerfil.java
javac SwitchModernoPrioridade.java
javac SwitchModernoSla.java
javac SwitchModernoYieldPedido.java
javac SwitchModernoStatusConsole.java
javac SwitchModernoMenuConsole.java
javac SwitchModernoNull.java
javac SwitchModernoSemYield.java
```

Execute:

```powershell
java Main
java SwitchModernoStatement
java SwitchModernoPedido
java SwitchModernoOrdemServico
java SwitchModernoOperacaoAuditoria
java SwitchModernoMensageria
java SwitchModernoPerfil
java SwitchModernoPrioridade
java SwitchModernoSla
java SwitchModernoYieldPedido
java SwitchModernoStatusConsole
java SwitchModernoMenuConsole
java SwitchModernoNull
java SwitchModernoSemYield
```

Alguns arquivos de erro proposital podem não compilar ou podem quebrar em execução.

Isso é esperado quando o objetivo for diagnosticar.

---

## Arquivo sugerido: `SwitchModernoStatement.java`

```java
public class SwitchModernoStatement {
    public static void main(String[] args) {
        int opcao = 1;

        switch (opcao) {
            case 1 -> System.out.println("Cadastrar");
            case 2 -> System.out.println("Consultar");
            case 3 -> System.out.println("Atualizar");
            case 4 -> System.out.println("Excluir");
            default -> System.out.println("Opção inválida");
        }
    }
}
```

Objetivo:

```text
ver switch moderno executando comando, sem retorno de valor.
```

---

## Arquivo sugerido: `SwitchModernoSemYield.java`

Use este arquivo para quebrar de propósito:

```java
public class SwitchModernoSemYield {
    public static void main(String[] args) {
        String status = "APROVADO";

        String mensagem = switch (status) {
            case "APROVADO" -> {
                String texto = "Aprovado";
            }
            default -> "Desconhecido";
        };

        System.out.println(mensagem);
    }
}
```

Depois corrija:

```java
case "APROVADO" -> {
    String texto = "Aprovado";
    yield texto;
}
```

Objetivo:

```text
entender por que bloco em switch expression precisa de yield.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar switch moderno |
| Renomear variável | `Shift + F6` | Melhorar nome do valor de controle |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver qual case executa |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Commit | `Ctrl + K` | Revisar alterações |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug para switch moderno

Use debug neste exemplo:

```java
String statusPedido = "APROVADO";

String mensagem = switch (statusPedido) {
    case "PENDENTE" -> "Pedido aguardando análise";
    case "APROVADO" -> "Pedido aprovado";
    default -> "Status desconhecido";
};

System.out.println(mensagem);
```

Coloque breakpoint na linha do `switch`.

Observe:

```text
statusPedido = APROVADO.
```

Avance e veja que:

```text
mensagem = Pedido aprovado.
```

Depois teste com:

```java
String statusPedido = "RECUSADO";
```

e com:

```java
String statusPedido = "QUALQUER";
```

Observe o `default`.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 038 — Switch moderno e expressões

### O que aprendi
Aprendi a usar switch moderno com arrow syntax, switch expression, retorno de valor e `yield` quando o case possui bloco.

### O que pratiquei
Criei exemplos com menu, status de pedido, OS, auditoria, mensageria, perfil, prioridade, SLA e entrada com Scanner.

### Conceitos principais
- switch moderno
- switch expression
- switch statement
- arrow syntax
- `->`
- `yield`
- retorno de valor
- `default`
- agrupamento de cases
- String em switch
- char em switch
- int em switch
- risco de null
- padronização com `trim` e `toUpperCase`
- preparação para enum
- exhaustividade futuramente

### Arquivos criados
- `labs/m1/aula-038-switch-moderno/Main.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoStatement.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoPedido.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoOrdemServico.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoOperacaoAuditoria.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoMensageria.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoPerfil.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoPrioridade.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoSla.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoYieldPedido.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoStatusConsole.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoMenuConsole.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoNull.java`
- `labs/m1/aula-038-switch-moderno/SwitchModernoSemYield.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac SwitchModernoPedido.java
java SwitchModernoPedido
javac SwitchModernoPerfil.java
java SwitchModernoPerfil
javac SwitchModernoYieldPedido.java
java SwitchModernoYieldPedido
javac SwitchModernoStatusConsole.java
java SwitchModernoStatusConsole
```

### Erros que quero evitar
- esquecer ponto e vírgula final no switch expression;
- usar bloco sem `yield`;
- usar `break` como se fosse switch tradicional;
- achar que `default` trata `null`;
- esquecer `default` com String;
- tentar usar condição booleana em `case`;
- misturar sintaxe tradicional e moderna sem clareza;
- usar case com tipo incompatível;
- criar case grande demais;
- usar switch quando `if` é mais claro.

### Próximo passo
Estudar `while`.
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
git add labs/m1/aula-038-switch-moderno docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 038: pratica switch moderno e expressoes"
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
1. Qual a diferença entre switch statement e switch expression?
2. Para que serve a sintaxe `->`?
3. Por que o switch expression precisa de ponto e vírgula no final?
4. Quando usamos `yield`?
5. Qual a diferença entre `yield` e `return`?
6. Por que o switch moderno reduz o risco de fall-through?
7. Como agrupar múltiplos valores em um mesmo case moderno?
8. Por que `default` continua importante com String?
9. Por que `default` não deve ser tratado como proteção contra null?
10. Por que switch moderno combina bem com enum futuramente?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar switch moderno;
diferenciar switch statement de switch expression;
usar arrow syntax;
usar switch moderno executando comando;
usar switch expression retornando String;
usar switch expression retornando int;
usar default;
usar múltiplos valores no mesmo case;
usar switch com int;
usar switch com String;
usar switch com char;
usar yield em case com bloco;
explicar quando yield é necessário;
explicar ponto e vírgula final;
evitar break desnecessário em switch moderno com seta;
padronizar String antes do switch;
tratar null antes do switch;
aplicar switch moderno em pedido;
aplicar switch moderno em OS;
aplicar switch moderno em auditoria;
aplicar switch moderno em mensageria;
aplicar switch moderno em perfil;
aplicar switch moderno em prioridade;
aplicar switch moderno em SLA;
usar Scanner com switch moderno;
explicar preparação para enum;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `enum`.

Não precisa ainda dominar pattern matching.

Não precisa ainda dominar sealed classes.

Não precisa ainda dominar todos os detalhes internos de exhaustividade.

Esses assuntos virão depois.

O objetivo é dominar switch moderno em uso inicial e entender retorno de valor com `yield`.

---

## Fechamento da aula

Hoje estudamos o `switch` moderno.

Ele permite escrever seleções por valor de forma mais clara e segura.

Vimos:

```text
arrow syntax;
switch expression;
retorno de valor;
yield;
default;
agrupamento de cases;
uso com int, String e char;
padronização de entrada;
risco de null;
preparação para enum.
```

A principal diferença em relação ao switch tradicional é que agora podemos fazer:

```java
String mensagem = switch (status) {
    case "APROVADO" -> "Aprovado";
    default -> "Desconhecido";
};
```

Ou seja:

```text
o switch produz valor.
```

Isso muda a forma de escrever regras de mapeamento.

Também vimos que `yield` aparece quando um case tem bloco e precisa devolver valor.

Na próxima aula, vamos estudar `while`.

Com `while`, entraremos em repetição.

O programa deixará de apenas decidir uma vez e começará a repetir enquanto uma condição for verdadeira.
