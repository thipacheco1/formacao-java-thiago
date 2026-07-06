# Diário de Bordo - Formação Java Backend

## Objetivo da formação

Meu objetivo é me formar como Engenheiro Java Backend, evoluindo do básico ao avançado, com domínio de Java, orientação a objetos, backend, banco de dados, Spring Boot, testes, arquitetura, cloud, mensageria, Docker, Kubernetes, observabilidade, segurança e preparação para entrevistas.

---

## Aula 1.1 - Modelo do curso

### O que foi feito
- Definido que o ChatGPT será usado como professor e mentor.
- Definido que o IntelliJ será o ambiente principal de desenvolvimento.
- Definido que o Codex será usado futuramente como apoio e revisor.
- Definido que o documento v3 será o mapa oficial da formação.

### Status
Concluída.

---

## Aula 1.2 - Instalação e validação do JDK 21

### O que foi feito
- Instalado o JDK 21 LTS.
- Validado o comando `java -version`.
- Validado o comando `javac -version`.
- Confirmado o uso do Eclipse Temurin 21.

### Resultado
Ambiente Java instalado e funcionando.

### Status
Concluída.

---

## Aula 1.3 - Primeiro projeto Java no IntelliJ

### O que foi feito
- Criado o projeto `formacao-java-thiago`.
- Configurado o JDK 21 no IntelliJ.
- Criado o arquivo `Main.java`.
- Executado o primeiro programa Java.
- Validado o console com `Process finished with exit code 0`.

### Status
Concluída.

---

## Aula 1.4 - Entendendo o primeiro programa Java

### O que foi aprendido
- Estrutura básica de uma classe Java.
- Método `main`.
- Uso de `System.out.println`.
- Diferença entre `print` e `println`.
- Uso do ponto e vírgula.
- Leitura do console.

### Status
Concluída.

---

## Aula 1.5 - Comentários em Java

### O que foi aprendido
- Comentário de uma linha com `//`.
- Comentário de várias linhas com `/* */`.
- Comentários são ignorados pelo Java.
- Comentários devem explicar contexto, não o óbvio.

### Status
Concluída.

---

## Dúvidas encontradas

- No início, o IntelliJ não reconhecia `String` e `System`.
- A causa era configuração/fonte do projeto.
- A solução foi ajustar o projeto para reconhecer corretamente o JDK e a pasta `src`.

---

## Próxima aula

Aula 1.7 - Organização inicial do projeto e criação do README.

---

## Aula 1.6 - Diário de bordo da formação

### O que foi feito
- Criada a pasta `docs`.
- Criado o arquivo `atalhos.txt`.
- Criado o arquivo `diario-de-bordo.md`.
- Registrado o histórico inicial das aulas concluídas.
- Validado o uso de Markdown dentro do IntelliJ.

### O que foi aprendido
- Um projeto profissional não deve conter apenas código.
- Documentação ajuda a registrar decisões, dificuldades e evolução.
- O diário de bordo será usado como fonte de revisão durante a formação.
- O arquivo `atalhos.txt` será usado para registrar atalhos úteis do IntelliJ e demais ferramentas.

### Dificuldades encontradas
- Nenhuma dificuldade técnica nesta etapa.

### Status
Concluída.

### Próxima aula
Aula 1.7 - Criação do README do projeto.

---

## Aula 1.7 - Criação do README do projeto

### O que foi feito
- Criado o arquivo `README.md` na raiz do projeto.
- Documentado o objetivo da formação Java Backend.
- Registrado o ambiente utilizado.
- Documentada a estrutura inicial do projeto.
- Registradas as aulas concluídas até o momento.
- Incluído o primeiro programa Java no README.

### O que foi aprendido
- O `README.md` é a porta de entrada de um projeto.
- Ele serve para explicar o objetivo, tecnologias, estrutura, status e próximos passos.
- Um bom projeto profissional precisa ter documentação clara desde o início.

### Dificuldades encontradas
- O Markdown enviado anteriormente ficou quebrado visualmente por conter blocos internos de código.
- A solução definida foi enviar conteúdos `.md` sempre em um único bloco Markdown fechado.

