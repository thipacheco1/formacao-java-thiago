# 512 - M17.07 - Release strategy fundamentos

## Apresentação da aula

Na aula 511, você tornou a saúde da aplicação verificável.

A stack passou a possuir:

```text
healthcheck da imagem;

healthcheck da aplicação;

healthcheck do Kafka;

liveness;

readiness;

startup gating;

estados starting,
healthy
e unhealthy;

scripts de verificação;

testes de falha
e recuperação.
```

A aplicação agora consegue informar:

```text
estou viva?

estou pronta?

minha dependência inicial
está saudável?

o container está
em condição operacional?
```

Esses sinais são fundamentais para qualquer estratégia de release.

Sem healthcheck confiável, uma implantação pode terminar com:

- processo iniciado, mas aplicação indisponível;
- container `Up`, porém endpoint quebrado;
- versão nova recebendo tráfego antes de estar pronta;
- rollback tardio;
- erro detectado apenas pelo usuário;
- release considerada concluída sem evidência.

A pergunta central desta aula será:

```text
como colocar
uma nova versão
em um ambiente

reduzindo risco,
preservando evidências
e mantendo
um caminho de retorno?
```

A resposta não será uma única ferramenta.

Release strategy é um conjunto de decisões.

Ela precisa definir:

```text
qual artefato será promovido;

qual ambiente receberá primeiro;

como o tráfego será direcionado;

quais sinais serão observados;

quanto tempo observar;

qual risco é aceitável;

quando continuar;

quando pausar;

quando reverter;

quem decide;

como registrar.
```

Nesta aula, você irá estudar e comparar:

```text
recreate;

rolling update;

blue-green;

canary;

shadow;

A/B testing;

progressive delivery.
```

Nem todas serão implementadas.

O objetivo é compreender fundamentos e preparar o projeto para releases futuras.

A aplicação atual roda localmente com Docker Compose.

Compose não oferece, por si só, todos os mecanismos necessários para:

- balanceamento de tráfego;
- rollout nativo;
- controle percentual;
- readiness gates distribuídos;
- promoção automática;
- rollback orquestrado;
- múltiplas réplicas com service discovery avançado.

Mesmo assim, ele é suficiente para praticar princípios fundamentais:

- tag imutável;
- promoção do mesmo artefato;
- validação antes e depois;
- plano de rollback;
- critérios objetivos;
- janela de observação;
- checklist;
- runbook;
- registro da decisão.

A aula utilizará duas versões conceituais da aplicação:

```text
versão atual:

5.0.0.

versão candidata:

5.1.0.
```

Os números são didáticos.

O processo será:

```text
construir;

identificar;

validar;

promover;

observar;

decidir;

registrar;

reverter quando necessário.
```

Um princípio será obrigatório:

```text
build once,
promote many.
```

Isso significa:

```text
o mesmo artefato
que foi validado

deve ser promovido
entre ambientes.
```

Não faça:

```text
build diferente
para homologação;

outro build
para produção.
```

Cada build adicional pode introduzir diferenças:

- dependências novas;
- base image atualizada;
- timestamp;
- arquivo alterado;
- cache diferente;
- variável embutida;
- commit distinto.

Configuração muda por ambiente.

O artefato promovido deve permanecer o mesmo.

A aula também diferenciará:

```text
deploy;

release;

rollout;

rollback;

roll-forward.
```

#### Deploy

Colocar uma versão no ambiente.

#### Release

Disponibilizar uma mudança para uso.

Deploy e release podem acontecer juntos ou separados.

A próxima aula abordará feature flags, que permitem separar esses dois momentos.

Nesta aula, essa separação será apenas conceitual.

#### Rollout

Processo de distribuir a versão.

#### Rollback

Voltar para uma versão anterior conhecida.

#### Roll-forward

Corrigir avançando para uma nova versão.

A aula não criará feature flags.

Também não implementará:

- traffic splitting real;
- canary automatizado;
- blue-green com proxy;
- Kubernetes Deployment;
- GitHub Actions;
- registry remoto;
- assinatura de imagem;
- política de admission;
- banco com migração complexa.

A próxima aula será:

```text
513 - M17.08 - Feature flags
```

Portanto, esta aula preparará a base conceitual e operacional para separar deploy de release, sem antecipar a implementação.

Ao final, você deverá explicar:

```text
por que tag imutável
é importante;

por que promover
o mesmo digest;

como diferenciar
deploy e release;

quando usar recreate;

quando rolling
reduz indisponibilidade;

como blue-green
facilita rollback;

como canary
reduz exposição;

por que rollback
precisa ser testado;

como definir
go/no-go;

como usar health,
logs
e métricas
na decisão.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
510:
Variaveis secrets e configuracao.

511:
Healthcheck em containers.

512:
Release strategy fundamentos.

513:
Feature flags.

514:
CI/CD visao geral.
```

