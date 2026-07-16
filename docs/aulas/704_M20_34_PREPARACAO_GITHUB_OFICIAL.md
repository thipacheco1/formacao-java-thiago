# 704 - M20.34 - Preparacao GitHub

## Apresentação da aula

Na aula 703, você estruturou a defesa das decisões de engenharia do OrderFlow.

O projeto passou a possuir:

- framework para respostas técnicas;
- mapa de contexto e restrições;
- catálogo de decisões;
- comparação de alternativas;
- defesa arquitetural;
- defesa de domínio;
- defesa de persistência;
- defesa de transações;
- defesa de mensageria;
- defesa de integrações;
- defesa de segurança;
- defesa de observabilidade;
- defesa de testes;
- defesa de performance;
- defesa de CI/CD;
- defesa de deploy;
- defesa de operação;
- defesa de documentação;
- tratamento de objeções;
- banca simulada;
- scorecard;
- report, evidence e gate.

Agora o OrderFlow está pronto para ser apresentado, explicado e questionado.

Nesta aula, você preparará o repositório GitHub do projeto.

Preparar o GitHub não significa apenas executar um `git push`.

Um repositório público profissional precisa permitir que outra pessoa:

- entenda o projeto em poucos segundos;
- identifique a branch principal;
- confie no histórico;
- encontre releases;
- leia a licença;
- saiba como contribuir;
- abra issues com contexto;
- envie pull requests consistentes;
- encontre a política de segurança;
- valide os workflows;
- encontre OpenAPI, Postman, reports e evidências;
- reconheça quais dados são simulados;
- execute o projeto sem caminhos locais;
- avaliar o código sem encontrar arquivos temporários;
- navegar por tags, topics, descrição e assets coerentes;
- verificar que nenhum secret foi publicado.

A preparação será orientada por duas perspectivas.

Perspectiva técnica:

```text
o repositorio esta seguro,
reproduzivel,
rastreavel
e automatizado?
```

Perspectiva de avaliação:

```text
um recrutador,
engenheiro
ou arquiteto
consegue entender
e avaliar o projeto
sem ajuda do autor?
```

A aula trabalhará:

- auditoria do repositório;
- limpeza antes da exposição;
- estratégia de branches;
- revisão do histórico;
- qualidade dos commits;
- tags;
- releases;
- descrição;
- topics;
- licença;
- arquivo de contribuição;
- código de conduta;
- política de segurança;
- templates de issue;
- template de pull request;
- CODEOWNERS;
- Dependabot;
- permissões dos workflows;
- proteção de branches;
- secret scanning;
- assets públicos;
- links finais;
- checklist de publicação.

A próxima aula será:

```text
705 - M20.35 - Preparacao LinkedIn
```

Na aula 705, você transformará a narrativa técnica do OrderFlow em posicionamento profissional no LinkedIn, trabalhando título, resumo, projeto, experiências, competências, publicação e estratégia de exposição.

Nesta aula, nenhum conteúdo de LinkedIn será criado.

O laboratório será:

```text
labs/m20/aula-704-preparacao-github/orderflow-GitHub-readiness
```

Regra central:

```text
um repositorio profissional
nao mostra apenas codigo;

ele mostra
qualidade,
seguranca,
rastreabilidade,
decisoes
e facilidade de avaliacao.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
701:
Refatoracao arquitetural final.

702:
Narrativa tecnica portfolio.

703:
Defesa de decisoes engenharia.

704:
Preparacao GitHub.

705:
Preparacao LinkedIn.

706:
Preparacao curriculo.
```

A preparação do GitHub utiliza como fonte:

- código final;
- README profissional;
- guia local;
- runbook;
- OpenAPI;
- Postman;
- ADRs;
- diagrams;
- reports;
- evidence;
- scripts;
- workflows;
- Dockerfiles;
- manifests;
- licença escolhida;
- histórico de commits;
- narrativa técnica;
- defesa das decisões.

A preparação não pode mudar a realidade do projeto apenas para deixá-lo visualmente mais atraente.

Quando o projeto usa providers simulados, isso precisa continuar explícito.

Quando o deploy foi validado em homologação simulada, o GitHub não deve afirmar produção real.

Quando a performance foi medida em ambiente controlado, o repositório não deve anunciar capacidade universal.

A regra é:

```text
aparencia profissional
sem perder honestidade tecnica.
```

---

## Objetivo prático

Será criada ou revisada a estrutura:

```text
.GitHub
├── CODEOWNERS
├── dependabot.yml
├── pull_request_template.md
├── ISSUE_TEMPLATE
│   ├── bug_report.yml
│   ├── feature_request.yml
│   ├── documentation.yml
│   └── config.yml
└── workflows
    ├── ci.yml
    ├── contract-security.yml
    ├── container-security.yml
    ├── documentation.yml
    └── release.yml

docs/GitHub
├── GITHUB_PREPARATION_CHARTER.md
├── REPOSITORY_AUDIT.md
├── PUBLIC_REPOSITORY_POLICY.md
├── BRANCH_STRATEGY.md
├── COMMIT_HISTORY_POLICY.md
├── TAG_AND_RELEASE_POLICY.md
├── REPOSITORY_METADATA.md
├── LICENSE_DECISION.md
├── CONTRIBUTION_POLICY.md
├── ISSUE_AND_PR_POLICY.md
├── CODEOWNERS_POLICY.md
├── WORKFLOW_PERMISSION_POLICY.md
├── BRANCH_PROTECTION_POLICY.md
├── DEPENDENCY_UPDATE_POLICY.md
├── PUBLIC_ASSET_POLICY.md
├── GITHUB_SECURITY_CHECKLIST.md
├── GITHUB_READINESS_CHECKLIST.md
├── GITHUB_MATRIX.md
├── GITHUB_RISK_REGISTER.md
├── GITHUB_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Arquivos públicos principais:

```text
README.md
LICENSE
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
CHANGELOG.md
```

Scripts:

```text
scripts/GitHub
├── audit-repository.ps1
├── scan-large-files.ps1
├── scan-sensitive-files.ps1
├── validate-history.ps1
├── validate-repository-metadata.ps1
├── validate-community-files.ps1
├── validate-workflow-permissions.ps1
├── validate-public-links.ps1
├── generate-GitHub-report.ps1
└── collect-GitHub-evidence.ps1
```

Artifacts:

```text
reports/GitHub-preparation-report.yaml

