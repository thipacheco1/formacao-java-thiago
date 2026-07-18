# Matriz de preservação — Aula 082 — Sealed classes e interfaces

## Contrato pedagógico

A aula oficial foi transformada em uma oficina guiada de hierarquias controladas. Exemplos repetidos foram consolidados, enquanto conceitos, restrições do compilador, domínios e decisões de modelagem foram mantidos integralmente.

## Cobertura curricular

| Conteúdo original | Etapa guiada | Evidência |
|---|---|---|
| pergunta central e pagamento não permitido | Fronteira da Hierarquia | alternância interface aberta/sealed e `PagamentoCripto` negado |
| conceito de `sealed`, hierarquia controlada e opção intermediária | Fronteira da Hierarquia | diagrama do contrato e regra do mentor |
| `permits` e subtipo direto não listado | Permits e Compilador | simulador do javac e código propositalmente inválido |
| Java 17+ e comandos de versão | Permits e Compilador + Entrega | `java -version`, `javac -version` e expectativa explícita |
| obrigação `final`, `sealed` ou `non-sealed` | Final, Sealed, Non-sealed | seletor dos três destinos e árvore visual |
| `final` encerra a hierarquia | Final, Sealed, Non-sealed | ramo terminal |
| `non-sealed` reabre a hierarquia | Final, Sealed, Non-sealed | ramo aberto com `NotificacaoEmail` |
| `sealed` em dois níveis | Final, Sealed, Non-sealed | Evento → EventoPedido → finais |
| sealed class abstrata | Classe, Interface e Records | código com método abstrato e subclasses finais |
| sealed interface com records | Classe, Interface e Records | Resultado com records finais por natureza |
| Resultado com Sucesso e Erro | Resultado Controlado | formulário, fluxo e implementação sem null/boolean solto |
| conjunto conhecido e preparação para switch exaustivo | Resultado Controlado | explicação sem antecipar pattern matching avançado |
| enum versus sealed | Enum, Sealed ou Aberto | laboratório de decisão e código comparativo |
| domínio dinâmico e plugins externos | Enum, Sealed ou Aberto | decisões por dados e interface aberta |
| cliente PF/PJ | Refatoração no Backend | galeria de sete domínios |
| produto físico/digital | Refatoração no Backend | galeria de sete domínios |
| pedido criado/aprovado/cancelado com `Instant` | Refatoração no Backend | galeria de sete domínios |
| pagamento Pix/Cartão/Boleto | Refatoração no Backend | galeria e programa executável |
| OS reagendar/concluir/cancelar | Refatoração no Backend | galeria e desafio final |
| mensageria BoasVindas/Entrega/Nps | Refatoração no Backend | galeria de sete domínios |
| auditoria Criação/Edição/Exclusão | Refatoração no Backend | galeria de sete domínios |
| refatorar `tipo` + campos opcionais | Refatoração no Backend | antes/depois visual |
| refatorar interface aberta quando o domínio é fechado | Fronteira + Refatoração | compilador protege apenas tipos previstos |
| quando usar e quando evitar | Enum, Sealed ou Aberto + Clínica | decisão por conjunto fechado, dados próprios, plugins e cadastro |
| dez erros comuns | Clínica de Erros | dez casos com sintoma e correção |
| sealed não valida dados | Refatoração + Clínica | alerta sobre invariantes |
| debug de tipo declarado, real e `instanceof` | Entrega & Desafio | roteiro de quatro observações |
| atividade, comandos, saída, README e Git | Entrega & Desafio | laboratório compilável, oito saídas e evidências |
| limites e próxima aula | fechamento | pattern matching e exaustividade avançada ficam para depois |

## Consolidações intencionais

- Os exemplos válidos foram reunidos em `LaboratorioSealed.java`, incluindo interface, classe, records, dois níveis e `non-sealed`.
- As sete aplicações preservam seus dados específicos numa galeria comparativa, sem repetir sete vezes o mesmo `instanceof`.
- Erros de compilação são mostrados separadamente do arquivo válido para que o aluno consiga concluir o laboratório.
- Pattern matching aparece apenas no nível de `instanceof` necessário à aula; switch patterns permanece para a Aula 083.

## Recursos visuais e práticos

- fronteira interativa aberta versus sealed;
- simulador de `permits` e diagnóstico do javac;
- árvore visual de `final`, `sealed` e `non-sealed`;
- comparação sealed interface versus sealed abstract class;
- laboratório de Resultado com entrada editável;
- decisão enum/sealed/dado/interface aberta;
- sete domínios e refatoração antes/depois;
- clínica de dez falhas;
- código destacado, terminal, saída, debug, desafio e checklist.

## Validação esperada

- rota exclusiva para `082_`;
- nove etapas com persistência filtrada, foco móvel e portão curricular;
- CSS responsivo até 380 px sem estouro horizontal;
- programa Java compila em JDK moderno e produz exatamente oito linhas;
- validator dedicado, lint e build de fechamento de ciclo aprovados;
- status, README e cronograma apontam a Aula 083 como próxima.
