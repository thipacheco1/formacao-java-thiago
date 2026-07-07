# 002 — M0.02 — Diagnóstico Inicial Técnico e Plano de Estudo

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.02.01` — Diagnóstico inicial técnico e plano de estudo — Conceito, por que existe e vocabulário essencial.
- `M0.02.02` — Diagnóstico inicial técnico e plano de estudo — Exemplo mínimo digitado do zero.
- `M0.02.03` — Diagnóstico inicial técnico e plano de estudo — Exemplo aplicado ao domínio corporativo.
- `M0.02.04` — Diagnóstico inicial técnico e plano de estudo — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para transformar o diagnóstico em uma ferramenta real de evolução, e não em um formulário burocrático.

---

## Hoje a aula é sobre saber exatamente de onde se está partindo

Antes de estudar forte, é preciso medir o ponto de partida.

Não para julgar.

Não para desanimar.

Não para criar comparação com outras pessoas.

O diagnóstico inicial existe para responder uma pergunta simples:

```text
Quais fundamentos já estão firmes e quais ainda precisam ser construídos com calma?
```

Uma formação de alto nível não começa fingindo que todo mundo parte do mesmo lugar.

Cada pessoa chega com uma bagagem.

Pode ter experiência com QA.

Pode conhecer automação.

Pode já ter mexido com API.

Pode já ter validado banco.

Pode ter usado Git.

Pode ter visto Java superficialmente.

Pode ter prática com lógica, mas pouca prática com OO.

Pode entender regra de negócio, mas ainda não saber implementar backend do zero.

Tudo isso importa.

O diagnóstico serve para transformar essa bagagem em plano.

---

## Diagnóstico não é prova

A primeira coisa importante: diagnóstico não é prova.

Prova tenta medir acerto.

Diagnóstico tenta revelar caminho.

Se uma pessoa erra uma questão de Java básico, isso não significa que ela “não serve para backend”.

Significa apenas:

```text
esse ponto precisa ser estudado antes de depender dele.
```

Se uma pessoa não sabe Git direito, isso não significa incapacidade.

Significa:

```text
antes de trabalhar com branch, PR e conflito, precisa dominar add, commit, status, diff e log.
```

Se uma pessoa não sabe SQL com segurança, isso não significa fracasso.

Significa:

```text
antes de JPA e Hibernate, precisa construir base relacional.
```

Um bom diagnóstico não humilha.

Um bom diagnóstico orienta.

---

## Por que isso importa para uma formação Java Backend

Backend Java exige várias competências ao mesmo tempo.

Não basta saber só linguagem.

Também não basta saber só ferramenta.

Um backend real envolve:

```text
lógica;
leitura de código;
organização;
terminal;
Git;
Java;
OO;
banco;
SQL;
HTTP;
API;
testes;
debug;
build;
logs;
deploy;
produção;
arquitetura.
```

Se uma dessas áreas está muito fraca, ela começa a afetar as outras.

Exemplo:

```text
Quem não entende terminal sofre para rodar ferramenta.
Quem não entende Git tem medo de alterar código.
Quem não entende lógica sofre em regra de negócio.
Quem não entende SQL usa JPA no escuro.
Quem não entende HTTP cria endpoint sem critério.
Quem não entende teste tem medo de refatorar.
Quem não entende log sofre para investigar produção.
```

O diagnóstico ajuda a identificar essas lacunas antes que elas virem bloqueio.

---

## As áreas que vamos diagnosticar

Neste início, não precisamos avaliar tudo com profundidade máxima.

Ainda não faz sentido exigir conhecimento avançado de DDD, Kubernetes, Kafka ou tuning de JVM.

Mas precisamos medir a base.

A base inicial fica em sete áreas.

```text
1. Lógica
2. Java básico
3. Terminal e ambiente
4. Git
5. Banco de dados
6. API e HTTP
7. Rotina de estudo
```

Essas áreas funcionam como alicerce.

Se o alicerce está instável, a construção cresce torta.

---

## 1. Lógica

Lógica é a capacidade de transformar uma regra em passos.

Exemplo de regra:

```text
Se o cliente tem idade maior ou igual a 18, pode continuar.
Caso contrário, deve ser bloqueado.
```

Em pensamento lógico:

```text
ler idade
comparar idade com 18
se idade >= 18, permitir
senão, bloquear
```

Em Java, mais tarde, isso vira:

```java
if (idade >= 18) {
    System.out.println("Permitido");
} else {
    System.out.println("Bloqueado");
}
```

Lógica aparece em tudo:

```text
validação;
cálculo;
filtro;
laço;
busca;
ordenação;
decisão de fluxo;
regra de negócio;
tratamento de erro;
processamento de lote.
```

Uma pessoa pode até decorar sintaxe Java, mas sem lógica ela trava quando a regra muda.

Por isso, lógica vem antes de framework.

---

## 2. Java básico

Java básico é o domínio inicial da linguagem.

Aqui entram perguntas como:

```text
O que é uma classe?
O que é main?
O que é variável?
O que é tipo?
O que é String?
O que é if?
O que é for?
O que é método?
O que é array?
O que é erro de compilação?
O que é erro de execução?
```

Não precisa saber tudo agora.

Mas precisa saber identificar o que ainda é estranho.

Java básico é a matéria-prima.

Spring Boot, JPA, testes e arquitetura vão usar essa matéria-prima o tempo todo.

Se a pessoa pula Java básico e corre para Spring, ela até cria endpoint, mas fica sem entender o que está fazendo.

---

## 3. Terminal e ambiente

Terminal é uma ferramenta de autonomia.

Muitos iniciantes ficam presos à IDE porque não entendem o que acontece por baixo.

Mas no backend real, o terminal aparece sempre:

```text
rodar projeto;
compilar;
executar teste;
usar Git;
subir container;
rodar Maven;
ver logs;
executar script;
navegar em pastas;
diagnosticar ambiente.
```

Não precisa amar terminal.

Mas precisa perder o medo.

O mínimo que um backend precisa dominar no começo:

```text
saber onde está;
listar arquivos;
entrar e sair de pastas;
criar pasta;
apagar arquivo com cuidado;
executar comando;
ler mensagem de erro;
validar versão de ferramenta.
```

O terminal ensina uma coisa valiosa:

```text
o projeto é uma estrutura real de arquivos, comandos e processos.
```

Não é só botão verde da IDE.

---

## 4. Git

Git é histórico, colaboração e segurança.

Em projeto profissional, código sem Git não existe.

No início, a pessoa precisa entender:

```text
git status
git add
git commit
git log
git diff
.gitignore
```

Depois vem:

```text
branch
merge
rebase
conflito
pull request
code review
tag
release
revert
cherry-pick
```

Mas o começo é simples:

```text
saber o que mudou;
escolher o que entra;
registrar uma versão;
consultar histórico;
não versionar lixo.
```

Git é mais do que ferramenta.

Git é disciplina.

Quem usa Git mal cria medo no time.

Quem usa Git bem cria rastreabilidade.

---

## 5. Banco de dados

Backend sem banco é raro.

Mesmo quando há mensageria, cache, arquivos ou APIs externas, em algum ponto existe dado persistido.

Banco exige outro tipo de raciocínio.

Em Java, a pessoa pensa em objetos.

No banco, pensa em:

```text
tabelas;
colunas;
linhas;
chaves;
relacionamentos;
constraints;
consultas;
índices;
transações.
```

Antes de JPA, Hibernate e Spring Data, é preciso respeitar SQL.

Um backend forte não pode tratar banco como “detalhe”.

Banco guarda estado.

E estado errado gera problema real.

---

## 6. API e HTTP

Backend conversa com outros sistemas por contratos.

HTTP é uma das bases desses contratos.

No início, precisamos entender:

```text
request;
response;
método HTTP;
GET;
POST;
PUT;
PATCH;
DELETE;
headers;
body;
JSON;
status code.
```

Sem isso, a pessoa cria endpoint sem entender semântica.

Exemplo:

```text
GET busca.
POST cria ou inicia processamento.
PUT substitui.
PATCH altera parcialmente.
DELETE remove ou inativa, dependendo da regra.
```

Mais tarde vamos aprofundar.

Mas desde o início é bom saber que API não é só URL.

API é contrato.

---

## 7. Rotina de estudo

Essa talvez seja a área mais negligenciada.

A pessoa quer estudar tecnologia, mas não organiza o estudo.

Sem rotina, a formação vira empolgação de alguns dias.

Rotina não precisa ser perfeita.

Precisa ser sustentável.

Uma boa rotina tem:

```text
horário possível;
aula lida com atenção;
prática quando fizer sentido;
registro no diário;
revisão curta;
commit quando houver código;
dúvidas anotadas;
retomada sem culpa quando falhar.
```

A pergunta não é:

```text
Quantas horas ideais eu deveria estudar?
```

A pergunta é:

```text
Qual rotina consigo manter por meses?
```

Formação forte exige constância.

---

## Exemplo mínimo: um diagnóstico simples

Um diagnóstico inicial pode ser uma tabela simples.

Não precisa ser bonito.

Precisa ser honesto.

Exemplo:

```markdown
# Diagnóstico inicial

