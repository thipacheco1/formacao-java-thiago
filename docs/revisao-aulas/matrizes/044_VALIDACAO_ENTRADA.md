# Matriz de cobertura — Aula 044

## Identificação

- Aula original: `docs/aulas/044_M1_24_VALIDACAO_DE_ENTRADA_SEM_TRY_CATCH_PROFUNDO_OFICIAL.md`
- Aula anterior: `docs/aulas/043_M1_23_LACOS_ANINHADOS_OFICIAL.md`
- Aula posterior: `docs/aulas/045_M1_25_ARRAYS_DE_NUMEROS_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedInputValidationLesson044.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedInputValidationLesson.css`
- Arquétipo: oficina de proteção de entrada com pipeline interativo, comparador lógico/técnico, console de tentativas, simulador de Scanner, galeria de regras e clínica de erros.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.
- Correção pós-auditoria: roteiro ampliado para sete etapas; clínica e entrega foram separadas. Foram repostos comparador completo `if`/`while`/`do while`, menu com boolean, processamento por `switch` depois da validação e auditoria com regra própria.

## Transformação da aula

O aluno começa apenas lendo um valor do `Scanner`. Termina capaz de estabelecer o contrato, normalizar, bloquear entradas logicamente inválidas, pedir correção, limitar tentativas quando necessário, orientar por mensagens e garantir que efeitos só ocorram depois da validação — sem prometer tratamento técnico ainda não ensinado.

## Fronteiras curriculares

- A Aula 043 encerrou o ciclo de laços básicos; a 044 combina `if`, `while`, `do while`, booleanos, String e Scanner para proteger o fluxo.
- A Aula 044 trata valores lidos no tipo esperado que violam regras lógicas.
- Texto enviado a `nextInt()` e `InputMismatchException` são reconhecidos como erro técnico, mas `try/catch` fica para o módulo de exceções.
- A Aula 045 introduzirá arrays numéricos; não é antecipada aqui.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Conceito de validação de entrada | Pipeline interativo | Entrada só chega a “Processar” após normalização e regra válida. |
| Fluxo ler → validar → processar | Pipeline e desafio | Quatro estágios visíveis e gate de processamento. |
| Validação lógica × erro técnico | Comparador dedicado | `0`/`-3` são inteiros inválidos; `abc` falha antes da regra. |
| Razão para não aprofundar try/catch | Nota de escopo e clínica, caso 10 | Limitação do `nextInt()` é explicitamente registrada. |
| Validação com `if` | Clínica e galeria | Fica claro que informar erro sem bloquear não protege o fluxo. |
| Validação com `while` e `do while` | Console guiado, galeria comparativa e nota | Sequência -1, 0 e 5 repete; cada estrutura mostra onde a primeira leitura acontece. |
| Nova leitura dentro do loop | Console e clínica, caso 2 | Ausência da releitura gera loop infinito diagnosticável. |
| Mensagem clara | Pipeline, notas e clínica | Campo, regra e correção substituem “Erro”. |
| Faixa numérica e prioridade | Galeria “Faixa e menu” | 0/4 bloqueiam; 2 é aceito. |
| Opção de menu e boolean nomeado | Galeria “Menu com boolean” | 3 bloqueia; 2 e 0 são aceitos; loop lê `!opcaoValida`. |
| Nome obrigatório, `trim()` e `isBlank()` | Galeria “Nome obrigatório” | Espaços são bloqueados; `"  Maria  "` vira `"Maria"`. |
| E-mail simples com `contains("@")` | Simulador de múltiplos campos | Dois erros ou apenas o primeiro; limite didático explicitado. |
| Status, `toUpperCase()` e `equals()` | Pipeline e galeria “Status conhecido” | `" aprovado "` vira `APROVADO`; `ABC` é bloqueado. |
| Switch depois da validação | Galeria “Status e switch” | Entrada normalizada e validada libera a expressão; `default` continua como proteção adicional. |
| Senha mínima e CPF por tamanho | Galeria específica | Casos de teste deixam claro que são validações didáticas incompletas. |
| Valor monetário em centavos | Galeria “Pedido e pagamento” | Valor positivo e parcelas 1..12 protegem a divisão. |
| Pedido validado e proteção inicial | Galeria + desafio | Cálculo só ocorre após quantidade/valor válidos. |
| Produto e estoque | Galeria “Produto e estoque” | Estoque 0 é válido; negativo é bloqueado. |
| Cliente, OS, mensageria e auditoria | Simulador, galerias de domínio e desafio | Cada domínio possui regra, fronteira e evidência; auditoria aceita zero e bloqueia negativo. |
| Pagamento e divisão por zero | Galeria “Pedido e pagamento” | Parcelas 0/13 bloqueadas; 12000/12 resulta em 1000. |
| `nextInt()` seguido de `nextLine()` | Simulador de teclas/linha | Sem consumo intermediário, nome recebe `""`; com ele, recebe `"Ana"`. |
| Limite de tentativas | Galeria “Tentativas limitadas” | Sucesso na terceira tentativa e bloqueio após três falhas. |
| Boolean `possuiErro` e múltiplos campos | Simulador e galeria “Todos os erros” | Estratégia todos versus primeiro erro é comparável. |
| Não misturar validação e efeito | Pipeline e nota “Proteção inicial” | Processar permanece bloqueado até estado válido. |
| Entrada externa não confiável | Narrativa e desafio | Regra é aplicada independentemente da origem futura do dado. |
| Dez erros comuns | Clínica com dez casos | Código, sintoma, causa e recuperação. |
| Debug -1, 0, 5 | Console guiado | Cada tentativa e sua transição são visíveis. |
| Atividade, diário e commit | Entrega em quatro estágios | Criação, compilação, testes de fronteira, staged diff e `.class` protegido. |
| Critério de conclusão | Checklist e desafio de OS | Conclusão por etapas, conclusão única e próxima aula bloqueada. |

## Repetições consolidadas sem perda de conteúdo

- Pedido, produto, cliente, OS, mensageria, auditoria e pagamento foram organizados por família de regra: texto obrigatório, faixa, enumeração textual, valor positivo e tentativas.
- `while` e `do while` compartilham um console de tentativas e uma nota que ensina o critério de escolha.
- Nome, e-mail e conjunto de campos são tratados no simulador de estratégias e na galeria, sem repetir o mesmo ciclo de leitura.
- Os dez erros permanecem individualizados por exigirem recuperações diferentes.

## Saídas, precisão e segurança

- O comparador não afirma que regex substitui o `Scanner`; ele apenas visualiza a fronteira conceitual.
- `contains("@")`, tamanho de CPF e telefone mínimo são marcados como validações didáticas, não profissionais.
- `==` para String é corrigido com o contrato observável: identidade versus conteúdo por `equals()`.
- A aula não promete capturar texto recebido por `nextInt()`; a limitação técnica fica visível.
- Valores monetários permanecem em `long` e centavos.

## Responsividade e padrão compartilhado

- A raiz mantém `overflow: visible` e não sobrescreve `.guided-step-nav`.
- Pipeline, comparadores, Scanner, formulários, terminal, galeria, clínica e entrega reorganizam em 1024, 760 e 520 px.
- Código e terminal contêm seu overflow; a página não depende de rolagem horizontal.
- Troca de etapa usa o âncora exato de `.guided-layout`; centralização móvel segue compartilhada.
- Persistência, normalização, conclusão por etapa/aula e bloqueio da Aula 045 seguem o blueprint.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 044 e documentos atualizados
- Integração pelo prefixo exato `044_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; inspeção visual e aprovação explícita ainda são necessárias.
