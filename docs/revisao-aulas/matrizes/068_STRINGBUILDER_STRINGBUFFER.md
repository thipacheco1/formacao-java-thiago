# Matriz de cobertura — Aula 068

- Original: `068_M2_07_STRINGBUILDER_E_STRINGBUFFER_OFICIAL.md`
- Componente: `GuidedStringBuilderLesson068.jsx`
- Cobertura: 100%
- Arquétipo: oficina interativa de mutabilidade textual, operações por índice, capacidade, concorrência, relatórios, clínica e entrega.

## Transformação

O aluno manipula um único builder, observa sua identidade permanecer enquanto o conteúdo cresce, edita intervalos com índices visíveis, simula capacidade, compara escopos concorrentes e monta um relatório por métodos auxiliares antes de escrever o programa completo.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| String versus StringBuilder | Builder Mutável | Um objeto B1 acumula partes sem reatribuição |
| Mutabilidade | Builder Mutável | Histórico de append preserva a mesma identidade |
| O que é StringBuilder | Builder Mutável + entrega | Construção progressiva e `toString` final |
| O que é StringBuffer | Builder ou Buffer | Comparador de estruturas mutáveis sincronizada/não sincronizada |
| Thread-safety introdutória | Builder ou Buffer | Threads A/B e três escopos alternáveis |
| append básico | Builder Mutável | Botões aplicam partes ao conteúdo real |
| append de vários tipos | Append e toString | String, int, long, double, boolean e char |
| append encadeado | Append e toString | Código completo com cadeia legível |
| StringBuilder em loop | Relatório + entrega | Linhas repetidas no mesmo builder |
| Refatoração de concatenação | Builder Mutável + relatório | Intenção de montagem progressiva substitui resultados imutáveis |
| insert | Edição por Índices | Prefixo inserido antes do índice zero |
| delete | Edição por Índices | Faixa com início inclusivo e fim exclusivo |
| replace | Edição por Índices | PENDENTE substituído por APROVADO |
| reverse | Edição por Índices | Conteúdo invertido no mesmo objeto |
| setLength | Edição + programa | Limpeza e reuso consciente |
| length e capacity | Length e Capacity | Medidor separa caracteres usados e reserva interna |
| Capacidade inicial | Length e Capacity + programa | Alternância entre 16 e 64 e uso real de 64 |
| StringBuilder versus StringBuffer | Builder ou Buffer | Tabela visual de sincronização, escopo e recomendação |
| Builder global | Builder ou Buffer + Clínica | Cenário static mostra mistura e disputa de estado |
| Relatório de pedidos | Relatório por Partes | Cabeçalho, dois pedidos e slot null |
| Produto | Montagem no Backend | Texto, número e boolean por linha |
| Pagamento | Montagem no Backend | Resumo pequeno com decisão explícita |
| Ordem de serviço | Montagem no Backend + desafio | Validação, resumo e relatório condicional |
| Mensageria | Montagem no Backend | Texto por parágrafos e condicionais |
| Auditoria | Montagem no Backend | Muitas linhas sem builder global |
| Métodos auxiliares | Relatório por Partes + programa | `adicionarLinha` anuncia mutação intencional |
| Quando não usar StringBuilder | Montagem no Backend + Clínica | Critério preserva `+` em linha simples |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos acompanham B1, length e String final |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo e onze linhas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e checklist |
| Limites curriculares | Builder ou Buffer | Não aprofunda concorrência, locks, benchmark, logging ou templates |

## Consolidação sem perda

Os exemplos repetitivos foram consolidados em um builder manipulável, seis tipos de append, cinco edições, um simulador de capacidade, três escopos concorrentes, cinco passos de relatório, seis domínios, dez diagnósticos e um programa integrado. Todos os comportamentos únicos permanecem praticáveis.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.

