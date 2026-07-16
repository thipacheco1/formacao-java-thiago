# 702 - M20.32 - Narrativa tecnica portfolio

## Apresentação da aula

Na aula 701, você concluiu a refatoração arquitetural final do OrderFlow.

O projeto passou a possuir:

- boundaries mais claros;
- direção de dependências protegida;
- domínio sem dependência de framework;
- application isolada dos adapters;
- ports com linguagem de negócio;
- adapters contendo detalhes técnicos;
- runtimes mais finos;
- composition roots explícitos;
- packages mais coerentes;
- shared code governado;
- testes arquiteturais;
- diagramas atualizados;
- contratos externos preservados;
- report, evidence e gate arquitetural.

O OrderFlow agora está tecnicamente pronto para ser apresentado.

Nesta aula, você transformará todo esse trabalho em uma narrativa técnica de portfólio.

Essa narrativa não será propaganda vazia.

Ela deverá explicar:

- qual problema foi escolhido;
- por que o problema é relevante;
- quais riscos técnicos existiam;
- quais decisões foram tomadas;
- quais alternativas foram consideradas;
- quais trade-offs foram aceitos;
- como a implementação evoluiu;
- quais falhas foram encontradas;
- como o projeto foi validado;
- quais evidências sustentam as afirmações;
- quais limitações permanecem;
- o que o projeto demonstra sobre sua capacidade profissional.

Um portfólio técnico forte não é apenas um repositório público.

Ele é a combinação de:

```text
projeto;

narrativa;

evidencia;

clareza;

honestidade;

capacidade de explicar.
```

O leitor precisa entender por que o projeto existe antes de analisar classes, módulos ou pipelines.

A narrativa também precisa funcionar em diferentes contextos:

- README resumido;
- página de portfólio;
- apresentação para recrutador;
- entrevista técnica;
- conversa com arquiteto;
- publicação profissional;
- demonstração ao vivo;
- banca avaliadora.

Cada contexto exige uma profundidade diferente.

Nesta aula, você criará:

- narrativa curta;
- narrativa média;
- narrativa longa;
- versão escrita para portfólio;
- roteiro oral;
- mapa de evidências;
- seleção de decisões;
- seleção de desafios;
- seleção de resultados;
- seleção de aprendizados;
- catálogo de imagens;
- preparação de demonstração;
- material de apoio para perguntas futuras.

A próxima aula será:

```text
703 - M20.33 - Defesa de decisoes engenharia
```

Na aula 703, você aprenderá a defender tecnicamente as decisões do OrderFlow sob questionamento, comparar alternativas, responder objeções, reconhecer limites e sustentar trade-offs.

Nesta aula, você organizará a narrativa.

Você não realizará ainda a defesa formal das decisões.

O laboratório será:

```text
labs/m20/aula-702-narrativa-tecnica-portfolio/orderflow-portfolio-narrative
```

Regra central:

```text
narrativa tecnica profissional
nao exagera o projeto;

ela conecta
problema,
decisoes,
implementacao,
resultados
e evidencias
em uma historia defensavel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
699:
Correcao tecnica final parte 1.

700:
Correcao tecnica final parte 2.

701:
Refatoracao arquitetural final.

702:
Narrativa tecnica portfolio.

703:
Defesa de decisoes engenharia.

704:
Perguntas arquitetura entrevistas.
```

A narrativa da aula 702 utiliza como fonte:

- README profissional;
- ADRs;
- diagramas;
- código final;
- OpenAPI;
- Postman;
- reports;
- evidence;
- performance baseline;
- runbook;
- guia local;
- CI/CD;
- deployment simulation;
- architecture report;
- correction reports;
- diário de bordo;
- histórico de commits.

A narrativa não pode contradizer essas fontes.

A ordem de autoridade permanece:

```text
comportamento executado;

testes;

contratos;

decisoes registradas;

reports;

evidence;

narrativa.
```

Se a narrativa disser algo que o projeto não comprova, a narrativa está errada.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/portfolio
├── PORTFOLIO_NARRATIVE_CHARTER.md
├── AUDIENCE_AND_CONTEXT_MAP.md
├── PROJECT_ONE_LINER.md
├── PROJECT_ELEVATOR_PITCH.md
├── PROJECT_SUMMARY.md
├── PROJECT_LONG_FORM_NARRATIVE.md
├── PROBLEM_CONTEXT.md
├── SOLUTION_OVERVIEW.md
├── DECISION_STORY_MAP.md
├── TRADE_OFF_STORY_MAP.md
├── TECHNICAL_CHALLENGES.md
├── RESULTS_AND_EVIDENCE.md
├── LIMITATIONS_AND_SCOPE.md
├── LEARNING_OUTCOMES.md
├── DEMONSTRATION_SCRIPT.md
├── VISUAL_ASSET_CATALOG.md
├── INTERVIEW_STORY_BANK.md
├── PORTFOLIO_PAGE_DRAFT.md
├── ORAL_PRESENTATION_SCRIPT.md
├── PORTFOLIO_REVIEW_CHECKLIST.md
├── PORTFOLIO_MATRIX.md
├── PORTFOLIO_RISK_REGISTER.md
├── PORTFOLIO_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/portfolio
├── collect-portfolio-sources.ps1
├── validate-portfolio-claims.ps1
├── validate-portfolio-links.ps1
├── validate-portfolio-assets.ps1
├── validate-evidence-references.ps1
├── validate-portfolio-secrets.ps1
├── generate-portfolio-report.ps1
└── collect-portfolio-evidence.ps1
```

Artifacts:

```text
reports/portfolio-narrative-report.yaml

