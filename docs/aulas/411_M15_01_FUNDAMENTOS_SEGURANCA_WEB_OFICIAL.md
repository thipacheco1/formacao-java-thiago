# 411 - M15.01 - Fundamentos seguranca web

## Apresentação da aula

O Módulo 14 foi encerrado com uma aplicação backend tecnicamente consistente para laboratório.

A formação consolidou:

```text
Spring Boot;

REST;

DTOs;

validation;

Problem Details;

JPA;

PostgreSQL;

Flyway;

Redis;

testes;

Actuator;

Docker;

Compose;

OpenAPI;

documentação.
```

O projeto síntese foi a API de Ordem de Serviço.

Ela possui:

- criação;
- consulta;
- atualização;
- transições de status;
- exclusão;
- paginação;
- filtros;
- controle otimista de concorrência;
- testes;
- documentação.

O fechamento do M14 também registrou uma decisão importante:

```text
laboratório local controlado:
GO CONDICIONAL.

produção pública com dados reais:
NO-GO.
```

Os principais bloqueadores foram:

- ausência de autenticação;
- ausência de autorização;
- ausência de TLS comprovado;
- ausência de gestão de secrets de produção;
- ausência de testes de segurança;
- ausência de auditoria completa;
- ausência de controles para múltiplas instâncias;
- ausência de monitoramento e resposta externos.

Essas lacunas não são detalhes.

Elas definem o início do Módulo 15.

O novo módulo é:

```text
M15 - Seguranca de aplicacoes Java
```

Ele possui quarenta e cinco aulas:

```text
411 a 455.
```

A jornada passará por:

- fundamentos;
- threat modeling;
- OWASP;
- CORS;
- CSRF;
- security headers;
- proteção de senhas;
- Spring Security;
- autenticação;
- autorização;
- JWT;
- OAuth2;
- OpenID Connect;
- Keycloak;
- auditoria;
- secrets;
- LGPD;
- testes;
- hardening;
- projeto de API segura.

A primeira pergunta do módulo não será:

```text
qual annotation do Spring Security
preciso adicionar?
```

A pergunta correta será:

```text
o que precisa ser protegido,
contra quem,
com qual impacto
e por quais controles?
```

Segurança não é uma dependência adicionada ao final.

Segurança é engenharia de risco aplicada durante:

- modelagem;
- desenvolvimento;
- teste;
- deploy;
- operação;
- manutenção;
- resposta a incidentes.

Uma aplicação pode possuir login e ainda ser insegura.

Exemplos:

- usuário autenticado acessa recurso de outro cliente;
- senha é armazenada de forma reversível;
- sessão é roubada;
- token aparece nos logs;
- endpoint administrativo está público;
- upload aceita conteúdo perigoso;
- erro expõe detalhes internos;
- dependência possui vulnerabilidade conhecida;
- secret está no repositório;
- autorização existe somente no frontend;
- API permite consumo ilimitado;
- tráfego sensível usa HTTP.

A aula de hoje não implementará Spring Security.

Também não implementará:

- login;
- senha;
- token;
- JWT;
- roles;
- OAuth2;
- CORS;
- CSRF;
- security headers.

Esses assuntos possuem aulas próprias.

O objetivo inicial será construir uma base conceitual e registrar o estado de segurança atual do projeto.

O laboratório criará:

```text
docs/security/M15_SECURITY_BASELINE.md
```

O documento responderá:

- quais ativos existem;
- quais dados são processados;
- quais atores acessam;
- quais pontos de entrada existem;
- quais limites de confiança existem;
- quais controles já estão presentes;
- quais controles estão ausentes;
- quais premissas são aceitas somente no laboratório;
- qual risco impede exposição pública.

A aplicação será executada exatamente como foi encerrada no M14.

Você comprovará que:

```text
X-Client-Id
não autentica ninguém;

correlation ID
não identifica o usuário;

rate limiting
não autoriza acesso;

ETag
não protege propriedade do recurso;

healthcheck
não protege endpoint;

rede Docker
não substitui segurança de aplicação.
```

A próxima aula será:

```text
412 - M15.02 - Threat modeling inicial
```

Ela utilizará a baseline criada hoje para modelar ameaças de forma estruturada.

Por isso, esta aula não tentará antecipar uma análise completa de ameaças.

---

## Onde estamos na formação

A transição entre os módulos é:

```text
410:
Fechamento do Modulo 14 Spring Boot.

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
```

O M14 respondeu:

```text
como construir,
testar,
documentar
e executar uma API Spring Boot?
```

O M15 responderá:

```text
como proteger
identidade,
dados,
operações
e infraestrutura
contra uso indevido?
```

Nesta aula:

```text
segurança como risco:
sim.

confidencialidade:
sim.

integridade:
sim.

disponibilidade:
sim.

autenticação:
conceito.

autorização:
conceito.

sessão:
conceito.

cookies:
conceito.

TLS:
conceito.

defesa em profundidade:
sim.

menor privilégio:
sim.

baseline do projeto:
sim.

ameaças estruturadas:
não ainda.

OWASP Top 10:
não ainda.

Spring Security:
não ainda.

JWT:
não ainda.
```

