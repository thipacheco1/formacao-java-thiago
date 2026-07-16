# 705 - M20.35 - Preparacao LinkedIn

## Apresentação da aula

Na aula 704, você preparou o repositório GitHub do OrderFlow.

O projeto passou a possuir:

- auditoria de arquivos;
- histórico revisado;
- estratégia de branches;
- política de commits;
- changelog;
- tags e releases;
- metadata pública;
- topics;
- social preview;
- licença;
- guia de contribuição;
- código de conduta;
- política de segurança;
- templates de issue;
- template de pull request;
- CODEOWNERS;
- Dependabot;
- workflows com menor privilégio;
- proteção de branch;
- README revisado;
- assets públicos validados;
- clone limpo;
- report, evidence e gate de prontidão.

Agora o OrderFlow está pronto para exposição pública no GitHub.

Nesta aula, você preparará o LinkedIn para transformar o projeto em posicionamento profissional.

LinkedIn não é apenas um lugar para publicar um link.

Ele funciona como uma página de descoberta profissional.

Uma pessoa pode chegar ao seu perfil por:

- busca de recrutador;
- recomendação;
- comentário técnico;
- publicação;
- conexão em comum;
- candidatura;
- evento;
- comunidade;
- acesso ao GitHub;
- acesso ao portfólio.

Quando essa pessoa chega, o perfil precisa responder rapidamente:

- qual é sua área?
- qual nível de atuação você busca?
- quais problemas você sabe resolver?
- quais tecnologias domina?
- qual projeto prova isso?
- como você pensa?
- quais resultados consegue demonstrar?
- onde estão suas evidências?
- como entrar em contato profissionalmente?

A preparação será baseada no OrderFlow, mas não transformará todo o perfil em propaganda de um único projeto.

O objetivo é usar o projeto como prova de competências mais amplas:

- Java moderno;
- Spring Boot;
- arquitetura;
- APIs;
- PostgreSQL;
- Kafka;
- segurança;
- testes;
- observabilidade;
- containers;
- CI/CD;
- operação;
- documentação;
- comunicação técnica.

A aula trabalhará:

- posicionamento;
- headline;
- banner;
- foto e identidade visual;
- seção Sobre;
- experiências;
- projeto;
- seção Destaques;
- competências;
- certificações quando existirem;
- URL personalizada;
- configurações de visibilidade;
- publicação de lançamento;
- publicação técnica;
- comentários estratégicos;
- conexões;
- consistência entre LinkedIn, GitHub e portfólio;
- métricas de acompanhamento;
- checklist de revisão.

A próxima aula será:

```text
706 - M20.36 - Curriculo Java Backend
```

Na aula 706, você transformará o posicionamento, as experiências, as competências e o OrderFlow em um currículo objetivo, compatível com recrutadores e sistemas de triagem, com versões direcionadas para vagas Java Backend.

Nesta aula, nenhum currículo será criado.

O laboratório será:

```text
labs/m20/aula-705-preparacao-LinkedIn/orderflow-LinkedIn-positioning
```

Regra central:

```text
um perfil profissional forte
nao apenas lista tecnologias;

ele comunica
posicionamento,
competencias,
evidencias
e direcao de carreira.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
702:
Narrativa tecnica portfolio.

703:
Defesa de decisoes engenharia.

704:
Preparacao GitHub.

705:
Preparacao LinkedIn.

706:
Curriculo Java Backend.

707:
Simulacao entrevista RH.
```

A preparação do LinkedIn utiliza como fonte:

- narrativa técnica;
- one-liner;
- elevator pitch;
- README;
- GitHub público preparado;
- decisões de engenharia;
- reports;
- evidências;
- projetos anteriores relevantes;
- experiências reais;
- competências reais;
- objetivo profissional.

O LinkedIn não pode afirmar algo que o projeto ou a experiência não comprovam.

A ordem de autoridade será:

```text
experiencia real;

projeto executado;

evidence;

portfolio;

LinkedIn.
```

O perfil não deve dizer:

- arquiteto de sistemas em produção, quando o projeto foi demonstrativo;
- especialista absoluto, quando a experiência ainda está em construção;
- alta escala comprovada, quando houve apenas baseline controlada;
- líder de equipe, quando não houve liderança formal;
- experiência comercial, quando houve estudo ou projeto pessoal.

A linguagem correta pode ser forte sem ser falsa.

Exemplo:

```text
desenvolvimento de projeto backend completo
com arquitetura hexagonal,
mensageria,
seguranca,
observabilidade,
testes
e pipeline.
```

Isso é diferente de:

```text
responsavel por plataforma empresarial
em producao de grande escala.
```

---

## Objetivo prático

Será criada a estrutura:

```text
docs/LinkedIn
├── LINKEDIN_PREPARATION_CHARTER.md
├── PROFESSIONAL_POSITIONING.md
├── TARGET_ROLE_MAP.md
├── PROFILE_AUDIT.md
├── HEADLINE_OPTIONS.md
├── ABOUT_SECTION.md
├── EXPERIENCE_ALIGNMENT.md
├── PROJECT_FEATURE.md
├── FEATURED_SECTION_PLAN.md
├── SKILLS_STRATEGY.md
├── VISUAL_IDENTITY_PLAN.md
├── PROFILE_VISIBILITY_POLICY.md
├── LINKEDIN_LINK_POLICY.md
├── LAUNCH_POST.md
├── TECHNICAL_POST_SERIES.md
├── COMMENTING_STRATEGY.md
├── NETWORKING_STRATEGY.md
├── CONTENT_CALENDAR.md
├── PROFILE_CONSISTENCY_MATRIX.md
├── LINKEDIN_REVIEW_CHECKLIST.md
├── LINKEDIN_MATRIX.md
├── LINKEDIN_RISK_REGISTER.md
├── LINKEDIN_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts auxiliares:

```text
scripts/LinkedIn
├── collect-profile-sources.ps1
├── validate-LinkedIn-claims.ps1
├── validate-profile-links.ps1
├── validate-public-assets.ps1
├── generate-LinkedIn-report.ps1
└── collect-LinkedIn-evidence.ps1
```

Artifacts:

```text
reports/LinkedIn-preparation-report.yaml

