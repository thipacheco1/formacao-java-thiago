# 036 — M1.16 — Ifs Aninhados e Simplificação

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.16.01` — Ifs aninhados e simplificação — Conceito, por que existe e vocabulário essencial.
- `M1.16.02` — Ifs aninhados e simplificação — Exemplo mínimo digitado do zero.
- `M1.16.03` — Ifs aninhados e simplificação — Exemplo aplicado ao domínio corporativo.
- `M1.16.04` — Ifs aninhados e simplificação — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar quando aninhar `if`, quando evitar, como identificar leitura ruim, como simplificar regras condicionais, como extrair variáveis booleanas, como reduzir níveis de indentação e como se preparar para o conceito de guard clauses.

---

## Onde estamos na formação

Estamos no Módulo 1, logo depois da primeira aula de decisão com `if`, `else if` e `else`.

A sequência recente foi:

```text
031 — M1.11 — Operadores aritméticos;
032 — M1.12 — Operadores relacionais;
033 — M1.13 — Operadores lógicos;
034 — M1.14 — Incremento, decremento e acumuladores;
035 — M1.15 — If, else if e else;
036 — M1.16 — Ifs aninhados e simplificação.
```

Na aula anterior, o programa começou a tomar decisões.

Exemplo:

```java
if (pedidoPodeProcessar) {
    System.out.println("Pedido pode ser processado");
} else {
    System.out.println("Pedido não pode ser processado");
}
```

Agora vamos estudar um problema que aparece logo depois que a pessoa aprende `if`:

```text
começar a colocar if dentro de if dentro de if.
```

Isso é chamado de:

```text
if aninhado.
```

If aninhado não é proibido.

Mas, se usado sem cuidado, cria código difícil de ler, difícil de testar e fácil de quebrar.

---

## Hoje a aula é sobre não deixar o código virar uma escada

Quando começamos a programar, é comum escrever regras assim:

```java
if (clienteAtivo) {
    if (!possuiPendencia) {
        if (emailValidado) {
            System.out.println("Cliente apto");
        }
    }
}
```

Esse código funciona.

Mas ele começa a formar uma escada para a direita.

Quanto mais regra entra, mais indentado o código fica.

Exemplo visual:

```text
if (...)
    if (...)
        if (...)
            if (...)
                if (...)
                    faz alguma coisa
```

Esse formato dificulta a leitura.

O cérebro precisa lembrar todas as condições anteriores para entender por que a linha de dentro executa.

Em backend real, isso fica perigoso.

Regras de negócio já são complexas por natureza.

Se o código também ficar visualmente complexo, a manutenção vira sofrimento.

---

## O que é if aninhado

If aninhado é um `if` dentro de outro `if`.

Exemplo:

```java
if (clienteAtivo) {
    if (!possuiPendencia) {
        System.out.println("Cliente pode comprar");
    }
}
```

Leitura:

```text
se o cliente está ativo,
então verifica se não possui pendência,
então permite comprar.
```

Isso é válido.

O problema não é existir um `if` dentro de outro.

O problema é aninhar demais sem necessidade.

---

## Exemplo mínimo de if aninhado

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;

        if (clienteAtivo) {
            if (!possuiPendencia) {
                System.out.println("Cliente pode comprar");
            }
        }
    }
}
```

Saída:

```text
Cliente pode comprar
```

Esse exemplo é simples.

Mas já temos dois níveis de decisão.

Se adicionarmos mais regras, o código começa a ficar mais difícil.

---

## O mesmo exemplo simplificado

Podemos combinar as condições com `&&`:

```java
public class Main {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;

        if (clienteAtivo && !possuiPendencia) {
            System.out.println("Cliente pode comprar");
        }
    }
}
```

A regra ficou em uma única condição:

```java
clienteAtivo && !possuiPendencia
```

Leitura:

```text
se cliente está ativo e não possui pendência.
```

Para esse caso simples, a versão sem aninhamento é melhor.

---

## Quando o aninhamento pode fazer sentido

Nem todo aninhamento é ruim.

Ele pode fazer sentido quando uma verificação realmente depende da anterior.

Exemplo:

```java
if (clienteEncontrado) {
    if (clienteAtivo) {
        System.out.println("Cliente encontrado e ativo");
    }
}
```

Mas mesmo nesse caso, podemos muitas vezes melhorar a leitura.

O ponto principal é perguntar:

```text
esse if interno realmente depende do externo?
ou posso transformar isso em uma regra booleana mais clara?
```

Se a resposta for que as condições fazem parte da mesma regra, geralmente `&&` e variáveis intermediárias resolvem melhor.

---

## Quando evitar if aninhado

Evite aninhar quando as condições são apenas partes da mesma regra.

Exemplo ruim:

