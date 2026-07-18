# Matriz de cobertura — Aula 077 — Records

Fonte integral analisada: docs/aulas/077_M2_16_RECORDS_OFICIAL.md.

Implementação: GuidedRecordsLesson077.jsx e guidedRecordsLesson.css.

## Cobertura do conteúdo original

| Conteúdo exigido | Onde foi reconstruído | Evidência didática |
|---|---|---|
| Record versus classe e redução de boilerplate | Etapa 1 | Alternador visual e medidor de código |
| Componentes, campos finais, construtor, acessores, equals, hashCode e toString | Etapas 1 e 2 | Painel dos seis membros gerados e laboratório estrutural |
| Arquivo separado | Etapas 1 e 9 | Código PedidoResumo.java e atividade integrada |
| Acessor nome() versus getNome() e ausência de setter | Etapa 2 | Comparador de objetos e código destacado |
| Novo objeto para alteração | Etapa 2 | Simulação original/novo sem mutação |
| Construtor canônico | Etapa 3 | Explicação contrastada com atribuição manual |
| Construtor compacto, validação e normalização | Etapas 3 e 9 | Laboratório de quatro entradas e debug |
| Objects.requireNonNull | Etapas 3 e 9 | Contexto de null e programa compilável |
| BigDecimal, enum e Instant | Etapas 4, 7 e 9 | Composição navegável e PedidoResumo completo |
| Métodos, fábrica estática e interface | Etapas 4 e 9 | Catálogo de composição e implementação Identificavel |
| Limites: sem herança de classe, setter ou campo mutável extra | Etapas 4 e 6 | Leitura crítica e decisão DTO/entidade |
| Imutabilidade superficial | Etapa 5 | Diagrama de alias e mutação de array |
| DTO, request, response, evento e entidade | Etapa 6 | Laboratório de decisão com seis cenários |
| Record não é entidade automaticamente | Etapa 6 | Comparação pacote de dados versus ciclo de vida |
| Cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Etapa 7 | Galeria de sete domínios |
| Dez erros comuns | Etapa 8 | Clínica navegável com sintoma e correção |
| Debug do construtor compacto | Etapa 9 | Breakpoint, entrada, normalização e valor final |
| Atividade, comandos, evidências, desafio e Git | Etapa 9 | Programa, terminal, checklist e desafio |

## Decisões de reconstrução

- O boilerplate foi convertido em comparação visual sem tratar economia de linhas como único critério.
- Os métodos gerados foram demonstrados com valores reais e comparação estrutural.
- O construtor compacto recebeu entradas válidas, espaços, caixa e campos vazios.
- A imutabilidade superficial ganhou um diagrama interativo de duas referências para o mesmo array.
- A escolha record/classe virou um laboratório para DTO, evento, resultado e entidade.
- Código, terminal, clínica e navegação foram mantidos responsivos até 320 px.

Cobertura: 100%.

Pendente: inspeção visual do usuário e aprovação explícita.