### Status
Concluída.

### Próxima aula
Aula 1.8 - Introdução ao Git e versionamento do projeto.

---

## Aula 1.8 - Introdução ao Git e primeiro commit

### O que foi feito
- Verificada a instalação do Git.
- Confirmada a versão `git version 2.54.0.windows.1`.
- Configurado o nome global do Git.
- Configurado o e-mail global do Git.
- Inicializado o repositório local com `git init`.
- Validado o estado do projeto com `git status`.
- Ajustado o `.gitignore` para ignorar arquivos internos da IDE e arquivos compilados.
- Adicionados os arquivos ao stage com `git add .`.
- Criado o primeiro commit da formação.
- Validado o histórico com `git log --oneline`.

### Commit criado
```text
e960423 Adiciona estrutura inicial da formacao Java
```

### O que foi aprendido
- Git é uma ferramenta de controle de versão.
- GitHub é uma plataforma online para hospedar repositórios Git.
- `git init` inicia um repositório local.
- `git status` mostra a situação atual dos arquivos.
- `git add .` adiciona os arquivos ao stage.
- `git commit -m` registra uma versão do projeto.
- `git log --oneline` mostra o histórico resumido de commits.
- `working tree clean` significa que não existem alterações pendentes.

### Dificuldades encontradas
- Foi digitado `git configo` em vez de `git config`.
- Foi digitado `git add ,` em vez de `git add .`.
- O Git exibiu aviso sobre `LF` e `CRLF`.

### Como foi resolvido
- Corrigido o comando `git config`.
- Corrigido o comando para `git add .`.
- O aviso de `LF/CRLF` foi identificado como alerta de quebra de linha no Windows, sem impacto neste momento.

### Status
Concluída.

### Próxima aula
Aula 1.9 - Criar repositório no GitHub e subir o projeto.

---

## Aula 1.9 - Branch main, GitHub e primeiro push

### O que foi feito
- Renomeada a branch principal de `master` para `main`.
- Criado o repositório `formacao-java-thiago` no GitHub.
- Configurado o repositório remoto com `git remote add origin`.
- Validado o remoto com `git remote -v`.
- Enviado o projeto local para o GitHub com `git push -u origin main`.
- Confirmado que a branch `main` local está rastreando `origin/main`.
- Validado o projeto publicado no GitHub.

### Comandos utilizados
```bash
git branch
git branch -M main
git remote add origin https://github.com/thipacheco1/formacao-java-thiago
git remote -v
git push -u origin main
```

### O que foi aprendido
- `master` e `main` são nomes de branches principais.
- O padrão moderno mais comum é usar `main`.
- `origin` é o nome convencional do repositório remoto.
- `git remote add origin` conecta o projeto local ao GitHub.
- `git push -u origin main` envia a branch local para o GitHub e cria o rastreamento entre local e remoto.
- Depois do primeiro `push -u`, os próximos envios podem ser feitos apenas com `git push`.

### Dificuldades encontradas
- O `README.md` foi criado inicialmente dentro da pasta `docs`.

### Como foi resolvido
- O arquivo será movido para a raiz do projeto usando `git mv`.
- Será criado um novo commit apenas para esse ajuste de organização.

### Status
Concluída com ajuste de organização pendente.

### Próxima aula
Aula 1.10 - Revisão da estrutura profissional do projeto e primeiros conceitos de arquivos versionados.

---

## Aula 1.10 - Revisão da estrutura profissional do projeto

### O que foi feito
- Validado o estado do repositório com `git status`.
- Confirmado que a branch `main` está atualizada com `origin/main`.
- Executado o comando `git ls-files`.
- Validado quais arquivos estão sendo versionados pelo Git.

### Arquivos versionados
```text
.gitignore
README.md
docs/atalhos.txt
docs/diario-de-bordo.md
src/Main.java
```

