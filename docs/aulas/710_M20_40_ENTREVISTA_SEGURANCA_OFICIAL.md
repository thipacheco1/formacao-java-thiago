# 710 - M20.40 - Entrevista seguranca

## Apresentação da aula

Na aula 709, você realizou a preparação completa para uma entrevista de SQL e banco de dados.

O material anterior organizou:

- modelagem relacional;
- chaves e constraints;
- normalização;
- SQL core;
- joins;
- agregações;
- subqueries;
- CTEs;
- window functions;
- índices;
- planos de execução;
- transações;
- MVCC;
- isolamento;
- locks;
- deadlocks;
- paginação;
- performance;
- migrations;
- particionamento;
- troubleshooting;
- exercícios;
- duas entrevistas simuladas;
- scorecard;
- report, evidence e gate.

Agora você avançará para uma entrevista focada em segurança.

Esse tipo de entrevista avalia se você compreende:

- identidade;
- confiança;
- ameaça;
- superfície de ataque;
- autenticação;
- autorização;
- isolamento;
- criptografia;
- gestão de secrets;
- validação de entrada;
- tratamento de saída;
- sessão;
- tokens;
- logging seguro;
- testes negativos;
- resposta a incidentes.

Perguntas comuns:

- autenticação e autorização são a mesma coisa?
- por que senha não deve ser criptografada de forma reversível?
- qual a diferença entre hash e criptografia?
- como funciona OAuth2?
- o que é um Resource Server?
- JWT é sempre melhor que sessão?
- assinatura de JWT garante autorização?
- para que servem issuer e audience?
- como evitar IDOR?
- como impedir mass assignment?
- o que é CSRF?
- quando CORS ajuda?
- CORS protege backend contra qualquer cliente?
- como evitar SQL injection?
- como tratar SSRF?
- como proteger secrets?
- o que registrar em logs?
- como implementar multi-tenancy?
- como testar segurança?
- o que fazer quando um token vaza?
- como responder a uma vulnerabilidade descoberta em produção?

Uma resposta superficial diz:

```text
eu uso Spring Security
e JWT.
```

Uma resposta profissional explica:

```text
o sistema valida identidade,
emissor,
audiencia,
escopos,
roles,
tenant
e autorizacao por recurso;

JWT e apenas um formato de token
e nao substitui
politica,
revogacao,
rotacao,
testes negativos
ou observabilidade segura.
```

Nesta aula, você treinará:

- princípios de segurança;
- threat modeling;
- autenticação;
- autorização;
- OAuth2;
- OpenID Connect;
- JWT;
- sessões;
- senhas;
- criptografia;
- chaves;
- secrets;
- OWASP;
- injection;
- XSS;
- CSRF;
- CORS;
- SSRF;
- IDOR;
- mass assignment;
- deserialização;
- path traversal;
- file upload;
- rate limiting;
- tenant isolation;
- headers;
- logging;
- testes;
- incident response;
- exercícios;
- entrevista simulada.

A próxima aula será:

```text
711 - M20.41 - Entrevista DevOps cloud
```

Na aula 711, você aprofundará containers, Docker, CI/CD, GitHub Actions, artifacts, imagens, Kubernetes, cloud, redes, observabilidade, segurança de pipelines, deploy, rollback, escalabilidade e troubleshooting de infraestrutura.

DevOps e cloud aparecerão apenas para contextualizar segurança de entrega e configuração.

O laboratório será:

```text
labs/m20/aula-710-entrevista-seguranca/orderflow-security-interview
```

Regra central:

```text
uma boa entrevista de seguranca
nao mede apenas siglas;

ela mede
se voce reconhece ameacas,
protege boundaries,
valida autorizacao,
reduz impacto
e responde a falhas.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
707:
Entrevista Java.

708:
Entrevista Spring JPA.

709:
Entrevista SQL banco.

710:
Entrevista seguranca.

711:
Entrevista DevOps cloud.

712:
Entrevista arquitetura.
```

A aula 710 utiliza como fonte:

- configuração de segurança do OrderFlow;
- OAuth2 Resource Server;
- validação JWT;
- issuer;
- audience;
- scopes;
- roles;
- tenant claim;
- filtros;
- policies;
- testes negativos;
- logs sanitizados;
- secret scanning;
- OpenAPI;
- Postman;
- reports;
- evidence;
- runbook;
- decisões arquiteturais;
- respostas das aulas anteriores.

A entrevista conecta segurança e comportamento.

Quando falar de JWT, explique como o token é validado.

Quando falar de tenant, explique como o contexto chega ao domínio e ao banco.

Quando falar de IDOR, explique por que possuir um identificador não concede acesso.

Quando falar de secrets, explique armazenamento, injeção, rotação e auditoria.

Quando falar de logs, explique o que nunca deve ser registrado.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-seguranca
├── SECURITY_INTERVIEW_CHARTER.md
├── SECURITY_FOUNDATIONS_QUESTION_BANK.md
├── THREAT_MODELING_QUESTION_BANK.md
├── AUTHENTICATION_QUESTION_BANK.md
├── AUTHORIZATION_QUESTION_BANK.md
├── OAUTH2_OIDC_QUESTION_BANK.md
├── JWT_SESSION_QUESTION_BANK.md
├── PASSWORD_CRYPTOGRAPHY_QUESTION_BANK.md
├── SECRETS_KEY_MANAGEMENT.md
├── OWASP_QUESTION_BANK.md
├── INJECTION_QUESTION_BANK.md
├── XSS_CSRF_CORS_QUESTION_BANK.md
├── SSRF_FILE_PATH_QUESTION_BANK.md
├── IDOR_MASS_ASSIGNMENT_QUESTION_BANK.md
├── TENANT_ISOLATION_QUESTION_BANK.md
├── SECURITY_HEADERS_QUESTION_BANK.md
├── RATE_LIMITING_ABUSE_QUESTION_BANK.md
├── SECURITY_LOGGING_AUDIT.md
├── SECURITY_TESTING_GUIDE.md
├── SECURITY_INCIDENT_RESPONSE.md
├── SECURITY_CODING_EXERCISES.md
├── MOCK_SECURITY_INTERVIEW.md
├── SECURITY_INTERVIEW_SCORECARD.md
├── SECURITY_INTERVIEW_REVIEW_CHECKLIST.md
├── SECURITY_INTERVIEW_MATRIX.md
├── SECURITY_INTERVIEW_RISK_REGISTER.md
├── SECURITY_INTERVIEW_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/interview-seguranca
├── collect-security-sources.ps1
├── generate-security-question-bank.ps1
├── validate-security-answers.ps1
├── run-security-exercises.ps1
├── run-negative-security-tests.ps1
├── run-security-mock-interview.ps1
├── generate-security-report.ps1
└── collect-security-evidence.ps1
```

Artifacts:

```text
reports/security-interview-report.yaml

