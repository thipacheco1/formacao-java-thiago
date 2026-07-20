# Matriz de cobertura — Aula 122 — final em classes, métodos e atributos

## Compromisso de reconstrução

A aula original de 1.588 linhas foi lida integralmente. Todo conteúdo único foi preservado: os cinco contextos de `final`, a diferença para `static`, erros de inicialização e reatribuição, identidade de entidade, referência de objeto, imutabilidade profunda, objetos de valor, método e classe final, constantes, exageros, atividades, debug, desafio e oito erros. Repetições explicativas foram transformadas em comparações, simulações e código verificável.

## Resultado pedagógico

O aluno deixa de resumir `final` como “não muda” e passa a nomear a restrição exata: reatribuição de variável, reatribuição de parâmetro ou campo, sobrescrita de método ou herança de classe. Também consegue separar referência fixa de objeto imutável e decidir quais partes de uma entidade devem permanecer estáveis sem impedir seu ciclo de vida.

## Cobertura fonte → experiência

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Objetivo e ideia central | Etapa 1, mapa dos cinco contextos | Cada posição mostra sintaxe, efeito e tipo de mudança bloqueada |
| Variável local `final` | Etapa 3 | Programa válido e compilação deliberadamente inválida por reatribuição |
| Parâmetro `final` | Etapa 3 | O parâmetro não pode apontar para outro valor, mas o objeto recebido não é congelado |
| Atributo `final` | Etapa 4 | `CodigoPedido122.valor` nasce validado e recebe uma única atribuição |
| Método `final` | Etapa 8 | `codigo()` fica protegido, enquanto `resumo()` continua como ponto de extensão |
| Classe `final` | Etapas 8 e 9 | Herança inválida de `DinheiroFechado122` e valores Email/Dinheiro fechados |
| `final` não é `static` | Etapa 2 | Painel separa “quem possui?” de “qual mudança é proibida?” |
| `static final` para constantes | Etapas 2 e 9 | `PREFIXO` combina dono da classe, referência fixa e `String` imutável |
| Valor de variável local não pode ser reatribuído | Etapa 3 | Saída válida e mensagens reais esperadas de `javac` |
| Uso criterioso em locais e parâmetros | Etapas 3 e 10 | A clínica rejeita aplicação automática e destaca padrões de equipe e legibilidade |
| Campo final precisa ser inicializado | Etapa 4 | Grafo de caminhos mostra declaração, construtor e ramo que termina sem valor |
| Inicialização em todos os construtores/caminhos | Etapa 4 | `FinalSemInicializar122` deve falhar na compilação |
| Entidade com identidade estável e estado mutável | Etapa 5 | Produto mantém código/nome e permite vender e inativar por métodos |
| Referência final de objeto | Etapa 6 | Diagrama Stack → Heap mantém a seta em `#A1` e altera o saldo interno |
| `final` não garante imutabilidade profunda | Etapas 6 e 7 | O aluno aplica cinco camadas e vê a diferença entre lista original e cópia defensiva |
| Requisitos de objeto realmente imutável | Etapa 7 | Classe final, campos privados finais, sem setters, cópia defensiva e novos objetos |
| Objeto de valor Email | Etapa 9 | Normalização, igualdade por valor, classe e atributo finais |
| Motivo para classe de valor ser final | Etapas 8 e 9 | Previsibilidade de validação, igualdade e representação |
| Método final e limites da sobrescrita | Etapa 8 | Subclasse altera `resumo`, mas não `codigo` |
| Classe final e limites da herança | Etapa 8 | Exemplo inválido é compilado separadamente e precisa falhar |
| Dinheiro imutável | Etapa 9 | Factory, `BigDecimal`, soma que retorna novo valor e saída R$ 219.90 |
| Constante de código OS | Etapa 9 e entrega | `private static final PREFIXO` participa da invariante |
| Quando `final` ajuda ou atrapalha | Etapas 1, 8 e 10 | Critério de contrato versus fechamento automático e ruído visual |
| Bons candidatos: valores, identidade, dependências, constantes | Etapas 5, 7, 9 e 11 | Cada candidato aparece aplicado em um modelo executável |
| Quando evitar aplicação automática | Etapas 8 e 10 | Extensão planejada, estado de ciclo e modelagem confusa são diagnosticados |
| Seis partes da atividade guiada | Etapas 3 a 9 | Todas se tornam experiências observáveis com entradas, estado e saída |
| Desafio FinalOrdemServico | Etapa 11 | Código, período, OS, enums, reagendamento, conclusão, cancelamento e erro esperado |
| Oito erros comuns | Etapa 10 | Clínica mostra sintoma e correção sem rótulos truncados |
| Debug recomendado | Etapa 10 | Seis pausas distinguem atribuição, mutação, referência, novo objeto e constante |
| Registro, conclusão e commit | Etapa 11 | Checklist, defesa oral, README copiável, terminal e commit sugerido |

## Roteiro reconstruído

1. Cinco contextos — efeito exato em local, parâmetro, atributo, método e classe.
2. `final ≠ static` — propriedade versus restrição.
3. Local e parâmetro — reatribuições e erros reais do compilador.
4. Atributo e construção — inicialização em todos os caminhos.
5. Identidade e ciclo — entidade estável sem ficar paralisada.
6. Referência e objeto — seta fixa e interior mutável.
7. Imutabilidade profunda — cinco camadas e cópia defensiva.
8. Método e classe — pontos de extensão protegidos com critério.
9. Valores e constante — Email, Dinheiro e prefixo da OS.
10. Debug e clínica — seis pausas e oito diagnósticos.
11. Entrega e OS — ciclo completo, erro esperado e oito testes.

## Recursos visuais e práticos

- Mapa interativo dos cinco significados contextuais de `final`.
- Comparador `static`, `final` e `static final`.
- Terminal válido/inválido para variável e parâmetro.
- Diagrama de fluxo para inicialização de atributo em todos os caminhos.
- Painel de entidade com identidade estável e ciclo mutável.
- Diagrama Stack/Heap para referência final.
- Construtor visual de imutabilidade profunda em cinco camadas.
- Árvore de herança aberta, parcialmente protegida ou bloqueada.
- Galeria de Email, Dinheiro e constante.
- Debugger simulado e clínica navegável.
- Código com destaque de sintaxe, nome de arquivo, cópia e saídas esperadas.

## Verificação técnica

O validador compila dez fontes Java válidas em conjunto, executa seus cenários, confirma a OS e oito testes. Três exemplos deliberadamente inválidos são compilados separadamente e precisam falhar: reatribuição de variável/parâmetro final, atributo sem inicialização em todos os caminhos e herança de classe final. A estrutura também verifica onze etapas, oito diagnósticos, integração lazy, persistência normalizada e breakpoints responsivos.

## Estado editorial

- Implementação: concluída.
- Validação automatizada: obrigatória antes da entrega.
- Aprovação visual explícita: pendente; status `em_revisao`.
