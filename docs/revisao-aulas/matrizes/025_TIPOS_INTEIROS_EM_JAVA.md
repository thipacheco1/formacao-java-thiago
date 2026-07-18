# Matriz de cobertura — Aula 025

## Identificação

- Aula original: `docs/aulas/025_M1_05_TIPOS_INTEIROS_EM_JAVA_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/024_M1_04_VARIAVEIS_E_NOMES_PROFISSIONAIS_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/026_M1_06_TIPOS_DECIMAIS_E_PRIMEIRAS_LIMITACOES_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedIntegerTypesLesson025.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedIntegerTypesLesson.css`
- Arquétipo: oficina de tipos numéricos e limites com simulação de bits, overflow observável e clínica de erros
- Estado: implementada e auditada tecnicamente em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 024 introduziu variáveis usando apenas `int` como tipo padrão, cobrindo regras de nomeação e ciclo de vida. A Aula 025 expande para todos os quatro tipos inteiros primitivos, seus tamanhos em bits e limites.
- A Aula 026 ensinará tipos decimais (`double`, `float`), precisão de ponto flutuante e primeiras limitações matemáticas. A Aula 025 introduz dinheiro em centavos conceitualmente, mas foca estritamente nos números sem frações e não antecipa ponto flutuante.
- Wrappers (`Byte`, `Short`, `Integer`, `Long`) e classes utilitárias como `BigDecimal` são sinalizados como referências futuras ou apenas usados para consultar limites (constantes `MIN_VALUE`/`MAX_VALUE`); sua comparação formal de objetos e auto-boxing ficam em aulas avançadas.
- Promoção aritmética e cast são apresentados de forma elementar apenas para explicar por que operações matemáticas com byte/short exigem conversão ou promoção automática do compilador.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Uso comum do `int` por iniciantes | Introdução e mapa da aula | Aluno contrasta `int` para tudo com a necessidade de responsabilidade de tipos. |
| Os quatro tipos inteiros: byte, short, int, long | Seletor comparativo de tipos | Aluno seleciona cada tipo e vê suas especificidades. |
| Tabela de tamanhos e faixas de valores | Seletor e gráfico interativo | Exibição de bits (8, 16, 32, 64) e limites correspondentes. |
| Por que existem limites (largura em bits) | Simulador de representação | Comparação visual de 8, 16, 32 e 64 bits com complemento de dois explicitado. |
| `int` como padrão comum e faixa de +-2 bilhões | Painel do `int` | Casos clássicos (contadores, quantidades, tentativas) justificados no domínio. |
| `long` para números grandes que passam de 2 bilhões | Painel do `long` | Casos reais de IDs e timestamps com simulação de dados corporativos. |
| Sufixo `L` maiúsculo em literais `long` | Simulador de Sufixo L | Aluno testa que o sufixo é obrigatório acima da faixa de `int` e opcional em literais menores. |
| Evitar `l` minúsculo por parecer o número 1 | Dica visual no simulador do sufixo | Comparação visual direta entre `l` e `1` sob diferentes fontes. |
| Erro de literal fora do limite de int sem o `L` | Simulador e Clínica de Erros | Mensagem do compilador do Java explicada na prática. |
| `byte` guarda de -128 a 127 e seu uso binário | Painel do `byte` | Menção a buffers, arquivos, imagens e rede; desaconselhado para uso em lógica comum. |
| `short` guarda de -32.768 a 32.767 e seu uso | Painel do `short` | Menção a legado e otimização; desaconselhado para uso em lógica comum. |
| Escolha do tipo comunica intenção | Desafio de Domínio | Aluno escolhe o melhor tipo inteiro para cenários baseados na regra de negócio. |
| Dinheiro não é inteiro, mas pode usar centavos em `long` | Seção conceitual de centavos | Exemplo de `9990L` correspondendo a R$ 99,90 explicitando o motivo de evitar ponto flutuante. |
| Underscore `_` em literais grandes | Classificador de Underscores | Jogo rápido de validação de posições corretas e incorretas do `_`. |
| Exemplo mínimo `Main.java` com `int` | Galeria de Casos de Domínio | Código e visualização do console de saída com `10`. |
| Exemplo mínimo com `long` e `L` | Galeria de Casos de Domínio | Código e visualização do console de saída com ID do pedido. |
| Exemplo com todos os quatro tipos em `Main.java` | Galeria de Casos de Domínio | Código e terminal com quatro impressões formatadas. |
| Java disponibiliza limites em constantes da biblioteca | Visualizador de Constantes Limites | Exibição de `MIN_VALUE` e `MAX_VALUE` dos wrappers sem aprofundar orientação a objetos. |
| Conceito de Overflow e a "volta" numérica | Simulador de Overflow | Incrementar graficamente `MAX_VALUE` resultando no correspondente `MIN_VALUE` negativo. |
| Overflow silencioso em tempo de execução | Alerta importante no simulador | Explicação de que não há exceção gerada por padrão e as consequências em backend. |
| Promoção aritmética de byte/short para int | Painel de Operações Aritméticas | Exemplo de erro ao tentar somar dois bytes em uma variável byte. |
| Cast inicial para forçar conversão num tipo menor | Painel de Casting | Exemplo de `(byte) (a + b)` e os perigos de estouro silencioso de tipo. |
| Exemplo aplicado: Tentativa de login | Galeria de Casos de Domínio | Código e saída detalhada com cálculo de tentativas restantes. |
| Exemplo aplicado: Paginação | Galeria de Casos de Domínio | Exibição de paginação típica em APIs. |
| Exemplo aplicado: Auditoria massiva | Galeria de Casos de Domínio | Uso correto do `long` com underscore para contagens gigantes. |
| Exemplo aplicado: Ordem de serviço | Galeria de Casos de Domínio | Escolha mista de `long` e `int` baseada em regras de negócio. |
| Exemplo aplicado: Produto e estoque | Galeria de Casos de Domínio | Cálculo de estoque disponível. |
| Exemplo aplicado: Valor em centavos | Galeria de Casos de Domínio | Representação em centavos. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Navegador interativo contendo sintoma, causa raiz e conserto para cada falha descrita. |
| Atividade guiada com criação de 9 arquivos | Terminal de Entrega e Diário | Roteiro de passos e comandos PowerShell para compilar e executar o laboratório local. |
| Commits do Git e higiene do repositório | Terminal de Entrega | Passos detalhados de auditoria e commit seguro. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de transformação de estado e aprendizagem. |

