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

---

## Aula 2.10 - Revisão do Módulo 2 e preparação para laços de repetição

### O que foi feito
- Revisados os principais conceitos do Módulo 2.
- Respondidas perguntas teóricas sobre atribuição, comparação, operadores lógicos, switch, break, nextLine e nextInt.
- Criado um exercício prático chamado Sistema de aprovação de OS.
- Utilizada entrada de dados com Scanner.
- Lidos dados do cliente, status da OS, valor do serviço, cliente ativo e pendência.
- Utilizado switch para traduzir o status da OS.
- Criada regra booleana para verificar se a OS pode seguir para atendimento.
- Utilizado if, else if e else para classificar o valor do serviço.
- Testado cenário positivo.
- Testado cenário negativo com pendência ativa.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- import java.util.Scanner;
- Scanner scanner = new Scanner(System.in);
- String para nome do cliente;
- int para status da OS;
- double para valor do serviço;
- boolean para cliente ativo e pendência;
- switch para descrição do status da OS;
- operador lógico &&;
- operador de negação !;
- comparação statusOs == 2;
- if, else if e else para classificação do valor;
- scanner.close();

### Regra principal validada
A OS pode seguir para atendimento somente quando:
- cliente está ativo;
- cliente não possui pendência;
- status da OS é igual a 2, ou seja, Agendada.

Regra usada:
boolean podeSeguirAtendimento = clienteAtivo && !possuiPendencia && statusOs == 2;

### Cenário positivo testado
Dados:
- Nome do cliente: maria
- Status da OS: 2
- Valor do serviço: 350.0
- Cliente ativo: true
- Possui pendência: false

Resultado:
- Status da OS: Agendada
- Pode seguir para atendimento? true
- Classificação do valor: Serviço de médio valor

### Cenário negativo testado
Dados:
- Nome do cliente: maria
- Status da OS: 2
- Valor do serviço: 350.0
- Cliente ativo: true
- Possui pendência: true

Resultado:
- Status da OS: Agendada
- Cliente ativo? true
- Possui pendência? true
- Pode seguir para atendimento? false
- Classificação do valor: Serviço de médio valor

### O que foi aprendido
- A diferença entre atribuição com = e comparação com ==.
- Como combinar regras booleanas com &&.
- Como inverter uma regra booleana usando !.
- Quando usar switch para valores fixos.
- Quando usar if para regras condicionais e faixas de valor.
- A importância do break no switch tradicional.
- A diferença entre nextLine e nextInt.
- Como transformar uma regra de negócio simples em código Java.
- Como validar cenários positivo e negativo.

### Dificuldades encontradas
- Foi necessário ajustar a saída do console para exibir a descrição do status da OS em vez do número.
- Foi necessário remover o R$ da impressão de pendência, pois pendência é boolean e não valor monetário.
- Foi necessário validar que uma OS agendada não pode seguir quando existe pendência ativa.

### Como foi resolvido
- Utilizada a variável descricaoStatusOs no resultado final.
- Corrigida a impressão de possuiPendencia.
- Testado o cenário negativo com status 2, cliente ativo e pendência true.
- Confirmado que o resultado correto foi false.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.1 - Introdução aos laços de repetição.

---

## Aula 3.1 - Introdução aos laços de repetição com for

### O que foi feito
- Iniciado o Módulo 3 da formação Java Backend.
- Estudado o conceito de laços de repetição.
- Entendido por que repetição é importante em Java, backend e automação.
- Apresentado o primeiro laço de repetição: for.
- Testado um contador de 1 até 5.
- Testado um contador de 1 até 10.
- Testado um exemplo simulando processamento de OS.
- Criado um exercício final simulando o processamento de atividades de uma OS.
- Alterada a quantidade de atividades de 5 para 3 para validar que o laço usa a variável como limite.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- for;
- contador;
- variável de controle;
- condição de repetição;
- incremento com ++;
- impressão de dados dentro do laço;
- uso de variável como limite do laço.

Código final praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 3;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
            }

            System.out.println("Processamento finalizado.");
        }
    }

