# Matriz de reconstrução — Aula 120 — toString com critério

Fonte auditada integralmente: `docs/aulas/120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL.md`.

A reconstrução preserva todo o conteúdo técnico e troca a leitura passiva por decisões observáveis: o aluno compara a saída padrão, percorre a chamada automática, separa intenções, simula vazamentos, limita o grafo de composição e entrega uma OS segura.

| Conteúdo preservado | Experiência guiada | Evidência |
| --- | --- | --- |
| `Object.toString` padrão | Cliente real alternando padrão e sobrescrito | `Classe@hashHex` interpretado sem prometer valor fixo |
| Chamada automática pelo `println` | Stepper `println` → `String.valueOf` → `toString` | Fluxo e console visíveis |
| Assinatura e `@Override` | Contrato `public String toString()` | Erros de nome, retorno, visibilidade e parâmetros evitados |
| Sobrescrita útil | Cliente com id, nome e e-mail normalizado | Código completo e saída esperada |
| `toString` versus `resumo()` | Seletor técnico, apresentação e regra | Públicos e responsabilidades separados |
| Regra de negócio fora do texto | Contraste com `pedido.aprovado()` | Nenhuma decisão depende de `contains` no texto |
| Objetos de valor | Email e Dinheiro visualmente normalizados | Textos diretos e legíveis |
| Dados sensíveis | Simulador de senha e CPF | Vazamento versus máscara observável |
| Entidade Pedido | Estado CRIADO/PAGO e duas representações | Identidade e estado principal sem relatório completo |
| Composição controlada | Grafo Pedido → Cliente → Pedidos | Cliente por id, Pagamento seguro e recursão demonstrada |
| Coleções | Lista de Produtos | Coleção delega `toString` aos elementos |
| `record` | Período com geração automática | Todos os componentes aparecem e exigem revisão |
| Geração pelo IntelliJ | Mock de Alt+Insert e seleção de campos | Ferramenta gera; aluno decide sigilo e tamanho |
| Formato consistente | Exemplos em uma linha `Classe{campo=valor}` | Legibilidade sem impor formato único |
| Debug recomendado | Dez pausas entre objeto e console | Campos incluídos, omitidos e mascarados inspecionados |
| Oito erros comuns | Clínica com sintoma e correção | Todos os casos da fonte preservados |
| Desafio Ordem de Serviço | Código, Cliente, telefone, Período, enums e resumo | Dez fontes compiladas e oito testes executados |
| Registro e Git | Checklist, defesa oral, README e terminal | Commit recomendado e evidências registradas |

Decisão pedagógica: `toString` é uma representação técnica mutável. Em objeto de valor pequeno, pode ser direto; documento e credencial exigem máscara ou omissão. Nos demais casos, deve ajudar debug e log sem vazar segredos, atravessar grafos sem limite ou assumir responsabilidades de domínio e apresentação.

Aceite técnico: 11 etapas; 8 casos de clínica; 10 pausas de debug; foco móvel; progresso persistido e normalizado; navegação 119/121 bloqueada; breakpoints 900/680/520/380/320; dez fontes Java compiladas em conjunto; oito testes; lint, build, validador e diff check. Inspeção visual e aprovação explícita permanecem pendentes.