contracts/LinkedIn-preparation-evidence.yaml
```

O documento central será:

```text
docs/LinkedIn/PROFESSIONAL_POSITIONING.md
```

---

## Conceito essencial

### Posicionamento não é cargo inventado

Posicionamento é a combinação de:

- área;
- problema;
- competências;
- direção;
- prova.

### Headline não é apenas o cargo atual

Ela precisa ajudar busca e entendimento.

### Seção Sobre não é autobiografia completa

Ela apresenta:

- identidade profissional;
- experiência;
- competências;
- projeto;
- forma de trabalho;
- direção.

### Projeto precisa ser descrito como evidência

Não basta dizer “fiz um projeto”.

Explique:

- problema;
- decisões;
- tecnologias;
- resultados;
- links.

### Consistência aumenta confiança

GitHub, portfólio, LinkedIn e currículo precisam contar a mesma história.

---

## Mão na massa guiada

### 1. Criar LinkedIn Preparation Charter

Arquivo:

```text
docs/LinkedIn/LINKEDIN_PREPARATION_CHARTER.md
```

Princípios:

```text
truth before optimization;

positioning before content;

skills require evidence;

project claims stay contextualized;

links are public and validated;

engagement is professional;

resume creation belongs to lesson 706.
```

---

### 2. Criar Target Role Map

Arquivo:

```text
docs/LinkedIn/TARGET_ROLE_MAP.md
```

Possíveis funções-alvo:

- Desenvolvedor Java Backend;
- Java Backend Engineer;
- Software Engineer Backend;
- QA Automation Engineer com forte base de desenvolvimento;
- Engenheiro de Qualidade orientado a arquitetura e automação;
- posição de transição para backend Java.

A escolha precisa refletir o objetivo real.

---

### 3. Definir prioridade de posicionamento

Escolha:

- posição principal;
- posição adjacente;
- competências de diferenciação.

Exemplo:

```text
principal:
Java Backend Engineer.

adjacente:
Software Engineer Backend.

