# Ordem de envio ao novo chat

Esta pasta e o pacote atual de continuidade final do curso.

Use somente os arquivos desta pasta para atualizar o novo chat:

```text
docs/continuidade_final
```

## Estado auditado

Auditoria feita em 2026-07-14.

Resultado:

```text
Pasta de aulas reais:
docs/aulas

Arquivos Markdown encontrados:
636

Numeracao real:
000 a 635

Numeros faltando:
nenhum

Numeros duplicados:
nenhum

Nomes sujos:
nenhum

Ultima aula real salva:
635_M19_25_CAP_OFICIAL.md

Proxima aula:
636_M19_26_PACELC_OFICIAL.md

Ultima aula planejada do curso:
720_M20_50_FECHAMENTO_DA_FORMACAO_OFICIAL.md

Aulas restantes:
85
```

## Sequencia obrigatoria de envio

Envie os arquivos nesta ordem:

1. `00_ORDEM_DE_ENVIO_AO_CHAT.md`

   Este arquivo. Define a ordem de leitura.

2. `01_LEIA_PRIMEIRO_CONTINUIDADE_FINAL.md`

   Define o estado real validado e a proxima aula.

3. `02_AUDITORIA_ESTADO_ATUAL_POS_635.md`

   Registra a auditoria de `docs/aulas`.

4. `03_PADRAO_EDITORIAL_AULA_V2.md`

   Mantem o padrao editorial atual das aulas.

5. `04_GRADE_OPERACIONAL_FINAL_POS_635.csv`

   Grade operacional atualizada. Marca `000` a `635` como geradas e `636` a `720` como planejadas.

6. `05_INVENTARIO_AULAS_REAIS_DOCS_AULAS_POS_635.csv`

   Inventario dos arquivos reais existentes em `docs/aulas`.

7. `06_ROTEIRO_RESTANTE_636_A_720.csv`

   Roteiro compacto somente das aulas restantes.

8. `634_M19_24_CONSISTENCIA_EVENTUAL_OFICIAL.md`

   Aula anterior de contexto imediato antes de CAP.

9. `635_M19_25_CAP_OFICIAL.md`

   Ultima aula real salva. Ela faz a ponte direta para PACELC.

10. `07_ROTEIRO_OPERACIONAL_FINAL_636_A_720.md`

    Roteiro macro da reta final.

11. `08_PROMPT_MESTRE_NOVO_CHAT_FINAL.md`

    Prompt principal para colar no novo chat.

12. `09_PROMPT_GERAR_AULA_636.md`

    Prompt especifico da proxima aula.

13. `10_PROMPT_VALIDACAO_AULA_GERADA.md`

    Checklist para validar cada aula nova antes de seguir.

14. `11_MANIFESTO_ARQUIVOS_ENVIO_CHAT.csv`

    Manifesto resumido dos arquivos do pacote.

15. `scripts/`

    Scripts locais de validacao.

## Primeiro comando correto

Depois que o novo chat confirmar que entendeu o pacote, envie:

```text
GERAR_AULA_636
```

## Regra de ouro

Nao gerar aula 637 antes da aula 636 ser validada e salva.

Depois de cada aula nova:

```text
1. salvar em docs/aulas;
2. validar arquivo, H1, escopo, tamanho e ponte;
3. checar sequencia;
4. somente entao pedir a proxima aula.
```
