# Matriz de cobertura — Aula 139 — Agregados inicial

## Fontes auditadas

- `docs/aulas/139_M4_35_AGREGADOS_INICIAL_OFICIAL.md`
- Aula anterior: composição define propriedade e ciclo de vida dos filhos.
- Fronteira seguinte: `140_M4_36_LIMITES_DE_RESPONSABILIDADE_DO_DOMINIO_OFICIAL.md` separará domínio, aplicação e infraestrutura; aqui serviços e persistência são apenas contextualizados.

## Promessa pedagógica

O aluno deve identificar uma raiz, fazer toda alteração relevante atravessá-la e provar que regras envolvendo estado, filhos e histórico permanecem consistentes em Pedido, OrdemServico, Contrato e Checklist.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Filho alterado sem raiz | Pedido pago muda total por referência direta | Etapa 1 |
| Composição versus agregado | Comparador posse versus posse + regra + consistência | Etapa 2 |
| Raiz e fronteira | Mapa visual de raiz, filhos, associação e comandos permitidos | Etapa 2 |
| Unidade futura de persistência | Simulação de carregar/salvar a raiz com seus filhos, sem banco | Etapa 3 |
| Pedido agregado | Itens, eventos, quantidade, total, pagamento e cancelamento pela raiz | Etapa 4 |
| Bloqueio após pagamento | Tentativa executável de alterar filho depois de PAGO | Etapa 5 |
| OrdemServico agregado | Atividades e ocorrências coordenadas pela OS | Etapa 6 |
| Conclusão depende de todos os filhos | Portão visual e programa de bloqueio com atividade pendente | Etapa 6 |
| Contrato agregado | Serviços, mensal, ativação e bloqueio após ATIVO | Etapa 7 |
| Tamanho, acesso e serviço de domínio | Laboratório de decisões e antipadrão de agregado gigante | Etapa 8 |
| Debug recomendado | Mock do IntelliJ com quinze paradas pela raiz | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, consequência e correção | Etapa 10 |
| Desafio Checklist | Raiz com perguntas, eventos, finalização e bloqueio posterior | Etapa 11 |

## Decisões pedagógicas

1. O defeito inicial mostra uma violação temporal: o total muda depois de o Pedido estar pago.
2. A raiz é ensinada como porta de entrada, não como classe “maior” ou nome técnico decorativo.
3. `Cliente` permanece associação para impedir que o diagrama confunda todos os relacionados com filhos internos.
4. Eventos e ocorrências comprovam que a raiz coordenou a mudança; não são criados pelo app.
5. A OS demonstra uma invariante verdadeiramente coletiva: todas as atividades precisam estar concluídas.
6. Persistência futura é explicada como tendência de salvar/carregar a unidade, sem introduzir Repository ou banco nesta aula.
7. Serviço de domínio pode decidir com a raiz, mas a raiz continua validando e executando.
8. A separação domínio/aplicação/infraestrutura permanece reservada à Aula 140.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 30 fontes Java compiladas em conjunto.
- 9 execuções reais; suíte final imprime `14 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, mapas de fronteira, portões de consistência e mock de IDE.
- Layout responsivo e foco móvel na etapa ativa.
