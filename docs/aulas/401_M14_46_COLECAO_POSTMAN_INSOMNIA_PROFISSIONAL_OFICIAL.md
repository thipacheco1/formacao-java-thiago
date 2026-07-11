# 401 - M14.46 - Coleção Postman/Insomnia profissional

## Apresentação da aula

Na aula 400, você declarou a aplicação multicontainer com Docker Compose.

O ambiente local passou a subir com:

```text
api;

postgres;

redis;

rede interna;

healthchecks;

volumes;

configuração externalizada.
```

O acesso ficou previsível:

```text
API:
http://localhost:8081.

Management:
http://127.0.0.1:8082.
```

Aquela aula respondeu:

```text
como executar a API
e suas dependências principais
como uma stack reproduzível?
```

Agora existe um ambiente estável para consumir a aplicação.

Até aqui, os testes manuais foram realizados principalmente com:

```text
Invoke-WebRequest;

Invoke-RestMethod;

curl.exe;

comandos isolados.
```

Esses comandos são úteis para diagnóstico.

Porém, quando a API cresce, copiar requests soltas cria problemas:

- URLs duplicadas;
- IDs copiados manualmente;
- headers esquecidos;
- payloads divergentes;
- cenários sem ordem;
- exemplos não versionados;
- erros sem validação;
- dificuldade para outro desenvolvedor reproduzir;
- dependência da memória de quem criou a request.

A pergunta central desta aula será:

```text
como organizar o consumo manual da API
em uma coleção versionada,
reproduzível e reutilizável
no Postman ou no Insomnia?
```

A solução utilizará:

```text
Postman Collection v2.1;

ambiente local;

variáveis;

folders;

scripts de pré-request;

scripts de pós-response;

encadeamento de IDs;

assertions;

examples;

Collection Runner;

export;

importação no Insomnia.
```

A baseline prática será criada no Postman porque:

```text
o formato Postman Collection v2.1
é amplamente suportado;

o Insomnia consegue importar
collections e environments Postman.
```

Isso não significa que a equipe precisa usar Postman obrigatoriamente.

A estratégia será:

```text
uma fonte versionada principal;

importação no cliente escolhido;

sem manter duas coleções divergentes.
```

Os arquivos oficiais do projeto serão:

```text
api-clients/postman/
├── formacao-java-backend-api-v2.postman_collection.json
└── formacao-java-backend-local.postman_environment.example.json
```

Um environment local de uso pessoal poderá existir:

```text
formacao-java-backend-local.postman_environment.json
```

Ele ficará fora do Git.

O example conterá:

```text
baseUrl;

managementBaseUrl;

clientId;

managedMessageId vazio;

fileId vazio;

notificationId vazio;

missingManagedMessageId;

missingFileId.
```

Nenhuma senha será necessária para a coleção atual.

Mesmo assim, a regra profissional será mantida:

```text
segredos e valores pessoais
não entram no arquivo versionado.
```

A coleção será organizada em folders:

```text
00 - Operação;

10 - Managed Messages v2;

20 - Arquivos v2;

30 - Notificações v2;

90 - Cenários de erro;

99 - Diagnóstico manual.
```

O fluxo principal será:

```text
health;

create managed message;

capturar ID;

get by ID;

list;

delete;

confirmar 404.
```

O ID criado não será copiado manualmente.

O script do request de criação irá extrair o ID do header:

```text
Location.
```

Depois armazenará em:

```text
managedMessageId.
```

Requests seguintes utilizarão:

```text
{{managedMessageId}}.
```

O upload também armazenará:

```text
fileId.
```

A notificação armazenará:

```text
notificationId.
```

A coleção não será apenas um conjunto de requests.

Ela terá verificações como:

- status esperado;
- content type;
- presence de correlation ID;
- campos obrigatórios;
- valor de `message`;
- ID salvo;
- formato básico de Problem Details;
- ausência de stack trace pública.

A aula utilizará somente a API v2 para operações atuais.

A v1 está depreciada.

Ela não será duplicada na coleção principal.

Pode existir um folder separado de compatibilidade histórica quando houver necessidade de manutenção, mas isso não faz parte do fluxo oficial desta aula.

A coleção também incluirá examples salvos.

Um example combina:

```text
request;

response relacionada.
```

Exemplos iniciais:

```text
201 de criação;

200 de consulta;

400 de validação;

404 de recurso inexistente;

429 de rate limiting;

503 de notificação indisponível.
```

Os examples ajudam leitura e revisão.

Eles não substituem scripts executáveis.

A execução automática local será feita pelo:

```text
Collection Runner.
```

O runner executa requests selecionadas na ordem configurada e registra os resultados dos scripts.

No Insomnia, o Collection Runner oferece o mesmo objetivo de executar múltiplas requests organizadas.

Os runtimes de script não são idênticos.

Portanto:

```text
requests e environments podem ser importados;

scripts precisam ser validados
no cliente adotado.
```

A aula não criará:

- pipeline CI;
- Postman API key;
- monitor em nuvem;
- workspace público;
- documentação publicada;
- mock server;
- dataset em nuvem;
- autenticação OAuth;
- testes de carga;
- Newman no build;
- Inso CLI no build.

Esses recursos podem ser úteis, mas não pertencem ao objetivo atual.

A próxima aula será:

```text
402 - M14.47 - Documentação técnica da API
```

