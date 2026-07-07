# 018 — M0.18 — Docker Desktop e WSL2: Preparação

## Complemento operacional — instalar WSL2, Docker Desktop e validar hello-world

> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.

Esta aula já explica WSL2, Docker Desktop, imagem, container, registry, pull, run, portas, volumes e comandos básicos. Este complemento deixa explícito o roteiro operacional de instalação.

### Pré-requisito: virtualização

Antes do Docker, valide no Windows:

```text
Gerenciador de Tarefas
Desempenho
CPU
Virtualização: Habilitado
```

Se estiver desabilitado, será necessário habilitar na BIOS/UEFI.

### Instalar ou validar WSL2

No PowerShell como administrador, quando aplicável:

```powershell
wsl --install
```

Depois reinicie se solicitado.

Valide:

```powershell
wsl --status
wsl -l -v
```

O objetivo é ter distribuição Linux disponível em WSL2.

### Instalar Docker Desktop

Fluxo:

```text
1. Baixar Docker Desktop de fonte oficial.
2. Executar instalador.
3. Habilitar backend WSL2 quando solicitado.
4. Reiniciar se necessário.
5. Abrir Docker Desktop.
6. Aguardar o engine iniciar.
7. Validar pelo PowerShell.
```

### Validação obrigatória

Com Docker Desktop aberto:

```powershell
docker --version
docker version
docker info
docker compose version
docker run hello-world
docker ps
docker ps -a
docker images
```

Interpretação:

```text
docker --version -> CLI disponível;
docker version -> CLI conversa com engine;
docker info -> engine fornece detalhes;
hello-world -> Docker consegue baixar/criar/executar container;
docker ps -a -> container encerrado aparece;
docker images -> imagem hello-world aparece.
```

### Critério operacional atualizado

```markdown
## Docker e WSL2 validados

- [ ] Virtualização habilitada.
- [ ] WSL instalado.
- [ ] Distribuição Linux disponível.
- [ ] Distribuição usando WSL2 quando aplicável.
- [ ] Docker Desktop instalado.
- [ ] Docker Desktop aberto.
- [ ] Engine iniciado.
- [ ] `docker --version` funciona.
- [ ] `docker version` funciona.
- [ ] `docker compose version` funciona.
- [ ] `docker run hello-world` funciona.
- [ ] Sei diferenciar imagem e container.
```

---

## Onde estamos na formação

Estamos seguindo a ordem oficial do Módulo 0.

Até aqui, a preparação já cobriu:

```text
M0.01 — mapa da formação;
M0.02 — diagnóstico inicial;
M0.03 — organização do Windows;
M0.04 — PowerShell e comandos básicos;
M0.05 — JDK, JRE e JVM;
M0.06 — compilação manual com javac;
M0.07 — IntelliJ IDEA Community;
M0.08 — debug inicial;
M0.09 — Git instalação e configuração global;
M0.10 — Git local;
M0.11 — GitHub e repositório remoto;
M0.12 — Markdown para documentação técnica;
M0.13 — diário de bordo e rastreabilidade;
M0.14 — Codex/IA no IntelliJ com ética e método;
M0.15 — Maven instalação e validação inicial;
M0.16 — PostgreSQL e DBeaver preparação;
M0.17 — Postman/Insomnia e HTTP básico.
```

Agora vamos preparar Docker Desktop e WSL2.

Ainda não estamos estudando Docker profundamente.

Ainda não estamos criando imagem Java.

Ainda não estamos escrevendo `Dockerfile`.

Ainda não estamos usando Docker Compose.

Ainda não estamos subindo aplicação Java em container.

Esta aula é preparação.

O objetivo é que o ambiente esteja pronto para módulos futuros, quando precisarmos rodar:

```text
PostgreSQL em container;
Redis;
RabbitMQ;
Kafka;
aplicações Java;
serviços auxiliares;
ambientes locais reproduzíveis.
```

---

## Hoje a aula é sobre preparar o ambiente para containers

