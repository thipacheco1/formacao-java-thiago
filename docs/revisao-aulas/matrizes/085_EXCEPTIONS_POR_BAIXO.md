# Matriz de preservação — Aula 085 — Exceptions por baixo

## Contrato pedagógico

A aula foi reconstruída como clínica guiada de diagnóstico. Todo conteúdo original foi preservado em nove etapas que conectam hierarquia, stack trace, captura, propagação, causa raiz e decisões de camada.

## Cobertura curricular

| Conteúdo original | Etapa guiada | Evidência |
|---|---|---|
| exception como informação estruturada | abertura + Stack Trace | mapa interativo de investigação |
| Throwable, Error, Exception e RuntimeException | Hierarquia e Contrato | árvore visual navegável |
| checked versus unchecked e critérios | Hierarquia e Contrato | comparação IOException/RuntimeException |
| stack trace: tipo, mensagem, origem e chamadores | Ler o Stack Trace | console selecionável e pipeline de camadas |
| NPE, IllegalArgument, IllegalState e NumberFormat | Exceptions com Significado | seletor de quatro causas |
| mensagens ruins e boas | Exceptions com Significado | contexto, operação, esperado e atual |
| try/catch, getMessage e finally | Try, Catch e Finally | fluxo com/sem falha e console |
| catch vazio, printStackTrace e logging | Try, Catch e Finally + Clínica | alertas e diagnóstico |
| throw, throws e checked IOException | Throw, Throws e Camadas | código e fluxo Repository → main |
| propagação | Throw, Throws e Camadas | seletor do ponto de captura |
| causa raiz, wrapper e `Caused by` | Causa Raiz e Wrapping | visual contexto → IOException |
| preservar causa ao relançar | Causa Raiz e Wrapping | alternância preservada/perdida |
| exception própria checked/unchecked | Hierarquia + Causa | `RegraNegocioException` e explicação |
| ordem dos catches e multi-catch | Causa Raiz e Wrapping | código específico→genérico e união |
| cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Exceptions no Backend | galeria de sete domínios |
| refatorar null silencioso, catch genérico e wrapper sem causa | Domínios + Clínica | decisões e correções |
| quando lançar, capturar e propagar | Exceptions no Backend | laboratório de três ações |
| dez erros comuns | Clínica de Erros | dez diagnósticos navegáveis |
| debug no `throw`, valores e call stack | Entrega | roteiro de quatro passos |
| atividade, comandos, saída, README e Git | Entrega | programa compilável, oito saídas e evidências |
| limites: try-with-resources, logging, ControllerAdvice, rollback | fechamento | não antecipados como domínio desta aula |

## Consolidações intencionais

- Os exemplos válidos foram reunidos em `LaboratorioExceptions.java`.
- Stack traces variáveis por linha foram substituídos por um explorador visual e saídas determinísticas.
- Os sete domínios mantêm suas mensagens e critérios em uma galeria comparável.
- `printStackTrace` permanece como ferramenta didática, com logging profissional claramente separado.

## Recursos visuais e práticos

- árvore Throwable;
- leitor interativo de stack trace;
- seletor de tipos de runtime exception;
- fluxo try/catch/finally;
- propagação por camadas;
- visual de causa raiz e wrapping;
- sete domínios e decisão lançar/capturar/propagar;
- clínica de dez erros;
- código, terminal, saída, debug, checklist e desafio.

## Validação esperada

- rota exclusiva `085_`, nove etapas e progresso normalizado;
- responsividade até 380 px e foco móvel;
- Java compila e produz oito saídas exatas;
- validator dedicado e lint aprovados;
- documentação aponta a Aula 086 — Entrada/saída básica com console robusto.