### Resultado obtido
- Cliente: Maria
- Processando atividade 1 de 3
- Processando atividade 2 de 3
- Processando atividade 3 de 3
- Processamento finalizado.
- Process finished with exit code 0

### O que foi aprendido
- Laço de repetição permite executar o mesmo bloco de código várias vezes.
- O for é indicado quando sabemos ou controlamos a quantidade de repetições.
- A estrutura do for possui três partes principais: início, condição e incremento.
- O início define onde a contagem começa.
- A condição define até quando o laço continua executando.
- O incremento altera o contador a cada repetição.
- contador++ é uma forma curta de escrever contador = contador + 1.
- O bloco dentro do for executa enquanto a condição for verdadeira.
- Quando a condição fica falsa, o laço termina.
- Usar uma variável como limite deixa o código mais flexível.

### Dificuldades encontradas
- Foi necessário entender o fluxo completo do for.
- Foi necessário perceber que a variável atividadeAtual muda a cada repetição.
- Foi necessário validar que alterar quantidadeAtividades muda automaticamente a quantidade de execuções.

### Como foi resolvido
- Testado primeiro um contador simples.
- Depois testado um exemplo com processamento de OS.
- Por fim, criado o exercício com atividades de uma OS.
- Alterada a variável quantidadeAtividades de 5 para 3.
- Confirmado que o console exibiu apenas 3 atividades.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.2 - Laço for com soma e acumuladores.---

## Aula 3.1 - Introdução aos laços de repetição com for

### O que foi feito
- Iniciado o Módulo 3 da formação Java Backend.
- Estudado o conceito de laços de repetição.
- Entendido por que repetição é importante em Java, backend e automação.
- Apresentado o primeiro laço de repetição: for.
- Testado um contador de 1 até 5.
- Testado um contador de 1 até 10.
- Testado um exemplo simulando processamento de OS.
- Criado um exercício final simulando o processamento de atividades de uma OS.
- Alterada a quantidade de atividades de 5 para 3 para validar que o laço usa a variável como limite.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- for;
- contador;
- variável de controle;
- condição de repetição;
- incremento com ++;
- impressão de dados dentro do laço;
- uso de variável como limite do laço.

Código final praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 3;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
            }

            System.out.println("Processamento finalizado.");
        }
    }

### Resultado obtido
- Cliente: Maria
- Processando atividade 1 de 3
- Processando atividade 2 de 3
- Processando atividade 3 de 3
- Processamento finalizado.
- Process finished with exit code 0

### O que foi aprendido
- Laço de repetição permite executar o mesmo bloco de código várias vezes.
- O for é indicado quando sabemos ou controlamos a quantidade de repetições.
- A estrutura do for possui três partes principais: início, condição e incremento.
- O início define onde a contagem começa.
- A condição define até quando o laço continua executando.
- O incremento altera o contador a cada repetição.
- contador++ é uma forma curta de escrever contador = contador + 1.
- O bloco dentro do for executa enquanto a condição for verdadeira.
- Quando a condição fica falsa, o laço termina.
- Usar uma variável como limite deixa o código mais flexível.

### Dificuldades encontradas
- Foi necessário entender o fluxo completo do for.
- Foi necessário perceber que a variável atividadeAtual muda a cada repetição.
- Foi necessário validar que alterar quantidadeAtividades muda automaticamente a quantidade de execuções.

### Como foi resolvido
- Testado primeiro um contador simples.
- Depois testado um exemplo com processamento de OS.
- Por fim, criado o exercício com atividades de uma OS.
- Alterada a variável quantidadeAtividades de 5 para 3.
- Confirmado que o console exibiu apenas 3 atividades.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.2 - Laço for com soma e acumuladores.

---

## Aula 3.2 - Laço for com soma e acumuladores

