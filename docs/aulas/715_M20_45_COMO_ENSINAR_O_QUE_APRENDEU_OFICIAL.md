# 715 - M20.45 - Como ensinar o que aprendeu

## Apresentação da aula

Na aula 714, você concluiu uma system design interview completa.

O trabalho anterior consolidou:

- discovery;
- controle de tempo;
- levantamento de requisitos;
- registro de assumptions;
- estimativas de capacidade;
- desenho de alto nível;
- APIs;
- modelo de dados;
- consistência;
- Outbox;
- Inbox;
- mensageria;
- falhas;
- segurança;
- observabilidade;
- escalabilidade;
- disponibilidade;
- deployment;
- custos;
- mudanças adversariais;
- defesa final;
- scorecard;
- report, evidence e gate.

Agora você dará um passo diferente.

Você deixará de atuar apenas como alguém que executa, explica decisões em entrevistas ou documenta um projeto.

Você começará a transformar conhecimento técnico em aprendizado para outra pessoa.

Saber fazer e saber ensinar são competências relacionadas, mas não idênticas.

Uma pessoa pode dominar Java, Spring, banco, mensageria ou arquitetura e ainda produzir uma explicação difícil de acompanhar.

Isso acontece quando ela:

- começa pelo detalhe;
- usa conceitos que o aluno ainda não conhece;
- apresenta muitas decisões ao mesmo tempo;
- pula etapas;
- mostra código pronto;
- mistura objetivo principal com assuntos laterais;
- não valida entendimento;
- cria exercício sem critérios;
- corrige sem explicar o raciocínio;
- termina sem consolidar o aprendizado.

Ensinar exige projetar uma experiência.

O aluno precisa saber:

- onde está;
- o que aprenderá;
- por que isso importa;
- quais conhecimentos prévios serão usados;
- qual problema será resolvido;
- como cada etapa se conecta;
- quando praticará;
- como saberá que conseguiu;
- o que revisar quando errar;
- qual é o próximo passo.

Nesta aula, você aprenderá a construir essa experiência.

O tema técnico de referência será o OrderFlow, especialmente a jornada de criação confiável de pedidos.

Você praticará como ensinar:

- idempotência;
- transação local;
- Transactional Outbox;
- publicação assíncrona;
- duplicidade;
- reconciliação;
- testes;
- observabilidade.

Você não criará ainda a aula final pronta para publicação.

Primeiro, construirá o método que será usado nela.

A próxima aula será:

```text
716 - M20.46 - Aula ensinavel final
```

Na aula 716, você aplicará o método desta aula para produzir uma aula completa, revisada, ensinável e pronta para outra pessoa executar do início ao fim.

O laboratório será:

```text
labs/m20/aula-715-como-ensinar/orderflow-teaching-method
```

Regra central:

```text
ensinar tecnologia
nao e despejar tudo o que voce sabe;

e escolher
o que o aluno precisa agora,
organizar uma progressao,
mostrar o raciocinio,
guiar a pratica
e validar aprendizagem.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
712:
Entrevista arquitetura.

713:
Live coding Java.

714:
System design interview.

715:
Como ensinar o que aprendeu.

716:
Aula ensinavel final.

717:
Banca tecnica simulada.
```

A aula 715 utiliza como fonte:

- toda a formação Java Backend;
- diário de bordo;
- exemplos do OrderFlow;
- código;
- testes;
- ADRs;
- reports;
- evidence;
- troubleshooting;
- apresentações;
- respostas de entrevistas;
- dificuldades encontradas ao longo do projeto;
- erros corrigidos;
- decisões defendidas.

O conteúdo técnico já existe.

O desafio agora é selecionar, sequenciar e apresentar.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/teaching-method
├── TEACHING_CHARTER.md
├── AUDIENCE_PROFILE.md
├── PRIOR_KNOWLEDGE_MAP.md
├── LEARNING_OBJECTIVES.md
├── CONTENT_SCOPE.md
├── CONCEPT_DEPENDENCY_MAP.md
├── MISCONCEPTION_CATALOG.md
├── EXPLANATION_FRAMEWORK.md
├── ANALOGY_POLICY.md
├── WORKED_EXAMPLE_PLAN.md
├── GUIDED_PRACTICE_PLAN.md
├── INDEPENDENT_EXERCISE_PLAN.md
├── ASSESSMENT_PLAN.md
├── FEEDBACK_GUIDE.md
├── TROUBLESHOOTING_TEACHING_GUIDE.md
├── COGNITIVE_LOAD_REVIEW.md
├── ACCESSIBILITY_AND_INCLUSION.md
├── VISUAL_SUPPORT_PLAN.md
├── CODE_DEMONSTRATION_GUIDE.md
├── LESSON_TIMING_PLAN.md
├── TEACH_BACK_SCRIPT.md
├── MICROTEACHING_SIMULATION.md
├── TEACHING_SCORECARD.md
├── TEACHING_REVIEW_CHECKLIST.md
├── TEACHING_MATRIX.md
├── TEACHING_RISK_REGISTER.md
├── TEACHING_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts auxiliares:

```text
scripts/teaching-method
├── collect-teaching-sources.ps1
├── validate-learning-objectives.ps1
├── validate-concept-order.ps1
├── validate-exercise-alignment.ps1
├── run-microteaching-review.ps1
├── generate-teaching-report.ps1
└── collect-teaching-evidence.ps1
```

Artifacts:

```text
reports/teaching-method-report.yaml

contracts/teaching-method-evidence.yaml
```

Documento central:

```text
docs/teaching-method/EXPLANATION_FRAMEWORK.md
```

---

## Conceito essencial

### Ensinar é reduzir distância

Existe uma distância entre:

- o que o aluno sabe;
- o que precisa fazer;
- o que precisa compreender;
- o que precisa conseguir explicar sozinho.

A aula cria uma ponte entre esses pontos.

### Objetivo vem antes do conteúdo

O objetivo não é “falar sobre Outbox”.

