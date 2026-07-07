# 015 — M0.15 — Maven: Instalação e Validação Inicial

## Complemento operacional — roteiro final de instalação do Maven

> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.

Esta aula já traz uma explicação forte sobre Maven, `JAVA_HOME`, `PATH`, `MAVEN_HOME`, `mvn -version` e diagnóstico. Este complemento funciona como roteiro resumido de execução.

### Fonte de download

Baixe o Apache Maven pelo site oficial do Apache Maven.

Use o arquivo binário compactado:

```text
apache-maven-3.x.x-bin.zip
```

Não use pacote de código-fonte para esta instalação inicial.

### Instalação manual no Windows

Fluxo:

```text
1. Baixar o ZIP binário.
2. Extrair para `C:\dev\tools`.
3. Conferir se a pasta contém `bin`, `boot`, `conf` e `lib`.
4. Criar `MAVEN_HOME`.
5. Adicionar `%MAVEN_HOME%\bin` ao PATH.
6. Fechar e abrir o PowerShell.
7. Rodar `mvn -version`.
```

Exemplo conceitual:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x
PATH inclui %MAVEN_HOME%\bin
```

### Validação obrigatória

```powershell
java -version
javac -version
echo $env:JAVA_HOME
mvn -version
where mvn
echo $env:MAVEN_HOME
```

Verifique na saída de `mvn -version`:

```text
Apache Maven;
Maven home;
Java version;
Java home.
```

O Java usado pelo Maven precisa ser coerente com o JDK da formação.

### Validação no IntelliJ

No terminal integrado:

```powershell
mvn -version
where mvn
java -version
javac -version
```

Se funcionar fora do IntelliJ, mas não dentro:

```text
feche e abra o IntelliJ;
abra novo terminal integrado;
confira configuração de terminal.
```

### Critério operacional atualizado

```markdown
## Maven validado

