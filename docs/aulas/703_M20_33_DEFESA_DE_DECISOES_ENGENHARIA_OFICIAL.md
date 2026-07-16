# 703 - M20.33 - Defesa de decisoes engenharia

## Apresentação da aula

Na aula 702, você transformou o OrderFlow em uma narrativa técnica de portfólio.

O projeto passou a possuir:

- one-liner;
- elevator pitch;
- resumo médio;
- narrativa longa;
- mapa de audiências;
- histórias de decisões;
- trade-offs;
- desafios técnicos;
- resultados ligados a evidências;
- limitações honestas;
- roteiro de demonstração;
- versões orais;
- banco de histórias para entrevistas;
- relatório e evidence da narrativa.

Agora você consegue contar o que construiu.

Nesta aula, você aprenderá a defender por que construiu dessa forma.

A diferença é importante.

Narrar é apresentar uma sequência coerente.

Defender é responder quando alguém pergunta:

- por que arquitetura hexagonal?
- por que PostgreSQL?
- por que Kafka?
- por que Outbox?
- por que não usar transação distribuída?
- por que não usar exatamente uma vez?
- por que JWT?
- como o tenant é isolado?
- como você evita duplicidade?
- como o sistema reage a timeout?
- como os consumers recuperam falhas?
- por que usar projection?
- como você prova que a solução funciona?
- qual é o gargalo?
- o que você faria diferente em produção?
- quais são as limitações?
- por que não escolheu uma solução mais simples?
- em que momento essa arquitetura seria exagerada?

Uma defesa técnica profissional não tenta convencer pela autoridade.

Ela convence por:

```text
contexto;

restricoes;

alternativas;

criterios;

decisao;

trade-offs;

evidencias;

limites.
```

Você não precisa provar que sua escolha é universalmente superior.

Você precisa demonstrar que ela foi adequada ao contexto, consciente dos custos e validada pelas evidências disponíveis.

Nesta aula, a defesa será construída para diferentes tipos de questionamento:

- arquitetura;
- modelagem de domínio;
- persistência;
- transações;
- mensageria;
- integrações;
- segurança;
- observabilidade;
- testes;
- performance;
- CI/CD;
- deploy;
- operação;
- documentação;
- portfólio.

Você também aprenderá a responder quando:

- não souber;
- a pergunta estiver incompleta;
- a premissa estiver errada;
- existirem alternativas igualmente válidas;
- a decisão depender de escala;
- o projeto possuir uma limitação real;
- uma escolha antiga já não for a melhor;
- o avaliador discordar.

A próxima aula será:

```text
704 - M20.34 - Preparacao GitHub
```

Na aula 704, você organizará o repositório para publicação: branch principal, histórico, commits, tags, releases, topics, descrição, licença, templates, secrets, assets, links, workflows e experiência pública.

Nesta aula, nenhum repositório será preparado ou publicado no GitHub.

O laboratório será:

```text
labs/m20/aula-703-defesa-de-decisoes-engenharia/orderflow-engineering-defense
```

Regra central:

```text
defender uma decisao
nao e dizer
que ela e perfeita;

e explicar
por que ela foi adequada,
quais custos trouxe,
como foi validada
e quando deveria mudar.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
700:
Correcao tecnica final parte 2.

701:
Refatoracao arquitetural final.

702:
Narrativa tecnica portfolio.

703:
Defesa de decisoes engenharia.

704:
Preparacao GitHub.

705:
Publicacao GitHub.
```

A aula 703 usa como fonte:

- narrativa técnica;
- ADRs;
- código;
- reports;
- evidence;
- OpenAPI;
- Postman;
- testes;
- performance baseline;
- runbook;
- deployment simulation;
- diagramas;
- decisões arquiteturais;
- limitações registradas.

A defesa não pode criar uma justificativa retroativa falsa.

Quando a decisão original foi tomada por simplicidade ou restrição didática, diga isso.

Quando uma alternativa não foi testada, não apresente comparação como fato medido.

Use expressões precisas:

```text
foi escolhido porque;

foi validado por;

naquele contexto;

com os dados disponiveis;

a principal limitacao e;

eu mudaria quando.
```

Evite:

```text
sempre;

nunca;

obviamente;

e a unica forma;

e infinitamente melhor;

nao existe risco.
```

---

## Objetivo prático

Será criada a estrutura:

```text
docs/engineering-defense
├── ENGINEERING_DEFENSE_CHARTER.md
├── DEFENSE_ANSWER_FRAMEWORK.md
├── CONTEXT_AND_CONSTRAINTS_MAP.md
├── DECISION_DEFENSE_CATALOG.md
├── ALTERNATIVE_COMPARISON_MATRIX.md
├── ARCHITECTURE_DEFENSE.md
├── DOMAIN_DEFENSE.md
├── PERSISTENCE_DEFENSE.md
├── TRANSACTION_DEFENSE.md
├── MESSAGING_DEFENSE.md
├── INTEGRATION_DEFENSE.md
├── SECURITY_DEFENSE.md
├── OBSERVABILITY_DEFENSE.md
├── TESTING_DEFENSE.md
├── PERFORMANCE_DEFENSE.md
├── CI_CD_DEFENSE.md
├── DEPLOYMENT_DEFENSE.md
├── OPERATIONS_DEFENSE.md
├── DOCUMENTATION_DEFENSE.md
├── LIMITS_AND_UNCERTAINTY.md
├── OBJECTION_HANDLING.md
├── TECHNICAL_CROSS_EXAMINATION.md
├── MOCK_DEFENSE_SCRIPT.md
├── DEFENSE_SCORECARD.md
├── DEFENSE_REVIEW_CHECKLIST.md
├── DEFENSE_MATRIX.md
├── DEFENSE_RISK_REGISTER.md
├── DEFENSE_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/engineering-defense
├── collect-decision-sources.ps1
├── validate-defense-claims.ps1
├── validate-alternative-comparisons.ps1
├── validate-defense-evidence.ps1
├── generate-defense-question-bank.ps1
├── generate-defense-report.ps1
└── collect-defense-evidence.ps1
```