O objetivo pode ser:

```text
ao final,
o aluno consegue explicar
por que gravar no banco
e publicar no broker
em duas operacoes independentes
cria risco de dual write,
e consegue implementar
uma Outbox transacional simples.
```

### Explicação vem antes da abstração completa

O aluno precisa primeiro enxergar o problema.

Depois, a solução.

Por último, os refinamentos.

### Prática precisa ser alinhada

Se o objetivo é implementar, apenas responder perguntas teóricas não é suficiente.

### Avaliação precisa observar comportamento

O aluno demonstra aprendizado por evidência:

- código;
- teste;
- explicação;
- decisão;
- diagnóstico;
- exercício concluído.

---

## Mão na massa guiada

### 1. Criar Teaching Charter

Arquivo:

```text
docs/teaching-method/TEACHING_CHARTER.md
```

Princípios:

```text
audience before depth;

objectives before content;

problem before solution;

one concept at a time;

examples expose reasoning;

practice is guided before independent;

feedback is specific;

assessment matches objectives;

the final publishable lesson belongs to lesson 716.
```

---

## Público-alvo

### 2. Criar Audience Profile

Arquivo:

```text
docs/teaching-method/AUDIENCE_PROFILE.md
```

Defina um aluno específico.

Exemplo:

```text
desenvolvedor iniciante em Java Backend,
que conhece classes,
interfaces,
HTTP,
Spring Boot basico
e PostgreSQL,
mas ainda nao implementou
mensageria confiavel.
```

---

### 3. Registrar objetivo profissional do aluno

Exemplo:

- conseguir trabalhar em APIs Java;
- compreender integração assíncrona;
- evoluir de CRUD para sistemas confiáveis.

---

### 4. Registrar contexto de estudo

Pergunte:

- estuda sozinho?
- possui ambiente preparado?
- consegue executar Docker?
- usa Windows?
- possui tempo contínuo?
- precisa de instruções detalhadas?

---

### 5. Registrar limitações

Exemplos:

- pouca experiência com Kafka;
- insegurança com transações;
- dificuldade com debugging;
- inglês técnico básico.

---

### 6. Evitar público genérico

“Qualquer pessoa” não ajuda a decidir profundidade.

---

## Conhecimento prévio

### 7. Criar Prior Knowledge Map

Arquivo:

```text
docs/teaching-method/PRIOR_KNOWLEDGE_MAP.md
```

---

### 8. Listar conhecimentos obrigatórios

Para ensinar Outbox:

- Java;
- Spring Boot;
- repository;
- transação;
- PostgreSQL;
- evento;
- teste de integração.

---

### 9. Listar conhecimentos úteis

- Kafka;
- Docker;
- observabilidade;
- idempotência.

---

### 10. Listar conhecimentos que serão ensinados

- dual write;
- Outbox;
- publisher;
- reprocessamento;
- idade da mensagem;
- falha parcial.

---

### 11. Criar diagnóstico inicial

Perguntas rápidas:

- o que acontece quando duas operações precisam ter sucesso juntas?
- o que ocorre se o banco confirma e o broker falha?
- uma mensagem pode ser entregue duas vezes?
- um retry sempre é seguro?

---

### 12. Definir recuperação de pré-requisito

Quando faltar conhecimento essencial, indique uma revisão curta em vez de fingir que o aluno acompanha.

---

## Objetivos de aprendizagem

### 13. Criar Learning Objectives

Arquivo:

```text
docs/teaching-method/LEARNING_OBJECTIVES.md
```

---

### 14. Usar verbo observável

Evite:

```text
entender Outbox.
```

Prefira:

```text
explicar o risco de dual write;

implementar persistencia de Outbox;

testar commit atomico;

diagnosticar mensagem pendente.
```

---

### 15. Criar objetivo conceitual

```text
explicar por que banco e broker
nao participam automaticamente
da mesma transacao local.
```

---

### 16. Criar objetivo prático

```text
implementar Order e OutboxMessage
na mesma transaction boundary.
```

---

### 17. Criar objetivo de diagnóstico

```text
identificar por logs e metricas
quando mensagens permanecem pendentes.
```

---

### 18. Criar objetivo de defesa

```text
comparar Outbox
com publicacao direta
e explicar o custo adicional.
```

---

### 19. Limitar quantidade

Uma aula precisa de poucos objetivos centrais.

---

### 20. Definir critério de domínio

Exemplo:

```text
o aluno conclui
quando o teste prova
que Order e Outbox
sao persistidos juntos
e consegue explicar
o que ocorre se o publisher falhar.
```

---

## Escopo

### 21. Criar Content Scope

Arquivo:

```text
docs/teaching-method/CONTENT_SCOPE.md
```

---

### 22. Definir conteúdo principal

- dual write;
- transação local;
- tabela Outbox;
- publisher;
- status;
- retry;
- observabilidade;
- teste.

---

### 23. Definir conteúdo secundário

- `SKIP LOCKED`;
- batch;
- jitter;
- retenção.

---

### 24. Definir fora de escopo

Para esta aula metodológica:

- Kafka internals;
- exactly-once global;
- CDC avançado;
- multi-region;
- schema registry aprofundado.

---

### 25. Explicar por que algo ficou fora

Escopo protege a progressão.

---

### 26. Criar estacionamento de dúvidas

Perguntas relevantes, mas fora do objetivo, são registradas para outra aula.

---

## Dependência entre conceitos

### 27. Criar Concept Dependency Map

Arquivo:

```text
docs/teaching-method/CONCEPT_DEPENDENCY_MAP.md
```

Sequência:

```text
pedido;

transacao local;

evento;

dual write;

Outbox;

publisher;

duplicidade;

retry;

observabilidade;

reconciliacao.
```

---

### 28. Validar se cada conceito usa apenas conhecimentos anteriores

---

### 29. Evitar explicar Inbox antes de duplicidade

---

### 30. Evitar explicar `SKIP LOCKED` antes do publisher concorrente

