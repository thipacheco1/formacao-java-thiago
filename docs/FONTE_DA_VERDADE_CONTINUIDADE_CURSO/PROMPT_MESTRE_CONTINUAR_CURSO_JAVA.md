# Prompt mestre para continuar a formacao Java Backend

Este documento existe para retomar a geracao das aulas em outro chat sem perder a sequencia, o estilo, os nomes, os diretorios e o raciocinio pedagogico do curso.

Para a analise completa das grades CSV antigas, da nova grade operacional reconstruida e do roteiro de continuidade, consulte tambem:

```text
docs/ANALISE_GRADES_E_ROTEIRO_CONTINUIDADE_POS_259.md
docs/ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv
```

## Diagnostico do estado atual

- Pasta principal das aulas: `docs/aulas`.
- Existem 260 arquivos Markdown fisicos e 260 aulas logicas numeradas de `000` a `259`.
- Nao ha duplicata fisica no estado atual da pasta `docs/aulas`.
- Se o Git mencionar a remocao de `191_M7_06_STREAMS_TOLIST_COLLECT_E_COLLECTORS_OFICIAL (1).md`, trate como limpeza de duplicata antiga. A aula valida 191 e a sem sufixo:
  - `191_M7_06_STREAMS_TOLIST_COLLECT_E_COLLECTORS_OFICIAL.md`
- Nao ha numeros faltando entre `000` e `259`.
- Ultima aula valida gerada:
  - `259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md`
  - H1: `# 259 — M11.15 — Docker para Java Backend: containers, imagens, Dockerfile e Docker Compose`
- A aula `259` termina dizendo que a proxima aula deve aprofundar:
  - `Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend.`
- Portanto, a proxima aula deve ser:
  - arquivo: `260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md`
  - H1: `# 260 — M11.16 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend`
- As grades CSV antigas nao devem ser usadas como fonte principal de continuidade, porque nao batem com a sequencia real dos arquivos gerados a partir dos modulos recentes.
- A fonte da verdade das aulas ja geradas e a pasta `docs/aulas`.
- A fonte operacional para aulas futuras, ja reconciliada com os arquivos reais e as grades antigas, e:
  - `docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv`
  - `docs/ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md`
- Se houver grades CSV antigas anexadas, use-as assim:
  - `grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv`: historico mais fiel ate o inicio do M5 e fonte auxiliar de macroplanejamento.
  - `GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv`: mapa macro auxiliar.
  - `GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv`: checklist de cobertura avancada, nao numeracao real.

## Sequencia real ja produzida

