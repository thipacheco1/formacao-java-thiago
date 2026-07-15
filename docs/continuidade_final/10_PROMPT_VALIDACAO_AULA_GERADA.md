# Prompt de validacao de aula gerada

Use este checklist a cada nova aula antes de pedir a proxima.

## Validacao obrigatoria

Para a aula gerada, confirmar:

```text
1. O arquivo tem o numero correto.
2. O H1 tem o numero, codigo e titulo corretos.
3. A aula conecta com a aula anterior imediata.
4. A ponte final aponta para a proxima aula correta.
5. O escopo nao antecipa assuntos futuros.
6. O tamanho esta dentro do esperado ou justificado.
7. O material complementar esta separado.
8. Nao existem blocos de codigo com linha iniciada por ##.
9. package e import em Java nao estao quebrados em duas linhas.
10. Nao ha renumeracao nem mudanca de modulo.
11. Se houver laboratorio, existe commit recomendado.
12. A aula mantem profundidade tecnica sem virar checklist gigante.
```

## Scripts locais

Depois de salvar a aula em `docs/aulas`, rodar:

```powershell
.\docs\continuidade_final\scripts\validar_sequencia_aulas.ps1
```

Para validar a aula especifica:

```powershell
.\docs\continuidade_final\scripts\validar_aula_nova.ps1 `
  -Numero 636
```

Troque o numero conforme a aula.

## Regra de continuidade

Se qualquer validacao falhar, nao pedir a proxima aula.

Primeiro corrigir a aula atual.
