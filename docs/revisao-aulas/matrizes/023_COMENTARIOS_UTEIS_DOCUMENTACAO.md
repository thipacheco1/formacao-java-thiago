# Matriz de cobertura — Aula 023

## Identificação

- Aula original: `docs/aulas/023_M1_03_COMENTARIOS_UTEIS_E_DOCUMENTACAO_INICIAL_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/022_M1_02_BLOCOS_CHAVES_INDENTACAO_E_LEITURA_DE_CODIGO_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/024_M1_04_VARIAVEIS_E_NOMES_PROFISSIONAIS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedUsefulCommentsLesson023.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedUsefulCommentsLesson.css`
- Arquétipo: oficina visual de comunicação no código com critério, segurança, IDE e documentação
- Estado: implementada e tecnicamente validada; aguarda inspeção visual e aprovação do responsável.

## Fronteiras com as aulas adjacentes

- A Aula 022 já ensinou classe, `main`, chaves, indentação, leitura estrutural e formatação. A Aula 023 usa essa base sem reensiná-la.
- A Aula 024 ensinará variáveis e nomes profissionais. A Aula 023 apenas demonstra que um nome expressivo pode substituir um comentário que mascara `int x`; não aprofunda declaração, tipo, atribuição ou convenções de nomes.
- Javadoc é reconhecido por `/** */`, mas geração, tags e documentação de API permanecem para aulas posteriores.

## Inventário integral e destino didático

| Conteúdo ou intenção da aula original | Destino na reconstrução | Tratamento |
|---|---|---|
| Código também é lido por pessoas | Etapa “Três camadas” | Transformado em princípio visível e operacional. |
| Comentários são ignorados por compilador e JVM | Laboratório de sintaxe e console | Demonstrado comparando fonte e saída. |
| Comentário não salva código confuso | Mapa de camadas e revisão de casos | Código continua sendo a primeira fonte de verdade. |
| `//` em linha própria | Laboratório de sintaxe | Código destacado, saída e interpretação. |
| `//` no fim da linha | Laboratório de sintaxe | Mantido com alerta sobre legibilidade e contexto. |
| `/* ... */` | Laboratório de sintaxe e clínica | Mantido, incluindo fechamento e não aninhamento normal. |
| `/** ... */` | Laboratório de sintaxe | Reconhecimento explícito sem antecipar Javadoc profundo. |
| Comentário não executa | Console sincronizado e mock do IntelliJ | Provado pela mudança de saída ao comentar uma linha. |
| Cemitério de código comentado | Etapa “Código e verdade” | Comparado ao histórico recuperável do Git. |
| Comentar por quê, regra, exceção, limitação, decisão ou contrato | Revisão de comentários e domínios | Consolidado em decisões justificadas. |
| Não comentar implementação óbvia | Caso “Repete a implementação” | Exige decisão de remover. |
| Comentário versus nome melhor | Caso `int x` e clínica | Preservado como ponte delimitada para a Aula 024. |
| Comentários podem mentir e envelhecer | Comparador coerente/desatualizado | Código, comentário e console aparecem lado a lado. |
| Comentário de estudo versus produção | Nota da etapa de verdade e mock da IDE | Experimentação temporária é aceita, limpeza antes do commit é obrigatória. |
| TODO com contexto e ciclo de vida | Mapa de destinos, busca no IntelliJ e auditoria final | TODO amplo vai para tarefa; ocorrência local precisa de contexto. |
| Senha, token, chave e dado real nunca entram em comentário | Classificador de segurança | Casos seguros e inseguros, com contenção e rotação primeiro. |
| Código, comentário e documentação têm papéis diferentes | Mapa interativo de três camadas | Tornado o modelo mental central da aula. |
| Ordem de serviço | Laboratório de domínio | Regra local e saída esperada. |
| Pedido | Laboratório de domínio | Limitação didática explícita sem antecipar variáveis. |
| Auditoria | Laboratório de domínio | Regra de autoria, com dados fictícios. |
| README inicial | Laboratório final | Preview, Markdown copiável, arquivos e cuidados. |
| `Ctrl+/` no IntelliJ | Mock interativo | Linha alterna entre executável e comentada, com console sincronizado. |
| `Ctrl+Shift+F` | Mock interativo | Busca por TODO, token e gambiarra, com contagem e limpeza simuladas. |
| Diagnóstico temporário | Mock e nota de estudo | Mantido como hipótese controlada, não como resto permanente. |
| Excesso de comentários | Revisão e clínica | Consolidado em comentário óbvio, contexto amplo e nome ruim. |
| Comentário de regra de negócio | Casos de revisão e domínios | Mantido quando explica intenção não evidente. |
| Decisão técnica | Caso de revisão | Mantida quando registra limitação e horizonte. |
| Erro conhecido | Mapa de destinos | Pode exigir tarefa/docs; não vira desculpa vaga no código. |
| Blocos não se aninham normalmente | Nota na clínica | Advertência explícita com exemplo conceitual. |
| Dez erros frequentes | Clínica de comentários | Dez casos navegáveis com sintoma, causa e correção. |
| Busca pré-commit por termos suspeitos | Mock e entrega | TODO, senha, token, password, secret, gambiarra, remover e teste. |
| Quatro classes e README | Laboratório final | Sequência de criação, compilação e execução. |
| Comandos e saídas | Terminal guiado | Cada comando possui evidência e interpretação esperada. |
| Diário de bordo | Documento de evidências copiável | Checklist e regra de bolso pessoais. |
| Git limpo e commit nominal | Laboratório final | `status`, `diff`, staged diff, `.class` e commit. |
| Desafio final | Revisão como pull request | Critérios de aceite objetivos e fronteiras da próxima aula. |