contracts/security-interview-evidence.yaml
```

---

## Conceito essencial

### Segurança é gestão de risco

O objetivo é:

- reduzir probabilidade;
- reduzir impacto;
- detectar abuso;
- responder;
- recuperar.

### Autenticação não é autorização

Saber quem chamou não significa permitir qualquer ação.

### Boundary precisa validar confiança

Dados externos permanecem não confiáveis após autenticação.

### Segurança precisa de negação testada

Cenários positivos não provam proteção.

### Segredo exposto deve ser rotacionado

Apagar do arquivo não invalida o valor comprometido.

---

## Mão na massa guiada

### 1. Criar Security Interview Charter

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_CHARTER.md
```

Princípios:

```text
identity is verified;

authorization is explicit;

input remains untrusted;

least privilege is default;

secrets are rotated;

negative tests are mandatory;

incidents are observable;

DevOps cloud belongs to lesson 711.
```

---

## Fundamentos

### 2. Criar Security Foundations Question Bank

Arquivo:

```text
docs/interview-seguranca/SECURITY_FOUNDATIONS_QUESTION_BANK.md
```

---

### 3. Explicar confidencialidade

Dados são acessados apenas por quem possui autorização.

---

### 4. Explicar integridade

Dados e comandos não são alterados indevidamente.

---

### 5. Explicar disponibilidade

O serviço permanece acessível dentro dos objetivos definidos.

---

### 6. Explicar autenticidade

A identidade ou origem pode ser verificada.

---

### 7. Explicar não repúdio com cuidado

Evidências criptográficas e auditoria podem dificultar negação, mas contexto jurídico e gestão de chaves importam.

---

### 8. Explicar defesa em profundidade

Múltiplos controles reduzem dependência de uma única barreira.

---

### 9. Explicar least privilege

Usuário, serviço, workflow e banco recebem apenas permissões necessárias.

---

### 10. Explicar secure by default

Configuração inicial deve negar ou limitar acesso.

---

### 11. Explicar fail secure

Em falha de autorização, a aplicação deve negar, não liberar.

---

## Threat modeling

### 12. Criar Threat Modeling Question Bank

Arquivo:

```text
docs/interview-seguranca/THREAT_MODELING_QUESTION_BANK.md
```

---

### 13. Explicar asset

Algo que precisa ser protegido:

- dados;
- identidade;
- dinheiro;
- disponibilidade;
- credencial;
- reputação.

---

### 14. Explicar threat actor

Inclui:

- externo;
- interno;
- usuário legítimo abusivo;
- dependency comprometida;
- automação mal configurada.

---

### 15. Explicar attack surface

Todos os pontos de entrada e confiança:

- API;
- broker;
- banco;
- arquivos;
- pipeline;
- observabilidade;
- administração.

---

### 16. Explicar trust boundary

Ponto onde dados ou identidade atravessam níveis diferentes de confiança.

---

### 17. Explicar STRIDE

Categorias:

- spoofing;
- tampering;
- repudiation;
- information disclosure;
- denial of service;
- elevation of privilege.

---

### 18. Aplicar ao OrderFlow

Exemplo:

```text
spoofing:
token falso.

tampering:
evento alterado.

disclosure:
log com dado sensivel.

denial:
requisicoes abusivas.

elevation:
role insuficiente acessando operacao administrativa.
```

---

### 19. Priorizar ameaças

Use:

- probabilidade;
- impacto;
- exposição;
- detectabilidade;
- custo de controle.

---

### 20. Evitar checklist sem contexto

Threat modeling precisa refletir o sistema real.

---

## Autenticação

### 21. Criar Authentication Question Bank

Arquivo:

```text
docs/interview-seguranca/AUTHENTICATION_QUESTION_BANK.md
```

---

### 22. Explicar autenticação

Processo de verificar identidade ou autenticador.

---

### 23. Diferenciar fator de conhecimento

Exemplo:

- senha.

---

### 24. Diferenciar fator de posse

Exemplo:

- dispositivo;
- token físico.

---

### 25. Diferenciar fator de inerência

Exemplo:

- biometria.

---

### 26. Explicar MFA

Combina fatores independentes.

---

### 27. Explicar credential stuffing

Ataque usa credenciais vazadas de outros serviços.

Mitigações:

- MFA;
- rate limiting;
- detecção;
- senha comprometida;
- alertas.

---

### 28. Explicar brute force

Tenta combinações repetidas.

---

### 29. Explicar lockout com cuidado

Lockout rígido pode permitir negação de serviço contra usuário.

Use backoff, limites e detecção.

---

### 30. Explicar autenticação de serviço

Pode usar:

- client credentials;
- mTLS;
- workload identity;
- credencial curta.

---

## Autorização

### 31. Criar Authorization Question Bank

Arquivo:

```text
docs/interview-seguranca/AUTHORIZATION_QUESTION_BANK.md
```

---

### 32. Explicar autorização

Decide se uma identidade pode executar uma ação sobre um recurso em um contexto.

---

### 33. Comparar RBAC

Role-Based Access Control usa papéis.

---

### 34. Comparar ABAC

Attribute-Based Access Control usa atributos:

- usuário;
- recurso;
- contexto;
- ambiente.

---

### 35. Explicar scope

Representa permissão delegada no contexto OAuth2.

---

### 36. Explicar role

Representa responsabilidade ou grupo organizacional.

---

### 37. Defender autorização no servidor

Ocultar botão no frontend não protege endpoint.

---

### 38. Explicar autorização por objeto

Além de poder executar a ação, o usuário precisa acessar aquele recurso específico.

---

### 39. Explicar deny by default

Operação sem regra explícita permanece negada.

---

### 40. Explicar policy centralizada

Regras consistentes reduzem decisões espalhadas.

---

## OAuth2 e OpenID Connect

### 41. Criar OAuth2 OIDC Question Bank

Arquivo:

```text
docs/interview-seguranca/OAUTH2_OIDC_QUESTION_BANK.md
```

---

### 42. Explicar OAuth2

Framework de autorização delegada.

Não é protocolo de login por si só.

---

### 43. Explicar OpenID Connect

Camada de identidade sobre OAuth2.

---

### 44. Explicar Resource Owner

Entidade que concede acesso.

---

### 45. Explicar Client

Aplicação que solicita acesso.

---

### 46. Explicar Authorization Server

Emite tokens após aplicar política.

---

### 47. Explicar Resource Server

API que valida token e protege recursos.

---

### 48. Explicar Authorization Code com PKCE

