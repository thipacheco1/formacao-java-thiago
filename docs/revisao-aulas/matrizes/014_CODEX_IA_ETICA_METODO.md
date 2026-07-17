# Matriz de cobertura — aula 014

## Identificação

- ID: `014_M0_14_CODEX_IA_NO_INTELLIJ_COM_ETICA_E_METODO`
- Título antigo: Codex, IA no IntelliJ, Ética e Método de Uso
- Arquivo original: `docs/aulas/014_M0_14_CODEX_IA_NO_INTELLIJ_COM_ETICA_E_METODO.md`
- Módulo e posição: M0.14
- Aula anterior relevante: `013_M0_13_DIARIO_DE_BORDO_E_RASTREABILIDADE_DO_APRENDIZADO.md`
- Aula seguinte relevante: `015_M0_15_MAVEN_INSTALACAO_E_VALIDACAO_INICIAL_OFICIAL.md`
- Arquétipo escolhido: laboratório de IA supervisionada com terminal, diff e gates de segurança
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Ao final, o aluno conseguirá abrir o Codex CLI no terminal integrado do IntelliJ, delimitar uma tarefa pequena, exigir plano antes da escrita, proteger o contexto, revisar permissões, validar uma alteração Java por execução e `git diff` e produzir `docs/uso-de-ia.md` sem terceirizar a decisão técnica.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| IA como apoio, não substituição do pensamento | Princípio | Sim | Etapas 1 e 11 | Ciclo de responsabilidade e defesa oral da mudança |
| Codex como agente de programação | Conceito | Sim | Etapa 1 | Mapa de superfícies e capacidades/limites |
| IDE, CLI, aplicativo, remoto e chat externo | Comparação | Sim | Etapa 2 | Seletor de superfície com consequência operacional |
| Uso atual no IntelliJ | Ferramenta | Sim | Etapas 2 e 3 | Terminal integrado identificado como caminho verificável |
| Instalação e recursos mudam; consultar fonte oficial | Regra | Sim | Etapas 2, 3 e 10 | Selo de temporalidade e decisão documentação versus execução |
| Java, Git, debug, testes e regra de negócio não são substituídos | Limite | Sim | Etapas 1, 7 e 11 | Pipeline de evidências e explicação humana |
| Usos bons e ruins durante a formação | Julgamento | Sim | Etapa 4 | Clínica de pedidos com feedback imediato |
| Regra de ouro: entender, revisar e validar | Método | Sim | Etapas 1, 7 e 11 | Gate de aceitação observável |
| Ciclo tentar, formular hipótese, perguntar, comparar, implementar, executar, depurar, testar, revisar, registrar e commitar | Processo | Sim | Etapa 1 | Diagrama interativo do ciclo supervisionado |
| Pergunta vaga versus prompt com nível, escopo, objetivo e restrição | Prompt | Sim | Etapa 4 | Construtor de prompt com auditor de campos |
| Prompts para explicação, revisão, perguntas, exemplo mínimo, trade-offs, testes e diagnóstico | Exemplos | Sim | Etapas 4 e 5 | Biblioteca contextual por intenção |
| Prompts perigosos que removem explicação, testes ou segurança | Risco | Sim | Etapa 4 | Classificador com reescrita segura |
| Contexto mínimo: objetivo, nível, código, erro, comando, esperado, obtido, restrições e tentativas | Diagnóstico | Sim | Etapa 5 | Montador de incidente técnico |
| Segredos, tokens, chaves, certificados, dados pessoais, logs e URLs internas | Segurança | Sim | Etapa 6 | Scanner didático de contexto e bloqueio de envio |
| Política da empresa, contrato, confidencialidade, LGPD e regras do cliente | Governança | Sim | Etapa 6 | Gate “tenho autorização?” antes da utilidade |
| Anonimização e placeholders | Técnica | Sim | Etapa 6 | Transformação lado a lado sem prometer anonimização perfeita |
| Código corporativo como ativo e exemplo mínimo reproduzível | Segurança | Sim | Etapa 6 | Redutor de contexto sensível |
| Direitos autorais, licença, autoria e dependências | Ética | Sim | Etapa 6 | Cenários de decisão e recusa |
| IA para hipóteses de teste, seguida de revisão e execução | Testes | Sim | Etapa 7 | Casos de borda e resultado observado |
| IA para roteiro de debug, sem substituir o debugger | Debug | Sim | Etapa 7 | Separação entre orientação e evidência |
| `git status` e `git diff` antes/depois | Git | Sim | Etapas 3, 7 e 11 | Linha do tempo do workspace e diff inspecionável |
| Revisar arquivos, dependências, comportamento, formatação e escopo | Code review | Sim | Etapa 7 | Checklist aplicado a um diff com defeito intencional |
| Commit comunica a mudança, não “código da IA” | Git | Sim | Etapa 11 | Mensagem técnica e estado limpo |
| Restringir recursos ao nível atual de Java | Didática | Sim | Etapas 4 e 8 | Prompt impede Spring, Streams, Lombok e recursos prematuros |
| Arquitetura exige contexto e trade-offs humanos | Arquitetura | Sim | Etapa 8 | Comparador de risco e decisão não delegável |
| Alucinação: métodos, bibliotecas, versões, comandos e testes falsos | Risco | Sim | Etapa 8 | Laboratório de alegações com fonte de confirmação |
| Documentação oficial para comportamento mutável | Validação | Sim | Etapas 2, 8 e 10 | Roteador “execução, teste ou documentação” |
| `AGENTS.md` para regras duráveis do repositório | Configuração | Sim | Etapa 9 | Editor com escopo, comandos e limites válidos |
| Modelo, aprovação, sandbox, leitura, escrita e execução | Permissões | Sim | Etapa 3 | Simulador de níveis read-only/workspace e pedido de aprovação |
| Começar restritivo e elevar conforme risco/necessidade | Segurança | Sim | Etapa 3 | Matriz capacidade versus risco |
| Automação aceitável para mudança pequena e controlada | Julgamento | Sim | Etapa 8 | Cenários de formatação, teste, auth, migração e infraestrutura |
| Exemplos `javac`/`java`, Calculadora e regra de reagendamento | Exemplos | Sim | Etapas 5 e 7 | Um laboratório progressivo preserva as três finalidades |
| Checklist de revisão da resposta de IA | Avaliação | Sim | Etapa 7 | Gate de aceitação aplicado ao diff |
| Revisão ativa e perguntas pós-aula | Aprendizagem | Sim | Etapa 10 | Tutor socrático sem resposta antecipada |
| Prompt com plano obrigatório | Controle | Sim | Etapa 5 | Chat simulado para plano, aprovação e alteração pequena |
| Prompt de revisão de diff | Code review | Sim | Etapa 7 | Revisão antes de qualquer correção |
| `docs/uso-de-ia.md` | Artefato | Sim | Etapas 9 e 11 | Fonte/preview com regras, prompts e checklist |
| Dez erros comuns | Diagnóstico | Sim | Etapa 10 | Clínica de falhas com correção e prova |
| Atividade com diário, atalhos, Git staged e commit | Entrega | Sim | Etapa 11 | Terminal com arquivos explícitos e estado final limpo |
| Critérios de conclusão completos | Avaliação | Sim | Conclusão | Checklist verificável e desafio de transferência |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| IA não substitui pensamento, teste, debug e responsabilidade | Abertura, regra de ouro, seções temáticas, erros e fechamento | Consolidar no ciclo da etapa 1 e no gate da etapa 7 | O aluno demonstra a responsabilidade em vez de reler slogans |
| Não enviar segredos ou código corporativo | Segurança, anonimização, contexto corporativo, checklist e erros | Centralizar no laboratório da etapa 6 | Preserva todas as categorias e acrescenta decisão prática |
| `git status`/`git diff` antes e depois | Git, fluxo da IDE, atividade e erros | Transformar em estados consecutivos nas etapas 3 e 7 | A repetição passa a mostrar mudança de estado real |
| Prompt deve ter contexto e restrições | Pergunta boa, contexto mínimo e três modelos posteriores | Consolidar em construtor reutilizável | Campos deixam de ser listas e viram uma habilidade praticada |
| Código gerado precisa rodar/testar | Testes, alucinação, checklist, erros e fechamento | Gate único de aceitação | Nenhuma resposta é aceita só pela aparência |

