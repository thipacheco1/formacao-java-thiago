# Matriz de preservação — Aula 087

## Identificação

- Aula: `087 — M2.26 — Organização de pacotes desde cedo`
- Fonte integral: `docs/aulas/087_M2_26_ORGANIZACAO_DE_PACOTES_DESDE_CEDO_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedJavaPackagesLesson087.jsx`
- Estilos: `plataforma-curso/src/components/guidedJavaPackagesLesson.css`
- Validador: `tools/validate-lesson-087.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado em uma sequência guiada. A reconstrução mantém `package`, `import`, ordem do arquivo, default package, coerência com pastas, domínio reverso, `app`, `dominio`, `console`, `util`, árvore inicial, `javac -d out`, `java -cp out`, nome completo da classe, múltiplos fontes, imports da JDK, mesmo pacote, wildcard, static import, utilitário criterioso, console separado, sete conceitos de domínio, IntelliJ, refatoração, criação consciente de pacotes, dez erros, debug, atividade, commit e critérios de conclusão.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Package e Import | identidade, dependência, FQCN e ordem do arquivo | seletor visual package/import e arquivo anotado | código completo na ordem correta |
| 2. Pacote e Pasta | caminho físico, declaração lógica e default package | árvore interativa com divergência simulada | `Cliente.java` coerente e diagnóstico do default |
| 3. Quatro Pacotes Iniciais | `app`, `dominio`, `console`, `util` e excesso arquitetural | mapa selecionável de responsabilidades | galeria de cliente, produto, pedido, pagamento, OS, mensagem e auditoria |
| 4. Compilar com `-d` | vários fontes, saída `out` e `.class` | pipeline fonte → javac → bytecode com botão de execução | comando PowerShell e árvore de saída |
| 5. Classpath e FQCN | `java -cp out`, raiz e nome completo | comparação executável correto versus `java Main` | fluxo JVM → classpath → classe |
| 6. Imports com Critério | projeto, JDK, mesmo pacote, wildcard e static | seletor de cinco casos | `Pedido.java` demonstra domínio e `BigDecimal` |
| 7. Refatorar no IntelliJ | criar pacote, mover, atualizar imports e nomes | mock inspecionável da Project view antes/depois | fluxo Refactor → Move → revisar → compilar |
| 8. Clínica de Erros | dez erros comuns | diagnóstico com sintoma e correção | dez casos íntegros e menu responsivo |
| 9. Entrega & Desafio | estrutura, fontes, comandos, debug, README e Git | projeto multiarquivo navegável e saída determinística | compilação real de oito fontes em quatro pacotes |

## Decisões de profundidade

- A aula não reduz package a convenção visual: mostra que ele participa da identidade `br.com.formacao.app.Main`.
- Pasta, declaração, saída compilada e classpath são conectados em um único modelo mental.
- O laboratório compila oito arquivos reais distribuídos em `app`, `dominio`, `console` e `util`.
- `Cliente`, `Produto`, `Pedido`, `FormaPagamento`, `Pagamento`, `TextoUtils` e `ConsoleInput` possuem código completo; OS, mensageria e auditoria permanecem no desafio e na galeria, como expansão controlada.
- A separação `controller/service/repository` é deliberadamente adiada. O estudante aprende a justificar um pacote antes de multiplicar pastas.
- Wildcard e static import continuam apresentados, mas imports explícitos são recomendados.
- O mock do IntelliJ ensina `Refactor > Move` sem fingir uma captura estática: a mudança de estado mostra o efeito sobre árvore e responsabilidades.

## Padrões de interface

- Cabeçalho compacto e faixa `GuidedLessonFacts` compartilhada.
- Roteiro `sticky` no desktop; trilho horizontal centralizado no item ativo em mobile.
- Seleção de etapa ancora em `.guided-layout`.
- Etapa pode ser concluída/desmarcada e a próxima exige a atual concluída.
- Conclusão geral exige nove etapas; Aula 088 permanece bloqueada até a conclusão.
- Código usa Prism com tema de IDE, linhas e cópia.
- Clínica usa `button > span:first-child` para o número e `guided-error-label` para o texto.
- Layout responde em `900`, `680`, `520`, `380` e `320` px, com raiz `overflow: visible`.

## Validações previstas

- Rota exclusiva para `087_`.
- Nove etapas, quatro pacotes iniciais, cinco casos de import e dez diagnósticos.
- Progresso filtrado por IDs válidos, normalização antiga, foco mobile e âncora do roteiro.
- Portões de etapa e aula.
- CSS responsivo até 320 px.
- Extração e gravação dos oito fontes nas pastas declaradas.
- Compilação com `javac -d out` e execução por `br.com.formacao.app.Main`.
- Comparação exata das seis linhas de saída.
- Lint, build periódico e `git diff --check` no escopo da aula.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de elevar a aula a referência aprovada.
- A Aula 088 deve partir desta organização para ensinar leitura de documentação oficial, sem antecipar Maven ou Spring.
