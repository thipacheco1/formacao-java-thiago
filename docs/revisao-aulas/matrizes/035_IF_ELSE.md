# Matriz de cobertura — Aula 035

## Identificação

- Aula original: `docs/aulas/035_M1_15_IF_ELSE_IF_E_ELSE_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/034_M1_14_INCREMENTO_DECREMENTO_E_ACUMULADORES_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/036_M1_16_IFS_ANINHADOS_E_SIMPLIFICACAO_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedIfElseDecisionLesson035.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedIfElseDecisionLesson.css`
- Arquétipo: oficina de tomada de decisão com simulador gráfico de árvore de roteamento, comparador de fluxos (if vs else if) e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 034 ensinou incremento e acumuladores numéricos. A Aula 035 introduz de vez a tomada de decisão sequencial e cadeias lógicas excludentes utilizando `if`, `else if` e `else`.
- A Aula 036 avançará para desvios condicionais aninhados (if dentro de if) e simplificações lógicas com early return. A Aula 035 limita-se a estruturas lineares de desvios e faixas excludentes.
- O uso de blocos `switch` ou técnicas de polimorfismo/Maps são apenas sugeridos teoricamente na conclusão, focando estritamente nas cadeias de `if` da linguagem Java.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Tomada de decisão em fluxos corporativos | Painel conceitual de decisão | Apresentação teórica dos fluxos de aprovação de pagamentos. |
| O que é if (se) e estrutura | Árvore de Roteamento Dinâmica | Fluxo gráfico mostrando a rota da JVM de cima para baixo. |
| O que é else (senão) e estrutura | Árvore de Roteamento Dinâmica | Ramificação de fallback caso a condição anterior seja falsa. |
| O que é else if (senão, se) e faixas | Árvore de Roteamento Dinâmica | Caminhos alternativos sequenciais. |
| Importância da ordem das faixas de avaliação | Árvore de Roteamento Dinâmica | Nota 9.5 testada em ordem incorreta vs correta mostrando captura prematura. |
| Vários if independentes vs else if excludentes | Comparador de Fluxos | Simulação paralela mostrando 3 prints para mesma nota vs 1 print excludente. |
| Cobertura de fallback com else final | Árvore de Roteamento Dinâmica | Rota final para cobrir estados desconhecidos ou erros do sistema. |
| Exemplo IfBasico | Galeria de Casos de Domínio | Código e console testando cliente ativo. |
| Exemplo IfElseBasico | Galeria de Casos de Domínio | Código e console testando idade legal. |
| Exemplo IfElseIfBasico | Galeria de Casos de Domínio | Código e console de avaliação de notas escolares. |
| Uso obrigatório de chaves { } em blocos | Seção de boas práticas | Exemplo visual mostrando riscos de omitir chaves em manutenções futuras. |
| Coerência de mensagens e lógica interna | Seção de boas práticas | Alerta de integridade didática de mensagens de log. |
| Exemplo PedidoIfElseIf | Galeria de Casos de Domínio | Código categorizando pedidos em baixo/médio/alto valor. |
| Exemplo ProdutoIfElseIf | Galeria de Casos de Domínio | Código avaliando status de estoque do produto. |
| Exemplo PagamentoIfElseIf | Galeria de Casos de Domínio | Código e console tratando fluxos de transações financeiras. |
| Exemplo OrdemServicoIfElseIf | Galeria de Casos de Domínio | Código avaliando status da ordem de serviço. |
| Exemplo MensageriaIfElseIf | Galeria de Casos de Domínio | Código roteando mensagens NPS, Boas-vindas e Entregas. |
| Exemplo AuditoriaIfElseIf | Galeria de Casos de Domínio | Código registrando tipos de auditorias locais. |
| Clínica de 7 Erros Comuns | Clínica de Erros (7 abas) | Análise das 7 falhas, faixas invertidas, falta de else, ponto e vírgula assassino. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Instruções locais PowerShell de setup, compilação de 9 classes e commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist de validação objetiva da lição. |

## Repetições consolidadas

- Os 9 códigos locais de exemplos corporativos foram integrados em abas na Galeria de Casos de Domínio, limpando a carga textual do roteiro.
- A explicação técnica de faixas de avaliação foi unificada no simulador de árvore de roteamento.

## Lacunas resolvidas

- O simulador gráfico de árvore permite que o aluno "veja" o ponto de luz da JVM descendo de cima para baixo pelas chaves das condições do `if`. Isso deixa evidente por que a ordem importa e por que o primeiro bloco verdadeiro bloqueia a execução dos demais.
- O perigo do ponto e vírgula no final do `if` (ex: `if (idade >= 18); { ... }`) é ilustrado de forma clara, mostrando que a instrução de decisão foi encerrada de forma nula no próprio `;`.
