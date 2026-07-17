# Matriz de cobertura — aula 019

## Identificação

- ID: `019_M0_19_ESTRUTURA_PROFISSIONAL_DO_REPOSITORIO_DE_CURSO_OFICIAL`
- Arquivo original: `docs/aulas/019_M0_19_ESTRUTURA_PROFISSIONAL_DO_REPOSITORIO_DE_CURSO_OFICIAL.md`
- Aula anterior: Docker Desktop e WSL2 — preparação
- Aula seguinte: checklist final do ambiente
- Arquétipo: oficina visual de arquitetura de repositório com árvore, documentos e Git sincronizados
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno conseguirá auditar um repositório existente sem apagar conteúdo, projetar e criar a estrutura inicial da formação, explicar a responsabilidade da raiz, de `docs`, `src/main/java`, `src/test/java` e `labs`, escrever README e documentos mínimos, aplicar `.gitignore` e `.gitkeep` com consciência, escolher nomes recuperáveis e entregar a mudança por um commit pequeno, nominal e revisado.

## Inventário do conteúdo e destino

| Conteúdo único | Destino novo | Evidência |
|---|---|---|
| `C:\dev`, `projects` e `tools` | Etapa 2 | Auditoria do ponto de partida sem recriar nem mover cegamente |
| Inventário de Java, IntelliJ, Git/GitHub, Maven, PostgreSQL/DBeaver, HTTP e Docker/WSL2 | Etapas 1 e 6 | Migração do estado observado para `docs/ambiente.md`, sem revalidar o Módulo 0 |
| Repositório como memória técnica, história e rastreabilidade | Etapa 1 | Comparador pasta solta versus repositório compreensível |
| Relação com backend Java profissional | Etapas 1 e 3 | Mapa do repositório inicial para estruturas futuras |
| Evolução por commits de intenção | Etapas 1 e 10 | Linha do tempo de evidências por aula |
| Estrutura raiz recomendada | Etapa 3 | Árvore interativa com responsabilidade por nó |
| `README.md` como porta de entrada | Etapa 5 | Editor e preview sincronizados |
| Objetivo, stack, organização, validação, estudo, comandos e referências no README | Etapa 5 | Checklist de conteúdo do README |
| Pasta `docs` separada do código | Etapa 6 | Workspace com seis documentos e função de cada um |
| `docs/ambiente.md` | Etapa 6 | Modelo sem senha real e com evidência observada |
| `docs/atalhos.md` | Etapa 6 | Tabela de ações e atalhos com aviso de keymap |
| `docs/diario-de-bordo.md` | Etapa 6 | Entrada por aula ligada a decisão, erro e prova |
| `docs/http-basico.md` e `docs/docker-basico.md` | Etapa 6 | Documentos produzidos nas aulas anteriores preservados |
| `docs/checklist-ambiente.md` | Etapa 6 | Local criado; aprofundamento reservado à Aula 20 |
| `src/main/java` | Etapas 3, 4 e 7 | Árvore e explicação de código principal |
| `src/test/java` | Etapas 3, 4 e 7 | Árvore e explicação de testes separados |
| Estrutura padrão Maven/Gradle | Etapa 7 | Conexão conceitual sem criar `pom.xml` nem projeto completo |
| `labs` para práticas isoladas | Etapa 7 | Classificador de experimento, código oficial e descarte |
| Conteúdo mínimo de `labs/README.md` | Etapa 7 | Editor com regras de limite |
| `.gitignore` para Java, Maven, Gradle, IntelliJ, SO, logs, temporários e segredos | Etapa 8 | Simulador de caminhos e regra correspondente |
| `target/`, `build/`, `.gradle/`, `*.class`, `out/`, `.idea/`, `*.iml`, `.env`, `.env.*`, `!.env.example`, `*.log`, `*.tmp`, `.DS_Store`, `Thumbs.db` | Etapa 8 | Casos verificáveis no simulador |
| `.env.example` seguro | Etapa 8 | Exceção visível sem valor real |
| `.gitkeep` como convenção não oficial | Etapa 7 | Pasta vazia, arquivo marcador e remoção futura |
| Padrões de nomes minúsculos, hífen, sem espaço/acento e descritivos | Etapa 9 | Clínica de renomeação por intenção |
| Evitar `teste1`, `novo`, `final2` e equivalentes | Etapa 9 | Comparador de nomes recuperáveis |
| Commits pequenos e de uma intenção | Etapa 10 | Fluxo status → diff → stage nominal → staged diff → commit |
| Mensagem de commit clara | Etapa 10 | Comparador de mensagem vaga e orientada à intenção |
| Rotina de dez passos por aula | Etapa 10 | Pipeline visual e navegável |
| Não usar `git add .` cegamente | Etapa 10 | Preparação nominal dos arquivos e leitura do staged |
| Criação pelo PowerShell | Etapa 4 | Terminal e árvore sincronizados após cada grupo de comandos |
| `git init` somente se ainda não existir | Etapas 2 e 4 | Gate que evita reinitialização sem contexto |
| Estrutura esperada após prática | Etapas 3 e 4 | Árvore final conferível |
| Organização corporativa por pacote, testes, API, SQL, ADR e collection | Etapa 9 | Classificador de artefatos de ordem de serviço |
| Rastreabilidade por aula | Etapas 6 e 10 | Diário, diff e commit conectados |
| Evidências: commits, README, diário, checklists, estrutura, diffs e histórico | Etapas 1, 6 e 10 | Linha de evidência recuperável |
| Dez erros comuns | Etapa 11 | Clínica com sintoma, consequência, correção e prova |
| Checklist de estrutura | Etapa 11 | Auditoria final dos arquivos e regras |
| Adaptar repositório existente sem apagar | Etapas 2, 4 e 11 | Gate de descoberta e proibição de sobrescrita/destruição |
| Critérios de conclusão | Etapa 11 | Defesa oral e entrega verificável |
| Fronteira: sem Java profundo e sem Maven completo | Etapas 3, 7 e 11 | Transição preservada para checklist final e M1 |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| Funções de README, docs, src e labs repetidas em definição, checklist e fechamento | Uma árvore central reaparece na prática e na auditoria final |
| Lista de arquivos repetida em vários blocos | Workspace único mostra arquivo, finalidade, conteúdo e estado |
| Fluxo Git repetido com `git add .` | Um pipeline seguro usa preparação nominal e staged diff |
| `.gitignore` apresentado duas vezes com listas diferentes | Conjunto reforçado único e simulador de regras |
| Organização e rastreabilidade em parágrafos separados | Linha de evidência conecta arquivo, diff, commit e recuperação futura |
| Critérios de conclusão repetem atividade | Checklist final deriva diretamente das evidências construídas |

