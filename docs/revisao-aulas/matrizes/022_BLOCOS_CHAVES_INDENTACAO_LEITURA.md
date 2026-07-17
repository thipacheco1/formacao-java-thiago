# Matriz de cobertura — Aula 022

## Identificação

- ID: `022_M1_02_BLOCOS_CHAVES_INDENTACAO_E_LEITURA_DE_CODIGO_OFICIAL`
- Fonte auditada: `docs/aulas/022_M1_02_BLOCOS_CHAVES_INDENTACAO_E_LEITURA_DE_CODIGO_OFICIAL.md`
- Aula anterior: `021_M1_01_PRIMEIRO_PROGRAMA_JAVA_DESTRINCHADO_OFICIAL.md`
- Fronteira seguinte: `023_M1_03_COMENTARIOS_UTEIS_E_DOCUMENTACAO_INICIAL_OFICIAL.md`
- Arquétipo: oficina visual de leitura estrutural com árvore de pertencimento, formatação, IDE e clínica de chaves.
- Data da auditoria: 2026-07-17.

## Contrato pedagógico

Ao terminar, o aluno precisa conseguir transformar código Java visualmente opaco em uma árvore de blocos, parear cada chave com seu dono, ler de fora para dentro e de dentro para fora, explicar a diferença entre estrutura e indentação, usar o IntelliJ sem confiar cegamente na formatação, diagnosticar dez problemas e entregar três programas com evidências e Git limpo.

## Inventário integral da fonte

| Conteúdo original | Destino na experiência nova | Tratamento |
|---|---|---|
| Código como estrutura, não massa de símbolos | Mapa estrutural selecionável | Preservado como transformação inicial |
| Definição de bloco e locais em que aparece | Mapa e nota de fronteira curricular | Preservado; classe, método e `if` são praticados, demais locais são contextualizados sem antecipação |
| Chaves de abertura e fechamento | Laboratório de pares | Preservado com dono, linha, profundidade e alinhamento |
| Dois blocos do primeiro programa | Mapa `Main → main → println` | Preservado e conectado à Aula 021 |
| Aninhamento | Árvore e exemplos de domínio | Preservado com até quatro níveis observáveis |
| Leitura de fora para dentro | Lente de leitura externa | Preservado passo a passo |
| Leitura de dentro para fora | Lente investigativa interna | Preservado sobre o mesmo código |
| Indentação boa e ruim | Comparador em três estados | Preservado com código bagunçado, enganoso e formatado |
| Java depende de chaves, não de recuo | Regra `define → revela → confirma` | Preservado e tornado verificável |
| Quatro espaços por nível e cuidado com tabs | Laboratório de indentação | Preservado como convenção legível, sem declarar que o compilador exige |
| `Ctrl + Alt + L` | Mock interativo do IntelliJ | Preservado com estado antes/depois |
| Formatação não corrige intenção | Estado de indentação enganosa e alerta | Preservado e aprofundado |
| Escopo visual e preparação para escopo real | Laboratório de fronteiras | Preservado sem antecipar variáveis |
| Mapa mental classe, método, instruções | Árvores sincronizadas | Preservado em todos os exemplos centrais |
| Exemplo mínimo, `javac`, `java` e saída | Etapa final de laboratório | Preservado com silêncio esperado do compilador |
| Comentários didáticos de início/fim | Nota no pareamento de chaves | Preservado como técnica temporária; qualidade de comentários fica na Aula 023 |
| Múltiplas instruções e ordem | Caso de três instruções | Preservado com console exato |
| Bloco vazio | Caso selecionável | Preservado com ausência de saída explicada |
| Instrução fora do método | Laboratório de posicionamento e clínica | Preservado com diagnóstico representativo |
| Instrução fora da classe | Laboratório de posicionamento e clínica | Preservado com diagnóstico representativo |
| Chaves desalinhadas e regra visual de fechamento | Laboratório de pares e formatação | Preservado |
| `if` conceitual e retorno de nível | Casos, leitura e mapa de domínio | Preservado sem ensinar lógica condicional |
| `if` aninhado | Árvore de validação | Preservado |
| `ValidacaoPedido` | Bancada de domínio e laboratório final | Preservado com código e saída |
| `LeituraOrdemServico` e perguntas | Lente de leitura e bancada de domínio | Preservado com respostas explícitas |
| Importância em backend | Mapa de regras e alerta de aninhamento | Preservado com conexão a serviços, validação e erros |
| Leitura ativa por perguntas | Roteiro em cinco passos | Preservado e praticado |
| IntelliJ: par, guias, folding, formatação, avisos e Structure | Mock interativo | Preservado; simulação identificada |
| Atalhos `Ctrl+Shift+A`, `Alt+1`, `Shift Shift`, `Ctrl+E` | Rodapé do mock | Preservados com função de cada ação |
| Formatar código bagunçado A/B/C/D | Comparador e mock | Preservado integralmente |
| Linha B visualmente ligada ao `if` | Estado enganoso | Preservado com resposta estrutural |
| Dez erros e riscos | Clínica de dez casos | Preservados individualmente |
| Leitura guiada de `Analise` | Absorvida pelas lentes e árvores de ordem/validação | Consolidada sem perder a sequência de abrir, entrar, fechar e retornar |
| Atividade com três arquivos | Laboratório final | Preservada |
| Quebrar chave, ler erro e corrigir | Prova de recuperação | Preservado como ciclo obrigatório |
| `git status`, `git diff`, stage nominal, staged diff e commit | Entrega guiada | Preservado com proteção de `.class` e mudanças existentes |
| Diário e critério de conclusão | Documento de evidências e desafio | Preservados sem inventar execução local |