### O que foi aprendido
- Arquivos versionados são arquivos controlados pelo Git.
- Arquivos ignorados existem localmente, mas não entram no histórico do Git.
- Código-fonte e documentação devem ser versionados.
- Arquivos gerados, temporários e internos da IDE devem ficar fora do Git.
- O comando `git ls-files` mostra exatamente quais arquivos estão sendo controlados pelo Git.

### Validação
- O diretório `.idea` não foi versionado.
- O diretório `out` não foi versionado.
- O arquivo `.iml` não foi versionado.
- O projeto está limpo com `working tree clean`.

### Status
Concluída.

### Próxima aula
Aula 2.1 - Variáveis em Java: o primeiro conceito real da linguagem.

---

## Aula 2.1 - Variáveis em Java

### O que foi feito
- Criado um programa usando variáveis em Java.
- Declaradas variáveis dos tipos `String`, `int` e `boolean`.
- Impressos os valores das variáveis no console.
- Utilizada concatenação com `+`.
- Aplicado o padrão `camelCase` em nomes de variáveis.
- Utilizado o atalho `Shift + F6` para renomear variável com segurança.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        String nome = "Thiago";
        int idade = 39;
        String cidade = "Barueri";
        String profissaoAtual = "QA";
        String objetivoProfissional = "Engenheiro Java Backend";
        int anosExperienciaQa = 10;
        boolean estudandoJava = true;

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Cidade: " + cidade);
        System.out.println("Profissão atual: " + profissaoAtual);
        System.out.println("Objetivo profissional: " + objetivoProfissional);
        System.out.println("Anos de experiência com QA: " + anosExperienciaQa);
        System.out.println("Está estudando Java? " + estudandoJava);
    }
}
```

### O que foi aprendido
- Variável é um espaço na memória usado para armazenar um valor.
- Toda variável em Java possui tipo, nome e valor.
- `String` é usado para textos.
- `int` é usado para números inteiros.
- `boolean` é usado para valores verdadeiro/falso.
- Para imprimir o valor de uma variável, ela deve ser usada sem aspas.
- Para imprimir texto fixo, o texto deve estar entre aspas.
- O operador `+` pode ser usado para concatenar texto com variáveis.
- Nomes de variáveis devem seguir o padrão `camelCase`.

### Dificuldades encontradas
- Inicialmente a variável `objetivoProfissional` foi criada, mas não foi impressa.
- O nome `anosExperiencia` estava genérico.
- A saída do console precisou ser padronizada.

### Como foi resolvido
- Adicionada a impressão de `objetivoProfissional`.
- Renomeada a variável para `anosExperienciaQa`.
- Ajustada a saída do console para ficar mais clara e profissional.

### Status
Concluída.

### Próxima aula
Aula 2.2 - Tipos primitivos em Java.

---

## Aula 2.2 - Tipos primitivos em Java

### O que foi feito
- Estudados os tipos primitivos do Java.
- Criado um programa usando `int`, `double`, `float`, `char` e `boolean`.
- Utilizada a classe `String` para texto.
- Testado o uso de `F` em valores `float`.
- Testado o uso de aspas simples em valores `char`.
- Criadas variáveis com dados pessoais/profissionais para praticar tipos.
- Atualizado o arquivo `atalhos.txt` com o atalho `Ctrl + Espaço`.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        String nomeCompleto = "Thiago Pacheco";
        int idade = 44;
        double altura = 1.79;
        float peso = 90.0F;
        char inicialSobrenome = 'P';
        int quantidadeFilhos = 2;
        int anosExperienciaQa = 10;
        boolean estudaJava = true;
        boolean pretendeVirarArquiteto = true;

        System.out.println("Nome completo: " + nomeCompleto);
        System.out.println("Idade: " + idade);
        System.out.println("Altura: " + altura);
        System.out.println("Peso: " + peso);
        System.out.println("Inicial do sobrenome: " + inicialSobrenome);
        System.out.println("Quantidade de filhos: " + quantidadeFilhos);
        System.out.println("Anos de experiência com QA: " + anosExperienciaQa);
        System.out.println("Estuda Java? " + estudaJava);
        System.out.println("Pretende virar Arquiteto Java? " + pretendeVirarArquiteto);
    }
}
```