- [ ] ZIP binário baixado de fonte oficial.
- [ ] Maven extraído em pasta estável.
- [ ] `MAVEN_HOME` aponta para a raiz do Maven.
- [ ] `%MAVEN_HOME%\bin` está no PATH.
- [ ] `mvn -version` funciona no PowerShell.
- [ ] `where mvn` aponta para caminho esperado.
- [ ] Maven usa o JDK correto.
- [ ] `mvn -version` funciona no terminal integrado do IntelliJ.
```

---

## Onde estamos na formação

Estamos no Módulo 0.

O objetivo deste módulo ainda não é programar Java profundamente.

O objetivo é preparar o ambiente profissional para que, quando a linguagem Java começar de verdade, a pessoa não fique travada por problemas de ferramenta.

Até aqui, já passamos por:

```text
mapa da formação;
diagnóstico inicial;
organização do Windows;
PowerShell e comandos básicos;
JDK, JRE e JVM;
compilação manual com javac;
IntelliJ IDEA Community;
debug inicial;
Git;
GitHub;
Markdown;
diário de bordo;
uso de IA com ética e método.
```

Agora entra o Maven.

Mas nesta aula, o foco ainda não é `pom.xml`, dependências ou ciclo de vida.

Antes disso, precisamos responder:

```text
o Maven está instalado?
o terminal reconhece o comando mvn?
o Maven está usando o Java correto?
o IntelliJ consegue usar o mesmo Maven?
o ambiente está pronto para projetos Maven?
```

Sem essa validação, qualquer aula futura de Maven pode virar diagnóstico confuso.

---

## Hoje a aula é sobre preparar Maven sem tratar ferramenta como mágica

Maven é uma ferramenta de build muito usada no ecossistema Java.

Ele ajuda em tarefas como:

```text
compilar projetos;
rodar testes;
baixar dependências;
empacotar aplicações;
padronizar estrutura;
integrar com IDE;
integrar com pipelines de CI/CD.
```

Mas nada disso funciona bem se a instalação estiver errada.

Antes de usar Maven em projeto real, você precisa validar três coisas:

```text
JDK funcionando;
Maven instalado;
terminal encontrando o Maven.
```

Depois, precisa validar uma quarta coisa:

```text
Maven usando o JDK correto.
```

Isso é mais importante do que parece.

É comum a pessoa ter JDK 21 instalado, mas o Maven apontar para outro Java.

Também é comum o Maven funcionar no PowerShell externo, mas não funcionar no terminal do IntelliJ.

Ou o IntelliJ usar Maven interno, enquanto o terminal usa Maven instalado no sistema.

Essas diferenças precisam ser compreendidas.

---

## O que é Maven neste momento

Neste ponto da formação, pense no Maven assim:

```text
Maven é uma ferramenta de linha de comando que coordena o build de projetos Java.
```

O comando principal é:

```bash
mvn
```

Exemplos futuros:

```bash
mvn -version
mvn compile
mvn test
mvn package
mvn clean
```

Mas nesta aula, a estrela é:

```bash
mvn -version
```

Esse comando responde:

```text
Maven existe?
qual versão está instalada?
qual Java ele está usando?
qual caminho de Java ele encontrou?
em qual sistema operacional está rodando?
```

Esse comando é o primeiro diagnóstico.

---

## Maven depende de Java

Maven é uma ferramenta Java.

Então, antes de validar Maven, valide Java.

No PowerShell:

```powershell
java -version
javac -version
```

Você precisa ter:

```text
java funcionando;
javac funcionando;
JDK instalado;
não apenas JRE.
```

Depois, valide `JAVA_HOME`:

```powershell
echo $env:JAVA_HOME
```

E veja onde o Java está sendo encontrado:

```powershell
where java
where javac
```

Se Java estiver errado, não culpe Maven ainda.

Corrija o JDK primeiro.

A ordem de diagnóstico é:

```text
JDK primeiro;
Maven depois.
```

---

## O que é `JAVA_HOME`

`JAVA_HOME` é uma variável de ambiente que aponta para a pasta do JDK.

Exemplo conceitual:

```text
C:\Program Files\Eclipse Adoptium\jdk-21...
```

ou:

```text
C:\Program Files\Java\jdk-21
```

O importante é:

```text
JAVA_HOME aponta para a raiz do JDK,
não para a pasta bin.
```

Errado:

```text
JAVA_HOME=C:\Program Files\Java\jdk-21\bin
```

Correto:

```text
JAVA_HOME=C:\Program Files\Java\jdk-21
```

O Maven usa `JAVA_HOME` para encontrar Java.

Se `JAVA_HOME` estiver errado, o Maven pode falhar ou usar uma versão incorreta.

---

## O que é `PATH`

`PATH` é uma variável de ambiente que diz ao sistema onde procurar comandos.

Quando você digita:

```powershell
mvn
```

o Windows procura `mvn.cmd` nas pastas listadas no `PATH`.

Para Maven funcionar no terminal, o `PATH` precisa incluir a pasta `bin` do Maven.

Exemplo:

```text
C:\dev\tools\apache-maven-3.x.x\bin
```

A pasta `bin` contém executáveis e scripts como:

```text
mvn.cmd
mvnDebug.cmd
```

Se o `PATH` não aponta para o `bin`, o comando `mvn` não será reconhecido.

---

## Onde instalar Maven

Uma organização recomendada para ferramentas de desenvolvimento no Windows:

```text
C:\dev\tools
```

Exemplo:

```text
C:\dev\tools\apache-maven-3.9.x
```

Evite instalar ou extrair Maven em:

```text
Downloads;
Área de Trabalho;
pastas temporárias;
pastas com acento;
pastas com espaço desnecessário;
pasta dentro de projeto;
pasta sincronizada com OneDrive.
```

Maven é ferramenta.

Não é arquivo de projeto.

Ele deve ficar em uma pasta estável.

---

## Maven no Windows não é um instalador tradicional

No Windows, o fluxo comum é:

```text
baixar o arquivo binário compactado;
extrair para uma pasta;
configurar variável de ambiente;
adicionar bin ao PATH;
abrir novo terminal;
validar com mvn -version.
```

Não é como instalar um programa clicando em “next, next, finish”.

Essa diferença confunde muita gente.

Maven é simples, mas exige configuração correta.

---

## Passo 1 — Baixar Maven do site oficial

Use sempre a fonte oficial do Apache Maven.

O arquivo geralmente vem como ZIP binário.

Procure por algo como:

```text
apache-maven-3.x.x-bin.zip
```

Não baixe Maven de sites aleatórios.

Motivos:

```text
segurança;
integridade;
versão correta;
evitar instaladores suspeitos;
evitar pacotes modificados.
```

Em ambiente corporativo, a empresa pode ter um procedimento próprio.

Nesse caso, siga a política interna.

---

## Passo 2 — Extrair Maven

Depois de baixar o ZIP, extraia para uma pasta estável.

Exemplo:

```text
C:\dev\tools\apache-maven-3.9.x
```

Dentro dessa pasta, você deve ver algo como:

```text
bin
boot
conf
lib
LICENSE
NOTICE
README
```

A pasta importante para o PATH é:

```text
bin
```

Exemplo:

```text
C:\dev\tools\apache-maven-3.9.x\bin
```

---

## Passo 3 — Configurar variável `MAVEN_HOME`

Você pode criar uma variável:

```text
MAVEN_HOME
```

apontando para a pasta raiz do Maven.

Exemplo:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x
```