- `000`: aula de abertura da formacao.
- `001` a `020` - M0: ambiente, metodo, Windows, PowerShell, JDK, javac, IntelliJ, debug, Git, GitHub, Markdown, diario de bordo, IA, Maven, PostgreSQL, Postman/Insomnia, Docker Desktop/WSL2, estrutura do repositorio e checklist.
- `021` a `061` - M1: fundamentos absolutos de Java, variaveis, tipos, operadores, condicionais, lacos, arrays, matrizes, metodos, escopo, referencias, tratamento inicial de entrada, debug e mini-projeto Calculadora Profissional Console.
- `062` a `089` - M2: Java Core profundo, JVM, bytecode, stack/heap, GC, default values, null, String pool, StringBuilder, wrappers, casting, Math/Random, BigDecimal, Locale, java.time, timezone, enum, records, var, varargs, annotations, reflection, sealed, pattern matching, text blocks, exceptions por baixo, console robusto, pacotes, documentacao oficial e mini-projeto Biblioteca Java Core.
- `090` a `104` - M3: organizacao procedural, main menor, metodos pequenos, assinatura, coesao, parametros, boolean de validacao, metodos de calculo/exibicao/leitura, reuso, debug, Extract Method, mini-arquitetura procedural, calculadora revisitada, processamento de OS e revisao antes de OO.
- `105` a `145` - M4: orientacao a objetos, modelagem, classe/objeto, atributos, comportamento, construtores, encapsulamento, getters/setters com criterio, imutabilidade, composicao, objetos de valor, entidades, identidade, equals/hashCode, toString, static/final, pacotes, acesso, coesao, acoplamento, colaboracao, Tell Don't Ask, objetos anemicos, invariantes, servicos de dominio, factories, builder, colecoes dentro de objetos, agregados, limites de responsabilidade e mini-projeto Ordem de Servico Console.
- `146` a `171` - M5: Collections Framework, List, ArrayList, Iterator, remocao segura, LinkedList, Set, HashSet, equals/hashCode, LinkedHashSet, TreeSet, Map, HashMap, objetos como chave, LinkedHashMap, TreeMap, Queue, Deque, PriorityQueue, Collections utility, Comparator, mini-projeto, revisoes, exercicios integradores e projeto final de collections.
- `172` a `185` - M6: Generics, classes/interfaces genericas, metodos genericos, bounded types, wildcards, PECS, type erasure, limitacoes, Optional, map/flatMap, mini-projeto Repository/Resultado, revisao e transicao.
- `186` a `200` - M7: Functional Interfaces, lambdas, Predicate/Function/Consumer/Supplier, method reference, composicao funcional, Streams API, collectors, match/find/count, sorted/distinct/limit/skip, min/max/reduce, grouping/partitioning, flatMap, Optional em streams, boas praticas, exercicios e fechamento.
- `201` a `214` - M8: Exceptions, checked vs unchecked, exceptions proprias, try/catch/finally/try-with-resources, modelagem de erro por camada, Resultado, validacoes controladas, I/O, Path/Files, BufferedReader/Writer, CSV manual, Date/Time API, Instant/ZoneId/ZonedDateTime/OffsetDateTime, Objects, StringJoiner, UUID, Random/SecureRandom, exercicios e fechamento.
- `215` a `222` - M9: SOLID, SRP, OCP, LSP, ISP, DIP, SOLID aplicado em fluxo backend, revisao, refatoracao guiada e simulado.
- `223` a `244` - M10: Design Patterns no backend, Strategy, Factory, Builder, Adapter, Facade, Template Method, Chain of Responsibility, State, Command, Observer, Decorator, Proxy, Composite, Flyweight, Bridge, Mediator, Memento, Iterator, Visitor, Interpreter e revisao tecnica.
- `245` a `259` - M11 ate agora: ferramentas essenciais do Java Backend profissional, JDK/JVM/JRE/bytecode/classpath, Maven, Gradle, Git profissional, IDE/terminal/debugging, JUnit 5, JUnit avancado, Mockito, Mockito avancado, AssertJ, TDD, JaCoCo, SonarQube e Docker para Java Backend.

## Padrao editorial das aulas

- Idioma: portugues brasileiro.
- Tom: professor/mentor tecnico, direto, didatico, serio, com progressao gradual.
- Publico: aluno saindo do zero em Java rumo a backend profissional, engenharia e arquitetura.
- Nao pular etapas. Nao antecipar Spring Boot antes da base de ferramentas estar consolidada.
- Nao transformar a aula em resumo raso; as aulas recentes sao longas, praticas e detalhadas.
- Manter foco em Java 21 LTS.
- Usar Markdown.
- H1 no formato: `# NNN — Mx.yy — Titulo da aula`.
- Nome de arquivo em caixa alta com underscores, numero global, modulo e indice interno, terminando com `_OFICIAL.md`.
- Para aulas recentes, usar estrutura com:
  - `## Objetivo da aula`
  - `## Reforco do objetivo maior`
  - partes numeradas como `# Parte 1 — ...`
  - exemplos conceituais em blocos `text`
  - comandos em `powershell` e, quando util, `bash`
  - codigo Java em `java`
  - arquivos Maven em `xml`
  - Docker em `dockerfile`, `yaml` e `dockerignore`
  - laboratorio pratico em `labs/m11/aula-NNN-*`
  - pacote Java `br.com.curso.aulaNNN`
  - checklist da aula
  - registro rapido da aula
  - exercicio pratico principal
  - desafio extra
  - simulado rapido com questoes e gabarito
  - commit recomendado
  - fechamento com ponte para a proxima aula
