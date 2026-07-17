# Blueprint de reconstrução das aulas

## 1. Finalidade deste documento

Este documento permite que qualquer novo chat, pessoa ou agente continue a reconstrução da Formação Java com o mesmo padrão aprovado nas aulas 008 e 010.

Ele não é uma sugestão estética. É o contrato pedagógico, visual e técnico da reconstrução.

O objetivo não é “embelezar Markdown”. O objetivo é transformar cada aula em uma experiência guiada semelhante a uma boa aula ministrada por um professor: o aluno sabe o que fará, onde clicar ou o que digitar, o que deve acontecer, por que aconteceu, como reconhecer um erro e como provar que aprendeu.

## 2. Princípio central

> Preservar toda competência e profundidade técnica única da aula antiga, eliminar apenas repetição sem valor adicional e reconstruir a explicação do zero em uma sequência guiada, visual, verificável e praticável.

“Preservar conteúdo” não significa copiar frases, parágrafos ou a ordem antiga.

Significa criar um destino explícito para cada:

- conceito técnico;
- comando;
- opção ou parâmetro relevante;
- saída importante;
- exemplo com variação única;
- erro comum;
- regra de segurança;
- atividade;
- relação com backend, testes, arquitetura ou produção;
- critério de conclusão.

É permitido consolidar três explicações repetidas em uma explicação melhor. Não é permitido remover uma nuance técnica porque ela é difícil de ensinar.

## 3. Fontes de verdade

### 3.1 Conteúdo original

As aulas originais ficam em:

```text
docs/aulas/
```

Cada aula escolhida deve ser lida integralmente antes de qualquer implementação. Não basta ler títulos, procurar palavras ou confiar no nome do arquivo.

### 3.2 Estado da reconstrução

O estado estruturado fica em:

```text
docs/revisao-aulas/STATUS_REVISAO.json
```

O cronograma humano é gerado em:

```text
docs/revisao-aulas/CRONOGRAMA_COMPLETO.md
```

Nunca marque uma aula diretamente no cronograma. Atualize o JSON e execute:

```powershell
node tools/update-lesson-review-schedule.mjs
```

### 3.3 Referências de implementação aprovadas

#### Aula 000 — Abertura guiada da formação

Arquétipo: orientação interativa e pacto de estudo.

```text
plataforma-curso/src/components/GuidedCourseOpeningLesson000.jsx
plataforma-curso/src/components/guidedCourseOpeningLesson.css
docs/revisao-aulas/matrizes/000_AULA_DE_ABERTURA.md
```

O que aprender com essa referência:

- transformar uma introdução conceitual em decisões e evidências observáveis;
- usar mapas exploráveis para ensinar relações sem criar decoração vazia;
- distinguir promessa pedagógica de garantia de cargo ou senioridade;
- mostrar um fluxo de backend antes de aprofundar suas tecnologias;
- treinar julgamento sobre método de estudo e uso de IA;
- terminar com um compromisso pessoal que possa ser verificado.

#### Aula 001 — Mapa técnico e lentes de responsabilidade

Arquétipo: mentoria de mapa técnico interativo.

```text
plataforma-curso/src/components/GuidedCourseMapLesson001.jsx
plataforma-curso/src/components/guidedCourseMapLesson.css
docs/revisao-aulas/matrizes/001_MAPA_FORMACAO_E_CARREIRA.md
```

O que aprender com essa referência:

- transformar uma grade extensa em capacidades, dependências, riscos e evidências;
- atualizar o conteúdo antigo para o plano curricular atual sem apagar competências;
- permitir exploração de muitos módulos sem despejar uma lista longa no aluno;
- mostrar por que Spring, JPA, produção e arquitetura possuem pré-requisitos;
- usar a mesma tarefa para revelar diferentes níveis de responsabilidade;
- separar conteúdo do curso de promessa de cargo, autonomia ou senioridade.

#### Aula 002 — Diagnóstico baseado em evidências

Arquétipo: consulta de mentoria com diagnóstico interativo.

```text
plataforma-curso/src/components/GuidedDiagnosticLesson002.jsx
plataforma-curso/src/components/guidedDiagnosticLesson.css
docs/revisao-aulas/matrizes/002_DIAGNOSTICO_INICIAL_E_PLANO.md
```

O que aprender com essa referência:

- transformar autoavaliação vaga em perguntas e evidências observáveis;
- calibrar escalas sem apresentar uma nota como identidade ou julgamento;
- preservar respostas e gerar um documento que possa ser revisado depois;
- interpretar forças e lacunas sem esconder dependências em uma média geral;
- adaptar um horizonte de estudo à rotina sem prometer velocidade;
- reduzir uma lacuna genérica até existir um próximo exemplo praticável.

#### Aula 003 — Organização do Windows para desenvolvimento

Arquétipo: oficina visual de sistema de arquivos com PowerShell guiado.

```text
plataforma-curso/src/components/GuidedWindowsWorkspaceLesson003.jsx
plataforma-curso/src/components/guidedWindowsWorkspaceLesson.css
docs/revisao-aulas/matrizes/003_ORGANIZACAO_WINDOWS.md
```

O que aprender com essa referência:

- transformar organização de pastas em uma árvore cujo estado muda junto com os comandos;
- usar mocks didáticos para localizar ações do Windows sem fingir uma captura oficial;
- explicar o papel e o limite de cada pasta em vez de entregar apenas uma estrutura pronta;
- comparar caminhos frágeis e previsíveis com consequências e correções concretas;
- mostrar comando, saída, interpretação, variação e confirmação no mesmo laboratório;
- conectar ambiente a Java, Maven, Git, Docker e banco sem antecipar as aulas dessas ferramentas;
- ensinar UTF-8 e portabilidade com uma diferença visual observável.

#### Aula 004 — Terminal, PowerShell e comandos básicos

Arquétipo: laboratório PowerShell com sistema de arquivos simulado e diagnóstico por evidências.

```text
plataforma-curso/src/components/GuidedPowerShellLesson004.jsx
plataforma-curso/src/components/guidedPowerShellLesson.css
docs/revisao-aulas/matrizes/004_TERMINAL_POWERSHELL.md
```

O que aprender com essa referência:

