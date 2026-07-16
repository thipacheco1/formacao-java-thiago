# 697 - M20.27 - Guia de execucao local

## Apresentação da aula

Na aula 696, você criou o README profissional do OrderFlow.

O projeto passou a possuir:

- proposta clara;
- destaques técnicos;
- arquitetura visual;
- descrição dos módulos;
- stack organizada por propósito;
- segurança documentada;
- confiabilidade explicada;
- observabilidade apresentada;
- estratégia de testes;
- CI/CD;
- deploy simulado;
- quickstart;
- links para OpenAPI;
- links para Postman;
- evidências;
- decisões e trade-offs;
- limitações conhecidas;
- posicionamento profissional.

O README apresenta o projeto.

Agora precisamos permitir que outra pessoa execute o projeto localmente de forma previsível.

Nesta aula, você criará o guia completo de execução local do OrderFlow.

Esse guia será diferente do quickstart.

O quickstart responde:

```text
qual e o caminho mais curto
para validar o projeto?
```

O guia local responde:

```text
como preparar uma maquina,
configurar o ambiente,
subir dependencias,
executar migrations,
iniciar aplicacoes,
validar saude,
executar smoke tests,
investigar falhas,
encerrar
e resetar
sem depender de conhecimento previo?
```

O leitor precisa conseguir seguir o documento sem conversar com o autor.

O guia deve ser útil para:

- novo desenvolvedor;
- QA;
- avaliador técnico;
- colega de equipe;
- pessoa em entrevista;
- mantenedor;
- consumidor que deseja reproduzir a demonstração.

A execução local pode acontecer em dois modos:

```text
modo container completo;

modo hibrido
com infraestrutura em containers
e aplicacoes executadas pela IDE.
```

Os dois modos serão documentados.

O modo recomendado para validação rápida será:

```text
container completo.
```

O modo recomendado para desenvolvimento será:

```text
infraestrutura em containers
+
aplicacoes na IDE.
```

A aula também criará scripts de diagnóstico para reduzir problemas comuns de ambiente.

A próxima aula será:

```text
698 - M20.28 - Runbook do projeto
```

Na aula 698, você criará procedimentos operacionais para incidentes, degradações, backlog de Outbox, consumer lag, DLQ, provider indisponível, falha de banco, falha de broker, rollback, recuperação e comunicação.

Nesta aula, o foco será preparar e executar o ambiente local.

Não serão criados procedimentos formais de resposta a incidentes de produção.

O laboratório será:

```text
labs/m20/aula-697-guia-de-execucao-local/orderflow-local-guide
```

Regra central:

```text
um guia local profissional
nao presume conhecimento oculto;

ele transforma pre-requisitos,
configuracao,
comandos,
validacoes
e recuperacao basica
em um caminho reproduzivel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
694:
Documentacao OpenAPI.

695:
Postman Collection.

696:
README profissional.

697:
Guia de execucao local.

698:
Runbook do projeto.

699:
Evidencias finais do projeto.
```

O guia local reutiliza artifacts existentes:

- Maven Wrapper;
- Dockerfiles;
- Docker Compose;
- `.env.example`;
- scripts de build;
- scripts de subida;
- health checks;
- smoke tests;
- OpenAPI;
- Postman;
- dashboards;
- reports;
- evidence.

A aula 697 não deve criar uma segunda forma paralela de iniciar o sistema.

Ela deve documentar e validar os caminhos oficiais.

Quando um comando do guia divergir de um script existente, corrija o script ou o documento.

Não aceite:

```text
na minha maquina funciona.
```

O objetivo é:

```text
funciona
em uma maquina preparada
segundo pre-requisitos documentados.
```

---

## Objetivo prático

Será criada a estrutura:

```text
docs/local-execution
├── README.md
├── LOCAL_EXECUTION_CHARTER.md
├── PREREQUISITES.md
├── WINDOWS_SETUP.md
├── LINUX_SETUP.md
├── MACOS_SETUP.md
├── ENVIRONMENT_CONFIGURATION.md
├── EXECUTION_MODES.md
├── FULL_CONTAINER_MODE.md
├── HYBRID_IDE_MODE.md
├── DATABASE_INITIALIZATION.md
├── KAFKA_INITIALIZATION.md
├── OBSERVABILITY_LOCAL.md
├── HEALTH_VALIDATION.md
├── SMOKE_TEST_GUIDE.md
├── POSTMAN_LOCAL_GUIDE.md
├── LOGS_AND_DIAGNOSTICS.md
├── SHUTDOWN_AND_RESET.md
├── LOCAL_TROUBLESHOOTING.md
├── LOCAL_EXECUTION_CHECKLIST.md
├── LOCAL_EXECUTION_MATRIX.md
├── LOCAL_EXECUTION_RISK_REGISTER.md
├── LOCAL_EXECUTION_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/local
├── check-prerequisites.ps1
├── check-ports.ps1
├── create-local-env.ps1
├── validate-local-env.ps1
├── build-local.ps1
├── start-infrastructure.ps1
├── start-full-stack.ps1
├── wait-local-health.ps1
├── validate-migrations.ps1
├── run-local-smoke.ps1
├── collect-local-diagnostics.ps1
├── stop-local.ps1
├── reset-local.ps1
└── collect-local-evidence.ps1
```

Artifacts:

```text
reports/local-execution-report.yaml

contracts/local-execution-evidence.yaml
```

Arquivo principal do guia:

```text
docs/local-execution/README.md
```

O README principal do repositório apontará para esse documento somente depois que ele existir e passar no gate.

---

## Conceito essencial

### Pré-requisito precisa ser verificável

Não escreva apenas:

```text
tenha Docker instalado.
```

Escreva:

- versão mínima;
- comando de verificação;
- resultado esperado;
- link para troubleshooting;
- impacto quando ausente.

### Configuração precisa ter fonte

Cada variável precisa de:

- nome;
- finalidade;
- obrigatoriedade;
- valor local seguro;
- origem;
- formato;
- classificação sensível;
- componente consumidor.

### Subida precisa ter ordem

O ambiente possui dependências:

```text
PostgreSQL;

Kafka;

topics;

observabilidade;

migrations;

aplicacoes;

smoke.
```

A ordem deve ser automatizada quando possível.

### Health não substitui smoke

Health comprova que o componente está disponível.

Smoke comprova que uma jornada mínima funciona.

### Reset é destrutivo

Um reset precisa:

- avisar;
- confirmar;
- remover somente recursos locais;
- preservar evidências;
- nunca apontar para produção;
- registrar o que foi apagado.

