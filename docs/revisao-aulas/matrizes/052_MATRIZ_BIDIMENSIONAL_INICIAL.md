# Matriz de Cobertura — Aula 052: Matriz Bidimensional Inicial

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 052 (M1.32)
- **Arquivo original**: `052_M1_32_MATRIZ_BIDIMENSIONAL_INICIAL_OFICIAL.md`
- **Tema**: Declaração, Inicialização e Percurso de Matrizes Bidimensionais
- **Estado**: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17; exemplo guiado de leitura matricial com `Scanner`, persistência normalizada, foco mobile e responsividade adicionados. Validação estática, lint, build e inspeção responsiva aprovados; aprovação do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Matriz bidimensional e array de arrays | ✅ | GridMatriz (Simulador) | ✅ |
| Linha e coluna (conceito e representação) | ✅ | GridMatriz (Simulador) | ✅ |
| Célula (matriz[linha][coluna]) | ✅ | GridMatriz (Simulador) | ✅ |
| Declaração (int[][], double[][], long[][], String[][]) | ✅ | PainelDeclaracao | ✅ |
| Inicialização com valores conhecidos | ✅ | GridMatriz / PainelDeclaracao | ✅ |
| Inicialização com new int[linhas][colunas] | ✅ | GridMatriz / PainelDeclaracao | ✅ |
| matriz.length (linhas) | ✅ | LabPropriedades | ✅ |
| matriz[linha].length (colunas) | ✅ | LabPropriedades | ✅ |
| Percorrer com laços aninhados (for externo/interno) | ✅ | GridMatriz / LabPropriedades | ✅ |
| Exibição formatada em tabela | ✅ | GridMatriz | ✅ |
| Preenchimento manual de célula | ✅ | LabOperacoes | ✅ |
| Preenchimento com cálculo (linha + coluna) | ✅ | LabOperacoes | ✅ |
| Somar todos os elementos da matriz | ✅ | LabOperacoes | ✅ |
| Média dos elementos | ✅ | LabOperacoes | ✅ |
| Maior e menor na matriz (matriz[0][0]) | ✅ | LabOperacoes | ✅ |
| Somar por linha | ✅ | LabOperacoes | ✅ |
| Somar por coluna | ✅ | LabOperacoes | ✅ |
| Matriz retangular (todas as linhas com mesmo num de colunas) | ✅ | Introducao / LabPropriedades | ✅ |
| Matriz irregular (exemplo conceitual) | ✅ | LabPropriedades | ✅ |
| Buscar valor em matriz (com 2 breaks) | ✅ | LabBuscaAlteracao | ✅ |
| Alterar valor em matriz | ✅ | LabBuscaAlteracao | ✅ |
| Validar linha e coluna (curto-circuito) | ✅ | LabValidador | ✅ |
| Domínio: notas de alunos por bimestre | ✅ | Galeria de Domínios | ✅ |
| Domínio: produtos por mês | ✅ | Galeria de Domínios | ✅ |
| Domínio: pedidos por status e mês | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS e atividades marcadas | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamentos por parcela (long centavos) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria por dia e operação | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria por dia e tipo | ✅ | Galeria de Domínios | ✅ |
| Erro 1: confundir linha e coluna | ✅ | Clínica de Erros | ✅ |
| Erro 2: usar matriz.length para colunas | ✅ | Clínica de Erros | ✅ |
| Erro 3: usar <= em vez de < | ✅ | Clínica de Erros | ✅ |
| Erro 4: não quebrar linha na exibição | ✅ | Clínica de Erros | ✅ |
| Erro 5: acessar matriz[0][0] em matriz vazia | ✅ | Clínica de Erros | ✅ |
| Erro 6: somar índice em vez de valor | ✅ | Clínica de Erros | ✅ |
| Erro 7: validar coluna antes de validar linha | ✅ | Clínica de Erros | ✅ |
| Erro 8: esquecer que é array de arrays | ✅ | Clínica de Erros | ✅ |
| Erro 9: usar nomes ruins (i, j) em cenários complexos | ✅ | Clínica de Erros | ✅ |
| Erro 10: usar matriz sem necessidade | ✅ | Clínica de Erros | ✅ |
| Entrega local (25 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: RelatorioVendasMatriz | ✅ | DeliveryLab | ✅ |
| Leitura da matriz com Scanner e posições amigáveis | ✅ | Exemplo guiado `LerMatrizConsole.java` | ✅ |

## Cobertura: 100% — 42/42 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Grid Matriz** — Renderizador visual de uma matriz retangular 2x3. Demonstra o percurso aninhado passo a passo, exibindo os loops externo (linhas) e interno (colunas).
2. **Painel de Propriedades da Matriz** — Compara e visualiza dinamicamente as propriedades `matriz.length` e `matriz[linha].length` em matrizes retangulares e irregulares.
3. **Lab de Operações Básicas** — Calcula soma, média, maior, menor e realiza preenchimentos (manual, com cálculo `linha + coluna` e soma por linhas/colunas).
4. **Lab de Busca e Escrita** — Permite buscar valores com indicação de coordenadas e alterar células específicas em tempo real.
5. **Lab de Validador de Coordenadas** — Exibe o teste preventivo de segurança garantindo que a linha seja validada antes da coluna.
6. **Galeria de Domínios** — 7 cenários práticos (bimestres, vendas, status de pedidos, OS/atividades, parcelas, auditoria, mensageria).
7. **Clínica de 10 Erros** — Análise completa de falhas comuns com matrizes e resoluções.
8. **Entrega & Desafio** — Comandos PowerShell para 25 laboratórios Java locais e o desafio integrado `RelatorioVendasMatriz.java`.
