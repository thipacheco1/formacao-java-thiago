# Matriz de cobertura — aula 001

## Identificação

- ID: `001_M0_01_MAPA_DA_FORMACAO_COMPLETA_E_NIVEIS_DE_CARREIRA_JAVA`
- Título antigo: Mapa da Formação Completa e Níveis de Carreira Java
- Arquivo original: `docs/aulas/001_M0_01_MAPA_DA_FORMACAO_COMPLETA_E_NIVEIS_DE_CARREIRA_JAVA.md`
- Módulo e posição: M0.01
- Aula anterior relevante: aula 000 reconstruída
- Aula seguinte relevante: `002_M0_02_DIAGNOSTICO_INICIAL_TECNICO_E_PLANO_DE_ESTUDO.md`
- Arquétipo escolhido: mentoria de mapa técnico interativo
- Data da auditoria: 2026-07-16

## Resultado prometido ao aluno

Ao final, o aluno conseguirá localizar qualquer competência da formação nos 21 módulos atuais, explicar pelo menos quatro dependências importantes da sequência, analisar uma tarefa backend por diferentes níveis de responsabilidade e produzir um mapa pessoal de percurso sem ainda confundi-lo com o diagnóstico da aula 002.

## Inventário do conteúdo antigo

| Item | Tipo | Conteúdo único? | Destino na aula nova | Evidência de cobertura |
|---|---|---:|---|---|
| Java, backend, engenharia e arquitetura não são sinônimos | Conceito | Sim | Etapa 1 | Camadas de responsabilidade e pergunta de checagem |
| Formação como construção em camadas | Relação | Sim | Etapa 2 | Mapa de dependências explorável |
| Java → OO → banco → Spring → produção → arquitetura | Pré-requisitos | Sim | Etapa 2 | Rotas selecionáveis com causa e risco de pular |
| Iniciante, júnior, pleno, sênior, staff/engenheiro e arquiteto | Carreira | Sim | Etapa 8 | Lentes de responsabilidade e evidência esperada |
| A senioridade muda o tipo de pergunta | Conceito | Sim | Etapa 8 | Mesma ordem de serviço analisada por seis lentes |
| Endpoint de pedido visto por vários níveis | Exemplo | Sim | Etapa 8 | Consolidado no cenário mais rico de reagendamento de ordem de serviço |
| Backend corporativo não é só CRUD | Contexto | Sim | Etapas 1 e 8 | Fluxo de regra, transação, histórico, ocorrência, evento e operação |
| Papel detalhado dos módulos M0–M17 antigos | Mapa | Sim, mas desatualizado | Etapas 3–7 | Reconciliado com M0–M20 atuais sem remover competências |
| Ambiente e método | Módulo | Sim | Etapa 3 | M0 com propósito, tópicos, risco e evidência |
| Java fundamentos, Core, métodos e OO | Módulos | Sim | Etapa 3 | M1–M4 exploráveis |
| Collections, Generics, Streams, exceções, SOLID e patterns | Módulos | Sim | Etapa 4 | M5–M10 exploráveis |
| Build, Git, testes e qualidade | Módulo antigo M7/M8 | Sim | Etapa 5 | M11 atual, com ferramentas, testes, qualidade e entrega |
| SQL e modelagem | Módulo antigo M9 | Sim | Etapa 5 | M12 atual |
| JDBC, JPA, Hibernate e Spring Data | Módulo antigo M10 | Sim | Etapa 5 | M13 atual |
| Spring Boot e REST | Módulo antigo M11 | Sim | Etapa 5 | M14 atual |
| Segurança | Módulo antigo M12 | Sim | Etapa 6 | M15 atual |
| Integrações, mensageria e resiliência | Módulo antigo M13 | Sim | Etapa 6 | M16 atual |
| Docker, CI/CD, Kubernetes e cloud | Módulo antigo M14 | Sim | Etapa 6 | M17 atual |
| Observabilidade, performance e concorrência | Módulo antigo M15 | Sim | Etapa 6 | M18 atual |
| Arquitetura, DDD, distribuídos e liderança | Módulo antigo M16 | Sim | Etapa 7 | M19 atual |
| Projeto final, carreira e defesa | Módulo antigo M17 | Sim | Etapa 7 | M20 atual |
| Pular base, confiar em ferramenta, confundir volume, adiar arquitetura e reduzir backend a REST | Erros | Sim | Etapa 9 | Diagnóstico com causa, sintoma e correção |
| Pensamento arquitetural começa cedo | Nuance | Sim | Etapas 2, 3 e 7 | Decisões pequenas conectadas a responsabilidades futuras |
| Registro “Mapa da formação” | Atividade | Sim | Etapa 9 | Arquivo copiável com critérios de aceite |
| Cada aula forma um tipo de capacidade | Fechamento | Sim | Todas | Cada módulo mostra evidência que o aluno deve produzir |