Em backend profissional, muitas dependências não rodam diretamente instaladas no Windows.

É comum usar containers para subir serviços localmente.

Exemplos:

```text
banco PostgreSQL;
banco MySQL;
Redis;
RabbitMQ;
Kafka;
MongoDB;
serviço fake;
aplicação Java;
ferramenta de observabilidade;
ambiente de integração.
```

Sem Docker, cada pessoa do time poderia instalar tudo manualmente.

Isso gera problemas:

```text
versões diferentes;
porta diferente;
configuração diferente;
serviço instalado errado;
máquina poluída;
dificuldade para resetar ambiente;
onboarding demorado;
"na minha máquina funciona".
```

Docker ajuda a reduzir isso.

A ideia é:

```text
em vez de instalar tudo diretamente na máquina,
rodamos serviços isolados em containers.
```

Isso não elimina a necessidade de entender o que está rodando.

Mas melhora a reprodutibilidade.

---

## O que é Docker

Docker é uma plataforma para criar, distribuir e executar containers.

Nesta aula, pense assim:

```text
Docker permite rodar processos isolados com ambiente controlado.
```

Um container pode rodar:

```text
PostgreSQL;
Redis;
uma aplicação Java;
um servidor web;
um serviço de mensageria;
uma ferramenta de teste.
```

O container não é uma máquina virtual completa no mesmo sentido tradicional.

Ele compartilha recursos do sistema, mas isola processos, rede, filesystem e configuração de forma prática.

Para desenvolvimento backend, isso é extremamente útil.

---

## O que é Docker Desktop

Docker Desktop é uma aplicação para Windows, macOS e Linux que facilita o uso do Docker em ambiente local.

No Windows, ele normalmente trabalha integrado ao WSL2.

Ele oferece:

```text
Docker Engine;
Docker CLI;
interface gráfica;
integração com WSL2;
gerenciamento de containers;
gerenciamento de imagens;
configurações de recursos;
logs básicos;
volumes;
redes.
```

Nesta formação, Docker Desktop será usado como base local.

A validação será feita principalmente pelo terminal, porque terminal é o que mais se aproxima do uso real em projetos e pipelines.

---

## O que é WSL2

WSL significa:

```text
Windows Subsystem for Linux
```

Em português:

```text
Subsistema do Windows para Linux
```

WSL permite rodar um ambiente Linux dentro do Windows, sem precisar de uma máquina virtual tradicional configurada manualmente ou dual boot.

WSL2 é a versão que usa uma arquitetura mais próxima de um kernel Linux real.

Para Docker Desktop no Windows, WSL2 é uma base muito importante.

Pense assim:

```text
Windows é o sistema principal;
WSL2 fornece ambiente Linux;
Docker Desktop usa essa base para rodar containers Linux no Windows.
```

Isso permite trabalhar com ferramentas muito usadas no backend sem sair do Windows.

---

## Docker Desktop, WSL2 e Java Backend

Por que isso importa para Java Backend?

Porque uma API Java raramente depende só dela mesma.

Uma API pode precisar de:

```text
PostgreSQL;
Redis;
RabbitMQ;
Kafka;
serviço de e-mail fake;
serviço de arquivos;
observabilidade;
banco de teste;
fila de teste.
```

Em vez de instalar tudo manualmente, podemos subir com Docker.

Exemplo futuro:

```bash
docker run --name postgres-formacao -p 5432:5432 -e POSTGRES_PASSWORD=senha -d postgres
```

Ainda não vamos usar esse comando nesta aula como prática principal.

Mas ele mostra a direção.

Docker será a base para criar ambientes locais próximos do profissional.

---

## Vocabulário essencial

Antes de instalar e validar, precisamos conhecer alguns termos.

```text
imagem;
container;
registry;
pull;
run;
port;
volume;
network;
tag;
Dockerfile;
Docker Compose.
```

Nem todos serão aprofundados agora.

Mas os principais precisam estar claros.

---

## Imagem