Artifacts:

```text
reports/engineering-defense-report.yaml

contracts/engineering-defense-evidence.yaml
```

O catálogo principal será:

```text
docs/engineering-defense/DECISION_DEFENSE_CATALOG.md
```

---

## Conceito essencial

### Resposta técnica precisa de estrutura

Uma resposta improvisada pode começar correta e terminar contraditória.

Use uma estrutura repetível.

### Critério vem antes da alternativa

Antes de comparar Kafka com RabbitMQ, defina o que importava:

- retenção;
- replay;
- ordering;
- throughput;
- operação;
- experiência da equipe;
- custo.

Sem critérios, a comparação vira opinião.

### Evidência não elimina incerteza

Um teste local prova algo naquele ambiente.

Ele não prova qualquer escala ou cenário futuro.

### Limite bem declarado fortalece a defesa

Dizer “não medi isso” é melhor do que inventar.

### Mudança de decisão pode ser correta

Uma boa decisão depende do contexto.

Se o contexto muda, a escolha também pode mudar.

---

## Mão na massa guiada

### 1. Criar Engineering Defense Charter

Arquivo:

```text
docs/engineering-defense/ENGINEERING_DEFENSE_CHARTER.md
```

Princípios:

```text
context before choice;

criteria before comparison;

evidence before claim;

trade-offs are explicit;

uncertainty is admitted;

limits are documented;

answers stay concise first;

GitHub preparation belongs to lesson 704.
```

---

### 2. Criar Defense Answer Framework

Arquivo:

```text
docs/engineering-defense/DEFENSE_ANSWER_FRAMEWORK.md
```

Estrutura:

```text
1. contexto;
2. restricao;
3. criterio;
4. alternativas;
5. decisao;
6. trade-off;
7. evidencia;
8. limite;
9. gatilho de mudanca.
```

---

### 3. Criar versão curta da estrutura

Para respostas rápidas:

```text
escolhi X
porque o contexto exigia Y;
o custo principal foi Z;
validei com W;
eu revisaria a escolha quando Q.
```

---

### 4. Criar Context and Constraints Map

Arquivo:

```text
docs/engineering-defense/CONTEXT_AND_CONSTRAINTS_MAP.md
```

Restrições do OrderFlow:

- projeto educacional;
- ambiente controlado;
- providers simulados;
- dados sintéticos;
- Java 21;
- Spring Boot;
- PostgreSQL;
- Kafka;
- execução local e homologação simulada;
- foco em confiabilidade;
- tempo e escopo delimitados.

---

### 5. Separar restrição de preferência

Restrição:

```text
contrato precisava ser reproduzivel.
```

Preferência:

```text
eu conhecia melhor determinada biblioteca.
```

As duas podem influenciar, mas precisam ser nomeadas corretamente.

---

## Catálogo de decisões

### 6. Criar Decision Defense Catalog

Arquivo:

```text
docs/engineering-defense/DECISION_DEFENSE_CATALOG.md
```

Para cada decisão, registre:

- pergunta provável;
- contexto;
- critérios;
- alternativas;
- escolha;
- custos;
- evidência;
- limitação;
- gatilho de mudança.

---

### 7. Criar Alternative Comparison Matrix

Arquivo:

```text
docs/engineering-defense/ALTERNATIVE_COMPARISON_MATRIX.md
```

Colunas:

- decisão;
- alternativa A;
- alternativa B;
- critérios;
- evidência;
- escolha;
- condição de troca.

---

### 8. Não comparar caricaturas

Não descreva alternativa rejeitada como obviamente ruim.

Apresente o melhor argumento de cada lado.

---

## Defesa arquitetural

### 9. Criar Architecture Defense

Arquivo:

```text
docs/engineering-defense/ARCHITECTURE_DEFENSE.md
```

Perguntas:

- por que arquitetura hexagonal?
- por que vários módulos?
- por que não monólito simples?
- por que não microserviços separados?
- por que ports e adapters?
- por que architecture tests?

---

### 10. Defender arquitetura hexagonal

Resposta base:

```text
o problema possuia dominio,
persistencia,
mensageria,
HTTP
e providers externos.

a separacao permitiu
proteger regras,
testar casos de uso
e substituir adapters.

o custo foi mais wiring,
mais interfaces
e maior curva de leitura.
```

---

### 11. Explicar por que não microserviços completos

Contexto:

- complexidade distribuída já existia;
- objetivo era demonstrar boundaries;
- operação real de vários serviços aumentaria custo;
- modularidade interna era suficiente para o escopo.

---

### 12. Explicar por que não monólito em camadas simples

Uma arquitetura mais simples seria válida para CRUD pequeno.

No OrderFlow, mensageria, providers, idempotência e compensação justificaram boundaries mais explícitos.

---

### 13. Defender múltiplos runtimes

Runtimes separados isolam responsabilidades operacionais:

- API;
- publisher;
- orchestration;
- integration gateway;
- projection.

O custo é operação e observabilidade maiores.

---

### 14. Defender testes arquiteturais

Eles transformam convenção em regra executável.

O limite é que não provam qualidade de desenho sozinhos.

---

## Defesa do domínio

### 15. Criar Domain Defense

Arquivo:

```text
docs/engineering-defense/DOMAIN_DEFENSE.md
```

---

### 16. Defender aggregate

O aggregate centraliza invariantes e transições.

Pergunta contrária:

```text
por que nao deixar o service
alterar diretamente as entidades?
```

Resposta:

- evitar estados impossíveis;
- concentrar regra;
- testar sem infraestrutura;
- emitir eventos consistentes.

---

### 17. Defender state machine explícita

Estados explícitos tornam transições observáveis e auditáveis.

O custo é maior modelagem.

---

### 18. Defender value objects

Use quando o conceito possui:

- validação;
- identidade semântica;
- operações;
- invariantes.

Não use wrapper apenas para aumentar quantidade de classes.

---

### 19. Defender compensação

Compensação representa novo efeito de negócio.

Não é rollback técnico da transação distribuída.

---

### 20. Defender resultado ambíguo