- ensinar terminal como localização, comando, evidência e confirmação;
- sincronizar prompt, saída, breadcrumb e árvore de arquivos;
- distinguir consulta, criação, cópia, movimento, renomeação e remoção por mudança de estado;
- transformar segurança de remoção em protocolo verificável;
- simular histórico, autocomplete e limpeza de tela sem esconder seus efeitos;
- separar comando ausente de programa executado com erro;
- corrigir ambiguidades entre aliases do PowerShell e executáveis do Windows;
- aplicar a mesma investigação a Java, Maven, logs e permissões.

#### Aula 005 — JDK, runtime, JVM e escolha de LTS

Arquétipo: laboratório visual da plataforma Java com ambiente e pipeline sincronizados.

```text
plataforma-curso/src/components/GuidedJavaPlatformLesson005.jsx
plataforma-curso/src/components/guidedJavaPlatformLesson.css
docs/revisao-aulas/matrizes/005_JDK_JRE_JVM_LTS.md
```

O que aprender com essa referência:

- separar linguagem, plataforma e ecossistema antes de apresentar ferramentas;
- ensinar JDK, runtime/JRE e JVM por responsabilidades, incluindo a nuance das distribuições modernas;
- tornar fonte, bytecode, launcher e execução um pipeline manipulável;
- contextualizar a LTS mais recente sem trocar silenciosamente a baseline do curso;
- cruzar versão, origem, `JAVA_HOME` e `PATH` em vez de confiar em um único comando;
- mostrar as telas do Windows como mock orientativo e manter o terminal como evidência final;
- sincronizar editor, terminal, árvore de arquivos e console no primeiro programa;
- reservar erros, múltiplas classes e classpath aprofundado para a aula seguinte.

#### Aula 006 — Compilação manual com javac

Arquétipo: oficina de compilação com artefatos e classpath visíveis.

```text
plataforma-curso/src/components/GuidedManualCompilationLesson006.jsx
plataforma-curso/src/components/guidedManualCompilationLesson.css
docs/revisao-aulas/matrizes/006_COMPILACAO_MANUAL_JAVAC.md
```

O que aprender com essa referência:

- dividir o fluxo em fonte, compilação, localização e execução;
- sincronizar editor, terminal e árvore para provar o nascimento do bytecode;
- ensinar o aluno a ler arquivo, linha, coluna, marcador e mensagem do compilador;
- comparar erros de compilação e execução pelo comando em que aparecem;
- tornar o bytecode desatualizado visível como estado, não apenas como aviso;
- mostrar dependência entre classes e diferentes estratégias de compilação;
- separar fonte e saída com `-d` e declarar a raiz de classes com `-cp`;
- reencontrar o mesmo mecanismo sob IntelliJ, Maven, Git, JAR e container.

#### Aula 007 — Ambientação completa no IntelliJ IDEA

Arquétipo: laboratório de ambientação em IDE com estados sincronizados.

```text
plataforma-curso/src/components/GuidedIntelliJSetupLesson007.jsx
plataforma-curso/src/components/guidedIntelliJSetupLesson.css
docs/revisao-aulas/matrizes/007_INTELLIJ_IDEA_COMPLETO.md
```

O que aprender com essa referência:

- atualizar uma ferramenta que mudou de distribuição sem trocar silenciosamente a baseline técnica do curso;
- transformar instalação, Welcome, Project Structure, Sources Root e Run Configuration em decisões observáveis;
- identificar todos os mocks técnicos como simulações didáticas;
- sincronizar árvore do projeto, editor, Run, saída, terminal e artefatos;
- separar SDK do projeto, SDK do módulo, language level, runtime da execução e `PATH` do terminal;
- explicar a raiz do projeto e o working directory pelas consequências sobre caminhos relativos;
- ensinar assistência de edição e refatoração sem esconder o que a IDE modifica;
- reservar breakpoint e navegação detalhada do debugger para a aula seguinte.

#### Aula 008 — Debug inicial no IntelliJ

Arquétipo: laboratório de interface interativa.

```text
plataforma-curso/src/components/GuidedIntelliJLesson008.jsx
plataforma-curso/src/components/guidedIntelliJLesson.css
```

O que aprender com essa referência:

- transformar uma interface complexa em uma simulação didática;
- identificar Project, editor, gutter, toolbar e painéis inferiores;
- permitir que o aluno clique em breakpoint e controles;
- atualizar linha atual, variáveis, Watch, Call Stack e Console;
- explicar o estado antes e depois de uma instrução;
- usar um cenário de negócio único para conectar vários conceitos;
- preservar exemplos secundários em tabelas, experimentos e desafios;
- aplicar destaque de sintaxe dentro e fora da simulação.

Não copie a tela de debug para assuntos que não precisam dela. Copie o raciocínio: tornar visível o estado que o aluno precisa entender.

#### Aula 009 — Instalação e auditoria do Git

Arquétipo: oficina visual de instalação e auditoria de configuração.

```text
plataforma-curso/src/components/GuidedGitSetupLesson009.jsx
plataforma-curso/src/components/guidedGitSetupLesson.css
docs/revisao-aulas/matrizes/009_GIT_INSTALACAO_CONFIGURACAO.md
```

O que aprender com essa referência:

- guiar todas as escolhas relevantes de um instalador sem fingir screenshots oficiais;
- corrigir comandos herdados que mudam de significado no PowerShell, como `where` e `where.exe`;
- ensinar configuração por escopo, origem, valor efetivo e precedência;
- distinguir identidade de commit de autenticação remota;
- tornar LF, CRLF, `core.autocrlf` e `.gitattributes` um fluxo observável;
- mostrar que comandos de escrita bem-sucedidos podem terminar em silêncio e ainda exigem consulta;
- diagnosticar chaves digitadas incorretamente que o Git aceita sem validar semanticamente;
- validar autoria sem antecipar a criação de repositório da aula seguinte.

#### Aula 010 — Git local do zero

Arquétipo: laboratório de terminal guiado.

```text
docs/aulas/010_M0_10_GIT_LOCAL_DO_ZERO.md
plataforma-curso/src/components/GuidedGitLesson010.jsx
plataforma-curso/src/components/guidedLesson.css
plataforma-curso/public/lesson-assets/010-git-local/
```

O que aprender com essa referência:

- apresentar um comando por intenção, não como lista para copiar;
- mostrar a saída esperada logo após o comando;
- explicar o significado da saída;
- separar resultado invariável de valores que mudam, como hash e versão;
- mostrar o estado antes e depois de `add`, `commit` e `restore`;
- incluir diagramas quando uma relação entre áreas é difícil de compreender em prosa;
- ensinar recuperação segura, não apenas o caminho feliz;
- terminar com um desafio verificável e um estado final conhecido.

