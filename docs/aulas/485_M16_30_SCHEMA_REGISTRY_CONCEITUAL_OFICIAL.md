# 485 - M16.30 - Schema Registry conceitual

## Apresentação da aula

Na aula 484, você construiu uma política de evolução de contrato sem utilizar um serviço externo.

O repositório passou a conter:

```text
schemas versionados;

fixtures históricas;

readers antigos;

readers novos;

testes backward;

testes forward;

matriz de compatibilidade;

política de rollout.
```

A família:

```text
orders.created.v1
```

evoluiu de uma revision inicial para outra revision compatível com o campo opcional:

```text
salesChannel.
```

Você comprovou que:

```text
reader novo
lê payload antigo;

reader antigo
lê payload novo;

default de JSON Schema
não preenche o payload;

mudança semântica
não é detectada apenas
pela estrutura.
```

Esse modelo funciona bem enquanto:

- existem poucos contratos;
- poucos times publicam eventos;
- todos revisam schemas no mesmo repositório;
- o número de consumers é controlado;
- a política de compatibilidade é aplicada por testes locais;
- ninguém publica um schema diferente por engano.

Quando a organização cresce, surgem novas perguntas:

```text
onde registrar schemas aprovados?

como identificar cada versão?

como impedir publicação
de uma mudança incompatível?

como consumers descobrem
o schema usado pelo producer?

como evitar enviar o schema inteiro
em cada record?

como governar dezenas ou centenas
de contratos?
```

A resposta comum é:

```text
Schema Registry.
```

A pergunta central desta aula será:

```text
qual é o papel de um Schema Registry

e como subjects, versões,
schema IDs, serializers
e políticas de compatibilidade

participam do fluxo
de produção e consumo?
```

A aula será conceitual e documental.

Nenhum registry será instalado.

Nenhuma dependência específica de vendor será adicionada.

Nenhum serializer conectado a registry será configurado.

Esse limite é intencional.

Antes de operar uma ferramenta, você precisa compreender:

- o problema resolvido;
- o que fica registrado;
- o que não fica registrado;
- como a compatibilidade é verificada;
- como producer e consumer interagem;
- como falhas do registry afetam o sistema;
- como naming e ownership evitam colisões;
- como JSON Schema, Avro e Protobuf diferem;
- como a governança precisa ser desenhada.

O fluxo conceitual do producer será:

```text
aplicação;

objeto;

serializer;

schema local;

subject;

Schema Registry;

schema ID;

payload serializado;

broker.
```

O fluxo conceitual do consumer será:

```text
broker;

payload;

schema ID;

cache local;

Schema Registry quando necessário;

reader schema;

deserializer;

objeto.
```

O registry não armazena eventos.

Ele armazena:

```text
schemas;

subjects;

versões;

IDs;

configurações de compatibilidade;

metadata associada.
```

Os records continuam no Kafka.

As mensagens continuam nas queues ou topics de sua arquitetura.

Outro ponto importante:

```text
schema ID
não é event version.
```

Exemplo:

```text
eventType:
orders.created.v1.

eventVersion:
1.

schema revision:
2.

schema ID:
57.
```

Esses números possuem significados diferentes.

A aula utilizará os artefatos da família `orders.created.v1` para construir uma simulação documental de registry.

Ao final, você deverá explicar:

```text
o que é subject;

o que é schema ID;

o que é versão do subject;

como compatibilidade é avaliada;

por que ID não deve ser codificado
como regra de negócio;

como serializers usam registry;

por que cache local é importante;

o que acontece se o registry cair;

por que producer e consumer
não precisam consultar o registry
em cada record;

como escolher subject naming strategy;

por que registry não substitui
governança e testes semânticos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
483:
Eventos de domínio.

484:
Schema evolution.

485:
Schema Registry conceitual.

486:
Poison message.

487:
Deduplicação.

488:
Outbox Pattern.
```

A aula 484 respondeu:

```text
como evoluir contratos
sem quebrar readers antigos
ou dados históricos?
```

A aula 485 responderá:

```text
como centralizar schemas,
versões e políticas
em uma plataforma compartilhada?
```

Nesta aula:

```text
Schema Registry:
sim, conceitual.

subject:
sim.

schema ID:
sim.

subject version:
sim.

compatibility mode:
sim.

transitive:
sim.

serializer:
sim.

deserializer:
sim.

cache:
sim.

falha do registry:
sim.

subject naming strategy:
sim.

JSON Schema:
sim.

Avro:
comparação.

Protobuf:
comparação.

instalação:
não.

integração Spring:
não.

registro remoto:
não.

poison message:
não.

deduplicação:
não.

outbox:
não.
```

A regra central será:

```text
registry centraliza
schemas e políticas;

serializers e deserializers
usam essa informação;

governança continua sendo
responsabilidade dos times.
```

---

## Objetivo prático

Ao final, o repositório terá:

```text
docs/architecture/schema-registry
├── SCHEMA_REGISTRY_CONCEPTS.md
├── SUBJECT_NAMING_POLICY.md
├── COMPATIBILITY_POLICY.md
├── REGISTRY_FAILURE_PLAYBOOK.md
├── SCHEMA_GOVERNANCE_CHECKLIST.md
└── examples
    ├── mock-subject-orders-created.json
    ├── mock-schema-id-response.json
    ├── mock-compatibility-request.json
    └── mock-compatibility-response.json
```

Também será criado:

```text
contracts/events/orders-created/registry-mapping.md
```

Você irá:

1. definir o papel do registry;
2. diferenciar schema e evento;
3. definir subject;
4. definir version;
5. definir schema ID;
6. diferenciar schema ID de event version;
7. modelar uma subject naming policy;
8. comparar estratégias de naming;
9. relacionar topic e record;
10. relacionar serializer e registry;
11. relacionar deserializer e registry;
12. compreender cache;
13. compreender cold start;
14. compreender falha do registry;
15. compreender validação de compatibilidade;
16. comparar BACKWARD, FORWARD e FULL;
17. comparar variantes TRANSITIVE;
18. comparar JSON Schema, Avro e Protobuf;
19. documentar ownership;
20. documentar rollout;
21. documentar segurança;
22. criar playbook operacional;
23. criar checklist de governança;
24. commitar;
25. preparar poison message.

---

## Conceito essencial

### O que é Schema Registry

Schema Registry é um serviço que mantém schemas versionados e políticas de compatibilidade.

Ele normalmente oferece operações para:

```text
registrar schema;

consultar schema por ID;

consultar versões de um subject;

obter versão mais recente;

validar compatibilidade;

alterar policy;

listar subjects;

apagar versões conforme governança.
```

O registry não substitui o broker.

Ele complementa o broker.

---

### O que o registry não faz

Schema Registry não:

- armazena records de negócio;
- garante entrega;
- confirma offset;
- executa consumer;
- cria idempotência;
- corrige poison messages;
- resolve semantic breaking changes sozinho;
- substitui autorização no broker;
- substitui testes de integração;
- substitui documentação do domínio.

---

### Subject

Subject é o namespace lógico sob o qual versões de schema são registradas.

Exemplo:

```text
orders.created.v1-value.
```

Um subject possui uma sequência de versões:

```text
version 1;

version 2;

version 3.
```

Cada versão referencia um schema.

O mesmo schema pode receber o mesmo ID global em alguns registries, mesmo quando aparece em subjects diferentes.

---

### Subject version

Subject version é a posição daquele schema dentro do histórico do subject.

Exemplo:

```text
subject:
orders.created.v1-value.

version:
2.
```

Isso não significa:

```text
eventVersion = 2.
```

A família do evento pode continuar em V1 enquanto o schema recebe revisões compatíveis.

---

### Schema ID

Schema ID é um identificador técnico atribuído pelo registry ao conteúdo do schema.

Exemplo:

```text
schema ID:
57.
```

O serializer pode gravar esse ID no payload codificado ou em metadata, dependendo do protocolo.

O consumer utiliza o ID para localizar o writer schema.

O ID não deve ser:

- key de negócio;
- event type;
- versionamento semântico;
- parte de regras do domínio;
- valor codificado manualmente no producer.

---

### Writer schema no registry

O producer possui um schema para serializar o record.

Antes de publicar, o serializer pode:

1. verificar se o schema está registrado;
2. registrar quando permitido;
3. obter o schema ID;
4. serializar o payload;
5. incluir o ID no formato wire;
6. enviar ao Kafka.

A configuração de auto registration precisa ser governada.

Em produção, muitos times preferem:

```text
schemas aprovados em pipeline;

producer apenas usa schema existente.
```

Isso evita registrar contratos acidentais durante runtime.

---

### Reader schema no consumer

O consumer recebe:

```text
payload serializado;

schema ID do writer.
```

O deserializer:

1. consulta cache;
2. se necessário, consulta o registry;
3. recupera writer schema;
4. combina com reader schema;
5. resolve defaults e compatibilidade;
6. cria o objeto consumido.

A resolução depende do formato utilizado.

---

### Cache local

Serializers e deserializers mantêm cache de schemas e IDs.

Sem cache, cada record poderia gerar uma chamada HTTP ao registry.

Isso seria:

- lento;
- caro;
- frágil;
- desnecessário.

Fluxo comum:

```text
primeiro record com schema ID 57:
consulta registry.

próximos records com ID 57:
usa cache.
```

O tamanho e o lifecycle do cache precisam ser configurados conforme a biblioteca.

---

### Cold start

No cold start:

- cache está vazio;
- aplicação precisa resolver schemas;
- registry pode ser consultado;
- latência inicial pode aumentar;
- indisponibilidade do registry pode impedir startup ou primeiro consumo.

O comportamento depende do serializer, deserializer e configuração.

Não presuma que todo cliente falhará da mesma forma.

---

### Registry indisponível

Cenários:

```text
producer com schema já em cache;

producer com schema novo;

consumer com writer schema em cache;

consumer recebe schema ID desconhecido;

aplicação reinicia com cache vazio.
```

Consequências possíveis:

- producer continua temporariamente;
- producer não registra schema novo;
- consumer continua com IDs conhecidos;
- consumer falha em IDs desconhecidos;
- cold start falha;
- records acumulam;
- lag aumenta;
- publicação é bloqueada.

Por isso, registry precisa de:

- alta disponibilidade;
- monitoração;
- backup;
- política de recuperação;
- autenticação;
- autorização;
- capacity planning;
- runbook.

---

### Compatibility check

Antes de aceitar um schema novo, o registry pode compará-lo com:

```text
latest version;

todas as versões anteriores.
```

O resultado pode ser:

```text
compatible;

incompatible;

errors.
```

A verificação é estrutural conforme o formato e a policy.

Ela não entende toda semântica do negócio.

---

### BACKWARD

BACKWARD significa:

```text
schema novo
lê dados escritos
pelo schema anterior.
```

É útil quando consumers são atualizados primeiro e precisam reler histórico.

---

### FORWARD

FORWARD significa:

```text
schema anterior
lê dados escritos
pelo schema novo.
```

É útil quando producers podem ser atualizados antes de todos os consumers.

---

### FULL

FULL exige:

```text
BACKWARD;

FORWARD.
```

A mudança precisa funcionar nos dois sentidos.

---

### TRANSITIVE

Variantes TRANSITIVE comparam o schema novo com todas as versões anteriores relevantes.

Exemplos:

```text
BACKWARD_TRANSITIVE;

FORWARD_TRANSITIVE;

FULL_TRANSITIVE.
```

Isso evita compatibilidade apenas com a versão imediatamente anterior enquanto uma versão mais antiga ainda quebra.

---

### NONE

NONE desabilita a verificação de compatibilidade.

Pode ser útil em laboratórios ou migrações controladas.

Em produção, usar NONE como default organizacional aumenta muito o risco.

---

### Subject naming strategies

Três estratégias comuns são:

```text
TopicNameStrategy;

RecordNameStrategy;

TopicRecordNameStrategy.
```

Os nomes podem variar entre bibliotecas e registries, mas os conceitos são:

```text
por topic;

por tipo de record;

por combinação topic + record.
```

---

### TopicNameStrategy

Exemplo:

```text
m16.orders.partitioned.v1-value.
```

Vantagens:

- simples;
- um value schema por topic;
- fácil de localizar.

Limitações:

- topic com múltiplos tipos fica difícil;
- mudança de tipo pode conflitar;
- reutilização do mesmo record em vários topics gera subjects separados.

---

### RecordNameStrategy

Exemplo conceitual:

```text
br.com.formacao.events.OrderCreatedV1.
```

Vantagens:

- contrato segue o record;
- pode ser reutilizado entre topics;
- vários tipos podem coexistir.

Limitações:

- naming pode acoplar a namespace técnico;
- governança precisa impedir colisões;
- consumidores precisam conhecer a família de records.

Não use package Java como contrato sem avaliação.

---

### TopicRecordNameStrategy

Exemplo:

```text
m16.orders.partitioned.v1-
orders.created.v1.
```

Vantagens:

- diferencia record por topic;
- suporta múltiplos tipos;
- reduz colisões.

Limitações:

- aumenta quantidade de subjects;
- dificulta reutilização;
- naming fica mais longo.

---

### Key schema e value schema

Um record Kafka pode ter:

```text
key schema;

value schema.
```

Subjects podem ser separados:

```text
topic-key;

topic-value.
```

Na baseline:

```text
key:
String orderId.

value:
evento JSON.
```

A key String pode não exigir registry.

O value é o principal contrato versionado.

---

### JSON Schema

Vantagens:

- legível;
- natural para ecossistema JSON;
- bom para APIs e eventos;
- suporta constraints;
- pode coexistir com consumidores não JVM.

Limitações:

- defaults não preenchem automaticamente;
- resolução de tipos depende da biblioteca;
- additionalProperties exige policy;
- payload tende a ser maior;
- compatibilidade semântica continua externa.

---

### Avro

Vantagens:

- formato binário compacto;
- resolução writer/reader schema madura;
- aliases e defaults bem definidos;
- forte adoção no ecossistema Kafka.

Limitações:

- tooling específico;
- schema precisa ser entendido;
- unions e defaults exigem cuidado;
- menos legível sem tooling;
- integração com modelos Java pode gerar acoplamento se mal usada.

---

### Protobuf

Vantagens:

- formato binário;
- forte contrato;
- geração de código;
- tags numéricas;
- bom suporte multiplataforma.

Limitações:

- tags não devem ser reutilizadas;
- remoções exigem reserved;
- código gerado;
- evolução de enums exige cuidado;
- organização de message types precisa de governança.

---

### Escolha do formato

A escolha deve considerar:

- linguagens;
- ecossistema;
- tamanho;
- latência;
- tooling;
- geração de código;
- evolução;
- legibilidade;
- experiência do time;
- requisitos regulatórios.

Schema Registry não obriga um único formato em toda organização, mas multiplicidade aumenta custo operacional.

---

