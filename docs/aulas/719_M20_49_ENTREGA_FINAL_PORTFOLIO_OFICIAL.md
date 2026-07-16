# 719 - M20.49 - Entrega final portfolio

## Apresentação da aula

Na aula 718, você transformou os resultados da banca técnica em um plano de evolução pós-formação.

Você consolidou:

- scores;
- lacunas;
- prioridades;
- alvo profissional;
- roadmap de doze meses;
- planos trimestrais;
- prática deliberada;
- sistema semanal;
- backlog de evolução;
- plano de entrevistas;
- escrita técnica;
- prática de ensino;
- open source;
- posicionamento;
- networking;
- certificações;
- política de fontes;
- feedback;
- métricas;
- revisões;
- riscos;
- report, evidence e gate.

Agora você realizará a entrega final do portfólio.

Esta aula não cria um novo projeto.

Ela seleciona, organiza, valida e publica o que já foi construído.

Ao longo da formação, você produziu centenas de artifacts:

- código Java;
- testes;
- migrations;
- contratos;
- OpenAPI;
- collection Postman;
- Dockerfiles;
- pipelines;
- runbooks;
- diagrams;
- ADRs;
- reports;
- evidence;
- README;
- currículo;
- LinkedIn;
- GitHub;
- entrevistas;
- aula ensinável;
- plano de evolução.

Um portfólio profissional não deve despejar tudo isso sobre quem chega ao repositório.

Ele precisa responder rapidamente:

- o que é o projeto?
- qual problema ele resolve?
- qual é o escopo real?
- como a arquitetura funciona?
- quais decisões foram tomadas?
- o que foi implementado?
- como executar?
- como validar?
- onde estão os testes?
- como o sistema lida com falhas?
- quais são os limites?
- o que esse projeto demonstra sobre você?

A entrega final precisa servir a públicos diferentes:

- recrutador;
- pessoa desenvolvedora;
- arquiteto;
- avaliador técnico;
- colega;
- aluno;
- você mesmo no futuro.

Cada público entra por uma porta diferente.

O recrutador pode começar pelo resumo, pelas competências e pelas imagens.

O avaliador técnico pode abrir arquitetura, código, testes e evidence.

A pessoa que quer executar precisa encontrar comandos confiáveis.

Quem quer estudar a solução precisa encontrar a aula ensinável.

Quem quer avaliar maturidade precisa encontrar limites, trade-offs e runbooks.

Nesta aula, você organizará todas essas portas sem criar versões contraditórias da verdade.

O portfólio final deverá preservar honestidade:

```text
implementado
nao significa
operado em producao;

simulado
nao significa
implantado em cliente real;

baseline
nao significa
benchmark universal;

desenho futuro
nao significa
funcionalidade existente.
```

A próxima aula será:

```text
720 - M20.50 - Fechamento da formacao
```

Na aula 720, você fará a retrospectiva final, consolidará a trajetória, verificará a conclusão oficial da grade e encerrará a formação com critérios claros de continuidade.

Nesta aula, o fechamento formal ainda não será executado.

O laboratório será:

```text
labs/m20/aula-719-entrega-final-portfolio/orderflow-final-portfolio-delivery
```

Regra central:

```text
um portfolio tecnico profissional
nao e um deposito de arquivos;

e uma narrativa verificavel
que conecta
problema,
decisoes,
codigo,
testes,
operacao,
evidence,
limites
e valor profissional.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
716:
Aula ensinavel final.

717:
Banca tecnica simulada.

718:
Plano de evolucao pos formacao.

719:
Entrega final portfolio.

720:
Fechamento da formacao.
```

A aula 719 usa como fonte:

- repository do OrderFlow;
- documentação técnica;
- README profissional;
- guia de execução local;
- runbook;
- OpenAPI;
- Postman;
- diagrams;
- ADRs;
- reports;
- evidence;
- testes;
- pipelines;
- containers;
- currículo;
- LinkedIn;
- GitHub;
- narrativa de portfólio;
- aula ensinável;
- banca técnica;
- plano pós-formação.

Nenhum claim novo será criado sem prova.

Nenhum artifact quebrado será mantido apenas porque deu trabalho produzi-lo.

Nenhuma informação sensível será publicada.

---

## Objetivo prático

Será criada a estrutura:

```text
portfolio
├── README.md
├── PORTFOLIO_MANIFEST.md
├── START_HERE.md
├── PROJECT_SUMMARY.md
├── SKILLS_DEMONSTRATED.md
├── ARCHITECTURE_PACKAGE.md
├── API_PACKAGE.md
├── DATA_PACKAGE.md
├── MESSAGING_PACKAGE.md
├── SECURITY_PACKAGE.md
├── TESTING_PACKAGE.md
├── PERFORMANCE_PACKAGE.md
├── OBSERVABILITY_PACKAGE.md
├── DEVOPS_PACKAGE.md
├── OPERATIONS_PACKAGE.md
├── TEACHING_PACKAGE.md
├── CAREER_PACKAGE.md
├── EVIDENCE_PACKAGE.md
├── LIMITATIONS.md
├── ROADMAP.md
├── LINK_CATALOG.md
├── SCREENSHOT_CATALOG.md
├── DEMO_SCRIPT.md
├── REVIEW_GUIDE.md
├── HANDOFF.md
├── PUBLICATION_CHECKLIST.md
├── PORTFOLIO_SCORECARD.md
├── PORTFOLIO_MATRIX.md
├── PORTFOLIO_RISK_REGISTER.md
├── PORTFOLIO_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Pacote de evidências:

```text
portfolio/evidence
├── architecture
├── API
├── data
├── messaging
├── security
├── testing
├── performance
├── observability
├── DevOps
├── operations
├── teaching
└── career
```

Scripts:

```text
scripts/final-portfolio
├── collect-portfolio-artifacts.ps1
├── validate-portfolio-links.ps1
├── validate-portfolio-claims.ps1
├── validate-portfolio-secrets.ps1
├── validate-portfolio-commands.ps1
├── generate-portfolio-index.ps1
├── generate-portfolio-report.ps1
└── collect-portfolio-evidence.ps1
```

Artifacts de governança:

```text
reports/final-portfolio-report.yaml

