# Matriz de preservação — Aula 086

## Identificação

- Aula: `086 — M2.25 — Entrada/saída básica com console robusto`
- Fonte integral: `docs/aulas/086_M2_25_ENTRADA_SAIDA_BASICA_COM_CONSOLE_ROBUSTO_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedRobustConsoleLesson086.jsx`
- Estilos: `plataforma-curso/src/components/guidedRobustConsoleLesson.css`
- Validador: `tools/validate-lesson-086.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

A reconstrução não resume a aula antiga. Ela preserva entrada, saída, `print`, `println`, `Scanner`, problema `nextInt`/`nextLine`, estratégia de linha inteira, `trim`/`strip`, texto obrigatório, inteiro, faixa, `BigDecimal`, confirmação, menu, `LocalDate`, prompts, mensagens, repetição, ciclo de vida do Scanner, refatoração, sete aplicações, dez erros, debug, atividade e entrega. A repetição textual foi convertida em comparação, simulação, código executável e prática guiada.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Contrato do Console | entrada, saída, `System.in`, `System.out`, `print`, `println`, Scanner | mock de terminal alternando posição do cursor e mapa teclado → Scanner → saída | código mínimo e alerta sobre fechar `System.in` |
| 2. Buffer sem Surpresas | métodos do Scanner e falha `nextInt` + `nextLine` | buffer visual passo a passo comparado à estratégia `nextLine` + `parseInt` | código frágil e código previsível |
| 3. Texto Obrigatório | linha completa, `trim`, `strip`, `isBlank`, repetição | entrada editável e pipeline linha → limpeza → validação | método completo com prompt e mensagem útil |
| 4. Inteiro e Faixa | `Integer.parseInt`, `NumberFormatException`, mínimo e máximo | simulador que separa erro de formato, erro de faixa e valor confiável | loop compilável com mensagens específicas |
| 5. Decimal, Data e S/N | `BigDecimal`, vírgula, `LocalDate`, confirmação | seletor visual de entrada que falha, formato esperado e tipo final | exemplos completos e ressalva sobre `Locale` |
| 6. Menu Robusto | menu 1..4, repetição, ação e saída | mock de menu clicável e fluxo até `break` | implementação completa do laço |
| 7. Métodos e Domínios | cliente, produto, pedido, pagamento, OS, mensageria e auditoria; duplicação e utilitário futuro | galeria de sete domínios e fronteira prompt → leitor → valor → record | comparação código ruim versus método nomeado |
| 8. Clínica de Erros | dez erros comuns | menu legível com diagnóstico, sintoma e correção | dez casos íntegros |
| 9. Entrega & Desafio | atividade, comandos, debug, observações, commit e critérios | programa determinístico, saída exata, roteiro de debug, checklist, desafio de OS e README | compilação real pelo validador |

## Decisões de profundidade

- O programa integrado usa um `Scanner` sobre entradas reproduzíveis para permitir validação automática sem retirar o modelo mental de `System.in`.
- O código executa tentativas inválidas antes de aceitar valores válidos; a saída comprova repetição e mensagens, não apenas o resultado final.
- `BigDecimal` aceita vírgula por substituição didática, mas a interface alerta que aplicações reais devem definir `Locale`.
- A estratégia principal usa apenas `nextLine`; o erro com `nextInt` permanece visível e explicado pelo buffer.
- O Scanner simulado usa `try-with-resources`; a aula diferencia isso de fechar cedo um Scanner compartilhado sobre `System.in`.
- A futura classe `LeitorConsole` é apenas indicada. Pacotes, camadas, frameworks, arquivos e bibliotecas CLI continuam fora do escopo, como na fonte.

## Padrões de interface

- Cabeçalho compacto e faixa `GuidedLessonFacts` compartilhada.
- Roteiro lateral `sticky` no desktop e trilho horizontal focado no item ativo no mobile.
- Troca de etapa ancora no começo de `.guided-layout`.
- Etapa pode ser concluída e desmarcada; avanço exige etapa atual concluída.
- Conclusão da aula só aparece após as nove etapas; próxima aula exige conclusão geral.
- Código usa Prism com tema de IDE, numeração de linhas e botão de cópia.
- Clínica limita o seletor do círculo a `button > span:first-child` e mantém `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px sem largura fixa externa.

## Validações previstas

- Rota dedicada para `086_`.
- Nove etapas e dez casos de clínica.
- Sete domínios.
- Persistência filtrada por IDs válidos.
- Sincronização entre progresso antigo e etapas.
- Foco mobile e âncora no roteiro.
- Bloqueios de próxima etapa e próxima aula.
- CSS responsivo até 320 px e raiz sem recorte.
- Extração, compilação e execução real de `CadastroConsole.java`.
- Comparação exata das oito linhas de saída.
- Lint dos arquivos alterados e `git diff --check`.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita do responsável para elevar a aula a referência aprovada.
- A Aula 087 deve ensinar organização de pacotes sem deslocar este laboratório para arquitetura em camadas.
