# 706 - M20.36 - Curriculo Java Backend

## Apresentação da aula

Na aula 705, você preparou o LinkedIn para comunicar seu posicionamento profissional.

O trabalho anterior organizou:

- função-alvo;
- função adjacente;
- competências transferíveis;
- headline;
- seção Sobre;
- experiências;
- projeto em destaque;
- competências;
- links;
- publicação de lançamento;
- série técnica;
- networking;
- consistência entre LinkedIn, GitHub e portfólio;
- report, evidence e gate.

Agora você transformará esse posicionamento em um currículo direcionado para oportunidades Java Backend.

Currículo não é uma cópia do LinkedIn.

O LinkedIn ajuda descoberta, relacionamento e aprofundamento.

O currículo precisa ajudar uma pessoa ou sistema a decidir rapidamente:

- o candidato possui aderência à vaga?
- a experiência é relevante?
- as competências estão comprovadas?
- o projeto demonstra capacidade prática?
- os resultados estão claros?
- o documento é fácil de ler?
- as informações são verdadeiras?
- existe um próximo passo para avaliação?

Nesta aula, você criará uma base curricular reutilizável e versões direcionadas.

A estrutura final trabalhará:

- versão de uma página;
- versão detalhada;
- versão para Java Backend;
- versão de transição de QA para Backend;
- resumo profissional;
- experiências com impacto;
- projeto OrderFlow;
- competências técnicas;
- educação;
- cursos;
- idiomas;
- links públicos;
- palavras-chave;
- compatibilidade com ATS;
- revisão humana;
- adaptação por vaga;
- controle de versões;
- PDF final;
- documento-fonte editável;
- relatório e evidência.

O currículo precisa preservar a verdade sobre sua trajetória.

Uma pessoa pode possuir experiência formal em QA e, ao mesmo tempo, demonstrar capacidade concreta em Java Backend por meio de:

- desenvolvimento de projetos completos;
- automação;
- APIs;
- bancos;
- integração;
- pipelines;
- qualidade;
- segurança;
- testes;
- observabilidade;
- documentação.

A transição não deve apagar a experiência anterior.

Ela deve explicar como essa experiência fortalece a nova direção.

Exemplo de posicionamento honesto:

```text
profissional de qualidade e automacao
com experiencia em APIs,
testes,
bancos
e CI/CD,
em consolidacao de carreira Java Backend
por meio de projetos completos
e pratica orientada a engenharia.
```

Isso é diferente de afirmar experiência comercial que não existiu.

A próxima aula será:

```text
707 - M20.37 - Entrevista Java
```

Na aula 707, você usará o currículo, o GitHub, o LinkedIn, o portfólio e o OrderFlow em uma simulação de entrevista Java, trabalhando apresentação, perguntas técnicas, exercícios, comportamento, comunicação e feedback.

Nesta aula, nenhuma entrevista será simulada.

O laboratório será:

```text
labs/m20/aula-706-curriculo-java-backend/orderflow-resume
```

Regra central:

```text
um curriculo forte
nao tenta contar tudo;

ele seleciona
o que e relevante,
comprova valor,
usa linguagem da vaga
e facilita a decisao.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
703:
Defesa de decisoes engenharia.

704:
Preparacao GitHub.

705:
Preparacao LinkedIn.

706:
Curriculo Java Backend.

707:
Entrevista Java.

708:
Entrevista arquitetura.
```

A aula 706 utiliza como fonte:

- experiências reais;
- LinkedIn revisado;
- GitHub preparado;
- narrativa técnica;
- OrderFlow;
- reports;
- evidence;
- cursos;
- formação;
- habilidades;
- resultados comprováveis;
- função-alvo;
- descrições de vagas.

A ordem de autoridade será:

```text
experiencia real;

projeto executado;

evidencia;

curriculo.
```

Se o currículo disser algo que não pode ser explicado em entrevista, a frase precisa ser corrigida.

Se uma palavra-chave aparece apenas para enganar um sistema de triagem, ela não deve ser usada.

Se um número não possui fonte, ele deve ser removido ou substituído por descrição qualitativa verdadeira.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/resume
├── RESUME_CHARTER.md
├── CAREER_TARGET.md
├── MASTER_CAREER_INVENTORY.md
├── JOB_DESCRIPTION_ANALYSIS.md
├── ATS_KEYWORD_MATRIX.md
├── PROFESSIONAL_SUMMARY.md
├── EXPERIENCE_BULLET_BANK.md
├── ORDERFLOW_PROJECT_SECTION.md
├── TECHNICAL_SKILLS_SECTION.md
├── EDUCATION_AND_COURSES.md
├── LINKS_AND_CONTACT_POLICY.md
├── ONE_PAGE_RESUME.md
├── DETAILED_RESUME.md
├── JAVA_BACKEND_RESUME.md
├── QA_TO_BACKEND_TRANSITION_RESUME.md
├── ROLE_TAILORING_GUIDE.md
├── RESUME_VERSIONING_POLICY.md
├── PDF_EXPORT_POLICY.md
├── RESUME_REVIEW_CHECKLIST.md
├── RESUME_MATRIX.md
├── RESUME_RISK_REGISTER.md
├── RESUME_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts auxiliares:

```text
scripts/resume
├── collect-career-sources.ps1
├── extract-job-keywords.ps1
├── validate-resume-claims.ps1
├── validate-resume-links.ps1
├── validate-resume-format.ps1
├── validate-resume-secrets.ps1
├── generate-resume-report.ps1
└── collect-resume-evidence.ps1
```

Artifacts:

```text
reports/resume-Java-backend-report.yaml

contracts/resume-Java-backend-evidence.yaml
```

Documento principal:

```text
docs/resume/JAVA_BACKEND_RESUME.md
```

A exportação visual poderá gerar PDF e documento editável a partir de uma fonte aprovada.

---

## Conceito essencial

### Currículo é seleção

A pergunta não é:

```text
o que eu ja fiz?
```

A pergunta correta é:

```text
o que eu fiz
que ajuda a provar aderencia
a esta oportunidade?
```

