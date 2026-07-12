# Auditoria do estado atual pos-474

Esta auditoria foi feita para evitar que o novo chat continue de forma errada.

## Resultado da pasta docs/aulas

```text
Total de arquivos Markdown:
474

Menor numero:
000

Maior numero:
474

Numero faltante:
398

Numeros duplicados:
nenhum

Nomes com (1), (2) ou .md.md:
nenhum apos correcao do arquivo 388
```

## Correcao feita durante a auditoria

O arquivo:

```text
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL(1).md
```

foi normalizado para:

```text
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md
```

Isso foi necessario para evitar quebra de sequencia e confusao no proximo chat.

## Lacuna encontrada

O arquivo da aula 398 nao foi encontrado.

Arquivo esperado:

```text
398_M14_43_HEALTH_READINESS_LIVENESS_OFICIAL.md
```

H1 esperado:

```text
# 398 - M14.43 - Health readiness liveness
```

Status na grade:

```text
PENDENTE_RECUPERACAO_ARQUIVO_AUSENTE
```

## Evidencias da aula 398

A aula 397 termina apontando para:

```text
398 - M14.43 - Health readiness/liveness
```

A aula 399 abre dizendo que a aula 398 ja teria separado:

```text
/actuator/health/liveness
/actuator/health/readiness
/livez
/readyz
```

e que as decisoes ficaram:

```text
liveness:
a instancia precisa ser reiniciada?

readiness:
a instancia pode receber trafego?
```

Logo, a aula 398 deve ser reconstruida exatamente nesse encaixe.

## Estado por modulo relevante

M14:

```text
356 a 397:
geradas

398:
ausente, precisa recuperacao

399 a 410:
geradas
```

M15:

```text
411 a 455:
geradas
```

M16:

```text
456 a 474:
geradas

475 em diante:
planejadas
```

## Proxima acao correta

Primeiro:

```text
GERAR_AULA_398_RECUPERACAO
```

Depois de salvar e validar a aula 398:

```text
GERAR_AULA_475
```

## Arquivos de contexto copiados para esta pasta

Para recuperar a aula 398:

```text
397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md
399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md
```

Para continuar depois da recuperacao:

```text
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md
```
