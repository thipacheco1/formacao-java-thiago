# 516 - M17.11 - Rollback seguro

## Apresentação da aula

Na aula 515, você implementou um canary deployment.

A topologia passou a possuir:

```text
app-stable;

app-canary;

app-worker;

gateway;

PostgreSQL;

Kafka.
```

A versão candidata foi exposta em etapas:

```text
1%;

5%;

10%;

25%;

50%;

100%.
```

Cada etapa recebeu:

- healthcheck;
- readiness;
- amostra mínima;
- janela mínima;
- smoke test;
- observação de erros;
- observação de latência;
- observação de backlog;
- decisão de go, hold ou abort.

Quando a candidata apresentou falha exclusiva, o canary foi abortado:

```text
peso canary:
0%.

peso stable:
100%.
```

Essa retirada de tráfego foi rápida.

Entretanto, um rollback seguro envolve mais do que mudar o peso no gateway.

A pergunta central desta aula será:

```text
como retornar
para uma versão anterior

sem perder dados,
duplicar efeitos,
expor configuração incorreta
ou esconder a causa da falha?
```

Rollback seguro precisa considerar várias dimensões:

```text
tráfego;

artefato;

configuração;

segredos;

estado;

schema;

eventos;

workers;

filas;

backlog;

observabilidade;

evidências.
```

Uma aplicação pode voltar para a imagem anterior e ainda permanecer quebrada.

Exemplos:

- a configuração nova continua ativa;
- o secret antigo foi revogado;
- o banco contém dados incompatíveis;
- um evento novo já foi publicado;
- a versão antiga não entende o novo payload;
- o worker antigo não processa o novo estado;
- o gateway aponta para a versão errada;
- o canary continua recebendo tráfego direto;
- o rollback recria containers com build diferente;
- a imagem anterior não existe mais localmente;
- o runbook nunca foi testado.

Por isso, a regra central será:

```text
rollback não é
apenas voltar uma tag;

é restaurar
uma condição operacional
conhecida e validada.
```

Nesta aula, o rollback será tratado como uma operação planejada.

Ele começará antes da release.

Antes de promover uma candidata, a equipe precisa saber:

```text
qual versão anterior
será usada;

qual image ID ou digest;

qual configuração;

quais secrets;

qual schema;

quais contratos;

qual comando;

quem decide;

como validar;

quanto tempo pode levar.
```

A aula também diferenciará:

```text
rollback de tráfego;

rollback de aplicação;

rollback de configuração;

rollback de worker;

rollback de dados;

roll-forward.
```

#### Rollback de tráfego

Retira a candidata do caminho de requests.

Exemplo:

```text
canary:
0%.

stable:
100%.
```

#### Rollback de aplicação

Reativa ou recria containers usando a imagem anterior.

#### Rollback de configuração

Restaura valores conhecidos.

Exemplo:

- feature flag;
- timeout;
- endpoint;
- limite;
- secret reference;
- runtime role.

#### Rollback de worker

Retorna o processo assíncrono para uma versão anterior.

Esse rollback exige cuidado com:

- consumer group;
- claims;
- retries;
- eventos;
- estados;
- locks;
- idempotência.

#### Rollback de dados

É o mais perigoso.

Ele pode envolver:

- restore;
- compensação;
- reprocessamento;
- correção manual;
- replay.

Não será implementado nesta aula.

#### Roll-forward

Avança para uma correção nova quando retornar é mais arriscado.

A decisão entre rollback e roll-forward precisa ser explícita.

A aula utilizará a topologia canary existente como base.

A candidata será retirada primeiro do tráfego.

Depois, o processo decidirá:

```text
é suficiente manter
a candidata isolada?

é necessário recriar
a stable?

é necessário reverter
configuração?

é necessário reverter
worker?

é necessário bloquear
efeitos externos?
```

O kill switch da aula 513 será reutilizado.

Em uma falha no provider:

```text
notification.dispatch.enabled=false
```

pode interromper novos envios enquanto a equipe preserva:

- intents;
- Outbox;
- evidências;
- possibilidade de retry.

A feature flag também pode ser revertida:

```text
notification.provider.v2-enabled=false.
```

Isso pode corrigir o comportamento sem trocar a imagem.

Portanto, a sequência de mitigação pode ser:

```text
1. reduzir exposição;

2. ativar kill switch
   quando necessário;

3. reverter flag;

4. retornar tráfego;

5. reverter imagem;

6. reverter worker;

7. corrigir ou avançar.
```

Nem todo incidente exige executar todas as etapas.

A resposta precisa ser proporcional.

A aula criará uma matriz de decisão.

Exemplo:

```text
erro apenas na V2:

reverter feature flag.

erro apenas na candidata HTTP:

retirar canary.

erro no artefato inteiro:

retirar tráfego
e retornar imagem.

erro no worker novo:

parar worker novo
e reativar worker antigo.

incompatibilidade de dados:

avaliar roll-forward
ou plano específico.
```

