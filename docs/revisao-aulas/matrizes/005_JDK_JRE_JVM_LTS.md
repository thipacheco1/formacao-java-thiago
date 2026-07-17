# Matriz de cobertura — aula 005

## Identificação

- ID: `005_M0_05_JDK_JRE_JVM_E_ESCOLHA_DE_VERSAO_LTS`
- Título antigo: JDK, JRE, JVM e Escolha de Versão LTS
- Arquivo original: `docs/aulas/005_M0_05_JDK_JRE_JVM_E_ESCOLHA_DE_VERSAO_LTS.md`
- Módulo e posição: M0.05
- Aula anterior relevante: aula 004 reconstruída — terminal, PowerShell e diagnóstico
- Aula seguinte relevante: `006_M0_06_COMPILACAO_MANUAL_COM_JAVAC.md`
- Arquétipo escolhido: laboratório visual da plataforma Java com terminal e pipeline executável
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Ao final, o aluno conseguirá desenhar e explicar o fluxo `Main.java → javac → Main.class → JVM → saída`, distinguir JDK, runtime/JRE e JVM sem tratar as siglas como caixas mágicas, validar a coerência do ambiente Java no PowerShell e compilar e executar um programa mínimo com evidências observáveis.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Checklist de JDK, `JAVA_HOME`, `PATH`, `java`, `javac`, localização e programa mínimo | Verificação | Sim | Etapas 5, 6, 7 e 10 | Painel de coerência, terminal guiado e checklist final |
| Java como linguagem, plataforma e ecossistema | Conceito | Sim | Etapa 1 | Mapa explorável com exemplos e fronteiras |
| Fluxo `.java → javac → .class → JVM → execução` | Conceito central | Sim | Etapas 1, 3 e 7 | Pipeline animado e laboratório com árvore de arquivos |
| Diferenciar erro de ambiente, compilação, execução e configuração | Diagnóstico | Sim | Etapas 3, 6 e 10 | Classificador por fase e evidência |
| JVM executa bytecode | Conceito | Sim | Etapas 2 e 3 | Diagrama de responsabilidades e pipeline |
| JVM como camada de portabilidade entre bytecode e sistema operacional | Conceito | Sim | Etapa 2 | Diagrama Windows/Linux/macOS com JVM própria |
| Limites da portabilidade | Nuance | Sim | Etapa 2 | Nota sobre dependências, SO, arquitetura e configuração |
| Bytecode como formato intermediário | Conceito | Sim | Etapa 3 | Comparador `.java`, `.class` e instruções simbólicas |
| `.java` é fonte; `.class` é gerado e não deve ser editado/versionado | Regra | Sim | Etapas 3 e 7 | Árvore com origem e artefato, conexão com `.gitignore` |
| JRE como ambiente para executar | Conceito histórico | Sim | Etapa 2 | Linha histórica e modelo moderno de runtime modular |
| JDK como kit para desenvolver | Conceito | Sim | Etapa 2 | Inventário visual `java`, `javac`, `javadoc`, `jar`, runtime |
| Relação JVM/JRE/JDK | Conceito | Sim | Etapa 2 | Modelo em camadas com ressalva de que não são apenas pastas encaixadas |
| `javac` compila e `java` inicia a execução | Comandos | Sim | Etapas 3 e 7 | Comandos, ausência/presença de saída e mudança de estado |
| `java Main` recebe nome da classe, não `Main.class` | Regra | Sim | Etapas 3, 7 e 10 | Comparador correto/incorreto e erro explicado |
| Noção inicial de classpath | Ponte | Sim | Etapas 3 e 7 | JVM procura `Main` no local de classes; aprofundamento reservado à Aula 006 |
| LTS e estabilidade corporativa | Conceito | Sim | Etapa 4 | Linha do tempo e decisão por baseline |
| JDK 21 LTS como padrão da formação | Decisão curricular | Sim | Etapa 4 | Baseline destacado e regra de consistência |
| Evolução desde Java 8 e leitura de legado | Contexto | Sim | Etapa 4 | Comparação 8/11/17/21/25 e recursos modernos |
| Atualização temporal: Java 25 também é LTS desde 2025 | Correção atual | Sim | Etapa 4 | Linha do tempo datada sem apagar o baseline 21 |
| `JAVA_HOME` aponta para raiz do JDK, não `bin` | Configuração | Sim | Etapa 5 | Diagrama raiz/bin e diagnóstico correto/incorreto |
| `PATH` permite localizar `java.exe` e `javac.exe` | Configuração | Sim | Etapa 5 | Fluxo prompt → PATH → executável |
| `java -version` | Comando | Sim | Etapa 5 | Saída realista com campos variáveis explicados |
| `javac -version` | Comando | Sim | Etapa 5 | Saída e comparação da versão principal |
| Localizar `java` e `javac` | Diagnóstico | Sim | Etapa 5 | Correção para `Get-Command` e `where.exe` |
| Consultar `$env:JAVA_HOME` | Diagnóstico | Sim | Etapa 5 | Saída esperada e estrutura visual |
| Ambiente saudável e coerência das versões | Critério | Sim | Etapa 6 | Painel verde apenas quando todas as evidências combinam |
| Múltiplas instalações | Erro/diagnóstico | Sim | Etapa 6 | Caso com duas origens e ordem do `PATH` |
| Runtime acessível sem compilador | Erro/diagnóstico | Sim | Etapa 6 | `java` funciona, `javac` ausente e decisão correta |
| Terminal antigo após alterar variável | Erro/diagnóstico | Sim | Etapa 6 | Ponte explícita com herança de sessão da Aula 004 |
| Criar `C:\dev\labs\java-plataforma` | Atividade | Sim | Etapa 7 | Terminal cumulativo e árvore visível |
| Criar e preencher `Main.java` | Código | Sim | Etapa 7 | Editor com destaque estilo IDE e arquivo copiável |
| Compilar e observar `Main.class` | Prática | Sim | Etapa 7 | Árvore muda após `javac Main.java` |
| Executar e observar a saída | Prática | Sim | Etapa 7 | Console mostra duas mensagens do programa |
| O programa mínimo prova ambiente, localização, nomes, compilação e execução | Interpretação | Sim | Etapa 7 | Quadro “o que esta evidência prova” |
| Alterar `.java` sem recompilar mantém `.class` antigo | Experimento | Sim | Etapa 8 | Editor novo × bytecode antigo × saída antiga, depois recompilação |
| Nome da classe pública deve combinar com o arquivo | Erro | Sim | Etapa 8 | Caso `Main.java` com `public class Programa` |
| IDE pode usar JDK diferente do terminal | Contexto/erro | Sim | Etapa 9 | Comparador terminal × Project SDK |
| Maven e Gradle automatizam compilação | Contexto | Sim | Etapa 9 | Mapa de automação sobre o mesmo pipeline |
| Docker precisa de runtime compatível | Contexto | Sim | Etapa 9 | Fluxo build JDK → artefato → runtime/container |
| Produção: JVM, memória, GC, threads, métricas e logs | Contexto futuro | Sim | Etapa 9 | Mapa de observabilidade sem aprofundamento prematuro |
| Spring Boot exige versão coerente local/pipeline/produção | Contexto corporativo | Sim | Etapas 6 e 9 | Matriz de ambientes e incompatibilidade |
| Dez erros comuns do original | Erros | Sim | Etapas 6, 8 e 10 | Clínica com sintoma, causa, verificação, correção e confirmação |
| Diário de validação | Registro | Sim | Etapa 10 | Documento Markdown copiável |
| Critérios de conclusão | Verificação | Sim | Etapa 10 | Desafio de auditoria e checklist observável |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| `javac` compila e `java` executa | Fluxo, comandos, exemplo, erros, prática e fechamento | Tornar o pipeline interativo recorrente | Repete a relação visual, não os mesmos parágrafos |
| Checklist de versões e caminhos | Validação, ambiente saudável, exemplo e erros | Unificar em auditoria de coerência | Cada comando passa a alimentar um diagnóstico |
| Papel de JDK/JRE/JVM | Definições, relação e conclusão | Usar um único modelo em camadas | Mantém nuances e evita três definições isoladas |
| Importância no backend | Abertura, empresa, IDE, Maven, Docker, produção e fechamento | Consolidar no mapa de ambientes | Preserva todas as relações em uma sequência causal |
| Laboratório `Main.java` | Exemplo mínimo e prática recomendada | Um laboratório cumulativo | Evita refazer a mesma criação e mantém o experimento de recompilação |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| JDK/JRE/JVM eram apresentados como caixas encaixadas sem contexto histórico | Modelo fica impreciso em JDKs modulares modernos | Separar responsabilidade conceitual, implementação e distribuição histórica do JRE |
| A afirmação “JDK 21 é a versão moderna” ficou temporalmente incompleta | Em 2026 o aluno pode ver JDK 25 LTS e achar o curso desatualizado | Explicar que 25 é a LTS mais nova, enquanto 21 permanece o baseline deliberado da formação |
| O modo `java Main.java` existente desde Java 11 não era mencionado | Aluno pode ver comando válido em tutorial e achar que contradiz a aula | Mostrar a exceção moderna e explicar por que o curso treina as duas fases explícitas |
| `where java` é ambíguo no PowerShell | Pode invocar um nome do PowerShell em vez do localizador do Windows | Usar `Get-Command java` e `where.exe java`, mantendo a intenção original |
| Não havia guia de instalação/tela quando JDK estivesse ausente | Aluno travava antes da validação | Mostrar mock do Windows para localizar variáveis e indicar instalador/distribuição sem fingir captura real |
| Saídas de versão apareciam como espaços em branco no diário | Aluno não sabia quais partes comparar | Mostrar saídas realistas, campos variáveis e versão principal relevante |
| `JAVA_HOME` parecia requisito direto do comando `java` | Confundia `PATH` com variável usada por ferramentas | Mostrar que `PATH` localiza executáveis e que ferramentas podem consultar `JAVA_HOME` |
| Ambiente saudável era uma lista, não um diagnóstico | Inconsistências não ficavam visíveis | Painel cruza runtime, compilador, origem e raiz do JDK |
| Compilação mínima não mostrava o estado do disco mudando | `.class` continuava abstrato | Terminal, editor e árvore sincronizados |
| A prática avançava demais sobre compilação, repetindo a Aula 006 | Progressão ficava redundante | Manter uma prova mínima e reservar erros, múltiplas classes e classpath aprofundado à Aula 006 |
| Não havia desafio de transferência | Bastava repetir `Main.java` | Auditar três ambientes fictícios e justificar qual está apto para desenvolver |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Separar linguagem, plataforma e ecossistema | Mapa explorável e pipeline central | escopo da aula e transformação |
| 2 | Montar o modelo JDK/runtime/JVM | Camadas, ferramentas e três sistemas operacionais | responsabilidades, JRE histórico e portabilidade |
| 3 | Percorrer fonte, bytecode e execução | Pipeline passo a passo com artefatos | `javac`, `java`, `.java`, `.class`, JVM e modo fonte |
| 4 | Escolher e justificar a baseline | Linha do tempo LTS 8–25 | estabilidade, legado, 21 do curso e 25 atual |
| 5 | Validar a instalação | Terminal com cinco inspeções e diagrama de diretório | versões, `Get-Command`, `where.exe`, `JAVA_HOME` e `PATH` |
| 6 | Diagnosticar coerência | Casos saudável/inconsistente/ausente/múltiplo | ambiente, sessão, pipeline e produção |
| 7 | Compilar e executar o primeiro programa | Editor, terminal, árvore e console sincronizados | prova mínima completa da plataforma |
| 8 | Produzir e corrigir falhas | Fonte novo × class antigo e clínica de erros | recompilação, nomes e `java Main` |
| 9 | Relacionar às ferramentas profissionais | Mapa IDE/Maven/Docker/produção | automação sem apagar fundamentos |
| 10 | Auditar um ambiente e registrar | Desafio, checklist e diário copiável | transferência e conclusão verificável |

## Recursos necessários

- [x] Código Java e PowerShell com destaque de sintaxe.
- [x] Terminal com comando, saída, significado e variação.
- [x] Editor Java e árvore de arquivos sincronizados.
- [x] Diagramas de camadas, pipeline e portabilidade.
- [x] Linha do tempo de versões LTS.
- [x] Mock orientativo de configuração no Windows.
- [x] Painel de diagnóstico de ambiente.
- [x] Cenários de erro e recuperação.
- [x] Diário copiável e desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Todo comando possui contexto, saída esperada e confirmação.
- [x] Todos os dez erros relevantes possuem destino e recuperação.
- [x] O laboratório consolidado preserva compilação, execução e recompilação.
- [x] Conteúdo de JDK/JRE/JVM foi aprofundado, não simplificado por remoção.
- [x] Repetições removidas não carregavam nuance técnica exclusiva.
- [x] A autonomia de PowerShell da Aula 004 é usada sem reensiná-la.
- [x] Múltiplas classes e classpath detalhado permanecem reservados à Aula 006.

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
