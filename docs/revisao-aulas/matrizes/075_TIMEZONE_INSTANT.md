# Matriz de cobertura — Aula 075

- Original: `075_M2_14_TIMEZONE_E_INSTANT_OFICIAL.md`
- Componente: `GuidedTimezoneInstantLesson075.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de instante global, região, offset, conversão, contratos temporais, armazenamento UTC, Duration, Clock, domínios, clínica e entrega.

## Transformação

O aluno fixa um evento na linha do tempo, observa quatro relógios regionais, separa ZoneId de ZoneOffset, experimenta a diferença entre atribuir zona e converter a visão, escolhe o tipo temporal conforme o contrato, localiza apenas a apresentação e controla expiração com Clock fixo.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Pergunta “10:00 onde?” | Instante Global | Entrada local ambígua confrontada com um Instant |
| Limite de LocalDateTime | Instante + Atribuir ou Converter | Tipo sem região nem ponto global |
| UTC e sufixo Z | Instante Global | Linha do tempo ancorada em 17:30Z |
| `Instant` | Instante, armazenamento e programa | Evento global fixo, comparável e ordenável |
| `Instant.now` | Duration e Clock | Produção com Clock.systemUTC e teste com Clock.fixed |
| `Instant.parse` | Instante + programa | Timestamp determinístico |
| `ZoneId` | Região e Offset | Região selecionável e regras históricas |
| `ZoneOffset` | Região e Offset | Diferença fixa sem identidade regional |
| Vocabulário essencial | Toda a aula | Tipos e operações usados em contexto |
| Primeiro exemplo mínimo | Entrega | Instant e UTC demonstrados em programa completo |
| Instant em São Paulo | Instante Global | `atZone(America/Sao_Paulo)` |
| Múltiplos fusos | Instante Global | São Paulo, Nova York, UTC e Tóquio |
| `ZonedDateTime` | Tipos na API | Região, offset e hora local unidos |
| `LocalDateTime.atZone` | Atribuir ou Converter | Hora de parede recebe contexto regional |
| Atribuir não é converter | Atribuir ou Converter | Fluxos alternáveis com explicação visual |
| `withZoneSameInstant` | Atribuir ou Converter | SP e NY preservam o mesmo 17:30Z |
| `toInstant` | Conversão + programa | Agenda regional volta ao evento global |
| `OffsetDateTime` | Tipos na API + programa | Payload explícito em −03:00 |
| Offset em APIs | Tipos na API | Instant, ZonedDateTime, OffsetDateTime e LocalDateTime comparados |
| Formatação com zona | UTC e Apresentação | DateTimeFormatter.withZone |
| Armazenamento recomendado | UTC e Apresentação | Instant no backend e ZoneId somente na saída |
| Auditoria com Instant | UTC e Apresentação | Registro global com múltiplas apresentações |
| Auditoria no fuso local | UTC e Apresentação | São Paulo, Londres e UTC selecionáveis |
| `Duration.between` | Duration e Clock + programa | 150 minutos entre eventos |
| Validação de expiração | Duration e Clock | Regra visual em limite exato e após a validade |
| `Clock.systemUTC` | Duration e Clock | Relógio explícito de produção |
| `Clock.fixed` | Duration e Clock + programa | Agora reproduzível em dois cenários |
| Cliente | Timezone no Backend | Último acesso armazenado como Instant |
| Produto | Timezone no Backend | criadoEm e atualizadoEm globais |
| Pedido | Timezone no Backend | Criação UTC ordenável entre serviços |
| Pagamento | Timezone no Backend | Instant + Duration + Clock para expiração |
| Ordem de serviço | Timezone no Backend + desafio | Hora local e ZoneId viram Instant |
| Mensageria | Timezone no Backend | Janela local calculada a partir de Instant |
| Auditoria | Timezone no Backend | Um evento e várias apresentações |
| Refatorar LocalDateTime | Armazenamento + Clínica | Auditoria global usa Instant |
| Refatorar `Instant.now` | Duration e Clock | Relógio recebido em vez de espalhado |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug | Entrega & Desafio | Quatro evidências: Instant, ZoneId, atZone e Clock |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo e treze linhas determinísticas |
| README, diário, Git e `.class` | Entrega & Desafio | Evidências copiáveis e desafio versionável |
| Limites curriculares | Toda a aula | Não antecipa banco, JSON avançado, Spring timezone, calendários ou cron |

## Consolidação sem perda

Os exemplos repetitivos foram reunidos em nove etapas conectadas: linha do tempo com quatro regiões, comparador região/offset, laboratório de atribuição/conversão, quatro contratos temporais, pipeline armazenamento/exibição, relógio controlável, sete domínios, dez diagnósticos e um programa integrado. Todo comportamento único permanece observável.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Quatro tipos temporais, sete domínios e dez diagnósticos.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa Java real.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica mantém número e título em seletores separados.