Por isso, a coleção terá descrições suficientes para uso, mas não substituirá a documentação técnica completa.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
397:
Observabilidade inicial com Actuator.

398:
Health readiness/liveness.

399:
Dockerizando API Spring.

400:
Compose API PostgreSQL Redis.

401:
Coleção Postman/Insomnia profissional.

402:
Documentação técnica da API.

403:
Erros comuns em API REST.
```

A aula 400 respondeu:

```text
como subir o ambiente completo
com comandos previsíveis?
```

A aula 401 responderá:

```text
como consumir e validar
a API de forma organizada,
versionada e reutilizável?
```

Nesta aula:

```text
Postman Collection v2.1:
sim.

Postman environment:
sim.

Insomnia import:
sim.

folders:
sim.

variables:
sim.

scripts:
sim.

ID chaining:
sim.

assertions:
sim.

examples:
sim.

runner:
sim.

OpenAPI como referência:
sim.

documentação técnica completa:
não.

CI:
não.

cloud monitor:
não.

mock server:
não.

testes de carga:
não.
```

A regra central será:

```text
coleção profissional
é código de consumo da API;

precisa ser versionada,
reproduzível,
sem segredo
e alinhada ao contrato.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
api-clients/postman/
├── formacao-java-backend-api-v2.postman_collection.json
└── formacao-java-backend-local.postman_environment.example.json
```

E um environment local importado no cliente:

```text
Formação Java Backend - Local.
```

A coleção terá:

```text
folders numerados;

nomes consistentes;

descrições curtas;

URLs por variável;

header X-Client-Id automático;

correlation ID por request;

scripts de validação;

IDs encadeados;

examples salvos;

cenários de erro separados.
```

Você irá:

1. criar a estrutura de arquivos;
2. definir a política de variáveis;
3. criar o environment example;
4. criar a coleção;
5. configurar scripts no nível da coleção;
6. criar o folder de operação;
7. criar o fluxo de managed messages;
8. encadear `managedMessageId`;
9. criar requests de arquivo;
10. encadear `fileId`;
11. criar request de notificação;
12. criar cenários negativos;
13. salvar examples;
14. executar o runner;
15. exportar em Postman v2.1;
16. importar no Insomnia;
17. validar diferenças de script;
18. commitar.

O fluxo mínimo do runner será:

```text
00 - Operação / Liveness;

00 - Operação / Readiness;

10 - Managed Messages v2 / Create;

10 - Managed Messages v2 / Get by ID;

10 - Managed Messages v2 / List;

10 - Managed Messages v2 / Delete;

90 - Cenários de erro /
Get deleted managed message.
```

O upload ficará fora do fluxo automático padrão porque a seleção de arquivo local não é portável no export da coleção.

---

## Conceito essencial

### O que é uma collection

Uma collection agrupa requests relacionadas.

Ela pode conter:

- folders;
- requests;
- variables;
- authorization;
- scripts;
- examples;
- descriptions;
- ordem de execução.

Uma collection profissional não é uma pasta chamada:

```text
Testes.
```

com requests chamadas:

```text
request 1;

teste;

novo teste;

cópia de teste.
```

Ela precisa comunicar propósito e ordem.

---

### Postman Collection v2.1

O formato exportado é JSON.

Ele inclui:

- metadata da collection;
- folders;
- requests;
- scripts;
- variables;
- examples.

A baseline utilizará:

```text
Collection v2.1.
```

O Insomnia suporta importação desse formato.

Não edite manualmente centenas de linhas do JSON quando o cliente pode exportar corretamente.

A revisão Git continua importante.

---

### Environment

Environment é um conjunto de variáveis para um contexto.

Exemplos:

```text
local;

homologação;

produção.
```

Nesta aula, somente local será criado.

Variáveis:

```text
baseUrl:
http://localhost:8081.

managementBaseUrl:
http://127.0.0.1:8082.

clientId:
postman-local.
```

A collection usa:

```text
{{baseUrl}};

{{managementBaseUrl}};

{{clientId}}.
```

Trocar o environment muda o contexto sem editar cada request.

---

### Folder de operação

Inclui:

```text
Liveness;

Readiness;

Global Health;

Info;

Metrics catalog.
```

Essas requests usam:

```text
managementBaseUrl
```

ou:

```text
baseUrl
```

conforme o path.

Não adicione `X-Client-Id` aos endpoints operacionais.

---

### Folder de negócio

Inclui requests da API v2.

Todas precisam do header:

```text
X-Client-Id.
```

A coleção pode adicioná-lo automaticamente em pre-request script quando a URL começa com `baseUrl`.

Isso evita duplicação.

---

### Pre-request script

O script roda antes da request.

Uso na baseline:

- validar environment;
- adicionar client ID;
- gerar correlation ID.

Exemplo:

```javascript
const baseUrl =
    pm.environment.get("baseUrl");

const clientId =
    pm.environment.get("clientId");

if (!baseUrl) {
    throw new Error(
        "Environment variable baseUrl is required"
    );
}

if (!clientId) {
    throw new Error(
        "Environment variable clientId is required"
    );
}

const requestUrl =
    pm.request.url.toString();

if (requestUrl.startsWith(baseUrl)) {
    pm.request.headers.upsert({
        key: "X-Client-Id",
        value: clientId
    });
}