contracts/portfolio-narrative-evidence.yaml
```

A narrativa principal longa ficará em:

```text
docs/portfolio/PROJECT_LONG_FORM_NARRATIVE.md
```

---

## Conceito essencial

### Narrativa não é cronologia completa

Você não precisa contar cada aula ou commit.

A narrativa seleciona os eventos que explicam:

- problema;
- decisão;
- dificuldade;
- solução;
- resultado;
- aprendizado.

### Afirmação precisa de prova

Exemplo fraco:

```text
o sistema e altamente escalavel.
```

Exemplo defensável:

```text
o projeto possui uma baseline de capacidade
em ambiente controlado,
com percentis,
throughput,
backlog,
consumer lag
e limites conhecidos.
```

### Trade-off aumenta credibilidade

Dizer apenas vantagens faz o projeto parecer superficial.

Exemplo:

```text
a Outbox reduz o risco
de perda entre banco e broker,
mas aumenta a complexidade
de persistencia,
publicacao,
monitoramento
e recuperacao.
```

### Limitação não diminui o projeto

Limitações honestas mostram maturidade.

### A história precisa de um protagonista técnico

O protagonista não é a tecnologia.

É o problema de engenharia e as decisões tomadas para resolvê-lo.

---

## Mão na massa guiada

### 1. Criar Portfolio Narrative Charter

Arquivo:

```text
docs/portfolio/PORTFOLIO_NARRATIVE_CHARTER.md
```

Princípios:

```text
problem before technology;

claims require evidence;

trade-offs are explicit;

limitations are honest;

results use measured data;

the author explains decisions;

visuals support the story;

formal defense belongs to lesson 703.
```

---

### 2. Criar Audience and Context Map

Arquivo:

```text
docs/portfolio/AUDIENCE_AND_CONTEXT_MAP.md
```

Audiências:

```text
recrutador;

engenheiro backend;

arquiteto;

QA;

DevOps;

gestor tecnico;

avaliador;

colega de comunidade.
```

Contextos:

- leitura rápida;
- portfólio escrito;
- entrevista;
- apresentação oral;
- demonstração;
- publicação profissional.

---

### 3. Definir o que cada audiência precisa

Recrutador precisa entender:

- escopo;
- maturidade;
- tecnologias principais;
- resultado;
- capacidade demonstrada.

Engenheiro precisa entender:

- arquitetura;
- contratos;
- testes;
- falhas;
- trade-offs.

Arquiteto precisa entender:

- boundaries;
- consistência;
- mensageria;
- segurança;
- operação;
- decisões.

---

### 4. Criar mapa de profundidade

Níveis:

```text
15 segundos;

60 segundos;

5 minutos;

15 minutos;

leitura aprofundada.
```

Cada nível deve contar a mesma história com profundidade diferente.

---

## One-liner

### 5. Criar Project One-Liner

Arquivo:

```text
docs/portfolio/PROJECT_ONE_LINER.md
```

Uma versão possível:

```text
OrderFlow é uma plataforma backend em Java 21
para orquestrar pedidos e integrações distribuídas
com idempotência, mensageria confiável,
segurança multi-tenant e observabilidade ponta a ponta.
```

---

### 6. Validar o one-liner

Ele precisa conter:

- nome;
- tipo de sistema;
- problema;
- diferenciais;
- sem lista excessiva.

---

### 7. Evitar superlativos

Não use:

- melhor;
- revolucionário;
- perfeito;
- infinitamente escalável;
- pronto para qualquer empresa.

---

## Elevator pitch

### 8. Criar Project Elevator Pitch

Arquivo:

```text
docs/portfolio/PROJECT_ELEVATOR_PITCH.md
```

Estrutura:

1. contexto;
2. problema;
3. solução;
4. decisões fortes;
5. resultado;
6. valor profissional.

---

### 9. Escrever versão de 45 segundos

Exemplo:

```text
O OrderFlow é um projeto backend em Java 21 e Spring Boot
criado para demonstrar como lidar com uma jornada distribuída
de pedidos envolvendo estoque, pagamento e fulfillment.
O foco não foi apenas construir endpoints,
mas tratar duplicidade, falhas parciais,
resultados ambíguos, consistência eventual,
segurança multi-tenant e operação.
A solução usa arquitetura hexagonal,
PostgreSQL, Outbox, Inbox, Kafka,
integrações idempotentes, OpenTelemetry,
testes em várias camadas, containers e CI/CD.
O projeto também possui OpenAPI, Postman,
performance básica, runbooks e evidências versionadas.
```

---

### 10. Testar a versão oral

Leia em voz alta.

Ajuste:

- respiração;
- ritmo;
- termos;
- duração;
- clareza.

---

## Resumo médio

### 11. Criar Project Summary

Arquivo:

```text
docs/portfolio/PROJECT_SUMMARY.md
```

Tamanho recomendado:

```text
300 a 600 palavras.
```

---

### 12. Estruturar o resumo

Seções:

- contexto;
- problema;
- solução;
- arquitetura;
- confiabilidade;
- segurança;
- qualidade;
- operação;
- resultado.

---

### 13. Não transformar resumo em stack list

Tecnologias aparecem ligadas a decisões.

---

## Contexto do problema

### 14. Criar Problem Context

Arquivo:

```text
docs/portfolio/PROBLEM_CONTEXT.md
```

Explique a jornada:

```text
registro;

estoque;

pagamento;

fulfillment;

cancelamento;