#### Aula 011 — GitHub e repositório remoto

Arquétipo: laboratório visual de publicação local-remoto com autenticação segura.

```text
plataforma-curso/src/components/GuidedGitHubRemoteLesson011.jsx
plataforma-curso/src/components/guidedGitHubRemoteLesson.css
docs/revisao-aulas/matrizes/011_GITHUB_REPOSITORIO_REMOTO.md
```

O que aprender com essa referência:

- guiar a criação e a proteção de uma conta antes de presumir que o aluno já possui acesso;
- representar uma interface externa com uma simulação didática identificada, sem fingir screenshot oficial;
- manter terminal, página remota, branch e upstream como estados relacionados e observáveis;
- distinguir HTTPS, Git Credential Manager, PAT e SSH sem recomendar senha de conta ou expor credenciais;
- demonstrar que commit permanece local até o push e provar a sincronização em um segundo ciclo;
- comparar clone, fetch e pull pelas mudanças que produzem em pasta, referências e arquivos;
- tratar segredo publicado como incidente: revogar ou rotacionar antes de avaliar limpeza do histórico;
- diagnosticar falhas remotas por sintoma, inspeção, correção e confirmação, sem normalizar `--force`.

#### Aula 012 — Markdown para documentação técnica

Arquétipo: oficina de Markdown com editor, preview e Git sincronizados.

```text
plataforma-curso/src/components/GuidedMarkdownLesson012.jsx
plataforma-curso/src/components/guidedMarkdownLesson.css
docs/revisao-aulas/matrizes/012_MARKDOWN_DOCUMENTACAO_TECNICA.md
```

O que aprender com essa referência:

- mostrar fonte e resultado lado a lado quando uma linguagem de marcação é a própria matéria;
- simular criação do arquivo, modos Editor/Preview e recuperação do plugin sem fingir screenshot do IntelliJ;
- construir um artefato único por incrementos orientados às perguntas do leitor;
- ensinar cercas de código com linguagem e destaque correspondentes ao conteúdo;
- tornar caminhos relativos, links quebrados e texto alternativo observáveis;
- comparar README, comandos, atalhos, diário, API, checklist e ADR pela intenção do documento;
- diagnosticar renderização pelo sintoma antes de alterar marcadores ao acaso;
- encerrar com diff, staged, commit e confirmação de árvore limpa.

#### Aula 013 — Diário de bordo e rastreabilidade do aprendizado

Arquétipo: mentoria de registro, revisão ativa e evidências com Git.

```text
plataforma-curso/src/components/GuidedLearningJournalLesson013.jsx
plataforma-curso/src/components/guidedLearningJournalLesson.css
docs/revisao-aulas/matrizes/013_DIARIO_BORDO_RASTREABILIDADE.md
```

O que aprender com essa referência:

- separar diário cronológico, anotação reutilizável, revisão ativa, atalhos e decisões por finalidade;
- transformar compreensão momentânea em uma cadeia observável de prática, erro, correção, registro, commit e revisão;
- construir entradas mínimas e completas sem transformar o diário em uma segunda apostila;
- registrar erros por tentativa, mensagem, inspeção, causa, correção e prova posterior;
- recuperar o conteúdo sem consultar antes de comparar e corrigir lacunas;
- conectar os arquivos de aprendizagem ao Git sem criar commits artificiais ou incluir mudanças fora do escopo;
- preservar segurança e confidencialidade ao traduzir registros pessoais para tickets, PRs, ADRs, runbooks e postmortems;
- manter uma rotina sustentável e retomar do marco atual sem inventar registros atrasados.

#### Aula 014 — Codex e IA com ética e método

Arquétipo: laboratório de IA supervisionada com terminal, diff e gates de segurança.

```text
plataforma-curso/src/components/GuidedCodexEthicsLesson014.jsx
plataforma-curso/src/components/guidedCodexEthicsLesson.css
docs/revisao-aulas/matrizes/014_CODEX_IA_ETICA_METODO.md
```

O que aprender com essa referência:

- separar superfícies, capacidades, sandbox e aprovação antes de autorizar qualquer ação;
- começar com hipótese e plano humanos, limitar o escopo e exigir evidência antes da aceitação;
- representar terminal, conversa, diff, execução e política como estados relacionados e verificáveis;
- colocar autorização e confidencialidade antes de anonimização ou conveniência;
- tratar prompt como contrato de trabalho, não como prova de correção;
- revisar código convincente porém incorreto por diff, compilação, casos de borda e explicação humana;
- calibrar autonomia por risco, reversibilidade e impacto, preservando decisões de arquitetura;
- transformar regras duráveis em documentação curta e terminar com Git nominal, defesa oral e árvore limpa.

#### Aula 015 — Maven: instalação e validação inicial

Arquétipo: oficina visual de instalação e auditoria do Maven com Windows, PowerShell e IntelliJ sincronizados.

```text
plataforma-curso/src/components/GuidedMavenSetupLesson015.jsx
plataforma-curso/src/components/guidedMavenSetupLesson.css
docs/revisao-aulas/matrizes/015_MAVEN_INSTALACAO_VALIDACAO.md
```

O que aprender com essa referência:

- separar JDK, Maven, IDE, projeto, repositório e rede antes de diagnosticar;
- transformar download, checksum, extração, PATH e herança de processos em estados visíveis;
- classificar variáveis como obrigatórias, opcionais ou legadas, sem repetir convenções antigas como requisitos;
- ler toda a saída de versão e provar origem com comandos corretos para PowerShell;
- comparar Maven do sistema, incorporado e Wrapper pela fonte que define cada versão;
- mostrar interfaces externas como simulações didáticas identificadas;
- tratar cada falha por sintoma, inspeção, correção e nova prova;
- documentar valores observados e encerrar com preparação nominal no Git e defesa oral.

#### Aula 016 — PostgreSQL e DBeaver: preparação

Arquétipo: laboratório visual de servidor, serviço, cliente e conexão PostgreSQL.

```text
plataforma-curso/src/components/GuidedPostgresDBeaverLesson016.jsx
plataforma-curso/src/components/guidedPostgresDBeaverLesson.css
docs/revisao-aulas/matrizes/016_POSTGRESQL_DBEAVER_PREPARACAO.md
```

O que aprender com essa referência:

- separar servidor, serviço do Windows, listener, database, usuário, cliente e driver;
- transformar o instalador em uma sequência de decisões sobre programa, dados, componentes, senha, porta e locale;
- considerar instalação concluída apenas após serviço, porta, autenticação e SQL produzirem evidências;
- simular `psql`, DBeaver, wizard de conexão, Navigator, editor e grade sem fingir screenshots oficiais;
- proteger credenciais durante instalação, conexão, documentação e Git;
- mostrar que fechar o cliente não desliga o servidor e que driver ausente não significa banco parado;
- diagnosticar por camada antes de reinstalar ou alterar várias configurações;
- preservar a fronteira curricular: preparar o banco sem antecipar modelagem e SQL profundo.

#### Aula 017 — Postman, Insomnia e HTTP básico

Arquétipo: laboratório visual de cliente HTTP com request, trânsito e response sincronizados.

```text
plataforma-curso/src/components/GuidedHttpClientLesson017.jsx
plataforma-curso/src/components/guidedHttpClientLesson.css
docs/revisao-aulas/matrizes/017_POSTMAN_INSOMNIA_HTTP_BASICO.md
```

O que aprender com essa referência:

- separar falha de transporte sem resposta de erro HTTP com status e body;
- decompor protocolo, host, porta, path e query antes do envio;
- sincronizar método, URL, headers, body e resposta em um cliente HTTP didático;
- tratar método e status como semântica e evidência, nunca como diagnóstico completo isolado;
- comparar ferramentas sem transformar interface em conhecimento transferível;
- resolver `base_url` visivelmente e manter segredo fora de collection, exportação e Git;
- transformar requests importantes em documentação recuperável;
- terminar com clínica por camadas, preparação nominal no Git e defesa oral.

#### Aula 018 — Docker Desktop e WSL2: preparação

Arquétipo: laboratório visual de instalação, arquitetura e cadeia de provas do Docker Desktop com WSL2.

```text
plataforma-curso/src/components/GuidedDockerWslLesson018.jsx
plataforma-curso/src/components/guidedDockerWslLesson.css
docs/revisao-aulas/matrizes/018_DOCKER_DESKTOP_WSL2_PREPARACAO.md
```

O que aprender com essa referência:

- separar Windows, WSL2, Docker Desktop, CLI, canal e engine antes de diagnosticar;
- transformar pré-requisitos, instalação e integração por distribuição em estados visíveis;
- provar cliente, servidor, Compose e execução com comandos distintos e saídas interpretadas;
- acompanhar `hello-world` por pull, criação, execução, saída e encerramento;
- distinguir registry, imagem e contêiner por objeto, estado e comando;
- tornar porta host/contêiner, volume e variável de ambiente decisões independentes;
- impedir limpeza global, remoção cega de volume, segredo em comando e privilégios sem justificativa;
- preservar a fronteira: preparar infraestrutura sem antecipar Dockerfile, Compose profundo ou Java em contêiner.

#### Aula 019 — Estrutura profissional do repositório

Arquétipo: oficina visual de arquitetura de repositório com árvore, documentos e Git sincronizados.

```text
plataforma-curso/src/components/GuidedRepositoryStructureLesson019.jsx
plataforma-curso/src/components/guidedRepositoryStructureLesson.css
docs/revisao-aulas/matrizes/019_ESTRUTURA_PROFISSIONAL_REPOSITORIO.md
```

O que aprender com essa referência:

- auditar localização, raiz Git e mudanças antes de criar, mover ou reorganizar;
- usar uma árvore interativa para ensinar responsabilidade, não apenas aparência de diretórios;
- sincronizar PowerShell, árvore resultante, editor e preview ao longo da construção;
- separar raiz, documentação, código principal, testes e laboratórios por papel;
- provar regras de `.gitignore` e distinguir arquivo ignorado de arquivo já rastreado;
- ensinar `.gitkeep` como convenção temporária, nunca como recurso oficial do Git;
- escolher nomes recuperáveis e classificar artefatos corporativos por intenção;
- entregar mudanças estruturais por stage nominal, staged diff, commit pequeno e defesa oral.

#### Aula 020 — Checklist final do ambiente

Arquétipo: banca visual de prontidão com provas, criticidade e plano de pendências.

```text
plataforma-curso/src/components/GuidedEnvironmentGateLesson020.jsx
plataforma-curso/src/components/guidedEnvironmentGateLesson.css
docs/revisao-aulas/matrizes/020_CHECKLIST_FINAL_AMBIENTE.md
```

O que aprender com essa referência:

- transformar checklist declarativo em prova com evidência registrada;
- separar requisito crítico imediato de dependência que pode ser formalmente adiada;
- exigir nota observada antes de aceitar aprovado, falhou ou pendente;
- sincronizar terminal, IDE, Git, build, banco, HTTP, contêiner e rotina em um único gate;
- impedir conclusão enquanto provas críticas continuam sem aprovação;
- gerar um dossiê compartilhável sem copiar credenciais ou inventar resultados;
- terminar cada falha com recuperação e repetição da prova exata.

#### Aula 021 — Primeiro programa Java destrinchado

Arquétipo: oficina visual de anatomia, execução e diagnóstico do primeiro programa Java.

```text
plataforma-curso/src/components/GuidedFirstJavaProgramLesson021.jsx
plataforma-curso/src/components/guidedFirstJavaProgramLesson.css
docs/revisao-aulas/matrizes/021_PRIMEIRO_PROGRAMA_JAVA_DESTRINCHADO.md
```

O que aprender com essa referência:

- transformar uma assinatura inicialmente opaca em responsabilidades selecionáveis, sem antecipar profundidade de orientação a objetos;
- sincronizar código, arquivo, compilação, bytecode, launcher, JVM e console em um fluxo comprovável;
- representar Run e Debug do IntelliJ como estados didáticos, deixando claro o que aconteceu antes e depois da instrução;
- distinguir falhas de compilação de falhas do launcher e exigir nova prova depois da correção;
- usar o mesmo contrato estrutural em programas mínimos e pequenos exemplos de domínio;
- entregar apenas fontes e registros nominais, mantendo bytecode fora do Git;
- preservar a fronteira curricular: apresentar blocos e comentários somente no nível necessário para as aulas seguintes.

#### Aula 022 — Blocos, chaves, indentação e leitura de código

Arquétipo: oficina visual de leitura estrutural com árvore, formatação, IDE e clínica de chaves.

```text
plataforma-curso/src/components/GuidedCodeStructureLesson022.jsx
plataforma-curso/src/components/guidedCodeStructureLesson.css
docs/revisao-aulas/matrizes/022_BLOCOS_CHAVES_INDENTACAO_LEITURA.md
```

