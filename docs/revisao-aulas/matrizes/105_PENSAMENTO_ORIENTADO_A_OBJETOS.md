# Matriz de preservação — Aula 105

## Identificação

- Aula: `105 — M4.01 — Pensamento orientado a objetos`
- Fonte: `docs/aulas/105_M4_01_PENSAMENTO_ORIENTADO_A_OBJETOS_OFICIAL.md`
- Aula anterior: `104 — Revisão final de fundamentos antes de OO`
- Aula seguinte: `106 — Modelagem no papel`
- Experiência: `plataforma-curso/src/components/GuidedObjectThinkingLesson105.jsx`
- Estilos: `plataforma-curso/src/components/guidedObjectThinkingLesson.css`
- Validador: `tools/validate-lesson-105.mjs`
- Arquétipo: oficina visual de mudança mental, anatomia de objeto, comparação executável, memória, fronteiras, descoberta, transferência, debug, desafio, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno muda o centro do raciocínio de passos sobre dados soltos para conceitos representados por objetos com estado, comportamento e identidade, sem abandonar fundamentos procedurais nem criar um objeto que faz tudo.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| procedural versus OO | Mudança de Mentalidade | alternância entre as duas perguntas centrais |
| classe | Anatomia de um Objeto | molde `OrdemServico` |
| objeto | Anatomia e Dois Objetos | instâncias concretas OS-001 e OS-002 |
| estado | Anatomia e Memória | campos próprios de cada instância |
| comportamento | Anatomia, Comparação e Pedido | perguntas e cálculos sobre estado |
| identidade | Anatomia e Memória | certificado distingue objetos parecidos |
| exemplo procedural | Procedural × OO | `OsProcedural.java` integral |
| exemplo orientado a objetos | Procedural × OO | `OsOrientadaAObjetos.java` integral |
| duas OS | Dois Objetos em Memória | referências e objetos independentes |
| nova regra `encerrada()` | Comparação e Memória | usada dentro de `filaSugerida()` |
| alterar atraso para cinco dias | Comparação e Entrega | mudança localizada nos dois modelos |
| nem tudo entra no objeto | O que Pertence ao Objeto | oito responsabilidades classificadas |
| substantivos e verbos | Descobrir Candidatos | enunciado analisado em duas lentes |
| objeto não é só dado | Fronteira e Clínica | comportamento coerente sobre estado |
| deus objeto | Fronteira e Clínica | console, banco, WhatsApp e HTTP fora |
| exemplo Pedido | Pedido com Comportamento | BigDecimal, bruto, desconto e final |
| leitura crítica | Comparação e Entrega | perguntas sobre localização e evolução |
| debug | Debug de Objetos | `this`, duas instâncias e cinco pausas |
| desafio Cliente | Desafio Cliente | estado, três comportamentos e duas instâncias |
| seis erros comuns | Clínica ampliada | oito casos com sintoma e recuperação |
| registro, critérios e Git | Entrega & Ponte | checklist, teste, reflexão e commit |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Mudança de Mentalidade | passos → conceitos | duas lentes alternáveis |
| Anatomia de um Objeto | termos → modelo concreto | cinco conceitos navegáveis |
| Procedural × OO | opinião → comparação executável | duas fontes completas |
| Dois Objetos em Memória | variável → referência e instância | mock de heap com estado independente |
| O que Pertence ao Objeto | extremos → fronteira | domínio versus borda |
| Descobrir Candidatos | texto → hipóteses de modelo | substantivos e verbos |
| Pedido com Comportamento | uma OS → transferência | segundo domínio executável |
| Debug de Objetos | método → instância atual | `this`, estado e frames |
| Desafio Cliente | compreensão → autoria | terceiro domínio completo |
| Clínica de Erros | confusão → correção conceitual | oito casos |
| Entrega & Ponte | exemplos → evidências | cinco fontes, testes, reflexão e Git |

## Recursos e profundidade

- Cinco fontes Java completas: procedural, OO, Pedido, Cliente e suíte manual.
- Alternância de lentes, anatomia navegável, mock de memória, classificador de fronteiras, descoberta de candidatos, simulador de Pedido e mock de debug.
- Comparação preserva a utilidade do procedural e evita vender OO como substituição de `if`, laço ou método.
- Onze etapas substantivas; Clínica de Erros e Entrega permanecem tópicos finais próprios.
- Clínica própria com oito casos e entrega separada com quinze evidências.
- Cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, onze etapas e oito erros.
- Compila as cinco fontes, compara saídas essenciais e confirma OS, Pedido, Cliente e doze evidências automatizadas.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 106 continuará com modelagem no papel antes de criar novas classes.