Timeout após envio não prova falha.

A defesa deve explicar reconciliation e operation ID.

---

## Persistência e transações

### 21. Criar Persistence Defense

Arquivo:

```text
docs/engineering-defense/PERSISTENCE_DEFENSE.md
```

---

### 22. Defender PostgreSQL

Critérios:

- transações;
- constraints;
- consulta;
- auditabilidade;
- maturidade;
- ferramentas.

Custos:

- escala vertical inicial;
- tuning;
- migrations;
- locks;
- pool.

---

### 23. Comparar com banco NoSQL

NoSQL poderia ajudar em outros padrões.

Para autoridade transacional e relações do domínio, PostgreSQL foi adequado.

---

### 24. Defender Flyway

Migrations versionadas tornam schema reproduzível.

O custo é disciplina e compatibilidade.

---

### 25. Criar Transaction Defense

Arquivo:

```text
docs/engineering-defense/TRANSACTION_DEFENSE.md
```

---

### 26. Defender transação local

Aggregate, audit e Outbox são persistidos juntos no banco.

Isso evita dual write sem exigir transação distribuída.

---

### 27. Explicar por que não 2PC

Custos:

- acoplamento;
- disponibilidade;
- suporte dos participantes;
- operação;
- latência.

Outbox foi mais adequada ao contexto.

---

### 28. Defender optimistic locking

Conflitos são esperados e detectáveis.

Pessimistic locking seria possível quando contenção e requisitos mudassem.

---

### 29. Defender idempotência persistente

Ela sobrevive a restart e múltiplas instâncias.

Cache apenas em memória não seria suficiente.

---

## Mensageria

### 30. Criar Messaging Defense

Arquivo:

```text
docs/engineering-defense/MESSAGING_DEFENSE.md
```

---

### 31. Defender Kafka

Critérios:

- retenção;
- replay;
- partitions;
- ordering por key;
- throughput;
- ecossistema.

Custos:

- operação;
- schema;
- lag;
- eventual consistency;
- DLQ.

---

### 32. Comparar com RabbitMQ

RabbitMQ poderia ser melhor em filas de trabalho simples e roteamento específico.

Kafka foi escolhido pela retenção e pelo modelo de eventos reproduzíveis.

---

### 33. Defender at-least-once

É uma semântica realista com consumers idempotentes.

Não prometa exactly-once global.

---

### 34. Defender Outbox

Explique dual write, claim, lease, publicação e monitoramento.

---

### 35. Defender Inbox

Deduplicação persistente reduz efeitos repetidos.

O custo é armazenamento e limpeza governada.

---

### 36. Defender ordering por aggregate ID

Mantém ordem por pedido sem serializar todo o sistema.

---

### 37. Defender retry topics

Retries assíncronos evitam bloquear consumer principal.

O custo é fluxo operacional adicional.

---

### 38. Defender DLQ

DLQ preserva mensagens terminais para triagem.

Ela não corrige a causa.

---

## Integrações

### 39. Criar Integration Defense

Arquivo:

```text
docs/engineering-defense/INTEGRATION_DEFENSE.md
```

---

### 40. Defender ACL

A Anti-Corruption Layer protege o domínio de contratos externos.

---

### 41. Defender operation ID

A mesma intenção externa reutiliza identidade estável.

Isso ajuda idempotência e reconciliação.

---

### 42. Defender timeout explícito

Sem timeout, o recurso pode ficar preso indefinidamente.

---

### 43. Defender retry seletivo

Retry só para erros transitórios e operações seguras.

---

### 44. Defender circuit breaker

Ele reduz pressão sobre provider indisponível.

Não substitui retry, timeout ou fallback.

---

### 45. Defender bulkhead

Isola recursos entre integrações.

O custo é capacidade reservada e configuração.

---

### 46. Defender provider simulado

Era adequado ao objetivo educacional.

A limitação é não provar comportamento de fornecedor real.

---

## Segurança

### 47. Criar Security Defense

Arquivo:

```text
docs/engineering-defense/SECURITY_DEFENSE.md
```

---

### 48. Defender OAuth2 Resource Server

Separar emissão de token e validação de recurso evita autenticação caseira.

---

### 49. Defender JWT

Permite validação local de claims.

Custos:

- revogação;
- rotação;
- clock;
- tamanho;
- proteção de keys.

---

### 50. Defender issuer e audience

Assinatura válida sozinha não garante que o token pertence à API correta.

---

### 51. Defender scopes e roles

Scope expressa permissão delegada.

Role expressa responsabilidade organizacional.

A combinação melhora controle contextual.

---

### 52. Defender tenant claim

Tenant autenticado reduz mass assignment e escolha arbitrária de contexto.

---

### 53. Defender `404` cross-tenant

Evita revelar existência do recurso.

---

### 54. Defender testes negativos

Segurança precisa provar negação, não apenas sucesso.

---

### 55. Defender secret scanning

Previne exposição em código, docs, reports e artifacts.

---

## Observabilidade

### 56. Criar Observability Defense

Arquivo:

```text
docs/engineering-defense/OBSERVABILITY_DEFENSE.md
```

---

### 57. Defender logs estruturados

Permitem busca e correlação.

Custos:

- volume;
- sanitização;
- schema.

---

### 58. Defender métricas

Métricas mostram tendência e saúde agregada.

Não substituem traces ou logs.

---

### 59. Defender traces

Traces conectam a jornada distribuída.

Custos:

- sampling;
- storage;
- overhead;
- cardinalidade.

---

### 60. Defender correlation ID

Ajuda suporte e auditoria.

Não substitui trace ID.

---

### 61. Defender SLOs

SLOs conectam experiência a sinais.

Eles precisam de baseline e revisão.

---

### 62. Defender runbooks

Alerts sem resposta definida aumentam improviso.

---

## Testes

### 63. Criar Testing Defense

Arquivo:

```text
docs/engineering-defense/TESTING_DEFENSE.md
```

---

### 64. Defender pirâmide e camadas

Unitários protegem regra.

Integração protege boundaries.

Contrato protege compatibilidade.

Postman protege consumo externo.

