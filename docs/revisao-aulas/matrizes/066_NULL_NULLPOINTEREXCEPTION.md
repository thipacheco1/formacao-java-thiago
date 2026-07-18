# Matriz de cobertura — Aula 066

- Original: `066_M2_05_NULL_E_NULLPOINTEREXCEPTION_OFICIAL.md`
- Componente: `GuidedNullPointerLesson066.jsx`
- Cobertura: 100%
- Arquétipo: clínica visual de referências ausentes, textos, fail fast, arrays, contratos, Optional, stack trace e entrega.

## Transformação

O aluno deixa de “espalhar if contra null” e passa a localizar a referência exata, declarar se ausência é válida, proteger entradas obrigatórias, comunicar resultados opcionais e seguir a evidência do stack trace até a origem do estado incompleto.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| O que é null e por que existe | Anatomia da NPE | Cadeias mostram referência existente, ausente e acesso não alcançado |
| O que é NullPointerException | Anatomia da NPE | Quatro falhas alternáveis com referência culpada destacada |
| String, objeto, array e campo null | Anatomia da NPE | Casos independentes para variável, objeto, campo interno e slot |
| Null não é texto vazio ou blank | Null, Vazio e Blank | Quatro estados interativos com existência, length e isBlank |
| Null não é zero | Toda a aula + ponte da 065 | Ausência é tratada como referência, nunca como primitivo 0 |
| Causas comuns de NPE | Anatomia + Clínica | Cadeias e dez diagnósticos cobrem origens recorrentes |
| Validação simples | Null, Vazio e Blank | Resultado seguro para null, vazio, espaços e Ana |
| `textoPreenchido` | Textos + programa | Expressão `texto != null && !texto.isBlank()` aplicada e executada |
| Ordem do `&&` e curto-circuito | Null, Vazio e Blank | Alternância entre ordem segura e NPE antes da segunda condição |
| Campo interno null | Anatomia + Stack Trace + debug | Cliente existe enquanto nome está null |
| Objeto com dados obrigatórios | Falhar na Borda | Fluxo null, blank, normalização e criação |
| `IllegalArgumentException` clara | Falhar na Borda + programa | Regra de blank e valor positivo falha na entrada |
| `Objects.requireNonNull` | Falhar na Borda + programa | Ausência e conteúdo recebem validações distintas |
| equals seguro | Programa + Clínica | `"APROVADO".equals(status)` produz false sem NPE |
| equals inseguro | Clínica | Caso próprio com correção explícita |
| Array de objetos e posições null | Slots e Cadeias | Array e heap conceitual com criação e remoção por posição |
| Percurso seguro de array | Slots e Cadeias + programa | Código completo valida slot antes do campo |
| Método retornando null | Contrato de Busca | Simulação encontrado/ausente e obrigação do chamador |
| Retorno null ignorado | Contrato + Clínica | Consequência e alternativa explícitas |
| Contrato de método | Contrato de Busca | Entradas, assinatura, saídas e consumo visíveis no mesmo fluxo |
| Comentário útil sobre null | Contrato de Busca | Contrato fica explícito na interface e no tipo de retorno |
| Optional no momento certo | Optional | Restrição a retornos de busca nesta fase |
| `Optional.of`, `empty`, `ofNullable` | Optional | Seis operações exploráveis com propósito e risco |
| `isPresent` e `get` | Optional + Clínica | get só após prova de presença |
| `orElse` e `orElseThrow` | Optional | Ausência aceitável versus ausência que bloqueia fluxo |
| Quando usar e evitar null | Falhar na Borda + Contrato | Comparação ausência aceitável e valor obrigatório |
| Pedido null-safe | Null no Backend + programa | Cliente, valor e PENDENTE validados |
| Produto null-safe | Null no Backend | Nome, estoque, quantidade e saldo |
| Pagamento null-safe | Null no Backend | Objeto, valor e parcelas antes do cálculo |
| OS null-safe | Null no Backend | Certificado, ABERTA e equals constante |
| Mensageria null-safe | Null no Backend | Cliente, tipo e tentativa segura |
| Auditoria null-safe | Null no Backend | Usuário e operação falham cedo |
| Leitura de stack trace | Stack Trace e Debug | Três frames selecionáveis: onde, quem chamou e origem |
| Validação na borda | Falhar na Borda | Decisão entre aceitar ausência e impedir continuação |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos expandem cliente e campo nome |
| Atividade, comandos e saídas | Entrega & Desafio | Programa completo compilável e nove linhas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e checklist |
| Limites curriculares | Optional + desafio | Não aprofunda map/flatMap/filter, Bean Validation, exceção customizada ou Spring |

## Consolidação sem perda

Os exemplos repetitivos foram consolidados em quatro cadeias de NPE, quatro estados de texto, três portões de entrada, um array manipulável, dois contratos de busca, seis operações de Optional, seis domínios, três frames de stack trace, dez diagnósticos e um programa integrado. Cada comportamento único continua praticável.

## Verificações

- Dez etapas, com Stack Trace, Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios e dez evidências finais.
- Programa completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.

