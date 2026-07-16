# 700 - M20.30 - Correcao tecnica final parte 2

## Apresentação da aula

Na aula 699, você iniciou a correção técnica final do OrderFlow.

A primeira parte criou:

- congelamento de escopo;
- baseline técnica;
- agregação dos gates;
- classificação de findings;
- registry;
- decision log;
- correções de arquitetura;
- correções de domínio;
- correções de aplicação;
- correções de persistência;
- correções da Outbox;
- correções da Inbox;
- correções de mensageria;
- correções de integrações;
- correções de segurança;
- correções de configuração;
- testes de regressão;
- report;
- evidence;
- gate da parte 1.

Os findings críticos e altos foram priorizados.

Agora começa a segunda parte da correção técnica final.

Esta etapa não é uma nova rodada de desenvolvimento.

Ela existe para fechar o projeto como um conjunto coerente.

Um sistema pode possuir código correto e ainda apresentar inconsistências como:

- documentação descrevendo endpoint antigo;
- OpenAPI com example diferente da Postman Collection;
- README apontando para artifact que não existe;
- guia local usando comando diferente do script oficial;
- runbook citando métrica renomeada;
- report com commit diferente do artifact;
- evidence com status manual;
- link quebrado;
- checksum desatualizado;
- badge apontando para workflow antigo;
- script sem proteção de ambiente;
- arquivo duplicado com instruções divergentes;
- decisão registrada em ADR, mas ausente na documentação pública;
- enum documentado com valor que não existe;
- cenário Postman sem o mesmo header da OpenAPI;
- relatório de testes omitindo um módulo;
- matriz de rastreabilidade sem o finding resolvido;
- arquivo temporário versionado;
- naming inconsistente entre módulos;
- erro de escrita que altera significado técnico;
- comando PowerShell que funciona somente na máquina do autor.

A parte 2 fechará essas lacunas.

O foco será:

```text
findings remanescentes;

documentacao;

reports;

evidence;

scripts;

links;

OpenAPI;

Postman;

README;

guia local;

runbook;

consistencia global;

acabamento final.
```

A correção precisa continuar obedecendo às regras da parte 1:

- nenhuma feature nova;
- nenhuma mudança sem finding;
- nenhuma supressão de gate;
- nenhuma atualização manual de status;
- nenhuma alegação sem evidência;
- nenhum artifact gerado a partir de commit diferente;
- nenhum link para arquivo inexistente;
- nenhuma decisão arquitetural nova escondida em documentação.

A próxima aula será:

```text
701 - M20.31 - Refatoracao arquitetural final
```

Na aula 701, você realizará uma revisão arquitetural final com foco em boundaries, dependências, responsabilidades, coesão, acoplamento, modularidade e clareza estrutural.

Nesta aula, você não fará uma refatoração arquitetural ampla.

Somente correções pequenas, necessárias para fechar inconsistências comprovadas, são permitidas.

O laboratório será:

```text
labs/m20/aula-700-correcao-tecnica-final-parte-2/orderflow-final-correction-part-2
```

Regra central:

```text
a parte 2
nao adiciona capacidade;

ela remove divergencias,
fecha rastreabilidade
e transforma artifacts isolados
em um projeto coerente
e defensavel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
697:
Guia de execucao local.

698:
Runbook do projeto.

699:
Correcao tecnica final parte 1.

700:
Correcao tecnica final parte 2.

701:
Refatoracao arquitetural final.

702:
Refatoracao de codigo final.
```

A parte 2 trabalha sobre a baseline corrigida da aula 699.

Ela utiliza:

- registry da parte 1;
- decision log;
- reports;
- evidence;
- OpenAPI;
- Postman;
- README;
- guia local;
- runbook;
- ADRs;
- scripts;
- manifests;
- checksums;
- pipelines;
- matrizes;
- catálogos;
- assets;
- links;
- documentação do curso.

A regra de precedência será:

```text
codigo executado;

testes;

contratos validados;

ADRs aprovados;

documentacao derivada;

reports;

evidence.
```

Quando duas fontes divergirem, a correção não deve escolher arbitrariamente.

É necessário:

1. identificar a autoridade;
2. reproduzir o comportamento;
3. consultar a decisão;
4. corrigir a fonte derivada;
5. regenerar artifacts;
6. atualizar rastreabilidade;
7. executar gates.

---

## Objetivo prático

Será criada ou atualizada a estrutura:

```text
docs/final-correction
├── FINDING_REGISTRY_PART_2.md
├── CORRECTION_DECISION_LOG_PART_2.md
├── DOCUMENTATION_CONSISTENCY_PLAN.md
├── REPORT_CONSISTENCY_PLAN.md
├── EVIDENCE_CONSISTENCY_PLAN.md
├── SCRIPT_CONSISTENCY_PLAN.md
├── LINK_AND_ASSET_PLAN.md
├── OPENAPI_POSTMAN_ALIGNMENT.md
├── README_ALIGNMENT.md
├── LOCAL_GUIDE_ALIGNMENT.md
├── RUNBOOK_ALIGNMENT.md
├── GLOBAL_NAMING_POLICY.md
├── FINAL_ARTIFACT_CATALOG.md
├── FINAL_CORRECTION_CLOSURE.md
├── PART_2_ACCEPTANCE_CHECKLIST.md
├── PART_2_RISK_REGISTER.md
├── PART_2_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/final-correction
├── collect-part-2-baseline.ps1
├── scan-documentation-drift.ps1
├── scan-report-consistency.ps1
├── scan-evidence-consistency.ps1
├── scan-script-consistency.ps1
├── scan-links-and-assets.ps1
├── compare-OpenAPI-postman.ps1
├── validate-readme-alignment.ps1
├── validate-local-guide-alignment.ps1
├── validate-runbook-alignment.ps1
├── build-final-artifact-catalog.ps1
├── run-part-2-regression.ps1
├── run-complete-final-gates.ps1
├── generate-part-2-report.ps1
└── collect-part-2-evidence.ps1
```