contracts/final-portfolio-evidence.yaml
```

---

## Conceito essencial

### Curadoria é parte da engenharia

Selecionar o que fica exige critérios.

### Navegação é uma feature

Se o artifact existe, mas ninguém o encontra, ele perde valor.

### Evidence precisa ser legível

A prova deve explicar o que demonstra e quais são seus limites.

### Portfólio precisa de hierarquia

A primeira camada é simples.

A profundidade aparece por links.

### Publicação é uma release

Ela precisa de checklist, revisão, versionamento, rollback e handoff.

---

## Mão na massa guiada

### 1. Criar Portfolio Manifest

Arquivo:

```text
portfolio/PORTFOLIO_MANIFEST.md
```

Registre:

- nome;
- versão;
- data;
- objetivo;
- público;
- escopo;
- repository;
- licença;
- responsável;
- artifacts principais;
- status de publicação.

---

### 2. Definir versão da entrega

Exemplo:

```text
v1.0.0-portfolio.
```

---

### 3. Definir data de corte

Tudo o que entrar precisa estar validado até essa data.

---

### 4. Congelar escopo

Depois do congelamento, apenas correções bloqueadoras entram.

---

### 5. Criar branch de release

```powershell
git switch `
  -c `
  release/portfolio-v1
```

---

### 6. Criar tag planejada

```text
portfolio-v1.0.0
```

---

## Inventário

### 7. Executar coleta de artifacts

```powershell
.\scripts\final-portfolio\collect-portfolio-artifacts.ps1
```

---

### 8. Classificar artifacts

Categorias:

- essencial;
- complementar;
- interno;
- obsoleto;
- sensível;
- duplicado;
- quebrado.

---

### 9. Manter apenas uma fonte principal por assunto

---

### 10. Redirecionar documentos duplicados

Quando necessário, deixe um índice apontando para a fonte oficial.

---

### 11. Remover artifact obsoleto do caminho principal

---

### 12. Não apagar histórico útil sem registrar decisão

---

### 13. Criar tabela de inventário

Colunas:

- caminho;
- categoria;
- público;
- status;
- owner;
- decisão;
- link principal.

---

## Porta de entrada

### 14. Criar Start Here

Arquivo:

```text
portfolio/START_HERE.md
```

Ofereça rotas:

```text
quero entender o projeto;

quero executar localmente;

quero avaliar arquitetura;

quero ver testes;

quero ver seguranca;

quero ver operacao;

quero estudar a aula;

