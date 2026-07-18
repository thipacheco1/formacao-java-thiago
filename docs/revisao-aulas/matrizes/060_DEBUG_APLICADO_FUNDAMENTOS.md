# Matriz de cobertura — Aula 060

## Identificação

- Original: `060_M1_40_DEBUG_APLICADO_AOS_FUNDAMENTOS_OFICIAL.md`
- Componente: `GuidedFundamentalsDebugLesson060.jsx`
- Estilo: `guidedFundamentalsDebugLesson.css`
- Arquétipo: laboratório de IntelliJ com execução, estado, chamadas, hipóteses, domínios, clínica e entrega
- Cobertura: 100%

## Transformação observável

O aluno reproduz um comportamento, pausa antes da decisão, controla a execução, confronta esperado e observado em diferentes painéis, acompanha chamadas e retornos e corrige uma hipótese por ciclo.

## Cobertura do original

| Conteúdo | Destino | Evidência |
|---|---|---|
| Conceito, finalidade e vocabulário de debug | Etapa 1 | Interface sincroniza linha, estado e saída |
| Preparação no IntelliJ, Debug versus Run e atalhos | Etapa 1 e Entrega | Mock identificado, ações F7/F8/F9/Shift+F8 e alternativa Ctrl+Shift+A |
| Breakpoint pausa antes da linha | Etapa 1 | Gutter e linha atual visualmente distintos |
| Debug como aprendizagem, não só correção | Todas as simulações | Estado explicado mesmo no caminho correto |
| If, normalização, true e false | Etapa 1 + Clínica | Variável crua, normalizada e Watch da condição |
| Step Over, Into, Out e Resume | Etapa 2 | Controles operáveis e Call Stack variável |
| Método, parâmetro e retorno | Etapa 2 | `calcularTotal → main`, retorno 60 |
| For, índice, acumulador e array | Etapas 2 e 3 | Totais 0→10→30→60 |
| Busca linear e retorno antecipado | Etapa 3 e matriz de transferência | Método de arrays explicitamente relacionado ao mesmo protocolo |
| Matriz e laços aninhados | Etapa 3 | linha, coluna, célula e total em quatro frames |
| Passagem de primitivo | Etapa 4 | parâmetro local 99, main 10 |
| Mutação de array | Etapa 4 | conteúdo compartilhado muda para 99 |
| String sem retorno e correção | Etapa 4 + programa completo | normalização retorna nova String e é atribuída |
| Try/catch e InputMismatchException | Etapa 5 | abc → catch → limpeza → 10 → return |
| Variables | Etapas 1–6 | Variáveis por escopo em todos os frames |
| Watches | Etapas 1–6 | Condições, índice, célula e expressão de domínio |
| Evaluate Expression | Etapa 6 | Normalização, divisão e acesso ao array |
| Call Stack | Etapas 2, 4, 5 e 6 | Cadeia atual e chamadores |
| Pedido, produto, pagamento, OS, mensageria e auditoria | Galeria de Domínios | Cadeia, evidência e variação por cenário |
| Diagnóstico por reprodução, breakpoint e uma hipótese | Clínica e desafio | Dez antipadrões com próxima prova |
| Dez erros comuns | Clínica | Dez casos navegáveis e legíveis |
| 23 arquivos e três defeitos sugeridos | Simulações, programa e desafio | Competências consolidadas sem repetição mecânica |
| Checklist de dez perguntas | Evidências e desafio | breakpoint, motivo, variáveis, esperado, real, fluxo, método, retorno, resultado e conclusão |
| Git, diário e `.class` | Entrega | status, diff, staged, commit e árvore limpa |
| Limites: remoto, conditional breakpoint, watch avançado, threads e profiler | Escopo | Não antecipados |

## Consolidações sem perda

- Exemplos repetitivos viraram cinco sessões executáveis: decisão, método, coleções, memória e exceção.
- Os seis contextos de backend permanecem numa galeria orientada por hipótese e evidência.
- Três arquivos de defeito foram consolidados num desafio com normalização ausente e acumulador no escopo errado.
- O programa completo compila e permite praticar String retornada, laço, retorno e mutação antes do desafio.

## Verificações

- Nove etapas com renderizadores válidos.
- Seis domínios e dez erros.
- Programa Java compilável.
- Clínica legível e horizontal no celular.
- Interface refluindo até 320px sem romper a moldura.
- Lint e build aprovados.
