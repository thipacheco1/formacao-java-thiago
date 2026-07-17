# Matriz de cobertura — aula 003

## Identificação

- ID: `003_M0_03_ORGANIZACAO_DO_WINDOWS_PARA_DESENVOLVIMENTO`
- Título antigo: Organização do Windows para Desenvolvimento Java Backend
- Arquivo original: `docs/aulas/003_M0_03_ORGANIZACAO_DO_WINDOWS_PARA_DESENVOLVIMENTO.md`
- Módulo e posição: M0.03
- Aula anterior relevante: aula 002 reconstruída — diagnóstico e plano
- Aula seguinte relevante: `004_M0_04_TERMINAL_POWERSHELL_E_COMANDOS_BASICOS.md`
- Arquétipo escolhido: oficina visual de sistema de arquivos com PowerShell guiado
- Data da auditoria: 2026-07-16

## Resultado prometido ao aluno

Ao final, o aluno conseguirá criar e verificar uma raiz de desenvolvimento com papéis claros, montar `formacao-java-backend` com documentação, código, laboratórios, `README.md` e `.gitignore`, diagnosticar caminho e permissão e explicar como essa organização reduz erros em Java, Git, Maven, Docker e banco.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Checklist de pré-instalação | Verificação | Sim | Etapas 1 e 9 | Checklist final com raiz, subpastas e regras |
| Registro `docs/ambiente.md` | Atividade | Sim | Etapa 9 | Documento copiável gerado |
| Ambiente organizado reduz erros de código, caminho, permissão, variável, ferramenta, IDE, terminal e Git | Relação | Sim | Etapa 1 | Painel “erro de código ou de ambiente?” |
| Ferramenta, projeto, download, fonte, gerado, anotação, instalação e repositório são coisas diferentes | Princípio | Sim | Etapas 1 e 2 | Classificador interativo de destino |
| Estrutura `C:\dev` com projects, studies, tools, labs e temp | Estrutura | Sim | Etapa 2 | Explorador de Arquivos didático e árvore final |
| Papel de cada pasta | Conceitos | Sim | Etapa 2 | Seleção de pasta mostra uso, exemplo e limite |
| Evitar Área de Trabalho e Downloads | Segurança/organização | Sim | Etapa 3 | Clínica de caminhos com diagnóstico e correção |
| Cuidado com OneDrive, Google Drive e sincronização | Risco | Sim | Etapa 3 | Caso visual com sintomas e alternativa local |
| Espaços, acentos, caracteres especiais e nomes minúsculos com hífen | Convenção | Sim | Etapa 3 | Comparador de caminhos bons e frágeis |
| Windows pode ignorar caixa; Git, Linux, Docker e servidores podem diferenciar | Nuance | Sim | Etapa 3 | Caso `ProjetoJava` × `projetojava` |
| Classes Java usam `NomeDaClasse.java` | Convenção | Sim | Etapa 3 | Quadro separa nome de projeto e nome de classe |
| Separar sistema, ferramenta e projeto | Estrutura | Sim | Etapa 2 | Diagrama com Program Files, tools e projects |
| JDK fora do projeto | Regra | Sim | Etapas 2 e 8 | Comparação de árvore errada e correta |
| Permissões de Program Files e Windows | Erro/segurança | Sim | Etapa 3 | Sintoma “Access denied” e alternativa segura |
| UTF-8, mojibake e uso de acentos no conteúdo | Conceito | Sim | Etapa 7 | Simulação `ação` × `aÃ§Ã£o` e regra de uso |
| Labs preservados dentro e descartáveis fora do repositório | Decisão | Sim | Etapa 2 | Alternador mostra ciclo de vida de cada laboratório |
| `pwd`, `mkdir`, `cd`, `ls` e `New-Item` | Comandos | Sim | Etapas 4 e 5 | Terminal guiado com comando, saída e árvore atualizada |
| Criar raiz e cinco pastas | Prática | Sim | Etapa 4 | Simulação termina em `C:\dev` verificado |
| Criar projeto, docs, src, labs, README e .gitignore | Prática | Sim | Etapa 5 | Simulação termina na estrutura mínima |
| Papel de docs, src, labs, README e .gitignore | Conceitos | Sim | Etapa 6 | Explorador e arquivos com conteúdo copiável |
| Conteúdo inicial do README | Arquivo | Sim | Etapa 6 | Bloco Markdown com destaque e cópia |
| Padrões do `.gitignore` e significado | Arquivo/regra | Sim | Etapa 6 | Bloco gitignore e explicação linha a linha |
| Exemplo corporativo de projetos padronizados | Contexto | Sim | Etapa 8 | Comparação suporte em ambiente caótico e previsível |
| Conexão com Java e separação de tipos de erro | Relação | Sim | Etapa 8 | Mapa de dependências e diagnóstico |
| Estrutura Maven `src/main/java`, `src/test/java` e `target` | Relação futura | Sim | Etapa 8 | Visual de evolução da árvore |
| Git observa tudo no repositório e sofre com lixo | Relação futura | Sim | Etapas 6 e 8 | Antes/depois do `.gitignore` |
| Docker volumes e banco dependem de caminhos | Relação futura | Sim | Etapa 8 | Exemplo YAML com destaque de sintaxe |
| Sete erros comuns originais | Erros | Sim | Etapa 9 | Diagnóstico com causa, inspeção, correção e confirmação |
| Registro final com estrutura, regras e dúvidas | Atividade | Sim | Etapa 9 | `docs/ambiente.md` completo |
| Critérios de conclusão | Verificação | Sim | Etapa 9 | Desafio e checklist observáveis |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Motivo para não usar Desktop/Downloads | Abertura, seção própria e erros | Consolidar na clínica de caminhos | O aluno compara sintoma e alternativa uma vez |
| Estrutura `C:\dev` | Recomendação, exemplo mínimo, atividade e registro | Construir progressivamente e gerar no documento | Evita repetir a mesma árvore sem mudança de estado |
| Papel de docs, src e labs | Estrutura mínima e seções individuais | Mostrar no Explorador selecionável | Mantém detalhes e reduz leitura linear |
| Organização ajuda ferramentas futuras | Java, Maven, Git, Docker/banco e fechamento | Consolidar no mapa de impacto | Relações continuam completas e visíveis |
| Lista de regras | Abertura, erros, registro e critério | Transformar em checklist verificável | Regra passa a ter evidência |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| Comandos apareciam em lote sem saída | O aluno não sabia se cada pasta ou arquivo foi criado | Terminal passo a passo mostra comando, saída, variação e confirmação |
| Não ensinava claramente como abrir PowerShell | A prática começava presumindo conhecimento | Mostrar Windows 11 e alternativa por pesquisa/menu de contexto |
| `mkdir` em pasta existente era tratado genericamente | Mensagens diferentes podiam confundir | Inspecionar com `Test-Path` e usar criação segura com `-Force` quando apropriado |
| `C:\dev` podia falhar por política/permissão | O aluno podia travar sem alternativa | Ensinar `C:\Users\usuario\dev` como plano B local |
| Árvore era apenas texto | Difícil relacionar comando ao estado do disco | Explorador didático atualiza a cada ação |
| `.gitignore` era fornecido sem efeito visual | Parecia lista arbitrária | Mostrar fonte preservada e artefatos gerados excluídos |
| Encoding era abstrato | O aluno via texto corrompido sem reconhecer a causa | Comparação visual de UTF-8 e decodificação incorreta |
| Atividade misturava organização com domínio de terminal da Aula 4 | Poderia antecipar carga cognitiva | Usar comandos guiados aqui e deixar navegação/comandos gerais para a Aula 4 |
| Não havia desafio de transferência | Bastava copiar o roteiro | Pedir organização de um segundo projeto e justificativa de cada destino |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Distinguir erro de ambiente e erro de código | Classificador com causa provável | propósito da organização |
| 2 | Explorar a raiz e classificar itens | Árvore selecionável e papéis | projects, studies, tools, labs, temp e separação |
| 3 | Avaliar caminhos frágeis | Clínica de caminhos com correção | Downloads, sync, espaços, acentos, caixa e permissão |
| 4 | Criar a raiz guiada | Terminal e Explorador mudam juntos | abrir PowerShell, pwd, Test-Path, mkdir/cd/ls |
| 5 | Criar o projeto guiado | Estrutura mínima confirmada | docs, src, labs, README e .gitignore |
| 6 | Preencher arquivos-base | Conteúdo destacado e árvore explicada | README, gitignore e papéis internos |
| 7 | Reconhecer encoding | Comparação visual e regra UTF-8 | conteúdo com acentos e nomes portáveis |
| 8 | Conectar a estrutura ao backend | Mapa Java/Maven/Git/Docker/banco | ambiente corporativo e evolução futura |
| 9 | Diagnosticar, registrar e transferir | `docs/ambiente.md`, erros e desafio | recuperação e conclusão verificável |

## Recursos necessários

- [x] Código, Markdown, gitignore e YAML com destaque de sintaxe.
- [x] Terminal com comando e saída.
- [x] Simulação de Explorador de Arquivos e PowerShell.
- [x] Diagrama de estrutura e impacto.
- [x] Comparações de caminhos.
- [x] Arquivos de exemplo copiáveis.
- [x] Cenários de erro e recuperação.
- [x] Desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Todo comando possui contexto, saída esperada e confirmação.
- [x] Todo erro relevante possui diagnóstico e recuperação.
- [x] Exemplos consolidados continuam cobrindo todas as variações necessárias.
- [x] Conexões futuras com Java, Maven, Git, Docker e banco foram preservadas.
- [x] Repetições removidas não carregavam nuance técnica exclusiva.
- [x] A transição do diagnóstico para a Aula 4 de terminal permanece coerente.

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
- [x] Conteúdo copiável e com destaque de sintaxe.
- [x] Textos, comandos e saídas revisados.
- [x] Responsável pelo curso aprovou.