quero conhecer o profissional.
```

---

### 15. Limitar a primeira página

Não coloque toda a documentação no `START_HERE`.

---

### 16. Criar links relativos

---

### 17. Validar navegação em clone local

---

### 18. Validar navegação no GitHub

---

## README final

### 19. Revisar README principal

Arquivo:

```text
README.md
```

Estrutura:

1. título;
2. proposta;
3. demonstração;
4. problema;
5. solução;
6. arquitetura;
7. fluxo;
8. stack;
9. execução;
10. testes;
11. observabilidade;
12. segurança;
13. documentação;
14. limites;
15. autor.

---

### 20. Criar abertura de três linhas

Explique o projeto sem siglas desnecessárias.

---

### 21. Criar resumo executivo

Máximo sugerido:

```text
cento e cinquenta palavras.
```

---

### 22. Inserir arquitetura visual

Use imagem legível e descrição textual.

---

### 23. Inserir fluxo principal

---

### 24. Inserir quick start

---

### 25. Inserir tabela de artifacts

---

### 26. Inserir badges úteis

Exemplos:

- build;
- tests;
- Java;
- license.

Não use badge sem valor.

---

### 27. Inserir seção de honestidade

Diferencie:

- implementado;
- simulado;
- planejado.

---

### 28. Inserir seção “por que este projeto existe”

Conecte a formação ao valor de engenharia.

---

## Resumo do projeto

### 29. Criar Project Summary

Arquivo:

```text
portfolio/PROJECT_SUMMARY.md
```

Inclua:

- contexto;
- problema;
- atores;
- jornada;
- riscos;
- solução;
- resultados;
- limites.

---

### 30. Criar versão de trinta segundos

---

### 31. Criar versão de dois minutos

---

### 32. Criar versão de dez minutos

---

### 33. Evitar linguagem de propaganda

---

## Competências demonstradas

### 34. Criar Skills Demonstrated

Arquivo:

```text
portfolio/SKILLS_DEMONSTRATED.md
```

Categorias:

- Java 21;
- Spring Boot;
- arquitetura;
- domínio;
- PostgreSQL;
- JPA;
- APIs;
- segurança;
- mensageria;
- testes;
- observabilidade;
- Docker;
- CI/CD;
- documentação;
- ensino.

---

### 35. Ligar competência a evidence

Exemplo:

```text
Transactional Outbox
-> migration
-> handler
-> integration test
-> runbook
-> aula ensinavel.
```

---

### 36. Evitar lista de tecnologia sem contexto

---

### 37. Declarar nível demonstrado

Use linguagem como:

- aplicado;
- testado;
- simulado;
- documentado.

---

## Pacote de arquitetura

### 38. Criar Architecture Package

Arquivo:

```text
portfolio/ARCHITECTURE_PACKAGE.md
```

Inclua:

- contexto;
- containers;
- componentes;
- deployment;
- decisões;
- trade-offs;
- evolução.

---

### 39. Selecionar diagramas finais

---

### 40. Padronizar legenda

---

### 41. Adicionar descrição textual

---

### 42. Ligar ADRs relevantes

---

### 43. Ligar defesa arquitetural

---

### 44. Ligar limitações

---

### 45. Remover diagramas contraditórios

---

## Pacote de APIs

### 46. Criar API Package

Arquivo:

```text
portfolio/API_PACKAGE.md
```

Inclua:

- OpenAPI;
- Postman;
- auth;
- errors;
- idempotência;
- paginação;
- exemplos;
- testes de contrato.

---

### 47. Validar OpenAPI

---

### 48. Validar collection

---

### 49. Remover tokens e ambientes reais

---

### 50. Criar exemplo seguro de request

---

### 51. Criar exemplo seguro de response

---

### 52. Ligar quick start da API

---

## Pacote de dados

### 53. Criar Data Package

Arquivo:

```text
portfolio/DATA_PACKAGE.md
```

Inclua:

- modelo;
- migrations;
- constraints;
- índices;
- transações;
- Outbox;
- Inbox;
- locking;
- queries;
- planos.

---

### 54. Selecionar migration representativa

---

### 55. Selecionar query e execution plan

---

### 56. Explicar por que o banco foi escolhido

---

### 57. Declarar limites de volume

---

## Pacote de mensageria

### 58. Criar Messaging Package

Arquivo:

```text
portfolio/MESSAGING_PACKAGE.md
```

Inclua:

- eventos;
- topics;
- keys;
- schemas;
- retries;
- DLQ;
- replay;
- Outbox;
- Inbox;
- lag.

---

### 59. Criar diagrama do fluxo

---

### 60. Explicar at-least-once

---

### 61. Explicar duplicidade

---

### 62. Ligar testes e evidence

---

### 63. Ligar runbook

---

## Pacote de segurança

### 64. Criar Security Package

Arquivo:

```text
portfolio/SECURITY_PACKAGE.md
```

Inclua:

- autenticação;
- autorização;
- tenant;
- OAuth2;
- JWT;
- secrets;
- logs;
- OWASP;
- testes negativos.

---

### 65. Remover detalhes exploráveis desnecessários

---

### 66. Preservar threat model em nível adequado

---

### 67. Ligar evidence de testes

---

### 68. Declarar o que não foi auditado externamente

---

## Pacote de testes

### 69. Criar Testing Package

Arquivo:

```text
portfolio/TESTING_PACKAGE.md
```

Inclua:

- estratégia;
- unitários;
- integração;
- contract;
- segurança;
- concorrência;
- performance;
- Testcontainers.

---

### 70. Criar mapa de testes

---

### 71. Selecionar testes representativos

---

### 72. Explicar por que cada teste existe

---

### 73. Incluir comando de execução

---

### 74. Incluir resultado esperado

---

### 75. Evitar screenshot como única prova

---

## Pacote de performance

### 76. Criar Performance Package

Arquivo:

```text
portfolio/PERFORMANCE_PACKAGE.md
```

Inclua:

- cenário;
- ambiente;
- dataset;
- métricas;
- resultados;
- gargalos;
- limites.

---

### 77. Diferenciar baseline e benchmark

---

### 78. Registrar data e configuração

---

### 79. Ligar relatório original

---

### 80. Evitar extrapolar para produção

---

## Pacote de observabilidade

### 81. Criar Observability Package

Arquivo:

```text
portfolio/OBSERVABILITY_PACKAGE.md
```

Inclua:

- logs;
- métricas;
- traces;
- dashboards;
- SLOs;
- alertas;
- correlation;
- runbooks.

---

### 82. Selecionar dashboard legível

---

### 83. Explicar Outbox age

---

### 84. Explicar projection freshness

---

### 85. Ligar alerta a ação

---

## Pacote DevOps

### 86. Criar DevOps Package

Arquivo:

```text
portfolio/DEVOPS_PACKAGE.md
```

Inclua:

- Dockerfile;
- Compose;
- CI/CD;
- artifacts;
- SBOM;
- scans;
- deployment;
- rollback;
- manifests.

---

### 87. Validar imagens sem secrets

---

### 88. Validar pipeline com menor privilégio

---

### 89. Ligar workflow principal

---

### 90. Explicar o que foi simulado

---

### 91. Ligar evidence de deploy

---

## Pacote operacional

### 92. Criar Operations Package

Arquivo:

```text
portfolio/OPERATIONS_PACKAGE.md
```

Inclua:

- guia local;
- runbook;
- incidentes;
- backup;
- restore;
- troubleshooting;
- health;
- release.

---

### 93. Criar rota “primeiro dia”

---

### 94. Criar rota “incidente”

---

### 95. Criar rota “release”

---

### 96. Validar comandos

---

## Pacote de ensino

### 97. Criar Teaching Package

Arquivo:

```text
portfolio/TEACHING_PACKAGE.md
```

Inclua:

- método;
- aula ensinável;
- exercício;
- solução;
- avaliação;
- publicação;
- revisões.

---

### 98. Explicar por que ensinar demonstra domínio

---

### 99. Ligar Transactional Outbox lesson

---

### 100. Incluir tempo estimado

---

### 101. Validar autonomia do aluno

---

## Pacote de carreira

### 102. Criar Career Package

Arquivo:

```text
portfolio/CAREER_PACKAGE.md
```

Inclua:

- resumo profissional;
- currículo;
- LinkedIn;
- GitHub;
- narrativa;
- entrevistas;
- plano pós-formação.

---

### 103. Não publicar dados pessoais desnecessários

---

### 104. Usar contato profissional seguro

---

### 105. Ligar currículo atualizado

---

### 106. Ligar narrativa QA para Backend quando aplicável

---

### 107. Ligar plano de evolução

---

## Pacote de evidence

### 108. Criar Evidence Package

Arquivo:

```text
portfolio/EVIDENCE_PACKAGE.md
```

Para cada evidence, informe:

- claim;
- artifact;
- como reproduzir;
- resultado;
- limite;
- data.

---

### 109. Numerar evidence

Exemplo:

```text
E-ARCH-001;

E-TEST-001;

E-SEC-001;

