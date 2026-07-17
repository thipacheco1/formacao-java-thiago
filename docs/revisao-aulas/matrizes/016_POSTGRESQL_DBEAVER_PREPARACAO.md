# Matriz de cobertura — aula 016

## Identificação

- ID: `016_M0_16_POSTGRESQL_E_DBEAVER_PREPARACAO_OFICIAL`
- Título antigo: PostgreSQL e DBeaver: Preparação
- Arquivo original: `docs/aulas/016_M0_16_POSTGRESQL_E_DBEAVER_PREPARACAO_OFICIAL.md`
- Posição: M0.16
- Aula anterior: Maven — instalação e validação
- Aula seguinte: Postman, Insomnia e HTTP básico
- Arquétipo: laboratório visual de servidor, serviço, cliente e conexão PostgreSQL
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno terá um servidor PostgreSQL local comprovadamente ativo, saberá distinguir servidor, serviço do Windows, banco, porta, usuário, cliente e driver, conectará com `psql` e DBeaver, criará o banco didático `curso_java`, executará uma consulta de identidade e recuperará falhas comuns sem expor senha.

## Inventário e destino

| Conteúdo antigo | Destino novo | Evidência |
|---|---|---|
| PostgreSQL como servidor relacional | Etapa 1 | Mapa cliente → driver → rede → servidor → banco |
| DBeaver como cliente gráfico | Etapas 1 e 6 | Fronteira visual entre programa e servidor |
| JDBC/driver | Etapas 1, 6 e 7 | Driver separado da conexão e do banco |
| Download oficial e escolha de versão | Etapa 2 | PostgreSQL 18 estável versus 19 beta; DBeaver Community |
| Instalador do PostgreSQL no Windows | Etapa 3 | Wizard simulado tela a tela |
| Pasta do programa e diretório de dados | Etapa 3 | Funções e riscos separados |
| Server, pgAdmin, Command Line Tools e StackBuilder | Etapa 3 | Componentes com decisão guiada |
| Usuário `postgres` e senha | Etapa 3 | Senha local forte, não exibida nem versionada |
| Porta 5432 | Etapas 1, 3, 4 e 7 | Porta como endereço do processo, não nome do banco |
| Locale | Etapa 3 | Escolha conservadora e efeito contextualizado |
| Serviço do Windows | Etapa 4 | `Get-Service` e estado Running |
| Processo escutando a porta | Etapa 4 | `Get-NetTCPConnection` e PID |
| `psql` | Etapa 5 | Conexão explícita com host, porta, usuário e banco |
| Versão, banco, usuário e porta atuais | Etapa 5 | Consulta única com saída interpretada |
| Criação do banco `curso_java` | Etapa 5 | `CREATE DATABASE` com confirmação e fronteira didática |
| Instalação do DBeaver Community | Etapa 6 | Instalador e primeiro início simulados |
| Download do driver PostgreSQL | Etapa 6 | Driver obtido somente quando necessário |
| New Database Connection | Etapa 7 | Wizard PostgreSQL com todos os campos |
| Host `localhost`, porta, database e usuário | Etapa 7 | URL JDBC derivada e teste de conexão |
| Database Navigator e SQL Editor | Etapa 8 | Interface sincronizada com consulta e grid |
| `SELECT 1` e consulta de identidade | Etapa 8 | Saída tabular e leitura de contexto |
| Serviço parado/connection refused | Etapa 9 | Inspeção, correção e confirmação |
| Senha incorreta | Etapa 9 | `password authentication failed` sem revelar senha |
| Banco inexistente | Etapa 9 | Diferenciar servidor alcançado de database ausente |
| Porta ocupada ou divergente | Etapa 9 | Provar listener e corrigir cliente/configuração |
| Driver ausente/proxy | Etapa 9 | Falha local da ferramenta separada do servidor |
| PATH sem `psql` | Etapa 9 | Caminho absoluto/entrada `bin`, sem confundir servidor |
| Firewall, host e rede | Etapa 9 | `localhost` versus servidor remoto |
| Documentação `docs/ambiente.md` | Etapa 10 | Registro sem credenciais |
| Diário, atalhos e Git | Etapa 10 | Arquivos nominais, diff staged e árvore limpa |
| Checklist e desafio | Conclusão | Diagnóstico de conexão por camadas |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| Host, porta, banco, usuário e senha repetidos em listas | Viram um único contrato de conexão usado por `psql`, JDBC e DBeaver |
| “Testar a conexão” em vários pontos | Cada teste prova uma camada distinta: serviço, socket, autenticação e SQL |
| Serviço parado, porta errada e senha errada | Clínica por camada evita tentativa aleatória |
| Recomendações para guardar senha | Um gate único: memória/gerenciador seguro; nunca código, documentação, print ou Git |

