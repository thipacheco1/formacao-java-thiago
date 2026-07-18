# Matriz de cobertura — Aula 062

- Original: `062_M2_01_JVM_BYTECODE_E_EXECUCAO_POR_BAIXO_OFICIAL.md`
- Componente: `GuidedJvmBytecodeLesson062.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual da execução Java com pipeline, terminal, desmontagem de bytecode, classloading, diagnóstico por fase, runtime adaptativo, clínica e entrega.

## Transformação pedagógica

O aluno deixa de tratar `javac` e `java` como dois comandos mágicos. Ele acompanha fonte, artefato, carregamento, ponto de entrada e execução; inspeciona bytecode; provoca falhas em camadas diferentes; relaciona a mesma fundação a JAR e Spring Boot; e termina com evidências reproduzíveis no terminal, debug, diário e Git.

## Cobertura rastreável

| Conteúdo ou competência do original | Destino na experiência reconstruída | Evidência observável |
|---|---|---|
| Código-fonte, `.java`, `javac`, `.class`, bytecode, `java`, JVM e `main` | Etapa 1 — Mapa da Execução | Pipeline interativo de quatro estados com ferramenta, papel e evidência de cada fronteira |
| Nuance de execução direta de source file em Java moderno | Etapa 1 — nota do fluxo clássico | Explicação explícita de por que a oficina escolhe `javac` + `java NomeDaClasse` |
| JDK, runtime/JRE e JVM | Etapa 2 — JDK, Runtime e JVM | Explorador de seis responsabilidades com a nuance de distribuições modernas sem JRE separado |
| Ferramentas `javac`, `java`, `javap`, `jar`, `javadoc`, `jshell` e diagnóstico | Etapa 2 | Painel JDK e cartões específicos de `javac`, `java` e `javap` |
| Versões do compilador e runtime; compatibilidade | Etapas 2 e 6 | Comandos `java -version`, `javac -version` e caso `UnsupportedClassVersionError` |
| Criar pasta, fonte mínimo, compilar, listar `.java`/`.class`, executar e interpretar saída | Etapa 3 — Fonte e Artefato | Bancada sincronizada de arquivos e terminal; programa completo com saída `Resultado: 30` |
| `.class` binário, não editar manualmente | Etapas 3 e 9 | Evidência do artefato e diagnóstico específico da Clínica de Erros |
| Recompilação esquecida e bytecode antigo | Etapas 3, 6 e desafio | Estado visual do fonte alterado com `.class` antigo; desafio exige provar as duas versões |
| `javap` e `javap -c` | Etapa 4 — Bytecode com javap | Saída aproximada completa e seletor que liga sete grupos de instruções ao fonte |
| Significado conceitual de carregamento, chamada, soma, impressão e retorno | Etapa 4 | Explicação por instrução sem exigir memorização de opcodes |
| Exemplo `CalculadoraBytecode`, método `somar` e chamada/retorno | Etapas 3 e 4 | Código completo, compilável, destacado e desmontado |
| Assinatura de `main` e classe sem ponto de entrada | Etapas 5 e 6 | Fluxo de entrada e caso `Main method not found` separado de compilação |
| Classloader básico | Etapa 5 — main, Loader e Classpath | Sequência interativa de solicitação, localização, carregamento, dependência, entrada e execução |
| Duas classes, dependência `Mensagem` e classe ausente | Etapa 5 | Código das duas classes e experimento de remover `Mensagem.class` |
| Classpath atual, `-cp`, diretórios, JARs e dependências | Etapas 5 e 9 | Comando `java -cp . ProgramaComDuasClasses` e diagnóstico de classpath |
| Erro de compilação versus erro de execução | Etapa 6 — Fases da Falha | Comparador entre falha do `javac`, aritmética dentro da JVM, main ausente, dependência ausente e versão |
| Ponto e vírgula ausente e divisão inteira por zero | Etapa 6 | Comando, mensagem aproximada, fase e interpretação de cada caso |
| Nome do arquivo e classe pública | Etapas 6 e 9 | Regra visível e caso próprio da Clínica de Erros |
| Executar nome de classe sem `.class`; executar classe errada | Etapas 3, 6 e 9 | Comando correto, regra de nome binário e diagnóstico; escolha da classe é explicada pelo launcher |
| Portabilidade e JVM compatível em Windows, Linux e macOS | Etapa 7 — Portabilidade e JIT | Fluxo de bytecode portável para runtime; compatibilidade tratada como condição, não promessa absoluta |
| Trade-offs: runtime, memória, inicialização, versão, heap/GC e performance | Etapas 2 e 7 | Responsabilidades da JVM e ressalvas do runtime; memória aprofundada é mantida para a aula seguinte |
| Interpretação conceitual | Etapa 7 | Estado “Início da aplicação” destaca execução intermediária pela JVM |
| JIT, código quente e aplicações longas | Etapa 7 | Alternância entre início e trecho quente, com conclusão segura e exemplo `LoopQuente` |
| Cuidado com benchmark ingênuo | Etapa 7 | Alerta explícito contra conclusões a partir de `System.currentTimeMillis()` e uma execução |
| Relação com backend e Spring Boot | Etapa 8 — JAR e Spring Boot | Pipeline classes/recursos → JAR → `java -jar` → contexto/servidor |
| Conceito de JAR, manifest, recursos e distribuição | Etapa 8 | Cartão de artefato e comparação `java Classe` versus `java -jar` |
| Refatoração mental para build, runtime, versão, classpath e ambiente | Etapas 5, 6, 8 e 9 | Diagnóstico por camada substitui tentativa aleatória |
| Dez erros comuns do original | Etapa 9 — Clínica de Erros | Dez casos independentes com sintoma/causa e correção verificável |
| Atividade guiada e comandos usados | Etapa 10 — Entrega & Desafio | Sequência copiável de preparação, construção, inspeção e versionamento |
| Onze arquivos sugeridos | Etapas 3–7 e entrega | Exemplos centrais preservados; casos redundantes são consolidados por fenômeno sem perder a competência |
| Debug com breakpoint e Step Into em `somar` | Etapa 10 | Checklist exige entrar no método, retornar ao `main` e comparar com `javap -c` |
| Diário de bordo e critério de conclusão | Etapa 10 | Bloco copiável de doze evidências e checklist interativo de dez provas |
| Git status, diff, staged, commit limpo e `.class` ignorado | Etapa 10 | Sequência nominal de Git e evidência obrigatória sobre `.gitignore` |
| Transferência sem copiar o roteiro | Etapa 10 — desafio | Experimento `Recompilacao.java` exige explicar fonte, artefato e saída em dois estados |
| Próxima fronteira: stack, heap e referências | Navegação curricular | Rodapé avança para a Aula 063 somente após etapas e aula concluídas |

## Consolidações sem perda

- `Main`, `ProgramaA`, `ProgramaB` e `Recompilacao` ensinavam a mesma fronteira entre nome de classe, artefato selecionado e recompilação. A oficina preserva as três competências em estados distintos do terminal, nas regras de diagnóstico e no desafio de transferência, sem obrigar repetição mecânica de quatro arquivos quase iguais.
- `ErroCompilacao`, `ErroExecucao` e `SemMain` permanecem separados porque falham em fases diferentes.
- `ProgramaComDuasClasses` e `Mensagem` permanecem como experimento próprio porque classloading e classpath não podem ser reduzidos a uma definição.
- `LoopQuente` permanece explicitamente conceitual e não é apresentado como benchmark.

## Verificações técnicas previstas

- Dez etapas, incluindo Clínica de Erros e Entrega & Desafio independentes.
- Todos os tipos de bloco possuem renderizador.
- Programa principal extraído do componente e compilado com `javac`.
- Dez diagnósticos, dez evidências e sete grupos de bytecode.
- Progresso filtrado, normalização de conclusão, foco móvel e portão para a próxima aula.
- Clínica usa círculo apenas no primeiro `span` e título em `guided-error-label`.
- Layout reorganizado em 1050, 900, 720, 560 e 380 px, sem alterar o `sticky` compartilhado.
- Lint, build e `git diff --check`; inspeção visual permanece pendente até execução em navegador.
