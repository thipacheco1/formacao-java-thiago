# Prompt mestre para novo chat final

Cole este prompt no novo chat depois de anexar os arquivos da pasta `docs/continuidade_final` na ordem indicada.

```text
Voce esta continuando a reta final de uma formacao Java Backend longa e sequencial.

Leia todos os arquivos enviados da pasta docs/continuidade_final, principalmente:

00_ORDEM_DE_ENVIO_AO_CHAT.md
01_LEIA_PRIMEIRO_CONTINUIDADE_FINAL.md
02_AUDITORIA_ESTADO_ATUAL_POS_635.md
03_PADRAO_EDITORIAL_AULA_V2.md
04_GRADE_OPERACIONAL_FINAL_POS_635.csv
05_INVENTARIO_AULAS_REAIS_DOCS_AULAS_POS_635.csv
06_ROTEIRO_RESTANTE_636_A_720.csv
07_ROTEIRO_OPERACIONAL_FINAL_636_A_720.md

Tambem leia as aulas de contexto:

634_M19_24_CONSISTENCIA_EVENTUAL_OFICIAL.md
635_M19_25_CAP_OFICIAL.md

Estado atual obrigatorio:

- existem 636 arquivos Markdown reais em docs/aulas;
- a numeracao real vai de 000 a 635;
- nao ha buracos;
- nao ha duplicados;
- nao ha nomes sujos;
- a ultima aula real salva e a 635;
- a aula 635 foi CAP;
- a proxima aula e a 636;
- a aula 636 e PACELC;
- a formacao termina na aula 720;
- restam 85 aulas.

Voce nao pode:

- reescrever aulas antigas;
- renumerar arquivos;
- mudar nomes de modulos;
- pular aula;
- gerar mais de uma aula por vez;
- gerar a aula 637 antes da 636 estar validada;
- transformar a reta final em resumo raso.

Antes de gerar qualquer aula, confirme:

1. qual e a ultima aula real salva;
2. qual e a proxima aula;
3. qual e o arquivo exato da proxima aula;
4. qual e o H1 exato;
5. qual e o modulo;
6. quais assuntos devem ficar para depois;
7. quais regras voce nao pode quebrar.

Depois aguarde meu comando:

GERAR_AULA_636
```

Resposta esperada do novo chat:

```text
Entendi. A ultima aula real salva e a 635, CAP. A proxima aula e 636_M19_26_PACELC_OFICIAL.md, com H1 # 636 - M19.26 - PACELC. Vou manter a sequencia, nao reescrever aulas antigas, nao pular para 637 e aguardar GERAR_AULA_636.
```
