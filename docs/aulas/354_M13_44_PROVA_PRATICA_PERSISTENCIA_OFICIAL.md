# 354 - M13.44 - Prova pratica persistencia

## Apresentacao da aula

Esta aula é a avaliação prática do Módulo 13.

Você já estudou e praticou:

```text
JDBC;

DataSource;

HikariCP;

transações;

DAO;

Repository Pattern;

Flyway;

JPA;

Hibernate;

EntityManager;

lifecycle;

dirty checking;

relacionamentos;

fetch;

N+1;

JPQL;

Criteria API;

projections;

paginação;

locks;

auditoria;

Spring Data JPA;

queries derivadas;

@Query;

transações declarativas;

Testcontainers;

migrations evolutivas.
```

Também concluiu um projeto completo de persistência de Ordem de Serviço.

Agora o objetivo é demonstrar que consegue transferir esse conhecimento para outro domínio sem receber um roteiro de implementação completo.

A prova será:

```text
individual;

prática;

executável;

baseada em PostgreSQL real;

avaliada por comportamento e decisões técnicas.
```

O domínio escolhido será:

```text
Sistema de Reservas de Equipamentos.
```

Uma empresa precisa controlar equipamentos compartilhados, como:

- notebooks;
- projetores;
- tablets;
- câmeras;
- kits de apresentação.

Colaboradores poderão criar reservas para um período.

Cada reserva possuirá um ou mais itens.

O sistema deverá impedir conflitos de período para o mesmo equipamento.

Também deverá registrar auditoria, histórico de status, versionamento e consultas operacionais.

A prova não exige API REST.

Não haverá:

- Spring Boot;
- controller;
- endpoint;
- JSON;
- autenticação real;
- mensageria;
- frontend.

O foco é exclusivamente:

```text
persistência Java profissional.
```

A stack obrigatória será:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data JPA 4.1.0;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

PostgreSQL 17.6.
```

A avaliação verificará se você consegue:

1. interpretar regras;
2. definir o agregado;
3. criar migrations;
4. mapear entidades;
5. configurar Spring e JPA;
6. criar repositories;
7. implementar services transacionais;
8. controlar concorrência;
9. criar consultas especializadas;
10. testar contra PostgreSQL real;
11. diagnosticar falhas;
12. documentar decisões.

Você poderá consultar:

- documentação oficial;
- suas aulas anteriores;
- código do projeto de OS;
- anotações pessoais;
- diário de bordo.

Você não deverá copiar o projeto de OS apenas trocando nomes.

O avaliador observará se o novo domínio recebeu decisões próprias.

A prova não terá gabarito nesta aula.

Ela terá:

- enunciado;
- restrições;
- estrutura mínima;
- entregáveis;
- critérios de aceite;
- rubrica;
- perguntas de defesa técnica.

A correção e o fechamento serão tratados na aula seguinte de encerramento do módulo.

A próxima aula será:

```text
355 - M13.45 - Fechamento do Modulo 13 persistencia Java
```

---

## Onde estamos na formacao

O encerramento do M13 está assim:

```text
351:
Projeto persistencia OS parte 1.

352:
Projeto persistencia OS parte 2.

353:
Revisao tecnica JDBC JPA Hibernate Spring Data.

354:
Prova pratica persistencia.

355:
Fechamento do Modulo 13 persistencia Java.
```

A prova deve demonstrar domínio integrado.

Não basta criar entidades e salvar registros.

Você precisará mostrar:

```text
schema consistente;

lifecycle correto;

transação atômica;

concorrência protegida;

consulta eficiente;

teste real;

estado final verificável.
```

A avaliação será dividida em oito blocos:

```text
Bloco 1:
projeto e configuração.

Bloco 2:
migrations e schema.

Bloco 3:
modelo JPA.

Bloco 4:
repositories e consultas.

Bloco 5:
services e transações.

Bloco 6:
concorrência e auditoria.

Bloco 7:
Testcontainers e testes.

Bloco 8:
documentação e defesa técnica.
```

Cada bloco possui critérios obrigatórios.

Uma solução que compila, mas não preserva regras de negócio, não será considerada completa.

Uma solução que funciona apenas em H2 também não será aceita.

Uma solução com PostgreSQL local configurado manualmente, mas sem Testcontainers, ficará incompleta.

A prova mede:

```text
implementação;

explicação;

evidência.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-354-prova-pratica-persistencia
```

Estrutura mínima:

```text
labs
└── m13
    └── aula-354-prova-pratica-persistencia
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── application.local.env.example
        │   └── application.local.env
        ├── docs
        │   ├── modelo-relacional.md
        │   ├── decisoes-arquiteturais.md
        │   ├── estrategia-concorrencia.md
        │   ├── estrategia-testes.md
        │   └── relatorio-final.md
        ├── scripts
        │   ├── 01_validar_ambiente.ps1
        │   ├── 02_criar_database_local.ps1
        │   ├── 03_executar_migrations.ps1
        │   ├── 04_executar_testes.ps1
        │   ├── 05_executar_aplicacao.ps1
        │   ├── 06_validar_estado_final.ps1
        │   └── 07_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── reservaequipamento
            │   │                   ├── Main.java
            │   │                   ├── application
            │   │                   ├── audit
            │   │                   ├── config
            │   │                   ├── domain
            │   │                   └── persistence
            │   └── resources
            │       └── db
            │           └── migration
            └── test
                ├── java
                │   └── br
                │       └── com
                │           └── formacao
                │               └── reservaequipamento
                └── resources
                    └── logback-test.xml
