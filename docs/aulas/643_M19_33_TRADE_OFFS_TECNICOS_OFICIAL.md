# 643 - M19.33 - Trade offs tecnicos

## Apresentação da aula

Na aula 642, você submeteu o design de `Service Scheduling` a uma revisão arquitetural completa.

Você analisou capacidade, headroom, gargalos, hot spots, consistência, falhas, modos degradados, RTO, RPO, segurança, observabilidade, deployment, custo e evolução. O desenho deixou de ser apenas funcional e passou a explicar como cresce, falha, recupera e opera.

Agora surge um problema diferente.

Em arquitetura, frequentemente existem duas ou mais alternativas tecnicamente válidas.

Você pode:

```text
processar uma confirmação de forma síncrona
ou publicar trabalho assíncrono;

usar leitura no estado autoritativo
ou em uma projeção eventual;

escalar verticalmente
ou horizontalmente;

construir uma capacidade internamente
ou contratar um serviço gerenciado;

manter um componente simples
ou introduzir uma plataforma mais poderosa.
```

A pergunta madura não é:

```text
qual tecnologia é melhor?
```

A pergunta madura é:

```text
qual alternativa atende melhor
as forças deste contexto,
com quais custos,
riscos,
limites,
evidências
e condições de revisão?
```

Trade-off técnico é uma troca consciente entre qualidades, custos e riscos. Melhorar uma dimensão pode piorar outra. Reduzir latência pode aumentar acoplamento. Ganhar disponibilidade pode aceitar staleness. Aumentar isolamento pode elevar custo e complexidade. Adotar uma solução gerenciada pode reduzir operação e aumentar dependência externa.

Uma lista de vantagens e desvantagens não é suficiente. Uma decisão profissional precisa declarar problema, contexto, restrições, alternativas, critérios, pesos, evidências, incertezas, reversibilidade, riscos, custo de transição, gatilhos de revisão e experimento necessário.

A pergunta desta aula será:

```text
como comparar alternativas técnicas
sem escolher por preferência pessoal,
moda,
medo,
autoridade
ou pontuação enganosa?
```

O laboratório será:

```text
labs/m19/aula-643-trade-offs-tecnicos/service-scheduling-trade-off-analysis
```

Você criará um framework de comparação para `Service Scheduling`, avaliará alternativas para o fluxo de confirmação, construirá uma matriz ponderada, registrará evidências e incertezas, executará análise de sensibilidade, modelará reversibilidade, calculará custo operacional, criará experimentos, reports, evidence e gate.

A próxima aula será:

```text
644 - M19.34 - ADR
```

Nela, você aprenderá a registrar decisões arquiteturais de forma durável e evolutiva. Nesta aula, você produzirá artefatos de análise, mas o formato completo de Architecture Decision Record ficará reservado para a aula 644.

Regra central:

```text
uma decisão técnica não é boa
porque venceu uma votação,
recebeu a maior nota
ou usa a tecnologia mais moderna;

ela é defensável
quando explicita contexto,
forças,
alternativas,
evidências,
riscos,
reversibilidade
e condições de revisão.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
641 Design de sistemas parte 1;
642 Design de sistemas parte 2;
643 Trade offs tecnicos;
644 ADR;
645 RFC tecnico;
646 C4 Model.
```

As aulas 641 e 642 construíram e pressionaram um design. Agora você aprenderá a comparar opções dentro desse design.

Você reutilizará conhecimentos anteriores:

- requisitos funcionais e requisitos de qualidade;
- SLI, SLO e error budget;
- consistência eventual, CAP e PACELC;
- idempotência;
- multi-tenancy;
- escalabilidade;
- resiliência;
- segurança;
- observabilidade;
- deployment e recovery;
- custo e operação.

Esses conhecimentos serão tratados como forças e critérios, não como checklists automáticos.

A decisão precisa respeitar o estágio do produto, o volume real, o tamanho do time, a capacidade operacional, o risco de negócio, as restrições legais e a estratégia de evolução.

ADR fica para a aula 644. RFC técnico fica para a aula 645. Nesta aula, o foco é o raciocínio comparativo que alimentará esses documentos.

