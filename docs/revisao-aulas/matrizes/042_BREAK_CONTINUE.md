# Matriz de cobertura — Aula 042

## Identificação

- Aula original: `docs/aulas/042_M1_22_BREAK_E_CONTINUE_OFICIAL.md`
- Aula anterior: `docs/aulas/041_M1_21_FOR_CLASSICO_OFICIAL.md`
- Aula posterior: `docs/aulas/043_M1_23_LACOS_ANINHADOS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedBreakContinueLesson042.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedBreakContinueLesson.css`
- Arquétipo: oficina de decisões de fluxo com comparador `break` × `continue`, simulador de lote, clínica de loop infinito, galeria de alcance e diagnóstico.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.
- Correção pós-auditoria: roteiro ampliado para sete etapas e cobertura reposta para `break`/`continue` em `while` e `do while`, menu explícito, filtro puro, salto interno e decisões locais/globais em mensageria, auditoria, produto e pagamento.

## Transformação da aula

O aluno começa associando `break` a “parar” e `continue` a “pular”. Termina capaz de classificar falha global versus item local, prever quais itens serão visitados, manter variáveis de controle seguras, reconhecer a estrutura realmente afetada, registrar evidências antes do salto e testar cenários opostos.

## Fronteiras curriculares

- A Aula 041 introduziu o `for` e mostrou `break`/`continue` somente para reconhecimento.
- A Aula 042 aprofunda alcance, decisão, riscos e evidências em `for`, `while`, `do while` e `switch`.
- A Aula 043 explicará laços aninhados; aqui o loop interno aparece apenas para provar que o salto afeta a estrutura mais próxima.
- Labels são reconhecidas como existentes, mas não ensinadas como solução inicial.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Conceito de `break` e `continue` | Comparador “Parar ou pular” | A mesma condição em 3 produz `1,2` ou `1,2,4,5`. |
| `break` encerra loop, não programa | Dois programas mínimos | `Fim do programa` aparece após a interrupção. |
| `continue` pula a iteração atual | Comparador e `ContinueMinimo.java` | O 3 não aparece, mas 4 e 5 são processados. |
| Diferença item inválido × erro crítico | Simulador de lote | Válidos são processados, inválido 2 é ignorado e crítico 4 torna 5/6 não visitados. |
| `break`/`continue` em `for` | Programas mínimos, galeria e lote | Saídas completas e estados por item. |
| `break`/`continue` em `while` | Clínica interativa da variável de controle | Rastro `1,2,3,3,3,∞` muda para `1,2,3 pula,4,5,fim`. |
| `break`/`continue` em `do while` | Galeria “do while: dois saltos” + nota | A atualização anterior ao salto, o teste final e a interrupção imediata são explicitados. |
| Risco de `continue` antes do incremento | Clínica dedicada e erro 3 | Loop infinito reproduzido conceitualmente e correção comparável. |
| `continue` no `for` ainda executa atualização | Etapa da armadilha | Contraste com a responsabilidade manual do `while`. |
| `break` em switch × loop | Galeria “switch dentro do for” e erro 6 | “Fim da iteração” aparece três vezes; o `for` continua. |
| Busca com parada antecipada | Galeria “Busca e parada” | Pedido 7 encerra a busca e a flag final fica `true`. |
| Item cancelado/inválido | Galeria e simulador | Contadores separados de processados e ignorados. |
| Lote, mensageria e pagamento com falha global | Galeria “Falha crítica” | Cinco envios, indisponibilidade registrada e interrupção. |
| Continue como filtro | Galeria “Filtro com continue” | Somente pares são impressos; alternativa com `if` positivo é discutida. |
| Scanner, sentinela 999 e negativo | Galeria “Scanner: 999 e negativo” | Entradas 10, -2, 20, 999 geram total 30 e um ignorado. |
| Ordem entre condições | Galeria e evidências | Sentinela crítica é avaliada antes do filtro local. |
| `while (true)` com `break` e condição explícita | Clínica e notas de projeto | A aula prioriza condição visível quando ela já é conhecida. |
| `break`/`continue` em loop interno | Galeria “Loop interno” | A saída compara interrupção do interno com salto apenas da coluna 2. |
| Labels | Nota de fronteira | Existência reconhecida; variável/condição clara é preferida nesta fase. |
| Break escondendo condição ruim | Clínica, caso 4 | `i <= 100` + `i > 5` é simplificado para `i <= 5`. |
| Continue reduzindo ou piorando aninhamento | Galeria de filtro e clínica, casos 5/9 | A escolha é avaliada pela leitura, não pelo uso obrigatório da palavra-chave. |
| Dez erros comuns | Clínica com dez diagnósticos | Código, sintoma, causa e recuperação em cada caso. |
| Debug de 1 a 5 | Comparador visual | Itens visitados, pulados e não visitados ficam explícitos. |
| Atividade, terminal, diário e commit | Entrega em quatro estágios | Comandos, saídas, cenários, staged diff e proteção contra `.class`. |
| Critério de conclusão | Evidências copiáveis e desafio | Gate por etapas, conclusão única e próxima aula bloqueada. |

## Repetições consolidadas sem perda de conteúdo

- Pedidos, registros, produtos, pagamentos, auditoria e mensageria foram agrupados por semântica: item local ignorável ou falha global bloqueante.
- `break` e `continue` nos três tipos de loop são apresentados por um caso principal e uma galeria comparativa, evitando repetir a definição.
- Os dez erros permanecem separados porque cada um exige decisão ou recuperação diferente.
- Os exemplos de loop interno e switch preservam a regra de “estrutura mais próxima” sem antecipar a aula inteira de aninhamento.

## Saídas, precisão e segurança

- A simulação distingue processados, ignorados e não visitados por texto e estado, não apenas por cor.
- O loop infinito perigoso é mostrado como rastro didático; a entrega só recomenda reprodução com conhecimento de `Ctrl+C`.
- A aula não ensina `break` como substituto universal de condição nem `continue` como estilo obrigatório.
- Toda interrupção profissional exige causa observável; todo descarte exige contagem ou registro.
- As saídas dos exemplos mínimos preservam `Fim do programa`, provando o alcance correto.

## Responsividade e padrão compartilhado

- A raiz mantém `overflow: visible` e não sobrescreve `.guided-step-nav`.
- Comparador, lote, clínica, galeria, terminal e entrega usam grids encolhíveis e reorganização em 1024, 760 e 520 px.
- Código e terminal limitam overflow ao painel interno.
- A seleção usa o âncora exato de `.guided-layout`; o roteiro móvel continua centralizado pelo componente compartilhado.
- Persistência, normalização, marcar/desmarcar etapa, conclusão única e bloqueio da próxima aula seguem o blueprint.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 042 e documentos atualizados
- Integração pelo prefixo exato `042_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; inspeção visual e aprovação explícita ainda são necessárias.
