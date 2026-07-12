# 412 - M15.02 - Threat modeling inicial

## Apresentação da aula

Na aula 411, o Módulo 15 foi iniciado com uma baseline de segurança.

Você registrou:

```text
ativos;

dados;

atores;

pontos de entrada;

limites de confiança;

controles presentes;

controles ausentes;

premissas do laboratório.
```

A baseline comprovou o estado real da aplicação:

```text
a API funciona;

a API não autentica;

a API não autoriza;

X-Client-Id não prova identidade;

ETag protege concorrência,
não permissão;

HTTP local não é transporte
adequado para produção.
```

Aquela aula respondeu:

```text
o que possui valor,
quem interage com o sistema
e quais controles existem hoje?
```

Agora essas informações serão transformadas em um modelo de ameaças inicial.

A pergunta central desta aula será:

```text
como antecipar formas de abuso,
falha e exploração
antes de implementar controles
ou sofrer um incidente?
```

Threat modeling é uma prática estruturada para raciocinar sobre:

- o que pode dar errado;
- onde pode acontecer;
- quem ou o que pode causar;
- qual ativo é afetado;
- qual impacto é possível;
- quais controles já reduzem o risco;
- qual mitigação precisa ser planejada.

O objetivo não é prever todos os ataques possíveis.

Isso seria inviável.

O objetivo é melhorar decisões.

Um modelo de ameaças inicial ajuda a evitar perguntas tardias como:

```text
como um usuário acessou
a OS de outro cliente?

por que o token apareceu no log?

por que o upload derrubou a API?

por que o endpoint administrativo
estava exposto?

por que não sabemos
quem alterou o recurso?
```

Nesta aula, você criará:

```text
docs/security/M15_THREAT_MODEL.md
```

O documento conterá:

```text
escopo;

premissas;

ativos;

atores;

componentes;

data flows;

trust boundaries;

ameaças STRIDE;

priorização;

controles atuais;

mitigações;

backlog;

riscos aceitos;

gatilhos de revisão.
```

O método de elicitação será:

```text
STRIDE.
```

Categorias:

```text
S:
Spoofing.

T:
Tampering.

R:
Repudiation.

I:
Information Disclosure.

D:
Denial of Service.

E:
Elevation of Privilege.
```

STRIDE ajuda a fazer perguntas sistemáticas.

Ele não substitui:

- conhecimento do domínio;
- testes;
- revisão de código;
- análise de dependências;
- monitoramento;
- resposta a incidentes.

A aplicação utilizada continuará sendo a API do M14.

O foco principal será a API de Ordem de Serviço.

Também serão considerados:

- PostgreSQL;
- Redis;
- uploads;
- SMTP;
- Actuator;
- logs;
- Docker Compose;
- configuração.

A prática não implementará Spring Security.

Também não corrigirá todas as ameaças encontradas.

Isso seria um erro de sequência.

Primeiro, você precisa:

1. identificar;
2. descrever;
3. priorizar;
4. selecionar tratamento;
5. criar backlog.

As próximas aulas implementarão controles no momento adequado.

A aula seguinte será:

```text
413 - M15.03 - OWASP Top 10 aplicado
```

Nela, o threat model será comparado a categorias de risco amplamente utilizadas em segurança de aplicações.

Por isso, esta aula não fará ainda um mapeamento completo do OWASP Top 10.

---

## Onde estamos na formação

A sequência inicial do M15 é:

```text
411:
Fundamentos seguranca web.

412:
Threat modeling inicial.

413:
OWASP Top 10 aplicado.

414:
CORS profundo.

415:
CSRF quando importa em APIs.

416:
Security headers.
```

A aula 411 respondeu:

```text
qual é a baseline
de segurança da aplicação?
```

A aula 412 responderá:

```text
quais ameaças surgem
nos componentes,
fluxos e fronteiras
da aplicação atual?
```

Nesta aula:

```text
escopo:
sim.

diagrama de fluxo:
sim.

trust boundaries:
sim.

STRIDE:
sim.

registro de ameaças:
sim.

priorização inicial:
sim.

backlog:
sim.

mitigações candidatas:
sim.

implementação:
não.

OWASP Top 10 completo:
não.

Spring Security:
não.

JWT:
não.

teste de invasão:
não.
```

A regra central será:

```text
ameaças precisam ser ligadas
a ativos, componentes,
fluxos e evidências;

listas genéricas
não substituem análise
do sistema real.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_THREAT_MODEL.md
```

Estrutura:

```text
# Threat model inicial

## Identificacao
## Escopo
## Fora do escopo
## Premissas
## Ativos
## Atores
## Componentes
## Data flows
## Trust boundaries
## Metodo STRIDE
## Registro de ameacas
## Priorizacao
## Backlog de seguranca
## Riscos aceitos
## Gatilhos de revisao
## Decisao
```

