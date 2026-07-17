# Matriz de cobertura — aula 015

## Identificação

- ID: `015_M0_15_MAVEN_INSTALACAO_E_VALIDACAO_INICIAL_OFICIAL`
- Título antigo: Maven: Instalação e Validação Inicial
- Arquivo original: `docs/aulas/015_M0_15_MAVEN_INSTALACAO_E_VALIDACAO_INICIAL_OFICIAL.md`
- Módulo e posição: M0.15
- Aula anterior relevante: `014_M0_14_CODEX_IA_NO_INTELLIJ_COM_ETICA_E_METODO.md`
- Aula seguinte relevante: `016_M0_16_POSTGRESQL_E_DBEAVER_PREPARACAO_OFICIAL.md`
- Arquétipo escolhido: oficina visual de instalação e auditoria do Maven com Windows, PowerShell e IntelliJ sincronizados
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Ao final, o aluno conseguirá instalar a distribuição binária estável do Maven no Windows, verificar sua integridade, configurar o `PATH`, provar qual executável e qual JDK estão ativos no PowerShell e no IntelliJ, distinguir Maven do sistema, Maven incorporado e Maven Wrapper e recuperar as falhas iniciais sem tentar compilar um projeto inexistente.

## Inventário do conteúdo antigo

| Item | Tipo | Único? | Destino novo | Evidência de cobertura |
|---|---|---:|---|---|
| Maven como ferramenta de build | Conceito | Sim | Etapa 1 | Pipeline fonte → compile → test → package |
| Dependência do JDK e de Java executável | Pré-requisito | Sim | Etapa 2 | Auditoria `java`, `javac` e `JAVA_HOME` |
| Download oficial da distribuição binária | Instalação | Sim | Etapa 3 | Simulação identificada da página Apache |
| ZIP binário versus código-fonte | Decisão | Sim | Etapa 3 | Comparador de artefatos |
| Verificação de integridade do download | Segurança | Parcial | Etapa 3 | `Get-FileHash` e comparação SHA-512 |
| Extração para pasta estável | Instalação | Sim | Etapa 4 | Explorador simulado e árvore correta |
| `C:\dev\tools\apache-maven-...` | Organização | Sim | Etapa 4 | Caminho recomendado e alternativas explicadas |
| `PATH` apontando para `bin` | Configuração | Sim | Etapa 5 | Simulação das Variáveis de Ambiente |
| `MAVEN_HOME` | Configuração | Sim | Etapa 5 | Reclassificado como opcional, não requisito oficial |
| `M2_HOME` | Legado | Sim | Etapa 5 | Aviso explícito para não criar sem necessidade |
| Fechar e abrir terminal após mudança | Estado | Sim | Etapa 5 | Diagrama de herança de ambiente por processo |
| `mvn -version`/`mvn -v` | Validação | Sim | Etapa 6 | Terminal com saída completa e leitura linha a linha |
| Localizar executável Maven | Diagnóstico | Sim | Etapa 6 | `where.exe mvn` e `Get-Command mvn -All` |
| Múltiplas instalações no `PATH` | Diagnóstico | Sim | Etapa 6 | Laboratório de precedência |
| Terminal integrado do IntelliJ | IDE | Sim | Etapa 7 | PowerShell externo e integrado comparados |
| Maven incorporado no IntelliJ | IDE | Sim | Etapa 7 | Simulação de Settings → Build Tools → Maven |
| Maven do sistema versus incorporado | Comparação | Sim | Etapa 7 | Três executores com prova própria |
| Maven Wrapper | Portabilidade | Sim | Etapa 8 | `mvnw.cmd` e versão fixada pelo projeto |
| `mvn -version` sem `pom.xml` | Limite | Sim | Etapa 8 | Separação instalação/projeto/build |
| `mvn compile` requer projeto Maven | Limite | Sim | Etapa 8 | Estado sem POM e mensagem interpretada |
| `settings.xml`, repositório e proxy corporativo | Configuração | Sim | Etapa 8 | Camada de rede separada da instalação |
| Erro “mvn não é reconhecido” | Falha | Sim | Etapa 9 | Clínica com inspeção, correção e confirmação |
| `JAVA_HOME` inválido ou apontando para JRE | Falha | Sim | Etapa 9 | Diagnóstico orientado por evidência |
| Java inesperado | Falha | Sim | Etapa 9 | Comparação `java`, `mvn -v` e caminhos |
| Pasta duplicada após extração | Falha | Sim | Etapa 9 | Árvore `apache-maven...\apache-maven...` |
| `MAVEN_HOME` apontando para `bin` | Falha | Sim | Etapa 9 | Correção conceitual, apesar de opcional |
| Terminal antigo com ambiente antigo | Falha | Sim | Etapas 5 e 9 | Linha do tempo dos processos |
| Falta de `pom.xml` | Falha | Sim | Etapas 8 e 9 | Não confundir instalação com build |
| Criar diretório de validação | Prática | Sim | Etapa 10 | Pasta e arquivo de evidências |
| Criar `docs/ambiente.md` | Artefato | Sim | Etapa 10 | Editor e preview sincronizados |
| Diário, atalhos e checklist | Aprendizagem | Sim | Etapa 10 | Registro enxuto e recuperável |
| Git explícito e commit | Entrega | Sim | Etapa 11 | `git add` nomeado, diff staged e status limpo |
| Critérios de conclusão | Avaliação | Sim | Conclusão | Gates de evidência e desafio final |

