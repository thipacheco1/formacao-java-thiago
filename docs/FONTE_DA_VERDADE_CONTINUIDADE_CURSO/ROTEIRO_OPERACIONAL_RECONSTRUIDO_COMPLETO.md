# Roteiro operacional reconstruido completo

Este documento explica como usar a grade operacional reconstruida para continuar a formacao Java Backend sem perder sequencia, nomes, profundidade ou intencao pedagogica.

A grade linha a linha esta em:

```text
docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv
```

## Decisao principal

A fonte da verdade das aulas ja geradas continua sendo:

```text
docs/aulas
```

A grade CSV reconstruida nao substitui as aulas reais. Ela serve para:

- registrar o que ja existe;
- apontar exatamente qual aula vem depois;
- preservar nomes de arquivos;
- preservar modulo, codigo interno e status;
- guiar a continuidade do curso ate o projeto final;
- impedir que outro chat pule assunto, renomeie modulo ou mude a ordem.

## Estado validado

Validacao feita sobre `docs/aulas` e sobre a grade reconstruida:

```text
Aulas fisicas existentes: 260
Aulas logicas existentes: 000 a 259
Numeros faltando entre 000 e 259: nenhum
Duplicatas fisicas atuais: nenhuma
Ultima aula real: 259
Proxima aula: 260
Total de linhas na grade reconstruida: 721
Intervalo total planejado: 000 a 720
Numeros faltando na grade reconstruida: nenhum
Numeros duplicados na grade reconstruida: nenhum
Aulas concluidas registradas: 260
Aulas planejadas reconstruidas: 461
```

Observacao importante sobre Git:

```text
Se o Git mostrar a remocao de docs/aulas/191_M7_06_STREAMS_TOLIST_COLLECT_E_COLLECTORS_OFICIAL (1).md,
trate isso como limpeza de duplicata antiga. A aula 191 valida e:
docs/aulas/191_M7_06_STREAMS_TOLIST_COLLECT_E_COLLECTORS_OFICIAL.md
```

## Como ler a grade CSV

Colunas da grade:

```text
numero_aula          Numero global da aula.
codigo_aula          Codigo interno do modulo, como M11.16.
modulo               Modulo pedagogico.
nome_modulo          Nome do modulo.
status_aula          CONCLUIDA_GERADA ou PLANEJADA_RECONSTRUIDA.
tipo_aula            Tipo operacional da aula.
titulo_aula          Titulo previsto ou titulo real extraido do H1.
arquivo_md           Nome exato do arquivo Markdown.
conteudo_principal   Descricao do foco da aula.
fonte_decisao        Origem da decisao.
regra_continuidade   Regra para nao quebrar a sequencia.
```

Regras de uso:

- Se `status_aula` for `CONCLUIDA_GERADA`, nao reescreva a aula.
- Se `status_aula` for `CONCLUIDA_GERADA`, leia o arquivo real em `docs/aulas`.
- Se `status_aula` for `PLANEJADA_RECONSTRUIDA`, use a linha como roteiro da aula futura.
- Gere apenas uma aula por vez.
- Ao terminar uma aula nova, a proxima deve seguir a linha seguinte da CSV.
- Nao use as grades antigas para sobrescrever a grade real.
- Se houver divergencia entre uma grade antiga e `docs/aulas`, vence `docs/aulas`.
- Se houver divergencia entre uma grade antiga e esta CSV reconstruida para aulas futuras, vence esta CSV, salvo decisao manual do mentor.

## Ponto exato de retomada

Ultima aula real:

```text
259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md
# 259 - M11.15 - Docker para Java Backend: containers, imagens, Dockerfile e Docker Compose
```

A aula 259 termina preparando a aula seguinte com este assunto:

```text
Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend.
```

Portanto, a proxima aula a gerar e:

```text
260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md
# 260 - M11.16 - Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend
```

Laboratorio recomendado:

```text
labs/m11/aula-260-docker-compose-profissional
```

Pacote Java, se houver codigo:

```text
br.com.curso.aula260
```

## Sequencia imediata do M11

Estas aulas fecham o modulo de ferramentas profissionais antes de entrar em SQL e PostgreSQL:

| Aula | Codigo | Arquivo | Foco |
|---:|---|---|---|
| 260 | M11.16 | `260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md` | Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local. |
| 261 | M11.17 | `261_M11_17_CI_CD_GITHUB_ACTIONS_E_PIPELINE_JAVA_BACKEND_CONCEITOS_WORKFLOW_E_GATILHOS_OFICIAL.md` | CI/CD, GitHub Actions, workflows e gatilhos. |
| 262 | M11.18 | `262_M11_18_PIPELINE_MAVEN_COM_TESTES_JACOCO_RELATORIOS_E_ARTEFATOS_OFICIAL.md` | Pipeline Maven com testes, JaCoCo, relatorios e artefatos. |
| 263 | M11.19 | `263_M11_19_PIPELINE_DOCKER_BUILD_TAGS_REGISTRY_SECRETS_E_IMAGEM_VERSIONADA_OFICIAL.md` | Build Docker, tags, registry, secrets e imagem versionada. |
| 264 | M11.20 | `264_M11_20_CHECKSTYLE_SPOTLESS_E_FORMATACAO_AUTOMATIZADA_COM_CRITERIO_OFICIAL.md` | Checkstyle, Spotless e formatacao automatizada. |
| 265 | M11.21 | `265_M11_21_SEGURANCA_DE_DEPENDENCIAS_SCA_SBOM_DEPENDABOT_E_SUPPLY_CHAIN_OFICIAL.md` | SCA, SBOM, Dependabot e supply chain. |
| 266 | M11.22 | `266_M11_22_TESTCONTAINERS_COM_POSTGRESQL_TESTES_DE_INTEGRACAO_REAIS_E_DESCARTAVEIS_OFICIAL.md` | Testcontainers com PostgreSQL. |
| 267 | M11.23 | `267_M11_23_WIREMOCK_CONTRATOS_HTTP_E_SERVICOS_EXTERNOS_FAKE_OFICIAL.md` | WireMock, contratos HTTP e servicos externos fake. |
| 268 | M11.24 | `268_M11_24_ARCHUNIT_E_REGRAS_ARQUITETURAIS_AUTOMATIZADAS_INICIAIS_OFICIAL.md` | ArchUnit e regras arquiteturais automatizadas. |
| 269 | M11.25 | `269_M11_25_MINI_PROJETO_FERRAMENTAS_MAVEN_TESTES_QUALIDADE_DOCKER_COMPOSE_E_CI_OFICIAL.md` | Mini-projeto integrando ferramentas do M11. |
| 270 | M11.26 | `270_M11_26_FECHAMENTO_DO_MODULO_11_FERRAMENTAS_PROFISSIONAIS_E_TRANSICAO_PARA_SQL_OFICIAL.md` | Fechamento do M11 e transicao para SQL. |

## Mapa completo de modulos

| Modulo | Aulas | Total | Status | Objetivo |
|---|---:|---:|---|---|
| Abertura | 000 | 1 | Gerado | Apresentar a formacao e o caminho ate engenharia backend. |
| M0 | 001-020 | 20 | Gerado | Ambiente, metodo, ferramentas, Git, Maven, PostgreSQL, HTTP, Docker Desktop/WSL2 e rotina profissional. |
| M1 | 021-061 | 41 | Gerado | Fundamentos absolutos de Java. |
| M2 | 062-089 | 28 | Gerado | Java Core profundo, JVM, memoria, tipos modernos, datas, excecoes iniciais e recursos da linguagem. |
| M3 | 090-104 | 15 | Gerado | Metodos, organizacao procedural, coesao, reuso e projetos console. |
| M4 | 105-145 | 41 | Gerado | Orientacao a objetos, dominio, encapsulamento, composicao, invariantes e modelagem. |
| M5 | 146-171 | 26 | Gerado | Collections Framework. |
| M6 | 172-185 | 14 | Gerado | Generics e Optional. |
| M7 | 186-200 | 15 | Gerado | Functional Interfaces, lambdas e Streams. |
| M8 | 201-214 | 14 | Gerado | Exceptions, I/O, CSV, Date/Time e utilitarios modernos. |
| M9 | 215-222 | 8 | Gerado | SOLID aplicado ao backend. |
| M10 | 223-244 | 22 | Gerado | Design Patterns aplicados ao backend. |
| M11 | 245-270 | 26 | Parcial | Ferramentas profissionais: JDK/JVM/JRE, Maven, Gradle, Git, IDE, testes, qualidade, Docker, CI e testes de integracao. |
| M12 | 271-310 | 40 | Planejado | SQL, PostgreSQL e modelagem relacional. |
| M13 | 311-355 | 45 | Planejado | Persistencia Java: JDBC, JPA, Hibernate e Spring Data. |
| M14 | 356-410 | 55 | Planejado | Spring Boot, APIs REST e backend profissional. |
| M15 | 411-455 | 45 | Planejado | Seguranca de aplicacoes Java. |
| M16 | 456-505 | 50 | Planejado | Integracoes, mensageria, eventos e resiliencia. |
| M17 | 506-555 | 50 | Planejado | DevOps, CI/CD, Kubernetes e Cloud. |
| M18 | 556-610 | 55 | Planejado | Observabilidade, performance, concorrencia e producao. |
| M19 | 611-670 | 60 | Planejado | Arquitetura, DDD, sistemas distribuidos e lideranca tecnica. |
| M20 | 671-720 | 50 | Planejado | Projeto final, carreira, entrevistas, portfolio e defesa tecnica. |