Imagem é um pacote pronto para criar containers.

Pense como:

```text
um molde;
um template;
uma receita congelada.
```

Exemplos de imagens:

```text
hello-world;
postgres;
redis;
rabbitmq;
nginx;
eclipse-temurin;
openjdk.
```

Uma imagem contém:

```text
filesystem;
dependências;
comando padrão;
metadados;
camadas.
```

Você não "executa uma imagem" diretamente no sentido final.

Você cria um container a partir dela.

---

## Container

Container é uma instância em execução de uma imagem.

Se imagem é o molde, container é algo rodando a partir desse molde.

Exemplo:

```text
imagem: postgres
container: postgres-formacao rodando localmente
```

Você pode criar vários containers a partir da mesma imagem.

Exemplo:

```text
postgres-dev;
postgres-test;
postgres-lab.
```

Cada container pode ter:

```text
nome;
porta;
volume;
variáveis de ambiente;
rede;
estado;
logs.
```

---

## Imagem versus container

Essa diferença é fundamental.

```text
Imagem = modelo parado.
Container = execução criada a partir da imagem.
```

Analogia:

```text
Imagem é uma classe.
Container é um objeto.
```

A analogia não é perfeita, mas ajuda.

Em Java:

```text
classe define;
objeto existe em memória.
```

Em Docker:

```text
imagem define;
container roda.
```

Se você remover um container, a imagem pode continuar existindo.

Se você remover a imagem, não conseguirá criar novos containers a partir dela sem baixar ou construir de novo.

---

## Registry

Registry é um repositório de imagens.

O mais conhecido é o Docker Hub.

Quando você roda:

```bash
docker run hello-world
```

se a imagem `hello-world` não estiver local, Docker tenta baixá-la de um registry.

Esse download é chamado de:

```text
pull
```

Mais tarde, em empresas, podem existir registries privados.

Exemplos:

```text
Docker Hub;
GitHub Container Registry;
AWS ECR;
Azure Container Registry;
Google Artifact Registry;
registry interno corporativo.
```

Nesta aula, apenas entenda:

```text
imagem vem de algum lugar;
normalmente de um registry.
```

---

## Pull

`pull` significa baixar imagem.

Exemplo:

```bash
docker pull hello-world
```

Isso baixa a imagem `hello-world`.

Mas se você rodar:

```bash
docker run hello-world
```

e a imagem não existir localmente, o Docker também pode fazer o pull automaticamente.

---

## Run

`run` cria e executa um container a partir de uma imagem.

Exemplo:

```bash
docker run hello-world
```

Esse comando:

```text
procura imagem hello-world localmente;
se não existir, baixa;
cria um container;
executa;
mostra uma mensagem;
encerra.
```

Esse é o primeiro teste clássico de Docker.

---

## Portas

Containers podem expor portas.

Mas a porta dentro do container não é automaticamente a porta do Windows.

É comum mapear porta.

Exemplo futuro:

```bash
docker run -p 8080:8080 minha-api
```

Interpretação:

```text
porta 8080 do host -> porta 8080 do container.
```

Outro exemplo:

```bash
docker run -p 5432:5432 postgres
```

Interpretação:

```text
porta 5432 do Windows -> porta 5432 do PostgreSQL no container.
```

A sintaxe geral:

```text
-p porta_do_host:porta_do_container
```

Porta é uma das maiores fontes de erro em ambiente local.

---

## Volume

Container pode ser descartável.

Se você remove um container de banco sem volume, pode perder dados.

Volume é uma forma de persistir dados fora do ciclo de vida do container.

Exemplo futuro:

```bash
docker volume create dados_postgres
```

E usar no container.

Conceito:

```text
container pode morrer;
volume preserva dados.
```

Em banco de dados, volume é muito importante.

Nesta aula, apenas entenda o conceito.

Volumes serão aprofundados quando subirmos bancos e serviços reais.

---

## Variáveis de ambiente

Containers frequentemente recebem configuração por variáveis de ambiente.