Artifacts:

```text
reports/final-correction-part-2-report.yaml

reports/final-correction-complete-report.yaml

contracts/final-correction-part-2-evidence.yaml

contracts/final-correction-complete-evidence.yaml
```

Branch recomendada:

```text
fix/final-correction-part-2
```

---

## Conceito essencial

### Consistência é uma propriedade verificável

Não basta ler dois arquivos e concluir que parecem iguais.

Consistência precisa comparar elementos objetivos:

- endpoint;
- método;
- path;
- schema;
- header;
- status;
- enum;
- nome de módulo;
- comando;
- caminho;
- checksum;
- commit;
- timestamp;
- gate;
- count;
- artifact.

### Documento derivado precisa de fonte

Exemplo:

```text
OpenAPI:
fonte do contrato HTTP.

Postman:
consumidor executavel da OpenAPI.

README:
mapa para OpenAPI e Postman.

guia local:
procedimento para executa-los.

evidence:
prova do resultado.
```

### Report não deve ser editado para “ficar verde”

O status precisa ser produzido pela execução.

### Evidence não substitui o artifact

Evidence aponta para:

- execução;
- resultado;
- commit;
- checksum;
- artifact.

### Acabamento não significa cosmética vazia

Uma correção de nome, link ou descrição é válida quando reduz:

- ambiguidade;
- erro operacional;
- divergência;
- dificuldade de avaliação;
- risco de uso incorreto.

---

## Mão na massa guiada

### 1. Criar baseline da parte 2

Execute:

```powershell
git rev-parse HEAD

git status --short
```

A parte 2 começa somente com a parte 1 concluída e working tree controlada.

---

### 2. Criar branch

```powershell
git switch `
  -c `
  fix/final-correction-part-2
```

---

### 3. Criar `collect-part-2-baseline.ps1`

O script registra:

- commit da parte 1;
- gate da parte 1;
- findings abertos;
- reports;
- evidence;
- links;
- checksums;
- artifacts publicados;
- documentação atual.

---

### 4. Validar pré-condições

A parte 2 não inicia quando:

- existe critical aberto;
- existe high aberto;
- parte 1 está inconclusiva;
- baseline não corresponde ao commit;
- working tree contém mudança não classificada.

---

## Findings da parte 2

### 5. Criar registry

Arquivo:

```text
docs/final-correction/FINDING_REGISTRY_PART_2.md
```

Categorias:

- documentation;
- report;
- evidence;
- script;
- link;
- asset;
- OpenAPI;
- Postman;
- README;
- local guide;
- runbook;
- naming;
- packaging;
- final catalog.

---

### 6. Classificar severidade

A parte 2 pode conter:

- medium;
- low;
- high descoberto tardiamente.

Um finding high novo interrompe a consolidação e segue o mesmo rigor da parte 1.

---

### 7. Criar Decision Log

Arquivo:

```text
docs/final-correction/CORRECTION_DECISION_LOG_PART_2.md
```

Decisões:

- corrigido;
- fonte derivada atualizada;
- artifact regenerado;
- duplicidade removida;
- link substituído;
- aceito com justificativa;
- movido para refatoração arquitetural;
- não reproduzido.

---

### 8. Não mover risco real por conveniência

A aula 701 não pode virar depósito de finding não resolvido.

Somente itens realmente arquiteturais e não bloqueantes podem seguir.

---

## Documentação

### 9. Criar Documentation Consistency Plan

Arquivo:

```text
docs/final-correction/DOCUMENTATION_CONSISTENCY_PLAN.md
```

Áreas:

- ADRs;
- architecture docs;
- API docs;
- testing docs;
- security docs;
- observability docs;
- CI/CD docs;
- deploy docs;
- local guide;
- runbook;
- README.

---

### 10. Criar scan de drift

`scan-documentation-drift.ps1` procura:

- path antigo;
- nome antigo;
- módulo removido;
- enum inexistente;
- comando divergente;
- porta divergente;
- versão divergente;
- próxima aula incorreta;
- link quebrado;
- referência a artifact ausente.

---

### 11. Revisar fonte da verdade de nomes

Crie:

```text
docs/final-correction/GLOBAL_NAMING_POLICY.md
```

Padronize:

- OrderFlow;
- módulos;
- aplicações;
- topics;
- consumer groups;
- environment names;
- report names;
- evidence names;
- headers;
- error codes.

---

### 12. Corrigir casing

Exemplo:

```text
OpenAPI:
forma oficial.

Postman:
forma oficial.

CI/CD:
forma oficial em texto.

orderflow-api:
nome técnico do módulo.
```

---

### 13. Corrigir paths

Links e comandos precisam respeitar o filesystem real.

Valide case-sensitive.

---

### 14. Remover documentação duplicada

Quando dois arquivos explicam a mesma policy:

- escolha autoridade;
- mantenha resumo no secundário;
- crie link;
- remova divergência.

---

### 15. Validar próxima ponte

Cada documento de boundary precisa apontar para a etapa correta.

---

### 16. Validar exemplos

Examples precisam:

- validar contra schemas;
- usar enums reais;
- usar datas sintéticas;
- não conter secrets;
- não conter tenant real;
- não conter operação inexistente.

---

### 17. Revisar linguagem técnica

Corrija frases que confundem:

- retry e replay;
- correlation e trace;
- rollback e compensação;
- readiness e liveness;
- tenant e usuário;
- error funcional e técnico;
- at-least-once e exactly-once.

---

### 18. Preservar termos em inglês quando são nomes técnicos

