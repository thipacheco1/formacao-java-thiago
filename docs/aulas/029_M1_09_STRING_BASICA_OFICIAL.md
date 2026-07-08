# 029 — M1.09 — String Básica

## Hoje a aula é sobre tratar texto como dado de verdade

Em backend, texto não é apenas mensagem para imprimir no console.

Texto pode representar:

```text
nome;
e-mail;
CPF;
CNPJ;
CEP;
status;
código externo;
protocolo;
token;
header HTTP;
número de pedido;
número de ordem de serviço;
mensagem de erro;
observação;
payload;
parâmetro de busca;
nome de produto;
categoria textual;
origem de integração.
```

E texto precisa ser tratado com cuidado.

Exemplos de perguntas reais:

```text
o nome foi informado?
o e-mail está vazio?
o campo contém apenas espaços?
o status é igual a ABERTA?
o texto contém determinada palavra?
o código veio com espaços antes ou depois?
a comparação deve ignorar maiúsculas/minúsculas?
quantos caracteres tem o documento?
```

Essas perguntas levam diretamente aos métodos desta aula.

---

## `String` como classe

`String` não é tipo primitivo.

`String` é uma classe.

Por isso escrevemos:

```java
String
```

com `S` maiúsculo.

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";
```

Por ser uma classe, `String` possui métodos.

Método é uma ação que pode ser chamada.

Exemplo:

```java
nomeCliente.length();
```

Isso pergunta para a String:

```text
qual é o seu tamanho?
```

Outro exemplo:

```java
nomeCliente.toUpperCase();
```

Isso gera uma versão em letras maiúsculas.

Nesta aula, vamos focar nos métodos básicos da grade.

---

## Concatenar String

Concatenação é juntar textos.

Em Java, usamos o operador:

```java
+
```

Exemplo:

```java
String nome = "Ana";
String sobrenome = "Silva";

String nomeCompleto = nome + " " + sobrenome;

System.out.println(nomeCompleto);
```

Saída:

```text
Ana Silva
```

O trecho:

```java
" "
```

é uma String contendo um espaço.

Sem ele, a saída seria:

```text
AnaSilva
```

Concatenação é simples, mas precisa de atenção.

---

## Concatenação com valores numéricos

Quando uma `String` participa de uma operação com `+`, o resultado vira texto concatenado.

Exemplo:

```java
String produto = "Mesa";
int quantidade = 2;

System.out.println("Produto: " + produto + ", quantidade: " + quantidade);
```

Saída:

```text
Produto: Mesa, quantidade: 2
```

O `int` foi convertido para texto na hora da concatenação.

Isso é útil para mensagens.

Mas pode gerar armadilhas.

---

## Armadilha: soma virando concatenação

Código:

```java
int valorA = 10;
int valorB = 20;

System.out.println("Resultado: " + valorA + valorB);
```

Saída:

```text
Resultado: 1020
```

Por quê?

Porque a expressão começou com uma `String`:

```java
"Resultado: "
```

Depois disso, o `+` passou a concatenar.

Correção:

```java
System.out.println("Resultado: " + (valorA + valorB));
```

Saída:

```text
Resultado: 30
```

Use parênteses quando quiser fazer cálculo antes de concatenar.

---

## `length()`

`length()` retorna a quantidade de caracteres de uma String.

Exemplo:

```java
String nome = "Ana";

System.out.println(nome.length());
```

Saída:

```text
3
```

Outro exemplo:

```java
String codigo = "OS-1001";

System.out.println(codigo.length());
```

Saída:

```text
7
```

Contagem:

```text
O S - 1 0 0 1
1 2 3 4 5 6 7
```

`length()` é muito usado em validações.

---

## `length()` em validação inicial

Exemplo:

```java
String cpf = "12345678900";

boolean cpfTemTamanhoValido = cpf.length() == 11;

System.out.println("CPF tem tamanho válido: " + cpfTemTamanhoValido);
```

Saída:

```text
CPF tem tamanho válido: true
```

Isso não valida CPF completamente.

Mas valida o tamanho.

Mais tarde, validações reais serão mais completas.

Nesta aula, queremos entender o método.

---

## `isEmpty()`

`isEmpty()` verifica se a String tem tamanho zero.

Exemplo:

```java
String observacao = "";

System.out.println(observacao.isEmpty());
```

Saída:

```text
true
```

Porque:

```java
""
```

não tem nenhum caractere.

Agora:

```java
String observacao = " ";