Performance protege capacidade básica.

---

### 65. Defender Testcontainers

Infraestrutura real reduz mocks enganadores.

Custos:

- tempo;
- Docker;
- flakiness ambiental;
- recursos.

---

### 66. Defender WireMock

Permite controlar respostas externas.

Não prova comportamento real do provider.

---

### 67. Defender mutation testing

Avalia força da suíte.

O custo de execução impede uso indiscriminado em todo commit.

---

### 68. Defender contract tests

Eles evitam drift entre implementação e consumidores.

---

### 69. Defender testes de segurança separados

Falhas de autorização precisam de visibilidade própria.

---

### 70. Defender smoke pós-deploy

Confirma jornada mínima no ambiente promovido.

---

## Performance

### 71. Criar Performance Defense

Arquivo:

```text
docs/engineering-defense/PERFORMANCE_DEFENSE.md
```

---

### 72. Defender p95 e p99

Média esconde cauda.

---

### 73. Defender baseline controlada

Ela permite comparação.

Não representa produção.

---

### 74. Defender medição assíncrona

API rápida pode gerar backlog.

Por isso foram medidos:

- Outbox age;
- consumer lag;
- projection freshness;
- journey duration.

---

### 75. Defender headroom

Capacidade segura não é pico máximo.

---

### 76. Explicar o que faltaria para produção

- soak prolongado;
- carga realista;
- múltiplas zonas;
- dados maiores;
- chaos;
- capacity planning contínuo;
- ambiente real.

---

## CI/CD e deploy

### 77. Criar CI CD Defense

Arquivo:

```text
docs/engineering-defense/CI_CD_DEFENSE.md
```

---

### 78. Defender quality gates

Eles impedem promover código sem provas mínimas.

---

### 79. Defender build once

O mesmo digest atravessa ambientes.

---

### 80. Defender SBOM

SBOM melhora inventário e resposta a vulnerabilidades.

---

### 81. Defender assinatura e provenance

Aumentam confiança na origem do artifact.

---

### 82. Criar Deployment Defense

Arquivo:

```text
docs/engineering-defense/DEPLOYMENT_DEFENSE.md
```

---

### 83. Defender homologação simulada

Ela valida processo e scripts.

Não prova operação real.

---

### 84. Defender rollout e rollback

Rollout reduz risco.

Rollback exige compatibilidade de schema.

---

### 85. Defender manifests por digest

Tag mutável não é evidência suficiente de identidade.

---

## Operação

### 86. Criar Operations Defense

Arquivo:

```text
docs/engineering-defense/OPERATIONS_DEFENSE.md
```

---

### 87. Defender health separado

Liveness responde se processo vive.

Readiness responde se pode receber tráfego.

Smoke responde se a jornada funciona.

---

### 88. Defender runbook por incidente

Sintomas diferentes exigem ações diferentes.

---

### 89. Defender evidence operacional

Timeline, logs, metrics e decisions melhoram auditoria.

---

### 90. Defender reset protegido

Ação destrutiva precisa de allowlist e confirmação.

---

## Documentação

### 91. Criar Documentation Defense

Arquivo:

```text
docs/engineering-defense/DOCUMENTATION_DEFENSE.md
```

---

### 92. Defender OpenAPI como fonte

Contrato HTTP executável reduz drift.

---

### 93. Defender Postman derivado

Collection executa o contrato e valida consumo.

---

### 94. Defender README curto

README orienta.

Guias especializados aprofundam.

---

### 95. Defender reports e evidence

Reports resumem execução.

Evidence liga resultado, commit e artifact.

---

## Limites e incerteza

### 96. Criar Limits and Uncertainty

Arquivo:

```text
docs/engineering-defense/LIMITS_AND_UNCERTAINTY.md
```

---

### 97. Criar resposta “não sei”

Estrutura:

```text
eu ainda nao medi isso;
o risco que eu investigaria e;
o experimento que eu faria e;
a decisao dependeria de.
```

---

### 98. Criar resposta “depende”

Explique as variáveis.

Não use “depende” como fuga.

---

### 99. Criar resposta para premissa incorreta

Exemplo:

```text
a premissa de exactly-once global
nao corresponde ao desenho;
o sistema trabalha com at-least-once
e idempotencia.
```

---

### 100. Criar resposta para decisão que mudaria

Informe gatilhos objetivos:

- escala;
- latência;
- custo;
- equipe;
- compliance;
- disponibilidade;
- domínio.

---

## Objeções

### 101. Criar Objection Handling

Arquivo:

```text
docs/engineering-defense/OBJECTION_HANDLING.md
```

---

### 102. Objeção: “isso está complexo demais”

Resposta:

- reconhecer custo;
- lembrar riscos do domínio;
- mostrar boundaries;
- explicar onde simplificaria em escopo menor.

---

### 103. Objeção: “Kafka é exagero”

Explique critérios e condição em que uma fila simples seria melhor.

---

### 104. Objeção: “muitos testes deixam o pipeline lento”

Explique camadas, seleção por pipeline e valor de regressão.

---

### 105. Objeção: “JWT não revoga bem”

Reconheça e explique duração, rotação e estratégia complementar.

---

### 106. Objeção: “Outbox duplica mensagens”

Reconheça at-least-once e explique Inbox/idempotência.

---

### 107. Objeção: “microserviços seriam mais escaláveis”

Escala não depende apenas de separar deploy.

Explique custos de distribuição.

---

### 108. Objeção: “por que não usar framework de saga?”

Explique controle explícito, escopo e custo de adoção.

---

## Cross-examination

### 109. Criar Technical Cross Examination

Arquivo:

```text
docs/engineering-defense/TECHNICAL_CROSS_EXAMINATION.md
```

Categorias:

- pergunta aberta;
- pergunta comparativa;
- cenário de falha;
- contradição;
- limitação;
- mudança de escala;
- auditoria de evidence.

---

### 110. Gerar banco de perguntas

Exemplos:

- o que acontece se o publisher cair após publicar?
- como evita duplicate provider call?
- onde o tenant é validado?
- quando a projection fica inconsistente?
- como rollback convive com migration?
- como prova que o contrato não mudou?