```

O package principal deve ser:

```text
br.com.formacao.reservaequipamento
```

O database local será:

```text
formacao_java_prova_persistencia_354
```

O database de teste será criado pelo Testcontainers.

O schema será:

```text
reserva_equipamento
```

Ao final, o projeto deverá:

- compilar;
- aplicar migrations;
- iniciar o contexto Spring;
- executar o fluxo de demonstração;
- passar todos os testes;
- remover fixtures;
- produzir relatório final.

---

## Conceito essencial

### Enunciado do dominio

A empresa possui Colaboradores e Equipamentos.

Um Colaborador pode solicitar uma Reserva.

Uma Reserva possui:

- período de início;
- período de fim;
- finalidade;
- status;
- um ou mais itens;
- auditoria;
- versão.

Cada item da Reserva aponta para um Equipamento.

O mesmo Equipamento não pode estar reservado em períodos sobrepostos enquanto a Reserva estiver em estado ativo.

---

### Entidades obrigatorias

A solução deve possuir, no mínimo:

```text
ColaboradorEntity;

EquipamentoEntity;

ReservaEntity;

ReservaItemEntity;

ReservaStatusHistoricoEntity.
```

Você poderá criar outras classes se justificar.

---

### Colaborador

Campos mínimos:

```text
id;

matricula;

nome;

ativo;

versao;

createdAt;

updatedAt;

createdBy;

updatedBy.
```

Regras:

- matrícula obrigatória;
- matrícula unique;
- nome obrigatório;
- somente Colaborador ativo pode solicitar Reserva;
- Reserva não possui cascade para Colaborador.

---

### Equipamento

Campos mínimos:

```text
id;

codigoPatrimonio;

nome;

categoria;

ativo;

versao;

auditoria.
```

Regras:

- patrimônio obrigatório;
- patrimônio unique;
- nome obrigatório;
- categoria obrigatória;
- somente Equipamento ativo pode ser reservado;
- Reserva não possui cascade para Equipamento.

---

### Reserva

Campos mínimos:

```text
id;

codigo;

colaborador;

inicio;

fim;

finalidade;

status;

itens;

versao;

auditoria.
```

Status obrigatórios:

```text
SOLICITADA;

CONFIRMADA;

EM_USO;

FINALIZADA;

CANCELADA.
```

Regras:

- código obrigatório e unique;
- início obrigatório;
- fim obrigatório;
- fim deve ser posterior ao início;
- finalidade obrigatória;
- ao menos um item;
- nenhum Equipamento repetido na mesma Reserva;
- estado inicial `SOLICITADA`.

---

### ReservaItem

Campos mínimos:

```text
id;

reserva;

equipamento;

observacao;

versao;

auditoria.
```

A entidade associativa é obrigatória.

Não use `ManyToMany` direto.

Motivos:

- o item pode possuir observação;
- poderá evoluir para quantidade, acessórios e condição de devolução;
- precisa de auditoria;
- precisa de identidade própria.

---

### Historico

Cada transição de status deve gerar:

```text
ReservaStatusHistoricoEntity.
```

Campos mínimos:

```text
id;

reserva;

statusAnterior;

statusNovo;

observacao;

ocorridoEm;

versao;

auditoria.
```

O histórico deve compartilhar a mesma transação da mudança.

---

### Agregado

A raiz do agregado será:

```text
Reserva.
```

A Reserva controla:

```text
ReservaItem.
```

Colaborador e Equipamento são referências externas.

Portanto:

```text
cascade Reserva -> ReservaItem:
permitido e esperado.

cascade Reserva -> Colaborador:
proibido.

cascade ReservaItem -> Equipamento:
proibido.
```

Você deverá justificar `orphanRemoval`.

---

### Transicoes da Reserva

Fluxo permitido:

```text
SOLICITADA
    -> CONFIRMADA
    -> EM_USO
    -> FINALIZADA.
```

Cancelamento permitido:

```text
SOLICITADA
    -> CANCELADA.

CONFIRMADA
    -> CANCELADA.
```

Não permitido:

```text
FINALIZADA -> outro status;

CANCELADA -> outro status;

SOLICITADA -> FINALIZADA;

EM_USO -> CANCELADA.
```

A entidade deve proteger as transições.

Não deixe o service atribuir status por setter.

---

### Conflito de periodo

Duas Reservas possuem conflito quando:

```text
inicioExistente < fimNova
AND
fimExistente > inicioNova.
```

O conflito considera Reservas nos estados:

```text
SOLICITADA;

CONFIRMADA;

EM_USO.
```

Reservas `FINALIZADA` ou `CANCELADA` não bloqueiam novo período.

O conflito deve ser verificado para cada Equipamento solicitado.

---

### Concorrencia do conflito

Uma simples consulta antes do insert pode sofrer race condition:

```text
transação A consulta:
livre.

