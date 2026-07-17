# Matriz de cobertura — Aula 039

## Identificação

- Aula original: `docs/aulas/039_M1_19_WHILE_OFICIAL.md`
- Aula anterior: `docs/aulas/038_M1_18_SWITCH_MODERNO_E_EXPRESSOES_OFICIAL.md`
- Aula posterior: `docs/aulas/040_M1_20_DO_WHILE_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedWhileLesson039.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedWhileLesson.css`
- Arquétipo: oficina de repetição com animador de fluxo de iteração, simulador de contador + acumulador, galeria de padrões corporativos e clínica de erros
- Estado: em_revisao

## Fronteiras curriculares

- A Aula 038 ensinou switch expression (seleção por valor que produz resultado). A Aula 039 apresenta o while: o programa aprende a repetir.
- A Aula 040 introduzirá do while, que executa pelo menos uma vez (resolve o padrão de menu). O while da 039 testa ANTES.
- Arrays, for clássico, break avançado e streams são apenas mencionados como caminho futuro.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Conceito de loop, iteração, ciclo | Painel conceitual de abertura com analogias corporativas | Tabela de frases em português com equivalente em while Java. |
| Estrutura do while (inicialização, condição, atualização) | Anatomia interativa do while | Três regiões destacadas com setas e legendas. |
| while testa antes (pode executar zero vezes) | Animador de Fluxo de Iteração | Simulação visual da condição sendo avaliada antes do bloco. |
| Contador crescente, contador decrescente | Animador de Fluxo de Iteração | Dois modos de simulação com passo-a-passo visual. |
| Acumulador dentro do while | Simulador de Acumulador | Display ao vivo de contador e acumulador por iteração. |
| Loop infinito: causa e prevenção | Clínica de Erros (Erro 1, 2 e 7) | Diagnóstico visual de loop sem atualização e sem condição de parada. |
| While com variável booleana (continuar = false) | Galeria de Padrões | BooleanControlWhile. |
| While com valor sentinela | Galeria de Padrões | LeituraEnquantoPositivo com sentinela 0. |
| Menu com while + switch | Galeria de Padrões | MenuWhile com opcao = -1 e valor sentinela 0. |
| Processamento de lote com contagem de erros | Galeria de Padrões | ProcessamentoLoteComErro. |
| Tentativas limitadas | Galeria de Padrões | TentativasWhile e TentativaSenhaConsole. |
| Estoque com duas condições | Galeria de Padrões | BaixaEstoqueWhile. |
| Paginação | Galeria de Padrões | PaginacaoWhile. |
| Mensageria | Galeria de Padrões | MensageriaWhile. |
| Validação de entrada com while | Galeria de Padrões | ValidacaoEntradaWhile. |
| Escopo de variáveis no while | Nota de alerta dentro da galeria | Destaque para declarar variáveis antes do while quando precisar após. |
| Break e continue em nível inicial | Nota explicativa | Dois painéis de código lado a lado com comentários. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Diagnóstico e correção dos 10 erros clássicos do while. |
| Atividade prática e commits | Terminal de Entrega e Diário | PowerShell para criação de 17 arquivos Java e commit Git limpo. |
| Critérios de Conclusão | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 17 programas do lab foram agrupados em 9 domínios na galeria de padrões, evitando repetição de explicações idênticas.
- O animador de fluxo cobre crescente, decrescente e zero iterações num único componente com modo selecionável.

## Lacunas resolvidas

- O animador visual de iterações passo-a-passo é a ferramenta que o debugger do IntelliJ fornece, mas agora disponível no navegador: o aluno vê a condição sendo avaliada antes de cada bloco, tornando tangível o "while testa antes".
- O simulador de acumulador mostra visualmente a diferença entre contador (controla) e acumulador (guarda valor), respondendo a um dos erros mais frequentes (Erro 8).