E-OPS-001.
```

---

### 110. Criar índice por categoria

---

### 111. Criar índice por competência

---

### 112. Criar índice por jornada

---

### 113. Validar que todo claim importante possui evidence

---

### 114. Remover evidence quebrada

---

## Limitações

### 115. Criar Limitations

Arquivo:

```text
portfolio/LIMITATIONS.md
```

Inclua:

- ambiente controlado;
- providers simulados;
- ausência de produção real;
- baseline limitada;
- disaster recovery não validado em escala real;
- multi-region fora de escopo;
- auditoria externa ausente;
- custos estimados.

---

### 116. Explicar impacto de cada limite

---

### 117. Explicar próxima validação

---

### 118. Evitar linguagem que diminui o projeto

Honestidade não exige desvalorizar o trabalho.

---

## Roadmap público

### 119. Criar Roadmap

Arquivo:

```text
portfolio/ROADMAP.md
```

Inclua apenas evoluções coerentes:

- consumer idempotency avançada;
- schema evolution;
- restore automatizado;
- tracing ampliado;
- regression performance;
- cloud deployment controlado.

---

### 120. Ligar ao plano de evolução

---

### 121. Não prometer datas irreais

---

### 122. Diferenciar roadmap de compromisso

---

## Catálogo de links

### 123. Criar Link Catalog

Arquivo:

```text
portfolio/LINK_CATALOG.md
```

Inclua:

- repository;
- release;
- README;
- demo;
- docs;
- OpenAPI;
- Postman;
- diagrams;
- reports;
- currículo;
- LinkedIn.

---

### 124. Validar todos os links

```powershell
.\scripts\final-portfolio\validate-portfolio-links.ps1
```

---

### 125. Detectar links absolutos locais

Caminhos do seu computador não podem ser publicados.

---

### 126. Detectar links para artifacts privados

---

### 127. Corrigir âncoras quebradas

---

## Catálogo de screenshots

### 128. Criar Screenshot Catalog

Arquivo:

```text
portfolio/SCREENSHOT_CATALOG.md
```

Para cada imagem:

- título;
- objetivo;
- origem;
- data;
- descrição;
- dado sensível revisado.

---

### 129. Selecionar poucas imagens fortes

---

### 130. Não usar screenshot ilegível de terminal

---

### 131. Fornecer texto alternativo

---

### 132. Remover nomes, tokens e URLs privadas

---

## Demonstração

### 133. Criar Demo Script

Arquivo:

```text
portfolio/DEMO_SCRIPT.md
```

Duração:

```text
dez a quinze minutos.
```

Fluxo:

1. apresentar problema;
2. mostrar arquitetura;
3. subir ambiente;
4. registrar pedido;
5. mostrar Outbox;
6. mostrar evento;
7. mostrar projection;
8. executar teste;
9. mostrar observabilidade;
10. declarar limites.

---

### 134. Criar versão curta de três minutos

---

### 135. Criar fallback sem ambiente

Use screenshots e evidence quando a execução falhar.

---

### 136. Não esconder falha durante demo

Explique e use troubleshooting.

---

## Guia de revisão

### 137. Criar Review Guide

Arquivo:

```text
portfolio/REVIEW_GUIDE.md
```

Rotas de revisão:

- quinze minutos;
- trinta minutos;
- sessenta minutos;
- revisão profunda.

---

### 138. Definir o que cada rota cobre

---

### 139. Criar perguntas para avaliador

---

### 140. Pedir feedback específico

---

## Handoff

### 141. Criar Handoff

Arquivo:

```text
portfolio/HANDOFF.md
```

Inclua:

- estado da release;
- como clonar;
- como executar;
- como testar;
- onde encontrar docs;
- como reportar problema;
- como contribuir;
- limitações;
- próxima versão.

---

### 142. Definir contato

---

### 143. Definir política de issues

---

### 144. Definir licença

---

### 145. Definir contribuição

---

## Segurança da publicação

### 146. Executar scan de secrets

```powershell
.\scripts\final-portfolio\validate-portfolio-secrets.ps1
```

---

### 147. Revisar histórico recente

---

### 148. Revisar screenshots

---

### 149. Revisar arquivos `.env`

---

### 150. Revisar reports

---

### 151. Revisar Postman environments

---

### 152. Rotacionar qualquer credencial encontrada

Remover do arquivo não basta.

---

## Validação técnica

### 153. Executar clean clone

---

### 154. Seguir quick start

---

### 155. Executar testes

```powershell
mvn test
```

---

### 156. Executar containers

---

### 157. Executar smoke test

---

### 158. Executar demo

---

### 159. Validar comandos do portfólio

```powershell
.\scripts\final-portfolio\validate-portfolio-commands.ps1
```

---

### 160. Registrar duração

---

## Revisões finais

### 161. Solicitar revisão de recrutador

Avalie:

- clareza;
- proposta;
- competências;
- navegação.

---

### 162. Solicitar revisão técnica

Avalie:

- correção;
- arquitetura;
- testes;
- evidence;
- limites.

---

### 163. Solicitar revisão de iniciante

Avalie:

- quick start;
- linguagem;
- autonomia;
- aula ensinável.

---

### 164. Solicitar revisão de segurança

Avalie:

- secrets;
- dados;
- exposição;
- claims.

---

### 165. Consolidar feedback

---

### 166. Corrigir bloqueadores

---

### 167. Registrar sugestões futuras

---

## Publicação

### 168. Criar Publication Checklist

Arquivo:

```text
portfolio/PUBLICATION_CHECKLIST.md
```

Valide:

- manifest;
- README;
- start here;
- links;
- screenshots;
- código;
- testes;
- commands;
- secrets;
- evidence;
- limites;
- licença;
- contato;
- reviews;
- version;
- tag.

---

### 169. Gerar índice

```powershell
.\scripts\final-portfolio\generate-portfolio-index.ps1
```

---

### 170. Validar claims

```powershell
.\scripts\final-portfolio\validate-portfolio-claims.ps1
```

---

### 171. Criar release notes

Inclua:

- conteúdo;
- destaques;
- execução;
- limitações;
- próximos passos.

---

### 172. Criar commit final

---

### 173. Criar tag

---

### 174. Publicar release

---

### 175. Verificar publicação como visitante

Use janela anônima ou sessão sem privilégios.

---

### 176. Corrigir último bloqueador

---

## Governança

### 177. Criar Portfolio Scorecard

Arquivo:

```text
portfolio/PORTFOLIO_SCORECARD.md
```

Critérios de um a cinco:

- proposta;
- navegação;
- arquitetura;
- código;
- testes;
- segurança;
- operação;
- evidence;
- ensino;
- carreira;
- honestidade;
- acessibilidade;
- execução;
- publicação.

---

### 178. Criar Portfolio Matrix

Arquivo:

```text
portfolio/PORTFOLIO_MATRIX.md
```

Colunas:

- público;
- pergunta;
- página;
- artifact;
- evidence;
- status.

---

### 179. Criar Risk Register

Arquivo:

```text
portfolio/PORTFOLIO_RISK_REGISTER.md
```

Riscos:

```text
README excessivo;