transação B consulta:
livre.

A confirma.

B confirma.
```

Você precisa escolher e implementar uma estratégia.

Opções aceitáveis:

- lock pessimista por Equipamento;
- tabela de ocupação com constraint adequada;
- combinação de lock e verificação;
- outra solução equivalente com justificativa e teste.

Somente `@Version` na Reserva não resolve a disputa entre duas Reservas novas.

A estratégia deve estar documentada em:

```text
docs/estrategia-concorrencia.md
```

---

### Auditoria obrigatoria

Todas as entidades mutáveis devem possuir:

```text
createdAt;

updatedAt;

createdBy;

updatedBy.
```

O ator será fornecido por contexto local, como nas aulas anteriores.

Nos testes, use `Clock` controlado.

Não use horário real como base de assertions exatas.

---

### Versionamento obrigatorio

As entidades mutáveis devem possuir:

```java
@Version
```

A prova deve conter um teste de optimistic locking sobre uma entidade existente.

Exemplo aceitável:

```text
dois contexts alteram o mesmo Equipamento;

primeiro confirma;

segundo falha.
```

Isso é diferente do teste de duas Reservas novas disputando o mesmo período.

A prova precisa demonstrar os dois problemas.

---

### Migrations obrigatorias

Crie migrations versionadas.

Estrutura sugerida:

```text
V1:
schema e sequences.

V2:
Colaborador e Equipamento.

V3:
Reserva.

V4:
ReservaItem.

V5:
Histórico.

V6:
índices e constraints.

R__:
view operacional.
```

Você pode dividir de outra forma, desde que a sequência seja clara.

Flyway deve executar antes do Hibernate.

Hibernate deve usar:

```text
validate.
```

Proibido:

```text
create;

create-drop;

update.
```

---

### View operacional

Crie uma repeatable migration com uma view de reservas.

Campos mínimos:

```text
reserva_id;

codigo;

status;

colaborador_nome;

inicio;

fim;

quantidade_itens;

created_at.
```

Você poderá adicionar:

- categorias;
- primeiro Equipamento;
- duração;
- data de atualização.

A view será usada por uma projection nativa.

---

### Repositories

Repositories mínimos:

```text
ColaboradorRepository;

EquipamentoRepository;

ReservaRepository;

ReservaStatusHistoricoRepository.
```

`ReservaItem` pode ser persistido pelo agregado.

Não crie repository próprio sem caso de uso.

---

### Queries obrigatorias

A solução deve possuir:

1. query derivada simples;
2. `@Query` JPQL;
3. query nativa sobre a view;
4. consulta paginada;
5. consulta de conflito de período;
6. consulta detalhada com fetch controlado.

Exemplos de finalidade:

```text
buscar Colaborador por matrícula;

buscar Equipamento por patrimônio;

detalhar Reserva;

listar Reservas por status;

listar view operacional;

verificar conflito.
```

---

### Projection obrigatoria

Crie pelo menos:

```text
ReservaResumoView
```

ou um record equivalente.

Campos mínimos:

```text
id;

codigo;

status;

colaboradorNome;

inicio;

fim;

quantidadeItens.
```

A listagem não deve retornar a entidade completa.

---

### Service principal

Crie:

```text
ReservaApplicationService.
```

Método obrigatório:

```java
@Transactional
public ReservaCriadaResult criar(
        CriarReservaCommand command
)
```

Fluxo:

1. validar command;
2. verificar código duplicado;
3. buscar Colaborador;
4. validar ativo;
5. buscar Equipamentos;
6. validar ativos;
7. impedir duplicidade no command;
8. verificar conflito;
9. criar agregado;
10. adicionar itens;
11. salvar;
12. registrar histórico inicial;
13. confirmar;
14. retornar result.

---

### Services de transicao

A solução pode usar o mesmo service ou serviços separados.

Operações mínimas:

```text
confirmar;

iniciarUso;

finalizar;

cancelar.
```

Cada operação deve:

- carregar Reserva;
- capturar status anterior;
- executar comportamento da entidade;
- criar histórico;
- deixar dirty checking persistir;
- confirmar na mesma transação.

---

### Results

Não retorne entidades da camada de aplicação.

Crie records, por exemplo:

```text
ReservaCriadaResult;

ReservaDetalhadaResult;

ReservaResumoResult.
```

A prova será penalizada se o `Main` ou a borda receber uma entidade managed.

---

### Main

O `Main` deve demonstrar:

1. criação de Colaborador;
2. criação de dois Equipamentos;
3. criação de Reserva com dois itens;
4. confirmação;
5. início de uso;
6. finalização;
7. consulta detalhada;
8. consulta da view;
9. impressão do histórico;
10. limpeza das fixtures.

Formato textual simples.

Não use JSON.

---

### Testcontainers

Use PostgreSQL real.

Requisitos:

```text
imagem com tag fixa;

porta dinâmica;

Flyway antes do Hibernate;

container compartilhado por JVM ou estratégia equivalente;

fixtures isoladas;

execução sequencial se compartilhar schema.
```

Não use H2.

---

### Testes obrigatorios

A suíte deve conter, no mínimo:

```text
MigrationReservaIT;