reconciliacao.
```

---

### 15. Explicar riscos distribuídos

Riscos:

- timeout;
- duplicidade;
- falha parcial;
- ordering;
- retry;
- inconsistência;
- segurança;
- observabilidade;
- rollback.

---

### 16. Explicar por que CRUD não bastava

O desafio era coordenar comportamento e efeitos distribuídos.

---

### 17. Definir objetivo de engenharia

Exemplo:

```text
construir uma plataforma demonstrativa
capaz de preservar invariantes locais,
publicar eventos com confiabilidade,
integrar providers idempotentes,
tratar falhas parciais
e permanecer observável e testável.
```

---

## Visão da solução

### 18. Criar Solution Overview

Arquivo:

```text
docs/portfolio/SOLUTION_OVERVIEW.md
```

---

### 19. Apresentar domínio

Explique:

- aggregate;
- estados;
- invariantes;
- transições;
- compensações;
- resultados ambíguos.

---

### 20. Apresentar aplicação

Explique:

- commands;
- queries;
- handlers;
- ports;
- transaction boundaries.

---

### 21. Apresentar infraestrutura

Explique:

- PostgreSQL;
- Flyway;
- Kafka;
- Outbox;
- Inbox;
- providers;
- read model.

---

### 22. Apresentar operação

Explique:

- Docker;
- health;
- observabilidade;
- CI/CD;
- deployment simulation;
- runbook.

---

## Story map de decisões

### 23. Criar Decision Story Map

Arquivo:

```text
docs/portfolio/DECISION_STORY_MAP.md
```

Selecione decisões que mostram amplitude.

---

### 24. Selecionar arquitetura hexagonal

História:

- problema;
- alternativas;
- decisão;
- implementação;
- benefício;
- custo;
- evidência.

---

### 25. Selecionar PostgreSQL como autoridade

Explique:

- consistência transacional;
- auditabilidade;
- constraints;
- migrations;
- custo de escala de escrita;
- evidência.

---

### 26. Selecionar Outbox

Explique o problema do dual write.

Não diga que Outbox elimina todos os riscos.

---

### 27. Selecionar Inbox

Explique delivery at-least-once e deduplicação persistente.

---

### 28. Selecionar Kafka

Explique:

- desacoplamento;
- retenção;
- replay;
- partitions;
- ordering por key;
- operação adicional.

---

### 29. Selecionar ACL para providers

Explique normalização de contratos externos.

---

### 30. Selecionar JWT multi-tenant

Explique:

- issuer;
- audience;
- scopes;
- roles;
- tenant claim;
- IDOR.

---

### 31. Selecionar OpenTelemetry

Explique logs, metrics, traces e correlation.

---

### 32. Selecionar build once

Explique artifact, digest, assinatura e promoção.

---

## Trade-offs

### 33. Criar Trade-Off Story Map

Arquivo:

```text
docs/portfolio/TRADE_OFF_STORY_MAP.md
```

---

### 34. Registrar trade-off da Outbox

Benefício:

- atomicidade local.

Custo:

- tabela;
- publisher;
- lease;
- monitoramento;
- backlog;
- replay.

---

### 35. Registrar trade-off do Kafka

Benefício:

- desacoplamento e retenção.

Custo:

- eventual consistency;
- operação;
- schema;
- lag;
- DLQ.

---

### 36. Registrar trade-off da arquitetura modular

Benefício:

- boundaries.

Custo:

- mais módulos;
- wiring;
- testes arquiteturais;
- curva de aprendizagem.

---

### 37. Registrar trade-off de segurança completa

Benefício:

- isolamento e proteção.

Custo:

- configuração;
- tokens;
- claims;
- testes negativos;
- observabilidade segura.

---

### 38. Registrar trade-off da observabilidade

Benefício:

- diagnóstico.

Custo:

- volume;
- cardinalidade;
- storage;
- sampling;
- configuração.

---

### 39. Registrar trade-off de testes profundos

Benefício:

- confiança.

Custo:

- tempo;
- containers;
- manutenção;
- flakiness control.

---

## Desafios técnicos

### 40. Criar Technical Challenges

Arquivo:

```text
docs/portfolio/TECHNICAL_CHALLENGES.md
```

Selecione desafios que realmente ocorreram.

---

### 41. Desafio: idempotência

Narrativa:

- risco;
- modelagem;
- conflito;
- replay;
- transação;
- teste.

---

### 42. Desafio: resultado ambíguo

Explique por que timeout não é recusa.

---

### 43. Desafio: consistência eventual

Explique read model, polling, freshness e lag.

---

### 44. Desafio: tenant isolation

Explique propagação e testes cross-tenant.

---

### 45. Desafio: concorrência

Explique optimistic locking e conflitos.

---

### 46. Desafio: recuperação de mensagens

Explique retry, DLQ, replay e runbook.

---

### 47. Desafio: manter artifacts coerentes

Explique OpenAPI, Postman, reports, evidence e correção final.

---

## Resultados e evidências

### 48. Criar Results and Evidence

Arquivo:

```text
docs/portfolio/RESULTS_AND_EVIDENCE.md
```

---

### 49. Separar resultado de atividade

Atividade:

```text
criei testes.
```

Resultado:

```text
as invariantes,
boundaries,
contratos
e cenarios negativos
passaram a possuir regressao automatizada.
```

---

### 50. Usar números somente quando atuais

Exemplos possíveis:

- quantidade de módulos;
- testes;
- operações OpenAPI;
- cenários Postman;
- findings resolvidos;
- gates;
- latência medida;
- throughput observado.

Os números precisam vir de reports.

---

### 51. Criar tabela de evidências

Colunas:

- claim;
- artifact;
- caminho;
- o que prova;
- limitação.

---

### 52. Selecionar evidência de arquitetura

Use:

- module graph;
- architecture tests;
- report;
- ADR.

---

### 53. Selecionar evidência de confiabilidade

Use:

- integration tests;
- Outbox evidence;
- Kafka evidence;
- runbook.

---

### 54. Selecionar evidência de segurança

Use:

- JWT matrix;
- tenant tests;
- IDOR tests;
- secret scan.

---

### 55. Selecionar evidência de operação

Use:

- Docker;
- CI/CD;
- deployment simulation;
- local guide;
- runbook.

---

### 56. Selecionar evidência de performance

Use baseline com limitações.

---

## Limitações

### 57. Criar Limitations and Scope

Arquivo:

```text
docs/portfolio/LIMITATIONS_AND_SCOPE.md
```

---

### 58. Registrar ambiente simulado

O projeto não deve ser apresentado como produção real.

---

### 59. Registrar providers simulados

---

### 60. Registrar capacidade básica

Não é benchmark definitivo.

---

### 61. Registrar alta disponibilidade não validada

---

### 62. Registrar dados sintéticos

---

### 63. Registrar finalidade educacional e demonstrativa

Isso não reduz a profundidade técnica.

---

### 64. Registrar itens fora de escopo

Exemplos:

- multi-region;
- disaster recovery completo;
- provider real;
- SLA contratual;
- operação 24x7 real;
- cobrança financeira real.

---

## Aprendizados

### 65. Criar Learning Outcomes

Arquivo:

```text
docs/portfolio/LEARNING_OUTCOMES.md
```

---

### 66. Separar aprendizado técnico

- Java;
- Spring;
- domínio;
- SQL;
- Kafka;
- segurança;
- testes;
- observabilidade;
- containers;
- pipelines.

---

### 67. Separar aprendizado de engenharia

- trade-offs;
- boundaries;
- confiabilidade;
- operação;
- documentação;
- evidência;
- comunicação.

---

### 68. Separar aprendizado de processo

- baseline;
- gates;
- corrections;
- refactoring;
- runbooks;
- scope control.

---

### 69. Registrar mudança de entendimento

Exemplo:

```text
antes eu tratava retry como resposta generica;
depois passei a separar erro transitorio,
permanente
e resultado ambiguo.
```

---

## Narrativa longa

### 70. Criar Long Form Narrative

Arquivo:

```text
docs/portfolio/PROJECT_LONG_FORM_NARRATIVE.md
```

---

### 71. Estruturar abertura

Abertura:

- cenário;
- problema;
- objetivo;
- por que o projeto importa.

---

### 72. Estruturar desenvolvimento

Capítulos:

1. domínio;
2. arquitetura;
3. persistência;
4. mensageria;
5. integrações;
6. segurança;
7. observabilidade;
8. testes;
9. entrega;
10. operação.

---

### 73. Estruturar clímax técnico

Escolha um desafio que una o sistema.

Exemplo:

```text
pagamento recusado
apos estoque reservado,
com compensacao,
mensageria,
idempotencia
e projection.
```

---

### 74. Estruturar fechamento

Inclua:

- resultados;
- limitações;
- aprendizados;
- próximos passos.

---

### 75. Evitar capítulo por tecnologia

A história segue o problema.

---

### 76. Inserir links contextuais

Links aparecem quando ajudam o leitor.

---

## Página de portfólio

### 77. Criar Portfolio Page Draft

Arquivo:

```text
docs/portfolio/PORTFOLIO_PAGE_DRAFT.md
```

Seções:

- hero;
- resumo;
- problema;
- solução;
- arquitetura;
- decisões;
- resultados;
- evidências;
- stack;
- links;
- aprendizados.

---

### 78. Criar hero

Inclua:

- nome;
- one-liner;
- tecnologias principais;
- links para repositório, documentação e demonstração disponível.

Não invente URL.

---

### 79. Criar cards de destaque

Cards possíveis:

- idempotência;
- mensageria;
- segurança;
- observabilidade;
- testes;
- operação.

---

### 80. Evitar excesso visual

O conteúdo técnico permanece legível.

---

## Visual assets

### 81. Criar Visual Asset Catalog

Arquivo:

```text
docs/portfolio/VISUAL_ASSET_CATALOG.md
```

Assets:

- diagrama de contexto;
- sequência principal;
- module graph;
- dashboard;
- OpenAPI;
- Postman;
- pipeline;
- deployment simulation.

---

### 82. Definir legenda

Cada imagem precisa responder:

```text
o que o leitor deve observar?
```

---

### 83. Validar dados

Nenhuma imagem contém:

- secret;
- tenant real;
- e-mail real;
- endpoint privado;
- dado pessoal.

---

### 84. Evitar screenshot de código como prova principal

Prefira link para código.

---

## Roteiro de demonstração

### 85. Criar Demonstration Script

Arquivo:

```text
docs/portfolio/DEMONSTRATION_SCRIPT.md
```

Duração sugerida:

```text
8 a 12 minutos.
```

---

### 86. Estruturar demonstração

1. pitch;
2. arquitetura;
3. OpenAPI;
4. registro;
5. replay;
6. journey;
7. observabilidade;
8. testes;
9. CI/CD;
10. evidências.

---

### 87. Preparar ambiente

Antes da demonstração:

- health;
- dados;
- token;
- collection;
- dashboards;
- logs;
- fallback.

---

### 88. Criar fallback

Quando o ambiente não estiver disponível, use:

- evidence;
- reports;
- screenshots;
- gravação autorizada;
- artifacts.

---

### 89. Não depender de improviso

---

## Roteiro oral

### 90. Criar Oral Presentation Script

Arquivo:

```text
docs/portfolio/ORAL_PRESENTATION_SCRIPT.md
```

Versões:

- 60 segundos;
- 3 minutos;
- 10 minutos.

---

### 91. Criar abertura oral

Comece pelo problema.

---

### 92. Criar transições

Exemplo:

```text
definido o problema de duplicidade,
a proxima decisao foi garantir
que banco e mensageria
nao divergissem silenciosamente.
```

---

### 93. Criar fechamento oral

Finalize com:

- resultado;
- aprendizado;
- valor demonstrado;
- link para evidência.

---

### 94. Gravar ensaio

Avalie:

- clareza;
- ritmo;
- vícios;
- jargão;
- duração;
- precisão.

---

## Story bank para entrevistas

### 95. Criar Interview Story Bank

Arquivo:

```text
docs/portfolio/INTERVIEW_STORY_BANK.md
```

Histórias:

- decisão difícil;
- bug crítico;
- falha de design;
- trade-off;
- teste que evitou regressão;
- incidente simulado;
- refatoração;
- aprendizado.

---

### 96. Usar estrutura STAR adaptada

```text
Situation;