### ATS não substitui leitura humana

O documento precisa ser:

- parseável;
- claro;
- simples;
- verdadeiro;
- legível;
- relevante.

### Palavra-chave precisa de contexto

Listar Kafka em uma seção de skills é menos forte do que explicar onde e por que foi utilizado.

### Bullet precisa mostrar ação e impacto

Estrutura recomendada:

```text
verbo
+
contexto
+
acao
+
tecnologia
+
resultado ou valor.
```

### Projeto pessoal é experiência prática, não emprego formal

Ele deve aparecer em seção própria.

---

## Mão na massa guiada

### 1. Criar Resume Charter

Arquivo:

```text
docs/resume/RESUME_CHARTER.md
```

Princípios:

```text
truth before optimization;

relevance before completeness;

evidence before metrics;

plain structure for ATS;

impact before task lists;

project work is contextualized;

interview simulation belongs to lesson 707.
```

---

### 2. Criar Career Target

Arquivo:

```text
docs/resume/CAREER_TARGET.md
```

Defina:

- função principal;
- senioridade buscada;
- tipos de empresa;
- modelo de trabalho;
- tecnologias centrais;
- competências diferenciais;
- limitações geográficas quando existirem.

---

### 3. Definir senioridade com honestidade

Não use senioridade baseada apenas em tempo de estudo.

Considere:

- autonomia;
- profundidade;
- experiência profissional;
- capacidade de entrega;
- responsabilidade;
- escopo;
- liderança;
- operação.

---

### 4. Definir proposta de valor

Exemplo:

```text
engenharia backend Java
com forte base em qualidade,
automacao,
testabilidade,
APIs
e analise de risco.
```

---

## Inventário de carreira

### 5. Criar Master Career Inventory

Arquivo:

```text
docs/resume/MASTER_CAREER_INVENTORY.md
```

Registre tudo antes de selecionar:

- cargos;
- empresas;
- períodos;
- responsabilidades;
- tecnologias;
- projetos;
- resultados;
- cursos;
- educação;
- prêmios;
- idiomas;
- publicações;
- links.

---

### 6. Separar fato de interpretação

Fato:

```text
automatizei validacoes de API.
```

Interpretação:

```text
isso demonstra dominio de contratos,
HTTP,
dados
e regressao.
```

O currículo pode usar os dois, desde que a conexão seja defensável.

---

### 7. Criar banco de evidências

Para cada item, registre:

- fonte;
- período;
- link;
- documento;
- pessoa que pode confirmar;
- nível de confidencialidade.

---

### 8. Remover informação confidencial

Não inclua:

- nome de cliente quando proibido;
- valor comercial;
- dado interno;
- credencial;
- arquitetura proprietária sensível;
- resultado não autorizado.

---

## Análise da vaga

### 9. Criar Job Description Analysis

Arquivo:

```text
docs/resume/JOB_DESCRIPTION_ANALYSIS.md
```

Campos:

- cargo;
- empresa;
- responsabilidades;
- requisitos obrigatórios;
- requisitos desejáveis;
- domínio;
- senioridade;
- palavras-chave;
- sinais culturais;
- lacunas.

---

### 10. Separar requisito obrigatório de desejável

Isso ajuda a decidir:

- candidatar;
- adaptar;
- estudar;
- não fingir.

---

### 11. Identificar verbos da vaga

Exemplos:

- desenvolver;
- manter;
- integrar;
- projetar;
- testar;
- monitorar;
- colaborar;
- documentar;
- otimizar.

---

### 12. Identificar tecnologias

Use somente as que você realmente conhece.

---

### 13. Identificar problemas de negócio

A vaga pode procurar:

- APIs;
- pagamentos;
- logística;
- mensageria;
- dados;
- plataformas;
- segurança;
- performance.

---

### 14. Mapear aderência

Classifique:

```text
forte;

parcial;

nao comprovada;

fora do perfil.
```

---

## Palavras-chave ATS

### 15. Criar ATS Keyword Matrix

Arquivo:

```text
docs/resume/ATS_KEYWORD_MATRIX.md
```

Colunas:

- palavra;
- aparece na vaga;
- experiência real;
- projeto;
- evidence;
- seção;
- status.

---

### 16. Usar variações relevantes

Exemplo:

```text
REST API;

APIs REST;

RESTful APIs.
```

Use a forma natural no texto.

---

### 17. Não repetir palavra artificialmente

Keyword stuffing prejudica leitura.

---

### 18. Incluir nomes oficiais

Exemplos:

- Java 21;
- Spring Boot;
- PostgreSQL;
- Apache Kafka;
- Docker;
- GitHub Actions;
- JUnit 5;
- Testcontainers;
- OpenTelemetry.

---

### 19. Incluir conceitos

Exemplos:

- arquitetura hexagonal;
- idempotência;
- testes de integração;
- CI/CD;
- observabilidade;
- segurança multi-tenant.

---

### 20. Validar cada keyword

Toda palavra precisa ser explicável em entrevista.

---

## Cabeçalho

### 21. Definir nome profissional

Use nome consistente com LinkedIn e GitHub.

---

### 22. Definir título

Exemplos honestos:

```text
Java Backend Developer

Java Backend Engineer

Software Engineer | Java Backend
```

Quando necessário, use título de transição com clareza.

---

### 23. Incluir localização geral

Cidade e estado são suficientes.

Não use endereço completo.

---

### 24. Incluir contato

Campos:

- e-mail profissional;
- telefone quando desejado;
- LinkedIn;
- GitHub;
- portfólio.

---

### 25. Validar links

Os links precisam ser:

- públicos;
- curtos;
- funcionais;
- coerentes;
- seguros.

---

### 26. Evitar dados desnecessários

Não inclua:

- CPF;
- RG;
- estado civil;
- foto, quando não exigida;
- idade;
- endereço completo;
- informações médicas.

---

## Resumo profissional

### 27. Criar Professional Summary

Arquivo:

```text
docs/resume/PROFESSIONAL_SUMMARY.md
```

Tamanho recomendado:

```text
3 a 5 linhas.
```

---

### 28. Estruturar resumo