Atenção:

```text
MAVEN_HOME aponta para a raiz do Maven,
não para bin.
```

Errado:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x\bin
```

Correto:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x
```

Depois, no `PATH`, adicione:

```text
%MAVEN_HOME%\bin
```

Ou adicione diretamente:

```text
C:\dev\tools\apache-maven-3.9.x\bin
```

As duas abordagens funcionam.

Usar `MAVEN_HOME` deixa mais claro.

---

## E o `M2_HOME`?

Em muitos tutoriais antigos, aparece:

```text
M2_HOME
```

Hoje, para uso comum, você não precisa depender dele.

A configuração essencial é:

```text
JAVA_HOME correto;
PATH contendo bin do Maven.
```

`MAVEN_HOME` pode ajudar na organização.

Mas não transforme variáveis antigas em regra cega.

O importante é validar com:

```powershell
mvn -version
```

---

## Passo 4 — Abrir um novo terminal

Depois de alterar variáveis de ambiente, feche e abra o PowerShell.

Terminais abertos antes da mudança podem não enxergar o PATH novo.

Então:

```text
feche o terminal;
abra de novo;
rode a validação.
```

Se estiver usando IntelliJ, pode ser necessário:

```text
fechar e abrir o IntelliJ;
abrir novo terminal integrado.
```

A IDE pode herdar variáveis antigas se estava aberta durante a configuração.

---

## Passo 5 — Validar Maven

No PowerShell:

```powershell
mvn -version
```

A saída deve mostrar algo como:

```text
Apache Maven ...
Maven home: ...
Java version: ...
Java home: ...
Default locale: ...
OS name: ...
```

Não olhe apenas se apareceu uma versão do Maven.

Confira também:

```text
Java version;
Java home.
```

O Maven precisa estar usando o JDK esperado.

Se a formação está usando JDK 21, valide se a saída aponta para esse Java.

---

## Passo 6 — Localizar o Maven no PATH

Use:

```powershell
where mvn
```

Esse comando mostra de onde o Windows está carregando o `mvn`.

Exemplo:

```text
C:\dev\tools\apache-maven-3.9.x\bin\mvn.cmd
```

Se aparecer outro caminho inesperado, existe mais de um Maven no ambiente.

Isso pode acontecer quando:

```text
Maven foi instalado por outra ferramenta;
existe versão antiga;
IDE tem Maven próprio;
PATH aponta para pasta diferente;
gerenciador de pacotes instalou Maven.
```

Saber qual Maven está sendo usado evita confusão.

---

## Passo 7 — Validar no terminal do IntelliJ

Abra o IntelliJ.

Use:

```text
Alt + F12
```

No terminal integrado, rode:

```powershell
mvn -version
where mvn
java -version
javac -version
```

Compare com o PowerShell externo.