A regra central será:

```text
antes de escolher controles,
é necessário entender
ativos, dados, atores,
entradas e impactos.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_SECURITY_BASELINE.md
```

Estrutura:

```text
# Baseline de seguranca do M15

## Identificacao
## Objetivo
## Ambiente avaliado
## Ativos
## Classificacao de dados
## Atores
## Pontos de entrada
## Limites de confianca
## Controles presentes
## Controles ausentes
## Evidencias praticas
## Premissas do laboratorio
## Decisao atual
## Proximos passos
```

Você irá:

1. definir segurança como gestão de risco;
2. estudar confidencialidade, integridade e disponibilidade;
3. diferenciar identificação, autenticação e autorização;
4. diferenciar sessão, cookie e token;
5. entender proteção em trânsito;
6. entender menor privilégio;
7. entender defesa em profundidade;
8. mapear ativos;
9. classificar dados;
10. mapear atores;
11. listar pontos de entrada;
12. executar a API sem credenciais;
13. comprovar ausência de autenticação;
14. comprovar ausência de autorização;
15. inspecionar headers e cookies;
16. revisar management port;
17. revisar secrets;
18. revisar logs;
19. criar uma matriz inicial de controles;
20. registrar a decisão de segurança atual.

A decisão esperada será:

```text
uso local controlado:
ACEITO COM RESTRICOES.

exposição pública:
NAO APROVADA.
```

---

## Conceito essencial

### Segurança é gestão de risco

Segurança absoluta não existe.

Uma organização decide:

- quais riscos aceita;
- quais reduz;
- quais transfere;
- quais evita;
- quais monitora.

Uma forma simples de raciocinar é:

```text
risco depende de:

probabilidade;

impacto;

exposição;

controles.
```

Não é necessário criar uma fórmula matemática nesta aula.

O ponto importante é:

```text
uma vulnerabilidade sem contexto
não define sozinha a prioridade;

um ativo crítico exposto
muda completamente o risco.
```

---

### Ativo

Ativo é algo que possui valor e precisa ser protegido.

Na API atual, exemplos:

- dados de Ordens de Serviço;
- dados de clientes;
- agendamentos;
- arquivos enviados;
- credenciais de banco;
- configuração;
- logs;
- disponibilidade da aplicação;
- imagem Docker;
- migrations;
- código-fonte;
- histórico de auditoria futuro.

Um ativo não precisa ser apenas informação.

A disponibilidade do serviço também possui valor.

---

### Ameaça, vulnerabilidade e controle

Ameaça:

```text
algo capaz de causar dano.
```

Exemplos:

- atacante externo;
- usuário interno mal-intencionado;
- malware;
- erro humano;
- falha de fornecedor;
- automação abusiva.

Vulnerabilidade:

```text
fraqueza que pode ser explorada
ou provocar dano.
```

Exemplos:

- endpoint sem autorização;
- senha em texto puro;
- cookie sem proteção;
- dependência vulnerável;
- upload sem limite;
- secret no Git.

Controle:

```text
medida que previne,
detecta,
reduz
ou responde ao risco.
```

Exemplos:

- autenticação;
- autorização;
- TLS;
- hash de senha;
- rate limiting;
- validação;
- logs;
- alertas;
- backup;
- testes.

A aula 412 estruturará as relações entre esses elementos.

---

### Confidencialidade

Confidencialidade significa impedir divulgação não autorizada.

Perguntas:

- quem pode ler uma OS?
- um cliente pode ver dados de outro?
- logs contêm informações pessoais?
- backups são protegidos?
- tokens aparecem em URLs?
- tráfego pode ser interceptado?

Exemplo de quebra:

```text
GET /service-orders/{id}
retorna qualquer OS
para qualquer pessoa
que conhece o UUID.
```

UUID reduz previsibilidade.

UUID não implementa autorização.

---

### Integridade

Integridade significa proteger dados contra alteração indevida.

Perguntas:

- quem pode alterar status?
- uma request antiga sobrescreve uma nova?
- migration foi modificada?
- logs de auditoria podem ser alterados?
- payload foi validado?
- arquivo persistido corresponde ao metadata?

A API OS já possui:

```text
ETag;

If-Match;

@Version.
```

Esses controles reduzem lost update.

Eles não respondem:

```text
quem possui permissão
para executar a alteração?
```

---

### Disponibilidade

Disponibilidade significa manter informação e serviço acessíveis quando necessário.

Riscos:

- consumo excessivo;
- consultas sem limite;
- upload grande;
- pool esgotado;
- dependência indisponível;
- loop de restart;
- ataque de negação de serviço;
- scheduler pesado;
- logs sem rotação.

Controles já existentes:

- paginação;
- size máximo;
- rate limiting inicial;
- timeouts;
- health;
- readiness;
- liveness.

