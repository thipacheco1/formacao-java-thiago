# Matriz de cobertura — Aula 067

- Original: `067_M2_06_STRING_POOL_E_IMUTABILIDADE_DE_STRING_OFICIAL.md`
- Componente: `GuidedStringPoolLesson067.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de identidade textual, pool, comparação, imutabilidade, normalização, métodos, concatenação, clínica e entrega.

## Transformação

O aluno deixa de decorar “use equals” e passa a desenhar referências, objetos do pool e objetos externos, observar transformações produzindo novos valores, acompanhar parâmetros em frames e escolher concatenação conforme a escala.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| String como objeto e literal | Mapa do String Pool | Referências apontam para objetos identificados no pool e fora dele |
| String pool | Mapa do String Pool | Dois literais compartilham P1 |
| `new String` | Mapa + programa | Objeto H1 separado, `== false` e `equals true` |
| String criada em runtime | Mapa + comparação | Conteúdo produzido em execução mantém igualdade por conteúdo |
| `==` versus `equals` | Referência ou Conteúdo | Quatro origens e três comparadores interativos |
| equals seguro com literal | Comparação + programa | Null produz false sem NPE |
| `equalsIgnoreCase` | Comparação | Resultado e finalidade específicos |
| Imutabilidade | Imutabilidade em Cena | Quatro passos preservam S1 e mostram novos resultados |
| Retorno ignorado de `trim` e `toUpperCase` | Imutabilidade + Clínica | Vínculo continua em S1 até capturar retorno |
| Motivos da imutabilidade | Mapa + imutabilidade | Reuso seguro, identidade estável e ausência de mutação compartilhada |
| Normalização | Normalização e Métodos | Campo editável mostra entrada e formato canônico |
| Métodos úteis | Normalização e Métodos | Oito operações com entrada e resultado |
| `isBlank` versus `isEmpty` | Normalização + programa | Espaços produzem true e false respectivamente |
| String em método sem retorno | String em Métodos | Frames mostram S2 perdido ao terminar chamada |
| Método transformador com retorno | String em Métodos | `status = normalizar(status)` atualiza o vínculo do main |
| Cópia de referência | String em Métodos | Frames do main e método permanecem separados |
| Concatenação simples | Concatenação + domínios | Mensagem pequena conserva `+` |
| Concatenação em loop | Concatenação com Critério | Controle de itens mostra resultados intermediários |
| StringBuilder introdutório | Concatenação + programa | Builder mutável e `toString` sem antecipar aula profunda |
| `intern` | Mapa + programa | Referência canônica demonstrada com limite profissional |
| Pedido | Strings no Backend | Nome, status e equals seguro |
| Produto | Strings no Backend | Nome e status normalizados |
| Ordem de serviço | Strings no Backend | Certificado e status em formato canônico |
| Mensageria | Strings no Backend | Concatenação simples apropriada |
| Auditoria | Strings no Backend | Usuário minúsculo, códigos maiúsculos |
| Refatorações de `==`, retorno e loop | Clínica + laboratórios | Causas e correções observáveis |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos com identidade, equals e trim |
| Atividade, comandos e saídas | Entrega & Desafio | Programa completo e dez linhas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e checklist |
| Limites curriculares | Concatenação + entrega | Não aprofunda internals, compact strings, benchmark, regex ou StringBuilder |

## Consolidação sem perda

Os exemplos repetitivos foram consolidados em quatro mapas de identidade, quatro origens de texto, quatro passos de imutabilidade, oito métodos, dois cenários de frame, um comparador de montagem, seis domínios, dez diagnósticos e um programa integrado. Todo comportamento único permanece observável.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.

