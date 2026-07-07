# 013 — M0.13 — Diário de Bordo e Rastreabilidade do Aprendizado

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.13.01` — Diário de bordo e rastreabilidade do aprendizado — Conceito, por que existe e vocabulário essencial.
- `M0.13.02` — Diário de bordo e rastreabilidade do aprendizado — Exemplo mínimo digitado do zero.
- `M0.13.03` — Diário de bordo e rastreabilidade do aprendizado — Exemplo aplicado ao domínio corporativo.
- `M0.13.04` — Diário de bordo e rastreabilidade do aprendizado — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para transformar o diário de bordo em uma ferramenta real de revisão, rastreabilidade, evolução técnica e prova de aprendizado.

---

## Onde estamos na formação

Até aqui, a formação já construiu uma base operacional:

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
GitHub e repositório remoto;
Markdown para documentação técnica.
```

Agora vamos juntar três coisas:

```text
Markdown;
Git;
aprendizado.
```

Essa junção vira diário de bordo.

O diário de bordo não é um caderno bonito.

Também não é uma obrigação burocrática.

Ele é uma ferramenta de engenharia pessoal.

Ele responde:

```text
o que foi estudado?
quando foi estudado?
qual prática foi feita?
qual erro apareceu?
qual decisão foi tomada?
qual comando foi usado?
qual evidência prova que houve avanço?
qual dúvida ficou aberta?
o que precisa ser revisado?
```

Sem diário, muito aprendizado se perde.

Com diário, a formação deixa trilha.

---

## Hoje a aula é sobre não deixar o aprendizado desaparecer

Um erro comum em estudo técnico é consumir conteúdo e não registrar nada.

A pessoa assiste aula.

Faz um exemplo.

Entende na hora.

No dia seguinte, esquece metade.

Uma semana depois, não lembra o comando.

Um mês depois, não sabe explicar o que aprendeu.

Isso acontece porque entendimento momentâneo não é a mesma coisa que retenção.

Aprender bem exige:

```text
atenção;
prática;
erro;
correção;
registro;
revisão;
explicação.
```

O diário de bordo entra no registro e na revisão.

Ele ajuda a transformar aula em memória técnica.

---

## O que é diário de bordo

Diário de bordo é um registro cronológico da evolução.

Na formação, ele deve registrar:

```text
aula estudada;
conceitos aprendidos;
comandos usados;
códigos criados;
erros encontrados;
soluções aplicadas;
atalhos úteis;
decisões tomadas;
dúvidas abertas;
próximo passo.
```

A palavra mais importante é:

```text
cronológico
```

O diário mostra o caminho.

Não é apenas um resumo final.

Ele registra a caminhada.

Exemplo:

```markdown
## Aula 008 — Debug inicial no IntelliJ

Aprendi que debug troca chute por evidência. Usei breakpoint, Step Over, Step Into e observei variáveis durante a execução.
```

Isso parece simples.

Mas, acumulado ao longo de meses, vira um mapa da evolução.

---

## Diário de bordo não é apostila

A apostila ensina o conteúdo.

O diário registra o que aconteceu com você durante o aprendizado.

Não copie a aula inteira para o diário.

Isso cria volume morto.

O diário deve responder:

```text
o que eu entendi?
o que pratiquei?
onde errei?
como resolvi?
o que preciso revisar?
```

Aula e diário têm papéis diferentes.

```text
Aula = conteúdo estruturado.
Diário = evidência pessoal de aprendizado.
```

Se o diário vira cópia da aula, perde utilidade.

Se o diário vira anotação honesta, vira ferramenta de evolução.

---

## Diário de bordo e rastreabilidade

Rastreabilidade é a capacidade de reconstruir uma história técnica.

Em projeto corporativo, rastreabilidade responde:

```text
quem alterou?
quando alterou?
por que alterou?
qual regra foi afetada?
qual evidência validou?
qual commit registrou?
```

Na formação, a lógica é parecida:

```text
qual aula foi feita?
qual prática foi executada?
qual arquivo foi criado?
qual commit registrou?
qual erro foi resolvido?
qual dúvida ficou?
```

