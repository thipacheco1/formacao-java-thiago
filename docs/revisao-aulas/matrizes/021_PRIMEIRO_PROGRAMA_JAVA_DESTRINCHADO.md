# Matriz de cobertura — Aula 021

## Identificação

- ID: `021_M1_01_PRIMEIRO_PROGRAMA_JAVA_DESTRINCHADO_OFICIAL`
- Fonte auditada: `docs/aulas/021_M1_01_PRIMEIRO_PROGRAMA_JAVA_DESTRINCHADO_OFICIAL.md`
- Aula anterior: `020_M0_20_CHECKLIST_FINAL_DO_AMBIENTE_OFICIAL`
- Fronteira seguinte: `022_M1_02_BLOCOS_CHAVES_INDENTACAO_E_LEITURA_DE_CODIGO_OFICIAL.md`
- Arquétipo: oficina visual de anatomia, execução e diagnóstico do primeiro programa Java.

## Contrato pedagógico

O aluno não deve copiar uma receita opaca. Ao terminar, precisa conseguir digitar, compilar, executar, depurar e explicar o programa clássico palavra por palavra, prever a saída sequencial, reconhecer dez falhas iniciais e entregar somente fontes e evidências adequadas ao Git.

## Inventário integral da fonte

| Conteúdo original | Destino na experiência nova | Tratamento |
|---|---|---|
| Programa completo e perguntas iniciais | Raio X interativo do código | Preservado e transformado em exploração por token |
| `public class Main`, classe, visibilidade e nome | Casca da classe e contrato arquivo/classe | Preservado com comparação de casos |
| Maiúsculas, minúsculas e PascalCase | Laboratório de nomes | Preservado e conectado aos três programas |
| Chaves e indentação iniciais | Mapa de pertencimento classe → método → instrução | Preservado no limite necessário; aprofundamento pertence à Aula 022 |
| `public static void main(String[] args)` | Anatomia selecionável do ponto de entrada | Preservado palavra por palavra |
| `public` do `main` | Cartão de responsabilidade | Preservado em nível inicial |
| `static` e chamada sem objeto | Simulação launcher → classe → `main` | Preservado sem antecipar OO profunda |
| `void` | Contrato de retorno | Preservado e contrastado com retornos futuros sem ensiná-los |
| nome especial `main` e case-sensitive | Clínica de assinatura | Preservado |
| `String[] args`, `String`, array e nome `args` substituível | Anatomia do parâmetro e exemplo `argumentos` | Preservado sem aprofundar arrays |
| `System.out.println` | Raio X da chamada de saída | Preservado por segmento |
| `println` versus `print` | Console comparativo executável | Preservado com saídas exatas |
| Texto com aspas duplas e caractere com aspas simples | Laboratório de literais | Preservado |
| Ponto e vírgula | Compilador visual e clínica de erros | Preservado |
| Comentário executável versus explicação humana | Editor com trilha de execução | Preservado; comentários profundos ficam para Aula 023 |
| Criação da pasta e de `Main.java` | Terminal guiado com diretório controlado | Preservado com saída e estado do disco |
| `javac Main.java`, `Main.class`, `java Main` | Pipeline fonte → bytecode → JVM → console | Preservado com prova de cada transição |
| Não executar `java Main.class` | Clínica de launcher | Preservado |
| IntelliJ Run e validação pelo terminal | Mock de IDE e prova de paridade | Preservado passo a passo |
| Breakpoint, linha antes/depois, F8, F9 e Shift+F9 | Debug visual controlável | Preservado com console antes e depois |
| Duas e três impressões em ordem | Linha do tempo de execução | Preservado com console incremental |
| `ResumoOrdemServico` | Programa de domínio selecionável | Preservado com comando e saída |
| `ResumoPedido` | Programa de domínio selecionável | Preservado com comando e saída |
| Arquivos `.java` e `.class` no Git | Mesa de stage fonte versus gerado | Preservado com `.gitignore` |
| Dez erros comuns | Clínica com código, diagnóstico, causa e correção | Preservado integralmente |
| Leitura `arquivo:linha`, mensagem e `^` | Lupa do compilador | Preservado e aprofundado |
| Atividade com três arquivos | Missão integradora | Preservada |
| Estrutura `labs/m1/aula-021-primeiro-programa-java` | Árvore do laboratório | Preservada |
| `git status`, `git diff`, stage nominal, staged diff e commit | Entrega Git guiada | Preservado sem simular commit real |
| Critério de conclusão | Checklist final e documento de evidências | Preservado sem autoaprovação |

## Repetições consolidadas