---

## Mão na massa guiada

### 1. Criar Local Execution Charter

Arquivo:

```text
docs/local-execution/LOCAL_EXECUTION_CHARTER.md
```

Princípios:

```text
commands are copyable;

versions are explicit;

secrets are never committed;

local data is synthetic;

startup is validated;

health and smoke are separate;

destructive actions require confirmation;

Windows is first-class;

incident runbooks belong to lesson 698.
```

---

### 2. Criar guia principal

Arquivo:

```text
docs/local-execution/README.md
```

Estrutura:

1. objetivo;
2. modos de execução;
3. pré-requisitos;
4. preparação;
5. configuração;
6. build;
7. modo container;
8. modo híbrido;
9. validação;
10. OpenAPI e Postman;
11. logs;
12. encerramento;
13. reset;
14. troubleshooting;
15. checklist.

---

### 3. Criar Prerequisites

Arquivo:

```text
docs/local-execution/PREREQUISITES.md
```

Ferramentas:

- Git;
- JDK 21;
- Docker Engine ou Docker Desktop;
- Docker Compose v2;
- PowerShell 7 recomendado no Windows;
- navegador;
- Postman opcional;
- IntelliJ IDEA opcional;
- k6 somente para aula de performance.

---

### 4. Definir versões mínimas

Exemplo de baseline:

```text
Java:
21.

Docker Engine:
versao com Compose v2.

Git:
versao moderna com suporte a line endings configuraveis.

PowerShell:
7 ou superior recomendado.
```

Use as versões reais suportadas pelo projeto.

---

### 5. Criar script de pré-requisitos

Arquivo:

```text
scripts/local/check-prerequisites.ps1
```

O script executa:

```powershell
git --version

java --version

docker --version

docker compose version

pwsh --version
```

Quando `pwsh` não existir no Windows PowerShell tradicional, o script informa a alternativa suportada.

---

### 6. Validar Java

Comando:

```powershell
java --version
```

Resultado esperado:

```text
Java 21.
```

Também valide:

```powershell
javac --version
```

O JRE sozinho não é suficiente para desenvolvimento.

---

### 7. Validar Maven Wrapper

Comando:

```powershell
.\mvnw.cmd --version
```

No Linux e macOS:

```bash
./mvnw --version
```

O projeto não exige Maven global.

---

### 8. Validar Docker

Execute:

```powershell
docker info
```

O comando precisa confirmar que o daemon está ativo.

---

### 9. Validar Compose

Execute:

```powershell
docker compose version
```

Não use o comando legado `docker-compose` como caminho oficial.

---

### 10. Validar recursos locais

Recomendação inicial:

- memória disponível suficiente para PostgreSQL, Kafka, observabilidade e cinco aplicações;
- espaço em disco para imagens e volumes;
- virtualização habilitada quando necessária;
- CPU compatível com execução local.

Não transforme recomendação em garantia universal.

---

## Preparação por sistema operacional

### 11. Criar Windows Setup

Arquivo:

```text
docs/local-execution/WINDOWS_SETUP.md
```

Inclua:

- JDK Temurin 21;
- `JAVA_HOME`;
- `PATH`;
- Docker Desktop;
- WSL2 quando utilizado;
- PowerShell;
- Git line endings;
- portas;
- antivirus e volumes quando causarem lentidão.

---

### 12. Validar `JAVA_HOME` no Windows

```powershell
$env:JAVA_HOME

Get-Command java

Get-Command javac
```

O executável precisa apontar para o JDK esperado.

---

### 13. Configurar line endings

Sugestão:

```powershell
git config `
  --global `
  core.autocrlf true
```

A configuração depende da política do repositório.

Confirme `.gitattributes`.

---

### 14. Criar Linux Setup

Arquivo:

```text
docs/local-execution/LINUX_SETUP.md
```

Inclua:

- JDK 21;
- Docker;
- permissões do daemon;
- Compose plugin;
- execução do wrapper;
- limite de arquivos quando necessário.

---

### 15. Criar macOS Setup

Arquivo:

```text
docs/local-execution/MACOS_SETUP.md
```

Inclua:

- JDK 21;
- Docker Desktop ou alternativa suportada;
- arquitetura ARM e imagens compatíveis;
- PowerShell ou scripts shell equivalentes.

---

### 16. Não documentar instalação insegura

Evite comandos que baixam e executam scripts remotos sem validação.

Prefira documentação oficial de cada ferramenta.

---

## Clone e validação inicial

### 17. Clonar o repositório

No guia real:

```powershell
git clone <URL-REAL-DO-REPOSITORIO>

Set-Location orderflow
```

Substitua a URL somente quando o repositório real estiver definido.

Não use caminho local da máquina do autor.

---

### 18. Validar branch e estado

```powershell
git branch --show-current

git status --short
```

O guia deve informar a branch estável recomendada.

---

### 19. Validar estrutura mínima

Confirme a presença de:

```text
pom.xml;

mvnw;

mvnw.cmd;

apps;

libs;

infrastructure/docker;

scripts;

docs.
```

---

### 20. Executar validação rápida

```powershell
.\mvnw.cmd `
  --batch-mode `
  -DskipTests `
  validate
```

Essa etapa detecta problemas de POM e wrapper antes do build completo.

---

## Portas

### 21. Criar inventário de portas

Exemplo local:

```text
8080:
OrderFlow API.

3000:
Grafana.

9090:
Prometheus.

4317:
OTLP gRPC interno ou exposto quando necessário.

4318:
OTLP HTTP interno ou exposto quando necessário.

29092:
Kafka externo opcional.

5432:
PostgreSQL externo apenas no override de desenvolvimento.
```

Use as portas reais do compose.

---

### 22. Criar `check-ports.ps1`

O script valida conflitos.

Exemplo:

```powershell
Get-NetTCPConnection `
  -State Listen `
  -ErrorAction SilentlyContinue
```

No Linux e macOS, documente alternativas.

---

### 23. Não publicar portas desnecessárias

No modo container completo, PostgreSQL e Kafka podem permanecer internos.

Publique somente quando o desenvolvedor precisar de acesso direto.

---

## Configuração do ambiente

### 24. Criar Environment Configuration

Arquivo:

```text
docs/local-execution/ENVIRONMENT_CONFIGURATION.md
```

Categorias:

- aplicação;
- banco;
- Kafka;
- segurança;
- observabilidade;
- providers;
- performance;
- debug.

---

### 25. Criar `.env` local

Fonte:

```text
infrastructure/docker/.env.example
```

Comando:

```powershell
Copy-Item `
  infrastructure/docker/.env.example `
  infrastructure/docker/.env