link quebrado;

claim sem evidence;

secret publicado;

screenshot sensivel;

artifact contraditorio;

quick start incompleto;

portfolio sem limites;

curriculo desatualizado;

fechamento antecipado.
```

---

### 180. Criar Traceability

Arquivo:

```text
portfolio/PORTFOLIO_TRACEABILITY.md
```

Exemplo:

```text
competencia:
Java Backend
-> source
-> tests
-> README
-> interview evidence.

competencia:
confiabilidade
-> Outbox
-> integration test
-> runbook
-> teachable lesson.

competencia:
arquitetura
-> diagrams
-> ADRs
-> system design
-> technical board.
```

---

### 181. Criar boundary da próxima aula

Arquivo:

```text
portfolio/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 719 define:

- final portfolio manifest;
- artifact inventory;
- repository curation;
- start-here navigation;
- final README;
- project summary;
- demonstrated skills;
- architecture package;
- API package;
- data package;
- messaging package;
- security package;
- testing package;
- performance package;
- observability package;
- DevOps package;
- operations package;
- teaching package;
- career package;
- evidence package;
- limitations;
- roadmap;
- link catalog;
- screenshot catalog;
- demo script;
- review guide;
- handoff;
- publication;
- final release.

A aula 720 define:

- formation closure;
- final retrospective;
- official completion verification;
- competency consolidation;
- journey summary;
- final lessons learned;
- continuity commitment;
- closing report;
- formation handoff;
- final graduation checkpoint.

Nenhum fechamento formal da formacao
e executado nesta aula.
```

---

## Relatório e evidence

### 182. Criar report

Arquivo:

```text
reports/final-portfolio-report.yaml
```

Exemplo:

```yaml
finalPortfolio:
  release:
    version:
      portfolio-v1.0.0
    published:
      true

  packages:
    architecture:
      PASS
    API:
      PASS
    data:
      PASS
    messaging:
      PASS
    security:
      PASS
    testing:
      PASS
    performance:
      PASS
    observability:
      PASS
    DevOps:
      PASS
    operations:
      PASS
    teaching:
      PASS
    career:
      PASS
    evidence:
      PASS

  validation:
    linksBroken:
      0
    commandFailures:
      0
    secretFindings:
      0
    unsupportedClaims:
      0
    cleanClone:
      PASS
    anonymousReview:
      PASS

  formationClosure:
    completed:
      false

  gate:
    PASS
```

---

### 183. Criar evidence

Arquivo:

```text
contracts/final-portfolio-evidence.yaml
```

Campos:

- lesson;
- project;
- release version;
- manifest status;
- inventory item count;
- public artifact count;
- archived artifact count;
- package count;
- evidence count;
- link count;
- broken link count;
- screenshot count;
- sensitive screenshot count;
- command count;
- command failure count;
- test count;
- passing test count;
- secret finding count;
- unsupported claim count;
- limitation count;
- recruiter review status;
- technical review status;
- beginner review status;
- security review status;
- clean clone status;
- demo status;
- release status;
- anonymous review status;
- formation closure completed;
- documentation status;
- gate status;
- timestamp.

---

### 184. Criar gate

Status:

```text
PASS;

FAIL_MANIFEST;

FAIL_INVENTORY;

FAIL_START_HERE;

FAIL_README;

FAIL_PROJECT_SUMMARY;

FAIL_SKILLS;

FAIL_ARCHITECTURE_PACKAGE;

FAIL_API_PACKAGE;

FAIL_DATA_PACKAGE;

FAIL_MESSAGING_PACKAGE;

FAIL_SECURITY_PACKAGE;

FAIL_TESTING_PACKAGE;

FAIL_PERFORMANCE_PACKAGE;

FAIL_OBSERVABILITY_PACKAGE;

FAIL_DEVOPS_PACKAGE;

FAIL_OPERATIONS_PACKAGE;

FAIL_TEACHING_PACKAGE;

FAIL_CAREER_PACKAGE;

FAIL_EVIDENCE_PACKAGE;

FAIL_LIMITATIONS;

FAIL_ROADMAP;

FAIL_LINK_CATALOG;

FAIL_SCREENSHOT_CATALOG;

FAIL_DEMO;

FAIL_REVIEW_GUIDE;

FAIL_HANDOFF;

FAIL_SECRET_SCAN;

FAIL_CLEAN_CLONE;

FAIL_COMMAND_VALIDATION;

FAIL_RECRUITER_REVIEW;

FAIL_TECHNICAL_REVIEW;

FAIL_BEGINNER_REVIEW;

FAIL_SECURITY_REVIEW;

FAIL_PUBLICATION;

FAIL_ANONYMOUS_REVIEW;

FAIL_UNSUPPORTED_CLAIM;

FAIL_FORMATION_CLOSURE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 185. Executar validação completa

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\final-portfolio\validate-portfolio-links.ps1

.\scripts\final-portfolio\validate-portfolio-claims.ps1

.\scripts\final-portfolio\validate-portfolio-secrets.ps1