O modelo utilizará identificadores:

```text
E:
external entity.

P:
process.

D:
data store.

F:
data flow.

TB:
trust boundary.

THR:
threat.
```

Exemplo:

```text
E1:
API Consumer.

P1:
Spring Boot API.

D1:
PostgreSQL.

F1:
HTTP request.

TB1:
Cliente para API.

THR-001:
Acesso não autorizado a OS.
```

Você irá:

1. definir o escopo;
2. registrar o que está fora;
3. reutilizar ativos da baseline;
4. identificar componentes;
5. numerar fluxos;
6. desenhar trust boundaries;
7. aplicar STRIDE;
8. escrever cenários de ameaça;
9. identificar controles existentes;
10. estimar probabilidade;
11. estimar impacto;
12. calcular prioridade inicial;
13. definir mitigação;
14. criar backlog;
15. registrar riscos aceitos;
16. definir quando revisar o modelo;
17. commitar.

---

## Conceito essencial

### Threat model não é lista de vulnerabilidades

Uma lista de vulnerabilidades pode dizer:

```text
sem autenticação;

sem TLS;

upload local.
```

Um threat model conecta contexto.

Exemplo:

```text
um consumidor não autenticado
envia GET para uma OS de outro cliente,
atravessa TB1,
alcança P1,
consulta D1
e recebe dados confidenciais.
```

Essa descrição informa:

- ator;
- ponto de entrada;
- fronteira;
- componente;
- ativo;
- impacto;
- controle ausente.

Ela é mais útil para selecionar mitigação.

---

### Escopo

Threat model precisa de limite.

Escopo desta aula:

```text
API Spring Boot local;

endpoints de negócio;

API de Ordem de Serviço;

PostgreSQL;

Redis;

filesystem de uploads;

SMTP;

Actuator;

Docker Compose;

configuração e logs.
```

Fora do escopo:

```text
infraestrutura cloud real;

Kubernetes;

provedor de identidade;

rede corporativa;

dispositivo do usuário;

browser frontend real;

pipeline CI/CD real;

fornecedor de SMTP de produção.
```

Fora do escopo não significa sem importância.

Significa:

```text
não será analisado
nesta versão do modelo.
```

---

### Modelo deve representar a versão avaliada

Registre:

- commit;
- data;
- ambiente;
- diagrama;
- responsáveis.

Uma mudança pode invalidar o modelo.

Exemplos:

- adicionar login;
- publicar Actuator;
- mover arquivos para cloud;
- adicionar fila;
- criar endpoint administrativo;
- aceitar upload novo;
- escalar para várias instâncias.

---

### External entity

External entity é algo fora do sistema modelado que interage com ele.

Exemplos:

```text
E1:
API Consumer.

E2:
Operator/Developer.

E3:
Potential Attacker.

E4:
SMTP Provider.
```

Um ator legítimo pode também originar uso indevido.

Não use o modelo para rotular pessoas.

Modele capacidades e acessos.

---

### Process

Process transforma ou coordena dados.

Exemplos:

```text
P1:
Spring Boot API.

P2:
Service Order Use Cases.

P3:
File Processing.

P4:
Scheduled Cleanup.
```

Você pode modelar a aplicação inteira como um processo no primeiro diagrama.

Depois, detalhe uma área crítica.

Não crie centenas de caixas na primeira versão.

---

### Data store

Data store guarda informação.

Exemplos:

```text
D1:
PostgreSQL.

D2:
Redis.

D3:
Upload Volume.

D4:
Application Logs.

D5:
Configuration/Secrets.
```

O data store pode estar fora da aplicação Java e ainda pertencer ao escopo.

---

### Data flow

Data flow representa informação passando entre elementos.

Exemplos:

```text
F1:
HTTP request/response.

F2:
JDBC/SQL.

F3:
Redis commands.

F4:
File read/write.

F5:
SMTP submission.

F6:
Operational logs.

F7:
Actuator request/response.
```

Fluxo precisa indicar:

- origem;
- destino;
- dados;
- protocolo;
- proteção atual.

---

### Trust boundary

Trust boundary marca mudança de confiança, controle ou responsabilidade.

Exemplos:

```text
TB1:
cliente para API publicada.

TB2:
API para serviços internos.

TB3:
container para host e volumes.

TB4:
operador para management.

TB5:
API para SMTP externo.
```

Toda travessia merece perguntas de segurança.

---

### STRIDE — Spoofing

Spoofing é falsificação de identidade.

Perguntas:

- alguém pode se passar por outro usuário?
- o header de cliente pode ser forjado?
- o serviço valida origem?
- o operador é autenticado?
- o SMTP confia no remetente?