### Registry e semantic compatibility

Um registry pode aprovar:

```text
total:
number
```

antes e depois.

Mas não detecta que o significado mudou de bruto para líquido.

Por isso, a aprovação precisa combinar:

```text
validação automática;

code review;

owner do domínio;

fixtures;

documentação;

testes de negócio.
```

---

## Mão na massa guiada

### 1. Criar diretórios

Na raiz do repositório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/schema-registry/examples" |
  Out-Null
```

---

### 2. Criar o documento de conceitos

Arquivo:

```text
docs/architecture/schema-registry/SCHEMA_REGISTRY_CONCEPTS.md
```

Estrutura:

```markdown
# Schema Registry — conceitos

## Problema resolvido

## Subject

## Subject version

## Schema ID

## Writer schema

## Reader schema

## Serializer

## Deserializer

## Cache

## Compatibilidade

## Limitações
```

Inclua exemplos da família:

```text
orders.created.v1.
```

---

### 3. Criar mapeamento da família

Arquivo:

```text
contracts/events/orders-created/registry-mapping.md
```

Conteúdo:

```markdown
# Registry mapping — orders.created.v1

## Event type

orders.created.v1

## Subject sugerido

m16.orders.partitioned.v1-orders.created.v1-value

## Naming strategy

TopicRecordNameStrategy conceitual.

## Key

String orderId.

## Value

OrderCreatedIntegrationEventV1.

## Compatibility

FULL_TRANSITIVE.

## Ownership

Order Platform Team.

## Retention do contrato

Indefinida enquanto houver records históricos.
```

Não use nome de pessoa como owner.

Use time ou área.

---

### 4. Criar policy de naming

Arquivo:

```text
docs/architecture/schema-registry/SUBJECT_NAMING_POLICY.md
```

Defina:

```text
<dominio>.<topic>-<event-type>-<key|value>
```

Exemplo:

```text
m16.orders.partitioned.v1-
orders.created.v1-value
```

Em uma única linha real:

```text
m16.orders.partitioned.v1-orders.created.v1-value
```

Regras:

- lowercase;
- sem espaços;
- sem hostname;
- sem ambiente;
- sem ID de entidade;
- sem package Java;
- sem nome de consumer;
- sufixo key ou value;
- versão majoritária no event type;
- owner documentado.

---

### 5. Criar mock de subject

Arquivo:

```text
docs/architecture/schema-registry/examples/mock-subject-orders-created.json
```

```json
{
  "subject": "m16.orders.partitioned.v1-orders.created.v1-value",
  "versions": [
    {
      "version": 1,
      "schemaId": 41,
      "schemaRevision": 1
    },
    {
      "version": 2,
      "schemaId": 57,
      "schemaRevision": 2
    }
  ],
  "compatibility": "FULL_TRANSITIVE"
}
```

Esses IDs são fictícios.

Registre isso no documento.

---

### 6. Criar mock de resposta por ID

Arquivo:

```text
docs/architecture/schema-registry/examples/mock-schema-id-response.json
```

```json
{
  "schemaId": 57,
  "schemaType": "JSON",
  "subject": "m16.orders.partitioned.v1-orders.created.v1-value",
  "version": 2,
  "schema": {
    "$id": "urn:formacao:m16:orders-created:v1:revision-2"
  }
}
```

Não trate esse JSON como API universal.

Cada implementação possui contrato próprio.

---

### 7. Criar mock de compatibilidade

Request:

```text
mock-compatibility-request.json
```

```json
{
  "subject": "m16.orders.partitioned.v1-orders.created.v1-value",
  "against": "all",
  "candidate": {
    "$id": "urn:formacao:m16:orders-created:v1:revision-2"
  }
}
```

Response:

```text
mock-compatibility-response.json
```

```json
{
  "compatible": true,
  "mode": "FULL_TRANSITIVE",
  "errors": []
}
```

Os arquivos representam conceitos, não endpoints reais.

---

### 8. Criar policy de compatibilidade

Arquivo:

```text
docs/architecture/schema-registry/COMPATIBILITY_POLICY.md
```

Baseline:

```markdown
# Política de compatibilidade

## Default organizacional

FULL_TRANSITIVE.

## Exceções

Exigem ADR e aprovação do owner do domínio.

## Mudanças compatíveis

- campo opcional;
- descrição;
- constraint que não invalida histórico;
- enum extensível com fallback.

## Mudanças incompatíveis

- required novo;
- remoção;
- rename;
- mudança de tipo;
- reutilização de campo;
- semantic breaking change.

## Rollout

1. validar schema;
2. atualizar consumers;
3. implantar consumers;
4. registrar schema;
5. implantar producer;
6. monitorar.
```

---

### 9. Comparar policies

Adicione tabela:

```markdown
| Policy | Reader novo lê antigo | Reader antigo lê novo | Compara histórico |
|---|---:|---:|---:|
| BACKWARD | Sim | Não exigido | Latest |
| FORWARD | Não exigido | Sim | Latest |
| FULL | Sim | Sim | Latest |
| BACKWARD_TRANSITIVE | Sim | Não exigido | Todas |
| FORWARD_TRANSITIVE | Não exigido | Sim | Todas |
| FULL_TRANSITIVE | Sim | Sim | Todas |
| NONE | Não valida | Não valida | Não |
```

Registre que detalhes podem variar por formato e implementação.

---

### 10. Criar diagrama do producer

Adicione ao documento:

```text
OrderCreatedIntegrationEventV1Revision2
        |
        v