O schema permanecerá congelado.

A próxima aula será:

```text
517 - M17.12 - Deploy com migracao sem downtime
```

Portanto, esta aula não implementará:

- Flyway migration nova;
- Liquibase change set;
- expand-contract completo;
- backfill;
- dual write;
- coluna nova;
- remoção de coluna;
- migration rollback;
- schema versioning avançado.

O foco será preparar o rollback para um ambiente sem mudança de schema.

Isso é importante porque rollback sem migration já possui complexidade suficiente.

A aula também criará um bundle de release.

Esse bundle registrará:

```text
versão stable;

versão candidata;

image IDs;

configuração;

flags;

secrets references;

gateway weights;

worker version;

schema version;

data checks;

commands;

evidências.
```

O bundle não conterá secrets.

Ele conterá nomes e referências.

Ao final, você deverá explicar:

```text
por que rollback
começa antes da release;

por que retirar tráfego
vem antes de investigar;

por que imagem anterior
precisa estar disponível;

por que configuração
faz parte do rollback;

por que dados
podem impedir retorno;

por que worker
precisa de plano separado;

quando usar kill switch;

quando usar feature flag;

quando rollback
é pior que roll-forward;

como provar
que o sistema voltou
a uma condição segura.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
514:
Blue green deployment.

515:
Canary deployment.

516:
Rollback seguro.

517:
Deploy com migracao sem downtime.

518:
Pipeline local.
```

A aula 515 respondeu:

```text
como expor
uma candidata
gradualmente

e abortar
quando os sinais pioram?
```

A aula 516 responderá:

```text
como retornar
de forma completa,
auditável
e compatível?
```

Nesta aula:

```text
rollback de tráfego:
sim.

rollback de imagem:
sim.

rollback de configuração:
sim.

rollback de feature flag:
sim.

kill switch:
sim.

rollback de worker:
sim.

state compatibility:
sim.

data verification:
sim.

evidência:
sim.

runbook:
sim.

rehearsal:
sim.

RTO didático:
sim.

RPO didático:
sim.

roll-forward:
sim.

migration rollback:
não.

schema change:
não.

CI/CD:
não.

Kubernetes:
não.
```

A regra central será:

```text
o rollback termina
somente quando
tráfego,
estado,
efeitos,
configuração
e sinais
voltarem ao esperado.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
compose.rollback.yaml

scripts/rollback
├── capture-release-baseline.ps1
├── preflight-rollback.ps1
├── execute-traffic-rollback.ps1
├── execute-config-rollback.ps1
├── execute-worker-rollback.ps1
├── verify-rollback.ps1
├── rehearse-rollback.ps1
└── create-rollback-evidence.ps1

docs/devops/rollback
├── ROLLBACK_POLICY.md
├── ROLLBACK_DECISION_MATRIX.md
├── ROLLBACK_RUNBOOK.md
├── ROLLBACK_PREFLIGHT_CHECKLIST.md
├── ROLLBACK_VALIDATION_MATRIX.md
├── ROLLBACK_REHEARSAL.md
├── ROLLBACK_EVIDENCE.md
├── ROLLBACK_COMMUNICATION.md
└── ROLLBACK_TROUBLESHOOTING.md

release/baseline
├── current-release.example.json
└── README.md
```

Ao final, você terá:

```text
baseline capturada;

rollback target validado;

imagem anterior disponível;

configuração conhecida;

flags conhecidas;

gateway controlado;

worker controlado;

tráfego retornado;

smoke validado;

backlog validado;

evidência registrada;

rehearsal executado.
```

Você irá:

1. confirmar a baseline;
2. definir tipos de rollback;
3. criar política;
4. criar matriz de decisão;
5. definir alvo;
6. capturar image IDs;
7. capturar configuração;
8. capturar flags;
9. capturar worker;
10. capturar pesos;
11. capturar schema version;
12. verificar imagens;
13. verificar secrets references;
14. verificar banco;
15. verificar Kafka;
16. verificar stable;
17. verificar kill switch;
18. simular falha;
19. retirar canary;
20. reverter flag;
21. ativar kill switch;
22. reverter imagem;
23. reverter worker;
24. validar tráfego;
25. validar estado;
26. validar backlog;
27. reativar efeitos;
28. observar;
29. registrar evidências;
30. ensaiar rollback;
31. medir tempo;
32. documentar limites;
33. executar gate;
34. commitar;
35. preparar a aula 517.

---

## Conceito essencial

### Rollback target

É a condição conhecida para a qual o sistema retornará.

Inclui:

```text
imagem;

configuração;

flags;

secrets references;

worker;

gateway;

schema;

contratos.
```

Não é apenas:

```text
tag 5.0.0.
```

---

