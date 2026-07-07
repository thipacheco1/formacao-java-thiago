# 035 — M1.15 — If, else if e else

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.15.01` — If, else if e else — Conceito, por que existe e vocabulário essencial.
- `M1.15.02` — If, else if e else — Exemplo mínimo digitado do zero.
- `M1.15.03` — If, else if e else — Exemplo aplicado ao domínio corporativo.
- `M1.15.04` — If, else if e else — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar decisão, fluxo, validações, mensagens, condições simples, `if`, `else`, `else if`, ordem de avaliação, múltiplos caminhos, erros comuns, diagnóstico, debug e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Antes de começar:

```powershell
java -version
javac -version
git --version
```

A prática desta aula será feita em:

```text
labs/m1/aula-035-if-else-if-e-else
```

---

## Onde estamos na formação

Antes desta aula, estudamos:

```text
operadores aritméticos;
operadores relacionais;
operadores lógicos;
incremento;
decremento;
acumuladores.
```

Agora chegamos em uma das estruturas mais importantes da programação:

```text
decisão.
```

Sem decisão, o programa executa sempre o mesmo caminho.

Com `if`, `else if` e `else`, o programa escolhe caminhos diferentes conforme as condições.

---

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

## Diagnóstico

Quando uma decisão não funcionar:

```text
1. Imprima o valor analisado.
2. Imprima o resultado de cada condição.
3. Verifique a ordem dos blocos.
4. Verifique se usou `else if` ou vários `if`.
5. Verifique comparação de String.
6. Verifique se há `else` final.
7. Verifique se há `;` após o `if`.
```

Exemplo:

```java
System.out.println("total: " + total);
System.out.println(">=1000: " + (total.compareTo(new BigDecimal("1000.00")) >= 0));
System.out.println(">=500: " + (total.compareTo(new BigDecimal("500.00")) >= 0));
```

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

## Quebrando de propósito

Faça estes testes:

```text
colocar `>= 500` antes de `>= 1000`;
trocar `else if` por vários `if`;
usar status desconhecido;
comparar String com `==`;
colocar ponto e vírgula após if;
remover else final.
```

Explique cada comportamento.

---

## Prática recomendada

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

## README recomendado da aula

```markdown
# Aula 035 — If, else if e else

## Objetivo

Aprender a criar decisões simples e decisões com múltiplos caminhos em Java.

## Conceitos

- `if` executa quando a condição é verdadeira.
- `else` executa quando nenhuma condição anterior foi verdadeira.
- `else if` cria caminhos intermediários.
- Java avalia de cima para baixo.
- Apenas um bloco executa em uma cadeia.
- A ordem das condições importa.
- `else` final trata caso padrão.
- Vários `if` são diferentes de `else if`.
- String deve ser comparada com `.equals`.

## Comandos

```powershell
javac IfElseIfBasico.java
java IfElseIfBasico
javac PedidoIfElseIf.java
java PedidoIfElseIf
```
```

---

## Registro no diário de bordo

```markdown
## Aula 035 — If, else if e else

### O que aprendi

Aprendi a usar `if`, `else if` e `else` para criar decisões simples e múltiplos caminhos.

### O que pratiquei

Criei exemplos de idade, nota, pedido, produto, pagamento, OS, mensageria e auditoria.

### Conceitos principais

- if
- else
- else if
- condição booleana
- ordem de avaliação
- múltiplos caminhos
- else final
- comparação de String
- mensagens coerentes
- debug de decisão

### Erros que quero evitar

- ordem errada das faixas;
- vários if quando só um caminho deve executar;
- esquecer else final;
- repetir condição;
- comparar String com `==`;
- colocar `;` após if;
- escrever mensagem incoerente.
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

## Perguntas de fixação

```text
1. Para que serve if?
2. Para que serve else?
3. Para que serve else if?
4. O else é obrigatório?
5. O que deve existir dentro dos parênteses do if?
6. O que acontece quando a condição é true?
7. O que acontece quando a condição é false?
8. Java avalia else if em qual ordem?
9. Quantos blocos executam em uma cadeia if/else if/else?
10. Por que a ordem das faixas importa?
11. Qual diferença entre vários if e else if?
12. Para que serve else final?
13. Como comparar String corretamente?
14. Por que usar chaves?
15. Qual problema de colocar `;` após if?
16. Como classificar pedido por valor?
17. Como tratar status de pagamento?
18. Como tratar status de OS?
19. Como debug ajuda em decisões?
20. Quando uma cadeia grande demais pode pedir outra solução?
```

---

## Critério de aprovação

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
