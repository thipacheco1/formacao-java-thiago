# Leia primeiro

Voce esta recebendo a fonte da verdade atualizada para continuar uma formacao Java Backend longa e sequencial.

O objetivo do curso continua sendo formar um aluno do zero ate um nivel profissional extremo de backend Java, com base solida, Spring, dados, seguranca, integracoes, mensageria, arquitetura, DevOps, producao e defesa tecnica.

## Estado atual real

Auditoria feita em:

```text
2026-07-12
```

Pasta auditada:

```text
docs/aulas
```

Resultado:

```text
Aulas reais encontradas:
474 arquivos Markdown

Numeracao encontrada:
000 a 474

Numero ausente:
398

Duplicados:
nenhum

Nomes sujos:
nenhum apos normalizacao da aula 388
```

## Ponto atual

A ultima aula real salva e:

```text
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md

# 474 - M16.19 - Testes de contrato
```

A proxima aula normal do roteiro seria:

```text
475_M16_20_RABBITMQ_FUNDAMENTOS_OFICIAL.md

# 475 - M16.20 - RabbitMQ fundamentos
```

Mas existe uma lacuna real:

```text
398_M14_43_HEALTH_READINESS_LIVENESS_OFICIAL.md

# 398 - M14.43 - Health readiness liveness
```

Essa aula nao existe em `docs/aulas`.

## Regra obrigatoria

Antes de gerar a aula 475, recuperar a aula 398.

Nao trate a aula 398 como detalhe menor.

Ela fica no M14, entre:

```text
397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md
399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md
```

A aula 397 aponta explicitamente para a 398.

A aula 399 abre dizendo que, na aula 398, o aluno separou:

```text
/actuator/health/liveness
/actuator/health/readiness
/livez
/readyz

liveness:
a instancia precisa ser reiniciada?

readiness:
a instancia pode receber trafego?
```

Portanto a aula 398 deve ser reconstruida para casar exatamente com essa ponte.

## Nao fazer

Nao reescrever aulas antigas.

Nao renumerar arquivos.

Nao renomear modulos.

Nao pular a recuperacao da aula 398.

Nao transformar a aula 398 em Kubernetes profundo.

Nao transformar a aula 398 em Dockerizacao. Dockerizacao ja esta na aula 399.

Nao continuar para RabbitMQ sem antes resolver a lacuna.

## Depois da recuperacao

Quando a aula 398 for gerada, salva e validada, a continuidade normal volta para:

```text
475_M16_20_RABBITMQ_FUNDAMENTOS_OFICIAL.md

# 475 - M16.20 - RabbitMQ fundamentos
```

Modulo:

```text
M16 - Integracoes, mensageria, eventos e resiliencia
```

A aula 475 deve conectar com:

```text
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md
```

e iniciar mensageria com RabbitMQ sem antecipar toda a profundidade de Kafka, outbox, saga, CDC ou projeto final.
