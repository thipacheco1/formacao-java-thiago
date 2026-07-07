# 033 — M1.13 — Operadores lógicos

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar, valide:

```powershell
java -version
javac -version
git --version
```

A prática desta aula será feita em:

```text
labs/m1/aula-033-operadores-logicos
```

---

## Onde estamos na formação

Até aqui, já estudamos:

```text
variáveis;
tipos primitivos;
boolean;
String;
entrada com Scanner;
operadores aritméticos;
operadores relacionais.
```

Operadores relacionais criam perguntas simples:

```java
idade >= 18
valor > 0
quantidade == 10
status != 0
```

Essas expressões retornam:

```text
true
false
```

Agora vamos combinar várias perguntas em uma regra maior.

Exemplo:

```java
idade >= 18 && possuiDocumento
```

Aqui, o programa não avalia apenas uma condição.

Ele avalia uma combinação.

Essa é a função dos operadores lógicos.

---

## A pergunta central da aula

Como representar regras como estas?

```text
cliente está ativo E pagamento está confirmado;
status é AGENDADO OU REAGENDADO;
usuário NÃO está bloqueado;
valor é positivo E saldo é suficiente E conta NÃO está suspensa;
OS tem certificado informado E data válida E período MANHÃ ou TARDE.
```

Em Java, usamos:

```text
&&
||
!
```

---

## O que são operadores lógicos

Operadores lógicos combinam valores booleanos.

Ou seja, eles trabalham com expressões que resultam em:

```text
true
false
```

Principais operadores desta aula:

```text
&&  E lógico
||  OU lógico
!   NÃO lógico
```

Eles são fundamentais para:

```text
validações;
regras de negócio;
controle de acesso;
status de fluxo;
permissões;
decisão de processamento;
bloqueios;
mensagens;
tratamento de casos.
```

---

## `&&` — E lógico

`&&` significa:

```text
todas as condições precisam ser verdadeiras.
```

Exemplo:

```java
int idade = 20;
boolean possuiDocumento = true;

boolean podeEntrar = idade >= 18 && possuiDocumento;

System.out.println(podeEntrar);
```

Saída:

```text
true
```

Tabela:

```text
true  && true  -> true
true  && false -> false
false && true  -> false
false && false -> false
```

Use `&&` quando os requisitos forem cumulativos.

Exemplos:

```text
cliente ativo E pagamento confirmado;
valor maior que zero E saldo suficiente;
data de agendamento informada E período informado;
usuário autenticado E perfil autorizado;
produto ativo E estoque disponível.
```

---

## `||` — OU lógico

`||` significa:

```text
pelo menos uma condição precisa ser verdadeira.
```

Exemplo:

```java
boolean clienteVip = false;
boolean possuiCupom = true;

boolean temDesconto = clienteVip || possuiCupom;

System.out.println(temDesconto);
```

Saída:

```text
true
```

Tabela:

```text
true  || true  -> true
true  || false -> true
false || true  -> true
false || false -> false
```

Use `||` quando qualquer uma das opções for suficiente.

Exemplos:

```text
cliente VIP OU possui cupom;
status AGENDADO OU REAGENDADO;
usuário ADMIN OU SUPERVISOR;
pagamento PIX OU CARTÃO OU BOLETO;
mensagem de ENTREGA OU NPS.
```

---

## `!` — NÃO lógico

`!` inverte um boolean.

Exemplo:

```java
boolean bloqueado = false;

boolean podeAcessar = !bloqueado;

System.out.println(podeAcessar);
```

Saída:

```text
true
```

Tabela:

```text
!true  -> false
!false -> true
```

Use `!` quando a regra pede negação.

Exemplos:

```text
não bloqueado;
não cancelado;
não expirado;
não vazio;
não possui erro;
não está suspenso.
```

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
OperadoresLogicosBasico.java
```

Código:

```java
public class OperadoresLogicosBasico {
    public static void main(String[] args) {
        int idade = 20;
        boolean possuiDocumento = true;
        boolean bloqueado = false;

        boolean maiorDeIdade = idade >= 18;
        boolean podeEntrar = maiorDeIdade && possuiDocumento && !bloqueado;

        System.out.println("Maior de idade: " + maiorDeIdade);
        System.out.println("Possui documento: " + possuiDocumento);
        System.out.println("Bloqueado: " + bloqueado);
        System.out.println("Pode entrar: " + podeEntrar);
    }
}
```

Compile:

```powershell
javac OperadoresLogicosBasico.java
```

Execute:

```powershell
java OperadoresLogicosBasico
```

Saída esperada:

```text
Maior de idade: true
Possui documento: true
Bloqueado: false
Pode entrar: true
```

---

## Curto-circuito

Java usa curto-circuito com `&&` e `||`.

Isso significa que a avaliação pode parar antes de verificar tudo.

### Curto-circuito com `&&`

No `&&`, se a primeira condição é falsa, o resultado final já será falso.

Exemplo seguro:

```java
String nome = null;