### O que foi aprendido
- Java possui 8 tipos primitivos: `byte`, `short`, `int`, `long`, `float`, `double`, `char` e `boolean`.
- `int` é usado para números inteiros.
- `long` é usado para números inteiros maiores e normalmente recebe `L` no final.
- `double` é usado para números decimais com maior precisão.
- `float` é usado para números decimais com menor precisão e recebe `F` no final.
- `char` representa um único caractere e usa aspas simples.
- `boolean` representa apenas `true` ou `false`.
- `String` representa texto, mas não é tipo primitivo; é uma classe.
- `String` usa aspas duplas.
- Variáveis devem seguir o padrão `camelCase`.

### Dificuldades encontradas
- Foi necessário reforçar a diferença entre `char` e `String`.
- Foi necessário observar que `float` precisa do sufixo `F`.
- Foi reforçado o cuidado com nomes de variáveis e textos exibidos no console.

### Como foi resolvido
- Criado um exercício prático usando cada tipo em uma situação real.
- Executado o programa no IntelliJ.
- Validado o resultado no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.3 - Operadores aritméticos em Java.

---

## Aula 2.3 - Operadores aritméticos em Java

### O que foi feito
- Estudados os operadores aritméticos básicos do Java.
- Praticados os operadores `+`, `-`, `*`, `/` e `%`.
- Testada a diferença entre divisão inteira e divisão decimal.
- Criado um exercício simulando cálculo de remuneração.
- Calculado total bruto, total com bônus e total final.
- Atualizado o arquivo `atalhos.txt` com atalhos de navegação e seleção de linha.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        double valorPorServico = 120.50;
        int quantidadeServicos = 8;
        double bonus = 150.00;
        double desconto = 80.00;

        double totalBruto = valorPorServico * quantidadeServicos;
        double totalComBonus = totalBruto + bonus;
        double totalFinal = totalComBonus - desconto;

        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Total bruto: R$ " + totalBruto);
        System.out.println("Bônus: R$ " + bonus);
        System.out.println("Total com bônus: R$ " + totalComBonus);
        System.out.println("Desconto: R$ " + desconto);
        System.out.println("Total final: R$ " + totalFinal);
    }
}
```

### Resultado obtido
```text
Valor por serviço: R$ 120.5
Quantidade de serviços: 8
Total bruto: R$ 964.0
Bônus: R$ 150.0
Total com bônus: R$ 1114.0
Desconto: R$ 80.0
Total final: R$ 1034.0
```

### O que foi aprendido
- `+` realiza soma ou concatenação, dependendo do contexto.
- `-` realiza subtração.
- `*` realiza multiplicação.
- `/` realiza divisão.
- `%` retorna o resto da divisão.
- Divisão entre inteiros pode gerar resultado inteiro.
- Para obter resultado decimal em divisão, é possível usar `double`.
- O uso de `double` serve para aprendizado, mas não é o ideal para dinheiro em sistemas reais.
- Para cálculos financeiros reais, futuramente será utilizado `BigDecimal`.

### Dificuldades encontradas
- Foi necessário observar a diferença entre cálculo matemático e apresentação no console.
- Foi reforçado que dinheiro com `double` é aceitável apenas para estudo inicial.

### Como foi resolvido
- Criado um exercício prático com valores de serviço, quantidade, bônus e desconto.
- Validado o resultado no console.
- Confirmado o sucesso da execução com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.4 - Operadores de comparação em Java.

---

## Aula 2.4 - Operadores de comparação em Java

### O que foi feito
- Estudados os operadores de comparação em Java.
- Praticados os operadores `==`, `!=`, `>`, `<`, `>=` e `<=`.
- Reforçada a diferença entre `=` e `==`.
- Criada uma regra simples de negócio usando comparação.
- Simulado um cenário de meta de serviços de um técnico.
- Testado o cenário positivo com `quantidadeServicos = 12`.
- Testado o cenário negativo com `quantidadeServicos = 8`.
- Atualizado o arquivo `atalhos.txt` com o atalho `Alt + Enter`.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        String nomeTecnico = "Carlos";
        int quantidadeServicos = 8;
        int metaServicos = 10;
        double valorPorServico = 120.50;
        double bonusMeta = 200.00;

        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        double totalSemBonus = quantidadeServicos * valorPorServico;

        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total sem bônus: R$ " + totalSemBonus);
        System.out.println("Bônus da meta: R$ " + bonusMeta);
        System.out.println("Atingiu a meta? " + atingiuMeta);
    }
}
```