Fluxo adequado para aplicações públicas modernas.

PKCE reduz risco de interceptação do código.

---

### 49. Explicar Client Credentials

Adequado para comunicação serviço a serviço sem usuário final.

---

### 50. Explicar refresh token

Permite obter novo access token.

Precisa de proteção e rotação quando adotada.

---

### 51. Explicar access token curto

Reduz janela de impacto.

---

### 52. Não usar implicit flow como padrão moderno

---

## JWT e sessões

### 53. Criar JWT Session Question Bank

Arquivo:

```text
docs/interview-seguranca/JWT_SESSION_QUESTION_BANK.md
```

---

### 54. Explicar JWT

Formato compacto com claims, header e assinatura.

---

### 55. Explicar que JWT não é criptografado por padrão

Payload pode ser lido.

Não coloque secret ou dado sensível desnecessário.

---

### 56. Explicar assinatura

Garante integridade e autenticidade do emissor quando a chave é confiável.

---

### 57. Explicar issuer

Identifica emissor esperado.

---

### 58. Explicar audience

Identifica destinatário pretendido.

---

### 59. Explicar expiration

Limita validade.

---

### 60. Explicar not before

Define quando o token pode começar a valer.

---

### 61. Explicar clock skew

Pequena tolerância pode ser necessária.

---

### 62. Explicar key rotation

Resource Server precisa aceitar chave atual e transição segura via JWKS ou política equivalente.

---

### 63. Comparar sessão server-side

Sessão mantém estado no servidor.

Facilita revogação, mas exige armazenamento e escalabilidade.

---

### 64. Comparar JWT

JWT permite validação distribuída.

Traz desafios de revogação, tamanho e rotação.

---

### 65. Explicar logout

Invalidar apenas no cliente não revoga token já emitido.

---

## Senhas e criptografia

### 66. Criar Password Cryptography Question Bank

Arquivo:

```text
docs/interview-seguranca/PASSWORD_CRYPTOGRAPHY_QUESTION_BANK.md
```

---

### 67. Explicar hash de senha

Use algoritmo adaptativo e resistente a brute force.

Exemplos:

- Argon2;
- bcrypt;
- scrypt;
- PBKDF2 conforme contexto.

---

### 68. Explicar salt

Valor único por senha impede tabelas pré-computadas simples.

---

### 69. Explicar pepper

Segredo adicional gerenciado fora do banco.

---

### 70. Explicar por que não SHA simples

Algoritmos rápidos facilitam brute force.

---

### 71. Explicar criptografia simétrica

Mesma chave para cifrar e decifrar.

---

### 72. Explicar criptografia assimétrica

Par de chaves pública e privada.

---

### 73. Explicar TLS

Protege dados em trânsito e autentica endpoint conforme certificados.

---

### 74. Explicar criptografia em repouso

Protege mídia e backups, mas não substitui autorização.

---

### 75. Explicar envelope encryption

Data key cifra dados e key encryption key protege a data key.

---

## Secrets e chaves

### 76. Criar Secrets Key Management

Arquivo:

```text
docs/interview-seguranca/SECRETS_KEY_MANAGEMENT.md
```

---

### 77. Definir secret

Exemplos:

- senha;
- token;
- private key;
- API key;
- connection credential.

---

### 78. Não versionar secret

Nem em source, docs, examples, reports ou screenshots.

---

### 79. Explicar injeção em runtime

Use:

- secret manager;
- environment controlado;
- volume seguro;
- workload identity.

---

### 80. Explicar rotação

Inclui:

- nova credencial;
- período de transição;
- atualização de consumidores;
- revogação;
- auditoria.

---

### 81. Explicar blast radius

Escopo menor reduz impacto do vazamento.

---

### 82. Explicar secret scanning

Detecta padrões antes e depois do commit.

---

### 83. Explicar que secret encontrado deve ser rotacionado

---

## OWASP

### 84. Criar OWASP Question Bank

Arquivo:

```text
docs/interview-seguranca/OWASP_QUESTION_BANK.md
```

---

### 85. Explicar broken access control

Usuário acessa ação ou recurso sem autorização adequada.

---

### 86. Explicar cryptographic failures

Uso ausente ou incorreto de criptografia.

---

### 87. Explicar injection

Entrada não confiável altera comando ou interpretação.

---

### 88. Explicar insecure design

Falha está no desenho, não apenas na implementação.

---

### 89. Explicar security misconfiguration

Defaults inseguros, endpoints expostos ou permissões excessivas.

---

### 90. Explicar vulnerable components

Dependency desatualizada ou comprometida.

---

### 91. Explicar identification and authentication failures

Fluxos de identidade frágeis.

---

### 92. Explicar software and data integrity failures

Pipelines, updates e artifacts sem confiança.

---

### 93. Explicar logging and monitoring failures

Ataque ocorre sem detecção ou investigação.

---

### 94. Explicar SSRF

Servidor faz request para destino controlado pelo atacante.

---

## Injection

### 95. Criar Injection Question Bank

Arquivo:

```text
docs/interview-seguranca/INJECTION_QUESTION_BANK.md
```

---

### 96. Explicar SQL injection

Entrada altera estrutura SQL.

---

### 97. Defender prepared statement

Separa comando e valor.

---

### 98. Explicar que validação sozinha não substitui parametrização

---

### 99. Explicar command injection

Entrada chega a shell ou processo.

---

### 100. Evitar concatenar comandos

Use APIs estruturadas e allowlists.

---

### 101. Explicar log injection

Entrada com quebra de linha pode forjar eventos.

---

### 102. Sanitizar estrutura do log

---

## XSS, CSRF e CORS

### 103. Criar XSS CSRF CORS Question Bank

Arquivo:

```text
docs/interview-seguranca/XSS_CSRF_CORS_QUESTION_BANK.md
```

---

### 104. Explicar XSS

Conteúdo não confiável executa no navegador.

---

### 105. Explicar output encoding

A saída deve ser codificada para o contexto:

- HTML;
- atributo;
- JavaScript;
- URL.

---

### 106. Explicar CSP

Content Security Policy reduz impacto, mas não substitui correção.

---

### 107. Explicar CSRF

Navegador envia credencial automaticamente em request induzido.

---

### 108. Explicar proteção CSRF

- token anti-CSRF;
- SameSite;
- origem;
- desenho de autenticação.

---

### 109. Explicar quando API bearer token sofre menos com CSRF

Quando token não é enviado automaticamente pelo navegador.

---

### 110. Explicar CORS

Política de navegador sobre leitura de respostas entre origens.

---

### 111. Explicar que CORS não protege API contra curl ou backend malicioso

---

### 112. Evitar wildcard com credenciais