---

### 31. Criar ponte entre conceitos

Exemplo:

```text
agora que o pedido
e o registro da Outbox
sao gravados juntos,
precisamos retirar
essas mensagens pendentes
sem publica-las duas vezes.
```

---

### 32. Revisar saltos cognitivos

---

## Erros de entendimento

### 33. Criar Misconception Catalog

Arquivo:

```text
docs/teaching-method/MISCONCEPTION_CATALOG.md
```

---

### 34. Registrar misconception: “Kafka participa da transação do banco”

Correção:

```text
o commit local do PostgreSQL
nao confirma automaticamente
a publicacao no Kafka.
```

---

### 35. Registrar misconception: “Outbox impede duplicidade”

Correção:

```text
Outbox protege perda entre commit e publicacao;
at-least-once ainda pode produzir repeticao.
```

---

### 36. Registrar misconception: “retry sempre resolve”

Correção:

```text
retry pode duplicar efeitos
quando o resultado anterior e ambiguo.
```

---

### 37. Registrar misconception: “mensagem publicada significa jornada concluída”

---

### 38. Registrar misconception: “status pendente é erro”

Pendente pode ser estado operacional esperado.

---

### 39. Transformar misconceptions em perguntas

---

## Estrutura de explicação

### 40. Criar Explanation Framework

Arquivo:

```text
docs/teaching-method/EXPLANATION_FRAMEWORK.md
```

Estrutura recomendada:

1. contexto;
2. problema;
3. exemplo de falha;
4. conceito;
5. solução mínima;
6. implementação;
7. teste;
8. limite;
9. exercício;
10. fechamento.

---

### 41. Abrir com contexto

```text
um pedido foi salvo,
mas o evento nao chegou ao worker.
```

---

### 42. Mostrar o risco antes da solução

---

### 43. Usar um exemplo pequeno

Um pedido, uma transação e uma mensagem.

---

### 44. Nomear o conceito depois que o problema ficou visível

---

### 45. Implementar uma versão mínima

---

### 46. Adicionar refinamentos gradualmente

---

### 47. Declarar limites

---

### 48. Fechar com síntese

---

## Analogias

### 49. Criar Analogy Policy

Arquivo:

```text
docs/teaching-method/ANALOGY_POLICY.md
```

---

### 50. Usar analogia como apoio

Exemplo:

```text
a Outbox funciona como uma caixa de expedicao
registrada dentro do mesmo estabelecimento
que confirmou o pedido.
```

---

### 51. Declarar onde a analogia termina

Uma caixa física não modela concorrência, retry e ordering completamente.

---

### 52. Evitar analogia que substitui conceito

---

### 53. Evitar várias analogias simultâneas

---

### 54. Voltar rapidamente ao sistema real

---

## Exemplo resolvido

### 55. Criar Worked Example Plan

Arquivo:

```text
docs/teaching-method/WORKED_EXAMPLE_PLAN.md
```

Exemplo central:

```text
registrar Order
e OutboxMessage
na mesma transacao.
```

---

### 56. Mostrar estado inicial

- nenhuma ordem;
- nenhuma mensagem;
- banco disponível;
- broker não usado ainda.

---

### 57. Mostrar código incompleto primeiro

```Java
package com.orderflow.application;

public final class RegisterOrderHandler {

    public void handle(RegisterOrderCommand command) {
        orderRepository.save(command.toOrder());
        eventPublisher.publish(command.toEvent());
    }
}
```

---

### 58. Perguntar o que pode falhar

---

### 59. Simular commit seguido de falha no publisher

---

### 60. Introduzir a Outbox

---

### 61. Mostrar transaction boundary

```Java
package com.orderflow.application;

public final class RegisterOrderHandler {

    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;
    private final TransactionBoundary transactionBoundary;

    public RegisterOrderHandler(
        OrderRepository orderRepository,
        OutboxRepository outboxRepository,
        TransactionBoundary transactionBoundary
    ) {
        this.orderRepository = orderRepository;
        this.outboxRepository = outboxRepository;
        this.transactionBoundary = transactionBoundary;
    }

    public void handle(RegisterOrderCommand command) {
        transactionBoundary.execute(() -> {
            Order order = command.toOrder();
            orderRepository.save(order);
            outboxRepository.save(
                OutboxMessage.from(order.createdEvent())
            );
        });
    }
}
```

---

### 62. Explicar cada dependência

---

### 63. Mostrar teste de sucesso

---

### 64. Mostrar teste de rollback

---

### 65. Mostrar limitação

A mensagem ainda precisa ser publicada posteriormente.

---

## Prática guiada

### 66. Criar Guided Practice Plan

Arquivo:

```text
docs/teaching-method/GUIDED_PRACTICE_PLAN.md
```

---

### 67. Dividir prática em etapas curtas

1. criar tabela;
2. criar entidade;
3. criar repository;
4. integrar transação;
5. criar publisher;
6. testar;
7. observar métrica.

---

### 68. Explicar antes de cada etapa

---

### 69. Pedir previsão do aluno

```text
o que voce espera que aconteca
se o publisher estiver desligado?
```

---

### 70. Executar a etapa

---

### 71. Comparar previsão e resultado

---

### 72. Criar checkpoint

---

### 73. Não entregar todos os arquivos prontos

---

### 74. Variar gradualmente a autonomia

Comece com instrução detalhada e termine com decisão do aluno.

---

## Exercício independente

### 75. Criar Independent Exercise Plan

Arquivo:

```text
docs/teaching-method/INDEPENDENT_EXERCISE_PLAN.md
```

Exercício:

```text
implementar retry controlado
e registrar last_error,
attempt_count
e next_attempt_at.
```

---

### 76. Definir enunciado completo

---

### 77. Definir restrições

- não apagar mensagem;
- não fazer retry infinito;
- preservar tenant;
- manter idempotência;
- registrar erro sanitizado.

---

### 78. Definir entradas e saídas

---