- A assinatura completa de `main` deixa de ser repetida em parágrafos isolados e vira uma anatomia única, explorável e revisável.
- O fluxo `Main.java → javac → Main.class → java → JVM` aparece como um pipeline central; as demais etapas reutilizam esse modelo em vez de reexplicá-lo.
- As regras arquivo/classe, maiúsculas e PascalCase formam um único contrato de nomes com exemplos corretos e incorretos.
- Os dez erros permanecem dez casos distintos, mas usam a mesma ficha diagnóstica: sintoma, mensagem, causa, correção e nova prova.
- Os exemplos `Main`, ordem de serviço e pedido compartilham uma bancada que troca código, comandos e console sem perder nenhum deles.

## Correções e aprofundamentos necessários

- Corrigir a transição final da fonte: a próxima aula é sobre blocos, chaves, indentação e leitura; variáveis não começam imediatamente na Aula 022.
- Explicar que `javac` bem-sucedido normalmente não imprime mensagem e que a existência de `Main.class` é a evidência.
- Exibir saídas reais ou representativas de cada comando, inclusive os erros, sem fingir que foram observadas na máquina do aluno.
- Distinguir erro de compilação de erro de inicialização pelo launcher: certas assinaturas incorretas compilam, mas `java Main` não encontra um ponto de entrada válido.
- Mostrar que o acento `^` indica onde o compilador percebeu o problema, não necessariamente onde a causa nasceu.
- Evitar criar arquivos na raiz global `C:\dev\labs`; o caminho nominal da formação é `labs\m1\aula-021-primeiro-programa-java` dentro da raiz Git já validada.
- Usar `Get-ChildItem`/`ls` apenas para inspeção e stage nominal; nenhuma ação apaga bytecode ou altera estado externo automaticamente.
- Explicar que `//` não é executado, mas deixar qualidade de comentários para a Aula 023.

## Fronteira com aulas vizinhas

- A Aula 020 prova que o ambiente está pronto; a Aula 021 usa esse ambiente para construir o primeiro programa.
- A Aula 021 apresenta apenas os dois blocos necessários e sua indentação.
- A Aula 022 continua responsável por blocos aninhados, leitura de fora para dentro/dentro para fora, formatação, escopo visual e clínica profunda de chaves.
- A Aula 023 continua responsável por comentários úteis e documentação inicial.
- Variáveis, tipos, `String` profunda, arrays, OO e `static` profundo permanecem para suas aulas específicas.

## Sequência reconstruída

1. Assumir o controle do primeiro programa e explorar o mapa completo.
2. Entender classe, arquivo, case e chaves no limite inicial.
3. Destrinchar cada token da assinatura do `main`.
4. Destrinchar `System.out.println`, literais, `print` e ponto e vírgula.
5. Criar, compilar e executar `Main.java` com evidências no terminal.
6. Repetir o fluxo no IntelliJ e observar Run/Debug antes e depois da linha.
7. Acompanhar a ordem de execução e o console crescer instrução por instrução.
8. Construir `ResumoOrdemServico` e `ResumoPedido`, preservando nomes e saídas.
9. Diagnosticar os dez erros por fase e ler a mensagem do compilador.
10. Organizar fontes, ignorar bytecode, revisar Git, registrar evidências e entregar a missão.

## Recursos

- [x] Raio X interativo do código com syntax highlighting.
- [x] Mapa classe → `main` → instrução.
- [x] Anatomia selecionável da assinatura do `main`.
- [x] Console comparativo `print`/`println` e literais.
- [x] Terminal guiado com estados de arquivos e saídas.
- [x] Mock do IntelliJ com Run e Debug controláveis.
- [x] Linha do tempo de execução sequencial.
- [x] Bancada dos três programas.
- [x] Clínica integral dos dez erros.
- [x] Mesa de Git e gerador de evidências.

## Preservação

- [x] Todo conceito único da fonte possui destino.
- [x] Os três programas e suas saídas permanecem presentes.
- [x] Os dez erros permanecem diagnosticáveis individualmente.
- [x] Comandos, saídas, interpretações e recuperações possuem destino.
- [x] A profundidade futura de blocos, comentários, tipos e OO não foi antecipada.
- [x] Nenhum resultado local, commit ou evidência é inventado como concluído.

## Validação final

- [x] Lint aprovado.
- [x] Dois builds aprovados.
- [x] `git diff --check` aprovado no escopo.
- [x] Rota HTTP 200.
- [ ] Desktop, celular e interações verificados em navegador.
- [ ] Controles de etapa e conclusão verificados.
- [ ] Responsável aprovou.

### Observação da auditoria

A fonte possui bom inventário conceitual, mas apresenta o mesmo conteúdo em muitos blocos textuais e quase nunca torna visíveis o estado do disco, o console antes/depois, a fase exata da falha ou a interface da IDE. A reconstrução transforma essas explicações em observação guiada sem reduzir o conteúdo. Lint, duas compilações de produção, rota HTTP 200 e verificação de whitespace no escopo passaram; a inspeção visual responsiva e dos controles permanece pendente porque não existe navegador controlável conectado nesta sessão.
