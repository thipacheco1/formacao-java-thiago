# Roteiro operacional de continuidade pos-474

Este roteiro resume o caminho atual sem substituir a grade CSV.

A grade oficial atualizada desta pasta e:

```text
04_GRADE_OPERACIONAL_ATUALIZADA_POS_474_COM_RECUPERACAO_398.csv
```

## Estado atual

```text
Aulas reais em docs/aulas:
474

Numeracao maxima:
474

Lacuna:
398

Ultima aula salva:
474 - M16.19 - Testes de contrato

Proxima aula normal:
475 - M16.20 - RabbitMQ fundamentos
```

Regra:

```text
Recuperar 398 antes de gerar 475.
```

## Recuperacao obrigatoria

Arquivo:

```text
398_M14_43_HEALTH_READINESS_LIVENESS_OFICIAL.md
```

H1:

```text
# 398 - M14.43 - Health readiness liveness
```

Modulo:

```text
M14 - Spring Boot, REST APIs e backend profissional
```

Deve encaixar entre:

```text
397 - M14.42 - Observabilidade inicial com Actuator
399 - M14.44 - Dockerizando API Spring
```

Conteudo esperado:

```text
health groups;
liveness;
readiness;
ApplicationAvailability;
/actuator/health/liveness;
/actuator/health/readiness;
/livez;
/readyz;
diferenca entre reiniciar instancia e receber trafego;
probes operacionais em nivel conceitual;
sem Kubernetes profundo;
sem Dockerizacao, pois a aula 399 faz isso.
```

## Continuidade normal depois da recuperacao

Depois que a aula 398 for salva e validada:

```text
475_M16_20_RABBITMQ_FUNDAMENTOS_OFICIAL.md
# 475 - M16.20 - RabbitMQ fundamentos
```

A aula 475 deve conectar com:

```text
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md
# 474 - M16.19 - Testes de contrato
```

## Proximas aulas do M16

```text
475 M16.20 RabbitMQ fundamentos
476 M16.21 Exchanges queues bindings
477 M16.22 Producers consumers
478 M16.23 Retry e DLQ RabbitMQ
479 M16.24 Kafka fundamentos
480 M16.25 Topics partitions offsets
481 M16.26 Consumers producers Kafka
482 M16.27 RabbitMQ vs Kafka
483 M16.28 Eventos de dominio
484 M16.29 Schema evolution
485 M16.30 Schema Registry conceitual
486 M16.31 Poison message
487 M16.32 Deduplicacao
488 M16.33 Outbox Pattern
489 M16.34 Inbox Pattern
490 M16.35 Saga conceitual
491 M16.36 CDC conceitual
492 M16.37 Reprocessamento seguro
493 M16.38 Logs de correlacao em integracoes
494 M16.39 Monitoramento de integracoes
495 M16.40 Microsservicos vs monolito modular
496 M16.41 Projeto mensageria OS parte 1
497 M16.42 Projeto mensageria OS parte 2
498 M16.43 Projeto mensageria OS parte 3
499 M16.44 Projeto integracao API externa fake
500 M16.45 Revisao integracoes parte 1
```

## Diretriz de profundidade

O curso nao deve virar uma lista rasa de ferramentas.

Cada assunto deve manter:

```text
conceito;
motivacao;
risco real;
implementacao guiada;
validacao;
erros comuns;
commit;
ponte.
```

Mas tambem nao deve ficar excessivamente repetitivo.

Material complementar deve ficar separado.