---

## SSRF, arquivos e paths

### 113. Criar SSRF File Path Question Bank

Arquivo:

```text
docs/interview-seguranca/SSRF_FILE_PATH_QUESTION_BANK.md
```

---

### 114. Mitigar SSRF

Use:

- allowlist;
- DNS e IP validation;
- bloqueio de metadata endpoints;
- timeout;
- rede restrita;
- redirects controlados.

---

### 115. Explicar path traversal

Entrada como:

```text
../../
```

tenta sair do diretório permitido.

---

### 116. Normalizar e validar path

Use diretório base e verifique resultado final.

---

### 117. Explicar file upload

Valide:

- tamanho;
- tipo real;
- extensão;
- nome;
- armazenamento;
- malware;
- acesso.

---

### 118. Não confiar apenas em Content-Type

---

### 119. Armazenar fora da raiz executável

---

## IDOR e mass assignment

### 120. Criar IDOR Mass Assignment Question Bank

Arquivo:

```text
docs/interview-seguranca/IDOR_MASS_ASSIGNMENT_QUESTION_BANK.md
```

---

### 121. Explicar IDOR

Usuário altera identificador e acessa recurso de outro contexto.

---

### 122. Mitigar IDOR

Autorize por recurso e identidade.

---

### 123. Explicar `404` cross-tenant

Evita revelar existência do recurso.

---

### 124. Explicar mass assignment

Binding automático permite alterar campos não autorizados.

---

### 125. Mitigar mass assignment

Use DTOs explícitos e allowlist de campos.

---

### 126. Evitar entity como request body

---

### 127. Explicar over-posting

Cliente envia atributos extras aceitos indevidamente.

---

## Tenant isolation

### 128. Criar Tenant Isolation Question Bank

Arquivo:

```text
docs/interview-seguranca/TENANT_ISOLATION_QUESTION_BANK.md
```

---

### 129. Explicar tenant autenticado

Tenant deve vir de contexto confiável, não de campo livre do body.

---

### 130. Propagar tenant

Atravessa:

- token;
- application context;
- repository;
- event;
- trace;
- audit.

---

### 131. Proteger banco

Use:

- predicados;
- constraints;
- índices;
- testes;
- row-level security quando aplicável.

---

### 132. Proteger mensageria

Evento precisa transportar tenant de forma validada.

---

### 133. Testar cross-tenant

Cenários negativos são obrigatórios.

---

### 134. Evitar cache sem tenant na chave

---

### 135. Tratar vazamento cross-tenant como incidente crítico

---

## Headers

### 136. Criar Security Headers Question Bank

Arquivo:

```text
docs/interview-seguranca/SECURITY_HEADERS_QUESTION_BANK.md
```

---

### 137. Explicar HSTS

Instrui navegador a usar HTTPS.

---

### 138. Explicar Content-Security-Policy

Controla fontes permitidas no navegador.

---

### 139. Explicar X-Content-Type-Options

Reduz MIME sniffing.

---

### 140. Explicar frame-ancestors

Protege contra embedding não autorizado.

---

### 141. Explicar Referrer-Policy

Controla informação enviada no referer.

---

### 142. Aplicar apenas headers relevantes ao tipo de aplicação

---

## Rate limiting e abuso

### 143. Criar Rate Limiting Abuse Question Bank

Arquivo:

```text
docs/interview-seguranca/RATE_LIMITING_ABUSE_QUESTION_BANK.md
```

---

### 144. Explicar rate limiting

Limita requisições por dimensão:

- IP;
- usuário;
- client;
- tenant;
- endpoint.

---

### 145. Explicar token bucket

Permite rajada controlada.

---

### 146. Explicar limite distribuído

Precisa de estado compartilhado ou coordenação.

---

### 147. Explicar resposta `429`

Inclua retry guidance quando apropriado.

---

### 148. Explicar abuso de custo

Mesmo request válido pode consumir recurso excessivo.

---

### 149. Combinar com quotas e circuit breaker

---

## Logging e auditoria

### 150. Criar Security Logging Audit

Arquivo:

```text
docs/interview-seguranca/SECURITY_LOGGING_AUDIT.md
```

---

### 151. Registrar eventos relevantes

- login;
- falha;
- autorização negada;
- alteração sensível;
- rotação;
- administração;
- replay;
- incident action.

---

### 152. Não registrar

- senha;
- token completo;
- private key;
- secret;
- dado pessoal desnecessário;
- payload sensível integral.

---

### 153. Usar identificadores seguros

Correlation ID, trace ID, user ID controlado e tenant sanitizado.

---

### 154. Proteger integridade do audit

---

### 155. Explicar retenção

Retenção depende de risco, compliance e custo.

---

### 156. Explicar alertas

Múltiplas falhas, cross-tenant e secret exposure precisam de sinais.

---

## Testes de segurança

### 157. Criar Security Testing Guide

Arquivo:

```text
docs/interview-seguranca/SECURITY_TESTING_GUIDE.md
```

---

### 158. Testar autenticação ausente

Esperar `401`.

---

### 159. Testar token inválido

- assinatura;
- issuer;
- audience;
- expiração;
- not before.

---

### 160. Testar autorização insuficiente

Esperar `403` ou resposta definida pela policy.

---

### 161. Testar IDOR

Trocar resource ID.

---

### 162. Testar tenant

Trocar tenant no body, path, header e token.

---

### 163. Testar mass assignment

Enviar campo administrativo.

---

### 164. Testar injection

Use payloads seguros em ambiente de teste.

---

### 165. Testar rate limiting

---

### 166. Testar logs

Confirmar ausência de secrets.

---

### 167. Testar dependency e secret scan

---

### 168. Explicar SAST, DAST e SCA

SAST:

- analisa código.

DAST:

- testa aplicação executando.

SCA:

- analisa componentes e dependências.

---

## Incident response

### 169. Criar Security Incident Response

Arquivo:

```text
docs/interview-seguranca/SECURITY_INCIDENT_RESPONSE.md
```

---

### 170. Estruturar resposta

1. detectar;
2. classificar;
3. conter;
4. preservar evidence;
5. erradicar;
6. recuperar;
7. comunicar;
8. aprender.

---

### 171. Cenário: token vazado

Ações:

- revogar ou bloquear;
- rotacionar;
- identificar uso;
- reduzir validade;
- revisar origem;
- comunicar;
- prevenir repetição.

---

### 172. Cenário: secret em Git

- rotacionar;
- remover;
- reescrever histórico quando necessário;
- invalidar caches;
- revisar logs;
- escanear forks;
- registrar incidente.

---

### 173. Cenário: cross-tenant access