Na baseline:

```text
X-Client-Id
é controlado pelo cliente.
```

Ameaça:

```text
um consumidor altera o header
para evitar rate limiting
ou simular outro cliente.
```

---

### STRIDE — Tampering

Tampering é alteração não autorizada de dados ou código.

Perguntas:

- request pode ser modificada em trânsito?
- alguém pode alterar uma OS sem permissão?
- arquivo pode ser substituído?
- migration pode ser editada?
- volume pode ser manipulado?
- log pode receber conteúdo malicioso?

Na baseline:

```text
HTTP não possui TLS.
```

No laboratório local, a premissa reduz exposição.

Em rede não confiável, o tráfego poderia ser alterado.

---

### STRIDE — Repudiation

Repudiation ocorre quando uma ação não pode ser atribuída de forma confiável.

Perguntas:

- quem alterou a OS?
- qual identidade foi autenticada?
- existe registro de sucesso e falha?
- logs podem ser correlacionados?
- relógio é confiável?
- auditoria é protegida?

Na baseline:

```text
correlation ID identifica request;

não existe identidade autenticada.
```

Portanto, a aplicação não consegue provar qual usuário realizou a ação.

---

### STRIDE — Information Disclosure

Information Disclosure é exposição indevida de informação.

Perguntas:

- endpoint permite ler dados de outro cliente?
- logs contêm dados pessoais?
- erro expõe SQL?
- upload pode ser baixado por qualquer pessoa?
- OpenAPI revela endpoint administrativo?
- management expõe detalhes?
- env file pode ser lido?

Na baseline:

```text
qualquer consumidor
pode consultar qualquer OS conhecida.
```

Esse é um risco direto de confidencialidade.

---

### STRIDE — Denial of Service

Denial of Service reduz disponibilidade.

Perguntas:

- request cara possui limite?
- upload possui tamanho máximo?
- paginação possui máximo?
- rate limit pode ser contornado?
- query contains pode consumir banco?
- scheduler pode competir?
- SMTP lento prende thread?
- logs podem crescer sem controle?

Controles atuais:

```text
size máximo;

upload máximo;

timeouts;

rate limiting inicial;

health.
```

Ressalva:

```text
X-Client-Id pode ser trocado.
```

---

### STRIDE — Elevation of Privilege

Elevation of Privilege permite obter capacidade superior.

Perguntas:

- usuário comum alcança endpoint administrativo?
- consumidor pode mudar status proibido?
- role é validada?
- autorização existe só no frontend?
- management está publicado?
- aplicação roda como root?

A imagem roda sem root.

Porém, endpoints de negócio não possuem roles.

Todo consumidor possui efetivamente o mesmo acesso.

---

### Cenário de ameaça

Formato recomendado:

```text
Um [ator]
pode [ação]
através de [entrada/fluxo]
explorando [fraqueza]
afetando [ativo]
e causando [impacto].
```

Exemplo:

```text
Um consumidor não autenticado
pode consultar uma OS de outro cliente
através do GET por ID,
explorando ausência de autorização por objeto,
afetando dados de cliente
e causando divulgação indevida.
```

---

### Controle preventivo, detectivo e responsivo

Preventivo:

```text
impede ou reduz ocorrência.
```

Exemplos:

- autenticação;
- autorização;
- TLS;
- validation;
- limite de tamanho.

Detectivo:

```text
ajuda a perceber.
```

Exemplos:

- logs;
- auditoria;
- alertas;
- métricas;
- detecção de anomalia.

Responsivo:

```text
ajuda a conter e recuperar.
```

Exemplos:

- revogação;
- bloqueio;
- rollback;
- restore;
- resposta a incidente.

Um threat model não deve sugerir somente prevenção.

---

### Priorização inicial

Nesta aula será utilizada uma escala simples.

Probabilidade:

```text
1:
baixa.

2:
média.

3:
alta.
```

Impacto:

```text
1:
baixo.

2:
médio.

3:
alto.
```

Score:

```text
probabilidade x impacto.
```

Classificação:

```text
1:
BAIXA.

2 a 3:
MEDIA.

4 a 6:
ALTA.

9:
CRITICA.
```

Essa matriz não produz precisão científica.

Ela serve para ordenar discussão.

Explique as razões da nota.

---

### Risco inerente e residual

Risco inerente:

```text
risco antes dos controles considerados.
```

Risco residual:

```text
risco que permanece
depois dos controles atuais.
```

Exemplo:

```text
upload sem limite:
risco inerente alto.

limite de 5 MB:
reduz o risco.

sem antivírus e sem quota:
risco residual ainda existe.
```

---

### Tratamento de risco

Opções:

`MITIGAR`

```text
adicionar ou melhorar controle.
```

`EVITAR`

```text
remover a funcionalidade ou exposição.
```

`TRANSFERIR`

```text
compartilhar responsabilidade
com serviço ou contrato.
```

`ACEITAR`

```text
manter conscientemente
sob condições registradas.
```

Aceitar risco não significa ignorar.

Precisa de:

- justificativa;
- responsável;
- validade;
- condição;
- revisão.

---

### Backlog de segurança

Cada ameaça relevante deve gerar uma ação rastreável.

Campos:

```text
ID;

ameaça relacionada;

ação;

prioridade;

responsável;

critério de aceite;

aula ou marco.
```

Exemplo:

```text
SEC-BL-001;

THR-001;

implementar autenticação;

CRITICA;

Backend;

requests sem credencial recebem 401.
```

Não tente resolver todas hoje.

---

## Mão na massa guiada

### 1. Criar o documento

Arquivo:

```text
docs/security/M15_THREAT_MODEL.md
```

Cabeçalho:

```markdown
# Threat model inicial

## Identificacao

- Aplicacao: formacao-java-backend-api
- Escopo: laboratorio local e API OS
- Commit: `<preencher>`
- Data: `<preencher>`
- Responsavel: `<preencher>`
- Status: INICIAL
```

Preencha:

```powershell
git rev-parse HEAD
```

---

### 2. Definir escopo e fora do escopo

Use duas listas.

Inclua explicitamente:

```text
API;

PostgreSQL;

Redis;

uploads;

SMTP;

Actuator;

Compose;

logs.
```

Registre ambientes não modelados.

---

### 3. Reutilizar ativos

Copie da baseline somente o inventário necessário.

Não duplique descrições extensas.

Crie IDs:

```text
A1:
Service Order Data.

A2:
Customer Data.

A3:
Uploaded Files.

A4:
Database Credentials.

A5:
Application Availability.

A6:
Logs and Audit Evidence.

A7:
Source and Migrations.
```

---

### 4. Identificar atores

```text
E1:
API Consumer.

E2:
Operator/Developer.

E3:
Potential Attacker.

E4:
SMTP Provider.
```

Para cada ator, registre:

- acesso esperado;
- confiança inicial;
- canal;
- autenticação atual.

E1 e E3 chegam ao mesmo endpoint público na baseline.

A aplicação ainda não diferencia suas identidades.

---

### 5. Identificar componentes

```text
P1:
Spring Boot API.

P2:
Service Order Use Cases.

P3:
File Upload/Download.

P4:
Scheduled Cleanup.

P5:
Email Notification.

D1:
PostgreSQL.

D2:
Redis.

D3:
Upload Volume.

D4:
Application Logs.

D5:
Local Environment Configuration.
```

---

### 6. Desenhar o diagrama textual

```text
E1 API Consumer
       |
       | F1 HTTP JSON / multipart
       | TB1
       v
P1 Spring Boot API
       |
       +---- F2 JDBC / TB2 ----> D1 PostgreSQL
       |
       +---- F3 Redis / TB2 ---> D2 Redis
       |
       +---- F4 File I/O ------> D3 Upload Volume
       |
       +---- F5 SMTP / TB5 ----> E4 SMTP Provider
       |
       +---- F6 Logs ----------> D4 Logs

E2 Operator
       |
       | F7 Actuator / TB4
       v
P1 Spring Boot API
```

O diagrama não precisa mostrar cada classe.

---

### 7. Criar tabela de data flows

```markdown
| ID | Origem | Destino | Dados | Protocolo | Protecao atual |
|---|---|---|---|---|---|
| F1 | E1 | P1 | JSON, headers, files | HTTP | Validation e rate limit parcial |
| F2 | P1 | D1 | Dados de dominio | JDBC | Rede interna |
| F3 | P1 | D2 | Cache e contadores | Redis | Rede interna |
| F4 | P1 | D3 | Arquivos | Filesystem | UUID e allowlist |
| F5 | P1 | E4 | Notificacao | SMTP | Laboratorio |
| F7 | E2 | P1 | Health e metrics | HTTP loopback | Bind local |
```

---

### 8. Criar tabela de trust boundaries

```markdown
| ID | Fronteira | Mudanca de confianca |
|---|---|---|
| TB1 | Cliente -> API | Entrada nao confiavel |
| TB2 | API -> dados internos | Processo para infraestrutura |
| TB3 | Container -> host/volume | Runtime para persistencia |
| TB4 | Operador -> management | Acesso operacional |
| TB5 | API -> SMTP | Servico externo |
```

---

### 9. Aplicar STRIDE em TB1

Pergunte:

`Spoofing`

```text
o cliente pode fingir identidade?
```