O diário de bordo conecta aprendizado com evidência.

E o Git registra essa evidência no histórico.

Exemplo:

```bash
git add docs/diario-de-bordo.md
git commit -m "Registra aprendizado sobre debug inicial"
```

Agora existe:

```text
registro no diário;
commit no Git;
histórico do aprendizado.
```

Isso é rastreabilidade.

---

## O que deve existir no repositório

Uma estrutura simples:

```text
docs
├── diario-de-bordo.md
├── atalhos.md
├── diagnostico-inicial.md
├── revisoes.md
└── decisoes.md
```

Cada arquivo tem um papel.

### `diario-de-bordo.md`

Registro cronológico das aulas e práticas.

### `atalhos.md`

Ações úteis do IntelliJ, terminal, Git e ferramentas.

### `diagnostico-inicial.md`

Ponto de partida da formação.

### `revisoes.md`

Revisões periódicas e pontos que precisam ser retomados.

### `decisoes.md`

Decisões técnicas tomadas ao longo do projeto.

No início, pode ser mais simples.

Mas essa separação evita bagunça.

---

## Diferença entre diário, anotação e revisão

Essas três coisas se parecem, mas não são iguais.

### Diário

Registra o que aconteceu.

Exemplo:

```markdown
Na aula de Git local, pratiquei git init, git status, git add e git commit.
```

### Anotação

Registra conhecimento específico.

Exemplo:

```markdown
`git add` prepara mudanças para o próximo commit. Ele não cria commit.
```

### Revisão

Retoma o que precisa ser lembrado.

Exemplo:

```markdown
Revisar diferença entre `git restore` e `git restore --staged`.
```

Os três se complementam.

O diário mostra a linha do tempo.

A anotação guarda explicações.

A revisão reforça memória.

---

## O problema do estudo sem rastreabilidade

Sem rastreabilidade, a pessoa não sabe medir evolução.

Ela pensa:

```text
estudei bastante
```

Mas não consegue responder:

```text
quais aulas concluí?
quais comandos sei usar?
quais exemplos escrevi?
quais erros resolvi?
qual commit prova essa evolução?
qual ponto ainda está fraco?
```

Isso gera sensação de esforço sem clareza.

Com rastreabilidade, a formação fica visível.

Exemplo:

```text
Aula 005 — JDK, JRE, JVM
Aula 006 — Compilação manual
Aula 007 — IntelliJ
Aula 008 — Debug
Aula 009 — Git configuração
Aula 010 — Git local
Aula 011 — GitHub remoto
Aula 012 — Markdown
```

A pessoa vê o caminho.

Isso ajuda motivação e revisão.

---

## O diário precisa ser simples

Um diário muito complicado morre.

Se cada aula exigir preencher um relatório enorme, ninguém mantém.

O modelo precisa ser prático.

Um bom bloco de diário pode ter:

```markdown
## Aula 013 — Diário de bordo e rastreabilidade do aprendizado

### O que aprendi
-

### O que pratiquei
-

### Arquivos criados ou alterados
-

### Comandos usados
-

### Erros ou dúvidas
-

### Atalhos úteis
-

### Próximo passo
-
```

Isso é suficiente.

Nem toda aula precisa preencher tudo com detalhe.

Mas toda aula concluída deve deixar registro.

---

## Modelo oficial recomendado para o diário

Use este modelo como base:

```markdown
# Diário de bordo

Registro cronológico da evolução na formação Java Backend.

---

## Aula 001 — Mapa da formação completa e níveis de carreira Java

### O que aprendi
Entendi que a formação não é apenas sobre aprender sintaxe Java, mas sobre construir base para backend profissional, engenharia e arquitetura.

### O que pratiquei
Registrei minha visão inicial sobre a formação.

### Arquivos criados ou alterados
- `docs/diario-de-bordo.md`

### Comandos usados
-

### Erros ou dúvidas
-

### Atalhos úteis
-

### Próximo passo
Seguir para o diagnóstico inicial técnico.
```

Esse formato tem uma vantagem:

```text
ele é repetível.
```

Quando a aula acaba, você sabe onde registrar.

---

## Exemplo mínimo digitado do zero

Crie a pasta `docs`, se ainda não existir:

```powershell
mkdir docs
```

Crie o arquivo:

```powershell
New-Item docs\diario-de-bordo.md
```

Conteúdo inicial:

```markdown
# Diário de bordo

Registro cronológico da evolução na formação Java Backend.

---

## Aula 013 — Diário de bordo e rastreabilidade do aprendizado

### O que aprendi
Aprendi que o diário de bordo registra o caminho da formação e ajuda a transformar estudo em rastreabilidade.

### O que pratiquei
Criei ou atualizei o arquivo `docs/diario-de-bordo.md`.

### Arquivos criados ou alterados
- `docs/diario-de-bordo.md`

### Comandos usados
```powershell
mkdir docs
New-Item docs\diario-de-bordo.md
```

### Erros ou dúvidas
-

### Atalhos úteis
-

### Próximo passo
Manter o diário atualizado após cada aula concluída.
```

Esse exemplo já é um diário funcional.

---

## Atenção ao bloco de código dentro do Markdown

Quando você coloca bloco de código dentro de um arquivo Markdown, use três crases.

Exemplo:

````markdown
```powershell
mkdir docs
New-Item docs\diario-de-bordo.md
```
````

Isso evita que o comando fique misturado com texto.

Se você estiver documentando Java:

````markdown
```java
public class Main {
}
```
````

Se estiver documentando SQL:

````markdown
```sql
select * from cliente;
```
````

Essa disciplina melhora a leitura.

---

## Diário de bordo e commits

A cada aula concluída, uma prática saudável é:

```bash
git status
git diff
git add docs/diario-de-bordo.md
git commit -m "Registra aprendizado da aula 013"
```

Mas cuidado: nem sempre faz sentido commitar apenas o diário.

Se a aula gerou código, documentação e exemplos, o commit pode incluir tudo.

Exemplo:

```bash
git add docs/diario-de-bordo.md docs/atalhos.md README.md
git commit -m "Documenta rotina de diario de bordo"
```

A mensagem deve explicar a intenção.

Não use:

```text
aula
```

Use algo como:

```text
Documenta rotina de diario de bordo
```

ou:

```text
Registra aprendizado sobre rastreabilidade"
```

---

## Como escrever uma boa entrada de diário

Uma boa entrada é objetiva, mas útil.

Ruim:

```markdown
Hoje aprendi Git.
```

Melhor:

```markdown
Hoje aprendi que `git add` prepara mudanças para commit e que `git commit` grava um ponto no histórico local. Também entendi que `git push` é a etapa que envia commits para o remoto.
```

Ruim:

```markdown
Deu erro, resolvi.
```

Melhor:

```markdown
Ao rodar `git commit`, o Git reclamou que `user.name` e `user.email` não estavam configurados. Resolvi usando `git config --global`.
```

O diário precisa ter informação suficiente para revisão futura.

---

## Registre erros com respeito técnico

Erro não é vergonha.

Erro é dado.

Quando algo falhar, registre:

```text
o que eu tentei fazer;
qual comando usei;
qual mensagem apareceu;
qual era a causa;
como resolvi;
o que aprendi.
```

Exemplo:

```markdown
### Erro encontrado

Ao executar `java Main`, apareceu erro dizendo que a classe não foi encontrada.

### Causa

Eu estava na pasta errada e o arquivo `Main.class` não estava no diretório atual.

### Solução

Usei `pwd` e `ls` para localizar a pasta correta e executei novamente.
```

Isso treina diagnóstico.

Mais tarde, em backend real, essa habilidade será usada em produção.

---

## Diário e atalhos

A formação também deve registrar atalhos úteis.

Mas o diário não precisa virar lista gigante de atalhos.

O melhor é:

```text
atalhos importantes vão para docs/atalhos.md;
no diário, registre quais atalhos foram usados na aula.
```

Exemplo no diário:

```markdown
### Atalhos úteis
- `Alt + F12` — abrir terminal integrado.
- `Ctrl + Shift + A` — buscar ação no IntelliJ.
```

E no arquivo `docs/atalhos.md`, você mantém uma tabela organizada.

---

## Arquivo de atalhos

Estrutura recomendada:

```markdown
# Atalhos

## IntelliJ

| Ação | Atalho | Observação |
|---|---|---|
| Buscar ação | `Ctrl + Shift + A` | Encontra comandos da IDE pelo nome |
| Terminal integrado | `Alt + F12` | Abre o terminal dentro da IDE |
| Project | `Alt + 1` | Abre ou foca o painel do projeto |
| Reformatar | `Ctrl + Alt + L` | Ajusta formatação do arquivo |
| Buscar em arquivos | `Ctrl + Shift + F` | Procura texto no projeto inteiro |
| Buscar no arquivo | `Ctrl + F` | Procura texto no arquivo atual |
| Renomear | `Shift + F6` | Renomeia com suporte da IDE |

## Git

| Ação | Comando |
|---|---|
| Ver estado | `git status` |
| Ver histórico curto | `git log --oneline` |
| Ver diferenças | `git diff` |
| Ver diferenças preparadas | `git diff --staged` |
```

Observação:

```text
atalhos podem variar conforme sistema operacional, teclado e keymap.
```

Quando não souber o atalho, use:

```text
Ctrl + Shift + A
```

e procure pelo nome da ação.

---

## Atalhos úteis nesta aula

Para trabalhar com diário e Markdown no IntelliJ, use quando fizer sentido:

| Ação | Atalho | Uso |
|---|---|---|
| Abrir painel do projeto | `Alt + 1` | Encontrar `docs/diario-de-bordo.md` |
| Voltar ao editor | `Esc` | Sair do painel e voltar ao texto |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos sem decorar |
| Buscar no arquivo | `Ctrl + F` | Encontrar uma aula no diário |
| Buscar no projeto | `Ctrl + Shift + F` | Procurar termo em todos os documentos |
| Reformatar arquivo | `Ctrl + Alt + L` | Ajustar formatação quando aplicável |
| Abrir terminal integrado | `Alt + F12` | Rodar comandos Git |
| Renomear arquivo | `Shift + F6` | Renomear com auxílio da IDE |

Não tente decorar tudo de uma vez.

Use os atalhos que resolvem problema real.

Depois registre no `docs/atalhos.md`.

---

## Como revisar usando o diário

O diário não serve apenas para escrever.

Serve para revisar.

Uma rotina simples:

```text
fim da aula: registrar aprendizado;
fim da semana: revisar entradas da semana;
fim do módulo: revisar pontos fracos;
antes de avançar para tema pesado: revisar pré-requisitos.
```

Exemplo de revisão semanal:

```markdown
# Revisão semanal

## Aulas revisadas
- Aula 009 — Git instalação e configuração global
- Aula 010 — Git local do zero
- Aula 011 — GitHub e repositório remoto

## Pontos firmes
- Diferença entre Git e GitHub.
- Diferença entre commit e push.
- Uso básico de git status.

## Pontos que preciso revisar
- Diferença entre git restore e git restore --staged.
- Conceito de upstream.

## Próxima ação
Refazer laboratório de Git local.
```

Essa revisão evita que o conhecimento evapore.

---

## Arquivo `docs/revisoes.md`

Para revisões mais organizadas, crie:

```text
docs/revisoes.md
```

Modelo:

```markdown
# Revisões

## Revisão 001 — M0 parcial

### Aulas cobertas
-

### Conceitos que ficaram claros
-

### Conceitos que ainda preciso reforçar
-

### Comandos que preciso praticar de novo
-

### Erros que cometi e não quero repetir
-

### Próxima revisão
-
```

O diário registra o dia a dia.

O arquivo de revisões consolida blocos.

Essa separação ajuda muito em formações longas.

---

## Rastreabilidade com Git log

O diário mostra em texto.

O Git mostra em histórico.

Use:

```bash
git log --oneline
```

Exemplo:

```text
a1b2c3d Documenta rotina de diario de bordo
b2c3d4e Documenta base de Markdown tecnico
c3d4e5f Conecta repositorio remoto ao GitHub
```

Esse histórico mostra progresso.

Se quiser ver o que mudou em um commit específico, mais tarde usaremos comandos como:

```bash
git show
```

Por enquanto, `git log --oneline` já ajuda a visualizar.

---

## Rastreabilidade com arquivos alterados

Antes de commitar o diário:

```bash
git status
```

Isso mostra o que mudou.

Depois:

```bash
git diff
```

Isso mostra o conteúdo alterado.

Essa prática é importante.

Ela evita commits sem revisão.

Fluxo recomendado:

```bash
git status
git diff
git add docs/diario-de-bordo.md
git diff --staged
git commit -m "Registra aprendizado sobre diario de bordo"
git status
```

Esse fluxo ensina disciplina.

---

## O que não registrar no diário

Não registre:

```text
senhas;
tokens;
chaves privadas;
dados reais sensíveis;
informações corporativas sigilosas;
dados pessoais desnecessários;
prints com informações internas;
credenciais de banco;
conteúdo que você não poderia compartilhar.
```

O diário pode estar em repositório remoto.

Se for público, o cuidado precisa ser maior.

Mesmo se for privado, segredo não deve ir para Git.

Use placeholders.

Exemplo:

```text
DB_PASSWORD=********
```

Mas, melhor ainda, não coloque esse tipo de conteúdo no diário.

---

## Diário e portfólio

Um diário bem feito pode mostrar evolução.

Mas é preciso bom senso.

Em repositório público, o diário deve ser técnico e profissional.

Evite:

```text
desabafos pessoais longos;
informações sensíveis;
dados de empresa;
nomes internos;
prints privados;
credenciais;
comentários inadequados.
```

Prefira:

```text
o que aprendi;
o que pratiquei;
qual problema técnico resolvi;
qual conceito preciso revisar;
qual commit registra a evolução.
```

Um diário público pode mostrar disciplina.

Um diário bagunçado pode passar imagem ruim.

---

## Diário e trabalho corporativo

Em empresas, nem sempre se usa um “diário de bordo” pessoal dentro do repositório.

Mas a ideia aparece de outras formas:

```text
comentários em tickets;
descrições de pull request;
documentação técnica;
ADRs;
changelog;
runbooks;
postmortems;
checklists de validação;
evidências de teste;
anotações de troubleshooting.
```

A habilidade é a mesma:

```text
registrar tecnicamente o que aconteceu.
```

Quem treina diário de bordo aprende a escrever melhor em contexto profissional.

---

## Exemplo aplicado ao domínio corporativo

Imagine que você validou uma regra de backend:

```text
Atividade só pode ser reagendada se estiver em status AGENDADO ou REAGENDADO.
```

Um registro fraco:

```markdown
Validado reagendamento.
```

Um registro melhor:

```markdown
## Validação — Regra de reagendamento

### Cenário
Atividade com status `AGENDADO`.

### Ação
Solicitado reagendamento para nova data.

### Resultado
Sistema permitiu o reagendamento, atualizou a data e registrou histórico.

### Cenário negativo
Atividade com status `CONCLUIDO`.

### Resultado
Sistema bloqueou o reagendamento.

### Observação
A regra validada considera apenas status permitidos. Demais validações devem ser cobertas em cenários específicos.
```

Isso é rastreabilidade.

A formação usa diário para estudo.

O trabalho usa documentação para evidência.

A mentalidade é a mesma.

---

## Exemplo aplicado ao backend Java

Imagine que você criou um exemplo de compilação manual.

Registro ruim:

```markdown
Fiz javac.
```

Registro melhor:

```markdown
## Aula 006 — Compilação manual com javac

### O que pratiquei
Criei `Main.java`, compilei com `javac Main.java` e executei com `java Main`.

### O que observei
O comando `javac` gerou `Main.class`. O comando `java Main` executou a classe pela JVM.

### Erro reproduzido
Tentei executar `java Main.class` e entendi que o correto é usar o nome da classe, sem `.class`.

### Aprendizado
`javac` compila arquivo `.java`. `java` executa classe compilada.
```