diferencial:
qualidade,
automacao,
testabilidade
e visao de operacao.
```

---

### 4. Criar Professional Positioning

Arquivo:

```text
docs/LinkedIn/PROFESSIONAL_POSITIONING.md
```

Estrutura:

- identidade profissional;
- experiência transferível;
- especialidades;
- projeto-prova;
- objetivo;
- diferenciais.

---

### 5. Separar cargo atual de direção de carreira

Você pode trabalhar em QA e se posicionar para backend Java sem apagar a experiência anterior.

A transição precisa ser explicada como evolução.

---

### 6. Mapear competências transferíveis

Exemplos:

- análise de risco;
- automação;
- APIs;
- bancos;
- CI/CD;
- observabilidade;
- investigação;
- qualidade;
- colaboração;
- documentação.

---

## Auditoria do perfil

### 7. Criar Profile Audit

Arquivo:

```text
docs/LinkedIn/PROFILE_AUDIT.md
```

Revise:

- foto;
- banner;
- headline;
- localização geral;
- setor;
- Sobre;
- experiências;
- projetos;
- Destaques;
- competências;
- recomendações;
- cursos;
- certificações;
- URL;
- visibilidade;
- contato.

---

### 8. Avaliar primeira impressão

Perguntas:

- a área aparece imediatamente?
- o perfil parece atual?
- o projeto principal é encontrado?
- o texto é legível?
- há contradição?
- existem links quebrados?
- há informação excessivamente pessoal?

---

### 9. Remover conteúdo desatualizado

Não mantenha:

- objetivo antigo;
- tecnologia abandonada como destaque;
- link inexistente;
- projeto incompleto sem contexto;
- descrição genérica.

---

### 10. Preservar histórico relevante

Não apague experiência anterior apenas porque não é Java.

Reescreva destacando competências transferíveis.

---

## Headline

### 11. Criar Headline Options

Arquivo:

```text
docs/LinkedIn/HEADLINE_OPTIONS.md
```

Crie versões:

- direta;
- técnica;
- transição;
- orientada a valor;
- bilíngue quando necessário.

---

### 12. Criar headline direta

Exemplo:

```text
Java Backend Engineer | Java 21 | Spring Boot | APIs REST | PostgreSQL | Kafka | Docker
```

---

### 13. Criar headline de transição

Exemplo:

```text
QA Automation Engineer em transição para Java Backend | APIs, testes, CI/CD, PostgreSQL e Kafka
```

Use somente quando a transição precisar estar explícita.

---

### 14. Criar headline orientada a valor

Exemplo:

```text
Java Backend | Sistemas testáveis, APIs seguras, mensageria confiável e observabilidade
```

---

### 15. Evitar headline congestionada

Não transforme a headline em lista de vinte tecnologias.

---

### 16. Validar termos de busca

Inclua palavras usadas em vagas reais do alvo.

Não copie requisitos que você não possui.

---

### 17. Escolher a versão final

Critérios:

- verdade;
- clareza;
- busca;
- direção;
- diferenciação;
- limite de caracteres.

---

## Identidade visual

### 18. Criar Visual Identity Plan

Arquivo:

```text
docs/LinkedIn/VISUAL_IDENTITY_PLAN.md
```

---

### 19. Revisar foto

Critérios:

- rosto visível;
- iluminação adequada;
- fundo simples;
- aparência profissional;
- imagem atual;
- sem elementos distrativos.

---

### 20. Criar banner

Elementos:

- nome ou posicionamento;
- Java Backend;
- arquitetura;
- APIs;
- mensageria;
- observabilidade;
- link curto quando apropriado.

---

### 21. Evitar banner poluído

O recorte móvel precisa continuar legível.

---

### 22. Manter consistência visual

GitHub social preview, portfólio e LinkedIn podem compartilhar identidade sem parecer cópia.

---

## Seção Sobre

### 23. Criar About Section

Arquivo:

```text
docs/LinkedIn/ABOUT_SECTION.md
```

Estrutura:

1. abertura profissional;
2. experiência;
3. foco atual;
4. projeto principal;
5. competências;
6. forma de trabalho;
7. objetivo.

---

### 24. Criar primeira frase forte

Exemplo:

```text
Atuo com qualidade e automação de software e venho aprofundando minha atuação em engenharia backend Java, conectando desenvolvimento, testabilidade, segurança e operação.
```

---

### 25. Explicar experiência anterior

Mostre valor da experiência em QA:

- pensamento crítico;
- prevenção;
- automação;
- APIs;
- bancos;
- pipelines;
- investigação de falhas;
- visão do usuário.

---

### 26. Apresentar OrderFlow

Resumo:

```text
desenvolvi o OrderFlow,
um backend Java 21 com Spring Boot
para orquestracao de pedidos,
integracoes assincronas,
idempotencia,
seguranca multi-tenant,
observabilidade,
testes,
Docker
e CI/CD.
```

---

### 27. Contextualizar o projeto

Use:

```text
projeto pessoal,
educacional
e demonstrativo.
```

Isso evita falsa experiência comercial.

---

### 28. Apresentar evidências

Cite:

- GitHub;
- OpenAPI;
- Postman;
- documentação;
- reports;
- arquitetura.

---

### 29. Mostrar forma de trabalho

Exemplos:

- decisões registradas;
- testes em camadas;
- documentação;
- gates;
- revisão;
- automação.

---

### 30. Declarar objetivo

Exemplo:

```text
busco oportunidades em Java Backend
nas quais eu possa unir desenvolvimento,
qualidade,
automacao
e visao de engenharia.
```

---

### 31. Evitar pedido genérico de oportunidade

Prefira objetivo específico.

---

### 32. Evitar texto excessivamente longo

Use parágrafos curtos e leitura escaneável.

---

## Experiências

### 33. Criar Experience Alignment

Arquivo:

```text
docs/LinkedIn/EXPERIENCE_ALIGNMENT.md
```

---

### 34. Reescrever experiência por impacto

Estrutura:

- contexto;
- responsabilidade;
- ações;
- tecnologias;
- resultados;
- colaboração.

---

### 35. Evitar lista de tarefas

Transforme:

```text
executava testes.
```

Em:

```text
estruturei validacoes de APIs,
automacoes
e evidencias
para reduzir regressao
e aumentar rastreabilidade.
```

Use apenas resultados verdadeiros.

---

### 36. Destacar backend relacionado

Inclua experiências com:

- APIs;
- contratos;
- bancos;
- mensageria;
- CI/CD;
- logs;
- integrações;
- automação.

---

### 37. Não renomear cargo formal

Mantenha o título real e use a descrição para contextualizar.

---

### 38. Quantificar quando possível

Use apenas números comprováveis.

---

### 39. Incluir colaboração

Mostre trabalho com:

- developers;
- product;
- business;
- operations;
- architecture.

---

## Projeto

### 40. Criar Project Feature

Arquivo:

```text
docs/LinkedIn/PROJECT_FEATURE.md
```

Campos:

- nome;
- período;
- papel;
- descrição;
- tecnologias;
- competências;
- links;
- resultados;
- limitações.

---

### 41. Definir papel corretamente

Exemplo:

```text
autor e desenvolvedor do projeto pessoal.
```

---

### 42. Criar descrição curta do projeto

Inclua:

- problema;
- solução;
- diferenciais;
- provas.

---

### 43. Selecionar tecnologias principais

Evite lista completa.

---

### 44. Selecionar resultados

Exemplos:

- arquitetura modular;
- segurança multi-tenant;
- mensageria confiável;
- testes automatizados;
- observabilidade;
- documentação executável;
- repositório público preparado.

---

### 45. Declarar limitações

Providers e deploy simulados precisam permanecer claros.

---

## Seção Destaques

### 46. Criar Featured Section Plan

Arquivo:

```text
docs/LinkedIn/FEATURED_SECTION_PLAN.md
```

Ordem recomendada:

1. GitHub do OrderFlow;
2. página de portfólio;
3. publicação de lançamento;
4. artigo técnico;
5. demonstração quando disponível.

---

### 47. Validar cada link

O link precisa estar público e funcionar sem autenticação indevida.

---

### 48. Criar descrições dos destaques

Cada item precisa explicar por que vale abrir.

---

### 49. Evitar excesso de destaques

Mantenha os itens mais fortes.

---

## Competências

### 50. Criar Skills Strategy

Arquivo:

```text
docs/LinkedIn/SKILLS_STRATEGY.md
```

Categorias:

- Java;
- Spring;
- backend;
- dados;
- mensageria;
- testes;
- DevOps;
- arquitetura;
- qualidade.

---

### 51. Definir competências principais

Exemplos:

- Java;
- Spring Boot;
- REST APIs;
- PostgreSQL;
- Kafka;
- Docker;
- JUnit;
- Testcontainers;
- CI/CD;
- Software Architecture.

---

### 52. Ordenar competências

As primeiras precisam refletir o objetivo.

---

### 53. Remover competências irrelevantes

Não mantenha destaque em tecnologia sem relação com a direção atual.

---

### 54. Não incluir competência sem experiência

Curso introdutório não equivale a domínio avançado.

---

### 55. Solicitar validações com critério

Peça para pessoas que realmente conhecem seu trabalho.

---

## Cursos e certificações

### 56. Revisar cursos

Inclua os mais relevantes.

---

### 57. Diferenciar curso de certificação

Não chame certificado de conclusão de certificação profissional quando não for.

---

### 58. Registrar projeto próprio como projeto

Não como certificado.

---

## URL e contato

### 59. Personalizar URL

Use forma profissional e estável.

---

### 60. Revisar dados de contato

Inclua somente canais desejados para contato profissional.

---

### 61. Evitar exposição desnecessária

Não publique endereço residencial ou telefone quando não for necessário.

---

## Visibilidade

### 62. Criar Profile Visibility Policy

Arquivo:

```text
docs/LinkedIn/PROFILE_VISIBILITY_POLICY.md
```

Revise:

- perfil público;
- foto;
- headline;
- Sobre;
- atividades;
- e-mail;
- conexões;
- notificações;
- status de busca de oportunidades.

---

### 63. Configurar interesse em vagas

Defina:

- cargos;
- localidades;
- remoto;
- híbrido;
- presencial;
- tipo de contrato.

---

### 64. Escolher visibilidade do interesse

A configuração precisa respeitar sua situação profissional.

---

### 65. Revisar idioma do perfil

Português pode ser principal.

Uma versão em inglês pode ser adicionada quando fizer sentido.

---

## Links

### 66. Criar LinkedIn Link Policy

Arquivo:

```text
docs/LinkedIn/LINKEDIN_LINK_POLICY.md
```

Links permitidos:

- GitHub público;
- portfólio;
- OpenAPI publicada;
- página do projeto;
- artigo;
- demonstração autorizada.

---

### 67. Evitar links locais

Nenhum link depende de:

- localhost;
- caminho de máquina;
- autenticação pessoal;
- ambiente temporário.

---

### 68. Usar parâmetros de rastreamento com cuidado

Não polua os links.

---

## Publicação de lançamento

### 69. Criar Launch Post

Arquivo:

```text
docs/LinkedIn/LAUNCH_POST.md
```

Estrutura:

1. contexto;
2. desafio;
3. o que foi construído;
4. decisões;
5. aprendizados;
6. evidências;
7. links;
8. convite à conversa.

---

### 70. Criar abertura

Exemplo:

```text
Depois de uma jornada completa de estudo e implementação, finalizei o OrderFlow, um projeto backend em Java 21 criado para explorar problemas reais de sistemas distribuídos além de um CRUD tradicional.
```

---

### 71. Explicar o problema

Fale de:

- duplicidade;
- falha parcial;
- mensageria;
- tenant;
- observabilidade;
- operação.

---

### 72. Selecionar destaques técnicos

Escolha cinco a sete.

---

### 73. Compartilhar aprendizados

Inclua algo que mudou sua forma de pensar.

---

### 74. Declarar escopo

Diga que é pessoal, educacional e demonstrativo.

---

### 75. Inserir links

Use links públicos já validados.

---

### 76. Criar convite profissional

Exemplo:

```text
feedbacks tecnicos e conversas sobre Java Backend, arquitetura, mensageria e qualidade sao bem-vindos.
```

---

### 77. Evitar pedido desesperado

A publicação apresenta trabalho e abre conversa.

---

### 78. Evitar hashtags excessivas

Use poucas e relevantes.

---

## Série técnica

### 79. Criar Technical Post Series

Arquivo:

```text
docs/LinkedIn/TECHNICAL_POST_SERIES.md
```

Temas:

1. por que CRUD não bastava;
2. idempotência;
3. Outbox;
4. Kafka e at-least-once;
5. tenant isolation;
6. observabilidade;
7. testes;
8. runbook;
9. arquitetura;
10. aprendizados.

---

### 80. Criar estrutura padrão

Cada publicação:

- problema;
- decisão;
- trade-off;
- exemplo;
- evidência;
- pergunta final.

---

### 81. Evitar copiar documentação inteira

Adapte para leitura social.

---

### 82. Criar calendário sustentável

Não prometa frequência impossível.

---

## Comentários e networking

### 83. Criar Commenting Strategy

Arquivo:

```text
docs/LinkedIn/COMMENTING_STRATEGY.md
```

Comentários úteis:

- acrescentam experiência;
- fazem pergunta;
- conectam conceito;
- reconhecem limite;
- evitam autopromoção artificial.

---

### 84. Evitar comentário genérico

Exemplo fraco:

```text
parabens.
```

Exemplo melhor:

```text
interessante a separacao entre retry e resultado ambiguo; no OrderFlow precisei tratar timeout de provider como estado de reconciliacao para evitar duplicidade.
```

---

### 85. Não colar link em toda conversa

Compartilhe somente quando relevante.

---

### 86. Criar Networking Strategy

Arquivo:

```text
docs/LinkedIn/NETWORKING_STRATEGY.md
```

Públicos:

- Java developers;
- backend engineers;
- arquitetos;
- recrutadores de tecnologia;
- QA engineers;
- comunidades;
- líderes técnicos.

---

### 87. Personalizar convite

Explique o contexto real.

---

### 88. Não automatizar spam

Qualidade de conexão importa mais que volume.

---

### 89. Participar de conversas

Visibilidade consistente vem de contribuição.

---

## Calendário

### 90. Criar Content Calendar

Arquivo:

```text
docs/LinkedIn/CONTENT_CALENDAR.md
```

Exemplo de ciclo:

```text
semana 1:
lancamento.

