# Checklist de cobertura v4.1

Este arquivo existe para revisar se a formação cobre as áreas críticas de uma trilha Java Backend com base de engenheiro/arquiteto.

## Java Core

- [x] JDK/JRE/JVM
- [x] javac
- [x] bytecode
- [x] main
- [x] variáveis
- [x] tipos primitivos
- [x] wrappers
- [x] String pool
- [x] StringBuilder
- [x] operadores
- [x] condicionais
- [x] switch moderno
- [x] laços
- [x] arrays
- [x] matrizes
- [x] métodos
- [x] escopo
- [x] pass-by-value
- [x] stack/heap
- [x] GC
- [x] null
- [x] exceptions
- [x] BigDecimal
- [x] java.time
- [x] Locale
- [x] enum
- [x] records
- [x] annotations
- [x] reflection
- [x] sealed
- [x] pattern matching

## OO e design

- [x] classe
- [x] objeto
- [x] encapsulamento
- [x] construtores
- [x] imutabilidade
- [x] composição
- [x] herança
- [x] polimorfismo
- [x] interfaces
- [x] classes abstratas
- [x] equals/hashCode
- [x] DTO
- [x] mapper
- [x] SOLID
- [x] clean code
- [x] code smells
- [x] refatoração
- [x] design patterns

## Collections e Java moderno

- [x] List
- [x] Set
- [x] Map
- [x] Queue
- [x] Deque
- [x] PriorityQueue
- [x] Big-O
- [x] Comparable
- [x] Comparator
- [x] Generics
- [x] wildcards
- [x] Optional
- [x] Streams
- [x] Collectors
- [x] Concurrent collections

## Build, Git e qualidade

- [x] Maven lifecycle
- [x] POM
- [x] scopes
- [x] dependency tree
- [x] BOM
- [x] Maven Wrapper
- [x] plugins
- [x] multi-module
- [x] Gradle visão geral
- [x] branch
- [x] merge
- [x] rebase
- [x] conflitos
- [x] revert
- [x] cherry-pick
- [x] tags
- [x] conventional commits
- [x] PR
- [x] code review
- [x] Sonar
- [x] formatadores

## Testes

- [x] JUnit 5
- [x] AAA
- [x] casos felizes
- [x] bordas
- [x] erros
- [x] parametrizados
- [x] AssertJ
- [x] builders
- [x] Mockito
- [x] TDD
- [x] JaCoCo
- [x] mutation testing
- [x] Testcontainers
- [x] WireMock
- [x] contract tests
- [x] ArchUnit

## Banco e persistência

- [x] PostgreSQL
- [x] DDL
- [x] DML
- [x] constraints
- [x] modelagem
- [x] normalização
- [x] JOIN
- [x] GROUP BY
- [x] CTE
- [x] índices
- [x] EXPLAIN
- [x] transações
- [x] locks
- [x] deadlocks
- [x] JDBC
- [x] DAO
- [x] Flyway
- [x] JPA
- [x] Hibernate
- [x] persistence context
- [x] dirty checking
- [x] flush
- [x] lazy/eager
- [x] N+1
- [x] JPQL
- [x] Criteria
- [x] projections
- [x] paginação
- [x] locks JPA
- [x] Spring Data

## Spring e APIs

- [x] Spring Boot
- [x] DI
- [x] beans
- [x] auto configuration
- [x] controllers
- [x] REST
- [x] HTTP
- [x] DTOs
- [x] Bean Validation
- [x] custom validation
- [x] service
- [x] repository
- [x] @Transactional
- [x] exception handler
- [x] Problem Details
- [x] PUT/PATCH
- [x] paginação
- [x] filtros
- [x] Swagger
- [x] profiles
- [x] logs
- [x] filters/interceptors
- [x] events
- [x] async
- [x] cache Redis
- [x] rate limiting
- [x] upload/download
- [x] scheduler
- [x] testes

## Segurança

- [x] autenticação
- [x] autorização
- [x] threat modeling
- [x] OWASP
- [x] CORS
- [x] CSRF
- [x] security headers
- [x] BCrypt
- [x] Spring Security
- [x] JWT
- [x] refresh token
- [x] roles
- [x] method security
- [x] OAuth2
- [x] OIDC
- [x] PKCE
- [x] Keycloak
- [x] secrets
- [x] auditoria
- [x] LGPD
- [x] multi-tenancy
- [x] testes de segurança

## Integrações e mensageria

- [x] APIs externas
- [x] timeout
- [x] retry
- [x] circuit breaker
- [x] bulkhead
- [x] idempotência
- [x] webhooks
- [x] SOAP
- [x] XML
- [x] CSV
- [x] SFTP
- [x] batch
- [x] RabbitMQ
- [x] Kafka
- [x] eventos de domínio
- [x] schema evolution
- [x] schema registry
- [x] poison message
- [x] retry/DLQ
- [x] deduplicação
- [x] outbox
- [x] inbox
- [x] saga
- [x] CDC
- [x] microserviços vs monólito

## DevOps, Cloud e produção

- [x] Docker
- [x] Dockerfile
- [x] multi-stage
- [x] imagem segura
- [x] Compose
- [x] GitHub Actions
- [x] pipeline
- [x] Kubernetes
- [x] Ingress
- [x] probes
- [x] requests/limits
- [x] HPA
- [x] Helm
- [x] AWS
- [x] RDS
- [x] SQS/SNS
- [x] custos
- [x] logs estruturados
- [x] correlation ID
- [x] Actuator
- [x] Micrometer
- [x] SLI/SLO/SLA
- [x] Prometheus
- [x] Grafana
- [x] OpenTelemetry
- [x] alertas
- [x] runbooks
- [x] postmortem
- [x] thread dump
- [x] heap dump
- [x] GC logs
- [x] JVM tuning
- [x] load testing
- [x] HikariCP
- [x] concorrência
- [x] virtual threads

## Arquitetura e liderança

- [x] camadas
- [x] Clean Architecture
- [x] hexagonal
- [x] monólito modular
- [x] DDD
- [x] entity
- [x] value object
- [x] aggregate
- [x] repository DDD
- [x] domain service
- [x] use case
- [x] domain events
- [x] bounded context
- [x] context map
- [x] ACL
- [x] event storming
- [x] CQRS
- [x] event sourcing
- [x] CAP
- [x] PACELC
- [x] consistência eventual
- [x] design de sistemas
- [x] escalabilidade
- [x] resiliência
- [x] multi-tenancy
- [x] arquitetura corporativa
- [x] modernização de legado
- [x] ADR
- [x] RFC
- [x] code review

## Projeto, carreira e ensino

- [x] projeto final
- [x] backlog
- [x] README
- [x] diagramas
- [x] banca técnica
- [x] currículo
- [x] LinkedIn
- [x] entrevista Java
- [x] entrevista Spring/JPA
- [x] entrevista arquitetura
- [x] live coding
- [x] ensinar
- [x] Java Course Studio


## Total

- Total de módulos: 18
- Total de sessões operacionais: 1936

## Observação de manutenção

Este checklist deve ser revisado periodicamente quando o mercado, o Java, o Spring, práticas de cloud, segurança ou arquitetura evoluírem.