Inclua:

- identidade profissional;
- experiência relevante;
- foco;
- competências;
- diferencial;
- objetivo.

---

### 29. Criar versão Java Backend

Exemplo:

```text
Profissional de tecnologia com experiência em qualidade, automação, APIs e bancos de dados, direcionando a carreira para engenharia backend Java. Desenvolvi o OrderFlow, projeto completo com Java 21, Spring Boot, PostgreSQL, Kafka, segurança multi-tenant, observabilidade, testes automatizados, Docker e CI/CD. Combino visão de qualidade, análise de risco e capacidade de construir sistemas testáveis, documentados e operáveis.
```

---

### 30. Evitar adjetivos vazios

Remova:

- apaixonado;
- ninja;
- guru;
- fora da curva;
- perfeccionista.

Substitua por fatos.

---

### 31. Adaptar ao cargo

O resumo para QA Automation não deve ser idêntico ao de Java Backend.

---

## Experiências

### 32. Criar Experience Bullet Bank

Arquivo:

```text
docs/resume/EXPERIENCE_BULLET_BANK.md
```

Crie bullets por competência.

---

### 33. Usar verbos fortes

Exemplos:

- desenvolvi;
- estruturei;
- automatizei;
- integrei;
- validei;
- reduzi;
- implementei;
- investiguei;
- documentei;
- colaborei.

---

### 34. Evitar verbos vagos

Exemplos fracos:

- ajudei;
- participei;
- fazia;
- era responsável.

Use quando não houver alternativa, mas contextualize.

---

### 35. Aplicar fórmula de bullet

```text
verbo
+
o que
+
como
+
para que.
```

---

### 36. Criar bullet de API

Exemplo:

```text
Estruturei validações automatizadas de APIs REST, contratos e respostas de erro, aumentando a rastreabilidade de regressões e a confiança nas integrações.
```

---

### 37. Criar bullet de automação

```text
Desenvolvi automações de testes para fluxos críticos, organizando execução, evidências e integração com pipelines.
```

---

### 38. Criar bullet de banco

```text
Validei persistência e regras de dados em PostgreSQL, correlacionando respostas de API com o estado armazenado.
```

---

### 39. Criar bullet de CI/CD

```text
Integrei suítes automatizadas a pipelines de CI/CD, utilizando gates e relatórios para apoiar decisões de entrega.
```

---

### 40. Criar bullet de investigação

```text
Investiguei falhas distribuídas por meio de logs, traces, dados e reproduções controladas, colaborando com desenvolvimento e produto na identificação de causa.
```

---

### 41. Preservar cargo real

O título da experiência precisa corresponder ao vínculo verdadeiro.

---

### 42. Destacar competências transferíveis

Mostre como QA fortalece backend:

- testabilidade;
- contratos;
- automação;
- qualidade;
- observabilidade;
- análise de risco.

---

### 43. Usar números com fonte

Exemplo válido:

```text
automatizei 40 cenarios
```

somente quando essa quantidade for comprovável.

---

### 44. Evitar números ornamentais

Não use percentual estimado apenas para parecer impactante.

---

### 45. Limitar bullets

Selecione quatro a seis bullets por experiência principal.

---

## Projeto OrderFlow

### 46. Criar OrderFlow Project Section

Arquivo:

```text
docs/resume/ORDERFLOW_PROJECT_SECTION.md
```

Campos:

- nome;
- período;
- papel;
- contexto;
- stack;
- bullets;
- links.

---

### 47. Definir papel

```text
Projeto pessoal | Autor e desenvolvedor
```

---

### 48. Criar descrição curta

```text
Plataforma backend demonstrativa para orquestração de pedidos e integrações distribuídas, construída com foco em confiabilidade, segurança, testabilidade e operação.
```

---

### 49. Criar bullet de arquitetura

```text
Modelei o sistema com arquitetura hexagonal e módulos separados para domínio, aplicação, persistência, mensageria, integrações e observabilidade.
```

---

### 50. Criar bullet de confiabilidade

```text
Implementei idempotência, Transactional Outbox, Inbox, Kafka, retries, DLQ, compensações e reconciliação para tratar duplicidade e falhas parciais.
```

---

### 51. Criar bullet de segurança

```text
Apliquei OAuth2/JWT, validação de issuer e audience, scopes, roles, isolamento multi-tenant, proteção contra IDOR e testes negativos.
```

---

### 52. Criar bullet de qualidade

```text
Criei testes unitários, integração com Testcontainers, contratos, segurança, Postman e performance básica, associados a reports e evidências.
```

---

### 53. Criar bullet de operação

```text
Containerizei aplicações e dependências, implementei observabilidade com logs, métricas e traces, e documentei CI/CD, deploy simulado, guia local e runbooks.
```

---

### 54. Declarar escopo

Use:

```text
projeto pessoal,
educacional
e demonstrativo.
```

---

### 55. Selecionar links

Inclua:

- GitHub;
- portfólio;
- documentação;
- demonstração, quando pública.

---

### 56. Não usar dez bullets

Selecione os mais aderentes à vaga.

---

## Competências técnicas

### 57. Criar Technical Skills Section

Arquivo:

```text
docs/resume/TECHNICAL_SKILLS_SECTION.md
```

Agrupe por categoria.

---

### 58. Categoria Linguagens

Exemplo:

```text
Java 21;
SQL;
JavaScript quando relevante;
PowerShell.
```

---

### 59. Categoria Backend

```text
Spring Boot;
Spring Security;
Spring Data JPA;
REST APIs;
Bean Validation;
Flyway.
```

---

### 60. Categoria Dados e Mensageria

```text
PostgreSQL;
Apache Kafka;
Outbox;
Inbox;
modelagem relacional.
```

---

### 61. Categoria Testes

```text
JUnit 5;
Mockito;
AssertJ;
Testcontainers;
WireMock;
Postman;
k6.
```

---

### 62. Categoria DevOps e Operação

```text
Docker;
Docker Compose;
GitHub Actions;
CI/CD;
OpenTelemetry;
Prometheus;
Grafana.
```

---

