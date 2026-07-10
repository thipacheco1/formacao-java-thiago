# 352 - M13.42 - Projeto persistencia OS parte 2

## Apresentacao da aula

Na aula 351, você iniciou o projeto integrado de persistência de Ordem de Serviço.

A primeira parte entregou:

```text
estrutura Maven;

configuração Spring sem Boot;

Flyway;

Hibernate validate;

PostgreSQL;

Testcontainers;

Cliente;

Produto;

OrdemServico;

Atividade;

auditoria;

@Version;

repositories;

abertura transacional;

consulta detalhada;

projection;

paginação.
```

A Ordem foi definida como raiz do agregado.

As Atividades ficaram dentro do lifecycle da Ordem.

Cliente e Produto permaneceram referências externas sem cascade.

O fluxo principal passou a abrir uma Ordem com Cliente e Produto ativos, data, período e ao menos uma Atividade.

Agora o projeto precisa evoluir para um cenário operacional mais próximo do mercado.

Nesta segunda parte, você acrescentará:

- Técnico;
- associação entre Atividade e Técnico;
- Pagamento;
- histórico de status da Ordem;
- transições de status;
- regras de atribuição;
- atualização por dirty checking;
- controle otimista;
- consultas operacionais;
- projections finais;
- regras de exclusão;
- encerramento transacional;
- suíte integrada completa;
- documentação consolidada.

A continuação preservará as decisões anteriores.

Não haverá reinício do projeto.

Você continuará no laboratório criado na aula 351:

```text
labs/m13/aula-351-projeto-persistencia-os-parte-1
```

Ao final desta aula, ele representará o projeto completo do M13.

A pasta não será renomeada para evitar quebrar histórico, scripts e commits já produzidos.

A documentação desta aula indicará claramente que o conteúdo agora corresponde às partes 1 e 2.

O schema continuará:

```text
projeto_os_351
```

A evolução acontecerá com novas migrations:

```text
V6:
criar Técnico.

V7:
criar associação Atividade-Técnico.

V8:
criar Pagamento.

V9:
criar histórico de status.

V10:
criar índices e constraints finais.

R__:
evoluir views operacionais.
```

A stack continuará:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

PostgreSQL 17.6.
```

O fluxo operacional final será:

```text
abrir Ordem;

atribuir Técnico às Atividades;

iniciar Atendimento;

concluir Atividades;

registrar Pagamento;

concluir Ordem;

registrar histórico;

confirmar commit.
```

Também serão validados fluxos alternativos:

```text
cancelar Ordem aberta;

impedir conclusão com Atividade pendente;

impedir Pagamento inválido;

impedir Técnico inativo;

impedir atribuição duplicada;

impedir exclusão de Ordem operacional;

detectar atualização concorrente.
```

A auditoria continuará baseada em:

```text
AuditScope;

AuditActor;

Clock;

@PrePersist;

@PreUpdate.
```

O service continuará sendo a fronteira transacional.

Os repositories continuarão interfaces Spring Data.

A entidade continuará sem setters genéricos.

O banco continuará protegido por:

- primary keys;
- foreign keys;
- unique constraints;
- checks;
- `NOT NULL`;
- índices;
- versão otimista.

O laboratório comprovará:

```text
Técnico ativo atribuído;

Atividade vinculada ao Técnico;

histórico registrado em cada transição;

dirty checking atualizando Ordem e Atividades;

Pagamento criado e validado;

Ordem concluída somente após todas as Atividades;

rollback integral em regra inválida;

concorrência otimista detectada;

consultas operacionais sem N+1;

projections finais;

migrations V6 a V10 aplicadas;

schema final validado;

zero fixtures ao final.
```

A próxima aula será:

```text
353 - M13.43 - Revisao tecnica JDBC JPA Hibernate Spring Data
```

Por isso, esta aula encerrará o projeto, mas não fará ainda a revisão completa do módulo.

A revisão técnica será responsabilidade da aula 353.

---

## Onde estamos na formacao

A sequência atual é:

```text
350:
Migrations integradas com persistencia.

351:
Projeto persistencia OS parte 1.

352:
Projeto persistencia OS parte 2.

353:
Revisao tecnica JDBC JPA Hibernate Spring Data.

354:
Prova pratica persistencia.
```

A parte 1 respondeu:

```text
como criar a fundação persistente da OS?
```

A parte 2 responderá:

```text
como completar o ciclo operacional,
concorrente e auditável da OS?
```

Nesta aula:

```text
continuação do mesmo projeto:
sim.

Técnico:
sim.

Atividade-Técnico:
sim.

Pagamento:
sim.

histórico de status:
sim.

transições:
sim.

dirty checking:
sim.

lock otimista:
sim.

consultas operacionais:
sim.

exclusão física livre:
não.

bulk indiscriminado:
não.

API REST:
não.

Spring Boot:
não.

