# Revisão e reconstrução das aulas

Esta pasta é a fonte de verdade para reconstruir as aulas da Formação Java sem depender do histórico de um chat.

## Comece sempre por aqui

1. Leia integralmente [`BLUEPRINT_RECONSTRUCAO_AULAS.md`](BLUEPRINT_RECONSTRUCAO_AULAS.md).
2. Consulte [`CRONOGRAMA_COMPLETO.md`](CRONOGRAMA_COMPLETO.md) para saber o estado de cada aula.
3. Consulte [`STATUS_REVISAO.json`](STATUS_REVISAO.json) para o estado estruturado e as referências das aulas aprovadas.
4. Copie [`MODELO_MATRIZ_COBERTURA.md`](MODELO_MATRIZ_COBERTURA.md) durante a auditoria de cada nova aula.
5. Use as aulas 008 e 010 como referências executáveis, sem copiar cegamente um único formato.

## Números oficiais

- Existem 721 arquivos em `docs/aulas`.
- A aula `000` é a abertura.
- Existem 720 aulas numeradas de `001` a `720`.
- Portanto, o cronograma controla 721 itens para não perder a abertura.

## Referências aprovadas

### Aula 000 — orientação interativa e pacto de estudo

- `plataforma-curso/src/components/GuidedCourseOpeningLesson000.jsx`
- `plataforma-curso/src/components/guidedCourseOpeningLesson.css`
- `docs/revisao-aulas/matrizes/000_AULA_DE_ABERTURA.md`
- Conceito de referência: uma aula conceitual também precisa produzir decisões, evidências e um compromisso verificável; diagramas e simulações substituem listas quando relações são a própria matéria.

### Aula 008 — laboratório visual de IDE

- `plataforma-curso/src/components/GuidedIntelliJLesson008.jsx`
- `plataforma-curso/src/components/guidedIntelliJLesson.css`
- Conceito de referência: uma interface não é apenas ilustrada; seus estados importantes podem ser simulados e manipulados.

### Aula 010 — laboratório guiado de terminal

- `docs/aulas/010_M0_10_GIT_LOCAL_DO_ZERO.md`
- `plataforma-curso/src/components/GuidedGitLesson010.jsx`
- `plataforma-curso/src/components/guidedLesson.css`
- `plataforma-curso/public/lesson-assets/010-git-local/`
- Conceito de referência: todo comando precisa de contexto, saída esperada, interpretação e recuperação de erros.

### Integração

- `plataforma-curso/src/components/MarkdownViewer.jsx`

### Interface permanente da plataforma

- Página inicial: `plataforma-curso/src/components/WelcomeView.jsx`
- Acabamento da página inicial: `plataforma-curso/src/components/welcomeElegance.css`
- Navegador lateral: `plataforma-curso/src/components/Sidebar.jsx`
- Acabamento do navegador: `plataforma-curso/src/components/sidebarNavigator.css`
- Princípio de referência: a interface deve orientar o estudo com hierarquia clara e elementos compactos; a apresentação não pode ocupar o espaço da aprendizagem.

## Atualizar o cronograma

Edite apenas `STATUS_REVISAO.json` e execute na raiz do projeto:

```powershell
node tools/update-lesson-review-schedule.mjs
```

Depois confirme:

```powershell
git diff --check
```

## Prompt de retomada para outro chat

Use este texto:

> Leia integralmente `docs/revisao-aulas/README.md` e todos os documentos obrigatórios indicados nele. Consulte o cronograma e o estado estruturado. Continue a reconstrução das aulas exatamente de acordo com o blueprint, começando pela próxima aula autorizada. Antes de implementar, leia a aula antiga inteira e produza a matriz de cobertura. Não marque nenhuma aula como refeita antes de executar toda a validação e receber minha aprovação.