### O que foi feito
- Estudado o conceito de acumulador.
- Revisado o uso do laço for.
- Entendido como somar valores dentro de uma repetição.
- Testado exemplo simples somando números de 1 até 5.
- Testado exemplo de OS com atividades de valor fixo.
- Criado exercício final chamado mentalmente de Calculadora de Total da OS.
- Utilizadas variáveis para cliente, quantidade de atividades, valor por atividade e total da OS.
- Processadas atividades usando for.
- Calculado total parcial a cada repetição.
- Calculado total final da OS.
- Testado cenário dinâmico alterando quantidade de atividades e valor por atividade.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- for;
- contador;
- acumulador;
- double;
- soma progressiva;
- total parcial;
- total final;
- variável como limite do laço;
- incremento com ++;
- cálculo dentro da repetição.

Código final praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 3;
            double valorPorAtividade = 200.00;
            double totalOs = 0.0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                totalOs = totalOs + valorPorAtividade;

                System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

### Resultado obtido
- Cliente: Maria
- Processando atividade 1 de 3
- Total parcial da OS: R$ 200.0
- Processando atividade 2 de 3
- Total parcial da OS: R$ 400.0
- Processando atividade 3 de 3
- Total parcial da OS: R$ 600.0
- Total final da OS: R$ 600.0
- Process finished with exit code 0

### O que foi aprendido
- Acumulador é uma variável usada para guardar um valor que vai sendo atualizado durante o laço.
- O acumulador normalmente começa com valor inicial neutro, como 0 ou 0.0.
- No caso de soma, o acumulador começa em 0.
- A cada repetição, um novo valor pode ser somado ao acumulador.
- A instrução totalOs = totalOs + valorPorAtividade atualiza o total com base no valor anterior.
- O contador controla quantas vezes o laço executa.
- O acumulador guarda o resultado progressivo.
- Contador e acumulador têm papéis diferentes.
- O total parcial mostra o valor acumulado até a repetição atual.
- O total final mostra o valor acumulado depois que o laço termina.

### Diferença entre contador e acumulador
- Contador controla a repetição.
- Acumulador guarda um valor calculado durante a repetição.

Exemplo:
- atividadeAtual é o contador.
- totalOs é o acumulador.

### Regra praticada
A cada atividade processada, o sistema soma o valor da atividade ao total da OS.

Regra usada:
totalOs = totalOs + valorPorAtividade;

Com:
- quantidadeAtividades = 3
- valorPorAtividade = 200.00

Fluxo:
- Atividade 1: totalOs = 0.0 + 200.0 = 200.0
- Atividade 2: totalOs = 200.0 + 200.0 = 400.0
- Atividade 3: totalOs = 400.0 + 200.0 = 600.0

### Observação importante
Nesta fase do curso foi usado double para representar valores monetários porque ainda estamos estudando fundamentos.

Em sistemas reais de backend, valores financeiros devem ser tratados com BigDecimal.

O BigDecimal será estudado futuramente, quando houver mais base de orientação a objetos e classes.

### Dificuldades encontradas
- Foi necessário entender que o totalOs precisa ser declarado antes do for.
- Foi necessário entender que o totalOs não pode ser reiniciado dentro do for.
- Foi necessário perceber que a cada repetição o total anterior é reaproveitado.
- Foi necessário diferenciar contador de acumulador.

### Como foi resolvido
- Criada a variável totalOs antes do laço, iniciando com 0.0.
- Somado o valorPorAtividade ao totalOs dentro do for.
- Exibido o total parcial a cada atividade processada.
- Validado o total final com 3 atividades de R$ 200.00.
- Confirmado que o total final foi R$ 600.0.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.3 - Laço for com condicionais dentro da repetição.

---

## Aula 3.3 - Laço for com condicionais dentro da repetição

### O que foi feito
- Estudado o uso de if dentro de um laço for.
- Entendido que uma condição pode ser avaliada a cada repetição.
- Testado exemplo de número par e ímpar.
- Testado exemplo somando apenas números pares.
- Testado exemplo de OS com atividades concluídas e pendentes.
- Criado exercício final chamado mentalmente de Processador de Atividades Concluídas.
- Utilizado for para percorrer todas as atividades.
- Utilizado if para identificar atividades concluídas.
- Utilizado else para identificar atividades pendentes.
- Somado valor apenas das atividades concluídas.
- Contabilizado total de atividades concluídas.
- Contabilizado total de atividades pendentes.
- Calculado total final da OS.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- for;
- if;
- else;
- contador;
- acumulador;
- operador de comparação <=;
- incremento com ++;
- totalização condicional;
- contagem de itens concluídos;
- contagem de itens pendentes;
- cálculo de total final.