## Lacunas e defeitos da aula antiga que serão corrigidos

| Lacuna ou defeito | Consequência para o aluno | Correção planejada |
|---|---|---|
| Bloco inicial termina com uma cerca de código sem abertura | Markdown original começa quebrado | Reconstrução integral sem reutilizar a marcação defeituosa |
| Não existe instalação prática nem validação do Codex no IntelliJ | A aula promete uma ferramenta, mas entrega só princípios | Laboratório do terminal integrado com pré-requisitos, comandos, saídas e recuperação |
| Sugere extensão JetBrains “quando disponível” sem confirmar suporte atual | Pode levar o aluno a procurar ou instalar plugin não oficial | Explicitar que a documentação atual cobre VS Code/compatíveis; no IntelliJ usar CLI integrada |
| Confunde Codex em geral, integração de IDE e qualquer IA externa | Permissões e superfícies parecem equivalentes | Mapa de superfícies e limites separados |
| Não mostra uma conversa completa do plano à alteração | O método permanece uma lista abstrata | Chat simulado com hipótese, prompt, plano, aprovação, diff e validação |
| Não mostra saída de instalação, login, status ou erros de CLI | Aluno não sabe reconhecer sucesso | Terminal com saídas plausíveis, variáveis identificadas e diagnóstico |
| Usa `where` no PowerShell | Em Windows PowerShell pode resolver para `Where-Object` | Usar `where.exe codex` quando a localização do executável for necessária |
| Usa linguagem `bash` em comandos executados no Windows | Destaque e sintaxe ficam incoerentes | Marcar os blocos como PowerShell |
| Recomenda `git add .` no exercício inicial | Pode incluir alteração fora do escopo | Preparar apenas arquivos nomeados e revisar `--staged` |
| Fala em anonimização sem uma barreira clara de autorização | Aluno pode achar que trocar nomes sempre torna o envio seguro | Autorização vem antes; anonimização é redução, não permissão |
| Não distingue sandbox técnico de política de aprovação | Aluno pode achar que “pedir confirmação” limita acesso por si só | Simulador com os dois controles separados |
| Fechamento anuncia pacotes/organização, mas a Aula 015 real é Maven | Quebra a progressão curricular | Transição correta para instalação e validação do Maven |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Percorrer o ciclo de IA supervisionada | Cada ação humana produz uma evidência antes da próxima | autonomia, responsabilidade e método |
| 2 | Escolher a superfície correta | IntelliJ usa o terminal integrado; demais superfícies têm limites declarados | Codex, CLI, IDE, app e cloud |
| 3 | Validar CLI, autenticação e permissões em um repositório limpo | Terminal, pasta, modo e capacidade ficam sincronizados | instalação, login, sandbox e aprovação |
| 4 | Transformar pedidos fracos em prompts controlados | Auditor mostra objetivo, contexto, nível, escopo, restrições e validação | prompting para aprendizagem |
| 5 | Conduzir um pedido do diagnóstico ao plano aprovado | Chat simulado para antes/depois da autorização | hipótese, plano, arquivos e consentimento |
| 6 | Reduzir ou bloquear contexto sensível | Scanner revela segredo, dado pessoal, código corporativo e licença | segurança, governança e ética |
| 7 | Revisar uma alteração Java imperfeita | Diff, compilação, execução e testes revelam falhas que a prosa esconde | Git, teste, debug e alucinação |
| 8 | Decidir quanto delegar em cenários de risco | Matriz separa explicar, propor, editar e executar | nível atual, arquitetura e automação |
| 9 | Criar `AGENTS.md` e `docs/uso-de-ia.md` | Fonte e preview exibem regras duráveis e política pessoal | instruções de projeto e documentação |
| 10 | Diagnosticar dez antipadrões e escolher a fonte de verdade | Cada falha recebe sintoma, correção e confirmação | erros comuns, documentação e revisão ativa |
| 11 | Entregar o protocolo completo e defendê-lo | Diff preparado, validação executada, commit claro e repositório limpo | transferência, diário e conclusão |

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

### Observação da validação

A rota da aula respondeu com HTTP 200, o componente foi integrado ao pacote de produção e a documentação mutável sobre Codex foi confrontada com o manual oficial atualizado em 2026-07-17. A tentativa de inspeção visual não pôde iniciar porque nenhum navegador estava conectado à sessão; por isso, desktop, celular, interações e controles não foram marcados somente com base na leitura do código. O primeiro build encontrou uma pasta SEO transitória ausente durante a preparação da saída; a pasta existia na verificação imediata e dois builds sequenciais posteriores foram aprovados.