---

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-643-trade-offs-tecnicos/service-scheduling-trade-off-analysis
```

Estrutura principal:

```text
service-scheduling-trade-off-analysis
├── pom.xml
├── README.md
├── src
│   ├── main/java/br/com/formacao/tradeoff
│   │   ├── problem
│   │   ├── option
│   │   ├── criterion
│   │   ├── evidence
│   │   ├── risk
│   │   ├── reversibility
│   │   ├── analysis
│   │   ├── experiment
│   │   └── gate
│   └── test/java/br/com/formacao/tradeoff
├── tradeoffs
├── contracts
└── reports
```

Em `tradeoffs`, ficarão problema, forças, alternativas, critérios, evidências, riscos, sensibilidade, experimento e recomendação. Em `contracts`, ficarão regras verificáveis. O código Java representará pontuação, confiança, risco, reversibilidade e gate.

Scripts:

```text
scripts/m19/service-scheduling-trade-offs
├── validate-trade-off-contract.ps1
├── validate-context-and-forces.ps1
├── validate-options-and-baseline.ps1
├── validate-criteria-and-weights.ps1
├── validate-evidence-quality.ps1
├── validate-risk-and-reversibility.ps1
├── validate-sensitivity-analysis.ps1
├── validate-experiment-plan.ps1
├── run-trade-off-tests.ps1
├── collect-trade-off-evidence.ps1
└── verify-trade-off-gate.ps1
```

---

## Conceito essencial

### Trade-off não é lista de prós e contras

Uma lista de prós e contras normalmente mistura fatos, opiniões, consequências e preferências sem declarar importância ou evidência.

Exemplo fraco:

```text
Mensageria é escalável.
Mensageria é complexa.
Síncrono é simples.
Síncrono é acoplado.
```

Essas frases não informam volume, SLO, criticidade, tamanho do time, confiabilidade exigida, custo, falhas ou prazo.

Uma análise profissional pergunta:

```text
qual operação está sendo decidida;
qual problema existe hoje;
qual baseline está em produção;
quais restrições não podem ser violadas;
quais forças entram em tensão;
quais opções são realmente viáveis;
qual evidência sustenta cada avaliação;
qual risco permanece;
quanto custa mudar;
quanto custa voltar;
quando a decisão precisa ser revista.
```

### Forças

Forças são pressões que influenciam a decisão.

Exemplos:

```text
p95 de confirmação abaixo de 700 ms;
nenhuma dupla reserva;
pico de 300 confirmações por segundo;
dependência externa com disponibilidade de 99,5%;
time de quatro desenvolvedores;
janela de entrega de oito semanas;
necessidade de auditoria;
limite mensal de custo;
capacidade de suporte 24x7 reduzida.
```

Forças podem entrar em conflito. A análise existe para tornar esse conflito visível.

### Critério, peso e evidência

Critério é a dimensão avaliada, como latência, consistência, disponibilidade, custo ou operabilidade.

Peso representa a importância relativa no contexto. Não representa uma verdade universal.

Evidência representa a qualidade do conhecimento disponível.

Uma pontuação alta baseada em opinião não deve superar uma pontuação moderada baseada em teste real sem que a incerteza seja explicitada.

### Reversibilidade

Decisões reversíveis permitem testar, observar e voltar com custo controlado. Decisões difíceis de reverter exigem mais evidência e governança.

Exemplos de baixa reversibilidade:

```text
alterar modelo de dados central;
introduzir fornecedor com formato proprietário;
quebrar contrato público;
distribuir ownership de escrita;
migrar milhares de tenants;
substituir identidade central;
criar dependência organizacional permanente.
```

### Sensibilidade

Uma matriz ponderada pode produzir uma falsa sensação de precisão.

Análise de sensibilidade pergunta:

```text
se o peso de latência mudar,
a recomendação muda?

se o custo operacional for maior,
a opção ainda vence?

se o volume real for metade,
a complexidade continua justificada?

se a dependência externa melhorar,
o resultado se altera?
```

Se pequenas mudanças invertem a decisão, a recomendação é frágil e precisa de experimento ou revisão.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-643-trade-offs-tecnicos/service-scheduling-trade-off-analysis

Set-Location `
  labs/m19/aula-643-trade-offs-tecnicos/service-scheduling-trade-off-analysis
```

---

### 2. Criar o Trade-off Charter

Arquivo:

```text
tradeoffs/TRADE_OFF_CHARTER.md
```

Conteúdo:

```markdown
# Trade-off Charter

Contexto
--------

Service Scheduling.

Decisão analisada
-----------------

Como concluir a confirmação
do Appointment
e executar efeitos secundários.

Baseline
--------

Fluxo síncrono único.

Alternativas
------------

- síncrono orquestrado;
- commit síncrono com efeitos assíncronos;
- processamento assíncrono integral.

Obrigatório
-----------

- problema explícito;
- forças;
- restrições;
- baseline;
- opções viáveis;
- critérios e pesos;
- evidências;
- riscos;
- reversibilidade;
- sensibilidade;
- experimento;
- gatilhos de revisão.

Fora de escopo
---------------

- ADR completo;
- RFC completo;
- seleção comercial de fornecedor;
- decisão organizacional definitiva.
```

O charter impede que a análise vire comparação genérica de tecnologias.

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/trade-off-contract.yaml
```

Conteúdo:

```yaml
tradeOff:
  context:
    Service-Scheduling

  required:
    - decision-problem
    - current-baseline
    - forces
    - constraints
    - assumptions
    - viable-options
    - evaluation-criteria
    - weight-rationale
    - scoring-guide
    - evidence
    - uncertainty
    - risk
    - reversibility
    - operational-cost
    - sensitivity-analysis
    - experiment-plan
    - review-triggers
    - tests
    - gate

  forbidden:
    - technology-fashion
    - preference-as-evidence
    - option-without-baseline-comparison
    - score-without-rationale
    - hidden-constraint
    - irreversible-choice-with-weak-evidence
    - fake-decimal-precision
    - ADR-deep-dive
    - RFC-deep-dive

  nextLesson:
    code:
      M19.34
```

---

### 4. Definir o problema de decisão

Arquivo:

```text
tradeoffs/DECISION_PROBLEM.md
```

Registre:

```text
Hoje, a confirmação de Appointment
atualiza estado,
reserva capacidade,
registra auditoria,
solicita notificação
e atualiza projeções
no mesmo fluxo síncrono.

Em picos,
dependências secundárias
aumentam latência
e propagam falhas.

A decisão é definir
qual parte precisa terminar
antes da resposta ao cliente
e qual parte pode ocorrer depois.
```

O problema deve descrever consequência observável, não uma tecnologia desejada.

Evite:

```text
Precisamos usar Kafka.
```

Prefira:

```text
Precisamos reduzir acoplamento temporal
e impedir que indisponibilidade de notificação
bloqueie a confirmação,
sem perder auditoria,
ordem relevante
ou rastreabilidade.
```

---

### 5. Declarar contexto e forças

Arquivo:

```text
tradeoffs/CONTEXT_AND_FORCES.md
```

Forças do cenário:

```text
SLO de confirmação:
p95 <= 700 ms.

Taxa de erro:
< 0,5%.

Consistência:
status e reserva precisam confirmar juntos.

Disponibilidade:
notificação não pode bloquear confirmação.

Volume atual:
40 confirmações por segundo.

Pico projetado:
300 confirmações por segundo.

Operação:
time pequeno,
plantão limitado.

Auditoria:
toda confirmação precisa de trilha.

Custo:
solução deve caber no orçamento anual.

Prazo:
primeira evolução em oito semanas.
```

Cada força precisa de fonte ou classificação de incerteza.

---

### 6. Declarar restrições e premissas

Arquivo:

```text
tradeoffs/CONSTRAINTS_AND_ASSUMPTIONS.md
```

Exemplo:

```text
Restrição:
Appointment e Capacity Reservation
permanecem no mesmo banco
nesta etapa.

Restrição:
contrato HTTP público
não pode mudar no trimestre atual.

Premissa:
o broker interno atende
pelo menos 1.000 mensagens por segundo.

Premissa:
a notificação aceita atraso de até 30 segundos.

Premissa:
o time domina Java,
PostgreSQL e mensageria básica.
```

Restrição é condição obrigatória. Premissa é algo considerado verdadeiro e que pode estar errado.

Premissas críticas precisam de validação.

---

### 7. Definir o baseline

Toda comparação precisa incluir o estado atual.

Baseline:

```text
A confirmação executa:

1. validação;
2. reserva;
3. mudança de status;
4. auditoria;
5. chamada de notificação;
6. atualização de projeção;
7. resposta.
```

Métricas atuais:

```text
p95:
1.250 ms.

Erro em pico:
2,1%.

Falhas por notificação indisponível:
38% dos erros.

Operação:
simples de entender,
mas com forte acoplamento temporal.
```

Sem baseline, a equipe compara opções entre si e ignora que “não mudar” também possui custo e risco.

---

### 8. Catalogar opções viáveis

Arquivo:

```text
tradeoffs/OPTIONS_CATALOG.md
```

Opção A — síncrono orquestrado:

```text
Status, reserva, auditoria,
notificação e projeção
continuam antes da resposta.

Melhorias:
timeouts,
bulkheads,
retries controlados
e circuit breaker.
```

Opção B — commit síncrono com efeitos assíncronos:

```text
Status,
reserva
e outbox
confirmam na mesma transação.

Notificação
e projeções
ocorrem após o commit.
```

Opção C — processamento assíncrono integral:

```text
A API aceita o comando,
retorna 202
e todo o processamento
ocorre por fila.
```

As três opções são tecnicamente possíveis. Isso não significa que são igualmente adequadas.

---

### 9. Definir critérios de avaliação

Arquivo:

```text
tradeoffs/EVALUATION_CRITERIA.md
```

Critérios:

```text
correção de status e reserva;
latência de confirmação;
disponibilidade da operação;
capacidade de absorver pico;
complexidade de implementação;
complexidade operacional;
observabilidade;
recuperação de falhas;
custo de infraestrutura;
tempo de entrega;
reversibilidade;
experiência do cliente.
```

Critérios devem ser independentes o suficiente para evitar contagem duplicada.

“Escalabilidade”, “performance” e “capacidade” podem representar a mesma preocupação se não forem definidos.

---

### 10. Definir pesos

Arquivo:

```text
tradeoffs/WEIGHT_RATIONALE.md
```

Exemplo:

```text
Correção:
20.

Latência:
15.

Disponibilidade:
15.

Capacidade:
10.

Complexidade operacional:
10.

Recuperação:
10.

Tempo de entrega:
8.

Custo:
5.

Reversibilidade:
5.

Experiência do cliente:
2.
```

Total:

```text
100.
```

O peso de correção é maior porque dupla reserva ou status contraditório gera impacto operacional alto.

O peso não deve ser ajustado depois de ver qual opção vence apenas para justificar uma preferência.

---

### 11. Definir escala de pontuação

Arquivo:

```text
tradeoffs/SCORING_GUIDE.md
```

Escala:

```text
0:
viola requisito obrigatório.

1:
resultado muito fraco
ou risco não controlado.

2:
atende parcialmente
com limitações relevantes.

3:
atende ao esperado
com riscos conhecidos.

4:
atende bem
com evidência suficiente.

5:
atende de forma excelente
com evidência forte
e operação comprovada.
```

Evite notas como `4,73`. A precisão aparente não representa precisão real.

---

### 12. Criar catálogo de evidências

Arquivo:

```text
tradeoffs/EVIDENCE_CATALOG.md
```

Níveis:

```text
E0:
opinião sem validação.

E1:
documentação,
experiência indireta
ou estimativa fundamentada.

E2:
protótipo local
ou benchmark controlado.

E3:
teste próximo do ambiente real.

E4:
evidência de produção
representativa e recente.
```

Exemplos:

```text
EV-001:
baseline de p95 em produção,
E4.

EV-002:
teste de carga da opção B,
E3.

EV-003:
estimativa de custo do broker,
E1.

EV-004:
chaos test com notificação indisponível,
E2.
```

---

### 13. Aplicar penalidade de incerteza

Pontuação e confiança são dimensões diferentes.

Uma opção pode receber nota 5 em capacidade, mas baseada apenas em E0.

Exemplo de fator de confiança:

```text
E0:
0,60.

E1:
0,75.

E2:
0,85.

E3:
0,95.

E4:
1,00.
```

Cálculo:

```text
score ajustado =
score bruto
x peso
x fator de confiança.
```

Não use o número como verdade absoluta. Ele serve para revelar onde a recomendação depende de conhecimento fraco.

---

### 14. Calcular pontuação ponderada