Task;

Action;

Result;

Evidence;

Learning.
```

---

### 97. Criar história de erro

Uma narrativa forte inclui algo que precisou ser corrigido.

---

### 98. Criar história de simplificação

Explique uma abstração removida.

---

### 99. Criar história de segurança

Explique cross-tenant ou mass assignment.

---

### 100. Criar história de operação

Explique backlog, lag ou runbook.

---

## Validação de claims

### 101. Criar `collect-portfolio-sources.ps1`

Colete:

- README;
- ADRs;
- reports;
- evidence;
- diagrams;
- OpenAPI;
- Postman;
- performance;
- runbook.

---

### 102. Criar `validate-portfolio-claims.ps1`

Cada claim importante precisa apontar para fonte.

---

### 103. Classificar claims

Categorias:

- implemented;
- tested;
- simulated;
- measured;
- documented;
- planned.

---

### 104. Proibir transformação de planned em implemented

---

### 105. Validar termos de maturidade

Use:

- demonstrativo;
- simulado;
- controlado;
- validado;
- medido.

Evite:

- enterprise-ready;
- production-proven;
- infinitely scalable.

---

## Links e assets

### 106. Criar validator de links

Valide paths relativos.

---

### 107. Criar validator de assets

Valide:

- existência;
- formato;
- tamanho;
- alt text;
- segurança.

---

### 108. Criar validator de evidence

---

### 109. Criar secret scan

Inclua texto, images metadata e arquivos exportados quando possível.

---

## Governança

### 110. Criar Portfolio Review Checklist

Arquivo:

```text
docs/portfolio/PORTFOLIO_REVIEW_CHECKLIST.md
```

Perguntas:

- problema aparece antes da stack?
- claims possuem evidência?
- trade-offs estão explícitos?
- limitações estão honestas?
- narrativa é compreensível?
- números são atuais?
- links funcionam?
- assets são seguros?
- versões curta e longa concordam?
- defesa formal não foi antecipada?

---

### 111. Criar Portfolio Matrix

Arquivo:

```text
docs/portfolio/PORTFOLIO_MATRIX.md
```

Colunas:

- mensagem;
- audiência;
- versão;
- claim;
- evidence;
- asset;
- link;
- status.

---

### 112. Criar Risk Register

Arquivo:

```text
docs/portfolio/PORTFOLIO_RISK_REGISTER.md
```

Riscos:

```text
exagero;

