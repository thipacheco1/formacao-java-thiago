# Matriz de cobertura — aula 020

## Identificação

- ID: `020_M0_20_CHECKLIST_FINAL_DO_AMBIENTE_OFICIAL`
- Arquivo original: `docs/aulas/020_M0_20_CHECKLIST_FINAL_DO_AMBIENTE_OFICIAL.md`
- Aula anterior: estrutura profissional do repositório de curso
- Aula seguinte: primeiro programa Java destrinchado
- Arquétipo: banca visual de prontidão com provas, criticidade e plano de pendências
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno conseguirá executar e interpretar uma cadeia de provas do ambiente, distinguir instalação de validação, registrar aprovado/falhou/pendente com evidência, corrigir e testar novamente, proteger segredos, produzir `docs/checklist-ambiente.md`, entregar o fechamento do M0 por Git revisado e decidir honestamente se o gate para o M1 está liberado.

## Inventário do conteúdo e destino

| Conteúdo único | Destino novo | Evidência |
|---|---|---|
| Aprovação final de Java, IntelliJ, Git, GitHub, Maven, PostgreSQL, DBeaver, cliente HTTP, WSL2, Docker, repositório, diário e segurança | Etapas 1 a 12 | Painel de domínios com prova e resultado registrado |
| Regra de transição para o M1 | Etapas 1, 11 e 12 | Gate crítico separado de dependências futuras |
| Problema de confundir erro de ambiente com dificuldade em Java | Etapa 1 | Mapa sintoma → camada → prova |
| Checklist como validação objetiva e uso em onboarding/deploy/release/auditoria | Etapa 1 | Modelo evidência, critério, resultado e próxima ação |
| Objetivo do Módulo 0 | Etapas 1 e 12 | Linha de capacidades preparadas |
| Organização do Windows: `C:\dev`, projects, labs, tools, studies e temp | Etapa 2 | Auditor visual de caminhos e critérios |
| Projetos fora de Downloads/Área de Trabalho e nomes técnicos estáveis | Etapa 2 | Classificador de localização e nomes |
| PowerShell: `pwd`, `ls`, `mkdir`, `cd`, `New-Item`, remoção cuidadosa e terminal IntelliJ | Etapa 2 | Laboratório temporário com saída, alvo explícito e recuperação |
| JDK/JRE/JVM, `java`, `javac`, `JAVA_HOME`, origem dos executáveis | Etapa 3 | `java -version`, `javac -version`, `$env:JAVA_HOME` e `where.exe` interpretados |
| `JAVA_HOME` na raiz, não em `bin` | Etapa 3 | Diagnóstico de caminho |
| Compilação manual de `Main.java`, `.class` e execução | Etapa 3 | Editor, pipeline e saída sincronizados |
| IntelliJ: abertura, Project SDK, Run, breakpoint, Step Over, Variables, terminal, ações e Project | Etapa 3 | Mock didático da IDE e checklist operacional |
| Diferença terminal versus IDE | Etapas 3 e 11 | Clínica PATH/JAVA_HOME versus Project SDK/Run Configuration |
| Git global: versão, identidade, branch e `core.autocrlf` | Etapa 4 | Comandos e origem de cada configuração |
| Git local: status, diff, stage, staged diff, commit e árvore limpa | Etapas 4 e 12 | Pipeline nominal sem `git add .` cego |
| Git versus GitHub | Etapa 4 | Papéis local/remoto e evidências diferentes |
| GitHub: remote, branch, push, README e ausência de segredo | Etapa 4 | Auditoria de `origin` e estado; push real não é simulado como sucesso |
| Markdown: README, ambiente, atalhos, diário e checklist | Etapa 5 | Workspace de arquivos e critérios |
| Títulos, listas, código e tabelas | Etapa 5 | Preview do documento final |
| IA com método, responsabilidade, sigilo e validação | Etapa 5 | Clínica de decisões, não teste de instalação |
| Maven: versão, executável, Java usado, instalação versus projeto | Etapa 6 | `mvn -version` e `where.exe mvn` com interpretação |
| `mvn -version` sem `pom.xml` versus build com `pom.xml` | Etapa 6 | Comparador de contexto |
| PostgreSQL: serviço, porta, usuário, database, senha fora do Git | Etapa 7 | Cadeia servidor → listener → autenticação → database |
| `SELECT version()` e `SELECT current_database()` | Etapa 7 | Editor SQL e grade de resultado |
| DBeaver: cliente, driver, conexão, Test Connection e editor | Etapa 7 | Mock didático com estados |
| Postman/Insomnia: collection, environment, `base_url`, GET, POST, JSON, Content-Type e status | Etapa 8 | Auditor de request/response e workspace |
| HTTP: request, response, URL, endpoint, cinco métodos, headers, body, JSON, status, path e query | Etapa 8 | Defesa conceitual por cartões de cenário |
| Status 200, 201, 204, 400, 401, 403, 404, 409 e 500 | Etapa 8 | Mapa de status preservado |
| Segredo fora de collection compartilhada | Etapas 8 e 11 | Gate de segurança |
| WSL: status, distribuição e versão 2 | Etapa 9 | `wsl --status` e `wsl -l -v` interpretados |
| Docker: Desktop, engine, CLI, info, hello-world, ps, ps -a e images | Etapa 9 | Cadeia de provas cliente/servidor/objeto |
| Imagem, contêiner, porta, volume e imagem confiável | Etapa 9 | Defesa conceitual e segurança |
| Estrutura: README, `.gitignore`, docs, main, test e labs | Etapa 4 | Auditor de árvore reutilizando a Aula 19 |
| Regras de ignore para target, build, Gradle, class e `.env` | Etapa 4 | `git check-ignore -v` e inspeção de status |
| Rotina por aula: ler, praticar, diário, docs, terminal, Git e commit | Etapa 10 | Simulador de ciclo sustentável |
| Atalhos essenciais do IntelliJ e Git | Etapa 10 | Ações primeiro; atalhos sujeitos ao keymap |
| Arquivo mínimo `docs/checklist-ambiente.md` | Etapa 12 | Gerador de documento por resultados observados |
| Onboarding de ordem de serviço | Etapa 10 | Mapa de dependências do primeiro trabalho corporativo |
| Roteiro completo de validação | Etapas 2 a 9 | Comandos distribuídos por domínio e consolidados no dossiê |
| Quando um item falhar: não marcar, registrar, corrigir, testar de novo | Etapa 11 | Ciclo interativo de incidente |
| Dez erros comuns | Etapa 11 | Clínica com sintoma, risco, correção e nova prova |
| Commit final do M0 | Etapa 12 | Stage nominal, diff e mensagem clara |
| Critério de conclusão e explicação do porquê do M0 | Etapa 12 | Defesa oral e gate calculado |
| Transição para `Main.java`, class, main e println | Etapa 12 | Prévia sem ensinar o conteúdo da Aula 21 |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| Vinte checklists, roteiro completo e arquivo final repetem os mesmos domínios | Uma banca por domínio alimenta automaticamente o dossiê final |
| Critérios e checkboxes repetem comandos | Cada prova reúne comando, saída esperada, interpretação e critérios |
| Segurança aparece em Git, docs, HTTP e fechamento | Gate transversal único reaparece onde a exposição pode ocorrer |
| Status/diff/staged/commit repetidos | Um pipeline final entrega somente os três documentos nominais |
| IntelliJ e terminal repetem Java | Um laboratório sincronizado separa JDK do sistema e SDK da IDE |
| Docker/WSL repetem a Aula 18 | Auditoria curta exige evidência, sem reensinar instalação completa |