```

O arquivo `.env` deve estar ignorado pelo Git.

---

### 26. Criar script de ambiente

`create-local-env.ps1`:

- copia template;
- não sobrescreve sem confirmação;
- gera valores locais quando seguro;
- deixa secrets vazios quando exigem entrada;
- valida `.gitignore`;
- imprime somente nomes, nunca valores sensíveis.

---

### 27. Criar catálogo de variáveis

Tabela:

- variável;
- componente;
- obrigatória;
- sensível;
- exemplo local;
- descrição.

---

### 28. Validar banco

Variáveis:

```text
POSTGRES_DB;

POSTGRES_USER;

POSTGRES_PASSWORD.
```

A senha é exclusivamente local.

Não reutilize credencial real.

---

### 29. Validar Kafka

Variáveis:

- bootstrap servers;
- topic prefix;
- consumer groups;
- cluster ID quando aplicável.

Containers usam hostname do serviço.

A máquina host usa listener externo somente quando habilitado.

---

### 30. Validar segurança local

Defina:

- issuer local ou simulado;
- audience;
- token source;
- usuário sintético;
- tenant sintético;
- scopes;
- roles.

Não desabilite toda a segurança como caminho padrão.

---

### 31. Validar observabilidade

Variáveis:

- OTLP endpoint;
- service name;
- environment;
- sampling;
- metrics export.

No modo container, use hostnames internos.

Na IDE, use portas expostas do collector.

---

### 32. Validar providers

URLs dos providers precisam apontar para:

- WireMock;
- stub local;
- simulador controlado.

Nunca use endpoint real sem autorização.

---

### 33. Criar `validate-local-env.ps1`

O script verifica:

- arquivo existe;
- required preenchidas;
- URLs válidas;
- portas numéricas;
- nenhuma URL de produção;
- nenhum valor de exemplo proibido;
- nenhum secret exposto em output.

---

## Modos de execução

### 34. Criar Execution Modes

Arquivo:

```text
docs/local-execution/EXECUTION_MODES.md
```

Modo A:

```text
full-container.
```

Modo B:

```text
hybrid-IDE.
```

Explique benefícios e limites de cada modo.

---

### 35. Full-container

Benefícios:

- reproduzível;
- simples para avaliação;
- mesma rede;
- mesmos entrypoints;
- pouca configuração na IDE.

Limites:

- build mais lento;
- debugging menos direto;
- consumo maior.

---

### 36. Hybrid-IDE

Benefícios:

- breakpoints;
- hot reload quando disponível;
- testes rápidos;
- logs no IDE.

Limites:

- configuração de host diferente;
- múltiplos processos;
- maior chance de porta conflitante;
- exige compreender cada aplicação.

---

## Build

### 37. Criar `build-local.ps1`

O script executa:

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Depois, opcionalmente:

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  build
```

---

### 38. Documentar primeiro build

O primeiro build pode demorar mais por:

- download de dependências;
- construção de imagens;
- pull de bases;
- criação de cache.

Não forneça promessa de tempo.

---

### 39. Tratar falha de wrapper

Verifique:

- permissão de execução;
- proxy;
- certificado;
- Java;
- arquivo corrompido;
- line endings.

---

### 40. Tratar proxy corporativo

Documente configuração de:

- Maven;
- Docker;
- Git;
- certificados.

Não inclua credencial real.

---

## Modo container completo

### 41. Criar Full Container Mode

Arquivo:

```text
docs/local-execution/FULL_CONTAINER_MODE.md
```

Fluxo:

1. validar ferramentas;
2. criar `.env`;
3. validar portas;
4. validar compose;
5. build;
6. up;
7. health;
8. migrations;
9. smoke;
10. OpenAPI;
11. Postman.

---

### 42. Validar compose

```powershell
docker compose `
  --env-file infrastructure/docker/.env `
  -f infrastructure/docker/compose.yaml `
  config
```

A saída não deve revelar secrets em evidence.

---

### 43. Subir ambiente

```powershell
docker compose `
  --env-file infrastructure/docker/.env `
  -f infrastructure/docker/compose.yaml `
  --profile core `
  --profile observability `
  up `
  -d
```

---

### 44. Criar `start-full-stack.ps1`

O script:

- chama validators;
- executa pull quando configurado;
- executa build quando solicitado;
- sobe profiles;
- espera health;
- mostra URLs;
- não imprime secrets.

---

### 45. Verificar estado

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  ps
```

Status esperados:

- running;
- healthy;
- completed com sucesso para init jobs.

---

### 46. Verificar logs iniciais

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  logs `
  --tail 100
```

Procure:

- migration error;
- connection refused persistente;
- authentication failure;
- topic failure;
- secret leak.

---

## Banco e migrations

### 47. Criar Database Initialization

Arquivo:

```text
docs/local-execution/DATABASE_INITIALIZATION.md
```

Explique:

- container PostgreSQL;
- volume;
- database;
- user;
- Flyway;
- version table;
- migrations automáticas ou job dedicado.

---

### 48. Validar PostgreSQL

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  exec `
  postgres `
  pg_isready
```

---

### 49. Validar migrations

O script `validate-migrations.ps1` consulta:

- versão;
- status;
- checksum;
- pending;
- failed.

Resultado esperado:

```text
zero migration pendente;