## Repetições consolidadas

- As várias listas “quando comentar” foram reunidas em uma única prática de revisão com decisões: manter, remover, corrigir, renomear ou reescrever.
- As advertências sobre comentário óbvio, excesso, nome ruim e desatualização foram preservadas em experiências diferentes somente quando produzem evidências distintas.
- Os exemplos de sintaxe deixaram de ser trechos isolados e passaram a compartilhar o mesmo ciclo: fonte, previsão, saída e interpretação.
- Os lembretes de Git foram concentrados nas etapas de verdade e entrega, onde a comparação com código morto e o staged diff têm função concreta.
- As listas de segurança foram transformadas em classificação de casos e resposta a incidente, sem duplicar slogans.

## Correções e lacunas resolvidas

- A aula agora mostra saídas esperadas depois de compilar e executar, inclusive o silêncio bem-sucedido de `javac`.
- A diferença entre uma linha comentada e uma linha executável é observável em um mock do IntelliJ com console sincronizado.
- A recomendação “use Git” passou a explicar o motivo: versões antigas são recuperáveis e não precisam permanecer como cemitério no arquivo.
- A segurança não termina em “apague a senha”: quando um segredo foi commitado, a ordem ensinada é conter, revogar ou rotacionar e só então limpar o repositório conforme o processo apropriado.
- README, docs/ADR, issue/tarefa, comentário e Git ganharam perguntas de roteamento para evitar documentação no lugar errado.
- Interfaces externas são identificadas como simulações didáticas e não como capturas exatas de uma versão específica.

## Recursos construídos

- Mapa interativo de código, comentário e documentação.
- Laboratório de quatro formatos de comentário com código destacado e console.
- Revisão de seis comentários como em pull request.
- Comparador entre comentário coerente, envelhecido e código morto.
- Três programas Java de domínio com saídas.
- Roteador de informação para comentário, README, docs, tarefa e Git.
- Classificador de segredo, credencial e dado pessoal.
- Mock do IntelliJ com `Ctrl+/`, busca no projeto e console sincronizado.
- Clínica navegável de dez erros.
- Terminal de entrega em cinco fases, README e documento de evidências copiáveis.

## Validação

- [x] Aula original lida integralmente.
- [x] Aula anterior lida integralmente.
- [x] Aula posterior lida integralmente.
- [x] Conteúdo mapeado antes de declarar cobertura.
- [x] Repetições consolidadas sem remoção de conceito ou prática relevante.
- [x] Sintaxe Java destacada como em IDE.
- [x] Comandos possuem contexto, saída e interpretação.
- [x] Componentes não antecipam variáveis nem Javadoc profundo.
- [x] Navegação por etapas, conclusão e retomada implementadas.
- [x] Responsividade tratada até 320 px, com rolagem horizontal apenas dentro de código quando necessária.
- [x] Raiz preserva `overflow: visible` para o roteiro sticky no desktop.
- [x] `npm.cmd run lint --prefix plataforma-curso` executado sem alertas.
- [x] Dois builds completos de produção executados com sucesso.
- [x] `git diff --check` executado no escopo sem erro de whitespace.
- [x] JSON de estado parseado e cronograma regenerado com 23 aprovadas, 1 em revisão e 697 pendentes.
- [x] Página SEO e chunk próprios da Aula 023 gerados no build.
- [ ] Inspeção visual desktop em navegador real.
- [ ] Inspeção visual mobile em navegador real.
- [ ] Aprovação explícita do responsável pelo curso.
