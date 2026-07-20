# Plano de fechamento da Fase 1 — aulas 121 a 145

## Ponto de retomada confirmado

- Verificação realizada em: **2026-07-19**.
- Última aula implementada: **141 — M4.37 — Revisão prática de OO e domínio**.
- Estado da Aula 141: **`em_revisao`**, tecnicamente validada e ainda sem aprovação visual explícita.
- Próxima aula autorizada: **142 — M4.38 — Mini-projeto Ordem de Serviço Console**.
- Meta atual: reconstruir, em ordem, as aulas **142 a 145** e encerrar integralmente a **Fase 1 — Base Java**.
- A Aula **146** inicia a Fase 2 e não pertence a este marco.

A conferência física encontra 142 componentes guiados, numerados de 000 a 141. A Aula 141 possui componente, matriz e validador próprios; a Aula 142 é o próximo ponto sem esses artefatos.

## Como interpretar este plano

Os objetivos abaixo organizam a progressão pedagógica, mas **não substituem a leitura integral da aula antiga**. Antes de implementar cada aula, o responsável deve inventariar todo conceito, exemplo, erro, atividade e nuance do Markdown original na matriz de cobertura. O conteúdo final pode ficar mais claro e menos repetitivo, mas não pode ficar mais raso.

## Sequência curricular restante

| Aula | Tema oficial | Papel na progressão |
|---:|---|---|
| 121 | `static` com critério | Separar estado e comportamento da classe de estado e comportamento de cada objeto, tornando visíveis pertencimento, ciclo de vida, acesso e riscos de estado global. |
| 122 | `final` em classes, métodos e atributos | Distinguir referência não reatribuível, estado interno mutável, método não sobrescrevível e classe não herdável, sempre com consequência executável. |
| 123 | Sobrecarga de construtores | Projetar caminhos de criação coerentes, evitar duplicação com delegação e impedir combinações inválidas. |
| 124 | `this` e autorreferência | Tornar explícitos objeto atual, desambiguação, delegação entre construtores e os limites de devolver ou vazar a própria referência. |
| 125 | Organização de classes em arquivos | Relacionar classe pública, nome de arquivo, responsabilidades, navegação na IDE, compilação e estrutura do projeto. |
| 126 | Pacotes de domínio | Organizar tipos por significado e fronteira, conectando declaração `package`, diretórios, imports e compilação. |
| 127 | Modificadores de acesso | Ensinar acesso como proteção de invariantes e arquitetura, não como tabela isolada de palavras-chave. |
| 128 | Coesão em classes | Diagnosticar responsabilidades que mudam por motivos diferentes e refatorar para classes com propósito claro. |
| 129 | Acoplamento entre classes | Tornar dependências visíveis, medir o custo de mudança e comparar alternativas sem prometer “zero acoplamento”. |
| 130 | Colaboração entre objetos | Distribuir trabalho entre objetos com mensagens, contratos e responsabilidades observáveis. |
| 131 | Tell, Don't Ask | Comparar consulta seguida de decisão externa com comportamento protegido pelo próprio objeto, incluindo situações em que consultar continua legítimo. |
| 132 | Objetos anêmicos | Reconhecer domínio reduzido a dados, mover regras com critério e evitar transformar toda classe em entidade rica artificialmente. |
| 133 | Invariantes de domínio | Definir o que precisa ser sempre verdadeiro e proteger nascimento e transições do objeto. |
| 134 | Serviços de domínio — introdução | Retirar do objeto somente a regra que realmente envolve múltiplos conceitos e não pertence naturalmente a uma entidade ou valor. |
| 135 | Factories simples | Nomear intenções de criação, centralizar escolhas válidas e comparar factory com construtor sem antecipar padrões desnecessários. |
| 136 | Builder — introdução | Construir objetos com muitos dados opcionais de forma legível, preservando validação e deixando claros os custos do padrão. |
| 137 | Coleções dentro de objetos | Encapsular adição, remoção, busca, cópia defensiva e exposição segura de coleções internas. |
| 138 | Composição com coleções | Modelar relações um-para-muitos e comportamentos do conjunto sem quebrar limites do objeto. |
| 139 | Agregados — introdução | Apresentar raiz, consistência e fronteira transacional como critérios iniciais, sem fingir uma cobertura completa de DDD. |
| 140 | Limites de responsabilidade do domínio | Consolidar entidade, valor, serviço, factory, builder, coleção e agregado por decisões comparáveis. |
| 141 | Revisão prática de OO e domínio | Fazer o aluno diagnosticar e refatorar um modelo integrado, explicando cada decisão e suas evidências. |
| 142 | Mini-projeto Ordem de Serviço — parte 1 | O projeto deve começar por requisitos, modelo, invariantes e esqueleto executável; a divisão exata deve respeitar a auditoria das três aulas originais. |
| 143 | Mini-projeto Ordem de Serviço — parte 2 | Evoluir comportamento e colaboração mantendo o programa compilável e executável ao final da etapa. |
| 144 | Mini-projeto Ordem de Serviço — parte 3 | Integrar o fluxo de console, cenários, erros e entrega final sem esconder lacunas entre trechos de código. |
| 145 | Fechamento do M4 — Orientação a Objetos | Produzir revisão, diagnóstico, desafio de transferência e evidências de prontidão para iniciar Collections na Aula 146. |