O que aprender com essa referência:

- transformar pertencimento entre arquivo, classe, método, bloco e instrução em árvore selecionável;
- ligar cada par de chaves à camada que ele abre e fecha, sem tratar indentação como execução;
- ensinar leitura externa para interna e interna para externa como estratégias complementares;
- comparar código formatado e desalinhado sem confundir apresentação com sintaxe;
- usar o IntelliJ como ambiente observável para formatação, seleção estrutural e diagnóstico;
- separar falhas de compilação, legibilidade e posição incorreta por sintomas e recuperação;
- preservar a fronteira curricular: comentários aparecem apenas como elementos ignorados pelo compilador.

#### Aula 023 — Comentários úteis e documentação inicial

Arquétipo: oficina visual de comunicação no código com critério, segurança, IDE e documentação.

```text
plataforma-curso/src/components/GuidedUsefulCommentsLesson023.jsx
plataforma-curso/src/components/guidedUsefulCommentsLesson.css
docs/revisao-aulas/matrizes/023_COMENTARIOS_UTEIS_DOCUMENTACAO.md
```

O que aprender com essa referência:

- separar código, comentário e documentação pelas perguntas que cada camada responde;
- provar que comentários não executam comparando fonte e console;
- transformar revisão de comentários em decisões justificadas de manter, remover, corrigir, renomear ou reescrever;
- comparar comentário coerente, texto envelhecido e código morto com o histórico recuperável do Git;
- rotear explicações para comentário, README, docs/ADR, tarefa ou Git conforme alcance e ciclo de vida;
- tratar senha, token e dado pessoal como incidente mesmo quando aparecem depois de `//`;
- usar atalhos e busca do IntelliJ para experimentar e limpar, sem apresentar código comentado como versão permanente;
- preservar a fronteira curricular: nomes melhores são mencionados sem antecipar a aula completa de variáveis.

### 3.4 Integração na plataforma

O roteamento das experiências especiais acontece em:

```text
plataforma-curso/src/components/MarkdownViewer.jsx
```

As aulas reconstruídas de 000 a 024 são despachadas para componentes próprios. A visualização Markdown padrão continua sendo o fallback das aulas ainda não reconstruídas.

## 4. Regra de ouro contra perda de conteúdo

Antes de escrever a nova aula, crie uma matriz baseada em:

```text
docs/revisao-aulas/MODELO_MATRIZ_COBERTURA.md
```

A matriz deve responder:

1. O que existia na aula antiga?
2. O que era único?
3. O que era repetição?
4. Em qual etapa da aula nova cada item único aparece?
5. Qual evidência prova que o item foi ensinado?

Uma aula não pode ser marcada como `refeita` se houver uma linha única sem destino.

### 4.1 O que pode ser removido

- repetição literal;
- introduções que dizem várias vezes que o assunto é importante;
- listas diferentes que repetem os mesmos itens;
- exemplos idênticos com nomes trocados e nenhuma nova dificuldade;
- conclusões que apenas repetem a abertura;
- frases motivacionais sem função pedagógica;
- comandos repetidos sem mudança de estado ou interpretação.

### 4.2 O que não pode ser removido

- variações que mudam comportamento;
- riscos, limitações e efeitos colaterais;
- alternativas profissionais relevantes;
- erros comuns e diagnóstico;
- contexto de uso real;
- relações com conteúdos futuros;
- detalhes difíceis apenas por exigirem uma explicação melhor;
- exemplos que introduzem uma nova categoria de raciocínio.

### 4.3 Consolidação correta

É permitido substituir cinco pequenos programas por um laboratório coerente quando:

- o laboratório novo cobre todas as competências;
- as variações ainda são praticadas ou comparadas;
- a matriz mostra onde cada exemplo antigo foi absorvido;
- o novo cenário não aumenta a carga cognitiva antes da hora.

A aula 008 usa uma regra de reagendamento como eixo principal, mas continua cobrindo decisão, laço, método, `NullPointerException`, testes e Spring em blocos apropriados.

## 5. Processo obrigatório por aula

### Passo 1 — Selecionar a aula

Consulte o cronograma e confirme com o responsável qual aula ou lote pequeno está autorizado.

Não reconstrua centenas de aulas mecanicamente. Cada aula precisa de leitura, decisão de formato e validação.

### Passo 2 — Ler o original inteiro

Leia do primeiro ao último caractere. Registre:

- promessa da aula;
- pré-requisitos;
- conceitos;
- comandos;
- exemplos;
- atividades;
- erros;
- regras de segurança;
- conexões futuras;
- critérios de conclusão;
- repetições e lacunas.

### Passo 3 — Ler o contexto adjacente

Leia pelo menos:

- a aula anterior, para não reensinar tudo;
- a aula seguinte, para não antecipar sem necessidade;
- qualquer aula explicitamente referenciada.

O objetivo é manter a progressão de dificuldade.

### Passo 4 — Preencher a matriz de cobertura

Copie o modelo e associe cada item antigo a uma etapa nova.

Se um item não tem destino, a sequência ainda está incompleta.

### Passo 5 — Definir um resultado observável

Evite resultados vagos como “entender Git” ou “conhecer debug”.

Prefira:

- criar um repositório com quatro commits e estado limpo;
- pausar um programa, entrar em um método e justificar uma decisão;
- criar uma API que responde a uma requisição e validar o retorno;
- escrever uma consulta e confirmar linhas, plano e índice.

### Passo 6 — Escolher o arquétipo

Use o formato que revela melhor o estado do sistema.

#### Terminal guiado

Indicado para:

- Git;
- Maven e Gradle;
- Docker;
- comandos do sistema;
- execução Java;
- ferramentas CLI.

Precisa mostrar:

- onde executar;
- comando copiável;
- saída esperada;
- variações aceitáveis;
- significado da saída;
- erro provável e correção;
- comando de confirmação.

#### Interface guiada

Indicado para:

- IntelliJ;
- DBeaver;
- Postman/Insomnia;
- GitHub;
- painéis de CI/CD;
- ferramentas de observabilidade.

Precisa mostrar:

- região da interface;
- nome exato da ação;
- sequência de cliques;
- estado antes;
- estado depois;
- confirmação visual;
- variação por versão quando relevante.

Use simulação interativa quando o estado é a própria matéria. Use imagem estática quando basta localizar elementos. Nunca apresente uma simulação como screenshot oficial; identifique-a como simulação didática fiel.