## Defeitos corrigidos

| Defeito antigo | Correção |
|---|---|
| Cerca Markdown fechada sem abertura no início | Reconstrução sem markup inválido |
| Checklist permite marcar por confiança | Estados “não testado”, “aprovado”, “falhou” e “pendente formal” exigem evidência textual |
| `where java`/`where javac`/`where mvn` em PowerShell | Uso explícito de `where.exe` |
| Remoção recursiva genérica de pasta de teste | Alvo nominal dentro de `labs`, inspeção anterior e remoção apenas do laboratório criado |
| `git add .` reaparece | Stage nominal e leitura do staged |
| Push aparece como comando sem risco/contexto | Prova remota separa configuração de ação externa; não inventa sucesso |
| Contradição sobre Maven crítico | Maven integra o gate operacional mais seguro; primeira aula ainda usa compilação manual |
| Todos os itens parecem igualmente bloqueantes | Gate M1 e dependências futuras são separados, com pendência, dono e prazo |
| Atalhos tratados como prova de ambiente | Ação é requisito; combinação é referência variável por keymap |
| Instalação confundida com funcionamento | Todo domínio separa presença, configuração, operação e interpretação |
| Repetição extensa sem síntese de falha | Clínica por camada concentra dez erros e ciclo de reteste |
| Checklist final pode conter versão copiada | Documento exige valor observado e marca pendência quando a prova não foi executada |
| `.class` e segredo podem entrar no commit final | Auditor de status/ignore e gate de segredo antecedem staging |