claim sem evidence;

numero antigo;

stack como protagonista;

trade-off oculto;

limitacao omitida;

URL inventada;

asset sensivel;

texto longo sem estrutura;

defesa antecipada.
```

---

### 113. Criar Traceability

Arquivo:

```text
docs/portfolio/PORTFOLIO_TRACEABILITY.md
```

Exemplo:

```text
claim: reliable messaging
-> Outbox ADR
-> integration test
-> messaging evidence
-> runbook.

claim: tenant isolation
-> security matrix
-> cross-tenant test
-> security evidence.

claim: measured capacity
-> performance report
-> performance evidence
-> limitations.
```

---

### 114. Criar boundary da próxima aula

Arquivo:

```text
docs/portfolio/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 702 define:

- project one-liner;
- elevator pitch;
- medium summary;
- long-form narrative;
- problem context;
- solution overview;
- decision stories;
- trade-off stories;
- technical challenges;
- results and evidence;
- limitations;
- learning outcomes;
- portfolio page draft;
- demonstration script;
- oral presentation;
- interview story bank;
- claim validation.

A aula 703 define:

- engineering decision defense;
- alternative comparison;
- objection handling;
- architecture questioning;
- security questioning;
- reliability questioning;
- performance questioning;
- operations questioning;
- evidence-based answers;
- limits and uncertainty;
- formal technical defense.

Nenhuma defesa formal das decisoes
e realizada nesta aula.
```

---

## Revisão da narrativa

### 115. Executar revisão factual

Compare com artifacts.

---

### 116. Executar revisão técnica

Peça que cada decisão responda:

- por quê?
- alternativa?
- custo?
- risco?
- evidência?

---

### 117. Executar revisão de clareza

Remova:

- jargão desnecessário;
- frase longa;
- repetição;
- sigla não explicada;
- afirmação vaga.

---

### 118. Executar revisão de honestidade

Confirme:

- simulação identificada;
- limitações presentes;
- números atuais;
- nenhuma promessa absoluta.

---

### 119. Executar revisão oral

Leia as versões curtas e médias.

---

### 120. Executar revisão visual

Confirme ordem, legendas e legibilidade.

---

### 121. Criar report

Arquivo:

```text
reports/portfolio-narrative-report.yaml
```

Exemplo:

```yaml
portfolioNarrative:
  versions:
    oneLiner:
      PASS
    elevatorPitch:
      PASS
    mediumSummary:
      PASS
    longForm:
      PASS
    oral:
      PASS

  claims:
    total:
      32
    evidenceBacked:
      32
    unsupported:
      0

  decisions:
    selected:
      9

  tradeOffs:
    documented:
      8

  assets:
    total:
      7
    invalid:
      0

  engineeringDefense:
    completed:
      false

  gate:
    PASS
```

Os números precisam vir do conteúdo real.

---

### 122. Criar evidence

Arquivo:

```text
contracts/portfolio-narrative-evidence.yaml
```

Campos:

- lesson;
- project;
- one-liner status;
- elevator pitch status;
- medium summary status;
- long-form status;
- portfolio page status;
- oral script status;
- demonstration script status;
- interview story count;
- decision story count;
- trade-off story count;
- challenge count;
- result claim count;
- evidence-backed claim count;
- unsupported claim count;
- limitation count;
- learning outcome count;
- asset count;
- invalid asset count;
- broken link count;
- secret leak count;
- measured claim count;
- simulated claim count;
- planned claim count;
- engineering defense completed;
- documentation status;
- gate status;
- timestamp.

---

### 123. Criar gate da narrativa

Status:

```text
PASS;

FAIL_PORTFOLIO_STRUCTURE;

FAIL_ONE_LINER;

FAIL_ELEVATOR_PITCH;

FAIL_MEDIUM_SUMMARY;

FAIL_LONG_FORM;

FAIL_PROBLEM_CONTEXT;

FAIL_SOLUTION_OVERVIEW;

FAIL_DECISION_STORY;

FAIL_TRADE_OFF_STORY;

FAIL_TECHNICAL_CHALLENGE;

FAIL_RESULTS_EVIDENCE;

FAIL_LIMITATIONS;