Código final praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Carlos";
            int quantidadeAtividades = 6;
            int atividadesConcluidas = 2;
            double valorPorAtividade = 200.00;
            double totalOs = 0.0;
            int totalConcluidas = 0;
            int totalPendentes = 0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                if (atividadeAtual <= atividadesConcluidas) {
                    totalOs = totalOs + valorPorAtividade;
                    totalConcluidas++;

                    System.out.println("Atividade " + atividadeAtual + " concluída.");
                    System.out.println("Total parcial da OS: R$ " + totalOs);
                } else {
                    totalPendentes++;

                    System.out.println("Atividade " + atividadeAtual + " pendente.");
                }
            }

            System.out.println("----- Resumo da OS -----");
            System.out.println("Total de atividades concluídas: " + totalConcluidas);
            System.out.println("Total de atividades pendentes: " + totalPendentes);
            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

### Resultado obtido
- Cliente: Carlos
- Atividade 1 concluída.
- Total parcial da OS: R$ 200.0
- Atividade 2 concluída.
- Total parcial da OS: R$ 400.0
- Atividade 3 pendente.
- Atividade 4 pendente.
- Atividade 5 pendente.
- Atividade 6 pendente.
- Total de atividades concluídas: 2
- Total de atividades pendentes: 4
- Total final da OS: R$ 400.0
- Process finished with exit code 0

### O que foi aprendido
- É possível colocar if dentro de um for.
- O if é avaliado novamente a cada repetição.
- Nem todos os itens de uma repetição precisam ser processados da mesma forma.
- É possível somar apenas os itens que passam em uma regra.
- É possível ignorar ou tratar de forma diferente os itens que não passam na regra.
- O contador do for controla a atividade atual.
- O acumulador totalOs guarda o valor financeiro das atividades concluídas.
- totalConcluidas conta quantas atividades entraram na regra de concluídas.
- totalPendentes conta quantas atividades ficaram fora da regra.
- O else é usado para tratar o cenário oposto da condição.
- Essa lógica se aproxima mais de regras reais de backend.

### Regra praticada
A atividade entra no total da OS somente se estiver dentro da quantidade de atividades concluídas.

Regra usada:
if (atividadeAtual <= atividadesConcluidas)

Com:
- quantidadeAtividades = 6
- atividadesConcluidas = 2
- valorPorAtividade = 200.00

Fluxo:
- Atividade 1: concluída, soma R$ 200.00
- Atividade 2: concluída, soma R$ 200.00
- Atividade 3: pendente, não soma
- Atividade 4: pendente, não soma
- Atividade 5: pendente, não soma
- Atividade 6: pendente, não soma

Resumo:
- Total concluídas: 2
- Total pendentes: 4
- Total final da OS: R$ 400.0

### Diferença entre os controles usados
- atividadeAtual controla qual atividade está sendo analisada no momento.
- totalOs acumula o valor financeiro das atividades concluídas.
- totalConcluidas conta quantas atividades foram concluídas.
- totalPendentes conta quantas atividades ficaram pendentes.

### Dificuldades encontradas
- Foi necessário entender que o if fica dentro do for.
- Foi necessário entender que a condição é avaliada em cada volta do laço.
- Foi necessário separar o que acontece quando a atividade é concluída e quando é pendente.
- Foi necessário trabalhar com mais de um acumulador/contador no mesmo programa.

### Como foi resolvido
- Criado um for para percorrer todas as atividades.
- Criado um if para validar se a atividade atual estava dentro das concluídas.
- Somado valor apenas quando a atividade estava concluída.
- Incrementado totalConcluidas dentro do if.
- Incrementado totalPendentes dentro do else.
- Testado cenário com 6 atividades, 2 concluídas e valor de R$ 200.00.
- Confirmado que o resumo final apresentou 2 concluídas, 4 pendentes e total de R$ 400.0.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.4 - Laço for com Scanner.


