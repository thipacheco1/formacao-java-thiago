# Matriz de reconstrução — Aula 119 — equals e hashCode

Fonte auditada integralmente: `docs/aulas/119_M4_15_EQUALS_HASHCODE_OFICIAL.md`.

A reconstrução preserva a profundidade da fonte e converte o contrato de igualdade em uma experiência observável: primeiro o aluno vê a falha, depois entra no método, acompanha os buckets e finalmente prova a regra com coleções e testes.

| Conteúdo preservado | Experiência guiada | Evidência |
| --- | --- | --- |
| `==` e `Object.equals` sem sobrescrita | Duas instâncias de Email com o mesmo conteúdo | Ambos retornam `false` e a causa é explicada |
| Anatomia de `equals` | Stepper com autorreferência, nulo/classe, cast e regra | Cada guarda é executada e interpretada |
| Assinatura com `Object` e `@Override` | Alerta contra `equals(Tipo)` | Sobrecarga e sobrescrita ficam separadas |
| `hashCode` e contrato | Fluxo igualdade → hash → bucket | Contrato correto e quebrado podem ser comparados |
| `Objects.equals` e `Objects.hash` | Email e Telefone com um e dois componentes | Código completo e saída verificável |
| Objeto de valor | Normalização e comparação por componentes | Emails equivalentes e Telefones distintos |
| Entidade por identidade | Cliente id 10 com e-mails diferentes | Igualdade permanece verdadeira pelo id |
| Entidade sem id | Alternância antes/depois da persistência | Dois ids nulos não são tratados como prova de igualdade |
| `HashSet` | Três inserções acompanhadas por hash e equals | Duplicata lógica mantém tamanho 2 |
| `HashSet` sem contrato | Contraste explicado na introdução e clínica | Cada instância seria tratada como diferente |
| `HashMap` | `put` e `get` com instâncias equivalentes | Outra chave de mesmo valor encontra Ana |
| `record` | Comparador objeto de valor versus entidade | Geração automática e comparação de componentes |
| `getClass` versus `instanceof` | Painel de decisão de tipo | Uso didático atual e ressalva sobre herança |
| Campo mutável no hash | Simulação adicionar → alterar → procurar | O objeto se torna inalcançável pela rota de hash |
| Debug recomendado | Dez pausas em equals, hashCode, Set e Map | Call stack, valores, hashes e decisões observados |
| Oito erros comuns | Clínica com sintoma e correção | Todos os oito casos da fonte preservados |
| Atividade guiada | Onze etapas em ordem com portão pedagógico | Progresso reversível e avanço condicionado |
| Desafio Produto | CodigoProduto, Produto, BigDecimal, enum e HashSet | Nove fontes compiladas e oito testes executados |
| Registro e Git | Checklist, defesa oral, README e terminal | Commit recomendado e verificação de evidências |

Decisão pedagógica: `equals` define a igualdade lógica do modelo; `hashCode` mantém essa igualdade localizável em estruturas de hash. Objeto de valor compara seus componentes; entidade compara identidade estável. Hash igual não prova igualdade, mas igualdade exige hash igual.

Aceite técnico: 11 etapas; 8 casos de clínica; 10 pausas de debug; foco móvel; progresso persistido e normalizado; navegação 118/120 bloqueada; breakpoints 900/680/520/380/320; nove fontes Java compiladas em conjunto; oito testes; lint, build, validador e diff check. Inspeção visual e aprovação explícita permanecem pendentes.