Novamente:

```text
controle existente
não significa risco eliminado.
```

---

### Autenticidade e responsabilidade

Além da tríade CIA, aplicações precisam saber:

```text
a identidade declarada é verdadeira?

quem realizou a ação?

há evidência confiável?
```

Autenticidade está relacionada a confirmar identidade e origem.

Responsabilidade, ou accountability, exige associar ações a uma identidade de forma auditável.

Hoje:

```text
X-Client-Id:
valor escolhido pelo cliente.

X-Correlation-Id:
identificador técnico da request.
```

Nenhum dos dois comprova identidade humana.

---

### Identificação

Identificação é a declaração:

```text
eu sou o usuário thiago.
```

Pode ser representada por:

- username;
- e-mail;
- client ID;
- subject;
- certificado.

Declarar identidade não significa prová-la.

---

### Autenticação

Autenticação verifica uma identidade.

Exemplos:

- senha;
- chave;
- certificado;
- biometria;
- token emitido por autoridade;
- múltiplos fatores.

A pergunta é:

```text
quem é você?
```

A resposta precisa ser verificada.

Spring Security será estudado a partir da aula 418.

---

### Autorização

Autorização decide o que uma identidade autenticada pode fazer.

Perguntas:

- pode criar OS?
- pode consultar esta OS?
- pode excluir?
- pode acessar management?
- pode concluir atendimento?
- pode ver dados de outro tenant?

A pergunta é:

```text
você pode realizar esta ação
neste recurso?
```

Autenticação sem autorização não é suficiente.

Um usuário válido ainda pode tentar acessar um recurso proibido.

---

### Autorização por objeto

Considere:

```text
usuário A pode consultar OS do cliente A;

usuário B pode consultar OS do cliente B.
```

Não basta proteger:

```text
GET /service-orders/**.
```

Também é necessário verificar a propriedade ou escopo do objeto.

Esse tema será aprofundado no módulo.

---

### Sessão

Sessão representa estado de segurança mantido entre requests.

Em aplicações web tradicionais:

```text
usuário autentica;

servidor cria sessão;

browser recebe identificador;

requests seguintes enviam o identificador.
```

O estado pode ficar:

- em memória;
- em banco;
- em cache;
- em armazenamento distribuído.

Sessão não é sinônimo de cookie.

O cookie pode transportar apenas o identificador da sessão.

---

### Cookie

Cookie é um mecanismo do browser.

Ele pode armazenar:

- ID de sessão;
- preferência;
- token;
- estado técnico.

Atributos importantes incluem:

```text
Secure;

HttpOnly;

SameSite;

Path;

Domain;

Max-Age.
```

Conceitualmente:

`Secure`

```text
envio somente por conexão HTTPS.
```

`HttpOnly`

```text
impede leitura pelo JavaScript do browser.
```

`SameSite`

```text
controla envio em contextos cross-site.
```

Esses atributos reduzem riscos específicos.

Eles não corrigem uma aplicação inteira.

---

### Token

Token é uma credencial ou representação utilizada para provar autorização ou autenticação em um contexto.

Pode ser:

- opaco;
- estruturado;
- de acesso;
- de atualização;
- de sessão;
- de uso único.

JWT é um formato possível.

JWT não é sinônimo de segurança.

Ele será estudado nas aulas 422 a 425.

---

### Bearer credential

Uma bearer credential funciona pela posse:

```text
quem possui o valor
pode utilizá-lo.
```

Isso aumenta a importância de proteger:

- transporte;
- armazenamento;
- logs;
- browser;
- duração;
- rotação;
- revogação.

Não coloque tokens em:

- query string;
- logs;
- mensagens;
- screenshots;
- commits.

---

### TLS e HTTPS

TLS protege dados em trânsito.

HTTPS é HTTP sobre TLS.

Objetivos principais:

- confidencialidade durante o transporte;
- integridade do tráfego;
- autenticação do servidor por certificado.

TLS não protege automaticamente:

- banco em repouso;
- logs;
- aplicação vulnerável;
- autorização;
- endpoint interno;
- segredo exposto no frontend.

A stack local atual usa:

```text
HTTP.
```

Isso é aceitável somente no laboratório controlado.

Produção pública precisa de HTTPS comprovado.

---

### Dados em três estados

Pense em dados:

```text
em trânsito;

em repouso;

em uso.
```

Em trânsito:

```text
TLS.
```

Em repouso:

```text
disco, banco, backup, volume.
```

Em uso:

```text
memória, processamento, logs temporários.
```

Proteger apenas um estado deixa os outros expostos.

---

### Menor privilégio

Cada identidade, processo e serviço deve possuir somente o acesso necessário.

Exemplos:

- usuário de banco sem privilégio administrativo;
- endpoint de management não público;
- aplicação sem root;
- service account restrita;
- usuário comum sem operação administrativa;
- token com escopo limitado.

A imagem Docker já roda como usuário não root.