zero migration failed.
```

---

### 50. Não editar migration aplicada

O guia precisa alertar:

```text
crie nova migration;
nao altere checksum historico.
```

---

### 51. Documentar reset de banco

Reset local remove volume somente com confirmação.

Nunca execute reset automático durante startup.

---

## Kafka

### 52. Criar Kafka Initialization

Arquivo:

```text
docs/local-execution/KAFKA_INITIALIZATION.md
```

Explique:

- broker;
- KRaft;
- listeners;
- topics;
- init job;
- consumer groups;
- retry topics;
- DLQ.

---

### 53. Validar broker

Use comando suportado pela imagem para listar metadata ou topics.

O guia precisa usar o comando real da imagem escolhida.

---

### 54. Validar topics

Confirme topics principais:

- commands;
- results;
- projections;
- retries;
- DLQ.

---

### 55. Validar consumer groups

Durante o smoke, grupos devem aparecer e processar records.

---

### 56. Tratar listener incorreto

Sintomas:

- host conecta e container não;
- container conecta e host não;
- advertised listener aponta para localhost dentro da rede.

Documente diferença entre hostname interno e externo.

---

## Observabilidade

### 57. Criar Observability Local

Arquivo:

```text
docs/local-execution/OBSERVABILITY_LOCAL.md
```

URLs:

- Grafana;
- Prometheus;
- collector health quando exposto;
- API actuator.

---

### 58. Validar Prometheus

Confirme:

- readiness;
- targets;
- scrape da API;
- scrape dos workers;
- regras carregadas.

---

### 59. Validar Grafana

Confirme:

- health;
- datasource;
- dashboards;
- dados do smoke.

---

### 60. Validar traces

Execute smoke e procure uma trace pela correlation.

Quando backend de traces não estiver incluído no compose, documente a limitação real.

---

## Health

### 61. Criar Health Validation

Arquivo:

```text
docs/local-execution/HEALTH_VALIDATION.md
```

Diferencie:

- startup;
- liveness;
- readiness;
- dependency health;
- journey health.

---

### 62. Criar `wait-local-health.ps1`

O script espera:

- PostgreSQL;
- Kafka;
- API;
- workers;
- observabilidade;
- init jobs.

Ele possui timeout e diagnóstico.

---

### 63. Validar API readiness

```powershell
Invoke-RestMethod `
  -Uri `
  "http://localhost:8080/actuator/health/readiness"
```

---

### 64. Validar liveness

```powershell
Invoke-RestMethod `
  -Uri `
  "http://localhost:8080/actuator/health/liveness"
```

---

### 65. Não aceitar health genérico apenas

Quando possível, valide componentes relevantes separadamente.

---

## Smoke

### 66. Criar Smoke Test Guide

Arquivo:

```text
docs/local-execution/SMOKE_TEST_GUIDE.md
```

Jornada mínima:

1. readiness;
2. token de teste;
3. registrar pedido;
4. replay idempotente;
5. consultar pedido;
6. verificar Outbox;
7. verificar projection;
8. verificar métricas.

---

### 67. Criar `run-local-smoke.ps1`

O script:

- usa dados sintéticos;
- gera correlation;
- gera key;
- não registra token;
- falha com código diferente de zero;
- gera summary;
- limpa dados quando seguro.

---

### 68. Validar replay

O smoke deve comprovar:

- mesmo order ID;
- `replayed`;
- uma única criação funcional.

---

### 69. Validar assíncrono

Use polling com timeout.

Não use espera infinita.

---

### 70. Registrar evidence local

Campos:

- environment;
- release ou commit;
- health;
- order ID sanitizado quando necessário;
- correlation;
- final status;
- duration;
- result.

---

## OpenAPI e Postman

### 71. Validar OpenAPI

URLs locais:

```text
/v3/api-docs;

Swagger UI configurada.
```

Confirme que a versão é a mesma documentada no README.

---

### 72. Criar Postman Local Guide

Arquivo:

```text
docs/local-execution/POSTMAN_LOCAL_GUIDE.md
```

Passos:

- importar collection;
- importar environment;
- preencher secret local sem exportar;
- validar base URL;
- executar Setup;
- executar Happy Path;
- executar coleção negativa;
- sanitizar reports.

---

### 73. Executar Postman CLI

Use o script oficial da aula 695.

Não duplique lógica.

---

## Modo híbrido na IDE

### 74. Criar Hybrid IDE Mode

Arquivo:

```text
docs/local-execution/HYBRID_IDE_MODE.md
```

Fluxo:

1. subir somente infraestrutura;
2. configurar profile local;
3. iniciar API;
4. iniciar publisher;
5. iniciar workers;
6. validar health;
7. executar smoke.

---

### 75. Criar `start-infrastructure.ps1`

Profiles:

- data;
- messaging;
- observability;
- providers simulados.

Aplicações Java ficam fora do compose nesse modo.

---

### 76. Configurar hostnames para IDE

Na IDE, use:

```text
localhost
```

para serviços expostos.

Nos containers, use nomes dos serviços.

Não misture.

---

### 77. Criar run configurations

Para cada aplicação:

- main class;
- local profile;
- environment variables;
- port;
- VM options;
- module classpath;
- working directory.

---

### 78. Definir ordem de startup na IDE

Ordem recomendada:

1. infraestrutura;
2. API;
3. Outbox Publisher;
4. Orchestration Worker;
5. Integration Gateway;
6. Projection Worker.

O health deve confirmar cada etapa.

---

### 79. Evitar portas duplicadas

Cada aplicação com actuator precisa de porta definida.

Valide antes de iniciar.

---

### 80. Debuggar uma jornada

Use:

- correlation ID;
- breakpoint no handler;
- logs estruturados;
- consumer group isolado quando necessário;
- provider simulado.

Não pause consumer por tempo excessivo em ambiente compartilhado.

---

## Logs e diagnóstico

### 81. Criar Logs and Diagnostics

Arquivo:

```text
docs/local-execution/LOGS_AND_DIAGNOSTICS.md
```

Comandos:

```powershell
docker compose logs orderflow-api

docker compose logs outbox-publisher

docker compose logs orchestration-worker

docker compose logs integration-gateway

docker compose logs projection-worker
```

---

### 82. Filtrar correlation

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  logs `
| Select-String `
  "docs-example-0001"
```

---

### 83. Criar `collect-local-diagnostics.ps1`

Colete:

- compose config sanitizado;
- `docker compose ps`;
- health;
- logs recentes;
- migration status;
- topics;
- consumer groups;
- Outbox summary;
- disk;
- Docker info resumido.

---

### 84. Sanitizar diagnostics

Remova:

- Authorization;
- token;
- password;
- private key;
- secret;
- dados pessoais.

---

## Encerramento e reset

### 85. Criar Shutdown and Reset

Arquivo:

```text
docs/local-execution/SHUTDOWN_AND_RESET.md
```

Três ações:

```text
stop:
para processos.

down:
remove containers e redes,
preserva volumes.

reset:
remove volumes locais
com confirmacao.
```

---

### 86. Criar `stop-local.ps1`

O script:

- encerra aplicações;
- preserva volumes;
- mostra estado final;
- não apaga evidence.

---

### 87. Criar `reset-local.ps1`

Parâmetros:

- `-ConfirmDestructive`;
- project name;
- environment permitido.

O script bloqueia host não local.

---

### 88. Limpar imagens com cuidado

Não use:

```text
docker system prune -a
```

como comando padrão.