System.out.println(observacao.isEmpty());
```

Saída:

```text
false
```

Por quê?

Porque `" "` tem um caractere: espaço.

Essa diferença é muito importante.

---

## String vazia versus String com espaço

Compare:

```java
String textoVazio = "";
String textoComEspaco = " ";

System.out.println(textoVazio.isEmpty());
System.out.println(textoComEspaco.isEmpty());
```

Saída:

```text
true
false
```

Explicação:

```text
"" -> tamanho 0;
" " -> tamanho 1.
```

Para o usuário, um campo com espaços pode parecer vazio.

Mas para `isEmpty()`, não é vazio.

Aí entra `isBlank()`.

---

## `isBlank()`

`isBlank()` verifica se a String está vazia ou contém apenas espaços em branco.

Exemplo:

```java
String textoVazio = "";
String textoComEspaco = " ";
String textoComConteudo = "Java";

System.out.println(textoVazio.isBlank());
System.out.println(textoComEspaco.isBlank());
System.out.println(textoComConteudo.isBlank());
```

Saída:

```text
true
true
false
```

`isBlank()` é muito útil para validação de campos digitados pelo usuário.

Exemplo:

```java
String nome = "   ";

boolean nomeNaoInformado = nome.isBlank();

System.out.println(nomeNaoInformado);
```

Saída:

```text
true
```

---

## `isEmpty()` versus `isBlank()`

Diferença:

```text
isEmpty() -> true apenas quando length é 0;
isBlank() -> true quando está vazio ou só tem espaços em branco.
```

Exemplos:

| Texto | `isEmpty()` | `isBlank()` |
|---|---:|---:|
| `""` | `true` | `true` |
| `" "` | `false` | `true` |
| `"   "` | `false` | `true` |
| `"Java"` | `false` | `false` |
| `" Java "` | `false` | `false` |

Em validação de formulário, `isBlank()` costuma ser mais útil.

Porque campo preenchido só com espaço normalmente não deve ser aceito.

---

## `trim()`

`trim()` remove espaços no início e no fim da String.

Exemplo:

```java
String nome = "  Ana  ";

String nomeTratado = nome.trim();

System.out.println("[" + nome + "]");
System.out.println("[" + nomeTratado + "]");
```

Saída:

```text
[  Ana  ]
[Ana]
```

Os colchetes foram colocados apenas para enxergar os espaços.

`trim()` não remove espaços do meio.

Exemplo:

```java
String nomeCompleto = " Ana Silva ";

System.out.println(nomeCompleto.trim());
```

Saída:

```text
Ana Silva
```

O espaço entre `Ana` e `Silva` permanece.

---

## `trim()` retorna uma nova String

Assim como outros métodos de `String`, `trim()` não altera a String original.

Exemplo:

```java
String nome = "  Ana  ";

nome.trim();

System.out.println("[" + nome + "]");
```

Saída:

```text
[  Ana  ]
```

Por quê?

Porque o resultado de `trim()` não foi guardado.

Correto:

```java
String nome = "  Ana  ";

String nomeTratado = nome.trim();

System.out.println("[" + nomeTratado + "]");
```

Saída:

```text
[Ana]
```

Regra:

```text
métodos de String geralmente retornam uma nova String.
```

---

## `equals()`

`equals()` compara o conteúdo de duas Strings.

Exemplo:

```java
String status = "ABERTA";

boolean statusAberto = status.equals("ABERTA");

System.out.println(statusAberto);
```

Saída:

```text
true
```

Esse é o jeito correto de comparar conteúdo textual.

Alerta importante:

```text
não use == como regra geral para comparar String.
```

Use:

```java
equals()
```

---

## Por que não usar `==` com String

`==` compara referência, não o conteúdo textual da forma que queremos trabalhar no dia a dia.

Exemplo perigoso:

```java
String status = "ABERTA";

boolean resultado = status == "ABERTA";
```

Pode até parecer funcionar em alguns casos por causa de otimizações internas do Java, mas não é regra segura para comparação de texto.

Regra prática:

```text
para comparar conteúdo de String, use equals.
```

Exemplo correto:

```java
boolean resultado = status.equals("ABERTA");
```

---

## Comparação segura com constante primeiro

Existe uma prática comum para evitar erro quando a variável pode ser `null`.

Em vez de:

```java
status.equals("ABERTA")
```

pode-se escrever:

```java
"ABERTA".equals(status)
```

Por quê?

Se `status` for `null`, isso aqui quebra:

```java
status.equals("ABERTA")
```

Mas isso não quebra:

```java
"ABERTA".equals(status)
```

Nesta aula, ainda não vamos aprofundar `null`.

Mas é bom conhecer esse padrão.

Exemplo:

```java
String status = "ABERTA";