## Repetições consolidadas

- Os exemplos soltos de compilação e execução de cada um dos nove arquivos Java da atividade são consolidados em uma galeria selecionável interativa, que reduz a rolagem infinita e permite ao aluno focar nos detalhes de cada código de domínio e na respectiva saída.
- As listas e tabelas de limites e de tamanhos são unificadas no seletor comparativo gráfico inicial, eliminando as repetições teóricas que ocorriam ao longo do Markdown.
- Os dez erros de compilação e execução ganharam uma única central de diagnóstico baseada em abas, agrupando-os por natureza (limites, sufixos, overflows, formatações e escolhas semânticas).

## Lacunas resolvidas

- O mecanismo de overflow passa a ser demonstrado visualmente, sem ensinar sinal-magnitude: o aluno observa a passagem do máximo ao mínimo segundo a aritmética inteira Java.
- O perigo do `l` minúsculo é evidenciado através de uma comparação gráfica real de tipografia de fontes comuns de desenvolvimento (onde se torna impossível diferenciar `l` de `1`).
- O comportamento da promoção aritmética do Java é explicado de forma a evitar que o aluno encare os erros de soma de bytes como uma falha aleatória, mostrando graficamente a ampliação temporária de espaço para `int`.

## Recursos planejados

- Tabela comparativa de tipos inteiros com gráficos de barras de bits.
- Simulador visual de Bits e slots de memória.
- Analisador interativo de literais numéricos com e sem sufixo `L`.
- Gráfico interativo e simulador de Overflow (estouro e "volta").
- Quiz interativo de validação de underscore em literais Java.
- Clínica de Erros navegável com 10 abas de diagnóstico de código.
- Terminal interativo do Git e PowerShell.