Exemplo futuro para PostgreSQL:

```text
POSTGRES_PASSWORD
POSTGRES_DB
POSTGRES_USER
```

No Docker, variáveis podem ser passadas com:

```bash
-e NOME=valor
```

Exemplo conceitual:

```bash
docker run -e APP_ENV=dev minha-app
```

Atenção:

```text
não exponha senha real em scripts versionados;
use exemplos e placeholders;
em projeto real, siga política de secrets.
```

---

## Dockerfile

Dockerfile é um arquivo que descreve como construir uma imagem.

Exemplo futuro:

```dockerfile
FROM eclipse-temurin:21
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Ainda não vamos construir imagem nesta aula.

Mas é importante reconhecer o termo.

Agora estamos apenas preparando o ambiente.

---

## Docker Compose

Docker Compose permite descrever vários serviços em um arquivo, normalmente:

```text
docker-compose.yml
```

ou:

```text
compose.yml
```

Exemplo futuro:

```text
api;
postgres;
redis;
rabbitmq.
```

Com Compose, em vez de vários `docker run`, você pode usar:

```bash
docker compose up
```

Ainda não vamos aprofundar agora.

Mas será essencial para ambientes backend.

---

## Instalação do WSL2

No Windows moderno, a instalação do WSL pode ser feita pelo PowerShell com permissão de administrador.

Comando comum:

```powershell
wsl --install
```

Depois pode ser necessário reiniciar o computador.

Para verificar distribuições instaladas e versão:

```powershell
wsl -l -v
```

Você deve ver uma distribuição, como Ubuntu, usando versão 2.

Exemplo conceitual:

```text
NAME      STATE           VERSION
Ubuntu    Running         2
```

Se aparecer versão 1, será necessário ajustar.

Exemplo:

```powershell
wsl --set-version Ubuntu 2
```

O nome da distribuição pode variar.

---

## Validando WSL

Comandos úteis:

```powershell
wsl --status
wsl -l -v
wsl --version
```

Dependendo da versão do Windows e WSL, alguns comandos podem variar.

O mais importante para esta aula:

```text
WSL instalado;
uma distribuição Linux disponível;
distribuição usando WSL2;
comando wsl funcionando no PowerShell.
```

Se WSL não estiver funcionando, Docker Desktop provavelmente terá problema no Windows.

---

## Instalando Docker Desktop

Fluxo geral:

```text
baixar Docker Desktop do site oficial;
executar instalador;
habilitar uso com WSL2 quando solicitado;
reiniciar se necessário;
abrir Docker Desktop;
aguardar engine iniciar;
validar pelo terminal.
```

No Windows, durante ou após a instalação, pode ser necessário habilitar:

```text
Use WSL 2 based engine
```

Também pode ser necessário habilitar integração com a distribuição WSL usada.

No Docker Desktop, procure configurações relacionadas a:

```text
General;
Resources;
WSL Integration.
```

A interface pode mudar com versões, então use a documentação oficial quando necessário.

---

## Validando Docker

Com Docker Desktop aberto e engine rodando, no PowerShell:

```powershell
docker --version
docker version
docker info
```

Diferença:

```text
docker --version -> mostra versão do cliente Docker;
docker version -> mostra cliente e servidor/engine;
docker info -> mostra informações detalhadas da instalação.
```

Se `docker --version` funciona, mas `docker version` falha ao falar com o server, pode ser que Docker Desktop não esteja rodando.

Esse diagnóstico é importante.

---

## Primeiro teste: `hello-world`

O teste clássico:

```bash
docker run hello-world
```

O que deve acontecer:

```text
Docker procura a imagem hello-world;
se não encontrar, baixa;
cria um container;
executa;
mostra mensagem de sucesso;
encerra.
```

Se aparecer uma mensagem explicando que a instalação parece estar funcionando, o teste básico passou.

Depois, veja containers:

```bash
docker ps
docker ps -a
```

Diferença:

```text
docker ps -> containers em execução;
docker ps -a -> todos os containers, incluindo encerrados.
```

O `hello-world` encerra rápido, então aparece em `docker ps -a`.

---

## Comandos básicos

```bash
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