Não force tradução que reduz precisão.

---

## Reports

### 19. Criar Report Consistency Plan

Arquivo:

```text
docs/final-correction/REPORT_CONSISTENCY_PLAN.md
```

---

### 20. Criar scan de reports

Valide:

- source commit;
- timestamp;
- gate;
- counts;
- module list;
- scenario list;
- durations;
- artifact paths;
- zero values suspeitos.

---

### 21. Proibir source commit divergente

Report e código precisam pertencer ao mesmo commit ou a relação precisa estar registrada.

---

### 22. Validar counts

Exemplos:

- total = passed + failed + skipped;
- resolved <= total;
- documented operations <= operations;
- evidence links = links existentes;
- broken = zero para gate `PASS`.

---

### 23. Validar status derivados

O status global precisa resultar dos status filhos.

Não aceite:

```text
gate:
PASS
```

com item obrigatório em `FAIL`.

---

### 24. Tratar `INCONCLUSIVE`

Quando a execução não ocorreu, o report não pode usar `PASS`.

---

### 25. Regenerar reports

Não altere apenas o YAML.

Execute o gerador oficial.

---

### 26. Validar timestamps UTC

Use formato ISO 8601.

---

### 27. Validar nomes dos artifacts

Os nomes precisam seguir a policy oficial.

---

## Evidence

### 28. Criar Evidence Consistency Plan

Arquivo:

```text
docs/final-correction/EVIDENCE_CONSISTENCY_PLAN.md
```

---

### 29. Criar scan de evidence

Valide:

- lesson;
- project;
- commit;
- report;
- artifact;
- checksum;
- counts;
- gate;
- timestamp;
- links.

---

### 30. Verificar checksums

Quando artifact possui checksum, calcule novamente.

---

### 31. Verificar arquivos citados

Evidence não pode apontar para arquivo ausente.

---

### 32. Verificar campos obrigatórios

Campo vazio em evidence crítica reprova.

---

### 33. Verificar origem dos números

Counts precisam vir de report ou execução.

---

### 34. Remover dados sensíveis

Evidence não contém:

- token;
- password;
- private key;
- tenant real;
- payload pessoal;
- endpoint privado.

---

### 35. Criar catalogação final

Cada evidence precisa aparecer no catálogo final.

---

## Scripts

### 36. Criar Script Consistency Plan

Arquivo:

```text
docs/final-correction/SCRIPT_CONSISTENCY_PLAN.md
```

---

### 37. Criar scan de scripts

Procure:

- caminho inexistente;
- comando legado;
- hardcoded host;
- ambiente de produção;
- falta de timeout;
- falta de exit code;
- output sensível;
- destruição sem confirmação;
- nome divergente;
- dependência não documentada.

---

### 38. Padronizar parâmetros

Scripts precisam usar nomes consistentes:

```text
-Environment;

-OutputDirectory;

-IncidentId;

-ReleaseId;

-ConfirmDestructive.
```

---

### 39. Padronizar exit codes

```text
0:
sucesso.

diferente de 0:
falha.
```

---

### 40. Padronizar mensagens

Inclua:

- etapa;
- resultado;
- próximo passo;
- sem secret.

---

### 41. Adicionar timeout

Nenhuma espera por health, polling ou external command pode ser infinita.

---

### 42. Validar ambiente permitido

Scripts sensíveis precisam de allowlist.

---

### 43. Validar dry-run quando aplicável

Ações operacionais importantes devem oferecer inspeção antes da execução.

---

### 44. Evitar duplicação de lógica

O guia local, runbook e CI devem chamar scripts oficiais.

---

### 45. Validar PowerShell

Use:

- parâmetros tipados;
- `Set-StrictMode`;
- tratamento de erro;
- caminhos com `Join-Path`;
- código de saída;
- output sanitizado.

---

### 46. Validar shell alternativo

Quando existir script Bash equivalente, compare comportamento.

Não crie equivalência incompleta.

---

## Links e assets

### 47. Criar Link and Asset Plan

Arquivo:

```text
docs/final-correction/LINK_AND_ASSET_PLAN.md
```

---

### 48. Criar scan de links

Valide:

- links relativos;
- anchors;
- case;
- extensions;
- arquivos gerados;
- links externos essenciais;
- redirects indesejados.

---

### 49. Remover caminhos locais

Proibido em artifacts:

```text
C:\Users\;

home de usuário;

diretório temporário;

caminho de sandbox.
```

---

### 50. Validar assets

Cada asset precisa de:

- finalidade;
- alt text;
- origem;
- atualização;
- ausência de dado sensível;
- tamanho controlado.

---

### 51. Remover asset órfão

Arquivo sem referência e sem valor não permanece.

---

### 52. Validar Mermaid

Diagramas precisam renderizar.

---

### 53. Validar badges

Badges precisam apontar para workflow e branch corretos.

---

## OpenAPI e Postman

### 54. Criar OpenAPI Postman Alignment

Arquivo:

```text
docs/final-correction/OPENAPI_POSTMAN_ALIGNMENT.md
```

---

### 55. Comparar operações

Para cada endpoint:

- método;
- path;
- security;
- headers;
- request;
- success;
- errors;
- examples.

---

### 56. Comparar checksum

A collection precisa registrar o checksum atual da OpenAPI.

---

### 57. Comparar headers

Verifique:

- Authorization;
- Content-Type;
- Idempotency-Key;
- X-Correlation-Id;
- tenant header quando aplicável.

---

### 58. Comparar status

A collection não pode aceitar status fora do contrato.

---

### 59. Comparar Problem Details

Assertions precisam validar os campos documentados.

---

### 60. Comparar enums

Dados de collection usam somente valores oficiais.

---

### 61. Comparar processamento assíncrono