contracts/GitHub-preparation-evidence.yaml
```

---

## Conceito essencial

### GitHub é parte do produto profissional

Para um avaliador externo, o repositório é a interface principal do projeto.

Código excelente com repositório confuso perde valor.

### Histórico também comunica engenharia

Commits revelam:

- disciplina;
- intenção;
- tamanho das mudanças;
- capacidade de revisão;
- capacidade de correção;
- evolução do projeto.

### Segurança começa antes do push

Depois que um secret entra no histórico, apenas removê-lo do arquivo atual não basta.

### Community files reduzem ambiguidade

Licença, contribuição, segurança e templates esclarecem como o projeto deve ser usado.

### Automação precisa de menor privilégio

Um workflow não deve possuir mais permissão do que precisa.

---

## Mão na massa guiada

### 1. Criar GitHub Preparation Charter

Arquivo:

```text
docs/GitHub/GITHUB_PREPARATION_CHARTER.md
```

Princípios:

```text
public exposure is intentional;

history is reviewed;

secrets never reach the repository;

claims remain evidence based;

community files are explicit;

workflows use minimum permissions;

links are validated;

LinkedIn preparation belongs to lesson 705.
```

---

### 2. Criar Public Repository Policy

Arquivo:

```text
docs/GitHub/PUBLIC_REPOSITORY_POLICY.md
```

Defina:

- finalidade pública;
- audiência;
- artifacts permitidos;
- artifacts proibidos;
- dados sintéticos;
- política de secrets;
- política de imagens;
- política de issues;
- política de releases.

---

### 3. Criar branch de preparação

```powershell
git switch `
  -c `
  chore/prepare-GitHub
```

A working tree precisa estar limpa.

---

### 4. Registrar baseline

```powershell
git rev-parse HEAD

git status --short

git branch --show-current
```

---

## Auditoria do repositório

### 5. Criar Repository Audit

Arquivo:

```text
docs/GitHub/REPOSITORY_AUDIT.md
```

Áreas:

- source;
- tests;
- docs;
- assets;
- workflows;
- reports;
- evidence;
- binaries;
- secrets;
- history;
- links;
- license.

---

### 6. Criar `audit-repository.ps1`

O script coleta:

- arquivos rastreados;
- arquivos ignorados;
- arquivos grandes;
- extensões;
- diretórios;
- workflows;
- community files;
- links;
- branch;
- commit;
- status.

---

### 7. Listar arquivos rastreados

```powershell
git ls-files
```

Revise:

- temporários;
- caches;
- logs;
- dumps;
- reports não sanitizados;
- credenciais;
- arquivos da IDE;
- diretórios de build.

---

### 8. Revisar `.gitignore`

Inclua apenas exclusões justificadas.

Categorias:

- Maven;
- IntelliJ;
- VS Code quando usado;
- Docker overrides locais;
- `.env`;
- logs;
- reports temporários;
- recordings locais;
- OS metadata.

---

### 9. Não esconder artifact obrigatório

Se um report aprovado precisa ser versionado, não o ignore por conveniência.

---

### 10. Revisar `.gitattributes`

Defina:

- line endings;
- arquivos binários;
- linguist quando necessário;
- diff para formatos textuais;
- export-ignore quando aplicável.

---

### 11. Detectar arquivos grandes

Crie:

```text
scripts/GitHub/scan-large-files.ps1
```

Classifique:

- necessário;
- comprimível;
- substituível;
- removível;
- candidato a storage externo.

---

### 12. Evitar binários desnecessários

Não versione:

- JAR de build;
- imagens Docker;
- dumps de banco;
- gravações grandes;
- caches;
- dependências baixadas.

---

### 13. Revisar assets

Assets públicos precisam ser:

- legíveis;
- sanitizados;
- atuais;
- relacionados ao projeto;
- referenciados.

---

### 14. Remover arquivos órfãos

Arquivo sem referência, função ou evidência precisa ser removido ou documentado.

---

## Segurança antes da publicação

### 15. Criar GitHub Security Checklist

Arquivo:

```text
docs/GitHub/GITHUB_SECURITY_CHECKLIST.md
```

---

### 16. Criar scan de arquivos sensíveis

`scan-sensitive-files.ps1` procura:

- `.env`;
- token;
- password;
- private key;
- keystore;
- certificate privado;
- credential exportada;
- endpoint interno;
- IP privado;
- dado pessoal;
- tenant real.

---

### 17. Revisar histórico

Um arquivo removido pode continuar no Git.

Use:

```powershell
git log `
  --all `
  --name-only `
  --pretty=format:
```

---

### 18. Verificar strings sensíveis no histórico

Use ferramenta de secret scanning adotada no projeto.

Não copie o conteúdo encontrado para reports públicos.

---

### 19. Rotacionar qualquer secret exposto

Mesmo que o repositório ainda não seja público.

---

### 20. Remover secret do histórico quando necessário

A reescrita precisa ser planejada porque altera hashes.

Registre:

- motivo;
- ferramenta;
- impacto;
- coordenação;
- validação.

---

### 21. Validar screenshots

Verifique:

- e-mail;
- nome de usuário;
- URL interna;
- token;
- tenant;
- host;
- dados pessoais;
- notificações.

---

### 22. Validar metadata de arquivos

Imagens e documentos podem carregar informações adicionais.

---

## Estratégia de branches

### 23. Criar Branch Strategy

Arquivo:

```text
docs/GitHub/BRANCH_STRATEGY.md
```

Estratégia simples:

```text
main:
estado publicavel.

feature/*:
nova capacidade.

fix/*:
correcao.

refactor/*:
refatoracao.

docs/*:
documentacao.

chore/*:
manutencao.
```

---

### 24. Evitar estratégia excessiva

O projeto não precisa de dezenas de branches permanentes.