Isso pode remover recursos de outros projetos.

---

## Troubleshooting

### 89. Criar Local Troubleshooting

Arquivo:

```text
docs/local-execution/LOCAL_TROUBLESHOOTING.md
```

Organize por sintoma.

---

### 90. Java errado

Sintomas:

- release version not supported;
- wrapper usa JDK antigo;
- IDE e terminal divergem.

Solução:

- revisar `JAVA_HOME`;
- revisar PATH;
- revisar SDK do projeto;
- reiniciar terminal.

---

### 91. Docker daemon parado

Sintoma:

```text
Cannot connect to the Docker daemon.
```

Solução:

- iniciar engine;
- validar contexto;
- validar WSL2;
- executar `docker info`.

---

### 92. Porta ocupada

Identifique processo.

Decida:

- encerrar processo;
- alterar override;
- não alterar contrato base sem necessidade.

---

### 93. PostgreSQL unhealthy

Verifique:

- senha;
- volume antigo;
- disk;
- migration;
- logs;
- health command.

---

### 94. Kafka unhealthy

Verifique:

- cluster ID;
- listeners;
- volume;
- advertised listener;
- topic init;
- logs.

---

### 95. API não sobe

Verifique:

- datasource;
- Kafka;
- issuer;
- audience;
- porta;
- migration;
- profile;
- env.

---

### 96. Worker não consome

Verifique:

- topic;
- group;
- bootstrap;
- deserializer;
- Inbox;
- lag;
- offset;
- DLQ.

---

### 97. Outbox cresce

Verifique:

- publisher;
- lease;
- Kafka;
- retry;
- clock;
- transaction.

O procedimento operacional aprofundado pertence à aula 698.

---

### 98. Swagger não abre

Verifique:

- profile;
- path;
- security;
- API readiness;
- configuração de exposição.

---

### 99. Postman retorna `401`

Verifique:

- token;
- issuer;
- audience;
- expiração;
- environment;
- header.

---

### 100. Smoke falha após reset

Verifique:

- migrations;
- topic init;
- provider simulator;
- token setup;
- readiness.

---

## Governança

### 101. Criar Local Execution Checklist

Arquivo:

```text
docs/local-execution/LOCAL_EXECUTION_CHECKLIST.md
```

Checklist:

- ferramentas;
- versões;
- portas;
- env;
- build;
- compose;
- migrations;
- topics;
- health;
- smoke;
- OpenAPI;
- Postman;
- shutdown;
- reset;
- evidence.

---

### 102. Criar Local Execution Matrix

Arquivo:

```text
docs/local-execution/LOCAL_EXECUTION_MATRIX.md
```

Colunas:

- etapa;
- comando;
- pré-condição;
- resultado esperado;
- falha comum;
- documento;
- script;
- evidence.

---

### 103. Criar Risk Register

Arquivo:

```text
docs/local-execution/LOCAL_EXECUTION_RISK_REGISTER.md
```

Riscos:

```text
JDK incorreto;

Docker parado;

porta ocupada;

env versionado;

secret impresso;

listener incorreto;

volume antigo;

migration divergente;

health superficial;

smoke ausente;

reset destrutivo;

guia divergente dos scripts;

comando exclusivo da maquina do autor.
```

---

### 104. Criar Traceability

Arquivo:

```text
docs/local-execution/LOCAL_EXECUTION_TRACEABILITY.md
```

Exemplo:

```text
Docker architecture
-> compose
-> full container guide
-> startup evidence.

Flyway policy
-> migration guide
-> validation script
-> migration evidence.

API documentation
-> local OpenAPI URL
-> Postman guide
-> smoke evidence.

README quickstart
-> local execution guide
-> official scripts.
```

---

### 105. Criar boundary da próxima aula

Arquivo:

```text
docs/local-execution/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 697 define:

- prerequisites;
- OS setup;
- clone;
- ports;
- environment configuration;
- full container mode;
- hybrid IDE mode;
- PostgreSQL initialization;
- Kafka initialization;
- observability;
- health;
- smoke;
- OpenAPI;
- Postman;
- logs;
- shutdown;
- reset;
- local troubleshooting;
- local evidence.

A aula 698 define:

- operational runbook;
- incident classification;
- Outbox backlog;
- consumer lag;
- DLQ growth;
- provider outage;
- database failure;
- Kafka failure;
- security incident;
- degraded mode;
- rollback;
- recovery;
- communication;
- post-incident evidence.

Procedimentos formais de incidente
nao sao criados nesta aula.
```

---

## Validação completa do guia

### 106. Executar em máquina limpa ou ambiente limpo

O melhor teste é seguir o guia sem conhecimento prévio.

Quando não houver segunda máquina, use:

- novo diretório;
- volumes removidos;
- env recriado;
- cache não assumido;
- checklist independente.

---

### 107. Executar modo container completo

Passos:

```powershell
.\scripts\local\check-prerequisites.ps1

.\scripts\local\create-local-env.ps1

.\scripts\local\validate-local-env.ps1

.\scripts\local\check-ports.ps1

.\scripts\local\build-local.ps1

.\scripts\local\start-full-stack.ps1

.\scripts\local\wait-local-health.ps1

.\scripts\local\validate-migrations.ps1

.\scripts\local\run-local-smoke.ps1
```

---

### 108. Executar modo híbrido

Valide:

- infraestrutura;
- IDE;
- profiles;
- ports;
- health;
- smoke;
- shutdown.

---

### 109. Validar encerramento

Execute:

```powershell
.\scripts\local\stop-local.ps1
```

Confirme volumes preservados.

---

### 110. Validar reset

Em ambiente descartável:

```powershell
.\scripts\local\reset-local.ps1 `
  -ConfirmDestructive
```

Depois, repita startup e smoke.

---

### 111. Validar links do guia

Todos os links relativos precisam existir.

Não inclua caminhos da máquina local.

---

### 112. Validar comandos

Cada comando precisa ter sido executado ou validado por script.

Não publique comando meramente provável.

---

### 113. Criar report

Arquivo:

```text
reports/local-execution-report.yaml
```

Exemplo:

```yaml
localExecution:
  modes:
    fullContainer:
      PASS
    hybridIDE:
      PASS

  prerequisites:
    Git:
      PASS
    Java21:
      PASS
    Docker:
      PASS
    ComposeV2:
      PASS

  startup:
    PostgreSQL:
      PASS
    Kafka:
      PASS
    migrations:
      PASS
    API:
      PASS
    workers:
      PASS
    observability:
      PASS

  validation:
    health:
      PASS
    smoke:
      PASS
    OpenAPI:
      PASS
    Postman:
      PASS

  reset:
    PASS

  operationalRunbook:
    completed:
      false

  gate:
    PASS