boolean statusAberto = "ABERTA".equals(status);
```

---

## `equalsIgnoreCase()`

`equalsIgnoreCase()` compara texto ignorando maiúsculas e minúsculas.

Exemplo:

```java
String statusInformado = "aberta";

boolean statusAberto = statusInformado.equalsIgnoreCase("ABERTA");

System.out.println(statusAberto);
```

Saída:

```text
true
```

Isso é útil quando a entrada pode vir em formatos diferentes:

```text
ABERTA;
aberta;
Aberta;
aBeRtA.
```

Mas cuidado.

Ignorar maiúsculas/minúsculas é decisão de regra.

Nem todo código textual deve ignorar caixa.

---

## Quando usar `equalsIgnoreCase()`

Use quando o domínio permitir variação de maiúsculas/minúsculas.

Exemplos:

```text
status digitado pelo usuário;
comando textual simples;
sigla informada manualmente;
busca textual simples;
resposta sim/não em texto.
```

Exemplo:

```java
String resposta = "sim";

boolean confirmou = resposta.equalsIgnoreCase("SIM");
```

Saída:

```text
true
```

Mas para tokens, senhas e códigos sensíveis, geralmente a comparação deve ser exata.

---

## `contains()`

`contains()` verifica se uma String contém outra sequência de texto.

Exemplo:

```java
String mensagem = "Erro ao processar pedido";

boolean contemErro = mensagem.contains("Erro");

System.out.println(contemErro);
```

Saída:

```text
true
```

Outro exemplo:

```java
String email = "cliente@exemplo.com";

boolean emailPossuiArroba = email.contains("@");

System.out.println(emailPossuiArroba);
```

Saída:

```text
true
```

`contains()` é útil para verificações simples.

Mas não substitui validações completas.

---

## `contains()` diferencia maiúsculas e minúsculas

Exemplo:

```java
String mensagem = "Erro ao processar pedido";

System.out.println(mensagem.contains("Erro"));
System.out.println(mensagem.contains("erro"));
```

Saída:

```text
true
false
```

Porque:

```text
Erro
```

é diferente de:

```text
erro
```

Se quiser ignorar caixa, uma estratégia simples é padronizar antes:

```java
String mensagem = "Erro ao processar pedido";

boolean contemErro = mensagem.toLowerCase().contains("erro");

System.out.println(contemErro);
```

Saída:

```text
true
```

---

## `contains()` não valida e-mail de verdade

Exemplo:

```java
String email = "cliente@exemplo.com";

boolean possuiArroba = email.contains("@");
```

Isso só verifica se tem `@`.

Não garante que o e-mail é válido.

Exemplos ruins que contêm `@`:

```text
@
cliente@
@exemplo.com
cliente@@exemplo.com
```

Então:

```text
contains é verificação simples;
validação real pode exigir regra maior.
```

Nesta fase, isso é suficiente.

---

## Encadeamento de métodos

Podemos chamar métodos em sequência.

Exemplo:

```java
String statusInformado = " aberta ";

boolean statusAberto = statusInformado.trim().equalsIgnoreCase("ABERTA");