Interpretação:

```text
docker --version -> versão do CLI;
docker version -> cliente e engine;
docker info -> diagnóstico do ambiente;
docker run hello-world -> teste básico;
docker ps -> containers rodando;
docker ps -a -> histórico de containers;
docker images -> imagens locais.
```

Esses comandos são suficientes para preparação inicial.

---

## Limpando o container `hello-world`

Depois de rodar `hello-world`, ele cria um container encerrado.

Você pode listar:

```bash
docker ps -a
```

Para remover um container encerrado:

```bash
docker rm ID_OU_NOME
```

Exemplo conceitual:

```bash
docker rm relaxed_turing
```

Não remova containers sem entender o que são.

No início, se for apenas `hello-world`, tudo bem.

Mas em projetos reais, containers podem conter dados importantes, especialmente se forem bancos.

---

## Imagens locais

Veja imagens baixadas:

```bash
docker images
```

Você pode ver:

```text
hello-world
```

Imagem pode permanecer mesmo depois que o container encerra.

Isso é normal.

Container e imagem são coisas diferentes.

---

## Docker Desktop aberto

No Windows, Docker Desktop precisa estar aberto ou o serviço/engine precisa estar rodando.

Se você rodar:

```bash
docker ps
```

e receber erro de conexão com daemon, verifique:

```text
Docker Desktop abriu?
engine iniciou?
há erro na interface?
WSL2 está funcionando?
integração WSL está habilitada?
Windows foi reiniciado após instalação?
```

Não tente resolver no chute.

Leia a mensagem.

---

## Exemplo mínimo digitado do zero

Roteiro da prática:

```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

Registre no diário:

```text
WSL está instalado?
distribuição está em versão 2?
Docker CLI responde?
Docker Engine responde?
hello-world executou?
imagem hello-world apareceu?
container encerrado apareceu em docker ps -a?
```

Isso valida o ambiente inicial.

---

## Exemplo aplicado ao domínio corporativo

Imagine uma API backend que depende de PostgreSQL e RabbitMQ.

Sem Docker, cada pessoa instalaria:

```text
PostgreSQL;
RabbitMQ;
Erlang;
configuração de usuário;
porta;
fila;
database.
```

Com Docker, o projeto pode futuramente ter um `compose.yml` declarando serviços.

Exemplo conceitual:

```text
api-backend
postgres
rabbitmq
redis
```

Com um comando, o ambiente sobe.

Isso ajuda:

```text
onboarding;
testes locais;
integração;
padronização;
diagnóstico;
ambientes descartáveis.
```

Nesta aula, ainda não vamos criar esse compose.

Mas o `hello-world` é o primeiro passo para provar que Docker funciona.

---

## Relação futura com PostgreSQL

Na aula anterior, preparamos PostgreSQL local instalado.

Mais tarde, também poderemos rodar PostgreSQL em container.

Por que ter as duas noções?

Porque você encontrará os dois cenários:

```text
banco instalado localmente;
banco em container;
banco remoto;
banco em ambiente corporativo;
banco efêmero para testes.
```

Docker facilita criar bancos descartáveis.

Mas também exige entender volumes, portas e credenciais.

Não pule conceito.

---

## Relação futura com Java

Mais tarde, uma aplicação Java pode ser empacotada e rodar em container.

Fluxo futuro:

```text
escrever código Java;
rodar testes;
gerar JAR com Maven;
criar Dockerfile;
construir imagem;
rodar container;
mapear porta;
testar endpoint no Postman;
validar banco no DBeaver.
```

Perceba como o Módulo 0 está conectando ferramentas:

```text
Java;
Maven;
Docker;
Postman;
DBeaver;
Git;
IntelliJ.
```

Ainda não é programação profunda.

É base profissional.

---

## Docker e Git

Arquivos gerados pelo Docker não devem ser versionados.

Mas arquivos de configuração do projeto devem.

Futuramente, podem ir para Git:

```text
Dockerfile;
compose.yml;
.env.example;
scripts de setup;
documentação.
```

Não devem ir:

```text
senhas reais;
.env com segredo;
dados de volume;
arquivos gerados;
logs;
exports locais sensíveis.
```

Nesta aula, ainda não temos Dockerfile.

Mas já temos o cuidado:

```text
não versionar segredo;
não documentar senha real;
usar placeholders.
```

---

## Docker e segurança

Docker é poderoso.

Comandos Docker podem:

```text
baixar imagens;
executar processos;
mapear portas;
montar pastas;
expor serviços;
consumir memória;
remover containers;
remover volumes.
```

Então use com cuidado.

Nunca rode comandos de origem desconhecida sem entender.

Cuidado especial com:

```text
-v montando pastas do sistema;
--privileged;
expor daemon sem TLS;
executar imagens desconhecidas;
baixar imagens não confiáveis;
colocar segredos em comandos;
subir serviços expostos sem necessidade.
```

Para estudo, use comandos simples e oficiais.

---

## Docker em ambiente corporativo

Em empresa, pode haver regras específicas:

```text
licenciamento do Docker Desktop;
uso de registry interno;
imagens aprovadas;
proxy;
certificados;
política de segurança;
bloqueio de downloads;
antivírus;
restrição de virtualização;
permissões administrativas.
```

Se estiver em máquina corporativa, siga a política da empresa.

Não instale ferramentas sem autorização.

Não rode imagens desconhecidas em ambiente corporativo.

Não use dados reais em containers de estudo.

---

## Atalhos e ações úteis

### IntelliJ e terminal

| Ação | Atalho | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Rodar `docker`, `wsl` e `git` |
| Project | `Alt + 1` | Navegar em documentação |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Search Everywhere | `Shift Shift` | Buscar arquivos e ações |
| Reformatar | `Ctrl + Alt + L` | Organizar Markdown/YAML futuramente |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

### Docker Desktop

A interface muda por versão, mas procure áreas como:

```text
Containers;
Images;
Volumes;
Settings;
Resources;
WSL Integration;
Troubleshoot.
```

A prática principal desta aula é pelo terminal.

Registre atalhos úteis em:

```text
docs/atalhos.md
```

---

## Documentando o ambiente Docker

Crie ou atualize:

```text
docs/ambiente.md
```

Modelo:

```markdown
## Docker e WSL2

### Validações

```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker info
docker run hello-world
docker ps -a
docker images
```

### Resultado esperado

- WSL instalado.
- Distribuição Linux usando WSL2.
- Docker Desktop iniciado.
- Docker CLI funcionando.
- Docker Engine respondendo.
- `hello-world` executado com sucesso.

### Cuidados