### Known good

Known good é uma versão que possui evidência de operação.

Ela precisa ter:

- testes;
- health;
- smoke;
- observação;
- imagem disponível;
- configuração registrada;
- compatibilidade conhecida.

---

### Baseline capture

Antes da release, capture:

- tag;
- image ID;
- digest quando disponível;
- commit;
- config hash;
- feature flags;
- worker image;
- gateway weight;
- schema version;
- data checks;
- timestamp;
- owner.

---

### Config hash

Um hash pode identificar o arquivo de configuração sem revelar conteúdo.

Não use hash de secret como evidência pública.

Para config não sensível:

```powershell
Get-FileHash.
```

Para secrets, registre somente:

- nome;
- versão;
- referência;
- data de rotação;
- owner.

---

### RTO

Recovery Time Objective é o tempo alvo para recuperar o serviço.

Nesta aula, será um objetivo didático.

Exemplo:

```text
retirar canary:
menos de 2 minutos.

restaurar stable:
menos de 5 minutos.
```

Esses valores não são compromisso produtivo.

---

### RPO

Recovery Point Objective é a perda de dados tolerável.

No laboratório:

```text
RPO esperado:
zero para ordens confirmadas.
```

Outbox, idempotência e PostgreSQL ajudam a preservar o trabalho.

Isso não substitui backup.

---

### Traffic rollback

Primeira ação quando a candidata causa erro HTTP:

```text
peso canary:
0.
```

Isso reduz o blast radius.

---

### Config rollback

Pode ser suficiente quando o defeito está em:

- feature flag;
- endpoint;
- timeout;
- limite;
- propriedade;
- runtime role.

A imagem permanece.

---

### Worker rollback

Workers precisam de coordenação.

Fluxo seguro:

1. ativar kill switch quando aplicável;
2. impedir novos claims;
3. parar worker novo;
4. recuperar claims vencidos;
5. iniciar worker antigo;
6. validar backlog;
7. reativar efeitos.

---

### Claim safety

Não finalize claims como sucesso durante rollback.

Estados como:

- SENDING;
- PROCESSING;
- CLAIMED;

precisam possuir recovery.

O rollback pode aumentar temporariamente o backlog.

Isso é aceitável se o trabalho estiver preservado.

---

### Data compatibility

A versão anterior precisa compreender os dados existentes.

Verifique:

- enum values;
- statuses;
- payloads;
- JSON;
- eventos;
- colunas;
- constraints;
- defaults.

Nesta aula, nenhum novo valor incompatível será introduzido.

---

### Contract compatibility

Mesmo sem schema change, a candidata pode publicar:

- novo event type;
- novo campo obrigatório;
- nova semântica;
- novo status.

A stable precisa continuar compatível.

---

### Kill switch

Kill switch interrompe efeitos externos.

Ele é útil quando:

- provider está causando impacto;
- respostas são ambíguas;
- retry pode agravar;
- incidente ainda está sendo classificado.

O kill switch não elimina backlog.

---

### Feature flag rollback

Reverter a flag pode restaurar o comportamento anterior sem trocar a imagem.

Essa é uma vantagem de separar deploy e release.

---

### Freeze

Durante rollback:

```text
pause novas mudanças.
```

Não misture:

- nova release;
- alteração de config;
- ajuste manual;
- migration;
- limpeza de dados.

Um incidente precisa de controle de mudança.

---

### Evidence preservation

Antes de apagar ou recriar:

- capture logs;
- capture health;
- capture image;
- capture config reference;
- capture metrics;
- capture error;
- capture timestamp.

Não capture secrets.

---

### Roll-forward

Escolha roll-forward quando:

- versão anterior é incompatível;
- dado novo não pode voltar;
- contrato foi consumido;
- correção é simples;
- rollback causa mais risco;
- restore excede o RTO.

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

Valide o canary:

```powershell
.\scripts\canary\verify-canary.ps1
```

---

### 2. Criar política de rollback

Arquivo:

```text
ROLLBACK_POLICY.md
```

Defina:

- escopo;
- owner;
- approver;
- severidade;
- freeze;
- RTO;
- RPO;
- evidências;
- comunicação;
- conclusão.

---

### 3. Criar matriz de decisão

Arquivo:

```text
ROLLBACK_DECISION_MATRIX.md
```

Exemplo:

```markdown
| Falha | Primeira ação | Próxima ação |
|---|---|---|
| 5xx canary | Peso 0 | Investigar |
| V2 incorreta | Flag false | Observar |
| Provider instável | Kill switch | Preservar backlog |
| App candidata não inicia | Não promover | Corrigir |
| Worker novo falha | Parar worker | Ativar antigo |
| Config errada | Reverter config | Recriar |
| Dado incompatível | Freeze | Avaliar roll-forward |
```

---

### 4. Criar baseline JSON de exemplo