MappingReservaIT;

CriarReservaIT;

CriarReservaRollbackIT;

ConflitoPeriodoIT;

ConflitoConcorrenteIT;

ReservaStatusIT;

ReservaOptimisticLockIT;

ReservaProjectionIT;

ReservaPaginationIT;

ReservaArchitectureTest.
```

Você pode renomear, mas todos os cenários devem existir.

---

### Rubrica de pontuacao

Pontuação total:

```text
100 pontos.
```

Distribuição:

```text
10:
estrutura e configuração.

15:
migrations e schema.

15:
modelo JPA e agregado.

15:
repositories e consultas.

15:
services e transações.

10:
concorrência e versionamento.

15:
testes com PostgreSQL real.

5:
documentação e qualidade final.
```

Nota mínima recomendada para aprovação:

```text
70 pontos.
```

Itens eliminatórios técnicos:

- projeto não compila;
- migrations não aplicam;
- não usa PostgreSQL real;
- não existe transação no caso de uso;
- conflitos de período são ignorados;
- não existe teste;
- Hibernate cria o schema;
- configurações locais ou senhas são commitadas.

---

### Estrategia minima de integridade no banco

As regras principais precisam existir também no schema.

Não dependa apenas de validações Java.

O banco deve possuir, no mínimo:

```text
unique em Colaborador.matricula;

unique em Equipamento.codigoPatrimonio;

unique em Reserva.codigo;

foreign keys obrigatórias;

check de inicio e fim;

check dos status;

check de versao não negativa;

campos de auditoria não nulos;

unique de Reserva e Equipamento no item.
```

Uma constraint de período completa pode exigir recurso específico do PostgreSQL.

Você não é obrigado a usar exclusion constraint, mas pode adotá-la se conseguir justificar e testar corretamente.

Uma possibilidade avançada seria modelar a ocupação com intervalo PostgreSQL e uma constraint de exclusão.

Outra possibilidade é bloquear o Equipamento e executar a consulta de sobreposição dentro da mesma transação.

O importante é provar que duas transações concorrentes não confirmam Reservas incompatíveis.

A documentação deve explicar:

- objeto bloqueado;
- ordem de aquisição dos locks;
- duração da transação;
- comportamento em timeout;
- risco de deadlock;
- teste que comprova a solução.

---

### Ordenacao de locks

Uma Reserva pode solicitar mais de um Equipamento.

Se duas transações bloquearem os mesmos Equipamentos em ordens diferentes, pode existir deadlock.

Exemplo:

```text
transação A:
bloqueia equipamento 10;
depois tenta 20.

transação B:
bloqueia equipamento 20;
depois tenta 10.
```

Para reduzir esse risco, ordene os IDs antes de adquirir locks:

```text
10;

20.
```

Todas as transações devem seguir a mesma ordem.

O teste concorrente precisa usar pelo menos um cenário com dois Equipamentos para demonstrar que a estratégia foi pensada além do caso mais simples.

---

### Consulta de sobreposicao

A consulta deve considerar a regra matemática exata.

Não use somente:

```text
inicio existente entre os limites novos.
```

Isso falha quando uma Reserva existente engloba completamente a nova.

A condição correta é:

```text
existente.inicio < nova.fim
AND
existente.fim > nova.inicio.
```

Teste os limites.

Se uma Reserva termina exatamente quando outra começa:

```text
existente.fim == nova.inicio
```

não existe sobreposição.

Se a nova termina exatamente quando a existente começa:

```text
nova.fim == existente.inicio
```

também não existe sobreposição.

Registre essa decisão no README.

---

### Plano esperado de transacao

A criação deve ocorrer em uma única transação lógica:

```text
iniciar transação;

buscar Colaborador;

buscar e bloquear Equipamentos;

verificar ativos;

consultar conflitos;

criar Reserva;

criar itens;

persistir agregado;

registrar histórico SOLICITADA;

flush;

commit.
```

Se qualquer passo falhar:

```text
rollback de Reserva;

rollback dos itens;

rollback do histórico.
```

O service não deve capturar uma exception e continuar como se o commit ainda fosse seguro.

Se uma falha interna marcar rollback-only, o método precisa terminar como falha.

---

### SQL que voce deve conseguir prever

Antes de executar, escreva no relatório o SQL esperado de forma conceitual.

Criação:

```text
SELECT Colaborador;

SELECT Equipamentos com lock ou estratégia equivalente;

SELECT de conflito;

INSERT Reserva;

INSERT ReservaItem para cada equipamento;

INSERT Histórico.
```

Atualização de status:

```text
SELECT Reserva detalhada;

UPDATE Reserva com id e versao no WHERE;

INSERT Histórico.
```

Listagem:

```text
SELECT projection paginada;

SELECT count.
```

Optimistic locking:

```text
UPDATE Equipamento
SET nome = ?, versao = ?
WHERE id = ?
  AND versao = ?.
```

Depois compare com o SQL real.

Diferenças precisam ser explicadas.

---

### Politica de fetch da prova

Mappings devem permanecer `LAZY` quando a associação não precisa ser sempre carregada.

A prova deve possuir consultas específicas.

Detalhe:

```text
Reserva;