Isso é um controle de menor privilégio no sistema operacional.

Não substitui autorização na aplicação.

---

### Defesa em profundidade

Defesa em profundidade utiliza múltiplas camadas.

Exemplo de proteção de uma OS:

```text
TLS;

autenticação;

autorização de rota;

autorização por objeto;

validation;

ETag;

logs;

auditoria;

alerta.
```

Se uma camada falhar, outras ainda reduzem o impacto.

Não confunda defesa em profundidade com duplicação aleatória.

Cada controle precisa possuir finalidade.

---

### Seguro por padrão

O comportamento padrão deve ser o mais restritivo adequado.

Exemplos:

- negar acesso não declarado;
- management somente no loopback;
- secrets ausentes do repositório;
- profile de laboratório desativado;
- endpoints novos protegidos;
- detalhes de erro ocultos;
- tamanho de página limitado.

A API atual ainda permite endpoints de negócio sem autenticação.

Esse default será corrigido nas aulas de Spring Security.

---

### Falhar de forma segura

Quando uma dependência de segurança falha, a decisão precisa ser consciente.

Exemplo:

```text
serviço de autorização indisponível.
```

Falhar aberto significa permitir.

Falhar fechado significa negar.

Nem todo componente deve falhar da mesma forma.

Cache de leitura pode falhar aberto e buscar o banco.

Autorização não deve permitir acesso por indisponibilidade.

---

### Minimizar superfície de ataque

Superfície de ataque inclui tudo que pode ser alcançado ou influenciado.

Exemplos:

- endpoints;
- portas;
- headers;
- parâmetros;
- uploads;
- dependências;
- consoles;
- Actuator;
- documentação;
- filas;
- jobs;
- imagens;
- secrets.

Reduzir superfície significa:

- expor somente o necessário;
- remover recursos antigos;
- limitar methods;
- fechar portas;
- desabilitar debug;
- restringir management;
- atualizar dependências.

---

### Validation não é autorização

Validation responde:

```text
o dado possui formato aceitável?
```

Autorização responde:

```text
esta identidade pode executar a ação?
```

Uma request válida ainda pode ser proibida.

Não use `@Valid` como argumento de segurança de acesso.

---

### Rate limiting não é autorização

Rate limiting responde:

```text
quantas requests podem ser feitas?
```

Ele não responde:

```text
quem é o usuário?

pode acessar este recurso?
```

A API atual utiliza `X-Client-Id`.

Como o cliente controla esse valor, ele pode trocar o identificador.

O controle reduz abuso simples.

Ele não prova identidade.

---

### Logs e auditoria

Log técnico ajuda diagnóstico.

Auditoria registra ações sensíveis.

Exemplos de auditoria:

- usuário;
- ação;
- recurso;
- resultado;
- instante;
- origem;
- correlation ID;
- motivo.

Não registre:

- senha;
- token;
- secret;
- body sensível completo.

Auditoria de ações sensíveis terá aula própria.

---

## Mão na massa guiada

### 1. Criar o diretório de segurança

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/security" |
  Out-Null
```

Arquivo:

```text
docs/security/M15_SECURITY_BASELINE.md
```

---

### 2. Criar o cabeçalho

```markdown
# Baseline de seguranca do M15

## Identificacao

- Aplicacao: formacao-java-backend-api
- Modulo: M15
- Ambiente: laboratorio local controlado
- Dados permitidos: sinteticos
- Exposicao publica: nao permitida
- Commit avaliado: `<preencher>`
- Data: `<preencher>`
```

Preencha o commit:

```powershell
git rev-parse HEAD
```

---

### 3. Registrar o objetivo

```markdown
## Objetivo

Registrar o estado de seguranca da aplicacao antes da introducao
de Spring Security, autenticacao e autorizacao.

Este documento nao aprova producao publica. Ele fornece a baseline
que sera usada nas proximas aulas para modelar ameacas e aplicar
controles de seguranca.
```

---

### 4. Inventariar ativos

Crie uma tabela:

```markdown
| Ativo | Valor | Impacto se exposto ou alterado |
|---|---|---|
| Ordens de Servico | Dados operacionais | Alto |
| Arquivos enviados | Conteudo do usuario | Alto |
| Credenciais de banco | Acesso a persistencia | Critico |
| Logs | Diagnostico e possiveis dados | Medio/Alto |
| Disponibilidade da API | Continuidade do servico | Alto |
| Codigo e migrations | Integridade do sistema | Alto |
```

Não use dados reais.

---

### 5. Classificar dados

Categorias iniciais:

```text
PUBLICO;

INTERNO;

CONFIDENCIAL;

