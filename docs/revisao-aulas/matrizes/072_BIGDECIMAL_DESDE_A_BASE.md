# Matriz de cobertura — Aula 072

- Original: `072_M2_11_BIGDECIMAL_DESDE_A_BASE_OFICIAL.md`
- Componente: `GuidedBigDecimalLesson072.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de precisão decimal, construção, imutabilidade, operações, divisão, escala, comparação, fronteira monetária, rateio, domínios, clínica e entrega.

## Transformação

O aluno compara a aproximação binária com um decimal previsível, inspeciona quatro origens de `BigDecimal`, acompanha o objeto retornado pelas operações, testa divisões terminantes e não terminantes, confronta `equals` com `compareTo` e distribui centavos preservando o total.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| 0.1 + 0.2 com double | Precisão e Construção + programa | Saída 0.30000000000000004 comparada a 0.30 |
| Conceito, pacote e import | Precisão + programa | `java.math.BigDecimal` e objeto decimal preciso |
| double inadequado para dinheiro | Precisão + Clínica | Riscos financeiros e alternativa em centavos preservados |
| Construção com String | Precisão + programa | `new BigDecimal("0.1")` produz 0.1 |
| Construção perigosa com double | Precisão + programa | Cauda decimal completa observável |
| `valueOf(double)` | Precisão + programa | Alternativa segura para double inevitável |
| `valueOf(long, scale)` | Precisão | 1050 com scale 2 vira 10.50 |
| Imutabilidade | Operações Imutáveis + programa | Retorno ignorado conserva 10.00; capturado produz 15.00 |
| `add` | Operações + programa | 10.50 + 5.25 = 15.75 |
| `subtract` | Operações + programa | 100.00 − 15.50 = 84.50 |
| `multiply` | Operações + programa | 19.90 × 3 = 59.70 |
| `divide` exato | Operações | 10/2 = 5.00 |
| Divisão não exata | Divisão e RoundingMode | 10/3 sem regra exibe ArithmeticException |
| Divisão com escala | Divisão + programa | 10/3 com scale 2 resulta 3.33 |
| `scale` | Scale e Comparação + programa | 10, 10.0, 10.00 e 10.500 mapeados |
| `setScale` | Fronteira + programa | 10.567 vira 10.57 e retorna novo objeto |
| `RoundingMode` | Divisão | HALF_UP, HALF_EVEN, DOWN, UP, CEILING e FLOOR |
| Arredondamento por regra | Divisão + Clínica | Contrato/contabilidade/legislação antes do modo |
| `equals` | Scale + programa | 1.0 versus 1.00 produz false |
| `compareTo` | Scale + programa | Valor numérico equivalente produz zero |
| Comparações com ZERO | Scale + Fronteira | `compareTo(BigDecimal.ZERO)` para positivo e limites |
| Constantes ZERO, ONE, TEN | Scale e Comparação | Três constantes visíveis |
| Dinheiro com BigDecimal | Fronteira Monetária | Origem, formato, scale, arredondamento e domínio |
| Método `dinheiro` | Fronteira + programa | Null/blank, parse, scale 2 e mensagem centralizados |
| Validação positiva | Fronteira | Presença e compareTo tratados separadamente |
| Produto simples e validado | Dinheiro no Backend | Texto 199.905 vira preço positivo 199.91 |
| Pedido | Domínios + programa | subtotal − desconto + frete = 94.40 |
| Pagamento | Domínios + Rateio | Parcela 33.33 e diferença de um centavo explicitada |
| Rateio de centavos | Rateio + programa | 33.34, 33.33 e 33.33 preservam 100.00 |
| `movePointRight`, `longValueExact` | Rateio + código | Conversão controlada para centavos inteiros |
| Comissão | Domínios + programa | 1000.00 × 7.5% = 75.00 |
| Ordem de serviço | Domínios | Custo técnico + peça = 155.50 |
| Mensageria | Domínios + programa | 0.35 × 12 = 4.20 |
| Auditoria | Domínios + programa | 99.995 registrado como 100.00 |
| Centralização e classe utilitária | Fronteira Monetária | Método único de criação e validação |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Construtor, objeto retornado, divide e comparação |
| Atividade guiada | Entrega & Desafio | Programa completo, comandos e dezenove saídas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e higiene de entrega |
| Critérios de conclusão | Etapas + checklist | Conhecimentos convertidos em provas observáveis |
| Limites curriculares | Alertas e fechamento | MathContext, Locale, JPA, JSON e regras contábeis avançadas não são antecipados |

## Consolidação sem perda

Os arquivos repetitivos foram reorganizados em quatro origens de valor, quatro operações, seis modos de arredondamento, quatro scales comparáveis, uma fronteira monetária, um rateio manipulável, sete decisões de domínio, dez diagnósticos e um programa integrado. Boilerplate foi reduzido sem apagar diferenças de comportamento ou regra.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Quatro origens, seis modos, sete domínios e dez diagnósticos.
- Código completo com destaque, comandos, saída esperada, debug e desafio.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.
