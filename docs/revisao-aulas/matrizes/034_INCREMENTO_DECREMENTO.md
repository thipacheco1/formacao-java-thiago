# Matriz de cobertura — Aula 034

## Identificação

- Aula original: `docs/aulas/034_M1_14_INCREMENTO_DECREMENTO_E_ACUMULADORES_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/033_M1_13_OPERADORES_LOGICOS_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/035_M1_15_IF_ELSE_IF_E_ELSE_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedIncrementDecrementLesson034.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedIncrementDecrementLesson.css`
- Arquétipo: oficina de contadores, acumuladores e incremento com CPU Step Simulator para pós/pré-incremento, registradora de esteira e clínica de erros
- Estado: implementada e auditada tecnicamente em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 033 abordou operadores lógicos para formular regras lógicas. A Aula 034 aborda como alterar e totalizar variáveis numéricas incrementalmente (contagem de eventos e acúmulo de totais).
- A Aula 035 introduzirá condicionais completas (`if-else-if`). A Aula 034 limita-se a aplicar o incremento ou decremento simples condicionados a estruturas de decisão lineares, sem aninhamentos complexos.
- Loops e estruturas de repetição (`while`, `for`) são citados conceitualmente, mas omitidos das implementações locais de codificação da aula.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Contagem de ocorrências (contadores) | Painel de Registradora Dinâmica | Contador de itens passando pela esteira mecânica. |
| Acúmulo de totais (acumuladores) | Painel de Registradora Dinâmica | Total de vendas acumulado a cada item inserido no carrinho. |
| Totalizadores (inteiros e BigDecimal) | Painel de Registradora Dinâmica | Demonstração e cálculo lado a lado de int vs BigDecimal. |
| Operador ++ (incremento) | Painel de Operações Abreviadas | Aluno clica em ++ e vê o valor da variável aumentar em 1. |
| Operador -- (decremento) | Painel de Operações Abreviadas | Aluno clica em -- e vê o valor da variável reduzir em 1. |
| Operador += (acumular) | Painel de Operações Abreviadas | Aluno seleciona um valor e acumula na variável original. |
| Operador -= (reduzir) | Painel de Operações Abreviadas | Aluno seleciona um valor e subtrai do saldo. |
| Pré-incremento vs Pós-incremento | CPU Step Simulator | CPU mostrando passo a passo onde o valor é copiado e quando ocorre o incremento. |
| Regra da formação: evitar ++ em expressões complexas | CPU Step Simulator | Destaque pedagógico enfatizando a clareza sobre escrita compacta. |
| Exemplo mínimo: IncrementoBasico | Galeria de Casos de Domínio | Código e console mostrando incremento simples. |
| Exemplo: ContadorPedidos | Galeria de Casos de Domínio | Código e console mostrando contagem de transações. |
| Exemplo: AcumuladorItens | Galeria de Casos de Domínio | Código e console acumulando quantidades inteiras. |
| Exemplo: AcumuladorPagamento (com BigDecimal) | Galeria de Casos de Domínio | Código acumulando double/BigDecimal com reatribuição. |
| Imutabilidade do BigDecimal e perigo de add sem atribuir | Painel de Registradora Dinâmica | Alerta visual e teste interativo de mutabilidade. |
| Exemplo ContagemPedidos (com if/else) | Galeria de Casos de Domínio | Código de triagem e contagem de aprovados/recusados. |
| Exemplo ControleEstoque | Galeria de Casos de Domínio | Código de adição e retirada de estoque de produtos. |
| Exemplo TentativasLogin (decremento) | Galeria de Casos de Domínio | Código reduzindo tentativas de acessos válidos. |
| Exemplo ContagemOs (com LocalDate) | Galeria de Casos de Domínio | Código calculando volume de prazos vencidos. |
| Exemplo ContagemAuditoria (repetição proposital) | Galeria de Casos de Domínio | Código contando múltiplos eventos no console. |
| Incremento em laços (conceito) | Painel teórico de fechamento | Demonstração do papel do incremento no encerramento de loops. |
| Clínica de 6 Erros Comuns | Clínica de Erros (6 abas) | Análise detalhada das 6 falhas, BigDecimal imutável, falta de inicialização e decremento negativo. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Instruções locais PowerShell de setup, compilação de 10 classes e commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 10 códigos e consoles locais foram catalogados sob a Galeria de Casos de Domínio, evitando duplicações textuais ao longo das páginas.
- A explicação técnica de pré e pós-incremento foi centralizada e simplificada no CPU Step Simulator.

## Lacunas resolvidas

- O simulador passo a passo da CPU demonstra fisicamente o valor original sendo retido antes do incremento no pós-incremento, esclarecendo a clássica confusão do porquê `y = x++` resulta em valores diferentes de `y = ++x`.
- A imutabilidade de BigDecimal é demonstrada pelo resultado observável: chamar `.add` sem guardar o retorno deixa a variável com o valor anterior.