Arquivo:

```text
current-release.example.json
```

Conteúdo:

```json
{
  "capturedAt": "YYYY-MM-DDTHH:mm:ssZ",
  "stable": {
    "tag": "5.0.0",
    "imageId": "captured-at-runtime",
    "commit": "captured-at-runtime"
  },
  "candidate": {
    "tag": "5.1.0",
    "imageId": "captured-at-runtime",
    "commit": "captured-at-runtime"
  },
  "worker": {
    "tag": "5.0.0",
    "imageId": "captured-at-runtime"
  },
  "traffic": {
    "stablePercent": 100,
    "canaryPercent": 0
  },
  "featureFlags": {
    "notificationProviderV2": false,
    "notificationDispatchEnabled": true
  },
  "schema": {
    "version": "frozen-current-schema"
  }
}
```

O arquivo real gerado localmente fica fora do Git.

---

### 5. Criar script de captura

Arquivo:

```text
capture-release-baseline.ps1
```

Responsabilidades:

- obter containers;
- obter imagens;
- obter IDs;
- obter labels;
- obter release colors;
- obter pesos;
- obter flags não sensíveis;
- obter worker version;
- obter schema version;
- obter timestamp;
- salvar JSON local;
- não incluir secrets.

---

### 6. Verificar imagens

Antes da release:

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.0.0"

docker image inspect `
  "formacao-java/m16-integrations:5.1.0"
```

O rollback target precisa existir.

---

### 7. Verificar gateway

Capture o peso atual.

Não dependa de memória.

Leia:

```text
active-weights.conf.
```

Valide NGINX.

---

### 8. Verificar configuração

Capture:

- env example versionada;
- app.env hash local;
- feature flag values;
- runtime role;
- release color;
- image tag.

Não capture token.

---

### 9. Verificar secrets references

Registre:

```text
provider_token:

reference atual.

database_password:

reference atual.

postgres_password:

reference atual.
```

Não registre conteúdo.

Confirme que as referências antigas ainda existem quando rollback exige.

---

### 10. Verificar schema

Nesta aula:

```text
schema freeze.
```

Registre:

- baseline SQL version;
- `ddl-auto=validate`;
- ausência de migration nova;
- compatibilidade com stable.

---

### 11. Verificar dados

Antes da release, registre contagens didáticas:

- ordens;
- Outbox pendente;
- Inbox;
- intents;
- quarantine;
- retries.

Esses números ajudam a detectar perda ou duplicação.

---

### 12. Criar preflight

Arquivo:

```text
preflight-rollback.ps1
```

Valida:

1. imagem stable existe;
2. imagem worker existe;
3. config anterior existe;
4. secrets references existem;
5. gateway responde;
6. stable está healthy;
7. banco está healthy;
8. Kafka está healthy;
9. schema é compatível;
10. scripts estão disponíveis.

---

### 13. Criar checklist

Arquivo:

```text
ROLLBACK_PREFLIGHT_CHECKLIST.md
```

Inclua todos os itens do script e aprovação humana.

---

### 14. Simular release problemática

Inicie stable e canary.

Promova canary para:

```text
10%.
```

Ative uma falha controlada na candidata.

Não altere schema.

---

### 15. Capturar evidência

Antes de abortar, capture:

- timestamp;
- versão;
- release color;
- 5xx;
- endpoint;
- logs;
- health;
- métricas;
- peso;
- request count.

Sem secrets.

---

### 16. Executar rollback de tráfego

Arquivo:

```text
execute-traffic-rollback.ps1
```

Fluxo:

1. definir peso 0;
2. validar NGINX;
3. reload;
4. confirmar 100% stable;
5. confirmar canary ainda ativa;
6. registrar duração.

---

### 17. Validar stable

Execute:

- liveness;
- readiness;
- info;
- smoke;
- logs;
- métricas.

O rollback de tráfego não termina sem validação.

---

### 18. Reverter feature flag

Se a falha está na V2:

```text
APP_FEATURES_NOTIFICATION_PROVIDER_V2_ENABLED=false.
```

Recrie somente a instância afetada.

Valide.

---

### 19. Ativar kill switch

Se a falha envolve provider:

```text
APP_FEATURES_NOTIFICATION_DISPATCH_ENABLED=false.
```

Confirme:

- novas intents permanecem;
- provider não é chamado;
- backlog fica visível;
- health continua coerente.

---

### 20. Criar rollback de configuração

Arquivo:

```text
execute-config-rollback.ps1
```

Parâmetros:

```text
-BaselineFile;

-Reason.
```

Fluxo:

- validar baseline;
- restaurar flags;
- restaurar env não sensível;
- validar secrets references;
- recriar app;
- aguardar health;
- executar smoke;
- registrar diff.

---

### 21. Reverter imagem da API

Quando necessário:

```powershell
$env:STABLE_IMAGE_TAG =
  "5.0.0"
```

Use:

```text
--no-build.
```

Não reconstrua a imagem antiga.

---

### 22. Verificar identidade

Confirme:

- image ID;
- release version;
- release color;
- commit;
- healthcheck.

A tag correta com image ID errado é uma falha.

---

### 23. Preparar rollback de worker

Antes de trocar worker:

```text
dispatch kill switch:

false para novos efeitos.
```

Ou pause schedulers conforme política.

Não mate processo durante uma operação sem considerar graceful shutdown.

---

### 24. Parar worker novo

Use:

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  stop `
  app-worker
```

Aguarde shutdown.

---

### 25. Iniciar worker antigo

Aponte para a imagem conhecida.

Use `--no-build`.

Aguarde health.

---

### 26. Criar script de worker rollback

Arquivo:

```text
execute-worker-rollback.ps1
```

Responsabilidades:

- validar imagens;
- ativar proteção;
- parar worker atual;
- registrar claims;
- iniciar worker anterior;
- aguardar health;
- verificar consumers;
- verificar schedulers;
- validar backlog;
- reativar efeitos.

---

### 27. Validar claims

Procure registros em estados intermediários.

Confirme stale claim recovery.

Não altere manualmente status sem runbook.

---

### 28. Validar backlog

Observe:

- Outbox;
- Inbox;
- intents;
- retries;
- quarantine;
- Kafka lag.

O backlog pode crescer durante o rollback.

Ele precisa estabilizar e reduzir após recuperação.

---

### 29. Reativar dispatch

Depois que o worker antigo estiver validado:

```text
notification.dispatch.enabled=true.
```

Recrie quando a flag é estática.

Observe o processamento.

---

### 30. Criar matriz de validação

Arquivo:

```text
ROLLBACK_VALIDATION_MATRIX.md
```

Tabela:

```markdown
| Dimensão | Antes | Depois | Aceite |
|---|---|---|---|
| Tráfego | Canary parcial | Stable 100% | Stable identificada |
| API | Candidata | Known good | Healthy |
| Config | Nova | Baseline | Igual |
| Worker | Novo | Known good | Healthy |
| Outbox | Contagem | Preservada | Sem perda |
| Intents | Contagem | Preservada | Sem SENT falso |
| Kafka lag | Valor | Recuperando | Não crescente |
| Quarantine | Valor | Estável | Sem pico |
```

---

### 31. Criar script de verify

Arquivo:

```text
verify-rollback.ps1
```

Valida:

- gateway;
- versão;
- image ID;
- health;
- readiness;
- config;
- flags;
- worker;
- claims;
- Outbox;
- Inbox;
- intents;
- retry;
- quarantine;
- lag;
- smoke.

---

### 32. Criar evidência

Arquivo:

```text
ROLLBACK_EVIDENCE.md
```

Campos:

- incident ID;
- reason;
- startedAt;
- completedAt;
- duration;
- RTO target;
- stable image;
- candidate image;
- worker image;
- config baseline;
- actions;
- health;
- smoke;
- data checks;
- backlog;
- decision;
- owner;
- follow-up.

---

### 33. Criar script de evidência

Arquivo:

```text
create-rollback-evidence.ps1
```

Ele cria um arquivo local com valores operacionais não sensíveis.

Não imprime secrets.

---

### 34. Criar runbook

Arquivo:

```text
ROLLBACK_RUNBOOK.md
```

Ordem recomendada:

```text
1. declarar incidente;

2. freeze;

3. capturar evidência;

4. reduzir tráfego;

5. aplicar kill switch;

6. reverter config;

7. reverter API;

8. reverter worker;

9. validar dados;

10. reativar efeitos;

11. observar;

12. encerrar.
```

Nem todos os passos são obrigatórios em todos os incidentes.

---

### 35. Criar comunicação

Arquivo:

```text
ROLLBACK_COMMUNICATION.md
```

Inclua modelos para:

- início;
- impacto;
- mitigação;
- rollback iniciado;
- rollback concluído;
- acompanhamento;
- postmortem.

Não inclua detalhes sensíveis.

---

### 36. Ensaiar rollback

Arquivo:

```text
rehearse-rollback.ps1
```

Fluxo:

1. iniciar stack;
2. capturar baseline;
3. promover canary;
4. simular falha;
5. retirar tráfego;
6. reverter config;
7. validar worker;
8. executar smoke;
9. medir tempo;
10. gerar evidência;
11. restaurar laboratório.

---

### 37. Medir RTO didático

Registre:

```text
tempo para peso 0;

tempo para stable healthy;

tempo para worker healthy;

tempo para backlog recuperar;

tempo total.
```

Compare com o objetivo.

---

### 38. Medir RPO didático

Compare contagens e IDs.

Confirme:

- nenhuma ordem confirmada perdida;
- nenhuma intent marcada como SENT sem envio;
- nenhuma Outbox apagada;
- duplicidades evitadas por idempotência.

---

### 39. Criar rehearsal doc

Arquivo:

```text
ROLLBACK_REHEARSAL.md
```

Inclua:

- data;
- cenário;
- objetivos;
- tempos;
- resultado;
- falhas do runbook;
- melhorias;
- responsáveis.

---

### 40. Criar troubleshooting

Arquivo:

```text
ROLLBACK_TROUBLESHOOTING.md
```

Inclua:

- imagem anterior ausente;
- tag aponta para ID inesperado;
- stable unhealthy;
- config anterior ausente;
- secret antigo revogado;
- worker antigo não inicia;
- claim preso;
- backlog cresce;
- Kafka indisponível;
- banco incompatível;
- rollback excede RTO;
- dados impedem retorno;
- gateway não recarrega;
- kill switch não funciona.

---

### 41. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Renderize:

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  -f `
  "compose.rollback.yaml" `
  config
```

Execute:

```powershell
.\scripts\rollback\rehearse-rollback.ps1
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Rollback ganhou alvo completo

Imagem, configuração, flags, worker e tráfego passaram a fazer parte do retorno.

### A mitigação ficou em camadas

Peso, kill switch, flag, imagem e worker podem ser revertidos conforme a falha.

### O estado ganhou verificação

Contagens e IDs ajudam a provar ausência de perda.

### O worker ganhou runbook próprio

Background processing deixou de ser tratado como HTTP.

### O conhecido bom ficou identificável

Tag, image ID, commit e config baseline foram capturados.

### Rollback passou a ser ensaiado

O runbook foi executado antes de um incidente real.

### RTO e RPO ganharam evidência

Tempo e preservação foram medidos.

### Roll-forward entrou na decisão

Retornar deixou de ser uma resposta automática.

### A próxima aula ganhou uma fronteira clara

Migrations serão adicionadas somente depois de dominar o retorno sem schema change.

---

## Erros comuns importantes

### Executar rollback sem baseline

A equipe não sabe para qual estado voltar.

### Rebuildar a imagem antiga

O artefato deixa de ser o conhecido bom.

### Retirar tráfego e encerrar

Configuração ou worker podem continuar quebrados.

### Reverter worker sem proteger efeitos

Claims e envios podem duplicar.

### Apagar backlog

O incidente perde trabalho e evidência.

### Marcar intent como SENT manualmente

O estado deixa de representar o efeito real.

### Revogar secret antigo antes da janela

A versão anterior não consegue voltar.

### Não validar image ID

Uma tag mutável pode apontar para outro conteúdo.

### Não medir tempo

O runbook parece rápido apenas no papel.

### Rollback automático de dados

A perda pode ser maior que a falha original.

### Ignorar roll-forward

Alguns estados não permitem retorno seguro.

### Antecipar migration rollback

A aula 517 tratará compatibilidade de schema.

---

## Comandos úteis

### Inspecionar imagem stable

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.0.0"
```

### Retirar canary

```powershell
.\scripts\canary\abort-canary.ps1 `
  -Reason `
  "Rollback seguro iniciado"