A aula 511 respondeu:

```text
como saber
se uma versão
está viva
e pronta?
```

A aula 512 responderá:

```text
como usar
esses sinais

para colocar
uma nova versão
em operação
com controle?
```

Nesta aula:

```text
release strategy:
sim.

deploy:
sim.

release:
sim.

rollout:
sim.

rollback:
sim.

roll-forward:
sim.

recreate:
sim.

rolling:
sim.

blue-green:
sim.

canary:
sim.

shadow:
sim.

A/B:
conceitual.

progressive delivery:
conceitual.

go/no-go:
sim.

janela de observação:
sim.

artefato imutável:
sim.

digest:
sim.

promoção:
sim.

rollback rehearsal:
sim.

feature flag:
somente ponte conceitual.

CI/CD:
não.

Kubernetes:
não.

traffic splitting real:
não.
```

A regra central será:

```text
release segura
promove um artefato conhecido,
observa sinais objetivos
e preserva
um retorno praticável.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
compose.release.yaml

scripts/release
├── build-release-candidate.ps1
├── validate-release-candidate.ps1
├── promote-local-release.ps1
├── rollback-local-release.ps1
└── compare-release-images.ps1

docs/devops/release
├── RELEASE_STRATEGY_OVERVIEW.md
├── RELEASE_DECISION_MATRIX.md
├── RELEASE_PLAN_TEMPLATE.md
├── GO_NO_GO_CHECKLIST.md
├── ROLLBACK_PLAN.md
├── RELEASE_OBSERVATION_GUIDE.md
├── RELEASE_EVIDENCE.md
└── RELEASE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
candidata identificada;

tag imutável;

digest registrado;

baseline validada;

release plan;

go/no-go checklist;

rollback plan;

janela de observação;

ensaio local;

evidências;

decisão registrada.
```

Você irá:

1. confirmar a baseline;
2. definir terminologia;
3. revisar estratégias;
4. criar matriz de decisão;
5. definir artefato candidato;
6. criar tag;
7. registrar digest;
8. comparar imagem atual e candidata;
9. validar health;
10. validar smoke test;
11. validar segurança;
12. validar configuração;
13. criar release plan;
14. criar go/no-go;
15. criar rollback plan;
16. definir sinais;
17. definir thresholds;
18. definir janela;
19. definir owners;
20. ensaiar recreate;
21. ensaiar rollback;
22. simular falha;
23. decidir rollback versus roll-forward;
24. registrar evidências;
25. criar scripts;
26. documentar limitações;
27. executar gate;
28. commitar;
29. preparar a aula 513.

---

## Conceito essencial

### Artefato imutável

Uma imagem promovida não deve mudar de conteúdo.

Uma tag reutilizada pode esconder mudança.

Exemplo perigoso:

```text
app:latest
```

hoje aponta para um digest.

Amanhã pode apontar para outro.

Para release controlada, use:

```text
tag versionada;

digest registrado.
```

Exemplo:

```text
formacao-java/m16-integrations:5.1.0
```

---

### Tag

Tag é um nome humano.

Ela facilita:

- leitura;
- promoção;
- rollback;
- comunicação.

Ela pode ser mutável.

Por isso, não confie apenas nela.

---

### Digest

Digest identifica o conteúdo da imagem.

Exemplo conceitual:

```text
sha256:...
```

A combinação ideal é:

```text
tag legível;

digest registrado.
```

---

### Build once, promote many

A mesma imagem deve atravessar ambientes.

Mudam:

- secrets;
- URLs;
- recursos;
- política;
- escala.

Não muda:

- bytecode;
- JAR;
- base;
- filesystem da imagem.

---

### Deploy versus release

Deploy:

```text
versão instalada.
```

Release:

```text
mudança disponível
para o usuário.
```

Sem feature flags, normalmente os dois acontecem juntos.

Com feature flags, podem ser separados.

---

### Recreate

Estratégia:

```text
parar versão atual;

iniciar versão nova.
```

Vantagens:

- simples;
- fácil de compreender;
- baixo custo operacional.

Riscos:

- indisponibilidade;
- rollback também exige restart;
- perda de capacidade durante troca.

Adequada para:

- laboratório;
- ambiente interno;
- sistema com janela de manutenção;
- serviço sem requisito de zero downtime.

---

### Rolling update

Estratégia:

```text
substituir instâncias
gradualmente.
```

Vantagens:

- reduz indisponibilidade;
- usa a mesma infraestrutura;
- permite observar durante rollout.

Riscos:

- versões convivem;
- compatibilidade precisa existir;
- rollback pode ser gradual;
- erros podem se espalhar.

---

### Blue-green

Estratégia:

```text
blue:
versão ativa.

green:
versão candidata.
```

A candidata é preparada em paralelo.

Depois, o tráfego muda.

Vantagens:

- rollback rápido por troca de tráfego;
- validação antes da promoção;
- ambientes completos.

Riscos:

- custo duplicado;
- banco compartilhado;
- sincronização;
- drift;
- migrações incompatíveis.

---

### Canary

Estratégia:

```text
pequena parcela
recebe a versão nova.
```

Depois, a exposição aumenta.

Vantagens:

- reduz blast radius;
- coleta sinais reais;
- permite pausa.

Riscos:

- análise mais complexa;
- roteamento necessário;
- métricas segmentadas;
- amostra insuficiente;
- usuários inconsistentes.

---

### Shadow

A versão nova recebe cópia do tráfego, mas sua resposta não afeta o usuário.

Vantagens:

- observar comportamento real;
- comparar desempenho;
- reduzir risco funcional.

Riscos:

- efeitos colaterais;
- custo duplicado;
- dados sensíveis;
- idempotência;
- divergência.

Shadow não deve executar operações destrutivas sem proteção.

---

### A/B testing

A/B testing mede comportamento de usuários entre variantes.

Objetivo principal:

```text
experimento de produto.
```

Não é sinônimo de canary.

Canary reduz risco técnico.

A/B mede resultado de negócio.

---

### Progressive delivery

Progressive delivery combina:

- rollout gradual;
- análise;
- gates;
- automação;
- rollback;
- feature flags;
- observabilidade.

Nesta aula, será apenas um conceito.

---

### Compatibilidade

Estratégias com convivência de versões exigem:

- API compatível;
- evento compatível;
- schema compatível;
- banco compatível;
- configuração compatível.

Uma versão nova não deve impedir a antiga de funcionar antes do ponto de compromisso.

---

### Migração expand-contract

Abordagem:

```text
expand:

adicionar estrutura compatível.

migrate:

usar nova estrutura.

contract:

remover antiga depois.
```

Esse padrão reduz risco quando versões convivem.

Não será implementado nesta aula.

---

### Go/no-go

Go/no-go é uma decisão.

Ela precisa de critérios prévios.

Exemplos:

```text
testes verdes;

imagem assinada
quando aplicável;

health saudável;

erro dentro do limite;

latência dentro do limite;

backlog estável;

rollback testado;

owner disponível.
```

Não decida somente por sensação.

---

### Janela de observação

Após a implantação, observe por um período definido.

A janela depende de:

- volume;
- criticidade;
- frequência do fluxo;
- latência;
- batch;
- horário;
- SLO.

Cinco minutos podem ser insuficientes para um job diário.

---

### Rollback

Rollback precisa responder:

- qual versão anterior;
- qual tag;
- qual digest;
- qual comando;
- quais dados;
- quais migrações;
- qual tempo;
- quem executa;
- como validar.

Rollback não é:

```text
depois a gente vê.
```

---

### Roll-forward

Às vezes, voltar é mais arriscado.

Exemplos:

- dados já migrados;
- evento novo publicado;
- contrato consumido;
- mudança irreversível.

Nesse caso, pode ser melhor corrigir avançando.

A decisão precisa estar no plano.

---

### Blast radius

Blast radius é o alcance potencial do problema.

Recreate:

```text
todo o serviço.
```

Canary:

```text
pequena parcela.
```

Blue-green:

```text
todo o tráfego
após a troca,
mas retorno rápido.
```

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Valide a stack:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --build
```

Execute:

```powershell
.\scripts\health\verify-healthchecks.ps1
```

---

### 2. Registrar a versão atual

Liste:

```powershell
docker image ls `
  "formacao-java/m16-integrations"
```

Defina:

```text
current:
5.0.0.

candidate:
5.1.0.
```

Use as versões reais geradas no laboratório.

Não invente digest.

---

### 3. Construir a candidata

```powershell
docker buildx build `
  --load `
  --tag `
  "formacao-java/m16-integrations:5.1.0" `
  .
```

O builder precisa executar testes.

---

### 4. Obter o digest local

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.1.0" `
  --format `
  "{{index .RepoDigests 0}}"
```

Imagens locais ainda não publicadas podem não possuir `RepoDigests`.