SENSIVEL.
```

Exemplo:

```markdown
| Dado | Classificacao inicial |
|---|---|
| Swagger de laboratorio | INTERNO |
| ID tecnico da OS | INTERNO |
| Nome do cliente | CONFIDENCIAL |
| Endereco de atendimento | CONFIDENCIAL |
| Senha de banco | SENSIVEL |
| Correlation ID | INTERNO |
```

A classificação final depende do contexto organizacional.

---

### 6. Inventariar atores

```markdown
| Ator | Objetivo legitimo |
|---|---|
| Cliente da API | Consumir endpoints permitidos |
| Operador | Diagnosticar e operar |
| Desenvolvedor | Manter a aplicacao |
| Banco PostgreSQL | Persistir dados |
| Redis | Cache e rate limiting |
| SMTP | Receber notificacoes |
| Atacante externo | Nao possui objetivo legitimo |
```

Não defina ainda todos os cenários de ataque.

Isso ficará para threat modeling.

---

### 7. Inventariar pontos de entrada

Inclua:

- API `8081`;
- management `8082`;
- upload multipart;
- query parameters;
- headers;
- JSON;
- SMTP de saída;
- PostgreSQL;
- Redis;
- Docker volumes;
- env files;
- OpenAPI;
- collection.

Marque:

```text
externo;

interno;

local;

não publicado.
```

---

### 8. Registrar limites de confiança

Sem fazer o threat model completo, registre transições básicas:

```text
cliente -> API;

API -> PostgreSQL;

API -> Redis;

API -> filesystem;

API -> SMTP;

host -> containers.
```

Um limite de confiança indica mudança de controle ou responsabilidade.

A próxima aula detalhará ameaças nesses limites.

---

### 9. Subir a aplicação

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Confirme:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

---

### 10. Comprovar acesso sem autenticação

Crie uma OS sem:

- username;
- password;
- token;
- cookie.

Use somente o `X-Client-Id` técnico:

```powershell
$body = @{
  customerName =
    "Cliente Baseline"

  serviceType =
    "Vistoria"

  description =
    "Evidencia da baseline de seguranca"

  serviceAddress =
    "Rua Seguranca, 100"

  scheduledFor =
    "2026-07-20T10:00:00-03:00"
} |
  ConvertTo-Json

$response = Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    "X-Client-Id" =
      "qualquer-valor"
  } `
  -ContentType "application/json" `
  -Body $body

$response.StatusCode
```

Resultado esperado:

```text
201.
```

Registre como evidência:

```text
endpoint de negócio aceita request
sem identidade autenticada.
```

---

### 11. Comprovar ausência de autorização por objeto

Capture o ID e ETag.

Depois faça GET usando outro `X-Client-Id`:

```powershell
$order =
  $response.Content |
  ConvertFrom-Json

$serviceOrderId =
  $order.id

Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/service-orders/$serviceOrderId" `
  -Headers @{
    "X-Client-Id" =
      "outro-cliente"
  }
```

Resultado atual:

```text
200.
```

Isso comprova:

```text
X-Client-Id não limita
propriedade do recurso.
```

Não tente corrigir ainda.

---

### 12. Comprovar que ETag não autoriza

Use o ETag retornado e altere a OS com outro `X-Client-Id`.

Se a versão estiver correta, a alteração é aceita.

Conclusão:

```text
If-Match protege concorrência;

não protege identidade
nem permissão.
```

Registre essa diferença.

---

### 13. Inspecionar protocolo

A URL atual é:

```text
http://localhost:8081.
```

Não existe TLS na stack local.

Registre:

```text
tráfego não criptografado
no laboratório local.
```

Não envie credenciais ou dados reais nesse ambiente.

---

### 14. Inspecionar cookies

Execute:

```powershell
$health =
  Invoke-WebRequest `
    "http://localhost:8081/livez"

$health.Headers
```

Procure:

```text
Set-Cookie.
```

A aplicação atual não deve criar sessão de autenticação.

A ausência de cookie não significa que a API está segura.

Significa apenas:

```text
nenhuma sessão web foi criada
nesse fluxo.
```

---

### 15. Inspecionar headers

Execute:

```powershell
$response.Headers
```

Observe:

- `Content-Type`;
- `Location`;
- `ETag`;
- `X-Correlation-Id`;
- `X-Content-Type-Options` quando aplicável.

Não implemente security headers nesta aula.

Eles serão tratados na aula 416.

Registre apenas o estado atual.

---

### 16. Revisar management

Confirme o binding:

```text
127.0.0.1:8082.
```

Tente acessar:

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

Registre:

```text
management limitado ao loopback do host
na baseline Compose.
```

Isso é um controle presente.

---

### 17. Revisar portas

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Confirme:

- PostgreSQL não publicado;
- Redis não publicado;
- API publicada;
- management no loopback.

A rede interna reduz exposição de infraestrutura.

Ela não protege endpoints de negócio publicados.

---

### 18. Revisar secrets

Execute:

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

Revise os resultados.

Confirme:

```powershell
git check-ignore `
  -v `
  ".docker/compose.local.env"
```

Registre:

```text
env local ignorado:
controle presente.

secret manager de produção:
ausente.
```

---

### 19. Revisar logs

Crie uma request com:

```http
X-Correlation-Id: m15-baseline-411
```

Procure:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String `
    "m15-baseline-411"
```

