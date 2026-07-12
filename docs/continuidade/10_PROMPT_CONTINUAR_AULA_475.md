# Prompt para continuar na aula 475

Use este prompt somente depois que a aula 398 tiver sido recuperada, salva em `docs/aulas` e validada.

Comando:

```text
GERAR_AULA_475
```

Prompt:

```text
Agora continue a formacao normalmente a partir da aula 475.

Antes de gerar, confirme que:
- a aula 398 foi recuperada;
- a numeracao 000 a 474 esta completa;
- a ultima aula real salva continua sendo a 474;
- a proxima aula agora e a 475.

Gere somente:

Arquivo:
475_M16_20_RABBITMQ_FUNDAMENTOS_OFICIAL.md

H1:
# 475 - M16.20 - RabbitMQ fundamentos

Modulo:
M16 - Integracoes, mensageria, eventos e resiliencia

Contexto anterior:
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md

Objetivo da aula:
introduzir RabbitMQ como broker de mensagens, explicando o problema que mensageria resolve em integracoes backend, sem ainda aprofundar exchanges, bindings, retry, DLQ, Kafka, outbox, saga ou CDC.

Escopo da aula 475:
- problema de comunicacao assincrona entre sistemas;
- diferenca entre chamada HTTP direta e mensagem;
- papel de broker;
- RabbitMQ em nivel fundamental;
- producer;
- consumer;
- queue;
- ack conceitual;
- durabilidade em nivel introdutorio;
- quando usar e quando nao usar RabbitMQ;
- laboratorio simples e guiado;
- validacao manual;
- commit recomendado;
- ponte para a aula 476 Exchanges queues bindings.

Nao antecipar:
- exchanges em profundidade;
- bindings em profundidade;
- retry e DLQ;
- Kafka;
- outbox;
- inbox;
- saga;
- CDC;
- projeto de mensageria final;
- monitoramento avancado.

Formato:
- seguir PADRAO_EDITORIAL_AULA_V2;
- seguir FORMATO_OFICIAL_DAS_AULAS;
- aula principal objetiva, pratica e explicativa;
- material complementar separado;
- codigo copiavel;
- nao quebrar package/import em duas linhas;
- nao colocar linha iniciada por ## dentro de bloco de codigo;
- nao criar simulado longo;
- nao criar checklist gigante na aula principal.

Tamanho alvo:
4.800 a 5.800 palavras.

Gere a aula completa em Markdown.
```