```java
if (pedidoPago) {
    if (!pedidoCancelado) {
        if (produtoDisponivel) {
            if (enderecoValido) {
                System.out.println("Pedido pode ser enviado");
            }
        }
    }
}
```

Esse código pode ser simplificado:

```java
boolean pedidoPodeSerEnviado = pedidoPago
        && !pedidoCancelado
        && produtoDisponivel
        && enderecoValido;

if (pedidoPodeSerEnviado) {
    System.out.println("Pedido pode ser enviado");
}
```

A regra ficou nomeada.

Isso é muito melhor.

---

## A regra nomeada melhora o código

Compare:

```java
if (pedidoPago) {
    if (!pedidoCancelado) {
        if (produtoDisponivel) {
            if (enderecoValido) {
                System.out.println("Pedido pode ser enviado");
            }
        }
    }
}
```

com:

```java
boolean pedidoPodeSerEnviado = pedidoPago
        && !pedidoCancelado
        && produtoDisponivel
        && enderecoValido;

if (pedidoPodeSerEnviado) {
    System.out.println("Pedido pode ser enviado");
}
```

A segunda versão permite ler:

```text
pedidoPodeSerEnviado.
```

Esse nome resume a intenção da regra.

Em código profissional, nomear a regra é uma das melhores formas de simplificar decisão.

---

## Aninhamento e indentação

Indentação é útil.

Mas indentação excessiva é sinal de alerta.

Exemplo:

```java
if (a) {
    if (b) {
        if (c) {
            if (d) {
                System.out.println("Executa");
            }
        }
    }
}
```

Esse código tem quatro níveis.

Cada nível exige memória mental.

O leitor precisa pensar:

```text
estou dentro de a;
também dentro de b;
também dentro de c;
também dentro de d.
```

Quanto mais profundo, mais difícil entender.

Regra prática:

```text
muitos níveis de indentação geralmente pedem simplificação.
```

---

## Estratégia 1 — Combinar condições

Se todas as condições precisam ser verdadeiras, use `&&`.

Antes:

```java
if (clienteAtivo) {
    if (!possuiPendencia) {
        if (emailValidado) {
            System.out.println("Cliente apto");
        }
    }
}
```

Depois:

```java
if (clienteAtivo && !possuiPendencia && emailValidado) {
    System.out.println("Cliente apto");
}
```

Melhor ainda:

```java
boolean clienteApto = clienteAtivo && !possuiPendencia && emailValidado;

if (clienteApto) {
    System.out.println("Cliente apto");
}
```

---

## Estratégia 2 — Criar variáveis intermediárias

Quando a condição fica grande, crie nomes.

Antes:

```java
if (clienteAtivo && !possuiPendencia && emailValidado && valorCompra > 0 && valorCompra <= limiteCredito) {
    System.out.println("Compra autorizada");
}
```

Depois:

```java
boolean clienteValido = clienteAtivo && !possuiPendencia && emailValidado;
boolean compraValida = valorCompra > 0 && valorCompra <= limiteCredito;

boolean compraAutorizada = clienteValido && compraValida;

if (compraAutorizada) {
    System.out.println("Compra autorizada");
}
```

A segunda versão parece maior, mas é mais compreensível.

O código conta uma história.

---

## Estratégia 3 — Separar validações independentes

Se você quer mostrar todos os erros, não use `else if`.

Use `if` separados.

Exemplo:

```java
if (nome.isBlank()) {
    System.out.println("Nome obrigatório");
}

if (!email.contains("@")) {
    System.out.println("E-mail inválido");
}

if (cpf.length() != 11) {
    System.out.println("CPF deve ter 11 caracteres");
}
```

Essas validações são independentes.

O usuário pode ter nome vazio, e-mail inválido e CPF errado ao mesmo tempo.

Se usar `else if`, só o primeiro erro aparece.

---

## Estratégia 4 — Usar else if para caminhos exclusivos

Quando os caminhos são exclusivos, use `else if`.

Exemplo:

```java
if ("PENDENTE".equals(statusPedido)) {
    System.out.println("Pedido aguardando análise");
} else if ("APROVADO".equals(statusPedido)) {
    System.out.println("Pedido aprovado");
} else if ("RECUSADO".equals(statusPedido)) {
    System.out.println("Pedido recusado");
} else {
    System.out.println("Status desconhecido");
}
```

Aqui faz sentido.

Um pedido não deve estar simultaneamente em `PENDENTE`, `APROVADO` e `RECUSADO`.

Caminhos exclusivos combinam com `else if`.

---

## Estratégia 5 — Preparação para guard clauses

Guard clause é uma validação de guarda.

A ideia é:

```text
se algo está inválido, interrompa cedo;
se passou pelas guardas, o fluxo principal fica limpo.
```

Exemplo futuro com método:

```java
if (nome.isBlank()) {
    return;
}

if (!email.contains("@")) {
    return;
}

System.out.println("Cliente válido");
```

Ainda não estamos aprofundando métodos e `return`.

Mas o conceito começa aqui:

```text
validar cedo para não criar uma escada de ifs.
```

Hoje vamos preparar a mentalidade.

---

## Guard clause em linguagem simples

Imagine uma portaria.

Antes de liberar a entrada, a portaria verifica:

```text
tem documento?
tem autorização?
não está bloqueado?
```

Se falhar em uma regra, a pessoa não entra.

Não faz sentido continuar verificando tudo dentro de uma grande escada.

Em código, isso vira:

```text
se não tem documento, bloqueia;
se não tem autorização, bloqueia;
se está bloqueado, bloqueia;
senão, libera.
```

O conceito de guard clause ajuda a deixar o caminho principal menos escondido.

---

## Exemplo sem simplificação

Arquivo:

```text
ClienteAninhado.java
```

Código:

```java
public class ClienteAninhado {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;
        boolean emailValidado = true;

        if (clienteAtivo) {
            if (!possuiPendencia) {
                if (emailValidado) {
                    System.out.println("Cliente apto");
                } else {
                    System.out.println("E-mail não validado");
                }
            } else {
                System.out.println("Cliente possui pendência");
            }
        } else {
            System.out.println("Cliente inativo");
        }
    }
}
```

Esse código funciona.

Mas já começa a exigir leitura de camadas.

Agora vamos simplificar.

---

## Exemplo simplificado com validações em ordem

Arquivo:

```text
ClienteSimplificado.java
```

Código:

```java
public class ClienteSimplificado {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;
        boolean emailValidado = true;

        if (!clienteAtivo) {
            System.out.println("Cliente inativo");
        } else if (possuiPendencia) {
            System.out.println("Cliente possui pendência");
        } else if (!emailValidado) {
            System.out.println("E-mail não validado");
        } else {
            System.out.println("Cliente apto");
        }
    }
}
```

Agora o código tem uma linha de decisão por motivo.

Leitura:

```text
se cliente inativo, informa;
senão se possui pendência, informa;
senão se e-mail não validado, informa;
senão cliente está apto.
```

Essa versão evita a escada.

---

## Exemplo simplificado com regra nomeada

Outra versão:

```java
public class ClienteRegraNomeada {
    public static void main(String[] args) {
        boolean clienteAtivo = true;
        boolean possuiPendencia = false;
        boolean emailValidado = true;

        boolean clienteApto = clienteAtivo && !possuiPendencia && emailValidado;

        if (clienteApto) {
            System.out.println("Cliente apto");
        } else {
            System.out.println("Cliente não apto");
        }
    }
}
```

Essa versão é boa quando não precisa explicar o motivo específico.

Se precisa explicar o motivo, use validações separadas ou `else if`.

Se só precisa aprovar/bloquear, regra nomeada é suficiente.

---

## Escolha depende da intenção

Não existe uma única forma correta para todos os casos.

Pergunte:

```text
preciso informar todos os erros?
preciso informar apenas o primeiro erro?
preciso apenas saber se passou ou não?
os caminhos são exclusivos?
as condições fazem parte da mesma regra?
o código está ficando indentado demais?
```

A resposta define a estrutura.

Código profissional nasce dessas decisões.

---

## Exemplo aplicado: pedido aninhado

Arquivo:

```text
PedidoAninhado.java
```

Código:

```java
public class PedidoAninhado {
    public static void main(String[] args) {
        boolean pedidoPago = true;
        boolean pedidoCancelado = false;
        boolean produtoDisponivel = true;
        boolean enderecoValido = true;

        if (pedidoPago) {
            if (!pedidoCancelado) {
                if (produtoDisponivel) {
                    if (enderecoValido) {
                        System.out.println("Pedido pode ser enviado");
                    } else {
                        System.out.println("Endereço inválido");
                    }
                } else {
                    System.out.println("Produto indisponível");
                }
            } else {
                System.out.println("Pedido cancelado");
            }
        } else {
            System.out.println("Pedido não pago");
        }
    }
}
```

Esse código é a escada clássica.

Agora vamos simplificar.

---

## Pedido simplificado por motivos de bloqueio

Arquivo:

```text
PedidoSimplificado.java
```

Código:

```java
public class PedidoSimplificado {
    public static void main(String[] args) {
        boolean pedidoPago = true;
        boolean pedidoCancelado = false;
        boolean produtoDisponivel = true;
        boolean enderecoValido = true;

        if (!pedidoPago) {
            System.out.println("Pedido não pago");
        } else if (pedidoCancelado) {
            System.out.println("Pedido cancelado");
        } else if (!produtoDisponivel) {
            System.out.println("Produto indisponível");
        } else if (!enderecoValido) {
            System.out.println("Endereço inválido");
        } else {
            System.out.println("Pedido pode ser enviado");
        }
    }
}
```