FAIL_LEARNING_OUTCOME;

FAIL_PORTFOLIO_PAGE;

FAIL_DEMONSTRATION_SCRIPT;

FAIL_ORAL_SCRIPT;

FAIL_INTERVIEW_STORY;

FAIL_UNSUPPORTED_CLAIM;

FAIL_OUTDATED_NUMBER;

FAIL_LINK;

FAIL_ASSET;

FAIL_SECRET_LEAK;

FAIL_EXAGGERATION;

FAIL_ENGINEERING_DEFENSE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 124. Executar validação final

Execute:

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\portfolio\collect-portfolio-sources.ps1

.\scripts\portfolio\validate-portfolio-claims.ps1

.\scripts\portfolio\validate-portfolio-links.ps1

.\scripts\portfolio\validate-portfolio-assets.ps1

.\scripts\portfolio\validate-evidence-references.ps1

.\scripts\portfolio\collect-portfolio-evidence.ps1
```

Confirme:

- versões coerentes;
- claims comprovadas;
- trade-offs explícitos;
- limitações presentes;
- assets seguros;
- links válidos;
- defesa formal preservada para a aula 703.

---

### 125. Encerrar o laboratório

Confirme:

- Charter;
- audience map;
- one-liner;
- elevator pitch;
- summary;
- problem;
- solution;
- decision stories;
- trade-offs;
- challenges;
- results;
- evidence;
- limitations;
- learnings;
- long-form;
- portfolio page;
- visuals;
- demonstration;
- oral versions;
- story bank;
- claim validation;
- checklist;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 703 preservada.

---

## Entendendo o que foi feito

### O projeto ganhou uma história clara

O leitor entende o problema antes da tecnologia.

### Decisões ganharam contexto

Arquitetura, Outbox, Kafka, segurança e observabilidade deixaram de ser uma lista.

### Trade-offs aumentaram credibilidade

Benefícios e custos aparecem juntos.

### Resultados ficaram ligados a evidence

Afirmações possuem artifacts verificáveis.

### Limitações mostraram maturidade

Simulação e ambiente controlado foram apresentados corretamente.

### O portfólio ganhou várias profundidades

One-liner, pitch, resumo, texto longo e apresentação oral contam a mesma história.

### A demonstração ganhou roteiro

A apresentação deixou de depender de improviso.

### Entrevistas ganharam um banco de histórias

Decisões, erros, correções e aprendizados podem ser recuperados com clareza.

---

## Erros comuns importantes

### Começar pela stack

O problema desaparece.

### Dizer que tudo foi perfeito

A narrativa perde credibilidade.

### Usar número antigo

A evidence deixa de corresponder.

### Esconder trade-off

A decisão parece superficial.

### Omitir limitação

O projeto parece exagerado.

### Inventar produção real

A claim é falsa.

### Mostrar apenas screenshots

Não existe prova reproduzível.

### Criar texto igual para todas as audiências

Profundidade fica inadequada.

### Usar jargão sem explicar

O leitor não acompanha.

### Iniciar defesa formal agora

Essa etapa pertence à aula 703.

---

## Comandos úteis

### Coletar fontes

```powershell
.\scripts\portfolio\collect-portfolio-sources.ps1
```

### Validar claims

```powershell
.\scripts\portfolio\validate-portfolio-claims.ps1
```

### Validar links e assets

```powershell
.\scripts\portfolio\validate-portfolio-links.ps1

