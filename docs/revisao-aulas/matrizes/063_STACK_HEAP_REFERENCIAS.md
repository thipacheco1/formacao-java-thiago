# Matriz de cobertura — Aula 063

- Original: `063_M2_02_STACK_HEAP_E_REFERENCIAS_OFICIAL.md`
- Componente: `GuidedStackHeapReferencesLesson063.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de memória com frames, referências simbólicas, objetos, mutação, reatribuição, null, alcançabilidade, clínica e entrega.

## Transformação

O aluno deixa de decorar “stack versus heap” e passa a prever uma execução: qual frame existe, qual valor foi copiado, qual objeto é alcançado, se houve mutação ou reatribuição e o que permanece depois do retorno.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Stack, heap, frame, local, parâmetro, referência e objeto | Mapa da Memória | Simulação em seis estados com stack e heap simultâneos |
| Endereços apenas didáticos e limites do modelo | Nota do Mapa | Usa `ref A` e `objeto A`, sem fingir endereço físico |
| Entrada e saída de frames; retorno | Frames da Stack | Quatro passos de `main → somar → retorno → main` |
| Stack e heap com papéis diferentes | Frames da Stack | Evidência explícita; não cria hierarquia “bom versus ruim” |
| Primitivo copiado | Valor e Referência | `10 → 99` apenas no parâmetro; chamador permanece 10 |
| Array como objeto; cópia da referência | Valor e Referência | Duas variáveis alcançam o array A |
| Mutação versus reatribuição | Mapa e comparador | Array A muda; parâmetro passa para B sem trocar o main |
| Java passa argumentos por valor | Valor e Referência | Três casos comparados antes/frame/depois |
| `null`, NPE e validação | null e Curto-circuito | Casos null, vazio, espaços e texto válido |
| Ordem do `&&` e curto-circuito | null e Curto-circuito | Segunda condição marcada como “não avaliado” quando null |
| String imutável | String e StringBuilder | S1 preservada e resultado associado simbolicamente a S2 |
| String em parâmetro e retorno necessário | String e StringBuilder + entrega | `status = normalizar(status)` e saída `APROVADO` |
| StringBuilder mutável e reatribuição local | String e StringBuilder + clínica | Mesmo objeto B1 muda; reatribuição é diagnosticada separadamente |
| Classe Cliente, campo mutado e objeto reatribuído | Entrega integrada | Ana fica INATIVO; Bruno existe apenas no frame local |
| Variável local versus vida do objeto | Vida e Alcançabilidade | Quatro estados: compartilhado, uma ref, retornado e perdido |
| Objeto retornado sobrevive ao frame | Vida e Alcançabilidade | `main.cliente → C` após fim do criador |
| Objeto perdido e elegibilidade para GC | Vida e Alcançabilidade | B sem referência; sem prometer coleta imediata |
| Referências compartilhadas não clonam | Vida e Alcançabilidade | `primeiro` e `segundo` apontam para A; ambos veem Bruno |
| Cópia real exige novo objeto | Clínica + desafio | Erro de “clone” e transferência com dois carrinhos |
| Pedido, Produto, Pagamento, OS, Mensagem e Auditoria | Decisões de Backend | Galeria de seis domínios com mutação, retorno e criação |
| Refatorar alteração e exibição | Decisões de Backend | Regra explícita de separar alterar, calcular e exibir |
| Quando mutar e quando retornar | Decisões de Backend | Intenção, efeito e nome profissional comparados por domínio |
| Dez erros comuns | Clínica de Erros | Dez casos independentes com sintoma e correção |
| Debug com Step Into e reatribuição | Entrega & Desafio | Roteiro de quatro ações no IntelliJ |
| Atividade, compilação, execução e saídas | Entrega & Desafio | Programa único completo, comandos e sete linhas esperadas |
| Cliente, arrays, String e null no mesmo laboratório | Programa integrado | `LaboratorioMemoria.java` compilável |
| README, diário, Git e `.class` ignorado | Entrega & Desafio | Checklist, evidências copiáveis e critérios de Git |
| Transferência | Desafio do carrinho | Identidade compartilhada, separação e função pura |
| Limites curriculares | Mapa e alcançabilidade | GC profundo, gerações, escape analysis e weak refs não são antecipados |

## Consolidação sem perda

Os 29 arquivos sugeridos no original foram consolidados em um programa integrado, cinco simulações e seis aplicações de backend. Cada comportamento único permanece observável; arquivos que apenas repetiam a mesma mecânica foram substituídos por comparação direta de estados e saídas.

## Verificações

- Nove etapas determinadas pelo conteúdo, com Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios, seis estados de memória e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Layout responsivo até 320 px e Clínica com seletores restritos.
- Validador específico compila e executa o Java; lint dos arquivos alterados.