- Não rodar imagens desconhecidas.
- Não expor portas sem necessidade.
- Não versionar segredos.
- Verificar política da empresa em ambiente corporativo.
```

Isso cria rastreabilidade.

---

## Erros comuns

### Erro 1 — WSL não instalado

Sintoma:

```text
Docker Desktop reclama de WSL2;
comando wsl não funciona;
Docker não inicia corretamente.
```

Diagnóstico:

```powershell
wsl --status
wsl -l -v
```

---

### Erro 2 — Distribuição em WSL1

Docker Desktop no Windows moderno normalmente espera WSL2.

Diagnóstico:

```powershell
wsl -l -v
```

Se a distribuição aparecer com versão 1, ajuste para versão 2.

---

### Erro 3 — Docker Desktop fechado

Sintoma:

```text
docker --version funciona,
mas docker version falha no servidor.
```

Possível causa:

```text
CLI instalada, mas engine não está rodando.
```

Correção:

```text
abrir Docker Desktop;
aguardar inicializar;
rodar docker version novamente.
```

---

### Erro 4 — Virtualização desabilitada

Docker/WSL2 dependem de recursos de virtualização.

Sintomas podem variar.

Correção pode envolver:

```text
habilitar virtualização na BIOS/UEFI;
habilitar recursos do Windows;
atualizar Windows;
seguir documentação oficial.
```

Não altere BIOS sem cuidado.

---

### Erro 5 — Docker sem integração WSL

Sintoma:

```text
Docker funciona no Windows, mas não na distribuição WSL;
comandos dentro do WSL não encontram Docker;
integração desabilitada.
```

Correção:

```text
verificar Docker Desktop Settings > Resources > WSL Integration.
```

---

### Erro 6 — Porta em uso

Ao rodar containers futuros com `-p`, pode aparecer erro de porta ocupada.

Exemplo:

```text
porta 5432 já usada por PostgreSQL local.
```

Correção:

```text
usar outra porta no host;
parar serviço conflitante;
entender quem usa a porta.
```

Exemplo futuro:

```bash
-p 5433:5432
```

significa:

```text
porta 5433 no Windows -> porta 5432 no container.
```

---

### Erro 7 — Confundir imagem e container

Erro comum:

```text
apaguei container e achei que apaguei imagem;
apaguei imagem e não entendi por que não roda mais sem baixar;
container parado confundido com imagem.
```

Correção:

```bash
docker ps -a
docker images
```

Use os dois comandos e compare.

---

### Erro 8 — Apagar volume sem entender

Volume pode conter dados.

Remover volume pode apagar banco local.

Correção:

```text
não remover volumes sem saber o que contêm.
```

Nesta aula, não vamos remover volumes.

---

### Erro 9 — Rodar comando copiado sem entender

Docker pode montar pastas, expor portas e executar processos.

Não copie comandos aleatórios.

Leia cada parâmetro.

---

### Erro 10 — Achar que Docker substitui entendimento do serviço

Rodar PostgreSQL em container não elimina a necessidade de entender PostgreSQL.

Rodar Java em container não elimina a necessidade de entender Java.

Docker organiza execução.

Não substitui conhecimento.

---

## Diagnóstico inicial de Docker

Quando algo falhar, siga o roteiro.

### 1. WSL funciona?

```powershell
wsl --status
wsl -l -v
```

### 2. Docker CLI existe?

```powershell
docker --version
```

### 3. Docker Engine responde?

```powershell
docker version
```

### 4. Docker Desktop está aberto?

Verifique interface.

### 5. Docker info funciona?

```powershell
docker info
```

### 6. Hello-world roda?

```bash
docker run hello-world
```

### 7. O container aparece no histórico?

```bash
docker ps -a
```

### 8. A imagem aparece?

```bash
docker images
```

### 9. Há erro de porta?

Leia mensagem.

### 10. Há erro de permissão, WSL ou virtualização?

Volte para WSL, Docker Desktop e documentação oficial.

---

## Checklist de preparação

Use este checklist:

```markdown
# Checklist — Docker Desktop e WSL2

- [ ] WSL instalado.
- [ ] `wsl --status` executado.
- [ ] `wsl -l -v` executado.
- [ ] Distribuição Linux usando WSL2.
- [ ] Docker Desktop instalado.
- [ ] Docker Desktop aberto e engine iniciado.
- [ ] WSL2 backend habilitado quando aplicável.
- [ ] Integração WSL verificada quando aplicável.
- [ ] `docker --version` executado.
- [ ] `docker version` executado.
- [ ] `docker info` executado.
- [ ] `docker run hello-world` executado com sucesso.
- [ ] `docker ps -a` usado para ver container encerrado.
- [ ] `docker images` usado para ver imagem local.
- [ ] Diferença entre imagem e container entendida.
- [ ] Conceito de porta entendido.
- [ ] Conceito de volume entendido.
- [ ] Diário de bordo atualizado.
```

Checklist concluído significa:

```text
Docker preparado para estudos futuros.
```

Não significa domínio profundo de Docker ainda.

---

## Prática recomendada

Execute:

```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

