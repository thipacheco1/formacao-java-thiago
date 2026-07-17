# Matriz de cobertura — Aula 027

## Identificação

- Aula original: `docs/aulas/027_M1_07_BOOLEAN_E_REGRAS_VERDADEIRAS_FALSAS_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/026_M1_06_TIPOS_DECIMAIS_E_PRIMEIRAS_LIMITACOES_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/028_M1_08_CHAR_E_STRING_EM_USO_INICIAL_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedBooleanRulesLesson027.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedBooleanRulesLesson.css`
- Arquétipo: oficina de regras lógicas e booleanos com tabelas-verdade interativas, construtor de nomes profissionais e clínica de depuração
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 026 ensinou tipos decimais, precisão de ponto flutuante e primeiras limitações físicas. A Aula 027 introduz o tipo booleano e a modelagem básica de regras de verdadeiro ou falso.
- A Aula 028 ensinará caracteres primitivos (`char`) e o uso inicial da classe `String`. A Aula 027 limita-se a usar Strings literais apenas para demonstrar a diferença clássica entre a palavra `"true"` (texto) e a palavra reservada `true` (booleano).
- A lógica de fluxo condicional profunda com `if-else` é apenas sinalizada. O foco da aula é computar a regra em variáveis booleanas intermediárias e imprimi-las, preparando o terreno sem antecipar a sintaxe sintática e complexa das estruturas condicionais futuras.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| O que é boolean e os dois estados true e false | Introdução e Mapa de Conceitos | Explicação textual e inicializadores visuais das duas palavras-chave. |
| Valores booleanos em minúsculas (true, false) | Simulador de Nomes e Escrita | Aluno testa True/False e vê o compilador rejeitar maiúsculas. |
| Boolean não é texto (aspas) | Simulador e Clínica de Erros | Alerta visual comparando `boolean ativo = true;` com `"true"`. |
| Boolean não é número (0 e 1 no Java) | Simulador e Clínica de Erros | Explicação da tipagem forte em contraste com C/C++ ou Javascript. |
| Nome do boolean deve soar como pergunta | Simulador do Nomeador Profissional | Aluno arrasta prefixos e substantivos para montar nomes de variáveis booleanas. |
| Evitar nomes genéricos (flag, retorno, status) | Jogo de Triagem de Nomenclatura | Escolha de alternativas mais explícitas para contextos reais de negócio. |
| Prefixos comuns (is, has, can, possui, permite, esta, deve) | Simulador do Nomeador Profissional | Opções interativas para montagem de perguntas booleanas. |
| Evitar nomes negativos e dupla negação | Simulador de Negação e Clínica | Comparação visual de legibilidade com e sem negação dupla. |
| Operador de negação lógica `!` | Simulador de Negação (Lente !) | Aluno clica em interruptor e vê a lente inverter o valor e sinal lógico. |
| Operadores de comparação (`>`, `<`, `==`, `!=`, `>=`, `<=`) | Construtor de Comparação | Aluno monta expressões aritméticas simples e vê o boolean correspondente. |
| Diferença fundamental entre `=` e `==` | Construtor e Clínica de Erros | Explicação de que `=` altera a memória física e `==` lê para testar. |
| Exemplo mínimo `ComparacaoBoolean.java` | Galeria de Casos de Domínio | Código e console mostrando estoque e status correspondentes. |
| Operadores lógicos `&&` e `||` | Tabela-Verdade Interativa | Aluno fecha circuitos lógicos e acende a lâmpada do resultado da regra. |
| Tabela-verdade do operador `&&` | Tabela-Verdade Interativa (Circuito) | Ilustração de que a lâmpada só acende se ambos os disjuntores estiverem fechados. |
| Tabela-verdade do operador `||` | Tabela-Verdade Interativa (Circuito) | Ilustração de que a lâmpada acende se pelo menos um disjuntor estiver fechado. |
| Exemplo mínimo `RegraComposta.java` | Galeria de Casos de Domínio | Código combinando ativo e pendências e console correspondente. |
| Exemplo aplicado: Cliente apto a comprar | Galeria de Casos de Domínio | Código modelando ativo, e-mail validado e pendências financeiras. |
| Exemplo aplicado: Envio de pedido | Galeria de Casos de Domínio | Código modelando pago, não cancelado e disponível em estoque. |
| Exemplo aplicado: Ordem de serviço | Galeria de Casos de Domínio | Código modelando OS aberta, atividade pendente e técnico disponível. |
| Exemplo aplicado: Autorização e privilégios | Galeria de Casos de Domínio | Código modelando ativo e (admin ou supervisor) com parênteses. |
| Parênteses ajudam a leitura e precedência | Construtor de Regra Composta | Aluno insere/remove parênteses e vê a avaliação da precedência mudar. |
| Boolean excessivo pode indicar modelagem ruim | Jogo de Triagem de Modelagem | Aluno arrasta flags de status esparsos para concentrar em Enum/Estado único. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Central de diagnósticos contendo sintoma, causa raiz e conserto de falhas de booleanos. |
| Atividade guiada com 7 arquivos locais | Terminal de Entrega e Diário | Roteiro de comandos PowerShell para compilar e executar o laboratório. |
| Commits do Git e ignore de arquivos class | Terminal de Entrega | Passos de auditoria e commit limpo. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de transformação e aprendizado prático. |

## Repetições consolidadas

- Os exemplos de códigos de negócio (Cliente, Pedido, Ordem de Serviço, Autorização) foram reunidos na Galeria de Casos de Domínio interativa, permitindo comparação lado a lado.
- Os operadores de comparação e atribuição ganharam simulações visuais focadas, consolidando os alertas sintáticos dispersos no original.
- A clínica de erros centraliza os 10 cenários mapeados, mantendo a consistência visual das aulas anteriores.

## Lacunas resolvidas

- As tabelas-verdade deixam de ser listas textuais enfadonhas: o circuito elétrico torna a explicação de E/OU lógica tangível e memorável.
- A precedência do `&&` sobre o `||` e o papel dos parênteses são demonstrados com animações do fluxo de avaliação lógica.
