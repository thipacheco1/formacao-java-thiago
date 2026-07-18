# Revisão e reconstrução das aulas

Esta pasta é a fonte de verdade para reconstruir as aulas da Formação Java sem depender do histórico de um chat.

## Comece sempre por aqui

1. Leia integralmente [`BLUEPRINT_RECONSTRUCAO_AULAS.md`](BLUEPRINT_RECONSTRUCAO_AULAS.md).
2. Consulte [`CRONOGRAMA_COMPLETO.md`](CRONOGRAMA_COMPLETO.md) para saber o estado de cada aula.
3. Consulte [`STATUS_REVISAO.json`](STATUS_REVISAO.json) para o estado estruturado e as referências das aulas aprovadas.
4. Copie [`MODELO_MATRIZ_COBERTURA.md`](MODELO_MATRIZ_COBERTURA.md) durante a auditoria de cada nova aula.
5. Use as aulas 008 e 010 como referências executáveis, sem copiar cegamente um único formato.

## Números oficiais

- Existem 721 arquivos em `docs/aulas`.
- A aula `000` é a abertura.
- Existem 720 aulas numeradas de `001` a `720`.
- Portanto, o cronograma controla 721 itens para não perder a abertura.

## Referências aprovadas

### Aula 000 — orientação interativa e pacto de estudo

- `plataforma-curso/src/components/GuidedCourseOpeningLesson000.jsx`
- `plataforma-curso/src/components/guidedCourseOpeningLesson.css`
- `docs/revisao-aulas/matrizes/000_AULA_DE_ABERTURA.md`
- Conceito de referência: uma aula conceitual também precisa produzir decisões, evidências e um compromisso verificável; diagramas e simulações substituem listas quando relações são a própria matéria.

### Aula 001 — mentoria de mapa técnico interativo

- `plataforma-curso/src/components/GuidedCourseMapLesson001.jsx`
- `plataforma-curso/src/components/guidedCourseMapLesson.css`
- `docs/revisao-aulas/matrizes/001_MAPA_FORMACAO_E_CARREIRA.md`
- Conceito de referência: uma grade extensa deve ser ensinada por capacidades, dependências, riscos e evidências; o aluno explora os 21 módulos sem confundir conteúdo estudado com senioridade profissional.

### Aula 002 — consulta de mentoria e diagnóstico interativo

- `plataforma-curso/src/components/GuidedDiagnosticLesson002.jsx`
- `plataforma-curso/src/components/guidedDiagnosticLesson.css`
- `docs/revisao-aulas/matrizes/002_DIAGNOSTICO_INICIAL_E_PLANO.md`
- Conceito de referência: autoavaliação precisa ser calibrada por evidências; notas isoladas não substituem perguntas observáveis, interpretação de dependências, rotina sustentável e uma entrega revisável.

### Aula 003 — oficina visual de ambiente Windows

- `plataforma-curso/src/components/GuidedWindowsWorkspaceLesson003.jsx`
- `plataforma-curso/src/components/guidedWindowsWorkspaceLesson.css`
- `docs/revisao-aulas/matrizes/003_ORGANIZACAO_WINDOWS.md`
- Conceito de referência: organização do ambiente deve ser construída e verificada; mocks do Windows, árvore sincronizada, comandos com saída e comparadores de caminho tornam visíveis as fronteiras entre sistema, ferramenta, projeto e arquivo gerado.

### Aula 004 — laboratório PowerShell com diagnóstico

- `plataforma-curso/src/components/GuidedPowerShellLesson004.jsx`
- `plataforma-curso/src/components/guidedPowerShellLesson.css`
- `docs/revisao-aulas/matrizes/004_TERMINAL_POWERSHELL.md`
- Conceito de referência: terminal deve ser ensinado como localização, intenção, evidência e confirmação; árvore sincronizada, histórico, autocomplete, remoção segura e classificação de falhas transformam comandos isolados em autonomia operacional.