if (nome != null && !nome.isBlank()) {
    System.out.println("Nome informado.");
}
```

Como `nome != null` é `false`, Java não executa:

```java
nome.isBlank()
```

Isso evita `NullPointerException`.

### Curto-circuito com `||`

No `||`, se a primeira condição é verdadeira, o resultado final já será verdadeiro.

Exemplo:

```java
boolean admin = true;
boolean supervisor = false;

if (admin || supervisor) {
    System.out.println("Acesso administrativo.");
}
```

Como `admin` já é `true`, a regra já está satisfeita.

---

## Ordem das condições

A ordem das condições importa principalmente quando há risco de `null`.

Errado:

```java
String nome = null;

if (!nome.isBlank() && nome != null) {
    System.out.println("Nome informado.");
}
```

Esse código tenta chamar `isBlank()` antes de verificar se `nome` existe.

Correto:

```java
String nome = null;

if (nome != null && !nome.isBlank()) {
    System.out.println("Nome informado.");
}
```

Regra:

```text
primeiro verifique existência;
depois use o valor.
```

---

## Parênteses e clareza

Quando misturar `&&` e `||`, use parênteses para comunicar a regra.

Exemplo:

```java
if ((clienteAtivo && pagamentoConfirmado) || clienteVip) {
    System.out.println("Pode processar.");
}
```

Leitura:

```text
cliente ativo e pagamento confirmado
OU
cliente VIP.
```

Outra regra diferente:

```java
if (clienteAtivo && (pagamentoConfirmado || clienteVip)) {
    System.out.println("Pode processar.");
}
```

Leitura:

```text
cliente precisa estar ativo
E
precisa ter pagamento confirmado ou ser VIP.
```

Parênteses não são enfeite.

Eles comunicam intenção e evitam erro de leitura.

---

## Condições grandes

Evite condições enormes em uma linha.

Ruim:

```java
if (cliente != null && !cliente.isBlank() && valor != null && valor.compareTo(BigDecimal.ZERO) > 0 && (status == 1 || status == 2) && !bloqueado) {
    System.out.println("Válido.");
}
```

Melhor:

```java
boolean clienteInformado = cliente != null && !cliente.isBlank();
boolean valorPositivo = valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
boolean statusPermitido = status == 1 || status == 2;
boolean naoBloqueado = !bloqueado;

if (clienteInformado && valorPositivo && statusPermitido && naoBloqueado) {
    System.out.println("Válido.");
}
```

A segunda versão é maior, mas mais profissional.

Ela permite debug e leitura.

---

## Exemplo aplicado: pedido

Arquivo:

```text
ValidacaoPedido.java
```

Código:

```java
import java.math.BigDecimal;

public class ValidacaoPedido {
    public static void main(String[] args) {
        String cliente = "Ana";
        BigDecimal valor = new BigDecimal("150.00");
        int quantidade = 2;
        boolean bloqueado = false;

        boolean clienteInformado = cliente != null && !cliente.isBlank();
        boolean valorPositivo = valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
        boolean quantidadePositiva = quantidade > 0;
        boolean podeProcessar = clienteInformado && valorPositivo && quantidadePositiva && !bloqueado;

        if (podeProcessar) {
            System.out.println("Pedido pode ser processado.");
        } else {
            System.out.println("Pedido inválido.");
        }
    }
}
```

---

## Exemplo aplicado: OS

Arquivo:

```text
ValidacaoOs.java
```

Código:

```java
import java.time.LocalDate;

public class ValidacaoOs {
    public static void main(String[] args) {
        String certificado = "OS-001";
        LocalDate dataAgendamento = LocalDate.now().plusDays(1);
        String periodo = "MANHA";
        boolean cancelada = false;

        boolean certificadoInformado = certificado != null && !certificado.isBlank();
        boolean dataValida = dataAgendamento != null && !dataAgendamento.isBefore(LocalDate.now());
        boolean periodoValido = periodo != null && ("MANHA".equals(periodo) || "TARDE".equals(periodo));
        boolean osPodeSerAgendada = certificadoInformado && dataValida && periodoValido && !cancelada;

        if (osPodeSerAgendada) {
            System.out.println("OS pode ser agendada.");
        } else {
            System.out.println("OS não pode ser agendada.");
        }
    }
}
```

---

## Exemplo aplicado: pagamento

Arquivo:

```text
ValidacaoPagamento.java
```

Código:

```java
import java.math.BigDecimal;

