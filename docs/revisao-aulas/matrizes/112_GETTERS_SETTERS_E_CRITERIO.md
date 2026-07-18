# Matriz de cobertura — Aula 112 — Getters, setters e critério

## Fonte auditada

- `docs/aulas/112_M4_08_GETTERS_SETTERS_E_CRITERIO_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Getter, setter e operação | Auditoria interativa de cinco campos | Ler, esconder, perguntar ou proteger |
| Getter com critério | Código, status e detalhe interno comparados | Consumidor legítimo antes do método público |
| Setters livres | Simulador aceita valor negativo e confirmação direta | `setStatus`, `setValor` e `PagamentoComSettersLivres.java` |
| Pagamento protegido | Máquina de estados executável | `PagamentoComCriterio.java` |
| Construtor e invariantes | Código e valor obrigatórios | Estado nasce PENDENTE e válido |
| Estilo JavaBean | Alternância `getNome` / `isAtivo` | Convenção de framework e equipe |
| Métodos diretos e expressivos | `nome`, `ativo`, `podeConfirmar` | Leitura comunica a pergunta feita |
| Setter validado versus ação | Comparador de quatro assinaturas | `alterarEmail` e `inativar(motivo)` |
| Cliente com ações | Simulador e fonte integral | Alteração de contato, inativação e reativação |
| Getter de mutável | Vazamento visual por `itens().clear()` | Cópia, visão segura ou operação controlada |
| Produto sem setters livres | Estoque e ciclo ativo/inativo simulados | `ProdutoSemSettersLivres.java` |
| Quando setter pode ser aceitável | Fronteira em quatro camadas | DTO/framework separado do domínio |
| DTO versus domínio | Programa completo com conversão validada | `DtoVersusDominio.java` |
| Revisão de classe cheia de setters | Seis refatorações selecionáveis | Status, saldo, estoque, ativo e agenda |
| Debug | Mock de IDE com oito pausas | Estado antes, regra, atribuição, exceção e preservação |
| Oito erros comuns | Clínica integral | Sintoma, causa e correção por caso |
| Desafio Ordem de Serviço | Contrato, código, saídas e sete testes | `OrdemServicoSemSettersLivres.java` e `TesteGettersSettersCriterio.java` |
| Registro e Git | Defesa oral, checklist e comandos | Aula 113 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de auditoria da API, defeito executável, máquina de estados, convenções de leitura, ações de domínio, vazamento mutável, fronteira DTO, refatoração, debug, clínica e entrega.

## Decisões pedagógicas

- A aula começa pela decisão de projeto e não pela sintaxe: cada membro público precisa de consumidor ou regra justificável.
- O Pagamento ruim é manipulado antes da correção para provar que compilação não significa consistência de domínio.
- JavaBean e nomes diretos são apresentados como contratos contextuais, sem transformar preferência em dogma.
- O vazamento por getter de coleção é visualizado sem antecipar a API completa de Collections.
- DTO simples e domínio protegido atravessam uma fronteira explícita de conversão e validação.
- Sete fontes usam destaque de sintaxe estilo IDE e são compiladas pelo validador dedicado.

## Artefatos

- `plataforma-curso/src/components/GuidedGettersSettersLesson112.jsx`
- `plataforma-curso/src/components/guidedGettersSettersLesson.css`
- `tools/validate-lesson-112.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: sete fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