revisão completa:
não.
```

A arquitetura final será:

```text
application service
    -> repositories
        -> aggregate root Ordem
            -> Atividades
            -> histórico
        -> Técnico
        -> Pagamento
    -> transação
        -> auditoria
        -> versionamento
        -> commit.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m13/aula-351-projeto-persistencia-os-parte-1
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/projetoos
├── application
│   ├── command
│   │   ├── AbrirOrdemServicoCommand.java
│   │   ├── AtribuirTecnicoCommand.java
│   │   ├── RegistrarPagamentoCommand.java
│   │   ├── AlterarStatusOrdemCommand.java
│   │   └── ConcluirAtividadeCommand.java
│   ├── result
│   │   ├── OrdemAbertaResult.java
│   │   ├── OrdemDetalhadaResult.java
│   │   ├── OrdemOperacionalResult.java
│   │   ├── PagamentoResult.java
│   │   └── TecnicoCargaResult.java
│   └── service
│       ├── OrdemServicoApplicationService.java
│       ├── OrdemServicoQueryService.java
│       ├── TecnicoApplicationService.java
│       └── PagamentoApplicationService.java
├── domain
│   ├── AtividadeStatus.java
│   ├── OrdemServicoStatus.java
│   ├── PagamentoStatus.java
│   ├── PeriodoAtendimento.java
│   └── PrioridadeOrdem.java
└── persistence
    ├── entity
    │   ├── AtividadeEntity.java
    │   ├── AtividadeTecnicoEntity.java
    │   ├── ClienteEntity.java
    │   ├── OrdemServicoEntity.java
    │   ├── OrdemStatusHistoricoEntity.java
    │   ├── PagamentoEntity.java
    │   ├── ProdutoEntity.java
    │   └── TecnicoEntity.java
    ├── projection
    │   ├── OrdemOperacionalView.java
    │   ├── PagamentoPendenteView.java
    │   └── TecnicoCargaView.java
    └── repository
        ├── AtividadeRepository.java
        ├── ClienteRepository.java
        ├── OrdemServicoRepository.java
        ├── OrdemStatusHistoricoRepository.java
        ├── PagamentoRepository.java
        ├── ProdutoRepository.java
        └── TecnicoRepository.java
```

Novos testes:

```text
src/test/java/br/com/formacao/projetoos
├── MigrationParte2IT.java
├── TecnicoMappingIT.java
├── AtribuirTecnicoIT.java
├── AlterarStatusOrdemIT.java
├── ConcluirAtividadeIT.java
├── RegistrarPagamentoIT.java
├── ConcluirOrdemIT.java
├── OrdemOptimisticLockIT.java
├── ConsultasOperacionaisIT.java
├── ExclusaoRulesIT.java
├── ProjetoOsFullFlowIT.java
├── ProjetoOsFinalArchitectureTest.java
└── TestDataCleaner.java
```

Documentação adicional:

```text
docs
├── arquitetura-final.md
├── modelo-relacional-final.md
├── ciclo-status-ordem.md
├── ciclo-status-atividade.md
├── contrato-pagamento.md
├── concorrencia-e-versionamento.md
├── consultas-operacionais.md
├── regras-exclusao.md
└── checklist-fechamento-m13.md
```

Ao final, o projeto deverá demonstrar:

```text
persistência completa;

integridade transacional;

auditoria;

concorrência;

leitura operacional;

evolução de schema;

testes reproduzíveis.
```

---

## Conceito essencial

### Tecnico como cadastro externo ao agregado

Técnico não pertence ao lifecycle da Ordem.

Ele possui existência própria.

Campos:

```text
id;

codigo;

nome;

ativo;

especialidade;

versao;

auditoria.
```

Uma Ordem pode existir sem Técnico atribuído inicialmente.

Uma Atividade pode receber um Técnico depois da abertura.

Logo:

```text
cascade Ordem -> Técnico:
não.

cascade Atividade -> Técnico:
não.
```

---

### Associacao Atividade-Tecnico

A associação não será um `ManyToMany` direto.

Será criada uma entidade explícita:

```text
AtividadeTecnicoEntity.
```

Campos:

```text
id;

atividade;

tecnico;

atribuidoEm;

principal;

versao;

auditoria.
```

Motivos:

- registrar momento da atribuição;
- marcar Técnico principal;
- permitir evolução;
- manter auditoria;
- evitar join table sem comportamento.

---

### Regra de atribuicao

Uma Atividade pode possuir:

```text
um Técnico principal ativo.
```

Nesta versão do projeto, haverá no máximo uma atribuição ativa por Atividade.

O banco deve proteger:

```text
unique em atividade_id.
```

O service também valida antes de inserir.

A constraint continua sendo a defesa final contra concorrência.

---

### Pagamento

Pagamento será uma entidade ligada à Ordem.

Campos:

```text
id;

ordemServico;

valor;

status;

vencimento;

pagoEm;

versao;

auditoria.
```

Status:

```text
PENDENTE;

PAGO;

CANCELADO.
```

A Ordem pode ter zero ou mais Pagamentos.

Pagamento terá lifecycle próprio dentro da operação financeira.

Não haverá cascade automático da Ordem para Pagamento.

O service de pagamento será explícito.

---

### Valor monetario

Use:

```java
BigDecimal
```

Regras:

- escala dois;
- valor maior que zero;
- comparação com `compareTo`;
- coluna `numeric(15,2)`;
- nunca usar `double`.

A factory normaliza:

```java
valor.setScale(
        2,
        RoundingMode.UNNECESSARY
)
```

Se houver mais de duas casas, o command será rejeitado.

---

### Historico de status

A entidade:

```text
OrdemStatusHistoricoEntity.
```

Campos:

```text
id;

ordemServico;

statusAnterior;

statusNovo;

observacao;

ocorridoEm;

versao;

auditoria.
```

Cada transição confirmada gera uma linha.

O histórico não substitui os campos de auditoria.

Auditoria responde:

```text
quem alterou o registro.
```

Histórico responde:

```text
qual mudança de status ocorreu.
```

---

### Ciclo de status da Ordem

Fluxo permitido:

```text
ABERTA
    -> AGENDADA
    -> EM_ATENDIMENTO
    -> CONCLUIDA.
```

Cancelamento permitido:

```text
ABERTA
    -> CANCELADA.

AGENDADA
    -> CANCELADA.
```

Não permitido:

```text
CONCLUIDA -> qualquer outro;

CANCELADA -> qualquer outro;

ABERTA -> CONCLUIDA diretamente.
```

---

### Ciclo de status da Atividade

Fluxo:

```text
AGENDADA
    -> EM_ATENDIMENTO
    -> CONCLUIDA.
