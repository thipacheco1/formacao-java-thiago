# Matriz de cobertura — aula 018

## Identificação

- ID: `018_M0_18_DOCKER_DESKTOP_E_WSL2_PREPARACAO_OFICIAL`
- Arquivo original: `docs/aulas/018_M0_18_DOCKER_DESKTOP_E_WSL2_PREPARACAO_OFICIAL.md`
- Aula anterior: Postman, Insomnia e HTTP básico
- Aula seguinte: estrutura profissional do repositório de curso
- Arquétipo: laboratório visual de instalação, arquitetura e cadeia de provas do Docker Desktop com WSL2
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno conseguirá explicar a arquitetura Windows → WSL2 → Docker Engine, instalar ou atualizar o WSL com uma distribuição em versão 2, instalar e configurar o Docker Desktop, provar separadamente cliente e engine, executar e investigar `hello-world`, distinguir imagem de contêiner, interpretar porta, volume e variável de ambiente e diagnosticar falhas comuns sem apagar dados nem executar comandos destrutivos por tentativa.

## Inventário do conteúdo e destino

| Conteúdo único | Destino novo | Evidência |
|---|---|---|
| Virtualização, Windows, memória e WSL como pré-requisitos | Etapa 2 | Auditor visual com estado, prova e ação segura |
| WSL, distribuição Linux e WSL2 | Etapas 1 e 3 | Mapa de arquitetura e terminal com `wsl --version`, `--status` e `-l -v` |
| Instalação, atualização e conversão do WSL | Etapa 3 | Rotas guiadas para `wsl --install`, `wsl --update` e `wsl --set-version` |
| Reinício e criação de usuário Linux | Etapa 3 | Linha do tempo de instalação com senha oculta |
| Docker versus máquina virtual tradicional | Etapa 1 | Comparação de isolamento por processo e kernel |
| Docker Desktop, engine, CLI, GUI e integração WSL2 | Etapas 1, 4 e 5 | Camadas visuais e mocks identificados do instalador e Settings |
| Instalação por usuário versus todos os usuários | Etapa 4 | Decisão de instalação e privilégios |
| Licenciamento e política corporativa | Etapas 4 e 10 | Gate explícito antes do uso profissional |
| Docker Desktop não inicia automaticamente após instalar | Etapa 4 | Sequência instalar → abrir → aceitar termos → aguardar engine |
| Integração por distribuição | Etapa 5 | Mock Resources → WSL Integration e prova em dois terminais |
| Evitar Engine/CLI Linux concorrente dentro da distribuição | Etapa 5 | Alerta de conflito de instalação |
| Image, container, registry, pull e run | Etapas 6 e 7 | Modelo de estado e vocabulário visual |
| Imagem imutável em camadas | Etapa 7 | Diagrama de pacote e camadas |
| Contêiner como processo isolado em execução | Etapas 1 e 7 | Estado criado, executando e encerrado |
| Analogia classe/objeto com limite | Etapa 7 | Nota de mentoria sem tratar analogia como equivalência |
| Dockerfile e Compose | Etapa 9 | Reconhecimento e fronteira explícita para aulas futuras |
| `docker --version` prova somente o cliente | Etapa 6 | Terminal comentado |
| `docker version` prova cliente e servidor | Etapa 6 | Comparador interativo de evidências |
| `docker info` e `docker compose version` | Etapa 6 | Auditoria complementar e leitura de saída |
| Docker Desktop aberto e engine ativo | Etapas 4 e 6 | Estado visual e falha “cliente existe, servidor não responde” |
| `docker run hello-world` | Etapa 8 | Máquina de estados pull → create → start → output → exit |
| `docker ps`, `docker ps -a` e `docker images` | Etapa 8 | Terminal sincronizado com mock Containers/Images |
| Contêiner curto não aparece em `docker ps` | Etapa 8 | Comparação entre execução atual e histórico |
| Remoção somente do contêiner conhecido | Etapa 8 | Seleção nominal e `docker rm` sem limpeza global |
| Porta `host:container` | Etapa 9 | Simulador `5433:5432` com conflito local em 5432 |
| Volume e persistência fora do ciclo do contêiner | Etapa 9 | Diagrama de vida útil e alerta contra remoção cega |
| Variáveis com `-e` e segredos | Etapa 9 | Exemplo seguro com placeholder e bloqueio de segredo real |
| Postgres, Redis, RabbitMQ, Kafka, Mongo, serviços falsos, Java e observabilidade | Etapas 1 e 9 | Mapa de usos futuros sem antecipar prática |
| Aplicação corporativa e serviço containerizado | Etapa 9 | Fluxo Java → localhost → porta publicada → serviço |
| Docker Desktop: Containers, Images, Volumes e Settings | Etapas 5 e 8 | Mock didático navegável |
| Atalhos e ações de interface | Etapas 5 e 10 | Ações por finalidade, sem prometer atalho universal |
| `docs/ambiente.md`, `docs/docker-basico.md`, diário e atalhos | Etapa 11 | Editor/preview e entrega nominal |
| Git futuro para Dockerfile, Compose e `.env.example` | Etapa 11 | Separação entre exemplos versionáveis e `.env`, dados e logs locais |
| WSL ausente, WSL1 e virtualização desativada | Etapa 10 | Clínica de sintomas, inspeção, correção e nova prova |
| Docker Desktop fechado e integração ausente | Etapa 10 | Diagnóstico cliente versus engine/distribuição |
| Conflito de porta | Etapas 9 e 10 | Mapeamento alternativo sem desligar serviço ao acaso |
| Confusão imagem versus contêiner | Etapas 7 e 10 | Estado visual e comando correto para cada objeto |
| Remoção cega de volume | Etapas 9 e 10 | Alerta de perda de dados e proibição de limpeza global |
| Comandos desconhecidos e imagens não confiáveis | Etapa 10 | Gate de leitura, fonte e consequência |
| Docker não substitui entendimento do serviço | Etapas 9 e 10 | Diagnóstico continua exigindo porta, logs, credenciais e contrato |
| Montagens, `--privileged`, socket/daemon, TLS e exposição | Etapa 10 | Painel de segurança e menor privilégio |
| Registry interno, proxy, certificados e aprovações corporativas | Etapa 10 | Checklist de ambiente corporativo |
| Checklist, atividade e defesa oral | Etapa 11 | Cadeia de provas, documentação e Git limpo |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| Definições de imagem e contêiner espalhadas | Um modelo de estados reaplicado ao `hello-world` |
| Validação do WSL repetida após cada comando | Uma cadeia de provas com caminhos alternativos por estado |
| Docker aberto/engine ativo repetido em vários erros | Separação única entre cliente, canal e servidor, reutilizada na clínica |
| Portas explicadas conceitualmente e no erro 5432 | Um simulador conecta mapeamento, conflito e recuperação |
| Alertas de volume e segredo | Gates de segurança nos pontos de decisão e na clínica final |
| Listas de ferramentas futuras | Um mapa de usos deixa explícito o que será praticado depois |

