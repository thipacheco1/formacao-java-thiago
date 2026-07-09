# M0 - Plano de revisao editorial V2

Este documento inicia a curadoria do Modulo 0 para o novo padrao editorial do curso.

Objetivo:

```text
manter profundidade tecnica;
reduzir cansaco;
separar aula principal de material complementar;
preservar comandos, pratica, entendimento e commits;
nao destruir o acervo original.
```

## Concordancia editorial

O objetivo principal de um curso nao e empilhar secoes.

O objetivo principal e o aluno:

```text
entender o assunto;
executar com a propria mao;
errar e corrigir;
registrar o que foi feito;
fazer commit;
conseguir explicar o que aprendeu.
```

Portanto, concordo com a separacao:

```text
AULA
conteudo principal, pratica guiada, entendimento, comandos, atalhos uteis, exercicio guiado e commit.

MATERIAL COMPLEMENTAR
checklists longos, anotacoes, perguntas, simulados, desafios extras, criterios extensos e referencias.
```

## Regra para nao perder conteudo

Nada importante deve sumir.

O que mudar:

```text
local do conteudo;
ordem;
tamanho de secoes repetitivas;
densidade de checklist;
obrigatoriedade de simulado por aula.
```

O que nao mudar:

```text
conceitos essenciais;
comandos;
codigo;
laboratorios;
erros comuns relevantes;
commit recomendado;
sequencia pedagogica;
ponte entre aulas.
```

## Novo formato da aula revisada

Cada aula revisada do M0 deve seguir:

```text
# NNN - M0.xx - Titulo

# Aula

## Apresentacao
## Onde estamos na formacao
## Objetivo pratico
## Conceito essencial
## Mao na massa guiada
## Entendendo o que foi feito
## Atalhos ou comandos uteis
## Erros comuns importantes
## Exercicio guiado
## Commit recomendado
## Fechamento

---

# Material complementar

## Checkpoint
## Perguntas de revisao
## Desafios opcionais
## Anotacoes sugeridas
## Referencias internas
```

Nem toda aula precisa ter todas as secoes complementares.

## Diagnostico geral do M0

Arquivos analisados:

```text
000 a 020
21 arquivos
```

Tamanho geral:

```text
menor aula: 000, com 1.399 palavras;
maior aula: 014, com 4.558 palavras;
aula mais carregada em checklist: 020;
aula com mais fragmentacao de titulos: 012;
aula mais candidata a enxugamento: 014;
aula que deve virar fechamento de modulo: 020.
```

Auditoria numerica completa:

```text
docs/FONTE_DA_VERDADE_CONTINUIDADE_CURSO/REVISAO_EDITORIAL_V2/M0_AUDITORIA_EDITORIAL.csv
```

## Decisao aula a aula