```

### Capturar baseline

```powershell
.\scripts\rollback\capture-release-baseline.ps1
```

### Executar preflight

```powershell
.\scripts\rollback\preflight-rollback.ps1
```

### Verificar rollback

```powershell
.\scripts\rollback\verify-rollback.ps1
```

### Ensaiar

```powershell
.\scripts\rollback\rehearse-rollback.ps1
```

---

## Exercício guiado

### Parte 1 — Política

Defina owner, RTO e RPO.

### Parte 2 — Baseline

Capture imagens e configuração.

### Parte 3 — Preflight

Valide o target.

### Parte 4 — Falha

Simule erro canary.

### Parte 5 — Tráfego

Retorne para stable.

### Parte 6 — Configuração

Reverta flag e env.

### Parte 7 — Worker

Retorne para worker conhecido.

### Parte 8 — Estado

Valide backlog e claims.

### Parte 9 — Evidência

Registre tempos e resultado.

### Parte 10 — Ensaio

Execute o runbook completo.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 515 foi preservada;
- rollback de tráfego foi definido;
- rollback de aplicação foi definido;
- rollback de configuração foi definido;
- rollback de worker foi definido;
- rollback de dados foi diferenciado;
- roll-forward foi definido;
- rollback target foi definido;
- known good foi definido;
- baseline capture foi definida;
- RTO foi definido;
- RPO foi definido;
- valores didáticos não foram chamados de compromisso produtivo;
- política de rollback foi criada;
- owner foi definido;
- approver foi definido;
- freeze foi definido;
- matriz de decisão foi criada;
- baseline JSON example foi criado;
- arquivo real ficou fora do Git;
- script de captura foi criado;
- image tags foram capturadas;
- image IDs foram capturados;
- commits foram capturados;
- worker version foi capturada;
- gateway weights foram capturados;
- feature flags foram capturadas;
- schema version foi capturada;
- secrets contents não foram capturados;
- secrets references foram capturadas;
- imagens stable e candidate foram verificadas;
- gateway foi verificado;
- config foi verificada;
- schema freeze foi verificado;
- dados foram verificados;
- preflight script foi criado;
- checklist de preflight foi criado;
- falha controlada foi simulada;
- evidências foram capturadas antes da ação;
- rollback de tráfego foi executado;
- peso canary voltou a zero;
- stable recebeu 100%;
- canary permaneceu para investigação;
- stable foi validada;
- feature flag foi revertida;
- kill switch foi ativado;
- backlog permaneceu visível;
- config rollback script foi criado;
- config baseline foi restaurada;
- secrets references foram validadas;
- imagem stable foi usada com `--no-build`;
- image ID foi validado;
- release identity foi validada;
- worker rollback foi preparado;
- novos efeitos foram protegidos;
- worker atual parou graciosamente;
- worker antigo foi iniciado;
- worker antigo ficou healthy;
- claims foram verificados;
- stale recovery foi validado;
- backlog foi verificado;
- Outbox foi verificada;
- Inbox foi verificada;
- intents foram verificadas;
- retries foram verificados;
- quarantine foi verificada;
- Kafka lag foi verificado;
- dispatch foi reativado;
- backlog começou a reduzir;
- matriz de validação foi criada;
- verify script foi criado;
- evidência foi criada;
- script de evidência foi criado;
- runbook foi criado;
- comunicação foi criada;
- rehearsal script foi criado;
- rollback foi ensaiado;
- tempo de tráfego foi medido;
- tempo de stable foi medido;
- tempo de worker foi medido;
- tempo de backlog foi medido;
- RTO foi comparado;
- RPO foi verificado;
- nenhuma ordem confirmada foi perdida;
- nenhuma intent recebeu SENT falso;
- nenhuma Outbox foi apagada;
- idempotência foi preservada;
- rehearsal document foi criado;
- troubleshooting foi criado;
- roll-forward foi considerado;
- rollback automático de dados não foi implementado;
- migration não foi implementada;
- CI/CD não foi antecipado;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 517 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.rollback.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/release/baseline/current-release.example.json `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/release/baseline/README.md `
  scripts/rollback `
  docs/devops/rollback `
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
git commit -m "build(m17): implementar rollback seguro"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- baseline real;
- secret;
- `.env`;
- app env local;
- token;
- password;
- banco;
- volume;
- logs brutos;
- output de inspect;
- configuração de falha;
- imagem exportada;
- migration da aula 517.

---

## Fechamento e ponte para a próxima aula

Nesta aula, rollback deixou de significar apenas voltar uma tag.

O retorno passou a considerar:

```text
tráfego;

imagem;

configuração;

feature flags;

kill switch;

worker;

claims;

backlog;

estado;

evidências.
```

Você comprovou que:

- rollback começa antes da release;
- known good precisa estar identificada;
- tag e image ID precisam concordar;
- retirar tráfego reduz o blast radius;
- feature flag pode restaurar comportamento sem trocar imagem;
- kill switch pode preservar intents enquanto bloqueia efeitos;
- worker exige plano separado;
- backlog pode crescer sem representar perda;
- stale recovery precisa permanecer;
- RTO mede tempo de recuperação;
- RPO mede perda tolerável;
- rollback precisa ser ensaiado;
- dados incompatíveis podem exigir roll-forward;
- a conclusão exige health, smoke, estado e observação.

A próxima aula será:

```text
517 - M17.12 - Deploy com migracao sem downtime
```

Nela, você irá introduzir mudanças de schema compatíveis com versões coexistentes, usando uma sequência expand, migrate e contract.

Nenhuma migration foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini a política.
- [ ] Capturei a baseline.
- [ ] Executei preflight.
- [ ] Retirei o canary.
- [ ] Reverti configuração.
- [ ] Reverti worker.
- [ ] Validei estado.
- [ ] Ensaiei o rollback.

---

## Troubleshooting adicional

### A imagem stable não existe

O rollback target não está disponível.

### A tag aponta para outro ID

Não prossiga até identificar o artefato correto.

### Stable está unhealthy

O conhecido bom deixou de estar operacional ou a dependência está quebrada.

### A config anterior sumiu

O processo de release não preservou baseline.

### O secret antigo foi revogado

A versão anterior pode não autenticar.

### O worker antigo não inicia

Revise config, schema, events e secrets.

### Claims permanecem presos

Aguarde ou execute stale recovery documentado.

### Backlog continua crescendo

O worker não recuperou ou a dependência segue indisponível.

### Kill switch não bloqueia

A condição foi aplicada no ponto errado.

### O gateway não volta

Revise arquivo ativo, `nginx -t` e reload.

### O rollback excede RTO

Simplifique runbook, automatize checks e preserve artefatos.

### Stable não entende os dados

Interrompa e avalie roll-forward.

---

## Perguntas de revisão

1. O que é rollback target?
2. O que é known good?
3. O que faz baseline capture?
4. O que é rollback de tráfego?
5. O que é rollback de config?
6. O que é rollback de worker?
7. Por que rollback de dados é perigoso?
8. O que é RTO?
9. O que é RPO?
10. Por que validar image ID?
11. Para que serve kill switch?
12. Como feature flag ajuda?
13. Por que preservar backlog?
14. O que fazer com claims?
15. Quando usar roll-forward?
16. Por que capturar evidência antes?
17. Rollback termina após health?
18. Por que ensaiar?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estado completo de retorno.
2. Versão validada.
3. Registrar baseline.
4. Retirar candidata.
5. Restaurar propriedades.
6. Retornar processamento assíncrono.
7. Pode perder estado.
8. Tempo alvo.
9. Perda tolerável.
10. Tag pode mudar.
11. Bloquear efeitos.
12. Restaurar comportamento.
13. Preservar trabalho.
14. Recuperar com segurança.
15. Quando retorno é mais arriscado.
16. Preservar diagnóstico.
17. Não.
18. Validar o runbook.
19. Migrations.
20. Deploy com migracao sem downtime.

---

## Desafio opcional

Crie uma simulação de rollback parcial.

Cenário:

```text
tráfego volta para stable;

