# Matriz de preservação — Aula 092

## Identificação

- Aula: `092 — M3.03 — Coesão em métodos`
- Fonte integral: `docs/aulas/092_M3_03_COESAO_EM_METODOS_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedMethodCohesionLesson092.jsx`
- Estilos: `plataforma-curso/src/components/guidedMethodCohesionLesson.css`
- Validador: `tools/validate-lesson-092.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado na clínica de foco e responsabilidade. A experiência mantém definição de coesão, diferença entre tamanho e intenção, regra “uma coisa” com maturidade, níveis de abstração, sintomas, responsabilidade principal, exemplo ruim, sete intenções, seis extrações, versão coesa, método de coordenação, relação com nome/retorno/efeitos/comentários/tamanho/duplicação, seis domínios, método curto ruim, método maior coeso, três refatorações, futuro OO, dez erros, debug, atividade, arquivos, Git e critérios.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Intenção, não Tamanho | conceito, “uma coisa” e responsabilidade | foco central com seis propósitos e contraste 5/25 linhas | tamanho deixa de ser veredito |
| 2. Nível de Abstração | detalhe versus coordenação | alternância entre operações internas e chamadas nomeadas | orquestração de alto nível explicitada |
| 3. Sintomas e Efeitos | sinais de baixa coesão e efeitos colaterais | oito alertas selecionáveis e mapa de seis efeitos | nome com “e”, comentários e I/O visíveis |
| 4. Sete Intenções | leitura e extrações incrementais | trilha dados–normalização–validação–cálculos–saída–auditoria | sete fronteiras e ciclo ler antes de extrair |
| 5. Antes versus Depois | `MetodoPoucoCoeso` e `MetodoCoeso` | comparação integral de duas fontes | quatro linhas exatamente equivalentes |
| 6. Curto versus Coeso | método curto ruim e método maior focado | alternância de código e julgamento por nome/motivo/tamanho | regra de 30/40 linhas tratada como revisão, não condenação |
| 7. Seis Domínios | cliente, produto, pagamento, OS, mensageria e auditoria | galeria com seis programas Java completos | normalização, validação, cálculo, montagem e efeito separados |
| 8. Clínica de Erros | dez falhas comuns | diagnóstico com sintoma e correção | dez casos íntegros e navegáveis |
| 9. Entrega & Desafio | compilação, execução, debug, evidências e Git | terminal, breakpoints, checklist e README copiável | dez fontes compiladas e equivalência executada |

## Decisões de profundidade

- Coesão é avaliada por intenção, nível e motivos de mudança, nunca apenas por contagem de linhas.
- O método de coordenação é preservado como fronteira legítima quando só orquestra passos de alto nível.
- Cálculo, saída e auditoria são separados para tornar efeitos colaterais observáveis.
- A validação de senha demonstra que vários `if` podem pertencer à mesma responsabilidade.
- O alerta de duplicação diferencia sequência técnica parecida de regra de domínio compartilhada.
- As duas versões do pedido preservam entradas e quatro linhas de saída para isolar o ganho estrutural.
- Os seis programas de domínio são completos e compiláveis; somados aos quatro estudos centrais, formam dez fontes reais.
- O validador compila as dez classes, executa antes/depois e compara a saída exata.

## Padrões de interface

- Cabeçalho compacto, fatos compartilhados e nove etapas.
- Roteiro `sticky` no desktop e item ativo focado no trilho mobile.
- Troca de etapa ancora em `.guided-layout`.
- Concluir/desmarcar, portão de etapa e portão curricular para a Aula 093.
- Código completo com Prism, linhas, quebra segura e cópia.
- Mapa de foco, níveis de abstração, trilha de extrações e comparação executável.
- Clínica usa círculo numérico restrito e `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota dedicada para `092_`.
- Nove etapas, seis propósitos, oito sintomas, sete extrações, seis domínios e dez erros.
- Progresso filtrado, normalização antiga, foco mobile, âncora e portões.
- Presença de coordenação, nível de abstração, efeito colateral, comentários, duplicação, `BigDecimal`, `LocalDate`, `Instant`, enum, record e debug.
- Extração e compilação das dez fontes Java.
- Comparação exata de `MetodoPoucoCoeso` e `MetodoCoeso`.
- Lint e `git diff --check`; build de produção segue a validação completa da Aula 091.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de virar referência aprovada.
- A Aula 093 aprofunda parâmetros demais e alternativas.
