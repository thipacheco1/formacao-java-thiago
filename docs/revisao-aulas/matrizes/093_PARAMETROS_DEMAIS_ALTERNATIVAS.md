# Matriz de preservação — Aula 093

## Identificação

- Aula: `093 — M3.04 — Parâmetros demais e alternativas`
- Fonte integral: `docs/aulas/093_M3_04_PARAMETROS_DEMAIS_E_ALTERNATIVAS_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedParameterObjectsLesson093.jsx`
- Estilos: `plataforma-curso/src/components/guidedParameterObjectsLesson.css`
- Validador: `tools/validate-lesson-093.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado na oficina de contratos agrupados. A experiência mantém definição e cheiro de parâmetros demais, casos aceitáveis, escala sem número mágico, risco de ordem entre tipos iguais, sete alternativas, exemplo ruim, refatoração incremental para `PedidoEntrada` e `ResumoPedido`, leitura crítica, seis domínios completos, quando não criar record, método ainda pouco coeso, ponte para objeto futuro, oito erros, debug, atividade, Git e critérios.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Cheiro, não Proibição | escala 0–5+ e julgamento | medidor selecionável e seis riscos | quantidade tratada como alerta, não lei |
| 2. Ordem Perigosa | parâmetros do mesmo tipo | chamada de auditoria corrigível | erro compila e altera significado |
| 3. Sete Alternativas | nomes, divisão, variáveis, records, fluxo e enum | seletor das sete respostas possíveis | record deixa de ser reação automática |
| 4. Record de Entrada | `PedidoEntrada` | mapa quatro valores → um conceito e fonte completa | validação e cálculo recebem o record |
| 5. Record de Resultado | `ResumoPedido` | comparação integral ruim/final | sete linhas exatamente equivalentes |
| 6. Quando não Agrupar | record genérico, artificial e coesão falsa | quatro casos com julgamento | conceito de domínio obrigatório |
| 7. Seis Domínios | cliente, produto, pagamento, OS, mensageria e auditoria | galeria com seis programas completos | records e enums específicos |
| 8. Clínica de Erros | oito falhas da fonte | diagnóstico com sintoma e correção | oito casos íntegros e navegáveis |
| 9. Entrega & Desafio | compilação, debug, evidências e Git | terminal, breakpoints, checklist e README | nove fontes compiladas e equivalência executada |

## Decisões de profundidade

- A escala de quantidade orienta revisão, sem virar regra mecânica.
- O risco entre três `String` é demonstrado como erro sem proteção do compilador.
- As sete alternativas aparecem antes do record para preservar julgamento técnico.
- Entrada e resultado recebem tipos distintos, evitando misturar dados informados e calculados.
- `PedidoComRecordEntrada` permanece como estado intermediário intencional.
- `PedidoComResumo` é compilável e preserva as sete linhas de `ParametrosDemaisRuim`.
- Os seis domínios usam records e enums nomeados; nenhum `Dados(a,b,c)` é apresentado como solução.
- Record reduz argumentos, mas a aula mantém explícito que não corrige falta de coesão.

## Padrões de interface

- Cabeçalho compacto, fatos compartilhados e nove etapas.
- Roteiro `sticky` no desktop e item ativo focado no trilho mobile.
- Troca de etapa ancora em `.guided-layout`.
- Concluir/desmarcar, portão de etapa e portão curricular para a Aula 094.
- Código completo com Prism, linhas, quebra segura e cópia.
- Medidor, simulação de ordem, alternativas e mapas de record.
- Clínica usa círculo numérico restrito e `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota dedicada para `093_`.
- Nove etapas, seis faixas, sete alternativas, quatro casos, seis domínios e oito erros.
- Progresso filtrado, normalização antiga, foco mobile, âncora e portões.
- Presença de cheiro de código, ordem, tipos iguais, record genérico, coesão, enum, `BigDecimal`, `LocalDate`, `Instant` e debug.
- Extração e compilação das nove fontes Java.
- Comparação exata de `ParametrosDemaisRuim` e `PedidoComResumo`.
- Lint e `git diff --check`; build de produção segue a validação completa da Aula 091.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de virar referência aprovada.
- A Aula 094 aprofunda retorno boolean para validação.