pm.request.headers.upsert({
    key: "X-Correlation-Id",
    value: pm.variables.replaceIn(
        "{{$guid}}"
    )
});
```

O correlation ID é gerado por request.

Ele não é salvo como variável compartilhada.

---

### Post-response script

O script roda depois da response.

Uso:

- assertions;
- extrair valores;
- limpar variáveis;
- escolher próximo request em workflow avançado.

Exemplo de create:

```javascript
pm.test(
    "Status is 201",
    function () {
        pm.response.to.have.status(201);
    }
);

const location =
    pm.response.headers.get("Location");

pm.test(
    "Location header exists",
    function () {
        pm.expect(location).to.be.ok;
    }
);

if (location) {
    const segments =
        location.split("/");

    const id =
        segments[segments.length - 1];

    pm.environment.set(
        "managedMessageId",
        id
    );
}
```

O script não assume body de criação quando o contrato usa `Location`.

---

### Assertions

Assertion boa verifica comportamento público.

Exemplos:

```text
status exato;

content type;

header Location;

correlation ID;

campo message;

campo status;

Problem Details code.
```

Evite:

```text
response time menor que 100 ms
em toda máquina;
```

Um limite rígido local pode ser instável.

Performance precisa de estratégia própria.

---

### Correlation ID

A API já aceita ou gera:

```text
X-Correlation-Id.
```

A collection enviará um valor por request.

Depois validará:

```text
response contém X-Correlation-Id.
```

Isso facilita relacionar:

- request;
- response;
- logs.

O script não deve registrar body sensível no console.

---

### Encadeamento

Encadeamento significa utilizar dados de uma response em requests seguintes.

Fluxo:

```text
Create;
Location;
managedMessageId;
Get;
Delete;
Get deleted.
```

A collection deixa de depender de cópia manual.

O runner consegue repetir o fluxo em uma base limpa.

---

### Limpeza de variável

Depois do delete, não apague imediatamente `managedMessageId`.

O cenário seguinte precisa confirmar `404`.

Depois da confirmação:

```javascript
pm.environment.unset(
    "managedMessageId"
);
```

Isso encerra o fluxo.

---

### Examples

Um example é um par:

```text
request;

response.
```

Ele pode mostrar:

- status;
- headers;
- body;
- cenário.

Names:

```text
201 - Created;

400 - Invalid request;

404 - Not found;

429 - Too many requests;

503 - Email unavailable.
```

Não use:

```text
Example 1;

Response 2.
```

Examples devem ser sanitizados.

Não salve:

- credentials;
- dados pessoais;
- IDs reais de produção;
- headers internos desnecessários.

---

### Upload e portabilidade

Uma request multipart pode apontar para um arquivo local.

O export da collection não inclui os bytes do arquivo.

Outro desenvolvedor precisa selecionar um arquivo existente na própria máquina.

Por isso:

```text
upload:
request disponível;

runner principal:
não depende dela.
```

A collection descreve:

```text
part name:
file.

tipo:
File.
```

Um pequeno arquivo em:

```text
samples/aula-390.txt
```

pode ser usado localmente, mas não deve ser presumido por todos os clientes.

---

### Insomnia

O Insomnia organiza requests em collections e utiliza environments.

Ele consegue importar Postman v2.0 e v2.1.

Fluxo:

```text
Import;

File;

selecionar collection;

selecionar environment;

Scan;

Import.
```

Depois:

```text
ativar environment local;

validar variables;

validar scripts;

executar collection runner.
```

Scripts Postman usam o objeto:

```text
pm.
```

Insomnia possui seu próprio runtime de scripts.

Não prometa portabilidade automática de toda lógica.

A estrutura de requests e variables é o ponto comum principal.

---

## Mão na massa guiada

### 1. Confirmar a stack

Na raiz da API:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --detach
```

Confirme:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

API, PostgreSQL e Redis precisam estar saudáveis.

---

### 2. Criar diretório versionado

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "api-clients/postman" |
  Out-Null