JSON serializer
        |
        | subject
        | schema content
        v
local cache
        |
        +-- hit --> schema ID 57
        |
        +-- miss --> Schema Registry
                         |
                         v
                    schema ID 57
        |
        v
wire payload
        |
        v
Kafka topic
```

---

### 11. Criar diagrama do consumer

```text
Kafka record
    |
    | schema ID 57
    v
deserializer
    |
    v
local cache
    |
    +-- hit --> writer schema
    |
    +-- miss --> Schema Registry
                    |
                    v
               writer schema
    |
    v
reader schema
    |
    v
OrderCreated event
```

---

### 12. Criar playbook de falha

Arquivo:

```text
docs/architecture/schema-registry/REGISTRY_FAILURE_PLAYBOOK.md
```

Inclua os cenários:

```text
registry indisponível;

producer com schema em cache;

producer com schema novo;

consumer com ID em cache;

consumer com ID desconhecido;

restart com cache vazio;

latência elevada;

resposta inconsistente;

certificado expirado;

credencial inválida.
```

Para cada cenário, registre:

- sintoma;
- impacto;
- métrica;
- ação imediata;
- owner;
- recuperação;
- validação.

---

### 13. Definir comportamento de producer

Registre:

```text
schema conhecido e cacheado:
pode continuar conforme cliente.

schema novo:
não registrar durante indisponibilidade.

auto registration:
desabilitada em produção.

publish sem schema validado:
proibido.
```

Não invente fallback para enviar JSON sem registry quando o contrato exige encoding registrado.

Isso criaria dois formatos no mesmo topic.

---

### 14. Definir comportamento de consumer

Registre:

```text
schema ID conhecido:
usar cache.

schema ID desconhecido:
tentar registry.

registry indisponível:
pausar ou falhar controladamente.

não interpretar bytes
com schema errado.

não descartar silenciosamente.
```

A aula 486 tratará mensagens que não podem ser desserializadas ou processadas.

---

### 15. Criar checklist de governança

Arquivo:

```text
docs/architecture/schema-registry/SCHEMA_GOVERNANCE_CHECKLIST.md
```

```markdown
# Checklist de governança

## Identidade

- [ ] Subject definido.
- [ ] Event type definido.
- [ ] Owner definido.
- [ ] Topic definido.
- [ ] Key definida.

## Compatibilidade

- [ ] Policy definida.
- [ ] Fixtures históricas mantidas.
- [ ] Testes backward.
- [ ] Testes forward.
- [ ] Revisão semântica.

## Segurança

- [ ] TLS.
- [ ] Autenticação.
- [ ] Autorização.
- [ ] Secrets externalizados.
- [ ] Auditoria de alterações.

## Operação

- [ ] Alta disponibilidade.
- [ ] Backup.
- [ ] Restore testado.
- [ ] Métricas.
- [ ] Alertas.
- [ ] Runbook.
- [ ] Cache configurado.

## Lifecycle

- [ ] Depreciação.
- [ ] Major novo.
- [ ] Consumers inventariados.
- [ ] Rollout consumer-first.
- [ ] Retenção de schemas.
```

---

### 16. Criar tabela de ownership

Adicione:

```markdown
| Subject | Owner | Producer | Consumers | Policy |
|---|---|---|---|---|
| m16.orders.partitioned.v1-orders.created.v1-value | Order Platform Team | kafka-orders-lab | projection, audit | FULL_TRANSITIVE |
```

Não liste nomes pessoais.

---

### 17. Modelar pipeline de CI

Registre a sequência:

```text
1. lint do schema;

2. validar fixtures;

3. executar testes locais;

4. consultar compatibility endpoint;

5. bloquear merge se incompatível;

6. registrar schema aprovado;

7. gerar artefato;

8. implantar consumers;

9. implantar producer.
```

Não faça registro durante teste unitário offline.

O pipeline real será projetado futuramente.

---

### 18. Registrar estratégia de auto registration

Compare:

```text
true:
conveniência;
risco de contrato acidental.

false:
mais governança;
exige registro prévio.
```

Baseline recomendada:

```text
desenvolvimento local:
avaliar.