```

---

### 114. Criar evidence

Arquivo:

```text
contracts/local-execution-evidence.yaml
```

Campos:

- lesson;
- project;
- operating system;
- Java version;
- Docker version;
- Compose version;
- PowerShell version;
- prerequisite status;
- port check status;
- env creation status;
- env validation status;
- build status;
- compose config status;
- full container startup status;
- hybrid infrastructure status;
- migration status;
- topic initialization status;
- API readiness status;
- worker health status;
- Prometheus status;
- Grafana status;
- smoke status;
- replay status;
- async status;
- OpenAPI status;
- Postman status;
- shutdown status;
- reset status;
- restart after reset status;
- broken command count;
- broken link count;
- secret leak count;
- operational runbook completed;
- documentation status;
- gate status;
- timestamp.

---

### 115. Criar gate local

Status:

```text
PASS;

FAIL_LOCAL_GUIDE_STRUCTURE;

FAIL_PREREQUISITES;

FAIL_JAVA_VERSION;

FAIL_MAVEN_WRAPPER;

FAIL_DOCKER;

FAIL_COMPOSE;

FAIL_PORT_CHECK;

FAIL_ENV_CREATION;

FAIL_ENV_VALIDATION;

FAIL_BUILD;

FAIL_COMPOSE_CONFIG;

FAIL_POSTGRESQL_STARTUP;

FAIL_KAFKA_STARTUP;

FAIL_MIGRATION;

FAIL_TOPIC_INITIALIZATION;

FAIL_API_STARTUP;

FAIL_WORKER_STARTUP;

FAIL_OBSERVABILITY_STARTUP;

FAIL_HEALTH;

FAIL_SMOKE;

FAIL_IDEMPOTENCY_REPLAY;

FAIL_ASYNC_VALIDATION;

FAIL_OPENAPI_LOCAL;

FAIL_POSTMAN_LOCAL;

FAIL_HYBRID_MODE;

FAIL_SHUTDOWN;

FAIL_RESET;

FAIL_RESTART_AFTER_RESET;

FAIL_COMMAND;

FAIL_LINK;

FAIL_SECRET_LEAK;

FAIL_RUNBOOK_ANTICIPATION;

INCONCLUSIVE.
```

---

### 116. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\local\check-prerequisites.ps1

.\scripts\local\validate-local-env.ps1

.\scripts\local\check-ports.ps1

.\scripts\local\run-local-smoke.ps1

.\scripts\local\collect-local-evidence.ps1
```

Confirme:

- guia reproduzível;
- dois modos;
- comandos válidos;
- secrets protegidos;
- health;
- smoke;
- reset;
- restart;
- runbook formal preservado para a aula 698.

---

### 117. Encerrar o laboratório

Confirme:

- Charter;
- guia principal;
- prerequisites;
- Windows;
- Linux;
- macOS;
- clone;
- branch;
- structure;
- ports;
- env;
- build;
- full container;
- hybrid IDE;
- PostgreSQL;
- Flyway;
- Kafka;
- observability;
- health;
- smoke;
- OpenAPI;
- Postman;
- logs;
- diagnostics;
- shutdown;
- reset;
- troubleshooting;
- checklist;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- runbook não criado.

---

## Entendendo o que foi feito

### O quickstart ganhou um complemento real

O README continua curto.

O guia local contém os detalhes.

### Pré-requisitos ficaram verificáveis

Ferramentas e versões possuem comandos de validação.

### A configuração ganhou rastreabilidade

Cada variável possui finalidade e classificação.

### Dois modos foram documentados

Avaliação rápida e desenvolvimento possuem caminhos próprios.

### Infraestrutura ganhou sequência clara

PostgreSQL, Kafka, migrations, apps e observabilidade são validados.

### Health e smoke foram separados

Disponibilidade e jornada funcional possuem provas diferentes.

### Reset ficou seguro

Ação destrutiva exige confirmação e limita ambiente.

### O diagnóstico ficou reproduzível

Logs, status, migrations, topics e recursos podem ser coletados.

### A próxima camada ficou preservada

Incidentes e recuperação operacional serão tratados no runbook.

---

## Erros comuns importantes

### Presumir Java correto

Terminal e IDE podem usar JDKs diferentes.

### Presumir Docker ativo

Cliente instalado não significa daemon disponível.

### Usar `localhost` entre containers

Containers precisam usar hostname do serviço.

### Versionar `.env`

Secrets locais podem vazar.

### Publicar todas as portas

A superfície local aumenta sem necessidade.

### Ignorar migrations

Aplicação pode subir sobre schema incorreto.

### Tratar health como smoke

A jornada pode continuar quebrada.

### Usar reset sem confirmação

Dados locais são perdidos.

### Recomendar prune global

Outros projetos podem ser afetados.

### Criar incident runbook agora

A operação formal pertence à aula 698.

---

## Comandos úteis

### Pré-requisitos

```powershell
.\scripts\local\check-prerequisites.ps1
```

### Subir tudo

```powershell
.\scripts\local\start-full-stack.ps1
```

### Validar saúde

```powershell
.\scripts\local\wait-local-health.ps1
```

### Executar smoke

```powershell
.\scripts\local\run-local-smoke.ps1
```

### Encerrar

```powershell
.\scripts\local\stop-local.ps1
```

---

## Exercício guiado

Reproduza localmente o fluxo:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. validar ferramentas;
2. validar portas;
3. criar env;
4. validar env;
5. build;
6. subir PostgreSQL;
7. validar Flyway;
8. subir Kafka;
9. validar topics;
10. subir observabilidade;
11. subir API;
12. subir publisher;
13. subir workers;
14. validar health;
15. obter token;
16. registrar pedido;
17. replay;
18. solicitar estoque;
19. solicitar pagamento;
20. receber recusa;
21. observar compensação;
22. validar projection;
23. abrir Grafana;
24. filtrar logs;
25. encerrar;
26. resetar em ambiente descartável;
27. repetir smoke;
28. criar evidence.