---

### 111. Responder com desenho

Use diagramas quando a explicação envolver fluxo.

---

### 112. Responder com evidence

Abra:

- teste;
- report;
- ADR;
- trace;
- metric;
- contract.

---

### 113. Evitar resposta longa sem checar a pergunta

Comece com uma frase direta.

Depois aprofunde.

---

## Simulação de defesa

### 114. Criar Mock Defense Script

Arquivo:

```text
docs/engineering-defense/MOCK_DEFENSE_SCRIPT.md
```

Duração:

```text
30 a 45 minutos.
```

---

### 115. Organizar banca simulada

Papéis:

- candidato;
- arquiteto;
- segurança;
- plataforma;
- QA;
- observador.

---

### 116. Criar sequência

1. pitch;
2. arquitetura;
3. confiabilidade;
4. segurança;
5. operação;
6. cenário inesperado;
7. limitações;
8. feedback.

---

### 117. Gravar a simulação

Avalie:

- precisão;
- clareza;
- concisão;
- evidence;
- postura;
- admissão de limites;
- contradições.

---

## Scorecard

### 118. Criar Defense Scorecard

Arquivo:

```text
docs/engineering-defense/DEFENSE_SCORECARD.md
```

Critérios de 1 a 5:

- contexto;
- critérios;
- alternativas;
- trade-offs;
- evidence;
- limite;
- clareza;
- concisão;
- consistência;
- postura.

---

### 119. Criar Review Checklist

Arquivo:

```text
docs/engineering-defense/DEFENSE_REVIEW_CHECKLIST.md
```

Perguntas:

- respondi a pergunta primeiro?
- expliquei contexto?
- citei alternativa real?
- reconheci custo?
- usei evidence?
- declarei limite?
- evitei absoluto?
- indiquei gatilho de mudança?
- mantive coerência com o projeto?
- evitei antecipar GitHub?

---

### 120. Criar Defense Matrix

Arquivo:

```text
docs/engineering-defense/DEFENSE_MATRIX.md
```

Colunas:

- decisão;
- pergunta;
- resposta curta;
- alternativa;
- trade-off;
- evidence;
- limite;
- score.

---

### 121. Criar Risk Register

Arquivo:

```text
docs/engineering-defense/DEFENSE_RISK_REGISTER.md
```

Riscos:

```text
resposta absoluta;

alternativa caricaturada;

claim sem evidence;

jargao excessivo;

resposta longa;

contradicao;

limitacao escondida;

numero antigo;

postura defensiva;

GitHub antecipado.
```

---

### 122. Criar Traceability

Arquivo:

```text
docs/engineering-defense/DEFENSE_TRACEABILITY.md
```

Exemplo:

```text
defesa de Outbox
-> ADR
-> integration test
-> messaging report
-> runbook.

defesa de tenant
-> security policy
-> cross-tenant test
-> security evidence.

defesa de performance
-> baseline report
-> capacity conclusion
-> limitations.
```

---

### 123. Criar boundary da próxima aula

Arquivo:

```text
docs/engineering-defense/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 703 define:

- answer framework;
- context and constraints;
- decision defense catalog;
- alternative comparison;
- architecture defense;
- domain defense;
- persistence defense;
- transaction defense;
- messaging defense;
- integration defense;
- security defense;
- observability defense;
- testing defense;
- performance defense;
- CI CD defense;
- deployment defense;
- operations defense;
- documentation defense;
- limits and uncertainty;
- objection handling;
- cross-examination;
- mock defense;
- scorecard.

A aula 704 define:

- GitHub preparation;
- repository audit;
- branch strategy;
- commit history review;
- tags;
- releases;
- topics;
- repository description;
- license;
- contributing guide;
- issue templates;
- pull request template;
- CODEOWNERS;
- security policy;
- Dependabot;
- Actions permissions;
- secret scanning;
- public assets;
- final links.

Nenhuma preparacao do repositorio GitHub
e realizada nesta aula.
```

---

## Validação da defesa

### 124. Criar collector de fontes

`collect-decision-sources.ps1` reúne ADRs, reports e evidence.

---

### 125. Validar claims

`validate-defense-claims.ps1` falha quando resposta afirma algo não provado.

---

### 126. Validar alternativas

A comparação precisa usar critérios equivalentes.

---

### 127. Validar evidence

Cada decisão principal precisa de pelo menos uma evidência.

---

### 128. Gerar question bank

O script cria perguntas a partir do catálogo.

---

### 129. Executar defesa simulada

Realize duas rodadas:

- amistosa;
- adversarial respeitosa.

---

### 130. Revisar gravação

Selecione três respostas para reescrever.

---

### 131. Criar report

Arquivo:

```text
reports/engineering-defense-report.yaml
```

Exemplo:

```yaml
engineeringDefense:
  decisions:
    catalogued:
      24
    evidenceBacked:
      24

  answers:
    reviewed:
      60
    unsupported:
      0
    contradictions:
      0

  mockDefense:
    rounds:
      2
    averageScore:
      measured

  GitHubPreparation:
    completed:
      false

  gate:
    PASS
```

O score precisa vir da simulação real.

---

### 132. Criar evidence

Arquivo:

```text
contracts/engineering-defense-evidence.yaml
```

Campos:

- lesson;
- project;
- decision count;
- question count;
- architecture answer count;
- domain answer count;
- persistence answer count;
- messaging answer count;
- integration answer count;
- security answer count;
- observability answer count;
- testing answer count;
- performance answer count;
- operations answer count;
- evidence-backed answer count;
- unsupported answer count;
- contradiction count;
- admitted uncertainty count;
- change trigger count;
- mock defense round count;
- average score;
- lowest criterion;
- highest criterion;
- broken evidence link count;
- secret leak count;
- GitHub preparation completed;
- documentation status;
- gate status;
- timestamp.

---

### 133. Criar gate da defesa

Status:

```text
PASS;

FAIL_DEFENSE_STRUCTURE;

FAIL_CONTEXT_MAP;

FAIL_ANSWER_FRAMEWORK;

FAIL_DECISION_CATALOG;

FAIL_ALTERNATIVE_COMPARISON;

FAIL_ARCHITECTURE_DEFENSE;

FAIL_DOMAIN_DEFENSE;

FAIL_PERSISTENCE_DEFENSE;

FAIL_TRANSACTION_DEFENSE;

FAIL_MESSAGING_DEFENSE;

FAIL_INTEGRATION_DEFENSE;

FAIL_SECURITY_DEFENSE;

FAIL_OBSERVABILITY_DEFENSE;

FAIL_TESTING_DEFENSE;

FAIL_PERFORMANCE_DEFENSE;

FAIL_CI_CD_DEFENSE;

FAIL_DEPLOYMENT_DEFENSE;

FAIL_OPERATIONS_DEFENSE;

FAIL_DOCUMENTATION_DEFENSE;

FAIL_UNCERTAINTY_HANDLING;

FAIL_OBJECTION_HANDLING;

FAIL_CROSS_EXAMINATION;

FAIL_MOCK_DEFENSE;

FAIL_UNSUPPORTED_CLAIM;

FAIL_CONTRADICTION;

FAIL_EVIDENCE;

FAIL_SECRET_LEAK;

FAIL_GITHUB_ANTICIPATION;

INCONCLUSIVE.
```

---

### 134. Executar validação final

Execute:

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\engineering-defense\collect-decision-sources.ps1

.\scripts\engineering-defense\validate-defense-claims.ps1

.\scripts\engineering-defense\validate-alternative-comparisons.ps1

.\scripts\engineering-defense\validate-defense-evidence.ps1

.\scripts\engineering-defense\collect-defense-evidence.ps1
```

Confirme:

- respostas estruturadas;
- alternativas honestas;
- evidence atual;
- limitações explícitas;
- zero contradição;
- preparação GitHub preservada para a aula 704.

---

### 135. Encerrar o laboratório

Confirme:

- Charter;
- framework;
- context map;
- catalog;
- comparison matrix;
- arquitetura;
- domínio;
- persistência;
- transações;
- mensageria;
- integrações;
- segurança;
- observabilidade;
- testes;
- performance;
- CI/CD;
- deploy;
- operação;
- documentação;
- incerteza;
- objeções;
- cross-examination;
- mock defense;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 704 preservada.

---

## Entendendo o que foi feito

### A narrativa ganhou sustentação

Você não apenas conta o projeto.

Você explica escolhas e custos.

### Alternativas passaram a ser comparadas por critérios

A defesa deixou de ser preferência pessoal.

### Evidências passaram a fazer parte da resposta

ADRs, testes, reports e traces sustentam afirmações.

### Limitações ficaram explícitas

Isso reduz exagero e aumenta confiança.

### Objeções viraram oportunidade

Questionamento técnico demonstra raciocínio.

### Incerteza ganhou resposta profissional

Não saber deixou de significar improvisar.

### Mudanças de contexto ganharam gatilhos

A decisão não é tratada como eterna.

### A simulação criou feedback

Clareza, concisão e consistência podem ser treinadas.

---

## Erros comuns importantes

### Responder com “porque é boa prática”

Não explica contexto.

### Dizer que alternativa é ruim sem critérios

A comparação fica fraca.

### Falar por vários minutos antes de responder

O avaliador perde o ponto.

### Esconder custo

A decisão parece superficial.

### Inventar número

A credibilidade é perdida.

### Negar limitação conhecida

A postura fica defensiva.

### Confundir experiência com prova

Conhecimento ajuda, mas evidence sustenta.

### Usar “depende” sem variáveis

A resposta evita a decisão.

### Prometer produção real

O projeto é demonstrativo.

### Preparar GitHub agora

Essa etapa pertence à aula 704.

---

## Comandos úteis

### Coletar fontes

```powershell
.\scripts\engineering-defense\collect-decision-sources.ps1
```

### Validar claims

```powershell
.\scripts\engineering-defense\validate-defense-claims.ps1
```

### Gerar perguntas

```powershell
.\scripts\engineering-defense\generate-defense-question-bank.ps1
```

### Coletar evidence

```powershell
.\scripts\engineering-defense\collect-defense-evidence.ps1
```

---

## Exercício principal

Defenda a decisão:

```text
usar Outbox,
Kafka
e consumers idempotentes
em vez de publicar diretamente
no broker
dentro do caso de uso.
```

Inclua:

1. contexto;
2. problema de dual write;
3. requisito;
4. alternativa direta;
5. alternativa 2PC;
6. escolha;
7. transação local;
8. registro Outbox;
9. publisher;
10. lease;
11. Kafka;
12. at-least-once;
13. Inbox;
14. idempotência;
15. ordering;
16. retry;
17. DLQ;
18. replay;
19. observabilidade;
20. testes;
21. custo;
22. limitação;
23. gatilho de mudança;
24. evidence;
25. resposta curta;
26. resposta longa.

Não prepare o repositório GitHub.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 702 e ponte para a aula 704 foram preservadas;
- Engineering Defense Charter foi criado;
- Answer Framework foi criado;
- versão curta foi criada;
- Context and Constraints Map foi criado;
- restrição e preferência foram separadas;
- Decision Defense Catalog foi criado;
- Alternative Comparison Matrix foi criada;
- alternativas não foram caricaturadas;
- Architecture Defense foi criada;
- arquitetura hexagonal foi defendida;
- microserviços completos foram comparados;
- monólito simples foi comparado;
- múltiplos runtimes foram defendidos;
- architecture tests foram defendidos;
- Domain Defense foi criada;
- aggregate foi defendido;
- state machine foi defendida;
- value objects foram defendidos;
- compensação foi defendida;
- resultado ambíguo foi defendido;
- Persistence Defense foi criada;
- PostgreSQL foi defendido;
- NoSQL foi comparado;
- Flyway foi defendido;
- Transaction Defense foi criada;
- transação local foi defendida;
- 2PC foi comparado;
- optimistic locking foi defendido;
- idempotência persistente foi defendida;
- Messaging Defense foi criada;
- Kafka foi defendido;
- RabbitMQ foi comparado;
- at-least-once foi defendido;
- Outbox foi defendida;
- Inbox foi defendida;
- ordering foi defendido;
- retry topics foram defendidos;
- DLQ foi defendida;
- Integration Defense foi criada;
- ACL foi defendida;
- operation ID foi defendido;
- timeout foi defendido;
- retry seletivo foi defendido;
- circuit breaker foi defendido;
- bulkhead foi defendido;
- provider simulado foi contextualizado;
- Security Defense foi criada;
- OAuth2 Resource Server foi defendido;
- JWT foi defendido;
- issuer e audience foram defendidos;
- scopes e roles foram defendidos;
- tenant claim foi defendida;
- `404` cross-tenant foi defendido;
- testes negativos foram defendidos;
- secret scanning foi defendido;
- Observability Defense foi criada;
- logs estruturados foram defendidos;
- métricas foram defendidas;
- traces foram defendidos;
- correlation foi defendida;
- SLOs foram defendidos;
- runbooks foram defendidos;
- Testing Defense foi criada;
- camadas de testes foram defendidas;
- Testcontainers foi defendido;
- WireMock foi defendido;
- mutation testing foi defendido;
- contract tests foram defendidos;
- security tests foram defendidos;
- smoke foi defendido;
- Performance Defense foi criada;
- p95 e p99 foram defendidos;
- baseline controlada foi defendida;
- medição assíncrona foi defendida;
- headroom foi defendido;
- lacunas para produção foram declaradas;
- CI CD Defense foi criada;
- quality gates foram defendidos;
- build once foi defendido;
- SBOM foi defendida;
- assinatura e provenance foram defendidas;
- Deployment Defense foi criada;
- homologação simulada foi contextualizada;
- rollout e rollback foram defendidos;
- manifests por digest foram defendidos;
- Operations Defense foi criada;
- health separado foi defendido;
- runbooks por incidente foram defendidos;
- evidence operacional foi defendida;
- reset protegido foi defendido;
- Documentation Defense foi criada;
- OpenAPI foi defendida;
- Postman foi defendido;
- README curto foi defendido;
- reports e evidence foram defendidos;
- Limits and Uncertainty foi criado;
- resposta “não sei” foi estruturada;
- resposta “depende” foi estruturada;
- premissa incorreta foi tratada;
- gatilhos de mudança foram definidos;
- Objection Handling foi criado;
- objeção de complexidade foi respondida;
- objeção sobre Kafka foi respondida;
- objeção sobre testes foi respondida;
- objeção sobre JWT foi respondida;
- objeção sobre Outbox foi respondida;
- objeção sobre microserviços foi respondida;
- objeção sobre saga foi respondida;
- Cross Examination foi criada;
- banco de perguntas foi criado;
- diagramas foram usados;
- evidence foi usada;
- respostas diretas foram praticadas;
- Mock Defense Script foi criado;
- banca simulada foi organizada;
- sequência foi criada;
- simulação foi gravada;
- Defense Scorecard foi criado;
- Review Checklist foi criado;
- Defense Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 704 foi criado;
- collectors e validators foram criados;
- duas rodadas de defesa foram executadas;
- gravação foi revisada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- preparação GitHub não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\engineering-defense\validate-defense-claims.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/engineering-defense `
  scripts/engineering-defense `
  reports/engineering-defense-report.yaml `
  contracts/engineering-defense-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-proven|infinitely-scalable|GitHub-token|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(defense): prepare OrderFlow engineering decisions"
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
- comparação desonesta;
- número inventado;
- token;
- preparação GitHub da aula 704.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou a defesa das decisões de engenharia do OrderFlow.