### Aula 005 — laboratório visual da plataforma Java

- `plataforma-curso/src/components/GuidedJavaPlatformLesson005.jsx`
- `plataforma-curso/src/components/guidedJavaPlatformLesson.css`
- `docs/revisao-aulas/matrizes/005_JDK_JRE_JVM_LTS.md`
- Conceito de referência: siglas e instalações devem virar responsabilidades e evidências; pipeline, artefatos, terminal, mock do Windows e comparação de ambientes tornam JDK, runtime, JVM, LTS e coerência observáveis sem antecipar a compilação aprofundada.

### Aula 006 — oficina de compilação e classpath

- `plataforma-curso/src/components/GuidedManualCompilationLesson006.jsx`
- `plataforma-curso/src/components/guidedManualCompilationLesson.css`
- `docs/revisao-aulas/matrizes/006_COMPILACAO_MANUAL_JAVAC.md`
- Conceito de referência: compilação precisa ser ensinada como mudança observável de estado; editor, terminal, árvore, diagnóstico, dependências e classpath transformam comandos curtos em um modelo capaz de explicar falhas reais.

### Aula 007 — laboratório de ambientação no IntelliJ IDEA

- `plataforma-curso/src/components/GuidedIntelliJSetupLesson007.jsx`
- `plataforma-curso/src/components/guidedIntelliJSetupLesson.css`
- `docs/revisao-aulas/matrizes/007_INTELLIJ_IDEA_COMPLETO.md`
- Conceito de referência: configurar uma IDE exige tornar visíveis seus estados e fronteiras; instalação, raiz, SDK, Sources Root, Run Configuration, working directory, terminal e assistência de edição devem ser decisões guiadas, verificáveis e claramente identificadas como simulações didáticas.

### Aula 008 — laboratório visual de IDE

- `plataforma-curso/src/components/GuidedIntelliJLesson008.jsx`
- `plataforma-curso/src/components/guidedIntelliJLesson.css`
- Conceito de referência: uma interface não é apenas ilustrada; seus estados importantes podem ser simulados e manipulados.

### Aula 009 — oficina visual de instalação e auditoria do Git

- `plataforma-curso/src/components/GuidedGitSetupLesson009.jsx`
- `plataforma-curso/src/components/guidedGitSetupLesson.css`
- `docs/revisao-aulas/matrizes/009_GIT_INSTALACAO_CONFIGURACAO.md`
- Conceito de referência: instalação só termina quando executável, origem e configuração são comprovados; telas do instalador, escopos, identidade, branch, editor, finais de linha e erros de chave precisam ser decisões guiadas e auditáveis.

### Aula 010 — laboratório guiado de terminal

- `docs/aulas/010_M0_10_GIT_LOCAL_DO_ZERO.md`
- `plataforma-curso/src/components/GuidedGitLesson010.jsx`
- `plataforma-curso/src/components/guidedLesson.css`
- `plataforma-curso/public/lesson-assets/010-git-local/`
- Conceito de referência: todo comando precisa de contexto, saída esperada, interpretação e recuperação de erros.

### Aula 011 — laboratório visual de publicação no GitHub

- `plataforma-curso/src/components/GuidedGitHubRemoteLesson011.jsx`
- `plataforma-curso/src/components/guidedGitHubRemoteLesson.css`
- `docs/revisao-aulas/matrizes/011_GITHUB_REPOSITORIO_REMOTO.md`
- Conceito de referência: publicar exige tornar visíveis conta, autenticação, remoto, branch, upstream e estados antes/depois do push; interfaces externas devem ser simulações didáticas identificadas e todo incidente de credencial precisa ensinar contenção segura.

### Aula 012 — oficina de Markdown com preview sincronizado