```java
package br.com.formacao.tradeoff.analysis;

public final class TradeOffAnalyzer {

    private final UncertaintyPenalty penalty;

    public WeightedScore calculate(
            OptionAssessment assessment) {

        double raw =
                assessment.score().value()
                        * assessment.criterion()
                                .weight()
                                .value();

        double adjusted =
                raw * penalty.factorFor(
                        assessment.evidence().level());

        return new WeightedScore(
                assessment.optionId(),
                assessment.criterion().id(),
                raw,
                adjusted);
    }
}
```

O resultado deve manter score bruto e ajustado para não esconder a incerteza.

---

### 15. Criar matriz inicial

Exemplo resumido:

```text
Critério                 A     B     C
Correção                 4     5     3
Latência                 2     5     4
Disponibilidade          2     5     5
Capacidade               2     5     5
Complexidade operacional 4     3     2
Recuperação              3     4     3
Tempo de entrega         5     4     2
Custo                    4     3     2
Reversibilidade          4     4     2
Experiência do cliente   4     5     2
```

A opção B tende a se destacar, mas a matriz ainda não é decisão.

É necessário verificar requisitos eliminatórios, evidência, risco, reversibilidade e sensibilidade.

---

### 16. Aplicar critérios eliminatórios

Alguns critérios não podem ser compensados por pontos em outras dimensões.

Exemplo:

```text
status e reserva
precisam confirmar atomicamente.
```

Se a opção C aceitar comando sem garantir um caminho seguro para reserva e resposta de estado, ela não pode vencer apenas porque escala melhor.

Arquivo:

```text
contracts/criteria-policy.yaml
```

Conteúdo:

```yaml
criteria:
  mandatory:
    - atomic-status-and-reservation
    - audit-trail
    - tenant-isolation
    - no-false-success

  violation:
    action:
      DISQUALIFY

  compensatingHighScore:
    allowed:
      false

  weights:
    total:
      100

  scoreWithoutEvidence:
    allowed:
      false
```

---

### 17. Avaliar latência

Opção A:

```text
continua aguardando dependências;
p95 estimado em 900 ms;
evidência E2.
```

Opção B:

```text
responde após commit local e outbox;
p95 medido em 420 ms;
evidência E3.
```

Opção C:

```text
aceitação em 120 ms;
mas o cliente ainda não possui
resultado final da confirmação.
```

Não compare `202 Accepted` com confirmação concluída como se fossem a mesma experiência.

---

### 18. Avaliar consistência e correção

Opção A mantém tudo síncrono, mas o rollback de efeitos externos não é garantido.

Opção B mantém estado crítico e outbox na mesma transação; efeitos derivados convergem depois.

Opção C exige status intermediário, polling, deduplicação, timeout de processamento e semântica clara de aceite.

A análise deve comparar semânticas equivalentes.

---

### 19. Avaliar disponibilidade

Opção A herda indisponibilidade de dependências secundárias.

Opção B desacopla notificação e projeção da resposta crítica.

Opção C continua aceitando comandos enquanto workers estão indisponíveis, mas pode acumular backlog e atrasar conclusão.

Disponibilidade de aceite não é disponibilidade de resultado.

---

### 20. Avaliar complexidade operacional

Liste componentes, filas, dashboards, alertas, runbooks, DLQ, reconciliation, replay, capacity planning e plantão.

Exemplo:

```text
Opção A:
8 pontos de operação.

Opção B:
15 pontos de operação.

Opção C:
24 pontos de operação.
```

A contagem não é suficiente. Classifique criticidade, conhecimento exigido e frequência de intervenção.

---

### 21. Avaliar risco

Arquivo:

```text
tradeoffs/RISK_REGISTER.md
```

Exemplo da opção B:

```text
Risco:
outbox cresce sem relay.

Probabilidade:
média.

Impacto:
alto.

Controle:
alerta de idade,
backpressure,
reprocessamento
e runbook.

Risco residual:
baixo a médio.
```

Exemplo da opção C:

```text
Risco:
cliente interpreta aceite
como confirmação concluída.

Probabilidade:
alta.

Impacto:
alto.

Controle:
novo contrato,
status intermediário,
polling,
webhook
e UX.
```

---

### 22. Avaliar reversibilidade

Arquivo:

```text
tradeoffs/REVERSIBILITY_MAP.md
```

Perguntas:

```text
podemos ativar por feature flag?

podemos executar shadow traffic?

podemos manter dual write temporário?

qual dado precisa migrar?

qual contrato público muda?

qual é o blast radius?

quanto demora o rollback?

existe perda de informação ao voltar?
```

Opção B pode ser introduzida por efeitos secundários, mantendo o commit crítico. A reversão pode reativar o caminho síncrono.

Opção C muda contrato e experiência; sua reversão é mais cara.

---

### 23. Diferenciar one-way door e two-way door

Two-way door:

```text
feature flag;
rollback em minutos;
sem migração irreversível;
contrato preservado;
blast radius limitado.
```

One-way door:

```text
contrato público alterado;
dados transformados sem caminho de volta;
fornecedor proprietário;
ownership distribuído;
migração longa;
rollback arriscado.
```

Quanto menor a reversibilidade, maior deve ser a qualidade da evidência antes da decisão.

---

### 24. Executar análise de sensibilidade

Arquivo:

```text
tradeoffs/SENSITIVITY_ANALYSIS.md
```

Cenários:

```text
Cenário 1:
latência pesa 25,
complexidade operacional pesa 5.

Cenário 2:
volume real permanece em 40 rps.

Cenário 3:
broker custa o dobro.

Cenário 4:
time de operação reduzido pela metade.

Cenário 5:
SLO passa de 700 ms para 1.200 ms.
```

Resultado esperado:

```text
Opção B vence nos cenários 1, 3 e 5.

Opção A se aproxima no cenário 2.

Opção C não vence
porque muda semântica,
contrato e operação
sem necessidade comprovada.
```

---

### 25. Calcular break-even

Break-even é a condição em que o custo adicional passa a ser compensado pelo benefício.

Exemplo:

```text
A opção B custa
R$ 12.000 adicionais por mês.

Cada incidente evitado custa
R$ 18.000 entre operação,
SLA e retrabalho.

Se a opção evitar
pelo menos um incidente por mês,
o custo pode se justificar.
```

Também calcule break-even de volume:

```text
abaixo de 60 rps,
a opção A atende o SLO.

acima de 120 rps,
a opção A viola o SLO
mesmo com tuning.
```

---

### 26. Planejar experimento

Arquivo:

```text
tradeoffs/EXPERIMENT_PLAN.md
```

Experimento para opção B:

```text
Hipótese:
commit síncrono com outbox
reduz p95 abaixo de 700 ms
sem aumentar erro crítico.

Ambiente:
pré-produção representativa.

Carga:
40, 120 e 300 confirmações por segundo.

Falhas:
notificação indisponível;
relay pausado;
broker lento;
duplicação de evento.

Métricas:
p50, p95, p99;
erro;
backlog;
oldest message age;
dupla reserva;
tempo de recuperação;
custo por 1.000 confirmações.

Critério de aprovação:
nenhuma dupla reserva;
p95 <= 700 ms;
erro < 0,5%;
recovery <= 10 min;
backlog drenado.
```

---

### 27. Executar teste de carga

Exemplo de resultado:

```text
40 rps:
p95 280 ms.

120 rps:
p95 390 ms.

300 rps:
p95 610 ms.

Erro crítico:
0,08%.

Dupla reserva:
0.

Backlog máximo:
8.400 mensagens.

Drenagem:
4 minutos e 20 segundos.
```

Registre ambiente, versão, massa, duração e limitações.

---

### 28. Executar failure drill

Pause o relay por cinco minutos.

Confirme:

```text
confirmações continuam;
outbox cresce;
alerta dispara;
oldest message age aumenta;
nenhuma mensagem é perdida;
relay retorna;
backlog drena;
projeções convergem;
notificações duplicadas não aparecem.
```

O drill produz evidência sobre resiliência e operação, não apenas desempenho.

---

### 29. Criar recomendação

Arquivo:

```text
tradeoffs/DECISION_RECOMMENDATION.md
```

Recomendação:

```text
Adotar a opção B:
commit síncrono de status,
reserva e outbox,
com notificação e projeções assíncronas.
```

Justificativa:

```text
preserva invariantes críticas;
reduz p95;
isola dependências secundárias;
absorve pico;
mantém contrato HTTP;
possui reversibilidade aceitável;
tem evidência E3;
complexidade operacional é controlável.
```

Condições:

```text
alerta de outbox;
DLQ;
replay idempotente;
runbook;
capacity test;
feature flag;
rollback testado;
owner operacional.
```

A recomendação deve declarar também por que as outras opções não foram escolhidas agora.

---

### 30. Declarar gatilhos de revisão

Arquivo:

```text
tradeoffs/REVIEW_TRIGGERS.md
```

Gatilhos:

```text
p95 > 700 ms por 30 dias;

pico sustentado > 300 rps;

custo mensal > limite aprovado;

backlog > 10 minutos;

incidentes de DLQ > 2 por trimestre;

mudança do contrato para processamento assíncrono;

novo requisito de resposta final imediata;

alteração de fornecedor;

crescimento do time de operação;

mudança regulatória.
```

Uma decisão sem gatilho de revisão tende a virar dogma.

---

### 31. Criar Decision Gate

O gate valida:

```text
problema;
contexto;
forças;
restrições;
premissas;
baseline;
opções;
critérios;
pesos;
evidências;
riscos;
reversibilidade;
custo;
sensibilidade;
experimento;
recomendação;
gatilhos;
testes;
arquitetura;
documentação.
```

Status:

```text
PASS;

PASS_WITH_CONDITIONS;

FAIL_PROBLEM;

FAIL_BASELINE;

FAIL_OPTIONS;

FAIL_CRITERIA;

FAIL_WEIGHTS;

FAIL_EVIDENCE;

FAIL_MANDATORY_REQUIREMENT;

FAIL_RISK;

FAIL_REVERSIBILITY;

FAIL_SENSITIVITY;

FAIL_EXPERIMENT;

INCONCLUSIVE.
```

---

### 32. Testar a análise completa

Os testes devem validar, em conjunto:

- score entre 0 e 5, peso entre 0 e 100 e soma total 100;
- raw score e adjusted score com fator de evidência;
- desqualificação de opção que viola critério obrigatório;
- vantagem aparente baseada apenas em evidência fraca;
- ranking sob diferentes cenários de peso;
- classificação de one-way e two-way door;
- resultado `INCONCLUSIVE` quando carga, falhas ou métricas são insuficientes;
- comparação de cada opção com métricas, custo e risco do baseline.

O objetivo não é testar apenas a fórmula. É impedir que a ferramenta produza uma recomendação convincente a partir de dados incompletos ou regras incoerentes.

---

### 33. Testar arquitetura

Exemplo:

```java
package br.com.formacao.tradeoff.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class DecisionBoundaryTest {

    @ArchTest
    static final ArchRule analysisMustNotDependOnReports =
            noClasses()
                    .that()
                    .resideInAPackage("..analysis..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..reports..");
}
```

O núcleo de análise não depende de formatação de relatório.

---