| Área | Nível atual | Observação |
|---|---:|---|
| Lógica | 2/5 | Entendo if e laços, mas ainda travo em problemas maiores |
| Java básico | 1/5 | Sei rodar exemplo, mas ainda não domino sintaxe |
| Terminal | 2/5 | Sei navegar um pouco, mas erro caminhos |
| Git | 2/5 | Sei commit básico, mas não domino branch |
| Banco | 2/5 | Sei SELECT simples, mas não domino modelagem |
| API/HTTP | 3/5 | Já validei APIs, mas quero entender implementação |
| Rotina | 2/5 | Preciso organizar frequência e diário |
```

Esse exemplo é suficiente para começar.

O objetivo não é parecer avançado.

O objetivo é enxergar.

---

## Como interpretar os níveis

A escala de 1 a 5 deve ser usada com cuidado.

Ela não é uma nota escolar.

É um marcador de confiança.

```text
1 = quase não conheço
2 = já vi, mas preciso de apoio
3 = consigo fazer coisas simples
4 = consigo trabalhar com autonomia razoável
5 = consigo explicar, aplicar, diagnosticar e ensinar
```

No início da formação, é normal ter muito 1, 2 e 3.

O erro seria fingir 5.

Profissional forte não mente para o próprio diagnóstico.

---

## Exemplo aplicado ao domínio corporativo

Agora vamos trazer isso para um cenário mais real.

Imagine um sistema de ordem de serviço.

Existe uma regra:

```text
Uma atividade só pode ser reagendada se estiver em status permitido.
Ao reagendar, o sistema deve atualizar a data, registrar histórico e gerar ocorrência.
```

Para implementar isso bem, várias áreas aparecem.

### Lógica

```text
Se status está permitido, prossegue.
Se não está permitido, bloqueia.
```

### Java básico

```text
representar status;
comparar valores;
criar métodos;
organizar fluxo.
```

### OO

```text
modelar OrdemServico, Atividade, Status, Historico, Ocorrencia.
```

### Banco

```text
atualizar atividade;
inserir histórico;
inserir ocorrência;
manter consistência.
```

### API

```text
receber requisição de reagendamento;
validar payload;
retornar resposta adequada.
```

### Transação

```text
ou atualiza tudo,
ou não atualiza nada.
```

### Testes

```text
testar status permitido;
testar status bloqueado;
testar geração de histórico;
testar erro de entrada.
```

### Logs

```text
registrar tentativa;
registrar falha;
permitir investigação.
```

Perceba: uma regra aparentemente simples usa várias competências.

É por isso que diagnóstico inicial importa.

Ele mostra quais partes da cadeia precisam ser fortalecidas.

---

## O erro comum: estudar pelo assunto que dá vontade

É natural querer ir direto para Spring Boot.

Spring parece mais próximo do mercado.

Mas estudar só pelo desejo do momento cria buracos.

A pessoa aprende a fazer:

```text
@RestController
@PostMapping
```

mas não entende:

```text
DTO;
validação;
service;
transação;
exceção;
teste;
persistência;
contrato;
status HTTP;
logs.
```

Então o plano precisa equilibrar motivação e sequência.

Vamos chegar em Spring.

Mas quando chegar, a base precisa sustentar.

---

## Outro erro comum: estudar tudo ao mesmo tempo

Existe o erro oposto.

A pessoa abre Java, SQL, Docker, AWS, Kafka, Kubernetes, DDD, testes e arquitetura ao mesmo tempo.

Resultado:

```text
muita informação;
pouca profundidade;
sensação de avanço;
pouca capacidade real.
```

A formação precisa ter ordem.

Não porque um assunto seja proibido antes do outro, mas porque alguns conceitos dependem de outros.

Exemplo:

```text
JPA depende de Java e banco.
Testes bons dependem de método e design.
Spring depende de OO, HTTP e build.
Arquitetura depende de código, domínio, banco, integração e produção.
```

Ordem não é burocracia.

Ordem é alavanca.

---

## Plano de 30, 60 e 90 dias

Nesta formação, o plano real será longo.

Mas o raciocínio de 30, 60 e 90 dias ajuda a criar direção.

Não é uma promessa rígida.

É um horizonte.

### Primeiros 30 dias

O foco deve ser:

```text
ambiente;
rotina;
terminal;
Git básico;
Java inicial;
compilação;
IDE;
diário;
primeiros códigos.
```

O objetivo dos primeiros 30 dias não é virar backend.

É criar base operacional e disciplina de estudo.

Resultado esperado:

```text
conseguir criar, rodar, versionar e explicar códigos Java simples.
```

---

### Primeiros 60 dias

O foco começa a ganhar mais lógica e estrutura:

```text
variáveis;
tipos;
condições;
laços;
arrays;
métodos;
debug;
pequenos projetos console;
primeiras noções de organização.
```

Resultado esperado:

```text
conseguir resolver problemas pequenos sem copiar,
explicar o fluxo,
debugar erros simples
e organizar melhor o código.
```

---

### Primeiros 90 dias

O foco começa a se aproximar de base profissional:

```text
Java Core mais firme;
OO inicial;
coleções;
Git mais seguro;
testes iniciais;
SQL básico;
leitura de regra de negócio.
```

Resultado esperado:

```text
começar a pensar como alguém que implementa regras com mais clareza,
não apenas como alguém que escreve comandos.
```

Esse horizonte pode mudar conforme ritmo, tempo disponível e dificuldade.

Mas ele dá direção.

---

## Como registrar o diagnóstico no repositório

O ideal é criar um arquivo de diagnóstico dentro de `docs`.

Exemplo:

```text
docs/diagnostico-inicial.md
```

Conteúdo sugerido:

```markdown
# Diagnóstico inicial técnico