Esse registro ajuda revisão.

Ele também mostra que houve prática real.

---

## Como manter o diário sem virar peso

Algumas regras simples:

```text
não escreva demais sem necessidade;
não copie a aula inteira;
registre o essencial;
use sempre o mesmo modelo;
registre logo após a aula;
faça commit quando fizer sentido;
revise semanalmente;
mantenha linguagem técnica;
não registre segredo;
não deixe acumular muitas aulas sem atualizar.
```

O diário precisa ser sustentável.

Melhor um registro simples por aula do que um registro perfeito que nunca acontece.

---

## Quando o diário deve ser atualizado

Idealmente:

```text
ao final de cada aula concluída;
após erro importante resolvido;
após decisão técnica relevante;
após prática significativa;
após revisão semanal;
ao final de um módulo.
```

Não precisa registrar cada microação.

Mas precisa registrar marcos.

Exemplo:

```text
instalei Git e validei versão;
compilei manualmente com javac;
configurei repositório remoto;
aprendi debug inicial;
criei README em Markdown.
```

---

## Checklist de entrada de diário

Antes de considerar uma entrada concluída, veja:

```markdown
- [ ] A aula foi identificada?
- [ ] O aprendizado principal foi registrado?
- [ ] A prática feita foi registrada?
- [ ] Arquivos alterados foram mencionados?
- [ ] Comandos importantes foram anotados?
- [ ] Erros ou dúvidas foram registrados?
- [ ] Atalhos úteis foram adicionados quando existirem?
- [ ] Não há senha, token ou dado sensível?
- [ ] O texto está claro para revisão futura?
```

Esse checklist ajuda a manter qualidade.

---

## Erros comuns

### Erro 1 — Não registrar nada

A pessoa estuda, mas não deixa rastro.

Correção:

```text
registrar pelo menos o bloco mínimo ao final da aula.
```

---

### Erro 2 — Copiar a aula inteira

O diário fica enorme e inútil.

Correção:

```text
registrar com suas palavras.
```

---

### Erro 3 — Escrever genérico demais

Ruim:

```markdown
Aprendi bastante.
```

Melhor:

```markdown
Aprendi a diferença entre `git commit` e `git push`.
```

---

### Erro 4 — Registrar só acerto e esconder erro

Erro ensina.

Correção:

```text
registrar erro, causa e solução.
```

---

### Erro 5 — Não commitar o diário

Se o diário fica fora do Git, perde rastreabilidade.

Correção:

```bash
git add docs/diario-de-bordo.md
git commit -m "Registra aprendizado da aula ..."
```

---

### Erro 6 — Registrar segredo

Nunca faça isso.

Correção:

```text
usar placeholders;
não versionar credenciais;
manter secrets fora do Git.
```

---

### Erro 7 — Misturar diário com atalhos

Atalhos recorrentes devem ir para `docs/atalhos.md`.

No diário, registre apenas os atalhos usados ou aprendidos naquela aula.

---

### Erro 8 — Não revisar

Diário sem revisão vira arquivo morto.

Correção:

```text
revisão semanal curta.
```

---

### Erro 9 — Fazer entrada longa demais

Entrada muito longa pode desestimular continuidade.

Correção:

```text
priorizar clareza e utilidade.
```

---

### Erro 10 — Não registrar decisões

Quando tomar uma decisão técnica, registre.

Exemplo:

```text
usar JDK 21 LTS;
usar branch main;
usar C:\dev como raiz;
usar Markdown para docs.
```

Decisão não registrada tende a ser rediscutida.

---

## Diagnóstico de um diário ruim

Pergunte:

```text
consigo entender o que foi aprendido?
consigo saber o que foi praticado?
consigo reproduzir os comandos principais?
consigo ver quais erros aconteceram?
consigo saber o que revisar?
consigo relacionar a entrada a um commit?
consigo ler isso daqui a um mês?
```

Se não, melhore o formato.