Colaborador;

itens;

Equipamentos.
```

Listagem:

```text
projection;
sem carregar agregado completo.
```

Histórico:

```text
consulta separada e ordenada.
```

Não altere tudo para EAGER para fazer um teste passar.

A solução precisa demonstrar que sabe definir fetch por caso de uso.

---

### Tratamento de exceptions

Crie exceptions da aplicação para situações como:

```text
ColaboradorNaoEncontradoException;

ColaboradorInativoException;

EquipamentoNaoEncontradoException;

EquipamentoInativoException;

ReservaNaoEncontradaException;

CodigoReservaDuplicadoException;

ConflitoReservaException;

TransicaoReservaInvalidaException;

ConcorrenciaReservaException.
```

Não é obrigatório usar exatamente esses nomes.

É obrigatório impedir que detalhes de Hibernate ou PostgreSQL sejam o contrato principal da camada de aplicação.

Preserve a causa técnica para logs e testes diagnósticos.

---

### Matriz minima de testes

Organize a suíte por comportamento.

Migrations:

```text
banco vazio;

schema history;

tabelas;

constraints;

view;

Hibernate validate.
```

Criação:

```text
um item;

vários itens;

Colaborador inativo;

Equipamento inativo;

Equipamento duplicado no command;

código de Reserva duplicado;

rollback no segundo item.
```

Período:

```text
antes;

depois;

toque exato no limite;

sobreposição parcial;

sobreposição total;

Reserva cancelada não bloqueia;

Reserva finalizada não bloqueia.
```

Concorrência:

```text
duas Reservas simultâneas;

mesmo Equipamento;

mesmo período;

apenas uma confirma.
```

Status:

```text
fluxo completo;

cancelamento permitido;

transição inválida;

histórico ordenado.
```

Leitura:

```text
detalhe sem N+1;

projection;

view nativa;

paginação;

ordem estável.
```

Versionamento:

```text
duas atualizações da mesma entidade;

primeira confirma;

segunda falha;

estado vencedor preservado.
```

---

#Evidencias obrigatorias

O relatório final deve incluir evidências textuais.

Exemplos:

```text
mvn clean verify:
BUILD SUCCESS.

quantidade de testes:
informada.

imagem PostgreSQL:
informada.

versão Flyway:
informada.

última migration:
informada.

queries do cenário concorrente:
resumidas.

row count:
quando aplicável.

fixtures finais:
zero.
```

Não cole centenas de linhas de log.

Selecione evidências que comprovem os critérios.

---

### Controle de tempo da prova

Use blocos de execução.

Sugestão:

```text
15%:
leitura, modelo e decisões.

20%:
migrations e configuração.

20%:
entidades e repositories.

20%:
services e regras.

20%:
testes e concorrência.

5%:
documentação e revisão.
```

Se o tempo ficar curto, priorize:

1. schema;
2. criação transacional;
3. conflito;
4. testes;
5. projection;
6. acabamento.

Não esconda uma falha com teste desabilitado.

Uma entrega parcial honesta e executável é melhor que um projeto aparentemente completo que não compila.

---

### Protocolo de correcao

O avaliador deve seguir esta ordem:

```text
1. verificar arquivos locais e segredos;

2. executar mvn clean verify;

3. verificar migrations;

4. executar o Main;

5. validar estado final;

6. inspecionar estratégia concorrente;

7. executar teste de conflito isolado;

8. executar teste optimistic lock isolado;

9. revisar SQL e fetch;

10. aplicar a rubrica.
```

A nota não deve depender apenas de leitura estática.

O comportamento precisa ser executado.


### Protocolo final de submissao

A entrega deve ser reproduzível por outra pessoa.

O avaliador não deve precisar corrigir caminhos, criar tabelas manualmente ou descobrir configurações escondidas.

O README precisa informar:

```text
pré-requisitos;

versões;

como configurar o ambiente local;

como executar migrations;

como executar testes;

como executar o Main;

como validar o estado final;

como limpar o database.
```

Inclua também:

- decisão de concorrência;
- limitações conhecidas;
- quantidade de testes;
- commit final;
- pontuação estimada.

Não entregue:

- database dump como substituto de migration;
- container deixado manualmente em execução;
- arquivo com senha real;
- teste marcado como `@Disabled`;
- migration alterada depois de aplicada;
- logs gigantes;
- código comentado que substitui implementação;
- instrução dependente de uma IDE específica.

A execução oficial será por linha de comando.

A solução precisa funcionar com:

```powershell
mvn clean verify
```

e produzir uma saída clara quando Docker não estiver disponível.

O relatório deve declarar qualquer requisito que não tenha sido concluído.

Não invente evidência.


## Mao na massa guiada

### 1. Preparar o repositorio

Crie o laboratório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-354-prova-pratica-persistencia"

Set-Location `
  "labs\m13\aula-354-prova-pratica-persistencia"
```

Inicialize a estrutura sem copiar classes do projeto anterior automaticamente.

Você pode consultar o projeto de OS para lembrar padrões.

---

### 2. Criar o plano antes do codigo

Em `docs/decisoes-arquiteturais.md`, escreva antes de implementar:

```text
raiz do agregado;