### 63. Categoria Arquitetura

```text
arquitetura hexagonal;
DDD tático;
event-driven architecture;
idempotência;
observabilidade;
segurança multi-tenant.
```

---

### 64. Não usar barras de nível

Evite gráficos como:

```text
Java:
90%.
```

Eles não possuem critério confiável.

---

### 65. Não classificar tudo como avançado

Use seleção e contexto.

---

### 66. Ordenar pela vaga

As tecnologias mais relevantes aparecem primeiro.

---

## Educação e cursos

### 67. Criar Education and Courses

Arquivo:

```text
docs/resume/EDUCATION_AND_COURSES.md
```

---

### 68. Registrar formação formal

Campos:

- curso;
- instituição;
- status;
- período;
- conclusão.

---

### 69. Registrar cursos relevantes

Selecione os que apoiam o objetivo.

---

### 70. Diferenciar curso, formação e certificação

Use o nome correto.

---

### 71. Não preencher espaço com cursos irrelevantes

Qualidade importa mais que quantidade.

---

### 72. Incluir idiomas

Use nível real.

---

## Estrutura ATS

### 73. Criar versão ATS

Características:

- uma coluna;
- títulos simples;
- fontes legíveis;
- sem caixas de texto;
- sem ícones essenciais;
- sem gráfico;
- sem tabela complexa;
- texto selecionável.

---

### 74. Usar headings claros

Exemplos:

```text
Resumo profissional;

Experiencia profissional;

Projetos;

Competencias tecnicas;

Formacao;

Cursos;

Idiomas.
```

---

### 75. Evitar cabeçalho ou rodapé com informação essencial

Alguns parsers ignoram.

---

### 76. Evitar abreviação isolada

Use:

```text
Integracao Continua e Entrega Continua, CI/CD.
```

na primeira ocorrência quando necessário.

---

### 77. Usar PDF textual

O conteúdo precisa ser selecionável.

---

### 78. Manter documento-fonte

A fonte pode ser Markdown, DOCX ou formato controlado.

---

### 79. Criar Links and Contact Policy

Arquivo:

```text
docs/resume/LINKS_AND_CONTACT_POLICY.md
```

---

### 80. Testar links no PDF

---

## Versão de uma página

### 81. Criar One Page Resume

Arquivo:

```text
docs/resume/ONE_PAGE_RESUME.md
```

Ordem:

1. cabeçalho;
2. resumo;
3. skills;
4. experiência;
5. projeto;
6. educação.

---

### 82. Priorizar conteúdo

Remova:

- detalhes antigos;
- tarefas repetidas;
- cursos secundários;
- tecnologias irrelevantes.

---

### 83. Preservar espaço em branco

Leitura é parte da qualidade.

---

### 84. Não reduzir fonte excessivamente

Uma página ilegível não é melhor.

---

## Versão detalhada

### 85. Criar Detailed Resume

Arquivo:

```text
docs/resume/DETAILED_RESUME.md
```

Use quando:

- a vaga pede detalhes;
- experiência é extensa;
- candidatura direta permite;
- portfólio técnico é valorizado.

---

### 86. Limitar a duas páginas quando possível

Mais páginas exigem justificativa.

---

### 87. Evitar repetir LinkedIn integralmente

---

## Versão Java Backend

### 88. Criar Java Backend Resume

Arquivo:

```text
docs/resume/JAVA_BACKEND_RESUME.md
```

Prioridades:

- Java;
- Spring;
- APIs;
- PostgreSQL;
- Kafka;
- testes;
- Docker;
- CI/CD;
- arquitetura;
- OrderFlow.

---

### 89. Destacar experiência transferível

A seção profissional precisa demonstrar:

- qualidade;
- automação;
- contratos;
- bancos;
- integração;
- colaboração.

---

### 90. Dar destaque correto ao projeto

OrderFlow pode ocupar espaço relevante, mas não substituir toda a trajetória.

---

### 91. Incluir palavras-chave naturais

---

## Versão de transição

### 92. Criar QA to Backend Transition Resume

Arquivo:

```text
docs/resume/QA_TO_BACKEND_TRANSITION_RESUME.md
```

---

### 93. Criar narrativa de transição

Estrutura:

```text
experiencia atual;

competencias transferiveis;

formacao pratica;

projeto completo;

direcao desejada.
```

---

### 94. Evitar frase defensiva

Não peça desculpas pela transição.

---

### 95. Evitar ocultar QA

A experiência anterior é diferencial.

---

## Adaptação por vaga

### 96. Criar Role Tailoring Guide

Arquivo:

```text
docs/resume/ROLE_TAILORING_GUIDE.md
```

---

### 97. Criar cópia por candidatura

Não altere o master sem registro.

---

### 98. Adaptar resumo

Use linguagem da oportunidade.

---

### 99. Adaptar ordem das skills

---

### 100. Adaptar bullets

Selecione os mais relevantes.

---

### 101. Adaptar projeto

Destaque o aspecto mais próximo do domínio da vaga.

---

### 102. Não alterar fatos

Adaptação é seleção, não invenção.

---

### 103. Registrar versão enviada

Campos:

- empresa;
- vaga;
- data;
- arquivo;
- mudanças;
- status.

---

## Versionamento

### 104. Criar Resume Versioning Policy

Arquivo:

```text
docs/resume/RESUME_VERSIONING_POLICY.md
```

Nomes recomendados:

```text
Thiago_Pacheco_Java_Backend.pdf

Thiago_Pacheco_Java_Backend_Detalhado.pdf
```

Use o nome profissional real no documento final.

---

### 105. Evitar nomes ruins

Não use:

```text
curriculo_novo_final_agora.pdf.
```

---

### 106. Registrar data de atualização

No controle interno, não necessariamente no PDF.

---

### 107. Arquivar versões antigas

---

## Exportação

### 108. Criar PDF Export Policy

Arquivo:

```text
docs/resume/PDF_EXPORT_POLICY.md
```

Valide:

- texto selecionável;
- fontes incorporadas;
- links;
- margens;
- páginas;
- caracteres;
- tamanho;
- metadata.