### 34. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson644:
    forbidden:
      - full-ADR-template
      - ADR-status-lifecycle
      - ADR-superseded-chain
      - ADR-repository-governance

  lesson645:
    forbidden:
      - full-RFC-template
      - RFC-review-workflow
      - organization-wide-RFC-process

  allowed:
    - decision-analysis
    - option-comparison
    - recommendation
    - review-trigger
```

---

### 35. Validar artefatos da decisão

Execute as validações especializadas:

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-trade-off-contract.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-context-and-forces.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-options-and-baseline.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-criteria-and-weights.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-evidence-quality.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-risk-and-reversibility.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-sensitivity-analysis.ps1
.\scripts\m19\service-scheduling-trade-offs\validate-experiment-plan.ps1
```

Valide problema, baseline, opções, critérios, pesos, evidências, riscos, reversibilidade, sensibilidade, experimento e não antecipação.

---

### 36. Executar testes

```powershell
.\scripts\m19\service-scheduling-trade-offs\run-trade-off-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide scores, evidências, critérios obrigatórios, riscos, reversibilidade, sensibilidade, experimentos e arquitetura.

---

### 37. Criar reports

Exemplo:

```yaml
tradeOff:
  problem:
    confirmation-side-effects

  baseline:
    SYNCHRONOUS_ORCHESTRATION

  optionsEvaluated:
    3

  recommendedOption:
    SYNCHRONOUS_COMMIT_ASYNC_EFFECTS

  rawScore:
    438

  adjustedScore:
    407.4

  mandatoryViolations:
    0

  criticalResidualRisks:
    0

  evidence:
    E3:
      7
    E2:
      3
    E1:
      2

  sensitivity:
    stableScenarios:
      4
    invertedScenarios:
      1

  experiment:
    status:
      PASS

  reversibility:
    TWO_WAY_DOOR

  gate:
    PASS_WITH_CONDITIONS
```

As casas decimais pertencem ao cálculo, não significam certeza equivalente.

---

### 38. Coletar evidence

Arquivo:

```text
contracts/trade-off-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- decision problem;
- baseline;
- options count;
- criteria count;
- mandatory criteria count;
- evidence count by level;
- critical risks;
- residual risks;
- reversibility class;
- sensitivity scenarios;
- experiment status;
- recommended option;
- conditions count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- credenciais;
- dados pessoais;
- URLs privadas;
- custos contratuais confidenciais;
- topologia real;
- ADR completo;
- RFC completo.

---

### 39. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-trade-off-contract.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-context-and-forces.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-options-and-baseline.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-criteria-and-weights.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-evidence-quality.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-risk-and-reversibility.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-sensitivity-analysis.ps1

.\scripts\m19\service-scheduling-trade-offs\validate-experiment-plan.ps1

.\scripts\m19\service-scheduling-trade-offs\run-trade-off-tests.ps1

.\scripts\m19\service-scheduling-trade-offs\collect-trade-off-evidence.ps1

.\scripts\m19\service-scheduling-trade-offs\verify-trade-off-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 40. Encerrar o laboratório

Confirme:

- problema formulado sem tecnologia preferida;
- baseline medido;
- forças e restrições explícitas;
- premissas identificadas;
- opções viáveis;
- critérios definidos;
- pesos justificados;
- critérios obrigatórios não compensáveis;
- score com rationale;
- evidence IDs;
- incerteza visível;
- riscos e risco residual;
- custo operacional;
- reversibilidade;
- one-way e two-way doors;
- sensibilidade;
- break-even;
- perguntas abertas;
- experimento;
- resultado inconclusivo permitido;
- recomendação condicionada;
- gatilhos de revisão;
- reports;
- evidence;
- gate;
- ADR não aprofundado;
- RFC não aprofundado.

---

## Entendendo o que foi feito

### O problema ficou separado da solução

A análise começou pela consequência observável do fluxo atual, não por uma tecnologia desejada.

### O baseline virou opção explícita

Não mudar também possui latência, falhas, custo, risco e prazo. A comparação deixou de ignorar o estado atual.

### A pontuação ganhou contexto e evidência

Critérios possuem definição, peso e pergunta. Scores possuem rationale e evidence. Incerteza reduz confiança sem apagar o valor bruto.

### Risco e reversibilidade ficaram visíveis

Uma opção com boa pontuação pode ser inadequada por risco crítico, contrato alterado, migração irreversível ou rollback não testado.

### A recomendação ganhou condições e revisão

A opção escolhida possui controles obrigatórios, experimento, owners e gatilhos que podem reabrir a decisão.

---

## Erros comuns importantes

### Começar pela tecnologia favorita

O problema é escrito para justificar a escolha já feita.

### Comparar sem baseline

A equipe avalia apenas opções novas e não mede o custo de permanecer igual.

### Usar critérios vagos ou duplicados

Performance, velocidade, latência e capacidade recebem pontos separados e distorcem o resultado.

### Ajustar pesos depois de ver o vencedor

A matriz vira instrumento de confirmação, não de decisão.

### Tratar opinião como evidência

Experiência é útil, mas precisa ser identificada como nível de evidência e incerteza.

### Compensar requisito obrigatório

Uma opção insegura não pode vencer por ser barata e rápida.

### Confiar apenas na soma

Scores não substituem riscos, restrições, reversibilidade, semântica e experimento.

### Ignorar custo operacional

A solução parece barata porque plantão, DLQ, replay, treinamento e incidentes não foram contabilizados.

### Criar precisão falsa

Uma nota `87,42` não significa que a alternativa é conhecida com essa precisão.

### Não executar sensibilidade

Pequenas mudanças de peso podem inverter a recomendação sem que a equipe perceba sua fragilidade.

### Tratar experimento inconclusivo como sucesso

A pressão por decidir substitui evidência por narrativa.