| Aula | Arquivo | Acao editorial | O que fica na AULA | O que vai para MATERIAL COMPLEMENTAR |
|---:|---|---|---|---|
| 000 | `000_AULA_DE_ABERTURA_O_CAMINHO_PARA_SE_TORNAR_ENGENHEIRO_JAVA_BACKEND_ARQUITETO_JAVA.md` | Ajuste leve | apresentacao da formacao, pacto, metodo de estudo, uso de IA com criterio | modelo longo de anotacao e detalhes repetitivos |
| 001 | `001_M0_01_MAPA_DA_FORMACAO_COMPLETA_E_NIVEIS_DE_CARREIRA_JAVA.md` | Reorganizar levemente | mapa da formacao, niveis de carreira, por que a trilha existe | listas extensas de modulos e reflexoes extras |
| 002 | `002_M0_02_DIAGNOSTICO_INICIAL_TECNICO_E_PLANO_DE_ESTUDO.md` | Ajuste leve | diagnostico, escala, plano de 30/60/90 dias, registro inicial | perguntas extras e modelos longos |
| 003 | `003_M0_03_ORGANIZACAO_DO_WINDOWS_PARA_DESENVOLVIMENTO.md` | Ajuste leve | organizacao de pastas, riscos de caminhos ruins, pratica no PowerShell | observacoes detalhadas e checklist |
| 004 | `004_M0_04_TERMINAL_POWERSHELL_E_COMANDOS_BASICOS.md` | Ajuste leve | comandos essenciais, navegacao, criacao/movimentacao com cuidado, pratica | lista de consulta de comandos |
| 005 | `005_M0_05_JDK_JRE_JVM_E_ESCOLHA_DE_VERSAO_LTS.md` | Reorganizar levemente | JVM/JRE/JDK, LTS, JAVA_HOME, PATH, validacao | comparacoes e observacoes extras |
| 006 | `006_M0_06_COMPILACAO_MANUAL_COM_JAVAC.md` | Reorganizar levemente | `.java`, `.class`, `javac`, `java`, erros de compilacao e execucao | variacoes extras de compilacao |
| 007 | `007_M0_07_INTELLIJ_IDEA_COMMUNITY_COMPLETO.md` | Reorganizar levemente | projeto, SDK, source root, run, terminal, formatacao, atalhos essenciais | lista longa de acoes da IDE |
| 008 | `008_M0_08_DEBUG_INICIAL_NO_INTELLIJ.md` | Reorganizar levemente | breakpoint, step over/into/out, variables, call stack, pratica guiada | roteiro longo de diagnostico |
| 009 | `009_M0_09_GIT_INSTALACAO_E_CONFIGURACAO_GLOBAL.md` | Ajuste leve | instalacao, `user.name`, `user.email`, branch, autocrlf, validacao | notas corporativas extras |
| 010 | `010_M0_10_GIT_LOCAL_DO_ZERO.md` | Ajuste leve | `init`, `status`, `add`, `commit`, `log`, `diff`, `.gitignore` | exemplos repetidos de ciclos |
| 011 | `011_M0_11_GITHUB_E_REPOSITORIO_REMOTO.md` | Reorganizar levemente | remoto, origin, push, pull, clone, cenarios local/remoto | detalhes de HTTPS/SSH mais longos |
| 012 | `012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA.md` | Enxugar e mover complementos | Markdown essencial, titulos, listas, codigo, README simples | checklists longos e exemplos repetidos de Markdown |
| 013 | `013_M0_13_DIARIO_DE_BORDO_E_RASTREABILIDADE_DO_APRENDIZADO.md` | Reorganizar levemente | diario, rastreabilidade, erros corrigidos, commits | modelos alternativos e perguntas extras |
| 014 | `014_M0_14_CODEX_IA_NO_INTELLIJ_COM_ETICA_E_METODO.md` | Enxugar e mover complementos | uso correto da IA, seguranca, contexto, limites, metodo de estudo | muitos prompts, alertas repetidos e aprofundamentos |
| 015 | `015_M0_15_MAVEN_INSTALACAO_E_VALIDACAO_INICIAL_OFICIAL.md` | Reorganizar levemente | Maven, instalacao, PATH, validacao, erros comuns | proxy, settings e wrapper como complemento inicial |
| 016 | `016_M0_16_POSTGRESQL_E_DBEAVER_PREPARACAO_OFICIAL.md` | Reorganizar levemente | PostgreSQL, DBeaver, conexao, primeira validacao SQL | detalhes extras de seguranca e documentacao |
| 017 | `017_M0_17_POSTMAN_INSOMNIA_E_HTTP_BASICO_OFICIAL.md` | Reorganizar levemente | HTTP, metodos, status, headers, body, JSON, cliente HTTP | tabela maior de status e comparacoes extras |
| 018 | `018_M0_18_DOCKER_DESKTOP_E_WSL2_PREPARACAO_OFICIAL.md` | Reorganizar levemente | Docker, WSL2, imagem, container, run, validacao | topicos de producao e seguranca como complemento |
| 019 | `019_M0_19_ESTRUTURA_PROFISSIONAL_DO_REPOSITORIO_DE_CURSO_OFICIAL.md` | Enxugar e mover complementos | estrutura do repositorio, README, docs, labs, `.gitignore`, commit | checklists longos e criterios operacionais repetidos |
| 020 | `020_M0_20_CHECKLIST_FINAL_DO_AMBIENTE_OFICIAL.md` | Revisar como fechamento de modulo | validacao final do ambiente, criterios minimos, transicao para M1 | checklist detalhado por ferramenta e perguntas de revisao |

## Prioridade de revisao do M0

Ordem sugerida:

```text
1. Aula 012 - Markdown
2. Aula 014 - IA com metodo
3. Aula 019 - Estrutura do repositorio
4. Aula 020 - Fechamento do M0
5. Aulas 005 a 008 - ferramentas Java/IDE/debug
6. Aulas 009 a 011 - Git/GitHub
7. Aulas 015 a 018 - ferramentas futuras
8. Aulas 000 a 004 - abertura, mapa, diagnostico e terminal
```

Motivo:

```text
012, 014, 019 e 020 sao as que mais misturam aula principal com material de apoio.
Se o novo padrao funcionar nelas, funcionara no restante.
```

## Criterio de sucesso

Uma aula revisada do M0 deve:

```text
ficar mais facil de estudar;
preservar o conteudo tecnico essencial;
ter pratica clara;
ter commit quando fizer sentido;
ter complementos separados;
nao virar resumo;
nao perder a ambicao da formacao.
```

## Proximo passo recomendado

Antes de revisar todos os arquivos, fazer uma aula piloto:

```text
012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA.md
```

Ela e uma boa candidata porque tem muito conteudo de exemplo, listas e checklists. Da para testar o padrao V2 sem arriscar uma aula de ferramenta pesada como Docker ou Maven.