Requests `202` precisam seguir polling documentado.

---

### 62. Comparar segurança

Cenários negativos precisam corresponder à matriz final.

---

### 63. Regenerar collection quando necessário

Preserve scripts customizados revisados.

---

### 64. Executar collection positiva e negativa

A execução precisa ocorrer no mesmo commit da OpenAPI.

---

## README

### 65. Criar README Alignment

Arquivo:

```text
docs/final-correction/README_ALIGNMENT.md
```

---

### 66. Validar claims

Cada claim importante precisa de evidence atual.

---

### 67. Validar stack

Remova tecnologia não utilizada.

Adicione somente tecnologia comprovada.

---

### 68. Validar arquitetura

Diagramas e texto precisam refletir módulos atuais.

---

### 69. Validar comandos

Quickstart usa scripts oficiais e paths existentes.

---

### 70. Validar links

OpenAPI, Postman, ADRs, reports e evidence precisam abrir.

---

### 71. Validar limitações

Deploy simulado e capacidade básica continuam descritos com honestidade.

---

### 72. Validar badges

Nenhum badge quebrado ou manual.

---

### 73. Validar número de testes

Somente números gerados e atuais.

---

## Guia local

### 74. Criar Local Guide Alignment

Arquivo:

```text
docs/final-correction/LOCAL_GUIDE_ALIGNMENT.md
```

---

### 75. Comparar guia e scripts

Cada comando do guia precisa existir.

---

### 76. Comparar portas

Guia, compose e environment precisam concordar.

---

### 77. Comparar variáveis

`.env.example`, catálogo e application config precisam concordar.

---

### 78. Comparar profiles

Os nomes de profiles precisam ser oficiais.

---

### 79. Comparar startup order

Ordem precisa respeitar dependências reais.

---

### 80. Comparar health

Endpoints documentados precisam existir.

---

### 81. Comparar smoke

O guia chama o script oficial atual.

---

### 82. Comparar reset

Ação destrutiva exige confirmação.

---

### 83. Executar guia em ambiente limpo

Corrija qualquer conhecimento oculto encontrado.

---

## Runbook

### 84. Criar Runbook Alignment

Arquivo:

```text
docs/final-correction/RUNBOOK_ALIGNMENT.md
```

---

### 85. Comparar métricas

Nomes usados no runbook precisam existir.

---

### 86. Comparar alerts

Runbook precisa apontar para sinais reais.

---

### 87. Comparar scripts

Comandos citados precisam existir e ser seguros.

---

### 88. Comparar manifests

Rollback usa formato e path atuais.

---

### 89. Comparar classificação de incidentes

Severidade, papéis e comunicação precisam estar alinhados.

---

### 90. Comparar recovery

Health, smoke, backlog, lag e projection precisam ser verificáveis.

---

### 91. Reexecutar tabletop curto

Escolha um cenário e confirme que o runbook ainda funciona após as correções.

---

## Catálogo final

### 92. Criar Final Artifact Catalog

Arquivo:

```text
docs/final-correction/FINAL_ARTIFACT_CATALOG.md
```

Categorias:

- source;
- architecture;
- ADR;
- tests;
- security;
- observability;
- Docker;
- CI/CD;
- deploy;
- performance;
- OpenAPI;
- Postman;
- README;
- local guide;
- runbook;
- reports;
- evidence.

---

### 93. Registrar owner e fonte

Cada artifact possui:

- path;
- propósito;
- source;
- generator;
- validator;
- owner;
- status.

---

### 94. Detectar artifacts órfãos

Arquivo não referenciado precisa ser:

- ligado;
- arquivado;
- removido.

---

### 95. Detectar artifacts duplicados

Duas cópias da mesma fonte aumentam drift.

---

### 96. Validar versões

Versão de API, projeto e reports precisa ser coerente.

---

## Testes completos

### 97. Executar unitários

```powershell
.\mvnw.cmd `
  --batch-mode `
  test
```

---

### 98. Executar integração

```powershell
.\mvnw.cmd `
  --batch-mode `
  verify `
  -Pintegration-tests
```

---

### 99. Executar contrato e segurança

```powershell
.\mvnw.cmd `
  --batch-mode `
  verify `
  -Pcontract-security-tests
```

---

### 100. Executar arquitetura

Use o profile ou script oficial.

---

### 101. Executar secret scan

Inclua source, docs, reports, evidence, examples e assets textuais.

---

### 102. Executar OpenAPI

Gere, normalize, valide e calcule checksum.

---

### 103. Executar Postman

Rode positiva e negativa.

---

### 104. Executar guia local

Valide startup, health, smoke, shutdown e reset controlado.

---

### 105. Executar runbook

Rode snapshot e um tabletop curto.

---

### 106. Executar performance smoke

Não repita campanha completa sem necessidade.

Use smoke para detectar regressão grave.

---

## Fechamento dos findings

### 107. Atualizar registry

Cada finding recebe:

- status;
- commit;
- teste;
- report;
- evidence;
- decisão.

---

### 108. Fechar findings remanescentes

Para gate final:

```text
critical:
zero aberto.

high:
zero aberto.

medium bloqueante:
zero aberto.

low:
resolvido
ou aceito com justificativa.
```

---

### 109. Revisar findings movidos

Item movido para aula 701 precisa ser:

- arquitetural;
- não crítico;
- não high;
- sem quebra de contrato;
- sem risco de segurança;
- formalmente registrado.

---

### 110. Criar closure

Arquivo:

```text
docs/final-correction/FINAL_CORRECTION_CLOSURE.md
```

Inclua:

- baseline inicial;
- baseline da parte 2;
- findings;
- resoluções;
- riscos aceitos;
- gates;
- artifacts;
- conclusão.

---

## Aceitação