```

Cancelamento:

```text
AGENDADA
    -> CANCELADA.
```

A parte 1 já criou Atividades como `AGENDADA`.

Nesta parte, você completará os métodos de transição.

---

### Ordem AGENDADA

A Ordem pode mudar de `ABERTA` para `AGENDADA` quando:

- possui data;
- possui período;
- possui ao menos uma Atividade;
- todas as Atividades estão `AGENDADA`.

O método da entidade valida o estado.

O service registra histórico.

---

### Ordem EM_ATENDIMENTO

A transição ocorre quando ao menos uma Atividade inicia atendimento.

O service pode chamar:

```java
ordem.iniciarAtendimento();
```

A entidade impede estados incompatíveis.

---

### Ordem CONCLUIDA

Regras:

```text
todas as Atividades devem estar CONCLUIDA ou CANCELADA;

ao menos uma Atividade deve estar CONCLUIDA;

não pode existir Pagamento PENDENTE vencido;

não pode existir Atividade EM_ATENDIMENTO;

status atual deve ser EM_ATENDIMENTO.
```

A validação de Pagamento pertence ao service, pois Pagamento não está dentro da coleção do agregado nesta versão.

---

### Dirty checking

Dentro de uma transação:

```java
OrdemServicoEntity ordem =
        repository.findDetailedById(id)
                .orElseThrow();

ordem.concluir();
```

Não é necessário chamar `save`.

No commit:

- Hibernate detecta alteração;
- listener atualiza auditoria;
- versão é incrementada;
- SQL é executado.

---

### Historico e atomicidade

A mudança de status e o histórico devem compartilhar a mesma transação.

Não pode ocorrer:

```text
Ordem alterada sem histórico;

histórico inserido sem Ordem alterada.
```

O service:

1. captura status anterior;
2. executa transição;
3. cria histórico;
4. salva histórico;
5. confirma tudo junto.

---

### Optimistic locking

A Ordem possui:

```java
@Version
private int versao;
```

Cenário:

1. usuário A lê versão 2;
2. usuário B lê versão 2;
3. A atualiza e confirma versão 3;
4. B tenta confirmar usando versão 2;
5. Hibernate detecta zero linhas atualizadas;
6. lança conflito otimista.

A aplicação deve informar conflito e exigir nova leitura.

---

### Versionamento das entidades filhas

Atividade, Técnico, Pagamento e histórico também possuem `@Version` quando mutáveis.

Histórico é praticamente imutável depois de criado, mas o projeto manterá versão por consistência didática e possibilidade de correção controlada.

Não haverá setters livres.

---

### Regras de exclusao

O projeto não permitirá exclusão física comum de Ordem.

Uma Ordem operacional deve ser:

```text
cancelada,
não deletada.
```

Exclusão será permitida somente para fixtures de teste ou dados criados em cenário técnico controlado.

Cliente, Produto e Técnico não poderão ser excluídos quando referenciados.

Foreign keys reforçam a regra.

---

### Exclusao de Atividade

Uma Atividade poderá ser removida antes do início do atendimento se:

- Ordem não está concluída;
- Atividade está AGENDADA;
- não é a última Atividade da Ordem;
- não possui atribuição ativa;
- não possui referência financeira.

Como Atividade pertence ao agregado, `orphanRemoval` poderá executar o delete.

O método fica na Ordem.

---

### Operacao bulk permitida

O projeto permitirá uma operação bulk específica:

```text
marcar Pagamentos PENDENTES vencidos como CANCELADOS.
```

Ela usará:

```text
@Modifying;

row count;

updatedAt;

updatedBy;

versao + 1;

flushAutomatically;

clearAutomatically.
```

Não haverá bulk genérico de status da Ordem.

---

### Consulta operacional de Ordens

Projection:

```text
OrdemOperacionalView.
```

Campos:

```text
id;

codigo;

status;

prioridade;

clienteNome;

produtoNome;

quantidadeAtividades;

quantidadeConcluidas;

tecnicoPrincipal;

pagamentosPendentes;

createdAt;

updatedAt.
```

A consulta será JPQL ou native conforme a complexidade.

A view evoluída será usada para simplificar leitura.

---

### Consulta de Pagamentos pendentes

Projection:

```text
PagamentoPendenteView.
```

Campos:

```text
pagamentoId;

ordemCodigo;

clienteNome;

valor;

vencimento;

diasEmAtraso.
```

O cálculo de dias poderá usar SQL PostgreSQL na view.

Isso justifica uma projection nativa.

---

### Consulta de carga do Tecnico

Projection:

```text
TecnicoCargaView.
```

Campos:

```text
tecnicoId;

tecnicoCodigo;

tecnicoNome;

atividadesAtribuidas;

atividadesEmAtendimento;

atividadesConcluidas.
```

A query usa agrupamento e `left join`.

Técnico sem Atividade precisa aparecer com zero.

---

### Views finais

A repeatable será evoluída para criar:

```text
vw_ordem_operacional;

vw_pagamento_pendente;

vw_carga_tecnico.
```

Use `CREATE OR REPLACE VIEW`.

As views dependem das migrations V6 a V10.

---

### Transacao de conclusao

O service de conclusão:

1. busca Ordem detalhada;
2. verifica estado;
3. consulta Pagamentos;
4. valida regras;
5. captura status anterior;
6. conclui Ordem;
7. cria histórico;
8. registra callback afterCommit;
9. confirma.

Nenhum efeito externo ocorre antes do commit.

---

### afterCommit no projeto

Use um recorder em memória para demonstrar:

```text
ordem concluída:
evento registrado depois do commit.

