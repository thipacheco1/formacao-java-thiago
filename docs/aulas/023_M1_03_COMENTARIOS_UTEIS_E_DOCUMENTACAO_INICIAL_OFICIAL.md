# 023 — M1.03 — Comentários Úteis e Documentação Inicial

## Hoje a aula é sobre escrever código para humanos também

O compilador não precisa de comentário.

A JVM não executa comentário.

O Java ignora comentário.

Então por que comentários existem?

Porque código é lido por pessoas.

Pessoas como:

```text
você no futuro;
outro desenvolvedor;
revisor de pull request;
QA técnico;
analista de suporte;
arquiteto;
líder técnico;
pessoa em onboarding;
você mesmo investigando um bug às 18h.
```

Código precisa funcionar.

Mas também precisa ser compreensível.

Comentário é uma ferramenta para ajudar compreensão.

Mas ferramenta mal usada atrapalha.

---

## Comentário não é desculpa para código confuso

Compare.

Código ruim com comentário:

```java
// x recebe 10
int x = 10;
```

Esse comentário não ajuda.

Ele só repete o código.

Agora veja:

```java
int limiteTentativasLogin = 3;
```

Nem precisa de comentário.

O nome explica.

Agora um comentário útil:

```java
// Regra temporária: o cliente pode tentar login no máximo 3 vezes antes do bloqueio.
int limiteTentativasLogin = 3;
```

Esse comentário agrega contexto.

Ele explica a regra, não a sintaxe.

Regra importante:

```text
se o comentário apenas repete o código, provavelmente o nome do código está ruim ou o comentário é inútil.
```

---

## Tipos de comentário em Java

Java tem três formas principais de comentário:

```text
comentário de linha;
comentário de bloco;
comentário de documentação.
```

Exemplos:

```java
// comentário de linha
```

```java
/*
 comentário de bloco
*/
```

```java
/**
 * comentário de documentação
 */
```

Nesta aula, vamos focar nos dois primeiros e introduzir o terceiro.

Javadoc será aprofundado depois, quando fizer mais sentido documentar classes, métodos e APIs internas.

---

## Comentário de linha

Comentário de linha começa com:

```java
//
```

Tudo depois de `//` naquela linha é ignorado pelo Java.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        // Imprime mensagem inicial no console
        System.out.println("Iniciando aplicação");
    }
}
```

O Java executa:

```java
System.out.println("Iniciando aplicação");
```

Mas ignora:

```java
// Imprime mensagem inicial no console
```

Comentário de linha é útil para observações curtas.

---

## Comentário de linha no final da linha

Também é possível comentar no final da linha:

```java
System.out.println("Status: ABERTA"); // saída temporária para validação
```

Use com moderação.

Comentários no final da linha podem poluir o código se forem longos.

Prefira comentário acima da linha quando a explicação for maior.

---

## Comentário de bloco

Comentário de bloco começa com:

```java
/*
```

e termina com:

```java
*/
```

Exemplo:

```java
/*
 Este programa imprime uma mensagem simples.
 Ele será usado apenas para entender comentários.
*/
public class Main {
    public static void main(String[] args) {
        System.out.println("Comentários em Java");
    }
}
```

Tudo dentro do bloco é ignorado pelo compilador.

Comentário de bloco é útil para explicações maiores.

Mas cuidado:

```text
comentário de bloco grande demais pode esconder código ruim ou documentação no lugar errado.
```

---

## Comentário de documentação

Comentário de documentação começa com:

```java
/**
```

e termina com:

```java
*/
```

Exemplo:

```java
/**
 * Classe inicial para demonstrar comentários em Java.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("Documentação inicial");
    }
}
```

Esse formato é usado pelo Javadoc.

Javadoc permite gerar documentação técnica a partir do código.

Nesta aula, o objetivo é apenas reconhecer.

Mais tarde vamos aprofundar:

```text
documentação de classes;
documentação de métodos;
@param;
@return;
@throws;
documentação útil em APIs internas.
```

Por enquanto, entenda:

```text
/** ... */ é comentário de documentação.
```

---

## Comentário não muda execução

Veja:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Linha 1");
        // System.out.println("Linha 2");
        System.out.println("Linha 3");
    }
}
```

Saída:

```text
Linha 1
Linha 3
```