entidades;

relacionamentos;

cascade;

transação;

estratégia de conflito;

queries;

testes.
```

Esse documento faz parte da avaliação.

---

### 3. Criar pom e configuracao

Adicione somente dependências necessárias.

Confirme com:

```powershell
mvn dependency:tree
```

Não use Spring Boot starter.

Configure o DataSource local por arquivo ignorado pelo Git.

---

### 4. Criar migrations

Implemente as migrations em sequência.

Execute após cada etapa:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

Não deixe todas para o final.

---

### 5. Criar o modelo

Implemente:

- enums;
- auditoria;
- entidades;
- factories;
- helpers;
- invariantes.

Depois compile:

```powershell
mvn clean compile
```

---

### 6. Criar repositories

Comece por buscas simples.

Depois crie:

- detalhe;
- conflito;
- projection;
- paginação;
- native view.

Teste cada consulta separadamente.

---

### 7. Criar services

Implemente primeiro `criar`.

Depois transições.

Não implemente todos os métodos antes do primeiro teste verde.

Use ciclos curtos:

```text
regra;

código;

teste;

execução;

commit.
```

---

### 8. Implementar concorrencia

Descreva a estratégia.

Crie um teste determinístico com duas transações.

Evite teste baseado apenas em `sleep`.

Use:

- latches;
- barreiras;
- transações controladas;
- dois `EntityManager`;
- dois threads quando necessário.

---

### 9. Criar testes

Use o PostgreSQL do Testcontainers.

Teste:

- caminho feliz;
- caminho inválido;
- rollback;
- constraint;
- conflito;
- optimistic lock;
- projection;
- paginação;
- arquitetura.

Não considere a prova pronta apenas porque o `Main` funciona.

---

### 10. Executar o fluxo completo

O `Main` deve rodar somente depois da suíte verde.

Execute:

```powershell
mvn clean verify
mvn exec:java
```

Registre o resultado no relatório.

---

### 11. Validar estado final

O script deve confirmar:

```text
zero COL-P354-%;

zero EQP-P354-%;

zero RES-P354-%;

zero histórico de fixture;

schema history válido;

nenhuma transação aberta.
```

---

### 12. Preparar a entrega

Antes do commit:

```powershell
git status
git diff
mvn clean verify
```

Revise:

- arquivos locais;
- logs;
- comentários temporários;
- testes desabilitados;
- senhas;
- TODOs;
- migrations alteradas;
- relatório final.

---

## Entendendo o que foi feito

### A prova mede transferencia

O domínio mudou, mas os princípios permanecem.

### O agregado precisa ser defendido

Reserva controla itens; cadastros externos permanecem independentes.

### Concorrencia possui dois problemas

Atualização de uma linha existente e criação concorrente de Reservas exigem estratégias diferentes.

### A persistencia precisa de evidencia

Migrations, SQL, testes e estado final comprovam o comportamento.

### A avaliacao inclui explicacao

Uma decisão não justificada pode funcionar por acaso.

---

## Erros comuns importantes

### Copiar o projeto de OS mecanicamente

O domínio de Reserva possui conflitos de período próprios.

### Usar apenas @Version para duas Reservas novas

Não existe a mesma linha versionada para comparar.

### Verificar conflito fora da transacao

Outra transação pode confirmar entre a consulta e o insert.

### Retornar entidade no result

A camada externa fica acoplada ao persistence context.

### Criar schema com Hibernate

A prova exige Flyway como dono do DDL.

---

## Comandos uteis

### Ambiente

```powershell
java -version
mvn -version
docker version
docker info
```

### Compilar

```powershell
mvn clean compile
```

### Testar

```powershell
mvn clean verify
```

### Executar

```powershell
mvn exec:java
```

### Flyway

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

### Git

```powershell
git status
git diff
git log -5 --oneline
```

---

## Exercicio guiado

### Parte 1 — Defesa do agregado

Explique por escrito:

```text
por que ReservaItem pertence à Reserva;

por que Equipamento não pertence;

