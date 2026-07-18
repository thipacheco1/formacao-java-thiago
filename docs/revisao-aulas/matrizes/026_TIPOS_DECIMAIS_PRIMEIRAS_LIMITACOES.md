# Matriz de cobertura — Aula 026

## Identificação

- Aula original: `docs/aulas/026_M1_06_TIPOS_DECIMAIS_E_PRIMEIRAS_LIMITACOES_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/025_M1_05_TIPOS_INTEIROS_EM_JAVA_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/027_M1_07_BOOLEAN_E_REGRAS_VERDADEIRAS_FALSAS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedDecimalTypesLesson026.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedDecimalTypesLesson.css`
- Arquétipo: oficina de tipos decimais e aproximação com simulador de precisão, divisão de inteiros e clínica de erros
- Estado: implementada e auditada tecnicamente em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 025 ensinou tipos inteiros primitivos, limites de dados e a constante `MAX_VALUE`/`MIN_VALUE`. A Aula 026 avança para os números fracionários primitivos, precisão de ponto flutuante e primeiras limitações físicas.
- A Aula 027 ensinará booleanos, tabelas-verdade, comparadores e operadores lógicos básicos. A Aula 026 introduz a divisão inteira e comparação básica de precisão, mas não antecipa a lógica boleana formal nem operadores complexos.
- `BigDecimal` e o conceito aprofundado de arredondamento financeiro são sinalizados didaticamente como referências futuras. O foco aqui está estrito nas aproximações do `double` e `float`.
- Formatação via `printf` é demonstrada de forma preliminar apenas para ensinar a formatar a visualização na saída do console, separando claramente visualização de precisão interna do cálculo.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| O problema clássico de `0.1 + 0.2 = 0.30000000000000004` | Simulador de Balança Binária | Aluno clica para somar 0.1 e 0.2 e vê a dízima binária e o ruído final. |
| O que é um número decimal e separador ponto | Introdução e mapa de anatomia | Aluno seleciona cada parte de `double valor = 99.90;` e constata o erro de vírgula. |
| Os dois tipos decimais: float e double | Seletor de Tipo e Precisão | Exibição da tabela comparativa e bits correspondentes (32 e 64 bits). |
| double como decimal padrão e literais sem sufixo | Painel do `double` | Exemplos do cotidiano (distâncias, notas, percentuais simples) justificados. |
| float exige sufixo `F` para literais decimais | Simulador de Sufixo F | Aluno digita/testa com e sem sufixo `F` e vê o erro do javac. |
| Preferência por sufixo `F` maiúsculo | Dica tipográfica no simulador | Comparação visual direta entre `F` e `f` minúsculo. |
| Sufixo opcional `D` para double | Painel do `double` | Menção ao sufixo `D` e por que ele raramente é necessário no dia a dia. |
| Evitar atribuir número decimal como texto | Simulador e Clínica de Erros | Alerta para a diferença clássica entre `99.90` e `"99.90"`. |
| Exemplo mínimo `Main.java` com double | Galeria de Casos de Domínio | Código e visualização do console de saída com valor impresso. |
| Exemplo mínimo com float | Galeria de Casos de Domínio | Código e console mostrando temperatura formatada. |
| Comparação de precisão real entre float e double | Seletor de Tipo e Precisão | Aluno digita número longo e vê como float corta mais cedo que o double. |
| Por que existe a aproximação binária | Painel explicativo da aproximação | Explicação didática de representações finitas em base 2. |
| Domínios tolerantes a aproximação vs críticos | Classificador de Domínios | Jogo de triagem de cenários reais para exercitar discernimento profissional. |
| Não usar double para dinheiro sem compreender riscos | Alerta na balança de domínios | Justificativa do risco de perda financeira silenciosa. |
| Técnica de centavos como inteiro em long | Seção conceitual de centavos | Exemplo prático de `long valorCentavos = 9990L` como alternativa de cálculo. |
| Armadilha da divisão inteira (`10 / 4 = 2.0`) | Laboratório de Divisão Inteira | Aluno modifica numeradores e denominadores e visualiza a perda dos decimais. |
| Correção da divisão inteira com literais (.0) | Laboratório de Divisão Inteira | Uso de `10.0 / 4` e a respectiva promoção de tipo. |
| Uso de cast explícito para forçar divisão decimal | Laboratório de Divisão Inteira | Uso de `(double) total / quantidade` e sua explicação no pipeline. |
| Exemplo aplicado: Média de pedidos | Galeria de Casos de Domínio | Código e saída do console da média com cast. |
| double e a representação padrão na saída (99.9) | Painel do printf | Exibição de que a saída padrão remove zeros à direita não significativos. |
| Uso do `printf` e especificador `%.2f` | Visualizador de printf | Aluno escolhe o formato (%.1f, %.2f) e vê o console correspondente. |
| printf muda apenas exibição, não o valor interno | Alerta importante no visualizador | Explicação da diferença entre formatação e valor, incluindo a variação do separador conforme o Locale. |
| Exemplo aplicado: Distância de entrega | Galeria de Casos de Domínio | Código e terminal com representação de km e horas estimadas. |
| Exemplo aplicado: Nota média de avaliação | Galeria de Casos de Domínio | Média simples de três avaliações com divisão decimal. |
| Exemplo aplicado: Percentual de conclusão | Galeria de Casos de Domínio | Cálculo com cast explícito para evitar divisão inteira de atividades. |
| Exemplo aplicado: Pedido com valores (didático) | Galeria de Casos de Domínio | Cálculo de desconto usando double com advertência técnica de time. |
| Exemplo aplicado: Pedido com centavos em long | Galeria de Casos de Domínio | Resolução do mesmo desconto com long em centavos. |
| Exemplo aplicado: SLA em horas | Galeria de Casos de Domínio | Subtração de SLA de horas em double vs modelagem alternativa em minutos. |
| Exemplo aplicado: Peso e cubagem | Galeria de Casos de Domínio | Multiplicação de peso/volume física. |
| Recomendação de float apenas com justificativa | Seletor de Tipo e Precisão | Explicação de que economia de memória raramente compensa a perda de precisão no backend. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Central de diagnósticos contendo sintoma, causa raiz e conserto de falhas de decimais. |
| Atividade guiada com 12 arquivos locais | Terminal de Entrega e Diário | Roteiro de comandos PowerShell para compilar e executar o laboratório. |
| Commits do Git e ignore de arquivos class | Terminal de Entrega | Passos de auditoria e commit limpo. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de transformação e aprendizado prático. |

