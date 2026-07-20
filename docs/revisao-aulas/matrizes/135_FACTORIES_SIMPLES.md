# Matriz de cobertura — Aula 135 — Factories simples

## Fontes auditadas

- `docs/aulas/135_M4_31_FACTORIES_SIMPLES_OFICIAL.md`
- Aula anterior: serviço de domínio executa regra entre objetos; factory apenas cria.
- Fronteira seguinte: `136_M4_32_BUILDER_INICIAL_OFICIAL.md` cuida de muitos parâmetros opcionais e montagem passo a passo.

## Promessa pedagógica

O aluno deve reconhecer repetição e detalhes de construção, escolher entre construtor, static factory e factory class e provar que a factory simplifica o nascimento sem roubar comportamento nem invariantes da entidade.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Criação espalhada | Autópsia visual e código executável com status String, data e escala repetidos | Etapa 1 |
| Factory não é obrigatória | Balança interativa entre construtor, static factory, factory class e futuro Builder | Etapa 2 |
| `Dinheiro.de` e `zero` | Pipeline de normalização e workspace Java | Etapa 3 |
| `Pedido.novo` e `importado` | Comparador de intenções, construtor privado e valores padrão | Etapa 4 |
| `PedidoFactory` | Gerador sequencial visual, duas criações e alerta de concorrência | Etapa 5 |
| `OrdemServicoFactory` | Código padronizado, status inicial e contador protegidos | Etapa 6 |
| `ContratoFactory` | Composição Cliente + Serviço + Período, código e ativação na entidade | Etapa 7 |
| Factory versus domínio, aplicação e Builder | Roteador de responsabilidades e fronteira explícita da Aula 136 | Etapa 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas do App ao construtor privado | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, risco e correção | Etapa 10 |
| Desafio `PagamentoFactory` | Código sequencial, ciclo na entidade e suíte de testes | Etapa 11 |

## Decisões pedagógicas

1. A decisão começa em `new Cliente(...)` aceitável; factory só entra quando reduz conhecimento ou expressa uma forma de criação.
2. Static factory pertence à própria classe e nomeia variações como `novo`, `importado`, `agendada` e `rascunho`.
3. Factory class centraliza composição ou geração simples; não confirma, cancela, ativa ou persiste.
4. O contador em memória é acompanhado de um painel de riscos: reinício, concorrência e múltiplas instâncias.
5. Factory pode validar cedo, mas Pedido, OS, Contrato e Pagamento continuam validando suas invariantes.
6. Builder não é antecipado: a Aula 136 tratará opcionais e sequência de montagem.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 27 fontes Java compiladas em conjunto.
- 7 execuções reais; suíte final imprime `10 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, simuladores, diagramas e mock de IDE.
- Responsividade e foco automático da etapa no mobile.
- Integração `React.lazy` para `135_`.
- Lint, build, validador e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