### Não definir gatilho de revisão

A decisão permanece mesmo quando volume, custo, time ou requisitos mudam.

### Antecipar ADR

A análise produz a recomendação e suas evidências. O registro arquitetural completo fica para a aula 644.

---

## Comandos úteis

### Validar contrato

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-trade-off-contract.ps1
```

### Validar critérios

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-criteria-and-weights.ps1
```

### Validar evidências

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-evidence-quality.ps1
```

### Validar sensibilidade

```powershell
.\scripts\m19\service-scheduling-trade-offs\validate-sensitivity-analysis.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-trade-offs\run-trade-off-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-trade-offs\verify-trade-off-gate.ps1
```

---

## Exercício guiado

Analise uma segunda decisão de `Service Scheduling`:

```text
consulta de detalhes do Appointment
no banco autoritativo
ou em uma projeção de leitura.
```

Crie:

1. problema;
2. baseline;
3. forças;
4. restrições;
5. opções;
6. critérios;
7. pesos;
8. evidências;
9. riscos;
10. reversibilidade;
11. sensibilidade;
12. experimento;
13. recomendação;
14. gatilhos de revisão.

Considere operações diferentes:

```text
visualização do portal;
decisão de reagendamento;
dashboard;
auditoria;
```

A recomendação pode variar por operação. Não force uma única resposta para todos os usos.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 642 e ponte para a aula 644 foram preservadas;
- o laboratório `service-scheduling-trade-off-analysis` foi criado;
- Trade-off Charter foi criado;
- o problema foi definido sem solução preferida;
- o baseline foi medido;
- forças foram documentadas;
- restrições e premissas foram separadas;
- no mínimo duas alternativas e o baseline foram avaliados;
- opções descartadas mantêm motivo;
- critérios possuem definição e pergunta;
- pesos totalizam 100;
- pesos possuem rationale;
- critérios obrigatórios não são compensáveis;
- escala de 0 a 5 foi definida;
- precisão artificial foi evitada;
- cada score possui rationale;
- cada score possui evidence ID;
- evidências possuem nível, fonte, data e referência segura;
- incerteza foi representada;
- raw score e adjusted score foram preservados;
- riscos possuem probabilidade, impacto, owner e mitigação;
- risco residual foi registrado;
- custo operacional foi modelado;
- reversibilidade foi avaliada;
- migration cost e blast radius foram registrados;
- one-way e two-way doors foram diferenciados;
- rollback foi testado ou bloqueado;
- análise de sensibilidade foi executada;
- cenários de inversão foram registrados;
- break-even foi calculado;
- perguntas abertas foram mantidas;
- experimento possui hipótese e critérios prévios;
- carga, falhas e métricas foram testadas;
- resultado inconclusivo é permitido;
- recomendação explica alternativas rejeitadas;
- condições da recomendação possuem owner;
- gatilhos de revisão foram definidos;
- reports, evidence e gate foram criados;
- testes de score, evidência, risco, reversibilidade e sensibilidade foram executados;
- ADR completo não foi antecipado;
- RFC completo não foi antecipado;
- commit recomendado, diário de bordo e regra final estão presentes.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Adicione:

```powershell
git add `
  labs/m19/aula-643-trade-offs-tecnicos/service-scheduling-trade-off-analysis `
  scripts/m19/service-scheduling-trade-offs `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|realTopology|confidentialCost|fullADRTemplate|fullRFCWorkflow"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): analisar trade offs tecnicos"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- endpoints privados;
- topologia real;
- custos confidenciais;
- ADR completo;
- RFC completo.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou trade-offs técnicos.

Você criou:

```text
Trade-off Charter;

Decision Problem;

baseline;

contexto e forças;

restrições e premissas;

Options Catalog;

Evaluation Criteria;

Weight Rationale;

Scoring Guide;

Evidence Catalog;

Uncertainty Penalty;

Risk Register;

Operational Cost Model;

Reversibility Map;

Sensitivity Analysis;

Break-even;

Experiment Plan;

Decision Recommendation;

Review Triggers;