semana 2:
idempotencia.

semana 3:
Outbox.

semana 4:
seguranca multi-tenant.

semana 5:
testes e evidence.

semana 6:
aprendizados.
```

---

### 91. Incluir formatos variados

- texto;
- carrossel;
- diagrama;
- vídeo curto;
- artigo;
- comentário técnico.

---

### 92. Reutilizar sem duplicar

Uma decisão pode virar post, carrossel e fala, mas cada formato precisa ser adaptado.

---

## Consistência do perfil

### 93. Criar Profile Consistency Matrix

Arquivo:

```text
docs/LinkedIn/PROFILE_CONSISTENCY_MATRIX.md
```

Compare:

- headline;
- Sobre;
- experiência;
- projeto;
- GitHub;
- portfólio;
- currículo futuro;
- competências.

---

### 94. Validar nomes

Use sempre:

```text
OrderFlow.
```

---

### 95. Validar datas

Períodos do projeto e experiências precisam ser coerentes.

---

### 96. Validar papel

Não use cargos diferentes para a mesma atividade sem explicação.

---

### 97. Validar tecnologia

A stack pública precisa refletir o repositório.

---

### 98. Validar claims

Toda afirmação forte precisa de fonte.

---

## Revisão profissional

### 99. Criar LinkedIn Review Checklist

Arquivo:

```text
docs/LinkedIn/LINKEDIN_REVIEW_CHECKLIST.md
```

Perguntas:

- área clara?
- headline objetiva?
- Sobre legível?
- projeto visível?
- links funcionando?
- claims honestas?
- skills coerentes?
- limitações claras?
- visual profissional?
- currículo não antecipado?

---

### 100. Revisar ortografia

Erros no perfil prejudicam credibilidade.

---

### 101. Revisar linguagem

Prefira:

- verbos ativos;
- resultado;
- clareza;
- especificidade;
- parágrafos curtos.

---

### 102. Revisar acessibilidade

Banner e assets precisam ser legíveis.

---

### 103. Revisar segurança

Não exponha:

- secret;
- URL interna;
- dado de cliente;
- screenshot sensível;
- contato indesejado.

---

### 104. Pedir revisão externa

Peça feedback de:

- profissional técnico;
- recrutador;
- pessoa que não conhece o projeto.

---

### 105. Comparar interpretações

Se cada pessoa entende um cargo diferente, o posicionamento precisa de ajuste.

---

## Métricas

### 106. Definir métricas de acompanhamento

Exemplos:

- visualizações do perfil;
- aparições em busca;
- acessos ao GitHub;
- conexões relevantes;
- conversas técnicas;
- convites;
- respostas a candidaturas.

---

### 107. Não otimizar apenas curtidas

Curtida não é o objetivo principal.

---

### 108. Criar baseline

Registre estado antes das mudanças.

---

### 109. Revisar após período definido

Ajuste headline, links ou conteúdo com base em sinais reais.

---

## Automação de validação

### 110. Criar collector de fontes

`collect-profile-sources.ps1` reúne narrativa, GitHub e evidence.

---

### 111. Criar validator de claims

`validate-LinkedIn-claims.ps1` compara textos preparados com fontes.

---

### 112. Criar validator de links

---

### 113. Criar validator de assets

---

### 114. Não automatizar interação humana

Comentários e conexões precisam de contexto real.

---

## Governança

### 115. Criar LinkedIn Matrix

Arquivo:

```text
docs/LinkedIn/LINKEDIN_MATRIX.md
```

Colunas:

- seção;
- mensagem;
- audiência;
- claim;
- evidence;
- link;
- status.

---

### 116. Criar Risk Register

Arquivo:

```text
docs/LinkedIn/LINKEDIN_RISK_REGISTER.md
```

Riscos:

```text
cargo inventado;