## Defeitos corrigidos

| Defeito antigo | Correção |
|---|---|
| Aula extensa em formato de material técnico | Professor conduz instalação, provas e interpretação etapa por etapa |
| Comandos sem saída suficiente | Cada comando crítico possui saída esperada, significado e próximo diagnóstico |
| Instalação tratada como um único caminho | Rotas diferentes para WSL ausente, instalado, desatualizado e distribuição WSL1 |
| Requisitos atuais incompletos | Versão mínima do WSL, memória, virtualização e versões suportadas remetem à documentação oficial atual |
| Nenhuma decisão sobre escopo de instalação | Instalação por usuário e para todos os usuários são distinguidas |
| Integração WSL apresentada como requisito para todo terminal | Docker no terminal Windows é separado da integração dentro da distribuição |
| Risco de dois engines concorrentes | Instalação independente dentro da distribuição é identificada como conflito a evitar |
| `hello-world` sem estado visível | Linha do tempo mostra pull, criação, execução, saída e encerramento |
| Limpeza sugerida sem guarda forte | Somente objeto conhecido pode ser removido; `prune`, volumes e unregister ficam fora da prática |
| Porta descrita sem origem/destino | Interface mostra lado Windows, lado contêiner e colisão local |
| Variável de ambiente confundida com proteção | Placeholder não secreto e política de segredo explícita |
| Git apresentado com cerca Bash no Windows | Todos os comandos locais usam PowerShell e arquivos nominais |
| Licenciamento e ambiente corporativo genéricos | Gate atual, política, proxy, registry e certificado entram antes da adoção |

## Sequência nova

1. Construir o mapa Windows, WSL2, engine, imagem e contêiner.
2. Auditar pré-requisitos sem alterar BIOS às cegas.
3. Instalar, atualizar ou converter WSL e validar a distribuição.
4. Instalar e iniciar Docker Desktop com escopo e licença conscientes.
5. Configurar WSL2 e integração por distribuição em telas simuladas.
6. Separar CLI, canal e engine por comandos e saídas.
7. Dominar imagem, contêiner, registry, pull e estados.
8. Executar `hello-world` e investigar terminal e Docker Desktop.
9. Simular portas, volumes, variáveis e usos futuros.
10. Diagnosticar dez falhas e aplicar gates de segurança/corporação.
11. Documentar, revisar no Git, limpar somente o objeto conhecido e defender a instalação.

## Recursos

- [x] PowerShell e configurações com destaque de sintaxe.
- [x] Mapa visual da arquitetura Windows/WSL2/Docker.
- [x] Mock de virtualização e pré-requisitos.
- [x] Terminal WSL com rotas e saídas explicadas.
- [x] Instalador e Settings do Docker Desktop em simulação identificada.
- [x] Diagnóstico interativo cliente versus engine.
- [x] Máquina de estados do `hello-world`.
- [x] Docker Desktop com Containers e Images sincronizados.
- [x] Simulador de portas, volumes e variáveis.
- [x] Clínica de falhas, segurança e ambiente corporativo.
- [x] Documentação e entrega nominal no Git.

## Preservação

- [x] Todo conceito único possui destino.
- [x] Os cenários Windows, WSL2, Docker Desktop e backend corporativo permanecem.
- [x] Segurança, licenciamento e diagnóstico foram aprofundados.
- [x] Não há comando destrutivo global como prática.
- [x] A aula não antecipa Dockerfile, Compose profundo nem aplicação Java em contêiner.
- [x] A transição para a estrutura profissional do repositório permanece intacta.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [x] Responsável aprovou.

### Observação da auditoria

Requisitos e instalação foram confrontados com a documentação oficial atual do Docker Desktop para Windows, do backend WSL e do Microsoft WSL. Conceitos de imagem e contêiner foram confrontados com a documentação oficial do Docker. A aula preserva comandos compatíveis com PowerShell e mantém decisões de BIOS, licenciamento e políticas corporativas dependentes da fonte oficial e da organização.

Lint, dois builds consecutivos, JSON de estado, cronograma, verificação de whitespace no escopo e rota da Aula 018 foram aprovados. A sessão não possuía controlador de navegador conectado; por isso as verificações visuais de desktop/celular, as interações e os controles permanecem explicitamente pendentes, em vez de serem aprovados somente por leitura estática.
