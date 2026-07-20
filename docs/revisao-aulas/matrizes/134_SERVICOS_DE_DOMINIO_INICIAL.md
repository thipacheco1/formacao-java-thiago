# Matriz de cobertura — Aula 134 — Serviços de domínio inicial

## Fontes auditadas

- `docs/aulas/134_M4_30_SERVICOS_DE_DOMINIO_INICIAL_OFICIAL.md`
- Aula anterior: invariantes permanecem nos objetos que precisam protegê-las.
- Fronteira seguinte: `135_M4_31_FACTORIES_SIMPLES_OFICIAL.md` cuida de criação; esta aula não usa factory como solução para posicionamento de regras.

## Promessa pedagógica

O aluno deve conseguir olhar para uma regra e escolher seu dono com critério: comportamento natural permanece na entidade, regra de um valor fica no value object, operação pura entre vários conceitos pode virar serviço de domínio e coordenação com banco, HTTP ou mensagens permanece fora do domínio.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Definição e critérios | Mapa visual de pertencimento e teste das três perguntas | Etapa 1 |
| Service gigante não é serviço de domínio | Autópsia interativa de `PedidoServiceRuim` | Etapa 2 |
| Regra natural na entidade | Comparação executável `service.confirmarPagamento` versus `pedido.confirmarPagamento` | Etapa 3 |
| Entidade, value object, domínio, aplicação e infraestrutura | Roteador de sete regras com justificativa | Etapa 4 |
| Política de desconto | Cliente + Pedido + `PoliticaDescontoPedido`, percentuais e saída | Etapa 5 |
| Responsabilidades no fluxo | Diagrama temporal App → Política → Pedido → Dinheiro | Etapa 6 |
| Alocação de técnico | OS, Técnico, agenda existente, conflito e política executável | Etapa 7 |
| Pureza, foco, nomes e ausência de estado | Scanner de dependências e oficina de nomes | Etapa 8 |
| Serviço de domínio versus aplicação | Faixas explícitas de regra pura e coordenação externa | Etapas 4 e 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas e stack entre participantes | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, consequência e correção | Etapa 10 |
| Desafio elegibilidade de reagendamento | Resultado explícito, política pura, entidade ainda protegida e testes | Etapa 11 |

## Decisões pedagógicas

1. A pergunta “a regra cabe na entidade?” vem antes de “qual service criar?”.
2. `PoliticaDescontoPedido` calcula; `Pedido` aplica e protege desconto e pagamento; o App organiza a sequência.
3. `PoliticaAlocacaoTecnico` conhece o conflito entre várias ordens, mas `OrdemServico` continua protegendo atribuição e reagendamento.
4. Banco e APIs não são demonizados: são apenas responsabilidades externas ao serviço de domínio puro desta etapa do curso.
5. “Stateless” é demonstrado como ausência de estado mutável entre chamadas, não como obrigação de usar métodos `static`.
6. O desafio devolve `ResultadoElegibilidade` para distinguir uma decisão de negócio esperada de uma falha técnica.
7. Factories não são antecipadas; a Aula 135 começa exatamente onde a criação passa a merecer um nome próprio.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 21 fontes Java compiladas em conjunto.
- 6 execuções reais; suíte final imprime `10 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, diagramas de responsabilidade, simuladores e mock de IDE.
- Responsividade e foco automático da etapa no mobile.
- Integração `React.lazy` para `134_`.
- Lint, build, validador e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
