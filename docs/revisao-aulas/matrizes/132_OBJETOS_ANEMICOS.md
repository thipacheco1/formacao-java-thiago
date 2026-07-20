# Matriz de cobertura — Aula 132 — Objetos anêmicos

## Fontes auditadas

- `docs/aulas/132_M4_28_OBJETOS_ANEMICOS_OFICIAL.md`
- Aula anterior: Tell, Don't Ask.
- Fronteira seguinte: `133_M4_29_INVARIANTES_DE_DOMINIO_OFICIAL.md` formaliza invariantes; esta aula apenas as usa para fortalecer comportamento.

## Promessa pedagógica

O aluno deve identificar quando uma classe importante do domínio é apenas uma sacola de dados, distinguir esse problema de um DTO legitimamente simples e migrar setters genéricos e regras externas para métodos de domínio sem criar objetos artificialmente “ricos”.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Definição e sintomas de objeto anêmico | Scanner visual de atributos, getters/setters, verbos e regras externas | Etapa 1 |
| DTO pode ser simples | Classificador DTO, entidade, value object e projeção | Etapa 2 |
| Pedido anêmico e service gigante | Código executável e simulador de crescimento do service | Etapa 3 |
| Processo em cinco passos | Setter → intenção → verbo → regra interna → remoção da porta | Etapa 4 |
| Dinheiro e Pedido com comportamento | Workspace compilável, pagamento e cancelamento protegidos | Etapa 5 |
| Produto anêmico e rico | Comparação `setEstoque` versus reservar/repor | Etapa 6 |
| Contrato anêmico e rico | Comparação de ciclo por setters versus ativar/cancelar | Etapa 7 |
| OrdemServico anêmica e rica | String/setters versus enum, Período e reagendar atômico | Etapa 8 |
| Banco e frameworks | Critério explícito: tabela/serialização não definem o modelo inteiro | Etapas 2 e 4 |
| Debug recomendado | Mock de IDE com doze paradas entre estado externo e comportamento | Etapa 9 |
| Oito erros comuns | Clínica com rótulos, sintomas e correções completas | Etapa 10 |
| Desafio Pagamento | Entrega executável, ciclo protegido e oito testes | Etapa 11 |

## Decisões pedagógicas

1. “Rico” significa responsável, não grande: infraestrutura e coordenação externa não entram na entidade.
2. DTO, request, response e projeção podem ser simples porque transportam dados; não representam o ciclo de vida do domínio.
3. Um service não é automaticamente ruim; ele é suspeito quando apenas compensa entidades sem comportamento.
4. A migração começa pela intenção real escondida em cada setter, não pela remoção cega de todos os setters.
5. Objetos de valor como Dinheiro e PeriodoAtendimento retiram primitivos frágeis do núcleo.
6. A teoria formal de invariantes permanece para a Aula 133.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 22 fontes Java compiladas em conjunto.
- 10 execuções reais; suíte final imprime `8 testes passaram`.
- 8 casos na Clínica de Erros.
- Código destacado, saídas, comparadores, mock de IDE e evidências.
- Responsividade e foco automático da etapa no mobile.
- Integração `React.lazy` para `132_`.
- Lint, build e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
