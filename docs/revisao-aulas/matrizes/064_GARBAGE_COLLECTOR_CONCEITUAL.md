# Matriz de cobertura — Aula 064

- Original: `064_M2_03_GARBAGE_COLLECTOR_CONCEITUAL_OFICIAL.md`
- Componente: `GuidedGarbageCollectorLesson064.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de alcançabilidade, elegibilidade, retenção, pressão, recursos externos, clínica e entrega.

## Transformação

O aluno deixa de imaginar o GC como “faxineiro que entende objetos inúteis” e passa a investigar caminhos de referência, políticas de retenção e evidências. Ele controla quando referências desaparecem; a JVM controla quando objetos elegíveis são coletados.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| GC, heap, referência ativa, alcançável e elegível | Mapa de Alcançabilidade | Grafo interativo de raízes/frames até objetos simbólicos |
| Escopo encerrado | Mapa de Alcançabilidade | Pedido A sem caminho após fim do frame |
| Objeto retornado | Mapa de Alcançabilidade | `main.pedido → B` mantém B alcançável |
| Referência sobrescrita | Mapa de Alcançabilidade | Cliente C perde caminho quando variável passa para D |
| `null` removendo referência | Mapa de Alcançabilidade | Objeto E elegível, com ressalva contra anular tudo |
| Campo estático retendo | Mapa e clínica | Raiz `Main.ultimoPedido → F` mantém F vivo |
| Elegível não significa coletado imediatamente | Elegível ≠ Coletado | Linha de cinco estados separa remoção, elegibilidade, decisão e recuperação |
| `System.gc()` | Elegível ≠ Coletado | Comparador mostra solicitação sem garantia nem uso em regra |
| Por que GC existe e limites do automático | Mapa + clínica | Alcançabilidade automática não substitui desenho de ciclo de vida |
| Vazamento em Java | Retenção e Limites | Cache sem limite mantém referências úteis para JVM e inúteis para negócio |
| Array, fila, histórico e cache | Retenção e Limites | Simulador adiciona, consome, limita e remove referências |
| Capacidade, expiração, remoção e persistência | Retenção e Limites | Política explicitada como decisão profissional |
| Objetos temporários versus retidos | Pressão e Sintomas | Medidor separa alocados, retidos e elegíveis |
| Sintomas de leak | Pressão e Sintomas | Memória crescente, pausas, latência e reinícios orientam investigação |
| OutOfMemoryError conceitual | Pressão e Sintomas | Cenário seguro, sem provocar exaustão real |
| Heap pequeno, carga, retenção e configuração | Pressão e clínica | Diagnóstico exige causa, não apenas aumentar memória |
| `Runtime.totalMemory/freeMemory` | Runtime Didático | Código destacado e três limites de interpretação |
| Números variáveis e ausência de prova exata | Runtime Didático | Fotografia não é benchmark nem confirmação do coletor |
| GC versus recurso externo | Memória e Recursos | Comparador de objeto, arquivo, conexão e socket |
| Fechamento determinístico | Memória e Recursos | Responsabilidade indicada sem antecipar try-with-resources profundo |
| Pedido, Produto, Pagamento, OS, Mensagem e Auditoria | Ciclo de Vida Backend | Galeria com seis políticas concretas |
| Objeto desnecessário | Pagamento + clínica | Cálculo por parâmetros/retorno substitui estrutura temporária sem valor |
| Sobrescrita de última OS | Domínio + programa | OS-001 perde raiz quando OS-002 é armazenada |
| Fila remove item processado | Domínio + programa + debug | `fila[0] = null` antes/depois |
| Auditoria não deve ficar eternamente em memória | Domínios | Persistência adequada substitui retenção indefinida |
| Dez erros comuns | Clínica de Erros | Dez casos independentes com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos provam remoção da referência, não coleta |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo, compilável, com seis saídas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e checklist de dez provas |
| Transferência | Desafio da fila | Capacidade quatro, consumo, substituição e explicação de alcançabilidade |
| Limites curriculares | Toda a aula | Não antecipa G1, ZGC, Shenandoah, tuning, logs ou profiler avançado |

## Consolidação sem perda

Os exemplos repetitivos do original foram consolidados em cinco cenários de alcançabilidade, um simulador de retenção, três perfis de pressão, seis domínios e um programa integrado. Todos os comportamentos únicos continuam observáveis sem transformar a prática em vinte arquivos quase idênticos.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.
