# Matriz de reconstrução — Aula 115 — Relacionamento entre objetos

## Fonte auditada

- `docs/aulas/115_M4_11_RELACIONAMENTO_ENTRE_OBJETOS_OFICIAL.md`
- Conteúdo preservado: composição, dependência por parâmetro, colaboração, delegação, acoplamento, Lei de Demeter, Pedido, Ordem de Serviço, Mensagem, atividade guiada, debug, oito erros comuns, desafio de Contrato, testes e Git.

## Transformação pedagógica

| Intenção da fonte | Experiência reconstruída | Evidência exigida |
| --- | --- | --- |
| Distinguir formas de relacionamento | Mapa interativo entre “tem”, “usa” e “pergunta” | Explicar ciclo de vida e dono da regra |
| Evitar objeto principal fazendo tudo | Comparador visual entre centralização e delegação | Defender por que Pedido coordena sem validar tudo |
| Praticar Pedido colaborativo | Simulador de cliente, status, valor e cupom + programa completo | Prever quatro chamadas e conferir total/desconto |
| Diferenciar atributo e parâmetro | Classificador com seis situações reais | Responder se o colaborador precisa permanecer no estado |
| Controlar acoplamento | Comparador de cadeia longa, detalhe textual e comportamento | Refatorar usando intenção e Lei de Demeter |
| Modelar Ordem de Serviço | Árvore visual, cenários e versão reagendada | Demonstrar que a OS original permanece igual |
| Modelar Mensagem | Fluxo Destinatário → Conteúdo → Mensagem | Bloquear envio por contato, conteúdo ou estado |
| Executar atividade guiada | Sete perturbações com hipótese e objeto responsável | Mudar uma variável e justificar a saída |
| Entender colaboração em execução | Mock de debugger com nove chamadas | Seguir call stack de Pedido até Cupom |
| Corrigir erros comuns | Clínica interativa com oito diagnósticos | Explicar sintoma e correção de cada caso |
| Resolver desafio | Contrato completo, oito testes, checklist e Git | Compilar cinco fontes em conjunto e registrar evidências |

## Arquivos executáveis

1. `RelacionamentoPedido.java`: composição entre Pedido, Cliente, Item e Pagamento; Cupom como dependência por parâmetro.
2. `RelacionamentoOrdemServico.java`: colaboração distribuída e reagendamento imutável.
3. `RelacionamentoMensagem.java`: Destinatário e Conteúdo respondem; Mensagem coordena o envio.
4. `RelacionamentoContrato.java`: Cliente corporativo, Serviço, Vigência e Pagamento compõem ativação e valor total.
5. `TesteRelacionamentos.java`: oito verificações de decisão, validação e preservação do original.

## Cobertura de profundidade

- O relacionamento não é reduzido a um diagrama: cada vínculo aparece em estado, assinatura, chamada e saída.
- Composição e parâmetro são comparados pelo ciclo de vida, não apenas por definição.
- Delegação mantém a responsabilidade geral no coordenador e posiciona regras locais junto aos dados.
- Acoplamento é tratado como inevitável e controlável, com contraste entre comportamento de alto nível e navegação interna.
- `BigDecimal`, `LocalDate`, `record` e `enum` aparecem em programas que compilam e executam.
- A clínica preserva os oito erros da fonte, incluindo `null`, tipos fracos, atributos excessivos e cadeias longas.

## Critério de aceite técnico

- 11 etapas com conclusão reversível e avanço bloqueado até concluir a etapa atual.
- Foco móvel acompanha a etapa ativa; seleção reposiciona no início do roteiro.
- CSS responsivo em 900, 680, 520, 380 e 320 px.
- Navegação anterior 114 e próxima 116 bloqueada até a conclusão real.
- Cinco fontes compiladas em conjunto, quatro programas executados e oito testes aprovados.
- Lint, build, validador específico e `git diff --check` sem erro impeditivo.

## Estado editorial

- Implementada e validada automaticamente em 2026-07-18.
- Inspeção visual e aprovação explícita do responsável pelo curso permanecem pendentes.