public class ValidacaoPagamento {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("100.00");
        String formaPagamento = "PIX";
        boolean antifraudeAprovado = true;

        boolean valorValido = valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
        boolean formaValida = "PIX".equals(formaPagamento)
                || "CARTAO".equals(formaPagamento)
                || "BOLETO".equals(formaPagamento);

        if (valorValido && formaValida && antifraudeAprovado) {
            System.out.println("Pagamento aprovado.");
        } else {
            System.out.println("Pagamento recusado.");
        }
    }
}
```

---

## Exemplo aplicado: controle de acesso

Arquivo:

```text
ControleAcesso.java
```

Código:

```java
public class ControleAcesso {
    public static void main(String[] args) {
        boolean autenticado = true;
        boolean admin = false;
        boolean supervisor = true;
        boolean bloqueado = false;

        boolean possuiPerfilPermitido = admin || supervisor;
        boolean acessoLiberado = autenticado && possuiPerfilPermitido && !bloqueado;

        if (acessoLiberado) {
            System.out.println("Acesso liberado.");
        } else {
            System.out.println("Acesso negado.");
        }
    }
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
ValidacaoMensageria.java
```

Código:

```java
public class ValidacaoMensageria {
    public static void main(String[] args) {
        String telefone = "11999999999";
        boolean clienteOptIn = true;
        boolean bloqueado = false;

        boolean telefoneInformado = telefone != null && !telefone.isBlank();
        boolean podeEnviarMensagem = telefoneInformado && clienteOptIn && !bloqueado;

        if (podeEnviarMensagem) {
            System.out.println("Mensagem pode ser enviada.");
        } else {
            System.out.println("Mensagem bloqueada.");
        }
    }
}
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
ValidacaoAuditoria.java
```

Código:

```java
public class ValidacaoAuditoria {
    public static void main(String[] args) {
        String usuario = "aline";
        String operacao = "CRIACAO";
        boolean sistemaDisponivel = true;

        boolean usuarioInformado = usuario != null && !usuario.isBlank();
        boolean operacaoValida = "CRIACAO".equals(operacao) || "EDICAO".equals(operacao) || "EXCLUSAO".equals(operacao);
        boolean podeAuditar = usuarioInformado && operacaoValida && sistemaDisponivel;

        if (podeAuditar) {
            System.out.println("Auditoria registrada.");
        } else {
            System.out.println("Auditoria não registrada.");
        }
    }
}
```

---

## Erros comuns

### Erro 1 — Usar `&` no lugar de `&&`

Existe `&`, mas nesta fase use `&&` para lógica booleana com curto-circuito.

### Erro 2 — Usar `|` no lugar de `||`

Existe `|`, mas nesta fase use `||`.

### Erro 3 — Esquecer parênteses

Condições com `&&` e `||` podem ficar ambíguas para humanos.

### Erro 4 — Criar negação confusa

Ruim:

```java
if (!naoAutorizado) {
}
```

Prefira nome positivo:

```java
if (autorizado) {
}
```

### Erro 5 — Condição gigante

Quebre em booleanos nomeados.

### Erro 6 — Ordem errada com null

Errado:

```java
if (!nome.isBlank() && nome != null) {
}
```

Correto:

```java
if (nome != null && !nome.isBlank()) {
}
```

### Erro 7 — Comparar String com `==`

Use `.equals`.

---

## Diagnóstico

Quando uma condição lógica falhar:

```text
1. Quebre a condição em booleanos menores.
2. Imprima cada booleano.
3. Verifique se usou `&&` ou `||` corretamente.
4. Confira parênteses.
5. Confira negações.
6. Confira ordem para evitar null.
7. Confira comparação de String.
```

Exemplo:

```java
System.out.println("clienteInformado: " + clienteInformado);
System.out.println("valorPositivo: " + valorPositivo);
System.out.println("quantidadePositiva: " + quantidadePositiva);
System.out.println("podeProcessar: " + podeProcessar);
```

---

## Debug recomendado

Use debug em:

```text
ValidacaoPedido.java
```

Coloque breakpoints nas linhas:

```java
boolean clienteInformado = ...
boolean valorPositivo = ...
boolean quantidadePositiva = ...
boolean podeProcessar = ...
```

Observe:

```text
valor de cada boolean;
como && combina resultados;
como !bloqueado inverte o valor;
por que o if entra ou não entra.
```

---

## Quebrando de propósito

Faça estes testes:

```text
cliente null;
valor zero;
período inválido;
usuário bloqueado;
parênteses removidos;
String comparada com ==.
```

Explique cada resultado.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-033-operadores-logicos
cd labs\m1\aula-033-operadores-logicos
```

Crie arquivos:

```text
OperadoresLogicosBasico.java
ValidacaoPedido.java
ValidacaoOs.java
ValidacaoPagamento.java
ControleAcesso.java
ValidacaoMensageria.java
ValidacaoAuditoria.java
ErroOrdemNull.java
ErroParenteses.java
ErroNegacaoConfusa.java
ErroStringComIgualIgual.java
README.md
```

Compile:

```powershell
javac OperadoresLogicosBasico.java
javac ValidacaoPedido.java
javac ValidacaoOs.java
javac ValidacaoPagamento.java
javac ControleAcesso.java
javac ValidacaoMensageria.java
javac ValidacaoAuditoria.java
```

Execute:

```powershell
java OperadoresLogicosBasico
java ValidacaoPedido
java ValidacaoOs
java ValidacaoPagamento
java ControleAcesso
java ValidacaoMensageria
java ValidacaoAuditoria
```

---

## README recomendado da aula

```markdown
# Aula 033 — Operadores lógicos

## Objetivo

Aprender a combinar condições com `&&`, `||` e `!`.

## Conceitos

- `&&` exige todas as condições verdadeiras.
- `||` exige pelo menos uma condição verdadeira.
- `!` inverte boolean.
- Java usa curto-circuito.
- Ordem da condição pode evitar NullPointerException.
- Parênteses melhoram clareza.
- Condições grandes devem ser quebradas em booleanos nomeados.

## Comandos

```powershell
javac OperadoresLogicosBasico.java
java OperadoresLogicosBasico
javac ValidacaoPedido.java
java ValidacaoPedido
```
```

---

## Registro no diário de bordo

```markdown
## Aula 033 — Operadores lógicos

### O que aprendi

Aprendi a usar `&&`, `||` e `!` para combinar condições booleanas.

### O que pratiquei

Criei validações de pedido, OS, pagamento, acesso, mensageria e auditoria.

### Conceitos principais

- boolean
- `&&`
- `||`
- `!`
- curto-circuito
- parênteses
- ordem das condições
- NullPointerException
- variáveis booleanas nomeadas

### Erros que quero evitar

- usar `&` no lugar de `&&`;
- usar `|` no lugar de `||`;
- esquecer parênteses;
- criar condição gigante;
- inverter condição com `!` de forma confusa;
- chamar método em String null;
- comparar String com `==`.
```

---

## Commit recomendado

```bash
git status
git add labs/m1/aula-033-operadores-logicos docs/diario-de-bordo.md
git commit -m "Aula 033: pratica operadores logicos"
git status
```

---

## Perguntas de fixação

```text
1. Para que serve `&&`?
2. Para que serve `||`?
3. Para que serve `!`?
4. Quando uma expressão com `&&` retorna true?
5. Quando uma expressão com `||` retorna true?
6. O que é curto-circuito?
7. Por que a ordem das condições importa?
8. Como evitar NullPointerException com String?
9. Por que usar parênteses em condições compostas?
10. Por que condição gigante é ruim?
11. Como variáveis booleanas nomeadas ajudam?
12. Qual diferença entre `bloqueado` e `!bloqueado`?
13. Por que evitar negação dupla?
14. Como validar status AGENDADO ou REAGENDADO?
15. Como validar cliente ativo e pagamento confirmado?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar `&&`;
explicar `||`;
explicar `!`;
criar condições compostas;
usar curto-circuito com segurança;
usar parênteses para clareza;
quebrar condição grande em booleanos menores;
evitar NullPointerException por ordem errada;
aplicar operadores lógicos em pedido;
aplicar operadores lógicos em OS;
aplicar operadores lógicos em pagamento;
aplicar operadores lógicos em acesso;
aplicar operadores lógicos em mensageria;
aplicar operadores lógicos em auditoria;
registrar aula no diário;
fazer commit limpo.
```

---

## Fechamento

Operadores lógicos são a base das validações profissionais.

A ideia central é:

```text
programas reais tomam decisões combinando várias condições.
```

Na próxima aula, estudaremos:

```text
Incremento, decremento e acumuladores.
```