### Resultados obtidos
```text
Cenário 1:
quantidadeServicos = 12
Atingiu a meta? true

Cenário 2:
quantidadeServicos = 8
Atingiu a meta? false
```

### O que foi aprendido
- Operadores de comparação retornam valores booleanos.
- `==` compara igualdade.
- `!=` compara diferença.
- `>` compara se um valor é maior que outro.
- `<` compara se um valor é menor que outro.
- `>=` compara se um valor é maior ou igual a outro.
- `<=` compara se um valor é menor ou igual a outro.
- `=` é atribuição.
- `==` é comparação.
- Comparações são a base para regras de negócio.
- Uma variável `boolean` pode armazenar o resultado de uma regra.

### Dificuldades encontradas
- Foi necessário testar tanto o cenário positivo quanto o cenário negativo para validar a regra corretamente.

### Como foi resolvido
- Primeiro foi testado `quantidadeServicos = 12`, retornando `true`.
- Depois foi testado `quantidadeServicos = 8`, retornando `false`.
- A execução foi validada no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.5 - Operadores lógicos em Java.

---

## Aula 2.5 - Operadores lógicos em Java

### O que foi feito
- Estudados os operadores lógicos em Java.
- Praticado o operador `&&` para regras onde todas as condições precisam ser verdadeiras.
- Praticado o operador `||` para regras onde pelo menos uma condição precisa ser verdadeira.
- Praticado o operador `!` para inverter valores booleanos.
- Criada uma regra de negócio para verificar se um técnico pode receber bônus.
- Testados cenários positivos e negativos para recebimento de bônus.
- Criada uma regra de acesso ao sistema.
- Testado acesso com conta bloqueada e conta desbloqueada.
- Atualizado o arquivo `atalhos.txt` com o atalho `Ctrl + F5`.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        String nomeUsuario = "Thiago";
        boolean usuarioAtivo = true;
        boolean senhaCorreta = true;
        boolean possuiPermissao = true;
        boolean contaBloqueada = false;

        boolean podeAcessarSistema = usuarioAtivo && senhaCorreta && possuiPermissao && !contaBloqueada;

        System.out.println("Usuário: " + nomeUsuario);
        System.out.println("Usuário ativo? " + usuarioAtivo);
        System.out.println("Senha correta? " + senhaCorreta);
        System.out.println("Possui permissão? " + possuiPermissao);
        System.out.println("Conta bloqueada? " + contaBloqueada);
        System.out.println("Pode acessar o sistema? " + podeAcessarSistema);
    }
}
```

### Resultados obtidos
```text
Cenário 1:
contaBloqueada = true
Pode acessar o sistema? false

