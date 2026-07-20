# Matriz de cobertura — Aula 141 — Revisão prática de OO e domínio

## Fontes auditadas

- `docs/aulas/141_M4_37_REVISAO_PRATICA_OO_DOMINIO_OFICIAL.md`, lida integralmente.
- Aula anterior: a Aula 140 separou domínio, aplicação e infraestrutura.
- Aula seguinte: a Aula 142 introduzirá menu interativo com `Scanner`; a revisão atual não antecipa essa experiência de console.

## Promessa pedagógica

O aluno deve montar, executar, depurar e explicar um fluxo completo de Ordem de Serviço que integra objetos de valor, entidade associada, filhos de composição, coleções protegidas, agregado, invariantes, Builder, casos de uso e infraestrutura. Depois, deve transferir os mesmos critérios para Contrato sem copiar apenas nomes.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Lista de conceitos do módulo | Radar interativo de treze conceitos e evidência concreta no projeto | Etapa 1 |
| Estrutura de pacotes e mapa mental | Árvore do projeto e arquitetura App → Aplicação → Domínio / Infra | Etapa 2 |
| Dinheiro, CodigoOs, PeriodoAtendimento e enums | Oficina de tipos com igualdade, factory, data, turno, status e prioridade | Etapa 3 |
| Cliente, AtividadeOs e OcorrenciaOs | Comparador associação/composição e acesso package-private | Etapa 4 |
| OrdemServico como raiz | Laboratório do agregado com comandos, coleções protegidas e histórico automático | Etapa 5 |
| Builder da OS | Montador visual com padrões, encadeamento e validação final na entidade | Etapa 6 |
| Repositório, notificador e três use cases | Pipeline de criação, reagendamento e conclusão sem regra roubada | Etapa 7 |
| App principal | Fluxo completo executável, saídas explicadas e avaliador do modelo | Etapa 8 |
| Teste de bloqueio e cinco alterações sugeridas | Arena de invariantes para OS vazia, pendente, encerrada, período igual e cliente inativo | Etapa 9 |
| Debug recomendado | Mock do IntelliJ seguindo Builder, raiz, filho, ocorrência, use case e infra | Etapa 10 |
| Oito erros e desafio Contrato | Clínica completa e implementação de Contrato com Builder, filhos, eventos, use cases e bloqueios | Etapa 11 |

## Decisões pedagógicas

1. A revisão começa pelas evidências dos conceitos, evitando uma lista de definições desconectadas.
2. `Dinheiro` é exercitado no desafio de Contrato para não virar arquivo ornamental.
3. `Cliente` permanece associação; `AtividadeOs` e `OcorrenciaOs` pertencem ao ciclo de vida da OS.
4. O Builder melhora a montagem, mas o construtor de `OrdemServico` continua sendo a última barreira contra objeto inválido.
5. Os casos de uso coordenam e a raiz decide; nenhuma regra de conclusão é duplicada na aplicação.
6. O repositório de memória faz atualização por código em vez de acumular a mesma OS a cada operação, incorporando uma melhoria indicada no original sem introduzir banco.
7. As cinco tentativas inválidas são executáveis e mostram qual objeto bloqueia cada operação.
8. O desafio Contrato transfere os critérios da modelagem: não basta renomear `OrdemServico`.
9. DTO, web, Spring, interfaces de Repository e exceções específicas continuam apenas no mapa de evolução futura.
10. O menu de console e `Scanner` ficam exclusivamente para a Aula 142.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis, com avanço bloqueado.
- 31 fontes Java compiladas em conjunto.
- 5 execuções reais: fluxo completo de OS, bloqueio de OS, fluxo de Contrato, bloqueio de Contrato e suíte.
- Suíte final com 16 testes cobrindo valores, Builder, agregado, listas, transições e desafio.
- 8 casos completos na Clínica de Erros.
- Código destacado, consoles, árvore de pacotes, diagramas, simuladores e mock de IDE.
- Layout responsivo, roteiro sticky no desktop e foco da etapa ativa no celular.