## Data
AAAA-MM-DD

## Objetivo
Registrar meu ponto de partida na formação Java Backend.

## Escala
1 = quase não conheço
2 = já vi, mas preciso de apoio
3 = consigo fazer coisas simples
4 = consigo trabalhar com autonomia razoável
5 = consigo explicar, aplicar, diagnosticar e ensinar

## Áreas

| Área | Nível atual | Evidência | Próximo foco |
|---|---:|---|---|
| Lógica |  |  |  |
| Java básico |  |  |  |
| Terminal |  |  |  |
| Git |  |  |  |
| Banco de dados |  |  |  |
| API/HTTP |  |  |  |
| Rotina de estudo |  |  |  |

## Maiores lacunas percebidas
-

## Maiores forças percebidas
-

## Plano inicial de ação
-

## Revisão em 30 dias
-
```

Isso já é uma entrega útil.

Não é enfeite.

É ponto de partida.

---

## Diagnóstico técnico não deve virar identidade

Um cuidado importante:

```text
estar fraco em algo não significa ser fraco.
```

Significa apenas que aquele ponto precisa de estudo.

O diagnóstico mede estado atual, não valor pessoal.

Hoje a pessoa pode estar nível 1 em Git.

Daqui a alguns meses pode estar nível 4.

Hoje pode travar em Java básico.

Depois pode estar explicando Spring, JPA e arquitetura.

Formação existe justamente porque o estado atual não é o estado final.

---

## Perguntas que ajudam mais do que notas

Além de dar uma nota, é melhor responder perguntas.

### Lógica

```text
Consigo transformar uma regra escrita em passos?
Consigo usar if sem me perder?
Consigo explicar um laço?
Consigo procurar um item em uma lista?
```

### Java básico

```text
Consigo escrever uma classe simples?
Consigo criar variáveis?
Consigo compilar e executar?
Consigo ler erro de compilação?
```

### Terminal

```text
Consigo navegar até a pasta do projeto?
Consigo listar arquivos?
Consigo rodar comandos?
Consigo validar versões?
```

### Git

```text
Consigo ver o que mudou?
Consigo adicionar arquivos?
Consigo criar commit?
Consigo ver histórico?
```

### Banco

```text
Consigo explicar tabela e coluna?
Consigo fazer SELECT simples?
Consigo entender chave primária?
Consigo entender relacionamento básico?
```

### API/HTTP

```text
Consigo explicar request e response?
Consigo diferenciar GET e POST?
Consigo entender status 200, 400, 404 e 500?
Consigo ler um JSON?
```

### Rotina

```text
Consigo estudar com frequência?
Consigo registrar o que aprendi?
Consigo voltar depois sem me perder?
Consigo terminar uma aula com calma?
```

Essas respostas dizem mais do que uma nota solta.

---

## Plano de estudo não é prisão

O plano existe para guiar, não para prender.

Durante a formação, algumas coisas podem acontecer:

```text
um assunto pode exigir mais tempo;
uma lacuna pode aparecer;
um exercício pode revelar fraqueza;
um módulo pode precisar de revisão;
um tema pode ficar claro mais rápido;
uma ferramenta pode dar problema;
a rotina pode mudar.
```

Isso é normal.

Plano bom não é aquele que nunca muda.

Plano bom é aquele que permite ajustar sem perder direção.

---

## O que fazer quando uma lacuna aparecer

Quando uma lacuna aparecer, não esconda.

Faça três coisas.

### Primeiro: nomeie a lacuna

```text
Não entendi laço for.
Tenho dificuldade com terminal.
Não sei explicar Git add e commit.
Não entendi diferença entre GET e POST.
```

### Segundo: reduza o problema

Em vez de:

```text
não sei Java
```

prefira:

```text
não entendi ainda como declarar método com retorno
```

Problema específico é resolvível.

Problema genérico vira ansiedade.

### Terceiro: volte para o menor exemplo

Quando travar, reduza.

Menor código.

Menor comando.

Menor cenário.

Menor regra.

Depois cresce de novo.

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
entender por que diagnóstico existe;
separar diagnóstico de julgamento;
listar as áreas iniciais da formação;
preencher uma tabela honesta de ponto de partida;
identificar forças e lacunas;
criar um plano simples de próximos passos;
entender que a formação será ajustada por evidência, não por ansiedade.
```