rollback:
evento não registrado.
```

Não implemente mensageria real.

A revisão do módulo deve manter foco em persistência.

---

### Repositories finais

O projeto terá repositories separados por agregado ou entidade de acesso direto.

Não crie um repository por tabela sem necessidade.

Neste laboratório, haverá acesso explícito a Técnico, Pagamento e histórico porque existem casos de uso próprios.

---

### Query service

Consultas de leitura ficarão em:

```text
OrdemServicoQueryService.
```

Métodos serão:

```java
@Transactional(
        readOnly = true
)
```

Ele retorna results ou projections.

Não altera entidades.

---

## Mao na massa guiada

### 1. Criar V6 para Tecnico

Arquivo:

```text
V6__criar_tecnico.sql
```

Crie tabela:

```text
tecnico.
```

Colunas:

```text
id;

codigo;

nome;

especialidade;

ativo;

versao;

auditoria.
```

Crie:

- sequence;
- primary key;
- unique de código;
- checks;
- índice por ativo;
- índice por especialidade.

---

### 2. Criar V7 para atribuicao

Arquivo:

```text
V7__criar_atividade_tecnico.sql
```

Tabela:

```text
atividade_tecnico.
```

Colunas:

```text
id;

atividade_id;

tecnico_id;

atribuido_em;

principal;

versao;

auditoria.
```

Crie foreign keys sem cascade para Técnico.

Para Atividade, use cascade delete somente se a regra de remoção da Atividade for permitida.

Crie unique em:

```text
atividade_id.
```

---

### 3. Criar V8 para Pagamento

Arquivo:

```text
V8__criar_pagamento.sql
```

Colunas:

```text
id;

ordem_servico_id;

valor numeric(15,2);

status;

vencimento;

pago_em;

versao;

auditoria.
```

Checks:

```text
valor > 0;

status permitido;

pago_em obrigatório quando status PAGO;

pago_em nulo quando PENDENTE.
```

Crie índice por status e vencimento.

---

### 4. Criar V9 para historico

Arquivo:

```text
V9__criar_ordem_status_historico.sql
```

Colunas:

```text
id;

ordem_servico_id;

status_anterior;

status_novo;

observacao;

ocorrido_em;

versao;

auditoria.
```

Crie índice por Ordem e ocorridoEm.

Não permita status anterior igual ao novo.

---

### 5. Criar V10 final

Arquivo:

```text
V10__criar_constraints_e_indices_finais.sql
```

Adicione:

- índices compostos;
- constraints faltantes;
- comentários;
- unique operacional;
- validações finais.

Não repita objetos já criados.

---

### 6. Evoluir repeatable

Atualize:

```text
R__vw_ordem_resumo_parte_1.sql
```

Renomeie o arquivo apenas se ainda não foi compartilhado.

Como a migration repeatable já foi aplicada, o nome pode permanecer e o conteúdo ser atualizado.

Ela será reaplicada por checksum.

Crie as três views finais.

---

### 7. Criar TecnicoEntity.java

Factory:

```java
public static TecnicoEntity novo(
        String codigo,
        String nome,
        String especialidade
)
```

Métodos:

```java
ativar();

inativar();

isAtivo().
```

Mantenha auditoria e versão.

---

### 8. Criar AtividadeTecnicoEntity.java

Factory controlada:

```java
public static AtividadeTecnicoEntity atribuir(
        AtividadeEntity atividade,
        TecnicoEntity tecnico,
        Instant atribuidoEm
)
```

Valide Técnico ativo.

Não permita troca por setter.

Para reatribuição futura, crie método explícito ou encerre a atribuição anterior em outra evolução.

---

### 9. Relacionar Atividade e atribuicao

Na Atividade:

```java
@OneToOne(
        mappedBy = "atividade",
        fetch = FetchType.LAZY
)
private AtividadeTecnicoEntity atribuicao;
```

Não use cascade para Técnico.

O vínculo pode ser criado pelo service por repository próprio.

---

### 10. Criar PagamentoEntity.java

Factory:

```java
public static PagamentoEntity pendente(
        OrdemServicoEntity ordem,
        BigDecimal valor,
        LocalDate vencimento
)
```

Método:

```java
public void marcarComoPago(
        Instant pagoEm
)
```

Valide transição `PENDENTE -> PAGO`.

---

### 11. Criar OrdemStatusHistoricoEntity.java

Factory:

```java
public static OrdemStatusHistoricoEntity registrar(
        OrdemServicoEntity ordem,
        OrdemServicoStatus anterior,
        OrdemServicoStatus novo,
        String observacao,
        Instant ocorridoEm
)
```

Não exponha alteração de status depois da criação.

---

### 12. Evoluir OrdemServicoEntity.java

Adicione métodos:

```java
agendar();

iniciarAtendimento();

concluir();

cancelar(String motivo);

removerAtividade(String codigo).
```

Cada método valida o estado atual.

A entidade não persiste histórico sozinha.

Ela apenas protege sua transição.

---

### 13. Evoluir AtividadeEntity.java

Adicione:

```java
iniciarAtendimento();

concluir();

cancelar();

definirAtribuicao(...).
```

Impeça conclusão sem Técnico principal, conforme regra do projeto.

---

### 14. Criar commands novos

`AtribuirTecnicoCommand`:

```text
atividadeId;

tecnicoCodigo.
```

`RegistrarPagamentoCommand`:

```text
ordemId;

valor;

vencimento.
```

`AlterarStatusOrdemCommand`:

```text
ordemId;

novoStatus;

observacao.
```

`ConcluirAtividadeCommand`:

```text
atividadeId;

observacao.
```

Todos são records imutáveis.

---

### 15. Criar TecnicoRepository.java

Métodos:

```java
Optional<TecnicoEntity>
findByCodigo(
        String codigo
);

boolean existsByCodigo(
        String codigo
);
```

Crie projection de carga em query específica ou view.

---

### 16. Criar PagamentoRepository.java

Métodos:

```java
List<PagamentoEntity>
findByOrdemServicoId(
        Long ordemId
);