## Repetições consolidadas

- Definição, abertura, fechamento, alinhamento e pertencimento de chaves formam um único laboratório de pares, em vez de vários textos quase idênticos.
- Os mapas textuais repetidos viram árvores sincronizadas com os códigos reais.
- `ValidacaoPedido`, `LeituraOrdemServico` e o exemplo `Analise` compartilhavam a mesma competência de leitura aninhada; as duas variações de domínio permanecem executáveis e absorvem a leitura passo a passo.
- As explicações sobre indentação ruim, código colado e formatação automática são preservadas em três estados comparáveis.
- Os dez erros mantêm identidades próprias, mas usam o mesmo protocolo: sintoma, inspeção, causa, correção e nova prova.

## Correções e aprofundamentos necessários

- A fonte lista `switch`, `try`, `catch`, loops e blocos isolados sem demonstrá-los. A reconstrução os reconhece como locais futuros, mas não adiciona carga cognitiva antes das aulas correspondentes.
- A fonte não mostra a saída completa dos três programas na atividade. A reconstrução oferece saídas previstas e exige comparação com o computador do aluno.
- Mensagens do `javac` podem variar entre versões; os diagnósticos são identificados como representativos e a leitura se ancora em arquivo, linha, mensagem e causa estrutural.
- `Ctrl + Alt + L` não pode ser apresentado como reparo automático de intenção; o estado enganoso prova que as chaves continuam sendo a fonte estrutural.
- Instrução no corpo da classe pode coexistir com inicializadores em conteúdos futuros. Nesta fase, a regra inicial é explicitamente limitada a chamadas executáveis soltas e não é apresentada como descrição completa de toda a linguagem.
- A simulação do IntelliJ é identificada como didática e não como captura oficial.
- A conclusão da fonte não antecipa variáveis; a próxima aula correta é comentários úteis e documentação inicial.

## Fronteira com aulas vizinhas

- A Aula 021 apresentou somente os blocos mínimos de classe e `main`; a Aula 022 aprofunda pertencimento, aninhamento, formatação e falhas estruturais.
- A Aula 022 usa comentários `início/fim` apenas como andaime temporário. Critério, sintaxe e riscos de comentários pertencem à Aula 023.
- `if` usa `true` apenas para tornar blocos observáveis. Condições, operadores e fluxo condicional permanecem para suas aulas específicas.
- Escopo de variável, refatoração de aninhamento e inicializadores de classe não são ensinados prematuramente.

## Sequência reconstruída

1. Transformar o primeiro programa em uma árvore de três camadas.
2. Parear chaves de classe e método por dono, linha e profundidade.
3. Ler `LeituraOrdemServico` nas duas direções.
4. Comparar código sem recuo, recuo enganoso e formatação coerente.
5. Observar bloco vazio, sequência e aninhamento por código, árvore e console.
6. Mover a mesma intenção entre método, classe e exterior e interpretar o resultado.
7. Ler dois mapas de backend sem antecipar lógica de `if`.
8. Usar as lentes do IntelliJ para formatar, parear e recolher blocos.
9. Diagnosticar dez falhas ou riscos estruturais.
10. Construir três arquivos, quebrar uma chave, recuperar, registrar e revisar no Git.

## Recursos

- [x] Código Java com syntax highlighting e linhas numeradas.
- [x] Árvores interativas de pertencimento.
- [x] Pareamento visual de chaves.
- [x] Leitura externa e interna sobre o mesmo código.
- [x] Comparador de indentação em três estados.
- [x] Código, mapa e console sincronizados.
- [x] Laboratório de posicionamento com diagnóstico.
- [x] Mock interativo do IntelliJ identificado.
- [x] Clínica integral de dez casos.
- [x] Terminal guiado, documento de evidências e desafio final.

## Preservação

- [x] Todo conceito único da fonte possui destino explícito.
- [x] Os três programas da atividade continuam presentes.
- [x] `ValidacaoPedido` e `LeituraOrdemServico` preservam códigos e leitura de domínio.
- [x] Os dez erros e riscos permanecem diagnosticáveis individualmente.
- [x] Comandos, resultados esperados, interpretação e recuperação possuem destino.
- [x] Repetições foram consolidadas sem remover nuances.
- [x] `if`, comentários, variáveis, escopo real e refatoração profunda não foram antecipados.
- [x] Nenhuma execução, saída observada ou conclusão do aluno é inventada.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, largura intermediária e celular verificados em navegador.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] Aula e próxima aula ficam bloqueadas enquanto existirem etapas pendentes.
- [ ] Existe somente um controle de conclusão geral.
- [x] Código copiável e com destaque de sintaxe.
- [ ] Responsável pelo curso aprovou.

### Observação da auditoria

A fonte possui inventário técnico amplo e bons exemplos, mas repete definições em longas sequências textuais e deixa a maior parte da estrutura apenas para imaginação. A reconstrução conserva o conteúdo e transforma pertencimento, profundidade, formatação, saída, erro e recuperação em estados observáveis. Lint, dois builds, `diff --check` no escopo e rota HTTP 200 passaram; a aula permanece em revisão até inspeção visual das interações e aprovação do responsável.