### 111. Criar Part 2 Acceptance Checklist

Arquivo:

```text
docs/final-correction/PART_2_ACCEPTANCE_CHECKLIST.md
```

Itens:

- registry fechado;
- docs alinhadas;
- reports consistentes;
- evidence consistente;
- scripts válidos;
- links válidos;
- assets válidos;
- OpenAPI e Postman alinhados;
- README alinhado;
- guia local alinhado;
- runbook alinhado;
- catálogo final;
- gates completos;
- próxima aula preservada.

---

### 112. Criar Risk Register

Arquivo:

```text
docs/final-correction/PART_2_RISK_REGISTER.md
```

Riscos:

```text
artifact antigo;

report manual;

evidence sem fonte;

link quebrado;

script divergente;

OpenAPI e Postman diferentes;

README exagerado;

guia local desatualizado;

runbook com metrica inexistente;

finding movido indevidamente;

refatoracao antecipada.
```

---

### 113. Criar Traceability

Arquivo:

```text
docs/final-correction/PART_2_TRACEABILITY.md
```

Exemplo:

```text
FC2-003 Postman checksum antigo
-> OpenAPI regeneration
-> collection update
-> positive and negative run
-> evidence.

FC2-007 local guide port drift
-> compose comparison
-> guide correction
-> clean startup test.

FC2-011 runbook metric renamed
-> metric catalog
-> runbook correction
-> tabletop validation.
```

---

### 114. Criar boundary da próxima aula

Arquivo:

```text
docs/final-correction/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 700 define:

- remaining finding closure;
- documentation consistency;
- report consistency;
- evidence consistency;
- script consistency;
- link and asset validation;
- OpenAPI and Postman alignment;
- README alignment;
- local guide alignment;
- runbook alignment;
- final artifact catalog;
- complete final gates;
- final correction closure.

A aula 701 define:

- final architecture review;
- module boundaries;
- dependency direction;
- responsibility distribution;
- cohesion;
- coupling;
- package structure;
- ports and adapters;
- runtime composition;
- architecture simplification.

Nenhuma refatoracao arquitetural ampla
e iniciada nesta aula.
```

---

## Relatórios

### 115. Criar report da parte 2

Arquivo:

```text
reports/final-correction-part-2-report.yaml
```

Exemplo:

```yaml
finalCorrectionPart2:
  findings:
    total:
      18
    resolved:
      17
    accepted:
      1
    openCritical:
      0
    openHigh:
      0

  consistency:
    documentation:
      PASS
    reports:
      PASS
    evidence:
      PASS
    scripts:
      PASS
    links:
      PASS
    OpenAPIPostman:
      PASS
    README:
      PASS
    localGuide:
      PASS
    runbook:
      PASS

  architectureRefactoring:
    executed:
      false

  gate:
    PASS
```

Os números precisam vir do registry real.

---

### 116. Criar report completo

Arquivo:

```text
reports/final-correction-complete-report.yaml
```

Ele consolida partes 1 e 2.

---

### 117. Criar evidence da parte 2

Arquivo:

```text
contracts/final-correction-part-2-evidence.yaml
```

Campos:

- lesson;
- project;
- part 1 commit;
- part 2 baseline commit;
- part 2 finding count;
- resolved count;
- accepted count;
- open critical count;
- open high count;
- documentation drift count;
- report inconsistency count;
- evidence inconsistency count;
- script inconsistency count;
- broken link count;
- invalid asset count;
- OpenAPI Postman mismatch count;
- README mismatch count;
- local guide mismatch count;
- runbook mismatch count;
- orphan artifact count;
- duplicate artifact count;
- unit status;
- integration status;
- contract-security status;
- architecture status;
- secret scan status;
- OpenAPI status;
- Postman positive status;
- Postman negative status;
- local execution status;
- runbook tabletop status;
- performance smoke status;
- architecture refactoring executed;
- documentation status;
- gate status;
- timestamp.

---

### 118. Criar evidence completa

Arquivo:

```text
contracts/final-correction-complete-evidence.yaml
```

Consolide as duas partes sem copiar manualmente números divergentes.

---

### 119. Criar gate da parte 2

Status:

```text
PASS;

FAIL_PART_2_BASELINE;

FAIL_PART_2_FINDING_REGISTRY;

FAIL_DOCUMENTATION_CONSISTENCY;

FAIL_REPORT_CONSISTENCY;

FAIL_EVIDENCE_CONSISTENCY;

FAIL_SCRIPT_CONSISTENCY;

FAIL_LINK;

FAIL_ASSET;

FAIL_OPENAPI_POSTMAN_ALIGNMENT;

FAIL_README_ALIGNMENT;

FAIL_LOCAL_GUIDE_ALIGNMENT;

FAIL_RUNBOOK_ALIGNMENT;

FAIL_ARTIFACT_CATALOG;

FAIL_UNIT_GATE;

FAIL_INTEGRATION_GATE;

FAIL_CONTRACT_SECURITY_GATE;

FAIL_ARCHITECTURE_GATE;

FAIL_SECRET_SCAN;

FAIL_OPENAPI_GATE;

FAIL_POSTMAN_GATE;

FAIL_LOCAL_EXECUTION_GATE;

FAIL_RUNBOOK_GATE;

FAIL_PERFORMANCE_SMOKE;

FAIL_OPEN_CRITICAL;

FAIL_OPEN_HIGH;

FAIL_UNJUSTIFIED_ACCEPTANCE;

FAIL_ARCHITECTURE_REFACTORING_ANTICIPATION;

FAIL_REPORT;

FAIL_EVIDENCE;

INCONCLUSIVE.
```

---

### 120. Executar gates completos

```powershell
.\scripts\final-correction\run-complete-final-gates.ps1
```

