# Roteiro operacional reconstruido completo

Este documento explica como continuar a formacao Java Backend sem perder sequencia, nomes, profundidade ou intencao pedagogica.

A fonte da verdade das aulas ja geradas e:

```text
docs/aulas
```

A grade operacional correta para continuar depois da aula 270 e:

```text
docs/FONTE_DA_VERDADE_CONTINUIDADE_CURSO/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv
```

## Decisao principal

A pasta `docs/aulas` vence qualquer grade antiga quando o assunto for aula ja gerada.

A CSV atualizada pos-270 serve para:

- registrar que `000` a `270` ja existem;
- apontar que a proxima aula e `271`;
- preservar nomes de arquivos;
- preservar modulo, codigo interno e status;
- guiar a continuidade ate o projeto final;
- impedir que outro chat pule assunto, renomeie modulo ou mude a ordem.

## Estado validado

Validacao feita sobre `docs/aulas` e sobre a grade atualizada:

```text
Aulas fisicas existentes: 271
Aulas logicas existentes: 000 a 270
Numeros faltando entre 000 e 270: nenhum
Ultima aula real: 270
Proxima aula: 271
Modulo encerrado: M11
Modulo que inicia agora: M12
Total de linhas na grade atualizada: 721
Intervalo total planejado: 000 a 720
Numeros faltando na grade atualizada: nenhum
Numeros duplicados na grade atualizada: nenhum
Aulas concluidas registradas: 271
Aulas planejadas reconstruidas: 450
```

Observacao sobre a CSV antiga:

```text
HISTORICO_GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATE_259.csv
```

Esse arquivo pode existir na pasta, mas ficou preso/antigo durante a atualizacao. Para continuar a partir da aula 271, use a versao:

```text
GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv
```

## Como ler a grade CSV

Colunas da grade:

```text
numero_aula          Numero global da aula.
codigo_aula          Codigo interno do modulo, como M12.01.
modulo               Modulo pedagogico.
nome_modulo          Nome do modulo.
status_aula          CONCLUIDA_GERADA ou PLANEJADA_RECONSTRUIDA.
tipo_aula            Tipo operacional da aula.
titulo_aula          Titulo previsto ou titulo real.
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
- Se houver divergencia entre uma grade antiga e `docs/aulas`, vence `docs/aulas`.
- Se houver divergencia entre a CSV antiga e a CSV atualizada pos-270, vence a CSV atualizada pos-270.

## Ponto exato de retomada

Ultima aula real:

```text
270_M11_26_FECHAMENTO_DO_M11_E_TRANSICAO_PARA_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_OFICIAL.md
# 270 - M11.26 - Fechamento do M11 e transicao para SQL, PostgreSQL e modelagem relacional
```

A aula 270 fecha oficialmente o M11 e prepara o M12.

Proxima aula:

```text
271_M12_01_INTRODUCAO_AO_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_PARA_JAVA_BACKEND_OFICIAL.md
# 271 - M12.01 - Introducao ao SQL, PostgreSQL e modelagem relacional para Java Backend
```

Laboratorio recomendado:

```text
labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

## Objetivo da aula 271

A aula 271 deve abrir o M12.

Ela nao deve ser uma aula de Spring Boot.

Ela nao deve ser uma aula de JPA.

Ela deve estabelecer a base mental e pratica para o aluno entender banco relacional antes de persistencia Java.

Foco:

```text
banco de dados;
SGBD;
banco relacional;
SQL;
PostgreSQL;
tabelas;
linhas;
colunas;
chaves;
relacionamentos;
papel do banco em aplicacoes backend;
ambiente minimo de pratica com PostgreSQL;
ponte para DBeaver, psql, schemas e rotina de trabalho na aula 272.
```

Nao aprofundar ainda:

```text
DDL completo;
tipos PostgreSQL;
joins;
indices;
transacoes;
locks;
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot;
API REST;
Flyway;
Liquibase.
```

## Sequencia imediata do M12