experiencia exagerada;

claim sem evidence;

headline congestionada;

Sobre generico;

link quebrado;

asset sensivel;

spam;

hashtag excessiva;

curriculo antecipado.
```

---

### 117. Criar Traceability

Arquivo:

```text
docs/LinkedIn/LINKEDIN_TRACEABILITY.md
```

Exemplo:

```text
claim: Java Backend project
-> GitHub
-> README
-> architecture report.

claim: multi-tenant security
-> security tests
-> evidence.

claim: reliable messaging
-> Outbox and Kafka reports
-> runbook.
```

---

### 118. Criar boundary da próxima aula

Arquivo:

```text
docs/LinkedIn/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 705 define:

- professional positioning;
- target roles;
- profile audit;
- headline;
- visual identity;
- about section;
- experience alignment;
- project feature;
- featured section;
- skills;
- visibility;
- links;
- launch post;
- technical post series;
- commenting;
- networking;
- content calendar;
- profile consistency;
- profile review;
- metrics.

A aula 706 define:

- Java Backend resume;
- ATS-friendly structure;
- professional summary;
- experience bullets;
- project section;
- skills section;
- education;
- courses;
- keywords;
- metrics;
- one-page version;
- detailed version;
- role-specific tailoring;
- final PDF and source document.

Nenhum curriculo
e criado nesta aula.
```

---

## Validação final

### 119. Criar report

Arquivo:

```text
reports/LinkedIn-preparation-report.yaml
```

Exemplo:

```yaml
LinkedInPreparation:
  positioning:
    targetRole:
      defined
    headline:
      PASS
    about:
      PASS

  profile:
    experience:
      PASS
    project:
      PASS
    featured:
      PASS
    skills:
      PASS
    links:
      PASS
    assets:
      PASS

  content:
    launchPost:
      PASS
    technicalSeries:
      PASS
    contentCalendar:
      PASS

  integrity:
    unsupportedClaims:
      0
    brokenLinks:
      0
    sensitiveAssets:
      0

  JavaBackendResume:
    completed:
      false

  gate:
    PASS
```

Os dados precisam vir dos documentos reais.

---

### 120. Criar evidence

Arquivo:

```text
contracts/LinkedIn-preparation-evidence.yaml
```

Campos:

- lesson;
- project;
- target role status;
- secondary role status;
- profile audit status;
- headline option count;
- selected headline status;
- about section status;
- experience entry count;
- aligned experience count;
- project feature status;
- featured item count;
- skill count;
- primary skill count;
- visual identity status;
- profile visibility status;
- public link count;
- broken link count;
- launch post status;
- technical post count;
- comment strategy status;
- networking strategy status;
- content calendar status;
- unsupported claim count;
- sensitive asset count;
- external review count;
- baseline metric status;
- Java Backend resume completed;
- documentation status;
- gate status;
- timestamp.

---

### 121. Criar gate LinkedIn

Status:

```text
PASS;

FAIL_POSITIONING;