por que ManyToMany direto foi evitado.
```

### Parte 2 — Conflito temporal

Crie cinco exemplos de períodos:

- sem conflito antes;
- sem conflito depois;
- conflito parcial no início;
- conflito parcial no fim;
- conflito completo.

Transforme cada exemplo em teste.

### Parte 3 — Rollback

Force falha no segundo item.

Confirme em nova transação que Reserva e primeiro item não existem.

### Parte 4 — Optimistic lock

Abra dois contexts e atualize o mesmo Equipamento.

Confirme que a segunda atualização falha.

### Parte 5 — Query budget

Defina limite de SELECTs para a consulta detalhada.

Falhe o teste se aparecer N+1.

### Parte 6 — Migration failure

Em uma branch temporária, crie migration inválida.

Confirme que a aplicação não inicia.

Remova o experimento antes da entrega.

### Parte 7 — Defesa oral

Responda sem consultar código:

1. quem cria o schema;
2. quem valida;
3. onde começa a transação;
4. por que o conflito é atômico;
5. por que a projection não é entidade.

### Parte 8 — Autoavaliacao

Use a rubrica e atribua sua pontuação.

Para cada perda, escreva uma ação de correção.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 354 foi definido;
- continuidade com a aula 353 foi preservada;
- domínio da prova é Reserva de Equipamentos;
- Java 21 foi exigido;
- Spring Framework foi exigido;
- Spring Data JPA foi exigido;
- Hibernate foi exigido;
- Flyway foi exigido;
- PostgreSQL foi exigido;
- Testcontainers foi exigido;
- Spring Boot foi proibido;
- H2 foi proibido;
- API REST não foi exigida;
- schema foi definido;
- database local foi definido;
- package principal foi definido;
- estrutura mínima foi definida;
- Colaborador foi exigido;
- Equipamento foi exigido;
- Reserva foi exigida;
- ReservaItem foi exigido;
- Histórico foi exigido;
- agregado foi definido;
- ReservaItem pertence ao agregado;
- Colaborador ficou fora do cascade;
- Equipamento ficou fora do cascade;
- ManyToMany direto foi proibido;
- auditoria foi exigida;
- Clock controlado foi exigido;
- `@Version` foi exigido;
- enums foram definidos;
- transições foram definidas;
- transições inválidas foram definidas;
- ao menos um item foi exigido;
- duplicidade de Equipamento foi proibida;
- conflito temporal foi formalizado;
- estados bloqueadores foram definidos;
- estados não bloqueadores foram definidos;
- race condition foi explicada;
- estratégia concorrente foi exigida;
- `@Version` não foi tratado como solução do insert concorrente;
- migrations versionadas foram exigidas;
- repeatable foi exigida;
- Flyway antes do Hibernate foi exigido;
- Hibernate update foi proibido;
- view operacional foi exigida;
- repositories mínimos foram definidos;
- query derivada foi exigida;
- JPQL foi exigida;
- native query foi exigida;
- paginação foi exigida;
- conflito foi exigido;
- detalhe com fetch foi exigido;
- projection foi exigida;
- service principal foi definido;
- transação no service foi exigida;
- fluxo de criação foi definido;
- services de transição foram exigidos;
- histórico na mesma transação foi exigido;
- dirty checking foi esperado;
- results sem entidades foram exigidos;
- Main demonstrativo foi exigido;
- Testcontainers com imagem fixa foi exigido;
- porta dinâmica foi exigida;
- testes mínimos foram definidos;
- teste de migration foi exigido;
- teste de mapping foi exigido;
- teste de criação foi exigido;
- teste de rollback foi exigido;
- teste de conflito foi exigido;
- teste concorrente foi exigido;
- teste de status foi exigido;
- teste optimistic lock foi exigido;
- teste projection foi exigido;
- teste paginação foi exigido;
- teste de arquitetura foi exigido;
- rubrica de 100 pontos foi definida;
- nota mínima recomendada foi definida;
- itens eliminatórios foram definidos;
- documentação foi exigida;
- relatório final foi exigido;
- estado final limpo foi exigido;
- configurações locais foram proibidas no Git;
- prova não recebeu gabarito;
- fechamento do módulo não foi antecipado;
- ponte para a aula 355 está correta;
- commit recomendado foi definido;
- diário de bordo está pronto.

---

## Commit recomendado

Faça commits intermediários durante a prova.

Sugestão:

```powershell
git commit -m "chore(m13): preparar prova pratica de persistencia"

git commit -m "feat(m13): criar schema e modelo de reservas"

git commit -m "feat(m13): implementar services e consultas de reservas"

git commit -m "test(m13): validar reservas com postgresql real"

git commit -m "docs(m13): finalizar prova pratica de persistencia"
```

O commit final recomendado é:

```powershell
git commit -m "feat(m13): concluir prova pratica de persistencia"
```

Antes do último commit:

```powershell
mvn clean verify
git status
git diff
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você recebeu a prova prática de persistência do M13.

O desafio exige integrar:

```text
migrations;

JPA;

Hibernate;

Spring Data;

transações;

concorrência;

auditoria;

projections;

Testcontainers.
```

O domínio possui:

```text
Colaborador;

Equipamento;

Reserva;

ReservaItem;

Histórico.
```

A regra crítica é:

```text
o mesmo Equipamento
não pode possuir Reservas ativas
em períodos sobrepostos.
```

A prova também exige diferenciar:

```text
optimistic locking:
atualização concorrente de entidade existente.

estratégia de reserva:
criação concorrente de registros novos.
```

A entrega será considerada completa quando:

- migrations aplicarem;
- contexto iniciar;
- fluxo funcionar;
- conflitos forem impedidos;
- rollback for comprovado;
- testes passarem;
- estado final estiver limpo;
- decisões estiverem documentadas.

A próxima aula será:

```text
355 - M13.45 - Fechamento do Modulo 13 persistencia Java
```

Nela, você fará:

- autoavaliação;
- correção orientada por critérios;
- análise das decisões;
- consolidação das competências;
- identificação de lacunas;
- checklist do módulo;
- atualização do portfólio;
- preparação da transição para o M14;
- ponte para Spring Boot.

A aula 354 avalia a execução.

A aula 355 consolidará o resultado e encerrará o módulo de persistência Java.

---

# Material complementar

## Checkpoint final

