# Matriz de cobertura — Aula 030

## Identificação

- Aula original: `docs/aulas/030_M1_10_ENTRADA_DE_DADOS_COM_SCANNER_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/029_M1_09_STRING_BASICA_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/031_M1_11_OPERADORES_ARITMETICOS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedScannerInputLesson030.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedScannerInputLesson.css`
- Arquétipo: oficina de entrada interativa de dados com simulador dinâmico de fila do buffer, conversão de Locale e clínica de erros
- Estado: implementada e auditada tecnicamente em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 029 consolidou a manipulação e validação estática de variáveis do tipo String. A Aula 030 avança para a entrada dinâmica de dados externos via Console utilizando a classe `Scanner`.
- A Aula 031 introduzirá os operadores aritméticos em Java. O escopo da Aula 030 está restrito a ler dados da entrada padrão (`System.in`), guardá-los em variáveis adequadas e validar a consistência elementar das entradas.
- O tratamento robusto de erros em tempo de execução (como blocos try-catch para capturar falhas de digitação) ou loops de repetição de menus são apenas sinalizados de forma teórica. O foco absoluto está na lógica do Scanner e no controle físico da fila de buffer de caracteres.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| O que é Scanner e entrada padrão | Painel conceitual de arquitetura | Explicação teórica sobre System.in e teclado. |
| Importando `java.util.Scanner` | Painel conceitual de imports | Destaque visual sobre a necessidade de imports para classes que não pertencem ao pacote padrão lang. |
| Exemplo mínimo Scanner com nextLine() | Simulador de Entrada Dinâmica | Console virtual onde o aluno digita e vê a resposta "Olá, <Nome>!". |
| Fechar o scanner com `close()` | Terminal de Boas Práticas | Alerta sobre o descarte de recursos físicos abertos pelo sistema operacional. |
| Cuidados com close() no System.in | Terminal de Boas Práticas | Explicação de que fechar o System.in impede novas leituras globais no mesmo processo. |
| Método `nextInt()` | Simulador de Entrada Dinâmica | Campo que lê inteiros e gera alertas em caso de caracteres textuais. |
| Método `nextDouble()` | Simulador de Entrada Dinâmica | Campo de decimais com validação regional. |
| Configuração de Locale decimal (US vs BR) | Simulador de Locale | Aluno chaveia o Locale e digita `99,90` e `99.90` observando aceitação/rejeição. |
| Importando `java.util.Locale` | Simulador de Locale | Instruções de importação da biblioteca regional. |
| Onde aplicar `Locale.US` | Simulador de Locale | Exemplo com `scanner.useLocale(Locale.US)`, evitando alterar globalmente outras partes da aplicação. |
| Diferença entre `next()` e `nextLine()` | Tabela comparativa e interativo | Aluno digita "Ana Silva" e vê o retorno de ambas as funções lado a lado. |
| O clássico problema do buffer | Simulador do Buffer (Fila) | Animação onde caracteres do número e a quebra `\n` entram na fila da JVM. |
| Prática de quebra de fluxo sem limpeza | Simulador do Buffer (Fila) | Aluno vê o `nextLine()` sugar o `\n` pendente e pular a pergunta de nome. |
| Correção com `scanner.nextLine()` para limpar buffer | Simulador do Buffer (Fila) | Animação consumindo o `\n` e liberando o console para nova digitação. |
| Alternativa de conversão de string com parseInt/parseDouble | Seção de arquiteturas avançadas | Menção preliminar sobre como APIs profissionais validam dados de forma dissociada. |
| Exemplo aplicado: CadastroSimples | Galeria de Casos de Domínio | Código e console de leitura de nome, idade e valor. |
| Exemplo aplicado: CadastroComObservacao | Galeria de Casos de Domínio | Código aplicando limpeza de buffer entre tipos numéricos e textuais. |
| Exemplo aplicado: CadastroClienteConsole | Galeria de Casos de Domínio | Combinação de Scanner com isBlank, contains e length para CPF. |
| Exemplo aplicado: CadastroPedidoConsole | Galeria de Casos de Domínio | Leitura numérica e lógica de frete. |
| Exemplo aplicado: CadastroOrdemServicoConsole | Galeria de Casos de Domínio | Exemplo avançado de OS com limpeza de buffer aplicada. |
| Exemplo aplicado: CadastroProdutoConsole | Galeria de Casos de Domínio | Leitura completa de texto, inteiros e decimais com Locale. |
| Exemplo aplicado: RegistroAuditoriaConsole | Galeria de Casos de Domínio | Combinação de métodos para log interativo de sistema. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Diagnóstico completo de falhas clássicas de instanciamento, close antecipado, buffer e Locale. |
| Atividade prática com 11 arquivos locais | Terminal de Entrega e Diário | Comandos PowerShell para setup de pastas, compilação em lote e execução de testes locais. |
| Commits do Git e ignore de arquivos class | Terminal de Entrega | Passos de commits limpos. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de transformação pedagógica do aluno. |

## Repetições consolidadas

- Os 11 arquivos de códigos foram consolidados na Galeria de Casos de Domínio, permitindo que o aluno alterne entre eles rapidamente e compare as estruturas.
- As armadilhas de buffer foram consolidadas na animação visual interativa, evitando a necessidade de explicações textuais repetitivas em várias partes da aula.

## Lacunas resolvidas

- O problema de buffer deixa de ser um "mistério" de console: o aluno observa fisicamente o caractere oculto `\n` ficar preso na fila e ser erroneamente engolido pelo `nextLine()`, clarificando a causa raiz da falha em menos de 10 segundos.
- O aluno compreende na prática o impacto real do Locale ao experimentar a falha de digitação de vírgula contra ponto decimal em tempo real.