| Aula | Codigo | Arquivo | Foco |
|---:|---|---|---|
| 271 | M12.01 | `271_M12_01_INTRODUCAO_AO_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_PARA_JAVA_BACKEND_OFICIAL.md` | Abertura do M12, banco relacional, SQL, PostgreSQL e modelagem em nivel conceitual/pratico inicial. |
| 272 | M12.02 | `272_M12_02_DBEAVER_PSQL_SCHEMAS_E_ROTINA_DE_TRABALHO_OFICIAL.md` | DBeaver, psql, schemas e rotina de trabalho. |
| 273 | M12.03 | `273_M12_03_TIPOS_DE_DADOS_POSTGRESQL_COM_CRITERIO_OFICIAL.md` | Tipos de dados PostgreSQL com criterio. |
| 274 | M12.04 | `274_M12_04_DDL_CREATE_TABLE_ALTER_TABLE_DROP_TABLE_OFICIAL.md` | DDL: create table, alter table e drop table. |
| 275 | M12.05 | `275_M12_05_PRIMARY_KEY_FOREIGN_KEY_E_INTEGRIDADE_REFERENCIAL_OFICIAL.md` | Primary key, foreign key e integridade referencial. |
| 276 | M12.06 | `276_M12_06_CONSTRAINTS_NOT_NULL_UNIQUE_CHECK_DEFAULT_OFICIAL.md` | Constraints not null, unique, check e default. |
| 277 | M12.07 | `277_M12_07_INSERT_UPDATE_DELETE_E_RETORNO_DE_DADOS_OFICIAL.md` | Insert, update, delete e retorno de dados. |
| 278 | M12.08 | `278_M12_08_SELECT_WHERE_ORDER_BY_LIMIT_OFFSET_OFICIAL.md` | Select, where, order by, limit e offset. |
| 279 | M12.09 | `279_M12_09_OPERADORES_FILTROS_LIKE_BETWEEN_IN_IS_NULL_OFICIAL.md` | Operadores e filtros. |
| 280 | M12.10 | `280_M12_10_JOINS_INNER_LEFT_RIGHT_FULL_E_CROSS_COM_CRITERIO_OFICIAL.md` | Joins com criterio. |
| 281 | M12.11 | `281_M12_11_MODELAGEM_CONCEITUAL_ENTIDADES_ATRIBUTOS_RELACIONAMENTOS_OFICIAL.md` | Modelagem conceitual. |
| 282 | M12.12 | `282_M12_12_MODELAGEM_LOGICA_CARDINALIDADE_E_CHAVES_OFICIAL.md` | Modelagem logica, cardinalidade e chaves. |
| 283 | M12.13 | `283_M12_13_NORMALIZACAO_PRIMEIRA_SEGUNDA_E_TERCEIRA_FORMA_NORMAL_OFICIAL.md` | Normalizacao. |
| 284 | M12.14 | `284_M12_14_RELACIONAMENTO_UM_PARA_MUITOS_OFICIAL.md` | Relacionamento um para muitos. |
| 285 | M12.15 | `285_M12_15_RELACIONAMENTO_MUITOS_PARA_MUITOS_COM_TABELA_ASSOCIATIVA_OFICIAL.md` | Relacionamento muitos para muitos. |
| 286 | M12.16 | `286_M12_16_GROUP_BY_HAVING_E_AGREGACOES_OFICIAL.md` | Group by, having e agregacoes. |
| 287 | M12.17 | `287_M12_17_SUBQUERIES_CORRELACIONADAS_E_NAO_CORRELACIONADAS_OFICIAL.md` | Subqueries. |
| 288 | M12.18 | `288_M12_18_CTE_COMMON_TABLE_EXPRESSIONS_OFICIAL.md` | CTE. |
| 289 | M12.19 | `289_M12_19_VIEWS_E_MATERIALIZED_VIEWS_CONCEITUAL_OFICIAL.md` | Views e materialized views. |
| 290 | M12.20 | `290_M12_20_FUNCOES_DE_DATA_TEXTO_NUMEROS_E_CASE_WHEN_OFICIAL.md` | Funcoes de data, texto, numeros e case when. |
| 291 | M12.21 | `291_M12_21_INDICES_BTREE_UNIQUE_E_CRITERIOS_DE_USO_OFICIAL.md` | Indices. |
| 292 | M12.22 | `292_M12_22_EXPLAIN_EXPLAIN_ANALYZE_E_LEITURA_DE_PLANO_OFICIAL.md` | Explain e plano de execucao. |
| 293 | M12.23 | `293_M12_23_TRANSACOES_ACID_BEGIN_COMMIT_ROLLBACK_OFICIAL.md` | Transacoes ACID. |
| 294 | M12.24 | `294_M12_24_ISOLAMENTO_READ_COMMITTED_REPEATABLE_READ_SERIALIZABLE_OFICIAL.md` | Isolamento de transacoes. |
| 295 | M12.25 | `295_M12_25_LOCKS_DEADLOCKS_E_DIAGNOSTICO_INICIAL_OFICIAL.md` | Locks e deadlocks. |
| 296 | M12.26 | `296_M12_26_PAGINACAO_SQL_OFFSET_KEYSET_E_TRADEOFFS_OFICIAL.md` | Paginacao SQL. |
| 297 | M12.27 | `297_M12_27_MODELAGEM_OS_CLIENTE_ATIVIDADE_PRODUTO_E_PAGAMENTO_OFICIAL.md` | Modelagem OS. |
| 298 | M12.28 | `298_M12_28_CONSULTAS_DE_RELATORIO_PARA_BACKEND_OFICIAL.md` | Consultas de relatorio. |
| 299 | M12.29 | `299_M12_29_PERFORMANCE_INICIAL_DE_SQL_OFICIAL.md` | Performance inicial. |
| 300 | M12.30 | `300_M12_30_SCRIPTS_VERSIONADOS_E_MIGRACOES_CONCEITUAIS_OFICIAL.md` | Scripts versionados e migracoes conceituais. |
| 301 | M12.31 | `301_M12_31_FLYWAY_CONCEITUAL_ANTES_DO_SPRING_OFICIAL.md` | Flyway conceitual antes do Spring. |
| 302 | M12.32 | `302_M12_32_CARGA_DE_MASSA_SEED_E_DADOS_DE_TESTE_OFICIAL.md` | Seeds e dados de teste. |
| 303 | M12.33 | `303_M12_33_BACKUP_RESTORE_E_CUIDADOS_LOCAIS_OFICIAL.md` | Backup e restore. |
| 304 | M12.34 | `304_M12_34_USUARIOS_PERMISSOES_E_SEGURANCA_BASICA_NO_POSTGRESQL_OFICIAL.md` | Usuarios, permissoes e seguranca. |
| 305 | M12.35 | `305_M12_35_FUNCOES_WINDOW_INTRODUCAO_PARA_RELATORIOS_OFICIAL.md` | Window functions. |
| 306 | M12.36 | `306_M12_36_JSONB_NO_POSTGRESQL_QUANDO_USAR_E_QUANDO_EVITAR_OFICIAL.md` | JSONB. |
| 307 | M12.37 | `307_M12_37_PROJETO_BANCO_OS_PARTE_1_MODELO_FISICO_OFICIAL.md` | Projeto banco OS parte 1. |
| 308 | M12.38 | `308_M12_38_PROJETO_BANCO_OS_PARTE_2_CONSULTAS_E_RELATORIOS_OFICIAL.md` | Projeto banco OS parte 2. |
| 309 | M12.39 | `309_M12_39_REVISAO_TECNICA_SQL_POSTGRESQL_E_SIMULADO_OFICIAL.md` | Revisao tecnica e simulado. |
| 310 | M12.40 | `310_M12_40_FECHAMENTO_DO_MODULO_12_SQL_POSTGRESQL_OFICIAL.md` | Fechamento do M12. |

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
| M11 | 245-270 | 26 | Gerado | Ferramentas profissionais: Maven, Git, testes, qualidade, Docker, CI/CD, supply chain, Testcontainers, WireMock e ArchUnit. |
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