boolean existsByOrdemServicoIdAndStatus(
        Long ordemId,
        PagamentoStatus status
);
```

Adicione bulk controlado de vencidos.

---

### 17. Criar HistoricoRepository.java

Método:

```java
List<OrdemStatusHistoricoEntity>
findByOrdemServicoIdOrderByOcorridoEmAscIdAsc(
        Long ordemId
);
```

A ordenação é determinística.

---

### 18. Criar AtividadeRepository.java

Métodos necessários para:

- buscar Atividade com Ordem;
- atribuir Técnico;
- concluir;
- validar status.

Evite `findAll`.

---

### 19. Criar TecnicoApplicationService.java

Método:

```java
@Transactional
public void atribuir(
        AtribuirTecnicoCommand command
)
```

Fluxo:

1. buscar Atividade;
2. validar estado;
3. buscar Técnico;
4. validar ativo;
5. verificar atribuição existente;
6. criar `AtividadeTecnicoEntity`;
7. salvar;
8. atualizar referência da Atividade;
9. commit.

---

### 20. Criar PagamentoApplicationService.java

Método:

```java
@Transactional
public PagamentoResult registrar(
        RegistrarPagamentoCommand command
)
```

Valide Ordem existente e não cancelada.

Crie Pagamento pendente.

Outro método marca como pago.

---

### 21. Evoluir OrdemServicoApplicationService

Adicione:

```java
agendarOrdem(...);

iniciarAtendimento(...);

concluirAtividade(...);

concluirOrdem(...);

cancelarOrdem(...);

removerAtividade(...).
```

Cada método:

- abre transação;
- carrega o estado necessário;
- chama comportamento da entidade;
- cria histórico;
- deixa dirty checking persistir;
- retorna result.

---

### 22. Criar helper de historico

Método privado:

```java
private void registrarHistorico(
        OrdemServicoEntity ordem,
        OrdemServicoStatus anterior,
        String observacao
)
```

Ele usa `Clock` do contexto atual.

Não abra nova transação.

O histórico deve participar da mesma transação da alteração.

---

### 23. Concluir Atividade

Fluxo:

1. buscar Atividade com atribuição;
2. validar Técnico principal;
3. iniciar se necessário;
4. concluir;
5. verificar se Ordem deve entrar em atendimento;
6. dirty checking;
7. commit.

Não conclua automaticamente a Ordem enquanto outras Atividades estiverem pendentes.

---

### 24. Concluir Ordem

Fluxo:

1. carregar Ordem e Atividades;
2. consultar Pagamentos;
3. verificar todas as regras;
4. capturar status anterior;
5. concluir;
6. registrar histórico;
7. registrar afterCommit;
8. commit.

Teste rollback depois do registro e antes do commit.

---

### 25. Cancelar Ordem

Permitido somente em `ABERTA` ou `AGENDADA`.

Ao cancelar:

- Atividades ainda não concluídas ficam canceladas;
- Pagamentos pendentes podem ser cancelados por service explícito;
- histórico é criado;
- Ordens concluídas não podem ser canceladas.

---

### 26. Bulk de Pagamentos vencidos

Use:

```java
@Modifying(
        flushAutomatically = true,
        clearAutomatically = true
)
```

Atualize:

```text
status;

updatedAt;

updatedBy;

versao.
```

Retorne row count.

Execute dentro de transação.

---

### 27. Criar projections finais

Mapeie as três views.

Teste aliases e tipos.

Não trate projection como entidade.

---

### 28. Evoluir query service

Métodos:

```java
Page<OrdemOperacionalResult>
listarOperacionais(
        Pageable pageable
)

List<PagamentoPendenteView>
listarPagamentosPendentes()

