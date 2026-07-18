# Matriz de reconstrução — Aula 117 — Entidades

Fonte auditada: `docs/aulas/117_M4_13_ENTIDADES_OFICIAL.md`.

Uma entidade combina identidade, ciclo de vida e transição protegida; cada objeto de valor compõe seus dados, setters livres são evitados e métodos de domínio preservam o comportamento.

| Conteúdo preservado | Experiência guiada | Evidência |
| --- | --- | --- |
| Identidade e continuidade | Linha temporal de Cliente, Pedido, Email e Dinheiro | Explicar o que permanece |
| Entidade versus valor | Classificador com oito conceitos | Justificar por identidade ou conteúdo |
| Entidade anêmica | Comparador setters versus ações | Executar estado inválido e refatorar |
| Cliente entidade | Simulador de ativação, bloqueio e e-mail | Observar guardas e id estável |
| Mudança controlada | Comparador setter/método de domínio | Defender intenção e estado de origem |
| Pedido entidade | Máquina de estados interativa | Percorrer e tentar pular transições |
| Igualdade conceitual | Quatro cenários de dados e ids | Separar identidade, valor e referência |
| Ordem de Serviço | Ciclo com contador de reagendamentos | Bloquear mudanças após encerramento |
| Debug | Nove pausas da criação à exceção | Ver identidade estável e mutação válida |
| Erros comuns | Clínica com oito diagnósticos | Explicar sintoma e correção |
| Desafio Produto | Estoque, status, Dinheiro, testes e Git | Compilar seis fontes e passar oito testes |

Cobertura: objetos de valor `Email`, `Dinheiro`, `CodigoOs` e `Periodo` dentro de entidades; infraestrutura permanece fora. A aula usa `BigDecimal`, `LocalDate`, enums, métodos de domínio, validações e exceções.

Aceite: 11 etapas; progresso reversível; foco móvel; breakpoints 900/680/520/380/320; navegação 116/118 bloqueada; seis fontes compiladas; lint, build, validador e diff check. Inspeção visual e aprovação explícita permanecem pendentes.