Nesse caso, registre o image ID:

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.1.0" `
  --format `
  "{{.Id}}"
```

Em registry, o digest de distribuição será a referência de promoção.

---

### 5. Criar labels de release

Passe build args controlados:

```text
version;

revision;

created.
```

No Dockerfile:

```dockerfile
ARG APP_VERSION="unknown"
ARG VCS_REF="unknown"
ARG BUILD_DATE="unknown"

LABEL org.opencontainers.image.version="${APP_VERSION}"
LABEL org.opencontainers.image.revision="${VCS_REF}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
```

Não use labels para secrets.

---

### 6. Construir com metadata

```powershell
$Revision =
  git rev-parse HEAD

$BuildDate =
  (Get-Date).ToUniversalTime().
    ToString("yyyy-MM-ddTHH:mm:ssZ")

docker buildx build `
  --load `
  --build-arg `
  "APP_VERSION=5.1.0" `
  --build-arg `
  "VCS_REF=${Revision}" `
  --build-arg `
  "BUILD_DATE=${BuildDate}" `
  --tag `
  "formacao-java/m16-integrations:5.1.0" `
  .
```

Metadata não muda comportamento da aplicação.

---

### 7. Inspecionar a candidata

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.1.0" `
  --format `
  "{{json .Config.Labels}}"
```

Confirme:

- version;
- revision;
- created;
- title;
- description.

---

### 8. Comparar atual e candidata

Crie:

```text
scripts/release/compare-release-images.ps1
```

Compare:

- image ID;
- created;
- size;
- user;
- entrypoint;
- healthcheck;
- labels;
- exposed ports;
- architecture;
- base quando disponível.

Diferença de tamanho precisa ser investigada, não automaticamente rejeitada.

---

### 9. Criar release plan

Arquivo:

```text
RELEASE_PLAN_TEMPLATE.md
```

Campos:

```markdown
## Identificação

Versão:
Commit:
Image:
Digest:
Data:
Owner:

## Escopo

## Risco

## Pré-requisitos

## Estratégia

## Passos

## Validação

## Janela de observação

## Go/no-go

## Rollback

## Comunicação

## Evidências
```

---

### 10. Criar matriz de decisão

Arquivo:

```text
RELEASE_DECISION_MATRIX.md
```

Exemplo:

```markdown
| Estratégia | Downtime | Infra duplicada | Tráfego gradual | Rollback |
|---|---:|---:|---:|---|
| Recreate | Sim | Não | Não | Reinício |
| Rolling | Baixo | Parcial | Por instância | Gradual |
| Blue-green | Baixo | Sim | Troca | Rápido |
| Canary | Baixo | Sim | Sim | Retirar canary |
| Shadow | Não no usuário | Sim | Cópia | Desligar cópia |
```

Adicione:

- complexidade;
- compatibilidade;
- custo;
- observabilidade;
- uso recomendado.

---

### 11. Escolher a estratégia local

Para o Compose atual:

```text
recreate controlado.
```

Justificativa:

- uma instância;
- sem proxy;
- sem balanceador;
- sem múltiplos ambientes;
- laboratório local;
- objetivo pedagógico.

A escolha precisa ser explícita.

Não chame o processo de rolling ou blue-green.

---

### 12. Criar arquivo de release local

Arquivo:

```text
compose.release.yaml
```

Conteúdo:

```yaml
services:
  app:
    image:
      "formacao-java/m16-integrations:${RELEASE_IMAGE_TAG}"

    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
```

Para promoção real do mesmo artefato, use:

```text
--no-build.
```

O arquivo base pode continuar contendo build para desenvolvimento.

A release deve evitar reconstrução.

---

### 13. Renderizar a release

Defina:

```powershell
$env:RELEASE_IMAGE_TAG =
  "5.1.0"
```

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  config
```

Confirme a tag efetiva.

---

### 14. Criar go/no-go checklist

Arquivo:

```text
GO_NO_GO_CHECKLIST.md
```

Pré-release:

- [ ] commit aprovado;
- [ ] testes verdes;
- [ ] imagem construída;
- [ ] imagem identificada;
- [ ] healthcheck presente;
- [ ] secrets disponíveis;
- [ ] configuração validada;
- [ ] backup quando necessário;
- [ ] rollback definido;
- [ ] owner presente;
- [ ] janela autorizada.

Pós-release:

- [ ] app healthy;
- [ ] readiness UP;
- [ ] smoke test;
- [ ] taxa de erro normal;
- [ ] latência aceitável;
- [ ] backlog estável;
- [ ] Kafka saudável;
- [ ] logs sem erro novo;
- [ ] segurança preservada.

---

### 15. Definir sinais

Arquivo:

```text
RELEASE_OBSERVATION_GUIDE.md
```

Sinais mínimos:

```text
health;