FAIL_TARGET_ROLE;

FAIL_PROFILE_AUDIT;

FAIL_HEADLINE;

FAIL_VISUAL_IDENTITY;

FAIL_ABOUT_SECTION;

FAIL_EXPERIENCE_ALIGNMENT;

FAIL_PROJECT_FEATURE;

FAIL_FEATURED_SECTION;

FAIL_SKILLS;

FAIL_PROFILE_VISIBILITY;

FAIL_LINK;

FAIL_LAUNCH_POST;

FAIL_TECHNICAL_SERIES;

FAIL_COMMENT_STRATEGY;

FAIL_NETWORKING_STRATEGY;

FAIL_CONTENT_CALENDAR;

FAIL_PROFILE_CONSISTENCY;

FAIL_UNSUPPORTED_CLAIM;

FAIL_SENSITIVE_ASSET;

FAIL_EXTERNAL_REVIEW;

FAIL_RESUME_ANTICIPATION;

INCONCLUSIVE.
```

---

### 122. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\LinkedIn\collect-profile-sources.ps1

.\scripts\LinkedIn\validate-LinkedIn-claims.ps1

.\scripts\LinkedIn\validate-profile-links.ps1

.\scripts\LinkedIn\validate-public-assets.ps1

.\scripts\LinkedIn\collect-LinkedIn-evidence.ps1
```

---

### 123. Executar revisão em três perspectivas

Perspectiva 1:

```text
recrutador.
```

Perspectiva 2:

```text
engenheiro Java.
```

Perspectiva 3:

```text
gestor tecnico.
```

---

### 124. Registrar versão final

Preserve cópia dos textos aprovados em `docs/LinkedIn`.

---

### 125. Encerrar o laboratório

Confirme:

- Charter;
- role map;
- positioning;
- profile audit;
- headline;
- foto;
- banner;
- Sobre;
- experiência;
- projeto;
- Destaques;
- skills;
- cursos;
- URL;
- visibilidade;
- links;
- launch post;
- technical series;
- comments;
- networking;
- calendar;
- consistency;
- review;
- metrics;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 706 preservada.

---

## Entendendo o que foi feito

### O perfil ganhou direção

A área e o objetivo profissional passaram a aparecer com clareza.

### A experiência anterior virou diferencial

Qualidade e automação foram conectadas a backend.

### O OrderFlow virou prova

O projeto deixou de ser apenas um link.

### A headline ganhou função

Busca, entendimento e posicionamento foram considerados juntos.

### A seção Sobre ganhou estrutura

Experiência, projeto, competências e objetivo passaram a formar uma narrativa.

### O conteúdo ganhou estratégia

Publicações técnicas derivam de decisões reais.

### Networking ganhou contexto

Conexões e comentários deixaram de ser ações genéricas.

### A consistência foi protegida

LinkedIn, GitHub e portfólio passaram a contar a mesma história.

### O currículo ficou preservado

A próxima aula trabalhará um documento específico para candidatura.

---

## Erros comuns importantes

### Inventar cargo

A credibilidade é perdida.

### Apagar experiência anterior

Competências transferíveis desaparecem.

### Colocar toda a stack na headline

A leitura fica ruim.

### Escrever Sobre genérico

O perfil não se diferencia.

### Publicar projeto sem contexto

O leitor não entende o valor.

### Omitir que o projeto é pessoal

Pode parecer experiência comercial falsa.

### Usar link quebrado

A prova fica inacessível.

### Automatizar spam

A reputação diminui.

### Medir apenas curtidas

O objetivo profissional fica esquecido.

### Criar currículo agora

Essa etapa pertence à aula 706.

---

## Comandos úteis

### Coletar fontes

```powershell
.\scripts\LinkedIn\collect-profile-sources.ps1
```

### Validar claims

```powershell
.\scripts\LinkedIn\validate-LinkedIn-claims.ps1
```

### Validar links

```powershell
.\scripts\LinkedIn\validate-profile-links.ps1
```

### Coletar evidence

```powershell
.\scripts\LinkedIn\collect-LinkedIn-evidence.ps1
```

---

## Exercício principal

Prepare o lançamento do OrderFlow no LinkedIn.

Inclua:

1. definir função-alvo;
2. escolher headline;
3. revisar foto;
4. criar banner;
5. escrever Sobre;
6. alinhar experiência atual;
7. criar projeto;
8. incluir GitHub;
9. incluir portfólio;
10. organizar Destaques;
11. ordenar competências;
12. configurar URL;
13. revisar visibilidade;
14. escrever publicação;
15. explicar problema;
16. citar decisões;
17. citar trade-offs;
18. citar evidências;
19. declarar limitações;
20. escolher hashtags;
21. criar pergunta final;
22. validar links;
23. validar claims;
24. pedir revisão externa;
25. registrar baseline;
26. publicar quando todo material estiver aprovado.

