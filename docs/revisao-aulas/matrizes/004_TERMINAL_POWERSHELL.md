# Matriz de cobertura — aula 004

## Identificação

- ID: `004_M0_04_TERMINAL_POWERSHELL_E_COMANDOS_BASICOS`
- Título antigo: Terminal, PowerShell e Comandos Básicos para Desenvolvimento Java Backend
- Arquivo original: `docs/aulas/004_M0_04_TERMINAL_POWERSHELL_E_COMANDOS_BASICOS.md`
- Módulo e posição: M0.04
- Aula anterior relevante: aula 003 reconstruída — organização do Windows para desenvolvimento
- Aula seguinte relevante: `005_M0_05_JDK_JRE_JVM_E_ESCOLHA_DE_VERSAO_LTS.md`
- Arquétipo escolhido: laboratório PowerShell com sistema de arquivos simulado e diagnóstico orientado por evidências
- Data da auditoria: 2026-07-16

## Resultado prometido ao aluno

Ao final, o aluno conseguirá abrir e ler um terminal PowerShell, navegar por caminhos absolutos e relativos, criar, copiar, mover, renomear e remover arquivos com verificação segura, usar histórico e autocomplete e diagnosticar se uma falha pertence à localização, ao `PATH` ou ao programa executado.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Parar de depender apenas de cliques | Propósito | Sim | Etapa 1 | Mapa mouse ↔ comando e transformação observável |
| Terminal como ferramenta diária de Java, Git, Maven, Docker e logs | Contexto | Sim | Etapas 1 e 9 | Painel de aplicação backend |
| Modelo “localização + comando” | Princípio | Sim | Etapas 1, 2 e 10 | Diagrama e checklist `pwd → ls → agir → confirmar` |
| Diferença entre terminal, shell e PowerShell | Conceito | Sim | Etapa 1 | Mock em camadas com rótulos e exemplos |
| Prompt e pasta atual | Conceito | Sim | Etapas 1 e 2 | Prompt anotado e terminal sincronizado com breadcrumb |
| `pwd` / `Get-Location` | Comando | Sim | Etapas 2, 3, 6 e 10 | Comando, saída realista, significado e confirmação |
| `ls`, `dir` / `Get-ChildItem` | Comando | Sim | Etapas 2, 4, 5, 6 e 10 | Listagem muda junto com a árvore de arquivos |
| `cd`, `cd ..`, `cd ..\..` / `Set-Location` | Comando | Sim | Etapa 3 | Laboratório de navegação absoluta e relativa |
| Caminho absoluto e relativo | Conceito | Sim | Etapa 3 | Mapa de rota e desafio de escolher o caminho correto |
| `mkdir` | Comando | Sim | Etapa 4 | Criação de `entrada`, `saida` e `docs` com saída |
| `New-Item` | Comando | Sim | Etapa 4 | Arquivo aparece na árvore e em `ls docs` |
| `Copy-Item` | Comando | Sim | Etapa 5 | Antes/depois deixa origem e cópia visíveis |
| `Move-Item` para mover e renomear | Comando/nuance | Sim | Etapa 5 | Dois estados diferentes no sistema de arquivos |
| `Remove-Item` com cuidado | Segurança | Sim | Etapa 6 | Protocolo de inspeção, remoção restrita e confirmação |
| `cls` / `Clear-Host` | Comando | Sim | Etapa 7 | Terminal limpa a tela sem alterar a árvore |
| Setas para histórico e `Get-History` | Produtividade | Sim | Etapa 7 | Mock de teclado e histórico com comandos anteriores |
| Autocomplete com `Tab` | Produtividade | Sim | Etapa 7 | Simulação completa `cd .\do` para `cd .\docs` |
| `java -version`, `git --version`, `mvn -version` | Diagnóstico | Sim | Etapa 8 | Painel mostra saídas, variações e leitura correta |
| `$env:JAVA_HOME`, `$env:MAVEN_HOME` e `$env:Path` | Ambiente | Sim | Etapa 8 | Inspeção de variáveis sem alterar configuração |
| Localizar executável | Diagnóstico | Sim | Etapa 8 | Correção técnica para `Get-Command java` e `where.exe java` |
| Terminal antigo pode não refletir `PATH` atualizado | Erro/ambiente | Sim | Etapa 8 | Linha do tempo processo pai → sessão antiga/nova |
| Comando não encontrado × programa executado com erro | Diagnóstico | Sim | Etapa 8 | Classificador com evidência e próximo teste |
| Exercício `C:\dev\labs\terminal-basico` | Atividade | Sim | Etapas 4, 5, 6 e 10 | Laboratório integrado preserva o mesmo estado final |
| Fluxo localizar, criar, navegar, listar, mover, copiar, apagar e confirmar | Processo | Sim | Etapas 2 a 6 e 10 | Máquina de estado e checklist final |
| Maven na pasta do projeto e presença de `pom.xml` | Aplicação profissional | Sim | Etapa 9 | Diagnóstico “comando ausente × pasta errada × teste falhou” |
| Logs `app.log`, `error.log`, `access.log` | Aplicação profissional | Sim | Etapa 9 | Mock de pasta de logs e decisão segura |
| Rodar `javac Main.java` na pasta errada | Erro | Sim | Etapa 9 | Mensagem `file not found` seguida de `pwd` e `ls` |
| Criar pasta no lugar errado | Erro | Sim | Etapas 3 e 9 | Comparação de prompt e caminho resultante |
| Confundir arquivo e pasta | Erro | Sim | Etapa 9 | Clínica `cd README.md` com diagnóstico |
| Copiar `rm -rf` de Linux para PowerShell | Segurança/portabilidade | Sim | Etapa 6 | Alerta explícito e alternativa limitada ao arquivo-laboratório |
| Ler mensagens de erro por categoria | Habilidade | Sim | Etapas 8 e 9 | Classificador: comando, arquivo, permissão, caminho, classe, porta, autenticação, dependência |
| Preparação para Java, Git, Maven, Docker, Spring, CI/CD e produção | Relação futura | Sim | Etapa 9 | Mapa de impacto sem antecipar execução da Aula 005 |
| Diário da Aula 004 | Registro | Sim | Etapa 10 | Documento copiável com comandos, evidências e dúvida |
| Critérios de conclusão | Verificação | Sim | Etapa 10 | Desafio e checklist observáveis |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| `pwd` e `ls` antes de agir | Abertura, seções próprias, exemplos, erros e atividade | Tornar um protocolo visual recorrente | Repete a decisão, não longos parágrafos |
| Lista de comandos | Seções individuais, resumo e atividade | Ensinar dentro de um único laboratório progressivo | Cada comando passa a mudar um estado visível |
| Terminal prepara ferramentas futuras | Abertura, Java, Git, Maven/Docker e fechamento | Consolidar no mapa de impacto | Preserva todas as relações sem repetir motivação |
| “Não decorar; diagnosticar” | Várias transições e fechamento | Demonstrar com classificador de falhas | O aluno pratica a postura em vez de reler a frase |
| Exercício `terminal-basico` | Exemplo mínimo e atividade guiada | Unificar em um laboratório cumulativo | Mantém todos os comandos e melhora a continuidade |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| Comandos e saídas separados por muitos parágrafos | Difícil saber qual resultado pertence a cada ação | Terminal interativo mantém prompt, comando, saída, significado e árvore lado a lado |
| Não havia um estado de arquivos realmente acompanhável | Copiar/mover/apagar continuava abstrato | Explorador didático sincronizado com cada comando |
| `where java` é ambíguo no PowerShell porque `where` pode resolver para `Where-Object` | O aluno pode executar o comando errado | Ensinar `Get-Command java` como opção nativa e `where.exe java` como localizador do Windows |
| `New-Item README.md` dependia de forma posicional pouco explícita | O aluno não via a diferença entre item e conteúdo | Usar `New-Item -ItemType File -Path ...` e interpretar a saída |
| Remoção ensinada sem uma confirmação concreta | A advertência não virava hábito verificável | Exigir `pwd`, `Get-ChildItem`, `Test-Path`, remoção do arquivo exato e confirmação final |
| Abrir terminal integrado do IntelliJ aparecia apenas no checklist | O aluno não sabia localizar a ação | Mock compacto compara Windows Terminal e aba Terminal do IntelliJ |
| Autocomplete e histórico eram descritos, não demonstrados | Difícil formar memória operacional | Teclas clicáveis alteram o comando na simulação |
| Variáveis de ambiente não explicavam escopo de processo | Terminal antigo parecia comportamento aleatório | Diagrama mostra que a sessão herda variáveis ao ser criada |
| Não havia saída realista para ferramentas encontradas | O aluno não distinguia versão, origem e falha | Painel com exemplos variáveis e significado explícito |
| Desafio final repetia o roteiro | Bastava copiar | Novo cenário `importacao-clientes` exige escolher caminhos e provar o estado |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Identificar as camadas do terminal | Mock em camadas e prompt anotado | terminal, shell, PowerShell, prompt e localização + comando |
| 2 | Executar o ciclo de orientação | Terminal e árvore mostram `pwd` e `ls` | pasta atual, listagem, aliases e confirmação |
| 3 | Navegar por caminhos | Breadcrumb e árvore acompanham `cd` | absoluto, relativo, pai e arquivo × pasta |
| 4 | Criar a estrutura do laboratório | Pastas e arquivo aparecem progressivamente | `mkdir`, `New-Item`, saída e confirmação |
| 5 | Copiar, mover e renomear | Comparador antes/depois | `Copy-Item` × `Move-Item` e nomes de destino |
| 6 | Remover sem adivinhar | Protocolo seguro libera a remoção exata | `Test-Path`, inspeção, `Remove-Item` e confirmação |
| 7 | Trabalhar com eficiência | Teclas alteram comando, histórico e tela | Tab, setas, `Get-History`, `cls` e `Clear-Host` |
| 8 | Diagnosticar ferramentas e ambiente | Painel de versões, origem, PATH e sessão | `Get-Command`, `where.exe`, variáveis e classes de erro |
| 9 | Aplicar ao backend | Clínica de Maven, Java e logs | pasta correta, programa executado, mensagens e ferramentas futuras |
| 10 | Executar a missão final e registrar | Estado conhecido, diário copiável e critérios | transferência, autonomia e ponte para JDK/JRE/JVM |

## Recursos necessários

- [x] Comandos com destaque de sintaxe estilo IDE.
- [x] Terminal com comando, saída, significado e variação.
- [x] Mock do Windows Terminal e do terminal integrado do IntelliJ.
- [x] Explorador/árvore de arquivos sincronizado.
- [x] Diagramas de camadas, caminho e herança de ambiente.
- [x] Comparador visual de estados.
- [x] Documento de diário copiável.
- [x] Cenários de erro e recuperação.
- [x] Desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Todo comando possui contexto, resultado esperado e confirmação.
- [x] Todo erro relevante possui diagnóstico e recuperação.
- [x] O laboratório consolidado preserva todas as operações originais.
- [x] Conteúdo avançado não foi removido apenas para encurtar a aula.
- [x] Repetições removidas não carregavam nuance técnica exclusiva.
- [x] A organização da Aula 003 é usada sem ser reensinada por inteiro.
- [x] A validação de JDK da Aula 005 é preparada sem ser antecipada.

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
