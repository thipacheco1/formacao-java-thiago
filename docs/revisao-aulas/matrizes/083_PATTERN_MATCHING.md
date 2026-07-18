# Matriz de preservação — Aula 083 — Pattern matching

## Contrato pedagógico

A aula foi reconstruída como oficina de fluxo tipado. Os exemplos repetitivos por domínio foram transformados em comparações navegáveis, mantendo integralmente a sintaxe, o escopo, as limitações e as decisões de design da fonte oficial.

## Cobertura curricular

| Conteúdo original | Etapa guiada | Evidência |
|---|---|---|
| `instanceof` antigo + cast versus type pattern | Teste + Variável Tipada | alternância antes/depois e código destacado |
| definição de pattern, variável tipada e benefícios | Teste + Variável Tipada | pipeline Object → teste → String |
| pattern não muda o objeto | Teste + Variável Tipada | referência original e nota do mentor |
| escopo dentro e fora do `if` | Flow Scoping | três estados do fluxo |
| retorno antecipado e negação do pattern | Flow Scoping | código completo com uso depois do `return` |
| `null instanceof Tipo` é false | Null, `&&` e `||` | laboratório lógico e saída executável |
| pattern com `&&` e curto-circuito | Null, `&&` e `||` | expressão válida e record com enum |
| problema do pattern com `||` | Null, `&&` e `||` | expressão inválida e causa visual |
| pattern com record | Records e Enums | extração de `ClienteResumo` e accessors |
| pattern com enum dentro do subtipo | Records e Enums + Lógica | `PedidoResumo` e `StatusPedido.APROVADO` |
| requisito Java 17 para `instanceof` moderno | Entrega | comandos `java -version` e `javac -version` |
| sealed + patterns | Pattern + Sealed | árvore Pix/Cartão/Boleto e três tratamentos |
| switch patterns conceitual e dependência de versão | Pattern + Sealed | alternância conceitual com alerta explícito |
| pattern matching versus polimorfismo | Pattern ou Polimorfismo | cinco decisões com justificativa |
| comportamento essencial no subtipo | Pattern ou Polimorfismo | implementação polimórfica comparativa |
| transformação externa, DTO, log, relatório e integração | Pattern ou Polimorfismo | cenários de borda |
| cliente PF/PJ | Refatoração no Backend | galeria de sete domínios |
| produto físico/digital | Refatoração no Backend | galeria de sete domínios |
| pedido criado/aprovado/cancelado | Refatoração no Backend | galeria de sete domínios |
| pagamento Pix/Cartão/Boleto | Refatoração + programa | galeria e saída compilada |
| OS reagendar/concluir/cancelar | Refatoração + desafio | galeria e exercício final |
| mensageria BoasVindas/Entrega/Nps | Refatoração no Backend | galeria de sete domínios |
| auditoria Criação/Edição/Exclusão | Refatoração no Backend | galeria de sete domínios |
| cast manual para pattern | Teste + Variável Tipada | comparação direta |
| `Object` genérico para tipo base sealed | Refatoração no Backend | antes/depois `Object` → `Pagamento` |
| quando usar e evitar | Pattern ou Polimorfismo + Clínica | decisões por responsabilidade e tamanho |
| dez erros comuns | Clínica de Erros | dez casos navegáveis com sintoma e correção |
| debug de tipo declarado, objeto real e pattern variable | Entrega | roteiro de quatro passos |
| atividade, comandos, saída, README e Git | Entrega | programa compilável, nove saídas e evidências |
| limites: switch avançado, record patterns, guards, preview | fechamento | não antecipados; aula concentra `instanceof` moderno |

## Consolidações intencionais

- Os exemplos válidos foram reunidos em `LaboratorioPatternMatching.java`, com saídas determinísticas.
- As sete aplicações foram convertidas em uma galeria que preserva os dados específicos sem duplicar o mesmo encadeamento de `if`.
- O erro de `||` é ensinado fora do arquivo válido para não bloquear a prática principal.
- Switch patterns aparecem como leitura conceitual; o laboratório executável mantém compatibilidade com Java 17.

## Recursos visuais e práticos

- pipeline comparativo de cast manual e type pattern;
- mapa interativo de flow scoping;
- laboratório de `null`, `&&` e `||`;
- extração visual de records e enums;
- árvore sealed com visão `instanceof`/switch conceitual;
- laboratório de decisão pattern versus polimorfismo;
- sete domínios e refatoração de `Object`;
- clínica de dez falhas;
- código destacado, terminal, saída, debug, checklist e desafio.

## Validação esperada

- rota exclusiva para `083_`;
- nove etapas, persistência filtrada, foco móvel e portão curricular;
- CSS responsivo até 380 px;
- programa Java compila e produz exatamente nove linhas;
- validator dedicado e lint aprovados;
- documentação aponta a Aula 084 — Text blocks como próxima.