HTTP errors;

latency;

Outbox backlog;

Inbox backlog;

notification retry;

quarantine;

Kafka lag;

CPU;

memory;

restart count;

logs.
```

---

### 16. Definir thresholds didáticos

Exemplo:

```text
health:
healthy.

HTTP 5xx:
nenhum no smoke.

Outbox oldest age:
não cresce de forma sustentada.

quarantine:
sem crescimento inesperado.

restart:
zero durante observação.
```

Não transforme thresholds didáticos em SLO produtivo sem dados.

---

### 17. Definir janela

Para o laboratório:

```text
10 minutos
ou
quantidade mínima de cenários.
```

A janela deve incluir:

- happy path;
- duplicidade;
- retry;
- health;
- restart;
- logs.

---

### 18. Criar plano de rollback

Arquivo:

```text
ROLLBACK_PLAN.md
```

Inclua:

```text
current tag;

candidate tag;

current image ID/digest;

candidate image ID/digest;

comando;

dados;

compatibilidade;

validação;

owner;

tempo esperado;

critério de sucesso.
```

---

### 19. Validar compatibilidade de dados

Antes da release, responda:

```text
a candidata lê
os dados existentes?

a versão anterior lê
os dados após a candidata?

houve migration?

houve mudança
de evento?

houve mudança
de configuração?
```

Nesta aula, a candidata não deve incluir mudança incompatível.

---

### 20. Criar script da candidata

Arquivo:

```text
build-release-candidate.ps1
```

Responsabilidades:

1. validar Git limpo;
2. receber versão;
3. obter commit;
4. criar metadata;
5. executar build;
6. executar testes;
7. inspecionar imagem;
8. registrar ID;
9. não usar `latest`.

---

### 21. Criar script de validação

Arquivo:

```text
validate-release-candidate.ps1
```

Responsabilidades:

- validar labels;
- validar user;
- validar healthcheck;
- validar ausência de Maven;
- validar ausência de fonte;
- validar secrets;
- subir candidata isolada;
- chamar health;
- executar smoke;
- remover recursos.

---

### 22. Criar script de promoção local

Arquivo:

```text
promote-local-release.ps1
```

Parâmetros:

```text
-Version;

-ObservationMinutes.
```

Fluxo:

1. validar candidata;
2. registrar versão atual;
3. gerar config;
4. executar `up -d --no-build app`;
5. aguardar healthy;
6. executar smoke;
7. observar;
8. registrar decisão.

---

### 23. Executar a promoção

```powershell
$env:RELEASE_IMAGE_TAG =
  "5.1.0"

docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  up `
  --detach `
  --no-build `
  app
```

Esse processo recria a instância local.

Pode existir uma pequena indisponibilidade.

---

### 24. Aguardar healthy

Use script com timeout.

Não faça loop infinito.

Confirme:

```text
container novo;

imagem candidata;

health healthy;

readiness 200.
```

---

### 25. Executar smoke test

Valide:

- criar OS;
- Outbox;
- Kafka;
- Inbox;
- provider;
- métricas;
- logs;
- secrets não expostos.

---

### 26. Observar a release

Durante a janela:

```powershell
docker compose ps
docker compose logs app
docker stats
```

Consulte métricas.

Registre evidências.

---

### 27. Simular falha da candidata

Não introduza vulnerabilidade real.

Use uma configuração temporária controlada:

```text
readiness path inválido
ou
porta incorreta.
```

A candidata deve ficar unhealthy.

O processo de promoção precisa detectar e interromper.

Restaure após o exercício.

---

### 28. Executar rollback

Defina:

```powershell
$env:RELEASE_IMAGE_TAG =
  "5.0.0"
```

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  up `
  --detach `
  --no-build `
  app
```

Aguarde healthy.

Execute smoke.

---

### 29. Criar script de rollback

Arquivo:

```text
rollback-local-release.ps1
```

Responsabilidades:

- receber versão anterior;
- confirmar imagem existente;
- registrar candidata atual;
- aplicar tag anterior;
- usar `--no-build`;
- aguardar healthy;
- executar smoke;
- registrar resultado;
- não apagar candidata automaticamente.

---

### 30. Decidir rollback ou roll-forward

Rollback quando:

- versão anterior é compatível;
- dados permitem retorno;
- impacto é alto;
- correção levará tempo;
- retorno é rápido.

Roll-forward quando:

- migration é irreversível;
- evento já mudou;
- retorno quebra dados;
- correção é simples e segura;
- versão anterior não é mais compatível.

Documente a decisão.

---

### 31. Registrar evidências

Arquivo:

```text
RELEASE_EVIDENCE.md
```

Inclua:

```text
versão atual;

candidata;

commit;

image ID/digest;

data;

operador;

estratégia;

health antes;

health depois;

smoke;

métricas;

logs;

decisão;

rollback rehearsal.
```

Não inclua secrets.

---

### 32. Criar visão geral

Arquivo:

```text
RELEASE_STRATEGY_OVERVIEW.md
```

Explique:

- terminologia;
- estratégias;
- riscos;
- exemplos;
- compatibilidade;
- observabilidade;
- rollback;
- limitações do laboratório.

---

### 33. Criar troubleshooting

Arquivo:

```text
RELEASE_TROUBLESHOOTING.md
```

Inclua:

- tag inexistente;
- tag mutável;
- digest ausente localmente;
- candidata não healthy;
- rollback não healthy;
- dado incompatível;
- config incorreta;
- secret ausente;
- imagem reconstruída por engano;
- `--no-build` omitido;
- health lento;
- métricas sem volume suficiente;
- logs inconclusivos.

---

### 34. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Valide Compose:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  config
```

Execute os scripts de candidata e rollback em ambiente local.

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Release ganhou processo

A troca de versão deixou de ser apenas alterar uma tag.

### Artefato ganhou identidade

Tag, commit e image ID/digest foram registrados.

### Build e promoção foram separados

`--no-build` preservou o artefato validado.

### Estratégias ganharam trade-offs

Recreate não foi chamado de rolling.

### Go/no-go ganhou critérios

A decisão ficou verificável.

### Health entrou no gate

A candidata precisa estar pronta antes da conclusão.

### Métricas entraram na observação

Release não termina no startup.

### Rollback virou procedimento

Versão anterior, comando e validação foram definidos.

### Compatibilidade virou requisito

Dados e contratos precisam permitir convivência ou retorno.

### A próxima aula ganhou base

Feature flags poderão separar deploy de release.

---

## Erros comuns importantes

### Usar `latest`

Não existe identidade confiável da release.

### Rebuildar durante promoção

O artefato validado deixa de ser o promovido.

### Registrar apenas tag

A tag pode mudar.

### Considerar health suficiente

Erros funcionais podem existir com health verde.

### Não definir janela

A release é encerrada cedo demais.

### Não testar rollback

O plano pode falhar quando necessário.

### Confundir canary com A/B

Objetivos são diferentes.

### Chamar recreate de rolling

A comunicação da estratégia fica incorreta.

### Ignorar compatibilidade de dados

Rollback pode destruir ou corromper estado.

### Fazer rollback automático sem contexto

Algumas mudanças exigem roll-forward.

### Observar apenas logs

Métricas e comportamento também são necessários.

### Antecipar feature flag

A próxima aula possui objetivo próprio.

---

## Comandos úteis

### Build candidata

```powershell
docker buildx build `
  --load `
  -t `
  "formacao-java/m16-integrations:5.1.0" `
  .
```

### Inspecionar imagem

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.1.0"
```

### Renderizar release

```powershell
docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  config
```

### Promover

```powershell
docker compose `
  --env-file `
  ".env.example" `
  -f `
  "compose.yaml" `
  -f `
  "compose.release.yaml" `
  up `
  -d `
  --no-build `
  app
```

### Ver versão em execução

```powershell
docker inspect `
  "$(docker compose ps -q app)" `
  --format `
  "{{.Config.Image}}"