## Defeitos corrigidos

| Defeito antigo | Correção |
|---|---|
| Markdown quebrado entre diário e atalhos | Documentos separados em estados explícitos de um workspace |
| Material longo sem prática visual sincronizada | Terminal, árvore, editor, preview e Git mudam juntos |
| `git add .` aparece como comando principal | Stage nominal; `git add .` vira risco a compreender, não recomendação padrão |
| Cerca `bash` usada em fluxo Windows | PowerShell em toda prática local |
| `New-Item` sem proteção para arquivos existentes | Auditoria anterior, `-ItemType` explícito e criação somente do que falta |
| `mkdir` repetitivo sem estado esperado | Grupos de criação com árvore resultante e saída interpretada |
| `.gitignore` ensinado sem prova | `git check-ignore -v` e simulador mostram regra correspondente |
| `.gitignore` pode parecer capaz de ocultar arquivo já rastreado | Estado “já rastreado” é distinguido de “não rastreado e ignorado” |
| `.gitkeep` pode parecer recurso oficial | Convenção, finalidade e momento de remoção ficam explícitos |
| Checklist do ambiente parcialmente antecipado | Aula 19 cria o arquivo; Aula 20 realiza a validação completa |
| Organização corporativa apresentada apenas como árvore textual | Classificador conecta tipo de artefato a lugar e justificativa |
| Nenhum cuidado com repositório já existente | Descoberta, diff e cópia de segurança lógica precedem qualquer reorganização |
| Senhas citadas em documentos de ambiente | Placeholders e prova sem segredo são obrigatórios |

## Sequência nova

1. Comparar pasta solta com repositório rastreável.
2. Auditar o repositório existente sem alterar ou apagar.
3. Projetar a árvore e a responsabilidade de cada área.
4. Criar apenas o que falta com PowerShell e árvore sincronizada.
5. Escrever e visualizar o README de entrada.
6. Organizar os seis documentos e o diário de bordo.
7. Separar código, testes, laboratórios e pastas vazias.
8. Construir e provar o `.gitignore` reforçado.
9. Escolher nomes e classificar artefatos corporativos.
10. Entregar por diff, stage nominal e commit pequeno.
11. Diagnosticar dez erros, conferir estrutura e defender a decisão.

## Recursos

- [x] Comparador visual pasta solta versus repositório.
- [x] Árvore de arquivos interativa com responsabilidades.
- [x] Terminal PowerShell e árvore sincronizados.
- [x] Editor/preview de README e documentos.
- [x] Workspace visual de `docs`.
- [x] Classificador `src`, `test`, `labs`, `docs` e raiz.
- [x] Simulador de `.gitignore` e regra correspondente.
- [x] Clínica de nomes e estrutura corporativa.
- [x] Pipeline Git com estados working tree, stage e commit.
- [x] Clínica de dez erros e checklist final.

## Preservação

- [x] Todo conceito único possui destino.
- [x] Todos os arquivos e diretórios da estrutura antiga permanecem.
- [x] Inventário do ambiente permanece como conteúdo de documentação, não como revalidação.
- [x] Segurança, adaptação e prova do `.gitignore` foram aprofundadas.
- [x] A prática não apaga, move ou sobrescreve conteúdo existente.
- [x] Java profundo, `pom.xml` e projeto Maven completo não são antecipados.
- [x] O checklist integral permanece reservado à Aula 20.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [x] Responsável aprovou.

### Observação da auditoria

A estrutura foi comparada com as convenções de layout já introduzidas no curso e com o comportamento documentado do Git para `gitignore`, arquivos vazios e staging. A aula não cria um projeto Maven: apenas prepara diretórios que o aluno reconhecerá depois. Em repositório existente, a árvore didática é referência de decisão, nunca autorização para mover ou apagar arquivos automaticamente.

Lint, dois builds consecutivos, JSON de estado, cronograma, verificação de whitespace no escopo e rota da Aula 019 foram aprovados. A sessão não possuía controlador de navegador conectado; por isso as verificações visuais de desktop/celular, as interações e os controles permanecem explicitamente pendentes, em vez de serem aprovados somente por leitura estática.
