# Matriz de preservação — Aula 094

## Identificação

- Aula: `094 — M3.05 — Retorno boolean para validação`
- Fonte: `docs/aulas/094_M3_05_RETORNO_BOOLEAN_PARA_VALIDACAO_OFICIAL.md`
- Experiência: `plataforma-curso/src/components/GuidedBooleanValidationLesson094.jsx`
- Estilos: `plataforma-curso/src/components/guidedBooleanValidationLesson.css`
- Validador: `tools/validate-lesson-094.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Preservação pedagógica

Todo conteúdo original foi preservado: boolean como pergunta, motivos de uso, nomes claros, suficiência e limite, separação de mensagem, exemplos básicos, sete domínios, condição grande, nomes positivos, guard clause, critérios de extração, testes manuais, oito erros, debug, atividade, Git e critérios.

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Boolean como Pergunta | sete nomes selecionáveis | leitura natural de domínio |
| Suficiente ou Limitado | decisão entre boolean e resultado rico | limites explícitos |
| Regra sem Mensagem | validação versus efeito | console fora da regra |
| Seis Refatorações | condição, nome, negação, guard clause e repetição | julgamento contra extração artificial |
| Texto e BigDecimal | dois programas completos | null, `isBlank` e `compareTo` |
| Sete Domínios | sete fontes completas | cliente a auditoria |
| Testes Manuais | seis cenários | esperado, atual e falha contextual |
| Clínica de Erros | oito casos da fonte | sintoma e correção |
| Entrega & Desafio | terminal, debug, checklist e README | dez fontes compiladas |

## Profundidade e interface

- Dez programas Java completos e compiláveis.
- Nomes positivos, curto-circuito e ausência de efeitos colaterais permanecem centrais.
- Boolean insuficiente aponta para `ResultadoValidacao` sem antecipar a próxima modelagem.
- Nove etapas, cabeçalho compacto, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Prism, cópia, galeria de domínios, suíte manual e clínica responsiva.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, estrutura, cobertura, responsividade e compila as dez fontes.
- Executa os dois exemplos básicos e a suíte de seis asserts.
- Lint e `git diff --check`; build completo coberto pela Aula 091.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 095 continua com métodos de cálculo.