`Tampering`

```text
o tráfego pode ser alterado?
```

`Repudiation`

```text
a ação pode ser atribuída?
```

`Information Disclosure`

```text
dados de outra OS podem ser lidos?
```

`Denial of Service`

```text
entrada pode esgotar recursos?
```

`Elevation`

```text
cliente alcança ações privilegiadas?
```

Crie ameaças somente quando fizer sentido.

---

### 10. Criar THR-001

```markdown
### THR-001 — Acesso a OS de outro cliente

- Categoria: Information Disclosure / Elevation of Privilege
- Ator: E1 ou E3
- Fluxo: F1
- Fronteira: TB1
- Ativo: A1, A2
- Cenario: consumidor consulta uma OS sem autorizacao por objeto
- Evidencia: GET aceita qualquer X-Client-Id
- Controles atuais: UUID e validation
- Probabilidade: 3
- Impacto: 3
- Score: 9
- Prioridade: CRITICA
- Tratamento: MITIGAR
- Mitigacao candidata: autenticacao e autorizacao por recurso
```

UUID não reduz o risco a zero.

---

### 11. Criar THR-002

```text
falsificação de X-Client-Id
para contornar rate limiting.
```

Categoria:

```text
Spoofing / Denial of Service.
```

Controles:

```text
Redis e janela.
```

Fraqueza:

```text
identificador controlado pelo cliente.
```

---

### 12. Criar THR-003

```text
alteração de OS por usuário não autorizado
com ETag válido.
```

Categoria:

```text
Tampering / Elevation of Privilege.
```

Controle atual:

```text
If-Match.
```

Ressalva:

```text
If-Match prova versão,
não permissão.
```

---

### 13. Criar THR-004

```text
ação sensível sem identidade auditável.
```

Categoria:

```text
Repudiation.
```

Controle atual:

```text
correlation ID e logs técnicos.
```

Gap:

```text
sem subject autenticado.
```

---

### 14. Criar THR-005

```text
interceptação ou alteração do tráfego HTTP
fora do laboratório controlado.
```

Categoria:

```text
Tampering / Information Disclosure.
```

Tratamento:

```text
TLS.
```

Para ambiente local restrito, o risco pode ser aceito temporariamente.

---

### 15. Criar THR-006

```text
esgotamento de recursos
por requests distribuídas
com client IDs variáveis.
```

Categoria:

```text
Denial of Service.
```

Controles atuais:

- rate limiting;
- size máximo;
- timeouts.

Gap:

- identidade não confiável;
- sem limite de infraestrutura;
- sem WAF ou gateway;
- sem teste de carga.

---

### 16. Criar THR-007

```text
upload de conteúdo malicioso
ou consumo de armazenamento.
```

Categoria:

```text
Tampering / Denial of Service.
```

Controles atuais:

- 5 MB;
- allowlist;
- UUID;
- normalização.

Gaps:

- sem antivírus;
- sem quota;
- sem storage isolado;
- sem análise de conteúdo.

---

### 17. Criar THR-008

```text
exposição de secret local
por arquivo, log ou configuração.
```

Categoria:

```text
Information Disclosure.
```

Controles atuais:

- `.gitignore`;
- env example sem valor;
- logs revisados.

Gaps:

- sem secret manager;
- sem rotação;
- sem scanner automático.

---

### 18. Criar THR-009

```text
abuso de endpoint operacional
se management deixar o loopback.
```

Categoria:

```text
Information Disclosure / Elevation of Privilege.
```

Controle atual:

```text
127.0.0.1:8082;

allowlist de endpoints.
```

Gatilho:

```text
qualquer mudança de binding.
```

---

### 19. Criar THR-010

```text
execução duplicada de scheduler
em múltiplas instâncias.
```

Categoria:

```text
Tampering / Denial of Service.
```

Controle atual:

```text
uma instância no laboratório.
```

Gap:

```text
sem lock distribuído.
```

Tratamento pode ser adiado até existir escala horizontal.

---

### 20. Criar o registro consolidado

Tabela:

```markdown
| ID | Categoria | Ativo | P | I | Score | Prioridade | Tratamento |
|---|---|---|---:|---:|---:|---|---|
| THR-001 | I/E | A1/A2 | 3 | 3 | 9 | CRITICA | MITIGAR |
| THR-002 | S/D | A5 | 3 | 2 | 6 | ALTA | MITIGAR |
```

Explique as notas.

Não use score sem narrativa.

---

### 21. Criar o backlog