---

## Aula 3.4 - Laço for com Scanner

### O que foi feito
- Estudado o uso de Scanner junto com o laço for.
- Entendido como fazer o for depender de um valor digitado pelo usuário.
- Testado exemplo simples com quantidade de repetições informada pelo usuário.
- Testado exemplo lendo o valor de cada atividade dentro do for.
- Criado exercício final chamado mentalmente de Calculadora Dinâmica de OS.
- Lido o nome do cliente usando nextLine.
- Lida a quantidade de atividades usando nextInt.
- Lido o valor de cada atividade usando nextDouble.
- Calculado o total parcial da OS a cada atividade processada.
- Calculado o total final da OS.
- Testado cenário com cliente Maria.
- Testado cenário com cliente Carlos.
- Validado uso de valores decimais com vírgula no ambiente local.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- import java.util.Scanner;
- Scanner scanner = new Scanner(System.in);
- nextLine;
- nextInt;
- nextDouble;
- for;
- contador;
- acumulador;
- leitura de dados dentro da repetição;
- total parcial;
- total final;
- scanner.close.

Código final praticado:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Digite o nome do cliente:");
            String nomeCliente = scanner.nextLine();

            System.out.println("Digite a quantidade de atividades:");
            int quantidadeAtividades = scanner.nextInt();

            double totalOs = 0.0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
                double valorAtividade = scanner.nextDouble();

                totalOs = totalOs + valorAtividade;

                System.out.println("Atividade " + atividadeAtual + " processada.");
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("----- Resumo da OS -----");
            System.out.println("Cliente: " + nomeCliente);
            System.out.println("Quantidade de atividades processadas: " + quantidadeAtividades);
            System.out.println("Total final da OS: R$ " + totalOs);

            scanner.close();
        }
    }

### Resultado obtido - Cenário Maria
Dados informados:
- Cliente: maria
- Quantidade de atividades: 3
- Valor da atividade 1: 100
- Valor da atividade 2: 200
- Valor da atividade 3: 300

Resultado:
- Cliente: maria
- Atividade 1 processada.
- Total parcial da OS: R$ 100.0
- Atividade 2 processada.
- Total parcial da OS: R$ 300.0
- Atividade 3 processada.
- Total parcial da OS: R$ 600.0
- Quantidade de atividades processadas: 3
- Total final da OS: R$ 600.0

### Resultado obtido - Cenário Carlos
Dados informados:
- Cliente: carlos
- Quantidade de atividades: 4
- Valor da atividade 1: 120,5
- Valor da atividade 2: 80
- Valor da atividade 3: 200
- Valor da atividade 4: 99,5

Resultado:
- Cliente: carlos
- Atividade 1 processada.
- Total parcial da OS: R$ 120.5
- Atividade 2 processada.
- Total parcial da OS: R$ 200.5
- Atividade 3 processada.
- Total parcial da OS: R$ 400.5
- Atividade 4 processada.
- Total parcial da OS: R$ 500.0
- Quantidade de atividades processadas: 4
- Total final da OS: R$ 500.0
- Process finished with exit code 0

### O que foi aprendido
- O Scanner pode fornecer dados para controlar o for.
- A quantidade de repetições não precisa ficar fixa no código.
- O usuário pode informar a quantidade de atividades.
- O for pode usar essa quantidade digitada como limite.
- É possível ler valores dentro do for.
- Cada repetição pode receber um valor diferente.
- O acumulador totalOs soma os valores digitados pelo usuário.
- O total parcial mostra a evolução do cálculo.
- O total final mostra o resultado após o término do for.
- A ordem nextLine antes de nextInt não causou problema neste exercício.
- No ambiente local, o nextDouble aceitou valores decimais com vírgula.

### Conceito principal
O Scanner fornece os dados.
O for usa esses dados para controlar a repetição.
O acumulador soma os valores digitados.