O ideal é que ambos estejam coerentes.

Se funciona fora do IntelliJ, mas não dentro:

```text
a IDE pode estar aberta desde antes da configuração;
o terminal integrado pode estar com ambiente antigo;
a configuração de terminal pode ser diferente.
```

Solução comum:

```text
fechar e abrir o IntelliJ;
abrir novo terminal integrado;
validar de novo.
```

---

## Maven integrado do IntelliJ versus Maven do sistema

O IntelliJ pode usar Maven próprio ou Maven instalado no sistema.

Isso pode aparecer nas configurações da IDE.

Existem cenários em que:

```text
terminal usa Maven do sistema;
painel Maven da IDE usa Maven bundled;
JDK do projeto é um;
Maven Runner JRE é outro.
```

No início, a recomendação é manter simples:

```text
instalar Maven no sistema;
validar pelo terminal;
configurar IDE de forma coerente;
usar o mesmo JDK do projeto.
```

Não precisa dominar todas as configurações internas agora.

Mas precisa saber que diferenças podem existir.

---

## Exemplo mínimo de validação

Roteiro direto:

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
mvn -version
where mvn
```

Interpretação:

```text
java -version mostra runtime Java;
javac -version mostra compilador;
JAVA_HOME mostra raiz do JDK;
where java mostra caminho usado pelo comando java;
where javac mostra caminho usado pelo compilador;
mvn -version mostra Maven e Java usado pelo Maven;
where mvn mostra Maven encontrado no PATH.
```

Se todos estão coerentes, ambiente está saudável.

---

## Criando um diretório de validação

Crie uma pasta apenas para validar Maven:

```powershell
cd C:\dev\labs
mkdir validacao-maven
cd validacao-maven
```

Crie um arquivo de anotação:

```powershell
New-Item validacao.txt
```

Registre manualmente:

```text
Data da validação:
java -version:
javac -version:
JAVA_HOME:
mvn -version:
where mvn:
Observações:
```

Esse registro ajuda a criar rastreabilidade.

Depois, a validação pode ir para o diário de bordo.

---

## Maven ainda não precisa de projeto para `mvn -version`

O comando:

```powershell
mvn -version
```

pode ser executado em qualquer pasta.

Ele não precisa de `pom.xml`.

Isso é diferente de comandos como:

```bash
mvn compile
```

`mvn compile` precisa estar dentro de um projeto Maven, com `pom.xml`.

Então:

```text
mvn -version valida instalação;
mvn compile valida projeto Maven.
```

Não confunda.

Se você rodar `mvn compile` em uma pasta sem `pom.xml`, o Maven reclamará que não há projeto.

Isso não significa que Maven está mal instalado.

Significa que você está na pasta errada ou sem projeto Maven.

---

## Erro comum: `mvn` não é reconhecido

Mensagem típica:

```text
mvn não é reconhecido como um comando interno ou externo
```

Significa que o Windows não encontrou Maven no `PATH`.

Diagnóstico:

```powershell
where mvn
```

Se não encontrar, verifique:

```text
Maven foi extraído?
o caminho do bin está no PATH?
o terminal foi reaberto?
o caminho tem erro de digitação?
a pasta ainda existe?
```

Correção:

```text
adicionar C:\dev\tools\apache-maven-...\bin ao PATH;
abrir novo terminal;
rodar mvn -version.
```

---

## Erro comum: `JAVA_HOME` inválido

Maven pode reclamar de `JAVA_HOME`.

Exemplo conceitual:

```text
JAVA_HOME is set to an invalid directory
```

Causas comuns:

```text
JAVA_HOME aponta para pasta que não existe;
JAVA_HOME aponta para bin;
JDK foi movido;
JDK foi removido;
variável tem aspas indevidas;
variável aponta para JRE em vez de JDK.
```

Valide:

```powershell
echo $env:JAVA_HOME
ls $env:JAVA_HOME
ls $env:JAVA_HOME\bin
```

Você deve encontrar:

```text
java.exe;
javac.exe.
```

Se não encontrar `javac`, provavelmente não é um JDK válido.

---

## Erro comum: Maven usando Java errado

Você pode ter:

```text
java -version = 21
mvn -version = Java 17
```

ou o contrário.

Isso indica inconsistência.

Diagnóstico:

```powershell
where java
echo $env:JAVA_HOME
mvn -version
```

Possíveis causas:

```text
PATH aponta para Java diferente;
JAVA_HOME aponta para JDK antigo;
IntelliJ usa JDK diferente;
terminal não foi reaberto;
instalações múltiplas.
```

A correção depende do caso, mas o princípio é:

```text
alinhar JAVA_HOME, PATH, terminal e IDE.
```

---

## Erro comum: extrair Maven dentro de pasta duplicada

Às vezes, ao extrair ZIP, fica assim:

```text
C:\dev\tools\apache-maven-3.9.x\apache-maven-3.9.x\bin
```

A pessoa acha que o Maven está em uma pasta, mas o `bin` está mais fundo.

Diagnóstico:

```powershell
ls C:\dev\tools
ls C:\dev\tools\apache-maven-3.9.x
```

O caminho colocado no PATH precisa apontar para o `bin` real.

Se o `bin` não está no caminho esperado, ajuste.

---

## Erro comum: configurar `MAVEN_HOME` apontando para `bin`

Errado:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x\bin
PATH=%MAVEN_HOME%\bin
```