O script precisa falhar na primeira inconsistência crítica ou consolidar todas conforme policy.

---

### 121. Comparar com baseline inicial

Analise:

- findings;
- failures;
- warnings;
- duration;
- artifacts;
- gates;
- risks.

---

### 122. Revisar diff final

```powershell
git diff `
  --stat

git diff `
  --check
```

---

### 123. Revisar arquivos não rastreados

```powershell
git status `
  --short
```

Remova temporários e outputs não permitidos.

---

### 124. Criar gate de fechamento completo

O projeto só fecha a correção quando:

- parte 1 aprovada;
- parte 2 aprovada;
- complete report aprovado;
- complete evidence aprovada;
- zero critical;
- zero high;
- refatoração arquitetural não iniciada.

---

### 125. Encerrar o laboratório

Confirme:

- baseline;
- registry;
- decision log;
- documentation;
- reports;
- evidence;
- scripts;
- links;
- assets;
- OpenAPI;
- Postman;
- README;
- local guide;
- runbook;
- naming;
- artifact catalog;
- complete gates;
- closure;
- report;
- evidence;
- gate aprovado;
- aula 701 preservada.

---

## Entendendo o que foi feito

### O projeto deixou de ser um conjunto de artifacts

Código, documentação, reports e evidence passaram a apontar para a mesma realidade.

### A documentação ganhou autoridade

Cada informação derivada passou a ter uma fonte clara.

### Reports deixaram de ser números soltos

Commit, counts, statuses e artifacts foram validados.

### Evidence ganhou rastreabilidade

Checksums, paths e gates podem ser auditados.

### Scripts ganharam comportamento previsível

Parâmetros, timeouts, exit codes e proteção de ambiente foram padronizados.

### OpenAPI e Postman passaram a caminhar juntos

Contrato e execução usam o mesmo checksum e os mesmos cenários.

### README, guia local e runbook ficaram sincronizados

O leitor encontra instruções coerentes em todas as entradas.

### Findings restantes foram fechados

Aceites possuem justificativa e nenhum risco crítico foi empurrado.

### A refatoração arquitetural ficou preservada

A próxima aula poderá revisar estrutura sem confundir estabilização com redesign.

---

## Erros comuns importantes

### Corrigir apenas o documento

O runtime pode continuar divergente.

### Corrigir apenas o runtime

Consumers e operadores continuam usando informação antiga.

### Marcar report como aprovado manualmente

O gate perde credibilidade.

### Copiar número para evidence

O valor pode divergir da fonte.

### Atualizar Postman sem checksum

A collection pode consumir contrato antigo.

### Remover link quebrado sem substituição

O leitor perde acesso à evidência.

### Mover finding high para a próxima aula

A correção final fica incompleta.

### Reescrever arquitetura agora

A aula 701 possui esse objetivo.

### Manter artifact duplicado

O drift retorna.

### Ignorar arquivo temporário

O repositório perde acabamento.

---

## Comandos úteis

### Scan de documentação

```powershell
.\scripts\final-correction\scan-documentation-drift.ps1
```

### Scan de reports e evidence

```powershell
.\scripts\final-correction\scan-report-consistency.ps1

.\scripts\final-correction\scan-evidence-consistency.ps1
```

### Alinhamento OpenAPI e Postman

```powershell
.\scripts\final-correction\compare-OpenAPI-postman.ps1
```

### Gates completos

```powershell
.\scripts\final-correction\run-complete-final-gates.ps1
```

---

## Exercício principal

Conduza a correção do finding:

```text
a Postman Collection registra
checksum de uma OpenAPI antiga
e aceita um status HTTP
que nao existe no contrato atual.
```

Inclua:

1. registrar finding;
2. reproduzir;
3. localizar OpenAPI atual;
4. calcular checksum;
5. localizar checksum da collection;
6. comparar operações;
7. comparar status;
8. identificar assertion permissiva;
9. corrigir generation;
10. preservar scripts customizados;
11. atualizar checksum;
12. corrigir assertion;
13. validar Problem Details;
14. validar examples;
15. executar contract tests;
16. gerar OpenAPI;
17. executar collection positiva;
18. executar collection negativa;
19. atualizar report;
20. atualizar evidence;
21. validar README;
22. validar guia local;
23. validar links;
24. fechar finding;
25. registrar decisão.

Não inicie refatoração arquitetural.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 699 e ponte para a aula 701 foram preservadas;
- baseline da parte 2 foi registrada;
- branch foi criada;
- collector de baseline foi criado;
- pré-condições foram validadas;
- registry da parte 2 foi criado;
- severidade foi aplicada;
- Decision Log foi criado;
- riscos reais não foram adiados por conveniência;
- Documentation Consistency Plan foi criado;
- scan de drift foi criado;
- Naming Policy foi criada;
- casing foi corrigido;
- paths foram corrigidos;
- duplicidades foram removidas;
- boundaries foram validados;
- examples foram validados;
- linguagem técnica foi revisada;
- termos técnicos foram preservados;
- Report Consistency Plan foi criado;
- reports foram escaneados;
- source commit foi validado;
- counts foram validados;
- status derivados foram validados;
- inconclusivos foram tratados;
- reports foram regenerados;
- timestamps UTC foram validados;
- nomes de artifacts foram validados;
- Evidence Consistency Plan foi criado;
- evidence foi escaneada;
- checksums foram validados;
- arquivos citados foram validados;
- campos obrigatórios foram validados;
- origem dos números foi validada;
- dados sensíveis foram removidos;
- catalogação final foi criada;
- Script Consistency Plan foi criado;
- scripts foram escaneados;
- parâmetros foram padronizados;
- exit codes foram padronizados;
- mensagens foram padronizadas;
- timeouts foram adicionados;
- ambientes permitidos foram validados;
- dry-run foi tratado;
- duplicação de lógica foi removida;
- PowerShell foi validado;
- scripts alternativos foram comparados;
- Link and Asset Plan foi criado;
- links foram escaneados;
- caminhos locais foram removidos;
- assets foram validados;
- assets órfãos foram removidos;
- Mermaid foi validado;
- badges foram validados;
- OpenAPI Postman Alignment foi criado;
- operações foram comparadas;
- checksum foi comparado;
- headers foram comparados;
- status foram comparados;
- Problem Details foi comparado;
- enums foram comparados;
- async foi comparado;
- segurança foi comparada;
- collection foi regenerada;
- collections positiva e negativa foram executadas;
- README Alignment foi criado;
- claims foram validadas;
- stack foi validada;
- arquitetura foi validada;
- comandos foram validados;
- links foram validados;
- limitações foram validadas;
- badges foram validados;
- números de testes foram validados;
- Local Guide Alignment foi criado;
- guia e scripts foram comparados;
- portas foram comparadas;
- variáveis foram comparadas;
- profiles foram comparados;
- startup order foi comparada;
- health foi comparado;
- smoke foi comparado;
- reset foi comparado;
- guia foi executado em ambiente limpo;
- Runbook Alignment foi criado;
- métricas foram comparadas;
- alerts foram comparados;
- scripts foram comparados;
- manifests foram comparados;
- incident classification foi comparada;
- recovery foi comparada;
- tabletop foi reexecutado;
- Final Artifact Catalog foi criado;
- owner e fonte foram registrados;
- artifacts órfãos foram tratados;
- artifacts duplicados foram tratados;
- versões foram validadas;
- unitários foram executados;
- integração foi executada;
- contrato e segurança foram executados;
- arquitetura foi executada;
- secret scan foi executado;
- OpenAPI foi executada;
- Postman foi executado;
- guia local foi executado;
- runbook foi executado;
- performance smoke foi executado;
- registry foi atualizado;
- findings remanescentes foram fechados;
- findings movidos foram revisados;
- closure foi criado;
- Acceptance Checklist foi criado;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 701 foi criado;
- reports da parte 2 e completo foram criados;
- evidence da parte 2 e completa foram criadas;
- gate da parte 2 foi criado;
- gates completos foram executados;
- baseline foi comparada;
- diff final foi revisado;
- arquivos não rastreados foram revisados;
- gate completo foi aprovado;
- commit recomendado e diário de bordo estão presentes;
- refatoração arquitetural não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\final-correction\run-complete-final-gates.ps1

.\scripts\validate-secrets.ps1
```

