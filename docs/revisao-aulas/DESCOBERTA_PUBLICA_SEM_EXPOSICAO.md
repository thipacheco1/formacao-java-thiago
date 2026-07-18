# Descoberta pública sem exposição das aulas

Este documento é a fonte de verdade para SEO, buscadores e ferramentas de IA. O objetivo é permitir que terceiros entendam e recomendem a Formação Java Backend sem publicar o corpo integral das aulas.

## Contrato de acesso

- A página inicial, as trilhas, os módulos e o catálogo resumido das 721 aulas são públicos.
- Cada página pública de aula contém somente título editorial, resumo curto, temas, nível, duração estimada, posição no currículo e chamada para cadastro.
- Códigos, explicações integrais, laboratórios, diagramas, clínicas de erros, entregas e desafios permanecem dentro da plataforma autenticada.
- Nunca volte a gerar uma “prévia” copiando os primeiros caracteres do Markdown.
- Nunca anuncie vídeo, áudio, certificado ou download sem que o recurso realmente exista.

## Arquivos e responsabilidades

- `tools/generate-seo-pages.mjs`: produz as páginas estáticas e os índices públicos.
- `tools/validate-public-discovery.mjs`: bloqueia o build quando conteúdo demais, metadados errados ou rotas inseguras reaparecem.
- `plataforma-curso/src/data/coursePlan.js`: fonte da estrutura curricular oficial.
- `plataforma-curso/src/data/seoCatalog.js`: nomes e slugs editoriais das trilhas e módulos.
- `plataforma-curso/public/robots.txt`: permite descoberta por busca e bloqueia os crawlers de treinamento escolhidos.
- `plataforma-curso/public/404.html`: resposta visual para endereços inexistentes; deve continuar com `noindex`.
- `vercel.json`: contém somente as reescritas das páginas estáticas conhecidas. Não restaurar o catch-all `/(.*)`, pois ele transforma URLs inválidas em falso HTTP 200.

## Artefatos gerados

O `predev` e o `prebuild` regeneram:

- `/trilhas` e as cinco páginas de trilha;
- 22 unidades públicas: a abertura e 21 módulos;
- 721 páginas resumidas em `/aulas/...`;
- `/sitemap.xml`, com 750 URLs e `lastmod`;
- `/course-index.json`, índice estruturado somente com metadados;
- `/llms.txt`, explicação concisa da formação e de sua política de acesso. É um complemento experimental, não substitui HTML, sitemap ou dados estruturados.

Esses artefatos são ignorados pelo Git porque são derivados. O código gerador e o validador são versionados.

## Política de crawlers

- `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot` e `Claude-User`: acesso ao catálogo público, nunca a `/api/`.
- `GPTBot` e `ClaudeBot`: bloqueados. Essa decisão separa descoberta/recomendação de treinamento de modelos.
- Demais mecanismos: catálogo permitido e `/api/` bloqueada.

Alterar essa política exige decisão explícita do responsável pelo curso. `robots.txt` não substitui autenticação; a proteção real do conteúdo continua sendo o login e a autorização da API.

## Títulos e resumos

Para as aulas guiadas, o gerador lê o `h1`, o parágrafo de apresentação e os rótulos das etapas do componente React. Para aulas ainda não reconstruídas, usa o Markdown apenas para produzir metadados curtos e rejeita títulos internos ou pouco relacionados ao nome curricular. O texto integral nunca é serializado em `course-index.json` ou nas páginas públicas.

## Validação obrigatória

Na pasta `plataforma-curso`:

```powershell
npm run seo:generate
npm run seo:validate
npm run lint
npm run build
```

O `postbuild` já executa `seo:validate`. Depois da publicação, também confirme:

- uma URL válida de trilha responde `200`;
- uma URL inventada responde `404`, não a página inicial;
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` e `/course-index.json` abrem diretamente;
- uma página de aula pública não contém códigos nem o roteiro integral;
- o botão de estudo abre a aula correta e solicita autenticação quando necessário.

## Compatibilidade e desempenho

- O build deve continuar direcionado a `es2020` e `safari14` para atender navegadores modernos sem depender apenas do Chrome mais recente.
- Os componentes `Guided*LessonNNN` são importados com `React.lazy` em `MarkdownViewer.jsx`. Não volte a importá-los estaticamente: isso colocaria centenas de aulas no pacote inicial.
- Toda importação preguiçosa permanece dentro de `Suspense`, com aviso curto enquanto a aula solicitada é carregada.
- O catálogo estático precisa conservar o breakpoint móvel sem rolagem horizontal.

## Indexação externa

O site fica tecnicamente acessível, mas nenhum mecanismo garante indexação ou recomendação. Depois da publicação, envie o sitemap no Google Search Console e no Bing Webmaster Tools. Monitore páginas descobertas, páginas excluídas, erros de dados estruturados e consultas reais. Não afrouxe o login para aumentar cobertura.