```markdown
| ID | Ameaca | Acao | Prioridade | Marco | Criterio de aceite |
|---|---|---|---|---|---|
| SEC-BL-001 | THR-001 | Implementar autenticacao | CRITICA | M15 | Request anonima recebe 401 |
| SEC-BL-002 | THR-001/003 | Autorizar por recurso | CRITICA | M15 | Usuario nao acessa OS alheia |
| SEC-BL-003 | THR-005 | Exigir HTTPS | CRITICA | Ambiente real | HTTP redirecionado ou bloqueado |
```

Use marcos da formação quando conhecidos.

Não invente datas.

---

### 22. Registrar riscos aceitos temporariamente

Exemplo:

```markdown
## Riscos aceitos temporariamente

### HTTP local

- Ameaca: THR-005
- Condicao: somente localhost, dados sinteticos e sem credenciais reais
- Validade: ate existir ambiente compartilhado
- Decisao: ACEITAR TEMPORARIAMENTE
```

Não aceite THR-001 para produção pública.

---

### 23. Definir gatilhos de revisão

Revise o threat model quando:

- novo endpoint;
- novo dado sensível;
- nova integração;
- nova porta;
- novo storage;
- novo método de autenticação;
- mudança de autorização;
- mudança de trust boundary;
- incidente;
- vulnerabilidade relevante;
- deploy para novo ambiente;
- mudança multi-instância.

---

### 24. Registrar a decisão

```markdown
## Decisao

O threat model inicial identifica riscos criticos de acesso nao
autenticado e nao autorizado. A aplicacao permanece adequada apenas
ao laboratorio local controlado.

Exposicao publica continua nao aprovada.
```

---

### 25. Revisar o modelo com perguntas adversariais

Pergunte:

- o que um cliente controla?
- o que o servidor confia?
- onde existe identidade?
- onde existe autorização?
- qual dado cruza fronteira?
- qual falha aumenta privilégio?
- qual entrada consome recurso?
- qual ação não pode ser atribuída?
- qual componente externo pode falhar?
- qual premissa pode deixar de ser verdadeira?

Atualize ameaças reais.

---

## Entendendo o que foi feito

### A baseline virou um modelo

Ativos e entradas foram conectados por fluxos.

### STRIDE organizou perguntas

A análise não dependeu apenas de memória.

### As ameaças ficaram específicas

Cada cenário possui ator, fluxo, ativo e impacto.

### Controles atuais foram valorizados

Validation, ETag, limites e rede interna reduziram riscos específicos.

### Limitações não foram escondidas

Ausência de identidade e autorização permanece crítica.

### A priorização ganhou justificativa

Probabilidade e impacto foram explicados.

### O backlog ficou rastreável

Ameaças agora possuem ações e critérios de aceite.

---

## Erros comuns importantes

### Criar um diagrama sem ameaças

O desenho é apenas uma etapa.

### Listar OWASP sem olhar o sistema

A aula 413 fará o mapeamento depois do modelo real.

### Tratar STRIDE como checklist mecânico

Nem toda categoria se aplica a todo elemento.

### Colocar solução antes do cenário

Primeiro descreva o risco.

### Usar score como verdade absoluta

A matriz é uma ferramenta de discussão.

### Aceitar risco sem condição

Aceite precisa de contexto, responsável e validade.

### Modelar somente atacante externo

Erro humano e serviços internos também causam dano.

### Ignorar trust boundaries internos

API para banco e host para volume também mudam confiança.

### Tentar corrigir tudo na mesma aula

Priorizar faz parte da segurança.

### Nunca revisar o documento

Threat model desatualizado cria falsa segurança.

---

## Comandos úteis

### Identificar commit

```powershell
git rev-parse HEAD
git status --short
```

### Ver estrutura de segurança

```powershell
Get-ChildItem `
  "docs/security"
```

### Validar Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

### Ver services e portas

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

### Procurar entradas públicas

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "@RequestMapping|@GetMapping|@PostMapping|@PutMapping|@PatchMapping|@DeleteMapping"
```

### Revisar diff

```powershell
git diff `
  -- `
  "docs/security/M15_THREAT_MODEL.md"
```

---

## Exercício guiado

### Parte 1 — Escopo

Defina o que o modelo cobre.

### Parte 2 — Elementos

Crie external entities, processes e data stores.

### Parte 3 — Fluxos

Numere e descreva dados e protocolos.

### Parte 4 — Fronteiras

Identifique mudanças de confiança.

### Parte 5 — STRIDE

Aplique perguntas por fluxo e fronteira.

### Parte 6 — Registro

Crie ao menos dez ameaças específicas.

### Parte 7 — Prioridade

Justifique probabilidade e impacto.

### Parte 8 — Tratamento

Defina mitigar, evitar, transferir ou aceitar.

### Parte 9 — Backlog

Crie ações com critérios de aceite.

### Parte 10 — Revisão