#### Laboratório de código

Indicado para:

- sintaxe Java;
- orientação a objetos;
- collections;
- testes;
- Spring;
- arquitetura e padrões.

Precisa mostrar:

- estrutura de arquivos;
- código com destaque de sintaxe;
- alteração incremental;
- execução ou teste;
- saída, resposta ou falha;
- explicação de causa e efeito;
- refatoração quando fizer parte do objetivo.

#### Diagrama explicativo

Indicado quando três ou mais elementos possuem relações difíceis de explicar linearmente:

- fluxo de requisição;
- camadas;
- estados;
- ciclo de vida;
- dependências;
- concorrência;
- arquitetura distribuída.

O diagrama deve possuir rótulos claros e uma função na atividade. Decoração não é recurso didático.

### Passo 7 — Desenhar a sequência

A sequência padrão é:

1. resultado final e mapa da aula;
2. preparação e pré-requisitos;
3. primeira ação pequena;
4. evidência visível;
5. interpretação;
6. segunda ação que muda o estado;
7. erro intencional ou problema realista;
8. diagnóstico e recuperação;
9. variação ou aplicação profissional;
10. desafio sem copiar o roteiro;
11. critérios de conclusão.

Nem toda aula precisa de onze etapas. Toda aula precisa de começo, prática progressiva, evidência, diagnóstico e conclusão verificável.

### Passo 8 — Escrever como professor

Cada etapa precisa responder, na ordem:

1. O que faremos agora?
2. Por que isso vem agora?
3. Onde o aluno deve agir?
4. O que deve digitar ou clicar?
5. O que deve aparecer?
6. O que essa evidência significa?
7. O que fazer se aparecer algo diferente?
8. Como confirmar antes de avançar?

Use linguagem direta, adulta e acolhedora. Não presuma que o aluno já sabe abrir uma conta, localizar um menu ou interpretar uma saída.

Explique com precisão sem infantilizar.

### Passo 9 — Implementar a experiência

#### Nomes

Use:

```text
Guided<Assunto>LessonNNN.jsx
guided<Assunto>Lesson.css
```

Recursos específicos:

```text
plataforma-curso/public/lesson-assets/NNN-slug-curto/
```

Chave de progresso interno:

```text
guided-<assunto>-lesson-NNN-progress
```

#### Estrutura React

O padrão aprovado possui:

- cabeçalho compacto com ID, título, promessa e progresso;
- navegação lateral ou horizontal de etapas;
- blocos de conteúdo orientados por dados;
- ações Anterior e Concluir etapa;
- persistência local das etapas;
- integração com conclusão e navegação geral da plataforma;
- layout responsivo.

Não transforme cada aula em um clone visual. Reutilize a linguagem de design e adapte os blocos ao assunto.

#### Densidade, reposicionamento e navegação persistente

Estas regras pertencem ao componente compartilhado e valem para todas as aulas atuais e futuras:

- o cabeçalho deve apresentar a aula, não ocupar a primeira tela; use a altura compacta definida em `guidedLesson.css` e não sobrescreva localmente padding, tamanho do título ou dimensões do cartão de progresso;
- títulos longos podem quebrar, mas o conjunto kicker, ID, título, promessa e progresso deve permanecer aproximadamente com metade da altura do cabeçalho antigo;
- ao trocar uma etapa pelo roteiro, por `Etapa anterior` ou por `Próxima etapa`, posicione a rolagem no início de `.guided-layout`, onde começa o roteiro prático; nunca envie o aluno novamente ao topo do cabeçalho;
- o comportamento aprovado para a troca de etapa é `document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })`;
- no desktop, `.guided-step-nav` permanece `sticky` com `top: 20px`, acompanha a leitura do conteúdo e limita sua altura à janela; quando o roteiro for maior que a altura disponível, somente o próprio menu ganha rolagem vertical;
- a raiz `.guided-git-lesson` e todas as classes específicas aplicadas no mesmo elemento devem manter `overflow: visible`; `overflow: hidden`, `auto`, `scroll` ou `clip` nessa raiz cria um ancestral de rolagem e pode cancelar o comportamento `sticky` em parte das aulas;
- qualquer recorte necessário deve ser aplicado nos painéis internos — terminal, mock, código ou diagrama — e nunca na raiz da aula nem em `.guided-layout`;
- CSS específico de uma aula não pode sobrescrever `position`, `top`, `max-height` ou o overflow estrutural de `.guided-step-nav`; abaixo de 920 px, somente o CSS compartilhado converte o roteiro para a faixa horizontal estática;
- a barra `.guided-course-nav` permanece fixa no rodapé visível da área principal, acompanha o redimensionamento do menu lateral e reserva espaço inferior para não cobrir a aula;
- no celular, a barra fixa continua em uma única linha compacta, omite apenas o texto secundário do status e preserva os botões anterior/próxima aula;
- quando o roteiro vira uma faixa horizontal abaixo de 920 px, a etapa ativa deve ser centralizada automaticamente com `scrollIntoView({ block: 'nearest', inline: 'center' })`; destacar a etapa sem trazê-la para a área visível não é suficiente;
- a centralização horizontal deve ocorrer ao abrir a aula, selecionar diretamente uma etapa, usar `Etapa anterior`, usar `Próxima etapa` e ao entrar no layout compacto depois de redimensionar;
- o trilho horizontal usa `scroll-snap-type: x proximity`, cada etapa usa `scroll-snap-align: center` e nenhuma dessas regras pode provocar salto vertical de volta ao cabeçalho;
- não criar banners ou rodapés locais com dimensões divergentes; variação por aula limita-se a cor, texto, ícone e dados reais.

#### Regra de conclusão e navegação

Os controles de etapa e de aula possuem responsabilidades diferentes e não podem ser redundantes:

- `Concluir etapa` marca somente a etapa atual e não avança automaticamente;
- uma etapa concluída oferece `Desmarcar etapa`;
- `Próxima etapa` é uma ação separada e só fica disponível depois da conclusão da etapa atual;
- a navegação lateral pode abrir uma etapa para consulta, mas isso não a conclui;
- o botão `Concluir aula` só aparece depois que todas as etapas estão concluídas;
- existe apenas um botão de conclusão da aula;
- o rodapé mostra o estado da aula de forma passiva e mantém apenas a navegação entre aulas;
- o rodapé permanece visível durante o estudo e nunca substitui os controles de conclusão da etapa ou da aula;
- `Próxima aula` permanece bloqueada até todas as etapas e a própria aula estarem concluídas;
- `Reabrir aula` desfaz a conclusão geral sem apagar as etapas já realizadas;
- ao desmarcar uma etapa de uma aula concluída, a conclusão geral também deve ser desfeita;
- um estado antigo inconsistente — aula concluída com etapas pendentes — deve ser normalizado ao abrir a experiência.