- Regras recorrentes:
  - nao commitar `target`, `build`, `out`, `.class`, logs, `.env` com segredo;
  - usar `git status` antes/depois;
  - criar laboratorios isolados por aula;
  - nao renomear aulas antigas;
  - nao alterar o conteudo de aulas anteriores sem pedido explicito;
  - nao inventar outra grade se a sequencia real dos arquivos disser outra coisa.

## Prompt para colar no novo chat

```text
Voce vai assumir a continuidade de uma formacao Java Backend extensa que ja possui aulas geradas em Markdown na pasta docs/aulas.

Tarefa principal:
continuar a geracao do curso a partir do ponto exato em que ele parou, sem mudar a sequencia, sem renomear padroes, sem trocar modulo, sem pular assunto e sem reescrever aulas antigas.

Antes de escrever qualquer aula nova, trate a pasta docs/aulas como fonte da verdade. Leia os arquivos em ordem numerica, de 000 ate 259. Nao leia apenas amostras. A sequencia pedagogica depende de cada aula anterior.

Estado atual validado:
- Existem 260 arquivos fisicos e 260 aulas logicas.
- Nao ha duplicata fisica no estado atual de `docs/aulas`.
- Nao ha numeros faltando de 000 a 259.
- A ultima aula valida e:
  259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md
- O H1 dessa aula e:
  # 259 — M11.15 — Docker para Java Backend: containers, imagens, Dockerfile e Docker Compose
- A aula 259 termina dizendo que a proxima aula deve ser sobre:
  Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend.

Sequencia real do curso:
- 000: abertura.
- M0: ambiente, ferramentas, Git, Maven, PostgreSQL, HTTP, Docker Desktop/WSL2 e rotina profissional.
- M1: fundamentos absolutos de Java.
- M2: Java Core profundo.
- M3: organizacao procedural.
- M4: orientacao a objetos e dominio.
- M5: Collections Framework.
- M6: Generics e Optional.
- M7: Functional Interfaces, lambdas e Streams.
- M8: Exceptions, I/O, CSV, datas e utilitarios modernos.
- M9: SOLID.
- M10: Design Patterns aplicados ao backend.
- M11 ate agora: ferramentas profissionais, JDK/JVM/JRE, Maven, Gradle, Git, IDE, JUnit 5, Mockito, AssertJ, TDD, JaCoCo, SonarQube e Docker.

Nao use as grades CSV antigas como fonte principal se elas divergirem dos arquivos reais. A fonte da verdade das aulas ja geradas sao os Markdown em docs/aulas.

Para aulas futuras, use como roteiro operacional:
- docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv
- docs/ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md

Proxima aula a gerar:
- Arquivo:
  260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md
- H1:
  # 260 — M11.16 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend
- Modulo:
  M11 — Ferramentas essenciais do Java Backend profissional
- Continuidade direta:
  A aula 259 ensinou Docker, container, imagem, Dockerfile, docker run, variaveis, volumes, redes, Docker Compose basico com app e PostgreSQL, logs, troubleshooting, boas praticas, seguranca e CI/CD. A aula 260 deve aprofundar Docker Compose profissional.

Direcao pedagogica da aula 260:
- Relembrar rapidamente que Docker Compose foi introduzido na aula 259.
- Aprofundar stack local de backend.
- Cobrir PostgreSQL, Redis, redes, volumes nomeados, bind mounts quando fizer sentido, variaveis de ambiente, .env sem segredo real, healthcheck, depends_on com condicao de saude quando aplicavel, logs, troubleshooting, nomes de servico, isolamento por rede, reset seguro de ambiente local e preparacao para Spring Boot.
- Nao entrar ainda em Spring Boot de forma profunda; apenas preparar terreno.
- Nao transformar Redis em modulo completo; explicar papel como cache/fila leve/sessao de forma introdutoria.
- Usar laboratorio em:
  labs/m11/aula-260-docker-compose-profissional
- Se houver codigo Java, usar pacote:
  br.com.curso.aula260
- Pode criar app Java simples apenas para ler variaveis e mostrar configuracoes de PostgreSQL/Redis, sem depender ainda de cliente Redis ou driver JDBC se isso deixar a aula pesada demais. Se usar dependencias, explique por que.

Padrao obrigatorio de escrita:
- Portugues brasileiro.
- Tom de mentor tecnico.
- A aula deve ser completa, pratica e progressiva, nao um resumo.
- Usar Markdown.
- Usar blocos de codigo com linguagens corretas: text, powershell, bash, java, xml, yaml, dockerfile, dockerignore, properties quando necessario.
- Manter a estrutura recente do M11:
  ## Objetivo da aula
  ## Reforco do objetivo maior
  # Parte 1 — ...
  # Parte 2 — ...
  ...
  ## Checklist da aula
  ## Registro rapido da aula
  # Parte final ou seções praticas com:
  - Exercício prático principal
  - Relatório da aula
  - Desafio extra
  - Simulado rápido
  - Gabarito
  - Commit recomendado
  - Fechamento

Regras de continuidade:
- Nao renomeie modulos antigos.
- Nao mude o padrao de numeracao.
- Nao crie aula 260 com assunto diferente.
- Nao pule para Spring Boot ainda.
- Nao use diretorios fora do padrao `labs/m11/aula-260-*`.
- Nao use nomes genericos como `meu-projeto` quando o curso vem usando nomes explicitos por aula.
- Nao commitar segredo real.
- Nao versionar target, build, out, .class, logs ou .env com senha real.
- Manter commits recomendados no padrao:
  git add labs/m11/aula-260-docker-compose-profissional
  git commit -m "Aula 260: docker compose profissional postgres redis healthcheck"

No final da aula 260, a ponte para a proxima aula deve continuar dentro de M11 e preparar o proximo passo natural apos Docker Compose profissional.

Roteiro reconciliado apos a aula 260:

```text
261 M11.17 CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos
262 M11.18 Pipeline Maven com testes, JaCoCo, relatorios e artefatos
263 M11.19 Pipeline Docker: build, tags, registry, secrets e imagem versionada
264 M11.20 Checkstyle, Spotless e formatacao automatizada com criterio
265 M11.21 Seguranca de dependencias: SCA, SBOM, Dependabot e supply chain
266 M11.22 Testcontainers com PostgreSQL: testes de integracao reais e descartaveis
267 M11.23 WireMock, contratos HTTP e servicos externos fake
268 M11.24 ArchUnit e regras arquiteturais automatizadas iniciais
269 M11.25 Mini-projeto ferramentas: Maven, testes, qualidade, Docker Compose e CI
270 M11.26 Fechamento do Modulo 11: ferramentas profissionais e transicao para SQL
```

Agora gere somente a aula 260 completa, no mesmo estilo das aulas anteriores, pronta para salvar no arquivo indicado. Nao gere varias aulas de uma vez.
```

## Prompt de verificacao antes de gerar novas aulas

Use este prompt se quiser obrigar o novo chat a confirmar que entendeu o ponto exato antes de produzir conteudo:

```text
Antes de gerar a proxima aula, responda apenas com:
1. Qual e o ultimo arquivo valido?
2. Qual e o proximo numero global?
3. Qual e o modulo atual?
4. Qual e o titulo da proxima aula?
5. Quais sao tres coisas que voce nao pode mudar para nao quebrar a continuidade?

Depois aguarde meu comando GERAR_AULA_260.
```