.\scripts\final-portfolio\validate-portfolio-commands.ps1

mvn test
```

---

### 186. Executar dry run de publicação

---

### 187. Executar demo final

---

### 188. Abrir tudo como visitante

---

### 189. Fechar report

---

### 190. Fechar evidence

---

### 191. Aprovar gate

---

### 192. Encerrar o laboratório

Confirme:

- Manifest;
- inventário;
- curadoria;
- Start Here;
- README;
- summary;
- skills;
- architecture;
- API;
- data;
- messaging;
- security;
- testing;
- performance;
- observability;
- DevOps;
- operations;
- teaching;
- career;
- evidence;
- limitations;
- roadmap;
- links;
- screenshots;
- demo;
- review;
- handoff;
- secret scan;
- clean clone;
- commands;
- four reviews;
- release;
- anonymous check;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 720 preservada.

---

## Entendendo o que foi feito

### O repository ganhou portas de entrada

Cada público passou a encontrar uma rota própria.

### O volume de artifacts ganhou curadoria

Quantidade deixou de ser o principal valor.

### O README ganhou hierarquia

Resumo e profundidade foram separados.

### Evidence ganhou contexto

Cada prova passou a declarar claim, reprodução e limite.

### Limitações ganharam visibilidade

O projeto ficou mais confiável, não menor.

### A aula ensinável ganhou lugar no portfólio

Capacidade de ensino passou a ser parte da identidade profissional.

### A carreira ganhou conexão com o projeto

Currículo, LinkedIn, GitHub e plano de evolução passaram a apontar para a mesma narrativa.

### A publicação ganhou processo de release

Branch, tag, checklist, reviews e rollback reduziram risco.

---

## Erros comuns importantes

### Publicar tudo na home

A navegação fica impossível.

### Manter versões contraditórias

A verdade do projeto fica ambígua.

### Usar screenshots como única evidence

A reprodução fica impossível.

### Esconder limitações

O avaliador encontra inconsistências.

### Publicar dados pessoais

O portfólio cria risco.

### Deixar token em Postman

A credencial pode ser comprometida.

### Criar quick start não testado

O visitante abandona o projeto.

### Usar badges sem significado

A página ganha ruído.

### Publicar sem revisão anônima

Links privados podem passar despercebidos.

### Antecipar o fechamento

Essa etapa pertence à aula 720.

---

## Comandos úteis

### Validar links

```powershell
.\scripts\final-portfolio\validate-portfolio-links.ps1
```

### Validar claims

```powershell
.\scripts\final-portfolio\validate-portfolio-claims.ps1
```

### Validar secrets

```powershell
.\scripts\final-portfolio\validate-portfolio-secrets.ps1
```

### Gerar índice

```powershell
.\scripts\final-portfolio\generate-portfolio-index.ps1
```

---

## Exercício principal

Realize a release final do portfólio.

Inclua:

1. criar manifest;
2. congelar escopo;
3. coletar artifacts;
4. classificar inventário;
5. remover duplicidade;
6. criar Start Here;
7. revisar README;
8. criar resumo;
9. mapear competências;
10. montar arquitetura;
11. montar APIs;
12. montar dados;
13. montar mensageria;
14. montar segurança;
15. montar testes;
16. montar performance;
17. montar observabilidade;
18. montar DevOps;
19. montar operações;
20. montar ensino;
21. montar carreira;
22. montar evidence;
23. declarar limitações;
24. criar roadmap;
25. validar links;
26. revisar screenshots;
27. criar demo;
28. criar handoff;
29. escanear secrets;
30. executar clean clone;
31. validar comandos;
32. executar testes;
33. coletar quatro revisões;
34. criar release notes;
35. publicar;
36. revisar como visitante;
37. fechar gate.

Não execute o fechamento formal da formação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 718 e ponte para a aula 720 foram preservadas;
- Portfolio Manifest foi criado;
- versão, data, público, escopo e status foram definidos;
- escopo foi congelado;
- branch e tag foram planejadas;
- inventário foi coletado;
- artifacts foram classificados;
- duplicados, obsoletos, sensíveis e quebrados foram tratados;
- fonte principal por assunto foi definida;
- Start Here foi criado;
- rotas por público foram definidas;
- links relativos foram validados;
- README final foi revisado;
- abertura, resumo, arquitetura, fluxo, stack, quick start, testes, segurança, docs, limites e autor foram incluídos;
- badges inúteis foram evitados;
- implementação, simulação e planejamento foram diferenciados;
- Project Summary foi criado;
- versões curta, média e longa foram preparadas;
- linguagem promocional excessiva foi evitada;
- Skills Demonstrated foi criado;
- competências foram ligadas a evidence;
- níveis demonstrados foram declarados;
- Architecture Package foi criado;
- diagramas, ADRs, defesa e limitações foram ligados;
- diagramas contraditórios foram removidos;
- API Package foi criado;
- OpenAPI e Postman foram validados;
- tokens e ambientes reais foram removidos;
- exemplos seguros foram criados;
- Data Package foi criado;
- modelo, migrations, constraints, índices, transações, Outbox, Inbox e plans foram apresentados;
- Messaging Package foi criado;
- eventos, keys, schemas, retry, DLQ, replay e lag foram apresentados;
- at-least-once e duplicidade foram explicados;
- Security Package foi criado;
- auth, tenant, secrets, logs, OWASP e testes foram apresentados;
- ausência de auditoria externa foi declarada;
- Testing Package foi criado;
- mapa, testes representativos, comandos e resultados foram apresentados;
- screenshot não foi a única evidence;
- Performance Package foi criado;
- cenário, ambiente, métricas, resultados e limites foram registrados;
- baseline e benchmark foram diferenciados;
- extrapolação para produção foi evitada;
- Observability Package foi criado;
- logs, métricas, traces, dashboards, SLOs, alertas e runbooks foram apresentados;
- DevOps Package foi criado;
- Docker, Compose, CI/CD, artifacts, SBOM, scans, deploy e rollback foram apresentados;
- simulação foi declarada;
- Operations Package foi criado;
- rotas de primeiro dia, incidente e release foram criadas;
- Teaching Package foi criado;
- método, aula, exercício, avaliação e revisões foram ligados;
- autonomia foi validada;
- Career Package foi criado;
- dados pessoais foram minimizados;
- currículo, LinkedIn, GitHub, narrativa e plano foram ligados;
- Evidence Package foi criado;
- claim, reprodução, resultado, limite e data foram registrados;
- evidências foram numeradas e indexadas;
- claims importantes receberam evidence;
- evidence quebrada foi removida;
- Limitations foi criado;
- ambiente, providers, produção, baseline, DR, multi-region, auditoria e custos foram declarados;
- impacto e próxima validação foram explicados;
- Roadmap foi criado;
- evoluções coerentes foram ligadas ao plano;
- promessas irreais foram evitadas;
- Link Catalog foi criado;
- links locais, privados e âncoras quebradas foram corrigidos;
- Screenshot Catalog foi criado;
- imagens fortes, legíveis, descritas e sanitizadas foram selecionadas;
- Demo Script foi criado;
- versões de quinze e três minutos foram preparadas;
- fallback foi definido;
- falhas não foram escondidas;
- Review Guide foi criado;
- rotas de revisão e perguntas foram definidas;
- Handoff foi criado;
- clone, execução, testes, docs, issues, contribuição, licença e limitações foram explicados;
- scan de secrets foi executado;
- histórico, screenshots, `.env`, reports e Postman foram revisados;
- credenciais encontradas foram rotacionadas;
- clean clone foi executado;
- quick start, testes, containers, smoke e demo foram executados;
- comandos foram validados;
- duração foi registrada;
- revisões de recrutador, técnica, iniciante e segurança foram coletadas;
- bloqueadores foram corrigidos;
- Publication Checklist foi criado;
- índice, claims e release notes foram gerados;
- commit, tag e release foram preparados;
- publicação foi verificada como visitante;
- Scorecard foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 720 foi criado;
- report, evidence e gate foram criados;
- dry run e demo final foram executados;
- fechamento formal não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

mvn test

.\scripts\final-portfolio\validate-portfolio-links.ps1

.\scripts\final-portfolio\validate-portfolio-claims.ps1

.\scripts\final-portfolio\validate-portfolio-secrets.ps1
```