---

### 25. Definir branch principal

Use uma única branch pública principal.

---

### 26. Definir regra de merge

Opções:

- squash merge;
- merge commit;
- rebase merge.

Escolha uma política coerente com o histórico desejado.

---

### 27. Definir exclusão de branches

Branches concluídas devem ser removidas quando não possuem valor histórico adicional.

---

## Histórico e commits

### 28. Criar Commit History Policy

Arquivo:

```text
docs/GitHub/COMMIT_HISTORY_POLICY.md
```

Critérios:

- intenção clara;
- mudança relacionada;
- mensagem consistente;
- teste;
- ausência de secrets;
- tamanho revisável.

---

### 29. Revisar log

```powershell
git log `
  --oneline `
  --decorate `
  --graph `
  --all
```

---

### 30. Identificar commits problemáticos

Exemplos:

- `teste`;
- `ajuste`;
- `final`;
- `agora vai`;
- mudanças gigantes sem contexto;
- commit com secret;
- commit de build output.

---

### 31. Não reescrever histórico por estética sem necessidade

A reescrita pode quebrar referências e colaboração.

---

### 32. Reescrever apenas quando o benefício supera o risco

Casos:

- secret;
- arquivo ilegal;
- binário gigante;
- histórico ainda privado e controlado.

---

### 33. Padronizar mensagens futuras

Formato:

```text
tipo(escopo): intencao
```

Exemplos:

```text
feat(api): register OrderFlow orders

fix(security): enforce tenant isolation

docs(portfolio): add engineering narrative

chore(GitHub): prepare public repository
```

---

### 34. Criar changelog

Arquivo:

```text
CHANGELOG.md
```

Categorias:

- added;
- changed;
- fixed;
- security;
- documentation.

Não transforme o changelog em cópia do log Git.

---

## Tags e releases

### 35. Criar Tag and Release Policy

Arquivo:

```text
docs/GitHub/TAG_AND_RELEASE_POLICY.md
```

---

### 36. Definir versionamento

Para o projeto demonstrativo:

```text
v1.0.0
```

representa a primeira versão pública completa.

---

### 37. Validar versão interna

README, OpenAPI, artifacts e release precisam concordar quando compartilham a mesma versão.

---

### 38. Criar tag anotada

Exemplo:

```powershell
git tag `
  -a `
  v1.0.0 `
  -m `
  "OrderFlow portfolio release v1.0.0"
```

A tag só será criada após todos os gates.

---

### 39. Preparar release notes

Inclua:

- visão geral;
- destaques;
- arquitetura;
- segurança;
- testes;
- execução;
- documentação;
- limitações;
- checksums;
- commit.

---

### 40. Não anexar artifact inseguro

Artifacts de release precisam passar por scan e sanitização.

---

### 41. Planejar releases futuras

Use versionamento consistente.

Evite tags como:

```text
final-final;

ultima;

agora-sim.
```

---

## Metadata do repositório

### 42. Criar Repository Metadata

Arquivo:

```text
docs/GitHub/REPOSITORY_METADATA.md
```

Campos:

- nome;
- descrição;
- website quando existir;
- topics;
- social preview;
- visibilidade;
- default branch.

---

### 43. Criar descrição curta

Exemplo:

```text
Backend Java 21 para orquestração resiliente de pedidos,
mensageria confiável, segurança multi-tenant
e observabilidade ponta a ponta.
```

---

### 44. Definir topics

Exemplos:

```text
Java;

Spring-Boot;

backend;

Kafka;

PostgreSQL;

hexagonal-architecture;

OpenTelemetry;

Testcontainers;

Docker;

portfolio.
```

Use somente tecnologias reais.

---

### 45. Evitar topic excessiva

Selecione palavras que ajudam descoberta.

---

### 46. Criar social preview

A imagem precisa:

- ter título legível;
- representar arquitetura ou identidade;
- evitar texto pequeno;
- não conter dado sensível;
- funcionar em recorte horizontal.

---

## Licença

### 47. Criar License Decision

Arquivo:

```text
docs/GitHub/LICENSE_DECISION.md
```

Perguntas:

- terceiros podem usar?
- podem modificar?
- precisam manter aviso?
- há obrigação de compartilhar alterações?
- existe dependência com licença incompatível?

---

### 48. Não escolher licença por moda

Entenda a consequência.

---

### 49. Criar `LICENSE`

Use o texto oficial da licença escolhida.

Não modifique a redação jurídica.

---

### 50. Revisar licenças das dependências

O projeto precisa conhecer incompatibilidades relevantes.

---

### 51. Diferenciar licença do código e conteúdo

Materiais educacionais podem exigir política própria quando necessário.

---

## Community files

### 52. Criar `CONTRIBUTING.md`

Inclua:

- preparação;
- branch;
- commits;
- testes;
- style;
- PR;
- segurança;
- documentação.

---

### 53. Criar Contribution Policy

Arquivo:

```text
docs/GitHub/CONTRIBUTION_POLICY.md
```

---

### 54. Criar `CODE_OF_CONDUCT.md`

Use política reconhecida e adequada.

---

### 55. Criar `SECURITY.md`

Inclua:

- versões suportadas;
- como reportar vulnerabilidade;
- o que não publicar em issue;
- expectativa de resposta sem prometer SLA inexistente;
- tratamento responsável.

---

### 56. Não informar e-mail inexistente

Use um canal real e controlado quando o repositório for publicado.

---

### 57. Criar Issue and PR Policy

Arquivo:

```text
docs/GitHub/ISSUE_AND_PR_POLICY.md
```

---

## Templates de issue

### 58. Criar bug report form

Arquivo:

```text
.GitHub/ISSUE_TEMPLATE/bug_report.yml
```

Campos:

- descrição;
- reprodução;
- esperado;
- atual;
- ambiente;
- logs sanitizados;
- evidência;
- checklist.

---

### 59. Criar feature request form

Inclua:

- problema;
- valor;
- alternativa;
- escopo;
- impacto arquitetural;
- riscos.

---

### 60. Criar documentation form

Inclua:

- arquivo;
- inconsistência;
- fonte correta;
- link;
- proposta.

---

### 61. Criar config do issue template

Defina:

- links;
- contato de segurança;
- blank issues conforme política.

---

### 62. Evitar dados sensíveis nos forms

Adicione avisos claros.

---

## Pull request

### 63. Criar pull request template

Arquivo:

```text
.GitHub/pull_request_template.md
```

Seções:

- objetivo;
- contexto;
- mudanças;
- testes;
- riscos;
- migrations;
- contracts;
- observability;
- security;
- screenshots;
- checklist.

---

### 64. Criar checklist de contrato

Pergunte:

- OpenAPI mudou?
- schema mudou?
- Postman mudou?
- breaking change foi avaliada?

---

### 65. Criar checklist de banco

Pergunte:

- migration nova?
- índice?
- rollback?
- lock?
- volume?

---

### 66. Criar checklist de mensageria

Pergunte:

- message version?
- ordering?
- retry?
- DLQ?
- idempotência?

---

### 67. Criar checklist de segurança

Pergunte:

- tenant?
- scopes?
- roles?
- secrets?
- dados sensíveis?

---

## CODEOWNERS

### 68. Criar CODEOWNERS Policy

Arquivo:

```text
docs/GitHub/CODEOWNERS_POLICY.md
```

---

### 69. Criar `.GitHub/CODEOWNERS`

Exemplo sintético:

```text
* @orderflow-maintainer

/apps/ @orderflow-maintainer
/libs/orderflow-domain/ @orderflow-maintainer
/.GitHub/workflows/ @orderflow-maintainer
/docs/security/ @orderflow-maintainer
```

Substitua pelo usuário real antes da publicação.

---

### 70. Evitar ownership falso

Não liste conta inexistente no repositório final.

---

## Dependências

### 71. Criar Dependency Update Policy

Arquivo:

```text
docs/GitHub/DEPENDENCY_UPDATE_POLICY.md
```

Defina:

- frequência;
- agrupamento;
- security updates;
- major versions;
- testes;
- owners;
- merge.

---

### 72. Criar Dependabot config

Arquivo:

```text
.GitHub/dependabot.yml
```

Ecossistemas:

- Maven;
- GitHub Actions;
- Docker quando suportado pelo fluxo adotado.

---

### 73. Limitar pull requests abertos

Evite ruído.

---

### 74. Agrupar updates compatíveis

Exemplo:

- patch de testes;
- patch de observabilidade;
- GitHub Actions.

---

### 75. Não auto-merge major

Mudança maior exige revisão.

---

## Workflows

### 76. Criar Workflow Permission Policy

Arquivo:

```text
docs/GitHub/WORKFLOW_PERMISSION_POLICY.md
```

---

### 77. Definir permissões mínimas

No nível global:

```yaml
permissions:
  contents: read
```

Jobs específicos recebem apenas o necessário.

---

### 78. Fixar actions por referência confiável

A política deve evitar referência mutável sem controle.

---

### 79. Revisar uso de secrets

Workflows de pull request externo não devem receber secrets privilegiados.

---

### 80. Revisar eventos

Analise:

- push;
- pull_request;
- workflow_dispatch;
- schedule;
- release.

---

### 81. Evitar `pull_request_target` sem necessidade

Esse evento exige cuidado elevado.

---

### 82. Revisar expressions

Entrada não confiável não deve chegar a shell sem tratamento.

---

### 83. Revisar artifacts de workflow

Artifacts precisam:

- ser sanitizados;
- ter retenção;
- ter nome;
- ter checksum quando necessário.

---

### 84. Revisar caches

Cache não pode ser usado como fonte de artifact confiável.

---

### 85. Revisar environments

Ambientes protegidos podem exigir aprovação.

---

### 86. Criar validator de permissões

`validate-workflow-permissions.ps1` verifica:

- permissions;
- secrets;
- events;
- actions;
- artifact retention;
- environment.

---

## Proteção de branches

### 87. Criar Branch Protection Policy

Arquivo:

```text
docs/GitHub/BRANCH_PROTECTION_POLICY.md
```

Regras desejadas para `main`:

- pull request obrigatório;
- checks obrigatórios;
- branch atualizada;
- conversation resolution;
- force push bloqueado;
- deletion bloqueada;
- review quando houver equipe.

---

### 88. Definir checks obrigatórios

Exemplos:

- build;
- unit;
- integration;
- architecture;
- contract-security;
- documentation;
- container security.

---

### 89. Não exigir check inexistente

Nome precisa corresponder ao workflow real.

---

### 90. Definir tag protection quando aplicável

Release tags não devem ser alteradas silenciosamente.

---

## README e experiência pública

### 91. Revisar topo do README

Precisa conter:

- nome;
- proposta;
- status honesto;
- arquitetura;
- quick links;
- execução;
- evidências.

---

### 92. Validar todos os links

```powershell
.\scripts\GitHub\validate-public-links.ps1
```

---

### 93. Remover links locais

Proibido:

- caminho do Windows;
- home do usuário;
- sandbox;
- porta sem contexto;
- arquivo não versionado.

---

### 94. Revisar badges

Badges precisam:

- existir;
- apontar para workflow correto;
- usar branch correta;
- não afirmar cobertura inexistente.

---

### 95. Revisar linguagem pública

Evite:

- “em breve” sem plano;
- “100% seguro”;
- “produção” sem prova;
- “enterprise” sem definição;
- “infinitamente escalável”.

---

### 96. Revisar seção Como avaliar

O leitor deve encontrar um percurso claro.

---

### 97. Revisar seção Limitações

Ela precisa permanecer visível.

---

## Assets públicos

### 98. Criar Public Asset Policy

Arquivo:

```text
docs/GitHub/PUBLIC_ASSET_POLICY.md
```

---

### 99. Organizar assets

Estrutura:

```text
docs/assets
├── architecture
├── dashboards
├── OpenAPI
├── Postman
├── pipeline
└── social-preview
```

---

### 100. Otimizar tamanho

Use formato adequado.

---

### 101. Validar acessibilidade

Inclua alt text nos usos Markdown.

