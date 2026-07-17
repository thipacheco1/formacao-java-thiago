# Matriz de cobertura — Aula 038

## Identificação

- Aula original: `docs/aulas/038_M1_18_SWITCH_MODERNO_E_EXPRESSOES_OFICIAL.md`
- Aula anterior: `docs/aulas/037_M1_17_SWITCH_TRADICIONAL_OFICIAL.md`
- Aula posterior: `docs/aulas/039_M1_19_WHILE_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedSwitchModernoLesson038.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedSwitchModernoLesson.css`
- Arquétipo: oficina de expressões de valor com comparador side-by-side (tradicional vs moderno), simulador de switch expression, demonstrador de yield e clínica de erros
- Estado: em_revisao

## Fronteiras curriculares

- A Aula 037 ensinou o switch tradicional com `:`, `break`, e o perigo de fall-through. A Aula 038 apresenta o switch moderno com a arrow syntax (`->`), o switch expression (retorno de valor) e o `yield`.
- A Aula 039 apresentará o `while`. Loops não são abordados nesta aula.
- `enum` e pattern matching são apenas sugeridos como evolução futura, sem serem ensinados agora.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Switch statement vs switch expression (a grande mudança mental) | Comparador Side-by-Side | Dois painéis sincronizados mostrando o mesmo código em modo tradicional e moderno. |
| Arrow syntax (`->`) eliminando fall-through | Comparador Side-by-Side | Destaque visual da remoção do break e sua substituição pela seta. |
| Switch expression retornando String, int | Simulador de Expressão de Valor | Input de valor e resultado atribuído a uma variável exibido no console. |
| Múltiplos valores no mesmo case (case "A", "B" ->) | Simulador de Agrupamento | Perfis ADMIN, SUPERVISOR, OPERADOR e CLIENTE agrupados com vírgula. |
| yield para case com bloco | Demonstrador de Yield | Painel com caso simples vs bloco com yield, mostrando por que o yield é necessário. |
| Ponto e vírgula final em atribuição | Galeria de Sintaxe | Destaque do `};` com explicação contextualizada. |
| Exemplos corporativos: Pedido, OS, Auditoria, Mensageria, Perfil, Prioridade, SLA | Galeria de Domínios | 7 programas navegáveis com código e console de simulação. |
| Scanner com trim().toUpperCase() | Galeria de Domínios | SwitchModernoStatusConsole demonstrando normalização. |
| Perigo de null | Galeria de Domínios | SwitchModernoNull com validação prévia de null via if. |
| Clínica de 10 Erros | Clínica de Erros (10 abas) | Diagnóstico e correção dos erros clássicos do switch moderno. |
| Enum e exhaustividade como visão de futuro | Nota de evolução no topo | Alerta informativo sobre a evolução natural para enum após esta aula. |
| Atividade prática local e commits | Terminal de Entrega e Diário | PowerShell para criação de 14 arquivos Java e commit Git limpo. |
| Critérios de Conclusão | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 14 programas locais foram agrupados em 7 domínios na galeria, eliminando repetições conceituais.
- O comparador side-by-side unifica a explicação de statement vs expression num único painel interativo.

## Lacunas resolvidas

- A visão de "o switch produce valor" é demonstrada com um simulador em tempo real que mostra a variável sendo preenchida pelo resultado do switch.
- A confusão entre `yield` e `return` é endereçada diretamente no demonstrador de yield com uma nota comparativa.