Não crie o currículo Java Backend.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 704 e ponte para a aula 706 foram preservadas;
- LinkedIn Preparation Charter foi criado;
- Target Role Map foi criado;
- função principal foi definida;
- função adjacente foi definida;
- diferenciais foram definidos;
- Professional Positioning foi criado;
- cargo atual e direção foram separados;
- competências transferíveis foram mapeadas;
- Profile Audit foi criado;
- primeira impressão foi avaliada;
- conteúdo antigo foi removido;
- histórico relevante foi preservado;
- Headline Options foi criado;
- headline direta foi criada;
- headline de transição foi criada;
- headline de valor foi criada;
- headline congestionada foi evitada;
- termos de busca foram validados;
- headline final foi escolhida;
- Visual Identity Plan foi criado;
- foto foi revisada;
- banner foi criado;
- poluição visual foi evitada;
- identidade visual foi alinhada;
- About Section foi criado;
- abertura profissional foi criada;
- experiência anterior foi explicada;
- OrderFlow foi apresentado;
- projeto foi contextualizado;
- evidências foram apresentadas;
- forma de trabalho foi explicada;
- objetivo foi declarado;
- pedido genérico foi evitado;
- texto excessivo foi evitado;
- Experience Alignment foi criado;
- experiências foram reescritas por impacto;
- listas de tarefas foram reduzidas;
- elementos de backend foram destacados;
- cargos formais foram preservados;
- números foram usados somente quando comprovados;
- colaboração foi apresentada;
- Project Feature foi criado;
- papel no projeto foi definido;
- descrição curta foi criada;
- tecnologias foram selecionadas;
- resultados foram selecionados;
- limitações foram declaradas;
- Featured Section Plan foi criado;
- links foram validados;
- descrições foram criadas;
- excesso de destaques foi evitado;
- Skills Strategy foi criada;
- categorias foram definidas;
- competências principais foram escolhidas;
- competências foram ordenadas;
- competências irrelevantes foram removidas;
- experiência foi respeitada;
- validações foram solicitadas com critério;
- cursos foram revisados;
- cursos e certificações foram diferenciados;
- projeto não foi tratado como certificação;
- URL foi personalizada;
- contatos foram revisados;
- exposição desnecessária foi evitada;
- Profile Visibility Policy foi criada;
- configurações foram revisadas;
- interesse em vagas foi configurado;
- visibilidade do interesse foi escolhida;
- idiomas foram revisados;
- Link Policy foi criada;
- links locais foram bloqueados;
- rastreamento foi usado com cuidado;
- Launch Post foi criado;
- abertura foi criada;
- problema foi explicado;
- destaques técnicos foram selecionados;
- aprendizados foram compartilhados;
- escopo foi declarado;
- links foram inseridos;
- convite profissional foi criado;
- pedido desesperado foi evitado;
- hashtags excessivas foram evitadas;
- Technical Post Series foi criada;
- estrutura padrão foi criada;
- documentação não foi copiada integralmente;
- calendário sustentável foi criado;
- Commenting Strategy foi criada;
- comentários genéricos foram evitados;
- links não foram usados como spam;
- Networking Strategy foi criada;
- públicos foram definidos;
- convites foram personalizados;
- automação de spam foi evitada;
- participação em conversas foi planejada;
- Content Calendar foi criado;
- formatos foram variados;
- reuso foi adaptado;
- Profile Consistency Matrix foi criada;
- nomes foram validados;
- datas foram validadas;
- papéis foram validados;
- tecnologias foram validadas;
- claims foram validadas;
- Review Checklist foi criado;
- ortografia foi revisada;
- linguagem foi revisada;
- acessibilidade foi revisada;
- segurança foi revisada;
- revisão externa foi solicitada;
- interpretações foram comparadas;
- métricas foram definidas;
- curtidas não foram tratadas como único objetivo;
- baseline foi registrada;
- revisão periódica foi definida;
- collectors e validators foram criados;
- interação humana não foi automatizada;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 706 foi criado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- currículo Java Backend não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\LinkedIn\validate-LinkedIn-claims.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/LinkedIn `
  scripts/LinkedIn `
  reports/LinkedIn-preparation-report.yaml `
  contracts/LinkedIn-preparation-evidence.yaml `
  docs/assets `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-proven|enterprise-expert|realTenant|realCustomer|resume-draft"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(LinkedIn): position OrderFlow for professional visibility"
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

- cargo inventado;
- claim sem evidence;
- dado pessoal desnecessário;
- URL quebrada;
- currículo da aula 706.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você preparou o LinkedIn para apresentar o OrderFlow e seu posicionamento profissional.

Você criou:

```text
professional positioning;

target role map;

profile audit;

headline;

visual identity;

about section;

experience alignment;

project feature;

featured section;

skills strategy;

profile visibility;

link policy;

launch post;

technical post series;

commenting strategy;

networking strategy;

content calendar;

profile consistency;

review checklist;

