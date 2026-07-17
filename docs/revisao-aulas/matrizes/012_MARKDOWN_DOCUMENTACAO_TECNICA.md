# Matriz de cobertura — Aula 012

## Identificação

- ID: `012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA`
- Título antigo: Markdown para Documentação Técnica
- Arquivo original: `docs/aulas/012_M0_12_MARKDOWN_PARA_DOCUMENTACAO_TECNICA.md`
- Módulo e posição: M0.12
- Aula anterior relevante: `011_M0_11_GITHUB_E_REPOSITORIO_REMOTO.md`
- Aula seguinte relevante: `013_M0_13_DIARIO_DE_BORDO_E_RASTREABILIDADE_DO_APRENDIZADO.md`
- Arquétipo escolhido: oficina de Markdown com editor, preview e Git sincronizados
- Data da auditoria: 2026-07-17

## Resultado prometido ao aluno

Criar no IntelliJ um `README.md` legível em texto puro e no preview, organizar instruções reais com hierarquia, listas, checklists, código, links, imagem acessível e tabela, diagnosticar renderizações quebradas e registrar a entrega em um commit revisado.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Markdown como sintaxe leve e arquivo de texto puro | Conceito | Sim | Etapa 1 | Pipeline fonte → renderizador → documento e diff |
| Extensões `.md` e exemplos de arquivos técnicos | Conceito | Sim | Etapas 1 e 2 | Árvore do projeto e seletor de aplicação |
| Legibilidade sem renderização | Qualidade | Sim | Etapas 1 e 3 | Comparação editor/preview |
| Markdown e Git, diff linha a linha | Integração | Sim | Etapas 1 e 11 | Diff e commit da entrega |
| README, CONTRIBUTING, CHANGELOG, ADR, issues, PRs e wiki | Contexto | Sim | Etapas 1 e 9 | Mapa de usos e documentos aplicados |
| Markdown estrutura pensamento, não apenas aparência | Princípio | Sim | Etapas 1 e 8 | Documento organizado por perguntas do leitor |
| Perguntas de audiência, intenção, ação e risco | Método | Sim | Etapa 8 | Planejador de README orientado ao leitor |
| Estrutura básica: contexto, execução, exemplos, erros e validação | Estrutura | Sim | Etapa 8 | README profissional incremental |
| Títulos `#` a `####` e hierarquia sem saltos | Sintaxe | Sim | Etapa 3 | Editor/preview e caso quebrado |
| Parágrafos curtos e uma ideia por parágrafo | Escrita | Sim | Etapa 3 | Preview comparativo |
| Negrito e itálico com moderação | Sintaxe/qualidade | Sim | Etapa 4 | Laboratório de elementos inline |
| Listas ordenadas e não ordenadas | Sintaxe | Sim | Etapa 4 | Preview sincronizado |
| Checklists com `[ ]` e `[x]` | Sintaxe/aplicação | Sim | Etapa 4 | Checklist renderizado e estados distinguíveis |
| Código inline para comandos, arquivos e símbolos | Sintaxe | Sim | Etapa 4 | Termos técnicos destacados no preview |
| Blocos cercados por crases e linguagem | Sintaxe | Sim | Etapa 5 | Fonte Markdown e código Java/PowerShell renderizado |
| Linguagens `java`, `bash`, `powershell`, `sql`, `json`, `yaml`, `xml`, `markdown`, `text` | Variação | Sim | Etapa 5 | Seletor de linguagem e destaque correspondente |
| Diferença de contexto entre Bash e PowerShell | Operação | Sim | Etapa 5 | Comparador com comando e ambiente correto |
| Comando Linux destrutivo fora de contexto | Segurança | Sim | Etapas 5 e 10 | Diagnóstico e alternativa contextualizada |
| Links externos e relativos | Sintaxe/navegação | Sim | Etapa 6 | Resolvedor de caminho e preview clicável |
| Risco de link quebrado após mover arquivo | Erro | Sim | Etapas 6 e 10 | Simulação de caminho válido/quebrado |
| Imagens, caminho relativo e texto alternativo | Sintaxe/acessibilidade | Sim | Etapa 6 | Fonte, imagem simulada e fallback de alt |
| Imagem não substitui explicação essencial | Qualidade | Sim | Etapa 6 | Comparador com/sem texto explicativo |
| Tabelas pequenas para comparação | Sintaxe | Sim | Etapa 7 | Tabela de comandos renderizada |
| Citações | Sintaxe | Sim | Etapa 7 | Preview de blockquote |
| Linha horizontal com moderação | Sintaxe/qualidade | Sim | Etapa 7 | Separação estrutural comparada |
| Escape com barra invertida e crase | Sintaxe | Sim | Etapa 7 | Caractere literal renderizado |
| README mínimo da formação | Exemplo | Sim | Etapa 8 | Documento final incremental |
| Estrutura `docs`, `src` e `labs` | Contexto | Sim | Etapa 8 | Seção Estrutura do README |
| Comandos de Java e Git | Exemplo | Sim | Etapas 5 e 8 | Blocos com linguagem e contexto |
| Diário de bordo em Markdown | Conexão futura | Sim | Etapa 9 | Modelo mínimo; profundidade reservada à Aula 013 |
| Documento de comandos recorrentes | Aplicação | Sim | Etapa 9 | Seletor `docs/comandos.md` |
| README de API corporativa com pré-requisitos, variáveis, endpoints e testes | Aplicação | Sim | Etapas 8 e 9 | Modelo de documentação operacional |
| ADR com status, contexto, decisão e consequências | Aplicação futura | Sim | Etapa 9 | Preview de ADR simplificado |
| Checklist de validação de regra backend | Aplicação | Sim | Etapa 9 | Checklist de cadastro de pedido |
| Documentação de API com request/response JSON | Aplicação futura | Sim | Etapa 9 | Contrato `POST /pedidos` renderizado |
| Regras de escrita técnica clara | Qualidade | Sim | Etapas 8 e 10 | Auditor de utilidade e erros |
| IntelliJ: criar arquivo, editor, preview e modos de divisão | Ferramenta | Sim | Etapa 2 | Simulação fiel identificada |
| Plugin Markdown e recuperação quando preview não aparece | Lacuna corrigida | — | Etapas 2 e 10 | Verificação em Settings → Plugins |
| `Ctrl+Shift+A`, `Ctrl+Alt+L`, `Alt+1`, `Alt+F12`, `Ctrl+Shift+F`, `Shift+F6` | Operação | Sim | Etapas 2 e 9 | Painel de ações e `docs/atalhos.md` |
| Variação de atalhos por sistema/keymap | Limite | Sim | Etapa 2 | Busca por nome da ação como fallback |
| Organizar atalhos por IntelliJ, terminal e Git | Aplicação | Sim | Etapa 9 | Arquivo de atalhos estruturado |
| Dez erros comuns da aula antiga | Diagnóstico | Sim | Etapa 10 | Clínica com sintoma, causa, correção e confirmação |
| Não versionar segredo ou dado real | Segurança | Sim | Etapas 8, 10 e 11 | Placeholder, inspeção e bloqueio de entrega |
| Atualizar documentação quando projeto muda | Manutenção | Sim | Etapas 8 e 10 | Caso de comando/versão desatualizado |
| Atividade com README, atalhos e diário | Atividade | Sim | Etapa 11 | Três arquivos e diff selecionado |
| `git status`, `diff`, `add`, `diff --staged`, `commit`, `status` | Comandos | Sim | Etapa 11 | Terminal com saídas e confirmação |
| Critérios de conclusão completos | Avaliação | Sim | Conclusão | Checklist observável e desafio |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Markdown é simples, poderoso e não é enfeite | Abertura, conceito, qualidade e fechamento | Consolidar na transformação da etapa 1 | A relação fonte/estrutura/renderização demonstra a ideia |
| README mínimo aparece em exemplo e atividade | Exemplo mínimo e atividade guiada | Construir um único README incremental | O aluno observa cada competência entrar no mesmo artefato |
| Git status/diff/add/commit | Integração inicial, atividade e fechamento | Executar uma vez na entrega | Comandos já foram ensinados; aqui servem para provar documentação versionável |
| Atalhos do IntelliJ | Duas seções quase idênticas | Um painel operacional e um arquivo final | Mantém todos os atalhos sem duplicar tabela |
| Segredos proibidos | Qualidade, erros, backend e diário | Pré-publicação e clínica de falha | Preserva prevenção e resposta sem repetir advertência |
| Diário de bordo | Exemplo aplicado, atividade e fechamento | Modelo mínimo e ponte explícita | A prática aprofundada pertence à Aula 013 |

