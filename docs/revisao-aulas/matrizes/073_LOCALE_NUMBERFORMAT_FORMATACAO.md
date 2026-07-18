# Matriz de cobertura — Aula 073

- Original: `073_M2_12_LOCALE_NUMBERFORMAT_E_FORMATACAO_OFICIAL.md`
- Componente: `GuidedLocaleNumberFormatLesson073.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de localidade, formatação, casas decimais, fronteiras, parsing controlado, mutabilidade, domínios, clínica e entrega.

## Transformação

O aluno apresenta o mesmo BigDecimal em três localidades, alterna moeda/número/percentual, controla casas, acompanha a fronteira valor→String, testa entradas brasileiras válidas e inválidas e observa a configuração persistir num `NumberFormat` mutável.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Cálculo versus apresentação | Showroom + Fronteira | BigDecimal permanece 1234.56; String muda por Locale |
| Conceito de Locale | Showroom | pt-BR, en-US e fr-FR com convenções regionais |
| Conceito de NumberFormat | Showroom + três formatadores | currency, number e percent |
| Moeda Brasil/EUA | Showroom + programa | R$ 1.234,56 e $1,234.56 |
| BigDecimal formatado | Showroom + programa | Objeto passado diretamente ao formatador |
| Número comum | Showroom + programa | Agrupamentos BR e US |
| Percentual | Casas decimais + programa | 0.075 vira 7,50% |
| Minimum/MaximumFractionDigits | Casas decimais | Controles e três valores comparáveis |
| Format não altera valor | Fronteira + programa | 10,567 exibido e 10.567 original |
| Locale padrão | Fronteira | Ambiente variável e Locale explícito |
| Vírgula versus ponto | Parsing | Gramática pt-BR antes da normalização |
| `NumberFormat.parse` e `Number` | Parsing + programa | 1.234,56 vira Number 1234.56 |
| Parse de moeda | Parsing | Símbolo reconhecido como categoria distinta |
| `ParseException` | Parsing + Clínica | Falha traduzida na fronteira |
| Texto brasileiro para BigDecimal | Parsing + programa | Validação, milhar removido, decimal trocado e scale 2 |
| BigDecimal para texto brasileiro | Fronteira + programa | Método local de moeda |
| Parse parcial/permissivo | Parsing + Clínica | 12abc e separadores inválidos são bloqueados |
| NumberFormat mutável | Mutabilidade e Escopo | Setter altera próximas formatações |
| Thread-safety | Mutabilidade e Escopo | Não compartilhar globalmente nesta fase |
| Produto | Domínios + programa | Cadeira custa R$ 199,90 |
| Pedido | Domínios + programa | Total calculado 94.40 e depois formatado |
| Pagamento | Domínios + programa | 3x de R$ 33,33 sem fingir rateio |
| Ordem de serviço | Domínios + programa | Custo R$ 155,50 |
| Mensageria | Domínios + programa | 12 × 0.35 exibido como R$ 4,20 |
| Auditoria | Domínios + programa | Tela arredonda 99.995 sem mudar original |
| Utilitário de formatação | Fronteira + programa | Criação local e null explícito |
| Separar format/converter/validar | Fronteira | Três responsabilidades independentes |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug | Entrega & Desafio | Valor, Locale, texto e parse em quatro paradas |
| Atividade e entrega Git | Entrega & Desafio | Programa, comandos, dezessete saídas e evidências |
| Limites curriculares | Alertas | DecimalFormat, Currency, datas, i18n ampla e concorrência avançada não antecipados |

## Consolidação sem perda

Os exemplos repetidos foram reorganizados em três localidades, três famílias de formato, controles de casas, uma fronteira de apresentação, seis entradas de parse, um laboratório de mutabilidade, seis domínios, dez diagnósticos e um programa integrado. As diferenças de símbolo, separadores, retorno e responsabilidade permanecem observáveis.

## Verificações

- Oito etapas, com Clínica e Entrega independentes.
- Três locales, seis domínios e dez diagnósticos.
- Código completo, saída, debug e desafio.
- Validador compila e executa o Java.
- Progresso filtrado, foco móvel, portão curricular e responsividade até 320 px.