.\scripts\portfolio\validate-portfolio-assets.ps1
```

### Coletar evidence

```powershell
.\scripts\portfolio\collect-portfolio-evidence.ps1
```

---

## Exercício principal

Crie a narrativa do cenário:

```text
pagamento recusado
apos estoque reservado,
com compensacao
e consistencia eventual.
```

Inclua:

1. contexto;
2. problema;
3. risco;
4. aggregate;
5. estado;
6. Outbox;
7. Kafka;
8. provider;
9. operation ID;
10. recusa;
11. result event;
12. Inbox;
13. compensation;
14. projection;
15. polling;
16. correlation;
17. trace;
18. teste unitário;
19. teste de integração;
20. Postman;
21. performance;
22. runbook;
23. trade-off;
24. limitação;
25. evidence;
26. aprendizado.

Não faça a defesa formal da decisão.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 701 e ponte para a aula 703 foram preservadas;
- Portfolio Narrative Charter foi criado;
- Audience and Context Map foi criado;
- necessidades por audiência foram definidas;
- mapa de profundidade foi criado;
- Project One-Liner foi criado;
- one-liner foi validado;
- superlativos foram evitados;
- Elevator Pitch foi criado;
- versão oral curta foi criada;
- leitura em voz alta foi realizada;
- Project Summary foi criado;
- resumo foi estruturado;
- stack list isolada foi evitada;
- Problem Context foi criado;
- jornada foi explicada;
- riscos distribuídos foram explicados;
- CRUD foi diferenciado;
- objetivo de engenharia foi definido;
- Solution Overview foi criado;
- domínio foi apresentado;
- aplicação foi apresentada;
- infraestrutura foi apresentada;
- operação foi apresentada;
- Decision Story Map foi criado;
- arquitetura hexagonal foi narrada;
- PostgreSQL foi narrado;
- Outbox foi narrada;
- Inbox foi narrada;
- Kafka foi narrado;
- ACL foi narrada;
- JWT multi-tenant foi narrado;
- OpenTelemetry foi narrado;
- build once foi narrado;
- Trade-Off Story Map foi criado;
- trade-off da Outbox foi criado;
- trade-off do Kafka foi criado;
- trade-off modular foi criado;
- trade-off de segurança foi criado;
- trade-off de observabilidade foi criado;
- trade-off de testes foi criado;
- Technical Challenges foi criado;
- idempotência foi narrada;
- ambiguidade foi narrada;
- consistência eventual foi narrada;
- tenant isolation foi narrado;
- concorrência foi narrada;
- recuperação foi narrada;
- artifacts coerentes foram narrados;
- Results and Evidence foi criado;
- resultado foi separado de atividade;
- números atuais foram usados;
- tabela de evidências foi criada;
- evidência de arquitetura foi selecionada;
- evidência de confiabilidade foi selecionada;
- evidência de segurança foi selecionada;
- evidência de operação foi selecionada;
- evidência de performance foi selecionada;
- Limitations and Scope foi criado;
- ambiente simulado foi registrado;
- providers simulados foram registrados;
- capacidade básica foi registrada;
- alta disponibilidade não validada foi registrada;
- dados sintéticos foram registrados;
- finalidade demonstrativa foi registrada;
- fora de escopo foi registrado;
- Learning Outcomes foi criado;
- aprendizados técnicos foram separados;
- aprendizados de engenharia foram separados;
- aprendizados de processo foram separados;
- mudança de entendimento foi registrada;
- Long Form Narrative foi criada;
- abertura foi estruturada;
- desenvolvimento foi estruturado;
- clímax técnico foi estruturado;
- fechamento foi estruturado;
- capítulos por tecnologia foram evitados;
- links contextuais foram usados;
- Portfolio Page Draft foi criado;
- hero foi criado;
- cards foram criados;
- excesso visual foi evitado;
- Visual Asset Catalog foi criado;
- legendas foram criadas;
- dados sensíveis foram removidos;
- screenshot de código não foi prova principal;
- Demonstration Script foi criado;
- demonstração foi estruturada;
- ambiente foi preparado;
- fallback foi criado;
- improviso foi reduzido;
- Oral Presentation Script foi criado;
- versões orais foram criadas;
- abertura oral foi criada;
- transições foram criadas;
- fechamento oral foi criado;
- ensaio foi gravado;
- Interview Story Bank foi criado;
- STAR adaptado foi usado;
- história de erro foi criada;
- história de simplificação foi criada;
- história de segurança foi criada;
- história de operação foi criada;
- collector de fontes foi criado;
- claim validator foi criado;
- claims foram classificadas;
- planned não virou implemented;
- termos de maturidade foram validados;
- links foram validados;
- assets foram validados;
- evidence foi validada;
- secret scan foi executado;
- Review Checklist foi criado;
- Portfolio Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 703 foi criado;
- revisão factual foi executada;
- revisão técnica foi executada;
- revisão de clareza foi executada;
- revisão de honestidade foi executada;
- revisão oral foi executada;
- revisão visual foi executada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- defesa de decisões não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\portfolio\validate-portfolio-claims.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/portfolio `
  scripts/portfolio `
  reports/portfolio-narrative-report.yaml `
  contracts/portfolio-narrative-evidence.yaml `
  docs/assets `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-proven|infinitely-scalable|realTenant|realCustomer|formal-defense-script"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(portfolio): narrate OrderFlow engineering journey"
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

- claim sem evidence;
- URL inventada;
- dado real;
- exagero;
- defesa formal da aula 703.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou a narrativa técnica de portfólio do OrderFlow.

Você produziu:

```text
one-liner;

elevator pitch;

medium summary;

long-form narrative;

problem context;

solution overview;

decision stories;

trade-off stories;

technical challenges;

results and evidence;

limitations;

learning outcomes;

portfolio page;

visual catalog;

demonstration script;

oral presentation;

interview story bank;

portfolio report;

portfolio evidence.
```

O projeto agora pode ser apresentado com clareza, honestidade e profundidade.

A próxima aula será:

```text
703 - M20.33 - Defesa de decisoes engenharia
```

Nela, você aprenderá a sustentar decisões sob questionamento, comparar alternativas, responder objeções, admitir limites, usar evidências e demonstrar raciocínio de engenharia.

Nenhuma defesa formal das decisões foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei one-liner.
- [ ] Criei elevator pitch.
- [ ] Criei resumo médio.
- [ ] Criei narrativa longa.
- [ ] Expliquei problema e solução.
- [ ] Selecionei decisões.
- [ ] Registrei trade-offs.
- [ ] Selecionei desafios.
- [ ] Liguei resultados a evidence.
- [ ] Declarei limitações.
- [ ] Registrei aprendizados.
- [ ] Criei página de portfólio.
- [ ] Criei roteiro de demonstração.
- [ ] Criei roteiro oral.
- [ ] Preservei defesa para a aula 703.

---

## Troubleshooting adicional

### Narrativa parece lista de tecnologias

Volte ao problema e às decisões.

### Pitch ficou longo

Remova detalhes e mantenha o arco principal.

### Claim não possui evidence

Remova ou produza prova antes de publicar.

### Número diverge do report

Use o valor atual ou omita.

### Trade-off parece fraqueza

Explique por que o custo foi aceito.

### Limitação domina o texto

Apresente escopo com equilíbrio.

### Demonstração depende de ambiente frágil

Crie fallback com evidence.

### Texto oral soa artificial

Simplifique a linguagem.

### Assets estão desatualizados

Regenere a partir do estado final.

### Quero treinar perguntas difíceis

Essa etapa pertence à aula 703.

---

## Perguntas de revisão

1. O que é narrativa técnica?
2. Tecnologia é protagonista?
3. Claim precisa de quê?
4. Trade-off diminui o projeto?
5. Limitação deve ser escondida?
6. O que one-liner precisa conter?
7. O que elevator pitch precisa fazer?
8. Por que criar versões diferentes?
9. O que Decision Story Map organiza?
10. O que mostrar em resultados?
11. Atividade e resultado são iguais?
12. Quando usar números?
13. O que é clímax técnico?
14. Por que criar fallback?
15. O que STAR adaptado inclui?
16. Planned pode virar implemented?
17. O que significa measured?
18. O que validar nos assets?
19. Por que ler o texto em voz alta?
20. O que a narrativa longa encerra?
21. O que evidence demonstra?
22. O que a aula 703 fará?
23. O que não foi realizado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. História de problema, decisões e resultados.
2. Não.
3. Evidence.
4. Não.
5. Não.
6. Nome, problema e diferencial.
7. Explicar valor rapidamente.
8. Contextos diferentes.
9. Decisões e provas.
10. Impacto comprovado.
11. Não.
12. Quando atuais e verificáveis.
13. Desafio que une o sistema.
14. Reduzir risco de demo.
15. Situação, ação, resultado, evidence e aprendizado.
16. Não.
17. Resultado observado.
18. Segurança, legibilidade e origem.
19. Testar clareza.
20. Resultados e aprendizados.
21. Que a claim é real.
22. Defesa de decisões.
23. Defesa formal.
24. Defesa de decisoes engenharia.
25. Conectar problema, decisão, resultado e prova.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 702 - M20.32 - Narrativa tecnica portfolio

