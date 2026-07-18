# Matriz de preservação — Aula 081 — Reflection conceitual

## Contrato pedagógico

A aula foi reconstruída como oficina guiada. O conteúdo oficial permanece como fonte curricular, mas exemplos dispersos foram reunidos em um laboratório executável e em nove etapas com decisões visuais. Nenhum conceito exclusivo foi removido.

## Cobertura do conteúdo original

| Conteúdo curricular | Onde aparece na aula guiada | Evidência |
|---|---|---|
| Conceito, runtime, metadados e riscos | O Espelho Class | diagrama objeto → Class → membros e modo inspeção/manipulação |
| Mundo real: Spring, JPA, Jackson, JUnit, Mockito, Bean Validation, DI, ORM e scanners | O Espelho Class + Critério no Backend | explicação de infraestrutura genérica e regra do mentor |
| `Class`, `Field`, `Method` e `Constructor` | O Espelho Class | vocabulário visual e fatos da aula |
| `.class`, `getClass()` e `Class.forName()` | Três Entradas | seletor comparativo, identidade e exceção |
| nomes simples, completos e pacote | Três Entradas | código com `getName`, `getSimpleName` e `getPackageName` |
| campos declarados versus públicos | Inventário de Membros | `getDeclaredFields` comparado a `getFields` |
| métodos declarados versus públicos/herdados | Inventário de Membros | `getDeclaredMethods` comparado a `getMethods` |
| parâmetros e configuração `-parameters` | Inventário de Membros | tipos confiáveis e ressalva dos nomes |
| construtores declarados versus públicos | Inventário de Membros | duas assinaturas e comparação das APIs |
| ordem não garantida | Inventário de Membros | ordenação explícita e aviso do mentor |
| records também são classes em runtime | Inventário de Membros | nota sobre métodos gerados |
| annotation de classe, `getAnnotation` e `isAnnotationPresent` | Scanner de Annotations | alternância classe/campo e código completo |
| annotation de campo e `RetentionPolicy.RUNTIME` | Scanner de Annotations | simulação com/sem retenção e leitura de campos |
| validador simples com `@CampoObrigatorio` | Validador Genérico | formulário interativo, pipeline e implementação |
| criação por construtor | Criar, Invocar e Ler | `getDeclaredConstructor` + `newInstance` |
| invocação de método | Criar, Invocar e Ler | `getDeclaredMethod` + `invoke` |
| leitura de campo privado | Criar, Invocar e Ler | bloqueio antes de `setAccessible` |
| riscos de `setAccessible` e módulos | Criar, Invocar e Ler | controle interativo e alerta |
| exceções reflexivas | Criar, Invocar e Ler + Clínica | `ClassNotFoundException`, `NoSuch*`, `IllegalAccessException`, `InvocationTargetException`, `InstantiationException`, `SecurityException` contextualizadas |
| strings mágicas e refatoração para chamada direta | Critério no Backend | laboratório de decisão e regra de API explícita |
| constante como mitigação parcial | Critério no Backend | explicação de que centralizar não elimina o risco |
| cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Critério no Backend | galeria de sete domínios |
| quando usar e quando evitar | Critério no Backend | cinco decisões com justificativa |
| dez erros comuns | Clínica de Erros | dez diagnósticos navegáveis com sintoma e correção |
| debug recomendado | Entrega & Desafio | breakpoint, `Class`, `Field` e annotation |
| atividade, comandos, saída, desafio, README e Git | Entrega & Desafio | programa determinístico, 12 saídas e evidências copiáveis |
| limites da aula e próximos assuntos | fechamento | conclusão prepara sealed sem antecipar proxies, processors, módulos ou internals de Spring |

## Consolidações intencionais

- Os muitos arquivos mínimos foram consolidados em `LaboratorioReflection.java`, mantendo cada API e deixando a compilação reproduzível.
- As aplicações em sete domínios viraram uma galeria comparável, evitando repetir o mesmo laço reflexivo sem perder a intenção de cada contexto.
- Os exemplos perigosos são demonstrados por estado bloqueado e clínica, sem recomendar `setAccessible` como padrão.
- Saídas dependentes da ordem foram tornadas determinísticas com `sorted()`.

## Recursos visuais e práticos

- espelho visual de `Class<?>` e seus membros;
- comparador das três formas de obter `Class`;
- explorador de campos, métodos, parâmetros e construtores;
- scanner interativo de annotations com retenção;
- validador com entradas editáveis e pipeline de inspeção;
- painel de criação, invocação e acesso privado;
- galeria de domínios e laboratório de decisão;
- clínica navegável com dez falhas;
- código com destaque de sintaxe, terminal, saída, debug e checklist.

## Validação esperada

- rota exclusiva para `081_`;
- nove etapas com progresso persistente e IDs filtrados;
- conclusão condicionada a todas as etapas;
- roteiro responsivo e foco móvel herdado do padrão guiado;
- CSS específico com fallback até 380 px e proteção contra estouro;
- programa Java compila e produz exatamente as 12 linhas apresentadas;
- validator dedicado e lint dos arquivos alterados passam.