Adicione:

```powershell
git add `
  README.md `
  portfolio `
  scripts/final-portfolio `
  reports/final-portfolio-report.yaml `
  contracts/final-portfolio-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|localhost-user-path|realTenant|realCustomer|formation-closing-answer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(portfolio): publish final OrderFlow delivery"
```

Crie tag após aprovação:

```powershell
git tag `
  -a `
  portfolio-v1.0.0 `
  -m `
  "OrderFlow final portfolio delivery"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short

git tag `
  --list `
  "portfolio-v1.0.0"
```

Não inclua:

- secret;
- dado real;
- caminho local;
- claim sem evidence;
- encerramento da aula 720.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a entrega final do portfólio do OrderFlow.

Você consolidou:

```text
manifest;

inventory;

curation;

Start Here;

README;

project summary;

skills;

architecture;

APIs;

data;

messaging;

security;

testing;

performance;

observability;

DevOps;

operations;

teaching;

career;

evidence;

limitations;

roadmap;

links;

screenshots;

demo;

review;

handoff;

release;

report e evidence.
```

Agora o projeto possui uma entrega única, navegável, reproduzível, defensável e pronta para apresentação profissional.

A próxima aula será:

```text
720 - M20.50 - Fechamento da formacao
```

Nela, você encerrará oficialmente a formação, revisará a trajetória, validará a conclusão da grade e consolidará os compromissos de continuidade.

Nenhum fechamento formal da formação foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Fiz o inventário.
- [ ] Curadoria concluída.
- [ ] Criei Start Here.
- [ ] Revisei README.
- [ ] Montei todos os pacotes.
- [ ] Organizei evidence.
- [ ] Declarei limitações.
- [ ] Validei links.
- [ ] Revisei screenshots.
- [ ] Executei demo.
- [ ] Escaneei secrets.
- [ ] Executei clean clone.
- [ ] Coletei quatro revisões.
- [ ] Publiquei a release.
- [ ] Preservei o fechamento para a aula 720.

---

## Troubleshooting adicional

### O README ficou enorme

Mova profundidade para pacotes e mantenha links.

### Existem duas documentações diferentes

Escolha uma fonte principal.

### Um link funciona localmente, mas não no GitHub

Revise caminho relativo e capitalização.

### O quick start falha

Execute em clean clone e registre dependência escondida.

### A screenshot mostra dado sensível

Remova, substitua e trate eventual exposição.

### A demo depende de internet

Crie fallback local e evidence gravada.

### A evidence não prova o claim

Troque a afirmação ou produza prova adequada.

### O recrutador não entende o resumo

Reduza siglas e comece pelo problema.

### O avaliador técnico não encontra testes

Melhore navegação e pacote de testes.

### Quero encerrar a formação agora

Essa etapa pertence à aula 720.

---

## Perguntas de revisão

1. Portfólio é depósito de arquivos?
2. O que curadoria remove?
3. Por que Start Here?
4. README precisa conter tudo?
5. Competência sem evidence basta?
6. Screenshot é sempre prova suficiente?
7. Baseline é benchmark universal?
8. Limitação diminui o projeto?
9. Por que clean clone?
10. Por que revisão anônima?
11. O que pacote de arquitetura reúne?
12. O que pacote de segurança deve evitar?
13. O que evidence precisa declarar?
14. O que demo precisa possuir?
15. Por que scan de secrets inclui screenshots?
16. Remover secret do arquivo basta?
17. O que release tag identifica?
18. O que handoff permite?
19. O que scorecard mede?
20. O que traceability conecta?
21. O que a aula 720 fará?
22. O que não foi executado?
23. Qual é a próxima aula?
24. Qual é a regra central?
25. O que fazer com artifact contraditório?

---

## Roteiro de resposta

1. Não.
2. Ruído e risco.
3. Navegação.
4. Não.
5. Não.
6. Não.
7. Não.
8. Não.
9. Reprodutibilidade.
10. Visão pública.
11. Desenhos e decisões.
12. Exposição.
13. Claim e limite.
14. Fallback.
15. Podem vazar dados.
16. Não.
17. Conteúdo imutável.
18. Continuidade.
19. Qualidade da entrega.
20. Competência e prova.
21. Fechamento da formação.
22. Encerramento formal.
23. Fechamento da formacao.
24. Curar, provar, publicar e entregar.
25. Remover ou corrigir.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 719 - M20.49 - Entrega final portfolio

- Continuei após Plano de evolução pós-formação.
- Criei Portfolio Manifest.
- Defini versão, data de corte, escopo, branch e tag.
- Coletei e classifiquei artifacts.
- Removi duplicidade, obsolescência, risco e contradição.
- Criei inventário.
- Criei Start Here.
- Defini rotas por público.
- Revisei README final.
- Criei resumo executivo, quick start e seção de honestidade.
- Criei Project Summary.
- Preparei apresentações de trinta segundos, dois minutos e dez minutos.
- Criei Skills Demonstrated.
- Liguei competências a evidence.
- Criei Architecture Package.
- Selecionei diagramas, ADRs e trade-offs.
- Criei API Package.
- Validei OpenAPI, Postman, requests e responses.
- Criei Data Package.
- Organizei modelo, migrations, constraints, índices, transações, Outbox e Inbox.
- Criei Messaging Package.
- Organizei eventos, keys, retries, DLQ, replay e lag.
- Criei Security Package.
- Organizei OAuth2, JWT, tenant, secrets, logs e testes.
- Criei Testing Package.
- Organizei estratégia, testes, comandos e resultados.
- Criei Performance Package.
- Diferenciei baseline e benchmark.
- Criei Observability Package.
- Organizei logs, métricas, traces, SLOs, alertas e runbooks.
- Criei DevOps Package.
- Organizei Docker, Compose, pipelines, artifacts, scans, deploy e rollback.
- Criei Operations Package.
- Criei rotas de primeiro dia, incidente e release.
- Criei Teaching Package.
- Liguei método, aula, exercício, avaliação e revisões.
- Criei Career Package.
- Liguei currículo, LinkedIn, GitHub, narrativa e plano.
- Criei Evidence Package.
- Numerei e indexei evidence.
- Liguei claims a reprodução, resultado e limite.
- Criei Limitations.
- Declarei ambiente, providers, produção, baseline, DR, multi-region, auditoria e custos.
- Criei Roadmap público.
- Criei Link Catalog.
- Corrigi links locais, privados e quebrados.
- Criei Screenshot Catalog.
- Selecionei imagens legíveis e sanitizadas.
- Criei Demo Script de quinze e três minutos.
- Criei fallback.
- Criei Review Guide.
- Criei Handoff.
- Defini clone, execução, testes, docs, issues, licença e contribuição.
- Executei scan de secrets.
- Revisei histórico, screenshots, environments e reports.
- Executei clean clone.
- Executei quick start, testes, containers, smoke e demo.
- Validei comandos.
- Coletei revisões de recrutador, técnica, iniciante e segurança.
- Corrigi bloqueadores.
- Criei Publication Checklist.
- Gerei índice, release notes, commit e tag.
- Verifiquei a publicação como visitante.
- Criei Portfolio Scorecard.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 720.
- Criei report, evidence e gate.
- Executei dry run e demo final.
- Não antecipei o fechamento formal.
- Próxima aula: Fechamento da formacao.
```