---

### 102. Validar consistência visual

Diagramas precisam usar nomes atuais.

---

## Repository settings

### 103. Criar checklist de metadata

Confirme:

- descrição;
- website;
- topics;
- social preview;
- default branch;
- issues;
- projects quando usados;
- discussions quando usados;
- wiki quando usada.

---

### 104. Desabilitar recursos sem uso

Não deixe superfície vazia sem propósito.

---

### 105. Revisar visibilidade

Antes de tornar público, execute o gate completo.

---

### 106. Revisar forks e colaboração

Defina como contribuições serão tratadas.

---

## Preparação da release pública

### 107. Criar checklist de release

Antes da tag:

- gates;
- secret scan;
- links;
- license;
- changelog;
- release notes;
- OpenAPI;
- Postman;
- checksums;
- assets.

---

### 108. Criar release candidate local

Use um diretório de exportação ou archive para revisar o conteúdo final.

---

### 109. Validar export

O pacote não deve incluir arquivos ignorados ou locais.

---

### 110. Executar clone de validação

Em diretório novo:

```powershell
git clone `
  --no-local `
  .
```

Valide o projeto como um consumidor externo.

---

### 111. Executar guia local no clone

---

### 112. Executar links no clone

---

### 113. Executar secret scan no clone

---

### 114. Executar gates no clone

---

## Governança

### 115. Criar GitHub Readiness Checklist

Arquivo:

```text
docs/GitHub/GITHUB_READINESS_CHECKLIST.md
```

Itens:

- audit;
- secrets;
- history;
- branches;
- commits;
- tags;
- releases;
- metadata;
- license;
- community files;
- templates;
- CODEOWNERS;
- dependencies;
- workflows;
- branch protection;
- README;
- assets;
- clone test.

---

### 116. Criar GitHub Matrix

Arquivo:

```text
docs/GitHub/GITHUB_MATRIX.md
```

Colunas:

- área;
- artifact;
- validator;
- risco;
- owner;
- status;
- evidence.

---

### 117. Criar Risk Register

Arquivo:

```text
docs/GitHub/GITHUB_RISK_REGISTER.md
```

Riscos:

```text
secret no historico;

arquivo grande;

license ausente;

link quebrado;

badge falso;

workflow privilegiado;

action mutavel;

branch sem protecao;

release sem checksum;

asset sensivel;

claim exagerada;

LinkedIn antecipado.
```

---

### 118. Criar Traceability

Arquivo:

```text
docs/GitHub/GITHUB_TRACEABILITY.md
```

Exemplo:

```text
public security claim
-> SECURITY.md
-> security tests
-> secret scan
-> evidence.

release v1.0.0
-> source commit
-> tag
-> release notes
-> checksums.

reproducible execution
-> README
-> local guide
-> clone validation
-> smoke report.
```

---

### 119. Criar boundary da próxima aula

Arquivo:

```text
docs/GitHub/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 704 define:

- repository audit;
- public repository policy;
- branch strategy;
- commit history;
- changelog;
- tags and releases;
- repository metadata;
- license;
- contributing;
- code of conduct;
- security policy;
- issue templates;
- pull request template;
- CODEOWNERS;
- Dependabot;
- workflow permissions;
- branch protection;
- public assets;
- release readiness;
- clone validation.

A aula 705 define:

- LinkedIn headline;
- about section;
- featured project;
- experience framing;
- skills;
- project description;
- technical publication;
- portfolio links;
- profile consistency;
- networking and visibility strategy.

Nenhum conteudo de LinkedIn
e criado nesta aula.
```

---

## Validação final

### 120. Criar report

Arquivo:

```text
reports/GitHub-preparation-report.yaml
```

Exemplo:

```yaml
GitHubPreparation:
  repository:
    trackedFiles:
      measured
    largeFiles:
      0
    sensitiveFiles:
      0

  history:
    secretFindings:
      0
    invalidCommits:
      measured

  community:
    license:
      PASS
    contributing:
      PASS
    codeOfConduct:
      PASS
    security:
      PASS
    issueTemplates:
      PASS
    pullRequestTemplate:
      PASS

  automation:
    workflows:
      PASS
    minimumPermissions:
      PASS
    Dependabot:
      PASS
    branchProtectionPolicy:
      PASS

  publicExperience:
    README:
      PASS
    links:
      PASS
    assets:
      PASS
    cloneValidation:
      PASS

  LinkedInPreparation:
    completed:
      false

  gate:
    PASS
```

Os números precisam vir da execução.

---

### 121. Criar evidence

Arquivo:

```text
contracts/GitHub-preparation-evidence.yaml
```

Campos:

- lesson;
- project;
- baseline commit;
- tracked file count;
- ignored file count;
- large file count;
- sensitive file count;
- history secret finding count;
- temporary file count;
- branch strategy status;
- commit history status;
- changelog status;
- tag policy status;
- release policy status;
- metadata status;
- topic count;
- social preview status;
- license status;
- contribution status;
- code of conduct status;
- security policy status;
- issue template count;
- pull request template status;
- CODEOWNERS status;
- Dependabot status;
- workflow count;
- workflow permission status;
- branch protection policy status;
- broken link count;
- invalid badge count;
- invalid asset count;
- clone validation status;
- local execution status;
- secret scan status;
- LinkedIn preparation completed;
- documentation status;
- gate status;
- timestamp.

---

### 122. Criar gate GitHub

Status:

```text
PASS;

FAIL_REPOSITORY_AUDIT;

FAIL_SENSITIVE_FILE;

FAIL_HISTORY_SECRET;

FAIL_LARGE_FILE;

FAIL_GITIGNORE;

FAIL_GITATTRIBUTES;

FAIL_BRANCH_STRATEGY;

FAIL_COMMIT_HISTORY;

FAIL_CHANGELOG;

FAIL_TAG_POLICY;

FAIL_RELEASE_POLICY;

FAIL_REPOSITORY_METADATA;

FAIL_LICENSE;

FAIL_CONTRIBUTING;

FAIL_CODE_OF_CONDUCT;

FAIL_SECURITY_POLICY;

FAIL_ISSUE_TEMPLATE;

FAIL_PULL_REQUEST_TEMPLATE;

FAIL_CODEOWNERS;

FAIL_DEPENDABOT;

FAIL_WORKFLOW_PERMISSION;

FAIL_WORKFLOW_SECURITY;

FAIL_BRANCH_PROTECTION_POLICY;

FAIL_README;

FAIL_LINK;

FAIL_BADGE;

FAIL_ASSET;

FAIL_CLONE_VALIDATION;

FAIL_LOCAL_EXECUTION;

FAIL_SECRET_SCAN;

FAIL_LINKEDIN_ANTICIPATION;

INCONCLUSIVE.
```