## Defeitos corrigidos

| Defeito antigo | Correção |
|---|---|
| Predomínio de texto sem mostrar as telas | Mocks identificados do instalador, Serviços, DBeaver, wizard e SQL Editor |
| Versões e opções suscetíveis a envelhecimento | Fonte oficial e aviso de temporalidade; PostgreSQL 19 beta não é sugerido como padrão |
| Instalação considerada concluída pelos cliques | Quatro provas independentes: serviço, listener, autenticação e consulta |
| DBeaver confundido com banco de dados | Arquitetura visual torna explícito que é cliente |
| Driver confundido com servidor | Camadas separadas e falhas próprias |
| Saídas de terminal insuficientes | Comando, saída variável, interpretação e recuperação |
| Senha aparece como valor a registrar | Campo mascarado e proibição explícita de versionamento |
| `SELECT 1` isolado ensina pouco | Consulta também prova versão, banco, usuário, endereço e porta |
| Criação de tabelas e SQL profundo poderia antecipar currículo | Apenas banco didático e consultas de validação |
| Falhas tratadas como reinstalação | Diagnóstico camada por camada antes de qualquer reinstalação |

## Nova sequência

1. Mapear servidor, serviço, banco, porta, cliente e driver.
2. Escolher versões estáveis e fontes oficiais.
3. Percorrer o instalador do PostgreSQL com decisões explicadas.
4. Provar serviço e porta no Windows.
5. Conectar com `psql`, criar `curso_java` e consultar a identidade.
6. Instalar e iniciar o DBeaver Community.
7. Configurar e testar a conexão PostgreSQL.
8. Usar Navigator e SQL Editor para uma consulta verificável.
9. Recuperar falhas por camadas.
10. Documentar o ambiente e entregar com Git.

## Recursos

- [x] Código SQL e PowerShell com destaque.
- [x] Terminais com saída e interpretação.
- [x] Simulações identificadas do instalador e do DBeaver.
- [x] Diagrama de arquitetura e fluxo de conexão.
- [x] Grade de resultado SQL.
- [x] Clínica de erros.
- [x] Documento de ambiente e desafio final.

## Preservação

- [x] Todo conceito único possui destino.
- [x] Repetições foram consolidadas sem perda de nuance.
- [x] Segurança de credenciais foi aprofundada.
- [x] A fronteira com SQL/JDBC posteriores foi preservada.
- [x] A próxima aula continua sendo preparação de ferramentas HTTP.

## Validação final

- [x] Build aprovado.
- [x] Lint aprovado.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [x] Responsável aprovou.

### Observação da validação

Lint, dois builds de produção consecutivos, JSON de estado, cronograma e rota da Aula 016 foram aprovados. Versão suportada, caráter beta do PostgreSQL 19, componentes do instalador Windows, arquitetura de serviço, `psql`, campos de conexão, porta padrão e driver PostgreSQL foram confrontados com as fontes oficiais atuais. Não havia navegador conectado à sessão; por isso desktop, celular, interações e controles continuam pendentes em vez de serem aprovados somente por inspeção de código e CSS.
