# Matriz de cobertura — Aula 140 — Limites de responsabilidade do domínio

## Fontes auditadas

- `docs/aulas/140_M4_36_LIMITES_DE_RESPONSABILIDADE_DO_DOMINIO_OFICIAL.md`, lida integralmente.
- Aula anterior: a Aula 139 estabeleceu a raiz do agregado como fronteira de consistência.
- Fronteira seguinte: a Aula 141 fará a revisão prática de OO e domínio; esta aula precisa entregar a separação domínio/aplicação/infraestrutura já executável.

## Promessa pedagógica

O aluno deve conseguir olhar para uma responsabilidade, justificar em qual camada ela pertence e implementar um fluxo no qual o domínio protege a regra, a aplicação coordena a sequência e a infraestrutura realiza efeitos externos — sem transformar a entidade em objeto anêmico.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Entidade misturando regra, SQL, HTTP e mensagem | Autópsia visual e programa executável de `PedidoMisturado` | Etapa 1 |
| O que pertence e não pertence ao domínio | Classificador interativo com justificativa, incluindo DTO, controller, JSON, data, exceção e log | Etapa 2 |
| Domínio forte não é domínio acoplado | Mapa visual das três camadas e direção das dependências | Etapa 3 |
| Pedido puro | `Pedido` protege pagamento e cancelamento sem conhecer tecnologia | Etapa 4 |
| Aplicação coordena; infraestrutura executa | `ConfirmarPagamentoPedidoUseCase`, repositório e notificador com ordem observável | Etapa 5 |
| Ordem de Serviço separada | Reagendamento na entidade, persistência e notificação fora dela | Etapa 6 |
| Contrato separado | Serviços, total e ativação no domínio; efeitos externos nas bordas | Etapa 7 |
| Casos especiais e equilíbrio | Data/hora, exceções, logs, resumo, DTO/JSON, eventos e risco de abstração prematura | Etapa 8 |
| Debug recomendado | Mock de IntelliJ seguindo regra, coordenação, persistência e notificação | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, causa, efeito e correção | Etapa 10 |
| Desafio Pagamento | Domínio, dois casos de uso, repositório, notificador, app e testes | Etapa 11 |

## Decisões pedagógicas

1. O exemplo ruim é executável, mas seus efeitos são simulados e nomeados; nenhuma conexão externa real é necessária.
2. A pergunta de classificação não é “qual pacote parece certo?”, e sim “quem decide a regra e quem executa o detalhe?”.
3. O caso de uso não valida transições que pertencem naturalmente à entidade; ele ordena domínio, persistência e notificação.
4. As implementações de infraestrutura dependem do domínio. O domínio não importa infraestrutura.
5. `resumo()` é tolerado como representação humana simples; `toJson()`, HTML e resposta HTTP são mantidos fora.
6. Tempo e exceções são analisados pelo papel que exercem: regra crítica deve receber tempo controlado; exceção de negócio pode nascer no domínio.
7. O desafio original de Pagamento deixa de ser apenas enunciado e vira entrega completa com confirmação, estorno e cenários de bloqueio.
8. A separação é proporcional: o aluno aprende o limite sem concluir que todo programa pequeno exige vinte pacotes.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis, com avanço bloqueado até a etapa atual ser concluída.
- 31 fontes Java compiladas em conjunto.
- 6 execuções reais: mistura, Pedido, OS, Contrato, Pagamento e suíte final.
- Suíte final com 14 testes e evidência explícita da ordem regra → salvar → notificar.
- 8 casos completos na Clínica de Erros.
- Código destacado, consoles esperados, diagramas, simuladores e mock de IDE.
- Layout responsivo, roteiro sticky no desktop e foco automático da etapa ativa no celular.