---

### 123. Executar validators

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\GitHub\audit-repository.ps1

.\scripts\GitHub\scan-large-files.ps1

.\scripts\GitHub\scan-sensitive-files.ps1

.\scripts\GitHub\validate-history.ps1

.\scripts\GitHub\validate-community-files.ps1

.\scripts\GitHub\validate-workflow-permissions.ps1

.\scripts\GitHub\validate-public-links.ps1
```

---

### 124. Executar clone final

Valide:

- build;
- tests;
- Docker;
- guide;
- OpenAPI;
- Postman;
- links;
- secrets.

---

### 125. Encerrar o laboratório

Confirme:

- Charter;
- audit;
- public policy;
- `.gitignore`;
- `.gitattributes`;
- large files;
- secrets;
- history;
- branch strategy;
- commits;
- changelog;
- tags;
- releases;
- metadata;
- topics;
- social preview;
- license;
- contributing;
- code of conduct;
- security;
- issues;
- pull requests;
- CODEOWNERS;
- Dependabot;
- workflows;
- permissions;
- branch protection;
- README;
- assets;
- release readiness;
- clone validation;
- report;
- evidence;
- gate aprovado;
- aula 705 preservada.

---

## Entendendo o que foi feito

### O repositório ganhou intenção pública

A exposição deixou de ser apenas um push.

### O histórico ganhou revisão

Commits e branches passaram a comunicar engenharia.

### A segurança foi verificada antes da publicação

Arquivos, histórico, screenshots e metadata foram auditados.

### Community files reduziram ambiguidade

Licença, contribuição, segurança, issues e PRs passaram a ter regras.

### Workflows ganharam menor privilégio

Permissões e secrets foram revisados.

### A release ganhou rastreabilidade

Tag, commit, notes, artifacts e checksums passaram a formar uma unidade.

### A experiência pública ficou avaliável

README, links, assets e clone limpo foram validados.

### O LinkedIn ficou preservado

A próxima aula trabalhará posicionamento sem misturar responsabilidades.

---

## Erros comuns importantes

### Fazer push antes do secret scan

O histórico pode expor credenciais.

### Limpar apenas o arquivo atual

O secret pode permanecer em commits antigos.

### Reescrever todo o histórico por estética

O custo pode superar o benefício.

### Escolher licença sem entender

O uso futuro pode ficar inadequado.

### Dar permissão de escrita a todo workflow

A superfície de risco aumenta.

### Aceitar badge falso

A confiança diminui.

### Publicar asset com dado pessoal

A exposição pode ser irreversível.

### Criar release sem commit claro

A rastreabilidade é perdida.

### Não testar clone limpo

Conhecimento oculto permanece.

### Escrever conteúdo de LinkedIn agora

Essa etapa pertence à aula 705.

---

## Comandos úteis

### Auditar

```powershell
.\scripts\GitHub\audit-repository.ps1
```

### Verificar arquivos sensíveis

```powershell
.\scripts\GitHub\scan-sensitive-files.ps1
```

### Verificar histórico

```powershell
.\scripts\GitHub\validate-history.ps1
```

### Verificar links

```powershell
.\scripts\GitHub\validate-public-links.ps1
```

---

## Exercício principal

Prepare o OrderFlow para uma release pública `v1.0.0`.

Inclua:

1. criar branch;
2. registrar baseline;
3. auditar arquivos;
4. revisar ignore;
5. revisar attributes;
6. detectar arquivos grandes;
7. detectar secrets atuais;
8. detectar secrets no histórico;
9. revisar screenshots;
10. revisar commits;
11. criar changelog;
12. definir tag;
13. escrever release notes;
14. definir descrição;
15. definir topics;
16. preparar social preview;
17. escolher licença;
18. criar contributing;
19. criar code of conduct;
20. criar security policy;
21. criar issue forms;
22. criar PR template;
23. criar CODEOWNERS;
24. configurar Dependabot;
25. revisar permissions;
26. definir branch protection;
27. validar README;
28. validar links;
29. executar clone limpo;
30. executar gates;
31. criar report;
32. criar evidence.

Não crie conteúdo de LinkedIn.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 703 e ponte para a aula 705 foram preservadas;
- GitHub Preparation Charter foi criado;
- Public Repository Policy foi criada;
- branch de preparação foi criada;
- baseline foi registrada;
- Repository Audit foi criado;
- audit script foi criado;
- arquivos rastreados foram revisados;
- `.gitignore` foi revisado;
- artifacts obrigatórios não foram ocultados;
- `.gitattributes` foi revisado;
- arquivos grandes foram detectados;
- binários desnecessários foram removidos;
- assets foram revisados;
- arquivos órfãos foram removidos;
- Security Checklist foi criado;
- arquivos sensíveis foram escaneados;
- histórico foi revisado;
- secrets no histórico foram procurados;
- secrets expostos foram rotacionados;
- reescrita de histórico foi governada;
- screenshots foram validadas;
- metadata foi validada;
- Branch Strategy foi criada;
- estratégia excessiva foi evitada;
- branch principal foi definida;
- merge policy foi definida;
- exclusão de branches foi definida;
- Commit History Policy foi criada;
- log foi revisado;
- commits problemáticos foram identificados;
- reescrita estética foi evitada;
- mensagens futuras foram padronizadas;
- changelog foi criado;
- Tag and Release Policy foi criada;
- versionamento foi definido;
- versões foram validadas;
- tag anotada foi preparada;
- release notes foram preparadas;
- artifacts inseguros foram bloqueados;
- releases futuras foram planejadas;
- Repository Metadata foi criada;
- descrição curta foi criada;
- topics foram definidos;
- excesso de topics foi evitado;
- social preview foi criado;
- License Decision foi criada;
- licença não foi escolhida por moda;
- arquivo `LICENSE` foi criado;
- licenças de dependências foram revisadas;
- código e conteúdo foram diferenciados;
- `CONTRIBUTING.md` foi criado;
- Contribution Policy foi criada;
- `CODE_OF_CONDUCT.md` foi criado;
- `SECURITY.md` foi criado;
- canal inexistente não foi inventado;
- Issue and PR Policy foi criada;
- bug form foi criado;
- feature form foi criado;
- documentation form foi criado;
- config de issues foi criado;
- avisos de segurança foram adicionados;
- PR template foi criado;
- checklist de contrato foi criado;
- checklist de banco foi criado;
- checklist de mensageria foi criado;
- checklist de segurança foi criado;
- CODEOWNERS Policy foi criada;
- CODEOWNERS foi criado;
- ownership falso foi evitado;
- Dependency Update Policy foi criada;
- Dependabot foi criado;
- limite de PRs foi definido;
- updates foram agrupados;
- auto-merge major foi evitado;
- Workflow Permission Policy foi criada;
- permissões mínimas foram definidas;
- actions foram fixadas conforme policy;
- secrets em forks foram revisados;
- eventos foram revisados;
- evento privilegiado foi evitado;
- expressions foram revisadas;
- artifacts foram sanitizados;
- caches foram revisados;
- environments foram revisados;
- validator de permissões foi criado;
- Branch Protection Policy foi criada;
- regras da branch principal foram definidas;
- checks obrigatórios foram definidos;
- checks inexistentes foram evitados;
- tag protection foi considerada;
- topo do README foi revisado;
- links foram validados;
- caminhos locais foram removidos;
- badges foram revisados;
- linguagem pública foi revisada;
- seção Como avaliar foi revisada;
- limitações foram preservadas;
- Public Asset Policy foi criada;
- assets foram organizados;
- tamanho foi otimizado;
- acessibilidade foi validada;
- consistência visual foi validada;
- metadata do repositório foi revisada;
- recursos sem uso foram desabilitados;
- visibilidade foi revisada;
- colaboração foi definida;
- release checklist foi criado;
- release candidate local foi criado;
- export foi validado;
- clone limpo foi executado;
- guia local foi executado no clone;
- links foram executados no clone;
- secret scan foi executado no clone;
- gates foram executados no clone;
- Readiness Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 705 foi criado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- preparação LinkedIn não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\GitHub\scan-sensitive-files.ps1

.\scripts\GitHub\validate-community-files.ps1

.\scripts\GitHub\validate-workflow-permissions.ps1
```

