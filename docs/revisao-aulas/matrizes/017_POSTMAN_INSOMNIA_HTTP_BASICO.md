# Matriz de cobertura — aula 017

## Identificação

- ID: `017_M0_17_POSTMAN_INSOMNIA_E_HTTP_BASICO_OFICIAL`
- Arquivo original: `docs/aulas/017_M0_17_POSTMAN_INSOMNIA_E_HTTP_BASICO_OFICIAL.md`
- Aula anterior: PostgreSQL e DBeaver
- Aula seguinte: Docker Desktop e WSL2
- Arquétipo: laboratório visual de cliente HTTP com request, trânsito e response sincronizados
- Auditoria: 2026-07-17

## Resultado prometido

Ao final, o aluno conseguirá escolher Postman ou Insomnia, criar collection e environment local, decompor uma URL, montar requisições GET e POST, distinguir headers, path, query e body, interpretar respostas e status, separar falha de transporte de erro HTTP e documentar exemplos sem salvar segredo.

## Inventário do conteúdo e destino

| Conteúdo único | Destino novo | Evidência |
|---|---|---|
| HTTP como protocolo cliente-servidor | Etapa 1 | Fluxo request → servidor → response |
| Cliente e servidor são papéis | Etapa 1 | Postman/Insomnia versus API Java |
| URL: protocolo, host, porta e path | Etapa 2 | Decompositor interativo de URL |
| HTTP versus HTTPS/TLS | Etapa 2 | Ambiente local versus tráfego real |
| Endpoint: método + caminho + contrato | Etapas 1 e 3 | Mapa de endpoints por recurso |
| GET, POST, PUT, PATCH e DELETE | Etapa 3 | Laboratório de intenção, body e resposta típica |
| Request: método, URL, headers, parâmetros, body e autenticação | Etapas 1, 4 e 5 | Composer visual |
| Response: status, headers, body e tempo | Etapas 1, 4 e 5 | Painel de resposta sincronizado |
| Famílias 2xx, 3xx, 4xx e 5xx | Etapa 6 | Mapa de famílias sem tratar código como diagnóstico completo |
| 200, 201, 204, 400, 401, 403, 404, 409, 422 e 500 | Etapa 6 | Clínica de status com cenário e interpretação |
| Content-Type, Accept e Authorization | Etapa 4 | Editor de headers e consequência |
| Body e ausência típica em GET | Etapa 5 | Composer POST e comparação com GET |
| JSON: tipos, objeto, array e null | Etapa 5 | Editor com destaque, validação e erro de vírgula |
| Query parameter | Etapa 2 | Filtro/paginação após `?` |
| Path parameter | Etapa 2 | Identidade dentro do caminho |
| Collection | Etapa 7 | Árvore Ordem de Serviço criada por intenção |
| Environment e `base_url` | Etapa 7 | Resolução de variável e troca de alvo |
| Postman versus Insomnia | Etapa 8 | Comparador de interface e escolha orientada pelo time |
| Instalação da ferramenta | Etapa 8 | Fonte oficial, desktop/web/agent e validação inicial |
| GET público/conceitual e health local futuro | Etapa 4 | Simulador sem dependência de serviço externo |
| POST de cliente | Etapa 5 | Request/response completa com 201 |
| Erro de validação | Etapas 5 e 6 | JSON válido semanticamente inválido e 400/422 |
| Domínio de ordem de serviço | Etapas 3 e 7 | Collection corporativa preservada |
| Tokens e senhas | Etapa 7 | Variável local/segura, placeholder compartilhado e bloqueio de exportação |
| Atalhos de cliente e IntelliJ | Etapa 9 | Painel de ações por contexto, sem prometer atalho universal |
| Documentar uma request | Etapa 9 | Editor/preview de `docs/http-basico.md` |
| API parada e porta errada | Etapa 10 | Falha sem status HTTP e diagnóstico de transporte |
| Método errado/405 | Etapa 10 | Contrato de rota |
| Content-Type ausente | Etapa 10 | Servidor não interpreta o body |
| JSON inválido | Etapa 10 | Erro sintático antes da regra de negócio |
| Token ausente/401 e permissão/403 | Etapas 6 e 10 | Autenticação versus autorização |
| Recurso inexistente/404 | Etapa 10 | ID, path e rota como hipóteses distintas |
| Environment errado | Etapas 7 e 10 | Alvo resolvido exibido antes do envio |
| Segredo salvo em collection | Etapas 7 e 10 | Incidente, rotação e remoção segura |
| Checklist, atividade e Git | Etapa 11 | Collection conceitual, docs nominais e diff staged |