### 79. Definir critérios de aceite

---

### 80. Definir testes mínimos

---

### 81. Definir extensão opcional

Adicionar `SKIP LOCKED` e batch.

---

### 82. Evitar exercício que introduz assunto não ensinado

---

## Avaliação

### 83. Criar Assessment Plan

Arquivo:

```text
docs/teaching-method/ASSESSMENT_PLAN.md
```

---

### 84. Avaliar conceito

Pergunta:

```text
por que salvar o pedido
e publicar diretamente
nao e atomico?
```

---

### 85. Avaliar implementação

Teste e código.

---

### 86. Avaliar diagnóstico

Cenário:

```text
Outbox age cresce,
mas API continua saudavel.
```

---

### 87. Avaliar defesa

Pergunta:

```text
qual custo a Outbox adiciona?
```

---

### 88. Criar rubrica

Níveis:

- não demonstrado;
- parcial;
- adequado;
- consistente;
- consegue ensinar.

---

### 89. Não avaliar conteúdo fora do objetivo

---

### 90. Avaliar durante a aula

Checkpoint formativo permite correção antes do exercício final.

---

## Feedback

### 91. Criar Feedback Guide

Arquivo:

```text
docs/teaching-method/FEEDBACK_GUIDE.md
```

---

### 92. Começar pelo comportamento observado

```text
o teste prova persistencia,
mas ainda nao prova rollback.
```

---

### 93. Explicar impacto

```text
sem o caso de rollback,
a garantia principal permanece sem evidence.
```

---

### 94. Indicar próxima ação

```text
force uma exception
apos salvar a ordem
e confirme que nenhum registro permanece.
```

---

### 95. Evitar feedback vago

Não use apenas:

```text
ficou bom.
```

---

### 96. Separar pessoa e trabalho

---

### 97. Permitir nova tentativa

---

### 98. Registrar evolução

---

## Troubleshooting como ensino

### 99. Criar Troubleshooting Teaching Guide

Arquivo:

```text
docs/teaching-method/TROUBLESHOOTING_TEACHING_GUIDE.md
```

---

### 100. Ensinar a ler a primeira causa relevante

---

### 101. Ensinar a reproduzir

---

### 102. Ensinar a reduzir cenário

---

### 103. Ensinar a formular hipótese

---

### 104. Ensinar a observar banco, logs e métricas

---

### 105. Não corrigir imediatamente pelo aluno

Faça perguntas orientadoras.

---

### 106. Criar árvore de diagnóstico

Exemplo:

```text
mensagem nao publicada
-> existe na Outbox?
   -> nao:
      revisar transaction.
   -> sim:
      publisher executou?
      -> nao:
         revisar schedule.
      -> sim:
         broker respondeu?
```

---

## Carga cognitiva

### 107. Criar Cognitive Load Review

Arquivo:

```text
docs/teaching-method/COGNITIVE_LOAD_REVIEW.md
```

---

### 108. Limitar conceitos novos por seção

---

### 109. Remover detalhes que não ajudam o objetivo

---

### 110. Usar nomes consistentes

Não alternar `Order`, `Pedido`, `Purchase` e `Request` sem necessidade.

---

### 111. Separar código e explicação

---

### 112. Usar recapitulacões curtas

---

### 113. Criar pausas para prática

---

### 114. Revisar tamanho dos blocos de código

---

## Acessibilidade e inclusão

### 115. Criar Accessibility and Inclusion

Arquivo:

```text
docs/teaching-method/ACCESSIBILITY_AND_INCLUSION.md
```

---

### 116. Usar linguagem clara

---

### 117. Explicar siglas na primeira ocorrência

---

### 118. Fornecer texto para diagramas

---

### 119. Evitar depender somente de cor

---

### 120. Usar contraste e fonte legível

---

### 121. Fornecer comandos copiáveis

---

### 122. Descrever resultado esperado

---

### 123. Não presumir ambiente idêntico

Inclua alternativas para PowerShell e terminal quando necessário.

---

## Apoio visual

### 124. Criar Visual Support Plan

Arquivo:

```text
docs/teaching-method/VISUAL_SUPPORT_PLAN.md
```

Visuais:

- dual write;
- transação local;
- tabela Outbox;
- fluxo do publisher;
- estado pendente;
- retry;
- métricas.

---

### 125. Um visual por pergunta principal

---

### 126. Evitar diagrama decorativo

---

### 127. Manter legenda

---

### 128. Mostrar antes e depois

---

## Demonstração de código

### 129. Criar Code Demonstration Guide

Arquivo:

```text
docs/teaching-method/CODE_DEMONSTRATION_GUIDE.md
```

---

### 130. Preparar branch limpa

---

### 131. Definir checkpoints de commit

---

### 132. Digitar partes que mostram raciocínio

---

### 133. Fornecer arquivos extensos como apoio

---

### 134. Executar após mudanças pequenas

---

### 135. Mostrar erro intencional controlado

---

### 136. Corrigir com método

---

### 137. Evitar longos períodos de digitação silenciosa

---

## Tempo da aula

### 138. Criar Lesson Timing Plan

Arquivo:

```text
docs/teaching-method/LESSON_TIMING_PLAN.md
```

Aula de 90 minutos:

```text
0 a 10:
contexto e diagnostico.

10 a 25:
dual write.

25 a 40:
Outbox minima.

40 a 60:
implementacao guiada.

60 a 72:
testes e falha.

72 a 82:
exercicio.

82 a 88:
feedback.

88 a 90:
fechamento.
```

---

### 139. Definir tempo máximo por explicação

---

### 140. Preservar tempo de prática

---

### 141. Criar plano de corte

Se o tempo acabar, corte refinamentos, não o objetivo central.

---

## Teach-back

### 142. Criar Teach-Back Script

Arquivo:

```text
docs/teaching-method/TEACH_BACK_SCRIPT.md
```

---

### 143. Explicar o tema em cinco minutos

Estrutura:

- problema;
- risco;
- solução;
- fluxo;
- limite.

---

### 144. Explicar para iniciante

---

### 145. Explicar para profissional experiente

---

### 146. Comparar as duas versões

---

### 147. Pedir que o ouvinte repita com suas palavras

---

### 148. Corrigir apenas pontos essenciais primeiro

---

## Simulação de ensino

### 149. Criar Microteaching Simulation

Arquivo:

```text
docs/teaching-method/MICROTEACHING_SIMULATION.md
```

Duração:

```text
25 minutos.
```

Tema:

```text
por que usar Transactional Outbox.
```

---

### 150. Estruturar simulação

1. contexto;
2. pergunta diagnóstica;
3. falha;
4. conceito;
5. diagrama;
6. código;
7. teste;
8. limite;
9. pergunta final.

---

### 151. Gravar tela e voz

---

### 152. Pedir feedback de uma pessoa técnica

---

### 153. Pedir feedback de uma pessoa iniciante

---

### 154. Comparar dúvidas

---

### 155. Regravar apenas a parte mais confusa

---

## Scorecard

### 156. Criar Teaching Scorecard

Arquivo:

```text
docs/teaching-method/TEACHING_SCORECARD.md
```

Critérios de um a cinco:

- adequação ao público;
- objetivos;
- sequência;
- clareza;
- exemplo;
- prática;
- avaliação;
- feedback;
- troubleshooting;
- acessibilidade;
- ritmo;
- domínio técnico;
- honestidade;
- fechamento.

---

### 157. Criar Teaching Review Checklist

Arquivo:

```text
docs/teaching-method/TEACHING_REVIEW_CHECKLIST.md
```

Perguntas:

- público está claro?
- pré-requisitos são realistas?
- objetivos são observáveis?
- escopo está protegido?
- problema aparece antes da solução?
- há prática guiada?
- exercício está alinhado?
- avaliação mede o objetivo?
- feedback é específico?
- aula 716 não foi antecipada?

---

### 158. Criar Teaching Matrix

Arquivo:

```text
docs/teaching-method/TEACHING_MATRIX.md
```

Colunas:

- objetivo;
- conceito;
- exemplo;
- prática;
- exercício;
- avaliação;
- evidence;
- status.

---

### 159. Criar Teaching Risk Register

Arquivo:

```text
docs/teaching-method/TEACHING_RISK_REGISTER.md
```

Riscos:

```text
publico generico;

objetivo abstrato;

escopo excessivo;

salto conceitual;

codigo pronto;

analogia enganosa;

pratica insuficiente;

avaliacao desalinhada;

feedback vago;

aula final antecipada.
```

---

### 160. Criar Teaching Traceability

Arquivo:

```text
docs/teaching-method/TEACHING_TRACEABILITY.md
```

Exemplo:

```text
objetivo:
explicar dual write
-> exemplo de falha
-> diagrama
-> pergunta conceitual.

objetivo:
implementar Outbox
-> pratica guiada
-> teste de commit
-> exercise evidence.

objetivo:
diagnosticar backlog
-> metrica Outbox age
-> troubleshooting tree
-> scenario assessment.
```

---

### 161. Criar boundary da próxima aula

Arquivo:

```text
docs/teaching-method/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 715 define:

- audience;
- prior knowledge;
- learning objectives;
- scope;
- concept order;
- misconceptions;
- explanation framework;
- analogies;
- worked examples;
- guided practice;
- independent exercise;
- assessment;
- feedback;
- troubleshooting teaching;
- cognitive load;
- accessibility;
- visuals;
- code demonstration;
- timing;
- teach-back;
- microteaching;
- teaching scorecard.

A aula 716 define:

- final teachable lesson;
- complete lesson script;
- final diagrams;
- final code path;
- student instructions;
- exercises;
- solutions;
- assessments;
- troubleshooting;
- downloadable artifacts;
- publication review;
- final teaching delivery.

Nenhuma aula ensinavel final
e entregue nesta aula.
```

---

## Relatório e evidence

### 162. Criar report

Arquivo:

```text
reports/teaching-method-report.yaml
```

Exemplo:

```yaml
teachingMethod:
  audience:
    defined:
      true
    priorKnowledge:
      PASS

  objectives:
    total:
      measured
    observable:
      measured
    aligned:
      measured

  design:
    scope:
      PASS
    conceptOrder:
      PASS
    workedExample:
      PASS
    guidedPractice:
      PASS
    independentExercise:
      PASS
    assessment:
      PASS
    feedback:
      PASS
    accessibility:
      PASS

  simulation:
    completed:
      true
    durationMinutes:
      measured
    technicalReview:
      PASS
    beginnerReview:
      PASS

  finalTeachableLesson:
    completed:
      false

  gate:
    PASS
```

---

### 163. Criar evidence

Arquivo:

```text
contracts/teaching-method-evidence.yaml
```

Campos:

- lesson;
- project;
- audience profile status;
- prior knowledge count;
- diagnostic question count;
- learning objective count;
- observable objective count;
- concept count;
- misconception count;
- worked example status;
- guided step count;
- independent exercise status;
- acceptance criterion count;
- assessment item count;
- feedback example count;
- troubleshooting branch count;
- accessibility check count;
- visual count;
- demonstration checkpoint count;
- planned duration;
- actual microteaching duration;
- technical review status;
- beginner review status;
- average score;
- lowest criterion;
- highest criterion;
- final teachable lesson completed;
- documentation status;
- gate status;
- timestamp.

---

### 164. Criar gate

Status:

```text
PASS;

FAIL_AUDIENCE;

FAIL_PRIOR_KNOWLEDGE;

FAIL_DIAGNOSTIC;

FAIL_LEARNING_OBJECTIVES;

FAIL_SCOPE;

FAIL_CONCEPT_ORDER;

FAIL_MISCONCEPTIONS;

FAIL_EXPLANATION_FRAMEWORK;

FAIL_ANALOGY;

FAIL_WORKED_EXAMPLE;

FAIL_GUIDED_PRACTICE;

FAIL_INDEPENDENT_EXERCISE;

FAIL_ASSESSMENT;

FAIL_FEEDBACK;

FAIL_TROUBLESHOOTING_TEACHING;

FAIL_COGNITIVE_LOAD;

FAIL_ACCESSIBILITY;

FAIL_VISUAL_SUPPORT;

FAIL_CODE_DEMONSTRATION;

FAIL_TIMING;

FAIL_TEACH_BACK;

FAIL_MICROTEACHING;

FAIL_TECHNICAL_REVIEW;

FAIL_BEGINNER_REVIEW;

FAIL_FINAL_LESSON_ANTICIPATION;

INCONCLUSIVE.
```

---

### 165. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\teaching-method\collect-teaching-sources.ps1

.\scripts\teaching-method\validate-learning-objectives.ps1

.\scripts\teaching-method\validate-concept-order.ps1

.\scripts\teaching-method\validate-exercise-alignment.ps1

.\scripts\teaching-method\run-microteaching-review.ps1

.\scripts\teaching-method\collect-teaching-evidence.ps1
```

---

### 166. Executar microteaching

---

### 167. Revisar gravação sem áudio

Observe dependência de fala para entender os visuais.

---

### 168. Revisar somente o áudio

Observe se a explicação continua coerente sem a tela.

---

### 169. Revisar velocidade

---

### 170. Revisar perguntas

---

### 171. Revisar tempo de prática

---

### 172. Regravar o trecho mais fraco

---

### 173. Encerrar o laboratório

Confirme:

- Charter;
- audience;
- prior knowledge;
- objectives;
- scope;
- dependencies;
- misconceptions;
- explanation;
- analogy;
- worked example;
- guided practice;
- independent exercise;
- assessment;
- feedback;
- troubleshooting;
- cognitive load;
- accessibility;
- visual support;
- code demonstration;
- timing;
- teach-back;
- microteaching;
- reviews;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 716 preservada.

---

## Entendendo o que foi feito

### O conhecimento ganhou público

A profundidade passou a ser definida por quem aprende.

### Os objetivos ficaram observáveis

“Entender” foi substituído por explicar, implementar, testar e diagnosticar.

### O conteúdo ganhou sequência

Cada conceito passou a depender apenas do que veio antes.

### Os erros viraram material de ensino

Misconceptions foram usados para criar perguntas e checkpoints.

### O exemplo passou a mostrar raciocínio

A solução deixou de aparecer pronta.

### A prática ganhou progressão

Orientação detalhada foi reduzida gradualmente.

### A avaliação ganhou alinhamento

Conceito, implementação, diagnóstico e defesa foram observados separadamente.

### O feedback ganhou ação

O aluno passou a saber exatamente o próximo passo.

### A explicação ganhou revisão

Áudio, vídeo, ritmo e dúvidas foram avaliados.

---

## Erros comuns importantes

### Ensinar para todo mundo

A profundidade fica inconsistente.

### Criar muitos objetivos

A aula perde foco.

### Começar pela anotação

O aluno não vê o problema.

### Mostrar código completo

O raciocínio desaparece.

### Usar analogia sem limite

A simplificação vira erro.

### Fazer exercício diferente da prática

O aluno encontra assunto novo na avaliação.

### Dar feedback genérico

Não existe próxima ação clara.

### Corrigir tudo pelo aluno

Ele não aprende troubleshooting.

### Usar diagrama decorativo

O visual não responde pergunta.

### Produzir a aula final agora

Essa etapa pertence à aula 716.

---

## Comandos úteis

### Validar objetivos

```powershell
.\scripts\teaching-method\validate-learning-objectives.ps1
```

### Validar sequência

```powershell
.\scripts\teaching-method\validate-concept-order.ps1
```

### Validar exercício

```powershell
.\scripts\teaching-method\validate-exercise-alignment.ps1
```

### Coletar evidence

```powershell
.\scripts\teaching-method\collect-teaching-evidence.ps1
```

---

## Exercício principal

Prepare e grave uma microaula de vinte e cinco minutos sobre Transactional Outbox.

Inclua:

1. definir o público;
2. listar pré-requisitos;
3. criar diagnóstico;
4. definir três objetivos;
5. proteger escopo;
6. mostrar dual write;
7. criar exemplo de falha;
8. introduzir Outbox;
9. usar diagrama;
10. mostrar código incompleto;
11. perguntar o risco;
12. implementar transaction boundary;
13. executar teste de sucesso;
14. executar teste de rollback;
15. explicar limite;
16. propor prática guiada;
17. propor exercício;
18. definir critérios;
19. dar feedback simulado;
20. executar troubleshooting;
21. fazer teach-back;
22. gravar;
23. pedir revisão técnica;
24. pedir revisão iniciante;
25. ajustar o trecho mais fraco.

Não produza ainda a aula final completa da etapa 716.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 714 e ponte para a aula 716 foram preservadas;
- Teaching Charter foi criado;
- Audience Profile foi criado;
- objetivo profissional, contexto e limitações do aluno foram registrados;
- público genérico foi evitado;
- Prior Knowledge Map foi criado;
- conhecimentos obrigatórios, úteis e novos foram listados;
- diagnóstico inicial foi criado;
- recuperação de pré-requisito foi definida;
- Learning Objectives foi criado;
- verbos observáveis foram usados;
- objetivos conceitual, prático, diagnóstico e defesa foram definidos;
- quantidade de objetivos foi limitada;
- critério de domínio foi definido;
- Content Scope foi criado;
- conteúdo principal, secundário e fora de escopo foram definidos;
- estacionamento de dúvidas foi criado;
- Concept Dependency Map foi criado;
- sequência foi validada;
- pontes foram criadas;
- saltos cognitivos foram revisados;
- Misconception Catalog foi criado;
- dual write, Outbox, retry, duplicidade e estado pendente foram tratados;
- misconceptions foram convertidas em perguntas;
- Explanation Framework foi criado;
- contexto, problema, falha, conceito, solução, implementação, teste, limite, exercício e fechamento foram definidos;
- Analogy Policy foi criada;
- analogia foi limitada e conectada ao sistema;
- Worked Example Plan foi criado;
- código incompleto e solução transacional foram apresentados;
- dependências, sucesso, rollback e limite foram explicados;
- Guided Practice Plan foi criado;
- etapas curtas, previsão, execução, comparação e checkpoints foram definidos;
- autonomia foi aumentada gradualmente;
- Independent Exercise Plan foi criado;
- enunciado, restrições, entradas, saídas, critérios, testes e extensão foram definidos;
- assunto não ensinado foi evitado;
- Assessment Plan foi criado;
- conceito, implementação, diagnóstico e defesa foram avaliados;
- rubrica foi criada;
- avaliação fora do objetivo foi evitada;
- Feedback Guide foi criado;
- comportamento, impacto e próxima ação foram usados;
- feedback vago foi evitado;
- nova tentativa foi permitida;
- evolução foi registrada;
- Troubleshooting Teaching Guide foi criado;
- reprodução, hipótese, observação e árvore de diagnóstico foram ensinadas;
- correção imediata pelo professor foi evitada;
- Cognitive Load Review foi criado;
- conceitos, nomes, blocos e pausas foram revisados;
- Accessibility and Inclusion foi criado;
- linguagem, siglas, diagramas, cores, contraste, comandos e ambientes foram tratados;
- Visual Support Plan foi criado;
- visuais responderam perguntas reais;
- legenda e antes/depois foram usados;
- Code Demonstration Guide foi criado;
- branch, commits, digitação, apoio, execução, erro e correção foram planejados;
- Lesson Timing Plan foi criado;
- prática e plano de corte foram preservados;
- Teach-Back Script foi criado;
- versões para iniciante e experiente foram comparadas;
- repetição com palavras do aluno foi usada;
- Microteaching Simulation foi criada;
- simulação de vinte e cinco minutos foi executada;
- tela e voz foram gravadas;
- revisões técnica e iniciante foram solicitadas;
- trecho confuso foi regravado;
- Teaching Scorecard foi criado;
- Teaching Review Checklist foi criado;
- Teaching Matrix foi criada;
- Teaching Risk Register foi criado;
- Teaching Traceability foi criada;
- boundary da aula 716 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- gravação foi revisada sem áudio e somente em áudio;
- velocidade, perguntas e prática foram revisadas;
- commit recomendado e diário de bordo estão presentes;
- aula ensinável final não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\teaching-method\validate-learning-objectives.ps1

.\scripts\teaching-method\validate-exercise-alignment.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/teaching-method `
  scripts/teaching-method `
  reports/teaching-method-report.yaml `
  contracts/teaching-method-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|realTenant|realCustomer|final-teachable-lesson"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(teaching): design OrderFlow learning method"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- secret;