## Repetições encontradas

| Repetição | Decisão | Motivo pedagógico |
|---|---|---|
| Validar `mvn -version` em vários pontos | Mostrar uma vez como prova central e reutilizar a leitura nas comparações | Evita ritual mecânico e preserva a função diagnóstica |
| Fechar e reabrir terminal | Centralizar no mapa de herança de processos | Explica a causa em vez de repetir a ordem |
| `PATH`, `JAVA_HOME` e `MAVEN_HOME` em listas sucessivas | Separar obrigatórios, opcionais e legados | Corrige a impressão de que todas as variáveis têm o mesmo papel |
| Maven do sistema e Maven do IntelliJ | Consolidar no painel de três executores | Mantém todas as diferenças em um estado observável |
| Erros de caminho | Agrupar em clínica por sintoma → inspeção → correção → prova | Transforma repetição em estratégia de diagnóstico transferível |

## Lacunas e defeitos corrigidos

| Lacuna ou defeito antigo | Consequência | Correção nova |
|---|---|---|
| Cerca de código inicial malformada | Renderização e leitura quebradas | Experiência reconstruída sem reutilizar a marcação defeituosa |
| Versão escrita como `3.9.x` sem fonte temporal | O aluno não sabe o arquivo correto | Versão estável atual contextualizada com aviso de mutabilidade e link oficial |
| `MAVEN_HOME` apresentado como requisito | Acrescenta configuração desnecessária | `PATH` é obrigatório; `MAVEN_HOME` é opcional; `M2_HOME` é legado |
| `where mvn` no PowerShell | Pode invocar o alias `Where-Object` | Usar `where.exe mvn` e `Get-Command mvn -All` |
| Download sem prova de integridade | Arquivo corrompido ou trocado pode passar despercebido | Comparação SHA-512 com o valor publicado pela Apache |
| Instruções predominantemente textuais | Aluno não reconhece telas, árvore ou saída correta | Mocks identificados de site, Explorer, Variáveis de Ambiente, terminal e IntelliJ |
| Saída do Maven pouco interpretada | “Funcionou” não revela qual Java e qual instalação | Leitura linha por linha de versão, home, Java, locale e sistema |
| Maven incorporado, sistema e Wrapper aparecem dispersos | Aluno não sabe qual está executando | Painel comparativo com comando e fonte de versão de cada um |
| Proxy corporativo misturado com instalação | Falha de rede parece falha do executável | Camadas ferramenta, projeto e rede separadas |
| `mvn compile` sugerido cedo demais | Sem `pom.xml`, o aluno recebe erro e acha que instalou errado | `mvn -v` valida a ferramenta; build fica para um projeto Maven |
| Git com adição ampla | Pode versionar arquivos fora da intenção | Preparação nominal e revisão `--staged` |
| Pouca recuperação para permissão, ZIP bloqueado e caminho duplicado | Aluno fica preso após seguir os cliques | Clínica inclui causa provável, inspeção e prova de recuperação |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível |
|---:|---|---|
| 1 | Mapear o papel do Maven | Pipeline de build e fronteira com JDK/IDE |
| 2 | Auditar o JDK atual | Três comandos, saídas e diagnóstico |
| 3 | Escolher e verificar o ZIP oficial | Artefato binário e hash SHA-512 correspondente |
| 4 | Extrair e inspecionar a árvore | `bin\mvn.cmd`, `conf`, `lib` e ausência de pasta duplicada |
| 5 | Configurar o ambiente do Windows | `PATH` correto e novo processo herdando a mudança |
| 6 | Provar versão, Java e executável | Saída completa de `mvn -v` e precedência no PATH |
| 7 | Sincronizar IntelliJ e PowerShell | Terminal integrado e Settings apontando para escolhas conscientes |
| 8 | Distinguir sistema, incorporado, Wrapper e projeto | Cada executor e cada camada têm fonte de verdade própria |
| 9 | Recuperar falhas reais | Sintoma, comando de inspeção, correção e confirmação |
| 10 | Registrar o ambiente | `docs/ambiente.md`, diário e atalhos enxutos |
| 11 | Entregar e defender a instalação | Evidências, diff staged, commit e repositório limpo |