Não crie procedimentos formais de incidente.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 696 e ponte para a aula 698 foram preservadas;
- Local Execution Charter foi criado;
- guia principal foi criado;
- Prerequisites foi criado;
- versões mínimas foram definidas;
- script de pré-requisitos foi criado;
- Java foi validado;
- Maven Wrapper foi validado;
- Docker foi validado;
- Compose foi validado;
- recursos locais foram documentados;
- Windows Setup foi criado;
- `JAVA_HOME` foi validado;
- line endings foram tratados;
- Linux Setup foi criado;
- macOS Setup foi criado;
- instalação insegura foi evitada;
- clone foi documentado;
- branch e estado foram validados;
- estrutura mínima foi validada;
- validação rápida foi executada;
- inventário de portas foi criado;
- port check foi criado;
- portas desnecessárias não foram publicadas;
- Environment Configuration foi criada;
- `.env` local foi criado;
- script de ambiente foi criado;
- catálogo de variáveis foi criado;
- banco foi validado;
- Kafka foi validado;
- segurança local foi validada;
- observabilidade foi validada;
- providers foram validados;
- local env validator foi criado;
- Execution Modes foi criado;
- full-container foi explicado;
- hybrid-IDE foi explicado;
- build local foi criado;
- primeiro build foi explicado;
- falha de wrapper foi tratada;
- proxy foi tratado;
- Full Container Mode foi criado;
- compose foi validado;
- ambiente foi iniciado;
- start-full-stack foi criado;
- estado foi verificado;
- logs iniciais foram verificados;
- Database Initialization foi criada;
- PostgreSQL foi validado;
- migrations foram validadas;
- edição de migration aplicada foi proibida;
- reset de banco foi documentado;
- Kafka Initialization foi criada;
- broker foi validado;
- topics foram validados;
- consumer groups foram validados;
- listeners foram explicados;
- Observability Local foi criada;
- Prometheus foi validado;
- Grafana foi validado;
- traces foram tratados;
- Health Validation foi criada;
- wait-local-health foi criado;
- readiness foi validada;
- liveness foi validada;
- health genérico foi evitado;
- Smoke Test Guide foi criado;
- run-local-smoke foi criado;
- replay foi validado;
- assíncrono foi validado;
- evidence local foi registrada;
- OpenAPI local foi validada;
- Postman Local Guide foi criado;
- Postman CLI oficial foi reutilizado;
- Hybrid IDE Mode foi criado;
- start-infrastructure foi criado;
- hostnames foram diferenciados;
- run configurations foram criadas;
- ordem de startup foi definida;
- portas duplicadas foram evitadas;
- debug de jornada foi documentado;
- Logs and Diagnostics foi criado;
- logs por componente foram documentados;
- filtro por correlation foi criado;
- diagnostics script foi criado;
- diagnostics foram sanitizados;
- Shutdown and Reset foi criado;
- stop-local foi criado;
- reset-local foi criado;
- prune global foi evitado;
- Local Troubleshooting foi criado;
- Java errado foi tratado;
- Docker parado foi tratado;
- porta ocupada foi tratada;
- PostgreSQL unhealthy foi tratado;
- Kafka unhealthy foi tratado;
- API não sobe foi tratada;
- worker não consome foi tratado;
- Outbox cresce foi tratado sem antecipar runbook;
- Swagger não abre foi tratado;
- Postman `401` foi tratado;
- smoke após reset foi tratado;
- checklist foi criado;
- matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 698 foi criado;
- guia foi testado em ambiente limpo;
- modo container foi executado;
- modo híbrido foi executado;
- encerramento foi validado;
- reset foi validado;
- links foram validados;
- comandos foram validados;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- runbook operacional não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\validate-secrets.ps1

.\scripts\local\check-prerequisites.ps1

.\scripts\local\validate-local-env.ps1
```

Adicione:

```powershell
git add `
  docs/local-execution `
  scripts/local `
  reports/local-execution-report.yaml `
  contracts/local-execution-evidence.yaml `
  README.md `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|C:\\Users\\|/home/[^/]+/|/mnt/data|productionUrl|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(local): publish reproducible OrderFlow execution guide"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- secret;
- caminho da máquina;
- endpoint real;
- dado pessoal;
- procedimento formal da aula 698.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou o Guia de execução local do OrderFlow.

Você documentou:

```text
prerequisites;

OS setup;

clone;

ports;

environment configuration;

full container mode;

hybrid IDE mode;

build;

PostgreSQL;

Flyway;

Kafka;

topics;

observability;

health;

smoke;

OpenAPI;

Postman;

logs;

diagnostics;

shutdown;

reset;

troubleshooting;

report e gate.
```

O projeto agora pode ser preparado e executado por outra pessoa sem depender de conhecimento oculto.

A próxima aula será:

```text
698 - M20.28 - Runbook do projeto
```

Nela, você criará procedimentos operacionais para classificar incidentes, responder a backlog de Outbox, consumer lag, DLQ, provider indisponível, falha de PostgreSQL, falha de Kafka, regressão de segurança, degradação, rollback, recuperação e comunicação.

O runbook operacional não foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei pré-requisitos.
- [ ] Documentei Windows, Linux e macOS.
- [ ] Documentei portas.
- [ ] Criei `.env` seguro.
- [ ] Validei build.
- [ ] Executei modo container.
- [ ] Executei modo híbrido.
- [ ] Validei PostgreSQL e Flyway.
- [ ] Validei Kafka e topics.
- [ ] Validei observabilidade.
- [ ] Validei health e smoke.
- [ ] Validei OpenAPI e Postman.
- [ ] Testei shutdown e reset.
- [ ] Criei troubleshooting.
- [ ] Preservei runbook para a aula 698.

---

## Troubleshooting adicional

### Wrapper não executa no Linux

Aplique permissão de execução no arquivo versionado conforme política.

### Docker Desktop consome muita memória

Revise limites e profiles iniciados.

### Kafka demora para ficar healthy

Revise recursos, listeners e volume antigo.

### Migration falha somente após reset

Revise ordem e dependências entre migrations.

### IDE conecta ao hostname do container

No host, use porta publicada e `localhost`.

### Container tenta conectar em localhost

Use nome do serviço na rede Docker.

### Prometheus target está down

Revise actuator, path, network e labels.

### Postman funciona e smoke script falha

Compare headers, token, base URL e idempotency key.

### Reset não remove volume

Revise project name usado na criação.

### Quero criar procedimento para incidente

Essa etapa pertence à aula 698.

---

## Perguntas de revisão