- dado real de cliente;
- aula final pronta da etapa 716;
- solução sem contexto pedagógico.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu como transformar conhecimento técnico em aprendizado estruturado.

Você criou:

```text
audience profile;

prior knowledge map;

learning objectives;

content scope;

concept dependency map;

misconception catalog;

explanation framework;

analogy policy;

worked example;

guided practice;

independent exercise;

assessment;

feedback;

troubleshooting teaching;

cognitive load review;

accessibility;

visual support;

code demonstration;

timing;

teach-back;

microteaching;

scorecard;

report e evidence.
```

Agora você possui um método para ensinar sem despejar conteúdo, sem pular etapas e sem esconder o raciocínio.

A próxima aula será:

```text
716 - M20.46 - Aula ensinavel final
```

Nela, você aplicará todo esse método para criar uma aula completa, pronta para um aluno estudar, executar, praticar e revisar.

Nenhuma aula ensinável final foi entregue nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini o público.
- [ ] Mapeei pré-requisitos.
- [ ] Criei objetivos observáveis.
- [ ] Protegi o escopo.
- [ ] Ordenei conceitos.
- [ ] Registrei misconceptions.
- [ ] Criei exemplo resolvido.
- [ ] Criei prática guiada.
- [ ] Criei exercício independente.
- [ ] Alinhei avaliação.
- [ ] Estruturei feedback.
- [ ] Revisei carga cognitiva.
- [ ] Revisei acessibilidade.
- [ ] Gravei microteaching.
- [ ] Preservei a aula final para a etapa 716.

---

## Troubleshooting adicional

### A explicação ficou longa

Volte aos objetivos e corte detalhes secundários.

### O aluno não entendeu Outbox

Mostre primeiro a falha de dual write.

### O código ocupa quase toda a aula

Forneça apoio e digite apenas decisões centrais.

### O exercício parece difícil demais

Compare com a prática guiada e reduza o salto.

### O aluno copia sem compreender

Peça previsão antes da execução.

### O feedback gera frustração

Seja específico, respeitoso e acionável.

### A gravação depende demais da tela

Melhore a explicação verbal.

### O áudio fica confuso sem diagrama

Nomeie componentes e fluxo explicitamente.

### Faltou tempo

Use o plano de corte e preserve o objetivo.

### Quero publicar a aula agora

Essa etapa pertence à aula 716.

---

## Perguntas de revisão