- referencia historica forte ate o inicio do M5;
- ficou desatualizada depois que o curso real ficou mais granular.

```text
C:\Users\win\Downloads\GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv
```

Uso correto:

- mapa macro auxiliar;
- nao controla numeracao real.

```text
C:\Users\win\Downloads\GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv
```

Uso correto:

- checklist de cobertura avancada;
- fonte de lacunas importantes para nivel senior/arquiteto;
- nao controla a ordem literal do curso.

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

A partir da aula 271, usar o Padrao Editorial Aula V2.

Toda nova aula deve manter:

- portugues brasileiro;
- tom de mentor tecnico;
- profundidade pratica, nao resumo;
- progressao gradual;
- foco em Java 21 LTS quando houver Java;
- Markdown;
- H1 no formato `# NNN - Mx.yy - Titulo da aula`;
- arquivo em caixa alta com underscores e sufixo `_OFICIAL.md`;
- laboratorio por aula quando fizer sentido;
- comandos em blocos `powershell` e `bash` quando util;
- SQL em bloco `sql`;
- YAML, Dockerfile, XML e properties com linguagem correta;
- aula principal focada;
- material complementar separado;
- checkpoint curto;
- commit recomendado;
- fechamento com ponte para a proxima aula.

Evitar:

- checklist gigante na aula principal;
- simulado longo em toda aula;
- repeticao da mesma ideia em muitas secoes;
- paragrafos de uma linha para cada frase;
- conteudo raso.

## Prompt curto de continuidade

Use este bloco no novo chat antes de pedir a aula 271:

```text
Voce vai continuar uma formacao Java Backend extensa. Antes de gerar qualquer aula, leia:

1. PROMPT_MESTRE_CONTINUAR_CURSO_JAVA.md
2. ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
3. GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv
4. 270_M11_26_FECHAMENTO_DO_M11_E_TRANSICAO_PARA_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_OFICIAL.md
5. REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md

A fonte da verdade das aulas ja geradas e docs/aulas.
A grade CSV atualizada pos-270 e a fonte operacional para as aulas futuras.

Nao reescreva aulas antigas.
Nao renomeie modulos.
Nao volte para aula 260.
Nao pule para JDBC, JPA, Hibernate, Spring Boot ou API REST.

Gere somente a aula 271:

Arquivo:
271_M12_01_INTRODUCAO_AO_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_PARA_JAVA_BACKEND_OFICIAL.md

H1:
# 271 - M12.01 - Introducao ao SQL, PostgreSQL e modelagem relacional para Java Backend
```

## Criterio de sucesso

O curso so continua corretamente se cada nova aula:

- respeitar a linha correspondente da CSV atualizada;
- ler a aula anterior antes de escrever;
- manter a ponte com a aula anterior;
- preparar a proxima aula sem mudar a grade;
- seguir o Padrao Editorial Aula V2;
- aumentar a maturidade do aluno rumo a senioridade, arquitetura e engenharia backend.