Crie ou atualize:

```text
docs/ambiente.md
docs/docker-basico.md
docs/diario-de-bordo.md
docs/atalhos.md
```

Modelo para `docs/docker-basico.md`:

````markdown
# Docker básico

## Conceitos

- Imagem
- Container
- Registry
- Pull
- Run
- Porta
- Volume
- Docker Desktop
- WSL2

## Comandos

```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

## Observações

- Imagem é o modelo.
- Container é a execução.
- `hello-world` valida a instalação.
- `docker ps` mostra containers rodando.
- `docker ps -a` mostra todos os containers.
- `docker images` mostra imagens locais.
- Não versionar segredos.
- Não rodar imagens desconhecidas sem critério.
````

Depois valide Git:

```bash
git status
git diff
git add docs/ambiente.md docs/docker-basico.md docs/diario-de-bordo.md docs/atalhos.md
git diff --staged
git commit -m "Documenta preparacao de Docker Desktop e WSL2"
git status
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 018 — Docker Desktop e WSL2 preparação

### O que aprendi
Aprendi que Docker permite executar containers e que, no Windows, Docker Desktop normalmente usa WSL2 como base para containers Linux.

### Conceitos principais
- Docker
- Docker Desktop
- WSL2
- Imagem
- Container
- Registry
- Pull
- Run
- Porta
- Volume
- Docker Engine
- Docker CLI

### O que pratiquei
Validei WSL, Docker Desktop, Docker CLI, Docker Engine e executei `hello-world`.

### Comandos usados
```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

### Atalhos úteis
- `Alt + F12` — terminal integrado.
- `Alt + 1` — Project.
- `Ctrl + Shift + A` — buscar ação.
- `Ctrl + Alt + L` — reformatar.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- confundir imagem com container;
- achar que `docker --version` prova que engine está rodando;
- esquecer Docker Desktop fechado;
- ignorar WSL2;
- mapear porta sem entender;
- apagar volume sem saber o impacto;
- rodar imagem desconhecida sem critério;
- colocar segredo em comando ou documentação.

### Próximo passo
Organizar a estrutura profissional do repositório de curso.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é Docker;
explicar o que é Docker Desktop;
explicar o que é WSL2;
explicar por que Docker é útil em backend;
diferenciar imagem e container;
explicar registry e pull;
explicar docker run;
explicar conceito de porta;
explicar conceito de volume;
validar wsl --status;
validar wsl -l -v;
validar docker --version;
validar docker version;
validar docker info;
executar docker run hello-world;
listar containers com docker ps;
listar todos com docker ps -a;
listar imagens com docker images;
diagnosticar Docker Desktop fechado;
diagnosticar WSL ausente ou versão incorreta;
entender que target futuro é usar containers para banco e serviços;
não rodar comandos desconhecidos sem entender;
não expor segredos;
registrar a aula no diário;
usar atalhos úteis quando conveniente.
```

Não precisa ainda criar Dockerfile.

Não precisa ainda usar Docker Compose.

Não precisa ainda containerizar aplicação Java.

O objetivo é preparar a base.

---

## Fechamento da aula

Hoje preparamos Docker Desktop e WSL2.

Essa preparação será muito importante mais tarde.

Quando começarmos a trabalhar com backend real, Docker vai ajudar a subir dependências de forma reproduzível.

A formação vai usar Docker para aproximar o ambiente local do ambiente profissional.

Mas a ideia não é virar especialista em Docker agora.

A ideia é sair desta aula sabendo:

```text
Docker está instalado;
WSL2 está funcionando;
Docker Desktop iniciou;
Docker CLI conversa com Docker Engine;
hello-world rodou;
imagem e container são coisas diferentes;
porta e volume são conceitos importantes;
segurança importa.
```

Na próxima aula, vamos organizar a estrutura profissional do repositório de curso.

Isso vai fechar a preparação de arquivos, pastas, README, docs, src, commits por aula e padrões de nome antes do checklist final do ambiente.
