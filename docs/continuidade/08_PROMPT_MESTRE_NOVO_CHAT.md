# Prompt mestre para o novo chat

Cole este prompt no novo chat depois de anexar os arquivos da pasta `docs/continuidade` na ordem indicada.

```text
Voce esta continuando uma formacao Java Backend longa e sequencial.

Antes de gerar qualquer aula, leia todos os arquivos enviados da pasta docs/continuidade, principalmente:

00_ORDEM_DE_ENVIO_AO_CHAT.md
01_LEIA_PRIMEIRO_FONTE_DA_VERDADE.md
02_AUDITORIA_ESTADO_ATUAL_POS_474.md
03_PADRAO_EDITORIAL_AULA_V2.md
04_GRADE_OPERACIONAL_ATUALIZADA_POS_474_COM_RECUPERACAO_398.csv
05_INVENTARIO_AULAS_REAIS_DOCS_AULAS_POS_474.csv
06_FORMATO_OFICIAL_DAS_AULAS.md
07_ROTEIRO_OPERACIONAL_CONTINUIDADE_POS_474.md

Tambem leia as aulas de contexto:

397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md
399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md

Estado atual obrigatorio:

- existem 474 arquivos Markdown reais em docs/aulas;
- a numeracao vai de 000 a 474;
- a aula 398 esta ausente;
- nao ha duplicados;
- a aula 388 ja foi normalizada sem (1);
- a ultima aula real salva e a 474;
- a proxima aula normal seria a 475;
- porem a primeira acao obrigatoria e recuperar a aula 398.

Voce nao pode pular a aula 398.

Voce nao pode reescrever as aulas 399 a 474.

Voce nao pode renumerar arquivos.

Voce nao pode mudar nomes de modulos.

Voce deve confirmar, antes de gerar qualquer aula:

1. qual e a ultima aula real salva;
2. qual e a lacuna encontrada;
3. qual e o primeiro arquivo que deve ser gerado;
4. qual e a proxima aula normal depois da recuperacao;
5. quais regras voce nao pode quebrar.

Primeiro aguarde meu comando:

GERAR_AULA_398_RECUPERACAO

Somente depois que a aula 398 for gerada, validada e salva em docs/aulas, poderei pedir:

GERAR_AULA_475
```

## Resposta esperada do novo chat

O novo chat deve responder algo nesta linha:

```text
Entendi. A ultima aula real salva e a 474, mas existe a lacuna da aula 398. Antes de continuar para a aula 475, devo reconstruir a aula 398 usando a aula 397 como entrada e a aula 399 como confirmacao da saida esperada. Vou aguardar GERAR_AULA_398_RECUPERACAO.
```

Se o chat disser que a proxima aula e 475 sem mencionar a lacuna 398, ele nao entendeu o pacote.