Adicione:

```powershell
git add `
  .GitHub `
  README.md `
  LICENSE `
  CONTRIBUTING.md `
  CODE_OF_CONDUCT.md `
  SECURITY.md `
  CHANGELOG.md `
  docs/GitHub `
  docs/assets `
  scripts/GitHub `
  reports/GitHub-preparation-report.yaml `
  contracts/GitHub-preparation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|C:\\Users\\|/mnt/data|realTenant|realCustomer|LinkedIn-post-draft"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "chore(GitHub): prepare OrderFlow public repository"
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

- secret;
- arquivo local;
- URL inventada;
- owner inexistente;
- conteúdo da aula 705.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você preparou o GitHub do OrderFlow.

Você revisou:

```text
repository audit;

public policy;

Git history;

branches;

commits;

changelog;

tags;

releases;

metadata;

topics;

social preview;

license;

contributing;

code of conduct;

security policy;

issue templates;

pull request template;

CODEOWNERS;

Dependabot;

workflow permissions;

branch protection;

README;

public assets;

release readiness;

clean clone validation;

report e evidence.
```

O repositório agora está pronto para exposição pública segura, rastreável e profissional.

A próxima aula será:

```text
705 - M20.35 - Preparacao LinkedIn
```

Nela, você transformará o OrderFlow em posicionamento profissional no LinkedIn, alinhando título, resumo, experiência, projeto, competências, publicação, links e estratégia de visibilidade.

Nenhum conteúdo de LinkedIn foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Auditei o repositório.
- [ ] Escaneei arquivos e histórico.
- [ ] Revisei branches e commits.
- [ ] Criei changelog.
- [ ] Preparei tag e release.
- [ ] Defini metadata e topics.
- [ ] Escolhi licença.
- [ ] Criei community files.
- [ ] Criei templates.
- [ ] Criei CODEOWNERS.
- [ ] Configurei Dependabot.
- [ ] Revisei workflows.
- [ ] Defini branch protection.
- [ ] Revisei README e assets.
- [ ] Validei clone limpo.
- [ ] Preservei LinkedIn para a aula 705.

---

## Troubleshooting adicional

### Secret apareceu em commit antigo

Rotacione e planeje reescrita do histórico.

### Arquivo grande já entrou no histórico

Remova do histórico quando o custo for justificável.

### Workflow precisa escrever release

Conceda permissão apenas ao job necessário.

### CODEOWNERS não funciona

Revise caminho, branch e usuário real.

### Dependabot gera ruído

Agrupe updates e reduza limite.

### Badge não atualiza

Revise workflow, branch e URL.

### Link quebra somente no Linux

Revise casing.

### Clone limpo não executa

Existe conhecimento oculto ou arquivo ignorado necessário.

### Licença ficou indefinida

Não publique sem decisão.

### Quero anunciar o projeto no LinkedIn

Essa etapa pertence à aula 705.

---

## Perguntas de revisão

1. Preparar GitHub é apenas push?
2. Por que revisar histórico?
3. Remover secret do arquivo basta?
4. Quando reescrever histórico?
5. Para que serve `.gitattributes`?
6. Por que evitar binários?
7. O que branch strategy define?
8. Changelog copia o log?
9. Para que serve tag anotada?
10. O que release notes precisa conter?
11. Por que licença importa?
12. Para que serve `SECURITY.md`?
13. O que issue form melhora?
14. Para que serve CODEOWNERS?
15. Dependabot pode auto-merge major?
16. Por que usar permissões mínimas?
17. O que proteger na branch principal?
18. Badge pode afirmar algo não medido?
19. Por que validar social preview?
20. O que clone limpo revela?
21. O que evidence GitHub prova?
22. O que a aula 705 fará?
23. O que não foi criado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Segurança e rastreabilidade.
3. Não.
4. Secret ou arquivo grave.
5. Consistência de arquivos.
6. Peso e segurança.
7. Fluxo de mudança.
8. Não.
9. Identificar release.
10. Mudanças e limitações.
11. Define uso.
12. Reportar vulnerabilidade.
13. Contexto.
14. Ownership.
15. Não.
16. Reduzir risco.
17. Checks e force push.
18. Não.
19. Primeira impressão.
20. Conhecimento oculto.
21. Prontidão pública.
22. Preparar LinkedIn.
23. Conteúdo profissional no LinkedIn.
24. Preparacao LinkedIn.
25. Expor com segurança, clareza e prova.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 704 - M20.34 - Preparacao GitHub

- Continuei após Defesa de decisões engenharia.
- Criei GitHub Preparation Charter.
- Criei Public Repository Policy.
- Criei branch de preparação.
- Registrei baseline.
- Criei Repository Audit.
- Criei audit-repository.
- Revisei arquivos rastreados.
- Revisei `.gitignore`.
- Preservei artifacts obrigatórios.
- Revisei `.gitattributes`.
- Criei scan de arquivos grandes.
- Removi binários desnecessários.
- Revisei assets.
- Removi arquivos órfãos.
- Criei Security Checklist.
- Criei scan de arquivos sensíveis.
- Revisei histórico.
- Procurei secrets no histórico.
- Defini rotação e reescrita controlada.
- Revisei screenshots e metadata.
- Criei Branch Strategy.
- Defini branch principal, merge e limpeza.
- Criei Commit History Policy.
- Revisei log e mensagens.
- Evitei reescrita estética.
- Padronizei commits futuros.
- Criei CHANGELOG.
- Criei Tag and Release Policy.
- Defini versionamento.
- Preparei tag anotada.
- Preparei release notes.
- Bloqueei artifacts inseguros.
- Criei Repository Metadata.
- Criei descrição curta.
- Defini topics.
- Criei social preview.
- Criei License Decision.
- Criei LICENSE.
- Revisei licenças de dependências.
- Criei CONTRIBUTING.
- Criei Contribution Policy.
- Criei CODE_OF_CONDUCT.
- Criei SECURITY.
- Criei Issue and PR Policy.
- Criei forms de bug, feature e documentação.
- Criei PR template.
- Criei checklists de contrato, banco, mensageria e segurança.
- Criei CODEOWNERS Policy.
- Criei CODEOWNERS.
- Evitei owner inexistente.
- Criei Dependency Update Policy.
- Configurei Dependabot.
- Agrupei updates.
- Evitei auto-merge major.
- Criei Workflow Permission Policy.
- Revisei permissions, actions, secrets, events e artifacts.
- Criei validator de workflows.
- Criei Branch Protection Policy.
- Defini checks obrigatórios.
- Revisei tag protection.
- Revisei topo do README.
- Validei links, badges e linguagem.
- Preservei limitações.
- Criei Public Asset Policy.
- Organizei e otimizei assets.
- Validei acessibilidade e consistência.
- Revisei repository settings.
- Desabilitei recursos sem uso.
- Criei release checklist.
- Criei release candidate local.
- Validei export.
- Executei clone limpo.
- Executei guia local, links, scan e gates no clone.
- Criei GitHub Readiness Checklist.
- Criei GitHub Matrix.
- Criei GitHub Risk Register.
- Criei GitHub Traceability.
- Criei boundary para a aula 705.
- Criei report, evidence e gate.
- Não antecipei preparação LinkedIn.
- Próxima aula: Preparacao LinkedIn.
```