A leitura ficou linear.

Sem escada.

Essa forma é excelente quando existe uma ordem de bloqueio.

---

## Pedido simplificado com regra final

Outra possibilidade:

```java
public class PedidoRegraNomeada {
    public static void main(String[] args) {
        boolean pedidoPago = true;
        boolean pedidoCancelado = false;
        boolean produtoDisponivel = true;
        boolean enderecoValido = true;

        boolean pedidoPodeSerEnviado = pedidoPago
                && !pedidoCancelado
                && produtoDisponivel
                && enderecoValido;

        if (pedidoPodeSerEnviado) {
            System.out.println("Pedido pode ser enviado");
        } else {
            System.out.println("Pedido não pode ser enviado");
        }
    }
}
```

Essa versão é boa quando você não precisa explicar o motivo.

O nome da regra é o foco.

---

## Exemplo aplicado: OS aninhada

Arquivo:

```text
OrdemServicoAninhada.java
```

Código:

```java
public class OrdemServicoAninhada {
    public static void main(String[] args) {
        boolean ordemServicoAberta = true;
        boolean possuiAtividadePendente = true;
        boolean clienteSolicitouReagendamento = true;
        boolean tecnicoDisponivel = false;

        if (ordemServicoAberta) {
            if (possuiAtividadePendente) {
                if (clienteSolicitouReagendamento) {
                    if (tecnicoDisponivel) {
                        System.out.println("Reagendamento permitido");
                    } else {
                        System.out.println("Técnico indisponível");
                    }
                } else {
                    System.out.println("Cliente não solicitou reagendamento");
                }
            } else {
                System.out.println("Não possui atividade pendente");
            }
        } else {
            System.out.println("OS não está aberta");
        }
    }
}
```

Funciona.

Mas a leitura fica pesada.

---

## OS simplificada

Arquivo:

```text
OrdemServicoSimplificada.java
```

Código:

```java
public class OrdemServicoSimplificada {
    public static void main(String[] args) {
        boolean ordemServicoAberta = true;
        boolean possuiAtividadePendente = true;
        boolean clienteSolicitouReagendamento = true;
        boolean tecnicoDisponivel = false;

        if (!ordemServicoAberta) {
            System.out.println("OS não está aberta");
        } else if (!possuiAtividadePendente) {
            System.out.println("Não possui atividade pendente");
        } else if (!clienteSolicitouReagendamento) {
            System.out.println("Cliente não solicitou reagendamento");
        } else if (!tecnicoDisponivel) {
            System.out.println("Técnico indisponível");
        } else {
            System.out.println("Reagendamento permitido");
        }
    }
}
```

A versão simplificada parece uma lista de bloqueios.

Isso é muito mais fácil de manter.

---

## Exemplo aplicado: autorização aninhada

Arquivo:

```text
AutorizacaoAninhada.java
```

Código:

```java
public class AutorizacaoAninhada {
    public static void main(String[] args) {
        boolean usuarioAtivo = true;
        boolean usuarioBloqueado = false;
        boolean usuarioAdmin = false;
        boolean usuarioSupervisor = true;

        if (usuarioAtivo) {
            if (!usuarioBloqueado) {
                if (usuarioAdmin || usuarioSupervisor) {
                    System.out.println("Usuário pode aprovar");
                } else {
                    System.out.println("Usuário sem perfil aprovador");
                }
            } else {
                System.out.println("Usuário bloqueado");
            }
        } else {
            System.out.println("Usuário inativo");
        }
    }
}
```

Esse código pode ser simplificado.

---

## Autorização simplificada com variáveis intermediárias

Arquivo:

```text
AutorizacaoSimplificada.java
```

Código:

```java
public class AutorizacaoSimplificada {
    public static void main(String[] args) {
        boolean usuarioAtivo = true;
        boolean usuarioBloqueado = false;
        boolean usuarioAdmin = false;
        boolean usuarioSupervisor = true;

        boolean possuiPerfilAprovador = usuarioAdmin || usuarioSupervisor;

        if (!usuarioAtivo) {
            System.out.println("Usuário inativo");
        } else if (usuarioBloqueado) {
            System.out.println("Usuário bloqueado");
        } else if (!possuiPerfilAprovador) {
            System.out.println("Usuário sem perfil aprovador");
        } else {
            System.out.println("Usuário pode aprovar");
        }
    }
}
```

Aqui:

```java
boolean possuiPerfilAprovador = usuarioAdmin || usuarioSupervisor;
```

dá nome a uma parte importante da regra.

Isso melhora o `else if`.

---

## Exemplo aplicado: validações independentes

