# Matriz de cobertura — Aula 033

## Identificação

- Aula original: `docs/aulas/033_M1_13_OPERADORES_LOGICOS_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/032_M1_12_OPERADORES_RELACIONAIS_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/034_M1_14_INCREMENTO_DECREMENTO_E_ACUMULADORES_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedLogicalOperatorsLesson033.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedLogicalOperatorsLesson.css`
- Arquétipo: oficina de operadores lógicos com simulador interativo de curto-circuito (JVM thread), painel de portas lógicas (circuitos) e clínica de erros
- Estado: implementada e auditada tecnicamente em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 032 apresentou operadores relacionais para avaliações unitárias. A Aula 033 avança ensinando a combinar múltiplos testes lógicos em uma mesma expressão utilizando `&&`, `||` e `!`.
- A Aula 034 introduzirá operadores de incremento, decremento e acumuladores numéricos. A Aula 033 limita-se estritamente à lógica booleana de curto-circuito e ordem de precedência de portas lógicas.
- O uso de blocos condicionais completos `if-else` ou loops de fluxo de processamento são demonstrados apenas de forma teórica na galeria. O foco é a correta formulação e legibilidade das atribuições lógicas.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Perguntas lógicas de backend corporativo com E/OU/NÃO | Painel conceitual de portas lógicas | Apresentação teórica dos requisitos lógicos combinados. |
| Operador && (E lógico) e tabela-verdade | Painel interativo de portas lógicas | Circuito onde o aluno clica nas duas chaves em série para ligar a lâmpada. |
| Operador \|\| (OU lógico) e tabela-verdade | Painel interativo de portas lógicas | Circuito onde o aluno clica em qualquer uma das chaves em paralelo para ligar a lâmpada. |
| Operador ! (NÃO lógico) e tabela-verdade | Painel interativo de portas lógicas | Botão que inverte dinamicamente o status do sinal booleano. |
| Exemplo Main: OperadoresLogicosBasico | Galeria de Casos de Domínio | Código e console mostrando as saídas lógicas de entrada. |
| Curto-circuito com && | Simulador de Curto-Circuito | JVM avaliando A && B. Se A é false, a JVM não lê B, prevenindo a quebra de nulo. |
| Prevenção de NullPointerException com && | Simulador de Curto-Circuito | Demonstração gráfica da bomba de NullPointerException sendo desarmada. |
| Curto-circuito com \|\| | Simulador de Curto-Circuito | JVM avaliando A \|\| B. Se A é true, o resultado é true imediatamente. |
| Ordem correta das condições (null check primeiro) | Simulador de Curto-Circuito | Aluno inverte a ordem das chaves lógicas e assiste à quebra do programa. |
| Parênteses e clareza de precedência E vs OU | Quebrador de Condições | Aluno visualiza expressões compostas mudando de resultado com parênteses. |
| Evitar condições enormes na mesma linha | Quebrador de Condições | Aluno clica em "Refatorar" e vê um if gigante quebrar em booleanos locais explicativos. |
| Exemplo ValidacaoPedido | Galeria de Casos de Domínio | Código e console para validações de pedidos. |
| Exemplo ValidacaoOs | Galeria de Casos de Domínio | Código e console para validações de agendamento de OS. |
| Exemplo ValidacaoPagamento | Galeria de Casos de Domínio | Código e console de aprovação de pagamentos por múltiplos meios. |
| Exemplo ControleAcesso | Galeria de Casos de Domínio | Código e console de controle de perfis autorizados. |
| Exemplo ValidacaoMensageria | Galeria de Casos de Domínio | Código e console de controle de envio de notificações. |
| Exemplo ValidacaoAuditoria | Galeria de Casos de Domínio | Código e console de auditoria de operações. |
| Clínica de Erros Comuns (& vs &&, | vs \|\|, negações) | Clínica de Erros (10 abas) | Análise das 10 falhas clássicas de curto-circuito, negação confusa, parênteses e strings. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Instruções locais PowerShell de setup, compilação de 7 classes e commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 7 códigos e consoles corporativos originais foram unificados na Galeria de Casos de Domínio, eliminando duplicações textuais.
- As tabelas-verdade foram substituídas pela simulação interativa de disjuntores e lâmpadas, acelerando o aprendizado com menor dependência de textos estáticos.

## Lacunas resolvidas

- A ordem dos testes contra `null` é resolvida graficamente: chamar um método antes de confirmar que a referência não é nula provoca `NullPointerException`; colocar o teste primeiro permite ao curto-circuito evitar a chamada.