1. Quickstart e guia local são iguais?
2. O que um pré-requisito precisa ter?
3. Maven global é obrigatório?
4. JRE é suficiente para desenvolver?
5. Por que validar Docker daemon?
6. Qual Compose usar?
7. Por que validar portas?
8. `.env` deve ser versionado?
9. Qual é o modo mais reproduzível?
10. Qual modo facilita debug?
11. Container usa localhost para outro container?
12. IDE usa hostname interno do Docker?
13. O que Flyway valida?
14. Health substitui smoke?
15. O que replay comprova?
16. Por que usar polling com timeout?
17. O que reset remove?
18. Por que evitar prune global?
19. O que diagnostics precisa sanitizar?
20. Onde ficam incidentes operacionais?
21. O que evidence local prova?
22. O que a aula 698 fará?
23. O que não foi criado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Versão, comando e resultado.
3. Não.
4. Não.
5. Cliente não garante engine.
6. Compose v2.
7. Evitar conflito.
8. Não.
9. Full-container.
10. Hybrid-IDE.
11. Não.
12. Normalmente localhost publicado.
13. Schema e checksums.
14. Não.
15. Idempotência.
16. Evitar espera infinita.
17. Dados locais e volumes selecionados.
18. Afeta outros projetos.
19. Secrets e dados sensíveis.
20. Runbook.
21. Reprodutibilidade.
22. Criar runbook operacional.
23. Procedimentos formais de incidente.
24. Runbook do projeto.
25. Eliminar conhecimento oculto.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 697 - M20.27 - Guia de execucao local

- Continuei após README profissional.
- Criei Local Execution Charter.
- Criei guia principal.
- Criei Prerequisites.
- Defini versões mínimas.
- Criei check-prerequisites.
- Validei Java e javac.
- Validei Maven Wrapper.
- Validei Docker.
- Validei Compose v2.
- Documentei recursos locais.
- Criei Windows Setup.
- Validei JAVA_HOME.
- Tratei line endings.
- Criei Linux Setup.
- Criei macOS Setup.
- Evitei instalação insegura.
- Documentei clone e branch.
- Validei estrutura mínima.
- Executei Maven validate.
- Criei inventário de portas.
- Criei check-ports.
- Reduzi portas publicadas.
- Criei Environment Configuration.
- Criei `.env` local.
- Criei create-local-env.
- Criei catálogo de variáveis.
- Validei banco.
- Validei Kafka.
- Validei segurança local.
- Validei observabilidade.
- Validei providers simulados.
- Criei validate-local-env.
- Criei Execution Modes.
- Documentei full-container.
- Documentei hybrid-IDE.
- Criei build-local.
- Documentei primeiro build.
- Tratei wrapper e proxy.
- Criei Full Container Mode.
- Validei compose.
- Criei start-full-stack.
- Verifiquei estado e logs.
- Criei Database Initialization.
- Validei PostgreSQL.
- Validei Flyway.
- Protegi migrations aplicadas.
- Documentei reset de banco.
- Criei Kafka Initialization.
- Validei broker.
- Validei topics e groups.
- Expliquei listeners.
- Criei Observability Local.
- Validei Prometheus.
- Validei Grafana.
- Tratei traces.
- Criei Health Validation.
- Criei wait-local-health.
- Validei readiness e liveness.
- Criei Smoke Test Guide.
- Criei run-local-smoke.
- Validei replay e fluxo assíncrono.
- Registrei evidence local.
- Validei OpenAPI local.
- Criei Postman Local Guide.
- Reutilizei scripts do Postman.
- Criei Hybrid IDE Mode.
- Criei start-infrastructure.
- Diferenciei hostnames.
- Criei run configurations.
- Defini ordem de startup.
- Evitei portas duplicadas.
- Documentei debug por correlation.
- Criei Logs and Diagnostics.
- Criei collect-local-diagnostics.
- Sanitizei diagnostics.
- Criei Shutdown and Reset.
- Criei stop-local.
- Criei reset-local.
- Evitei prune global.
- Criei Local Troubleshooting.
- Tratei Java, Docker, portas, PostgreSQL e Kafka.
- Tratei API, workers, Outbox, Swagger e Postman.
- Criei Local Execution Checklist.
- Criei Local Execution Matrix.
- Criei Local Execution Risk Register.
- Criei Local Execution Traceability.
- Criei boundary para a aula 698.
- Testei em ambiente limpo.
- Executei os dois modos.
- Validei shutdown e reset.
- Validei links e comandos.
- Criei report, evidence e gate.
- Não antecipei runbook operacional.
- Próxima aula: Runbook do projeto.
```

---

## Referência técnica curta

- Local Development Environment.
- Prerequisite Check.
- Maven Wrapper.
- Docker Compose.
- Environment Variable.
- `.env`.
- Full-Container Mode.
- Hybrid IDE Mode.
- Flyway.
- Kafka Listener.
- Health Check.
- Liveness.
- Readiness.
- Smoke Test.
- Correlation ID.
- Diagnostics.
- Shutdown.
- Reset.
- Troubleshooting.
- Reproducibility.

Regra final:

```text
O Guia de execução local do OrderFlow deve permitir que uma pessoa prepare e valide o projeto sem conhecimento oculto: prerequisites registram versões e comandos para Git, Java 21, javac, Maven Wrapper, Docker, Compose v2 e PowerShell, guias de Windows, Linux e macOS tratam JAVA_HOME, PATH, permissions, WSL2, line endings e arquitetura, clone e estrutura são validados antes do build, port inventory e check-ports evitam conflitos, `.env` nasce do template, permanece ignorado e é validado sem imprimir secrets, configuration catalog separa banco, Kafka, security, observability e providers, full-container mode valida compose, constrói imagens, sobe PostgreSQL, Kafka, init jobs, observability, API e workers e espera health, hybrid-IDE sobe infraestrutura e executa aplicações com profiles, hostnames e portas corretos, Flyway comprova schema e checksums, Kafka comprova broker, topics e consumer groups, readiness e liveness não substituem smoke, smoke registra pedido, valida replay, Outbox, Kafka, projection e métricas com polling limitado, OpenAPI e Postman são validados pelos artifacts oficiais, logs e diagnostics usam correlation e sanitização, stop preserva volumes, reset exige confirmação e nunca usa prune global como padrão, troubleshooting organiza sintomas de Java, Docker, portas, PostgreSQL, Kafka, API, workers, Outbox, Swagger e Postman, e o gate termina com dois modos, commands, links, health, smoke, reset, report e evidence aprovados, enquanto incident classification, backlog response, DLQ recovery, provider outage, database failure, broker failure, rollback, communication and post-incident procedures permanecem reservados para a aula 698.
```