---

### 109. Revisar metadata do PDF

Remova dados indesejados.

---

### 110. Testar em leitores diferentes

- navegador;
- leitor de PDF;
- celular;
- sistema de candidatura.

---

### 111. Criar documento editável

Preserve uma fonte fácil de manter.

---

### 112. Não enviar somente imagem

ATS precisa ler texto.

---

## Revisão humana

### 113. Criar Resume Review Checklist

Arquivo:

```text
docs/resume/RESUME_REVIEW_CHECKLIST.md
```

Perguntas:

- cargo-alvo aparece?
- resumo é específico?
- bullets mostram impacto?
- projeto está contextualizado?
- skills são reais?
- links funcionam?
- datas estão corretas?
- existe erro?
- ATS consegue ler?
- entrevista não foi antecipada?

---

### 114. Revisar em 10 segundos

Uma pessoa precisa encontrar:

- nome;
- alvo;
- stack;
- experiência;
- projeto.

---

### 115. Revisar em 60 segundos

Ela precisa entender a proposta de valor.

---

### 116. Solicitar revisão técnica

Peça que um profissional Java avalie:

- coerência;
- profundidade;
- keywords;
- projeto.

---

### 117. Solicitar revisão de recrutamento

Avalie:

- clareza;
- leitura;
- aderência;
- senioridade;
- excesso de texto.

---

### 118. Solicitar revisão de português

---

## Validação automatizada

### 119. Criar collector de fontes

`collect-career-sources.ps1` reúne LinkedIn, GitHub, portfólio e evidence.

---

### 120. Criar extrator de keywords

O script recebe texto da vaga em arquivo local controlado.

---

### 121. Criar claim validator

Compare:

- experiências;
- projeto;
- números;
- stack;
- links.

---

### 122. Criar format validator

Valide headings, seções, comprimento e links.

---

### 123. Criar secret validator

Currículo não pode expor informações desnecessárias.

---

## Governança

### 124. Criar Resume Matrix

Arquivo:

```text
docs/resume/RESUME_MATRIX.md
```

Colunas:

- versão;
- vaga;
- seção;
- claim;
- keyword;
- evidence;
- status.

---

### 125. Criar Risk Register

Arquivo:

```text
docs/resume/RESUME_RISK_REGISTER.md
```

Riscos:

```text
cargo inventado;

experiencia comercial falsa;

keyword sem conhecimento;

numero sem fonte;

projeto sem contexto;

PDF ilegivel;

link quebrado;

dado pessoal excessivo;

documento desatualizado;

entrevista antecipada.
```

---

### 126. Criar Traceability

Arquivo:

```text
docs/resume/RESUME_TRACEABILITY.md
```

Exemplo:

```text
claim: Java 21 e Spring Boot
-> OrderFlow source
-> build report
-> GitHub.

claim: Kafka e Outbox
-> messaging implementation
-> integration tests
-> evidence.

claim: automacao de APIs
-> experiencia real
-> projetos
-> artefatos permitidos.
```

---

### 127. Criar boundary da próxima aula

Arquivo:

```text
docs/resume/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 706 define:

- career target;
- career inventory;
- job analysis;
- ATS keywords;
- header;
- professional summary;
- experience bullets;
- OrderFlow project;
- technical skills;
- education and courses;
- one-page resume;
- detailed resume;
- Java Backend resume;
- QA to Backend transition resume;
- role tailoring;
- versioning;
- PDF export;
- reviews;
- automated validation.

A aula 707 define:

- Java interview simulation;
- personal presentation;
- resume walkthrough;
- Java core questions;
- Spring questions;
- API questions;
- SQL questions;
- Kafka questions;
- testing questions;
- coding exercise;
- behavioral questions;
- feedback;
- improvement plan.

Nenhuma entrevista Java
e simulada nesta aula.
```

---

## Relatório e evidência

### 128. Criar report

Arquivo:

```text
reports/resume-Java-backend-report.yaml
```

Exemplo:

```yaml
resumeJavaBackend:
  versions:
    onePage:
      PASS
    detailed:
      PASS
    JavaBackend:
      PASS
    transition:
      PASS

  integrity:
    unsupportedClaims:
      0
    unverifiedMetrics:
      0
    brokenLinks:
      0
    excessivePersonalData:
      0

  ATS:
    parseable:
      PASS
    keywordCoverage:
      measured
    complexLayout:
      false

  reviews:
    technical:
      PASS
    recruitment:
      PASS
    language:
      PASS

  JavaInterview:
    completed:
      false

  gate:
    PASS
```

A cobertura precisa ser calculada contra uma vaga específica.

---

### 129. Criar evidence

Arquivo:

```text
contracts/resume-Java-backend-evidence.yaml
```

Campos:

- lesson;
- project;
- career target status;
- inventory status;
- job analysis status;
- keyword count;
- evidenced keyword count;
- professional summary status;
- experience count;
- bullet count;
- evidenced bullet count;
- OrderFlow section status;
- technical skill count;
- education status;
- course count;
- language count;
- one-page status;
- detailed status;
- Java Backend status;
- transition status;
- tailored version count;
- unsupported claim count;
- unverified metric count;
- broken link count;
- excessive personal data count;
- ATS parse status;
- technical review status;
- recruitment review status;
- language review status;
- Java interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 130. Criar gate do currículo

Status:

```text
PASS;

FAIL_CAREER_TARGET;

FAIL_CAREER_INVENTORY;

FAIL_JOB_ANALYSIS;

FAIL_ATS_KEYWORDS;

FAIL_HEADER;

FAIL_PROFESSIONAL_SUMMARY;

FAIL_EXPERIENCE;

FAIL_PROJECT_SECTION;

FAIL_TECHNICAL_SKILLS;

FAIL_EDUCATION;

FAIL_ONE_PAGE_RESUME;

FAIL_DETAILED_RESUME;

FAIL_JAVA_BACKEND_RESUME;

FAIL_TRANSITION_RESUME;

FAIL_ROLE_TAILORING;

FAIL_VERSIONING;

FAIL_PDF_EXPORT;

FAIL_UNSUPPORTED_CLAIM;

FAIL_UNVERIFIED_METRIC;

FAIL_BROKEN_LINK;

FAIL_EXCESSIVE_PERSONAL_DATA;

FAIL_ATS_PARSE;

FAIL_TECHNICAL_REVIEW;

FAIL_RECRUITMENT_REVIEW;

FAIL_LANGUAGE_REVIEW;

FAIL_INTERVIEW_ANTICIPATION;

INCONCLUSIVE.
```

