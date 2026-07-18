# Matriz de reconstrução — Aula 116 — Objetos de valor

## Fonte auditada

- `docs/aulas/116_M4_12_OBJETOS_DE_VALOR_OFICIAL.md`
- Um objeto de valor é definido pelo conteúdo; uma entidade mantém identidade e continuidade.
- Preservados: valor versus entidade, dados soltos, Email, Dinheiro, Telefone, Período, imutabilidade, composição no Pedido, `record`, critério de extração, infraestrutura fora do valor, debug, oito erros, desafio de OS, testes e Git.
- A prática encapsula `BigDecimal` em Dinheiro, `LocalDate` em Período e usa `record` com construtor compacto validado.
- O desafio final aplica os valores em uma Ordem de Serviço completa.

## Roteiro transformado

| Intenção | Experiência | Evidência |
| --- | --- | --- |
| Distinguir valor e entidade | Comparador por conteúdo e identidade | Justificar Email/Dinheiro versus Cliente/Pedido |
| Expor tipos genéricos | Programa que aceita e-mail e total inválidos | Explicar por que compilação não garante domínio válido |
| Criar Email | Entrada interativa com pipeline de normalização | Testar arroba, domínio e corporativo |
| Criar Dinheiro | Operações de preço, frete e desconto | Provar que o original não muda |
| Criar Telefone | Validador de DDD e número | Observar formato e falhas de dígitos |
| Criar Período | Linha temporal com duração inclusiva | Testar ordem e contenção de data |
| Compor no Pedido | Árvore tipada e subtotal interativo | Seguir Pedido → Item → Produto → Dinheiro |
| Usar critério e record | Classificador de seis candidatos | Evitar embrulho sem regra e excesso de tipos |
| Depurar valores | Nove pausas de criação e novas referências | Ver normalização, escala e imutabilidade |
| Corrigir desvios | Clínica com oito casos | Defender sintoma e correção |
| Entregar desafio | OS com quatro valores e oito testes | Compilar cinco fontes e registrar Git |

## Critérios técnicos

- 11 etapas, conclusão reversível e próximo passo bloqueado.
- Cinco fontes Java compiladas em conjunto e cinco executáveis verificados.
- CSS responsivo em 900, 680, 520, 380 e 320 px; clínica com seletor numérico restrito.
- Foco móvel na etapa ativa e reposicionamento no início do roteiro.
- Navegação 115/117 vinculada à conclusão real.
- Inspeção visual e aprovação explícita permanecem pendentes.
