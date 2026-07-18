# Matriz de cobertura — Aula 070

- Original: `070_M2_09_CONVERSOES_E_CASTING_OFICIAL.md`
- Componente: `GuidedConversionsCastingLesson070.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de ampliação, redução, faixa, precisão, parsing, contratos de conversão, domínio, clínica e entrega.

## Transformação

O aluno percorre a escada dos tipos, observa a promoção de expressões, testa um `long` contra a faixa de `int`, enxerga onde cast e divisão descartam informação, opera uma bancada de parsing e transforma texto externo em estado validado por uma política explícita.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Pergunta central e critérios de conversão | Hero + toda a aula | Faixa, precisão, formato e regra permanecem como quatro fronteiras |
| Widening | Mapa de Ampliação | Escada byte, short, int, long, float e double |
| Conversão implícita | Mapa de Ampliação | int → long → double executado |
| Limites de ampliação | Mapa de Ampliação | Alerta sobre long gigantes em double e dinheiro em centavos |
| Narrowing e cast | Narrowing com Faixa | long → int comparado por fluxo cego e seguro |
| Cast explícito | Narrowing com Faixa | `(int) valor` visível no laboratório |
| Overflow | Narrowing + programa | 3.000.000.000 produz resultado corrompido no simulador e é bloqueado no programa |
| Conversão long para int segura | Narrowing + programa | MIN_VALUE/MAX_VALUE antes do cast |
| double para int | Truncamento e Divisão | Quatro decimais selecionáveis |
| Cast não arredonda | Truncamento + Clínica | Fração descartada em direção a zero e ponte para Math |
| char para int | Mapa + programa | `'A'` resulta em 65 |
| Promoção numérica | Mapa + Divisão | int × double e operando promovido antes da divisão |
| Divisão inteira | Truncamento e Divisão | `10 / 4` comparado a `(double) 10 / 4` |
| Texto para número | Bancada de Parsing | String atravessa normalização, parser e tipo de retorno |
| `parseInt` | Bancada + programa | Texto 123 vira int |
| `parseLong` | Bancada + programa | ID 3.000.000.000 vira long |
| `parseDouble` | Bancada + programa | Texto 10.75 vira double |
| `valueOf` | Bancada + programa | Retorno Integer diferenciado de primitivo |
| Ponto versus vírgula | Bancada | Alerta de formato e limite curricular de Locale |
| `NumberFormatException` | Bancada + Política + Clínica | Entradas inválidas exibem falha e tratamento na borda |
| Try/catch | Política + programa | Exceção técnica convertida em mensagem do campo |
| Parse seguro opcional | Política de Conversão | Contrato Integer/null explicitado |
| Valor padrão | Política de Conversão | Fallback permitido apenas com regra legítima |
| Campo obrigatório | Política + código | Null/blank e formato geram mensagens distintas |
| Pré-validação por dígitos | Política de Conversão | Política explicita aceitação e rejeição de sinais/decimais |
| `trim` | Bancada + Política + programa | Espaços externos removidos, internos preservados |
| Conversão versus regra de negócio | Pipeline + sete domínios | Normalizar → converter → validar |
| Quantidade positiva | Política + programa | Parse e regra em métodos distintos |
| Cliente | Conversão no Backend | idade inteira não negativa |
| Produto | Conversão no Backend | estoque não negativo e boolean estrito |
| Pedido | Conversão no Backend | ID e centavos em long |
| Pagamento | Conversão no Backend | valor/parcelas positivos antes da divisão |
| Ordem de serviço | Conversão no Backend | atividades não negativas e urgência estrita |
| Mensageria | Conversão no Backend | tentativas e tipo normalizado |
| Auditoria | Conversão no Backend | ID long, tentativa positiva e usuário normalizado |
| Boolean permissivo | Domínios + programa + Clínica | Texto abc é rejeitado em vez de virar false |
| Refatorar cast perigoso | Narrowing + programa | Método centralizado e protegido por faixa |
| Não usar cast para arredondar | Truncamento + Clínica | Comportamento separado da próxima aula de Math |
| Parse centralizado | Política + programa | Mensagens e normalização em um método reutilizável |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção pela causa |
| Debug recomendado | Entrega & Desafio | Quatro paradas: faixa, cast, parser e operandos |
| Atividade guiada | Entrega & Desafio | Programa completo, comandos e treze saídas determinísticas |
| Aplicações separadas do original | Domínios + desafio | Sete casos consolidados sem apagar regras únicas |
| README, diário, Git e `.class` | Entrega & Desafio | Evidências copiáveis e higiene descrita |
| Critérios de conclusão | Etapas + checklist | Conhecimentos e provas distribuídos pelo roteiro |
| Limites curriculares | Alertas e fechamento | BigDecimal, NumberFormat, Locale, datas e mappers não são antecipados |

## Consolidação sem perda

Os muitos arquivos repetitivos foram reorganizados em quatro visualizações centrais, quatro políticas, sete decisões de domínio, dez diagnósticos e um programa integrado. A repetição de boilerplate foi reduzida; os comportamentos, riscos, mensagens, regras e resultados distintos permanecem ensinados e observáveis.

## Verificações

- Oito etapas, com Clínica e Entrega independentes.
- Quatro fronteiras, sete domínios, dez diagnósticos e dez evidências interativas.
- Código completo com destaque, comandos, saída esperada, debug e desafio.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.