## Sequência nova

1. Entender evidência, criticidade e gate do M1.
2. Validar Windows e PowerShell com laboratório controlado.
3. Provar Java, compilação manual, IntelliJ e debug.
4. Provar Git, GitHub, repositório e proteção.
5. Auditar documentação, diário e uso responsável de IA.
6. Provar Maven e o JDK que ele realmente usa.
7. Provar PostgreSQL e DBeaver por SQL.
8. Provar cliente HTTP e defender conceitos HTTP.
9. Provar WSL2 e Docker por cliente, engine e objetos.
10. Ensaiar rotina, atalhos por ação e onboarding corporativo.
11. Tratar falhas, registrar pendências e repetir provas.
12. Gerar dossiê, entregar no Git e calcular o gate do M1.

## Recursos

- [x] Painel visual de domínios e criticidade.
- [x] Laboratório PowerShell com alvo controlado.
- [x] Java/IntelliJ/debug sincronizados.
- [x] Auditor Git/GitHub/repositório.
- [x] Workspace de documentação e decisões sobre IA.
- [x] Prova Maven com leitura de JDK.
- [x] SQL e DBeaver simulados.
- [x] Auditor HTTP com métodos e status.
- [x] Cadeia WSL2/Docker.
- [x] Rotina e onboarding corporativo.
- [x] Clínica de falhas e plano de pendências.
- [x] Gerador do checklist final e gate do M1.

## Preservação

- [x] Todo conceito único possui destino.
- [x] Os vinte checklists antigos permanecem cobertos pelos doze domínios guiados.
- [x] Todos os comandos, SQL, arquivos, atalhos e critérios possuem destino.
- [x] O gate distingue crítico de adiável sem fingir aprovação.
- [x] Nenhuma ação externa ou destrutiva é simulada como concluída.
- [x] A segurança de credenciais e arquivos gerados foi aprofundada.
- [x] A Aula 21 permanece responsável por destrinchar o primeiro programa Java.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [x] Responsável aprovou.

### Observação da auditoria

Esta aula fecha o M0 e por isso não pode transformar checkboxes em declaração automática de prontidão. A experiência nova registra resultados didáticos localmente, mas orienta o aluno a executar cada prova na própria máquina e transcrever somente valores observados. Banco, cliente HTTP e Docker podem gerar pendência formal antes dos módulos dependentes; o gate imediato do curso preserva organização, terminal, Java/javac, compilação, IntelliJ, Git, repositório, documentação/diário, segurança e Maven. A validação automatizada passou em lint, duas compilações de produção, rota HTTP 200 e verificação de whitespace no escopo; a inspeção visual responsiva e dos controles permanece pendente porque não há navegador controlável conectado nesta sessão.