## Papel das grades antigas

As grades antigas foram usadas como evidencias, mas nao como autoridade final.

```text
C:\Users\win\Downloads\grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv
```

Uso correto:

- melhor referencia historica ate o inicio do M5;
- bate bem com a sequencia inicial;
- ficou desatualizada depois que o curso real se tornou mais granular.

```text
C:\Users\win\Downloads\GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv
```

Uso correto:

- mapa macro auxiliar;
- nao deve controlar numeracao real.

```text
C:\Users\win\Downloads\GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv
```

Uso correto:

- checklist de cobertura avancada;
- fonte de lacunas importantes para nivel senior/arquiteto;
- nao deve controlar a ordem literal do curso.

## Lacunas avancadas preservadas

A grade reconstruida preserva temas avancados que nao podem ser esquecidos:

- SCA, SBOM, Dependabot e supply chain;
- versionamento de APIs;
- OpenAPI e contract-first;
- idempotencia, retentativas, timeouts e resiliencia;
- mensageria, eventos, Kafka/RabbitMQ e outbox;
- cache, Redis e invalidacao;
- CI/CD, pipelines, Docker, Kubernetes e cloud;
- blue-green, canary, rollback e estrategias de release;
- migracao de banco sem downtime;
- logs estruturados, metricas, tracing, dashboards e alertas;
- profiling, JFR, JMC e capacity planning;
- concorrencia moderna, virtual threads e cuidados de thread safety;
- arquitetura em camadas, Clean Architecture, Hexagonal, DDD e monolito modular;
- microservicos, contratos, consistencia eventual, SAGA e Strangler Fig;
- fitness functions arquiteturais e governanca tecnica;
- projeto final defensavel, portfolio e narrativa tecnica.

## Padrao editorial obrigatorio

Toda nova aula deve manter:

- portugues brasileiro;
- tom de mentor tecnico;
- profundidade pratica, nao resumo;
- progressao gradual;
- foco em Java 21 LTS;
- Markdown;
- H1 no formato `# NNN - Mx.yy - Titulo da aula`;
- arquivo em caixa alta com underscores e sufixo `_OFICIAL.md`;
- laboratorio por aula quando fizer sentido;
- pacote Java `br.com.curso.aulaNNN` quando houver codigo;
- comandos em blocos `powershell` e `bash` quando util;
- codigo Java em blocos `java`;
- YAML, Dockerfile, XML, SQL e properties com linguagem correta;
- checklist;
- registro rapido;
- exercicio pratico principal;
- desafio extra;
- simulado rapido;
- gabarito;
- commit recomendado;
- fechamento com ponte para a proxima aula.

## Prompt curto de continuidade

Use este bloco no novo chat antes de pedir a aula 260:

```text
Voce vai continuar uma formacao Java Backend extensa. Antes de gerar qualquer aula, leia:

1. docs/PROMPT_MESTRE_CONTINUAR_CURSO_JAVA.md
2. docs/ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
3. docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv
4. docs/aulas/259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md

A fonte da verdade das aulas ja geradas e docs/aulas.
A grade CSV reconstruida e a fonte operacional para as aulas futuras.

Nao reescreva aulas antigas.
Nao renomeie modulos.
Nao pule para Spring Boot.
Nao mude a aula 260.

Gere somente a aula 260:

Arquivo:
260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md

H1:
# 260 - M11.16 - Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend
```

## Criterio de sucesso

O curso so continua corretamente se cada nova aula:

- respeitar a linha correspondente da CSV;
- ler a aula anterior antes de escrever;
- manter a ponte com a aula anterior;
- preparar a proxima aula sem mudar a grade;
- aumentar a maturidade do aluno rumo a senioridade, arquitetura e engenharia backend.