- Continuei após Refatoração arquitetural final.
- Criei Portfolio Narrative Charter.
- Criei Audience and Context Map.
- Defini necessidades por audiência.
- Criei mapa de profundidade.
- Criei Project One-Liner.
- Validei one-liner.
- Evitei superlativos.
- Criei Elevator Pitch.
- Criei versão oral curta.
- Testei leitura em voz alta.
- Criei Project Summary.
- Estruturei o resumo.
- Evitei stack list isolada.
- Criei Problem Context.
- Expliquei jornada e riscos.
- Diferenciei o projeto de CRUD.
- Defini objetivo de engenharia.
- Criei Solution Overview.
- Apresentei domínio, aplicação, infraestrutura e operação.
- Criei Decision Story Map.
- Narrei arquitetura hexagonal.
- Narrei PostgreSQL.
- Narrei Outbox e Inbox.
- Narrei Kafka.
- Narrei ACL.
- Narrei JWT multi-tenant.
- Narrei OpenTelemetry.
- Narrei build once.
- Criei Trade-Off Story Map.
- Registrei trade-offs de Outbox, Kafka, modularidade, segurança, observabilidade e testes.
- Criei Technical Challenges.
- Narrei idempotência.
- Narrei resultados ambíguos.
- Narrei consistência eventual.
- Narrei tenant isolation.
- Narrei concorrência.
- Narrei recuperação.
- Narrei consistência de artifacts.
- Criei Results and Evidence.
- Diferenciei atividade de resultado.
- Usei números atuais.
- Criei tabela de evidências.
- Selecionei provas de arquitetura, confiabilidade, segurança, operação e performance.
- Criei Limitations and Scope.
- Registrei simulação, providers, capacidade, disponibilidade e dados sintéticos.
- Registrei fora de escopo.
- Criei Learning Outcomes.
- Separei aprendizados técnicos, de engenharia e de processo.
- Registrei mudanças de entendimento.
- Criei Long Form Narrative.
- Estruturei abertura, desenvolvimento, clímax e fechamento.
- Evitei capítulos por tecnologia.
- Criei Portfolio Page Draft.
- Criei hero e cards.
- Criei Visual Asset Catalog.
- Criei legendas e validei dados.
- Criei Demonstration Script.
- Estruturei demonstração e fallback.
- Criei Oral Presentation Script.
- Criei versões de 60 segundos, 3 minutos e 10 minutos.
- Criei abertura, transições e fechamento.
- Gravei ensaio.
- Criei Interview Story Bank.
- Usei STAR adaptado.
- Criei histórias de erro, simplificação, segurança e operação.
- Criei collector de fontes.
- Criei validator de claims.
- Classifiquei claims.
- Evitei transformar planned em implemented.
- Validei links, assets, evidence e secrets.
- Criei Review Checklist.
- Criei Portfolio Matrix.
- Criei Portfolio Risk Register.
- Criei Portfolio Traceability.
- Criei boundary para a aula 703.
- Executei revisões factual, técnica, de clareza, honestidade, oral e visual.
- Criei report, evidence e gate.
- Não antecipei defesa formal.
- Próxima aula: Defesa de decisoes engenharia.
```

---

## Referência técnica curta

- Technical Narrative.
- Portfolio.
- One-Liner.
- Elevator Pitch.
- Long-Form Narrative.
- Decision Story.
- Trade-Off.
- Evidence.
- Claim.
- Limitation.
- Demonstration Script.
- Oral Presentation.
- Story Bank.
- STAR.
- Technical Challenge.
- Learning Outcome.
- Audience Map.
- Portfolio Page.

Regra final:

```text
A narrativa técnica de portfólio do OrderFlow deve transformar artifacts em uma história comprovável: audience map define recrutador, engenheiro, arquiteto, QA, DevOps and evaluator, versões de 15 segundos, 60 segundos, 5 minutos, 15 minutos e leitura profunda contam a mesma história, one-liner apresenta nome, problema e diferencial sem superlativo, elevator pitch liga jornada distribuída, falhas parciais, idempotência, Kafka, segurança, observabilidade and evidence, problem context explica estoque, pagamento, fulfillment, cancellation and reconciliation como desafio além de CRUD, solution overview apresenta domain, application, adapters, infrastructure and operations, decision stories explicam architecture, PostgreSQL, Outbox, Inbox, Kafka, ACL, JWT, OpenTelemetry and build once com alternativas e custos, trade-off map registra complexidade operacional, eventual consistency, modularidade, segurança, telemetry and test cost, challenges narram duplicate requests, ambiguous provider results, tenant isolation, concurrency, recovery and artifact drift, results usam somente números atuais extraídos de reports, evidence table liga claims a ADRs, tests, reports, contracts and runbooks, limitations identificam providers and deployment simulados, capacidade básica, dados sintéticos e itens fora de escopo, learning outcomes separam tecnologia, engenharia e processo, long-form narrative segue problema, decisões, clímax técnico, resultados e aprendizados, portfolio page, visual catalog, demonstration fallback, oral scripts and interview story bank mantêm coerência, claims são classificadas como implemented, tested, simulated, measured, documented or planned, validators bloqueiam exaggeration, outdated numbers, broken links, sensitive assets and unsupported claims, e o gate fecha narrativa, assets, report and evidence enquanto comparação sob objeção e defesa formal das decisões permanecem reservadas para a aula 703.
```