## Repetições consolidadas

| Repetição | Decisão |
|---|---|
| Método/URL/headers/body repetidos em vários exemplos | Um único composer muda de estado e reaplica o modelo a health, clientes e ordem de serviço |
| Definições de status separadas do diagnóstico | Mapa de famílias seguido de clínica por cenário |
| Alertas sobre token | Gate único em environment/exportação e incidente na clínica |
| `base_url` e environment | Resolver a URL final visivelmente antes de enviar |
| Collection como lista e como atividade | Uma árvore construída e depois entregue |

## Defeitos corrigidos

| Defeito antigo | Correção |
|---|---|
| Cerca de código sem abertura no início | Reconstrução sem reutilizar marcação quebrada |
| Texto longo sem interface | Simulação identificada de cliente HTTP com request e response operáveis |
| Request pública apenas hipotética | Simulador determinístico interno, sem rede externa nem resposta inventada como real |
| Instalação sem cliques ou diferenças atuais | Postman desktop/web/agent e Insomnia desktop explicados pelas fontes oficiais |
| Status code tratado como causa | Status passa a ser evidência inicial; body, headers, logs e contrato completam o diagnóstico |
| 401 chamado apenas de “não autenticado” sem nuance | Autenticação versus autorização permanece didática, com nota de que o contrato real governa |
| PUT descrito vagamente | Intenção típica de substituição completa, sem prometer comportamento universal |
| POST limitado a criação | Criação ou processamento conforme contrato; exemplos separados |
| Environment com token de exemplo na mesma lista | `base_url` compartilhável; segredo local/seguro e nunca exportado |
| `git add` em linguagem bash no Windows | PowerShell e preparação nominal de arquivos |
| Atalhos tratados como estáveis | Ações têm prioridade; atalhos aparecem como referência sujeita a versão |
| Nenhuma distinção visual entre erro de rede e HTTP | Timeline mostra “sem response” versus response 4xx/5xx |

## Sequência nova

1. Visualizar ciclo HTTP e papéis.
2. Decompor URL, path, query, protocolo e porta.
3. Escolher método pela intenção e pelo contrato.
4. Montar GET com headers e ler response.
5. Montar POST com JSON válido e inválido.
6. Interpretar famílias e dez status importantes.
7. Organizar collection, environment e segredos.
8. Escolher e instalar Postman ou Insomnia.
9. Documentar request e ações úteis.
10. Diagnosticar dez falhas sem tentativa aleatória.
11. Entregar collection conceitual, documentação e Git limpo.

## Recursos

- [x] Código HTTP, JSON, Markdown e PowerShell com destaque.
- [x] Simulador de request/response.
- [x] Decompositor de URL.
- [x] Mapa de métodos e status.
- [x] Interface de collection/environment.
- [x] Comparação Postman/Insomnia.
- [x] Clínica de falhas e desafio final.

## Preservação

- [x] Todo conceito único possui destino.
- [x] Os exemplos health, cliente e ordem de serviço permanecem.
- [x] Segurança e diagnóstico foram aprofundados.
- [x] A aula não antecipa implementação de API Java, REST profundo ou automação.
- [x] A transição para Docker/WSL2 permanece intacta.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [x] Responsável aprovou.

### Observação da validação

Lint, dois builds consecutivos, JSON de estado, cronograma e rota da Aula 017 foram aprovados. Semântica de cliente/servidor, métodos e status foi confrontada com o RFC 9110; instalação desktop/web/agent, environments, valores locais/compartilhados e segurança de variáveis foram confrontados com a documentação atual do Postman; instalação e collections do Insomnia foram confrontadas com a documentação oficial da Kong. Não havia navegador conectado à sessão, portanto desktop, celular, interações e controles permanecem pendentes em vez de serem aprovados por inspeção estática.