Você estruturou:

```text
answer framework;

context and constraints;

decision catalog;

alternative comparisons;

architecture defense;

domain defense;

persistence defense;

transaction defense;

messaging defense;

integration defense;

security defense;

observability defense;

testing defense;

performance defense;

CI CD defense;

deployment defense;

operations defense;

documentation defense;

limits and uncertainty;

objection handling;

cross-examination;

mock defense;

scorecard;

report e evidence.
```

O projeto agora pode ser apresentado e defendido com contexto, critérios, trade-offs e provas.

A próxima aula será:

```text
704 - M20.34 - Preparacao GitHub
```

Nela, você organizará o repositório para publicação, revisando histórico, branches, commits, tags, licença, descrição, topics, templates, segurança, workflows, assets, links e experiência pública.

Nenhuma preparação do GitHub foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei framework de resposta.
- [ ] Mapeei contexto e restrições.
- [ ] Cataloguei decisões.
- [ ] Comparei alternativas.
- [ ] Defendi arquitetura e domínio.
- [ ] Defendi persistência e transações.
- [ ] Defendi mensageria e integrações.
- [ ] Defendi segurança e observabilidade.
- [ ] Defendi testes e performance.
- [ ] Defendi CI/CD e deploy.
- [ ] Defendi operação e documentação.
- [ ] Treinei limites e incerteza.
- [ ] Treinei objeções.
- [ ] Executei banca simulada.
- [ ] Preservei GitHub para a aula 704.

---

## Troubleshooting adicional

### Resposta ficou longa

Comece pela conclusão e aprofunde sob demanda.

### Alternativa parece injusta

Reescreva usando o melhor argumento da alternativa.

### Não existe evidence

Declare a lacuna e proponha experimento.

### Duas respostas se contradizem

Volte ao catálogo e à fonte de verdade.

### Score baixo em concisão

Treine versões de 30 e 90 segundos.

### Score baixo em trade-off

Inclua custo e condição de troca.

### Score baixo em limites

Pratique “não medi” e “eu investigaria”.

### Banca interrompe

Responda primeiro em uma frase.

### Pergunta contém premissa errada

Corrija a premissa com respeito.

### Quero publicar o repositório

Essa etapa pertence à aula 704.

---

## Perguntas de revisão

