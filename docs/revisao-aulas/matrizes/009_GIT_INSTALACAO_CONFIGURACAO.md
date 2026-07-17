# Matriz de cobertura — Aula 009

## Identificação

- ID: `009_M0_09_GIT_INSTALACAO_E_CONFIGURACAO_GLOBAL`
- Título antigo: Git: Instalação e Configuração Global
- Arquivo original: `docs/aulas/009_M0_09_GIT_INSTALACAO_E_CONFIGURACAO_GLOBAL.md`
- Módulo e posição: M0.09
- Aula anterior relevante: `008_M0_08_DEBUG_INICIAL_NO_INTELLIJ.md`
- Aula seguinte relevante: `010_M0_10_GIT_LOCAL_DO_ZERO.md`
- Arquétipo escolhido: oficina visual de instalação e auditoria de configuração Git
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Instalar o Git for Windows com escolhas conscientes e produzir, no PowerShell, uma auditoria que comprove executável, origem, identidade, branch padrão, editor e política de quebra de linha — sem depender de GitHub nem antecipar a criação de repositório da Aula 010.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Git é ferramenta; GitHub é hospedagem remota | Conceito | Sim | Etapa 1 | Mapa comparativo interativo |
| Git funciona localmente e sem internet | Conceito | Sim | Etapas 1 e 10 | Fluxo local e prova final |
| Problema das cópias `projeto-final-*` | Exemplo | Sim | Etapa 1 | Comparador pasta copiada × histórico |
| Commits como pontos do histórico | Conceito | Sim | Etapa 1 | Linha evolutiva ilustrada |
| Rastreabilidade: o quê, quando, quem e por quê | Conceito | Sim | Etapas 1 e 6 | Mapa de evidências e identidade do autor |
| Segurança para experimentar e recuperar | Conceito | Sim | Etapa 1 | Transformação antes/depois |
| Download oficial do Git for Windows | Interface | Sim | Etapa 2 | Mock identificado do site e checklist de origem |
| Instalação no Windows | Procedimento | Sim | Etapa 3 | Instalador didático navegável tela a tela |
| Git Bash existe, mas PowerShell será usado | Limite | Sim | Etapas 3 e 4 | Escolha de PATH/shell e terminal PowerShell |
| Abrir terminal novo após alterar PATH | Diagnóstico | Sim | Etapa 4 | Estado terminal antigo × novo |
| `git --version` | Comando | Sim | Etapas 4 e 9 | Saída variável explicada |
| Localização do executável | Comando | Sim | Etapa 4 | `Get-Command git` e `where.exe git` com saída |
| Armadilha de `where` no PowerShell | Lacuna corrigida | — | Etapa 4 | Alias `Where-Object` comparado a `where.exe` |
| Níveis system, global e local | Conceito | Sim | Etapa 5 | Diagrama selecionável de precedência |
| Arquivo global no perfil do usuário | Conceito | Sim | Etapa 5 | Origem mostrada sem edição manual |
| `git config --global --list` | Comando | Sim | Etapas 5 e 9 | Listagem e interpretação |
| Mostrar origem efetiva das configurações | Lacuna corrigida | — | Etapas 5 e 9 | `--show-origin` e `--show-scope` |
| `user.name` | Configuração | Sim | Etapa 6 | Comando, consulta e autor resultante |
| `user.email` | Configuração | Sim | Etapa 6 | Comando, consulta, privacidade e associação remota futura |
| Identidade de commit não é login | Conceito | Sim | Etapa 6 | Comparador identidade × autenticação |
| Dados genéricos no material compartilhável | Segurança | Sim | Etapa 6 | Aviso e placeholders explícitos |
| `init.defaultBranch main` | Configuração | Sim | Etapa 7 | Comando, consulta e diagnóstico de chave digitada errada |
| Motivo de padronizar a branch | Contexto profissional | Sim | Etapa 7 | Consequência em novos repositórios |
| LF e CRLF | Conceito | Sim | Etapa 8 | Simulador working tree/index |
| `core.autocrlf true` no Windows | Configuração | Sim | Etapa 8 | Fluxo visual CRLF → LF → CRLF |
| Times podem preferir `.gitattributes` | Limite | Sim | Etapa 8 | Comparação máquina × regra versionada |
| `core.editor` e situações em que abre | Configuração | Sim | Etapa 7 | Escolha guiada e teste seguro do editor |
| Credenciais, HTTPS, SSH, token e navegador | Limite futuro | Sim | Etapas 3 e 6 | Separação instalação/identidade/autenticação |
| Git Credential Manager | Conceito futuro | Sim | Etapa 3 | Escolha recomendada do instalador sem configurar remoto |
| Configurar todas as chaves principais | Atividade | Sim | Etapa 9 | Terminal simulado com comandos unitários |
| Consultar cada chave individualmente | Comando | Sim | Etapa 9 | Auditoria final por chave |
| Sobrescrever valor incorreto | Recuperação | Sim | Etapa 9 | Caso interativo de correção |
| `--unset` | Recuperação | Sim | Etapa 9 | Caso seguro com confirmação posterior |
| Global vale ao usuário; local ao repositório | Conceito | Sim | Etapa 5 | Precedência e erro fora de repositório |
| Identidades diferentes por projeto | Contexto profissional | Sim | Etapa 5 | Exemplo corporativo de override local |
| Qualidade de histórico e commits claros | Conexão futura | Sim | Etapa 10 | Ponte explícita para Aula 010 |
| Git e diário de bordo | Conexão da formação | Sim | Etapa 10 | Evidência final documentável |
| Dez erros comuns | Diagnóstico | Sim | Etapa 10 | Clínica interativa com sintoma, causa, correção e prova |
| Registro de evidências da atividade | Atividade | Sim | Etapa 10 | Relatório final copiável |
| Commit local de validação citado no checklist inicial | Contradição do original | Sim | Etapa 10 | `git var GIT_AUTHOR_IDENT` valida a autoria sem criar repositório; commit permanece na Aula 010 |
| Critérios de conclusão extensos | Avaliação | Sim | Etapas 10 e conclusão | Checklist objetivo e desafio de auditoria |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Git não é GitHub e funciona localmente | Abertura, erros 2 e 8, fechamento | Consolidar nas etapas 1 e 10 | Uma demonstração e uma verificação final substituem quatro afirmações iguais |
| Lista das cinco configurações | Seções individuais, resumo, exemplo mínimo e atividade | Ensinar nas etapas 6–9 e reunir apenas na auditoria | Evita mandar copiar o mesmo bloco sem interpretar cada chave |
| Valide com `--list` | Configuração global, exemplo mínimo, erros e atividade | Consolidar em auditoria com origem e escopo | A versão nova mostra não apenas o valor, mas de onde ele veio |
| Importância de identidade | `user.name`, `user.email`, exemplo corporativo e erros | Consolidar na etapa 6 | Mantém autoria, rastreabilidade, privacidade e associação remota em um único modelo |
| Importância de LF/CRLF | Conceito, exemplo de time e erro 6 | Consolidar na etapa 8 | Um simulador cobre causa, efeito, opção escolhida e limite de `.gitattributes` |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| Não mostra o site oficial nem as telas do instalador | O iniciante não sabe onde clicar ou quais opções escolher | Mock fiel e identificado do download e assistente tela a tela |
| Usa `where git` no PowerShell | `where` é alias de `Where-Object`; o aluno pode não obter o caminho esperado | Ensinar `Get-Command git` e `where.exe git` explicitamente |
| Comandos quase sem saídas concretas | O aluno não sabe reconhecer silêncio, valor ausente ou sucesso | Mostrar prompt, saída, variações e significado de cada comando |
| Não mostra origem e precedência de configuração | Valor local pode sobrescrever global sem o aluno perceber | Usar `--show-origin`, `--show-scope` e diagrama system/global/local |
| Recomenda `core.autocrlf true` como regra quase absoluta | Projetos com `.gitattributes` ou política diferente parecem “errados” | Manter baseline Windows e explicar que regra versionada do time prevalece |
| Confunde checklist de commit com “não criar repositório” | O aluno não sabe se deve antecipar a Aula 010 | Validar identidade com `git var GIT_AUTHOR_IDENT`; primeiro commit fica na Aula 010 |
| Não ensina erro de digitação em nome de chave | Uma chave parecida pode ser gravada e ignorada silenciosamente | Caso `init.defaltbranch` × `init.defaultBranch` e busca com regexp |
| Editor é configurado, mas não testado | A falha só aparece durante commit/merge | Mostrar `git var GIT_EDITOR` e teste `git config --global --edit` como ação opcional controlada |
| Não diferencia identidade de autenticação | Aluno pode usar credencial como e-mail de autoria ou esperar login | Comparador explícito autor × acesso remoto |
| Checklist textual sem entrega verificável | A pessoa marca sem produzir evidência | Gerar relatório de auditoria e desafio de diagnóstico |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Explorar o mapa Git local × remoto | Fluxo e histórico substituem cópias manuais | Git, GitHub, commit, rastreabilidade e segurança |
| 2 | Localizar o instalador correto | Site oficial simulado e checklist x64/ARM64 | Origem, arquitetura e versão variável |
| 3 | Navegar por todas as decisões relevantes do instalador | Opção recomendada e efeito de cada tela | PATH, editor, branch, SSH, HTTPS, CRLF, terminal e credenciais |
| 4 | Abrir PowerShell novo e localizar o executável | Versão e caminho reais no formato esperado | PATH, terminal novo, `Get-Command` e `where.exe` |
| 5 | Selecionar níveis de configuração | Diagrama mostra arquivo, alcance e precedência | system, global, local, origem e override |
| 6 | Configurar identidade com valores seguros | Autor de commit projetado e autenticação separada | `user.name`, `user.email`, privacidade e autoria |
| 7 | Definir branch e editor | Consultas devolvem `main` e editor escolhido | `init.defaultBranch`, `core.editor` e correção |
| 8 | Alterar a política de fim de linha no simulador | Working tree e index exibem CRLF/LF | `core.autocrlf`, `.gitattributes` e colaboração |
| 9 | Executar a auditoria guiada | Terminal acumula comando, saída e interpretação | Configuração, listagem, origem, correção e remoção |
| 10 | Diagnosticar falhas e produzir relatório | Clínica de erros, identidade validada e desafio | recuperação, prova final, diário e ponte para Aula 010 |

## Recursos necessários

- [x] Código com destaque de sintaxe.
- [x] Terminal com comando e saída.
- [x] Simulação de interface.
- [x] Diagrama.
- [x] Tabela comparativa.
- [x] Arquivo de exemplo.
- [x] Cenário de erro e recuperação.
- [x] Desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Todo comando possui contexto e resultado esperado.
- [x] Todo erro relevante possui diagnóstico e recuperação.
- [x] Exemplos consolidados continuam cobrindo todas as variações necessárias.
- [x] Conteúdo avançado não foi removido apenas para encurtar a aula.
- [x] Repetições removidas não carregavam uma nuance técnica exclusiva.
- [x] A relação com aulas anteriores e seguintes permanece coerente.

## Validação final

- [x] Build aprovado.
- [x] Lint sem novos erros.
- [x] `git diff --check` aprovado nos arquivos da reconstrução.
- [ ] Desktop verificado.
- [ ] Celular verificado.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] A aula e a próxima aula ficam bloqueadas enquanto houver etapas pendentes.
- [ ] Existe somente um controle de conclusão geral da aula.
- [x] Código copiável e com destaque de sintaxe.
- [x] Textos, comandos e saídas revisados.
- [x] Responsável pelo curso aprovou.