- `plataforma-curso/src/components/GuidedMarkdownLesson012.jsx`
- `plataforma-curso/src/components/guidedMarkdownLesson.css`
- `docs/revisao-aulas/matrizes/012_MARKDOWN_DOCUMENTACAO_TECNICA.md`
- Conceito de referência: linguagens de marcação devem ser ensinadas com fonte e resultado simultâneos; sintaxe só ganha sentido quando organiza uma ação real, caminhos e acessibilidade são verificáveis e o documento termina revisado no Git.

### Aula 013 — mentoria de registro e revisão rastreável

- `plataforma-curso/src/components/GuidedLearningJournalLesson013.jsx`
- `plataforma-curso/src/components/guidedLearningJournalLesson.css`
- `docs/revisao-aulas/matrizes/013_DIARIO_BORDO_RASTREABILIDADE.md`
- Conceito de referência: aprendizado precisa produzir evidências recuperáveis; diário, revisão, atalhos e decisões têm finalidades diferentes, erros devem registrar causa e prova, e o Git preserva a evolução sem substituir a recuperação ativa nem transformar a rotina em burocracia.

### Aula 014 — laboratório de IA supervisionada

- `plataforma-curso/src/components/GuidedCodexEthicsLesson014.jsx`
- `plataforma-curso/src/components/guidedCodexEthicsLesson.css`
- `docs/revisao-aulas/matrizes/014_CODEX_IA_ETICA_METODO.md`
- Conceito de referência: assistência por IA precisa começar em hipótese, escopo, permissão e segurança, passar por plano, diff e evidência executável e terminar em explicação e responsabilidade humanas; interfaces e conversas são estados didáticos, nunca autoridade técnica.

### Aula 015 — oficina visual de instalação e auditoria do Maven

- `plataforma-curso/src/components/GuidedMavenSetupLesson015.jsx`
- `plataforma-curso/src/components/guidedMavenSetupLesson.css`
- `docs/revisao-aulas/matrizes/015_MAVEN_INSTALACAO_VALIDACAO.md`
- Conceito de referência: uma ferramenta de build só está preparada quando origem, integridade, árvore, PATH, processo, versão, Java e executável concordam; sistema, IDE e Wrapper precisam permanecer distinguíveis e toda falha deve terminar na repetição da prova adequada.

### Aula 016 — laboratório visual de PostgreSQL e DBeaver

- `plataforma-curso/src/components/GuidedPostgresDBeaverLesson016.jsx`
- `plataforma-curso/src/components/guidedPostgresDBeaverLesson.css`
- `docs/revisao-aulas/matrizes/016_POSTGRESQL_DBEAVER_PREPARACAO.md`
- Conceito de referência: instalação de banco exige distinguir programa, diretório de dados, serviço, porta, autenticação, database, cliente e driver; cada camada precisa de prova própria, a credencial nunca integra a evidência compartilhável e a recuperação começa no ponto exato em que a conexão parou.

### Aula 017 — laboratório visual de cliente HTTP

- `plataforma-curso/src/components/GuidedHttpClientLesson017.jsx`
- `plataforma-curso/src/components/guidedHttpClientLesson.css`
- `docs/revisao-aulas/matrizes/017_POSTMAN_INSOMNIA_HTTP_BASICO.md`
- Conceito de referência: uma request precisa tornar método, URL resolvida, headers e body visíveis; uma response precisa ser interpretada por status, headers, body e contexto; falha sem response pertence ao transporte, segredos não pertencem à collection compartilhada e toda correção deve produzir nova evidência.

### Aula 018 — laboratório visual de Docker Desktop e WSL2

- `plataforma-curso/src/components/GuidedDockerWslLesson018.jsx`
- `plataforma-curso/src/components/guidedDockerWslLesson.css`
- `docs/revisao-aulas/matrizes/018_DOCKER_DESKTOP_WSL2_PREPARACAO.md`
- Conceito de referência: infraestrutura local precisa separar host, WSL2, Desktop, cliente, canal e engine; instalação só termina quando a cadeia produz evidências, objetos Docker mantêm identidades e ciclos de vida diferentes e nenhuma tentativa de correção autoriza limpeza de dados ou exposição de segredo.