Cenário 2:
contaBloqueada = false
Pode acessar o sistema? true
```

### O que foi aprendido
- `&&` significa E lógico.
- Com `&&`, todas as condições precisam ser verdadeiras para o resultado final ser `true`.
- `||` significa OU lógico.
- Com `||`, basta uma condição ser verdadeira para o resultado final ser `true`.
- `!` significa negação.
- `!true` resulta em `false`.
- `!false` resulta em `true`.
- Operadores lógicos são usados para combinar regras booleanas.
- Regras como acesso ao sistema, bloqueio, permissão e validação de status usam operadores lógicos com frequência.

### Dificuldades encontradas
- Foi necessário testar mais de um cenário para validar corretamente a regra.
- Foi reforçada a importância de testar tanto o caminho positivo quanto o caminho negativo.

### Como foi resolvido
- Testado cenário com conta bloqueada, retornando `false`.
- Testado cenário com conta desbloqueada, retornando `true`.
- Validada a execução no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.6 - Estruturas condicionais com `if`, `else if` e `else`.

---

## Aula 2.6 - Estruturas condicionais com if, else if e else

### O que foi feito
- Estudada a estrutura condicional `if`.
- Estudada a estrutura `else`.
- Estudada a estrutura `else if`.
- Criada uma regra de classificação de performance de técnico.
- Testados quatro cenários diferentes de quantidade de serviços.
- Validada a ordem correta das condições.
- Atualizado o arquivo `atalhos.txt` com os atalhos `Tab` e `Shift + Tab`.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        String nomeTecnico = "Carlos";
        int quantidadeServicos = 5;
        int metaMinima = 8;
        int metaBoa = 12;
        int metaExcelente = 15;

        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);

        if (quantidadeServicos >= metaExcelente) {
            System.out.println("Performance excelente.");
        } else if (quantidadeServicos >= metaBoa) {
            System.out.println("Performance boa.");
        } else if (quantidadeServicos >= metaMinima) {
            System.out.println("Performance mínima atingida.");
        } else {
            System.out.println("Meta não atingida.");
        }
    }
}
```

### Resultados obtidos
```text
Cenário 1:
quantidadeServicos = 16
Resultado: Performance excelente.

Cenário 2:
quantidadeServicos = 13
Resultado: Performance boa.

Cenário 3:
quantidadeServicos = 9
Resultado: Performance mínima atingida.

Cenário 4:
quantidadeServicos = 5
Resultado: Meta não atingida.
```

### O que foi aprendido
- `if` executa um bloco quando a condição é verdadeira.
- `else` executa um bloco quando nenhuma condição anterior é verdadeira.
- `else if` permite testar múltiplas possibilidades.
- O Java avalia as condições de cima para baixo.
- Quando uma condição verdadeira é encontrada, os próximos `else if` são ignorados.
- Em regras com níveis, a ordem das condições importa.
- Para classificação por faixa, normalmente a regra mais forte deve vir primeiro.
- Estruturas condicionais são a base para decisões em sistemas backend.

### Dificuldades encontradas
- Foi necessário validar todos os cenários para garantir que a regra estava correta.
- Foi reforçada a importância da ordem dos `else if`.

### Como foi resolvido
- Testado o cenário excelente com `quantidadeServicos = 16`.
- Testado o cenário bom com `quantidadeServicos = 13`.
- Testado o cenário mínimo com `quantidadeServicos = 9`.
- Testado o cenário de meta não atingida com `quantidadeServicos = 5`.
- Confirmada a execução no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.7 - Estrutura condicional `switch`.

---

## Aula 2.7 - Estrutura condicional switch

### O que foi feito
- Estudada a estrutura condicional `switch`.
- Praticado o uso de `case`.
- Praticado o uso de `break`.
- Praticado o uso de `default`.
- Testado o comportamento sem `break`, conhecido como fall-through.
- Criado um exemplo com opções de menu.
- Criado um exemplo com status de ordem de serviço.
- Criado um exercício de tipo de serviço.
- Testados os cenários `tipoServico = 1`, `tipoServico = 2`, `tipoServico = 5` e `tipoServico = 9`.
- Atualizado o arquivo `atalhos.txt` com o atalho `Shift` duas vezes.

### Código praticado
```java
public class Main {
    public static void main(String[] args) {
        int tipoServico = 9;

        switch (tipoServico) {
            case 1:
                System.out.println("Tipo de serviço: Montagem.");
                break;
            case 2:
                System.out.println("Tipo de serviço: Assistência técnica.");
                break;
            case 3:
                System.out.println("Tipo de serviço: Entrega.");
                break;
            case 4:
                System.out.println("Tipo de serviço: Vistoria.");
                break;
            case 5:
                System.out.println("Tipo de serviço: Troca.");
                break;
            default:
                System.out.println("Tipo de serviço inválido.");
        }
    }
}
```

