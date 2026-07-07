# 012 — M0.12 — Markdown para Documentação Técnica

## Onde estamos na formação

Até aqui, a formação já construiu uma base operacional importante:

```text
mapa da formação;
diagnóstico inicial;
organização do Windows;
terminal e PowerShell;
JDK, JRE e JVM;
compilação manual com javac;
IntelliJ IDEA Community;
debug inicial;
Git instalado e configurado;
Git local;
GitHub e repositório remoto.
```

Agora entramos em documentação técnica.

Isso não é um assunto secundário.

Um desenvolvedor backend não trabalha apenas escrevendo código.

Ele também precisa comunicar:

```text
como rodar um projeto;
qual problema foi resolvido;
qual regra foi implementada;
como uma API funciona;
qual decisão técnica foi tomada;
quais comandos devem ser executados;
como reproduzir um erro;
como validar uma entrega;
como operar uma aplicação;
como outro desenvolvedor deve continuar o trabalho.
```

Markdown é uma das ferramentas mais simples e mais usadas para isso.

Nesta formação, Markdown será usado em:

```text
README.md;
diário de bordo;
atalhos;
checklists;
anotações técnicas;
documentação de APIs;
documentação de arquitetura;
decisões técnicas;
roteiros de execução;
evidências de aprendizado.
```

Então, aprender Markdown agora prepara o restante da formação.

---

## Hoje a aula é sobre escrever documentação que ajuda

Documentação ruim atrapalha.

Documentação boa economiza tempo.

Um README bem feito pode evitar várias perguntas.

Um diário de bordo bem feito ajuda a revisar.

Um checklist bem feito reduz erro operacional.

Uma decisão técnica bem escrita evita discussão repetida.

Uma documentação de API bem organizada ajuda outro time a integrar.

Markdown entra nesse ponto porque permite escrever texto estruturado de forma simples.

Não precisa de editor pesado.

Não precisa de formatação complexa.

Não precisa de ferramenta proprietária.

Um arquivo `.md` é texto puro.

Mas, quando renderizado, vira documentação legível.

Exemplo:

```markdown
# Título

## Subtítulo

Texto explicando o projeto.

```bash
mvn test
```
```

Quando visualizado no GitHub, no IntelliJ ou em outras ferramentas, isso aparece formatado.

Markdown é simples, mas muito poderoso.

---

## O que é Markdown

Markdown é uma sintaxe leve para formatar texto.

Ela permite escrever documentos com:

```text
títulos;
subtítulos;
listas;
negrito;
itálico;
links;
imagens;
código;
tabelas;
citações;
checklists.
```

O arquivo geralmente termina com:

```text
.md
```

Exemplos:

```text
README.md
diario-de-bordo.md
atalhos.md
decisoes-tecnicas.md
api.md
```

A principal vantagem é que Markdown continua legível mesmo sem renderização.

Ou seja, se você abrir o arquivo em qualquer editor de texto, ainda consegue entender.

Isso é excelente para projetos versionados em Git.

---

## Markdown e Git combinam muito bem

Markdown combina com Git porque é texto puro.

Git trabalha muito bem com texto.

Quando um arquivo Markdown muda, o Git consegue mostrar diferença linha por linha.

Exemplo:

```bash
git diff README.md
```

Você consegue ver:

```text
linha adicionada;
linha removida;
trecho alterado.
```

Isso é muito melhor do que versionar um documento binário para anotações simples.

Arquivos como `.docx` podem ser úteis em contextos específicos.

Mas para documentação técnica de projeto, Markdown costuma ser mais prático.

Por isso, muitos projetos usam Markdown para:

```text
README;
CONTRIBUTING;
CHANGELOG;
documentação interna;
ADRs;
issues;
pull requests;
wikis.
```

---

## Markdown não é enfeite

Um erro comum é achar que Markdown é só “deixar bonito”.

Não é.

Markdown serve para estruturar pensamento.

Quando você escreve:

```markdown
## Problema
```

está separando o problema.

Quando escreve:

```markdown
## Solução
```

está separando a solução.

Quando escreve:

```markdown
## Como executar
```

está separando instrução operacional.

Quando escreve:

```markdown
## Critérios de validação
```

está separando como saber se algo está correto.

Isso muda a qualidade da comunicação.

Markdown não é só visual.

Markdown é organização técnica.

---

## Estrutura básica de um documento técnico

Um documento técnico simples pode ter:

```markdown
# Título principal

## Objetivo

## Contexto

## Como executar

## Exemplos

## Erros comuns

## Critério de validação
```

Essa estrutura já resolve muitos casos.

Mas a estrutura deve servir ao conteúdo.

Não adianta criar seções vazias só para parecer completo.

Documentação boa tem intenção.

Pergunte:

```text
quem vai ler?
para quê?
qual dúvida essa pessoa precisa resolver?
qual ação ela precisa executar?
qual erro preciso evitar?
```

Depois escreva.

---

## Títulos

Títulos em Markdown usam `#`.

Exemplo:

```markdown
# Título principal
## Seção
### Subseção
#### Detalhe
```

Regra prática:

```text
# para o título do documento;
## para seções principais;
### para subseções;
#### somente quando realmente necessário.
```

Evite pular níveis sem motivo.

Ruim:

```markdown
# Projeto
#### Como rodar
```

Melhor:

```markdown
# Projeto
## Como rodar
```

Títulos organizam o documento e ajudam navegação.

No GitHub, em muitos visualizadores, os títulos também geram estrutura lateral ou links internos.

---

## Parágrafos

Markdown não exige sintaxe especial para parágrafo.

Basta escrever texto.

Exemplo:

```markdown
Este projeto é um laboratório de estudos Java.

Ele contém exemplos pequenos, documentação e registros de evolução.
```

Use parágrafos curtos.

Documentação técnica com parágrafos enormes fica cansativa.

Uma ideia por parágrafo costuma funcionar bem.

---

## Negrito e itálico

Negrito:

```markdown
**importante**
```

Resultado:

```text
importante em destaque
```

Itálico:

```markdown
*ênfase*
```

Use com moderação.

Em documentação técnica, exagerar em destaque deixa tudo com cara de urgente.

Se tudo está destacado, nada está destacado.

---

## Listas

Lista não ordenada:

```markdown
- Java
- Git
- Maven
- Spring Boot
```

Lista ordenada:

```markdown
1. Instalar o JDK.
2. Configurar o IntelliJ.
3. Criar o projeto.
4. Executar o programa.
```

Use lista quando a ordem ou agrupamento importa.

Evite transformar todo o documento em lista.

Texto explica.

Lista organiza.

Os dois se complementam.

---

## Checklists

Checklist em Markdown:

```markdown
- [ ] Instalar JDK
- [ ] Validar java -version
- [ ] Validar javac -version
- [ ] Criar projeto no IntelliJ
- [ ] Rodar primeiro Main.java
```

Quando concluído:

```markdown
- [x] Instalar JDK
- [x] Validar java -version
```

Checklists são úteis para:

```text
setup de ambiente;
validação de entrega;
roteiro de deploy;
pré-requisitos;
tarefas de estudo;
critérios de aceite.
```

Em GitHub, checklists podem ficar interativos em issues e pull requests.

---

## Código inline

Quando quiser mencionar um comando, arquivo, classe ou palavra técnica no meio do texto, use crase simples.

Exemplo:

```markdown
Execute `git status` antes de criar o commit.
```

Outros exemplos:

```markdown
O arquivo `README.md` deve ficar na raiz do projeto.
A classe `Main` possui o método `main`.
A pasta `src` guarda código-fonte.
```

Código inline melhora leitura porque separa termos técnicos do texto comum.

---

## Blocos de código

Para comandos ou trechos maiores, use três crases.

Exemplo:

````markdown
```bash
git status
git add .
git commit -m "Adiciona README inicial"
```
````

Para Java:

````markdown
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Markdown");
    }
}
```
````

Para PowerShell:

````markdown
```powershell
cd C:\dev\projects
ls
```
````

A palavra depois das três crases indica a linguagem.

Isso ajuda o renderizador a aplicar destaque de sintaxe.

Use a linguagem correta sempre que possível:

```text
java;
bash;
powershell;
sql;
json;
yaml;
xml;
markdown;
text.
```

---

## Diferença entre `bash` e `powershell`

Em documentação técnica, comandos precisam ser claros.

Se o ambiente é Windows PowerShell, prefira:

````markdown
```powershell
cd C:\dev\projects
ls
```
````

Se o comando é genérico de Git e funciona em vários shells, pode usar:

````markdown
```bash
git status
git add .
git commit -m "Mensagem"
```
````

Mas cuidado com comandos específicos de Linux.

Não documente:

```bash
rm -rf pasta
```

para alguém no Windows sem explicar.

Nesta formação, quando o comando for de PowerShell, marque como `powershell`.

Quando for comando Git genérico, `bash` pode aparecer, mas o contexto precisa estar claro.

---

## Links

Link em Markdown:

```markdown
[Texto do link](https://exemplo.com)
```

Exemplo:

```markdown
[Documentação oficial do Java](https://docs.oracle.com/en/java/)
```

Mas em documentação interna, nem todo link precisa apontar para a internet.

Pode apontar para arquivos do próprio repositório:

```markdown
[Diário de bordo](docs/diario-de-bordo.md)
```

Ou:

```markdown
[Guia de Git](docs/git.md)
```

Links internos ajudam a navegar pelo projeto.

Mas cuidado com links quebrados.

Se mover arquivo, atualize o link.

---

## Imagens

Imagem em Markdown:

```markdown
![Texto alternativo](caminho/da/imagem.png)
```

Exemplo:

```markdown
![Fluxo da aplicação](docs/imagens/fluxo-aplicacao.png)
```

O texto alternativo importa.

Ele ajuda acessibilidade e entendimento quando a imagem não carrega.

Em documentação técnica, imagens devem complementar o texto.

Não use imagem para substituir completamente explicação essencial.

Se a imagem quebrar, a documentação não pode ficar inútil.

---

## Tabelas

Tabela em Markdown:

```markdown
| Comando | Função |
|---|---|
| `git status` | Mostra o estado do repositório |
| `git add` | Prepara mudanças para commit |
| `git commit` | Cria um ponto no histórico |
```

Tabelas são boas para comparação.

Use quando houver colunas claras.

Evite tabelas enormes em Markdown se elas ficarem difíceis de manter.

Em documentação técnica, uma tabela pequena pode ser excelente.

---

## Citações

Citação em Markdown:

```markdown
> Debug troca chute por evidência.
```

Use para destacar uma frase importante.

Não exagere.

Citação demais perde força.

---

## Linha horizontal

Linha horizontal:

```markdown
---
```

Use para separar blocos grandes.

Mas, se o documento já está bem estruturado com títulos, muitas linhas horizontais podem ser desnecessárias.

---

## Escapando caracteres

Às vezes você quer mostrar um caractere que o Markdown interpretaria.

Exemplo: mostrar asterisco.

Pode usar barra invertida:

```markdown
\*texto\*
```

Ou colocar dentro de bloco de código:

```markdown
`*texto*`
```

Na prática, para termos técnicos, usar crase costuma resolver.

---

## Exemplo mínimo: criando um README

Crie ou abra:

```text
README.md
```

Conteúdo:

````markdown
# Formação Java Backend

Repositório de estudos, práticas e evolução técnica em Java Backend.

## Objetivo

Registrar a evolução dos estudos, exemplos de código, documentação técnica e práticas realizadas ao longo da formação.

## Estrutura

- `docs`: documentação, diário de bordo e anotações técnicas.
- `src`: código-fonte dos exemplos e projetos.
- `labs`: laboratórios preservados para estudo.

## Como validar o ambiente Java

```powershell
java -version
javac -version
```

## Como verificar o Git

```bash
git status
git log --oneline
```

## Checklist inicial

- [ ] JDK instalado
- [ ] IntelliJ configurado
- [ ] Git configurado
- [ ] Repositório local criado
- [ ] Repositório remoto conectado
````

Esse README já tem:

```text
título;
objetivo;
estrutura;
comandos;
checklist;
código inline;
blocos de código.
```

É simples, mas útil.

---

## Exemplo aplicado: diário de bordo

O diário de bordo registra aprendizado.

Arquivo:

```text
docs/diario-de-bordo.md
```

Exemplo:

````markdown
# Diário de bordo

## Aula 012 — Markdown para documentação técnica

### O que aprendi

Aprendi que Markdown é uma forma simples de escrever documentação técnica versionável em Git.

### Conceitos principais

- Títulos com `#`
- Listas com `-`
- Código inline com crase
- Blocos de código com três crases
- Tabelas
- Checklists
- Links internos

### Comandos usados

```bash
git status
git add README.md docs/diario-de-bordo.md
git commit -m "Documenta aprendizado sobre Markdown"
```

### Dúvidas

-
````

Esse formato transforma aula em registro revisável.

Mais tarde, o diário ajuda a relembrar o caminho.

---

## Exemplo aplicado: documentação de comando

Um arquivo técnico pode registrar comandos recorrentes.

Arquivo:

```text
docs/comandos.md
```

Exemplo:

````markdown
# Comandos úteis

## Terminal

| Comando | Uso |
|---|---|
| `pwd` | Mostra a pasta atual |
| `ls` | Lista arquivos e pastas |
| `cd` | Entra em uma pasta |
| `mkdir` | Cria pasta |

## Java

```powershell
java -version
javac -version
```

## Git

```bash
git status
git add .
git commit -m "Mensagem clara"
git log --oneline
```
````

Isso evita depender de memória.

Documentação técnica também serve para criar repertório.

---

## Exemplo aplicado ao backend corporativo

Imagine uma API corporativa.

Um README ruim:

```markdown
# api

rodar projeto
```

Isso não ajuda.

Um README melhor:

````markdown
# API de Pedidos

## Objetivo

API responsável pelo cadastro, consulta e atualização de pedidos.

## Pré-requisitos

- JDK 21
- Maven 3.9+
- PostgreSQL
- Docker

## Como rodar localmente

```bash
mvn clean test
mvn spring-boot:run
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DB_HOST` | Sim | Host do banco de dados |
| `DB_PORT` | Sim | Porta do banco de dados |
| `DB_NAME` | Sim | Nome do banco |

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/pedidos` | Cria um pedido |
| `GET` | `/pedidos/{id}` | Consulta um pedido por ID |

## Testes

```bash
mvn test
```

## Observações

Não versionar arquivos `.env` com credenciais reais.
````

Perceba a diferença.

O segundo README ajuda alguém a trabalhar.

Documentação boa reduz dependência de explicação oral.

---

## Markdown para decisões técnicas

Mais tarde, quando estudarmos arquitetura, usaremos documentos de decisão.

Um formato comum é ADR:

```text
Architecture Decision Record
```

Exemplo simplificado:

```markdown
# ADR 001 — Uso de PostgreSQL como banco relacional

## Status

Aceita

## Contexto

O sistema precisa persistir dados relacionais com integridade transacional.

## Decisão

Usar PostgreSQL como banco principal.

## Consequências

- Permite transações ACID.
- Suporta índices e consultas relacionais complexas.
- Exige cuidado com migrações de schema.
```

Isso mostra que Markdown acompanha não só estudo, mas arquitetura.

Decisão não registrada vira memória perdida.

---

## Markdown para checklist de validação

Backend muitas vezes precisa de checklist.

Exemplo:

```markdown
# Checklist de validação — Cadastro de pedido

- [ ] Deve criar pedido com dados válidos.
- [ ] Deve rejeitar pedido sem cliente.
- [ ] Deve rejeitar pedido sem item.
- [ ] Deve calcular total corretamente.
- [ ] Deve registrar data de criação.
- [ ] Deve retornar `201 Created` na criação.
- [ ] Deve retornar `400 Bad Request` para entrada inválida.
- [ ] Deve gerar log de erro quando ocorrer falha inesperada.
```

Isso conecta documentação com qualidade.

Checklist não substitui teste automatizado.

Mas ajuda a orientar validação manual e raciocínio.

---

## Markdown para documentação de API

Antes de usar ferramentas como OpenAPI/Swagger, é útil saber escrever uma documentação simples.

Exemplo:

````markdown
# Criar pedido

## Endpoint

`POST /pedidos`

## Request

```json
{
  "clienteId": 10,
  "itens": [
    {
      "produtoId": 100,
      "quantidade": 2
    }
  ]
}
```

## Response `201 Created`

```json
{
  "id": 1,
  "status": "CRIADO",
  "total": 200.00
}
```

## Regras

- Cliente deve existir.
- Pedido deve ter ao menos um item.
- Quantidade deve ser maior que zero.
````

Esse tipo de documentação ajuda a pensar contrato.

Mais tarde, isso conversa com REST, OpenAPI e testes de contrato.

---

## Markdown e qualidade de escrita

Boa documentação técnica precisa de clareza.

Algumas regras ajudam:

```text
use títulos objetivos;
evite parágrafos gigantes;
explique comandos antes ou depois do bloco;
não misture assuntos demais;
não deixe seção vazia sem motivo;
não use termos vagos como “coisas” ou “ajustes”;
não escreva como se só você fosse ler;
não esconda pré-requisito;
não documente comando que você não testou;
não coloque segredo.
```

Escrever bem é uma habilidade técnica.

Um backend que escreve bem reduz ruído no time.

---

## Atalhos e ações úteis para Markdown no IntelliJ

Sempre que uma ferramenta ajudar de verdade, registre no arquivo:

```text
docs/atalhos.md
```

Para Markdown, algumas ações úteis no IntelliJ são:

```markdown
# Atalhos e ações — Markdown

| Ação | Como usar | Quando usar |
|---|---|---|
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE pelo nome |
| Reformatar arquivo | `Ctrl + Alt + L` | Ajustar formatação do documento/código |
| Preview do Markdown | Procurar por `Preview` ou abrir a visualização do `.md` | Conferir como o Markdown será renderizado |
| Alternar foco entre editor e painéis | `Alt + 1` para Project, `Esc` para voltar ao editor | Navegar sem depender só do mouse |
| Abrir terminal integrado | `Alt + F12` | Rodar Git, Java e comandos do projeto |
| Buscar em arquivos | `Ctrl + Shift + F` | Encontrar termos em documentos e código |
| Renomear arquivo com segurança | `Shift + F6` | Renomear documentos mantendo referências quando suportado |
```

Observação importante:

```text
atalhos podem variar conforme sistema operacional, keymap e configuração da IDE.
```

Se algum atalho não funcionar, use:

```text
Ctrl + Shift + A
```

e pesquise pelo nome da ação.

Esse é um dos atalhos mais importantes porque permite encontrar comandos sem decorar tudo.

A ideia não é decorar uma lista enorme.

A ideia é construir repertório útil aos poucos.

---

## Como registrar atalhos sem bagunçar

Não crie um arquivo gigante e desorganizado.

Use seções.

Exemplo:

```markdown
# Atalhos

## IntelliJ

| Ação | Atalho | Observação |
|---|---|---|
| Buscar ação | `Ctrl + Shift + A` | Ajuda quando não sei o atalho |
| Reformatar código | `Ctrl + Alt + L` | Usar antes de commit |
| Terminal integrado | `Alt + F12` | Abrir terminal na IDE |

## Terminal

| Ação | Comando | Observação |
|---|---|---|
| Ver pasta atual | `pwd` | Usar antes de comando importante |
| Listar arquivos | `ls` | Confirmar arquivos da pasta |

## Git

| Ação | Comando | Observação |
|---|---|---|
| Ver estado | `git status` | Usar sempre |
| Ver histórico curto | `git log --oneline` | Revisar commits |
```

Atalho também é conhecimento operacional.

Registrar evita reaprender toda hora.

---

## Erros comuns

### Erro 1 — Usar título sem hierarquia

Ruim:

```markdown
# Projeto
### Como rodar
## Objetivo
#### Testes
```

Melhor:

```markdown
# Projeto
## Objetivo
## Como rodar
## Testes
```

Hierarquia ajuda leitura.

---

### Erro 2 — Colar comando sem bloco de código

Ruim:

```markdown
Rode git status git add . git commit -m "teste"
```

Melhor:

````markdown
```bash
git status
git add .
git commit -m "Mensagem clara"
```
````

Bloco de código evita confusão.

---

### Erro 3 — Não informar linguagem no bloco

Funciona:

````markdown
```
git status
```
````

Melhor:

````markdown
```bash
git status
```
````

Informar linguagem melhora renderização.

---

### Erro 4 — Escrever README sem objetivo

Um README precisa responder:

```text
o que é isso?
para que serve?
como rodar?
como testar?
qual estrutura?
quais cuidados?
```

Não precisa responder tudo desde o primeiro dia.

Mas precisa ter utilidade.

---

### Erro 5 — Documentar comando não testado

Se você documenta um comando errado, espalha erro.

Antes de registrar, teste quando possível.

---

### Erro 6 — Colocar segredo no Markdown

Nunca coloque:

```text
senha;
token;
chave;
credencial;
dados reais sensíveis.
```

Nem em README.

Nem em diário.

Nem em exemplo.

Use placeholders.

---

### Erro 7 — Fazer documentação grande demais e inútil

Documentação enorme, sem estrutura, não ajuda.

Melhor um documento menor e claro do que uma parede de texto desorganizada.

---

### Erro 8 — Não atualizar documentação quando o projeto muda

Documentação desatualizada pode ser pior do que ausência de documentação.

Se mudar comando, porta, versão ou fluxo, atualize o Markdown.

---

### Erro 9 — Usar imagem no lugar de texto essencial

Imagem ajuda, mas texto precisa explicar.

Se a imagem quebrar, o leitor ainda deve entender o principal.

---

### Erro 10 — Não versionar documentação

Documentação técnica do projeto deve ir para o Git quando fizer parte do projeto.

Se o README muda, commit.

Se o diário muda, commit.

Se a decisão técnica muda, commit.

---

## Diagnóstico de documentação ruim

Quando um documento parecer ruim, pergunte:

```text
O título diz claramente o assunto?
O objetivo está explícito?
A pessoa sabe o que fazer depois de ler?
Os comandos estão em blocos de código?
Há pré-requisitos?
Há exemplos?
Há alertas de erro comum?
Há informação sensível?
O documento está atualizado?
O texto está dividido em seções?
```

Se muitas respostas forem “não”, o documento precisa melhorar.

---

## Prática recomendada

Crie ou atualize três arquivos.

### 1. `README.md`

Use a estrutura:

````markdown
# Formação Java Backend

Repositório de estudos, práticas e evolução técnica em Java Backend.

## Objetivo

Registrar a evolução dos estudos, exemplos de código, documentação técnica e práticas realizadas ao longo da formação.

## Estrutura

- `docs`: documentação, diário de bordo e anotações técnicas.
- `src`: código-fonte dos exemplos e projetos.
- `labs`: laboratórios preservados para estudo.

## Ambiente

```powershell
java -version
javac -version
git --version
```

## Git

```bash
git status
git log --oneline
```
````

### 2. `docs/atalhos.md`

Use:

```markdown
# Atalhos

## IntelliJ

| Ação | Atalho | Observação |
|---|---|---|
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Reformatar | `Ctrl + Alt + L` | Ajustar formatação |
| Terminal integrado | `Alt + F12` | Abrir terminal |
| Project | `Alt + 1` | Abrir painel de projeto |

## Git

| Ação | Comando |
|---|---|
| Ver estado | `git status` |
| Ver histórico curto | `git log --oneline` |
```

### 3. `docs/diario-de-bordo.md`

Registre a aula atual.

Depois use Git:

```bash
git status
git diff
git add README.md docs/atalhos.md docs/diario-de-bordo.md
git commit -m "Documenta base de Markdown tecnico"
git status
```

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 012 — Markdown para documentação técnica

## O que aprendi
Aprendi que Markdown é uma sintaxe simples para escrever documentação técnica versionável em Git.

## Conceitos principais
- Títulos
- Parágrafos
- Listas
- Checklists
- Código inline
- Blocos de código
- Links
- Imagens
- Tabelas
- Citações

## Arquivos criados ou atualizados
- README.md
- docs/atalhos.md
- docs/diario-de-bordo.md

## Atalhos úteis
- Buscar ação: Ctrl + Shift + A
- Reformatar: Ctrl + Alt + L
- Terminal integrado: Alt + F12
- Painel Project: Alt + 1

## Erros que quero evitar
- README sem objetivo;
- comando fora de bloco de código;
- bloco de código sem linguagem;
- documentação desatualizada;
- segredo em arquivo Markdown;
- títulos sem hierarquia.

## Frase principal
Markdown não é enfeite. Markdown organiza comunicação técnica.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é Markdown;
explicar por que Markdown combina com Git;
criar títulos com #;
criar listas;
criar checklists;
usar negrito e itálico com moderação;
usar código inline;
criar blocos de código com linguagem;
criar links;
inserir imagens com texto alternativo;
criar tabelas simples;
escrever um README básico;
registrar diário de bordo;
documentar atalhos úteis;
evitar segredos em Markdown;
entender que documentação técnica deve ajudar alguém a agir;
relacionar Markdown com README, APIs, checklists, decisões técnicas e arquitetura.
```

Não precisa dominar toda variação de Markdown.

Precisa dominar o suficiente para escrever documentação clara, versionável e útil.

---

## Fechamento da aula

Markdown é uma ferramenta pequena com impacto grande.

Ele ajuda a transformar conhecimento em documentação.

E documentação é parte do trabalho técnico.

Um backend forte não entrega apenas código.

Entrega entendimento.

Entrega instrução.

Entrega rastreabilidade.

Entrega clareza para a próxima pessoa.

Às vezes, a próxima pessoa será alguém do time.

Às vezes, será você mesmo daqui a três meses.

Na próxima aula, vamos organizar o diário de bordo, anotações e revisões da formação.

Isso vai transformar Markdown em rotina real de aprendizado, não apenas em sintaxe.