```

---

## Exercício guiado

### Parte 1 — Estratégias

Compare recreate, rolling, blue-green e canary.

### Parte 2 — Artefato

Crie candidata versionada.

### Parte 3 — Identidade

Registre commit e digest.

### Parte 4 — Planejamento

Crie release plan.

### Parte 5 — Gate

Preencha go/no-go.

### Parte 6 — Promoção

Use `--no-build`.

### Parte 7 — Observação

Acompanhe health e métricas.

### Parte 8 — Falha

Simule candidata unhealthy.

### Parte 9 — Rollback

Retorne para versão anterior.

### Parte 10 — Evidência

Registre decisão e resultado.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 511 foi preservada;
- deploy foi definido;
- release foi definida;
- rollout foi definido;
- rollback foi definido;
- roll-forward foi definido;
- artefato imutável foi explicado;
- tag foi explicada;
- digest foi explicado;
- build once promote many foi aplicado;
- rebuild durante promoção foi proibido;
- recreate foi explicado;
- rolling foi explicado;
- blue-green foi explicado;
- canary foi explicado;
- shadow foi explicado;
- A/B foi diferenciado de canary;
- progressive delivery foi apresentado;
- compatibilidade foi discutida;
- expand-contract foi apresentado;
- go/no-go foi definido;
- janela de observação foi definida;
- blast radius foi discutido;
- baseline foi executada;
- versão atual foi registrada;
- versão candidata foi registrada;
- candidata foi construída;
- testes do builder foram executados;
- image ID ou digest foi registrado;
- digest fictício não foi usado;
- labels de release foram adicionadas;
- commit foi registrado;
- build date foi registrada;
- imagens foram comparadas;
- script de comparação foi criado;
- release plan foi criado;
- matriz de decisão foi criada;
- estratégia local foi escolhida;
- recreate foi nomeado corretamente;
- compose.release.yaml foi criado;
- tag candidata foi interpolada;
- `--no-build` foi usado;
- go/no-go checklist foi criado;
- sinais foram definidos;
- health foi incluído;
- erro HTTP foi incluído;
- latência foi incluída;
- Outbox backlog foi incluído;
- Inbox backlog foi incluído;
- retry foi incluído;
- quarantine foi incluída;
- Kafka lag foi incluído;
- recursos foram incluídos;
- thresholds didáticos foram definidos;
- thresholds não foram chamados de SLO produtivo;
- janela de observação foi definida;
- rollback plan foi criado;
- versão anterior foi registrada;
- compatibilidade de dados foi revisada;
- compatibilidade de eventos foi revisada;
- script de candidata foi criado;
- script exige Git limpo;
- script não usa latest;
- script de validação foi criado;
- user e healthcheck foram validados;
- secrets foram validados;
- script de promoção foi criado;
- promoção usa artefato existente;
- candidata ficou healthy;
- readiness foi validada;
- smoke test foi executado;
- observação foi registrada;
- falha controlada foi simulada;
- promoção detectou unhealthy;
- rollback foi executado;
- rollback ficou healthy;
- smoke pós-rollback foi executado;
- script de rollback foi criado;
- candidata não foi apagada automaticamente;
- rollback versus roll-forward foi discutido;
- evidências foram registradas;
- visão geral foi criada;
- troubleshooting foi criado;
- feature flag não foi implementada;
- CI/CD não foi antecipado;
- Kubernetes rollout não foi implementado;
- traffic splitting real não foi implementado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 513 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.release.yaml `
  scripts/release `
  docs/devops/release `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "docs(m17): definir fundamentos de release strategy"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret;
- `.env`;
- `app.env`;
- token;
- password;
- imagem exportada;
- tar;
- logs temporários;
- output de inspect;
- digest inventado;
- configuração quebrada;
- feature flag da aula 513.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a implantação de uma nova versão ganhou fundamentos operacionais.

O fluxo passou a ser:

```text
build;

identificação;

validação;

planejamento;

go/no-go;

promoção;

observação;

decisão;

rollback
ou roll-forward.
```

Você comprovou que:

- tag ajuda humanos, mas digest identifica conteúdo;
- o mesmo artefato deve ser promovido;
- deploy e release são conceitos diferentes;
- recreate possui downtime;
- rolling exige convivência;
- blue-green duplica ambiente;
- canary reduz blast radius;
- A/B mede produto;
- shadow exige cuidado com efeitos;
- health é necessário, mas não suficiente;
- métricas e smoke test entram no gate;
- janela de observação precisa ser definida;
- rollback exige versão, comando e compatibilidade;
- algumas mudanças exigem roll-forward;
- uma release segura preserva evidências.

A próxima aula será:

```text
513 - M17.08 - Feature flags
```

Nela, você irá separar deploy de release na prática, controlando a ativação de comportamento sem reconstruir a imagem.

Nenhuma feature flag foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Comparei estratégias.
- [ ] Criei candidata versionada.
- [ ] Registrei identidade.
- [ ] Criei release plan.
- [ ] Defini go/no-go.
- [ ] Promovi sem rebuild.
- [ ] Testei rollback.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A tag candidata não existe

Construa ou obtenha a imagem antes da promoção.

### `RepoDigests` está vazio

A imagem ainda não foi publicada; use image ID local e documente a limitação.

### `up` reconstruiu a imagem

Use `--no-build` e revise o Compose.

### A candidata não fica healthy

Interrompa o go e investigue antes de promover.

### O rollback também falha

A dependência ou configuração pode estar quebrada, não apenas a versão.

### A versão anterior não lê os dados

Rollback pode não ser seguro; avalie roll-forward.