CI e produção:
false.
```

---

### 19. Registrar segurança

O registry deve utilizar:

- TLS;
- autenticação;
- autorização;
- secrets externalizados;
- rotação;
- auditoria;
- menor privilégio;
- segregação entre leitura e escrita quando suportado.

Producer nem sempre precisa permissão para criar novos subjects.

Consumer normalmente precisa apenas consultar schemas.

---

### 20. Registrar métricas

Métricas mínimas:

- disponibilidade;
- latência;
- taxa de erro;
- cache hit ratio;
- registros por subject;
- tentativas incompatíveis;
- autenticação falha;
- tamanho de resposta;
- conexões;
- uso de storage;
- backup status.

---

### 21. Comparar formatos

Crie tabela:

```markdown
| Critério | JSON Schema | Avro | Protobuf |
|---|---|---|---|
| Legibilidade | Alta | Média | Média |
| Payload | Maior | Compacto | Compacto |
| Geração de código | Opcional | Comum | Comum |
| Defaults | Anotação no JSON Schema | Resolução formal | Regras próprias |
| Evolução | Boa com policy | Muito madura | Boa com tags |
| Multilíngue | Sim | Sim | Sim |
| Tooling Kafka | Bom | Muito forte | Forte |
```

Evite declarar um vencedor universal.

---

### 22. Criar uma revisão arquitetural

Responda:

```text
por que FULL_TRANSITIVE?

por que TopicRecordNameStrategy?

por que auto registration false?

por que owner é time?

por que schemas históricos não são apagados?

por que ID não aparece na regra de negócio?

por que cache não elimina HA?
```

Registre as respostas no documento.

---

### 23. Não instalar registry

Não crie:

- container de Schema Registry;
- dependência de serializer de vendor;
- credencial;
- endpoint;
- schema registration real;
- wire format real.

A aula é conceitual.

A instalação sem governança desviaria o objetivo.

---

### 24. Validar os documentos

```powershell
Get-ChildItem `
  "docs/architecture/schema-registry" `
  -Recurse
```

Execute:

```powershell
git diff --check
```

Procure:

```powershell
git grep `
  -n `
  -E `
  "subject|schema ID|FULL_TRANSITIVE|auto registration|cache|owner"
```

---

## Entendendo o que foi feito

### O registry ganhou função precisa

Ele registra schemas e policies, não eventos.

### Subject passou a organizar versões

O contrato ganhou namespace e histórico.

### Schema ID ficou separado do domínio

ID é detalhe técnico do registry.

### Serializer e deserializer foram conectados

Producer registra ou consulta; consumer resolve writer schema.

### Cache ficou essencial

Nem todo record gera chamada remota.

### Cold start ganhou risco próprio

Cache vazio aumenta dependência do registry.

### Compatibilidade virou policy central

FULL_TRANSITIVE foi escolhida para a baseline.

### Naming virou governança

Subject precisa de convenção e owner.

### Falha operacional ficou documentada

Producer e consumer possuem impactos diferentes.

### A próxima etapa ficou preparada

Poison messages poderão incluir falha de schema, desserialização e contrato.

---

## Erros comuns importantes

### Achar que registry armazena eventos

Ele armazena schemas e metadata.

### Confundir schema ID com event version

São conceitos distintos.

### Codificar ID manualmente

IDs são atribuídos pelo registry.

### Auto registrar em produção sem revisão

Um deploy pode publicar contrato acidental.

### Consultar registry a cada record

Cache deve evitar chamadas repetidas.

### Achar que cache elimina dependência

Cold start e IDs novos ainda exigem registry.

### Usar NONE como default

Mudanças incompatíveis passam sem bloqueio.

### Escolher subject naming por conveniência local

Colisões e acoplamento aparecem depois.

### Usar package Java como contrato

Consumers não JVM ficam acoplados.

### Apagar schemas antigos

Records retidos podem depender deles.

### Considerar schema aprovado semanticamente

Registry valida estrutura, não toda regra de negócio.

### Fazer fallback para JSON puro

Mistura wire formats no mesmo topic.

### Dar permissão de escrita a todos

Governança e segurança ficam frágeis.

---

## Comandos úteis

### Listar documentos

```powershell
Get-ChildItem `
  "docs/architecture/schema-registry" `
  -Recurse
```

### Revisar mapping

```powershell
Get-Content `
  "contracts/events/orders-created/registry-mapping.md"
```

### Procurar compatibility

```powershell
git grep `
  -n `
  -E `
  "BACKWARD|FORWARD|FULL|TRANSITIVE|NONE"
```

### Ver diff

```powershell
git diff `
  -- `
  "docs/architecture/schema-registry" `
  "contracts/events/orders-created/registry-mapping.md"
