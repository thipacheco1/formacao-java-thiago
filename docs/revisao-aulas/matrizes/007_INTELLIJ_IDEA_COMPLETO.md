# Matriz de cobertura — aula 007

## Identificação

- ID: 007_M0_07_INTELLIJ_IDEA_COMMUNITY_COMPLETO
- Título antigo: IntelliJ IDEA Community Completo
- Original: docs/aulas/007_M0_07_INTELLIJ_IDEA_COMMUNITY_COMPLETO.md
- Anterior: aula 006 reconstruída — compilação manual, saída e classpath
- Seguinte: 008_M0_08_DEBUG_INICIAL_NO_INTELLIJ.md
- Arquétipo: laboratório de ambientação em IDE com interfaces inspecionáveis e estados sincronizados
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno conseguirá instalar ou abrir o IntelliJ IDEA atual, abrir o projeto pela raiz, configurar conscientemente o JDK 21, reconhecer src como Sources Root, criar e executar uma classe Java, ler a configuração de execução, comparar IDE e terminal, usar assistência de edição sem clicar no escuro e auditar o projeto antes de seguir para debug.

## Inventário do conteúdo antigo

| Item | Tipo | Destino novo | Evidência |
|---|---|---|---|
| Checklist de instalação, raiz, JDK, src, Run, Debug, terminal, java e javac | Verificação | Etapas 1 a 10 | Auditoria progressiva |
| IntelliJ como IDE profissional | Conceito | Etapa 1 | Mapa de interface e responsabilidades |
| Editor, compilação, execução, debug, terminal, VCS, busca e refatoração | Conceito | Etapas 1 e 9 | Mapa explorável |
| A IDE preserva o fluxo fonte, compilação, classe e JVM | Ponte | Etapas 1 e 6 | Comparador manual × Run |
| Community versus Ultimate | Contexto | Etapa 1 | Atualização para distribuição unificada |
| Projeto como unidade de arquivos e configurações | Conceito | Etapa 3 | Welcome/Open e diagrama projeto/módulo |
| Criar projeto versus abrir projeto existente | Decisão | Etapa 3 | Comparador e seleção da raiz |
| Project SDK com JDK 21 | Configuração | Etapa 4 | Project Structure interativo |
| SDK diferente do terminal, build ou pipeline | Diagnóstico | Etapas 4 e 8 | Matriz de versões |
| src guarda fonte e pode ser Sources Root | Organização | Etapa 5 | Árvore e menu Mark Directory As |
| out e target/classes guardam compilados | Organização | Etapas 5 e 10 | Árvore de fonte e gerado |
| Run não é mágica | Conceito/prática | Etapa 6 | Gutter, compilação e janela Run |
| Run Configuration | Configuração | Etapa 7 | Diálogo com classe, JRE e diretório |
| Working directory | Conceito | Etapa 7 | Experimento de caminho relativo |
| Terminal integrado | Prática | Etapa 8 | pwd, ls, versões e origens |
| Formatação | Ferramenta | Etapa 9 | Antes/depois e Ctrl+Alt+L |
| Auto import e Optimize Imports | Ferramenta | Etapa 9 | Sugestão e ação simuladas |
| Autocomplete | Ferramenta | Etapa 9 | Popup com assinatura e retorno |
| Navegação | Ferramenta | Etapa 9 | Chamada para declaração |
| Refatoração Rename | Ferramenta | Etapa 9 | Preview de referências |
| Debug | Ponte | Etapa 6 e fechamento | Botão identificado; prática reservada à 008 |
| Git dentro da IDE e no terminal | Ferramenta | Etapa 10 | Mapa visual × comandos |
| Abrir C:\dev\projects\formacao-java-backend | Atividade | Etapa 3 | Fluxo Open Project |
| Criar e executar src/Main.java | Atividade | Etapas 5 e 6 | Editor, gutter e console |
| Conferir terminal e projeto no mesmo contexto | Atividade | Etapa 8 | Comparador de raiz |
| Criar docs/atalhos.md | Registro | Etapa 10 | Documento copiável |
| Regras para .idea, arquivos iml, out, class e target | Higiene | Etapa 10 | Quadro com nuance de equipe |
| Oito erros comuns | Diagnóstico | Etapas 4 a 10 | Clínica com recuperação |
| Critérios de conclusão | Verificação | Etapa 10 | Auditoria prática |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| A IDE ajuda, mas não substitui entendimento | Mostrar o pipeline manual sob cada ação visual |
| O SDK precisa estar correto | Uma auditoria de Project Structure e ambientes |
| Projeto continua sendo uma pasta | Sincronizar breadcrumb, árvore Project e pwd |
| Não versionar lixo local ou gerado | Uma etapa de higiene com política explícita |