Decision Gate.
```

Você comprovou que uma decisão técnica não deve começar pela tecnologia favorita; que baseline é uma opção real; que critérios precisam de definição e peso; que scores exigem rationale e evidência; que requisito obrigatório não pode ser compensado por pontuação; que risco, custo operacional e reversibilidade permanecem visíveis; que one-way doors exigem evidência mais forte; que sensibilidade revela recomendações frágeis; que experimentos podem ser inconclusivos; e que toda recomendação precisa de condições e gatilhos de revisão.

A próxima aula será:

```text
644 - M19.34 - ADR
```

Nela, você aprenderá a transformar uma decisão analisada em um Architecture Decision Record conciso, rastreável, versionado e evolutivo.

Nenhum aprofundamento completo de ADR ou RFC técnico foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini o problema sem escolher tecnologia antes.
- [ ] Medi o baseline.
- [ ] Registrei forças, restrições e premissas.
- [ ] Comparei opções viáveis.
- [ ] Defini critérios, pesos e escala.
- [ ] Liguei scores a evidências.
- [ ] Avaliei riscos e reversibilidade.
- [ ] Executei sensibilidade e experimento.
- [ ] Registrei recomendação e gatilhos.
- [ ] Verifiquei o gate.

---

## Troubleshooting adicional

### A matriz sempre escolhe a opção preferida do autor

Congele critérios e pesos antes da pontuação, faça revisão por outra pessoa e mantenha evidências rastreáveis.

### Todo critério parece obrigatório

Separe invariantes reais de preferências. Critérios obrigatórios excessivos eliminam a comparação.

### A opção nova vence porque o baseline não tem evidência

Meça o estado atual. Ausência de medição não significa desempenho zero nem risco infinito.

### A sensibilidade muda o vencedor facilmente

Classifique a recomendação como frágil e execute experimento focado nos critérios responsáveis.

### A opção é difícil de reverter

Aumente evidência, reduza blast radius, crie fases, valide saída e exija aprovação explícita.

### O experimento passou, mas o ambiente era pequeno

Marque a limitação e evite promover a evidência para E3 ou E4.

### O resultado foi inconclusivo

Não escolha por pressão. Corrija o experimento ou reduza o escopo da decisão.

### A equipe quer escrever o ADR agora

Finalize problema, alternativas, evidências, riscos e recomendação. O ADR será aprofundado na aula 644.

---

## Perguntas de revisão

1. O que é trade-off técnico?
2. Por que uma lista de prós e contras é insuficiente?
3. O que são forças?
4. Qual diferença entre restrição e premissa?
5. Por que o baseline precisa ser avaliado?
6. O que é critério obrigatório?
7. Para que servem pesos?
8. Por que score exige evidência?
9. O que é penalidade de incerteza?
10. Por que não usar precisão decimal exagerada?
11. O que é risco residual?
12. O que é reversibilidade?
13. Qual diferença entre one-way door e two-way door?
14. O que é análise de sensibilidade?
15. O que é break-even?
16. Por que um experimento pode ser inconclusivo?
17. O que uma recomendação deve conter?
18. O que são gatilhos de revisão?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Troca consciente entre qualidades, custos e riscos.
2. Porque não declara contexto, importância, evidência, risco ou reversibilidade.
3. Pressões que influenciam a decisão.
4. Restrição é obrigatória; premissa é considerada verdadeira e pode falhar.
5. Porque não mudar também possui custo, risco e consequência.
6. Requisito que não pode ser compensado por outras notas.
7. Representar importância relativa no contexto.
8. Para distinguir conhecimento de opinião.
9. Ajuste que reduz confiança de avaliação baseada em evidência fraca.
10. Porque o conhecimento não possui essa precisão real.
11. Risco que permanece após mitigação.
12. Capacidade e custo de desfazer ou substituir a decisão.
13. One-way é difícil de reverter; two-way possui retorno controlado.
14. Variação de premissas e pesos para testar estabilidade.
15. Condição em que custo adicional se paga pelo benefício.
16. Porque ambiente, carga, métricas ou falhas podem ser insuficientes.
17. Opção, rationale, evidências, riscos, condições e alternativas rejeitadas.
18. Condições que exigem reabrir a decisão.
19. ADR.
20. ADR.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 643 - M19.33 - Trade offs tecnicos

- Aprofundei trade-offs técnicos como decisão contextual.
- Criei o laboratório `service-scheduling-trade-off-analysis`.
- Separei problema e solução preferida.
- Medi o baseline do fluxo de confirmação.
- Registrei forças, restrições e premissas.
- Comparei fluxo síncrono, commit síncrono com efeitos assíncronos e processamento assíncrono integral.
- Criei critérios, pesos e escala de pontuação.
- Diferenciei critérios ponderados de requisitos obrigatórios.
- Criei Evidence Catalog com níveis E0 a E4.
- Liguei scores a rationale e evidence ID.
- Modelei penalidade de incerteza.
- Mantive raw score e adjusted score.
- Criei Risk Register e risco residual.
- Modelei custo operacional total.
- Avaliei migration cost, blast radius, rollback e exit strategy.
- Diferenciei one-way doors e two-way doors.
- Executei análise de sensibilidade.
- Calculei break-even de custo e volume.
- Registrei perguntas abertas.
- Criei experimento com carga e failure drill.
- Permiti resultado inconclusivo.
- Recomendei commit síncrono com efeitos assíncronos sob condições.
- Criei gatilhos de revisão, reports, evidence e gate.
- Não antecipei ADR ou RFC técnico.
- Próxima aula: ADR.
```

---

## Referência técnica curta

- Trade-off.
- Decision Problem.
- Baseline.
- Force.
- Constraint.
- Assumption.
- Evaluation Criterion.
- Weight.
- Mandatory Criterion.
- Evidence Level.
- Uncertainty.
- Risk Exposure.
- Residual Risk.
- Operational Cost.
- Reversibility.
- One-way Door.
- Two-way Door.
- Sensitivity Analysis.
- Break-even.
- Decision Experiment.
- Review Trigger.

Regra final:

```text
Trade-offs técnicos devem transformar preferência em decisão verificável. O problema é declarado sem tecnologia favorita, o baseline é medido e comparado, forças, restrições e premissas ficam explícitas, opções inviáveis são descartadas com motivo e alternativas viáveis são avaliadas por critérios definidos, pesos justificados e requisitos obrigatórios não compensáveis. Cada score possui rationale e evidence ID, raw score permanece separado do ajuste de incerteza, riscos mantêm probabilidade, impacto, owner, mitigação e risco residual, e o custo inclui infraestrutura, observabilidade, suporte, incidentes, treinamento, migração e rollback. Reversibilidade distingue two-way doors de one-way doors, sensitivity analysis revela recomendações frágeis, break-even identifica condições econômicas e de volume, experimentos definem hipótese, carga, falhas, métricas e critérios antes do resultado e podem terminar como inconclusivos. A recomendação final explica a opção escolhida, as rejeitadas, as condições obrigatórias e os gatilhos de revisão; o gate só aprova quando contexto, baseline, opções, critérios, evidências, riscos, reversibilidade, sensibilidade, experimento, testes, arquitetura e documentação estão coerentes, enquanto o registro formal por ADR permanece reservado à aula 644 e o fluxo de RFC técnico à aula 645.
```
