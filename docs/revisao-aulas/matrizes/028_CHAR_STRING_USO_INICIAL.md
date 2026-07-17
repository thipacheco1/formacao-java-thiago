# Matriz de cobertura — Aula 028

## Identificação

- Aula original: `docs/aulas/028_M1_08_CHAR_E_STRING_EM_USO_INICIAL_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/027_M1_07_BOOLEAN_E_REGRAS_VERDADEIRAS_FALSAS_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/029_M1_09_STRING_BASICA_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedCharStringLesson028.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedCharStringLesson.css`
- Arquétipo: oficina de tipos textuais com comparador de aspas, visualizador de imutabilidade em memória, playground de escape e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 027 ensinou booleanos, tabelas-verdade, comparadores e precedência lógica. A Aula 028 avança para os tipos textuais primitivos (`char`) e estruturados (`String`), introduzindo a manipulação inicial de strings e seus primeiros métodos básicos.
- A Aula 029 aprofundará sobre String (básica). A Aula 028 foca em diferenciar o caractere individual (`char`) da cadeia de caracteres (`String`), enfatizando o uso de aspas simples vs duplas e a armadilha de zeros à esquerda em identificadores.
- Comparações complexas e operações avançadas de Strings (como `equals` ou `StringBuilder`) são apenas sinalizadas de forma cautelar (avisando que `==` não deve ser usado). O foco absoluto está na declaração, concatenação, escape básico e na natureza de imutabilidade física das Strings.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| O que é char (primitivo de caractere único) | Introdução e Mapa de Conceitos | Explicação textual e exemplos de declaração com aspas simples. |
| Char usa aspas simples ('A') | Simulador de Aspas (Aspômetro) | Aluno testa `'A'` e vê a ferramenta catalogar como char válido. |
| String representa texto e usa aspas duplas ("A") | Simulador de Aspas (Aspômetro) | Aluno testa `"A"` e constata que é String de tamanho 1. |
| Char não guarda mais de um caractere | Simulador de Aspas (Aspômetro) | Aluno testa `'SP'` e o simulador exibe o erro do javac. |
| String não é tipo primitivo, é classe (S maiúsculo) | Painel conceitual de classes | Destaque pedagógico da diferença entre primitivos e referências. |
| String vazia `""` | Painel de estados textuais | Explicação didática de que texto sem caracteres difere de nulo. |
| String com espaço | Painel de estados textuais | Demonstração de que espaços possuem comprimento contável em bits/caracteres. |
| Identificadores textuais numéricos como String | Detector de Modelagem | Quiz interativo para decidir se CEP/CPF devem ser String ou inteiros. |
| Risco de perda de zeros à esquerda em números | Detector de Modelagem | Ilustração do truncamento de `06454000` para `6454000` se usado como int. |
| Exemplo mínimo `Main.java` com char | Galeria de Casos de Domínio | Código e console mostrando categoria. |
| Exemplo mínimo com String | Galeria de Casos de Domínio | Código e console exibindo o nome do cliente. |
| Concatenação com operador `+` | Laboratório de Concatenação | Aluno visualiza a junção de strings e a importância do espaço em branco `" "`. |
| Concatenação de texto com número | Laboratório de Concatenação | Demonstração da conversão implícita do número para texto durante a soma. |
| Armadilha da precedência na concatenação (`10 + 20`) | Laboratório de Concatenação | Aluno muda parênteses e vê a saída chavear de `1020` para `30`. |
| Caracteres de escape: aspas internas (`\"`) | Playground de Escape | Aluno insere aspas internas e vê o texto formatado no console. |
| Caracteres de escape: barra invertida (`\\`) | Playground de Escape | Exibição de caminhos de arquivos de disco (ex: C:\dev). |
| Caracteres de escape: quebra de linha (`\n`) | Playground de Escape | Texto quebrado em múltiplas linhas no console. |
| Caracteres de escape: tabulação (`\t`) | Playground de Escape | Alinhamento tabular de colunas simples de dados. |
| String com `null` | Painel conceitual de referências | Explicação da ausência de endereço de memória em contraste com `""`. |
| Métodos iniciais de String: `length()` | Visualizador de Métodos | Exibição de contagem de posições físicas do texto no array. |
| Métodos iniciais de String: `toUpperCase()` | Visualizador de Métodos e Imutabilidade | Demonstração do retorno modificado. |
| Métodos iniciais de String: `toLowerCase()` | Visualizador de Métodos | Conversão do texto para caixa baixa. |
| Princípio da Imutabilidade | Visualizador de Imutabilidade (Memória) | Ilustração gráfica mostrando que a variável original não muda e um novo bloco é criado. |
| Quando preferir String em vez de char | Mapa de Escolha de Engenharia | Tabela pragmática ajudando a decidir o melhor tipo para cada regra de negócio. |
| Quando usar char de forma adequada | Mapa de Escolha de Engenharia | Cenários restritos a uma única letra (sexo, categoria de cliente, etc.). |
| Alerta de comparação de String com `==` | Seção de boas práticas e clínica | Explicação cautelar recomendando evitar `==` e sugerindo o equals. |
| Exemplo aplicado: ClienteTexto | Galeria de Casos de Domínio | Código contendo nome, e-mail e categoria em char. |
| Exemplo aplicado: PedidoTexto | Galeria de Casos de Domínio | Código modelando código de pedido textual. |
| Exemplo aplicado: OrdemServicoTexto | Galeria de Casos de Domínio | Código com número de OS e prioridade em char. |
| Exemplo aplicado: DocumentoTexto | Galeria de Casos de Domínio | Código guardando CPF, CEP e telefone como Strings de identificação. |
| Exemplo aplicado: MensagemErroTexto | Galeria de Casos de Domínio | Código exibindo validações textuais de campos. |
| Exemplo aplicado: Padronização de status | Galeria de Casos de Domínio | Demonstração de toUpperCase guardado em nova variável. |
| Exemplo aplicado: Tamanho de documento | Galeria de Casos de Domínio | Demonstração de length() para validar CPF de 11 dígitos. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Central de diagnósticos contendo sintoma, causa raiz e conserto de falhas de tipos textuais. |
| Atividade guiada com 9 arquivos locais | Terminal de Entrega e Diário | Roteiro de comandos PowerShell para compilar e executar o laboratório. |
| Commits do Git e ignore de arquivos class | Terminal de Entrega | Passos de auditoria e commit limpo. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de transformação e aprendizado prático. |

## Repetições consolidadas

- Os 7 códigos de exemplos aplicados (Cliente, Pedido, Ordem de Serviço, Documentos, Mensagem de erro, Status, Tamanho) foram consolidados na Galeria de Casos de Domínio com seus respectivos terminais.
- Os avisos de aspas simples/duplas e char múltiplo foram unificados no Simulador de Aspas (Aspômetro).
- A imutabilidade e os métodos de string foram consolidados no simulador visual de memória, unindo a prática com a teoria física.

## Lacunas resolvidas

- A imutabilidade de String deixa de ser um texto teórico abstrato: o aluno vê graficamente dois blocos distintos na memória Heap, compreendendo por que chamar `toUpperCase()` não altera o valor da variável de origem.
- A precedência na concatenação é ilustrada com fluxogramas mostrando a etapa exata onde o Java promove o número inteiro para texto.