```

Adicione ao `.gitignore`:

```text
api-clients/postman/*.postman_environment.json
!api-clients/postman/*.example.json
```

A collection permanece versionada.

O environment real fica ignorado.

---

### 3. Criar o environment no Postman

Crie:

```text
Formação Java Backend - Local.
```

Variables:

```text
baseUrl:
http://localhost:8081.

managementBaseUrl:
http://127.0.0.1:8082.

clientId:
postman-local.

managedMessageId:
vazio.

fileId:
vazio.

notificationId:
vazio.

missingManagedMessageId:
999999999.

missingFileId:
00000000-0000-0000-0000-000000000000.
```

Não crie global variables.

Ative o environment.

---

### 4. Criar a collection

Nome:

```text
Formação Java Backend API v2.
```

Descrição curta:

```text
Coleção operacional e funcional da API v2 da Formação Java Backend.
Utiliza variáveis de ambiente, correlation ID, encadeamento e assertions.
```

A descrição completa da arquitetura ficará para a aula 402.

---

### 5. Criar folders

Na ordem:

```text
00 - Operação;

10 - Managed Messages v2;

20 - Arquivos v2;

30 - Notificações v2;

90 - Cenários de erro;

99 - Diagnóstico manual.
```

Folder `99` não participa do runner padrão.

---

### 6. Adicionar o pre-request script da collection

Em scripts da collection, adicione o script apresentado anteriormente.

Ajuste para não exigir `managementBaseUrl` em requests de negócio.

Adicione uma validação específica no folder de operação:

```javascript
if (
    !pm.environment.get(
        "managementBaseUrl"
    )
) {
    throw new Error(
        "managementBaseUrl is required"
    );
}
```

---

### 7. Criar Liveness

Request:

```text
GET {{baseUrl}}/livez.
```

Tests:

```javascript
pm.test(
    "Liveness is 200",
    function () {
        pm.response.to.have.status(200);
    }
);

pm.test(
    "Liveness status is UP",
    function () {
        const body =
            pm.response.json();

        pm.expect(
            body.status
        ).to.eql(
            "UP"
        );
    }
);
```

---

### 8. Criar Readiness

Request:

```text
GET {{baseUrl}}/readyz.
```

Tests:

```text
200;

body status UP.
```

Não force estados do laboratório no runner padrão.

---

### 9. Criar Global Health

Request:

```text
GET {{managementBaseUrl}}/actuator/health.
```

Valide:

```text
200;

status UP;

sem components.
```

Script:

```javascript
pm.test(
    "Health does not expose components",
    function () {
        const body =
            pm.response.json();

        pm.expect(
            body
        ).not.to.have.property(
            "components"
        );
    }
);
```

---

### 10. Criar Info

Request:

```text
GET {{managementBaseUrl}}/actuator/info.
```

Valide:

```text
app.name;

app.version;

app.module.
```

Não fixe uma versão exata no teste.

Ela pode mudar por ambiente.

Valide apenas que não está vazia.

---

### 11. Criar Metrics Catalog

Request:

```text
GET {{managementBaseUrl}}/actuator/metrics.
```

Valide:

```text
names é array;

process.uptime existe.
```

Não exija todas as métricas de plataforma.

---

### 12. Criar Create Managed Message

Request:

```text
POST {{baseUrl}}/api/v2/runtime/managed-messages.
```

Body JSON:

```json
{
  "message": "Coleção profissional",
  "description": "Criado pelo fluxo Postman/Insomnia"
}
```

Headers manuais:

```text
Content-Type:
application/json.
```

`X-Client-Id` e `X-Correlation-Id` entram pelo pre-request script.

Tests:

```javascript
pm.test(
    "Create returns 201",
    function () {
        pm.response.to.have.status(201);
    }
);

pm.test(
    "Response has correlation id",
    function () {
        pm.expect(
            pm.response.headers.get(
                "X-Correlation-Id"
            )
        ).to.be.ok;
    }
);

const location =
    pm.response.headers.get(
        "Location"
    );

pm.test(
    "Location is returned",
    function () {
        pm.expect(
            location
        ).to.be.ok;
    }
);

if (location) {
    const id =
        location
            .split("/")
            .filter(Boolean)
            .pop();

    pm.environment.set(
        "managedMessageId",
        id
    );
}
```

---

### 13. Criar Get Managed Message

Request:

```text
GET {{baseUrl}}/api/v2/runtime/managed-messages/{{managedMessageId}}.
```

Tests:

```javascript
pm.test(
    "Get returns 200",
    function () {
        pm.response.to.have.status(200);
    }
);

pm.test(
    "Response uses v2 field message",
    function () {
        const body =
            pm.response.json();

        pm.expect(
            body.message
        ).to.eql(
            "Coleção profissional"
        );

        pm.expect(
            body
        ).not.to.have.property(
            "value"
        );
    }
);
```

Essa assertion protege a diferença entre v1 e v2.

---

### 14. Criar List Managed Messages

Request:

```text
GET {{baseUrl}}/api/v2/runtime/managed-messages.
```

Utilize os parâmetros de paginação já definidos no contrato atual da API.

Tests:

```text
200;

content existe;

metadata de paginação existe;
```

Use os nomes exatos do response atual.

Não invente uma estrutura diferente da OpenAPI.

---

### 15. Criar Delete Managed Message

Request:

```text
DELETE {{baseUrl}}/api/v2/runtime/managed-messages/{{managedMessageId}}.
```

Valide o status definido pelo contrato atual.

Na baseline do projeto, utilize:

```text
204 No Content.
```

Script:

```javascript
pm.test(
    "Delete returns 204",
    function () {
        pm.response.to.have.status(204);
    }
);

pm.test(
    "Delete has no body",
    function () {
        pm.expect(
            pm.response.text()
        ).to.eql(
            ""
        );
    }
);
```

Não remova a variável ainda.

---

### 16. Criar Get Deleted Managed Message

No folder de erro:

```text
GET {{baseUrl}}/api/v2/runtime/managed-messages/{{managedMessageId}}.
```

Tests:

```javascript
pm.test(
    "Deleted resource returns 404",
    function () {
        pm.response.to.have.status(404);
    }
);

pm.test(
    "Error is Problem Details",
    function () {
        const contentType =
            pm.response.headers.get(
                "Content-Type"
            );

        pm.expect(
            contentType
        ).to.include(
            "application/problem+json"
        );
    }
);

pm.environment.unset(
    "managedMessageId"
);
```

---

### 17. Criar Upload File

Request:

```text
POST {{baseUrl}}/api/v2/runtime/files.
```

Body:

```text
form-data;

key:
file;

type:
File.
```

Selecione um arquivo TXT local.

Tests:

```javascript
pm.test(
    "Upload returns 201",
    function () {
        pm.response.to.have.status(201);
    }
);

const body =
    pm.response.json();

pm.test(
    "Upload returns file id",
    function () {
        pm.expect(
            body.id
        ).to.be.ok;
    }
);

if (body.id) {
    pm.environment.set(
        "fileId",
        body.id
    );
}
```

Não inclua o arquivo no export da collection por acidente.

---

### 18. Criar Download File

Request:

```text
GET {{baseUrl}}/api/v2/runtime/files/{{fileId}}.
```

Valide:

```text
200;

Content-Disposition existe;

Content-Length existe;

X-Content-Type-Options é nosniff.
```

Não tente interpretar o body binário como JSON.

---

### 19. Criar Send Email Notification

Request:

```text
POST {{baseUrl}}/api/v2/runtime/notifications/email.
```

Body:

```json
{
  "subject": "Coleção profissional",
  "message": "Notificação enviada pela coleção."
}
```

Essa request exige:

```text
profile mail-lab;

Mailpit disponível;

EMAIL_NOTIFICATION_ENABLED=true.
```

Na stack da aula 400, e-mail está desabilitado.

Por isso, a request fica fora do runner principal.

No sucesso:

```text
202;

status SUBMITTED;

notificationId salvo.
```

---

### 20. Criar Invalid Managed Message

Folder de erro.

Request:

```text
POST {{baseUrl}}/api/v2/runtime/managed-messages.
```

Body:

```json
{
  "message": "",
  "description": "Mensagem inválida"
}
```

Valide:

```text
400;

application/problem+json;

status 400;

correlation ID presente.
```

Não valide texto completo de mensagem de framework.

---

### 21. Criar Missing Managed Message

Request:

```text
GET {{baseUrl}}/api/v2/runtime/managed-messages/{{missingManagedMessageId}}.
```

Valide:

```text
404;

Problem Details;

sem stack trace.
```

Script:

```javascript
pm.test(
    "Public error does not expose Java stack",
    function () {
        pm.expect(
            pm.response.text()
        ).not.to.include(
            "java.lang."
        );
    }
);
```

---

### 22. Criar Missing File

Request:

```text
GET {{baseUrl}}/api/v2/runtime/files/{{missingFileId}}.
```

Valide:

```text
404;

Problem Details.
```

---

### 23. Criar diagnóstico de rate limiting

Folder `99`.

Crie uma request GET para a coleção de managed messages.

Execute manualmente mais vezes que o limite configurado para o mesmo `clientId`.

Valide a última response:

```text
429;

Retry-After;

Problem Details;

correlation ID.
```

Não inclua esse cenário no runner padrão.

Ele pode afetar requests seguintes durante a janela.

---

### 24. Salvar examples

Para cada request principal:

1. execute;
2. selecione salvar response como example;
3. dê nome semântico;
4. remova dados temporários;
5. preserve headers relevantes;
6. não salve secrets.

Examples mínimos:

```text
Create:
201 - Created.

Get:
200 - Found.

Invalid create:
400 - Validation error.

Missing:
404 - Not found.

Rate limit:
429 - Too many requests.

Notification:
503 - Email unavailable.
```

---

### 25. Criar descrições curtas

Cada request deve informar:

```text
objetivo;

variáveis utilizadas;

pré-condição;

efeito;

status esperado.
```

Exemplo do Create:

```text
Cria uma managed message v2.
Salva o ID extraído do header Location em managedMessageId.
```

Não escreva a documentação técnica completa aqui.

---

### 26. Executar o runner principal

Selecione na ordem:

```text
Liveness;

Readiness;

Global Health;

Info;

Create;

Get;

List;

Delete;

Get Deleted.
```

Execute uma iteração.

Resultado esperado:

```text
todas as assertions verdes;

managedMessageId removido ao final.
```

Não selecione:

- upload;
- notificação;
- rate limit.

Eles possuem pré-condições próprias.

---

### 27. Repetir o runner

Execute três vezes.

O fluxo precisa criar e limpar seus próprios dados.

Não pode depender de um ID deixado por execução anterior.

Se falhar por rate limit, use um `clientId` específico para o runner ou aguarde a janela configurada.

---

### 28. Exportar a collection

Exporte como:

```text
Collection v2.1.
```

Arquivo:

```text
api-clients/postman/formacao-java-backend-api-v2.postman_collection.json.
```

Não renomeie manualmente para uma extensão diferente.

---

### 29. Exportar o environment example

Antes de exportar:

```text
managedMessageId:
vazio.

fileId:
vazio.

notificationId:
vazio.
```

Confirme que não existem:

- tokens;
- senhas;
- IDs reais sensíveis;
- URLs privadas.

Exporte para:

```text
api-clients/postman/formacao-java-backend-local.postman_environment.example.json.
```

O arquivo real de uso pessoal permanece ignorado.

---

### 30. Validar JSON

PowerShell:

```powershell
Get-Content `
  "api-clients/postman/formacao-java-backend-api-v2.postman_collection.json" `
  -Raw |
  ConvertFrom-Json |
  Out-Null
```

Environment:

```powershell
Get-Content `
  "api-clients/postman/formacao-java-backend-local.postman_environment.example.json" `
  -Raw |
  ConvertFrom-Json |
  Out-Null
```

Os dois comandos precisam concluir sem erro.

---

### 31. Revisar o diff

```powershell
git diff `
  -- `
  "api-clients/postman"
```

Procure:

- secrets;
- valores locais;
- IDs transitórios;
- duplicação;
- requests sem nome;
- URLs hardcoded;
- scripts com console de body.

---

### 32. Importar no Insomnia

No Insomnia:

```text
Import;

File;

selecionar collection;

selecionar environment;

Scan;

Import.
```

Ative o environment.

Confirme:

```text
folders;

requests;

URLs;

headers;

bodies;

variables.
```

---

### 33. Validar scripts no Insomnia

Execute o Create.

Confirme se o script importado:

```text
salva managedMessageId.
```

Se o runtime não executar o script Postman:

1. abra o after-response script;
2. use a API de scripts do Insomnia;
3. leia o header `Location`;
4. salve no environment;
5. execute Get by ID.

Não mantenha duas lógicas sem documentar qual cliente é a fonte oficial.

---

### 34. Executar Collection Runner no Insomnia

Selecione o fluxo principal.

Ordene as requests.

Execute.

Confirme:

```text
status;

assertions compatíveis;

encadeamento.
```

Quando um script precisar de adaptação, registre a diferença na própria collection do cliente adotado.

---

### 35. Revisar portabilidade

A collection principal precisa evitar:

- path absoluto Windows;
- hostname de uma máquina;
- credentials;
- IDs fixos de dados reais;
- scripts dependentes de plugin local;
- globals.

O único ponto manual aceitável nesta baseline é:

```text
arquivo selecionado no upload.
```

---

## Entendendo o que foi feito

### Requests deixaram de ser fragmentos

A coleção possui nomes, folders, ordem e intenção.

### URLs ficaram externalizadas

O environment controla host e portas.

### Headers transversais foram centralizados

Client ID e correlation ID não precisam ser copiados.

### IDs passaram a ser encadeados

Create alimenta Get e Delete.

### Erros entraram na coleção

400, 404, 429 e 503 não ficaram fora do fluxo de revisão.

### Examples registraram contratos visuais

Request e response ficaram disponíveis para consulta.

### O runner tornou o fluxo repetível

Uma execução recria e limpa seus próprios dados.

### Postman e Insomnia ganharam uma fonte comum

A collection v2.1 pode ser importada, com revisão dos scripts.

---

## Erros comuns importantes

### Hardcode de localhost em todas as requests

Trocar ambiente exige editar dezenas de URLs.

### Usar uma variável chamada id

Ela pode representar mensagem, arquivo ou notificação.

### Salvar senha no export

O arquivo versionado passa a vazar credentials.

### Criar globals

Outra collection pode alterar o valor.

### Duplicar Postman e Insomnia manualmente

As fontes divergem.

### Não limpar IDs

O runner pode utilizar dados antigos sem perceber.

### Executar rate limit no fluxo principal

A janela pode quebrar cenários posteriores.

### Presumir que arquivo multipart é exportado

A collection salva a referência, não os bytes.

### Validar texto completo de exception

Mensagens internas podem mudar sem quebra de contrato.

### Tratar examples como testes

Examples não executam assertions.

---

## Comandos úteis

### Subir stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --detach
```

### Validar collection JSON

```powershell
Get-Content `
  "api-clients/postman/formacao-java-backend-api-v2.postman_collection.json" `
  -Raw |
  ConvertFrom-Json |
  Out-Null
```

### Localizar URLs hardcoded

```powershell
Select-String `
  -Path "api-clients/postman/*.json" `
  -Pattern "http://localhost"
```

A collection deve utilizar variáveis.

O environment example pode conter localhost.

### Procurar possíveis secrets

```powershell
Select-String `
  -Path "api-clients/postman/*.json" `
  -Pattern `
    "password|secret|token|authorization" `
  -CaseSensitive:$false
```

Revise qualquer resultado.

### Ver diff

```powershell
git diff `
  -- `
  "api-clients/postman"
```

---

## Exercício guiado

### Parte 1 — Environment

Crie as oito variáveis da baseline.

### Parte 2 — Operação

Adicione health, info e metrics.

### Parte 3 — Fluxo principal

Crie:

```text
Create;

Get;

List;

Delete;

Get Deleted.
```

Encadeie o ID.

### Parte 4 — Arquivos

Crie upload e download.

Encadeie `fileId`.

### Parte 5 — Erros

Crie 400, 404 e 429.

Valide Problem Details.

### Parte 6 — Examples

Salve seis examples sem dados sensíveis.

### Parte 7 — Runner

Execute três vezes.

Confirme independência.

### Parte 8 — Insomnia

Importe e valide o fluxo principal.

### Parte 9 — Registrar decisão

Anote:

```text
fonte versionada:
Postman Collection v2.1;

Insomnia:
importa a fonte;

environment local;

sem globals;

URLs por variáveis;

folders numerados;

header X-Client-Id automático;

X-Correlation-Id por request;

managedMessageId encadeado;

fileId encadeado;

notificationId encadeado;

examples sanitizados;

runner principal sem upload,
notificação e rate limit;

sem secrets;

sem CI;

sem documentação técnica completa.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 400 foi preservada;
- collection foi definida;
- collection foi diferenciada de OpenAPI;
- collection foi tratada como código de consumo;
- Postman Collection v2.1 foi adotada;
- importação no Insomnia foi prevista;
- uma única fonte versionada foi definida;
- diretório `api-clients/postman` foi criado;
- collection JSON foi exportada;
- environment example foi exportado;
- environment real foi ignorado;
- secrets não foram versionados;
- URLs não foram hardcoded na collection;
- `baseUrl` foi criada;
- `managementBaseUrl` foi criada;
- `clientId` foi criada;
- `managedMessageId` foi criada;
- `fileId` foi criada;
- `notificationId` foi criada;
- ID inexistente de mensagem foi criado;
- ID inexistente de arquivo foi criado;
- globals não foram usados;
- collection variables e environment foram diferenciados;
- folders numerados foram criados;
- folder de operação foi criado;
- folder managed messages foi criado;
- folder de arquivos foi criado;
- folder de notificações foi criado;
- folder de erros foi criado;
- folder de diagnóstico foi criado;
- pre-request script foi criado;
- baseUrl foi validada;
- clientId foi validado;
- `X-Client-Id` foi adicionado;
- `X-Correlation-Id` foi gerado;
- liveness foi adicionada;
- readiness foi adicionada;
- health global foi adicionado;
- info foi adicionado;
- metrics foi adicionado;
- create v2 foi adicionado;
- body v2 usa `message`;
- `value` não foi usado na v2;
- status 201 foi validado;
- Location foi validado;
- ID foi extraído de Location;
- Get by ID foi criado;
- response v2 usa `message`;
- listagem foi criada;
- delete foi criado;
- 204 foi validado;
- Get deleted foi criado;
- 404 foi validado;
- variável foi limpa ao final;
- upload foi criado;
- `fileId` foi armazenado;
- download foi criado;
- headers de download foram validados;
- notificação foi criada;
- pré-condição de Mailpit foi documentada;
- notificação ficou fora do runner principal;
- invalid request foi criado;
- missing message foi criado;
- missing file foi criado;
- Problem Details foi validado;
- correlation ID foi validado em erros;
- stack trace pública foi rejeitada;
- rate limit foi criado como diagnóstico manual;
- rate limit ficou fora do runner principal;
- `Retry-After` foi validado;
- examples foram criados;
- examples foram nomeados semanticamente;
- examples foram sanitizados;
- descriptions curtas foram criadas;
- runner principal foi ordenado;
- runner foi executado três vezes;
- fluxo não depende de ID anterior;
- upload ficou fora por dependência de arquivo local;
- JSON da collection foi validado;
- JSON do environment foi validado;
- diff foi revisado;
- importação no Insomnia foi realizada;
- folders e variables foram conferidos;
- scripts foram validados no Insomnia;
- diferença de runtime de script foi registrada;
- Collection Runner do Insomnia foi executado;
- path absoluto não foi versionado;
- Postman CLI não foi antecipada;
- Newman em CI não foi antecipado;
- monitor cloud não foi antecipado;
- mock server não foi antecipado;
- testes de carga não foram antecipados;
- documentação técnica completa não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 402 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Confirme que não aparece:

```text
environment local pessoal.
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "test(m14): versionar colecao profissional da API"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- environment local;
- tokens;
- senhas;
- IDs de produção;
- arquivos selecionados para upload;
- exports duplicados;
- reports;
- logs;
- dados temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o consumo manual da API passou a ser tratado como artefato do projeto.

O fluxo ficou:

```text
Compose;

API disponível;

collection versionada;

environment;

folders;

scripts;

encadeamento;

assertions;

examples;

runner;

importação no Insomnia.
```

Você comprovou:

```text
URLs externalizadas;

headers transversais;

correlation ID;

create e captura de ID;

get;

list;

delete;

404;

upload;

download;

erros;

execução repetível.
```

A decisão central foi:

```text
coleção profissional
não é um histórico de requests;

ela representa fluxos reais,
utiliza variáveis,
executa verificações
e pode ser reproduzida
por outra pessoa.
```

A próxima aula será:

```text
402 - M14.47 - Documentação técnica da API
```

Nela, você consolidará uma documentação voltada para desenvolvedores e operação.

Ela incluirá:

- visão geral;
- requisitos;
- startup;
- configuração;
- arquitetura;
- endpoints;
- exemplos;
- erros;
- observabilidade;
- execução com Compose;
- coleção;
- troubleshooting;
- decisões e limites.

A collection criada nesta aula será uma referência executável ligada à documentação.

A documentação completa não foi antecipada aqui.

---

# Material complementar

## Checkpoint final

- [ ] Criei uma collection v2.1 versionada.
- [ ] Criei environment local sem secrets no Git.
- [ ] Encadeei IDs entre requests.
- [ ] Adicionei assertions e examples.
- [ ] Executei no Postman e importei no Insomnia.

---

## Troubleshooting adicional

### Variable baseUrl is required

Confirme:

- environment ativo;
- nome exato;
- valor definido;
- script usa environment correto.

### X-Client-Id não aparece

Confirme:

- URL começa com o valor de `baseUrl`;
- script no nível da collection;
- header não foi removido por request;
- environment `clientId`.

### Location não possui ID

Inspecione o contrato atual.

O script precisa ler o header real.

Não tente extrair body se a API publica o ID apenas em `Location`.

### Get usa ID antigo

Limpe:

```text
managedMessageId.
```

Execute Create antes do Get.

### Runner recebe 429

Use um client ID exclusivo para o runner ou aguarde a janela.

Não remova o rate limiting para deixar a collection verde.

### Upload falha no runner

O arquivo local não foi selecionado ou não existe na máquina.

Execute manualmente.

### Environment example contém IDs

Limpe valores dinâmicos antes de exportar.

### Insomnia importou requests, mas scripts falham

Revise o runtime de scripts do Insomnia.

Adapte somente a lógica necessária.

### Collection ficou enorme após examples

Mantenha examples úteis e sanitizados.

Não salve toda response repetida sem propósito.

---

## Observações para evolução

A coleção pode evoluir com:

- autenticação;
- refresh token;
- variáveis por ambiente;
- dados externos;
- execução em CLI;
- relatórios;
- pipeline;
- monitor;
- mock server;
- geração a partir de OpenAPI;
- sincronização com especificação;
- contract tests;
- testes de segurança;
- smoke suite.

Essas evoluções precisam preservar:

```text
uma fonte clara;

sem secrets;

runner determinístico;

nomes consistentes;

alinhamento com OpenAPI.
```

O Postman oferece scripts pós-response para assertions e passagem de dados entre requests, e o Collection Runner executa requests organizadas em sequência.

O Insomnia também oferece collections, environments, scripts e Collection Runner.

A compatibilidade de arquivo não elimina diferenças entre os runtimes de automação.

---

## Perguntas de revisão

1. O que é uma collection?
2. Collection substitui OpenAPI?
3. Qual formato foi versionado?
4. Qual cliente pode importar?
5. O que fica no environment?
6. Globals foram usados?
7. Qual variável contém a URL da API?
8. Qual variável contém management?
9. Como o client ID é enviado?
10. Como correlation ID é criado?
11. De onde vem managedMessageId?
12. Quando a variável é limpa?
13. Upload entra no runner principal?
14. Rate limit entra no runner principal?
15. O que é um example?
16. Example executa assertion?
17. O que Runner faz?
18. Scripts são idênticos entre clientes?
19. Secrets entram no export?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Grupo organizado de requests e automações.
2. Não.
3. Postman Collection v2.1.
4. Insomnia.
5. URLs, client ID e IDs temporários.
6. Não.
7. `baseUrl`.
8. `managementBaseUrl`.
9. Por pre-request script.
10. Com dynamic GUID por request.
11. Do header Location.
12. Depois do 404 pós-delete.
13. Não.
14. Não.
15. Par request-response salvo.
16. Não.
17. Executa requests e scripts em ordem.
18. Não.
19. Não.
20. Documentação técnica da API.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 401 - M14.46 - Coleção Postman/Insomnia profissional

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei collection de OpenAPI.
- Tratei a collection como código de consumo.
- Adotei Postman Collection v2.1 como fonte versionada.
- Planejei importação no Insomnia.
- Criei `api-clients/postman`.
- Criei uma collection para a API v2.
- Criei environment local.
- Versionei somente um environment example.
- Mantive o environment real fora do Git.
- Não usei globals.
- Criei `baseUrl` e `managementBaseUrl`.
- Criei `clientId`.
- Criei variáveis específicas para IDs.
- Organizei folders numerados.
- Criei folder de operação.
- Criei fluxo de managed messages v2.
- Criei folder de arquivos.
- Criei folder de notificações.
- Criei cenários de erro.
- Criei diagnóstico manual.
- Adicionei pre-request script.
- Adicionei `X-Client-Id` automaticamente.
- GereI `X-Correlation-Id` por request.
- Testei liveness, readiness, health, info e metrics.
- Criei uma managed message com campo `message`.
- Capturei o ID pelo header `Location`.
- Encadeei Get, List, Delete e 404.
- Limpei o ID ao final.
- Criei upload e download.
- Capturei `fileId`.
- Mantive upload fora do runner principal.
- Criei notificação com pré-condição de Mailpit.
- Mantive notificação fora do runner principal.
- Testei 400, 404, 429 e 503.
- Validei Problem Details.
- Rejeitei stack trace pública.
- Salvei examples sanitizados.
- Executei o runner três vezes.
- Exportei collection e environment example.
- Validei os JSONs.
- Revisei o diff por secrets e hardcodes.
- Importei a collection no Insomnia.
- Validei environments e scripts.
- Não antecipei CI, monitor, mock server ou carga.
- Próxima aula: Documentação técnica da API.
```

---

## Referência técnica curta

- [Postman — Collections](https://learning.postman.com/docs/collections/collections-overview)
- [Postman — Variables](https://learning.postman.com/docs/sending-requests/variables/variables)
- [Postman — Test scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts)
- [Postman — Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs)
- [Postman — Examples](https://learning.postman.com/docs/sending-requests/response-data/examples)
- [Insomnia — Collections](https://developer.konghq.com/insomnia/collections/)
- [Insomnia — Environments](https://developer.konghq.com/insomnia/environments/)
- [Insomnia — Import and export](https://developer.konghq.com/insomnia/import-export/)

Regra final:

```text
uma coleção profissional precisa representar fluxos reais da API com URLs externalizadas, variáveis específicas, headers transversais centralizados, IDs encadeados, assertions, examples e execução reproduzível; nesta baseline, uma Postman Collection v2.1 versionada organiza operação, managed messages, arquivos, notificações e erros, o environment local permanece sem secrets no Git e o Insomnia importa a mesma fonte com revisão dos scripts.
```
