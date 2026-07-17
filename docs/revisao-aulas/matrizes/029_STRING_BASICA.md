# Matriz de cobertura — Aula 029

## Identificação

- Aula original: `docs/aulas/029_M1_09_STRING_BASICA_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/028_M1_08_CHAR_E_STRING_EM_USO_INICIAL_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/030_M1_10_ENTRADA_DE_DADOS_COM_SCANNER_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedStringBasicsLesson029.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedStringBasicsLesson.css`
- Arquétipo: laboratório de validações e comparações com simulador de estado vazio/branco, lente de encadeamento e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 028 ensinou a diferença entre char primitivo e String (classe), aspas simples vs duplas e a modelagem textual de identificadores numéricos. A Aula 029 foca nos comportamentos lógicos e métodos utilitários essenciais da classe `String`.
- A Aula 030 abordará a entrada dinâmica de dados com a classe `Scanner`. O escopo da Aula 029 é exclusivamente a manipulação passiva e validação estática de strings em variáveis.
- Assuntos complexos de texto como expressões regulares (regex), correspondência padrão avançada ou construtores de strings pesadas (`StringBuilder`) são omitidos intencionalmente para evitar sobrecarga cognitiva.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| String como classe (métodos e ações) | Painel conceitual inicial | Explicação sobre a estrutura de classes na JVM. |
| Concatenação com operador `+` | Laboratório de Concatenação | Recapitulação rápida com chaves interativas de precedência. |
| Concatenação de string com número | Laboratório de Concatenação | Visualizador mostrando a conversão implícita do compilador. |
| Armadilha da precedência na concatenação (`10 + 20`) | Laboratório de Concatenação | Interativo demonstrando o impacto de omitir parênteses em exibições. |
| Método `length()` | Simulador de Estado Textual | Retorno da contagem de caracteres físicas em tempo real. |
| Uso de `length() == 11` para tamanho de CPF | Simulador de Estado Textual | Exemplo aplicado simulado de validação de comprimento. |
| Método `isEmpty()` | Simulador de Estado Textual | Retorna true apenas se length for 0. |
| Método `isBlank()` | Simulador de Estado Textual | Retorna true para vazio ou contendo apenas espaços em branco. |
| Diferença física entre `isEmpty()` e `isBlank()` | Simulador de Estado Textual | Tabela comparativa interativa que responde dinamicamente à digitação do aluno. |
| Método `trim()` | Simulador de Limpeza (Borda) | Aluno digita texto com espaços e vê o trim podar as extremidades. |
| `trim()` gera nova string imutável | Simulador de Limpeza (Borda) | Alerta gráfico mostrando a perda do retorno caso não seja reatribuído. |
| Método `equals()` para comparação de conteúdo | Laboratório de Comparação | Aluno testa `"ABERTA".equals(status)` contra comparação com `==`. |
| Perigo de usar `==` com Strings em Java | Laboratório de Comparação | Explicação visual de que `==` avalia endereços na Stack, não caracteres. |
| Padrão seguro de comparação: `"CONSTANTE".equals(variavel)` | Laboratório de Comparação | Dica técnica de design pattern defensivo para evitar `NullPointerException`. |
| Método `equalsIgnoreCase()` | Laboratório de Comparação | Comparador que ignora diferenças de caixa em status de negócios. |
| Método `contains()` | Auditor de Regras de Domínio | Validador simples de existência de subcadeias de caracteres. |
| `contains()` diferencia maiúsculas de minúsculas | Auditor de Regras de Domínio | Demonstração do falso-negativo de `"erro"` em `"Erro ao processar"`. |
| Padronização com `toLowerCase().contains()` | Auditor de Regras de Domínio | Pipeline de busca textual tolerante a variações de caixa. |
| Limitação: `contains("@")` não é validação de e-mail real | Auditor de Regras de Domínio | Alerta pedagógico com contraexemplos de e-mails inválidos. |
| Encadeamento de métodos (Chaining) | Lente de Encadeamento | Animação passo a passo mostrando a execução sequencial do compilador. |
| Variáveis intermediárias para clareza em iniciantes | Lente de Encadeamento | Exemplo de refatoração para simplificar linhas densas. |
| Exemplo mínimo `Main.java` com métodos principais | Galeria de Casos de Domínio | Código e console integrados. |
| Exemplo mínimo com comparação | Galeria de Casos de Domínio | Demonstração de equals vs equalsIgnoreCase. |
| Exemplo aplicado: ClienteStringBasica | Galeria de Casos de Domínio | Validação de nome preenchido e e-mail. |
| Exemplo aplicado: PedidoStringBasica | Galeria de Casos de Domínio | Validação de código e status pendente. |
| Exemplo aplicado: OrdemServicoStringBasica | Galeria de Casos de Domínio | Busca de reagendamento em observação. |
| Exemplo aplicado: ProdutoStringBasica | Galeria de Casos de Domínio | Validação de código EAN de 6 caracteres. |
| Exemplo aplicado: MensagemStringBasica | Galeria de Casos de Domínio | Busca de Erro e tamanho físico de mensagem. |
| Exemplo aplicado: AuditoriaStringBasica | Galeria de Casos de Domínio | Combinação de métodos para log de sistema. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Central de diagnósticos contendo causa raiz e consertos de problemas com Strings. |
| Atividade prática com 9 arquivos locais | Terminal de Entrega e Diário | Comandos PowerShell de criação e execução do laboratório. |
| Commits do Git e ignore de arquivos class | Terminal de Entrega | Passos de auditoria e commit limpo. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de homologação e encerramento. |

## Repetições consolidadas

- Os 8 códigos de exemplos e simulações mínimas foram consolidados na Galeria de Casos de Domínio.
- Os avisos de aspas e concatenação foram unificados no Laboratório de Concatenação para economizar espaço e evitar repetição da aula anterior.

## Lacunas resolvidas

- A diferença sutil entre `isEmpty()` e `isBlank()` deixa de ser puramente conceitual: o aluno digita espaços no campo e vê os retornos de boleano mudarem lado a lado na tabela interativa.
- O encadeamento de métodos é destrinchado graficamente em subetapas, provando que cada elo do pipeline produz uma nova String imutável.