worker permanece novo;

feature flag volta para V1.
```

Avalie:

- compatibilidade;
- eventos;
- estados;
- idempotência;
- backlog;
- observabilidade;
- risco.

O objetivo é mostrar que versões diferentes podem coexistir somente quando o contrato permite.

Não implemente migration.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 516 - M17.11 - Rollback seguro

- Continuei após canary deployment.
- Diferenciei rollback de tráfego, aplicação, configuração, worker e dados.
- Diferenciei rollback de roll-forward.
- Defini rollback target.
- Defini known good.
- Criei política de rollback.
- Defini freeze, owner, RTO e RPO.
- Criei matriz de decisão.
- Criei baseline JSON de exemplo.
- Criei script de captura.
- Registrei tags, image IDs, commits, worker, flags e pesos.
- Registrei references de secrets sem conteúdo.
- Verifiquei schema freeze.
- Verifiquei contagens de estado.
- Criei preflight e checklist.
- Simulei falha de canary.
- Capturei evidências antes da mitigação.
- Retirei o canary do tráfego.
- Validei stable.
- Reverti feature flag.
- Ativei kill switch.
- Preservei intents e backlog.
- Criei rollback de configuração.
- Retornei a imagem conhecida sem rebuild.
- Validei image ID e identidade.
- Criei rollback de worker.
- Parei o worker com graceful shutdown.
- Iniciei o worker conhecido.
- Verifiquei claims e stale recovery.
- Validei Outbox, Inbox, intents, retry, quarantine e lag.
- Reativei dispatch.
- Observei recuperação do backlog.
- Criei matriz de validação.
- Criei runbook, comunicação e evidência.
- Ensaiei o rollback.
- Medi RTO e RPO didáticos.
- Considerei roll-forward quando o retorno é mais arriscado.
- Não antecipei migrations.
- Próxima aula: Deploy com migracao sem downtime.
```

---

## Referência técnica curta

- Safe Rollback.
- Roll-forward.
- Recovery Time Objective.
- Recovery Point Objective.
- Immutable Artifacts.
- Feature Flag Rollback.
- Kill Switch.
- Transactional Outbox.
- Idempotent Consumer.
- Incident Response Runbook.

Regra final:

```text
rollback seguro restaura uma condição operacional conhecida, não apenas uma tag: antes da release são capturados stable, candidate, worker, image IDs, commits, flags, pesos, schema e references de secrets; diante de falha, a equipe declara freeze, preserva evidências, reduz o canary para zero, valida stable, reverte feature flags e configuração, ativa kill switch quando precisa bloquear efeitos, retorna a imagem conhecida com `--no-build` e executa um plano separado para o worker; claims intermediários são recuperados, Outbox, Inbox, intents, retries, quarantine e Kafka lag são comparados e nenhum trabalho confirmado é apagado ou marcado falsamente como concluído; RTO mede o tempo de recuperação e RPO verifica perda tolerável, enquanto rehearsal prova comandos, owners e tempos antes do incidente; rollback de dados não é automatizado e roll-forward é escolhido quando schema, eventos ou estado tornam o retorno mais perigoso; com o retorno sem mudança de schema dominado, a aula 517 introduzirá deploy com migration compatível e sem downtime.
```