Arquivo:

```text
ClienteValidacoesIndependentes.java
```

Código:

```java
public class ClienteValidacoesIndependentes {
    public static void main(String[] args) {
        String nome = "";
        String email = "clienteexemplo.com";
        String cpf = "123";

        boolean possuiErro = false;

        if (nome.isBlank()) {
            System.out.println("Nome obrigatório");
            possuiErro = true;
        }

        if (!email.contains("@")) {
            System.out.println("E-mail inválido");
            possuiErro = true;
        }

        if (cpf.length() != 11) {
            System.out.println("CPF deve ter 11 caracteres");
            possuiErro = true;
        }

        if (!possuiErro) {
            System.out.println("Cliente válido");
        }
    }
}
```

Aqui usamos vários `if` separados porque queremos listar todos os erros.

Também usamos um acumulador booleano simples:

```java
boolean possuiErro = false;
```

Quando encontra erro:

```java
possuiErro = true;
```

Esse padrão aparece muito em validação.

---

## Exemplo aplicado: processamento com status

Arquivo:

```text
FluxoStatusSimplificado.java
```

Código:

```java
public class FluxoStatusSimplificado {
    public static void main(String[] args) {
        String status = "APROVADO";

        if ("PENDENTE".equals(status)) {
            System.out.println("Enviar para análise");
        } else if ("APROVADO".equals(status)) {
            System.out.println("Efetivar pedido");
        } else if ("RECUSADO".equals(status)) {
            System.out.println("Registrar recusa");
        } else if ("CANCELADO".equals(status)) {
            System.out.println("Encerrar pedido cancelado");
        } else {
            System.out.println("Status desconhecido");
        }
    }
}
```

Esse caso não precisa de aninhamento.

É uma classificação por caminho exclusivo.

Na próxima aula, `switch tradicional` vai ajudar em alguns cenários parecidos.

---

## Exemplo com Scanner: pedido simplificado

Arquivo:

```text
PedidoSimplificadoConsole.java
```

Código:

```java
import java.util.Scanner;

public class PedidoSimplificadoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Pedido está pago? true/false");
        boolean pedidoPago = scanner.nextBoolean();

        System.out.println("Pedido está cancelado? true/false");
        boolean pedidoCancelado = scanner.nextBoolean();

        System.out.println("Produto disponível? true/false");
        boolean produtoDisponivel = scanner.nextBoolean();

        System.out.println("Endereço válido? true/false");
        boolean enderecoValido = scanner.nextBoolean();

        if (!pedidoPago) {
            System.out.println("Pedido não pago");
        } else if (pedidoCancelado) {
            System.out.println("Pedido cancelado");
        } else if (!produtoDisponivel) {
            System.out.println("Produto indisponível");
        } else if (!enderecoValido) {
            System.out.println("Endereço inválido");
        } else {
            System.out.println("Pedido pode ser enviado");
        }

        scanner.close();
    }
}
```

Teste várias combinações.

O objetivo é perceber a ordem das validações.

---

## Exemplo com Scanner: validações independentes

Arquivo:

```text
ClienteValidacoesConsole.java
```

Código:

```java
import java.util.Scanner;

public class ClienteValidacoesConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome:");
        String nome = scanner.nextLine();

        System.out.println("Digite o e-mail:");
        String email = scanner.nextLine();

        System.out.println("Digite o CPF:");
        String cpf = scanner.nextLine();

        boolean possuiErro = false;

        if (nome.isBlank()) {
            System.out.println("Nome obrigatório");
            possuiErro = true;
        }

        if (!email.contains("@")) {
            System.out.println("E-mail inválido");
            possuiErro = true;
        }

        if (cpf.length() != 11) {
            System.out.println("CPF deve ter 11 caracteres");
            possuiErro = true;
        }

        if (!possuiErro) {
            System.out.println("Cliente válido");
        }

        scanner.close();
    }
}
```

Aqui a pessoa pode receber mais de uma mensagem de erro.

Esse é o comportamento esperado quando as validações são independentes.

---

## Como decidir entre as estruturas

Use este guia.

### Use `if` simples quando:

```text
existe uma ação opcional;
não existe caminho alternativo obrigatório.
```

Exemplo:

```java
if (possuiErro) {
    System.out.println("Existe erro");
}
```

### Use `if/else` quando:

```text
existem dois caminhos claros.
```

Exemplo:

```java
if (pedidoValido) {
    System.out.println("Processar");
} else {
    System.out.println("Bloquear");
}
```

### Use `else if` quando:

```text
os caminhos são excludentes.
```

Exemplo:

```java
if ("PENDENTE".equals(status)) {
} else if ("APROVADO".equals(status)) {
} else {
}
```

### Use `if` separados quando:

```text
várias validações independentes podem falhar ao mesmo tempo.
```

Exemplo:

```java
if (nome.isBlank()) {}
if (!email.contains("@")) {}
if (cpf.length() != 11) {}
```

### Simplifique aninhamento quando:

```text
o código está formando escada;
as condições pertencem à mesma regra;
a leitura exige lembrar muitos níveis;
as mensagens poderiam ser organizadas linearmente.
```

---

## Sinais de que o código precisa simplificar

Fique atento a estes sinais:

```text
muitos níveis de indentação;
muitos `else` fechando no final;
dificuldade para explicar a regra em voz alta;
condições repetidas;
nomes booleanos genéricos;
if gigante;
muitas responsabilidades no mesmo bloco;
mensagens de erro misturadas com regra principal;
status tratado com muitos ifs independentes;
necessidade de comentar cada linha para entender.
```

Quando isso aparecer, pare e reorganize.

Código limpo é código que pode ser lido sem sofrimento.

---

## Erros comuns

### Erro 1 — Criar escada de if sem necessidade

Ruim:

```java
if (a) {
    if (b) {
        if (c) {
            System.out.println("OK");
        }
    }
}
```

Melhor:

```java
if (a && b && c) {
    System.out.println("OK");
}
```

ou:

```java
boolean regraValida = a && b && c;

if (regraValida) {
    System.out.println("OK");
}
```

---

### Erro 2 — Simplificar demais e perder mensagem específica

Se você precisa dizer o motivo do bloqueio, isso pode ser pobre:

```java
if (clienteApto) {
    System.out.println("Cliente apto");
} else {
    System.out.println("Cliente não apto");
}
```

Talvez seja melhor:

```java
if (!clienteAtivo) {
    System.out.println("Cliente inativo");
} else if (possuiPendencia) {
    System.out.println("Cliente possui pendência");
} else if (!emailValidado) {
    System.out.println("E-mail não validado");
} else {
    System.out.println("Cliente apto");
}
```

Simplificação não é apagar informação importante.

---

### Erro 3 — Usar else if em validações independentes

Ruim quando quer mostrar todos os erros:

```java
if (nome.isBlank()) {
    System.out.println("Nome obrigatório");
} else if (!email.contains("@")) {
    System.out.println("E-mail inválido");
}
```

Se nome estiver vazio, o e-mail não será avaliado.

Use `if` separados.

---

### Erro 4 — Usar if separados para status exclusivo

Menos claro:

```java
if ("PENDENTE".equals(status)) {}
if ("APROVADO".equals(status)) {}
if ("RECUSADO".equals(status)) {}
```

Melhor:

```java
if ("PENDENTE".equals(status)) {
} else if ("APROVADO".equals(status)) {
} else if ("RECUSADO".equals(status)) {
}
```

---

### Erro 5 — Nomear regra de forma genérica

Ruim:

```java
boolean valido = clienteAtivo && !possuiPendencia && emailValidado;
```

Melhor:

```java
boolean clienteApto = clienteAtivo && !possuiPendencia && emailValidado;
```

---

### Erro 6 — Criar condição gigante sem quebrar

Ruim:

```java
if (clienteAtivo && !possuiPendencia && emailValidado && valorCompra > 0 && valorCompra <= limite && !pedidoCancelado) {
}
```

Melhor:

```java
boolean clienteValido = clienteAtivo && !possuiPendencia && emailValidado;
boolean compraValida = valorCompra > 0 && valorCompra <= limite;
boolean pedidoValido = !pedidoCancelado;

if (clienteValido && compraValida && pedidoValido) {
}
```

---

### Erro 7 — Ignorar ordem de bloqueio

Se você valida `produtoDisponivel` antes de `produtoAtivo`, talvez a mensagem fique estranha.

Exemplo:

```text
produto inativo e sem estoque.
```

Qual mensagem deve aparecer primeiro?

Depende da regra.

A ordem do `else if` deve refletir a prioridade do negócio.

---

### Erro 8 — Esconder o fluxo principal no último nível

Ruim:

```java
if (a) {
    if (b) {
        if (c) {
            executarFluxoPrincipal();
        }
    }
}
```

O fluxo principal está enterrado.

Tente deixar o fluxo principal mais visível.

---

### Erro 9 — Achar que todo aninhamento é errado

Nem todo aninhamento é proibido.

Às vezes ele faz sentido.

O problema é aninhar sem necessidade e sem clareza.

---

### Erro 10 — Não testar combinações

Quando há várias condições, teste combinações.

Exemplo para pedido:

```text
pago, não cancelado, produto disponível, endereço válido;
não pago;
cancelado;
produto indisponível;
endereço inválido;
mais de um erro ao mesmo tempo.
```

Sem testar combinações, regra condicional passa falsa sensação de segurança.

---

