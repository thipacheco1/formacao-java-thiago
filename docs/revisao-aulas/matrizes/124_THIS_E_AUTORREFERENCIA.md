# Matriz de cobertura — Aula 124 — this e autorreferência

## Compromisso de reconstrução

A aula original de 2.002 linhas foi lida integralmente. Foram preservados o objeto atual, sombreamento, usos obrigatório e opcional, construtores, chamadas internas, fronteira `static`, retorno de `this`, fluent interface, valor imutável, `equals`, leitura profissional, entidade, passagem do próprio objeto, acoplamento, `null`, escape durante construção, atividades, desafio, debug e oito erros. A nova forma remove repetição sem remover nuance.

## Resultado pedagógico

O aluno passa a enxergar `this` como uma referência concreta para a instância que está executando. Ele consegue dizer qual objeto a palavra representa em cada frame, quando é obrigatória, quando é apenas estilo, quando o próprio objeto é devolvido ou entregue a uma colaboração e quando um novo objeto é criado.

## Cobertura fonte → experiência

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Ideia central: “este objeto aqui” | Etapa 1 | Diagrama alterna `this` entre Cliente `#A1` e `#B2` |
| `this` existe por causa do objeto atual | Etapa 1 | Variável externa, referência, frame e objeto no Heap são conectados |
| Diferenciar atributo e parâmetro | Etapa 2 | Simulador contrasta `nome = nome` e `this.nome = nome` |
| Erro clássico sem `this` | Etapa 2 e programa executável | Código compila e imprime campo `null`, tornando o bug observável |
| Quando `this` é obrigatório | Etapas 2 e 4 | Sombreamento e `this(...)` entre construtores |
| Quando `this` é opcional | Etapa 3 | Estilos explícito, implícito e equilibrado são comparados |
| Uso profissional sem excesso | Etapa 3 e clínica | Clareza decide; repetição visual sem ganho é diagnosticada |
| `this(...)` em construtores | Etapa 4 | Construtor curto delega ao principal com status ATIVO |
| Primeira instrução | Etapa 4 e fonte inválida | Código antes de `this(...)` deve falhar no compilador |
| Chamar método do próprio objeto | Etapa 5 | `this.criado()`, `this.pago()` e atualização de status no mesmo Pedido |
| `this` não existe em `static` | Etapa 5 e fonte inválida | Contexto de instância é comparado com método de classe sem objeto atual |
| Factory `static` sem `this` | Etapa 5 e matriz conceitual | A fronteira entre classe e instância é explicitada |
| Retornar o próprio objeto | Etapa 6 | Três chamadas retornam sempre a referência `#F1` |
| Cuidado com fluent interface | Etapa 6 | A cadeia mostra três mutações escondidas pela mesma referência |
| Objeto de valor imutável | Etapa 7 | `this=#D1`, `outro=#D2` e resultado `new #D3` |
| `this` dentro de `equals` | Etapa 7 | `this == outro` reconhece a mesma referência e retorna `true` |
| Sombra e nomes de parâmetros | Etapas 2 e 3 | Padrão `this.atributo = parametro` é explicado sem inventar sufixos |
| Entidade usando `this` com critério | Etapa 10 e `ThisEntidade124.java` | OS reagenda e conclui usando estado e método interno do objeto atual |
| Passar o próprio objeto como parâmetro | Etapa 8 | Auditoria recebe `this` e é comparada com evento/dados específicos |
| Cuidado ao passar `this` | Etapas 8 e 9 | Superfície de acoplamento e escape precoce são visualizados |
| `this` nunca é `null` | Etapa 9 | Caso explica que método de instância só executa com objeto atual |
| Objeto ainda incompleto no construtor | Etapa 9 | Entregar `this` antes do fim é classificado como escape perigoso |
| Oito partes da atividade guiada | Etapas 1 a 10 | Atributo, opcional, construtor, método, static, retorno, valor, entidade e auditoria são praticados |
| Desafio Pedido de domínio | Etapa 11 | Cliente, Dinheiro, Pedido, auditoria, pagamento e cancelamento |
| Oito erros comuns | Etapa 10 | Clínica mostra sintoma e correção em menu responsivo |
| Debug recomendado | Etapa 10 | Oito frames acompanham objeto atual, retorno, comparação e fronteira |
| Registro, conclusão e commit | Etapa 11 | Checklist, defesa oral, README, terminal e commit sugerido |

## Roteiro reconstruído

1. Objeto atual — `this` alterna entre instâncias.
2. Atributo e parâmetro — sombreamento e bug silencioso.
3. Obrigatório ou opcional — critério de leitura.
4. `this(...)` e nascimento — delegação como primeira instrução.
5. Método e `static` — objeto atual versus classe.
6. Retornar `this` — fluent interface e mutação.
7. Valor e `equals` — novo objeto e mesma referência.
8. Passar `this` — auditoria e acoplamento.
9. Limites de segurança — `null`, escape precoce e nomes.
10. Debug e clínica — oito frames e oito diagnósticos.
11. Entrega e Pedido — domínio, auditoria e oito testes.

## Recursos visuais e práticos

- Mapa variável → frame → Heap para duas instâncias.
- Simulador de sombreamento com resultado `null`.
- Comparador de estilos de leitura.
- Pipeline de delegação e terminal de erro.
- Fronteira instância/`static`.
- Fluent interface rastreada pela identidade `#F1`.
- Diagrama de soma imutável e atalho do `equals`.
- Comparador de objeto inteiro versus dados de auditoria.
- Painel de segurança para `null` e objeto incompleto.
- Debugger simulado e clínica navegável.
- Código destacado, arquivos nomeados, cópia e saídas esperadas.

## Verificação técnica

O validador compila onze fontes Java válidas em conjunto, executa todos os cenários, confirma a OS, o Pedido e oito testes. Duas fontes inválidas são compiladas separadamente e precisam falhar: `this(...)` fora da primeira instrução e `this` em contexto `static`. A estrutura verifica onze etapas, oito diagnósticos, integração lazy, progresso normalizado e breakpoints responsivos.

## Estado editorial

- Implementação: concluída.
- Validação automatizada: obrigatória antes da entrega.
- Aprovação visual explícita: pendente; status `em_revisao`.