No exercício:
- quantidadeAtividades define quantas vezes o for executa;
- valorAtividade recebe o valor informado em cada repetição;
- totalOs acumula o total da OS.

### Regra praticada
A cada atividade informada pelo usuário, o sistema soma o valor digitado ao total da OS.

Regra usada:
totalOs = totalOs + valorAtividade;

No cenário Carlos:
- 120,5 + 80 + 200 + 99,5 = 500.0

### Dificuldades encontradas
- Foi necessário juntar Scanner com for.
- Foi necessário entender que o valor digitado pelo usuário controla a quantidade de repetições.
- Foi necessário ler dados dentro da repetição.
- Foi necessário validar que cada atividade poderia ter um valor diferente.
- Foi necessário observar o comportamento do nextDouble com vírgula no ambiente local.

### Como foi resolvido
- Criada a leitura da quantidade de atividades antes do for.
- Usada a variável quantidadeAtividades como limite do laço.
- Lido o valor de cada atividade dentro do for.
- Somado cada valor digitado ao acumulador totalOs.
- Testado cenário com 3 atividades totalizando R$ 600.0.
- Testado cenário com 4 atividades totalizando R$ 500.0.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.5 - Laço while.

---

## Aula 3.6 - Laço do while

### O que foi feito
- Estudado o laço de repetição do while.
- Entendida a diferença entre while e do while.
- Validado que o do while executa pelo menos uma vez.
- Comparado o comportamento do while e do while.
- Testado exemplo com contador.
- Testado exemplo em que a condição já começa falsa.
- Criado menu simples usando do while.
- Criado exercício final chamado mentalmente de Menu de Atendimento com do while.
- Utilizada variável opcao para controlar a repetição.
- Utilizado contador totalOsProcessadas.
- Tratadas opções válidas, opção inválida e opção de saída.
- Validado encerramento do menu ao digitar 0.

### Código praticado
Arquivo: src/Main.java

Conceitos usados:
- import java.util.Scanner;
- Scanner scanner = new Scanner(System.in);
- do while;
- condição de repetição ao final do bloco;
- variável de controle;
- contador;
- incremento com ++;
- if;
- else if;
- else;
- menu no console;
- scanner.nextInt;
- scanner.close.

Código final praticado:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            int opcao;
            int totalOsProcessadas = 0;

            do {
                System.out.println("----- Menu de Atendimento -----");
                System.out.println("1 - Processar nova OS");
                System.out.println("2 - Exibir quantidade de OS processadas");
                System.out.println("3 - Exibir status do sistema");
                System.out.println("0 - Sair");
                System.out.println("Digite uma opção:");

                opcao = scanner.nextInt();

                if (opcao == 1) {
                    totalOsProcessadas++;
                    System.out.println("OS processada com sucesso.");
                } else if (opcao == 2) {
                    System.out.println("Total de OS processadas: " + totalOsProcessadas);
                } else if (opcao == 3) {
                    System.out.println("Sistema operacional e aguardando comandos.");
                } else if (opcao == 0) {
                    System.out.println("Encerrando sistema.");
                } else {
                    System.out.println("Opção inválida.");
                }
            } while (opcao != 0);

            System.out.println("Total final de OS processadas: " + totalOsProcessadas);

            scanner.close();
        }
    }

### Sequência testada
- 3
- 2
- 1
- 1
- 2
- 9
- 1
- 3
- 0

### Resultado obtido
- Opção 3: Sistema operacional e aguardando comandos.
- Opção 2: Total de OS processadas: 0
- Opção 1: OS processada com sucesso.
- Opção 1: OS processada com sucesso.
- Opção 2: Total de OS processadas: 2
- Opção 9: Opção inválida.
- Opção 1: OS processada com sucesso.
- Opção 3: Sistema operacional e aguardando comandos.
- Opção 0: Encerrando sistema.
- Total final de OS processadas: 3
- Process finished with exit code 0