### Resultados obtidos
```text
Cenário 1:
tipoServico = 1
Resultado: Tipo de serviço: Montagem.

Cenário 2:
tipoServico = 2
Resultado: Tipo de serviço: Assistência técnica.

Cenário 3:
tipoServico = 5
Resultado: Tipo de serviço: Troca.

Cenário 4:
tipoServico = 9
Resultado: Tipo de serviço inválido.
```

### O que foi aprendido
- `switch` é usado quando uma variável precisa ser comparada com valores fixos.
- `case` representa uma possibilidade de valor.
- `break` encerra a execução do `switch` após encontrar o caso correspondente.
- `default` é executado quando nenhum `case` atende ao valor informado.
- Sem `break`, o Java pode continuar executando os próximos casos.
- Esse comportamento é chamado de fall-through.
- `switch` é útil para status, tipos, categorias, opções de menu e códigos fixos.

### Dificuldades encontradas
- Foi necessário entender a importância do `break`.
- Foi necessário testar o valor inválido para validar o `default`.

### Como foi resolvido
- Testados diferentes valores de `tipoServico`.
- Confirmado que cada `case` executa a saída correta.
- Confirmado que `tipoServico = 9` cai no `default`.
- Validada a execução no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.8 - Entrada de dados com Scanner.

---

## Aula 2.8 - Entrada de dados com Scanner

### O que foi feito
- Estudada a entrada de dados pelo console.
- Utilizada a classe `Scanner`.
- Importada a classe `java.util.Scanner`.
- Criado um objeto `Scanner` usando `System.in`.
- Testada leitura de texto com `nextLine()`.
- Testada leitura de número inteiro com `nextInt()`.
- Testada leitura de número decimal com `nextDouble()`.
- Testado o comportamento de leitura de dados digitados pelo usuário.
- Criado um exercício profissional simulando entrada de dados de um técnico.
- Calculado o total sem bônus com base na quantidade de serviços e valor por serviço.
- Validada a regra de meta usando operador de comparação.
- Atualizado o arquivo `atalhos.txt` com o atalho `Alt + F12`.

### Código praticado
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do técnico:");
        String nomeTecnico = scanner.nextLine();

        System.out.println("Digite a quantidade de serviços:");
        int quantidadeServicos = scanner.nextInt();

        System.out.println("Digite a meta de serviços:");
        int metaServicos = scanner.nextInt();

        System.out.println("Digite o valor por serviço:");
        double valorPorServico = scanner.nextDouble();

        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        double totalSemBonus = quantidadeServicos * valorPorServico;

        System.out.println("----- Resultado -----");
        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total sem bônus: R$ " + totalSemBonus);
        System.out.println("Atingiu a meta? " + atingiuMeta);

        scanner.close();
    }
}
```

### Resultado obtido
```text
Digite o nome do técnico:
Thiago

Digite a quantidade de serviços:
8

Digite a meta de serviços:
10

Digite o valor por serviço:
120,5