- bloquear fluxo;
- preservar evidence;
- identificar dados;
- corrigir;
- notificar conforme obrigação;
- revisar todos os boundaries.

---

### 174. Não destruir evidence durante contenção

---

## Exercícios

### 175. Criar Security Coding Exercises

Arquivo:

```text
docs/interview-seguranca/SECURITY_CODING_EXERCISES.md
```

---

### 176. Exercício 1: validar claims JWT

Valide:

- issuer;
- audience;
- expiration;
- scope;
- tenant.

---

### 177. Exercício 2: autorização por recurso

Proteja consulta de pedido por tenant e usuário.

---

### 178. Exercício 3: mass assignment

Substitua entity binding por command DTO.

---

### 179. Exercício 4: SQL injection

Corrija query concatenada com parâmetros.

---

### 180. Exercício 5: SSRF

Implemente allowlist de provider host.

---

### 181. Exercício 6: file upload

Valide tamanho, tipo e nome seguro.

---

### 182. Exercício 7: rate limiting

Modele limite por tenant e endpoint.

---

### 183. Exercício 8: secret rotation

Planeje duas chaves durante transição.

---

### 184. Exercício 9: audit log

Registre negação sem vazar token.

---

### 185. Exercício 10: threat model

Aplique STRIDE ao endpoint de cancelamento.

---

## Simulação

### 186. Criar Mock Security Interview

Arquivo:

```text
docs/interview-seguranca/MOCK_SECURITY_INTERVIEW.md
```

Duração:

```text
80 a 95 minutos.
```

---

### 187. Estruturar simulação

1. fundamentos;
2. threat modeling;
3. autenticação;
4. autorização;
5. OAuth2;
6. JWT;
7. senha e crypto;
8. secrets;
9. OWASP;
10. injection;
11. browser security;
12. SSRF;
13. IDOR;
14. tenant;
15. rate limiting;
16. logs;
17. testes;
18. incident;
19. exercício.

---

### 188. Criar follow-ups

Exemplos:

- e se o token estiver assinado, mas com audience errada?
- e se o tenant vier no body?
- e se o secret já estiver no histórico?
- e se o provider redirecionar?
- e se o usuário puder tentar muitos IDs?
- e se o log central for comprometido?
- e se a rotação quebrar consumidores antigos?

---

### 189. Gravar a entrevista

---

### 190. Criar Security Interview Scorecard

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_SCORECARD.md
```

Critérios:

- fundamentos;
- threat modeling;
- autenticação;
- autorização;
- OAuth2;
- JWT;
- crypto;
- secrets;
- OWASP;
- injection;
- browser security;
- SSRF;
- IDOR;
- tenant;
- abuse;
- logging;
- testing;
- incident response;
- comunicação.

---

### 191. Criar Review Checklist

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_REVIEW_CHECKLIST.md
```

Perguntas:

- separei autenticação e autorização?
- validei issuer e audience?
- tratei objeto e tenant?
- expliquei least privilege?
- reconheci impacto?
- propus teste negativo?
- protegi logs?
- rotacionei secret?
- admiti limite?
- evitei antecipar DevOps cloud?

---

### 192. Criar Matrix

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_MATRIX.md
```

Colunas:

- tema;
- pergunta;
- resposta curta;
- ameaça;
- controle;
- evidence;
- score;
- revisão.

---

### 193. Criar Risk Register

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_RISK_REGISTER.md
```

Riscos:

```text
JWT tratado como autorizacao completa;

CORS tratado como controle de API;

secret apagado sem rotacao;

tenant vindo do body;

log com token;

OWASP decorado;

controle sem teste negativo;

incidente sem evidence;

DevOps cloud antecipado;

feedback nao registrado.
```

---

### 194. Criar Traceability

Arquivo:

```text
docs/interview-seguranca/SECURITY_INTERVIEW_TRACEABILITY.md
```

Exemplo:

```text
tenant isolation
-> JWT claim
-> application context
-> repository predicate
-> cross-tenant test.

JWT validation
-> issuer
-> audience
-> JWKS
-> negative tests.

secret protection
-> scanner
-> runtime injection
-> rotation policy
-> incident runbook.
```

---

### 195. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-seguranca/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 710 define:

- security foundations;
- confidentiality;
- integrity;
- availability;
- least privilege;
- threat modeling;
- authentication;
- authorization;
- OAuth2;
- OpenID Connect;
- JWT;
- sessions;
- passwords;
- cryptography;
- secrets;
- OWASP;
- injection;
- XSS;
- CSRF;
- CORS;
- SSRF;
- path traversal;
- file upload;
- IDOR;
- mass assignment;
- tenant isolation;
- headers;
- rate limiting;
- logging;
- negative tests;
- incident response;
- mock interview.

A aula 711 define:

- Docker;
- images;
- containers;
- registries;
- CI CD;
- GitHub Actions;
- artifacts;
- SBOM;
- pipelines;
- Kubernetes;
- cloud;
- networking;
- IAM;
- deployment;
- scaling;
- observability;
- cost;
- rollback;
- infrastructure troubleshooting;
- DevOps cloud interview simulation.

Nenhuma entrevista DevOps cloud
e executada nesta aula.
```

---

## Validação final

### 196. Criar report

Arquivo:

```text
reports/security-interview-report.yaml
```

Exemplo:

```yaml
securityInterview:
  questionBank:
    total:
      measured
    answered:
      measured

  scores:
    foundations:
      measured
    threatModeling:
      measured
    authentication:
      measured
    authorization:
      measured
    OAuth2:
      measured
    JWT:
      measured
    secrets:
      measured
    OWASP:
      measured
    tenantIsolation:
      measured
    testing:
      measured
    incidentResponse:
      measured

  integrity:
    unsupportedAnswers:
      0
    contradictions:
      0
    sensitiveDataLeaks:
      0

  mockInterview:
    completed:
      true
    durationMinutes:
      measured

  DevOpsCloudInterview:
    completed:
      false

  gate:
    PASS
```

---

### 197. Criar evidence

Arquivo:

```text
contracts/security-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- foundation question count;
- threat modeling question count;
- authentication question count;
- authorization question count;
- OAuth2 question count;
- JWT question count;
- password question count;
- cryptography question count;
- secret question count;
- OWASP question count;
- injection question count;
- browser security question count;
- SSRF question count;
- IDOR question count;
- tenant question count;
- rate limiting question count;
- logging question count;
- testing question count;
- incident question count;
- coding exercise count;
- completed exercise count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported answer count;
- contradiction count;
- sensitive leak count;
- admitted uncertainty count;
- DevOps cloud interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 198. Criar gate

Status:

```text
PASS;

FAIL_SECURITY_FOUNDATIONS;

FAIL_THREAT_MODELING;

FAIL_AUTHENTICATION;

FAIL_AUTHORIZATION;

FAIL_OAUTH2;

FAIL_OIDC;

FAIL_JWT;

FAIL_SESSION;

FAIL_PASSWORD_SECURITY;

FAIL_CRYPTOGRAPHY;

FAIL_SECRET_MANAGEMENT;

FAIL_OWASP;

FAIL_INJECTION;

FAIL_XSS;

FAIL_CSRF;

FAIL_CORS;

FAIL_SSRF;

FAIL_PATH_TRAVERSAL;

FAIL_FILE_UPLOAD;

FAIL_IDOR;

FAIL_MASS_ASSIGNMENT;

FAIL_TENANT_ISOLATION;

FAIL_SECURITY_HEADERS;

FAIL_RATE_LIMITING;

FAIL_SECURITY_LOGGING;

FAIL_SECURITY_TESTING;

FAIL_INCIDENT_RESPONSE;

FAIL_CODING_EXERCISE;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_ANSWER;

FAIL_CONTRADICTION;

FAIL_SENSITIVE_DATA_LEAK;

FAIL_DEVOPS_CLOUD_ANTICIPATION;

INCONCLUSIVE.
```

---

### 199. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-seguranca\collect-security-sources.ps1

.\scripts\interview-seguranca\generate-security-question-bank.ps1

.\scripts\interview-seguranca\validate-security-answers.ps1

.\scripts\interview-seguranca\run-security-exercises.ps1

.\scripts\interview-seguranca\run-negative-security-tests.ps1

.\scripts\interview-seguranca\collect-security-evidence.ps1
```

---

### 200. Executar duas rodadas

Rodada 1:

```text
conceitos,
identidade
e autorizacao.
```

Rodada 2:

```text
vulnerabilidades,
testes
e incident response.
```

---

### 201. Revisar gravações

Selecione:

- três respostas fortes;
- três respostas genéricas;
- dois erros de OAuth2;
- dois erros de tenant;
- um plano de melhoria.

---

### 202. Repetir o tema mais fraco

---

### 203. Encerrar o laboratório

Confirme:

- Charter;
- fundamentos;
- threat modeling;
- autenticação;
- autorização;
- OAuth2;
- OIDC;
- JWT;
- sessões;
- senhas;
- criptografia;
- secrets;
- OWASP;
- injection;
- XSS;
- CSRF;
- CORS;
- SSRF;
- paths;
- uploads;
- IDOR;
- mass assignment;
- tenant;
- headers;
- rate limiting;
- logs;
- testes;
- incident response;
- exercises;
- mock;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 711 preservada.

---

## Entendendo o que foi feito

### Segurança deixou de ser uma biblioteca

Identidade, autorização, threats e resposta passaram a formar um sistema.

### OAuth2 ganhou papéis claros

Client, Authorization Server e Resource Server deixaram de ser confundidos.

### JWT ganhou limites

Assinatura, issuer, audience, expiração e rotação foram tratados.

### Tenant isolation ganhou profundidade

Token, aplicação, banco, eventos, cache e testes passaram a cooperar.

### OWASP ganhou contexto

Categorias foram ligadas a boundaries reais.

### Secrets ganharam lifecycle

Criação, armazenamento, injeção, rotação e revogação foram considerados.

### Testes negativos ganharam prioridade

Negação passou a ser evidence.

### Incidentes ganharam método

Detecção, contenção, recuperação e aprendizado foram praticados.

---

## Erros comuns importantes

### Confundir autenticação e autorização

Identidade não concede qualquer ação.

### Validar apenas assinatura JWT

Issuer, audience e tempo também importam.

### Colocar tenant no body

O cliente pode alterar o contexto.

### Usar CORS como firewall

Clientes fora do navegador ignoram CORS.

### Apagar secret sem rotacionar

O valor comprometido continua válido.

### Registrar token completo

O log vira vazamento.

### Usar blacklist de URL para SSRF

Bypasses são comuns; prefira allowlist e rede restrita.

### Testar somente sucesso

Proteções não são comprovadas.

### Decorar OWASP

A entrevista pede aplicação ao sistema.

### Antecipar DevOps cloud

Essa etapa pertence à aula 711.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-seguranca\generate-security-question-bank.ps1
```

### Validar respostas

```powershell
.\scripts\interview-seguranca\validate-security-answers.ps1
```

### Executar testes negativos

```powershell
.\scripts\interview-seguranca\run-negative-security-tests.ps1
```

### Coletar evidence

```powershell
.\scripts\interview-seguranca\collect-security-evidence.ps1
```

---

## Exercício principal

Realize uma entrevista simulada de 90 minutos.

Inclua:

1. confidencialidade;
2. integridade;
3. disponibilidade;
4. least privilege;
5. threat modeling;
6. STRIDE;
7. autenticação;
8. autorização;
9. RBAC;
10. ABAC;
11. OAuth2;
12. OIDC;
13. Resource Server;
14. Authorization Code;
15. Client Credentials;
16. JWT;
17. issuer;
18. audience;
19. expiração;
20. rotação;
21. sessão;
22. senha;
23. salt;
24. criptografia;
25. TLS;
26. secrets;
27. OWASP;
28. SQL injection;
29. XSS;
30. CSRF;
31. CORS;
32. SSRF;
33. path traversal;
34. upload;
35. IDOR;
36. mass assignment;
37. tenant isolation;
38. headers;
39. rate limiting;
40. logs;
41. testes negativos;
42. secret incident;
43. cross-tenant incident;
44. exercício;
45. feedback;
46. plano de melhoria.

