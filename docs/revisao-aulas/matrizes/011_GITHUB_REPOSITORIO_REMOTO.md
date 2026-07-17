# Matriz de cobertura — Aula 011

## Identificação

- ID: `011_M0_11_GITHUB_E_REPOSITORIO_REMOTO`
- Título antigo: GitHub e Repositório Remoto
- Arquivo original: `docs/aulas/011_M0_11_GITHUB_E_REPOSITORIO_REMOTO.md`
- Módulo e posição: M0.11
- Aula anterior relevante: `010_M0_10_GIT_LOCAL_DO_ZERO.md`
- Aula seguinte relevante: `012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA.md`
- Arquétipo escolhido: laboratório visual de publicação local-remoto com autenticação segura
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Criar e proteger uma conta pessoal, criar no GitHub um repositório remoto vazio, conectar um repositório local por HTTPS, autenticar com Git Credential Manager, publicar `main`, comprovar o upstream e repetir um segundo ciclo até a alteração aparecer na página do projeto — sem expor segredo nem usar `--force`.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Git local × GitHub remoto | Conceito | Sim | Etapa 1 | Mapa local/remoto interativo |
| Benefícios: continuidade, portfólio, colaboração e cópia remota | Contexto | Sim | Etapas 1 e 11 | Fluxo e critérios profissionais |
| GitHub não é backup manual | Limite | Sim | Etapas 1 e 8 | Apenas commits são publicados |
| `commit`, `push`, `pull`, `fetch` e `clone` | Conceito/comando | Sim | Etapas 1, 7, 9 | Fluxo selecionável e terminais com saída |
| URL HTTPS e SSH | Conceito | Sim | Etapa 5 | Comparador com pré-requisitos e autenticação |
| `origin` como apelido local | Conceito | Sim | Etapa 6 | Diagrama configuração local → URL |
| Fetch URL e push URL | Conceito | Sim | Etapa 6 | Saída explicada de `git remote -v` |
| Conta GitHub acessível | Pré-requisito | Sim | Etapa 2 | Signup, e-mail verificado e login simulados |
| Segurança da conta, 2FA e recuperação | Lacuna corrigida | — | Etapa 2 | Fluxo 2FA, códigos de recuperação e passkey opcional |
| Conta pessoal × conta corporativa gerenciada | Limite | Sim | Etapa 2 | Nota de escopo da conta |
| Público × privado | Decisão | Sim | Etapa 4 | Seletor com exposição e permissão |
| Segredo não entra nem em privado | Segurança | Sim | Etapas 3, 4 e 10 | Inspeção pré-push e incidente de segredo |
| Nome claro, minúsculo e com hífen | Prática | Sim | Etapa 4 | Formulário com validação e preview da URL |
| Projeto local existente exige remoto vazio | Regra | Sim | Etapas 3 e 4 | README, `.gitignore` e licença desmarcados |
| Históricos divergentes se o GitHub criar commit | Risco | Sim | Etapas 4 e 10 | Comparador vazio × inicializado e non-fast-forward |
| Inspecionar pasta, status, branch e log antes de conectar | Prática | Sim | Etapa 3 | Terminal de pré-voo com estado limpo |
| Procurar segredo antes de publicar | Segurança | Sim | Etapa 3 | Checklist de arquivos e diff staged |
| HTTPS como caminho inicial | Decisão | Sim | Etapa 5 | Fluxo GCM → navegador → autorização |
| Senha da conta não autentica operações Git HTTPS | Atualização | Sim | Etapa 5 | Correção explícita: GCM/PAT, não senha |
| SSH exige par de chaves e cadastro da pública | Conceito | Sim | Etapa 5 | Comparador sem antecipar laboratório de chaves |
| PAT não deve ser salvo em arquivo ou README | Segurança | Sim | Etapas 5 e 10 | Cofre conceitual e diagnóstico |
| `git remote add origin URL` | Comando | Sim | Etapa 6 | Comando, ausência de saída e configuração visual |
| `git remote -v` | Comando | Sim | Etapa 6 | Fetch/push URL visíveis |
| `git remote set-url` | Recuperação | Sim | Etapa 10 | Caso URL errada com confirmação |
| `git remote remove` / `rm` | Recuperação | Sim | Etapa 10 | Caso de desvinculação sem excluir GitHub |
| `git push -u origin main` | Comando | Sim | Etapa 7 | Saída realista, autenticação e upstream |
| `-u` / `--set-upstream` | Conceito | Sim | Etapa 7 | Relação `main` → `origin/main` |
| `git branch -vv` e `git status -sb` | Lacuna corrigida | — | Etapa 7 | Prova direta do tracking |
| Arquivos aparecem no GitHub | Evidência | Sim | Etapa 7 | Mock da página do repositório após push |
| Segundo ciclo: editar, diff, add, commit, push | Atividade | Sim | Etapa 8 | Estado sincronizado terminal/GitHub |
| `git clone URL` cria pasta, `.git`, `origin` e baixa histórico | Comando/conceito | Sim | Etapa 9 | Simulador do cenário remoto → local |
| Não executar `git init` após clone | Erro | Sim | Etapas 9 e 10 | Estado resultante do clone |
| `git fetch` consulta sem integrar | Conceito | Sim | Etapa 9 | Ponteiro `origin/main` muda sem arquivo local |
| `git pull` busca e integra | Conceito | Sim | Etapa 9 | Comparação fetch/pull e aviso de trabalho limpo |
| Fluxo diário completo | Prática | Sim | Etapas 8 e 9 | Sequência inspecionar → atualizar → trabalhar → publicar |
| `remote origin already exists` | Erro | Sim | Etapa 10 | Diagnóstico `remote -v` e `set-url` |
| `No configured push destination` | Erro | Sim | Etapa 10 | Adição de origin e upstream |
| Push sem commit / refspec main | Erro | Sim | Etapa 10 | Status, log e branch antes da correção |
| `repository not found` / autenticação | Erro | Sim | Etapa 10 | URL, conta, permissão e método de autenticação |
| `non-fast-forward` | Erro | Sim | Etapa 10 | Fetch antes de integrar; `--force` proibido no início |
| Segredo publicado | Incidente | Sim | Etapa 10 | Revogar/rotacionar primeiro; remoção do histórico com orientação |
| README como apresentação inicial | Conexão futura | Sim | Etapas 7, 8 e 11 | Uso mínimo; sintaxe aprofundada fica na Aula 012 |
| Portfólio e contexto corporativo | Contexto | Sim | Etapa 11 | Critérios de cuidado e fluxo branch/PR/review/CI futuro |
| Atividade alternativa de clone | Atividade | Sim | Etapa 9 | Laboratório separado sem misturar cenários |
| Relatório de evidências | Atividade | Sim | Etapa 11 | Documento copiável sem token ou e-mail pessoal |
| Critérios de conclusão | Avaliação | Sim | Conclusão | Checklist de estados verificáveis |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Git não é GitHub | Abertura, seção própria e fechamento | Consolidar no mapa da etapa 1 | A Aula 009 já estabeleceu a distinção; agora ela vira fluxo |
| Push envia e commit é local | Conceito, erros, atividade e fechamento | Demonstrar nas etapas 1, 7 e 8 | Reaparece somente quando muda o estado observado |
| Validar `remote -v` | Origin, conexão, alteração, erros e atividade | Usar como protocolo antes/depois | A repetição ganha função de segurança, não de volume |
| Segredos não devem ser versionados | Público/privado, autenticação, segurança, erros e fechamento | Consolidar em pré-voo e incidente | Preserva prevenção e resposta sem cinco listas iguais |
| Exemplo mínimo e atividade guiada | Duas sequências quase idênticas | Um laboratório sincronizado | Terminal e página do GitHub mostram as mesmas mudanças |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| Não ensina criar conta, verificar e-mail ou proteger acesso | Iniciante trava antes de criar repositório | Signup guiado, e-mail verificado, 2FA, códigos e passkey opcional |
| Não mostra a interface de criação do repositório | Aluno não sabe onde clicar nem o que deixar desmarcado | Mock fiel identificado, formulário e preview do resultado |
| Autenticação é vaga | Aluno tenta usar a senha no terminal ou expõe PAT | HTTPS recomendado com GCM/navegador; senha removida; PAT apenas como alternativa segura |
| Push sem saída completa | Não sabe distinguir envio, upstream e falha | Terminal acumulativo com objetos, branch e confirmação de tracking |
| Não mostra `git branch -vv` nem `status -sb` | Upstream fica abstrato | Prova visual da relação local/remoto |
| Não separa claramente os cenários publicar e clonar | Aluno pode executar `init` e `clone` juntos | Seletor com transformações mutuamente exclusivas |
| Recomenda `git pull` cedo sem inspeção | Pode integrar alterações sem entender o estado | Ensinar `fetch` como inspeção e exigir trabalho limpo antes de pull |
| Segurança trata “apagar o arquivo” como insuficiente, mas sem protocolo | Incidente permanece abstrato | Revogar/rotacionar, avaliar alcance, depois limpar histórico com ajuda |
| Não explica que remover remoto local não exclui repositório no GitHub | Pode criar falsa sensação de exclusão | Comparador de efeitos de `remote remove` |
| Fluxo diário usa `git add .` apesar da aula anterior priorizar seleção | Pode enviar arquivo indesejado | Manter seleção explícita e revisão staged; explicar quando `add .` é aceitável |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Explorar o fluxo local/remoto | Commit permanece local; push publica; fetch/pull/clone apontam direções distintas | vocabulário e responsabilidades |
| 2 | Percorrer criação e proteção da conta | E-mail verificado, 2FA e recuperação registradas sem revelar códigos | conta e segurança |
| 3 | Auditar o repositório local | branch, log, status limpo e ausência de segredo | pré-voo seguro |
| 4 | Criar remoto vazio pela interface | URL pronta, visibilidade consciente e inicializadores desmarcados | repositório e históricos |
| 5 | Escolher HTTPS ou SSH | Método, pré-requisitos e autenticação compatíveis | GCM, PAT, SSH e senha removida |
| 6 | Adicionar e conferir `origin` | fetch e push URL apontam ao destino correto | remote add/v/set-url/remove |
| 7 | Publicar `main` e criar upstream | saída do push, `origin/main`, arquivos e commit no GitHub | push, autenticação e tracking |
| 8 | Fazer uma segunda mudança | commit local aparece remotamente só depois do push | ciclo diário e README mínimo |
| 9 | Comparar clone, fetch e pull | pasta, origin, ponteiros e arquivos mudam de modos distintos | atualização local |
| 10 | Diagnosticar falhas | sintoma, inspeção, recuperação e confirmação | erros, non-fast-forward e segredo |
| 11 | Produzir evidência e transferir | relatório sem credenciais e desafio verificável | portfólio, colaboração e conclusão |

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

Observação de validação: a rota da aula respondeu HTTP 200 e a integração foi confirmada no build. A sessão atual não disponibilizou um navegador controlável; por isso, desktop, celular, interações e controles de conclusão permanecem deliberadamente pendentes de inspeção visual e funcional, sem serem marcados por inferência.