Isso vira:

```text
C:\dev\tools\apache-maven-3.9.x\bin\bin
```

Correto:

```text
MAVEN_HOME=C:\dev\tools\apache-maven-3.9.x
PATH=%MAVEN_HOME%\bin
```

Essa confusão é comum.

Sempre valide com:

```powershell
where mvn
```

---

## Erro comum: terminal aberto antes da configuração

Você configura PATH, mas o terminal aberto continua sem reconhecer.

Solução:

```text
fechar terminal;
abrir novamente;
rodar mvn -version.
```

Se for IntelliJ:

```text
fechar e abrir a IDE;
abrir novo terminal integrado.
```

Esse erro é simples, mas muito frequente.

---

## Erro comum: confundir Maven com projeto Maven

Maven instalado:

```powershell
mvn -version
```

Projeto Maven válido:

```text
tem pom.xml
```

São coisas diferentes.

Você pode ter Maven instalado e não estar dentro de um projeto Maven.

Nesse caso:

```bash
mvn compile
```

vai falhar por ausência de `pom.xml`.

Isso não é erro de instalação.

É erro de contexto.

---

## Atalhos úteis nesta aula

Como esta aula envolve validação no IntelliJ e terminal, estes atalhos ajudam:

| Ação | Atalho | Uso |
|---|---|---|
| Abrir terminal integrado | `Alt + F12` | Validar `mvn -version`, `java -version` e `where mvn` |
| Abrir Project | `Alt + 1` | Ver estrutura do projeto quando houver |
| Voltar ao editor | `Esc` | Sair do painel e voltar ao arquivo |
| Buscar ação | `Ctrl + Shift + A` | Procurar configurações ou ações da IDE |
| Search Everywhere | `Shift Shift` | Encontrar arquivos, ações e configurações |
| Settings | `Ctrl + Alt + S` | Abrir configurações da IDE |
| Buscar no arquivo | `Ctrl + F` | Procurar termos em anotações |
| Buscar no projeto | `Ctrl + Shift + F` | Procurar `Maven`, `JAVA_HOME`, `pom.xml` |
| Recent Files | `Ctrl + E` | Alternar entre arquivos recentes |
| Reformatar | `Ctrl + Alt + L` | Organizar Markdown, XML ou Java |
| Commit | `Ctrl + K` | Abrir tela de commit |
| Push | `Ctrl + Shift + K` | Enviar commits |

Observação:

```text
atalhos podem variar conforme sistema operacional, teclado e keymap.
```

Se algum atalho não funcionar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

Registre atalhos úteis em:

```text
docs/atalhos.md
```

---

## Exemplo aplicado ao domínio corporativo

Imagine que você entrou em um time backend Java.

O repositório usa Maven.

O README diz:

```bash
mvn clean test
```

Mas na sua máquina aparece:

```text
mvn não é reconhecido
```

Isso não é problema do projeto.

É problema do ambiente local.

Agora imagine outro cenário.

`mvn -version` funciona, mas mostra Java 11.

O projeto exige Java 21.

O erro futuro pode aparecer como:

```text
release version 21 not supported
```

Esse problema também não é regra de negócio.

É ambiente.

Por isso, antes de mexer em código corporativo, um desenvolvedor profissional valida:

```text
Java;
Maven;
JAVA_HOME;
PATH;
IDE;
terminal;
comando de build.
```

Isso evita perder tempo procurando bug no sistema quando o problema é ferramenta.

---

## Maven e proxy corporativo

Em empresas, Maven pode precisar passar por proxy ou repositório interno.

Sintomas:

```text
Maven instalado;
mvn -version funciona;
mas mvn compile não baixa dependências.
```

Possíveis causas:

```text
sem acesso à internet;
proxy corporativo;
certificado;
repositório interno obrigatório;
settings.xml necessário.
```

Nesta aula, não vamos configurar proxy.

Mas é importante saber:

```text
mvn -version valida instalação;
baixar dependência valida acesso a repositório.
```

São diagnósticos diferentes.

Configurações avançadas ficam para módulos futuros.

---

## O que é `settings.xml`

Maven pode usar um arquivo chamado:

```text
settings.xml
```

Ele pode ficar em:

```text
C:\Users\usuario\.m2\settings.xml
```

Esse arquivo pode configurar:

```text
mirrors;
proxies;
servidores;
credenciais;
perfis;
repositórios internos.
```

No começo da formação, não mexa nele sem necessidade.

Em empresa, pode ser fornecido pelo time ou pela área de infraestrutura.

Atenção:

```text
settings.xml pode conter credenciais.
```

Não envie esse arquivo para repositório público.

Não cole conteúdo sensível em ferramentas externas.

Não versionar credenciais.

---

## Diferença entre Maven instalado e Maven Wrapper

Existe também Maven Wrapper, que permite executar Maven por arquivos do projeto, como:

```text
mvnw
mvnw.cmd
.mvn/wrapper
```

No Windows, seria:

```powershell
.\mvnw.cmd -version
```

ou, dependendo do contexto:

```powershell
.\mvnw -version
```

O wrapper ajuda a padronizar a versão do Maven por projeto.

Nesta aula, o foco é instalar Maven no sistema.

Mas, ao encontrar um projeto com Maven Wrapper, a regra é:

```text
prefira usar o wrapper do projeto quando ele existir.
```

Esse assunto será retomado em build profissional.

---

## Criando documentação de ambiente

Crie ou atualize:

```text
docs/ambiente.md
```

Modelo:

```markdown
# Ambiente de desenvolvimento

## Java

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
```

## Maven

```powershell
mvn -version
where mvn
```

## IntelliJ

- Validar Project SDK.
- Validar terminal integrado com `mvn -version`.
- Fechar e abrir IDE após alterações em variáveis de ambiente.

## Observações

- Maven foi instalado em `C:\dev\tools`.
- `MAVEN_HOME` aponta para a raiz do Maven.
- `%MAVEN_HOME%\bin` foi adicionado ao PATH.
```

Não coloque informações sensíveis.

Não coloque credenciais.

O objetivo é registrar procedimento, não expor ambiente privado.

---

## Checklist de validação

Use este checklist:

```markdown
# Checklist — Maven instalado

- [ ] `java -version` funciona.
- [ ] `javac -version` funciona.
- [ ] `JAVA_HOME` aponta para a raiz do JDK.
- [ ] `where java` aponta para caminho esperado.
- [ ] `where javac` aponta para caminho esperado.
- [ ] Maven foi extraído para pasta estável.
- [ ] `MAVEN_HOME` aponta para a raiz do Maven.
- [ ] `PATH` contém o `bin` do Maven.
- [ ] Novo terminal foi aberto após configurar variáveis.
- [ ] `mvn -version` funciona.
- [ ] `mvn -version` mostra Java correto.
- [ ] `where mvn` aponta para Maven esperado.
- [ ] Terminal integrado do IntelliJ reconhece `mvn`.
- [ ] IntelliJ foi reiniciado após configuração, se necessário.
```

Checklist reduz erro.

Em ambiente profissional, checklist é uma ferramenta de qualidade.

---

## Prática recomendada

Execute e registre:

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
mvn -version
where mvn
```