Defina gatilhos e decisão atual.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 411 foi preservada;
- threat modeling foi definido;
- threat model não foi confundido com lista de vulnerabilidades;
- escopo foi definido;
- fora do escopo foi definido;
- commit foi registrado;
- ambiente foi registrado;
- ativos foram reutilizados;
- external entities foram criadas;
- processes foram criados;
- data stores foram criados;
- data flows foram criados;
- trust boundaries foram criadas;
- elementos receberam IDs;
- fluxos receberam IDs;
- fronteiras receberam IDs;
- ameaças receberam IDs;
- diagrama textual foi criado;
- tabela de fluxos foi criada;
- tabela de fronteiras foi criada;
- STRIDE foi explicado;
- Spoofing foi aplicado;
- Tampering foi aplicado;
- Repudiation foi aplicado;
- Information Disclosure foi aplicado;
- Denial of Service foi aplicado;
- Elevation of Privilege foi aplicado;
- cenários possuem ator;
- cenários possuem entrada;
- cenários possuem fraqueza;
- cenários possuem ativo;
- cenários possuem impacto;
- controles preventivos foram diferenciados;
- controles detectivos foram diferenciados;
- controles responsivos foram diferenciados;
- probabilidade foi definida;
- impacto foi definido;
- score foi calculado;
- score não foi tratado como precisão científica;
- risco inerente foi explicado;
- risco residual foi explicado;
- mitigar foi explicado;
- evitar foi explicado;
- transferir foi explicado;
- aceitar foi explicado;
- THR-001 de acesso a OS foi criado;
- THR-002 de X-Client-Id foi criado;
- THR-003 de alteração não autorizada foi criado;
- THR-004 de repúdio foi criado;
- THR-005 de HTTP foi criado;
- THR-006 de DoS foi criado;
- THR-007 de upload foi criado;
- THR-008 de secrets foi criado;
- THR-009 de management foi criado;
- THR-010 de scheduler foi criado;
- UUID não foi tratado como autorização;
- ETag não foi tratado como autorização;
- correlation ID não foi tratado como identidade;
- rate limiting não foi tratado como autenticação;
- management loopback foi reconhecido como controle;
- usuário não root foi reconhecido como controle;
- matriz consolidada foi criada;
- notas foram justificadas;
- backlog de segurança foi criado;
- ações possuem critérios de aceite;
- marcos foram usados sem datas inventadas;
- riscos temporários foram registrados;
- HTTP local recebeu condição explícita;
- produção pública permaneceu não aprovada;
- gatilhos de revisão foram definidos;
- perguntas adversariais foram executadas;
- Spring Security não foi implementado;
- OWASP Top 10 não foi aprofundado;
- JWT não foi antecipado;
- pentest não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 413 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "docs(m15): criar threat model inicial da API"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- tokens;
- dados pessoais;
- logs locais;
- env files;
- detalhes de infraestrutura real;
- IPs corporativos;
- caminhos internos sensíveis;
- ameaças sem relação com o escopo.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a baseline de segurança ganhou estrutura.

Você modelou:

```text
atores;

processos;

data stores;

fluxos;

trust boundaries;

ameaças;

controles;

prioridades;

mitigações.
```

STRIDE ajudou a perguntar:

```text
alguém pode falsificar identidade?

alterar dados?

negar uma ação?

expor informação?

indisponibilizar o serviço?

obter privilégio indevido?
```

O modelo identificou riscos críticos relacionados a:

- acesso sem autenticação;
- ausência de autorização por objeto;
- falsificação de client ID;
- tráfego sem TLS;
- ausência de auditoria por identidade;
- abuso de recursos;
- upload;
- secrets;
- management;
- múltiplas instâncias.

A decisão central foi:

```text
ameaças úteis
não são frases genéricas;

elas conectam
ator, fluxo, fronteira,
fraqueza, ativo e impacto.
```

A aplicação continua:

```text
aceita para laboratório local
sob premissas restritas;

não aprovada
para exposição pública.
```

A próxima aula será:

```text
413 - M15.03 - OWASP Top 10 aplicado
```

Nela, você utilizará o threat model para compreender como categorias amplamente conhecidas de risco aparecem no projeto.

Serão avaliados:

- controle de acesso;
- configuração;
- falhas criptográficas;
- injeção;
- design inseguro;
- componentes vulneráveis;
- autenticação;
- integridade;
- logging;
- SSRF.

A implementação de Spring Security continuará reservada para as aulas posteriores.

---

# Material complementar

## Checkpoint final

- [ ] Modelei componentes, fluxos e fronteiras.
- [ ] Apliquei STRIDE ao sistema real.
- [ ] Registrei ameaças com evidência.
- [ ] Priorizei e criei backlog.
- [ ] Defini gatilhos de revisão.

