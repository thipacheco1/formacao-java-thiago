# Matriz de preservação — Aula 095

## Identificação

- Aula: `095 — M3.06 — Métodos de cálculo`
- Fonte: `docs/aulas/095_M3_06_METODOS_DE_CALCULO_OFICIAL.md`
- Experiência: `plataforma-curso/src/components/GuidedCalculationMethodsLesson095.jsx`
- Estilos: `plataforma-curso/src/components/guidedCalculationMethodsLesson.css`
- Validador: `tools/validate-lesson-095.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Preservação pedagógica

Todo conteúdo original foi preservado: métodos de cálculo previsíveis, separação entre calcular e exibir, retorno sem efeito colateral, tipos primitivos, divisão inteira, `double`, dinheiro com `BigDecimal`, imutabilidade, `compareTo`, arredondamento, contratos de entrada, tratamento de erros, exemplos completos, testes manuais, atividade, desafio de comissão, depuração no IntelliJ, perguntas de estudo, Git e critérios de entrega.

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Contrato do Cálculo | entrada, regra, retorno e efeitos | método previsível como caixa transparente |
| Calcular sem Exibir | regra separada de `println` | reutilização em console, API e banco |
| Primitivos e Divisão | simulador de média inteira e decimal | `7 + 8`, divisor `2` versus `2.0` |
| Dinheiro com BigDecimal | pipeline monetário em cinco passos | bruto, desconto, final e arredondamento |
| Pré-condições | cinco contratos defensivos | falhas claras antes da fórmula |
| Desafio de Comissão | vendas ajustáveis e duas faixas | 2% abaixo de 10 mil e 5% a partir do limite |
| Testes e Debug | suíte manual e mock do IntelliJ | breakpoint, Step Into e Variables |
| Clínica de Erros | oito diagnósticos | sintoma, causa e correção |
| Entrega & Desafio | terminal, checklist e evidências | quatro programas compilados e executados |

## Profundidade e interface

- Quatro programas Java completos: cálculo básico, pedido monetário, testes manuais e comissão.
- O simulador de divisão mostra a truncagem antes de trocar para a operação decimal.
- O pipeline monetário evidencia as cinco transformações sem esconder escala ou arredondamento.
- O desafio de comissão devolve o valor e mantém a exibição fora da regra.
- O mock do IntelliJ orienta breakpoint, `Step Into`, `Variables` e leitura da pilha sem fingir uma captura real do produto.
- Nove etapas, cabeçalho compacto, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Prism, cópia, simuladores, diagrama de fluxo, clínica responsiva e evidência de terminal.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, estrutura, cobertura, responsividade e compila as quatro fontes.
- Executa os quatro programas e confere exatamente os resultados básicos, monetários, testes e comissão.
- Lint e `git diff --check`; build completo coberto pela Aula 091.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 096 continua com métodos de exibição.
