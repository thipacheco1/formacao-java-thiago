# Matriz de Cobertura — Aula 054: Métodos com Retorno

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 054 (M1.34)
- **Arquivo original**: `054_M1_34_METODOS_COM_RETORNO_OFICIAL.md`
- **Tema**: Declaração, Inicialização e Chamada de Métodos com Retorno (não-void)

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- Reposto o nono domínio prometido (`BuscarClienteMetodoRetorno.java`) e acrescentado um programa completo, compilável e guiado antes do desafio.
- Corrigidos comandos `javac`, explicações do frame de execução, progresso persistido, foco móvel e Clínica de Erros.
- Validador dedicado, compilação Java dos exemplos, lint e build aprovados; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Métodos com retorno (devolve resultado) | ✅ | SimuladorMatematico (Simulador) | ✅ |
| O tipo de retorno na assinatura | ✅ | PainelAnatomia | ✅ |
| O comando return | ✅ | PainelAnatomia | ✅ |
| O que é método com retorno (conceito e chamada) | ✅ | PainelConceito | ✅ |
| Separar cálculo de uso do resultado (flexibilidade) | ✅ | PainelConceito | ✅ |
| Anatomia (public static tipo nome(params)) | ✅ | PainelAnatomia | ✅ |
| O que o return faz (devolve e encerra) | ✅ | PainelAnatomia | ✅ |
| Tipo de retorno e valor devolvido compatíveis | ✅ | PainelAnatomia | ✅ |
| Chamar e usar diretamente vs Guardar em variável | ✅ | SimuladorMatematico | ✅ |
| Diferença entre imprimir (void) e retornar | ✅ | LabComparativo | ✅ |
| Retorno int (quantidades, contadores) | ✅ | LabRetornosTipos | ✅ |
| Retorno long (dinheiro em centavos) | ✅ | LabRetornosTipos | ✅ |
| Retorno double (divisão decimal com cast) | ✅ | LabRetornosTipos | ✅ |
| Retorno boolean (pergunta sim/não) | ✅ | LabRetornosTipos | ✅ |
| Nome bom para método boolean (isStatusValido, etc) | ✅ | LabRetornosTipos | ✅ |
| Retorno String (devolução de textos) | ✅ | LabRetornosTipos | ✅ |
| Múltiplos returns (if/else ou sequenciais) | ✅ | LabRetornosTipos | ✅ |
| Todo caminho precisa retornar (exigência de compilação) | ✅ | LabRetornosTipos / Clínica de Erros | ✅ |
| Return em if/else | ✅ | LabRetornosTipos | ✅ |
| Return antecipado (guard clause para inputs invalidos) | ✅ | LabRetornosTipos | ✅ |
| Método puro (sem efeitos colaterais ou console) | ✅ | PainelConceito | ✅ |
| Método que calcula não deve imprimir | ✅ | PainelConceito | ✅ |
| Calcular total de array (int[]) | ✅ | LabOperacoesArrays | ✅ |
| Calcular média de array (double/int[]) | ✅ | LabOperacoesArrays | ✅ |
| Encontrar maior valor do array (valores[0]) | ✅ | LabOperacoesArrays | ✅ |
| Buscar índice em array (retornando -1) | ✅ | LabOperacoesArrays | ✅ |
| Por que retornar -1 em busca (sentinela) | ✅ | LabOperacoesArrays | ✅ |
| Validar status de String (trim().toUpperCase()) | ✅ | LabValidadorRegras | ✅ |
| Normalizar String (trim().toUpperCase() e null) | ✅ | LabValidadorRegras | ✅ |
| Domínio: pedido (total e média de array) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamento (validação e cálculo parcela) | ✅ | Galeria de Domínios | ✅ |
| Domínio: produto e estoque (disponibilidade e baixa) | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS (pode concluir com atividades zeradas) | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria (deve enviar mensagem) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria (descrição legível da operação) | ✅ | Galeria de Domínios | ✅ |
| Domínio: arrays paralelos (calcular total aprovado) | ✅ | Galeria de Domínios | ✅ |
| Domínio: buscar cliente (equalsIgnoreCase) | ✅ | Galeria de Domínios | ✅ |
| Domínio: total de matriz (int[][]) | ✅ | Galeria de Domínios | ✅ |
| Erro 1: esquecer o return | ✅ | Clínica de Erros | ✅ |
| Erro 2: retornar tipo errado | ✅ | Clínica de Erros | ✅ |
| Erro 3: nem todo caminho retorna | ✅ | Clínica de Erros | ✅ |
| Erro 4: retornar valor em void | ✅ | Clínica de Erros | ✅ |
| Erro 5: ignorar o retorno na chamada | ✅ | Clínica de Erros | ✅ |
| Erro 6: imprimir dentro de método de cálculo | ✅ | Clínica de Erros | ✅ |
| Erro 7: usar retorno boolean com nome confuso | ✅ | Clínica de Erros | ✅ |
| Erro 8: retornar 0 para erro silenciosamente | ✅ | Clínica de Erros | ✅ |
| Erro 9: confundir parâmetro com retorno | ✅ | Clínica de Erros | ✅ |
| Erro 10: código inacessível após o return | ✅ | Clínica de Erros | ✅ |
| Entrega local (29 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: RelatorioVendasComMetodos | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 50/50 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Métodos Matemáticos** — Avalia dinamicamente a execução de cálculos matemáticos com e sem variáveis auxiliares. Permite inspecionar a entrada (argumentos), o cálculo interno e a entrega do valor de retorno.
2. **Painel de Anatomia do Método com Retorno** — Explica detalhadamente as partes da assinatura do método e realça o comando `return` com tooltips.
3. **Lab de Comparativo (Imprimir vs Retornar)** — Permite que o usuário compare de forma visual o efeito de imprimir dados na tela (void) contra a devolução de valor (retorno).
4. **Lab de Tipos de Retorno** — Demonstra diferentes tipos em ação (`int`, `long`, `double`, `boolean`, `String`), os múltiplos returns, returns em if/else e return antecipado.
5. **Lab de Operações com Arrays** — Demonstra cálculos estruturados e buscas lineares retornando a sentinela `-1` quando não encontrado.
6. **Lab de Validador de Regras & Normalização** — Valida status aplicando tratamentos defensivos contra nulos e espaços externos.
7. **Galeria de Domínios** — 9 cenários práticos (pedidos, pagamentos, estoque, OS, mensageria, auditoria, arrays paralelos, clientes, matrizes).
8. **Clínica de 10 Erros** — Compêndio de falhas, sintomas e correções sobre métodos com retorno.
9. **Entrega & Desafio** — Comandos PowerShell para criar 29 arquivos Java locais e o desafio integrado `RelatorioVendasComMetodos.java`.