```

---

## Exercício guiado

### Parte 1 — Subject

Defina subject para `orders.created.v1`.

### Parte 2 — Naming

Escolha e justifique a strategy.

### Parte 3 — Versions

Mapeie revisions para subject versions.

### Parte 4 — IDs

Crie IDs fictícios e diferencie do domínio.

### Parte 5 — Compatibility

Defina FULL_TRANSITIVE.

### Parte 6 — Producer

Desenhe serializer e cache.

### Parte 7 — Consumer

Desenhe deserializer e reader schema.

### Parte 8 — Falha

Crie playbook para registry indisponível.

### Parte 9 — Formatos

Compare JSON Schema, Avro e Protobuf.

### Parte 10 — Governança

Crie checklist e ownership.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 484 foi preservada;
- Schema Registry foi explicado;
- registry foi diferenciado do broker;
- registry não foi tratado como storage de eventos;
- subject foi explicado;
- subject version foi explicada;
- schema ID foi explicado;
- schema ID foi diferenciado de event version;
- schema ID foi diferenciado de schema revision;
- writer schema foi relacionado ao producer;
- reader schema foi relacionado ao consumer;
- serializer foi explicado;
- deserializer foi explicado;
- wire format foi contextualizado;
- cache local foi explicado;
- cache hit foi explicado;
- cache miss foi explicado;
- cold start foi explicado;
- indisponibilidade foi analisada;
- producer com schema conhecido foi analisado;
- producer com schema novo foi analisado;
- consumer com ID conhecido foi analisado;
- consumer com ID desconhecido foi analisado;
- fallback inseguro foi proibido;
- compatibility check foi explicado;
- BACKWARD foi explicado;
- FORWARD foi explicado;
- FULL foi explicado;
- TRANSITIVE foi explicado;
- NONE foi contextualizado;
- FULL_TRANSITIVE foi escolhido;
- subject naming strategies foram comparadas;
- TopicNameStrategy foi explicada;
- RecordNameStrategy foi explicada;
- TopicRecordNameStrategy foi explicada;
- policy de naming foi criada;
- package Java não virou contrato;
- key e value schemas foram diferenciados;
- JSON Schema foi comparado;
- Avro foi comparado;
- Protobuf foi comparado;
- nenhum formato foi declarado universalmente superior;
- auto registration foi discutida;
- baseline de produção recomendou false;
- pipeline de CI foi desenhado;
- owner foi definido por time;
- segurança foi documentada;
- autorização de leitura e escrita foi separada;
- métricas foram documentadas;
- alta disponibilidade foi documentada;
- backup e restore foram documentados;
- mock files foram criados;
- IDs fictícios foram marcados;
- APIs fictícias não foram tratadas como padrão universal;
- governança checklist foi criado;
- registry mapping foi criado;
- schema semantic review foi mantida;
- instalação não foi feita;
- dependência de vendor não foi adicionada;
- poison message não foi antecipada;
- deduplicação não foi antecipada;
- outbox não foi antecipado;
- commit recomendado está pronto;
- ponte para aula 486 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Revise:

```powershell
git diff `
  -- `
  docs/architecture/schema-registry `
  contracts/events/orders-created/registry-mapping.md
```

Adicione:

```powershell
git add `
  docs/architecture/schema-registry `
  contracts/events/orders-created/registry-mapping.md `
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
git commit -m "docs(m16): modelar Schema Registry conceitual"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credencial;
- endpoint real;
- schema ID real;
- token;
- certificado;
- contrato corporativo;
- dependência de vendor;
- container antecipado;
- arquivo temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a evolução de contratos ganhou uma plataforma conceitual de governança.

O modelo ficou:

```text
event family;

subject;

subject versions;

schema IDs;

compatibility policy;

serializer;

deserializer;

cache;

registry;

broker.
```

Você comprovou que:

- Schema Registry não armazena eventos;
- subject organiza versões de schema;
- schema ID é identificador técnico;
- event version pertence ao contrato;
- serializer associa payload e schema;
- deserializer resolve writer e reader schemas;
- cache reduz chamadas remotas;
- cold start continua dependente do registry;
- FULL_TRANSITIVE protege todo o histórico;
- auto registration em produção pode ser perigosa;
- naming strategy altera a forma de governar contratos;
- JSON Schema, Avro e Protobuf possuem trade-offs;
- registry não detecta toda mudança semântica;
- alta disponibilidade, segurança e runbook são obrigatórios.

A próxima aula será:

```text
486 - M16.31 - Poison message
```

Nela, você irá:

- definir poison message em mensageria;
- diferenciar falha de transporte, schema e negócio;
- simular payload inválido;
- simular schema incompatível;
- impedir loop de consumo;
- preservar bytes e metadata;
- criar quarantine flow;
- registrar causa;
- criar política de descarte;
- preparar deduplicação.

A próxima aula trabalhará falha de consumo.

Nenhum fluxo de poison message foi implementado antecipadamente aqui.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei registry e broker.
- [ ] Modelei subject, version e schema ID.
- [ ] Defini FULL_TRANSITIVE.
- [ ] Escolhi naming strategy.
- [ ] Modelei serializer, deserializer e cache.
- [ ] Criei playbook de falha.
- [ ] Comparei formatos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Subject cresce sem controle

Revise naming strategy, ownership e lifecycle.

### Producer registra schema acidental

Desabilite auto registration e mova registro para CI.

### Consumer falha em schema ID conhecido

Cache pode estar inconsistente ou o registry retornou conteúdo inesperado.

### Consumer falha somente após restart

O cache vazio revelou dependência do registry.

### Registry aprova mudança errada

A mudança pode ser semanticamente incompatível apesar de estruturalmente válida.

### IDs diferem entre ambientes

Schema IDs são detalhes técnicos do registry e não devem ser comparados como regra de negócio.

### Mesmo schema recebe ID inesperado