List<TecnicoCargaView>
listarCargaTecnicos()
```

Use `readOnly = true`.

---

### 29. Criar MigrationParte2IT.java

Valide:

- V6 a V10;
- três novas tabelas;
- foreign keys;
- unique;
- checks;
- índices;
- views;
- Hibernate validate final.

---

### 30. Criar AtribuirTecnicoIT.java

Casos:

- Técnico ativo;
- Técnico inativo;
- Atividade inexistente;
- atribuição duplicada;
- unique concorrente;
- auditoria;
- versão;
- rollback.

---

### 31. Criar AlterarStatusOrdemIT.java

Casos:

- ABERTA para AGENDADA;
- AGENDADA para EM_ATENDIMENTO;
- transição inválida;
- histórico;
- versão;
- auditoria;
- rollback.

---

### 32. Criar ConcluirAtividadeIT.java

Casos:

- sem Técnico;
- com Técnico;
- conclusão;
- segunda conclusão rejeitada;
- dirty checking;
- versão;
- atualização da Ordem.

---

### 33. Criar RegistrarPagamentoIT.java

Casos:

- valor válido;
- zero;
- negativo;
- escala inválida;
- marcar como pago;
- status;
- `pagoEm`;
- Ordem cancelada;
- rollback.

---

### 34. Criar ConcluirOrdemIT.java

Casos:

- todas Atividades concluídas;
- uma Atividade pendente;
- Pagamento vencido pendente;
- sucesso;
- histórico;
- afterCommit;
- rollback sem callback.

---

### 35. Criar OrdemOptimisticLockIT.java

Use dois `EntityManager` ou duas transações.

Confirme:

- mesma versão inicial;
- primeiro commit;
- segundo conflito;
- estado vencedor;
- histórico não duplicado;
- auditoria coerente.

---

### 36. Criar ConsultasOperacionaisIT.java

Valide:

- Ordem operacional;
- Pagamento pendente;
- carga do Técnico;
- Técnico sem Atividade;
- count correto;
- zero N+1;
- ordenação estável;
- paginação.

---

### 37. Criar ExclusaoRulesIT.java

Valide:

- Ordem não pode ser deletada pelo fluxo;
- Cliente referenciado não pode ser removido;
- Produto referenciado não pode ser removido;
- Técnico atribuído não pode ser removido;
- Atividade removível somente nas condições;
- orphanRemoval executa delete permitido.

---

### 38. Criar ProjetoOsFullFlowIT.java

Fluxo completo:

1. criar Cliente;
2. criar Produto;
3. criar Técnico;
4. abrir Ordem com duas Atividades;
5. atribuir Técnico;
6. agendar Ordem;
7. iniciar Atendimento;
8. concluir Atividades;
9. registrar Pagamento;
10. pagar;
11. concluir Ordem;
12. consultar detalhe;
13. consultar views;
14. consultar histórico;
15. validar auditoria;
16. validar versões;
17. limpar.

---

### 39. Criar ProjetoOsFinalArchitectureTest.java

Valide:

- migrations V1 a V10;
- repeatable;
- entidades;
- auditoria;
- versões;
- LAZY;
- cascade controlado;
- service transacional;
- query service readOnly;
- bulk específico;
- row count;
- Testcontainers;
- Spring Boot ausente;
- H2 ausente;
- Hibernate validate;
- nenhuma exclusão genérica de Ordem;
- ponte para aula 353.

---

### 40. Evoluir TestDataCleaner

Ordem:

```sql
DELETE FROM projeto_os_351.ordem_status_historico;
DELETE FROM projeto_os_351.pagamento;
DELETE FROM projeto_os_351.atividade_tecnico;
DELETE FROM projeto_os_351.atividade;
DELETE FROM projeto_os_351.ordem_servico;
DELETE FROM projeto_os_351.tecnico;
DELETE FROM projeto_os_351.produto;
DELETE FROM projeto_os_351.cliente;
```

Aplique filtros de prefixo quando possível.

Filhos sempre antes dos pais.

---

### 41. Executar o projeto completo

Execute:

```powershell
.\scripts\02_executar_migrations.ps1
.\scripts\03_executar_testes.ps1
.\scripts\04_executar_aplicacao.ps1
.\scripts\05_validar_estado.ps1
```

Confirme:

```text
V1 a V10;

views finais;

fluxo completo;

rollback;

optimistic lock;

consultas;

zero fixtures;

nenhuma transação aberta.
```

---

### 42. Consolidar documentacao

Atualize o README com:

- escopo final;
- como configurar;
- como migrar;
- como testar;
- como executar;
- como limpar;
- decisões;
- limitações;
- ponte para revisão.

Crie os documentos finais listados no objetivo.

Não deixe a parte 2 como notas soltas.

---

## Entendendo o que foi feito

### O projeto passou a representar um ciclo operacional

Abertura, atribuição, execução, pagamento e conclusão passaram a compartilhar um modelo consistente.

### A Ordem continuou sendo a raiz

As transições da Ordem governaram o fluxo, enquanto Técnico e Pagamento permaneceram entidades com responsabilidades próprias.

### Historico e auditoria foram separados

Histórico registrou mudança de status; auditoria registrou autoria e instante de persistência.

### A concorrencia foi tratada

`@Version` impediu que uma atualização antiga sobrescrevesse uma nova.

### As leituras ficaram operacionais

Views e projections entregaram dados adequados para telas e relatórios sem carregar o agregado inteiro.

---

## Erros comuns importantes

### Modelar Atividade-Tecnico como ManyToMany direto

A associação possui dados e regras próprias.

### Concluir Ordem sem validar Atividades

O agregado pode ficar inconsistente.

### Usar double para Pagamento

Valor monetário exige `BigDecimal`.

### Ignorar row count do bulk

Zero linhas pode significar ausência ou conflito.

### Capturar optimistic lock e repetir cegamente

A operação precisa recarregar e revalidar regras.

---

## Comandos uteis

### Testes completos

```powershell
mvn clean verify
```

### Migrations

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

### Aplicacao

```powershell
mvn exec:java
```

### Consultar histórico

```sql
SELECT
    ordem.codigo,
    historico.status_anterior,
    historico.status_novo,
    historico.observacao,
    historico.ocorrido_em,
    historico.created_by
FROM projeto_os_351.ordem_status_historico historico
JOIN projeto_os_351.ordem_servico ordem
    ON ordem.id = historico.ordem_servico_id
ORDER BY
    historico.ocorrido_em,
    historico.id;
```

### Consultar views

```sql
SELECT *
FROM projeto_os_351.vw_ordem_operacional;

SELECT *
FROM projeto_os_351.vw_pagamento_pendente;

SELECT *
FROM projeto_os_351.vw_carga_tecnico;
```

---

## Exercicio guiado

### Parte 1 — Reatribuicao

Desenhe uma evolução que mantenha histórico de Técnicos anteriores.

Não sobrescreva silenciosamente a atribuição.

### Parte 2 — Pagamento parcial

Modele múltiplos Pagamentos para a mesma Ordem.

Defina regra de quitação.

### Parte 3 — Exclusao logica

Adicione `ativo` ou `deletedAt` a um cadastro mestre em nova migration.

Compare com cancelamento de Ordem.

### Parte 4 — Concorrencia de atribuicao

Duas transações tentam atribuir Técnicos diferentes à mesma Atividade.

Confirme unique e traduza conflito.

### Parte 5 — Consulta de SLA

Crie projection com tempo entre abertura e conclusão.

Use `Duration` no result.

### Parte 6 — Outbox

Desenhe tabela de outbox para evento `OrdemConcluida`.

Não implemente mensageria.

### Parte 7 — Explain

Execute `EXPLAIN` nas views operacionais.

Compare com índices criados.

### Parte 8 — ADR final

Registre:

```text
Ordem como aggregate root;