Confirme:

- correlation ID aparece;
- senha não aparece;
- token não aparece;
- body completo não aparece.

Registre qualquer divergência.

---

### 20. Criar a matriz de controles

Exemplo:

```markdown
| Controle | Estado | Evidencia |
|---|---|---|
| Bean Validation | PRESENTE | Requests invalidas retornam 400 |
| Problem Details | PRESENTE | Erros padronizados |
| ETag/If-Match | PRESENTE | Concorrencia |
| Rate limiting | PARCIAL | X-Client-Id controlado pelo cliente |
| Usuario nao root | PRESENTE | UID 10001 |
| Management loopback | PRESENTE | Porta 8082 |
| Autenticacao | AUSENTE | Nenhuma credencial exigida |
| Autorizacao | AUSENTE | Qualquer cliente acessa qualquer OS |
| TLS | AUSENTE NO LAB | HTTP |
| Secret manager | AUSENTE | Somente env file local |
| Auditoria de usuario | AUSENTE | Sem identidade autenticada |
```

Use evidências reais.

---

### 21. Registrar premissas do laboratório

```markdown
## Premissas do laboratorio

- uso somente local;
- dados sinteticos;
- sem exposicao publica;
- uma pessoa operando;
- rede confiavel;
- volumes conhecidos;
- nenhum segredo real;
- nenhuma informacao pessoal real.
```

Se uma premissa deixar de ser verdadeira, a decisão precisa ser refeita.

---

### 22. Registrar a decisão

```markdown
## Decisao atual

### Laboratorio local controlado

**ACEITO COM RESTRICOES**

### Producao publica

**NAO APROVADA**

Motivos principais:

- sem autenticacao;
- sem autorizacao;
- sem TLS comprovado;
- sem gestao de secrets;
- sem auditoria por identidade;
- sem testes de seguranca.
```

---

### 23. Registrar próximos passos

```markdown
## Proximos passos

1. Realizar threat modeling.
2. Aplicar OWASP Top 10 ao projeto.
3. Revisar CORS e CSRF.
4. Configurar security headers.
5. Estudar armazenamento de senha.
6. Compreender arquitetura do Spring Security.
7. Implementar autenticacao.
8. Implementar autorizacao.
9. Criar auditoria e testes de seguranca.
```

Preserve a ordem da grade.

---

### 24. Limpar o dado criado

Use o ETag atual e delete a OS de baseline se ela ainda estiver `OPEN`.

Depois:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Preserve os volumes.

---

## Entendendo o que foi feito

### O módulo começou pelo risco

Nenhuma tecnologia foi escolhida antes de conhecer o estado atual.

### A ausência de autenticação foi comprovada

Não ficou apenas como afirmação documental.

### X-Client-Id ganhou classificação correta

Ele é um identificador técnico de rate limiting, não identidade confiável.

### ETag permaneceu no papel correto

Ele protege concorrência, não permissão.

### Controles existentes foram reconhecidos

Validation, Problem Details, portas internas e usuário não root possuem valor.

### Lacunas permaneceram explícitas

TLS, autenticação, autorização e secrets continuam ausentes.

### A baseline criou um ponto de comparação

As próximas aulas poderão demonstrar evolução objetiva.

---

## Erros comuns importantes

### Começar instalando Spring Security

Sem entender os ativos, regras podem proteger paths errados.

### Confundir login com segurança

Autenticação é apenas uma camada.

### Usar UUID como autorização

Identificador difícil não é controle de acesso.

### Usar X-Client-Id como identidade

O cliente escolhe o valor.

### Considerar HTTP local seguro em qualquer contexto

A premissa vale somente no laboratório controlado.

### Confundir correlation ID com usuário

Ele identifica request, não pessoa.

### Tratar rate limiting como permissão

Limite não decide acesso ao recurso.

### Acreditar que Docker protege a API

Container reduz alguns riscos de infraestrutura, não autoriza requests.

### Registrar dados sensíveis na baseline

Use somente exemplos sintéticos.

### Antecipar threat modeling

A próxima aula aplicará método estruturado.

---

## Comandos úteis

### Identificar commit

```powershell
git rev-parse HEAD
git status --short
```

### Subir stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Ver portas

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

### Procurar secrets

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

### Verificar env ignorado

```powershell
git check-ignore `
  -v `
  ".docker/compose.local.env"
```

### Consultar health

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

### Encerrar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Conceitos

Explique CIA, autenticação e autorização.

### Parte 2 — Ativos

Liste ativos e impactos.

### Parte 3 — Dados

Classifique informações da API OS.

### Parte 4 — Atores

Identifique acessos legítimos e não legítimos.

### Parte 5 — Entradas

Mapeie portas, endpoints, headers e uploads.

### Parte 6 — Evidências

Comprove acesso sem credencial e sem autorização por objeto.

### Parte 7 — Transporte

Registre ausência de TLS no laboratório.

### Parte 8 — Controles