Não realize a entrevista DevOps cloud.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 709 e ponte para a aula 711 foram preservadas;
- Security Interview Charter foi criado;
- fundamentos foram explicados;
- confidencialidade, integridade, disponibilidade e autenticidade foram tratadas;
- defesa em profundidade foi explicada;
- least privilege foi explicado;
- secure by default foi explicado;
- fail secure foi explicado;
- Threat Modeling Question Bank foi criado;
- assets, actors, surface e boundaries foram explicados;
- STRIDE foi explicado;
- ameaças foram aplicadas ao OrderFlow;
- priorização foi explicada;
- checklist genérico foi evitado;
- Authentication Question Bank foi criado;
- fatores foram explicados;
- MFA foi explicado;
- credential stuffing foi explicado;
- brute force foi explicado;
- lockout foi tratado;
- autenticação de serviço foi explicada;
- Authorization Question Bank foi criado;
- autorização foi explicada;
- RBAC e ABAC foram comparados;
- scope e role foram explicados;
- servidor foi definido como authority;
- autorização por objeto foi explicada;
- deny by default foi explicado;
- policy centralizada foi explicada;
- OAuth2 OIDC Question Bank foi criado;
- OAuth2 e OIDC foram diferenciados;
- papéis foram explicados;
- Authorization Code com PKCE foi explicado;
- Client Credentials foi explicado;
- refresh e access token foram explicados;
- implicit flow não foi recomendado;
- JWT Session Question Bank foi criado;
- estrutura JWT foi explicada;
- payload não criptografado foi explicado;
- assinatura foi explicada;
- issuer, audience, expiration e not before foram explicados;
- clock skew foi explicado;
- key rotation foi explicada;
- sessão e JWT foram comparados;
- logout foi explicado;
- Password Cryptography Question Bank foi criado;
- hash adaptativo foi explicado;
- salt e pepper foram explicados;
- SHA simples foi rejeitado;
- criptografia simétrica e assimétrica foram explicadas;
- TLS foi explicado;
- criptografia em repouso foi explicada;
- envelope encryption foi explicada;
- Secrets Key Management foi criado;
- secrets foram definidos;
- versionamento de secrets foi proibido;
- injeção em runtime foi explicada;
- rotação foi explicada;
- blast radius foi explicado;
- secret scanning foi explicado;
- rotação após exposição foi exigida;
- OWASP Question Bank foi criado;
- categorias relevantes foram explicadas;
- Injection Question Bank foi criado;
- SQL, command e log injection foram explicados;
- prepared statements foram defendidos;
- XSS CSRF CORS Question Bank foi criado;
- output encoding foi explicado;
- CSP foi explicada;
- CSRF foi explicado;
- proteção CSRF foi explicada;
- bearer token foi contextualizado;
- CORS foi explicado;
- limites de CORS foram explicados;
- wildcard com credentials foi evitado;
- SSRF File Path Question Bank foi criado;
- mitigação SSRF foi explicada;
- path traversal foi explicado;
- normalização de path foi explicada;
- file upload foi tratado;
- Content-Type não foi tratado como prova;
- armazenamento seguro foi explicado;
- IDOR Mass Assignment Question Bank foi criado;
- IDOR foi explicado;
- autorização por recurso foi explicada;
- `404` cross-tenant foi explicado;
- mass assignment foi explicado;
- DTO explícito foi defendido;
- entity binding foi evitado;
- over-posting foi explicado;
- Tenant Isolation Question Bank foi criado;
- tenant autenticado foi explicado;
- propagação foi explicada;
- proteção no banco foi explicada;
- proteção na mensageria foi explicada;
- testes cross-tenant foram criados;
- cache com tenant foi explicado;
- vazamento foi classificado como crítico;
- Security Headers Question Bank foi criado;
- HSTS, CSP, nosniff, frame-ancestors e referrer policy foram explicados;
- headers foram aplicados conforme contexto;
- Rate Limiting Abuse Question Bank foi criado;
- dimensões de rate limiting foram explicadas;
- token bucket foi explicado;
- limite distribuído foi explicado;
- `429` foi explicado;
- abuso de custo foi tratado;
- quotas e circuit breaker foram relacionados;
- Security Logging Audit foi criado;
- eventos auditáveis foram definidos;
- dados proibidos em logs foram definidos;
- identificadores seguros foram usados;
- integridade do audit foi tratada;
- retenção foi explicada;
- alertas foram explicados;
- Security Testing Guide foi criado;
- autenticação ausente e token inválido foram testados;
- autorização insuficiente foi testada;
- IDOR, tenant e mass assignment foram testados;
- injection e rate limiting foram testados;
- logs foram testados;
- SAST, DAST e SCA foram explicados;
- Security Incident Response foi criado;
- ciclo de incidente foi explicado;
- vazamento de token foi tratado;
- secret no Git foi tratado;
- cross-tenant foi tratado;
- evidence foi preservada;
- Security Coding Exercises foi criado;
- dez exercícios foram preparados;
- Mock Security Interview foi criado;
- simulação foi estruturada;
- follow-ups foram criados;
- entrevista foi gravada;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 711 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas rodadas foram executadas;
- gravações foram revisadas;
- tema fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- entrevista DevOps cloud não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-seguranca\validate-security-answers.ps1

.\scripts\interview-seguranca\run-negative-security-tests.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-seguranca `
  scripts/interview-seguranca `
  reports/security-interview-report.yaml `
  contracts/security-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-secret|realTenant|realCustomer|DevOps-cloud-mock"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare security interview"
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

- token;
- chave;
- secret;
- dado real;
- simulação detalhada da aula 711.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista de segurança.

Você estruturou:

```text
security foundations;

threat modeling;

authentication;

authorization;

OAuth2;

OpenID Connect;

JWT;

sessions;

passwords;

cryptography;

secrets;

OWASP;

injection;

XSS;

CSRF;

CORS;

SSRF;

path traversal;

file upload;

IDOR;

mass assignment;

tenant isolation;

security headers;

rate limiting;

logging;

negative testing;

incident response;

coding exercises;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue discutir segurança como risco, boundary, autorização, controle, detecção e resposta.

A próxima aula será:

```text
711 - M20.41 - Entrevista DevOps cloud
```

Nela, você treinará containers, Docker, CI/CD, artifacts, registries, Kubernetes, cloud, networking, IAM, deploy, rollback, scaling, observabilidade, custos e troubleshooting de infraestrutura.

Nenhuma entrevista DevOps cloud foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei fundamentos.
- [ ] Revisei threat modeling.
- [ ] Revisei autenticação.
- [ ] Revisei autorização.
- [ ] Revisei OAuth2 e OIDC.
- [ ] Revisei JWT e sessões.
- [ ] Revisei senhas e criptografia.
- [ ] Revisei secrets.
- [ ] Revisei OWASP.
- [ ] Revisei injection.
- [ ] Revisei browser security.
- [ ] Revisei SSRF e arquivos.
- [ ] Revisei IDOR e tenant.
- [ ] Revisei testes e incidentes.
- [ ] Preservei DevOps cloud para a aula 711.

---

## Troubleshooting adicional

### Confundo OAuth2 e login

OAuth2 autoriza; OIDC adiciona identidade.

### Token assinado foi rejeitado

Revise issuer, audience, tempo e chave.

### CORS bloqueou navegador, mas não curl

Esse é o comportamento esperado.

### Secret apareceu no log

Trate como exposição e rotacione.

### Tenant é recebido no header

Valide se o header vem de boundary confiável.

### Rate limiting bloqueia usuários legítimos

Revise dimensões, burst e quotas.

### DAST encontrou endpoint vulnerável

Reproduza, classifique, corrija e crie regressão.

### Audit possui dado pessoal demais

