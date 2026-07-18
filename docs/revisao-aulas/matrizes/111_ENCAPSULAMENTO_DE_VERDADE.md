# Matriz de cobertura — Aula 111 — Encapsulamento de verdade

## Fonte auditada

- `docs/aulas/111_M4_07_ENCAPSULAMENTO_DE_VERDADE_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Encapsulamento além de `private` | Comparador interativo em quatro níveis | `public` → setter livre → operação → API mínima |
| Conta com campos públicos | Programa completo, execução e saldo inválido | `ContaSemEncapsulamento.java` |
| Primeiro passo com atributos privados | Contraste executável sem mutação externa | `ContaComAtributosPrivados.java` |
| Conta responsável pelo saldo | Simulador de depósito e saque com três saídas | `ContaEncapsulada.java` |
| Getters e setters com critério | Auditoria de seis membros da API | Expor, esconder, recusar, substituir ou manter fora |
| Estado consistente | Valor positivo, saldo suficiente e invariante | Exceção, `false` e sucesso diferenciados |
| Ordem de serviço | Máquina visual de estados | Reagendar altera data, contador e status juntos |
| Transições inválidas | Conclusão e cancelamento protegidos | `OrdemServicoEncapsulada.java` |
| Pagamento encapsulado | Simulador PENDENTE → APROVADO → CONFIRMADO | `PagamentoEncapsulado.java` |
| `final` e mutação protegida | Classificador de identidade, valor, status e estoque | Imutabilidade não é confundida com encapsulamento |
| Método privado e auxiliares | Política de detalhe interno | Auxiliares fora da API pública |
| Regra centralizada | Diagrama Conta / OS / Pagamento | Uma porta de mudança, manutenção e teste |
| Debug | Mock de IDE em oito pausas | Antes, validação, depois, `false` e exceção |
| Oito erros comuns | Clínica integral | Sintoma, causa e correção por caso |
| Desafio Produto | Contrato antes do código, fonte e testes | `ProdutoEncapsulado.java` e `TesteEncapsulamento.java` |
| Evidências e Git | Terminal, checklist e defesa oral | Aula 112 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de níveis de proteção, conta executável, desenho de API, máquinas de estado, política de mutabilidade, centralização, debug, clínica e entrega.

## Decisões pedagógicas

- `private` é apresentado como mecanismo necessário, mas insuficiente: a aprendizagem termina em operações com intenção de domínio.
- O aluno provoca saldo inválido antes de comparar a correção, observando saída real e erro de compilação esperado.
- Retorno `false` e exceção têm papéis distintos e aparecem com o saldo preservado.
- Máquinas de estado tornam visíveis as transições aceitas e recusadas de ordem de serviço e pagamento.
- A API é auditada membro a membro; gerar getters e setters automaticamente deixa de ser uma regra.
- Sete fontes usam destaque de sintaxe estilo IDE e são compiladas pelo validador dedicado.

## Artefatos

- `plataforma-curso/src/components/GuidedTrueEncapsulationLesson111.jsx`
- `plataforma-curso/src/components/guidedTrueEncapsulationLesson.css`
- `tools/validate-lesson-111.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: sete fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
