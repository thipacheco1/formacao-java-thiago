# Matriz de cobertura — Aula 137 — Coleções dentro de objetos

## Fontes auditadas

- `docs/aulas/137_M4_33_COLECOES_DENTRO_DE_OBJETOS_OFICIAL.md`
- Aula anterior: Builder entrega uma coleção inicial sem ensinar ainda sua exposição e mutação segura.
- Fronteira seguinte: `138_M4_34_COMPOSICAO_COM_COLECOES_OFICIAL.md` discutirá propriedade e ciclo de vida dos elementos; esta aula se limita ao encapsulamento da coleção.

## Promessa pedagógica

O aluno deve conseguir provar por execução por que uma lista interna exposta quebra invariantes, controlar alterações por métodos de domínio, escolher entre consulta específica e cópia não modificável e proteger também listas recebidas e elementos mutáveis.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Lista interna exposta | Simulador antes/depois de `getItens().clear()` e programa executável | Etapa 1 |
| Referência, conteúdo e elementos | Diagrama em três camadas, incluindo o significado limitado de `final` | Etapa 2 |
| `ItemPedido` e `Pedido` protegidos | Oficina com duplicidade, status, remoção, total e pagamento | Etapa 3 |
| `List.copyOf` | Escudo interativo comparando cópia, visão e lista original | Etapa 4 |
| Cópia rasa e elementos mutáveis | Mutação conceitual de um item e justificativa de elementos sem setters | Etapa 4 |
| Métodos de domínio | Roteador entre comando, consulta específica e coleção de leitura | Etapa 5 |
| Contrato com serviços | Laboratório de adicionar, remover, ativar, duplicidade e mensal total | Etapa 6 |
| OS com ocorrências | Linha do tempo automática sem `adicionarOcorrencia` público | Etapa 7 |
| Cópia defensiva, lista e item nulos | Scanner de construtor que compara alias externo e cópia própria | Etapa 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas e estado observável | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, consequência e correção | Etapa 10 |
| Desafio Checklist | Implementação completa com perguntas, respostas, finalização e proteção | Etapa 11 |

## Decisões pedagógicas

1. A falha aparece antes da solução: o aluno vê uma lista ser apagada sem o Pedido participar.
2. `final`, `List.copyOf` e imutabilidade do elemento são ensinados como proteções distintas.
3. `Collections.unmodifiableList` é apresentado como visão ligada à origem; `List.copyOf`, como fotografia não modificável dos elementos atuais.
4. Consultas como `total()` e `quantidadeItens()` têm prioridade quando o chamador não precisa da coleção inteira.
5. A OS não expõe comando de inclusão no histórico: ocorrências são consequência de operações legítimas.
6. A cópia defensiva no construtor é provada alterando a lista do chamador depois da criação.
7. A propriedade do ciclo de vida dos elementos permanece reservada à Aula 138.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 24 fontes Java compiladas em conjunto.
- 7 execuções reais; suíte final imprime `12 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, diagramas de referência, simuladores de coleção e mock de IDE.
- Layout responsivo e foco móvel na etapa ativa.
