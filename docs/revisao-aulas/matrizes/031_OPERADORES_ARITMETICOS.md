# Matriz de cobertura — Aula 031

## Identificação

- Aula original: `docs/aulas/031_M1_11_OPERADORES_ARITMETICOS_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/030_M1_10_ENTRADA_DE_DADOS_COM_SCANNER_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/032_M1_12_OPERADORES_RELACIONAIS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedArithmeticOperatorsLesson031.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedArithmeticOperatorsLesson.css`
- Arquétipo: oficina de operadores aritméticos com árvore de precedência visual, simulação de quebra de lotes e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 030 estabeleceu o Scanner para leitura dinâmica. A Aula 031 avança transformando esses dados estáticos em operações lógicas por meio de operadores aritméticos básicos.
- A Aula 032 introduzirá os operadores relacionais (comparações). A Aula 031 está estritamente limitada a calcular valores aritméticos, respeitando regras de precedência, tratamento elementar de divisão por zero e overflow.
- Operadores compostos (`+=`, `-=`) e incremento pós-fixado (`++`) são apenas contextualizados de forma conceitual. O foco reside nas operações explícitas e na ordem física de precedência do Java.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Lista de casos reais de cálculos em backend | Painel conceitual de aplicação | Apresentação teórica dos cenários de cálculos corporativos. |
| Tabela de operadores: +, -, *, /, % | Painel interativo de operadores | Simulador onde o aluno digita números e vê o resultado para todos os 5 operadores simultaneamente. |
| Divisão de inteiros descartando parte decimal | Simulador de Divisão Inteira vs Decimal | Comparação de `10 / 4` e representação de corte dos decimais. |
| Divisão decimal com cast `(double)` | Simulador de Divisão Inteira vs Decimal | Demonstração imperativa do uso do cast para obter precisão. |
| Armadilha de guardar divisão inteira em double | Simulador de Divisão Inteira vs Decimal | Exibição de `10 / 4` atribuído a double retornando `2.0` com explicação do motivo. |
| Resto da divisão com `%` | Simulador do Resto (%) | Aluno altera itens e caixas e vê visualmente os itens que sobram fora das caixas completas. |
| Aplicação do resto: par ou ímpar | Simulador do Resto (%) | Explicação da fórmula `numero % 2 == 0`. |
| Precedência de operadores aritméticos | Simulador de Precedência | Árvore lógica demonstrando a precedência implícita de `*` e `/` sobre `+` e `-`. |
| Modificação de ordem com parênteses `()` | Simulador de Precedência | Aluno ativa/desativa parênteses e vê a alteração instantânea do resultado e da árvore de fluxo. |
| Concatenação acidental vs Soma | Simulador de Precedência | Comparação gráfica de `"Resultado: " + 10 + 20` contra `"Resultado: " + (10 + 20)`. |
| Variáveis intermediárias para clareza | Seção de boas práticas | Destaque pedagógico da legibilidade de código modularizado. |
| Operações mistas int com double | Simulador de Divisão Inteira vs Decimal | Alerta sobre o comportamento impreciso e imutabilidade de tipos no Java. |
| Dinheiro real vs uso de double | Seção de boas práticas monetárias | Explicação pedagógica de usar centavos inteiros (long) ou BigDecimal em regras de negócio. |
| Incremento explícito e acumuladores | Seção de acumuladores | Exemplo de contadores e acumuladores de loops. |
| Diferença entre cálculo e atribuição | Painel conceitual de atribuição | Explicação de que o lado direito do `=` é processado antes da escrita no Stack. |
| Exemplo Main: 5 operações básicas | Galeria de Casos de Domínio | Código e console simulado com a saída do Main original. |
| Exemplo DivisaoDecimal | Galeria de Casos de Domínio | Código e console mostrando as saídas de divisão. |
| Exemplo PrecedenciaAritmetica | Galeria de Casos de Domínio | Exemplo conceitual comparativo. |
| Exemplo CalculoPedido | Galeria de Casos de Domínio | Pedido simples com centavos. |
| Exemplo CalculoEstoque | Galeria de Casos de Domínio | Cálculo de reserva e estoque real. |
| Exemplo CalculoPaginacao | Galeria de Casos de Domínio | Cálculo do offset de busca no banco de dados. |
| Exemplo CalculoLote | Galeria de Casos de Domínio | Quebra de lotes padrão de transporte. |
| Exemplo PercentualConclusao | Galeria de Casos de Domínio | Cálculo de progresso de atividades. |
| Exemplo CalculoPedidoConsole | Galeria de Casos de Domínio | Integração do Scanner com os cálculos numéricos. |
| Exemplo CalculoLoteConsole | Galeria de Casos de Domínio | Leitura dinâmica para divisão e resto. |
| Divisão inteira por zero (ArithmeticException) | Prevenção de Divisão por Zero | Simulação de quebra de fluxo com divisores zerados. |
| Divisão double por zero (Infinity) | Prevenção de Divisão por Zero | Explicação teórica do resultado Infinity. |
| Risco de overflow aritmético em int | Seção de boas práticas de tipo | Alerta de overflow com valores de 2 bilhões e a solução usando long. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Análise de falhas clássicas de divisão inteira, concatenação acidental, parênteses e overflow. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Instruções locais PowerShell de setup, compilação de 10 classes e commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 10 códigos corporativos e consoles foram integrados na Galeria de Casos de Domínio, evitando a duplicação de códigos Java nas etapas conceituais.
- A explicação sobre centavos monetários foi concentrada na seção de boas práticas monetárias, unificando os comentários.

## Lacunas resolvidas

- O aluno experimenta de forma gráfica o "descarte físico" dos decimais na divisão inteira, compreendendo por que o Java não arredonda a conta.
- A árvore de precedência animada sana de imediato a confusão sobre qual operação é executada primeiro pelo compilador do Java.