- [ ] Entendi todo o enunciado antes de implementar.
- [ ] Desenhei agregado, schema e transação.
- [ ] Defini uma estratégia real para conflito concorrente.
- [ ] Planejei migrations, queries e testes.
- [ ] Sei como validar a entrega sem depender do avaliador.

---

## Rubrica detalhada

### Estrutura e configuracao — 10 pontos

```text
2:
projeto compila.

2:
Spring sem Boot.

2:
configuração local segura.

2:
scripts funcionais.

2:
organização de packages.
```

### Migrations e schema — 15 pontos

```text
5:
migrations válidas.

4:
constraints e foreign keys.

3:
índices coerentes.

3:
repeatable e view.
```

### Modelo JPA — 15 pontos

```text
4:
agregado correto.

3:
mappings e LAZY.

3:
cascade controlado.

3:
auditoria e versão.

2:
factories e invariantes.
```

### Repositories e consultas — 15 pontos

```text
3:
queries simples.

3:
JPQL.

3:
native view.

3:
paginação e projection.

3:
detalhe sem N+1.
```

### Services e transacoes — 15 pontos

```text
5:
criação atômica.

4:
transições e histórico.

3:
rollback.

3:
results sem entidade.
```

### Concorrencia — 10 pontos

```text
6:
conflito temporal concorrente.

4:
optimistic locking.
```

### Testes — 15 pontos

```text
5:
Testcontainers.

4:
caminhos felizes.

3:
falhas e constraints.

3:
estado final e arquitetura.
```

### Documentacao — 5 pontos

```text
2:
modelo e decisões.

2:
estratégia concorrente.

1:
relatório final.
```

---

## Perguntas de defesa tecnica

1. Por que Reserva é a raiz do agregado?
2. Por que ReservaItem não é `ManyToMany` direto?
3. Por que não existe cascade para Equipamento?
4. Onde começa a transação de criação?
5. Como o conflito de período é calculado?
6. Como a solução impede duas criações simultâneas?
7. Por que `@Version` não basta nesse conflito?
8. Qual consulta pode gerar N+1?
9. Como a projection reduz o custo?
10. Por que Flyway executa antes do Hibernate?
11. O que acontece se o segundo item falhar?
12. Como o histórico permanece atômico?
13. Como você testou optimistic locking?
14. Por que o teste usa PostgreSQL real?
15. O que o script de estado final verifica?

---

## Template de relatorio final

Crie:

```text
docs/relatorio-final.md
```

Conteúdo mínimo:

```markdown
# Relatorio final da prova pratica

Resultado

- Compilacao:
- Migrations:
- Testes:
- Main:
- Estado final:

Decisoes principais

- Agregado:
- Cascade:
- Transacao:
- Concorrencia:
- Fetch:
- Projection:
- Auditoria:
- Migrations:

Evidencias

- Quantidade de testes:
- Tempo total:
- Imagem PostgreSQL:
- Versao final do schema:
- Commit final:

Pendencias

- Nenhuma.

Autoavaliacao

- Pontuacao estimada:
- Pontos fortes:
- Pontos a melhorar:
```

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 354 - M13.44 - Prova pratica persistencia

- Recebi a prova prática do M13.
- O domínio avaliado é Reserva de Equipamentos.
- Planejei o projeto antes de implementar.
- Defini Reserva como aggregate root.
- Mantive Colaborador e Equipamento fora do cascade.
- Modelei ReservaItem como entidade associativa.
- Planejei histórico de status.
- Planejei auditoria e `@Version`.
- Formalizei o conflito de períodos.
- Diferenciei optimistic lock de disputa entre inserts.
- Defini estratégia concorrente documentada.
- Planejei migrations versionadas e repeatable.
- Mantive Flyway como dono do schema.
- Mantive Hibernate em `validate`.
- Planejei repositories, JPQL, native query e projection.
- Planejei paginação e fetch controlado.
- Coloquei a transação no application service.
- Planejei rollback integral.
- Evitei retornar entidades na borda.
- Planejei testes com PostgreSQL em Testcontainers.
- Incluí testes de migration, mapping e constraints.
- Incluí testes de conflito e optimistic locking.
- Incluí teste de arquitetura.
- Usei rubrica objetiva de 100 pontos.
- Preparei relatório e defesa técnica.
- Próxima aula: Fechamento do Modulo 13 persistencia Java.
```

---

## Referencia tecnica curta

```text
Dominio:
Reserva de Equipamentos.

Aggregate:
Reserva.

Child:
ReservaItem.

External:
Colaborador e Equipamento.

Critical rule:
sem sobreposição ativa.

Schema:
Flyway.

Mapping:
Hibernate validate.

Transaction:
service.

Concurrency:
estratégia explícita.

Test:
PostgreSQL real.
```

Regra final:

```text
a prova pratica de persistencia deve demonstrar capacidade de transformar regras em schema, agregado, mappings, repositories, transacoes, consultas, auditoria, concorrencia e testes reais; a solucao precisa impedir sobreposicao de Reservas de forma atomica, diferenciar conflitos de criacao de optimistic locking, manter Flyway como dono do banco, Hibernate como validador e Testcontainers como evidencia reproduzivel da integracao.
```
