# Prompt para recuperar a aula 398

Use este prompt somente depois que o novo chat confirmar que entendeu a fonte da verdade.

Comando:

```text
GERAR_AULA_398_RECUPERACAO
```

Prompt:

```text
Gere somente a aula 398 ausente.

Arquivo exato:
398_M14_43_HEALTH_READINESS_LIVENESS_OFICIAL.md

H1 exato:
# 398 - M14.43 - Health readiness liveness

Modulo:
M14 - Spring Boot, REST APIs e backend profissional

Contexto anterior:
397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md

Contexto posterior:
399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md

Objetivo da aula:
ensinar health readiness/liveness no Spring Boot Actuator, separando corretamente sinal de vida da instancia e sinal de prontidao para receber trafego.

A aula 397 deixou claro que a aula 398 deveria tratar:
- grupos de health;
- readiness;
- liveness;
- probes;
- ApplicationAvailability;
- indicadores de saude em nivel operacional;
- sem configuracao Kubernetes profunda;
- sem Dockerizacao.

A aula 399 abre assumindo que a aula 398 ja entregou:
- /actuator/health/liveness;
- /actuator/health/readiness;
- /livez;
- /readyz;
- liveness pergunta se a instancia precisa ser reiniciada;
- readiness pergunta se a instancia pode receber trafego.

Portanto a aula 398 deve terminar exatamente preparada para a aula 399.

Escopo obrigatorio:
- explicar health endpoint basico;
- explicar health groups;
- explicar liveness;
- explicar readiness;
- explicar ApplicationAvailability;
- configurar exposure segura somente para o necessario;
- criar endpoints/aliases /livez e /readyz se fizer sentido no padrao do projeto;
- testar manualmente com chamadas HTTP;
- explicar o que cada status significa;
- explicar erros comuns;
- recomendar commit;
- fechar com ponte para Dockerizando API Spring.

Nao fazer:
- nao entrar em Kubernetes profundo;
- nao ensinar Dockerfile;
- nao dockerizar a API;
- nao criar compose;
- nao antecipar observabilidade avancada;
- nao criar testes completos;
- nao reescrever aula 397;
- nao reescrever aula 399;
- nao mudar numeracao.

Formato:
- seguir PADRAO_EDITORIAL_AULA_V2;
- seguir FORMATO_OFICIAL_DAS_AULAS;
- aula principal focada em aprender, executar e entender;
- material complementar separado;
- codigo copiavel;
- nao quebrar package/import em duas linhas;
- nao colocar linha iniciada por ## dentro de bloco de codigo;
- evitar excesso de paragrafos de uma linha;
- manter profundidade profissional.

Tamanho alvo:
4.800 a 5.800 palavras.

Gere a aula completa em Markdown.
```

## Validacao esperada

Depois que a aula for gerada, validar:

```text
Nome do arquivo correto.
H1 correto.
Conecta com aula 397.
Prepara aula 399.
Nao antecipa Dockerizacao.
Nao entra em Kubernetes profundo.
Possui pratica guiada.
Possui commit.
Possui ponte para 399.
```
