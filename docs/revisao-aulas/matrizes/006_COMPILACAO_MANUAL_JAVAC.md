# Matriz de cobertura — aula 006

## Identificação

- ID: `006_M0_06_COMPILACAO_MANUAL_COM_JAVAC`
- Título antigo: Compilação Manual com `javac`
- Arquivo original: `docs/aulas/006_M0_06_COMPILACAO_MANUAL_COM_JAVAC.md`
- Módulo e posição: M0.06
- Aula anterior relevante: aula 005 reconstruída — JDK, runtime, JVM e LTS
- Aula seguinte relevante: `007_M0_07_INTELLIJ_IDEA_COMMUNITY_COMPLETO.md`
- Arquétipo escolhido: oficina de compilação com editor, terminal, artefatos e classpath visíveis
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Ao final, o aluno conseguirá compilar e executar programas Java de uma e de várias classes sem depender da IDE, distinguir falhas de compilação e de execução pela evidência apresentada, detectar bytecode desatualizado, controlar a pasta de saída com `-d` e explicar como `-cp` permite ao launcher localizar as classes.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Fluxo `.java → javac → .class → java → JVM` | Conceito central | Sim | Etapas 1 e 2 | Pipeline por fases e laboratório sincronizado |
| Compilador lê fonte, valida regras e gera bytecode | Conceito | Sim | Etapas 1, 2 e 3 | Mapa de responsabilidades e clínica do compilador |
| Compilar não executa `println` | Distinção | Sim | Etapas 1 e 2 | Terminal mostra `javac` silencioso e `java` produzindo saída |
| Erro de compilação versus erro de execução | Diagnóstico | Sim | Etapas 3 e 4 | Comparador com semicolon e `ArithmeticException` |
| `.java` é fonte; `.class` é gerado, recriável e não editável | Regra | Sim | Etapas 1, 2 e 8 | Árvore, cartões de artefatos e `.gitignore` |
| Assinatura `public static void main(String[] args)` | Conceito | Sim | Etapa 5 | Anatomia interativa do ponto de entrada |
| Classe pode compilar sem `main`, mas não iniciar diretamente | Erro | Sim | Etapas 4 e 5 | Caso executável versus biblioteca |
| Criar laboratório em `C:\dev\labs\compilacao-manual` | Atividade | Sim | Etapa 2 | Terminal cumulativo e árvore de arquivos |
| `New-Item Main.java`, `ls`, `javac Main.java`, `java Main` | Comandos | Sim | Etapa 2 | Comando, saída, significado e confirmação em cada passo |
| `java Main` recebe classe; `java Main.class` está errado | Regra | Sim | Etapas 2 e 7 | Comparador do launcher e erro explicado |
| Alterar fonte exige recompilar | Experimento | Sim | Etapa 4 | Linha do tempo fonte nova × `.class` antigo × nova compilação |
| Nome da classe pública deve combinar com o arquivo | Regra/erro | Sim | Etapa 3 | Editor com erro, diagnóstico e correção |
| Duas classes `Mensagem` e `Programa` | Prática | Sim | Etapa 6 | Editores, grafo de dependência, compilação e saída |
| `javac Programa.java` pode localizar e compilar fonte dependente | Nuance | Sim | Etapa 6 | Comparador de estratégias e condições explícitas |
| `javac Mensagem.java Programa.java` | Comando | Sim | Etapa 6 | Estratégia explícita reproduzível |
| `javac *.java` no PowerShell | Comando | Sim | Etapa 6 | Estratégia para laboratório pequeno e limite profissional |
| Primeira noção de classpath | Conceito | Sim | Etapa 7 | Localizador visual de classes |
| Pasta atual, `.class` ausente, nome incorreto e classpath incorreto | Diagnóstico | Sim | Etapa 7 | Casos de localização e recuperação |
| Separar fonte e saída compilada | Organização | Sim | Etapa 7 | `javac -d out *.java` e `java -cp out Programa` |
| Classes corporativas colaborando | Contexto | Sim | Etapa 8 | Grafo de domínio e causas de classe ausente |
| Build profissional: testar, compilar, empacotar, implantar | Contexto | Sim | Etapa 8 | Linha de produção até JAR/container |
| IDE automatiza compilação, saída, classpath e execução | Ponte | Sim | Etapa 8 | Mapa “botão Run por baixo” e ponte para Aula 007 |
| Maven compila `src/main/java` para `target/classes` | Contexto | Sim | Etapa 8 | Comparador manual × IDE × Maven |
| Git guarda fontes e ignora `.class`, `out/`, `target/` | Regra | Sim | Etapa 8 | Quadro versionar/ignorar e `.gitignore` copiável |
| Dez erros comuns do original | Diagnóstico | Sim | Etapas 3, 4 e 7 | Clínica por fase com inspecionar, corrigir e confirmar |
| Prática completa simples, recompilação e duas classes | Atividade | Sim | Etapas 2, 4, 6 e 9 | Um laboratório cumulativo sem reiniciar o contexto |
| Diário e critérios de conclusão | Registro | Sim | Etapa 9 | Diário copiável e desafio de transferência |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| `.java → .class → execução` | Abertura, teoria, exemplo, prática, backend e fechamento | Manter um pipeline fixo que muda de estado | A relação reaparece visualmente sem repetir parágrafos |
| Laboratório `Main.java` | Exemplo mínimo e prática recomendada | Consolidar em um laboratório cumulativo | O aluno executa uma vez e depois provoca mudanças reais no mesmo estado |
| Erros de pasta, arquivo e classe | Classpath, dez erros e prática | Agrupar por fase observável | Sintoma passa a levar a uma verificação objetiva |
| Fonte e compilado no Git | Seções `.java`, `.class`, Git e Maven | Unificar na etapa de automação profissional | Preserva a regra e mostra seu motivo no fluxo de build |