---

## Prática recomendada

Crie ou atualize:

```text
docs/diario-de-bordo.md
docs/atalhos.md
docs/revisoes.md
```

No `docs/diario-de-bordo.md`, registre esta aula.

No `docs/atalhos.md`, adicione:

```markdown
| Ação | Atalho | Observação |
|---|---|---|
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Terminal integrado | `Alt + F12` | Rodar Git sem sair da IDE |
| Project | `Alt + 1` | Navegar pelos arquivos |
| Buscar no arquivo | `Ctrl + F` | Encontrar aulas no diário |
| Buscar no projeto | `Ctrl + Shift + F` | Encontrar termos em todos os arquivos |
```

No `docs/revisoes.md`, coloque:

```markdown
# Revisões

## Revisão inicial — M0 parcial

### Aulas já registradas
-

### Pontos que preciso revisar
-

### Comandos que preciso praticar novamente
-

### Próxima revisão
-
```

Depois rode:

```bash
git status
git diff
git add docs/diario-de-bordo.md docs/atalhos.md docs/revisoes.md
git diff --staged
git commit -m "Organiza diario de bordo e revisoes"
git status
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 013 — Diário de bordo e rastreabilidade do aprendizado

### O que aprendi
Aprendi que o diário de bordo registra a evolução da formação, ajuda na revisão e cria rastreabilidade junto com o Git.

### O que pratiquei
Criei ou atualizei os arquivos de diário, atalhos e revisões.

### Arquivos criados ou alterados
- `docs/diario-de-bordo.md`
- `docs/atalhos.md`
- `docs/revisoes.md`

### Comandos usados
```bash
git status
git diff
git add docs/diario-de-bordo.md docs/atalhos.md docs/revisoes.md
git diff --staged
git commit -m "Organiza diario de bordo e revisoes"
```

### Atalhos úteis
- `Alt + 1` — abrir painel Project.
- `Esc` — voltar ao editor.
- `Ctrl + F` — buscar no arquivo atual.
- `Ctrl + Shift + F` — buscar no projeto.
- `Alt + F12` — abrir terminal integrado.
- `Ctrl + Shift + A` — buscar ação no IntelliJ.

### Erros que quero evitar
- copiar a aula inteira no diário;
- registrar algo genérico demais;
- deixar de registrar erros;
- esquecer de commitar o diário;
- colocar segredo em arquivo Markdown.

### Próximo passo
Estudar como usar IA/Codex no IntelliJ com ética, método e sem terceirizar raciocínio.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é diário de bordo;
explicar diferença entre diário, anotação e revisão;
criar docs/diario-de-bordo.md;
criar ou atualizar docs/atalhos.md;
criar docs/revisoes.md;
registrar uma aula com clareza;
registrar comandos usados;
registrar erros, causas e soluções;
registrar atalhos úteis;
usar Markdown de forma organizada;
usar Git para versionar o diário;
usar git status e git diff antes do commit;
explicar como o diário cria rastreabilidade;
explicar o que não deve ser registrado por segurança;
usar o diário para revisão semanal;
relacionar diário de bordo com documentação profissional, evidências e histórico técnico.
```

Não precisa fazer um diário perfeito.

Precisa fazer um diário útil e sustentável.

---

## Fechamento da aula

O diário de bordo é uma ferramenta simples.

Mas, bem usado, muda a qualidade da formação.

Ele impede que o estudo vire algo solto.

Ele mostra evolução.

Ele guarda erros importantes.

Ele registra decisões.

Ele ajuda revisão.

Ele cria rastreabilidade junto com Git.

E, principalmente, força uma pergunta que todo profissional precisa saber responder:

```text
o que eu aprendi de verdade e que evidência eu tenho disso?
```

Na próxima aula, vamos tratar de um assunto delicado e atual:

```text
IA/Codex no IntelliJ com ética e método.
```

A ideia não será usar IA para terceirizar raciocínio.

Será aprender a usar IA como apoio técnico, sem perder domínio, sem copiar sem entender e sem comprometer segurança, autoria ou aprendizado.