---

## Referência técnica curta

- GitHub Repository.
- Default Branch.
- Branch Protection.
- Commit History.
- Semantic Version.
- Annotated Tag.
- Release Notes.
- License.
- Contributing Guide.
- Code of Conduct.
- Security Policy.
- Issue Form.
- Pull Request Template.
- CODEOWNERS.
- Dependabot.
- Workflow Permission.
- Secret Scanning.
- Social Preview.
- Clean Clone Validation.

Regra final:

```text
A preparação GitHub do OrderFlow deve transformar o repositório em uma interface pública segura e avaliável: repository audit lista tracked, ignored, temporary, large and orphan files, `.gitignore` exclui somente outputs locais e preserva artifacts obrigatórios, `.gitattributes` controla line endings and binaries, sensitive scan cobre source, env, reports, screenshots, metadata and Git history, qualquer secret encontrado é rotacionado e a reescrita de histórico é governada, branch strategy mantém main publicável e branches curtas, commit policy exige intenção, escopo, teste and reviewability, changelog resume mudanças relevantes, tag and release policy liga version, commit, notes, artifacts and checksums, metadata define descrição, topics, website and social preview sem exagero, license decision considera uso e dependências, CONTRIBUTING, CODE_OF_CONDUCT and SECURITY definem colaboração e reporte responsável, issue forms e PR template coletam reprodução, risco, contracts, migrations, messaging and security, CODEOWNERS usa contas reais, Dependabot agrupa updates e evita auto-merge major, workflows usam minimum permissions, fixed action references, safe events, sanitized artifacts and protected environments, branch protection exige PRs e checks existentes, README, badges, assets, links and limitations permanecem coerentes, release candidate e clean clone comprovam que build, local guide, OpenAPI, Postman and gates funcionam sem conhecimento oculto, report and evidence registram prontidão pública, e o gate fecha repository, history, community, automation, release and clone validation enquanto headline, about, featured project, experience, skills, publication and LinkedIn visibility permanecem reservados para a aula 705.
```
