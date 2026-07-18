# Matriz de Cobertura — Aula 051: Arrays Paralelos

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 051 (M1.31)
- **Arquivo original**: `051_M1_31_ARRAYS_PARALELOS_OFICIAL.md`
- **Tema**: Vínculo por Índice e Estrutura de Arrays Paralelos
- **Estado**: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17; exemplo guiado com `Scanner`, persistência normalizada, foco mobile e responsividade adicionados. Validação estática, lint, build e inspeção responsiva aprovados; aprovação do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Vínculo por índice | ✅ | TabelaParalela (Simulador) | ✅ |
| Registro e linha lógica | ✅ | TabelaParalela (Simulador) | ✅ |
| Didática vs Fragilidade | ✅ | PainelFragilidade | ✅ |
| Problema de desalinhamento lógico | ✅ | PainelFragilidade | ✅ |
| Risco de ArrayIndexOutOfBoundsException | ✅ | PainelFragilidade | ✅ |
| Validação de tamanhos iguais | ✅ | LabValidadorTamanhos | ✅ |
| Relatório de pedidos tabular | ✅ | TabelaParalela (Simulador) | ✅ |
| Acumulador: soma total de valores | ✅ | TabelaParalela (Simulador) | ✅ |
| Acumulador condicional: total por status | ✅ | LabOperacoesCondicionais | ✅ |
| Contagem por status | ✅ | LabOperacoesCondicionais | ✅ |
| Busca por cliente (IgnoreCase) | ✅ | LabBuscaAlteracao | ✅ |
| Listar pedidos por status | ✅ | LabBuscaAlteracao | ✅ |
| Alterar status por cliente | ✅ | LabBuscaAlteracao | ✅ |
| Validar registros relacionados (vazio/negativo/invalido) | ✅ | LabValidadorRegistros | ✅ |
| Mensagens de erro detalhadas | ✅ | LabValidadorRegistros | ✅ |
| Domínio: produtos e estoques | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS, atividades e status | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria e tentativas | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria e operações | ✅ | Galeria de Domínios | ✅ |
| Preenchimento de paralelos com Scanner | ✅ | DeliveryLab | ✅ |
| scanner.nextLine() após nextInt()/nextLong() | ✅ | DeliveryLab / Clínica de Erros | ✅ |
| Perigo de ordenação parcial | ✅ | PainelFragilidade / Clínica de Erros | ✅ |
| Preparação de mentalidade para Objetos | ✅ | Introducao / PainelFragilidade | ✅ |
| Erro 1: arrays com tamanhos diferentes | ✅ | Clínica de Erros | ✅ |
| Erro 2: loop com length do array errado | ✅ | Clínica de Erros | ✅ |
| Erro 3: alterar apenas um array | ✅ | Clínica de Erros | ✅ |
| Erro 4: busca e uso de índice sem validar | ✅ | Clínica de Erros | ✅ |
| Erro 5: status sem normalizar | ✅ | Clínica de Erros | ✅ |
| Erro 6: comparar String com == | ✅ | Clínica de Erros | ✅ |
| Erro 7: não validar campos obrigatórios | ✅ | Clínica de Erros | ✅ |
| Erro 8: esquecer nextLine após nextInt/nextLong | ✅ | Clínica de Erros | ✅ |
| Erro 9: achar que é a solução final | ✅ | Clínica de Erros | ✅ |
| Erro 10: falta de documentação do vínculo | ✅ | Clínica de Erros | ✅ |
| Entrega local (27 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: CadastroPedidosParalelos | ✅ | DeliveryLab | ✅ |
| Preenchimento completo com Scanner | ✅ | Exemplo guiado `PreencherPedidosParalelos.java` | ✅ |

## Cobertura: 100% — 36/36 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Tabela Paralela** — Demonstração visual de 3 arrays paralelos (`clientes`, `valoresCentavos`, `statusPedidos`) como uma tabela lógica unificada por índice. Permite simular o percurso e cálculos de soma e contagem.
2. **Painel de Fragilidade & Desalinhamento** — Permite quebrar a relação de índices manualmente para ver como a ordenação parcial ou a falta de alinhamento corrompe a lógica de negócio silenciosamente.
3. **Lab Validador de Tamanhos** — Simula o teste preventivo de consistência de tamanho (`length`) evitando a temida exceção `ArrayIndexOutOfBoundsException`.
4. **Lab de Operações Condicionais** — Sumariza valores e conta ocorrências baseadas em filtros de status específicos.
5. **Lab de Busca e Alteração por Índice** — Faz busca linear pelo cliente e atualiza com segurança o status correspondente usando o mesmo índice.
6. **Lab de Validador de Registros Lógicos** — Valida se os campos cruzados fazem sentido lógico (cliente em branco, valor negativo, status inválido).
7. **Galeria de Domínios** — 4 cenários corporativos ilustrando o uso de arrays paralelos em produtos/estoques, OS/atividades, mensageria, auditoria.
8. **Clínica de 10 Erros** — Análise aprofundada de armadilhas com código, sintoma, causa raiz e resolução.
9. **Entrega & Desafio** — Comandos PowerShell para 27 laboratórios Java locais e o desafio integrado `CadastroPedidosParalelos.java`.