## Diagnóstico de if aninhado

Quando o código ficar confuso, siga o roteiro.

### 1. Quantos níveis de indentação existem?

Se passar de dois ou três, olhe com cuidado.

### 2. As condições fazem parte da mesma regra?

Se sim, talvez `&&` resolva.

### 3. Precisa mostrar motivo específico?

Se sim, talvez `else if` por bloqueio seja melhor.

### 4. Precisa mostrar todos os erros?

Se sim, use `if` separados.

### 5. Os caminhos são exclusivos?

Se sim, use `else if`.

### 6. Existe uma regra que pode ser nomeada?

Crie variável booleana intermediária.

### 7. A ordem dos bloqueios reflete o negócio?

Reorganize se necessário.

### 8. O fluxo principal está enterrado?

Tente deixá-lo mais visível.

### 9. Há comparação de String com `==`?

Troque por `equals`.

### 10. O código foi testado com combinações diferentes?

Teste cenários de aprovação e bloqueio.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Escada de if

```java
public class Main {
    public static void main(String[] args) {
        boolean a = true;
        boolean b = true;
        boolean c = true;

        if (a) {
            if (b) {
                if (c) {
                    System.out.println("Executou");
                }
            }
        }
    }
}
```

Depois simplifique para:

```java
if (a && b && c) {
    System.out.println("Executou");
}
```

### Teste 2 — else if impedindo múltiplos erros

```java
public class Main {
    public static void main(String[] args) {
        String nome = "";
        String email = "email-sem-arroba";

        if (nome.isBlank()) {
            System.out.println("Nome obrigatório");
        } else if (!email.contains("@")) {
            System.out.println("E-mail inválido");
        }
    }
}
```

Depois troque por `if` separados.

### Teste 3 — Mensagem específica versus regra única

Crie uma versão com:

```java
boolean clienteApto = clienteAtivo && !possuiPendencia && emailValidado;
```

e outra com mensagens específicas usando `else if`.

Compare a utilidade de cada uma.

### Teste 4 — Ordem de bloqueio

Troque a ordem de validações no exemplo de produto.

