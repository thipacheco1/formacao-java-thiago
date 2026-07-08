# 035 — M1.15 — If, else if e else

## A pergunta central da aula

Como fazer o programa tomar decisões?

Exemplo:

```text
se o pagamento foi aprovado -> liberar pedido;
senão, se está pendente -> aguardar;
senão -> recusar.
```

Em Java:

```java
if (pagamentoAprovado) {
    System.out.println("Liberar pedido.");
} else if (pagamentoPendente) {
    System.out.println("Aguardar confirmação.");
} else {
    System.out.println("Pagamento recusado.");
}
```

Essa é a base de muitos fluxos backend.

---

## O que é `if`

`if` significa:

```text
se
```

Estrutura:

```java
if (condicao) {
    // executa se a condição for true
}
```

A condição precisa resultar em boolean.

Exemplo:

```java
int idade = 20;

if (idade >= 18) {
    System.out.println("Maior de idade.");
}
```

---

## O que é `else`

`else` significa:

```text
senão
```

Ele executa quando o `if` não executa.

Exemplo:

```java
int idade = 16;

if (idade >= 18) {
    System.out.println("Maior de idade.");
} else {
    System.out.println("Menor de idade.");
}
```

Se a condição do `if` for `false`, o `else` executa.

---

## O que é `else if`

`else if` significa:

```text
senão, se outra condição for verdadeira.
```

Use quando existem múltiplos caminhos possíveis.

Exemplo:

```java
double nota = 8.5;

if (nota >= 9.0) {
    System.out.println("Excelente.");
} else if (nota >= 7.0) {
    System.out.println("Aprovado.");
} else if (nota >= 5.0) {
    System.out.println("Recuperação.");
} else {
    System.out.println("Reprovado.");
}
```

A avaliação ocorre de cima para baixo.

Quando um bloco executa, os demais são ignorados.

---

## Fluxo mental

Pense assim:

```text
if -> testa primeira condição;
else if -> testa próxima condição se a anterior falhou;
else -> executa se nenhuma anterior foi verdadeira.
```

Em uma cadeia:

```java
if (...) {
} else if (...) {
} else if (...) {
} else {
}
```

apenas um caminho executa.

---

## If básico

Arquivo:

```text
IfBasico.java
```

Código:

```java
public class IfBasico {
    public static void main(String[] args) {
        boolean clienteAtivo = true;

        if (clienteAtivo) {
            System.out.println("Cliente ativo.");
        }
    }
}
```

Se `clienteAtivo` for `false`, nada será impresso.

---

## If/else básico

Arquivo:

```text
IfElseBasico.java
```

Código:

```java
public class IfElseBasico {
    public static void main(String[] args) {
        int idade = 17;

        if (idade >= 18) {
            System.out.println("Maior de idade.");
        } else {
            System.out.println("Menor de idade.");
        }
    }
}
```

Compile:

```powershell
javac IfElseBasico.java
```

Execute:

```powershell
java IfElseBasico
```

---

## If/else if/else

Arquivo:

```text
IfElseIfBasico.java
```

Código:

```java
public class IfElseIfBasico {
    public static void main(String[] args) {
        double nota = 8.5;

        if (nota >= 9.0) {
            System.out.println("Excelente.");
        } else if (nota >= 7.0) {
            System.out.println("Aprovado.");
        } else if (nota >= 5.0) {
            System.out.println("Recuperação.");
        } else {
            System.out.println("Reprovado.");
        }
    }
}
```

Saída:

```text
Aprovado.
```

---

## Ordem importa

Em faixas, a ordem muda o resultado.

Errado:

```java
double nota = 9.5;

if (nota >= 7.0) {
    System.out.println("Aprovado.");
} else if (nota >= 9.0) {
    System.out.println("Excelente.");
}
```

Para nota `9.5`, imprime:

```text
Aprovado.
```

Porque `nota >= 7.0` já é true.

Correto:

```java
if (nota >= 9.0) {
    System.out.println("Excelente.");
} else if (nota >= 7.0) {
    System.out.println("Aprovado.");
}
```

Regra:

```text
em faixas, avalie do mais restritivo para o mais geral.
```

---

## Vários `if` versus `else if`

Vários `if` independentes podem executar vários blocos.