## Recursos necessários

- [x] Código e comandos com destaque de sintaxe.
- [x] Terminal com comando, saída, interpretação e recuperação.
- [x] Simulação identificada de página oficial.
- [x] Simulação do Explorador de Arquivos.
- [x] Simulação das Variáveis de Ambiente do Windows.
- [x] Simulação do IntelliJ.
- [x] Diagramas de pipeline e herança de processos.
- [x] Comparador sistema/incorporado/Wrapper.
- [x] Cenários de erro e recuperação.
- [x] Artefato documental e desafio final.

## Verificação de preservação

- [x] Todo conceito único possui destino explícito.
- [x] Todo comando possui contexto, resultado esperado e interpretação.
- [x] Todo erro relevante possui inspeção, correção e confirmação.
- [x] As repetições foram consolidadas sem retirar nuances.
- [x] Conteúdo avançado foi preservado e reposicionado na camada correta.
- [x] A transição da Aula 014 e a fronteira com PostgreSQL/DBeaver da Aula 016 foram respeitadas.

## Validação final

- [x] Build aprovado.
- [x] Lint sem novos erros.
- [x] `git diff --check` aprovado para os arquivos desta reconstrução.
- [ ] Desktop verificado.
- [ ] Celular verificado.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] Aula geral depende de todas as etapas.
- [ ] Próxima aula depende da conclusão geral.
- [ ] Existe somente um controle de conclusão geral.
- [x] Código copiável e com destaque.
- [x] Textos, comandos e saídas revisados.
- [x] Responsável pelo curso aprovou.

### Observação da validação

A rota da Aula 015 respondeu com HTTP 200, o lint foi aprovado e dois builds de produção consecutivos foram concluídos. A versão, os requisitos, o procedimento de instalação, os artefatos de checksum, a classificação das versões preview e o comportamento do Wrapper foram confrontados com a documentação oficial da Apache publicada em 14/07/2026. O `git diff --check` dos arquivos desta reconstrução foi aprovado; a verificação global ainda relata espaços em logs antigos de `scratch/`, fora do escopo desta aula. Não havia navegador conectado à sessão, portanto desktop, celular, interações e controles permanecem explicitamente pendentes em vez de serem aprovados apenas por inspeção estática.