## Blocos de execução

### Bloco A — mecanismos da linguagem aplicados a objetos: 121–127

O aluno deve sair sabendo explicar pertencimento, criação, organização e visibilidade. Mocks de IntelliJ, árvores de arquivos, comandos de compilação, mensagens reais do compilador e diagramas de referência são esperados quando tornarem uma relação invisível observável.

### Bloco B — qualidade do modelo e domínio: 128–140

O aluno deve comparar modelos, identificar consequências e refatorar com critério. Diagramas de colaboração, mapas de responsabilidade, simuladores de invariantes e código antes/depois têm prioridade sobre listas de definições.

### Bloco C — consolidação e projeto: 141–145

As aulas devem formar uma sequência contínua. O mini-projeto não pode reiniciar do zero em cada parte nem apresentar arquivos incompatíveis. Cada parte entrega uma versão completa, compilável e executável; a parte seguinte começa exatamente nessa versão.

## Artefatos obrigatórios por aula

Para a Aula `NNN`, criar e integrar:

1. matriz em `docs/revisao-aulas/matrizes/NNN_*.md`;
2. componente `plataforma-curso/src/components/Guided*LessonNNN.jsx`;
3. CSS específico, somente para o que não pertence à moldura compartilhada;
4. importação preguiçosa com `React.lazy` e seleção pelo prefixo exato em `MarkdownViewer.jsx`;
5. chave de progresso `guided-<assunto>-lesson-NNN-progress`;
6. validador `tools/validate-lesson-NNN.mjs`, incluindo compilação Java real quando houver programa ou conjunto de fontes;
7. entrada `em_revisao` em `STATUS_REVISAO.json`, com resumo e referências reais;
8. cronograma regenerado por `node tools/update-lesson-review-schedule.mjs`.

## Contrato pedagógico inegociável

- O Codex atua como professor, mentor e guia; não como gerador de apostila técnica seca.
- Toda ação precisa de contexto, resultado esperado, interpretação e recuperação de erro.
- Código deve ter destaque de sintaxe, arquivo identificado, opção de copiar e saída explicada.
- Relações invisíveis pedem diagramas; ferramentas e IDE pedem mock ou tela guiada; execução pede terminal e saída.
- Conceitos não podem ser removidos para encurtar a aula. Repetições só podem ser consolidadas depois de confirmar que não carregam nuance única.
- Toda aula precisa de prática guiada antes do desafio aberto.
- Clínica de Erros e Entrega & Desafio são decisões pedagógicas orientadas pelo conteúdo, não uma quantidade fixa de etapas nem um molde automático.
- Desktop e celular precisam funcionar, incluindo roteiro sticky/horizontal, foco da etapa ativa e barra inferior.
- Uma etapa pode ser concluída e desmarcada. A aula e a próxima aula permanecem bloqueadas enquanto houver etapas pendentes.
- Nenhuma aula muda de `em_revisao` para `refeita` sem aprovação visual explícita do responsável.

## Validação mínima de cada entrega

```powershell
node tools/validate-lesson-NNN.mjs
node tools/validate-review-continuity.mjs
node tools/update-lesson-review-schedule.mjs
npm.cmd run lint --prefix plataforma-curso
npm.cmd run build --prefix plataforma-curso
git diff --check
```

Execute também `node tools/validate-learning-state-sync.mjs` se houver qualquer mudança em progresso, navegação, autenticação, API ou chaves de armazenamento.

## Gate especial de encerramento da Fase 1

Depois da Aula 145, antes de iniciar a 146:

- confirmar a existência dos componentes, matrizes e validadores 121–145;
- compilar o mini-projeto completo das aulas 142–144;
- verificar que a 143 parte da entrega da 142 e a 144 parte da entrega da 143;
- inspecionar a Aula 145 em desktop e celular;
- executar lint, build, validação de continuidade, sincronização e descoberta pública;
- atualizar `continuation.lastImplementedLesson` para 145 e `nextAuthorizedLesson` para 146;
- manter as aulas sem aprovação explícita como `em_revisao`.

## Prompt pronto para um novo chat

> Leia integralmente `docs/revisao-aulas/README.md`, `BLUEPRINT_RECONSTRUCAO_AULAS.md`, `PLANO_FECHAMENTO_FASE_1_121_145.md`, `MODELO_MATRIZ_COBERTURA.md` e o objeto `continuation` de `STATUS_REVISAO.json`. Execute `node tools/validate-review-continuity.mjs` antes de editar. A última aula implementada confirmada é a 141; a próxima autorizada é a 142 — Mini-projeto Ordem de Serviço Console; a meta é chegar à 145 e encerrar a Fase 1. Trabalhe uma aula por vez. Leia integralmente a aula antiga, as adjacentes relevantes e as referências aprovadas; produza a matriz antes do componente; preserve todo conteúdo único; ensine como professor e mentor com código destacado, saídas, mocks, diagramas, prática, erros e recuperação quando necessários. Integre com `React.lazy`, progresso sincronizável e validador real. Atualize status e cronograma sem marcar como `refeita` antes da minha aprovação visual explícita.