### Aula 019 — oficina visual de arquitetura do repositório

- `plataforma-curso/src/components/GuidedRepositoryStructureLesson019.jsx`
- `plataforma-curso/src/components/guidedRepositoryStructureLesson.css`
- `docs/revisao-aulas/matrizes/019_ESTRUTURA_PROFISSIONAL_REPOSITORIO.md`
- Conceito de referência: organização profissional começa por descoberta segura, atribui responsabilidade à raiz, docs, main, test e labs, prova regras de ignore, preserva segredo e mudanças existentes e transforma apenas um staged diff revisado em história recuperável.

### Aula 020 — banca visual de prontidão do ambiente

- `plataforma-curso/src/components/GuidedEnvironmentGateLesson020.jsx`
- `plataforma-curso/src/components/guidedEnvironmentGateLesson.css`
- `docs/revisao-aulas/matrizes/020_CHECKLIST_FINAL_AMBIENTE.md`
- Conceito de referência: um ambiente não fica pronto por declaração; cada domínio precisa de comando ou ação, resultado observado, interpretação e recuperação, requisitos críticos bloqueiam o M1 e ferramentas futuras podem virar pendência formal sem serem fingidas como aprovadas.

### Aula 021 — oficina visual do primeiro programa Java

- `plataforma-curso/src/components/GuidedFirstJavaProgramLesson021.jsx`
- `plataforma-curso/src/components/guidedFirstJavaProgramLesson.css`
- `docs/revisao-aulas/matrizes/021_PRIMEIRO_PROGRAMA_JAVA_DESTRINCHADO.md`
- Conceito de referência: o primeiro programa precisa deixar de ser uma assinatura mágica; código, nomes, build, bytecode, launcher, console, Run/Debug, fluxo sequencial, falhas e entrega Git formam uma única cadeia explicável e verificável.

### Aula 022 — oficina visual de blocos, chaves e leitura

- `plataforma-curso/src/components/GuidedCodeStructureLesson022.jsx`
- `plataforma-curso/src/components/guidedCodeStructureLesson.css`
- `docs/revisao-aulas/matrizes/022_BLOCOS_CHAVES_INDENTACAO_LEITURA.md`
- Conceito de referência: pertencimento, chaves, indentação e aninhamento precisam ser observados por árvores, pares, leituras em duas direções, código formatado, estados do IntelliJ, diagnósticos e recuperação executável.

### Aula 023 — oficina visual de comentários úteis e documentação

- `plataforma-curso/src/components/GuidedUsefulCommentsLesson023.jsx`
- `plataforma-curso/src/components/guidedUsefulCommentsLesson.css`
- `docs/revisao-aulas/matrizes/023_COMENTARIOS_UTEIS_DOCUMENTACAO.md`
- Conceito de referência: comentários devem preservar intenção sem disputar a verdade com o código; sintaxe, execução, revisão, segurança, IDE, documentação e Git terminam em decisões e evidências observáveis.

## Experiências atualmente em revisão

A auditoria técnica consolidada das aulas 024 a 039 está em [`AUDITORIA_024_039.md`](AUDITORIA_024_039.md). As aulas 040 a 045 foram implementadas na sequência e documentadas em suas matrizes próprias. Todas continuam `em_revisao` até inspeção visual e aprovação explícita.

A auditoria pedagógica extraordinária e o registro da correção das aulas 041 a 045 estão em [`AUDITORIA_041_045.md`](AUDITORIA_041_045.md). A fórmula estrutural indevida foi removida, conteúdos foram repostos e as matrizes foram corrigidas. A faixa continua `em_revisao` até inspeção visual e aprovação explícita.

