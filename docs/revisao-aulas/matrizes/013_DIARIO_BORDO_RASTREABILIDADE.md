# Matriz de cobertura — Aula 013

## Identificação

- ID: `013_M0_13_DIARIO_DE_BORDO_E_RASTREABILIDADE_DO_APRENDIZADO`
- Título antigo: Diário de Bordo e Rastreabilidade do Aprendizado
- Arquivo original: `docs/aulas/013_M0_13_DIARIO_DE_BORDO_E_RASTREABILIDADE_DO_APRENDIZADO.md`
- Módulo e posição: M0.13
- Aula anterior relevante: `012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA.md`
- Aula seguinte relevante: `014_M0_14_CODEX_IA_NO_INTELLIJ_COM_ETICA_E_METODO.md`
- Arquétipo escolhido: mentoria de registro, revisão e rastreabilidade com Git
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Criar um sistema pequeno de registros em `docs`, escrever uma entrada técnica da Aula 013 com prática, erro, evidência, dúvida e próxima ação, produzir uma revisão semanal baseada em recuperação ativa e ligar os arquivos ao histórico do Git sem expor informação sensível.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Entendimento momentâneo não garante retenção | Conceito | Sim | Etapa 1 | Linha do tempo consumo → esquecimento → recuperação |
| Atenção, prática, erro, correção, registro, revisão e explicação | Processo | Sim | Etapa 1 | Ciclo de aprendizagem selecionável |
| Diário como registro cronológico | Conceito | Sim | Etapas 1 e 4 | Timeline e entrada datada |
| Aula, conceitos, comandos, códigos, erros, soluções, atalhos, decisões, dúvidas e próximo passo | Conteúdo | Sim | Etapa 4 | Construtor de entrada completa |
| Diário não é cópia da apostila | Limite | Sim | Etapa 5 | Classificador diário × apostila × anotação × revisão |
| Rastreabilidade: quem, quando, por quê, regra, evidência e commit | Conceito profissional | Sim | Etapas 1 e 7 | Cadeia aula → arquivo → diff → commit |
| Estrutura `docs` com diário, atalhos, diagnóstico, revisões e decisões | Organização | Sim | Etapas 2 e 3 | Árvore de arquivos com papéis distintos |
| Diferença entre diário, anotação e revisão | Conceito | Sim | Etapa 5 | Classificador com justificativa |
| Medir evolução com evidências, não “estudei bastante” | Mentalidade | Sim | Etapas 1 e 8 | Painel de evidências e revisão |
| Diário simples e sustentável | Regra | Sim | Etapas 4 e 11 | Modo mínimo e modo completo com orçamento de tempo |
| Modelo oficial de entrada | Artefato | Sim | Etapa 4 | Fonte Markdown válida e preview |
| Criar `docs` e `diario-de-bordo.md` por PowerShell | Comando | Sim | Etapa 3 | Terminal com saída e árvore atualizada |
| Criar arquivo pelo IntelliJ | Lacuna corrigida | — | Etapa 3 | Simulação Project → New → File |
| Blocos de PowerShell, Java e SQL no diário | Sintaxe aplicada | Sim | Etapa 4 | Seletor de evidência com destaque |
| Diário e commits; combinar arquivos quando formam uma intenção | Git/prática | Sim | Etapa 7 | Comparador commit só diário × entrega coerente |
| Mensagem de commit descrevendo intenção | Qualidade | Sim | Etapa 7 | Mensagem boa/ruim e saída do commit |
| Entrada genérica × entrada específica | Qualidade | Sim | Etapa 4 | Comparador “Aprendi Git” × evidência real |
| Registrar erro, comando, mensagem, causa, solução e aprendizado | Diagnóstico | Sim | Etapa 6 | Formulário guiado de incidente didático |
| Erro `java Main`/classe não encontrada e pasta errada | Exemplo | Sim | Etapa 6 | Terminal, `Get-Location`, arquivo e confirmação |
| Exemplo de compilação manual truncado no original | Defeito corrigido | — | Etapa 6 | Registro completo de `javac`, artefato e execução |
| Atalhos usados no diário; catálogo recorrente em `atalhos.md` | Organização | Sim | Etapas 2, 4 e 5 | Roteamento do conhecimento |
| Tabela de atalhos IntelliJ e comandos Git | Artefato | Sim | Etapas 2 e 11 | Arquivo `docs/atalhos.md` preservado |
| Atalhos variam por sistema e keymap | Limite | Sim | Etapa 2 | Nota de busca por ação |
| Revisão no fim da aula, semana e módulo | Rotina | Sim | Etapa 8 | Agenda flexível de revisão |
| Revisão semanal: aulas, pontos firmes, pontos fracos e ação | Artefato | Sim | Etapa 8 | Construtor de `revisoes.md` |
| Recuperação ativa antes de reler | Lacuna corrigida | — | Etapa 8 | Campo “explique sem consultar” e comparação posterior |
| Prática distribuída/espaçada | Lacuna corrigida | — | Etapa 8 | Linha do tempo sem intervalos mágicos rígidos |
| `docs/revisoes.md` e modelo de revisão | Artefato | Sim | Etapas 2, 8 e 11 | Preview e entrega final |
| `git log --oneline` como histórico do progresso | Git | Sim | Etapa 7 | Linha do tempo de commits |
| `git show` como conexão futura | Conexão | Sim | Etapa 7 | Explicação sem antecipar uso profundo |
| `status`, `diff`, `add`, `diff --staged`, `commit`, `status` | Comandos | Sim | Etapas 7 e 11 | Terminal acumulativo com saídas |
| Não registrar segredos, dados reais, informações corporativas ou prints privados | Segurança | Sim | Etapa 9 | Redator de contexto e gate pré-commit |
| Repositório público exige escrita técnica e profissional | Portfólio | Sim | Etapa 9 | Comparador privado/público sem relaxar segredo |
| Diário pessoal não é necessariamente arquivo corporativo | Limite | Sim | Etapa 9 | Tradução para ticket, PR, ADR, changelog, runbook, postmortem |
| Exemplo de regra de reagendamento e cenário negativo | Aplicação corporativa | Sim | Etapa 9 | Registro de validação com regra e evidência |
| Manter diário sem peso | Sustentabilidade | Sim | Etapas 4, 8 e 11 | Orçamento de 5–10 minutos e modo mínimo |
| Momentos de atualização: aula, erro, decisão, prática, semana e módulo | Rotina | Sim | Etapa 8 | Agenda por gatilho, não microação |
| Checklist de qualidade da entrada | Avaliação | Sim | Etapas 4 e 11 | Auditor automático de campos |
| Dez erros comuns do original | Diagnóstico | Sim | Etapa 10 | Clínica com causa, correção e confirmação |
| Decisões como JDK 21, main, `C:\dev` e Markdown | Exemplo | Sim | Etapas 2 e 10 | Destino correto em `decisoes.md` |
| Atividade com diário, atalhos e revisões | Atividade | Sim | Etapa 11 | Três arquivos revisados e commitados |
| Critérios de conclusão completos | Avaliação | Sim | Conclusão | Checklist observável e desafio de transferência |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Diário precisa registrar aprendizado, prática, erro e próxima ação | Abertura, modelo, qualidade, checklist e fechamento | Consolidar no construtor da etapa 4 | O aluno produz uma entrada em vez de reler listas |
| Git status/diff/add/commit | Rastreabilidade, commits, arquivos alterados e atividade | Executar no laboratório da etapa 7 e entrega | Cada repetição passa a representar mudança de estado |
| Não registrar segredo | Seções de segurança, portfólio, erros e fechamento | Gate único e cenários da etapa 9 | Mantém prevenção e contexto sem advertências duplicadas |
| Diário deve ser simples | Modelo, manutenção, atualização e erros | Dois níveis de entrada e orçamento de tempo | Sustentabilidade vira decisão praticável |
| Atalhos em diário e arquivo próprio | Duas seções e atividade | Classificador e artefato final | Preserva o conteúdo e esclarece o destino |

