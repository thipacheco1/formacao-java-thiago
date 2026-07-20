# Matriz de cobertura — Aula 130 — Colaboração entre objetos

## Fonte auditada

- `docs/aulas/130_M4_26_COLABORACAO_ENTRE_OBJETOS_OFICIAL.md`
- Fronteira seguinte: `131_M4_27_TELL_DONT_ASK_OFICIAL.md` aprofunda o princípio; a Aula 130 apenas o apresenta e pratica colaboração.

## Promessa pedagógica

Ao concluir, o aluno deve enxergar uma execução orientada a objetos como uma conversa: a aplicação coordena, cada objeto recebe mensagens com intenção, protege seu estado e delega apenas a responsabilidade pertencente ao colaborador. O aluno também deve distinguir colaboração de invasão e de um fluxo procedural disfarçado com classes.

## Cobertura obrigatória

| Conteúdo único da aula original | Tratamento reconstruído | Evidência |
|---|---|---|
| Objetos colaboram por chamadas de métodos | Simulador remetente → mensagem → receptor → efeito | Etapa 1 |
| Procedural disfarçado de OO | Autópsia interativa do `main` que valida, reserva, calcula e muda status | Etapa 2 |
| Colaboração não é invasão | Comparação estado público/setters versus métodos com intenção | Etapas 2 e 8 |
| Introdução a Tell, Don't Ask | Contraste inicial sem consumir o aprofundamento da Aula 131 | Etapas 1 e 8 |
| Cliente, Produto, ItemPedido, Pedido e Dinheiro | Workspace navegável e compilável | Etapa 4 |
| Produto protege estoque | Sequência mostra `Pedido → Produto.reservarEstoque` | Etapa 5 |
| ItemPedido calcula subtotal | Sequência e código executável | Etapas 4 e 5 |
| Pedido soma total e confirma pagamento | Execução completa com saída prevista | Etapas 4 e 5 |
| Acoplamento direto Pedido–Produto e limite real | Comparador entre colaboração didática e coordenação futura | Etapa 6 |
| OrdemServico, CodigoOs, Periodo, Tecnico e status | Segundo workspace e fluxo de ciclo de vida | Etapa 7 |
| App coordena; domínio protege regras | Mapa de fronteira aplicação/domínio | Etapa 6 |
| Getters, setters, encapsulamento e invariantes | Laboratório de decisão com consequências | Etapa 8 |
| Debug nos três fluxos | Mock do IntelliJ com dez paradas e estado observado | Etapa 9 |
| Oito erros comuns | Clínica com rótulos completos, sintoma e correção | Etapa 10 |
| Desafio Contrato | Sete fontes, fluxo executável e oito testes | Etapa 11 |
| Registro, evidências e commit | Checklist copiável, terminal e commit limpo | Etapa 11 |

## Decisões de reconstrução

1. O código procedural permanece executável para que o problema seja observado antes da solução.
2. A colaboração de Pedido é ensinada como sequência temporal, não apenas como diagrama estrutural.
3. A reserva de estoque direta é explicitamente tratada como simplificação didática e ponto de decisão arquitetural.
4. Consultas não são proibidas: o risco é consultar para reproduzir externamente uma regra de mudança.
5. O desafio de Contrato é entregue como laboratório real, não como lista de requisitos sem solução.
6. Código Java usa destaque de sintaxe, nomes de arquivos, saída de terminal e validação por `javac`/`java`.

## Critérios de aceite técnico

- 11 etapas com conclusão reversível e bloqueio de avanço.
- Roteiro lateral fixo no desktop e com foco automático no mobile.
- 22 fontes Java compiláveis em conjunto.
- 5 execuções reais; a suíte final precisa imprimir `8 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Build de produção e lint sem erros.
- Integração por `React.lazy` para o prefixo `130_`.
- Status permanece `em_revisao` até inspeção visual e aprovação explícita.