Adicione somente arquivos relacionados aos findings da parte 2:

```powershell
git add `
  docs `
  scripts `
  testing `
  reports `
  contracts `
  README.md `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|pending-marker|temporary-marker|generic-marker|C:\\Users\\|/mnt/data|productionUrl|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "fix(final): close OrderFlow consistency findings"
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

- feature nova;
- alteração arquitetural ampla;
- secret;
- caminho local;
- artifact manual;
- conteúdo detalhado da aula 701.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a segunda parte da correção técnica final do OrderFlow.

Você fechou:

```text
remaining findings;

documentation consistency;

report consistency;

evidence consistency;

script consistency;

link and asset validation;

OpenAPI and Postman alignment;

README alignment;

local guide alignment;

runbook alignment;

global naming;

final artifact catalog;

complete final gates;

final correction closure.
```

O projeto agora possui código, documentação, execução e evidências alinhados ao mesmo estado.

A próxima aula será:

```text
701 - M20.31 - Refatoracao arquitetural final
```

Nela, você fará uma revisão arquitetural específica para melhorar boundaries, dependências, responsabilidades, coesão, acoplamento, packages, ports, adapters e composição dos runtimes sem alterar o comportamento externo aprovado.

Nenhuma refatoração arquitetural ampla foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Registrei baseline da parte 2.
- [ ] Fechei findings remanescentes.
- [ ] Alinhei documentação.
- [ ] Alinhei reports.
- [ ] Alinhei evidence.
- [ ] Alinhei scripts.
- [ ] Validei links e assets.
- [ ] Alinhei OpenAPI e Postman.
- [ ] Alinhei README.
- [ ] Alinhei guia local.
- [ ] Alinhei runbook.
- [ ] Criei catálogo final.
- [ ] Executei gates completos.
- [ ] Fechei a correção final.
- [ ] Preservei a aula 701.

---

## Troubleshooting adicional

### Report possui commit antigo

Reexecute o gerador no commit atual.

### Evidence aponta para arquivo inexistente

Corrija o artifact ou remova a claim.

### Postman diverge da OpenAPI

Regere e reaplique scripts revisados.

### Guia local usa porta diferente

Escolha compose como fonte e atualize documentos derivados.

### Runbook cita métrica antiga

Atualize runbook e traceability.

### Badge está quebrado

Corrija workflow ou remova.

### Link funciona no Windows e falha no CI

Revise casing.

### Finding parece arquitetural

Confirme severidade e ausência de risco antes de mover.

### Gate passa com etapa não executada

Corrija status para inconclusivo e execute a etapa.

### Quero reorganizar todos os módulos

Essa etapa pertence à aula 701.

---

## Perguntas de revisão