---

## Troubleshooting adicional

### O diagrama ficou grande demais

Comece com um diagrama de contexto.

Detalhe somente a área crítica.

### Toda ameaça recebeu score 9

Reavalie probabilidade e impacto com contexto.

Prioridade indiscriminada impede decisão.

### Não sei se algo é ameaça ou vulnerabilidade

Descreva o cenário completo.

A vulnerabilidade é a fraqueza dentro dele.

### Uma ameaça possui duas categorias STRIDE

Isso é possível.

Escolha as categorias que realmente ajudam a entender o impacto.

### Não existe controle atual

Registre claramente:

```text
AUSENTE.
```

Não invente mitigação implementada.

### A mitigação pertence a outra aula

Crie backlog e indique o marco.

Não antecipe a implementação.

### O modelo expõe detalhes sensíveis

Remova:

- IPs reais;
- nomes internos;
- credentials;
- topologia corporativa;
- paths sensíveis.

O documento didático usa elementos genéricos.

---

## Perguntas de revisão

1. O que é threat modeling?
2. Ele prevê todos os ataques?
3. O que é external entity?
4. O que é process?
5. O que é data store?
6. O que é data flow?
7. O que é trust boundary?
8. O que significa S em STRIDE?
9. O que significa T?
10. O que significa R?
11. O que significa I?
12. O que significa D?
13. O que significa E?
14. O que um cenário deve conter?
15. O que é risco residual?
16. Quais tratamentos existem?
17. Score substitui análise?
18. Quando o modelo deve ser revisado?
19. A produção pública está aprovada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Análise estruturada de ameaças e riscos.
2. Não.
3. Elemento externo que interage.
4. Componente que transforma dados.
5. Local de armazenamento.
6. Informação em movimento.
7. Mudança de confiança ou controle.
8. Spoofing.
9. Tampering.
10. Repudiation.
11. Information Disclosure.
12. Denial of Service.
13. Elevation of Privilege.
14. Ator, ação, entrada, fraqueza, ativo e impacto.
15. Risco após controles.
16. Mitigar, evitar, transferir e aceitar.
17. Não.
18. Quando arquitetura, dados, fronteiras ou riscos mudarem.
19. Não.
20. OWASP Top 10 aplicado.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 412 - M15.02 - Threat modeling inicial

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Transformei a baseline em um threat model inicial.
- Diferenciei threat model de lista de vulnerabilidades.
- Defini escopo e fora do escopo.
- Registrei commit, ambiente e premissas.
- Reutilizei os ativos da baseline.
- Modelei external entities, processes e data stores.
- Numerei data flows.
- Identifiquei trust boundaries.
- Criei um diagrama textual do sistema.
- Criei tabelas de fluxos e fronteiras.
- Estudei STRIDE.
- Apliquei Spoofing.
- Apliquei Tampering.
- Apliquei Repudiation.
- Apliquei Information Disclosure.
- Apliquei Denial of Service.
- Apliquei Elevation of Privilege.
- Criei cenários ligados a atores, fluxos, ativos e impactos.
- Diferenciei controles preventivos, detectivos e responsivos.
- Criei uma escala inicial de probabilidade e impacto.
- Diferenciei risco inerente e residual.
- Estudei mitigar, evitar, transferir e aceitar.
- Registrei ameaça de acesso a OS de outro cliente.
- Registrei falsificação de X-Client-Id.
- Registrei alteração não autorizada com ETag válido.
- Registrei repúdio por ausência de identidade.
- Registrei risco de tráfego HTTP.
- Registrei abuso de recursos e upload.
- Registrei risco de secrets.
- Registrei risco de management exposto.
- Registrei scheduler em múltiplas instâncias.
- Criei uma matriz consolidada de ameaças.
- Criei backlog de segurança com critérios de aceite.
- Registrei riscos aceitos temporariamente.
- Defini gatilhos de revisão do modelo.
- Mantive produção pública não aprovada.
- Não antecipei Spring Security ou OWASP Top 10 completo.
- Próxima aula: OWASP Top 10 aplicado.
```

---

## Referência técnica curta

- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)
- [Microsoft Threat Modeling — STRIDE](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-threats)
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [NIST SP 800-30 — Risk Assessment](https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

Regra final:

```text
um threat model inicial precisa representar o sistema por atores, processos, data stores, fluxos e fronteiras de confiança, aplicar perguntas estruturadas como STRIDE e registrar cenários ligados a ativos e impactos; nesta baseline, as ameaças são priorizadas de forma simples, controles atuais e gaps são distinguidos, o backlog recebe critérios de aceite e a aplicação permanece restrita ao laboratório enquanto riscos críticos de identidade e autorização não forem mitigados.
```
