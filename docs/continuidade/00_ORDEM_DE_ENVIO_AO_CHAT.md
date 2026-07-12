# Ordem de envio ao novo chat

Esta pasta e o pacote atual de continuidade do curso.

Use somente os arquivos desta pasta para atualizar o novo chat:

```text
docs/continuidade
```

## Estado auditado

Auditoria feita em 2026-07-12.

Resultado:

```text
Pasta de aulas reais:
docs/aulas

Arquivos Markdown encontrados:
474

Numeracao maxima encontrada:
474

Intervalo esperado:
000 a 474

Numero faltando:
398

Ultima aula real salva:
474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md

Proxima aula normal depois da 474:
475_M16_20_RABBITMQ_FUNDAMENTOS_OFICIAL.md
```

Regra decisiva:

```text
Antes de continuar para a aula 475, recuperar a aula 398.
```

## Sequencia obrigatoria de envio

Envie os arquivos nesta ordem:

1. `00_ORDEM_DE_ENVIO_AO_CHAT.md`

   Este arquivo. Define a ordem de leitura.

2. `01_LEIA_PRIMEIRO_FONTE_DA_VERDADE.md`

   Define o ponto atual real, a lacuna da aula 398 e a regra de retomada.

3. `02_AUDITORIA_ESTADO_ATUAL_POS_474.md`

   Mostra o que foi encontrado na auditoria de `docs/aulas`.

4. `03_PADRAO_EDITORIAL_AULA_V2.md`

   Define o formato editorial das aulas.

5. `06_FORMATO_OFICIAL_DAS_AULAS.md`

   Resume a estrutura obrigatoria de cada aula nova.

6. `04_GRADE_OPERACIONAL_ATUALIZADA_POS_474_COM_RECUPERACAO_398.csv`

   Grade operacional atualizada. Ela marca as aulas reais encontradas, marca a aula 398 como pendente de recuperacao e deixa 475 em diante como planejadas.

7. `05_INVENTARIO_AULAS_REAIS_DOCS_AULAS_POS_474.csv`

   Inventario dos arquivos reais existentes em `docs/aulas`.

8. `397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md`

   Aula anterior direta da aula faltante.

9. `399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md`

   Aula posterior direta da aula faltante. Ela confirma o que a aula 398 deveria ter entregue.

10. `474_M16_19_TESTES_DE_CONTRATO_OFICIAL.md`

    Ultima aula real salva. Ela sera usada depois da recuperacao da aula 398, para continuar para a aula 475.

11. `07_ROTEIRO_OPERACIONAL_CONTINUIDADE_POS_474.md`

    Roteiro macro atualizado da continuidade.

12. `08_PROMPT_MESTRE_NOVO_CHAT.md`

    Prompt principal para colar no novo chat.

13. `09_PROMPT_RECUPERAR_AULA_398.md`

    Prompt especifico para reconstruir a aula 398 ausente.

14. `10_PROMPT_CONTINUAR_AULA_475.md`

    Prompt para continuar para a aula 475 depois que a aula 398 for recuperada, salva e validada.

15. `11_MANIFESTO_ARQUIVOS_ENVIO_CHAT.csv`

    Manifesto resumido dos arquivos do pacote.

## Primeiro comando correto

Depois que o novo chat ler os arquivos, envie primeiro:

```text
GERAR_AULA_398_RECUPERACAO
```

Somente depois que a aula 398 for gerada, validada e salva em `docs/aulas`, envie:

```text
GERAR_AULA_475
```

## Regra contra perda de continuidade

O novo chat nao pode dizer que a proxima aula e simplesmente a 475 sem antes reconhecer a lacuna da aula 398.

O ponto correto e:

```text
Ultima aula real salva:
474

Lacuna real:
398

Primeira acao:
recuperar aula 398

Depois:
continuar aula 475
```