1. Defender é provar perfeição?
2. O que vem antes da escolha?
3. Como comparar alternativas?
4. Evidence elimina incerteza?
5. Limitação enfraquece a defesa?
6. O que a resposta curta contém?
7. Por que arquitetura hexagonal?
8. Por que não 2PC?
9. Por que at-least-once?
10. Para que serve Inbox?
11. Timeout prova falha?
12. Por que tenant vem da claim?
13. Por que testar negação?
14. Média basta para performance?
15. Health prova jornada?
16. O que fazer quando não sabe?
17. Como usar “depende”?
18. Quando mudar uma decisão?
19. O que uma objeção permite demonstrar?
20. Por que gravar a defesa?
21. O que scorecard mede?
22. O que a aula 704 fará?
23. O que não foi realizado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Contexto e critérios.
3. Pelos mesmos critérios.
4. Não.
5. Não.
6. Escolha, motivo, custo e prova.
7. Proteger boundaries.
8. Custo e acoplamento.
9. Semântica realista.
10. Deduplicação persistente.
11. Não.
12. Evitar escolha arbitrária.
13. Provar proteção.
14. Não.
15. Não.
16. Admitir e propor experimento.
17. Listar variáveis.
18. Quando o contexto mudar.
19. Raciocínio.
20. Encontrar falhas.
21. Clareza e consistência.
22. Preparar GitHub.
23. Preparação do repositório.
24. Preparacao GitHub.
25. Explicar adequação, custo, prova e limite.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 703 - M20.33 - Defesa de decisoes engenharia

- Continuei após Narrativa técnica portfólio.
- Criei Engineering Defense Charter.
- Criei Answer Framework.
- Criei versão curta de resposta.
- Criei Context and Constraints Map.
- Separei restrições e preferências.
- Criei Decision Defense Catalog.
- Criei Alternative Comparison Matrix.
- Evitei caricaturar alternativas.
- Criei Architecture Defense.
- Defendi arquitetura hexagonal, módulos, runtimes e architecture tests.
- Criei Domain Defense.
- Defendi aggregate, estados, value objects, compensação e ambiguidade.
- Criei Persistence Defense.
- Defendi PostgreSQL, Flyway e optimistic locking.
- Criei Transaction Defense.
- Defendi transação local, Outbox e idempotência persistente.
- Criei Messaging Defense.
- Defendi Kafka, at-least-once, Inbox, ordering, retry e DLQ.
- Criei Integration Defense.
- Defendi ACL, operation ID, timeout, retry, breaker e bulkhead.
- Criei Security Defense.
- Defendi OAuth2, JWT, issuer, audience, scopes, roles, tenant e IDOR.
- Criei Observability Defense.
- Defendi logs, métricas, traces, correlation, SLO e runbooks.
- Criei Testing Defense.
- Defendi unitários, integração, contratos, segurança, Postman e performance.
- Criei Performance Defense.
- Defendi percentis, baseline, jornada assíncrona e headroom.
- Criei CI CD Defense.
- Defendi gates, build once, SBOM, assinatura e provenance.
- Criei Deployment Defense.
- Defendi homologação simulada, rollout, rollback e digest.
- Criei Operations Defense.
- Defendi health, runbooks, evidence e reset protegido.
- Criei Documentation Defense.
- Defendi OpenAPI, Postman, README, reports e evidence.
- Criei Limits and Uncertainty.
- Treinei “não sei”, “depende” e premissa incorreta.
- Defini gatilhos de mudança.
- Criei Objection Handling.
- Respondi objeções de complexidade, Kafka, testes, JWT, Outbox, microserviços e saga.
- Criei Technical Cross Examination.
- Gerei banco de perguntas.
- Usei diagramas e evidências.
- Pratiquei respostas diretas.
- Criei Mock Defense Script.
- Organizei banca simulada.
- Gravei duas rodadas.
- Criei Defense Scorecard.
- Criei Review Checklist.
- Criei Defense Matrix.
- Criei Defense Risk Register.
- Criei Defense Traceability.
- Criei boundary para a aula 704.
- Criei collectors e validators.
- Revisei gravações.
- Criei report, evidence e gate.
- Não antecipei preparação GitHub.
- Próxima aula: Preparacao GitHub.
```

---

## Referência técnica curta

- Engineering Defense.
- Context.
- Constraint.
- Criteria.
- Alternative.
- Trade-Off.
- Evidence.
- Limitation.
- Uncertainty.
- Objection.
- Cross-Examination.
- Mock Defense.
- Scorecard.
- Decision Trigger.
- Technical Argument.

Regra final:

```text
A defesa de decisões do OrderFlow deve responder primeiro e justificar depois: answer framework organiza contexto, restrições, critérios, alternativas, escolha, trade-off, evidence, limite e gatilho de mudança, architecture defense explica hexagonal, modularidade, runtimes e architecture tests sem afirmar superioridade universal, domain defense sustenta aggregate, state transitions, value objects, compensation and ambiguity, persistence and transaction defense compara PostgreSQL, NoSQL, Flyway, optimistic locking, local transaction, Outbox and 2PC, messaging defense compara Kafka and RabbitMQ e explica at-least-once, Inbox, ordering, retry topics, DLQ and replay, integration defense sustenta ACL, operation ID, timeout, selective retry, circuit breaker and bulkhead, security defense sustenta OAuth2, JWT, issuer, audience, scopes, roles, tenant claim, IDOR and negative tests, observability defense diferencia logs, metrics, traces, correlation and SLOs, testing defense justifica unit, integration, contract, security, Postman, mutation and smoke, performance defense usa p95, p99, async backlog and headroom com limites de ambiente controlado, CI CD and deployment defense explicam gates, build once, SBOM, signing, provenance, digest, rollout and rollback, operations and documentation defense conectam health, runbooks, OpenAPI, Postman, reports and evidence, uncertainty handling admite o que não foi medido e propõe experimento, objections são respondidas com critérios e condições de troca, mock defense e scorecard treinam clareza, concisão, consistência and posture, e o gate fecha catálogo, respostas, comparisons, evidence, report and simulation enquanto branches, commits, tags, releases, license, templates, topics, permissions and public repository preparation permanecem reservados para a aula 704.
```