```java
if (nota >= 9.0) {
    System.out.println("Excelente.");
}

if (nota >= 7.0) {
    System.out.println("Aprovado.");
}

if (nota >= 5.0) {
    System.out.println("Recuperação.");
}
```

Para nota `9.5`, imprime várias mensagens.

Com `else if`, apenas uma:

```java
if (nota >= 9.0) {
    System.out.println("Excelente.");
} else if (nota >= 7.0) {
    System.out.println("Aprovado.");
} else if (nota >= 5.0) {
    System.out.println("Recuperação.");
}
```

Use `else if` quando as alternativas são excludentes.

---

## Else final

O `else` final cobre casos não previstos nos blocos anteriores.

Exemplo:

```java
String status = "ERRO_NOVO";

if ("APROVADO".equals(status)) {
    System.out.println("Aprovado.");
} else if ("PENDENTE".equals(status)) {
    System.out.println("Pendente.");
} else if ("RECUSADO".equals(status)) {
    System.out.println("Recusado.");
} else {
    System.out.println("Status desconhecido.");
}
```

Sem `else`, status desconhecido poderia passar silenciosamente.

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoIfElseIf.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoIfElseIf {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("850.00");

        if (total.compareTo(new BigDecimal("1000.00")) >= 0) {
            System.out.println("Pedido de alto valor.");
        } else if (total.compareTo(new BigDecimal("500.00")) >= 0) {
            System.out.println("Pedido de médio valor.");
        } else if (total.compareTo(BigDecimal.ZERO) > 0) {
            System.out.println("Pedido de baixo valor.");
        } else {
            System.out.println("Pedido inválido.");
        }
    }
}
```

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoIfElseIf.java
```

Código:

```java
public class ProdutoIfElseIf {
    public static void main(String[] args) {
        int estoque = 3;

        if (estoque == 0) {
            System.out.println("Produto sem estoque.");
        } else if (estoque <= 5) {
            System.out.println("Produto com estoque baixo.");
        } else {
            System.out.println("Produto com estoque normal.");
        }
    }
}
```

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoIfElseIf.java
```

Código:

```java
public class PagamentoIfElseIf {
    public static void main(String[] args) {
        String status = "APROVADO";

        if ("APROVADO".equals(status)) {
            System.out.println("Liberar pedido.");
        } else if ("PENDENTE".equals(status)) {
            System.out.println("Aguardar pagamento.");
        } else if ("RECUSADO".equals(status)) {
            System.out.println("Notificar recusa.");
        } else {
            System.out.println("Status de pagamento desconhecido.");
        }
    }
}
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoIfElseIf.java
```

Código:

```java
public class OrdemServicoIfElseIf {
    public static void main(String[] args) {
        String statusOs = "REAGENDADA";

        if ("AGENDADA".equals(statusOs)) {
            System.out.println("OS aguardando execução.");
        } else if ("REAGENDADA".equals(statusOs)) {
            System.out.println("OS teve reagendamento.");
        } else if ("CONCLUIDA".equals(statusOs)) {
            System.out.println("OS finalizada.");
        } else if ("CANCELADA".equals(statusOs)) {
            System.out.println("OS cancelada.");
        } else {
            System.out.println("Status de OS desconhecido.");
        }
    }
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaIfElseIf.java
```

Código:

```java
public class MensageriaIfElseIf {
    public static void main(String[] args) {
        String tipoMensagem = "ENTREGA";

        if ("BOAS_VINDAS".equals(tipoMensagem)) {
            System.out.println("Enviar boas-vindas.");
        } else if ("ENTREGA".equals(tipoMensagem)) {
            System.out.println("Enviar confirmação de entrega.");
        } else if ("NPS".equals(tipoMensagem)) {
            System.out.println("Enviar pesquisa NPS.");
        } else {
            System.out.println("Tipo de mensagem não configurado.");
        }
    }
}
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaIfElseIf.java
```

Código:

```java
public class AuditoriaIfElseIf {
    public static void main(String[] args) {
        String operacao = "EXCLUSAO";

        if ("CRIACAO".equals(operacao)) {
            System.out.println("Auditoria: registro criado.");
        } else if ("EDICAO".equals(operacao)) {
            System.out.println("Auditoria: registro editado.");
        } else if ("EXCLUSAO".equals(operacao)) {
            System.out.println("Auditoria: registro excluído.");
        } else {
            System.out.println("Auditoria: operação desconhecida.");
        }
    }
}
```

---

## Blocos com chaves

Sempre use chaves.

Evite:

```java
if (ativo)
    System.out.println("Ativo.");
else
    System.out.println("Inativo.");
```

Prefira:

```java
if (ativo) {
    System.out.println("Ativo.");
} else {
    System.out.println("Inativo.");
}
```

Chaves reduzem erro em manutenção.

---

## Mensagens coerentes

A mensagem precisa combinar com a condição.

Errado:

```java
if (valor.compareTo(BigDecimal.ZERO) <= 0) {
    System.out.println("Pagamento aprovado.");
}
```

A condição fala de valor inválido, mas a mensagem diz aprovado.

Regra:

```text
condição, bloco e mensagem precisam contar a mesma história.
```

---

## Quando a cadeia fica grande demais

Se houver muitos `else if`, talvez futuramente seja melhor usar:

```text
switch;
enum;
Map;
polimorfismo;
strategy;
tabela de decisão.
```

Mas nesta fase, aprenda bem o básico.

Não pule para solução avançada antes de dominar decisão.

---

## Erros comuns

### Erro 1 — Ordem errada das faixas

Colocar `>= 7` antes de `>= 9`.

### Erro 2 — Usar vários `if` quando só um caminho deve executar

Pode gerar múltiplas mensagens.

### Erro 3 — Esquecer `else` final

Caso desconhecido passa sem tratamento.

### Erro 4 — Condição repetida

```java
if (status == 1) {
} else if (status == 1) {
}
```

Segundo bloco nunca executa.

### Erro 5 — Comparar String com `==`

Use `.equals`.

### Erro 6 — Colocar `;` após `if`

Errado:

```java
if (idade >= 18);
{
    System.out.println("Maior.");
}
```

### Erro 7 — Mensagem incoerente

Condição inválida com mensagem de sucesso.

---

## Debug recomendado

Use debug em:

```text
PedidoIfElseIf.java
```

Coloque breakpoint no primeiro `if`.

Observe:

```text
total;
resultado da primeira condição;
resultado da segunda condição;
qual bloco executa;
por que os blocos abaixo são ignorados.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-035-if-else-if-e-else
cd labs\m1\aula-035-if-else-if-e-else
```

Crie arquivos:

```text
IfBasico.java
IfElseBasico.java
IfElseIfBasico.java
PedidoIfElseIf.java
ProdutoIfElseIf.java
PagamentoIfElseIf.java
OrdemServicoIfElseIf.java
MensageriaIfElseIf.java
AuditoriaIfElseIf.java
ErroOrdemFaixas.java
ErroVariosIf.java
ErroSemElseFinal.java
ErroStringComIgualIgual.java
ErroPontoVirgulaAposIf.java
README.md
```

Compile:

```powershell
javac IfBasico.java
javac IfElseBasico.java
javac IfElseIfBasico.java
javac PedidoIfElseIf.java
javac ProdutoIfElseIf.java
javac PagamentoIfElseIf.java
javac OrdemServicoIfElseIf.java
javac MensageriaIfElseIf.java
javac AuditoriaIfElseIf.java
```

Execute:

```powershell
java IfBasico
java IfElseBasico
java IfElseIfBasico
java PedidoIfElseIf
java ProdutoIfElseIf
java PagamentoIfElseIf
java OrdemServicoIfElseIf
java MensageriaIfElseIf
java AuditoriaIfElseIf
```

---

## Commit recomendado

```bash
git status
git add labs/m1/aula-035-if-else-if-e-else docs/diario-de-bordo.md
git commit -m "Aula 035: pratica if else if e else"
git status
```

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar if;
explicar else;
explicar else if;
criar decisão simples;
criar decisão com múltiplos caminhos;
usar operadores relacionais em if;
usar operadores lógicos em if;
organizar faixas corretamente;
diferenciar vários if de else if;
usar else final;
comparar String corretamente;
usar chaves corretamente;
evitar ponto e vírgula após if;
aplicar em pedido;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar cadeia de decisão;
registrar aula no diário;
fazer commit limpo.
```

---

## Fechamento

`if`, `else if` e `else` são a base da tomada de decisão em Java.

A ideia central é:

```text
o programa escolhe caminhos diferentes conforme as condições.
```

Na próxima aula, estudaremos:

```text
Ifs aninhados e simplificação.
```