1. Qual é o foco da parte 2?
2. Qual é a ordem de autoridade?
3. Documento pode contrariar runtime?
4. Report pode ser editado manualmente?
5. Evidence substitui artifact?
6. O que validar em checksum?
7. O que validar em count?
8. Quando usar inconclusivo?
9. Por que remover duplicidade documental?
10. O que um script precisa ter?
11. Por que validar case de links?
12. O que comparar entre OpenAPI e Postman?
13. README pode alegar tecnologia não usada?
14. Guia local pode duplicar scripts?
15. Runbook pode usar métrica inexistente?
16. Artifact órfão deve permanecer?
17. Finding high pode seguir para aula 701?
18. O que o catálogo final registra?
19. O que fecha a correção completa?
20. Pode iniciar refatoração agora?
21. O que o report completo consolida?
22. O que a aula 701 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Consistência global.
2. Runtime, testes, contratos e decisões.
3. Não.
4. Não.
5. Não.
6. Artifact atual.
7. Relações matemáticas.
8. Quando falta execução.
9. Evitar drift.
10. Parâmetros, timeout e exit code.
11. Filesystem pode ser case-sensitive.
12. Operações, headers, schemas e status.
13. Não.
14. Não.
15. Não.
16. Não sem justificativa.
17. Não.
18. Fonte, generator e validator.
19. Partes 1 e 2 aprovadas.
20. Não.
21. As duas partes.
22. Refatoração arquitetural.
23. Refatoração ampla.
24. Refatoracao arquitetural final.
25. Remover divergências sem adicionar capacidade.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 700 - M20.30 - Correcao tecnica final parte 2

- Continuei após Correção técnica final parte 1.
- Registrei baseline da parte 2.
- Criei branch de consolidação.
- Validei pré-condições.
- Criei Finding Registry da parte 2.
- Classifiquei severidade.
- Criei Decision Log.
- Evitei adiar riscos reais.
- Criei Documentation Consistency Plan.
- Criei scan de documentation drift.
- Criei Global Naming Policy.
- Corrigi casing e paths.
- Removi duplicidades.
- Validei boundaries e examples.
- Revisei linguagem técnica.
- Criei Report Consistency Plan.
- Validei commit, counts, statuses e timestamps.
- Regenerei reports.
- Criei Evidence Consistency Plan.
- Validei checksums, paths e campos.
- Removi dados sensíveis.
- Criei Script Consistency Plan.
- Padronizei parâmetros, exit codes e mensagens.
- Adicionei timeouts e allowlists.
- Removi duplicação de lógica.
- Validei PowerShell.
- Criei Link and Asset Plan.
- Validei links, anchors, assets, Mermaid e badges.
- Criei OpenAPI Postman Alignment.
- Comparei operações, headers, statuses, schemas e segurança.
- Atualizei checksum.
- Executei collections positiva e negativa.
- Criei README Alignment.
- Validei claims, stack, arquitetura, comandos e links.
- Criei Local Guide Alignment.
- Comparei portas, env, profiles, health, smoke e reset.
- Executei guia em ambiente limpo.
- Criei Runbook Alignment.
- Comparei métricas, alerts, scripts, manifests e recovery.
- Reexecutei tabletop.
- Criei Final Artifact Catalog.
- Registrei fontes, generators, validators e owners.
- Tratei artifacts órfãos e duplicados.
- Executei unitários, integração, contrato, segurança e arquitetura.
- Executei secret scan.
- Regenerei OpenAPI.
- Executei Postman.
- Executei guia local.
- Executei runbook.
- Executei performance smoke.
- Atualizei registry.
- Fechei findings remanescentes.
- Revisei findings movidos.
- Criei Final Correction Closure.
- Criei Part 2 Acceptance Checklist.
- Criei Part 2 Risk Register.
- Criei Part 2 Traceability.
- Criei boundary para a aula 701.
- Criei reports da parte 2 e completo.
- Criei evidence da parte 2 e completa.
- Criei gate da parte 2.
- Executei gates completos.
- Comparei baseline.
- Revisei diff e arquivos não rastreados.
- Fechei o gate completo.
- Não antecipei refatoração arquitetural.
- Próxima aula: Refatoracao arquitetural final.
```

---

## Referência técnica curta

- Final Consistency.
- Documentation Drift.
- Report Consistency.
- Evidence Consistency.
- Checksum.
- Source Commit.
- Artifact Catalog.
- Link Validation.
- Asset Validation.
- OpenAPI Alignment.
- Postman Alignment.
- Script Contract.
- Exit Code.
- Timeout.
- Allowlist.
- Closure.
- Global Gate.

Regra final:

```text
A correção técnica final parte 2 do OrderFlow deve fechar divergências sem adicionar capacidade: baseline da parte 2 confirma que critical e high da parte 1 estão resolvidos, registry classifica findings de documentation, reports, evidence, scripts, links, assets, OpenAPI, Postman, README, local guide and runbook, a ordem de autoridade parte do runtime, tests, contracts and ADRs, documentation drift scan encontra paths, names, enums, commands, ports and versions antigos, naming policy padroniza modules, topics, groups, environments, headers, errors, reports and evidence, report scan valida source commit, timestamps, counts, child statuses and inconclusive executions, evidence scan valida lesson, project, artifact, checksum, report, gate and required fields sem secrets, script scan valida paths, parameters, strict mode, exit codes, timeout, environment allowlist, dry-run and sanitized output, link and asset scan valida relative paths, anchors, casing, Mermaid, badges, alt text and sensitive data, OpenAPI and Postman são comparados por checksum, operation, security, header, schema, status, example and async behavior, README claims usam evidence atual, local guide concorda com compose, env, profiles, ports, health, smoke and reset, runbook usa metrics, alerts, scripts and manifests reais, final artifact catalog registra source, generator, validator, owner and status, unit, integration, contract-security, architecture, secret, OpenAPI, Postman, local, runbook and performance smoke gates são reexecutados, findings critical and high permanecem em zero, accepted risks possuem justificativa, reports and evidence completos consolidam partes 1 e 2, e o gate fecha a correção final enquanto a revisão ampla de boundaries, dependencies, cohesion, coupling, packages, ports and adapters permanece reservada para a aula 701.
```