Atividade-Técnico como entidade associativa;

Pagamento com BigDecimal;

histórico separado de auditoria;

@Version em mutáveis;

cancelamento em vez de delete;

bulk somente específico;

views para leitura operacional;

afterCommit para efeito posterior;

Testcontainers para suíte final.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 351 foi preservada;
- o mesmo projeto foi continuado;
- o mesmo schema foi evoluído;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- JUnit 6.1.1 foi mantido;
- Testcontainers 2.0.5 foi mantido;
- PostgreSQL real foi usado;
- Spring Boot não foi usado;
- H2 não foi usado;
- Flyway permaneceu dono do DDL;
- Hibernate permaneceu em validate;
- V6 foi criada;
- V7 foi criada;
- V8 foi criada;
- V9 foi criada;
- V10 foi criada;
- repeatable foi evoluída;
- migrations anteriores não foram editadas;
- Técnico foi modelado;
- Técnico possui auditoria;
- Técnico possui versão;
- Técnico ativo foi exigido;
- cascade para Técnico não foi usado;
- Atividade-Técnico virou entidade;
- associação registrou instante;
- unique por Atividade foi criado;
- atribuição duplicada foi rejeitada;
- Pagamento foi modelado;
- BigDecimal foi usado;
- escala dois foi validada;
- valor positivo foi exigido;
- status de Pagamento foi persistido como STRING;
- regras de pagoEm foram protegidas;
- histórico de status foi modelado;
- histórico foi separado da auditoria;
- status anterior foi registrado;
- status novo foi registrado;
- transições da Ordem foram implementadas;
- transições inválidas foram rejeitadas;
- transições da Atividade foram implementadas;
- Ordem só concluiu com Atividades válidas;
- Pagamentos foram validados antes da conclusão;
- dirty checking foi usado;
- save redundante não foi exigido;
- histórico compartilhou a transação;
- rollback desfez status e histórico;
- `@Version` detectou concorrência;
- conflito otimista foi testado;
- estado vencedor foi preservado;
- retry cego não foi recomendado;
- exclusão física de Ordem foi proibida;
- cancelamento foi usado;
- foreign keys protegeram cadastros;
- remoção de Atividade teve regras;
- orphanRemoval foi usado somente no caso permitido;
- bulk genérico não foi criado;
- bulk específico de Pagamento foi criado;
- `@Modifying` foi usado;
- row count foi validado;
- auditoria bulk foi explícita;
- versão bulk foi incrementada;
- flush automático foi usado;
- clear automático foi usado;
- projection operacional foi criada;
- projection de Pagamento foi criada;
- projection de carga do Técnico foi criada;
- Técnico sem Atividade apareceu;
- views foram criadas;
- aliases foram validados;
- query service foi readOnly;
- paginação foi estável;
- N+1 foi controlado;
- service de Técnico foi transacional;
- service de Pagamento foi transacional;
- service de Ordem foi evoluído;
- commands foram imutáveis;
- results não expuseram entidades;
- afterCommit foi usado;
- afterCommit não executou em rollback;
- migrations foram testadas;
- mappings foram testados;
- atribuição foi testada;
- status foi testado;
- Atividade foi testada;
- Pagamento foi testado;
- conclusão foi testada;
- optimistic lock foi testado;
- consultas foram testadas;
- exclusão foi testada;
- fluxo completo foi testado;
- arquitetura final foi testada;
- cleaner foi atualizado;
- filhos foram removidos antes dos pais;
- fixtures foram limpas;
- nenhuma transação ficou aberta;
- documentação foi consolidada;
- projeto do M13 foi concluído;
- revisão técnica não foi antecipada;
- prova prática não foi antecipada;
- ponte para a aula 353 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que configurações locais não aparecem.

Adicione o projeto completo:

```powershell
git add `
  labs/m13/aula-351-projeto-persistencia-os-parte-1
```

Commit recomendado:

```powershell
git commit -m "feat(m13): concluir projeto de persistencia de os"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você concluiu o projeto integrado de persistência de Ordem de Serviço.

O projeto final possui:

```text
Cliente;

Produto;

Técnico;

Ordem;

Atividade;

Atividade-Técnico;

Pagamento;

Histórico de status;

auditoria;

versionamento;

migrations;

repositories;

services;

projections;

views;

Testcontainers.
```

O fluxo completo passou por:

```text
abertura;

atribuição;

agendamento;

atendimento;

conclusão de Atividades;

registro financeiro;

pagamento;

conclusão da Ordem;

histórico;

afterCommit.
```

As principais decisões foram:

```text
Ordem:
aggregate root.

Atividade:
parte do agregado.

Técnico:
cadastro externo.

Atividade-Técnico:
entidade associativa.

Pagamento:
entidade financeira explícita.

Histórico:
registro de transição.

Auditoria:
autoria e tempo.

Version:
controle concorrente.

Cancelamento:
substitui delete operacional.

Projection:
leitura especializada.

Flyway:
evolução do schema.

Testcontainers:
prova de integração.
```

A próxima aula será:

```text
353 - M13.43 - Revisao tecnica JDBC JPA Hibernate Spring Data
```

Nela, você revisará o módulo inteiro de forma estruturada:

- JDBC;
- DataSource;
- transações;
- DAO;
- Repository Pattern;
- Flyway;
- JPA;
- Hibernate;
- lifecycle;
- persistence context;
- dirty checking;
- relacionamentos;
- fetch;
- N+1;
- JPQL;
- Criteria API;
- projections;
- paginação;
- locks;
- auditoria;
- Spring Data;
- queries;
- transações declarativas;
- Testcontainers;
- migrations;
- projeto final;
- decisões arquiteturais;
- erros recorrentes;
- preparação para a prova prática.

A aula 352 encerrou a construção.