### As métricas não têm volume

A janela ou cenário não produziu evidência suficiente.

### A release foi chamada de canary

Sem tráfego parcial real, não é canary.

### O script usa `latest`

Substitua por versão explícita.

### O digest foi copiado manualmente errado

Extraia da ferramenta e registre automaticamente.

### A falha temporária ficou versionada

Restaure a configuração antes do commit.

### Feature flag apareceu no escopo

Remova e preserve para a aula 513.

---

## Perguntas de revisão

1. O que é deploy?
2. O que é release?
3. O que é rollout?
4. O que é rollback?
5. O que é roll-forward?
6. O que é tag?
7. O que é digest?
8. O que significa build once?
9. O que é recreate?
10. O que é rolling?
11. O que é blue-green?
12. O que é canary?
13. Canary é igual a A/B?
14. O que é blast radius?
15. Para que serve go/no-go?
16. O que é janela de observação?
17. Health verde encerra a validação?
18. Por que testar rollback?
19. Quando roll-forward pode ser melhor?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Colocar versão no ambiente.
2. Disponibilizar mudança.
3. Distribuir versão.
4. Voltar versão.
5. Corrigir avançando.
6. Nome da imagem.
7. Identidade do conteúdo.
8. Promover o mesmo artefato.
9. Parar e substituir.
10. Substituir gradualmente.
11. Dois ambientes.
12. Exposição parcial.
13. Não.
14. Alcance do problema.
15. Decisão objetiva.
16. Período de observação.
17. Não.
18. Garantir retorno.
19. Dados incompatíveis.
20. Feature flags.

---

## Desafio opcional

Desenhe uma estratégia blue-green para a aplicação.

Inclua:

- blue;
- green;
- proxy;
- health;
- readiness;
- banco;
- Kafka;
- secrets;
- tráfego;
- rollback;
- custo;
- incompatibilidades.

Não implemente proxy ou traffic switching nesta aula.

O objetivo é produzir um desenho e uma matriz de riscos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 512 - M17.07 - Release strategy fundamentos

- Continuei após healthchecks em containers.
- Diferenciei deploy, release e rollout.
- Diferenciei rollback e roll-forward.
- Revisei artefato imutável.
- Diferenciei tag e digest.
- Apliquei build once, promote many.
- Comparei recreate, rolling, blue-green e canary.
- Diferenciei canary de A/B testing.
- Revisei shadow e progressive delivery.
- Revisei compatibilidade entre versões.
- Conheci expand-contract.
- Defini blast radius.
- Criei matriz de decisão.
- Escolhi recreate controlado para o laboratório.
- Criei uma candidata versionada.
- Registrei commit e image ID ou digest.
- Adicionei labels OCI de release.
- Comparei imagem atual e candidata.
- Criei release plan.
- Criei checklist de go/no-go.
- Defini sinais e thresholds didáticos.
- Defini janela de observação.
- Criei plano de rollback.
- Revisei compatibilidade de dados e eventos.
- Criei scripts de build, validação, promoção e rollback.
- Promovi a candidata sem rebuild.
- Aguardei health e readiness.
- Executei smoke test.
- Observei métricas e logs.
- Simulei candidata unhealthy.
- Executei rollback.
- Validei health e smoke pós-rollback.
- Diferenciei rollback de roll-forward.
- Registrei evidências.
- Não implementei feature flags.
- Próxima aula: Feature flags.
```

---

## Referência técnica curta

- Release Management.
- Immutable Artifacts.
- OCI Image Digests.
- Recreate Deployment.
- Rolling Update.
- Blue-Green Deployment.
- Canary Release.
- Progressive Delivery.
- Rollback Planning.
- Expand and Contract Pattern.

Regra final:

```text
release strategy transforma a troca de versão em um processo controlado: uma candidata recebe tag explícita, commit, labels e image ID ou digest, é validada por testes, segurança, health e smoke test e depois promovida sem rebuild para preservar `build once, promote many`; recreate, rolling, blue-green, canary, shadow e A/B possuem objetivos, custos e blast radius diferentes, e o laboratório escolhe recreate controlado por possuir uma única instância e nenhum roteador; release plan, go/no-go, sinais, thresholds didáticos e janela de observação orientam a decisão, enquanto o rollback plan registra versão anterior, compatibilidade, comando e validação; candidata unhealthy interrompe a promoção, rollback é ensaiado e roll-forward é considerado quando dados ou contratos impedem retorno; evidências preservam versão, identidade, health, métricas, logs e decisão; com deploy e release claramente separados em conceito, a formação avança para feature flags na aula 513.
```