Classifique controles presentes, parciais e ausentes.

### Parte 9 — Decisão

Mantenha laboratório restrito e produção não aprovada.

### Parte 10 — Continuidade

Prepare a baseline para threat modeling.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- M15 foi iniciado oficialmente;
- nome do módulo foi registrado;
- total de 45 aulas foi registrado;
- intervalo 411 a 455 foi registrado;
- continuidade com a aula 410 foi preservada;
- segurança foi tratada como gestão de risco;
- ativo foi definido;
- ameaça foi definida;
- vulnerabilidade foi definida;
- controle foi definido;
- confidencialidade foi explicada;
- integridade foi explicada;
- disponibilidade foi explicada;
- autenticidade foi explicada;
- accountability foi explicada;
- identificação foi diferenciada;
- autenticação foi diferenciada;
- autorização foi diferenciada;
- autorização por objeto foi introduzida;
- sessão foi explicada;
- cookie foi explicado;
- token foi explicado;
- bearer credential foi explicada;
- Secure foi introduzido;
- HttpOnly foi introduzido;
- SameSite foi introduzido;
- TLS foi explicado;
- HTTPS foi explicado;
- dados em trânsito foram explicados;
- dados em repouso foram explicados;
- dados em uso foram explicados;
- menor privilégio foi explicado;
- defesa em profundidade foi explicada;
- seguro por padrão foi explicado;
- falha segura foi explicada;
- superfície de ataque foi explicada;
- validation não foi confundida com autorização;
- rate limiting não foi confundido com autorização;
- logs foram diferenciados de auditoria;
- diretório `docs/security` foi criado;
- baseline foi criada;
- commit avaliado foi registrado;
- ambiente foi registrado;
- dados sintéticos foram exigidos;
- ativos foram inventariados;
- dados foram classificados;
- atores foram inventariados;
- pontos de entrada foram listados;
- limites de confiança foram listados;
- stack foi iniciada;
- POST sem autenticação foi comprovado;
- GET com outro X-Client-Id foi comprovado;
- ausência de autorização por objeto foi comprovada;
- ETag não foi chamado de autorização;
- HTTP local foi registrado;
- cookies foram inspecionados;
- ausência de sessão não foi chamada de segurança completa;
- headers foram inspecionados;
- security headers não foram antecipados;
- management loopback foi confirmado;
- PostgreSQL não foi publicado;
- Redis não foi publicado;
- secrets foram procurados;
- env local ignorado foi confirmado;
- ausência de secret manager foi registrada;
- logs foram revisados;
- correlation ID foi localizado;
- senha não foi registrada;
- token não foi registrado;
- matriz de controles foi criada;
- autenticação foi classificada como ausente;
- autorização foi classificada como ausente;
- TLS foi classificado como ausente no laboratório;
- rate limiting foi classificado como parcial;
- premissas do laboratório foram registradas;
- laboratório foi aceito com restrições;
- produção pública não foi aprovada;
- próximos passos seguiram a grade;
- Spring Security não foi implementado;
- JWT não foi antecipado;
- CORS não foi aprofundado;
- CSRF não foi aprofundado;
- OWASP Top 10 não foi aprofundado;
- threat modeling não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 412 está correta.

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
git commit -m "docs(m15): registrar fundamentos e baseline de seguranca web"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- env files;
- credentials;
- tokens;
- dados reais;
- logs locais;
- respostas com informações pessoais;
- arquivos temporários;
- secrets;
- screenshots com dados.

---

## Fechamento e ponte para a próxima aula

O Módulo 15 foi iniciado.

A primeira aula estabeleceu que segurança não começa com framework.

Ela começa com:

```text
ativos;

dados;

atores;

entradas;

impactos;

premissas;

controles.
```

Você diferenciou:

```text
identificação;

autenticação;

autorização;

sessão;

cookie;

token;

TLS;

auditoria.
```

A baseline comprovou:

```text
a API está funcional;

a API não autentica;

a API não autoriza;

X-Client-Id não é identidade;

ETag não é permissão;

HTTP local não é transporte de produção.
```

A decisão atual permanece:

```text
laboratório local:
ACEITO COM RESTRICOES.

produção pública:
NAO APROVADA.
```

A decisão central foi:

```text
não é possível proteger corretamente
um sistema que não foi compreendido;

antes de adicionar controles,
é preciso conhecer
o que possui valor,
quem acessa
e onde a confiança muda.
```

A próxima aula será:

```text
412 - M15.02 - Threat modeling inicial
```

Nela, a baseline será transformada em um modelo de ameaças.

Você aprenderá a:

- definir escopo;
- desenhar fluxo;
- identificar trust boundaries;
- aplicar STRIDE de forma inicial;
- registrar ameaça;
- estimar impacto;
- selecionar mitigação;
- manter backlog de segurança.

O OWASP Top 10 permanecerá para a aula 413.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei oficialmente o M15.
- [ ] Diferenciei autenticação e autorização.
- [ ] Registrei ativos, dados, atores e entradas.
- [ ] Comprovei a ausência de controles de acesso.
- [ ] Criei a baseline para threat modeling.