---

### 131. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\resume\collect-career-sources.ps1

.\scripts\resume\validate-resume-claims.ps1

.\scripts\resume\validate-resume-links.ps1

.\scripts\resume\validate-resume-format.ps1

.\scripts\resume\validate-resume-secrets.ps1

.\scripts\resume\collect-resume-evidence.ps1
```

---

### 132. Testar ATS

Use uma cópia textual extraída do PDF.

Confirme ordem e conteúdo.

---

### 133. Testar candidatura simulada

Preencha um formulário sem enviar.

Observe:

- parsing;
- datas;
- cargo;
- skills;
- educação;
- links.

---

### 134. Registrar versão aprovada

Preserve:

- fonte;
- PDF;
- vaga-base;
- data;
- report;
- evidence.

---

### 135. Encerrar o laboratório

Confirme:

- Charter;
- target;
- inventory;
- job analysis;
- keywords;
- header;
- contact;
- summary;
- experiences;
- bullet bank;
- OrderFlow;
- skills;
- education;
- courses;
- languages;
- ATS;
- one-page;
- detailed;
- Java Backend;
- transition;
- tailoring;
- versioning;
- PDF;
- reviews;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 707 preservada.

---

## Entendendo o que foi feito

### O currículo ganhou foco

A versão deixou de tentar contar toda a trajetória.

### A experiência anterior ganhou valor de transição

Qualidade, automação, APIs e bancos passaram a apoiar Backend.

### O OrderFlow ganhou lugar correto

Projeto pessoal apareceu como prova prática, não como emprego inventado.

### Palavras-chave ganharam evidência

ATS e leitura humana passaram a usar a mesma verdade.

### Bullets ganharam impacto

Tarefas foram transformadas em ações contextualizadas.

### Versões ganharam controle

Currículo-base e currículos direcionados deixaram de se misturar.

### PDF ganhou validação

Texto, links, metadata e parsing foram verificados.

### A entrevista ficou preservada

A próxima aula usará o documento em uma simulação realista.

---

## Erros comuns importantes

### Copiar o LinkedIn

O currículo perde objetividade.

### Usar cargo inventado

A credibilidade é perdida.

### Esconder QA

O diferencial desaparece.

### Encher o texto de keywords

A leitura piora.

### Usar barras de skill

A medição é arbitrária.

### Criar bullet sem ação

O valor não aparece.

### Inventar percentual

O avaliador pode questionar.

### Tratar projeto pessoal como emprego

A experiência fica falsa.

### Enviar PDF como imagem

ATS não lê corretamente.

### Simular entrevista agora

Essa etapa pertence à aula 707.

---

## Comandos úteis

### Coletar fontes

```powershell
.\scripts\resume\collect-career-sources.ps1
```

### Extrair keywords

```powershell
.\scripts\resume\extract-job-keywords.ps1
```

### Validar claims

```powershell
.\scripts\resume\validate-resume-claims.ps1
```

### Validar formato

```powershell
.\scripts\resume\validate-resume-format.ps1
```

---

## Exercício principal

Adapte o currículo para uma vaga Java Backend com:

- Java;
- Spring Boot;
- APIs REST;
- PostgreSQL;
- Kafka;
- Docker;
- testes;
- CI/CD;
- observabilidade.

Inclua:

1. analisar vaga;
2. separar obrigatórios;
3. separar desejáveis;
4. extrair verbos;
5. extrair keywords;
6. mapear aderência;
7. definir título;
8. adaptar resumo;
9. selecionar experiência;
10. criar bullet de API;
11. criar bullet de automação;
12. criar bullet de banco;
13. criar bullet de CI/CD;
14. criar seção OrderFlow;
15. selecionar arquitetura;
16. selecionar mensageria;
17. selecionar segurança;
18. selecionar testes;
19. selecionar operação;
20. ordenar skills;
21. revisar educação;
22. revisar cursos;
23. validar links;
24. validar claims;
25. validar ATS;
26. revisar em 10 segundos;
27. revisar em 60 segundos;
28. pedir revisão técnica;
29. exportar PDF;
30. registrar versão.

Não simule a entrevista Java.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 705 e ponte para a aula 707 foram preservadas;
- Resume Charter foi criado;
- Career Target foi criado;
- senioridade foi definida com honestidade;
- proposta de valor foi criada;
- Master Career Inventory foi criado;
- fatos e interpretações foram separados;
- banco de evidências foi criado;
- informações confidenciais foram removidas;
- Job Description Analysis foi criado;
- obrigatórios e desejáveis foram separados;
- verbos foram identificados;
- tecnologias foram identificadas;
- problemas de negócio foram identificados;
- aderência foi mapeada;
- ATS Keyword Matrix foi criada;
- variações naturais foram usadas;
- keyword stuffing foi evitado;
- nomes oficiais foram usados;
- conceitos foram incluídos;
- keywords foram validadas;
- nome profissional foi definido;
- título foi definido;
- localização geral foi incluída;
- contatos foram incluídos;
- links foram validados;
- dados desnecessários foram removidos;
- Professional Summary foi criado;
- resumo foi estruturado;
- versão Java Backend foi criada;
- adjetivos vazios foram removidos;
- resumo foi adaptado;
- Experience Bullet Bank foi criado;
- verbos fortes foram usados;
- verbos vagos foram reduzidos;
- fórmula de bullet foi aplicada;
- bullets de API, automação, banco, CI/CD e investigação foram criados;
- cargos reais foram preservados;
- competências transferíveis foram destacadas;
- números foram usados somente com fonte;
- números ornamentais foram evitados;
- quantidade de bullets foi controlada;
- OrderFlow Project Section foi criada;
- papel no projeto foi definido;
- descrição curta foi criada;
- bullets de arquitetura, confiabilidade, segurança, qualidade e operação foram criados;
- escopo pessoal foi declarado;
- links foram selecionados;
- excesso de bullets foi evitado;
- Technical Skills Section foi criada;
- linguagens foram organizadas;
- backend foi organizado;
- dados e mensageria foram organizados;
- testes foram organizados;
- DevOps e operação foram organizados;
- arquitetura foi organizada;
- barras de nível foram evitadas;
- tudo não foi classificado como avançado;
- skills foram ordenadas pela vaga;
- Education and Courses foi criado;
- formação formal foi registrada;
- cursos relevantes foram selecionados;
- cursos e certificações foram diferenciados;
- cursos irrelevantes foram removidos;
- idiomas foram incluídos;
- versão ATS foi criada;
- headings claros foram usados;
- layouts complexos foram evitados;
- header e footer essenciais foram evitados;
- siglas foram tratadas;
- PDF textual foi exigido;
- documento-fonte foi mantido;
- Links and Contact Policy foi criada;
- links no PDF foram testados;
- One Page Resume foi criado;
- conteúdo foi priorizado;
- espaço em branco foi preservado;
- fonte pequena foi evitada;
- Detailed Resume foi criado;
- tamanho foi controlado;
- cópia integral do LinkedIn foi evitada;
- Java Backend Resume foi criado;
- prioridades técnicas foram definidas;
- competências transferíveis foram destacadas;
- projeto recebeu destaque correto;
- keywords naturais foram usadas;
- QA to Backend Transition Resume foi criado;
- narrativa de transição foi criada;
- frase defensiva foi evitada;
- QA não foi ocultado;
- Role Tailoring Guide foi criado;
- cópias por candidatura foram criadas;
- resumo foi adaptado;
- skills foram adaptadas;
- bullets foram adaptados;
- projeto foi adaptado;
- fatos não foram alterados;
- versão enviada foi registrada;
- Resume Versioning Policy foi criada;
- nomes profissionais foram definidos;
- nomes ruins foram evitados;
- atualização foi registrada;
- versões antigas foram arquivadas;
- PDF Export Policy foi criada;
- texto, fontes, links, margens e metadata foram validados;
- PDF foi testado em leitores;
- documento editável foi criado;
- imagem única foi evitada;
- Review Checklist foi criado;
- revisão de 10 segundos foi executada;
- revisão de 60 segundos foi executada;
- revisão técnica foi solicitada;
- revisão de recrutamento foi solicitada;
- revisão de português foi solicitada;
- collector de fontes foi criado;
- extrator de keywords foi criado;
- claim validator foi criado;
- format validator foi criado;
- secret validator foi criado;
- Resume Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 707 foi criado;
- report, evidence e gate foram criados;
- ATS foi testado;
- candidatura simulada foi executada;
- versão aprovada foi registrada;
- commit recomendado e diário de bordo estão presentes;
- entrevista Java não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\resume\validate-resume-claims.ps1

.\scripts\resume\validate-resume-format.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/resume `
  scripts/resume `
  reports/resume-Java-backend-report.yaml `
  contracts/resume-Java-backend-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|CPF|RG|residential-address|commercial-experience-false|interview-answer-script"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(resume): create Java Backend career materials"
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