Veja como a primeira mensagem muda.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-036-ifs-aninhados-simplificacao
cd labs\m1\aula-036-ifs-aninhados-simplificacao
```

Crie arquivos:

```text
Main.java
ClienteAninhado.java
ClienteSimplificado.java
ClienteRegraNomeada.java
PedidoAninhado.java
PedidoSimplificado.java
PedidoRegraNomeada.java
OrdemServicoAninhada.java
OrdemServicoSimplificada.java
AutorizacaoAninhada.java
AutorizacaoSimplificada.java
ClienteValidacoesIndependentes.java
FluxoStatusSimplificado.java
PedidoSimplificadoConsole.java
ClienteValidacoesConsole.java
```

Compile:

```powershell
javac Main.java
javac ClienteAninhado.java
javac ClienteSimplificado.java
javac ClienteRegraNomeada.java
javac PedidoAninhado.java
javac PedidoSimplificado.java
javac PedidoRegraNomeada.java
javac OrdemServicoAninhada.java
javac OrdemServicoSimplificada.java
javac AutorizacaoAninhada.java
javac AutorizacaoSimplificada.java
javac ClienteValidacoesIndependentes.java
javac FluxoStatusSimplificado.java
javac PedidoSimplificadoConsole.java
javac ClienteValidacoesConsole.java
```

Execute:

```powershell
java Main
java ClienteAninhado
java ClienteSimplificado
java ClienteRegraNomeada
java PedidoAninhado
java PedidoSimplificado
java PedidoRegraNomeada
java OrdemServicoAninhada
java OrdemServicoSimplificada
java AutorizacaoAninhada
java AutorizacaoSimplificada
java ClienteValidacoesIndependentes
java FluxoStatusSimplificado
java PedidoSimplificadoConsole
java ClienteValidacoesConsole
```

Depois compare as versões aninhadas e simplificadas.

Registre no diário qual ficou mais fácil de ler e por quê.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Ver indentação real |
| Renomear variável | `Shift + F6` | Nomear regras booleanas |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver qual bloco executa |
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

## Debug para if aninhado

Use debug para comparar os dois estilos.

No código aninhado:

```java
if (pedidoPago) {
    if (!pedidoCancelado) {
        if (produtoDisponivel) {
            if (enderecoValido) {
                System.out.println("Pedido pode ser enviado");
            }
        }
    }
}
```

Observe como o cursor entra em vários blocos.

Na versão simplificada:

```java
if (!pedidoPago) {
    System.out.println("Pedido não pago");
} else if (pedidoCancelado) {
    System.out.println("Pedido cancelado");
} else if (!produtoDisponivel) {
    System.out.println("Produto indisponível");
} else if (!enderecoValido) {
    System.out.println("Endereço inválido");
} else {
    System.out.println("Pedido pode ser enviado");
}
```

Observe como o fluxo fica mais linear.

Esse exercício ajuda a sentir a diferença.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 036 — Ifs aninhados e simplificação

### O que aprendi
Aprendi que `if` aninhado é um `if` dentro de outro `if`, e que ele pode funcionar, mas pode deixar o código difícil de ler quando cria muitos níveis de indentação.

### O que pratiquei
Comparei versões aninhadas e simplificadas de regras para cliente, pedido, OS, autorização, status e validações independentes.

### Conceitos principais
- if aninhado
- simplificação
- indentação excessiva
- regra nomeada
- variável booleana intermediária
- validações independentes
- caminhos exclusivos
- ordem de bloqueio
- preparação para guard clauses
- escada de if
- fluxo principal
- mensagens específicas

### Arquivos criados
- `labs/m1/aula-036-ifs-aninhados-simplificacao/Main.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/ClienteAninhado.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/ClienteSimplificado.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/ClienteRegraNomeada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/PedidoAninhado.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/PedidoSimplificado.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/PedidoRegraNomeada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/OrdemServicoAninhada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/OrdemServicoSimplificada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/AutorizacaoAninhada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/AutorizacaoSimplificada.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/ClienteValidacoesIndependentes.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/FluxoStatusSimplificado.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/PedidoSimplificadoConsole.java`
- `labs/m1/aula-036-ifs-aninhados-simplificacao/ClienteValidacoesConsole.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ClienteAninhado.java
java ClienteAninhado
javac ClienteSimplificado.java
java ClienteSimplificado
javac PedidoAninhado.java
java PedidoAninhado
javac PedidoSimplificado.java
java PedidoSimplificado
```

### Erros que quero evitar
- criar escada de `if` sem necessidade;
- simplificar demais e perder mensagem específica;
- usar `else if` quando preciso mostrar vários erros;
- usar `if` separados quando a regra é exclusiva;
- nomear regra de forma genérica;
- criar condição gigante sem quebrar;
- ignorar ordem de bloqueio;
- esconder fluxo principal no último nível;
- achar que todo aninhamento é errado;
- não testar combinações.

### Próximo passo
Estudar `switch` tradicional.
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
git add labs/m1/aula-036-ifs-aninhados-simplificacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 036: pratica ifs aninhados e simplificacao"
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
1. O que é um if aninhado?
2. Por que if aninhado demais pode atrapalhar a leitura?
3. Quando faz sentido combinar condições com `&&`?
4. Para que servem variáveis booleanas intermediárias?
5. Quando usar `if` separados em vez de `else if`?
6. Quando usar `else if` em vez de vários `if` separados?
7. O que é uma escada de if?
8. O que é a ideia de guard clause?
9. Por que a ordem dos bloqueios importa?
10. Como decidir entre regra nomeada e mensagens específicas?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é if aninhado;
criar um if aninhado simples;
identificar excesso de indentação;
simplificar if aninhado com &&;
simplificar if aninhado com else if;
criar regra booleana nomeada;
usar variáveis intermediárias;
diferenciar validações independentes de caminhos exclusivos;
usar if separados para múltiplos erros;
usar else if para status exclusivo;
explicar preparação para guard clauses;
identificar escada de if;
reorganizar ordem de bloqueio;
preservar mensagens específicas quando necessário;
evitar condição gigante;
aplicar simplificação em cliente;
aplicar simplificação em pedido;
aplicar simplificação em OS;
aplicar simplificação em autorização;
aplicar simplificação em status;
usar Scanner em exemplo simplificado;
debugar versão aninhada e simplificada;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar guard clauses com métodos.

Não precisa ainda dominar `return` antecipado.

Não precisa ainda dominar `switch`.

Não precisa ainda dominar clean code em profundidade.

Esses assuntos virão depois.

O objetivo é reconhecer aninhamento ruim e começar a simplificar decisões.

---

## Fechamento da aula

Hoje aprendemos que o `if` é poderoso, mas pode virar problema quando usado sem organização.

If aninhado funciona.

Mas muitos níveis criam uma escada difícil de ler.

Vimos formas de simplificar:

```text
combinar condições com &&;
criar variáveis booleanas intermediárias;
usar else if para caminhos exclusivos;
usar if separados para validações independentes;
nomear regras de negócio;
organizar motivos de bloqueio;
preparar o pensamento para guard clauses.
```

O objetivo não é eliminar todo if aninhado.

O objetivo é escrever decisões que alguém consiga entender, testar e alterar sem medo.

Na próxima aula, vamos estudar `switch` tradicional.

Ele será útil quando temos uma variável com vários valores possíveis e queremos escolher um caminho de execução para cada valor.