report e evidence.
```

O perfil agora pode comunicar com clareza quem você é, o que sabe fazer e onde estão suas provas.

A próxima aula será:

```text
706 - M20.36 - Curriculo Java Backend
```

Nela, você criará um currículo objetivo e direcionado para vagas Java Backend, alinhando resumo, experiências, projetos, competências, educação, cursos, palavras-chave e versões específicas para diferentes oportunidades.

Nenhum currículo foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini cargo-alvo.
- [ ] Defini posicionamento.
- [ ] Revisei perfil.
- [ ] Escolhi headline.
- [ ] Revisei foto e banner.
- [ ] Escrevi Sobre.
- [ ] Alinhei experiências.
- [ ] Cadastrei projeto.
- [ ] Organizei Destaques.
- [ ] Ordenei competências.
- [ ] Validei links.
- [ ] Escrevi publicação.
- [ ] Planejei série técnica.
- [ ] Planejei networking.
- [ ] Preservei currículo para a aula 706.

---

## Troubleshooting adicional

### Headline ficou longa

Remova tecnologias secundárias.

### Sobre ficou genérico

Inclua problema, projeto e evidência.

### Experiência parece desconectada

Mostre competências transferíveis.

### Projeto parece emprego formal

Declare que é pessoal e demonstrativo.

### Post ficou técnico demais

Adicione contexto e aprendizado.

### Post ficou superficial

Inclua decisão e trade-off.

### Link não abre sem login

Use página pública adequada.

### Perfil atrai vagas erradas

Revise headline, skills e função-alvo.

### Networking parece artificial

Reduza volume e aumente contexto.

### Quero criar currículo

Essa etapa pertence à aula 706.

---

## Perguntas de revisão

1. Posicionamento é cargo inventado?
2. O que headline precisa comunicar?
3. Experiência anterior deve ser apagada?
4. O que Sobre precisa conter?
5. Como apresentar projeto pessoal?
6. Por que declarar limitações?
7. O que Destaques deve priorizar?
8. Como ordenar skills?
9. Curso é sempre certificação?
10. O que revisar em visibilidade?
11. Link local pode ser usado?
12. O que uma publicação precisa contar?
13. Por que evitar hashtags excessivas?
14. O que faz um comentário útil?
15. Networking é volume?
16. Curtidas são o objetivo principal?
17. O que consistency matrix valida?
18. Como medir melhoria?
19. Por que pedir revisão externa?
20. O que claim forte precisa?
21. O que evidence LinkedIn prova?
22. O que a aula 706 fará?
23. O que não foi criado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Área, foco e diferencial.
3. Não.
4. Experiência, projeto e objetivo.
5. Com contexto honesto.
6. Manter credibilidade.
7. Provas fortes.
8. Pelo objetivo.
9. Não.
10. Perfil e interesse.
11. Não.
12. Problema, decisão e aprendizado.
13. Evitar ruído.
14. Acrescenta contexto.
15. Não.
16. Não.
17. Coerência.
18. Métricas profissionais.
19. Encontrar ambiguidade.
20. Evidence.
21. Consistência do posicionamento.
22. Criar currículo Java Backend.
23. Currículo.
24. Curriculo Java Backend.
25. Comunicar posição, competência, prova e direção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 705 - M20.35 - Preparacao LinkedIn

- Continuei após Preparação GitHub.
- Criei LinkedIn Preparation Charter.
- Criei Target Role Map.
- Defini posição principal, adjacente e diferenciais.
- Criei Professional Positioning.
- Separei cargo atual e direção.
- Mapeei competências transferíveis.
- Criei Profile Audit.
- Revisei primeira impressão.
- Removi conteúdo desatualizado.
- Preservei experiências relevantes.
- Criei Headline Options.
- Criei headlines direta, de transição e de valor.
- Evitei headline congestionada.
- Validei termos de busca.
- Escolhi headline final.
- Criei Visual Identity Plan.
- Revisei foto.
- Criei banner.
- Evitei poluição visual.
- Alinhei identidade.
- Criei About Section.
- Criei abertura profissional.
- Expliquei experiência de QA.
- Apresentei OrderFlow.
- Contextualizei projeto pessoal.
- Apresentei evidências.
- Expliquei forma de trabalho.
- Declarei objetivo.
- Evitei pedido genérico.
- Criei Experience Alignment.
- Reescrevi experiências por impacto.
- Destaquei APIs, bancos, CI/CD e automação.
- Preservei cargos formais.
- Usei números comprovados.
- Apresentei colaboração.
- Criei Project Feature.
- Defini papel, descrição, stack, resultados e limitações.
- Criei Featured Section Plan.
- Validei e descrevi links.
- Criei Skills Strategy.
- Organizei e priorizei competências.
- Removi skills irrelevantes.
- Revisei cursos e certificações.
- Personalizei URL.
- Revisei contatos.
- Criei Profile Visibility Policy.
- Configurei interesse em vagas.
- Revisei idiomas.
- Criei Link Policy.
- Bloqueei links locais.
- Criei Launch Post.
- Expliquei problema, decisões, aprendizados e escopo.
- Selecionei hashtags.
- Criei Technical Post Series.
- Criei calendário sustentável.
- Criei Commenting Strategy.
- Evitei comentários genéricos e spam.
- Criei Networking Strategy.
- Defini públicos e convites.
- Criei Content Calendar.
- Variei formatos.
- Criei Profile Consistency Matrix.
- Validei nomes, datas, papéis, tecnologias e claims.
- Criei Review Checklist.
- Revisei ortografia, linguagem, acessibilidade e segurança.
- Pedi revisão externa.
- Defini métricas.
- Registrei baseline.
- Criei collectors e validators.
- Criei LinkedIn Matrix.
- Criei LinkedIn Risk Register.
- Criei LinkedIn Traceability.
- Criei boundary para a aula 706.
- Criei report, evidence e gate.
- Não antecipei currículo Java Backend.
- Próxima aula: Curriculo Java Backend.
```

---

## Referência técnica curta

- LinkedIn Profile.
- Professional Positioning.
- Target Role.
- Headline.
- About Section.
- Featured Section.
- Project.
- Transferable Skill.
- Social Proof.
- Technical Post.
- Networking.
- Profile Visibility.
- Content Calendar.
- Profile Consistency.
- Professional Branding.

Regra final:

```text
A preparação LinkedIn do OrderFlow deve transformar projeto e experiência em posicionamento honesto: target role map define função principal, adjacente and differentiators, professional positioning conecta experiência em qualidade e automação à direção Java Backend, profile audit revisa foto, banner, headline, Sobre, experiências, projetos, Destaques, skills, URL, visibility and links, headline usa termos de busca sem virar lista excessiva, visual identity permanece legível e consistente com GitHub and portfolio, About section apresenta identidade, experiência, foco, OrderFlow, evidências, forma de trabalho e objetivo em parágrafos curtos, experiências mantêm cargos reais e destacam impacto, APIs, banco, CI CD, automação and collaboration, Project Feature declara autoria pessoal, contexto educacional, stack, resultados e limitações, Featured prioriza GitHub, portfolio and technical publication, skills são ordenadas pelo cargo-alvo e não exageram domínio, profile visibility and contact settings respeitam segurança e situação profissional, Launch Post narra contexto, problema, decisões, trade-offs, aprendizados, escopo and links, technical series adapta idempotência, Outbox, Kafka, tenant, observability, tests and runbook para conteúdo social, commenting and networking strategies priorizam contribuição e contexto sem spam, consistency matrix alinha LinkedIn, GitHub, portfolio and future resume, metrics acompanham busca, profile views, GitHub access, conversations and opportunities sem reduzir sucesso a curtidas, validators bloqueiam unsupported claims, broken links and sensitive assets, e o gate fecha positioning, profile, content, network, report and evidence enquanto estrutura ATS, resumo, bullets, projeto, skills, educação, keywords and versões de currículo permanecem reservados para a aula 706.
```