- experiência falsa;
- cargo inventado;
- dado pessoal excessivo;
- métrica sem fonte;
- respostas da entrevista 707.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou o currículo Java Backend.

Você produziu:

```text
career target;

career inventory;

job analysis;

ATS keyword matrix;

professional summary;

experience bullet bank;

OrderFlow project section;

technical skills;

education and courses;

one-page resume;

detailed resume;

Java Backend resume;

QA to Backend transition resume;

role tailoring guide;

versioning;

PDF export;

reviews;

report e evidence.
```

Agora existe um material objetivo para candidaturas, alinhado ao LinkedIn, GitHub, portfólio e às evidências do projeto.

A próxima aula será:

```text
707 - M20.37 - Entrevista Java
```

Nela, você realizará uma simulação completa de entrevista Java, usando apresentação pessoal, currículo, experiência, OrderFlow, Java, Spring, APIs, SQL, Kafka, testes, exercício prático, perguntas comportamentais e feedback.

Nenhuma entrevista Java foi simulada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini cargo e senioridade.
- [ ] Criei inventário.
- [ ] Analisei vaga.
- [ ] Mapeei keywords.
- [ ] Criei resumo.
- [ ] Criei bullets.
- [ ] Criei seção OrderFlow.
- [ ] Organizei skills.
- [ ] Registrei formação e cursos.
- [ ] Criei versão de uma página.
- [ ] Criei versão detalhada.
- [ ] Criei versão Java Backend.
- [ ] Criei versão de transição.
- [ ] Validei ATS.
- [ ] Preservei entrevista para a aula 707.

---

## Troubleshooting adicional

### Currículo ficou com três páginas

Remova detalhes pouco relevantes e priorize a vaga.

### Resumo parece genérico

Inclua experiência, projeto e diferencial.

### Bullets parecem tarefas

Adicione contexto, ação e valor.

### OrderFlow ocupa quase tudo

Equilibre projeto e trajetória.

### ATS não lê a coluna lateral

Use layout de uma coluna.

### Keyword não possui evidence

Remova ou estude antes de usar.

### PDF quebra caracteres

Revise fonte e exportação.

### Link abre ambiente privado

Substitua por link público.

### Recrutador entende senioridade errada

Ajuste título, resumo e escopo.

### Quero treinar entrevista

Essa etapa pertence à aula 707.

---

## Perguntas de revisão