Deduplicação e escopo de IDs dependem da implementação.

### Topic aceita records sem registry

O broker não conhece necessariamente a policy de schema. O serializer e a governança precisam impedir formatos indevidos.

### Restore do registry perde versões

Records históricos podem se tornar ilegíveis. Backup e restore precisam ser testados.

### Cache fica grande

Revise limites e quantidade de schemas.

---

## Perguntas de revisão

1. O que Schema Registry armazena?
2. Ele armazena eventos?
3. O que é subject?
4. O que é subject version?
5. O que é schema ID?
6. Schema ID é event version?
7. Quem usa writer schema?
8. Quem usa reader schema?
9. Para que serve cache?
10. O que acontece no cold start?
11. O que é BACKWARD?
12. O que é FORWARD?
13. O que é FULL?
14. O que significa TRANSITIVE?
15. O que faz NONE?
16. O que é auto registration?
17. Qual baseline de produção?
18. Registry valida semântica?
19. Registry foi instalado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Schemas, versões, IDs e policies.
2. Não.
3. Namespace lógico de versões.
4. Posição do schema no subject.
5. Identificador técnico do schema.
6. Não.
7. Producer e serializer.
8. Consumer e deserializer.
9. Evitar consultas repetidas.
10. Cache vazio pode exigir registry.
11. Reader novo lê dados antigos.
12. Reader antigo lê dados novos.
13. Os dois sentidos.
14. Compara todo o histórico.
15. Desabilita validação.
16. Registro automático pelo cliente.
17. Desabilitada e controlada por CI.
18. Não completamente.
19. Não.
20. Poison message.

---

## Desafio opcional

Modele o registry mapping para:

```text
orders.confirmed.v1.
```

Requisitos:

- subject;
- naming strategy;
- owner;
- key;
- value;
- FULL_TRANSITIVE;
- duas revisions fictícias;
- schema IDs fictícios;
- mock compatibility response;
- failure playbook;
- nenhuma instalação;
- nenhuma dependência de vendor.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 485 - M16.30 - Schema Registry conceitual

- Continuei a partir da aula de schema evolution.
- Entendi o papel de um Schema Registry.
- Diferenciei registry e broker.
- Entendi que registry não armazena eventos.
- Defini subject.
- Defini subject version.
- Defini schema ID.
- Diferenciei schema ID, event version e schema revision.
- Relacionei writer schema ao producer.
- Relacionei reader schema ao consumer.
- Modelei serializer e deserializer.
- Entendi wire format em nível conceitual.
- Entendi cache local.
- Diferenciei cache hit e cache miss.
- Analisei cold start.
- Analisei indisponibilidade do registry.
- Analisei producer com schema conhecido.
- Analisei producer com schema novo.
- Analisei consumer com ID conhecido.
- Analisei consumer com ID desconhecido.
- Proibi fallback para formato não registrado.
- Revisei BACKWARD, FORWARD e FULL.
- Revisei variantes TRANSITIVE.
- Escolhi FULL_TRANSITIVE como baseline.
- Contextualizei NONE.
- Comparei TopicNameStrategy.
- Comparei RecordNameStrategy.
- Comparei TopicRecordNameStrategy.
- Criei policy de naming.
- Não usei package Java como contrato.
- Diferenciei key schema e value schema.
- Comparei JSON Schema, Avro e Protobuf.
- Discuti auto registration.
- Recomendei auto registration false em produção.
- Modelei pipeline de CI.
- Defini ownership por time.
- Documentei TLS, autenticação e autorização.
- Documentei métricas e alertas.
- Criei playbook de falha.
- Criei checklist de governança.
- Criei mock files conceituais.
- Não instalei registry.
- Não adicionei dependência de vendor.
- Próxima aula: Poison message.
```

---

## Referência técnica curta

- Confluent Schema Registry — Concepts.
- Confluent Schema Registry — Compatibility Types.
- Confluent Schema Registry — Subject Name Strategies.
- Confluent Schema Registry — Serializer and Deserializer.
- JSON Schema — Specification.
- Apache Avro — Specification.
- Protocol Buffers — Language Guide.
- Apache Kafka — Serialization.
- Spring Kafka — Serialization and Deserialization.
- AsyncAPI — Message schemas.

Regra final:

```text
Schema Registry centraliza schemas, subjects, versões, IDs e políticas de compatibilidade, mas não armazena eventos nem substitui o broker; subject organiza o histórico de um contrato, subject version representa sua posição nesse histórico e schema ID é um identificador técnico usado pelo wire format; serializers consultam ou registram schemas e gravam o ID, enquanto deserializers resolvem writer e reader schemas usando cache local; cache reduz chamadas, mas cold start e IDs novos continuam dependentes do registry; FULL_TRANSITIVE protege readers novos, readers antigos e todo o histórico; naming strategy, auto registration, owner, segurança, alta disponibilidade, backup e CI precisam de governança; JSON Schema, Avro e Protobuf oferecem trade-offs distintos, e nenhum registry detecta sozinho toda mudança semântica do domínio.
```
