# Matriz de cobertura — Aula 032

## Identificação

- Aula original: `docs/aulas/032_M1_12_OPERADORES_RELACIONAIS_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/031_M1_11_OPERADORES_ARITMETICOS_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/033_M1_13_OPERADORES_LOGICOS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedRelationalOperatorsLesson032.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedRelationalOperatorsLesson.css`
- Arquétipo: oficina de operadores relacionais com simulador interativo de réguas de fronteiras, comparador Heap/Stack para Strings e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 031 cobriu cálculos aritméticos simples (+, -, *, /, %). A Aula 032 introduz operadores relacionais para converter esses resultados numéricos em perguntas booleanas.
- A Aula 033 introduzirá os operadores lógicos (AND, OR, NOT). A Aula 032 está restrita a realizar comparações isoladas de tipos (int, long, double, char, String) sem encadear múltiplos testes na mesma atribuição.
- A estrutura de decisão condicional `if-else` é apenas mencionada e omitida das práticas de codificação da aula. O foco está no armazenamento direto do resultado booleano.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Perguntas lógicas do backend corporativo | Painel conceitual de regras | Apresentação teórica dos cenários de triagem de dados de negócio. |
| Tabela de operadores relacionais: >, <, >=, <=, ==, != | Simulador Geral Relacional | Aluno seleciona operadores e valores e vê a resposta booleana e sua leitura literal. |
| Diferença entre operadores aritméticos e relacionais | Painel conceitual comparativo | Destaque pedagógico (aritmético gera número, relacional gera boolean). |
| Exemplo mínimo com operador > | Galeria de Casos de Domínio | Código e console mostrando o Main com o estoque e saídas. |
| Operador > (maior que) e exclusão de limite | Simulador de Réguas de Fronteira | Régua onde o aluno testa idade mínima 18 com > 18 e vê a exclusão do 18. |
| Operador < (menor que) e exclusão de limite | Simulador de Réguas de Fronteira | Teste com estoque máximo/baixo. |
| Operador >= (maior ou igual) e inclusão de limite | Simulador de Réguas de Fronteira | Teste de limite mínimo incluindo a fronteira exata. |
| Operador <= (menor ou igual) e inclusão de limite | Simulador de Réguas de Fronteira | Teste de limite máximo incluindo a fronteira exata. |
| Operador == (igualdade) vs = (atribuição) | Painel explicativo e interativo | Aluno visualiza graficamente que = grava no Stack e == compara no processador. |
| Operador != (diferença) para estados/erros | Simulador Geral Relacional | Comparação prática para testar códigos de erro numéricos. |
| Nomenclatura profissional de booleanos | Seção de nomenclatura | Tabela comparativa e boas práticas para evitar nomes genéricos como "resultado". |
| Comparação com int e long | Galeria de Casos de Domínio / Simulador | Teste de igualdade de identificadores únicos (IDs). |
| Comparação com double (imprecisão física) | Simulador de Réguas de Fronteira | Alerta de tolerância de precisão em ponto flutuante. |
| Comparação de char (aspas simples) | Simulador Geral Relacional | Aluno digita caracteres ('A', 'B') e analisa a igualdade de status do sistema. |
| Redundância de comparar boolean com == true/false | Painel explicativo e interativo | Aluno visualiza a simplificação de `ativo == true` para `ativo` e `ativo == false` para `!ativo`. |
| Perigo de usar == em Strings e equals() | Comparador Heap vs Stack | Animação visual ilustrando por que == compara endereços na Stack e equals() os valores no Pool. |
| Parênteses na impressão concatenada de relacionais | Seção de boas práticas de escrita | Exemplo prático de `"A > B: " + (A > B)`. |
| Exemplo ValidacaoEstoque | Galeria de Casos de Domínio | Código e console de estoque de segurança. |
| Exemplo ValidacaoLimite | Galeria de Casos de Domínio | Código e console de limite de crédito. |
| Exemplo ValidacaoIdade | Galeria de Casos de Domínio | Código comparativo de idade legal. |
| Exemplo ValidacaoTentativas | Galeria de Casos de Domínio | Código de limite de acessos e bloqueio. |
| Exemplo ValidacaoPedido | Galeria de Casos de Domínio | Código de pedido mínimo. |
| Exemplo ValidacaoProduto | Galeria de Casos de Domínio | Código de faixa operacional de estoque. |
| Exemplo ValidacaoOrdemServico | Galeria de Casos de Domínio | Código de limite de reagendamentos de OS. |
| Exemplo ValidacaoAuditoria | Galeria de Casos de Domínio | Código de auditoria crítica de usuário. |
| Exemplo ValidacaoPedidoConsole | Galeria de Casos de Domínio | Integração de Scanner com operadores relacionais. |
| Exemplo ValidacaoEstoqueConsole | Galeria de Casos de Domínio | Entrada dinâmica para regras mínimas. |
| Exemplo ValidacaoStatusTexto | Galeria de Casos de Domínio | Comparação textual utilizando equals() e negação (!). |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Análise das 10 falhas clássicas de comparação, igualdade de double, == com String e redundâncias. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Instruções locais PowerShell de setup, compilação de 12 classes e commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 12 programas foram agrupados na Galeria de Casos de Domínio, evitando a necessidade de exibição redundante dos códigos em seções conceituais.
- A explicação técnica do `equals` para Strings foi consolidada no Comparador Heap vs Stack, alinhando com a aula anterior.

## Lacunas resolvidas

- A régua de fronteira dinâmica evita que o aluno confunda se deve usar `>` ou `>=` em limites, pois ele altera o valor e vê o resultado se deslocar graficamente em tempo real.
- O comparador de Heap vs Stack de Strings saneia de vez o hábito incorreto de comparar Strings com `==`.