Depois abra o IntelliJ e execute no terminal integrado:

```powershell
mvn -version
where mvn
```

Crie ou atualize:

```text
docs/ambiente.md
docs/diario-de-bordo.md
docs/atalhos.md
```

Depois valide Git:

```bash
git status
git diff
git add docs/ambiente.md docs/diario-de-bordo.md docs/atalhos.md
git diff --staged
git commit -m "Documenta validacao inicial do Maven"
git status
```

Se ainda não houver repositório Git para esse material, apenas registre a prática no diário.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 015 — Maven: instalação e validação inicial

### O que aprendi
Aprendi que Maven precisa ser instalado, configurado no PATH e validado com `mvn -version`. Também entendi que o Maven depende do Java e que preciso conferir se ele está usando o JDK correto.

### O que pratiquei
Validei Java, `JAVA_HOME`, Maven, `where mvn` e terminal integrado do IntelliJ.

### Comandos usados
```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
mvn -version
where mvn
```

### Arquivos criados ou alterados
- `docs/ambiente.md`
- `docs/diario-de-bordo.md`
- `docs/atalhos.md`

### Atalhos úteis
- `Alt + F12` — abrir terminal integrado.
- `Ctrl + Alt + S` — abrir configurações do IntelliJ.
- `Ctrl + Shift + A` — buscar ações da IDE.
- `Shift Shift` — Search Everywhere.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- configurar `MAVEN_HOME` apontando para `bin`;
- esquecer de adicionar o `bin` do Maven ao PATH;
- não abrir novo terminal depois de alterar variável;
- Maven usando Java diferente do esperado;
- confundir Maven instalado com projeto Maven;
- commitar arquivos com credenciais;
- mexer em `settings.xml` sem entender.

### Próximo passo
Preparar PostgreSQL e DBeaver para os módulos que envolverão banco de dados.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é Maven em nível inicial;
explicar que Maven depende de Java;
validar java -version;
validar javac -version;
explicar JAVA_HOME;
explicar PATH;
baixar Maven de fonte oficial;
extrair Maven em pasta estável;
configurar MAVEN_HOME corretamente;
adicionar bin do Maven ao PATH;
abrir novo terminal após configurar variáveis;
rodar mvn -version;
interpretar Java version e Java home no mvn -version;
rodar where mvn;
validar Maven no terminal integrado do IntelliJ;
diferenciar Maven instalado de projeto Maven;
entender que mvn -version não exige pom.xml;
entender que mvn compile exige projeto Maven;
registrar validação no diário de bordo;
registrar atalhos úteis;
evitar expor settings.xml ou credenciais.
```

Não precisa ainda criar `pom.xml`.

Não precisa ainda compilar projeto Maven.

A aula termina quando a instalação e a validação inicial estão confiáveis.

---

## Fechamento da aula

Maven é uma peça importante do ecossistema Java Backend.

Mas antes de usar Maven em projeto, você precisa garantir que ele está instalado e alinhado com o JDK.

A validação correta evita muitos problemas futuros.

A sequência desta aula foi:

```text
validar Java;
entender JAVA_HOME;
entender PATH;
instalar Maven;
configurar Maven;
validar mvn -version;
validar where mvn;
validar terminal do IntelliJ;
registrar no diário.
```

Isso cria base para as próximas etapas.

Na próxima aula, vamos preparar ferramentas de banco de dados:

```text
PostgreSQL;
DBeaver;
conexão local;
validação inicial;
cuidados com credenciais;
organização para estudos futuros.
```

Ainda não estamos entrando em banco profundamente.

Estamos preparando o ambiente para quando o backend começar a persistir dados de verdade.
