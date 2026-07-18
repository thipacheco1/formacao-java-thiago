# Matriz de cobertura — Aula 071

- Original: `071_M2_10_MATH_RANDOM_E_NUMEROS_UTILITARIOS_OFICIAL.md`
- Componente: `GuidedMathRandomLesson071.jsx`
- Cobertura: 100%
- Arquétipo: oficina interativa de arredondamento, paginação, utilitários matemáticos, faixas pseudoaleatórias, seed, limites, métodos Exact, domínios, clínica e entrega.

## Transformação

O aluno observa o mesmo decimal atravessando cast, round, floor e ceil; distribui itens em páginas; explora seis utilitários de Math; constrói faixas inclusivas; compara seeds; separa teste de segurança; provoca overflow e fecha com um laboratório Java determinístico.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Classe `Math` e métodos estáticos | Mesa + caixa de ferramentas | Uso direto sem `new Math` |
| Classe `Random` | Faixas com Random | Instância recebida pelo gerador |
| Math.random versus Random | Faixas + Seed | Contratos e clareza comparados |
| Pseudoaleatório | Seed, Teste e Segurança | Algoritmo, reprodução e finalidade |
| Vocabulário essencial | Toda a aula | Termos aplicados em controles e diagnósticos |
| Primeiro exemplo | Mesa de Arredondamento | 10.75 com cast, round, floor e ceil |
| `Math.round` | Mesa + programa | Mais próximo; retorno long para double |
| `Math.floor` | Mesa + programa | Inteiro inferior em double |
| `Math.ceil` | Mesa + programa | Inteiro superior em double |
| Paginação com ceil | Paginação sem Perda | Itens distribuídos visualmente em páginas |
| Paginação inteira | Paginação sem Perda | `(total + tamanho - 1) / tamanho` comparado |
| `Math.abs` | Caixa de Ferramentas | Magnitude e alerta contra esconder entrada |
| `Math.max` e `Math.min` | Caixa de Ferramentas | Extremos visíveis |
| Limitar em faixa | Caixa + programa | clamp de 120 para 100 |
| `Math.pow` | Caixa + programa | Potência 2³ e retorno double |
| `Math.sqrt` | Caixa + programa | Raiz de 25 |
| `Math.random` | Faixas + Seed | Intervalo 0.0 inclusivo a 1.0 exclusivo |
| Inteiro com Math.random | Faixas | Multiplicação, cast e preferência didática por Random |
| `Random.nextInt` | Faixas com Random | bound exclusivo explicado |
| Random de 1 a 10 | Faixas + programa | Deslocamento por mínimo |
| Método de faixa inclusiva | Faixas + programa | `max - min + 1`, validações e deslocamento |
| Seed | Seed, Teste e Segurança | Duas sequências idênticas e uma diferente |
| Random em testes | Seed + Domínios | Exploratório versus automatizado reproduzível |
| Sorteio de status | Desafio | Item de array com índice sorteado |
| Sorteio em array | Desafio | Array de status como requisito verificável |
| Limites numéricos | Limites e Exact | MIN/MAX de int e nota sobre Double.MIN_VALUE |
| Overflow | Limites + programa | MAX_VALUE + 1 vira MIN_VALUE |
| `Math.addExact` | Limites + programa | ArithmeticException observável |
| Outros métodos Exact | Grade de métodos | soma, subtração, multiplicação, incremento e decremento |
| `Math.toIntExact` | Limites + programa | long fora da faixa bloqueado |
| Cliente | Math no Backend | abs com leitura crítica |
| Produto | Math no Backend | desconto limitado por min/max |
| Pedido | Math no Backend | código e centavos para massa de teste |
| Pagamento | Math no Backend | arredondamento didático e ponte para BigDecimal |
| Ordem de serviço | Math no Backend | paginação por ceil |
| Mensageria | Math no Backend | tentativas em faixa inclusiva |
| Auditoria | Math no Backend | seed fixa para reprodução |
| Centralizar geração | Faixas + desafio | Um gerador validado e Random por parâmetro |
| Escolher arredondamento | Mesa + Clínica | Método selecionado pela regra |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug | Entrega & Desafio | Quatro pontos: arredondar, bound, seed e Exact |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo e catorze linhas determinísticas |
| README, diário, Git e `.class` | Entrega & Desafio | Evidências copiáveis e desafio versionável |
| Limites curriculares | Toda a aula | Não antecipa BigDecimal, SecureRandom, estatística, benchmark ou criptografia |

## Consolidação sem perda

Os exemplos repetitivos foram consolidados em nove etapas conectadas: uma mesa de arredondamento, um paginador visual, seis ferramentas Math, uma faixa manipulável, quatro contratos de aleatoriedade, seis métodos Exact, sete domínios, dez diagnósticos e um programa integrado. Todo comportamento exclusivo permanece ensinável e verificável.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Seis utilitários, sete domínios e dez diagnósticos.
- Programa completo com destaque, comandos e saída esperada.
- Validador específico compila e executa Java real.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.