1. Saber fazer significa saber ensinar?
2. O que define profundidade?
3. Objetivo deve usar qual tipo de verbo?
4. Por que proteger escopo?
5. O que concept map evita?
6. O que misconception oferece?
7. Quando apresentar o nome do conceito?
8. Analogia substitui definição?
9. O que worked example precisa mostrar?
10. Prática guiada termina com autonomia?
11. Exercício pode cobrar assunto novo?
12. Avaliação deve medir o quê?
13. Feedback começa por elogio genérico?
14. O professor deve corrigir tudo?
15. O que carga cognitiva controla?
16. Por que revisar acessibilidade?
17. O visual precisa responder o quê?
18. Quando refazer uma demonstração?
19. O que teach-back verifica?
20. Por que revisar sem áudio?
21. O que scorecard mede?
22. O que a aula 716 fará?
23. O que não foi entregue?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Público e objetivo.
3. Observável.
4. Manter foco.
5. Saltos.
6. Diagnóstico.
7. Após o problema.
8. Não.
9. Raciocínio.
10. Sim.
11. Não.
12. Objetivos.
13. Não.
14. Não.
15. Quantidade de novidade.
16. Permitir acesso.
17. Uma pergunta.
18. Quando ficou confusa.
19. Compreensão.
20. Validar visuais.
21. Qualidade do ensino.
22. Criar aula final.
23. Aula ensinável final.
24. Aula ensinavel final.
25. Selecionar, sequenciar, praticar e avaliar.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 715 - M20.45 - Como ensinar o que aprendeu

- Continuei após System design interview.
- Criei Teaching Charter.
- Criei Audience Profile.
- Defini objetivo, contexto e limitações do aluno.
- Evitei público genérico.
- Criei Prior Knowledge Map.
- Separei conhecimentos obrigatórios, úteis e novos.
- Criei diagnóstico inicial.
- Defini recuperação de pré-requisitos.
- Criei Learning Objectives.
- Usei verbos observáveis.
- Criei objetivos conceitual, prático, diagnóstico e defesa.
- Limitei a quantidade de objetivos.
- Criei critério de domínio.
- Criei Content Scope.
- Defini conteúdo principal, secundário e fora de escopo.
- Criei estacionamento de dúvidas.
- Criei Concept Dependency Map.
- Ordenei pedido, transação, evento, dual write, Outbox, publisher, retry, observabilidade e reconciliação.
- Criei pontes entre conceitos.
- Revisei saltos cognitivos.
- Criei Misconception Catalog.
- Tratei dual write, duplicidade, retry e status pendente.
- Transformei misconceptions em perguntas.
- Criei Explanation Framework.
- Organizei contexto, problema, falha, conceito, solução, implementação, teste, limite, exercício e fechamento.
- Criei Analogy Policy.
- Usei analogia com limite.
- Criei Worked Example Plan.
- Mostrei código incompleto e transaction boundary.
- Planejei testes de sucesso e rollback.
- Criei Guided Practice Plan.
- Dividi prática em etapas curtas.
- Usei previsão, execução, comparação e checkpoint.
- Aumentei autonomia gradualmente.
- Criei Independent Exercise Plan.
- Defini retry, restrições, critérios e testes.
- Criei Assessment Plan.
- Avaliei conceito, implementação, diagnóstico e defesa.
- Criei rubrica.
- Criei Feedback Guide.
- Usei comportamento, impacto e próxima ação.
- Permiti nova tentativa.
- Criei Troubleshooting Teaching Guide.
- Ensinei reprodução, hipótese, observação e árvore de diagnóstico.
- Criei Cognitive Load Review.
- Revisei conceitos, nomes, blocos e pausas.
- Criei Accessibility and Inclusion.
- Revisei linguagem, siglas, contraste, comandos e ambientes.
- Criei Visual Support Plan.
- Criei Code Demonstration Guide.
- Preparei branch, checkpoints, erro e correção.
- Criei Lesson Timing Plan.
- Preservei prática e plano de corte.
- Criei Teach-Back Script.
- Expliquei para iniciante e experiente.
- Criei Microteaching Simulation.
- Gravei vinte e cinco minutos.
- Solicitei revisão técnica e iniciante.
- Regravei o trecho mais confuso.
- Criei Teaching Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 716.
- Criei report, evidence e gate.
- Revisei gravação sem áudio e somente com áudio.
- Revisei velocidade, perguntas e prática.
- Não antecipei a aula ensinável final.
- Próxima aula: Aula ensinavel final.
```

---

## Referência técnica curta

- Audience.
- Prior Knowledge.
- Learning Objective.
- Observable Verb.
- Scope.
- Concept Dependency.
- Misconception.
- Worked Example.
- Guided Practice.
- Independent Practice.
- Assessment.
- Rubric.
- Feedback.
- Cognitive Load.
- Accessibility.
- Teach-Back.
- Microteaching.
- Teaching Evidence.

Regra final:

```text
O metodo de ensino do OrderFlow deve transformar dominio tecnico em aprendizagem verificavel: audience profile define experiencia, objetivo, ambiente and limitations, prior knowledge map separa prerequisites, useful knowledge and new concepts, diagnostic questions identificam gaps antes da pratica, learning objectives usam observable verbs para explain, implement, test, diagnose and defend, content scope protege dual write, local transaction, Outbox, publisher, retry, observability and reconciliation enquanto detalhes avancados ficam fora, concept dependency map ordena cada ideia e cria pontes, misconception catalog transforma erros comuns em perguntas, explanation framework apresenta contexto, falha, conceito, solucao minima, implementation, tests, limits, exercise and closure, analogies apoiam sem substituir o modelo real, worked example mostra codigo incompleto, failure, transaction boundary, success and rollback, guided practice divide a implementacao em passos e aumenta autonomia, independent exercise adiciona retry com criteria and tests sem introduzir assunto novo, assessment mede concept, implementation, diagnosis and defense, feedback usa observed behavior, impact and next action, troubleshooting ensina reproduction, hypothesis, evidence and diagnostic trees, cognitive load controla quantidade de novidade, naming, code size and pauses, accessibility garante linguagem, siglas, contraste, text alternatives, copyable commands and environment options, visual support responde perguntas reais, code demonstration expõe raciocinio sem longos periodos silenciosos, timing preserva practice and closure, teach-back verifica compreensao em niveis diferentes, microteaching de vinte e cinco minutos gera technical and beginner feedback, scorecard, report and evidence fecham o gate, enquanto lesson script completo, final diagrams, student artifacts, exercises, solutions and publication review permanecem reservados para a aula 716.
```