System.out.println(statusAberto);
```

Passos:

```text
" aberta " -> trim() -> "aberta"
"aberta" -> equalsIgnoreCase("ABERTA") -> true
```

Isso é muito comum.

Mas cuidado com cadeias longas demais.

Se ficar difícil de ler, crie variáveis intermediárias.

---

## Variáveis intermediárias melhoram leitura

Em vez de:

```java
boolean statusAberto = statusInformado.trim().equalsIgnoreCase("ABERTA");
```

podemos escrever:

```java
String statusTratado = statusInformado.trim();
boolean statusAberto = statusTratado.equalsIgnoreCase("ABERTA");
```

Isso é mais claro para iniciantes.

Em código profissional, depende do contexto.

Regra:

```text
clareza vale mais que compactar tudo em uma linha.
```

---

## Exemplo mínimo com métodos principais

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        String nome = "  Cliente Exemplo  ";

        String nomeTratado = nome.trim();

        System.out.println("Original: [" + nome + "]");
        System.out.println("Tratado: [" + nomeTratado + "]");
        System.out.println("Tamanho original: " + nome.length());
        System.out.println("Tamanho tratado: " + nomeTratado.length());
        System.out.println("Está vazio: " + nomeTratado.isEmpty());
        System.out.println("Está em branco: " + nomeTratado.isBlank());
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

Observe a diferença entre original e tratado.

---

## Exemplo mínimo com comparação

Código:

```java
public class Main {
    public static void main(String[] args) {
        String status = "aberta";

        boolean igualExato = status.equals("ABERTA");
        boolean igualIgnorandoCaixa = status.equalsIgnoreCase("ABERTA");

        System.out.println("Igual exato: " + igualExato);
        System.out.println("Igual ignorando caixa: " + igualIgnorandoCaixa);
    }
}
```

Saída:

```text
Igual exato: false
Igual ignorando caixa: true
```

Esse exemplo mostra a diferença entre comparação exata e comparação ignorando caixa.

---

## Exemplo aplicado ao domínio corporativo: cliente

Arquivo:

```text
ClienteStringBasica.java
```

Código:

```java
public class ClienteStringBasica {
    public static void main(String[] args) {
        String nomeCliente = "  Cliente Exemplo  ";
        String emailCliente = "cliente@exemplo.com";

        String nomeTratado = nomeCliente.trim();
        boolean nomeInformado = !nomeTratado.isBlank();
        boolean emailPossuiArroba = emailCliente.contains("@");

        System.out.println("Nome original: [" + nomeCliente + "]");
        System.out.println("Nome tratado: [" + nomeTratado + "]");
        System.out.println("Nome informado: " + nomeInformado);
        System.out.println("Email possui @: " + emailPossuiArroba);
    }
}
```

Aqui aplicamos:

```text
trim;
isBlank;
contains;
concatenação.
```

Isso parece simples, mas já é base de validação.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
PedidoStringBasica.java
```

Código:

```java
public class PedidoStringBasica {
    public static void main(String[] args) {
        String codigoPedido = " PED-2026-001 ";
        String statusPedido = "pendente";

        String codigoTratado = codigoPedido.trim();
        boolean codigoInformado = !codigoTratado.isBlank();
        boolean pedidoPendente = statusPedido.equalsIgnoreCase("PENDENTE");

        System.out.println("Código tratado: " + codigoTratado);
        System.out.println("Código informado: " + codigoInformado);
        System.out.println("Pedido pendente: " + pedidoPendente);
    }
}
```

Regra:

```text
código informado não pode estar em branco;
status pendente deve ser reconhecido mesmo em minúsculas.
```

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
OrdemServicoStringBasica.java
```

Código:

```java
public class OrdemServicoStringBasica {
    public static void main(String[] args) {
        String numeroOrdemServico = " OS-1001 ";
        String statusOrdemServico = "ABERTA";
        String observacao = "Cliente solicitou reagendamento";

        String numeroTratado = numeroOrdemServico.trim();
        boolean numeroValido = !numeroTratado.isBlank();
        boolean ordemAberta = "ABERTA".equals(statusOrdemServico);
        boolean observacaoCitaReagendamento = observacao.toLowerCase().contains("reagendamento");

        System.out.println("Número tratado: " + numeroTratado);
        System.out.println("Número válido: " + numeroValido);
        System.out.println("Ordem aberta: " + ordemAberta);
        System.out.println("Observação cita reagendamento: " + observacaoCitaReagendamento);
    }
}
```

Aqui usamos:

```text
trim;
isBlank;
equals;
contains;
toLowerCase.
```

Mesmo sendo básico, isso já parece uma validação de domínio.

---

## Exemplo aplicado ao domínio corporativo: produto

Arquivo:

```text
ProdutoStringBasica.java
```

Código:

```java
public class ProdutoStringBasica {
    public static void main(String[] args) {
        String codigoProduto = " 000123 ";
        String descricaoProduto = "Mesa de jantar";

        String codigoTratado = codigoProduto.trim();

        boolean codigoTemSeisCaracteres = codigoTratado.length() == 6;
        boolean descricaoContemMesa = descricaoProduto.toLowerCase().contains("mesa");

        System.out.println("Código tratado: " + codigoTratado);
        System.out.println("Código tem seis caracteres: " + codigoTemSeisCaracteres);
        System.out.println("Descrição contém mesa: " + descricaoContemMesa);
    }
}
```

Observe que `codigoProduto` é `String`.

Por quê?

Porque:

```text
tem zeros à esquerda;
representa identificador;
não será usado em cálculo.
```

---

## Exemplo aplicado ao domínio corporativo: mensagem

Arquivo:

```text
MensagemStringBasica.java
```

Código:

```java
public class MensagemStringBasica {
    public static void main(String[] args) {
        String mensagem = "Erro ao enviar notificação para o cliente";

        boolean contemErro = mensagem.contains("Erro");
        boolean contemCliente = mensagem.toLowerCase().contains("cliente");
        int tamanhoMensagem = mensagem.length();

        System.out.println("Mensagem: " + mensagem);
        System.out.println("Contém Erro: " + contemErro);
        System.out.println("Contém cliente: " + contemCliente);
        System.out.println("Tamanho da mensagem: " + tamanhoMensagem);
    }
}
```

Esse exemplo prepara leitura de logs, mensagens e respostas textuais.

---

## Exemplo aplicado ao domínio corporativo: auditoria

Arquivo:

```text
AuditoriaStringBasica.java
```

Código:

```java
public class AuditoriaStringBasica {
    public static void main(String[] args) {
        String usuario = " usuario.exemplo ";
        String evento = "ALTERACAO_STATUS";
        String origem = "sistema";

        String usuarioTratado = usuario.trim();
        boolean usuarioInformado = !usuarioTratado.isBlank();
        boolean eventoAlteracaoStatus = "ALTERACAO_STATUS".equals(evento);
        boolean origemSistema = origem.equalsIgnoreCase("SISTEMA");

        System.out.println("Usuário tratado: " + usuarioTratado);
        System.out.println("Usuário informado: " + usuarioInformado);
        System.out.println("Evento alteração status: " + eventoAlteracaoStatus);
        System.out.println("Origem sistema: " + origemSistema);
    }
}
```

Esse exemplo combina métodos em uma regra de auditoria simples.

---

## Erros comuns

### Erro 1 — Usar `==` para comparar String

Evite:

```java
String status = "ABERTA";