A linha comentada não executa.

Isso é útil para aprender.

Mas em código profissional, comentar código para “guardar” versão antiga geralmente é ruim.

Git já guarda histórico.

Não use comentário como cemitério de código antigo.

---

## Código comentado não é documentação

Exemplo ruim:

```java
// System.out.println("Fluxo antigo");
// System.out.println("Validacao antiga");
// System.out.println("Regra antiga");
System.out.println("Fluxo novo");
```

Isso deixa o arquivo sujo.

Perguntas que surgem:

```text
isso ainda é necessário?
pode apagar?
por que ficou aqui?
quem comentou?
quando?
qual regra vale?
```

Se o código antigo não é mais usado, remova.

O Git guarda o histórico.

Comentário deve explicar intenção.

Não deve virar depósito de código morto.

---

## Quando comentar

Comente quando o código sozinho não explica bem o motivo.

Comentários bons geralmente explicam:

```text
por que uma regra existe;
qual exceção de negócio está sendo tratada;
qual limitação técnica existe;
qual decisão temporária foi tomada;
qual cuidado precisa ser mantido;
qual contrato externo exige aquele formato;
qual comportamento estranho é intencional.
```

Exemplo útil:

```java
// Regra de negócio: pedidos cancelados não podem voltar para processamento automaticamente.
System.out.println("Pedido cancelado exige análise manual");
```

O comentário explica a regra.

Não explica apenas o comando.

---

## Quando não comentar

Não comente o óbvio.

Exemplo ruim:

```java
// imprime o texto
System.out.println("Olá");
```

O próprio código já mostra que imprime texto.

Outro exemplo ruim:

```java
// classe Main
public class Main {
}
```

Isso não agrega.

Se o comentário só repete a sintaxe, remova.

Se o código está confuso, prefira melhorar nomes.

---

## Comentário versus nome melhor

Compare:

```java
// quantidade de pedidos em aberto
int x = 10;
```

Melhor:

```java
int quantidadePedidosEmAberto = 10;
```

O nome eliminou a necessidade do comentário.

Outro exemplo:

```java
// verifica se o cliente está ativo
boolean c = true;
```

Melhor:

```java
boolean clienteAtivo = true;
```

Nome bom é documentação viva.

Comentário pode ficar desatualizado.

Nome faz parte do código.

---

## Comentário pode mentir

Comentário ruim:

```java
// Cliente inativo
boolean clienteAtivo = true;
```

O comentário diz uma coisa.

O código diz outra.

Qual está certo?

Esse é o problema.

Comentário pode envelhecer.

A pessoa altera o código e esquece de atualizar o comentário.

Por isso, comentário deve ser usado com critério.

Código claro reduz esse risco.

---

## Comentário deve explicar intenção, não repetir implementação

Exemplo ruim:

```java
// Imprime Status: ABERTA
System.out.println("Status: ABERTA");
```

Exemplo melhor:

```java
// Saída temporária para validar o fluxo inicial antes de criar variáveis.
System.out.println("Status: ABERTA");
```

O segundo explica por que essa linha existe neste momento da formação.

Outro exemplo:

```java
// Regra do domínio: OS aberta ainda permite inclusão de atividade.
System.out.println("Permite nova atividade");
```

Agora o comentário fala de regra.

Isso é útil.

---

## Comentário de estudo versus comentário profissional

Durante estudo, alguns comentários são aceitáveis para fixar conceito.

Exemplo didático:

```java
// Método main: ponto de entrada do programa
public static void main(String[] args) {
}
```

Em uma aula inicial, isso ajuda.

Em código profissional, esse comentário provavelmente seria desnecessário.

Então existe diferença entre:

```text
comentário para aprender;
comentário para manter código em produção.
```

Na formação, podemos usar comentários didáticos.

Mas precisamos saber que eles serão reduzidos com o tempo.

---

## Comentário temporário precisa ser tratado com cuidado

Às vezes usamos comentário temporário:

```java
// TODO: substituir saída no console por log estruturado.
System.out.println("Pedido processado");
```

`TODO` indica algo pendente.

Mas cuidado:

```text
TODO eterno vira sujeira;
TODO sem contexto não ajuda;
TODO sem issue/tarefa pode ser esquecido.
```

Melhor:

```java
// TODO: substituir por log estruturado quando o módulo de logging for introduzido.
System.out.println("Pedido processado");
```

Esse TODO tem contexto.

---

## Não coloque segredo em comentário

Nunca escreva:

```java
// senha do banco: 123456
// token: eyJ...
// chave da API: abc...
```

Isso é grave.

Comentário vai para o Git.

Git guarda histórico.

Mesmo apagando depois, o segredo pode continuar no histórico.

Regra:

```text
senha, token, chave, credencial e dado sensível nunca entram em comentário.
```

Use placeholders:

```java
// Usar variável de ambiente para configurar a senha do banco.
```

Sem revelar valor real.

---

## Comentário e dados reais

Também evite dados reais.

Ruim:

```java
// Cliente real: João Silva, CPF 123...
```

Use exemplo fictício:

```java
// Cliente fictício usado apenas para exemplo.
```

Em formação e documentação, sempre use dados fictícios.

Nunca use dado sensível de cliente, empresa, produção ou ambiente real.

---

## Documentação inicial fora do código

Nem tudo deve virar comentário no código.

Algumas coisas pertencem ao README ou à pasta `docs`.

Exemplo:

```text
como executar o projeto;
como configurar ambiente;
quais comandos usar;
qual objetivo da aula;
quais decisões foram tomadas;
quais erros foram encontrados.
```

Isso deve ficar em:

```text
README.md;
docs/ambiente.md;
docs/diario-de-bordo.md;
docs/checklist-ambiente.md;
docs/*.md.
```

Comentário no código explica detalhes próximos ao código.

Documentação em Markdown explica contexto mais amplo.

---

## Código, comentário e documentação

Pense em três camadas:

```text
código -> diz o que o programa faz;
comentário -> explica intenção local quando necessário;
documentação -> explica contexto, uso, setup e decisões.
```

Exemplo:

```java
System.out.println("Pedido aprovado");
```

Comentário local:

```java
// Regra didática: pedido aprovado representa fluxo feliz nesta aula.
System.out.println("Pedido aprovado");
```

Documentação em `README.md`:

```markdown
## Exemplo mínimo: comentário de linha

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        // Mensagem inicial do programa
        System.out.println("Comentários úteis em Java");
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
Comentários úteis em Java
```

O comentário não apareceu na saída.

Ele apenas ajudou a pessoa lendo o código.

---

## Exemplo mínimo: comentário de bloco

Código:

```java
/*
 Este programa demonstra comentário de bloco.
 O comentário não é executado pela JVM.
*/
public class Main {
    public static void main(String[] args) {
        System.out.println("Comentário de bloco");
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
Comentário de bloco
```

O bloco de comentário foi ignorado.

---