## Lacunas e correções planejadas

| Lacuna | Consequência | Correção na aula nova |
|---|---|---|
| `javac` sem saída era tratado apenas como sucesso | Aluno não sabia confirmar o artefato | Explicar que silêncio indica ausência de diagnóstico, e confirmar com `ls`/`Test-Path` |
| Saídas de erro eram genéricas | Aluno não aprendia a ler arquivo, linha, coluna e acento circunflexo | Mostrar diagnósticos realistas e decompor cada parte |
| “A JVM procura na pasta atual por padrão” não mencionava `CLASSPATH` | Regra parecia absoluta | Explicar que, sem `-cp`, vale `CLASSPATH` se definido; caso contrário, a pasta atual |
| Fonte e `.class` ficavam juntos durante toda a aula | Não preparava a estrutura da IDE/Maven | Introduzir `-d out` e execução explícita com `-cp out` após o fluxo mínimo |
| Compilação implícita da dependência parecia garantida em qualquer arranjo | Criava expectativa errada | Explicar busca por fonte e recomendar lista explícita/`*.java` no laboratório pequeno |
| Fechamento prometia uma próxima aula de classpath, mas a Aula 007 é IntelliJ | Quebrava o encadeamento real | Encerrar mostrando como o IntelliJ automatiza exatamente este pipeline |
| Não havia visual de estado do disco | `.class` e recompilação continuavam abstratos | Árvore sincronizada, datas simbólicas e pasta `out` visível |
| Não havia desafio de diagnóstico por evidência | Bastava decorar comandos | Entregar cenários mistos e exigir fase, causa, comando de inspeção e confirmação |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Separar escrever, compilar e executar | Pipeline e seletor de fase | fonte, compilador, bytecode, launcher e JVM |
| 2 | Compilar o primeiro programa | Editor, terminal e árvore sincronizados | criação, `javac`, silêncio, confirmação e `java Main` |
| 3 | Ler e corrigir erros do compilador | Editor com marcação e diagnóstico de terminal | sintaxe, chaves, nome público/arquivo e localização |
| 4 | Comparar falhas e recompilar | Linha do tempo e comparador de erros | compilação × execução × bytecode antigo |
| 5 | Entender o ponto de entrada | Anatomia selecionável de `main` | `public`, `static`, `void`, `main`, `String[] args` |
| 6 | Compilar duas classes | Grafo de dependência, dois editores e três estratégias | resolução de dependência e vários `.class` |
| 7 | Controlar saída e classpath | Diagrama de pastas e localizador da JVM | `-d out`, `-cp out`, pasta atual e classe ausente |
| 8 | Relacionar a IDE, Maven, Git e produção | Mapa de automação e fluxo de entrega | `out`, `target/classes`, JAR, container e arquivos gerados |
| 9 | Diagnosticar e documentar | Clínica final, desafio e diário copiável | transferência, critérios de conclusão e autonomia |

## Recursos necessários

- [x] Código Java e PowerShell com destaque de sintaxe.
- [x] Terminal com comandos, saídas, silêncio explicado e confirmação.
- [x] Mock de editor com erro, linha, coluna e indicador visual.
- [x] Árvore de arquivos sincronizada com fonte, `.class` e `out`.
- [x] Diagramas de pipeline, dependências e classpath.
- [x] Laboratórios interativos de uma e duas classes.
- [x] Comparador de erro de compilação e execução.
- [x] Mapa IDE/Maven/Git/produção.
- [x] Diário copiável e desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Todos os comandos do laboratório possuem contexto e confirmação.
- [x] Os dez erros comuns foram absorvidos pela clínica por fases.
- [x] A prática de recompilação e as duas classes foram preservadas.
- [x] O classpath inicial foi aprofundado sem antecipar pacotes, módulos ou JARs.
- [x] Repetições removidas não carregavam nuance técnica exclusiva.
- [x] A aula usa a plataforma validada na Aula 005 sem reensinar instalação.
- [x] A saída organizada prepara a Aula 007 sem ensinar a interface do IntelliJ antes da hora.

## Validação final

- [x] Build aprovado.
- [x] Lint sem novos erros.
- [x] `git diff --check` aprovado.
- [ ] Desktop verificado.
- [ ] Celular verificado.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] A aula e a próxima aula ficam bloqueadas enquanto houver etapas pendentes.
- [ ] Existe somente um controle de conclusão geral da aula.
- [x] Código copiável e com destaque de sintaxe.
- [x] Textos, comandos e saídas revisados.
- [x] Responsável pelo curso aprovou.