boolean aberto = status == "ABERTA";
```

Prefira:

```java
boolean aberto = "ABERTA".equals(status);
```

---

### Erro 2 — Esquecer que `equals` diferencia maiúsculas e minúsculas

Código:

```java
String status = "aberta";

boolean aberto = status.equals("ABERTA");
```

Resultado:

```text
false
```

Se a regra permitir, use:

```java
boolean aberto = status.equalsIgnoreCase("ABERTA");
```

---

### Erro 3 — Usar `isEmpty()` quando deveria usar `isBlank()`

Código:

```java
String nome = "   ";

boolean vazio = nome.isEmpty();
```

Resultado:

```text
false
```

Se campo só com espaços deve ser considerado inválido, use:

```java
boolean vazioOuEmBranco = nome.isBlank();
```

---

### Erro 4 — Chamar `trim()` sem guardar o resultado

Errado:

```java
String nome = " Ana ";
nome.trim();

System.out.println(nome);
```

Saída:

```text
 Ana 
```

Certo:

```java
String nomeTratado = nome.trim();
```

---

### Erro 5 — Achar que `contains()` ignora maiúsculas/minúsculas

Código:

```java
String mensagem = "Erro ao processar pedido";

System.out.println(mensagem.contains("erro"));
```

Resultado:

```text
false
```

Correção possível:

```java
boolean contemErro = mensagem.toLowerCase().contains("erro");
```

---

### Erro 6 — Validar e-mail apenas com `contains("@")`

Isso é validação fraca.

```java
boolean possuiArroba = email.contains("@");
```

Pode ser útil como verificação inicial, mas não garante e-mail válido.

---

### Erro 7 — Esquecer espaço na concatenação

Ruim:

```java
String nomeCompleto = nome + sobrenome;
```

Melhor:

```java
String nomeCompleto = nome + " " + sobrenome;
```

---

### Erro 8 — Soma virar texto na concatenação

Ruim:

```java
System.out.println("Total: " + valorA + valorB);
```

Melhor:

```java
System.out.println("Total: " + (valorA + valorB));
```

---

### Erro 9 — Chamar método em String `null`

Exemplo perigoso:

```java
String nome = null;

System.out.println(nome.length());
```

Isso gera erro em execução.

`null` será estudado com mais profundidade depois.

Por enquanto, saiba:

```text
não chame método em variável que pode estar null sem tratamento.
```

---

### Erro 10 — Encadear métodos demais e perder leitura

Ruim para iniciante:

```java
boolean valido = entrada.trim().toLowerCase().contains("abc") && !entrada.trim().isBlank();
```

Melhor:

```java
String entradaTratada = entrada.trim();
boolean entradaInformada = !entradaTratada.isBlank();
boolean contemAbc = entradaTratada.toLowerCase().contains("abc");