## Repetições encontradas

| Repetição | Onde aparecia | Decisão | Motivo pedagógico |
|---|---|---|---|
| Definição de Java/backend/engenharia/arquitetura | Abertura e fechamento | Fazer apenas uma retomada aplicada | A aula 000 já introduziu a diferença |
| Níveis profissionais e perguntas | Duas seções completas | Consolidar na lente de responsabilidade | A interação preserva diferenças sem duplicar listas |
| Exemplo de endpoint e domínio corporativo | Duas seções | Consolidar em ordem de serviço | O cenário único comporta regra, dados, transação, evento e arquitetura |
| Importância de não pular base | Camadas, erros e fechamento | Demonstrar no mapa de dependências | A relação causal ensina melhor que repetição verbal |
| Papel geral da formação | Abertura, módulos e conclusão | Mostrar como evidência por módulo | O aluno vê o resultado esperado de cada etapa |

## Lacunas da aula antiga que serão corrigidas

| Lacuna | Consequência para o aluno | Correção planejada |
|---|---|---|
| Grade terminava no M17 | Contradição com a plataforma de 21 módulos | Usar M0–M20 e dados atuais do plano |
| Texto muito longo e passivo | Era difícil formar uma imagem mental do caminho | Criar atlas de módulos e dependências interativas |
| Listas de tecnologias sem evidência | O aluno não sabia o que conseguiria fazer | Mostrar propósito, risco e prova de competência por módulo |
| Dependências apenas afirmadas | Pareciam opinião do curso | Exibir rotas como SQL → persistência → Spring e testes → mudança segura |
| Senioridade podia parecer promessa de cargo | Expectativa profissional incorreta | Separar conteúdo estudado, autonomia, impacto e experiência real |
| Prática pedia apenas reflexão genérica | Difícil verificar conclusão | Exigir mapa pessoal com alvo, dependências e regra de estudo |
| Poderia invadir o diagnóstico da aula 002 | Repetição e ordem confusa | Nesta aula o aluno escolhe direção; na 002 mede o ponto de partida |

## Sequência nova

| Etapa | Ação do aluno | Evidência visível | Conceitos cobertos |
|---:|---|---|---|
| 1 | Diferenciar linguagem, backend, engenharia e arquitetura | Responsabilidades de uma ordem de serviço | intenção da formação e backend real |
| 2 | Selecionar um destino técnico e percorrer pré-requisitos | Rota e risco de pular | camadas e dependências |
| 3 | Explorar M0–M4 | Detalhe de cada módulo e evidência final | base operacional, Java, Core, métodos e OO |
| 4 | Explorar M5–M10 | Detalhe de cada módulo e evidência final | Java moderno, qualidade e design |
| 5 | Explorar M11–M14 | Detalhe de cada módulo e evidência final | ferramentas, testes, SQL, persistência e Spring |
| 6 | Explorar M15–M18 | Detalhe de cada módulo e evidência final | segurança, integração, entrega e produção |
| 7 | Explorar M19–M20 | Detalhe de cada módulo e evidência final | arquitetura, projeto e defesa |
| 8 | Trocar a lente de responsabilidade | Mesma tarefa revela novas perguntas | iniciante a arquiteto |
| 9 | Produzir o mapa pessoal | Arquivo com alvo, dependências e critérios | erros comuns, síntese e transição para diagnóstico |

## Recursos necessários

- [x] Conteúdo copiável com destaque de sintaxe.
- [ ] Terminal com comando e saída — não se aplica antes da preparação do ambiente.
- [x] Simulação de interface.
- [x] Diagrama.
- [x] Tabela comparativa.
- [x] Arquivo de exemplo.
- [x] Cenário de erro e recuperação.
- [x] Desafio final.

## Verificação de preservação

- [x] Todo conceito único do original possui destino explícito.
- [x] Não há comando técnico sem contexto — a aula não exige terminal.
- [x] Todo erro relevante possui diagnóstico e recuperação.
- [x] Exemplos consolidados continuam cobrindo todas as variações necessárias.
- [x] Conteúdo avançado foi redistribuído nos módulos atuais, não removido.
- [x] Repetições removidas não carregavam nuance exclusiva.
- [x] A transição da abertura e para o diagnóstico permanece coerente.

## Validação final

- [x] Build aprovado.
- [x] Lint sem novos erros.
- [x] `git diff --check` aprovado.
- [ ] Desktop verificado.
- [ ] Celular verificado.
- [ ] Interações verificadas.
- [ ] Etapas podem ser concluídas e desmarcadas.
- [ ] A aula e a próxima aula ficam bloqueadas enquanto houver etapas pendentes.
- [ ] Existe somente um controle de conclusão geral da aula.
- [ ] Conteúdo copiável e textos revisados.
- [x] Responsável pelo curso aprovou.