Não precisa sair daqui sabendo tudo.

Precisa sair sabendo como olhar para o próprio ponto de partida.

---

## Prática recomendada

Esta prática vale a pena fazer.

Crie o arquivo:

```text
docs/diagnostico-inicial.md
```

Preencha com honestidade.

Modelo:

```markdown
# Diagnóstico inicial técnico

## Data
AAAA-MM-DD

## Escala
1 = quase não conheço
2 = já vi, mas preciso de apoio
3 = consigo fazer coisas simples
4 = consigo trabalhar com autonomia razoável
5 = consigo explicar, aplicar, diagnosticar e ensinar

## Áreas

| Área | Nível atual | Evidência | Próximo foco |
|---|---:|---|---|
| Lógica |  |  |  |
| Java básico |  |  |  |
| Terminal |  |  |  |
| Git |  |  |  |
| Banco de dados |  |  |  |
| API/HTTP |  |  |  |
| Rotina de estudo |  |  |  |

## Minhas maiores forças hoje
-

## Minhas maiores lacunas hoje
-

## Plano dos próximos 30 dias
-

## Plano dos próximos 60 dias
-

## Plano dos próximos 90 dias
-
```

Se estiver usando Git no repositório, depois faça:

```bash
git status
git add docs/diagnostico-inicial.md
git commit -m "Adiciona diagnostico inicial tecnico"
git status
```

Se ainda não for o momento de commitar, apenas salve o arquivo.

---

## Fechamento da aula

Diagnóstico é humildade técnica organizada.

Ele não diminui ninguém.

Ele mostra caminho.

Uma formação de alto nível precisa disso porque o objetivo não é apenas consumir conteúdo.

O objetivo é evoluir capacidade.

E capacidade evolui melhor quando sabemos:

```text
onde estamos;
para onde vamos;
quais lacunas existem;
qual é o próximo passo;
como vamos medir progresso.
```

A partir da próxima aula, entramos em organização do ambiente Windows para desenvolvimento.

Isso parece simples, mas não é detalhe.

Um ambiente bagunçado cria atrito todos os dias.

Um ambiente bem organizado reduz erro, melhora foco e prepara a base para Java, Git, Maven, banco, Docker e projetos reais.