1. Currículo é cópia do LinkedIn?
2. O que vem antes de escrever?
3. Palavra-chave pode ser inventada?
4. O que um bullet precisa conter?
5. Projeto pessoal é emprego?
6. QA deve ser escondido?
7. Por que criar inventory?
8. O que Job Analysis identifica?
9. Como usar números?
10. O que ATS precisa?
11. Tabela complexa ajuda?
12. Barras de skill são confiáveis?
13. Quantas páginas usar?
14. Por que criar versões?
15. O que adaptar por vaga?
16. Adaptação pode mudar fatos?
17. Por que preservar documento-fonte?
18. O que revisar em PDF?
19. O que revisão de 10 segundos mede?
20. O que evidence prova?
21. Quando registrar versão enviada?
22. O que a aula 707 fará?
23. O que não foi realizado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Alvo e inventário.
3. Não.
4. Ação, contexto e valor.
5. Não.
6. Não.
7. Selecionar melhor.
8. Requisitos e aderência.
9. Com fonte.
10. Texto simples.
11. Não.
12. Não.
13. Uma ou duas.
14. Vagas diferentes.
15. Resumo, skills e bullets.
16. Não.
17. Manutenção.
18. Texto, links e metadata.
19. Primeira leitura.
20. Veracidade.
21. A cada candidatura.
22. Simular entrevista Java.
23. Entrevista.
24. Entrevista Java.
25. Selecionar relevância com verdade e prova.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 706 - M20.36 - Curriculo Java Backend

- Continuei após Preparação LinkedIn.
- Criei Resume Charter.
- Criei Career Target.
- Defini senioridade com honestidade.
- Defini proposta de valor.
- Criei Master Career Inventory.
- Separei fatos e interpretações.
- Criei banco de evidências.
- Removi informações confidenciais.
- Criei Job Description Analysis.
- Separei obrigatórios e desejáveis.
- Identifiquei verbos, tecnologias e problemas.
- Mapeei aderência.
- Criei ATS Keyword Matrix.
- Usei palavras-chave naturais.
- Evitei keyword stuffing.
- Validei keywords.
- Defini nome, título, localização e contatos.
- Removi dados desnecessários.
- Criei Professional Summary.
- Criei versão Java Backend.
- Removi adjetivos vazios.
- Criei Experience Bullet Bank.
- Usei verbos fortes.
- Criei bullets de API, automação, banco, CI/CD e investigação.
- Preservei cargos reais.
- Destaquei competências transferíveis.
- Usei números somente com fonte.
- Controlei a quantidade de bullets.
- Criei OrderFlow Project Section.
- Defini projeto pessoal e papel.
- Criei bullets de arquitetura, confiabilidade, segurança, qualidade e operação.
- Declarei escopo demonstrativo.
- Selecionei links.
- Criei Technical Skills Section.
- Organizei linguagens, backend, dados, testes, DevOps e arquitetura.
- Evitei barras de nível.
- Ordenei skills pela vaga.
- Criei Education and Courses.
- Registrei formação, cursos e idiomas.
- Diferenciei curso e certificação.
- Criei versão ATS.
- Usei layout simples.
- Mantive PDF textual.
- Criei Links and Contact Policy.
- Criei One Page Resume.
- Priorizei conteúdo e legibilidade.
- Criei Detailed Resume.
- Criei Java Backend Resume.
- Criei QA to Backend Transition Resume.
- Criei narrativa de transição.
- Preservei experiência em QA.
- Criei Role Tailoring Guide.
- Adaptei resumo, skills, bullets e projeto por vaga.
- Mantive os fatos.
- Registrei versões enviadas.
- Criei Resume Versioning Policy.
- Defini nomes profissionais.
- Criei PDF Export Policy.
- Validei texto, links, margens, caracteres e metadata.
- Testei em leitores diferentes.
- Mantive documento editável.
- Criei Resume Review Checklist.
- Executei revisão de 10 e 60 segundos.
- Solicitei revisão técnica, recrutamento e português.
- Criei collectors e validators.
- Criei Resume Matrix.
- Criei Resume Risk Register.
- Criei Resume Traceability.
- Criei boundary para a aula 707.
- Criei report, evidence e gate.
- Testei parsing ATS.
- Executei candidatura simulada.
- Registrei versão aprovada.
- Não antecipei entrevista Java.
- Próxima aula: Entrevista Java.
```

---

## Referência técnica curta

- Resume.
- Curriculum Vitae.
- ATS.
- Career Target.
- Professional Summary.
- Experience Bullet.
- Transferable Skill.
- Job Description.
- Keyword Matrix.
- Project Section.
- One-Page Resume.
- Tailored Resume.
- Parseable PDF.
- Resume Versioning.
- Evidence-Based Claim.

Regra final:

```text
O currículo Java Backend deve transformar trajetória, projeto e posicionamento em material objetivo e verificável: career target define função, senioridade and value proposition, master inventory registra experiências, resultados, cursos, skills and evidence antes da seleção, job analysis separa mandatory, desirable, verbs, technologies and business problems, ATS matrix usa keywords somente quando existe experiência ou projeto comprovável, header mantém nome, título, localização geral, contato, LinkedIn, GitHub and portfolio sem dados pessoais excessivos, professional summary conecta experiência em qualidade e automação à direção Java Backend, experience bullets usam verbo, contexto, ação, tecnologia and value sem inventar percentuais, OrderFlow aparece como projeto pessoal e demonstrativo com arquitetura hexagonal, Java 21, Spring Boot, PostgreSQL, Kafka, idempotência, segurança, testes, observabilidade, Docker and CI CD, skills são agrupadas e ordenadas pela vaga sem barras arbitrárias, educação, cursos and idiomas usam nomes corretos, ATS version mantém uma coluna, headings simples and selectable text, one-page and detailed versions priorizam profundidades diferentes, transition resume preserva QA como diferencial, role tailoring adapta resumo, ordem, bullets and projeto sem alterar fatos, versioning registra empresa, vaga, data and arquivo, PDF export valida fontes, links, metadata and parsing, technical, recruitment and language reviews verificam clareza, aderência and honestidade, validators bloqueiam unsupported claims, unverified metrics, broken links and excessive personal data, e o gate fecha versões, ATS, reviews, report and evidence enquanto apresentação pessoal, perguntas Java, Spring, APIs, SQL, Kafka, testes, coding exercise, comportamento and feedback permanecem reservados para a aula 707.
```
