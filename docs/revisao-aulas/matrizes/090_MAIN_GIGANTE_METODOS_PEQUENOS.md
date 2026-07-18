# Matriz de preservação — Aula 090

## Identificação

- Aula: `090 — M3.01 — De main gigante para métodos pequenos`
- Fonte integral: `docs/aulas/090_M3_01_DE_MAIN_GIGANTE_PARA_METODOS_PEQUENOS_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedSmallMethodsLesson090.jsx`
- Estilos: `plataforma-curso/src/components/guidedSmallMethodsLesson.css`
- Validador: `tools/validate-lesson-090.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado na abertura do Módulo 3. A experiência mantém diagnóstico de `main` gigante, sinais de extração, comentários que denunciam métodos ausentes, níveis de detalhe, responsabilidade, parâmetros, retorno, `void`, exemplo inicial completo, sete extrações incrementais, programa final completo, leitura crítica, Extract Method do IntelliJ, validação após cada mudança, console robusto, aplicações em sete domínios, diferença entre método e arquitetura em camadas, dez erros, debug, atividade, arquivos, commit e critérios de conclusão.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Diagnóstico do Main | definição, sintomas, custos e responsabilidades misturadas | mapa interativo das sete responsabilidades dentro do ponto de entrada | leitura, debug, teste, reuso, manutenção e evolução explicitados |
| 2. Quando Extrair | intenção, repetição, regra, teste, nível e comentário | seletor de seis critérios e comparação entre história e detalhe | alerta contra métodos artificiais |
| 3. Sete Extrações | normalizar, validar texto/número, total, desconto, total final e saída | trilha incremental com contrato e ciclo seguro de cinco ações | sete checkpoints, um por responsabilidade |
| 4. Parâmetro, Retorno e void | fronteiras e contratos | laboratório de assinatura com comparação entre cálculo e efeito | parâmetros mínimos, valor devolvido e ação isolada |
| 5. Comportamento Preservado | antes, depois e leitura crítica | comparação integral entre `MainGigante` e `PedidoRefatorado` | duas classes compiláveis e oito linhas idênticas |
| 6. Extract Method no IntelliJ | seleção, automação e revisão humana | mock interativo da IDE com parâmetros e retorno detectados | compilar, executar e comparar saída após a extração |
| 7. Aplicações Reais | cliente, produto, pagamento, OS, mensageria, auditoria e pedido | galeria de sete domínios com histórias em métodos | limite explícito: decomposição procedural, não camadas |
| 8. Clínica de Erros | dez falhas comuns de extração | diagnóstico com sintoma e correção | dez casos íntegros e navegáveis |
| 9. Entrega & Desafio | compilação, execução, debug, evidências e Git | terminal, checklist, desafio guiado e README copiável | comparação real de saída e critérios de conclusão |

## Decisões de profundidade

- `MainGigante.java` permanece completo para que o aluno identifique o problema antes da solução.
- `PedidoRefatorado.java` preserva normalização, validação, cálculos monetários e saída, mas distribui o trabalho em métodos nomeados.
- As sete extrações são apresentadas em sequência segura; nenhuma refatoração em massa é incentivada.
- `BigDecimal`, `compareTo`, limite de desconto e escala resultante continuam visíveis.
- A equivalência não é declarada apenas no texto: o validador compila e executa as duas classes e compara exatamente suas oito linhas.
- O mock do IntelliJ deixa claro que a IDE move código, enquanto o programador decide nome, responsabilidade, parâmetros e retorno.
- O exemplo de muitos parâmetros em `imprimirResumo` é tratado como cheiro futuro, sem antecipar records, objetos de domínio ou camadas.
- Console robusto e aplicações profissionais permanecem contextualizados sem transformar a aula em arquitetura.

## Padrões de interface

- Cabeçalho compacto, fatos compartilhados e nove etapas.
- Roteiro `sticky` no desktop e item ativo focado no trilho mobile.
- Troca de etapa ancora em `.guided-layout`.
- Concluir/desmarcar, portão de etapa e portão curricular para a Aula 091.
- Código completo com Prism, numeração de linhas, quebra segura e cópia.
- Mock visual do IntelliJ, trilha de extrações, contratos e comparação antes/depois.
- Clínica usa círculo numérico restrito e `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota dedicada para `090_`.
- Nove etapas, sete responsabilidades, seis critérios, sete extrações, sete domínios e dez erros.
- Progresso filtrado, normalização antiga, foco mobile, âncora e portões.
- Presença de `main`, `BigDecimal`, normalização, validação, parâmetros, retorno, `void`, Extract Method, debug e limite de arquitetura.
- Extração das duas fontes Java do componente, compilação real e execução de ambas.
- Comparação exata das oito linhas esperadas e equivalência antes/depois.
- Lint e `git diff --check`; build de produção segue a cadência já validada na Aula 087.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de virar referência aprovada.
- A Aula 091 aprofunda assinatura de método profissional.