## Lacunas e defeitos da aula antiga que serão corrigidos

| Lacuna ou defeito | Consequência para o aluno | Correção planejada |
|---|---|---|
| Blocos Markdown mal fechados nas seções de diário e atividade | A própria aula exibe fonte inválida sem diagnóstico | Exemplos válidos e laboratório específico de cercas abertas |
| Não mostra lado a lado fonte e resultado | Sintaxe permanece abstrata | Editor e preview sincronizados em cada grupo de elementos |
| Não ensina onde criar o `.md` nem localizar o preview | Iniciante trava na interface | Mock guiado do Project, New File e controles Editor/Preview |
| Não explica o plugin Markdown quando o preview não aparece | Aluno supõe instalação quebrada | Caminho Settings → Plugins → Markdown e confirmação |
| Saídas de Git não aparecem na atividade | Aluno não sabe se o commit documental funcionou | Terminal com diff, staged, commit e estado limpo |
| Links e imagens são mostrados sem resolução do caminho atual | Erro relativo parece aleatório | Visualizador de arquivo atual, destino resolvido e mudança de pasta |
| Tabelas aparecem prontas, sem explicar cabeçalho/separador/linhas | Aluno copia sem conseguir corrigir | Montagem por partes e diagnóstico de separador ausente |
| Não diferencia CommonMark de extensões do GitHub | Pode supor que toda renderização é idêntica | Nota de portabilidade e marcação explícita de checklist/tabela como uso GitHub |
| Exemplos aplicados aparecem em sequência longa | Sobrecarga sem prática | Seletor de documento por intenção e preview focado |
| Não prova acessibilidade de imagem | Alt text vira detalhe decorativo | Estado de imagem indisponível mostrando o equivalente textual |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Explorar fonte, renderização e diff | O mesmo conteúdo permanece legível e ganha estrutura no preview | texto puro, Git e usos técnicos |
| 2 | Criar `README.md` no IntelliJ e abrir editor/preview | Árvore, aba e divisão mudam como na IDE | arquivo, plugin, interface e atalhos |
| 3 | Construir hierarquia e parágrafos | Outline e preview refletem níveis corretos | títulos, parágrafos e navegação |
| 4 | Aplicar ênfase, listas, checklist e código inline | Cada marcador produz um elemento distinto | sintaxe inline e agrupamento |
| 5 | Criar blocos de código contextualizados | Destaque muda com a linguagem e shell | cercas, linguagem, Java, Git e PowerShell |
| 6 | Resolver links e imagens relativas | Caminho válido abre; caminho quebrado é diagnosticado; alt permanece útil | links, imagens e acessibilidade |
| 7 | Montar tabela, citação, separador e escape | Preview mostra estrutura e literal corretamente | tabela e elementos auxiliares |
| 8 | Construir README orientado ao leitor | Documento responde objetivo, estrutura, execução, testes e cuidados | escrita técnica e manutenção |
| 9 | Comparar documentos técnicos | Comandos, atalhos, diário, API, checklist e ADR mudam conforme intenção | aplicações presentes e futuras |
| 10 | Diagnosticar dez falhas | Sintoma, causa, correção e confirmação aparecem juntos | qualidade, segurança e recuperação |
| 11 | Criar três arquivos, revisar diff e commitar | Commit documental e working tree limpo | atividade, Git, evidência e transferência |

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

Observação de validação: a rota da aula respondeu HTTP 200 e a integração foi confirmada no build de produção. A sessão atual continua sem navegador controlável; desktop, celular, interações e controles de conclusão permanecem pendentes de inspeção visual e funcional, sem marcação por inferência.