### O que foi aprendido
- do while executa o bloco primeiro e verifica a condição depois.
- Diferente do while, o do while sempre executa pelo menos uma vez.
- O while pode executar zero vezes se a condição já começar falsa.
- O do while é útil quando a primeira execução é obrigatória.
- Menus de console são bons exemplos de uso do do while.
- No do while, a condição fica no final.
- O ponto e vírgula no final do do while é obrigatório.
- A variável opcao pode ser declarada sem valor inicial porque recebe valor dentro do bloco antes da condição ser verificada.
- A opção 0 foi usada como condição de parada.
- A opção 1 incrementou o total de OS processadas.
- A opção 2 apenas consultou o contador.
- A opção 3 exibiu status do sistema.
- Opções inválidas foram tratadas no else.

### Diferença entre while e do while
- while verifica a condição antes de executar.
- do while executa primeiro e verifica a condição depois.
- while pode executar zero vezes.
- do while executa pelo menos uma vez.

### Regra praticada
O menu continua aparecendo enquanto opcao for diferente de 0.

Regra usada:
do { ... } while (opcao != 0);

Quando o usuário digita 0:
- opcao passa a valer 0;
- a mensagem Encerrando sistema é exibida;
- a condição opcao != 0 fica falsa;
- o laço termina;
- o sistema exibe o total final.

### Dificuldades encontradas
- Foi necessário entender que a condição do do while fica no final.
- Foi necessário lembrar do ponto e vírgula após while (opcao != 0).
- Foi necessário entender por que a variável opcao pode ser declarada sem valor inicial.
- Foi necessário comparar mentalmente o comportamento de while e do while.
- Foi necessário validar que a opção inválida não altera o total.
- Foi necessário validar que a opção 2 consulta, mas não incrementa o contador.

### Como foi resolvido
- Criado um menu com do while.
- Declarada a variável opcao antes do bloco.
- Lida a opção dentro do bloco.
- Tratadas as opções com if, else if e else.
- Incrementado totalOsProcessadas apenas quando a opção foi 1.
- Mantida a opção 2 apenas para consulta.
- Tratada a opção 3 como exibição de status.
- Tratada a opção 9 como inválida.
- Encerrado o sistema com a opção 0.
- Confirmado o total final de OS processadas como 3.
- Confirmada a execução com exit code 0.

### Status
Concluída.

### Próxima aula
Aula 3.7 - Revisão dos laços for, while e do while.

---

## Aula 3.7 - Revisão dos laços for, while e do while

### O que foi feito
- Revisados os laços for, while e do while.
- Revisados os conceitos de contador, acumulador, condição de parada e loop infinito.
- Criado um exercício integrador chamado Sistema de Processamento de OS com Menu.
- Utilizado do while para manter o menu em execução.
- Utilizado Scanner para entrada de dados.
- Utilizado if, else if e else para tratar as opções do menu.
- Utilizado for para processar as atividades de cada OS.
- Utilizado if dentro do for para validar atividades com valor maior que zero.
- Utilizados acumuladores locais para cada OS.
- Utilizados acumuladores gerais para consolidar o sistema.
- Validado resumo inicial, resumo por OS, resumo geral, opção inválida e resumo final.

### Regras praticadas
O sistema possui um menu com as opções:
- 1 - Processar OS
- 2 - Exibir resumo geral
- 0 - Sair

Na opção 1:
- o sistema lê o nome do cliente;
- lê a quantidade de atividades;
- percorre as atividades usando for;
- lê o valor de cada atividade;
- se o valor for maior que zero, considera a atividade válida;
- se o valor for menor ou igual a zero, considera a atividade inválida;
- soma apenas atividades válidas no total da OS;
- contabiliza atividades válidas e inválidas da OS;
- atualiza os totais gerais do sistema.

Na opção 2:
- o sistema exibe o resumo geral acumulado até o momento.

Na opção 0:
- o sistema encerra e exibe o resumo final.

Em qualquer outra opção:
- o sistema exibe opção inválida.

### Conceitos usados
- Scanner
- do while
- for
- if
- else if
- else
- contador
- acumulador local
- acumulador geral
- scanner.nextInt
- scanner.nextLine
- limpeza de buffer
- scanner.nextDouble
- condição de parada
- opção inválida
- resumo parcial
- resumo geral
- resumo final