## Lacunas e correções

| Lacuna antiga | Correção nova |
|---|---|
| Separava Community e Ultimate | Explicar a distribuição unificada desde 2025.3 e os recursos gratuitos |
| Não guiava instalação nem primeiro início | Mock de download, instalação e Welcome screen |
| Descrevia telas apenas por texto | Simulações inspecionáveis com regiões nomeadas |
| Citava JDK 21 sem mostrar como adicionar | Project Structure com Add JDK from Disk |
| Não separava Project SDK, module SDK e language level | Modelo progressivo com herança e override |
| Sources Root não tinha antes/depois | Árvore muda de pasta comum para raiz reconhecida |
| Run escondia as ações automáticas | Linha compile, output, classpath e launcher |
| Run Configuration era apenas uma lista | Formulário simulado e experimento |
| Ctrl+S não explicava o autosave | Modelo de salvamento automático e ações ao salvar |
| Mandava ignorar toda .idea de forma absoluta | Regra inicial com nuance de política do time |
| Debug podia repetir a aula 008 | Identificar o controle e reservar a prática |
| Faltava desafio de recuperação | Projeto mal aberto, SDK errado e src comum |

## Sequência nova

| Etapa | Ação | Evidência |
|---:|---|---|
| 1 | Reconhecer produto e interface | Mapa atual e distribuição unificada |
| 2 | Instalar ou validar | Fluxo de instalação e primeiro início |
| 3 | Abrir pela raiz | Welcome/Open e árvore correta |
| 4 | Configurar JDK 21 | Project Structure interativo |
| 5 | Organizar fontes | Project tool window e Sources Root |
| 6 | Criar e executar Main | IDE completa, Run e console |
| 7 | Ler Run Configuration | Campos e working directory |
| 8 | Comparar IDE e terminal | Terminal e matriz de versões |
| 9 | Usar assistência com intenção | Completion, import, formato, navegação e Rename |
| 10 | Auditar higiene e registrar | Git, atalhos, desafio e diário |

## Recursos necessários

- [x] Código Java e PowerShell com destaque.
- [x] Mock de instalação e Welcome.
- [x] Mock completo da IDE.
- [x] Project Structure com JDK, fontes e saída.
- [x] Run Configuration com campos e efeitos.
- [x] Terminal integrado com saídas.
- [x] Completion, import, formato, navegação e Rename.
- [x] Clínica, desafio e documento copiável.

## Preservação

- [x] Todo conceito único do original possui destino.
- [x] O checklist virou auditoria progressiva.
- [x] Relações com compilação, Git, Maven e backend foram preservadas.
- [x] Os oito erros possuem inspeção, correção e confirmação.
- [x] Abrir projeto, configurar JDK, criar Main e validar terminal foram preservados.
- [x] Ferramentas de edição continuam presentes.
- [x] A atualização de 2026 não troca a baseline Java 21.
- [x] Debug permanece como ponte para a Aula 008.

## Validação final

- [x] Build aprovado.
- [x] Lint sem novos erros.
- [x] git diff --check aprovado nos arquivos da reconstrução.
- [ ] Desktop verificado.
- [ ] Celular verificado.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] Próxima etapa e aula ficam bloqueadas corretamente.
- [ ] Existe somente um controle geral de conclusão.
- [x] Código copiável e destacado.
- [x] Textos, comandos e saídas revisados.
- [x] Responsável pelo curso aprovou.