Aplique minimização.

### Não sei responder sobre criptografia avançada

Declare limite e explique como consultaria especialista.

### Quero estudar cloud agora

Essa etapa pertence à aula 711.

---

## Perguntas de revisão

1. Autenticação e autorização são iguais?
2. JWT é criptografado por padrão?
3. Assinatura valida audience?
4. Tenant deve vir do body?
5. CORS protege contra curl?
6. Por que senha usa hash lento?
7. O que salt evita?
8. Apagar secret basta?
9. O que least privilege reduz?
10. O que STRIDE organiza?
11. Prepared statement substitui autorização?
12. CSRF depende de credencial automática?
13. CSP corrige todo XSS?
14. Como mitigar SSRF?
15. O que é IDOR?
16. Como evitar mass assignment?
17. Por que testar negação?
18. O que nunca registrar?
19. O que fazer com token vazado?
20. Por que preservar evidence?
21. O que scorecard mede?
22. O que a aula 711 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Não.
4. Não.
5. Não.
6. Dificultar brute force.
7. Pré-computação.
8. Não.
9. Impacto.
10. Ameaças.
11. Não.
12. Sim.
13. Não.
14. Allowlist e rede.
15. Acesso por identificador sem autorização.
16. DTO explícito.
17. Provar proteção.
18. Secrets e tokens.
19. Revogar e rotacionar.
20. Investigação.
21. Conhecimento e resposta.
22. Entrevista DevOps cloud.
23. DevOps e cloud.
24. Entrevista DevOps cloud.
25. Identificar risco, aplicar controle e provar negação.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 710 - M20.40 - Entrevista seguranca

- Continuei após Entrevista SQL banco.
- Criei Security Interview Charter.
- Criei Security Foundations Question Bank.
- Revisei confidencialidade, integridade, disponibilidade e autenticidade.
- Revisei defesa em profundidade, least privilege e secure defaults.
- Criei Threat Modeling Question Bank.
- Revisei assets, actors, attack surface, boundaries e STRIDE.
- Apliquei ameaças ao OrderFlow.
- Criei Authentication Question Bank.
- Revisei fatores, MFA, brute force, credential stuffing e service identity.
- Criei Authorization Question Bank.
- Revisei RBAC, ABAC, scopes, roles, object authorization e deny by default.
- Criei OAuth2 OIDC Question Bank.
- Revisei Authorization Server, Resource Server, Authorization Code, PKCE e Client Credentials.
- Criei JWT Session Question Bank.
- Revisei assinatura, issuer, audience, expiração, rotação, sessão e logout.
- Criei Password Cryptography Question Bank.
- Revisei hash adaptativo, salt, pepper, TLS e criptografia.
- Criei Secrets Key Management.
- Revisei runtime injection, rotação, blast radius e scanning.
- Criei OWASP Question Bank.
- Criei Injection Question Bank.
- Revisei SQL, command e log injection.
- Criei XSS CSRF CORS Question Bank.
- Revisei output encoding, CSP, CSRF, SameSite e limites de CORS.
- Criei SSRF File Path Question Bank.
- Revisei allowlist, path traversal e uploads.
- Criei IDOR Mass Assignment Question Bank.
- Revisei resource authorization, `404`, DTOs e over-posting.
- Criei Tenant Isolation Question Bank.
- Revisei token, aplicação, banco, eventos, cache e testes cross-tenant.
- Criei Security Headers Question Bank.
- Revisei HSTS, CSP, nosniff, frame e referrer.
- Criei Rate Limiting Abuse Question Bank.
- Revisei token bucket, limites distribuídos, quotas e `429`.
- Criei Security Logging Audit.
- Revisei eventos, sanitização, retenção e alertas.
- Criei Security Testing Guide.
- Revisei testes negativos, SAST, DAST e SCA.
- Criei Security Incident Response.
- Revisei token leak, secret no Git e cross-tenant incident.
- Criei Security Coding Exercises.
- Preparei dez exercícios.
- Criei Mock Security Interview.
- Executei duas rodadas.
- Gravei entrevistas.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 711.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o tema mais fraco.
- Não antecipei entrevista DevOps cloud.
- Próxima aula: Entrevista DevOps cloud.
```

---

## Referência técnica curta

- Authentication.
- Authorization.
- OAuth2.
- OpenID Connect.
- JWT.
- Session.
- RBAC.
- ABAC.
- Least Privilege.
- Threat Modeling.
- STRIDE.
- Password Hashing.
- Salt.
- Cryptography.
- Secret Management.
- OWASP.
- Injection.
- XSS.
- CSRF.
- CORS.
- SSRF.
- IDOR.
- Mass Assignment.
- Tenant Isolation.
- Rate Limiting.
- Audit Log.
- Incident Response.

Regra final:

```text
A entrevista de segurança do OrderFlow deve demonstrar gestão de risco e defesa verificável: foundations cobrem confidentiality, integrity, availability, authenticity, least privilege, defense in depth and secure defaults, threat modeling identifica assets, actors, attack surface, trust boundaries and STRIDE, authentication cobre factors, MFA, brute force, credential stuffing and service identity, authorization diferencia RBAC, ABAC, scopes, roles and object-level checks com deny by default, OAuth2 and OIDC explicam Authorization Server, Resource Server, Authorization Code with PKCE, Client Credentials, refresh and access tokens, JWT validation cobre signature, issuer, audience, expiration, not-before, clock skew and key rotation sem tratar payload como segredo, sessions and logout são comparados por revogação and storage, password security usa adaptive hashing, unique salts and optional pepper, cryptography cobre symmetric, asymmetric, TLS, at-rest and envelope encryption, secrets nunca são versionados e possuem runtime injection, rotation, revocation and scanning, OWASP é aplicado a broken access control, injection, insecure design, misconfiguration, vulnerable components, integrity and monitoring failures, SQL, command and log injection usam structured APIs and parameterization, XSS, CSRF and CORS são diferenciados por browser context, SSRF usa allowlists and network restriction, path traversal and upload usam canonical paths, limits and isolated storage, IDOR and mass assignment exigem resource authorization and explicit DTOs, tenant isolation atravessa token, application, repository, events, cache and audit com negative cross-tenant tests, headers and rate limits reduzem browser and abuse risks, logs evitam passwords, tokens and secrets, SAST, DAST, SCA and negative tests produzem evidence, incident response cobre detection, containment, rotation, recovery and learning, duas mock interviews geram scorecard, report and evidence, e o gate fecha security knowledge and practice enquanto Docker, CI CD, registries, Kubernetes, cloud, IAM, deploy, scaling and infrastructure troubleshooting permanecem reservados para a aula 711.
```
