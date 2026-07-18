# Matriz de cobertura — Aula 043

## Identificação

- Aula original: `docs/aulas/043_M1_23_LACOS_ANINHADOS_OFICIAL.md`
- Aula anterior: `docs/aulas/042_M1_22_BREAK_E_CONTINUE_OFICIAL.md`
- Aula posterior: `docs/aulas/044_M1_24_VALIDACAO_DE_ENTRADA_SEM_TRY_CATCH_PROFUNDO_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedNestedLoopsLesson043.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedNestedLoopsLesson.css`
- Arquétipo: oficina de repetição em níveis com grade passo a passo, simulador de custo multiplicativo, laboratório de escopo, galeria hierárquica e clínica de erros.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.
- Correção pós-auditoria: roteiro ampliado para sete etapas; clínica e entrega foram separadas. Foram repostos parada externa com flag executável, agenda, formas/parcelas e relatório cliente/pedido/item com acumuladores por nível.

## Transformação da aula

O aluno começa vendo “um `for` dentro de outro”. Termina capaz de narrar qual nível controla cada estado, provar que o interno reinicia, calcular o trabalho antes de executar, posicionar acumuladores pelo tempo de vida, prever o alcance de saltos e reconhecer quando a hierarquia já pede reorganização.

## Fronteiras curriculares

- A Aula 042 aprofundou `break` e `continue`; a 043 aplica o alcance no loop interno.
- A Aula 043 usa grades conceituais, mas ainda não ensina arrays ou matrizes reais.
- A Aula 044 passa para validação lógica de entrada; não é antecipada aqui.
- Labels, extração de métodos e N+1 são reconhecidos como fronteiras futuras, não tratados em profundidade.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Conceito de laço aninhado | Grade passo a passo e primeiro programa | Linha externa e coluna interna aparecem simultaneamente. |
| Loop externo e interno | Grade e estado lateral | Rótulos mostram `linha` e `coluna` em cada execução. |
| Interno reinicia a cada externo | Grade passo a passo | Ao passar de `[1,3]` para `[2,1]`, a coluna volta para 1. |
| Multiplicação de iterações | Simulador de custo | Limites ajustáveis produzem `X × Y`, de 1 até 10.000 execuções. |
| Primeiro programa 3 × 3, `javac` e `java` | Laboratório `Main.java` | Nove combinações ordenadas e `Fim do programa`. |
| Matriz conceitual | Grade visual | A aula declara explicitamente que ainda não existe array bidimensional. |
| `print` versus `println` | Galeria “Grade e print” e clínica | Três linhas de quatro células; erro sem quebra gera uma linha única. |
| Tabuada aninhada | Galeria “Tabuada” | Para cada número, multiplicador 1..10 reinicia. |
| Categorias/produtos e clientes/pedidos | Galeria “Cliente e pedidos” | Hierarquia externa/interna com nomes de domínio. |
| Pedidos/itens e acumulador por pedido | Galeria + laboratório de escopo | Total do pedido reinicia; total geral sobrevive. |
| Total por pedido, cliente e geral | Laboratório e desafio de transferência | Declarações são posicionadas no nível de vida correspondente. |
| OS, atividades e checklist com três níveis | Galeria “OS e checklist” | 2 × 2 × 3 = 12 execuções e alerta de complexidade. |
| Páginas/itens | Galeria “Página e itens” | Três páginas, cada uma reiniciando itens 1..4. |
| Mensagens/tentativas e sucesso antecipado | Galeria “Mensagem e tentativas” | `break` encerra tentativa 2, mas todas as mensagens avançam. |
| `break` no loop interno | Simulador de saltos | Cada externo mantém somente interno 1 antes de interromper o interno. |
| `continue` no loop interno | Simulador de saltos | Internos 1 e 3 executam; somente 2 é pulado. |
| Parada externa com boolean | Galeria “Parada externa com flag”, nota e clínica | Falha em `2/3` encerra o interno e impede o lote externo 3 de iniciar. |
| Labels | Nota de fronteira | Existência reconhecida, uso não recomendado nesta fase. |
| Menu e submenu | Galeria específica | Fluxo principal → submenu → voltar → principal → sair. |
| Clientes/pedidos/itens e relatório de três níveis | Galeria, escopo e desafio | Hierarquia e acumuladores por nível são transferidos para centro/ordem/atividade. |
| Perfil/funcionalidade, agenda e combinações | Galeria “Permissões e agenda” | O padrão “para cada X, vários Y” é aplicado a grades de domínio. |
| Complexidade e escala | Simulador e nota de backend | 100 × 100 = 10.000; alerta de consulta interna/N+1 sem antecipar banco. |
| Indentação e nomes dos contadores | Galeria e clínica | Nomes `cliente`, `pedido`, `item` substituem `i`, `j`, `k` em domínio. |
| Não reutilizar contador | Clínica, caso 9 | Mensagem `variable i is already defined` e correção. |
| Dez erros comuns | Clínica com dez diagnósticos | Código, sintoma, causa e recuperação para nível, custo, escopo e saída. |
| Debug de 2 × 3 | Grade passo a passo | Ordem e reinício podem ser acompanhados sem ferramenta externa. |
| Atividade, diário e commit | Entrega em quatro estágios | Criação, compilação, prova de custo/alcance, staged diff e `.class` fora do commit. |
| Critério de conclusão | Checklist e desafio | Progresso por etapas, conclusão única e bloqueio da Aula 044. |

## Repetições consolidadas sem perda de conteúdo

- Categorias/produtos, clientes/pedidos, OS/atividades e páginas/itens compartilham a mesma hierarquia de dois níveis e foram organizados em galeria sem apagar os nomes de domínio.
- Relatórios de pedido/cliente/geral foram concentrados no laboratório de escopo e no desafio de três níveis.
- Permissões, agenda e formas de pagamento foram agrupadas como grades de combinações.
- `break` e `continue` internos usam um comparador único que preserva os dois comportamentos e prepara a leitura da saída.

## Saídas, precisão e segurança

- A grade é modelo conceitual de combinações; não afirma armazenamento em matriz, Stack ou Heap.
- O simulador de custo usa multiplicação real dos limites e não apresenta pontuação qualitativa inventada.
- O alerta de N+1 é explicitamente futuro; não ensina que todo laço aninhado é um problema.
- Acumuladores em centavos usam `long` e possuem tempo de vida observável.
- Labels não são normalizadas como solução inicial para fluxos complexos.

## Responsividade e padrão compartilhado

- A raiz mantém `overflow: visible` e não sobrescreve `.guided-step-nav`.
- Grade, terminais, escopo, controles, galeria, clínica e entrega usam grids encolhíveis e reorganização em 1024, 760 e 520 px.
- Código e terminal limitam o próprio overflow; a página não cria rolagem horizontal.
- A troca de etapa usa o âncora exato de `.guided-layout`; centralização móvel permanece compartilhada.
- Persistência, normalização de estado, conclusão de etapas/aula e bloqueio da próxima aula seguem o blueprint.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 043 e documentos atualizados
- Integração pelo prefixo exato `043_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; inspeção visual e aprovação explícita ainda são necessárias.