## Repetições consolidadas

- Os exemplos esparsos de código de domínio e suas saídas correspondentes foram consolidados na galeria selecionável interativa, reduzindo o tamanho do roteiro e permitindo foco em cada cenário (SLA, percentual, cubagem, avaliação, etc.).
- As explicações sobre sufixo `F` e ponto decimal que apareciam diluídas foram agrupadas nos simuladores do sufixo `F` e divisão inteira.
- Os dez erros de ponto flutuante ganharam a mesma central navegável por abas para uniformidade pedagógica.

## Lacunas resolvidas

- O ruído matemático do `0.1 + 0.2` deixa de ser um texto abstrato: o aluno vê visualmente a balança oscilar e exibir a aproximação digital no visor.
- A divisão de inteiros é demonstrada com fluxos numéricos que deixam claro em qual etapa exata a parte decimal é perdida (antes da atribuição ao double).
- O funcionamento do `printf` é demonstrado interativamente, deixando claro o papel das tags `%.2f`, `%%` e `%n`.

## Recursos planejados

- Simulador visual de Balança Binária (`0.1 + 0.2`).
- Comparador gráfico de precisão de casas decimais de `float` vs `double`.
- Simulador interativo do sufixo `F` para literais floats.
- Classificador interativo de cenários de domínio (Balança de Domínios).
- Editor interativo de Divisão Inteira vs Decimal.
- Painel interativo do `System.out.printf`.
- Clínica navegável de 10 erros comuns de decimais.
- Terminal PowerShell e Git guiado.