boolean valido = entradaInformada && contemAbc;
```

Clareza primeiro.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-029-string-basica
cd labs\m1\aula-029-string-basica
```

Crie arquivos:

```text
Main.java
ComparacaoString.java
ValidacaoTexto.java
ClienteStringBasica.java
PedidoStringBasica.java
OrdemServicoStringBasica.java
ProdutoStringBasica.java
MensagemStringBasica.java
AuditoriaStringBasica.java
```

Compile:

```powershell
javac Main.java
javac ComparacaoString.java
javac ValidacaoTexto.java
javac ClienteStringBasica.java
javac PedidoStringBasica.java
javac OrdemServicoStringBasica.java
javac ProdutoStringBasica.java
javac MensagemStringBasica.java
javac AuditoriaStringBasica.java
```

Execute:

```powershell
java Main
java ComparacaoString
java ValidacaoTexto
java ClienteStringBasica
java PedidoStringBasica
java OrdemServicoStringBasica
java ProdutoStringBasica
java MensagemStringBasica
java AuditoriaStringBasica
```

Depois quebre os erros de propósito e registre no diário.

---

## Arquivo sugerido: `ComparacaoString.java`

```java
public class ComparacaoString {
    public static void main(String[] args) {
        String statusInformado = "aberta";

        boolean comparacaoExata = statusInformado.equals("ABERTA");
        boolean comparacaoIgnorandoCaixa = statusInformado.equalsIgnoreCase("ABERTA");

        System.out.println("Comparação exata: " + comparacaoExata);
        System.out.println("Comparação ignorando caixa: " + comparacaoIgnorandoCaixa);
    }
}
```

---

## Arquivo sugerido: `ValidacaoTexto.java`

```java
public class ValidacaoTexto {
    public static void main(String[] args) {
        String nome = "   ";
        String email = "cliente@exemplo.com";

        boolean nomeVazio = nome.isEmpty();
        boolean nomeEmBranco = nome.isBlank();
        boolean emailPossuiArroba = email.contains("@");

        System.out.println("Nome vazio: " + nomeVazio);
        System.out.println("Nome em branco: " + nomeEmBranco);
        System.out.println("Email possui arroba: " + emailPossuiArroba);
    }
}
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
git add labs/m1/aula-029-string-basica docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 029: pratica String basica em Java"
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
concatenar Strings;
concatenar String com número;
usar parênteses para evitar concatenação incorreta;
usar length();
usar isEmpty();
usar isBlank();
explicar diferença entre isEmpty e isBlank;
usar trim();
guardar retorno de trim();
usar equals();
explicar por que não usar == para String como regra geral;
usar equalsIgnoreCase();
usar contains();
explicar que contains diferencia maiúsculas/minúsculas;
usar toLowerCase com contains em exemplo simples;
usar variáveis intermediárias para clareza;
validar texto vazio;
validar texto em branco;
validar tamanho simples;
aplicar String em cliente;
aplicar String em pedido;
aplicar String em OS;
aplicar String em produto;
aplicar String em auditoria;
diagnosticar erros comuns;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar regex.

Não precisa ainda validar e-mail de forma completa.

Não precisa ainda dominar `StringBuilder`.

Não precisa ainda dominar `null` em profundidade.

Não precisa ainda dominar encoding ou Unicode.

Esses assuntos virão depois.

O objetivo é dominar o uso básico e seguro de `String`.

---

## Fechamento da aula

Hoje aprofundamos `String`.

Agora já sabemos que texto em Java não é apenas algo para imprimir.

Texto pode ser tratado, comparado, validado e padronizado.

Vimos que:

```text
length mede tamanho;
isEmpty detecta texto vazio;
isBlank detecta vazio ou só espaços;
trim remove espaços nas pontas;
equals compara conteúdo;
equalsIgnoreCase compara ignorando maiúsculas/minúsculas;
contains verifica presença de trecho;
concatenação precisa de cuidado.
```

Também vimos que comparar `String` com `==` é uma armadilha clássica.

No backend, texto aparece em todo lugar:

```text
requisição;
resposta;
status;
código;
mensagem;
documento;
e-mail;
token;
header;
payload.
```

Tratar texto corretamente é base para APIs, validações e regras de negócio.

Na próxima aula, vamos estudar entrada de dados com `Scanner`.

Isso permitirá digitar valores no console e transformar exemplos fixos em pequenos programas interativos.