---

## Referência técnica curta

- Portfolio Curation.
- Start Here.
- Final README.
- Evidence Package.
- Architecture Package.
- API Package.
- Testing Package.
- Operations Package.
- Teaching Package.
- Career Package.
- Limitations.
- Clean Clone.
- Secret Scan.
- Demo Script.
- Release Notes.
- Tag.
- Handoff.
- Anonymous Review.

Regra final:

```text
A entrega final de portfolio do OrderFlow deve transformar todos os artifacts da formacao em uma narrativa publica, navegavel e verificavel: manifest define version, audience, scope and release status, inventory classifica essential, complementary, internal, obsolete, sensitive, duplicate and broken artifacts, Start Here cria rotas para recruiter, developer, architect, operator, student and candidate, README apresenta problem, solution, architecture, flow, stack, quick start, tests, security, documentation, limitations and author sem despejar toda a profundidade, project summary oferece versões de trinta segundos, dois minutos and dez minutos, demonstrated skills ligam Java, Spring, domain, PostgreSQL, APIs, security, messaging, testing, observability, Docker, CI CD, documentation and teaching a evidence real, architecture, API, data, messaging, security, testing, performance, observability, DevOps, operations, teaching and career packages organizam artifacts por pergunta do avaliador, evidence package numera claims, reproduction, results, dates and limits, limitations diferenciam controlled environment, simulated providers, no real production, limited baseline, future DR, multi-region, external audit and estimated cost, roadmap permanece coerente com o plano pos-formacao, link and screenshot catalogs removem local paths, private references and sensitive data, demo script possui execução curta, longa and fallback, review guide suporta análises de quinze, trinta and sessenta minutos, handoff explica clone, run, test, docs, issues, license and contribution, secret scan cobre source, history, screenshots, reports and Postman, clean clone, quick start, tests, containers, smoke and demo comprovam reprodutibilidade, recruiter, technical, beginner and security reviews reduzem bloqueios, publication checklist, release notes, commit, tag and anonymous visitor review fecham a release, scorecard, report and evidence aprovam o gate, enquanto retrospective, official completion verification, final competency consolidation, journey closure and graduation checkpoint permanecem reservados para a aula 720.
```