## Lacunas e defeitos da aula antiga que serão corrigidos

| Lacuna ou defeito | Consequência para o aluno | Correção planejada |
|---|---|---|
| Modelo oficial começa, mas seu bloco Markdown não termina corretamente | O aluno não recebe um modelo copiável válido | Gerador de entrada completo com preview e botão copiar |
| Exemplo mínimo e exemplo Java ficam truncados | Evidência técnica desaparece no próprio material | Casos completos com comando, erro, causa, correção e prova |
| Explica revisão, mas não obriga recuperar antes de reler | Revisão pode virar leitura passiva | Etapa “sem consultar → comparar → corrigir → praticar” |
| Não mostra como uma entrada curta cabe na rotina | Aluno abandona por imaginar um relatório longo | Modo mínimo de 5 minutos e modo completo para marcos |
| Não ensina critério para separar ou combinar commit do diário | Histórico pode ganhar commits artificiais | Comparador por intenção atômica e arquivos relacionados |
| Não mostra criar arquivos pela IDE | Aluno dependente de PowerShell pode travar no IntelliJ | Mock Project/New File sincronizado com terminal |
| “Evolução” é listada, mas não transformada em evidência | Sensação subjetiva continua | Cadeia aula → prática → arquivo → diff → commit → revisão |
| Intervalos de revisão aparecem como rotina genérica | Pode virar calendário rígido ou ser ignorado | Gatilhos flexíveis e explicação de espaçamento sem promessas mágicas |
| Não há recuperação quando o diário acumula aulas atrasadas | Culpa e abandono | Protocolo: retomar do marco atual, não reconstruir memória falsa |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Explorar a cadeia de aprendizagem | Registro e recuperação transformam experiência em evidência revisável | retenção, cronologia e rastreabilidade |
| 2 | Distribuir conhecimentos pelos arquivos certos | Árvore `docs` explica o papel de cada documento | diário, atalhos, diagnóstico, revisão e decisões |
| 3 | Criar ou validar os arquivos no terminal e IntelliJ | Comandos, saídas e árvore sincronizada | criação e localização |
| 4 | Construir uma entrada real da Aula 013 | Markdown válido, preview e auditor de qualidade | modelo, modo mínimo/completo e autoexplicação |
| 5 | Classificar diário, apostila, anotação e revisão | Cada texto recebe destino e justificativa | limites e organização |
| 6 | Registrar um erro do início ao fim | Tentativa, mensagem, causa, correção, prova e aprendizado | diagnóstico técnico |
| 7 | Ligar entrada, código e commit | Diff, staged, commit e log formam a cadeia de evidência | rastreabilidade com Git |
| 8 | Fazer revisão ativa e espaçada | Resposta sem consulta, lacunas, prática e próxima revisão | recuperação e espaçamento |
| 9 | Publicar com segurança e traduzir ao trabalho | Conteúdo seguro vira ticket, PR, ADR ou evidência | segurança, portfólio e contexto corporativo |
| 10 | Recuperar dez antipadrões | Sintoma, causa, correção e confirmação | sustentabilidade e qualidade |
| 11 | Entregar três arquivos e uma rotina | Repositório limpo, compromisso realista e desafio | transferência e conclusão |

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

A rota da aula respondeu com HTTP 200 e o componente foi integrado ao pacote de produção. A inspeção visual e os testes manuais de interação em desktop e celular permanecem pendentes porque não havia navegador controlável disponível nesta sessão; por isso, esses itens não foram marcados apenas com base na leitura do código.