Em 2026-07-17, a apresentação produzida no piloto local da Aula 046 foi descartada integralmente. O Codex reconstruiu a experiência do zero em uma oficina única de oito etapas. A Aula 047 entregue pelo Gemini foi auditada na sequência; o Codex corrigiu cobertura, consistência do recálculo, explicações de saída, conclusão persistida e responsividade. Validadores, lint, build e inspeções em desktop, 640 px e 360 px foram aprovados. Ambas permanecem `em_revisao` somente até a aprovação explícita do responsável.

Em 2026-07-17, as aulas 048 a 052 entregues pelo Gemini também foram auditadas e corrigidas pelo Codex. A Aula 048 continha uma falha fatal: duas coleções usadas pela Galeria de Domínios e pela Clínica de Erros não existiam, derrubando a interface ao abrir essas etapas. As coleções e a cobertura foram reconstruídas. Nas cinco aulas foram acrescentados exemplos completos e guiados com `Scanner`, normalização do progresso persistido, foco automático da etapa ativa no celular e ajustes de tipografia e responsividade. O validador dedicado, lint, build e inspeções em desktop, 640 px e 360 px passaram; a faixa permanece `em_revisao` somente até a aprovação explícita do responsável.

Em 2026-07-17, as aulas 053 a 058 entregues pelo Gemini foram auditadas e corrigidas pelo Codex. A auditoria encontrou comandos `jacac`, chamadas `javac` separadas por vírgula, galerias com exemplos prometidos mas ausentes, cobertura prática reduzida e terminologia incorreta sobre passagem por referência. Cada aula passou a ensinar com um programa Java completo e compilável antes do desafio. O validador dedicado compila esses seis programas com o JDK e também protege progresso, portão pedagógico, foco móvel e responsividade. O defeito visual da Clínica de Erros das aulas 049 a 058 foi corrigido na raiz: apenas o primeiro `span` pode receber o círculo numérico, enquanto o título usa `guided-error-label` com até duas linhas legíveis. A faixa permanece `em_revisao` até aprovação visual explícita.

### Aula 024 — oficina visual de variáveis e nomes profissionais

- `plataforma-curso/src/components/GuidedVariablesLesson024.jsx`
- `plataforma-curso/src/components/guidedVariablesLesson.css`
- `docs/revisao-aulas/matrizes/024_VARIAVEIS_NOMES_PROFISSIONAIS.md`
- Estado: implementada e tecnicamente validada, aguardando inspeção visual e aprovação do responsável antes de virar referência aprovada.
- Conceito em avaliação: variável precisa ser ensinada como estado nomeado com tipo, ciclo de vida e fronteira local; nomes profissionais, Rename seguro, saídas e diagnósticos transformam sintaxe em código legível e verificável.

### Aulas 025 a 120 — fundamentos, tipos, precisão, metadados, modelagem, métodos e entrada em OO

- Matrizes: `docs/revisao-aulas/matrizes/025_*.md` a `120_*.md`.
- Componentes: `GuidedIntegerTypesLesson025.jsx` a `GuidedToStringLesson120.jsx`, com nomes específicos por assunto registrados em `STATUS_REVISAO.json`.
- Estado: implementadas e auditadas tecnicamente até 2026-07-18; permanecem em revisão até a aprovação visual explícita do responsável.
- Cobertura: fundamentos, memória, texto, conversões, precisão, localização, API temporal, enum, record, inferência local, varargs, annotations, reflection, sealed, pattern matching, text blocks, exceptions, console, pacotes, documentação oficial, mini projeto Java Core testável, decomposição de `main`, assinaturas, coesão, records de parâmetros, retorno boolean, métodos de cálculo, exibição, leitura defensiva, DRY, debug, Extract Method, mini arquitetura procedural, projetos integrados, checkpoint final, modelagem, classes, estado, comportamento, nascimento, encapsulamento, getters/setters, DTO/domínio, imutabilidade, objetos de valor, record, composição, árvores de objetos, validação distribuída, tipos fortes, colaboração, dependência por parâmetro, delegação, Lei de Demeter, controle de acoplamento, tipos do domínio, normalização, invariantes, valores imutáveis, identidade de objetos, `equals`, `hashCode`, contratos de hash, `HashSet`/`HashMap`, `toString`, representação segura, máscaras de dados e separação entre texto técnico, resumo e regra.
- Próxima aula curricular: Aula 121 — `static` com critério. Qualquer implementação existente deve ser auditada antes de ser tratada como referência.