A aula 353 organizará o conhecimento para revisão, diagnóstico e preparação da avaliação.

---

# Material complementar

## Checkpoint final

- [ ] Completei o projeto de persistência de OS.
- [ ] Modelei Técnico, Pagamento e histórico.
- [ ] Implementei transições, concorrência e consultas finais.
- [ ] Validei o fluxo completo em PostgreSQL real.
- [ ] Preparei o projeto para a revisão técnica.

---

## Troubleshooting adicional

### Atribuicao duplicada passou

Revise validação do service e unique de `atividade_id`.

### Ordem concluiu com Atividade aberta

Revise a regra da entidade e o carregamento do agregado.

### Pagamento perdeu casas decimais

Revise `BigDecimal`, escala e coluna numeric.

### Histórico nao foi gravado

Confirme mesma transação e repository correto.

### Optimistic lock nao ocorreu

Confirme dois contexts, versão e flush independente.

---

## Perguntas de revisao

1. Técnico pertence ao agregado da Ordem?
2. Por que Atividade-Técnico virou entidade?
3. Qual tipo representa valor monetário?
4. Histórico substitui auditoria?
5. Qual é o fluxo principal da Ordem?
6. Quando a Ordem pode ser cancelada?
7. Quando pode ser concluída?
8. Managed precisa de save?
9. O que detecta concorrência?
10. O que fazer após conflito?
11. Ordem deve ser deletada?
12. Quando Atividade pode ser removida?
13. Qual bulk foi permitido?
14. O que o row count informa?
15. Para que servem views?
16. Query service altera entidade?
17. Quando afterCommit executa?
18. Qual banco valida a suíte?
19. O projeto terminou?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não.
2. Porque possui dados e regras.
3. BigDecimal.
4. Não.
5. Abrir, atribuir, atender, pagar e concluir.
6. Em ABERTA ou AGENDADA.
7. Após validar Atividades e Pagamentos.
8. Não.
9. `@Version`.
10. Recarregar e revalidar.
11. Não no fluxo operacional.
12. Antes do atendimento e sob regras.
13. Cancelamento de Pagamentos vencidos.
14. Quantas linhas mudaram.
15. Leituras operacionais.
16. Não.
17. Depois do commit.
18. PostgreSQL em Testcontainers.
19. Sim.
20. Revisao tecnica JDBC JPA Hibernate Spring Data.

---

## Desafio opcional

Crie:

```java
ProjetoOsFinalPolicyVerifier
```

Entrada:

```text
migrations;

entidades;

repositories;

services;

queries;

views;

testes.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- exigir V1 a V10;
- exigir auditoria;
- exigir `@Version`;
- alertar cascade em cadastro mestre;
- alertar `double` monetário;
- exigir histórico nas transições;
- alertar delete de Ordem;
- exigir row count em bulk;
- exigir clear após bulk;
- alertar entity retornada por service;
- exigir Testcontainers;
- alertar N+1;
- não iniciar Spring;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 352 - M13.42 - Projeto persistencia OS parte 2

- Continuei o mesmo projeto iniciado na aula 351.
- Mantive o schema `projeto_os_351`.
- Criei migrations V6 a V10.
- Evoluí as views repeatable.
- Modelei `TecnicoEntity`.
- Modelei `AtividadeTecnicoEntity`.
- Evitei ManyToMany direto.
- Mantive Técnico fora do cascade da Ordem.
- Criei regra de uma atribuição ativa por Atividade.
- Modelei `PagamentoEntity`.
- Usei `BigDecimal` com escala dois.
- Criei status de Pagamento.
- Modelei `OrdemStatusHistoricoEntity`.
- Diferenciei histórico de auditoria.
- Implementei transições da Ordem.
- Implementei transições das Atividades.
- Registrei histórico na mesma transação.
- Usei dirty checking sem save redundante.
- Validei todas as Atividades antes da conclusão.
- Validei Pagamentos antes da conclusão.
- Mantive `@Version` nas entidades mutáveis.
- Testei conflito otimista com duas transações.
- Preservei o estado vencedor.
- Evitei retry cego.
- Proibi exclusão física de Ordem no fluxo operacional.
- Usei cancelamento como transição.
- Criei regras para remoção de Atividade.
- Mantive orphanRemoval somente no agregado.
- Criei bulk específico para Pagamentos vencidos.
- Validei row count.
- Atualizei auditoria e versão no bulk.
- Usei flush e clear automáticos.
- Criei `OrdemOperacionalView`.
- Criei `PagamentoPendenteView`.
- Criei `TecnicoCargaView`.
- Mantive query services readOnly.
- Controlei N+1 e ordenação.
- Usei afterCommit no fechamento.
- Testei rollback sem efeito posterior.
- Executei o fluxo completo em PostgreSQL real.
- Consolidei a documentação final.
- Concluí o projeto de persistência do M13.
- Próxima aula: Revisao tecnica JDBC JPA Hibernate Spring Data.
```

---

## Referencia tecnica curta

```text
Tecnico:
cadastro externo.

AtividadeTecnico:
associação com dados.

Pagamento:
BigDecimal.

Historico:
transição.

Auditoria:
autoria.

Version:
concorrência.

Dirty checking:
update managed.

Cancelamento:
sem delete.

Projection:
leitura.

Testcontainers:
prova final.
```

Regra final:

```text
a segunda parte do projeto de persistencia de Ordem de Servico deve completar o ciclo operacional com atribuicao de Tecnico, Pagamentos, historico de status, transicoes protegidas, dirty checking, controle otimista, consultas especializadas, regras de exclusao e testes de fluxo completo; a Ordem permanece como aggregate root, o schema continua sob Flyway, o mapping sob Hibernate validate e toda integracao deve ser comprovada em PostgreSQL real.
```