## Exemplo mínimo: linha comentada não executa

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Linha 1");
        // System.out.println("Linha 2");
        System.out.println("Linha 3");
    }
}
```

Saída:

```text
Linha 1
Linha 3
```

Esse exemplo prova que comentário muda o que executa quando usado para desativar uma linha.

Mas use isso como estudo, não como prática permanente de código morto.

---

## Exemplo com documentação inicial da classe

Código:

```java
/**
 * Programa simples para demonstrar comentários em Java.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("Documentação inicial");
    }
}
```

Esse comentário documenta a classe.

Ainda não vamos gerar Javadoc.

Mas já reconhecemos o formato.

---

## Exemplo ruim: comentário óbvio

Código:

```java
public class Main {
    public static void main(String[] args) {
        // imprime Olá
        System.out.println("Olá");
    }
}
```

Esse comentário é fraco.

Melhor sem comentário:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Nem todo código precisa de comentário.

---

## Exemplo bom: comentário com intenção

Código:

```java
public class Main {
    public static void main(String[] args) {
        // Saída temporária usada enquanto ainda não estudamos variáveis.
        System.out.println("Status do pedido: PENDENTE");
    }
}
```

Esse comentário explica o motivo da saída simples.

Ele não apenas repete que imprime.

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
ComentarioOrdemServico.java
```

Código:

```java
public class ComentarioOrdemServico {
    public static void main(String[] args) {
        // Regra didática: OS aberta representa uma ordem que ainda pode receber atividade.
        System.out.println("OS: 1001");
        System.out.println("Status: ABERTA");
        System.out.println("Pode receber nova atividade: SIM");
    }
}
```

Compile:

```powershell
javac ComentarioOrdemServico.java
```

Execute:

```powershell
java ComentarioOrdemServico
```

Saída:

```text
OS: 1001
Status: ABERTA
Pode receber nova atividade: SIM
```

Comentário útil:

```text
explica a regra de domínio usada no exemplo.
```

Ele não fica repetindo cada `println`.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
ComentarioPedido.java
```

Código:

```java
public class ComentarioPedido {
    public static void main(String[] args) {
        /*
         Fluxo didático:
         neste momento da formação, o pedido ainda é representado apenas por textos fixos.
         Variáveis serão introduzidas nas próximas aulas.
        */
        System.out.println("Pedido: PED-001");
        System.out.println("Status: PENDENTE");
        System.out.println("Pagamento: AGUARDANDO");
    }
}
```

Esse comentário de bloco é aceitável como explicação didática.

Mas em código profissional, provavelmente isso iria para documentação ou teste.

Use este exemplo para entender o recurso.

---

## Exemplo aplicado ao domínio corporativo: auditoria

Arquivo:

```text
ComentarioAuditoria.java
```

Código:

```java
public class ComentarioAuditoria {
    public static void main(String[] args) {
        // Regra de auditoria: toda alteração relevante precisa indicar o usuário responsável.
        System.out.println("Evento: ALTERACAO_STATUS");
        System.out.println("Usuario: usuario.exemplo");
        System.out.println("Origem: SISTEMA");
    }
}
```

Esse comentário explica uma intenção de negócio.

Isso é melhor do que:

```java
// imprime evento
```

A diferença é clara:

```text
comentário bom explica por que aquela informação importa.
```

---

## Comentário e nome profissional

Compare.

Ruim:

```java
// status da ordem de serviço
System.out.println("ABERTA");
```

Melhor neste momento:

```java
System.out.println("Status da ordem de serviço: ABERTA");
```

Mais tarde, com variável:

```java
String statusOrdemServico = "ABERTA";
```

O nome reduz necessidade de comentário.

Essa aula já prepara a próxima, onde nomes profissionais entram com mais força.

---

## Introdução à documentação no README

Para cada laboratório, um README pequeno ajuda.

Exemplo para a pasta da aula:

```markdown
# Aula 023 — Comentários úteis

## Arquivos

- `Main.java`
- `ComentarioOrdemServico.java`
- `ComentarioPedido.java`
- `ComentarioAuditoria.java`

## Cuidados

- Não comentar o óbvio.
- Não deixar código morto comentado.
- Não colocar senha ou token em comentário.
- Preferir nomes claros quando possível.
```

Isso é documentação inicial.

Não precisa ser complexo.

Precisa ser útil.

---

## Usando o atalho de comentário

No IntelliJ, selecione uma linha:

```java
System.out.println("Teste");
```

Use:

```text
Ctrl + /
```

Resultado:

```java
// System.out.println("Teste");
```

Use novamente:

```java
System.out.println("Teste");
```

Isso é útil durante estudo e diagnóstico.

Mas lembre:

```text
não deixe código comentado sem motivo no commit.
```

Antes de commitar, limpe.

---

## Quando usar comentário para diagnóstico

Durante estudo, pode ser aceitável comentar uma linha para comparar comportamento.

Exemplo:

```java
System.out.println("Linha 1");
// System.out.println("Linha 2");
System.out.println("Linha 3");
```

Mas antes do commit final, pergunte:

```text
essa linha comentada precisa continuar?
ela ensina algo?
está documentada como parte da aula?
ou é resto de teste?
```

Se for resto de teste, remova.

Se for parte do exercício, mantenha com contexto.

---

## Comentários em excesso atrapalham leitura

Exemplo exagerado:

```java
public class Main { // cria classe Main
    public static void main(String[] args) { // cria método main
        // chama System
        // acessa out
        // chama println
        // passa texto
        System.out.println("Olá"); // imprime Olá
    } // fecha main
} // fecha classe
```

Para estudo inicial, alguns comentários podem ajudar.

Mas esse nível em código real é poluição.

Melhor:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Código simples não precisa de comentário excessivo.

---

## Comentários de regra de negócio

Comentários são mais úteis quando preservam contexto de negócio.

Exemplo:

```java
// Regra: pedidos com pagamento pendente não podem ser enviados para expedição.
System.out.println("Pedido bloqueado para expedição");
```

Outro exemplo:

```java
// Regra: OS cancelada pelo cliente não deve gerar nova tentativa automática.
System.out.println("Reagendamento automático bloqueado");
```

Esses comentários não explicam Java.

Eles explicam domínio.

Isso é valioso.

---

## Comentários de decisão técnica

Também podem explicar decisão técnica.

Exemplo:

```java
// Saída no console usada apenas nesta fase inicial antes da introdução de logging.
System.out.println("Processamento iniciado");
```

Isso explica uma limitação temporária da formação.

Em projeto real:

```java
// Mantido por compatibilidade com contrato legado da integração.
System.out.println("Formato legado");
```

Esse tipo de comentário pode ser útil se a razão não estiver óbvia no código.

---

## Comentários e documentação de erro conhecido

Exemplo aceitável:

```java
// TODO: quando estudarmos tratamento de exceções, substituir por fluxo de erro controlado.
System.out.println("Erro ao processar pedido");
```

Esse comentário reconhece uma limitação didática.

Mas precisa ser removido ou resolvido quando o conteúdo avançar.

Comentários de pendência devem ter vida curta ou referência clara.

---

## Comentário de bloco não pode ser aninhado do jeito comum

Java não aceita comentário de bloco aninhado diretamente.

Exemplo problemático:

```java
/*
 Comentário externo
 /*
  Comentário interno
 */
