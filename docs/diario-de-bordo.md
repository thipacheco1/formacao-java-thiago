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