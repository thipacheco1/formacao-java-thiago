# Matriz de cobertura — Aula 113 — Imutabilidade aplicada

## Fonte auditada

- `docs/aulas/113_M4_09_IMUTABILIDADE_APLICADA_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Mutabilidade versus imutabilidade | Comparador de quatro modelos | Mutável livre, encapsulado, imutável e decisão |
| Benefícios | Faixa de quatro consequências | Debug, testes, efeitos colaterais e concorrência |
| Cliente mutável problemático | Editor de estado e fonte integral | `ClienteMutavelProblematico.java` |
| Primeiro modelo imutável | Fluxo visual A → construtor → B | `ClienteImutavel.java` e `comEmail` |
| Papel de `final` | Simulação de referência e conteúdo | Lista final ainda aceita `clear()` |
| Tipos imutáveis do JDK | Seletor String, LocalDate, BigDecimal e Instant | Original e novo valor lado a lado |
| Objeto de valor Dinheiro | Calculadora e código completo | Soma e desconto retornam novos objetos |
| Email como valor | Normalização, domínio e validação | `EmailImutavel.java` |
| Valor versus entidade | Classificador de cinco conceitos | Identidade, ciclo de vida e clareza |
| Pagamento imutável | Linha do tempo de três referências | Retorno guardado versus ignorado |
| Trade-offs | Benefícios e custos no mesmo painel | Mais objetos e risco de perder retorno |
| Quando aceitar mutabilidade | Produto e OS classificados | Mutação encapsulada continua válida |
| Record imutável | Fonte com construtor compacto | `PeriodoAgendamentoRecord.java` |
| Imutabilidade não substitui modelagem | Quatro perguntas de decisão | Valor, identidade, ciclo e clareza |
| Debug | Mock de IDE em oito pausas | Original, construtor, retorno e referências |
| Sete erros comuns | Clínica integral | Sintoma, causa e correção por caso |
| Desafio Telefone | Contrato, fonte e sete testes | `TelefoneImutavel.java` e `TesteImutabilidade.java` |
| Registro e Git | Defesa oral, checklist e comandos | Aula 114 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de comparação de modelos, defeito mutável, cópia imutável, profundidade de `final`, tipos JDK, objetos de valor, estados versionados, record, critério, debug, clínica e entrega.

## Decisões pedagógicas

- A “mudança” é mostrada como criação, retorno e escolha de referência, evitando que `comEmail` pareça um setter sofisticado.
- O limite de `final` é executável, com referência fixa e conteúdo mutável separados visualmente.
- Objetos de valor e entidades são classificados antes de qualquer recomendação universal.
- O erro de ignorar retorno aparece no simulador de Pagamento, com o estado original permanecendo PENDENTE.
- Nove fontes usam destaque estilo IDE e são compiladas pelo validador dedicado.

## Artefatos

- `plataforma-curso/src/components/GuidedImmutabilityLesson113.jsx`
- `plataforma-curso/src/components/guidedImmutabilityLesson.css`
- `tools/validate-lesson-113.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: nove fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