----- Resultado -----
Técnico: Thiago
Quantidade de serviços: 8
Meta de serviços: 10
Valor por serviço: R$ 120.5
Total sem bônus: R$ 964.0
Atingiu a meta? false
```

### O que foi aprendido
- `Scanner` permite ler dados digitados pelo usuário no console.
- `System.in` representa a entrada padrão do sistema, normalmente o teclado.
- `nextLine()` lê uma linha de texto.
- `nextInt()` lê um número inteiro.
- `nextDouble()` lê um número decimal.
- `scanner.close()` fecha o recurso de entrada após o uso.
- Valores digitados pelo usuário podem ser armazenados em variáveis.
- As variáveis lidas podem ser usadas em cálculos e regras de negócio.
- No ambiente utilizado, o `nextDouble()` aceitou valor decimal com vírgula, como `120,5`.
- Em alguns ambientes, pode ser necessário usar ponto, como `120.5`.

### Dificuldades encontradas
- Foi necessário testar mais de um cenário para validar corretamente a regra.
- Em um teste inicial, a quantidade de serviços foi igual à meta, retornando `true`.
- Foi necessário testar o cenário negativo obrigatório, com quantidade menor que a meta.
- Também foi observado que informar valor `0` gera total `0.0`, pois o programa calcula com base no valor digitado.

### Como foi resolvido
- Testado o cenário com `quantidadeServicos = 8` e `metaServicos = 10`.
- Informado o valor por serviço como `120,5`.
- Validado que o total sem bônus foi calculado como `964.0`.
- Confirmado que a regra `8 >= 10` retornou `false`.
- Validada a execução no console com `exit code 0`.

### Status
Concluída.

### Próxima aula
Aula 2.9 - Exercício integrador dos fundamentos iniciais.

---

## Aula 2.9 - Exercício integrador dos fundamentos iniciais

### O que foi feito
- Criado um programa integrador chamado mentalmente de Analisador de Serviço Técnico.
- Utilizada entrada de dados com Scanner.
- Lidos dados de texto, números inteiros, números decimais e booleanos.
- Utilizado switch para identificar o tipo de serviço.
- Utilizado cálculo aritmético para calcular o total bruto.
- Utilizada comparação para verificar se o técnico atingiu a meta.
- Utilizado operador lógico para validar se o técnico pode receber bônus.
- Utilizado if, else if e else para classificar a performance.
- Testados os cenários aprovado, bloqueado e abaixo da meta.
- Atualizado o arquivo atalhos.txt com o atalho Ctrl + F.

### Código praticado
Arquivo: src/Main.java

Conceitos usados no código:
- import java.util.Scanner;
- Scanner scanner = new Scanner(System.in);
- leitura com nextLine, nextInt, nextDouble e nextBoolean;
- switch para tipo de serviço;
- cálculo do total bruto;
- boolean atingiuMeta;
- boolean podeReceberBonus;
- if / else if / else para classificação de performance;
- scanner.close();

### Resultados obtidos

Cenário 1 - Aprovado:
- Tipo de serviço: Assistência técnica
- Quantidade de serviços: 16
- Meta de serviços: 10
- Total bruto: R$ 1928.0
- Técnico ativo? true
- Possui bloqueio? false
- Atingiu a meta? true
- Pode receber bônus? true
- Classificação de performance: Excelente

Cenário 2 - Bloqueado:
- Tipo de serviço: Assistência técnica
- Quantidade de serviços: 16
- Meta de serviços: 10
- Total bruto: R$ 1928.0
- Técnico ativo? true
- Possui bloqueio? true
- Atingiu a meta? true
- Pode receber bônus? false
- Classificação de performance: Excelente

Cenário 3 - Abaixo da meta:
- Tipo de serviço: Tipo inválido
- Quantidade de serviços: 4
- Meta de serviços: 10
- Total bruto: R$ 482.0
- Técnico ativo? true
- Possui bloqueio? false
- Atingiu a meta? false
- Pode receber bônus? false
- Classificação de performance: Baixa

### O que foi aprendido
- Um programa pode combinar vários conceitos básicos em uma regra maior.
- Scanner permite tornar o programa interativo.
- switch é útil para valores fixos, como tipos de serviço.
- if, else if e else são úteis para classificar regras por prioridade.
- Operadores aritméticos permitem calcular totais.
- Operadores de comparação permitem criar regras booleanas.
- Operadores lógicos permitem combinar várias regras.
- Testar cenários diferentes é essencial para validar uma regra de negócio.
- Como QA, testar caminho positivo, caminho bloqueado e caminho negativo ajuda a garantir confiabilidade.

### Dificuldades encontradas
- Foi necessário validar mais de um cenário para garantir que todas as regras funcionavam.
- Foi necessário observar o efeito do bloqueio mesmo quando a meta era atingida.
- Foi necessário validar o default do switch com tipo de serviço inválido.

### Como foi resolvido
- Testado cenário aprovado com tipo de serviço válido, meta atingida e sem bloqueio.
- Testado cenário bloqueado com meta atingida, mas com bloqueio ativo.
- Testado cenário abaixo da meta com tipo de serviço inválido e quantidade menor que a meta.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 2.10 - Revisão do Módulo 2 e preparação para laços de repetição.

