# Matriz de cobertura — Aula 123 — sobrecarga de construtores

## Compromisso de reconstrução

A aula original de 1.901 linhas foi auditada integralmente, incluindo os trechos intermediários de Produto, Pedido, Dinheiro, OS e factory. Todos os conceitos únicos foram preservados. A reconstrução consolida repetições em um fluxo de decisão: resolver assinatura, acompanhar delegação, identificar padrões aplicados e provar que toda criação termina na mesma barreira de invariantes.

## Resultado pedagógico

O aluno consegue criar poucas formas legítimas de nascimento, prever qual construtor o compilador escolherá, usar `this(...)` corretamente, centralizar validações, avaliar cada valor padrão, reconhecer ambiguidade e escolher entre sobrecarga e factory nomeada. O objetivo não é aumentar o número de construtores, mas manter várias entradas e uma única definição de objeto válido.

## Cobertura fonte → experiência

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Definição e ideia central | Etapas 1 e 2 | Três chamadas selecionam três assinaturas e representam formas legítimas de nascimento |
| Assinatura: quantidade, tipos e ordem | Etapa 1 | Resolvedor interativo mostra a comparação feita pelo compilador |
| Nome do parâmetro não diferencia assinatura | Etapa 1 e erro deliberado | Dois construtores `(String, String)` precisam falhar mesmo trocando nomes |
| Por que usar sobrecarga | Etapa 2 | Produto mínimo, com estoque e completo são comparados pelos padrões aplicados |
| Perigo de duplicar validação | Etapa 3 | Painel antes/depois mostra duas regras divergentes versus uma barreira |
| `this(...)` e encadeamento | Etapa 4 | Três entradas convergem visualmente para o construtor principal |
| `this(...)` como primeira instrução | Etapa 5 | Alternância entre código válido e falha real `call to this must be first statement` |
| Sobrecarga simples de Cliente | Etapa 1 e `AssinaturasConstrutor123.java` | Nome, nome/e-mail e id/nome são executados |
| Construtor principal | Etapas 3 e 4 | Somente a assinatura completa valida e atribui todos os campos |
| Produto com 3, 4 e 5 parâmetros | Etapas 2 e 4 | Estoque 0 e status ATIVO são aplicados durante a delegação |
| Valores padrão precisam fazer sentido | Etapa 6 | Pedido CRIADO, estoque zero e e-mail fictício são classificados |
| Pedido com status padrão | Etapa 6 e `PadraoDominio123.java` | Criação normal nasce CRIADO; estado informado passa pelo principal |
| Sobrecarga em entidades | Etapas 6 e 8 | Criação normal é separada de reconstituição de estado persistido |
| Sobrecarga em objeto de valor | Etapa 7 | Dinheiro recebe String, BigDecimal e int e converge para BigDecimal |
| Método auxiliar `static` com `this(...)` | Etapas 5 e 7 | `converterTexto` prepara argumento sem violar a primeira instrução |
| Sobrecarga versus static factory | Etapa 8 | Construtor posicional é comparado com `novo` e `reconstituido` |
| Sobrecarga confusa | Etapas 1, 8 e clínica | Assinaturas iguais, parâmetros homogêneos e labirinto são diagnosticados |
| Ambiguidade com `null` | Etapa 8 | `Notificacao(String)` e `Notificacao(Email)` disputam `null` e não compilam |
| OS com construtores de conveniência | Etapa 9 | Tipos prontos e dados simples convergem para a mesma OS |
| Código e Período criados no atalho | Etapa 9 | Fluxo visual mostra String/LocalDate/Turno virando tipos do domínio |
| Construtor privado e factory | Etapa 8 e entrega | Pedido e Contrato escondem criação completa e nomeiam reconstituição |
| Quando factory é melhor | Etapas 8 e 11 | Significados distintos ganham nomes, não apenas posições diferentes |
| Regras práticas de uso e recusa | Etapas 2, 6, 8 e 10 | Poucos caminhos, tipos claros, padrões seguros e ausência de ambiguidade |
| Seis partes da atividade guiada | Etapas 1 a 9 | Cliente, Produto, Pedido, Dinheiro, OS e factory viram experiências executáveis |
| Desafio Contrato | Etapa 11 | Período pronto, datas separadas e factory reconstituída com valor total |
| Cliente ativo, serviço positivo e período válido | Etapa 11 | Oito testes exercitam cenários válidos e inválidos |
| Oito erros comuns, incluindo sobrecarga versus sobrescrita | Etapa 10 | Clínica navegável apresenta sintoma e recuperação |
| Debug recomendado | Etapa 10 | Seis frames exibem assinatura, padrões, delegação, validação e atribuição |
| Registro, conclusão e commit | Etapa 11 | Checklist, defesa oral, README, terminal e commit sugerido |

## Roteiro reconstruído

1. Resolver assinaturas — quantidade, tipo, ordem e nomes ignorados.
2. Por que sobrecarregar — formas legítimas de nascimento.
3. Eliminar duplicação — uma barreira de invariantes.
4. `this(...)` e principal — encadeamento visível.
5. Primeira instrução — erro real e função auxiliar.
6. Padrões de domínio — seguro, legítimo ou enganoso.
7. Objeto de valor — String, BigDecimal e int.
8. Factory e ambiguidade — intenção nomeada e disputa por `null`.
9. OS de conveniência — tipos prontos ou dados simples.
10. Debug e clínica — seis frames e oito diagnósticos.
11. Entrega e Contrato — três criações, factory e oito testes.

## Recursos visuais e práticos

- Resolvedor interativo de assinaturas.
- Comparador de três formas de nascimento de Produto.
- Diagrama antes/depois de validações duplicadas.
- Pipeline animável de delegação até o construtor principal.
- Terminal para a regra da primeira instrução.
- Classificador de padrões do domínio.
- Conversor de entradas do objeto Dinheiro.
- Comparador construtor/factory e simulador de ambiguidade com `null`.
- Fluxo da OS com tipos prontos e construtor de conveniência.
- Debugger simulado e clínica com nomes responsivos.
- Código destacado, arquivo identificado, cópia e saída esperada.

## Verificação técnica

O validador compila oito fontes Java válidas em conjunto, executa todos os programas, confirma o Contrato e os oito testes. Três fontes inválidas são compiladas separadamente e precisam falhar: assinatura duplicada, `this(...)` fora da primeira instrução e ambiguidade com `null`. Também são verificados onze estágios, oito diagnósticos, integração lazy, progresso normalizado e breakpoints responsivos.

## Estado editorial

- Implementação: concluída.
- Validação automatizada: obrigatória antes da entrega.
- Aprovação visual explícita: pendente; status `em_revisao`.