### Sequência testada
- 2
- 1
- maria
- 3
- 100
- -50
- 200
- 2
- 1
- carlos
- 2
- 300
- 0
- 2
- 9
- 0

### Resultado obtido - Resumo inicial
- Total de OS processadas: 0
- Total geral do sistema: R$ 0.0
- Total de atividades válidas: 0
- Total de atividades inválidas: 0

### Resultado obtido - OS Maria
Dados:
- Cliente: maria
- Quantidade de atividades: 3
- Valores informados: 100, -50 e 200

Resultado:
- Atividades válidas: 2
- Atividades inválidas: 1
- Total da OS: R$ 300.0

### Resultado obtido - OS Carlos
Dados:
- Cliente: carlos
- Quantidade de atividades: 2
- Valores informados: 300 e 0

Resultado:
- Atividades válidas: 1
- Atividades inválidas: 1
- Total da OS: R$ 300.0

### Resultado final validado
- Total de OS processadas: 2
- Total geral do sistema: R$ 600.0
- Total de atividades válidas: 3
- Total de atividades inválidas: 2
- Execução finalizada com exit code 0

### O que foi aprendido
- for é indicado quando existe uma quantidade controlada de repetições.
- while é indicado quando a repetição depende de uma condição verdadeira.
- do while é indicado quando o bloco precisa executar pelo menos uma vez.
- Um menu pode ser controlado por do while.
- Um processamento interno pode usar for dentro do do while.
- É possível usar if dentro do for para validar cada item processado.
- Acumuladores locais guardam os dados de uma OS específica.
- Acumuladores gerais guardam os dados consolidados do sistema.
- scanner.nextLine pode ser usado para limpar o Enter pendente após nextInt.
- Valores inválidos podem ser tratados sem entrar no total.
- Opção inválida deve ser tratada sem alterar os acumuladores.
- O resumo final deve refletir tudo que foi processado durante o uso do sistema.

### Diferença entre acumuladores locais e gerais
Acumuladores locais:
- totalOs
- atividadesValidas
- atividadesInvalidas

Eles representam apenas a OS atual.

Acumuladores gerais:
- totalOsProcessadas
- totalGeralSistema
- totalAtividadesValidasGeral
- totalAtividadesInvalidasGeral

Eles representam o consolidado de todo o sistema.

### Regra de validação de atividade
Uma atividade só é válida se o valor for maior que zero.

Regra usada:
- valorAtividade > 0

Se o valor for maior que zero:
- soma no total da OS;
- incrementa atividadesValidas.

Se o valor for menor ou igual a zero:
- não soma no total da OS;
- incrementa atividadesInvalidas.

### Dificuldades encontradas
- Foi necessário juntar vários conceitos em um único programa.
- Foi necessário usar do while para controlar o menu.
- Foi necessário usar for dentro do processamento da OS.
- Foi necessário usar if dentro do for para validar cada atividade.
- Foi necessário separar acumuladores da OS atual e acumuladores gerais do sistema.
- Foi necessário usar scanner.nextLine para evitar problema de leitura do nome do cliente.
- Foi necessário validar se valores negativos e zero não entravam no total.
- Foi necessário garantir que opção inválida não alterasse os totais.

### Como foi resolvido
- Criado menu com do while.
- Criadas opções com if, else if e else.
- Criado processamento de OS dentro da opção 1.
- Criado for para percorrer as atividades da OS.
- Criada validação valorAtividade > 0.
- Criados acumuladores locais para cada OS.
- Criados acumuladores gerais para todo o sistema.
- Atualizados os acumuladores gerais somente após finalizar cada OS.
- Testado resumo antes de processar qualquer OS.
- Testada OS com atividade válida e inválida.
- Testada segunda OS com valor zero inválido.
- Testada opção inválida.
- Validado resumo final com 2 OS, R$ 600.0, 3 atividades válidas e 2 inválidas.

### Status
Concluída.

### Próxima aula
Aula 3.8 - Controle de fluxo com break e continue.

