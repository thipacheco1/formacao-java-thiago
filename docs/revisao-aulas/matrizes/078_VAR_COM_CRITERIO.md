# Matriz de cobertura — Aula 078 — Var com critério

Fonte integral analisada: docs/aulas/078_M2_17_VAR_COM_CRITERIO_OFICIAL.md.

Implementação: GuidedVarCriteriaLesson078.jsx e guidedVarCriteriaLesson.css.

## Cobertura do conteúdo original

| Conteúdo exigido | Onde foi reconstruído | Evidência didática |
|---|---|---|
| Inferência local e var não dinâmico | Etapa 1 | Lente do compilador com cinco expressões |
| Tipo fixo e mudança incompatível | Etapas 1 e 8 | Código de erro e clínica |
| Onde var pode e não pode ser usado | Etapa 2 | Mapa de dez contextos permitidos/bloqueados |
| Sem inicialização e null | Etapas 2 e 8 | Estados que não compilam e correções |
| Primitivos, sufixos e wrappers | Etapa 3 | Seletor de seis literais e tipo inferido |
| BigDecimal, record, enum, LocalDate e Instant | Etapas 3 e 9 | Código destacado e programa integrado |
| For, for-each e try-with-resources | Etapas 2, 5 e 9 | Contexto visual, exemplos e execução |
| Retorno de método claro ou ambíguo | Etapa 4 | Laboratório de seis decisões de leitura |
| Nomes de variável e método | Etapas 4 e 6 | Vereditos e refatorações antes/depois |
| Generics, interface e diamond | Etapa 5 | Comparador List, ArrayList<String> e ArrayList<Object> |
| Legibilidade versus economia de caracteres | Etapas 4 e 6 | Critério explícito e refatorações |
| Cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Etapa 7 | Galeria de sete domínios |
| Dez erros comuns | Etapa 8 | Clínica navegável |
| Debug do tipo inferido | Etapa 9 | Breakpoint em BigDecimal e quatro observações |
| Atividade, comandos, evidências, desafio e Git | Etapa 9 | Programa, terminal, checklist e desafio |

## Decisões de reconstrução

- var foi ensinado como decisão de leitura, não como economia de digitação.
- Contextos válidos e inválidos receberam um mapa único para evitar regras soltas.
- A interface List e o tipo concreto ArrayList foram comparados visualmente.
- Chamadas de método foram julgadas pelo contexto disponível ao leitor.
- O programa integrado cobre primitivos, tipos profissionais, loops, recurso e generics.
- Navegação, clínica e visuais permanecem responsivos até 320 px.

Cobertura: 100%.

Pendente: inspeção visual do usuário e aprovação explícita.