### Integração

- `plataforma-curso/src/components/MarkdownViewer.jsx`
- `plataforma-curso/src/components/GuidedLessonFacts.jsx`
- Faixa de resumo: todas as aulas guiadas usam o mesmo componente entre o cabeçalho e o roteiro; somente números, rótulos e texto acessível podem variar. Não criar versões locais desse elemento em CSS de aula.
- Moldura da aula: `guidedLesson.css` mantém cabeçalho compacto, roteiro lateral `sticky` no desktop, rolagem interna para roteiros altos, ancora trocas de etapa no início do conteúdo, centraliza a etapa ativa no trilho horizontal de celular e fixa a navegação entre aulas no rodapé visível. A raiz da aula deve conservar `overflow: visible`; recortes pertencem somente aos painéis internos. Aulas novas não devem sobrescrever essas dimensões.
- Clínica de Erros: o círculo numérico deve usar um seletor restrito como `button > span:first-child`; nunca aplique tamanho fixo a todos os `span` do botão. O título completo deve permanecer em `guided-error-label`, legível em até duas linhas, e o menu vira trilho horizontal no celular.
- Entrega guiada: antes de qualquer desafio aberto, a aula deve oferecer pelo menos um programa completo com classe, `main`, métodos, comando de compilação, comando de execução e saída esperada. O validador da faixa deve compilar esse programa sempre que houver JDK disponível.

### Interface permanente da plataforma

- Página inicial: `plataforma-curso/src/components/WelcomeView.jsx`
- Acabamento da página inicial: `plataforma-curso/src/components/welcomeElegance.css`
- Navegador lateral: `plataforma-curso/src/components/Sidebar.jsx`
- Acabamento do navegador: `plataforma-curso/src/components/sidebarNavigator.css`
- Princípio de referência: a interface deve orientar o estudo com hierarquia clara e elementos compactos; a apresentação não pode ocupar o espaço da aprendizagem.

### Sincronização permanente do progresso

- Contrato completo: [`SINCRONIZACAO_PROGRESSO.md`](SINCRONIZACAO_PROGRESSO.md).
- A conclusão curricular, as etapas do roteiro, a etapa ativa e a última aula precisam permanecer sincronizadas por usuário no Redis.
- `useLearningStateSync.js` é a ponte obrigatória para as chaves locais `guided-*-lesson-NNN-progress`; aulas novas devem conservar esse padrão de chave.
- A fila offline nunca deve ser apagada por falha de rede, e a troca de conta no mesmo navegador nunca pode reaproveitar as etapas locais do usuário anterior.
- APIs de progresso devem aceitar somente a sessão assinada da própria conta ou uma sessão administrativa válida.

## Atualizar o cronograma

Edite apenas `STATUS_REVISAO.json` e execute na raiz do projeto:

```powershell
node tools/update-lesson-review-schedule.mjs
```

Depois confirme:

```powershell
git diff --check
```

## Prompt de retomada para outro chat

Use este texto:

> Leia integralmente `docs/revisao-aulas/README.md` e todos os documentos obrigatórios indicados nele. Consulte o cronograma e o estado estruturado. Continue a reconstrução das aulas exatamente de acordo com o blueprint, começando pela próxima aula autorizada. Antes de implementar, leia a aula antiga inteira e produza a matriz de cobertura. Não marque nenhuma aula como refeita antes de executar toda a validação e receber minha aprovação.