*/
```

Isso causa confusão, porque o primeiro `*/` fecha o comentário.

Regra:

```text
não aninhe comentários de bloco.
```

Se precisar comentar trecho grande que já tem blocos, prefira usar a IDE com comentário de linha em cada linha, ou remova o trecho.

---

## Erros comuns

### Erro 1 — Comentário óbvio

Ruim:

```java
// imprime mensagem
System.out.println("Mensagem");
```

Correção:

```text
remover comentário ou explicar intenção real.
```

---

### Erro 2 — Comentário desatualizado

Ruim:

```java
// Status pendente
System.out.println("Status: APROVADO");
```

Correção:

```text
atualizar ou remover comentário.
```

---

### Erro 3 — Código morto comentado

Ruim:

```java
// System.out.println("Fluxo antigo");
System.out.println("Fluxo novo");
```

Correção:

```text
remover código antigo;
usar Git para histórico.
```

---

### Erro 4 — Segredo em comentário

Gravíssimo:

```java
// senha: 123456
```

Correção:

```text
remover imediatamente;
se foi commitado, tratar como vazamento;
trocar credencial.
```

---

### Erro 5 — Comentário tentando salvar nome ruim

Ruim:

```java
// quantidade de pedidos em aberto
int x = 10;
```

Melhor:

```java
int quantidadePedidosEmAberto = 10;
```

Nomes serão aprofundados na próxima aula.

---

### Erro 6 — Comentário de bloco sem fechamento

Errado:

```java
/*
 Comentário aberto
public class Main {
}
```

O compilador pode acusar erro porque o comentário nunca fechou.

Correção:

```java
/*
 Comentário fechado
*/
public class Main {
}
```

---

### Erro 7 — Fechar comentário de bloco sem abrir

Errado:

```java
*/
public class Main {
}
```

Correção:

```text
remover fechamento solto ou abrir corretamente.
```

---

### Erro 8 — Achar que comentário executa

Comentário não executa.

Se você comentou uma linha, ela foi desativada.

---

### Erro 9 — Usar comentário para documentação que deveria estar no README

Configuração, comandos e objetivo do laboratório geralmente ficam melhor no README.

Não encha o código com instruções de execução.

---

### Erro 10 — Comentário agressivo ou pessoal

Evite comentários como:

```java
// gambiarra horrível do fulano
```

Comentários precisam ser profissionais.

Explique o problema técnico.

Não ataque pessoas.

---

## Exemplo de revisão antes do commit

Antes de commit, procure comentários suspeitos.

No IntelliJ:

```text
Ctrl + Shift + F
```

Procure:

```text
TODO
senha
token
password
secret
gambiarra
remover
teste
```

No terminal, futuramente também é possível usar comandos de busca.

Neste momento, use a IDE.

Objetivo:

```text
não enviar sujeira para o repositório.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-023-comentarios-documentacao
cd labs\m1\aula-023-comentarios-documentacao
```

Crie os arquivos:

```text
Main.java
ComentarioOrdemServico.java
ComentarioPedido.java
ComentarioAuditoria.java
README.md
```

### `Main.java`

```java
/**
 * Programa simples para demonstrar comentários em Java.
 */