Essa regra evita conclusão acidental, deixa o progresso auditável e permite ao aluno corrigir uma marcação sem apagar todo o roteiro.

#### Integração no visualizador

Importe o componente em `MarkdownViewer.jsx` e adicione uma condição pelo prefixo exato do ID.

Exemplo conceitual:

```jsx
if (props.lesson?.id?.startsWith('NNN_')) {
  return <GuidedAssuntoLessonNNN {...props} />;
}
```

O fallback deve continuar funcionando para aulas pendentes.

### Passo 10 — Aplicar recursos visuais

#### Código

Todo código precisa de destaque de sintaxe estilo IDE.

Na plataforma já existe:

```jsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
```

Escolha a linguagem correta:

- `java`;
- `sql`;
- `json`;
- `yaml`;
- `xml`;
- `bash` ou `powershell`;
- `docker` quando suportado.

Regras:

- palavras-chave, tipos, strings, números, métodos e comentários devem ser distinguíveis;
- código longo deve ter numeração de linhas;
- o botão Copiar deve copiar somente o conteúdo, sem números;
- linhas longas não podem quebrar a página;
- o contraste precisa funcionar no tema escolhido;
- código dentro de uma simulação também precisa de realce;
- o código exibido precisa compilar ou ser explicitamente marcado como trecho.

#### Terminal

O terminal deve distinguir:

- comando digitado;
- saída;
- erro;
- explicação;
- valores variáveis.

Não invente uma saída idealizada. Confirme versões e comportamento quando forem instáveis. Quando hashes, caminhos ou versões variarem, diga isso.

#### Imagens, diagramas e simulações

Prioridade:

1. interface HTML/CSS interativa quando o estado precisa mudar;
2. SVG próprio para diagrama preciso e responsivo;
3. screenshot real quando a fidelidade da ferramenta é essencial e existe permissão para capturá-lo;
4. imagem gerada apenas para ilustração, nunca para fingir uma interface técnica verificável.

Toda imagem precisa de:

- texto alternativo;
- legenda que ensina como lê-la;
- boa resolução;
- comportamento responsivo;
- correspondência com o passo atual.

### Passo 11 — Ensinar erro e recuperação

Uma aula profissional não mostra apenas o caminho feliz.

Inclua:

- erro provável;
- mensagem ou sintoma;
- causa mais comum;
- verificação segura;
- correção;
- confirmação posterior.

Para operações destrutivas, ensine inspeção antes da execução. Não normalize comandos perigosos como primeira tentativa.

### Passo 12 — Criar o desafio

O desafio final não deve mandar repetir o roteiro trocando nomes.

Ele precisa exigir transferência:

- novo cenário;
- menos instruções;
- critérios de aceite observáveis;
- estado final verificável;
- uso consciente dos conceitos centrais.

### Passo 13 — Validar

Na pasta `plataforma-curso`:

```powershell
npm.cmd run build
npm.cmd run lint
```

Na raiz:

```powershell
git diff --check
```

Também valide:

- desktop;
- largura intermediária;
- celular a partir de 320 px;
- rolagem;
- botões;
- navegação de etapas;
- marcar e desmarcar uma etapa;
- bloqueio da próxima etapa enquanto a atual estiver pendente;
- bloqueio da conclusão e da próxima aula enquanto existirem etapas pendentes;
- reabertura da aula e normalização de estados inconsistentes;
- persistência;
- copiar código/comando;
- imagens;
- Console sem novos erros;
- estados vazios e erros.

Avisos antigos e não relacionados devem ser informados, não silenciosamente corrigidos durante outra aula.

### Passo 14 — Obter aprovação e atualizar estado

Antes da aprovação, use `em_revisao`.

Depois que o responsável aprovar:

1. mude para `refeita` em `STATUS_REVISAO.json`;
2. registre data, arquétipo, resumo e arquivos de referência;
3. execute o gerador do cronograma;
4. confira os totais;
5. faça `git diff --check`.

## 6. Padrão pedagógico detalhado

### 6.1 Uma aula é uma transformação

O aluno começa com um estado A e termina com um estado B.

Exemplos:

- pasta comum → repositório Git com histórico;
- programa opaco → execução pausada e explicada;
- classe inválida → objeto que protege invariantes;
- consulta lenta → plano entendido e índice justificado;
- endpoint sem proteção → autorização testada.

Se não é possível descrever a transformação, a aula provavelmente ainda é um material de consulta.

### 6.2 Evidência antes de abstração excessiva

Mostre um comportamento pequeno, permita observá-lo e então nomeie o conceito.

Definições continuam importantes, mas devem ajudar o aluno a interpretar o que viu.

### 6.3 Uma ação por bloco

Evite blocos que mandam executar dez comandos sem pausa.

Agrupe apenas comandos que formam uma operação inseparável. Depois mostre a saída e explique o estado.

### 6.4 Saída faz parte da aula

O aluno precisa saber:

- o que deve aparecer;
- o que pode variar;
- o que indica sucesso;
- o que indica que deve parar;
- como confirmar o estado.

### 6.5 Carga cognitiva progressiva

Introduza um novo tipo de dificuldade por vez:

- primeiro executar;
- depois observar;
- depois alterar;
- depois diagnosticar;
- depois aplicar sem roteiro.

### 6.6 Contexto real sem complexidade prematura

Use domínios realistas, mas limite a quantidade de classes e regras ao objetivo da aula.

Uma regra de reagendamento é útil porque se conecta ao backend. Um sistema inteiro de ordens de serviço dentro de uma aula inicial de `if` seria ruído.

## 7. Sistema visual

### 7.1 Continuidade

As aulas reconstruídas devem parecer partes do mesmo curso:

- tipografia consistente;
- cabeçalho forte;
- progresso visível;
- navegação de etapas;
- cartões de nota, alerta, resultado e desafio;
- espaçamento generoso;
- bordas e sombras contidas;
- responsividade.

A faixa compacta entre o cabeçalho e o roteiro é um componente compartilhado, não uma composição livre de cada aula:

```text
plataforma-curso/src/components/GuidedLessonFacts.jsx
plataforma-curso/src/components/guidedLesson.css
```

Regras da faixa de resumo:

- usar `GuidedLessonFacts` em todas as aulas guiadas;
- manter exatamente a mesma estrutura, altura, fundo, borda, raio, separadores, tipografia e margens;
- permitir somente a troca dos números, rótulos e texto acessível conforme o resultado real da aula;
- não recriar classes locais como `jdk-facts`, `git-facts` ou variações equivalentes;
- no celular, empilhar os itens dentro da própria faixa e remover os separadores, sem provocar rolagem horizontal.

O cabeçalho, a faixa de fatos, o roteiro e a barra fixa formam uma sequência única: apresentação compacta, resumo, estudo e navegação persistente. O CSS compartilhado é a fonte de verdade dessas dimensões.

### 7.2 Variação por assunto

O assunto pode definir um acento visual:

- Git: azul e verde, terminal e diagramas de estado;
- IntelliJ/debug: roxo, turquesa e interface escura;
- banco: tons associados a dados e tabelas;
- segurança: contraste de risco e confirmação;
- observabilidade: linhas, eventos e correlação.

A cor complementa a estrutura; nunca deve ser a única forma de comunicar estado.

### 7.3 Acessibilidade

- use botões reais para ações;
- mantenha ordem natural de foco;
- escreva rótulos visíveis;
- forneça `aria-label` quando necessário;
- não remova foco do navegador;
- não dependa apenas de cor;
- mantenha contraste;
- use texto alternativo;
- permita leitura em telas pequenas sem sobreposição.

Responsividade obrigatória das aulas guiadas:

- a página nunca pode criar rolagem horizontal por causa de texto, botão, cartão, imagem ou diagrama;
- containers em `grid` ou `flex` precisam aceitar encolhimento com `min-width: 0`;
- palavras, URLs e rótulos longos precisam quebrar dentro do próprio bloco;
- código, tabelas e simulações que exigem largura podem ter rolagem interna, mas não ultrapassar o fundo da aula;
- mapas e controles devem reorganizar colunas progressivamente em larguras intermediárias e no celular;
- a navegação de etapas pode rolar horizontalmente dentro do próprio trilho em telas estreitas;
- a navegação horizontal sempre traz a etapa ativa para o centro visível, inclusive quando o avanço partiu dos controles dentro do conteúdo;
- valide explicitamente desktop amplo, janela lateral reduzida, 640 px, 360 px e 320 px.

### 7.4 Moldura permanente da plataforma

A página inicial e o navegador lateral formam a moldura do curso. Eles devem ajudar o aluno a começar ou retomar o estudo sem competir visualmente com as aulas.

Referências atuais:

- abertura e conteúdo: `plataforma-curso/src/components/WelcomeView.jsx`;
- acabamento compacto da abertura: `plataforma-curso/src/components/welcomeElegance.css`;
- estrutura do navegador: `plataforma-curso/src/components/Sidebar.jsx`;
- acabamento do navegador: `plataforma-curso/src/components/sidebarNavigator.css`.

Regras para a página inicial:

- tratar a abertura como uma introdução editorial, não como um painel publicitário gigante;
- manter título, proposta, ações, mapa das fases e indicadores, mas com altura e densidade controladas;
- representar as cinco fases como uma trilha editorial de etapas, sem painéis tecnológicos decorativos, constelações ou ilustrações que não ajudem na navegação;
- evitar grandes massas escuras e cartões excessivamente aninhados;
- fazer a ação de continuar estudando ser a principal;
- preservar legibilidade e ordem de leitura no celular;
- não duplicar na abertura informações que já estão detalhadas no currículo abaixo.

Alterações na moldura não mudam o conteúdo pedagógico das aulas nem o estado do cronograma. Elas só devem ser registradas neste blueprint quando estabelecerem um padrão reutilizável.

## 8. Critério de conclusão de uma aula

Uma aula só está pronta quando:

- a matriz cobre 100% do conteúdo único;
- a sequência é ensinável sem assistência externa;
- comandos e cliques possuem contexto;
- código possui destaque de sintaxe;
- saídas e estados esperados estão visíveis;
- erros relevantes possuem recuperação;
- existe uma prática guiada;
- existe um desafio de transferência;
- os critérios de aceite são objetivos;
- build, lint e diff check foram executados;
- desktop e celular foram verificados;
- o responsável pelo curso aprovou.

## 9. Antipadrões proibidos

- trocar apenas Markdown por cartões bonitos;
- escrever páginas longas de definições antes da primeira ação;
- mandar executar sem mostrar saída;
- presumir que o aluno sabe localizar telas, criar contas ou configurar ferramentas;
- usar “faça isso” sem explicar por quê;
- repetir o mesmo conceito para aumentar a quantidade de aulas;
- remover conteúdo avançado para terminar mais rápido;
- criar screenshots falsos de ferramentas;
- usar código sem cores;
- apresentar código que não compila sem avisar;
- criar uma simulação que não corresponde à explicação;
- marcar como refeita antes de aprovação;
- reconstruir em massa com uma plantilla genérica;
- editar trabalho não relacionado durante a reconstrução.

## 10. Protocolo para retomar em outro chat

O novo chat deve executar esta ordem:

1. ler este blueprint inteiro;
2. ler `README.md` desta pasta;
3. ler `STATUS_REVISAO.json`;
4. consultar o início e o módulo relevante do cronograma;
5. abrir as referências 008 e 010;
6. confirmar qual aula está autorizada;
7. ler integralmente o original e as aulas adjacentes;
8. preencher a matriz de cobertura;
9. apresentar ou implementar a nova experiência;
10. validar;
11. aguardar aprovação;
12. atualizar o estado e gerar o cronograma.

Se alguma referência estiver ausente ou não compilar, o trabalho deve parar e o problema deve ser informado. Não se deve improvisar silenciosamente um padrão diferente.

## 11. Manutenção deste blueprint

Quando uma nova aula introduzir um arquétipo realmente novo — por exemplo, laboratório de banco, API interativa ou diagrama de arquitetura — registre:

- a aula aprovada;
- o novo componente;
- o CSS;
- os recursos;
- o que esse arquétipo ensina;
- quais assuntos se beneficiam dele;
- quais erros evitar.

O blueprint pode evoluir, mas as regras de preservação, cobertura, prática, evidência e validação não podem ser enfraquecidas.