---

## Troubleshooting adicional

### POST retorna 429

Use outro `X-Client-Id` ou aguarde a janela.

Isso reforça que o identificador pode ser escolhido pelo cliente.

### GET retorna 404

Confirme o ID e se a OS não foi excluída.

### Update retorna 428

Envie o ETag recebido no header `If-Match`.

Essa precondição não substitui autenticação.

### Management não abre em outra máquina

O binding no loopback é intencional.

### Set-Cookie não aparece

Nenhuma sessão foi criada nesse fluxo.

Não conclua que cookies nunca serão usados no M15.

### Git grep encontra password

Revise se é:

- nome de property;
- texto de documentação;
- valor real.

Somente valor real é secret exposto.

### A baseline parece negativa

O objetivo é registrar o estado real.

Lacunas explícitas permitem evolução segura.

---

## Perguntas de revisão

1. O que é segurança de aplicações?
2. O que é um ativo?
3. Qual diferença entre ameaça e vulnerabilidade?
4. O que é um controle?
5. O que significa confidencialidade?
6. O que significa integridade?
7. O que significa disponibilidade?
8. Identificação prova identidade?
9. O que autenticação responde?
10. O que autorização responde?
11. Sessão é igual a cookie?
12. O que Secure faz?
13. O que HttpOnly faz?
14. O que SameSite influencia?
15. O que TLS protege?
16. UUID autoriza acesso?
17. X-Client-Id autentica?
18. ETag autoriza?
19. A produção pública está aprovada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Gestão de riscos sobre dados e sistemas.
2. Algo de valor que precisa de proteção.
3. Ameaça causa dano; vulnerabilidade é fraqueza.
4. Medida de prevenção, detecção, redução ou resposta.
5. Impedir divulgação não autorizada.
6. Impedir alteração indevida.
7. Manter acesso quando necessário.
8. Não.
9. Quem é você?
10. O que você pode fazer?
11. Não.
12. Limita envio do cookie a HTTPS.
13. Impede leitura do cookie por JavaScript.
14. Envio do cookie em contexto cross-site.
15. Dados em trânsito e identidade do servidor.
16. Não.
17. Não.
18. Não.
19. Não.
20. Threat modeling inicial.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 411 - M15.01 - Fundamentos seguranca web

- Iniciei oficialmente o Módulo 15.
- Registrei que o módulo possui 45 aulas, da 411 à 455.
- Tratei segurança como engenharia e gestão de risco.
- Diferenciei ativo, ameaça, vulnerabilidade e controle.
- Estudei confidencialidade, integridade e disponibilidade.
- Introduzi autenticidade e accountability.
- Diferenciei identificação, autenticação e autorização.
- Introduzi autorização por objeto.
- Diferenciei sessão, cookie e token.
- Introduzi bearer credentials.
- Estudei os atributos Secure, HttpOnly e SameSite.
- Entendi o papel de TLS e HTTPS.
- Diferenciei dados em trânsito, repouso e uso.
- Estudei menor privilégio.
- Estudei defesa em profundidade.
- Estudei secure by default e fail secure.
- Estudei redução da superfície de ataque.
- Confirmei que validation não é autorização.
- Confirmei que rate limiting não é autorização.
- Diferenciei logs técnicos de auditoria.
- Criei `docs/security/M15_SECURITY_BASELINE.md`.
- Inventariei ativos, dados, atores e pontos de entrada.
- Registrei limites de confiança iniciais.
- Comprovei acesso à API sem autenticação.
- Comprovei ausência de autorização por objeto.
- Confirmei que X-Client-Id não é identidade.
- Confirmei que ETag protege concorrência, não permissão.
- Registrei uso de HTTP somente para laboratório.
- Inspecionei cookies e headers.
- Confirmei management no loopback.
- Confirmei PostgreSQL e Redis sem portas públicas.
- Revisei secrets e env files ignorados.
- Revisei logs e correlation ID.
- Criei uma matriz de controles presentes, parciais e ausentes.
- Mantive laboratório aceito com restrições.
- Mantive produção pública não aprovada.
- Não antecipei Spring Security, JWT, CORS, CSRF ou OWASP Top 10.
- Próxima aula: Threat modeling inicial.
```

---

## Referência técnica curta

- [NIST — Confidentiality, Integrity and Availability](https://csrc.nist.gov/glossary/term/confidentiality_integrity_availability)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP HTTP Security Response Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Security Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)

Regra final:

```text
segurança web precisa começar pela compreensão de ativos, dados, atores, pontos de entrada e limites de confiança; nesta baseline, confidencialidade, integridade e disponibilidade orientam o risco, autenticação é separada de autorização, sessão é separada de cookie e token, TLS protege o transporte e a aplicação atual permanece aceita somente em laboratório controlado enquanto autenticação, autorização e proteção de produção estiverem ausentes.
```