public class Main {
    public static void main(String[] args) {
        // Mensagem inicial do laboratório.
        System.out.println("Comentários úteis em Java");
    }
}
```

### `ComentarioOrdemServico.java`

```java
public class ComentarioOrdemServico {
    public static void main(String[] args) {
        // Regra didática: OS aberta representa uma ordem que ainda pode receber atividade.
        System.out.println("OS: 1001");
        System.out.println("Status: ABERTA");
        System.out.println("Pode receber nova atividade: SIM");
    }
}
```

### `ComentarioPedido.java`

```java
public class ComentarioPedido {
    public static void main(String[] args) {
        /*
         Fluxo didático:
         neste momento da formação, o pedido ainda é representado apenas por textos fixos.
         Variáveis serão introduzidas nas próximas aulas.
        */
        System.out.println("Pedido: PED-001");
        System.out.println("Status: PENDENTE");
        System.out.println("Pagamento: AGUARDANDO");
    }
}
```

### `ComentarioAuditoria.java`

```java
public class ComentarioAuditoria {
    public static void main(String[] args) {
        // Regra de auditoria: toda alteração relevante precisa indicar o usuário responsável.
        System.out.println("Evento: ALTERACAO_STATUS");
        System.out.println("Usuario: usuario.exemplo");
        System.out.println("Origem: SISTEMA");
    }
}
```

Compile:

```powershell
javac Main.java
javac ComentarioOrdemServico.java
javac ComentarioPedido.java
javac ComentarioAuditoria.java
```

Execute:

```powershell
java Main
java ComentarioOrdemServico
java ComentarioPedido
java ComentarioAuditoria
```

Depois revise se `.class` não será versionado.

---

## README do laboratório

Crie `README.md` dentro do laboratório:

````markdown
# Aula 023 — Comentários úteis e documentação inicial

## Arquivos

- `Main.java`
- `ComentarioOrdemServico.java`
- `ComentarioPedido.java`
- `ComentarioAuditoria.java`

## Cuidados

- Não comentar o óbvio.
- Não deixar código morto comentado.
- Não colocar senha, token ou dado real em comentário.
- Preferir nomes claros quando o comentário só estiver explicando nome ruim.
````

Isso conecta código com documentação.

---

## Commit recomendado

Antes:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-023-comentarios-documentacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 023: pratica comentarios uteis em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore` antes do commit.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
criar comentário de linha com //;
criar comentário de bloco com /* */;
reconhecer comentário de documentação com /** */;
explicar que comentário não executa;
explicar quando comentar;
explicar quando não comentar;
identificar comentário óbvio;
identificar comentário desatualizado;
identificar código morto comentado;
remover comentário inútil;
melhorar nome quando comentário só explica nome ruim;
não colocar senha, token ou dado real em comentário;
criar README simples de laboratório;
diferenciar comentário local de documentação em Markdown;
usar atalhos de comentário quando conveniente;
compilar exemplos;
executar exemplos;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar Javadoc.

Não precisa ainda gerar documentação HTML.

Não precisa ainda documentar APIs complexas.

O objetivo é desenvolver critério sobre comentários.

---

## Fechamento da aula

Comentários são simples na sintaxe.

Mas exigem maturidade no uso.

Hoje vimos que comentar não é escrever qualquer coisa no código.

Comentário útil explica intenção, contexto, regra ou limitação.

Comentário ruim repete o óbvio, fica desatualizado, esconde código morto ou expõe segredo.

Também vimos que documentação inicial pode morar fora do código, em arquivos Markdown.

Essa separação será importante durante toda a formação:

```text
código claro;
comentário quando necessário;
documentação quando o contexto for maior.
```

Na próxima aula, vamos estudar variáveis e nomes profissionais.

Essa próxima aula se conecta diretamente com esta:

```text
muitas vezes, o melhor comentário é um nome bem escolhido.
```
